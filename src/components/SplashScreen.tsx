import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SplashScreen() {
  const [isWalking, setIsWalking] = useState(true);

  // إيقاف حركة المشي للمفاصل بعد وصول التميمة للمنتصف (1.6 ثانية)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWalking(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  // إحداثيات المشي والدخول من اليسار إلى المنتصف خلال 3 ثوانٍ
  const mascotX = [-280, -280, -210, -140, -70, 0, 0, 0, 0];
  const mascotY = [0, -18, 0, -18, 0, -18, 0, -6, 0, -6, 0];
  const mascotRotate = [0, -8, 8, -8, 8, -8, 0, 2, -2, 0];
  const mascotScaleY = [1, 0.92, 1.08, 0.92, 1.08, 0.92, 1, 0.97, 1.03, 1];
  const mascotScaleX = [1, 1.08, 0.92, 1.08, 0.92, 1.08, 1, 1.03, 0.97, 1];

  const shadowX = [-280, -280, -210, -140, -70, 0, 0, 0, 0];
  const shadowScale = [1, 0.6, 1, 0.6, 1, 0.6, 1, 0.85, 1, 0.85, 1];
  const shadowOpacity = [0.4, 0.2, 0.4, 0.2, 0.4, 0.2, 0.4, 0.25, 0.4, 0.25, 0.4];

  return (
    <div className="fixed inset-0 bg-[#050b14] flex flex-col items-center justify-center overflow-hidden z-[9999]">
      
      {/* هالة ضوئية خلفية خفيفة جداً زرقاء هادئة */}
      <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />

      <div className="flex flex-col items-center gap-4 relative z-10">
        
        {/* منطقة التميمة والظل الأرضي */}
        <div className="relative flex flex-col items-center pb-8">
          
          {/* التميمة الكرتونية المرسومة بالأكواد بالكامل مع حركة مشي حقيقية */}
          <motion.div
            animate={{ 
              x: mascotX,
              y: mascotY,
              rotate: mascotRotate,
              scaleY: mascotScaleY,
              scaleX: mascotScaleX
            }}
            transition={{ 
              duration: 3.0,
              ease: "easeInOut"
            }}
            className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center z-10"
            style={{ transformOrigin: "bottom center" }}
          >
            {/* رسم التميمة (اللمبة) بالـ SVG والمسارات لربط مفاصل اليدين والقدمين وحركة العين والفتيل برمجياً */}
            <svg viewBox="0 0 200 240" className="w-full h-full">
              <defs>
                {/* تدرج زجاجي لرأس اللمبة */}
                <radialGradient id="glassGrad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </radialGradient>
                
                {/* تدرج معدني لقاعدة المصباح */}
                <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="50%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                
                {/* تأثير توهج الفتيل الدماغي */}
                <filter id="glowFilament" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. الرجل اليسرى مع الحذاء الكرتوني */}
              <motion.g
                style={{ transformOrigin: "90px 200px" }}
                animate={isWalking ? {
                  rotate: [-20, 20, -20],
                  y: [0, -3, 0]
                } : {
                  rotate: 0,
                  y: 0
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* الساق */}
                <line x1="90" y1="190" x2="88" y2="218" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                {/* الحذاء الأبيض */}
                <path d="M 72 216 C 72 212, 92 212, 92 216 L 92 225 L 72 225 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="71" y="224" width="22" height="3" fill="#cbd5e1" rx="1.5" />
              </motion.g>

              {/* 2. الرجل اليمنى مع الحذاء الكرتوني */}
              <motion.g
                style={{ transformOrigin: "110px 200px" }}
                animate={isWalking ? {
                  rotate: [20, -20, 20],
                  y: [0, -3, 0]
                } : {
                  rotate: 0,
                  y: 0
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* الساق */}
                <line x1="110" y1="190" x2="112" y2="218" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                {/* الحذاء الأبيض */}
                <path d="M 108 216 C 108 212, 128 212, 128 216 L 128 225 L 108 225 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="107" y="224" width="22" height="3" fill="#cbd5e1" rx="1.5" />
              </motion.g>

              {/* 3. القاعدة المعدنية الحلزونية (الخصر) */}
              <g>
                <path d="M 84 175 L 116 175 L 112 181 L 88 181 Z" fill="url(#metalGrad)" />
                <path d="M 87 181 L 113 181 L 110 187 L 90 187 Z" fill="url(#metalGrad)" />
                <path d="M 89 187 L 111 187 L 107 193 L 93 193 Z" fill="url(#metalGrad)" />
                <circle cx="100" cy="195" r="3.5" fill="#475569" />
              </g>

              {/* 4. القميص الأزرق (الصدر والأكمام) */}
              <g>
                {/* القميص */}
                <path d="M 76 125 L 124 125 L 120 175 L 80 175 Z" fill="#2563eb" />
                {/* الياقة */}
                <path d="M 92 125 L 100 133 L 108 125" stroke="#1d4ed8" strokeWidth="2.5" fill="none" />
                {/* أكمام القميص */}
                <path d="M 76 125 L 64 138 L 73 143 L 80 130 Z" fill="#2563eb" />
                <path d="M 124 125 L 136 138 L 127 143 L 120 130 Z" fill="#2563eb" />
                {/* النص العربي على القميص */}
                <text x="100" y="160" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="Cairo">الإنارة الحديثة</text>
              </g>

              {/* 5. اليد اليسرى المتحركة */}
              <motion.g
                style={{ transformOrigin: "74px 130px" }}
                animate={isWalking ? {
                  rotate: [-35, 25, -35]
                } : {
                  rotate: [-5, 5, -5]
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* ذراع أبيض */}
                <path d="M 70 132 Q 45 145, 52 158" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                {/* القفاز/اليد */}
                <circle cx="52" cy="158" r="5" fill="#ffffff" />
                <circle cx="48" cy="156" r="2.5" fill="#ffffff" />
              </motion.g>

              {/* 6. اليد اليمنى المتحركة (تلوح في الاتجاه المقابل) */}
              <motion.g
                style={{ transformOrigin: "126px 130px" }}
                animate={isWalking ? {
                  rotate: [25, -35, 25]
                } : {
                  rotate: [15, -15, 15]
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* ذراع أبيض */}
                <path d="M 130 132 Q 155 145, 148 158" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                {/* القفاز/اليد */}
                <circle cx="148" cy="158" r="5" fill="#ffffff" />
                <circle cx="152" cy="156" r="2.5" fill="#ffffff" />
              </motion.g>

              {/* 7. رأس المصباح الزجاجي والوجه التفاعلي */}
              <g>
                {/* زجاج المصباح */}
                <path d="M 76 125 C 53 108, 48 72, 68 47 C 83 26, 117 26, 132 47 C 152 72, 147 108, 124 125 Z" fill="url(#glassGrad)" stroke="#3b82f6" strokeWidth="1.2" />
                
                {/* خطوط انعكاس زجاجية خفيفة جداً للفخامة */}
                <path d="M 64 80 C 62 60, 80 40, 96 36" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.25" fill="none" />
                
                {/* 🧠 الفتيل الدماغي المتوهج برمجياً والنابض */}
                <motion.g
                  animate={{
                    opacity: [0.75, 1, 0.75],
                    scale: [0.98, 1.02, 0.98]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ transformOrigin: "100px 75px" }}
                >
                  {/* الدماغ الذهبي المضيء */}
                  <path d="M 88 78 C 88 64, 98 64, 98 78" stroke="#facc15" strokeWidth="2.8" fill="none" strokeLinecap="round" filter="url(#glowFilament)" />
                  <path d="M 112 78 C 112 64, 102 64, 102 78" stroke="#facc15" strokeWidth="2.8" fill="none" strokeLinecap="round" filter="url(#glowFilament)" />
                  <path d="M 98 78 Q 100 84, 102 78" stroke="#eab308" strokeWidth="1.8" fill="none" />
                  <path d="M 88 78 C 80 72, 80 88, 88 88" stroke="#facc15" strokeWidth="2" fill="none" filter="url(#glowFilament)" />
                  <path d="M 112 78 C 120 72, 120 88, 112 88" stroke="#facc15" strokeWidth="2" fill="none" filter="url(#glowFilament)" />
                  
                  {/* سلكي التثبيت النحاسيين */}
                  <line x1="94" y1="84" x2="95" y2="124" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="106" y1="84" x2="105" y2="124" stroke="#94a3b8" strokeWidth="1" />
                </motion.g>

                {/* الحواجب */}
                <path d="M 77 66 Q 84 62, 89 67" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 123 66 Q 116 62, 111 67" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
                
                {/* 👁️ العينين مع ميزة الرمش التلقائي التفاعلي */}
                <motion.g
                  animate={{
                    scaleY: [1, 1, 0.05, 1, 1, 1]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    times: [0, 0.9, 0.93, 0.96, 1, 1]
                  }}
                  style={{ transformOrigin: "100px 74px" }}
                >
                  {/* العين اليسرى */}
                  <ellipse cx="86" cy="74" rx="8" ry="10" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                  <circle cx="86" cy="74" r="4" fill="#0f172a" />
                  <circle cx="84.5" cy="72" r="1.3" fill="#ffffff" />
                  
                  {/* العين اليمنى */}
                  <ellipse cx="114" cy="74" rx="8" ry="10" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                  <circle cx="114" cy="74" r="4" fill="#0f172a" />
                  <circle cx="112.5" cy="72" r="1.3" fill="#ffffff" />
                </motion.g>

                {/* الفم المبتسم الودود */}
                <path d="M 89 96 Q 100 107, 111 96" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 94 100 Q 100 107, 106 100" fill="#f43f5e" />
              </g>
            </svg>
          </motion.div>

          {/* الظل الأرضي يتحرك ويمشي بالتوازي مع التميمة ويتزامن مع خطواتها */}
          <motion.div
            animate={{
              x: shadowX,
              scale: shadowScale,
              opacity: shadowOpacity
            }}
            transition={{
              duration: 3.0,
              ease: "easeInOut"
            }}
            className="absolute bottom-6 w-24 h-3 bg-black/60 rounded-full blur-[4px] -z-0"
          />
        </div>

        {/* الاسم بتأثير نيون أزرق هادئ متناسق */}
        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: [0, 1, 0.4, 1, 0.9, 1],
              y: 0,
              textShadow: [
                "0 0 0px rgba(59,130,246,0)",
                "0 0 10px rgba(59,130,246,0.6), 0 0 20px rgba(59,130,246,0.2)",
                "0 0 5px rgba(59,130,246,0.1)",
                "0 0 20px rgba(59,130,246,0.7), 0 0 10px rgba(59,130,246,0.3)"
              ]
            }}
            transition={{ 
              delay: 0.6, 
              duration: 1.2, 
              times: [0, 0.3, 0.4, 0.6, 0.7, 1],
              ease: "easeOut" 
            }}
            className="text-4xl md:text-5xl font-black text-white tracking-wider font-cairo"
            style={{
              WebkitTextStroke: "0.5px rgba(255,255,255,0.2)"
            }}
          >
            الإنارة <span className="text-blue-300">الحديثة</span>
          </motion.h1>

          {/* خط نيون رقيق يضيء أسفل الكلمة */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 140, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
            className="h-0.5 bg-blue-500 rounded-full mt-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
        </div>

      </div>

      {/* شعار الترحيب السفلي */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-12 text-blue-200/40 text-xs font-bold tracking-widest uppercase font-cairo"
      >
        جودة عالمية .. وحلول متكاملة
      </motion.p>
    </div>
  );
}
