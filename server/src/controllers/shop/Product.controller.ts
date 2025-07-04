import { NextFunction, Request, RequestHandler, Response } from "express";
import Product from "../../model/Product";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { redisClient } from "../../server";

// Type-safe query interface
interface ProductFilterQuery {
  category?: string | string[];
  brand?: string | string[];
  sortBy?: string;
  page?: string;
  limit?: string;
}

export const getFilteredProduct: RequestHandler = async (
  req: Request<{}, {}, {}, ProductFilterQuery>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;

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

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filters);

    const product = await Product.find({ ...filters, list: true })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "All the products",
      data: product,
      totalPage: Math.ceil(total / limit),
      currentpage: page,
      limit,
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

export const relatedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const findProduct = await Product.findById(productId);

    if (!findProduct) {
      throw new ErrorHandler("Producrt not found", 404, false);
    }

    const filter = {
      _id: { $ne: productId },
      brand: findProduct.brand,
      category: findProduct.category,
    };

    const total = await Product.countDocuments(filter);
    const relatedProducts = await Product.find(filter).skip(skip).limit(limit);

    if (relatedProducts.length === 0) {
      throw new ErrorHandler("Product with same brands not found", 404, false);
    }

    res.status(200).json({
      total,
      currentPage: page,
      limit,
      totalPage: Math.ceil(total / limit),
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};
