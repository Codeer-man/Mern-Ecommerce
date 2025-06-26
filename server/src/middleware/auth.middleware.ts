import { RequestHandler } from "express";
import { NOT_FOUND, UNAUTHORIZED } from "../constants/http";
import { ErrorHandler } from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserById } from "../services/auth.service";

interface jwtPayload {
  id: string;
  email: string;
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", " ").trim();
  // const authHeader = req.header("Authorization");
  // const tokenFromHeader = authHeader?.startsWith("Bearer ")
  //   ? authHeader.split(" ")[1]
  //   : undefined;

  // const token = tokenFromHeader;

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

    (req as any).id = user.id;
    (req as any).user = user;

    next();
  } catch (error) {
    console.error(error, "invalid server");
    next(error);
  }
};
