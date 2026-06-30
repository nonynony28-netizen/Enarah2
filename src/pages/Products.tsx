import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PlayCircle, PackageSearch, Loader2, Image as ImageIcon, ArrowRight, ShoppingCart, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useCart } from '../hooks/useCart'

const glowingTitleStyle = {
  textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
}

type ProductItem = {
  id: string
  name: string
  description: string
  image: string
  video?: string
}

export default function Products() {
  const { isAr } = useLanguage()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<ProductItem[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enarah_cached_products')
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }
    return []
  })
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)

  const handleAddToCart = (product: ProductItem) => {
    setAddingId(product.id)
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image
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
               // الفلتر الهجومي القاهر للزوار
               const itemName = String(item.name || '').toLowerCase().trim()
               const itemEmail = String(item.email || '').toLowerCase().trim()

               // سحق أي شيء يمت بصلة للزوار والتحليلات
               if (itemName.includes('visitor') || itemEmail.includes('visitor') || itemEmail.includes('visit_') || itemEmail.includes('analytics.local')) {
                 return false;
               }
               
               // إخفاء أسعار الأسلاك
               if (itemEmail.includes('admin_wire_prices')) return false;

               // إخفاء المشاريع
               try {
                 const phoneData = item.phone ? JSON.parse(item.phone) : {}
                 if (phoneData.type === 'project') return false;
               } catch {
                 // تجاهل الأخطاء
               }
               
               return true; // إذا نجح في الهروب من الفلاتر، فهو منتج
            })
            .map((item: any, index: number) => {
               let mediaData: any = {}
               try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}

               // جلب الوصف حسب لغة المستخدم إذا كان بصيغة JSON، أو عرضه مباشرة
               let descText = mediaData.description || (item.email && !item.email.includes('@upload.local') ? item.email : '')
               try {
                 const descObj = JSON.parse(descText)
                 descText = isAr ? (descObj.ar || descObj.en || descText) : (descObj.en || descObj.ar || descText)
               } catch {
                 // ليس JSON، اتركه كما هو
               }

               // جلب الاسم حسب لغة المستخدم إذا كان بصيغة JSON، أو عرضه مباشرة
               let nameText = item.name || 'بدون اسم'
               try {
                 const nameObj = JSON.parse(nameText)
                 nameText = isAr ? (nameObj.ar || nameObj.en || nameText) : (nameObj.en || nameObj.ar || nameText)
               } catch {
                 // ليس JSON، اتركه كما هو
               }

               return {
                 id: item._id || String(index),
                 name: nameText,
                 description: descText,
                 image: mediaData.imageUrl || '/images/default-product.jpg',
                 video: mediaData.videoUrl || '',
               }
            })
          
          const loadedProducts = formattedProducts.reverse()
          setProducts(loadedProducts)
          localStorage.setItem('enarah_cached_products', JSON.stringify(loadedProducts))
        }
      } catch (error) {
        console.error('Fetch Products Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [isAr])

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

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <p className="text-blue-100 mt-6 font-medium text-lg animate-pulse">
              {isAr ? 'جاري جلب أحدث المنتجات...' : 'Fetching latest products...'}
            </p>
          </motion.div>
        )}

        {!loading && products.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0f213a] border border-white/5 rounded-[2rem] p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <PackageSearch className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {isAr ? 'المعرض قيد التحديث' : 'Gallery Under Update'}
            </h3>
            <p className="text-slate-400 text-base leading-relaxed">
              {isAr
                ? 'نحن نقوم بتحديث المعرض بأحدث المنتجات، يرجى العودة قريباً للاطلاع على تشكيلتنا الجديدة.'
                : 'We are currently updating our gallery with the newest products. Please check back soon to view our new collection.'
              }
            </p>
          </motion.div>
        )}

        {!loading && products.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {products.map((product) => (
              <motion.div variants={itemVariants} key={product.id} style={{ willChange: "transform, opacity" }} className="group relative bg-[#0f213a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 shadow-xl flex flex-col h-full">
                <div className="relative overflow-hidden aspect-[4/3] bg-[#0a192f] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f213a] via-transparent to-transparent opacity-80 z-10" />
                  <ImageIcon className="absolute w-12 h-12 text-white/5" />
                  <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0 relative" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
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
                  <h2 className="text-white font-bold text-xl md:text-2xl mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">{product.name}</h2>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed flex-grow line-clamp-3 mb-8">
                    {product.description || (isAr ? 'لا يوجد وصف متاح لهذا المنتج حالياً.' : 'No description available for this product currently.')}
                  </p>
                  <div className="mt-auto space-y-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product.id}
                      className={`w-full py-3.5 border transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 rounded-xl shadow-sm cursor-pointer ${
                        addingId === product.id
                          ? 'bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                          : 'bg-blue-600/10 hover:bg-blue-600 border-blue-500/30 hover:border-blue-400 text-blue-400 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={addingId === product.id ? 'added' : 'add'}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          {addingId === product.id ? (
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
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
