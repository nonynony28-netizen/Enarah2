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
        transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } 
      }}
      className="splash-screen-container fixed inset-0 w-full h-full h-[100dvh] bg-black flex flex-col items-center justify-start overflow-hidden z-[99999] pt-0 select-none touch-none"
      style={{ backgroundColor: '#000000' }}
    >

      {/* 1. هيكل الثريا المودرن المعلقة: ينزل بسلاسة وخفة تامة دون أي اهتزاز أو فلاش في البداية */}
      <div
        className="relative flex flex-col items-center z-30 pointer-events-none transform-gpu"
        style={{ 
          animation: 'splashLampDropSmooth 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
          opacity: 0,
          transform: 'translate3d(0, -50px, 0)',
          willChange: 'transform, opacity'
        }}
      >
        {/* قاعدة التثبيت السقفية مع حلقة ميتاليك نحاسية أنيقة */}
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-3 md:w-14 md:h-3.5 bg-gradient-to-b from-[#1c1c20] to-[#0c0c0e] rounded-b-xl border-b border-[#2e2e34] shadow-md" />
          <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
        </div>
        
        {/* سلك التعليق النحيف المشدود */}
        <div className="w-[1.5px] h-[80px] sm:h-[105px] bg-gradient-to-b from-[#52525b] via-[#3f3f46] to-[#27272a]" />
        
        {/* جسم المصباح وقبته المعمارية الحديثة */}
        <div className="relative flex flex-col items-center">
          <svg 
            className="w-[58px] h-[38px] md:w-[72px] md:h-[48px] filter drop-shadow-md" 
            viewBox="0 0 64 42" 
            fill="none"
          >
            {/* طوق التثبيت النحاسي */}
            <rect x="27" y="0" width="10" height="5" rx="1.5" fill="#d97706" />
            <rect x="25" y="5" width="14" height="4" rx="1" fill="#2563eb" />
            
            {/* قبة المصباح النورديك السوداء الأنيقة */}
            <path 
              d="M6 34C6 17 18 8 32 8C46 8 58 17 58 34H6Z" 
              fill="#18181b" 
              stroke="#27272a" 
              strokeWidth="1.5" 
            />
            
            {/* الحافة السفلية المشطوبة بتوهج أزرق كحلي */}
            <ellipse cx="32" cy="34" rx="26" ry="4" fill="#1e3a8a" fillOpacity="0.9" />
          </svg>

          {/* اللمبة المتوهجة الفاخرة: تشتعل بنعومة وسلاسة مع فتيل ضوئي */}
          <div 
            className="absolute bottom-[-8px] md:bottom-[-10px] w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-b from-white via-sky-200 to-blue-500 border border-sky-300"
            style={{ 
              animation: 'splashBulbIgnite 0.3s ease-out 0.42s both',
              opacity: 0,
              transform: 'scale(0.7)',
              boxShadow: '0 0 16px #60a5fa, 0 0 35px #2563eb, 0 0 60px rgba(37, 99, 235, 0.5)'
            }}
          >
            {/* الفتيل المضيء الدقيق داخل اللمبة */}
            <div className="absolute inset-1.5 rounded-full bg-white opacity-80 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. مخروط النور السينمائي الانسيابي: معالج عتادياً بالكامل بتقنية CSS الخالصة لمنع أي تكسير أو خطوط حادة على الهواتف */}
      <div
        className="absolute top-[125px] sm:top-[148px] left-0 right-0 mx-auto pointer-events-none z-10 overflow-visible transform-gpu"
        style={{ 
          width: 'min(92vw, 520px)',
          height: '320px',
          animation: 'splashBeamFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both',
          opacity: 0,
          transform: 'translate3d(0, -4px, 0)',
          willChange: 'transform, opacity'
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(147, 197, 253, 0.65) 0%, rgba(59, 130, 246, 0.35) 28%, rgba(29, 78, 216, 0.12) 58%, transparent 85%)',
            clipPath: 'polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)',
            WebkitClipPath: 'polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 45%, rgba(0,0,0,0.5) 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 45%, rgba(0,0,0,0.5) 75%, transparent 100%)'
          }}
        />
      </div>

      {/* 3. بركة النور الناعمة تحت الشعار لتعميق المشهد */}
      <div
        className="absolute top-[235px] sm:top-[280px] left-0 right-0 mx-auto pointer-events-none z-10 transform-gpu rounded-full"
        style={{
          width: 'min(86vw, 460px)',
          height: '130px',
          animation: 'splashBeamFadeIn 0.55s ease-out 0.62s both',
          opacity: 0,
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.28) 0%, rgba(37, 99, 235, 0.08) 55%, transparent 75%)'
        }}
      />

      {/* 4. اسم "الإنارة الحديثة" والعبارة الترحيبية: وضوح فائق وسرعة استجابة عالية بدون تقطيع */}
      <div 
        className="absolute top-[230px] sm:top-[275px] left-0 right-0 mx-auto flex flex-col items-center z-20 w-full text-center px-4 pointer-events-none transform-gpu"
        style={{ 
          animation: 'splashTextRevealSmooth 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.72s both',
          opacity: 0,
          transform: 'translate3d(0, 10px, 0)',
          willChange: 'transform, opacity'
        }}
      >
        <div className="relative flex flex-col items-center">
          {/* هالة ضوئية متوهجة خلف النص تعطي عمقاً وفخامة دون التأثير على حدة الحروف أو استهلاك الـ GPU */}
          <div className="absolute inset-0 -z-10 blur-2xl opacity-45 bg-blue-500/25 rounded-full pointer-events-none" />

          {/* اسم الإنارة الحديثة بخط عربي فخم ونقي */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wide font-cairo">
            {isAr ? 'الإنارة الحديثة' : 'ENARAH MODERN'}
          </h1>

          {/* خط الفاصل المتألق المنبثق من المنتصف بحركة scaleX العتادية فائقة الخفة */}
          <div 
            className="w-40 sm:w-52 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent mt-3 sm:mt-4 shadow-[0_0_12px_#38bdf8] transform-gpu" 
            style={{ 
              animation: 'splashDividerExpandSmooth 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both',
              opacity: 0,
              transform: 'scaleX(0)',
              transformOrigin: 'center'
            }}
          />

          {/* الجملة الترحيبية: نضيء عالمك بأناقة الحروف المتباعدة */}
          <p
            className="text-sm sm:text-lg md:text-xl font-bold tracking-[0.2em] font-cairo mt-3 sm:mt-4 text-slate-100 transform-gpu"
            style={{ 
              animation: 'splashSloganRevealSmooth 0.45s ease-out 1.0s both',
              opacity: 0,
              transform: 'translate3d(0, 6px, 0)'
            }}
          >
            {isAr ? 'نضيء عالمك' : 'Lighting Your World'}
          </p>
        </div>
      </div>

    </motion.div>
  );
}
