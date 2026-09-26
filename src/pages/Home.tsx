import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useShake } from '../hooks/use-shake'
import { useLanguage } from '../hooks/useLanguage'
import { useCart } from '../hooks/useCart'
import {
  Award, Shield, Sparkles, Zap, ArrowLeft, Loader2, Globe,
  TrendingUp, TrendingDown, Minus, ShieldCheck, Calendar, ShoppingCart, X, CheckCircle, Lightbulb, MessageCircle,
  Facebook, Instagram, ChevronRight, ChevronLeft, PlayCircle, Check, Calculator, Video, Phone, Headphones, Gamepad2,
  Layers, ImagePlus, FileText
} from 'lucide-react'
import EnarahProductsCarousel from '../components/EnarahProductsCarousel'
import type { ProjectItem } from '../data/projectsData'
import {
  getLocalizedProject,
  INITIAL_PROJECTS,
  getOptimizedProjectImages,
  getOptimizedProjectImageUrl
} from '../data/projectsData'
import { initHeroVideoCache, getOptimalHeroVideoPath } from '../utils/videoCache'
import { trackConversionEvent } from '../utils/analytics'

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

const getHomeBrands = (isAr: boolean) => [
  { id: 'legrand', name: 'Legrand', origin: isAr ? 'فرنسا 🇫🇷' : 'France 🇫🇷', description: isAr ? 'أنظمة تحكم ومفاتيح فاخرة' : 'Premium wiring & smart controls', logoUrl: '/images/brand-legrand.png?v=2' },
  { id: 'philips', name: 'Philips', origin: isAr ? 'هولندا 🇳🇱' : 'Netherlands 🇳🇱', description: isAr ? 'حلول إضاءة LED ومصابيح موفرة' : 'LED lighting & smart bulbs', logoUrl: '/images/brand-philips.png?v=2' },
  { id: 'gewiss', name: 'Gewiss', origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹', description: isAr ? 'أنظمة تشغيل آلي وتوزيع طاقة' : 'Building automation & power', logoUrl: '/images/brand-gewiss.png?v=2' },
  { id: 'chint', name: 'CHINT', origin: isAr ? 'الصين 🇨🇳' : 'China 🇨🇳', description: isAr ? 'قواطع آمنة ومعدات جهد منخفض' : 'Low-voltage gear & breakers', logoUrl: '/images/brand-chint.png?v=2' },
  { id: 'wellmax', name: 'WELLMAX', origin: isAr ? 'الصين 🇨🇳' : 'China 🇨🇳', description: isAr ? 'عملاق تكنولوجيا مصابيح Samsung LED' : 'Samsung LED chip technology', logoUrl: '/images/brand-wellmax.png?v=2' },
  { id: 'alfanar', name: 'Alfanar', origin: isAr ? 'السعودية 🇸🇦' : 'Saudi Arabia 🇸🇦', description: isAr ? 'كابلات نحاسية ولوحات توزيع آمنة' : 'Cables & distribution boards', logoUrl: '/images/brand-alfanar.png?v=2' },
  { id: 'fumagalli', name: 'Fumagalli', origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹', description: isAr ? 'إنارة حدائق خارجية مقاومة للصدأ' : 'Rustproof outdoor lighting', logoUrl: '/images/brand-fumagalli.png?v=2' },
  { id: 'commax', name: 'Commax', origin: isAr ? 'كوريا الجنوبية 🇰🇷' : 'South Korea 🇰🇷', description: isAr ? 'أنظمة إنترفون واتصال مرئي متطورة' : 'Intercom & smart visual systems', logoUrl: '/images/brand-commax.png?v=2' },
  { id: 'cata', name: 'CATA', origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷', description: isAr ? 'إضاءة زخرفية وسبوت لايت معماري' : 'Decorative & architectural spots', logoUrl: '/images/brand-cata.png?v=2' },
  { id: 'borsan', name: 'Borsan', origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷', description: isAr ? 'كابلات نحاسية وتجهيزات كهربائية' : 'Copper cables & installation tools', logoUrl: '/images/brand-borsan.png?v=2' },
  { id: 'makel', name: 'Makel', origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷', description: isAr ? 'مفاتيح ومقابس عصرية آمنة' : 'Modern safe switches & sockets', logoUrl: '/images/brand-makel.png?v=2' },
  { id: 'isildar', name: 'Isildar', origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷', description: isAr ? 'أنظمة تأسيس كهربائي وإضاءة' : 'Electrical foundation & lighting', logoUrl: '/images/brand-isildar.png?v=2' },
  { id: 'icc', name: 'ICC', origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹', description: isAr ? 'إكسسوارات توصيل وإنارة احترافية' : 'Pro lighting & wiring accessories', logoUrl: '/images/brand-icc.png?v=2' },
  { id: 'ecoliok', name: 'ECOLIOK', origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷', description: isAr ? 'حلول إنارة معمارية موفرة للطاقة' : 'Energy-saving lighting solutions', logoUrl: '/images/brand-ecoliok.png?v=2' },
  { id: 'carkit', name: 'Carkit', origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷', description: isAr ? 'حوامل كابلات ومجاري أسلاك' : 'Cable trays & metal trunks', logoUrl: '/images/brand-carkit.png?v=2' },
  { id: 'geros', name: 'Geros', origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹', description: isAr ? 'علب توزيع وخزائن مفاتيح ضد الماء' : 'Waterproof junction boxes', logoUrl: '/images/brand-geros.png?v=2' },
  { id: 'edison', name: 'Edison', origin: isAr ? 'الصين 🇨🇳' : 'China 🇨🇳', description: isAr ? 'أفياش وتوصيلات كهربائية آمنة' : 'Safe outlets & extensions', logoUrl: '/images/brand-edison.png?v=2' },
  { id: 'sharm', name: 'Sharm', origin: isAr ? 'الصين 🇨🇳' : 'China 🇨🇳', description: isAr ? 'نجف حديث وإنارة ديكورية معاصرة' : 'Modern chandeliers & decor', logoUrl: '/images/brand-sharm.png?v=2' }
]


export default function Home() {
  const { t, isAr } = useLanguage()
  const paintColors = getPaintColors(isAr)
  const homeBrands = getHomeBrands(isAr)

  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const secondaryVideoRef = useRef<HTMLVideoElement>(null)
  const whyUsScrollRef = useRef<HTMLDivElement>(null)
  const [activeWhyUsIndex, setActiveWhyUsIndex] = useState(0)
  const [showHeroContent, setShowHeroContent] = useState(false)
  const heroCompletedRef = useRef(false)

  // حالة مصدر فيديو الهيرو التكيفي والمحفوظ محلياً لمنع أي تقطيع نهائياً
  const [heroVideoSrc, setHeroVideoSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).__ENARAH_HERO_BLOB_URL__) {
        return (window as any).__ENARAH_HERO_BLOB_URL__
      }
      return getOptimalHeroVideoPath()
    }
    return '/hero-video.mp4'
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__ENARAH_HERO_BLOB_URL__) {
      setHeroVideoSrc((window as any).__ENARAH_HERO_BLOB_URL__)
    }

    const handleBlobReady = (e: any) => {
      const url = e.detail || (window as any).__ENARAH_HERO_BLOB_URL__
      if (url) {
        setHeroVideoSrc(url)
      }
    }

    window.addEventListener('enarah_video_blob_ready', handleBlobReady)
    initHeroVideoCache().then((blobUrl) => {
      if (blobUrl) {
        setHeroVideoSrc(blobUrl)
      }
    })

    return () => {
      window.removeEventListener('enarah_video_blob_ready', handleBlobReady)
    }
  }, [])

  const handleHeroVideoComplete = () => {
    if (showHeroContent) return
    setShowHeroContent(true)
    heroCompletedRef.current = true
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('enarah_hero_finished'))
    }
  }

  const handleWhyUsScroll = () => {
    const el = whyUsScrollRef.current
    if (!el) return
    const scrollLeft = Math.abs(el.scrollLeft)
    const cardWidth = el.clientWidth * 0.8
    if (cardWidth > 0) {
      const index = Math.min(2, Math.max(0, Math.round(scrollLeft / cardWidth)))
      setActiveWhyUsIndex(index)
    }
  }

  const scrollToWhyUsCard = (index: number) => {
    const el = whyUsScrollRef.current
    if (!el) return
    const targetCard = el.children[index] as HTMLElement | undefined
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
    setActiveWhyUsIndex(index)
  }

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
    // كخطة احتياطية في حال تعذر تشغيل الفيديو تلقائياً: إظهار المحتوى بعد اكتمال المدة (11 ثانية)
    const timer = setTimeout(() => {
      handleHeroVideoComplete()
    }, 11000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const forcePlayMobileVideo = (el: HTMLVideoElement | null) => {
      if (!el || !el.paused) return // حماية: إذا كان الفيديو يعمل بسلاسة فلا تعيد تشغيله لمنع التقطيع
      el.defaultMuted = true
      el.muted = true
      el.volume = 0
      el.playsInline = true
      
      const promise = el.play()
      if (promise !== undefined) {
        promise.catch(() => {})
      }
    }

    const playVideos = () => {
      forcePlayMobileVideo(heroVideoRef.current)
      forcePlayMobileVideo(secondaryVideoRef.current)
    }

    playVideos()

    window.addEventListener('touchstart', playVideos, { passive: true, once: true })
    window.addEventListener('scroll', playVideos, { passive: true, once: true })
    window.addEventListener('pointerdown', playVideos, { passive: true, once: true })

    return () => {
      window.removeEventListener('touchstart', playVideos)
      window.removeEventListener('scroll', playVideos)
      window.removeEventListener('pointerdown', playVideos)
    }
  }, [secondaryVideoUrl])

  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>(() => {
    return INITIAL_PROJECTS.map((p) => {
      const localized = getLocalizedProject(p, isAr)
      return {
        ...p,
        name: localized.name,
        category: localized.category,
        description: localized.description,
      }
    })
  })
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [wirePrices, setWirePrices] = useState<typeof defaultWireData>(defaultWireData)

  const { addToCart, triggerFlyAnimation } = useCart()
  const [addingId, setAddingId] = useState<string | null>(null)

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const [simColor, setSimColor] = useState<'warm' | 'natural' | 'cool'>('warm')
  const [simSpot, setSimSpot] = useState(true)
  const [simLed, setSimLed] = useState(false)
  const [selectedPaintId, setSelectedPaintId] = useState('white')
  const [paintColorTemp, setPaintColorTemp] = useState<'warm' | 'natural' | 'cool'>('warm')
  const [paintFlicker, setPaintFlicker] = useState(false)

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

  // استبعاد الكروت غير المرغوبة
  const isExcludedProject = (item: any) => {
    const name = String(item.name || '').toLowerCase().trim()
    const category = String(item.category || '').toLowerCase().trim()
    const desc = String(item.description || '').toLowerCase().trim()

    return name.includes('أسلاك') || name.includes('اسلاك') || name.includes('كوابل') ||
           name.includes('تأسيس') || name.includes('تاسيس') || name.includes('مفاتيح') || name.includes('برايز') ||
           category.includes('أسلاك') || category.includes('اسلاك') || category.includes('تأسيس') || category.includes('تاسيس') || category.includes('مفاتيح') || category.includes('برايز') ||
           desc.includes('الاسلاك الايطاليه') || desc.includes('مواد التاسيس') || desc.includes('تشكيله كبيره من المفاتيح')
  }

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
            .filter((item: any) => {
               let mediaData: any = {}
               try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}
               return !isExcludedProject({ name: item.name, category: mediaData.category, description: mediaData.description })
            })
            .map((item: any, index: number) => {
              let mediaData: any = {}
              try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}

              const rawImage = getOptimizedProjectImages(mediaData.imageUrl || '/images/default-product.jpg')
              const imageUrls = rawImage.split(',').map((url: string) => url.trim()).filter(Boolean)
              const coverImage = getOptimizedProjectImageUrl(imageUrls[0] || '/images/default-product.jpg')

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
          if (projectsOnly.length > 0) {
            const loadedProjects = projectsOnly.reverse()
            setFeaturedProjects(loadedProjects)
          }

          const sortedItems = [...data.data].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

          const heroVideoEntry = sortedItems.find((item: any) => item.email === 'admin_hero_video@app.local' || item.type === 'hero_video')
          if (heroVideoEntry) {
            try {
              const videoObj = JSON.parse(heroVideoEntry.phone)
              const vidUrl = videoObj.videoUrl || videoObj.imageUrl
              if (vidUrl) setHeroVideoUrl(vidUrl)
            } catch {}
          }

          const secondaryVideoEntry = sortedItems.find((item: any) => item.email === 'admin_secondary_video@app.local' || item.type === 'secondary_video')
          if (secondaryVideoEntry) {
            try {
              const videoObj = JSON.parse(secondaryVideoEntry.phone)
              const vidUrl = videoObj.videoUrl || videoObj.imageUrl
              if (vidUrl) setSecondaryVideoUrl(vidUrl)
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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      
      {/* 1. الواجهة الترحيبية السينمائية بكامل ارتفاع الشاشة (Full-Screen Cinematic Hero) */}
      <section 
        id="hero" 
        onClick={handleHeroVideoComplete}
        className="order-1 mobile-order-1 md:order-none relative h-screen min-h-[600px] sm:min-h-[680px] w-full flex items-center justify-center overflow-hidden bg-black select-none cursor-pointer"
        style={{
          contain: 'paint layout',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        {/* الفيديو السينمائي الجديد بدقة عالية وبتسريع عتادي مباشر والتخزين الدائم */}
        <video
          ref={heroVideoRef}
          src={heroVideoSrc}
          poster="/hero-poster.jpg"
          autoPlay
          loop
          muted
          defaultMuted
          playsInline
          webkit-playsinline="true"
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          onTimeUpdate={(e) => {
            const vid = e.currentTarget
            if (!heroCompletedRef.current && (vid.currentTime >= 9.6 || (vid.duration && vid.currentTime >= vid.duration - 0.35))) {
              heroCompletedRef.current = true
              handleHeroVideoComplete()
            }
          }}
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-95 pointer-events-none"
          style={{ 
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'transform'
          }}
        />

        {/* طبقة تظليل سينمائية داكنة تظهر بسلاسة متزامنة مع ظهور النصوص لحماية القراءة والتباين */}
        <div 
          className={`absolute inset-0 pointer-events-none z-1 transition-opacity duration-1000 ${
            showHeroContent ? 'opacity-100' : 'opacity-0'
          }`} 
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.4) 45%, rgba(0, 0, 0, 0.8) 100%)'
          }}
        />
        <div 
          className={`absolute inset-0 pointer-events-none z-1 transition-opacity duration-1000 ${
            showHeroContent ? 'opacity-100' : 'opacity-0'
          }`} 
          style={{
            background: isAr
              ? 'radial-gradient(circle at 80% 50%, rgba(37, 99, 235, 0.28) 0%, rgba(0, 0, 0, 0.4) 55%, transparent 80%)'
              : 'radial-gradient(circle at 50% 40%, rgba(37, 99, 235, 0.25) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 75%)'
          }}
        />

        {/* محتوى الهيرو: العنوان والأزرار يظهران بشكل أصغر وبانسيابية ناعمة جداً من اليمين */}
        <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-20 pb-12 flex flex-col pointer-events-auto ${
          isAr ? 'items-start text-right' : 'items-center text-center'
        }`}>
          <AnimatePresence>
            {showHeroContent && (
              <motion.div 
                key="hero-content"
                initial={{ opacity: 0, x: isAr ? 50 : 0, y: isAr ? 0 : 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col max-w-lg md:max-w-xl will-change-transform transform-gpu ${
                  isAr ? 'items-start text-right' : 'items-center text-center mx-auto'
                }`}
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <h1 className="mobile-hero-h1 text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold mb-2.5 sm:mb-3 leading-tight tracking-tight py-0.5 text-white">
                  <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">{t('hero.title.part1')}</span>{' '}
                  <span className="text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.85)]">{t('hero.title.part2')}</span>
                </h1>
                
                <p className="mobile-body text-xs sm:text-sm md:text-base text-slate-100/90 mb-4 sm:mb-5 leading-relaxed font-normal max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  {t('hero.subtitle')}
                </p>

                {/* أزرار الإجراء السريع في الهيرو بتنسيق متناسق وأنيق */}
                <div className={`flex flex-wrap items-center gap-2.5 sm:gap-3 ${
                  isAr ? 'justify-start' : 'justify-center'
                }`}>
                  <Link
                    to="/products"
                    onClick={() => trackConversionEvent('hero_cta_clicked', { target: 'products' })}
                    className="mobile-btn inline-flex items-center gap-2 px-4.5 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-lg shadow-blue-600/35 transition-all hover:scale-105 active:scale-95"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{isAr ? 'تصفح المتجر' : 'Shop Products'}</span>
                  </Link>

                  <Link
                    to="/contractors"
                    onClick={() => trackConversionEvent('hero_cta_clicked', { target: 'contractors' })}
                    className="mobile-btn inline-flex items-center gap-2 px-4.5 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-medium text-xs sm:text-sm shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                    <span>{isAr ? 'اطلب فاتورتك' : 'Request Your Invoice'}</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* إشعار خفيف أثناء تشغيل الثواني الأولى */}
        {!showHeroContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 inset-x-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <span className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/80 text-xs font-medium flex items-center gap-2 shadow-lg animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>{isAr ? 'انقر في أي مكان لعرض الروابط وتخطي العرض' : 'Click anywhere to view menu'}</span>
            </span>
          </motion.div>
        )}
      </section>

      {/* 2. لماذا نحن - تركيبة تحريرية ومعمارية منضبطة */}
      <section id="about" className="order-2 mobile-order-2 md:order-none mobile-section-py py-12 md:py-20 relative overflow-hidden border-t border-slate-200 bg-white mobile-bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* عنوان القسم بتصميم تحريري معماري غير متكرر */}
          <div className="mb-8 md:mb-12 pb-5 border-b border-slate-100 text-right">
            <span className="text-xs font-semibold text-blue-600 tracking-wider block mb-2">
              {isAr ? 'معايير الجودة والاعتماد' : 'Quality & Standards'}
            </span>
            <h2 className="mobile-section-h2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              {isAr ? (
                <>لماذا يختار المقاولون والمهندسون <span className="text-blue-600">الإنارة الحديثة؟</span></>
              ) : (
                <>Why Contractors & Engineers Choose <span className="text-blue-600">ENARAH Modern?</span></>
              )}
            </h2>
          </div>

          {/* شبكة البطاقات المعمارية: بدون زوايا مفرطة وبدون ظلال طافية */}
          <div 
            ref={whyUsScrollRef}
            onScroll={handleWhyUsScroll}
            className="flex md:grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-3 pt-1 px-4 -mx-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 items-stretch"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            
            {/* البطاقة الأولى: وكالات عالمية حصرية */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="w-[84vw] max-w-[310px] shrink-0 snap-center md:w-auto md:shrink md:snap-align-none relative p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm flex flex-col justify-between group transition-all duration-300 h-full"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {isAr ? 'وكالة معتمدة' : 'Official Agency'}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Globe className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="mobile-card-h3 text-base sm:text-lg font-semibold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {isAr ? 'وكالات عالمية حصرية' : 'Exclusive Global Agencies'}
                </h3>

                <p className="mobile-small text-slate-600 text-xs leading-relaxed mb-4 font-normal">
                  {isAr 
                    ? 'استيراد وتوريد مباشر من كبرى المصانع العالمية مع ضمان أصالة 100%.' 
                    : 'Direct import from leading global manufacturers with 100% authenticity guarantee.'}
                </p>

                <div className="space-y-2 mb-4">
                  {(isAr ? [
                    'منتجات أصلية معتمدة ومطابقة للمواصفات',
                    'استيراد مباشر من المصانع الأوروبية والعالمية'
                  ] : [
                    '100% certified authentic products in Libya',
                    'Direct import from certified international factories'
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2 text-blue-600 stroke-[3]" />
                      </div>
                      <span className="text-xs text-slate-700 font-medium leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-auto">
                <span>{isAr ? 'الأصالة والاعتماد' : 'Authenticity'}</span>
                <span className="text-blue-600 font-bold text-xs sm:text-sm">{isAr ? '100% مضمون' : '100% Guaranteed'}</span>
              </div>
            </motion.div>

            {/* البطاقة الثانية: توريد كبرى المشاريع والجملة */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="w-[84vw] max-w-[310px] shrink-0 snap-center md:w-auto md:shrink md:snap-align-none relative p-5 sm:p-6 rounded-xl bg-gradient-to-b from-blue-50/40 via-white to-white border border-blue-600/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm flex flex-col justify-between group transition-all duration-300 h-full"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                    {isAr ? 'توريد تجاري ومشاريع' : 'Commercial Supply'}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center transition-colors duration-300 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="mobile-card-h3 text-base sm:text-lg font-semibold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {isAr ? 'توريد كبرى المشاريع والجملة' : 'Bulk & Project Supply'}
                </h3>

                <p className="mobile-small text-slate-600 text-xs leading-relaxed mb-4 font-normal">
                  {isAr 
                    ? 'تجهيز فوري وشامل لطلبيات المقاولين والشركات ومحلات الكهرباء.' 
                    : 'Immediate fulfillment for contractors, companies, and retail shops.'}
                </p>

                <div className="space-y-2 mb-4">
                  {(isAr ? [
                    'أسعار جملة تنافسية وأسلاك إيطالية معتمدة',
                    'جاهزية مخازن لتغطية كافة المخططات الكبرى'
                  ] : [
                    'Competitive wholesale pricing & certified Italian wires',
                    'Full warehouse readiness for large-scale plans'
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2 text-white stroke-[3]" />
                      </div>
                      <span className="text-xs text-slate-800 font-semibold leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-auto">
                <span>{isAr ? 'جاهزية المستودعات' : 'Warehouse Readiness'}</span>
                <span className="text-blue-600 font-bold text-xs sm:text-sm">{isAr ? 'كميات متوفرة دائماً' : 'Always in Stock'}</span>
              </div>
            </motion.div>

            {/* البطاقة الثالثة: خدمة دعم فني سريع */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="w-[84vw] max-w-[310px] shrink-0 snap-center md:w-auto md:shrink md:snap-align-none relative p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm flex flex-col justify-between group transition-all duration-300 h-full"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {isAr ? 'استجابة سريعة' : 'Fast Response'}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Headphones className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="mobile-card-h3 text-base sm:text-lg font-semibold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {isAr ? 'خدمة دعم فني سريع' : 'Fast Technical Support'}
                </h3>

                <p className="mobile-small text-slate-600 text-xs leading-relaxed mb-4 font-normal">
                  {isAr 
                    ? 'فريق فني متخصص جاهز لمساعدتكم والإجابة على الاستفسارات وحل أي مسألة فنية.' 
                    : 'Specialized technical team ready to assist, answer questions, and resolve technical inquiries.'}
                </p>

                <div className="space-y-2 mb-4">
                  {(isAr ? [
                    'استجابة فورية ومتابعة مباشرة لكافة احتياجاتكم',
                    'إرشادات هندسية وفنية دقيقة قبل وبعد الشراء'
                  ] : [
                    'Rapid response and direct follow-up for all inquiries',
                    'Expert technical guidance before and after purchase'
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2 text-blue-600 stroke-[3]" />
                      </div>
                      <span className="text-xs text-slate-700 font-medium leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-auto">
                <span>{isAr ? 'سرعة الاستجابة' : 'Response Time'}</span>
                <span className="text-blue-600 font-bold text-xs sm:text-sm">{isAr ? 'فوري ومباشر' : 'Instant & Direct'}</span>
              </div>
            </motion.div>

          </div>

          {/* مؤشرات التمرير التفاعلية للهواتف فقط */}
          <div className="flex items-center justify-center gap-1.5 mt-4 md:hidden">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => scrollToWhyUsCard(idx)}
                aria-label={`Card ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeWhyUsIndex === idx ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 3. قسم شركة الإنارة - تركيبة تحريرية معمارية مفتوحة وإحصائيات موثوقة */}
      <section id="company-enarah" className="order-3 mobile-order-3 md:order-none mobile-section-py py-12 md:py-24 relative overflow-hidden bg-[#F8FAFD] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start" dir={isAr ? 'rtl' : 'ltr'}>
            
            {/* عمود الشعار والهوية الرسمية للشركة */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-right">
              <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-2xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3.5 flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
                <img 
                  src="/images/company-enarah-logo.jpg" 
                  alt="شعار شركة الإنارة - ENARAH" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {isAr ? 'تأسست 1988 | طرابلس - ليبيا' : 'EST. 1988 | Tripoli - Libya'}
                </span>
              </div>
            </div>

            {/* عمود السرد التحريري وسجل الخبرة العريق */}
            <div className="lg:col-span-8 text-right space-y-4">
              <span className="text-xs font-semibold text-blue-600 tracking-wider block">
                {isAr ? 'عراقة وخبرة لأكثر من ثلاثة عقود' : 'Over 3 Decades of Heritage'}
              </span>

              <h2 className="mobile-section-h2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                {isAr ? 'شركة الإنارة الحديثة' : 'ENARAH Modern Company'}
              </h2>

              <p className="mobile-body text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                {isAr 
                  ? 'شركة الإنارة لتجارة وتصنيع مواد التأسيس الكهربائي والاضاءات المختلفة، إحدى الشركات الرائدة في السوق الليبي منذ تأسيسها عام 1988.'
                  : 'Enarah Company for trading and manufacturing electrical foundation materials and various lightings, one of the leading companies in the Libyan market since its establishment in 1988.'}
              </p>

              <p className="mobile-small text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
                {isAr 
                  ? 'نمتلك خبرة طويلة في استيراد وتصنيع وتوزيع المنتجات الكهربائية، ونحرص دائماً على توفير أحدث المنتجات ذات الجودة العالية. بنينا شبكة واسعة من الفروع ونقاط التوزيع في مختلف المدن الليبية لخدمة عملائنا بكفاءة وموثوقية، ونفخر بكوننا موزعين ووكلاء معتمدين لنخبة من كبرى العلامات التجارية العالمية.'
                  : 'We possess extensive experience in importing, manufacturing, and distributing top-tier electrical products across a nationwide branch network serving clients with speed and reliability, and we are proud authorized distributors for world-renowned brands.'}
              </p>

              {/* صف الإحصائيات المعماري الهادئ: أرقام واثقة بدون صناديق ملونة أو زوايا مفرطة */}
              <div className="border-t border-slate-200/80 pt-6 mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="space-y-0.5">
                    <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">+36</span>
                    <span className="text-xs font-medium text-slate-500 block">{isAr ? 'عاماً خبرة' : 'Years Experience'}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 tracking-tight">1988</span>
                    <span className="text-xs font-medium text-slate-500 block">{isAr ? 'سنة التأسيس' : 'Established'}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{isAr ? 'فروع ليبيا' : 'Libya'}</span>
                    <span className="text-xs font-medium text-slate-500 block">{isAr ? 'تغطية شاملة' : 'Nationwide Branches'}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">100%</span>
                    <span className="text-xs font-medium text-slate-500 block">{isAr ? 'وكلاء وموزعون' : 'Certified Agency'}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. منتجات وتصنيع شركة الإنارة - عرض أفقي عالمي فاخر */}
      <section id="company-products" className="order-4 mobile-order-4 md:order-none mobile-section-py py-10 md:py-16 relative overflow-hidden bg-white mobile-bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <EnarahProductsCarousel isAr={isAr} />
        </div>
      </section>

      {/* 6. قسم شركاؤنا من العلامات العالمية - جدار علامات معماري منضبط */}
      <section id="brands-partners" className="order-6 mobile-order-6 md:order-none mobile-section-py py-12 md:py-24 relative overflow-hidden border-t border-slate-200 bg-white mobile-bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* عنوان القسم المعماري */}
          <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-blue-600 tracking-wider block mb-2">
              {isAr ? 'الشركاء والوكالات العالمية' : 'Global Brand Partners'}
            </span>
            <h2 className="mobile-section-h2 text-2xl sm:text-3xl md:text-4xl font-bold mb-3 tracking-tight text-slate-900">
              {isAr ? (
                <>شركاؤنا من <span className="text-blue-600">العلامات العالمية</span></>
              ) : (
                <>Our Partners of <span className="text-blue-600">Global Brands</span></>
              )}
            </h2>
            <p className="mobile-body text-slate-600 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
              {isAr 
                ? 'نتعاون مع نخبة من أبرز العلامات والشركات العالمية المتخصصة في الإضاءة والتجهيزات والمواد الكهربائية'
                : 'We collaborate with a group of the most prominent international brands and companies specialized in lighting and electrical equipment'
              }
            </p>
          </div>

          {/* جدار العلامات المعماري: شبكة متوازنة وهادئة بدون زوايا مفرطة وبدون كبسولات فاقعة */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {homeBrands.map((brand) => (
              <Link
                key={brand.id}
                to="/brands"
                className="group relative bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-4 flex flex-col items-center justify-between text-center transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-xs cursor-pointer h-full"
              >
                {/* Brand Logo Container */}
                <div className="w-full h-16 sm:h-20 flex items-center justify-center p-2 mb-3 relative overflow-hidden">
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain filter grayscale contrast-125 opacity-85 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const fallback = e.currentTarget.parentElement?.querySelector('.brand-fallback')
                      if (fallback) fallback.classList.remove('hidden')
                    }}
                  />
                  <div className="brand-fallback hidden absolute inset-0 flex items-center justify-center text-slate-800 font-bold text-sm tracking-wider select-none">
                    {brand.name}
                  </div>
                </div>

                {/* Brand Name & Quiet Country Label */}
                <div className="w-full border-t border-slate-100 pt-2.5">
                  <h3 className="mobile-card-h3 text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {brand.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5 truncate">
                    {brand.origin}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* زر استعراض كافة تفاصيل الوكالات والمنتجات بتصميم هندسي منضبط */}
          <div className="mt-8 md:mt-12 text-center">
            <Link
              to="/brands"
              className="mobile-btn inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm cursor-pointer"
            >
              <span>{isAr ? 'استعرض كافة الوكالات والشركات (18 علامة عالمية)' : 'Explore All 18 Global Agencies'}</span>
              <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? '' : 'rotate-180'}`} />
            </Link>
          </div>

        </div>
      </section>

      {/* قسم عرض الفيديو الثاني (بعرض الشاشة الكاملة 100% كما في الموقع الأصلي) */}
      <section id="showcase-video" className="order-6 mobile-order-6 md:order-none w-full py-6 md:py-10 relative overflow-hidden bg-white border-y border-slate-200">
        <div className="w-full relative z-10">
          <div className="relative w-full overflow-hidden bg-black shadow-2xl">
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
                preload="metadata"
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

      {/* 8. مُحاكي الإضاءة التفاعلي المبتكر (Interactive Simulator) */}
      <section id="simulator" className="order-8 mobile-order-8 md:order-none mobile-section-py py-12 md:py-24 relative overflow-hidden border-t border-slate-200 bg-white mobile-bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-blue-600 tracking-wider block mb-2">
              {isAr ? 'أدوات هندسية تفاعلية' : 'Interactive Engineering Tools'}
            </span>
            <h2 className="mobile-section-h2 text-2xl sm:text-3xl md:text-4xl font-bold mb-3 tracking-tight text-slate-900">
              {t('sim.title.part1')} <span className="text-blue-600">{t('sim.title.part2')}</span>
            </h2>
            <p className="mobile-body text-slate-600 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
              {t('sim.desc')}
            </p>
          </div>

          <div className={`flex flex-col lg:flex-row items-center justify-center gap-8 bg-slate-50/80 border border-slate-200 p-6 md:p-10 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${
            isAr ? 'flex-col lg:flex-row' : 'flex-col lg:flex-row-reverse'
          }`}>
            
            {/* شاشة العرض - الصالة الافتراضية */}
            <div className="w-full lg:w-[38%] max-w-[360px] aspect-[4/3] rounded-2xl overflow-hidden relative bg-black shadow-2xl border border-slate-300 group">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                alt="Virtual Room" 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
              />

              {/* طبقة محاكاة الإظلام والإنارة */}
              <div 
                className="absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none z-10"
                style={{
                  opacity: 
                    (!simSpot && !simLed) ? 0.75 : 
                    (simSpot && simLed) ? 0.0 : 
                    simSpot ? 0.22 : 0.45
                }}
              />

              {/* طبقة محاكاة لون الإضاءة العام */}
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

              {/* مخاريط الإضاءة */}
              {simSpot && (
                <div className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-500">
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

              {/* الإنارة المخفية LED Cove */}
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

              <div className={`absolute bottom-4 z-20 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 ${
                isAr ? 'right-4' : 'left-4'
              }`}>
                <span className="text-[11px] font-bold text-white">
                  {!simSpot && !simLed ? (isAr ? 'الإنارة مطفأة' : 'Lights Off') : `${isAr ? 'حرارة اللون:' : 'Color Temp:'} ${
                    simColor === 'warm' ? (isAr ? 'أصفر دافئ (3000K)' : 'Warm Yellow (3000K)') : 
                    simColor === 'natural' ? (isAr ? 'شمسي طبيعي (4000K)' : 'Natural Sun (4000K)') : 
                    (isAr ? 'أبيض بارد (6000K)' : 'Cool White (6000K)')
                  }`}
                </span>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="w-full lg:w-[62%] flex flex-col justify-center space-y-6">
              
              {/* 1. اختيار حرارة اللون */}
              <div>
                <h4 className={`text-base font-bold text-slate-900 mb-3 font-sans ${isAr ? 'text-right' : 'text-left'}`}>{t('sim.opt1')}</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'warm', name: isAr ? 'أصفر 3000K' : 'Warm 3000K' },
                    { key: 'natural', name: isAr ? 'شمسي 4000K' : 'Natural 4000K' },
                    { key: 'cool', name: isAr ? 'أبيض 6000K' : 'White 6000K' },
                  ].map((btn) => (
                    <button
                      key={btn.key}
                      onClick={() => setSimColor(btn.key as any)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                        simColor === btn.key 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300 scale-[1.02]' 
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-blue-400'
                      }`}
                    >
                      {btn.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. تشغيل مصادر الإضاءة */}
              <div>
                <h4 className={`text-base font-bold text-slate-900 mb-3 font-sans ${isAr ? 'text-right' : 'text-left'}`}>{t('sim.opt2')}</h4>
                <div className={`flex flex-col sm:flex-row gap-4 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                  <button
                    onClick={() => setSimSpot(!simSpot)}
                    className={`flex-1 py-3.5 px-4 rounded-xl border font-bold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                      simSpot
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm">{isAr ? 'السبوت لايت (Spotlight)' : 'Spotlight'}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border ${simSpot ? 'bg-blue-600 border-blue-600' : 'border-slate-400'}`} />
                  </button>
                  
                  <button
                    onClick={() => setSimLed(!simLed)}
                    className={`flex-1 py-3.5 px-4 rounded-xl border font-bold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                      simLed
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm">{isAr ? 'الإنارة المخفية (LED Strip)' : 'Cove Light (LED Strip)'}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border ${simLed ? 'bg-blue-600 border-blue-600' : 'border-slate-400'}`} />
                  </button>
                </div>
              </div>

              {/* نصيحة الخبراء الهندسية */}
              <div className={`bg-white border border-blue-200 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-slate-700 shadow-sm ${
                isAr ? 'text-right flex-row' : 'text-left flex-row-reverse'
              }`}>
                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="flex-grow">
                  <span className="font-bold text-blue-900 block mb-0.5">{t('sim.tip')}</span>
                  {simColor === 'warm' && (isAr ? 'الإنارة الصفراء (3000K) تضفي حميمية ودفئاً، وهي مثالية لغرف النوم والمجالس لتعزز الشعور بالاسترخاء.' : 'Yellow lighting (3000K) adds intimacy and warmth, ideal for bedrooms and living rooms to promote relaxation.')}
                  {simColor === 'natural' && (isAr ? 'الإنارة الشمسية (4000K) هي الأقرب لضوء النهار، وهي مناسبة جداً للمطابخ، الممرات، والمنطقة التي تحتاج لألوان حقيقية.' : 'Natural lighting (4000K) is closest to daylight, perfect for kitchens, corridors, and areas needing true colors.')}
                  {simColor === 'cool' && (isAr ? 'الإنارة البيضاء (6000K) تمنح نشاطاً ووضوحاً عالياً، وهي خيار رائع للمكاتب، أماكن القراءة والدراسة.' : 'White lighting (6000K) provides high activity and clarity, an excellent choice for offices, reading, and study areas.')}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 9. دليل تطابق طلاء الجدران والإضاءة (Paint & Lighting Matching) */}
      <section id="paint-matching" className="order-9 mobile-order-9 md:order-none mobile-section-py py-12 md:py-24 relative overflow-hidden border-t border-slate-200 bg-[#F5F8FC] md:bg-slate-50 mobile-bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-blue-600 tracking-wider block mb-2">
              {isAr ? 'التصميم الداخلي والمواءمة البصرية' : 'Interior Architecture & Visual Harmony'}
            </span>
            <h2 className="mobile-section-h2 text-2xl sm:text-3xl md:text-4xl font-bold mb-3 tracking-tight text-slate-900">
              {isAr ? (
                <>دليل تطابق <span className="text-blue-600">الطلاء والإضاءة</span></>
              ) : (
                <>Paint & Lighting <span className="text-blue-600">Matching Guide</span></>
              )}
            </h2>
            <p className="mobile-body text-slate-600 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
              {isAr 
                ? 'اكتشف كيف يتأثر لون طلاء جدران بيتك بحرارة لون الإضاءة المختلفة لتتجنب الأخطاء الشائعة في التصميم الداخلي'
                : 'Discover how your home wall paint color is affected by different lighting color temperatures to avoid common interior design mistakes'
              }
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-white border border-slate-200 p-6 md:p-10 rounded-2xl relative shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          >
            {/* شاشة العرض - زاوية ثلاثية الأبعاد 3D Room Corner */}
            <div className="w-full lg:w-[38%] max-w-[360px] flex flex-col gap-4">
              <div className="w-full aspect-[4/3] rounded-2xl relative overflow-hidden bg-[#09090b] shadow-2xl border border-slate-300 transition-all duration-500">
                {/* Left Wall */}
                <div 
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    backgroundColor: (paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).hex,
                    clipPath: 'polygon(0% 5%, 50% 18%, 50% 80%, 0% 68%)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/25 pointer-events-none" />
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
                  <div className="absolute inset-0 bg-gradient-to-l from-black/15 to-black/35 pointer-events-none" />
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
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
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

                {/* Spotlight Fixture */}
                <div className="absolute top-[3%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                  <div className="w-10 h-2 bg-slate-800 rounded-full border border-slate-700/50 shadow-inner" />
                  <div className="w-1.5 h-3 bg-gradient-to-r from-slate-600 to-slate-500" />
                  <div className="w-7 h-7 bg-slate-900 border border-slate-700 rounded-t-sm rounded-b-md flex items-center justify-center shadow-lg relative">
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
                  <span className="text-[9px] text-white font-bold">{isAr ? 'عرض ثلاثي الأبعاد 3D' : '3D View'}</span>
                </div>

                {/* Shake Toggle on Mobile */}
                <button 
                  onClick={async () => {
                    const granted = await requestPermission()
                    if (granted) {
                      alert(isAr ? "تم تفعيل ميزة هز الهاتف لتغيير الإضاءة! جرب هز هاتفك الآن." : "Phone shake feature enabled! Try shaking your phone now.")
                    } else {
                      alert(isAr ? "لم نتمكن من تفعيل مستشعرات الحركة بجهازك أو تصفحك عبر جهاز لا يدعمها." : "Could not activate motion sensors on your device.")
                    }
                  }}
                  className="absolute bottom-4 right-4 z-20 flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 border border-blue-500 text-[9px] text-white font-bold transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <span>{isAr ? 'تفعيل هز الهاتف' : 'Enable Phone Shake'}</span>
                </button>
              </div>

              {/* مؤشر اللون الحالي */}
              <div className="flex items-center justify-between bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span>{isAr ? 'الطلاء:' : 'Paint:'} <strong className="text-slate-900">{(paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).name}</strong></span>
                <span>{isAr ? 'الضوء:' : 'Light:'} <strong className="text-blue-600">
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
                <h4 className="text-base font-bold text-slate-900 mb-3 font-sans">
                  {isAr ? '1. اختر لون طلاء الجدار:' : '1. Choose Wall Paint Color:'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {paintColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedPaintId(color.id)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-200 flex flex-col items-center gap-2 cursor-pointer ${
                        selectedPaintId === color.id
                          ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-300 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-blue-300'
                      }`}
                    >
                      <span 
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-inner" 
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. اختيار حرارة لون الإضاءة */}
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-3 font-sans">
                  {isAr ? '2. اختر حرارة لون الإضاءة:' : '2. Choose Light Color Temp:'}
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'warm', name: isAr ? 'أصفر 3000K' : 'Yellow 3000K' },
                    { key: 'natural', name: isAr ? 'شمسي 4000K' : 'Natural 4000K' },
                    { key: 'cool', name: isAr ? 'أبيض 6000K' : 'White 6000K' },
                  ].map((btn) => (
                    <button
                      key={btn.key}
                      onClick={() => setPaintColorTemp(btn.key as any)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                        paintColorTemp === btn.key
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300 scale-[1.02]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-blue-400'
                      }`}
                    >
                      {btn.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* النصيحة الهندسية الذكية */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-slate-800 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-blue-900 block mb-1">
                    {isAr ? 'رأي مهندس الديكور والتصميم الداخلي:' : 'Interior Designer & Decorator Advice:'}
                  </span>
                  {(paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).advice[paintColorTemp]}
                </div>
              </div>

            </div>

          </motion.div>

        </div>
      </section>

      {/* 5. جزء من مشاريعنا (Featured Projects - Responsive Grid/Slider) */}
      {/* 5. جزء من مشاريعنا - دراسات حالة معمارية ذات تسلسل هرمي مدروس */}
      <section id="featured-projects" className="order-5 mobile-order-5 md:order-none mobile-section-py py-12 md:py-24 relative overflow-hidden border-t border-slate-200 bg-[#F8FAFD] mobile-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* ترويسة القسم المعمارية */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4 pb-6 border-b border-slate-200/80">
            <div className="text-right">
              <span className="text-xs font-semibold text-blue-600 tracking-wider block mb-2">
                {isAr ? 'سجل الإنجاز والتنفيذ الميداني' : 'Portfolio of Architectural Execution'}
              </span>
              <h2 className="mobile-section-h2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                {isAr ? (
                  <>جزء من <span className="text-blue-600">مشاريعنا المنفذة</span></>
                ) : (
                  <>Selected <span className="text-blue-600">Project Case Studies</span></>
                )}
              </h2>
            </div>
            <Link to="/projects" className="mobile-btn inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-xs">
              <span>{isAr ? 'استعرض كافة المشاريع' : 'View All Projects'}</span>
              <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? '' : 'rotate-180'}`} />
            </Link>
          </div>

          {loadingProjects ? (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
               <p className="text-slate-500 mt-4 text-sm font-semibold">{isAr ? 'جاري جلب المشاريع...' : 'Fetching projects...'}</p>
             </div>
          ) : (
            <>
              {/* التمرير الأفقي على الهواتف بتناسب معماري عريض 16:10 وزوايا متناسقة */}
              <div className="md:hidden flex flex-col gap-3">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-4 scrollbar-none -mx-4">
                  {featuredProjects.map((project) => (
                    <div 
                      key={project.id} 
                      onClick={() => openGallery(project)}
                      className="snap-start snap-always min-w-[280px] xs:min-w-[310px] w-[82vw] bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-slate-100">
                        <img src={getOptimizedProjectImageUrl(project.coverImage)} alt={project.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                        <div className="absolute top-2.5 right-2.5 z-20">
                          <span className="px-2.5 py-0.5 bg-white/95 border border-slate-200 text-slate-800 text-[10px] font-semibold rounded-md shadow-xs">
                            {project.category}
                          </span>
                        </div>
                        {project.video && (
                          <div className="absolute top-2.5 left-2.5 z-20 bg-slate-900/80 border border-white/20 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                            <PlayCircle className="w-3 h-3 text-white" />
                            <span className="text-white text-[10px] font-medium">{isAr ? 'فيديو' : 'Video'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex-grow flex flex-col justify-between text-right">
                        <div>
                          <h3 className="mobile-card-h3 text-sm font-bold text-slate-900 mb-1 line-clamp-1">{project.name}</h3>
                          <p className="mobile-small text-slate-600 text-xs leading-relaxed line-clamp-2 mb-3 font-normal">{project.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-[11px] text-blue-600 font-semibold border-t border-slate-100 pt-2.5">
                          <span>{isAr ? 'عرض تفاصيل المعرض ←' : 'View Gallery Details ←'}</span>
                          {project.image.includes(',') && (
                            <span className="text-slate-400 font-normal">
                              +{project.image.split(',').length - 1} {isAr ? 'صور' : 'Photos'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* العرض المعماري غير المتماثل على الشاشات الكبيرة (Asymmetric Editorial Layout) */}
              <div className="hidden md:block space-y-6">
                
                {/* الصف العلوي: دراسة الحالة الرئيسية البارزة + دراستان مرافقتان */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* المشروع الرائد المميز (Lead Project Hero) */}
                  {featuredProjects[0] && (
                    <motion.div
                      key={featuredProjects[0].id}
                      onClick={() => openGallery(featuredProjects[0])}
                      whileHover={{ y: -3 }}
                      className="lg:col-span-7 group relative bg-white border border-slate-200 hover:border-slate-400 rounded-xl overflow-hidden flex flex-col justify-end min-h-[460px] cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300"
                    >
                      <div className="absolute inset-0 w-full h-full bg-slate-900 overflow-hidden">
                        <img 
                          src={getOptimizedProjectImageUrl(featuredProjects[0].coverImage)} 
                          alt={featuredProjects[0].name} 
                          loading="lazy" 
                          decoding="async" 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                          onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                      </div>

                      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-semibold rounded-lg shadow-sm">
                          {featuredProjects[0].category}
                        </span>
                        {featuredProjects[0].video && (
                          <div className="bg-slate-950/80 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                            <PlayCircle className="w-3.5 h-3.5 text-white" />
                            <span className="text-white text-[10px] font-semibold">{isAr ? 'فيديو توثيقي' : 'Video Tour'}</span>
                          </div>
                        )}
                      </div>

                      <div className="relative z-20 p-6 sm:p-8 text-right space-y-2">
                        <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                          {isAr ? 'مشروع رائد مميز' : 'Featured Architectural Project'}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                          {featuredProjects[0].name}
                        </h3>
                        <p className="text-slate-200/90 text-xs sm:text-sm font-normal leading-relaxed line-clamp-2 max-w-xl">
                          {featuredProjects[0].description}
                        </p>
                        <div className="pt-2 flex items-center justify-between text-xs font-medium text-slate-300 border-t border-white/10">
                          <span className="inline-flex items-center gap-1.5 text-blue-300 group-hover:text-white transition-colors">
                            {isAr ? 'عرض تفاصيل وتغطية المشروع ←' : 'Explore Project Gallery ←'}
                          </span>
                          {featuredProjects[0].image.includes(',') && (
                            <span className="px-2 py-0.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded text-[11px] text-white">
                              +{featuredProjects[0].image.split(',').length - 1} {isAr ? 'صور' : 'Photos'}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* المشاريع المرافقة (Companion Projects - 5 أعمدة) */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    {featuredProjects.slice(1, 3).map((project) => (
                      <motion.div
                        key={project.id}
                        onClick={() => openGallery(project)}
                        whileHover={{ y: -2 }}
                        className="group relative bg-white border border-slate-200 hover:border-slate-400 rounded-xl overflow-hidden flex flex-col sm:flex-row flex-1 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm transition-all duration-200"
                      >
                        <div className="relative sm:w-2/5 aspect-[16/10] sm:aspect-auto overflow-hidden bg-slate-100 shrink-0">
                          <img 
                            src={getOptimizedProjectImageUrl(project.coverImage)} 
                            alt={project.name} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} 
                          />
                          <div className="absolute top-2.5 right-2.5 z-20">
                            <span className="px-2 py-0.5 bg-white/95 border border-slate-200 text-slate-800 text-[10px] font-semibold rounded-md shadow-xs">
                              {project.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between text-right">
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 line-clamp-1">
                              {project.name}
                            </h3>
                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 font-normal">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-blue-600 font-semibold border-t border-slate-100 pt-2.5 mt-3">
                            <span>{isAr ? 'عرض التفاصيل ←' : 'View Details ←'}</span>
                            {project.image.includes(',') && (
                              <span className="text-slate-400 font-normal">
                                +{project.image.split(',').length - 1} {isAr ? 'صور' : 'Photos'}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </div>

                {/* الصف السفلي لبقية المشاريع بتوازن معماري راقٍ */}
                {featuredProjects.length > 3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                    {featuredProjects.slice(3).map((project) => (
                      <motion.div
                        key={project.id}
                        onClick={() => openGallery(project)}
                        whileHover={{ y: -2 }}
                        className="group relative bg-white border border-slate-200 hover:border-slate-400 rounded-xl overflow-hidden flex flex-col h-full cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm transition-all duration-200"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-slate-100">
                          <img 
                            src={getOptimizedProjectImageUrl(project.coverImage)} 
                            alt={project.name} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} 
                          />
                          <div className="absolute top-3 right-3 z-20">
                            <span className="px-2.5 py-0.5 bg-white/95 border border-slate-200 text-slate-800 text-[10px] font-semibold rounded-md shadow-xs">
                              {project.category}
                            </span>
                          </div>
                          {project.video && (
                            <div className="absolute top-3 left-3 z-20 bg-slate-900/80 border border-white/20 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                              <PlayCircle className="w-3 h-3 text-white" />
                              <span className="text-white text-[10px] font-medium">{isAr ? 'فيديو' : 'Video'}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between text-right">
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 line-clamp-1">
                              {project.name}
                            </h3>
                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 font-normal">
                              {project.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-blue-600 font-semibold border-t border-slate-100 pt-2.5 mt-3">
                            <span>{isAr ? 'عرض تفاصيل المعرض ←' : 'View Gallery Details ←'}</span>
                            {project.image.includes(',') && (
                              <span className="text-slate-400 font-normal">
                                +{project.image.split(',').length - 1} {isAr ? 'صور' : 'Photos'}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

              </div>
            </>
          )}
        </div>
      </section>

      {/* 7. قسم الأسلاك والكوابل الإيطالية والتركية - تركيبة تحريرية معمارية بصورة الكوابل الثابتة المعتمدة */}
      <section id="wires-import-showcase" className="order-7 mobile-order-7 md:order-none py-14 sm:py-16 md:py-24 lg:py-28 relative overflow-hidden bg-[#F5F8FC] border-t border-slate-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-16 items-center" dir={isAr ? 'rtl' : 'ltr'}>
            
            {/* العمود التحريري (العنوان، الوصف، وزر الإجراء على الديسكتوب) */}
            <div className="order-1 lg:col-span-5 text-right space-y-4">
              <h2 className="mobile-section-h2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                {isAr ? (
                  <>أسلاك وكوابل إيطالية وتركية <br className="hidden sm:inline" /><span className="text-blue-600">من المصنع مباشرة</span></>
                ) : (
                  <>Italian & Turkish Wires <br className="hidden sm:inline" /><span className="text-blue-600">Direct from Source</span></>
                )}
              </h2>

              <p className="mobile-body text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                {isAr
                  ? 'نوفر أفضل وأجود أنواع الأسلاك والكوابل الإيطالية والتركية المعتمدة لجميع مشاريع التأسيس السكني والتجاري بنحاس نقي 100% وعزل حراري فائق الأمان.'
                  : 'We supply certified Italian and Turkish wires and cables engineered with 100% pure electrolytic copper and flame-retardant PVC insulation.'}
              </p>

              {/* زر الإجراء السريع لسطح المكتب */}
              <div className="pt-2 hidden lg:block">
                <Link 
                  to="/products"
                  className="mobile-btn inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer text-center"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isAr ? 'تسوق الأسلاك بالمتجر الإلكتروني ←' : 'Shop Store Wires ←'}</span>
                </Link>
              </div>
            </div>

            {/* عمود الصورة المعمارية الكبرى */}
            <div className="order-2 lg:col-span-7 w-full">
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] bg-slate-100">
                <img
                  src="/images/wires-italian-turkish-cables.jpg"
                  alt={isAr ? "أسلاك وكوابل كهربائية إيطالية وتركية معتمدة من المصنع مباشرة مع علمي تركيا وإيطاليا" : "Certified Italian and Turkish electrical wires and cables direct from factory with flags"}
                  width={1024}
                  height={576}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* زر الإجراء السريع على الموبايل (يظهر تحت الصورة مباشرة لراحة التصفح) */}
            <div className="order-3 lg:hidden w-full pt-1">
              <Link 
                to="/products"
                className="mobile-btn inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer text-center"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isAr ? 'تسوق الأسلاك بالمتجر الإلكتروني ←' : 'Shop Store Wires ←'}</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 9. قسم اللعبة التفاعلية الحصرية: رحلة النور */}
      <section id="game-teaser" className="order-9 mobile-order-9 md:order-none mobile-section-py py-10 md:py-16 relative overflow-hidden border-t border-slate-200 bg-white mobile-bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative bg-slate-50/70 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden text-right">
            
            <div className="flex items-center gap-4 sm:gap-5 flex-row">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
                  {isAr ? 'تجربة تفاعلية حصرية' : 'Interactive Experience'}
                </span>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">
                  {isAr ? 'رحلة النور | بطل الإنارة الحديثة' : 'Light Quest | Modern Enarah Hero'}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
                  {isAr
                    ? 'عالم مظلم يحتاج إلى شجاعتك! تحكم ببطل اللمبة بالقميص الأزرق، أنر المصابيح وشغل القاطع الرئيسي واكسب كود خصم حقيقي لمشترياتك.'
                    : 'A dark world awaits! Guide the Lightbulb Hero, bring light to the rooms, and win an exclusive discount coupon.'}
                </p>
              </div>
            </div>

            <Link
              to="/game"
              className="mobile-btn w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <span>{isAr ? 'العب واكسب الخصم الآن' : 'Play & Win Discount'}</span>
              <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? '' : 'rotate-180'}`} />
            </Link>

          </div>
        </div>
      </section>

      {/* 10. ابدأ مشروعك معنا اليوم - إغلاق معماري راقٍ */}
      <section id="start" className="order-10 mobile-order-10 md:order-none mobile-section-py py-12 md:py-24 relative overflow-hidden border-t border-slate-200 bg-slate-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white border border-slate-200 rounded-2xl p-8 md:p-14 text-center overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          >
            <span className="text-xs font-semibold text-blue-600 tracking-wider block mb-2">
              {isAr ? 'شراكة هندسية وتوريد احترافي' : 'Engineering Partnership & Supply'}
            </span>

            <h2 className="mobile-section-h2 relative z-10 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              {isAr ? (
                <>ابدأ مشروعك معنا <span className="text-blue-600">اليوم</span></>
              ) : (
                <>Start Your Project With Us <span className="text-blue-600">Today</span></>
              )}
            </h2>

            <p className="mobile-body relative z-10 text-slate-600 text-xs sm:text-sm md:text-base mb-6 max-w-xl mx-auto leading-relaxed font-normal">
              {isAr 
                ? 'نحن هنا لنساعدك في تحويل رؤيتك إلى واقع مبهر. تواصل مع خبرائنا للحصول على استشارة هندسية وفنية لمشروعك، أو لطلب فواتير المواد وعروض الأسعار المتكاملة لمشروعك الكهربائي.'
                : 'We are here to help you transform your vision into a stunning reality. Contact our experts for engineering and technical consultations, or to request material invoices and comprehensive quotes for your electrical project.'
              }
            </p>

            <Link to="/contact" className="mobile-btn relative z-10 inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white font-medium text-xs sm:text-sm rounded-xl hover:bg-blue-700 transition-all shadow-sm active:scale-95">
              <Zap className="w-4 h-4 text-amber-300" />
              {isAr ? 'تواصل معنا الآن' : 'Contact Us Now'}
            </Link>

            {/* روابط التواصل الاجتماعي للفيسبوك وتيك توك وإنستغرام */}
            <div className="flex justify-center mt-10 relative z-10">
              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 ${
                isAr ? 'flex-row' : 'flex-row-reverse'
              }`}>
                <span className={`text-slate-600 text-xs font-medium ${isAr ? 'pl-3 border-l' : 'pr-3 border-r'} border-slate-200`}>
                  {isAr ? 'تابع صفحاتنا:' : 'Follow us:'}
                </span>
                <div className="flex items-center gap-2">
                  <a 
                    href="https://www.facebook.com/share/1BxjvUxxvG/?mibextid=wwXIfr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 flex items-center justify-center shadow-2xs"
                    title="فيسبوك"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/enara_hadetha?igsh=MXVqaGlqdHN5cnM5OQ==" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all duration-200 flex items-center justify-center shadow-2xs"
                    title="إنستغرام"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@modernenara?_r=1&_t=ZS-96dCObkuFUK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-black hover:border-black transition-all duration-200 flex items-center justify-center shadow-2xs"
                    title="تيك توك"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
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
            .map((url) => getOptimizedProjectImageUrl(url.trim()))
            .filter(Boolean)

          return (
            <motion.div
              key="lightbox-gallery-overlay-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto"
            >
              <div className="absolute inset-0 z-0" onClick={() => setSelectedProject(null)} />
              
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative z-10 w-full max-w-5xl bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] lg:max-h-[85vh]"
              >
                {/* زر الإغلاق */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-5 left-5 z-30 p-2.5 bg-slate-100 hover:bg-red-500 hover:text-white border border-slate-200 text-slate-700 rounded-full transition-all duration-300 active:scale-95 shadow-md cursor-pointer"
                  aria-label="إغلاق المعرض"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* الجانب الأيمن (معرض الصور) */}
                <div className="w-full lg:w-2/3 p-5 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-slate-200 bg-slate-900">
                  <div className="relative aspect-[4/3] w-full max-h-[45vh] lg:max-h-[50vh] rounded-[1.8rem] overflow-hidden bg-black flex items-center justify-center shadow-inner group/viewer">
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
                          className="absolute right-4 p-3 bg-black/50 hover:bg-blue-600 text-white rounded-2xl transition-all duration-300 active:scale-90 shadow-md backdrop-blur-sm"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleNextImage(imageUrls.length); }}
                          className="absolute left-4 p-3 bg-black/50 hover:bg-blue-600 text-white rounded-2xl transition-all duration-300 active:scale-90 shadow-md backdrop-blur-sm"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* الصور المصغرة */}
                  {imageUrls.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto py-3 px-1 mt-4 scrollbar-thin scrollbar-thumb-slate-700 justify-center">
                      {imageUrls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 cursor-pointer ${
                            idx === activeImageIndex
                              ? 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-105'
                              : 'border-white/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={getOptimizedProjectImageUrl(url)} alt="thumbnail" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* الجانب الأيسر (تفاصيل المشروع) */}
                <div className="w-full lg:w-1/3 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white">
                  <div className="space-y-6">
                    <div>
                      <span className="px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full inline-block mb-3">
                        {selectedProject.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{selectedProject.name}</h2>
                    </div>

                    <div className="h-px bg-slate-200 w-full" />

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-500 font-sans">عن المشروع:</h4>
                      <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap font-medium">{selectedProject.description}</p>
                    </div>
                  </div>

                  <div className="pt-8 space-y-3">
                    {selectedProject.video && (
                      <a
                        href={selectedProject.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/30 active:scale-98"
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
  )
}
