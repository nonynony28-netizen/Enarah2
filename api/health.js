// Endpoint: /api/health
// فحص حالة وسلامة النظام وقاعدة البيانات (System & Database Health Check)

import { MongoClient } from 'mongodb'
import { applySecurityHeaders } from '../lib/security.js'

let cachedClient = null
let cachedDb = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is missing')

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 })
  await client.connect()
  const db = client.db('my_app_database')

  cachedClient = client
  cachedDb = db
  return { client, db }
}

export default async function handler(req, res) {
  applySecurityHeaders(res)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const startTime = Date.now()

  try {
    const { db } = await connectToDatabase()
    // فحص ping سريع لقاعدة البيانات
    await db.command({ ping: 1 })
    const dbLatencyMs = Date.now() - startTime

    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'connected',
          latencyMs: dbLatencyMs,
        },
        api: {
          status: 'operational',
          nodeVersion: process.version,
        }
      }
    })
  } catch (err) {
    const dbLatencyMs = Date.now() - startTime
    return res.status(503).json({
      status: 'critical',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'disconnected',
          latencyMs: dbLatencyMs,
          error: 'Connection timeout or cluster unreachable'
        }
      }
    })
  }
}
