import { motion } from "framer-motion";
import { useLanguage } from "../hooks/useLanguage";

export default function SplashScreen() {
  const { isAr } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.02,
        filter: "blur(10px)",
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 bg-[#02050c] flex flex-col items-center justify-start overflow-hidden z-[9999] pt-0 select-none transform-gpu"
    >
      
      {/* 1. هيكل المصباح يتهادى بنعومة فائقة وسلسة من الأعلى */}
      <motion.div
        initial={{ y: -180, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center z-20 pointer-events-none"
      >
        {/* قاعدة التثبيت في السقف */}
        <div className="w-8 h-3 md:w-10 md:h-3.5 bg-slate-800 rounded-b-lg border-b border-slate-700 shadow-md" />
        
        {/* سلك التعليق النحيف */}
        <div className="w-[1.5px] h-[100px] md:h-[150px] bg-slate-600 shadow-[0_0_5px_rgba(59,130,246,0.2)]" />
        
        {/* جسم المصباح */}
        <div className="relative flex flex-col items-center">
          <svg 
            className="w-[54px] h-[36px] md:w-[64px] md:h-[42px]" 
            viewBox="0 0 64 42" fill="none"
          >
            <rect x="28" y="0" width="8" height="5" rx="1.5" fill="#475569" />
            <path d="M22 5H42V10H22V5Z" fill="#3b82f6" />
            <path d="M8 34C8 20 18 10 32 10C46 10 56 20 56 34H8Z" fill="#111827" stroke="#374151" strokeWidth="2" />
            <ellipse cx="32" cy="34" rx="24" ry="4" fill="#3b82f6" fillOpacity="0.85" />
          </svg>

          {/* اللمبة المتوهجة تتوهج تدريجياً بأسلوب سينمائي */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="absolute bottom-[-8px] md:bottom-[-10px] w-5 h-5 md:w-6 md:h-6 rounded-full bg-sky-100 border border-sky-300"
            style={{
              boxShadow: "0 0 20px #3b82f6, 0 0 40px #3b82f6"
            }}
          />
        </div>
      </motion.div>

      {/* 2. مخروط الضوء الأزرق يتوسع وينشر الضوء بنعومة بالغة */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.8 }}
        animate={{ opacity: 0.85, scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[136px] md:top-[190px] left-0 right-0 mx-auto w-[320px] md:w-[500px] h-[240px] md:h-[320px] pointer-events-none mix-blend-screen origin-top z-10 overflow-visible"
      >
        <svg width="100%" height="100%" viewBox="0 0 500 340" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lampBeamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity={0.85} />
              <stop offset="30%" stopColor="#3b82f6" stopOpacity={0.5} />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon points="234,0 266,0 450,340 50,340" fill="url(#lampBeamGrad)" />
        </svg>
      </motion.div>

      {/* 3. الشعار يظهر بارتقاء سينمائي متألق مع لمعة ساطعة عابرة باللون الأزرق المضيء */}
      <div className="absolute top-[270px] md:top-[350px] left-0 right-0 mx-auto flex flex-col items-center z-20 w-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* اسم الشعار بالأزرق الفاتح مع لمعة صغيرة أنيقة */}
          <div className="relative overflow-hidden inline-block px-4 py-2">
            <h1
              className="text-4xl md:text-7xl font-black tracking-widest font-cairo"
              style={{
                color: "#7dd3fc",
                textShadow: "0 0 25px rgba(125,211,252,0.85), 0 0 50px rgba(56,189,248,0.5)"
              }}
            >
              {isAr ? 'الإنارة الحديثة' : 'ENARAHMODERN'}
            </h1>

            {/* اللمعة الضوئية الصغيرة النحيفة العابرة بأسلوب أنيق */}
            <motion.div
              initial={{ x: "-150%" }}
              animate={{ x: "450%" }}
              transition={{ delay: 0.8, duration: 1.0, ease: "easeInOut" }}
              className="absolute inset-y-0 w-12 md:w-16 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg] pointer-events-none mix-blend-overlay"
            />
          </div>

          {/* خط الفاصل المتوهج بالأزرق الفاتح */}
          <div className="h-0.5 w-[140px] md:w-[200px] bg-gradient-to-r from-transparent via-[#7dd3fc] to-transparent mt-3 md:mt-4 opacity-90 shadow-[0_0_15px_#7dd3fc]" />

          {/* الجملة الترحيبية بالأزرق الفاتح */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
            className="text-base md:text-xl font-bold tracking-widest uppercase font-cairo mt-4 md:mt-5 text-[#7dd3fc] drop-shadow-[0_0_15px_rgba(125,211,252,0.8)]"
          >
            {isAr ? '✨ نضيء عالمك ✨' : '✨ Lighting Your World ✨'}
          </motion.p>
        </motion.div>
      </div>

    </motion.div>
  );
}
