import { NextFunction, Request, Response } from "express";
import Order from "../../model/order";
import { ErrorHandler } from "../../utils/ErrorHandler";


export const productReturn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, userId, orderId } = req.params;

    // Find the order
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      throw new ErrorHandler("Order not found", 404, false);
    }

    // Check if it's within 7 days
    const orderDate = order.orderDate || order.createdAt;
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - new Date(orderDate).getTime();
    const daysSinceOrder = timeDiff / (1000 * 3600 * 24);

    if (daysSinceOrder > 7) {
      throw new ErrorHandler(
        "Return period expired (more than 7 days)",
        403,
        false
      );
    }

    // Find the item
    const item = order.cartItems.find(
      (product) => product.productId === productId
    );

    if (!item) {
      throw new ErrorHandler("Product not found in this order", 404, false);
    }

    // Check if already returned
    if (item.isReturned) {
      throw new ErrorHandler(
        "Product is already marked as returned",
        400,
        false
      );
    }

    // Mark as returned
    item.isReturned = true;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Product marked as returned successfully.",
      product: item,
    });
  } catch (error) {
    next(error);
  }
};
