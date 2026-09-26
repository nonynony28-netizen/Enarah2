import { useState, useEffect, useRef } from 'react'
import { Building2, FileText, Phone, MessageSquare, AlertCircle, Loader2, CheckCircle, WifiOff, RefreshCw } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { trackConversionEvent } from '../utils/analytics'

const DRAFT_KEY = 'enarah_contractor_draft'

export default function Contractors() {
  const { isAr } = useLanguage()

  // استرجاع المسودة المحفوظة تلقائياً في حال انقطاع النت أو إعادة التحميل
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(DRAFT_KEY)
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return {
      name: '',
      phone: '',
      projectType: isAr ? 'شركة تشطيب' : 'Finishing Company',
      materials: ''
    }
  })

  const [error, setError] = useState('')
  const [offlineError, setOfflineError] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const hasTrackedStartRef = useRef(false)

  // حفظ مسودة الاستمارة تلقائياً عند الكتابة
  useEffect(() => {
    if (typeof window === 'undefined') return
    const timer = setTimeout(() => {
      if (formData.name || formData.phone || formData.materials) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
        if (!hasTrackedStartRef.current) {
          hasTrackedStartRef.current = true
          trackConversionEvent('quote_request_started')
        }
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [formData])

  // الاستماع لعودة الاتصال
  useEffect(() => {
    const handleOnline = () => {
      if (offlineError) setOfflineError(false)
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [offlineError])

  const handleWhatsAppSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!formData.name.trim() || !formData.phone.trim() || !formData.materials.trim()) {
      setError(isAr ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill in all required fields')
      return
    }

    if (!navigator.onLine) {
      setOfflineError(true)
      setServerError(null)
      setError('')
      return
    }

    setError('')
    setOfflineError(false)
    setServerError(null)
    setLoading(true)

    // 1. تسجيل طلب التسعير في قاعدة البيانات أولاً لحفظ الفرصة البيعية
    try {
      const idempotencyKey = `quote_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
      const res = await fetch('https://enarah2.vercel.app/api/save-user', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: `[نوع المشروع: ${formData.projectType}] - ${formData.materials}`,
          type: 'quote_request',
        })
      })

      if (!res.ok) {
        throw new Error('Server request failed')
      }

      // مسح المسودة بعد نجاح التسجيل
      localStorage.removeItem(DRAFT_KEY)
    } catch (err) {
      if (!navigator.onLine) {
        setOfflineError(true)
        setServerError(null)
        setLoading(false)
        return
      } else {
        setServerError(isAr ? 'تعذر إرسال الطلب حالياً. يرجى المحاولة مرة أخرى.' : 'Unable to send request currently. Please try again.')
        setLoading(false)
        return
      }
    } finally {
      setLoading(false)
    }

    // 2. تسجيل حدث التحويل في نظام التحليلات
    trackConversionEvent('quote_request_submitted', {
      projectType: formData.projectType,
      leadType: 'contractor_quote'
    })

    // 3. توجيه الزبون إلى رقم الواتساب المخصص للمبيعات والكميات
    const salesPhone = '218916580068' // Modern Enarah WhatsApp sales number
    
    const whatsappMessage = isAr 
      ? `*طلب تسعير كميات وتوريدات (بوابة المقاولين)*\n` +
        `==============================\n` +
        `👤 *الجهة / الاسم:* ${formData.name}\n` +
        `📞 *رقم الهاتف:* ${formData.phone}\n` +
        `🏢 *نوع النشاط:* ${formData.projectType}\n\n` +
        `📝 *المواد والكميات المطلوبة:*\n${formData.materials}\n` +
        `==============================\n` +
        `المصدر: بوابة المقاولين - موقع الإنارة الحديثة`
      : `*Bulk Supplies & Quantities Quote Request (Contractor Portal)*\n` +
        `==============================\n` +
        `👤 *Company / Name:* ${formData.name}\n` +
        `📞 *Phone Number:* ${formData.phone}\n` +
        `🏢 *Activity Type:* ${formData.projectType}\n\n` +
        `📝 *Required Materials & Quantities:*\n${formData.materials}\n` +
        `==============================\n` +
        `Source: Contractors Portal - Modern Enarah Website`

    const url = `https://wa.me/${salesPhone}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900 pt-28 pb-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Page Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mb-2 shadow-sm">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-none text-slate-900">
            {isAr ? 'بوابة المقاولين والكميات' : 'Contractors & Bulk Portal'}
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            {isAr 
              ? 'نهتم بتقديم أفضل عروض الأسعار والتسهيلات الخاصة لشركات التشطيب، المقاولين، والمشاريع الكبرى. املأ بياناتك وموادك المطلوبة للتواصل المباشر مع قسم المبيعات والكميات لدينا.'
              : 'We provide specialized pricing and logistics services for contractors, finishing companies, and large-scale projects. Fill in your details below for a direct quote.'}
          </p>
        </div>

        {/* Info Grid & Form Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left panel: Info cards */}
          <div className="md:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-2 w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {isAr ? 'توفير وتوريد مباشر' : 'Direct Supply'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isAr 
                  ? 'نوفر كابلات وأسلاك النحاس، إنارة ذكية، سبوت لايت، وقواطع كهربائية بكميات ضخمة بأسعار تنافسية.'
                  : 'We supply high-grade cables, wires, smart switches, and spotlights directly from approved manufacturers.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-2 w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {isAr ? 'متابعة وتأكيد سريع' : 'Fast Response'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isAr 
                  ? 'يقوم منسق المبيعات لدينا بمراجعة طلبك وتحديد الخصومات الخاصة بحجم تعاملاتك فور استلام الطلب.'
                  : 'Our dedicated sales coordinators analyze your list and apply scale discounts immediately upon request.'}
              </p>
            </div>
          </div>

          {/* Right panel: Quote Request Form */}
          <div className="md:col-span-8">
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  {isAr ? 'طلب تسعير مواد ومشاريع' : 'Request a Project Quote'}
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  {isAr 
                    ? 'سيتم حفظ طلبك وإرسال نسخة منسقة ومفصلة مباشرة إلى قسم التوريد والمبيعات عبر الواتساب.' 
                    : 'Your inquiry will be logged and dispatched directly to our bulk supply division on WhatsApp.'}
                </p>
              </div>

              {/* تنبيه انقطاع الإنترنت وحفظ المسودة */}
              {offlineError && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold">
                        {isAr ? 'تعذر الإرسال لعدم وجود اتصال بالإنترنت. تم الاحتفاظ بالبيانات المدخلة.' : 'Unable to send: No internet connection. Entered data is preserved.'}
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5">
                        {isAr ? 'يمكنك النقر على زر إعادة المحاولة فور عودة الاتصال.' : 'You can click retry as soon as connectivity is restored.'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleWhatsAppSubmit()}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
                  </button>
                </div>
              )}

              {/* تنبيه تعذر الاتصال بالسيرفر أو فشل الإرسال */}
              {!offlineError && serverError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <RefreshCw className="w-4 h-4 text-red-600 shrink-0" />
                    <div>
                      <div className="font-bold">{serverError}</div>
                      <div className="text-slate-600 text-[11px] mt-0.5">
                        {isAr ? 'تم حفظ كافة بياناتك المدخلة بأمان في جهازك.' : 'All your entered fields remain safely saved.'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleWhatsAppSubmit()}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* الاسم / اسم الشركة */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {isAr ? 'الاسم أو اسم الشركة / المؤسسة *' : 'Your Name or Company Name *'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isAr ? 'مثال: شركة الرواد للتشطيبات المعمارية' : 'e.g. Al-Rowad Architectural Finishing'}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* رقم الهاتف */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {isAr ? 'رقم الهاتف للتواصل للتسعير *' : 'Contact Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={isAr ? 'مثال: 091XXXXXXX' : 'e.g. 091XXXXXXX'}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all placeholder:text-slate-400 text-left dir-ltr"
                    required
                  />
                </div>

                {/* نوع النشاط */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {isAr ? 'نوع المشروع / تصنيف النشاط *' : 'Activity / Project Classification *'}
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all cursor-pointer"
                  >
                    {isAr ? (
                      <>
                        <option value="شركة تشطيب">شركة تشطيب وديكور</option>
                        <option value="مقاول مستمر">مقاول كهربائي حر</option>
                        <option value="مالك مشروع كمية كبيرة">مالك مشروع (فيلا / عمارة / مجمع)</option>
                        <option value="أخرى">أخرى</option>
                      </>
                    ) : (
                      <>
                        <option value="Finishing Company">Finishing & Decor Company</option>
                        <option value="Freelance Contractor">Independent Electrical Contractor</option>
                        <option value="Bulk Project Owner">Project Owner (Villa / Building)</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>

                {/* المواد المطلوبة */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {isAr ? 'تفاصيل المواد، المقاسات، والكميات المطلوبة بالتفصيل *' : 'List of Wires, Lights, and Quantities *'}
                  </label>
                  <textarea
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    placeholder={isAr 
                      ? "اكتب هنا قائمة المواد والكميات المطلوبة بالتفصيل:\nمثال:\n- 20 لفة سلك 2.5 مم إيطالي\n- 150 سبوت لايت مقاس 7 سم لون أصفر 7 وات\n- كابلات نحاس مقاس..."
                      : "Type your detailed list here:\ne.g.:\n- 20 rolls of Italian wire 2.5 mm\n- 150 spotlights size 7cm, warm white, 7W\n- Copper cables size..."
                    }
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all placeholder:text-slate-400 resize-none leading-relaxed"
                    required
                  />
                </div>
              </div>

              {/* زر الإرسال عبر الواتساب مع مؤشر الحفظ في الخلفية */}
              <button
                onClick={handleWhatsAppSubmit}
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/25 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isAr ? 'جاري حفظ الطلب والتحويل...' : 'Saving inquiry...'}</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 fill-current" />
                    <span>
                      {isAr ? 'إرسال طلب التسعير للواتساب' : 'Send Quote Request via WhatsApp'}
                    </span>
                  </>
                )}
              </button>

              {/* ملاحظة بخصوص التتبع */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-600 text-xs text-center leading-normal font-normal">
                {isAr 
                  ? '⚡ سيتلقى قسم المبيعات والكميات طلبك موضحاً عليه رمز تعريفي تلقائي للمقاولين لتمييزه وتسريعه.'
                  : '⚡ Sales department will receive this request flagged with a contractor code for priority handling.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
