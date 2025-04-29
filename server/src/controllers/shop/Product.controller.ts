import { NextFunction, Request, RequestHandler, Response } from "express";
import Product from "../../model/Product";
import { ErrorHandler } from "../../utils/ErrorHandler";

export const getFilteredProduct: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

    const product = await Product.find(filters).sort(sort);
    res.status(200).json({
      success: true,
      message: "All The products",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const find = await Product.findById(id);
    if (!find) {
      throw new ErrorHandler("Product detail not found", 404, false);
    }

    res.status(200).json({ message: "Product detail", success: true, find });
  } catch (error) {
    next(error);
  }
};
