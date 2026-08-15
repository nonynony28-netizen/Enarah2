import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Target, Eye, Heart, Lightbulb, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

// نمط الوهج الأزرق للعناوين الفخمة
const glowingTitleStyle = {
  textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
}

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
      style={{ willChange: "opacity, transform" }} // تسريع الأداء
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  const { isAr } = useLanguage()

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة (نفس الرئيسية) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className={`mb-6 flex ${isAr ? 'justify-start' : 'justify-start'}`}>
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
                <>من <span className="text-blue-400">نحن</span></>
              ) : (
                <>About <span className="text-blue-400">Us</span></>
              )}
            </h1>

            <div className="flex items-center justify-center gap-1.5 mt-5">
              <div className="w-16 h-[1px] bg-zinc-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <div className="w-16 h-[1px] bg-zinc-800" />
            </div>
          </div>
        </FadeIn>

        {/* بطاقة من نحن الأساسية */}
        <FadeIn delay={0.2}>
          <div className="bg-[#111215] border border-white/[0.08] rounded-2xl p-8 md:p-12 mb-12 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-blue-400">
                <Lightbulb className="w-6 h-6" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {isAr ? 'الإنارة الحديثة' : 'ENARAHMODERN'}
              </h2>
            </div>

            <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-6 font-normal">
              {isAr 
                ? 'نحن وجهتك الأولى والموثوقة لجميع احتياجات الإضاءة والمواد الكهربائية في ليبيا. منذ تأسيسنا، نسعى دائماً لتقديم أجود المنتجات العالمية بأسعار تنافسية، مع التركيز على تقديم تجربة عملاء استثنائية وحلول احترافية متكاملة.'
                : 'We are your primary and trusted destination for all lighting and electrical needs in Libya. Since our establishment, we have always strived to offer the highest quality global products at competitive prices, with a focus on providing an exceptional customer experience and integrated professional solutions.'
              }
            </p>

            <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-normal">
              {isAr
                ? 'نختار منتجاتنا بعناية فائقة من أفضل المصادر والماركات العالمية، ونحرص على توفير حلول متكاملة تناسب كافة المشاريع السكنية والتجارية داخل ليبيا بأعلى معايير الجودة والموثوقية.'
                : 'We select our products with extreme care from the best global sources and brands, ensuring the provision of integrated solutions suitable for all residential and commercial projects in Libya with the highest quality and reliability standards.'
              }
            </p>
          </div>
        </FadeIn>

        {/* القيم والرؤية والرسالة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Target,
              title: isAr ? 'رسالتنا' : 'Our Mission',
              desc: isAr 
                ? 'توفير حلول إضاءة وكهرباء عالية الجودة تلبي احتياجات عملائنا وتتجاوز توقعاتهم.'
                : 'Providing high-quality lighting and electrical solutions that meet our clients\' needs and exceed their expectations.',
            },
            {
              icon: Eye,
              title: isAr ? 'رؤيتنا' : 'Our Vision',
              desc: isAr
                ? 'أن نكون الشريك الأول في ليبيا لتقديم حلول الإضاءة والكهرباء المتكاملة.'
                : 'To be the premier partner in Libya for providing integrated lighting and electrical solutions.',
            },
            {
              icon: Heart,
              title: isAr ? 'قيمنا' : 'Our Values',
              desc: isAr
                ? 'الجودة، الأمانة، الابتكار، والالتزام بأعلى معايير الخدمة والاحترافية.'
                : 'Quality, honesty, innovation, and commitment to the highest standards of service and professionalism.',
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={0.3 + (i * 0.1)}>
              <div className="bg-[#111215] border border-white/[0.08] hover:border-white/[0.18] rounded-2xl p-7 transition-all duration-200 h-full shadow-sm">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                  <item.icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* لماذا نحن الخيار الأمثل */}
        <FadeIn delay={0.5}>
          <div className="bg-[#111215] border border-white/[0.08] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
              {isAr ? 'لماذا نحن الخيار الأمثل؟' : 'Why Choose Us?'}
            </h3>

            <ul className="space-y-4 relative z-10">
              {(isAr 
                ? [
                    'منتجات أصلية 100% من ماركات عالمية موثوقة',
                    'فريق فني متخصص في التركيب والاستشارات',
                    'ضمان شامل على منتجات شركة "wellmax"',
                    'توفير حلول متكاملة للمشاريع السكنية والتجارية',
                    'أسعار تنافسية مع جودة استثنائية',
                  ]
                : [
                    '100% original products from trusted global brands',
                    'Specialized technical team for installation and consultation',
                    'Comprehensive warranty on "wellmax" products',
                    'Integrated solutions for residential and commercial projects',
                    'Competitive prices with exceptional quality',
                  ]
              ).map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-zinc-300 text-sm md:text-base font-normal"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

      </div>
    </div>
  )
}
