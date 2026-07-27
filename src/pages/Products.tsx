import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, X, ShoppingCart, Check, Image as ImageIcon, 
  ArrowRight, Sparkles, Layers, Zap, Eye, Video, 
  ChevronLeft, SlidersHorizontal, Package, Star 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useCart } from '../hooks/useCart'

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

// 📦 أقسام المتجر الرئيسية (Categories List)
const CATEGORIES_LIST = [
  {
    id: 'cat-wires',
    nameAr: 'الأسلاك والكوابل',
    nameEn: 'Wires & Cables',
    descriptionAr: 'الأسلاك الإيطالية الأصلية والموصلات المعتمدة لضمان أقصى درجات الأمان والسلامة.',
    descriptionEn: 'Certified Italian copper wires and cables directly from original source.',
    icon: Zap,
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp'
  },
  {
    id: 'cat-spots',
    nameAr: 'سبوت لايت',
    nameEn: 'Spotlights',
    descriptionAr: 'سبوتات مضادة للتوهج Anti-Glare وتصاميم غاطسة ومتحركة لجميع المساحات.',
    descriptionEn: 'Anti-glare and architectural spotlights designed for all interior spaces.',
    icon: Sparkles,
    image: 'https://i.postimg.cc/9XDrxxfX/IMG-3399.webp'
  },
  {
    id: 'cat-switches',
    nameAr: 'مفاتيح وبرايز',
    nameEn: 'Switches & Sockets',
    descriptionAr: 'تشكيلة عصرية من المفاتيح والمآخذ الذكية والديكورية بأعلى معايير الجودة.',
    descriptionEn: 'Modern smart switches and decorative sockets fitting every interior style.',
    icon: Layers,
    image: 'https://i.postimg.cc/rFdZwLwK/IMG-3396.webp'
  },
  {
    id: 'cat-chandeliers',
    nameAr: 'ثريات',
    nameEn: 'Chandeliers',
    descriptionAr: 'ثريات كريستالية وديكورية عصرية تعطي لمسة فخامة استثنائية لم منزلك.',
    descriptionEn: 'Luxury crystal and modern chandeliers to elevate your living spaces.',
    icon: Star,
    image: 'https://i.postimg.cc/QxrShKw7/IMG-3394.webp'
  },
  {
    id: 'cat-led',
    nameAr: 'سكة الليد',
    nameEn: 'LED Track Lights',
    descriptionAr: 'أنظمة سكك الليد المغناطيسية والغاطسة والسطحية لمرونة إضاءة لا مثيل لها.',
    descriptionEn: 'Magnetic and recessed LED track lighting systems for high flexibility.',
    icon: Sparkles,
    image: 'https://i.postimg.cc/4xjYRVFC/IMG-3391.webp'
  },
  {
    id: 'cat-intercom',
    nameAr: 'انترفون',
    nameEn: 'Intercom Systems',
    descriptionAr: 'أنظمة انترفون سلكية وللاسلكية ذكية بوضوح عالي للحماية والأمان.',
    descriptionEn: 'Smart video intercom systems with high clarity for home security.',
    icon: Package,
    image: 'https://i.postimg.cc/pLN7ftsB/IMG-3725.webp'
  },
  {
    id: 'cat-foundation',
    nameAr: 'مواد تأسيس الكهربائي',
    nameEn: 'Electrical Materials',
    descriptionAr: 'جميع مستلزمات ومواد التأسيس الكهربائي الأولية والتكميلية بالجودة العالية.',
    descriptionEn: 'Complete range of electrical installation materials and accessories.',
    icon: Layers,
    image: 'https://i.postimg.cc/zDy4VhdZ/IMG-3395.webp'
  }
]

// 🛒 المنتجات الافتراضية الموزعة حسب الأقسام
const defaultFallbackProducts: ProductItem[] = [
  // الأسلاك والكوابل الإيطالية المعتمدة (جميع القياسات)
  {
    id: 'wire-size-15',
    name: 'سلك كهربائي إيطالي معتمد 1.5 مم (لفة 100 متر)',
    description: 'نحاس صافي 100% عالي النقاء مستورد مباشرة من إيطاليا، مناسب للإنارة والإضاءة العامة.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 245,
    discountPrice: 230,
    stockStatus: 'available',
    stockQty: 150,
    category: 'الأسلاك والكوابل'
  },
  {
    id: 'wire-size-25',
    name: 'سلك كهربائي إيطالي معتمد 2.5 مم (لفة 100 متر)',
    description: 'نحاس صافي 100% عازل للحرارة والكهرباء، مخصص للتأسيس المنزلي والأحمال المتوسطة والبرايز.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 375,
    discountPrice: 350,
    stockStatus: 'available',
    stockQty: 200,
    category: 'الأسلاك والكوابل'
  },
  {
    id: 'wire-size-40',
    name: 'سلك كهربائي إيطالي معتمد 4.0 مم (لفة 100 متر)',
    description: 'نحاس إلكتروليتي إيطالي صافي 100%، مخصص للمكيفات والأجهزة الكبيرة والأحمال الثقيلة.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 585,
    discountPrice: 550,
    stockStatus: 'available',
    stockQty: 100,
    category: 'الأسلاك والكوابل'
  },
  {
    id: 'wire-size-60',
    name: 'سلك كهربائي إيطالي معتمد 6.0 مم (لفة 100 متر)',
    description: 'سلك نحاسي إيطالي فائق القوة للخطوط المغذية الرئيسية والفرعية والأحمال العالية.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 845,
    discountPrice: 810,
    stockStatus: 'available',
    stockQty: 80,
    category: 'الأسلاك والكوابل'
  },
  {
    id: 'wire-size-100',
    name: 'سلك كهربائي إيطالي معتمد 10.0 مم (لفة 100 متر)',
    description: 'موصلات نحاسية إيطالية صافية 100% معتمدة للوحات التوزيع والعدادات الرئيسية.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 1350,
    discountPrice: 1290,
    stockStatus: 'available',
    stockQty: 40,
    category: 'الأسلاك والكوابل'
  },
  {
    id: 'wire-size-160',
    name: 'سلك كهربائي إيطالي معتمد 16.0 مم (لفة 100 متر)',
    description: 'أسلاك إيطالية ثقيلة فائقة النقاء عازلة للضغط العالي مخصصة للتأسيس الصناعي والمباني الضخمة.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 1980,
    discountPrice: 1900,
    stockStatus: 'available',
    stockQty: 25,
    category: 'الأسلاك والكوابل'
  },
  // سبوت لايت
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
    id: 'spot-cob-12w',
    name: 'سبوت لايت COB 12 واط متحرك',
    description: 'إضاءة توجيهية ممتازة بدقة عالية وتصميم ألومنيوم مقاوم للحرارة.',
    image: 'https://i.postimg.cc/9XDrxxfX/IMG-3399.webp',
    price: 55,
    discountPrice: 45,
    stockStatus: 'available',
    stockQty: 40,
    category: 'سبوت لايت'
  },
  // مفاتيح وبرايز
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
  },
  {
    id: 'socket-[#0f213a]',
    name: 'مأخذ شحن سريع USB + Type-C',
    description: 'بريز كهربائي مزود بمنفذين شحن سريع وتصميم عصري عالي الجودة.',
    image: 'https://i.postimg.cc/rFdZwLwK/IMG-3396.webp',
    price: 48,
    discountPrice: 40,
    stockStatus: 'available',
    stockQty: 75,
    category: 'مفاتيح وبرايز'
  },
  // ثريات
  {
    id: 'chandelier-crystal-gold',
    name: 'ثريا كريستال مودرن فاخرة',
    description: 'تصميم راقي بإضاءة خافتة وكريستال نقي لإعطاء فخامة للمجالس والصالونات.',
    image: 'https://i.postimg.cc/QxrShKw7/IMG-3394.webp',
    price: 450,
    discountPrice: 390,
    stockStatus: 'available',
    stockQty: 15,
    category: 'ثريات'
  },
  // سكة الليد
  {
    id: 'led-track-magnetic',
    name: 'سكة ليد مغناطيسية غاطسة 2 متر',
    description: 'نظام إضاءة خطي مغناطيسي مرن يتيح تركيب وتغيير السبوتات بسهولة.',
    image: 'https://i.postimg.cc/4xjYRVFC/IMG-3391.webp',
    price: 120,
    discountPrice: 105,
    stockStatus: 'available',
    stockQty: 30,
    category: 'سكة الليد'
  },
  // انترفون
  {
    id: 'intercom-video-wifi',
    name: 'انترفون مرئي ذكي بشاشة 7 بوصة',
    description: 'كاميرا خارجية بدقة HD مع خاصية الاتصال التلقائي بالهاتف عبر الواي فاي.',
    image: 'https://i.postimg.cc/pLN7ftsB/IMG-3725.webp',
    price: 320,
    discountPrice: 280,
    stockStatus: 'available',
    stockQty: 20,
    category: 'انترفون'
  },
  // مواد تأسيس الكهربائي
  {
    id: 'foundation-box-pvc',
    name: 'علب توزيع ومواسير تأسيس بي في سي',
    description: 'علب ومواسير كهربائية معتمدة شديدة التحمل ومقاومة للضغط والحرارة.',
    image: 'https://i.postimg.cc/zDy4VhdZ/IMG-3395.webp',
    price: 15,
    discountPrice: 12,
    stockStatus: 'available',
    stockQty: 200,
    category: 'مواد تأسيس الكهربائي'
  }
]

export default function Products() {
  const { isAr } = useLanguage()
  const { addToCart, triggerFlyAnimation } = useCart()

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addingId, setAddingId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [loading, setLoading] = useState(true)

  const [products, setProducts] = useState<ProductItem[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enarah_cached_products')
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((p: any) => ({
              ...p,
              name: String(p.name || '').replace(/إيطالي\s*\/\s*تركي/gi, 'إيطالي معتمد').replace(/ايطالي\s*\/\s*تركي/gi, 'إيطالي معتمد'),
              description: String(p.description || '').replace(/إيطالي\s*\/\s*تركي/gi, 'إيطالي معتمد').replace(/ايطالي\s*\/\s*تركي/gi, 'إيطالي معتمد')
            }))
          }
        } catch {}
      }
    }
    return defaultFallbackProducts
  })

  // 1. جلب المنتجات من السيرفر المباشر وتنسيقها
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
                return false
              }
              if (itemEmail.includes('admin_wire_prices')) return false
              if (itemEmail.includes('hero_video') || itemEmail.includes('video') || itemName.includes('فيديو') || itemName.includes('تحديث فيديو') || itemName.includes('خلفية')) return false

              try {
                const phoneData = item.phone ? JSON.parse(item.phone) : {}
                if (phoneData.type === 'project' || phoneData.type === 'hero_video' || phoneData.type === 'video') return false
              } catch {}

              return true
            })
            .map((item: any, index: number) => {
              let mediaData: any = {}
              try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}

              let descText = mediaData.description || (item.email && !item.email.includes('@upload.local') ? item.email : '')
              try {
                const descObj = JSON.parse(descText)
                descText = isAr ? (descObj.ar || descObj.en || descText) : (descObj.en || descObj.ar || descText)
              } catch {}

              let nameText = item.name || 'منتج إنارة'
              try {
                const nameObj = JSON.parse(nameText)
                nameText = isAr ? (nameObj.ar || nameObj.en || nameText) : (nameObj.en || nameObj.ar || nameText)
              } catch {}

              nameText = nameText
                .replace(/إيطالي\s*\/\s*تركي/gi, 'إيطالي معتمد')
                .replace(/ايطالي\s*\/\s*تركي/gi, 'إيطالي معتمد')
                .replace(/كابل\s*\/\s*سلك/gi, 'سلك')
                .replace(/كوابل/gi, 'أسلاك')
              descText = descText
                .replace(/إيطالي\s*\/\s*تركي/gi, 'إيطالي معتمد')
                .replace(/ايطالي\s*\/\s*تركي/gi, 'إيطالي معتمد')
                .replace(/كابل\s*\/\s*سلك/gi, 'سلك')
                .replace(/كوابل/gi, 'أسلاك')

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
            // دمج منتجات السيرفر مع المنتجات الافتراضية لضمان تنوع المتجر
            setProducts([...loadedProducts, ...defaultFallbackProducts])
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

  // 2. معالجة الإضافة للسلة بلمسة حركية طائرة
  const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
    e.stopPropagation()
    triggerFlyAnimation(e.clientX, e.clientY)
    setAddingId(product.id)
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.discountPrice && product.price && product.discountPrice < product.price ? product.discountPrice : (product.price || 0),
      discountPrice: product.discountPrice,
      stockStatus: product.stockStatus,
      stockQty: product.stockQty
    })
    setTimeout(() => {
      setAddingId(null)
    }, 1200)
  }

  // 3. فلترة منتجات البحث الفوري
  const searchedProducts = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase().trim()
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      (p.category && p.category.toLowerCase().includes(q))
    )
  }, [products, searchQuery])

  // 4. تجميع المنتجات حسب كل قسم على حدة (Stacked Category Groups)
  const categoryGroups = useMemo(() => {
    return CATEGORIES_LIST.map(cat => {
      const categoryName = isAr ? cat.nameAr : cat.nameEn
      const categoryProducts = products.filter(p => {
        if (!p.category) return false
        const catClean = p.category.trim().toLowerCase()
        return catClean === cat.nameAr.toLowerCase() || catClean === cat.nameEn.toLowerCase()
      })

      // إذا لم يتوفر منتج مرفوع مخصص للقسم، نضع المنتجات الافتراضية
      const items = categoryProducts.length > 0 ? categoryProducts : defaultFallbackProducts.filter(p => p.category === cat.nameAr)

      return {
        ...cat,
        items
      }
    })
  }, [products, isAr])

  return (
    <div className="pt-24 md:pt-32 pb-36 bg-transparent min-h-screen relative overflow-hidden text-white">
      {/* شبكة هندسية خلفية دافئة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* زر العودة */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#0f213a] border border-white/10 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-blue-400 font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </motion.div>

        {/* عنوان المعرض الرئيسي */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight text-white">
            {isAr ? (
              <>متجر <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_20px_rgba(59,130,246,0.4)]">الإنارة والكهرباء</span></>
            ) : (
              <>Lighting & Electrical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_20px_rgba(59,130,246,0.4)]">Store</span></>
            )}
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-base md:text-lg font-medium">
            {isAr 
              ? 'تصفح أقسام متجرنا المنسقة والمنتجات المعتمدة بجودة عالية وأفضل الأسعار'
              : 'Browse our organized store categories and certified high-quality lighting products'
            }
          </p>
        </motion.div>

        {/* 🔍 1. خانة البحث الفوري الاحترافية (Instant Store Search Bar) */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center">
            <Search className={`absolute ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-sky-400 pointer-events-none`} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث عن سلك، سبوت لايت، ثريا، مفتاح ذكي..." : "Search wires, spotlights, chandeliers, switches..."}
              className={`w-full ${isAr ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-4 rounded-2xl bg-[#0f213a]/90 border border-sky-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 shadow-[0_4px_25px_rgba(0,0,0,0.3)] transition-all text-sm sm:text-base`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className={`absolute ${isAr ? 'left-4' : 'right-4'} p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery.trim() !== '' && (
            <div className="mt-3 flex items-center justify-between px-2 text-xs text-sky-400 font-bold">
              <span>{isAr ? `نتائج البحث عن: "${searchQuery}"` : `Search results for: "${searchQuery}"`}</span>
              <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
                {isAr ? `${searchedProducts.length} منتج متطابق` : `${searchedProducts.length} products found`}
              </span>
            </div>
          )}
        </motion.div>

        {/* 🗂️ 2. شريط التنقل السريع بين الأقسام (Sticky Category Navigation Pills) */}
        {searchQuery.trim() === '' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-14 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
            <div className="flex items-center gap-3 min-w-max px-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 border ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105'
                    : 'bg-[#0f213a] text-slate-300 border-white/10 hover:border-blue-500/40 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{isAr ? 'جميع الأقسام' : 'All Categories'}</span>
              </button>

              {CATEGORIES_LIST.map((cat) => {
                const catName = isAr ? cat.nameAr : cat.nameEn
                const isSelected = selectedCategory === catName
                const IconComponent = cat.icon

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(catName)
                      const element = document.getElementById(cat.id)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105'
                        : 'bg-[#0f213a] text-slate-300 border-white/10 hover:border-blue-500/40 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-sky-400" />
                    <span>{catName}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* 🔎 حالة نتائج البحث المباشرة (Search Mode View) */}
        {searchQuery.trim() !== '' ? (
          <div>
            {searchedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isAr={isAr} 
                    onAddToCart={handleAddToCart}
                    isAdding={addingId === product.id}
                    onOpenModal={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#0f213a]/50 rounded-3xl border border-white/10">
                <Package className="w-16 h-16 text-slate-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {isAr ? 'لم نجد نتائج مطابقة لفي البحث' : 'No matching products found'}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  {isAr ? 'جرب البحث باسم آخر مثل "سلك"، "سبوت"، "ثريا"' : 'Try searching for wires, spotlights, or chandeliers'}
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
                >
                  {isAr ? 'إلغاء البحث ورؤية كافة الأقسام' : 'Clear search'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 🛍️ 3. الأقسام المتراتبة تحت بعضها (Stacked Categories Store View) */
          <div className="space-y-20">
            {categoryGroups.map((catGroup) => {
              const catName = isAr ? catGroup.nameAr : catGroup.nameEn
              const catDesc = isAr ? catGroup.descriptionAr : catGroup.descriptionEn
              const IconComponent = catGroup.icon

              if (selectedCategory !== 'all' && selectedCategory !== catName) {
                return null
              }

              return (
                <section key={catGroup.id} id={catGroup.id} className="scroll-mt-32">
                  
                  {/* رأس القسم (Category Section Banner Header) */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-sky-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl sm:text-3xl font-black text-white">{catName}</h2>
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-sky-300 text-xs font-bold rounded-full">
                            {isAr ? `${catGroup.items.length} منتج` : `${catGroup.items.length} items`}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1">{catDesc}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedCategory(catName)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors self-start md:self-auto"
                    >
                      <span>{isAr ? 'عرض منتجات هذا القسم فقط' : 'Filter by this category'}</span>
                      <ChevronLeft className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
                    </button>
                  </div>

                  {/* المنتجات التابعة لهذا القسم تحت بعضها (Products Grid per Category) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {catGroup.items.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        isAr={isAr} 
                        onAddToCart={handleAddToCart}
                        isAdding={addingId === product.id}
                        onOpenModal={() => setSelectedProduct(product)}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}

      </div>

      {/* 4. نافذة تفاصيل المنتج السريعة (Quick View Product Modal) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 z-[2500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f213a] border border-white/10 rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl overflow-hidden dir-rtl"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0a192f] border border-white/10">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }}
                  />
                </div>

                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold inline-block mb-3">
                      {selectedProduct.category || (isAr ? 'منتج معتمد' : 'Certified Product')}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-3">{selectedProduct.name}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">{selectedProduct.description}</p>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-xs block">{isAr ? 'السعر الرسمي' : 'Official Price'}</span>
                      <span className="text-2xl font-black text-sky-400">
                        {selectedProduct.price ? `${selectedProduct.price} د.ل` : (isAr ? 'اتصل للسعر' : 'Call for Price')}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        handleAddToCart(e, selectedProduct)
                        setSelectedProduct(null)
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isAr ? 'إضافة إلى السلة' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 📇 كرت المنتج التجاري الفاخر (E-Commerce Product Card Component)
function ProductCard({ 
  product, 
  isAr, 
  onAddToCart, 
  isAdding,
  onOpenModal
}: { 
  product: ProductItem
  isAr: boolean
  onAddToCart: (e: React.MouseEvent, product: ProductItem) => void
  isAdding: boolean
  onOpenModal: () => void
}) {
  const hasDiscount = product.discountPrice && product.price && product.discountPrice < product.price

  return (
    <motion.div 
      onClick={onOpenModal}
      whileHover={{ y: -6 }}
      className="group relative bg-[#0f213a] border border-white/10 rounded-3xl overflow-hidden hover:border-sky-500/40 transition-all duration-300 shadow-xl flex flex-col h-full cursor-pointer"
    >
      {/* صورة المنتج مع زوم انسيابي */}
      <div className="relative aspect-[4/3] bg-[#0a192f] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f213a] via-transparent to-transparent opacity-80 z-10" />
        
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy" 
          decoding="async" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0" 
          onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} 
        />

        {/* شارة التوفر */}
        {product.stockStatus === 'out_of_stock' ? (
          <div className="absolute top-3 right-3 z-20 bg-red-950/90 border border-red-500/30 px-3 py-1 rounded-full text-[10px] text-red-300 font-bold">
            {isAr ? 'نفذت الكمية ❌' : 'Out of Stock'}
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-20 bg-emerald-950/90 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] text-emerald-300 font-bold">
            {isAr ? 'متوفر بالمخزن 🟢' : 'In Stock'}
          </div>
        )}
      </div>

      {/* تفاصيل المنتج وازرار الشراء */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base font-black text-white group-hover:text-sky-300 transition-colors duration-300 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed line-clamp-2 mb-4 font-medium">
            {product.description}
          </p>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 block">{isAr ? 'السعر' : 'Price'}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-sky-400">
                {product.price ? `${product.price} د.ل` : (isAr ? 'حسب القياس' : 'On Request')}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-500 line-through">
                  {product.discountPrice} د.ل
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => onAddToCart(e, product)}
            disabled={isAdding}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all duration-300 flex items-center gap-2 shadow-md ${
              isAdding
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-blue-600/90 hover:bg-blue-500 text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 text-white animate-bounce" />
                <span>{isAr ? 'تمت الإضافة' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{isAr ? 'إضافة للسلة' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
