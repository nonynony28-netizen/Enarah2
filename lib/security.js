// file name: lib/security.js

/**
 * In-memory store for IP Rate Limiting
 */
const rateLimitMap = new Map();

/**
 * Cleanup expired rate limit entries every 10 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

/**
 * Apply Security WAF HTTP Headers to Server Responses
 */
export function applySecurityHeaders(res) {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
}

/**
 * Rate Limiting Defense (IP-based)
 * @param {string} ip - Client IP
 * @param {number} maxRequests - Max requests allowed per window (default 30)
 * @param {number} windowMs - Window duration in ms (default 60000 = 1 min)
 */
export function checkRateLimit(ip, maxRequests = 30, windowMs = 60 * 1000) {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
  } else {
    clientData.count++;
  }

  rateLimitMap.set(ip, clientData);

  if (clientData.count > maxRequests) {
    return false; // Rate limit exceeded
  }
  return true;
}

/**
 * Sanitize Strings to prevent XSS & NoSQL query injection
 */
export function sanitizeString(str) {
  if (typeof str !== "string") return "";
  
  return str
    .replace(/\$/g, "") // Strip $ operator characters to prevent NoSQL query operator injection
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/["']/g, (match) => (match === '"' ? "&quot;" : "&#x27;"))
    .replace(/javascript:/gi, "")
    .replace(/eval\(/gi, "")
    .replace(/onload=/gi, "")
    .replace(/onerror=/gi, "")
    .trim();
}

/**
 * Deeply Sanitize JavaScript Objects against NoSQL Mongo Injection
 */
export function sanitizeObject(obj) {
  if (typeof obj !== "object" || obj === null) {
    return typeof obj === "string" ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const cleanObj = {};
  for (const key of Object.keys(obj)) {
    // Strip keys starting with $ or containing dots (Mongo operator injection)
    if (key.startsWith("$") || key.includes(".")) continue;
    cleanObj[key] = sanitizeObject(obj[key]);
  }
  return cleanObj;
}

/**
 * AI Chatbot Prompt Injection & Jailbreak Defense Firewall
 */
export function inspectChatPrompt(prompt) {
  if (typeof prompt !== "string") {
    return { isSafe: false, cleanPrompt: "مرحبا" };
  }

  const rawPrompt = prompt.trim();
  if (rawPrompt.length === 0) {
    return { isSafe: false, cleanPrompt: "مرحبا" };
  }

  // Common Prompt Injection / Jailbreak Attack Patterns
  const injectionPatterns = [
    /ignore\s+all\s+(previous|prior|above)\s+instructions/i,
    /disregard\s+system\s+prompt/i,
    /override\s+system\s+prompt/i,
    /forget\s+everything/i,
    /you\s+are\s+now\s+(dan|jailbroken|unfiltered)/i,
    /reveal\s+(your|the)\s+system\s+(prompt|instructions|key)/i,
    /print\s+(your|the)\s+(system|api|key)/i,
    /show\s+(me\s+)?(your|the)\s+prompt/i,
    /what\s+is\s+your\s+system\s+prompt/i,
    /system_prompt/i,
    /eval\(/i,
    /process\.env/i,
    /<script/i,
    /javascript:/i
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(rawPrompt)) {
      return {
        isSafe: false,
        cleanPrompt: "عذراً، أنا مستشار الإنارة الحديثة الفني والكهربائي المخصص للإجابة على استفسارات الإنارة والتأسيس فقط. كيف يمكنني مساعدتك اليوم في مشروعك أو منزلكم؟",
        isAttack: true
      };
    }
  }

  // Maximum character length for chat prompt
  const cleanPrompt = rawPrompt.slice(0, 800);
  return { isSafe: true, cleanPrompt, isAttack: false };
}
