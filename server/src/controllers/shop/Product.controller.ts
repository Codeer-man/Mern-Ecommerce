import { RequestHandler } from "express";
import Product from "../../model/Product";

export const getFilteredProduct: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const product = await Product.find({});
    res
      .status(200)
      .json({ success: true, message: "All The products", data: product });
  } catch (error) {
    next(error);
  }
};
