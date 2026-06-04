// file name: api/update-user.js

import { MongoClient, ObjectId } from "mongodb";

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
    "GET, POST, PUT, OPTIONS"
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
      message: "Update API is working. Use POST or PUT to update data.",
      endpoint: "/api/update-user",
      method: "POST",
      required_fields: ["id", "name"],
      optional_fields: ["phone", "email", "type"]
    });
  }

  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  // التحقق من صلاحية كلمة مرور المسؤول
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
    const body = req.body || {};

    const id = typeof body.id === "string" ? body.id.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const type = typeof body.type === "string" ? body.type.trim().toLowerCase() : "";

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "id is required",
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid MongoDB ID",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "name is required",
      });
    }

    // Prepare update payload
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (type) updateData.type = type;

    if (phone) {
      let normalizedPhone = phone;
      try {
        normalizedPhone = JSON.stringify(JSON.parse(phone));
      } catch {
        normalizedPhone = phone;
      }
      updateData.phone = normalizedPhone;
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      updatedId: id,
    });
  } catch (error) {
    console.error("MongoDB Update Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
