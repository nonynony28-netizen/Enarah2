import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroAutoCanvasProps {
  totalFrames?: number;
  folderPath?: string;
  className?: string;
  startDelay?: number;
  children?: (props: { isFinished: boolean; currentFrame: number }) => React.ReactNode;
}

// ذاكرة تخزين عالمية في الـ RAM لضمان عدم إعادة تحميل الصور عند التصفح أو الفتح مجدداً
const globalImageCache = new Map<string, HTMLImageElement[]>();

export const HeroAutoCanvas: React.FC<HeroAutoCanvasProps> = ({
  totalFrames = 192,
  folderPath = "/hero-sequence",
  className = "",
  startDelay = 2400,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastValidImgRef = useRef<HTMLImageElement | null>(null);
  const [frameIndex, setFrameIndex] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // 1. التحميل المسبق لشرايح الصور الـ 192 بتقنية async decoding الذكية لمحو الثقل ومنع تقطيع الإضاءة
  useEffect(() => {
    let isMounted = true;

    // إذا كانت الصور محمولة سابقاً في ذاكرة الـ RAM، استخدمها فوراً 100% دون الحاجة لطلبها من الإنترنت
    if (globalImageCache.has(folderPath)) {
      const cached = globalImageCache.get(folderPath)!;
      imagesRef.current = cached;
      setLoadedCount(cached.length);
      setIsReady(true);
      if (cached[0]) {
        lastValidImgRef.current = cached[0];
      }
      return;
    }

    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      // فك ضغط الصور خارج المعالج الرئيسي لتجنب الثقل والتهنيج عند أول فتح للموقع
      img.decoding = "async";
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `${folderPath}/ezgif-frame-${paddedIndex}.jpg`;

      img.onload = () => {
        if (!isMounted) return;
        count++;
        setLoadedCount(count);
        if (count === 1) {
          lastValidImgRef.current = img;
        }
        if (count === totalFrames) {
          setIsReady(true);
          globalImageCache.set(folderPath, loadedImages);
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

  // 2. دالة رسم الإطار على الـ Canvas مع حماية كاملة ومخزن عازل يمنع الوميض وتذبذب الإضاءة المزعج
  const renderFrame = (idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imagesRef.current[idx - 1];

    // حماية تامة ضد القفزات والإضاءة الغريبة عند أول فتح: إذا كانت الصورة قيد التحميل عبر الشريكة، حافظ على الإطار السابق بسلاسة
    if (img && img.complete && img.naturalWidth > 0) {
      lastValidImgRef.current = img;
    } else if (lastValidImgRef.current) {
      img = lastValidImgRef.current;
    } else {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // تجربة العرض بالأبعاد الحقيقية الأصلية 100% بدون أي زوم أو قص إطلاقاً على الهواتف (True 16:9 Aspect Ratio)
    const cropPercent = isMobile ? 0 : 0.035;
    const cropX = img.naturalWidth * cropPercent;
    const cropY = img.naturalHeight * cropPercent;
    const cropW = img.naturalWidth * (1 - cropPercent * 2);
    const cropH = img.naturalHeight * (1 - cropPercent * 2);

    const imgAspect = cropW / cropH;
    const canvasAspect = width / height;
    let renderW = width;
    let renderH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (isMobile) {
      // عرض اللقطة بالعرض كاملاً بنفس مقاسها الأصلي الحقيقي (100% True Widescreen Landscape Ratio)
      renderW = width;
      renderH = width / imgAspect;
      offsetX = 0;
      offsetY = (height - renderH) / 2;
    } else {
      if (canvasAspect > imgAspect) {
        renderH = width / imgAspect;
        offsetY = (height - renderH) / 2;
      } else {
        renderW = height * imgAspect;
        offsetX = (width - renderW) / 2;
      }
    }

    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isMobile ? "medium" : "high";
    ctx.drawImage(img, cropX, cropY, cropW, cropH, offsetX, offsetY, renderW, renderH);
  };

  // 3. ضبط أبعاد الكانفاس بآلية تسريع خارقة مخصصة للهواتف القديمة
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      // على الهواتف: استخدام dpr = 1 يقلل معالجة البكسلات بنسبة 75% ويضمن 60FPS سلسة جداً على الهواتف القديمة
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      renderFrame(frameIndex);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [frameIndex]);

  const hasScrolledDownRef = useRef(false);
  const [replayCount, setReplayCount] = useState(0);

  // 4. استشعار التمرير للأسفل ثم العودة لأعلى الصفحة لإعادة تشغيل اللقطة تلقائياً
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (scrollY > 400) {
        hasScrolledDownRef.current = true;
      } else if (scrollY < 20 && hasScrolledDownRef.current) {
        hasScrolledDownRef.current = false;
        setIsFinished(false);
        setFrameIndex(1);
        setReplayCount((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 5. تشغيل الحركة تلقائياً وتكرارها فور العودة لأعلى الصفحة حتى الإطار 192 ثم التوقف وإظهار النص
  useEffect(() => {
    let animationFrameId: number;
    let startTimer: ReturnType<typeof setTimeout>;
    let lastTime = performance.now();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const fps = isMobile ? 35 : 42; // سرعة متناسقة ومستقرة للأجهزة المحمولة القديمة والحديثة
    const interval = 1000 / fps;

    let current = 1;
    setFrameIndex(1);

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

    const currentDelay = replayCount > 0 ? 0 : startDelay;

    startTimer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, currentDelay);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [totalFrames, startDelay, replayCount]);

  return (
    <div className={`relative h-[55vh] sm:h-[65vh] md:h-screen w-full overflow-hidden bg-gradient-to-b from-[#0a192f] via-[#0d2342] to-[#0a192f] ${className}`}>
      {/* توهج إضاءة دافئة سينمائية خلف الكانفاس لتنسيق كافة الفراغات بدون أي لون أسود أو داكن */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.22)_0%,rgba(245,158,11,0.1)_45%,transparent_75%)] pointer-events-none" />

      {/* كانفاس الصورة التلقائي المزود بالتسريع العتادي */}
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover pointer-events-none will-change-transform transform-gpu relative z-0"
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
