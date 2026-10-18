import { useEffect, useState } from 'react'
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
  Sparkles,
  Building,
  CheckCircle2
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

          // إزالة أي تكرار بالاسم سواء في قاعدة البيانات أو لوحة التحكم
          const seenNames = new Set<string>()
          const uniqueFetched: ProjectItem[] = []
          for (const proj of formattedProjects.reverse()) {
            const cleanName = proj.name.trim()
            if (!seenNames.has(cleanName)) {
              seenNames.add(cleanName)
              uniqueFetched.push(proj)
            }
          }

          // دمج المشاريع المجلوبة مع المشاريع الأساسية لضمان عدم اختفاء أي مشروع رئيسي مدمج
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
            .filter((p) => !seenNames.has(p.name.trim()))

          const merged = [...uniqueFetched, ...missingInitials]
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

  // استخراج فئات المشاريع مع حساب عدد المشاريع في كل تصنيف
  const categories = [
    { 
      key: 'all', 
      label: isAr ? 'جميع المشاريع' : 'All Projects',
      count: projects.length
    },
    ...Array.from(new Set(projects.map((p) => p.category))).map((cat) => ({
      key: cat,
      label: cat,
      count: projects.filter((p) => p.category === cat).length
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

  // حساب توزيع الشبكة المعمارية غير المتناظرة بطريقة منتظمة تمنع الفراغات العشوائية
  const getGridSpan = (idx: number, total: number) => {
    if (total === 1) return 'col-span-12 aspect-[16/9] lg:aspect-[21/9]'
    if (total === 2) return 'col-span-12 md:col-span-6 aspect-[16/10]'

    const pos = idx % 4
    const isLast = idx === total - 1

    // في حال كان المشروع الأخير وحيداً في صفه الأخير، يمتد بعرض كامل بانورامي فخم
    if (isLast && (pos === 0 || pos === 2)) {
      return 'col-span-12 aspect-[16/9] lg:aspect-[24/9]'
    }

    // إيقاع معماري متوازن (الصف الأول: 7 أعمدة و 5 أعمدة | الصف الثاني: 6 أعمدة و 6 أعمدة)
    if (pos === 0) return 'col-span-12 lg:col-span-7 aspect-[16/10]'
    if (pos === 1) return 'col-span-12 lg:col-span-5 aspect-[4/3] lg:aspect-[16/10]'
    if (pos === 2) return 'col-span-12 md:col-span-6 lg:col-span-6 aspect-[16/10]'
    if (pos === 3) return 'col-span-12 md:col-span-6 lg:col-span-6 aspect-[16/10]'

    return 'col-span-12 md:col-span-6 aspect-[16/10]'
  }

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans antialiased selection:bg-[#0062D2] selection:text-white pb-28"
    >
      {/* =====================================================================
          01. Premium Compact Architectural Hero Section (Section 05)
          Editorial Split: Right (Title & Info) | Left (Authentic Project Night Facade)
          ===================================================================== */}
      <section className="relative bg-[#101820] text-white pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-white/10 overflow-hidden">
        {/* Subtle Architectural Glow & Grid Texture */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0062D2]/10 rounded-full blur-3xl pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Right Column: Editorial Typography & Authentic Text */}
            <div className="lg:col-span-7 space-y-4 text-right" dir={isAr ? 'rtl' : 'ltr'}>
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-blue-200 tracking-wide">
                <Building className="w-3.5 h-3.5 text-[#0062D2]" />
                <span>{isAr ? 'معرض المشاريع المعمارية المتخصصة' : 'Architectural Portfolio'}</span>
              </div>

              {/* Main Heading (Preserved Exact Title) */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {isAr ? 'مساحات أضاءتها خبرتنا' : 'Spaces Illuminated by Our Expertise'}
              </h1>

              {/* Preserved Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                {isAr 
                  ? 'توثيق بصري لمشاريع تجارية وسكنية وصالات عرض أضفت حلولنا المعمارية عليها بعداً جمالياً ووظيفياً متفرداً.'
                  : 'A visual documentation of commercial, residential, and showroom projects where our architectural lighting solutions brought unique aesthetic and functional dimensions.'}
              </p>

              {/* Authentic Sector Indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0062D2] shrink-0" />
                  <span>{isAr ? 'مولات ومراكز تجارية' : 'Commercial Malls'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0062D2] shrink-0" />
                  <span>{isAr ? 'مستشفيات ومراكز طبية' : 'Medical Facilities'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0062D2] shrink-0" />
                  <span>{isAr ? 'معارض ومساحات ضيافة' : 'Showrooms & Hospitality'}</span>
                </div>
              </div>
            </div>

            {/* Left Column: Authentic Architectural Exterior Project Photograph */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-slate-900 group">
                <img
                  src="/images/project-facade.jpg"
                  alt={isAr ? 'إضاءة معمارية لواجهات المباني التجارية' : 'Commercial architectural facade lighting'}
                  className="w-full h-[250px] sm:h-[280px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-transparent to-transparent opacity-75" />
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-[#0062D2]" />
                    <span>{isAr ? 'إضاءة واجهات ومبانٍ متكاملة' : 'Integrated Facade Illumination'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          02. Architectural Category Filters & Portfolio Gallery Workspace
          ===================================================================== */}
      <main className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 sm:pt-10">
        
        {/* Architectural Filter Navigation Bar (Section 06) */}
        {categories.length > 1 && (
          <div className="border-b border-[#E2E8F0] mb-8 sm:mb-10">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 text-xs sm:text-sm font-semibold">
              {categories.map((cat) => {
                const active = selectedCategory === cat.key
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`relative py-2.5 px-4 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                      active
                        ? 'bg-[#101820] text-white shadow-xs'
                        : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#15191E] hover:border-slate-300'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-[#0062D2] animate-spin mb-4" />
            <p className="text-xs text-[#64748B]">
              {isAr ? 'جاري جلب أحدث المشاريع المعمارية...' : 'Loading architectural projects...'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-16 text-center max-w-lg mx-auto shadow-xs">
            <PackageSearch className="w-10 h-10 text-[#64748B] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#15191E] mb-2">
              {isAr ? 'لا توجد مشاريع في هذا التصنيف' : 'No projects found in this category'}
            </h3>
            <p className="text-xs text-[#64748B]">
              {isAr ? 'يمكنك اختيار تصنيف آخر أو تصفح جميع المشاريع.' : 'You can select another category or browse all projects.'}
            </p>
          </div>
        )}

        {/* Controlled Asymmetric Architectural Portfolio Grid (Section 07 & 09) */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
            {filteredProjects.map((p, idx) => {
              const spanClass = getGridSpan(idx, filteredProjects.length)

              return (
                <div
                  key={p.id}
                  onClick={() => openGallery(p)}
                  className={`group relative rounded-2xl overflow-hidden bg-slate-900 border border-[#E2E8F0] cursor-pointer shadow-xs transition-all duration-300 hover:shadow-lg ${spanClass}`}
                >
                  {/* Project Image with Intelligent Object-Cover */}
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

                  {/* Subtle Dark Gradient Overlay for Typography Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/90 via-[#101820]/25 to-transparent transition-opacity duration-300" />

                  {/* Top Bar: Category Label & Optional Video Pill */}
                  <div className="absolute top-4 sm:top-5 right-4 sm:right-5 left-4 sm:left-5 z-10 flex items-center justify-between pointer-events-none">
                    <span className="bg-white/95 backdrop-blur-md text-[#15191E] text-xs font-semibold px-3 py-1 rounded-full border border-white/20 shadow-xs">
                      {p.category}
                    </span>

                    {p.video && (
                      <div className="flex items-center gap-1.5 bg-[#0062D2] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>{isAr ? 'فيديو' : 'Video'}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar: Project Name & View Action Arrow */}
                  <div className="absolute bottom-5 sm:bottom-6 right-5 sm:right-6 left-5 sm:left-6 z-10 flex items-end justify-between gap-4">
                    <div className="space-y-1 max-w-[85%] text-right" dir={isAr ? 'rtl' : 'ltr'}>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                        {p.name}
                      </h3>
                      {p.description && (
                        <p className="text-slate-300 text-xs sm:text-sm line-clamp-1 font-normal opacity-90">
                          {p.description}
                        </p>
                      )}
                    </div>

                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 border border-white/25 transition-all duration-300 group-hover:bg-[#0062D2] group-hover:border-[#0062D2] group-hover:scale-105">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* =====================================================================
          03. Architectural Lightbox Case Study Modal (Section 11)
          ===================================================================== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[92vh] bg-[#101820] text-white rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
                aria-label={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Image Display */}
              <div className="relative aspect-[16/10] w-full bg-black overflow-hidden flex items-center justify-center">
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
                        aria-label={isAr ? 'الصورة السابقة' : 'Previous Image'}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) => (prev + 1) % imgs.length)
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
                        aria-label={isAr ? 'الصورة التالية' : 'Next Image'}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </>
                  )
                })()}
              </div>

              {/* Lightbox Footer Info & Thumbnails */}
              <div className="p-6 bg-[#15191E] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="text-right w-full sm:w-auto space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#0062D2] font-semibold">
                      {selectedProject.category}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-400">
                      {isAr ? 'مشروع موثق' : 'Verified Case Study'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedProject.name}</h3>
                  {selectedProject.description && (
                    <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                      {selectedProject.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {selectedProject.video && (
                    <a
                      href={selectedProject.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{isAr ? 'مشاهدة الفيديو' : 'Watch Video'}</span>
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
                            className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
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
