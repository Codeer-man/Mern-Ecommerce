import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.memoryStorage();

function imageFilter(
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("only image file are allowed"));
  }
}

export const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFilter,
}).array("image", 10);

export async function imageUploadUtil(file: string) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

export async function deleteFromCloudinary(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export const upload = multer({ storage });
