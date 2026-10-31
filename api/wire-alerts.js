// file name: api/wire-alerts.js
// Secure Smart Wire Price Alerts & Web Push Subscription API + Notification Trigger Engine

import crypto from "node:crypto";
import { MongoClient } from "mongodb";
import {
  getVapidKeys,
  sendWebPushNotification,
  evaluatePriceAlertRule,
  buildArabicAlertNotification,
} from "../lib/webPush.js";

const ALLOWED_WIRE_IDS = new Set(["1.5", "2.5", "4.0", "6.0", "10.0", "16.0", "25.0"]);
const ALLOWED_CONDITIONS = new Set(["down", "up", "any", "target"]);

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
  const db = client.db("my_app_database");
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

// Rate limiter per IP
const ipBuckets = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_REQ_PER_MIN = 30;

function checkRateLimit(ip) {
  const now = Date.now();
  const recent = (ipBuckets.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQ_PER_MIN) return false;
  recent.push(now);
  ipBuckets.set(ip, recent);
  return true;
}

export function hashSubscriberToken(token) {
  if (typeof token !== "string" || token.trim().length < 24 || token.trim().length > 128) {
    return null;
  }
  return crypto
    .createHash("sha256")
    .update(`enarah-sub-v7:${token.trim()}`)
    .digest("hex");
}

function validatePushSubscription(sub) {
  if (!sub || typeof sub !== "object") return null;
  const endpoint = typeof sub.endpoint === "string" ? sub.endpoint.trim() : "";
  const p256dh = typeof sub.keys?.p256dh === "string" ? sub.keys.p256dh.trim() : "";
  const auth = typeof sub.keys?.auth === "string" ? sub.keys.auth.trim() : "";

  if (!endpoint.startsWith("https://") || endpoint.length > 2048) return null;
  if (p256dh.length < 40 || p256dh.length > 256) return null;
  if (auth.length < 16 || auth.length > 128) return null;

  return {
    endpoint,
    keys: { p256dh, auth },
  };
}

/**
 * Trigger Engine: Evaluates committed price changes and dispatches Web Push notifications.
 * Enforces idempotency, threshold-crossing rules, unchanged-price suppression, and expired endpoint cleanup.
 */
export async function processCommittedWirePriceUpdate(db, previousPrices, newPrices, commitId) {
  if (!db || !newPrices || typeof newPrices !== "object") {
    return { evaluated: 0, triggered: 0, delivered: 0, expiredCleaned: 0, changedWires: [] };
  }

  const prevObj = previousPrices && typeof previousPrices === "object" ? previousPrices : {};
  const changedWires = [];

  for (const wireId of ALLOWED_WIRE_IDS) {
    const oldVal = parseFloat(prevObj[wireId]);
    const newVal = parseFloat(newPrices[wireId]);
    if (!isNaN(oldVal) && !isNaN(newVal) && oldVal > 0 && newVal > 0) {
      // Critical Rule: No notification for unchanged prices
      if (Math.abs(newVal - oldVal) >= 0.001) {
        changedWires.push({ wireId, oldPrice: oldVal, newPrice: newVal });
      }
    }
  }

  if (changedWires.length === 0) {
    return { evaluated: 0, triggered: 0, delivered: 0, expiredCleaned: 0, changedWires: [] };
  }

  const subsCol = db.collection("wire_alert_subscriptions");
  const jobsCol = db.collection("wire_alert_deliveries");

  let evaluated = 0;
  let triggered = 0;
  let delivered = 0;
  let expiredCleaned = 0;

  for (const change of changedWires) {
    const { wireId, oldPrice, newPrice } = change;
    const matchingSubs = await subsCol
      .find({ wireId, enabled: true })
      .toArray();

    for (const sub of matchingSubs) {
      evaluated++;
      const evalResult = evaluatePriceAlertRule(sub, oldPrice, newPrice);
      if (!evalResult.shouldNotify) continue;

      // Idempotent delivery key prevents duplicate alerts for the same committed update
      const deliveryKey = `${commitId}:${sub.ownerTokenHash}:${wireId}:${oldPrice}->${newPrice}`;
      const existingDelivery = await jobsCol.findOne({ deliveryKey });
      if (existingDelivery) continue;

      triggered++;
      const notificationPayload = buildArabicAlertNotification(
        wireId,
        oldPrice,
        newPrice,
        sub.condition,
        sub.targetPrice
      );

      let deliveryStatus = "recorded_local";
      let httpStatus = 200;
      let errorMsg = null;

      if (sub.pushSubscription && sub.pushSubscription.endpoint) {
        const pushRes = await sendWebPushNotification(
          sub.pushSubscription,
          notificationPayload
        );
        httpStatus = pushRes.status;
        if (pushRes.ok) {
          deliveryStatus = "push_delivered";
          delivered++;
        } else if (pushRes.expired) {
          deliveryStatus = "subscription_expired";
          expiredCleaned++;
          await subsCol.updateOne(
            { _id: sub._id },
            {
              $set: {
                pushSubscription: null,
                hasPush: false,
                pushExpiredAt: new Date(),
                updatedAt: new Date(),
              },
            }
          );
        } else {
          deliveryStatus = "push_failed";
          errorMsg = pushRes.error || "Push delivery failed";
        }
      }

      // Record delivery job & result
      await jobsCol.insertOne({
        deliveryKey,
        commitId: String(commitId),
        wireId,
        oldPrice,
        newPrice,
        condition: sub.condition,
        targetPrice: sub.targetPrice || null,
        status: deliveryStatus,
        httpStatus,
        error: errorMsg,
        createdAt: new Date(),
      });

      // Update lastNotifiedAt and threshold tracking on subscription
      await subsCol.updateOne(
        { _id: sub._id },
        {
          $set: {
            lastNotifiedAt: new Date(),
            lastNotifiedOldPrice: oldPrice,
            lastNotifiedNewPrice: newPrice,
            lastTriggeredTarget:
              sub.condition === "target" ? parseFloat(sub.targetPrice) : null,
          },
        }
      );
    }
  }

  return { evaluated, triggered, delivered, expiredCleaned, changedWires };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-subscriber-token, x-admin-password"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const clientIp =
    req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please wait a moment and try again.",
    });
  }

  try {
    if (req.method === "GET") {
      const urlObj = new URL(req.url, "http://localhost");
      const action = urlObj.searchParams.get("action") || "vapid-public-key";

      if (action === "vapid-public-key") {
        const { publicKey } = getVapidKeys();
        return res.status(200).json({
          success: true,
          publicKey,
        });
      }

      if (action === "my-subscriptions") {
        const rawToken =
          req.headers["x-subscriber-token"] ||
          urlObj.searchParams.get("subscriberToken") ||
          "";
        const ownerTokenHash = hashSubscriberToken(String(rawToken));
        if (!ownerTokenHash) {
          return res.status(401).json({
            success: false,
            error: "Valid subscriber ownership token is required",
          });
        }

        const { db } = await connectToDatabase();
        const items = await db
          .collection("wire_alert_subscriptions")
          .find({ ownerTokenHash })
          .project({
            _id: 0,
            wireId: 1,
            condition: 1,
            targetPrice: 1,
            enabled: 1,
            hasPush: 1,
            lastNotifiedAt: 1,
            lastNotifiedOldPrice: 1,
            lastNotifiedNewPrice: 1,
            updatedAt: 1,
          })
          .toArray();

        const normalizedItems = items.map((item) => ({
          ...item,
          wireSize: item.wireId,
          hasPushSubscription: Boolean(item.hasPush),
          deliveryMode: item.hasPush ? "push" : "local",
          lastTriggeredPrice: item.lastNotifiedNewPrice ?? null,
          lastTriggeredAt: item.lastNotifiedAt ?? null,
        }));

        return res.status(200).json({
          success: true,
          subscriptions: normalizedItems,
        });
      }

      return res.status(400).json({
        success: false,
        error: "Invalid GET action",
      });
    }

    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method Not Allowed",
      });
    }

    const body = typeof req.body === "object" && req.body ? req.body : {};
    const action = typeof body.action === "string" ? body.action.trim() : "upsert";
    const rawToken =
      req.headers["x-subscriber-token"] || body.subscriberToken || "";
    const ownerTokenHash = hashSubscriberToken(String(rawToken));

    if (!ownerTokenHash) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid subscriber ownership token",
      });
    }

    const { db } = await connectToDatabase();
    const subsCol = db.collection("wire_alert_subscriptions");

    if (action === "upsert") {
      const rawWire = body.wireId || body.wireSize || "";
      const wireId = typeof rawWire === "string" ? rawWire.trim() : "";
      const condition =
        typeof body.condition === "string" ? body.condition.trim() : "any";
      const enabled = body.enabled !== false;
      const targetPrice =
        condition === "target" ? parseFloat(body.targetPrice) : null;

      if (!ALLOWED_WIRE_IDS.has(wireId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid wireId",
        });
      }

      if (!ALLOWED_CONDITIONS.has(condition)) {
        return res.status(400).json({
          success: false,
          error: "Invalid alert condition",
        });
      }

      if (
        condition === "target" &&
        (targetPrice === null || isNaN(targetPrice) || targetPrice <= 0 || targetPrice > 100000)
      ) {
        return res.status(400).json({
          success: false,
          error: "Valid targetPrice greater than 0 is required for target condition",
        });
      }

      const validatedPush = validatePushSubscription(body.pushSubscription);

      const updateDoc = {
        ownerTokenHash,
        wireId,
        condition,
        targetPrice: condition === "target" ? Number(targetPrice.toFixed(2)) : null,
        enabled: Boolean(enabled),
        hasPush: Boolean(validatedPush),
        lastTriggeredTarget: null, // Reset threshold memory when user updates rule
        updatedAt: new Date(),
      };

      if (validatedPush) {
        updateDoc.pushSubscription = validatedPush;
      }

      await subsCol.updateOne(
        { ownerTokenHash, wireId },
        {
          $set: updateDoc,
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        subscription: {
          wireId,
          wireSize: wireId,
          condition: updateDoc.condition,
          targetPrice: updateDoc.targetPrice,
          enabled: updateDoc.enabled,
          hasPush: updateDoc.hasPush,
          deliveryMode: updateDoc.hasPush ? "push" : "local",
        },
      });
    }

    if (action === "delete") {
      const rawWire = body.wireId || body.wireSize || "";
      const wireId = typeof rawWire === "string" ? rawWire.trim() : "";
      if (wireId === "all") {
        await subsCol.deleteMany({ ownerTokenHash });
        return res.status(200).json({ success: true, deleted: "all" });
      }
      if (!ALLOWED_WIRE_IDS.has(wireId)) {
        return res.status(400).json({ success: false, error: "Invalid wireId" });
      }
      await subsCol.deleteOne({ ownerTokenHash, wireId });
      return res.status(200).json({ success: true, deleted: wireId });
    }

    if (action === "test-push") {
      const rawWire = body.wireId || body.wireSize || "2.5";
      const wireId = typeof rawWire === "string" ? rawWire.trim() : "2.5";
      const currentPrice = parseFloat(body.currentPrice) || 142;
      const simulatedNew = Math.max(10, Number((currentPrice - 5).toFixed(2)));

      const subDoc = await subsCol.findOne({ ownerTokenHash, wireId });
      const targetPush =
        validatePushSubscription(body.pushSubscription) ||
        subDoc?.pushSubscription;

      if (!targetPush) {
        return res.status(400).json({
          success: false,
          error: "No active push subscription found for this device",
        });
      }

      const payload = buildArabicAlertNotification(
        wireId,
        currentPrice,
        simulatedNew,
        subDoc?.condition || "down",
        subDoc?.targetPrice
      );

      const pushRes = await sendWebPushNotification(targetPush, payload);
      return res.status(pushRes.ok ? 200 : 502).json({
        success: pushRes.ok,
        status: pushRes.status,
        error: pushRes.error || null,
      });
    }

    return res.status(400).json({
      success: false,
      error: "Unsupported action",
    });
  } catch (err) {
    console.error("Wire Alerts API Error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
