import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
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
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      throw new ErrorHandler("No file uploaded", 400, false);
    }

    const files = req.files as Express.Multer.File[];

    let uploadedImages = [];
    
    for (const file of files) {
      const base64 = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        resource_type: "image",
      });

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    res.json({
      success: true,
      images: uploadedImages,
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
    const limit = parseInt(req.query.limit as string) || 12;
    const page = parseInt(req.query.page as string) || 1;

    const total = await Product.countDocuments();
    const skip = (page - 1) * limit;

    const listOfProduct = await Product.find().skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      message: "All Product has been fetched",
      data: listOfProduct,
      limit,
      totalPage: Math.ceil(total / limit),
      currentPage: page,
      totalItem: total,
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
// export const deleteProduct = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const delProduct = await Product.findByIdAndDelete(id);

//     if (!delProduct) {
//       throw new ErrorHandler("Product not found", 404, false);
//     }
//     await deleteFromCloudinary(delProduct.publicId);

//     res.status(200).json({ success: true, message: "Product deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

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
