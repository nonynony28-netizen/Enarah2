import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Target, Eye, Heart, Lightbulb, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom' // استدعاء الرابط

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
  return (
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة (نفس الرئيسية) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className="mb-6 flex justify-start">
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#0f213a] border border-white/10 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-blue-400 font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <ArrowRight className="w-5 h-5" />
              العودة للرئيسية
            </Link>
          </div>
        </FadeIn>

        {/* عنوان الصفحة */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
              من <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.4)]">نحن</span>
            </h1>

            <div className="flex items-center justify-center gap-1.5 mt-6">
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
            </div>
          </div>
        </FadeIn>

        {/* بطاقة من نحن الأساسية */}
        <FadeIn delay={0.2}>
          <div className="bg-[#0f213a] border border-white/5 rounded-[2rem] p-8 md:p-12 mb-12 shadow-2xl hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <Lightbulb className="w-7 h-7 text-blue-400" />
              </div>

              <h2 className="text-3xl font-bold text-white">
                الإنارة الحديثة
              </h2>
            </div>

            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-6">
              نحن وجهتك الأولى والموثوقة لجميع احتياجات الإضاءة والمواد الكهربائية في ليبيا.
              منذ تأسيسنا، نسعى دائماً لتقديم أجود المنتجات العالمية بأسعار تنافسية،
              مع التركيز على تقديم تجربة عملاء استثنائية وحلول احترافية متكاملة.
            </p>

            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
              نختار منتجاتنا بعناية فائقة من أفضل المصادر والماركات العالمية،
              ونحرص على توفير حلول متكاملة تناسب كافة المشاريع السكنية والتجارية
              داخل ليبيا بأعلى معايير الجودة والموثوقية.
            </p>
          </div>
        </FadeIn>

        {/* القيم والرؤية والرسالة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {[
            {
              icon: Target,
              title: 'رسالتنا',
              desc: 'توفير حلول إضاءة وكهرباء عالية الجودة تلبي احتياجات عملائنا وتتجاوز توقعاتهم.',
            },
            {
              icon: Eye,
              title: 'رؤيتنا',
              desc: 'أن نكون الشريك الأول في ليبيا لتقديم حلول الإضاءة والكهرباء المتكاملة.',
            },
            {
              icon: Heart,
              title: 'قيمنا',
              desc: 'الجودة، الأمانة، الابتكار، والالتزام بأعلى معايير الخدمة والاحترافية.',
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={0.3 + (i * 0.1)}>
              <div className="bg-[#0f213a] border border-white/5 rounded-[1.5rem] p-8 hover:border-blue-500/30 transition-all duration-300 h-full shadow-lg hover:-translate-y-2">
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                  <item.icon className="w-7 h-7 text-blue-400" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {item.title}
                </h3>

                <p className="text-slate-400 text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* لماذا نحن الخيار الأمثل */}
        <FadeIn delay={0.5}>
          <div className="bg-gradient-to-br from-[#0f213a] to-[#0a192f] border border-blue-500/20 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <h3 className="text-3xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              لماذا نحن الخيار الأمثل؟
            </h3>

            <ul className="space-y-5 relative z-10">
              {[
                'منتجات أصلية 100% من ماركات عالمية موثوقة',
                'فريق فني متخصص في التركيب والاستشارات',
                'ضمان شامل على منتجات شركة "wellmax"',
                'توفير حلول متكاملة للمشاريع السكنية والتجارية',
                'أسعار تنافسية مع جودة استثنائية',
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-4 text-slate-300 text-lg"
                >
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded-full shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
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
