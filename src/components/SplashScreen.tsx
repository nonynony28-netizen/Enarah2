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
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="splash-screen-container fixed inset-0 bg-black flex flex-col items-center justify-start overflow-hidden z-[9999] pt-0 select-none transform-gpu will-change-opacity"
      style={{ backgroundColor: '#000000' }}
    >

      {/* 1. هيكل الثريا المودرن المعلقة: ينزل بانسيابية هادئة وفخمة كقطعة ديكور فاخرة */}
      <div
        className="relative flex flex-col items-center z-30 pointer-events-none transform-gpu"
        style={{ 
          animation: 'splashLampDropSmooth 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          willChange: 'transform, opacity'
        }}
      >
        {/* قاعدة التثبيت السقفية مع حلقة ميتاليك نحاسية أنيقة */}
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-3.5 md:w-14 md:h-4 bg-gradient-to-b from-[#18181b] to-[#09090b] rounded-b-xl border-b border-[#27272a] shadow-lg" />
          <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        </div>
        
        {/* سلك التعليق النحيف المشدود */}
        <div className="w-[1.5px] h-[95px] md:h-[135px] bg-gradient-to-b from-[#52525b] via-[#3f3f46] to-[#27272a]" />
        
        {/* جسم المصباح وقبته المعمارية الحديثة */}
        <div className="relative flex flex-col items-center">
          <svg 
            className="w-[62px] h-[42px] md:w-[76px] md:h-[50px] filter drop-shadow-md" 
            viewBox="0 0 64 42" fill="none"
          >
            {/* طوق التثبيت النحاسي الفاخر */}
            <rect x="27" y="0" width="10" height="5" rx="1.5" fill="#d97706" />
            <rect x="25" y="5" width="14" height="4" rx="1" fill="#2563eb" />
            
            {/* قبة المصباح النورديك السوداء الأنيقة */}
            <path 
              d="M6 34C6 17 18 8 32 8C46 8 58 17 58 34H6Z" 
              fill="#18181b" 
              stroke="#27272a" 
              strokeWidth="1.5" 
            />
            
            {/* الحافة السفلية المشطوبة بتوهج أزرق ملكي */}
            <ellipse cx="32" cy="34" rx="26" ry="4" fill="#1e3a8a" fillOpacity="0.9" />
          </svg>

          {/* اللمبة المتوهجة الفاخرة: تشتعل بنعومة وسلاسة مع فتيل ضوئي */}
          <div 
            className="absolute bottom-[-9px] md:bottom-[-11px] w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-b from-white via-sky-200 to-blue-500 border border-sky-300"
            style={{ 
              animation: 'splashBulbIgnite 0.4s ease-out 0.72s forwards',
              opacity: 0,
              boxShadow: '0 0 15px #60a5fa, 0 0 35px #2563eb, 0 0 60px rgba(37, 99, 235, 0.6)'
            }}
          >
            {/* الفتيل المضيء الدقيق داخل اللمبة */}
            <div className="absolute inset-1.5 rounded-full bg-white opacity-80 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. مخروط النور المخملي الناعم: يسلط إضاءته من المصباح مباشرة نحو الشعار بدون أي حواف حادة أو تكسير */}
      <div
        className="absolute top-[132px] md:top-[178px] left-0 right-0 mx-auto w-[360px] md:w-[620px] h-[320px] md:h-[420px] pointer-events-none z-10 overflow-visible transform-gpu"
        style={{ 
          animation: 'splashBeamFadeIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.82s forwards',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 620 420" preserveAspectRatio="none">
          <defs>
            {/* تدرج ضوئي انسيابي فائق النعومة متلاشي الأطراف */}
            <linearGradient id="lampBeamGradVelvet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.85} />
              <stop offset="18%" stopColor="#60a5fa" stopOpacity={0.55} />
              <stop offset="45%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="75%" stopColor="#2563eb" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.02} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
            </linearGradient>
            
            {/* فلتر تنعيم الحواف للتخلص تماماً من أي تسنن أو تكسير في الخطوط */}
            <filter id="smoothEdges" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          
          <polygon 
            points="292,0 328,0 590,420 30,420" 
            fill="url(#lampBeamGradVelvet)" 
            filter="url(#smoothEdges)"
          />
        </svg>
      </div>

      {/* 3. بركة النور الهادئة تحت الشعار مباشرة لتأكيد عمق المشهد */}
      <div
        className="absolute top-[270px] md:top-[350px] left-0 right-0 mx-auto w-[320px] md:w-[540px] h-[140px] md:h-[200px] rounded-full pointer-events-none z-10 transform-gpu"
        style={{
          animation: 'splashBeamFadeIn 0.75s ease-out 0.95s forwards',
          opacity: 0,
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.28) 0%, rgba(37, 99, 235, 0.08) 50%, transparent 75%)'
        }}
      />

      {/* 4. اسم "الإنارة الحديثة" والعبارة الترحيبية: يتجليان بوضوح وفخامة في قلب بؤرة النور */}
      <div 
        className="absolute top-[260px] md:top-[340px] left-0 right-0 mx-auto flex flex-col items-center z-20 w-full text-center px-4 pointer-events-none transform-gpu"
        style={{ 
          animation: 'splashTextRevealSmooth 0.75s cubic-bezier(0.16, 1, 0.3, 1) 1.05s forwards',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      >
        <div className="flex flex-col items-center">
          {/* اسم الإنارة الحديثة بخط عربي فخم وتدرج أزرق ملكي متوهج */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-wide font-cairo"
          >
            {isAr ? 'الإنارة الحديثة' : 'ENARAH MODERN'}
          </h1>

          {/* خط الفاصل المتألق المنبثق من المنتصف */}
          <div 
            className="h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent mt-3.5 md:mt-4.5 shadow-[0_0_15px_#38bdf8] transform-gpu" 
            style={{ 
              animation: 'splashDividerExpandSmooth 0.65s cubic-bezier(0.16, 1, 0.3, 1) 1.35s forwards',
              opacity: 0,
              width: 0 
            }}
          />

          {/* الجملة الترحيبية: نضيء عالمك بأناقة الحروف المتباعدة */}
          <p
            className="text-base sm:text-lg md:text-2xl font-bold tracking-[0.25em] font-cairo mt-3.5 md:mt-4.5 transform-gpu"
            style={{ 
              animation: 'splashSloganRevealSmooth 0.6s ease-out 1.5s forwards',
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
