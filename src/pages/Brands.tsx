import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, ExternalLink, ShieldCheck, Globe, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

export default function Brands() {
  const { isAr } = useLanguage()

  const brands = [
    {
      id: 'legrand',
      name: 'Legrand',
      origin: isAr ? 'فرنسا 🇫🇷' : 'France 🇫🇷',
      category: isAr ? 'مفاتيح وتحكم ذكي' : 'Smart Switches & Controls',
      description: isAr
        ? 'شركة فرنسية عالمية رائدة في مجال البنية التحتية الكهربائية والرقمية للمباني، وتشتهر بمفاتيح التوصيل الفاخرة وأنظمة التحكم الذكية.'
        : 'A French global leader in electrical and digital building infrastructures, renowned for premium wiring devices and smart control systems.',
      logoUrl: '/images/brand-legrand.png?v=2'
    },
    {
      id: 'philips',
      name: 'Philips',
      origin: isAr ? 'هولندا 🇳🇱' : 'Netherlands 🇳🇱',
      category: isAr ? 'إنارة LED موفرة' : 'LED Lighting & Smart Bulbs',
      description: isAr
        ? 'الرائد العالمي في مجال حلول الإضاءة المبتكرة، ومصابيح LED الموفرة للطاقة، وأنظمة الإضاءة الفنية الفاخرة.'
        : 'The global pioneer in innovative lighting solutions, energy-efficient LED technology, and premium smart home lighting systems.',
      logoUrl: '/images/brand-philips.png?v=2'
    },
    {
      id: 'gewiss',
      name: 'Gewiss',
      origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹',
      category: isAr ? 'تشغيل آلي وتوزيع طاقة' : 'Automation & Power',
      description: isAr
        ? 'علامة إيطالية فاخرة متخصصة في أنظمة التشغيل الآلي للمباني، وتوزيع الطاقة، وحلول الإنارة الفنية والصناعية المتكاملة.'
        : 'A luxury Italian brand specialized in building automation, power distribution, and advanced technical/industrial lighting systems.',
      logoUrl: '/images/brand-gewiss.png?v=2'
    },
    {
      id: 'chint',
      name: 'CHINT',
      origin: isAr ? 'الصين 🇨🇳' : 'China 🇨🇳',
      category: isAr ? 'قواطع آمنة ومعدات طاقة' : 'Power Breakers & Protection',
      description: isAr
        ? 'مجموعة عالمية كبرى لإنتاج وتطوير معدات توزيع الكهرباء ذات الجهد المنخفض، والقواطع الآمنة، وأنظمة الحماية الكهربائية.'
        : 'A leading global provider of smart energy solutions, low-voltage electrical distribution gear, and advanced protective systems.',
      logoUrl: '/images/brand-chint.png?v=2'
    },
    {
      id: 'wellmax',
      name: 'WELLMAX',
      origin: isAr ? 'الصين 🇨🇳' : 'China 🇨🇳',
      category: isAr ? 'تكنولوجيا Samsung LED' : 'Samsung LED Lighting',
      description: isAr
        ? 'عملاق تكنولوجيا مصابيح LED המتميز باستخدام شرائح إضاءة متطورة من شركة Samsung، مع ضمان معتمد لكافة المنتجات.'
        : 'A renowned global LED giant, featuring advanced Samsung LED chips, and offering certified warranties on all products.',
      logoUrl: '/images/brand-wellmax.png?v=2'
    },
    {
      id: 'alfanar',
      name: 'Alfanar',
      origin: isAr ? 'السعودية 🇸🇦' : 'Saudi Arabia 🇸🇦',
      category: isAr ? 'كابلات ولوحات توزيع' : 'Cables & Distribution Boards',
      description: isAr
        ? 'من أكبر الشركات الإقليمية تصنيعاً للكابلات النحاسية، ولوحات التوزيع الكهربائية الآمنة، والمفاتيح والأفياش المقاومة للحريق.'
        : 'A leading regional powerhouse in manufacturing premium cables, electrical distribution boards, and fire-resistant wiring accessories.',
      logoUrl: '/images/brand-alfanar.png?v=2'
    },
    {
      id: 'fumagalli',
      name: 'Fumagalli',
      origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹',
      category: isAr ? 'إنارة حدائق ضد الصدأ' : 'Rustproof Outdoor Lighting',
      description: isAr
        ? 'الشركة الإيطالية الأولى عالمياً في إنتاج إضاءات الحدائق والإنارة الخارجية المقاومة للصدأ والتآكل بفضل مادة الراتنج الفريدة.'
        : 'The ultimate Italian manufacturer of outdoor and garden lighting, famous for rust-free and shockproof resin composite posts.',
      logoUrl: '/images/brand-fumagalli.png?v=2'
    },
    {
      id: 'commax',
      name: 'Commax',
      origin: isAr ? 'كوريا الجنوبية 🇰🇷' : 'South Korea 🇰🇷',
      category: isAr ? 'إنترفون واتصال مرئي' : 'Intercom & Smart Video',
      description: isAr
        ? 'الشركة الكورية الرائدة في أنظمة الإنترفون الصوتي والمرئي، وحلول المنازل الذكية، والتأمين الرقمي للمباني السكنية والتجارية.'
        : 'The leading Korean brand in smart video door phones, intercom systems, and home automation solutions.',
      logoUrl: '/images/brand-commax.png?v=2'
    },
    {
      id: 'cata',
      name: 'CATA',
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
      category: isAr ? 'سبوت لايت وإضاءة ديكورية' : 'Spotlights & Modern Decor',
      description: isAr
        ? 'علامة تركية متميزة في تقديم تشكيلات واسعة من إضاءات السبوت لايت، والمصابيح الديكورية الموفرة، ولمبات الإنارة المعمارية.'
        : 'A prominent Turkish brand providing versatile spotlights, architectural decorative lamps, and energy-saving lighting.',
      logoUrl: '/images/brand-cata.png?v=2'
    },
    {
      id: 'borsan',
      name: 'Borsan',
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
      category: isAr ? 'كابلات نحاسية معتمدة' : 'Certified Copper Cables',
      description: isAr
        ? 'من كبرى المصانع التركية المنتجة للكابلات الكهربائية النحاسية عالية التوصيل، وكابلات الاتصالات وتجهيزات التركيب الكهربائي.'
        : 'One of the leading Turkish manufacturers of highly conductive copper electrical cables, telecom wires, and wiring equipment.',
      logoUrl: '/images/brand-borsan.png?v=2'
    },
    {
      id: 'makel',
      name: 'Makel',
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
      category: isAr ? 'مفاتيح ومقابس حماية' : 'Switches & Safety Outlets',
      description: isAr
        ? 'شركة صناعية تركية رائدة في إنتاج المفاتيح الكهربائية، والمقابس، وقواطع الدورة الفردية والثنائية للحماية من الالتماس.'
        : 'A Turkish pioneer in producing premium electrical switches, wall sockets, and safety circuit breakers for electric protection.',
      logoUrl: '/images/brand-makel.png?v=2'
    },
    {
      id: 'isildar',
      name: 'Isildar',
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
      category: isAr ? 'تأسيس وإنارة اقتصادية' : 'Foundation & Lighting',
      description: isAr
        ? 'أنظمة إضاءة ومواد تأسيس كهربائي تركية مبتكرة مصممة لأقسى ظروف العمل وتوفر تكلفة تشغيل اقتصادية.'
        : 'Innovative Turkish lighting and wiring installation brands designed for heavy duty performance and cost-effective operations.',
      logoUrl: '/images/brand-isildar.png?v=2'
    },
    {
      id: 'icc',
      name: 'ICC',
      origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹',
      category: isAr ? 'إكسسوارات توصيل متطورة' : 'Wiring & Connectors',
      description: isAr
        ? 'أنظمة إنارة كهربائية متطورة وإكسسوارات توصيل كهربائي مصممة للمباني والمشاريع الكبرى بموثوقية وجودة عالية.'
        : 'Advanced electrical lighting fixtures and connection accessories designed for high-reliability building installations.',
      logoUrl: '/images/brand-icc.png?v=2'
    },
    {
      id: 'geros',
      name: 'Geros',
      origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹',
      category: isAr ? 'علب توزيع مضادة للماء' : 'Waterproof Junction Boxes',
      description: isAr
        ? 'شركة إيطالية لإنتاج علب التوزيع الكهربائية المقاومة للماء، وصناديق التوصيل، وخزائن المفاتيح الفاخرة.'
        : 'A classic Italian manufacturer of waterproof distribution boards, junction boxes, and premium circuit breaker enclosures.',
      logoUrl: '/images/brand-geros.png?v=2'
    }
  ]

  const [selectedFilter, setSelectedFilter] = useState('all')

  const originFilters = [
    { key: 'all', label: isAr ? 'جميع العلامات' : 'All Brands' },
    { key: 'europe', label: isAr ? 'العلامات الأوروبية 🇪🇺' : 'European Brands 🇪🇺' },
    { key: 'turkey', label: isAr ? 'العلامات التركية 🇹🇷' : 'Turkish Brands 🇹🇷' },
    { key: 'global', label: isAr ? 'العلامات الدولية الأخرى' : 'Other International' }
  ]

  const filteredBrands = brands.filter((b) => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'europe') {
      return (
        b.origin.includes('فرنسا') ||
        b.origin.includes('هولندا') ||
        b.origin.includes('إيطاليا')
      )
    }
    if (selectedFilter === 'turkey') return b.origin.includes('تركيا')
    if (selectedFilter === 'global') {
      return (
        b.origin.includes('الصين') ||
        b.origin.includes('السعودية') ||
        b.origin.includes('كوريا')
      )
    }
    return true
  })

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
            OUR BRANDS
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#15191E] tracking-tight leading-[1.12] mb-5">
            شراكات مع علامات عالمية
          </h1>
          <p className="text-base sm:text-lg text-[#68717D] font-normal leading-relaxed">
            نتعاون مع كبرى الشركات المصنعة في أوروبا وحول العالم لضمان مطابقة أعلى معايير الجودة والسلامة والكفاءة الكهربائية.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-[#E7EAF0]">
          {originFilters.map((tab) => {
            const active = selectedFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedFilter(tab.key)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#15191E] text-white shadow-sm'
                    : 'bg-white text-[#68717D] border border-[#E7EAF0] hover:text-[#15191E] hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredBrands.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-7 border border-[#E7EAF0] shadow-xs hover:border-[#0062D2]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Logo and Origin Bar */}
                <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E7EAF0]">
                  <div className="h-14 w-32 flex items-center justify-start">
                    <img
                      src={b.logoUrl}
                      alt={b.name}
                      loading="lazy"
                      className="max-h-12 max-w-[120px] object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#68717D] font-medium bg-[#F7F8FA] px-3 py-1 rounded-full border border-[#E7EAF0]">
                    {b.origin}
                  </span>
                </div>

                {/* Name & Category */}
                <div className="mb-3">
                  <span className="text-[11px] font-semibold text-[#0062D2] tracking-wider uppercase block mb-1">
                    {b.category}
                  </span>
                  <h3 className="text-xl font-semibold text-[#15191E] tracking-tight">{b.name}</h3>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#68717D] leading-relaxed font-normal">
                  {b.description}
                </p>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-[#E7EAF0] flex items-center justify-between text-xs font-semibold text-[#0062D2]">
                <Link
                  to={`/products?brand=${b.id}`}
                  className="hover:text-[#0047A5] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>استكشف منتجات {b.name}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>

        {/* Global Quality Guarantee Callout */}
        <div className="bg-[#101820] text-white rounded-3xl p-10 sm:p-14 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
              AUTHORIZED DISTRIBUTION
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              ضمان الأصالة والمواصفات القياسية
            </h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal mb-8">
              كافة المواد والمنتجات التي توفرها الإنارة الحديثة مستوردة مباشرة ومعتمدة بشهادات جودة واختبارات سلامة تضمن كفاءتها في الشبكات الكهربائية الليبية.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors"
            >
              <span>طلب تسعيرة أو اعتماد مشاريع</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
