// file name: api/nour.js

import Groq from "groq-sdk";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // تأكد من وجود المفتاح
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY is missing",
      });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // قراءة prompt بشكل آمن
    let prompt =
      req.method === "POST"
        ? req.body?.prompt
        : req.query?.prompt;

    // fallback
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      prompt = "Hello, how are you?";
    }

    // حد أقصى للحجم لتجنب أخطاء 400
    prompt = prompt.trim().slice(0, 4000);

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content:
            "You are a professional AI assistant for lighting, electrical products, and customer support.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      chatCompletion?.choices?.[0]?.message?.content ||
      "No response generated.";

    return res.status(200).json({
      success: true,
      prompt,
      response: responseText,
    });
  } catch (error) {
    console.error("Groq API Error:", error);

    return res.status(500).json({
      success: false,
      error:
        error?.response?.data?.error?.message ||
        error.message ||
        "Internal Server Error",
    });
  }
}
