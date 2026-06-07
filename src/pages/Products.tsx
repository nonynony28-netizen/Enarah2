import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PlayCircle, PackageSearch, Loader2, Image as ImageIcon, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

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
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

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

              return {
                id: item._id || String(index),
                name: item.name || 'بدون اسم',
                description: mediaData.description || (item.email && !item.email.includes('@upload.local') ? item.email : ''),
                image: mediaData.imageUrl || '/images/default-product.jpg',
                video: mediaData.videoUrl || '',
              }
            })
          
          setProducts(formattedProducts.reverse())
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
            <ArrowRight className="w-5 h-5" /> العودة للرئيسية
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight" style={glowingTitleStyle}>معرض المنتجات</h1>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl shadow-sm">اكتشف أحدث وأرقى منتجات الإنارة والتأسيس الكهربائي التي اخترناها بعناية لتناسب ذوقك واحتياجاتك</p>
          <motion.div initial={{ width: 0 }} animate={{ width: "80px" }} transition={{ delay: 0.4, duration: 0.8 }} className="h-1.5 bg-blue-500 mx-auto rounded-full mt-6 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
        </motion.div>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <p className="text-blue-100 mt-6 font-medium text-lg animate-pulse">جاري جلب أحدث المنتجات...</p>
          </motion.div>
        )}

        {!loading && products.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0f213a] border border-white/5 rounded-[2rem] p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <PackageSearch className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">المعرض قيد التحديث</h3>
            <p className="text-slate-400 text-base leading-relaxed">نحن نقوم بتحديث المعرض بأحدث المنتجات، يرجى العودة قريباً للاطلاع على تشكيلتنا الجديدة.</p>
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
                      <span className="text-blue-200 text-xs font-bold">فيديو متاح</span>
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20">
                  <h2 className="text-white font-bold text-xl md:text-2xl mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">{product.name}</h2>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed flex-grow line-clamp-3 mb-8">{product.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}</p>
                  {product.video && (
                    <a href={product.video} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all duration-300 font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      <PlayCircle className="w-5 h-5" /> شاهد فيديو للمنتج
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
