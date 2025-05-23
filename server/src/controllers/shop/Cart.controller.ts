import { NextFunction, Request, Response } from "express";
import Cart, { IProduct } from "../../model/Cart";
import Product from "../../model/Product";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { NOT_FOUND, UNAUTHORIZED } from "../../constants/http";
import { Types } from "mongoose";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, ProductId, quantity } = req.body;

    if (!userId || !ProductId || quantity <= 0) {
      throw new ErrorHandler("Invalid data", 400, false);
    }

    const product = await Product.findById(ProductId);

    if (!product) {
      throw new ErrorHandler("Product not found", 404, false);
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentItemIndex = cart.items.findIndex(
      (item) => item.ProductId.toString() === ProductId
    );

    if (findCurrentItemIndex === -1) {
      cart.items.push({ ProductId, quantity });
    } else {
      cart.items[findCurrentItemIndex].quantity += quantity;
    }
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
export const fetchCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ErrorHandler("User Id not found", UNAUTHORIZED, false);
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.ProductId",
      select: "image title salePrice price",
    });

    if (!cart) {
      throw new ErrorHandler("User not found", NOT_FOUND, false);
    }

    const validItem = cart.items.filter((productItem) => productItem.ProductId);

    if (validItem.length < cart.items.length) {
      cart.items = validItem;
      await cart.save();
    }

    const populateCartItem = validItem.map((items) => {
      const product = items.ProductId as IProduct;

      return {
        ProductId: product._id,
        image: product.image,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice,
        quantity: items.quantity,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        cart: cart,
        items: populateCartItem,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItemsQty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, ProductId, quantity } = req.body;

    if (!userId) {
      throw new ErrorHandler("User Id not found", UNAUTHORIZED, false);
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new ErrorHandler("User not found", NOT_FOUND, false);
    }

    const findCurrentItemIndex = cart.items.findIndex(
      (items) => items.ProductId.toString() === ProductId
    );

    if (findCurrentItemIndex === -1) {
      throw new ErrorHandler("Item not found", NOT_FOUND, false);
    }

    cart.items[findCurrentItemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.ProductId",
      select: "image title salePrice price",
    });


    const populateCartItem = cart.items.map((items) => {
      const product = items.ProductId as IProduct;

      return {
        ProductId: product ? product._id : null,
        image: product ? product.image : null,
        title: product ? product.title : null,
        price: product ? product.price : null,
        salePrice: product ? product.salePrice : null,
        quantity: items.quantity,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        items: populateCartItem,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, ProductId } = req.params;

    if (!userId || !ProductId) {
      throw new ErrorHandler("Invalid data", 400, false);
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.ProductId",
      select: "image title salePrice price",
    });

    if (!cart) {
      throw new ErrorHandler("User not found", NOT_FOUND, false);
    }

    cart.items = cart.items.filter(
      (item) => item.ProductId._id.toString() !== ProductId
    );
    console.log(cart.items);

    await cart.save();

    await cart.populate({
      path: "items.ProductId",
      select: "image title salePrice price",
    });

    const populateCartItem = cart.items.map((items) => {
      const product = items.ProductId as IProduct;

      return {
        ProductId: product ? product._id : null,
        image: product ? product.image : null,
        title: product ? product.title : null,
        price: product ? product.price : null,
        salePrice: product ? product.salePrice : null,
        quantity: items.quantity,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        items: populateCartItem,
      },
    });
  } catch (error) {
    next(error);
  }
};
