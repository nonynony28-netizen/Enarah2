// Endpoint: /api/log-error
// استقبال وتسجيل واستعراض أخطاء الإنتاج المجمعة (Error Monitoring & Grouping)

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
    throw new Error('MONGODB_URI is missing')
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anonymous'

  // 1. تسجيل خطأ جديد (POST)
  if (req.method === 'POST') {
    if (!checkRateLimit(clientIp, 60, 60 * 1000)) {
      return res.status(429).json({ success: false, message: 'Too many error reports' })
    }

    try {
      let payload = req.body;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch (_) {}
      }
      if (!payload || typeof payload !== 'object' || (!payload.message && !payload.action)) {
        const rawBody = await new Promise((resolve) => {
          let chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
          req.on('error', () => resolve(''));
        });
        if (rawBody) {
          try { payload = JSON.parse(rawBody); } catch (_) {}
        }
      }

      if (!payload || (!payload.message && !payload.action)) {
        return res.status(400).json({ success: false, message: 'Invalid payload' })
      }

      const { db } = await connectToDatabase()
      const errorLogsCollection = db.collection('error_logs')

      if (payload.action === 'resolve' && payload.errorHash) {
        await errorLogsCollection.updateOne(
          { errorHash: payload.errorHash },
          { $set: { status: 'resolved', resolvedAt: new Date() } }
        )
        return res.status(200).json({ success: true, message: 'Resolved' })
      }

      const errorHash = payload.errorHash || 'general_err'
      const cleanMessage = sanitizeString(String(payload.message)).slice(0, 1000)
      const cleanStack = sanitizeString(String(payload.stack || '')).slice(0, 3000)
      const cleanUrl = sanitizeString(String(payload.url || '')).slice(0, 500)
      const deviceType = payload.deviceType || 'unknown'
      const severity = payload.severity || 'error'

      // تجميع وتحديث العداد (Grouping & Deduplication)
      await errorLogsCollection.updateOne(
        { errorHash },
        {
          $inc: { count: 1 },
          $set: {
            message: cleanMessage,
            stack: cleanStack,
            lastUrl: cleanUrl,
            deviceType,
            severity,
            lastSeen: new Date(),
          },
          $setOnInsert: {
            firstSeen: new Date(),
            status: 'unresolved',
            resolutionNotes: ''
          }
        },
        { upsert: true }
      )

      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message })
    }
  }

  // 2. استعراض الأخطاء للمشرف في لوحة التحكم (GET)
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase()
      const errorLogsCollection = db.collection('error_logs')

      const limit = Math.min(100, parseInt(req.query.limit || '50', 10))
      const statusFilter = req.query.status || 'all'

      const query = {}
      if (statusFilter !== 'all') {
        query.status = statusFilter
      }

      const errors = await errorLogsCollection
        .find(query)
        .sort({ lastSeen: -1 })
        .limit(limit)
        .toArray()

      const totalCount = await errorLogsCollection.countDocuments()
      const unresolvedCount = await errorLogsCollection.countDocuments({ status: 'unresolved' })

      return res.status(200).json({
        success: true,
        data: errors,
        summary: {
          total: totalCount,
          unresolved: unresolvedCount
        }
      })
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message })
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' })
}
