// file name: api/delete-user.js

import { MongoClient, ObjectId } from "mongodb";
import { deleteImageFromR2 } from "../lib/r2.js";

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

// =====================================
// API Handler
// =====================================
export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, DELETE, OPTIONS"
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
      message:
        "Delete API is working. Use DELETE method with MongoDB item ID.",
      endpoint: "/api/delete-user",
      method: "DELETE",
      required_body: {
        id: "MongoDB document _id",
      },
    });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  // Admin Password Check
  const adminPassword = process.env.ADMIN_PASSWORD || "EnarahAdmin2026";
  const clientPassword = req.headers["x-admin-password"];
  if (clientPassword !== adminPassword) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid admin password",
    });
  }

  try {
    const { db } = await connectToDatabase();
    const { id } = req.body || {};

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid MongoDB ID is required",
      });
    }

    // 1. Retrieve the item first to get its image URL
    const itemToDelete = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!itemToDelete) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    // 2. Delete the associated image from Cloudflare R2 automatically
    try {
      const phoneData = JSON.parse(itemToDelete.phone || "{}");
      if (phoneData.imageUrl) {
        await deleteImageFromR2(phoneData.imageUrl);
      }
    } catch (e) {
      console.warn("Could not parse image URL for R2 cleanup:", e);
    }

    // 3. Delete item from MongoDB
    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(id),
    });

    return res.status(200).json({
      success: true,
      message: "Item and associated Cloudflare R2 image deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("MongoDB Delete Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
