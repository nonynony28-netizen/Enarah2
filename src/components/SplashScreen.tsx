import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-[#050b14] flex flex-col items-center justify-center overflow-hidden z-[9999]">
      
      {/* هالة ضوئية خلف التميمة تضيء وتنبض */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 0.5, 0.7, 0.6, 0.7], 
          scale: [0.8, 1, 1.05, 1, 1.02] 
        }}
        transition={{ 
          delay: 0.4, 
          duration: 1.2, 
          times: [0, 0.2, 0.4, 0.6, 1],
          ease: "easeInOut" 
        }}
        className="absolute w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.2),transparent_70%)] pointer-events-none"
      />

      <div className="flex flex-col items-center gap-4 relative z-10">
        
        {/* منطقة التميمة والظل الأرضي */}
        <div className="relative flex flex-col items-center pb-8">
          
          {/* التميمة الكرتونية بحركة انضغاط وتمدد مرنة (Squash & Stretch) */}
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 80 }}
            animate={{ 
              opacity: 1,
              scale: [0, 1.15, 1], // الدخول الترحيبي الأول
              y: [0, 4, -12, 2, 0], // عوم مستمر
              scaleY: [1, 0.94, 1.06, 0.97, 1], // انضغاط وتمدد طولي
              scaleX: [1, 1.06, 0.94, 1.03, 1], // انضغاط وتمدد عرضي
              rotate: [0, 1.5, -1.5, 0] // أرجحة خفيفة جداً
            }}
            transition={{ 
              opacity: { duration: 0.5 },
              scale: { duration: 0.7, ease: "easeOut" },
              y: { delay: 0.7, duration: 3, repeat: Infinity, ease: "easeInOut" },
              scaleY: { delay: 0.7, duration: 3, repeat: Infinity, ease: "easeInOut" },
              scaleX: { delay: 0.7, duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { delay: 0.7, duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center z-10"
            style={{ transformOrigin: "bottom center" }} // التمدد يبدأ من الأسفل لإعطاء واقعية للوقوف
          >
            {/* صورة التميمة عالية الدقة والشفافية مع تأثير توهج الفتيل */}
            <motion.img
              src="/mascot.png"
              alt="الإنارة الحديثة Mascot"
              className="w-full h-full object-contain"
              initial={{ filter: "brightness(0.6) contrast(0.95)" }}
              animate={{ 
                filter: [
                  "brightness(0.6) contrast(0.95)",
                  "brightness(1.25) drop-shadow(0 0 25px rgba(250,204,21,0.65)) drop-shadow(0 0 10px rgba(59,130,246,0.3))",
                  "brightness(0.85) drop-shadow(0 0 10px rgba(250,204,21,0.2))",
                  "brightness(1.3) drop-shadow(0 0 35px rgba(250,204,21,0.7)) drop-shadow(0 0 15px rgba(59,130,246,0.35))"
                ]
              }}
              transition={{
                delay: 0.4,
                duration: 1.1,
                times: [0, 0.2, 0.4, 1],
                ease: "easeInOut"
              }}
            />

            {/* نبض توهج إضافي خلف اللمبة */}
            <motion.div 
              className="absolute top-4 w-32 h-32 bg-yellow-400/5 blur-2xl rounded-full -z-10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.9, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* الظل الأرضي الديناميكي (Dynamic Ambient Floor Shadow) */}
          {/* يتغير حجمه وشفافيته في عكس حركة المصباح ليعطي إحساساً بالعمق والاندماج بالموقع */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.35, 0.2, 0.3, 0.35], // يقل التظليل عندما ترتفع اللمبة للأعلى
              scale: [0, 1, 0.8, 0.95, 1] // يصغر الظل عندما ترتفع اللمبة للأعلى
            }}
            transition={{
              opacity: { delay: 0.7, duration: 3, repeat: Infinity, ease: "easeInOut" },
              scale: { delay: 0.7, duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-6 w-24 h-3 bg-black/70 rounded-full blur-[5px] -z-0"
          />
        </div>

        {/* الاسم بتأثير النيون الوامض */}
        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: [0, 1, 0.3, 1, 0.75, 1],
              y: 0,
              textShadow: [
                "0 0 0px rgba(59,130,246,0)",
                "0 0 15px rgba(59,130,246,0.8), 0 0 25px rgba(59,130,246,0.4)",
                "0 0 5px rgba(59,130,246,0.2)",
                "0 0 30px rgba(59,130,246,0.9), 0 0 60px rgba(250,204,21,0.6), 0 0 20px rgba(59,130,246,0.4)"
              ]
            }}
            transition={{ 
              delay: 0.6, 
              duration: 1.2, 
              times: [0, 0.3, 0.4, 0.6, 0.7, 1],
              ease: "easeOut" 
            }}
            className="text-4xl md:text-6xl font-black text-white tracking-wider font-cairo"
            style={{
              WebkitTextStroke: "0.5px rgba(255,255,255,0.25)"
            }}
          >
            الإنارة <span className="text-blue-300">الحديثة</span>
          </motion.h1>

          {/* خط نيون رقيق يضيء أسفل الكلمة */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 160, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-500 rounded-full mt-3 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          />
        </div>

      </div>

      {/* شعار الترحيب السفلي */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-12 text-blue-200/50 text-xs font-bold tracking-widest uppercase font-cairo"
      >
        جودة عالمية .. وحلول متكاملة
      </motion.p>
    </div>
  );
}
