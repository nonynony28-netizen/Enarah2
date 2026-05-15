// file name: api/delete-user.js

import { MongoClient, ObjectId } from "mongodb";

// =====================================
// MongoDB Cache
// =====================================
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  // إعادة استخدام الاتصال
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
  // =====================================
  // CORS
  // =====================================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // =====================================
  // OPTIONS
  // =====================================
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // =====================================
  // GET → شرح API بدل 405
  // =====================================
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

  // =====================================
  // DELETE فقط
  // =====================================
  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    // =====================================
    // Database Connection
    // =====================================
    const { db } = await connectToDatabase();

    // =====================================
    // Read Body
    // =====================================
    const { id } = req.body || {};

    // =====================================
    // Validation
    // =====================================
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "ID is required",
      });
    }

    // تحقق من صحة ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid MongoDB ID",
      });
    }

    // =====================================
    // Delete Item
    // =====================================
    const result = await db
      .collection("users")
      .deleteOne({
        _id: new ObjectId(id),
      });

    // =====================================
    // Not Found
    // =====================================
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    // =====================================
    // Success
    // =====================================
    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error(
      "MongoDB Delete Error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Internal Server Error",
    });
  }
}
