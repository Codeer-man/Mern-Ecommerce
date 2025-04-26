import express from "express";
import { upload } from "../../helpers/upload-cloudinary";
import {
  handleImageUpload,
  addProduct,
  fetchallProduct,
  deleteProduct,
  editProduct,
} from "../../controllers/admin/products.controller";

const router = express.Router();

router.post("/image-upload", upload.single("Product"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/getProdct", fetchallProduct);

export default router;
