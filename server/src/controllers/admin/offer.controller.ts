import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../utils/ErrorHandler";
import Offer from "../../model/offer";
import Product from "../../model/Product";

export const CreateOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, tags, discountPercentage, productId } = req.body;

    if (!name || !tags || !discountPercentage) {
      throw new ErrorHandler("please fill all the feilds", 404, false);
    }

    const createOffer = await Offer.create({
      name,
      tags,
      discountPercentage,
      productId,
    });

    const products = await Product.find({ _id: { $in: productId } });
    const discount = Number(discountPercentage);

    for (let product of products) {
      const discountAmount = product.price - (product.price * discount) / 100;

      product.salePrice = discountAmount;
      if (!product.tags.includes(tags)) {
        product.tags.push(tags);
      }

      await product.save();
    }

    res.status(201).json({ success: true, message: createOffer });
  } catch (error) {
    next(error);
  }
};

export const updateOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, tags, discountPercentage } = req.body;
    const { offerId } = req.params;

    const findOffer = await Offer.findById(offerId);

    if (!findOffer) {
      throw new ErrorHandler("offer not found", 404, false);
    }

    const findProduct = await Product.find({
      _id: { $in: findOffer.productId },
    });

    for (let product of findProduct) {
      if (tags !== undefined) {
        const index = product.tags.findIndex((tag) => tag === findOffer.tags);

        if (index !== -1 && tags) {
          product.tags[index] = tags;
        }
      }

      if (discountPercentage !== undefined) {
        product.salePrice =
          product.price - (product.price * discountPercentage) / 100;
      }

      await product.save();
    }
    if (name !== undefined) {
      findOffer.name = name;
    }
    if (discountPercentage !== undefined) {
      findOffer.discountPercentage = discountPercentage;
    }
    if (tags !== undefined) {
      findOffer.tags = tags;
    }

    await findOffer.save();
    res.status(200).json({ success: true, message: { findOffer } });
  } catch (error) {
    next(error);
  }
};

export const deleteOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { offerId } = req.params;

    const findOffer = await Offer.findByIdAndDelete(offerId);

    if (!findOffer) {
      throw new ErrorHandler("Offer detail  not found", 404, false);
    }

    const products = await Product.find({ _id: { $in: findOffer.productId } });

    for (let product of products) {
      product.tags = product.tags.filter(
        (tag: string) => !findOffer.tags.includes(tag)
      );

      if (product.tags.length === 0) {
        product.salePrice = 0;
      }

      await product.save();
    }

    res.send({ success: true, message: { data: findOffer } });
  } catch (error) {
    next(error);
  }
};
