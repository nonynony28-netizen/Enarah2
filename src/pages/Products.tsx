import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpRight,
  MessageCircle,
  Phone,
  Check
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { VERIFIED_WIRES, type WireProduct } from '../data/wiresData'
import { useLanguage } from '../hooks/useLanguage'

export default function Products() {
  const { isAr } = useLanguage()

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('default')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [activeModalProduct, setActiveModalProduct] = useState<WireProduct | null>(null)

  // Filter Options derived from real data
  const origins = [
    { id: 'all', label: isAr ? 'جميع المناشئ' : 'All Origins' },
    { id: 'italy', label: isAr ? 'إيطاليا' : 'Italy' },
    { id: 'turkey', label: isAr ? 'تركيا' : 'Turkey' }
  ]

  const sizes = [
    { id: 'all', label: isAr ? 'كافة المقاسات' : 'All Sizes' },
    { id: '1.5', label: '1.5 مم' },
    { id: '2.5', label: '2.5 مم' },
    { id: '4.0', label: '4.0 مم' },
    { id: '6.0', label: '6.0 مم' },
    { id: '10.0', label: '10.0 مم' },
    { id: '16.0', label: '16.0 مم' },
    { id: '25.0', label: '25.0 مم' },
    { id: '3×2.5', label: '3×2.5 مم' },
    { id: '3×4.0', label: '3×4.0 مم' }
  ]

  const sortOptions = [
    { id: 'default', label: isAr ? 'الترتيب الافتراضي' : 'Default Order' },
    { id: 'price-asc', label: isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' },
    { id: 'price-desc', label: isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' },
    { id: 'size-asc', label: isAr ? 'المقاس: تصاعدي' : 'Size: Smallest First' }
  ]

  const isFiltered = selectedOrigin !== 'all' || selectedSize !== 'all' || searchQuery.trim() !== '' || sortBy !== 'default'

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedOrigin('all')
    setSelectedSize('all')
    setSortBy('default')
  }

  // Active filters count for mobile indicator
  const activeFiltersCount = (selectedOrigin !== 'all' ? 1 : 0) + (selectedSize !== 'all' ? 1 : 0) + (sortBy !== 'default' ? 1 : 0)

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    const list = VERIFIED_WIRES.filter((wire) => {
      // Search
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        wire.name.toLowerCase().includes(query) ||
        wire.nameEn.toLowerCase().includes(query) ||
        wire.size.toLowerCase().includes(query) ||
        wire.origin.toLowerCase().includes(query)

      // Origin
      const matchesOrigin =
        selectedOrigin === 'all' ||
        (selectedOrigin === 'italy' && wire.origin.includes('إيطاليا')) ||
        (selectedOrigin === 'turkey' && wire.origin.includes('تركيا'))

      // Size
      const matchesSize =
        selectedSize === 'all' || wire.size.includes(selectedSize)

      return matchesSearch && matchesOrigin && matchesSize
    })

    // Sort
    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price)
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price)
    }
    if (sortBy === 'size-asc') {
      return [...list].sort((a, b) => a.sizeNumeric - b.sizeNumeric)
    }
    return list
  }, [searchQuery, selectedOrigin, selectedSize, sortBy])

  // Family Variants: for quick switching among Italian single-core wires
  const italianSingleCoreFamily = useMemo(() => {
    return VERIFIED_WIRES.filter((w) => w.id.startsWith('wire-') && w.origin.includes('إيطاليا'))
  }, [])

  const openWhatsAppInquiry = (wire: WireProduct) => {
    const text = isAr
      ? `السلام عليكم، أود الاستفسار عن توفر وطلب:\n- الصنف: ${wire.name}\n- المقاس: ${wire.size}\n- المنشأ: ${wire.origin}\n- العبوة: ${wire.packaging}\n- السعر: ${wire.price} د.ل\nيرجى تزويدي بإمكانية الاستلام من فرع بنغازي (الليثي).`
      : `Hello, I would like to inquire about the availability of ${wire.nameEn} (${wire.size}, ${wire.originEn}).`
    window.open(`https://wa.me/218916580068?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Prevent body scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileFilterOpen])

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans pb-20">
      
      {/* 01. Compact Minimal Introduction ("Quiet Precision") */}
      <section className="pt-10 sm:pt-14 pb-7 border-b border-[#E7EAF0] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#15191E] tracking-tight mb-1.5">
            {isAr ? 'الأسلاك والكابلات' : 'Wires & Cables'}
          </h1>
          <p className="text-sm text-[#68717D]">
            {isAr ? 'تصفح الأسلاك والكابلات المتوفرة لدينا.' : 'Browse our available certified wires and cables.'}
          </p>
        </div>
      </section>

      {/* 02. Unified Minimalist Toolbar */}
      <section className="sticky top-[58px] z-30 bg-white/95 backdrop-blur-md border-b border-[#E7EAF0] py-3.5 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* Desktop Toolbar: [ Search Field ] [ Origin ] [ Size ] [ Sort ] */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Field (Takes largest width) */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث بالاسم أو المقاس (مثال: 2.5 مم)...' : 'Search wires by size or name...'}
                className="w-full bg-[#F8FAFC] border border-[#E7EAF0] rounded-lg pr-9 pl-9 py-2 text-sm text-[#15191E] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#0062D2] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="مسح البحث"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Origin Dropdown */}
            <div className="relative min-w-[140px]">
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full appearance-none bg-[#F8FAFC] border border-[#E7EAF0] rounded-lg px-3 py-2 pr-3 pl-8 text-xs font-medium text-[#15191E] hover:bg-slate-100/70 focus:outline-none focus:border-[#0062D2] cursor-pointer transition-colors"
                aria-label="تصفية حسب المنشأ"
              >
                {origins.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Size Dropdown */}
            <div className="relative min-w-[140px]">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full appearance-none bg-[#F8FAFC] border border-[#E7EAF0] rounded-lg px-3 py-2 pr-3 pl-8 text-xs font-medium text-[#15191E] hover:bg-slate-100/70 focus:outline-none focus:border-[#0062D2] cursor-pointer transition-colors"
                aria-label="تصفية حسب المقاس"
              >
                {sizes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[160px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-[#F8FAFC] border border-[#E7EAF0] rounded-lg px-3 py-2 pr-3 pl-8 text-xs font-medium text-[#15191E] hover:bg-slate-100/70 focus:outline-none focus:border-[#0062D2] cursor-pointer transition-colors"
                aria-label="ترتيب النتائج"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset Button (Only when filtered) */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#0062D2] hover:text-[#0047A5] font-medium px-2 py-1.5 whitespace-nowrap cursor-pointer transition-colors"
              >
                {isAr ? 'إعادة ضبط' : 'Reset'}
              </button>
            )}

            {/* Count Indicator */}
            <span className="text-xs text-[#68717D] ms-auto whitespace-nowrap tabular-nums">
              {filteredProducts.length} {isAr ? 'صنف' : 'items'}
            </span>
          </div>

          {/* Mobile Toolbar: Search + Filter Button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث بالاسم أو المقاس...' : 'Search wires...'}
                className="w-full bg-[#F8FAFC] border border-[#E7EAF0] rounded-lg pr-9 pl-8 py-2 text-sm text-[#15191E] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#0062D2]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label="مسح"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors shrink-0 ${
                activeFiltersCount > 0
                  ? 'bg-blue-50 border-[#0062D2] text-[#0062D2]'
                  : 'bg-[#F8FAFC] border-[#E7EAF0] text-[#15191E]'
              }`}
              aria-label="فتح التصفية"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isAr ? 'تصفية' : 'Filter'}</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0062D2] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 03. Product Grid ("Quiet Precision") */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E7EAF0] rounded-xl p-10 text-center max-w-md mx-auto my-12">
              <p className="text-sm font-medium text-[#15191E] mb-2">
                {isAr ? 'لا توجد أسلاك مطابقة لمعايير البحث' : 'No matching wire products found'}
              </p>
              <p className="text-xs text-[#68717D] mb-5">
                {isAr ? 'جرب تغيير مقاس السلك أو إزالة الفلاتر المحددة.' : 'Try adjusting your search terms or filters.'}
              </p>
              <button
                onClick={resetFilters}
                className="text-xs font-medium text-[#0062D2] border border-[#E7EAF0] px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {isAr ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredProducts.map((wire) => (
                <div
                  key={wire.id}
                  className="bg-white border border-[#E7EAF0] rounded-xl p-5 hover:border-[#CBD5E1] transition-colors duration-200 flex flex-col justify-between group"
                >
                  {/* 1. Product Image Container */}
                  <div className="relative aspect-[4/3] bg-[#F8FAFC] rounded-lg overflow-hidden mb-4 flex items-center justify-center p-3">
                    <img
                      src={wire.image}
                      alt={wire.name}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* 2. Product Name & Meta */}
                  <div className="flex-1 flex flex-col">
                    {/* Size & Origin Header */}
                    <div className="flex items-center justify-between text-xs text-[#68717D] mb-1.5">
                      <span className="font-semibold text-[#0062D2] text-sm tabular-nums">
                        {wire.size}
                      </span>
                      <span className="text-[11px] text-[#68717D]">
                        {wire.origin.includes('إيطاليا') ? 'إيطاليا 🇮🇹' : 'تركيا 🇹🇷'}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-semibold text-[#15191E] leading-snug mb-4">
                      {wire.name}
                    </h3>

                    {/* 3. Price & Details Action */}
                    <div className="mt-auto pt-3 border-t border-[#F1F3F7] flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-[#15191E] leading-tight tabular-nums">
                          {wire.price} <span className="text-xs font-normal text-[#68717D]">د.ل</span>
                        </div>
                        <span className="text-[11px] text-[#68717D] block">
                          {wire.packaging}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveModalProduct(wire)}
                          className="text-xs font-medium text-[#15191E] hover:text-[#0062D2] px-3 py-1.5 rounded-lg border border-[#E7EAF0] hover:border-[#0062D2]/30 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          {isAr ? 'المواصفات' : 'Details'}
                        </button>
                        <button
                          onClick={() => openWhatsAppInquiry(wire)}
                          className="text-xs font-medium bg-[#0062D2] text-white hover:bg-[#0047A5] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          title={isAr ? 'طلب السلك عبر واتساب' : 'Inquire via WhatsApp'}
                        >
                          {isAr ? 'طلب' : 'Order'}
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

      {/* 04. Technical Specifications Modal */}
      <AnimatePresence>
        {activeModalProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveModalProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-[#E7EAF0] relative overflow-hidden text-right"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <button
                onClick={() => setActiveModalProduct(null)}
                className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-slate-100 text-[#68717D] hover:text-[#15191E] transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <span className="text-xs font-semibold text-[#0062D2] block mb-1">
                  {activeModalProduct.origin}
                </span>
                <h3 className="text-xl font-bold text-[#15191E] tracking-tight">
                  {activeModalProduct.name}
                </h3>
              </div>

              {/* Compatible Size Family Variant Switcher (Section 10) */}
              {activeModalProduct.origin.includes('إيطاليا') && (
                <div className="mb-4 pb-3 border-b border-[#F1F3F7]">
                  <span className="text-xs text-[#68717D] block mb-2 font-medium">
                    {isAr ? 'المقاسات المتوفرة في هذه السلسلة:' : 'Available sizes in this series:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {italianSingleCoreFamily.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setActiveModalProduct(variant)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                          variant.id === activeModalProduct.id
                            ? 'bg-[#0062D2] text-white'
                            : 'bg-[#F8FAFC] text-[#475569] hover:bg-slate-100 border border-[#E7EAF0]'
                        }`}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clean Minimal Specifications Table */}
              <div className="border border-[#E7EAF0] rounded-xl overflow-hidden text-xs mb-5 divide-y divide-[#E7EAF0]">
                <div className="flex items-center justify-between p-2.5 bg-slate-50/50">
                  <span className="text-[#68717D]">{isAr ? 'المقاس الاسمي:' : 'Nominal Size:'}</span>
                  <span className="font-semibold text-[#15191E]">{activeModalProduct.size}</span>
                </div>
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-[#68717D]">{isAr ? 'بلد المنشأ:' : 'Origin:'}</span>
                  <span className="font-medium text-[#15191E]">{activeModalProduct.origin}</span>
                </div>
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-[#68717D]">{isAr ? 'مادة الموصل:' : 'Conductor:'}</span>
                  <span className="font-medium text-[#15191E]">{activeModalProduct.copperPurity}</span>
                </div>
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-[#68717D]">{isAr ? 'مواصفة العزل:' : 'Insulation:'}</span>
                  <span className="font-medium text-[#15191E]">{activeModalProduct.insulation}</span>
                </div>
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-[#68717D]">{isAr ? 'طول اللفة:' : 'Packaging:'}</span>
                  <span className="font-medium text-[#15191E]">{activeModalProduct.packaging}</span>
                </div>
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-[#68717D]">{isAr ? 'السعر الرسمي:' : 'Official Price:'}</span>
                  <span className="font-bold text-[#0062D2] text-sm tabular-nums">
                    {activeModalProduct.price} د.ل
                  </span>
                </div>
                <div className="p-2.5">
                  <span className="text-[#68717D] block mb-1">{isAr ? 'مجالات الاستخدام:' : 'Applications:'}</span>
                  <p className="text-slate-700 leading-relaxed font-normal">
                    {activeModalProduct.applications}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openWhatsAppInquiry(activeModalProduct)}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'طلب تسعيرة عبر واتساب بنغازي' : 'Inquire via WhatsApp'}</span>
                </button>
                <a
                  href="tel:+218916580068"
                  className="p-2.5 rounded-lg border border-[#E7EAF0] text-[#15191E] hover:bg-slate-50 transition-colors"
                  title="اتصال هاتفي بالمعرض"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 05. Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-[120] overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: isAr ? 340 : -340 }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? 340 : -340 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`fixed inset-y-0 ${isAr ? 'right-0' : 'left-0'} z-[130] w-full max-w-[320px] bg-white p-5 sm:p-6 flex flex-col justify-between overflow-y-auto shadow-2xl`}
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <div>
                <div className="sticky top-0 bg-white flex items-center justify-between pb-3.5 border-b border-[#E7EAF0] mb-4 z-10">
                  <h3 className="text-base font-semibold text-[#15191E]">
                    {isAr ? 'تصفية الأسلاك والكابلات' : 'Filter Wires'}
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                    aria-label="إغلاق"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Origin Filter */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-[#15191E] block mb-2">
                    {isAr ? 'بلد المنشأ' : 'Origin'}
                  </label>
                  <div className="space-y-1">
                    {origins.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setSelectedOrigin(o.id)}
                        className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                          selectedOrigin === o.id
                            ? 'bg-blue-50 text-[#0062D2]'
                            : 'hover:bg-slate-50 text-[#475569]'
                        }`}
                      >
                        <span>{o.label}</span>
                        {selectedOrigin === o.id && <Check className="w-3.5 h-3.5 text-[#0062D2]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-[#15191E] block mb-2">
                    {isAr ? 'المقاس' : 'Size'}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {sizes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(s.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${
                          selectedSize === s.id
                            ? 'bg-[#0062D2] text-white border-[#0062D2]'
                            : 'bg-white text-[#475569] border-[#E7EAF0] hover:bg-slate-50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Option */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-[#15191E] block mb-2">
                    {isAr ? 'الترتيب' : 'Sort By'}
                  </label>
                  <div className="space-y-1">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSortBy(opt.id)}
                        className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                          sortBy === opt.id
                            ? 'bg-blue-50 text-[#0062D2]'
                            : 'hover:bg-slate-50 text-[#475569]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#0062D2]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="pt-4 border-t border-[#E7EAF0] space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-[#0062D2] text-white text-xs font-semibold rounded-lg hover:bg-[#0047A5] transition-colors"
                >
                  {isAr ? `تطبيق (${filteredProducts.length} صنف)` : `Apply (${filteredProducts.length} items)`}
                </button>
                {isFiltered && (
                  <button
                    onClick={() => {
                      resetFilters()
                      setMobileFilterOpen(false)
                    }}
                    className="w-full py-2 bg-slate-100 text-[#475569] text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    {isAr ? 'إعادة تعيين الكل' : 'Reset All'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 06. Minimal Industrial Contractor Notice */}
      <section className="mt-12">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="bg-white border border-[#E7EAF0] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-base sm:text-lg font-semibold text-[#15191E] mb-1">
                {isAr ? 'طلبات مقايسة الكميات وتوريد المشاريع' : 'Bulk Project & Contractor Supply'}
              </h2>
              <p className="text-xs sm:text-sm text-[#68717D] leading-relaxed">
                {isAr
                  ? 'نوفر كشوفات أسعار خاصة لشركات المقاولات والهندسة الكهربائية مع توفير التوصيل لموقع المشروع في بنغازي والمدن المجاورة.'
                  : 'Special wholesale rates and contractor pricing for verified electrical installations across Libya.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/wire-prices"
                className="px-4 py-2 rounded-lg border border-[#E7EAF0] text-xs font-medium text-[#15191E] hover:bg-slate-50 transition-colors"
              >
                {isAr ? 'جدول أسعار الأسلاك' : 'Wire Price Table'}
              </Link>
              <Link
                to="/contractors"
                className="px-4 py-2 rounded-lg bg-[#0062D2] text-white text-xs font-medium hover:bg-[#0047A5] transition-colors"
              >
                {isAr ? 'بوابة المقاولين' : 'Contractor Portal'}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
