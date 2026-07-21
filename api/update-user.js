// file name: api/update-user.js

import { MongoClient, ObjectId } from "mongodb";
import { uploadSingleImage } from "../lib/multer.js";
import { processAndUploadImage, deleteImageFromR2 } from "../lib/r2.js";

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
    bodyParser: false,
  },
};

export default async function handler(req, res) {
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
    });
  }

  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "EnarahAdmin2026";
  const clientPassword = req.headers["x-admin-password"];
  if (clientPassword !== adminPassword) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid admin password",
    });
  }

  try {
    try {
      await runMiddleware(req, res, uploadSingleImage);
    } catch (err) {
      console.warn("Multer notice:", err.message);
    }

    const body = req.body || {};

    const id = typeof body.id === "string" ? body.id.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Valid MongoDB ID is required",
      });
    }

    const { db } = await connectToDatabase();
    const existingItem = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    let existingPhoneData = {};
    try {
      existingPhoneData = JSON.parse(existingItem.phone || "{}");
    } catch {}

    let imageUrl = existingPhoneData.imageUrl || "";

    // If a new image file is provided in update form:
    if (req.file) {
      // 1. Delete old image from R2
      if (imageUrl) {
        await deleteImageFromR2(imageUrl);
      }
      // 2. Process and upload new image to R2
      imageUrl = await processAndUploadImage(req.file.buffer, "products");
    }

    const updatedPhoneData = {
      ...existingPhoneData,
      imageUrl,
      description: description || existingPhoneData.description,
      category: category || existingPhoneData.category,
    };

    const updateData = {
      phone: JSON.stringify(updatedPhoneData),
    };
    if (name) updateData.name = name;

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      updatedId: id,
      imageUrl,
    });
  } catch (error) {
    console.error("MongoDB Update Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
