import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../utils/ErrorHandler";
import Cart from "../../model/Cart";
import PurchaseItem from "../../model/PurchaseItems";
import Address from "../../model/Address";
import Product from "../../model/Product";

export const CashOnDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartId, deliveryCharge, totalPrice, addressId } = req.body;

    if (!cartId || !deliveryCharge || !totalPrice || !addressId) {
      throw new ErrorHandler("Please fill all the fields", 400, false);
    }

    const cart = await Cart.findById(cartId).populate("items.ProductId");

    if (!cart) {
      throw new ErrorHandler("Cart not found", 404, false);
    }

    const cartItems = cart.items.map((item) => {
      const product: any = item.ProductId;
      return {
        productId: product._id.toString(),
        title: product.title,
        image: product.image[0].url,
        price:
          product.salePrice && product.salePrice > 0
            ? product.salePrice
            : product.price,
        quantity: item.quantity,
        isReturned: false,
      };
    });

    for (let item of cart.items) {
      const product: any = item.ProductId;
      if (!product) {
        throw new ErrorHandler("Product not found", 404, false);
      }

      product.totalStock -= item.quantity;

      if (product.totalStock < 0) {
        throw new ErrorHandler(
          `Product ${product.title} is out of stock`,
          400,
          false
        );
      }

      await product.save();
    }

    const addressInfo = await Address.findById(addressId);
    if (!addressInfo) {
      throw new ErrorHandler("Address not found", 404, false);
    }

    const purchaseItemData = new PurchaseItem({
      cartId: cartId,
      cartItems: cartItems,
      userId: cart.userId.toString(),
      paymentMethod: "cash on delivery",
      deliveryCharge,
      totalPrice,
      addressInfo: {
        addressId: addressInfo._id,
        address: addressInfo.Address,
        city: addressInfo.City,
        pincode: addressInfo.Pincode,
        phoneNo: addressInfo.PhoneNo,
        notes: addressInfo.Notes,
      },
    });

    await purchaseItemData.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully with Cash on Delivery",
      data: purchaseItemData,
    });
  } catch (error) {
    next(error);
  }
};
