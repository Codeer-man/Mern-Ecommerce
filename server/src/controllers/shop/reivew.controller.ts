import { NextFunction, Request, Response } from "express";
import Order from "../../model/order";
import { ErrorHandler } from "../../utils/ErrorHandler";
import Review from "../../model/review";
import Product from "../../model/Product";

export const createProductReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    const order = await Order.findOne({
      userId: userId,
      "cartItems.productId": productId,
      oderstatus: { $in: ["delivered"] },
    });

    if (!order) {
      throw new ErrorHandler(
        "You need to purchase the product before reviewing it",
        403,
        false
      );
    }

    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      throw new ErrorHandler("You already reviewed the product", 400, false);
    }

    const newReview = new Review({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });
    await newReview.save();

    const review = await Review.find({ productId });
    const totalReviewlength = review.length;
    const averageReview =
      review.reduce((sum, itemsReview) => sum + itemsReview.reviewValue, 0) /
      totalReviewlength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      message: "Review added",
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;

    const data = await Review.find({ productId: productId });

    if (data.length === 0) {
      throw new ErrorHandler("No review Present", 404, false);
    }
    console.log(data);

    res.status(200).json({
      success: true,
      message: "review data",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, productId } = req.body;

    const findUserReview = await Review.findOne({ productId, userId });

    if (!findUserReview) {
      throw new ErrorHandler("Review not found", 404, false);
    }

    res.status(200).json({
      success: true,
      message: "Got user review",
      data: findUserReview,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      throw new ErrorHandler("Review not found", 404, false);
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({
      success: true,
      message: "Your review has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const { reviewMessage, reviewValue } = req.body;
    if (!reviewId) {
      throw new ErrorHandler("Review not found", 404, false);
    }

    const editReview = await Review.findById(reviewId);

    if (!editReview) {
      throw new ErrorHandler("Reciew not found", 404, false);
    }

    editReview.reviewMessage = reviewMessage || editReview.reviewMessage;
    editReview.reviewValue = reviewValue || editReview.reviewValue;

    await editReview.save();

    res.status(200).json({
      success: true,
      message: "Your review has been updated",
    });
  } catch (error) {
    next(error);
  }
};

