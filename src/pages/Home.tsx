import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Award,
  Shield,
  Sparkles,
  Zap,
  ArrowLeft,
} from 'lucide-react'

// ======================================
// مكون الظهور المتدرج مع حركة احترافية
// ======================================
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef(null)

  const isInView = useInView(ref, {
    once: true,
    margin: '-50px',
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  return (
    <div className="pt-0"> {/* تم إزالة البادينج العلوي لجعل الفيديو يأخذ الشاشة بالكامل */}
      
          {/* ======================================
          Hero Section (الواجهة السينمائية المتكيفة)
      ====================================== */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a192f]"
      >
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          
          {/* فيديو الكمبيوتر (بالعرض) - يختفي في الجوال */}
          <iframe
            src="https://streamable.com/e/zarpqc?autoplay=1&muted=1&nocontrols=1&loop=1&playsinline=1&preload=auto"
            allow="autoplay; fullscreen"
            loading="eager"
            referrerPolicy="no-referrer"
            className="hidden md:block w-full h-full object-cover scale-[1.2] opacity-60"
            style={{ border: 'none', pointerEvents: 'none' }}
          />

          {/* فيديو الجوال (بالطول) - يظهر فقط في الجوال */}
          <iframe
            src="https://streamable.com/e/lm701e?autoplay=1&muted=1&nocontrols=1&loop=1&playsinline=1&preload=auto"
            allow="autoplay; fullscreen"
            loading="eager"
            referrerPolicy="no-referrer"
            className="block md:hidden w-full h-full object-cover scale-[1.05] opacity-60"
            style={{ border: 'none', pointerEvents: 'none' }}
          />

          {/* تأثيرات دمج أطراف الفيديو مع لون الموقع */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/90 via-[#0a192f]/40 to-[#0a192f] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f]/80 via-transparent to-[#0a192f]/80 pointer-events-none" />
        </div>

        {/* محتوى الواجهة (النصوص والأزرار) */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-10 md:mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-4 md:mb-6 leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              الإنارة{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                الحديثة
              </span>
            </h1>

            <p className="text-base md:text-2xl text-blue-50/80 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed font-medium px-2">
              كل ما تحتاجه من الإضاءة والتأسيس الكهربائي بجودة عالمية وحلول متكاملة تلبي تطلعاتك
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
              <Link
                to="/products"
                className="group relative px-6 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-gradient-to-l from-blue-600 to-blue-400 text-white font-bold text-base md:text-lg rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] flex items-center justify-center gap-3 overflow-hidden hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                استعرض المنتجات
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-300" />
              </Link>

              <Link
                to="/contact"
                className="px-6 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-white/[0.05] backdrop-blur-md border border-white/10 text-white font-bold text-base md:text-lg rounded-2xl hover:bg-white/[0.1] hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center"
              >
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
