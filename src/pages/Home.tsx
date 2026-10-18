import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../hooks/useLanguage'
import { useShake } from '../hooks/use-shake'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Phone,
  MapPin,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  X,
  PlayCircle,
  Loader2,
  Menu,
  Sun,
  Flame,
  Power,
  Lightbulb,
  CheckCircle2,
  Sliders,
  Zap,
  Globe,
  Building2,
  ShoppingCart,
  BookOpen,
  Gamepad2,
  Trophy
} from 'lucide-react'
import type { ProjectItem } from '../data/projectsData'
import {
  getLocalizedProject,
  INITIAL_PROJECTS,
  getOptimizedProjectImageUrl
} from '../data/projectsData'
import { initHeroVideoCache, getOptimalHeroVideoPath } from '../utils/videoCache'
import { ENARAH_PRODUCTS } from '../components/EnarahProductsCarousel'

// Lazy load GameEngine for instant interactive play on homepage without heavy initial bundle
const GameEngine = React.lazy(() =>
  import('../components/game/GameEngine').then((module) => ({ default: module.GameEngine }))
)

/* =========================================================================
   1. Data Definitions (Colors, Brands, Featured Categories, Trust Items)
   ========================================================================= */

const getPaintColors = (isAr: boolean) => [
  {
    id: 'white',
    name: isAr ? 'أبيض ناصع' : 'Pure White',
    toneEn: 'Pure Off-White',
    hex: '#F8F9FA',
    lrv: '88% (عكس فائق)',
    ral: 'RAL 9016',
    roomSuggestion: {
      warm: isAr ? 'المجالس العائلية وغرف النوم الرئيسية' : 'Family lounges & master bedrooms',
      natural: isAr ? 'الصالات الرئيسية والممرات المعمارية' : 'Living areas & corridors',
      cool: isAr ? 'المكاتب الحديثة وصالات العرض' : 'Modern offices & showrooms'
    },
    contrastMood: {
      warm: isAr ? 'دفء كلاسيكي مريح' : 'Cozy ambient warmth',
      natural: isAr ? 'تطابق معماري نقي' : 'Purest architectural fidelity',
      cool: isAr ? 'إشراق نهاري عالي الوضوح' : 'High-clarity daylight brilliance'
    },
    advice: {
      warm: isAr
        ? 'يعطي دفئاً ومظهراً كلاسيكياً مريحاً للعين، خيار مثالي لغرف النوم والمجالس العائلية.'
        : 'Provides warmth and a classic look comfortable to the eye, ideal for bedrooms and lounges.',
      natural: isAr
        ? 'الخيار المعماري الأمثل للجدران البيضاء! يبرز نقاء اللون دون اصفرار أو برودة مصطنعة.'
        : 'The best architectural choice for white walls! Highlights purity without yellow tint or coldness.',
      cool: isAr
        ? 'إضاءة عملية عالية الوضوح تحاكي ضوء النهار المفتوح، تناسب المكاتب وصالات العرض الحديثة.'
        : 'High-clarity practical lighting simulating daylight, suitable for modern offices and showrooms.'
    }
  },
  {
    id: 'beige',
    name: isAr ? 'بيج دافئ' : 'Warm Beige',
    toneEn: 'Cashmere Beige',
    hex: '#F4ECE1',
    lrv: '68% (انعكاس متوازن)',
    ral: 'RAL 1015',
    roomSuggestion: {
      warm: isAr ? 'الصالات الفاخرة والمجالس الملكية' : 'Luxury majlis & salons',
      natural: isAr ? 'غرف المعيشة وصالات الطعام' : 'Living rooms & dining areas',
      cool: isAr ? 'غير محبذ مع البيج الدافئ' : 'Not recommended with beige'
    },
    contrastMood: {
      warm: isAr ? 'انسجام استثنائي فاخر' : 'Opulent warm harmony',
      natural: isAr ? 'توازن واقعي يظهر خامة الطلاء' : 'Natural balanced fidelity',
      cool: isAr ? 'يبهت درجات البيج' : 'Dulls warm undertones'
    },
    advice: {
      warm: isAr
        ? 'انسجام معماري استثنائي! يعزز عمق البيج ويخلق أجواء حميمية وفخمة للصالات والمجالس.'
        : 'Exceptional harmony! Enhances beige warmth, creating a cozy and luxurious salon ambiance.',
      natural: isAr
        ? 'خيار متوازن ومحايد يظهر الملمس الحقيقي للطلاء وأثاث المساحة بأقصى واقعية.'
        : 'Balanced, neutral choice showcasing true paint texture and furniture with maximum fidelity.',
      cool: isAr
        ? 'غير محبذ مع البيج؛ فالضوء البارد يكسر دفء الجدار ويجعله يبدو باهتاً أو مائلاً للرمادي.'
        : 'Not recommended with beige; cool light breaks warmth, making the wall appear pale or grey.'
    }
  },
  {
    id: 'grey',
    name: isAr ? 'رمادي عصري' : 'Modern Grey',
    toneEn: 'Contemporary Grey',
    hex: '#E2E6EA',
    lrv: '54% (تدرج حيادي)',
    ral: 'RAL 7035',
    roomSuggestion: {
      warm: isAr ? 'المجالس العصرية بحذر لوني' : 'Modern lounges with care',
      natural: isAr ? 'المساحات المعمارية المفتوحة' : 'Open architectural spaces',
      cool: isAr ? 'المكاتب التقنية وصالات العرض' : 'Minimalist tech offices'
    },
    contrastMood: {
      warm: isAr ? 'يكسر البرودة بمسحة صفراء' : 'Softens cool undertones',
      natural: isAr ? 'التطابق المعماري الأكثر دقة' : 'Definitive architectural match',
      cool: isAr ? 'طابع تقني معاصر يوحي بالاتساع' : 'Futuristic architectural feel'
    },
    advice: {
      warm: isAr
        ? 'تنبيه معماري: الضوء الدافئ الشديد قد يُكسب الرمادي مسحة مصفرة، استخدمه بحذر.'
        : 'Architectural note: High warm light can impart a yellowish cast onto grey surfaces.',
      natural: isAr
        ? 'التطابق المعماري الأكثر دقة! يحافظ على هدوء الرمادي وجماله المعاصر دون أي تشتيت.'
        : 'The most precise architectural match! Preserves grey neutrality and modern aesthetics.',
      cool: isAr
        ? 'يعزز الطابع المعماري التقني والمستقبلي للرمادي، مناسب للمطابخ والمكاتب المعاصرة.'
        : 'Enhances modern technical and minimalist grey character, great for contemporary spaces.'
    }
  },
  {
    id: 'navy',
    name: isAr ? 'أزرق كحلي' : 'Deep Navy',
    toneEn: 'Royal Accent Navy',
    hex: '#1E293B',
    lrv: '11% (امتصاص وتباين)',
    ral: 'RAL 5008',
    roomSuggestion: {
      warm: isAr ? 'الجدران المميزة (Accent Walls)' : 'Feature accent walls',
      natural: isAr ? 'جدران التحف واللوحات الفنية' : 'Art gallery walls & salons',
      cool: isAr ? 'المساحات المستقبلية وصالات العرض' : 'Modern minimalist showrooms'
    },
    contrastMood: {
      warm: isAr ? 'تباين درامي فاخر وهادئ' : 'Rich dramatic contrast',
      natural: isAr ? 'إظهار عمق الكحلي بواقعية' : 'Balanced optical depth',
      cool: isAr ? 'تركيز ضوئي حاد معاصر' : 'Crisp modern focus'
    },
    advice: {
      warm: isAr
        ? 'يخلق تبايناً درامياً فاخراً يبرز تفاصيل الجدران المميزة (Accent Walls) بأناقة هادئة.'
        : 'Creates a rich dramatic contrast, highlighting accent walls with quiet elegance.',
      natural: isAr
        ? 'يظهر عمق وتدرجات اللون الكحلي الطبيعية بدقة بصرية متوازنة ومريحة للنظر.'
        : 'Displays deep navy undertones with balanced visual precision and optical comfort.',
      cool: isAr
        ? 'يبرز درجات الأزرق الحقيقية ويمنح الجدار إحساساً بارداً وحاداً يناسب المساحات العصرية.'
        : 'Highlights pure blue tones, giving the wall a crisp modern feel.'
    }
  },
  {
    id: 'green',
    name: isAr ? 'أخضر زيتي' : 'Olive Green',
    toneEn: 'Heritage Olive',
    hex: '#3F4E3F',
    lrv: '16% (عمق ترابي فخم)',
    ral: 'RAL 6003',
    roomSuggestion: {
      warm: isAr ? 'المجالس، غرف القراءة والاسترخاء' : 'Reading lounges & majlis',
      natural: isAr ? 'المساحات المعيشية المتصلة بالطبيعة' : 'Biophilic living spaces',
      cool: isAr ? 'صالات الاستقبال وبيئات العمل' : 'Executive reception spaces'
    },
    contrastMood: {
      warm: isAr ? 'طابع عضوي ترابي مريح' : 'Earthy organic warmth',
      natural: isAr ? 'نضارة طبيعية واقعية نابضة' : 'Fresh natural presence',
      cool: isAr ? 'طابع رسمي منضبط' : 'Disciplined formal tone'
    },
    advice: {
      warm: isAr
        ? 'يعزز الطابع الطبيعي والترابي للأخضر الزيتي، ويوفر بيئة دافئة مريحة للاسترخاء.'
        : 'Enhances earthy organic olive tones, creating a cozy and relaxing atmosphere.',
      natural: isAr
        ? 'يظهر نضارة درجات الأخضر الطبيعية بدقة واقعية تجعل المساحة مفعمة بالحياة.'
        : 'Displays authentic green freshness, keeping the interior feeling alive and vibrant.',
      cool: isAr
        ? 'يقلل من دفء الأخضر ويمنحه طابعاً رسمياً عملياً يلائم بيئات العمل والاستقبال.'
        : 'Tones down green warmth for a structured, formal look suitable for reception spaces.'
    }
  }
]

// Same product list as the live homepage (single source of truth),
// so any product added to ENARAH_PRODUCTS appears here automatically.
const FEATURED_COLLECTIONS = ENARAH_PRODUCTS.map((p) => ({
  id: p.id,
  nameAr: p.categoryAr,
  nameEn: p.categoryEn,
  titleAr: p.titleAr,
  titleEn: p.titleEn,
  descAr: p.descAr,
  descEn: p.descEn,
  tagAr: p.tagAr,
  tagEn: p.tagEn,
  image: p.image,
  group: p.group
}))

const GLOBAL_BRANDS = [
  { name: 'Legrand', origin: 'فرنسا 🇫🇷', logo: '/images/brand-legrand.png?v=2' },
  { name: 'Philips', origin: 'هولندا 🇳🇱', logo: '/images/brand-philips.png?v=2' },
  { name: 'Gewiss', origin: 'إيطاليا 🇮🇹', logo: '/images/brand-gewiss.png?v=2' },
  { name: 'CHINT', origin: 'الصين 🇨🇳', logo: '/images/brand-chint.png?v=2' },
  { name: 'WELLMAX', origin: 'الصين 🇨🇳', logo: '/images/brand-wellmax.png?v=2' },
  { name: 'Alfanar', origin: 'السعودية 🇸🇦', logo: '/images/brand-alfanar.png?v=2' },
  { name: 'Fumagalli', origin: 'إيطاليا 🇮🇹', logo: '/images/brand-fumagalli.png?v=2' },
  { name: 'Commax', origin: 'كوريا 🇰🇷', logo: '/images/brand-commax.png?v=2' },
  { name: 'CATA', origin: 'تركيا 🇹🇷', logo: '/images/brand-cata.png?v=2' },
  { name: 'Borsan', origin: 'تركيا 🇹🇷', logo: '/images/brand-borsan.png?v=2' },
  { name: 'Makel', origin: 'تركيا 🇹🇷', logo: '/images/brand-makel.png?v=2' },
  { name: 'Isildar', origin: 'تركيا 🇹🇷', logo: '/images/brand-isildar.png?v=2' }
]

/* =========================================================================
   SyncedStats: all numbers share ONE animation clock & ONE trigger,
   so they start together and land on their final values at the same moment.
   ========================================================================= */

type StatItem = { value: number; prefix?: string; label: string }

function SyncedStats({ items, duration = 2200 }: { items: StatItem[]; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        setProgress(1 - Math.pow(1 - t, 3)) // easeOutCubic — shared by all numbers
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          run()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [duration])

  return (
    <div ref={ref} className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-[#E7EAF0]">
      {items.map((item) => (
        <div key={item.label}>
          <span className="text-2xl sm:text-3xl font-bold text-[#0062D2] tracking-tight block">
            <span className="tabular-nums" dir="ltr">
              {item.prefix}
              {Math.round(progress * item.value)}
            </span>
          </span>
          <span className="text-xs sm:text-sm text-[#68717D] mt-1 block">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/* =========================================================================
   2. Main Component: HomeCleanWhitePreview
   ========================================================================= */

export default function Home() {
  const { isAr } = useLanguage()
  const paintColors = getPaintColors(isAr)

  // Section 04: in-place "show all products" toggle & quick view modal
  const [showAllCollections, setShowAllCollections] = useState(false)
  const [activeCollectionModal, setActiveCollectionModal] = useState<typeof FEATURED_COLLECTIONS[0] | null>(null)
  const collectionsRef = useRef<HTMLElement>(null)

  // Navigation scroll state
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 150)
  }

  const moreLinks = [
    {
      path: '/contractors',
      label: isAr ? 'قسم المقاولين والكميات' : 'Contractors & Bulk Supply',
      desc: isAr ? 'عروض أسعار خاصة وتوريد المشاريع الكبرى' : 'Special bulk quotes for contractors',
      icon: Building2,
      badge: isAr ? 'خاص' : 'Pro'
    },
    {
      path: '/wire-prices',
      label: isAr ? 'أسعار الأسلاك' : 'Wire Prices',
      desc: isAr ? 'جدول أسعار الأسلاك والمناشئ المعتمدة' : 'Daily certified wire prices',
      icon: Zap,
      badge: isAr ? 'يومي' : 'Daily'
    },
    {
      path: '/branches',
      label: isAr ? 'فروعنا' : 'Our Branches',
      desc: isAr ? 'معارض بنغازي والبيضاء وأوقات العمل' : 'Benghazi & Al-Bayda showrooms',
      icon: MapPin
    },
    {
      path: '/blog',
      label: isAr ? 'المدونة' : 'Architectural Blog',
      desc: isAr ? 'هندسة الإضاءة والأفكار المعمارية' : 'Lighting design & photometrics',
      icon: BookOpen
    },
    {
      path: '/about',
      label: isAr ? 'من نحن' : 'About Us',
      desc: isAr ? 'تاريخنا ومسيرة ريادتنا منذ عام 1988' : 'Pioneering heritage since 1988',
      icon: Award
    },
    {
      path: '/game',
      label: isAr ? 'بطل الإنارة (اللعبة)' : 'Light Quest Game',
      desc: isAr ? 'تحدي الإنارة التفاعلي وكوبونات الخصم' : 'Interactive mini-game & vouchers',
      icon: Gamepad2,
      badge: isAr ? 'تفاعلية' : 'Play'
    }
  ]

  // Hero Video State & Adaptive Local Blob Caching
  const heroVideoRef = useRef<HTMLVideoElement>(null)
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

  // =========================================================================
  // SECTION 06: Light Experience - Architectural Temperature Simulator
  // Default State: LIGHTS_OFF (Artificial lights initially OFF)
  // Continuous Kelvin Range (3000K to 6000K), Default 4000K
  // =========================================================================
  const [simLightsOn, setSimLightsOn] = useState<boolean>(false)
  const [simKelvin, setSimKelvin] = useState<number>(4000)
  const [isSimDragging, setIsSimDragging] = useState<boolean>(false)

  // Quick preset selection: turns artificial lights ON and smoothly transitions to Kelvin value
  const handleSimPreset = (k: number) => {
    setIsSimDragging(false)
    setSimKelvin(k)
    setSimLightsOn(true)
  }

  // Master turn off action: returns to natural dark architectural scene
  const handleTurnLightsOff = () => {
    setIsSimDragging(false)
    setSimLightsOn(false)
  }

  // Live metadata for active Kelvin value or OFF state
  const getSimKelvinMeta = (k: number, isLightsOn: boolean) => {
    if (!isLightsOn) {
      return {
        arabicLabel: 'الإنارة مطفأة',
        englishLabel: 'Lights OFF',
        dotColor: '#64748B',
        badgeBg: 'rgba(100, 116, 139, 0.15)',
        badgeBorder: 'rgba(100, 116, 139, 0.35)',
        desc: isAr
          ? 'المساحة في الإضاءة المسائية الطبيعية بدون أي إنارة صناعية؛ اختر درجة لتشغيلها.'
          : 'Space in natural ambient dusk with all artificial lights off. Select a temperature to illuminate.'
      }
    }
    if (k < 3500) {
      return {
        arabicLabel: 'دافئ',
        englishLabel: 'Warm White',
        dotColor: '#FFB85A',
        badgeBg: 'rgba(255, 184, 90, 0.15)',
        badgeBorder: 'rgba(255, 184, 90, 0.35)',
        desc: isAr
          ? 'إضاءة دافئة معمارية (3000K) تبرز دفء خشب الجوز وتجاويف حجر الترافرتين دون اصفرار زائد.'
          : 'Warm architectural white (3000K) with controlled golden warmth, enhancing walnut wood and travertine.'
      }
    }
    if (k <= 4500) {
      return {
        arabicLabel: 'محايد',
        englishLabel: 'Neutral White',
        dotColor: '#FFFFFF',
        badgeBg: 'rgba(255, 255, 255, 0.15)',
        badgeBorder: 'rgba(255, 255, 255, 0.35)',
        desc: isAr
          ? 'إضاءة محايدة نقية (4000K) تحافظ على توازن ألوان الخشب والحجر والزجاج والنباتات بواقعية تامة.'
          : 'Clean neutral white (4000K) preserving authentic stone, wood, glass and vegetation tones.'
      }
    }
    return {
      arabicLabel: 'بارد',
      englishLabel: 'Cool White',
      dotColor: '#93C5FD',
      badgeBg: 'rgba(147, 197, 253, 0.15)',
      badgeBorder: 'rgba(147, 197, 253, 0.35)',
      desc: isAr
        ? 'إضاءة باردة نقية (6000K) مع مسحة انتعاش خفيفة متميزة عن 4000K دون أي زرقة مصطنعة.'
        : 'Clean cool white (6000K) with subtle cool bounce, clearly distinguishable without unnatural blue.'
    }
  }

  const activeSimMeta = getSimKelvinMeta(simKelvin, simLightsOn)

  // Compute precise opacities for the 3 stacked photorealistic room renders:
  // Base (z: 1): room-3000k.jpg (always 1 underneath)
  // Neutral (z: 2): room-4000k.jpg (fades in from 3000 to 4000, stays at 1 above 4000)
  // Cool (z: 3): room-6000k.jpg (fades in from 4000 to 6000)
  const getSimOpacities = (k: number) => {
    const neutralOpacity = k <= 3000 ? 0 : k <= 4000 ? (k - 3000) / 1000 : 1
    const coolOpacity = k <= 4000 ? 0 : (k - 4000) / 2000
    return { neutralOpacity, coolOpacity }
  }

  const { neutralOpacity: simNeutralOpacity, coolOpacity: simCoolOpacity } = getSimOpacities(simKelvin)

  // Preload all photorealistic variations for Room Simulator & Wall Simulator
  useEffect(() => {
    const simPhotos = [
      '/images/simulator/room-all-off.jpg?v=2',
      '/images/simulator/room-3000k.jpg?v=2',
      '/images/simulator/room-4000k.jpg?v=2',
      '/images/simulator/room-6000k.jpg?v=2',
      '/images/wall-simulator/wall-white-warm.jpg',
      '/images/wall-simulator/wall-white-cool.jpg',
      '/images/wall-simulator/wall-beige-warm.jpg',
      '/images/wall-simulator/wall-beige-cool.jpg',
      '/images/wall-simulator/wall-grey-warm.jpg',
      '/images/wall-simulator/wall-grey-cool.jpg',
      '/images/wall-simulator/wall-navy-warm.jpg',
      '/images/wall-simulator/wall-navy-cool.jpg',
      '/images/wall-simulator/wall-green-warm.jpg',
      '/images/wall-simulator/wall-green-cool.jpg'
    ]
    simPhotos.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  const [selectedPaintId, setSelectedPaintId] = useState('white')
  const [paintTemp, setPaintTemp] = useState<'warm' | 'natural' | 'cool'>('warm')
  const [paintTransitioning, setPaintTransitioning] = useState(false)

  // Selected Projects Lightbox
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [activeProjectImgIndex, setActiveProjectImgIndex] = useState(0)

  // Listen to window scroll for sticky navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mobile shake interaction for paint simulator
  useShake({
    onShake: () => {
      setPaintTemp((prev) => (prev === 'warm' ? 'natural' : prev === 'natural' ? 'cool' : 'warm'))
      setPaintTransitioning(true)
      setTimeout(() => setPaintTransitioning(false), 200)
    }
  })

  // Smooth transition trigger when paint/light changes
  useEffect(() => {
    setPaintTransitioning(true)
    const timer = setTimeout(() => setPaintTransitioning(false), 150)
    return () => clearTimeout(timer)
  }, [selectedPaintId, paintTemp])
  const currentPaint = paintColors.find((p) => p.id === selectedPaintId) || paintColors[0]

  return (
    <div
      dir="rtl"
      className="min-h-screen text-[#15191E] bg-[#F7F8FA] font-sans antialiased selection:bg-[#0062D2] selection:text-white"
      style={{
        fontFamily:
          "'IBM Plex Sans Arabic', 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* =====================================================================
          NAVIGATION: Minimal Premium Sticky Navigation
          Desktop: 76px-88px, semi-opaque light neutral on scroll, clean typography
          ===================================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E7EAF0] py-3.5'
            : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent py-5 text-white'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative flex items-center justify-between min-h-[44px]">
          {/* Desktop Nav Links - Centered */}
          <nav className="hidden lg:flex items-center justify-center gap-7 text-sm font-medium absolute left-1/2 -translate-x-1/2">
            <Link
              to="/products"
              className={`transition-colors hover:text-[#0062D2] ${
                isScrolled ? 'text-[#15191E]' : 'text-white/95 hover:text-white'
              }`}
            >
              المنتجات
            </Link>
            <Link
              to="/offers"
              className={`transition-colors hover:text-[#0062D2] ${
                isScrolled ? 'text-[#15191E]' : 'text-white/95 hover:text-white'
              }`}
            >
              العروض
            </Link>
            <Link
              to="/projects"
              className={`transition-colors hover:text-[#0062D2] ${
                isScrolled ? 'text-[#15191E]' : 'text-white/95 hover:text-white'
              }`}
            >
              المشاريع
            </Link>
            <Link
              to="/brands"
              className={`transition-colors hover:text-[#0062D2] ${
                isScrolled ? 'text-[#15191E]' : 'text-white/95 hover:text-white'
              }`}
            >
              العلامات التجارية
            </Link>

            {/* خانة المزيد (القائمة المنسدلة للأقسام الأخرى) */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1 ${
                  dropdownOpen
                    ? 'text-[#0062D2] font-semibold'
                    : isScrolled
                    ? 'text-[#15191E] hover:text-[#0062D2]'
                    : 'text-white/95 hover:text-white'
                }`}
                aria-expanded={dropdownOpen}
              >
                <span>المزيد</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen
                      ? 'rotate-180 text-[#0062D2]'
                      : isScrolled
                      ? 'text-slate-400'
                      : 'text-white/70'
                  }`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute top-full -right-6 mt-2.5 w-80 bg-white text-[#15191E] rounded-2xl shadow-xl border border-[#E7EAF0] p-2 z-50 text-right"
                    dir="rtl"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <span className="text-[11px] font-semibold text-[#68717D] uppercase tracking-wider block">
                        أقسام وخدمات إضافية
                      </span>
                    </div>

                    <div className="space-y-1">
                      {moreLinks.map((item) => {
                        const IconComponent = item.icon
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-[#15191E] transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#EBF3FC] text-[#0062D2] group-hover:bg-[#0062D2] group-hover:text-white transition-colors flex items-center justify-center shrink-0 mt-0.5">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col flex-grow">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-xs font-semibold group-hover:text-[#0062D2] transition-colors leading-tight">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-[#68717D] font-normal leading-tight mt-1 line-clamp-1">
                                {item.desc}
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </nav>

          {/* Primary CTA & Mobile Toggle */}
          <div className="flex items-center gap-4 ms-auto z-10">
            <Link
              to="/contact"
              className={`hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                isScrolled
                  ? 'bg-[#0062D2] text-white hover:bg-[#0047A5] shadow-sm'
                  : 'bg-white text-[#15191E] hover:bg-white/90 shadow-sm'
              }`}
            >
              تواصل معنا
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-[#15191E] hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen / Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden bg-white text-[#15191E] border-b border-[#E7EAF0] px-6 py-8 shadow-xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex flex-col gap-4 text-base font-semibold">
                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#0062D2] transition-colors py-2 border-b border-slate-100 flex items-center justify-between"
                >
                  <span>المنتجات والتشكيلات</span>
                  <ArrowLeft className="w-4 h-4 opacity-40" />
                </Link>
                <Link
                  to="/offers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#0062D2] transition-colors py-2 border-b border-slate-100 flex items-center justify-between"
                >
                  <span>العروض والتخفيضات</span>
                  <ArrowLeft className="w-4 h-4 opacity-40" />
                </Link>
                <Link
                  to="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#0062D2] transition-colors py-2 border-b border-slate-100 flex items-center justify-between"
                >
                  <span>المشاريع المنفذة</span>
                  <ArrowLeft className="w-4 h-4 opacity-40" />
                </Link>
                <Link
                  to="/brands"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#0062D2] transition-colors py-2 border-b border-slate-100 flex items-center justify-between"
                >
                  <span>العلامات والشركاء</span>
                  <ArrowLeft className="w-4 h-4 opacity-40" />
                </Link>
                {/* أقسام إضافية في الجوال */}
                <div className="pt-2 pb-1 border-t border-slate-100">
                  <span className="text-xs font-semibold text-[#68717D] uppercase tracking-wider block mb-2">
                    أقسام وخدمات إضافية
                  </span>
                  <div className="space-y-1">
                    {moreLinks.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 px-3 rounded-lg text-sm text-[#475569] hover:bg-slate-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon className="w-4 h-4 text-[#0062D2]" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <ArrowLeft className="w-3.5 h-3.5 opacity-40" />
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 text-center py-3 bg-[#0062D2] text-white rounded-xl font-semibold shadow-sm hover:bg-[#0047A5] transition-colors"
                >
                  تواصل معنا
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =====================================================================
          SECTION 01: Immersive Editorial Hero
          Height: 85-95vh desktop, 75-85vh mobile
          Real architectural photography, controlled highlights, natural shadows
          Eyebrow: ENARAH MODERN — SINCE 1988
          Headline: الضوء الذي يغيّر المساحة
          ===================================================================== */}
      <section className="relative w-full h-[88vh] min-h-[620px] max-h-[960px] flex items-end sm:items-center overflow-hidden bg-[#101820]">
        {/* Background Architectural Video */}
        <div className="absolute inset-0 z-0">
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
            className="w-full h-full object-cover object-center scale-[1.01] pointer-events-none"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          />
          {/* Subtle architectural dark vignette only for typography legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/90 via-[#101820]/35 to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101820]/80 via-transparent to-transparent hidden lg:block pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-16 pb-16 sm:pb-0 pt-24 text-white">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2] animate-pulse" />
              <span>ENARAH MODERN — SINCE 1988</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.08] mb-5">
              الضوء الذي يغيّر المساحة
            </h1>

            {/* Supporting Copy (Max 2 lines) */}
            <p className="text-base sm:text-lg lg:text-xl text-white/85 font-normal leading-relaxed mb-8 max-w-xl">
              حلول إضاءة معمارية وأنظمة كهربائية متقدمة، تُبرز تفاصيل البناء وتمنح كل مساحة هوية بصرية تدوم.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#0062D2] hover:bg-[#0047A5] text-white font-medium text-sm rounded-full transition-all duration-200 shadow-lg shadow-[#0062D2]/25 group"
              >
                <span>اكتشف حلول الإضاءة</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-medium text-sm rounded-full transition-all duration-200"
              >
                <span>مشاريعنا</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Ambient bottom fade into section 02 */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#F7F8FA] to-transparent pointer-events-none" />
      </section>

      {/* =====================================================================
          SECTION 02: Trust Bar (Credibility Strip)
          Minimal horizontal strip, brand royal blue accents (#0062D2), refined typography
          Content: منذ 1988 · علامات عالمية · حلول للمشاريع · خبرة فنية متخصصة
          ===================================================================== */}
      <section className="bg-[#FFFFFF] border-b border-[#E7EAF0] py-7 sm:py-9 relative shadow-[0_4px_20px_-10px_rgba(0,98,210,0.04)]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#E7EAF0]">
            
            {/* Item 1: منذ 1988 */}
            <div className="pt-4 lg:pt-0 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-3 px-2 lg:px-3 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#0062D2]/[0.08] border border-[#0062D2]/15 flex items-center justify-center text-[#0062D2] shrink-0 group-hover:bg-[#0062D2] group-hover:text-white group-hover:border-[#0062D2] transition-all duration-300 shadow-sm">
                <Award className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#15191E] font-sans leading-snug whitespace-nowrap group-hover:text-[#0062D2] transition-colors duration-200">
                  {isAr ? (
                    <>منذ <span className="text-[#0062D2] font-black">1988</span></>
                  ) : (
                    <>Since <span className="text-[#0062D2] font-black">1988</span></>
                  )}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#5A6474] mt-1 font-normal leading-relaxed">
                  {isAr ? 'أكثر من ثلاثة عقود من الريادة المعمارية' : 'Over three decades of architectural leadership'}
                </p>
              </div>
            </div>

            {/* Item 2: علامات عالمية */}
            <div className="pt-4 lg:pt-0 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-3 px-2 lg:px-3 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#0062D2]/[0.08] border border-[#0062D2]/15 flex items-center justify-center text-[#0062D2] shrink-0 group-hover:bg-[#0062D2] group-hover:text-white group-hover:border-[#0062D2] transition-all duration-300 shadow-sm">
                <Globe className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#15191E] font-sans leading-snug whitespace-nowrap group-hover:text-[#0062D2] transition-colors duration-200">
                  {isAr ? 'علامات عالمية' : 'Global Brands'}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#5A6474] mt-1 font-normal leading-relaxed">
                  {isAr ? 'شراكات مع رواد الصناعة الأوروبية والدولية' : 'Partnerships with European & global industry leaders'}
                </p>
              </div>
            </div>

            {/* Item 3: حلول للمشاريع */}
            <div className="pt-4 lg:pt-0 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-3 px-2 lg:px-3 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#0062D2]/[0.08] border border-[#0062D2]/15 flex items-center justify-center text-[#0062D2] shrink-0 group-hover:bg-[#0062D2] group-hover:text-white group-hover:border-[#0062D2] transition-all duration-300 shadow-sm">
                <Building2 className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#15191E] font-sans leading-snug whitespace-nowrap group-hover:text-[#0062D2] transition-colors duration-200">
                  {isAr ? 'حلول للمشاريع' : 'Project Solutions'}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#5A6474] mt-1 font-normal leading-relaxed">
                  {isAr ? 'توريد هندسي متكامل للمباني والمجمعات والفلل' : 'Integrated engineering supply for commercial & residential'}
                </p>
              </div>
            </div>

            {/* Item 4: خبرة فنية متخصصة */}
            <div className="pt-4 lg:pt-0 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-3 px-2 lg:px-3 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#0062D2]/[0.08] border border-[#0062D2]/15 flex items-center justify-center text-[#0062D2] shrink-0 group-hover:bg-[#0062D2] group-hover:text-white group-hover:border-[#0062D2] transition-all duration-300 shadow-sm">
                <Lightbulb className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#15191E] font-sans leading-snug whitespace-nowrap group-hover:text-[#0062D2] transition-colors duration-200">
                  {isAr ? 'خبرة فنية متخصصة' : 'Technical Expertise'}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#5A6474] mt-1 font-normal leading-relaxed">
                  {isAr ? 'استشارات معمارية وتوزيع ضوئي هندسي دقيق' : 'Architectural consulting and photometric lighting design'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 03: Brand Story (Company Introduction & Credibility)
          Eyebrow: SINCE 1988
          Headline: خبرة بُنيت على الضوء
          Layout: Asymmetric editorial split layout
          Seamlessly merges into Section 04 (Manufactured Collections)
          ===================================================================== */}
      <section className="pt-20 sm:pt-28 pb-12 sm:pb-16 bg-[#FFFFFF]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Editorial Visual (5 cols) — circular brand mark */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
                {/* Slow rotating dashed ring (brand blue) */}
                <div
                  className="absolute -inset-4 rounded-full border border-dashed border-[#0062D2]/30 animate-spin motion-reduce:animate-none"
                  style={{ animationDuration: '40s' }}
                />
                {/* Soft blue halo */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#0062D2]/15 via-transparent to-[#0062D2]/5 blur-md" />

                {/* Circle */}
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white border border-[#E7EAF0] shadow-[0_20px_50px_-20px_rgba(0,98,210,0.25)]">
                  <img
                    src="/images/company-enarah-logo.jpg"
                    alt="شعار شركة الإنارة - منذ 1988"
                    className="w-full h-full object-contain p-[14%]"
                    loading="lazy"
                  />
                </div>

                {/* Established badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#0062D2] text-white text-[11px] font-semibold tracking-widest whitespace-nowrap shadow-lg shadow-[#0062D2]/25">
                  ESTABLISHED 1988
                </div>
              </div>

              {/* Location line */}
              <p className="mt-8 text-sm text-[#68717D] text-center">
                بنغازي — ليبيا · الريادة في حلول الإنارة والتأسيس الكهربائي
              </p>

              {/* Quality micro-card */}
              <div className="mt-5 hidden sm:flex items-center gap-4 bg-white px-5 py-4 rounded-xl border border-[#E7EAF0] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#EBF3FC] text-[#0062D2] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-[#15191E]">ضمان الجودة والسلامة</span>
                  <span className="text-xs text-[#68717D]">منتجات مطابقة للمعايير القياسية العالمية</span>
                </div>
              </div>
            </div>

            {/* Editorial Story Content (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3">
                SINCE 1988
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#15191E] tracking-tight leading-[1.15] mb-6">
                خبرة بُنيت على الضوء
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-[#68717D] leading-relaxed font-normal">
                <p>
                  منذ تأسيس شركة الإنارة عام 1988، انطلقنا برؤية معمارية تضع الضوء في قلب التصميم الداخلي والخارجي كعنصر هندسي أصيل يشكّل الفراغ ويحدد شخصيته.
                </p>
                <p>
                  لأكثر من ثلاثة عقود، واكبنا تطور تقنيات الإنارة العالمية وشيّدنا شراكات استراتيجية متينة مع كبرى العلامات الأوروبية والدولية. نجمع بين الدقة الهندسية والذوق الجمالي لنقدم للمهندسين والمقاولين وأصحاب المنازل حلولاً كهربائية متكاملة ترتقي بالمكان وتمنحه حضوراً استثنائياً يدوم.
                </p>
              </div>

              {/* Three minimalist stats — synchronized count-up */}
              <SyncedStats
                duration={2200}
                items={[
                  { value: 35, prefix: '+', label: 'عاماً من الريادة' },
                  { value: 500, prefix: '+', label: 'مشروع تم تنفيذه' },
                  { value: 15, prefix: '+', label: 'علامة عالمية معتمدة' }
                ]}
              />

              {/* CTA */}
              <div className="mt-10">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#15191E] hover:bg-[#0062D2] text-white text-sm font-semibold rounded-full transition-colors duration-200"
                >
                  <span>تعرف على شركة الإنارة</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 04: ENARAH SIGNATURE COLLECTION ("من تصميمنا وتصنيعنا")
          Luxury Architectural Lighting Collection Showcase
          - Deep-navy architectural framing (#0B1528) with subtle precision grid
          - Crisp white presentation plinths/cards for maximum product clarity
          - Asymmetric editorial composition (Dominant Hero + Complementary Trio)
          - In-place smooth expansion for all 16 collections
          - Interactive quick-view modal for architectural specs & WhatsApp inquiry
          ===================================================================== */}
      <section ref={collectionsRef} className="py-20 sm:py-28 bg-[#0B1528] text-white scroll-mt-28 relative overflow-hidden border-t border-slate-800/80">
        {/* Subtle architectural grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          {/* Section Introduction: Editorial Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#0062D2] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-semibold text-[#38BDF8] tracking-[0.25em] uppercase" dir="ltr">
                  ENARAH SIGNATURE COLLECTION · MADE BY ENARAH
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.2]">
                {isAr ? 'من تصميمنا وتصنيعنا' : 'Designed & Made by Us'}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl font-normal leading-relaxed">
                {isAr
                  ? 'من ENARAH، نقدم تصنيعات تجمع دقة التفاصيل، وتنوّع الحلول، ورقي التصميم.'
                  : 'From ENARAH, we offer creations that combine precision of detail, diversity of solutions, and elegance of design.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300 font-mono tabular-nums" dir="ltr">
                {String(FEATURED_COLLECTIONS.length).padStart(2, '0')} Architectural Lines
              </span>
            </div>
          </div>

          {/* Primary 4 Collections — Asymmetric Architectural Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Dominant Hero Showcase: Collection 01 (Chandeliers) */}
            {(() => {
              const hero = FEATURED_COLLECTIONS[0]
              return (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setActiveCollectionModal(hero)}
                  className="group lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 hover:border-[#0062D2]/40 shadow-xl shadow-black/20 hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden text-right"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#0062D2] bg-blue-50 px-2.5 py-1 rounded-md" dir="ltr">
                        COLLECTION 01
                      </span>
                      {hero.tagAr && (
                        <span className="text-[11px] sm:text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                          {hero.tagAr}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:block" dir="ltr">
                      ARCHITECTURAL HERO
                    </span>
                  </div>

                  {/* Image Showcase — Spacious & Clean */}
                  <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[380px] flex items-center justify-center p-3 sm:p-6 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-slate-50/70 to-white">
                    <img
                      src={hero.image}
                      alt={hero.nameAr}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-product.jpg'
                      }}
                    />
                  </div>

                  {/* Typography & Details */}
                  <div className="mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-[#0062D2] transition-colors tracking-tight">
                        {hero.nameAr}
                      </h3>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0" dir="ltr">
                        {hero.nameEn}
                      </span>
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {hero.descAr}
                    </p>

                    {/* Navigation Action */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0062D2]">
                      <span className="group-hover:underline underline-offset-4">
                        {isAr ? 'استكشف التشكيلة والمعايير' : 'Explore Collection & Specs'}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0062D2] group-hover:bg-[#0062D2] group-hover:text-white flex items-center justify-center transition-all duration-300">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })()}

            {/* Complementary Column: Collection 02 (Spotlights) + Collections 03 & 04 (Profiles & Lamps) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5 sm:gap-6">
              {/* Secondary Feature Card: Collection 02 (Spotlights) */}
              {(() => {
                const spot = FEATURED_COLLECTIONS[1]
                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setActiveCollectionModal(spot)}
                    className="group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-white/10 hover:border-[#0062D2]/40 shadow-xl shadow-black/20 hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden text-right"
                  >
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#0062D2] bg-blue-50 px-2.5 py-1 rounded-md" dir="ltr">
                          COLLECTION 02
                        </span>
                        {spot.tagAr && (
                          <span className="text-[11px] sm:text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[180px]">
                            {spot.tagAr}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider hidden sm:block" dir="ltr">
                        PRECISION OPTICS
                      </span>
                    </div>

                    {/* Spotlight Image Container */}
                    <div className="relative w-full h-[170px] sm:h-[190px] flex items-center justify-center p-3 overflow-hidden rounded-xl bg-gradient-to-b from-slate-50/70 to-white">
                      <img
                        src={spot.image}
                        alt={spot.nameAr}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        onError={(e) => {
                          e.currentTarget.src = '/images/default-product.jpg'
                        }}
                      />
                    </div>

                    <div className="mt-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#0062D2] transition-colors tracking-tight">
                          {spot.nameAr}
                        </h3>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider" dir="ltr">
                          {spot.nameEn}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-1 leading-relaxed">
                        {spot.descAr}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0062D2]">
                        <span className="group-hover:underline underline-offset-4">
                          {isAr ? 'استكشف التشكيلة' : 'Explore Collection'}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0062D2] group-hover:bg-[#0062D2] group-hover:text-white flex items-center justify-center transition-all duration-300">
                          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )
              })()}

              {/* Tertiary Cards: Collections 03 (LED Profiles) & 04 (LED Bulbs) Side by Side */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[FEATURED_COLLECTIONS[2], FEATURED_COLLECTIONS[3]].map((col, idx) => (
                  <motion.article
                    key={col.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setActiveCollectionModal(col)}
                    className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between border border-white/10 hover:border-[#0062D2]/40 shadow-xl shadow-black/20 hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden text-right"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-[#0062D2] bg-blue-50 px-2 py-0.5 rounded" dir="ltr">
                        0{idx + 3}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate max-w-[90px]" dir="ltr">
                        {col.nameEn}
                      </span>
                    </div>

                    <div className="relative w-full h-[115px] sm:h-[135px] flex items-center justify-center p-2 overflow-hidden rounded-lg bg-gradient-to-b from-slate-50/70 to-white">
                      <img
                        src={col.image}
                        alt={col.nameAr}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        onError={(e) => {
                          e.currentTarget.src = '/images/default-product.jpg'
                        }}
                      />
                    </div>

                    <div className="mt-3">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0062D2] transition-colors truncate">
                        {col.nameAr}
                      </h4>
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#0062D2]">
                        <span>{isAr ? 'استكشاف' : 'Explore'}</span>
                        <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>

          {/* In-Place Expansion for Remaining 12 Collections (05 to 16) */}
          <AnimatePresence>
            {showAllCollections && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                {/* Architectural divider */}
                <div className="flex items-center gap-4 my-8 sm:my-12">
                  <div className="h-px bg-white/10 flex-grow" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                    {isAr ? 'كافة التشكيلات المعمارية والكهربائية (12 تشكيلة إضافية)' : 'Complete Architectural & Electrical Lines'}
                  </span>
                  <div className="h-px bg-white/10 flex-grow" />
                </div>

                {/* Balanced 4-column luxury grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-right">
                  {FEATURED_COLLECTIONS.slice(4).map((col, idx) => (
                    <motion.article
                      key={col.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.4) }}
                      onClick={() => setActiveCollectionModal(col)}
                      className="group bg-white rounded-2xl p-5 border border-white/10 hover:border-[#0062D2]/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-mono font-bold text-[#0062D2] bg-blue-50 px-2 py-0.5 rounded" dir="ltr">
                            COLLECTION {String(idx + 5).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate max-w-[120px]" dir="ltr">
                            {col.nameEn}
                          </span>
                        </div>

                        <div className="relative w-full h-[150px] flex items-center justify-center p-2 rounded-xl bg-slate-50/70 overflow-hidden mb-4">
                          <img
                            src={col.image}
                            alt={col.nameAr}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            onError={(e) => {
                              e.currentTarget.src = '/images/default-product.jpg'
                            }}
                          />
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0062D2] transition-colors leading-snug">
                          {col.nameAr}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {col.descAr}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0062D2]">
                        <span className="group-hover:underline underline-offset-4">
                          {isAr ? 'استكشف التشكيلة' : 'Explore'}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-[#0062D2] group-hover:bg-[#0062D2] group-hover:text-white flex items-center justify-center transition-colors">
                          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show all / Show less toggle button */}
          <div className="mt-12 sm:mt-16 flex justify-center">
            <button
              id="toggle-all-collections"
              type="button"
              aria-expanded={showAllCollections}
              onClick={() => {
                if (showAllCollections) {
                  collectionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                setShowAllCollections((v) => !v)
              }}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 text-sm font-semibold backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer active:scale-[0.98]"
            >
              <span>
                {showAllCollections
                  ? (isAr ? 'عرض تشكيلات أقل' : 'Show less')
                  : (isAr ? `عرض جميع المنتجات (${FEATURED_COLLECTIONS.length})` : `View all collections (${FEATURED_COLLECTIONS.length})`)}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${showAllCollections ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Architectural Quick View Modal */}
        <AnimatePresence>
          {activeCollectionModal && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveCollectionModal(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 z-10 text-right"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActiveCollectionModal(null)}
                  aria-label={isAr ? 'إغلاق' : 'Close'}
                  className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Body: 2-column layout on md+ */}
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Image Column */}
                    <div className="md:col-span-5">
                      <div className="w-full aspect-square rounded-2xl bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4 border border-slate-100 shadow-inner">
                        <img
                          src={activeCollectionModal.image}
                          alt={activeCollectionModal.nameAr}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Details Column */}
                    <div className="md:col-span-7 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[11px] font-mono font-bold text-[#0062D2] bg-blue-50 px-2.5 py-1 rounded-md" dir="ltr">
                            ENARAH SIGNATURE
                          </span>
                          {activeCollectionModal.tagAr && (
                            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                              {activeCollectionModal.tagAr}
                            </span>
                          )}
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                          {activeCollectionModal.nameAr}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1" dir="ltr">
                          {activeCollectionModal.nameEn}
                        </p>

                        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {activeCollectionModal.descAr}
                        </p>
                      </div>

                      {/* Direct Actions */}
                      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                        <a
                          href={`https://wa.me/218913224213?text=${encodeURIComponent(
                            `السلام عليكم، أود الاستفسار عن تشكيلة: ${activeCollectionModal.nameAr} (${activeCollectionModal.nameEn}) لدى شركة الإنارة.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0062D2] hover:bg-[#004FAF] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                        >
                          <span>{isAr ? 'طلب كتالوج وتسعير واتساب' : 'Request Catalog via WhatsApp'}</span>
                          <ArrowLeft className="w-4 h-4" />
                        </a>

                        <a
                          href="tel:+218913224213"
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
                        >
                          <Phone className="w-4 h-4 text-slate-600" />
                          <span>{isAr ? 'اتصال مباشر' : 'Call'}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* =====================================================================
          SECTION 05: Brands (Global Brands Logo Wall)
          Eyebrow: GLOBAL BRANDS
          Headline: علامات نثق بها
          Style: Clean logo wall on subtle gallery background #F7F8FA
          ===================================================================== */}
      <section className="py-20 sm:py-28 bg-[#F7F8FA] border-t border-[#E7EAF0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
            GLOBAL BRANDS
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#15191E] tracking-tight mb-4">
            علامات نثق بها
          </h2>
          <p className="text-sm sm:text-base text-[#68717D] max-w-xl mx-auto mb-14 font-normal">
            وكلاء وموزعون معتمدون لأرقى العلامات التجارية الأوروبية والعالمية في قطاع الإضاءة والتحكم الكهربائي.
          </p>

          {/* Logo Wall: Clean optical sizing, neutral with subtle hover */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center">
            {GLOBAL_BRANDS.map((b) => (
              <div
                key={b.name}
                className="w-full h-24 flex items-center justify-center p-4 rounded-xl border border-[#E7EAF0] bg-white transition-all duration-200 hover:border-[#0062D2]/30 hover:shadow-sm group"
              >
                <img
                  src={b.logo}
                  alt={b.name}
                  loading="lazy"
                  className="max-h-12 max-w-[110px] object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to text if image is not accessible
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span className="text-xs font-bold text-slate-700 hidden group-hover:inline-block">
                  {b.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/brands"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0062D2] hover:text-[#0047A5] transition-colors"
            >
              <span>استكشف جميع العلامات وشراكاتنا الدولية</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 06: Light Experience (Architectural Temperature Simulator)
          Default State: LIGHTS_OFF (Starts in natural dark architectural scene)
          Eyebrow: LIGHT EXPERIENCE
          Headline: شاهد كيف يغيّر الضوء مساحتك
          Description: تحكّم في حرارة لون الإضاءة وشاهد تأثيرها على المساحة والخامات مباشرة.
          ===================================================================== */}
      <section className="py-12 sm:py-16 bg-[#F3F6FA] border-y border-[#E7EAF0]" id="light-experience">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
              LIGHT EXPERIENCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#15191E] tracking-tight mb-2">
              شاهد كيف يغيّر الضوء مساحتك
            </h2>
            <p className="text-xs sm:text-sm text-[#68717D] leading-relaxed">
              تحكّم في حرارة لون الإضاءة وشاهد تأثيرها على المساحة والخامات مباشرة.
            </p>
          </div>

          {/* Large Dominant Architectural Visualization Canvas */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] max-h-[620px] min-h-[440px] rounded-3xl overflow-hidden border border-[#E7EAF0] shadow-2xl bg-[#101820] max-w-5xl mx-auto select-none">
            
            {/* Layer 0 (Base): Natural Dusk Architectural Scene - All Artificial Lights OFF */}
            <img
              src="/images/simulator/room-all-off.jpg?v=2"
              alt="Natural Dusk Architectural Scene - Artificial Lights OFF"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              style={{ zIndex: 1 }}
              loading="eager"
            />

            {/* Layer 1 (Group): Artificial Architectural Lighting (Smooth 600ms Natural Light Fade-in) */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              style={{
                zIndex: 2,
                opacity: simLightsOn ? 1 : 0,
                transition: isSimDragging ? 'none' : 'opacity 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                willChange: 'opacity'
              }}
            >
              {/* 3000K Warm White Base Render */}
              <img
                src="/images/simulator/room-3000k.jpg?v=2"
                alt="Architectural Room Lighting 3000K Warm White"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                style={{ zIndex: 1, willChange: 'opacity' }}
                loading="eager"
              />

              {/* 4000K Neutral White Middle Render */}
              <img
                src="/images/simulator/room-4000k.jpg?v=2"
                alt="Architectural Room Lighting 4000K Neutral White"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                style={{
                  zIndex: 2,
                  opacity: simNeutralOpacity,
                  transition: isSimDragging ? 'none' : 'opacity 550ms cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'opacity'
                }}
                loading="eager"
              />

              {/* 6000K Cool White Top Render */}
              <img
                src="/images/simulator/room-6000k.jpg?v=2"
                alt="Architectural Room Lighting 6000K Cool White"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                style={{
                  zIndex: 3,
                  opacity: simCoolOpacity,
                  transition: isSimDragging ? 'none' : 'opacity 550ms cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'opacity'
                }}
                loading="eager"
              />
            </div>

            {/* Top Bar Minimal Technical Badge (Inside Canvas) */}
            <div className="absolute top-3.5 sm:top-4 right-3.5 sm:right-4 left-3.5 sm:left-4 z-20 flex items-center justify-between pointer-events-none">
              {/* Right: Live Status Badge */}
              <div
                className="flex items-center gap-2.5 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg border"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  borderColor: activeSimMeta.badgeBorder
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm transition-colors duration-300"
                  style={{ backgroundColor: activeSimMeta.dotColor }}
                />
                <span className="tracking-wide">
                  {simLightsOn ? `${simKelvin}K • ${activeSimMeta.arabicLabel}` : 'الإنارة مطفأة'}
                </span>
                {simLightsOn && (
                  <span className="text-[10px] text-white/60 hidden sm:inline">
                    ({activeSimMeta.englishLabel})
                  </span>
                )}
              </div>

              {/* Left: Architectural Snippet */}
              <div className="hidden md:flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-white/90 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                <span className="truncate max-w-sm font-normal">{activeSimMeta.desc}</span>
              </div>
            </div>

            {/* FLOATING ARCHITECTURAL CONTROL DOCK (Sleek, Compact Minimal Floating Bar) */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] sm:w-[90%] max-w-xl">
              <div className="bg-black/80 backdrop-blur-xl border border-white/20 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-2xl space-y-2">
                
                {/* 1. Header Row: Compact Status & Off Button */}
                <div className="flex items-center justify-between text-white text-xs">
                  {simLightsOn ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/70 text-[11px] sm:text-xs">حرارة الإضاءة:</span>
                      <span className="text-[#93C5FD] font-mono font-bold text-xs">{simKelvin}K</span>
                      <span className="text-white/80 text-[11px]">({activeSimMeta.arabicLabel})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white/95 text-xs">
                        اختر درجة الإضاءة لتشاهد تأثيرها على المساحة
                      </span>
                    </div>
                  )}

                  {/* Return to Off Button when lights are ON */}
                  {simLightsOn ? (
                    <button
                      type="button"
                      onClick={handleTurnLightsOff}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15 transition-all cursor-pointer shadow-sm"
                      title="العودة للإضاءة المسائية الطبيعية"
                    >
                      <Power className="w-3 h-3 text-amber-400" />
                      <span>إطفاء الإضاءة</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-white/50 hidden sm:block">
                      الإنارة مطفأة حالياً
                    </span>
                  )}
                </div>

                {/* 2. Continuous Kelvin Slider (Slim, Sleek Minimal Track) */}
                {simLightsOn && (
                  <div className="relative py-1">
                    {/* Visual Temperature Progression Track */}
                    <div
                      className="w-full h-2 rounded-full relative overflow-hidden pointer-events-none"
                      style={{
                        background: 'linear-gradient(to right, #FFE8CD 0%, #FFF8EE 33.3%, #FFFFFF 40%, #EEF5FF 70%, #DBEAFF 100%)',
                        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                        <span className="w-0.5 h-full bg-black/20" title="3000K" />
                        <span className="w-0.5 h-full bg-black/20 ml-[33%]" title="4000K" />
                        <span className="w-0.5 h-full bg-black/20" title="6000K" />
                      </div>
                    </div>

                    {/* Range Input Overlay */}
                    <input
                      type="range"
                      min={3000}
                      max={6000}
                      step={100}
                      value={simKelvin}
                      dir="ltr"
                      onChange={(e) => {
                        setSimLightsOn(true)
                        setSimKelvin(Number(e.target.value))
                      }}
                      onPointerDown={() => setIsSimDragging(true)}
                      onPointerUp={() => setIsSimDragging(false)}
                      onTouchStart={() => setIsSimDragging(true)}
                      onTouchEnd={() => setIsSimDragging(false)}
                      aria-label="محدد درجة حرارة الإضاءة كلفن"
                      aria-valuemin={3000}
                      aria-valuemax={6000}
                      aria-valuenow={simKelvin}
                      aria-valuetext={`${simKelvin}K ${activeSimMeta.arabicLabel}`}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                      style={{ touchAction: 'none' }}
                    />

                    {/* Visual Circular Thumb Following Value */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-transform duration-75"
                      style={{
                        left: `${((simKelvin - 3000) / 3000) * 100}%`,
                        zIndex: 5
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full bg-white border-2 border-[#0062D2] shadow-md flex items-center justify-center"
                        style={{
                          boxShadow: '0 1px 6px rgba(0, 98, 210, 0.45), 0 0 0 1.5px rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: activeSimMeta.dotColor }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Three Compact Temperature Option Buttons */}
                <div className={`grid grid-cols-3 gap-1.5 ${simLightsOn ? 'pt-0.5' : ''}`}>
                  {[
                    {
                      k: 3000,
                      ar: 'دافئ',
                      en: 'Warm White',
                      dot: '#FFB85A'
                    },
                    {
                      k: 4000,
                      ar: 'محايد',
                      en: 'Neutral White',
                      dot: '#FFFFFF'
                    },
                    {
                      k: 6000,
                      ar: 'بارد',
                      en: 'Cool White',
                      dot: '#93C5FD'
                    }
                  ].map((preset) => {
                    const isActive = simLightsOn && simKelvin === preset.k
                    return (
                      <button
                        key={preset.k}
                        type="button"
                        onClick={() => handleSimPreset(preset.k)}
                        className={`h-8 sm:h-9 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-[#0062D2] text-white border-[#0062D2] shadow-md shadow-blue-500/25 ring-1 ring-white/30'
                            : 'bg-white/10 hover:bg-white/15 text-white/90 border-white/15 hover:border-white/30'
                        }`}
                        aria-pressed={isActive}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: preset.dot }}
                        />
                        <span className="font-mono font-bold text-xs">{preset.k}K</span>
                        <span className="text-[11px] opacity-85">{preset.ar}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Supporting Architectural Advice Note */}
                <p className="text-[10px] sm:text-[11px] text-white/60 text-center leading-normal pt-0.5">
                  {activeSimMeta.desc}
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 07: Color & Light (Paint & Color Temperature Interaction)
          Eyebrow: COLOR & LIGHT STUDIO
          Headline: حين يلتقي اللون بالضوء
          Feature: Real Architectural Wall Photography + Physical Light Wash Simulation
          ===================================================================== */}
      {/* =====================================================================
          SECTION 07: Color & Light (Paint & Color Temperature Interaction)
          Eyebrow: COLOR & LIGHT STUDIO
          Headline: حين يلتقي اللون بالضوء
          Feature: Real Architectural Wall Photography + Physical Light Wash Simulation
          Mobile Optimized: Sticky live visualizer + unified in-view controls
          ===================================================================== */}
      <section id="color-light-studio" className="py-7 sm:py-16 lg:py-24 bg-[#FFFFFF]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-3.5 sm:mb-8 lg:mb-12">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-[#0062D2]/10 border border-[#0062D2]/20 text-[#0062D2] text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-2 sm:mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLOR & LIGHT STUDIO · استوديو الإضاءة المعمارية</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#15191E] tracking-tight mb-2 sm:mb-3">
              حين يلتقي اللون بالضوء
            </h2>
            <p className="text-[12.5px] sm:text-base text-[#475569] leading-relaxed max-w-2xl mx-auto">
              تفاعل فيزيائي حقيقي بين درجة حرارة الضوء (CCT) ولون طلاء الجدار. عاين كيف يُغيّر الكشاف المعماري إشراق المساحة وتأثيرها البصري على جدار حقيقي.
            </p>
          </div>

          {/* Main Studio Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-10 items-start max-w-6xl mx-auto">
            {/* 1. Real Architectural Wall Showcase (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <div
                className="relative aspect-[4/3] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7EAF0] shadow-sm sm:shadow-lg bg-[#15191E] flex flex-col justify-between transform-gpu"
                style={{ aspectRatio: '1200 / 896' }}
              >
                {/* 5 Real Wall Photography Layers with Smooth Cross-Fade */}
                {paintColors.map((color) => {
                  const isSelected = selectedPaintId === color.id
                  return (
                    <div
                      key={color.id}
                      className={`absolute inset-0 transition-opacity duration-400 ease-out pointer-events-none transform-gpu ${
                        isSelected ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      {/* 3000K Base Warm Photo */}
                      <img
                        src={`/images/wall-simulator/wall-${color.id}-warm.jpg`}
                        alt={`${color.name} 3000K`}
                        className="w-full h-full object-cover select-none"
                      />
                      {/* 6000K Cool Photo with smooth transition according to Kelvin */}
                      <img
                        src={`/images/wall-simulator/wall-${color.id}-cool.jpg`}
                        alt={`${color.name} 6000K`}
                        className="absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-300 ease-out"
                        style={{
                          opacity: paintTemp === 'warm' ? 0 : paintTemp === 'natural' ? 0.52 : 1
                        }}
                      />
                    </div>
                  )
                })}

                {/* Interactive Lens Aperture Highlight at Ceiling Fixture */}
                <div
                  className="absolute top-[6.8%] left-1/2 -translate-x-1/2 w-4 h-2 rounded-full blur-[1px] pointer-events-none transition-all duration-300 ease-out z-20"
                  style={{
                    backgroundColor:
                      paintTemp === 'warm'
                        ? 'rgba(255, 190, 90, 0.95)'
                        : paintTemp === 'natural'
                        ? 'rgba(255, 255, 250, 0.95)'
                        : 'rgba(215, 235, 255, 0.95)',
                    boxShadow:
                      paintTemp === 'warm'
                        ? '0 0 18px 5px rgba(255, 180, 80, 0.7)'
                        : paintTemp === 'natural'
                        ? '0 0 16px 4px rgba(255, 255, 240, 0.6)'
                        : '0 0 18px 5px rgba(180, 220, 255, 0.7)'
                  }}
                />

                {/* Floating Top Badge: Fixture Specs & Kelvin */}
                <div className="relative z-20 p-2.5 sm:p-5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-white text-[10.5px] sm:text-xs font-medium shadow-lg select-none">
                    <span
                      className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full shadow-sm transition-colors duration-300"
                      style={{
                        backgroundColor:
                          paintTemp === 'warm' ? '#FFB85A' : paintTemp === 'natural' ? '#FFFFFF' : '#93C5FD',
                        boxShadow:
                          paintTemp === 'warm'
                            ? '0 0 8px #FFB85A'
                            : paintTemp === 'natural'
                            ? '0 0 8px #FFFFFF'
                            : '0 0 8px #93C5FD'
                      }}
                    />
                    <span className="hidden sm:inline">كشاف سقف غاطس مضاد للوهج · 36°</span>
                    <span className="sm:hidden">كشاف سقف 36°</span>
                    <span className="text-white/40">|</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {paintTemp === 'warm' ? '3000K' : paintTemp === 'natural' ? '4000K' : '6000K'}
                    </span>
                  </div>
                </div>

                {/* Floating Bottom Badge: Active Paint Spec & LRV */}
                <div className="relative z-20 p-2.5 sm:p-5 flex items-end justify-between">
                  <div className="bg-white/95 backdrop-blur-md border border-black/5 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2 sm:gap-3.5 select-none transition-all duration-300">
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl shadow-inner border border-black/10 shrink-0 transition-colors duration-300"
                      style={{ backgroundColor: currentPaint.hex }}
                    />
                    <div className="text-right">
                      <div className="text-[11px] sm:text-xs font-bold text-[#15191E] flex items-center gap-1 sm:gap-1.5">
                        <span>{currentPaint.name}</span>
                        <span className="text-[9px] sm:text-[10px] text-[#0062D2] font-semibold bg-[#0062D2]/10 px-1 sm:px-1.5 py-0.5 rounded">
                          {currentPaint.ral}
                        </span>
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-[#68717D] mt-0.5">
                        انعكاس الضوء: <strong className="text-[#15191E] font-medium">{currentPaint.lrv}</strong>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* 2. Studio Controls & Architectural Advice (5 cols) */}
            <div
              className="lg:col-span-5 flex flex-col justify-between space-y-2.5 sm:space-y-3.5 bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-xs"
              style={{ fontFamily: "'Cairo', 'IBM Plex Sans Arabic', -apple-system, sans-serif" }}
            >
              {/* Step 1: Paint Color Selection */}
              <div>
                <div className="flex items-center justify-between flex-wrap gap-1.5 mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1 h-3.5 rounded-full bg-[#0062D2]" />
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0F172A]">
                      {isAr ? 'لون الطلاء المعماري' : 'Architectural Wall Finish'}
                    </h4>
                    <span className="text-[10px] text-[#64748B] font-mono uppercase tracking-wider hidden sm:inline">
                      · Wall Finish
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0062D2] font-semibold bg-[#0062D2]/8 px-2 py-0.5 rounded-full border border-[#0062D2]/15">
                    <span>{currentPaint.name}</span>
                    <span className="text-[9.5px] sm:text-[10px] opacity-75 font-mono">({currentPaint.ral})</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {paintColors.map((color) => {
                    const active = selectedPaintId === color.id
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSelectedPaintId(color.id)}
                        className={`group relative py-1.5 px-0.5 sm:py-2 sm:px-1.5 rounded-lg sm:rounded-xl border transition-all duration-150 cursor-pointer flex flex-col items-center justify-center text-center ${
                          active
                            ? 'bg-[#0062D2]/[0.03] border-[#0062D2] ring-1.5 ring-[#0062D2]/30 shadow-2xs'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1]'
                        }`}
                        title={`${color.name} (${color.toneEn})`}
                        aria-pressed={active}
                      >
                        <div className="relative">
                          <span
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full block border shadow-2xs transition-transform duration-150 group-hover:scale-105 ${
                              active ? 'border-black/20 ring-1.5 ring-offset-1 ring-[#0062D2]' : 'border-black/10'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                          {active && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#0062D2] text-white flex items-center justify-center shadow-2xs">
                              <CheckCircle2 className="w-2 h-2" />
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[9px] min-[380px]:text-[10px] sm:text-[11px] block leading-tight whitespace-nowrap mt-1 ${
                            active ? 'text-[#0062D2] font-bold' : 'text-[#334155] font-medium'
                          }`}
                        >
                          {color.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 2: Light Kelvin Selection */}
              <div>
                <div className="flex items-center justify-between flex-wrap gap-1.5 mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1 h-3.5 rounded-full bg-[#0062D2]" />
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0F172A]">
                      {isAr ? 'حرارة الإضاءة المسلطة' : 'Beam Color Temperature'}
                    </h4>
                    <span className="text-[10px] text-[#64748B] font-mono uppercase tracking-wider hidden sm:inline">
                      · CCT
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0062D2] bg-[#0062D2]/8 px-2 py-0.5 rounded-full border border-[#0062D2]/15">
                    {paintTemp === 'warm'
                      ? (isAr ? '3000K · دافئ' : '3000K · Warm')
                      : paintTemp === 'natural'
                      ? (isAr ? '4000K · طبيعي' : '4000K · Natural')
                      : (isAr ? '6000K · نهاري' : '6000K · Cool')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {[
                    {
                      key: 'warm',
                      kelvin: '3000K',
                      label: isAr ? 'أصفر دافئ' : 'Warm White',
                      mood: isAr ? 'أجواء حميمية' : 'Cozy Ambience',
                      dot: '#FFB85A',
                      glow: 'rgba(255, 184, 90, 0.45)'
                    },
                    {
                      key: 'natural',
                      kelvin: '4000K',
                      label: isAr ? 'شمسي طبيعي' : 'Natural Neutral',
                      mood: isAr ? 'توازن واقعي' : 'True Balance',
                      dot: '#FFFFFF',
                      glow: 'rgba(255, 255, 255, 0.45)'
                    },
                    {
                      key: 'cool',
                      kelvin: '6000K',
                      label: isAr ? 'أبيض نهاري' : 'Cool Daylight',
                      mood: isAr ? 'وضوح ونشاط' : 'Crisp Clarity',
                      dot: '#93C5FD',
                      glow: 'rgba(147, 197, 253, 0.45)'
                    }
                  ].map((btn) => {
                    const active = paintTemp === btn.key
                    return (
                      <button
                        key={btn.key}
                        type="button"
                        onClick={() => setPaintTemp(btn.key as 'warm' | 'natural' | 'cool')}
                        className={`py-1.5 px-1 sm:py-2 sm:px-2.5 rounded-lg sm:rounded-xl border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-center relative ${
                          active
                            ? 'bg-[#0062D2]/[0.05] border-[#0062D2] ring-1.5 ring-[#0062D2]/25 shadow-2xs'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1]'
                        }`}
                        aria-pressed={active}
                      >
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: btn.dot,
                              border: btn.dot === '#FFFFFF' ? '1px solid #CBD5E1' : 'none',
                              boxShadow: active ? `0 0 6px ${btn.glow}` : 'none'
                            }}
                          />
                          <span
                            className={`text-xs sm:text-[13px] font-mono font-bold ${
                              active ? 'text-[#0062D2]' : 'text-[#0F172A]'
                            }`}
                          >
                            {btn.kelvin}
                          </span>
                        </div>
                        <span
                          className={`text-[9.5px] min-[380px]:text-[10px] sm:text-[11px] block leading-tight mt-0.5 ${
                            active ? 'text-[#0F172A] font-bold' : 'text-[#334155] font-semibold'
                          }`}
                        >
                          {btn.label}
                        </span>
                        <span
                          className={`text-[8px] min-[380px]:text-[8.5px] sm:text-[9.5px] block mt-0.5 font-normal leading-none ${
                            active ? 'text-[#0062D2] font-medium' : 'text-[#64748B]'
                          }`}
                        >
                          {btn.mood}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 3: Interior Designer & Architectural Advice */}
              <div className="rounded-lg sm:rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 sm:p-3.5 space-y-2">
                {/* Header: Title, Subtitle, and Mood Badge */}
                <div className="flex items-start justify-between flex-wrap gap-1.5 sm:gap-2 pb-2 border-b border-[#E2E8F0]">
                  <div>
                    <h5 className="text-[11.5px] sm:text-xs font-bold text-[#0F172A] leading-tight">
                      {isAr ? 'استشارة التصميم الداخلي والإضاءة' : 'Interior & Lighting Consultation'}
                    </h5>
                    <p className="text-[9.5px] sm:text-[10px] text-[#64748B] mt-0.5 font-normal">
                      {isAr ? 'تحليل التوافق المعماري بين الطلاء والضوء' : 'Architectural CCT & Finish Compatibility'}
                    </p>
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] font-semibold text-[#0062D2] bg-white border border-[#0062D2]/20 px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
                    {currentPaint.contrastMood[paintTemp]}
                  </span>
                </div>

                {/* Editorial Quote / Recommendation */}
                <div className="border-r-2 border-[#0062D2] pr-2.5 py-0.5">
                  <p className="text-[11px] sm:text-[11.5px] text-[#334155] leading-relaxed font-normal">
                    {currentPaint.advice[paintTemp]}
                  </p>
                </div>

                {/* Technical Information Grid: Two balanced columns where space permits, stacked naturally on small mobile */}
                <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="flex flex-col justify-center">
                    <span className="text-[#64748B] text-[9.5px] sm:text-[10px] font-normal">
                      {isAr ? 'الفراغ الموصى به:' : 'Recommended Space:'}
                    </span>
                    <strong className="text-[#0F172A] font-semibold text-[11px] sm:text-[11.5px] leading-snug break-words">
                      {currentPaint.roomSuggestion[paintTemp]}
                    </strong>
                  </div>
                  <div className="flex flex-col justify-center sm:border-r sm:border-[#E2E8F0] sm:pr-2.5">
                    <span className="text-[#64748B] text-[9.5px] sm:text-[10px] font-normal">
                      {isAr ? 'معامل الانعكاس (LRV):' : 'Light Reflectance (LRV):'}
                    </span>
                    <strong className="text-[#0062D2] font-semibold text-[11px] sm:text-[11.5px] leading-snug">
                      {currentPaint.lrv}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION: Italian & Turkish Wires (Direct from Factory Showcase)
          ===================================================================== */}
      <section id="wires-import-showcase" className="py-14 sm:py-16 md:py-24 lg:py-28 relative overflow-hidden bg-[#F5F8FC] border-t border-slate-200">
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
                  className="mobile-btn inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer text-center group"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isAr ? 'استكشف كتالوج الأسلاك واطلب أونلاين' : 'Explore Wire Catalog & Order Online'}</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* عمود الصورة المعمارية الكبرى */}
            <div className="order-2 lg:col-span-7 w-full">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] bg-slate-100">
                <img
                  src="/images/wires-italian-turkish-showcase.jpg"
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
                className="mobile-btn inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer text-center group"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isAr ? 'استكشف كتالوج الأسلاك واطلب أونلاين' : 'Explore Wire Catalog & Order Online'}</span>
                <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================================
          SECTION 08: Selected Projects (Architectural Gallery)
          Eyebrow: SELECTED PROJECTS
          Headline: مشاريع تتحدث بلغة الضوء
          Content: Project image + Project name + Category tag ONLY
          Do NOT show: products supplied, quantities, detailed supply descriptions
          ===================================================================== */}
      <section className="py-24 sm:py-32 bg-[#F7F8FA] border-t border-[#E7EAF0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
                SELECTED PROJECTS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#15191E] tracking-tight">
                مشاريع تتحدث بلغة الضوء
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0062D2] hover:text-[#0047A5] transition-colors group"
            >
              <span>استكشف جميع المشاريع</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          {/* Editorial Grid: 4 Selected Master Projects (Alternating 60/40 & Asymmetric) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {INITIAL_PROJECTS.slice(0, 4).map((p, idx) => {
              // Asymmetric desktop span: 0 & 3 take 7 cols, 1 & 2 take 5 cols
              const spanClass =
                idx === 0 || idx === 3 ? 'md:col-span-7 aspect-[16/10]' : 'md:col-span-5 aspect-[4/3]'

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProject(p)
                    setActiveProjectImgIndex(0)
                  }}
                  className={`group relative rounded-2xl overflow-hidden bg-slate-900 border border-[#E7EAF0] cursor-pointer shadow-sm ${spanClass}`}
                >
                  <img
                    src={getOptimizedProjectImageUrl(p.coverImage)}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-product.jpg'
                    }}
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-300" />

                  {/* Top Category Tag */}
                  <div className="absolute top-5 right-5 z-10">
                    <span className="bg-white/90 backdrop-blur-md text-[#15191E] text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                      {p.category}
                    </span>
                  </div>

                  {/* Bottom Information (Project Name + View CTA ONLY) */}
                  <div className="absolute bottom-6 right-6 left-6 z-10 flex items-end justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug">
                        {p.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 group-hover:bg-[#0062D2] group-hover:scale-110">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 08.5: Interactive Game (رحلة النور | بطل الإنارة الحديثة)
          Directly Playable on the Homepage
          ===================================================================== */}
      <section id="game-section" className="relative py-20 sm:py-28 bg-[#0B0F17] text-white overflow-hidden border-t border-[#1C2633]">
        {/* Ambient lighting glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0062D2]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#0062D2] animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'تجربة تفاعلية حصرية في الصفحة الرئيسية' : 'Exclusive Interactive Experience'}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {isAr ? 'رحلة النور | بطل الإنارة الحديثة 🎮' : 'Light Quest | Modern Enarah Hero 🎮'}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {isAr
                  ? 'العب الآن مباشرة! تحكم ببطل اللمبة الذكية، واجمع كابلات النحاس الإيطالية وشرارات الطاقة لإنارة المصابيح وتشغيل القاطع الرئيسي للفوز بكوبون خصم حقيقي (5% إلى 10%) على مشترياتك.'
                  : 'Play directly right here! Guide our Lightbulb Hero, collect certified copper wires and energy sparks to illuminate chandeliers and win an instant discount voucher.'}
              </p>
            </div>

            {/* Quick Actions & Fullscreen Link */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'كوبون خصم فوري 5% - 10%' : '5% - 10% Instant Voucher'}</span>
              </div>

              <Link
                to="/game"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95 group"
              >
                <span>{isAr ? 'فتح في صفحة مخصصة' : 'Dedicated Fullscreen Page'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Embedded Playable Game Canvas Box */}
          <div className="bg-[#11161F]/90 rounded-3xl p-3 sm:p-6 border border-[#222E3D] shadow-2xl backdrop-blur-md overflow-hidden mb-10">
            <React.Suspense
              fallback={
                <div className="h-[420px] sm:h-[520px] flex flex-col items-center justify-center gap-4 text-slate-400">
                  <Loader2 className="w-8 h-8 text-[#0062D2] animate-spin" />
                  <span className="text-xs font-medium">{isAr ? 'جارٍ تحميل محرك اللعبة...' : 'Loading game engine...'}</span>
                </div>
              }
            >
              <GameEngine />
            </React.Suspense>
          </div>

          {/* Instructions & Game Rules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#141B24] border border-[#222E3D] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white mb-1">
                  {isAr ? '1. اجمع كابلات النحاس' : '1. Collect Copper Cables'}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed font-normal">
                  {isAr
                    ? 'اجمع لفات الأسلاك الإيطالية والسبوت لايت لتوسيع دائرة الضوء وكسب وقت إضافي.'
                    : 'Gather certified copper wire coils and spotlights to expand your light radius.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141B24] border border-[#222E3D] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[#0062D2] shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white mb-1">
                  {isAr ? '2. أنر المصابيح المعمارية' : '2. Light Up Fixtures'}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed font-normal">
                  {isAr
                    ? 'اقترب من الثريات ومصابيح الإنارة المعمارية لتشغيلها وفتح الأبواب الموصدة.'
                    : 'Approach chandeliers and architectural fixtures to activate them and unlock gates.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141B24] border border-[#222E3D] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Power className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white mb-1">
                  {isAr ? '3. شغّل القاطع الرئيسي' : '3. Master Switch'}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed font-normal">
                  {isAr
                    ? 'بعد إنارة كافة النقاط، توجه لقاطع التيار الرئيسي لإنارة المدينة بالكامل وإنهاء المرحلة.'
                    : 'After lighting all fixtures, activate the master breaker to complete the stage.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141B24] border border-[#222E3D] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white mb-1">
                  {isAr ? '4. احصل على كود الخصم' : '4. Get Your Discount'}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed font-normal">
                  {isAr
                    ? 'مبروك! انسخ كود الخصم الفوري واستخدمه مباشرة في مشترياتك بصالات العرض.'
                    : 'Congratulations! Copy your voucher and redeem it instantly at our showrooms.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 09: Final CTA (Conversion Section)
          Style: Strong but minimal conversion section
          Background: Deep corporate blue or deep navy #101820
          Headline: ابدأ مشروعك بالإضاءة الصحيحة
          ===================================================================== */}
      <section className="relative py-24 sm:py-32 bg-[#101820] text-white overflow-hidden">
        {/* Subtle architectural ambient light glow */}
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[#0062D2]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-[#0062D2]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3">
              CONSULTATION & SUPPLY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight mb-5">
              ابدأ مشروعك بالإضاءة الصحيحة
            </h2>
            <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed mb-10 max-w-xl mx-auto">
              سواء كنت تصمم مسكنك الخاص أو تدير مشروعاً تجارياً كبيراً، مهندسونا مستعدون لتقديم الحلول المناسبة وحسابات الإنارة المعتمدة.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0062D2] hover:bg-[#0047A5] text-white font-medium text-sm rounded-full transition-all duration-200 shadow-lg shadow-[#0062D2]/25"
              >
                <span>تواصل معنا</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                to="/branches"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white font-medium text-sm rounded-full transition-all duration-200"
              >
                <span>زيارة المعرض</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 10: Footer
          Background: #101820
          Text: Soft white
          Style: Large structured premium footer
          ===================================================================== */}
      <footer className="bg-[#101820] text-white/70 border-t border-white/10 pt-20 pb-12">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
            {/* Col 1: Brand Info (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0062D2] text-white flex items-center justify-center font-bold text-base">
                  إ
                </div>
                <div>
                  <span className="font-semibold text-white text-lg block">شركة الإنارة</span>
                  <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase block">
                    ENARAH MODERN · EST. 1988
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/75 leading-relaxed max-w-sm font-normal">
                روّاد توريد وحلول الإضاءة المعمارية والمواد الكهربائية المعتمدة في ليبيا منذ أكثر من ثلاثة عقود. نسعى لتقديم أعلى معايير الجودة والسلامة والتصميم العصري.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs text-white/60">
                <span>بنغازي، ليبيا</span>
                <span>·</span>
                <span>س.ت: 1988/4432</span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">التنقل السريع</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/products" className="hover:text-white transition-colors">
                    المنتجات والكتالوجات
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="hover:text-white transition-colors">
                    المشاريع المنفذة
                  </Link>
                </li>
                <li>
                  <Link to="/brands" className="hover:text-white transition-colors">
                    العلامات التجارية
                  </Link>
                </li>
                <li>
                  <Link to="/wire-prices" className="hover:text-white transition-colors">
                    أسعار الأسلاك
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    عن الشركة
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Locations */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">التواصل</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0062D2] shrink-0 mt-0.5" />
                  <span>ليبيا - بنغازي - الليثي - مقابل مدرسة العيد الفضي</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#0062D2] shrink-0" />
                  <a href="tel:+218916580068" className="hover:text-white transition-colors" dir="ltr">
                    +218 91 658 0068
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#0062D2] shrink-0" />
                  <a href="tel:+218926580068" className="hover:text-white transition-colors" dir="ltr">
                    +218 92 658 0068
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#0062D2] shrink-0" />
                  <span>السبت - الخميس: 8:30 ص - 9:00 م</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
            <p>© {new Date().getFullYear()} شركة الإنارة الحديثة. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-6">
              <span>Light Shapes Space</span>
              <span>·</span>
              <span>Enarah Modern Since 1988</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          LIGHTBOX MODAL: Clean Architectural Project Gallery Lightbox
          ===================================================================== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#101820] text-white rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Image */}
              <div className="relative aspect-[16/10] w-full bg-black overflow-hidden">
                {(() => {
                  const imgs = (selectedProject.image || selectedProject.coverImage)
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                  const currentSrc = imgs[activeProjectImgIndex] || selectedProject.coverImage
                  return (
                    <img
                      src={getOptimizedProjectImageUrl(currentSrc)}
                      alt={selectedProject.name}
                      className="w-full h-full object-contain"
                    />
                  )
                })()}

                {/* Left/Right nav if multiple images */}
                {(() => {
                  const imgs = (selectedProject.image || selectedProject.coverImage)
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                  if (imgs.length <= 1) return null
                  return (
                    <>
                      <button
                        onClick={() =>
                          setActiveProjectImgIndex(
                            (prev) => (prev - 1 + imgs.length) % imgs.length
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveProjectImgIndex((prev) => (prev + 1) % imgs.length)
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </>
                  )
                })()}
              </div>

              {/* Lightbox Footer (Project Name + Category + Gallery Thumbnails) */}
              <div className="p-6 bg-[#15191E] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                <div>
                  <span className="text-xs text-[#0062D2] font-semibold block mb-1">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-xl font-semibold text-white">{selectedProject.name}</h3>
                </div>

                {/* Thumbnails */}
                {(() => {
                  const imgs = (selectedProject.image || selectedProject.coverImage)
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                  if (imgs.length <= 1) return null
                  return (
                    <div className="flex items-center gap-2 overflow-x-auto max-w-xs pb-1">
                      {imgs.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveProjectImgIndex(i)}
                          className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                            i === activeProjectImgIndex
                              ? 'border-[#0062D2] scale-105'
                              : 'border-white/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={getOptimizedProjectImageUrl(img)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
