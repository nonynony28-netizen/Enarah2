import { MongoClient } from 'mongodb'
import { applySecurityHeaders, checkRateLimit, sanitizeString } from '../lib/security.js'

let cachedClient = null
let cachedDb = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing')
  }

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db('my_app_database')

  cachedClient = client
  cachedDb = db
  return { client, db }
}

export default async function handler(req, res) {
  applySecurityHeaders(res)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed',
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

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة',
      })
    }

    const { db } = await connectToDatabase()

    const newContactDoc = {
      name,
      email: message, // نخزن الرسالة داخل email
      phone,
      type: 'contact',
      createdAt: new Date()
    }

    const result = await db.collection('users').insertOne(newContactDoc)

    return res.status(200).json({
      success: true,
      message: 'تم حفظ الرسالة بنجاح',
      data: {
        _id: result.insertedId,
        ...newContactDoc
      },
    })
  } catch (error) {
    console.error('Contact Submit Error:', error)
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في السيرفر أثناء إرسال الرسالة',
      error: error.message
    })
  }
}
