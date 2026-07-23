// file name: api/get-r2-upload-url.js

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { applySecurityHeaders } from "../lib/security.js";

// Read environment variables
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "63de55e3585d0ef6ef4458594669f71b";
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "ff081101a613ca4190798cd0c9da2773";
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "0cf61f46d299a18d22cbbbeb61f6d4af0f3219f931692a7b43b4faac26349f1f";
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "enarah-modern";
const R2_PUBLIC_URL = (process.env.CLOUDFLARE_R2_PUBLIC_URL || "https://pub-4cff48cfd0904acfa2890603fb3c0c40.r2.dev").replace(/\/$/, "");

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  applySecurityHeaders(res);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-password");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const adminPassword = process.env.ADMIN_PASSWORD || "EnarahAdmin2026";
    const clientPassword = req.headers["x-admin-password"];
    if (clientPassword !== adminPassword) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid admin password",
      });
    }

    let body = req.body || {};
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }

    const fileType = typeof body.fileType === "string" ? body.fileType : "video/mp4";
    const ext = fileType.includes("webm") ? "webm" : "mp4";
    const fileKey = `videos/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    // Presigned upload URL valid for 15 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    const publicUrl = `${R2_PUBLIC_URL}/${fileKey}`;

    return res.status(200).json({
      success: true,
      uploadUrl,
      publicUrl,
      fileKey,
    });
  } catch (error) {
    console.error("Presigned URL Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate presigned upload URL",
    });
  }
}
