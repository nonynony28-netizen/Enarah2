import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, ImagePlus, CheckCircle2, SlidersHorizontal } from 'lucide-react'

export interface EnarahProductItem {
  id: string
  titleAr: string
  titleEn: string
  categoryAr: string
  categoryEn: string
  descAr: string
  descEn: string
  image: string
  isPending?: boolean
  tagAr?: string
  tagEn?: string
}

export const ENARAH_PRODUCTS: EnarahProductItem[] = [
  {
    id: 'spotlights',
    titleAr: 'سبوتلايت بأشكاله المختلفة',
    titleEn: 'Diverse Architectural Spotlights',
    categoryAr: 'SPOTLIGHT',
    categoryEn: 'SPOTLIGHT',
    descAr: 'تشكيلات غاطسة وظاهرة بأحدث تقنيات LED وتصاميم هندسية عصرية تلبي متطلبات الديكور الراقي.',
    descEn: 'Recessed and surface-mounted modern LED designs for luxury interior spaces.',
    image: '/images/product-spotlights.png',
    tagAr: 'متوفر بمقاسات وأشكال متعددة',
    tagEn: 'Various shapes & sizes'
  },
  {
    id: 'cables',
    titleAr: 'كابلات وأسلاك التأسيس الكهربائي',
    titleEn: 'Electrical Foundation Cables & Wires',
    categoryAr: 'مواد تأسيس معتمدة',
    categoryEn: 'Foundation Materials',
    descAr: 'أسلاك نحاسية معتمدة ومقاومة للحرارة تلبي متطلبات المشاريع السكنية والتجارية بأعلى موثوقية.',
    descEn: 'Certified heat-resistant copper wires for residential and commercial projects.',
    image: '/images/cat-cables.jpg',
    tagAr: 'نحاس نقي معتمد',
    tagEn: 'Certified Pure Copper'
  },
  {
    id: 'switches',
    titleAr: 'المفاتيح والبريزات ومستلزمات التركيب',
    titleEn: 'Switches, Sockets & Fittings',
    categoryAr: 'تجهيزات ومفاتيح',
    categoryEn: 'Switches & Sockets',
    descAr: 'مستلزمات توصيل وقواطع آمنة ومفاتيح كهربائية عصرية تضمن سلامة المنشآت وسهولة الاستخدام.',
    descEn: 'Safe circuit accessories, breakers, and high-protection electrical fittings.',
    image: '/images/cat-ledprofile.jpg',
    tagAr: 'معايير أمان وحماية',
    tagEn: 'High Safety Standards'
  },
  {
    id: 'regulators',
    titleAr: 'منظمات الجهد الكهربائي',
    titleEn: 'Voltage Regulators & Stabilizers',
    categoryAr: 'تنظيم وحماية الجهد',
    categoryEn: 'Voltage Regulation',
    descAr: 'منظمات دقيقة لحماية الأجهزة الحساسة والمنشآت من تقلبات وانخفاض التيار الكهربائي المفاجئ.',
    descEn: 'Precision stabilizers safeguarding sensitive equipment from voltage fluctuations.',
    image: '/images/cat-spotlight.jpg',
    isPending: true,
    tagAr: 'في انتظار إدراج الصورة',
    tagEn: 'Awaiting Photo'
  },
  {
    id: 'chandeliers',
    titleAr: 'ثريات مودرن وإضاءات ديكورية',
    titleEn: 'Modern Chandeliers & Decor',
    categoryAr: 'ثريات فاخرة',
    categoryEn: 'Luxury Chandeliers',
    descAr: 'مجموعات راقية من الثريات الكريستالية والمودرن لإضفاء لمسة الفخامة على الصالونات والقاعات.',
    descEn: 'Exceptional modern & crystal chandelier collections for luxury halls and villas.',
    image: '/images/project-villa.jpg',
    isPending: true,
    tagAr: 'في انتظار إدراج الصورة',
    tagEn: 'Awaiting Photo'
  },
  {
    id: 'floodlights',
    titleAr: 'كشافات إنارة خارجية وصناعية',
    titleEn: 'Outdoor & Industrial Floodlights',
    categoryAr: 'كشافات وإضاءة خارجية',
    categoryEn: 'Floodlights & Industrial',
    descAr: 'كشافات LED عالية الكفاءة للملاعب والواجهات المعمارية والمستودعات مقاومة للعوامل الجوية.',
    descEn: 'High-power weather-resistant LED floodlights for facades, stadiums, and warehouses.',
    image: '/images/project-facade.jpg',
    isPending: true,
    tagAr: 'في انتظار إدراج الصورة',
    tagEn: 'Awaiting Photo'
  }
]

interface Props {
  isAr: boolean
  className?: string
}

export default function EnarahProductsCarousel({ isAr, className = '' }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    
    // In RTL vs LTR, scrollLeft can be negative or positive depending on browser implementation
    const maxScroll = scrollWidth - clientWidth
    const absScroll = Math.abs(scrollLeft)
    
    setCanScrollLeft(absScroll > 10)
    setCanScrollRight(absScroll < maxScroll - 10)
  }

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    updateScrollButtons()
    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    window.addEventListener('resize', updateScrollButtons)
    return () => {
      el.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [])

  const handleScroll = (direction: 'next' | 'prev') => {
    const el = scrollContainerRef.current
    if (!el) return
    const cardWidth = 320
    const scrollAmount = direction === 'next' ? (isAr ? -cardWidth : cardWidth) : (isAr ? cardWidth : -cardWidth)
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <div className={`relative ${className}`}>
      {/* شريط العنوان وأزرار التنقل العالمية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <span>{isAr ? 'منتجات وتصنيع شركة الإنارة' : 'ENARAH Manufacturing Lines'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isAr 
              ? 'تنوع شامل في خطوط الإنتاج والتوريد: سبوتلايت، منظمات جهد، ثريات، كشافات، وتجهيزات متكاملة'
              : 'Diverse manufacturing & supply lines: Spotlights, stabilizers, chandeliers, floodlights & wiring'}
          </p>
        </div>

        {/* أزرار التحكم الأفقية المستوحاة من المواقع العالمية */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full mr-2">
            <span>{isAr ? 'تصفح أفقي' : 'Horizontal View'}</span>
            <span className="text-[11px] text-blue-600">↔</span>
          </div>
          
          <button
            onClick={() => handleScroll('prev')}
            aria-label={isAr ? 'السابق' : 'Previous'}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 shadow-xs flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            {isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          <button
            onClick={() => handleScroll('next')}
            aria-label={isAr ? 'التالي' : 'Next'}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 shadow-xs flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            {isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* الشريط الأفقي للمنتجات - بدون إشغال مساحة رأسية كبيرة */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-none scroll-smooth select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ENARAH_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className={`w-[280px] sm:w-[320px] shrink-0 snap-start bg-white border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group ${
              product.isPending 
                ? 'border-slate-200/80 hover:border-blue-300 hover:shadow-md' 
                : 'border-slate-200 hover:border-blue-500 hover:shadow-xl shadow-xs hover:-translate-y-1'
            }`}
          >
            {/* حاوية الصورة الفاخرة بحجم كامل يملأ الإطار */}
            <div className="h-52 sm:h-60 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
              <img
                src={product.image}
                alt={isAr ? product.titleAr : product.titleEn}
                className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108 ${
                  product.isPending ? 'opacity-85 filter contrast-90' : ''
                }`}
                loading="lazy"
              />

              {/* شارة التصنيف العلوية الفاخرة المدمجة */}
              <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full shadow-sm border border-slate-200/80 flex items-center gap-1.5 z-10 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>{isAr ? product.categoryAr : product.categoryEn}</span>
              </div>

              {/* وسم حالة الصورة */}
              {product.isPending && (
                <div className="absolute bottom-2.5 left-2.5 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  {isAr ? 'في انتظار الصورة 📷' : 'Awaiting Photo 📷'}
                </div>
              )}
            </div>

            {/* تفاصيل المنتج البسيطة والراقية بدون حشو */}
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {isAr ? product.titleAr : product.titleEn}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {isAr ? product.descAr : product.descEn}
                </p>
              </div>

              {/* شريط الحالة السفلي */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isAr ? 'شركة الإنارة' : 'ENARAH'}</span>
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {isAr ? product.tagAr : product.tagEn}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* خانة مخصصة لإضافة أصناف وصور جديدة (بنفس المقاس الأفقي) */}
        <div className="w-[240px] sm:w-[270px] shrink-0 snap-start border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-6 bg-blue-50/20 hover:bg-blue-50/40 transition-all flex flex-col items-center justify-center text-center group min-h-[300px]">
          <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs mb-3 group-hover:scale-110 transition-transform">
            <ImagePlus className="w-6 h-6" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
            {isAr ? 'صنف أو صورة جديدة' : 'Add New Category'}
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
            {isAr ? 'مكان مجهز لإدراج أي صنف إضافي فور إرسال الصورة والعنوان.' : 'Ready for additional products and lines.'}
          </p>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            {isAr ? 'جاهز للإضافة فوراً' : 'Ready to add'}
          </span>
        </div>
      </div>
    </div>
  )
}
