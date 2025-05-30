import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../utils/ErrorHandler";
import User from "../../model/User";
import { sendVerificationCode } from "../../utils/send-email";

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ErrorHandler("User id is required", 404, false);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler("User does not exists", 402, false);
    }

    const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();
    user.verificationCode = verifyCode;
    await user.save();

    await sendVerificationCode({
      email: user.email,
      verificationCode: verifyCode,
    });
    res
      .status(201)
      .json({ success: true, message: "verifi code send", verifyCode });
  } catch (error) {
    next(error);
  }
};

export const checkVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { code } = req.body;

    if (!userId) {
      throw new ErrorHandler("User ID is required", 400, false);
    }

    if (!code) {
      throw new ErrorHandler("Verification code is required", 400, false);
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ErrorHandler("User does not exist", 404, false);
    }

    if (user.verificationCode === code) {
      user.emailVerify = true;
      user.verificationCode = "";
      await user.save();

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: "Incorrect verification code. Please try again.",
    });
  } catch (error) {
    next(error);
  }
};
