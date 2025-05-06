import express from "express";
import {
  createProductReview,
  getProductReview,
} from "../../controllers/shop/reivew.controller";

const router = express.Router();

router.post("/create", createProductReview);
router.get("/get/:productId", getProductReview);

export default router;
