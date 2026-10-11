import { useState } from 'react'
import { Link } from 'react-router-dom'
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

// الحالة التجارية الحالية: لا توجد عروض أو تخفيضات نشطة حالياً
// يتم الاحتفاظ بمصفوفة العروض لتدعم العروض المستقبلية تلقائياً
const ACTIVE_OFFERS: OfferItem[] = []

export default function Offers() {
  const { isAr } = useLanguage()
  const [offers] = useState<OfferItem[]>(ACTIVE_OFFERS)

  return (
    <div className="bg-white text-[#15191E] font-sans min-h-[60vh]">
      {/* 1. Page Header: Compact & Architectural */}
      <section className="pt-10 sm:pt-14 pb-6 border-b border-[#E7EAF0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#15191E] tracking-tight">
            {isAr ? 'العروض والتخفيضات' : 'Offers & Discounts'}
          </h1>
        </div>
      </section>

      {/* 2. Main Content: Swiss Minimalism */}
      <main className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
        {offers.length === 0 ? (
          <div className="max-w-md">
            <h2 className="text-lg sm:text-xl font-medium text-[#15191E] mb-2">
              {isAr ? 'لا توجد عروض متاحة حاليًا' : 'No active offers currently available'}
            </h2>
            <p className="text-sm text-[#68717D] mb-6 leading-relaxed">
              {isAr
                ? 'تابع هذه الصفحة للاطلاع على عروضنا القادمة.'
                : 'Check back regularly for upcoming promotional campaigns.'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#0062D2] text-white text-xs font-medium hover:bg-[#0047A5] transition-colors"
            >
              {isAr ? 'استعرض المنتجات' : 'Browse Products'}
            </Link>
          </div>
        ) : (
          /* Active Offers Grid when available in future */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const discountPercent = Math.round(
                ((offer.originalPrice - offer.discountPrice) / offer.originalPrice) * 100
              )

              return (
                <div
                  key={offer.id}
                  className="bg-white border border-[#E7EAF0] rounded-xl overflow-hidden hover:border-[#CBD5E1] transition-colors flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-[#0062D2] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {isAr ? `خصم ${discountPercent}%` : `${discountPercent}% OFF`}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-[#0062D2] font-medium block mb-1">
                        {offer.category}
                      </span>
                      <h3 className="text-base font-semibold text-[#15191E] mb-2">
                        {isAr ? offer.title : offer.titleEn}
                      </h3>
                      <p className="text-xs text-[#68717D] line-clamp-2 leading-relaxed mb-4">
                        {offer.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F1F3F7] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#94A3B8] line-through block leading-none mb-1">
                          {offer.originalPrice} د.ل
                        </span>
                        <span className="text-lg font-bold text-[#15191E] leading-none">
                          {offer.discountPrice} د.ل
                        </span>
                      </div>
                      <Link
                        to="/contact"
                        className="text-xs font-medium text-[#0062D2] hover:text-[#0047A5] px-3 py-1.5 rounded-lg border border-[#E7EAF0] hover:border-[#0062D2]/30 transition-colors"
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
      </main>
    </div>
  )
}
