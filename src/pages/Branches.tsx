import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react'
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
      style={{ willChange: "opacity, transform" }} // لتسريع العرض
    >
      {children}
    </motion.div>
  )
}

const branches = [
  {
    name: 'فرع بنغازي - الليثي',
    address: 'مقابل مدرسة العيد الفضي',
    phones: ['0916580068', '0926580068'],
    hours: 'من الساعة 8 صباحاً حتى الساعة 10 مساءً',
  },
  {
    name: 'فرع البيضاء الأول',
    address: 'مفترق رويفع الأنصاري',
    phones: ['0911910600', '0921910600'],
    hours: 'من الساعة 8 صباحاً حتى الساعة 10 مساءً',
  },
  {
    name: 'فرع البيضاء الثاني',
    address: 'مقابل مول البكوش',
    phones: ['0919219100', '0929219100'],
    hours: 'من الساعة 8 صباحاً حتى الساعة 10 مساءً',
  },
]

export default function Branches() {
  return (
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-white">
      
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
              فرو<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.4)]">عنا</span>
            </h1>

            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl shadow-sm mb-6">
              نخدمكم عبر فروعنا داخل ليبيا لتوفير أفضل حلول الإضاءة والمواد الكهربائية
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-6">
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
            </div>
          </div>
        </FadeIn>

        {/* شبكة الفروع */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {branches.map((branch, i) => (
            <FadeIn key={branch.name} delay={0.2 + (i * 0.1)}>
              <div className="bg-[#0f213a] border border-white/5 rounded-[2rem] p-8 hover:border-blue-500/30 transition-all duration-300 shadow-xl hover:-translate-y-2 h-full flex flex-col">

                {/* عنوان الفرع */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                    <MapPin className="w-7 h-7 text-blue-400" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                    {branch.name}
                  </h3>
                </div>

                {/* تفاصيل الفرع */}
                <div className="space-y-4 flex-grow">

                  {/* العنوان */}
                  <div className="flex items-start gap-4 text-slate-300 text-base leading-relaxed bg-[#0a192f] p-5 rounded-[1.5rem] border border-white/5 shadow-inner">
                    <MapPin className="w-6 h-6 text-blue-400 mt-0.5 shrink-0" />
                    <span className="font-medium">{branch.address}</span>
                  </div>

                  {/* الهواتف */}
                  <div className="flex items-start gap-4 text-slate-300 text-base leading-relaxed bg-[#0a192f] p-5 rounded-[1.5rem] border border-white/5 shadow-inner">
                    <Phone className="w-6 h-6 text-blue-400 mt-0.5 shrink-0" />

                    <div className="flex flex-col gap-1.5 font-mono font-medium text-lg">
                      {branch.phones.map((phone) => (
                        <span key={phone} className="hover:text-blue-400 cursor-pointer transition-colors" dir="ltr">{phone}</span>
                      ))}
                    </div>
                  </div>

                  {/* أوقات العمل */}
                  <div className="flex items-start gap-4 text-slate-300 text-base leading-relaxed bg-[#0a192f] p-5 rounded-[1.5rem] border border-white/5 shadow-inner">
                    <Clock className="w-6 h-6 text-blue-400 mt-0.5 shrink-0" />
                    <span className="font-medium">{branch.hours}</span>
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
