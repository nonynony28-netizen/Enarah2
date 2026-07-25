import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface HeroScrollCanvasProps {
  totalFrames?: number;
  folderPath?: string;
  className?: string;
}

export const HeroScrollCanvas: React.FC<HeroScrollCanvasProps> = ({
  totalFrames = 192,
  folderPath = "/hero-sequence",
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // تتبع نسبة التمرير بالكامل في القسم الرئيسي
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // ربط قيمة السكرول برقم الإطار من 1 إلى 192
  const currentFrame = useTransform(scrollYProgress, [0, 1], [1, totalFrames]);

  // 1. التحميل المسبق لجميع الإطارات الـ 192 في الذاكرة لمنع أي تقطيع
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `${folderPath}/ezgif-frame-${paddedIndex}.jpg`;

      img.onload = () => {
        if (!isMounted) return;
        count++;
        setLoadedCount(count);
        if (count === totalFrames) {
          setIsReady(true);
        }
      };

      img.onerror = () => {
        if (!isMounted) return;
        count++;
        setLoadedCount(count);
      };

      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;

    return () => {
      isMounted = false;
    };
  }, [totalFrames, folderPath]);

  // 2. دالة رسم الإطار على الـ Canvas بمنهجية cover المحافظة على الأبعاد
  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;
    let renderW = width;
    let renderH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > imgAspect) {
      renderH = width / imgAspect;
      offsetY = (height - renderH) / 2;
    } else {
      renderW = height * imgAspect;
      offsetX = (width - renderW) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  };

  // 3. تحديث أبعاد الكانفاس لتكون بدقة Retina / OLED عالية
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const currentIdx = Math.round(currentFrame.get());
      renderFrame(Math.max(1, Math.min(totalFrames, currentIdx)));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 4. الربط التفاعلي المستمر للتمرير مع إعادة الرسم بـ RequestAnimationFrame
  useEffect(() => {
    const unsubscribe = currentFrame.on("change", (latest) => {
      const frameIdx = Math.max(1, Math.min(totalFrames, Math.round(latest)));
      requestAnimationFrame(() => renderFrame(frameIdx));
    });

    return () => unsubscribe();
  }, [currentFrame, totalFrames]);

  // رسم الإطار الأول فور التحميل المسبق
  useEffect(() => {
    if (loadedCount > 0) {
      renderFrame(1);
    }
  }, [loadedCount]);

  return (
    <div ref={containerRef} className={`relative h-[300vh] w-full ${className}`}>
      {/* حاوية ثابتة طوال فترة التمرير */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#060d19]">
        <canvas
          ref={canvasRef}
          className="h-full w-full object-cover transition-opacity duration-300 pointer-events-none"
        />

        {/* مؤشر تحميل ناعم خفيف يظهر أثناء تجهيز الإطارات 192 */}
        {!isReady && (
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 rounded-full bg-slate-900/80 px-4 py-2 text-xs text-sky-400 backdrop-blur border border-sky-500/20">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
            <span>جاري تجهيز حركة الإضاءة التفاعلية {Math.round((loadedCount / totalFrames) * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroScrollCanvas;
