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
        className="absolute w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.3),transparent_70%)] pointer-events-none"
      />

      <div className="flex flex-col items-center gap-6 relative z-10">
        
        {/* التميمة الكرتونية بحركة انميشن حيوية عائمة ومؤرجحة */}
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 80, rotate: -20 }}
          animate={{ 
            opacity: 1, 
            scale: [0, 1.2, 0.95, 1.05, 1], // تأثير الارتداد الكرتوني (Bounce)
            y: [0, -12, 0], // حركة العوم المستمرة
            rotate: [0, 3, -3, 0] // حركة التأرجح اللطيفة
          }}
          transition={{ 
            scale: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
            y: { delay: 0.9, duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { delay: 0.9, duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative w-48 h-48 md:w-60 md:h-60 flex items-center justify-center"
        >
          {/* صورة التميمة مع فلتر إضاءة نيون وامض */}
          <motion.img
            src="/mascot.png"
            alt="الإنارة الحديثة Mascot"
            className="w-full h-full object-contain"
            initial={{ filter: "brightness(0.6) contrast(0.95)" }}
            animate={{ 
              filter: [
                "brightness(0.6) contrast(0.95)",
                "brightness(1.3) drop-shadow(0 0 25px rgba(250,204,21,0.65)) drop-shadow(0 0 10px rgba(59,130,246,0.3))",
                "brightness(0.85) drop-shadow(0 0 10px rgba(250,204,21,0.2))",
                "brightness(1.35) drop-shadow(0 0 35px rgba(250,204,21,0.75)) drop-shadow(0 0 15px rgba(59,130,246,0.4))"
              ]
            }}
            transition={{
              delay: 0.5,
              duration: 1.1,
              times: [0, 0.2, 0.4, 1],
              ease: "easeInOut"
            }}
          />

          {/* توهج إضافي نبضي خلف الشخصية */}
          <motion.div 
            className="absolute inset-0 bg-yellow-400/5 blur-2xl rounded-full -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.4, 0.9] }}
            transition={{ delay: 0.5, duration: 1.1, times: [0, 0.2, 0.4, 1] }}
          />
        </motion.div>

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
              delay: 0.7, 
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
            transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-500 rounded-full mt-3 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          />
        </div>

      </div>

      {/* شعار الترحيب السفلي */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-12 text-blue-200/50 text-xs font-bold tracking-widest uppercase font-cairo"
      >
        جودة عالمية .. وحلول متكاملة
      </motion.p>
    </div>
  );
}
