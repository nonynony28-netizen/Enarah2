import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

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
        ? 'عملاق تكنولوجيا مصابيح LED الملقب بـ "ملك اللمبات"، ويتميز بأعلى معايير الكفاءة والعمر الافتراضي الممتد للإنارة السكنية.'
        : 'A renowned global LED packaging and bulb design giant, famous for high efficiency and extended lifespan in residential lighting.',
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
      origin: isAr ? 'تركيا 🇹🇷' : 'Turkey 🇹🇷',
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
      origin: isAr ? 'مصر 🇪🇬' : 'Egypt 🇪🇬',
      description: isAr 
        ? 'علامة تجارية متخصصة في تصميم النجف الحديث والإنارة الديكورية المعاصرة التي تضيف لمسة جمالية لكل غرفة.'
        : 'A brand specialized in modern decorative lighting fixtures, contemporary chandeliers, and aesthetic interior lighting.',
      logoUrl: '/images/brand-sharm.png?v=2'
    }
  ]

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className="mb-6 flex justify-start">
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#0f213a] border border-white/10 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-blue-400 font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </FadeIn>

        {/* عنوان الصفحة */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
              {isAr ? (
                <>شركاؤنا من <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.4)]">العلامات العالمية</span></>
              ) : (
                <>Our Partners of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.4)]">Global Brands</span></>
              )}
            </h1>

            <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed text-lg md:text-xl shadow-sm mb-6">
              {isAr 
                ? 'نتعاون مع نخبة من أبرز العلامات والشركات العالمية المتخصصة في الإضاءة والتجهيزات والمواد الكهربائية'
                : 'We collaborate with a group of the most prominent international brands and companies specialized in lighting and electrical equipment'
              }
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-6">
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
            </div>
          </div>
        </FadeIn>

        {/* شبكة الماركات (معدلة لتصبح كروت أنيقة بجانب بعضها) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand, i) => (
            <FadeIn key={brand.id} delay={0.2 + (i * 0.03)}>
              <div className="group relative bg-[#0f213a]/80 border border-white/5 hover:border-blue-500/30 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(10,25,47,0.8),0_0_20px_rgba(59,130,246,0.1)] flex flex-col h-full">
                
                {/* Brand Logo Container */}
                <div className="bg-[#0a192f] p-8 flex items-center justify-center min-h-[160px] relative border-b border-white/5">
                  <div className="w-full max-w-[180px] h-[70px] overflow-hidden flex items-center justify-center relative">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-full h-full object-contain filter brightness-100 group-hover:scale-105 transition-all duration-500 z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.brand-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback Text Logo */}
                    <div className="brand-fallback hidden absolute inset-0 flex items-center justify-center text-white font-black text-2xl tracking-wider select-none z-10">
                      {brand.name}
                    </div>
                  </div>
                  {/* Glow Backdrop */}
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl z-0" />
                </div>

                {/* Brand Details Container */}
                <div className="p-6 flex flex-col flex-grow bg-[#0f213a]/30">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                      {brand.name}
                    </h2>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-slate-400 font-semibold">
                      {brand.origin}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-sans font-medium flex-grow">
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
