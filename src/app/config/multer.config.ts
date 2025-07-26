import { CloudinaryStorage } from "multer-storage-cloudinary";

import multer from "multer";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
});

export const multerUpload = multer({ storage });
