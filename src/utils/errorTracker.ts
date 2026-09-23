// نظام مراقبة واقتناص الأعطال في بيئة الإنتاج لشركة الإنارة الحديثة
// Enterprise Production Error Monitoring & Diagnostics Engine

interface ErrorPayload {
  message: string
  stack?: string
  source?: string
  lineno?: number
  colno?: number
  url: string
  userAgent: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  severity: 'warning' | 'error' | 'critical'
  timestamp: number
  errorHash: string
}

const seenErrorHashes = new Set<string>()

// تنظيف وحجب البيانات الحساسة (كلمات المرور، التوكنات، أرقام البطاقات)
function sanitizeErrorMessage(msg: string): string {
  if (!msg || typeof msg !== 'string') return 'Unknown Error'
  return msg
    .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/gi, '[REDACTED_EMAIL]')
    .replace(/(password|token|secret|key)=([^&]+)/gi, '$1=[REDACTED]')
    .replace(/\b\d{16}\b/g, '[REDACTED_CARD]')
    .slice(0, 1000)
}

// إنشاء معرف فريد للخطأ لتجميع الأعطال المتكررة (Deduplication)
function computeErrorHash(message: string, source?: string, lineno?: number): string {
  const raw = `${message || ''}_${source || ''}_${lineno || 0}`
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i)
    hash |= 0
  }
  return `err_${Math.abs(hash).toString(16)}`
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  const width = window.innerWidth
  if (width < 640) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * إرسال تقرير الخطأ إلى الخادم دون تعطيل المتصفح
 */
export function reportErrorToBackend(error: Partial<ErrorPayload>) {
  if (typeof window === 'undefined') return

  const message = sanitizeErrorMessage(error.message || 'Unknown Exception')
  const errorHash = error.errorHash || computeErrorHash(message, error.source, error.lineno)

  // منع إرسال نفس الخطأ أكثر من مرة خلال نفس الجلسة (Deduplication)
  if (seenErrorHashes.has(errorHash)) {
    return
  }
  seenErrorHashes.add(errorHash)

  const payload: ErrorPayload = {
    message,
    stack: sanitizeErrorMessage(error.stack || ''),
    source: error.source || window.location.href,
    lineno: error.lineno || 0,
    colno: error.colno || 0,
    url: window.location.href,
    userAgent: navigator.userAgent,
    deviceType: getDeviceType(),
    severity: error.severity || 'error',
    timestamp: Date.now(),
    errorHash
  }

  const endpoint = 'https://enarah2.vercel.app/api/log-error'

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

/**
 * تهيئة المراقب العام للأعطال والوعود المرفوضة
 */
export function initErrorMonitoring() {
  if (typeof window === 'undefined') return

  // 1. أخطاء جافاسكريبت غير المعالجة
  window.addEventListener('error', (event) => {
    // تجاهل أخطاء الإضافات الخارجية للمتصفح (browser extensions)
    if (event.filename && (event.filename.includes('chrome-extension:') || event.filename.includes('moz-extension:'))) {
      return
    }

    reportErrorToBackend({
      message: event.message,
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      severity: 'error'
    })
  })

  // 2. وعود غير ملتقطة (Unhandled Promise Rejections)
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    const message = reason instanceof Error ? reason.message : String(reason || 'Unhandled Promise')
    const stack = reason instanceof Error ? reason.stack : undefined

    reportErrorToBackend({
      message: `Unhandled Rejection: ${message}`,
      stack,
      severity: 'warning'
    })
  })
}
