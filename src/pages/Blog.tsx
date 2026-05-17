import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { BookOpen, Loader2, ArrowLeft } from 'lucide-react'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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

type BlogItem = {
  id: string
  title: string
  content: string
  image: string
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        const data = await res.json()

        if (res.ok && data.success && Array.isArray(data.data)) {
          const blogPosts = data.data
            .filter((item: any) => item.type !== 'contact')
            .filter((item: any) => {
               try {
                 const phoneData = item.phone ? JSON.parse(item.phone) : {}
                 return phoneData.type === 'blog' // فلترة المقالات فقط
               } catch { return false }
            })
            .map((item: any, index: number) => {
              let mediaData: any = {}
              try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}
              return {
                id: item._id || String(index),
                title: item.name || 'مقال جديد',
                content: mediaData.description || '',
                image: mediaData.imageUrl || '/images/default-product.jpg',
              }
            })
          setPosts(blogPosts.reverse())
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-[#0a192f] min-h-screen relative overflow-hidden">
      <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-white via-white to-blue-400 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              مدونة الإنارة
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
              نصائح هندسية، أفكار تصميمية، وأحدث صيحات عالم الإضاءة لنجعل مساحتك أكثر إشراقاً
            </p>
            <motion.div initial={{ width: 0 }} animate={{ width: "80px" }} transition={{ delay: 0.4, duration: 0.8 }} className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mt-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </div>
        </FadeIn>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            <p className="text-blue-100 mt-4 animate-pulse">جاري تحميل المقالات...</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-12 text-center max-w-2xl mx-auto shadow-lg">
            <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-3">لا توجد مقالات حالياً</h3>
            <p className="text-slate-400 text-base">سيتم إضافة مقالات هندسية قريباً، يرجى العودة لاحقاً.</p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <FadeIn key={post.id} delay={i * 0.1}>
                <div className="group relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] overflow-hidden hover:bg-white/[0.04] hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col h-full">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent opacity-90" />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">مقال جديد</div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex-grow flex flex-col relative z-20">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed flex-grow line-clamp-3 mb-6">{post.content}</p>
                    <button className="mt-auto inline-flex items-center gap-2 text-blue-400 font-bold group-hover:text-blue-300 transition-colors">
                      اقرأ المزيد <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
