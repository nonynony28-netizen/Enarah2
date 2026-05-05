import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Lightbulb, Cable, Star, Plug, Box, Layers } from 'lucide-react'

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

export default function Products() {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">منتجاتنا</h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              تشكيلة واسعة من الإضاءة والمواد الكهربائية بأجود الماركات العالمية
            </p>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full mt-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group relative bg-darkblue-light border border-white/5 rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300">

                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-2">
                    {cat.description}
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
