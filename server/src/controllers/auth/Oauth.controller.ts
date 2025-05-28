import { NextFunction, Request, Response } from "express";
import User from "../../model/User";
import { tokenGenerate } from "../../utils/tokenGenerator";

export const Oauth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { googleId, username, email, avatar, provider, phoneNumber } =
      req.body;

    let user = await User.findOne({ email: email });

    if (!user) {
      const newluCreatedUser = new User({
        username,
        email,
        googleId,
        avatar,
        provider,
        phoneNumber,
      });
      await newluCreatedUser.save();
      user = newluCreatedUser;
    }

    // user = user.toObject({ getters: true });

    const { accessToken, refreshAccessToken } = tokenGenerate({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshAccessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      message: "User logged in",
      data: user,
      accessToken,
      refreshAccessToken,
    });
  } catch (error) {
    next(error);
  }
};
