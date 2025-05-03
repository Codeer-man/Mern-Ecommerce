import express from "express";
import {
  getAllOrderByUser,
  getOrderDetailForAdmin,
  updateOrderStatus,
} from "../../controllers/admin/order.controller";

const router = express.Router();

router.get("/get", getAllOrderByUser);
router.get("/details/:id", getOrderDetailForAdmin);
router.put("/update/:id", updateOrderStatus);

export default router;
