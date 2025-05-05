import express from "express";
import { searchProduct } from "../../controllers/shop/search.controller";

const router = express.Router();

router.get("/:keyword", searchProduct);

export default router;
