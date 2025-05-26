import express from "express";
import {
  getAllReview,
  replyProduct,
} from "../../controllers/admin/productReview.controller";

const router = express.Router();

router.get("/get/all", getAllReview);
router.put("/update/:reviewId", replyProduct);

export default router;
