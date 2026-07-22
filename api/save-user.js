// file name: api/save-user.js

import { MongoClient } from "mongodb";
import { uploadSingleImage } from "../lib/multer.js";
import { processAndUploadImage } from "../lib/r2.js";

// =====================================
// MongoDB Cache
// =====================================
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }

  const client = new MongoClient(uri);

  await client.connect();

  const db = client.db("my_app_database");

  cachedClient = client;
  cachedDb = db;

  return {
    client,
    db,
  };
}

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
    bodyParser: false, // Disable default bodyParser for multipart FormData support
  },
};

// =====================================
// API Handler
// =====================================
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-admin-password"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "API is working. Use POST to save data.",
      endpoint: "/api/save-user",
      method: "POST",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    // Run Multer to handle multipart form data file uploads
    try {
      await runMiddleware(req, res, uploadSingleImage);
    } catch (err) {
      console.warn("Multer notice:", err.message);
    }

    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const type = typeof body.type === "string" ? body.type.trim().toLowerCase() : "user";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const videoUrl = typeof body.videoUrl === "string" ? body.videoUrl.trim() : "";
    const priceStr = typeof body.price === "string" ? body.price.trim() : "";
    const discountPriceStr = typeof body.discountPrice === "string" ? body.discountPrice.trim() : "";
    const stockStatus = typeof body.stockStatus === "string" ? body.stockStatus.trim().toLowerCase() : "available";
    const stockQtyStr = typeof body.stockQty === "string" ? body.stockQty.trim() : "";

    const price = priceStr ? parseFloat(priceStr) : undefined;
    const discountPrice = discountPriceStr ? parseFloat(discountPriceStr) : undefined;
    const stockQty = stockQtyStr ? parseInt(stockQtyStr, 10) : undefined;

    const isAdminAction = type === "product" || type === "project" || email === "admin_wire_prices@app.local";
    if (isAdminAction) {
      const adminPassword = process.env.ADMIN_PASSWORD || "EnarahAdmin2026";
      const clientPassword = req.headers["x-admin-password"];
      if (clientPassword !== adminPassword) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: Invalid admin password"
        });
      }
    }

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "name and email are required",
      });
    }

    // Process and upload file automatically to Cloudflare R2 if attached
    if (req.file) {
      imageUrl = await processAndUploadImage(req.file.buffer, "products");
    }

    const phoneData = {
      imageUrl,
      videoUrl,
      description,
      type,
      category,
      price,
      discountPrice,
      stockStatus,
      stockQty,
    };

    const { db } = await connectToDatabase();
    const newUser = {
      type,
      name,
      email,
      phone: JSON.stringify(phoneData),
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    return res.status(201).json({
      success: true,
      message: type === "product" ? "Product saved successfully" : "User saved successfully",
      insertedId: result.insertedId,
      imageUrl,
    });
  } catch (error) {
    console.error("MongoDB Save Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
