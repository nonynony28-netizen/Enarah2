// file name: api/get-users.js

import { MongoClient } from "mongodb";
import { handleWireAlertsGet } from "../lib/wireAlerts.js";

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

  // اسم قاعدة البيانات
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
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-admin-password, x-subscriber-token"
  );

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
    // Route Wire Alert GET actions (?action=vapid-public-key or ?action=my-subscriptions)
    const urlObj = new URL(req.url, "http://localhost");
    const action = urlObj.searchParams.get("action");
    if (action === "vapid-public-key" || action === "my-subscriptions") {
      return await handleWireAlertsGet(req, res, connectToDatabase);
    }

    // الاتصال
    const { db } = await connectToDatabase();

    // =====================================
    // جلب جميع البيانات
    // منتجات + رسائل العملاء + أسعار الأسلاك
    // =====================================
    const users = await db
      .collection("users")
      .find({})
      .sort({
        createdAt: -1,
      })
      .toArray();

    // التحقق من صلاحية كلمة مرور المسؤول
    const adminPassword = process.env.ADMIN_PASSWORD || "23127";
    const clientPassword = req.headers["x-admin-password"];
    const isAuthenticated = clientPassword === adminPassword;

    let filteredUsers = users;

    if (!isAuthenticated) {
      // للزوار العاديين: تصفية وحجب الرسائل والطلبات وإحصائيات الزوار
      // مع فرض التحكم الإداري بالكوبونات من جهة الخادم (مخفي افتراضياً وعند التعطيل لا يتم إرسال أي كود كوبون)
      let latestGameRewardSeen = false;
      filteredUsers = users
        .filter((item) => {
          const type = item.type || "product";
          const email = item.email || "";
          const isContact = type === "contact";
          const isAnalytics = email.includes("@analytics.local");
          if (email === "admin_game_rewards@app.local") {
            if (latestGameRewardSeen) return false;
            latestGameRewardSeen = true;
          }
          return !isContact && !isAnalytics;
        })
        .map((item) => {
          if (item.email === "admin_game_rewards@app.local") {
            try {
              const rawStr = item.rawPhone || item.phone || "{}";
              const parsed = JSON.parse(rawStr);
              const cfg = parsed.config || {};
              const enabled = cfg.isEnabled === true && cfg.v8AdminConfigured === true;
              return {
                ...item,
                phone: JSON.stringify({
                  type: "game_rewards",
                  config: enabled
                    ? cfg
                    : {
                        isEnabled: false,
                        rewardType: "no_reward",
                        couponCode: "",
                        discountTitle: "",
                        discountDetails: "",
                        giftItemName: "",
                        giftInstructions: "",
                        victoryMsg:
                          cfg.victoryMsg ||
                          "أنت بطل أسطوري حقيقي للإنارة! لقد عبرت المراحل الثماني وهزمت ملك الظلام الكهربائي بنجاح تام.",
                      },
                }),
              };
            } catch {
              return {
                ...item,
                phone: JSON.stringify({
                  type: "game_rewards",
                  config: { isEnabled: false, rewardType: "no_reward", couponCode: "" },
                }),
              };
            }
          }
          return item;
        });
    }

    // =====================================
    // إضافة type افتراضي للبيانات القديمة
    // product = المنتجات القديمة
    // contact = الرسائل الجديدة
    // =====================================
    const formattedUsers = filteredUsers.map((item) => ({
      ...item,
      type: item.type || "product",
    }));

    // =====================================
    // نجاح
    // =====================================
    return res.status(200).json({
      success: true,
      count: formattedUsers.length,
      data: formattedUsers,
      isAdmin: isAuthenticated,
    });
  } catch (error) {
    console.error("MongoDB Fetch Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
