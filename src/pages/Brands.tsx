import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
    <div className="pt-24 md:pt-32 pb-24 bg-[#0a192f] min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight" style={glowingTitleStyle}>
              شركاؤنا من العلامات العالمية
            </h1>

            <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed text-lg md:text-xl shadow-sm mb-6">
              نتعاون مع نخبة من أبرز العلامات والشركات العالمية المتخصصة في الإضاءة والتجهيزات والمواد الكهربائية
            </p>

            <div className="w-20 h-1.5 bg-blue-500 mx-auto rounded-full mt-5 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
          </div>
        </FadeIn>

        {/* شبكة الماركات (معدلة لتصبح كروت أنيقة بجانب بعضها) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand, i) => (
            <FadeIn key={i} delay={0.2 + (i * 0.1)}>
              <div className="group relative bg-[#0f213a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl flex flex-col h-full">

                {/* Brand Image Section */}
                <div className="bg-[#0a192f] p-8">
                  <div className="aspect-[16/9] overflow-hidden flex items-center justify-center rounded-2xl relative">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 relative z-10"
                      onError={(e) => {
                        e.currentTarget.src = '/images/fallback.jpg'
                      }}
                    />
                    {/* توهج خلف اللوجو عند تمرير الماوس */}
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl z-0" />
                  </div>
                </div>

                {/* Brand Name Only */}
                <div className="p-6 text-center border-t border-white/5 bg-[#0f213a] flex-grow flex items-center justify-center">
                  <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.1)] transition-colors duration-300 tracking-wide">
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
