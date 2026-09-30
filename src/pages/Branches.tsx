import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, ArrowRight, ExternalLink, Navigation } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

export default function Branches() {
  const { isAr } = useLanguage()

  const branches = [
    {
      id: 'tripoli',
      name: isAr ? 'المقر الرئيسي والمعرض المركزي — طرابلس' : 'Tripoli Main Showroom & HQ',
      tag: isAr ? 'المعرض الرئيسي' : 'Flagship Showroom',
      address: isAr
        ? 'طريق 20 رمضان (11 يونيو سابقاً) بالقرب من معهد النفط، طرابلس'
        : '20 Ramadan Road (formerly June 11), near Oil Institute, Tripoli',
      phones: ['+218912121303', '+218916580068'],
      hours: isAr ? 'السبت — الخميس: 9:00 ص – 8:30 م' : 'Sat — Thu: 9:00 AM – 8:30 PM',
      mapsUrl: 'https://maps.google.com/?q=32.8687,13.1672'
    },
    {
      id: 'benghazi',
      name: isAr ? 'معرض بنغازي — الليثي' : 'Benghazi Branch — Al-Laythi',
      tag: isAr ? 'فرع بنغازي' : 'Benghazi Branch',
      address: isAr ? 'الليثي، مقابل مدرسة العيد الفضي' : 'Al-Laythi, Opposite Silver Feast School',
      phones: ['+218916580068', '+218926580068'],
      hours: isAr ? 'السبت — الخميس: 8:30 ص – 9:00 م' : 'Sat — Thu: 8:30 AM – 9:00 PM',
      mapsUrl: 'https://maps.google.com/?q=Benghazi,Libya'
    },
    {
      id: 'bayda-1',
      name: isAr ? 'معرض البيضاء — مفترق رويفع الأنصاري' : 'Al-Bayda Branch 1 — Ruwaifa',
      tag: isAr ? 'فرع البيضاء' : 'Al-Bayda Branch',
      address: isAr ? 'مفترق رويفع الأنصاري، البيضاء' : 'Ruwaifa Al-Ansari Intersection, Al-Bayda',
      phones: ['+218911910600', '+218921910600'],
      hours: isAr ? 'السبت — الخميس: 8:30 ص – 9:00 م' : 'Sat — Thu: 8:30 AM – 9:00 PM',
      mapsUrl: 'https://maps.google.com/?q=Bayda,Libya'
    },
    {
      id: 'bayda-2',
      name: isAr ? 'معرض البيضاء — مقابل مول البكوش' : 'Al-Bayda Branch 2 — Al-Bakoosh',
      tag: isAr ? 'فرع البيضاء' : 'Al-Bayda Branch',
      address: isAr ? 'مقابل مول البكوش، البيضاء' : 'Opposite Al-Bakoosh Mall, Al-Bayda',
      phones: ['+218919219100', '+218929219100'],
      hours: isAr ? 'السبت — الخميس: 8:30 ص – 9:00 م' : 'Sat — Thu: 8:30 AM – 9:00 PM',
      mapsUrl: 'https://maps.google.com/?q=Bayda,Libya'
    }
  ]

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F7F8FA] text-[#15191E] font-sans antialiased selection:bg-[#0062D2] selection:text-white pt-24 pb-28"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#68717D] hover:text-[#0062D2] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Editorial Hero Header */}
        <div className="mb-14 sm:mb-18 max-w-3xl">
          <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3">
            SHOWROOMS & LOCATIONS
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#15191E] tracking-tight leading-[1.12] mb-5">
            شبكة معارضنا وفروعنا
          </h1>
          <p className="text-base sm:text-lg text-[#68717D] font-normal leading-relaxed">
            نسعد باستقبالكم في معارضنا للتعرف على تشكيلات الإنارة المعمارية وتجربة محاكاة درجات حرارة الضوء واستشارة مهندسينا المختصين.
          </p>
        </div>

        {/* Showrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-8 border border-[#E7EAF0] shadow-xs hover:border-[#0062D2]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-semibold text-[#0062D2] bg-[#EBF3FC] px-3.5 py-1 rounded-full border border-[#0062D2]/15">
                    {b.tag}
                  </span>
                  <a
                    href={b.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#68717D] hover:text-[#0062D2] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>الاتجاهات</span>
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h3 className="text-xl font-semibold text-[#15191E] mb-6 tracking-tight">
                  {b.name}
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-[#68717D]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#0062D2] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{b.address}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#0062D2] shrink-0 mt-0.5" />
                    <span>{b.hours}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#0062D2] shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-x-4 gap-y-1" dir="ltr">
                      {b.phones.map((p, i) => (
                        <a
                          key={i}
                          href={`tel:${p}`}
                          className="font-semibold text-[#15191E] hover:text-[#0062D2] transition-colors"
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E7EAF0] flex items-center justify-between">
                <a
                  href={`tel:${b.phones[0]}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#0062D2] hover:text-[#0047A5]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>اتصال مباشر بالمعرض</span>
                </a>
                <a
                  href={b.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#68717D] hover:text-[#15191E] inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
