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
      oderstatus: { $in: ["confirmed", "delivered"] },
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
