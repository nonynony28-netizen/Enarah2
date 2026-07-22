import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayCircle, PackageSearch, Loader2, Image as ImageIcon, ArrowRight, ShoppingCart, Check, Zap, Shield, Award, Sparkles, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useCart } from '../hooks/useCart'

const glowingTitleStyle = {
  textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
}

const productTranslations: Record<string, { name: string; description: string }> = {
  "سبوت لايت": {
    name: "Spotlights",
    description: "Various types of spotlights, including LED, single, anti-glare, and adjustable styles designed for all spaces and activities."
  },
  "مفاتيح وبرايز": {
    name: "Switches & Sockets",
    description: "A wide selection of modern switches and sockets from various global brands to suit every corner and style of your home."
  },
  "مواد تأسيس الكهربائي": {
    name: "Electrical Installation Materials",
    description: "All electric installation components from early wiring foundations to final premium finishes with certified high quality."
  },
  "ثريات": {
    name: "Chandeliers",
    description: "A premium range of crystal and modern decorative chandeliers, carefully chosen to suit all modern and classic tastes."
  },
  "الأسلاك والكوابل": {
    name: "Wires & Cables",
    description: "Certified Italian wires directly from original manufacturers, guaranteeing top quality and safety in all standard gauges."
  },
  "سكة الليد": {
    name: "LED Track Lights",
    description: "Flexible, magnetic, surface-mounted, and recessed LED track systems designed to adapt to all architectural needs."
  },
  "انترفون": {
    name: "Intercom Systems",
    description: "All types of wired and wireless video intercom systems from top global manufacturers, ensuring durability and home security."
  }
};

const defaultFallbackProducts: ProductItem[] = [
  {
    id: 'wire-italy-25',
    name: 'سلك كهربائي إيطالي معتمد 2.5 مم',
    description: 'أسلاك إيطالية معتمدة وموصلات نحاسية فائقة النقاء عازلة للحرارة والكهرباء 100%.',
    image: '/images/default-product.jpg',
    price: 185,
    discountPrice: 165,
    stockStatus: 'available',
    stockQty: 100,
    category: 'الأسلاك والكوابل'
  },
  {
    id: 'spot-antiglare-7w',
    name: 'سبوت لايت 7 واط ضد التوهج Anti-Glare',
    description: 'سبوت لايت معتمد بزاوية إضاءة مريحة للعين وإطار غاطس فاخر لمختلف الغرف.',
    image: '/images/default-product.jpg',
    price: 35,
    discountPrice: 28,
    stockStatus: 'available',
    stockQty: 85,
    category: 'سبوت لايت'
  },
  {
    id: 'switch-touch-gold',
    name: 'مفتاح كهربائي ذكي مودرن',
    description: 'مفاتيح ومآخذ كهربائية عصرية وتصاميم فخمة مقاومة للخدش والحرارة.',
    image: '/images/default-product.jpg',
    price: 65,
    discountPrice: 55,
    stockStatus: 'available',
    stockQty: 60,
    category: 'مفاتيح وبرايز'
  },
  {
    id: 'chandelier-crystal-modern',
    name: 'ثريا كريستال فاخرة مودرن',
    description: 'ثريات كريستال وتصاميم مودرن كلاسيكية منتقاة بعناية لتعطي انطباعاً مبهراً.',
    image: '/images/default-product.jpg',
    price: 450,
    discountPrice: 390,
    stockStatus: 'available',
    stockQty: 25,
    category: 'ثريات'
  },
  {
    id: 'led-track-magnetic-2m',
    name: 'سكة ليد مغناطيسية غاطسة 2 متر',
    description: 'أنظمة سكة ليد مرنة غاطسة وظاهرة تتيح لك إعادة توزيع الضوء بسهولة.',
    image: '/images/default-product.jpg',
    price: 140,
    discountPrice: 120,
    stockStatus: 'available',
    stockQty: 40,
    category: 'سكة الليد'
  },
  {
    id: 'intercom-hd-video',
    name: 'انترفون مرئي ذكي شاشة HD',
    description: 'أنظمة انترفون مرئية سلكية ولاسلكية من أفضل الماركات العالمية لحماية المبنى.',
    image: '/images/default-product.jpg',
    price: 380,
    discountPrice: 320,
    stockStatus: 'available',
    stockQty: 30,
    category: 'انترفون'
  },
  {
    id: 'junction-box-foundation',
    name: 'علب وقسامات تأسيس كهرباء معتمدة',
    description: 'مستلزمات التأسيس الأولي من علب غاطسة، قسامات، وكابلات رئيسية للمشاريع.',
    image: '/images/default-product.jpg',
    price: 25,
    discountPrice: 20,
    stockStatus: 'available',
    stockQty: 200,
    category: 'مواد تأسيس الكهربائي'
  }
]

export default function Products() {
  const { isAr } = useLanguage()
  const { addToCart, triggerFlyAnimation } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState<ProductItem[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enarah_cached_products')
      if (cached) {
        try { 
          const parsed = JSON.parse(cached) 
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        } catch {}
      }
    }
    return defaultFallbackProducts
  })
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)

  const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
    triggerFlyAnimation(e.clientX, e.clientY)
    setAddingId(product.id)
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.discountPrice && product.price && product.discountPrice < product.price ? product.discountPrice : product.price,
      discountPrice: product.discountPrice,
      stockStatus: product.stockStatus,
      stockQty: product.stockQty
    })
    setTimeout(() => {
      setAddingId(null)
    }, 1200)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        const data = await res.json()

        if (res.ok && data.success && Array.isArray(data.data)) {
          const formattedProducts: ProductItem[] = data.data
            .filter((item: any) => item.type !== 'contact')
            .filter((item: any) => {
                const itemName = String(item.name || '').toLowerCase().trim()
                const itemEmail = String(item.email || '').toLowerCase().trim()

                if (itemName.includes('visitor') || itemEmail.includes('visitor') || itemEmail.includes('visit_') || itemEmail.includes('analytics.local')) {
                  return false;
                }
                if (itemEmail.includes('admin_wire_prices')) return false;

                try {
                  const phoneData = item.phone ? JSON.parse(item.phone) : {}
                  if (phoneData.type === 'project') return false;
                } catch {}
                
                return true;
             })
            .map((item: any, index: number) => {
                let mediaData: any = {}
                try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}

                let descText = mediaData.description || (item.email && !item.email.includes('@upload.local') ? item.email : '')
                try {
                  const descObj = JSON.parse(descText)
                  descText = isAr ? (descObj.ar || descObj.en || descText) : (descObj.en || descObj.ar || descText)
                } catch {}

                let nameText = item.name || 'بدون اسم'
                try {
                  const nameObj = JSON.parse(nameText)
                  nameText = isAr ? (nameObj.ar || nameObj.en || nameText) : (nameObj.en || nameObj.ar || nameText)
                } catch {}

                return {
                  id: item._id || String(index),
                  name: nameText,
                  description: descText,
                  image: mediaData.imageUrl || '/images/default-product.jpg',
                  video: mediaData.videoUrl || '',
                  price: mediaData.price,
                  discountPrice: mediaData.discountPrice,
                  stockStatus: mediaData.stockStatus || 'available',
                  stockQty: mediaData.stockQty,
                  category: mediaData.category || item.category || 'عام'
                }
             })
           
           const loadedProducts = formattedProducts.reverse()
           if (loadedProducts.length > 0) {
             setProducts(loadedProducts)
             localStorage.setItem('enarah_cached_products', JSON.stringify(loadedProducts))
           }
         }
       } catch (error) {
         console.error('Fetch Products Error:', error)
       } finally {
         setLoading(false)
       }
     }

    fetchProducts()
  }, [isAr])

  const categoriesGrid = [
    {
      id: 'الأسلاك والكوابل',
      titleAr: 'الأسلاك والكوابل المعتمدة',
      titleEn: 'Certified Wires & Cables',
      descAr: 'أسلاك إيطالية معتمدة وموصلات فائقة النقاء عازلة للحرارة والكهرباء 100%.',
      descEn: 'Italian certified wires and ultra-pure copper conductors with thermal insulation.',
      badgeAr: 'مواصفات إيطالية 🇮🇹',
      badgeEn: 'Italian Specs 🇮🇹',
      icon: Zap,
      gradient: 'from-blue-600/30 via-indigo-950/70 to-[#0a192f]',
      border: 'border-blue-400/30 hover:border-blue-400/60',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.25)]',
      accentColor: 'text-blue-400',
      highlightsAr: ['نحاس نقي 100%', 'عزل حراري ممتاز', 'مقاسات معتمدة'],
      highlightsEn: ['100% Pure Copper', 'Thermal Insulation', 'Standard Gauges']
    },
    {
      id: 'سبوت لايت',
      titleAr: 'السبوت لايت والإنارة الغاطسة',
      titleEn: 'Spotlights & Recessed Lighting',
      descAr: 'تشكيلة سبوتات ضد التوهج Anti-Glare بإضاءات دافئة وطبيعية تناسب كافة المساحات.',
      descEn: 'Anti-Glare spotlights with warm and natural light options for modern spaces.',
      badgeAr: 'مانع للتوهج 💡',
      badgeEn: 'Anti-Glare 💡',
      icon: Lightbulb,
      gradient: 'from-cyan-600/30 via-sky-950/70 to-[#0a192f]',
      border: 'border-cyan-400/30 hover:border-cyan-400/60',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.25)]',
      accentColor: 'text-cyan-400',
      highlightsAr: ['مقاوم للتوهج', 'زوايا إضاءة متغيرة', 'عمر افتراضي طويل'],
      highlightsEn: ['Anti-Glare', 'Adjustable Angles', 'Long Lifespan']
    },
    {
      id: 'مفاتيح وبرايز',
      titleAr: 'المفاتيح والبرايز الحديثة',
      titleEn: 'Switches & Sockets',
      descAr: 'مفاتيح ومآخذ كهربائية عصرية وتصاميم فخمة مقاومة للخدش بأعلى أمان.',
      descEn: 'Luxury switches and sockets with scratch-resistant finishes and top safety.',
      badgeAr: 'تصاميم عصرية ⚡',
      badgeEn: 'Modern Switches ⚡',
      icon: Shield,
      gradient: 'from-purple-600/30 via-indigo-950/70 to-[#0a192f]',
      border: 'border-purple-400/30 hover:border-purple-400/60',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.25)]',
      accentColor: 'text-purple-400',
      highlightsAr: ['لمس وذكي Smart', 'مقاومة للحرارة', 'ضمان معتمد'],
      highlightsEn: ['Smart Touch', 'Heat Resistant', 'Certified Warranty']
    },
    {
      id: 'ثريات',
      titleAr: 'الثريات والإنارة الديكورية',
      titleEn: 'Chandeliers & Decorative Lighting',
      descAr: 'ثريات كريستال وتصاميم مودرن كلاسيكية منتقاة بعناية لتعطي انطباعاً مبهراً.',
      descEn: 'Crystal chandeliers and decorative modern classic lighting tailored to amaze.',
      badgeAr: 'كريستال وديكور 💎',
      badgeEn: 'Luxury Crystal 💎',
      icon: Sparkles,
      gradient: 'from-amber-600/30 via-yellow-950/70 to-[#0a192f]',
      border: 'border-amber-400/30 hover:border-amber-400/60',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
      accentColor: 'text-amber-400',
      highlightsAr: ['كريستال عالي النقاء', 'تحكم في شدة الضوء', 'تصاميم حصرية'],
      highlightsEn: ['High-Purity Crystal', 'Dimmable Controls', 'Exclusive Designs']
    },
    {
      id: 'سكة الليد',
      titleAr: 'أنظمة سكة الليد المغناطيسية',
      titleEn: 'Magnetic LED Track Lighting',
      descAr: 'أنظمة سكة ليد مرنة غاطسة وظاهرة تتيح لك إعادة توزيع الضوء بسهولة.',
      descEn: 'Flexible magnetic recessed and surface LED track lighting systems.',
      badgeAr: 'أنظمة غاطسة 🔦',
      badgeEn: 'Magnetic Tracks 🔦',
      icon: PackageSearch,
      gradient: 'from-emerald-600/30 via-teal-950/70 to-[#0a192f]',
      border: 'border-emerald-400/30 hover:border-emerald-400/60',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
      accentColor: 'text-emerald-400',
      highlightsAr: ['تركيب مغناطيسي مرن', 'إضاءات خطية وموجهة', 'تصميم معماري'],
      highlightsEn: ['Flexible Magnetic', 'Linear & Spot Light', 'Architectural']
    },
    {
      id: 'انترفون',
      titleAr: 'أنظمة الانترفون والحماية',
      titleEn: 'Video Intercom Systems',
      descAr: 'أنظمة انترفون مرئية سلكية ولاسلكية من أفضل الماركات العالمية لحماية المبنى.',
      descEn: 'Wired and wireless video intercom systems for ultimate home security.',
      badgeAr: 'حماية وأمان 🔔',
      badgeEn: 'Smart Security 🔔',
      icon: Award,
      gradient: 'from-rose-600/30 via-pink-950/70 to-[#0a192f]',
      border: 'border-rose-400/30 hover:border-rose-400/60',
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.25)]',
      accentColor: 'text-rose-400',
      highlightsAr: ['شاشات HD عالية الدقة', 'رؤية ليلية', 'اتصال لاسلكي'],
      highlightsEn: ['HD Screens', 'Night Vision', 'Wireless Connectivity']
    },
    {
      id: 'مواد تأسيس الكهربائي',
      titleAr: 'مواد التأسيس الكهربائي الشاملة',
      titleEn: 'Electrical Foundation Materials',
      descAr: 'مستلزمات التأسيس الأولي من علب غاطسة، قسامات، وكابلات رئيسية للمشاريع.',
      descEn: 'Complete electrical foundation supplies, junction boxes, and main cables.',
      badgeAr: 'تأسيس للمشاريع 📦',
      badgeEn: 'Project Supplies 📦',
      icon: PlayCircle,
      gradient: 'from-orange-600/30 via-amber-950/70 to-[#0a192f]',
      border: 'border-orange-400/30 hover:border-orange-400/60',
      glow: 'shadow-[0_0_30px_rgba(249,115,22,0.25)]',
      accentColor: 'text-orange-400',
      highlightsAr: ['علب وقسامات معتمدة', 'مقاومة للصدمات', 'توفير بالكميات'],
      highlightsEn: ['Junction Boxes', 'Impact Resistant', 'Bulk Discounts']
    }
  ]

  const displayedProducts = products.filter(p => {
    if (selectedCategory === 'all') return true
    const pCat = (p.category || '').trim()
    const pName = (p.name || '').trim()
    return pCat.includes(selectedCategory) || pName.includes(selectedCategory)
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#0f213a] border border-white/10 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-blue-400 font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
            {isAr ? (
              <>معرض <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.4)]">المنتجات</span></>
            ) : (
              <>Products <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.4)]">Gallery</span></>
            )}
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl shadow-sm">
            {isAr 
              ? 'اكتشف أحدث وأرقى منتجات الإنارة والتأسيس الكهربائي التي اخترناها بعناية لتناسب ذوقك واحتياجاتك'
              : 'Discover the latest and finest lighting and electrical installation products, carefully selected to fit your taste and needs'
            }
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
          </div>
        </motion.div>

        {/* شبكة الأقسام الرئيسية الفاخرة الموزعة (Custom Distributed Categories Bento Showcase Grid) */}
        {!loading && selectedCategory === 'all' && (
          <div className="mb-16 md:mb-20">
            <div className="text-center mb-8">
              <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs font-black shadow-sm">
                {isAr ? 'الأقسام والتصنيفات الرئيسية 📦' : 'Main Categories & Sections 📦'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categoriesGrid.map((cat, i) => {
                const CatIcon = cat.icon
                const catProductCount = products.filter(p => (p.category || '').includes(cat.id) || p.name.includes(cat.id)).length
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                    style={{ transform: 'translateZ(0)' }}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative p-7 sm:p-8 rounded-[2.2rem] bg-gradient-to-b ${cat.gradient} border ${cat.border} transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xl hover:${cat.glow} overflow-hidden`}
                  >
                    {/* شريط الوهج النيوني العلوي عند التمرير */}
                    <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div>
                      {/* رأس كرت القسم: الشارة والأيقونة والعدد */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 shadow-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                          <CatIcon className={`w-7 h-7 ${cat.accentColor} drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-300 shadow-sm">
                            {isAr ? cat.badgeAr : cat.badgeEn}
                          </span>
                          <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-slate-200">
                            {catProductCount} {isAr ? 'منتج' : 'items'}
                          </span>
                        </div>
                      </div>

                      {/* عنوان ووصف القسم */}
                      <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-300 transition-colors duration-300 mb-3 tracking-wide">
                        {isAr ? cat.titleAr : cat.titleEn}
                      </h3>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium mb-6">
                        {isAr ? cat.descAr : cat.descEn}
                      </p>

                      {/* نقاط تميز القسم */}
                      <div className="space-y-2 mb-8">
                        {(isAr ? cat.highlightsAr : cat.highlightsEn).map((hl, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_6px_#3b82f6]" />
                            <span className="text-xs text-slate-300 font-bold">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* زر الدخول للقسم */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                      <span className="text-xs font-black text-blue-300 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                        <span>{isAr ? 'استعرض منتجات القسم' : 'Browse Category Products'}</span>
                        <ArrowLeft className={`w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180'}`} />
                      </span>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* رأس القسم المحدد عند اختيار قسم معين (Selected Category Header) */}
        {!loading && selectedCategory !== 'all' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 p-6 rounded-2xl bg-[#0c1e38] border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black">
                {isAr ? 'القسم الحالي' : 'Active Category'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {selectedCategory}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-300">
                {displayedProducts.length} {isAr ? 'منتج' : 'items'}
              </span>
            </div>

            <button
              onClick={() => setSelectedCategory('all')}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white/10 hover:bg-blue-600 border border-white/15 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
            >
              <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
              <span>{isAr ? 'العودة لكافة الأقسام' : 'Show All Categories'}</span>
            </button>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <p className="text-blue-100 mt-6 font-medium text-lg animate-pulse">
              {isAr ? 'جاري جلب أحدث المنتجات والأقسام...' : 'Fetching products & categories...'}
            </p>
          </motion.div>
        )}

        {!loading && displayedProducts.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0f213a] border border-white/5 rounded-[2rem] p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <PackageSearch className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {isAr ? 'لا توجد منتجات في هذا القسم حالياً' : 'No products in this category yet'}
            </h3>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              {isAr
                ? 'نحن نقوم بتحديث المعرض وإضافة منتجات هذا القسم قريباً. يمكنك تصفح باقي الأقسام.'
                : 'We are currently adding products to this category. Please feel free to check other categories.'
              }
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all cursor-pointer"
            >
              {isAr ? 'عرض جميع المنتجات' : 'Show All Products'}
            </button>
          </motion.div>
        )}

        {!loading && displayedProducts.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {displayedProducts.map((product) => {
              // Translate on the fly
              let displayName = product.name;
              let displayDesc = product.description;

              if (!isAr) {
                // Find matching English translation
                const matchedTranslation = Object.entries(productTranslations).find(([key]) => {
                  return product.name.trim().includes(key) || key.includes(product.name.trim());
                });
                if (matchedTranslation) {
                  displayName = matchedTranslation[1].name;
                  displayDesc = matchedTranslation[1].description;
                }
              }

              return (
                <motion.div variants={itemVariants} key={product.id} style={{ willChange: "transform, opacity" }} className="group relative bg-[#0f213a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 shadow-xl flex flex-col h-full">
                  <div className="relative overflow-hidden aspect-[4/3] bg-[#0a192f] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f213a] via-transparent to-transparent opacity-80 z-10" />
                    <ImageIcon className="absolute w-12 h-12 text-white/5" />
                    <img src={product.image} alt={displayName} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0 relative" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                    
                    {/* شارة حالة التوفر والكمية */}
                    {product.stockStatus === 'out_of_stock' || (product.stockQty !== undefined && product.stockQty <= 0) ? (
                      <div className="absolute top-4 left-4 z-20 bg-red-950/80 border border-red-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        <span className="text-red-400 text-xs font-bold">
                          {isAr ? 'نفذت الكمية ❌' : 'Out of Stock ❌'}
                        </span>
                      </div>
                    ) : product.stockQty !== undefined && product.stockQty > 0 ? (
                      <div className="absolute top-4 left-4 z-20 bg-emerald-950/85 border border-emerald-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <span className="text-emerald-300 text-xs font-black">
                          {isAr ? `متوفر: ${product.stockQty} قطعة` : `Stock: ${product.stockQty} pcs`}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-4 left-4 z-20 bg-blue-950/80 border border-blue-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <span className="text-blue-300 text-xs font-bold">
                          {isAr ? 'متوفر ✅' : 'In Stock ✅'}
                        </span>
                      </div>
                    )}

                    {product.video && (
                      <div className="absolute top-4 right-4 z-20 bg-[#0a192f]/80 border border-blue-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <PlayCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200 text-xs font-bold">
                          {isAr ? 'فيديو متاح' : 'Video Available'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20">
                    <h2 className="text-white font-bold text-xl md:text-2xl mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">{displayName}</h2>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed flex-grow line-clamp-3 mb-6">
                      {displayDesc || (isAr ? 'لا يوجد وصف متاح لهذا المنتج حالياً.' : 'No description available for this product currently.')}
                    </p>

                    {/* عرض الأسعار والخصومات */}
                    <div className="mb-6 flex flex-wrap items-baseline gap-2">
                      {product.price ? (
                        product.discountPrice && product.discountPrice < product.price ? (
                          <>
                            <span className="text-2xl font-black text-emerald-400">
                              {product.discountPrice.toFixed(2)} <span className="text-xs font-normal text-slate-400">{isAr ? 'د.ل' : 'LYD'}</span>
                            </span>
                            <span className="text-sm line-through text-slate-500 ml-1">
                              {product.price.toFixed(2)} {isAr ? 'د.ل' : 'LYD'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 animate-pulse">
                              {isAr ? `وفر %${Math.round(((product.price - product.discountPrice) / product.price) * 100)}` : `Save ${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-black text-blue-400">
                            {product.price.toFixed(2)} <span className="text-xs font-normal text-slate-400">{isAr ? 'د.ل' : 'LYD'}</span>
                          </span>
                        )
                      ) : (
                        <span className="text-xs font-semibold text-slate-500 bg-white/5 border border-white/5 px-3 py-1 rounded-lg">
                          {isAr ? '🔍 السعر يحدد مع المبيعات' : '🔍 Price upon request'}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto space-y-3">
                      <button
                        onClick={(e) => handleAddToCart(e, { ...product, name: displayName, description: displayDesc })}
                        disabled={addingId === product.id || product.stockStatus === 'out_of_stock' || (product.stockQty !== undefined && product.stockQty <= 0)}
                        className={`w-full py-3.5 border transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 rounded-xl shadow-sm cursor-pointer ${
                          product.stockStatus === 'out_of_stock' || (product.stockQty !== undefined && product.stockQty <= 0)
                            ? 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed'
                            : addingId === product.id
                              ? 'bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                              : 'bg-blue-600/10 hover:bg-blue-600 border-blue-500/30 hover:border-blue-400 text-blue-400 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={(product.stockStatus === 'out_of_stock' || (product.stockQty !== undefined && product.stockQty <= 0)) ? 'out' : addingId === product.id ? 'added' : 'add'}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2"
                          >
                            {(product.stockStatus === 'out_of_stock' || (product.stockQty !== undefined && product.stockQty <= 0)) ? (
                              <span>{isAr ? 'نفذت الكمية من المخزن' : 'Out of Stock'}</span>
                            ) : addingId === product.id ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>{isAr ? 'تمت الإضافة بنجاح! ✓' : 'Added Successfully! ✓'}</span>
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

                      {product.video && (
                        <a href={product.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 text-slate-300 hover:bg-[#0f213a] rounded-xl transition-all duration-300 font-bold text-xs">
                          <PlayCircle className="w-4 h-4 text-blue-400" /> 
                          {isAr ? 'شاهد فيديو للمنتج' : 'Watch Product Video'}
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
