import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useTransform } from 'framer-motion'
import { useShake } from '../hooks/use-shake'
import { useLanguage } from '../hooks/useLanguage'
import { useCart } from '../hooks/useCart'
import HeroAutoCanvas from '../components/HeroAutoCanvas'
import WiresAutoCanvas from '../components/WiresAutoCanvas'
import {
  Award, Shield, Sparkles, Zap, ArrowLeft, Loader2, Globe,
  TrendingUp, TrendingDown, Minus, ShieldCheck, Calendar, ShoppingCart, X, CheckCircle, Lightbulb, MessageCircle,
  Facebook, Instagram, ChevronRight, ChevronLeft, PlayCircle, Check, Calculator, Video, Phone, Gamepad2
} from 'lucide-react'

// نمط الوهج
const glowingTitleStyle = { textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)' }

function FadeIn({ children }: { children: React.ReactNode, delay?: number }) {
  return (
    <div className="w-full transition-opacity duration-300">
      {children}
    </div>
  )
}

type ProjectItem = { id: string; name: string; description: string; image: string; coverImage: string; video?: string; category: string }
type TrendType = 'up' | 'down' | 'same'

const defaultWireData = [
  { id: '1.5', size: '1.5 ملي', type: 'مفرد (لفة 100 متر)', price: '45.00', trend: 'same' as TrendType },
  { id: '2.5', size: '2.5 ملي', type: 'مفرد (لفة 100 متر)', price: '75.00', trend: 'same' as TrendType },
  { id: '4.0', size: '4.0 ملي', type: 'مفرد (لفة 100 متر)', price: '115.00', trend: 'same' as TrendType },
  { id: '6.0', size: '6.0 ملي', type: 'مفرد (لفة 100 متر)', price: '165.00', trend: 'same' as TrendType },
  { id: '10.0', size: '10.0 ملي', type: 'مفرد (لفة 100 متر)', price: '290.00', trend: 'same' as TrendType },
  { id: '16.0', size: '16.0 ملي', type: 'مفرد (لفة 100 متر)', price: '450.00', trend: 'same' as TrendType },
  { id: '25.0', size: '25.0 ملي', type: 'مفرد (لفة 100 متر)', price: '680.00', trend: 'same' as TrendType },
]

const getPaintColors = (isAr: boolean) => [
  { id: 'white', name: isAr ? 'أبيض ناصع' : 'Pure White', hex: '#ffffff', advice: {
    warm: isAr 
      ? 'يعطي دفئاً ومظهراً كلاسيكياً مريحاً للعين، مناسب لغرف النوم والمجالس.' 
      : 'Provides warmth and a classic look comfortable to the eye, suitable for bedrooms and salons.',
    natural: isAr 
      ? 'الخيار الأمثل للأبيض! يظهر البياض الطبيعي والنقاء دون اصفرار أو برودة.' 
      : 'The best choice for white! Shows natural whiteness and purity without turning yellow or cold.',
    cool: isAr 
      ? 'يعطي إضاءة قوية ونشيطة تشبه المكاتب، قد يكون ساطعاً جداً للمنازل.' 
      : 'Provides strong and active lighting similar to offices, but might be too bright for homes.'
  }},
  { id: 'beige', name: isAr ? 'بيج دافئ' : 'Warm Beige', hex: '#f5ebe0', advice: {
    warm: isAr 
      ? 'تطابق رائع! يعزز دفء البيج ويخلق أجواء حميمية وغنية جداً ومثالية للمجالس.' 
      : 'Great match! Enhances the warmth of beige and creates a very cozy and rich atmosphere, ideal for salons.',
    natural: isAr 
      ? 'خيار ممتاز ومتوازن يظهر نعومة لون البيج بشكل طبيعي دون تزييف.' 
      : 'Excellent balanced choice that shows the softness of beige color naturally without falsifying it.',
    cool: isAr 
      ? 'غير محبذ كثيراً، حيث يجعل لون البيج الدافئ يبدو شاحباً أو رمادياً ميتًا.' 
      : 'Not highly recommended, as it makes the warm beige color look pale or dull grey.'
  }},
  { id: 'grey', name: isAr ? 'رمادي عصري' : 'Modern Grey', hex: '#e5e5e5', advice: {
    warm: isAr 
      ? 'تحذير: الإضاءة الصفراء قد تحول الرمادي إلى مظهر مائل للاخضرار أو الاتساخ.' 
      : 'Warning: Yellow lighting may turn grey into a greenish or dirty look.',
    natural: isAr 
      ? 'تطابق رائع! يحافظ على برودة الرمادي وجماله العصري دون تغيير لونه الأصلي.' 
      : 'Great match! Keeps the grey cool and modern without altering its original color.',
    cool: isAr 
      ? 'يعزز جمال الرمادي البارد ويعطي شعوراً بنظافة ومستقبلية المكان.' 
      : 'Enhances the beauty of cool grey and gives a clean, futuristic feel to the space.'
  }},
  { id: 'navy', name: isAr ? 'أزرق كحلي' : 'Navy Blue', hex: '#1e293b', advice: {
    warm: isAr 
      ? 'يخلق تبايناً درامياً فخماً، مناسب للجدران المميزة (Accent Walls) لتبدو فخمة.' 
      : 'Creates a luxurious dramatic contrast, suitable for Accent Walls to look rich.',
    natural: isAr 
      ? 'خيار ممتاز يظهر جمال اللون الكحلي وعمقه بوضوح تحت الضوء الطبيعي.' 
      : 'Excellent choice that clearly displays the beauty and depth of navy under natural light.',
    cool: isAr 
      ? 'يبرز درجات الأزرق الحقيقية ويجعل الجدار يبدو بارداً وحديثاً للغاية.' 
      : 'Highlights true blue undertones and makes the wall look very cool and modern.'
  }},
  { id: 'green', name: isAr ? 'أخضر زيتي' : 'Olive Green', hex: '#3f4e3f', advice: {
    warm: isAr 
      ? 'يزيد من حميمية اللون الأخضر ويجعله يبدو ترابياً ودافئاً جداً ومريحاً.' 
      : 'Increases the coziness of the green, making it look earthy, very warm, and comfortable.',
    natural: isAr 
      ? 'يظهر درجات الأخضر الطبيعية بشكل مذهل ويحافظ على حيوية ونضارة اللون.' 
      : 'Displays natural green tones beautifully and maintains the vibrancy and freshness of the color.',
    cool: isAr 
      ? 'يجعل الأخضر يبدو بارداً وأقل دفئاً، يفضل استخدامه في المكاتب وأماكن العمل.' 
      : 'Makes the green look cool and less warm, preferred for offices and workspaces.'
  }},
]

const getLocalizedSize = (size: string, isAr: boolean) => {
  const numeric = size.replace(' ملي', '').replace(' مم', '').replace(' ملي', '').replace(' مم', '').trim()
  return isAr ? `${numeric} مم` : `${numeric} mm`
}

const getLocalizedProject = (project: { name: string; category: string; description: string }, isAr: boolean) => {
  if (isAr) return project

  let name = project.name
  let category = project.category
  let description = project.description

  const nameTrim = project.name.trim()
  if (nameTrim === 'مول الماسة') name = 'Al-Masa Mall'
  else if (nameTrim === 'معرض كواترو موتورز') name = 'Quattro Motors Showroom'
  else if (nameTrim === 'مصحة الحياة الطبية') name = 'Al-Hayat Medical Clinic'
  else if (nameTrim === 'قاعة جمانة للمناسبات') name = 'Jumana Events Hall'
  else if (nameTrim === 'panyoti cafe') name = 'Panyoti Cafe'

  const catTrim = project.category.trim()
  if (catTrim === 'مقهي') category = 'Cafe'
  else if (catTrim === 'مول تجاري') category = 'Commercial Mall'
  else if (catTrim === 'معرض سيارات') category = 'Car Showroom'
  else if (catTrim === 'طبي') category = 'Medical'
  else if (catTrim === 'اجتماعي') category = 'Social'

  const descTrim = project.description.trim()
  if (descTrim.includes('الاضاءات الداخلية والخارجية وعمدان الانارة')) {
    description = 'Execution of indoor & outdoor lighting and lighting poles for Al-Masa Mall.'
  } else if (descTrim.includes('توريد كافه الاضاءات والاعمده والسكك')) {
    description = 'Supply of all lighting, poles, and tracks to showcase the showroom in the best way.'
  } else if (descTrim.includes('تنفيذ وتسليم كامل من بريزات والاضاءات')) {
    description = 'Execution and complete handover of outlets, lighting, voltage regulators, and wiring to ensure smooth operation under all conditions.'
  } else if (descTrim.includes('توريد الثريات والإضاءات المختلفة لصالة جمانة')) {
    description = 'Supply of chandeliers and various custom lighting for Jumana Hall to complete your wedding luxury and live the most beautiful moments.'
  } else if (descTrim.includes('تجهيز الثريات والاضاءات في المقهي')) {
    description = 'Supplying chandeliers and custom lighting for the cafe, which all customers agreed was stunning.'
  }

  return { name, category, description }
}

function HeroTextOverlay({ scrollYProgress, t, isAr }: { scrollYProgress: any; t: any; isAr: boolean }) {
  // تدرج السطوع: يظهر عند توهج اللمبة (0.05 -> 0.35) ويختفي بنعومة مع الانتقال للقسم التالي (0.75 -> 0.90)
  const textOpacity = useTransform(scrollYProgress, [0.05, 0.35, 0.75, 0.90], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.05, 0.35, 0.75, 0.90], [30, 0, 0, -30]);
  const textScale = useTransform(scrollYProgress, [0.05, 0.35, 0.75, 0.90], [0.94, 1, 1, 0.95]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 px-4 pt-16 md:pt-20">
      <motion.div 
        style={{ opacity: textOpacity, y: textY, scale: textScale }}
        className="max-w-5xl mx-auto text-center pointer-events-auto flex flex-col items-center justify-center"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 leading-tight tracking-tight text-white py-2">
          <span className="text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">{t('hero.title.part1')}</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_35px_rgba(56,189,248,0.7)]">{t('hero.title.part2')}</span>
        </h1>
        
        <p className="text-sm sm:text-lg md:text-2xl text-slate-100 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed font-medium px-2 drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
          {t('hero.subtitle')}
        </p>

        {/* مؤشر توجيهي أنيق للتمرير */}
        <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-sky-500/30 text-xs md:text-sm text-sky-300 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span className="font-semibold">{isAr ? 'مرر للأسفل لإضاءة واستكشاف تفاصيل الإنارة 💡' : 'Scroll down to illuminate details 💡'}</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { t, isAr } = useLanguage()
  const paintColors = getPaintColors(isAr)
  const filamentColor = "#fbbf24"
  const filamentGlow = "drop-shadow(0 0 8px rgba(245,158,11,0.85))"
  const spotlightOpacity = 0.45
  const spotlightScale = 1
  const spotlightRotate = 0
  const bulbAuraOpacity = 0.85

  const [pageLoading, setPageLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const secondaryVideoRef = useRef<HTMLVideoElement>(null)

  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('enarah_cached_hero_video') || '/bg-video.mp4'
    }
    return '/bg-video.mp4'
  })

  const [secondaryVideoUrl, setSecondaryVideoUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('enarah_cached_secondary_video') || '/bg-video.mp4'
    }
    return '/bg-video.mp4'
  })

  useEffect(() => {
    const forcePlayMobileVideo = (el: HTMLVideoElement | null) => {
      if (!el) return;
      el.defaultMuted = true;
      el.muted = true;
      el.volume = 0;
      el.playsInline = true;
      el.setAttribute('muted', '');
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', 'true');
      
      const promise = el.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    };

    const playAll = () => {
      forcePlayMobileVideo(videoRef.current);
      forcePlayMobileVideo(secondaryVideoRef.current);
    };

    playAll();

    window.addEventListener('touchstart', playAll, { passive: true });
    window.addEventListener('scroll', playAll, { passive: true });
    window.addEventListener('pointerdown', playAll, { passive: true });

    // مراقب التصفح: عند العودة لقسم الهيرو، يعاد تشغيل الفيديو من البداية ويتوقف عند آخر لقطة (لمعة اللمبة)
    const heroEl = document.getElementById('hero');
    let observer: IntersectionObserver | null = null;
    if (heroEl) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.currentTime = 0;
            forcePlayMobileVideo(videoRef.current);
          }
        });
      }, { threshold: 0.25 });
      observer.observe(heroEl);
    }

    return () => {
      window.removeEventListener('touchstart', playAll);
      window.removeEventListener('scroll', playAll);
      window.removeEventListener('pointerdown', playAll);
      if (observer) observer.disconnect();
    };
  }, [heroVideoUrl, secondaryVideoUrl])
  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enarah_cached_featured_projects')
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }
    return []
  })
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const [wirePrices, setWirePrices] = useState<typeof defaultWireData>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enarah_cached_wire_prices')
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }
    return defaultWireData
  })

  const { addToCart, triggerFlyAnimation } = useCart()
  const [addingId, setAddingId] = useState<string | null>(null)

  const handleAddToCart = (e: React.MouseEvent, wire: any) => {
    const itemId = `wire-${wire.id}`
    triggerFlyAnimation(e.clientX, e.clientY)
    setAddingId(itemId)
    addToCart({
      id: itemId,
      name: isAr ? `سلك إيطالي مقاس ${wire.size}` : `Italian Wire ${wire.id}mm`,
      description: isAr ? `سلك مفرد لفة 100 متر` : `Single 100m Roll`,
      image: '/images/cat-cables.jpg',
      price: parseFloat(wire.price)
    })
    setTimeout(() => {
      setAddingId(null)
    }, 1200)
  }

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeWhySlide, setActiveWhySlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWhySlide((prev) => (prev + 1) % 3)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const [simColor, setSimColor] = useState<'warm' | 'natural' | 'cool'>('warm')
  const [simSpot, setSimSpot] = useState(true)
  const [simLed, setSimLed] = useState(false)
  const [selectedPaintId, setSelectedPaintId] = useState('white')
  const [paintColorTemp, setPaintColorTemp] = useState<'warm' | 'natural' | 'cool'>('warm')
  const [paintFlicker, setPaintFlicker] = useState(false)
  const [stackIdx, setStackIdx] = useState(0)

  const { requestPermission } = useShake({
    onShake: () => {
      setPaintColorTemp((current) => {
        if (current === 'warm') return 'natural'
        if (current === 'natural') return 'cool'
        return 'warm'
      })
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(100)
      }
      setPaintFlicker(true)
      setTimeout(() => setPaintFlicker(false), 120)
    }
  })

  useEffect(() => {
    setPaintFlicker(true)
    const t = setTimeout(() => setPaintFlicker(false), 80)
    return () => clearTimeout(t)
  }, [paintColorTemp, selectedPaintId])

  useEffect(() => {
    setPageLoading(false)
  }, [])

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
  }, [])

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        const data = await res.json()
        if (res.ok && data.success && Array.isArray(data.data)) {
          
          const projectsOnly = data.data
            .filter((item: any) => item.type !== 'contact')
            .filter((item: any) => {
               try { return JSON.parse(item.phone).type === 'project' } catch { return false }
            })
            .map((item: any, index: number) => {
              let mediaData: any = {}
              try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}

              const rawImage = mediaData.imageUrl || '/images/default-product.jpg'
              const imageUrls = rawImage.split(',').map((url: string) => url.trim()).filter(Boolean)
              const coverImage = imageUrls[0] || '/images/default-product.jpg'

              const rawName = item.name || 'مشروع مميز'
              const rawCategory = mediaData.category || 'مشاريعنا'
              const rawDesc = mediaData.description || ''

              const localized = getLocalizedProject({ name: rawName, category: rawCategory, description: rawDesc }, isAr)

              return {
                id: item._id || String(index),
                name: localized.name,
                description: localized.description,
                image: rawImage,
                coverImage: coverImage,
                video: mediaData.videoUrl || '',
                category: localized.category,
              }
            })
          const loadedProjects = projectsOnly.reverse().slice(0, 4)
          setFeaturedProjects(loadedProjects)
          localStorage.setItem('enarah_cached_featured_projects', JSON.stringify(loadedProjects))

          const sortedItems = [...data.data].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          const heroVideoEntry = sortedItems.find((item: any) => item.email === 'admin_hero_video@app.local' || item.type === 'hero_video')
          if (heroVideoEntry) {
            try {
              const videoObj = JSON.parse(heroVideoEntry.phone)
              const vidUrl = videoObj.videoUrl || videoObj.imageUrl
              if (vidUrl) {
                setHeroVideoUrl(vidUrl)
                localStorage.setItem('enarah_cached_hero_video', vidUrl)
              }
            } catch {}
          }

          const secondaryVideoEntry = sortedItems.find((item: any) => item.email === 'admin_secondary_video@app.local' || item.type === 'secondary_video')
          if (secondaryVideoEntry) {
            try {
              const videoObj = JSON.parse(secondaryVideoEntry.phone)
              const vidUrl = videoObj.videoUrl || videoObj.imageUrl
              if (vidUrl) {
                setSecondaryVideoUrl(vidUrl)
                localStorage.setItem('enarah_cached_secondary_video', vidUrl)
              }
            } catch {}
          }

          const wireUpdates = data.data.filter((item: any) => item.email === 'admin_wire_prices@app.local')
          if (wireUpdates.length > 0) {
             const chronological = wireUpdates.reverse() 
             const latestObj = JSON.parse(chronological[chronological.length - 1].phone).prices
             const previousObj = chronological.length > 1 ? JSON.parse(chronological[chronological.length - 2].phone).prices : null

             const updatedWires = defaultWireData.map(wire => {
                const newPrice = parseFloat(latestObj[wire.id] || wire.price)
                const oldPrice = previousObj ? parseFloat(previousObj[wire.id] || wire.price) : parseFloat(wire.price)
                let trend: TrendType = 'same'
                if (newPrice > oldPrice) trend = 'up'     
                if (newPrice < oldPrice) trend = 'down'   
                return { ...wire, price: newPrice.toFixed(2), trend }
             })
             setWirePrices(updatedWires)
             localStorage.setItem('enarah_cached_wire_prices', JSON.stringify(updatedWires))
          }
        }
      } catch (err) {
        console.error('Fetch Home Data Error:', err)
      } finally {
        setLoadingProjects(false)
      }
    }
    fetchHomeData()
  }, [isAr])



  // فتح معرض الصور للمشروع
  const openGallery = (project: ProjectItem) => {
    setSelectedProject(project)
    setActiveImageIndex(0)
  }

  const handleNextImage = (length: number) => {
    setActiveImageIndex((prev) => (prev + 1) % length)
  }

  const handlePrevImage = (length: number) => {
    setActiveImageIndex((prev) => (prev - 1 + length) % length)
  }

  return (
    <>
      {/* شاشة التحميل المتوهجة الفاخرة */}
      <AnimatePresence>
        {pageLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0a192f]"
          >
            <div className="relative flex flex-col items-center">
              {/* حلقات متوهجة تدور */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-400 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-blue-300/10"></div>
                <div className="absolute inset-2 rounded-full border-4 border-b-blue-300 animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lightbulb className="w-9 h-9 text-blue-300 animate-pulse drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                </div>
              </div>

              {/* الاسم المتوهج */}
              <motion.h2 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
                className="text-3xl font-black text-white mb-2 tracking-wider" 
                style={glowingTitleStyle}
              >
                {isAr ? (
                  <>الإنارة <span className="text-blue-300">الحديثة</span></>
                ) : (
                  <>ENARAH <span className="text-blue-300">MODERN</span></>
                )}
              </motion.h2>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-0 relative cursor-default bg-transparent text-white">
        
        {/* =========================================================
            محاكي الإنارة ثلاثي الأبعاد المرتبط بالتمرير (Scroll 3D Bulb)
            ========================================================= */}
        {/* الكشاف الخلفي الناعم والخفيف (GPU Optimized Smooth Spotlight) */}
        <div 
          className="fixed top-0 right-0 w-full h-screen pointer-events-none z-0 bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.15)_0%,rgba(212,160,23,0.05)_40%,transparent_70%)] hidden md:block"
        />



        {/* 1. الواجهة الترحيبية السينمائية التلقائية (Automatic 3D Scene Animation) */}
        <section id="hero" className="relative min-h-[55vh] sm:min-h-[65vh] md:h-screen w-full overflow-hidden touch-pan-y select-none pointer-events-none">
          <HeroAutoCanvas totalFrames={192} folderPath="/hero-sequence" startDelay={0}>
            {({ currentFrame, isFinished }) => {
              // تظهر كافة الكلمات والمعلومات فقط بعد اكتمال تشغيل اللقطة بالكامل كـ فيديو واحد كامل
              const showText = isFinished || currentFrame >= 185;

              return (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center pt-6 sm:pt-10 md:pt-14 z-10 px-4">
                  <AnimatePresence>
                    {showText && (
                      <motion.div 
                        initial={{ opacity: 0, y: 25, filter: "blur(12px)", scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl mx-auto text-center pointer-events-auto flex flex-col items-center justify-center"
                      >
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-4 leading-tight tracking-tight text-white py-1">
                          <span className="text-white drop-shadow-md">{t('hero.title.part1')}</span>{' '}
                          <span className="text-blue-400 drop-shadow-sm">{t('hero.title.part2')}</span>
                        </h1>
                        
                        <p className="text-xs sm:text-base md:text-xl text-zinc-300 mb-0 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-sm">
                          {t('hero.subtitle')}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }}
          </HeroAutoCanvas>
        </section>

        {/* 2. لماذا نحن - الميزات الموحدة في شبكة 3 بطاقات فاخرة في صفحة واحدة (Unified 3-Card Feature Grid) */}
        <section id="about" className="py-20 md:py-28 relative overflow-hidden border-t border-zinc-800/80 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* عنوان قسم لماذا نحن */}
            <div className="text-center mb-14 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">
                {isAr ? 'لماذا' : 'Why'}{' '}
                <span className="text-blue-400">
                  {isAr ? 'نحن؟' : 'Choose Us?'}
                </span>
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-normal">
                {isAr 
                  ? 'تجربة متكاملة تجمع بين الجودة المعتمدة، الأسعار المنافسة، والدعم الفني السريع' 
                  : 'An integrated experience combining certified quality, competitive pricing, and fast technical support'}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-5">
                <div className="w-16 h-[1px] bg-zinc-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <div className="w-16 h-[1px] bg-zinc-800" />
              </div>
            </div>

            {/* شبكة البطاقات الثلاث الموحدة بتصميم معماري فاخر */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
              
              {/* البطاقة الأولى: وكلاء حصريون لشركات عالمية */}
              <div className="relative p-8 rounded-2xl bg-[#111215] border border-white/[0.08] hover:border-white/[0.18] shadow-sm flex flex-col justify-between group transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-xs font-semibold tracking-wider">
                      {isAr ? 'وكالة رسمية' : 'Official Agency'}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 group-hover:border-zinc-700 transition-colors">
                      <Globe className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                    {isAr ? 'وكلاء حصريون لشركات عالمية' : 'Exclusive Agents for Global Brands'}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {isAr 
                      ? 'منتجات من شركات عالمية مختلفة نحن وكلائها الحصريون لضمان أعلى معايير الجودة والأصالة.' 
                      : 'Products from leading global brands for which we serve as exclusive agents.'}
                  </p>

                  <div className="space-y-3 mb-6">
                    {(isAr ? [
                      'منتجات أصلية من شركات عالمية نحن وكلائها الحصريون.',
                      'استيراد وتوريد مباشر من المصانع العالمية المعتمدة.',
                      'تنوع واسع في العلامات التجارية يلبي كافة المشاريع.',
                      'شفافية كاملة ومواصفات موثوقة ودقيقة لكافة بيانات المنتجات.'
                    ] : [
                      'Original products from global brands with exclusive agency.',
                      'Direct import from certified international factories.',
                      'Wide diversity of world-class brands for all projects.',
                      'Complete transparency and accurate technical specifications for all product data.'
                    ]).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-zinc-300 font-normal leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-400">
                  <span>{isAr ? 'وكالة رسمية وحصرية' : 'Official Exclusive Agency'}</span>
                  <span className="text-blue-400 font-bold text-sm">100%</span>
                </div>
              </div>

              {/* البطاقة الثانية: حلول متكاملة */}
              <div className="relative p-8 rounded-2xl bg-[#111215] border border-white/[0.08] hover:border-white/[0.18] shadow-sm flex flex-col justify-between group transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-xs font-semibold tracking-wider">
                      {isAr ? 'حلول متكاملة' : 'Integrated Solutions'}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 group-hover:border-zinc-700 transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                    {isAr ? 'حلول تأسيس وإنارة شاملة' : 'Integrated Electrical & Lighting'}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {isAr 
                      ? 'نوفر لك كل ما تحتاجه لتأسيس منزلك أو مشروعك من كابلات، أسلاك إيطالية، ومفاتيح ذكية في مكان واحد.' 
                      : 'We provide everything you need to set up your home or project, from cables and Italian wires to smart switches.'}
                  </p>

                  <div className="space-y-3 mb-6">
                    {(isAr ? [
                      'توفير كافة مستلزمات التأسيس والإنارة بدون عناء.',
                      'كابلات وأسلاك إيطالية بأحدث التقنيات.',
                      'تجهيز كامل للمشاريع بأسعار منافسة.',
                      'حلول ديكورية تناسب جميع التصاميم.'
                    ] : [
                      'All electrical and lighting needs in one stop.',
                      'Italian wires and smart switches with modern tech.',
                      'Complete project provisioning at competitive prices.',
                      'Integrated decorative lighting solutions.'
                    ]).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-zinc-300 font-normal leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-400">
                  <span>{isAr ? 'تغطية شاملة للمشاريع' : 'Full Project Provisioning'}</span>
                  <span className="text-blue-400 font-bold text-sm">100%</span>
                </div>
              </div>

              {/* البطاقة الثالثة: دعم فني واسع */}
              <div className="relative p-8 rounded-2xl bg-[#111215] border border-white/[0.08] hover:border-white/[0.18] shadow-sm flex flex-col justify-between group transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-xs font-semibold tracking-wider">
                      {isAr ? 'استشارات ودعم' : 'Technical Support'}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 group-hover:border-zinc-700 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                    {isAr ? 'دعم فني واستشارات مجاناً' : 'Fast Sales Support & Consultations'}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {isAr 
                      ? 'فريقنا متواجد دائماً لمساعدتك في اختيار المنتجات المناسبة وتوفير الكميات وحساب أحمال الكهرباء بدقة.' 
                      : 'Our team is available to help you select products, request custom volumes, and calculate electrical loads accurately.'}
                  </p>

                  <div className="space-y-3 mb-6">
                    {(isAr ? [
                      'فريق مهندسين وفنيين لإجابة كافة استفساراتك.',
                      'حساب الأحمال والكميات المطلوبة بدقة بدون هدر.',
                      'متابعة مستمرة حتى وصول طلبك بأمان.',
                      'توصيل سريع ومضمون لكافة المشاريع.'
                    ] : [
                      'Dedicated specialists to answer all your queries.',
                      'Accurate calculation of loads and quantities.',
                      'Continuous order tracking and coordination.',
                      'Fast and guaranteed delivery to all project sites.'
                    ]).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-zinc-300 font-normal leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-400">
                  <span>{isAr ? 'استجابة واستشارات فورية' : '24/7 Support & Response'}</span>
                  <span className="text-blue-400 font-bold text-sm">24/7</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================
            قسم عرض الفيديو الثاني (بعرض الشاشة الكاملة على جميع الأجهزة)
            ========================================================= */}
        <section id="showcase-video" className="w-full py-8 md:py-14 relative overflow-hidden bg-transparent border-y border-zinc-800/80">
          <div className="w-full relative z-10">
            
            {/* مسرح الفيديو الثاني بعرض الشاشة الكاملة 100% بدون أي حواف جانبية */}
            <div className="relative w-full overflow-hidden bg-black shadow-[0_0_50px_rgba(59,130,246,0.25)]">
              <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[85vh] overflow-hidden flex items-center justify-center">
                <video
                  ref={secondaryVideoRef}
                  key={secondaryVideoUrl}
                  src={secondaryVideoUrl}
                  autoPlay
                  loop
                  muted
                  defaultMuted
                  playsInline
                  webkit-playsinline="true"
                  preload="auto"
                  poster="/poster.jpg"
                  onLoadedMetadata={(e) => { e.currentTarget.muted = true; e.currentTarget.play().catch(() => {}); }}
                  onCanPlay={(e) => { e.currentTarget.muted = true; e.currentTarget.play().catch(() => {}); }}
                  className="w-full h-full object-cover"
                  style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                />
              </div>
            </div>

          </div>
        </section>

        {/* 2.5 مُحاكي الإضاءة التفاعلي المبتكر */}
        <section id="simulator" className="py-20 md:py-28 relative overflow-hidden border-t border-zinc-800/80 bg-transparent">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="text-center mb-14 md:mb-18">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">
                {t('sim.title.part1')} <span className="text-blue-400">{t('sim.title.part2')}</span>
              </h2>
              <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-normal">
                {t('sim.desc')}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-5">
                <div className="w-16 h-[1px] bg-zinc-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <div className="w-16 h-[1px] bg-zinc-800" />
              </div>
            </div>

            <div className={`flex flex-col lg:flex-row items-center justify-center gap-8 bg-[#111215] border border-white/[0.08] p-6 md:p-10 rounded-2xl shadow-sm ${
              isAr ? 'flex-col lg:flex-row' : 'flex-col lg:flex-row-reverse'
            }`}>
              
              {/* شاشة العرض - الصالة الافتراضية بمقاس صغير ملموم */}
              <div className="w-full lg:w-[38%] max-w-[360px] aspect-[4/3] rounded-2xl overflow-hidden relative bg-black shadow-2xl border border-white/10 group">
                {/* الصورة الأساسية للصالة */}
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                  alt="Virtual Room" 
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                />

                {/* طبقة محاكاة الإظلام والإنارة (تتحكم في الإضاءة عبر الشفافية بدلاً من الفلاتر الثقيلة) */}
                <div 
                  className="absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none z-10"
                  style={{
                    opacity: 
                      (!simSpot && !simLed) ? 0.75 : 
                      (simSpot && simLed) ? 0.0 : 
                      simSpot ? 0.22 : 0.45
                  }}
                />

                {/* طبقة محاكاة لون الإضاءة العام (Color Overlay) */}
                <div 
                  className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-10"
                  style={{
                    backgroundColor: 
                      (!simSpot && !simLed) ? 'transparent' :
                      simColor === 'warm' ? 'rgba(251, 191, 36, 0.1)' : 
                      simColor === 'natural' ? 'rgba(253, 224, 71, 0.07)' : 
                      'rgba(186, 230, 253, 0.07)',
                    opacity: (simSpot || simLed) ? 1 : 0
                  }}
                />

                {/* تأثير مخاريط الإضاءة (Spotlight Cones) */}
                {simSpot && (
                  <div className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-500">
                    {/* السبوت الأول (يمين) */}
                    <div 
                      className="absolute top-0 right-[25%] w-32 h-full opacity-75 transition-all duration-500"
                      style={{
                        background: `radial-gradient(ellipse at top, ${
                          simColor === 'warm' ? 'rgba(251, 191, 36, 0.45)' : 
                          simColor === 'natural' ? 'rgba(254, 240, 138, 0.35)' : 
                          'rgba(186, 230, 253, 0.35)'
                        } 0%, transparent 75%)`,
                        clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)'
                      }}
                    />
                    {/* السبوت الثاني (يسار) */}
                    <div 
                      className="absolute top-0 left-[25%] w-32 h-full opacity-75 transition-all duration-500"
                      style={{
                        background: `radial-gradient(ellipse at top, ${
                          simColor === 'warm' ? 'rgba(251, 191, 36, 0.45)' : 
                          simColor === 'natural' ? 'rgba(254, 240, 138, 0.35)' : 
                          'rgba(186, 230, 253, 0.35)'
                        } 0%, transparent 75%)`,
                        clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)'
                      }}
                    />
                  </div>
                )}

                {/* تأثير الإنارة المخفية من السقف (LED Cove Glow) */}
                {simLed && (
                  <div 
                    className="absolute top-0 left-0 right-0 h-14 pointer-events-none z-20 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to bottom, ${
                        simColor === 'warm' ? 'rgba(251, 191, 36, 0.45)' : 
                        simColor === 'natural' ? 'rgba(254, 240, 138, 0.35)' : 
                        'rgba(186, 230, 253, 0.35)'
                      }, transparent)`,
                    }}
                  />
                )}

                {/* نص توضيحي داخلي */}
                <div className={`absolute bottom-4 z-20 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 ${
                  isAr ? 'right-4' : 'left-4'
                }`}>
                  <span className="text-[11px] font-semibold text-zinc-300">
                    {!simSpot && !simLed ? (isAr ? 'الإنارة مطفأة 🌑' : 'Lights Off 🌑') : `${isAr ? 'حرارة اللون:' : 'Color Temp:'} ${
                      simColor === 'warm' ? (isAr ? 'أصفر دافئ (3000K)' : 'Warm Yellow (3000K)') : 
                      simColor === 'natural' ? (isAr ? 'شمسي طبيعي (4000K)' : 'Natural Sun (4000K)') : 
                      (isAr ? 'أبيض بارد (6000K)' : 'Cool White (6000K)')
                    }`}
                  </span>
                </div>
              </div>

              {/* أزرار التحكم - لوحة التحكم الجانبية */}
              <div className="w-full lg:w-[62%] flex flex-col justify-center space-y-6">
                
                {/* 1. اختيار حرارة ولون الضوء */}
                <div>
                  <h4 className={`text-base font-bold text-zinc-200 mb-3 font-sans ${isAr ? 'text-right' : 'text-left'}`}>{t('sim.opt1')}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'warm', name: isAr ? 'أصفر 3000K' : 'Warm 3000K', activeCls: 'bg-amber-500/10 border-amber-500/50 text-amber-300' },
                      { key: 'natural', name: isAr ? 'شمسي 4000K' : 'Natural 4000K', activeCls: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-200' },
                      { key: 'cool', name: isAr ? 'أبيض 6000K' : 'White 6000K', activeCls: 'bg-blue-500/10 border-blue-500/50 text-blue-300' },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setSimColor(btn.key as any)}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          simColor === btn.key 
                            ? `${btn.activeCls} ring-1 ring-white/20 scale-[1.02]` 
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {btn.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. تشغيل مصادر الإضاءة المختلفة */}
                <div>
                  <h4 className={`text-base font-bold text-zinc-200 mb-3 font-sans ${isAr ? 'text-right' : 'text-left'}`}>{t('sim.opt2')}</h4>
                  <div className={`flex flex-col sm:flex-row gap-4 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* زر السبوت لايت */}
                    <button
                      onClick={() => setSimSpot(!simSpot)}
                      className={`flex-1 py-3.5 px-4 rounded-xl border font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        simSpot
                          ? 'bg-blue-600/10 border-blue-500/50 text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{isAr ? 'السبوت لايت (Spotlight)' : 'Spotlight'}</span>
                      <span className={`w-3 h-3 rounded-full border ${simSpot ? 'bg-blue-500 border-blue-400' : 'border-zinc-600'}`} />
                    </button>
                    
                    {/* زر الإنارة المخفية */}
                    <button
                      onClick={() => setSimLed(!simLed)}
                      className={`flex-1 py-3.5 px-4 rounded-xl border font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        simLed
                          ? 'bg-blue-600/10 border-blue-500/50 text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{isAr ? 'الإنارة المخفية (LED Strip)' : 'Cove Light (LED Strip)'}</span>
                      <span className={`w-3 h-3 rounded-full border ${simLed ? 'bg-blue-500 border-blue-400' : 'border-zinc-600'}`} />
                    </button>
                  </div>
                </div>

                {/* نصيحة الخبراء الهندسية */}
                <div className={`bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-zinc-300 ${
                  isAr ? 'text-right flex-row' : 'text-left flex-row-reverse'
                }`}>
                  <div className="text-lg">💡</div>
                  <div className="flex-grow">
                    <span className="font-semibold text-white block mb-0.5">{t('sim.tip')}</span>
                    {simColor === 'warm' && (isAr ? 'الإنارة الصفراء (3000K) تضفي حميمية ودفئاً، وهي مثالية لغرف النوم والمجالس لتعزز الشعور بالاسترخاء.' : 'Yellow lighting (3000K) adds intimacy and warmth, ideal for bedrooms and living rooms to promote relaxation.')}
                    {simColor === 'natural' && (isAr ? 'الإنارة الشمسية (4000K) هي الأقرب لضوء النهار، وهي مناسبة جداً للمطابخ، الممرات، والمنطقة التي تحتاج لألوان حقيقية.' : 'Natural lighting (4000K) is closest to daylight, perfect for kitchens, corridors, and areas needing true colors.')}
                    {simColor === 'cool' && (isAr ? 'الإنارة البيضاء (6000K) تمنح نشاطاً ووضوحاً عالياً، وهي خيار رائع للمكاتب، أماكن القراءة والدراسة.' : 'White lighting (6000K) provides high activity and clarity, an excellent choice for offices, reading, and study areas.')}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* دليل تطابق طلاء الجدران والإضاءة */}
        <section id="paint-matching" className="py-20 md:py-28 relative overflow-hidden border-t border-zinc-800/80 bg-transparent">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-14 md:mb-18">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">
                {isAr ? (
                  <>دليل تطابق <span className="text-blue-400">الطلاء والإضاءة</span></>
                ) : (
                  <>Paint & Lighting <span className="text-blue-400">Matching Guide</span></>
                )}
              </h2>
              <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-normal">
                {isAr 
                  ? 'اكتشف كيف يتأثر لون طلاء جدران بيتك بحرارة لون الإضاءة المختلفة لتتجنب الأخطاء الشائعة في التصميم الداخلي'
                  : 'Discover how your home wall paint color is affected by different lighting color temperatures to avoid common interior design mistakes'
                }
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-5">
                <div className="w-16 h-[1px] bg-zinc-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <div className="w-16 h-[1px] bg-zinc-800" />
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-[#111215] border border-white/[0.08] p-6 md:p-10 rounded-2xl relative shadow-sm"
            >
              {/* شاشة العرض - زاوية ثلاثية الأبعاد 3D Room Corner */}
              <div className="w-full lg:w-[38%] max-w-[360px] flex flex-col gap-4">
                <div className="w-full aspect-[4/3] rounded-2xl relative overflow-hidden bg-[#09090b] shadow-2xl border border-white/10 transition-all duration-500">
                  {/* Left Wall */}
                  <div 
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      backgroundColor: (paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).hex,
                      clipPath: 'polygon(0% 5%, 50% 18%, 50% 80%, 0% 68%)',
                    }}
                  >
                    {/* Wall Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/25 pointer-events-none" />
                    {/* Direct Spotlight reflection */}
                    <div 
                      className="absolute inset-0 pointer-events-none transition-all duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 12%, ${
                          paintColorTemp === 'warm' ? 'rgba(251, 191, 36, 0.45)' : 
                          paintColorTemp === 'natural' ? 'rgba(254, 240, 138, 0.35)' : 
                          'rgba(186, 230, 253, 0.35)'
                        } 0%, transparent 70%)`,
                        opacity: paintFlicker ? 0.15 : 1,
                      }}
                    />
                  </div>

                  {/* Right Wall */}
                  <div 
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      backgroundColor: (paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).hex,
                      clipPath: 'polygon(50% 18%, 100% 5%, 100% 68%, 50% 80%)',
                    }}
                  >
                    {/* Shaded wall overlay */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/15 to-black/35 pointer-events-none" />
                    {/* Direct Spotlight reflection */}
                    <div 
                      className="absolute inset-0 pointer-events-none transition-all duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 12%, ${
                          paintColorTemp === 'warm' ? 'rgba(251, 191, 36, 0.45)' : 
                          paintColorTemp === 'natural' ? 'rgba(254, 240, 138, 0.35)' : 
                          'rgba(186, 230, 253, 0.35)'
                        } 0%, transparent 70%)`,
                        opacity: paintFlicker ? 0.15 : 1,
                      }}
                    />
                  </div>

                  {/* Center Seam Shadow */}
                  <div className="absolute top-[18%] bottom-[20%] left-1/2 w-[1px] -translate-x-1/2 pointer-events-none z-10 bg-black/20" />

                  {/* Floor */}
                  <div 
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, #111522 0%, #1d2232 100%)',
                      clipPath: 'polygon(0% 68%, 50% 80%, 100% 68%, 50% 100%)',
                    }}
                  >
                    {/* Subtle floor plank pattern lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_100%] opacity-20 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
                    
                    {/* Spotlight floor reflection */}
                    <div 
                      className="absolute inset-0 pointer-events-none transition-all duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 80%, ${
                          paintColorTemp === 'warm' ? 'rgba(251, 191, 36, 0.4)' : 
                          paintColorTemp === 'natural' ? 'rgba(254, 240, 138, 0.3)' : 
                          'rgba(186, 230, 253, 0.3)'
                        } 0%, transparent 65%)`,
                        opacity: paintFlicker ? 0.15 : 1,
                      }}
                    />
                  </div>

                  {/* Spotlight Cone */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-10 transition-all duration-500"
                    style={{
                      clipPath: 'polygon(50% 12%, 0% 100%, 100% 100%)',
                      background: `linear-gradient(to bottom, ${
                        paintColorTemp === 'warm' ? 'rgba(251, 191, 36, 0.28)' : 
                        paintColorTemp === 'natural' ? 'rgba(254, 240, 138, 0.18)' : 
                        'rgba(186, 230, 253, 0.18)'
                      }, transparent 85%)`,
                      opacity: paintFlicker ? 0.1 : 0.85,
                    }}
                  />

                  {/* Spotlight Physical Fixture */}
                  <div className="absolute top-[3%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                    <div className="w-10 h-2 bg-zinc-800 rounded-full border border-zinc-700/50 shadow-inner" />
                    <div className="w-1.5 h-3 bg-gradient-to-r from-zinc-600 to-zinc-500" />
                    <div className="w-7 h-7 bg-zinc-900 border border-zinc-700 rounded-t-sm rounded-b-md flex items-center justify-center shadow-lg relative">
                      <div className={`w-5 h-2 rounded-full blur-[1px] transition-all duration-300 ${
                        paintColorTemp === 'warm' ? 'bg-amber-300' :
                        paintColorTemp === 'natural' ? 'bg-yellow-100' :
                        'bg-sky-200'
                      }`} />
                    </div>
                  </div>

                  {/* 3D Indicator Badge */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[9px] text-zinc-300 font-semibold">{isAr ? 'عرض ثلاثي الأبعاد 3D' : '3D View'}</span>
                  </div>

                  {/* Shake Toggle Permission Button on Mobile */}
                  <button 
                    onClick={async () => {
                      const granted = await requestPermission();
                      if (granted) {
                        alert(isAr ? "تم تفعيل ميزة هز الهاتف لتغيير الإضاءة! جرب هز هاتفك الآن. 📱" : "Phone shake feature enabled! Try shaking your phone now. 📱");
                      } else {
                        alert(isAr ? "لم نتمكن من تفعيل مستشعرات الحركة بجهازك أو تصفحك عبر جهاز لا يدعمها." : "Could not activate motion sensors on your device or your device does not support them.");
                      }
                    }}
                    className="absolute bottom-4 right-4 z-20 flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 border border-blue-500 text-[9px] text-white font-semibold transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{isAr ? 'تفعيل هز الهاتف 📱' : 'Enable Phone Shake 📱'}</span>
                  </button>
                </div>

                {/* مؤشر اللون الحالي */}
                <div className="flex items-center justify-between bg-zinc-900/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-800 text-xs text-zinc-300">
                  <span>{isAr ? 'الطلاء:' : 'Paint:'} <strong className="text-white">{(paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).name}</strong></span>
                  <span>{isAr ? 'الضوء:' : 'Light:'} <strong className="text-blue-400">
                    {paintColorTemp === 'warm' ? (isAr ? 'أصفر (3000K)' : 'Yellow (3000K)') : 
                     paintColorTemp === 'natural' ? (isAr ? 'شمسي (4000K)' : 'Natural (4000K)') : 
                     (isAr ? 'أبيض (6000K)' : 'White (6000K)')}
                  </strong></span>
                </div>
              </div>

              {/* أزرار التحكم والخيارات */}
              <div className="w-full lg:w-[62%] flex flex-col justify-center space-y-6">
                
                {/* 1. اختيار لون صبغ الجدار */}
                <div>
                  <h4 className="text-base font-bold text-zinc-200 mb-3 font-sans">
                    {isAr ? '1. اختر لون طلاء الجدار:' : '1. Choose Wall Paint Color:'}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {paintColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedPaintId(color.id)}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex flex-col items-center gap-2 cursor-pointer ${
                          selectedPaintId === color.id
                            ? 'bg-zinc-800 border-zinc-600 text-white ring-1 ring-white/30'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full border border-white/20 shadow-inner" 
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. اختيار لون الإضاءة */}
                <div>
                  <h4 className="text-base font-bold text-zinc-200 mb-3 font-sans">
                    {isAr ? '2. اختر حرارة لون الإضاءة:' : '2. Choose Light Color Temp:'}
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'warm', name: isAr ? 'أصفر 3000K' : 'Yellow 3000K', activeCls: 'bg-amber-500/10 border-amber-500/50 text-amber-300' },
                      { key: 'natural', name: isAr ? 'شمسي 4000K' : 'Natural 4000K', activeCls: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-200' },
                      { key: 'cool', name: isAr ? 'أبيض 6000K' : 'White 6000K', activeCls: 'bg-blue-500/10 border-blue-500/50 text-blue-300' },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setPaintColorTemp(btn.key as any)}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          paintColorTemp === btn.key
                            ? `${btn.activeCls} ring-1 ring-white/20 scale-[1.02]`
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {btn.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* النصيحة الهندسية الذكية */}
                <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-zinc-300">
                  <div className="text-lg">📐</div>
                  <div>
                    <span className="font-semibold text-white block mb-1">
                      {isAr ? 'رأي مهندس الديكور والتصميم الداخلي:' : 'Interior Designer & Decorator Advice:'}
                    </span>
                    {(paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).advice[paintColorTemp]}
                  </div>
                </div>

              </div>

            </motion.div>

          </div>
        </section>

        {/* 3. جزء من مشاريعنا */}
        <section id="featured-projects" className="py-20 md:py-28 relative overflow-hidden border-t border-zinc-800/80 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-18 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">
                  {isAr ? (
                    <>جزء من <span className="text-blue-400">مشاريعنا</span></>
                  ) : (
                    <>Part of <span className="text-blue-400">Our Projects</span></>
                  )}
                </h2>
                <div className="w-16 h-[2px] bg-blue-500 rounded-full mt-3" />
              </div>
              <Link to="/projects" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-white font-semibold transition-all">
                {isAr ? 'شاهد كل المشاريع' : 'View All Projects'} <ArrowLeft className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
              </Link>
            </div>

            {loadingProjects ? (
               <div className="flex flex-col items-center justify-center py-20">
                 <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                 <p className="text-zinc-400 mt-4 text-sm">{isAr ? 'جاري جلب المشاريع...' : 'Fetching projects...'}</p>
               </div>
            ) : (
              <>
                {/* Mobile/Tablet Horizontal Snap Slider */}
                <div className="md:hidden flex flex-col gap-4">
                  {/* Swipe Help Note */}
                  <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs font-medium">
                    <span>↔</span>
                    <span>{isAr ? 'اسحب لليمين واليسار لرؤية باقي المشاريع' : 'Swipe left/right to see other projects'}</span>
                    <span>↔</span>
                  </div>

                  {/* Horizontal Scroll Area */}
                  <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 px-4 scrollbar-none -mx-4">
                    {featuredProjects.map((project) => (
                      <div 
                        key={project.id} 
                        onClick={() => openGallery(project)}
                        className="snap-start snap-always min-w-[280px] xs:min-w-[310px] w-[80vw] bg-[#111215] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col hover:border-white/[0.18] transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900 border-b border-zinc-800">
                          <img src={project.coverImage} alt={project.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent z-10" />
                          
                          <div className="absolute top-3 right-3 z-20">
                            <span className="px-3 py-1 bg-zinc-900/90 border border-zinc-700 text-zinc-300 text-[10px] font-semibold rounded-full">
                              {project.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-5 relative z-20 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{project.name}</h3>
                            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">{project.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px] text-blue-400 font-semibold border-t border-zinc-800/80 pt-3">
                            <span>{isAr ? 'عرض تفاصيل المعرض ←' : 'View Gallery Details ←'}</span>
                            {project.image.includes(',') && (
                              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md">
                                +{project.image.split(',').length - 1} {isAr ? 'صور' : 'Photos'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProjects.map((project) => (
                    <motion.div 
                      key={project.id} 
                      onClick={() => openGallery(project)}
                      whileHover={{ y: -4 }}
                      className="group relative bg-[#111215] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col h-full hover:border-white/[0.18] transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900 border-b border-zinc-800">
                        <img src={project.coverImage} alt={project.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent z-10" />
                        
                        <div className="absolute top-3 right-3 z-20">
                          <span className="px-3 py-1 bg-zinc-900/90 border border-zinc-700 text-zinc-300 text-[10px] font-semibold rounded-full">
                            {project.category}
                          </span>
                        </div>
                        
                        {project.video && (
                          <div className="absolute top-3 left-3 z-20 bg-zinc-900/90 border border-zinc-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-white text-[10px] font-semibold">{isAr ? 'فيديو' : 'Video'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 relative z-20 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-1">{project.name}</h3>
                          <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">{project.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-[11px] text-blue-400 font-semibold border-t border-zinc-800/80 pt-3">
                          <span>{isAr ? 'عرض تفاصيل المعرض ←' : 'View Gallery Details ←'}</span>
                          {project.image.includes(',') && (
                            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md">
                              +{project.image.split(',').length - 1} {isAr ? 'صور' : 'Photos'}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* =========================================================
            قسم مسرح الأسلاك الـ 3D التفاعلي: يقع مباشرة فوق قسم "ابدأ مشروعك معنا اليوم"
            ========================================================= */}
        <section id="wires-import-showcase" className="py-8 md:py-14 relative overflow-hidden bg-transparent border-t border-zinc-800/80">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* 🎬 مسرح موشن الأسلاك */}
            <div className="relative w-full aspect-[9/16] md:aspect-[16/9] min-h-[70vh] sm:min-h-[78vh] md:max-h-[80vh] mx-auto rounded-3xl overflow-hidden bg-zinc-950 border border-white/[0.08] shadow-md group">
              
              {/* 1. موشن الأسلاك الأصلي الـ 240 إطار */}
              <WiresAutoCanvas totalFrames={240} fps={30} fitMode="cover" className="w-full h-full" />
              
              {/* 2. تظليل سُفلي وعلوي خفيف للتمييز البصري */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-transparent to-zinc-950/50 z-10 pointer-events-none" />

              {/* 3. النصوص والشارات الطافية */}
              <div className="absolute inset-0 z-20 p-5 sm:p-8 md:p-12 flex flex-col justify-between items-center text-center">
                
                {/* شارة علوية طافية */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="w-full flex items-center justify-between gap-2"
                >
                  <span className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 text-white text-[11px] sm:text-xs font-semibold border border-zinc-700 backdrop-blur-md">
                    🇮🇹 🇹🇷 {isAr ? 'استيراد إيطاليا وتركيا المباشر' : 'Direct Italy & Turkey Import'}
                  </span>

                  <span className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 text-zinc-300 text-[10px] sm:text-xs font-semibold border border-zinc-700 backdrop-blur-md hidden xs:inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{isAr ? 'نحاس وألومنيوم صافي 100%' : '100% Pure Copper & Aluminum'}</span>
                  </span>
                </motion.div>

                {/* المحتوى والمواصفات المصغرة */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="mt-auto mb-2 w-full max-w-xl"
                >
                  <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                    {isAr ? (
                      <>أسلاك وكوابل إيطالية وتركية <span className="text-blue-400">من المصنع مباشرة</span></>
                    ) : (
                      <>Italian & Turkish Wires <span className="text-blue-400">Direct from Source</span></>
                    )}
                  </h3>

                  {/* شريحة الميزات المصغرة */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[10px] sm:text-xs font-semibold text-zinc-300">
                    <span className="px-3 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 backdrop-blur-md">🇮🇹 {isAr ? 'استيراد مباشر' : 'Direct Import'}</span>
                    <span className="px-3 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 backdrop-blur-md">⚡ {isAr ? 'نحاس إلكتروليتي' : 'Pure Copper'}</span>
                    <span className="px-3 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 backdrop-blur-md">🛡️ {isAr ? 'عزل معتمد' : 'Certified PVC'}</span>
                  </div>

                  {/* زر التسوق بالمتجر الإلكتروني */}
                  <div className="mt-5">
                    <Link 
                      to="/products"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm md:text-base transition-all duration-200 border border-blue-400/20 active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{isAr ? 'تسوق أسلاك النحاس والألومنيوم بالمتجر الإلكتروني ←' : 'Shop Store Wires ←'}</span>
                    </Link>
                  </div>
                </motion.div>

              </div>

            </div>

          </div>
        </section>

        {/* قسم اللعبة التفاعلية الحصرية: رحلة النور */}
        <section id="game-teaser" className="py-12 md:py-16 relative overflow-hidden border-t border-zinc-800/80 bg-transparent">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="relative bg-gradient-to-r from-blue-950/40 via-[#111215] to-zinc-950 border border-blue-500/20 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden text-right">
              
              <div className="flex items-center gap-5 flex-row">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-lg animate-pulse">
                  <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[10px] sm:text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>{isAr ? 'لعبة تفاعلية حصرية' : 'Exclusive Game'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {isAr ? 'رحلة النور | بطل الإنارة الحديثة 🎮' : 'Light Quest | Modern Enarah Hero 🎮'}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
                    {isAr
                      ? 'عالم مظلم يحتاج إلى شجاعتك! تحكم ببطل اللمبة بالقميص الأزرق، أنر المصابيح وشغل القاطع الرئيسي واكسب كود خصم حقيقي لمشترياتك.'
                      : 'A dark world awaits! Guide the Lightbulb Hero, bring light to the rooms, and win an exclusive discount coupon.'}
                  </p>
                </div>
              </div>

              <Link
                to="/game"
                className="w-full md:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <span>{isAr ? 'العب واكسب الخصم الآن' : 'Play & Win Discount'}</span>
                <ArrowLeft className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
              </Link>

            </div>
          </div>
        </section>

        {/* 5. ابدأ مشروعك */}
        <section id="start" className="py-20 md:py-28 relative overflow-hidden border-t border-zinc-800/80 bg-transparent">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="relative bg-[#111215] border border-white/[0.08] rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-sm"
            >
              <h2 className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                {isAr ? (
                  <>ابدأ مشروعك معنا <span className="text-blue-400">اليوم</span></>
                ) : (
                  <>Start Your Project With Us <span className="text-blue-400">Today</span></>
                )}
              </h2>
              <p className="relative z-10 text-zinc-300 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
                {isAr 
                  ? 'نحن هنا لنساعدك في تحويل رؤيتك إلى واقع مبهر. تواصل مع خبرائنا للحصول على استشارة هندسية وفنية لمشروعك، أو لطلب فواتير المواد وعروض الأسعار المتكاملة لمشروعك الكهربائي.'
                  : 'We are here to help you transform your vision into a stunning reality. Contact our experts for engineering and technical consultations, or to request material invoices and comprehensive quotes for your electrical project.'
                }
              </p>
              <Link to="/contact" className="relative z-10 inline-flex items-center gap-2.5 px-8 py-4 bg-white text-zinc-950 font-bold text-base md:text-lg rounded-xl hover:bg-zinc-100 transition-colors active:scale-95">
                <Zap className="w-5 h-5 text-amber-500" />
                {isAr ? 'تواصل معنا الآن' : 'Contact Us Now'}
              </Link>

              {/* روابط التواصل الاجتماعي للفيسبوك وتيك توك وإنستغرام */}
              <div className="flex justify-center mt-12 relative z-10">
                <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 ${
                  isAr ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  <span className={`text-zinc-400 text-xs font-semibold ${isAr ? 'pl-3 border-l' : 'pr-3 border-r'} border-zinc-800`}>
                    {isAr ? 'تابع صفحاتنا:' : 'Follow us:'}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <a 
                      href="https://www.facebook.com/share/1BxjvUxxvG/?mibextid=wwXIfr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
                      title="فيسبوك"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a 
                      href="https://www.instagram.com/enara_hadetha?igsh=MXVqaGlqdHN5cnM5OQ==" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-pink-600 transition-all duration-200 flex items-center justify-center"
                      title="إنستغرام"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a 
                      href="https://www.tiktok.com/@modernenara?_r=1&_t=ZS-96dCObkuFUK" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-black transition-all duration-200 flex items-center justify-center"
                      title="تيك توك"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2.01 3.7 2.37v3.83c-1.39-.09-2.74-.61-3.87-1.48a7.25 7.25 0 0 1-2.47-3.08v8.66c0 1.25-.26 2.5-.77 3.66a7.56 7.56 0 0 1-4.8 4.41c-1.25.38-2.57.44-3.85.17a7.66 7.66 0 0 1-5.18-4.47 7.7 7.7 0 0 1 .15-5.06c.55-1.42 1.56-2.65 2.87-3.48a7.84 7.84 0 0 1 7.21-.57v4.02a3.79 3.79 0 0 0-2.31 1.09 3.73 3.73 0 0 0-1.12 2.3c-.09.78.11 1.57.55 2.2a3.78 3.78 0 0 0 4.14 1.48c.88-.23 1.66-.78 2.2-1.52.54-.75.82-1.65.79-2.57V.02z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* معرض الصور المنبثق التفاعلي للمشاريع (Lightbox Gallery) */}
        <AnimatePresence>
          {selectedProject && (() => {
            const imageUrls = selectedProject.image
              .split(',')
              .map((url) => url.trim())
              .filter(Boolean)

            return (
              <motion.div
                key="lightbox-gallery-overlay-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-md overflow-y-auto"
              >
                <div className="absolute inset-0 z-0" onClick={() => setSelectedProject(null)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative z-10 w-full max-w-5xl bg-[#0d2342]/95 border border-blue-500/25 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] lg:max-h-[85vh]"
                >
                  {/* زر الإغلاق */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-5 left-5 z-30 p-2.5 bg-white/5 hover:bg-red-500/80 border border-white/10 hover:border-red-500 text-white rounded-full transition-all duration-300 active:scale-95 shadow-md"
                    aria-label="إغلاق المعرض"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* الجانب الأيمن (معرض الصور) */}
                  <div className="w-full lg:w-2/3 p-5 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-white/5 bg-black/25">
                    <div className="relative aspect-[4/3] w-full max-h-[45vh] lg:max-h-[50vh] rounded-[1.8rem] overflow-hidden bg-[#0a192f] flex items-center justify-center shadow-inner group/viewer">
                      <motion.img
                        key={activeImageIndex}
                        src={imageUrls[activeImageIndex] || '/images/default-product.jpg'}
                        alt={`${selectedProject.name} image`}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }}
                      />
                      
                      {/* أزرار التنقل */}
                      {imageUrls.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handlePrevImage(imageUrls.length); }}
                            className="absolute right-4 p-3 bg-black/40 hover:bg-blue-600/80 border border-white/5 text-white rounded-2xl transition-all duration-300 active:scale-90 shadow-md backdrop-blur-sm"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleNextImage(imageUrls.length); }}
                            className="absolute left-4 p-3 bg-black/40 hover:bg-blue-600/80 border border-white/5 text-white rounded-2xl transition-all duration-300 active:scale-90 shadow-md backdrop-blur-sm"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* الصور المصغرة */}
                    {imageUrls.length > 1 && (
                      <div className="flex items-center gap-3 overflow-x-auto py-3 px-1 mt-4 scrollbar-thin scrollbar-thumb-white/10 justify-center">
                        {imageUrls.map((url, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                              idx === activeImageIndex
                                ? 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] scale-105'
                                : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                            }`}
                          >
                            <img src={url} alt="thumbnail" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* الجانب الأيسر (تفاصيل المشروع) */}
                  <div className="w-full lg:w-1/3 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-6">
                      <div>
                        <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.1)] inline-block mb-3">
                          {selectedProject.category}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{selectedProject.name}</h2>
                      </div>

                      <div className="h-px bg-white/5 w-full" />

                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-400 font-sans">عن المشروع:</h4>
                        <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap font-medium">{selectedProject.description}</p>
                      </div>
                    </div>

                    <div className="pt-8 space-y-3">
                      {selectedProject.video && (
                        <a
                          href={selectedProject.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-98"
                        >
                          <PlayCircle className="w-5.5 h-5.5" />
                          شاهد فيديو المشروع
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })()}
        </AnimatePresence>

      </div>
    </>
  )
}

