import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

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

// بيانات المشاريع
const projects = [
  {
    name: 'إضاءة فيلا سكنية',
    category: 'فلل',
    image: '/images/project-villa.jpg',
    desc: 'تصميم وتنفيذ إضاءة داخلية وخارجية لفيلا فاخرة بأحدث التقنيات.',
  },
  {
    name: 'إضاءة شركة تجارية',
    category: 'شركات',
    image: '/images/project-company.jpg',
    desc: 'حلول إضاءة متكاملة لمقر شركة بمساحة واسعة مع إضاءة ذكية.',
  },
  {
    name: 'إضاءة متجر',
    category: 'محلات',
    image: '/images/project-shop.jpg',
    desc: 'تصميم إضاءة مخصصة لمتجر بأجواء فاخرة يبرز المنتجات بشكل مثالي.',
  },
  {
    name: 'إضاءة واجهة خارجية',
    category: 'واجهات خارجية',
    image: '/images/project-facade.jpg',
    desc: 'إضاءة معمارية لواجهة مبنى بتقنيات LED متطورة.',
  },
]

export default function Projects() {
  return (
    <div className="pt-24 md:pt-32 pb-24 bg-[#0a192f] min-h-screen relative overflow-hidden">
      
      {/* تأثيرات الإضاءة الخلفية الزرقاء (مماثلة لباقي الموقع) */}
      <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-white via-white to-blue-400 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              معرض المشاريع
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
              نماذج من أعمالنا المتميزة في مختلف القطاعات، تعكس التزامنا بالجودة والاحترافية
            </p>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mt-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
            />
          </div>
        </FadeIn>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {projects.map((project, i) => (
            <FadeIn key={project.name} delay={i * 0.1}>
              <div className="group relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] overflow-hidden hover:bg-white/[0.04] hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] flex flex-col h-full">
                
                {/* لمعان داخلي باللون الأزرق */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0d2342]/50">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }}
                  />
                  {/* تدرج فوق الصورة */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-90 z-10" />
                  
                  {/* شارة التصنيف باللون الأزرق المضيء المتناسق مع هوية الموقع */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-4 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 text-xs font-bold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 relative z-20 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-3 line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow line-clamp-3">
                    {project.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  )
}
