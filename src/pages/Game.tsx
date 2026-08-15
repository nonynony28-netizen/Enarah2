import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb, Zap, Trophy, ShieldCheck, Sparkles, Gamepad2 } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { GameEngine } from '../components/game/GameEngine'

export default function Game() {
  const { isAr } = useLanguage()

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 md:pt-28 pb-16 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back to Home button */}
        <div className="mb-6 flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white font-semibold transition-all text-sm"
          >
            <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Gamepad2 className="w-4 h-4" />
            <span>{isAr ? 'لعبة تفاعلية حصرية' : 'Exclusive Mini Game'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            {isAr ? 'رحلة النور | بطل' : 'Light Quest | Hero of'} <span className="text-blue-400">{isAr ? 'الإنارة الحديثة' : 'Modern Enarah'}</span>
          </h1>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-normal">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80">
          
          <div className="p-4 rounded-2xl bg-[#111215] border border-white/[0.08] flex items-start gap-3.5 text-right">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white mb-1">
                {isAr ? '1. اجمع شرارات الطاقة' : '1. Collect Energy'}
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-normal">
                {isAr
                  ? 'اجمع لفات الأسلاك الإيطالية والسبوت لايت لتوسيع دائرة الضوء ومضاعفة نقاطك.'
                  : 'Gather certified copper wire coils and spotlights to expand your light radius.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#111215] border border-white/[0.08] flex items-start gap-3.5 text-right">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white mb-1">
                {isAr ? '2. أنر المصابيح والثريات' : '2. Light Up Lamps'}
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-normal">
                {isAr
                  ? 'مر بالقرب من أعمدة الإنارة المطفأة لتشتعل بالنور الدائم وتكشف خريطة المكان.'
                  : 'Walk near unlit streetlamps and chandeliers to bring permanent light to the rooms.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#111215] border border-white/[0.08] flex items-start gap-3.5 text-right">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white mb-1">
                {isAr ? '3. شغّل القاطع واكسب الخصم' : '3. Power On & Win'}
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-normal">
                {isAr
                  ? 'ارفع مقبض القاطع الرئيسي لتنير العالم واكسب كود الخصم الحصري لمشترياتك.'
                  : 'Pull the master breaker to illuminate the city and claim your special voucher code.'}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
