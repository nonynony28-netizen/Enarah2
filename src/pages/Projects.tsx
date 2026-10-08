import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlayCircle,
  PackageSearch,
  Loader2,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import type { ProjectItem } from '../data/projectsData'
import {
  getLocalizedProject,
  INITIAL_PROJECTS,
  getOptimizedProjectImages,
  getOptimizedProjectImageUrl
} from '../data/projectsData'

export default function Projects() {
  const { isAr } = useLanguage()

  // دالة استبعاد الكروت غير المرغوب فيها (الأسلاك والكوابل، مواد التأسيس، مفاتيح وبرايز)
  const isExcludedProject = (item: any) => {
    const name = String(item.name || '').toLowerCase().trim()
    const category = String(item.category || '').toLowerCase().trim()
    const desc = String(item.description || '').toLowerCase().trim()

    return (
      name.includes('أسلاك') ||
      name.includes('اسلاك') ||
      name.includes('كوابل') ||
      name.includes('تأسيس') ||
      name.includes('تاسيس') ||
      name.includes('مفاتيح') ||
      name.includes('برايز') ||
      category.includes('أسلاك') ||
      category.includes('اسلاك') ||
      category.includes('تأسيس') ||
      category.includes('تاسيس') ||
      category.includes('مفاتيح') ||
      category.includes('برايز') ||
      desc.includes('الاسلاك الايطاليه') ||
      desc.includes('مواد التاسيس') ||
      desc.includes('تشكيله كبيره من المفاتيح')
    )
  }

  // تهيئة فورية بالمشاريع الأساسية المدمجة
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    return INITIAL_PROJECTS.map((p) => {
      const localized = getLocalizedProject(p, isAr)
      return {
        ...p,
        name: localized.name,
        category: localized.category,
        description: localized.description
      }
    })
  })
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // جلب المشاريع من لوحة التحكم ديناميكياً مع المزامنة الذكية
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        const data = await res.json()

        if (res.ok && data.success && Array.isArray(data.data)) {
          const formattedProjects: ProjectItem[] = data.data
            .filter((item: { type?: string }) => item.type !== 'contact')
            .filter((item: any) => {
              try {
                const phoneData = item.rawPhone ? JSON.parse(item.rawPhone) : (item.phone ? JSON.parse(item.phone) : {})
                return phoneData.type === 'project'
              } catch {
                return false
              }
            })
            .filter((item: any) => {
              let mediaData: any = {}
              try {
                mediaData = item.rawPhone ? JSON.parse(item.rawPhone) : (item.phone ? JSON.parse(item.phone) : {})
              } catch {}
              return !isExcludedProject({
                name: item.name,
                category: mediaData.category,
                description: mediaData.description
              })
            })
            .map((item: any, index: number) => {
              let mediaData: any = {}
              try {
                mediaData = item.rawPhone ? JSON.parse(item.rawPhone) : (item.phone ? JSON.parse(item.phone) : {})
              } catch {}

              const rawImage = getOptimizedProjectImages(
                mediaData.imageUrl || '/images/default-product.jpg'
              )
              const imageUrls = rawImage
                .split(',')
                .map((url: string) => url.trim())
                .filter(Boolean)
              const coverImage = getOptimizedProjectImageUrl(
                imageUrls[0] || '/images/default-product.jpg'
              )

              const rawName = item.name || 'مشروع مميز'
              const rawCategory = mediaData.category || 'مشاريعنا'
              const rawDesc = mediaData.description || ''

              const localized = getLocalizedProject(
                { name: rawName, category: rawCategory, description: rawDesc },
                isAr
              )

              return {
                id: item._id || String(index),
                name: localized.name,
                description: localized.description,
                image: rawImage,
                coverImage: coverImage,
                video: mediaData.videoUrl || '',
                category: localized.category
              }
            })

          // دمج المشاريع المجلوبة مع المشاريع الأساسية لضمان عدم اختفاء مصحة الحياة أو المشاريع المدمجة أبداً
          const fetchedNames = new Set(formattedProjects.map((p) => p.name.trim()))
          const missingInitials = INITIAL_PROJECTS
            .map((p) => {
              const localized = getLocalizedProject(p, isAr)
              return {
                ...p,
                name: localized.name,
                category: localized.category,
                description: localized.description
              }
            })
            .filter((p) => !fetchedNames.has(p.name.trim()))

          const merged = [...formattedProjects.reverse(), ...missingInitials]
          if (merged.length > 0) {
            setProjects(merged)
          }
        }
      } catch (e) {
        console.error('Fetch Projects Error:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [isAr])

  // استخراج فئات المشاريع
  const categories = [
    { key: 'all', label: isAr ? 'جميع المشاريع' : 'All Projects' },
    ...Array.from(new Set(projects.map((p) => p.category))).map((cat) => ({
      key: cat,
      label: cat
    }))
  ]

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory)

  const openGallery = (project: ProjectItem) => {
    setSelectedProject(project)
    setActiveImageIndex(0)
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F7F8FA] text-[#15191E] font-sans antialiased selection:bg-[#0062D2] selection:text-white pt-24 pb-28"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Back Link & Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#68717D] hover:text-[#0062D2] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Editorial Hero Header */}
        <div className="mb-14 sm:mb-18 max-w-3xl">
          <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3">
            SELECTED PROJECTS
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#15191E] tracking-tight leading-[1.12] mb-5">
            مساحات أضاءتها خبرتنا
          </h1>
          <p className="text-base sm:text-lg text-[#68717D] font-normal leading-relaxed">
            توثيق بصري لمشاريع تجارية وسكنية وصالات عرض أضفت حلولنا المعمارية عليها بعداً جمالياً ووظيفياً متفرداً.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-[#E7EAF0]">
            {categories.map((cat) => {
              const active = selectedCategory === cat.key
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-[#15191E] text-white shadow-sm'
                      : 'bg-white text-[#68717D] border border-[#E7EAF0] hover:text-[#15191E] hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 className="w-10 h-10 text-[#0062D2] animate-spin mb-4" />
            <p className="text-xs text-[#68717D]">
              {isAr ? 'جاري جلب أحدث المشاريع...' : 'Loading projects...'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="bg-white border border-[#E7EAF0] rounded-2xl p-16 text-center max-w-lg mx-auto">
            <PackageSearch className="w-10 h-10 text-[#68717D] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#15191E] mb-2">لا توجد مشاريع في هذا التصنيف</h3>
            <p className="text-xs text-[#68717D]">
              يمكنك اختيار تصنيف آخر أو العودة لتصفح جميع المشاريع.
            </p>
          </div>
        )}

        {/* Photography-First Editorial Portfolio Grid */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {filteredProjects.map((p, idx) => {
              // Asymmetric editorial rhythm: 7-col and 5-col alternating
              const spanClass =
                idx % 4 === 0 || idx % 4 === 3
                  ? 'lg:col-span-7 aspect-[16/10]'
                  : 'lg:col-span-5 aspect-[4/3]'

              return (
                <div
                  key={p.id}
                  onClick={() => openGallery(p)}
                  className={`group relative rounded-2xl overflow-hidden bg-slate-900 border border-[#E7EAF0] cursor-pointer shadow-sm ${spanClass}`}
                >
                  <img
                    src={getOptimizedProjectImageUrl(p.coverImage)}
                    alt={p.name}
                    loading={idx < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-product.jpg'
                    }}
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

                  {/* Category Badge */}
                  <div className="absolute top-5 right-5 z-10">
                    <span className="bg-white/95 backdrop-blur-md text-[#15191E] text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                      {p.category}
                    </span>
                  </div>

                  {/* Video Badge if available */}
                  {p.video && (
                    <div className="absolute top-5 left-5 z-10 flex items-center gap-1.5 bg-[#0062D2] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md">
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>فيديو</span>
                    </div>
                  )}

                  {/* Bottom Information (Project Name + View CTA ONLY - No procurement clutter) */}
                  <div className="absolute bottom-6 right-6 left-6 z-10 flex items-end justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug">
                        {p.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 group-hover:bg-[#0062D2] group-hover:scale-110">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* =====================================================================
          Visual Storytelling Lightbox Modal
          Show: Project name, category, large photography, image gallery
          Hide: procurement details, quantities, supply lists
          ===================================================================== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#101820] text-white rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Image Display */}
              <div className="relative aspect-[16/10] w-full bg-black overflow-hidden">
                {(() => {
                  const imgs = (selectedProject.image || selectedProject.coverImage)
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                  const currentSrc = imgs[activeImageIndex] || selectedProject.coverImage
                  return (
                    <img
                      src={getOptimizedProjectImageUrl(currentSrc)}
                      alt={selectedProject.name}
                      className="w-full h-full object-contain"
                    />
                  )
                })()}

                {/* Left/Right Navigation */}
                {(() => {
                  const imgs = (selectedProject.image || selectedProject.coverImage)
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                  if (imgs.length <= 1) return null
                  return (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIndex(
                            (prev) => (prev - 1 + imgs.length) % imgs.length
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) => (prev + 1) % imgs.length)
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </>
                  )
                })()}
              </div>

              {/* Lightbox Footer */}
              <div className="p-6 bg-[#15191E] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                <div className="text-right w-full sm:w-auto">
                  <span className="text-xs text-[#0062D2] font-semibold block mb-1">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-xl font-semibold text-white">{selectedProject.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                  {selectedProject.video && (
                    <a
                      href={selectedProject.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs font-semibold rounded-full transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>مشاهدة الفيديو</span>
                    </a>
                  )}

                  {/* Thumbnails Gallery */}
                  {(() => {
                    const imgs = (selectedProject.image || selectedProject.coverImage)
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                    if (imgs.length <= 1) return null
                    return (
                      <div className="flex items-center gap-2 overflow-x-auto max-w-xs pb-1">
                        {imgs.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImageIndex(i)}
                            className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                              i === activeImageIndex
                                ? 'border-[#0062D2] scale-105'
                                : 'border-white/20 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={getOptimizedProjectImageUrl(img)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
