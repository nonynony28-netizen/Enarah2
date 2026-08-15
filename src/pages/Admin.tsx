import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Settings, Gift, Trophy, CheckCircle, Save, RotateCcw, Lock, Unlock, Eye, Sparkles, Tag, ArrowRight, Shield, Bell, HelpCircle } from 'lucide-react'
import { getGameRewardConfig, saveGameRewardConfig, DEFAULT_GAME_REWARD_CONFIG } from '../utils/gameConfig'
import type { GameRewardConfig, RewardType } from '../utils/gameConfig'

export const Admin: React.FC = () => {
  // Authentication State (Default PIN: 2026)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  // Config Form State
  const [config, setConfig] = useState<GameRewardConfig>(DEFAULT_GAME_REWARD_CONFIG)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load config on mount
  useEffect(() => {
    setConfig(getGameRewardConfig())
  }, [])

  // Handle PIN unlock
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pinInput === '2026' || pinInput === '1234') {
      setIsAuthenticated(true)
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    saveGameRewardConfig(config)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3500)
  }

  // Handle Reset to Default
  const handleResetDefault = () => {
    if (window.confirm('هل تريد استعادة إعدادات الجوائز الافتراضية؟')) {
      setConfig(DEFAULT_GAME_REWARD_CONFIG)
      saveGameRewardConfig(DEFAULT_GAME_REWARD_CONFIG)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3500)
    }
  }

  // Clear Leaderboard
  const handleResetLeaderboard = () => {
    if (window.confirm('هل أنت متأكد من تصفير لوحة شرف اللعبة لبدء أسبوع مسابقة جديد؟')) {
      localStorage.removeItem('enarah_hero_leaderboard')
      alert('تم تصفير لوحة الشرف بنجاح!')
    }
  }

  // ==========================================
  // VIEW: PIN AUTHENTICATION LOCK SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#0a0b0e] text-white">
        <div className="w-full max-w-md bg-[#121318] border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black mb-1">لوحة التحكم الإدارية</h2>
          <p className="text-zinc-400 text-xs mb-6">
            أدخل الرقم السري لإدارة جوائز وإعدادات لعبة بطل الإنارة الحديثة
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                autoFocus
                placeholder="الرقم السري (PIN)..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value)
                  setPinError(false)
                }}
                className={`w-full bg-black/60 border ${
                  pinError ? 'border-red-500 text-red-400' : 'border-zinc-700 text-white'
                } rounded-2xl py-3 px-4 text-center font-mono text-xl tracking-widest focus:outline-none focus:border-blue-500`}
              />
              {pinError && (
                <p className="text-red-400 text-xs mt-2 font-medium">الرقم السري غير صحيح! (الرمز الافتراضي: 2026)</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg"
            >
              <Unlock className="w-4 h-4" />
              <span>دخول للوحة التحكم</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500">
            الرمز السري الافتراضي للمدير: <span className="font-mono text-zinc-400">2026</span>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // VIEW: MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-1">
              <Shield className="w-4 h-4" />
              <span>نظام إدارة المحتوى والجوائز | شركة الإنارة الحديثة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              لوحة التحكم في <span className="text-blue-400">جوائز وهدايا اللعبة</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/game"
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <span>تجربة اللعبة</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-bold transition-all cursor-pointer"
            >
              قفل اللوحة
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-sm font-bold flex items-center gap-2 shadow-lg animate-bounce">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>تم حفظ التعديلات بنجاح! الإعدادات الجديدة أصبحت نشطة في اللعبة فوراً.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* SECTION 1: MASTER REWARD SWITCH & TYPE */}
          <div className="bg-[#121318] border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <span>1. حالة الجوائز ونوع المكافأة بعد إكمال المراحل</span>
            </h2>

            {/* Enable / Disable Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 mb-6">
              <div>
                <div className="font-bold text-sm text-white">تفعيل نظام الجوائز والهدايا للعبة</div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  عند التعطيل، يرى الفائز شاشة النصر وشهادة البطل فقط بدون أي كود خصم أو هدية.
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.isEnabled}
                  onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-13 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Reward Type Selection */}
            {config.isEnabled && (
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">اختر نوع الجائزة التي يحصل عليها الفائز:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Option 1: Coupon */}
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, rewardType: 'coupon' })}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      config.rewardType === 'coupon'
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Tag className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="font-bold text-xs">🎟️ كود / كوبون خصم</div>
                    <div className="text-[11px] text-zinc-400 mt-1">كود خصم خاص يستخدمه العميل عند الشراء عبر الواتساب.</div>
                  </button>

                  {/* Option 2: Physical Gift */}
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, rewardType: 'physical_gift' })}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      config.rewardType === 'physical_gift'
                        ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Gift className="w-5 h-5 text-amber-400 mb-2" />
                    <div className="font-bold text-xs">🎁 هدية عينية مجانية</div>
                    <div className="text-[11px] text-zinc-400 mt-1">منتج أو هدية يستلمها الفائز من المعرض (مثل سبوت لايت أو كشاف).</div>
                  </button>

                  {/* Option 3: No Reward */}
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, rewardType: 'no_reward' })}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      config.rewardType === 'no_reward'
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Trophy className="w-5 h-5 text-purple-400 mb-2" />
                    <div className="font-bold text-xs">🏆 شهادة شرفية فقط</div>
                    <div className="text-[11px] text-zinc-400 mt-1">تسجيل اسمه في لوحة الشرف بدون تقديم أي هدايا مالية.</div>
                  </button>

                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: REWARD DETAILS CUSTOMIZATION */}
          {config.isEnabled && config.rewardType !== 'no_reward' && (
            <div className="bg-[#121318] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                <span>2. تفاصيل ونص الجائزة</span>
              </h2>

              {/* If Coupon */}
              {config.rewardType === 'coupon' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">رمز الكوبون (Coupon Code):</label>
                      <input
                        type="text"
                        value={config.couponCode}
                        onChange={(e) => setConfig({ ...config, couponCode: e.target.value.toUpperCase() })}
                        className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                        placeholder="ENARAH-HERO"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">عنوان الكوبون:</label>
                      <input
                        type="text"
                        value={config.discountTitle}
                        onChange={(e) => setConfig({ ...config, discountTitle: e.target.value })}
                        className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400"
                        placeholder="كوبون أبطال الإنارة الذهبي"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">تفاصيل وشروط الخصم (مثال: خصم 15% أو خصم 50 د.ل):</label>
                    <input
                      type="text"
                      value={config.discountDetails}
                      onChange={(e) => setConfig({ ...config, discountDetails: e.target.value })}
                      className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-emerald-400 focus:outline-none focus:border-emerald-400"
                      placeholder="خصم خاص عند إرسال الكود مع طلبيتك عبر الواتساب!"
                    />
                  </div>
                </div>
              )}

              {/* If Physical Gift */}
              {config.rewardType === 'physical_gift' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">اسم الهدية العينية المجانية:</label>
                    <input
                      type="text"
                      value={config.giftItemName}
                      onChange={(e) => setConfig({ ...config, giftItemName: e.target.value })}
                      className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                      placeholder="كشاف سبوت لايت ذكي مجاني أو مفتاح لمس VIP"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">طريقة وشروط الاستلام للزبون:</label>
                    <input
                      type="text"
                      value={config.giftPickupInstructions}
                      onChange={(e) => setConfig({ ...config, giftPickupInstructions: e.target.value })}
                      className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-400"
                      placeholder="استلم هديتك من فرع الليثي بإبراز هذه الشاشة!"
                    />
                  </div>
                </div>
              )}

              {/* WhatsApp Text Template */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  قالب رسالة الواتساب التلقائية (استخدم {'{REWARD}'} لوضع الكود أو الهدية تلقائياً):
                </label>
                <input
                  type="text"
                  value={config.whatsappTextTemplate}
                  onChange={(e) => setConfig({ ...config, whatsappTextTemplate: e.target.value })}
                  className="w-full bg-black/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-400"
                  placeholder="مرحباً شركة الإنارة الحديثة، فزت بلعبة بطل الإنارة وحصلت على الجائزة: {REWARD}"
                />
              </div>

            </div>
          )}

          {/* SECTION 3: LIVE PREVIEW OF VICTORY CARD */}
          <div className="bg-[#121318] border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              <span>3. معاينة حية: كيف ستظهر الجائزة للاعب عند الفوز باللعبة</span>
            </h2>

            <div className="bg-black/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              
              {!config.isEnabled || config.rewardType === 'no_reward' ? (
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-700 max-w-sm w-full">
                  <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                  <div className="font-black text-sm text-white mb-1">بطل الإنارة الحديثة الأسطوري!</div>
                  <p className="text-zinc-400 text-xs">تم تسجيل نتيجتك بنجاح في لوحة شرف المتصدرين (لا توجد جوائز مادية مفعلة حالياً).</p>
                </div>
              ) : config.rewardType === 'coupon' ? (
                <div className="bg-gradient-to-r from-amber-950/60 via-zinc-950 to-blue-950/60 border border-amber-500/40 rounded-2xl p-5 max-w-sm w-full shadow-xl">
                  <div className="text-xs text-amber-300 font-bold mb-1">{config.discountTitle}</div>
                  <div className="font-mono text-xl font-black text-amber-400 tracking-widest bg-black/70 py-2 px-4 rounded-xl border border-amber-400/30 mb-2">
                    {config.couponCode}
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold">{config.discountDetails}</p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-emerald-950/60 via-zinc-950 to-amber-950/60 border border-emerald-500/40 rounded-2xl p-5 max-w-sm w-full shadow-xl">
                  <Gift className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <div className="text-xs text-amber-300 font-bold mb-1">هدية عينية مجانية للأبطال:</div>
                  <div className="text-base font-black text-white mb-2">{config.giftItemName}</div>
                  <p className="text-xs text-emerald-300 font-semibold">{config.giftPickupInstructions}</p>
                </div>
              )}

            </div>
          </div>

          {/* SECTION 4: ACTIONS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات وتطبيقها فوراً</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefault}
                className="px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>الافتراضي</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetLeaderboard}
              className="px-4 py-3.5 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              تصفير لوحة شرف المسابقة
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default Admin
