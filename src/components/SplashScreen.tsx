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
        scale: 1.02,
        filter: "blur(8px)",
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="splash-screen-container fixed inset-0 bg-[#060811] flex flex-col items-center justify-start overflow-hidden z-[9999] pt-0 select-none transform-gpu"
    >
      
      {/* 0. هالة الإضاءة المحيطية التي تنبثق في الغرفة المظلمة بمجرد تشغيل اللمبة */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 22%, rgba(37, 99, 235, 0.22) 0%, rgba(15, 23, 42, 0.3) 45%, transparent 75%)'
        }}
      />

      {/* 1. هيكل المصباح يتهادى بنعومة فائقة من أعلى السقف في الظلام */}
      <motion.div
        initial={{ y: -190, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center z-30 pointer-events-none"
      >
        {/* قاعدة التثبيت في السقف */}
        <div className="w-9 h-3 md:w-11 md:h-3.5 bg-zinc-800 rounded-b-lg border-b border-zinc-700 shadow-md" />
        
        {/* سلك التعليق النحيف */}
        <div className="w-[2px] h-[90px] md:h-[135px] bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-900 shadow-sm" />
        
        {/* جسم المصباح وقبته الأنيقة */}
        <div className="relative flex flex-col items-center">
          <svg 
            className="w-[56px] h-[38px] md:w-[68px] md:h-[44px]" 
            viewBox="0 0 64 42" fill="none"
          >
            <rect x="28" y="0" width="8" height="5" rx="1.5" fill="#475569" />
            <path d="M22 5H42V10H22V5Z" fill="#2563eb" />
            <path d="M8 34C8 19 18 10 32 10C46 10 56 19 56 34H8Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <ellipse cx="32" cy="34" rx="24" ry="4" fill="#1d4ed8" fillOpacity="0.85" />
          </svg>

          {/* اللمبة الذكية: تبدأ مظلمة ومطفأة، ثم تشتعل وتتوهج ببريق أزرق ساطع */}
          <motion.div 
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: [
                "0 0 0px rgba(59, 130, 246, 0)",
                "0 0 30px #38bdf8, 0 0 60px #2563eb, 0 0 90px #1d4ed8",
                "0 0 25px #38bdf8, 0 0 50px #2563eb, 0 0 80px #1d4ed8"
              ]
            }}
            transition={{ 
              duration: 0.5, 
              delay: 0.45, 
              ease: "easeOut",
              boxShadow: { duration: 0.5, delay: 0.45 }
            }}
            className="absolute bottom-[-8px] md:bottom-[-10px] w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-b from-white via-cyan-300 to-blue-500 border border-blue-300"
          />

          {/* وميض الهالة المتوهجة حول اللمبة */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.9, 0.6], scale: [0.6, 1.25, 1.1] }}
            transition={{ duration: 0.7, delay: 0.46, ease: "easeOut" }}
            className="absolute bottom-[-14px] md:bottom-[-16px] w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-400/30 blur-md pointer-events-none"
          />
        </div>
      </motion.div>

      {/* 2. مخروط الضوء: ينطلق من اللمبة للأسفل لينير الظلام باتجاه الشعار */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[128px] md:top-[176px] left-0 right-0 mx-auto w-[340px] md:w-[560px] h-[300px] md:h-[400px] pointer-events-none origin-top z-10 overflow-visible"
      >
        <svg width="100%" height="100%" viewBox="0 0 560 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lampBeamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.7} />
              <stop offset="20%" stopColor="#3b82f6" stopOpacity={0.45} />
              <stop offset="55%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="85%" stopColor="#1d4ed8" stopOpacity={0.06} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon points="262,0 298,0 520,400 40,400" fill="url(#lampBeamGrad)" />
        </svg>
      </motion.div>

      {/* 3. بركة النور المتوهجة على منطقة النص (Spotlight Pool) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.55, ease: "easeOut" }}
        className="absolute top-[250px] md:top-[330px] left-0 right-0 mx-auto w-[320px] md:w-[520px] h-[160px] md:h-[220px] rounded-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.32) 0%, rgba(37, 99, 235, 0.12) 50%, transparent 75%)',
          filter: 'blur(25px)'
        }}
      />

      {/* 4. اسم "الإنارة الحديثة" والشعار: يشتعل بالنور الأزرق الملكي فور وصول الضوء إليه */}
      <div className="absolute top-[260px] md:top-[340px] left-0 right-0 mx-auto flex flex-col items-center z-20 w-full text-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 22, filter: "blur(10px)", scale: 0.96 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.7, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* اسم الإنارة الحديثة مشع ومتوهج بالكامل */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-wider font-cairo text-blue-500 drop-shadow-[0_0_35px_rgba(59,130,246,0.95)] drop-shadow-[0_0_70px_rgba(37,99,235,0.7)]"
          >
            {isAr ? 'الإنارة الحديثة' : 'ENARAH MODERN'}
          </h1>

          {/* خط الفاصل المتوهج المتمدد مع انتشار الضوء */}
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isAr ? 200 : 250, opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.78, ease: "easeOut" }}
            className="h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent mt-3 md:mt-4 shadow-[0_0_15px_#38bdf8]" 
          />

          {/* الجملة الترحيبية: نضيء عالمك */}
          <motion.p
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.92, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-2xl font-bold tracking-[0.25em] font-cairo mt-4 md:mt-5 text-slate-200 drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
          >
            {isAr ? 'نضيء عالمك' : 'Lighting Your World'}
          </motion.p>
        </motion.div>
      </div>

    </motion.div>
  );
}
