import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Target, Eye, Heart, Lightbulb } from 'lucide-react'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">من نحن</h1>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-darkblue-light/60 border border-white/5 rounded-2xl p-6 md:p-10 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-white">الإنارة الحديثة</h2>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">
              نحن وجهتك الأولى والموثوقة لجميع احتياجات الإضاءة والمواد الكهربائية في المملكة العربية السعودية. 
              منذ تأسيسنا، نسعى دائماً لتقديم أجود المنتجات العالمية بأسعار تنافسية، مع التركيز على تقديم 
              تجربة عملاء استثنائية.
            </p>
            <p className="text-white/70 leading-relaxed">
              نختار منتجاتنا بعناية فائقة من أفضل المصادر والماركات العالمية، ونحرص على توفير حلول 
              متكاملة تناسب كافة المشاريع السكنية والتجارية.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: Target,
              title: 'رسالتنا',
              desc: 'توفير حلول إضاءة وكهرباء عالية الجودة تلبي احتياجات عملائنا وتتجاوز توقعاتهم.',
            },
            {
              icon: Eye,
              title: 'رؤيتنا',
              desc: 'أن نكون الشريك الأول في المملكة لتقديم حلول الإضاءة والكهرباء المتكاملة.',
            },
            {
              icon: Heart,
              title: 'قيمنا',
              desc: 'الجودة، الأمانة، الابتكار، والالتزام بأعلى معايير الخدمة والاحترافية.',
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.15}>
              <div className="bg-darkblue-light border border-white/5 rounded-xl p-6 hover:border-gold/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="bg-gradient-to-br from-gold/5 to-transparent border border-gold/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gold mb-4">لماذا نحن الخيار الأمثل؟</h3>
            <ul className="space-y-3">
              {[
                'منتجات أصلية 100% من ماركات عالمية موثوقة',
                'فريق فني متخصص في التركيب والاستشارات',
                'ضمان شامل على جميع المنتجات',
                'توصيل سريع لجميع مناطق المملكة',
                'أسعار تنافسية مع عروض مستمرة',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-white/70">
                  <span className="w-2 h-2 bg-gold rounded-full mt-2 shrink-0" />
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
