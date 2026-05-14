import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ChevronLeft, Award, Shield, Sparkles, Zap } from 'lucide-react'

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
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

const topProducts = [
  { name: 'سبوتات', image: '/images/cat-spotlight.jpg', path: '/products' },
  { name: 'LED Profile', image: '/images/cat-ledprofile.jpg', path: '/products' },
  { name: 'أسلاك وكوابل', image: '/images/cat-cables.jpg', path: '/products' },
]

export default function Home() {
  return (
    <div className="pt-16 md:pt-20">

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="إنارة فاخرة"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkblue via-darkblue/80 to-darkblue/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              الإنارة{' '}
              <span className="text-blue-400 drop-shadow-[0_0_18px_rgba(59,130,246,0.75)]">
                الحديثة
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed">
              كل ما تحتاجه من الإضاءة والتأسيس الكهربائي بجودة عالية وحلول متكاملة
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/products"
                className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300 shadow-[0_0_22px_rgba(59,130,246,0.35)] flex items-center gap-2"
              >
                استعرض المنتجات
                <ChevronLeft className="w-5 h-5" />
              </Link>

              <Link
                to="/contact"
                className="px-8 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300"
              >
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.75)]"
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-darkblue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                لماذا نحن؟
              </h2>
              <div className="w-16 h-1 bg-blue-400 mx-auto rounded-full" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: 'جودة عالية',
                desc: 'نختار منتجاتنا بعناية فائقة من أفضل المصادر العالمية لضمان أعلى معايير الجودة.',
              },
              {
                icon: Shield,
                title: 'حلول متكاملة',
                desc: 'نقدم لك جميع احتياجاتك من الإضاءة والمواد الكهربائية في مكان واحد.',
              },
              {
                icon: Sparkles,
                title: 'اختيار احترافي',
                desc: 'فريقنا متخصص في مساعدتك لاختيار الحلول المثالية لمشروعك.',
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.15}>
                <div className="group relative bg-darkblue-light border border-white/5 rounded-xl p-6 hover:border-blue-400/30 transition-all duration-300 hover:shadow-glass">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <item.icon className="w-6 h-6 text-blue-400" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Top Products */}
      <section className="py-20 bg-darkblue-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                المنتجات الأكثر طلباً
              </h2>
              <div className="w-16 h-1 bg-blue-400 mx-auto rounded-full" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topProducts.map((product, i) => (
              <FadeIn key={product.name} delay={i * 0.1}>
                <Link
                  to={product.path}
                  className="group relative block overflow-hidden rounded-xl border border-white/5 hover:border-blue-400/30 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-darkblue via-darkblue/20 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 right-0 left-0 p-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-darkblue relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ابدأ مشروعك معنا{' '}
              <span className="text-blue-400 drop-shadow-[0_0_14px_rgba(59,130,246,0.7)]">
                اليوم
              </span>
            </h2>

            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              نحن هنا لنساعدك في تحويل رؤيتك إلى واقع. تواصل مع فريقنا للحصول على استشارة مجانية.
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.35)]"
            >
              <Zap className="w-5 h-5" />
              تواصل معنا الآن
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  )
}

