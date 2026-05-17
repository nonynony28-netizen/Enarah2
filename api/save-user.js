// file name: api/save-user.js

import { MongoClient } from "mongodb";

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
  // =====================================
  // CORS
  // =====================================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
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
  // GET → API Test Page
  // =====================================
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message:
        "API is working. Use POST to save data.",
      endpoint: "/api/save-user",
      method: "POST",
      required_fields: [
        "name",
        "email",
      ],
      optional_fields: [
        "phone",
        "type",
      ],
      supported_types: [
        "user",
        "product",
      ],
    });
  }

  // =====================================
  // POST only
  // =====================================
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error:
        "Method Not Allowed",
    });
  }

  try {
    const { db } =
      await connectToDatabase();

    const body =
      req.body || {};

    // =====================================
    // Fields
    // =====================================
    const name =
      typeof body.name ===
      "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email ===
      "string"
        ? body.email
            .trim()
            .toLowerCase()
        : "";

    const phone =
      typeof body.phone ===
      "string"
        ? body.phone.trim()
        : "";

    // =====================================
    // Type Support
    // default = user
    // product = media uploader
    // =====================================
    const type =
      typeof body.type ===
      "string"
        ? body.type
            .trim()
            .toLowerCase()
        : "user";

    // =====================================
    // Validation
    // =====================================
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error:
          "name and email are required",
      });
    }

    // =====================================
    // Duplicate Protection
    // المنتجات يسمح بتكرارها
    // المستخدم العادي لا
    // =====================================
    if (
      type !== "product"
    ) {
      const existingUser =
        await db
          .collection(
            "users"
          )
          .findOne({
            email,
          });

      if (
        existingUser
      ) {
        return res.status(409).json({
          success: false,
          error:
            "User already exists",
        });
      }
    }

    // =====================================
    // Normalize phone/media JSON
    // =====================================
    let normalizedPhone =
      phone;

    try {
      if (phone) {
        normalizedPhone =
          JSON.stringify(
            JSON.parse(
              phone
            )
          );
      }
    } catch {
      normalizedPhone =
        phone;
    }

    // =====================================
    // New Record
    // =====================================
    const newUser = {
      type,
      name,
      email,
      phone:
        normalizedPhone,
      createdAt:
        new Date(),
    };

    const result =
      await db
        .collection(
          "users"
        )
        .insertOne(
          newUser
        );

    // =====================================
    // Success
    // =====================================
    return res.status(201).json({
      success: true,
      message:
        type ===
        "product"
          ? "Product saved successfully"
          : "User saved successfully",
      insertedId:
        result.insertedId,
      savedData: {
        type,
        name,
        email,
      },
    });
  } catch (error) {
    console.error(
      "MongoDB Save Error:",
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
