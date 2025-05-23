import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../utils/ErrorHandler";
import Product from "../../model/Product";

export const searchProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      throw new ErrorHandler(
        "keyvoard is required and must be string format ",
        404,
        false
      );
    }

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    const searchResult = await Product.find({
      ...createSearchQuery,
      list: true,
    });

    res
      .status(200)
      .json({ success: true, message: "Product found", data: searchResult });
  } catch (error) {
    next(error);
  }
};
