import express from "express";
import {
  getFilteredProduct,
  getProductsById,
  relatedProducts,
} from "../../controllers/shop/Product.controller";

const router = express.Router();

router.get("/filteredProduct", getFilteredProduct);
router.get("/productData/:id", getProductsById);
router.get("/relatedProduct/:productId", relatedProducts);

export default router;
