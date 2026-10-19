import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Phone, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { StatReveal } from '../components/ui/StatReveal'
import { SequentialRevealGroup, SequentialRevealItem } from '../components/ui/SequentialReveal'

export interface BrandItem {
  id: string
  name: string
  origin: string
  originEn: string
  region: 'europe' | 'turkey' | 'other'
  category: string
  categoryEn: string
  description: string
  descriptionEn: string
  logoUrl: string
  hasCatalogProducts?: boolean
}

/**
 * AnimatedCounter alias mapping to StatReveal (Static Numbers, Cinematic Reveal)
 */
const AnimatedCounter = StatReveal

export default function Brands() {
  const { isAr } = useLanguage()

  // Verified Brand Data (All 14 Authentic Brands Preserved)
  const brands: BrandItem[] = useMemo(() => [
    {
      id: 'legrand',
      name: 'Legrand',
      origin: isAr ? 'فرنسا' : 'France',
      originEn: 'France',
      region: 'europe',
      category: isAr ? 'مفاتيح وتحكم ذكي' : 'Smart Switches & Controls',
      categoryEn: 'Smart Switches & Controls',
      description: isAr
        ? 'شركة فرنسية عالمية متخصصة في البنية التحتية الكهربائية والرقمية للمباني، وتشتهر بمفاتيح التوصيل وأنظمة التحكم الذكية.'
        : 'A French global leader in electrical and digital building infrastructures, renowned for premium wiring devices and smart control systems.',
      descriptionEn: 'A French global leader in electrical and digital building infrastructures, renowned for premium wiring devices and smart control systems.',
      logoUrl: '/images/brand-legrand.png?v=2'
    },
    {
      id: 'philips',
      name: 'Philips',
      origin: isAr ? 'هولندا' : 'Netherlands',
      originEn: 'Netherlands',
      region: 'europe',
      category: isAr ? 'إنارة LED موفرة' : 'LED Lighting',
      categoryEn: 'LED Lighting',
      description: isAr
        ? 'الرائد العالمي في مجال حلول الإضاءة المبتكرة، ومصابيح LED الموفرة للطاقة، وأنظمة الإضاءة الفنية.'
        : 'The global pioneer in innovative lighting solutions, energy-efficient LED technology, and premium lighting systems.',
      descriptionEn: 'The global pioneer in innovative lighting solutions, energy-efficient LED technology, and premium lighting systems.',
      logoUrl: '/images/brand-philips.png?v=2'
    },
    {
      id: 'gewiss',
      name: 'Gewiss',
      origin: isAr ? 'إيطاليا' : 'Italy',
      originEn: 'Italy',
      region: 'europe',
      category: isAr ? 'تشغيل آلي وتوزيع طاقة' : 'Automation & Power',
      categoryEn: 'Automation & Power',
      description: isAr
        ? 'علامة إيطالية متخصصة في أنظمة التشغيل الآلي للمباني، وتوزيع الطاقة، وحلول الإنارة الفنية والصناعية.'
        : 'An Italian brand specialized in building automation, power distribution, and advanced technical/industrial lighting systems.',
      descriptionEn: 'An Italian brand specialized in building automation, power distribution, and advanced technical/industrial lighting systems.',
      logoUrl: '/images/brand-gewiss.png?v=2'
    },
    {
      id: 'fumagalli',
      name: 'Fumagalli',
      origin: isAr ? 'إيطاليا' : 'Italy',
      originEn: 'Italy',
      region: 'europe',
      category: isAr ? 'إنارة حدائق ضد الصدأ' : 'Rustproof Outdoor Lighting',
      categoryEn: 'Rustproof Outdoor Lighting',
      description: isAr
        ? 'الشركة الإيطالية المتخصصة في إنتاج إضاءات الحدائق والإنارة الخارجية المقاومة للصدأ والتآكل بفضل مادة الراتنج الفريدة.'
        : 'The Italian manufacturer of outdoor and garden lighting, famous for rust-free and shockproof resin composite posts.',
      descriptionEn: 'The Italian manufacturer of outdoor and garden lighting, famous for rust-free and shockproof resin composite posts.',
      logoUrl: '/images/brand-fumagalli.png?v=2'
    },
    {
      id: 'icc',
      name: 'ICC',
      origin: isAr ? 'إيطاليا' : 'Italy',
      originEn: 'Italy',
      region: 'europe',
      category: isAr ? 'إكسسوارات توصيل كهربائي' : 'Wiring & Connectors',
      categoryEn: 'Wiring & Connectors',
      description: isAr
        ? 'أنظمة وإكسسوارات توصيل كهربائي مصممة للمباني والمشاريع الكبرى بموثوقية ومعايير جودة أوروبية.'
        : 'Advanced electrical lighting fixtures and connection accessories designed for high-reliability building installations.',
      descriptionEn: 'Advanced electrical lighting fixtures and connection accessories designed for high-reliability building installations.',
      logoUrl: '/images/brand-icc.png?v=2',
      hasCatalogProducts: true
    },
    {
      id: 'geros',
      name: 'Geros',
      origin: isAr ? 'إيطاليا' : 'Italy',
      originEn: 'Italy',
      region: 'europe',
      category: isAr ? 'علب توزيع مضادة للماء' : 'Waterproof Junction Boxes',
      categoryEn: 'Waterproof Junction Boxes',
      description: isAr
        ? 'شركة إيطالية لإنتاج علب التوزيع الكهربائية المقاومة للماء، وصناديق التوصيل، وخزائن المفاتيح.'
        : 'An Italian manufacturer of waterproof distribution boards, junction boxes, and circuit breaker enclosures.',
      descriptionEn: 'An Italian manufacturer of waterproof distribution boards, junction boxes, and circuit breaker enclosures.',
      logoUrl: '/images/brand-geros.png?v=2'
    },
    {
      id: 'cata',
      name: 'CATA',
      origin: isAr ? 'تركيا' : 'Turkey',
      originEn: 'Turkey',
      region: 'turkey',
      category: isAr ? 'سبوت لايت وإضاءة ديكورية' : 'Spotlights & Modern Decor',
      categoryEn: 'Spotlights & Modern Decor',
      description: isAr
        ? 'علامة تركية متميزة في تقديم تشكيلات واسعة من إضاءات السبوت لايت، والمصابيح الديكورية الموفرة، ولمبات الإنارة المعمارية.'
        : 'A prominent Turkish brand providing versatile spotlights, architectural decorative lamps, and energy-saving lighting.',
      descriptionEn: 'A prominent Turkish brand providing versatile spotlights, architectural decorative lamps, and energy-saving lighting.',
      logoUrl: '/images/brand-cata.png?v=2'
    },
    {
      id: 'borsan',
      name: 'Borsan',
      origin: isAr ? 'تركيا' : 'Turkey',
      originEn: 'Turkey',
      region: 'turkey',
      category: isAr ? 'كابلات نحاسية معتمدة' : 'Certified Copper Cables',
      categoryEn: 'Certified Copper Cables',
      description: isAr
        ? 'من كبرى المصانع التركية المنتجة للكابلات الكهربائية النحاسية عالية التوصيل، وتجهيزات التركيب والتأسيس.'
        : 'One of the leading Turkish manufacturers of highly conductive copper electrical cables and wiring equipment.',
      descriptionEn: 'One of the leading Turkish manufacturers of highly conductive copper electrical cables and wiring equipment.',
      logoUrl: '/images/brand-borsan.png?v=2',
      hasCatalogProducts: true
    },
    {
      id: 'makel',
      name: 'Makel',
      origin: isAr ? 'تركيا' : 'Turkey',
      originEn: 'Turkey',
      region: 'turkey',
      category: isAr ? 'مفاتيح ومقابس حماية' : 'Switches & Safety Outlets',
      categoryEn: 'Switches & Safety Outlets',
      description: isAr
        ? 'شركة صناعية تركية رائدة في إنتاج المفاتيح الكهربائية، والمقابس، وقواطع الدورة الفردية والثنائية.'
        : 'A Turkish pioneer in producing electrical switches, wall sockets, and safety circuit breakers.',
      descriptionEn: 'A Turkish pioneer in producing electrical switches, wall sockets, and safety circuit breakers.',
      logoUrl: '/images/brand-makel.png?v=2'
    },
    {
      id: 'isildar',
      name: 'Isildar',
      origin: isAr ? 'تركيا' : 'Turkey',
      originEn: 'Turkey',
      region: 'turkey',
      category: isAr ? 'تأسيس وإنارة اقتصادية' : 'Foundation & Lighting',
      categoryEn: 'Foundation & Lighting',
      description: isAr
        ? 'أنظمة إضاءة ومواد تأسيس كهربائي تركية مصممة لظروف العمل المختلفة وتوفر تكلفة تشغيل اقتصادية.'
        : 'Turkish lighting and wiring installation brands designed for heavy duty performance and cost-effective operations.',
      descriptionEn: 'Turkish lighting and wiring installation brands designed for heavy duty performance and cost-effective operations.',
      logoUrl: '/images/brand-isildar.png?v=2'
    },
    {
      id: 'chint',
      name: 'CHINT',
      origin: isAr ? 'الصين' : 'China',
      originEn: 'China',
      region: 'other',
      category: isAr ? 'قواطع آمنة ومعدات طاقة' : 'Power Breakers & Protection',
      categoryEn: 'Power Breakers & Protection',
      description: isAr
        ? 'مجموعة عالمية لإنتاج وتطوير معدات توزيع الكهرباء ذات الجهد المنخفض، والقواطع الآمنة، وأنظمة الحماية.'
        : 'A global provider of smart energy solutions, low-voltage electrical distribution gear, and protective systems.',
      descriptionEn: 'A global provider of smart energy solutions, low-voltage electrical distribution gear, and protective systems.',
      logoUrl: '/images/brand-chint.png?v=2'
    },
    {
      id: 'wellmax',
      name: 'WELLMAX',
      origin: isAr ? 'الصين' : 'China',
      originEn: 'China',
      region: 'other',
      category: isAr ? 'تكنولوجيا Samsung LED' : 'Samsung LED Lighting',
      categoryEn: 'Samsung LED Lighting',
      description: isAr
        ? 'شركة متخصصة في مصابيح LED المتميزة باستخدام شرائح إضاءة متطورة من شركة Samsung.'
        : 'A renowned LED lighting manufacturer featuring advanced Samsung LED chips.',
      descriptionEn: 'A renowned LED lighting manufacturer featuring advanced Samsung LED chips.',
      logoUrl: '/images/brand-wellmax.png?v=2'
    },
    {
      id: 'alfanar',
      name: 'Alfanar',
      origin: isAr ? 'السعودية' : 'Saudi Arabia',
      originEn: 'Saudi Arabia',
      region: 'other',
      category: isAr ? 'كابلات ولوحات توزيع' : 'Cables & Distribution Boards',
      categoryEn: 'Cables & Distribution Boards',
      description: isAr
        ? 'شركة إقليمية كبرى لتصنيع الكابلات النحاسية، ولوحات التوزيع الكهربائية الآمنة، والمفاتيح والأفياش.'
        : 'A regional powerhouse in manufacturing cables, electrical distribution boards, and wiring accessories.',
      descriptionEn: 'A regional powerhouse in manufacturing cables, electrical distribution boards, and wiring accessories.',
      logoUrl: '/images/brand-alfanar.png?v=2'
    },
    {
      id: 'commax',
      name: 'Commax',
      origin: isAr ? 'كوريا الجنوبية' : 'South Korea',
      originEn: 'South Korea',
      region: 'other',
      category: isAr ? 'إنترفون واتصال مرئي' : 'Intercom & Smart Video',
      categoryEn: 'Intercom & Smart Video',
      description: isAr
        ? 'شركة كورية متخصصة في أنظمة الإنترفون الصوتي والمرئي، وحلول المنازل والتحكم في المداخل.'
        : 'A Korean brand specializing in smart video door phones, intercom systems, and home entry solutions.',
      descriptionEn: 'A Korean brand specializing in smart video door phones, intercom systems, and home entry solutions.',
      logoUrl: '/images/brand-commax.png?v=2'
    }
  ], [isAr])

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'europe' | 'turkey' | 'other'>('all')
  const [activeBrandModal, setActiveBrandModal] = useState<BrandItem | null>(null)

  // Filter Categories & Dynamic Counts
  const filterTabs = useMemo(() => [
    { key: 'all', label: isAr ? 'جميع العلامات' : 'All Brands', count: brands.length },
    { key: 'europe', label: isAr ? 'الأوروبية' : 'European', count: brands.filter((b) => b.region === 'europe').length },
    { key: 'turkey', label: isAr ? 'التركية' : 'Turkish', count: brands.filter((b) => b.region === 'turkey').length },
    { key: 'other', label: isAr ? 'أخرى' : 'Other', count: brands.filter((b) => b.region === 'other').length }
  ], [brands, isAr])

  const filteredBrands = useMemo(() => {
    if (selectedFilter === 'all') return brands
    return brands.filter((b) => b.region === selectedFilter)
  }, [brands, selectedFilter])

  const openWhatsAppInquiry = (brand: BrandItem) => {
    const text = isAr
      ? `السلام عليكم، أود الاستفسار عن توفر منتجات علامة (${brand.name} - ${brand.origin}) في فرع بنغازي.`
      : `Hello, I would like to inquire about products from ${brand.name} (${brand.originEn}) available at your Benghazi branch.`
    window.open(`https://wa.me/218916580068?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-20">
      
      {/* =====================================================================
          01. Architectural Hero Header (Deep Corporate Navy #0B1528)
          ===================================================================== */}
      <section className="relative bg-[#0B1528] text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 overflow-hidden border-b border-white/10">
        {/* Subtle architectural engineering grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#0066FF]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <SequentialRevealGroup className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12" staggerDelay={100} duration={350} distance={6}>
            
            {/* Narrative & Heading */}
            <div className="max-w-2xl space-y-4 sm:space-y-5">
              {/* Refined Eyebrow */}
              <SequentialRevealItem index={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>{isAr ? 'شراكات وتوكيلات معتمدة في ليبيا' : 'Authorized Brand Partnerships in Libya'}</span>
              </SequentialRevealItem>

              {/* Exact Heading: Confident, Balanced, Refined Sizing */}
              <SequentialRevealItem index={1} as="h1" className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.25] text-white">
                {isAr ? 'علامات تجارية عالمية بمواصفات قياسية' : 'World-Class Electrical & Lighting Brands'}
              </SequentialRevealItem>

              {/* Business Description: Improved Line Length, Comfortable Line Height */}
              <SequentialRevealItem index={2} as="p" className="text-sm sm:text-[15px] lg:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
                {isAr
                  ? 'نحرص في شركة الإنارة الحديثة منذ عام 1988 على توريد كبرى العلامات العالمية والأوروبية والتركية الحاصلة على شهادات الجودة والأمان الدولية للمشاريع السكنية والتجارية.'
                  : 'Since 1988, Enarah Modern has partnered with top-tier global, European, and Turkish brands certified for maximum safety and performance in residential and commercial infrastructure.'}
              </SequentialRevealItem>

              {/* Trust Indicators */}
              <SequentialRevealItem index={3} className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs text-slate-300 font-normal">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{isAr ? 'منتجات أصلية 100%' : '100% Authentic Products'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{isAr ? 'مطابقة للمواصفات القياسية' : 'Standard Compliance Certified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{isAr ? 'توريد موثق في بنغازي وليبيا' : 'Benghazi & Libya Supply'}</span>
                </div>
              </SequentialRevealItem>
            </div>

            {/* Redesigned Statistics Panel: Compact Horizontal Composition, Clear Hierarchy, Subtle Separators */}
            <SequentialRevealItem index={4} className="w-full lg:w-auto shrink-0">
              <div className="bg-[#111C2E]/90 border border-white/10 rounded-2xl p-4 sm:p-5 lg:min-w-[360px] shadow-sm">
                <div className="text-[11px] text-blue-400 mb-3.5 pb-2.5 border-b border-white/10 flex items-center justify-between">
                  <span className={isAr ? "font-sans font-semibold tracking-normal" : "font-mono tracking-wider uppercase"}>
                    {isAr ? 'مؤشرات الشراكة والتوثيق' : 'PARTNERSHIP METRICS'}
                  </span>
                  <span className="text-slate-400 font-sans normal-case text-[11px] tabular-nums" dir="ltr">1988 — 2026</span>
                </div>

                <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/10 text-center">
                  {/* Metric 1: 14+ Brands */}
                  <StatReveal
                    value={14}
                    suffix="+"
                    delay={0}
                    label={isAr ? 'علامة معتمدة' : 'Brands'}
                    className="px-2 sm:px-3"
                    numberClassName="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans block"
                    labelClassName="text-xs text-slate-300 font-medium block mt-1"
                  />

                  {/* Metric 2: 38+ Years of Experience (Updated from 35+) */}
                  <StatReveal
                    value={38}
                    suffix="+"
                    delay={60}
                    label={isAr ? 'عاماً من الخبرة' : 'Years Experience'}
                    className="px-2 sm:px-3"
                    numberClassName="text-2xl sm:text-3xl font-bold text-blue-400 tracking-tight font-sans block"
                    labelClassName="text-xs text-slate-300 font-medium block mt-1"
                  />

                  {/* Metric 3: 100% Quality & Verification */}
                  <StatReveal
                    value={100}
                    suffix="%"
                    delay={120}
                    label={isAr ? 'جودة وتوثيق' : 'Verified Quality'}
                    className="px-2 sm:px-3"
                    numberClassName="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight font-sans block"
                    labelClassName="text-xs text-slate-300 font-medium block mt-1"
                  />
                </div>
              </div>
            </SequentialRevealItem>

          </SequentialRevealGroup>
        </div>
      </section>

      {/* =====================================================================
          02. Minimalist Brand Gallery & Refined Filter Bar
          ===================================================================== */}
      <main className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12">
        
        {/* Refined Horizontal Filter Navigation (Subtle blue underline & restrained count highlight) */}
        <div className="border-b border-slate-200 mb-8 sm:mb-10">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-px -mb-px">
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedFilter(tab.key as typeof selectedFilter)}
                  className={`group relative py-3 px-3.5 sm:px-5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 border-b-2 ${
                    isActive
                      ? 'border-[#0066FF] text-[#0B1528] font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#0066FF]/10 text-[#0066FF] font-semibold'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Brand Gallery Grid: Clean White Cards, Generous Spacing, Authentic Logos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBrands.map((b) => (
            <div
              key={b.id}
              onClick={() => setActiveBrandModal(b)}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-[#0066FF]/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              {/* Subtle top accent bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Logo Plinth: Clean surface with comfortable padding and restrained height */}
                <div className="h-28 sm:h-32 bg-[#F8FAFC] rounded-xl p-4 sm:p-5 flex items-center justify-center mb-4 group-hover:bg-slate-50 transition-colors border border-slate-100">
                  <img
                    src={b.logoUrl}
                    alt={b.name}
                    loading="lazy"
                    className="max-h-11 sm:max-h-12 w-auto max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>

                {/* Brand Header: Name & Origin */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                      {b.name}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {b.origin}
                    </span>
                  </div>

                  <p className="text-xs text-[#0066FF] font-semibold">
                    {isAr ? b.category : b.categoryEn}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 font-normal">
                  {isAr ? b.description : b.descriptionEn}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="group-hover:text-[#0066FF] transition-colors flex items-center gap-1">
                  <span>{isAr ? 'عرض التفاصيل والاستفسار' : 'View Details'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                {b.hasCatalogProducts && (
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {isAr ? 'متوفر بالكتالوج' : 'In Catalog'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 03. Project & Commercial Supply Banner */}
        <div className="mt-14 p-6 sm:p-8 bg-[#0B1528] text-white rounded-2xl border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
          {/* Subtle micro grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          
          <div className="relative max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-xs text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
              <span>{isAr ? 'توريد المشاريع والمقاولات الكبرى' : 'Bulk Project & Contractor Supply'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isAr ? 'هل تحتاج إلى كشف مقايسة أو توريد كميات تجارية لمشروعك؟' : 'Need Commercial Quotations or Bulk Electrical Supply?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {isAr
                ? 'فريقنا الهندسي في بنغازي جاهز لدراسة جداول الكميات والمواصفات وتقديم عروض أسعار تفصيلية لكافة المواد المعتمدة مع توفير الشحن والتسليم المباشر.'
                : 'Our technical sales team in Benghazi provides itemized Bill of Quantities (BOQ) quotations, fast logistics, and technical data sheets.'}
            </p>
          </div>

          <div className="relative flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/products"
              className="px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
            >
              {isAr ? 'تصفح كتالوج الأسلاك' : 'Wires Catalog'}
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold transition-colors shadow-xs"
            >
              {isAr ? 'تواصل مع المعرض' : 'Contact Showroom'}
            </Link>
          </div>
        </div>

      </main>

      {/* 04. Brand Detail Modal */}
      <AnimatePresence>
        {activeBrandModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveBrandModal(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden text-right"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <button
                onClick={() => setActiveBrandModal(null)}
                className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                aria-label={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Logo */}
              <div className="h-16 w-32 bg-[#F8FAFC] rounded-lg p-3 flex items-center justify-center mb-4 border border-slate-100">
                <img
                  src={activeBrandModal.logoUrl}
                  alt={activeBrandModal.name}
                  className="max-h-10 max-w-full object-contain"
                />
              </div>

              {/* Title & Origin */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    {activeBrandModal.name}
                  </h3>
                  <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                    {activeBrandModal.origin}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#0066FF] block">
                  {isAr ? activeBrandModal.category : activeBrandModal.categoryEn}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                {isAr ? activeBrandModal.description : activeBrandModal.descriptionEn}
              </p>

              {/* Modal Actions */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openWhatsAppInquiry(activeBrandModal)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'استفسار عن أصناف العلامة عبر واتساب' : 'Inquire via WhatsApp'}</span>
                </button>

                <div className="flex items-center gap-2">
                  {activeBrandModal.hasCatalogProducts ? (
                    <Link
                      to="/products"
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-center text-slate-800 transition-colors"
                      onClick={() => setActiveBrandModal(null)}
                    >
                      {isAr ? 'عرض منتجات الأسلاك المتوفرة' : 'View Wire Catalog'}
                    </Link>
                  ) : null}
                  <a
                    href="tel:+218916580068"
                    className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center shrink-0"
                    title={isAr ? 'اتصال هاتفي بالمعرض' : 'Call Showroom'}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
