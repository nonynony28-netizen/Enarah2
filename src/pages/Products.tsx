import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayCircle, PackageSearch, Loader2, Image as ImageIcon, ArrowRight, ArrowLeft, ShoppingCart, Check } from 'lucide-react'
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

type ProductItem = {
  id: string
  name: string
  description: string
  image: string
  video?: string
  price?: number
  discountPrice?: number
  stockStatus?: string
  stockQty?: number
  category?: string
}

const defaultFallbackProducts: ProductItem[] = [
  // Categories (العناوين الرئيسية المأخوذة من قاعدة البيانات كقيمة افتراضية):
  {
    id: 'cat-wires',
    name: 'الأسلاك والكوابل',
    description: 'الأسلاك الايطاليه من المصدر مباشرة لضمان الجوده العاليه نوفرها لكم بجميع القياسات',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    category: ''
  },
  {
    id: 'cat-spots',
    name: 'سبوت لايت',
    description: 'سبوتات بأنواعها المختلفه المضاده للتوهج والمتحركة والمناسبة لجميع الأنشطة والأماكن',
    image: 'https://i.postimg.cc/9XDrxxfX/IMG-3399.webp',
    category: ''
  },
  {
    id: 'cat-switches',
    name: 'مفاتيح وبرايز',
    description: 'تشكيله كبيره من المفاتيح والبرايز المختلفه والشركات المتنوعه لتناسب كل ركن وزاويه في بيتك',
    image: 'https://i.postimg.cc/rFdZwLwK/IMG-3396.webp',
    category: ''
  },
  {
    id: 'cat-chandeliers',
    name: 'ثريات',
    description: 'تشكيله واسعه من الثريات الكريستاليه والديكوريه الحديثه لتناسب جميع الأذواق',
    image: 'https://i.postimg.cc/QxrShKw7/IMG-3394.webp',
    category: ''
  },
  {
    id: 'cat-led',
    name: 'سكة الليد',
    description: 'نوفر السكك المختلفه منها المغناطيسيه والمرنه والخارجيه والمدفونه لتناسب جميع الأذواق',
    image: 'https://i.postimg.cc/4xjYRVFC/IMG-3391.webp',
    category: ''
  },
  {
    id: 'cat-intercom',
    name: 'انترفون',
    description: 'جميع أنواع الانترفونات السلكية منها واللاسلكية وبمختلف الشركات العالميه والجوده الممتازة',
    image: 'https://i.postimg.cc/pLN7ftsB/IMG-3725.webp',
    category: ''
  },
  {
    id: 'cat-foundation',
    name: 'مواد تأسيس الكهربائي',
    description: 'جميع مواد التأسيس من البدايه حتي اخر خطوه في التشطيب بالجوده العاليه والمواد المميزه',
    image: 'https://i.postimg.cc/zDy4VhdZ/IMG-3395.webp',
    category: ''
  },

  // Fallback Products:
  {
    id: 'wire-italy-25',
    name: 'سلك كهربائي إيطالي معتمد 2.5 مم',
    description: 'أسلاك إيطالية معتمدة وموصلات نحاسية فائقة النقاء عازلة للحرارة والكهرباء 100%.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
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
    image: 'https://i.postimg.cc/9XDrxxfX/IMG-3399.webp',
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
    image: 'https://i.postimg.cc/rFdZwLwK/IMG-3396.webp',
    price: 65,
    discountPrice: 55,
    stockStatus: 'available',
    stockQty: 60,
    category: 'مفاتيح وبرايز'
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
                  category: (mediaData.category || item.category || '').trim()
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

  // تصنيف الأقسام المرفوعة في قاعدة البيانات (حيث حقل القسم فارغ أو غير موجود)
  const dynamicCategories = products.filter(p => !p.category || p.category.trim() === '')

  // المنتجات الحقيقية المرفوعة تحت الأقسام
  const actualProducts = products.filter(p => p.category && p.category.trim() !== '')

  // المنتجات التي سيتم عرضها بناءً على التصفية الحالية
  const displayedProducts = actualProducts.filter(p => p.category && p.category.trim() === selectedCategory.trim())

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
              <>معرض <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_4px_15px_rgba(245,158,11,0.3)]">المنتجات</span></>
            ) : (
              <>Products <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_4px_15px_rgba(245,158,11,0.3)]">Gallery</span></>
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

        {/* شبكة الأقسام الرئيسية الديناميكية المستمدة من قاعدة البيانات (Dynamic Categories Showcase Bento Grid) */}
        {!loading && selectedCategory === 'all' && (
          <div className="mb-16 md:mb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dynamicCategories.map((cat, i) => {
                const catProductCount = actualProducts.filter(p => p.category && p.category.trim() === cat.name.trim()).length
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' }}
                    style={{ transform: 'translateZ(0)' }}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="group relative rounded-3xl bg-[#0f213a] border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col h-full cursor-pointer"
                  >
                    {/* صورة كرت القسم الفاخرة */}
                    <div className="relative aspect-[4/3] bg-[#0a192f] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f213a] via-transparent to-transparent opacity-85 z-10" />
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} 
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors duration-300 mb-2 leading-tight">
                          {cat.name}
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium line-clamp-2 mb-4">
                          {cat.description || (isAr ? 'تصفح تشكيلة متميزة من أرقى الماركات والمواصفات.' : 'Browse a curated collection from the finest brands.')}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                        <span className="text-xs font-black text-blue-300 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                          <span>{isAr ? 'استعرض هذا القسم' : 'Browse Category'}</span>
                          <ArrowLeft className={`w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180'}`} />
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      </div>
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

        {!loading && selectedCategory !== 'all' && displayedProducts.length === 0 && (
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
              {isAr ? 'العودة لكافة الأقسام' : 'Show All Categories'}
            </button>
          </motion.div>
        )}

        {!loading && selectedCategory !== 'all' && displayedProducts.length > 0 && (
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f213a] via-transparent to-transparent opacity-85 z-10" />
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
