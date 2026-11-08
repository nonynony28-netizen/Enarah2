import { applySecurityHeaders, checkRateLimit, sanitizeString } from '../lib/security.js'

// Lazy-load MongoDB client promise only when MONGODB_URI is configured so the endpoint
// never crashes at module import time when running in local/fallback mode.
let cachedMongoModulePromise = null
async function getMongoClient() {
  if (!process.env.MONGODB_URI) return null
  if (!cachedMongoModulePromise) {
    cachedMongoModulePromise = import('../lib/mongodb.js').then((m) => m.default)
  }
  const clientPromise = await cachedMongoModulePromise
  return Promise.race([
    clientPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Mongo Timeout')), 2500)),
  ])
}

// In-memory store for serverless warm instances / local fallback
let inMemoryLeaderboard = []

const TRIPOLI_OFFSET_MS = 2 * 60 * 60 * 1000 // Africa/Tripoli is UTC+2 year-round
const MIN_VALID_SCORE = 100
const MAX_VALID_SCORE = 45000
const MIN_VALID_TIME_SEC = 20
const MAX_VALID_TIME_SEC = 36000
const MAX_POINTS_PER_SECOND = 260

/**
 * Computes the canonical Saturday-to-Friday 7-day week in Africa/Tripoli (UTC+2)
 * so frontend and backend always calculate identical week boundaries regardless of server timezone.
 */
export function getTripoliWeekInfo(date = new Date()) {
  const tripoliNow = new Date(date.getTime() + TRIPOLI_OFFSET_MS)
  const day = tripoliNow.getUTCDay() // 0 = Sun ... 6 = Sat
  const diffToSaturday = (day + 1) % 7

  const saturday = new Date(
    Date.UTC(
      tripoliNow.getUTCFullYear(),
      tripoliNow.getUTCMonth(),
      tripoliNow.getUTCDate() - diffToSaturday,
      0,
      0,
      0,
      0
    )
  )

  const prevSaturday = new Date(saturday.getTime() - 7 * 86400000)

  const formatYMD = (d) =>
    `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`

  const yearStart = new Date(Date.UTC(saturday.getUTCFullYear(), 0, 1))
  const weekNum = Math.ceil(((saturday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)

  return {
    weekId: formatYMD(saturday),
    prevWeekId: formatYMD(prevSaturday),
    legacyWeekKey: `${saturday.getUTCFullYear()}-W${weekNum}`,
  }
}

export function sortAndRankEntries(entries, limit = 15) {
  return [...entries]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (a.timeTakenSec !== b.timeTakenSec) return a.timeTakenSec - b.timeTakenSec
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return tA - tB
    })
    .slice(0, limit)
    .map((entry, idx) => ({
      id: entry._id?.toString() || entry.id,
      playerId: entry.playerId || null,
      rank: idx + 1,
      name: entry.name,
      city: entry.city,
      score: entry.score,
      timeTakenSec: entry.timeTakenSec,
      date: entry.date || 'هذا الأسبوع',
      weekKey: entry.weekKey,
    }))
}

export default async function handler(req, res) {
  applySecurityHeaders(res)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const weekInfo = getTripoliWeekInfo()
  const currentWeekKey = weekInfo.weekId

  // Rate Limiting (max 30 requests per minute per IP)
  const clientIp = req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'anonymous'
  if (!checkRateLimit(clientIp, 30, 60 * 1000)) {
    return res.status(429).json({
      success: false,
      message: 'تم تجاوز عدد المحاولات المسموح بها، يرجى الانتظار قليلاً.',
    })
  }

  // Handle GET (Fetch Weekly Leaderboard)
  if (req.method === 'GET') {
    const rawRequested = typeof req.query?.week === 'string' ? sanitizeString(req.query.week).trim() : ''
    const requestedWeek = rawRequested || currentWeekKey
    const matchKeys =
      requestedWeek === currentWeekKey
        ? [currentWeekKey, weekInfo.legacyWeekKey]
        : [requestedWeek]

    try {
      const client = await getMongoClient()
      if (client) {
        const db = client.db('my_app_database')
        const rawEntries = await db
          .collection('weekly_leaderboard')
          .find({ weekKey: { $in: matchKeys } })
          .sort({ score: -1, timeTakenSec: 1, createdAt: 1 })
          .limit(40)
          .toArray()

        // Deduplicate by playerId or normalized name+city keeping best score per player
        const dedupedMap = new Map()
        for (const item of rawEntries) {
          const key = item.playerId || `${String(item.name || '').toLowerCase()}_${String(item.city || '').toLowerCase()}`
          const existing = dedupedMap.get(key)
          if (
            !existing ||
            item.score > existing.score ||
            (item.score === existing.score && item.timeTakenSec < existing.timeTakenSec)
          ) {
            dedupedMap.set(key, item)
          }
        }

        const ranked = sortAndRankEntries(Array.from(dedupedMap.values()), 15)
        return res.status(200).json({
          success: true,
          serverTimeMs: Date.now(),
          weekId: requestedWeek,
          currentWeekId: currentWeekKey,
          prevWeekId: weekInfo.prevWeekId,
          entries: ranked,
        })
      }
    } catch (err) {
      // Fallback to in-memory store
    }

    const filtered = inMemoryLeaderboard.filter((e) => matchKeys.includes(e.weekKey))
    const ranked = sortAndRankEntries(filtered, 15)

    return res.status(200).json({
      success: true,
      serverTimeMs: Date.now(),
      weekId: requestedWeek,
      currentWeekId: currentWeekKey,
      prevWeekId: weekInfo.prevWeekId,
      entries: ranked,
    })
  }

  // Handle POST (Submit Validated Score to Weekly Leaderboard)
  if (req.method === 'POST') {
    try {
      const body = req.body && typeof req.body === 'object' ? req.body : {}
      const rawName = typeof body.name === 'string' ? body.name : ''
      const rawCity = typeof body.city === 'string' ? body.city : 'بنغازي'
      const rawPlayerId = typeof body.playerId === 'string' ? body.playerId : ''
      const rawScore = Number(body.score)
      const rawTime = Number(body.timeTakenSec)

      const name = sanitizeString(rawName).replace(/\s+/g, ' ').trim().slice(0, 36)
      const city = (sanitizeString(rawCity).replace(/\s+/g, ' ').trim() || 'بنغازي').slice(0, 28)
      const playerId = sanitizeString(rawPlayerId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)

      if (!name || name.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'يرجى إدخال اسم صحيح (حرفين على الأقل) لتسجيل النتيجة في لوحة الشرف الأسبوعية.',
        })
      }

      if (!Number.isFinite(rawScore) || rawScore < MIN_VALID_SCORE || rawScore > MAX_VALID_SCORE) {
        return res.status(400).json({
          success: false,
          message: 'قيمة النقاط غير صالحة أو خارج النطاق المسموح به.',
        })
      }

      if (!Number.isFinite(rawTime) || rawTime < MIN_VALID_TIME_SEC || rawTime > MAX_VALID_TIME_SEC) {
        return res.status(400).json({
          success: false,
          message: 'وقت اللعب غير صالح.',
        })
      }

      const score = Math.round(rawScore)
      const timeTakenSec = Math.round(rawTime)

      // Plausibility check against forged high-score + impossible completion time
      if (score > 6000 && score / timeTakenSec > MAX_POINTS_PER_SECOND) {
        return res.status(400).json({
          success: false,
          message: 'النتيجة المرسلة لا تتوافق مع مدة اللعب الفعلية.',
        })
      }

      // Use valid YYYY-MM-DD weekId when provided, otherwise default to server-authoritative Tripoli currentWeekKey
      const rawWeekId = typeof body.weekId === 'string' ? body.weekId.trim() : ''
      const entryWeek = /^\d{4}-\d{2}-\d{2}$/.test(rawWeekId) ? rawWeekId : currentWeekKey
      const identityKey = playerId || `${name.toLowerCase()}_${city.toLowerCase()}`

      const newEntry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        playerId: identityKey,
        name,
        city,
        score,
        timeTakenSec,
        weekKey: entryWeek,
        date: 'هذا الأسبوع',
        createdAt: new Date(),
      }

      // Deduplicate in-memory store for the same player in the same week
      const existingIdx = inMemoryLeaderboard.findIndex(
        (e) =>
          e.weekKey === entryWeek &&
          (e.playerId === identityKey ||
            `${e.name.toLowerCase()}_${e.city.toLowerCase()}` === `${name.toLowerCase()}_${city.toLowerCase()}`)
      )

      let improved = true
      if (existingIdx !== -1) {
        const prev = inMemoryLeaderboard[existingIdx]
        if (
          score > prev.score ||
          (score === prev.score && timeTakenSec < prev.timeTakenSec)
        ) {
          inMemoryLeaderboard[existingIdx] = {
            ...prev,
            name,
            city,
            score,
            timeTakenSec,
          }
        } else {
          improved = false
        }
      } else {
        inMemoryLeaderboard.push(newEntry)
      }

      // Persist to MongoDB if available (upsert only when score improves)
      try {
        const client = await getMongoClient()
        if (client) {
          const db = client.db('my_app_database')
          const col = db.collection('weekly_leaderboard')
          const existingDoc = await col.findOne({
            weekKey: entryWeek,
            $or: [{ playerId: identityKey }, { name, city }],
          })

          if (!existingDoc) {
            await col.insertOne(newEntry)
          } else if (
            score > existingDoc.score ||
            (score === existingDoc.score && timeTakenSec < existingDoc.timeTakenSec)
          ) {
            await col.updateOne(
              { _id: existingDoc._id },
              {
                $set: {
                  playerId: identityKey,
                  name,
                  city,
                  score,
                  timeTakenSec,
                  updatedAt: new Date(),
                },
              }
            )
          } else {
            improved = false
          }
        }
      } catch (err) {
        // Continue with in-memory store response
      }

      const currentWeekRanked = sortAndRankEntries(
        inMemoryLeaderboard.filter((e) => e.weekKey === entryWeek),
        15
      )

      return res.status(200).json({
        success: true,
        serverTimeMs: Date.now(),
        updated: improved,
        weekId: entryWeek,
        message: improved
          ? 'تم تسجيل اسمك بنجاح في لوحة شرف أبطال هذا الأسبوع!'
          : 'لديك نتيجة أعلى مسجلة بالفعل في لوحة شرف هذا الأسبوع!',
        entry: newEntry,
        entries: currentWeekRanked,
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
