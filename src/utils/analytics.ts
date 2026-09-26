// محرك تتبع التحويلات والزيارات والـ UTM لشركة الإنارة الحديثة - متوافق مع أعلى معايير الخصوصية والأداء
// Privacy-First Conversion & Attribution Analytics Engine

export interface AnalyticsEvent {
  eventName: string
  properties?: Record<string, any>
  timestamp: number
  url: string
  landingPage: string
  referrer: string
  sessionId: string
  visitorId: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  browser: string
  os: string
  utm: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }
}

// إنشاء أو استرجاع معرف زائر مجهول (Anonymous UUID)
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'anon'
  let id = localStorage.getItem('enarah_visitor_uuid')
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    localStorage.setItem('enarah_visitor_uuid', id)
  }
  return id
}

// إدارة الجلسة الحالية
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'session'
  let id = sessionStorage.getItem('enarah_session_uuid')
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    sessionStorage.setItem('enarah_session_uuid', id)
  }
  return id
}

// حفظ واسترجاع أول صفحة هبوط وصل إليها الزائر
export function getLandingPage(): string {
  if (typeof window === 'undefined') return '/'
  let lp = sessionStorage.getItem('enarah_landing_page')
  if (!lp) {
    lp = window.location.pathname + window.location.search
    sessionStorage.setItem('enarah_landing_page', lp)
  }
  return lp
}

// استخراج وحفظ معاملات الحملات التسويقية (UTM Parameters) مع حفظ اللمسة الأولى والأخيرة
export function captureUtmParameters(): Record<string, string> {
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

  // حفظ اللمسة الأولى (First-Touch) بشكل دائم واللمسة الأخيرة (Last-Touch) للجلسة
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

export function getDeviceCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  const width = window.innerWidth
  if (width < 640) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export function detectBrowser(): string {
  if (typeof window === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return 'Opera'
  if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet'
  if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome'
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari'
  if (/Firefox/i.test(ua)) return 'Firefox'
  return 'Other'
}

export function detectOS(): string {
  if (typeof window === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
  if (/Android/i.test(ua)) return 'Android'
  if (/Windows/i.test(ua)) return 'Windows'
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS'
  if (/Linux/i.test(ua)) return 'Linux'
  return 'Other'
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
    landingPage: getLandingPage(),
    referrer: document.referrer || '',
    sessionId: getOrCreateSessionId(),
    visitorId: getOrCreateVisitorId(),
    deviceType: getDeviceCategory(),
    browser: detectBrowser(),
    os: detectOS(),
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

// وظائف مساعدة متخصصة لتوحيد قياسات التحويل عبر الموقع
export const analytics = {
  trackWhatsAppClick: (label = 'general', props = {}) => {
    trackConversionEvent('whatsapp_click', { label, ...props })
  },
  trackPhoneClick: (label = 'general', props = {}) => {
    trackConversionEvent('phone_click', { label, ...props })
  },
  trackEmailClick: (label = 'general', props = {}) => {
    trackConversionEvent('email_click', { label, ...props })
  },
  trackPrimaryCta: (label: string, props = {}) => {
    trackConversionEvent('primary_cta_click', { label, ...props })
  },
  trackProductView: (productName: string, category?: string) => {
    trackConversionEvent('product_viewed', { productName, category })
  },
  trackProjectView: (projectName: string, category?: string) => {
    trackConversionEvent('project_viewed', { projectName, category })
  },
  trackBrandView: (brandName: string) => {
    trackConversionEvent('brand_viewed', { brandName })
  },
  trackSearch: (query: string, resultsCount = 0) => {
    trackConversionEvent('search_performed', { query, resultsCount })
  },
  trackSearchResultClick: (query: string, itemTitle: string) => {
    trackConversionEvent('search_result_clicked', { query, itemTitle })
  },
  trackMapClick: (locationName = 'Main Branch') => {
    trackConversionEvent('map_location_click', { locationName })
  },
  trackSocialClick: (platform: string) => {
    trackConversionEvent('social_link_click', { platform })
  }
}
