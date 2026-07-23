// file name: api/upload-chunk.js

import { uploadVideoToR2 } from "../lib/r2.js";
import { uploadSingleImage } from "../lib/multer.js";
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

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false, // Disable default bodyParser to handle binary FormData chunks
  },
};

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

    // Parse binary FormData chunk with Multer
    try {
      await runMiddleware(req, res, uploadSingleImage);
    } catch (err) {
      console.warn("Multer chunk notice:", err.message);
    }

    const body = req.body || {};
    const uploadId = body.uploadId;
    const chunkIndex = parseInt(body.chunkIndex, 10);
    const totalChunks = parseInt(body.totalChunks, 10);
    const mimeType = body.mimeType || "video/mp4";

    let chunkBuffer = null;
    if (req.files && req.files.chunk && req.files.chunk[0]) {
      chunkBuffer = req.files.chunk[0].buffer;
    } else if (req.files && req.files.image && req.files.image[0]) {
      chunkBuffer = req.files.image[0].buffer;
    }

    if (!uploadId || isNaN(chunkIndex) || isNaN(totalChunks) || !chunkBuffer) {
      return res.status(400).json({ success: false, error: "بيانات الجزء المرفوع غير مكتملة." });
    }

    let session = chunkStore.get(uploadId);
    if (!session) {
      session = {
        chunks: new Array(totalChunks),
        receivedCount: 0,
        mimeType: mimeType,
        createdAt: Date.now(),
      };
      chunkStore.set(uploadId, session);
    }

    session.chunks[chunkIndex] = chunkBuffer;
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
