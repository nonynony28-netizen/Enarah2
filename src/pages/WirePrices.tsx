import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Calendar, Zap, TrendingUp, TrendingDown, Minus, ShieldCheck, ArrowRight, MessageCircle, Loader2, CheckCircle, ShoppingCart, X } from 'lucide-react'
import { Link } from 'react-router-dom' // استدعاء الرابط

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

export default function WirePrices() {
  const [currentDate, setCurrentDate] = useState('')
  const [wirePrices, setWirePrices] = useState(defaultWireData)
  
  const [selectedWire, setSelectedWire] = useState<typeof defaultWireData[0] | null>(null)
  const [orderForm, setOrderForm] = useState({ phone: '', city: '', quantity: 1 })
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }
    setCurrentDate(new Date().toLocaleDateString('ar-EG', options))
  }, [])

  useEffect(() => {
    const fetchWirePrices = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        const data = await res.json()
        if (res.ok && data.success && Array.isArray(data.data)) {
          const wireUpdates = data.data.filter((item: any) => item.email === 'admin_wire_prices@app.local')
          if (wireUpdates.length > 0) {
             const chronological = wireUpdates.reverse() 
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
          }
        }
      } catch (err) {
        console.error("Error fetching wire prices:", err)
      }
    }
    fetchWirePrices()
  }, [])

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWire) return
    setOrderStatus('loading')
    try {
      const totalPrice = (parseFloat(selectedWire.price) * orderForm.quantity).toFixed(2)
      await fetch('https://enarah2.vercel.app/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `🛒 طلبية أسلاك: مقاس ${selectedWire.size}`,
          phone: orderForm.phone,
          email: `المدينة: ${orderForm.city} | العدد: ${orderForm.quantity} لفة | الإجمالي: ${totalPrice} د.ل`,
          type: 'contact' 
        })
      })

      const telegramBotToken = "8951369127:AAFxThF562Xt9LxsQZMibNOxrFTeJtuScOM" 
      const telegramChatId = "8372746727"
      const telegramMessage = `🚨 *طلب أسلاك جديد!*\n\n🛒 *المقاس:* ${selectedWire.size}\n📦 *الكمية:* ${orderForm.quantity} لفة\n💰 *الإجمالي:* ${totalPrice} د.ل\n📍 *المدينة:* ${orderForm.city}\n📞 *الهاتف:* ${orderForm.phone}`;

      if (telegramBotToken) {
        fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: telegramChatId, text: telegramMessage, parse_mode: 'Markdown' })
        }).catch(() => {});
      }

      // تحويل المستخدم إلى الواتس اب للتأكيد الفوري
      const whatsappMsg = `السلام عليكم، أريد تأكيد طلب شراء سلك إيطالي:\n\n*المقاس:* ${selectedWire.size}\n*الكمية:* ${orderForm.quantity} لفة\n*الإجمالي:* ${totalPrice} د.ل\n*المدينة:* ${orderForm.city}\n*الهاتف:* ${orderForm.phone}`;
      const whatsappUrl = `https://wa.me/218916580068?text=${encodeURIComponent(whatsappMsg)}`;
      window.open(whatsappUrl, '_blank');

      setOrderStatus('success')
      setTimeout(() => {
        setOrderStatus('idle')
        setSelectedWire(null)
        setOrderForm({ phone: '', city: '', quantity: 1 })
      }, 3000)
    } catch { setOrderStatus('error') }
  }

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-[#0a192f] min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className="mb-6 flex justify-start">
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#0f213a] border border-white/10 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-blue-400 font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <ArrowRight className="w-5 h-5" />
              العودة للرئيسية
            </Link>
          </div>
        </FadeIn>

        {/* رأس الصفحة */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-full mb-6">
              <Zap className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            </div>
            
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

        {/* جدول الأسعار */}
        <FadeIn delay={0.2}>
          <div className="bg-[#0f213a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            
            <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-green-400" />
                قائمة الأسعار المعتمدة
              </h3>
              <span className="text-xs font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                محدث الآن
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {wirePrices.map((wire, idx) => (
                <div key={wire.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors duration-300">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0a192f] border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{wire.size}</h4>
                      <p className="text-sm text-slate-400">{wire.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <div className="text-right">
                      <span className="text-sm text-slate-400 block mb-1">السعر التقريبي</span>
                      <div className="text-2xl font-extrabold text-blue-300">
                        {wire.price} <span className="text-sm font-normal text-slate-400">د.ل</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
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
                        onClick={() => setSelectedWire(wire)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:bg-blue-500 transition-all hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        اطلب الآن
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-[#0a192f]/50 p-4 text-center text-sm text-slate-500 border-t border-white/5">
              * الأسعار تقريبية وقابلة للتغيير الطفيف حسب تقلبات السوق وكمية الطلب.
            </div>

          </div>
        </FadeIn>

        {/* نافذة الطلب المنبثقة (Modal) */}
        <AnimatePresence>
          {selectedWire && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <div className="absolute inset-0 bg-[#06152b]/95" onClick={() => setSelectedWire(null)} />
              <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-md bg-[#0d2342] border border-blue-500/20 rounded-[2rem] overflow-hidden shadow-2xl">
                <button onClick={() => setSelectedWire(null)} className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-red-500 text-white rounded-full transition-colors z-10"><X className="w-5 h-5" /></button>
                <div className="p-6 md:p-8">
                  {orderStatus === 'success' ? (
                    <div className="text-center py-10">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 shadow-[0_0_20px_rgba(74,222,128,0.3)] rounded-full animate-bounce" />
                      <h3 className="text-2xl font-bold text-white mb-2">تم تسجيل طلبك بنجاح!</h3>
                      <p className="text-slate-400">جاري توجيهك الآن إلى الواتساب لتأكيد الطلب الفوري...</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-white mb-2 pr-6">طلب سريع</h3>
                      <p className="text-blue-300 mb-6 font-medium">سلك إيطالي مقاس {selectedWire.size}</p>
                      <form onSubmit={submitOrder} className="space-y-4 md:space-y-5">
                        <div><label className="block text-slate-300 text-sm font-bold mb-2">رقم الهاتف للتواصل</label><input required type="tel" value={orderForm.phone} onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})} className="w-full bg-[#0a192f] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-right" placeholder="09X XXX XXXX" /></div>
                        <div><label className="block text-slate-300 text-sm font-bold mb-2">المدينة</label><input required type="text" value={orderForm.city} onChange={(e) => setOrderForm({...orderForm, city: e.target.value})} className="w-full bg-[#0a192f] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-right" placeholder="اسم مدينتك" /></div>
                        <div>
                          <label className="block text-slate-300 text-sm font-bold mb-2">الكمية (عدد اللفات)</label>
                          <div className="flex items-center bg-[#0a192f] border border-white/10 rounded-xl overflow-hidden">
                            <button type="button" onClick={() => setOrderForm({...orderForm, quantity: Math.max(1, orderForm.quantity - 1)})} className="px-5 py-3 text-white hover:bg-white/10 font-bold">-</button>
                            <input type="number" min="1" value={orderForm.quantity} onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value) || 1})} className="w-full bg-transparent text-white text-center font-bold outline-none" />
                            <button type="button" onClick={() => setOrderForm({...orderForm, quantity: orderForm.quantity + 1})} className="px-5 py-3 text-white hover:bg-white/10 font-bold">+</button>
                          </div>
                        </div>
                        <div className="p-4 bg-[#0a192f] border border-blue-500/20 rounded-xl flex justify-between items-center mt-6"><span className="text-slate-300 font-bold">الإجمالي:</span><span className="text-2xl font-extrabold text-white">{(parseFloat(selectedWire.price) * orderForm.quantity).toFixed(2)} <span className="text-sm font-normal text-slate-400">د.ل</span></span></div>
                        <button type="submit" disabled={orderStatus === 'loading'} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold text-lg mt-4 disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                          {orderStatus === 'loading' ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <>
                              <MessageCircle className="w-6 h-6 animate-pulse" />
                              تأكيد الطلب وإرساله بالواتساب
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
