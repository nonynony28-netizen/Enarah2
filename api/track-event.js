// Endpoint: /api/track-event
// استقبال وتخزين وتحليل أحداث التحويل والزيارات (Conversion & Behavior Tracking)

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

  // 1. تسجيل حدث تحويل جديد (POST)
  if (req.method === 'POST') {
    if (!checkRateLimit(clientIp, 120, 60 * 1000)) {
      return res.status(429).json({ success: false, message: 'Too many analytics requests' })
    }

    try {
      let payload = req.body;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch (_) {}
      }
      if (!payload || typeof payload !== 'object' || !payload.eventName) {
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

      if (!payload || !payload.eventName) {
        return res.status(400).json({ success: false, message: 'Invalid payload' })
      }

      const { db } = await connectToDatabase()
      const analyticsCollection = db.collection('analytics_events')

      const eventDocument = {
        eventName: sanitizeString(String(payload.eventName)),
        properties: typeof payload.properties === 'object' ? payload.properties : {},
        url: sanitizeString(String(payload.url || '')),
        landingPage: sanitizeString(String(payload.landingPage || '')),
        referrer: sanitizeString(String(payload.referrer || '')),
        sessionId: sanitizeString(String(payload.sessionId || '')),
        visitorId: sanitizeString(String(payload.visitorId || '')),
        deviceType: payload.deviceType || 'unknown',
        browser: sanitizeString(String(payload.browser || 'unknown')),
        os: sanitizeString(String(payload.os || 'unknown')),
        utm: typeof payload.utm === 'object' ? payload.utm : {},
        createdAt: new Date(),
        timestamp: payload.timestamp || Date.now()
      }

      await analyticsCollection.insertOne(eventDocument)
      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message })
    }
  }

  // 2. استعراض إحصائيات التحويل للمشرف في لوحة التحكم (GET)
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase()
      const analyticsCollection = db.collection('analytics_events')

      const days = parseInt(req.query.days || '30', 10)
      const dateThreshold = new Date()
      dateThreshold.setDate(dateThreshold.getDate() - days)

      const filter = { createdAt: { $gte: dateThreshold } }

      // حساب مقاييس التحويل الرئيسية
      const totalEvents = await analyticsCollection.countDocuments(filter)
      const whatsappClicks = await analyticsCollection.countDocuments({ ...filter, eventName: 'whatsapp_click' })
      const phoneClicks = await analyticsCollection.countDocuments({ ...filter, eventName: 'phone_click' })
      const contactSubmits = await analyticsCollection.countDocuments({ ...filter, eventName: 'contact_form_submitted' })
      const quoteRequests = await analyticsCollection.countDocuments({ ...filter, eventName: 'quote_request_submitted' })
      const productViews = await analyticsCollection.countDocuments({ ...filter, eventName: 'product_viewed' })
      const heroCtaClicks = await analyticsCollection.countDocuments({ ...filter, eventName: 'hero_cta_clicked' })

      // عدد الزوار الفريدين
      const uniqueVisitors = (await analyticsCollection.distinct('visitorId', filter)).length
      const uniqueSessions = (await analyticsCollection.distinct('sessionId', filter)).length

      const totalConversions = whatsappClicks + phoneClicks + contactSubmits + quoteRequests
      const conversionRate = uniqueSessions > 0 ? ((totalConversions / uniqueSessions) * 100).toFixed(1) : '0.0'

      // مصادر الحركة الأكثر تحويلاً
      const topReferrers = await analyticsCollection.aggregate([
        { $match: filter },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]).toArray()

      // الأجهزة الأكثر استخداماً
      const devices = await analyticsCollection.aggregate([
        { $match: filter },
        { $group: { _id: '$deviceType', count: { $sum: 1 } } }
      ]).toArray()

      // مؤشرات الأداء الحيوية الحقيقية للمتصفحات (Core Web Vitals Aggregation)
      const vitals = await analyticsCollection.aggregate([
        { $match: { ...filter, eventName: 'web_vital' } },
        { $group: {
            _id: '$properties.name',
            avgValue: { $avg: '$properties.value' },
            samplesCount: { $sum: 1 },
            goodSamples: {
              $sum: { $cond: [{ $eq: ['$properties.rating', 'good'] }, 1, 0] }
            }
        }},
        { $sort: { _id: 1 } }
      ]).toArray()

      // أداء حملات التسويق (Campaigns & UTMs)
      const topCampaigns = await analyticsCollection.aggregate([
        { $match: { ...filter, 'utm.source': { $exists: true, $ne: '' } } },
        { $group: {
            _id: { source: '$utm.source', campaign: '$utm.campaign' },
            count: { $sum: 1 }
        }},
        { $sort: { count: -1 } },
        { $limit: 6 }
      ]).toArray()

      return res.status(200).json({
        success: true,
        data: {
          periodDays: days,
          summary: {
            uniqueVisitors,
            uniqueSessions,
            totalEvents,
            totalConversions,
            conversionRate: `${conversionRate}%`,
            whatsappClicks,
            phoneClicks,
            contactSubmits,
            quoteRequests,
            productViews,
            heroCtaClicks
          },
          topReferrers,
          devices,
          vitals,
          topCampaigns
        }
      })
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message })
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' })
}
