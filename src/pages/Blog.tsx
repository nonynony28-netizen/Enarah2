import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { BookOpen, ArrowLeft, X, Calendar, Clock } from 'lucide-react'

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

// ==========================================
// قاعدة بيانات المقالات (مدمجة في الكود)
// ==========================================
const blogPosts = [
  {
    id: 1,
    title: 'كيف تبرز فخامة منزلك؟ الدليل الشامل لإضاءة الواجهات',
    summary: 'واجهة منزلك هي بطاقة التعارف الأولى. اكتشف كيف يمكن للإضاءة المدروسة أن ترفع قيمة عقارك وتمنحه فخامة الفنادق.',
    coverImage: '/images/project-facade.jpg',
    date: '15 مايو 2026',
    readTime: '4 دقائق قراءة',
    sections: [
      {
        heading: 'أهمية إضاءة الواجهة',
        text: 'لا تقتصر أهمية إضاءة الواجهات على الجانب الأمني فقط، بل تعتبر العنصر الأهم في إبراز التفاصيل المعمارية ليلاً. الإضاءة الصحيحة تخلق ظلالاً فنية على الحجر المعماري وتجعل المبنى يبدو أكبر وأكثر فخامة.',
        image: ''
      },
      {
        heading: 'تقنية الإضاءة الجدارية (Up-Down)',
        text: 'تعتبر هذه التقنية من أحدث صيحات الإضاءة الخارجية. فهي تسلط الضوء للأعلى والأسفل في نفس الوقت، مما يرسم خطوطاً مضيئة أنيقة على الجدران دون التسبب في توهج مزعج للعين.',
        image: '/images/project-villa.jpg'
      }
    ]
  },
  {
    id: 2,
    title: 'السر وراء فخامة الصالات: فن الدمج بين الإضاءة المخفية والسبوت لايت',
    summary: 'هل تساءلت يوماً لماذا تبدو بعض الصالات مريحة وأنيقة بشكل استثنائي؟ السر يكمن في هندسة توزيع الضوء.',
    coverImage: '/images/project-company.jpg',
    date: '10 مايو 2026',
    readTime: '3 دقائق قراءة',
    sections: [
      {
        heading: 'قاعدة الطبقات الثلاث',
        text: 'للحصول على صالة فاخرة، يجب أن تعتمد على ثلاث طبقات: الإضاءة العامة (مثل الثريات)، الإضاءة المحيطية (مثل الإضاءة المخفية في الجبس)، وإضاءة المهام (مثل السبوت لايت الموجه للوحات أو الطاولات).',
        image: ''
      },
      {
        heading: 'السبوت لايت المانع للتوهج (Anti-glare)',
        text: 'الخطأ الشائع هو استخدام سبوت لايت باهر يزعج الجالسين. السبوت لايت المانع للتوهج مصمم بعدسة عميقة بحيث يضيء المكان دون أن ترى مصدر الضوء مباشرة، مما يوفر راحة تامة للعين.',
        image: '/images/project-shop.jpg'
      }
    ]
  },
  {
    id: 3,
    title: 'كيف تضاعف مبيعات مشروعك التجاري باستخدام "هندسة الإضاءة"؟',
    summary: 'الإضاءة في المطاعم والمقاهي أداة تسويقية تتحكم في مزاج الزبون وتزيد من مدة بقائه ومبيعاتك.',
    coverImage: '/images/project-shop.jpg',
    date: '5 مايو 2026',
    readTime: '5 دقائق قراءة',
    sections: [
      {
        heading: 'سيكولوجية الألوان (Kelvin)',
        text: 'في المقاهي والمطاعم الفاخرة، يُنصح دائماً باستخدام الإضاءة الدافئة جداً (2700K - 3000K). هذه الدرجة من اللون تخلق شعوراً بالدفء والراحة النفسية، مما يشجع الزبون على الجلوس لفترة أطول وطلب المزيد.',
        image: ''
      },
      {
        heading: 'توزيع الإضاءة المركزة',
        text: 'بدلاً من إضاءة المكان بالكامل بشكل متساوٍ، قم بتسليط إضاءة المعلقات (Pendant Lights) مباشرة فوق الطاولات مع تعتيم الممرات قليلاً. هذا يعطي الزبائن خصوصية ويجعل أطباق الطعام تبدو أشهى.',
        image: '/images/project-company.jpg'
      }
    ]
  }
]

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null)

  // إغلاق النافذة عند الضغط على زر الرجوع (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPost(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // منع التمرير في الصفحة الخلفية عند فتح المقال
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [selectedPost])

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-[#0a192f] min-h-screen relative overflow-hidden">
      
      {/* خلفيات مضيئة */}
      <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* عنوان الصفحة */}
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

        {/* شبكة كروت المقالات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.1}>
              <div 
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] overflow-hidden hover:bg-white/[0.04] hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)] flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0d2342]/50">
                  <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent opacity-90" />
                  
                  <div className="absolute top-4 right-4 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    مقال هندسي
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex-grow flex flex-col relative z-20">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed flex-grow line-clamp-3 mb-6">{post.summary}</p>
                  
                  <span className="mt-auto inline-flex items-center gap-2 text-blue-400 font-bold group-hover:text-blue-300 transition-colors">
                    اقرأ المقال كاملاً <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
              <div className="absolute inset-0 bg-[#06152b]/95 backdrop-blur-xl" onClick={() => setSelectedPost(null)} />
              
              {/* نافذة المقال */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d2342] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
              >
                {/* زر الإغلاق */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 left-4 z-50 p-2.5 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* صورة المقال الرئيسية */}
                <div className="relative w-full h-64 md:h-96 flex-shrink-0">
                  <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2342] via-[#0d2342]/40 to-transparent opacity-95" />
                </div>

                {/* محتوى المقال (قابل للتمرير) */}
                <div className="flex-grow overflow-y-auto p-6 md:p-12 custom-scrollbar">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-6 text-sm font-bold text-blue-400 mb-8">
                      <span className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20"><Calendar className="w-5 h-5" /> {selectedPost.date}</span>
                      <span className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20"><Clock className="w-5 h-5" /> {selectedPost.readTime}</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-10 leading-tight">
                      {selectedPost.title}
                    </h2>

                    <p className="text-xl text-slate-300 leading-relaxed text-center mb-12 font-medium bg-white/[0.02] p-8 rounded-3xl border border-white/[0.05]">
                      <span className="text-blue-400 text-4xl leading-none">"</span>
                      {selectedPost.summary}
                      <span className="text-blue-400 text-4xl leading-none">"</span>
                    </p>

                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-transparent mx-auto mb-14 rounded-full" />

                    {/* الأقسام الداخلية والصور */}
                    {selectedPost.sections.map((sec, idx) => (
                      <div key={idx} className="mb-14">
                        <h3 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-3">
                          <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span>
                          {sec.heading}
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8">{sec.text}</p>
                        
                        {sec.image && (
                          <div className="rounded-[2rem] overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                            <img src={sec.image} alt={sec.heading} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="text-center pt-8 border-t border-white/10 mt-12">
                      <p className="text-slate-400 font-bold mb-4">هل أعجبك المقال؟ شاركه الآن</p>
                      <button onClick={() => setSelectedPost(null)} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
                        العودة للمدونة
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
