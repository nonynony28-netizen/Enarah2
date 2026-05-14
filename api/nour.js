// file name: api/nour.js

import Groq from "groq-sdk";

export default async function handler(req, res) {
  // =========================================
  // CORS CONFIG
  // =========================================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Allow only GET / POST
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    // =========================================
    // ENV CHECK
    // =========================================
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY is missing",
      });
    }

    // =========================================
    // INIT CLIENT
    // =========================================
    const groq = new Groq({
      apiKey: apiKey,
    });

    // =========================================
    // PROMPT EXTRACTION
    // =========================================
    let prompt = "";

    if (req.method === "POST") {
      prompt = req.body?.prompt || "";
    } else {
      const fullUrl = new URL(req.url, `https://${req.headers.host}`);
      prompt = fullUrl.searchParams.get("prompt") || "";
    }

    // Default fallback
    if (!prompt || typeof prompt !== "string") {
      prompt = "مرحبا";
    }

    // Clean + limit length
    prompt = prompt.trim().slice(0, 3000);

    // =========================================
    // GROQ REQUEST
    // =========================================
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 800,
      top_p: 1,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد ذكاء اصطناعي احترافي لمتجر إنارة وكهرباء. تساعد العملاء في الثريات، السبوتات، LED، الأسلاك، التأسيس الكهربائي، واختيار أفضل المنتجات. أجب بشكل واضح، مختصر، احترافي، ومفيد.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // =========================================
    // SAFE RESPONSE
    // =========================================
    const responseText =
      chatCompletion?.choices?.[0]?.message?.content?.trim() ||
      "تعذر إنشاء رد حالياً.";

    return res.status(200).json({
      success: true,
      prompt: prompt,
      response: responseText,
      provider: "Groq",
      model: "llama-3.3-70b-versatile",
    });
  } catch (error) {
    console.error("Groq API Error:", error);

    let errorMessage = "Internal Server Error";

    // =========================================
    // FRIENDLY ERRORS
    // =========================================
    if (
      error?.message?.includes("organization_restricted") ||
      error?.error?.error?.code === "organization_restricted"
    ) {
      errorMessage =
        "حساب Groq الحالي مقيّد. يرجى تحديث متغير GROQ_API_KEY بمفتاح فعال.";
    } else if (
      error?.message?.includes("invalid_api_key") ||
      error?.message?.includes("Incorrect API key")
    ) {
      errorMessage = "مفتاح GROQ_API_KEY غير صالح.";
    } else if (
      error?.message?.includes("rate_limit")
    ) {
      errorMessage = "تم تجاوز حد الطلبات المسموح حالياً.";
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
