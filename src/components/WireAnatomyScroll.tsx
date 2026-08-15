import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Zap, Shield, HelpCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function WireAnatomyScroll() {
  const { isAr } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 15%', 'end 85%']
  })

  // Map scroll progress to the widths of insulation and sheath layers
  // 1. Insulation grows from scroll 0.1 to 0.5 (covers x=150 to x=480, max width = 330)
  const insulationWidth = useTransform(scrollYProgress, [0.15, 0.5], [0, 330])
  // 2. Outer sheath grows from scroll 0.5 to 0.85 (covers x=300 to x=480, max width = 180)
  const sheathWidth = useTransform(scrollYProgress, [0.5, 0.85], [0, 180])

  // Fade animations for label pointers
  const copperLabelOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.3])
  const insulationLabelOpacity = useTransform(scrollYProgress, [0.35, 0.5, 0.75], [0, 1, 0.3])
  const sheathLabelOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1])

  return (
    <div ref={containerRef} className="relative w-full min-h-[130vh] lg:min-h-[160vh] py-10 my-10">
      <div className="text-center mb-10 max-w-2xl mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
          {isAr ? 'التشريح التفاعلي للأسلاك الإيطالية' : 'Interactive Anatomy of Italian Wires'}
        </h3>
        <p className="text-xs md:text-sm text-slate-400">
          {isAr 
            ? 'حرك الصفحة للأسفل وشاهد تفكيك وتركيب طبقات السلك المعتمد مباشرة خطوة بخطوة'
            : 'Scroll down to see the step-by-step interactive assembly of our certified wires'}
        </p>
      </div>

      {/* Sticky Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* Left Sticky Panel: Visual Wire Render */}
        <div className="lg:col-span-6 sticky top-28 h-[45vh] lg:h-[55vh] flex items-center justify-center p-6 rounded-2xl bg-[#111215] border border-white/[0.08] shadow-sm overflow-hidden z-20">
          {/* SVG Anatomy Visual */}
          <div className="w-full max-w-[480px] relative">
            <svg viewBox="0 0 500 200" className="w-full h-auto overflow-visible">
              <defs>
                {/* Copper Core Gradient & Glow */}
                <linearGradient id="copperGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <filter id="copperGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* PVC Insulation Gradient (Blue) */}
                <linearGradient id="pvcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>

                {/* Outer Sheath Gradient (Dark Grey / Black) */}
                <linearGradient id="sheathGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>

                {/* Inner Shadows for realism */}
                <linearGradient id="wireShadow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="60%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* 1. Copper Wire Core (Permanent Base Layer) */}
              <g id="copper-core">
                <rect x="20" y="80" width="460" height="40" rx="4" fill="url(#copperGrad)" filter="url(#copperGlowFilter)" />
                <rect x="20" y="80" width="460" height="40" rx="4" fill="url(#wireShadow)" />
                {/* Copper strands simulation */}
                <line x1="20" y1="88" x2="480" y2="88" stroke="#fef3c7" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="6 3" />
                <line x1="20" y1="96" x2="480" y2="96" stroke="#b45309" strokeWidth="1.5" strokeOpacity="0.5" />
                <line x1="20" y1="104" x2="480" y2="104" stroke="#fef3c7" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="8 4" />
                <line x1="20" y1="112" x2="480" y2="112" stroke="#b45309" strokeWidth="1.5" strokeOpacity="0.5" />
              </g>

              {/* 2. PVC Primary Insulation (Animated Layer) */}
              <motion.g id="pvc-insulation">
                <motion.rect
                  x="150"
                  y="70"
                  height="60"
                  rx="6"
                  fill="url(#pvcGrad)"
                  style={{ width: insulationWidth }}
                />
                <motion.rect
                  x="150"
                  y="70"
                  height="60"
                  rx="6"
                  fill="url(#wireShadow)"
                  style={{ width: insulationWidth }}
                />
              </motion.g>

              {/* 3. Outer Flame Retardant Sheath (Animated Layer) */}
              <motion.g id="outer-sheath">
                <motion.rect
                  x="300"
                  y="60"
                  height="80"
                  rx="8"
                  fill="url(#sheathGrad)"
                  style={{ width: sheathWidth }}
                />
                <motion.rect
                  x="300"
                  y="60"
                  height="80"
                  rx="8"
                  fill="url(#wireShadow)"
                  style={{ width: sheathWidth }}
                />
              </motion.g>

              {/* Animated Current Electron Particles */}
              <line x1="30" y1="100" x2="470" y2="100" stroke="#fde047" strokeWidth="2" strokeDasharray="8 12" className="current-flow" />

              {/* Dynamic Overlay Labels */}
              {/* Copper Label */}
              <motion.g style={{ opacity: copperLabelOpacity }}>
                <line x1="75" y1="80" x2="75" y2="35" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="75" cy="80" r="3" fill="#f59e0b" />
                <rect x="25" y="15" width="100" height="22" rx="6" fill="#18181b" stroke="#f59e0b" strokeWidth="1" />
                <text x="75" y="30" fill="#fef3c7" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {isAr ? 'نحاس نقي 99.9%' : 'Pure Copper 99.9%'}
                </text>
              </motion.g>

              {/* PVC Label */}
              <motion.g style={{ opacity: insulationLabelOpacity }}>
                <line x1="225" y1="130" x2="225" y2="170" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="225" cy="130" r="3" fill="#3b82f6" />
                <rect x="175" y="170" width="100" height="22" rx="6" fill="#18181b" stroke="#3b82f6" strokeWidth="1" />
                <text x="225" y="185" fill="#bfdbfe" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {isAr ? 'عازل PVC ملون' : 'Colored PVC'}
                </text>
              </motion.g>

              {/* Sheath Label */}
              <motion.g style={{ opacity: sheathLabelOpacity }}>
                <line x1="390" y1="60" x2="390" y2="20" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="390" cy="60" r="3" fill="#94a3b8" />
                <rect x="340" y="5" width="100" height="22" rx="6" fill="#18181b" stroke="#94a3b8" strokeWidth="1" />
                <text x="390" y="20" fill="#f1f5f9" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {isAr ? 'غلاف خارجي متين' : 'Outer Sheath'}
                </text>
              </motion.g>
            </svg>

            <style>{`
              @keyframes electronFlow {
                0% { stroke-dashoffset: 40; }
                100% { stroke-dashoffset: 0; }
              }
              .current-flow {
                animation: electronFlow 1.2s linear infinite;
              }
            `}</style>
          </div>
        </div>

        {/* Right Panel: Storytelling Sections */}
        <div className="lg:col-span-6 space-y-16 lg:space-y-24 pb-28 py-8">
          
          {/* Card 1 */}
          <div className="min-h-[30vh] lg:min-h-[38vh] flex flex-col justify-center p-6 md:p-8 rounded-2xl bg-[#111215] border border-white/[0.08] space-y-3 text-right">
            <div className="flex items-center gap-3 justify-end">
              <h4 className="text-lg md:text-xl font-bold text-white">
                {isAr ? '1. القلب الموصل: النحاس النقي' : '1. Conductor: Pure Copper'}
              </h4>
              <div className="p-2 rounded-xl bg-zinc-900 text-amber-400 border border-zinc-800">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed font-normal">
              {isAr 
                ? 'يتكون قلب السلك من نحاس خام فائق النقاء بنسبة 99.9%. هذا النقاء يضمن أعلى ناقلية كهربائية ممكنة مع تقليل المقاومة للحد الأدنى، مما يمنع ارتفاع حرارة الكابل ويحمي منزلك من مخاطر التماس الحراري.'
                : 'The conductor core consists of 99.9% pure copper. This guarantees high electrical conductivity, minimizing resistance to prevent heat buildup and electrical fire hazards.'}
            </p>
          </div>

          {/* Card 2 */}
          <div className="min-h-[30vh] lg:min-h-[38vh] flex flex-col justify-center p-6 md:p-8 rounded-2xl bg-[#111215] border border-white/[0.08] space-y-3 text-right">
            <div className="flex items-center gap-3 justify-end">
              <h4 className="text-lg md:text-xl font-bold text-white">
                {isAr ? '2. العازل الداخلي: PVC ملون' : '2. Insulation: PVC Compound'}
              </h4>
              <div className="p-2 rounded-xl bg-zinc-900 text-blue-400 border border-zinc-800">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed font-normal">
              {isAr 
                ? 'طبقة حماية عازلة مصنوعة من مادة الـ PVC عالية الجودة والمرونة. يتم تلوينها بالأزرق أو البني أو الأصفر والأخضر لتمييز الفازات والخط الأرضي، وهي مصممة لعزل التيار بالكامل وتحمل الفولتية العالية دون تلف.'
                : 'A highly flexible primary PVC insulation layer. It is color-coded (blue, brown, or yellow-green) to distinguish live, neutral, and earth lines, engineered to isolate high voltages safely.'}
            </p>
          </div>

          {/* Card 3 */}
          <div className="min-h-[30vh] lg:min-h-[38vh] flex flex-col justify-center p-6 md:p-8 rounded-2xl bg-[#111215] border border-white/[0.08] space-y-3 text-right">
            <div className="flex items-center gap-3 justify-end">
              <h4 className="text-lg md:text-xl font-bold text-white">
                {isAr ? '3. الغلاف الخارجي: حماية إضافية ومقاومة حريق' : '3. Protective Sheath: Flame-Retardant Jacket'}
              </h4>
              <div className="p-2 rounded-xl bg-zinc-900 text-zinc-400 border border-zinc-800">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed font-normal">
              {isAr 
                ? 'الغلاف الخارجي المتين الذي يحمي الأسلاك الداخلية من الرطوبة، الاحتكاك، والتآكل أثناء السحب داخل الأنابيب الجدارية. يحتوي الغلاف على مركبات خاصة تثبط انتشار اللهب ومقاومة للاشتعال لأعلى درجات الأمان.'
                : 'A durable outer jacket protecting inner wires from moisture, friction, and abrasion. Formulated with flame-retardant compounds for maximum safety.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
