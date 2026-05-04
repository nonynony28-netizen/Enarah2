import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'

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

const branches = [
  {
    name: 'الفرع الرئيسي - الرياض',
    address: 'شارع العليا، حي العليا، الرياض',
    phone: '+966 11 000 0000',
    hours: '9:00 ص - 10:00 م',
  },
  {
    name: 'فرع جدة',
    address: 'شارع التحلية، حي الروضة، جدة',
    phone: '+966 12 000 0000',
    hours: '9:00 ص - 11:00 م',
  },
  {
    name: 'فرع الدمام',
    address: 'شارع الملك فهد، حي الشاطئ، الدمام',
    phone: '+966 13 000 0000',
    hours: '9:00 ص - 10:00 م',
  },
  {
    name: 'فرع مكة المكرمة',
    address: 'شارع إبراهيم الخليل، حي الزاهر، مكة',
    phone: '+966 12 111 1111',
    hours: '8:00 ص - 12:00 ص',
  },
]

export default function Branches() {
  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">فروعنا</h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              نخدمكم في عدة فروع موزعة في مختلف مدن المملكة
            </p>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full mt-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch, i) => (
            <FadeIn key={branch.name} delay={i * 0.1}>
              <div className="bg-darkblue-light border border-white/5 rounded-xl p-6 hover:border-gold/30 transition-all duration-300 hover:shadow-glass">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{branch.name}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-white/60 text-sm">
                    <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Phone className="w-4 h-4 text-gold shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <span>{branch.hours}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  )
}
