import React, { useEffect, useRef, useState } from "react";

interface HeroAutoCanvasProps {
  totalFrames?: number;
  folderPath?: string;
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
  startDelay?: number;
  children?: (props: { isFinished: boolean; currentFrame: number }) => React.ReactNode;
}

export const HeroAutoCanvas: React.FC<HeroAutoCanvasProps> = ({
  videoSrc = "/bg-video.mp4",
  posterSrc = "/poster.jpg",
  className = "",
  children
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");

    const playVideo = () => {
      if (!video) return;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Will auto kick on touch or scroll
        });
      }
    };

    // البدء الفوري المباشر من الثانية 0.00 بدون أي انتظار
    playVideo();

    const handleUserInteraction = () => {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    };

    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("scroll", handleUserInteraction, { passive: true });
    window.addEventListener("pointerdown", handleUserInteraction, { passive: true });

    // استشعار العودة لأعلى الصفحة لإعادة تشغيل اللقطة من البداية (خروج اللمبة)
    const heroEl = document.getElementById("hero");
    let observer: IntersectionObserver | null = null;
    if (heroEl) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && video) {
            video.currentTime = 0;
            playVideo();
          }
        });
      }, { threshold: 0.25 });
      observer.observe(heroEl);
    }

    return () => {
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("pointerdown", handleUserInteraction);
      if (observer) observer.disconnect();
    };
  }, [videoSrc]);

  return (
    <div className={`relative h-[55vh] sm:h-[65vh] md:h-screen w-full overflow-hidden bg-black touch-pan-y pointer-events-none select-none ${className}`}>
      
      {/* 1. الفيديو السينمائي عالي الجودة بتسريع الـ GPU العتادي المباشر وبدون أي استهلاك للمعالج أو الذاكرة */}
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        defaultMuted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-100 will-change-transform transform-gpu"
        style={{ transform: "translateZ(0)" }}
        onEnded={() => {
          setIsFinished(true);
        }}
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (video && video.duration && video.currentTime >= video.duration - 0.5) {
            setIsFinished(true);
          }
        }}
      />

      {/* 2. تظليل سينمائي متناسق لحماية قراءة النصوص وتوهج الإضاءة */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-1" />

      {/* 3. توهج إضاءة ناعم في الخلفية */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.18)_0%,rgba(245,158,11,0.08)_45%,transparent_75%)] pointer-events-none z-1" />

      {/* 4. محتوى النصوص والترحيب الذي يظهر فوراً بدون أي تأخير */}
      {children && children({ isFinished, currentFrame: 192 })}
    </div>
  );
};

export default HeroAutoCanvas;
