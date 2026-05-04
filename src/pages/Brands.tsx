import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

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

const brands = [
  {
    name: 'ENARAH',
    description: 'علامة تجارية رائدة في عالم الإضاءة الفاخرة، تقدم تشكيلة واسعة من الثريات والسبوتات والإضاءة الداخلية بجودة استثنائية وتصاميم عصرية.',
    image: '/images/brand-enarah.jpg',
    specialties: ['ثريات', 'سبوتات', 'إضاءة داخلية'],
  },
  {
    name: 'WELLMAX',
    description: 'شركة عالمية متخصصة في الحلول الكهربائية المتكاملة، تقدم منتجات عالية الجودة من الكوابل والمواد الكهربائية بتقنيات متطورة.',
    image: '/images/brand-wellmax.jpg',
    specialties: ['كوابل كهربائية', 'مواد تأسيس', 'LED Profile'],
  },
]

export default function Brands() {
  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">الماركات العالمية</h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              نتعاون مع أفضل العلامات التجارية في مجال الإضاءة والمواد الكهربائية
            </p>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full mt-4" />
          </div>
        </FadeIn>

        <div className="space-y-8">
          {brands.map((brand, i) => (
            <FadeIn key={brand.name} delay={i * 0.15}>
              <div className="group relative bg-darkblue-light/60 border border-white/5 rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gold mb-4">{brand.name}</h2>
                    <p className="text-white/70 leading-relaxed mb-6">{brand.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {brand.specialties.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-full border border-gold/20"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  )
}
