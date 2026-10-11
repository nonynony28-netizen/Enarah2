import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  ShoppingCart,
  Check,
  Star,
  Share2,
  Copy,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { useCart } from '../hooks/useCart'
import WireAnatomyScroll from '../components/WireAnatomyScroll'

export type TrendType = 'up' | 'down' | 'same'

export interface WirePriceRecord {
  id: string
  size: string
  sizeEn: string
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
  const { addToCart, triggerFlyAnimation } = useCart()

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
    return ['1.5', '2.5'] // Initial helpful defaults
  })

  // Cart & Share states
  const [addingId, setAddingId] = useState<string | null>(null)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const [selectedChartWireId, setSelectedChartWireId] = useState('1.5')
  const [showAnatomy, setShowAnatomy] = useState(false)

  // Toggle Favorite
  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      localStorage.setItem('enarah_fav_wire_sizes', JSON.stringify(updated))
      return updated
    })
  }

  // 2. Data Fetching & Strict Audit (Section 06 & 08: Real consecutive comparisons)
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

            // Format actual publication timestamp (Never fake today's date)
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

  // Sort: Favorites first without hiding anything
  const sortedWires = useMemo(() => {
    return [...wireRecords].sort((a, b) => {
      const aFav = favoriteIds.includes(a.id)
      const bFav = favoriteIds.includes(b.id)
      if (aFav && !bFav) return -1
      if (!aFav && bFav) return 1
      return 0
    })
  }, [wireRecords, favoriteIds])

  // Cart Action
  const handleAddToCart = (e: React.MouseEvent, wire: WirePriceRecord) => {
    const itemId = `wire-${wire.id}`
    triggerFlyAnimation(e.clientX, e.clientY)
    setAddingId(itemId)
    addToCart({
      id: itemId,
      name: isAr ? `سلك نحاس إيطالي مقاس ${wire.size}` : `Italian Copper Wire ${wire.sizeEn}`,
      description: isAr ? `${wire.packageType} · نحاس نقي 100%` : `${wire.packageTypeEn} · 100% Pure Copper`,
      image: '/images/cat-cables.jpg',
      price: wire.price
    })
    setTimeout(() => {
      setAddingId(null)
    }, 1200)
  }

  // Share Functionality (Section 11)
  const handleShare = useCallback(async () => {
    const shareTitle = isAr ? 'أسعار أسلاك النحاس الإيطالية | الإنارة الحديثة' : 'Italian Copper Wire Prices | Enarah Modern'
    const shareText = isAr
      ? `تابع المؤشر اليومي المعتمد لأسعار أسلاك النحاس الإيطالية الأصلية (نحاس نقي 100%): ${window.location.href}`
      : `Check official certified Italian copper wire prices (100% pure copper): ${window.location.href}`

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
      await navigator.clipboard.writeText(window.location.href)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2500)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }, [isAr])

  // Real Historical Data (Section 07: Strictly NO synthetic generation)
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans pb-24">
      {/* 01. Compact Header (Section 04: Real publication timestamp & clean typography) */}
      <header className="pt-10 sm:pt-14 pb-7 border-b border-[#E7EAF0] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#15191E] tracking-tight mb-1">
                {isAr ? 'أسعار أسلاك النحاس الإيطالية' : 'Italian Copper Wire Prices'}
              </h1>
              <p className="text-sm text-[#68717D]">
                {isAr ? 'المؤشر اليومي المعتمد لأسعار أسلاك النحاس الإيطالية الأصلية 100% (لفة 100 متر).' : 'Daily official price index for 100% pure copper certified Italian wires (100m rolls).'}
              </p>
            </div>

            {/* Header Actions: Actual Publication Date + Share Action */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E7EAF0] text-xs text-[#68717D]">
                <Calendar className="w-3.5 h-3.5 text-[#0062D2]" />
                <span>
                  {isAr ? 'آخر تحديث للأسعار:' : 'Last Updated:'}{' '}
                  <strong className="font-semibold text-[#15191E]">{lastUpdateDate}</strong>
                </span>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E7EAF0] hover:bg-slate-50 text-xs font-medium text-[#15191E] transition-colors cursor-pointer"
                title={isAr ? 'مشاركة رابط الأسعار' : 'Share Price Index'}
              >
                {copyFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">{isAr ? 'تم نسخ الرابط' : 'Link Copied'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#68717D]" />
                    <span>{isAr ? 'مشاركة الأسعار' : 'Share Prices'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 10: Market Price Transparency Notice */}
          <div className="mt-4 pt-3 border-t border-[#F1F3F7] flex items-center gap-2 text-xs text-[#68717D]">
            <Info className="w-3.5 h-3.5 text-[#0062D2] shrink-0" />
            <span>
              {isAr
                ? 'جميع الأسلاك في هذا المؤشر هي أسلاك نحاس نقي 100% صناعة إيطالية معتمدة، وفق أسعار البيع الرسمية لدى شركة الإنارة الحديثة في بنغازي (لفة 100 متر أصلية من المصنع مباشرة).'
                : 'All wires in this index are certified 100% pure copper made in Italy, reflecting official showroom rates at Enarah Modern, Benghazi (100m factory rolls).'}
            </span>
          </div>
        </div>
      </header>

      {/* 02. Daily Price Index (Section 05: Directly below header) */}
      <main className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12">
        
        {/* Table Container */}
        <div className="bg-white border border-[#E7EAF0] rounded-xl overflow-hidden shadow-xs mb-12">
          
          {/* Table Header Bar */}
          <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E7EAF0] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#15191E] uppercase tracking-wider">
              {isAr ? 'جدول أسعار أسلاك النحاس الإيطالية المعتمدة (نحاس نقي 100% - لفة 100 متر)' : 'Certified Italian Copper Wire Schedule (100% Pure Copper · 100m Roll)'}
            </span>
            <span className="text-xs text-[#68717D]">
              {isAr ? 'العملة: دينار ليبي (د.ل)' : 'Currency: LYD'}
            </span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="border-b border-[#E7EAF0] text-xs font-medium text-[#68717D] bg-white">
                  <th className="py-3 px-4 w-12 text-center">{isAr ? 'تثبيت' : 'Pin'}</th>
                  <th className="py-3 px-5">{isAr ? 'المقاس' : 'Wire Size'}</th>
                  <th className="py-3 px-5">{isAr ? 'المواصفة والتعبئة' : 'Specification'}</th>
                  <th className="py-3 px-5">{isAr ? 'السعر المنشور' : 'Published Price'}</th>
                  <th className="py-3 px-5">{isAr ? 'حركة السعر' : 'Price Change'}</th>
                  <th className="py-3 px-5 text-center">{isAr ? 'طلب سريع' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7EAF0] text-xs sm:text-sm">
                {sortedWires.map((wire) => {
                  const isFav = favoriteIds.includes(wire.id)
                  const isAdding = addingId === `wire-${wire.id}`

                  return (
                    <tr
                      key={wire.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isFav ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Favorite Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleFavorite(wire.id)}
                          className="p-1 rounded-md text-[#94A3B8] hover:text-amber-500 transition-colors cursor-pointer"
                          title={isFav ? (isAr ? 'إلغاء التثبيت' : 'Unpin') : (isAr ? 'تثبيت في الأعلى' : 'Pin to top')}
                          aria-label={isFav ? 'Unpin wire size' : 'Pin wire size'}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isFav ? 'fill-amber-400 text-amber-500' : 'text-[#CBD5E1]'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Wire Size */}
                      <td className="py-4 px-5">
                        <span className="font-semibold text-base text-[#15191E] tracking-tight">
                          {isAr ? wire.size : wire.sizeEn}
                        </span>
                      </td>

                      {/* Specification & Manufacturer */}
                      <td className="py-4 px-5">
                        <div className="text-xs text-[#15191E] font-medium">
                          {isAr ? wire.packageType : wire.packageTypeEn}
                        </div>
                        <span className="text-[11px] text-[#68717D]">
                          {isAr ? wire.manufacturer : wire.manufacturerEn}
                        </span>
                      </td>

                      {/* Current Published Price */}
                      <td className="py-4 px-5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-[#15191E] tabular-nums">
                            {wire.price.toFixed(2)}
                          </span>
                          <span className="text-xs text-[#68717D]">{isAr ? 'د.ل' : 'LYD'}</span>
                        </div>
                      </td>

                      {/* Price Change Indicator (Section 06: Truthful, restrained colors) */}
                      <td className="py-4 px-5">
                        {wire.trend === 'up' && wire.changeAmount !== undefined ? (
                          <div className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="tabular-nums">+{wire.changeAmount.toFixed(2)} د.ل</span>
                            {wire.changePercent && (
                              <span className="text-[10px] text-rose-500">({wire.changePercent}%)</span>
                            )}
                          </div>
                        ) : wire.trend === 'down' && wire.changeAmount !== undefined ? (
                          <div className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span className="tabular-nums">{wire.changeAmount.toFixed(2)} د.ل</span>
                            {wire.changePercent && (
                              <span className="text-[10px] text-emerald-600">({wire.changePercent}%)</span>
                            )}
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-xs text-[#68717D] bg-slate-100 px-2 py-0.5 rounded-md">
                            <Minus className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <span>{isAr ? 'مستقر' : 'Stable'}</span>
                          </div>
                        )}
                      </td>

                      {/* Compact Secondary Cart Action (Section 13) */}
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={(e) => handleAddToCart(e, wire)}
                          disabled={isAdding}
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            isAdding
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border border-[#E7EAF0] text-[#15191E] hover:border-[#0062D2] hover:text-[#0062D2]'
                          }`}
                        >
                          {isAdding ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{isAr ? 'أُضيف' : 'Added'}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{isAr ? 'إضافة للسلة' : 'Add'}</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Rows (Section 15: Clean, legible, touch-friendly) */}
          <div className="md:hidden divide-y divide-[#E7EAF0]">
            {sortedWires.map((wire) => {
              const isFav = favoriteIds.includes(wire.id)
              const isAdding = addingId === `wire-${wire.id}`

              return (
                <div
                  key={wire.id}
                  className={`p-4 transition-colors ${isFav ? 'bg-amber-50/20' : 'bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(wire.id)}
                        className="p-1 rounded text-[#94A3B8] hover:text-amber-500 cursor-pointer"
                        aria-label="Toggle pin"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isFav ? 'fill-amber-400 text-amber-500' : 'text-[#CBD5E1]'
                          }`}
                        />
                      </button>
                      <div>
                        <span className="font-bold text-base text-[#15191E] block">
                          {isAr ? wire.size : wire.sizeEn}
                        </span>
                        <span className="text-xs text-[#68717D]">
                          {isAr ? wire.packageType : wire.packageTypeEn}
                        </span>
                      </div>
                    </div>

                    {/* Price in LYD */}
                    <div className="text-left">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#15191E] tabular-nums">
                          {wire.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-[#68717D]">{isAr ? 'د.ل' : 'LYD'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Footer: Trend Indicator & Compact Cart Button */}
                  <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[#F1F3F7]">
                    <div>
                      {wire.trend === 'up' && wire.changeAmount !== undefined ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          <TrendingUp className="w-3 h-3" />
                          <span>+{wire.changeAmount.toFixed(2)} د.ل</span>
                        </span>
                      ) : wire.trend === 'down' && wire.changeAmount !== undefined ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <TrendingDown className="w-3 h-3" />
                          <span>{wire.changeAmount.toFixed(2)} د.ل</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#68717D] bg-slate-100 px-2 py-0.5 rounded">
                          <Minus className="w-3 h-3 text-[#94A3B8]" />
                          <span>{isAr ? 'مستقر' : 'Stable'}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, wire)}
                      disabled={isAdding}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isAdding
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#F8FAFC] border border-[#E7EAF0] text-[#15191E] hover:border-[#0062D2]'
                      }`}
                    >
                      {isAdding ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{isAr ? 'أُضيف' : 'Added'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{isAr ? 'إضافة للسلة' : 'Add'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

        {/* 03. Price History Component (Section 07: Truthful, NO fake charts) */}
        <section className="bg-white border border-[#E7EAF0] rounded-xl p-6 sm:p-8 mb-12 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#15191E] tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0062D2]" />
                <span>{isAr ? 'حركة الأسعار التاريخية' : 'Historical Price Movement'}</span>
              </h2>
              <p className="text-xs text-[#68717D] mt-0.5">
                {isAr
                  ? 'رصد مسار الأسعار المنشورة رسمياً وفق التحديثات المعتمدة.'
                  : 'Track official consecutive price publications.'}
              </p>
            </div>

            {/* Wire Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_WIRES.map((wire) => (
                <button
                  key={wire.id}
                  onClick={() => setSelectedChartWireId(wire.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    selectedChartWireId === wire.id
                      ? 'bg-[#15191E] text-white'
                      : 'bg-[#F8FAFC] text-[#68717D] hover:bg-slate-100'
                  }`}
                >
                  {wire.id} مم
                </button>
              ))}
            </div>
          </div>

          {/* Truthful rendering: Only display if real historical data exists */}
          {realHistory.length >= 2 ? (
            <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E7EAF0]">
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
                            strokeWidth="2"
                            points={points}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {realHistory.map((d, i) => {
                            const x = 50 + (i / (realHistory.length - 1)) * 410
                            const y = 150 - ((d.price - minP) / range) * 120
                            return (
                              <g key={i}>
                                <circle cx={x} cy={y} r="3.5" fill="#FFFFFF" stroke="#0062D2" strokeWidth="2" />
                                <text x={x} y={y - 8} fill="#0062D2" fontSize="9" fontWeight="bold" textAnchor="middle">
                                  {d.price.toFixed(2)}
                                </text>
                                <text x={x} y="166" fill="#68717D" fontSize="8.5" textAnchor="middle">
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
            <div className="bg-[#F8FAFC] rounded-lg p-6 border border-[#E7EAF0] text-center">
              <span className="text-xs text-[#68717D] block mb-1">
                {isAr
                  ? 'البيانات التاريخية قيد التوثيق والتسجيل الدوري'
                  : 'Historical records are currently accumulating'}
              </span>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                {isAr
                  ? 'يبدأ المخطط البياني برسم منحنى التغير فور نشر تحديثات سعرية متتالية عبر لوحة الاعتماد.'
                  : 'The visual price chart will automatically plot consecutive movements as new verified price updates are published.'}
              </p>
            </div>
          )}
        </section>

        {/* 04. Educational Anatomy Section (Section 14: Moved below pricing index, compact/expandable) */}
        <section className="bg-white border border-[#E7EAF0] rounded-xl overflow-hidden shadow-xs">
          <button
            onClick={() => setShowAnatomy(!showAnatomy)}
            className="w-full p-5 sm:p-6 flex items-center justify-between text-right hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#15191E] flex items-center gap-2">
                <span>{isAr ? 'التشريح الهندسي لأسلاك النحاس الإيطالية' : 'Technical Anatomy of Italian Copper Wires'}</span>
              </h2>
              <p className="text-xs text-[#68717D] mt-0.5">
                {isAr
                  ? 'تعرف على طبقات النحاس النقي 100% والعزل الحراري الإيطالي المعتمد لمقاومة الأحمال والحرارة.'
                  : 'Interactive layer breakdown of 100% pure copper core and certified insulation.'}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E7EAF0] text-[#68717D]">
              {showAnatomy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showAnatomy && (
            <div className="border-t border-[#E7EAF0] p-4 sm:p-6 bg-[#F8FAFC]">
              <WireAnatomyScroll />
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
