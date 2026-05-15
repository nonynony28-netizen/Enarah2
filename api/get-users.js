// file name: api/get-users.js

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

  // التحقق من متغير البيئة
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }

  // إنشاء الاتصال
  const client = new MongoClient(uri);

  await client.connect();

  // اسم قاعدة البيانات (يجب أن يطابق كود الحفظ)
  const db = client.db("my_app_database");

  // تخزين الاتصال
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
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET فقط
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    // الاتصال
    const { db } = await connectToDatabase();

    // =====================================
    // جلب البيانات
    // =====================================
    const users = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 }) // الأحدث أولًا
      .toArray();

    // =====================================
    // نجاح
    // =====================================
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("MongoDB Fetch Error:", error);

    return res.status(500).json({
      success: false,
      error:
        error.message || "Internal Server Error",
    });
  }
}
