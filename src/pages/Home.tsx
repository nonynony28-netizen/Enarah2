import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Award, Shield, Sparkles, Zap, ArrowLeft, PlayCircle, Loader2, PackageSearch,
  TrendingUp, TrendingDown, Minus, ShieldCheck, Calendar, ShoppingCart, X, CheckCircle
} from 'lucide-react'

// ==========================================
// 1. النبضة الكهربائية (نقية للكمبيوتر فقط)
// ==========================================
function ElectricCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 }) 
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY })
    const handleInteract = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(target.tagName === 'BUTTON' || target.tagName === 'A' || !!target.closest('a') || !!target.closest('button'))
    }
    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mouseover", handleInteract)
    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mouseover", handleInteract)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center mix-blend-screen"
      animate={{ x: position.x - (isHovering ? 24 : 12), y: position.y - (isHovering ? 24 : 12) }}
      transition={{ x: { type: "spring", stiffness: 150, damping: 15, mass: 0.5 }, y: { type: "spring", stiffness: 150, damping: 15, mass: 0.5 } }}
    >
      <motion.div 
        animate={{ scale: isHovering ? 1.5 : 1 }}
        className={`relative flex items-center justify-center ${isHovering ? 'w-12 h-12' : 'w-6 h-6'} transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md animate-pulse" />
        <div className="absolute inset-0 border border-blue-400/50 rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
        <div className={`bg-white rounded-full shadow-[0_0_15px_5px_rgba(96,165,250,0.8)] ${isHovering ? 'w-4 h-4' : 'w-2 h-2'}`} />
      </motion.div>
    </motion.div>
  )
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
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
  
  // نظام اكتشاف الهواتف لإلغاء الحركات الثقيلة
  const [isMobile, setIsMobile] = useState(false)

  const [selectedWire, setSelectedWire] = useState<typeof wirePrices[0] | null>(null)
  const [orderForm, setOrderForm] = useState({ phone: '', city: '', quantity: 1 })
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    
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
    <div className="pt-0 relative cursor-default">
      
      {/* المؤشر المضيء يظهر للكمبيوتر فقط لتوفير الموارد */}
      {!isMobile && <ElectricCursor />}

      {/* 1. الواجهة التفاعلية */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a192f]">
        
        {/* خلفية الأجرام المضيئة (ثابتة على الهاتف ومتحركة للكمبيوتر) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {!isMobile ? (
            <>
              <motion.div 
                animate={{ y: [0, -40, 0], x: [0, 20, 0] }} 
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/30 rounded-full blur-[100px]"
              />
              <motion.div 
                animate={{ y: [0, 40, 0], x: [0, -30, 0] }} 
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px]"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />
            </>
          ) : (
            <>
              {/* نسخ ثابتة للهاتف لا تستهلك معالج الرسوميات */}
              <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-600/20 rounded-full blur-[60px]" />
              <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-cyan-400/10 rounded-full blur-[80px]" />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/80 via-transparent to-[#0a192f] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-10 md:mt-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1, ease: 'easeOut' }}
            className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-[#0d2342]/80 md:bg-white/[0.02] md:backdrop-blur-sm border border-white/[0.05] shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all"
          >
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-4 md:mb-6 leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              الإنارة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">الحديثة</span>
            </h1>
            <p className="text-base md:text-2xl text-blue-50/80 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed font-medium px-2">
              كل ما تحتاجه من الإضاءة والتأسيس الكهربائي بجودة عالمية وحلول متكاملة تلبي تطلعاتك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
              <Link to="/products" className="group relative px-6 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-gradient-to-l from-blue-600 to-blue-400 text-white font-bold text-base md:text-lg rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(59,130,246,0.4)] flex items-center justify-center gap-3">
                استعرض المنتجات
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link to="/contact" className="px-6 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-[#1a365d] md:bg-white/[0.05] md:backdrop-blur-md border border-white/10 text-white font-bold text-base md:text-lg rounded-2xl flex items-center justify-center">
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. لماذا نحن */}
      <section id="about" className="py-16 md:py-24 bg-[#0a192f] relative overflow-hidden border-t border-white/[0.02]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none hidden md:block" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-6">لماذا نحن؟</h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full" />
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { icon: Award, title: 'جودة عالية', desc: 'نختار منتجاتنا بعناية فائقة من أفضل المصادر العالمية لضمان أعلى معايير الجودة والاستدامة.' },
              { icon: Shield, title: 'حلول متكاملة', desc: 'نقدم لك جميع احتياجاتك من الإضاءة والمواد الكهربائية الذكية في مكان واحد.' },
              { icon: Sparkles, title: 'احترافية بالعمل', desc: 'فريقنا الهندسي متخصص في مساعدتك لاختيار الحلول المثالية والتصاميم لمشروعك.' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.15}>
                {/* استبدلنا الزجاج الشفاف بألوان صلبة على الهاتف لتوفير الأداء */}
                <div className="group relative bg-[#112a4f] md:bg-white/[0.02] md:backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-6 md:p-8 h-full">
                  <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/20 rounded-2xl flex items-center justify-center mb-6">
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
      <section id="featured-projects" className="py-16 md:py-24 bg-[#0a192f] relative overflow-hidden border-t border-white/[0.02]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none hidden md:block" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-4">جزء من مشاريعنا</h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
              </div>
              <Link to="/projects" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#112a4f] md:bg-white/[0.05] border border-white/10 rounded-xl text-white font-bold">
                شاهد كل المشاريع
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </FadeIn>

          {loadingProjects && (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
               <p className="text-blue-100 mt-4 animate-pulse">جاري جلب المشاريع...</p>
             </div>
          )}

          {!loadingProjects && featuredProjects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProjects.map((project, i) => (
                <FadeIn key={project.id} delay={i * 0.1}>
                  <div className="bg-[#112a4f] md:bg-white/[0.02] md:backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] overflow-hidden flex flex-col h-full">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#0d2342]/50">
                      <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-90 z-10" />
                      <div className="absolute top-4 right-4 z-20">
                        <span className="px-4 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full">{project.category}</span>
                      </div>
                    </div>
                    <div className="p-6 relative z-20 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-1">{project.name}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed flex-grow line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. نشرة الأسلاك الإيطالية */}
      <section id="wire-prices" className="py-16 md:py-24 bg-[#0a192f] relative overflow-hidden border-t border-white/[0.02]">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[150px] pointer-events-none hidden md:block" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-white/[0.02] border border-white/10 rounded-full mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-6">
                نشرة الأسلاك الإيطالية
              </h2>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 font-bold text-sm">
                <Calendar className="w-4 h-4" />
                تحديث اليوم: {currentDate}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-[#112a4f] md:bg-white/[0.02] md:backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] overflow-hidden">
              <div className="bg-white/[0.02] p-5 border-b border-white/[0.05] flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  الأسعار التقريبية المعتمدة
                </h3>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {wirePrices.map((wire, idx) => (
                  <div key={wire.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0d2342] border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-0.5">{wire.size}</h4>
                        <p className="text-xs text-slate-400">{wire.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 border-white/[0.05] pt-3 md:pt-0">
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
                        
                        <button onClick={() => setSelectedWire(wire)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
                          <ShoppingCart className="w-4 h-4" />
                          اطلب الآن
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. ابدأ مشروعك */}
      <section id="start" className="py-16 md:py-24 bg-[#0a192f] relative overflow-hidden border-t border-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="relative bg-[#112a4f] md:bg-blue-900/40 md:backdrop-blur-3xl border border-blue-400/20 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-center overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                  ابدأ مشروعك معنا <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">اليوم</span>
                </h2>
                <p className="text-blue-100/80 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                  نحن هنا لنساعدك في تحويل رؤيتك إلى واقع مبهر. تواصل مع خبرائنا للحصول على استشارة هندسية وفنية لمشروعك.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-extrabold text-lg rounded-2xl">
                  <Zap className="w-6 h-6" />
                  تواصل معنا الآن
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* ======================================
          نافذة الطلب المنبثقة (Modal)
      ====================================== */}
      <AnimatePresence>
        {selectedWire && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-[#06152b]/95" onClick={() => setSelectedWire(null)} />
            
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-md bg-[#0d2342] border border-blue-500/20 rounded-[2rem] overflow-hidden">
              <button onClick={() => setSelectedWire(null)} className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-red-500 text-white rounded-full transition-colors z-10"><X className="w-5 h-5" /></button>

              <div className="p-6 md:p-8">
                {orderStatus === 'success' ? (
                  <div className="text-center py-10">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
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

                      <button type="submit" disabled={orderStatus === 'loading'} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg mt-4 disabled:opacity-50">
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
