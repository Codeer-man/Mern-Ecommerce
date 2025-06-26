import { NextFunction, Request, Response } from "express";

import User from "../../model/User";
import {
  compareEmailAndUserName,
  findUserById,
} from "../../services/auth.service";
import { CREATED, NOT_FOUND, UNAUTHORIZED } from "../../constants/http";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { tokenGenerate } from "../../utils/tokenGenerator";
import jwt from "jsonwebtoken";

export const authRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, password } = req.body;

    if (!email || !password || !username) {
      throw new ErrorHandler("All the feilds are required", 500, false);
    }

    const userExist = await compareEmailAndUserName(username, email);

    if (userExist) {
      throw new ErrorHandler("Username or email already exists", 400, false);
    }

    const CreateUser = new User({
      username,
      email,
      password,
      role: "user",
    });

    await CreateUser.save();

    res.status(CREATED).json({
      sucess: true,
      message: "New user has been created",
      data: CreateUser,
    });
  } catch (error) {
    next(error);
  }
};

export const authLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, password } = req.body;

    if (!username || !password) {
      throw new ErrorHandler("All the fields should be filled", 404, false);
    }

    const findUser = await compareEmailAndUserName(username, email);

    if (!findUser) {
      throw new ErrorHandler("User not found", 401, false);
    }

    const comparePwd = await findUser.comparePassword(password);

    if (!comparePwd) {
      throw new ErrorHandler("Password did not match", UNAUTHORIZED, false);
    }

    const { accessToken, refreshAccessToken } = tokenGenerate({
      id: findUser._id.toString(),
      email: findUser.email,
      role: findUser.role,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });
    // res.cookie("refreshToken", refreshAccessToken, {
    //   httpOnly: false,
    //   secure: true,
    //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    // });

    res.status(200).json({
      success: true,
      message: "User logged in",
      data: findUser,
      token: accessToken,
      user: {
        id: findUser._id.toString(),
        email: findUser.email,
        role: findUser.role,
        username: findUser.username,
      },
      // refreshAccessToken: refreshAccessToken,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const GetUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const User = (req as any).user;

    if (!User) {
      throw new ErrorHandler("User not found in the controller ", 401, false);
    }

    res.status(200).json({ sucess: false, message: "User found", data: User });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies.refreshAccessToken ||
      req.header("Authorization")?.replace("Bearer", " ").trim();

    if (!token) {
      throw new ErrorHandler("token not received", 404, false);
    }

    if (!process.env.JWT_REFRESH_TOKEN) {
      throw new ErrorHandler("envirnment variable not found", 404, false);
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN) as {
      id: string;
      email: string;
    };

    if (!decoded) {
      throw new ErrorHandler("Invalid token", 404, false);
    }

    const findUser = await findUserById(decoded.id);

    if (!findUser) {
      throw new ErrorHandler("userdata not found", UNAUTHORIZED, false);
    }

    const accessToken = tokenGenerate({
      id: findUser.id.toString(),
      email: findUser.email,
      role: findUser.role,
    });

    const options = {
      httponly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    };

    res.clearCookie("accessToken", options);

    res.status(200).cookie("accessToken", accessToken, options).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
