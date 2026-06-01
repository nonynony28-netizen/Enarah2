# Enarah2 Project Handoff & Context Document

This document contains the complete context, history, design decisions, and state of the **Enarah2** project as of June 1, 2026. Share or point the new AI agent to this file to resume work seamlessly.

---

## 📋 Project Overview
* **Project Name:** Enarah2 (إنارة الحديثة)
* **Tech Stack:** React + Vite + TypeScript, Tailwind CSS v3, Framer Motion, Lucide icons.
* **Backend/APIs:** Vercel serverless functions (`/api/`) connecting to MongoDB.
* **AI Engine:** Groq API (Llama 3.3) via `/api/nour.js`.

---

## 🛠️ Implemented Features & Changes (Past Week)

### 1. Dynamic Product URLs (WebP Support)
* Changed the product image loading system to fetch images from URLs.
* Enabled WebP image support to maintain high-quality visuals with extremely small file sizes.

### 2. Interactive Lighting Simulator (Homepage)
* **Location:** [Home.tsx](file:///C:/Users/HP/.gemini/antigravity-ide/scratch/Enarah2/src/pages/Home.tsx)
* **Features:** A lightweight pure-CSS simulator where users toggle spotlights, cove LED strips, and color temperatures (3000K, 4000K, 6000K) dynamically.
* **Layout Adjustment:** The simulator visual card size is optimized to `max-w-[360px]` and `lg:w-[38%]`, while the controls occupy `lg:w-[62%]`.

### 3. Floating AI Chatbot Widget
* **Location:** [AIChatWidget.tsx](file:///C:/Users/HP/.gemini/antigravity-ide/scratch/Enarah2/src/components/AIChatWidget.tsx)
* **Details:** Floating chat assistant aligned beside the WhatsApp button. The trigger matches a lightbulb theme ("اسأل مساعدك الذكي 💡").
* **Functionality:** Clicking the lightbulb icon or the speech bubble opens a premium chat window talking directly to `/api/nour.js`.

### 4. Full-Screen Lightbox Gallery (Projects Page)
* **Files:** [Projects.tsx](file:///C:/Users/HP/.gemini/antigravity-ide/scratch/Enarah2/src/pages/Projects.tsx) and [Home.tsx](file:///C:/Users/HP/.gemini/antigravity-ide/scratch/Enarah2/src/pages/Home.tsx)
* **Details:** Clicking any project card opens a premium fullscreen gallery with sliding thumbnails, next/prev arrow controls, and glowing caption details.

### 5. Media Uploader & Admin Dashboard
* **Files:** `public/media-uploader.html` and `public/admin-dashboard.html`
* **Details:** Updated input forms to allow admins to upload multiple images by separating URLs with commas `,`.

---

## 🔑 Crucial Integrations & Credentials

1. **MongoDB Integration:**
   * Used for saving user contact entries and site statistics.
   * Connection string is stored in the environment variable `MONGODB_URI` on Vercel.

2. **Groq API Connection:**
   * Used by `/api/nour.js` serverless function.
   * Requires `GROQ_API_KEY` stored in Vercel. Ensure the key has positive credits to avoid `organization_restricted` status codes.

---

## 🚀 Next Steps & Open Tasks

1. **Test Vercel Deployment:** Check that the latest pushes build successfully on Vercel.
2. **Dashboard Lock (Security):** Secure `admin-dashboard.html` and `media-uploader.html` with basic authentication or a password to prevent unauthorized entries.
3. **Analytics Tracking:** Review and refine visitor data tracking to ensure it doesn't log duplicate records.
