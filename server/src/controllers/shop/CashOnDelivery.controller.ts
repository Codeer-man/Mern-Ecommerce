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
      throw new ErrorHandler("Please fill all the fields ", 401, false);
    }

    const cartItem = await Cart.findById(cartId);
    
    if (!cartItem) {
      throw new ErrorHandler("Cart not found", 404, false);
    }

    console.log(cartItem);

    for (let products of cartItem.items) {
      const findProduct = await Product.findById(products.ProductId);

      if (!findProduct) {
        throw new ErrorHandler("User product not found", 404, false);
      }

      findProduct.totalStock -= products.quantity;

      await findProduct.save();
    }

    const item = cartItem.items.map((item) => ({
      productId: item.ProductId.toString(),
      title: item.ProductId.title,
      image: item.ProductId.image,
      price:
        item?.ProductId?.salePrice! > 0
          ? item.ProductId.salePrice
          : item.ProductId.price,
      quantity: item.quantity,
      isReturned: false,
    }));

    cartItem.items = [];
    await cartItem.save();

    const addressInfo = await Address.findById(addressId);

    if (!addressInfo) {
      throw new ErrorHandler("Address data not found", 404, false);
    }

    const purchaseItemData = new PurchaseItem({
      cartId: cartId,
      cartItems: item,
      userId: cartItem.userId.toString(),
      paymentMethod: "cash on delivery",
      deliveryCharge: deliveryCharge,
      totalPrice: totalPrice,
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

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      data: purchaseItemData,
    });
  } catch (error) {
    next(error);
  }
};
