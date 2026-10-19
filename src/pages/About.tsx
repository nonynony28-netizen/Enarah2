import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
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

  // Verified chronological milestones — All facts preserved
  const milestones = [
    {
      year: '1988',
      title: isAr ? 'التأسيس والانطلاقة الأولى' : 'Establishment & Inception',
      desc: isAr
        ? 'انطلقت شركة الإنارة في ليبيا برؤية معمارية تضع الجودة والموثوقية في قلب التأسيس الكهربائي.'
        : 'Founded in Libya with an architectural vision placing quality at the core of electrical infrastructure.'
    },
    {
      year: '2005',
      title: isAr ? 'الشراكات الأوروبية والدولية' : 'European & Global Alliances',
      desc: isAr
        ? 'توسيع نطاق الأعمال واعتماد شراكات توزيع رئيسية مع نخبة مصانع الإضاءة والمفاتيح في فرنسا وإيطاليا وألمانيا.'
        : 'Expanded operations, securing strategic distribution alliances with top European manufacturers.'
    },
    {
      year: '2016',
      title: isAr ? 'دخول عصر الإنارة المعمارية المتطورة' : 'Architectural LED Revolution',
      desc: isAr
        ? 'إدخال أنظمة الإنارة الخطية (LED Profiles)، والسبوت المعماري المانع للتوهج، وحلول الطاقة الذكية.'
        : 'Pioneered linear architectural LED profiles, anti-glare recessed optics, and energy-efficient systems.'
    },
    {
      year: '2024+',
      title: isAr ? 'ريادة كبرى المشاريع والصروح' : 'Landmark Projects Leadership',
      desc: isAr
        ? 'توريد وتنفيذ منظومات الإنارة والكهرباء لأبرز المجمعات التجارية، المصحات الطبية، والمباني الفاخرة.'
        : 'Successfully executing illumination for prominent commercial complexes, medical clinics, and luxury villas.'
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
            04. COMPANY MILESTONES (Minimal Editorial Timeline)
            Clear Dates, Connecting Flow & Verified Historical Accuracy
            ===================================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#E7EAF0] shadow-sm mb-20 sm:mb-28">
          <div className="max-w-xl mb-10 sm:mb-12">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
              OUR JOURNEY · تاريخنا ومسيرتنا
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#15191E] tracking-tight mb-2">
              {isAr ? 'محطات مضيئة في مسيرتنا' : 'Milestones in Our Journey'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {isAr
                ? '38 عامًا من الالتزام بالجودة والتطور المستمر في قطاع الإنارة والتأسيس الكهربائي.'
                : '38 years of relentless dedication to quality and innovation in electrical infrastructure.'}
            </p>
          </div>

          <div className="relative border-r-2 border-slate-100 mr-3 sm:mr-6 pr-6 sm:pr-8 space-y-8 sm:space-y-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Node Indicator */}
                <span className="absolute -right-[31px] sm:-right-[39px] top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border-3 border-[#0062D2] shadow-xs group-hover:scale-125 transition-transform duration-200" />

                <div className="bg-[#F8FAFC] p-5 sm:p-6 rounded-2xl border border-[#E7EAF0] hover:border-[#0062D2]/30 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-base sm:text-lg font-bold text-[#0062D2]">
                      {m.year}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                      {isAr ? `المحطة ${idx + 1}` : `Phase ${idx + 1}`}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#15191E] mb-2 leading-snug">
                    {m.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#68717D] leading-relaxed font-normal">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
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
