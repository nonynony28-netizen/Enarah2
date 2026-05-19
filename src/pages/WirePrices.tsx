import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, Zap, TrendingUp, TrendingDown, Minus, ShieldCheck } from 'lucide-react'

// نمط الوهج الأزرق للعناوين (يضيء الكلمات بوزن خفيف جداً)
const glowingTitleStyle = {
  textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
}

// مكون الأنيميشن السريع (تم تخفيفه ليكون فائق السرعة)
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  )
}

// قائمة الأسلاك المحدثة
const wireData = [
  { id: 1, size: '1.5 ملي', type: 'مفرد (لفة 100 ياردة)', price: '45.00', trend: 'up' },
  { id: 2, size: '2.5 ملي', type: 'مفرد (لفة 100 ياردة)', price: '75.00', trend: 'same' },
  { id: 3, size: '4.0 ملي', type: 'مفرد (لفة 100 ياردة)', price: '115.00', trend: 'down' },
  { id: 4, size: '6.0 ملي', type: 'مفرد (لفة 100 ياردة)', price: '165.00', trend: 'same' },
  { id: 5, size: '10.0 ملي', type: 'مفرد (لفة 100 متر)', price: '290.00', trend: 'up' },
  { id: 6, size: '16.0 ملي', type: 'مفرد (لفة 100 متر)', price: '450.00', trend: 'same' },
  { id: 7, size: '25.0 ملي', type: 'مفرد (لفة 100 متر)', price: '680.00', trend: 'same' },
]

export default function WirePrices() {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }
    setCurrentDate(new Date().toLocaleDateString('ar-EG', options))
  }, [])

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-[#0a192f] min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية (بدل الدوائر الثقيلة) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* رأس الصفحة */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-full mb-6">
              <Zap className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            </div>
            
            {/* أضفنا توهج النيون الفخم للعنوان */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight" style={glowingTitleStyle}>
              أسعار الأسلاك الإيطالية
            </h1>
            
            <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8 shadow-sm">
              نقدم لكم التحديث اليومي لأسعار الأسلاك الكهربائية الإيطالية المعتمدة، لضمان أعلى معايير الجودة لمشاريعكم.
            </p>

            {/* شريط التاريخ */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#0d2342] border border-blue-500/30 rounded-2xl text-blue-300 font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Calendar className="w-5 h-5" />
              تحديث اليوم: {currentDate}
            </div>
          </div>
        </FadeIn>

        {/* جدول الأسعار - بدون أي زجاج شفاف ثقيل */}
        <FadeIn delay={0.1}>
          <div className="bg-[#0f213a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            
            {/* عنوان الجدول */}
            <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-green-400" />
                قائمة الأسعار المعتمدة
              </h3>
              <span className="text-xs font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                محدث الآن
              </span>
            </div>

            {/* قائمة الأسلاك */}
            <div className="divide-y divide-white/5">
              {wireData.map((wire, idx) => (
                <div key={wire.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors duration-300">
                  
                  {/* معلومات السلك */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0a192f] border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{wire.size}</h4>
                      <p className="text-sm text-slate-400">{wire.type}</p>
                    </div>
                  </div>

                  {/* السعر والمؤشر */}
                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <div className="text-right">
                      <span className="text-sm text-slate-400 block mb-1">السعر التقريبي</span>
                      <div className="text-2xl font-extrabold text-blue-300">
                        {wire.price} <span className="text-sm font-normal text-slate-400">د.ل</span>
                      </div>
                    </div>

                    {/* مؤشر السعر */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${
                      wire.trend === 'up' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                      wire.trend === 'down' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                      'bg-slate-500/10 border-slate-500/30 text-slate-400'
                    }`}>
                      {wire.trend === 'up' && <TrendingUp className="w-5 h-5" />}
                      {wire.trend === 'down' && <TrendingDown className="w-5 h-5" />}
                      {wire.trend === 'same' && <Minus className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* تذييل الجدول */}
            <div className="bg-[#0a192f]/50 p-4 text-center text-sm text-slate-500 border-t border-white/5">
              * الأسعار تقريبية وقابلة للتغيير الطفيف حسب تقلبات السوق وكمية الطلب.
            </div>

          </div>
        </FadeIn>

      </div>
    </div>
  )
}
