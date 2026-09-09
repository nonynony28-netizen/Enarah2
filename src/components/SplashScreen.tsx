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
        filter: "blur(10px)",
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="splash-screen-container fixed inset-0 bg-white flex flex-col items-center justify-start overflow-hidden z-[9999] pt-0 select-none transform-gpu"
    >
      
      {/* 1. هيكل المصباح يتهادى بنعومة فائقة وسلسة من الأعلى */}
      <motion.div
        initial={{ y: -180, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center z-20 pointer-events-none"
      >
        {/* قاعدة التثبيت في السقف */}
        <div className="w-8 h-3 md:w-10 md:h-3.5 bg-slate-300 rounded-b-lg border-b border-slate-400 shadow-sm" />
        
        {/* سلك التعليق النحيف */}
        <div className="w-[1.5px] h-[100px] md:h-[150px] bg-slate-400 shadow-sm" />
        
        {/* جسم المصباح */}
        <div className="relative flex flex-col items-center">
          <svg 
            className="w-[54px] h-[36px] md:w-[64px] md:h-[42px]" 
            viewBox="0 0 64 42" fill="none"
          >
            <rect x="28" y="0" width="8" height="5" rx="1.5" fill="#64748b" />
            <path d="M22 5H42V10H22V5Z" fill="#2563eb" />
            <path d="M8 34C8 20 18 10 32 10C46 10 56 20 56 34H8Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <ellipse cx="32" cy="34" rx="24" ry="4" fill="#2563eb" fillOpacity="0.9" />
          </svg>

          {/* اللمبة المتوهجة تتوهج تدريجياً بأسلوب سينمائي */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="absolute bottom-[-8px] md:bottom-[-10px] w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500 border border-blue-400 shadow-[0_0_20px_#2563eb]"
          />
        </div>
      </motion.div>

      {/* 2. مخروط الضوء الأزرق يتوسع وينشر الضوء بنعومة بالغة */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.8 }}
        animate={{ opacity: 0.65, scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[136px] md:top-[190px] left-0 right-0 mx-auto w-[320px] md:w-[500px] h-[240px] md:h-[320px] pointer-events-none origin-top z-10 overflow-visible"
      >
        <svg width="100%" height="100%" viewBox="0 0 500 340" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lampBeamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
              <stop offset="30%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="70%" stopColor="#2563eb" stopOpacity={0.06} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon points="234,0 266,0 450,340 50,340" fill="url(#lampBeamGrad)" />
        </svg>
      </motion.div>

      {/* 3. الشعار يظهر بارتقاء متألق باللون الأزرق الملكي */}
      <div className="absolute top-[270px] md:top-[350px] left-0 right-0 mx-auto flex flex-col items-center z-20 w-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <h1
            className="text-4xl md:text-7xl font-black tracking-widest font-cairo text-blue-600 drop-shadow-sm"
          >
            {isAr ? 'الإنارة الحديثة' : 'ENARAHMODERN'}
          </h1>

          {/* خط الفاصل المتوهج باللون الأزرق */}
          <div className="h-0.5 w-[140px] md:w-[220px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-3 md:mt-4 opacity-80" />

          {/* الجملة الترحيبية */}
          <motion.p
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.95, ease: "easeOut" }}
            className="text-lg md:text-2xl font-extrabold tracking-[0.25em] uppercase font-cairo mt-5 md:mt-6 text-slate-700"
          >
            {isAr ? 'نضيء عالمك' : 'Lighting Your World'}
          </motion.p>
        </motion.div>
      </div>

    </motion.div>
  );
}
