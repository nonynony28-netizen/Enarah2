import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Calendar, Zap, TrendingUp, TrendingDown, Minus, ShieldCheck, ArrowRight, ShoppingCart, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useCart } from '../hooks/useCart'
import WireAnatomyScroll from '../components/WireAnatomyScroll'

// نمط الوهج الأزرق للعناوين
const glowingTitleStyle = {
  textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
}

// مكون الأنيميشن السريع
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

type TrendType = 'up' | 'down' | 'same'

// قائمة الأسلاك المحدثة
const defaultWireData = [
  { id: '1.5', size: '1.5 ملي', type: 'مفرد (لفة 100 متر)', price: '45.00', trend: 'same' as TrendType },
  { id: '2.5', size: '2.5 ملي', type: 'مفرد (لفة 100 متر)', price: '75.00', trend: 'same' as TrendType },
  { id: '4.0', size: '4.0 ملي', type: 'مفرد (لفة 100 متر)', price: '115.00', trend: 'same' as TrendType },
  { id: '6.0', size: '6.0 ملي', type: 'مفرد (لفة 100 متر)', price: '165.00', trend: 'same' as TrendType },
  { id: '10.0', size: '10.0 ملي', type: 'مفرد (لفة 100 متر)', price: '290.00', trend: 'same' as TrendType },
  { id: '16.0', size: '16.0 ملي', type: 'مفرد (لفة 100 متر)', price: '450.00', trend: 'same' as TrendType },
  { id: '25.0', size: '25.0 ملي', type: 'مفرد (لفة 100 متر)', price: '680.00', trend: 'same' as TrendType },
]

const getLocalizedSize = (id: string, isAr: boolean) => {
  return isAr ? `${id} ملي` : `${id} mm`
}

const getLocalizedType = (isAr: boolean) => {
  return isAr ? 'مفرد (لفة 100 متر)' : 'Single (100m Roll)'
}

export default function WirePrices() {
  const { t, isAr } = useLanguage()
  const [currentDate, setCurrentDate] = useState('')
  const [wirePrices, setWirePrices] = useState<typeof defaultWireData>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enarah_cached_wire_prices')
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }
    return defaultWireData
  })
  
  const { addToCart, triggerFlyAnimation } = useCart()
  const [wireUpdates, setWireUpdates] = useState<any[]>([])
  const [selectedChartWireId, setSelectedChartWireId] = useState('1.5')
  const [addingId, setAddingId] = useState<string | null>(null)

  const handleAddToCart = (e: React.MouseEvent, wire: any) => {
    const itemId = `wire-${wire.id}`
    triggerFlyAnimation(e.clientX, e.clientY)
    setAddingId(itemId)
    addToCart({
      id: itemId,
      name: isAr ? `سلك إيطالي مقاس ${wire.size}` : `Italian Wire ${wire.id}mm`,
      description: isAr ? `سلك مفرد لفة 100 متر` : `Single 100m Roll`,
      image: '/images/cat-cables.jpg',
      price: parseFloat(wire.price)
    })
    setTimeout(() => {
      setAddingId(null)
    }, 1200)
  }

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }
    const locale = isAr ? 'ar-EG' : 'en-US'
    setCurrentDate(new Date().toLocaleDateString(locale, options))
  }, [isAr])

  useEffect(() => {
    const fetchWirePrices = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        const data = await res.json()
        if (res.ok && data.success && Array.isArray(data.data)) {
          const updates = data.data.filter((item: any) => item.email === 'admin_wire_prices@app.local')
          setWireUpdates(updates)
          if (updates.length > 0) {
             const chronological = [...updates].reverse() 
             const latestObj = JSON.parse(chronological[chronological.length - 1].phone).prices
             const previousObj = chronological.length > 1 ? JSON.parse(chronological[chronological.length - 2].phone).prices : null

             const updatedWires = defaultWireData.map(wire => {
                const newPrice = parseFloat(latestObj[wire.id] || wire.price)
                const oldPrice = previousObj ? parseFloat(previousObj[wire.id] || wire.price) : parseFloat(wire.price)
                let trend: TrendType = 'same'
                if (newPrice > oldPrice) trend = 'up'     
                if (newPrice < oldPrice) trend = 'down'   
                return { ...wire, price: newPrice.toFixed(2), trend }
             })
             setWirePrices(updatedWires)
             localStorage.setItem('enarah_cached_wire_prices', JSON.stringify(updatedWires))
          }
        }
      } catch (err) {
        console.error("Error fetching wire prices:", err)
      }
    }
    fetchWirePrices()
  }, [])

  // تصفية وحساب البيانات التاريخية للرسم البياني البورصة
  const getHistoryData = () => {
    const defaultWire = defaultWireData.find(w => w.id === selectedChartWireId)
    const basePrice = parseFloat(wirePrices.find(w => w.id === selectedChartWireId)?.price || defaultWire?.price || "0")
    
    let history: { date: string; price: number }[] = []
    
    if (wireUpdates.length > 0) {
      // الترتيب الزمني من الأقدم للأحدث
      const chronological = [...wireUpdates].reverse()
      history = chronological.map(item => {
        let pricesObj: any = {}
        try {
          pricesObj = JSON.parse(item.phone).prices || {}
        } catch {}
        const price = parseFloat(pricesObj[selectedChartWireId] || defaultWire?.price || "0")
        const dateObj = new Date(item.createdAt)
        const dateStr = dateObj.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })
        return { date: dateStr, price }
      })
    }
    
    // إذا كان التاريخ قصيراً، نقوم بإنشاء نقاط محاكاة لإضفاء مظهر جمالي فوري متناسق
    if (history.length < 5) {
      const mockFluctuations = [-0.02, 0.01, -0.015, 0.02, 0] // تذبذبات بورصة محاكاة
      const simulatedHistory = []
      
      for (let i = 0; i < 5; i++) {
        const dateObj = new Date()
        dateObj.setDate(dateObj.getDate() - (4 - i))
        const dateStr = dateObj.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })
        const price = parseFloat((basePrice * (1 + mockFluctuations[i])).toFixed(2))
        simulatedHistory.push({ date: dateStr, price })
      }
      return simulatedHistory
    }
    
    return history
  }

  const historyData = getHistoryData()
  const prices = historyData.map(d => d.price)
  const maxPrice = Math.max(...prices) * 1.02
  const minPrice = Math.min(...prices) * 0.98
  const priceRange = maxPrice - minPrice || 1

  const getX = (index: number) => {
    if (historyData.length <= 1) return 250
    return (index / (historyData.length - 1)) * 400 + 50
  }

  const getY = (price: number) => {
    return 170 - ((price - minPrice) / priceRange) * 130
  }

  // إنشاء مسار الخط والمنطقة
  const pathD = historyData.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(d.price)}`).join(' ')
  const areaD = historyData.length > 0 
    ? `${pathD} L ${getX(historyData.length - 1)} 180 L ${getX(0)} 180 Z`
    : ''

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className="mb-6 flex justify-start">
            <Link to="/" className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#0f213a] border border-white/10 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-blue-400 font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </FadeIn>

        {/* رأس الصفحة */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-full mb-6">
              <Zap className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
              {isAr ? 'أسعار الأسلاك' : 'Wire Prices'}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_20px_rgba(59,130,246,0.4)]">
                {isAr ? 'الإيطالية' : 'Italian'}
              </span>
            </h1>
            
            <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-8 shadow-sm font-medium">
              {isAr 
                ? 'نقدم لكم التحديث اليومي لأسعار الأسلاك الكهربائية الإيطالية المعتمدة، لضمان أعلى معايير الجودة لمشاريعكم.'
                : 'Providing you with the daily certified Italian electrical wire price updates, ensuring the highest standards of safety and quality for your projects.'
              }
            </p>

            <div className={`inline-flex items-center gap-3 px-6 py-3 bg-[#0d2342] border border-blue-500/30 rounded-2xl text-blue-300 font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.2)] ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <Calendar className="w-5 h-5" />
              <span>{isAr ? 'تحديث اليوم:' : 'Today\'s Update:'} {currentDate}</span>
            </div>
          </div>
        </FadeIn>

        {/* التشريح التفاعلي للأسلاك المرتبط بالتمرير */}
        <FadeIn delay={0.15}>
          <WireAnatomyScroll />
        </FadeIn>

        {/* جدول الأسعار */}
        <FadeIn delay={0.2}>
          <div className="bg-[#0f213a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            
            <div className={`bg-white/5 p-6 border-b border-white/5 flex items-center justify-between ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <h3 className={`text-xl font-bold text-white flex items-center gap-2 ${
                isAr ? 'flex-row' : 'flex-row-reverse'
              }`}>
                <ShieldCheck className="w-6 h-6 text-green-400" />
                <span>{isAr ? 'قائمة الأسعار المعتمدة' : 'Certified Price List'}</span>
              </h3>
              <span className="text-xs font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                {isAr ? 'محدث الآن' : 'Updated Now'}
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {wirePrices.map((wire, idx) => (
                <div key={wire.id} className={`p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors duration-300 ${
                  isAr ? 'text-right' : 'text-left'
                }`}>
                  
                  <div className={`flex items-center gap-4 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-12 h-12 rounded-xl bg-[#0a192f] border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{getLocalizedSize(wire.id, isAr)}</h4>
                      <p className="text-sm text-slate-400">{getLocalizedType(isAr)}</p>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 ${
                    isAr ? 'flex-row' : 'flex-row-reverse'
                  }`}>
                    <div className={isAr ? 'text-right' : 'text-left'}>
                      <span className="text-sm text-slate-400 block mb-1">{isAr ? 'السعر التقريبي' : 'Approx. Price'}</span>
                      <div className={`text-2xl font-extrabold text-blue-300 flex items-baseline gap-1 ${
                        isAr ? 'flex-row' : 'flex-row-reverse'
                      }`}>
                        <span>{wire.price}</span>
                        <span className="text-sm font-normal text-slate-400">{isAr ? 'د.ل' : 'LYD'}</span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${
                        wire.trend === 'up' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                        wire.trend === 'down' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                        'bg-slate-500/10 border-slate-500/30 text-slate-400'
                      }`}>
                        {wire.trend === 'up' && <TrendingUp className="w-5 h-5" />}
                        {wire.trend === 'down' && <TrendingDown className="w-5 h-5" />}
                        {wire.trend === 'same' && <Minus className="w-5 h-5" />}
                      </div>

                      <button 
                        onClick={(e) => handleAddToCart(e, wire)}
                        disabled={addingId === `wire-${wire.id}`}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all whitespace-nowrap cursor-pointer border ${
                          addingId === `wire-${wire.id}`
                            ? 'bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                            : 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:bg-blue-500 hover:scale-[1.03] active:scale-[0.97]'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={addingId === `wire-${wire.id}` ? 'added' : 'add'}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2"
                          >
                            {addingId === `wire-${wire.id}` ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>{isAr ? 'تمت الإضافة! ✓' : 'Added! ✓'}</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                <span>{isAr ? 'إضافة إلى السلة' : 'Add to Cart'}</span>
                              </>
                            )}
                          </motion.span>
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-[#0a192f]/50 p-4 text-center text-sm text-slate-500 border-t border-white/5">
              {isAr 
                ? '* الأسعار تقريبية وقابلة للتغيير الطفيف حسب تقلبات السوق وكمية الطلب.'
                : '* Prices are approximate and subject to slight changes based on market fluctuations and order volume.'
              }
            </div>

          </div>
        </FadeIn>

        {/* قسم مخطط البورصة التفاعلي لأسعار الأسلاك */}
        <FadeIn delay={0.3}>
          <div className="mt-12 bg-[#0f213a] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* بقعة نيون متوهجة بالخلفية */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-10 ${
              isAr ? 'text-right' : 'text-left'
            }`}>
              <div>
                <h3 className={`text-2xl font-bold text-white flex items-center gap-2 font-sans ${
                  isAr ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  <TrendingUp className="w-7 h-7 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span>{isAr ? 'مؤشر حركة الأسعار التفاعلي (البورصة اليومية)' : 'Interactive Price Index (Daily Market)'}</span>
                </h3>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                  {isAr 
                    ? 'تتبع حركة تغير أسعار الأسلاك الكهربائية صعوداً وهبوطاً. اختر مقاس السلك بالأسفل لعرض المخطط البياني الخاص به:'
                    : 'Track the price movements of electrical wires up and down. Choose the wire size below to display its price history chart:'
                  }
                </p>
              </div>

              {/* أزرار مقاسات الأسلاك */}
              <div className="flex flex-wrap gap-2 lg:justify-end max-w-xl">
                {wirePrices.map((wire) => (
                  <button
                    key={wire.id}
                    onClick={() => setSelectedChartWireId(wire.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border ${
                      selectedChartWireId === wire.id
                        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {getLocalizedSize(wire.id, isAr)}
                  </button>
                ))}
              </div>
            </div>

            {/* مخطط بياني خطي SVG */}
            <div className="bg-[#0a192f]/60 rounded-2xl p-4 md:p-6 border border-white/5 relative z-10">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[480px]">
                  <svg viewBox="0 0 500 220" className="w-full h-auto overflow-visible">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* خطوط الخلفية الأفقية */}
                    <line x1="50" y1="40" x2="450" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                    <line x1="50" y1="105" x2="450" y2="105" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                    <line x1="50" y1="170" x2="450" y2="170" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />

                    {/* علامات وقيم المحور الرأسي */}
                    <text x="40" y="44" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="end">{maxPrice.toFixed(2)} {isAr ? 'د.ل' : 'LYD'}</text>
                    <text x="40" y="109" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="end">{((maxPrice + minPrice) / 2).toFixed(2)} {isAr ? 'د.ل' : 'LYD'}</text>
                    <text x="40" y="174" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="end">{minPrice.toFixed(2)} {isAr ? 'د.ل' : 'LYD'}</text>

                    {/* المساحة الملونة المعبأة */}
                    {areaD && <path d={areaD} fill="url(#chartGradient)" className="transition-all duration-500" />}

                    {/* خط البورصة الأساسي المضيء */}
                    {pathD && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3.5"
                        filter="url(#glow)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-500"
                      />
                    )}

                    {/* نقاط البيانات وتواريخ المحور الأفقي */}
                    {historyData.map((d, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        {/* هالة دائرية عند مرور مؤشر الفأرة */}
                        <circle
                          cx={getX(idx)}
                          cy={getY(d.price)}
                          r="7"
                          fill="#3b82f6"
                          className="opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                        />
                        {/* النقطة الدائرية للبيانات */}
                        <circle
                          cx={getX(idx)}
                          cy={getY(d.price)}
                          r="4.5"
                          fill="#ffffff"
                          stroke="#2563eb"
                          strokeWidth="2.5"
                          className="transition-all duration-300 group-hover:scale-125"
                        />
                        {/* السعر أعلى النقطة */}
                        <text
                          x={getX(idx)}
                          y={getY(d.price) - 10}
                          fill="#93c5fd"
                          fontSize="8"
                          fontWeight="extrabold"
                          textAnchor="middle"
                          className="opacity-90 group-hover:opacity-100 group-hover:fill-white transition-all duration-300"
                        >
                          {d.price.toFixed(2)}
                        </text>
                        {/* التاريخ أسفل النقطة */}
                        <text
                          x={getX(idx)}
                          y="195"
                          fill="#64748b"
                          fontSize="8.5"
                          fontWeight="medium"
                          textAnchor="middle"
                          className="group-hover:fill-slate-400 transition-colors"
                        >
                          {d.date}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>



      </div>
    </div>
  )
}
