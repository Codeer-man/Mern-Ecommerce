import { NextFunction, Request, Response } from "express";
import Review from "../../model/review";
import { ErrorHandler } from "../../utils/ErrorHandler";

export const getAllReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const total = await Review.countDocuments();

    const allReview = await Review.find()
      .sort({ createdAt: -1 })
      .populate("productId")
      .populate("userId", "-password")
      .skip(skip)
      .limit(limit);

    if (!allReview) {
      throw new ErrorHandler("Review not found", 404, false);
    }

    res.status(200).json({
      success: true,
      message: "All review found",
      data: allReview,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const replyProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    const findReview = await Review.findById(reviewId);

    if (!findReview) {
      throw new ErrorHandler("cannot find the review", 404, false);
    }

    findReview.reply = reply;

    await findReview.save();

    res.status(200).json({
      success: true,
      message: "Reply submitted",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
