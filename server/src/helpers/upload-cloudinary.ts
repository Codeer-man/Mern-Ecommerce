import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import multer from "multer";

cloudinary.config({
  cloud_name: "dl9gbuvju",
  api_key: "891863329688962",
  api_secret: "zTsVJvxHgRHf4yuaqWn7DyyHhDA",
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
