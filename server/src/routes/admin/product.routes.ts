import express from "express";
import { upload } from "../../helpers/upload-cloudinary";
import {
  handleImageUpload,
  addProduct,
  fetchallProduct,
  deleteProduct,
  editProduct,
  updateLabel,
} from "../../controllers/admin/products.controller";
import { uploadMultipleImagesMiddleware } from "../../middleware/image.upload.middleware";

const router = express.Router();

router.post("/image-upload", uploadMultipleImagesMiddleware, handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/getProdct", fetchallProduct);
router.put("/update/:id/label", updateLabel);

export default router;
