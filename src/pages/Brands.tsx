import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Phone, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

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

export default function Brands() {
  const { isAr } = useLanguage()

  // Verified Brand Data (Preserved from existing records, flags removed for Swiss minimalism)
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans pb-20">
      
      {/* 01. Compact Minimal Introduction */}
      <section className="pt-10 sm:pt-14 pb-7 border-b border-[#E7EAF0] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#15191E] tracking-tight mb-1.5">
            {isAr ? 'العلامات التجارية' : 'Brands'}
          </h1>
          <p className="text-sm text-[#68717D]">
            {isAr ? 'نخبة من العلامات التجارية في عالم الكهرباء والإضاءة.' : 'Curated international brands in electrical and lighting systems.'}
          </p>
        </div>
      </section>

      {/* 02. Minimalist Gallery Content */}
      <main className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12">
        
        {/* Clean Filter Tabs (Section 08: Swiss Minimalist styling) */}
        <div className="flex items-center gap-2 pb-4 mb-8 overflow-x-auto scrollbar-none border-b border-[#E7EAF0]">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedFilter(tab.key as typeof selectedFilter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#15191E] text-white'
                    : 'bg-white text-[#68717D] border border-[#E7EAF0] hover:text-[#15191E] hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[11px] tabular-nums ${isActive ? 'text-slate-300' : 'text-[#94A3B8]'}`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* 03. Brand Gallery Grid (4 columns desktop, 3 tablet, 2 mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredBrands.map((b) => (
            <div
              key={b.id}
              onClick={() => setActiveBrandModal(b)}
              className="bg-white border border-[#E7EAF0] rounded-xl p-4 sm:p-5 hover:border-[#CBD5E1] transition-colors duration-200 flex flex-col justify-between group cursor-pointer"
            >
              {/* Logo Area (object-contain, normalized scale, authentic aspect ratio) */}
              <div className="aspect-[16/10] bg-[#F8FAFC] rounded-lg p-4 flex items-center justify-center mb-3.5 group-hover:bg-slate-50 transition-colors">
                <img
                  src={b.logoUrl}
                  alt={b.name}
                  loading="lazy"
                  className="max-h-11 w-auto max-w-[85%] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>

              {/* Brand Meta */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#F1F3F7]">
                <div>
                  <h3 className="text-sm font-semibold text-[#15191E] leading-snug">
                    {b.name}
                  </h3>
                  <span className="text-[11px] text-[#68717D] block">
                    {b.origin}
                  </span>
                </div>

                <span className="text-xs text-[#0062D2] opacity-0 group-hover:opacity-100 transition-opacity p-1" title={isAr ? 'عرض التفاصيل' : 'Details'}>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 04. Neutral Quiet Inquiry Section (Section 10: Zero unsupported claims) */}
        <div className="mt-14 pt-8 border-t border-[#E7EAF0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="max-w-xl">
            <h2 className="text-sm sm:text-base font-semibold text-[#15191E] mb-1">
              {isAr ? 'توريد منتجات العلامات للمشاريع والمقاولات' : 'Project & Commercial Supply'}
            </h2>
            <p className="text-xs text-[#68717D] leading-relaxed">
              {isAr
                ? 'نوفر كشوفات مقايسة وتوريد مباشر لكافة المواد والمعدات الكهربائية المعتمدة للمشاريع في بنغازي وكافة المدن الليبية.'
                : 'Direct commercial supply and quotations for certified electrical infrastructure across Libya.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/products"
              className="px-4 py-2 rounded-lg border border-[#E7EAF0] hover:bg-slate-50 text-xs font-medium text-[#15191E] transition-colors"
            >
              {isAr ? 'كتالوج الأسلاك' : 'Wires Catalog'}
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 rounded-lg bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs font-medium transition-colors"
            >
              {isAr ? 'تواصل مع المعرض' : 'Contact Showroom'}
            </Link>
          </div>
        </div>

      </main>

      {/* 05. Brand Detail Sheet / Modal (Preserving 100% of data without cluttering gallery) */}
      <AnimatePresence>
        {activeBrandModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveBrandModal(null)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-[#E7EAF0] relative overflow-hidden text-right"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <button
                onClick={() => setActiveBrandModal(null)}
                className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-slate-100 text-[#68717D] hover:text-[#15191E] transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Logo */}
              <div className="h-16 w-32 bg-[#F8FAFC] rounded-lg p-3 flex items-center justify-center mb-4">
                <img
                  src={activeBrandModal.logoUrl}
                  alt={activeBrandModal.name}
                  className="max-h-10 max-w-full object-contain"
                />
              </div>

              {/* Title & Origin */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-[#15191E]">
                    {activeBrandModal.name}
                  </h3>
                  <span className="text-xs text-[#68717D] bg-slate-100 px-2 py-0.5 rounded-md">
                    {activeBrandModal.origin}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#0062D2] block">
                  {isAr ? activeBrandModal.category : activeBrandModal.categoryEn}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                {isAr ? activeBrandModal.description : activeBrandModal.descriptionEn}
              </p>

              {/* Modal Actions */}
              <div className="space-y-2 pt-4 border-t border-[#F1F3F7]">
                <button
                  onClick={() => openWhatsAppInquiry(activeBrandModal)}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'استفسار عن أصناف العلامة عبر واتساب' : 'Inquire via WhatsApp'}</span>
                </button>

                <div className="flex items-center gap-2">
                  {activeBrandModal.hasCatalogProducts ? (
                    <Link
                      to="/products"
                      className="flex-1 py-2 px-3 rounded-lg border border-[#E7EAF0] hover:bg-slate-50 text-xs font-medium text-center text-[#15191E] transition-colors"
                      onClick={() => setActiveBrandModal(null)}
                    >
                      {isAr ? 'عرض منتجات الأسلاك المتوفرة' : 'View Wire Catalog'}
                    </Link>
                  ) : null}
                  <a
                    href="tel:+218916580068"
                    className="p-2 rounded-lg border border-[#E7EAF0] text-[#15191E] hover:bg-slate-50 transition-colors flex items-center justify-center shrink-0"
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
