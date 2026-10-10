import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tag, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export interface OfferItem {
  id: string
  title: string
  titleEn: string
  category: string
  originalPrice: number
  discountPrice: number
  startDate?: string
  endDate?: string
  image: string
  description: string
}

// ⚠️ الحالة التجارية الحالية: لا توجد عروض أو تخفيضات نشطة حالياً
// تم إعداد المصفوفة فارغة لتعرض الحالة الفارغة الراقية، وفي حال إضافة أي عرض مستقبلاً يتم عرضه تلقائياً
const ACTIVE_OFFERS: OfferItem[] = []

export default function Offers() {
  const { isAr } = useLanguage()
  const [offers] = useState<OfferItem[]>(ACTIVE_OFFERS)

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans pb-24">
      {/* 1. Page Hero: Architectural Clean Header */}
      <section className="relative pt-12 sm:pt-16 pb-12 sm:pb-16 border-b border-[#E7EAF0] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3 font-mono">
              VERIFIED PROMOTIONS & CAMPAIGNS
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#15191E] tracking-tight leading-tight mb-4">
              {isAr ? 'التخفيضات والعروض' : 'Offers & Discounts'}
            </h1>
            <p className="text-base sm:text-lg text-[#68717D] font-normal leading-relaxed">
              {isAr
                ? 'الحملات الترويجية والخصومات الموسمية المعتمدة رسمياً من شركة الإنارة الحديثة على أصناف ومقاسات مختارة.'
                : 'Official certified campaigns and seasonal promotional offerings from Enarah Modern.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Offers Body: Empty State or Active Offer Cards */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        {offers.length === 0 ? (
          /* Premium Architectural Empty State (No childish illustrations, strictly corporate & clean) */
          <div className="max-w-xl mx-auto bg-white border border-[#E7EAF0] rounded-3xl p-10 sm:p-14 text-center shadow-card">
            {/* Minimal Geometric Badge */}
            <div className="w-16 h-16 rounded-2xl bg-[#0062D2]/8 border border-[#0062D2]/15 flex items-center justify-center text-[#0062D2] mx-auto mb-6">
              <Tag className="w-7 h-7" />
            </div>

            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2 font-mono">
              CURRENT STATUS
            </span>

            <h2 className="text-2xl sm:text-3xl font-semibold text-[#15191E] tracking-tight mb-4">
              {isAr ? 'لا توجد عروض متاحة حاليًا' : 'No Active Offers Currently'}
            </h2>

            <p className="text-sm sm:text-base text-[#68717D] leading-relaxed mb-8">
              {isAr
                ? 'جميع منتجات الأسلاك والمواد الكهربائية معروضة حاليًا بالأسعار الرسمية المعتمدة من المصنع مباشرة بنحاس نقي 100%. يمكنك تصفح الكتالوج الشامل أو الاطلاع على جدول الأسعار المحدث.'
                : 'All electrical products and certified wires are currently available at official factory prices with 100% pure copper. You can browse our active wire catalog or view daily wire price lists.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="w-full sm:w-auto enarah-btn-primary text-xs"
              >
                <span>{isAr ? 'تصفح كتالوج الأسلاك المعتمد' : 'Browse Wire Catalog'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>

              <Link
                to="/wire-prices"
                className="w-full sm:w-auto enarah-btn-secondary text-xs"
              >
                <span>{isAr ? 'جدول أسعار الأسلاك' : 'Wire Price Table'}</span>
              </Link>
            </div>

            <div className="mt-10 pt-6 border-t border-[#F1F3F7] flex items-center justify-center gap-2 text-xs text-[#68717D]">
              <ShieldCheck className="w-4 h-4 text-[#0062D2]" />
              <span>{isAr ? 'الأسعار الرسمية بدون وساطة من المصنع مباشرة' : 'Direct certified factory pricing'}</span>
            </div>
          </div>
        ) : (
          /* Future Active Offers Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => {
              const discountPercent = Math.round(
                ((offer.originalPrice - offer.discountPrice) / offer.originalPrice) * 100
              )

              return (
                <div
                  key={offer.id}
                  className="bg-white border border-[#E7EAF0] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-[#DC2626] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {isAr ? `خصم ${discountPercent}%` : `${discountPercent}% OFF`}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-[#0062D2] font-semibold block mb-1">
                        {offer.category}
                      </span>
                      <h3 className="text-lg font-semibold text-[#15191E] mb-2">
                        {isAr ? offer.title : offer.titleEn}
                      </h3>
                      <p className="text-xs text-[#68717D] line-clamp-2 leading-relaxed mb-4">
                        {offer.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#F1F3F7] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#94A3B8] line-through block leading-none mb-1">
                          {offer.originalPrice} د.ل
                        </span>
                        <span className="text-xl font-bold text-[#DC2626] leading-none">
                          {offer.discountPrice} د.ل
                        </span>
                      </div>
                      <Link
                        to="/contact"
                        className="enarah-btn-primary text-xs py-2 px-4"
                      >
                        {isAr ? 'اطلب العرض' : 'Order'}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
