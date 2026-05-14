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

        {/* Page Header */}
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              شركاؤنا من العلامات العالمية
            </h1>

            <p className="text-white/70 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
              نتعاون مع نخبة من أبرز العلامات والشركات العالمية المتخصصة في الإضاءة والتجهيزات والمواد الكهربائية
            </p>

            <div className="w-20 h-1 bg-blue-400 mx-auto rounded-full mt-5 shadow-[0_0_16px_rgba(59,130,246,0.45)]" />
          </div>
        </FadeIn>

        {/* Brands List */}
        <div className="space-y-10">
          {brands.map((brand, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div className="group relative bg-darkblue-light/60 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-400/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]">

                {/* Brand Image Section */}
                <div className="bg-black p-6 md:p-8">
                  <div className="aspect-[16/9] overflow-hidden flex items-center justify-center rounded-2xl">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/images/fallback.jpg'
                      }}
                    />
                  </div>
                </div>

                {/* Brand Name Only */}
                <div className="p-5 md:p-6 text-center border-t border-white/5 bg-darkblue-light/40">
                  <h2 className="text-2xl md:text-3xl font-bold text-blue-400 drop-shadow-[0_0_14px_rgba(59,130,246,0.35)] tracking-wide">
                    {brand.name}
                  </h2>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </div>
  )
}
