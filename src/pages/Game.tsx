import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb, Zap, Trophy, Gamepad2 } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { GameEngine } from '../components/game/GameEngine'

export default function Game() {
  const { isAr } = useLanguage()

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F7F8FA] text-[#15191E] font-sans antialiased selection:bg-[#0062D2] selection:text-white pt-24 pb-28"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#68717D] hover:text-[#0062D2] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Editorial Hero Header */}
        <div className="mb-10 max-w-3xl">
          <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3">
            INTERACTIVE EXPERIENCE
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#15191E] tracking-tight leading-[1.12] mb-5">
            {isAr ? 'رحلة النور | بطل الإنارة الحديثة' : 'Light Quest | Modern Enarah Hero'}
          </h1>
          <p className="text-base sm:text-lg text-[#68717D] font-normal leading-relaxed">
            {isAr
              ? 'ساد الظلام أرجاء المدينة والفلل المعمارية! تحكم ببطل اللمبة الذكية، واجمع كابلات النحاس الإيطالية وشرارات الطاقة لإنارة المصابيح وتشغيل القاطع الرئيسي للفوز بكوبون خصم حقيقي.'
              : 'Darkness has fallen across the city! Guide our smart Lightbulb Hero, collect certified copper wires and energy sparks to illuminate chandeliers and pull the master switch to earn an exclusive discount voucher.'}
          </p>
        </div>

        {/* Game Canvas Box */}
        <div className="mb-14 bg-white rounded-3xl p-4 sm:p-8 border border-[#E7EAF0] shadow-sm overflow-hidden">
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
