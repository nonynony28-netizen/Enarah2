import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-[#050b14] flex flex-col items-center justify-center overflow-hidden z-[9999]">
      
      {/* هالة ضوئية خلف التميمة تضيء وتنبض */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 0.4, 0.6, 0.5, 0.6], 
          scale: [0.8, 1, 1.05, 1, 1.02] 
        }}
        transition={{ 
          delay: 0.6, 
          duration: 1.2, 
          times: [0, 0.2, 0.4, 0.6, 1],
          ease: "easeInOut" 
        }}
        className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.35),transparent_70%)] pointer-events-none"
      />

      <div className="flex flex-col items-center gap-6 relative z-10">
        
        {/* التميمة المتحركة */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: 30 }}
          animate={{ 
            opacity: 1, 
            scale: [0.3, 1.15, 1],
            y: 0 
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.34, 1.56, 0.64, 1] 
          }}
          className="relative w-44 h-44 md:w-56 md:h-56 flex items-center justify-center"
        >
          {/* صورة التميمة مع تأثير الإضاءة التدريجي الفخم */}
          <motion.img
            src="/mascot.png"
            alt="الإنارة الحديثة Mascot"
            className="w-full h-full object-contain"
            initial={{ filter: "brightness(0.5) grayscale(0.2)" }}
            animate={{ 
              filter: [
                "brightness(0.5) grayscale(0.2)",
                "brightness(1.25) drop-shadow(0 0 20px rgba(59,130,246,0.4))",
                "brightness(0.9) drop-shadow(0 0 10px rgba(59,130,246,0.2))",
                "brightness(1.3) drop-shadow(0 0 35px rgba(250,204,21,0.55)) drop-shadow(0 0 15px rgba(59,130,246,0.3))"
              ]
            }}
            transition={{
              delay: 0.7,
              duration: 1.0,
              times: [0, 0.2, 0.4, 1],
              ease: "easeInOut"
            }}
          />

          {/* وهج إضافي خلف التميمة بشكل متناسق */}
          <motion.div 
            className="absolute inset-0 bg-yellow-400/5 blur-xl rounded-full -z-10 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.4, 1] }}
            transition={{ delay: 0.7, duration: 1.0, times: [0, 0.2, 0.4, 1] }}
          />
        </motion.div>

        {/* الاسم بتأثير النيون الوامض (Flickering Neon) المتجانس */}
        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: [0, 1, 0.4, 1, 0.8, 1],
              y: 0,
              textShadow: [
                "0 0 0px rgba(59,130,246,0)",
                "0 0 10px rgba(59,130,246,0.8), 0 0 20px rgba(59,130,246,0.4)",
                "0 0 5px rgba(59,130,246,0.3)",
                "0 0 25px rgba(59,130,246,0.85), 0 0 50px rgba(250,204,21,0.5), 0 0 15px rgba(59,130,246,0.3)"
              ]
            }}
            transition={{ 
              delay: 0.9, 
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
            animate={{ width: 140, opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-500 rounded-full mt-3 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          />
        </div>

      </div>

      {/* شعار الترحيب السفلي */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-12 text-blue-200/50 text-xs font-bold tracking-widest uppercase font-cairo"
      >
        جودة عالمية .. وحلول متكاملة
      </motion.p>
    </div>
  );
}
