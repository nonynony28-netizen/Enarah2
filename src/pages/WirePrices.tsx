import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Share2,
  Download,
  Search,
  X,
  Check,
  Info,
  ShieldCheck,
  FileText,
  Printer
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import WireAnatomy3D from '../components/WireAnatomy3D'

export type TrendType = 'up' | 'down' | 'same' | 'unavailable'

export interface WirePriceRecord {
  id: string
  size: string
  sizeEn: string
  sizeNumeric: number
  manufacturer: string
  manufacturerEn: string
  packageType: string
  packageTypeEn: string
  price: number
  previousPrice?: number
  trend: TrendType
  changeAmount?: number
  changePercent?: number
}

// ⚠️ بيانات الأسعار الأساسية المعتمدة رسمياً (تاريخ النشر المعتمد: 10 أكتوبر 2026)
const DEFAULT_PUBLISHED_DATE = '10 أكتوبر 2026'

const DEFAULT_WIRES: WirePriceRecord[] = [
  {
    id: '1.5',
    size: '1.5 مم²',
    sizeEn: '1.5 mm²',
    sizeNumeric: 1.5,
    manufacturer: 'صناعة إيطالية · نحاس نقي 100%',
    manufacturerEn: '100% Pure Copper · Made in Italy',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 45.0,
    trend: 'same'
  },
  {
    id: '2.5',
    size: '2.5 مم²',
    sizeEn: '2.5 mm²',
    sizeNumeric: 2.5,
    manufacturer: 'صناعة إيطالية · نحاس نقي 100%',
    manufacturerEn: '100% Pure Copper · Made in Italy',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 75.0,
    trend: 'same'
  },
  {
    id: '4.0',
    size: '4.0 مم²',
    sizeEn: '4.0 mm²',
    sizeNumeric: 4.0,
    manufacturer: 'صناعة إيطالية · نحاس نقي 100%',
    manufacturerEn: '100% Pure Copper · Made in Italy',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 115.0,
    trend: 'same'
  },
  {
    id: '6.0',
    size: '6.0 مم²',
    sizeEn: '6.0 mm²',
    sizeNumeric: 6.0,
    manufacturer: 'صناعة إيطالية · نحاس نقي 100%',
    manufacturerEn: '100% Pure Copper · Made in Italy',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 165.0,
    trend: 'same'
  },
  {
    id: '10.0',
    size: '10.0 مم²',
    sizeEn: '10.0 mm²',
    sizeNumeric: 10.0,
    manufacturer: 'صناعة إيطالية · نحاس نقي 100%',
    manufacturerEn: '100% Pure Copper · Made in Italy',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 290.0,
    trend: 'same'
  },
  {
    id: '16.0',
    size: '16.0 مم²',
    sizeEn: '16.0 mm²',
    sizeNumeric: 16.0,
    manufacturer: 'صناعة إيطالية · نحاس نقي 100%',
    manufacturerEn: '100% Pure Copper · Made in Italy',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 450.0,
    trend: 'same'
  },
  {
    id: '25.0',
    size: '25.0 مم²',
    sizeEn: '25.0 mm²',
    sizeNumeric: 25.0,
    manufacturer: 'صناعة إيطالية · نحاس نقي 100%',
    manufacturerEn: '100% Pure Copper · Made in Italy',
    packageType: 'مفرد (لفة 100 متر)',
    packageTypeEn: 'Single Core (100m Roll)',
    price: 680.0,
    trend: 'same'
  }
]

export default function WirePrices() {
  const { isAr } = useLanguage()

  // 1. Storage & State Management
  const [lastUpdateDate, setLastUpdateDate] = useState<string>(DEFAULT_PUBLISHED_DATE)
  const [wireUpdates, setWireUpdates] = useState<any[]>([])
  const [wireRecords, setWireRecords] = useState<WirePriceRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enarah_cached_wire_prices_v2')
      if (cached) {
        try {
          return JSON.parse(cached)
        } catch {
          // fallback to default
        }
      }
    }
    return DEFAULT_WIRES
  })

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<string>('all') // 'all' | 'pinned' | size id

  // Favorites (Section 12: Lightweight localStorage favorites)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const favs = localStorage.getItem('enarah_fav_wire_sizes')
      if (favs) {
        try {
          return JSON.parse(favs)
        } catch {}
      }
    }
    return ['1.5', '2.5'] // Helpful contractor defaults
  })

  // Sharing & Feedback States
  const [copyFeedback, setCopyFeedback] = useState(false)
  const [selectedChartWireId, setSelectedChartWireId] = useState('1.5')

  // Toggle Favorite
  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      localStorage.setItem('enarah_fav_wire_sizes', JSON.stringify(updated))
      return updated
    })
  }

  // 2. Data Fetching & Strict Audit (Real consecutive comparisons)
  useEffect(() => {
    let isMounted = true

    const fetchWirePrices = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        if (!res.ok) return
        const data = await res.json()

        if (isMounted && data.success && Array.isArray(data.data)) {
          const updates = data.data.filter(
            (item: any) => item.email === 'admin_wire_prices@app.local'
          )

          setWireUpdates(updates)

          if (updates.length > 0) {
            const chronological = [...updates].reverse()
            const latestRecord = chronological[chronological.length - 1]
            const previousRecord = chronological.length > 1 ? chronological[chronological.length - 2] : null

            // Format actual publication timestamp (Never generate fictional dates)
            if (latestRecord.createdAt) {
              const pubDate = new Date(latestRecord.createdAt)
              setLastUpdateDate(
                pubDate.toLocaleDateString(isAr ? 'ar-LY' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              )
            }

            let latestPricesObj: Record<string, string> = {}
            let previousPricesObj: Record<string, string> | null = null

            try {
              latestPricesObj = JSON.parse(latestRecord.phone).prices || {}
            } catch {}

            if (previousRecord) {
              try {
                previousPricesObj = JSON.parse(previousRecord.phone).prices || null
              } catch {}
            }

            const updatedWires: WirePriceRecord[] = DEFAULT_WIRES.map((wire) => {
              const currentPrice = latestPricesObj[wire.id]
                ? parseFloat(latestPricesObj[wire.id])
                : wire.price

              let prevPrice: number | undefined
              let trend: TrendType = 'same'
              let changeAmount: number | undefined
              let changePercent: number | undefined

              if (previousPricesObj && previousPricesObj[wire.id]) {
                prevPrice = parseFloat(previousPricesObj[wire.id])
                changeAmount = parseFloat((currentPrice - prevPrice).toFixed(2))
                changePercent = parseFloat(((changeAmount / prevPrice) * 100).toFixed(1))

                if (changeAmount > 0) trend = 'up'
                else if (changeAmount < 0) trend = 'down'
                else trend = 'same'
              } else if (updates.length < 2) {
                // When no prior record exists to compare against
                trend = 'unavailable'
              }

              return {
                ...wire,
                price: currentPrice,
                previousPrice: prevPrice,
                trend,
                changeAmount,
                changePercent
              }
            })

            setWireRecords(updatedWires)
            localStorage.setItem('enarah_cached_wire_prices_v2', JSON.stringify(updatedWires))
          }
        }
      } catch (err) {
        console.warn('Wire prices fetch notice:', err)
      }
    }

    fetchWirePrices()

    return () => {
      isMounted = false
    }
  }, [isAr])

  // Filter & Search Logic
  const filteredAndSortedWires = useMemo(() => {
    let result = [...wireRecords]

    // Filter by category / pill
    if (selectedFilter === 'pinned') {
      result = result.filter((w) => favoriteIds.includes(w.id))
    } else if (selectedFilter !== 'all') {
      result = result.filter((w) => w.id === selectedFilter)
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (w) =>
          w.size.toLowerCase().includes(q) ||
          w.sizeEn.toLowerCase().includes(q) ||
          w.id.includes(q) ||
          w.manufacturer.toLowerCase().includes(q) ||
          w.packageType.toLowerCase().includes(q)
      )
    }

    // Sort: Pinned items first when not filtering specifically
    if (selectedFilter === 'all') {
      result.sort((a, b) => {
        const aFav = favoriteIds.includes(a.id)
        const bFav = favoriteIds.includes(b.id)
        if (aFav && !bFav) return -1
        if (!aFav && bFav) return 1
        return a.sizeNumeric - b.sizeNumeric
      })
    }

    return result
  }, [wireRecords, favoriteIds, selectedFilter, searchQuery])

  // Share Functionality (Native share or clipboard fallback)
  const handleShare = useCallback(async () => {
    const shareTitle = isAr
      ? 'أسعار أسلاك النحاس الإيطالية | شركة الإنارة الحديثة'
      : 'Italian Copper Wire Prices | Enarah Modern'
    const shareText = isAr
      ? `تابع المؤشر اليومي المعتمد لأسعار أسلاك النحاس الإيطالية الأصلية 100% (تحديث ${lastUpdateDate}):\n${window.location.href}`
      : `Official price reference for certified 100% Italian copper wires (Updated ${lastUpdateDate}):\n${window.location.href}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(
        `${shareTitle}\n${shareText}`
      )
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2500)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }, [isAr, lastUpdateDate])

  // Clean Printable / PDF Export Trigger
  const handlePrintExport = useCallback(() => {
    window.print()
  }, [])

  // Real Historical Data (Strictly verified consecutive entries)
  const realHistory = useMemo(() => {
    if (wireUpdates.length < 2) return []

    const chronological = [...wireUpdates].reverse()
    return chronological
      .map((item) => {
        let pricesObj: Record<string, string> = {}
        try {
          pricesObj = JSON.parse(item.phone).prices || {}
        } catch {}

        const price = parseFloat(pricesObj[selectedChartWireId] || '0')
        if (!price || isNaN(price)) return null

        const dateObj = new Date(item.createdAt)
        const dateStr = dateObj.toLocaleDateString(isAr ? 'ar-LY' : 'en-US', {
          month: 'short',
          day: 'numeric'
        })

        return { date: dateStr, price }
      })
      .filter(Boolean) as { date: string; price: number }[]
  }, [wireUpdates, selectedChartWireId, isAr])

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172334] font-sans pb-24 selection:bg-[#0062D2] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 01. REFINED PAGE HEADER (Swiss Editorial & Industrial Precision) */}
      {/* ========================================================================= */}
      <header className="pt-8 sm:pt-12 pb-6 border-b border-[#E5EAF0] bg-white no-print">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* Title & Official Subtitle */}
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-1.5 h-6 bg-[#0062D2] rounded-full shrink-0" />
                <span className="text-xs font-semibold tracking-wide text-[#0062D2] uppercase">
                  {isAr ? 'المرجع الرسمي المعتمد · السوق الليبي' : 'Official Reference · Libyan Market'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#172334] tracking-tight">
                {isAr ? 'أسعار أسلاك النحاس الإيطالية' : 'Italian Copper Wire Prices'}
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
                {isAr
                  ? 'تابع أحدث أسعار أسلاك النحاس الإيطالية بمختلف المقاسات، من خلال مرجع واضح ومحدّث يساعد التجار والمختصين على متابعة الأسعار بسهولة.'
                  : 'Track the latest certified Italian copper wire prices across all wire sizes through an accurate, updated reference built for contractors and wholesalers.'}
              </p>
            </div>

            {/* Header Status & Practical Trader Tools */}
            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
              {/* Actual Publication Date Timestamp */}
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F0F6FD] border border-[#BFDBFE] text-xs text-[#0047A5]">
                <Calendar className="w-3.5 h-3.5 text-[#0062D2]" />
                <span>
                  {isAr ? 'آخر تحديث للأسعار:' : 'Last Updated:'}{' '}
                  <strong className="font-bold text-[#0062D2]">{lastUpdateDate}</strong>
                </span>
              </div>

              {/* Share Prices Button */}
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#172334] transition-colors duration-150 cursor-pointer shadow-xs active:scale-[0.98]"
                title={isAr ? 'مشاركة قائمة الأسعار' : 'Share Prices'}
              >
                {copyFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">{isAr ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#0062D2]" />
                    <span>{isAr ? 'مشاركة الأسعار' : 'Share Prices'}</span>
                  </>
                )}
              </button>

              {/* PDF / Print Sheet Export Button */}
              <button
                onClick={handlePrintExport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#0062D2] bg-[#0062D2] hover:bg-[#0052b3] text-white text-xs font-semibold transition-colors duration-150 cursor-pointer shadow-xs active:scale-[0.98]"
                title={isAr ? 'تحميل أو طباعة قائمة الأسعار الرسمية' : 'Download or Print Official Price List'}
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>{isAr ? 'تحميل قائمة الأسعار' : 'Export Price List'}</span>
              </button>
            </div>
          </div>

          {/* Official Market Scope Disclaimer Banner */}
          <div className="mt-5 pt-3.5 border-t border-[#F1F5F9] flex items-start sm:items-center gap-2.5 text-xs text-[#64748B]">
            <Info className="w-4 h-4 text-[#0062D2] shrink-0 mt-0.5 sm:mt-0" />
            <p className="leading-relaxed">
              {isAr
                ? 'الأسعار المدرجة تمثل أسعار البيع المعتمدة لدى شركة الإنارة الحديثة في بنغازي (لفة 100 متر أصلية من المصنع مباشرة)، وتُحدّث فور ورود نشرات التوريد الرسمية. هذه القائمة مرجع تجاري رسمي وليست تعميماً شاملاً لكافة السوق.'
                : 'Prices reflect certified showroom rates at Enarah Modern in Benghazi (100m original factory rolls) and are updated upon official wholesale publications. This table serves as a reference index.'}
            </p>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-8">
        
        {/* ========================================================================= */}
        {/* 02. SEARCH & FILTERING BAR (Practical Trader Tools) */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E5EAF0] rounded-2xl p-4 sm:p-5 shadow-xs mb-6 no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن مقاس السلك… (مثال: 1.5 ، 2.5 ، 10)' : 'Search wire size… (e.g. 1.5, 2.5, 10)'}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs sm:text-sm text-[#172334] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#0062D2] focus:outline-none focus:ring-2 focus:ring-[#0062D2]/15 transition-all"
                dir={isAr ? 'rtl' : 'ltr'}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#172334] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Size Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'bg-[#0062D2] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 border border-[#E2E8F0]'
                }`}
              >
                {isAr ? 'كافة المقاسات' : 'All Sizes'}
              </button>

              <button
                onClick={() => setSelectedFilter('pinned')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                  selectedFilter === 'pinned'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 border border-[#E2E8F0]'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>{isAr ? 'المثبتة' : 'Pinned'}</span>
              </button>

              {DEFAULT_WIRES.map((wire) => (
                <button
                  key={wire.id}
                  onClick={() => setSelectedFilter(selectedFilter === wire.id ? 'all' : wire.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer tabular-nums ${
                    selectedFilter === wire.id
                      ? 'bg-[#0062D2] text-white shadow-xs font-bold'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-slate-100 border border-[#E2E8F0]'
                  }`}
                >
                  {wire.id} مم²
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 03. PROFESSIONAL PRICE REFERENCE TABLE (B2B Data Reference) */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E5EAF0] rounded-2xl overflow-hidden shadow-xs mb-8 no-print">
          
          {/* Table Header Bar */}
          <div className="px-5 sm:px-6 py-4 bg-[#F8FAFC] border-b border-[#E5EAF0] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0062D2]" />
              <h2 className="text-xs sm:text-sm font-bold text-[#172334] tracking-wide">
                {isAr
                  ? 'جدول أسعار أسلاك النحاس الإيطالية المعتمدة (نحاس نقي 100% - لفة 100 متر)'
                  : 'Certified Italian Copper Wire Schedule (100% Pure Copper · 100m Roll)'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#64748B] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-md">
                {isAr ? 'العملة: دينار ليبي (د.ل)' : 'Currency: LYD'}
              </span>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="border-b border-[#E5EAF0] text-xs font-semibold text-[#64748B] bg-white">
                  <th className="py-4 px-6 w-48">{isAr ? 'مقاس السلك' : 'Wire Size'}</th>
                  <th className="py-4 px-6">{isAr ? 'المواصفات' : 'Specification'}</th>
                  <th className="py-4 px-6 w-52">{isAr ? 'السعر الحالي' : 'Current Price'}</th>
                  <th className="py-4 px-6 w-48">{isAr ? 'حركة السعر' : 'Price Movement'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF0] text-sm">
                {filteredAndSortedWires.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-xs text-[#64748B]">
                      {isAr ? 'لا توجد نتائج تطابق بحثك.' : 'No wire sizes match your search.'}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedWires.map((wire) => {
                    const isFav = favoriteIds.includes(wire.id)

                    return (
                      <tr
                        key={wire.id}
                        className={`transition-colors duration-150 ${
                          isFav ? 'bg-[#F8FAFD]' : 'hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {/* 1. Wire Size with Pin / Favorite Star */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => toggleFavorite(wire.id)}
                              className="p-1 rounded-md text-[#CBD5E1] hover:text-amber-500 hover:bg-slate-100 transition-colors cursor-pointer"
                              title={isFav ? (isAr ? 'إلغاء التثبيت' : 'Unpin') : (isAr ? 'تثبيت المقاس في الأعلى' : 'Pin wire')}
                              aria-label={isFav ? 'Unpin wire size' : 'Pin wire size'}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  isFav ? 'fill-amber-400 text-amber-500' : 'text-[#CBD5E1]'
                                }`}
                              />
                            </button>
                            <span className="font-bold text-base sm:text-lg text-[#172334] tracking-tight tabular-nums">
                              {isAr ? wire.size : wire.sizeEn}
                            </span>
                            {isFav && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                {isAr ? 'مثبت' : 'Pinned'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 2. Specifications & Packaging */}
                        <td className="py-4 px-6">
                          <div className="text-xs text-[#172334] font-medium mb-0.5">
                            {isAr ? wire.packageType : wire.packageTypeEn}
                          </div>
                          <span className="text-[11px] text-[#0062D2] font-medium">
                            {isAr ? wire.manufacturer : wire.manufacturerEn}
                          </span>
                        </td>

                        {/* 3. Current Published Price (Tabular Numerals & Corporate Blue) */}
                        <td className="py-4 px-6">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl sm:text-2xl font-bold text-[#0062D2] tabular-nums tracking-tight">
                              {wire.price.toFixed(2)}
                            </span>
                            <span className="text-xs font-semibold text-[#64748B]">
                              {isAr ? 'د.ل' : 'LYD'}
                            </span>
                          </div>
                        </td>

                        {/* 4. Price Movement Indicator (Restrained & Honest) */}
                        <td className="py-4 px-6">
                          {wire.trend === 'up' && wire.changeAmount !== undefined ? (
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C44949] bg-rose-50 border border-rose-200/70 px-2.5 py-1 rounded-lg">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span className="tabular-nums">ارتفاع +{wire.changeAmount.toFixed(2)} د.ل</span>
                              {wire.changePercent && (
                                <span className="text-[10px] text-rose-500">({wire.changePercent}%)</span>
                              )}
                            </div>
                          ) : wire.trend === 'down' && wire.changeAmount !== undefined ? (
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16845B] bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-lg">
                              <TrendingDown className="w-3.5 h-3.5" />
                              <span className="tabular-nums">انخفاض {wire.changeAmount.toFixed(2)} د.ل</span>
                              {wire.changePercent && (
                                <span className="text-[10px] text-emerald-600">({wire.changePercent}%)</span>
                              )}
                            </div>
                          ) : wire.trend === 'same' ? (
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#718096] bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
                              <Minus className="w-3.5 h-3.5 text-[#94A3B8]" />
                              <span>{isAr ? 'مستقر' : 'Stable'}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                              <span className="text-[11px] text-[#94A3B8] italic">
                                {isAr ? 'لا تتوفر بيانات مقارنة' : 'No comparison data'}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Adaptive Mobile Rows (Compact, Clean & Highly Readable) */}
          <div className="md:hidden divide-y divide-[#E5EAF0]">
            {filteredAndSortedWires.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B]">
                {isAr ? 'لا توجد نتائج تطابق بحثك.' : 'No wire sizes match your search.'}
              </div>
            ) : (
              filteredAndSortedWires.map((wire) => {
                const isFav = favoriteIds.includes(wire.id)

                return (
                  <div
                    key={wire.id}
                    className={`p-4 transition-colors duration-150 ${
                      isFav ? 'bg-[#F8FAFD]' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => toggleFavorite(wire.id)}
                          className="p-1 rounded text-[#CBD5E1] hover:text-amber-500 cursor-pointer"
                          aria-label="Toggle pin"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isFav ? 'fill-amber-400 text-amber-500' : 'text-[#CBD5E1]'
                            }`}
                          />
                        </button>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-base text-[#172334] tabular-nums">
                              {isAr ? wire.size : wire.sizeEn}
                            </span>
                            {isFav && (
                              <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded">
                                {isAr ? 'مثبت' : 'Pinned'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#0062D2] font-medium block">
                            {isAr ? wire.packageType : wire.packageTypeEn}
                          </span>
                        </div>
                      </div>

                      {/* Prominent Price */}
                      <div className="text-left">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-[#0062D2] tabular-nums">
                            {wire.price.toFixed(2)}
                          </span>
                          <span className="text-xs font-semibold text-[#64748B]">
                            {isAr ? 'د.ل' : 'LYD'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Card Footer: Movement Badge & Manufacturer Note */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F1F5F9] text-xs">
                      <span className="text-[11px] text-[#64748B]">
                        {isAr ? 'صناعة إيطالية معتمدة' : 'Certified Italian Wire'}
                      </span>

                      <div>
                        {wire.trend === 'up' && wire.changeAmount !== undefined ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C44949] bg-rose-50 border border-rose-200/70 px-2 py-0.5 rounded">
                            <TrendingUp className="w-3 h-3" />
                            <span className="tabular-nums">ارتفاع +{wire.changeAmount.toFixed(2)} د.ل</span>
                          </span>
                        ) : wire.trend === 'down' && wire.changeAmount !== undefined ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16845B] bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded">
                            <TrendingDown className="w-3 h-3" />
                            <span className="tabular-nums">انخفاض {wire.changeAmount.toFixed(2)} د.ل</span>
                          </span>
                        ) : wire.trend === 'same' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#718096] bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded">
                            <Minus className="w-3 h-3 text-[#94A3B8]" />
                            <span>{isAr ? 'مستقر' : 'Stable'}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#94A3B8] italic">
                            {isAr ? 'لا تتوفر مقارنة' : 'No comparison'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 04. HISTORICAL PRICE MOVEMENT SECTION (Truthful & Verified) */}
        {/* ========================================================================= */}
        <section className="bg-white border border-[#E5EAF0] rounded-2xl p-5 sm:p-7 mb-8 shadow-xs no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0062D2]" />
                <h3 className="text-base sm:text-lg font-bold text-[#172334] tracking-tight">
                  {isAr ? 'سجل حركة الأسعار التاريخية' : 'Historical Price Movement'}
                </h3>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                {isAr
                  ? 'رصد مسار الأسعار المنشورة رسمياً وفق التحديثات المعتمدة المتتالية.'
                  : 'Track official consecutive price publications.'}
              </p>
            </div>

            {/* Wire Selector Pills for Historical View */}
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_WIRES.map((wire) => (
                <button
                  key={wire.id}
                  onClick={() => setSelectedChartWireId(wire.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                    selectedChartWireId === wire.id
                      ? 'bg-[#0062D2] text-white shadow-xs'
                      : 'bg-[#F8FAFC] text-[#0047A5] hover:bg-blue-50 border border-[#D6E4F8]'
                  }`}
                >
                  {wire.id} مم²
                </button>
              ))}
            </div>
          </div>

          {/* Truthful rendering: Only display if real historical data exists */}
          {realHistory.length >= 2 ? (
            <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E5EAF0]">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[420px]">
                  <svg viewBox="0 0 500 180" className="w-full h-auto">
                    {/* Minimal Grid lines */}
                    <line x1="40" y1="30" x2="480" y2="30" stroke="#E2E8F0" strokeDasharray="3,3" />
                    <line x1="40" y1="90" x2="480" y2="90" stroke="#E2E8F0" strokeDasharray="3,3" />
                    <line x1="40" y1="150" x2="480" y2="150" stroke="#E2E8F0" />

                    {/* Polyline */}
                    {(() => {
                      const prices = realHistory.map((d) => d.price)
                      const maxP = Math.max(...prices) * 1.05
                      const minP = Math.min(...prices) * 0.95
                      const range = maxP - minP || 1

                      const points = realHistory
                        .map((d, i) => {
                          const x = 50 + (i / (realHistory.length - 1)) * 410
                          const y = 150 - ((d.price - minP) / range) * 120
                          return `${x},${y}`
                        })
                        .join(' ')

                      return (
                        <>
                          <polyline
                            fill="none"
                            stroke="#0062D2"
                            strokeWidth="2.5"
                            points={points}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {realHistory.map((d, i) => {
                            const x = 50 + (i / (realHistory.length - 1)) * 410
                            const y = 150 - ((d.price - minP) / range) * 120
                            return (
                              <g key={i}>
                                <circle cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#0062D2" strokeWidth="2.5" />
                                <text x={x} y={y - 10} fill="#0062D2" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                                  {d.price.toFixed(2)}
                                </text>
                                <text x={x} y="166" fill="#64748B" fontSize="9" textAnchor="middle">
                                  {d.date}
                                </text>
                              </g>
                            )
                          })}
                        </>
                      )
                    })()}
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#E5EAF0] text-center">
              <span className="text-xs font-semibold text-[#0062D2] block mb-1">
                {isAr
                  ? 'لا تتوفر بيانات مقارنة كافية للمخطط التاريخي حالياً'
                  : 'Insufficient historical comparisons currently available'}
              </span>
              <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
                {isAr
                  ? 'يبدأ المخطط برسم منحنى التغير السعري التلقائي فور تسجيل ونشر تحديثات سعرية متتالية عبر لوحة الاعتماد.'
                  : 'The visual price chart will automatically plot consecutive movements as verified updates are published.'}
              </p>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 05. PHOTOREALISTIC INTERACTIVE CABLE ANATOMY (3D Model Experience) */}
        {/* ========================================================================= */}
        <div className="no-print">
          <WireAnatomy3D isAr={isAr} />
        </div>

        {/* ========================================================================= */}
        {/* 06. EDUCATIONAL TECHNICAL STANDARDS & SPECIFICATIONS */}
        {/* ========================================================================= */}
        <section className="bg-white border border-[#E5EAF0] rounded-2xl p-6 sm:p-8 shadow-xs my-8 no-print">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#0062D2]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#172334]">
              {isAr ? 'المعايير الهندسية ودليل استخدام المقاسات' : 'Technical Standards & Wire Gauge Guide'}
            </h3>
          </div>
          
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 max-w-3xl">
            {isAr
              ? 'تخضع جميع أسلاك النحاس الإيطالية المعتمدة لدى شركة الإنارة الحديثة لأعلى المعايير الأوروبية المحددة لسلامة المنشآت والتمديدات الكهربائية، وفيما يلي التوزيع الهندسي الموصى به لاختيار المقاس المناسب لكل حمل:'
              : 'All Italian wires comply with rigorous European electrical engineering standards. Below is the recommended sizing guide based on circuit loads:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Guide Item 1 */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0]">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-bold text-base text-[#0062D2]">1.5 مم²</span>
                <span className="text-[11px] font-semibold text-[#64748B]">دوائر الإنارة</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {isAr
                  ? 'مخصص لشبكات الإنارة الداخلية والمفاتيح الجدارية والأحمال الخفيفة حتى 10-16 أمبير.'
                  : 'Engineered for lighting circuits and wall switches up to 10-16 Amps.'}
              </p>
            </div>

            {/* Guide Item 2 */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0]">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-bold text-base text-[#0062D2]">2.5 مم²</span>
                <span className="text-[11px] font-semibold text-[#64748B]">الأفياش والمآخذ</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {isAr
                  ? 'المقاس القياسي لمآخذ الكهرباء العامة (الأفياش) والأجهزة المنزلية المتوسطة حتى 16-20 أمبير.'
                  : 'Standard specification for general socket outlets and home appliances up to 16-20 Amps.'}
              </p>
            </div>

            {/* Guide Item 3 */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0]">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-bold text-base text-[#0062D2]">4.0 مم²</span>
                <span className="text-[11px] font-semibold text-[#64748B]">المكيفات والسخانات</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {isAr
                  ? 'دوائر القوى المباشرة لمكيفات الهواء (Split Units) وسخانات المياه والأحمال حتى 25 أمبير.'
                  : 'Dedicated power runs for air conditioning units and water heaters up to 25 Amps.'}
              </p>
            </div>

            {/* Guide Item 4 */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0]">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-bold text-base text-[#0062D2]">6.0 - 25 مم²</span>
                <span className="text-[11px] font-semibold text-[#64748B]">التغذية الرئيسية</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {isAr
                  ? 'خطوط التغذية الرئيسية من العداد إلى اللوحات الفرعية، ومطابخ الحث الكهربائي والمضخات.'
                  : 'Main distribution feeders from meters to sub-panels and heavy industrial appliances.'}
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 07. PRINTABLE / PDF OFFICIAL PRICE SHEET TEMPLATE (Visible ONLY in print) */}
      {/* ========================================================================= */}
      <div id="printable-price-sheet" className="hidden print:block p-8 bg-white text-black font-sans" dir="rtl">
        {/* Printable Header */}
        <div className="border-b-2 border-[#172334] pb-4 mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#172334] mb-1">شركة الإنارة الحديثة — بنغازي</h1>
            <h2 className="text-base font-semibold text-[#0062D2]">
              قائمة الأسعار الرسمية المعتمدة لأسلاك النحاس الإيطالية (100% نحاس نقي)
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              المرجع التجاري المعتمد للتجار والمقاولين والمهندسين في ليبيا · لفة 100 متر أصلية
            </p>
          </div>
          <div className="text-left text-xs text-gray-700">
            <div>تاريخ التحديث: <strong className="text-black">{lastUpdateDate}</strong></div>
            <div>العملة: <strong>دينار ليبي (د.ل)</strong></div>
            <div>الموقع: <strong>enarahmodern.com</strong></div>
          </div>
        </div>

        {/* Printable Table */}
        <table className="w-full text-right border-collapse text-xs mb-6">
          <thead>
            <tr className="bg-gray-100 border border-gray-300">
              <th className="py-2.5 px-3 border border-gray-300 font-bold">مقاس السلك</th>
              <th className="py-2.5 px-3 border border-gray-300 font-bold">المواصفة والتعبئة</th>
              <th className="py-2.5 px-3 border border-gray-300 font-bold">بلد الصنع والاعتماد</th>
              <th className="py-2.5 px-3 border border-gray-300 font-bold text-center">السعر الرسمي (د.ل)</th>
            </tr>
          </thead>
          <tbody>
            {wireRecords.map((wire) => (
              <tr key={wire.id} className="border border-gray-300">
                <td className="py-2 px-3 border border-gray-300 font-bold text-sm">{wire.size}</td>
                <td className="py-2 px-3 border border-gray-300">{wire.packageType}</td>
                <td className="py-2 px-3 border border-gray-300">{wire.manufacturer}</td>
                <td className="py-2 px-3 border border-gray-300 font-bold text-sm text-center">{wire.price.toFixed(2)} د.ل</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Official Printable Disclaimer */}
        <div className="border border-gray-300 p-3 rounded text-[11px] text-gray-700 leading-relaxed mb-6">
          <strong>ملاحظة هامة:</strong> الأسعار المعروضة في هذا الكشف تمثل أسعار البيع المعتمدة رسمياً لدى صالات عرض شركة الإنارة الحديثة في بنغازي (مفرد، لفة 100 متر أصلية من المصنع مباشرة). تخضع الأسعار للتحديث الدوري بناءً على نشرات التوريد العالمية وبورصة المعادن.
        </div>

        {/* Printable Footer */}
        <div className="border-t border-gray-300 pt-3 text-[10px] text-gray-500 flex items-center justify-between">
          <span>شركة الإنارة الحديثة للمواد الكهربائية والإنارة — بنغازي، ليبيا</span>
          <span>صفحة الأسعار الرسمية: enarahmodern.com/wire-prices</span>
        </div>
      </div>

      {/* Print CSS Rules */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .no-print, header.no-print, nav, footer, #bottom-nav, .fixed {
            display: none !important;
          }
          #printable-price-sheet {
            display: block !important;
          }
        }
      `}</style>

    </div>
  )
}
