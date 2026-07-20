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
        <div className="lg:col-span-6 sticky top-28 h-[45vh] lg:h-[55vh] flex items-center justify-center p-6 rounded-[2.5rem] bg-[#0f213a]/40 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden z-20">
          {/* Ambient Glows */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px]" />

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

                {/* Insulation Gradient (Blue PVC) */}
                <linearGradient id="insulationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>

                {/* Sheath Gradient (Gray PVC) */}
                <linearGradient id="sheathGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* 1. Core Copper (Always drawn first, full width from 20 to 480) */}
              <g>
                <rect x="20" y="90" width="460" height="20" rx="10" fill="url(#copperGrad)" filter="url(#copperGlowFilter)" />
                {/* Dashed Line simulating flowing electrons */}
                <line x1="30" y1="100" x2="470" y2="100" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="8, 12" className="animate-electron-flow" />
              </g>

              {/* 2. PVC Insulation Layer (Grows from x=150 to x=480 on scroll) */}
              <motion.rect 
                x="150" 
                y="85" 
                height="30" 
                rx="6" 
                fill="url(#insulationGrad)"
                style={{ width: insulationWidth }} 
              />

              {/* 3. Outer Sheath Layer (Grows from x=300 to x=480 on scroll) */}
              <motion.rect 
                x="300" 
                y="80" 
                height="40" 
                rx="8" 
                fill="url(#sheathGrad)" 
                style={{ width: sheathWidth }}
              />

              {/* === Label pointers and texts === */}
              {/* Copper Pointer */}
              <motion.g style={{ opacity: copperLabelOpacity }} className="transition-opacity">
                <line x1="85" y1="100" x2="85" y2="35" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.5" strokeDasharray="3,3" />
                <circle cx="85" cy="100" r="3" fill="#f59e0b" />
                <circle cx="85" cy="35" r="3" fill="#f59e0b" />
                <text x="85" y="25" fill="#f59e0b" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  {isAr ? 'قلب نحاس نقي 99.9%' : '99.9% Copper Core'}
                </text>
              </motion.g>

              {/* Insulation Pointer */}
              <motion.g style={{ opacity: insulationLabelOpacity }} className="transition-opacity">
                <line x1="225" y1="100" x2="225" y2="165" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" strokeDasharray="3,3" />
                <circle cx="225" cy="100" r="3" fill="#3b82f6" />
                <circle cx="225" cy="165" r="3" fill="#3b82f6" />
                <text x="225" y="180" fill="#3b82f6" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  {isAr ? 'عازل PVC فاخر ملون' : 'Colored PVC Insulation'}
                </text>
              </motion.g>

              {/* Sheath Pointer */}
              <motion.g style={{ opacity: sheathLabelOpacity }} className="transition-opacity">
                <line x1="390" y1="100" x2="390" y2="35" stroke="rgba(100, 116, 139, 0.4)" strokeWidth="1.5" strokeDasharray="3,3" />
                <circle cx="390" cy="100" r="3" fill="#64748b" />
                <circle cx="390" cy="35" r="3" fill="#64748b" />
                <text x="390" y="25" fill="#94a3b8" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  {isAr ? 'غلاف خارجي مقاوم للحريق' : 'Fire-Retardant Sheath'}
                </text>
              </motion.g>
            </svg>

            {/* Custom Embedded CSS for electron flow animation */}
            <style>{`
              @keyframes electronFlow {
                from { stroke-dashoffset: 0; }
                to { stroke-dashoffset: -40; }
              }
              .animate-electron-flow {
                animation: electronFlow 1.2s linear infinite;
              }
            `}</style>
          </div>
        </div>

        {/* Right Panel: Storytelling Sections */}
        <div className="lg:col-span-6 space-y-24 lg:space-y-36 pb-32 py-10">
          
          {/* Card 1 */}
          <div className="min-h-[35vh] lg:min-h-[45vh] flex flex-col justify-center p-6 md:p-8 rounded-3xl bg-[#0f213a]/30 border border-white/5 hover:border-amber-500/20 transition-all duration-300 space-y-4 text-right">
            <div className="flex items-center gap-3 justify-end">
              <h4 className="text-lg md:text-xl font-bold text-white">
                {isAr ? '1. القلب الموصل: النحاس النقي' : '1. Conductor: Pure Copper'}
              </h4>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isAr 
                ? 'يتكون قلب السلك من نحاس خام فائق النقاء بنسبة 99.9%. هذا النقاء يضمن أعلى ناقلية كهربائية ممكنة مع تقليل المقاومة للحد الأدنى، مما يمنع ارتفاع حرارة الكابل ويحمي منزلك من مخاطر التماس الحراري.'
                : 'The conductor core consists of 99.9% pure copper. This guarantees high electrical conductivity, minimizing resistance to prevent heat buildup and electrical fire hazards.'}
            </p>
          </div>

          {/* Card 2 */}
          <div className="min-h-[35vh] lg:min-h-[45vh] flex flex-col justify-center p-6 md:p-8 rounded-3xl bg-[#0f213a]/30 border border-white/5 hover:border-blue-500/20 transition-all duration-300 space-y-4 text-right">
            <div className="flex items-center gap-3 justify-end">
              <h4 className="text-lg md:text-xl font-bold text-white">
                {isAr ? '2. العازل الداخلي: PVC ملون' : '2. Insulation: PVC Compound'}
              </h4>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isAr 
                ? 'طبقة حماية عازلة مصنوعة من مادة الـ PVC عالية الجودة والمرونة. يتم تلوينها بالأزرق أو البني أو الأصفر والأخضر لتمييز الفازات والخط الأرضي، وهي مصممة لعزل التيار بالكامل وتحمل الفولتية العالية دون تلف.'
                : 'A highly flexible primary PVC insulation layer. It is color-coded (blue, brown, or yellow-green) to distinguish live, neutral, and earth lines, engineered to isolate high voltages safely.'}
            </p>
          </div>

          {/* Card 3 */}
          <div className="min-h-[35vh] lg:min-h-[45vh] flex flex-col justify-center p-6 md:p-8 rounded-3xl bg-[#0f213a]/30 border border-white/5 hover:border-slate-500/20 transition-all duration-300 space-y-4 text-right">
            <div className="flex items-center gap-3 justify-end">
              <h4 className="text-lg md:text-xl font-bold text-white">
                {isAr ? '3. الغلاف الخارجي: حماية إضافية ومقاومة حريق' : '3. Protective Sheath: Flame-Retardant Jacket'}
              </h4>
              <div className="p-2 rounded-xl bg-slate-500/10 text-slate-400 border border-slate-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isAr 
                ? 'الغلاف الخارجي المتين الذي يحمي الأسلاك الداخلية من الرطوبة، الاحتكاك، والتآكل أثناء السحب داخل الأنابيب الجدارية. يحتوي الغلاف على مركبات خاصة تثبط انتشار اللهب ومقاومة للاشتعال لأعلى درجات الأمان.'
                : 'A robust outer jacket protecting the inner insulated wires from moisture, friction, and mechanical damage during installation. It features flame-retardant properties to self-extinguish in case of fire.'}
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
