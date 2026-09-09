import { motion } from "framer-motion";
import { useLanguage } from "../hooks/useLanguage";

export default function SplashScreen() {
  const { isAr } = useLanguage();

  return (
    <motion.div 
      id="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        transition: { duration: 0.35, ease: "easeOut" } 
      }}
      className="splash-screen-container fixed inset-0 bg-black flex flex-col items-center justify-start overflow-hidden z-[9999] pt-0 select-none will-change-opacity"
      style={{ backgroundColor: '#000000' }}
    >

      {/* 1. هيكل المصباح: نزول خاطف وسلس مسرع بالـ GPU بالكامل */}
      <div
        className="relative flex flex-col items-center z-30 pointer-events-none"
        style={{ animation: 'splashLampDrop 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        {/* قاعدة التثبيت في السقف */}
        <div className="w-9 h-3 md:w-11 md:h-3.5 bg-[#18181b] rounded-b-lg border-b border-[#27272a]" />
        
        {/* سلك التعليق */}
        <div className="w-[1.5px] h-[85px] md:h-[120px] bg-[#3f3f46]" />
        
        {/* جسم المصباح وقبته الأنيقة */}
        <div className="relative flex flex-col items-center">
          <svg 
            className="w-[56px] h-[38px] md:w-[68px] md:h-[44px]" 
            viewBox="0 0 64 42" fill="none"
          >
            <rect x="28" y="0" width="8" height="5" rx="1.5" fill="#52525b" />
            <path d="M22 5H42V10H22V5Z" fill="#2563eb" />
            <path d="M8 34C8 19 18 10 32 10C46 10 56 19 56 34H8Z" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
            <ellipse cx="32" cy="34" rx="24" ry="4" fill="#1d4ed8" fillOpacity="0.9" />
          </svg>

          {/* اللمبة الذكية: تشتعل فور استقرار المصباح بنقاء وبدون أي تأخير */}
          <div 
            className="absolute bottom-[-8px] md:bottom-[-10px] w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-b from-white via-cyan-200 to-blue-500 border border-blue-300"
            style={{ 
              animation: 'splashBulbOn 0.15s ease-out 0.28s forwards',
              opacity: 0,
              boxShadow: '0 0 20px #38bdf8, 0 0 45px #2563eb'
            }}
          />
        </div>
      </div>

      {/* 2. مخروط الضوء: ينبثق فوراً من اللمبة نحو الشعار */}
      <div
        className="absolute top-[125px] md:top-[160px] left-0 right-0 mx-auto w-[340px] md:w-[560px] h-[300px] md:h-[390px] pointer-events-none z-10 overflow-visible"
        style={{ 
          animation: 'splashBeamExpand 0.26s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
          opacity: 0,
          transformOrigin: 'top center' 
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 560 390" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lampBeamGradFast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.85} />
              <stop offset="25%" stopColor="#3b82f6" stopOpacity={0.5} />
              <stop offset="65%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="90%" stopColor="#1d4ed8" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon points="262,0 298,0 520,390 40,390" fill="url(#lampBeamGradFast)" />
        </svg>
      </div>

      {/* 3. اسم "الإنارة الحديثة" والشعار في بؤرة النور */}
      <div 
        className="absolute top-[255px] md:top-[330px] left-0 right-0 mx-auto flex flex-col items-center z-20 w-full text-center px-4 pointer-events-none"
        style={{ 
          animation: 'splashTextReveal 0.28s ease-out 0.35s forwards',
          opacity: 0 
        }}
      >
        <div className="flex flex-col items-center">
          {/* اسم الإنارة الحديثة */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-wider font-cairo text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]"
          >
            {isAr ? 'الإنارة الحديثة' : 'ENARAH MODERN'}
          </h1>

          {/* خط الفاصل المتوهج */}
          <div 
            className="h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent mt-3 md:mt-4 shadow-[0_0_12px_#38bdf8]" 
            style={{ 
              animation: 'splashDividerExpand 0.28s ease-out 0.42s forwards',
              opacity: 0,
              width: 0 
            }}
          />

          {/* الجملة الترحيبية: نضيء عالمك */}
          <p
            className="text-base sm:text-lg md:text-2xl font-bold tracking-[0.25em] font-cairo mt-3 md:mt-4 text-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
            style={{ 
              animation: 'splashSloganReveal 0.25s ease-out 0.46s forwards',
              opacity: 0 
            }}
          >
            {isAr ? 'نضيء عالمك' : 'Lighting Your World'}
          </p>
        </div>
      </div>

    </motion.div>
  );
}
