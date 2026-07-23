// file name: api/upload-chunk.js

import { uploadVideoToR2 } from "../lib/r2.js";
import { applySecurityHeaders } from "../lib/security.js";

// Global in-memory storage for active chunked upload sessions
const chunkStore = new Map();

// Cleanup stale chunk sessions older than 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of chunkStore.entries()) {
    if (now - session.createdAt > 30 * 60 * 1000) {
      chunkStore.delete(id);
    }
  }
}, 10 * 60 * 1000);

export default async function handler(req, res) {
  applySecurityHeaders(res);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-password");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const adminPassword = process.env.ADMIN_PASSWORD || "EnarahAdmin2026";
    const clientPassword = req.headers["x-admin-password"];
    if (clientPassword !== adminPassword) {
      return res.status(401).json({ success: false, error: "Unauthorized: Invalid admin password" });
    }

    let body = req.body || {};
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }

    const { uploadId, chunkIndex, totalChunks, chunkData, mimeType } = body;

    if (!uploadId || chunkIndex === undefined || !totalChunks || !chunkData) {
      return res.status(400).json({ success: false, error: "بيانات الحزمة غير مكتملة." });
    }

    // Convert Base64 chunk to Buffer
    const bufferChunk = Buffer.from(chunkData, "base64");

    let session = chunkStore.get(uploadId);
    if (!session) {
      session = {
        chunks: new Array(totalChunks),
        receivedCount: 0,
        mimeType: mimeType || "video/mp4",
        createdAt: Date.now(),
      };
      chunkStore.set(uploadId, session);
    }

    session.chunks[chunkIndex] = bufferChunk;
    session.receivedCount++;

    // When all chunks arrive
    if (session.receivedCount === totalChunks) {
      const fullVideoBuffer = Buffer.concat(session.chunks);
      chunkStore.delete(uploadId);

      // Upload full video buffer to Cloudflare R2
      const publicUrl = await uploadVideoToR2(fullVideoBuffer, session.mimeType);

      return res.status(200).json({
        success: true,
        isComplete: true,
        publicUrl,
      });
    }

    return res.status(200).json({
      success: true,
      isComplete: false,
      received: session.receivedCount,
      total: totalChunks,
    });
  } catch (error) {
    console.error("Upload Chunk Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "حدث خطأ أثناء معالجة الجزء المرفوع.",
    });
  }
}
