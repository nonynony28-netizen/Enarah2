import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Building2,
  Cpu,
  Globe,
  Zap,
  CheckCircle2,
  PhoneCall,
  Clock,
  MapPin
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

/**
 * Animated numerical counter that animates once when scrolled into view.
 * Respects prefers-reduced-motion for accessibility.
 */
function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 1800
}: {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    // If user prefers reduced motion, set final value immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(target)
      hasAnimatedRef.current = true
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true
          const startTime = performance.now()

          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease-out cubic curve for natural deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(easeOut * target)
            setDisplayValue(current)

            if (progress < 1) {
              requestAnimationFrame(step)
            } else {
              setDisplayValue(target)
            }
          }

          requestAnimationFrame(step)
        }
      },
      { threshold: 0.2 }
    )

    const el = elementRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [target, duration])

  return (
    <span ref={elementRef} className="tabular-nums inline-block font-sans">
      {prefix}
      {hasAnimatedRef.current ? displayValue : target}
      {suffix}
    </span>
  )
}

export default function About() {
  const { isAr } = useLanguage()

  const railRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const isProgrammaticScroll = useRef(false)
  const scrollTimeout = useRef<number | null>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startScrollLeft = useRef(0)

  const handleRailScroll = () => {
    const el = railRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll <= 0) {
      setScrollProgress(0)
      if (!isProgrammaticScroll.current) setActiveIndex(0)
      return
    }
    const current = Math.abs(el.scrollLeft)
    const progress = Math.min(Math.max(current / maxScroll, 0), 1)
    setScrollProgress(progress)

    // Prevent intermediate flicker during programmatic scroll transitions
    if (isProgrammaticScroll.current) return

    const slides = el.querySelectorAll('article')
    if (slides.length > 0) {
      const idx = Math.min(
        slides.length - 1,
        Math.max(0, Math.round(progress * (slides.length - 1)))
      )
      setActiveIndex(idx)
    }
  }

  const scrollToIndex = (index: number) => {
    const el = railRef.current
    if (!el) return
    const slides = el.querySelectorAll('article')
    const target = slides[index] as HTMLElement | undefined
    const first = slides[0] as HTMLElement | undefined
    if (!target || !first) return

    // 1. Immediately update active state so UI reflects choice with 0 lag
    setActiveIndex(index)
    isProgrammaticScroll.current = true
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current)

    // 2. Temporarily pause scroll snap to eliminate animation fighting/jitter
    el.style.scrollSnapType = 'none'

    // 3. Compute exact horizontal offset relative to the scroll container
    const isRtl = isAr || document.documentElement.dir === 'rtl'
    const distance = Math.abs(target.offsetLeft - first.offsetLeft)
    const targetLeft = isRtl ? -distance : distance

    // 4. Smoothly scroll ONLY the container (never the page window!)
    el.scrollTo({
      left: targetLeft,
      behavior: 'smooth'
    })

    // 5. Restore scroll snap and release lock once animation finishes
    scrollTimeout.current = window.setTimeout(() => {
      if (el) {
        el.style.scrollSnapType = 'x mandatory'
      }
      isProgrammaticScroll.current = false
    }, 450)
  }

  const scrollRail = (direction: 'next' | 'prev') => {
    const nextIdx = direction === 'next'
      ? Math.min(milestones.length - 1, activeIndex + 1)
      : Math.max(0, activeIndex - 1)
    scrollToIndex(nextIdx)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = railRef.current
    if (!el) return
    isDragging.current = true
    startX.current = e.pageX
    startScrollLeft.current = el.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const el = railRef.current
    if (!el) return
    e.preventDefault()
    const dx = e.pageX - startX.current
    el.scrollLeft = startScrollLeft.current - dx
  }

  const handleMouseUpOrLeave = () => {
    isDragging.current = false
  }

  // Verified chronological milestones — "Journey Slides"
  const milestones = [
    {
      year: '1988',
      yearDisplay: isAr ? '1988' : '1988',
      index: '01 / 05',
      tag: isAr ? 'التأسيس والبداية' : 'Founding Era',
      title: isAr ? 'التأسيس والانطلاقة الأولى' : 'Establishment & Inception',
      desc: isAr
        ? 'بدأت مسيرة الإنارة الحديثة برؤية واضحة تضع الجودة والموثوقية في صميم العمل، لتأسيس حضور راسخ في قطاع الإضاءة والتجهيزات الكهربائية.'
        : 'The journey of Enarah Modern began with a distinct vision placing quality and reliability at the core of all operations, establishing an enduring presence in lighting and electrical infrastructure.',
      bgClass: 'bg-[#FAF8F5]',
      borderClass: 'border-[#EFE9DF] hover:border-[#D8CFBF]',
      textClass: 'text-[#1E2530]',
      descClass: 'text-[#4A5568]',
      accentColor: '#0062D2',
      yearClass: 'text-[#1E2530]'
    },
    {
      year: '2005',
      yearDisplay: isAr ? '2005' : '2005',
      index: '02 / 05',
      tag: isAr ? 'التوسع الدولي' : 'Global Alliances',
      title: isAr ? 'الشراكات العالمية والأوروبية' : 'Global & European Alliances',
      desc: isAr
        ? 'شهدت هذه المرحلة توسعًا مهمًا في نطاق الأعمال، من خلال بناء شراكات مع علامات عالمية وأوروبية رائدة، بما عزز تنوع الحلول ورفع مستوى الجودة المقدمة للعملاء.'
        : 'This phase marked significant operational expansion through strategic partnerships with leading global and European brands, enriching solution diversity and elevating client service standards.',
      bgClass: 'bg-[#F1F5F9]',
      borderClass: 'border-[#DFE7EF] hover:border-[#CBD5E1]',
      textClass: 'text-[#151F2C]',
      descClass: 'text-[#475569]',
      accentColor: '#0284C7',
      yearClass: 'text-[#151F2C]'
    },
    {
      year: '2008',
      yearDisplay: isAr ? '2008' : '2008',
      index: '03 / 05',
      tag: isAr ? 'التحول التقني' : 'Smart Lighting Era',
      title: isAr ? 'دخول عصر الإنارة الذكية' : 'The Smart Lighting Era',
      desc: isAr
        ? 'مع تطور احتياجات السوق، اتجهت الإنارة الحديثة إلى إدخال أنظمة الإنارة الذكية والحلول الكهربائية المتنوعة، لتقديم حلول أكثر كفاءة ومرونة تلائم تطور المشاريع واحتياجات العملاء.'
        : 'Adapting to evolving market demands, Enarah Modern pioneered smart lighting controls and intelligent electrical systems, delivering more efficient and flexible solutions tailored to modern architectural projects.',
      bgClass: 'bg-[#EDF5FC]',
      borderClass: 'border-[#D2E5F5] hover:border-[#BADAF0]',
      textClass: 'text-[#0F243A]',
      descClass: 'text-[#3B5775]',
      accentColor: '#0062D2',
      yearClass: 'text-[#0062D2]'
    },
    {
      year: '2018',
      yearDisplay: isAr ? '2018' : '2018',
      index: '04 / 05',
      tag: isAr ? 'المشاريع والتوسع' : 'Nationwide Expansion',
      title: isAr ? 'المشاريع والتوسع في ليبيا' : 'Projects & Nationwide Expansion',
      desc: isAr
        ? 'مثّلت هذه المرحلة خطوة مهمة في مسيرة الإنارة الحديثة، مع تنفيذ مشاريع متنوعة وتوسيع نطاق العمل على مستوى ليبيا، بما عزز حضور الشركة وخبرتها في تقديم الحلول المتكاملة.'
        : 'Representing a major step in the company’s evolution, executing diverse landmark developments and expanding across all of Libya, reinforcing our nationwide footprint and integrated capabilities.',
      bgClass: 'bg-[#F7F4EC]',
      borderClass: 'border-[#E7DFCE] hover:border-[#D5C9B3]',
      textClass: 'text-[#231F18]',
      descClass: 'text-[#5C5346]',
      accentColor: '#946E24',
      yearClass: 'text-[#231F18]'
    },
    {
      year: 'today',
      yearDisplay: isAr ? 'حتى اليوم' : 'Present',
      index: '05 / 05',
      isCurrent: true,
      tag: isAr ? 'المستقبل المستمر' : 'Continuous Evolution',
      title: isAr ? 'مسيرة مستمرة نحو المستقبل' : 'Continuous Evolution to the Future',
      desc: isAr
        ? 'تواصل الإنارة الحديثة مسيرتها بالتطوير المستمر، وتوسيع حلولها وخدماتها، مع الحفاظ على الجودة والثقة ومواكبة أحدث الاتجاهات في عالم الإضاءة والحلول الكهربائية.'
        : 'Enarah Modern continues its journey through relentless innovation, expanding solutions and services while preserving trust and quality, keeping pace with global lighting and electrical design.',
      bgClass: 'bg-[#101820]',
      borderClass: 'border-[#202936] hover:border-[#334155]',
      textClass: 'text-white',
      descClass: 'text-slate-300',
      accentColor: '#38BDF8',
      yearClass: 'text-white'
    }
  ]

  // Core Pillars of Engineering Excellence
  const pillars = [
    {
      icon: Cpu,
      title: isAr ? 'الدقة الهندسية وتوزيع الضوء' : 'Engineering Photometrics',
      desc: isAr
        ? 'نتعامل مع الضوء كعلم هندسي دقيق؛ نحسب درجات الانتشار وزوايا الانعكاس لتوفير بيئة بصرية مريحة بلا توهج.'
        : 'Light treated as an exact science; precision beam angles and photometrics for supreme visual comfort.'
    },
    {
      icon: ShieldCheck,
      title: isAr ? 'معايير جودة عالمية وسلامة غير قابلة للمساومة' : 'Uncompromising Safety Standards',
      desc: isAr
        ? 'منتجاتنا مطابقة للمواصفات القياسية العالمية، من كابلات النحاس النقي 100% إلى مواد التأسيس المقاومة للحريق ومثبطات اللهب.'
        : 'Certified to international standards, from 100% pure copper to fire-retardant electrical infrastructure.'
    },
    {
      icon: Building2,
      title: isAr ? 'شراكات استراتيجية مع كبرى المصانع' : 'World-Class Factory Alliances',
      desc: isAr
        ? 'وكلاء وموزعون موثوقون لعلامات عالمية كبرى تضمن أصالة المنتج وكفاءته التشغيلية المعتمدة لأطول عمر افتراضي.'
        : 'Authorized partners for prominent global brands, guaranteeing authentic performance and long-term operational efficiency.'
    }
  ]

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans antialiased pb-20 sm:pb-28 selection:bg-[#0062D2] selection:text-white"
      style={{
        fontFamily:
          "'IBM Plex Sans Arabic', 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* =====================================================================
          01. ARCHITECTURAL HERO (Deep Corporate Navy #101820)
          38 Years of Experience, Professionalism & Technical Credibility
          ===================================================================== */}
      <section className="relative bg-[#101820] text-white pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24 overflow-hidden border-b border-[#202936]">
        {/* Subtle architectural engineering grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        
        {/* Restrained corporate blue ambient highlights */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0062D2]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0062D2]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading & Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              {/* Corrected Location Eyebrow: Remove بنغازي, Use ليبيا */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/95 text-xs font-semibold border border-white/15 backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#0062D2] animate-pulse" />
                <span>{isAr ? 'تأسست عام 1988 · ليبيا' : 'Established 1988 · Libya'}</span>
              </div>

              {/* Mandatory Heading: 38 عامًا من الخبرة الهندسية */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-white">
                {isAr ? '38 عامًا من الخبرة الهندسية' : '38 Years of Architectural Engineering'}
              </h1>

              {/* Supporting narrative with corrected location phrasing */}
              <p className="text-sm sm:text-base lg:text-[17px] text-slate-300 leading-relaxed font-normal max-w-2xl">
                {isAr
                  ? 'منذ عام 1988، نكرّس خبرتنا الهندسية في توفير أرقى حلول الإنارة المعمارية، المفاتيح والأنظمة الذكية، والمواد الكهربائية وأسلاك التأسيس المعتمدة في كافة المدن والمناطق الليبية.'
                  : 'Since 1988, we have dedicated our technical expertise to providing premier architectural lighting, smart controls, and certified electrical wires across Libya.'}
              </p>

              {/* Supporting Corporate Standard Badges */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'معايير جودة عالمية' : 'Global Quality Standards'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'نحاس إيطالي نقي 100%' : '100% Pure Italian Copper'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'شراكات مع كبرى المصانع' : 'Authorized Alliances'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Redesigned 2x2 Interactive Statistics Panel (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-[#151F2C]/80 border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-2xl">
                <div className="text-[11px] font-mono tracking-widest text-[#0062D2] uppercase mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
                  <span>{isAr ? 'مؤشرات الأداء والريادة' : 'PERFORMANCE METRICS'}</span>
                  <span className="text-slate-400 font-sans normal-case text-xs">1988 — 2026</span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 divide-x divide-y lg:divide-y-0 divide-white/10">
                  {/* Metric 1: 38+ Years */}
                  <div className="pr-1 pt-1">
                    <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none mb-1.5">
                      <AnimatedCounter target={38} suffix="+" />
                    </div>
                    <span className="text-xs sm:text-[13px] text-slate-300 block font-medium leading-snug">
                      {isAr ? 'عامًا من الريادة والخبرة' : 'Years of Heritage & Leadership'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {isAr ? 'تأسيس مستمر منذ 1988' : 'Pioneering since 1988'}
                    </span>
                  </div>

                  {/* Metric 2: 500+ Projects */}
                  <div className="pl-4 sm:pl-6 pt-1">
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#0062D2] tracking-tight leading-none mb-1.5">
                      <AnimatedCounter target={500} suffix="+" />
                    </div>
                    <span className="text-xs sm:text-[13px] text-slate-300 block font-medium leading-snug">
                      {isAr ? 'مشروعاً منجزاً في ليبيا' : 'Completed Projects in Libya'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {isAr ? 'صروح سكنية وتجارية' : 'Commercial & Residential'}
                    </span>
                  </div>

                  {/* Metric 3: 14+ Authorized Brands */}
                  <div className="pr-1 pt-4 sm:pt-6 border-t border-white/10">
                    <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none mb-1.5">
                      <AnimatedCounter target={14} suffix="+" />
                    </div>
                    <span className="text-xs sm:text-[13px] text-slate-300 block font-medium leading-snug">
                      {isAr ? 'وكالة وعلامة معتمدة' : 'Authorized Global Brands'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {isAr ? 'شراكات أوروبية ودولية' : 'European & Global'}
                    </span>
                  </div>

                  {/* Metric 4: 100% Certified Products */}
                  <div className="pl-4 sm:pl-6 pt-4 sm:pt-6 border-t border-white/10">
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#0062D2] tracking-tight leading-none mb-1.5">
                      <AnimatedCounter target={100} suffix="%" />
                    </div>
                    <span className="text-xs sm:text-[13px] text-slate-300 block font-medium leading-snug">
                      {isAr ? 'منتجات أصلية موثقة' : 'Authentic Certified Products'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {isAr ? 'شهادات فحص ومطابقة' : 'Certified Test Reports'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          02. COMPANY STORY & PHILOSOPHY (Clean White Editorial Presentation)
          High-end architectural lighting imagery & corrected company name
          ===================================================================== */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 lg:pt-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#E7EAF0] shadow-sm mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Story Text (6 cols) */}
            <div className="lg:col-span-6 space-y-6 text-[#15191E]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0062D2]/10 border border-[#0062D2]/20 text-[#0062D2] text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'فلسفتنا المعمارية' : 'OUR ARCHITECTURAL PHILOSOPHY'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#15191E] leading-snug">
                {isAr
                  ? 'الضوء يشكّل الفراغ ويصنع الفارق المعماري'
                  : 'Light Shapes Space & Defines Architecture'}
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {/* Mandatory Correction: Use شركة الإنارة instead of شركة الإنارة الحديثة */}
                <p>
                  {isAr
                    ? 'تأسست شركة الإنارة في ليبيا عام 1988، بهدف الارتقاء بمفهوم الإضاءة من مجرد عنصر وظيفي تقليدي إلى قيمة معمارية محورية تُبرز جمال الفراغ وتمنحه شخصيته المستقلة.'
                    : 'Founded in Libya in 1988, Enarah Company elevated lighting from a mere functional necessity to a core architectural element shaping interior spaces.'}
                </p>
                <p>
                  {isAr
                    ? 'نواكب باستمرار التطور التقني المتسارع في عالم الإضاءة والتحكم الذكي، ونوفر للمهندسين الاستشاريين والمقاولين وأصحاب الذوق الرفيع باقة متكاملة من المنتجات الأصلية المطابقة للمواصفات العالمية.'
                    : 'We continually adopt global lighting technologies, smart building controls, and certified electrical infrastructure for architects, contractors, and discerning homeowners.'}
                </p>
              </div>

              {/* Architectural Quote Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border-r-4 border-[#0062D2] border border-[#E2E8F0]">
                <p className="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed">
                  {isAr
                    ? '«الهندسة الضوئية ليست مجرد تركيبات كهربائية، بل هي ترجمة فيزيائية وجمالية تمنح البناء هويته وراحته المستدامة.»'
                    : '"Lighting engineering is not merely electrical fixtures; it is the physical translation of architecture that gives each space identity and comfort."'}
                </p>
              </div>
            </div>

            {/* Relevant Authentic Image (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-[#E7EAF0] shadow-lg group">
                <img
                  src="/images/about-lighting-architecture.jpg"
                  alt={isAr ? 'تطبيق إضاءة معمارية حديثة - شركة الإنارة' : 'Modern Architectural Lighting Installation'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Subtle Image Spec Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs select-none">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 font-medium">
                    {isAr ? 'معايير الإضاءة المعمارية المتطورة' : 'Architectural Lighting Installation'}
                  </span>
                  <span className="font-mono text-white/80 text-[11px] hidden sm:inline">
                    EST. 1988
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            03. BUSINESS PILLARS ("ركائز عملنا")
            Architectural Deep Corporate Navy Theme (#101820)
            ===================================================================== */}
        <div className="bg-[#101820] text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#202936] shadow-xl relative overflow-hidden mb-20 sm:mb-28">
          {/* Subtle Architectural Glow & Grid Texture */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0062D2]/15 rounded-full blur-3xl pointer-events-none" />
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          <div className="relative z-10 text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold tracking-wider uppercase border border-white/10 mb-3 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2] animate-pulse" />
              <span>CORE PRINCIPLES · {isAr ? 'معايير التميز' : 'Engineering Excellence'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
              {isAr ? 'ركائز عملنا الهندسي' : 'Core Engineering Pillars'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              {isAr
                ? 'ثوابت مهنية صارمة تحكم كل منتج ونظام كهربائي نختاره لعملائنا في كافة أرجاء ليبيا.'
                : 'Rigorous engineering standards governing every fixture, wire, and control system we provide.'}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {pillars.map((item, i) => (
              <div
                key={i}
                className="bg-[#151D28] rounded-2xl p-6 sm:p-8 border border-[#253245] shadow-md hover:border-[#0062D2]/50 hover:bg-[#182333] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0062D2]/15 text-[#38bdf8] border border-[#0062D2]/25 flex items-center justify-center mb-6 shadow-xs group-hover:bg-[#0062D2]/25 group-hover:scale-105 transition-all">
                    <item.icon className="w-6 h-6 text-[#38bdf8]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 leading-snug group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#222E40] flex items-center gap-2 text-xs font-semibold text-blue-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#0062D2]" />
                  <span>{isAr ? 'معيار معتمد وموثق' : 'Certified Standard'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================================
            04. COMPANY MILESTONES ("Journey Slides" — Editorial Slide Experience)
            Horizontal Native Scroll Snap, Architectural Color Progression, Large Typographic Years
            ===================================================================== */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 lg:p-12 border border-[#E7EAF0] shadow-xs mb-16 sm:mb-28 overflow-hidden">
          {/* Section Header with Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-2 text-xs font-medium text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                <span className="font-mono tracking-wider text-[11px] uppercase">
                  {isAr ? 'مسيرة تمتد لأكثر من 38 عامًا · 1988 — 2026' : '38+ Years of Heritage · 1988 — 2026'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#15191E] tracking-tight leading-[1.2] mb-2">
                {isAr ? 'محطات مضيئة في مسيرتنا' : 'Milestones in Our Journey'}
              </h2>

              <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
                {isAr
                  ? 'منذ أكثر من ثلاثة عقود، نواصل بناء مسيرة ترتكز على الجودة، والتطور، وتقديم حلول متقدمة في عالم الإضاءة والتأسيس الكهربائي.'
                  : 'For more than three decades, we have forged a journey founded on quality, continuous evolution, and advanced solutions in architectural lighting and electrical infrastructure.'}
              </p>
            </div>

            {/* Navigation Arrows — Visible on Mobile & Desktop */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => scrollRail('prev')}
                disabled={activeIndex === 0}
                aria-label={isAr ? 'المحطة السابقة' : 'Previous Milestone'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white hover:border-[#0062D2] hover:text-[#0062D2] text-slate-700 flex items-center justify-center transition-all shadow-xs active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => scrollRail('next')}
                disabled={activeIndex === milestones.length - 1}
                aria-label={isAr ? 'المحطة التالية' : 'Next Milestone'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white hover:border-[#0062D2] hover:text-[#0062D2] text-slate-700 flex items-center justify-center transition-all shadow-xs active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Interactive Chapter / Year Selector Track (Glitch-Free & Smooth) */}
          <div className="mb-4 sm:mb-7 select-none overflow-x-auto scrollbar-none">
            <div className="inline-flex items-center gap-1 sm:gap-2 p-1 bg-slate-100/90 rounded-full border border-slate-200/80">
              {milestones.map((m, idx) => {
                const isActive = activeIndex === idx
                return (
                  <button
                    key={m.year}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    aria-label={m.title}
                    className={`px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 shrink-0 cursor-pointer font-mono select-none ${
                      isActive
                        ? m.isCurrent
                          ? 'bg-[#101820] text-white shadow-xs'
                          : 'bg-[#0062D2] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span>{m.yearDisplay}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Horizontal Journey Rail (Native Touch Scroll Snap + Mouse Drag) */}
          <div
            ref={railRef}
            onScroll={handleRailScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex gap-3.5 sm:gap-6 overflow-x-auto pb-4 pt-1 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory scrollbar-none cursor-grab active:cursor-grabbing select-none [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {milestones.map((m) => (
              <article
                key={m.year}
                className={`snap-start snap-always shrink-0 w-[84vw] max-w-[325px] sm:max-w-none sm:w-[380px] lg:w-[420px] xl:w-[440px] ${m.bgClass} ${m.borderClass} border rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-9 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group min-h-[350px] sm:min-h-[380px] select-none`}
              >
                {/* Background Translucent Year (Editorial Watermark Typography) */}
                <div
                  aria-hidden="true"
                  className={`absolute -bottom-6 -left-6 font-mono font-black text-8xl sm:text-9xl pointer-events-none select-none tracking-tighter ${
                    m.isCurrent ? 'text-white/[0.04]' : 'text-black/[0.035]'
                  }`}
                >
                  {m.year === 'today' ? '2026' : m.year}
                </div>

                {/* Top Row: Chapter Index & Era Tag */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5 pb-3.5 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <span className="font-mono text-xs tracking-wider text-slate-400 font-semibold uppercase">
                      {m.index}
                    </span>

                    {m.isCurrent ? (
                      <div className="inline-flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]" />
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-[#38BDF8] tracking-wider uppercase">
                          {m.tag}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono tracking-wider text-slate-500 uppercase">
                        {m.tag}
                      </span>
                    )}
                  </div>

                  {/* Large Architectural Year Headline */}
                  {m.isCurrent ? (
                    <div className="mb-4">
                      <span className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight leading-none block">
                        {m.yearDisplay}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <span
                        className={`font-mono text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-none block ${m.yearClass} group-hover:scale-102 transition-transform duration-300 origin-right rtl:origin-right ltr:origin-left`}
                      >
                        {m.yearDisplay}
                      </span>
                    </div>
                  )}

                  {/* Milestone Title */}
                  <h3
                    className={`text-lg sm:text-xl font-bold ${m.textClass} mb-3 leading-snug tracking-tight`}
                  >
                    {m.title}
                  </h3>

                  {/* Milestone Description */}
                  <p
                    className={`text-xs sm:text-sm ${m.descClass} leading-relaxed font-normal`}
                  >
                    {m.desc}
                  </p>
                </div>

                {/* Bottom Architectural Signature Rule / Status */}
                <div className="pt-5 mt-5 sm:pt-6 sm:mt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                  <div
                    className="h-[2px] rounded-full transition-all duration-300 group-hover:w-16"
                    style={{
                      width: '32px',
                      backgroundColor: m.accentColor
                    }}
                  />
                  {m.isCurrent ? (
                    <span className="font-mono text-[11px] text-[#38BDF8] font-semibold tracking-wider">
                      {isAr ? 'المسيرة مستمرة ➔' : 'Ongoing Journey ➔'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => scrollRail('next')}
                      className="font-mono text-[11px] text-[#0062D2] hover:underline font-semibold tracking-wide flex items-center gap-1 cursor-pointer select-none"
                    >
                      <span>{isAr ? 'المحطة التالية' : 'Next Milestone'}</span>
                      <span>{isAr ? '←' : '→'}</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Section Footer: Progress Indicator, Counter & Mobile Quick Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 mt-3 border-t border-slate-100">
            <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                  {isAr ? 'تقدم المسيرة' : 'JOURNEY PROGRESS'}
                </span>
                <div className="w-20 sm:w-40 h-[2.5px] bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-[#0062D2] transition-all duration-200 rounded-full"
                    style={{
                      width: `${Math.max(20, ((activeIndex + 1) / milestones.length) * 100)}%`,
                      transformOrigin: isAr ? 'right' : 'left'
                    }}
                  />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-700">
                  0{activeIndex + 1} / 0{milestones.length}
                </span>
              </div>

              {/* Mobile Quick Action Buttons in Footer */}
              <div className="flex sm:hidden items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollRail('prev')}
                  disabled={activeIndex === 0}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-30 flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  {isAr ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                  <span>{isAr ? 'السابق' : 'Prev'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail('next')}
                  disabled={activeIndex === milestones.length - 1}
                  className="px-2.5 py-1 rounded-lg border border-[#0062D2]/30 bg-[#0062D2]/5 text-xs font-semibold text-[#0062D2] disabled:opacity-30 flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <span>{isAr ? 'التالي' : 'Next'}</span>
                  {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
              <span>
                {isAr
                  ? 'أكثر من ثلاثة عقود من التطوير المستمر وحفظ معايير الجودة'
                  : 'Over three decades of sustained development and verified quality'}
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================================
            05. CORPORATE CONSULTATION CTA STRIP
            Deep Corporate Navy & Clean Direct Actions
            ===================================================================== */}
        <div className="bg-[#101820] text-white rounded-3xl p-8 sm:p-12 lg:p-16 text-center border border-[#202936] relative overflow-hidden shadow-xl">
          <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#0062D2]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold tracking-wider uppercase border border-white/15">
              <PhoneCall className="w-3.5 h-3.5 text-[#0062D2]" />
              <span>{isAr ? 'استشارات المشاريع الهندسية' : 'Engineering Consultations'}</span>
            </span>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
              {isAr ? 'هل تخطط لمشروعك القادم؟' : 'Planning Your Next Project?'}
            </h3>

            {/* Corrected Location Phrase: Remove بنغازي, Use ليبيا */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-normal">
              {isAr
                ? 'تواصل مع مهندسينا في ليبيا للحصول على استشارة متخصصة ودراسة ضوئية شاملة لمساحتك وتحديد الكابلات والمواد المناسبة.'
                : 'Contact our specialized engineers in Libya for an architectural lighting study and certified wire calculations.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-md shadow-[#0062D2]/25 active:scale-98"
              >
                <span>{isAr ? 'تواصل مع خبرائنا' : 'Contact Our Engineers'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
              <Link
                to="/branches"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-full transition-colors border border-white/15 active:scale-98"
              >
                <span>{isAr ? 'فروعنا ومعارضنا' : 'Our Showrooms'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
