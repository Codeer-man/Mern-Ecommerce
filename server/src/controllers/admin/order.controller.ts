import { NextFunction, Request, Response } from "express";
import Order from "../../model/order";
import { ErrorHandler } from "../../utils/ErrorHandler";

export const getAllOrderByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await Order.find();

    if (!order) {
      throw new ErrorHandler("Order data not found", 404, false);
    }

    res
      .status(200)
      .json({ success: true, message: "user order data ", data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetailForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      throw new ErrorHandler("order not found", 404, false);
    }

    res
      .status(200)
      .json({ success: true, message: "Ordered confirmed ", data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      throw new ErrorHandler("Order not found!", 404, false);
    }

    await Order.findByIdAndUpdate(id, { orderStatus });

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    next(e);
  }
};
