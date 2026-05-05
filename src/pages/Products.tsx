import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function FadeIn({ children, delay = 0 }) {
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
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-7xl mx-auto px-4">

        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl font-bold text-white">منتجاتنا</h1>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <FadeIn key={i}>
              <div className="bg-darkblue-light rounded-xl overflow-hidden">

                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-[250px] object-cover"
                />

                <div className="p-4">
                  <h3 className="text-white font-bold">{cat.name}</h3>
                  <p className="text-white/60 text-sm">{cat.description}</p>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </div>
  )
}
