import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Share2,
  Download,
  Search,
  X,
  Check,
  Info,
  ShieldCheck,
  Bell,
  BellRing,
  BellOff,
  Eye,
  Trash2,
  SlidersHorizontal,
  PauseCircle,
  PlayCircle,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import WireAnatomy3D from '../components/WireAnatomy3D'
import {
  type WireApplication,
  WIRE_APPLICATIONS_V10,
  IPHONE_HOME_SCREEN_MESSAGE_AR,
  IPHONE_HOME_SCREEN_MESSAGE_EN,
  IPHONE_HOME_SCREEN_STEPS_AR,
  IPHONE_HOME_SCREEN_STEPS_EN,
  ANDROID_HOME_SCREEN_MESSAGE_AR,
  ANDROID_HOME_SCREEN_MESSAGE_EN,
  ANDROID_HOME_SCREEN_BUTTON_AR,
  ANDROID_HOME_SCREEN_BUTTON_EN,
  ANDROID_HOME_SCREEN_STEPS_AR,
  ANDROID_HOME_SCREEN_STEPS_EN,
  NOTIFICATION_ACTIVATION_SUCCESS_AR,
  NOTIFICATION_ACTIVATION_SUCCESS_EN,
  NOTIFICATION_ACTIVATION_FAILURE_AR,
  NOTIFICATION_ACTIVATION_FAILURE_EN,
  evaluateMobileNotificationCapabilities
} from '../utils/wirePricesV10'

export type TrendType = 'up' | 'down' | 'same' | 'unavailable'
export type AlertConditionType = 'down' | 'up' | 'any' | 'target'
export type PushDeliveryVerificationState =
  | 'IDLE'
  | 'SUBSCRIPTION_SAVED'
  | 'PUSH_REQUEST_ACCEPTED'
  | 'DEVICE_NOTIFICATION_VERIFIED'

export type AlertModalErrorKind =
  | 'unsupported_browser'
  | 'permission_denied'
  | 'subscription_failure'
  | 'network_error'
  | 'server_error'
  | 'missing_iphone_pwa'
  | 'validation_error'

export interface WirePriceRecord {
  id: string
  size: string
  sizeEn: string
  sizeNumeric: number
  manufacturer: string
  manufacturerEn: string
  packageType: string
  packageTypeEn: string
  price: number
  previousPrice?: number
  trend: TrendType
  changeAmount?: number
  changePercent?: number
}

export interface WireAlertRule {
  wireSize: string
  condition: AlertConditionType
  targetPrice: number | null
  enabled: boolean
  deliveryMode: 'push' | 'watchlist_only'
  verificationState: PushDeliveryVerificationState
  createdAt: string
  updatedAt: string
  lastKnownPrice: number
  lastTriggeredPrice?: number | null
  lastTriggeredAt?: string | null
}

export interface WireApplicationItem {
  id: string
  size: string
  sizeEn: string
  headingAr: string
  headingEn: string
  imageSlug: string
  summaryAr: string
  summaryEn: string
  examplesAr: [string, string, string]
  examplesEn: [string, string, string]
  technicalNoteAr: string
  technicalNoteEn: string
}

export interface TriggeredLocalAlert {
  id: string
  wireSize: string
  sizeLabel: string
  oldPrice: number
  newPrice: number
  condition: AlertConditionType
  targetPrice: number | null
  triggeredAt: string
}

// ⚠️ بيانات الأسعار الأساسية المعتمدة رسمياً
const DEFAULT_PUBLISHED_DATE = '18 مايو 2026'

// Public VAPID key matching server-side getVapidKeys() in lib/webPush.js (Public key only — private key is strictly server-side)
const FALLBACK_PUBLIC_VAPID_KEY =
  'BNkvEMVHQShViwsDNSEWbfOkc_Kmz4T12YD39XUsB18aYfiIjup13_TRDh7BeVy5VVsAv35UzUIUnpA-NqInTQs'

const DEFAULT_WIRES: WirePriceRecord[] = [
  {
    id: '1.5',
    size: '1.5 مم²',
    sizeEn: '1.5 mm²',
    sizeNumeric: 1.5,
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 245.0,
    trend: 'same'
  },
  {
    id: '2.5',
    size: '2.5 مم²',
    sizeEn: '2.5 mm²',
    sizeNumeric: 2.5,
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 375.0,
    trend: 'same'
  },
  {
    id: '4.0',
    size: '4.0 مم²',
    sizeEn: '4.0 mm²',
    sizeNumeric: 4.0,
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 585.0,
    trend: 'same'
  },
  {
    id: '6.0',
    size: '6.0 مم²',
    sizeEn: '6.0 mm²',
    sizeNumeric: 6.0,
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 845.0,
    trend: 'same'
  },
  {
    id: '10.0',
    size: '10.0 مم²',
    sizeEn: '10.0 mm²',
    sizeNumeric: 10.0,
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 1490.0,
    trend: 'same'
  },
  {
    id: '16.0',
    size: '16.0 مم²',
    sizeEn: '16.0 mm²',
    sizeNumeric: 16.0,
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 2320.0,
    trend: 'same'
  },
  {
    id: '25.0',
    size: '25.0 مم²',
    sizeEn: '25.0 mm²',
    sizeNumeric: 25.0,
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 3650.0,
    trend: 'same'
  }
]

// PART 1, 6, 7 — EXPLICIT VERSIONED WIRE APPLICATION STUDIO DATA (V10 + NANO BANANA PRO)
const WIRE_APPLICATIONS: WireApplication[] = WIRE_APPLICATIONS_V10

// Helper to communicate with the live backend on enarah2.vercel.app (or local serverless dev if available)
const GET_API_ENDPOINTS = [
  'https://enarah2.vercel.app/api/get-users',
  '/api/get-users'
]
const POST_API_ENDPOINTS = [
  'https://enarah2.vercel.app/api/save-user',
  '/api/save-user'
]

async function fetchWireApiGet(queryString: string): Promise<any> {
  let lastErr: Error | null = null
  for (const base of GET_API_ENDPOINTS) {
    try {
      const res = await fetch(`${base}${queryString}`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      })
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        continue
      }
      const data = await res.json()
      if (res.ok && data) {
        return data
      }
      lastErr = new Error(data?.error || `HTTP ${res.status}`)
    } catch (err: any) {
      lastErr = err
    }
  }
  throw lastErr || new Error('Network error')
}

async function fetchWireApiPost(payload: Record<string, any>): Promise<{ status: number; data: any }> {
  let lastErr: Error | null = null
  for (const url of POST_API_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        continue
      }
      const data = await res.json()
      return { status: res.status, data }
    } catch (err: any) {
      lastErr = err
    }
  }
  throw lastErr || new Error('Network error')
}

function getOrCreateSubscriberToken(): string {
  if (typeof window === 'undefined') return 'server-placeholder-token-000000000000'
  const storageKey = 'enarah_wire_subscriber_token_v1'
  let token = localStorage.getItem(storageKey)
  if (!token || token.length < 24) {
    const randomBytes = new Uint8Array(24)
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(randomBytes)
    } else {
      for (let i = 0; i < 24; i++) randomBytes[i] = Math.floor(Math.random() * 256)
    }
    token = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    localStorage.setItem(storageKey, token)
  }
  return token
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

async function ensureServiceWorkerReady(timeoutMs = 8000): Promise<ServiceWorkerRegistration> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    throw new Error('Service Worker is not supported in this browser')
  }

  let reg = await navigator.serviceWorker.getRegistration('/')
  if (!reg) {
    reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
  }

  const readyPromise = navigator.serviceWorker.ready
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Service Worker activation timed out')), timeoutMs)
  )

  return Promise.race([readyPromise, timeoutPromise])
}

function evaluateClientAlertRule(
  rule: WireAlertRule,
  oldPrice: number,
  newPrice: number
): boolean {
  if (!rule || !rule.enabled) return false
  if (!Number.isFinite(oldPrice) || !Number.isFinite(newPrice)) return false
  if (Math.abs(newPrice - oldPrice) < 0.001) return false
  if (
    rule.lastTriggeredPrice !== undefined &&
    rule.lastTriggeredPrice !== null &&
    Math.abs(Number(rule.lastTriggeredPrice) - newPrice) < 0.001
  ) {
    return false
  }

  switch (rule.condition) {
    case 'down':
      return newPrice < oldPrice
    case 'up':
      return newPrice > oldPrice
    case 'any':
      return newPrice !== oldPrice
    case 'target': {
      const target = Number(rule.targetPrice)
      if (!Number.isFinite(target) || target <= 0) return false
      const crossedDown = oldPrice > target && newPrice <= target
      const crossedUp = oldPrice < target && newPrice >= target
      const exactHit = oldPrice !== target && Math.abs(newPrice - target) < 0.001
      return crossedDown || crossedUp || exactHit
    }
    default:
      return false
  }
}

export default function WirePrices() {
  const { isAr } = useLanguage()

  // 1. Storage & State Management
  const [lastUpdateDate, setLastUpdateDate] = useState<string>(DEFAULT_PUBLISHED_DATE)
  const [wireRecords, setWireRecords] = useState<WirePriceRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enarah_cached_wire_prices_v2')
      if (cached) {
        try {
          return JSON.parse(cached)
        } catch {
          // fallback to default
        }
      }
    }
    return DEFAULT_WIRES
  })

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<string>('all') // 'all' | 'pinned' | 'alerts' | size id

  // Favorites / Personal Watchlist IDs
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const favs = localStorage.getItem('enarah_fav_wire_sizes')
      if (favs) {
        try {
          return JSON.parse(favs)
        } catch {}
      }
    }
    return ['1.5', '2.5']
  })

  // Personal Wire Alert Rules (Synced with Backend MongoDB + local cache)
  const [alertRules, setAlertRules] = useState<Record<string, WireAlertRule>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('enarah_wire_alert_rules_v9')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {}
      }
    }
    return {}
  })

  // Triggered in-app alerts when price changes match user's rules
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredLocalAlert[]>([])

  // Smart Alert Modal State
  const [alertModalWireId, setAlertModalWireId] = useState<string | null>(null)
  const [modalCondition, setModalCondition] = useState<AlertConditionType>('down')
  const [modalTargetPrice, setModalTargetPrice] = useState<string>('')
  const [modalError, setModalError] = useState<{
    kind: AlertModalErrorKind
    message: string
  } | null>(null)
  const [isSavingAlert, setIsSavingAlert] = useState(false)
  const [alertFeedbackMsg, setAlertFeedbackMsg] = useState<string | null>(null)
  const [isTestingPush, setIsTestingPush] = useState(false)
  const [pushVerificationBanner, setPushVerificationBanner] = useState<{
    state: PushDeliveryVerificationState
    message: string
  } | null>(null)

  // Wire Application Studio State (Section C + Modal + Instant Image Preloading & Decoded Cache)
  const [selectedAppSizeId, setSelectedAppSizeId] = useState<string>('1.5')
  const [appModalWireId, setAppModalWireId] = useState<string | null>(null)
  const [decodedWireIds, setDecodedWireIds] = useState<Record<string, boolean>>({})
  const [failedWireIds, setFailedWireIds] = useState<Record<string, boolean>>({})
  const [mountedWireIds, setMountedWireIds] = useState<Record<string, boolean>>({
    '1.5': true,
    '2.5': true
  })
  const preloadedImagesRef = useRef<Record<string, HTMLImageElement>>({})
  const latestSwitchReqIdRef = useRef<number>(0)

  // Sharing Feedback State
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Android PWA Install Prompt & Step-by-Step Guidance State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null)
  const [showAndroidInstallSteps, setShowAndroidInstallSteps] = useState(false)

  // Device & Notification Capability Detection (V10 Device-Aware Engine)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  )

  const deviceCapabilities = useMemo(() => {
    if (typeof window === 'undefined') {
      return evaluateMobileNotificationCapabilities({
        isHttpsOrLocalhost: true
      })
    }
    const ua = window.navigator.userAgent || ''
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    const supportsServiceWorker = 'serviceWorker' in navigator
    const supportsPushManager = 'PushManager' in window
    const supportsNotifications = 'Notification' in window
    const isHttpsOrLocalhost =
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'

    return evaluateMobileNotificationCapabilities({
      userAgent: ua,
      platform: window.navigator.platform || '',
      maxTouchPoints: window.navigator.maxTouchPoints || 0,
      isStandalone,
      supportsServiceWorker,
      supportsPushManager,
      supportsNotifications,
      isHttpsOrLocalhost
    })
  }, [])

  // Capture Android Chrome beforeinstallprompt for optional Home Screen installation
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    }
  }, [])

  // Preload & Decode a specific wire size image into memory cache so switching is immediate (0ms)
  const preloadAndDecodeWireImage = useCallback((wireId: string): Promise<boolean> => {
    if (typeof window === 'undefined') return Promise.resolve(true)
    const appItem = WIRE_APPLICATIONS.find((item) => item.wireId === wireId)
    if (!appItem) return Promise.resolve(false)

    if (preloadedImagesRef.current[wireId]?.complete) {
      setDecodedWireIds((prev) => (prev[wireId] ? prev : { ...prev, [wireId]: true }))
      setMountedWireIds((prev) => (prev[wireId] ? prev : { ...prev, [wireId]: true }))
      return Promise.resolve(true)
    }

    return new Promise((resolve) => {
      const img = new window.Image()
      img.decoding = 'async'
      const dpr = window.devicePixelRatio || 1
      const viewportW = window.innerWidth || 1024
      const targetWidth =
        viewportW <= 640 && dpr <= 2 ? 480 : viewportW <= 1280 ? 800 : 1080

      // Preload modern WebP/AVIF or JPG matching current viewport
      img.srcset = appItem.webpSrcSet
      img.sizes = '(max-width: 1024px) 100vw, 680px'
      img.src = `/images/wire-apps/${appItem.imageSlug}-${targetWidth}.webp`

      const markDecoded = () => {
        preloadedImagesRef.current[wireId] = img
        setFailedWireIds((prev) => {
          if (!prev[wireId]) return prev
          const next = { ...prev }
          delete next[wireId]
          return next
        })
        setDecodedWireIds((prev) => (prev[wireId] ? prev : { ...prev, [wireId]: true }))
        setMountedWireIds((prev) => (prev[wireId] ? prev : { ...prev, [wireId]: true }))
        resolve(true)
      }

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(markDecoded).catch(markDecoded)
        } else {
          markDecoded()
        }
      }

      img.onerror = () => {
        // Fallback to JPG if WebP is unsupported
        const fallbackImg = new window.Image()
        fallbackImg.src = appItem.imageUrl
        fallbackImg.onload = () => {
          preloadedImagesRef.current[wireId] = fallbackImg
          setDecodedWireIds((prev) => (prev[wireId] ? prev : { ...prev, [wireId]: true }))
          setMountedWireIds((prev) => (prev[wireId] ? prev : { ...prev, [wireId]: true }))
          resolve(true)
        }
        fallbackImg.onerror = () => {
          setFailedWireIds((prev) => ({ ...prev, [wireId]: true }))
          resolve(false)
        }
      }
    })
  }, [])

  // High-priority initial decode + intelligent progressive preloading of likely next wire sizes
  useEffect(() => {
    if (typeof window === 'undefined') return
    let cancelled = false

    const runProgressivePreload = async () => {
      // 1. Decode initial selected wire image first with highest priority
      await preloadAndDecodeWireImage(selectedAppSizeId)
      if (cancelled) return

      // 2. Respect Data Saver if enabled, otherwise progressively preload adjacent wire sizes 2 at a time
      const conn = (navigator as any).connection
      const isSaveData = Boolean(conn && conn.saveData)
      const allIds = WIRE_APPLICATIONS.map((w) => w.wireId)
      const currentIdx = Math.max(0, allIds.indexOf(selectedAppSizeId))

      // Order by proximity to currently selected wire size
      const orderedIds = allIds
        .filter((id) => id !== selectedAppSizeId)
        .sort((a, b) => {
          const distA = Math.abs(allIds.indexOf(a) - currentIdx)
          const distB = Math.abs(allIds.indexOf(b) - currentIdx)
          return distA - distB
        })

      const idsToPreload = isSaveData ? orderedIds.slice(0, 2) : orderedIds

      for (let i = 0; i < idsToPreload.length; i += 2) {
        if (cancelled) break
        const batch = idsToPreload.slice(i, i + 2)
        await Promise.all(batch.map((id) => preloadAndDecodeWireImage(id)))
      }
    }

    runProgressivePreload()
    return () => {
      cancelled = true
    }
  }, [preloadAndDecodeWireImage])

  // Immediate Wire Application Size Selection Handler (Cancels outdated requests & preloads neighbors)
  const handleSelectAppSize = useCallback(
    (wireId: string) => {
      const reqId = ++latestSwitchReqIdRef.current
      setSelectedAppSizeId(wireId)
      setMountedWireIds((prev) => (prev[wireId] ? prev : { ...prev, [wireId]: true }))

      preloadAndDecodeWireImage(wireId).then(() => {
        if (latestSwitchReqIdRef.current !== reqId) return
        const allIds = WIRE_APPLICATIONS.map((w) => w.wireId)
        const idx = allIds.indexOf(wireId)
        if (idx > 0) preloadAndDecodeWireImage(allIds[idx - 1])
        if (idx >= 0 && idx < allIds.length - 1) preloadAndDecodeWireImage(allIds[idx + 1])
      })
    },
    [preloadAndDecodeWireImage]
  )

  // Handle URL query param ?wire=X (when user taps a mobile push notification)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const wireParam = params.get('wire')
    if (wireParam && DEFAULT_WIRES.some((w) => w.id === wireParam)) {
      setSelectedFilter(wireParam)
      setSelectedAppSizeId(wireParam)
    }
  }, [])

  // Listen for Service Worker PUSH_NOTIFICATION_DISPLAYED message to confirm DEVICE_NOTIFICATION_VERIFIED
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const onSwMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PUSH_NOTIFICATION_DISPLAYED') {
        const wireId = event.data.payload?.wireId
        setPushVerificationBanner({
          state: 'DEVICE_NOTIFICATION_VERIFIED',
          message: isAr
            ? 'تم التحقق الفعلي: وصل إشعار السعر وظهر على جهازك بنجاح.'
            : 'Verified: Push notification received and displayed on this device.'
        })
        if (wireId) {
          setAlertRules((prev) => {
            if (!prev[wireId]) return prev
            const updated: Record<string, WireAlertRule> = {
              ...prev,
              [wireId]: {
                ...prev[wireId],
                verificationState: 'DEVICE_NOTIFICATION_VERIFIED'
              }
            }
            localStorage.setItem('enarah_wire_alert_rules_v9', JSON.stringify(updated))
            return updated
          })
        }
      }
    }

    navigator.serviceWorker.addEventListener('message', onSwMessage)
    return () => {
      navigator.serviceWorker.removeEventListener('message', onSwMessage)
    }
  }, [isAr])

  // Persist alertRules to localStorage helper
  const saveAlertRulesToStorage = useCallback((nextRules: Record<string, WireAlertRule>) => {
    setAlertRules(nextRules)
    if (typeof window !== 'undefined') {
      localStorage.setItem('enarah_wire_alert_rules_v9', JSON.stringify(nextRules))
    }
  }, [])

  // Toggle Favorite / Watchlist Pin
  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
      localStorage.setItem('enarah_fav_wire_sizes', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Ensure wire is in favoriteIds when an alert is created
  const ensureInWatchlist = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(id)) return prev
      const updated = [...prev, id]
      localStorage.setItem('enarah_fav_wire_sizes', JSON.stringify(updated))
      return updated
    })
  }, [])

  // 2. Sync Remote Alert Subscriptions on Mount (using subscriberToken)
  useEffect(() => {
    let isMounted = true
    const syncRemoteSubscriptions = async () => {
      if (typeof window === 'undefined') return
      const subscriberToken = getOrCreateSubscriberToken()
      try {
        const data = await fetchWireApiGet(
          `?action=my-subscriptions&subscriberToken=${encodeURIComponent(subscriberToken)}`
        )
        if (
          isMounted &&
          data.success &&
          Array.isArray(data.subscriptions) &&
          data.subscriptions.length > 0
        ) {
          setAlertRules((prev) => {
            const merged = { ...prev }
            for (const sub of data.subscriptions) {
              const wId = sub.wireSize || sub.wireId
              if (!wId) continue
              const existing = merged[wId]
              merged[wId] = {
                wireSize: wId,
                condition: sub.condition || 'any',
                targetPrice: sub.targetPrice ?? null,
                enabled: sub.enabled !== false,
                deliveryMode: sub.hasPushSubscription || sub.hasPush ? 'push' : 'watchlist_only',
                verificationState:
                  sub.hasPushSubscription || sub.hasPush
                    ? existing?.verificationState || 'SUBSCRIPTION_SAVED'
                    : 'IDLE',
                createdAt: existing?.createdAt || new Date().toISOString(),
                updatedAt: sub.updatedAt || new Date().toISOString(),
                lastKnownPrice: existing?.lastKnownPrice ?? 0,
                lastTriggeredPrice:
                  sub.lastTriggeredPrice ?? existing?.lastTriggeredPrice ?? null,
                lastTriggeredAt: sub.lastTriggeredAt ?? existing?.lastTriggeredAt ?? null
              }
            }
            localStorage.setItem('enarah_wire_alert_rules_v9', JSON.stringify(merged))
            return merged
          })
        }
      } catch {
        // Offline or initial load before sync
      }
    }
    syncRemoteSubscriptions()
    return () => {
      isMounted = false
    }
  }, [])

  // 3. Data Fetching & Real Consecutive Comparisons + Local Alert Trigger Evaluation
  useEffect(() => {
    let isMounted = true

    const fetchWirePrices = async () => {
      let data: any = null
      try {
        data = await fetchWireApiGet('')
      } catch {
        return
      }

      if (!isMounted || !data || !data.success || !Array.isArray(data.data)) return

      try {
        const updates = data.data.filter(
          (item: any) => item.email === 'admin_wire_prices@app.local'
        )

        if (updates.length > 0) {
          const chronological = [...updates].reverse()
          const latestRecord = chronological[chronological.length - 1]
          const previousRecord =
            chronological.length > 1 ? chronological[chronological.length - 2] : null

          if (latestRecord.createdAt) {
            const pubDate = new Date(latestRecord.createdAt)
            setLastUpdateDate(
              pubDate.toLocaleDateString(isAr ? 'ar-LY' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            )
          }

          let latestPricesObj: Record<string, string> = {}
          let previousPricesObj: Record<string, string> | null = null

          try {
            const rawLatest = latestRecord.phone || latestRecord.rawPhone || '{}'
            latestPricesObj = JSON.parse(rawLatest).prices || {}
          } catch {}

          if (previousRecord) {
            try {
              const rawPrev = previousRecord.phone || previousRecord.rawPhone || '{}'
              previousPricesObj = JSON.parse(rawPrev).prices || null
            } catch {}
          }

          const updatedWires: WirePriceRecord[] = DEFAULT_WIRES.map((wire) => {
            const currentPrice = latestPricesObj[wire.id]
              ? parseFloat(latestPricesObj[wire.id])
              : wire.price

            let prevPrice: number | undefined
            let trend: TrendType = 'same'
            let changeAmount: number | undefined
            let changePercent: number | undefined

            if (previousPricesObj && previousPricesObj[wire.id]) {
              prevPrice = parseFloat(previousPricesObj[wire.id])
              changeAmount = parseFloat((currentPrice - prevPrice).toFixed(2))
              changePercent = parseFloat(((changeAmount / prevPrice) * 100).toFixed(1))

              if (changeAmount > 0) trend = 'up'
              else if (changeAmount < 0) trend = 'down'
              else trend = 'same'
            } else if (updates.length < 2) {
              trend = 'unavailable'
            }

            return {
              ...wire,
              price: currentPrice,
              previousPrice: prevPrice,
              trend,
              changeAmount,
              changePercent
            }
          })

          setWireRecords(updatedWires)
          localStorage.setItem(
            'enarah_cached_wire_prices_v2',
            JSON.stringify(updatedWires)
          )

          // Evaluate active user alert rules against newly fetched prices
          const savedRulesRaw = localStorage.getItem('enarah_wire_alert_rules_v9')
          if (savedRulesRaw) {
            try {
              const currentRules: Record<string, WireAlertRule> = JSON.parse(savedRulesRaw)
              let rulesModified = false
              const newlyTriggered: TriggeredLocalAlert[] = []

              for (const wire of updatedWires) {
                const rule = currentRules[wire.id]
                if (!rule) continue

                const baselineOldPrice =
                  rule.lastKnownPrice > 0
                    ? rule.lastKnownPrice
                    : wire.previousPrice ?? wire.price

                if (evaluateClientAlertRule(rule, baselineOldPrice, wire.price)) {
                  newlyTriggered.push({
                    id: `${wire.id}-${Date.now()}`,
                    wireSize: wire.id,
                    sizeLabel: wire.size,
                    oldPrice: baselineOldPrice,
                    newPrice: wire.price,
                    condition: rule.condition,
                    targetPrice: rule.targetPrice,
                    triggeredAt: new Date().toISOString()
                  })
                  currentRules[wire.id] = {
                    ...rule,
                    lastKnownPrice: wire.price,
                    lastTriggeredPrice: wire.price,
                    lastTriggeredAt: new Date().toISOString()
                  }
                  rulesModified = true
                } else if (rule.lastKnownPrice !== wire.price) {
                  currentRules[wire.id] = {
                    ...rule,
                    lastKnownPrice: wire.price
                  }
                  rulesModified = true
                }
              }

              if (rulesModified) {
                localStorage.setItem(
                  'enarah_wire_alert_rules_v9',
                  JSON.stringify(currentRules)
                )
                setAlertRules({ ...currentRules })
              }

              if (newlyTriggered.length > 0) {
                setTriggeredAlerts((prev) => [...newlyTriggered, ...prev])
              }
            } catch {}
          }
        }
      } catch (err) {
        console.warn('Wire prices parse notice:', err)
      }
    }

    fetchWirePrices()

    return () => {
      isMounted = false
    }
  }, [isAr])

  // Open Smart Alert Modal for a specific wire size
  const openAlertModal = useCallback(
    (wireId: string) => {
      const wire = wireRecords.find((w) => w.id === wireId) || DEFAULT_WIRES[0]
      const existingRule = alertRules[wireId]
      setAlertModalWireId(wireId)
      setModalCondition(existingRule ? existingRule.condition : 'down')
      setModalTargetPrice(
        existingRule && existingRule.targetPrice !== null
          ? String(existingRule.targetPrice)
          : String(Math.max(1, Math.round(wire.price - 10)))
      )
      setModalError(null)
      setAlertFeedbackMsg(null)
    },
    [wireRecords, alertRules]
  )

  const closeAlertModal = useCallback(() => {
    setAlertModalWireId(null)
    setModalError(null)
    setAlertFeedbackMsg(null)
  }, [])

  // Strict Web Push Subscription Creation (No silent fallback — returns explicit error kind if anything fails)
  const createVerifiedPushSubscription = useCallback(async (): Promise<{
    ok: boolean
    subscription: PushSubscriptionJSON | null
    errorKind?: AlertModalErrorKind
    errorMessage?: string
  }> => {
    // 1. Check iPhone / iOS missing Home Screen PWA installation
    if (deviceCapabilities.isIOSRequiresHomeScreen) {
      return {
        ok: false,
        subscription: null,
        errorKind: 'missing_iphone_pwa',
        errorMessage: isAr ? IPHONE_HOME_SCREEN_MESSAGE_AR : IPHONE_HOME_SCREEN_MESSAGE_EN
      }
    }

    // 2. Check HTTPS, Service Worker, Notification API, and PushManager support
    if (
      !deviceCapabilities.isHttpsOrLocalhost ||
      !deviceCapabilities.supportsServiceWorker ||
      !deviceCapabilities.supportsNotifications ||
      !deviceCapabilities.supportsPushManager
    ) {
      return {
        ok: false,
        subscription: null,
        errorKind: 'unsupported_browser',
        errorMessage: isAr
          ? 'هذا المتصفح أو الوضع الحالي لا يدعم إشعارات الدفع (Web Push). يرجى استخدام متصفح حديث مثل Chrome أو Edge أو فتح تطبيق الشاشة الرئيسية على iPhone.'
          : 'This browser does not support Web Push notifications. Please use Chrome, Edge, or an installed Home Screen Web App on iPhone.'
      }
    }

    // 3. Check & Request Notification Permission ONLY after explicit user interaction
    let permission = Notification.permission
    if (permission === 'default') {
      try {
        permission = await Notification.requestPermission()
        setNotificationPermission(permission)
      } catch {
        return {
          ok: false,
          subscription: null,
          errorKind: 'permission_denied',
          errorMessage: isAr
            ? 'تعذر طلب صلاحية الإشعارات من المتصفح. يرجى السماح بالإشعارات من إعدادات الموقع ثم إعادة المحاولة.'
            : 'Could not request notification permission. Please allow notifications in browser settings and retry.'
        }
      }
    } else {
      setNotificationPermission(permission)
    }

    if (permission !== 'granted') {
      return {
        ok: false,
        subscription: null,
        errorKind: 'permission_denied',
        errorMessage: isAr
          ? 'تم رفض صلاحية الإشعارات في المتصفح. يرجى تفعيل الإشعارات لموقع الإنارة الحديثة من إعدادات المتصفح ثم الضغط على إعادة المحاولة.'
          : 'Notification permission was denied. Please enable notifications for this site in your browser settings and try again.'
      }
    }

    // 4. Ensure Service Worker is active and create PushSubscription
    try {
      const registration = await ensureServiceWorkerReady(8000)
      if (!registration.pushManager) {
        return {
          ok: false,
          subscription: null,
          errorKind: 'unsupported_browser',
          errorMessage: isAr
            ? 'خدمة الدفع (PushManager) غير متوفرة في هذا المتصفح.'
            : 'PushManager is unavailable in this browser.'
        }
      }

      let sub = await registration.pushManager.getSubscription()
      if (!sub) {
        // Fetch public VAPID key from server (with verified matching public key fallback)
        let publicKey = FALLBACK_PUBLIC_VAPID_KEY
        try {
          const vapidData = await fetchWireApiGet('?action=vapid-public-key')
          if (vapidData?.success && vapidData?.publicKey) {
            publicKey = vapidData.publicKey
          }
        } catch {
          // Use verified server public key
        }

        const convertedKey = urlBase64ToUint8Array(publicKey)
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey as BufferSource
        })
      }

      const subJson = sub.toJSON()
      if (!subJson || !subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
        return {
          ok: false,
          subscription: null,
          errorKind: 'subscription_failure',
          errorMessage: isAr
            ? 'لم يقم المتصفح بإرجاع مفاتيح اشتراك صالحة للإشعارات. يرجى إعادة المحاولة.'
            : 'Browser did not return valid push subscription keys. Please retry.'
        }
      }

      return {
        ok: true,
        subscription: subJson
      }
    } catch (err: any) {
      return {
        ok: false,
        subscription: null,
        errorKind: 'subscription_failure',
        errorMessage: isAr
          ? `تعذر إنشاء اشتراك الإشعارات في المتصفح (${err?.message || 'خطأ في خدمة الدفع'}). يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.`
          : `Failed to create browser push subscription (${err?.message || 'Push service error'}). Please check your connection and retry.`
      }
    }
  }, [deviceCapabilities, isAr])

  // Handle "تفعيل التنبيه" / "تعديل التنبيه" submission (STRICT: Never show success unless backend confirms persistence)
  const handleSaveAlertRule = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      if (!alertModalWireId) return

      const selectedWire =
        wireRecords.find((w) => w.id === alertModalWireId) || DEFAULT_WIRES[0]

      let parsedTarget: number | null = null
      if (modalCondition === 'target') {
        parsedTarget = parseFloat(modalTargetPrice)
        if (!Number.isFinite(parsedTarget) || parsedTarget <= 0 || parsedTarget > 100000) {
          setModalError({
            kind: 'validation_error',
            message: isAr
              ? 'يرجى إدخال سعر مستهدف صحيح أكبر من صفر (بالدينار الليبي).'
              : 'Please enter a valid target price greater than zero (LYD).'
          })
          return
        }
      }

      setModalError(null)
      setAlertFeedbackMsg(null)
      setIsSavingAlert(true)

      try {
        // Steps 4–7: Verify browser support, request permission on click, create real PushSubscription
        const subResult = await createVerifiedPushSubscription()
        if (!subResult.ok || !subResult.subscription) {
          setModalError({
            kind: subResult.errorKind || 'subscription_failure',
            message:
              subResult.errorMessage ||
              (isAr
                ? 'تعذر تفعيل اشتراك الإشعارات على هذا الجهاز.'
                : 'Could not activate push subscription on this device.')
          })
          return
        }

        // Steps 8–9: Save subscription on backend and require backend confirmation
        const subscriberToken = getOrCreateSubscriberToken()
        let apiResponse: { status: number; data: any }
        try {
          apiResponse = await fetchWireApiPost({
            type: 'wire_alert',
            action: 'upsert',
            requirePush: true,
            subscriberToken,
            wireId: alertModalWireId,
            wireSize: alertModalWireId,
            condition: modalCondition,
            targetPrice: parsedTarget,
            enabled: true,
            pushSubscription: subResult.subscription
          })
        } catch {
          setModalError({
            kind: 'network_error',
            message: isAr
              ? 'تم إنشاء اشتراك المتصفح ولكن تعذر الاتصال بالخادم لحفظ التنبيه بسبب خطأ في الشبكة. يرجى الضغط على "إعادة المحاولة".'
              : 'Browser subscription succeeded, but saving to the server failed due to a network error. Please click Retry.'
          })
          return
        }

        if (
          apiResponse.status < 200 ||
          apiResponse.status >= 300 ||
          !apiResponse.data?.success
        ) {
          setModalError({
            kind: 'server_error',
            message: isAr
              ? `تعذر حفظ الاشتراك في الخادم (${apiResponse.data?.error || `HTTP ${apiResponse.status}`}). لم يتم تفعيل التنبيه بعد، يرجى إعادة المحاولة.`
              : `Server failed to save subscription (${apiResponse.data?.error || `HTTP ${apiResponse.status}`}). Please retry.`
          })
          return
        }

        // Step 10: Backend confirmed persistence (SUBSCRIPTION_SAVED) — now update state & display real success
        const nowIso = new Date().toISOString()
        const newRule: WireAlertRule = {
          wireSize: alertModalWireId,
          condition: modalCondition,
          targetPrice: parsedTarget,
          enabled: true,
          deliveryMode: 'push',
          verificationState: 'SUBSCRIPTION_SAVED',
          createdAt: alertRules[alertModalWireId]?.createdAt || nowIso,
          updatedAt: nowIso,
          lastKnownPrice: selectedWire.price,
          lastTriggeredPrice: null,
          lastTriggeredAt: null
        }

        const updatedRules = {
          ...alertRules,
          [alertModalWireId]: newRule
        }
        saveAlertRulesToStorage(updatedRules)
        ensureInWatchlist(alertModalWireId)

        setAlertFeedbackMsg(
          isAr ? NOTIFICATION_ACTIVATION_SUCCESS_AR : NOTIFICATION_ACTIVATION_SUCCESS_EN
        )
      } finally {
        setIsSavingAlert(false)
      }
    },
    [
      alertModalWireId,
      wireRecords,
      modalCondition,
      modalTargetPrice,
      isAr,
      createVerifiedPushSubscription,
      alertRules,
      saveAlertRulesToStorage,
      ensureInWatchlist
    ]
  )

  // Follow in on-page watchlist only (Explicitly labeled as Watchlist Only — never claims mobile push is active)
  const handleSaveWatchlistOnly = useCallback(() => {
    if (!alertModalWireId) return
    const selectedWire =
      wireRecords.find((w) => w.id === alertModalWireId) || DEFAULT_WIRES[0]
    const parsedTarget =
      modalCondition === 'target' ? parseFloat(modalTargetPrice) || null : null
    const nowIso = new Date().toISOString()

    const watchlistRule: WireAlertRule = {
      wireSize: alertModalWireId,
      condition: modalCondition,
      targetPrice: parsedTarget,
      enabled: true,
      deliveryMode: 'watchlist_only',
      verificationState: 'IDLE',
      createdAt: alertRules[alertModalWireId]?.createdAt || nowIso,
      updatedAt: nowIso,
      lastKnownPrice: selectedWire.price,
      lastTriggeredPrice: null,
      lastTriggeredAt: null
    }

    const updatedRules = {
      ...alertRules,
      [alertModalWireId]: watchlistRule
    }
    saveAlertRulesToStorage(updatedRules)
    ensureInWatchlist(alertModalWireId)
    closeAlertModal()
  }, [
    alertModalWireId,
    wireRecords,
    modalCondition,
    modalTargetPrice,
    alertRules,
    saveAlertRulesToStorage,
    ensureInWatchlist,
    closeAlertModal
  ])

  // Pause or Resume an existing alert rule ("إيقاف التنبيه" / "تفعيل التنبيه")
  const handleToggleRuleEnabled = useCallback(
    async (wireSize: string, forceDisable?: boolean) => {
      const existing = alertRules[wireSize]
      if (!existing) return
      const nextEnabled = forceDisable !== undefined ? !forceDisable : !existing.enabled

      setIsSavingAlert(true)
      try {
        if (existing.deliveryMode === 'push') {
          const subscriberToken = getOrCreateSubscriberToken()
          const res = await fetchWireApiPost({
            type: 'wire_alert',
            action: 'upsert',
            subscriberToken,
            wireId: wireSize,
            wireSize,
            condition: existing.condition,
            targetPrice: existing.targetPrice,
            enabled: nextEnabled
          })
          if (!res.data?.success) {
            setModalError({
              kind: 'server_error',
              message: isAr
                ? 'تعذر تحديث حالة التنبيه على الخادم. يرجى المحاولة مرة أخرى.'
                : 'Could not update alert state on server. Please retry.'
            })
            return
          }
        }

        const updatedRule: WireAlertRule = {
          ...existing,
          enabled: nextEnabled,
          updatedAt: new Date().toISOString()
        }
        const nextRules = { ...alertRules, [wireSize]: updatedRule }
        saveAlertRulesToStorage(nextRules)

        if (alertModalWireId === wireSize) {
          setAlertFeedbackMsg(
            nextEnabled
              ? isAr
                ? 'تمت إعادة تفعيل التنبيه بنجاح.'
                : 'Alert re-enabled.'
              : isAr
              ? 'تم إيقاف التنبيه مؤقتاً بنجاح.'
              : 'Alert paused.'
          )
        }
      } catch {
        setModalError({
          kind: 'network_error',
          message: isAr
            ? 'تعذر الاتصال بالخادم لتحديث حالة التنبيه.'
            : 'Network error while updating alert state.'
        })
      } finally {
        setIsSavingAlert(false)
      }
    },
    [alertRules, saveAlertRulesToStorage, alertModalWireId, isAr]
  )

  // Delete an alert rule and unsubscribe
  const handleDeleteAlertRule = useCallback(
    async (wireSize: string, alsoRemoveFromWatchlist = false) => {
      const nextRules = { ...alertRules }
      delete nextRules[wireSize]
      saveAlertRulesToStorage(nextRules)

      if (alsoRemoveFromWatchlist) {
        setFavoriteIds((prev) => {
          const updated = prev.filter((item) => item !== wireSize)
          localStorage.setItem('enarah_fav_wire_sizes', JSON.stringify(updated))
          return updated
        })
      }

      try {
        const subscriberToken = getOrCreateSubscriberToken()
        await fetchWireApiPost({
          type: 'wire_alert',
          action: 'delete',
          subscriberToken,
          wireId: wireSize,
          wireSize
        })
      } catch {}
    },
    [alertRules, saveAlertRulesToStorage]
  )

  // Send a real server-initiated Web Push verification notification
  const handleSendVerificationNotification = useCallback(
    async (wireSize?: string) => {
      setIsTestingPush(true)
      setPushVerificationBanner(null)
      const targetWire =
        wireRecords.find((w) => w.id === (wireSize || '2.5')) || wireRecords[0]

      try {
        const subResult = await createVerifiedPushSubscription()
        if (!subResult.ok || !subResult.subscription) {
          setPushVerificationBanner({
            state: 'IDLE',
            message:
              subResult.errorMessage ||
              (isAr
                ? 'لا يمكن إرسال إشعار دفع قبل تفعيل صلاحية الإشعارات واشتراك المتصفح.'
                : 'Cannot send push notification before enabling browser push subscription.')
          })
          return
        }

        const subscriberToken = getOrCreateSubscriberToken()
        const { status, data } = await fetchWireApiPost({
          type: 'wire_alert',
          action: 'test-push',
          subscriberToken,
          wireId: targetWire.id,
          wireSize: targetWire.id,
          currentPrice: targetWire.price,
          pushSubscription: subResult.subscription
        })

        if (status >= 200 && status < 300 && data?.success) {
          setPushVerificationBanner({
            state: 'PUSH_REQUEST_ACCEPTED',
            message: isAr
              ? 'تم إرسال إشعار الاختبار من الخادم وقبوله بنجاح، وسيظهر على جهازك خلال لحظات.'
              : 'Server dispatched Web Push and push provider accepted delivery.'
          })
        } else {
          setPushVerificationBanner({
            state: 'IDLE',
            message: isAr
              ? `تعذر إرسال إشعار الدفع من الخادم (${data?.error || `HTTP ${status}`}).`
              : `Server push test failed (${data?.error || `HTTP ${status}`}).`
          })
        }
      } catch (err: any) {
        setPushVerificationBanner({
          state: 'IDLE',
          message: isAr
            ? `تعذر الاتصال بالخادم لإرسال إشعار الاختبار (${err?.message || 'خطأ شبكة'}).`
            : `Network error during server push test (${err?.message || 'Network error'}).`
        })
      } finally {
        setIsTestingPush(false)
      }
    },
    [wireRecords, createVerifiedPushSubscription, isAr]
  )

  // Format Condition Text in Arabic / English
  const formatConditionLabel = useCallback(
    (condition: AlertConditionType, targetPrice: number | null) => {
      switch (condition) {
        case 'down':
          return isAr ? 'عند انخفاض السعر' : 'When price decreases'
        case 'up':
          return isAr ? 'عند ارتفاع السعر' : 'When price increases'
        case 'any':
          return isAr ? 'عند أي تغيير في السعر' : 'On any price change'
        case 'target':
          return isAr
            ? `عند وصول السعر إلى ${targetPrice !== null ? targetPrice.toFixed(2) : '—'} د.ل`
            : `When price reaches ${targetPrice !== null ? targetPrice.toFixed(2) : '—'} LYD`
      }
    },
    [isAr]
  )

  // Combined Watchlist Items (Pinned wires + wires with configured alert rules)
  const watchlistWires = useMemo(() => {
    const idSet = new Set<string>([...favoriteIds, ...Object.keys(alertRules)])
    return wireRecords.filter((w) => idSet.has(w.id))
  }, [wireRecords, favoriteIds, alertRules])

  const activeAlertsCount = useMemo(() => {
    return Object.values(alertRules).filter((r) => r.enabled).length
  }, [alertRules])

  // Filter & Search Logic
  const filteredAndSortedWires = useMemo(() => {
    let result = [...wireRecords]

    if (selectedFilter === 'pinned') {
      const idSet = new Set<string>([...favoriteIds, ...Object.keys(alertRules)])
      result = result.filter((w) => idSet.has(w.id))
    } else if (selectedFilter === 'alerts') {
      result = result.filter((w) => Boolean(alertRules[w.id]?.enabled))
    } else if (selectedFilter !== 'all') {
      result = result.filter((w) => w.id === selectedFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (w) =>
          w.size.toLowerCase().includes(q) ||
          w.sizeEn.toLowerCase().includes(q) ||
          w.id.includes(q) ||
          w.manufacturer.toLowerCase().includes(q) ||
          w.packageType.toLowerCase().includes(q)
      )
    }

    if (selectedFilter === 'all') {
      result.sort((a, b) => {
        const aFav = favoriteIds.includes(a.id) || Boolean(alertRules[a.id]?.enabled)
        const bFav = favoriteIds.includes(b.id) || Boolean(alertRules[b.id]?.enabled)
        if (aFav && !bFav) return -1
        if (!aFav && bFav) return 1
        return a.sizeNumeric - b.sizeNumeric
      })
    }

    return result
  }, [wireRecords, favoriteIds, alertRules, selectedFilter, searchQuery])

  // Share Functionality
  const handleShare = useCallback(async () => {
    const shareTitle = isAr
      ? 'أسعار أسلاك النحاس الإيطالية | شركة الإنارة الحديثة'
      : 'Italian Copper Wire Prices | Enarah Modern'
    const shareText = isAr
      ? `تابع مرجع أسعار أسلاك النحاس الإيطالية لدى شركة الإنارة الحديثة (آخر تحديث: ${lastUpdateDate}):\n${window.location.href}`
      : `Official Italian copper wire price reference at Enarah Modern (Last updated: ${lastUpdateDate}):\n${window.location.href}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareTitle}\n${shareText}`)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2500)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }, [isAr, lastUpdateDate])

  // Printable / PDF Price List Export
  const handlePrintExport = useCallback(() => {
    window.print()
  }, [])

  // Selected wire for Alert Modal
  const activeModalWire = useMemo(() => {
    if (!alertModalWireId) return null
    return wireRecords.find((w) => w.id === alertModalWireId) || null
  }, [alertModalWireId, wireRecords])

  const activeModalExistingRule = useMemo(() => {
    if (!alertModalWireId) return null
    return alertRules[alertModalWireId] || null
  }, [alertModalWireId, alertRules])

  // Selected application item for Section C (Wire Application Studio) & Application Modal
  const activeSectionApplication = useMemo(() => {
    return (
      WIRE_APPLICATIONS.find((item) => item.id === selectedAppSizeId) || WIRE_APPLICATIONS[0]
    )
  }, [selectedAppSizeId])

  const activeSectionWireRecord = useMemo(() => {
    return wireRecords.find((w) => w.id === selectedAppSizeId) || DEFAULT_WIRES[0]
  }, [selectedAppSizeId, wireRecords])

  const activeModalApplication = useMemo(() => {
    if (!appModalWireId) return null
    return WIRE_APPLICATIONS.find((item) => item.id === appModalWireId) || null
  }, [appModalWireId])

  const activeModalAppWireRecord = useMemo(() => {
    if (!appModalWireId) return null
    return wireRecords.find((w) => w.id === appModalWireId) || null
  }, [appModalWireId, wireRecords])

  return (
    <div
      className="min-h-screen bg-[#F7F9FC] text-[#172334] font-sans selection:bg-[#3974C8] selection:text-white"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* ========================================================================= */}
      {/* SECTION A — PREMIUM NAVY HERO                                             */}
      {/* ========================================================================= */}
      <header className="bg-[#102A43] text-white border-b border-[#173B5E] py-9 sm:py-12 no-print">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Right Side: Main Heading & Supporting Description */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#081D35] border border-[#173B5E] text-[13px] font-medium text-[#7CC4FA] mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3974C8]" />
                <span>
                  {isAr
                    ? 'شركة الإنارة الحديثة · المرجع السعري المعتمد'
                    : 'Enarah Modern · Official Price Reference'}
                </span>
              </div>

              <h1 className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-white leading-[1.25] tracking-normal">
                {isAr ? 'أسعار أسلاك النحاس الإيطالية' : 'Italian Copper Wire Prices'}
              </h1>

              <p className="text-sm sm:text-base text-slate-200/90 mt-3 leading-relaxed max-w-2xl font-normal">
                {isAr
                  ? 'تابع أحدث أسعار أسلاك النحاس الإيطالية بمختلف المقاسات، من خلال مرجع واضح ومحدّث يساعد التجار والمختصين على متابعة الأسعار بسهولة.'
                  : 'Track the latest Italian copper wire prices across all wire sizes through a clear, updated reference designed for traders and specialists.'}
              </p>
            </div>

            {/* Left Side: Update Timestamp & Essential Actions */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4">
              {/* Real Update Information Box */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#081D35] border border-[#173B5E] text-[13px] text-slate-200">
                <Calendar className="w-4 h-4 text-[#7CC4FA] shrink-0" />
                <span>{isAr ? 'آخر تحديث للأسعار:' : 'Last Price Update:'}</span>
                <strong className="font-semibold text-white">{lastUpdateDate}</strong>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto lg:justify-end">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-[#173B5E] bg-[#081D35]/70 hover:bg-[#173B5E] text-[13px] font-medium text-white transition-colors duration-150 cursor-pointer"
                >
                  {copyFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">
                        {isAr ? 'تم نسخ الرابط' : 'Link Copied'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-[#7CC4FA]" />
                      <span>{isAr ? 'مشاركة الأسعار' : 'Share Prices'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrintExport}
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#3974C8] hover:bg-[#2d62b0] text-white text-[13px] font-semibold transition-colors duration-150 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>{isAr ? 'تحميل قائمة الأسعار' : 'Download Price List'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION B — PROFESSIONAL PRICE INDEX                                      */}
      {/* ========================================================================= */}
      <section
        aria-label={isAr ? 'جدول مرجع الأسعار' : 'Price Reference Table'}
        className="pt-8 pb-6 sm:pt-11 sm:pb-8 no-print"
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* Triggered Alert Notification Banner */}
          {triggeredAlerts.length > 0 && (
            <div className="mb-5 bg-[#081D35] text-white border border-[#3974C8] rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#3974C8]/20 border border-[#3974C8]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <BellRing className="w-4 h-4 text-[#7CC4FA]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      {isAr
                        ? 'تنبيه تغير أسعار الأسلاك المتابعة'
                        : 'Watched Wire Price Alert Triggered'}
                    </h2>
                    <ul className="mt-1.5 space-y-1 text-[13px] text-slate-200">
                      {triggeredAlerts.map((item) => (
                        <li key={item.id} className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-[#7CC4FA]">{item.sizeLabel}:</span>
                          <span>
                            {isAr
                              ? `تغير السعر من ${item.oldPrice.toFixed(2)} د.ل إلى ${item.newPrice.toFixed(2)} د.ل`
                              : `Price changed from ${item.oldPrice.toFixed(2)} LYD to ${item.newPrice.toFixed(2)} LYD`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTriggeredAlerts([])}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label={isAr ? 'إغلاق التنبيه' : 'Dismiss alert'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Unified Search & Filter Control Bar */}
          <div className="bg-white border border-[#E4EAF1] rounded-xl p-3.5 sm:p-4 mb-5 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
              {/* Search Field on the Right */}
              <div className="relative w-full lg:w-72 shrink-0">
                <Search className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'ابحث عن مقاس السلك…' : 'Search wire size…'}
                  className="w-full h-10 pl-9 pr-10 rounded-lg border border-[#E4EAF1] bg-[#F7F9FC] text-[14px] text-[#172334] placeholder:text-[#64748B] focus:bg-white focus:border-[#3974C8] focus:outline-none focus:ring-2 focus:ring-[#3974C8]/15 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#172334] cursor-pointer"
                    aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Horizontally Scrollable Size Filters + Watchlist & Active Alerts */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 lg:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedFilter('all')}
                  className={`h-9 px-3.5 rounded-lg text-[13px] font-medium transition-colors duration-150 shrink-0 cursor-pointer ${
                    selectedFilter === 'all'
                      ? 'bg-[#102A43] text-white font-semibold'
                      : 'bg-[#F7F9FC] text-[#64748B] hover:text-[#172334] hover:bg-[#EDF3F9] border border-[#E4EAF1]'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFilter(selectedFilter === 'pinned' ? 'all' : 'pinned')
                  }
                  className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-medium transition-colors duration-150 shrink-0 cursor-pointer ${
                    selectedFilter === 'pinned'
                      ? 'bg-[#102A43] text-white font-semibold'
                      : 'bg-[#F7F9FC] text-[#64748B] hover:text-[#172334] hover:bg-[#EDF3F9] border border-[#E4EAF1]'
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      selectedFilter === 'pinned'
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-amber-500'
                    }`}
                  />
                  <span>{isAr ? 'قائمة المتابعة' : 'Watchlist'}</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-black/10 tabular-nums">
                    {watchlistWires.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFilter(selectedFilter === 'alerts' ? 'all' : 'alerts')
                  }
                  className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-medium transition-colors duration-150 shrink-0 cursor-pointer ${
                    selectedFilter === 'alerts'
                      ? 'bg-[#3974C8] text-white font-semibold'
                      : 'bg-[#F7F9FC] text-[#64748B] hover:text-[#172334] hover:bg-[#EDF3F9] border border-[#E4EAF1]'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-[#3974C8] shrink-0" />
                  <span>{isAr ? 'التنبيهات النشطة' : 'Active Alerts'}</span>
                  {activeAlertsCount > 0 && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded tabular-nums ${
                        selectedFilter === 'alerts'
                          ? 'bg-white/20 text-white'
                          : 'bg-[#3974C8]/15 text-[#3974C8] font-bold'
                      }`}
                    >
                      {activeAlertsCount}
                    </span>
                  )}
                </button>

                <span className="h-5 w-px bg-[#E4EAF1] mx-1 shrink-0" />

                {DEFAULT_WIRES.map((wire) => {
                  const isSelected = selectedFilter === wire.id
                  return (
                    <button
                      key={wire.id}
                      type="button"
                      onClick={() => setSelectedFilter(isSelected ? 'all' : wire.id)}
                      className={`h-9 px-3 rounded-lg text-[13px] font-medium transition-colors duration-150 shrink-0 cursor-pointer tabular-nums ${
                        isSelected
                          ? 'bg-[#3974C8] text-white font-semibold'
                          : 'bg-[#F7F9FC] text-[#172334] hover:bg-[#EDF3F9] border border-[#E4EAF1]'
                      }`}
                    >
                      {isAr ? wire.size : wire.sizeEn}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Enterprise-Grade Price Reference Table */}
          <div className="bg-white border border-[#E4EAF1] rounded-xl overflow-hidden shadow-2xs">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#102A43] text-white text-[13px] font-medium border-b border-[#173B5E]">
                    <th className="py-3.5 px-6 w-48 font-semibold">
                      {isAr ? 'مقاس السلك' : 'Wire Size'}
                    </th>
                    <th className="py-3.5 px-6 font-semibold">
                      {isAr ? 'المواصفات' : 'Specifications'}
                    </th>
                    <th className="py-3.5 px-6 w-48 font-semibold">
                      {isAr ? 'السعر الحالي' : 'Current Price'}
                    </th>
                    <th className="py-3.5 px-6 w-40 font-semibold">
                      {isAr ? 'حركة السعر' : 'Price Movement'}
                    </th>
                    <th className="py-3.5 px-6 w-64 font-semibold text-left">
                      {isAr ? 'التنبيهات والاستخدامات' : 'Alerts & Applications'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4EAF1] text-[15px]">
                  {filteredAndSortedWires.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-sm text-[#64748B]"
                      >
                        {isAr
                          ? 'لا توجد مقاسات مطابقة لبحثك.'
                          : 'No wire sizes match your search.'}
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedWires.map((wire) => {
                      const isFav = favoriteIds.includes(wire.id)
                      const rule = alertRules[wire.id]
                      const hasActiveAlert = Boolean(rule && rule.enabled)

                      return (
                        <tr
                          key={wire.id}
                          className={`transition-colors duration-150 ${
                            isFav || hasActiveAlert ? 'bg-[#EDF3F9]/40' : 'bg-white'
                          } hover:bg-[#F7F9FC]`}
                        >
                          {/* 1. مقاس السلك */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => toggleFavorite(wire.id)}
                                className="p-1 rounded text-[#94A3B8] hover:text-amber-500 transition-colors cursor-pointer"
                                title={
                                  isFav
                                    ? isAr
                                      ? 'إزالة من قائمة المتابعة'
                                      : 'Remove from watchlist'
                                    : isAr
                                    ? 'إضافة لقائمة المتابعة'
                                    : 'Add to watchlist'
                                }
                                aria-label={isFav ? 'Unpin wire size' : 'Pin wire size'}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    isFav
                                      ? 'fill-amber-400 text-amber-500'
                                      : 'text-[#CBD5E1]'
                                  }`}
                                />
                              </button>
                              <span className="text-[17px] font-bold text-[#172334] tabular-nums">
                                {isAr ? wire.size : wire.sizeEn}
                              </span>
                            </div>
                          </td>

                          {/* 2. المواصفات */}
                          <td className="py-4 px-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                              <span className="text-[15px] font-medium text-[#172334]">
                                {isAr ? wire.packageType : wire.packageTypeEn}
                              </span>
                              <span className="hidden sm:inline text-[#CBD5E1]">•</span>
                              <span className="text-[13px] text-[#64748B]">
                                {isAr ? wire.manufacturer : wire.manufacturerEn}
                              </span>
                            </div>
                          </td>

                          {/* 3. السعر الحالي */}
                          <td className="py-4 px-6">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[22px] font-semibold text-[#172334] tabular-nums">
                                {wire.price.toFixed(2)}
                              </span>
                              <span className="text-[13px] font-medium text-[#64748B]">
                                {isAr ? 'د.ل' : 'LYD'}
                              </span>
                            </div>
                          </td>

                          {/* 4. حركة السعر */}
                          <td className="py-4 px-6">
                            {wire.trend === 'up' && wire.changeAmount !== undefined ? (
                              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#C44949] bg-[#C44949]/10 px-2.5 py-1 rounded-md">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span className="tabular-nums">
                                  {isAr ? 'ارتفاع' : 'Up'} +{wire.changeAmount.toFixed(2)}
                                </span>
                              </span>
                            ) : wire.trend === 'down' &&
                              wire.changeAmount !== undefined ? (
                              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#16845B] bg-[#16845B]/10 px-2.5 py-1 rounded-md">
                                <TrendingDown className="w-3.5 h-3.5" />
                                <span className="tabular-nums">
                                  {isAr ? 'انخفاض' : 'Down'} {wire.changeAmount.toFixed(2)}
                                </span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#718096] bg-[#EDF3F9] px-2.5 py-1 rounded-md">
                                <Minus className="w-3.5 h-3.5" />
                                <span>{isAr ? 'مستقر' : 'Stable'}</span>
                              </span>
                            )}
                          </td>

                          {/* 5. التنبيهات والاستخدامات */}
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openAlertModal(wire.id)}
                                className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                                  hasActiveAlert
                                    ? 'bg-[#102A43] text-white hover:bg-[#173B5E]'
                                    : 'bg-[#EDF3F9] text-[#102A43] hover:bg-[#3974C8] hover:text-white border border-[#D8E3F0]'
                                }`}
                                title={
                                  isAr
                                    ? 'تابع سعر هذا السلك وتلقَّ إشعاراً عند تغيره'
                                    : 'Follow wire price and receive notifications'
                                }
                              >
                                {hasActiveAlert ? (
                                  <BellRing className="w-3.5 h-3.5 text-[#7CC4FA]" />
                                ) : (
                                  <Bell className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {hasActiveAlert
                                    ? isAr
                                      ? 'تنبيه مفعل'
                                      : 'Alert Active'
                                    : isAr
                                    ? 'تابع السعر'
                                    : 'Track Price'}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAppSizeId(wire.id)
                                  setAppModalWireId(wire.id)
                                }}
                                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12px] font-medium bg-white text-[#172334] hover:bg-[#F7F9FC] border border-[#E4EAF1] transition-colors cursor-pointer"
                                title={
                                  isAr
                                    ? 'استعرض الاستخدامات الشائعة لهذا المقاس'
                                    : 'View common applications for this size'
                                }
                              >
                                <Eye className="w-3.5 h-3.5 text-[#3974C8]" />
                                <span>{isAr ? 'الاستخدامات' : 'Uses'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Purpose-Built Compact Price Rows */}
            <div className="md:hidden">
              <div className="bg-[#102A43] text-white px-4 py-2.5 flex items-center justify-between text-xs font-medium">
                <span>{isAr ? 'المقاس والمواصفات' : 'Size & Specs'}</span>
                <span>{isAr ? 'السعر الحالي (د.ل)' : 'Current Price (LYD)'}</span>
              </div>

              <div className="divide-y divide-[#E4EAF1]">
                {filteredAndSortedWires.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#64748B]">
                    {isAr
                      ? 'لا توجد مقاسات مطابقة لبحثك.'
                      : 'No wire sizes match your search.'}
                  </div>
                ) : (
                  filteredAndSortedWires.map((wire) => {
                    const isFav = favoriteIds.includes(wire.id)
                    const rule = alertRules[wire.id]
                    const hasActiveAlert = Boolean(rule && rule.enabled)

                    return (
                      <div
                        key={wire.id}
                        className={`px-4 py-3.5 transition-colors ${
                          isFav || hasActiveAlert ? 'bg-[#EDF3F9]/45' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              type="button"
                              onClick={() => toggleFavorite(wire.id)}
                              className="p-1 -mr-1 text-[#94A3B8] hover:text-amber-500 shrink-0 cursor-pointer"
                              aria-label="Toggle favorite"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  isFav
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-[#CBD5E1]'
                                }`}
                              />
                            </button>
                            <div className="min-w-0">
                              <div className="text-[16px] font-bold text-[#172334] tabular-nums leading-tight">
                                {isAr ? wire.size : wire.sizeEn}
                              </div>
                              <div className="text-[12px] text-[#64748B] truncate mt-0.5">
                                {isAr ? wire.packageType : wire.packageTypeEn}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-left">
                              <div className="flex items-baseline gap-1 justify-end">
                                <span className="text-[19px] font-semibold text-[#172334] tabular-nums">
                                  {wire.price.toFixed(2)}
                                </span>
                                <span className="text-[12px] font-medium text-[#64748B]">
                                  {isAr ? 'د.ل' : 'LYD'}
                                </span>
                              </div>

                              <div className="flex justify-end mt-0.5">
                                {wire.trend === 'up' &&
                                wire.changeAmount !== undefined ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C44949]">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="tabular-nums">
                                      {isAr ? 'ارتفاع' : 'Up'} +{wire.changeAmount.toFixed(2)}
                                    </span>
                                  </span>
                                ) : wire.trend === 'down' &&
                                  wire.changeAmount !== undefined ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16845B]">
                                    <TrendingDown className="w-3 h-3" />
                                    <span className="tabular-nums">
                                      {isAr ? 'انخفاض' : 'Down'} {wire.changeAmount.toFixed(2)}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-[#718096]">
                                    <span>{isAr ? 'مستقر' : 'Stable'}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2.5 border-t border-[#E4EAF1]/80 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => openAlertModal(wire.id)}
                            className={`flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                              hasActiveAlert
                                ? 'bg-[#102A43] text-white'
                                : 'bg-[#EDF3F9] text-[#102A43] border border-[#D8E3F0]'
                            }`}
                          >
                            {hasActiveAlert ? (
                              <BellRing className="w-3.5 h-3.5 text-[#7CC4FA]" />
                            ) : (
                              <Bell className="w-3.5 h-3.5 text-[#3974C8]" />
                            )}
                            <span>
                              {hasActiveAlert
                                ? isAr
                                  ? 'تنبيه السعر مفعل'
                                  : 'Alert Active'
                                : isAr
                                ? 'تابع السعر'
                                : 'Track Price'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAppSizeId(wire.id)
                              setAppModalWireId(wire.id)
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-[12px] font-medium bg-[#F7F9FC] text-[#172334] border border-[#E4EAF1] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#3974C8]" />
                            <span>{isAr ? 'الاستخدامات' : 'Applications'}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Table Footer Policy Note */}
            <div className="px-5 py-3.5 bg-[#EDF3F9]/60 border-t border-[#E4EAF1] flex items-start sm:items-center gap-2.5 text-[13px] text-[#64748B]">
              <Info className="w-4 h-4 text-[#3974C8] shrink-0 mt-0.5 sm:mt-0" />
              <p className="leading-relaxed">
                {isAr
                  ? 'تعبر الأسعار الموضحة عن قائمة البيع المعتمدة لدى شركة الإنارة الحديثة (لفة 100 متر)، وتخضع للتحديث وفق نشرات التوريد الرسمية للشركة.'
                  : 'Listed prices reflect the official selling schedule at Enarah Modern (100m roll) and are updated according to company supply notices.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION E — PERSONAL WIRE WATCHLIST & SMART PRICE ALERTS (DARK NAVY)     */}
      {/* ========================================================================= */}
      <section
        aria-labelledby="personal-watchlist-heading"
        className="py-6 sm:py-8 no-print"
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="bg-[#0B1F36] text-white border border-[#1B3B5C] rounded-2xl p-5 sm:p-7 shadow-md">
            {/* Organized Header & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1B3B5C]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#132F4C] border border-[#234B73] text-[12px] font-medium text-[#7CC4FA] mb-2.5">
                  <BellRing className="w-3.5 h-3.5" />
                  <span>
                    {isAr
                      ? 'متابعة ذكية وتنبيهات الأسعار'
                      : 'Smart Watchlist & Price Alerts'}
                  </span>
                </div>
                <h2
                  id="personal-watchlist-heading"
                  className="text-xl sm:text-[24px] font-bold text-white"
                >
                  {isAr
                    ? 'قائمة المتابعة والتنبيهات الشخصية'
                    : 'Personal Wire Watchlist & Alerts'}
                </h2>
                <p className="text-[13px] sm:text-sm text-slate-300/90 mt-1.5 leading-relaxed">
                  {isAr
                    ? 'تابع المقاسات التي تهمك على هذا الجهاز واضبط شروط التنبيه لتصلك إشعارات فورية عند تغير السعر.'
                    : 'Follow key wire sizes on this device and configure alert conditions to receive notifications when prices change.'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full md:w-auto pt-1 md:pt-0">
                <button
                  type="button"
                  onClick={() => openAlertModal('2.5')}
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-[#3974C8] hover:bg-[#2d62b0] text-white text-[12px] sm:text-[13px] font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Bell className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="truncate">
                    {isAr ? '+ إضافة تنبيه سعر' : '+ Add Price Alert'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendVerificationNotification()}
                  disabled={isTestingPush}
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl border border-[#264F78] bg-[#132F4C] hover:bg-[#1A3B5C] text-[12px] sm:text-[13px] font-medium text-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#7CC4FA] shrink-0" />
                  <span className="truncate">
                    {isTestingPush
                      ? isAr
                        ? 'جارٍ الإرسال…'
                        : 'Sending…'
                      : isAr
                      ? 'اختبار إشعار الهاتف'
                      : 'Test Device Push'}
                  </span>
                </button>
              </div>
            </div>

            {/* Real-time Push Delivery Verification Status Banner */}
            {pushVerificationBanner && (
              <div
                className={`mt-4 rounded-xl border p-3.5 flex items-start justify-between gap-3 text-xs leading-relaxed ${
                  pushVerificationBanner.state === 'DEVICE_NOTIFICATION_VERIFIED'
                    ? 'bg-[#0F382F] border-[#1E6B52] text-emerald-200'
                    : pushVerificationBanner.state === 'PUSH_REQUEST_ACCEPTED'
                    ? 'bg-[#132F4C] border-[#2B5B8C] text-slate-100'
                    : 'bg-[#3B1822] border-[#7A2E3E] text-rose-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      pushVerificationBanner.state === 'DEVICE_NOTIFICATION_VERIFIED'
                        ? 'text-emerald-400'
                        : pushVerificationBanner.state === 'PUSH_REQUEST_ACCEPTED'
                        ? 'text-[#7CC4FA]'
                        : 'text-rose-400'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-white block mb-0.5">
                      {pushVerificationBanner.state === 'DEVICE_NOTIFICATION_VERIFIED'
                        ? isAr
                          ? 'تم التحقق من وصول الإشعار للجهاز'
                          : 'Device Notification Verified'
                        : pushVerificationBanner.state === 'PUSH_REQUEST_ACCEPTED'
                        ? isAr
                          ? 'تم إرسال إشعار الاختبار بنجاح'
                          : 'Push Notification Sent'
                        : isAr
                        ? 'تنبيه حالة الإشعار'
                        : 'Push Status Notice'}
                    </span>
                    <span className="text-slate-200/95">
                      {pushVerificationBanner.message}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPushVerificationBanner(null)}
                  className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Watchlist Cards Grid */}
            {watchlistWires.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#132F4C] border border-[#234B73] flex items-center justify-center mx-auto mb-3">
                  <BellOff className="w-5 h-5 text-[#7CC4FA]" />
                </div>
                <p className="text-sm font-semibold text-white">
                  {isAr
                    ? 'قائمة المتابعة الشخصية فارغة حالياً'
                    : 'Your personal wire watchlist is currently empty'}
                </p>
                <p className="text-xs text-slate-300/80 mt-1 mb-4 max-w-md mx-auto">
                  {isAr
                    ? 'اضغط على زر "تابع السعر" بجانب أي مقاس في الجدول لإضافته وضبط شروط الإشعار.'
                    : 'Click "Track Price" next to any wire size in the table to add it and set alert conditions.'}
                </p>
                <button
                  type="button"
                  onClick={() => openAlertModal('1.5')}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-[#3974C8] hover:bg-[#2d62b0] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تفعيل أول تنبيه سعر' : 'Create First Price Alert'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-5">
                {watchlistWires.map((wire) => {
                  const rule = alertRules[wire.id]
                  const hasRule = Boolean(rule)
                  const isRuleEnabled = Boolean(rule && rule.enabled)

                  return (
                    <div
                      key={wire.id}
                      className={`rounded-xl border p-4 flex flex-col justify-between gap-3.5 transition-colors ${
                        isRuleEnabled
                          ? 'bg-[#132F4C] border-[#2E5D8E]'
                          : 'bg-[#102741] border-[#1F3F60] hover:border-[#2C5682]'
                      }`}
                    >
                      {/* Row 1: Wire Size & Price Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[18px] font-bold text-white tabular-nums">
                              {isAr ? wire.size : wire.sizeEn}
                            </span>
                            {wire.trend === 'down' && wire.changeAmount !== undefined ? (
                              <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-400/25 px-2 py-0.5 rounded-md">
                                {isAr ? 'انخفاض' : 'Down'} {wire.changeAmount.toFixed(2)}
                              </span>
                            ) : wire.trend === 'up' && wire.changeAmount !== undefined ? (
                              <span className="text-[11px] font-medium text-rose-300 bg-rose-500/15 border border-rose-400/25 px-2 py-0.5 rounded-md">
                                {isAr ? 'ارتفاع' : 'Up'} +{wire.changeAmount.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-slate-200 bg-[#1B3958] border border-[#294E75] px-2 py-0.5 rounded-md">
                                {isAr ? 'مستقر' : 'Stable'}
                              </span>
                            )}
                          </div>
                          <span className="text-[12px] text-slate-300/80 block mt-0.5">
                            {isAr ? wire.packageType : wire.packageTypeEn}
                          </span>
                        </div>

                        <div className="text-left shrink-0">
                          <div className="text-[20px] font-bold text-white tabular-nums leading-tight">
                            {wire.price.toFixed(2)}{' '}
                            <span className="text-[12px] font-medium text-[#7CC4FA]">
                              {isAr ? 'د.ل' : 'LYD'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Organized Condition & Notification Status Strip */}
                      <div className="rounded-lg bg-[#091728]/90 border border-[#1B3958] px-3 py-2.5 text-[12px]">
                        {hasRule ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-slate-300/80">
                                {isAr ? 'شرط التنبيه:' : 'Condition:'}
                              </span>
                              <strong className="font-semibold text-white">
                                {formatConditionLabel(rule.condition, rule.targetPrice)}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#152E4A]">
                              <span className="text-slate-300/80">
                                {isAr ? 'حالة الإشعار:' : 'Status:'}
                              </span>
                              {!rule.enabled ? (
                                <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                                  <PauseCircle className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'متوقف مؤقتاً' : 'Paused'}</span>
                                </span>
                              ) : rule.deliveryMode === 'push' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>
                                    {rule.verificationState === 'DEVICE_NOTIFICATION_VERIFIED'
                                      ? isAr
                                        ? 'مفعل ومتحقق منه'
                                        : 'Device Push Verified'
                                      : isAr
                                      ? 'إشعار الهاتف مفعل'
                                      : 'Push Active'}
                                  </span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[#7CC4FA] font-medium">
                                  <Star className="w-3.5 h-3.5" />
                                  <span>
                                    {isAr
                                      ? 'متابعة داخل القائمة فقط'
                                      : 'Watchlist Only'}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 text-slate-300/90">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#7CC4FA]" />
                              <span>
                                {isAr
                                  ? 'مضاف للمتابعة السريعة · بدون تنبيه مشروط'
                                  : 'Pinned to watchlist · No alert rule set'}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Row 3: Organized Action Controls */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openAlertModal(wire.id)}
                            className={`inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                              hasRule
                                ? 'bg-[#1B3B5C] hover:bg-[#3974C8] text-white border border-[#2B547E]'
                                : 'bg-[#3974C8] hover:bg-[#2d62b0] text-white'
                            }`}
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>
                              {hasRule
                                ? isAr
                                  ? 'تعديل التنبيه'
                                  : 'Edit Alert'
                                : isAr
                                ? 'تفعيل التنبيه'
                                : 'Activate Alert'}
                            </span>
                          </button>

                          {hasRule && (
                            <button
                              type="button"
                              onClick={() => handleToggleRuleEnabled(wire.id)}
                              className="inline-flex items-center gap-1 h-8.5 px-2.5 rounded-lg border border-[#23476B] bg-[#0D2138] hover:bg-[#163454] text-slate-200 text-[12px] font-medium transition-colors cursor-pointer"
                            >
                              {rule.enabled ? (
                                <>
                                  <PauseCircle className="w-3.5 h-3.5 text-amber-300" />
                                  <span>{isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-3.5 h-3.5 text-emerald-300" />
                                  <span>{isAr ? 'تفعيل' : 'Enable'}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteAlertRule(wire.id, true)}
                          className="h-8.5 w-8.5 rounded-lg bg-[#091728]/80 border border-[#1B3958] text-slate-300 hover:text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          title={
                            isAr ? 'إزالة من قائمة المتابعة' : 'Remove from watchlist'
                          }
                          aria-label={
                            isAr ? 'إزالة من قائمة المتابعة' : 'Remove from watchlist'
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION C — WIRE APPLICATION STUDIO (V10 INSTANT PRELOAD + NANO BANANA)   */}
      {/* ========================================================================= */}
      <section
        id="wire-applications-guide"
        aria-labelledby="visual-applications-heading"
        className="py-10 sm:py-14 no-print"
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* 1 & 2. Section Heading & Description */}
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#3974C8] mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isAr
                  ? 'دليل الاستخدامات الهندسية المصور'
                  : 'Visual Wire Application Studio'}
              </span>
            </div>
            <h2
              id="visual-applications-heading"
              className="text-2xl sm:text-[30px] font-bold text-[#102A43] leading-snug"
            >
              {isAr
                ? 'الاستخدامات الشائعة للأسلاك النحاسية'
                : 'Common Applications of Copper Wires'}
            </h2>
            <p className="text-sm sm:text-[15px] text-[#64748B] mt-2 leading-relaxed">
              {isAr
                ? 'اكتشف الاستخدامات الشائعة لمقاسات الأسلاك المختلفة من خلال صور واقعية ومعلومات مبسطة تساعدك على فهم طبيعة كل استخدام.'
                : 'Discover the common applications of different wire sizes through realistic photography and clear technical summaries.'}
            </p>
          </div>

          {/* 3. Professional Segmented Wire-Size Selector (With Hover/Touch Instant Preload) */}
          <div
            role="tablist"
            aria-label={isAr ? 'اختيار مقاس السلك' : 'Select wire size'}
            className="bg-white border border-[#E4EAF1] rounded-xl p-1.5 mb-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-2xs"
          >
            {WIRE_APPLICATIONS.map((appItem) => {
              const isSelected = selectedAppSizeId === appItem.id
              return (
                <button
                  key={appItem.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onMouseEnter={() => {
                    setMountedWireIds((prev) =>
                      prev[appItem.id] ? prev : { ...prev, [appItem.id]: true }
                    )
                    preloadAndDecodeWireImage(appItem.id)
                  }}
                  onTouchStart={() => {
                    setMountedWireIds((prev) =>
                      prev[appItem.id] ? prev : { ...prev, [appItem.id]: true }
                    )
                    preloadAndDecodeWireImage(appItem.id)
                  }}
                  onFocus={() => {
                    setMountedWireIds((prev) =>
                      prev[appItem.id] ? prev : { ...prev, [appItem.id]: true }
                    )
                    preloadAndDecodeWireImage(appItem.id)
                  }}
                  onClick={() => handleSelectAppSize(appItem.id)}
                  className={`flex-1 min-w-[104px] h-10 px-4 rounded-lg text-[14px] transition-colors duration-100 shrink-0 cursor-pointer tabular-nums flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#102A43] text-white font-bold shadow-2xs'
                      : 'bg-[#F7F9FC] text-[#172334] hover:bg-[#EDF3F9] font-medium'
                  }`}
                >
                  {isAr ? appItem.size : appItem.sizeEn}
                </button>
              )
            })}
          </div>

          {/* Balanced Two-Column Studio Layout (Desktop: Right 45% Info / Left 55% Image; Mobile: Image First then Info) */}
          <div className="bg-white border border-[#E4EAF1] rounded-2xl overflow-hidden shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left on Desktop (55% -> col-span-7, lg:order-2), First on Mobile (order-1): Stable 4:3 Application Image Container */}
              <div
                className="order-1 lg:order-2 lg:col-span-7 bg-[#081D35] relative overflow-hidden aspect-[4/3] min-h-[260px] sm:min-h-[360px] lg:min-h-[440px] w-full select-none"
                style={{ aspectRatio: '4 / 3' }}
              >
                {/* Lightweight Matching Placeholder / Error State (Zero White Flash, Zero Stale Image) */}
                {!decodedWireIds[selectedAppSizeId] && (
                  <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-[#0B1F36] text-white p-6 text-center">
                    {failedWireIds[selectedAppSizeId] ? (
                      <div className="space-y-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#132F4C] border border-[#234B73] text-xs font-bold text-[#7CC4FA] tabular-nums">
                          {isAr
                            ? activeSectionApplication.size
                            : activeSectionApplication.sizeEn}
                        </span>
                        <p className="text-xs text-slate-300">
                          {isAr
                            ? 'تعذر تحميل الصورة بسبب ضعف الاتصال.'
                            : 'Could not load image due to connection issue.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setFailedWireIds((prev) => {
                              const next = { ...prev }
                              delete next[selectedAppSizeId]
                              return next
                            })
                            preloadAndDecodeWireImage(selectedAppSizeId)
                          }}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#3974C8] text-white text-xs font-semibold cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <span className="inline-flex items-center px-3.5 py-1 rounded-lg bg-[#132F4C] border border-[#234B73] text-sm font-bold text-[#7CC4FA] tabular-nums">
                          {isAr
                            ? activeSectionApplication.size
                            : activeSectionApplication.sizeEn}
                        </span>
                        <p className="text-xs text-slate-300 font-medium">
                          {isAr
                            ? activeSectionApplication.headingAr
                            : activeSectionApplication.headingEn}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Stacked Pre-Decoded Image Layers for Instant 0ms Switching & Zero Flicker */}
                {WIRE_APPLICATIONS.map((appItem) => {
                  const isCurrent = appItem.wireId === selectedAppSizeId
                  const shouldRenderLayer =
                    isCurrent ||
                    Boolean(mountedWireIds[appItem.wireId]) ||
                    Boolean(decodedWireIds[appItem.wireId])

                  if (!shouldRenderLayer) return null

                  return (
                    <picture
                      key={appItem.wireId}
                      className={
                        isCurrent && !failedWireIds[appItem.wireId]
                          ? 'relative inset-0 w-full h-full block transition-opacity duration-150 ease-out opacity-100 z-10'
                          : 'absolute inset-0 w-full h-full block transition-opacity duration-150 ease-out opacity-0 z-0 pointer-events-none'
                      }
                    >
                      <source
                        type="image/avif"
                        srcSet={appItem.avifSrcSet}
                        sizes="(max-width: 640px) 480px, (max-width: 1024px) 800px, 680px"
                      />
                      <source
                        type="image/webp"
                        srcSet={appItem.webpSrcSet}
                        sizes="(max-width: 640px) 480px, (max-width: 1024px) 800px, 680px"
                      />
                      <img
                        src={appItem.imageUrl}
                        srcSet={appItem.jpgSrcSet}
                        sizes="(max-width: 640px) 480px, (max-width: 1024px) 800px, 680px"
                        alt={isAr ? appItem.imageAlt : appItem.imageAltEn}
                        width={800}
                        height={600}
                        loading={isCurrent ? 'eager' : 'eager'}
                        fetchPriority={isCurrent ? 'high' : 'auto'}
                        decoding="async"
                        onLoad={() => {
                          setDecodedWireIds((prev) =>
                            prev[appItem.wireId] ? prev : { ...prev, [appItem.wireId]: true }
                          )
                        }}
                        onError={() => {
                          setFailedWireIds((prev) => ({ ...prev, [appItem.wireId]: true }))
                        }}
                        className="w-full h-full object-cover object-center"
                      />
                    </picture>
                  )
                })}
              </div>

              {/* Right on Desktop (45% -> col-span-5, lg:order-1), Second on Mobile (order-2): Structured Details */}
              <div className="order-2 lg:order-1 lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  {/* Selected Wire Size Badge + Current Price */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EDF3F9] text-[#102A43] text-[13px] font-bold tabular-nums">
                      <span>{isAr ? 'مقاس السلك:' : 'Wire Size:'}</span>
                      <span>
                        {isAr
                          ? activeSectionApplication.size
                          : activeSectionApplication.sizeEn}
                      </span>
                    </span>

                    <span className="text-[14px] font-bold text-[#172334] tabular-nums">
                      {activeSectionWireRecord.price.toFixed(2)}{' '}
                      <span className="text-[12px] font-medium text-[#64748B]">
                        {isAr ? 'د.ل / لفة 100م' : 'LYD / 100m'}
                      </span>
                    </span>
                  </div>

                  {/* Application Heading */}
                  <h3 className="text-xl sm:text-[22px] font-bold text-[#102A43] leading-snug">
                    {isAr
                      ? activeSectionApplication.headingAr
                      : activeSectionApplication.headingEn}
                  </h3>

                  {/* Short Explanation */}
                  <p className="text-[14px] text-[#64748B] mt-2.5 leading-relaxed">
                    {isAr
                      ? activeSectionApplication.summaryAr
                      : activeSectionApplication.summaryEn}
                  </p>

                  {/* Three Concise Application Examples */}
                  <div className="mt-5">
                    <h4 className="text-xs font-bold text-[#172334] mb-2.5">
                      {isAr ? 'أمثلة الاستخدام الشائعة:' : 'Common Usage Examples:'}
                    </h4>
                    <ul className="space-y-2">
                      {(isAr
                        ? activeSectionApplication.examplesAr
                        : activeSectionApplication.examplesEn
                      ).map((example, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7F9FC] border border-[#E4EAF1] text-[13px] text-[#172334] leading-relaxed"
                        >
                          <span className="w-5 h-5 rounded-md bg-[#102A43] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                            {idx + 1}
                          </span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical Note + Alert Action */}
                <div className="mt-6 pt-5 border-t border-[#E4EAF1] space-y-4">
                  <div className="rounded-xl bg-[#EDF3F9]/70 border border-[#D8E3F0] p-3 text-[12px] text-[#172334] leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#3974C8] shrink-0 mt-0.5" />
                    <p>
                      <strong className="font-bold text-[#102A43]">
                        {isAr ? 'ملاحظة فنية:' : 'Technical Note:'}
                      </strong>{' '}
                      {isAr
                        ? activeSectionApplication.technicalNoteAr
                        : activeSectionApplication.technicalNoteEn}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openAlertModal(activeSectionApplication.id)}
                    className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#102A43] hover:bg-[#173B5E] text-white text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-[#7CC4FA]" />
                    <span>
                      {isAr
                        ? `تابع سعر سلك ${activeSectionApplication.size}`
                        : `Track ${activeSectionApplication.sizeEn} Wire Price`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION D — INTERACTIVE 3D CABLE LABORATORY                               */}
      {/* ========================================================================= */}
      <WireAnatomy3D isAr={isAr} />

      {/* ========================================================================= */}
      {/* MODAL 1 — SMART WIRE PRICE ALERT DIALOG ("تابع سعر هذا السلك")            */}
      {/* ========================================================================= */}
      {activeModalWire && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081D35]/75 backdrop-blur-xs no-print"
          role="dialog"
          aria-modal="true"
          aria-labelledby="smart-alert-dialog-title"
        >
          <div className="bg-white border border-[#E4EAF1] rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-xl">
            {/* Modal Navy Header */}
            <div className="bg-[#102A43] text-white px-5 py-4 flex items-center justify-between border-b border-[#173B5E]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#081D35] border border-[#173B5E] flex items-center justify-center">
                  <Bell className="w-4 h-4 text-[#7CC4FA]" />
                </div>
                <div>
                  <h3 id="smart-alert-dialog-title" className="text-base font-bold text-white">
                    {isAr ? 'تابع سعر هذا السلك' : 'Track This Wire Price'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    {isAr
                      ? 'تنبيهات الأسعار الفورية عبر Web Push'
                      : 'Real-time Web Push price alerts'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAlertModal}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAlertRule} className="p-5 space-y-4">
              {/* Selected Wire Size + Current Price + Notification Status */}
              <div className="bg-[#F7F9FC] border border-[#E4EAF1] rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label
                      htmlFor="modal-wire-size-select"
                      className="block text-[11px] font-medium text-[#64748B] mb-1"
                    >
                      {isAr ? 'مقاس السلك المختار' : 'Selected Wire Size'}
                    </label>
                    <select
                      id="modal-wire-size-select"
                      value={activeModalWire.id}
                      onChange={(e) => openAlertModal(e.target.value)}
                      className="bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1 text-sm font-bold text-[#102A43] focus:outline-none focus:border-[#3974C8]"
                    >
                      {wireRecords.map((w) => (
                        <option key={w.id} value={w.id}>
                          {isAr ? w.size : w.sizeEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-left">
                    <span className="block text-[11px] font-medium text-[#64748B]">
                      {isAr ? 'السعر الحالي' : 'Current Price'}
                    </span>
                    <div className="text-xl font-bold text-[#102A43] tabular-nums">
                      {activeModalWire.price.toFixed(2)}{' '}
                      <span className="text-xs font-medium text-[#64748B]">
                        {isAr ? 'د.ل' : 'LYD'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Notification Status Row */}
                <div className="pt-2 border-t border-[#E4EAF1] flex items-center justify-between text-[12px]">
                  <span className="text-[#64748B]">
                    {isAr ? 'حالة الإشعار الحالية:' : 'Current Alert Status:'}
                  </span>
                  {activeModalExistingRule ? (
                    activeModalExistingRule.enabled &&
                    activeModalExistingRule.deliveryMode === 'push' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-[#16845B]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {isAr
                            ? 'مفعل ومحفوظ على الخادم'
                            : 'Active & Saved on Server'}
                        </span>
                      </span>
                    ) : !activeModalExistingRule.enabled ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                        <PauseCircle className="w-3.5 h-3.5" />
                        <span>{isAr ? 'متوقف مؤقتاً' : 'Paused'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#3974C8]">
                        <span>
                          {isAr ? 'متابعة في القائمة فقط' : 'Watchlist Only'}
                        </span>
                      </span>
                    )
                  ) : (
                    <span className="text-[#64748B]">
                      {isAr ? 'غير مفعل بعد' : 'Not Activated Yet'}
                    </span>
                  )}
                </div>
              </div>

              {/* Alert Conditions Radio Group */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#172334]">
                  {isAr ? 'شرط التنبيه:' : 'Alert Condition:'}
                </label>

                {(
                  [
                    {
                      id: 'down' as AlertConditionType,
                      labelAr: 'عند انخفاض السعر',
                      labelEn: 'When price decreases'
                    },
                    {
                      id: 'up' as AlertConditionType,
                      labelAr: 'عند ارتفاع السعر',
                      labelEn: 'When price increases'
                    },
                    {
                      id: 'any' as AlertConditionType,
                      labelAr: 'عند أي تغيير في السعر',
                      labelEn: 'On any price change'
                    },
                    {
                      id: 'target' as AlertConditionType,
                      labelAr: 'عند وصول السعر إلى مبلغ محدد',
                      labelEn: 'When price reaches a specific target amount'
                    }
                  ] as const
                ).map((option) => {
                  const isChecked = modalCondition === option.id
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#EDF3F9]/80 border-[#3974C8]'
                          : 'bg-white border-[#E4EAF1] hover:bg-[#F7F9FC]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="alertCondition"
                        value={option.id}
                        checked={isChecked}
                        onChange={() => {
                          setModalCondition(option.id)
                          setModalError(null)
                        }}
                        className="accent-[#3974C8]"
                      />
                      <span className="text-xs font-bold text-[#102A43]">
                        {isAr ? option.labelAr : option.labelEn}
                      </span>
                    </label>
                  )
                })}
              </div>

              {/* Target Price Numeric Input */}
              {modalCondition === 'target' && (
                <div className="bg-[#F7F9FC] border border-[#CBD5E1] rounded-xl p-3.5">
                  <label
                    htmlFor="target-price-input"
                    className="block text-xs font-bold text-[#102A43] mb-1.5"
                  >
                    {isAr
                      ? 'السعر المستهدف (د.ل لكل لفة 100 متر):'
                      : 'Target Price (LYD per 100m roll):'}
                  </label>
                  <div className="relative">
                    <input
                      id="target-price-input"
                      type="number"
                      step="0.5"
                      min="1"
                      max="100000"
                      value={modalTargetPrice}
                      onChange={(e) => setModalTargetPrice(e.target.value)}
                      placeholder="350.00"
                      className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] bg-white text-base font-bold text-[#102A43] tabular-nums focus:outline-none focus:border-[#3974C8]"
                      required
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B]">
                      {isAr ? 'د.ل' : 'LYD'}
                    </span>
                  </div>
                </div>
              )}

              {/* PART 8 — IPHONE HOME SCREEN INSTALLATION GUIDANCE (Shown when iPhone is not in standalone mode) */}
              {deviceCapabilities.isIOSRequiresHomeScreen && (
                <div
                  data-testid="iphone-pwa-guidance"
                  className="rounded-xl bg-[#0B1F36] border border-[#234B73] p-4 text-[12px] text-white leading-relaxed space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <Smartphone className="w-4 h-4 text-[#7CC4FA] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-[#7CC4FA] mb-1">
                        {isAr
                          ? 'إعداد إشعارات الأسعار على هاتف iPhone'
                          : 'iPhone Notification Setup Required'}
                      </strong>
                      <p className="text-slate-100 font-medium">
                        {isAr ? IPHONE_HOME_SCREEN_MESSAGE_AR : IPHONE_HOME_SCREEN_MESSAGE_EN}
                      </p>
                    </div>
                  </div>

                  <ol className="space-y-1.5 bg-[#132F4C] border border-[#234B73] rounded-lg p-3 text-slate-100">
                    {(isAr ? IPHONE_HOME_SCREEN_STEPS_AR : IPHONE_HOME_SCREEN_STEPS_EN).map(
                      (step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4.5 h-4.5 rounded-full bg-[#3974C8] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      )
                    )}
                  </ol>

                  <p className="text-[11px] text-slate-300">
                    {isAr
                      ? 'ملاحظة: يظهر زر المشاركة في متصفح Safari أسفل الشاشة أو أعلاها حسب إصدار نظام iOS في هاتفك.'
                      : 'Note: The Share button in Safari appears in the bottom toolbar or top address bar depending on your iOS version.'}
                  </p>
                </div>
              )}

              {/* PART 9 — ANDROID OPTIONAL HOME SCREEN GUIDANCE (Non-blocking recommendation) */}
              {deviceCapabilities.showAndroidOptionalInstallGuidance && (
                <div
                  data-testid="android-pwa-guidance"
                  className="rounded-xl bg-[#F7F9FC] border border-[#CBD5E1] p-3.5 text-[12px] text-[#172334] leading-relaxed space-y-2.5"
                >
                  <div className="flex items-start gap-2">
                    <Smartphone className="w-4 h-4 text-[#3974C8] shrink-0 mt-0.5" />
                    <p className="font-medium text-[#102A43]">
                      {isAr ? ANDROID_HOME_SCREEN_MESSAGE_AR : ANDROID_HOME_SCREEN_MESSAGE_EN}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      if (deferredInstallPrompt && typeof deferredInstallPrompt.prompt === 'function') {
                        try {
                          await deferredInstallPrompt.prompt()
                          setDeferredInstallPrompt(null)
                          return
                        } catch {}
                      }
                      setShowAndroidInstallSteps((prev) => !prev)
                    }}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#EDF3F9] hover:bg-[#DCE7F5] text-[#102A43] text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <span>
                      {isAr ? ANDROID_HOME_SCREEN_BUTTON_AR : ANDROID_HOME_SCREEN_BUTTON_EN}
                    </span>
                  </button>

                  {showAndroidInstallSteps && (
                    <ol className="space-y-1.5 bg-white border border-[#E4EAF1] rounded-lg p-2.5 text-[11px] text-[#172334]">
                      {(isAr ? ANDROID_HOME_SCREEN_STEPS_AR : ANDROID_HOME_SCREEN_STEPS_EN).map(
                        (step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#102A43] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        )
                      )}
                    </ol>
                  )}
                </div>
              )}

              {/* PART 10 — Clear Error Handling with Standard Failure Headline + Specific Explanation + Retry */}
              {modalError && (
                <div className="rounded-xl bg-[#C44949]/10 border border-[#C44949]/35 p-3.5 text-xs text-[#C44949] space-y-2.5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="block font-bold">
                        {isAr
                          ? NOTIFICATION_ACTIVATION_FAILURE_AR
                          : NOTIFICATION_ACTIVATION_FAILURE_EN}
                      </strong>
                      <span className="block font-medium leading-relaxed text-[#9E2F2F]">
                        {modalError.message}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {!deviceCapabilities.isIOSRequiresHomeScreen && (
                      <button
                        type="button"
                        onClick={() => handleSaveAlertRule()}
                        disabled={isSavingAlert}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#C44949] text-white text-[11px] font-bold cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSaveWatchlistOnly}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-[#CBD5E1] text-[#172334] text-[11px] font-semibold cursor-pointer"
                    >
                      <span>
                        {isAr
                          ? 'متابعة في القائمة فقط بدون إشعار هاتف'
                          : 'Follow in Watchlist Only'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Verified Server Persistence Success Message */}
              {alertFeedbackMsg && (
                <div className="rounded-xl bg-[#16845B]/10 border border-[#16845B]/30 p-3 text-xs font-semibold text-[#16845B] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{alertFeedbackMsg}</span>
                </div>
              )}

              {/* Modal Actions: تفعيل التنبيه / تعديل التنبيه / إيقاف التنبيه */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E4EAF1]">
                {activeModalExistingRule && activeModalExistingRule.enabled ? (
                  <button
                    type="button"
                    onClick={() => handleToggleRuleEnabled(activeModalWire.id, true)}
                    disabled={isSavingAlert}
                    className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-[#C44949]/30 bg-[#C44949]/5 hover:bg-[#C44949]/15 text-xs font-bold text-[#C44949] cursor-pointer"
                  >
                    <PauseCircle className="w-4 h-4" />
                    <span>{isAr ? 'إيقاف التنبيه' : 'Disable Alert'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={closeAlertModal}
                    className="h-10 px-4 rounded-lg border border-[#E4EAF1] bg-white hover:bg-[#F7F9FC] text-xs font-semibold text-[#64748B] cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                )}

                <div className="flex items-center gap-2 mr-auto">
                  {activeModalExistingRule && activeModalExistingRule.enabled && (
                    <button
                      type="button"
                      onClick={closeAlertModal}
                      className="h-10 px-3.5 rounded-lg border border-[#E4EAF1] bg-white hover:bg-[#F7F9FC] text-xs font-semibold text-[#64748B] cursor-pointer"
                    >
                      {isAr ? 'إغلاق' : 'Close'}
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSavingAlert}
                    className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-[#102A43] hover:bg-[#173B5E] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#7CC4FA]" />
                    <span>
                      {isSavingAlert
                        ? isAr
                          ? 'جارٍ الحفظ والتحقق…'
                          : 'Saving & Verifying…'
                        : activeModalExistingRule && activeModalExistingRule.enabled
                        ? isAr
                          ? 'تعديل التنبيه'
                          : 'Update Alert'
                        : isAr
                        ? 'تفعيل التنبيه'
                        : 'Activate Alert'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2 — WIRE APPLICATIONS VISUAL MODAL ("الاستخدامات")                   */}
      {/* ========================================================================= */}
      {activeModalApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081D35]/75 backdrop-blur-xs no-print"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wire-app-modal-title"
        >
          <div className="bg-white border border-[#E4EAF1] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div
              className="relative aspect-[4/3] min-h-[240px] sm:min-h-[320px] bg-[#081D35] overflow-hidden"
              style={{ aspectRatio: '4 / 3' }}
            >
              <picture>
                <source
                  type="image/avif"
                  srcSet={activeModalApplication.avifSrcSet}
                  sizes="(max-width: 640px) 480px, 672px"
                />
                <source
                  type="image/webp"
                  srcSet={activeModalApplication.webpSrcSet}
                  sizes="(max-width: 640px) 480px, 672px"
                />
                <img
                  src={activeModalApplication.imageUrl}
                  srcSet={activeModalApplication.jpgSrcSet}
                  sizes="(max-width: 640px) 480px, 672px"
                  alt={
                    isAr
                      ? activeModalApplication.imageAlt
                      : activeModalApplication.imageAltEn
                  }
                  width={800}
                  height={600}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-[#081D35] via-[#081D35]/30 to-transparent" />

              <button
                type="button"
                onClick={() => setAppModalWireId(null)}
                className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-[#081D35]/80 text-white hover:bg-[#102A43] flex items-center justify-center transition-colors cursor-pointer"
                aria-label={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 right-5 left-5 flex items-end justify-between gap-3 text-white">
                <div>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#3974C8] text-white mb-1 tabular-nums">
                    {isAr
                      ? `مقاس ${activeModalApplication.size}`
                      : `Size ${activeModalApplication.sizeEn}`}
                  </span>
                  <h3 id="wire-app-modal-title" className="text-xl sm:text-2xl font-bold">
                    {isAr
                      ? activeModalApplication.headingAr
                      : activeModalApplication.headingEn}
                  </h3>
                </div>
                {activeModalAppWireRecord && (
                  <div className="bg-[#081D35]/90 border border-[#173B5E] rounded-lg px-3 py-1.5 text-left shrink-0">
                    <span className="block text-[10px] text-slate-300">
                      {isAr ? 'السعر الحالي' : 'Current Price'}
                    </span>
                    <span className="text-base font-bold text-white tabular-nums">
                      {activeModalAppWireRecord.price.toFixed(2)}{' '}
                      <span className="text-[11px] font-normal text-[#7CC4FA]">
                        {isAr ? 'د.ل' : 'LYD'}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <p className="text-sm text-[#172334] leading-relaxed">
                {isAr
                  ? activeModalApplication.summaryAr
                  : activeModalApplication.summaryEn}
              </p>

              <div>
                <h4 className="text-xs font-bold text-[#102A43] mb-2.5">
                  {isAr ? 'أمثلة الاستخدام الشائعة:' : 'Common Usage Examples:'}
                </h4>
                <ul className="space-y-2">
                  {(isAr
                    ? activeModalApplication.examplesAr
                    : activeModalApplication.examplesEn
                  ).map((ex, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F7F9FC] border border-[#E4EAF1] text-xs text-[#172334]"
                    >
                      <span className="w-5 h-5 rounded bg-[#102A43] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                        {i + 1}
                      </span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-[#EDF3F9] border border-[#CBD5E1] p-3.5 text-[12px] text-[#172334] leading-relaxed">
                <strong className="font-bold text-[#102A43] block mb-1">
                  {isAr ? 'ملاحظة فنية:' : 'Technical Note:'}
                </strong>
                {isAr
                  ? activeModalApplication.technicalNoteAr
                  : activeModalApplication.technicalNoteEn}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E4EAF1]">
                <button
                  type="button"
                  onClick={() => {
                    const id = activeModalApplication.id
                    setAppModalWireId(null)
                    openAlertModal(id)
                  }}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#102A43] hover:bg-[#173B5E] text-white text-xs font-semibold cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-[#7CC4FA]" />
                  <span>{isAr ? 'تابع سعر هذا السلك' : 'Track This Wire Price'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAppModalWireId(null)}
                  className="h-9 px-4 rounded-lg border border-[#E4EAF1] bg-white hover:bg-[#F7F9FC] text-xs font-semibold text-[#172334] cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE / PDF OFFICIAL PRICE SHEET TEMPLATE                             */}
      {/* ========================================================================= */}
      <div
        id="printable-price-sheet"
        className="hidden print:block p-8 bg-white text-black font-sans"
        dir="rtl"
      >
        <div className="border-b-2 border-[#102A43] pb-4 mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#102A43] mb-1">
              شركة الإنارة الحديثة — بنغازي
            </h1>
            <h2 className="text-base font-semibold text-[#3974C8]">
              قائمة أسعار أسلاك النحاس الإيطالية (لفة 100 متر)
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              مرجع الأسعار الرسمي للعملاء والتجار والمختصين
            </p>
          </div>
          <div className="text-left text-xs text-gray-700 space-y-1">
            <div>
              آخر تحديث للأسعار: <strong className="text-black">{lastUpdateDate}</strong>
            </div>
            <div>
              العملة: <strong>دينار ليبي (د.ل)</strong>
            </div>
            <div>
              المرجع: <strong>enarahmodern.com/wire-prices</strong>
            </div>
          </div>
        </div>

        <table className="w-full text-right border-collapse text-xs mb-6">
          <thead>
            <tr className="bg-[#102A43] text-white">
              <th className="py-2.5 px-3 border border-gray-300 font-bold">مقاس السلك</th>
              <th className="py-2.5 px-3 border border-gray-300 font-bold">المواصفات</th>
              <th className="py-2.5 px-3 border border-gray-300 font-bold text-center">
                السعر الحالي (د.ل)
              </th>
              <th className="py-2.5 px-3 border border-gray-300 font-bold text-center">
                حركة السعر
              </th>
            </tr>
          </thead>
          <tbody>
            {wireRecords.map((wire) => (
              <tr key={wire.id} className="border border-gray-300">
                <td className="py-2.5 px-3 border border-gray-300 font-bold text-sm">
                  {wire.size}
                </td>
                <td className="py-2.5 px-3 border border-gray-300">
                  {wire.packageType} · {wire.manufacturer}
                </td>
                <td className="py-2.5 px-3 border border-gray-300 font-bold text-sm text-center">
                  {wire.price.toFixed(2)} د.ل
                </td>
                <td className="py-2.5 px-3 border border-gray-300 text-center">
                  {wire.trend === 'up' && wire.changeAmount !== undefined
                    ? `ارتفاع +${wire.changeAmount.toFixed(2)}`
                    : wire.trend === 'down' && wire.changeAmount !== undefined
                    ? `انخفاض ${wire.changeAmount.toFixed(2)}`
                    : 'مستقر'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border border-gray-300 p-3 rounded text-[11px] text-gray-700 leading-relaxed mb-6">
          <strong>ملاحظة:</strong> تعبر الأسعار الموضحة في هذه القائمة عن أسعار البيع المعتمدة لدى شركة الإنارة الحديثة (لفة 100 متر)، وتخضع للتحديث وفق نشرات التوريد الرسمية للشركة.
        </div>

        <div className="border-t border-gray-300 pt-3 text-[10px] text-gray-500 flex items-center justify-between">
          <span>شركة الإنارة الحديثة للمواد الكهربائية والإنارة — بنغازي، ليبيا</span>
          <span>enarahmodern.com/wire-prices</span>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .no-print, header.no-print, nav, footer, #bottom-nav, .fixed {
            display: none !important;
          }
          #printable-price-sheet {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}
