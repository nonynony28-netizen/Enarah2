import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Sparkles, Layers, ImagePlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import EnarahProductsCarousel from '../components/EnarahProductsCarousel'

// مكون الأنيميشن السريع
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  )
}

export default function Brands() {
  const { isAr } = useLanguage()

  const brands = [
    {
      id: 'legrand',
      name: 'Legrand',
      origin: isAr ? 'فرنسا 🇫🇷' : 'France 🇫🇷',
      description: isAr 
        ? 'شركة فرنسية عالمية رائدة في مجال البنية التحتية الكهربائية والرقمية للمباني، وتشتهر بمفاتيح التوصيل الفاخرة وأنظمة التحكم الذكية.'
        : 'A French global leader in electrical and digital building infrastructures, renowned for premium wiring devices and smart control systems.',
      logoUrl: '/images/brand-legrand.png?v=2'
    },
    {
      id: 'philips',
      name: 'Philips',
      origin: isAr ? 'هولندا 🇳🇱' : 'Netherlands 🇳🇱',
      description: isAr 
        ? 'الرائد العالمي في مجال حلول الإضاءة المبتكرة، ومصابيح LED الموفرة للطاقة، وأنظمة الإضاءة الذكية الفاخرة.'
        : 'The global pioneer in innovative lighting solutions, energy-efficient LED technology, and premium smart home lighting systems.',
      logoUrl: '/images/brand-philips.png?v=2'
    },
    {
      id: 'gewiss',
      name: 'Gewiss',
      origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹',
      description: isAr 
        ? 'علامة إيطالية فاخرة متخصصة في أنظمة التشغيل الآلي للمباني، وتوزيع الطاقة، وحلول الإنارة الفنية والصناعية المتكاملة.'
        : 'A luxury Italian brand specialized in building automation, power distribution, and advanced technical/industrial lighting systems.',
      logoUrl: '/images/brand-gewiss.png?v=2'
    },
    {
      id: 'chint',
      name: 'CHINT',
      origin: isAr ? 'الصين 🇨🇳' : 'China 🇨🇳',
      description: isAr 
        ? 'مجموعة عالمية كبرى لإنتاج وتطوير معدات توزيع الكهرباء ذات الجهد المنخفض، والقواطع الآمنة، وأنظمة الحماية الكهربائية.'
        : 'A leading global provider of smart energy solutions, low-voltage electrical distribution gear, and advanced protective systems.',
      logoUrl: '/images/brand-chint.png?v=2'
    },
    {
      id: 'wellmax',
      name: 'WELLMAX',
      origin: isAr ? 'الصين 🇨🇳' : 'China 🇨🇳',
      description: isAr 
        ? 'عملاق تكنولوجيا مصابيح LED الملقب بـ "ملك اللمبات"، ويتميز باستخدام شرائح إضاءة متطورة من شركة Samsung، مع ضمان لمدة سنتين لكافة المنتجات.'
        : 'A renowned global LED giant, featuring advanced Samsung LED chips, and offering a 2-year warranty on all products.',
      logoUrl: '/images/brand-wellmax.png?v=2'
    },
    {
      id: 'alfanar',
      name: 'Alfanar',
      origin: isAr ? 'السعودية 🇸🇦' : 'Saudi Arabia 🇸🇦',
      description: isAr 
        ? 'من أكبر الشركات الإقليمية تصنيعاً للكابلات النحاسية، ولوحات التوزيع الكهربائية الآمنة، والمفاتيح والأفياش المقاومة للحريق.'
        : 'A leading regional powerhouse in manufacturing premium cables, electrical distribution boards, and fire-resistant wiring accessories.',
      logoUrl: '/images/brand-alfanar.png?v=2'
    },
    {
      id: 'fumagalli',
      name: 'Fumagalli',
      origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹',
      description: isAr 
        ? 'الشركة الإيطالية الأولى عالمياً في إنتاج إضاءات الحدائق والإنارة الخارجية المقاومة للصدأ والتآكل بفضل مادة الراتنج الفريدة.'
        : 'The ultimate Italian manufacturer of outdoor and garden lighting, famous for rust-free and shockproof resin composite posts.',
      logoUrl: '/images/brand-fumagalli.png?v=2'
    },
    {
      id: 'commax',
      name: 'Commax',
      origin: isAr ? 'كوريا الجنوبية 🇰🇷' : 'South Korea 🇰🇷',
      description: isAr 
        ? 'الرائد الكوري الجنوبي في أنظمة الاتصال الداخلي الذكي (الانتركم) وشاشات المراقبة وحلول الاتصالات المنزلية المتكاملة.'
        : 'A South Korean global leader in smart video intercoms, residential surveillance screens, and home security solutions.',
      logoUrl: '/images/brand-commax.png?v=2'
    },
    {
      id: 'cata',
      name: 'CATA',
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
      description: isAr 
        ? 'ماركة تركية متميزة تقدم أحدث حلول الإضاءة الزخرفية والسبوت لايت والمصابيح الليد العصرية المناسبة للمنازل والمكاتب.'
        : 'A prominent Turkish brand offering modern decorative lighting, high-quality spot lights, and elegant LED solutions for homes & offices.',
      logoUrl: '/images/brand-cata.png?v=2'
    },
    {
      id: 'borsan',
      name: 'Borsan',
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
      description: isAr 
        ? 'من كبرى المصانع التركية المنتجة للكابلات الكهربائية النحاسية عالية التوصيل، وكابلات الاتصالات وتجهيزات التركيب الكهربائي.'
        : 'One of the leading Turkish manufacturers of highly conductive copper electrical cables, telecom wires, and wiring equipment.',
      logoUrl: '/images/brand-borsan.png?v=2'
    },
    {
      id: 'makel',
      name: 'Makel',
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
      description: isAr 
        ? 'شركة صناعية تركية رائدة في إنتاج المفاتيح الكهربائية، والمقابس، وقواطع الدورة الفردية والثنائية للحماية من الالتماس.'
        : 'A Turkish pioneer in producing premium electrical switches, wall sockets, and safety circuit breakers for electric protection.',
      logoUrl: '/images/brand-makel.png?v=2'
    },
    {
      id: 'isildar',
      name: 'Isildar',
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
      description: isAr 
        ? 'أنظمة إضاءة ومواد تأسيس كهربائي تركية مبتكرة مصممة لأقسى ظروف العمل وتوفر تكلفة تشغيل اقتصادية.'
        : 'Innovative Turkish lighting and wiring installation brands designed for heavy duty performance and cost-effective operations.',
      logoUrl: '/images/brand-isildar.png?v=2'
    },
    {
      id: 'icc',
      name: 'ICC',
      origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹',
      description: isAr 
        ? 'أنظمة إنارة كهربائية متطورة وإكسسوارات توصيل كهربائي مصممة للمباني والمشاريع الكبرى بموثوقية وجودة عالية.'
        : 'Advanced electrical lighting fixtures and connection accessories designed for high-reliability building installations.',
      logoUrl: '/images/brand-icc.png?v=2'
    },
    {
      id: 'ecoliok',
      name: 'ECOLIOK',
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
      description: isAr 
        ? 'حلول إضاءة LED اقتصادية وصديقة للبيئة تتميز بتقديم إنارة قوية ومريحة للعين مع كفاءة في استهلاك الطاقة.'
        : 'Eco-friendly and budget-friendly LED lighting solutions featuring high brightness and lower energy consumption.',
      logoUrl: '/images/brand-ecoliok.png?v=2'
    },
    {
      id: 'carkit',
      name: 'Carkit',
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
      description: isAr 
        ? 'الرائد التركي في تصنيع حوامل الكابلات المعدنية (Cable Trays) ومجاري الأسلاك وتوصيلات الحماية الأرضية.'
        : 'The Turkish pioneer in manufacturing metal cable trays, wiring trunks, and heavy-duty cable protective systems.',
      logoUrl: '/images/brand-carkit.png?v=2'
    },
    {
      id: 'geros',
      name: 'Geros',
      origin: isAr ? 'إيطاليا 🇮🇹' : 'Italy 🇮🇹',
      description: isAr 
        ? 'شركة إيطالية لإنتاج علب التوزيع الكهربائية المقاومة للماء، وصناديق التوصيل، وخزائن المفاتيح الفاخرة.'
        : 'A classic Italian manufacturer of waterproof distribution boards, junction boxes, and premium circuit breaker enclosures.',
      logoUrl: '/images/brand-geros.png?v=2'
    },
    {
      id: 'edison',
      name: 'Edison',
      origin: isAr ? 'الصين 🇨🇳' : 'China 🇨🇳',
      description: isAr 
        ? 'أفياش وتوصيلات كهربائية عملية وآمنة للاستخدام المنزلي، توفر حماية ممتازة ضد التماس الكهرباء.'
        : 'Reliable electrical accessories, extension cords, and wall outlets designed for household and office electrical safety.',
      logoUrl: '/images/brand-edison.png?v=2'
    },
    {
      id: 'sharm',
      name: 'Sharm',
      origin: isAr ? 'الصين 🇨🇳' : 'China 🇨🇳',
      description: isAr 
        ? 'علامة تجارية متخصصة في تصميم النجف الحديث والإنارة الديكورية المعاصرة التي تضيف لمسة جمالية لكل غرفة.'
        : 'A brand specialized in modern decorative lighting fixtures, contemporary chandeliers, and aesthetic interior lighting.',
      logoUrl: '/images/brand-sharm.png?v=2'
    }
  ]

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-slate-900">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className="mb-6 flex justify-start">
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 hover:text-blue-600 font-semibold transition-all shadow-sm">
              <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </FadeIn>

        {/* عنوان الصفحة */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight text-slate-900">
              {isAr ? (
                <>شركاؤنا من <span className="text-blue-600">العلامات العالمية</span></>
              ) : (
                <>Our Partners of <span className="text-blue-600">Global Brands</span></>
              )}
            </h1>

            <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed text-base md:text-lg mb-6 font-normal">
              {isAr 
                ? 'نتعاون مع نخبة من أبرز العلامات والشركات العالمية المتخصصة في الإضاءة والتجهيزات والمواد الكهربائية'
                : 'We collaborate with a group of the most prominent international brands and companies specialized in lighting and electrical equipment'
              }
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-5">
              <div className="w-16 h-[2px] bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <div className="w-16 h-[2px] bg-slate-300" />
            </div>
          </div>
        </FadeIn>

        {/* قسم شركة الإنارة - لتجارة وتصنيع مواد التأسيس الكهربائي والاضاءات (منذ 1988) */}
        <FadeIn delay={0.15}>
          <div className="mb-14 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            
            {/* لمسات إضاءة خلفية */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-emerald-500/5 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* الجزء الرئيسي: تصميم ثنائي متناسق جنباً إلى جنب على الهواتف والشاشات الكبيرة */}
            <div className="flex flex-row items-start gap-3 sm:gap-6 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center mb-8 relative z-10" dir={isAr ? 'rtl' : 'ltr'}>
              
              {/* عمود الشعار الدائري للشركة (جزء اليمين) */}
              <div className="w-[95px] sm:w-[130px] lg:w-auto lg:col-span-4 shrink-0 flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-50 lg:h-50 rounded-full bg-white border-2 border-slate-200 shadow-md p-1.5 sm:p-3 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-105">
                    <img 
                      src="/images/company-enarah-logo.jpg" 
                      alt="شعار شركة الإنارة - ENARAH" 
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  {/* شارة سنة التأسيس */}
                  <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white text-[9px] sm:text-xs font-black px-2 sm:px-4 py-0.5 sm:py-1 rounded-full shadow-md border border-slate-700 whitespace-nowrap">
                    {isAr ? 'تأسست 1988' : 'EST. 1988'}
                  </div>
                </div>
              </div>

              {/* عمود البيانات والشرح الرسمي المتكامل (جزء اليسار جنباً إلى جنب) */}
              <div className="flex-1 min-w-0 space-y-2 sm:space-y-4 lg:col-span-8 text-right">
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[10px] sm:text-xs font-bold">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{isAr ? 'عراقة وخبرة لأكثر من ثلاثة عقود' : 'Over 3 Decades of Heritage'}</span>
                </div>

                <h2 className="text-lg sm:text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {isAr ? 'شركة الإنارة' : 'ENARAH Company'}
                </h2>

                {/* بطاقة الشرح المتكامل عن الشركة بدون مظهر طولي أو تكرار */}
                <div className="p-3 sm:p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs text-slate-700 leading-relaxed text-[11px] sm:text-sm lg:text-base font-normal space-y-2">
                  <p className="font-semibold text-slate-900">
                    {isAr 
                      ? 'شركة الإنارة لتجارة وتصنيع مواد التأسيس الكهربائي والاضاءات المختلفة، إحدى الشركات الرائدة في السوق الليبي منذ تأسيسها عام 1988.'
                      : 'Enarah Company for trading and manufacturing electrical foundation materials and various lightings, one of the leading companies in the Libyan market since its establishment in 1988.'}
                  </p>
                  <p className="text-slate-600 text-[10.5px] sm:text-sm leading-normal">
                    {isAr 
                      ? 'نمتلك خبرة طويلة في استيراد وتصنيع وتوزيع المنتجات الكهربائية، ونحرص دائماً على توفير أحدث المنتجات ذات الجودة العالية. بنينا شبكة واسعة من الفروع ونقاط التوزيع في مختلف المدن الليبية لخدمة عملائنا بكفاءة وموثوقية، ونفخر بكوننا موزعين ووكلاء معتمدين لنخبة من كبرى العلامات التجارية العالمية.'
                      : 'We possess extensive experience in importing, manufacturing, and distributing top-tier electrical products across a nationwide branch network serving clients with speed and reliability, and we are proud authorized distributors for world-renowned brands.'}
                  </p>
                </div>

                {/* كروت الأرقام والمزايا الأربعة */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-1">
                  <div className="p-2 sm:p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="block text-sm sm:text-base lg:text-lg font-black text-slate-900">+36</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600">{isAr ? 'عاماً خبرة' : 'Years'}</span>
                  </div>
                  <div className="p-2 sm:p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="block text-sm sm:text-base lg:text-lg font-black text-emerald-600">1988</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600">{isAr ? 'سنة التأسيس' : 'Founded'}</span>
                  </div>
                  <div className="p-2 sm:p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="block text-sm sm:text-base lg:text-lg font-black text-blue-600">{isAr ? 'فروع ليبيا' : 'Branches'}</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600">{isAr ? 'كافة المدن' : 'Nationwide'}</span>
                  </div>
                  <div className="p-2 sm:p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="block text-sm sm:text-base lg:text-lg font-black text-orange-500">100%</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600">{isAr ? 'وكالات معتمدة' : 'Official Agency'}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* معرض منتجات وخطوط تصنيع شركة الإنارة - عرض أفقي عالمي فاخر */}
            <div className="pt-6 border-t border-slate-200 relative z-10">
              <EnarahProductsCarousel isAr={isAr} />
            </div>

          </div>
        </FadeIn>

        {/* شبكة الماركات (معدلة لتصبح كروت أنيقة بجانب بعضها) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, i) => (
            <FadeIn key={brand.id} delay={0.2 + (i * 0.03)}>
              <div className="group relative bg-white border border-slate-200 hover:border-blue-500 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-xl flex flex-col h-full">
                
                {/* Brand Logo Container */}
                <div className="bg-slate-50/80 p-6 flex items-center justify-center min-h-[140px] relative border-b border-slate-100 group-hover:bg-blue-50/20 transition-colors">
                  <div className="w-full max-w-[160px] h-[60px] overflow-hidden flex items-center justify-center relative">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-full h-full object-contain filter brightness-95 group-hover:scale-105 transition-all duration-300 z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.brand-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback Text Logo */}
                    <div className="brand-fallback hidden absolute inset-0 flex items-center justify-center text-slate-800 font-bold text-xl tracking-wider select-none z-10">
                      {brand.name}
                    </div>
                  </div>
                </div>

                {/* Brand Details Container */}
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                      {brand.name}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                      {brand.origin}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal flex-grow">
                    {brand.description}
                  </p>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </div>
  )
}
