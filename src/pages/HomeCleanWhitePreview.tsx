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
  Building2
} from 'lucide-react'
import type { ProjectItem } from '../data/projectsData'
import {
  getLocalizedProject,
  INITIAL_PROJECTS,
  getOptimizedProjectImageUrl
} from '../data/projectsData'
import { initHeroVideoCache, getOptimalHeroVideoPath } from '../utils/videoCache'

/* =========================================================================
   1. Data Definitions (Colors, Brands, Featured Categories, Trust Items)
   ========================================================================= */

const getPaintColors = (isAr: boolean) => [
  {
    id: 'white',
    name: isAr ? 'أبيض ناصع' : 'Pure White',
    hex: '#F8F9FA',
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
    hex: '#F4ECE1',
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
    hex: '#E2E6EA',
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
    hex: '#1E293B',
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
    hex: '#3F4E3F',
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

const FEATURED_COLLECTIONS = [
  {
    id: 'chandeliers',
    nameAr: 'الثريات الفاخرة',
    nameEn: 'Luxury Chandeliers',
    descAr: 'تصاميم معمارية وكريستالية مودرن تمنح الفراغات فخامة استثنائية.',
    image: '/images/product-chandeliers.jpg',
    categoryKey: 'chandeliers',
    count: '60+ تصميم'
  },
  {
    id: 'spotlights',
    nameAr: 'السبوت لايت المعماري',
    nameEn: 'Architectural Spotlights',
    descAr: 'عدسات مانعة للتوهج وتوزيع مخروطي متزن للإضاءة الموجهة.',
    image: '/images/product-spotlights.png',
    categoryKey: 'spotlights',
    count: '80+ موديل'
  },
  {
    id: 'outdoor',
    nameAr: 'الإنارة الخارجية والمعمارية',
    nameEn: 'Outdoor & Facade Lighting',
    descAr: 'كشافات وفوانيس وأبليكات واجهات مقاومة لأقسى العوامل الجوية.',
    image: '/images/product-outdoor-lanterns.jpg',
    categoryKey: 'outdoor',
    count: '45+ حل'
  },
  {
    id: 'switches',
    nameAr: 'المفاتيح والبرايز',
    nameEn: 'Architectural Switches & Sockets',
    descAr: 'تشطيبات راقية باللون الذهبي والأسود والأبيض مع منافذ شحن سريعة.',
    image: '/images/product-sockets-switches.jpg',
    categoryKey: 'switches',
    count: '50+ خيار'
  },
  {
    id: 'foundation',
    nameAr: 'مواد التأسيس والكوابل',
    nameEn: 'Electrical Foundation & Cables',
    descAr: 'كوابل نحاسية نقية وعلب دفن وحمايات مطابقة لأعلى المعايير الهندسية.',
    image: '/images/product-electrical-foundation.jpg',
    categoryKey: 'electrical',
    count: '120+ صنف'
  },
  {
    id: 'solar',
    nameAr: 'أنظمة الطاقة الشمسية',
    nameEn: 'Solar Lighting Systems',
    descAr: 'كشافات وإنارة ممرات ذكية بمستشعرات حركة وبطاريات عالية الكفاءة.',
    image: '/images/product-solar-lighting.jpg',
    categoryKey: 'solar',
    count: '25+ منظومة'
  }
]

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
   2. Main Component: HomeCleanWhitePreview
   ========================================================================= */

export default function HomeCleanWhitePreview() {
  const { isAr } = useLanguage()
  const paintColors = getPaintColors(isAr)

  // Navigation scroll state
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  // Preload all 4 photorealistic variations (all-off, 3000K, 4000K, 6000K)
  useEffect(() => {
    const simPhotos = [
      '/images/simulator/room-all-off.jpg?v=2',
      '/images/simulator/room-3000k.jpg?v=2',
      '/images/simulator/room-4000k.jpg?v=2',
      '/images/simulator/room-6000k.jpg?v=2'
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
  const { requestPermission } = useShake({
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
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-transform duration-300 group-hover:scale-105 ${
                isScrolled ? 'bg-[#0062D2] text-white shadow-md shadow-[#0062D2]/20' : 'bg-white text-[#15191E]'
              }`}
            >
              إ
            </div>
            <div className="flex flex-col">
              <span
                className={`font-semibold tracking-tight text-lg leading-tight transition-colors ${
                  isScrolled ? 'text-[#15191E]' : 'text-white'
                }`}
              >
                الإنارة الحديثة
              </span>
              <span
                className={`text-[10px] tracking-widest uppercase font-mono transition-colors ${
                  isScrolled ? 'text-[#68717D]' : 'text-white/80'
                }`}
              >
                ENARAH MODERN · 1988
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link
              to="/products"
              className={`transition-colors hover:text-[#0062D2] ${
                isScrolled ? 'text-[#15191E]' : 'text-white/95 hover:text-white'
              }`}
            >
              المنتجات
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
            <Link
              to="/wire-prices"
              className={`transition-colors hover:text-[#0062D2] ${
                isScrolled ? 'text-[#15191E]' : 'text-white/95 hover:text-white'
              }`}
            >
              أسعار الأسلاك
            </Link>
            <Link
              to="/about"
              className={`transition-colors hover:text-[#0062D2] ${
                isScrolled ? 'text-[#15191E]' : 'text-white/95 hover:text-white'
              }`}
            >
              عن الشركة
            </Link>
            <Link
              to="/contact"
              className={`transition-colors hover:text-[#0062D2] ${
                isScrolled ? 'text-[#15191E]' : 'text-white/95 hover:text-white'
              }`}
            >
              اتصل بنا
            </Link>
          </nav>

          {/* Primary CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
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
              className="lg:hidden bg-white text-[#15191E] border-b border-[#E7EAF0] px-6 py-8 shadow-xl"
            >
              <div className="flex flex-col gap-5 text-base font-semibold">
                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#0062D2] transition-colors py-2 border-b border-slate-100"
                >
                  المنتجات والتشكيلات
                </Link>
                <Link
                  to="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#0062D2] transition-colors py-2 border-b border-slate-100"
                >
                  المشاريع المنفذة
                </Link>
                <Link
                  to="/brands"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#0062D2] transition-colors py-2 border-b border-slate-100"
                >
                  العلامات والشركاء
                </Link>
                <Link
                  to="/wire-prices"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#0062D2] transition-colors py-2 border-b border-slate-100"
                >
                  أسعار الأسلاك
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#0062D2] transition-colors py-2 border-b border-slate-100"
                >
                  عن الإنارة الحديثة (منذ 1988)
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#0062D2] transition-colors py-2 border-b border-slate-100"
                >
                  اتصل بنا
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 text-center py-3 bg-[#0062D2] text-white rounded-xl font-semibold shadow-sm"
                >
                  ابدأ استشارة مجانية
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
            {/* Editorial Visual (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 border border-[#E7EAF0] shadow-sm">
                <img
                  src="/images/company-enarah-logo.jpg"
                  alt="Enarah Modern Showroom Tripoli Since 1988"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 right-6 left-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-white/80 block mb-1">
                    ESTABLISHED 1988
                  </span>
                  <p className="text-sm font-medium text-white/90">
                    طرابلس — ليبيا · الريادة في حلول الإنارة والتأسيس الكهربائي
                  </p>
                </div>
              </div>

              {/* Accent micro-card */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-4 bg-white p-5 rounded-xl border border-[#E7EAF0] shadow-lg max-w-xs">
                <div className="w-10 h-10 rounded-lg bg-[#EBF3FC] text-[#0062D2] flex items-center justify-center font-bold shrink-0">
                  <Award className="w-5 h-5" />
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
                  منذ تأسيس الإنارة الحديثة عام 1988، انطلقنا برؤية معمارية تضع الضوء في قلب التصميم الداخلي والخارجي كعنصر هندسي أصيل يشكّل الفراغ ويحدد شخصيته.
                </p>
                <p>
                  لأكثر من ثلاثة عقود، واكبنا تطور تقنيات الإنارة العالمية وشيّدنا شراكات استراتيجية متينة مع كبرى العلامات الأوروبية والدولية. نجمع بين الدقة الهندسية والذوق الجمالي لنقدم للمهندسين والمقاولين وأصحاب المنازل حلولاً كهربائية متكاملة ترتقي بالمكان وتمنحه حضوراً استثنائياً يدوم.
                </p>
              </div>

              {/* Three minimalist stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-[#E7EAF0]">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-[#15191E] tracking-tight block">
                    +35
                  </span>
                  <span className="text-xs sm:text-sm text-[#68717D] mt-1 block">
                    عاماً من الريادة
                  </span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-[#15191E] tracking-tight block">
                    +500
                  </span>
                  <span className="text-xs sm:text-sm text-[#68717D] mt-1 block">
                    مشروع تم تنفيذه
                  </span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-[#15191E] tracking-tight block">
                    +15
                  </span>
                  <span className="text-xs sm:text-sm text-[#68717D] mt-1 block">
                    علامة عالمية معتمدة
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#15191E] hover:bg-[#0062D2] text-white text-sm font-semibold rounded-full transition-colors duration-200"
                >
                  <span>تعرف على الإنارة الحديثة</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 04: Manufactured Collections (Seamlessly merged with Brand Story)
          Eyebrow: PROPRIETARY ARCHITECTURAL LINES
          Headline: خطوط إنتاجنا المعمارية: إضاءة لكل مساحة
          Layout: Editorial image grid (6 featured tiles), tactile cards on white
          ===================================================================== */}
      <section className="pt-4 pb-24 sm:pb-32 bg-[#FFFFFF]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Subtle architectural transition separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E7EAF0] to-transparent mb-16" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0062D2]/[0.08] border border-[#0062D2]/15 text-[#0062D2] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PROPRIETARY ARCHITECTURAL LINES · خطوط إنتاجنا وتصنيعنا</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#15191E] tracking-tight">
                {isAr ? 'خطوط إنتاجنا: إضاءة لكل مساحة' : 'Proprietary Lines: Lighting for Every Space'}
              </h2>
              <p className="text-sm sm:text-base text-[#68717D] mt-2 max-w-2xl font-normal leading-relaxed">
                {isAr
                  ? 'تشكيلات هندسية نقوم بتصنيعها وهندستها بأعلى معايير الجودة لتلائم أدق متطلبات المشاريع المعمارية والمنازل العصرية.'
                  : 'Architectural collections manufactured and engineered to global standards for residential and commercial spaces.'}
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0062D2] hover:text-[#0047A5] transition-colors group shrink-0"
            >
              <span>استعرض كافة خطوط الإنتاج</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          {/* Grid: 6 Large Photography Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                to={`/products?category=${col.categoryKey}`}
                className="group relative bg-[#FBFBFD] rounded-2xl overflow-hidden border border-[#E7EAF0] transition-all duration-300 hover:border-[#0062D2]/40 hover:shadow-xl hover:shadow-black/5 flex flex-col"
              >
                {/* Photo container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={col.image}
                    alt={col.nameAr}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-product.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#15191E] text-[11px] font-semibold px-3 py-1 rounded-full border border-black/5">
                    {col.count}
                  </span>
                </div>

                {/* Information */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#15191E] group-hover:text-[#0062D2] transition-colors mb-2">
                      {col.nameAr}
                    </h3>
                    <p className="text-sm text-[#68717D] leading-relaxed font-normal">
                      {col.descAr}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#E7EAF0] flex items-center justify-between text-xs font-semibold text-[#0062D2]">
                    <span>استكشف التشكيلة</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
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
          Eyebrow: COLOR & LIGHT
          Headline: حين يلتقي اللون بالضوء
          Feature: Wall Paint & Light Interaction with Interior Designer Advice
          ===================================================================== */}
      <section className="py-24 sm:py-32 bg-[#FFFFFF]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
              COLOR & LIGHT
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#15191E] tracking-tight mb-4">
              حين يلتقي اللون بالضوء
            </h2>
            <p className="text-sm sm:text-base text-[#68717D] leading-relaxed">
              تفاعل لون طلاء الجدار مع درجة حرارة الضوء يغيّر تماماً إدراك الفراغ. اختر لون الطلاء واكتشف الإضاءة المناسبة له.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-5xl mx-auto bg-[#F7F8FA] p-6 sm:p-10 rounded-3xl border border-[#E7EAF0]">
            {/* Visual Canvas (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div
                className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[#E7EAF0] shadow-inner transition-colors duration-500 flex flex-col justify-end p-6"
                style={{ backgroundColor: currentPaint.hex }}
              >
                {/* Spotlight cone cast onto wall */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-500"
                  style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    background:
                      paintTemp === 'warm'
                        ? 'linear-gradient(to bottom, rgba(255, 180, 80, 0.35), transparent 85%)'
                        : paintTemp === 'natural'
                        ? 'linear-gradient(to bottom, rgba(255, 245, 220, 0.25), transparent 85%)'
                        : 'linear-gradient(to bottom, rgba(200, 230, 255, 0.28), transparent 85%)',
                    opacity: paintTransitioning ? 0.3 : 1
                  }}
                />

                {/* Ceiling Spotlight Fixture */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                  <div className="w-8 h-2 bg-slate-800 rounded-full" />
                  <div
                    className="w-4 h-4 rounded-full mt-0.5 shadow-md transition-colors duration-300"
                    style={{
                      backgroundColor:
                        paintTemp === 'warm'
                          ? '#F59E0B'
                          : paintTemp === 'natural'
                          ? '#FEF08A'
                          : '#BAE6FD'
                    }}
                  />
                </div>

                {/* Overlay Badge */}
                <div className="relative z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-black/5 shadow-sm text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#68717D]">الطلاء:</span>
                    <strong className="text-[#15191E]">{currentPaint.name}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#68717D]">الإضاءة:</span>
                    <strong className="text-[#0062D2]">
                      {paintTemp === 'warm'
                        ? '3000K (أصفر دافئ)'
                        : paintTemp === 'natural'
                        ? '4000K (شمسي طبيعي)'
                        : '6000K (أبيض نهاري)'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Mobile shake trigger notice */}
              <div className="mt-3 text-center sm:hidden">
                <button
                  onClick={async () => {
                    const granted = await requestPermission()
                    if (granted) {
                      alert('تم تفعيل مستشعر هز الهاتف لتغيير الإضاءة!')
                    }
                  }}
                  className="text-[11px] text-[#0062D2] underline"
                >
                  تفعيل ميزة هز الهاتف لتغيير الإضاءة
                </button>
              </div>
            </div>

            {/* Controls & Architectural Advice (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              {/* 1. Paint Color Selection */}
              <div>
                <span className="text-xs font-semibold text-[#15191E] block mb-3">
                  1. اختر لون طلاء الجدار:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {paintColors.map((color) => {
                    const active = selectedPaintId === color.id
                    return (
                      <button
                        key={color.id}
                        onClick={() => setSelectedPaintId(color.id)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          active
                            ? 'bg-white border-[#0062D2] text-[#0062D2] shadow-sm ring-2 ring-[#0062D2]/20'
                            : 'bg-white/60 border-[#E7EAF0] text-[#15191E] hover:bg-white'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 2. Light Kelvin Selection */}
              <div>
                <span className="text-xs font-semibold text-[#15191E] block mb-3">
                  2. اختر حرارة الإضاءة المسلطة:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'warm', label: '3000K أصفر دافئ' },
                    { key: 'natural', label: '4000K شمسي طبيعي' },
                    { key: 'cool', label: '6000K أبيض نهاري' }
                  ].map((btn) => {
                    const active = paintTemp === btn.key
                    return (
                      <button
                        key={btn.key}
                        onClick={() => setPaintTemp(btn.key as 'warm' | 'natural' | 'cool')}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#0062D2] text-white border-[#0062D2] shadow-sm'
                            : 'bg-white border-[#E7EAF0] text-[#15191E] hover:bg-slate-50'
                        }`}
                      >
                        {btn.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 3. Interior Designer & Architectural Advice */}
              <div className="p-4 rounded-xl bg-[#EBF3FC] border border-[#0062D2]/20 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-white text-[#0062D2] flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0062D2] block mb-1">
                    رأي مهندس التصميم الداخلي:
                  </span>
                  <p className="text-xs sm:text-sm text-[#15191E] leading-relaxed">
                    {currentPaint.advice[paintTemp]}
                  </p>
                </div>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
            {/* Col 1: Brand Info (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0062D2] text-white flex items-center justify-center font-bold text-base">
                  إ
                </div>
                <div>
                  <span className="font-semibold text-white text-lg block">الإنارة الحديثة</span>
                  <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase block">
                    ENARAH MODERN · EST. 1988
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/75 leading-relaxed max-w-sm font-normal">
                روّاد توريد وحلول الإضاءة المعمارية والمواد الكهربائية المعتمدة في ليبيا منذ أكثر من ثلاثة عقود. نسعى لتقديم أعلى معايير الجودة والسلامة والتصميم العصري.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs text-white/60">
                <span>طرابلس، ليبيا</span>
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
                    اتصل بنا
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Collections */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">التشكيلات والحلول</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/products?category=chandeliers" className="hover:text-white transition-colors">
                    الثريات الفاخرة
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=spotlights" className="hover:text-white transition-colors">
                    السبوت لايت المعماري
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=outdoor" className="hover:text-white transition-colors">
                    الإنارة الخارجية والواجهات
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=switches" className="hover:text-white transition-colors">
                    المفاتيح والبرايز
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=electrical" className="hover:text-white transition-colors">
                    مواد التأسيس والكوابل
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=solar" className="hover:text-white transition-colors">
                    أنظمة الطاقة الشمسية
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Locations */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">التواصل والمعارض</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0062D2] shrink-0 mt-0.5" />
                  <span>طريق 20 رمضان (11 يونيو سابقاً) بالقرب من معهد النفط، طرابلس</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#0062D2] shrink-0" />
                  <span dir="ltr">+218 91 212 1303</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#0062D2] shrink-0" />
                  <span>السبت - الخميس: 9:00 ص - 8:30 م</span>
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
