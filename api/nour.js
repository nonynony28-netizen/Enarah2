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
      let body = req.body;
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch (e) {}
      }
      prompt = body?.prompt || "";
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
          content: `أنت "مستشار الإنارة الحديثة"، مهندس ديكور ومصمم إضاءة محترف وخبير كهربائي لمتجر (الإنارة الحديثة). مهمتك الإجابة على أسئلة العملاء بدقة وعلمية بناءً على معلومات حقيقية وقواعد تصميم المساحات وتوزيع الإنارة والكهرباء:

قواعد الإجابة الفنية:
1. توزيع الإضاءة (سبوت لايت - Spotlights): المسافة المناسبة بين السبوتات عادة من 1 إلى 1.2 متر، وتكون بعيدة عن الجدار بـ 50-60 سم لتفادي الظلال الحادة.
2. درجات الألوان (Kelvin):
   - 3000K (أصفر دافئ): لغرف النوم والمعيشة والمجالس لإعطاء دفء وراحة.
   - 4000K (شمسي / أبيض دافئ): للمطبخ والمكتب والممرات للحفاظ على تباين الألوان الطبيعي.
   - 6000K (ثلجي / أبيض بارد): للمعارض والمستودعات والمساحات الخدمية.
3. مقاسات الأسلاك المناسبة للمساحات والأحمال (لشقة كاملة):
   - 1.5 مم: لدوائر الإنارة العادية.
   - 2.5 مم: للمقابس (البرايز) العادية والشواحن.
   - 4.0 مم: للمكيفات العادية (1.5 - 2 حصان) وسخانات المياه العادية والمطابخ.
   - 6.0 مم: للمكيفات الكبيرة (3 حصان فما فوق) والأفران الكهربائية واللوحات الفرعية.
   - 10 مم أو 16 مم: لكابل التغذية الرئيسي للشقة من العداد.
4. أجب دائماً باللغة العربية باحترافية، ودافع عن متجرنا (الإنارة الحديثة) بتقديم أفضل النصائح الفنية والاختيارات. كن ودوداً واختصر الإجابة في نقاط واضحة ومباشرة تناسب القراءة السريعة على شاشات الهواتف. لا تجب بإجابات عامة أو عشوائية بل ركز تماماً على تفاصيل سؤال العميل واستفساره البصري أو الفني.`,
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
