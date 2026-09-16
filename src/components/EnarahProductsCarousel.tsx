import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, ImagePlus, SlidersHorizontal } from 'lucide-react'

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
    titleAr: 'سبوت لايت بأشكاله المختلفة',
    titleEn: 'Diverse Architectural Spotlights',
    categoryAr: 'سبوت لايت',
    categoryEn: 'Spotlight',
    descAr: 'تشكيلة معمارية راقية من السبوت لايت وأنظمة LED الموفرة، تشمل إطارات التثبيت الديكورية، الإضاءات الموجهة، والعدسات المانعة للتوهج بأعلى معايير الجودة.',
    descEn: 'ENARAH manufactures premium spotlights of all types to the highest standards, including advanced LED systems, modular frames, and directional anti-glare optics.',
    image: '/images/product-spotlights.png',
    tagAr: 'متوفر بمقاسات وأشكال متعددة',
    tagEn: 'Various shapes & sizes'
  },
  {
    id: 'led-profile',
    titleAr: 'عقود وسكك الليد بروفايل',
    titleEn: 'LED Strips & Profile Tracks',
    categoryAr: 'سكك وبروفايل',
    categoryEn: 'LED Profiles',
    descAr: 'حلول متكاملة من عقود الليد وسكك البروفايل المعمارية، تشمل شرائط LED عالية السطوع، مجاري ألمنيوم مصقولة، وكافة ملحقات وتوصيلات الإنارة الخطية المخفية.',
    descEn: 'ENARAH manufactures and supplies architectural LED strips and aluminum profiles to the highest standards, including diverse wattages, channels, and complete accessories.',
    image: '/images/product-led-profile.jpg',
    tagAr: 'إكسسوارات وسكك متكاملة',
    tagEn: 'Full Channels & Accessories'
  },
  {
    id: 'lighting-poles',
    titleAr: 'عمدان وأعمدة الإنارة بأشكالها وأطوالها',
    titleEn: 'Diverse Lighting Poles & Garden Bollards',
    categoryAr: 'عمدان وإنارة خارجية',
    categoryEn: 'Poles & Bollards',
    descAr: 'تشكيلة متكاملة من عمدان الإنارة للشوارع والحدائق والممرات، تتوفر بأنظمة LED مدمجة وخيارات اللمبات المتغيرة، بمقاسات متعددة وتصاميم هندسية وكلاسيكية مقاومة للعوامل الجوية.',
    descEn: 'A versatile range of street, garden, and pathway lighting poles, featuring integrated high-efficiency LED systems and replaceable lamp fixtures in modern and classic weather-resistant designs.',
    image: '/images/product-lighting-poles.jpg',
    tagAr: 'عمدان LED ولمبات متغيرة',
    tagEn: 'Integrated LED & Sockets'
  },
  {
    id: 'lanterns',
    titleAr: 'فوانيس الإنارة بأشكالها وتصاميمها المختلفة',
    titleEn: 'Diverse Outdoor & Architectural Lanterns',
    categoryAr: 'فوانيس وإنارة أسوار',
    categoryEn: 'Outdoor Lanterns',
    descAr: 'تشكيلة راقية من الفوانيس المعمارية والخارجية المقاومة للعوامل الجوية، تشمل الفوانيس الجدارية الكلاسيكية، الفوانيس المتدلية، إضاءات الأسوار والمداخل، ومصابيح الممرات بهياكل متينة وزجاج عالي النقاء.',
    descEn: 'A distinguished collection of weather-resistant outdoor lanterns and sconces, including classic wall fixtures, hanging pendants, pillar/post tops, and pathway bollards crafted with durable frames and premium glass.',
    image: '/images/product-outdoor-lanterns.jpg',
    tagAr: 'جدارية ومعلقة وأسوار وممرات',
    tagEn: 'Wall, Pendant, Post & Path'
  },
  {
    id: 'solar-lighting',
    titleAr: 'كشافات وإنارة الطاقة الشمسية',
    titleEn: 'Solar Floodlights & Outdoor Lighting',
    categoryAr: 'طاقة شمسية وإنارة',
    categoryEn: 'Solar Lighting',
    descAr: 'منظومة إنارة شمسية متكاملة تشمل كشافات الشوارع والملاعب، إضاءات الأسوار والحدائق بمستشعرات ذكية، كشافات العمل، وفوانيس وعقود الديكور بأعلى كفاءة تخزين ومقاومة للعوامل الجوية.',
    descEn: 'A comprehensive range of solar lighting solutions including street and flood lights, smart motion-sensor wall and garden lights, portable work fixtures, and decorative lanterns with high weather resistance.',
    image: '/images/product-solar-lighting.jpg',
    tagAr: 'كشافات شوارع وحدائق وديكور',
    tagEn: 'Street, Garden & Decor'
  },
  {
    id: 'floodlights',
    titleAr: 'كشافات الكهرباء بمختلف أشكالها واستخداماتها',
    titleEn: 'Electrical & Industrial Floodlights',
    categoryAr: 'كشافات كهربائية وملاعب',
    categoryEn: 'Electrical Floodlights',
    descAr: 'تشكيلة متكاملة من كشافات LED الكهربائية عالية القدرة والمقاومة للعوامل الجوية، تشمل كشافات الشوارع الإيروديناميكية، كشافات الملاعب والواجهات بنظام COB المركز، ومصابيح الهاي باي الصناعية.',
    descEn: 'High-power energy-efficient electrical LED floodlights for stadiums, architectural facades, and street illumination, featuring aerodynamic street fixtures, multi-lens COB optics, and robust industrial high-bays.',
    image: '/images/product-electrical-floodlights.jpg',
    tagAr: 'شوارع وملاعب وواجهات صناعية',
    tagEn: 'Street, Stadiums & Facades'
  },
  {
    id: 'regulators',
    titleAr: 'منظمات الجهد الكهربائي بأحجامها وقدراتها',
    titleEn: 'Automatic Voltage Regulators (1 to 10 KVA)',
    categoryAr: 'منظمات وحماية الجهد',
    categoryEn: 'Voltage Regulators',
    descAr: 'منظمات جهد أوتوماتيكية متطورة بقدرات تبدأ من 1 KVA حتى 10 KVA، مزودة بشاشات رقمية مزدوجة ومؤشرات حماية ذكية لتثبيت التيار وحماية الأجهزة من تذبذب وانخفاض الكهرباء.',
    descEn: 'Advanced automatic voltage regulators ranging from 1 KVA up to 10 KVA, featuring dual digital displays and intelligent protection circuits to stabilize power and safeguard equipment against voltage fluctuations.',
    image: '/images/product-voltage-regulators.jpg',
    tagAr: 'قدرات من 1KVA حتى 10KVA',
    tagEn: '1 KVA to 10 KVA Capacity'
  },
  {
    id: 'electrical-foundation',
    titleAr: 'مواد التأسيس الكهربائي',
    titleEn: 'Electrical Foundation Materials',
    categoryAr: 'تأسيس وتمديدات',
    categoryEn: 'Foundation Materials',
    descAr: 'منتجات التأسيس الكهربائي المعتمدة للمشاريع الإنشائية، تشمل علب الدفن، وبواطات التوزيع المتينة، والخراطيم المرنة ومستلزمات التثبيت المتكاملة بأعلى معايير الأمان.',
    descEn: 'ENARAH manufactures and supplies electrical foundation materials to the highest safety and durability standards, including flush boxes, junction boxes, flexible conduits, and complete fittings.',
    image: '/images/product-electrical-foundation.jpg',
    tagAr: 'علب وبواطات وتمديدات',
    tagEn: 'Boxes, Conduits & Fittings'
  },
  {
    id: 'sockets-switches',
    titleAr: 'البرائز والمفاتيح الكهربائية الديكورية بألوانها',
    titleEn: 'Architectural Wall Sockets & Switches',
    categoryAr: 'برائز ومفاتيح ديكورية',
    categoryEn: 'Sockets & Switches',
    descAr: 'تشكيلة فاخرة من البرائز والمفاتيح الكهربائية بتشطيبات راقية تشمل الذهبي والأسود والأبيض، متوفرة بمنافذ شحن USB وType-C سريعة، مفاتيح إنارة، ديمر مراوح، ومخارج دش وشبكات بأعلى معايير الأمان.',
    descEn: 'A luxury collection of architectural wall sockets and switches in gold, matte black, and pure white finishes, featuring fast USB & Type-C chargers, lighting switches, fan dimmers, and data ports.',
    image: '/images/product-sockets-switches.jpg',
    tagAr: 'ذهبي وأسود وأبيض مع USB وType-C',
    tagEn: 'Gold, Black & White | USB & Type-C'
  },
  {
    id: 'power-extensions',
    titleAr: 'المطولات الكهربائية بأشكالها المختلفة',
    titleEn: 'Diverse Power Strips & Cable Reels',
    categoryAr: 'مطولات وتوصيل',
    categoryEn: 'Extension Cords',
    descAr: 'مجموعة متطورة من المطولات الكهربائية وبكرات الكابلات الحرارية عالية التحمل، مزودة بقواطع أمان ذكية، منافذ USB، وحماية فائقة ضد زيادة الأحمال.',
    descEn: 'ENARAH manufactures and supplies a versatile line of power extensions, including standard strips, heavy-duty thermal cable reels, and models with USB ports and surge protection.',
    image: '/images/product-power-extensions.jpg',
    tagAr: 'حرارية وعادية وبكرات',
    tagEn: 'Thermal, Standard & Reels'
  },
  {
    id: 'exhaust-fans',
    titleAr: 'شفاطات التهوية بأشكالها وألوانها',
    titleEn: 'Ventilation & Exhaust Fans',
    categoryAr: 'تهوية وشفاطات',
    categoryEn: 'Ventilation Fans',
    descAr: 'شفاطات تهوية فائقة الكفاءة والهدوء بمقاسات متعددة وتصاميم جدارية ومدفونة (دكت)، متوفرة بتشطيبات عصرية وألوان خشبية فاخرة تناسب كافة الديكورات.',
    descEn: 'ENARAH manufactures and supplies a versatile line of ventilation fans, including wall-mounted and concealed inline duct models, in modern colors and wood finishes with quiet, high-efficiency performance.',
    image: '/images/product-exhaust-fans.jpg',
    tagAr: 'جدارية ومدفونة وتشطيب خشبي',
    tagEn: 'Wall, Duct & Wood Finish'
  },
  {
    id: 'breakers-protections',
    titleAr: 'مفاتيح الكهرباء والحمايات والقلابات',
    titleEn: 'Circuit Breakers, Protections & Changeovers',
    categoryAr: 'حماية وتحكم وقواطع',
    categoryEn: 'Breakers & Protections',
    descAr: 'منظومة متكاملة من قواطع التيار المعتمدة، مفاتيح العزل والقلابات، حمايات التسريب الأرضي ومانعات الصواعق، وكونتاكتورات التشغيل لضمان أعلى معايير الأمان الكهربائي.',
    descEn: 'An integrated system of certified circuit breakers, changeover isolators, residual current protections, surge arresters, and industrial contactors ensuring maximum electrical safety.',
    image: '/images/product-breakers-protections.jpg',
    tagAr: 'قواطع وحمايات وقلابات معتمدة',
    tagEn: 'Certified Breakers & Protections'
  },
  {
    id: 'cables',
    titleAr: 'كابلات وأسلاك التوصيل النحاسية',
    titleEn: 'Certified Copper Cables & Wires',
    categoryAr: 'كابلات معتمدة',
    categoryEn: 'Cables & Wires',
    descAr: 'أسلاك نحاسية معتمدة ومقاومة للحرارة تلبي متطلبات المشاريع السكنية والتجارية بأعلى موثوقية.',
    descEn: 'Certified heat-resistant copper wires for residential and commercial projects.',
    image: '/images/cat-cables.jpg',
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
  }
]

interface Props {
  isAr: boolean
  className?: string
}

export default function EnarahProductsCarousel({ isAr, className = '' }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<string>('lighting-poles')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    
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
    const cardStep = 340
    const scrollAmount = direction === 'next' ? (isAr ? -cardStep : cardStep) : (isAr ? cardStep : -cardStep)
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const scrollToProduct = (id: string) => {
    setActiveId(id)
    const el = document.getElementById(`enarah-product-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* شريط العنوان وأزرار التنقل العالمية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <span>{isAr ? 'منتجات وتصنيع شركة الإنارة' : 'ENARAH Manufacturing Lines'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isAr 
              ? 'صناعة وطنية وتوريد متكامل بأعلى معايير الجودة والمواصفات المعتمدة.'
              : 'National manufacturing and integrated supply complying with the highest quality standards.'}
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

      {/* أزرار الانتقال السريع للأصناف - تضمن ظهور كل منتج بضغطة زر */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
        {ENARAH_PRODUCTS.filter(p => !p.isPending).map((p) => {
          const isActive = activeId === p.id
          return (
            <button
              key={p.id}
              onClick={() => scrollToProduct(p.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/60'
              }`}
            >
              {p.id === 'lighting-poles' && <span>💡</span>}
              {p.id === 'lanterns' && <span>🏮</span>}
              {p.id === 'solar-lighting' && <span>☀️</span>}
              {p.id === 'floodlights' && <span>🏟️</span>}
              {p.id === 'sockets-switches' && <span>🔘</span>}
              {p.id === 'regulators' && <span>⚡</span>}
              <span>{isAr ? p.categoryAr : p.categoryEn}</span>
            </button>
          )
        })}
      </div>

      {/* الشريط الأفقي للمنتجات */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-none scroll-smooth select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ENARAH_PRODUCTS.map((product) => (
          <div
            key={product.id}
            id={`enarah-product-${product.id}`}
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

              {/* وسم حالة الصورة */}
              {product.isPending && (
                <div className="absolute bottom-2.5 left-2.5 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  {isAr ? 'في انتظار الصورة 📷' : 'Awaiting Photo 📷'}
                </div>
              )}
            </div>

            {/* تفاصيل المنتج البسيطة والراقية */}
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {isAr ? product.titleAr : product.titleEn}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 min-h-[52px]">
                  {isAr ? product.descAr : product.descEn}
                </p>
              </div>

              {/* شريط الحالة السفلي */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[10px] text-slate-400 font-medium">
                  {isAr ? product.categoryAr : product.categoryEn}
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/80">
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

      {/* مؤشرات التصفح السفلية (نقاط تفاعلية) */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {ENARAH_PRODUCTS.map((p) => (
          <button
            key={p.id}
            onClick={() => scrollToProduct(p.id)}
            title={isAr ? p.titleAr : p.titleEn}
            aria-label={`Go to ${p.titleAr}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              activeId === p.id 
                ? 'w-7 bg-blue-600' 
                : p.isPending 
                  ? 'w-2 bg-slate-200 hover:bg-slate-300' 
                  : 'w-2 bg-slate-300 hover:bg-blue-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
