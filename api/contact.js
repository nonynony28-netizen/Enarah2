import mongoose from 'mongoose'
import { applySecurityHeaders, checkRateLimit, sanitizeString } from '../lib/security.js'

const MONGO_URI = process.env.MONGODB_URI

if (!MONGO_URI) {
  throw new Error("MONGODB_URI environment variable is missing")
}

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGO_URI)
}

const UserSchema =
  new mongoose.Schema(
    {
      name: String,
      email: String,
      phone: String,
      type: {
        type: String,
        default: 'contact',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      collection: 'users',
    }
  )

const User =
  mongoose.models.User ||
  mongoose.model(
    'User',
    UserSchema
  )

export default async function handler(
  req,
  res
) {
  applySecurityHeaders(res)

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message:
        'Method Not Allowed',
    })
  }

  // Rate Limiting (max 10 contact submissions per minute per IP)
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "anonymous"
  if (!checkRateLimit(clientIp, 10, 60 * 1000)) {
    return res.status(429).json({
      success: false,
      message: 'تم تجاوز عدد المحاولات المسموح بها، يرجى الانتظار قليلاً والتكرار.',
    })
  }

  try {
    const rawName = typeof req.body?.name === 'string' ? req.body.name : ''
    const rawPhone = typeof req.body?.phone === 'string' ? req.body.phone : ''
    const rawMessage = typeof req.body?.message === 'string' ? req.body.message : ''

    const name = sanitizeString(rawName)
    const phone = sanitizeString(rawPhone)
    const message = sanitizeString(rawMessage)

    if (
      !name ||
      !phone ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          'جميع الحقول مطلوبة',
      })
    }

    // نفس قاعدة البيانات الحالية
    const newContact =
      await User.create({
        name,
        email: message, // نخزن الرسالة داخل email
        phone,
        type: 'contact',
      })

    return res.status(200).json({
      success: true,
      message:
        'تم حفظ الرسالة',
      data: newContact,
    })
  } catch (error) {
    console.error(
      'Contact Save Error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'خطأ في السيرفر',
    })
  }
}
