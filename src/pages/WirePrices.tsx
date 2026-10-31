import React, { useState, useEffect, useMemo, useCallback } from 'react'
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
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import WireAnatomy3D from '../components/WireAnatomy3D'

export type TrendType = 'up' | 'down' | 'same' | 'unavailable'
export type AlertConditionType = 'down' | 'up' | 'any' | 'target'

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
  deliveryMode: 'push' | 'local'
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
  categoryAr: string
  categoryEn: string
  imageSlug: string
  summaryAr: string
  summaryEn: string
  commonExamplesAr: string[]
  commonExamplesEn: string[]
  engineeringNotesAr: string
  engineeringNotesEn: string
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

// ⚠️ بيانات الأسعار الأساسية المعتمدة رسمياً (تاريخ النشر المعتمد: 10 أكتوبر 2026)
const DEFAULT_PUBLISHED_DATE = '10 أكتوبر 2026'

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
    price: 89.0,
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
    price: 142.0,
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
    price: 219.0,
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
    price: 329.0,
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
    price: 580.0,
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
    price: 915.0,
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
    price: 1410.0,
    trend: 'same'
  }
]

const WIRE_APPLICATIONS: WireApplicationItem[] = [
  {
    id: '1.5',
    size: '1.5 مم²',
    sizeEn: '1.5 mm²',
    categoryAr: 'دوائر الإنارة والتحكم الخفيف',
    categoryEn: 'Lighting & Low-Load Control Circuits',
    imageSlug: 'app-1-5mm',
    summaryAr:
      'يُستخدم غالباً في تمديدات دوائر الإضاءة الداخلية، والمفاتيح الجدارية، ونقاط الإنارة المعمارية ذات الأحمال الخفيفة.',
    summaryEn:
      'Commonly used in indoor lighting circuits, wall switches, and architectural lighting points with light current loads.',
    commonExamplesAr: [
      'دوائر الإضاءة السقفية والسبوت لايت (LED) في الغرف والممرات',
      'توصيلات المفاتيح الجدارية وخطوط الراجع للإنارة',
      'أنظمة الإضاءة المخفية والإنارة التجميلية منخفضة الاستهلاك',
      'دوائر أجراس الأبواب ولوحات التحكم والإشارة الخفيفة'
    ],
    commonExamplesEn: [
      'Ceiling LED lighting and spotlight circuits in rooms and corridors',
      'Wall switch feeds and lighting return lines',
      'Cove lighting and low-wattage decorative fixtures',
      'Doorbell circuits and low-power control signaling'
    ],
    engineeringNotesAr:
      'يُربط عادةً بقواطع حماية فرعية تتناسب مع تيار دائرة الإنارة وطول المسار داخل المواسير.',
    engineeringNotesEn:
      'Typically paired with branch miniature circuit breakers sized for lighting load and conduit run length.'
  },
  {
    id: '2.5',
    size: '2.5 مم²',
    sizeEn: '2.5 mm²',
    categoryAr: 'المآخذ الكهربائية والأجهزة العامة',
    categoryEn: 'General Power Outlets & Everyday Appliances',
    imageSlug: 'app-2-5mm',
    summaryAr:
      'شائع الاستخدام في تغذية البريزات والمآخذ الكهربائية الجدارية العامة في المباني السكنية والمكاتب التجارية.',
    summaryEn:
      'Widely used for feeding general wall sockets and power outlets across residential and commercial office spaces.',
    commonExamplesAr: [
      'دوائر البريزات والأفياش الجدارية في غرف المعيشة والنوم والمكاتب',
      'تشغيل الأجهزة المنزلية والمكتبية المعتادة (الشاشات، الحواسيب، الثلاجات المنزلية)',
      'نقاط التغذية الكهربائية العامة ذات الأحمال المتوسطة الموزعة',
      'خطوط التغذية الفرعية القصيرة للأجهزة الخدمية الخفيفة'
    ],
    commonExamplesEn: [
      'Wall socket circuits in living rooms, bedrooms, and offices',
      'Standard household and office electronics (TVs, PCs, refrigerators)',
      'General-purpose distributed power receptacles',
      'Short branch feeds for light utility equipment'
    ],
    engineeringNotesAr:
      'يُنصح بمراعاة عدد المآخذ المشتركة على نفس الخط وطول المسار لتفادي زيادة الحمل أو هبوط الجهد.',
    engineeringNotesEn:
      'Consider the number of outlets sharing the circuit and total run length to avoid overload or voltage drop.'
  },
  {
    id: '4.0',
    size: '4.0 مم²',
    sizeEn: '4.0 mm²',
    categoryAr: 'الأحمال المستقلة والتكييف والسخانات',
    categoryEn: 'Dedicated Appliance Circuits, A/C & Heaters',
    imageSlug: 'app-4-0mm',
    summaryAr:
      'يُستخدم غالباً في الخطوط المستقلة المخصصة للأجهزة ذات الاستهلاك المرتفع نسبياً مثل وحدات التكييف وسخانات المياه.',
    summaryEn:
      'Frequently selected for dedicated single-appliance circuits such as split air conditioners and water heaters.',
    commonExamplesAr: [
      'خطوط تغذية مكيفات الهواء الجدارية (Split Units) ذات القدرات المتوسطة',
      'دوائر سخانات المياه الكهربائية المستقلة في الحمامات والمطابخ',
      'تغذية بعض أجهزة المطبخ الحرارية المستقلة (الأفران الصغيرة أو الغسالات الحرارية)',
      'خطوط القوى الفرعية التي تتطلب قدرة تحمل أعلى من مقاس 2.5 مم²'
    ],
    commonExamplesEn: [
      'Dedicated circuits for medium-capacity split air conditioning units',
      'Independent electric water heater lines in bathrooms and kitchens',
      'Dedicated kitchen thermal appliances (compact ovens, washer-dryers)',
      'Heavy-duty power circuits requiring higher ampacity than 2.5 mm²'
    ],
    engineeringNotesAr:
      'يُفضل تخصيص خط مباشر مستقل من اللوحة الفرعية لكل جهاز رئيسي مع قاطع حماية مناسب.',
    engineeringNotesEn:
      'Best installed as an independent home-run circuit from the sub-panel with a properly rated breaker.'
  },
  {
    id: '6.0',
    size: '6.0 مم²',
    sizeEn: '6.0 mm²',
    categoryAr: 'الأحمال العالية والمطابخ والتغذية الفرعية',
    categoryEn: 'High-Load Appliances & Sub-Feeder Circuits',
    imageSlug: 'app-6-0mm',
    summaryAr:
      'شائع الاستخدام في تغذية الأحمال الحرارية والميكانيكية العالية، ووحدات التكييف الكبيرة، وخطوط الربط الفرعية.',
    summaryEn:
      'Commonly used for high-demand thermal and mechanical loads, large A/C units, and light sub-panel feeders.',
    commonExamplesAr: [
      'وحدات التكييف ذات القدرات الكبيرة أو المكيفات الدولابية والمركزية الصغيرة',
      'المواقد والأفران الكهربائية الكبيرة في المطابخ الحديثة',
      'المضخات الكهربائية والسخانات المركزية ذات الاستهلاك المرتفع',
      'تغذية اللوحات الفرعية الصغيرة للملاحق أو الأدوار ذات الأحمال المحدودة'
    ],
    commonExamplesEn: [
      'High-capacity split or floor-standing air conditioning systems',
      'Electric ranges, cooktops, and large built-in kitchen ovens',
      'Water pumps and high-capacity central water heaters',
      'Sub-panel feeders for annexes or light-load secondary zones'
    ],
    engineeringNotesAr:
      'تزداد أهمية فحص هبوط الجهد ودرجة حرارة التمديد عند تشغيل أحمال مستمرة لفترات طويلة.',
    engineeringNotesEn:
      'Voltage drop and ambient derating calculations are critical when serving continuous heavy loads.'
  },
  {
    id: '10.0',
    size: '10.0 مم²',
    sizeEn: '10.0 mm²',
    categoryAr: 'خطوط التغذية الرئيسية واللوحات الفرعية',
    categoryEn: 'Main Sub-Panel Feeders & Distribution Risers',
    imageSlug: 'app-10-0mm',
    summaryAr:
      'يُستخدم غالباً في خطوط التغذية الرئيسية للوحدات السكنية، والربط بين اللوحات الرئيسية ولوحات التوزيع الفرعية.',
    summaryEn:
      'Commonly deployed for residential main feeders and interconnections between main and sub-distribution boards.',
    commonExamplesAr: [
      'خطوط التغذية بين لوحة العداد أو اللوحة الرئيسية ولوحات التوزيع داخل الشقق',
      'تغذية لوحات الأدوار المستقلة في الفلل والمباني السكنية',
      'تشغيل منظومات التكييف المركزي أو المضخات الثلاثية الطور المتوسطة',
      'مسارات التغذية الطويلة التي تتطلب تقليل الفقد الكهربائي وهبوط الجهد'
    ],
    commonExamplesEn: [
      'Feeder lines between meter cabinets/main boards and apartment sub-panels',
      'Floor distribution boards in villas and multi-story residences',
      'Central HVAC condensers and medium three-phase pump systems',
      'Extended feeder runs sized to minimize voltage drop'
    ],
    engineeringNotesAr:
      'يتطلب حساب مجموع الأحمال المتوقعة ومعامل التزامن واختيار أطراف توصيل (كوسات) مكبوسة بإحكام.',
    engineeringNotesEn:
      'Requires demand-factor load calculation and properly crimped cable lugs at panel terminations.'
  },
  {
    id: '16.0',
    size: '16.0 مم²',
    sizeEn: '16.0 mm²',
    categoryAr: 'التغذية الرئيسية للمباني والأحمال التجارية',
    categoryEn: 'Building Main Feeders & Commercial Distribution',
    imageSlug: 'app-16-0mm',
    summaryAr:
      'مخصص غالباً لخطوط التغذية الرئيسية عالية القدرة في الفلل الكبيرة، المحلات التجارية، ولوحات التوزيع الرئيسية.',
    summaryEn:
      'Designed for high-capacity main feeders in large villas, commercial showrooms, and primary distribution panels.',
    commonExamplesAr: [
      'الكوابل والأسلاك الرئيسية المغذية للوحات التوزيع العمومية في الفلل والمقار التجارية',
      'خطوط الربط مع المولدات الاحتياطية ومفاتيح التحويل (ATS) المتوسطة',
      'تغذية الورش الفنية والمعدات التجارية ثلاثية الطور',
      'المسارات الرئيسية داخل حوامل الكابلات (Cable Trays) والمواسير الهندسية'
    ],
    commonExamplesEn: [
      'Main incoming feeders for primary distribution boards in villas and commercial spaces',
      'Standby generator interconnections and medium ATS transfer panels',
      'Technical workshops and three-phase commercial machinery',
      'Primary trunk runs inside cable trays and heavy-duty conduits'
    ],
    engineeringNotesAr:
      'يجب تصميم الدائرة وفق حسابات التيار الأقصى وتنسيق القواطع الحرارية المغناطيسية (MCCB / MCB).',
    engineeringNotesEn:
      'Must be engineered according to peak load current and coordinated with MCCB/MCB protection.'
  },
  {
    id: '25.0',
    size: '25.0 مم²',
    sizeEn: '25.0 mm²',
    categoryAr: 'المشاريع الكبرى ولوحات القوى الرئيسية',
    categoryEn: 'Heavy Industrial & Primary Project Feeders',
    imageSlug: 'app-25-0mm',
    summaryAr:
      'يُستخدم في خطوط القوى الرئيسية للمشاريع الكبيرة، واللوحات العمومية، وتغذية المنشآت التجارية والصناعية.',
    summaryEn:
      'Used in heavy-duty primary power feeders, main switchboards, and commercial or industrial facility distribution.',
    commonExamplesAr: [
      'خطوط التغذية العمومية بين القواطع الرئيسية ولوحات التوزيع المركزية للمباني',
      'الربط الكهربائي للمولدات ذات القدرات العالية ومحطات التوزيع الفرعية',
      'تغذية الأحمال الصناعية والمضخات الكبرى ومنظومات التبريد المركزي الشامل',
      'المشاريع الإنشائية التي تتطلب موصلية نحاسية عالية ومقاومة منخفضة عبر المسافات'
    ],
    commonExamplesEn: [
      'Main bus/feeder links between primary circuit breakers and central building switchboards',
      'High-capacity generator hookups and secondary substation distribution',
      'Industrial loads, large pumping stations, and chiller plants',
      'Major construction projects demanding high copper conductivity over long runs'
    ],
    engineeringNotesAr:
      'يخضع تركيبه لإشراف هندسي مباشر مع الالتزام بقيم عزم الربط القياسية ومسافات التبريد داخل اللوحات.',
    engineeringNotesEn:
      'Requires direct electrical engineering supervision, calibrated terminal torque, and thermal clearance.'
  }
]

const API_BASE =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? ''
    : ''

function getOrCreateSubscriberToken(): string {
  if (typeof window === 'undefined') return 'server-placeholder-token'
  const storageKey = 'enarah_wire_subscriber_token_v1'
  let token = localStorage.getItem(storageKey)
  if (!token || token.length < 16) {
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

  // Personal Wire Alert Rules (Persisted locally + synced with Web Push backend)
  const [alertRules, setAlertRules] = useState<Record<string, WireAlertRule>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('enarah_wire_alert_rules_v1')
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
  const [modalError, setModalError] = useState<string | null>(null)
  const [isSavingAlert, setIsSavingAlert] = useState(false)
  const [alertFeedbackMsg, setAlertFeedbackMsg] = useState<string | null>(null)
  const [isTestingPush, setIsTestingPush] = useState(false)

  // Visual Applications Guide State (Section C + Modal)
  const [selectedAppSizeId, setSelectedAppSizeId] = useState<string>('1.5')
  const [appModalWireId, setAppModalWireId] = useState<string | null>(null)

  // Sharing Feedback State
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Device & Notification Capability Detection
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  )

  const isIOSRequiresHomeScreen = useMemo(() => {
    if (typeof window === 'undefined') return false
    const ua = window.navigator.userAgent || ''
    const isIOS = /iPad|iPhone|iPod/.test(ua)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    return isIOS && !isStandalone
  }, [])

  // Persist alertRules to localStorage helper
  const saveAlertRulesToStorage = useCallback((nextRules: Record<string, WireAlertRule>) => {
    setAlertRules(nextRules)
    if (typeof window !== 'undefined') {
      localStorage.setItem('enarah_wire_alert_rules_v1', JSON.stringify(nextRules))
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

  // 2. Sync Remote Alert Subscriptions on Mount (if user has subscriberToken)
  useEffect(() => {
    let isMounted = true
    const syncRemoteSubscriptions = async () => {
      if (typeof window === 'undefined') return
      const subscriberToken = getOrCreateSubscriberToken()
      try {
        const res = await fetch(
          `${API_BASE}/api/wire-alerts?action=my-subscriptions&subscriberToken=${encodeURIComponent(
            subscriberToken
          )}`
        )
        if (!res.ok) return
        const data = await res.json()
        if (isMounted && data.success && Array.isArray(data.subscriptions) && data.subscriptions.length > 0) {
          setAlertRules((prev) => {
            const merged = { ...prev }
            for (const sub of data.subscriptions) {
              if (!sub.wireSize) continue
              const existing = merged[sub.wireSize]
              merged[sub.wireSize] = {
                wireSize: sub.wireSize,
                condition: sub.condition || 'any',
                targetPrice: sub.targetPrice ?? null,
                enabled: sub.enabled !== false,
                deliveryMode: sub.hasPushSubscription ? 'push' : existing?.deliveryMode || 'local',
                createdAt: existing?.createdAt || new Date().toISOString(),
                updatedAt: sub.updatedAt || new Date().toISOString(),
                lastKnownPrice: existing?.lastKnownPrice ?? 0,
                lastTriggeredPrice: sub.lastTriggeredPrice ?? existing?.lastTriggeredPrice ?? null,
                lastTriggeredAt: sub.lastTriggeredAt ?? existing?.lastTriggeredAt ?? null
              }
            }
            localStorage.setItem('enarah_wire_alert_rules_v1', JSON.stringify(merged))
            return merged
          })
        }
      } catch {
        // Offline or local dev without serverless function running — local rules remain intact
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
      const endpoints = ['/api/get-users', 'https://enarah2.vercel.app/api/get-users']
      let data: any = null

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint)
          if (res.ok) {
            const parsed = await res.json()
            if (parsed && parsed.success && Array.isArray(parsed.data)) {
              data = parsed
              break
            }
          }
        } catch {
          // try next endpoint
        }
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
          const savedRulesRaw = localStorage.getItem('enarah_wire_alert_rules_v1')
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
                localStorage.setItem('enarah_wire_alert_rules_v1', JSON.stringify(currentRules))
                setAlertRules({ ...currentRules })
              }

              if (newlyTriggered.length > 0) {
                setTriggeredAlerts((prev) => [...newlyTriggered, ...prev])
                // Also trigger Service Worker notification if permission is granted
                if (
                  'serviceWorker' in navigator &&
                  'Notification' in window &&
                  Notification.permission === 'granted'
                ) {
                  navigator.serviceWorker.ready
                    .then((reg) => {
                      for (const trig of newlyTriggered) {
                        const diff = trig.newPrice - trig.oldPrice
                        const dirWord = diff < 0 ? 'انخفض' : 'ارتفع'
                        const title = `تنبيه سعر سلك ${trig.sizeLabel} — الإنارة الحديثة`
                        const body = `${dirWord} سعر سلك ${trig.sizeLabel} من ${trig.oldPrice.toFixed(
                          2
                        )} د.ل إلى ${trig.newPrice.toFixed(2)} د.ل.`
                        if (reg.active) {
                          reg.active.postMessage({
                            type: 'SHOW_WIRE_ALERT_NOTIFICATION',
                            title,
                            body,
                            tag: `enarah-wire-alert-${trig.wireSize}`,
                            url: '/wire-prices'
                          })
                        }
                      }
                    })
                    .catch(() => {})
                }
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
          : String(Math.max(1, Math.round(wire.price - 5)))
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

  // Subscribe to Web Push (Requested ONLY on explicit user action)
  const requestAndSubscribePush = useCallback(async (): Promise<{
    subscription: PushSubscriptionJSON | null
    mode: 'push' | 'local'
  }> => {
    if (
      typeof window === 'undefined' ||
      !('Notification' in window) ||
      !('serviceWorker' in navigator)
    ) {
      return { subscription: null, mode: 'local' }
    }

    let permission = Notification.permission
    if (permission === 'default') {
      try {
        permission = await Notification.requestPermission()
        setNotificationPermission(permission)
      } catch {
        return { subscription: null, mode: 'local' }
      }
    } else {
      setNotificationPermission(permission)
    }

    if (permission !== 'granted') {
      return { subscription: null, mode: 'local' }
    }

    try {
      const registration = await navigator.serviceWorker.ready
      if (!registration.pushManager) {
        return { subscription: null, mode: 'local' }
      }

      // Check existing push subscription first
      let sub = await registration.pushManager.getSubscription()
      if (!sub) {
        // Fetch VAPID public key from backend
        const vapidRes = await fetch(`${API_BASE}/api/wire-alerts?action=vapid-public-key`)
        if (vapidRes.ok) {
          const vapidData = await vapidRes.json()
          if (vapidData.success && vapidData.publicKey) {
            const convertedKey = urlBase64ToUint8Array(vapidData.publicKey)
            sub = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedKey as BufferSource
            })
          }
        }
      }

      if (sub) {
        return { subscription: sub.toJSON(), mode: 'push' }
      }
    } catch (err) {
      console.warn('Web Push subscription notice (falling back to local + SW alerts):', err)
    }

    return { subscription: null, mode: 'local' }
  }, [])

  // Handle "تفعيل التنبيه" submission
  const handleSaveAlertRule = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!alertModalWireId) return

      const selectedWire =
        wireRecords.find((w) => w.id === alertModalWireId) || DEFAULT_WIRES[0]

      let parsedTarget: number | null = null
      if (modalCondition === 'target') {
        parsedTarget = parseFloat(modalTargetPrice)
        if (!Number.isFinite(parsedTarget) || parsedTarget <= 0 || parsedTarget > 100000) {
          setModalError(
            isAr
              ? 'يرجى إدخال سعر مستهدف صحيح أكبر من صفر (بالدينار الليبي).'
              : 'Please enter a valid target price greater than zero (LYD).'
          )
          return
        }
      }

      setModalError(null)
      setIsSavingAlert(true)

      try {
        // 1. Request permission & register Web Push subscription on explicit user click
        const { subscription, mode } = await requestAndSubscribePush()
        const subscriberToken = getOrCreateSubscriberToken()
        const nowIso = new Date().toISOString()

        let finalDeliveryMode: 'push' | 'local' = mode

        // 2. Sync rule with backend API
        try {
          const apiRes = await fetch(`${API_BASE}/api/wire-alerts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'upsert',
              subscriberToken,
              wireSize: alertModalWireId,
              condition: modalCondition,
              targetPrice: parsedTarget,
              enabled: true,
              pushSubscription: subscription
            })
          })
          if (apiRes.ok) {
            const apiJson = await apiRes.json()
            if (apiJson.success && apiJson.subscription?.deliveryMode === 'push') {
              finalDeliveryMode = 'push'
            }
          }
        } catch {
          // Offline / local fallback
        }

        // 3. Save rule locally and ensure wire is in watchlist
        const newRule: WireAlertRule = {
          wireSize: alertModalWireId,
          condition: modalCondition,
          targetPrice: parsedTarget,
          enabled: true,
          deliveryMode: finalDeliveryMode,
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
          finalDeliveryMode === 'push'
            ? isAr
              ? 'تم تفعيل التنبيه وربطه بإشعارات جهازك بنجاح.'
              : 'Price alert activated and linked to your device notifications.'
            : isAr
            ? 'تم حفظ التنبيه في قائمة المتابعة على هذا الجهاز بنجاح.'
            : 'Price alert saved to your personal watchlist on this device.'
        )

        setTimeout(() => {
          closeAlertModal()
        }, 1100)
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
      requestAndSubscribePush,
      alertRules,
      saveAlertRulesToStorage,
      ensureInWatchlist,
      closeAlertModal
    ]
  )

  // Pause or Resume an existing alert rule
  const handleToggleRuleEnabled = useCallback(
    async (wireSize: string) => {
      const existing = alertRules[wireSize]
      if (!existing) return
      const nextEnabled = !existing.enabled
      const updatedRule: WireAlertRule = {
        ...existing,
        enabled: nextEnabled,
        updatedAt: new Date().toISOString()
      }
      const nextRules = { ...alertRules, [wireSize]: updatedRule }
      saveAlertRulesToStorage(nextRules)

      try {
        const subscriberToken = getOrCreateSubscriberToken()
        await fetch(`${API_BASE}/api/wire-alerts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upsert',
            subscriberToken,
            wireSize,
            condition: updatedRule.condition,
            targetPrice: updatedRule.targetPrice,
            enabled: nextEnabled
          })
        })
      } catch {}
    },
    [alertRules, saveAlertRulesToStorage]
  )

  // Delete an alert rule (and optionally unfollow)
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
        await fetch(`${API_BASE}/api/wire-alerts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'delete',
            subscriberToken,
            wireSize
          })
        })
      } catch {}
    },
    [alertRules, saveAlertRulesToStorage]
  )

  // Send a verification / test notification to confirm device delivery
  const handleSendVerificationNotification = useCallback(
    async (wireSize?: string) => {
      setIsTestingPush(true)
      const targetWire =
        wireRecords.find((w) => w.id === (wireSize || '2.5')) || wireRecords[0]

      try {
        const { subscription } = await requestAndSubscribePush()
        let deliveredViaPush = false

        if (subscription) {
          try {
            const subscriberToken = getOrCreateSubscriberToken()
            const res = await fetch(`${API_BASE}/api/wire-alerts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'test-push',
                subscriberToken,
                wireSize: targetWire.id,
                currentPrice: targetWire.price,
                pushSubscription: subscription
              })
            })
            if (res.ok) {
              const data = await res.json()
              if (data.success) deliveredViaPush = true
            }
          } catch {}
        }

        if (
          !deliveredViaPush &&
          'serviceWorker' in navigator &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          const reg = await navigator.serviceWorker.ready
          const title = `إشعار تجريبي لسلك ${targetWire.size} — الإنارة الحديثة`
          const body = `السعر الحالي لسلك ${targetWire.size} هو ${targetWire.price.toFixed(
            2
          )} د.ل. تنبيهات الأسعار جاهزة للعمل على جهازك.`
          if (reg.active) {
            reg.active.postMessage({
              type: 'SHOW_WIRE_ALERT_NOTIFICATION',
              title,
              body,
              tag: `enarah-wire-test-${targetWire.id}`,
              url: '/wire-prices'
            })
            deliveredViaPush = true
          }
        }

        if (!deliveredViaPush) {
          // Show in-app verification alert banner if browser notifications are blocked
          setTriggeredAlerts((prev) => [
            {
              id: `test-${Date.now()}`,
              wireSize: targetWire.id,
              sizeLabel: targetWire.size,
              oldPrice: targetWire.price,
              newPrice: targetWire.price,
              condition: 'any',
              targetPrice: null,
              triggeredAt: new Date().toISOString()
            },
            ...prev
          ])
        }
      } finally {
        setIsTestingPush(false)
      }
    },
    [wireRecords, requestAndSubscribePush]
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

  // Share Functionality (Native share or clipboard fallback)
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

  // Selected application item for Section C & Application Modal
  const activeSectionApplication = useMemo(() => {
    return (
      WIRE_APPLICATIONS.find((item) => item.id === selectedAppSizeId) || WIRE_APPLICATIONS[0]
    )
  }, [selectedAppSizeId])

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

              {/* Action Buttons: One Primary Blue + One Restrained Outlined */}
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
          {/* Triggered Alert Notification Banner (if any price alert condition was met) */}
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
                          {item.oldPrice === item.newPrice ? (
                            <span>
                              {isAr
                                ? `إشعار تجريبي ناجح — السعر الحالي ${item.newPrice.toFixed(2)} د.ل`
                                : `Verification alert — Current price ${item.newPrice.toFixed(2)} LYD`}
                            </span>
                          ) : (
                            <span>
                              {isAr
                                ? `تغير السعر من ${item.oldPrice.toFixed(2)} د.ل إلى ${item.newPrice.toFixed(2)} د.ل`
                                : `Price changed from ${item.oldPrice.toFixed(2)} LYD to ${item.newPrice.toFixed(2)} LYD`}
                            </span>
                          )}
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

            {/* Mobile Purpose-Built Compact Price Rows (Wire Size → Price → Movement + Compact Actions) */}
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
                          {/* Right: Star + Wire Size + Accessible Spec */}
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

                          {/* Left: Price + Movement */}
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

                        {/* Secondary Compact Mobile Action Row: Track Price Bell + Applications */}
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
      {/* SECTION E — PERSONAL WIRE WATCHLIST & SMART PRICE ALERTS                  */}
      {/* ========================================================================= */}
      <section
        aria-labelledby="personal-watchlist-heading"
        className="py-6 sm:py-8 no-print"
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="bg-white border border-[#E4EAF1] rounded-xl p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E4EAF1]">
              <div>
                <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#3974C8] mb-1.5">
                  <BellRing className="w-3.5 h-3.5" />
                  <span>
                    {isAr
                      ? 'متابعة ذكية وتنبيهات فورية على الهاتف'
                      : 'Smart Watchlist & Mobile Price Alerts'}
                  </span>
                </div>
                <h2
                  id="personal-watchlist-heading"
                  className="text-lg sm:text-[22px] font-bold text-[#102A43]"
                >
                  {isAr
                    ? 'قائمة المتابعة والتنبيهات الشخصية'
                    : 'Personal Wire Watchlist & Alerts'}
                </h2>
                <p className="text-[13px] text-[#64748B] mt-1">
                  {isAr
                    ? 'حدد المقاسات التي تهمك واضبط شروط التنبيه لتصلك إشعارات فورية عند تغير السعر أو وصوله إلى السعر المستهدف.'
                    : 'Follow key wire sizes and configure alert conditions to receive notifications when prices change or reach your target.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSendVerificationNotification()}
                  disabled={isTestingPush}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[#E4EAF1] bg-[#F7F9FC] hover:bg-[#EDF3F9] text-[12px] font-medium text-[#172334] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#3974C8]" />
                  <span>
                    {isTestingPush
                      ? isAr
                        ? 'جارٍ الإرسال…'
                        : 'Sending…'
                      : isAr
                      ? 'تجربة إشعار على هذا الجهاز'
                      : 'Test Device Notification'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => openAlertModal('2.5')}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#102A43] hover:bg-[#173B5E] text-white text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-[#7CC4FA]" />
                  <span>{isAr ? '+ إضافة تنبيه سعر' : '+ Add Price Alert'}</span>
                </button>
              </div>
            </div>

            {/* Watchlist Cards Grid */}
            {watchlistWires.length === 0 ? (
              <div className="py-10 text-center">
                <BellOff className="w-8 h-8 text-[#94A3B8] mx-auto mb-2.5" />
                <p className="text-sm font-medium text-[#172334]">
                  {isAr
                    ? 'قائمة المتابعة الشخصية فارغة حالياً.'
                    : 'Your personal wire watchlist is currently empty.'}
                </p>
                <p className="text-xs text-[#64748B] mt-1 mb-4">
                  {isAr
                    ? 'اضغط على زر "تابع السعر" بجانب أي مقاس في الجدول لإضافته وضبط شروط الإشعار.'
                    : 'Click "Track Price" next to any wire size in the table to add it and set alert conditions.'}
                </p>
                <button
                  type="button"
                  onClick={() => openAlertModal('1.5')}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#3974C8] text-white text-xs font-semibold cursor-pointer"
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
                      className={`rounded-xl border p-4 transition-colors ${
                        isRuleEnabled
                          ? 'bg-[#F7F9FC] border-[#C9D8EA]'
                          : 'bg-white border-[#E4EAF1]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[17px] font-bold text-[#102A43] tabular-nums">
                              {isAr ? wire.size : wire.sizeEn}
                            </span>
                            {wire.trend === 'down' && wire.changeAmount !== undefined ? (
                              <span className="text-[11px] font-medium text-[#16845B] bg-[#16845B]/10 px-2 py-0.5 rounded">
                                {isAr ? 'انخفاض' : 'Down'} {wire.changeAmount.toFixed(2)}
                              </span>
                            ) : wire.trend === 'up' && wire.changeAmount !== undefined ? (
                              <span className="text-[11px] font-medium text-[#C44949] bg-[#C44949]/10 px-2 py-0.5 rounded">
                                {isAr ? 'ارتفاع' : 'Up'} +{wire.changeAmount.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-[#718096] bg-[#EDF3F9] px-2 py-0.5 rounded">
                                {isAr ? 'مستقر' : 'Stable'}
                              </span>
                            )}
                          </div>
                          <span className="text-[12px] text-[#64748B]">
                            {isAr ? wire.packageType : wire.packageTypeEn}
                          </span>
                        </div>

                        <div className="text-left">
                          <div className="text-[19px] font-bold text-[#172334] tabular-nums">
                            {wire.price.toFixed(2)}{' '}
                            <span className="text-[12px] font-normal text-[#64748B]">
                              {isAr ? 'د.ل' : 'LYD'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Alert Condition & Status Badge */}
                      <div className="rounded-lg bg-white border border-[#E4EAF1] p-2.5 mb-3 text-[12px]">
                        {hasRule ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[#64748B]">
                                {isAr ? 'شرط التنبيه:' : 'Condition:'}
                              </span>
                              <strong className="font-semibold text-[#102A43]">
                                {formatConditionLabel(rule.condition, rule.targetPrice)}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[#64748B]">
                                {isAr ? 'حالة الإشعار:' : 'Status:'}
                              </span>
                              {!rule.enabled ? (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                  <PauseCircle className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'متوقف مؤقتاً' : 'Paused'}</span>
                                </span>
                              ) : rule.deliveryMode === 'push' ? (
                                <span className="inline-flex items-center gap-1 text-[#16845B] font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>
                                    {isAr
                                      ? 'إشعارات الهاتف مفعلة (Push)'
                                      : 'Mobile Push Active'}
                                  </span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[#3974C8] font-medium">
                                  <Bell className="w-3.5 h-3.5" />
                                  <span>
                                    {isAr
                                      ? 'تنبيه محفوظ محلياً على الجهاز'
                                      : 'Saved Locally on Device'}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-[#64748B]">
                            <span>
                              {isAr
                                ? 'مضاف للمتابعة السريعة بدون تنبيه مشروط'
                                : 'Pinned to watchlist without alert rule'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Watchlist Item Controls */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openAlertModal(wire.id)}
                            className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-[#EDF3F9] hover:bg-[#3974C8] text-[#102A43] hover:text-white text-[12px] font-medium transition-colors cursor-pointer"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>
                              {hasRule
                                ? isAr
                                  ? 'تعديل الشرط'
                                  : 'Edit Rule'
                                : isAr
                                ? 'تفعيل تنبيه'
                                : 'Set Alert'}
                            </span>
                          </button>

                          {hasRule && (
                            <button
                              type="button"
                              onClick={() => handleToggleRuleEnabled(wire.id)}
                              className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-[#E4EAF1] bg-white hover:bg-[#F7F9FC] text-[#64748B] hover:text-[#172334] text-[12px] font-medium transition-colors cursor-pointer"
                              title={
                                rule.enabled
                                  ? isAr
                                    ? 'إيقاف التنبيه مؤقتاً'
                                    : 'Pause alert'
                                  : isAr
                                  ? 'إعادة تفعيل التنبيه'
                                  : 'Resume alert'
                              }
                            >
                              {rule.enabled ? (
                                <>
                                  <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>{isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-3.5 h-3.5 text-[#16845B]" />
                                  <span>{isAr ? 'تفعيل' : 'Resume'}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteAlertRule(wire.id, true)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#C44949] hover:bg-[#C44949]/10 transition-colors cursor-pointer"
                          title={
                            isAr ? 'إزالة من قائمة المتابعة' : 'Remove from watchlist'
                          }
                          aria-label={
                            isAr ? 'إزالة من قائمة المتابعة' : 'Remove from watchlist'
                          }
                        >
                          <Trash2 className="w-4 h-4" />
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
      {/* SECTION C — VISUAL WIRE APPLICATIONS GUIDE                                */}
      {/* ========================================================================= */}
      <section
        id="wire-applications-guide"
        aria-labelledby="visual-applications-heading"
        className="py-10 sm:py-14 no-print"
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#3974C8] mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isAr
                    ? 'الدليل البصري التوضيحي للاستخدامات'
                    : 'Visual Wire Applications Reference'}
                </span>
              </div>
              <h2
                id="visual-applications-heading"
                className="text-xl sm:text-[28px] font-bold text-[#172334] leading-snug"
              >
                {isAr
                  ? 'الاستخدامات الشائعة لمقاسات الأسلاك النحاسية'
                  : 'Common Applications by Copper Wire Size'}
              </h2>
            </div>
            <p className="text-sm text-[#64748B] max-w-md leading-relaxed">
              {isAr
                ? 'استعرض أمثلة بصرية واقعية للتطبيقات الكهربائية الشائعة لكل مقاس سلك لمساعدة المختصين والعملاء على الفهم السريع.'
                : 'Explore realistic visual examples of common electrical applications for each wire size.'}
            </p>
          </div>

          {/* Interactive Size Selector Tabs for Visual Guide */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
            {WIRE_APPLICATIONS.map((appItem) => {
              const isSelected = selectedAppSizeId === appItem.id
              return (
                <button
                  key={appItem.id}
                  type="button"
                  onClick={() => setSelectedAppSizeId(appItem.id)}
                  className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 shrink-0 cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#102A43] text-white shadow-xs'
                      : 'bg-white text-[#172334] hover:bg-[#EDF3F9] border border-[#E4EAF1]'
                  }`}
                >
                  <span className="tabular-nums">
                    {isAr ? appItem.size : appItem.sizeEn}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-[#3974C8] text-white'
                        : 'bg-[#F7F9FC] text-[#64748B]'
                    }`}
                  >
                    {isAr ? appItem.categoryAr.split(' ')[0] : appItem.categoryEn.split(' ')[0]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Main Featured Visual Application Card (Selected Wire Size) */}
          <div className="bg-white border border-[#E4EAF1] rounded-2xl overflow-hidden shadow-2xs mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Optimized Responsive Picture (AVIF + WebP + JPG Fallback, 4:3 Ratio) */}
              <div className="lg:col-span-5 bg-[#081D35] relative overflow-hidden aspect-4/3 lg:aspect-auto lg:min-h-[340px]">
                <picture>
                  <source
                    type="image/avif"
                    srcSet={`/images/wire-apps/${activeSectionApplication.imageSlug}-400.avif 400w, /images/wire-apps/${activeSectionApplication.imageSlug}-800.avif 800w`}
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                  <source
                    type="image/webp"
                    srcSet={`/images/wire-apps/${activeSectionApplication.imageSlug}-400.webp 400w, /images/wire-apps/${activeSectionApplication.imageSlug}-800.webp 800w`}
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                  <img
                    src={`/images/wire-apps/${activeSectionApplication.imageSlug}-800.jpg`}
                    alt={
                      isAr
                        ? `الاستخدامات الشائعة لسلك ${activeSectionApplication.size} - ${activeSectionApplication.categoryAr}`
                        : `Common applications for ${activeSectionApplication.sizeEn} wire`
                    }
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-opacity duration-300"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-[#081D35]/85 via-[#081D35]/20 to-transparent" />
                <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between gap-2 text-white">
                  <div>
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#3974C8] text-white mb-1">
                      {isAr
                        ? activeSectionApplication.categoryAr
                        : activeSectionApplication.categoryEn}
                    </span>
                    <div className="text-2xl font-bold tabular-nums">
                      {isAr
                        ? `مقاس ${activeSectionApplication.size}`
                        : `Size ${activeSectionApplication.sizeEn}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Educational Application Details */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E4EAF1]">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#102A43]">
                        {isAr
                          ? `مجالات الاستخدام الشائعة لسلك ${activeSectionApplication.size}`
                          : `Common Application Areas for ${activeSectionApplication.sizeEn}`}
                      </h3>
                      <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                        {isAr
                          ? activeSectionApplication.summaryAr
                          : activeSectionApplication.summaryEn}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAlertModal(activeSectionApplication.id)}
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#EDF3F9] hover:bg-[#3974C8] text-[#102A43] hover:text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>
                        {isAr ? 'تابع سعر هذا المقاس' : 'Track Size Price'}
                      </span>
                    </button>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#3974C8] mb-3">
                      {isAr
                        ? 'أمثلة استرشادية للتطبيقات الشائعة:'
                        : 'Indicative Common Examples:'}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(isAr
                        ? activeSectionApplication.commonExamplesAr
                        : activeSectionApplication.commonExamplesEn
                      ).map((example, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7F9FC] border border-[#E4EAF1] text-[13px] text-[#172334] leading-relaxed"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#3974C8] shrink-0 mt-1.5" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4EAF1] flex items-start gap-2.5 text-[13px] text-[#64748B]">
                  <Info className="w-4 h-4 text-[#3974C8] shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-[#102A43]">
                      {isAr ? 'ملاحظة فنية:' : 'Technical Note:'}
                    </strong>{' '}
                    {isAr
                      ? activeSectionApplication.engineeringNotesAr
                      : activeSectionApplication.engineeringNotesEn}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mandatory Engineering & Electrical Safety Disclaimer Box */}
          <div className="bg-[#102A43] text-white rounded-xl p-5 sm:p-6 border border-[#173B5E]">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#081D35] border border-[#173B5E] flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="space-y-2 text-[13px] leading-relaxed text-slate-200">
                <h3 className="text-sm font-bold text-white">
                  {isAr
                    ? 'تنويه هندسي هام حول اختيار مقاس السلك الكهربائي'
                    : 'Important Engineering Disclaimer on Electrical Wire Sizing'}
                </h3>
                <p>
                  {isAr
                    ? 'الأمثلة المذكورة أعلاه هي أمثلة توضيحية للاستخدامات الشائعة في التمديدات العامة، ولا تُغني عن الحسابات الهندسية الدقيقة. يعتمد الاختيار النهائي لمقاس السلك في أي مشروع على عدة عوامل فنية مترابطة تشمل:'
                    : 'The examples above are educational illustrations of common applications and do not replace formal electrical design calculations. Final wire gauge selection depends on multiple engineering factors:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[12px] text-slate-100">
                  <div className="bg-[#081D35]/80 border border-[#173B5E] rounded-lg px-3 py-2">
                    1.{' '}
                    {isAr
                      ? 'شدة التيار الكهربائي والحمل الفعلي (الأمبير)'
                      : 'Electrical load current (Amperes)'}
                  </div>
                  <div className="bg-[#081D35]/80 border border-[#173B5E] rounded-lg px-3 py-2">
                    2.{' '}
                    {isAr
                      ? 'طريقة التمديد والتركيب (مواسير، حوامل، دفن)'
                      : 'Installation method (conduit, tray, buried)'}
                  </div>
                  <div className="bg-[#081D35]/80 border border-[#173B5E] rounded-lg px-3 py-2">
                    3.{' '}
                    {isAr
                      ? 'طول مسار الكابل وهبوط الجهد المسموح به'
                      : 'Cable run length & permissible voltage drop'}
                  </div>
                  <div className="bg-[#081D35]/80 border border-[#173B5E] rounded-lg px-3 py-2">
                    4.{' '}
                    {isAr
                      ? 'درجة الحرارة المحيطة وتجاور الأسلاك'
                      : 'Ambient temperature & grouping derating'}
                  </div>
                  <div className="bg-[#081D35]/80 border border-[#173B5E] rounded-lg px-3 py-2">
                    5.{' '}
                    {isAr
                      ? 'تصنيف العزل الحراري والجهد الاسمي للسلك'
                      : 'Insulation thermal & voltage rating'}
                  </div>
                  <div className="bg-[#081D35]/80 border border-[#173B5E] rounded-lg px-3 py-2">
                    6.{' '}
                    {isAr
                      ? 'معايرة القواطع وأجهزة الحماية الكهربائية'
                      : 'Circuit breaker & protective device rating'}
                  </div>
                  <div className="bg-[#081D35]/80 border border-[#173B5E] rounded-lg px-3 py-2">
                    7.{' '}
                    {isAr
                      ? 'المواصفات القياسية الكهربائية المعتمدة'
                      : 'Applicable electrical codes & standards'}
                  </div>
                  <div className="bg-[#081D35]/80 border border-[#173B5E] rounded-lg px-3 py-2">
                    8.{' '}
                    {isAr
                      ? 'مراجعة واعتماد مهندس أو فني كهرباء مختص'
                      : 'Review by a qualified engineer or electrician'}
                  </div>
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
          <div className="bg-white border border-[#E4EAF1] rounded-2xl max-w-md w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
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
                      ? 'ضبط إشعارات تغير السعر الفورية'
                      : 'Configure smart price change notifications'}
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
              {/* Wire Size Selector + Current Live Price Summary */}
              <div className="bg-[#F7F9FC] border border-[#E4EAF1] rounded-xl p-3.5 flex items-center justify-between gap-3">
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

              {/* Alert Conditions Radio Group */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#172334]">
                  {isAr ? 'اختر شرط إرسال التنبيه:' : 'Select Alert Condition:'}
                </label>

                {(
                  [
                    {
                      id: 'down' as AlertConditionType,
                      labelAr: 'عند انخفاض السعر',
                      labelEn: 'When price decreases',
                      descAr: 'إشعار فوري عند نزول السعر عن السعر الحالي',
                      descEn: 'Notify immediately when price drops below current price'
                    },
                    {
                      id: 'up' as AlertConditionType,
                      labelAr: 'عند ارتفاع السعر',
                      labelEn: 'When price increases',
                      descAr: 'إشعار فوري عند زيادة السعر عن السعر الحالي',
                      descEn: 'Notify immediately when price rises above current price'
                    },
                    {
                      id: 'any' as AlertConditionType,
                      labelAr: 'عند أي تغيير في السعر',
                      labelEn: 'On any price change',
                      descAr: 'متابعة شاملة لأي تحديث سعري بالارتفاع أو الانخفاض',
                      descEn: 'Notify on any committed upward or downward price update'
                    },
                    {
                      id: 'target' as AlertConditionType,
                      labelAr: 'عند وصول السعر إلى مبلغ محدد',
                      labelEn: 'When price reaches a specific target amount',
                      descAr: 'حدد السعر المستهدف بالدينار الليبي ليصلك إشعار عند الوصول إليه',
                      descEn: 'Specify a target price in LYD to trigger your alert'
                    }
                  ] as const
                ).map((option) => {
                  const isChecked = modalCondition === option.id
                  return (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
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
                        className="mt-1 accent-[#3974C8]"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-[#102A43]">
                          {isAr ? option.labelAr : option.labelEn}
                        </div>
                        <div className="text-[#64748B] mt-0.5">
                          {isAr ? option.descAr : option.descEn}
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>

              {/* Target Price Numeric Input (when condition === 'target') */}
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
                      placeholder="135.00"
                      className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] bg-white text-base font-bold text-[#102A43] tabular-nums focus:outline-none focus:border-[#3974C8]"
                      required
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B]">
                      {isAr ? 'د.ل' : 'LYD'}
                    </span>
                  </div>
                </div>
              )}

              {/* iOS / iPhone Home Screen Web Push Guidance */}
              {isIOSRequiresHomeScreen && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[12px] text-amber-900 leading-relaxed">
                  <strong className="block font-bold mb-0.5">
                    {isAr
                      ? 'ملاحظة لمستخدمي iPhone و iPad:'
                      : 'Note for iPhone & iPad users:'}
                  </strong>
                  {isAr
                    ? 'لتلقي إشعارات الأسعار مباشرة على شاشة الهاتف في نظام iOS، اضغط على زر المشاركة (Share) في سفاري ثم اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen). كما سيتم حفظ التنبيه في قائمة المتابعة الخاصة بك.'
                    : 'To receive lock-screen Web Push notifications on iOS, tap Share in Safari and select "Add to Home Screen". Your alert is also saved to your watchlist.'}
                </div>
              )}

              {/* Browser Permission Denied Notice */}
              {notificationPermission === 'denied' && (
                <div className="rounded-xl bg-[#EDF3F9] border border-[#CBD5E1] p-3 text-[12px] text-[#172334] leading-relaxed">
                  {isAr
                    ? 'إشعارات المتصفح معطلة حالياً في إعدادات جهازك. سيتم حفظ التنبيه وتفعيله داخل قائمة المتابعة بالموقع، ويمكنك السماح بالإشعارات من إعدادات المتصفح في أي وقت.'
                    : 'Browser notifications are currently blocked in your browser settings. Your alert will remain active inside your on-page watchlist.'}
                </div>
              )}

              {modalError && (
                <div className="rounded-lg bg-[#C44949]/10 border border-[#C44949]/30 p-2.5 text-xs font-medium text-[#C44949]">
                  {modalError}
                </div>
              )}

              {alertFeedbackMsg && (
                <div className="rounded-lg bg-[#16845B]/10 border border-[#16845B]/30 p-2.5 text-xs font-semibold text-[#16845B] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{alertFeedbackMsg}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={closeAlertModal}
                  className="h-10 px-4 rounded-lg border border-[#E4EAF1] bg-white hover:bg-[#F7F9FC] text-xs font-semibold text-[#64748B] cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSavingAlert}
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-[#3974C8] hover:bg-[#2d62b0] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isSavingAlert
                      ? isAr
                        ? 'جارٍ التفعيل…'
                        : 'Activating…'
                      : isAr
                      ? 'تفعيل التنبيه'
                      : 'Activate Alert'}
                  </span>
                </button>
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
          <div className="bg-white border border-[#E4EAF1] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Visual Header with Optimized Picture */}
            <div className="relative h-56 sm:h-64 bg-[#081D35] overflow-hidden">
              <picture>
                <source
                  type="image/avif"
                  srcSet={`/images/wire-apps/${activeModalApplication.imageSlug}-400.avif 400w, /images/wire-apps/${activeModalApplication.imageSlug}-800.avif 800w`}
                  sizes="(max-width: 640px) 100vw, 672px"
                />
                <source
                  type="image/webp"
                  srcSet={`/images/wire-apps/${activeModalApplication.imageSlug}-400.webp 400w, /images/wire-apps/${activeModalApplication.imageSlug}-800.webp 800w`}
                  sizes="(max-width: 640px) 100vw, 672px"
                />
                <img
                  src={`/images/wire-apps/${activeModalApplication.imageSlug}-800.jpg`}
                  alt={
                    isAr
                      ? `الاستخدامات الشائعة لسلك ${activeModalApplication.size}`
                      : `Common applications for ${activeModalApplication.sizeEn}`
                  }
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-[#081D35] via-[#081D35]/35 to-transparent" />

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
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#3974C8] text-white mb-1">
                    {isAr
                      ? activeModalApplication.categoryAr
                      : activeModalApplication.categoryEn}
                  </span>
                  <h3 id="wire-app-modal-title" className="text-2xl font-bold">
                    {isAr
                      ? `الاستخدامات الشائعة لسلك ${activeModalApplication.size}`
                      : `Common Uses for ${activeModalApplication.sizeEn} Wire`}
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
                <h4 className="text-xs font-bold text-[#3974C8] mb-2.5">
                  {isAr
                    ? 'أمثلة التطبيقات الكهربائية الشائعة:'
                    : 'Common Electrical Application Examples:'}
                </h4>
                <ul className="space-y-2">
                  {(isAr
                    ? activeModalApplication.commonExamplesAr
                    : activeModalApplication.commonExamplesEn
                  ).map((ex, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F7F9FC] border border-[#E4EAF1] text-xs text-[#172334]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3974C8] shrink-0 mt-1.5" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Engineering Safety Note inside Modal */}
              <div className="rounded-xl bg-[#EDF3F9] border border-[#CBD5E1] p-3.5 text-[12px] text-[#172334] leading-relaxed">
                <strong className="font-bold text-[#102A43] block mb-1">
                  {isAr
                    ? 'إرشاد هندسي وسلامة كهربائية:'
                    : 'Engineering & Electrical Safety Guidance:'}
                </strong>
                {isAr
                  ? 'تُعرض هذه الاستخدامات لأغراض توضيحية استرشادية. يعتمد تحديد مقاس السلك النهائي على شدة التيار الكهربائي (الأمبير)، وطريقة التمديد، وطول المسار، وهبوط الجهد، ودرجة الحرارة المحيطة، وتصنيف العزل، ومعايرة القاطع الكهربائي، ومراجعة مهندس أو فني كهرباء مختص.'
                  : 'These applications are illustrative examples. Final wire sizing must account for current load, installation method, cable length, voltage drop, ambient temperature, insulation rating, protective breaker sizing, and review by a qualified electrician or engineer.'}
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
