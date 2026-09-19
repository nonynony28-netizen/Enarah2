import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'

export type ProductGroup = 'all' | 'indoor' | 'outdoor' | 'electrical' | 'appliances'

export interface EnarahProductItem {
  id: string
  group: 'indoor' | 'outdoor' | 'electrical' | 'appliances'
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
    id: 'chandeliers',
    group: 'indoor',
    titleAr: 'ثريات مودرن وكريستال وإضاءات ديكورية',
    titleEn: 'Luxury Modern & Crystal Chandeliers',
    categoryAr: 'ثريات فاخرة وديكورية',
    categoryEn: 'Luxury Chandeliers',
    descAr: 'مجموعات استثنائية من الثريات الكريستالية والمودرن المعلقة، تشمل تصاميم الحلقات الذهبية الذكية، الثريات الكريستالية متدرجة الطبقات، والتصاميم الريفية والكروية لإضفاء الفخامة على القصور والصالونات.',
    descEn: 'An exceptional collection of luxury crystal and modern chandeliers, featuring multi-tiered gold crystal fixtures, geometric LED rings, spherical sputnik designs, and classic pendants for villas and grand halls.',
    image: '/images/product-chandeliers.jpg',
    tagAr: 'كريستال ومودرن وحلقات ذهبية',
    tagEn: 'Crystal, Modern & Gold Rings'
  },
  {
    id: 'spotlights',
    group: 'indoor',
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
    group: 'indoor',
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
    id: 'led-bulbs',
    group: 'indoor',
    titleAr: 'لمبات الإنارة بمختلف أشكالها واستخداماتها',
    titleEn: 'Diverse LED Bulbs & Light Sources',
    categoryAr: 'لمبات ومصادر إضاءة',
    categoryEn: 'LED Bulbs & Lamps',
    descAr: 'تشكيلة متكاملة من لمبات LED الموفرة للطاقة بمختلف القواعد والقدرات، تشمل لمبات الشمعة الديكورية للثريات، لمبات الفيلامنت الكلاسيكية، لمبات T-Bulb عالية السطوع، ومصابيح السبوت العاكسة بعمر تشغيلي طويل.',
    descEn: 'A comprehensive range of energy-saving LED bulbs across diverse wattages and bases, including decorative candle bulbs for chandeliers, vintage filament lamps, high-lumen T-bulbs, and reflector spotlights.',
    image: '/images/product-led-bulbs.jpg',
    tagAr: 'شمعة وفيلامنت وT-Bulb وسبوت',
    tagEn: 'Candle, Filament, T-Bulb & Spot'
  },
  {
    id: 'lighting-poles',
    group: 'outdoor',
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
    group: 'outdoor',
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
    id: 'wall-lights',
    group: 'outdoor',
    titleAr: 'الإضاءات الجانبية والأبليكات الجدارية',
    titleEn: 'Architectural Wall Lights & Sconces',
    categoryAr: 'إضاءات جانبية وأبليكات',
    categoryEn: 'Wall Lights & Sconces',
    descAr: 'تشكيلة معمارية واسعة من الإضاءات الجانبية والأبليكات المقاومة للعوامل الجوية، تشمل كشافات الإضاءة المزدوجة (Up & Down)، إضاءات الدرج والممرات المدفونة، والأبليكات الديكورية المودرن للواجهات والمساحات الداخلية.',
    descEn: 'A versatile architectural collection of weather-resistant wall lights and sconces, featuring bi-directional up & down fixtures, recessed step and pathway lights, and contemporary decorative facade sconces.',
    image: '/images/product-wall-lights.png',
    tagAr: 'إضاءة مزدوجة Up&Down وإضاءات درج',
    tagEn: 'Up & Down, Step & Facade Sconces'
  },
  {
    id: 'solar-lighting',
    group: 'outdoor',
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
    group: 'outdoor',
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
    id: 'electrical-foundation',
    group: 'electrical',
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
    group: 'electrical',
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
    id: 'breakers-protections',
    group: 'electrical',
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
    group: 'electrical',
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
    id: 'regulators',
    group: 'appliances',
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
    id: 'power-extensions',
    group: 'appliances',
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
    group: 'appliances',
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
    id: 'insect-killers',
    group: 'appliances',
    titleAr: 'صواعق الحشرات والناموس الكهربائية بأحجامها',
    titleEn: 'Electric Insect Killers & Pest Zappers',
    categoryAr: 'صواعق حشرات كهربائية',
    categoryEn: 'Insect Killers',
    descAr: 'صواعق كهربائية متطورة لمكافحة الحشرات والناموس بأربعة أحجام ومقاسات متنوعة، مزودة بأنابيب UV جاذبة مزدوجة، شبكة صعق عالية الكفاءة مع شبك أمان خارجي، وصينية تجميع سفلية سهلة التنظيف.',
    descEn: 'Heavy-duty electric insect and mosquito killers available in four versatile sizes, featuring dual high-efficiency UV attractant tubes, high-voltage electrocution grids with protective mesh, and removable collection trays.',
    image: '/images/product-insect-killers.jpg',
    tagAr: '4 أحجام وأنابيب UV وشبك أمان',
    tagEn: '4 Sizes, Dual UV Tubes & Safety Mesh'
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

  const displayedProducts = ENARAH_PRODUCTS

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
  }, [displayedProducts.length])

  const handleScroll = (direction: 'next' | 'prev') => {
    const el = scrollContainerRef.current
    if (!el) return
    const cardStep = 260
    const scrollAmount = direction === 'next' ? (isAr ? -cardStep : cardStep) : (isAr ? cardStep : -cardStep)
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <section className={`relative bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs ${className}`}>
      {/* شريط العنوان المنسق وأزرار التصفح */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/80">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {isAr ? 'منتجات وتصنيع شركة الإنارة' : 'ENARAH Manufacturing Lines'}
            </h3>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/80 shadow-2xs">
              {isAr ? 'أكثر من 17 صنف' : '17+ Categories'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {isAr 
              ? 'صناعة وطنية وتوريد متكامل بأعلى معايير الجودة والمواصفات المعتمدة.'
              : 'National manufacturing and integrated supply complying with the highest quality standards.'}
          </p>
        </div>

        {/* أزرار الأسهم المصغرة والأنيقة */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => handleScroll('prev')}
            aria-label={isAr ? 'السابق' : 'Previous'}
            disabled={!canScrollLeft}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              canScrollLeft
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 shadow-xs active:scale-95'
                : 'bg-slate-50 border-slate-200/50 text-slate-300 cursor-not-allowed'
            }`}
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleScroll('next')}
            aria-label={isAr ? 'التالي' : 'Next'}
            disabled={!canScrollRight}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              canScrollRight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 shadow-xs active:scale-95'
                : 'bg-slate-50 border-slate-200/50 text-slate-300 cursor-not-allowed'
            }`}
          >
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* شريط البطاقات الأفقي المصغر والمريح للعين (حجم مثالي ومدروس) */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-3.5 overflow-x-auto pb-2 pt-1 px-0.5 snap-x snap-mandatory scroll-smooth select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            id={`enarah-product-${product.id}`}
            className={`w-[220px] sm:w-[245px] shrink-0 snap-start bg-white border rounded-xl overflow-hidden transition-all duration-300 flex flex-col group ${
              product.isPending 
                ? 'border-slate-200/80 hover:border-blue-300' 
                : 'border-slate-200 hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            {/* إطار الصورة المدمج والأنيق بارتفاع مريح (144px-160px) */}
            <div className="h-36 sm:h-40 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
              <img
                src={product.image}
                alt={isAr ? product.titleAr : product.titleEn}
                className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
                  product.isPending ? 'opacity-85 filter contrast-90' : ''
                }`}
                loading="lazy"
              />

              {product.isPending && (
                <div className="absolute bottom-2 left-2 bg-amber-500/95 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  {isAr ? 'قريباً 📷' : 'Coming Soon'}
                </div>
              )}
            </div>

            {/* محتوى البطاقة المنسق بحجم خطوط مريح وغير عشوائي */}
            <div className="p-3 sm:p-3.5 flex flex-col flex-grow justify-start">
              <span className="text-[10px] font-bold text-blue-600 tracking-wide block mb-1">
                {isAr ? product.categoryAr : product.categoryEn}
              </span>
              <h4 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                {isAr ? product.titleAr : product.titleEn}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mt-1">
                {isAr ? product.descAr : product.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
