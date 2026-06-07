import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-[#050b14] flex flex-col items-center justify-center overflow-hidden z-[9999]">
      
      {/* هالة ضوئية خلفية متحركة ببطء ونبض */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 0.4, 0.6, 0.4, 0.5], 
          scale: [0.8, 1, 1.05, 1, 1.02] 
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.2),transparent_70%)] pointer-events-none"
      />

      {/* تأثير لمعة ضوئية مساحية خلفية (Moving Light sweep backdrop) */}
      <motion.div
        className="absolute w-[400px] h-[150px] bg-blue-500/10 blur-3xl rounded-full"
        initial={{ x: -500, opacity: 0 }}
        animate={{ x: 500, opacity: [0, 1, 0] }}
        transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex flex-col items-center gap-6 relative z-10">
        
        {/* الاسم بتأثير اللمعة المعدنية الفخمة المتنقلة مع وهج النيون المتناسق */}
        <div className="flex flex-col items-center select-none text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{ 
              duration: 1.0, 
              ease: "easeOut" 
            }}
            className="text-5xl md:text-8xl font-black tracking-widest font-cairo animate-text-shine pb-2"
            style={{
              filter: `
                drop-shadow(0 0 15px rgba(59,130,246,0.4))
                drop-shadow(0 0 35px rgba(59,130,246,0.2))
              `,
              WebkitTextStroke: "0.5px rgba(255,255,255,0.1)"
            }}
          >
            الإنارة الحديثة
          </motion.h1>

          {/* خط نيون فخم يتوهج ويتمدد أسفل الكلمة */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.0, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-blue-600 via-sky-300 to-blue-600 rounded-full mt-4 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          />
        </div>

      </div>

      {/* شعار الترحيب السفلي */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-16 text-blue-200/40 text-sm font-bold tracking-widest uppercase font-cairo"
      >
        جودة عالمية .. وحلول متكاملة
      </motion.p>
    </div>
  );
}
