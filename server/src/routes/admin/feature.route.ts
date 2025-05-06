import express from "express";
import {
  addFeatureImage,
  getFeatureImage,
} from "../../controllers/admin/feature.controller";

const router = express.Router();

router.post("/post", addFeatureImage);
router.get("/get", getFeatureImage);

export default router;
