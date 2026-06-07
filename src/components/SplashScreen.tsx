import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SplashScreen() {
  const [mascotSrc, setMascotSrc] = useState<string>("/mascot.png");

  // معالجة الصورة في المتصفح لجعل الخلفية البيضاء/الرمادية شفافة بالكامل
  useEffect(() => {
    const img = new Image();
    img.src = "/mascot.png";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = imgData.width;
        const height = imgData.height;

        // دالة للتحقق من لون الخلفية الفاتح
        const isBackground = (x: number, y: number) => {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          if (a === 0) return false;
          // تصفية ألوان الخلفية الفاتحة والرمادية
          return r > 210 && g > 210 && b > 210;
        };

        const queue: number[] = [];
        const visited = new Uint8Array(width * height);

        const pushPixel = (x: number, y: number) => {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            const idx = y * width + x;
            if (!visited[idx] && isBackground(x, y)) {
              visited[idx] = 1;
              queue.push(idx);
            }
          }
        };

        // البدء من الزوايا الأربعة والحواف لإزالة الخلفية المتصلة بالكامل
        for (let x = 0; x < width; x++) {
          pushPixel(x, 0);
          pushPixel(x, height - 1);
        }
        for (let y = 0; y < height; y++) {
          pushPixel(0, y);
          pushPixel(width - 1, y);
        }

        // خوارزمية ملء الفراغ (Flood Fill BFS)
        let head = 0;
        while (head < queue.length) {
          const idx = queue[head++];
          const x = idx % width;
          const y = Math.floor(idx / width);

          const pIdx = idx * 4;
          data[pIdx + 3] = 0; // جعل البكسل شفافاً

          // فحص الجيران الأربعة
          pushPixel(x + 1, y);
          pushPixel(x - 1, y);
          pushPixel(x, y + 1);
          pushPixel(x, y - 1);
        }

        ctx.putImageData(imgData, 0, 0);
        setMascotSrc(canvas.toDataURL());
      } catch (err) {
        console.error("Failed to make mascot background transparent:", err);
      }
    };
  }, []);

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
        
        {/* الحاوية العائمة للتميمة لتعطي حركة الكرتون الحية */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: 30 }}
          animate={{ 
            opacity: 1, 
            scale: [0.3, 1.15, 1],
            y: [0, -10, 0], // حركة العوم المستمرة
            rotate: [0, 2, -2, 0] // أرجحة طفيفة
          }}
          transition={{ 
            scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
            y: { delay: 0.8, duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { delay: 0.8, duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative w-44 h-44 md:w-56 md:h-56 flex items-center justify-center"
        >
          {/* صورة التميمة مع تأثير الإضاءة التدريجي الفخم */}
          <motion.img
            src={mascotSrc}
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
