// محرك قياس ومراقبة الأداء ومؤشرات تجربة المستخدم الحيوية (Core Web Vitals)
// Non-blocking Native PerformanceObserver Engine for ENARAH Modern

import { trackConversionEvent } from './analytics'

type MetricRating = 'good' | 'needs-improvement' | 'poor'

interface WebVitalSample {
  name: 'TTFB' | 'FCP' | 'LCP' | 'CLS' | 'INP'
  value: number
  rating: MetricRating
  url: string
}

function getRating(name: string, value: number): MetricRating {
  switch (name) {
    case 'TTFB':
      if (value <= 800) return 'good'
      if (value <= 1800) return 'needs-improvement'
      return 'poor'
    case 'FCP':
      if (value <= 1800) return 'good'
      if (value <= 3000) return 'needs-improvement'
      return 'poor'
    case 'LCP':
      if (value <= 2500) return 'good'
      if (value <= 4000) return 'needs-improvement'
      return 'poor'
    case 'CLS':
      if (value <= 0.1) return 'good'
      if (value <= 0.25) return 'needs-improvement'
      return 'poor'
    case 'INP':
      if (value <= 200) return 'good'
      if (value <= 500) return 'needs-improvement'
      return 'poor'
    default:
      return 'good'
  }
}

const reportedMetrics = new Set<string>()

function sendMetric(name: 'TTFB' | 'FCP' | 'LCP' | 'CLS' | 'INP', value: number) {
  if (typeof window === 'undefined') return
  const rounded = name === 'CLS' ? parseFloat(value.toFixed(3)) : Math.round(value)
  const metricKey = `${name}_${window.location.pathname}`
  
  if (reportedMetrics.has(metricKey)) return
  reportedMetrics.add(metricKey)

  const sample: WebVitalSample = {
    name,
    value: rounded,
    rating: getRating(name, rounded),
    url: window.location.pathname
  }

  // إرسال العينة خلسة إلى واجهة التحليلات لتسجيل الأداء المباشر
  trackConversionEvent('web_vital', sample)
}

export function initWebVitals() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

  // 1. TTFB (Time to First Byte)
  try {
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    if (navEntries && navEntries.length > 0) {
      const ttfb = navEntries[0].responseStart
      if (ttfb > 0) sendMetric('TTFB', ttfb)
    } else {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceNavigationTiming[]
        if (entries && entries.length > 0) {
          sendMetric('TTFB', entries[0].responseStart)
          navObserver.disconnect()
        }
      })
      navObserver.observe({ type: 'navigation', buffered: true })
    }
  } catch {}

  // 2. FCP (First Contentful Paint)
  try {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          sendMetric('FCP', entry.startTime)
          paintObserver.disconnect()
          break
        }
      }
    })
    paintObserver.observe({ type: 'paint', buffered: true })
  } catch {}

  // 3. LCP (Largest Contentful Paint)
  try {
    let latestLcp = 0
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1]
        latestLcp = lastEntry.startTime
      }
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

    const dispatchLcp = () => {
      if (latestLcp > 0) {
        sendMetric('LCP', latestLcp)
        try { lcpObserver.disconnect() } catch {}
      }
    }

    // إرسال LCP عند إخفاء الصفحة أو مغادرتها
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') dispatchLcp()
    }, { once: true })
    window.addEventListener('pagehide', dispatchLcp, { once: true })
  } catch {}

  // 4. CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })

    const dispatchCls = () => {
      sendMetric('CLS', clsValue)
      try { clsObserver.disconnect() } catch {}
    }

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') dispatchCls()
    }, { once: true })
    window.addEventListener('pagehide', dispatchCls, { once: true })
  } catch {}

  // 5. INP (Interaction to Next Paint)
  try {
    let maxInteraction = 0
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (entry.duration && entry.duration > maxInteraction) {
          maxInteraction = entry.duration
        }
      }
    })
    inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 } as any)

    const dispatchInp = () => {
      if (maxInteraction > 0) {
        sendMetric('INP', maxInteraction)
        try { inpObserver.disconnect() } catch {}
      }
    }

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') dispatchInp()
    }, { once: true })
    window.addEventListener('pagehide', dispatchInp, { once: true })
  } catch {}
}
