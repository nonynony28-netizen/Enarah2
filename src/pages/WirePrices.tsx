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
  Layers,
  Cable
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
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
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
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
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
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
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
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
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
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
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
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
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
    manufacturer: 'صناعة إيطالية · نحاس موصل',
    manufacturerEn: 'Italian Manufactured · Copper Conductor',
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

  // Favorites (Lightweight localStorage favorites)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const favs = localStorage.getItem('enarah_fav_wire_sizes')
      if (favs) {
        try {
          return JSON.parse(favs)
        } catch {}
      }
    }
    return ['1.5', '2.5']
  })

  // Sharing Feedback State
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Toggle Favorite
  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
      localStorage.setItem('enarah_fav_wire_sizes', JSON.stringify(updated))
      return updated
    })
  }

  // 2. Data Fetching & Real Consecutive Comparisons
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

          if (updates.length > 0) {
            const chronological = [...updates].reverse()
            const latestRecord = chronological[chronological.length - 1]
            const previousRecord =
              chronological.length > 1 ? chronological[chronological.length - 2] : null

            // Format actual publication timestamp (Never invent dates)
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
            localStorage.setItem(
              'enarah_cached_wire_prices_v2',
              JSON.stringify(updatedWires)
            )
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

    if (selectedFilter === 'pinned') {
      result = result.filter((w) => favoriteIds.includes(w.id))
    } else if (selectedFilter !== 'all') {
      result = result.filter((w) => w.id === selectedFilter)
    }

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
      ? `تابع مرجع أسعار أسلاك النحاس الإيطالية لدى شركة الإنارة الحديثة (آخر تحديث: ${lastUpdateDate}):\n${window.location.href}`
      : `Official Italian copper wire price reference at Enarah Modern (Last updated: ${lastUpdateDate}):\n${window.location.href}`

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
      await navigator.clipboard.writeText(`${shareTitle}\n${shareText}`)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2500)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }, [isAr, lastUpdateDate])

  // Printable / PDF Price List Export
  const handlePrintExport = useCallback(() => {
    window.print()
  }, [])

  return (
    <div
      className="min-h-screen bg-[#F7F9FC] text-[#172334] font-sans selection:bg-[#3974C8] selection:text-white"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* ========================================================================= */}
      {/* SECTION A — PREMIUM NAVY HERO                                             */}
      {/* ========================================================================= */}
      <header className="bg-[#102A43] text-white border-b border-[#173B5E] py-9 sm:py-12 no-print">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Right Side: Main Heading & Supporting Description */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#081D35] border border-[#173B5E] text-[13px] font-medium text-[#7CC4FA] mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3974C8]" />
                <span>
                  {isAr
                    ? 'شركة الإنارة الحديثة · المرجع السعري المعتمد'
                    : 'Enarah Modern · Official Price Reference'}
                </span>
              </div>

              <h1 className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-white leading-[1.25] tracking-normal">
                {isAr ? 'أسعار أسلاك النحاس الإيطالية' : 'Italian Copper Wire Prices'}
              </h1>

              <p className="text-sm sm:text-base text-slate-200/90 mt-3 leading-relaxed max-w-2xl font-normal">
                {isAr
                  ? 'تابع أحدث أسعار أسلاك النحاس الإيطالية بمختلف المقاسات، من خلال مرجع واضح ومحدّث يساعد التجار والمختصين على متابعة الأسعار بسهولة.'
                  : 'Track the latest Italian copper wire prices across all wire sizes through a clear, updated reference designed for traders and specialists.'}
              </p>
            </div>

            {/* Left Side: Update Timestamp & Essential Actions */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4">
              
              {/* Real Update Information Box */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#081D35] border border-[#173B5E] text-[13px] text-slate-200">
                <Calendar className="w-4 h-4 text-[#7CC4FA] shrink-0" />
                <span>{isAr ? 'آخر تحديث للأسعار:' : 'Last Price Update:'}</span>
                <strong className="font-semibold text-white">{lastUpdateDate}</strong>
              </div>

              {/* Action Buttons: One Primary Blue + One Restrained Outlined */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto lg:justify-end">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-[#173B5E] bg-[#081D35]/70 hover:bg-[#173B5E] text-[13px] font-medium text-white transition-colors duration-150 cursor-pointer"
                >
                  {copyFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">
                        {isAr ? 'تم نسخ الرابط' : 'Link Copied'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-[#7CC4FA]" />
                      <span>{isAr ? 'مشاركة الأسعار' : 'Share Prices'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrintExport}
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#3974C8] hover:bg-[#2d62b0] text-white text-[13px] font-semibold transition-colors duration-150 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>{isAr ? 'تحميل قائمة الأسعار' : 'Download Price List'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION B — PROFESSIONAL PRICE REFERENCE                                  */}
      {/* ========================================================================= */}
      <section
        aria-label={isAr ? 'جدول مرجع الأسعار' : 'Price Reference Table'}
        className="py-8 sm:py-11 no-print"
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          
          {/* Unified Search & Filter Control Bar */}
          <div className="bg-white border border-[#E4EAF1] rounded-xl p-3.5 sm:p-4 mb-5 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
              
              {/* Search Field on the Right */}
              <div className="relative w-full lg:w-80 shrink-0">
                <Search className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'ابحث عن مقاس السلك…' : 'Search wire size…'}
                  className="w-full h-10 pl-9 pr-10 rounded-lg border border-[#E4EAF1] bg-[#F7F9FC] text-[14px] text-[#172334] placeholder:text-[#64748B] focus:bg-white focus:border-[#3974C8] focus:outline-none focus:ring-2 focus:ring-[#3974C8]/15 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#172334] cursor-pointer"
                    aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Horizontally Scrollable Size Filters + Integrated Favorites */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 lg:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedFilter('all')}
                  className={`h-9 px-3.5 rounded-lg text-[13px] font-medium transition-colors duration-150 shrink-0 cursor-pointer ${
                    selectedFilter === 'all'
                      ? 'bg-[#102A43] text-white font-semibold'
                      : 'bg-[#F7F9FC] text-[#64748B] hover:text-[#172334] hover:bg-[#EDF3F9] border border-[#E4EAF1]'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFilter(selectedFilter === 'pinned' ? 'all' : 'pinned')
                  }
                  className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-medium transition-colors duration-150 shrink-0 cursor-pointer ${
                    selectedFilter === 'pinned'
                      ? 'bg-[#102A43] text-white font-semibold'
                      : 'bg-[#F7F9FC] text-[#64748B] hover:text-[#172334] hover:bg-[#EDF3F9] border border-[#E4EAF1]'
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      selectedFilter === 'pinned'
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-amber-500'
                    }`}
                  />
                  <span>{isAr ? 'المفضلة' : 'Favorites'}</span>
                </button>

                <span className="h-5 w-px bg-[#E4EAF1] mx-1 shrink-0" />

                {DEFAULT_WIRES.map((wire) => {
                  const isSelected = selectedFilter === wire.id
                  return (
                    <button
                      key={wire.id}
                      type="button"
                      onClick={() => setSelectedFilter(isSelected ? 'all' : wire.id)}
                      className={`h-9 px-3 rounded-lg text-[13px] font-medium transition-colors duration-150 shrink-0 cursor-pointer tabular-nums ${
                        isSelected
                          ? 'bg-[#3974C8] text-white font-semibold'
                          : 'bg-[#F7F9FC] text-[#172334] hover:bg-[#EDF3F9] border border-[#E4EAF1]'
                      }`}
                    >
                      {isAr ? wire.size : wire.sizeEn}
                    </button>
                  )
                })}
              </div>

            </div>
          </div>

          {/* Enterprise-Grade Price Reference Table */}
          <div className="bg-white border border-[#E4EAF1] rounded-xl overflow-hidden shadow-2xs">
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#102A43] text-white text-[13px] font-medium border-b border-[#173B5E]">
                    <th className="py-3.5 px-6 w-52 font-semibold">
                      {isAr ? 'مقاس السلك' : 'Wire Size'}
                    </th>
                    <th className="py-3.5 px-6 font-semibold">
                      {isAr ? 'المواصفات' : 'Specifications'}
                    </th>
                    <th className="py-3.5 px-6 w-56 font-semibold">
                      {isAr ? 'السعر الحالي' : 'Current Price'}
                    </th>
                    <th className="py-3.5 px-6 w-48 font-semibold">
                      {isAr ? 'حركة السعر' : 'Price Movement'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4EAF1] text-[15px]">
                  {filteredAndSortedWires.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-sm text-[#64748B]"
                      >
                        {isAr
                          ? 'لا توجد مقاسات مطابقة لبحثك.'
                          : 'No wire sizes match your search.'}
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedWires.map((wire) => {
                      const isFav = favoriteIds.includes(wire.id)

                      return (
                        <tr
                          key={wire.id}
                          className={`transition-colors duration-150 ${
                            isFav ? 'bg-[#EDF3F9]/40' : 'bg-white'
                          } hover:bg-[#F7F9FC]`}
                        >
                          {/* 1. مقاس السلك */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => toggleFavorite(wire.id)}
                                className="p-1 rounded text-[#94A3B8] hover:text-amber-500 transition-colors cursor-pointer"
                                title={
                                  isFav
                                    ? isAr
                                      ? 'إزالة من المفضلة'
                                      : 'Remove from favorites'
                                    : isAr
                                    ? 'إضافة للمفضلة'
                                    : 'Add to favorites'
                                }
                                aria-label={isFav ? 'Unpin wire size' : 'Pin wire size'}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    isFav
                                      ? 'fill-amber-400 text-amber-500'
                                      : 'text-[#CBD5E1]'
                                  }`}
                                />
                              </button>
                              <span className="text-[17px] font-bold text-[#172334] tabular-nums">
                                {isAr ? wire.size : wire.sizeEn}
                              </span>
                            </div>
                          </td>

                          {/* 2. المواصفات */}
                          <td className="py-4 px-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                              <span className="text-[15px] font-medium text-[#172334]">
                                {isAr ? wire.packageType : wire.packageTypeEn}
                              </span>
                              <span className="hidden sm:inline text-[#CBD5E1]">•</span>
                              <span className="text-[13px] text-[#64748B]">
                                {isAr ? wire.manufacturer : wire.manufacturerEn}
                              </span>
                            </div>
                          </td>

                          {/* 3. السعر الحالي */}
                          <td className="py-4 px-6">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[22px] font-semibold text-[#172334] tabular-nums">
                                {wire.price.toFixed(2)}
                              </span>
                              <span className="text-[13px] font-medium text-[#64748B]">
                                {isAr ? 'د.ل' : 'LYD'}
                              </span>
                            </div>
                          </td>

                          {/* 4. حركة السعر */}
                          <td className="py-4 px-6">
                            {wire.trend === 'up' && wire.changeAmount !== undefined ? (
                              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#C44949] bg-[#C44949]/10 px-2.5 py-1 rounded-md">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span className="tabular-nums">
                                  {isAr ? 'ارتفاع' : 'Up'} +{wire.changeAmount.toFixed(2)}
                                </span>
                              </span>
                            ) : wire.trend === 'down' &&
                              wire.changeAmount !== undefined ? (
                              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#16845B] bg-[#16845B]/10 px-2.5 py-1 rounded-md">
                                <TrendingDown className="w-3.5 h-3.5" />
                                <span className="tabular-nums">
                                  {isAr ? 'انخفاض' : 'Down'} {wire.changeAmount.toFixed(2)}
                                </span>
                              </span>
                            ) : wire.trend === 'same' ? (
                              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#718096] bg-[#EDF3F9] px-2.5 py-1 rounded-md">
                                <Minus className="w-3.5 h-3.5" />
                                <span>{isAr ? 'مستقر' : 'Stable'}</span>
                              </span>
                            ) : (
                              <span className="text-[13px] text-[#718096]">
                                {isAr ? 'مستقر' : 'Stable'}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Purpose-Built Compact Price Rows (Wire Size → Price → Movement) */}
            <div className="md:hidden">
              <div className="bg-[#102A43] text-white px-4 py-2.5 flex items-center justify-between text-xs font-medium">
                <span>{isAr ? 'المقاس والمواصفات' : 'Size & Specs'}</span>
                <span>{isAr ? 'السعر الحالي (د.ل)' : 'Current Price (LYD)'}</span>
              </div>

              <div className="divide-y divide-[#E4EAF1]">
                {filteredAndSortedWires.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#64748B]">
                    {isAr
                      ? 'لا توجد مقاسات مطابقة لبحثك.'
                      : 'No wire sizes match your search.'}
                  </div>
                ) : (
                  filteredAndSortedWires.map((wire) => {
                    const isFav = favoriteIds.includes(wire.id)

                    return (
                      <div
                        key={wire.id}
                        className={`px-4 py-3.5 transition-colors ${
                          isFav ? 'bg-[#EDF3F9]/45' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          {/* Right: Star + Wire Size + Accessible Spec */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              type="button"
                              onClick={() => toggleFavorite(wire.id)}
                              className="p-1 -mr-1 text-[#94A3B8] hover:text-amber-500 shrink-0 cursor-pointer"
                              aria-label="Toggle favorite"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  isFav
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-[#CBD5E1]'
                                }`}
                              />
                            </button>
                            <div className="min-w-0">
                              <div className="text-[16px] font-bold text-[#172334] tabular-nums leading-tight">
                                {isAr ? wire.size : wire.sizeEn}
                              </div>
                              <div className="text-[12px] text-[#64748B] truncate mt-0.5">
                                {isAr ? wire.packageType : wire.packageTypeEn}
                              </div>
                            </div>
                          </div>

                          {/* Left: Price + Movement */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-left">
                              <div className="flex items-baseline gap-1 justify-end">
                                <span className="text-[19px] font-semibold text-[#172334] tabular-nums">
                                  {wire.price.toFixed(2)}
                                </span>
                                <span className="text-[12px] font-medium text-[#64748B]">
                                  {isAr ? 'د.ل' : 'LYD'}
                                </span>
                              </div>

                              <div className="flex justify-end mt-0.5">
                                {wire.trend === 'up' &&
                                wire.changeAmount !== undefined ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C44949]">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="tabular-nums">
                                      {isAr ? 'ارتفاع' : 'Up'} +{wire.changeAmount.toFixed(2)}
                                    </span>
                                  </span>
                                ) : wire.trend === 'down' &&
                                  wire.changeAmount !== undefined ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16845B]">
                                    <TrendingDown className="w-3 h-3" />
                                    <span className="tabular-nums">
                                      {isAr ? 'انخفاض' : 'Down'} {wire.changeAmount.toFixed(2)}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-[#718096]">
                                    <span>{isAr ? 'مستقر' : 'Stable'}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Table Footer Policy Note */}
            <div className="px-5 py-3.5 bg-[#EDF3F9]/60 border-t border-[#E4EAF1] flex items-start sm:items-center gap-2.5 text-[13px] text-[#64748B]">
              <Info className="w-4 h-4 text-[#3974C8] shrink-0 mt-0.5 sm:mt-0" />
              <p className="leading-relaxed">
                {isAr
                  ? 'تعبر الأسعار الموضحة عن قائمة البيع المعتمدة لدى شركة الإنارة الحديثة (لفة 100 متر)، وتخضع للتحديث وفق نشرات التوريد الرسمية للشركة.'
                  : 'Listed prices reflect the official selling schedule at Enarah Modern (100m roll) and are updated according to company supply notices.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION C — INTERACTIVE CABLE LABORATORY                                  */}
      {/* ========================================================================= */}
      <WireAnatomy3D isAr={isAr} />

      {/* ========================================================================= */}
      {/* SECTION D — TECHNICAL INFORMATION                                         */}
      {/* ========================================================================= */}
      <section
        aria-labelledby="technical-guide-heading"
        className="py-12 sm:py-16 no-print"
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#3974C8] mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isAr ? 'معلومات فنية وإرشادية' : 'Technical & Application Reference'}
                </span>
              </div>
              <h2
                id="technical-guide-heading"
                className="text-xl sm:text-[28px] font-bold text-[#172334] leading-snug"
              >
                {isAr
                  ? 'دليل المقاسات والتطبيقات الكهربائية'
                  : 'Wire Sizing & Electrical Applications Guide'}
              </h2>
            </div>
            <p className="text-sm text-[#64748B] max-w-md leading-relaxed">
              {isAr
                ? 'مرجع فني مختصر يساعد المهندسين والفنيين على مطابقة مقاس السلك مع طبيعة الحمل الكهربائي في المشاريع السكنية والتجارية.'
                : 'A concise reference assisting engineers and technicians in matching wire gauges to circuit loads.'}
              </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E4EAF1] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-[#102A43] tabular-nums">
                  1.5 مم²
                </span>
                <span className="text-xs font-medium text-[#3974C8] bg-[#EDF3F9] px-2.5 py-1 rounded">
                  {isAr ? 'دوائر الإنارة' : 'Lighting'}
                </span>
              </div>
              <p className="text-[14px] text-[#64748B] leading-relaxed">
                {isAr
                  ? 'يُستخدم لتمديدات نقاط الإضاءة الداخلية والمفاتيح الجدارية وخطوط التحكم ذات الأحمال الخفيفة.'
                  : 'Used for indoor lighting circuits, wall switches, and low-load control wiring.'}
              </p>
            </div>

            <div className="bg-white border border-[#E4EAF1] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-[#102A43] tabular-nums">
                  2.5 مم²
                </span>
                <span className="text-xs font-medium text-[#3974C8] bg-[#EDF3F9] px-2.5 py-1 rounded">
                  {isAr ? 'المآخذ والأفياش' : 'Power Outlets'}
                </span>
              </div>
              <p className="text-[14px] text-[#64748B] leading-relaxed">
                {isAr
                  ? 'المقاس الأساسي لتغذية البريزات والمآخذ الكهربائية العامة والأجهزة المنزلية والمكتبية المعتادة.'
                  : 'Standard gauge for general electrical sockets and everyday household or office appliances.'}
              </p>
            </div>

            <div className="bg-white border border-[#E4EAF1] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-[#102A43] tabular-nums">
                  4.0 - 6.0 مم²
                </span>
                <span className="text-xs font-medium text-[#3974C8] bg-[#EDF3F9] px-2.5 py-1 rounded">
                  {isAr ? 'الأحمال المتوسطة' : 'Dedicated Loads'}
                </span>
              </div>
              <p className="text-[14px] text-[#64748B] leading-relaxed">
                {isAr
                  ? 'مناسب للخطوط المستقلة الخاصة بوحدات التكييف وسخانات المياه وأجهزة المطابخ ذات الاستهلاك المرتفع.'
                  : 'Suited for dedicated circuits serving air conditioners, water heaters, and heavy kitchen appliances.'}
              </p>
            </div>

            <div className="bg-white border border-[#E4EAF1] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-[#102A43] tabular-nums">
                  10.0 - 25.0 مم²
                </span>
                <span className="text-xs font-medium text-[#3974C8] bg-[#EDF3F9] px-2.5 py-1 rounded">
                  {isAr ? 'التغذية الرئيسية' : 'Main Feeders'}
                </span>
              </div>
              <p className="text-[14px] text-[#64748B] leading-relaxed">
                {isAr
                  ? 'مخصص لخطوط التغذية الرئيسية والربط بين اللوحات الكهربائية الفرعية وأحمال المشاريع الكبيرة.'
                  : 'Designed for main feeder lines, sub-panel interconnections, and high-capacity project loads.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PRINTABLE / PDF OFFICIAL PRICE SHEET TEMPLATE                             */}
      {/* ========================================================================= */}
      <div
        id="printable-price-sheet"
        className="hidden print:block p-8 bg-white text-black font-sans"
        dir="rtl"
      >
        <div className="border-b-2 border-[#102A43] pb-4 mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#102A43] mb-1">
              شركة الإنارة الحديثة — بنغازي
            </h1>
            <h2 className="text-base font-semibold text-[#3974C8]">
              قائمة أسعار أسلاك النحاس الإيطالية (لفة 100 متر)
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              مرجع الأسعار الرسمي للعملاء والتجار والمختصين
            </p>
          </div>
          <div className="text-left text-xs text-gray-700 space-y-1">
            <div>
              آخر تحديث للأسعار: <strong className="text-black">{lastUpdateDate}</strong>
            </div>
            <div>
              العملة: <strong>دينار ليبي (د.ل)</strong>
            </div>
            <div>
              المرجع: <strong>enarahmodern.com/wire-prices</strong>
            </div>
          </div>
        </div>

        <table className="w-full text-right border-collapse text-xs mb-6">
          <thead>
            <tr className="bg-[#102A43] text-white">
              <th className="py-2.5 px-3 border border-gray-300 font-bold">مقاس السلك</th>
              <th className="py-2.5 px-3 border border-gray-300 font-bold">المواصفات</th>
              <th className="py-2.5 px-3 border border-gray-300 font-bold text-center">
                السعر الحالي (د.ل)
              </th>
              <th className="py-2.5 px-3 border border-gray-300 font-bold text-center">
                حركة السعر
              </th>
            </tr>
          </thead>
          <tbody>
            {wireRecords.map((wire) => (
              <tr key={wire.id} className="border border-gray-300">
                <td className="py-2.5 px-3 border border-gray-300 font-bold text-sm">
                  {wire.size}
                </td>
                <td className="py-2.5 px-3 border border-gray-300">
                  {wire.packageType} · {wire.manufacturer}
                </td>
                <td className="py-2.5 px-3 border border-gray-300 font-bold text-sm text-center">
                  {wire.price.toFixed(2)} د.ل
                </td>
                <td className="py-2.5 px-3 border border-gray-300 text-center">
                  {wire.trend === 'up' && wire.changeAmount !== undefined
                    ? `ارتفاع +${wire.changeAmount.toFixed(2)}`
                    : wire.trend === 'down' && wire.changeAmount !== undefined
                    ? `انخفاض ${wire.changeAmount.toFixed(2)}`
                    : 'مستقر'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border border-gray-300 p-3 rounded text-[11px] text-gray-700 leading-relaxed mb-6">
          <strong>ملاحظة:</strong> تعبر الأسعار الموضحة في هذه القائمة عن أسعار البيع المعتمدة لدى شركة الإنارة الحديثة (لفة 100 متر)، وتخضع للتحديث وفق نشرات التوريد الرسمية للشركة.
        </div>

        <div className="border-t border-gray-300 pt-3 text-[10px] text-gray-500 flex items-center justify-between">
          <span>شركة الإنارة الحديثة للمواد الكهربائية والإنارة — بنغازي، ليبيا</span>
          <span>enarahmodern.com/wire-prices</span>
        </div>
      </div>

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
