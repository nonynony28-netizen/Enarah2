import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

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
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">معرض المشاريع</h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              نماذج من أعمالنا في مختلف القطاعات
            </p>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full mt-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, i) => (
            <FadeIn key={project.name} delay={i * 0.1}>
              <div className="group relative bg-darkblue-light border border-white/5 rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-glass">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkblue via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-gold/90 text-darkblue text-xs font-bold rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-white group-hover:text-gold transition-colors mb-1">
                    {project.name}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{project.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  )
}
