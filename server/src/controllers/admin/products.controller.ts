import { NextFunction, Request, Response } from "express";
import {
  deleteFromCloudinary,
  imageUploadUtil,
} from "../../helpers/upload-cloudinary";
import { ErrorHandler } from "../../utils/ErrorHandler";
import Product from "../../model/Product";

export const handleImageUpload = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      throw new ErrorHandler("No file uploaded", 400, false);
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

// add a product
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      image,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      list,
      publicId,
    } = req.body;

    if (
      !title ||
      !image ||
      !description ||
      !category ||
      !brand ||
      !price ||
      !salePrice ||
      !totalStock
    ) {
      throw new ErrorHandler("Please fill all the field", 400, false);
    }
    console.log(image);

    const newProduct = new Product({
      title,
      description,
      image,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      publicId,
      list,
    });

    await newProduct.save();

    res.status(200).json({
      success: true,
      message: "New procduct has been created",
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// fetch all product
export const fetchallProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const listOfProduct = await Product.find();
    res.status(200).json({
      sucess: true,
      message: "All Product has been fetched",
      data: listOfProduct,
    });
  } catch (error) {
    next(error);
  }
};

// edit a product
export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      image,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    let findTheProduct = await Product.findById(id);
    if (!findTheProduct) {
      throw new ErrorHandler("Product not found", 404, false);
    }

    findTheProduct.title = title || findTheProduct.title;
    findTheProduct.description = description || findTheProduct.description;
    findTheProduct.brand = brand || findTheProduct.brand;
    findTheProduct.category = category || findTheProduct.category;
    findTheProduct.image = image || findTheProduct.image;
    findTheProduct.price = price === "" ? 0 : price || findTheProduct.price;
    findTheProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findTheProduct.salePrice;
    findTheProduct.totalStock = totalStock || findTheProduct.totalStock;

    await findTheProduct.save();
    res.status(200).json({
      success: true,
      message: "Product has been updated",
      data: findTheProduct,
    });
  } catch (error) {
    next(error);
  }
};

// delete a product
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const delProduct = await Product.findByIdAndDelete(id);

    if (!delProduct) {
      throw new ErrorHandler("Product not found", 404, false);
    }
    await deleteFromCloudinary(delProduct.publicId);

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateLabel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { list } = req.body;
    const updateLabel = await Product.findByIdAndUpdate(
      id,
      { list },
      { new: true }
    );
    res.status(200).json({
      message: "Product label updated successfully.",
      product: updateLabel,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
