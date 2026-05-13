 import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
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
    name: 'فرع بنغازي - الليثي',
    address: 'مقابل مدرسة العيد الفضي',
    phones: ['0916580068', '0926580068'],
    hours: 'من الساعة 8 صباحاً حتى الساعة 10 مساءً',
  },
  {
    name: 'فرع البيضاء الاول',
    address: 'مفترق رويفع الأنصاري',
    phones: ['0911910600', '0921910600'],
    hours: 'من الساعة 8 صباحاً حتى الساعة 10 مساءً',
  },
  {
    name: 'فرع البيضاء الثاني',
    address: 'مقابل مول البكوش',
    phones: ['0919219100', '0929219100'],
    hours: 'من الساعة 8 صباحاً حتى الساعة 10 مساءً',
  },
]

export default function Branches() {
  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              فروعنا
            </h1>

            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
              نخدمكم عبر فروعنا داخل ليبيا لتوفير أفضل حلول الإضاءة والمواد الكهربائية
            </p>

            <div className="w-16 h-1 bg-blue-400 mx-auto rounded-full mt-4 shadow-[0_0_14px_rgba(59,130,246,0.45)]" />
          </div>
        </FadeIn>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch, i) => (
            <FadeIn key={branch.name} delay={i * 0.1}>
              <div className="bg-darkblue-light border border-white/5 rounded-2xl p-6 hover:border-blue-400/30 transition-all duration-300 hover:shadow-glass">

                {/* Branch Title */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                    {branch.name}
                  </h3>
                </div>

                {/* Branch Details */}
                <div className="space-y-4">

                  {/* Address */}
                  <div className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                    <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>{branch.address}</span>
                  </div>

                  {/* Phones */}
                  <div className="flex items-start gap-3 text-white/70 text-sm">
                    <Phone className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />

                    <div className="flex flex-col">
                      {branch.phones.map((phone) => (
                        <span key={phone}>{phone}</span>
                      ))}
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                    <Clock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
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
