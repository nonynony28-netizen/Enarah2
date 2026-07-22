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

    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    let incomingPhoneData = {};
    if (phone) {
      try {
        incomingPhoneData = JSON.parse(phone);
      } catch {}
    }

    const description = incomingPhoneData.description || (typeof body.description === "string" ? body.description.trim() : "");
    const category = incomingPhoneData.category || (typeof body.category === "string" ? body.category.trim() : "");
    const videoUrl = incomingPhoneData.videoUrl || (typeof body.videoUrl === "string" ? body.videoUrl.trim() : "");
    
    // Parse numeric/string values for pricing and inventory
    const priceRaw = incomingPhoneData.price !== undefined ? incomingPhoneData.price : body.price;
    const discountPriceRaw = incomingPhoneData.discountPrice !== undefined ? incomingPhoneData.discountPrice : body.discountPrice;
    const stockStatus = (incomingPhoneData.stockStatus || body.stockStatus || "available").trim().toLowerCase();
    const stockQtyRaw = incomingPhoneData.stockQty !== undefined ? incomingPhoneData.stockQty : body.stockQty;

    const price = priceRaw !== "" && priceRaw !== undefined ? parseFloat(priceRaw) : undefined;
    const discountPrice = discountPriceRaw !== "" && discountPriceRaw !== undefined ? parseFloat(discountPriceRaw) : undefined;
    const stockQty = stockQtyRaw !== "" && stockQtyRaw !== undefined ? parseInt(stockQtyRaw, 10) : undefined;

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
      videoUrl: videoUrl || existingPhoneData.videoUrl,
      price: price !== undefined ? price : existingPhoneData.price,
      discountPrice: discountPrice !== undefined ? discountPrice : existingPhoneData.discountPrice,
      stockStatus: stockStatus || existingPhoneData.stockStatus,
      stockQty: stockQty !== undefined ? stockQty : existingPhoneData.stockQty,
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
