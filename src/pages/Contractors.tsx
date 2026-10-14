import { useState, useEffect, useRef } from 'react'
import {
  Building2,
  FileText,
  Phone,
  MessageSquare,
  AlertCircle,
  Loader2,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowUpRight
} from 'lucide-react'
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans pb-20">
      
      {/* 01. Premium Deep Navy B2B Hero Section (Section 05 & 06) */}
      <section className="relative bg-[#101820] text-white pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-white/10 overflow-hidden">
        {/* Subtle Architectural Ambient Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0062D2]/10 rounded-full blur-3xl pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Right Column: Editorial Typography & Verified Content */}
            <div className="lg:col-span-7 space-y-5 text-right" dir={isAr ? 'rtl' : 'ltr'}>
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-blue-200 tracking-wide">
                <Building2 className="w-3.5 h-3.5 text-[#0062D2]" />
                <span>{isAr ? 'حلول التوريد الهندسي والكميات B2B' : 'B2B Engineering Procurement'}</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {isAr ? 'بوابة المقاولين والكميات' : 'Contractors & Bulk Portal'}
              </h1>

              {/* Preserved Authentic Introduction */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                {isAr 
                  ? 'نهتم بتقديم أفضل عروض الأسعار والتسهيلات الخاصة لشركات التشطيب، المقاولين، والمشاريع الكبرى. املأ بياناتك وموادك المطلوبة للتواصل المباشر مع قسم المبيعات والكميات لدينا.'
                  : 'We provide specialized pricing and logistics services for contractors, finishing companies, and large-scale projects. Fill in your details below for a direct quote.'}
              </p>

              {/* Verified Trust Strip */}
              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-[#0062D2] shrink-0" />
                  <span>{isAr ? 'توريد مباشر من الوكالات المعتمدة' : 'Direct Authorized Supply'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-[#0062D2] shrink-0" />
                  <span>{isAr ? 'مراجعة وتسعير فوري للكميات' : 'Rapid Project Quotation'}</span>
                </div>
              </div>
            </div>

            {/* Left Column: Authentic Architectural MEP Infrastructure Photograph */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-slate-900 group">
                <img
                  src="/images/contractors-b2b-hero.jpg"
                  alt={isAr ? 'تمديدات البنية التحتية الكهربائية للمشاريع التجارية' : 'Commercial electrical infrastructure installation'}
                  className="w-full h-[260px] sm:h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-transparent to-transparent opacity-75" />
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-[#0062D2]" />
                    <span>{isAr ? 'معايير الجودة والمواصفات المعتمدة' : 'Certified Engineering Standards'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 02. Enterprise B2B Quotation Workspace */}
      <main className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 sm:pt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Container (Right Column on RTL Desktop, First on Mobile) */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
              
              {/* Strategic Deep Navy & Brand Blue Accent Top Border */}
              <div className="h-1.5 bg-[#0066FF] w-full" />

              <div className="p-6 sm:p-8 lg:p-10">
                {/* Form Section Header with B2B Procurement Identity */}
                <div className="border-b border-slate-100 pb-5 mb-6 text-right" dir={isAr ? 'rtl' : 'ltr'}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#101820] text-white text-[11px] font-mono tracking-wider font-semibold mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
                    <span>{isAr ? 'بوابة التوريد وعروض الأسعار B2B' : 'B2B PROCUREMENT & QUOTATIONS'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight">
                    {isAr ? 'طلب تسعير مواد ومشاريع' : 'Request a Project Quote'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed font-normal">
                    {isAr 
                      ? 'سيتم حفظ طلبك وإرسال نسخة منسقة ومفصلة مباشرة إلى قسم التوريد والمبيعات عبر الواتساب.' 
                      : 'Your inquiry will be logged and dispatched directly to our bulk supply division on WhatsApp.'}
                  </p>
                </div>

                {/* Offline Warning Notice */}
                {offlineError && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 mb-6" dir={isAr ? 'rtl' : 'ltr'}>
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
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
                    </button>
                  </div>
                )}

                {/* Server Error Alert */}
                {!offlineError && serverError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between gap-3 mb-6" dir={isAr ? 'rtl' : 'ltr'}>
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
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
                    </button>
                  </div>
                )}

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-6" dir={isAr ? 'rtl' : 'ltr'}>
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Enterprise Form (Two-Column Desktop Grid for inputs, full width for textarea) */}
                <form onSubmit={handleWhatsAppSubmit} className="space-y-5" noValidate={false}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Name / Company Name */}
                    <div className="space-y-1.5 text-right" dir={isAr ? 'rtl' : 'ltr'}>
                      <label htmlFor="contractor-name" className="text-xs font-semibold text-slate-800 block">
                        {isAr ? 'الاسم أو اسم الشركة / المؤسسة *' : 'Your Name or Company Name *'}
                      </label>
                      <input
                        id="contractor-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={isAr ? 'مثال: شركة الرواد للتشطيبات المعمارية' : 'e.g. Al-Rowad Architectural Finishing'}
                        className="w-full h-12 px-4 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Contact Phone Number */}
                    <div className="space-y-1.5 text-right" dir={isAr ? 'rtl' : 'ltr'}>
                      <label htmlFor="contractor-phone" className="text-xs font-semibold text-slate-800 block">
                        {isAr ? 'رقم الهاتف للتواصل للتسعير *' : 'Contact Phone Number *'}
                      </label>
                      <input
                        id="contractor-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={isAr ? 'مثال: 091XXXXXXX' : 'e.g. 091XXXXXXX'}
                        className="w-full h-12 px-4 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all duration-200"
                        required
                      />
                    </div>

                  </div>

                  {/* Project / Activity Type Classification */}
                  <div className="space-y-1.5 text-right" dir={isAr ? 'rtl' : 'ltr'}>
                    <label htmlFor="contractor-project-type" className="text-xs font-semibold text-slate-800 block">
                      {isAr ? 'نوع المشروع / تصنيف النشاط *' : 'Activity / Project Classification *'}
                    </label>
                    <select
                      id="contractor-project-type"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full h-12 px-4 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all duration-200 cursor-pointer"
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

                  {/* Materials & Quantities Textarea */}
                  <div className="space-y-1.5 text-right" dir={isAr ? 'rtl' : 'ltr'}>
                    <label htmlFor="contractor-materials" className="text-xs font-semibold text-slate-800 block">
                      {isAr ? 'تفاصيل المواد، المقاسات، والكميات المطلوبة بالتفصيل *' : 'List of Wires, Lights, and Quantities *'}
                    </label>
                    <textarea
                      id="contractor-materials"
                      value={formData.materials}
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                      placeholder={isAr 
                        ? "اكتب هنا قائمة المواد والكميات المطلوبة بالتفصيل:\nمثال:\n- 20 لفة سلك 2.5 مم إيطالي\n- 150 سبوت لايت مقاس 7 سم لون أصفر 7 وات\n- كابلات نحاس مقاس..."
                        : "Type your detailed list here:\ne.g.:\n- 20 rolls of Italian wire 2.5 mm\n- 150 spotlights size 7cm, warm white, 7W\n- Copper cables size..."
                      }
                      rows={5}
                      className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all duration-200 resize-none leading-relaxed"
                      required
                    />
                  </div>

                  {/* WhatsApp Submission Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 bg-[#0066FF] hover:bg-[#0052CC] active:bg-[#0040C1] text-white rounded-xl font-bold flex items-center justify-center gap-3 cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md disabled:opacity-75 disabled:cursor-not-allowed text-sm sm:text-base tracking-wide"
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
                  </div>

                  {/* Contractor Priority Routing Notice */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-700 text-xs flex items-center gap-3" dir={isAr ? 'rtl' : 'ltr'}>
                    <span className="shrink-0 px-2.5 py-1 rounded bg-[#0066FF]/10 text-[#0066FF] font-mono font-bold text-[10px] tracking-wide uppercase">
                      B2B PRIORITY
                    </span>
                    <span className="leading-relaxed font-normal">
                      {isAr 
                        ? '⚡ سيتلقى قسم المبيعات والكميات طلبك موضحاً عليه رمز تعريفي تلقائي للمقاولين لتمييزه وتسريعه.'
                        : '⚡ Sales department will receive this request flagged with a contractor code for priority handling.'}
                    </span>
                  </div>

                </form>

              </div>
            </div>
          </div>

          {/* Left/Side Panel: Preserved Service Benefits & Helplines (Left Column on RTL Desktop, Second on Mobile) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Benefit Card 1: Direct Supply */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5 transition-all duration-200 hover:border-slate-300" dir={isAr ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-[15px] text-slate-900">
                  {isAr ? 'توفير وتوريد مباشر' : 'Direct Supply'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {isAr 
                  ? 'نوفر كابلات وأسلاك النحاس، إنارة ذكية، سبوت لايت، وقواطع كهربائية بكميات ضخمة بأسعار تنافسية.'
                  : 'We supply high-grade cables, wires, smart switches, and spotlights directly from approved manufacturers.'}
              </p>
            </div>

            {/* Benefit Card 2: Fast Response */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5 transition-all duration-200 hover:border-slate-300" dir={isAr ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-[15px] text-slate-900">
                  {isAr ? 'متابعة وتأكيد سريع' : 'Fast Response'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {isAr 
                  ? 'يقوم منسق المبيعات لدينا بمراجعة طلبك وتحديد الخصومات الخاصة بحجم تعاملاتك فور استلام الطلب.'
                  : 'Our dedicated sales coordinators analyze your list and apply scale discounts immediately upon request.'}
              </p>
            </div>

            {/* Benghazi Showroom Direct Helplines (Deep Navy Panel) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1726] text-white border border-slate-800 shadow-xs space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-200">
                    {isAr ? 'الفرع الرئيسي بنغازي - الليثي' : 'Benghazi Main Showroom'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400" dir="ltr">
                  8:30 AM — 9:00 PM
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {isAr 
                  ? 'يمكنكم أيضاً زيارة معرضنا أو التواصل المباشر مع مهندسي المبيعات خلال ساعات العمل الرسمية.'
                  : 'You can also visit our showroom or contact sales engineers directly during official hours.'}
              </p>

              <div className="pt-1 space-y-2 text-xs">
                <span className="text-[11px] font-medium text-slate-400 block">
                  {isAr ? 'هواتف قسم المبيعات والمشاريع:' : 'Sales & Projects Helplines:'}
                </span>
                <div className="space-y-1.5">
                  <a 
                    href="tel:+218916580068" 
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono font-bold text-xs transition-colors"
                    dir="ltr"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>+218 91 658 0068</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                  <a 
                    href="tel:+218926580068" 
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono font-bold text-xs transition-colors"
                    dir="ltr"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>+218 92 658 0068</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  )
}
