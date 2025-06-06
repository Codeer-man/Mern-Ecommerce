import multer from "multer";

const storage = multer.memoryStorage();

const imageFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed!"));
  }
};

export const uploadMultipleImagesMiddleware = multer({
  storage,
  fileFilter: imageFilter,
}).array("images", 10);
