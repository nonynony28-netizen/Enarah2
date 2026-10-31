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
                <span>{isAr ? 'مغامرة منصات تفاعلية 2.5D • 8 مراحل ملحمية' : 'Interactive 2.5D Platformer • 8 Epic Levels'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {isAr ? 'بطل الإنارة | مغامرة اللمبة الأسطورية' : 'Batal Al Enara | Legendary Light Bulb Adventure'}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {isAr
                  ? 'تحكم بشخصية لمبة LED المضيئة عبر 8 مراحل متدرجة الصعوبة: من مدينة النور وشارع الكهرباء ومصنع الإنارة وحي الإنترفون حتى قلعة الظلام! اجمع أسلاك النحاس (1.5 و2.5 و4 و6 مم²)، لمبات LED، السبوت لايت، وأجهزة الإنترفون لتفعيل القدرات الخاصة وهزيمة ملك الظلام الكهربائي.'
                  : 'Guide our anthropomorphic LED Light Bulb Hero across 8 progressively challenging levels! Collect 1.5mm–6mm copper wires, LED spotlights, floodlights, and intercom devices to unlock special powers and defeat the Electric King of Darkness.'}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{isAr ? 'قفز مزدوج + اندفاع سريع + 8 مقطوعات موسيقية' : 'Double Jump, Dash & 8 Original Soundtracks'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? '13 منتجاً كهربائياً بقدرات حقيقية داخل اللعب' : '13 Electrical Products with Active Abilities'}</span>
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
                  ? 'كود خصم فوري ومكافآت حصرية عند إتمام المراحل الثماني وتسجيل اسمك في لوحة شرف الأبطال.'
                  : 'Instant discount voucher and exclusive rewards upon completing the 8 levels.'}
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

        {/* Instructions & Game Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-[#E7EAF0]">
          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '1. قدرات الأسلاك والمنتجات' : '1. Wire & Product Abilities'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'سلك 1.5 مم² يجدد الطاقة، سلك 2.5 مم² يمنح سرعة فائقة، سلك 4 مم² يفعّل درع الحماية، ولمبة LED تستعيد الصحة.'
                  : '1.5mm wire restores energy, 2.5mm boosts speed, 4mm grants a shield, and LED bulbs restore health.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0062D2] mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '2. ثماني مراحل متدرجة الصعوبة' : '2. Eight Progressive Levels'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'اعبر مدينة النور، شارع الكهرباء، مصنع الإنارة، حي الإنترفون، محطة الطاقة، المدينة المظلمة، برج الإنارة، وقلعة الظلام.'
                  : 'Journey through 8 distinct levels with unique puzzles, timed escapes, blackout zones, and boss battles.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-4">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '3. قفز مزدوج واندفاع ضوئي' : '3. Double Jump & Light Dash'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'استخدم القفز المزدوج في الهواء، والاندفاع السريع (Dash)، وومضة الهجوم الضوئي لتجاوز الأعداء والمكابس.'
                  : 'Perform mid-air double jumps, high-speed dashes, and light pulse attacks to overcome 8 enemy types.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '4. اهزم ملك الظلام الكهربائي' : '4. Defeat the King of Darkness'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'واجه زعماء المراحل وصولاً إلى المعركة النهائية ذات الأطوار الثلاثة ضد ملك الظلام الكهربائي.'
                  : 'Confront unique level bosses culminating in the 3-phase final battle against the Electric King of Darkness.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
