import { motion } from "framer-motion";

export default function SplashScreen() {
  // متغيرات حركة إضاءة اللمبة (إضاءة واحدة ناعمة ومتصلة)
  const bulbVariants = {
    off: { opacity: 0 },
    on: {
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 1.1,
        ease: "easeOut"
      }
    }
  };

  // حركة مخروط الضوء الأزرق المتوهج (تلاشي وظهور واحد سلس)
  const beamVariants = {
    off: { opacity: 0, scaleY: 0.85 },
    on: {
      opacity: 0.95,
      scaleY: 1,
      transition: {
        duration: 0.7,
        delay: 1.1,
        ease: "easeOut"
      }
    }
  };

  // حركة ظهور وتوهج الشعار باللون الأزرق الكامل (يظهر بعد تسليط الضوء بـ 0.2 ثانية)
  const textVariants = {
    off: { opacity: 0, scale: 0.96, filter: "drop-shadow(0 0 0px rgba(59,130,246,0))" },
    on: {
      opacity: 1,
      scale: 1,
      filter: "drop-shadow(0 0 25px rgba(59,130,246,0.85))",
      transition: {
        duration: 0.8,
        delay: 1.3, // يبدأ الظهور بعد تسليط الضوء مباشرة
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#02050c] flex flex-col items-center justify-start overflow-hidden z-[9999] pt-0">
      
      {/* 1. هيكل المصباح المتدلي والفتيل الهابط من السقف */}
      <motion.div
        initial={{ y: -350 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 95, damping: 16, delay: 0.1 }}
        className="relative flex flex-col items-center z-20 pointer-events-none"
      >
        {/* قاعدة التثبيت في السقف (البورتو) */}
        <div className="w-10 h-3.5 bg-slate-800 rounded-b-lg border-b border-slate-700 shadow-md" />
        
        {/* سلك التعليق النحيف */}
        <div className="w-[1.5px] h-[180px] bg-slate-600 shadow-[0_0_5px_rgba(59,130,246,0.2)]" />
        
        {/* جسم المصباح العصري */}
        <div className="relative flex flex-col items-center">
          <svg width="64" height="42" viewBox="0 0 64 42" fill="none" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            {/* حلقة التثبيت العلوية */}
            <rect x="28" y="0" width="8" height="5" rx="1.5" fill="#475569" />
            {/* قبعة المصباح */}
            <path d="M22 5H42V10H22V5Z" fill="#3b82f6" />
            {/* المظلة أو الغطاء القبة الرئيسي */}
            <path d="M8 34C8 20 18 10 32 10C46 10 56 20 56 34H8Z" fill="#111827" stroke="#374151" strokeWidth="2" />
            {/* حافة الزينة السفلية باللون الأزرق */}
            <ellipse cx="32" cy="34" rx="24" ry="4" fill="#3b82f6" fillOpacity="0.75" />
          </svg>

          {/* اللمبة المتوهجة الفعالة باللون الأزرق */}
          <motion.div 
            variants={bulbVariants}
            initial="off"
            animate="on"
            className="absolute bottom-[-10px] w-6 h-6 rounded-full bg-sky-100 border border-sky-300"
            style={{
              boxShadow: "0 0 20px #3b82f6, 0 0 40px #3b82f6, inset 0 0 8px #ffffff"
            }}
          />
        </div>
      </motion.div>

      {/* 2. مخروط الضوء الأزرق المتوهج (Volumetric SVG Light Beam) */}
      {/* تم استخدام left-0 right-0 mx-auto لضمان المحاذاة التامة أسفل المصباح في جميع اللغات والاتجاهات */}
      <motion.div
        variants={beamVariants}
        initial="off"
        animate="on"
        className="absolute top-[220px] left-0 right-0 mx-auto w-[500px] h-[340px] pointer-events-none mix-blend-screen origin-top z-10 overflow-visible"
      >
        <svg width="100%" height="100%" viewBox="0 0 500 340" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lampBeamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity={0.9} />
              <stop offset="25%" stopColor="#3b82f6" stopOpacity={0.55} />
              <stop offset="65%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* مضلع الإسقاط العريض للضوء */}
          <polygon points="234,0 266,0 450,340 50,340" fill="url(#lampBeamGrad)" />
        </svg>
      </motion.div>

      {/* 3. الشعار الترحيبي المضاء باللمبة والجملة الترحيبية المنسقة */}
      {/* تم استخدام left-0 right-0 mx-auto لضمان التوسط المثالي */}
      <div className="absolute top-[380px] left-0 right-0 mx-auto flex flex-col items-center z-20 w-full select-none text-center">
        <motion.div
          variants={textVariants}
          initial="off"
          animate="on"
          className="flex flex-col items-center"
        >
          {/* اسم الشعار أزرق بالكامل ويتوهج بلون الهوية */}
          <h1
            className="text-5xl md:text-7xl font-black tracking-widest font-cairo text-blue-500 select-none"
            style={{
              textShadow: "0 0 20px rgba(59,130,246,0.85)"
            }}
          >
            الإنارة الحديثة
          </h1>

          {/* خط الفاصل المتوهج المتناسق باللون الأزرق */}
          <div className="h-0.5 w-[180px] bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent mt-4 opacity-80" />

          {/* الجملة الصغيرة بالأسفل (نضيء عالمك) منسقة بشكل ممتاز وليس لاصقة بالاسم */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.8 }}
            className="text-sky-300 text-base md:text-lg font-bold tracking-widest uppercase font-cairo mt-6"
            style={{
              textShadow: "0 0 10px rgba(56,189,248,0.5)"
            }}
          >
            نضيء عالمك
          </motion.p>
        </motion.div>
      </div>

    </div>
  );
}
