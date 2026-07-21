// file path: lib/multer.js
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "image/avif"
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("نوع الملف غير مدعوم! يرجى رفع صورة بصيغة JPG أو PNG أو WebP."), false);
  }
};

export const uploadSingleImage = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB max input size
  },
  fileFilter,
}).single("image");
