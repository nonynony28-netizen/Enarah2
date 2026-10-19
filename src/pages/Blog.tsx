import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, X, Calendar, Clock, BookOpen, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

// ==========================================
// Articles Database
// ==========================================
const getBlogPosts = (isAr: boolean) => [
  {
    id: 1,
    badge: isAr ? 'دليل معماري' : 'Architectural Guide',
    title: isAr
      ? 'الدليل الشامل لإضاءة الواجهات الخارجية: إبراز الفخامة وحساب الزوايا'
      : 'Comprehensive Guide to Facade Lighting: Architectural Highlights & Beam Angles',
    summary: isAr
      ? 'واجهة المبنى هي التعبير البصري الأول. اكتشف كيف تحوّل الإضاءة المدروسة الجدران الصامتة إلى لوحة معمارية آسرة تبرز أدق التفاصيل الحجرية والرخامية.'
      : 'The building facade is the primary visual statement. Discover how calculated lighting transforms architecture into an evocative statement.',
    coverImage: '/images/project-facade.jpg',
    date: isAr ? '15 مايو 2026' : 'May 15, 2026',
    readTime: isAr ? '4 دقائق قراءة' : '4 min read',
    sections: [
      {
        heading: isAr ? 'القيمة المعمارية لإضاءة الواجهة' : 'Architectural Value of Facade Lighting',
        text: isAr
          ? 'لا تقتصر أهمية إضاءة الواجهات على الجانب الأمني فقط، بل تعتبر العنصر الأهم في إبراز التفاصيل المعمارية ليلاً. الإضاءة المحسوبة تخلق ظلالاً فنية على الحجر المعماري وتمنح الصرح هيبة وفخامة تليق به.'
          : 'Facade lighting goes far beyond security; it is the premier tool for sculpting nighttime architectural depth and highlighting material textures.',
        image: ''
      },
      {
        heading: isAr ? 'تقنية الإضاءة الجدارية (Up-Down Lighting)' : 'Up-Down Wall Grazing Tech',
        text: isAr
          ? 'تعتبر هذه التقنية من أهم ركائز الإضاءة المعمارية الحديثة؛ حيث توجه الضوء رأسياً للأعلى والأسفل بالتوازي مع خطوط الجدار، مما يرسم مسارات ضوئية ناعمة دون التسبب في أي وهج مباشر للمارة أو الجالسين.'
          : 'A cornerstone of modern architectural illumination, directing light vertically without producing intrusive glare for pedestrians.',
        image: '/images/project-villa.jpg'
      }
    ]
  },
  {
    id: 2,
    badge: isAr ? 'تصميم داخلي' : 'Interior Lighting',
    title: isAr
      ? 'هندسة الإضاءة في الصالات الفاخرة: فن التناغم بين المخفي والسبوت لايت'
      : 'Living Room Photometrics: Harmonizing Cove Lighting & Architectural Spotlights',
    summary: isAr
      ? 'كيف تحقق بيئة بصرية مريحة للعين وفخمة المظهر في نفس الوقت؟ السر يكمن في تقسيم الإضاءة إلى طبقات ثلاث مدروسة بعناية فائقة.'
      : 'How to achieve a glare-free, visually comfortable, yet ultra-luxurious ambiance using the three-layer architectural illumination rule.',
    coverImage: '/images/project-company.jpg',
    date: isAr ? '10 مايو 2026' : 'May 10, 2026',
    readTime: isAr ? '3 دقائق قراءة' : '3 min read',
    sections: [
      {
        heading: isAr ? 'قاعدة الطبقات الضوئية الثلاث' : 'The Three Lighting Layers',
        text: isAr
          ? 'لتحقيق صالة متوازنة ومريحة، يجب الفصل بين: الإضاءة المحيطية (مثل مجاري الليد المخفية في الأسقف)، الإضاءة الوظيفية (مثل إضاءات القراءة والعمل)، وإضاءة المهام الديكورية (مثل السبوت المركز على اللوحات والتحف).'
          : 'Balanced spaces require distinct layers: indirect ambient cove light, functional task lighting, and focused accent beams.',
        image: ''
      },
      {
        heading: isAr ? 'السبوت لايت المانع للتوهج (Deep Anti-Glare)' : 'Deep Anti-Glare Optics',
        text: isAr
          ? 'تتميز كشافات السبوت لايت المعمارية الحديثة بوجود مصدر الضوء في تجويف غائر (Deep Recessed) يمنع رؤية اللمبة مباشرة من زوايا الجلوس الطبيعية، فتصل الإضاءة للأرضيات والجدران دون أن تتعب العين إطلاقاً.'
          : 'Deep recessed optics ensure the source diode remains completely invisible from standard sightlines, providing pure illumination without eye fatigue.',
        image: '/images/project-shop.jpg'
      }
    ]
  },
  {
    id: 3,
    badge: isAr ? 'مشاريع وتجارة' : 'Commercial Spaces',
    title: isAr
      ? 'سيكولوجية الضوء في المشاريع التجارية: كيف ترفع الإضاءة من قيمة علامتك؟'
      : 'Commercial Photometrics: Elevating Brand Value & Customer Experience with Light',
    summary: isAr
      ? 'في المطاعم والمقاهي وصالات العرض، الإضاءة ليست تفصيلاً ثانوياً بل أداة جذب حاسمة تؤثر في زمن بقاء العميل وراحته النفسية وإدراكه لجودة المكان.'
      : 'In retail and hospitality, lighting is a strategic driver that dictates dwell time, psychological comfort, and perceived brand value.',
    coverImage: '/images/project-shop.jpg',
    date: isAr ? '5 مايو 2026' : 'May 5, 2026',
    readTime: isAr ? '5 دقائق قراءة' : '5 min read',
    sections: [
      {
        heading: isAr ? 'درجة حرارة اللون وسيكولوجية الاسترخاء (Kelvin)' : 'Color Temperature & Ambience (Kelvin)',
        text: isAr
          ? 'تفضل الصالات الراقية والمقاهي درجات الإضاءة الدافئة (Warm White بين 2700K و 3000K) لأنها تعزز الإحساس بالألفة والراحة، بينما تتطلب صالات العرض الحديثة والمكاتب إضاءة محايدة (Natural White 4000K) لدقة إظهار الألوان.'
          : 'High-end hospitality leverages warm whites (2700K-3000K) to create intimate luxury, whereas modern showrooms utilize 4000K for color precision.',
        image: ''
      },
      {
        heading: isAr ? 'معامل إظهار الألوان الحقيقي (CRI > 90)' : 'High Color Rendering Index (CRI > 90)',
        text: isAr
          ? 'المشاريع الناجحة تختار دائماً مصادر إضاءة ذات معامل CRI لا يقل عن 90، ما يضمن ظهور ألوان الديكور والمنتجات والأطعمة بكامل نضارتها الطبيعية دون أي بهتان أو تشويه لوني.'
          : 'Premium installations require CRI > 90 to ensure that textures, architectural finishes, and displays reflect their authentic rich tones.',
        image: '/images/project-company.jpg'
      }
    ]
  }
]

export default function Blog() {
  const { isAr } = useLanguage()
  const blogPosts = getBlogPosts(isAr)
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPost(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock body scroll cleanly while article modal is open
  useBodyScrollLock(!!selectedPost)

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans antialiased pb-20"
    >
      {/* =====================================================================
          01. Architectural Hero Header (Deep Corporate Navy #101820)
          ===================================================================== */}
      <section className="relative bg-[#101820] text-white pt-12 pb-14 overflow-hidden border-b border-[#202936]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0062D2]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#0062D2] animate-pulse" />
                <span>{isAr ? 'دراسات ومقالات معمارية' : 'Architectural Journal & Insights'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {isAr ? 'هندسة الإضاءة والأفكار المعمارية' : 'Lighting Engineering & Architectural Insights'}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {isAr
                  ? 'مقالات ودراسات بصرية متخصصة تضع بين يديك خلاصة خبرتنا في حساب زوايا الضوء، توزيع الكشافات المانعة للتوهج، وتأسيس الأنظمة الكهربائية المتينة في المباني الليبية.'
                  : 'Specialized photometrics research, anti-glare techniques, and electrical infrastructure standards from our engineering team in Benghazi.'}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'حساب زوايا الضوء والـ Photometrics' : 'Photometrics & Beam Angles'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'تقنيات مانع التوهج (Anti-Glare)' : 'Deep Anti-Glare Optics'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'معايير التأسيس والأسلاك' : 'Wiring Infrastructure'}</span>
                </div>
              </div>
            </div>

            {/* Reading badge */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md lg:w-80 shrink-0 space-y-3">
              <div className="flex items-center gap-2 text-[#0062D2] font-semibold text-xs">
                <BookOpen className="w-4 h-4 text-[#0062D2]" />
                <span>{isAr ? 'المجلة الهندسية المعتمدة' : 'Official Technical Journal'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'مكتوبة ومراجعة بواسطة مهندسي الإضاءة المعمارية لدى شركة الإنارة الحديثة في بنغازي.'
                  : 'Authored and reviewed by lighting engineers at Enarah Modern Showroom.'}
              </p>
              <div className="pt-2 border-t border-white/10 text-xs text-slate-400">
                {isAr ? '3 مقالات متخصصة متاحة للقراءة الفورية' : '3 In-depth articles available'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-12">

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-2xl overflow-hidden border border-[#E7EAF0] shadow-xs hover:border-[#0062D2]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-[#E7EAF0]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-product.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-white/95 backdrop-blur-md text-[#15191E] text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                      {post.badge}
                    </span>
                  </div>
                </div>

                {/* Metadata & Title */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs font-medium text-[#68717D] mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0062D2]" />
                      <span>{post.date}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0062D2]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#15191E] group-hover:text-[#0062D2] transition-colors line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#68717D] leading-relaxed font-normal line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="px-6 pb-6 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0062D2] group-hover:text-[#0047A5] transition-colors">
                  <span>{isAr ? 'قراءة المقال كاملاً' : 'Read Article'}</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter / Consultation Strip */}
        <div className="bg-[#101820] text-white rounded-3xl p-10 sm:p-14 text-center border border-[#202936]">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
              {isAr ? 'استشارات معمارية متخصصة' : 'ARCHITECTURAL CONSULTING'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
              {isAr ? 'هل ترغب في دراسة ضوئية لمشروعك؟' : 'Need an Architectural Lighting Study?'}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
              {isAr
                ? 'فريقنا الهندسي في بنغازي والبيضاء جاهز لتقديم المشورة المعمارية وتحليل مخططات المبنى لضمان توزيع ضوئي مثالي.'
                : 'Our engineering team in Benghazi & Al-Bayda is ready to review your architectural plans for photometric optimization.'}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors shadow-md"
            >
              <span>{isAr ? 'طلب استشارة أو تسعيرة' : 'Request Consultation or Quote'}</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================================
      {/* =====================================================================
          Article Reading Modal (Clean Fullscreen on Mobile, Centered on Desktop)
          ===================================================================== */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white text-[#15191E] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col border-0 sm:border sm:border-[#E7EAF0]"
            >
              {/* Sticky Top Header with 44px+ Accessible Close Control & Safe Area Inset */}
              <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E7EAF0] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                  <span className="text-xs font-semibold text-[#0062D2] bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full shrink-0">
                    {selectedPost.badge}
                  </span>
                  <span className="text-xs font-medium text-[#68717D] truncate">
                    {selectedPost.title}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all cursor-pointer shrink-0"
                  aria-label={isAr ? 'إغلاق المقال' : 'Close Article'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Primary Single Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto overscroll-contain pb-[calc(3rem+env(safe-area-inset-bottom,0px))]">
                {/* Controlled Cover Image on Mobile (never dominates screen) */}
                <div className="relative w-full aspect-[16/9] max-h-[220px] sm:max-h-[320px] bg-slate-900 overflow-hidden shrink-0">
                  <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-product.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 right-4 left-4 text-white">
                    <div className="flex items-center gap-3 text-xs text-white/90 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0062D2]" />
                        <span>{selectedPost.date}</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0062D2]" />
                        <span>{selectedPost.readTime}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Article Typography & Natural Vertical Rhythm */}
                <div className="p-5 sm:p-10 space-y-6 sm:space-y-8">
                  <div>
                    <h2 className="text-xl sm:text-3xl font-bold text-[#15191E] tracking-tight leading-snug mb-3.5">
                      {selectedPost.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-relaxed bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-[#E7EAF0]">
                      {selectedPost.summary}
                    </p>
                  </div>

                  {selectedPost.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-3 sm:space-y-4">
                      <h3 className="text-lg sm:text-xl font-bold text-[#15191E] tracking-tight border-r-4 border-[#0062D2] pr-3">
                        {sec.heading}
                      </h3>
                      <p className="text-base text-[#334155] leading-[1.85] font-normal">
                        {sec.text}
                      </p>
                      {sec.image && (
                        <div className="aspect-[16/9] max-h-[240px] sm:max-h-none rounded-2xl overflow-hidden bg-slate-900 border border-[#E7EAF0] my-4">
                          <img
                            src={sec.image}
                            alt={sec.heading}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/default-product.jpg'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Reader Footer Signoff and Secondary Close Action */}
                  <div className="pt-6 border-t border-[#E7EAF0] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-[#68717D] text-center sm:text-right">
                      {isAr ? 'شركة الإنارة الحديثة — قسم الدراسات الهندسية' : 'Enarah Modern Showroom — Engineering Studies'}
                    </span>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#15191E] text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
                    >
                      {isAr ? 'إغلاق المقال' : 'Close Article'}
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
