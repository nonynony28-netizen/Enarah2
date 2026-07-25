import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroAutoCanvasProps {
  totalFrames?: number;
  folderPath?: string;
  className?: string;
  startDelay?: number;
  children?: (props: { isFinished: boolean; currentFrame: number }) => React.ReactNode;
}

export const HeroAutoCanvas: React.FC<HeroAutoCanvasProps> = ({
  totalFrames = 192,
  folderPath = "/hero-sequence",
  className = "",
  startDelay = 0,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [frameIndex, setFrameIndex] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // 1. التحميل المسبق لشرايح الصور الـ 192
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
  const renderFrame = (idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[idx - 1];
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

  // 3. ضبط أبعاد الكانفاس لتكون دقيقة عالي الوضوح
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      renderFrame(frameIndex);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [frameIndex]);

  // 4. تشغيل الحركة تلقائياً فور انتهاء شاشة البداية حتى الإطار 192 ثم التوقف وإظهار النص
  useEffect(() => {
    let animationFrameId: number;
    let startTimer: ReturnType<typeof setTimeout>;
    let lastTime = performance.now();
    const fps = 42; // سرعة سلاسة الحركة 42 إطار بالثانية
    const interval = 1000 / fps;

    let current = 1;

    const animate = (now: number) => {
      const delta = now - lastTime;

      if (delta >= interval) {
        lastTime = now - (delta % interval);

        if (current < totalFrames) {
          current++;
          setFrameIndex(current);
          renderFrame(current);
        } else {
          setIsFinished(true);
          renderFrame(totalFrames);
          return; // التوقف عند الإطار الأخير (لمعة اللمبة)
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    startTimer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [totalFrames, startDelay]);

  return (
    <div className={`relative h-screen w-full overflow-hidden bg-[#060d19] ${className}`}>
      {/* كانفاس الصورة التلقائي */}
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover pointer-events-none"
      />

      {/* محتوى النصوص والترحيب الذي يظهر تلقائياً بعد توهج اللمبة */}
      {children && children({ isFinished, currentFrame: frameIndex })}

      {/* مؤشر تحميل خفيف في البداية */}
      {!isReady && loadedCount < totalFrames && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 rounded-full bg-slate-900/80 px-4 py-2 text-xs text-sky-400 backdrop-blur border border-sky-500/20">
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
          <span>جاري فتح المشهد... {Math.round((loadedCount / totalFrames) * 100)}%</span>
        </div>
      )}
    </div>
  );
};

export default HeroAutoCanvas;
