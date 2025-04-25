import express from "express";
import { upload } from "../../helpers/upload-cloudinary";
import { handleImageUpload } from "../../controllers/admin/products.controller";

const router = express.Router();

router.post("/image-upload", upload.single("Product"), handleImageUpload);

export default router;
