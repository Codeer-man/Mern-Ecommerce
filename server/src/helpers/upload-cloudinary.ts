import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dl9gbuvju",
  api_key: "891863329688962",
  api_secret: "zTsVJvxHgRHf4yuaqWn7DyyHhDA",
});

const storage = multer.memoryStorage();

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
