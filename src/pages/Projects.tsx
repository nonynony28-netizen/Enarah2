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
  // دالة استبعاد الكروت غير المرغوب فيها (الأسلاك والكوابل، مواد التأسيس، مفاتيح وبرايز)
  const isExcludedProject = (item: any) => {
    const name = String(item.name || '').toLowerCase().trim()
    const category = String(item.category || '').toLowerCase().trim()
    const desc = String(item.description || '').toLowerCase().trim()

    return name.includes('أسلاك') || name.includes('اسلاك') || name.includes('كوابل') ||
           name.includes('تأسيس') || name.includes('تاسيس') || name.includes('مفاتيح') || name.includes('برايز') ||
           category.includes('أسلاك') || category.includes('اسلاك') || category.includes('تأسيس') || category.includes('تاسيس') || category.includes('مفاتيح') || category.includes('برايز') ||
           desc.includes('الاسلاك الايطاليه') || desc.includes('مواد التاسيس') || desc.includes('تشكيله كبيره من المفاتيح')
  }

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('enarah_cached_projects')
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
            .filter((item: any) => {
               let mediaData: any = {}
               try { mediaData = item.phone ? JSON.parse(item.phone) : {} } catch {}
               return !isExcludedProject({ name: item.name, category: mediaData.category, description: mediaData.description })
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
      
      {/* شبكة هندسية خفيفة جداً في الخلفية */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className={`mb-6 flex ${isAr ? 'justify-start' : 'justify-start'}`}>
            <Link to="/" className={`inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white font-semibold transition-all ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </FadeIn>

        {/* عنوان الصفحة */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight text-white">
              {isAr ? 'جزء من' : 'Part of'} <span className="text-blue-400">{isAr ? 'مشاريعنا' : 'Our Projects'}</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed text-base md:text-lg mb-6 font-normal">
              {isAr 
                ? 'استعرض أبرز المشاريع التجارية والسكينة التي تم توريد وتنفيذ الإنارة والتأسيس الكهربائي لها بالكامل'
                : 'Browse prominent commercial and residential projects fully supplied and executed with our lighting and wiring solutions'
              }
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-5">
              <div className="w-16 h-[1px] bg-zinc-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <div className="w-16 h-[1px] bg-zinc-800" />
            </div>
          </div>
        </FadeIn>

        {/* شاشة التحميل */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative z-10" />
            <p className="text-zinc-400 mt-5 font-medium text-sm">{isAr ? 'جاري جلب أحدث المشاريع...' : 'Fetching latest projects...'}</p>
          </motion.div>
        )}

        {/* لا يوجد مشاريع */}
        {!loading && projects.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#111215] border border-white/[0.08] rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
              <PackageSearch className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{isAr ? 'لا توجد مشاريع مضافة حالياً' : 'No projects available currently'}</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {isAr 
                ? 'قم برفع أول مشروع لك من خلال لوحة التحكم الخاصة بك وسيظهر هنا مباشرة.'
                : 'Upload your first project from the admin dashboard and it will appear here immediately.'
              }
            </p>
          </motion.div>
        )}

        {/* شبكة المشاريع */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, i) => (
              <FadeIn key={project.id} delay={i * 0.08}>
                <div 
                  onClick={() => openGallery(project)}
                  style={{ willChange: "transform, opacity" }} 
                  className={`group relative bg-[#111215] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.18] transition-all duration-200 shadow-sm flex flex-col h-full cursor-pointer ${
                    isAr ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900 border-b border-zinc-800">
                    <img src={project.coverImage} alt={project.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111215] via-transparent to-transparent opacity-80 z-10" />
                    
                    {/* شارة التصنيف */}
                    <div className={`absolute top-3.5 z-20 ${isAr ? 'right-3.5' : 'left-3.5'}`}>
                      <span className="px-3 py-1 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-md">
                        {project.category}
                      </span>
                    </div>

                    {/* شارة الفيديو */}
                    {project.video && (
                      <div className={`absolute top-3.5 z-20 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                        isAr ? 'left-3.5' : 'right-3.5'
                      }`}>
                        <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-white text-xs font-semibold">{isAr ? 'فيديو' : 'Video'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 relative z-20 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-1">{project.name}</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-4 font-normal">{project.description}</p>
                    </div>

                    <div className={`flex items-center justify-between text-xs text-blue-400 font-semibold border-t border-zinc-800/80 pt-3 ${
                      isAr ? 'flex-row' : 'flex-row-reverse'
                    }`}>
                      <span>{isAr ? 'عرض تفاصيل المعرض ←' : 'View Gallery Details →'}</span>
                      {project.image.includes(',') && (
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md">
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
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto"
            >
              <div className="absolute inset-0 z-0" onClick={() => setSelectedProject(null)} />
              
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`relative z-10 w-full max-w-5xl bg-[#111215] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] lg:max-h-[85vh] ${
                  isAr ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* زر الإغلاق */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className={`absolute top-4 z-30 p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl transition-all duration-200 active:scale-95 shadow-md ${
                    isAr ? 'left-4' : 'right-4'
                  }`}
                  aria-label="إغلاق المعرض"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* معرض الصور */}
                <div className="w-full lg:w-2/3 p-5 md:p-6 flex flex-col justify-between bg-black/30">
                  <div className="relative aspect-[4/3] w-full max-h-[45vh] lg:max-h-[50vh] rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center border border-zinc-850 group/viewer">
                    <motion.img
                      key={activeImageIndex}
                      src={imageUrls[activeImageIndex] || '/images/default-product.jpg'}
                      alt={`${selectedProject.name} image`}
                      initial={{ opacity: 0, scale: 1.01 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }}
                    />
                    
                    {/* أزرار التنقل */}
                    {imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handlePrevImage(imageUrls.length); }}
                          className={`absolute p-2.5 bg-black/60 hover:bg-zinc-800 border border-white/10 text-white rounded-xl transition-all duration-200 active:scale-90 shadow-md backdrop-blur-sm ${
                            isAr ? 'right-3' : 'left-3'
                          }`}
                        >
                          <ChevronRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleNextImage(imageUrls.length); }}
                          className={`absolute p-2.5 bg-black/60 hover:bg-zinc-800 border border-white/10 text-white rounded-xl transition-all duration-200 active:scale-90 shadow-md backdrop-blur-sm ${
                            isAr ? 'left-3' : 'right-3'
                          }`}
                        >
                          <ChevronLeft className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* الصور المصغرة */}
                  {imageUrls.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto py-3 px-1 mt-3 scrollbar-thin scrollbar-thumb-zinc-800 justify-center">
                      {imageUrls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-14 h-11 rounded-lg overflow-hidden border transition-all duration-200 flex-shrink-0 cursor-pointer ${
                            idx === activeImageIndex
                              ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105'
                              : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-700'
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
                  isAr ? 'text-right border-t lg:border-t-0 lg:border-l border-zinc-800' : 'text-left border-t lg:border-t-0 lg:border-r border-zinc-800'
                }`}>
                  <div className="space-y-5">
                    <div>
                      <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-md inline-block mb-3">
                        {selectedProject.category}
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">{selectedProject.name}</h2>
                    </div>

                    <div className="h-px bg-zinc-800 w-full" />

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-zinc-400">{isAr ? 'عن المشروع:' : 'About the Project:'}</h4>
                      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-normal">{selectedProject.description}</p>
                    </div>
                  </div>

                  <div className="pt-6 space-y-3">
                    {selectedProject.video && (
                      <a
                        href={selectedProject.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95"
                      >
                        <PlayCircle className="w-4 h-4" />
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
