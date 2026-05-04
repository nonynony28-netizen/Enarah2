import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 400)
          return 100
        }
        return prev + 2
      })
    }, 40)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-darkblue"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8"
      >
        <div className="relative">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gold tracking-wide"
            style={{ textShadow: '0 0 30px rgba(212,160,23,0.5)' }}
            animate={{
              textShadow: [
                '0 0 20px rgba(212,160,23,0.3)',
                '0 0 40px rgba(212,160,23,0.6)',
                '0 0 20px rgba(212,160,23,0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            الإنارة الحديثة
          </motion.h1>
          <div className="absolute -inset-4 bg-gold/10 blur-2xl rounded-full" />
        </div>

        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <motion.p
          className="text-white/50 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          جاري التحميل...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
