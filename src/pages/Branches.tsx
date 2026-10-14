import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, ArrowRight, ExternalLink, Navigation, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

export default function Branches() {
  const { isAr } = useLanguage()

  const branches = [
    {
      id: 'benghazi',
      name: isAr ? 'فرع بنغازي - الليثي' : 'Benghazi Branch - Al-Laythi',
      tag: isAr ? 'المعرض الرئيسي' : 'Flagship Showroom',
      address: isAr ? 'مقابل مدرسة العيد الفضي، بنغازي' : 'Opposite Silver Feast School, Benghazi',
      phones: ['0916580068', '0926580068'],
      hours: isAr ? 'من الساعة 8 صباحاً حتى الساعة 10 مساءً' : 'From 8:00 AM to 10:00 PM',
      mapsUrl: 'https://maps.google.com/?q=Benghazi+Al-Laythi+Libya'
    },
    {
      id: 'bayda-1',
      name: isAr ? 'فرع البيضاء الأول' : 'First Al-Bayda Branch',
      tag: isAr ? 'فرع البيضاء' : 'Al-Bayda Branch',
      address: isAr ? 'مفترق رويفع الأنصاري، البيضاء' : 'Ruwaifa Al-Ansari Intersection, Al-Bayda',
      phones: ['0911910600', '0921910600'],
      hours: isAr ? 'من الساعة 8 صباحاً حتى الساعة 10 مساءً' : 'From 8:00 AM to 10:00 PM',
      mapsUrl: 'https://maps.google.com/?q=Bayda+Libya'
    },
    {
      id: 'bayda-2',
      name: isAr ? 'فرع البيضاء الثاني' : 'Second Al-Bayda Branch',
      tag: isAr ? 'فرع البيضاء' : 'Al-Bayda Branch',
      address: isAr ? 'مقابل مول البكوش، البيضاء' : 'Opposite Al-Bakoosh Mall, Al-Bayda',
      phones: ['0919219100', '0929219100'],
      hours: isAr ? 'من الساعة 8 صباحاً حتى الساعة 10 مساءً' : 'From 8:00 AM to 10:00 PM',
      mapsUrl: 'https://maps.google.com/?q=Bayda+Libya'
    }
  ]

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans antialiased pb-20"
    >
      {/* =====================================================================
          01. Architectural Hero Header (Deep Corporate Navy #101820)
          ===================================================================== */}
      <section className="relative bg-[#101820] text-white pt-12 pb-14 overflow-hidden border-b border-[#202936]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#0062D2]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#0062D2] animate-pulse" />
                <span>{isAr ? 'معارضنا في ليبيا' : 'Showrooms in Libya'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {isAr ? 'فروعنا ومعارضنا المعتمدة' : 'Our Showrooms & Branches'}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {isAr
                  ? 'نسعد باستقبالكم في صالات عرض شركة الإنارة الحديثة في بنغازي والبيضاء للاطلاع على أحدث أنظمة الإنارة المعمارية، المفاتيح الذكية، وأسلاك النحاس الإيطالية المعتمدة.'
                  : 'Visit our flagship showrooms in Benghazi and Al-Bayda to experience cutting-edge architectural lighting, smart switches, and certified Italian electrical cables.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'المعرض الرئيسي: بنغازي - الليثي' : 'Flagship: Benghazi Al-Laythi'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'فروع البيضاء (فرعان)' : 'Al-Bayda (2 Branches)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'استشارات ومقايسات هندسية' : 'Technical Consultations'}</span>
                </div>
              </div>
            </div>

            {/* Quick Timing Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md lg:w-80 shrink-0 space-y-3">
              <div className="flex items-center gap-2 text-[#0062D2] font-semibold text-xs">
                <Clock className="w-4 h-4 text-[#0062D2]" />
                <span>{isAr ? 'مواعيد العمل الرسمية' : 'Official Working Hours'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'السبت - الخميس: من 8:30 صباحاً حتى 9:00 مساءً (الجمعة عطلة)'
                  : 'Saturday - Thursday: 8:30 AM to 9:00 PM (Friday Closed)'}
              </p>
              <div className="pt-2 border-t border-white/10">
                <a
                  href="tel:+218916580068"
                  className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isAr ? 'اتصال مباشر بالإدارة' : 'Call Head Office'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          02. Branches Grid
          ===================================================================== */}
      <main className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((b) => (
            <div
              key={b.id}
              className={`bg-white rounded-2xl p-7 border transition-all duration-300 flex flex-col justify-between group hover:shadow-lg relative overflow-hidden ${
                b.id === 'benghazi'
                  ? 'border-[#0062D2]/50 shadow-md ring-1 ring-[#0062D2]/20'
                  : 'border-[#E2E8F0] hover:border-slate-400'
              }`}
            >
              {/* Accent top bar */}
              <div
                className={`absolute top-0 inset-x-0 h-1.5 ${
                  b.id === 'benghazi' ? 'bg-[#0062D2]' : 'bg-slate-200 group-hover:bg-[#0062D2] transition-colors'
                }`}
              />

              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      b.id === 'benghazi'
                        ? 'bg-[#EBF3FC] text-[#0062D2] border-[#0062D2]/20'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {b.tag}
                  </span>
                  <a
                    href={b.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-slate-500 hover:text-[#0062D2] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{isAr ? 'الاتجاهات' : 'Directions'}</span>
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h3 className="text-xl font-bold text-[#15191E] mb-5 tracking-tight group-hover:text-[#0062D2] transition-colors">
                  {b.name}
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#0062D2] shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium text-[#15191E]">{b.address}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{b.hours}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono font-semibold text-[#15191E]" dir="ltr">
                      {b.phones.map((p, i) => (
                        <a
                          key={i}
                          href={`tel:+218${p.replace(/^0/, '')}`}
                          className="hover:text-[#0062D2] transition-colors"
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-slate-100 flex items-center gap-3">
                <a
                  href={`tel:+218${b.phones[0].replace(/^0/, '')}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#101820] hover:bg-[#0062D2] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isAr ? 'اتصال بالمعرض' : 'Call'}</span>
                </a>

                <a
                  href={`https://wa.me/218${b.phones[0].replace(/^0/, '')}?text=${encodeURIComponent(
                    isAr ? `مرحباً، أود الاستفسار عن أصناف متوفرة في ${b.name}` : `Hello, inquiring about products at ${b.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="واتساب"
                >
                  <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Commercial Logistics & Sales Shipping Info */}
        <div className="mt-14 p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-semibold text-[#0066FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
              <span>{isAr ? 'خدمة الشحن والتوريد لكافة المدن' : 'Nationwide Libya Supply'}</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#15191E]">
              {isAr ? 'التواصل مع قسم المبيعات للتوصيل والشحن لكافة مدن ليبيا' : 'Sales Department — Shipping & Delivery Across Libya'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {isAr
                ? 'توفر شركة الإنارة الحديثة خدمة الشحن والتسليم المباشر للمواد الكهربائية وكابلات التأسيس لكافة المدن والمناطق الليبية بالتنسيق مع شركات النقل المعتمدة عبر قسم المبيعات.'
                : 'Enarah Modern provides direct dispatch and shipping of certified electrical supplies to all Libyan cities via our dedicated sales department.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="tel:0916580068"
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2.5"
            >
              <Phone className="w-4 h-4" />
              <span dir="ltr" className="font-mono">0916580068</span>
              <span>·</span>
              <span>{isAr ? 'اتصال بالمبيعات' : 'Call Sales'}</span>
            </a>
            <a
              href={`https://wa.me/218916580068?text=${encodeURIComponent(
                isAr
                  ? 'مرحباً، أود التواصل مع قسم المبيعات بخصوص التوصيل والشحن لكافة مدن ليبيا'
                  : 'Hello, inquiring about sales shipping & delivery across Libya'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
              title={isAr ? 'واتساب المبيعات' : 'Sales WhatsApp'}
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'واتساب المبيعات' : 'WhatsApp'}</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
