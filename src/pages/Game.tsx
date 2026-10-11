import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb, Zap, Trophy, Gamepad2 } from 'lucide-react'
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
      <section className="relative bg-[#101820] text-white pt-12 pb-14 overflow-hidden border-b border-[#202936]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0062D2]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#0062D2] animate-pulse" />
                <span>{isAr ? 'تجربة تفاعلية حصرية' : 'Exclusive Interactive Experience'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {isAr ? 'رحلة النور | بطل الإنارة الحديثة' : 'Light Quest | Modern Enarah Hero'}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {isAr
                  ? 'ساد الظلام أرجاء المدينة والفلل المعمارية! تحكم ببطل اللمبة الذكية، واجمع كابلات النحاس الإيطالية وشرارات الطاقة لإنارة المصابيح وتشغيل القاطع الرئيسي للفوز بكوبون خصم حقيقي.'
                  : 'Darkness has fallen across the city! Guide our smart Lightbulb Hero, collect certified copper wires and energy sparks to illuminate chandeliers and pull the master switch to earn an exclusive discount voucher.'}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'تحكم عبر اللمس أو لوحة المفاتيح' : 'Touch & Keyboard Support'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'جوائز وكوبونات شراء فورية' : 'Instant Discount Vouchers'}</span>
                </div>
              </div>
            </div>

            {/* Quick Trophy Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md lg:w-72 shrink-0 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'جائزة إتمام المرحلة' : 'Stage Completion Prize'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'كود خصم فوري 5% إلى 10% على مشترياتك القادمة من صالة العرض.'
                  : 'Instant 5% to 10% discount voucher at our showroom.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-10">
        {/* Game Canvas Box */}
        <div className="mb-14 bg-white rounded-3xl p-4 sm:p-8 border border-[#E7EAF0] shadow-md overflow-hidden">
          <GameEngine />
        </div>

        {/* Instructions & Game Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-[#E7EAF0]">
          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '1. اجمع كابلات النحاس' : '1. Collect Copper Cables'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'اجمع لفات الأسلاك الإيطالية والسبوت لايت لتوسيع دائرة الضوء ومضاعفة نقاطك.'
                  : 'Gather certified copper wire coils and spotlights to expand your light radius.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0062D2] mb-4">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '2. أنر المصابيح المعمارية' : '2. Light Up Fixtures'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'مر بالقرب من كشافات الإنارة المطفأة لتشتعل بالنور الدائم وتكشف خريطة المكان.'
                  : 'Walk near unlit architectural fixtures to bring permanent light to the rooms.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-4">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '3. تحكم فائق وقدرات خاصة' : '3. Special Abilities'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'بدّل بين أزرار D-Pad الدقيقة أو عصا 360° أو اللمس المباشر، وفعل تيربو السرعة (⚡) ووميض التجميد (💡).'
                  : 'Switch between tactile D-Pad, 360° joystick, or touch steering. Trigger Turbo (⚡) & Flash Stun (💡).'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E7EAF0] shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#15191E] mb-1.5">
                {isAr ? '4. شغّل القاطع واكسب الخصم' : '4. Pull Breaker & Win'}
              </h4>
              <p className="text-[#68717D] text-xs leading-relaxed font-normal">
                {isAr
                  ? 'ارفع مقبض القاطع الرئيسي لتنير المدينة واكسب كود الخصم الفوري لمشترياتك القادمة.'
                  : 'Pull the master breaker to illuminate the city and claim your exclusive discount code.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
