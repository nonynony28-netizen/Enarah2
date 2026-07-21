// file path: lib/r2.js
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// Read environment variables
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "63de55e3585d0ef6ef4458594669f71b";
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "ff081101a613ca4190798cd0c9da2773";
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "0cf61f46d299a18d22cbbbeb61f6d4af0f3219f931692a7b43b4faac26349f1f";
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "enarah-modern";
const R2_PUBLIC_URL = (process.env.CLOUDFLARE_R2_PUBLIC_URL || "https://pub-4cff48cfd0904acfa2890603fb3c0c40.r2.dev").replace(/\/$/, "");

// Configure S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Process image buffer: resize max 1600px, convert to WebP 82% quality, and upload to Cloudflare R2
 * @param {Buffer} fileBuffer
 * @param {string} folder - Default 'products'
 * @returns {Promise<string>} Public image URL
 */
export async function processAndUploadImage(fileBuffer, folder = "products") {
  if (!fileBuffer) return null;

  // Compress & resize image using Sharp
  const processedBuffer = await sharp(fileBuffer)
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  // Generate unique filename with UUID
  const fileKey = `${folder}/${uuidv4()}.webp`;

  // Upload to R2
  const uploadCommand = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
    Body: processedBuffer,
    ContentType: "image/webp",
    CacheControl: "public, max-age=31536000, immutable",
  });

  await s3Client.send(uploadCommand);

  // Return public URL
  return `${R2_PUBLIC_URL}/${fileKey}`;
}

/**
 * Delete image from Cloudflare R2 given its public URL
 * @param {string} imageUrl
 */
export async function deleteImageFromR2(imageUrl) {
  if (!imageUrl || !imageUrl.includes(R2_PUBLIC_URL)) return;

  try {
    const fileKey = imageUrl.replace(`${R2_PUBLIC_URL}/`, "");

    const deleteCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(deleteCommand);
    console.log(`Successfully deleted image from R2: ${fileKey}`);
  } catch (error) {
    console.error("Failed to delete image from Cloudflare R2:", error);
  }
}
