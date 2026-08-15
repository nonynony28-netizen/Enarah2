import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react'
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
      style={{ willChange: "opacity, transform" }} // لتسريع العرض
    >
      {children}
    </motion.div>
  )
}

export default function Branches() {
  const { isAr } = useLanguage()

  const branches = [
    {
      name: isAr ? 'فرع بنغازي - الليثي' : 'Benghazi Branch - Al-Laythi',
      address: isAr ? 'مقابل مدرسة العيد الفضي' : 'Opposite Silver Feast School',
      phones: ['0916580068', '0926580068'],
      hours: isAr ? 'من الساعة 8 صباحاً حتى الساعة 10 مساءً' : 'From 8:00 AM to 10:00 PM',
    },
    {
      name: isAr ? 'فرع البيضاء الأول' : 'First Al-Bayda Branch',
      address: isAr ? 'مفترق رويفع الأنصاري' : 'Ruwaifa Al-Ansari Intersection',
      phones: ['0911910600', '0921910600'],
      hours: isAr ? 'من الساعة 8 صباحاً حتى الساعة 10 مساءً' : 'From 8:00 AM to 10:00 PM',
    },
    {
      name: isAr ? 'فرع البيضاء الثاني' : 'Second Al-Bayda Branch',
      address: isAr ? 'مقابل مول البكوش' : 'Opposite Al-Bakoosh Mall',
      phones: ['0919219100', '0929219100'],
      hours: isAr ? 'من الساعة 8 صباحاً حتى الساعة 10 مساءً' : 'From 8:00 AM to 10:00 PM',
    },
  ]

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className="mb-6 flex justify-start">
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
                <>فرو<span className="text-blue-400">عنا</span></>
              ) : (
                <>Our <span className="text-blue-400">Branches</span></>
              )}
            </h1>

            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed text-base md:text-lg mb-6 font-normal">
              {isAr 
                ? 'نخدمكم عبر فروعنا داخل ليبيا لتوفير أفضل حلول الإضاءة والمواد الكهربائية'
                : 'We serve you through our branches in Libya to provide the best lighting and electrical solutions'
              }
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-5">
              <div className="w-16 h-[1px] bg-zinc-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <div className="w-16 h-[1px] bg-zinc-800" />
            </div>
          </div>
        </FadeIn>

        {/* شبكة الفروع */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, i) => (
            <FadeIn key={branch.name} delay={0.2 + (i * 0.1)}>
              <div className="bg-[#111215] border border-white/[0.08] hover:border-white/[0.18] rounded-2xl p-7 transition-all duration-200 shadow-sm h-full flex flex-col">

                {/* عنوان الفرع */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-blue-400">
                    <MapPin className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {branch.name}
                  </h3>
                </div>

                {/* تفاصيل الفرع */}
                <div className="space-y-3.5 flex-grow">

                  {/* العنوان */}
                  <div className="flex items-start gap-3 text-zinc-300 text-sm leading-relaxed bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80">
                    <MapPin className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <span>{branch.address}</span>
                  </div>

                  {/* الهواتف */}
                  <div className="flex items-start gap-3 text-zinc-300 text-sm leading-relaxed bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80">
                    <Phone className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />

                    <div className="flex flex-col gap-1 font-mono font-medium text-base">
                      {branch.phones.map((phone) => (
                        <span key={phone} className="hover:text-blue-400 cursor-pointer transition-colors" dir="ltr">{phone}</span>
                      ))}
                    </div>
                  </div>

                  {/* أوقات العمل */}
                  <div className="flex items-start gap-3 text-zinc-300 text-sm leading-relaxed bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80">
                    <Clock className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <span>{branch.hours}</span>
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
