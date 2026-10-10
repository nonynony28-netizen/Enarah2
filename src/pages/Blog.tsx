import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, X, Calendar, Clock, BookOpen, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

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

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [selectedPost])

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F7F8FA] text-[#15191E] font-sans antialiased selection:bg-[#0062D2] selection:text-white pt-24 pb-28"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Back Link */}
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
            JOURNAL & INSIGHTS
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#15191E] tracking-tight leading-[1.12] mb-5">
            هندسة الإضاءة والأفكار المعمارية
          </h1>
          <p className="text-base sm:text-lg text-[#68717D] font-normal leading-relaxed">
            مقالات ودراسات بصرية متخصصة تضع بين يديك خلاصة خبرتنا في حساب زوايا الضوء، وتوزيع الكشافات، وتأسيس الأنظمة الكهربائية المتينة.
          </p>
        </div>

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
        <div className="bg-[#101820] text-white rounded-3xl p-10 sm:p-14 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
              ARCHITECTURAL CONSULTING
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              هل ترغب في دراسة ضوئية لمشروعك؟
            </h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal mb-8">
              فريقنا الهندسي في طرابلس وبنغازي جاهز لتقديم المشورة المعمارية وتحليل مخططات المبنى لضمان توزيع ضوئي مثالي.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors"
            >
              <span>طلب استشارة أو تسعيرة</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================================
          Article Reading Modal
          ===================================================================== */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white text-[#15191E] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[#E7EAF0]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Image */}
              <div className="relative aspect-[16/9] w-full bg-slate-900 shrink-0">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-product.jpg'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-6 left-6 text-white">
                  <span className="text-xs font-semibold text-[#0062D2] bg-white px-3 py-1 rounded-full mb-2 inline-block">
                    {selectedPost.badge}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-white/80">
                    <span>{selectedPost.date}</span>
                    <span>•</span>
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 sm:p-10 overflow-y-auto space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#15191E] tracking-tight leading-snug mb-4">
                    {selectedPost.title}
                  </h2>
                  <p className="text-base text-[#68717D] leading-relaxed bg-[#F7F8FA] p-5 rounded-2xl border border-[#E7EAF0]">
                    {selectedPost.summary}
                  </p>
                </div>

                {selectedPost.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-xl font-semibold text-[#15191E] tracking-tight border-r-4 border-[#0062D2] pr-3">
                      {sec.heading}
                    </h3>
                    <p className="text-sm sm:text-base text-[#68717D] leading-relaxed font-normal">
                      {sec.text}
                    </p>
                    {sec.image && (
                      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-[#E7EAF0] my-4">
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

                <div className="pt-6 border-t border-[#E7EAF0] flex items-center justify-between">
                  <span className="text-xs text-[#68717D]">شركة الإنارة الحديثة — قسم الدراسات الهندسية</span>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-5 py-2 rounded-full bg-[#15191E] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    إغلاق المقال
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
