import { RequestHandler } from "express";
import { NOT_FOUND, UNAUTHORIZED } from "../constants/http";
import { ErrorHandler } from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserById } from "../services/auth.Services";

interface jwtPayload {
  id: string;
  email: string;
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", " ").trim();

  if (!token) {
    throw new ErrorHandler("Token not received", UNAUTHORIZED, false);
  }

  try {
    if (!process.env.JWT_ACCESS_TOKEN) {
      throw new ErrorHandler(
        "environment variable is missing",
        NOT_FOUND,
        false
      );
    }

    const decode = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN
    ) as JwtPayload;

    const user = await findUserById(decode.id).select("-password");

    if (!user) {
      throw new ErrorHandler("user data not found", 404, false);
    }
    console.log(user);

    (req as any).id = user.id;
    (req as any).user = user;

    next();
  } catch (error) {
    next(error);
  }
};
