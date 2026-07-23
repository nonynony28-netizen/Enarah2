import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { PlayCircle, PackageSearch, Loader2, Image as ImageIcon, ArrowRight, ChevronRight, ChevronLeft, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

// نمط الوهج الأزرق للعناوين الفخمة
const glowingTitleStyle = {
  textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
}

// مكون الأنيميشن السريع
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{ willChange: "opacity, transform" }}
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
  coverImage: string
  video?: string
  category: string
}

const getLocalizedProject = (project: { name: string; category: string; description: string }, isAr: boolean) => {
  if (isAr) return project

  let name = project.name
  let category = project.category
  let description = project.description

  const nameTrim = project.name.trim()
  if (nameTrim === 'مول الماسة') name = 'Al-Masa Mall'
  else if (nameTrim === 'معرض كواترو موتورز') name = 'Quattro Motors Showroom'
  else if (nameTrim === 'مصحة الحياة الطبية') name = 'Al-Hayat Medical Clinic'
  else if (nameTrim === 'قاعة جمانة للمناسبات') name = 'Jumana Events Hall'
  else if (nameTrim === 'panyoti cafe') name = 'Panyoti Cafe'

  const catTrim = project.category.trim()
  if (catTrim === 'مقهي') category = 'Cafe'
  else if (catTrim === 'مول تجاري') category = 'Commercial Mall'
  else if (catTrim === 'معرض سيارات') category = 'Car Showroom'
  else if (catTrim === 'طبي') category = 'Medical'
  else if (catTrim === 'اجتماعي') category = 'Social'

  const descTrim = project.description.trim()
  if (descTrim.includes('الاضاءات الداخلية والخارجية وعمدان الانارة')) {
    description = 'Execution of indoor & outdoor lighting and lighting poles for Al-Masa Mall.'
  } else if (descTrim.includes('توريد كافه الاضاءات والاعمده والسكك')) {
    description = 'Supply of all lighting, poles, and tracks to showcase the showroom in the best way.'
  } else if (descTrim.includes('تنفيذ وتسليم كامل من بريزات والاضاءات')) {
    description = 'Execution and complete handover of outlets, lighting, voltage regulators, and wiring to ensure smooth operation under all conditions.'
  } else if (descTrim.includes('توريد الثريات والإضاءات المختلفة لصالة جمانة')) {
    description = 'Supply of chandeliers and various custom lighting for Jumana Hall to complete your wedding luxury and live the most beautiful moments.'
  } else if (descTrim.includes('تجهيز الثريات والاضاءات في المقهي')) {
    description = 'Supplying chandeliers and custom lighting for the cafe, which all customers agreed was stunning.'
  }

  return { name, category, description }
}

export default function Projects() {
  const { t, isAr } = useLanguage()
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enarah_cached_projects')
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }
    return []
  })
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

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

              const rawImage = mediaData.imageUrl || '/images/default-product.jpg'
              const imageUrls = rawImage.split(',').map((url: string) => url.trim()).filter(Boolean)
              const coverImage = imageUrls[0] || '/images/default-product.jpg'

              const rawName = item.name || 'مشروع مميز'
              const rawCategory = mediaData.category || 'مشاريعنا'
              const rawDesc = mediaData.description || ''

              const localized = getLocalizedProject({ name: rawName, category: rawCategory, description: rawDesc }, isAr)

              return {
                id: item._id || String(index),
                name: localized.name,
                description: localized.description,
                image: rawImage,
                coverImage: coverImage,
                video: mediaData.videoUrl || '',
                category: localized.category,
              }
            })
          
          const loadedProjects = formattedProjects.reverse()
          setProjects(loadedProjects)
          localStorage.setItem('enarah_cached_projects', JSON.stringify(loadedProjects))
        }
      } catch (error) {
        console.error('Fetch Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [isAr])

  // فتح نافذة المعرض
  const openGallery = (project: ProjectItem) => {
    setSelectedProject(project)
    setActiveImageIndex(0)
  }

  // التقليب للصور
  const handleNextImage = (length: number) => {
    setActiveImageIndex((prev) => (prev + 1) % length)
  }

  const handlePrevImage = (length: number) => {
    setActiveImageIndex((prev) => (prev - 1 + length) % length)
  }

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f9731610_1px,transparent_1px),linear-gradient(to_bottom,#f9731610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className={`mb-6 flex ${isAr ? 'justify-start' : 'justify-start'}`}>
            <Link to="/" className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#0f213a] border border-white/10 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-blue-400 font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </FadeIn>

        {/* عنوان الصفحة */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
              {isAr ? 'جزء من' : 'Part of'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_20px_rgba(59,130,246,0.4)]">{isAr ? 'مشاريعنا' : 'Our Projects'}</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl shadow-sm font-medium">
              {isAr 
                ? 'استعرض أبرز المشاريع التجارية والسكينة التي تم توريد وتنفيذ الإنارة والتأسيس الكهربائي لها بالكامل'
                : 'Browse prominent commercial and residential projects fully supplied and executed with our lighting and wiring solutions'
              }
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-6">
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
            </div>
          </div>
        </FadeIn>

        {/* شاشة التحميل */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <p className="text-blue-100 mt-6 font-medium text-lg animate-pulse">{isAr ? 'جاري جلب أحدث المشاريع...' : 'Fetching latest projects...'}</p>
          </motion.div>
        )}

        {/* لا يوجد مشاريع */}
        {!loading && projects.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0f213a] border border-white/5 rounded-[2rem] p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <PackageSearch className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{isAr ? 'لا توجد مشاريع مضافة حالياً' : 'No projects available currently'}</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              {isAr 
                ? 'قم برفع أول مشروع لك من خلال لوحة التحكم الخاصة بك وسيظهر هنا مباشرة.'
                : 'Upload your first project from the admin dashboard and it will appear here immediately.'
              }
            </p>
          </motion.div>
        )}

        {/* شبكة المشاريع */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {projects.map((project, i) => (
              <FadeIn key={project.id} delay={i * 0.1}>
                <div 
                  onClick={() => openGallery(project)}
                  style={{ willChange: "transform, opacity" }} 
                  className={`group relative bg-[#0f213a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 shadow-xl flex flex-col h-full cursor-pointer ${
                    isAr ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0a192f]">
                    <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f213a] via-transparent to-transparent opacity-90 z-10" />
                    
                    {/* شارة التصنيف */}
                    <div className={`absolute top-4 z-20 ${isAr ? 'right-4' : 'left-4'}`}>
                      <span className="px-4 py-1.5 bg-[#0a192f]/80 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        {project.category}
                      </span>
                    </div>

                    {/* شارة الفيديو */}
                    {project.video && (
                      <div className={`absolute top-4 z-20 bg-[#0a192f]/80 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                        isAr ? 'left-4' : 'right-4'
                      }`}>
                        <PlayCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-xs font-bold">{isAr ? 'فيديو' : 'Video'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 relative z-20 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-3 line-clamp-1">{project.name}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">{project.description}</p>
                    </div>

                    <div className={`flex items-center justify-between text-xs text-blue-400 font-bold border-t border-white/5 pt-3 ${
                      isAr ? 'flex-row' : 'flex-row-reverse'
                    }`}>
                      <span>{isAr ? 'عرض تفاصيل المعرض ←' : 'View Gallery Details →'}</span>
                      {project.image.includes(',') && (
                        <span className="px-2 py-0.5 bg-blue-500/10 rounded-md">
                          +{project.image.split(',').length - 1} {isAr ? 'صور' : 'Photos'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      {/* نافذة معرض الصور المنبثقة التفاعلية (Lightbox Gallery) */}
      <AnimatePresence>
        {selectedProject && (() => {
          const imageUrls = selectedProject.image
            .split(',')
            .map((url) => url.trim())
            .filter(Boolean)

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-md overflow-y-auto"
            >
              <div className="absolute inset-0 z-0" onClick={() => setSelectedProject(null)} />
              
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`relative z-10 w-full max-w-5xl bg-[#0d2342]/95 border border-blue-500/25 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] lg:max-h-[85vh] ${
                  isAr ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* زر الإغلاق */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className={`absolute top-5 z-30 p-2.5 bg-white/5 hover:bg-red-500/80 border border-white/10 hover:border-red-500 text-white rounded-full transition-all duration-300 active:scale-95 shadow-md ${
                    isAr ? 'left-5' : 'right-5'
                  }`}
                  aria-label="إغلاق المعرض"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* معرض الصور */}
                <div className="w-full lg:w-2/3 p-5 md:p-8 flex flex-col justify-between bg-black/25">
                  <div className="relative aspect-[4/3] w-full max-h-[45vh] lg:max-h-[50vh] rounded-[1.8rem] overflow-hidden bg-[#0a192f] flex items-center justify-center shadow-inner group/viewer">
                    <motion.img
                      key={activeImageIndex}
                      src={imageUrls[activeImageIndex] || '/images/default-product.jpg'}
                      alt={`${selectedProject.name} image`}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }}
                    />
                    
                    {/* أزرار التنقل */}
                    {imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handlePrevImage(imageUrls.length); }}
                          className={`absolute p-3 bg-black/40 hover:bg-blue-600/80 border border-white/5 text-white rounded-2xl transition-all duration-300 active:scale-90 shadow-md backdrop-blur-sm ${
                            isAr ? 'right-4' : 'left-4'
                          }`}
                        >
                          <ChevronRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleNextImage(imageUrls.length); }}
                          className={`absolute p-3 bg-black/40 hover:bg-blue-600/80 border border-white/5 text-white rounded-2xl transition-all duration-300 active:scale-90 shadow-md backdrop-blur-sm ${
                            isAr ? 'left-4' : 'right-4'
                          }`}
                        >
                          <ChevronLeft className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* الصور المصغرة */}
                  {imageUrls.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto py-3 px-1 mt-4 scrollbar-thin scrollbar-thumb-white/10 justify-center">
                      {imageUrls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                            idx === activeImageIndex
                              ? 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] scale-105'
                              : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                          }`}
                        >
                          <img src={url} alt="thumbnail" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* تفاصيل المشروع */}
                <div className={`w-full lg:w-1/3 p-6 md:p-8 flex flex-col justify-between overflow-y-auto ${
                  isAr ? 'text-right border-t lg:border-t-0 lg:border-l border-white/5' : 'text-left border-t lg:border-t-0 lg:border-r border-white/5'
                }`}>
                  <div className="space-y-6">
                    <div>
                      <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.1)] inline-block mb-3">
                        {selectedProject.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{selectedProject.name}</h2>
                    </div>

                    <div className="h-px bg-white/5 w-full" />

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-400 font-sans">{isAr ? 'عن المشروع:' : 'About the Project:'}</h4>
                      <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap font-medium">{selectedProject.description}</p>
                    </div>
                  </div>

                  <div className="pt-8 space-y-3">
                    {selectedProject.video && (
                      <a
                        href={selectedProject.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-98"
                      >
                        <PlayCircle className="w-5.5 h-5.5" />
                        {isAr ? 'شاهد فيديو المشروع' : 'Watch Project Video'}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
