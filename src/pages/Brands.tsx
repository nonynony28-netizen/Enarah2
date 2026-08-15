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
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className="mb-6 flex justify-start">
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white font-semibold transition-all">
              <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </FadeIn>

        {/* عنوان الصفحة */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight text-white">
              {isAr ? (
                <>شركاؤنا من <span className="text-blue-400">العلامات العالمية</span></>
              ) : (
                <>Our Partners of <span className="text-blue-400">Global Brands</span></>
              )}
            </h1>

            <p className="text-zinc-400 max-w-3xl mx-auto leading-relaxed text-base md:text-lg mb-6 font-normal">
              {isAr 
                ? 'نتعاون مع نخبة من أبرز العلامات والشركات العالمية المتخصصة في الإضاءة والتجهيزات والمواد الكهربائية'
                : 'We collaborate with a group of the most prominent international brands and companies specialized in lighting and electrical equipment'
              }
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-5">
              <div className="w-16 h-[1px] bg-zinc-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <div className="w-16 h-[1px] bg-zinc-800" />
            </div>
          </div>
        </FadeIn>

        {/* شبكة الماركات (معدلة لتصبح كروت أنيقة بجانب بعضها) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, i) => (
            <FadeIn key={brand.id} delay={0.2 + (i * 0.03)}>
              <div className="group relative bg-[#111215] border border-white/[0.08] hover:border-white/[0.18] rounded-2xl overflow-hidden transition-all duration-200 shadow-sm flex flex-col h-full">
                
                {/* Brand Logo Container */}
                <div className="bg-zinc-950/80 p-6 flex items-center justify-center min-h-[140px] relative border-b border-zinc-800/80">
                  <div className="w-full max-w-[160px] h-[60px] overflow-hidden flex items-center justify-center relative">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-full h-full object-contain filter brightness-100 group-hover:scale-105 transition-all duration-300 z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.brand-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback Text Logo */}
                    <div className="brand-fallback hidden absolute inset-0 flex items-center justify-center text-white font-bold text-xl tracking-wider select-none z-10">
                      {brand.name}
                    </div>
                  </div>
                </div>

                {/* Brand Details Container */}
                <div className="p-6 flex flex-col flex-grow bg-transparent">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                      {brand.name}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                      {brand.origin}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal flex-grow">
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
