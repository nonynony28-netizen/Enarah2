import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useShake } from '../hooks/use-shake'
import {
  Award, Shield, Sparkles, Zap, ArrowLeft, Loader2,
  TrendingUp, TrendingDown, Minus, ShieldCheck, Calendar, ShoppingCart, X, CheckCircle, Lightbulb, MessageCircle,
  Facebook, Instagram, ChevronRight, ChevronLeft, PlayCircle
} from 'lucide-react'

// نمط الوهج
const glowingTitleStyle = { textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)' }

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '50px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} transition={{ duration: 0.5, delay, ease: "easeOut" }} style={{ willChange: "opacity, transform" }}>
      {children}
    </motion.div>
  )
}

type ProjectItem = { id: string; name: string; description: string; image: string; coverImage: string; video?: string; category: string }
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

const paintColors = [
  { id: 'white', name: 'أبيض ناصع', hex: '#ffffff', advice: {
    warm: 'يعطي دفئاً ومظهراً كلاسيكياً مريحاً للعين، مناسب لغرف النوم والمجالس.',
    natural: 'الخيار الأمثل للأبيض! يظهر البياض الطبيعي والنقاء دون اصفرار أو برودة.',
    cool: 'يعطي إضاءة قوية ونشيطة تشبه المكاتب، قد يكون ساطعاً جداً للمنازل.'
  }},
  { id: 'beige', name: 'بيج دافئ', hex: '#f5ebe0', advice: {
    warm: 'تطابق رائع! يعزز دفء البيج ويخلق أجواء حميمية وغنية جداً ومثالية للمجالس.',
    natural: 'خيار ممتاز ومتوازن يظهر نعومة لون البيج بشكل طبيعي دون تزييف.',
    cool: 'غير محبذ كثيراً، حيث يجعل لون البيج الدافئ يبدو شاحباً أو رمادياً ميتًا.'
  }},
  { id: 'grey', name: 'رمادي عصري', hex: '#e5e5e5', advice: {
    warm: 'تحذير: الإضاءة الصفراء قد تحول الرمادي إلى مظهر مائل للاخضرار أو الاتساخ.',
    natural: 'تطابق رائع! يحافظ على برودة الرمادي وجماله العصري دون تغيير لونه الأصلي.',
    cool: 'يعزز جمال الرمادي البارد ويعطي شعوراً بنظافة ومستقبلية المكان.'
  }},
  { id: 'navy', name: 'أزرق كحلي', hex: '#1e293b', advice: {
    warm: 'يخلق تبايناً درامياً فخماً، مناسب للجدران المميزة (Accent Walls) لتبدو فخمة.',
    natural: 'خيار ممتاز يظهر جمال اللون الكحلي وعمقه بوضوح تحت الضوء الطبيعي.',
    cool: 'يبرز درجات الأزرق الحقيقية ويجعل الجدار يبدو بارداً وحديثاً للغاية.'
  }},
  { id: 'green', name: 'أخضر زيتي', hex: '#3f4e3f', advice: {
    warm: 'يزيد من حميمية اللون الأخضر ويجعله يبدو ترابياً ودافئاً جداً ومريحاً.',
    natural: 'يظهر درجات الأخضر الطبيعية بشكل مذهل ويحافظ على حيوية ونضارة اللون.',
    cool: 'يجعل الأخضر يبدو بارداً وأقل دفئاً، يفضل استخدامه في المكاتب وأماكن العمل.'
  }},
]

export default function Home() {
  const { scrollYProgress } = useScroll()

  // Map scroll progress to filament brightness, light cone opacity, and spotlight scale
  const filamentColor = useTransform(scrollYProgress, [0, 0.45], ["#475569", "#fbbf24"])
  const filamentGlow = useTransform(scrollYProgress, [0, 0.45], [
    "drop-shadow(0 0 0px rgba(0,0,0,0))", 
    "drop-shadow(0 0 8px rgba(245,158,11,0.85))"
  ])
  const spotlightOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.45])
  const spotlightScale = useTransform(scrollYProgress, [0, 0.6], [0.85, 1.25])
  const spotlightRotate = useTransform(scrollYProgress, [0, 0.6], [0, -12])
  const bulbAuraOpacity = useTransform(scrollYProgress, [0, 0.45], [0.1, 0.85])

  const [pageLoading, setPageLoading] = useState(true)
  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const [wirePrices, setWirePrices] = useState(defaultWireData)
  
  const [selectedWire, setSelectedWire] = useState<typeof wirePrices[0] | null>(null)
  const [orderForm, setOrderForm] = useState({ phone: '', city: '', quantity: 1 })
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const [simColor, setSimColor] = useState<'warm' | 'natural' | 'cool'>('warm')
  const [simSpot, setSimSpot] = useState(true)
  const [simLed, setSimLed] = useState(false)
  const [selectedPaintId, setSelectedPaintId] = useState('white')
  const [paintColorTemp, setPaintColorTemp] = useState<'warm' | 'natural' | 'cool'>('warm')
  const [paintFlicker, setPaintFlicker] = useState(false)
  const [stackIdx, setStackIdx] = useState(0)

  const { requestPermission } = useShake({
    onShake: () => {
      setPaintColorTemp((current) => {
        if (current === 'warm') return 'natural'
        if (current === 'natural') return 'cool'
        return 'warm'
      })
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(100)
      }
      setPaintFlicker(true)
      setTimeout(() => setPaintFlicker(false), 120)
    }
  })


  useEffect(() => {
    setPaintFlicker(true)
    const t = setTimeout(() => setPaintFlicker(false), 80)
    return () => clearTimeout(t)
  }, [paintColorTemp, selectedPaintId])

  useEffect(() => {
    const startTime = Date.now();

    const hideLoader = () => {
      const elapsedTime = Date.now() - startTime;
      const minDuration = 1200; // وقت أدنى 1.2 ثانية لتظهر شاشة التحميل بشكل أنيق

      if (elapsedTime >= minDuration) {
        setPageLoading(false);
      } else {
        setTimeout(() => {
          setPageLoading(false);
        }, minDuration - elapsedTime);
      }
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      const handleLoad = () => {
        hideLoader();
      };
      window.addEventListener('load', handleLoad);

      // احتياطياً في حال تعطل أي عنصر أو استغرق طويلاً، يختفي بعد ثانيتين
      const backupTimeout = setTimeout(() => {
        setPageLoading(false);
      }, 2000);

      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(backupTimeout);
      };
    }
  }, [])

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
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

              const rawImage = mediaData.imageUrl || '/images/default-product.jpg'
              const imageUrls = rawImage.split(',').map((url: string) => url.trim()).filter(Boolean)
              const coverImage = imageUrls[0] || '/images/default-product.jpg'

              return {
                id: item._id || String(index),
                name: item.name || 'مشروع مميز',
                description: mediaData.description || '',
                image: rawImage,
                coverImage: coverImage,
                video: mediaData.videoUrl || '',
                category: mediaData.category || 'مشاريعنا',
              }
            })
          setFeaturedProjects(projectsOnly.reverse().slice(0, 4))

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
      window.location.href = whatsappUrl;

      setOrderStatus('success')
      setTimeout(() => {
        setOrderStatus('idle')
        setSelectedWire(null)
        setOrderForm({ phone: '', city: '', quantity: 1 })
      }, 3000)
    } catch { setOrderStatus('error') }
  }

  // فتح معرض الصور للمشروع
  const openGallery = (project: ProjectItem) => {
    setSelectedProject(project)
    setActiveImageIndex(0)
  }

  const handleNextImage = (length: number) => {
    setActiveImageIndex((prev) => (prev + 1) % length)
  }

  const handlePrevImage = (length: number) => {
    setActiveImageIndex((prev) => (prev - 1 + length) % length)
  }

  return (
    <>
      {/* شاشة التحميل المتوهجة الفاخرة */}
      <AnimatePresence>
        {pageLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0a192f]"
          >
            <div className="relative flex flex-col items-center">
              {/* حلقات متوهجة تدور */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-400 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-blue-300/10"></div>
                <div className="absolute inset-2 rounded-full border-4 border-b-blue-300 animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lightbulb className="w-9 h-9 text-blue-300 animate-pulse drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                </div>
              </div>

              {/* الاسم المتوهج */}
              <motion.h2 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
                className="text-3xl font-black text-white mb-2 tracking-wider" 
                style={glowingTitleStyle}
              >
                الإنارة <span className="text-blue-300">الحديثة</span>
              </motion.h2>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-0 relative cursor-default bg-transparent text-white">
        
        {/* =========================================================
            محاكي الإنارة ثلاثي الأبعاد المرتبط بالتمرير (Scroll 3D Bulb)
            ========================================================= */}
        {/* 1. الكشاف الخلفي العملاق (Dynamic Scroll Spotlight) */}
        <motion.div 
          style={{
            opacity: spotlightOpacity,
            scale: spotlightScale,
            rotate: spotlightRotate,
            transformOrigin: 'top right',
            background: 'radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.45) 0%, rgba(212, 160, 23, 0.15) 35%, transparent 75%)',
            willChange: 'transform, opacity',
          }}
          className="fixed top-0 right-0 w-[140vw] h-[140vh] pointer-events-none z-0 filter blur-[40px] hidden md:block"
        />

        {/* 2. مجسم المصباح المعلق ثلاثي الأبعاد (Floating SVG 3D Bulb) */}
        <motion.div 
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          className="fixed right-[-20px] md:right-4 top-[80px] md:top-[100px] w-20 md:w-36 h-36 md:h-56 z-20 pointer-events-none flex flex-col items-center select-none"
        >
          {/* سلك التعليق النحيف */}
          <div className="w-[1.5px] h-12 md:h-20 bg-gradient-to-b from-[#0a192f] via-slate-700 to-slate-500" />
          
          <div className="relative w-full aspect-[2/3] flex flex-col items-center justify-start">
            {/* توهج هالة المصباح */}
            <motion.div 
              style={{ opacity: bulbAuraOpacity, willChange: 'opacity' }}
              className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl pointer-events-none animate-pulse"
            />
            
            {/* مجسم المصباح SVG */}
            <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
              {/* القاعدة المعدنية للمصباح */}
              <path d="M40 100 h20 v6 h-20 z M42 106 h16 v6 h-16 z M45 112 h10 v4 h-10 z" fill="#4b5563" stroke="#1f2937" strokeWidth="1"/>
              {/* نقطة تلامس الكهرباء السفلى */}
              <path d="M47 116 h6 v3 h-6 z" fill="#111827" />
              
              {/* أسلاك دعم الفتيل الداخلي */}
              <path d="M44 100 L44 75 M56 100 L56 75" fill="none" stroke="#4b5563" strokeWidth="1"/>
              
              {/* الفتيل المضيء التفاعلي المتصل بالتمرير */}
              <motion.path 
                d="M44 75 Q50 58 56 75" 
                fill="none" 
                style={{ 
                  stroke: filamentColor,
                  filter: filamentGlow,
                  willChange: 'stroke, filter',
                }}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              
              {/* الانتفاخ الزجاجي الخارجي للمصباح */}
              <path 
                d="M32 100 C20 88 15 72 15 55 C15 25 30.5 8 50 8 C69.5 8 85 25 85 55 C85 72 80 88 68 100 Z" 
                fill="rgba(255,255,255,0.02)" 
                stroke="rgba(255,255,255,0.15)" 
                strokeWidth="1.25"
              />
              
              {/* لمعان زجاجي علوي جانبي */}
              <path 
                d="M22 50 C22 34 30 16 45 11" 
                fill="none" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth="1.5" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* 1. الواجهة الترحيبية بالفيديو فائق السرعة */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full z-0 bg-[#0a192f] overflow-hidden flex items-center justify-center">
            
            {/* الكود النهائي للفيديو: تحميل مسبق قوي، وبدون تأثيرات بطء */}
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/poster.jpg"
              className="absolute top-0 left-0 w-full h-full object-cover opacity-60 mix-blend-screen pointer-events-none"
              style={{ willChange: 'transform', transform: 'translateZ(0)' }}
            >
              <source src="https://api-f.streamable.com/api/v1/videos/wlb611/mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/40 via-transparent to-[#0a192f] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-10 md:mt-20">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-normal tracking-tight text-white py-2">
                <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)]">الإنارة</span>{' '}
                <span className="text-blue-400 drop-shadow-[0_4px_20px_rgba(59,130,246,0.65)]">الحديثة</span>
              </h1>
              <p className="text-base md:text-2xl text-blue-50/90 mb-10 max-w-3xl mx-auto leading-relaxed font-medium px-2 shadow-sm">كل ما تحتاجه من الإضاءة والتأسيس الكهربائي بجودة عالمية وحلول متكاملة تلبي تطلعاتك</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
                <Link 
                  to="/products" 
                  className="group relative px-8 py-4 w-full sm:w-auto overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-[length:200%_auto] text-white font-black text-base md:text-lg rounded-2xl transition-all duration-500 hover:bg-[right_center] flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_20px_rgba(59,130,246,0.45)] hover:shadow-[0_0_35px_rgba(59,130,246,0.65)] ring-2 ring-blue-500/10 hover:ring-blue-400/30"
                >
                  {/* تأثير لمعة نيون متحركة */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmerSweep_1.8s_infinite_ease-in-out]" />
                  <span>استعرض المنتجات</span>
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
                </Link>
                <Link 
                  to="/contact" 
                  className="group relative px-8 py-4 w-full sm:w-auto overflow-hidden bg-[#0d2342]/60 backdrop-blur-md border border-white/10 hover:border-blue-500/50 hover:bg-blue-600/10 text-white hover:text-blue-300 font-extrabold text-base md:text-lg rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] ring-2 ring-white/5 hover:ring-blue-500/15"
                >
                  <MessageCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-400 group-hover:rotate-12 transition-all duration-300" />
                  <span>تواصل معنا</span>
                </Link>
              </div>

              {/* روابط التواصل الاجتماعي للفيسبوك وتيك توك وإنستغرام */}
              <div className="flex justify-center mt-12 animate-fade-in">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0a192f]/40 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                  <span className="text-slate-400 text-xs font-bold font-sans pl-3 border-l border-white/10">تابع صفحاتنا:</span>
                  <div className="flex items-center gap-3">
                    <a 
                      href="https://www.facebook.com/share/1BxjvUxxvG/?mibextid=wwXIfr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                      title="فيسبوك"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://www.instagram.com/enara_hadetha?igsh=MXVqaGlqdHN5cnM5OQ==" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-pink-600/10 border border-pink-500/20 text-pink-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.1)]"
                      title="إنستغرام"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://www.tiktok.com/@modernenara?_r=1&_t=ZS-96dCObkuFUK" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-200/10 border border-white/10 text-slate-200 hover:text-white hover:bg-black hover:border-slate-800 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      title="تيك توك"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2.01 3.7 2.37v3.83c-1.39-.09-2.74-.61-3.87-1.48a7.25 7.25 0 0 1-2.47-3.08v8.66c0 1.25-.26 2.5-.77 3.66a7.56 7.56 0 0 1-4.8 4.41c-1.25.38-2.57.44-3.85.17a7.66 7.66 0 0 1-5.18-4.47 7.7 7.7 0 0 1 .15-5.06c.55-1.42 1.56-2.65 2.87-3.48a7.84 7.84 0 0 1 7.21-.57v4.02a3.79 3.79 0 0 0-2.31 1.09 3.73 3.73 0 0 0-1.12 2.3c-.09.78.11 1.57.55 2.2a3.78 3.78 0 0 0 4.14 1.48c.88-.23 1.66-.78 2.2-1.52.54-.75.82-1.65.79-2.57V.02z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
        </section>

        {/* 2. لماذا نحن */}
        <section id="about" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          {/* بقع توهج نيونية خفيفة عائمة */}
          <div className="hidden md:block absolute top-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0 animate-float-1" />
          <div className="hidden md:block absolute bottom-1/4 right-0 w-72 h-72 bg-blue-400/5 rounded-full blur-[120px] pointer-events-none z-0 animate-float-2" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-white">
                لماذا <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">نحن؟</span>
              </h2>
              <div className="flex items-center justify-center gap-1.5 mt-4">
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Visual High-Tech Neon Bulb Composition */}
              <div className="lg:col-span-5 relative w-full flex items-center justify-center min-h-[300px]">
                {/* Background lighting waves */}
                <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute w-48 h-48 bg-amber-500/5 rounded-full blur-[70px] animate-pulse [animation-delay:2s]" />

                {/* 3D Glassmorphic Console with Glowing Lightbulb */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative p-8 rounded-[2.5rem] bg-[#0f213a]/50 backdrop-blur-xl border border-white/10 w-full max-w-[360px] aspect-square flex flex-col justify-between overflow-hidden shadow-2xl"
                >
                  {/* Subtle Grid backdrop */}
                  <div className="absolute inset-0 bg-animated-grid opacity-10 pointer-events-none" />

                  {/* Rotating decorative halo rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full border border-dashed border-blue-500/25 animate-spin [animation-duration:40s]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-blue-500/10 animate-spin [animation-direction:reverse] [animation-duration:20s]" />

                  {/* Glowing light bulb icon in the center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                    <div className="relative w-28 h-28 rounded-full bg-blue-600/10 border border-blue-500/35 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.25)]">
                      <Lightbulb className="w-14 h-14 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.85)] animate-pulse" />
                      {/* Decorative glowing dots */}
                      <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      <span className="absolute bottom-4 right-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="relative z-20 flex justify-between items-center w-full">
                    <span className="text-[10px] font-bold px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-full font-sans uppercase tracking-wider">
                      Enarah Smart UI
                    </span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                  </div>

                  {/* Bottom Stats Badge */}
                  <div className="relative z-20 w-full flex items-center justify-between gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      className="cursor-default bg-white/5 border border-white/10 rounded-2xl p-3 flex-1 text-center transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-600/5"
                    >
                      <span className="text-2xl font-black text-white block leading-none">100%</span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1.5">منتجات أصلية</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      className="cursor-default bg-white/5 border border-white/10 rounded-2xl p-3 flex-1 text-center transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-600/5"
                    >
                      <span className="text-2xl font-black text-blue-300 block leading-none">100%</span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1.5">ضمان وموثوقية</span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Dynamic Stacked Glass Cards */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {[
                  { 
                    icon: Award, 
                    title: 'جودة عالية ومعتمدة', 
                    desc: 'نختار كافة مواد التأسيس والإنارة بعناية فائقة لتطابق أعلى معايير الجودة والأمان لتدوم طويلاً.',
                    badge: 'مواد أصلية 🛡️',
                    color: 'from-blue-500/10 hover:border-blue-500/40 text-blue-400 border-blue-500/20'
                  },
                  { 
                    icon: Shield, 
                    title: 'حلول كهربائية وإنارة متكاملة', 
                    desc: 'نوفر لك كل ما تحتاجه لتأسيس منزلك أو مشروعك من كابلات، أسلاك، مفاتيح ذكية، وسبوتات إنارة في مكان واحد دون عناء البحث.',
                    badge: 'شامل ومتكامل 📦',
                    color: 'from-amber-500/10 hover:border-amber-500/40 text-amber-400 border-amber-500/20'
                  },
                  { 
                    icon: Sparkles, 
                    title: 'خدمة عملاء ودعم سريع', 
                    desc: 'فريقنا متواجد دائماً لمساعدتك في اختيار المنتجات المناسبة وتوفير الكميات المطلوبة وتسهيل توصيلها بأمان.',
                    badge: 'دعم مبيعات 📞',
                    color: 'from-indigo-500/10 hover:border-indigo-500/40 text-indigo-400 border-indigo-500/20'
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    whileHover={{ scale: 1.01, x: -4 }}
                    className={`relative p-5 md:p-6 rounded-[1.8rem] bg-gradient-to-l ${item.color} border bg-[#0f213a]/30 backdrop-blur-md transition-all duration-300 flex flex-col md:flex-row items-start gap-4 md:gap-5 cursor-default group shadow-[0_4px_25px_rgba(0,0,0,0.1)]`}
                  >
                    {/* Icon container */}
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all duration-300 shrink-0">
                      <item.icon className="w-7 h-7" />
                    </div>

                    {/* Text Details */}
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg md:text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors">{item.title}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">{item.badge}</span>
                      </div>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2.5 مُحاكي الإضاءة التفاعلي المبتكر */}
        <section id="simulator" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">
                مُحاكي الإضاءة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">التفاعلي</span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                جرب توزيع ألوان ومقاسات الإضاءة بنفسك في صالة افتراضية، واختر ما يناسب ذوقك وبيتك
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-4">
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-[#0f213a] border border-white/5 p-6 md:p-8 rounded-[2.5rem] shadow-xl">
              
              {/* شاشة العرض - الصالة الافتراضية بمقاس صغير ملموم */}
              <div className="w-full lg:w-[38%] max-w-[360px] aspect-[4/3] rounded-2xl overflow-hidden relative bg-black shadow-2xl border border-white/10 group">
                {/* الصورة الأساسية للصالة */}
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                  alt="Virtual Room" 
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                />

                {/* طبقة محاكاة الإظلام والإنارة (تتحكم في الإضاءة عبر الشفافية بدلاً من الفلاتر الثقيلة) */}
                <div 
                  className="absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none z-10"
                  style={{
                    opacity: 
                      (!simSpot && !simLed) ? 0.75 : 
                      (simSpot && simLed) ? 0.0 : 
                      simSpot ? 0.22 : 0.45
                  }}
                />

                {/* طبقة محاكاة لون الإضاءة العام (Color Overlay) */}
                <div 
                  className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-10"
                  style={{
                    backgroundColor: 
                      (!simSpot && !simLed) ? 'transparent' :
                      simColor === 'warm' ? 'rgba(251, 191, 36, 0.1)' : 
                      simColor === 'natural' ? 'rgba(253, 224, 71, 0.07)' : 
                      'rgba(186, 230, 253, 0.07)',
                    opacity: (simSpot || simLed) ? 1 : 0
                  }}
                />

                {/* تأثير مخاريط الإضاءة (Spotlight Cones) */}
                {simSpot && (
                  <div className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-500">
                    {/* السبوت الأول (يمين) */}
                    <div 
                      className="absolute top-0 right-[25%] w-32 h-full opacity-75 transition-all duration-500"
                      style={{
                        background: `radial-gradient(ellipse at top, ${
                          simColor === 'warm' ? 'rgba(251, 191, 36, 0.45)' : 
                          simColor === 'natural' ? 'rgba(254, 240, 138, 0.35)' : 
                          'rgba(186, 230, 253, 0.35)'
                        } 0%, transparent 75%)`,
                        clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)'
                      }}
                    />
                    {/* السبوت الثاني (يسار) */}
                    <div 
                      className="absolute top-0 left-[25%] w-32 h-full opacity-75 transition-all duration-500"
                      style={{
                        background: `radial-gradient(ellipse at top, ${
                          simColor === 'warm' ? 'rgba(251, 191, 36, 0.45)' : 
                          simColor === 'natural' ? 'rgba(254, 240, 138, 0.35)' : 
                          'rgba(186, 230, 253, 0.35)'
                        } 0%, transparent 75%)`,
                        clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)'
                      }}
                    />
                  </div>
                )}

                {/* تأثير الإنارة المخفية من السقف (LED Cove Glow) */}
                {simLed && (
                  <div 
                    className="absolute top-0 left-0 right-0 h-14 pointer-events-none z-20 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to bottom, ${
                        simColor === 'warm' ? 'rgba(251, 191, 36, 0.45)' : 
                        simColor === 'natural' ? 'rgba(254, 240, 138, 0.35)' : 
                        'rgba(186, 230, 253, 0.35)'
                      }, transparent)`,
                    }}
                  />
                )}

                {/* نص توضيحي داخلي */}
                <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5">
                  <span className="text-[11px] font-bold text-blue-200">
                    {!simSpot && !simLed ? 'الإنارة مطفأة 🌑' : `حرارة اللون: ${
                      simColor === 'warm' ? 'أصفر دافئ (3000K)' : 
                      simColor === 'natural' ? 'شمسي طبيعي (4000K)' : 
                      'أبيض بارد (6000K)'
                    }`}
                  </span>
                </div>
              </div>

              {/* أزرار التحكم - لوحة التحكم الجانبية */}
              <div className="w-full lg:w-[62%] flex flex-col justify-center space-y-6">
                
                {/* 1. اختيار حرارة ولون الضوء */}
                <div>
                  <h4 className="text-base font-bold text-slate-300 mb-3 font-sans">1. اختر حرارة لون الإضاءة:</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'warm', name: 'أصفر 3000K', bg: 'bg-[#eab308]/20 border-[#eab308]/40 text-[#fde047]' },
                      { key: 'natural', name: 'شمسي 4000K', bg: 'bg-[#fef08a]/10 border-[#fef08a]/30 text-[#fef08a]' },
                      { key: 'cool', name: 'أبيض 6000K', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setSimColor(btn.key as any)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
                          simColor === btn.key 
                            ? `${btn.bg} ring-2 ring-blue-500/50 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.15)]` 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {btn.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. تشغيل مصادر الإضاءة المختلفة */}
                <div>
                  <h4 className="text-base font-bold text-slate-300 mb-3 font-sans">2. مصادر الإضاءة المتوفرة:</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* زر السبوت لايت */}
                    <button
                      onClick={() => setSimSpot(!simSpot)}
                      className={`flex-1 py-4 px-5 rounded-2xl border font-bold flex items-center justify-between transition-all duration-300 ${
                        simSpot
                          ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm">السبوت لايت (Spotlight)</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${simSpot ? 'bg-blue-500 border-blue-400 animate-pulse' : 'border-slate-500'}`} />
                    </button>
                    
                    {/* زر الإنارة المخفية */}
                    <button
                      onClick={() => setSimLed(!simLed)}
                      className={`flex-1 py-4 px-5 rounded-2xl border font-bold flex items-center justify-between transition-all duration-300 ${
                        simLed
                          ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm">الإنارة المخفية (LED Strip)</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${simLed ? 'bg-blue-500 border-blue-400 animate-pulse' : 'border-slate-500'}`} />
                    </button>
                  </div>
                </div>

                {/* نصيحة الخبراء الهندسية */}
                <div className="bg-[#0a192f] border border-blue-500/15 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-slate-300">
                  <div className="text-xl">💡</div>
                  <div>
                    <span className="font-bold text-blue-300 block mb-0.5">نصيحة مهندسي الإنارة الحديثة:</span>
                    {simColor === 'warm' && 'الإنارة الصفراء (3000K) تضفي حميمية ودفئاً، وهي مثالية لغرف النوم والمجالس لتعزز الشعور بالاسترخاء.'}
                    {simColor === 'natural' && 'الإنارة الشمسية (4000K) هي الأقرب لضوء النهار، وهي مناسبة جداً للمطابخ، الممرات، والمنطقة التي تحتاج لألوان حقيقية.'}
                    {simColor === 'cool' && 'الإنارة البيضاء (6000K) تمنح نشاطاً ووضوحاً عالياً، وهي خيار رائع للمكاتب، أماكن القراءة والدراسة.'}
                  </div>
                </div>

              </div>

            </div>



          </div>
        </section>

        {/* دليل تطابق طلاء الجدران والإضاءة */}
        <section id="paint-matching" className="py-16 md:py-20 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          {/* بقعة توهج نيونية خفيفة */}
          <div className="hidden md:block absolute top-1/2 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight font-sans text-white">
                دليل تطابق <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">الطلاء والإضاءة</span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                اكتشف كيف يتأثر لون طلاء جدران بيتك بحرارة لون الإضاءة المختلفة لتتجنب الأخطاء الشائعة في التصميم الداخلي
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-4">
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              </div>
            </div>

            <motion.div 
              initial={{ borderColor: "rgba(255,255,255,0.05)", boxShadow: "none" }}
              whileInView={{ 
                borderColor: "rgba(59,130,246,0.2)", 
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.12)" 
              }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-[#0f213a] border p-6 md:p-8 rounded-[2.5rem] relative"
            >
              {/* شاشة العرض - زاوية ثلاثية الأبعاد 3D Room Corner */}
              <div className="w-full lg:w-[38%] max-w-[360px] flex flex-col gap-4">
                <div className="w-full aspect-[4/3] rounded-2xl relative overflow-hidden bg-[#080d1a] shadow-2xl border border-white/10 transition-all duration-500">
                  {/* Left Wall */}
                  <div 
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      backgroundColor: (paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).hex,
                      clipPath: 'polygon(0% 5%, 50% 18%, 50% 80%, 0% 68%)',
                    }}
                  >
                    {/* Wall Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/25 pointer-events-none" />
                    {/* Direct Spotlight reflection */}
                    <div 
                      className="absolute inset-0 pointer-events-none transition-all duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 12%, ${
                          paintColorTemp === 'warm' ? 'rgba(251, 191, 36, 0.45)' : 
                          paintColorTemp === 'natural' ? 'rgba(254, 240, 138, 0.35)' : 
                          'rgba(186, 230, 253, 0.35)'
                        } 0%, transparent 70%)`,
                        opacity: paintFlicker ? 0.15 : 1,
                      }}
                    />
                  </div>

                  {/* Right Wall */}
                  <div 
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      backgroundColor: (paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).hex,
                      clipPath: 'polygon(50% 18%, 100% 5%, 100% 68%, 50% 80%)',
                    }}
                  >
                    {/* Shaded wall overlay */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/15 to-black/35 pointer-events-none" />
                    {/* Direct Spotlight reflection */}
                    <div 
                      className="absolute inset-0 pointer-events-none transition-all duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 12%, ${
                          paintColorTemp === 'warm' ? 'rgba(251, 191, 36, 0.45)' : 
                          paintColorTemp === 'natural' ? 'rgba(254, 240, 138, 0.35)' : 
                          'rgba(186, 230, 253, 0.35)'
                        } 0%, transparent 70%)`,
                        opacity: paintFlicker ? 0.15 : 1,
                      }}
                    />
                  </div>

                  {/* Center Seam Shadow */}
                  <div className="absolute top-[18%] bottom-[20%] left-1/2 w-[1px] -translate-x-1/2 pointer-events-none z-10 bg-black/20" />

                  {/* Floor */}
                  <div 
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, #111522 0%, #1d2232 100%)',
                      clipPath: 'polygon(0% 68%, 50% 80%, 100% 68%, 50% 100%)',
                    }}
                  >
                    {/* Subtle floor plank pattern lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_100%] opacity-20 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
                    
                    {/* Spotlight floor reflection */}
                    <div 
                      className="absolute inset-0 pointer-events-none transition-all duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 80%, ${
                          paintColorTemp === 'warm' ? 'rgba(251, 191, 36, 0.4)' : 
                          paintColorTemp === 'natural' ? 'rgba(254, 240, 138, 0.3)' : 
                          'rgba(186, 230, 253, 0.3)'
                        } 0%, transparent 65%)`,
                        opacity: paintFlicker ? 0.15 : 1,
                      }}
                    />
                  </div>

                  {/* Spotlight Cone */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-10 transition-all duration-500"
                    style={{
                      clipPath: 'polygon(50% 12%, 0% 100%, 100% 100%)',
                      background: `linear-gradient(to bottom, ${
                        paintColorTemp === 'warm' ? 'rgba(251, 191, 36, 0.28)' : 
                        paintColorTemp === 'natural' ? 'rgba(254, 240, 138, 0.18)' : 
                        'rgba(186, 230, 253, 0.18)'
                      }, transparent 85%)`,
                      opacity: paintFlicker ? 0.1 : 0.85,
                    }}
                  />

                  {/* Spotlight Physical Fixture */}
                  <div className="absolute top-[3%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                    <div className="w-10 h-2 bg-slate-800 rounded-full border border-slate-700/50 shadow-inner" />
                    <div className="w-1.5 h-3 bg-gradient-to-r from-slate-600 to-slate-500" />
                    <div className="w-7 h-7 bg-slate-900 border border-slate-700 rounded-t-sm rounded-b-md flex items-center justify-center shadow-lg relative">
                      <div className={`w-5 h-2 rounded-full blur-[1px] transition-all duration-300 ${
                        paintColorTemp === 'warm' ? 'bg-amber-300 shadow-[0_0_12px_#f59e0b]' :
                        paintColorTemp === 'natural' ? 'bg-yellow-100 shadow-[0_0_12px_#fef08a]' :
                        'bg-sky-200 shadow-[0_0_12px_#38bdf8]'
                      }`} />
                    </div>
                  </div>

                  {/* 3D Indicator Badge */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/5 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] text-white/60 font-bold font-sans">عرض ثلاثي الأبعاد 3D</span>
                  </div>

                  {/* Shake Toggle Permission Button on Mobile */}
                  <button 
                    onClick={async () => {
                      const granted = await requestPermission();
                      if (granted) {
                        alert("تم تفعيل ميزة هز الهاتف لتغيير الإضاءة! جرب هز هاتفك الآن. 📱");
                      } else {
                        alert("لم نتمكن من تفعيل مستشعرات الحركة بجهازك أو تصفحك عبر جهاز لا يدعمها.");
                      }
                    }}
                    className="absolute bottom-4 right-4 z-20 flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600/80 hover:bg-blue-600 border border-blue-500 text-[9px] text-white font-bold transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)] active:scale-95 cursor-pointer"
                  >
                    <span>تفعيل هز الهاتف 📱</span>
                  </button>
                </div>

                {/* مؤشر اللون الحالي */}
                <div className="flex items-center justify-between bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/5 text-xs text-slate-300">
                  <span>الطلاء: <strong className="text-white">{(paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).name}</strong></span>
                  <span>الضوء: <strong className="text-blue-300">
                    {paintColorTemp === 'warm' ? 'أصفر (3000K)' : paintColorTemp === 'natural' ? 'شمسي (4000K)' : 'أبيض (6000K)'}
                  </strong></span>
                </div>
              </div>

              {/* أزرار التحكم والخيارات */}
              <div className="w-full lg:w-[62%] flex flex-col justify-center space-y-6">
                
                {/* 1. اختيار لون صبغ الجدار */}
                <div>
                  <h4 className="text-base font-bold text-slate-300 mb-3 font-sans">1. اختر لون طلاء الجدار:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {paintColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedPaintId(color.id)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-300 flex flex-col items-center gap-2 ${
                          selectedPaintId === color.id
                            ? 'bg-blue-600/10 border-blue-500 text-white ring-2 ring-blue-500/30'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full border border-white/20 shadow-inner" 
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. اختيار لون الإضاءة */}
                <div>
                  <h4 className="text-base font-bold text-slate-300 mb-3 font-sans">2. اختر حرارة لون الإضاءة:</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'warm', name: 'أصفر 3000K', bg: 'bg-[#eab308]/20 border-[#eab308]/40 text-[#fde047]' },
                      { key: 'natural', name: 'شمسي 4000K', bg: 'bg-[#fef08a]/10 border-[#fef08a]/30 text-[#fef08a]' },
                      { key: 'cool', name: 'أبيض 6000K', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setPaintColorTemp(btn.key as any)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
                          paintColorTemp === btn.key
                            ? `${btn.bg} ring-2 ring-blue-500/50 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.15)]`
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {btn.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* النصيحة الهندسية الذكية */}
                <div className="bg-[#0a192f] border border-blue-500/15 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-slate-300">
                  <div className="text-xl">📐</div>
                  <div>
                    <span className="font-bold text-blue-300 block mb-1">رأي مهندس الديكور والتصميم الداخلي:</span>
                    {(paintColors.find(p => p.id === selectedPaintId) || paintColors[0]).advice[paintColorTemp]}
                  </div>
                </div>

              </div>

            </motion.div>

          </div>
        </section>

        {/* 3. جزء من مشاريعنا */}
        <section id="featured-projects" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          {/* بقع توهج نيونية خفيفة عائمة */}
          <div className="hidden md:block absolute top-1/3 right-0 w-80 h-80 bg-blue-50/5 rounded-full blur-[150px] pointer-events-none z-0 animate-float-2" />
          <div className="hidden md:block absolute bottom-1/3 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-[150px] pointer-events-none z-0 animate-float-1" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">
                  جزء من <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">مشاريعنا</span>
                </h2>
                <div className="w-20 h-[3px] bg-gradient-to-l from-blue-500 to-indigo-500 rounded-full mt-3 shadow-[0_1px_5px_rgba(59,130,246,0.3)]" />
              </div>
              <Link to="/projects" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                شاهد كل المشاريع <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>

            {loadingProjects ? (
               <div className="flex flex-col items-center justify-center py-20">
                 <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                 <p className="text-blue-200 mt-4">جاري جلب المشاريع...</p>
               </div>
            ) : (
              <>
                {/* Mobile Swipeable Stack */}
                <div className="flex md:hidden relative w-full h-[460px] items-center justify-center overflow-hidden">
                  
                  {/* Left bouncing hint arrow */}
                  <div className="absolute left-2 z-10 p-1.5 rounded-full bg-[#0a192f]/60 border border-white/5 text-blue-400 animate-pulse pointer-events-none">
                    <ChevronLeft className="w-5 h-5" />
                  </div>

                  <div className="relative w-full max-w-[290px] h-[390px]">
                    <AnimatePresence>
                      {featuredProjects.slice(stackIdx, stackIdx + 3).map((project, index) => {
                        const isTop = index === 0
                        
                        return (
                          <motion.div
                            key={project.id}
                            style={{
                              zIndex: 30 - index,
                              scale: 1 - index * 0.05,
                              y: index * 14,
                            }}
                            drag={isTop ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(_, info) => {
                              if (isTop) {
                                if (info.offset.x > 80 || info.offset.x < -80) {
                                  // Move to next card
                                  setStackIdx((prev) => (prev + 1) % featuredProjects.length)
                                }
                              }
                            }}
                            className="absolute inset-0 bg-[#0f213a] border border-white/10 rounded-[2.5rem] p-4 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
                            exit={{ x: 260, opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
                          >
                            <div className="relative h-[180px] w-full rounded-2xl overflow-hidden bg-[#0a192f] pointer-events-none">
                              <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-80" />
                              <div className="absolute top-3 right-3">
                                <span className="px-3 py-1 bg-[#0a192f]/95 border border-blue-500/30 text-blue-300 text-[10px] font-bold rounded-full">
                                  {project.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex-grow pt-4 flex flex-col justify-between pointer-events-none">
                              <div>
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{project.name}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{project.description}</p>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-blue-400 font-bold border-t border-white/5 pt-2">
                                <span>انقر للتفاصيل 🔍</span>
                                <span className="text-blue-300 animate-pulse flex items-center gap-0.5">اسحب للتنقل ↔</span>
                              </div>
                            </div>
                            
                            {/* Overlay trigger click to open gallery */}
                            {isTop && (
                              <div 
                                onClick={() => openGallery(project)}
                                className="absolute inset-0 z-20 cursor-pointer"
                              />
                            )}
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Right bouncing hint arrow */}
                  <div className="absolute right-2 z-10 p-1.5 rounded-full bg-[#0a192f]/60 border border-white/5 text-blue-400 animate-pulse pointer-events-none">
                    <ChevronRight className="w-5 h-5" />
                  </div>

                  {/* Stack guide indicator dot swipe help */}
                  <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
                    {featuredProjects.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          (stackIdx % featuredProjects.length) === idx ? 'w-4 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {featuredProjects.map((project) => (
                    <motion.div 
                      key={project.id} 
                      onClick={() => openGallery(project)}
                      whileHover={{ y: -6, scale: 1.01 }}
                      className="group relative bg-[#0f213a] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-blue-500/50 hover:shadow-[0_10px_35px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#0a192f] border-b border-white/5">
                        <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/95 via-[#0a192f]/40 to-transparent opacity-95 z-10" />
                        
                        <div className="absolute top-3 right-3 z-20">
                          <span className="px-3.5 py-1 bg-[#0a192f]/90 border border-blue-500/30 text-blue-300 text-[10px] font-bold rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                            {project.category}
                          </span>
                        </div>
                        
                        {project.video && (
                          <div className="absolute top-3 left-3 z-20 bg-[#0a192f]/90 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                            <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-white text-[10px] font-bold">فيديو</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 relative z-20 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors mb-2 line-clamp-1">{project.name}</h3>
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">{project.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-[11px] text-blue-400 font-bold border-t border-white/5 pt-3">
                          <span>عرض تفاصيل المعرض ←</span>
                          {project.image.includes(',') && (
                            <span className="px-2 py-0.5 bg-blue-500/10 rounded-md">
                              +{project.image.split(',').length - 1} صور
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* 4. نشرة الأسلاك الإيطالية */}
        <section id="wire-prices" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-full mb-4"><Zap className="w-6 h-6 text-yellow-400" /></div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-white">
                نشرة الأسلاك <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">الإيطالية</span>
              </h2>
              <div className="flex items-center justify-center gap-1.5 mt-4 mb-6">
                <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              </div>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-200 font-bold text-sm">
                <Calendar className="w-4 h-4" /> تحديث اليوم: {currentDate}
              </div>
            </div>

            <motion.div
              initial={{ borderColor: 'rgba(255, 255, 255, 0.05)', boxShadow: '0 0 0px rgba(59, 130, 246, 0)' }}
              whileInView={{
                borderColor: 'rgba(59, 130, 246, 0.3)',
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)',
              }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="bg-[#0f213a] border rounded-[2rem] overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
              <div className="bg-white/5 p-5 border-b border-white/5 flex items-center justify-between relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-400" /> الأسعار التقريبية المعتمدة</h3>
              </div>
              <div className="divide-y divide-white/5 relative z-10">
                {wirePrices.map((wire, idx) => (
                  <div key={wire.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] border-r-2 border-transparent hover:border-blue-500 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0a192f] border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">{idx + 1}</div>
                      <div><h4 className="text-lg font-bold text-white mb-0.5">{wire.size}</h4><p className="text-xs text-slate-400">{wire.type}</p></div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                      <div className="text-right"><div className="text-xl font-extrabold text-blue-300">{wire.price} <span className="text-xs font-normal text-slate-400">د.ل</span></div></div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${wire.trend === 'up' ? 'bg-green-500/10 border-green-500/30 text-green-400' : wire.trend === 'down' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-500/10 border-slate-500/30 text-slate-400'}`}>
                          {wire.trend === 'up' && <TrendingUp className="w-4 h-4" />}{wire.trend === 'down' && <TrendingDown className="w-4 h-4" />}{wire.trend === 'same' && <Minus className="w-4 h-4" />}
                        </div>
                        <button onClick={() => setSelectedWire(wire)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:bg-blue-500 transition-all hover:scale-[1.03] active:scale-[0.97]"><ShoppingCart className="w-4 h-4" /> اطلب الآن</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. ابدأ مشروعك */}
        <section id="start" className="py-16 md:py-24 relative overflow-hidden border-t border-white/[0.05] bg-transparent">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ scale: 0.98, borderColor: 'rgba(59, 130, 246, 0.2)', boxShadow: '0 0 0px rgba(59, 130, 246, 0)' }}
              whileInView={{
                scale: 1,
                borderColor: 'rgba(59, 130, 246, 0.45)',
                boxShadow: '0 0 35px rgba(59, 130, 246, 0.2)',
              }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8 }}
              className="relative bg-[#0f213a] border rounded-[2rem] p-8 md:p-16 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none animate-pulse [animation-duration:8s]" />
              <h2 className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6" style={glowingTitleStyle}>ابدأ مشروعك معنا <span className="text-blue-300">اليوم</span></h2>
              <p className="relative z-10 text-blue-100/80 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                نحن هنا لنساعدك في تحويل رؤيتك إلى واقع مبهر. تواصل مع خبرائنا للحصول على استشارة هندسية وفنية لمشروعك، أو لطلب فواتير المواد وعروض الأسعار المتكاملة لمشروعك الكهربائي.
              </p>
              <Link to="/contact" className="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-extrabold text-lg rounded-2xl hover:bg-slate-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"><Zap className="w-6 h-6" /> تواصل معنا الآن</Link>
            </motion.div>
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
                  {orderStatus === 'loading' || orderStatus === 'success' ? (
                    <div className="text-center py-10 px-4 flex flex-col items-center justify-center relative min-h-[360px]">
                      {/* بقعة وهج خلفية خفيفة */}
                      <div className="absolute w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] -z-10 pointer-events-none animate-pulse" />
                      
                      {orderStatus === 'loading' ? (
                        <div className="flex flex-col items-center justify-center space-y-6">
                          {/* حلقات التوجيه الإلكتروني */}
                          <div className="relative w-24 h-24 flex items-center justify-center">
                            <span className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30 animate-spin [animation-duration:15s]" />
                            <span className="absolute inset-2.5 rounded-full border border-blue-400/40 animate-pulse" />
                            <span className="absolute inset-5 rounded-full bg-blue-600/10 border border-blue-500/20" />
                            <Loader2 className="w-9 h-9 text-blue-400 animate-spin relative z-10" />
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2 animate-pulse font-sans">تجهيز طلبك الرقمي</h3>
                            <p className="text-blue-300 text-sm max-w-xs mx-auto leading-relaxed">
                              نقوم بإنشاء اتصال آمن ونقل بياناتك إلى سجل المبيعات والواتساب...
                            </p>
                          </div>

                          {/* خط تقدم مستمر */}
                          <div className="w-full max-w-[200px] h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                            <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full animate-[loadingBar_1.8s_ease-out_infinite]" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-6">
                          {/* دائرة النجاح المنبثقة مع الجزيئات المتطايرة */}
                          <div className="relative w-24 h-24 flex items-center justify-center">
                            {/* موجات نجاح نابضة */}
                            <div className="absolute inset-0 rounded-full bg-green-500/10 border border-green-500/30 animate-ping [animation-duration:1.5s]" />
                            <div className="absolute inset-2.5 rounded-full bg-green-600/20 border border-green-400/20" />
                            
                            {/* زر النجاح ثلاثي الأبعاد المضيء */}
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.4)] relative z-10 scale-100 animate-[bounceIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                              <CheckCircle className="w-9 h-9 text-white" />
                            </div>

                            {/* جزيئات نيون تتلاشى للخارج */}
                            <span className="absolute w-2.5 h-2.5 rounded-full bg-green-400 animate-[particleTop_1.2s_ease-out_infinite] top-0 left-1/2" />
                            <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-[particleBottom_1.2s_ease-out_infinite] bottom-0 left-1/2" />
                            <span className="absolute w-2 h-2 rounded-full bg-green-300 animate-[particleLeft_1.2s_ease-out_infinite] left-0 top-1/2" />
                            <span className="absolute w-2 h-2 rounded-full bg-emerald-300 animate-[particleRight_1.2s_ease-out_infinite] right-0 top-1/2" />
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">تم تسجيل طلبك بنجاح!</h3>
                            <p className="text-emerald-200 text-sm max-w-xs mx-auto leading-relaxed">
                              تم التوثيق الرقمي. جاري تحويلك الآن للواتساب للتأكيد الفوري والمتابعة...
                            </p>
                          </div>

                          {/* خط تعبئة تقدم توجيه الواتساب */}
                          <div className="w-full max-w-[220px] h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full animate-[successProgress_2.5s_ease-in-out_forwards]" />
                          </div>
                        </div>
                      )}
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

        {/* معرض الصور المنبثق التفاعلي للمشاريع (Lightbox Gallery) */}
        <AnimatePresence>
          {selectedProject && (() => {
            const imageUrls = selectedProject.image
              .split(',')
              .map((url) => url.trim())
              .filter(Boolean)

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-md overflow-y-auto"
              >
                <div className="absolute inset-0 z-0" onClick={() => setSelectedProject(null)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative z-10 w-full max-w-5xl bg-[#0d2342]/95 border border-blue-500/25 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] lg:max-h-[85vh]"
                >
                  {/* زر الإغلاق */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-5 left-5 z-30 p-2.5 bg-white/5 hover:bg-red-500/80 border border-white/10 hover:border-red-500 text-white rounded-full transition-all duration-300 active:scale-95 shadow-md"
                    aria-label="إغلاق المعرض"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* الجانب الأيمن (معرض الصور) */}
                  <div className="w-full lg:w-2/3 p-5 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-white/5 bg-black/25">
                    <div className="relative aspect-[4/3] w-full max-h-[45vh] lg:max-h-[50vh] rounded-[1.8rem] overflow-hidden bg-[#0a192f] flex items-center justify-center shadow-inner group/viewer">
                      <motion.img
                        key={activeImageIndex}
                        src={imageUrls[activeImageIndex] || '/images/default-product.jpg'}
                        alt={`${selectedProject.name} image`}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }}
                      />
                      
                      {/* أزرار التنقل */}
                      {imageUrls.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handlePrevImage(imageUrls.length); }}
                            className="absolute right-4 p-3 bg-black/40 hover:bg-blue-600/80 border border-white/5 text-white rounded-2xl transition-all duration-300 active:scale-90 shadow-md backdrop-blur-sm"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleNextImage(imageUrls.length); }}
                            className="absolute left-4 p-3 bg-black/40 hover:bg-blue-600/80 border border-white/5 text-white rounded-2xl transition-all duration-300 active:scale-90 shadow-md backdrop-blur-sm"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* الصور المصغرة */}
                    {imageUrls.length > 1 && (
                      <div className="flex items-center gap-3 overflow-x-auto py-3 px-1 mt-4 scrollbar-thin scrollbar-thumb-white/10 justify-center">
                        {imageUrls.map((url, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                              idx === activeImageIndex
                                ? 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] scale-105'
                                : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                            }`}
                          >
                            <img src={url} alt="thumbnail" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* الجانب الأيسر (تفاصيل المشروع) */}
                  <div className="w-full lg:w-1/3 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-6">
                      <div>
                        <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.1)] inline-block mb-3">
                          {selectedProject.category}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{selectedProject.name}</h2>
                      </div>

                      <div className="h-px bg-white/5 w-full" />

                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-400 font-sans">عن المشروع:</h4>
                        <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap font-medium">{selectedProject.description}</p>
                      </div>
                    </div>

                    <div className="pt-8 space-y-3">
                      {selectedProject.video && (
                        <a
                          href={selectedProject.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-98"
                        >
                          <PlayCircle className="w-5.5 h-5.5" />
                          شاهد فيديو المشروع
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })()}
        </AnimatePresence>

        {/* 🚀 الأيقونات الاجتماعية العائمة */}
        <div className="fixed left-6 bottom-24 z-40 hidden md:flex flex-col gap-3 animate-fade-in">
          <a 
            href="https://www.facebook.com/share/1BxjvUxxvG/?mibextid=wwXIfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl bg-[#0f213a]/90 backdrop-blur-md border border-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            title="تابعنا على فيسبوك"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a 
            href="https://www.instagram.com/enara_hadetha?igsh=MXVqaGlqdHN5cnM5OQ==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl bg-[#0f213a]/90 backdrop-blur-md border border-blue-500/20 text-pink-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(236,72,153,0.1)] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            title="تابعنا على إنستغرام"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a 
            href="https://www.tiktok.com/@modernenara?_r=1&_t=ZS-96dCObkuFUK" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl bg-[#0f213a]/90 backdrop-blur-md border border-blue-500/20 text-slate-300 hover:text-white hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            title="تابعنا على تيك توك"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2.01 3.7 2.37v3.83c-1.39-.09-2.74-.61-3.87-1.48a7.25 7.25 0 0 1-2.47-3.08v8.66c0 1.25-.26 2.5-.77 3.66a7.56 7.56 0 0 1-4.8 4.41c-1.25.38-2.57.44-3.85.17a7.66 7.66 0 0 1-5.18-4.47 7.7 7.7 0 0 1 .15-5.06c.55-1.42 1.56-2.65 2.87-3.48a7.84 7.84 0 0 1 7.21-.57v4.02a3.79 3.79 0 0 0-2.31 1.09 3.73 3.73 0 0 0-1.12 2.3c-.09.78.11 1.57.55 2.2a3.78 3.78 0 0 0 4.14 1.48c.88-.23 1.66-.78 2.2-1.52.54-.75.82-1.65.79-2.57V.02z"/>
            </svg>
          </a>
        </div>

      </div>
    </>
  )
}
