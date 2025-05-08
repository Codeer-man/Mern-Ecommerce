import { NextFunction, Request, RequestHandler, Response } from "express";
import Product from "../../model/Product";
import { ErrorHandler } from "../../utils/ErrorHandler";

// Type-safe query interface
interface ProductFilterQuery {
  category?: string | string[];
  brand?: string | string[];
  sortBy?: string;
}

export const getFilteredProduct: RequestHandler = async (
  req: Request<{}, {}, {}, ProductFilterQuery>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    const filters: Record<string, any> = {};

    // Normalize to array
    const categoryArray = Array.isArray(category)
      ? category
      : category.split(",");
    const brandArray = Array.isArray(brand) ? brand : brand.split(",");

    if (categoryArray.length > 0 && categoryArray[0] !== "") {
      filters.category = { $in: categoryArray };
    }

    if (brandArray.length > 0 && brandArray[0] !== "") {
      filters.brand = { $in: brandArray };
    }

    const sort: Record<string, 1 | -1> = {};

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
      message: "All the products",
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

    res.status(200).json({
      message: "Product detail",
      success: true,
      data: find,
    });
  } catch (error) {
    next(error);
  }
};
