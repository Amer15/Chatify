import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024; //5MB
const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed.")
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
