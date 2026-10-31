import React from 'react'
import { Lightbulb, Zap, Trophy, Gamepad2, Sparkles, Compass } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { GameEngine } from '../components/game/GameEngine'

export default function Game() {
  const { isAr } = useLanguage()

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans antialiased pb-20"
    >
      {/* =====================================================================
          01. Architectural Hero Header (Deep Corporate Navy #101820)
          ===================================================================== */}
      <section className="relative bg-[#101820] text-white pt-10 pb-12 overflow-hidden border-b border-[#202936]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0062D2]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'مغامرة منصات تفاعلية 2.5D • 5 عوالم' : 'Interactive 2.5D Platformer • 5 Worlds'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {isAr ? 'بطل الإنارة | مغامرة عالم الضوء' : 'Light Hero | World of Light Adventure'}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {isAr
                  ? 'انطلق في مغامرة منصات شيّقة عبر 5 عوالم فريدة: مدينة الأنوار، مصنع الكهرباء، عالم الأسلاك النحاسية، مدينة المستقبل، وقلعة الطاقة! اقفز برشاقة، اجمع نجوم الطاقة وكابلات النحاس، واهزم حارس الطاقة الآلي للفوز بكوبون خصم فوري.'
                  : 'Embark on an exciting side-scrolling platform adventure across 5 unique worlds! Jump across moving platforms and copper springs, collect Energy Stars, and defeat the Mechanical Energy Guardian to win an exclusive discount voucher.'}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{isAr ? 'قفز متجاوب وتحكم مريح للهاتف والكمبيوتر' : 'Responsive Jumping & Touch/Keyboard Controls'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? '5 عوالم متنوعة وحفظ تلقائي للتقدم' : '5 Distinct Worlds & Auto-Save Progression'}</span>
                </div>
              </div>
            </div>

            {/* Quick Trophy Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md lg:w-72 shrink-0 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'جائزة إتمام المغامرة' : 'Adventure Completion Prize'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'كود خصم فوري ومكافآت حصرية عند إتمام العوالم وتسجيل اسمك في لوحة شرف الأبطال.'
                  : 'Instant discount voucher and exclusive rewards upon completing the worlds.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-8">
        {/* Game Canvas Box */}
        <div className="mb-12 bg-white rounded-3xl p-3 sm:p-6 border border-[#E7EAF0] shadow-md overflow-hidden">
          <GameEngine />
        </div>

        {/* Instructions & Game Worlds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-[#E7EAF0]">
          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '1. اجمع نجوم الطاقة' : '1. Collect Energy Stars'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'التقط نجوم الطاقة الذهبية وكرات البلازما وبطاريات الشحن المنتشرة فوق المنصات وفي المسارات السرية.'
                  : 'Gather golden Energy Stars, plasma orbs, and battery cells across platforms and secret upper paths.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0062D2] mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '2. استكشف 5 عوالم ملونة' : '2. Explore 5 Colorful Worlds'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'اعبر مدينة الأنوار، مصنع الكهرباء، عالم الأسلاك النحاسية بنوابضه المرنة، مدينة المستقبل، وقلعة الطاقة.'
                  : 'Journey through the City of Lights, Electric Factory, Copper Cable World, Future City, and Energy Fortress.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-4">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '3. قفز احترافي وتحكم سلس' : '3. Responsive Platforming'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'اضغط ضغطة قصيرة لقفزة سريعة أو ضغطة مطولة لقفزة عالية، واقفز فوق الروبوتات لتعطيلها وفتح البوابات.'
                  : 'Tap for a short hop or hold for a high jump. Stomp patrolling bots from above and activate switches.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '4. اهزم حارس الطاقة الآلي' : '4. Defeat the Energy Guardian'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'في قلعة الطاقة، تفادَ الموجات الكهرومغناطيسية وفعل قواطع التفريغ الثلاثة لتحرير الطاقة والفوز بالجائزة.'
                  : 'In the Energy Fortress, dodge shockwaves and trigger the 3 overload breakers to claim victory.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
