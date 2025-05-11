import express from "express";
import { pagination } from "../../controllers/shop/pagination.controller";

const router = express.Router();

router.get("/pagination", pagination);

export default router;
