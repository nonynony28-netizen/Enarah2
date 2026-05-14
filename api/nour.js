// file name: api/nour.js

import Groq from "groq-sdk";

export default async function handler(req, res) {
  // =========================================
  // CORS
  // =========================================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    // =========================================
    // ENV
    // =========================================
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY is missing",
      });
    }

    const groq = new Groq({
      apiKey,
    });

    // =========================================
    // SAFE URL + PROMPT EXTRACTION
    // =========================================
    let prompt = "";

    if (req.method === "POST") {
      prompt = req.body?.prompt || "";
    } else {
      const currentUrl = new URL(
        req.url,
        `https://${req.headers.host || "enarah2.vercel.app"}`
      );

      prompt = currentUrl.searchParams.get("prompt") || "";
    }

    // Default
    if (!prompt || typeof prompt !== "string") {
      prompt = "مرحبا";
    }

    // Clean
    prompt = prompt.trim().slice(0, 3000);

    // =========================================
    // AI REQUEST
    // =========================================
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 800,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد ذكاء اصطناعي احترافي لمتجر إنارة وكهرباء. ساعد العملاء في الإنارة، الثريات، LED، السبوتات، الأسلاك، والحلول الكهربائية بشكل مختصر وواضح.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      chatCompletion?.choices?.[0]?.message?.content?.trim() ||
      "تعذر إنشاء رد حالياً.";

    return res.status(200).json({
      success: true,
      prompt,
      response: responseText,
    });
  } catch (error) {
    console.error("Groq API Error:", error);

    let errorMessage = "Internal Server Error";

    if (
      error?.message?.includes("organization_restricted") ||
      error?.error?.error?.code === "organization_restricted"
    ) {
      errorMessage =
        "حساب Groq الحالي مقيّد. يرجى تحديث GROQ_API_KEY.";
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
