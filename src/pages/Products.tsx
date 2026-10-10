import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, SlidersHorizontal, Check, ShieldCheck, 
  MessageCircle, Phone, ArrowLeft, ArrowUpRight, X, Layers, Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { VERIFIED_WIRES, type WireProduct } from '../data/wiresData'
import { useLanguage } from '../hooks/useLanguage'

export default function Products() {
  const { isAr } = useLanguage()

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [activeModalProduct, setActiveModalProduct] = useState<WireProduct | null>(null)

  // Filter Options
  const origins = [
    { id: 'all', label: isAr ? 'جميع المناشئ' : 'All Origins' },
    { id: 'italy', label: isAr ? 'إيطالي (Made in Italy)' : 'Italian' },
    { id: 'turkey', label: isAr ? 'تركي (TÜRK MALI)' : 'Turkish' }
  ]

  const types = [
    { id: 'all', label: isAr ? 'كافة الأنواع' : 'All Types' },
    { id: 'single', label: isAr ? 'سلك مفرد' : 'Single-Core' },
    { id: 'multi', label: isAr ? 'كابل متعدد القلوب' : 'Multi-Core' }
  ]

  const sizes = [
    { id: 'all', label: isAr ? 'كافة المقاسات' : 'All Sizes' },
    { id: '1.5', label: '1.5 مم' },
    { id: '2.5', label: '2.5 مم' },
    { id: '4.0', label: '4.0 مم' },
    { id: '6.0', label: '6.0 مم' },
    { id: '10.0', label: '10.0 مم' },
    { id: '16.0', label: '16.0 مم' },
    { id: '25.0', label: '25.0 مم' }
  ]

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return VERIFIED_WIRES.filter((wire) => {
      // Search
      const matchesSearch = 
        wire.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wire.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wire.size.includes(searchQuery) ||
        wire.applications.includes(searchQuery)

      // Origin
      const matchesOrigin = 
        selectedOrigin === 'all' ||
        (selectedOrigin === 'italy' && wire.origin.includes('إيطاليا')) ||
        (selectedOrigin === 'turkey' && wire.origin.includes('تركيا'))

      // Type
      const matchesType = 
        selectedType === 'all' ||
        (selectedType === 'single' && wire.type.includes('مفرد')) ||
        (selectedType === 'multi' && wire.type.includes('متعدد'))

      // Size
      const matchesSize = 
        selectedSize === 'all' || wire.size.includes(selectedSize)

      return matchesSearch && matchesOrigin && matchesType && matchesSize
    })
  }, [searchQuery, selectedOrigin, selectedType, selectedSize])

  const openWhatsAppInquiry = (wire: WireProduct) => {
    const text = isAr
      ? `السلام عليكم، أود الاستفسار عن توفر وسعر:\n- الصنف: ${wire.name}\n- المقاس: ${wire.size}\n- المنشأ: ${wire.origin}\n- العبوة: ${wire.packaging}\nيرجى تزويدي بالكميات المتاحة في فرع بنغازي.`
      : `Hello, I would like to inquire about the availability of ${wire.nameEn} (${wire.size}, ${wire.originEn}).`
    window.open(`https://wa.me/218916580068?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans pb-24">
      {/* 1. Page Hero: Architectural Clean Header */}
      <section className="relative pt-12 sm:pt-16 pb-12 sm:pb-16 border-b border-[#E7EAF0] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3 font-mono">
              CERTIFIED ELECTRICAL INFRASTRUCTURE
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#15191E] tracking-tight leading-tight mb-4">
              {isAr ? 'كتالوج الأسلاك والكوابل الإيطالية والتركية' : 'Certified Electrical Wires & Cables Catalog'}
            </h1>
            <p className="text-base sm:text-lg text-[#68717D] font-normal leading-relaxed">
              {isAr
                ? 'نوفر أفضل أنواع الأسلاك والكوابل الإيطالية والتركية الأصلية بنحاس نقي 100% وعزل حراري فائق الأمان، معتمدة للمشاريع السكنية والتجارية والصناعية ومطابقة لأعلى المواصفات القياسية الأوروبية.'
                : 'Premium certified Italian and Turkish electrical wires and cables with 100% electrolytic pure copper and flame-retardant insulation.'}
            </p>
          </div>

          {/* Quick Quality Indicators */}
          <div className="mt-8 pt-6 border-t border-[#F1F3F7] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-[#475569]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0062D2]" />
              <span>{isAr ? 'نحاس نقي 100%' : '100% Pure Copper'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#0062D2]" />
              <span>{isAr ? 'عزل حراري ضد الحريق' : 'Flame Retardant'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0062D2]" />
              <span>{isAr ? 'معتمد CE & TÜRK MALI' : 'CE Certified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0062D2]" />
              <span>{isAr ? 'متوفر بالمستودع مباشرة' : 'In Stock Benghazi'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search & Specification Filter Bar */}
      <section className="sticky top-[58px] z-30 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-[#E7EAF0] py-4 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#68717D] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث بالمقاس (مثال: 2.5 مم)، المنشأ، أو الاستخدام...' : 'Search by size (e.g. 2.5mm), origin...'}
                className="w-full bg-white border border-[#E7EAF0] rounded-full pr-10 pl-4 py-2.5 text-sm text-[#15191E] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0062D2] focus:ring-2 focus:ring-[#0062D2]/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Result Count */}
            <div className="text-xs font-medium text-[#68717D] self-center">
              {isAr ? `عرض ${filteredProducts.length} من أصل ${VERIFIED_WIRES.length} صنف معتمد` : `Showing ${filteredProducts.length} items`}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[#68717D] font-semibold me-2 hidden sm:inline-block">
              {isAr ? 'المنشأ:' : 'Origin:'}
            </span>
            {origins.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOrigin(o.id)}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                  selectedOrigin === o.id
                    ? 'bg-[#0062D2] text-white shadow-xs'
                    : 'bg-white border border-[#E7EAF0] text-[#475569] hover:bg-slate-50'
                }`}
              >
                {o.label}
              </button>
            ))}

            <span className="text-[#68717D] font-semibold mx-2 hidden sm:inline-block">|</span>
            <span className="text-[#68717D] font-semibold me-2 hidden sm:inline-block">
              {isAr ? 'المقاس:' : 'Size:'}
            </span>
            {sizes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSize(s.id)}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                  selectedSize === s.id
                    ? 'bg-[#0062D2] text-white shadow-xs'
                    : 'bg-white border border-[#E7EAF0] text-[#475569] hover:bg-slate-50'
                }`}
              >
                {s.label}
              </button>
            ))}

            {(selectedOrigin !== 'all' || selectedSize !== 'all' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedOrigin('all')
                  setSelectedSize('all')
                  setSelectedType('all')
                  setSearchQuery('')
                }}
                className="text-xs text-[#0062D2] hover:underline font-semibold ms-auto cursor-pointer"
              >
                {isAr ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Product Catalog Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E7EAF0] rounded-2xl p-12 text-center max-w-xl mx-auto my-12">
              <SlidersHorizontal className="w-10 h-10 text-[#94A3B8] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#15191E] mb-2">
                {isAr ? 'لم نجد أسلاك مطابقة لبحثك' : 'No matching wire products found'}
              </h3>
              <p className="text-sm text-[#68717D] mb-6">
                {isAr ? 'جرب البحث بمقاس مختلف أو إزالة الفلاتر المحددة.' : 'Try changing your search terms or filters.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedOrigin('all')
                  setSelectedSize('all')
                }}
                className="enarah-btn-secondary text-xs"
              >
                {isAr ? 'عرض جميع الأسلاك' : 'Show All Wires'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((wire) => (
                <div
                  key={wire.id}
                  className="bg-white border border-[#E7EAF0] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Image Presentation */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    <img
                      src={wire.image}
                      alt={wire.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="bg-white/95 backdrop-blur-md text-[#15191E] text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                        {wire.size}
                      </span>
                    </div>

                    <div className="absolute top-4 left-4">
                      <span className="bg-[#0062D2] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
                        {wire.origin.includes('إيطاليا') ? 'إيطالي معتمد' : 'تركي معتمد'}
                      </span>
                    </div>

                    {/* Packaging at bottom left */}
                    <div className="absolute bottom-3 left-4 text-xs font-medium text-white/90">
                      {wire.packaging}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-[#0062D2] font-mono tracking-wider">
                          {wire.type}
                        </span>
                        <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block animate-pulse" />
                          {isAr ? 'متوفر بالمخزن' : 'In Stock'}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-[#15191E] tracking-tight leading-snug mb-2 group-hover:text-[#0062D2] transition-colors">
                        {wire.name}
                      </h3>

                      <p className="text-xs text-[#68717D] line-clamp-2 leading-relaxed mb-4">
                        {wire.applications}
                      </p>

                      {/* Technical Specs List */}
                      <div className="space-y-1.5 text-xs text-[#475569] bg-[#F8FAFC] p-3 rounded-xl border border-[#EEF2F6] mb-5">
                        <div className="flex items-center justify-between">
                          <span className="text-[#68717D]">{isAr ? 'درجة النقاء:' : 'Copper:'}</span>
                          <span className="font-semibold text-[#15191E]">{wire.copperPurity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#68717D]">{isAr ? 'نوع العازل:' : 'Insulation:'}</span>
                          <span className="font-medium text-[#15191E]">{wire.insulation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-4 border-t border-[#F1F3F7] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-[#68717D] block leading-none mb-1">
                          {isAr ? 'السعر الرسمي' : 'Official Price'}
                        </span>
                        <div className="text-xl font-bold text-[#15191E] leading-none">
                          {wire.price} <span className="text-xs font-normal text-[#68717D]">د.ل / لفة</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveModalProduct(wire)}
                          className="p-2.5 rounded-full border border-[#E7EAF0] text-[#15191E] hover:bg-slate-50 transition-colors"
                          title={isAr ? 'عرض المواصفات الفنية' : 'View Specifications'}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openWhatsAppInquiry(wire)}
                          className="px-4 py-2.5 rounded-full bg-[#0062D2] text-white hover:bg-[#0047A5] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-98"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{isAr ? 'اطلب الآن' : 'Inquire'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Product Details Modal */}
      <AnimatePresence>
        {activeModalProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveModalProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7EAF0] relative overflow-hidden"
            >
              <button
                onClick={() => setActiveModalProduct(null)}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 text-[#68717D] hover:text-[#15191E] transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-semibold text-[#0062D2] font-mono tracking-widest uppercase block mb-1">
                  TECHNICAL SPECIFICATION SHEET
                </span>
                <h3 className="text-2xl font-bold text-[#15191E] tracking-tight">
                  {activeModalProduct.name}
                </h3>
                <span className="text-xs text-[#68717D] font-mono mt-0.5 block">
                  {activeModalProduct.nameEn}
                </span>
              </div>

              {/* Specs Table */}
              <div className="border border-[#E7EAF0] rounded-xl overflow-hidden text-sm mb-6 divide-y divide-[#E7EAF0]">
                <div className="grid grid-cols-3 p-3 bg-slate-50 font-semibold text-[#68717D] text-xs">
                  <span>المعيار</span>
                  <span className="col-span-2">المواصفة المعتمدة</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-[#68717D] text-xs">المقاس الاسمي:</span>
                  <span className="col-span-2 font-semibold text-[#15191E]">{activeModalProduct.size}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-[#68717D] text-xs">بلد المنشأ:</span>
                  <span className="col-span-2 font-medium text-[#15191E]">{activeModalProduct.origin}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-[#68717D] text-xs">نوع الموصل:</span>
                  <span className="col-span-2 font-medium text-[#15191E]">{activeModalProduct.copperPurity}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-[#68717D] text-xs">المواصفة العازلة:</span>
                  <span className="col-span-2 font-medium text-[#15191E]">{activeModalProduct.insulation}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-[#68717D] text-xs">طول اللفة:</span>
                  <span className="col-span-2 font-medium text-[#15191E]">{activeModalProduct.packaging}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-[#68717D] text-xs">السعر الحالي:</span>
                  <span className="col-span-2 font-bold text-[#0062D2]">{activeModalProduct.price} د.ل شامل الضريبة</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-[#68717D] text-xs">مجالات الاستخدام:</span>
                  <span className="col-span-2 text-xs text-[#475569] leading-relaxed">{activeModalProduct.applications}</span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openWhatsAppInquiry(activeModalProduct)}
                  className="flex-1 py-3 px-5 rounded-full bg-[#0062D2] hover:bg-[#0047A5] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>اطلب الآن عبر واتساب بنغازي</span>
                </button>
                <a
                  href="tel:+218916580068"
                  className="p-3 rounded-full border border-[#E7EAF0] text-[#15191E] hover:bg-slate-50 transition-colors"
                  title="اتصل بالمعرض"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Industrial Contractor Inquiry Banner */}
      <section className="mt-12">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="bg-[#101820] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2 font-mono">
                BULK CONTRACTOR SUPPLY
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-3">
                {isAr ? 'طلبات الكميات ومشاريع التأسيس الكبرى' : 'Bulk & Industrial Project Supply'}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {isAr
                  ? 'نوفر أسعاراً خاصة لشركات المقاولات والهندسة الكهربائية والفنيين مع توفير كشوفات مقايسة وتوصيل مباشر لموقع المشروع في بنغازي وكافة المدن الليبية.'
                  : 'Special wholesale rates and contractor pricing for verified electrical projects across Libya.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/wire-prices"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition-all"
              >
                {isAr ? 'جدول أسعار الأسلاك المحدث' : 'Wire Price Table'}
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-full bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs font-semibold transition-all shadow-sm"
              >
                {isAr ? 'طلب مقايسة فورية' : 'Request Quote'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
