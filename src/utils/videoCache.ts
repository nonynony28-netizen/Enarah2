// نظام التخزين الدائم المتقدم للفيديو السينمائي لمنع أي تقطيع نهائياً
// Advanced Persistent Video Cache Engine to guarantee zero-stutter playback

const CACHE_NAME = 'enarah-video-cache-v2'
const HERO_VIDEO_PATH = '/hero-video.mp4'

declare global {
  interface Window {
    __ENARAH_HERO_BLOB_URL__?: string
  }
}

/**
 * يفحص كاش المتصفح الدائم، وإذا كان الفيديو محفوظاً يسترجعه كـ Blob في الذاكرة
 * وإذا لم يكن محفوظاً يقوم بتنزيله وتخزينه نهائياً ليتم استدعاؤه فورياً في المرات القادمة بدون أي تقطيع
 */
export async function initHeroVideoCache(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  // إذا تم استخراجه مسبقاً في هذه الجلسة
  if (window.__ENARAH_HERO_BLOB_URL__) {
    return window.__ENARAH_HERO_BLOB_URL__
  }

  try {
    if ('caches' in window) {
      const cache = await window.caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(HERO_VIDEO_PATH)

      if (cachedResponse) {
        const blob = await cachedResponse.blob()
        if (blob && blob.size > 20000) {
          const blobUrl = URL.createObjectURL(blob)
          window.__ENARAH_HERO_BLOB_URL__ = blobUrl
          return blobUrl
        }
      }

      // إذا لم يكن مخزناً في الكاش، نقوم بتنزيله في الخلفية وتخزينه كملف محلي دائم
      const response = await fetch(HERO_VIDEO_PATH)
      if (response.ok) {
        const clone = response.clone()
        await cache.put(HERO_VIDEO_PATH, clone)
        const blob = await response.blob()
        if (blob && blob.size > 20000) {
          const blobUrl = URL.createObjectURL(blob)
          window.__ENARAH_HERO_BLOB_URL__ = blobUrl
          return blobUrl
        }
      }
    }
  } catch (err) {
    console.warn('Video cache initialization error:', err)
  }

  return null
}
