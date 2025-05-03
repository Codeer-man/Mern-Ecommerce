import express from "express";
import {
  capturePayment,
  createOrder,
  getAllOrderByUser,
  getOrderDetail,
} from "../../controllers/shop/order.controller";

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrderByUser);
router.get("/detail/:id", getOrderDetail);

export default router;
