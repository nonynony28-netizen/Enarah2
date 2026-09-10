import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function HomeCleanWhitePreview() {
  const { t, isAr } = useLanguage()
  const paintColors = getPaintColors(isAr)
  const homeBrands = getHomeBrands(isAr)

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
      if (!el) return
      el.defaultMuted = true
      el.muted = true
      el.volume = 0
      el.playsInline = true
      el.setAttribute('muted', '')
      el.setAttribute('playsinline', '')
      el.setAttribute('webkit-playsinline', 'true')
      
      const promise = el.play()
      if (promise !== undefined) {
        promise.catch(() => {})
      }
    }

    const playAll = () => {
      forcePlayMobileVideo(videoRef.current)
      forcePlayMobileVideo(secondaryVideoRef.current)
    }

    playAll()

    window.addEventListener('touchstart', playAll, { passive: true })
    window.addEventListener('scroll', playAll, { passive: true })
    window.addEventListener('pointerdown', playAll, { passive: true })

    const heroEl = document.getElementById('hero')
    let observer: IntersectionObserver | null = null
    if (heroEl) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.currentTime = 0
            forcePlayMobileVideo(videoRef.current)
          }
        })
      }, { threshold: 0.25 })
      observer.observe(heroEl)
    }

    return () => {
      window.removeEventListener('touchstart', playAll)
      window.removeEventListener('scroll', playAll)
      window.removeEventListener('pointerdown', playAll)
      if (observer) observer.disconnect()
    }
  }, [heroVideoUrl, secondaryVideoUrl])

  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. الواجهة الترحيبية السينمائية التلقائية (Hero Auto Canvas - Full Width/Height like original) */}
      <section id="hero" className="relative min-h-[55vh] sm:min-h-[65vh] md:h-screen w-full overflow-hidden touch-pan-y select-none pointer-events-none">
        <HeroAutoCanvas videoSrc={heroVideoUrl || '/bg-video.mp4'} posterSrc="/poster.jpg">
          {() => (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center pt-6 sm:pt-10 md:pt-14 z-10 px-4">
              <motion.div 
                initial={{ opacity: 0, y: 18, filter: "blur(6px)", scale: 0.98 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl mx-auto text-center pointer-events-auto flex flex-col items-center justify-center"
              >

                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-4 leading-tight tracking-tight text-white py-1">
                  <span className="text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">{t('hero.title.part1')}</span>{' '}
                  <span className="text-blue-400 drop-shadow-[0_0_25px_rgba(59,130,246,0.9)]">{t('hero.title.part2')}</span>
                </h1>
                
                <p className="text-xs sm:text-base md:text-xl text-slate-100 mb-6 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  {t('hero.subtitle')}
                </p>

                {/* أزرار الإجراء السريع في الهيرو */}
                <div className="flex items-center justify-center gap-3">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/40 transition-all hover:scale-105 active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isAr ? 'تصفح المتجر' : 'Shop Products'}</span>
                  </Link>

                  <a
                    href="#wires-import-showcase"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/90 hover:bg-white text-slate-900 font-bold text-sm shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                  >
                    <span>{isAr ? 'أسلاك إيطالية 🇮🇹' : 'Italian Wires 🇮🇹'}</span>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </HeroAutoCanvas>
      </section>

      {/* 2. لماذا نحن - الميزات الموحدة في شبكة 3 بطاقات فاخرة في صفحة واحدة (Clean White + Prominent Blue) */}
      <section id="about" className="py-20 md:py-28 relative overflow-hidden border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* عنوان قسم لماذا نحن بتنظيم معماري أنيق */}
          <div className="text-center mb-14 md:mb-18">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{isAr ? 'الثقة والجودة في مكان واحد' : 'Trust & Quality in One Place'}</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
              {isAr ? 'لماذا' : 'Why'}{' '}
              <span className="text-blue-600">
                {isAr ? 'نحن؟' : 'Choose Us?'}
              </span>
            </h2>

            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              {isAr 
                ? 'تجربة متكاملة تجمع بين الجودة المعتمدة، كميات كبيرة وتوريد للشركات والمقاولين والمحلات، والدعم الفني السريع' 
                : 'An integrated experience combining certified quality, bulk supply for companies, contractors and retail shops, and fast technical support'}
            </p>

            <div className="flex items-center justify-center gap-2 mt-5">
              <div className="w-14 h-[2px] bg-slate-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <div className="w-14 h-[2px] bg-slate-200" />
            </div>
          </div>

          {/* شبكة البطاقات الثلاث الموحدة بتنظيم هندسي متناسق */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10 items-stretch">
            
            {/* البطاقة الأولى: وكالات عالمية حصرية */}
            <div className="relative p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between group transition-all duration-300 h-full hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold">
                    {isAr ? 'وكالة رسمية معتمدة' : 'Official Agency'}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {isAr ? 'وكالات عالمية حصرية' : 'Exclusive Global Agencies'}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                  {isAr 
                    ? 'استيراد وتوريد مباشر من كبرى المصانع العالمية مع ضمان أصالة 100%.' 
                    : 'Direct import from leading international manufacturers with 100% guaranteed authenticity.'}
                </p>

                <div className="space-y-2.5 mb-6">
                  {(isAr ? [
                    'منتجات أصلية 100% معتمدة رسمياً في ليبيا',
                    'استيراد مباشر من المصانع الأوروبية المعتمدة',
                    'تنوع شامل يلبي أرقى المعايير والمشاريع'
                  ] : [
                    '100% certified authentic products in Libya',
                    'Direct import from certified European factories',
                    'Comprehensive range meeting the highest standards'
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 font-medium leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 mt-auto">
                <span>{isAr ? 'الأصالة والاعتماد' : 'Authenticity & Certification'}</span>
                <span className="text-blue-600 font-black text-sm">{isAr ? '100% مضمون' : '100% Guaranteed'}</span>
              </div>
            </div>

            {/* البطاقة الثانية: توريد كبرى المشاريع والجملة (البطاقة البارزة) */}
            <div className="relative p-6 sm:p-7 rounded-2xl bg-white border-2 border-blue-600 shadow-md hover:shadow-2xl hover:shadow-blue-500/15 flex flex-col justify-between group transition-all duration-300 h-full hover:-translate-y-1.5 ring-4 ring-blue-50">
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold tracking-wide shadow-sm">
                    {isAr ? 'توريد تجاري ومشاريع' : 'Commercial Supply'}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {isAr ? 'توريد كبرى المشاريع والجملة' : 'Bulk & Project Supply'}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                  {isAr 
                    ? 'تجهيز فوري وشامل لطلبيات المقاولين والشركات ومحلات الكهرباء.' 
                    : 'Immediate comprehensive fulfillment for contractors, companies, and retail shops.'}
                </p>

                <div className="space-y-2.5 mb-6">
                  {(isAr ? [
                    'أسعار جملة تنافسية لكبار المقاولين والمحلات',
                    'أسلاك وكابلات إيطالية بأعلى مواصفات الأمان',
                    'تجهيز كامل للمخططات السكنية والتجارية'
                  ] : [
                    'Competitive wholesale pricing for contractors & shops',
                    'Certified Italian wires with top thermal safety',
                    'Full provisioning for residential & commercial sites'
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-800 font-bold leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 mt-auto">
                <span>{isAr ? 'جاهزية المستودعات' : 'Warehouse Readiness'}</span>
                <span className="text-blue-600 font-black text-sm">{isAr ? 'كميات متوفرة دائماً' : 'Always in Stock'}</span>
              </div>
            </div>

            {/* البطاقة الثالثة: استشارات ودعم هندسي مجاناً (بدون حاسبة أحمال) */}
            <div className="relative p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between group transition-all duration-300 h-full hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold">
                    {isAr ? 'استشارات ودعم فني' : 'Technical Support'}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {isAr ? 'استشارات ودعم هندسي مجاناً' : 'Free Engineering Support'}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                  {isAr 
                    ? 'فريقنا متواجد دائماً لإرشادك لاختيار المنتجات المناسبة وتجهيز طلبيتك بأفضل جودة.' 
                    : 'Our team is always available to guide you to the right products and prepare your order.'}
                </p>

                <div className="space-y-2.5 mb-6">
                  {(isAr ? [
                    'إرشاد فني متخصص لاختيار أفضل المنتجات والكميات',
                    'اقتراح حلول الإنارة المعمارية والديكورية المناسبة',
                    'متابعة وتنسيق مباشر وتوصيل سريع لموقع العمل'
                  ] : [
                    'Specialized technical guidance for ideal products & quantities',
                    'Curated architectural & decorative lighting solutions',
                    'Direct coordination and fast delivery to your job site'
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 font-medium leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 mt-auto">
                <span>{isAr ? 'خدمة واستشارات' : 'Consultation & Support'}</span>
                <span className="text-blue-600 font-black text-sm">{isAr ? 'مجاناً 100%' : '100% Free'}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. قسم شركاؤنا من العلامات العالمية (18 علامة عالمية) */}
      <section id="brands-partners" className="py-20 md:py-28 relative overflow-hidden border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* عنوان القسم */}
          <div className="text-center mb-14 md:mb-18">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight text-slate-900">
              {isAr ? (
                <>شركاؤنا من <span className="text-blue-600">العلامات العالمية</span></>
              ) : (
                <>Our Partners of <span className="text-blue-600">Global Brands</span></>
              )}
            </h2>

            <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed text-sm md:text-base mb-6 font-normal">
              {isAr 
                ? 'نتعاون مع نخبة من أبرز العلامات والشركات العالمية المتخصصة في الإضاءة والتجهيزات والمواد الكهربائية'
                : 'We collaborate with a group of the most prominent international brands and companies specialized in lighting and electrical equipment'
              }
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-5">
              <div className="w-16 h-[2px] bg-slate-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <div className="w-16 h-[2px] bg-slate-300" />
            </div>
          </div>

          {/* شبكة كروت الوكالات والعلامات العالمية في جو أبيض كلاسيكي فاخر */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
            {homeBrands.map((brand) => (
              <Link
                key={brand.id}
                to="/brands"
                className="group relative bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden cursor-pointer h-full"
              >
                {/* Brand Logo Container */}
                <div className="w-full h-16 sm:h-20 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center p-2.5 mb-3 group-hover:border-blue-300 group-hover:bg-blue-50/30 transition-colors relative overflow-hidden">
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain filter brightness-95 group-hover:scale-105 transition-transform duration-300"
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

                {/* Brand Name & Origin */}
                <div className="w-full">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                    {brand.name}
                  </h3>
                  <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-bold">
                    {brand.origin}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* زر استعراض كافة تفاصيل الوكالات والمنتجات */}
          <div className="mt-10 md:mt-12 text-center">
            <Link
              to="/brands"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-md shadow-blue-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{isAr ? 'استعرض تفاصيل كافة الوكالات والشركات (18 علامة عالمية)' : 'Explore All 18 Global Agencies'}</span>
              <ArrowLeft className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. قسم عرض الفيديو الثاني (بعرض الشاشة الكاملة 100% كما في الموقع الأصلي) */}
      <section id="showcase-video" className="w-full py-6 md:py-10 relative overflow-hidden bg-white border-y border-slate-200">
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

      {/* 5. مُحاكي الإضاءة التفاعلي المبتكر (Interactive Simulator) */}
      <section id="simulator" className="py-20 md:py-28 relative overflow-hidden border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-14 md:mb-18">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
              {t('sim.title.part1')} <span className="text-blue-600">{t('sim.title.part2')}</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto font-normal">
              {t('sim.desc')}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-5">
              <div className="w-16 h-[2px] bg-slate-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <div className="w-16 h-[2px] bg-slate-200" />
            </div>
          </div>

          <div className={`flex flex-col lg:flex-row items-center justify-center gap-8 bg-slate-50 border border-slate-200 p-6 md:p-10 rounded-3xl shadow-sm ${
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
                  {!simSpot && !simLed ? (isAr ? 'الإنارة مطفأة 🌑' : 'Lights Off 🌑') : `${isAr ? 'حرارة اللون:' : 'Color Temp:'} ${
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
                <div className="text-xl">💡</div>
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

      {/* 6. دليل تطابق طلاء الجدران والإضاءة (Paint & Lighting Matching) */}
      <section id="paint-matching" className="py-20 md:py-28 relative overflow-hidden border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14 md:mb-18">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
              {isAr ? (
                <>دليل تطابق <span className="text-blue-600">الطلاء والإضاءة</span></>
              ) : (
                <>Paint & Lighting <span className="text-blue-600">Matching Guide</span></>
              )}
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto font-normal">
              {isAr 
                ? 'اكتشف كيف يتأثر لون طلاء جدران بيتك بحرارة لون الإضاءة المختلفة لتتجنب الأخطاء الشائعة في التصميم الداخلي'
                : 'Discover how your home wall paint color is affected by different lighting color temperatures to avoid common interior design mistakes'
              }
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-5">
              <div className="w-16 h-[2px] bg-slate-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <div className="w-16 h-[2px] bg-slate-300" />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-white border border-slate-200 p-6 md:p-10 rounded-3xl relative shadow-sm"
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
                      alert(isAr ? "تم تفعيل ميزة هز الهاتف لتغيير الإضاءة! جرب هز هاتفك الآن. 📱" : "Phone shake feature enabled! Try shaking your phone now. 📱")
                    } else {
                      alert(isAr ? "لم نتمكن من تفعيل مستشعرات الحركة بجهازك أو تصفحك عبر جهاز لا يدعمها." : "Could not activate motion sensors on your device.")
                    }
                  }}
                  className="absolute bottom-4 right-4 z-20 flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 border border-blue-500 text-[9px] text-white font-bold transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <span>{isAr ? 'تفعيل هز الهاتف 📱' : 'Enable Phone Shake 📱'}</span>
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
                <div className="text-xl">📐</div>
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

      {/* 7. جزء من مشاريعنا (Featured Projects - Responsive Grid/Slider) */}
      <section id="featured-projects" className="py-20 md:py-28 relative overflow-hidden border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-18 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
                {isAr ? (
                  <>جزء من <span className="text-blue-600">مشاريعنا</span></>
                ) : (
                  <>Part of <span className="text-blue-600">Our Projects</span></>
                )}
              </h2>
              <div className="w-16 h-[3px] bg-blue-600 rounded-full mt-3" />
            </div>
            <Link to="/projects" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl text-blue-700 hover:text-white font-bold transition-all shadow-sm">
              {isAr ? 'شاهد كل المشاريع' : 'View All Projects'} <ArrowLeft className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
            </Link>
          </div>

          {loadingProjects ? (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
               <p className="text-slate-500 mt-4 text-sm font-semibold">{isAr ? 'جاري جلب المشاريع...' : 'Fetching projects...'}</p>
             </div>
          ) : (
            <>
              {/* Mobile/Tablet Horizontal Snap Slider */}
              <div className="md:hidden flex flex-col gap-4">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold">
                  <span>↔</span>
                  <span>{isAr ? 'اسحب لليمين واليسار لرؤية باقي المشاريع' : 'Swipe left/right to see other projects'}</span>
                  <span>↔</span>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 px-4 scrollbar-none -mx-4">
                  {featuredProjects.map((project) => (
                    <div 
                      key={project.id} 
                      onClick={() => openGallery(project)}
                      className="snap-start snap-always min-w-[280px] xs:min-w-[310px] w-[80vw] bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 border-b border-slate-100">
                        <img src={project.coverImage} alt={project.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10" />
                        
                        <div className="absolute top-3 right-3 z-20">
                          <span className="px-3 py-1 bg-white/95 border border-blue-200 text-blue-700 text-[10px] font-black rounded-full shadow-sm">
                            {project.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 relative z-20 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-1">{project.name}</h3>
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">{project.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-[11px] text-blue-600 font-bold border-t border-slate-100 pt-3">
                          <span>{isAr ? 'عرض تفاصيل المعرض ←' : 'View Gallery Details ←'}</span>
                          {project.image.includes(',') && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-bold">
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
                    className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img src={project.coverImage} alt={project.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10" />
                      
                      <div className="absolute top-3 right-3 z-20">
                        <span className="px-3 py-1 bg-white/95 border border-blue-200 text-blue-700 text-[10px] font-black rounded-full shadow-sm">
                          {project.category}
                        </span>
                      </div>
                      
                      {project.video && (
                        <div className="absolute top-3 left-3 z-20 bg-blue-600/90 border border-blue-400 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <PlayCircle className="w-3.5 h-3.5 text-white" />
                          <span className="text-white text-[10px] font-bold">{isAr ? 'فيديو' : 'Video'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 relative z-20 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">{project.name}</h3>
                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">{project.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] text-blue-600 font-bold border-t border-slate-100 pt-3">
                        <span>{isAr ? 'عرض تفاصيل المعرض ←' : 'View Gallery Details ←'}</span>
                        {project.image.includes(',') && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-bold">
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

      {/* 8. قسم مسرح الأسلاك الـ 3D التفاعلي (Wires 3D Canvas Showcase) */}
      <section id="wires-import-showcase" className="py-16 md:py-24 relative overflow-hidden bg-slate-50 border-t border-slate-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* 1. مسرح الأسلاك 3D الأصلي الـ 240 إطار */}
            <motion.div 
              initial={{ opacity: 0, x: isAr ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="lg:col-span-6 w-full"
            >
              <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-slate-950 border-2 border-blue-500 shadow-2xl shadow-blue-500/20 group">
                <WiresAutoCanvas totalFrames={240} fps={30} fitMode="cover" className="w-full h-full" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-10" />

                {/* شارة طافية بالأعلى */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-[11px] sm:text-xs font-black border border-blue-400 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>{isAr ? '🇮🇹 🇹🇷 استيراد مباشر' : 'Direct Import'}</span>
                  </span>
                </div>

                {/* شارة طافية بالأسفل */}
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] sm:text-xs font-bold border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <span>⚡ {isAr ? 'نحاس وألومنيوم صافي 100%' : '100% Pure Metal'}</span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 2. تفاصيل الأسلاك والمواصفات بالهوية الزرقاء البارزة */}
            <motion.div 
              initial={{ opacity: 0, x: isAr ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="lg:col-span-6 flex flex-col justify-center text-right"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold w-fit mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'معايير الجودة والتأسيس الكهربائي' : 'Electrical Standards & Cables'}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">
                {isAr ? (
                  <>أسلاك وكوابل إيطالية وتركية <br /><span className="text-blue-600">من المصنع مباشرة</span></>
                ) : (
                  <>Italian & Turkish Wires <br /><span className="text-blue-600">Direct from Source</span></>
                )}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed mb-6 font-normal">
                {isAr
                  ? 'نوفر أفضل وأجود أنواع الأسلاك والكوابل الإيطالية والتركية المعتمدة لجميع مشاريع التأسيس السكني والتجاري بنحاس نقي 100% وعزل حراري فائق الأمان.'
                  : 'We supply certified Italian and Turkish wires and cables engineered with 100% pure electrolytic copper and flame-retardant PVC insulation.'}
              </p>

              {/* كروت المواصفات الفاخرة */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-1">
                  <span className="text-xl">🇮🇹 🇹🇷</span>
                  <span className="text-xs font-bold text-slate-900">{isAr ? 'استيراد مباشر' : 'Direct Import'}</span>
                  <span className="text-[10px] text-slate-500">{isAr ? 'من كبرى المصانع' : 'From Top Factories'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-1">
                  <span className="text-xl">⚡</span>
                  <span className="text-xs font-bold text-slate-900">{isAr ? 'نحاس إلكتروليتي' : 'Pure Copper'}</span>
                  <span className="text-[10px] text-slate-500">{isAr ? 'نقاء وتوصيل 100%' : '100% Conductivity'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-1">
                  <span className="text-xl">🛡️</span>
                  <span className="text-xs font-bold text-slate-900">{isAr ? 'عزل معتمد' : 'Certified PVC'}</span>
                  <span className="text-[10px] text-slate-500">{isAr ? 'مقاوم للحرارة' : 'Flame Retardant'}</span>
                </div>
              </div>

              {/* أزرار الإجراءات التفاعلية */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
                <Link 
                  to="/products"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 text-center"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isAr ? 'تسوق الأسلاك بالمتجر الإلكتروني ←' : 'Shop Store Wires ←'}</span>
                </Link>
              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* 9. قسم اللعبة التفاعلية الحصرية: رحلة النور */}
      <section id="game-teaser" className="py-12 md:py-16 relative overflow-hidden border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden text-right">
            
            <div className="flex items-center gap-5 flex-row">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-[10px] sm:text-xs font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>{isAr ? 'لعبة تفاعلية حصرية' : 'Exclusive Game'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isAr ? 'رحلة النور | بطل الإنارة الحديثة 🎮' : 'Light Quest | Modern Enarah Hero 🎮'}
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
              className="w-full md:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 shadow-md shadow-blue-500/25 cursor-pointer"
            >
              <span>{isAr ? 'العب واكسب الخصم الآن' : 'Play & Win Discount'}</span>
              <ArrowLeft className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
            </Link>

          </div>
        </div>
      </section>

      {/* 10. ابدأ مشروعك معنا اليوم (CTA + Social Links) */}
      <section id="start" className="py-20 md:py-28 relative overflow-hidden border-t border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="relative bg-white border border-slate-200 rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.06),transparent_70%)] pointer-events-none" />

            <h2 className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              {isAr ? (
                <>ابدأ مشروعك معنا <span className="text-blue-600">اليوم</span></>
              ) : (
                <>Start Your Project With Us <span className="text-blue-600">Today</span></>
              )}
            </h2>
            <p className="relative z-10 text-slate-600 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              {isAr 
                ? 'نحن هنا لنساعدك في تحويل رؤيتك إلى واقع مبهر. تواصل مع خبرائنا للحصول على استشارة هندسية وفنية لمشروعك، أو لطلب فواتير المواد وعروض الأسعار المتكاملة لمشروعك الكهربائي.'
                : 'We are here to help you transform your vision into a stunning reality. Contact our experts for engineering and technical consultations, or to request material invoices and comprehensive quotes for your electrical project.'
              }
            </p>
            <Link to="/contact" className="relative z-10 inline-flex items-center gap-2.5 px-8 py-4 bg-blue-600 text-white font-bold text-base md:text-lg rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 active:scale-95">
              <Zap className="w-5 h-5 text-amber-300" />
              {isAr ? 'تواصل معنا الآن' : 'Contact Us Now'}
            </Link>

            {/* روابط التواصل الاجتماعي للفيسبوك وتيك توك وإنستغرام */}
            <div className="flex justify-center mt-12 relative z-10">
              <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 ${
                isAr ? 'flex-row' : 'flex-row-reverse'
              }`}>
                <span className={`text-slate-600 text-xs font-bold ${isAr ? 'pl-3 border-l' : 'pr-3 border-r'} border-slate-200`}>
                  {isAr ? 'تابع صفحاتنا:' : 'Follow us:'}
                </span>
                <div className="flex items-center gap-2.5">
                  <a 
                    href="https://www.facebook.com/share/1BxjvUxxvG/?mibextid=wwXIfr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 flex items-center justify-center shadow-sm"
                    title="فيسبوك"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://www.instagram.com/enara_hadetha?igsh=MXVqaGlqdHN5cnM5OQ==" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all duration-200 flex items-center justify-center shadow-sm"
                    title="إنستغرام"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@modernenara?_r=1&_t=ZS-96dCObkuFUK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-black hover:border-black transition-all duration-200 flex items-center justify-center shadow-sm"
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
                          <img src={url} alt="thumbnail" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
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
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{selectedProject.name}</h2>
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
                        className="inline-flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/30 active:scale-98"
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
