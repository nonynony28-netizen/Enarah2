import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Award,
  Shield,
  Sparkles,
  Zap,
  ArrowLeft,
} from 'lucide-react'

// ======================================
// مكون الظهور المتدرج
// ======================================
function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
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

// ======================================
// بيانات المشاريع لإظهارها في الرئيسية
// ======================================
const featuredProjects = [
  {
   const projects = [
  {
    name: 'مول الماسة',
    category: 'مول تجاري',
    image: '/images/project-villa.jpg', // سنقوم بتغيير الصور لاحقاً
    video: '',
    desc: 'تصميم وتنفيذ حلول إضاءة شاملة وعصرية تبرز فخامة المول وتوفر تجربة تسوق مميزة.',
  },
  {
    name: 'مصحة الحياة للخدمات الطبية',
    category: 'طبي',
    image: '/images/project-company.jpg',
    video: '',
    desc: 'نظام إضاءة طبي مريح للعين يلبي أعلى معايير الجودة للمستشفيات والمراكز الصحية.',
  },
  {
    name: 'مقهى PANYOTI',
    category: 'مقاهي',
    image: '/images/project-shop.jpg',
    video: '',
    desc: 'إضاءة ديكورية دافئة تخلق أجواء هادئة ومريحة لزوار المقهى.',
  },
  {
    name: 'معرض الورفلي للسيارات',
    category: 'معارض سيارات',
    image: '/images/project-facade.jpg',
    video: '',
    desc: 'إضاءة قوية ومدروسة لتسليط الضوء على تفاصيل السيارات وإبراز لمعانها بوضوح.',
  },
]

export default function Home() {
  return (
    <div className="pt-0">
      
      {/* 1. الواجهة السينمائية */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a192f]">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <iframe
            src="https://streamable.com/e/zarpqc?autoplay=1&muted=1&nocontrols=1&loop=1&playsinline=1&preload=auto"
            allow="autoplay; fullscreen"
            className="hidden md:block w-full h-full object-cover scale-[1.2] opacity-60"
            style={{ border: 'none', pointerEvents: 'none' }}
          />
          <iframe
            src="https://streamable.com/e/lm701e?autoplay=1&muted=1&nocontrols=1&loop=1&playsinline=1&preload=auto"
            allow="autoplay; fullscreen"
            className="block md:hidden w-full h-full object-cover scale-[1.05] opacity-60"
            style={{ border: 'none', pointerEvents: 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/90 via-[#0a192f]/40 to-[#0a192f] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f]/80 via-transparent to-[#0a192f]/80 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-10 md:mt-20">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: 'easeOut' }}>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-4 md:mb-6 leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              الإنارة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">الحديثة</span>
            </h1>
            <p className="text-base md:text-2xl text-blue-50/80 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed font-medium px-2">
              كل ما تحتاجه من الإضاءة والتأسيس الكهربائي بجودة عالمية وحلول متكاملة تلبي تطلعاتك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
              <Link to="/products" className="group relative px-6 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-gradient-to-l from-blue-600 to-blue-400 text-white font-bold text-base md:text-lg rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] flex items-center justify-center gap-3 overflow-hidden hover:scale-105">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                استعرض المنتجات
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link to="/contact" className="px-6 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-white/[0.05] backdrop-blur-md border border-white/10 text-white font-bold text-base md:text-lg rounded-2xl hover:bg-white/[0.1] hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center">
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. لماذا نحن */}
      <section id="about" className="py-24 bg-[#0a192f] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                لماذا نحن؟
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              { icon: Award, title: 'جودة عالية', desc: 'نختار منتجاتنا بعناية فائقة من أفضل المصادر العالمية لضمان أعلى معايير الجودة والاستدامة.' },
              { icon: Shield, title: 'حلول متكاملة', desc: 'نقدم لك جميع احتياجاتك من الإضاءة والمواد الكهربائية الذكية في مكان واحد.' },
              { icon: Sparkles, title: 'احترافية بالعمل', desc: 'فريقنا الهندسي متخصص في مساعدتك لاختيار الحلول المثالية والتصاميم لمشروعك.' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.15}>
                <div className="group relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-400/5 border border-blue-400/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                      <item.icon className="w-8 h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">{item.title}</h3>
                    <p className="text-slate-400 text-base leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 3. أبرز المشاريع (القسم الجديد الذي سيظهر الآن في الرئيسية) */}
      <section id="featured-projects" className="py-24 bg-[#0a192f] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  أبرز مشاريعنا
                </h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
              <Link to="/projects" className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl text-white font-bold transition-all duration-300 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                شاهد كل المشاريع
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProjects.map((project, i) => (
              <FadeIn key={project.name} delay={i * 0.1}>
                <div className="group relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] overflow-hidden hover:bg-white/[0.04] hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] flex flex-col h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0d2342]/50">
                    <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-90 z-10" />
                    
                    {/* شارة التصنيف باللون الأزرق الموحد */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-4 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 text-xs font-bold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 relative z-20 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-3 line-clamp-1">{project.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-grow line-clamp-2">{project.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ابدأ مشروعك */}
      <section id="start" className="py-24 bg-[#0a192f] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="relative bg-gradient-to-br from-blue-900/40 to-blue-600/10 backdrop-blur-3xl border border-blue-400/20 rounded-[3rem] p-10 md:p-16 text-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                  ابدأ مشروعك معنا <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">اليوم</span>
                </h2>
                <p className="text-blue-100/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                  نحن هنا لنساعدك في تحويل رؤيتك إلى واقع مبهر. تواصل مع خبرائنا للحصول على استشارة هندسية وفنية لمشروعك.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 font-extrabold text-lg md:text-xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                  <Zap className="w-6 h-6 animate-pulse" />
                  تواصل معنا الآن
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      
    </div>
  )
}
