import express from "express";
import {
  getFilteredProduct,
  getProductsById,
} from "../../controllers/shop/Product.controller";

const router = express.Router();

router.get("/filteredProduct", getFilteredProduct);
router.get("/productData/:id", getProductsById);

export default router;
