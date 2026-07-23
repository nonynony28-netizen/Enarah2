// file path: lib/multer.js
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "image/avif",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "application/octet-stream",
    "binary/octet-stream"
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("نوع الملف غير مدعوم! يرجى رفع صورة بصيغة JPG/PNG/WebP أو فيديو بصيغة MP4/WebM."), false);
  }
};

export const uploadSingleImage = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max size for videos
  },
  fileFilter,
}).fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "chunk", maxCount: 1 }
]);
