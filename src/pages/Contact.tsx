import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ArrowRight,
  Loader2,
  WifiOff,
  MessageCircle,
  AlertCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { trackConversionEvent } from '../utils/analytics'

const DRAFT_KEY = 'enarah_contact_draft'

export default function Contact() {
  const { isAr } = useLanguage()

  // Auto-restore saved draft
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(DRAFT_KEY)
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return { name: '', phone: '', message: '', projectType: 'general' }
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [offlineError, setOfflineError] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const hasTrackedStartRef = useRef(false)

  // Auto-save draft
  useEffect(() => {
    if (typeof window === 'undefined') return
    const timer = setTimeout(() => {
      if (formData.name || formData.phone || formData.message) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
        if (!hasTrackedStartRef.current) {
          hasTrackedStartRef.current = true
          trackConversionEvent('contact_form_started')
        }
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [formData])

  const validateForm = () => {
    const errors: { [key: string]: string } = {}
    if (!formData.name.trim()) {
      errors.name = isAr ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name'
    }
    if (!formData.phone.trim()) {
      errors.phone = isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter your phone number'
    } else if (formData.phone.trim().length < 8) {
      errors.phone = isAr ? 'رقم الهاتف غير مكتمل (8 أرقام على الأقل)' : 'Phone number is too short'
    }
    if (!formData.message.trim()) {
      errors.message = isAr ? 'يرجى كتابة استفسارك أو تفاصيل مشروعك' : 'Please write your message'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!validateForm()) return

    if (!navigator.onLine) {
      setOfflineError(true)
      setServerError(null)
      return
    }

    try {
      setLoading(true)
      setOfflineError(false)
      setServerError(null)

      const idempotencyKey = `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

      const res = await fetch('https://enarah2.vercel.app/api/save-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: `[نوع الاستفسار: ${formData.projectType}] ${formData.message}`,
          type: 'contact'
        })
      })

      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
        localStorage.removeItem(DRAFT_KEY)
        setFormData({ name: '', phone: '', message: '', projectType: 'general' })
        hasTrackedStartRef.current = false
        trackConversionEvent('contact_form_submitted', { leadType: 'contact' })

        setTimeout(() => {
          setSubmitted(false)
        }, 6000)
      } else {
        setServerError(
          data.error ||
            data.message ||
            (isAr
              ? 'تعذر إرسال الطلب حالياً. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.'
              : 'Unable to send request currently. Please try again.')
        )
      }
    } catch (error) {
      console.error('Submit Error:', error)
      setServerError(
        isAr
          ? 'تعذر إرسال الطلب حالياً. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.'
          : 'Unable to send request currently. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0066FF] selection:text-white pb-20"
    >
      {/* =====================================================================
          01. Architectural Hero Header (Deep Corporate Navy #0B1528)
          ===================================================================== */}
      <section className="relative bg-[#0B1528] text-white pt-8 sm:pt-12 lg:pt-14 pb-10 sm:pb-14 lg:pb-16 overflow-hidden border-b border-white/10">
        {/* Subtle engineering grid & ambient glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#0066FF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Breadcrumb / Back Link */}
          <div className="mb-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <ArrowRight className={`w-3.5 h-3.5 ${!isAr ? 'rotate-180' : ''}`} />
              <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>{isAr ? 'قنوات التواصل المباشر · ليبيا' : 'Direct Corporate Communication · Libya'}</span>
              </div>

              {/* Exact Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.25] text-white">
                {isAr ? 'تواصل مع فريقنا الهندسي' : 'Connect with Our Engineering Team'}
              </h1>

              {/* Narrative */}
              <p className="text-sm sm:text-[15px] lg:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
                {isAr
                  ? 'نرحب باستفساراتكم لتقديم الاستشارات المعمارية وتجهيز دراسات الإنارة وجداول الكميات (BOQ) وتوريد المواد الكهربائية المعتمدة لكافة المشاريع السكنية والتجارية.'
                  : 'Our technical team is ready to assist with architectural consultations, BOQ studies, and certified electrical supplies across Libya.'}
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs text-slate-300 font-normal">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{isAr ? 'استجابة سريعة ومباشرة' : 'Prompt Professional Response'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{isAr ? 'استشارات معمارية متخصصة' : 'Specialized Engineering Advice'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{isAr ? 'توريد موثق لكافة المدن' : 'Nationwide Libya Supply'}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Badge Card */}
            <div className="w-full lg:w-auto shrink-0">
              <div className="bg-[#111C2E]/90 border border-white/10 rounded-2xl p-4 sm:p-5 lg:min-w-[340px] shadow-sm">
                <div className="text-[11px] font-mono tracking-wider text-blue-400 uppercase mb-3 pb-2 border-b border-white/10 flex items-center justify-between">
                  <span>{isAr ? 'المعرض الرئيسي — بنغازي' : 'MAIN SHOWROOM — BENGHAZI'}</span>
                  <span className="text-slate-400 font-sans normal-case text-[11px]" dir="ltr">
                    {isAr ? '8:00 ص — 10:00 م' : '8:00 AM — 10:00 PM'}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <div className="flex items-center gap-2 font-mono font-semibold" dir="ltr">
                      <a href="tel:0916580068" className="hover:text-white transition-colors">0916580068</a>
                      <span className="text-slate-500">·</span>
                      <a href="tel:0926580068" className="hover:text-white transition-colors">0926580068</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'الليثي — مقابل مدرسة العيد الفضي، بنغازي' : 'Al-Laythi, opposite Eid Al-Fiddi School, Benghazi'}</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-white/10">
                  <a
                    href="https://wa.me/218916580068"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isAr ? 'محادثة واتساب فورية' : 'Instant WhatsApp Chat'}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          02. Focused Inquiry Form Workspace (Branches removed per request)
          ===================================================================== */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <span className="text-[11px] font-semibold text-[#0066FF] tracking-wider uppercase block mb-1.5">
              {isAr ? 'طلب استشارة أو عرض أسعار' : 'INQUIRY & QUOTATION FORM'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isAr ? 'أرسل استفسارك أو تفاصيل مشروعك' : 'Send Your Inquiry or Project Details'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal leading-relaxed">
              {isAr
                ? 'سيقوم مهندسونا بمراجعة استفسارك والتواصل معك هاتفياً أو عبر واتساب خلال ساعات العمل.'
                : 'Our engineering specialists will review your inquiry and contact you during working hours.'}
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-10 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#0066FF] text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {isAr ? 'تم استلام رسالتك بنجاح!' : 'Your Message Has Been Received!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {isAr
                  ? 'شكراً لتواصلك مع شركة الإنارة الحديثة. سيقوم أحد مستشارينا الفنيين بالتواصل معك في أقرب وقت ممكن.'
                  : 'Thank you for contacting Enarah Modern. One of our technical advisors will get in touch shortly.'}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Offline Warning */}
              {offlineError && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <WifiOff className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    {isAr
                      ? 'أنت غير متصل بالإنترنت حالياً، بياناتك محفوظة تلقائياً وسيمكنك الإرسال فور عودة الاتصال.'
                      : 'You are currently offline. Your inputs are saved locally and ready to send once reconnected.'}
                  </span>
                </div>
              )}

              {/* Server Error Alert */}
              {serverError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Grid: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    {isAr ? 'الاسم بالكامل' : 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' })
                    }}
                    placeholder={isAr ? 'مثال: م. أحمد الترهوني' : 'e.g. Eng. Ahmed'}
                    className="w-full px-3.5 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 outline-none transition-all"
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{fieldErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    {isAr ? 'رقم الهاتف أو الواتساب' : 'Phone or WhatsApp'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value })
                      if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' })
                    }}
                    placeholder="+218 9X XXX XXXX"
                    className="w-full px-3.5 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 outline-none transition-all text-right font-mono"
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{fieldErrors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {isAr ? 'نوع الاستفسار / المشروع' : 'Inquiry / Project Type'}
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-3.5 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 outline-none transition-all cursor-pointer"
                >
                  <option value="general">{isAr ? 'استفسار عام أو أسعار' : 'General Inquiry / Pricing'}</option>
                  <option value="villa">{isAr ? 'مشروع فيلا سكنية خاصة' : 'Private Residential Villa'}</option>
                  <option value="commercial">{isAr ? 'مشروع مجمع تجاري أو صالة عرض' : 'Commercial Complex / Showroom'}</option>
                  <option value="medical">{isAr ? 'مشروع طبي أو مستشفى' : 'Medical Center / Clinic'}</option>
                  <option value="wires">{isAr ? 'طلب كابلات وتأسيس بالجملة' : 'Bulk Cables & Infrastructure'}</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {isAr ? 'تفاصيل الرسالة أو المخطط' : 'Message Details or Project Scope'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value })
                    if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' })
                  }}
                  placeholder={
                    isAr
                      ? 'اكتب استفسارك هنا، أو اذكر المساحات والمواصفات المطلوبة لكشف المقايسة...'
                      : 'Write your inquiry details, dimensions, or technical specifications here...'
                  }
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 outline-none transition-all resize-none leading-relaxed"
                />
                {fieldErrors.message && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{fieldErrors.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 bg-[#0066FF] hover:bg-[#0052CC] active:bg-[#0040C1] disabled:opacity-70 text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isAr ? 'جاري إرسال الرسالة...' : 'Sending Message...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'إرسال الرسالة للمهندسين' : 'Submit Inquiry'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Commercial Logistics & Sales Shipping Info */}
        <div className="mt-8 p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-semibold text-[#0066FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
              <span>{isAr ? 'خدمة الشحن والتوريد لكافة المدن' : 'Nationwide Libya Supply'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {isAr ? 'التواصل مع قسم المبيعات للتوصيل والشحن لكافة مدن ليبيا' : 'Sales Department — Shipping & Delivery Across Libya'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {isAr
                ? 'توفر شركة الإنارة الحديثة خدمة الشحن والتسليم المباشر للمواد الكهربائية وكابلات التأسيس لكافة المدن والمناطق الليبية بالتنسيق مع شركات النقل المعتمدة عبر قسم المبيعات.'
                : 'Enarah Modern provides direct dispatch and shipping of certified electrical supplies to all Libyan cities via our dedicated sales department.'}
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="tel:0916580068"
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span dir="ltr" className="font-mono">0916580068</span>
              <span>·</span>
              <span>{isAr ? 'اتصال بالمبيعات' : 'Call Sales'}</span>
            </a>
            <a
              href={`https://wa.me/218916580068?text=${encodeURIComponent(
                isAr
                  ? 'مرحباً، أود التواصل مع قسم المبيعات بخصوص التوصيل والشحن لكافة مدن ليبيا'
                  : 'Hello, inquiring about sales shipping & delivery across Libya'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
              title={isAr ? 'واتساب المبيعات' : 'Sales WhatsApp'}
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'واتساب المبيعات' : 'WhatsApp'}</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
