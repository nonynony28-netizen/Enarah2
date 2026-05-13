// file name: api/app.js

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  // السماح بالوصول الخارجي (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // معالجة preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // يدعم GET ?prompt=...
    // ويدعم POST { "prompt": "..." }
    const prompt =
      req.method === "POST"
        ? req.body?.prompt || "Hello, how are you?"
        : req.query?.prompt || "Hello, how are you?";

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return res.status(200).json({
      success: true,
      prompt,
      response: chatCompletion.choices[0].message.content,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
