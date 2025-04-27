import express from "express";
import { getFilteredProduct } from "../../controllers/shop/Product.controller";

const router = express.Router();

router.get("/filteredProduct", getFilteredProduct);

export default router;
