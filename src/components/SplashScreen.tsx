import { motion } from "framer-motion";

export default function SplashScreen() {
  // متغيرات حركة وميض تشغيل المصباح (Realistic Flicker Turn-On sequence)
  const bulbVariants = {
    off: { opacity: 0 },
    on: {
      opacity: [0, 1, 0.2, 1, 0, 1, 1],
      transition: {
        duration: 0.7,
        delay: 1.2,
        times: [0, 0.1, 0.2, 0.4, 0.5, 0.7, 1],
        ease: "linear"
      }
    }
  };

  // حركة مخروط الضوء المتوهج المنبثق من المصباح
  const beamVariants = {
    off: { opacity: 0, scaleY: 0.8 },
    on: {
      opacity: [0, 0.7, 0.15, 0.85, 0, 0.9, 0.9],
      scaleY: 1,
      transition: {
        duration: 0.7,
        delay: 1.2,
        times: [0, 0.1, 0.2, 0.4, 0.5, 0.7, 1],
        ease: "linear"
      }
    }
  };

  // حركة وميض الشعار وتوهجه بالتزامن مع تشغيل المصباح
  const textVariants = {
    off: { opacity: 0.05, filter: "drop-shadow(0 0 0px rgba(251,191,36,0))" },
    on: {
      opacity: [0.05, 0.9, 0.2, 0.95, 0.1, 1, 1],
      filter: [
        "drop-shadow(0 0 0px rgba(251,191,36,0))",
        "drop-shadow(0 0 10px rgba(251,191,36,0.4))",
        "drop-shadow(0 0 1px rgba(251,191,36,0.1))",
        "drop-shadow(0 0 15px rgba(251,191,36,0.6))",
        "drop-shadow(0 0 0px rgba(251,191,36,0))",
        "drop-shadow(0 0 25px rgba(251,191,36,0.8))",
        "drop-shadow(0 0 25px rgba(251,191,36,0.8))"
      ],
      transition: {
        duration: 0.7,
        delay: 1.2,
        times: [0, 0.1, 0.2, 0.4, 0.5, 0.7, 1],
        ease: "linear"
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#02050c] flex flex-col items-center justify-start overflow-hidden z-[9999] pt-0">
      
      {/* 1. هيكل المصباح المتدلي والفتيل الهابط من السقف (Spring drop from ceiling) */}
      <motion.div
        initial={{ y: -350 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.1 }}
        className="relative flex flex-col items-center z-20 pointer-events-none"
      >
        {/* قاعدة التثبيت في السقف (البورتو) */}
        <div className="w-10 h-3.5 bg-slate-800 rounded-b-lg border-b border-slate-700 shadow-md" />
        
        {/* سلك التعليق النحيف */}
        <div className="w-[1.5px] h-[190px] bg-slate-600 shadow-[0_0_5px_rgba(251,191,36,0.15)]" />
        
        {/* جسم المصباح العصري */}
        <div className="relative flex flex-col items-center">
          <svg width="64" height="42" viewBox="0 0 64 42" fill="none" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            {/* حلقة التثبيت العلوية */}
            <rect x="28" y="0" width="8" height="5" rx="1.5" fill="#475569" />
            {/* قبعة المصباح النحاسية */}
            <path d="M22 5H42V10H22V5Z" fill="#d97706" />
            {/* المظلة أو الغطاء القبة الرئيسي */}
            <path d="M8 34C8 20 18 10 32 10C46 10 56 20 56 34H8Z" fill="#111827" stroke="#374151" strokeWidth="2" />
            {/* حافة الزينة النحاسية السفلية */}
            <ellipse cx="32" cy="34" rx="24" ry="4" fill="#fbbf24" fillOpacity="0.75" />
          </svg>

          {/* اللمبة المتوهجة الفعالة (Bulb Node) */}
          <motion.div 
            variants={bulbVariants}
            initial="off"
            animate="on"
            className="absolute bottom-[-10px] w-6 h-6 rounded-full bg-amber-100 border border-amber-300"
            style={{
              boxShadow: "0 0 20px #fbbf24, 0 0 40px #fbbf24, inset 0 0 8px #ffffff"
            }}
          />
        </div>
      </motion.div>

      {/* 2. مخروط الضوء الهندسي المتوهج (Volumetric SVG Light Beam) */}
      <motion.div
        variants={beamVariants}
        initial="off"
        animate="on"
        className="absolute top-[230px] left-1/2 -translate-x-1/2 w-[500px] h-[340px] pointer-events-none mix-blend-screen origin-top z-10 overflow-visible"
      >
        <svg width="100%" height="100%" viewBox="0 0 500 340" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lampBeamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity={0.85} />
              <stop offset="25%" stopColor="#fbbf24" stopOpacity={0.45} />
              <stop offset="65%" stopColor="#fbbf24" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* مضلع الإسقاط العريض للضوء */}
          <polygon points="234,0 266,0 450,340 50,340" fill="url(#lampBeamGrad)" />
        </svg>
      </motion.div>

      {/* 3. الشعار الترحيبي المضاء باللمبة */}
      <div className="absolute top-[430px] flex flex-col items-center gap-6 z-20 w-full select-none text-center">
        <motion.div
          variants={textVariants}
          initial="off"
          animate="on"
          className="flex flex-col items-center"
        >
          <h1
            className="text-5xl md:text-7xl font-black tracking-widest font-cairo text-white select-none"
            style={{
              WebkitTextStroke: "0.5px rgba(255,255,255,0.1)"
            }}
          >
            الإنارة الحديثة
          </h1>

          {/* خط الفاصل المتوهج المتناسق */}
          <div className="h-0.5 w-[200px] bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent mt-4 opacity-80" />
        </motion.div>
      </div>

      {/* 4. الجملة الصغيرة بالأسفل (نضيء عالمك) */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.8 }}
        className="absolute bottom-16 text-amber-200/50 text-base font-bold tracking-widest uppercase font-cairo"
      >
        نضيء عالمك
      </motion.p>

    </div>
  );
}
