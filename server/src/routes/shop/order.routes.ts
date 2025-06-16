import express from "express";
import {
  completePayment,
  initializeEsewa,
} from "../../controllers/shop/order.controller";
import { CashOnDelivery } from "../../controllers/shop/CashOnDelivery.controller";

// import {
//   completePayment,
//   initializeEsewa,
// } from "../../controllers/shop/order.controller";
import {
  getAllOrderByUser,
  getOrderDetail,
} from "../../controllers/shop/order.controller";

const router = express.Router();

// router.post("/create", createOrder);
// router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrderByUser);
router.get("/detail/:id", getOrderDetail);

router.post("/payWithEsewa", initializeEsewa);
router.post("/complete-payment", completePayment);
router.post("/cash_on_delivbery", CashOnDelivery);

export default router;
