import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PlayCircle, PackageSearch, Loader2, Image as ImageIcon } from 'lucide-react'

// مكون الأنيميشن
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

// تعريف نوع المشروع
type ProjectItem = {
  id: string
  name: string
  description: string
  image: string
  video?: string
  category: string
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)

  // جلب المشاريع من لوحة التحكم ديناميكياً
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        const data = await res.json()

        if (res.ok && data.success && Array.isArray(data.data)) {
          const formattedProjects: ProjectItem[] = data.data
            .filter((item: { type?: string }) => item.type !== 'contact')
            .filter((item: { phone?: string }) => {
               // هذا الفلتر يسمح بمرور العناصر التي تم اختيارها كـ "مشروع" فقط
               try {
                 const phoneData = item.phone ? JSON.parse(item.phone) : {}
                 return phoneData.type === 'project'
               } catch {
                 return false
               }
            })
            .map((item: any, index: number) => {
              let mediaData: any = {}
              try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}

              return {
                id: item._id || String(index),
                name: item.name || 'مشروع مميز',
                description: mediaData.description || '',
                image: mediaData.imageUrl || '/images/default-product.jpg',
                video: mediaData.videoUrl || '',
                category: mediaData.category || 'مشاريعنا', // جلب التصنيف أو وضع افتراضي
              }
            })
          
          // عكس المصفوفة لتظهر المشاريع الأحدث أولاً
          setProjects(formattedProjects.reverse())
        } else {
          setProjects([])
        }
      } catch (error) {
        console.error('Fetch Error:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-[#0a192f] min-h-screen relative overflow-hidden">
      {/* الخلفيات المضيئة */}
      <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* عنوان الصفحة */}
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-white via-white to-blue-400 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              جزء من مشاريعنا
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
              نماذج من أعمالنا المتميزة في مختلف القطاعات، تعكس التزامنا بالجودة والاحترافية
            </p>
            <motion.div 
              initial={{ width: 0 }} animate={{ width: "80px" }} transition={{ delay: 0.4, duration: 0.8 }}
              className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mt-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
            />
          </div>
        </FadeIn>

        {/* شاشة التحميل */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            </div>
            <p className="text-blue-100 mt-6 font-medium text-lg animate-pulse">جاري جلب أحدث المشاريع...</p>
          </motion.div>
        )}

        {/* لا يوجد مشاريع */}
        {!loading && projects.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-12 text-center max-w-2xl mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <PackageSearch className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">لا توجد مشاريع مضافة حالياً</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              قم برفع أول مشروع لك من خلال لوحة التحكم الخاصة بك وسيظهر هنا مباشرة.
            </p>
          </motion.div>
        )}

        {/* شبكة المشاريع */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {projects.map((project, i) => (
              <FadeIn key={project.id} delay={i * 0.1}>
                <div className="group relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] overflow-hidden hover:bg-white/[0.04] hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] flex flex-col h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                  
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0d2342]/50">
                    <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-90 z-10" />
                    
                    {/* شارة التصنيف */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-4 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 text-xs font-bold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        {project.category}
                      </span>
                    </div>

                    {/* Badge Video */}
                    {project.video && (
                      <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <PlayCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-xs font-bold">فيديو</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 relative z-20 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-3 line-clamp-1">{project.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-grow line-clamp-3">{project.description}</p>

                    {/* زر مشاهدة الفيديو */}
                    {project.video && (
                      <a href={project.video} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                        <PlayCircle className="w-5 h-5" />
                        شاهد المشروع
                      </a>
                    )}
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

