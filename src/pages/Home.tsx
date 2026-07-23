import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useShake } from '../hooks/use-shake'
import { useLanguage } from '../hooks/useLanguage'
import { useCart } from '../hooks/useCart'
import {
  Award, Shield, Sparkles, Zap, ArrowLeft, Loader2,
  TrendingUp, TrendingDown, Minus, ShieldCheck, Calendar, ShoppingCart, X, CheckCircle, Lightbulb, MessageCircle,
  Facebook, Instagram, ChevronRight, ChevronLeft, PlayCircle, Check, Calculator, Video
} from 'lucide-react'

// نمط الوهج
const glowingTitleStyle = { textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)' }

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '50px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} transition={{ duration: 0.5, delay, ease: "easeOut" }} style={{ willChange: "opacity, transform" }}>
      {children}
    </motion.div>
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

export default function Home() {
  const { t, isAr } = useLanguage()
  const paintColors = getPaintColors(isAr)
  const { scrollYProgress } = useScroll()

  // Map scroll progress to filament brightness, light cone opacity, and spotlight scale
  const filamentColor = useTransform(scrollYProgress, [0, 0.45], ["#475569", "#fbbf24"])
  const filamentGlow = useTransform(scrollYProgress, [0, 0.45], [
    "drop-shadow(0 0 0px rgba(0,0,0,0))", 
    "drop-shadow(0 0 8px rgba(245,158,11,0.85))"
  ])
  const spotlightOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.45])
  const spotlightScale = useTransform(scrollYProgress, [0, 0.6], [0.85, 1.25])
  const spotlightRotate = useTransform(scrollYProgress, [0, 0.6], [0, -12])
  const bulbAuraOpacity = useTransform(scrollYProgress, [0, 0.45], [0.1, 0.85])

  const [pageLoading, setPageLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [])
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
    const startTime = Date.now();

    const hideLoader = () => {
      const elapsedTime = Date.now() - startTime;
      const minDuration = 1200; // وقت أدنى 1.2 ثانية لتظهر شاشة التحميل بشكل أنيق

      if (elapsedTime >= minDuration) {
        setPageLoading(false);
      } else {
        setTimeout(() => {
          setPageLoading(false);
        }, minDuration - elapsedTime);
      }
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      const handleLoad = () => {
        hideLoader();
      };
      window.addEventListener('load', handleLoad);

      // احتياطياً في حال تعطل أي عنصر أو استغرق طويلاً، يختفي بعد ثانيتين
      const backupTimeout = setTimeout(() => {
        setPageLoading(false);
      }, 2000);

      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(backupTimeout);
      };
    }
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

          const heroVideoEntry = data.data.find((item: any) => item.email === 'admin_hero_video@app.local' || item.type === 'hero_video')
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

          const secondaryVideoEntry = data.data.find((item: any) => item.email === 'admin_secondary_video@app.local' || item.type === 'secondary_video')
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



        {/* 1. الواجهة الترحيبية بالفيديو فائق السرعة */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full z-0 bg-[#0a192f] overflow-hidden flex items-center justify-center">
            
            {/* فيديو الخلفية الترحيبي فائق السرعة والمسرّع بالعتاد يعمل على كافة الهواتف والحواسيب */}
            <video
              ref={videoRef}
              key={heroVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/poster.jpg"
              className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none opacity-50 z-0"
              style={{ transform: 'translateZ(0)', willChange: 'transform' }}
            >
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
            
            {/* طبقة تظليل داكنة إضافية لضمان راحة العين ووضوح النصوص بنسبة 100% */}
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/40 via-transparent to-[#0a192f] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-10 md:mt-20">

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-normal tracking-tight text-white py-2">
                <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)]">{t('hero.title.part1')}</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 drop-shadow-[0_0_35px_rgba(59,130,246,0.7)]">{t('hero.title.part2')}</span>
              </h1>
              
              <p className="text-base md:text-2xl text-blue-50/90 mb-8 max-w-3xl mx-auto leading-relaxed font-medium px-2 shadow-sm">{t('hero.subtitle')}</p>
            </div>
        </section>

        {/* 2. لماذا نحن - شريحة ميزات تفاعلية عالمية (World-Class Interactive Feature Showcase) */}
        <section id="about" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          {/* بقع توهج نيونية خفيفة عائمة */}
          <div className="hidden md:block absolute top-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="hidden md:block absolute bottom-1/4 right-0 w-72 h-72 bg-blue-400/5 rounded-full blur-[120px] pointer-events-none z-0" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">
                {isAr ? 'لماذا' : 'Why'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">
                  {isAr ? 'نحن؟' : 'Choose Us?'}
                </span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-medium">
                {isAr 
                  ? 'تجربة متكاملة تجمع بين الجودة المعتمدة، الأسعار المنافسة، والدعم الفني السريع' 
                  : 'An integrated experience combining certified quality, competitive pricing, and fast technical support'}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-4">
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              </div>
            </div>

            {/* مفاتيح التنقل بين الشرائح (Interactive Harmonized Tab Segmented Control) */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-3 max-w-xl mx-auto mb-4 p-1.5 rounded-2xl bg-[#0a192f] border border-blue-500/30 shadow-2xl">
              {[
                { id: 0, icon: Award, label: isAr ? 'جودة معتمدة' : 'Certified Quality', badge: '🛡️' },
                { id: 1, icon: Shield, label: isAr ? 'حلول متكاملة' : 'All-in-One', badge: '📦' },
                { id: 2, icon: Sparkles, label: isAr ? 'دعم فني' : 'Sales Support', badge: '📞' }
              ].map((tab) => {
                const isActive = activeWhySlide === tab.id
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveWhySlide(tab.id)}
                    className={`relative px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center justify-center gap-1.5 flex-1 cursor-pointer outline-none text-center ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeWhyTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl border border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.6)] -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      />
                    )}
                    <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                    <span className="text-xs hidden md:inline">{tab.badge}</span>
                  </button>
                )
              })}
            </div>

            {/* مؤشر حركي توضيحي يدعو للتنقل بين اللقطات */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-[11px] font-bold text-blue-300 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-400/25 shadow-sm animate-pulse flex items-center gap-1.5">
                <span>{isAr ? 'انقر الأسهم أو التبويبات لرؤية اللقطة التالية 👈' : 'Click arrows or tabs to view next slide 👈'}</span>
              </span>
            </div>

            {/* مسرح الشريحة التفاعلية (World-Class Interactive Showcase Stage) */}
            <div className="relative max-w-5xl mx-auto">

              {/* أسهم تنقل بارزة عائمة على جانبي البطاقة للتنقل الفوري (Floating Side Navigation Arrows) */}
              <button
                onClick={() => setActiveWhySlide((prev) => (prev - 1 + 3) % 3)}
                className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-6 z-30 p-3 sm:p-3.5 rounded-full bg-[#0a192f] hover:bg-blue-600 border border-blue-400/40 text-white transition-all duration-300 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(59,130,246,0.4)] group"
                title={isAr ? 'الشريحة السابقة (انقر لرؤية اللقطة الأخرى)' : 'Previous Slide'}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={() => setActiveWhySlide((prev) => (prev + 1) % 3)}
                className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-6 z-30 p-3 sm:p-3.5 rounded-full bg-[#0a192f] hover:bg-blue-600 border border-blue-400/40 text-white transition-all duration-300 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(59,130,246,0.4)] group"
                title={isAr ? 'الشريحة التالية (انقر لرؤية اللقطة الأخرى)' : 'Next Slide'}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWhySlide}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative p-6 sm:p-10 md:p-12 rounded-[2.5rem] bg-[#0c1e38] border border-blue-500/25 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  {/* لمسات الضوء النيونية الجانبية */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute inset-0 bg-animated-grid opacity-[0.04] pointer-events-none" />

                  {/* القسم الأيسر: التفاصيل والنقاط البارزة */}
                  <div className="lg:col-span-7 flex flex-col justify-between h-full relative z-10 text-right">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-black shadow-sm">
                          {activeWhySlide === 0 
                            ? (isAr ? 'مواد أصلية 🛡️' : 'Original Materials 🛡️')
                            : activeWhySlide === 1
                            ? (isAr ? 'شامل ومتكامل 📦' : 'All-in-One 📦')
                            : (isAr ? 'دعم مبيعات 📞' : 'Sales Support 📞')}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-snug tracking-wide">
                        {activeWhySlide === 0
                          ? (isAr ? 'جودة عالية ومواصفات إيطالية معتمدة' : 'High Certified Quality & Italian Standards')
                          : activeWhySlide === 1
                          ? (isAr ? 'حلول تأسيسية كهربائية وإنارة شاملة' : 'Integrated Electrical & Lighting Solutions')
                          : (isAr ? 'دعم فني واستشارات متخصصة مجاناً' : 'Fast Sales Support & Free Consultations')}
                      </h3>

                      <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6 font-medium">
                        {activeWhySlide === 0
                          ? (isAr ? 'نختار كافة مواد التأسيس والإنارة بعناية فائقة لتطابق أعلى معايير الجودة والسلامة العالمية لتدوم طويلاً دون مشاكل.' : 'We select all electrical installation and lighting materials with extreme care to meet top international safety and quality standards.')
                          : activeWhySlide === 1
                          ? (isAr ? 'نوفر لك كل ما تحتاجه لتأسيس منزلك أو مشروعك من كابلات، أسلاك إيطالية، مفاتيح ذكية، وسبوتات إنارة في مكان واحد دون عناء.' : 'We provide everything you need to set up your home or project, from cables and Italian wires to smart switches and spotlights in one stop.')
                          : (isAr ? 'فريقنا متواجد دائماً لمساعدتك في اختيار المنتجات المناسبة وتوفير الكميات المطلوبة وحساب أحمال الكهرباء بدقة لتجنب أي هدر.' : 'Our specialized team is always available to help you select products, request custom volumes, and calculate electrical loads accurately.')}
                      </p>

                      {/* قائمة المميزات الممتدة (Extended Feature List) */}
                      <div className="space-y-3.5 mb-2">
                        {(activeWhySlide === 0
                          ? (isAr ? [
                              'منتجات أصلية معتمدة وفق أعلى معايير الجودة والسلامة العالمية.',
                              'عزل حراري وكهربائي ممتاز يدوم لسنوات طويلة دون تلف.',
                              'ضمان حقيقي وااختبار قياسي شامل قبل التوريد لجميع العملاء.',
                              'حماية كاملة للمبنى والأسلاك من أخطار التماس والحرارة.'
                            ] : [
                              'Certified original products meeting top international safety standards.',
                              'Superior thermal and electrical insulation built to last without decay.',
                              'Real warranty and comprehensive testing prior to customer delivery.',
                              'Complete building and wiring protection from electrical hazards.'
                            ])
                          : activeWhySlide === 1
                          ? (isAr ? [
                              'توفير كافة مستلزمات التأسيس والإنارة من مكان واحد بدون عناء.',
                              'كابلات، أسلاك إيطالية، مفاتيح ذكية وسبوتات بأحدث التقنيات.',
                              'تجهيز كامل للكميات والمشاريع بأسعار معتمدة ومنافسة.',
                              'حلول ديكورية وإنارية متكاملة تناسب جميع التصاميم والمعايير.'
                            ] : [
                              'All electrical and lighting requirements provided effortlessly in one place.',
                              'Italian wires, smart switches, and spotlights with modern tech.',
                              'Complete project volume provisioning at competitive standard prices.',
                              'Integrated decorative lighting solutions tailored to all designs.'
                            ])
                          : (isAr ? [
                              'فريق مهندسين وفنيين متخصصين لإجابة كافة استفساراتك.',
                              'حساب الأحمال والتكلفة والكميات المطلوبة بدقة بدون هدر.',
                              'متابعة مستمرة وتنسيق كامل حتى وصول طلبك بأمان.',
                              'توصيل سريع ومضمون لكافة المدن والمشاريع والمناطق.'
                            ] : [
                              'Dedicated engineers and specialists to answer all your queries.',
                              'Accurate calculation of loads, quantities, and budgets without waste.',
                              'Continuous tracking and coordination until safe order arrival.',
                              'Fast and guaranteed delivery to all cities and project sites.'
                            ])
                        ).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="p-1 rounded-full bg-blue-500/20 text-blue-400 shrink-0 border border-blue-400/30">
                              <CheckCircle className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs sm:text-sm text-slate-200 font-bold">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* القسم الأيمن: بطاقة عرض ثلاثية الأبعاد تفاعلية */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center relative z-10">
                    <div className="relative w-full max-w-xs p-6 sm:p-8 rounded-[2rem] bg-[#0a192f] border border-blue-400/25 shadow-2xl flex flex-col items-center text-center group transition-all duration-500 hover:border-blue-400/50">
                      {/* هالة ضوئية متوهجة */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-blue-600/20 border border-blue-400/40 flex items-center justify-center mb-6 shadow-[0_0_35px_rgba(59,130,246,0.3)]">
                        {activeWhySlide === 0 && <Award className="w-12 h-12 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.85)] animate-pulse" />}
                        {activeWhySlide === 1 && <Shield className="w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.85)] animate-pulse" />}
                        {activeWhySlide === 2 && <Sparkles className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.85)] animate-pulse" />}
                      </div>

                      <span className="text-3xl sm:text-4xl font-black text-white block mb-1">
                        {activeWhySlide === 0 ? '100%' : activeWhySlide === 1 ? '100%' : '24/7'}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-blue-300 block mb-4">
                        {activeWhySlide === 0 
                          ? (isAr ? 'منتجات أصلية معتمدة' : 'Certified Original Products')
                          : activeWhySlide === 1
                          ? (isAr ? 'تأسيس وإنارة شاملة' : 'Full Installation & Lighting')
                          : (isAr ? 'استشارات واستجابة فورية' : 'Instant Consultations & Support')}
                      </span>
                      <span className="inline-block w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-400">
                        {isAr ? 'اعتمادات ومواصفات عالمية 2026' : 'Global Certified Standards 2026'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* مؤشرات التصفح السفلية */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveWhySlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeWhySlide === idx
                        ? 'w-8 bg-blue-500 shadow-[0_0_12px_#3b82f6]'
                        : 'w-2.5 bg-white/20 hover:bg-white/40'
                    }`}
                    title={isAr ? `انقل للشريحة ${idx + 1}` : `Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            قسم عرض الفيديو الثاني (بدون عنوان - مشغل تلقائي مستمر)
            ========================================================= */}
        <section id="showcase-video" className="py-12 md:py-16 relative overflow-hidden bg-transparent border-t border-white/[0.05]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* مسرح الفيديو الثاني - يعمل تلقائياً وباستمرار بدون عناوين */}
            <div className="relative rounded-[2.5rem] overflow-hidden border border-blue-500/30 bg-[#0a192f]/90 shadow-[0_0_50px_rgba(59,130,246,0.25)] group">
              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                <video
                  key={secondaryVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster="/poster.jpg"
                  className="w-full h-full object-cover"
                  style={{ transform: 'translateZ(0)' }}
                >
                  <source src={secondaryVideoUrl} type="video/mp4" />
                </video>
              </div>
            </div>

          </div>
        </section>

        {/* 2.5 مُحاكي الإضاءة التفاعلي المبتكر */}
        <section id="simulator" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">
                {t('sim.title.part1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">{t('sim.title.part2')}</span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                {t('sim.desc')}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-4">
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              </div>
            </div>

            <div className={`flex flex-col lg:flex-row items-center justify-center gap-8 bg-[#0f213a] border border-white/5 p-6 md:p-8 rounded-[2.5rem] shadow-xl ${
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
                <div className={`absolute bottom-4 z-20 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 ${
                  isAr ? 'right-4' : 'left-4'
                }`}>
                  <span className="text-[11px] font-bold text-blue-200">
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
                  <h4 className={`text-base font-bold text-slate-300 mb-3 font-sans ${isAr ? 'text-right' : 'text-left'}`}>{t('sim.opt1')}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'warm', name: isAr ? 'أصفر 3000K' : 'Warm 3000K', bg: 'bg-[#eab308]/20 border-[#eab308]/40 text-[#fde047]' },
                      { key: 'natural', name: isAr ? 'شمسي 4000K' : 'Natural 4000K', bg: 'bg-[#fef08a]/10 border-[#fef08a]/30 text-[#fef08a]' },
                      { key: 'cool', name: isAr ? 'أبيض 6000K' : 'White 6000K', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setSimColor(btn.key as any)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
                          simColor === btn.key 
                            ? `${btn.bg} ring-2 ring-blue-500/50 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.15)]` 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {btn.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. تشغيل مصادر الإضاءة المختلفة */}
                <div>
                  <h4 className={`text-base font-bold text-slate-300 mb-3 font-sans ${isAr ? 'text-right' : 'text-left'}`}>{t('sim.opt2')}</h4>
                  <div className={`flex flex-col sm:flex-row gap-4 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* زر السبوت لايت */}
                    <button
                      onClick={() => setSimSpot(!simSpot)}
                      className={`flex-1 py-4 px-5 rounded-2xl border font-bold flex items-center justify-between transition-all duration-300 ${
                        simSpot
                          ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm">{isAr ? 'السبوت لايت (Spotlight)' : 'Spotlight'}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${simSpot ? 'bg-blue-500 border-blue-400 animate-pulse' : 'border-slate-500'}`} />
                    </button>
                    
                    {/* زر الإنارة المخفية */}
                    <button
                      onClick={() => setSimLed(!simLed)}
                      className={`flex-1 py-4 px-5 rounded-2xl border font-bold flex items-center justify-between transition-all duration-300 ${
                        simLed
                          ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm">{isAr ? 'الإنارة المخفية (LED Strip)' : 'Cove Light (LED Strip)'}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${simLed ? 'bg-blue-500 border-blue-400 animate-pulse' : 'border-slate-500'}`} />
                    </button>
                  </div>
                </div>

                {/* نصيحة الخبراء الهندسية */}
                <div className={`bg-[#0a192f] border border-blue-500/15 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-slate-300 ${
                  isAr ? 'text-right flex-row' : 'text-left flex-row-reverse'
                }`}>
                  <div className="text-xl">💡</div>
                  <div className="flex-grow">
                    <span className="font-bold text-blue-300 block mb-0.5">{t('sim.tip')}</span>
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
        <section id="paint-matching" className="py-16 md:py-20 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          {/* بقعة توهج نيونية خفيفة */}
          <div className="hidden md:block absolute top-1/2 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight font-sans text-white">
                {isAr ? (
                  <>دليل تطابق <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">الطلاء والإضاءة</span></>
                ) : (
                  <>Paint & Lighting <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">Matching Guide</span></>
                )}
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                {isAr 
                  ? 'اكتشف كيف يتأثر لون طلاء جدران بيتك بحرارة لون الإضاءة المختلفة لتتجنب الأخطاء الشائعة في التصميم الداخلي'
                  : 'Discover how your home wall paint color is affected by different lighting color temperatures to avoid common interior design mistakes'
                }
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-4">
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              </div>
            </div>

            <motion.div 
              initial={{ borderColor: "rgba(255,255,255,0.05)", boxShadow: "none" }}
              whileInView={{ 
                borderColor: "rgba(59,130,246,0.2)", 
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.12)" 
              }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-[#0f213a] border p-6 md:p-8 rounded-[2.5rem] relative"
            >
              {/* شاشة العرض - زاوية ثلاثية الأبعاد 3D Room Corner */}
              <div className="w-full lg:w-[38%] max-w-[360px] flex flex-col gap-4">
                <div className="w-full aspect-[4/3] rounded-2xl relative overflow-hidden bg-[#080d1a] shadow-2xl border border-white/10 transition-all duration-500">
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
                    <div className="w-10 h-2 bg-slate-800 rounded-full border border-slate-700/50 shadow-inner" />
                    <div className="w-1.5 h-3 bg-gradient-to-r from-slate-600 to-slate-500" />
                    <div className="w-7 h-7 bg-slate-900 border border-slate-700 rounded-t-sm rounded-b-md flex items-center justify-center shadow-lg relative">
                      <div className={`w-5 h-2 rounded-full blur-[1px] transition-all duration-300 ${
                        paintColorTemp === 'warm' ? 'bg-amber-300 shadow-[0_0_12px_#f59e0b]' :
                        paintColorTemp === 'natural' ? 'bg-yellow-100 shadow-[0_0_12px_#fef08a]' :
                        'bg-sky-200 shadow-[0_0_12px_#38bdf8]'
                      }`} />
                    </div>
                  </div>

                  {/* 3D Indicator Badge */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/5 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] text-white/60 font-bold font-sans">{isAr ? 'عرض ثلاثي الأبعاد 3D' : '3D View'}</span>
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
                    className="absolute bottom-4 right-4 z-20 flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600/80 hover:bg-blue-600 border border-blue-500 text-[9px] text-white font-bold transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)] active:scale-95 cursor-pointer"
                  >
                    <span>{isAr ? 'تفعيل هز الهاتف 📱' : 'Enable Phone Shake 📱'}</span>
                  </button>
                </div>

                {/* مؤشر اللون الحالي */}
                <div className="flex items-center justify-between bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5 text-xs text-slate-300">
                  <span>{isAr ? 'الطلاء:' : 'Paint:'} <strong className="text-white">{(paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).name}</strong></span>
                  <span>{isAr ? 'الضوء:' : 'Light:'} <strong className="text-blue-300">
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
                  <h4 className="text-base font-bold text-slate-300 mb-3 font-sans">
                    {isAr ? '1. اختر لون طلاء الجدار:' : '1. Choose Wall Paint Color:'}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {paintColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedPaintId(color.id)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-300 flex flex-col items-center gap-2 ${
                          selectedPaintId === color.id
                            ? 'bg-blue-600/10 border-blue-500 text-white ring-2 ring-blue-500/30'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
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
                  <h4 className="text-base font-bold text-slate-300 mb-3 font-sans">
                    {isAr ? '2. اختر حرارة لون الإضاءة:' : '2. Choose Light Color Temp:'}
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'warm', name: isAr ? 'أصفر 3000K' : 'Yellow 3000K', bg: 'bg-[#eab308]/20 border-[#eab308]/40 text-[#fde047]' },
                      { key: 'natural', name: isAr ? 'شمسي 4000K' : 'Natural 4000K', bg: 'bg-[#fef08a]/10 border-[#fef08a]/30 text-[#fef08a]' },
                      { key: 'cool', name: isAr ? 'أبيض 6000K' : 'White 6000K', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setPaintColorTemp(btn.key as any)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
                          paintColorTemp === btn.key
                            ? `${btn.bg} ring-2 ring-blue-500/50 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.15)]`
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {btn.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* النصيحة الهندسية الذكية */}
                <div className="bg-[#0a192f] border border-blue-500/15 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-slate-300">
                  <div className="text-xl">📐</div>
                  <div>
                    <span className="font-bold text-blue-300 block mb-1">
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
        <section id="featured-projects" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          {/* بقع توهج نيونية خفيفة عائمة */}
          <div className="hidden md:block absolute top-1/3 right-0 w-80 h-80 bg-blue-50/5 rounded-full blur-[150px] pointer-events-none z-0 animate-float-2" />
          <div className="hidden md:block absolute bottom-1/3 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-[150px] pointer-events-none z-0 animate-float-1" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">
                  {isAr ? (
                    <>جزء من <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">مشاريعنا</span></>
                  ) : (
                    <>Part of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">Our Projects</span></>
                  )}
                </h2>
                <div className="w-20 h-[3px] bg-gradient-to-l from-blue-500 to-indigo-500 rounded-full mt-3 shadow-[0_1px_5px_rgba(59,130,246,0.3)]" />
              </div>
              <Link to="/projects" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                {isAr ? 'شاهد كل المشاريع' : 'View All Projects'} <ArrowLeft className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
              </Link>
            </div>

            {loadingProjects ? (
               <div className="flex flex-col items-center justify-center py-20">
                 <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                 <p className="text-blue-200 mt-4">{isAr ? 'جاري جلب المشاريع...' : 'Fetching projects...'}</p>
               </div>
            ) : (
              <>
                {/* Mobile/Tablet Horizontal Snap Slider */}
                <div className="md:hidden flex flex-col gap-4">
                  {/* Swipe Help Note */}
                  <div className="flex items-center justify-center gap-1.5 text-blue-400 text-xs font-bold animate-pulse">
                    <span>↔</span>
                    <span>{isAr ? 'اسحب لليمين واليسار لرؤية باقي المشاريع' : 'Swipe left/right to see other projects'}</span>
                    <span>↔</span>
                  </div>

                  {/* Horizontal Scroll Area */}
                  <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 px-4 scrollbar-none -mx-4">
                    {featuredProjects.map((project) => (
                      <div 
                        key={project.id}
                        onClick={() => openGallery(project)}
                        className="snap-start snap-always min-w-[280px] xs:min-w-[310px] w-[80vw] bg-[#0f213a] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col hover:border-blue-500/50 transition-all duration-300 cursor-pointer shadow-lg"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-[#0a192f] border-b border-white/5">
                          <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/95 via-[#0a192f]/40 to-transparent opacity-95 z-10" />
                          
                          <div className="absolute top-3 right-3 z-20">
                            <span className="px-3.5 py-1 bg-[#0a192f]/90 border border-blue-500/30 text-blue-300 text-[10px] font-bold rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                              {project.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-5 relative z-20 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-extrabold text-white mb-2 line-clamp-1">{project.name}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">{project.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px] text-blue-400 font-bold border-t border-white/5 pt-3">
                            <span>{isAr ? 'عرض تفاصيل المعرض ←' : 'View Gallery Details ←'}</span>
                            {project.image.includes(',') && (
                              <span className="px-2 py-0.5 bg-blue-500/10 rounded-md">
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
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {featuredProjects.map((project) => (
                    <motion.div 
                      key={project.id} 
                      onClick={() => openGallery(project)}
                      whileHover={{ y: -6, scale: 1.01 }}
                      className="group relative bg-[#0f213a] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-blue-500/50 hover:shadow-[0_10px_35px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#0a192f] border-b border-white/5">
                        <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/95 via-[#0a192f]/40 to-transparent opacity-95 z-10" />
                        
                        <div className="absolute top-3 right-3 z-20">
                          <span className="px-3.5 py-1 bg-[#0a192f]/90 border border-blue-500/30 text-blue-300 text-[10px] font-bold rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                            {project.category}
                          </span>
                        </div>
                        
                        {project.video && (
                          <div className="absolute top-3 left-3 z-20 bg-[#0a192f]/90 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                            <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-white text-[10px] font-bold">{isAr ? 'فيديو' : 'Video'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 relative z-20 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors mb-2 line-clamp-1">{project.name}</h3>
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">{project.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-[11px] text-blue-400 font-bold border-t border-white/5 pt-3">
                          <span>{isAr ? 'عرض تفاصيل المعرض ←' : 'View Gallery Details ←'}</span>
                          {project.image.includes(',') && (
                            <span className="px-2 py-0.5 bg-blue-500/10 rounded-md">
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

        {/* 4. نشرة الأسلاك الإيطالية */}
        <section id="wire-prices" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-full mb-4"><Zap className="w-6 h-6 text-yellow-400" /></div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-white">
                {isAr ? (
                  <>نشرة الأسلاك <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">الإيطالية</span></>
                ) : (
                  <>Italian Wires <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">Newsletter</span></>
                )}
              </h2>
              <div className="flex items-center justify-center gap-1.5 mt-4 mb-6">
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              </div>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-200 font-bold text-sm">
                <Calendar className="w-4 h-4" /> {isAr ? `تحديث اليوم: ${currentDate}` : `Today's Update: ${currentDate}`}
              </div>
            </div>

            <motion.div
              initial={{ borderColor: 'rgba(255, 255, 255, 0.05)', boxShadow: '0 0 0px rgba(59, 130, 246, 0)' }}
              whileInView={{
                borderColor: 'rgba(59, 130, 246, 0.3)',
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)',
              }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="bg-[#0f213a] border rounded-[2rem] overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
              <div className="bg-white/5 p-5 border-b border-white/5 flex items-center justify-between relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-400" /> {isAr ? 'الأسعار التقريبية المعتمدة' : 'Approved Estimated Prices'}</h3>
              </div>
              <div className="divide-y divide-white/5 relative z-10">
                {wirePrices.map((wire, idx) => (
                  <div key={wire.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] border-r-2 border-transparent hover:border-blue-500 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0a192f] border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">{idx + 1}</div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-0.5">{getLocalizedSize(wire.size, isAr)}</h4>
                        <p className="text-xs text-slate-400">{isAr ? wire.type : 'Single (100m Roll)'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-blue-300">
                          {wire.price} <span className="text-xs font-normal text-slate-400">{isAr ? 'د.ل' : 'LYD'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${wire.trend === 'up' ? 'bg-green-500/10 border-green-500/30 text-green-400' : wire.trend === 'down' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}>
                          {wire.trend === 'up' && <TrendingUp className="w-4 h-4" />}{wire.trend === 'down' && <TrendingDown className="w-4 h-4" />}{wire.trend === 'same' && <Minus className="w-4 h-4" />}
                        </div>
                        <button 
                          onClick={(e) => handleAddToCart(e, wire)}
                          disabled={addingId === `wire-${wire.id}`}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all whitespace-nowrap cursor-pointer border ${
                            addingId === `wire-${wire.id}`
                              ? 'bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                              : 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:bg-blue-500 hover:scale-[1.03] active:scale-[0.97]'
                          }`}
                        >
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={addingId === `wire-${wire.id}` ? 'added' : 'add'}
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center gap-2"
                            >
                              {addingId === `wire-${wire.id}` ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>{isAr ? 'تمت الإضافة! ✓' : 'Added! ✓'}</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4" />
                                  <span>{isAr ? 'إضافة إلى السلة' : 'Add to Cart'}</span>
                                </>
                              )}
                            </motion.span>
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. ابدأ مشروعك */}
        <section id="start" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ scale: 0.98, borderColor: 'rgba(59, 130, 246, 0.2)', boxShadow: '0 0 0px rgba(59, 130, 246, 0)' }}
              whileInView={{
                scale: 1,
                borderColor: 'rgba(59, 130, 246, 0.45)',
                boxShadow: '0 0 35px rgba(59, 130, 246, 0.2)',
              }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8 }}
              className="relative bg-[#0f213a] border rounded-[2rem] p-8 md:p-16 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none animate-pulse [animation-duration:8s]" />
              <h2 className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6" style={glowingTitleStyle}>
                {isAr ? (
                  <>ابدأ مشروعك معنا <span className="text-blue-300">اليوم</span></>
                ) : (
                  <>Start Your Project With Us <span className="text-blue-300">Today</span></>
                )}
              </h2>
              <p className="relative z-10 text-blue-100/80 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                {isAr 
                  ? 'نحن هنا لنساعدك في تحويل رؤيتك إلى واقع مبهر. تواصل مع خبرائنا للحصول على استشارة هندسية وفنية لمشروعك، أو لطلب فواتير المواد وعروض الأسعار المتكاملة لمشروعك الكهربائي.'
                  : 'We are here to help you transform your vision into a stunning reality. Contact our experts for engineering and technical consultations, or to request material invoices and comprehensive quotes for your electrical project.'
                }
              </p>
              <Link to="/contact" className="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-extrabold text-lg rounded-2xl hover:bg-slate-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                <Zap className="w-6 h-6" />
                {isAr ? 'تواصل معنا الآن' : 'Contact Us Now'}
              </Link>

              {/* روابط التواصل الاجتماعي للفيسبوك وتيك توك وإنستغرام */}
              <div className="flex justify-center mt-12 animate-fade-in relative z-10">
                <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0a192f]/40 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] ${
                  isAr ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  <span className={`text-slate-400 text-xs font-bold font-sans ${isAr ? 'pl-3 border-l' : 'pr-3 border-r'} border-white/10`}>
                    {isAr ? 'تابع صفحاتنا:' : 'Follow us:'}
                  </span>
                  <div className="flex items-center gap-3">
                    <a 
                      href="https://www.facebook.com/share/1BxjvUxxvG/?mibextid=wwXIfr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                      title="فيسبوك"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://www.instagram.com/enara_hadetha?igsh=MXVqaGlqdHN5cnM5OQ==" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-pink-600/10 border border-pink-500/20 text-pink-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.1)]"
                      title="إنستغرام"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://www.tiktok.com/@modernenara?_r=1&_t=ZS-96dCObkuFUK" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-200/10 border border-white/10 text-slate-200 hover:text-white hover:bg-black hover:border-slate-800 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      title="تيك توك"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
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

        {/* 🚀 الأيقونات الاجتماعية العائمة */}
        <div className="fixed left-6 bottom-24 z-40 hidden md:flex flex-col gap-3 animate-fade-in">
          <a 
            href="https://www.facebook.com/share/1BxjvUxxvG/?mibextid=wwXIfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl bg-[#0f213a]/90 backdrop-blur-md border border-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            title="تابعنا على فيسبوك"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a 
            href="https://www.instagram.com/enara_hadetha?igsh=MXVqaGlqdHN5cnM5OQ==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl bg-[#0f213a]/90 backdrop-blur-md border border-blue-500/20 text-pink-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(236,72,153,0.1)] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            title="تابعنا على إنستغرام"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a 
            href="https://www.tiktok.com/@modernenara?_r=1&_t=ZS-96dCObkuFUK" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl bg-[#0f213a]/90 backdrop-blur-md border border-blue-500/20 text-slate-300 hover:text-white hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            title="تابعنا على تيك توك"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2.01 3.7 2.37v3.83c-1.39-.09-2.74-.61-3.87-1.48a7.25 7.25 0 0 1-2.47-3.08v8.66c0 1.25-.26 2.5-.77 3.66a7.56 7.56 0 0 1-4.8 4.41c-1.25.38-2.57.44-3.85.17a7.66 7.66 0 0 1-5.18-4.47 7.7 7.7 0 0 1 .15-5.06c.55-1.42 1.56-2.65 2.87-3.48a7.84 7.84 0 0 1 7.21-.57v4.02a3.79 3.79 0 0 0-2.31 1.09 3.73 3.73 0 0 0-1.12 2.3c-.09.78.11 1.57.55 2.2a3.78 3.78 0 0 0 4.14 1.48c.88-.23 1.66-.78 2.2-1.52.54-.75.82-1.65.79-2.57V.02z"/>
            </svg>
          </a>
        </div>

      </div>
    </>
  )
}

