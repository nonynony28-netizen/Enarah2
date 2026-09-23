// محرك تتبع التحويلات والزيارات لشركة الإنارة الحديثة - متوافق مع أعلى معايير الخصوصية والأداء
// Privacy-First Conversion & Attribution Analytics Engine

interface AnalyticsEvent {
  eventName: string
  properties?: Record<string, any>
  timestamp: number
  url: string
  referrer: string
  sessionId: string
  visitorId: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  utm: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }
}

// إنشاء أو استرجاع معرف زائر مجهول (Anonymous UUID)
function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'anon'
  let id = localStorage.getItem('enarah_visitor_uuid')
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    localStorage.setItem('enarah_visitor_uuid', id)
  }
  return id
}

// إدارة الجلسة الحالية
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'session'
  let id = sessionStorage.getItem('enarah_session_uuid')
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    sessionStorage.setItem('enarah_session_uuid', id)
  }
  return id
}

// استخراج وحفظ معاملات الحملات التسويقية (UTM Parameters)
function captureUtmParameters(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  const currentUtm: Record<string, string> = {}

  let foundNew = false
  for (const key of utmKeys) {
    const val = params.get(key)
    if (val) {
      currentUtm[key.replace('utm_', '')] = val
      foundNew = true
    }
  }

  // حفظ اللمسة الأولى (First-Touch) واللمسة الأخيرة (Last-Touch)
  if (foundNew) {
    if (!localStorage.getItem('enarah_utm_first_touch')) {
      localStorage.setItem('enarah_utm_first_touch', JSON.stringify(currentUtm))
    }
    sessionStorage.setItem('enarah_utm_last_touch', JSON.stringify(currentUtm))
    return currentUtm
  }

  try {
    const last = sessionStorage.getItem('enarah_utm_last_touch')
    if (last) return JSON.parse(last)
    const first = localStorage.getItem('enarah_utm_first_touch')
    if (first) return JSON.parse(first)
  } catch {}

  return {}
}

function getDeviceCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  const width = window.innerWidth
  if (width < 640) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * تتبع الأحداث والأفعال الشرائية والتواصلية (Conversion Event)
 */
export function trackConversionEvent(eventName: string, properties: Record<string, any> = {}) {
  if (typeof window === 'undefined') return

  const payload: AnalyticsEvent = {
    eventName,
    properties,
    timestamp: Date.now(),
    url: window.location.pathname + window.location.search,
    referrer: document.referrer || '',
    sessionId: getOrCreateSessionId(),
    visitorId: getOrCreateVisitorId(),
    deviceType: getDeviceCategory(),
    utm: captureUtmParameters()
  }

  const endpoint = 'https://enarah2.vercel.app/api/track-event'

  if (navigator.sendBeacon) {
    try {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      navigator.sendBeacon(endpoint, blob)
      return
    } catch {}
  }

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {})
}
