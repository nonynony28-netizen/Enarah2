// src/pages/Brands.tsx
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

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

type Brand = {
  name: string
  description: string
  image: string
}

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    fetch('/brands.json')
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((error) => {
        console.error('Brands JSON Error:', error)
      })
  }, [])

  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              شركاؤنا من العلامات العالمية
            </h1>

            <p className="text-white/60 max-w-3xl mx-auto">
              نتعاون مع نخبة من أبرز العلامات والشركات العالمية المتخصصة في الإضاءة والتجهيزات والمواد الكهربائية
            </p>

            <div className="w-16 h-1 bg-gold mx-auto rounded-full mt-4" />
          </div>
        </FadeIn>

        <div className="space-y-8">
          {brands.map((brand, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="group relative bg-darkblue-light/60 border border-white/5 rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-300">

                <div className="bg-black p-6">
                  <div className="aspect-[16/9] overflow-hidden flex items-center justify-center">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/images/fallback.jpg'
                      }}
                    />
                  </div>
                </div>

                <div className="p-6 md:p-8 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gold mb-4">
                    {brand.name}
                  </h2>

                  <p className="text-white/70 leading-relaxed max-w-3xl mx-auto">
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
