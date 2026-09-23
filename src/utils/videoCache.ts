// نظام التخزين الذكي والتكيفي مع سرعة الإنترنت ونوع الجهاز (هواتف / أجهزة ضعيفة / إنترنت بطيء)
// Adaptive Video Cache Engine optimized for Mobile, Low-End Devices, and Slow Networks

const CACHE_NAME = 'enarah-video-cache-v2'

declare global {
  interface Window {
    __ENARAH_HERO_BLOB_URL__?: string
    __ENARAH_TARGET_VIDEO__?: string
  }
}

/**
 * تحديد أنسب مسار للفيديو بناءً على نوع الجهاز وسرعة الإنترنت وقدرة المعالج
 * للهواتف والإنترنت البطيء: يتم اختيار نسخة 720p الخفيفة جداً (611 كيلوبايت فقط)
 * للحواسيب السريعة: يتم اختيار نسخة 1080p عالية الدقة (1.66 ميغابايت)
 */
export function getOptimalHeroVideoPath(): string {
  if (typeof window === 'undefined') return '/hero-video.mp4'

  if (window.__ENARAH_TARGET_VIDEO__) {
    return window.__ENARAH_TARGET_VIDEO__
  }

  const isMobileScreen = window.innerWidth <= 768 || window.innerHeight <= 600

  // فحص سرعة الإنترنت ووضع توفير البيانات (Data Saver)
  const nav = navigator as any
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection
  const isSlowConnection = conn && (
    conn.saveData === true ||
    conn.effectiveType === 'slow-2g' ||
    conn.effectiveType === '2g' ||
    conn.effectiveType === '3g'
  )

  // فحص قدرة المعالج والذاكرة للأجهزة الاقتصادية والضعيفة
  const isLowEndDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
                         (nav.deviceMemory && nav.deviceMemory <= 4)

  const selected = (isMobileScreen || isSlowConnection || isLowEndDevice)
    ? '/hero-video-mobile.mp4'
    : '/hero-video.mp4'

  window.__ENARAH_TARGET_VIDEO__ = selected
  return selected
}

/**
 * فحص الكاش الدائم واسترجاع الفيديو فورياً كـ Blob بدون انتظار الإنترنت
 * وتنزيله وحفظه في خلفية المتصفح للأجهزة الضعيفة والإنترنت البطيء
 */
export async function initHeroVideoCache(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  const targetPath = getOptimalHeroVideoPath()

  // إذا كان الـ Blob جاهزاً مسبقاً في الذاكرة
  if (window.__ENARAH_HERO_BLOB_URL__) {
    return window.__ENARAH_HERO_BLOB_URL__
  }

  try {
    if ('caches' in window) {
      const cache = await window.caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(targetPath)

      if (cachedResponse) {
        const blob = await cachedResponse.blob()
        if (blob && blob.size > 10000) {
          const blobUrl = URL.createObjectURL(blob)
          window.__ENARAH_HERO_BLOB_URL__ = blobUrl
          return blobUrl
        }
      }

      // إذا لم يكن مخزناً بعد: تنزيل النسخة المناسبة في الخلفية وتخزينها محلياً
      const response = await fetch(targetPath)
      if (response.ok) {
        const clone = response.clone()
        await cache.put(targetPath, clone)
        const blob = await response.blob()
        if (blob && blob.size > 10000) {
          const blobUrl = URL.createObjectURL(blob)
          window.__ENARAH_HERO_BLOB_URL__ = blobUrl
          return blobUrl
        }
      }
    }
  } catch (err) {
    console.warn('Adaptive video cache initialization error:', err)
  }

  return null
}
