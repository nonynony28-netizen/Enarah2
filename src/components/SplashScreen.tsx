import { motion } from "framer-motion";

export default function SplashScreen() {
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
          
          {/* التميمة الكرتونية بحركة مشي حقيقية ودخول من اليسار إلى الوسط */}
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
            className="relative w-44 h-44 md:w-52 md:h-52 flex items-center justify-center z-10"
            style={{ transformOrigin: "bottom center" }}
          >
            {/* صورة التميمة بألوانها الأصلية الطبيعية وبدون إضاءة صفراء ثقيلة أو فلاتر */}
            <img
              src="/mascot.png"
              alt="الإنارة الحديثة Mascot"
              className="w-full h-full object-contain"
              style={{ filter: "brightness(1.0) contrast(1.0)" }} // ألوان طبيعية صافية بدون فلاتر نيون
            />
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
