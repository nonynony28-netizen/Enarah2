// file name: api/save-user.js

import { MongoClient } from "mongodb";

// =====================================
// MongoDB Connection Cache
// =====================================
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  // إعادة استخدام الاتصال إذا كان موجود
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // التحقق من المتغير
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }

  // إنشاء الاتصال
  const client = new MongoClient(uri);

  await client.connect();

  // اسم قاعدة البيانات
  const db = client.db("my_app_database");

  // حفظ الاتصال
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
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // POST فقط
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    // الاتصال
    const { db } = await connectToDatabase();

    // قراءة البيانات
    const body = req.body || {};

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    // =====================================
    // Validation
    // =====================================
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "name and email are required",
      });
    }

    // =====================================
    // منع تكرار البريد
    // =====================================
    const existingUser = await db.collection("users").findOne({
      email: email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User already exists",
      });
    }

    // =====================================
    // تجهيز البيانات
    // =====================================
    const newUser = {
      name,
      email,
      phone,
      createdAt: new Date(),
    };

    // =====================================
    // حفظ البيانات
    // =====================================
    const result = await db.collection("users").insertOne(
      newUser
    );

    // =====================================
    // نجاح
    // =====================================
    return res.status(201).json({
      success: true,
      message: "User saved successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("MongoDB Save Error:", error);

    return res.status(500).json({
      success: false,
      error:
        error.message || "Internal Server Error",
    });
  }
}
