import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Award, Shield, Sparkles, Zap, ArrowLeft, PlayCircle, Loader2, PackageSearch,
  TrendingUp, TrendingDown, Minus, ShieldCheck, Calendar, ShoppingCart, X, CheckCircle
} from 'lucide-react'

// نمط الوهج الشعاعي الأزرق للعناوين
const glowingTitleStyle = {
  textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
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

type ProjectItem = { id: string; name: string; description: string; image: string; video?: string; category: string }
type TrendType = 'up' | 'down' | 'same'

const defaultWireData = [
  { id: '1.5', size: '1.5 ملي', type: 'مفرد (لفة 100 متر)', price: '45.00', trend: 'same' as TrendType },
  { id: '2.5', size: '2.5 ملي', type: 'مفرد (لفة 100 متر)', price: '75.00', trend: 'same' as TrendType },
  { id: '4.0', size: '4.0 ملي', type: 'مفرد (لفة 100 متر)', price: '115.00', trend: 'same' as TrendType },
  { id: '6.0', size: '6.0 ملي', type: 'مفرد (لفة 100 متر)', price: '165.00', trend: 'same' as TrendType },
  { id: '10.0', size: '10.0 ملي', type: 'مفرد (لفة 100 متر)', price: '290.00', trend: 'same' as TrendType },
  { id: '16.0', size: '16.0 ملي', type: 'مفرد (لفة 100 متر)', price: '450.00', trend: 'same' as TrendType },
  { id: '25.0', size: '25.0 ملي', type: 'مفرد (لفة 100 متر)', price: '680.00', trend: 'same' as TrendType },
]

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const [wirePrices, setWirePrices] = useState(defaultWireData)
  
  const [selectedWire, setSelectedWire] = useState<typeof wirePrices[0] | null>(null)
  const [orderForm, setOrderForm] = useState({ phone: '', city: '', quantity: 1 })
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    setCurrentDate(new Date().toLocaleDateString('ar-EG', options))
  }, [])

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        const data = await res.json()
        if (res.ok && data.success && Array.isArray(data.data)) {
          
          const projectsOnly = data.data
            .filter((item: any) => item.type !== 'contact')
            .filter((item: any) => {
               try { return JSON.parse(item.phone).type === 'project' } catch { return false }
            })
            .map((item: any, index: number) => {
              let mediaData: any = {}
              try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}
              return {
                id: item._id || String(index),
                name: item.name || 'مشروع مميز',
                description: mediaData.description || '',
                image: mediaData.imageUrl || '/images/default-product.jpg',
                video: mediaData.videoUrl || '',
                category: mediaData.category || 'مشاريعنا',
              }
            })
          setFeaturedProjects(projectsOnly.reverse().slice(0, 4))

          const wireUpdates = data.data.filter((item: any) => item.email === 'admin_wire_prices@app.local')
          if (wireUpdates.length > 0) {
             const chronological = wireUpdates.reverse() 
             const latestObj = JSON.parse(chronological[chronological.length - 1].phone).prices
             
             const previousObj = chronological.length > 1 
               ? JSON.parse(chronological[chronological.length - 2].phone).prices 
               : null

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

        } else setFeaturedProjects([])
      } catch { setFeaturedProjects([]) } finally { setLoadingProjects(false) }
    }
    fetchHomeData()
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
      const telegramMessage = `🚨 *طلب أسلاك جديد!*\n\n` +
                              `🛒 *المقاس:* ${selectedWire.size}\n` +
                              `📦 *الكمية:* ${orderForm.quantity} لفة\n` +
                              `💰 *الإجمالي:* ${totalPrice} د.ل\n` +
                              `📍 *المدينة:* ${orderForm.city}\n` +
                              `📞 *الهاتف:* ${orderForm.phone}`;

      if (telegramBotToken) {
        fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: telegramChatId, text: telegramMessage, parse_mode: 'Markdown' })
        }).catch(err => console.log("Telegram Error:", err));
      }

      setOrderStatus('success')
      setTimeout(() => {
        setOrderStatus('idle')
        setSelectedWire(null)
        setOrderForm({ phone: '', city: '', quantity: 1 })
      }, 3000)
    } catch { setOrderStatus('error') }
  }

  return (
    <div className="pt-0 relative cursor-default bg-[#0a192f] text-white">
      
      {/* 1. الواجهة الترحيبية بالفيديو */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* الفيديو الطولي الخاص بك من Streamable */}
        <div className="absolute inset-0 w-full h-full z-0 bg-[#0a192f] overflow-hidden flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 w-[250vw] h-[150vh] md:w-[120vw] md:h-[150vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <iframe
              src="https://streamable.com/e/lm701e?autoplay=1&nocontrols=1&muted=1&loop=1&title=0&byline=0&portrait=0"
              frameBorder="0"
              allow="autoplay; fullscreen"
              className="w-full h-full object-cover opacity-50"
              style={{ transform: "translateZ(0)" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/40 via-transparent to-[#0a192f] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-10 md:mt-20">
          <div className="p-6 md:p-12 transition-all">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight" style={glowingTitleStyle}>
              الإنارة <span className="text-blue-300">الحديثة</span>
            </h1>
            <p className="text-base md:text-2xl text-blue-50/90 mb-10 max-w-3xl mx-auto leading-relaxed font-medium px-2 shadow-sm">
              كل ما تحتاجه من الإضاءة والتأسيس الكهربائي بجودة عالمية وحلول متكاملة تلبي تطلعاتك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
              <Link to="/products" className="group relative px-6 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-blue-600 text-white font-bold text-base md:text-lg rounded-2xl transition-all duration-300 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] flex items-center justify-center gap-3">
                استعرض المنتجات
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link to="/contact" className="px-6 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-white/5 border border-white/10 text-white font-bold text-base md:text-lg rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. لماذا نحن */}
      <section id="about" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-[#0a192f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6" style={glowingTitleStyle}>
              لماذا نحن؟
            </h2>
            <div className="w-20 h-1.5 bg-blue-500 mx-auto rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { icon: Award, title: 'جودة عالية', desc: 'نختار منتجاتنا بعناية فائقة من أفضل المصادر العالمية لضمان أعلى معايير الجودة والاستدامة.' },
              { icon: Shield, title: 'حلول متكاملة', desc: 'نقدم لك جميع احتياجاتك من الإضاءة والمواد الكهربائية الذكية في مكان واحد.' },
              { icon: Sparkles, title: 'احترافية بالعمل', desc: 'فريقنا الهندسي متخصص في مساعدتك لاختيار الحلول المثالية والتصاميم لمشروعك.' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="bg-[#0f213a] border border-white/5 rounded-[2rem] p-6 md:p-8 h-full hover:border-blue-500/30 transition-colors">
                  <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-slate-400 text-base leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 3. جزء من مشاريعنا */}
      <section id="featured-projects" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-[#0a192f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={glowingTitleStyle}>
                جزء من مشاريعنا
              </h2>
              <div className="w-20 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            </div>
            <Link to="/projects" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all">
              شاهد كل المشاريع
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          {loadingProjects ? (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
               <p className="text-blue-200 mt-4">جاري جلب المشاريع...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProjects.map((project, i) => (
                <div key={project.id} className="bg-[#0f213a] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-blue-500/30 transition-colors">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0a192f]">
                    <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-90 z-10" />
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-4 py-1.5 bg-blue-500/20 text-blue-200 text-xs font-bold rounded-full">{project.category}</span>
                    </div>
                  </div>
                  <div className="p-6 relative z-20 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-1">{project.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-grow line-clamp-2">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. نشرة الأسلاك الإيطالية */}
      <section id="wire-prices" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-[#0a192f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-full mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6" style={glowingTitleStyle}>
              نشرة الأسلاك الإيطالية
            </h2>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-200 font-bold text-sm">
              <Calendar className="w-4 h-4" />
              تحديث اليوم: {currentDate}
            </div>
          </div>

          <div className="bg-[#0f213a] border border-white/5 rounded-[2rem] overflow-hidden">
            <div className="bg-white/5 p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                الأسعار التقريبية المعتمدة
              </h3>
            </div>

            <div className="divide-y divide-white/5">
              {wirePrices.map((wire, idx) => (
                <div key={wire.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0a192f] border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-0.5">{wire.size}</h4>
                      <p className="text-xs text-slate-400">{wire.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-blue-300">
                        {wire.price} <span className="text-xs font-normal text-slate-400">د.ل</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${
                        wire.trend === 'up' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                        wire.trend === 'down' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                        'bg-slate-500/10 border-slate-500/30 text-slate-400'
                      }`}>
                        {wire.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                        {wire.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                        {wire.trend === 'same' && <Minus className="w-4 h-4" />}
                      </div>
                      
                      <button onClick={() => setSelectedWire(wire)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:bg-blue-500 transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                        اطلب الآن
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ابدأ مشروعك */}
      <section id="start" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-[#0a192f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative bg-[#0f213a] border border-blue-500/20 rounded-[2rem] p-8 md:p-16 text-center overflow-hidden">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6" style={glowingTitleStyle}>
              ابدأ مشروعك معنا <span className="text-blue-300">اليوم</span>
            </h2>
            <p className="text-blue-100/80 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              نحن هنا لنساعدك في تحويل رؤيتك إلى واقع مبهر. تواصل مع خبرائنا للحصول على استشارة هندسية وفنية لمشروعك.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-extrabold text-lg rounded-2xl hover:bg-slate-100 transition-colors">
              <Zap className="w-6 h-6" />
              تواصل معنا الآن
            </Link>
          </div>
        </div>
      </section>
      
      {/* ======================================
          نافذة الطلب المنبثقة (Modal)
      ====================================== */}
      <AnimatePresence>
        {selectedWire && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-[#06152b]/95" onClick={() => setSelectedWire(null)} />
            
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-md bg-[#0d2342] border border-blue-500/20 rounded-[2rem] overflow-hidden shadow-2xl">
              <button onClick={() => setSelectedWire(null)} className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-red-500 text-white rounded-full transition-colors z-10"><X className="w-5 h-5" /></button>

              <div className="p-6 md:p-8">
                {orderStatus === 'success' ? (
                  <div className="text-center py-10">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 shadow-[0_0_20px_rgba(74,222,128,0.3)] rounded-full" />
                    <h3 className="text-2xl font-bold text-white mb-2">تم استلام طلبك بنجاح!</h3>
                    <p className="text-slate-400">سنتصل بك في أقرب وقت لتأكيد الطلبية وتجهيزها.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2 pr-6">طلب سريع</h3>
                    <p className="text-blue-300 mb-6 font-medium">سلك إيطالي مقاس {selectedWire.size}</p>

                    <form onSubmit={submitOrder} className="space-y-4 md:space-y-5">
                      <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">رقم الهاتف للتواصل</label>
                        <input required type="tel" value={orderForm.phone} onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})} className="w-full bg-[#0a192f] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-right" placeholder="09X XXX XXXX" />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">المدينة</label>
                        <input required type="text" value={orderForm.city} onChange={(e) => setOrderForm({...orderForm, city: e.target.value})} className="w-full bg-[#0a192f] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-right" placeholder="اسم مدينتك" />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-bold mb-2">الكمية (عدد اللفات)</label>
                        <div className="flex items-center bg-[#0a192f] border border-white/10 rounded-xl overflow-hidden">
                          <button type="button" onClick={() => setOrderForm({...orderForm, quantity: Math.max(1, orderForm.quantity - 1)})} className="px-5 py-3 text-white hover:bg-white/10 font-bold">-</button>
                          <input type="number" min="1" value={orderForm.quantity} onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value) || 1})} className="w-full bg-transparent text-white text-center font-bold outline-none" />
                          <button type="button" onClick={() => setOrderForm({...orderForm, quantity: orderForm.quantity + 1})} className="px-5 py-3 text-white hover:bg-white/10 font-bold">+</button>
                        </div>
                      </div>

                      <div className="p-4 bg-[#0a192f] border border-blue-500/20 rounded-xl flex justify-between items-center mt-6">
                        <span className="text-slate-300 font-bold">الإجمالي:</span>
                        <span className="text-2xl font-extrabold text-white">{(parseFloat(selectedWire.price) * orderForm.quantity).toFixed(2)} <span className="text-sm font-normal text-slate-400">د.ل</span></span>
                      </div>

                      <button type="submit" disabled={orderStatus === 'loading'} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg mt-4 disabled:opacity-50 hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        {orderStatus === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> : 'تأكيد الطلب'}
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
  )
}
