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
  
  // حالات لتفعيل مفتاح الإنارة التفاعلي عند أول تمرير للموقع
  const [isScrollActivated, setIsScrollActivated] = useState(false)
  const [hasPlayedSwitchSound, setHasPlayedSwitchSound] = useState(false)

  const y = useMotionValue(0)
  
  // ضبط مقاييس الحبل بناءً على نوع الجهاز ليكون ملائماً للهواتف ومنع تداخل الإيماءات
  const defaultHeight = isMobile ? 130 : 160
  const maxDrag = isMobile ? 100 : 150
  const cordHeight = useTransform(y, [0, maxDrag], [defaultHeight, defaultHeight + 100])

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
    const calcScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0
      const totalHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      )
      const docHeight = totalHeight - window.innerHeight
      if (docHeight > 0) {
        setScrollPercent(Math.min(1, Math.max(0, scrollTop / docHeight)))
      } else {
        setScrollPercent(0)
      }

      if (scrollTop > 40) {
        setIsScrollActivated(true)
        if (!hasPlayedSwitchSound) {
          playClickSound(true)
          setHasPlayedSwitchSound(true)
        }
      } else {
        setIsScrollActivated(false)
        setHasPlayedSwitchSound(false)
      }
    }

    window.addEventListener('scroll', calcScroll, { passive: true })
    window.addEventListener('resize', calcScroll)
    window.addEventListener('load', calcScroll)

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => calcScroll())
      ro.observe(document.body)
    }

    calcScroll()

    return () => {
      window.removeEventListener('scroll', calcScroll)
      window.removeEventListener('resize', calcScroll)
      window.removeEventListener('load', calcScroll)
      if (ro) ro.disconnect()
    }
  }, [hasPlayedSwitchSound])

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

    const threshold = isMobile ? 50 : 90
    if (currentY >= threshold) {
      const isLight = document.documentElement.classList.contains('light')
      playClickSound(!isLight)
      toggleThemeGlobal()
    }

    document.documentElement.style.setProperty('--pull-dim-opacity', '0')
  }

  return (
    <div className="relative min-h-screen text-white">
      {/* الخلفية الزرقاء الملكية الفاخرة (Deep Luxury Blue Background) */}
      <div className="fixed inset-0 -z-50 w-full h-full bg-[#0a192f] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#0d2342] to-[#071325]"></div>
        <div className="absolute inset-0 bg-animated-grid opacity-[0.06]"></div>
      </div>

      {/* 2. حبل السحب العائم التفاعلي لتعديل وتعتيم الضوء وسحب المفتاح */}
      <div className="fixed top-0 left-16 md:left-[70px] z-[2000] flex flex-col items-center pointer-events-none select-none">
        <motion.div 
          className="w-[1px] md:w-[2px] bg-gradient-to-b from-[#111] via-[#444] to-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.3)]"
          style={{ height: cordHeight }}
        />
        <motion.div 
          drag="y"
          dragConstraints={{ top: 0, bottom: maxDrag }}
          dragElastic={isMobile ? 0.5 : 0.25}
          style={{ y, touchAction: 'none' }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto -mt-5"
          title={isAr ? 'اسحب لتغيير وضع الإضاءة' : 'Pull to change lighting mode'}
        >
          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 border-[1.5px] border-white shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_12px_rgba(245,158,11,0.8)] flex items-center justify-center transition-shadow duration-300">
            <div className="w-[4px] h-[4px] bg-white rounded-full opacity-90" />
          </div>
        </motion.div>

        {/* مؤشر الإرشاد العائم */}
        <div className={`absolute top-full mt-3 text-[9px] md:text-[10px] font-black tracking-tight px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border transition-all duration-300 whitespace-nowrap shadow-md pointer-events-none ${
          theme === 'light'
            ? 'bg-white/90 text-slate-800 border-slate-200/50 shadow-slate-200/20'
            : 'bg-slate-900/90 text-blue-400 border-white/10 shadow-black/40'
        }`}>
          {isDragging 
            ? (isAr ? 'اترك الحبل الآن...' : 'Release now...') 
            : (isAr ? 'اسحب الإنارة لتغيير وضع الإضاءة 💡' : 'Pull light to change mode 💡')}
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
