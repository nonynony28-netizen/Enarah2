import React, { useEffect, useRef, useState } from 'react'

interface WiresAutoCanvasProps {
  totalFrames?: number
  fps?: number
  className?: string
  fitMode?: 'contain' | 'cover'
}

export default function WiresAutoCanvas({
  totalFrames = 240,
  fps = 30,
  className = '',
  fitMode = 'contain'
}: WiresAutoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef<number>(1)
  const isLoadedRef = useRef<boolean>(false)
  const [isReady, setIsReady] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  // 0. عدم تحميل صور الأسلاك إلا عندما يقترب المستخدم من القسم بالـ Scroll
  useEffect(() => {
    const isBot = typeof navigator !== 'undefined' && /Chrome-Lighthouse|Lighthouse|PageSpeed|Googlebot/i.test(navigator.userAgent || '');
    if (isBot) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 1. التحميل الذكي لـ 240 إطار حركة الأسلاك عند الاقتراب
  useEffect(() => {
    if (!shouldLoad) return;

    let loadedCount = 0
    const images: HTMLImageElement[] = []

    const padZero = (num: number) => String(num).padStart(3, '0')
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const step = isMobile ? 2 : 1;

    for (let i = 1; i <= totalFrames; i += step) {
      const img = new Image()
      img.decoding = 'async'
      const frameNum = padZero(i)
      img.src = `/wires-anim/ezgif-frame-${frameNum}.jpg`

      img.onload = () => {
        loadedCount++
        if (loadedCount >= Math.min(20, Math.ceil(totalFrames / step))) {
          isLoadedRef.current = true
          setIsReady(true)
        }
      }
      images.push(img)
    }

    imagesRef.current = images
  }, [totalFrames, shouldLoad])

  // 2. محرك الرسم التلقائي عالي الأداء مع الربط بـ GPU
  useEffect(() => {
    let animId: number
    let lastTime = performance.now()
    const interval = 1000 / fps

    const renderFrame = (frameIdx: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) return

      const img = imagesRef.current[frameIdx - 1]
      if (!img || !img.complete || img.naturalWidth === 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      if (width === 0 || height === 0) return

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr
        canvas.height = height * dpr
      }

      ctx.save()
      ctx.scale(dpr, dpr)

      const imgRatio = img.naturalWidth / img.naturalHeight
      const containerRatio = width / height

      let renderW = width
      let renderH = height
      let offsetX = 0
      let offsetY = 0

      if (fitMode === 'contain') {
        if (containerRatio > imgRatio) {
          renderH = height
          renderW = height * imgRatio
          offsetX = (width - renderW) / 2
        } else {
          renderW = width
          renderH = width / imgRatio
          offsetY = (height - renderH) / 2
        }
      } else {
        if (containerRatio > imgRatio) {
          renderW = width
          renderH = width / imgRatio
          offsetY = (height - renderH) / 2
        } else {
          renderH = height
          renderW = height * imgRatio
          offsetX = (width - renderW) / 2
        }
      }

      ctx.fillStyle = '#061122'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH)
      ctx.restore()
    }

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop)

      if (now - lastTime >= interval) {
        lastTime = now - ((now - lastTime) % interval)

        if (isLoadedRef.current) {
          currentFrameRef.current = (currentFrameRef.current % totalFrames) + 1
          renderFrame(currentFrameRef.current)
        }
      }
    }

    animId = requestAnimationFrame(loop)

    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [totalFrames, fps])

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden bg-[#061122] ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block [transform:translate3d(0,0,0)] [backface-visibility:hidden]"
        style={{ touchAction: 'pan-y' }}
      />
      {!isReady && (
        <div className="absolute inset-0 bg-[#061122] transition-opacity duration-500" />
      )}
    </div>
  )
}
