import express from "express";
import {
  createProductReview,
  getProductReview,
  getUserReview,
} from "../../controllers/shop/reivew.controller";

const router = express.Router();

router.post("/create", createProductReview);
router.get("/get/:productId", getProductReview);
router.get("/:productId/:userId", getUserReview);

export default router;
