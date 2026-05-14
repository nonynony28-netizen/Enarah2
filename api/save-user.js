// file name: api/save-user.js

import { MongoClient } from "mongodb";

// =====================================
// MongoDB Connection Cache
// =====================================
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }

  const client = new MongoClient(uri);

  await client.connect();

  // يمكنك تغيير اسم قاعدة البيانات هنا
  const db = client.db("my_app_database");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// =====================================
// API Handler
// =====================================
export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();

    // =====================================
    // POST → حفظ بيانات
    // =====================================
    if (req.method === "POST") {
      const body = req.body || {};

      const name = body.name?.trim();
      const email = body.email?.trim().toLowerCase();
      const phone = body.phone?.trim() || "";

      // Validation
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          error: "name and email are required",
        });
      }

      // منع التكرار حسب الإيميل
      const existingUser = await db.collection("users").findOne({
        email: email,
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "User already exists",
        });
      }

      const newUser = {
        name,
        email,
        phone,
        createdAt: new Date(),
      };

      const result = await db.collection("users").insertOne(newUser);

      return res.status(201).json({
        success: true,
        message: "User saved successfully",
        insertedId: result.insertedId,
        data: newUser,
      });
    }

    // =====================================
    // GET → جلب جميع البيانات
    // =====================================
    if (req.method === "GET") {
      const users = await db
        .collection("users")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    }

    // =====================================
    // غير مسموح
    // =====================================
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  } catch (error) {
    console.error("MongoDB API Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
