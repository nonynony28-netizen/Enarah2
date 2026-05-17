import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PlayCircle, PackageSearch, Loader2, Image as ImageIcon } from 'lucide-react'

// تعريف نوع بيانات المنتج
type ProductItem = {
  id: string
  name: string
  description: string
  image: string
  video?: string
}

export default function Products() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  // ======================================
  // المنطق البرمجي (جلب البيانات) - بقي كما هو لضمان عدم حدوث أخطاء
  // ======================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        const data = await res.json()

        if (res.ok && data.success && Array.isArray(data.data)) {
          const formattedProducts: ProductItem[] = data.data
            .filter((item: { type?: string }) => item.type !== 'contact')
            .map((item: { _id?: string; name?: string; email?: string; phone?: string }, index: number) => {
              let mediaData: { imageUrl?: string; videoUrl?: string; description?: string } = {}
              try {
                mediaData = item.phone ? JSON.parse(item.phone) : {}
              } catch {
                mediaData = {}
              }

              return {
                id: item._id || String(index),
                name: item.name || 'بدون اسم',
                description: mediaData.description || (item.email && !item.email.includes('@upload.local') ? item.email : ''),
                image: mediaData.imageUrl || '/images/default-product.jpg',
                video: mediaData.videoUrl || '',
              }
            })
          setProducts(formattedProducts)
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('Fetch Products Error:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // ======================================
  // إعدادات الحركة (Animations) للكروت
  // ======================================
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }, // ظهور الكروت بالتتالي
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    // الخلفية العامة للصفحة مع إضاءات زرقاء ناعمة
    <div className="pt-24 md:pt-32 pb-24 bg-[#0a192f] min-h-screen relative overflow-hidden">
      
      {/* تأثيرات التوهج الخلفي (Glowing Blobs) */}
      <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ======================================
            عنوان الصفحة (Header)
        ====================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-white via-white to-blue-400 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            معرض المنتجات
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
            اكتشف أحدث وأرقى منتجات الإنارة والتأسيس الكهربائي التي اخترناها بعناية لتناسب ذوقك واحتياجاتك
          </p>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mt-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
          />
        </motion.div>

        {/* ======================================
            حالة التحميل (Loading State)
        ====================================== */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            </div>
            <p className="text-blue-100 mt-6 font-medium text-lg animate-pulse">جاري جلب أحدث المنتجات...</p>
          </motion.div>
        )}

        {/* ======================================
            حالة عدم وجود منتجات (Empty State)
        ====================================== */}
        {!loading && products.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-12 text-center max-w-2xl mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          >
            <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <PackageSearch className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">المعرض قيد التحديث</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              نحن نقوم بتحديث المعرض بأحدث المنتجات، يرجى العودة قريباً للاطلاع على تشكيلتنا الجديدة.
            </p>
          </motion.div>
        )}

        {/* ======================================
            شبكة المنتجات (Products Grid)
        ====================================== */}
        {!loading && products.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            {products.map((product) => (
              <motion.div
                variants={itemVariants}
                key={product.id}
                className="group relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)] flex flex-col h-full"
              >
                {/* لمعان داخلي خفيف عند مرور الماوس */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                
                {/* حاوية صورة المنتج */}
                <div className="relative overflow-hidden aspect-[4/3] bg-[#0d2342]/50 flex items-center justify-center">
                  {/* تدرج لوني لدمج الصورة مع الكارت ببراعة */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-80 z-10" />
                  
                  {/* أيقونة افتراضية في حالة عدم تحميل الصورة */}
                  <ImageIcon className="absolute w-12 h-12 text-white/10" />

                  {/* الصورة الأساسية تتكبر ببطء عند التمرير */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0 relative"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-product.jpg'
                    }}
                  />
                  
                  {/* شارة (Badge) تفيد بوجود فيديو للمنتج */}
                  {product.video && (
                    <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                      <PlayCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-xs font-bold">فيديو متاح</span>
                    </div>
                  )}
                </div>

                {/* تفاصيل المنتج */}
                <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20">
                  <h2 className="text-white font-bold text-xl md:text-2xl mb-3 group-hover:text-blue-300 transition-colors duration-300 line-clamp-1">
                    {product.name}
                  </h2>

                  <p className="text-slate-400 text-sm md:text-base leading-relaxed flex-grow line-clamp-3 mb-8">
                    {product.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}
                  </p>

                  {/* زر مشاهدة الفيديو الأنيق */}
                  {product.video && (
                    <a
                      href={product.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    >
                      <PlayCircle className="w-5 h-5" />
                      شاهد فيديو للمنتج
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
