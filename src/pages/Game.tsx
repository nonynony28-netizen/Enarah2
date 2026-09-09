import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb, Zap, Trophy, ShieldCheck, Sparkles, Gamepad2 } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { GameEngine } from '../components/game/GameEngine'

export default function Game() {
  const { isAr } = useLanguage()

  return (
    <div className="min-h-screen bg-transparent text-slate-900 pt-6 sm:pt-8 pb-16 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header with Brand Logo & Back to Home */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shadow-sm">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
              {isAr ? (
                <>
                  الإنارة <span className="text-blue-600">الحديثة</span>
                </>
              ) : (
                <>
                  ENARAH <span className="text-blue-600">MODERN</span>
                </>
              )}
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:text-blue-600 font-semibold transition-all text-xs sm:text-sm active:scale-95 shadow-sm"
          >
            <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
            <span>{isAr ? 'العودة للموقع الرئيسي' : 'Back to Website'}</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3 shadow-sm">
            <Gamepad2 className="w-4 h-4" />
            <span>{isAr ? 'لعبة تفاعلية حصرية' : 'Exclusive Mini Game'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            {isAr ? 'رحلة النور | بطل' : 'Light Quest | Hero of'} <span className="text-blue-600">{isAr ? 'الإنارة الحديثة' : 'Modern Enarah'}</span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-normal">
            {isAr
              ? 'ساد الظلام أرجاء المدينة والفلل المعمارية! تحكم ببطل اللمبة الذكية بالقميص الأزرق، واجمع كابلات النحاس الإيطالية وشرارات الطاقة لإنارة المصابيح وتشغيل القاطع الرئيسي للفوز بكوبون خصم حقيقي.'
              : 'Darkness has fallen across the city! Guide our smart Lightbulb Hero in his blue shirt, collect certified copper wires and energy sparks to light up chandeliers and pull the master switch to earn an exclusive discount voucher.'}
          </p>
        </div>

        {/* Game Canvas Box */}
        <div className="mb-12">
          <GameEngine />
        </div>

        {/* Instructions & Game Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
          
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5 text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                {isAr ? '1. اجمع شرارات الطاقة' : '1. Collect Energy'}
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                {isAr
                  ? 'اجمع لفات الأسلاك الإيطالية والسبوت لايت لتوسيع دائرة الضوء ومضاعفة نقاطك.'
                  : 'Gather certified copper wire coils and spotlights to expand your light radius.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5 text-right">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                {isAr ? '2. أنر المصابيح والثريات' : '2. Light Up Lamps'}
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                {isAr
                  ? 'مر بالقرب من أعمدة الإنارة المطفأة لتشتعل بالنور الدائم وتكشف خريطة المكان.'
                  : 'Walk near unlit streetlamps and chandeliers to bring permanent light to the rooms.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5 text-right">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0 mt-0.5">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                {isAr ? '3. تحكم فائق وقدرات خاصة' : '3. Pro Controls & Abilities'}
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                {isAr
                  ? 'بدّل بين أزرار D-Pad الدقيقة أو عصا 360° أو اللمس المباشر، وفعل تيربو السرعة (⚡) ووميض التجميد (💡).'
                  : 'Switch between tactile D-Pad, 360° joystick, or touch steering. Trigger Turbo (⚡) & Flash Stun (💡).'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5 text-right">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                {isAr ? '4. شغّل القاطع واكسب الخصم' : '4. Power On & Win'}
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                {isAr
                  ? 'ارفع مقبض القاطع الرئيسي لتنير العالم، واحبس وحش الحمل الزائد واكسب كود الخصم الحصري.'
                  : 'Pull the master breaker to illuminate the city, defeat the overload boss, and claim your reward.'}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
