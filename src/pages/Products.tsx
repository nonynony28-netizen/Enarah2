import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, X, ShoppingCart, Check, Image as ImageIcon, 
  ArrowRight, Sparkles, Layers, Zap, Eye, Video, 
  ChevronLeft, SlidersHorizontal, Package, Star,
  Flame, Tag, BadgePercent 
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

// 📦 أقسام المتجر الرئيسية (الأسلاك والتخفيضات)
const CATEGORIES_LIST = [
  {
    id: 'cat-wires',
    nameAr: 'الأسلاك والكوابل الإيطالية والتركية',
    nameEn: 'Italian & Turkish Wires & Cables',
    descriptionAr: 'الأسلاك الإيطالية والأوروبية الأصلية المعتمدة 100% بنحاس إلكتروليتي نقي لجميع مشاريع التأسيس.',
    descriptionEn: 'Certified 100% pure electrolytic copper Italian and Turkish wires and cables.',
    icon: Zap,
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp'
  },
  {
    id: 'cat-discounts',
    nameAr: 'التخفيضات والعروض الخاصة',
    nameEn: 'Special Discounts & Offers',
    descriptionAr: 'باقات تأسيس شاملة وعروض توفير حصرية على الأسلاك الإيطالية المعتمدة بأفضل الأسعار في ليبيا.',
    descriptionEn: 'Exclusive discounted bundles and limited-time deals on certified Italian wires and installation materials.',
    icon: Flame,
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp'
  }
]

// 🛒 المنتجات المعتمدة (الأسلاك والكوابل + باقات التخفيضات)
const defaultFallbackProducts: ProductItem[] = [
  // 🏷️ 1. باقات وعروض قسم التخفيضات
  {
    id: 'discount-full-apt-bundle',
    name: 'باقة التأسيس الشاملة (3 لفات سلك 1.5 مم + 2 لفة 2.5 مم إيطالي معتمد)',
    description: 'عرض خاص متكامل لتأسيس الشقق والمنازل، نحاس إيطالي أصلي 100% معتمد مع ضمان الجودة وأعلى درجات الأمان.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 1485,
    discountPrice: 1350,
    stockStatus: 'available',
    stockQty: 30,
    category: 'التخفيضات والعروض الخاصة'
  },
  {
    id: 'discount-duo-pack',
    name: 'عرض ثنائي التأسيس (لفة 1.5 مم + لفة 2.5 مم إيطالي أصلي)',
    description: 'باقة التوفير الأساسية للأحمال والإنارة المنزلية من أفضل المصانع الإيطالية المعتمدة مع توفير فوري.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 620,
    discountPrice: 570,
    stockStatus: 'available',
    stockQty: 50,
    category: 'التخفيضات والعروض الخاصة'
  },
  {
    id: 'discount-heavy-duty-bundle',
    name: 'باقة الأحمال والمكيفات (لفة 4.0 مم + لفة 6.0 مم إيطالي معتمد)',
    description: 'تحمل عالي وضغط كهربائي متوازن مخصص لتشغيل المكيفات الكبيرة والأفران والسخانات بأعلى أمان.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 1430,
    discountPrice: 1340,
    stockStatus: 'available',
    stockQty: 25,
    category: 'التخفيضات والعروض الخاصة'
  },
  {
    id: 'discount-contractor-pack-25',
    name: 'عرض المقاولين (10 لفات سلك 2.5 مم إيطالي معتمد)',
    description: 'عرض خاص للكميات والمشاريع الكبيرة، سلك نحاس إلكتروليتي نقي مطابق للمواصفات القياسية الأوروبية.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 3750,
    discountPrice: 3450,
    stockStatus: 'available',
    stockQty: 15,
    category: 'التخفيضات والعروض الخاصة'
  },

  // 🔌 2. مقاسات الأسلاك والكوابل الإيطالية
  {
    id: 'wire-size-15',
    name: 'سلك كهربائي إيطالي معتمد 1.5 مم (لفة 100 متر)',
    description: 'نحاس صافي 100% عالي النقاء مستورد مباشرة من إيطاليا، مناسب للإنارة والإضاءة العامة.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 245,
    discountPrice: 230,
    stockStatus: 'available',
    stockQty: 150,
    category: 'الأسلاك والكوابل الإيطالية والتركية'
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
    category: 'الأسلاك والكوابل الإيطالية والتركية'
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
    category: 'الأسلاك والكوابل الإيطالية والتركية'
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
    category: 'الأسلاك والكوابل الإيطالية والتركية'
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
    category: 'الأسلاك والكوابل الإيطالية والتركية'
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
    category: 'الأسلاك والكوابل الإيطالية والتركية'
  },
  {
    id: 'wire-size-250',
    name: 'سلك كهربائي إيطالي معتمد 25.0 مم (لفة 100 متر)',
    description: 'أسلاك نحاسية إيطالية فائقة النقاء للأحمال والمصانع والعدادات الرئيسية الضخمة.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 2950,
    discountPrice: 2850,
    stockStatus: 'available',
    stockQty: 20,
    category: 'الأسلاك والكوابل الإيطالية والتركية'
  }
]

// 🔮 قائمة الأقسام القادمة قريباً (Coming Soon Categories)
const COMING_SOON_CATEGORIES = [
  {
    id: 'soon-chandeliers',
    nameAr: 'الثريات المودرن والإنارة الفاخرة',
    nameEn: 'Modern & Crystal Chandeliers',
    descriptionAr: 'تشكيلة حصرية من أرقى الثريات الكريستالية والمودرن للمجالس والصالونات.',
    descriptionEn: 'Luxury crystal and modern chandeliers to elevate your living spaces.',
    image: 'https://i.postimg.cc/QxrShKw7/IMG-3394.webp',
    badgeAr: 'قريباً',
    badgeEn: 'Coming Soon',
    tag: 'ثريات فاخرة'
  },
  {
    id: 'soon-spots',
    nameAr: 'سبوت لايت وسكك الليد المغناطيسية',
    nameEn: 'Spotlights & Magnetic Track Lights',
    descriptionAr: 'سبوتات مضادة للتوهج Anti-Glare وأنظمة إنارة خطية مغناطيسية متطورة.',
    descriptionEn: 'Anti-glare spotlights and modern magnetic track lighting systems.',
    image: 'https://i.postimg.cc/9XDrxxfX/IMG-3399.webp',
    badgeAr: 'قريباً',
    badgeEn: 'Coming Soon',
    tag: 'إنارة معمارية'
  },
  {
    id: 'soon-switches',
    nameAr: 'المفاتيح والبريزات الذكية',
    nameEn: 'Smart Switches & Sockets',
    descriptionAr: 'مفاتيح لمس ذكية وتصاميم عصرية ومآخذ شحن سريع بأعلى معايير الأمان.',
    descriptionEn: 'Modern touch smart switches and high-speed fast charging sockets.',
    image: 'https://i.postimg.cc/rFdZwLwK/IMG-3396.webp',
    badgeAr: 'قريباً',
    badgeEn: 'Coming Soon',
    tag: 'مفاتيح ذكية'
  },
  {
    id: 'soon-intercom',
    nameAr: 'أنظمة الإنترفون المرئي والأمان',
    nameEn: 'Smart Video Intercom Systems',
    descriptionAr: 'أحدث أجهزة الإنترفون الذكية بشاشات HD وخاصية الاتصال بالهاتف.',
    descriptionEn: 'Smart HD video intercom systems with mobile connectivity for home security.',
    image: 'https://i.postimg.cc/pLN7ftsB/IMG-3725.webp',
    badgeAr: 'قريباً',
    badgeEn: 'Coming Soon',
    tag: 'أمان وحماية'
  },
  {
    id: 'soon-foundation',
    nameAr: 'مواد التأسيس والعلب والمواسير',
    nameEn: 'Electrical Installation Materials',
    descriptionAr: 'مواسير وعلب وقواطع حماية معتمدة شديدة التحمل للمباني والمشاريع.',
    descriptionEn: 'Heavy-duty certified pipes, junction boxes, and installation essentials.',
    image: 'https://i.postimg.cc/zDy4VhdZ/IMG-3395.webp',
    badgeAr: 'قريباً',
    badgeEn: 'Coming Soon',
    tag: 'تأسيس معتمد'
  }
]

export default function Products() {
  const { isAr } = useLanguage()
  const { addToCart, triggerFlyAnimation } = useCart()

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addingId, setAddingId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [loading, setLoading] = useState(false)

  // دالة تحقق صارمة لضمان حصرية الأسلاك وباقات التخفيضات فقط
  const isAllowedStoreProduct = (item: ProductItem) => {
    const name = String(item.name || '').toLowerCase().trim()
    const cat = String(item.category || '').toLowerCase().trim()
    
    // استبعاد صريح لأي سبوت لايت، ثريات، مفاتيح، برايز، انترفون، سكك ليد
    if (
      name.includes('سبوت') || name.includes('spot') || 
      name.includes('ثريا') || name.includes('chandelier') ||
      name.includes('مفتاح') || name.includes('switch') || 
      name.includes('بريز') || name.includes('socket') ||
      name.includes('سكة') || name.includes('انترفون') || 
      name.includes('intercom') || name.includes('مواسير')
    ) {
      return false
    }

    return cat.includes('سلك') || cat.includes('أسلاك') || cat.includes('كابل') || cat.includes('wire') ||
           cat.includes('تخفيض') || cat.includes('عرض') || cat.includes('discount') ||
           name.includes('سلك') || name.includes('أسلاك') || name.includes('كابل') || name.includes('wire') ||
           name.includes('باقة') || name.includes('عرض')
  }

  const [products, setProducts] = useState<ProductItem[]>(defaultFallbackProducts)

  // 1. جلب منتجات الأسلاك فقط من السيرفر المباشر وتنسيقها
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('enarah_cached_products')
    }

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

              let nameText = item.name || 'سلك كهربائي إيطالي معتمد'
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

              const itemCategory = mediaData.category === 'التخفيضات والعروض الخاصة' || 
                (mediaData.category && mediaData.category.includes('تخفيض')) ||
                (mediaData.discountPrice && mediaData.price && mediaData.discountPrice < mediaData.price && (nameText.includes('باقة') || nameText.includes('عرض') || nameText.includes('تخفيض') || nameText.includes('خصم')))
                ? 'التخفيضات والعروض الخاصة'
                : 'الأسلاك والكوابل الإيطالية والتركية'

              return {
                id: item._id || String(index),
                name: nameText,
                description: descText,
                image: mediaData.imageUrl || 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
                video: mediaData.videoUrl || '',
                price: mediaData.price,
                discountPrice: mediaData.discountPrice,
                stockStatus: mediaData.stockStatus || 'available',
                stockQty: mediaData.stockQty,
                category: itemCategory
              }
            })
            .filter(isAllowedStoreProduct)

          if (formattedProducts.length > 0) {
            setProducts([...formattedProducts, ...defaultFallbackProducts.filter(fb => !formattedProducts.some(p => p.id === fb.id))])
          } else {
            setProducts(defaultFallbackProducts)
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
    return products.filter(isAllowedStoreProduct).filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    )
  }, [products, searchQuery])

  // 4. تجميع المنتجات حسب الأقسام
  const categoryGroups = useMemo(() => {
    return CATEGORIES_LIST.map(cat => {
      let items: ProductItem[] = []
      if (cat.id === 'cat-discounts') {
        items = products.filter(p => p.category === 'التخفيضات والعروض الخاصة' || (p.discountPrice && p.price && p.discountPrice < p.price && (p.name.includes('باقة') || p.name.includes('عرض'))))
        if (items.length === 0) {
          items = defaultFallbackProducts.filter(p => p.category === 'التخفيضات والعروض الخاصة')
        }
      } else {
        items = products.filter(p => p.category !== 'التخفيضات والعروض الخاصة')
        if (items.length === 0) {
          items = defaultFallbackProducts.filter(p => p.category === 'الأسلاك والكوابل الإيطالية والتركية')
        }
      }

      return {
        ...cat,
        items
      }
    })
  }, [products, isAr])

  // الأقسام المفلترة حسب اختيار المستخدم
  const visibleCategories = useMemo(() => {
    if (selectedCategory === 'all') return categoryGroups
    return categoryGroups.filter(c => (isAr ? c.nameAr : c.nameEn) === selectedCategory || c.id === selectedCategory)
  }, [categoryGroups, selectedCategory, isAr])

  return (
    <div className="pt-24 md:pt-32 pb-36 bg-transparent min-h-screen relative overflow-hidden text-white">
      {/* شبكة هندسية خلفية دافئة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* زر العودة */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white font-semibold transition-all">
            <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </motion.div>

        {/* عنوان المعرض الرئيسي */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight text-white">
            {isAr ? (
              <>متجر <span className="text-blue-400">الإنارة والكهرباء</span></>
            ) : (
              <>Lighting & Electrical <span className="text-blue-400">Store</span></>
            )}
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed text-base md:text-lg font-normal">
            {isAr 
              ? 'تصفح قائمة الأسلاك والكوابل المعتمدة وقسم التخفيضات الحصرية بأعلى معايير الجودة وأفضل الأسعار'
              : 'Browse certified Italian wires, cables, and exclusive discount packages with the best market prices'
            }
          </p>
        </motion.div>

        {/* 🔍 1. خانة البحث الفوري الاحترافية */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className={`absolute ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-400 pointer-events-none`} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث عن مقاس السلك أو العرض (مثال: 1.5 مم، 2.5 مم، باقة تأسيس...)" : "Search wire size or bundle (e.g. 1.5mm, 2.5mm, bundle...)"}
              className={`w-full ${isAr ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 transition-all text-sm`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className={`absolute ${isAr ? 'left-4' : 'right-4'} p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery.trim() !== '' && (
            <div className="mt-3 flex items-center justify-between px-2 text-xs text-zinc-400 font-semibold">
              <span>{isAr ? `نتائج البحث عن: "${searchQuery}"` : `Search results for: "${searchQuery}"`}</span>
              <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                {isAr ? `${searchedProducts.length} عنصر متطابق` : `${searchedProducts.length} matches found`}
              </span>
            </div>
          )}
        </motion.div>

        {/* 🗂️ 2. شريط التنقل السريع بين الأقسام الفعالة */}
        {searchQuery.trim() === '' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex justify-center">
            <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl overflow-x-auto max-w-full">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md ring-1 ring-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Layers className="w-4 h-4 text-zinc-400" />
                <span>{isAr ? 'جميع الأقسام' : 'All Categories'}</span>
              </button>

              {CATEGORIES_LIST.map((cat) => {
                const catName = isAr ? cat.nameAr : cat.nameEn
                const isSelected = selectedCategory === catName || selectedCategory === cat.id
                const IconComponent = cat.icon
                const isDiscountCat = cat.id === 'cat-discounts'

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(catName)}
                    className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? (isDiscountCat 
                            ? 'bg-gradient-to-r from-amber-600/30 to-red-600/30 text-amber-300 border border-amber-500/50 shadow-md ring-1 ring-amber-400/20' 
                            : 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-md ring-1 ring-blue-400/20')
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isDiscountCat ? 'text-amber-400' : 'text-blue-400'}`} />
                    <span>{catName}</span>
                    {isDiscountCat && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 animate-pulse">
                        {isAr ? 'خصومات' : 'Offers'}
                      </span>
                    )}
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
              <div className="text-center py-20 bg-[#111215] rounded-2xl border border-zinc-800">
                <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {isAr ? 'لم نجد نتائج مطابقة للبحث' : 'No matching results found'}
                </h3>
                <p className="text-zinc-400 text-xs mb-6">
                  {isAr ? 'جرب البحث باسم المقاس أو كلمة "باقة" أو "سلك"' : 'Try searching by wire size or "bundle"'}
                </p>
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all"
                >
                  {isAr ? 'عرض جميع المنتجات' : 'Show all products'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 🛍️ أقسام المتجر (الأسلاك + التخفيضات) + قسم قريباً بالأسفل */
          <div className="space-y-16">
            {visibleCategories.map((catGroup) => {
              const catName = isAr ? catGroup.nameAr : catGroup.nameEn
              const catDesc = isAr ? catGroup.descriptionAr : catGroup.descriptionEn
              const IconComponent = catGroup.icon
              const isDiscountCat = catGroup.id === 'cat-discounts'

              return (
                <section key={catGroup.id} id={catGroup.id} className="scroll-mt-32">
                  
                  {/* رأس قسم المتجر */}
                  <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b ${
                    isDiscountCat ? 'border-amber-500/20' : 'border-zinc-800'
                  }`}>
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isDiscountCat 
                          ? 'bg-amber-950/50 border border-amber-800/60 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                          : 'bg-blue-950/50 border border-blue-800/60 text-blue-400'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-xl sm:text-2xl font-bold text-white">{catName}</h2>
                          <span className={`px-3 py-0.5 text-xs font-bold rounded-full border ${
                            isDiscountCat
                              ? 'bg-amber-500/10 border-amber-400/30 text-amber-300'
                              : 'bg-blue-500/10 border-blue-400/20 text-blue-400'
                          }`}>
                            {isAr ? `${catGroup.items.length} عروض متوفرة` : `${catGroup.items.length} offers available`}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-1 font-normal">{catDesc}</p>
                      </div>
                    </div>

                    {isDiscountCat ? (
                      <a 
                        href="https://wa.me/218915079140?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B9%D8%B1%D9%88%D8%B6%20%D8%A7%D9%84%D8%AA%D8%AE%D9%81%D9%8A%D8%B6%D8%A7%D8%AA%20%D9%88%D8%A8%D8%A7%D9%82%D8%A7%D8%AA%20%D8%A7%D9%84%D8%AA%D8%A3%D8%B3%D9%8A%D8%B3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto cursor-pointer"
                      >
                        <Flame className="w-3.5 h-3.5 text-yellow-200" />
                        <span>{isAr ? 'طلب باقة مخصصة عبر واتساب ←' : 'Custom Bundle on WhatsApp ←'}</span>
                      </a>
                    ) : (
                      <Link 
                        to="/wire-prices"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all self-start md:self-auto"
                      >
                        <Zap className="w-3.5 h-3.5 text-blue-400" />
                        <span>{isAr ? 'عرض جدول أسعار الأسلاك المحدث ←' : 'Live Wire Prices Table ←'}</span>
                      </Link>
                    )}
                  </div>

                  {/* شبكة البطاقات */}
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

            {/* 🔮 قسم قريباً... (Coming Soon Section) */}
            <section id="coming-soon-section" className="pt-12 border-t border-zinc-800/80">
              {/* رأس قسم قريباً */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-center text-blue-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {isAr ? 'قريباً في متجرنا...' : 'Coming Soon...'}
                      </h2>
                      <span className="px-3 py-0.5 bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold rounded-full">
                        {isAr ? 'تشكيلات جديدة' : 'New Collections'}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs mt-1 font-normal">
                      {isAr 
                        ? 'نعمل حالياً على تجهيز وإضافة تشكيلات حصرية من أرقى منتجات الإنارة والتأسيس الذكي:'
                        : 'We are curating and adding premium exclusive collections for lighting and smart installation:'}
                    </p>
                  </div>
                </div>
              </div>

              {/* شبكة بطاقات الأقسام القادمة قريباً */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
                {COMING_SOON_CATEGORIES.map((soonCat) => (
                  <motion.div
                    key={soonCat.id}
                    whileHover={{ y: -5 }}
                    className="group relative bg-[#111215] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden">
                      <img 
                        src={soonCat.image} 
                        alt={isAr ? soonCat.nameAr : soonCat.nameEn}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500 filter blur-[0.4px] group-hover:blur-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                      
                      {/* شارة قريباً المتوهجة */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-blue-950/90 border border-blue-500/40 text-blue-300 text-[10px] font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                          <span>{isAr ? soonCat.badgeAr : soonCat.badgeEn}</span>
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 z-10">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-900/80 border border-zinc-700 text-zinc-300 text-[10px] font-semibold backdrop-blur-sm">
                          {soonCat.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                          {isAr ? soonCat.nameAr : soonCat.nameEn}
                        </h3>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-normal line-clamp-2">
                          {isAr ? soonCat.descriptionAr : soonCat.descriptionEn}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {isAr ? 'قيد التجهيز والإدراج' : 'Under preparation'}
                        </span>
                        <span className="text-[11px] text-blue-400 font-bold flex items-center gap-1">
                          <span>{isAr ? 'ترقبوا' : 'Stay tuned'}</span>
                          <span>✨</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* بنر الاستفسارات والطلبات الخاصة عبر الواتساب */}
              <div className="relative rounded-2xl bg-gradient-to-r from-blue-950/30 via-zinc-900 to-blue-950/20 border border-blue-500/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold inline-block mb-2">
                    {isAr ? '💬 طلبيات واستشارات خاصة' : 'Custom Inquiries'}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    {isAr ? 'هل تبحث عن منتج محدد أو إنارة خاصة لمشروعك الآن؟' : 'Looking for a specific item or project lighting?'}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm font-normal">
                    {isAr 
                      ? 'فريقنا الهندسي في معرض بنغازي جاهز لتوفير كافة طلبات التأسيس والإنارة الخاصة مباشرة.'
                      : 'Our engineering team in Benghazi is ready to supply custom electrical and lighting orders.'}
                  </p>
                </div>

                <a 
                  href="https://wa.me/218915079140?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B7%D9%84%D8%A8%D9%8A%D8%A9%20%D8%AE%D8%A7%D8%B5%D8%A9%20%D9%85%D9%86%20%D9%85%D8%AA%D8%AC%D8%B1%20%D8%A7%D9%84%D8%A5%D9%86%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AD%D8%AF%D9%8A%D8%AB%D8%A9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isAr ? 'تواصل معنا فوراً عبر الواتساب' : 'Contact via WhatsApp'}</span>
                </a>
              </div>
            </section>
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
            className="fixed inset-0 z-[2500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111215] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl overflow-hidden dir-rtl"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 left-4 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }}
                  />
                </div>

                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold inline-block mb-3">
                      {selectedProduct.category || (isAr ? 'منتج معتمد' : 'Certified Product')}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">{selectedProduct.name}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-normal">{selectedProduct.description}</p>
                  </div>

                  <div className="border-t border-zinc-800 pt-4 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-zinc-500 text-xs block">{isAr ? 'السعر الرسمي' : 'Official Price'}</span>
                      <span className="text-2xl font-bold text-white">
                        {selectedProduct.price ? `${selectedProduct.price} د.ل` : (isAr ? 'اتصل للسعر' : 'Call for Price')}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        handleAddToCart(e, selectedProduct)
                        setSelectedProduct(null)
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
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
      whileHover={{ y: -4 }}
      className="group relative bg-[#111215] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.18] transition-all duration-200 shadow-sm flex flex-col h-full cursor-pointer"
    >
      {/* صورة المنتج مع زوم انسيابي */}
      <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden flex items-center justify-center border-b border-zinc-800">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy" 
          decoding="async" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0" 
          onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} 
        />

        {/* شارة التخفيض المميزة */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-600 to-red-600 px-2.5 py-0.5 rounded-full text-[10px] text-white font-bold shadow-md flex items-center gap-1">
            <Flame className="w-3 h-3 text-yellow-200 animate-pulse" />
            <span>{isAr ? `وفر ${(product.price! - product.discountPrice!).toFixed(0)} د.ل` : `Save ${(product.price! - product.discountPrice!).toFixed(0)} LYD`}</span>
          </div>
        )}

        {/* شارة التوفر */}
        {product.stockStatus === 'out_of_stock' ? (
          <div className="absolute top-3 right-3 z-20 bg-rose-950/90 border border-rose-800 px-2.5 py-0.5 rounded-full text-[10px] text-rose-300 font-semibold">
            {isAr ? 'نفذت الكمية ❌' : 'Out of Stock'}
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-20 bg-emerald-950/90 border border-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-300 font-semibold">
            {isAr ? 'متوفر بالمخزن' : 'In Stock'}
          </div>
        )}
      </div>

      {/* تفاصيل المنتج وازرار الشراء */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors duration-200 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">
            {product.description}
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-zinc-500 block">{isAr ? 'السعر' : 'Price'}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-white">
                {hasDiscount ? `${product.discountPrice} د.ل` : (product.price ? `${product.price} د.ل` : (isAr ? 'حسب القياس' : 'On Request'))}
              </span>
              {hasDiscount && (
                <span className="text-xs text-zinc-500 line-through">
                  {product.price} د.ل
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => onAddToCart(e, product)}
            disabled={isAdding}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              isAdding
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>{isAr ? 'تمت الإضافة' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
