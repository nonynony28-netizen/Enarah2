import { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../hooks/useLanguage'

export default function OfflineNotice() {
  const { isAr } = useLanguage()
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showRestored, setShowRestored] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      setShowRestored(true)
      const timer = setTimeout(() => setShowRestored(false), 4000)
      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setShowRestored(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[3000] px-5 py-3 rounded-2xl bg-amber-500/90 backdrop-blur-md text-slate-950 font-bold text-xs md:text-sm shadow-[0_10px_30px_rgba(245,158,11,0.4)] border border-amber-300/40 flex items-center gap-3 dir-rtl"
        >
          <WifiOff className="w-5 h-5 text-slate-950 animate-pulse" />
          <span>
            {isAr
              ? 'انقطع الاتصال بالإنترنت ⚠️ - تم حفظ صفحات الموقع وتعمل في وضع الأوفلاين'
              : 'Internet Disconnected ⚠️ - Cached pages are available offline'}
          </span>
        </motion.div>
      )}

      {showRestored && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[3000] px-5 py-3 rounded-2xl bg-emerald-500/90 backdrop-blur-md text-white font-bold text-xs md:text-sm shadow-[0_10px_30px_rgba(16,185,129,0.4)] border border-emerald-300/40 flex items-center gap-3 dir-rtl"
        >
          <Wifi className="w-5 h-5 text-white" />
          <span>
            {isAr
              ? 'تم استعادة الاتصال بالإنترنت بنجاح 🟢'
              : 'Internet Connection Restored 🟢'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
