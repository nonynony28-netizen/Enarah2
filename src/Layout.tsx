import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLanguage } from "./hooks/useLanguage";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function Layout() {
  const { isAr } = useLanguage()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [isDragging, setIsDragging] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)

  const y = useMotionValue(0)
  const cordHeight = useTransform(y, [0, 150], [120, 270])

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
      const opacity = Math.min(0.7, (latest / 150) * 0.7)
      document.documentElement.style.setProperty('--pull-dim-opacity', String(opacity))
    })
  }, [y])

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
    
    if (currentY >= 90) {
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

      {/* 1. عمود النور النيوني الأيسر الممتد للتفاعل مع التمرير */}
      <div className="hidden lg:block fixed top-0 left-[35px] w-[5px] h-full bg-white/[0.02] border-l border-white/[0.04] border-r border-white/[0.04] z-50 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-blue-500 via-sky-400 to-transparent shadow-[0_0_12px_rgba(59,130,246,0.8),0_0_24px_rgba(59,130,246,0.4)]"
          style={{ height: `${scrollPercent * 100}%` }}
        />
      </div>

      {/* بقعة الضوء النيونية العائمة التي تتبع موقع التمرير */}
      <div 
        className="hidden lg:block fixed left-[38px] w-[350px] h-[350px] rounded-full bg-radial-spotlight pointer-events-none z-40 transition-opacity duration-300"
        style={{ 
          top: `${window.innerHeight * 0.15 + (scrollPercent * (window.innerHeight * 0.7))}px`,
          transform: 'translate(-50%, -50%)',
          opacity: theme === 'dark' ? 0.8 : 0.2
        }}
      />

      {/* 2. حبل السحب العائم التفاعلي لتعديل وتعتيم الضوء وسحب المفتاح */}
      <div className="hidden lg:flex fixed top-0 left-[70px] z-[2000] flex-col items-center pointer-events-none select-none">
        <motion.div 
          className="w-[2px] bg-gradient-to-b from-[#111] via-[#444] to-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.3)]"
          style={{ height: cordHeight }}
        />
        <motion.div 
          drag="y"
          dragConstraints={{ top: 0, bottom: 150 }}
          dragElastic={0.15}
          style={{ y }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 border-2 border-white cursor-grab active:cursor-grabbing pointer-events-auto shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_12px_rgba(245,158,11,0.8)] flex items-center justify-center transition-shadow duration-300"
        >
          <div className="w-[6px] h-[6px] bg-white rounded-full opacity-90" />
        </motion.div>

        {/* مؤشر الإرشاد العائم */}
        <div className={`absolute top-full mt-4 text-[10px] font-black tracking-tight px-3 py-1.5 rounded-full border transition-all duration-300 whitespace-nowrap shadow-md pointer-events-none ${
          theme === 'light'
            ? 'bg-white/90 text-slate-800 border-slate-200/50 shadow-slate-200/20'
            : 'bg-slate-900/90 text-blue-400 border-white/10 shadow-black/40'
        }`}>
          {isDragging 
            ? (isAr ? 'شد الحبل للتعتيم والتبديل...' : 'Pull cord to dim & switch...') 
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
