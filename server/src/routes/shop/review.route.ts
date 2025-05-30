import express from "express";
import {
  createProductReview,
  deleteReview,
  getProductReview,
  getUserReview,
  updateReview,
} from "../../controllers/shop/reivew.controller";

const router = express.Router();

router.post("/create", createProductReview);
router.get("/get/:productId", getProductReview);
router.get("/:productId/:userId", getUserReview);
router.put("/update/:reviewId", updateReview);
router.delete("/delete/:reviewId", deleteReview);

export default router;
