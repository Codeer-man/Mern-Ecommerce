// import { NextFunction, Request, Response } from "express";
// import paypal from "../../helpers/paypal";
// import { ErrorHandler } from "../../utils/ErrorHandler";
// import Order from "../../model/PurchaseItems";
// import Cart from "../../model/Cart";
// import Product from "../../model/Product";

// export const createOrder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const {
//       userId,
//       CartId,
//       cartItems,
//       addressInfo,
//       orderstatus,
//       paymentMethod,
//       paymentStatus,
//       deliveryCharge,
//       totalAmount,
//       orderUpdate,
//       paymentId,
//       orderDate,
//       payerId,
//     } = req.body;

//     const create_paypal_json = {
//       intent: "sale",
//       payer: {
//         payment_method: "paypal",
//       },
//       redirect_urls: {
//         return_url: "http://localhost:5173/shop/paypal-return",
//         cancel_url: "http://localhost:5173/shop/paypal-cancel",
//       },
//       transactions: [
//         {
//           item_list: {
//             items: cartItems.map((item: any) => ({
//               name: item.title,
//               sku: item.productId,
//               price: item.price.toFixed(2) + deliveryCharge,
//               currency: "USD",
//               quantity: item.quantity,
//             })),
//           },
//           amount: {
//             currency: "USD",
//             deliveryCharge: deliveryCharge,
//             total: totalAmount.toFixed(2),
//           },
//           description: "Order payment via PayPal",
//         },
//       ],
//     };

//     paypal.payment.create(create_paypal_json, async (error, paymentInfo) => {
//       if (error) {
//         console.error(error);
//         return next(
//           new ErrorHandler("Error in creating PayPal payment", 400, false)
//         );
//       }

//       const newlyCreatedOrder = new Order({
//         userId,
//         CartId,
//         cartItems,
//         addressInfo,
//         orderstatus,
//         paymentMethod,
//         paymentStatus,
//         deliveryCharge,
//         totalAmount,
//         orderUpdate,
//         orderDate,
//         paymentId,
//         payerId,
//       });

//       await newlyCreatedOrder.save();

//       const approveURL = paymentInfo.links?.find(
//         (link: any) => link.rel === "approval_url"
//       )?.href;

//       if (!approveURL) {
//         return next(
//           new ErrorHandler("PayPal approval URL not found", 404, false)
//         );
//       }

//       res.status(201).json({
//         success: true,
//         approveURL: approveURL,
//         orderId: newlyCreatedOrder._id,
//       });
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const capturePayment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { orderId, paymentId, payerId } = req.body;

//     let order = await Order.findById(orderId);

//     if (!order) {
//       throw new ErrorHandler("Order Id not found", 404, false);
//     }

//     (order.paymentStatus = "paid"), (order.orderstatus = "confirmed");
//     (order.paymentId = paymentId), (order.payerId = payerId);

//     for (let items of order.cartItems) {
//       const product = await Product.findById(items.productId);

//       if (!product) {
//         throw new ErrorHandler("No enough stocks", 404, false);
//       }

//       product.totalStock -= items.quantity;

//       await product.save();
//     }

//     const getCartId = order.CartId;
//     console.log(getCartId);

//     await Cart.findByIdAndDelete(getCartId);

//     await order.save();

//     res
//       .status(200)
//       .json({ success: true, message: "Ordered confirmed ", data: order });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAllOrderByUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { userId } = req.params;

//     const order = await Order.find({ userId });

//     if (!order) {
//       throw new ErrorHandler("Order data not found", 404, false);
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "user order data ", data: order });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getOrderDetail = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findById(id);
//     if (!order) {
//       throw new ErrorHandler("order not found", 404, false);
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Ordered confirmed ", data: order });
//   } catch (error) {
//     next(error);
//   }
// };
