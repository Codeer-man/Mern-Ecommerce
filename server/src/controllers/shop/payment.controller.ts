// import axios from "axios";
// import crypto from "crypto";
// import { Request, Response, NextFunction } from "express";
// import PurchaseItem, { statusI } from "../../model/PurchaseItems";
// import { ErrorHandler } from "../../utils/ErrorHandler";

// interface EsewaPayload {
//   amount: number;
//   failure_url: string;
//   product_delivery_charge: number;
//   product_service_charge: number;
//   product_code: string;
//   signature: string;
//   signed_field_names: string;
//   success_url: string;
//   tax_amount: number;
//   total_amount: number;
//   transaction_uuid: string;
// }

// interface KhaltiInitFormData {
//   return_url: string;
//   website_url: string;
//   amount: number;
//   purchase_order_id: string;
//   purchase_order_name: string;
// }

// export const payWithEsewa = async (req: Request, res: Response) => {
//   const { payload } = req.body as { payload: EsewaPayload };

//   try {
//     const response = await fetch(
//       "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }
//     );

//     const result = await response.json();
//     res.json(result);
//   } catch (error) {
//     console.error("Error forwarding request to eSewa:", error);
//     res.status(500).json({ error: "Payment request failed" });
//   }
// };

// export const callKhalti = async (
//   req: Request<{}, {}, KhaltiInitFormData>,
//   res: Response
// ) => {
//   try {
//     const formData = req.body;
//     const headers = {
//       Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//       "Content-Type": "application/json",
//     };

//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/initiate/",
//       formData,
//       { headers }
//     );

//     return res.json({
//       message: "khalti success",
//       payment_method: "khalti",
//       data: response.data,
//     });
//   } catch (err: any) {
//     console.error(err);
//     return res.status(400).json({ error: err?.message });
//   }
// };

// export const handleKhaltiCallback = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { txnId, pidx, amount, purchase_order_id, transaction_id, message } =
//       req.query as {
//         txnId?: string;
//         pidx: string;
//         amount?: string;
//         purchase_order_id: string;
//         transaction_id?: string;
//         message?: string;
//       };

//     if (message) {
//       return res
//         .status(400)
//         .json({ error: message || "Error Processing Khalti" });
//     }

//     const headers = {
//       Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//       "Content-Type": "application/json",
//     };

//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       { headers }
//     );

//     if (response.data.status !== "Completed") {
//       return res.status(400).json({ error: "Payment not completed" });
//     }

//     const booking = await Produc.findById(purchase_order_id);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     booking.status = "Confirmed";
//     await booking.save();

//     // Pass data to next middleware if needed
//     (req as any).transaction_uuid = purchase_order_id;
//     (req as any).transaction_code = pidx;

//     return res.redirect("http://localhost:5173/success");
//   } catch (err: any) {
//     console.error(err);
//     return res
//       .status(400)
//       .json({ error: err?.message || "Error Processing Khalti" });
//   }
// };

// export const createSignature = (message: string): string => {
//   const secret = "8gBm/:&EnhH.1/q"; // Replace for production
//   const hmac = crypto.createHmac("sha256", secret);
//   hmac.update(message);
//   return hmac.digest("base64");
// };

// export const handleEsewaSuccess = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { data, transaction_uuid } = req.query as {
//       data: string;
//       transaction_uuid: string;
//     };

//     const decodedData = JSON.parse(
//       Buffer.from(data, "base64").toString("utf-8")
//     );

//     const booking = await PurchaseItem.findById(transaction_uuid);
//     if (!booking) {
//       res.status(404).json({ message: "Booking not found" });
//       return;
//     }

//     booking.paymentStatus = statusI.CONFIRMED;
//     await booking.save();

//     if (decodedData.status !== "COMPLETE") {
//       res.status(400).json({ message: "Payment incomplete" });
//       return;
//     }

//     const message = decodedData.signed_field_names
//       .split(",")
//       .map((field: string) => `${field}=${decodedData[field] || ""}`)
//       .join(",");

//     const signature = createSignature(message);

//     if (signature !== decodedData.signature) {
//       res.json({ message: "Signature mismatch" });
//       return;
//     }

//     (req as any).transaction_uuid = decodedData.transaction_uuid;
//     (req as any).transaction_code = decodedData.transaction_code;

//     res.redirect("http://localhost:5173/success");
//   } catch (err: any) {
//     console.error(err);
//     res.status(400).json({ error: err?.message || "No bookings found" });
//   }
// };
