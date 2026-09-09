import { applySecurityHeaders, checkRateLimit, sanitizeString } from '../lib/security.js'
import clientPromise from '../lib/mongodb.js'

// In-memory fallback in case MongoDB is unreachable or during serverless lifecycle
let inMemoryLeaderboard = []

// Compute standard week key (Saturday to Friday cycle)
function getWeekKey(date = new Date()) {
  const day = date.getDay()
  const diffToSaturday = (day + 1) % 7
  const saturday = new Date(date)
  saturday.setDate(date.getDate() - diffToSaturday)
  saturday.setHours(0, 0, 0, 0)
  
  const weekNum = Math.ceil((((saturday.getTime() - new Date(saturday.getFullYear(), 0, 1).getTime()) / 86400000) + 1) / 7)
  return `${saturday.getFullYear()}-W${weekNum}`
}

export default async function handler(req, res) {
  applySecurityHeaders(res)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const currentWeekKey = getWeekKey()

  // Rate Limiting (max 30 requests per minute per IP)
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anonymous'
  if (!checkRateLimit(clientIp, 30, 60 * 1000)) {
    return res.status(429).json({
      success: false,
      message: 'تم تجاوز عدد المحاولات المسموح بها، يرجى الانتظار قليلاً.',
    })
  }

  // Handle GET (Fetch Weekly Leaderboard)
  if (req.method === 'GET') {
    const requestedWeek = req.query?.week || currentWeekKey
    
    try {
      if (clientPromise && process.env.MONGODB_URI) {
        const client = await Promise.race([
          clientPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Mongo Timeout')), 2500))
        ])
        const db = client.db('my_app_database')
        const entries = await db
          .collection('weekly_leaderboard')
          .find({ weekKey: requestedWeek })
          .sort({ score: -1, timeTakenSec: 1 })
          .limit(10)
          .toArray()

        return res.status(200).json({
          success: true,
          weekId: requestedWeek,
          entries: entries.map(e => ({
            id: e._id?.toString() || e.id,
            name: e.name,
            city: e.city,
            score: e.score,
            timeTakenSec: e.timeTakenSec,
            date: e.date || 'هذا الأسبوع',
            weekKey: e.weekKey,
          })),
        })
      }
    } catch (err) {
      // Fallback to in-memory store
    }

    const filtered = inMemoryLeaderboard
      .filter(e => e.weekKey === requestedWeek)
      .sort((a, b) => b.score - a.score || a.timeTakenSec - b.timeTakenSec)
      .slice(0, 10)

    return res.status(200).json({
      success: true,
      weekId: requestedWeek,
      entries: filtered,
    })
  }

  // Handle POST (Submit Score to Weekly Leaderboard)
  if (req.method === 'POST') {
    try {
      const rawName = typeof req.body?.name === 'string' ? req.body.name : ''
      const rawCity = typeof req.body?.city === 'string' ? req.body.city : 'بنغازي'
      const rawScore = Number(req.body?.score) || 0
      const rawTime = Number(req.body?.timeTakenSec) || 60
      const entryWeek = req.body?.weekId || currentWeekKey

      const name = sanitizeString(rawName).trim()
      const city = sanitizeString(rawCity).trim() || 'بنغازي'

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'اسم البطل مطلوب لتسجيل النتيجة في لوحة الشرف الأسبوعية',
        })
      }

      const newEntry = {
        id: Date.now().toString(),
        name,
        city,
        score: Math.min(Math.max(rawScore, 0), 10000),
        timeTakenSec: Math.max(rawTime, 10),
        weekKey: entryWeek,
        date: 'هذا الأسبوع',
        createdAt: new Date(),
      }

      // Add to in-memory store
      inMemoryLeaderboard = [newEntry, ...inMemoryLeaderboard]

      // Save to MongoDB if available
      try {
        if (clientPromise && process.env.MONGODB_URI) {
          const client = await Promise.race([
            clientPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Mongo Timeout')), 2500))
          ])
          const db = client.db('my_app_database')
          await db.collection('weekly_leaderboard').insertOne(newEntry)
        }
      } catch (err) {
        // Continue with memory store response
      }

      return res.status(200).json({
        success: true,
        message: 'تم تسجيل اسمك بنجاح في لوحة شرف أبطال هذا الأسبوع!',
        entry: newEntry,
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء تسجيل النتيجة',
      })
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed',
  })
}
