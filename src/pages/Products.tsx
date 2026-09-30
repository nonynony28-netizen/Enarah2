import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, X, ShoppingCart, Check, Image as ImageIcon, 
  ArrowRight, Layers, Zap, Eye, Video, 
  ChevronLeft, SlidersHorizontal, Package, Star,
  Flame, Tag, BadgePercent, Sparkles, ArrowLeft, MessageCircle, CheckCircle2, ShieldCheck
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
    descriptionAr: 'الأسلاك الإيطالية والأوروبية الأصلية 100% بنحاس نقي لجميع مشاريع التأسيس.',
    descriptionEn: 'Certified 100% pure copper Italian and Turkish wires and cables.',
    icon: Zap,
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp'
  },
  {
    id: 'cat-discounts',
    nameAr: 'التخفيضات والعروض الخاصة',
    nameEn: 'Special Offers & Discounts',
    descriptionAr: 'عروض حصرية وخصومات دورية على تشكيلات مختارة من الثريات، الإنارة المعمارية، والمفاتيح الكهربائية.',
    descriptionEn: 'Curated seasonal promotions and exclusive discounts on chandeliers, architectural lighting, and smart fixtures.',
    icon: BadgePercent,
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp'
  }
]

// 🛒 منتجات الأسلاك (الأسلاك والكوابل الإيطالية)
const defaultFallbackProducts: ProductItem[] = [
  // 🔌 مقاسات الأسلاك والكوابل الإيطالية
  {
    id: 'wire-size-15',
    name: 'سلك كهربائي إيطالي 1.5 مم (لفة 100 متر)',
    description: 'نحاس صافي 100% عالي النقاء مستورد مباشرة من إيطاليا، مناسب للإنارة والإضاءة العامة.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 245,
    stockStatus: 'available',
    stockQty: 150,
    category: 'الأسلاك والكوابل الإيطالية والتركية'
  },
  {
    id: 'wire-size-25',
    name: 'سلك كهربائي إيطالي 2.5 مم (لفة 100 متر)',
    description: 'نحاس صافي 100% عازل للحرارة والكهرباء، مخصص للتأسيس المنزلي والأحمال المتوسطة والبرايز.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 375,
    stockStatus: 'available',
    stockQty: 200,
    category: 'الأسلاك والكوابل الإيطالية والتركية'
  },
  {
    id: 'wire-size-40',
    name: 'سلك كهربائي إيطالي 4.0 مم (لفة 100 متر)',
    description: 'نحاس إيطالي صافي 100%، مخصص للمكيفات والأجهزة الكبيرة والأحمال الثقيلة.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 585,
    stockStatus: 'available',
    stockQty: 100,
    category: 'الأسلاك والكوابل الإيطالية والتركية'
  },
  {
    id: 'wire-size-60',
    name: 'سلك كهربائي إيطالي 6.0 مم (لفة 100 متر)',
    description: 'سلك نحاسي إيطالي فائق القوة للخطوط المغذية الرئيسية والفرعية والأحمال العالية.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 845,
    stockStatus: 'available',
    stockQty: 80,
    category: 'الأسلاك والكوابل الإيطالية والتركية'
  },
  {
    id: 'wire-size-100',
    name: 'سلك كهربائي إيطالي 10.0 مم (لفة 100 متر)',
    description: 'موصلات نحاسية إيطالية صافية 100% للوحات التوزيع والعدادات الرئيسية.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 1350,
    stockStatus: 'available',
    stockQty: 40,
    category: 'الأسلاك والكوابل الإيطالية والتركية'
  },
  {
    id: 'wire-size-160',
    name: 'سلك كهربائي إيطالي 16.0 مم (لفة 100 متر)',
    description: 'أسلاك إيطالية ثقيلة فائقة النقاء عازلة للضغط العالي مخصصة للتأسيس الصناعي والمباني الضخمة.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 1980,
    stockStatus: 'available',
    stockQty: 25,
    category: 'الأسلاك والكوابل الإيطالية والتركية'
  },
  {
    id: 'wire-size-250',
    name: 'سلك كهربائي إيطالي 25.0 مم (لفة 100 متر)',
    description: 'أسلاك نحاسية إيطالية فائقة النقاء للأحمال والمصانع والعدادات الرئيسية الضخمة.',
    image: 'https://i.postimg.cc/jjWyzRBs/IMG-3393.webp',
    price: 2950,
    stockStatus: 'available',
    stockQty: 20,
    category: 'الأسلاك والكوابل الإيطالية والتركية'
  }
]


// 🏷️ المنتجات المعروضة بسعر مخفض (التخفيضات والعروض الخاصة)
const defaultFallbackDiscounts: ProductItem[] = [
  {
    id: 'discount-chandelier-ring',
    name: 'ثريا مودرن ليد فاخرة (تصميم حلقي ذهبي معلق)',
    description: 'ثريا معمارية عصرية بإضاءة ثلاثية الألوان (دافئ / شمسي / أبيض) مع تحكم ذكي بالريموت وتوفير فائق للطاقة.',
    image: '/images/product-chandeliers.jpg',
    price: 720,
    discountPrice: 540,
    stockStatus: 'available',
    stockQty: 15,
    category: 'التخفيضات والعروض الخاصة'
  },
  {
    id: 'discount-spotlight-pack',
    name: 'طقم سبوت لايت ليد غاطس مانع للوهج Anti-Glare (10 حبات)',
    description: 'سبوتات ألمنيوم عالية الجودة بتقنية منع الوهج، إضاءة نقية 3000K CRI>90 موفرة للكهرباء ومريحة للعين.',
    image: '/images/product-spotlights.png',
    price: 350,
    discountPrice: 280,
    stockStatus: 'available',
    stockQty: 40,
    category: 'التخفيضات والعروض الخاصة'
  },
  {
    id: 'discount-magnetic-track',
    name: 'مسار ماجنتيك مغناطيسي متكامل Magnetic Track (3 متر مع المحول)',
    description: 'نظام المسار المغناطيسي الحديث كامل مع كشافات خطية ومحول عالي الكفاءة، جاهز للتركيب السكني والتجاري.',
    image: '/images/product-led-profile.jpg',
    price: 890,
    discountPrice: 695,
    stockStatus: 'available',
    stockQty: 12,
    category: 'التخفيضات والعروض الخاصة'
  },
  {
    id: 'discount-switches-pack',
    name: 'باك مفاتيح وبرايز إيطالية فاخرة من Geros / Legrand (15 قطعة)',
    description: 'تشكيلة مفاتيح وبرايز عصرية مقاومة للحرارة والخدش، بتصميم مسطح Slim أنيق ولمسة نهائية فاخرة.',
    image: '/images/product-sockets-switches.jpg',
    price: 420,
    discountPrice: 315,
    stockStatus: 'available',
    stockQty: 25,
    category: 'التخفيضات والعروض الخاصة'
  },
  {
    id: 'discount-wall-light',
    name: 'كشاف جداري ديكوري خارجي Up & Down مقاوم للعوامل الجوية IP65',
    description: 'إنارة جدارية عصرية للواجهات والممرات مصنعة من الألمنيوم المصبوب المقاوم للصدأ بتوزيع إضاءة مزدوج راقي.',
    image: '/images/product-wall-lights.png',
    price: 185,
    discountPrice: 135,
    stockStatus: 'available',
    stockQty: 30,
    category: 'التخفيضات والعروض الخاصة'
  },
  {
    id: 'discount-led-strip-bundle',
    name: 'باقة شريط ليد COB فائق النعومة (بكرة 10 متر مع محول ذكي)',
    description: 'شريط ليد بدون نقاط نقطية Dotless بإضاءة دافئة ناعمة 3000K مع محول فائق النحافة مناسب للجبس بورد والمطابخ.',
    image: '/images/product-electrical-foundation.jpg',
    price: 260,
    discountPrice: 195,
    stockStatus: 'available',
    stockQty: 20,
    category: 'التخفيضات والعروض الخاصة'
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
    const desc = String(item.description || '').toLowerCase().trim()
    const id = String(item.id || '').toLowerCase().trim()

    // استبعاد قطعي لأي سجلات إدارية، نظام ألعاب، بريد إلكتروني، أو تحديثات نظام
    if (
      name.includes('game') || name.includes('reward') || name.includes('update') ||
      desc.includes('admin_') || desc.includes('@app.local') || desc.includes('upload.local') ||
      desc.includes('@') || name.includes('visitor') || desc.includes('visitor') ||
      id.includes('game') || id.includes('admin') || name.includes('wire prices')
    ) {
      return false
    }

    // استبعاد المشاريع والمباني التجارية التي قد تأتي من قاعدة البيانات
    if (
      name.includes('cafe') || name.includes('مول') || name.includes('قاعة') ||
      name.includes('مصحة') || name.includes('معرض كواترو') || name.includes('panyoti')
    ) {
      return false
    }

    // إذا كان المنتج ضمن التخفيضات والعروض
    if (cat.includes('تخفيض') || cat.includes('discount') || cat.includes('عرض') || (Boolean(item.discountPrice) && (item.discountPrice ?? 0) > 0)) {
      return true
    }

    // استبعاد صريح لأي سبوت لايت، ثريات، مفاتيح، برايز، انترفون، سكك ليد غير مخفضة من متجر الأسلاك
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
           name.includes('سلك') || name.includes('أسلاك') || name.includes('كابل') || name.includes('wire')
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
            .filter((item: any) => item.type !== 'contact' && item.type !== 'hero_video' && item.type !== 'secondary_video')
            .filter((item: any) => {
              const itemName = String(item.name || '').toLowerCase().trim()
              const itemEmail = String(item.email || '').toLowerCase().trim()

              // استبعاد سجلات الألعاب والجوائز والتحديثات الإدارية والمشاريع
              if (
                itemEmail.includes('admin_') || itemEmail.includes('game') || itemEmail.includes('@app.local') ||
                itemName.includes('game') || itemName.includes('reward') || itemName.includes('update') ||
                itemEmail.includes('admin_wire_prices') || itemName.includes('wire prices') ||
                itemEmail.includes('visitor') || itemEmail.includes('visit_') || itemEmail.includes('analytics.local') ||
                itemEmail.includes('hero_video') || itemEmail.includes('video') || itemName.includes('فيديو') ||
                itemName.includes('panyoti') || itemName.includes('مول') || itemName.includes('قاعة') || itemName.includes('مصحة')
              ) {
                return false
              }

              try {
                const phoneData = item.phone ? JSON.parse(item.phone) : {}
                if (phoneData.type === 'project' || phoneData.type === 'hero_video' || phoneData.type === 'video' || phoneData.type === 'game') return false
              } catch {}

              return true
            })
            .map((item: any, index: number) => {
              let mediaData: any = {}
              try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}

              let descText = mediaData.description || ''
              try {
                const descObj = JSON.parse(descText)
                descText = isAr ? (descObj.ar || descObj.en || descText) : (descObj.en || descObj.ar || descText)
              } catch {}

              let nameText = item.name || 'سلك كهربائي إيطالي'
              try {
                const nameObj = JSON.parse(nameText)
                nameText = isAr ? (nameObj.ar || nameObj.en || nameText) : (nameObj.en || nameObj.ar || nameText)
              } catch {}

              nameText = nameText
                .replace(/إيطالي\s*\/\s*تركي/gi, 'إيطالي')
                .replace(/ايطالي\s*\/\s*تركي/gi, 'إيطالي')
                .replace(/كابل\s*\/\s*سلك/gi, 'سلك')
                .replace(/كوابل/gi, 'أسلاك')
              descText = descText
                .replace(/إيطالي\s*\/\s*تركي/gi, 'إيطالي')
                .replace(/ايطالي\s*\/\s*تركي/gi, 'إيطالي')
                .replace(/كابل\s*\/\s*سلك/gi, 'سلك')
                .replace(/كوابل/gi, 'أسلاك')

              const isDiscount = mediaData.category === 'التخفيضات والعروض الخاصة' || 
                (mediaData.category && mediaData.category.includes('تخفيض')) ||
                (Boolean(mediaData.discountPrice) && Number(mediaData.discountPrice) > 0 && Number(mediaData.discountPrice) < Number(mediaData.price))

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
                category: isDiscount ? 'التخفيضات والعروض الخاصة' : 'الأسلاك والكوابل الإيطالية والتركية'
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
    const finalPrice = (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : (product.price || 0)
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: finalPrice,
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

  // 4. تجميع المنتجات حسب الأقسام (خانة التخفيضات فارغة حالياً)
  const categoryGroups = useMemo(() => {
    return CATEGORIES_LIST.map(cat => {
      let items: ProductItem[] = []
      if (cat.id === 'cat-discounts') {
        items = products.filter(p => p.category === 'التخفيضات والعروض الخاصة' || p.category === 'التخفيضات والعروض الحصرية' || (Boolean(p.discountPrice) && (p.discountPrice ?? 0) > 0))
        if (items.length === 0) {
          items = defaultFallbackDiscounts
        }
      } else {
        items = products.filter(p => p.category !== 'التخفيضات والعروض الخاصة' && p.category !== 'التخفيضات والعروض الحصرية' && (!p.discountPrice || p.discountPrice <= 0))
        if (items.length === 0) {
          items = defaultFallbackProducts
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
    <div className="pt-24 md:pt-32 pb-36 bg-[#F7F8FA] min-h-screen relative overflow-hidden text-[#15191E] font-sans antialiased selection:bg-[#0062D2] selection:text-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* زر العودة */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#68717D] hover:text-[#0062D2] transition-colors">
            <ArrowRight className={`w-3.5 h-3.5 ${isAr ? '' : 'rotate-180'}`} />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </motion.div>

        {/* عنوان المعرض التحريري المعماري */}
        <div className="mb-12 max-w-3xl">
          <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3">
            LIGHTING & ELECTRICAL SOLUTIONS
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#15191E] tracking-tight leading-[1.12] mb-5">
            {isAr ? 'حلول الإضاءة والأنظمة المعتمدة' : 'Certified Lighting & Electrical Systems'}
          </h1>
          <p className="text-base sm:text-lg text-[#68717D] font-normal leading-relaxed">
            {isAr 
              ? 'تصفح قائمة الأسلاك النحاسية، الكوابل، والتخفيضات الحصرية المطابقة لأعلى المواصفات القياسية الأوروبية.'
              : 'Explore certified pure copper wires, cables, and curated promotional architectural lighting.'}
          </p>
        </div>

        {/* 🔍 1. خانة البحث الفوري الاحترافية */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className={`absolute ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-slate-400 pointer-events-none`} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث عن مقاس السلك (مثال: 1.5 مم، 2.5 مم، 4 مم...)" : "Search wire size (e.g. 1.5mm, 2.5mm, 4mm...)"}
              className={`w-full ${isAr ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] focus:shadow-[0_12px_36px_rgba(37,99,235,0.1)] transition-all text-sm font-medium`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className={`absolute ${isAr ? 'left-4' : 'right-4'} p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 transition-all`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery.trim() !== '' && (
            <div className="mt-3 flex items-center justify-between px-2 text-xs text-slate-500 font-semibold">
              <span>{isAr ? `نتائج البحث عن: "${searchQuery}"` : `Search results for: "${searchQuery}"`}</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                {isAr ? `${searchedProducts.length} عنصر متطابق` : `${searchedProducts.length} matches found`}
              </span>
            </div>
          )}
        </motion.div>

        {/* 🗂️ 2. شريط التنقل السريع بين الأقسام الفعالة */}
        {searchQuery.trim() === '' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex justify-center">
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-x-auto max-w-full">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>{isAr ? 'جميع الأقسام' : 'All Categories'}</span>
              </button>

              {CATEGORIES_LIST.map((cat) => {
                const catName = isAr ? cat.nameAr : cat.nameEn
                const isSelected = selectedCategory === catName || selectedCategory === cat.id
                const IconComponent = cat.icon
                const isDiscountCat = cat.id === 'cat-discounts'
                const catItemsCount = categoryGroups.find(c => c.id === cat.id)?.items.length || 0

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(catName)}
                    className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm' // isDiscountCat


                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : isDiscountCat ? 'text-rose-500' : 'text-blue-600'}`} />
                    <span>{catName}</span>
                    {catItemsCount > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {catItemsCount}
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
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isAr ? 'لم نجد نتائج مطابقة للبحث' : 'No matching results found'}
                </h3>
                <p className="text-slate-500 text-xs mb-6">
                  {isAr ? 'جرب البحث باسم المقاس أو كلمة "باقة" أو "سلك"' : 'Try searching by wire size or "bundle"'}
                </p>
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all"
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
                  
                  {/* رأس قسم المتجر بتصميم راقٍ */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200/80">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                        isDiscountCat 
                          ? 'bg-rose-50 border border-rose-200/80 text-rose-600'
                          : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg shadow-blue-600/20 ring-4 ring-blue-50/80'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${isDiscountCat ? 'text-rose-600' : 'text-amber-300 fill-amber-300'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{catName}</h2>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 shadow-sm ${
                            isDiscountCat
                              ? 'bg-rose-50 border-rose-200/80 text-rose-700'
                              : 'bg-blue-50/90 border-blue-200/90 text-blue-700'
                          }`}>
                            {isDiscountCat ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                <span>{isAr ? `${catGroup.items.length} أصناف مخفضة` : `${catGroup.items.length} Discounted Items`}</span>
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                <span>{isAr ? `${catGroup.items.length} صنف` : `${catGroup.items.length} items`}</span>
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-normal leading-relaxed max-w-2xl">{catDesc}</p>
                      </div>
                    </div>

                    {isDiscountCat ? (
                      <a 
                        href="https://wa.me/218915079140?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A7%D9%84%D8%AA%D8%AE%D9%81%D9%8A%D8%B6%D8%A7%D8%AA%20%D9%88%D8%A7%D9%84%D8%B9%D8%B1%D9%88%D8%B6%20%D8%A7%D9%84%D8%AD%D8%A7%D9%84%D9%8A%D8%A9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all self-start md:self-auto cursor-pointer shadow-sm group"
                      >
                        <BadgePercent className="w-3.5 h-3.5 text-rose-400" />
                        <span>{isAr ? 'الاستفسار عن عروض المعرض ←' : 'Inquire Showroom Offers ←'}</span>
                      </a>
                    ) : (
                      <Link 
                        to="/wire-prices"
                        className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-all duration-300 self-start md:self-auto shadow-md shadow-slate-900/10 hover:shadow-blue-600/20 active:scale-95 group cursor-pointer"
                      >
                        <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                        <span>{isAr ? 'عرض جدول أسعار الأسلاك المحدث ←' : 'Live Wire Prices Table ←'}</span>
                      </Link>
                    )}
                  </div>

                  {/* بنر عروض ترويجي مميز في أعلى قسم التخفيضات */}
                  {isDiscountCat && (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-7 border border-slate-800 shadow-xl mb-8 text-right">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-300 text-xs font-semibold mb-2.5 backdrop-blur-sm">
                            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                            <span>{isAr ? 'عروض حصرية بأسعار مخفضة لفترة محدودة' : 'Limited-Time Curated Promotional Deals'}</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
                            {isAr ? 'قائمة المنتجات المعروضة بسعر مخفض' : 'Featured Discounted Products & Fixtures'}
                          </h3>
                          <p className="text-slate-300 text-xs sm:text-sm font-normal max-w-2xl leading-relaxed">
                            {isAr 
                              ? 'استفد من التخفيضات الفورية على تشكيلات مختارة من الثريات، الإنارة المعمارية، والمفاتيح الأوروبية بضمان كامل.' 
                              : 'Take advantage of instant discounts on selected chandeliers, architectural fixtures, and certified accessories.'}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-3">
                          <a 
                            href="https://wa.me/218915079140?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA%20%D8%A7%D9%84%D9%85%D8%AE%D9%81%D8%B6%D8%A9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-950/30 active:scale-95 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'طلب التخفيض عبر واتساب' : 'Inquire via WhatsApp'}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* شبكة البطاقات */}
                  {catGroup.items.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                      <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-600">{isAr ? 'لا توجد منتجات مخفضة حالياً' : 'No discounted items currently'}</p>
                    </div>
                  ) : (
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
                  )}
                </section>
              )
            })}

            {/* بنر الاستفسارات والطلبات الخاصة عبر الواتساب */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="relative rounded-2xl bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-sm">
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold inline-block mb-2">
                    {isAr ? '💬 طلبيات واستشارات خاصة' : 'Custom Inquiries'}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
                    {isAr ? 'هل تبحث عن منتج محدد أو إنارة خاصة لمشروعك الآن؟' : 'Looking for a specific item or project lighting?'}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm font-normal">
                    {isAr 
                      ? 'فريقنا الهندسي في معرض بنغازي جاهز لتوفير كافة طلبات التأسيس والإنارة الخاصة مباشرة.'
                      : 'Our engineering team in Benghazi is ready to supply custom electrical and lighting orders.'}
                  </p>
                </div>

                <a 
                  href="https://wa.me/218915079140?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B7%D9%84%D8%A8%D9%8A%D8%A9%20%D8%AE%D8%A7%D8%B3%D8%A9%20%D9%85%D9%86%20%D9%85%D8%AA%D8%AC%D8%B1%20%D8%A7%D9%84%D8%A5%D9%86%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AD%D8%AF%D9%8A%D8%AB%D8%A9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isAr ? 'تواصل معنا فوراً عبر الواتساب' : 'Contact via WhatsApp'}</span>
                </a>
              </div>
            </div>
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
            className="fixed inset-0 z-[2500] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl overflow-hidden dir-rtl"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/images/product-chandeliers.jpg' }}
                  />
                </div>

                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold inline-block mb-3">
                      {selectedProduct.category || (isAr ? 'منتج أصلي' : 'Genuine Product')}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedProduct.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">{selectedProduct.description}</p>
                  </div>

                  <div className="border-t border-slate-200 pt-4 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-xs block">{isAr ? 'السعر الرسمي' : 'Official Price'}</span>
                      {selectedProduct.discountPrice && selectedProduct.price && selectedProduct.discountPrice < selectedProduct.price ? (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-extrabold text-rose-600">
                              {selectedProduct.discountPrice} د.ل
                            </span>
                            <span className="text-sm text-slate-400 line-through">
                              {selectedProduct.price} د.ل
                            </span>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md self-start mt-1">
                            {isAr 
                              ? `توفير ${Math.round(selectedProduct.price - selectedProduct.discountPrice)} د.ل (${Math.round(((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100)}% خصم)` 
                              : `Save ${Math.round(selectedProduct.price - selectedProduct.discountPrice)} LYD`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-slate-900">
                          {selectedProduct.price ? `${selectedProduct.price} د.ل` : (isAr ? 'اتصل للسعر' : 'Call for Price')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        handleAddToCart(e, selectedProduct)
                        setSelectedProduct(null)
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md shadow-blue-500/20"
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
  const hasDiscount = Boolean(product.discountPrice && product.price && product.discountPrice < product.price)
  const discountPercent = hasDiscount ? Math.round((((product.price || 0) - (product.discountPrice || 0)) / (product.price || 1)) * 100) : 0
  const savingsAmount = hasDiscount ? Math.round((product.price || 0) - (product.discountPrice || 0)) : 0

  return (
    <motion.div 
      onClick={onOpenModal}
      whileHover={{ y: -4 }}
      className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-200 shadow-sm flex flex-col h-full cursor-pointer text-right"
    >
      {/* صورة المنتج مع زوم انسيابي */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center border-b border-slate-100">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy" 
          decoding="async" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0" 
          onError={(e) => { e.currentTarget.src = '/images/product-chandeliers.jpg' }} 
        />

        {/* شارة نسبة الخصم الفخمة */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-900/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
            <BadgePercent className="w-3 h-3" />
            <span>{isAr ? `خصم ${discountPercent}%` : `-${discountPercent}%`}</span>
          </div>
        )}

        {/* شارة التوفر */}
        {product.stockStatus === 'out_of_stock' ? (
          <div className="absolute top-3 right-3 z-20 bg-rose-50/95 backdrop-blur-md border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] text-rose-600 font-semibold shadow-sm">
            {isAr ? 'نفذت الكمية ❌' : 'Out of Stock'}
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-md border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-700 font-bold shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isAr ? 'متوفر بالمخزن' : 'In Stock'}</span>
          </div>
        )}
      </div>

      {/* تفاصيل المنتج وازرار الشراء */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">
            {product.description}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 block">{isAr ? 'السعر' : 'Price'}</span>
            {hasDiscount ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-extrabold text-rose-600">
                    {product.discountPrice} د.ل
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {product.price} د.ل
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded self-start mt-0.5">
                  {isAr ? `وفّر ${savingsAmount} د.ل` : `Save ${savingsAmount} LYD`}
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {product.price ? `${product.price} د.ل` : (isAr ? 'حسب القياس' : 'On Request')}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={(e) => onAddToCart(e, product)}
            disabled={isAdding}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              isAdding
                ? 'bg-emerald-600 text-white'
                : hasDiscount
                ? 'bg-rose-600 hover:bg-rose-700 text-white active:scale-95 shadow-sm shadow-rose-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-sm shadow-blue-500/20'
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
