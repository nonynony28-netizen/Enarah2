// file name: lib/webPush.js
// Standards-based RFC 8291 (aes128gcm) + RFC 8292 (VAPID ES256) Web Push Engine
// Built using Node.js native crypto — zero external dependencies, never exposes private keys.

import crypto from "node:crypto";

function base64UrlEncode(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(str) {
  const normalized = String(str)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, "base64");
}

/**
 * Derives or loads the server VAPID P-256 keypair.
 * Uses a stable seed (VAPID_SECRET_SEED) so the public key never changes unexpectedly across serverless cold starts.
 * Private scalar is kept strictly server-side; only the 65-byte uncompressed public key is shared.
 */
export function getVapidKeys() {
  const secretSeed =
    process.env.VAPID_SECRET_SEED ||
    "enarah-modern-libya-official-vapid-seed-v9";

  // Derive a valid 32-byte P-256 private key deterministically via HKDF
  const rawPriv = Buffer.from(
    crypto.hkdfSync(
      "sha256",
      Buffer.from(secretSeed, "utf-8"),
      Buffer.from("enarah-vapid-salt-v9", "utf-8"),
      Buffer.from("enarah-vapid-p256-key", "utf-8"),
      32
    )
  );

  const ecdh = crypto.createECDH("prime256v1");
  ecdh.setPrivateKey(rawPriv);
  const pubUncompressed = ecdh.getPublicKey(); // 65 bytes (0x04 || X || Y)

  const x = pubUncompressed.subarray(1, 33);
  const y = pubUncompressed.subarray(33, 65);

  const privateKeyObject = crypto.createPrivateKey({
    key: {
      kty: "EC",
      crv: "P-256",
      x: base64UrlEncode(x),
      y: base64UrlEncode(y),
      d: base64UrlEncode(rawPriv),
    },
    format: "jwk",
  });

  return {
    publicKey: base64UrlEncode(pubUncompressed),
    publicKeyBuffer: pubUncompressed,
    privateKeyObject,
  };
}

/**
 * Creates an RFC 8292 VAPID Authorization header for the target push service origin.
 */
export function createVapidAuthHeader(endpointUrl, subject = "mailto:info@enarahmodern.com") {
  const parsed = new URL(endpointUrl);
  const audience = `${parsed.protocol}//${parsed.host}`;
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600;

  const { publicKey, privateKeyObject } = getVapidKeys();

  const header = base64UrlEncode(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      aud: audience,
      exp,
      sub: subject,
    })
  );

  const signingInput = `${header}.${payload}`;
  const signature = crypto.sign("sha256", Buffer.from(signingInput, "utf-8"), {
    key: privateKeyObject,
    dsaEncoding: "ieee-p1363",
  });

  const jwt = `${signingInput}.${base64UrlEncode(signature)}`;
  return `vapid t=${jwt}, k=${publicKey}`;
}

/**
 * Encrypts a UTF-8 JSON payload according to RFC 8291 (aes128gcm) for Web Push.
 */
export function encryptWebPushPayload(payloadString, p256dhBase64Url, authBase64Url) {
  const clientPublicKey = base64UrlDecode(p256dhBase64Url);
  const clientAuth = base64UrlDecode(authBase64Url);

  if (clientPublicKey.length !== 65 || clientPublicKey[0] !== 0x04) {
    throw new Error("Invalid subscriber p256dh public key");
  }
  if (clientAuth.length < 16) {
    throw new Error("Invalid subscriber auth secret");
  }

  const localEcdh = crypto.createECDH("prime256v1");
  localEcdh.generateKeys();
  const serverPublicKey = localEcdh.getPublicKey(); // 65 bytes
  const sharedSecret = localEcdh.computeSecret(clientPublicKey);

  const salt = crypto.randomBytes(16);

  // RFC 8291 Section 3.3 key derivation
  const keyInfo = Buffer.concat([
    Buffer.from("WebPush: info\0", "utf-8"),
    clientPublicKey,
    serverPublicKey,
  ]);
  const prkKey = Buffer.from(
    crypto.hkdfSync("sha256", sharedSecret, clientAuth, keyInfo, 32)
  );

  const cekInfo = Buffer.from("Content-Encoding: aes128gcm\0", "utf-8");
  const contentEncryptionKey = Buffer.from(
    crypto.hkdfSync("sha256", prkKey, salt, cekInfo, 16)
  );

  const nonceInfo = Buffer.from("Content-Encoding: nonce\0", "utf-8");
  const nonce = Buffer.from(
    crypto.hkdfSync("sha256", prkKey, salt, nonceInfo, 12)
  );

  // Plaintext + 0x02 final record delimiter (RFC 8188)
  const plaintext = Buffer.concat([
    Buffer.from(payloadString, "utf-8"),
    Buffer.from([0x02]),
  ]);

  const cipher = crypto.createCipheriv("aes-128-gcm", contentEncryptionKey, nonce);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // RFC 8188 Header: salt (16) + rs (4, uint32BE = 4096) + idlen (1, uint8 = 65) + keyid (65)
  const recordSizeBuf = Buffer.alloc(4);
  recordSizeBuf.writeUInt32BE(4096, 0);
  const idLenBuf = Buffer.from([serverPublicKey.length]);

  const header = Buffer.concat([salt, recordSizeBuf, idLenBuf, serverPublicKey]);
  return Buffer.concat([header, encrypted, authTag]);
}

/**
 * Decrypts an RFC 8291 (aes128gcm) Web Push payload buffer (used for automated roundtrip verification).
 */
export function decryptWebPushPayload(encryptedBuffer, subscriberEcdh, authSecretBuffer) {
  const salt = encryptedBuffer.subarray(0, 16);
  const recordSize = encryptedBuffer.readUInt32BE(16);
  const idLen = encryptedBuffer.readUInt8(20);
  const serverPublicKey = encryptedBuffer.subarray(21, 21 + idLen);
  const ciphertextWithTag = encryptedBuffer.subarray(21 + idLen);
  const ciphertext = ciphertextWithTag.subarray(0, ciphertextWithTag.length - 16);
  const authTag = ciphertextWithTag.subarray(ciphertextWithTag.length - 16);

  const clientPublicKey = subscriberEcdh.getPublicKey();
  const sharedSecret = subscriberEcdh.computeSecret(serverPublicKey);

  const keyInfo = Buffer.concat([
    Buffer.from("WebPush: info\0", "utf-8"),
    clientPublicKey,
    serverPublicKey,
  ]);
  const prkKey = Buffer.from(
    crypto.hkdfSync("sha256", sharedSecret, authSecretBuffer, keyInfo, 32)
  );

  const cekInfo = Buffer.from("Content-Encoding: aes128gcm\0", "utf-8");
  const contentEncryptionKey = Buffer.from(
    crypto.hkdfSync("sha256", prkKey, salt, cekInfo, 16)
  );

  const nonceInfo = Buffer.from("Content-Encoding: nonce\0", "utf-8");
  const nonce = Buffer.from(
    crypto.hkdfSync("sha256", prkKey, salt, nonceInfo, 12)
  );

  const decipher = crypto.createDecipheriv("aes-128-gcm", contentEncryptionKey, nonce);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  // Strip trailing 0x02 delimiter
  if (decrypted[decrypted.length - 1] !== 0x02) {
    throw new Error("Missing RFC 8188 0x02 record delimiter");
  }
  return {
    recordSize,
    plaintext: decrypted.subarray(0, decrypted.length - 1).toString("utf-8"),
  };
}

/**
 * Sends an encrypted Web Push notification to a subscriber endpoint with retry handling.
 */
export async function sendWebPushNotification(subscription, payloadObj) {
  if (
    !subscription ||
    typeof subscription.endpoint !== "string" ||
    !subscription.endpoint.startsWith("https://") ||
    !subscription.keys?.p256dh ||
    !subscription.keys?.auth
  ) {
    return { ok: false, status: 400, expired: false, error: "Invalid push subscription object" };
  }

  const payloadString =
    typeof payloadObj === "string" ? payloadObj : JSON.stringify(payloadObj);

  const bodyBuffer = encryptWebPushPayload(
    payloadString,
    subscription.keys.p256dh,
    subscription.keys.auth
  );
  const vapidAuthorization = createVapidAuthHeader(subscription.endpoint);

  let lastError = null;
  let lastStatus = 500;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(subscription.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Encoding": "aes128gcm",
          "Content-Length": String(bodyBuffer.length),
          TTL: "86400",
          Urgency: "high",
          Authorization: vapidAuthorization,
        },
        body: bodyBuffer,
      });

      lastStatus = response.status;

      if (response.status >= 200 && response.status < 300) {
        return { ok: true, status: response.status, expired: false };
      }

      // 404 or 410 indicates the subscription has expired or been unsubscribed
      if (response.status === 404 || response.status === 410) {
        return { ok: false, status: response.status, expired: true, error: "Subscription expired" };
      }

      const respText = await response.text().catch(() => "");
      lastError = `HTTP ${response.status}${respText ? `: ${respText.slice(0, 120)}` : ""}`;
      // Retry only on 5xx or 429
      if (response.status < 500 && response.status !== 429) {
        break;
      }
    } catch (err) {
      lastError = err.message || "Network error";
    }
  }

  return { ok: false, status: lastStatus, expired: false, error: lastError };
}

/**
 * Evaluates whether a single alert rule should fire given oldPrice and newPrice.
 * Implements strict threshold-crossing and unchanged-price rules.
 */
export function evaluatePriceAlertRule(rule, oldPrice, newPrice) {
  if (
    typeof oldPrice !== "number" ||
    typeof newPrice !== "number" ||
    isNaN(oldPrice) ||
    isNaN(newPrice) ||
    oldPrice <= 0 ||
    newPrice <= 0
  ) {
    return { shouldNotify: false, reason: "invalid_prices" };
  }

  // Critical Rule 1: Never notify when price is unchanged
  if (Math.abs(newPrice - oldPrice) < 0.001) {
    return { shouldNotify: false, reason: "unchanged_price" };
  }

  if (!rule || rule.enabled === false) {
    return { shouldNotify: false, reason: "disabled" };
  }

  // Suppress duplicate notification if the exact same newPrice was already notified for this rule
  if (
    rule.lastNotifiedNewPrice !== undefined &&
    rule.lastNotifiedNewPrice !== null &&
    Math.abs(Number(rule.lastNotifiedNewPrice) - newPrice) < 0.001
  ) {
    return { shouldNotify: false, reason: "duplicate_price_already_notified" };
  }

  const condition = rule.condition; // 'down' | 'up' | 'any' | 'target'

  if (condition === "down") {
    if (newPrice < oldPrice) {
      return { shouldNotify: true, reason: "price_decreased" };
    }
    return { shouldNotify: false, reason: "not_decreased" };
  }

  if (condition === "up") {
    if (newPrice > oldPrice) {
      return { shouldNotify: true, reason: "price_increased" };
    }
    return { shouldNotify: false, reason: "not_increased" };
  }

  if (condition === "any") {
    return { shouldNotify: true, reason: "price_changed" };
  }

  if (condition === "target") {
    const target = parseFloat(rule.targetPrice);
    if (isNaN(target) || target <= 0) {
      return { shouldNotify: false, reason: "invalid_target" };
    }

    // Threshold-crossing logic:
    // If already notified for this target threshold, do not repeatedly notify unless price moved back outside and crossed again
    if (
      rule.lastTriggeredTarget !== undefined &&
      rule.lastTriggeredTarget !== null &&
      Math.abs(Number(rule.lastTriggeredTarget) - target) < 0.001
    ) {
      return { shouldNotify: false, reason: "target_already_triggered" };
    }

    const crossedDown = oldPrice > target && newPrice <= target;
    const crossedUp = oldPrice < target && newPrice >= target;
    const exactMatchFirstTime = Math.abs(newPrice - target) < 0.001;

    if (crossedDown || crossedUp || exactMatchFirstTime) {
      return { shouldNotify: true, reason: "target_crossed" };
    }
    return { shouldNotify: false, reason: "not_reached_threshold" };
  }

  return { shouldNotify: false, reason: "unknown_condition" };
}

/**
 * Formats the Arabic notification message using real database values.
 */
export function buildArabicAlertNotification(wireSizeLabel, oldPrice, newPrice, condition, targetPrice) {
  const isDown = newPrice < oldPrice;
  const actionVerb = isDown ? "انخفض" : "ارتفع";
  const rawId = String(wireSizeLabel).replace(/\s*مم²?$/, "").trim();
  const cleanSize = `${rawId} مم²`;

  const title = `تنبيه سعر سلك ${cleanSize} — الإنارة الحديثة`;
  let headline = `${actionVerb} سعر سلك النحاس الإيطالي مقاس ${cleanSize}.`;
  if (condition === "target" && targetPrice) {
    headline = `وصل سعر سلك النحاس الإيطالي مقاس ${cleanSize} إلى السعر المستهدف (${Number(targetPrice).toFixed(2)} د.ل).`;
  }

  const body = [
    headline,
    `السعر السابق: ${Number(oldPrice).toFixed(2)} د.ل`,
    `السعر الجديد: ${Number(newPrice).toFixed(2)} د.ل`,
    "اضغط لفتح جدول الأسعار المعتمد.",
  ].join("\n");

  return {
    title,
    body,
    icon: "/mascot.png",
    badge: "/mascot.png",
    url: `/wire-prices?wire=${encodeURIComponent(rawId)}`,
    tag: `enarah-wire-price-${rawId}`,
    dir: "rtl",
    lang: "ar",
    wireId: rawId,
    wireSize: cleanSize,
    oldPrice: Number(oldPrice),
    newPrice: Number(newPrice),
    timestamp: new Date().toISOString(),
    data: {
      url: `/wire-prices?wire=${encodeURIComponent(rawId)}`,
      wireId: rawId,
      oldPrice: Number(oldPrice),
      newPrice: Number(newPrice),
    },
  };
}
