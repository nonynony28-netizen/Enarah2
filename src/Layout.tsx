import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLanguage } from "./hooks/useLanguage";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function Layout() {
  const { isAr } = useLanguage()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [isDragging, setIsDragging] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const y = useMotionValue(0)
  
  // ضبط مقاييس الحبل بناءً على نوع الجهاز ليكون ملائماً للهواتف
  const defaultHeight = isMobile ? 80 : 120
  const maxDrag = isMobile ? 80 : 150
  const cordHeight = useTransform(y, [0, maxDrag], [defaultHeight, defaultHeight + 120])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLight = document.documentElement.classList.contains('light')
      setTheme(isLight ? 'light' : 'dark')
    }

    const handleThemeChange = () => {
      const isLight = document.documentElement.classList.contains('light')
      setTheme(isLight ? 'light' : 'dark')
    }

    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setScrollPercent(scrollTop / docHeight)
      } else {
        setScrollPercent(0)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    return y.onChange((latest) => {
      // Dynamic analog dimming: adjust dimming layer opacity based on pull distance
      const opacity = Math.min(0.7, (latest / maxDrag) * 0.7)
      document.documentElement.style.setProperty('--pull-dim-opacity', String(opacity))
    })
  }, [y, maxDrag])

  const playClickSound = (isTurningOn: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const now = audioCtx.currentTime;
      if (isTurningOn) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.04);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.05);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  const toggleThemeGlobal = () => {
    const root = window.document.documentElement
    const isLight = root.classList.contains('light')
    if (isLight) {
      root.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.add('light')
      localStorage.setItem('theme', 'light')
    }
    window.dispatchEvent(new Event('themechange'))
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    const currentY = y.get()
    
    // إرجاع الحبل لمكانه الطبيعي بمرونة فيزيائية مضمونة تمنع التعليق عند إعادة بناء الصفحة
    animate(y, 0, {
      type: "spring",
      stiffness: 380,
      damping: 24
    })

    const threshold = isMobile ? 55 : 90
    if (currentY >= threshold) {
      const isLight = document.documentElement.classList.contains('light')
      playClickSound(!isLight)
      toggleThemeGlobal()
    }

    document.documentElement.style.setProperty('--pull-dim-opacity', '0')
  }

  return (
    <div className="relative min-h-screen text-white">
      {/* الخلفية الإبداعية فائقة الأداء والمتحركة ببطء */}
      <div className="fixed inset-0 -z-50 w-full h-full bg-[#050b14] overflow-hidden pointer-events-none">
        {/* التدرج اللوني الذي يتحرك ببطء */}
        <div className="absolute -inset-[50%] w-[200%] h-[200%] bg-ultra-ambient animate-slow-rotate opacity-90"></div>
        {/* الشبكة الهندسية الفاخرة */}
        <div className="absolute inset-0 bg-animated-grid opacity-[0.06]"></div>
        {/* طبقة تظليل داكنة ناعمة لضمان سهولة قراءة النصوص */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b14]/30 via-transparent to-[#050b14]/60"></div>
      </div>

      {/* 1. عمود النور النيوني الأوسط الممتد في الخلفية للتفاعل مع التمرير */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[8px] h-full bg-white/[0.01] border-l border-white/[0.02] border-r border-white/[0.02] -z-40 pointer-events-none">
        <motion.div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[4px] bg-gradient-to-b ${
            theme === 'light'
              ? 'from-amber-500 via-yellow-400 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.8),0_0_30px_rgba(245,158,11,0.4)]'
              : 'from-blue-500 via-sky-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8),0_0_30px_rgba(59,130,246,0.4)]'
          }`}
          style={{ height: `${scrollPercent * 100}%` }}
        />
      </div>

      {/* هالة الضوء النيونية العائمة في منتصف الخلفية التي تتبع موقع التمرير */}
      <div 
        className="fixed left-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-30 transition-all duration-500 ease-out"
        style={{ 
          top: `${window.innerHeight * 0.15 + (scrollPercent * (window.innerHeight * 0.7))}px`,
          transform: 'translate(-50%, -50%)',
          background: theme === 'light'
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 70%)',
        }}
      />

      {/* 2. حبل السحب العائم التفاعلي لتعديل وتعتيم الضوء وسحب المفتاح */}
      <div className="fixed top-0 left-6 md:left-[70px] z-[2000] flex flex-col items-center pointer-events-none select-none">
        <motion.div 
          className="w-[1.5px] md:w-[2px] bg-gradient-to-b from-[#111] via-[#444] to-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.3)]"
          style={{ height: cordHeight }}
        />
        <motion.div 
          drag="y"
          dragConstraints={{ top: 0, bottom: maxDrag }}
          dragElastic={isMobile ? 0.75 : 0.25}
          style={{ y }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 border-[1.5px] md:border-2 border-white cursor-grab active:cursor-grabbing pointer-events-auto shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_12px_rgba(245,158,11,0.8)] flex items-center justify-center transition-shadow duration-300"
        >
          <div className="w-1 h-1 md:w-[6px] md:h-[6px] bg-white rounded-full opacity-90" />
        </motion.div>

        {/* مؤشر الإرشاد العائم */}
        <div className={`absolute top-full mt-3 text-[9px] md:text-[10px] font-black tracking-tight px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border transition-all duration-300 whitespace-nowrap shadow-md pointer-events-none ${
          theme === 'light'
            ? 'bg-white/90 text-slate-800 border-slate-200/50 shadow-slate-200/20'
            : 'bg-slate-900/90 text-blue-400 border-white/10 shadow-black/40'
        }`}>
          {isDragging 
            ? (isAr ? 'شد الحبل للتعتيم والتبديل...' : 'Pull to switch...') 
            : (isAr ? 'اسحب خيط الإنارة 💡' : 'Pull Light Cord 💡')}
        </div>
      </div>

      {/* 3. طبقة التعتيم المؤقتة أثناء السحب */}
      <div 
        className="fixed inset-0 bg-black pointer-events-none z-[1999] transition-opacity duration-75"
        style={{ opacity: 'var(--pull-dim-opacity, 0)' }}
      />

      <Navbar />
      <div className="relative z-10 w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
