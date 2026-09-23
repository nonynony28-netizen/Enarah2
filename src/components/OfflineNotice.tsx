import { useState, useEffect, useRef } from 'react'
import { WifiOff, Wifi, RefreshCw, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../hooks/useLanguage'

export default function OfflineNotice() {
  const { isAr } = useLanguage()
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [isServerDown, setIsServerDown] = useState(false)
  const [showRestored, setShowRestored] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // وظيفة التحقق الفعلي من الاتصال بالإنترنت والخدمة
  const testConnectivity = async () => {
    setIsChecking(true)
    try {
      const response = await fetch('/robots.txt?t=' + Date.now(), { method: 'HEAD', cache: 'no-store' })
      if (response.ok) {
        setIsOffline(false)
        setIsServerDown(false)
        setShowRestored(true)
        setTimeout(() => setShowRestored(false), 3500)
        return true
      }
    } catch {
      // إذا فشل الطلب رغم أن المتصفح يرى أنه online، فهذا خلل اتصال
      if (!navigator.onLine) {
        setIsOffline(true)
      } else {
        setIsServerDown(true)
      }
    } finally {
      setIsChecking(false)
    }
    return false
  }

  useEffect(() => {
    const handleOnline = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        testConnectivity()
      }, 500)
    }

    const handleOffline = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        setIsOffline(true)
        setShowRestored(false)
      }, 500)
    }

    const handleServerError = (e: any) => {
      if (navigator.onLine) {
        setIsServerDown(true)
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('enarah_server_down', handleServerError)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('enarah_server_down', handleServerError)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [])

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[3000] max-w-lg w-[90%] sm:w-auto pointer-events-none">
      <AnimatePresence>
        {/* 1. حالة انقطاع الإنترنت الحقيقي */}
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="pointer-events-auto px-5 py-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl text-white font-semibold text-xs sm:text-sm shadow-2xl border border-amber-500/40 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <WifiOff className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-right">
                <div className="font-bold text-white text-xs sm:text-sm">
                  {isAr ? 'لا يوجد اتصال بالإنترنت' : 'No Internet Connection'}
                </div>
                <div className="text-[11px] text-slate-300 font-normal">
                  {isAr ? 'تحقق من اتصالك وحاول مرة أخرى (الموقع محفوظ ويعمل أوفلاين)' : 'Check connection. Cached pages are ready offline.'}
                </div>
              </div>
            </div>

            <button
              onClick={testConnectivity}
              disabled={isChecking}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
            </button>
          </motion.div>
        )}

        {/* 2. حالة تعذر الاتصال بالخدمة والسيرفر */}
        {!isOffline && isServerDown && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="pointer-events-auto px-5 py-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl text-white font-semibold text-xs sm:text-sm shadow-2xl border border-blue-500/40 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="text-right">
                <div className="font-bold text-white text-xs sm:text-sm">
                  {isAr ? 'تعذر الاتصال بالخدمة' : 'Service Temporarily Unavailable'}
                </div>
                <div className="text-[11px] text-slate-300 font-normal">
                  {isAr ? 'الخدمة غير متاحة حالياً، يرجى المحاولة مرة أخرى بعد قليل.' : 'Service unavailable, please try again shortly.'}
                </div>
              </div>
            </div>

            <button
              onClick={testConnectivity}
              disabled={isChecking}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
            </button>
          </motion.div>
        )}

        {/* 3. إشعار عودة الاتصال بنجاح */}
        {showRestored && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="pointer-events-auto px-5 py-3 rounded-2xl bg-emerald-600/95 backdrop-blur-xl text-white font-bold text-xs sm:text-sm shadow-2xl border border-emerald-400/40 flex items-center gap-3"
          >
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span>{isAr ? 'تم استعادة الاتصال بالإنترنت بنجاح ✅' : 'Connection restored successfully ✅'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
