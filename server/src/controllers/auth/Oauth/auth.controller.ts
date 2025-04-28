import express, { CookieOptions, RequestHandler } from "express";
import User from "../../../model/User";
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { google } from "../../../lib/oauth/google";
import { ErrorHandler } from "../../../utils/ErrorHandler";
import { getUserWithOauthId } from "../../../services/Oauth.service";

export const getGoogleLoginPage: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    // if (req.user) {
    //   return res.redirect("/");
    // }

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, [
      "openid",
      "profile",
      "email",
    ]);

    const OAUTH_EXCHANGE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

    const cookieConfig: CookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: OAUTH_EXCHANGE_EXPIRY,
      sameSite: "lax",
    };

    res.cookie("google_auth_state", state, cookieConfig);
    res.cookie("google_auth_verifier", codeVerifier, cookieConfig);

    res.redirect(url.toString());
  } catch (error) {
    next(error);
  }
};

export const getGoogleLoginCallback: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { code, state } = req.query;

    const {
      google_auth_state: storeState,
      google_auth_verifier: codeVerifier,
    } = req.cookies;

    if (
      !code ||
      !state ||
      !storeState ||
      !codeVerifier ||
      state !== storeState
    ) {
      throw new ErrorHandler(
        "Could not login with Google because of an invalid login attempt. Please try again!",
        400,
        false
      );
    }

    const token = await google.validateAuthorizationCode(
      code as string,
      codeVerifier
    );
    if (!token) {
      throw new ErrorHandler(
        "Could not login with Google because of an invalid login attempt. Please try again!",
        400,
        false
      );
    }

    interface GoogleIdTokenClaims {
      sub: string; // google user id
      name: string;
      email: string;
      picture?: string;
    }

    const claims = decodeIdToken(token.idToken()) as GoogleIdTokenClaims;
    const { sub: googleUserId, name, email } = claims;

    if (!email) {
      throw new ErrorHandler(
        "Google did not return an email address.",
        400,
        false
      );
    }

    // Call helper function to find or create user
    const { user, accessToken, refreshAccessToken } = await getUserWithOauthId({
      provider: "google",
      email,
      username: name,
      oauthId: googleUserId,
    });

    if (!user) {
      throw new ErrorHandler("Failed to login with Google.", 400, false);
    }

    res.status(200).json({
      success: true,
      message: "Login Success",
      user,
      accessToken,
      refreshAccessToken,
    });
  } catch (error) {
    next(error);
  }
};
