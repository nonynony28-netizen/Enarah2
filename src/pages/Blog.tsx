import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { BookOpen, ArrowLeft, ArrowRight, X, Calendar, Clock } from 'lucide-react'
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
      style={{ willChange: "opacity, transform" }} // تسريع الأداء
    >
      {children}
    </motion.div>
  )
}

// ==========================================
// قاعدة بيانات المقالات (مدمجة في الكود)
// ==========================================
const getBlogPosts = (isAr: boolean) => [
  {
    id: 1,
    badge: isAr ? 'مقال هندسي' : 'Engineering Article',
    title: isAr ? 'كيف تبرز فخامة منزلك؟ الدليل الشامل لإضاءة الواجهات' : 'How to Highlight the Luxury of Your Home? The Comprehensive Guide to Facade Lighting',
    summary: isAr ? 'واجهة منزلك هي بطاقة التعارف الأولى. اكتشف كيف يمكن للإضاءة المدروسة أن ترفع قيمة عقارك وتمنحه فخامة الفنادق.' : 'Your home facade is the first introduction card. Discover how structured lighting can increase your property value and give it hotel luxury.',
    coverImage: '/images/project-facade.jpg',
    date: isAr ? '15 مايو 2026' : 'May 15, 2026',
    readTime: isAr ? '4 دقائق قراءة' : '4 min read',
    sections: [
      {
        heading: isAr ? 'أهمية إضاءة الواجهة' : 'Importance of Facade Lighting',
        text: isAr ? 'لا تقتصر أهمية إضاءة الواجهات على الجانب الأمني فقط، بل تعتبر العنصر الأهم في إبراز التفاصيل المعمارية ليلاً. الإضاءة الصحيحة تخلق ظلالاً فنية على الحجر المعماري وتجعل المبنى يبدو أكبر وأكثر فخامة.' : 'The importance of facade lighting is not limited to security only, but is the most critical element in highlighting architectural details at night. Proper lighting creates artistic shadows on stonework and makes the building look larger and more luxurious.',
        image: ''
      },
      {
        heading: isAr ? 'تقنية الإضاءة الجدارية (Up-Down)' : 'Wall Up-Down Lighting Tech',
        text: isAr ? 'تعتبر هذه التقنية من أحدث صيحات الإضاءة الخارجية. فهي تسلط الضوء للأعلى والأسفل في نفس الوقت، مما يرسم خطوطاً مضيئة أنيقة على الجدران دون التسبب في توهج مزعج للعين.' : 'This technique is considered one of the latest trends in outdoor lighting. It casts light upwards and downwards simultaneously, drawing elegant luminous lines on walls without causing glare.',
        image: '/images/project-villa.jpg'
      }
    ]
  },
  {
    id: 2,
    badge: isAr ? 'مقال هندسي' : 'Engineering Article',
    title: isAr ? 'السر وراء فخامة الصالات: فن الدمج بين الإضاءة المخفية والسبوت لايت' : 'The Secret Behind Living Room Luxury: The Art of Mixing Cove Lighting and Spotlights',
    summary: isAr ? 'هل تساءلت يوماً لماذا تبدو بعض الصالات مريحة وأنيقة بشكل استثنائي؟ السر يكمن في هندسة توزيع الضوء.' : 'Have you ever wondered why some living rooms look exceptionally comfortable and elegant? The secret lies in lighting distribution engineering.',
    coverImage: '/images/project-company.jpg',
    date: isAr ? '10 مايو 2026' : 'May 10, 2026',
    readTime: isAr ? '3 دقائق قراءة' : '3 min read',
    sections: [
      {
        heading: isAr ? 'قاعدة الطبقات الثلاث' : 'The Three Layers Rule',
        text: isAr ? 'للحصول على صالة فاخرة، يجب أن تعتمد على ثلاث طبقات: الإضاءة العامة (مثل الثريات)، الإضاءة المحيطية (مثل الإضاءة المخفية في الجبس)، وإضاءة المهام (مثل السبوت لايت الموجه للوحات أو الطاولات).' : 'For a luxurious living room, you must rely on three layers: general lighting (like chandeliers), ambient lighting (like hidden cove lighting in gypsum), and task lighting (like spotlights directed at paintings or tables).',
        image: ''
      },
      {
        heading: isAr ? 'السبوت لايت المانع للتوهج (Anti-glare)' : 'Anti-glare Spotlight',
        text: isAr ? 'الخطأ الشائع هو استخدام سبوت لايت باهر يزعج الجالسين. السبوت لايت المانع للتوهج مصمم بعدسة عميقة بحيث يضيء المكان دون أن ترى مصدر الضوء مباشرة، مما يوفر راحة تامة للعين.' : 'A common mistake is using highly bright spotlights that bother guests. Anti-glare spotlights are designed with a deep lens so they light the place without letting you see the light source directly, ensuring absolute eye comfort.',
        image: '/images/project-shop.jpg'
      }
    ]
  },
  {
    id: 3,
    badge: isAr ? 'مقال تسويقي' : 'Marketing Article',
    title: isAr ? 'كيف تضاعف مبيعات مشروعك التجاري باستخدام "هندسة الإضاءة"؟' : 'How to Double Your Commercial Project Sales Using "Lighting Design"?',
    summary: isAr ? 'الإضاءة في المطاعم والمقاهي أداة تسويقية تتحكم في مزاج الزبون وتزيد من مدة بقائه ومبيعاتك.' : 'Lighting in restaurants and cafes is a marketing tool that controls the customer\'s mood, increasing their stay duration and your sales.',
    coverImage: '/images/project-shop.jpg',
    date: isAr ? '5 مايو 2026' : 'May 5, 2026',
    readTime: isAr ? '5 دقائق قراءة' : '5 min read',
    sections: [
      {
        heading: isAr ? 'سيكولوجية الألوان (Kelvin)' : 'Color Psychology (Kelvin)',
        text: isAr ? 'في المقاهي والمطاعم الفاخرة، يُنصح دائماً باستخدام الإضاءة الدافئة جداً (2700K - 3000K). هذه الدرجة من اللون تخلق شعوراً بالدفء والراحة النفسية، مما يشجع الزبون على الجلوس لفترة أطول وطلب المزيد.' : 'In luxury cafes and restaurants, it is highly recommended to use very warm lighting (2700K - 3000K). This color temperature creates a sense of warmth and psychological comfort, encouraging customers to stay longer and order more.',
        image: ''
      },
      {
        heading: isAr ? 'توزيع الإضاءة المركزة' : 'Focused Lighting Distribution',
        text: isAr ? 'بدلاً من إضاءة المكان بالكامل بشكل متساوٍ، قم بتسليط إضاءة المعلقات (Pendant Lights) مباشرة فوق الطاولات مع تعتيم الممرات قليلاً. هذا يعطي الزبائن خصوصية ويجعل أطباق الطعام تبدو أشهى.' : 'Instead of illuminating the entire space evenly, cast pendant lights directly over tables while slightly dimming corridors. This offers customers privacy and makes food dishes look more delicious.',
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
    <div className="pt-24 md:pt-32 pb-24 bg-transparent min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className="mb-6 flex justify-start">
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#0f213a] border border-white/10 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-blue-400 font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </FadeIn>

        {/* عنوان الصفحة */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
              {isAr ? (
                <>مدونة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.4)]">الإنارة</span></>
              ) : (
                <>ENARAH <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.4)]">Blog</span></>
              )}
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl shadow-sm">
              {isAr 
                ? 'نصائح هندسية، أفكار تصميمية، وأحدث صيحات عالم الإضاءة لنجعل مساحتك أكثر إشراقاً'
                : 'Engineering tips, design ideas, and the latest trends in the lighting world to make your space brighter'
              }
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-6">
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
            </div>
          </div>
        </FadeIn>

        {/* شبكة كروت المقالات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.1}>
              <div 
                onClick={() => setSelectedPost(post)}
                style={{ willChange: "transform, opacity" }} // لتسريع الكروت
                className="group cursor-pointer relative bg-[#0f213a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 shadow-xl flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0a192f]">
                  <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f213a] via-[#0f213a]/40 to-transparent opacity-90" />
                  
                  <div className="absolute top-4 right-4 bg-[#0a192f]/80 border border-blue-500/30 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    {post.badge}
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex-grow flex flex-col relative z-20">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed flex-grow line-clamp-3 mb-6">{post.summary}</p>
                  
                  <span className="mt-auto inline-flex items-center gap-2 text-blue-400 font-bold group-hover:text-blue-300 transition-colors">
                    {isAr ? 'اقرأ المقال كاملاً' : 'Read full article'}
                    <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${isAr ? '' : 'rotate-180 group-hover:translate-x-1'}`} />
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ==========================================
            نافذة قراءة المقال الكامل (Modal)
        ========================================== */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            >
              {/* الخلفية المعتمة */}
              <div className="absolute inset-0 bg-[#06152b]/95" onClick={() => setSelectedPost(null)} />
              
              {/* نافذة المقال */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }} 
                className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d2342] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
              >
                {/* زر الإغلاق */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 left-4 z-50 p-2.5 bg-[#0a192f]/80 hover:bg-red-500 text-white border border-white/10 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* صورة المقال الرئيسية */}
                <div className="relative w-full h-64 md:h-96 flex-shrink-0">
                  <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2342] via-[#0d2342]/40 to-transparent opacity-95" />
                </div>

                {/* محتوى المقال (قابل للتمرير) */}
                <div className="flex-grow overflow-y-auto p-6 md:p-12 custom-scrollbar bg-[#0d2342]">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-6 text-sm font-bold text-blue-400 mb-8">
                      <span className="flex items-center gap-2 bg-[#0a192f] px-4 py-2 rounded-full border border-blue-500/20 shadow-sm"><Calendar className="w-5 h-5" /> {selectedPost.date}</span>
                      <span className="flex items-center gap-2 bg-[#0a192f] px-4 py-2 rounded-full border border-blue-500/20 shadow-sm"><Clock className="w-5 h-5" /> {selectedPost.readTime}</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-10 leading-tight">
                      {selectedPost.title}
                    </h2>

                    <p className="text-xl text-slate-300 leading-relaxed text-center mb-12 font-medium bg-[#0a192f] p-8 rounded-3xl border border-white/5 shadow-inner">
                      <span className="text-blue-400 text-4xl leading-none">"</span>
                      {selectedPost.summary}
                      <span className="text-blue-400 text-4xl leading-none">"</span>
                    </p>

                    <div className="w-24 h-1.5 bg-blue-500 mx-auto mb-14 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

                    {/* الأقسام الداخلية والصور */}
                    {selectedPost.sections.map((sec, idx) => (
                      <div key={idx} className="mb-14">
                        <h3 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-3">
                          <span className="w-2 h-8 bg-blue-500 rounded-full inline-block shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                          {sec.heading}
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8">{sec.text}</p>
                        
                        {sec.image && (
                          <div className="rounded-[2rem] overflow-hidden border border-white/5 shadow-xl">
                            <img src={sec.image} alt={sec.heading} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="text-center pt-8 border-t border-white/10 mt-12">
                      <p className="text-slate-400 font-bold mb-4">
                        {isAr ? 'هل أعجبك المقال؟ شاركه الآن' : 'Did you like the article? Share it now'}
                      </p>
                      <button onClick={() => setSelectedPost(null)} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        {isAr ? 'العودة للمدونة' : 'Back to Blog'}
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      {/* تخصيص شريط التمرير داخل المقال */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.6); }
      `}} />
    </div>
  )
}
