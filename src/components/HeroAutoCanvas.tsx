import React, { useEffect, useRef, useState } from "react";

interface HeroAutoCanvasProps {
  totalFrames?: number;
  folderPath?: string;
  className?: string;
  startDelay?: number;
  children?: (props: { isFinished: boolean; currentFrame: number }) => React.ReactNode;
}

// ذاكرة تخزين عالمية في الـ RAM لضمان عدم إعادة تحميل الصور عند التنقل بين الصفحات
const globalImageCache = new Map<string, HTMLImageElement[]>();

export const HeroAutoCanvas: React.FC<HeroAutoCanvasProps> = ({
  totalFrames = 192,
  folderPath = "/hero-sequence",
  className = "",
  startDelay = 0,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastValidImgRef = useRef<HTMLImageElement | null>(null);
  const [frameIndex, setFrameIndex] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const currentFrameRef = useRef(1);

  // 1. رسم الإطار على الـ Canvas بدقة هندسية عالية
  const renderFrame = (idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetIdx = Math.max(1, Math.min(idx, totalFrames));
    let img = imagesRef.current[targetIdx - 1];

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
      renderH = height * 1.05;
      renderW = renderH * imgAspect;
      if (renderW < width * 1.08) {
        renderW = width * 1.08;
        renderH = renderW / imgAspect;
      }
      offsetX = (width - renderW) / 2;
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

  // 2. التحميل المسبق لكافة إطارات اللقطة الـ 192
  useEffect(() => {
    let isMounted = true;

    if (globalImageCache.has(folderPath)) {
      const cached = globalImageCache.get(folderPath)!;
      imagesRef.current = cached;
      setIsReady(true);
      if (cached[0]) {
        lastValidImgRef.current = cached[0];
        renderFrame(1);
      }
      return;
    }

    const loadedImages: HTMLImageElement[] = [];
    let initialBufferCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.decoding = "async";
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `${folderPath}/ezgif-frame-${paddedIndex}.jpg`;

      img.onload = () => {
        if (!isMounted) return;
        initialBufferCount++;
        
        if (i === 1) {
          lastValidImgRef.current = img;
          renderFrame(1);
        }

        // بدء الحركة فور جاهزية أول 5 إطارات لتجنب أي تأخير
        if (initialBufferCount >= 5 && !isReady) {
          setIsReady(true);
        }

        if (initialBufferCount >= totalFrames) {
          globalImageCache.set(folderPath, loadedImages);
        }
      };

      img.onerror = () => {
        if (!isMounted) return;
        initialBufferCount++;
        if (initialBufferCount >= 5 && !isReady) {
          setIsReady(true);
        }
      };

      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;

    return () => {
      isMounted = false;
    };
  }, [totalFrames, folderPath]);

  // 3. ضبط أبعاد الكانفاس بآلية تسريع خارقة
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      renderFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 4. استشعار التمرير للأسفل ثم العودة لأعلى الصفحة لإعادة تشغيل اللقطة تلقائياً
  useEffect(() => {
    let hasScrolledDown = false;
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (scrollY > 400) {
        hasScrolledDown = true;
      } else if (scrollY < 20 && hasScrolledDown) {
        hasScrolledDown = false;
        setIsFinished(false);
        setFrameIndex(1);
        currentFrameRef.current = 1;
        setReplayCount((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 5. تشغيل الحركة تلقائياً فور جاهزية البافر
  useEffect(() => {
    if (!isReady && !globalImageCache.has(folderPath)) return;

    let animationFrameId: number;
    let startTimer: ReturnType<typeof setTimeout>;
    let lastTime = performance.now();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const fps = isMobile ? 32 : 42;
    const interval = 1000 / fps;

    let current = 1;
    currentFrameRef.current = 1;
    renderFrame(1);

    const animate = (now: number) => {
      const delta = now - lastTime;

      if (delta >= interval) {
        lastTime = now - (delta % interval);

        if (current < totalFrames) {
          current++;
          currentFrameRef.current = current;
          renderFrame(current);
          if (current >= 180) {
            setIsFinished(true);
            setFrameIndex(current);
          }
        } else {
          setIsFinished(true);
          setFrameIndex(totalFrames);
          renderFrame(totalFrames);
          return; // التوقف عند الإطار الأخير المضيء
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
  }, [totalFrames, startDelay, replayCount, isReady]);

  return (
    <div className={`relative h-[55vh] sm:h-[65vh] md:h-screen w-full overflow-hidden bg-gradient-to-b from-[#0a192f] via-[#0d2342] to-[#0a192f] touch-pan-y pointer-events-none select-none ${className}`}>
      
      {/* 1. صورة البوستر الأساسية المباشرة (Instant Zero-Delay HTML Image Paint) */}
      <img
        src={`${folderPath}/ezgif-frame-001.jpg`}
        alt="Hero Initial Scene"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none brightness-95"
      />

      {/* 2. توهج إضاءة سينمائية خلف الكانفاس لتنسيق كافة الفراغات */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.22)_0%,rgba(245,158,11,0.1)_45%,transparent_75%)] pointer-events-none z-0" />

      {/* 3. كانفاس الصورة التلقائي المزود بالتسريع العتادي المباشر بالـ GPU */}
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover pointer-events-none will-change-transform transform-gpu relative z-10 [transform:translate3d(0,0,0)] [backface-visibility:hidden]"
      />

      {/* 4. محتوى النصوص والترحيب الذي يظهر تلقائياً بعد توهج اللمبة */}
      {children && children({ isFinished, currentFrame: frameIndex })}
    </div>
  );
};

export default HeroAutoCanvas;
