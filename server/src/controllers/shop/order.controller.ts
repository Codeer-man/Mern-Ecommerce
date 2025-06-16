// import { NextFunction, Request, Response } from "express";
// import paypal from "../../helpers/paypal";
// import { ErrorHandler } from "../../utils/ErrorHandler";
import Order from "../../model/PurchaseItems";
// import Cart from "../../model/Cart";
// import Product from "../../model/Product";

import { NextFunction, Request, response, Response } from "express";
import Cart from "../../model/Cart";
import { ErrorHandler } from "../../utils/ErrorHandler";
import PurchaseItem from "../../model/PurchaseItems";
// import { getEsewaPaymentHash, verifyEsewaPayment } from "../../utils/esewa";
import Payment from "../../model/payment.modle";
import Address from "../../model/Address";
import Product from "../../model/Product";
import { getEsewaPaymentHash, verifyEsewaPayment } from "../../utils/esewa";
import User from "../../model/User";
import { verifyEmail } from "../auth/email-veify.controller";

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

export const getAllOrderByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const order = await Order.find({ userId });

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

export const getOrderDetail = async (
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

export const initializeEsewa = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartId, deliveryCharge, addressId } = req.body;

    const cart = await Cart.findById(cartId).populate("items.ProductId");

    if (!cart) {
      throw new ErrorHandler("User product cart id not found", 404, false);
    }

    const cartItems = cart.items.map((items) => ({
      productId: items.ProductId._id.toString(),
      title: items.ProductId.title,
      image: items.ProductId.image,
      price: items.ProductId.price,
      quanity: items.quantity,
      isReturned: false,
    }));

    const productTotal = cartItems.reduce(
      (sum, items) => sum + items.price * items.quanity,
      0
    );

    const totalDeliveryCharge = cartItems.length * deliveryCharge;
    const totalPrice = productTotal + totalDeliveryCharge;

    const addressInfo = await Address.findById(addressId);
    if (!addressInfo) {
      throw new ErrorHandler("user address not found", 404, false);
    }

    // if (!addressInfo.verifyNumber) {
    //   throw new ErrorHandler(
    //     "Your phone number must be verified to order a purchase",
    //     401,
    //     false
    //   );
    // }

    const userI = cart.userId;
    const findUser = await User.findById(userI);

    if (!findUser) {
      throw new ErrorHandler("User not found", 404, false);
    }

    if (!findUser.emailVerify) {
      res.json("Please verify your email");
    }

    const purchaseItemData = await PurchaseItem.create({
      userId: cart.userId,
      cartId,
      cartItems,
      paymentMethod: "esewa",
      deliveryCharge: totalDeliveryCharge,
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

    const paymentInitiate = await getEsewaPaymentHash({
      amount: totalPrice,
      transaction_uuid: purchaseItemData._id,
    });

    const approve_Url: string = `${process.env.ESEWA_GATEWAY_URL_SECOND}`;

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      paymentInitiate,
      purchaseItemData,
      cart,
      approve_Url,
    });
  } catch (error) {
    next(error);
  }
};

export const completePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { data } = req.query;

  try {
    const paymentInfo = await verifyEsewaPayment(data);

    const purchaseItemData = await PurchaseItem.findById(
      paymentInfo.response.transaction_uuid
    );

    if (!purchaseItemData) {
      throw new ErrorHandler("purchase items not found", 404, false);
    }

    const paymentData = await Payment.create({
      pidx: paymentInfo.decodedData.transaction_code,
      transactionId: paymentInfo.decodedData.transaction_code,
      productId: paymentInfo.response.transaction_uuid,
      amount: purchaseItemData.totalPrice,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "esewa",
      status: "success",
    });

    await PurchaseItem.findByIdAndUpdate(
      paymentInfo.response.transaction_uuid,
      {
        $set: {
          status: "completed",
        },
      }
    );

    res.json({
      success: true,
      message: "Payment Successful",
      paymentData,
    });
  } catch (error) {
    next(error);
  }
};
