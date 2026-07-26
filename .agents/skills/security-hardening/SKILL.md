---
name: security-hardening
description: Comprehensive security auditing, NoSQL injection prevention, XSS sanitization, rate limiting, and HTTP security header enforcement for web application backend and frontend.
---

# Security & Vulnerability Protection Skill (حماية الموقع من الثغرات والأمان)

## Overview
This skill provides automated security guidelines, input sanitization rules, rate-limiting guards, and HTTP security header enforcement for the `Enarah2` web application and its Vercel Serverless API endpoints.

---

## 🛡️ 1. Input Sanitization & NoSQL Injection Defense (الوقاية من هجمات الحقن)

### Core Rules:
1. **Never pass raw objects to database queries:**
   - **Incorrect:** `db.collection('users').find(req.body)`
   - **Correct:** Explicitly extract, cast, and sanitize each field:
     ```javascript
     const name = sanitizeString(req.body.name);
     const phone = sanitizeString(req.body.phone);
     ```
2. **Type Coercion:**
   - Always cast inputs to Primitive types (`String()`, `Number()`) to neutralize MongoDB query operator objects like `{ "$gt": "" }` or `{ "$ne": null }`.

---

## 🔒 2. Rate Limiting & DoS Shield (الوقاية من هجمات الإغراق والأرقام الوهمية)

- Enforce IP-based rate limiting on all submission APIs (`/api/save-user`, `/api/contact`, `/api/nour`):
  ```javascript
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(clientIp, 20, 60 * 1000)) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
  }
  ```

---

## 🌐 3. HTTP Security Headers & WAF (رؤوس الأمان وحماية المتصفح)

Every Vercel Serverless Function response MUST include HTTP Security Headers:
```javascript
res.setHeader("X-Frame-Options", "DENY");
res.setHeader("X-Content-Type-Options", "nosniff");
res.setHeader("X-XSS-Protection", "1; mode=block");
res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
```

---

## 🔐 4. API Keys & Secrets Isolation (حماية البيانات السرية)

- All sensitive keys (`MONGODB_URI`, `R2_SECRET_KEY`, `R2_ACCESS_KEY`, `JWT_SECRET`) MUST be stored in environment variables (`process.env`) and NEVER exposed in client-side JavaScript bundles.
