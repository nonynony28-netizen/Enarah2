import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ArrowRight,
  Loader2,
  WifiOff,
  MessageCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { trackConversionEvent } from '../utils/analytics'

const DRAFT_KEY = 'enarah_contact_draft'

export default function Contact() {
  const { isAr } = useLanguage()

  // استرجاع المسودة التلقائية
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

  // حفظ المسودة تلقائياً
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
      errors.phone = isAr ? 'رقم الهاتف غير مكتمل' : 'Phone number is too short'
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
        }, 5000)
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
        <div className="mb-14 sm:mb-18 max-w-3xl">
          <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#15191E] tracking-tight leading-[1.12] mb-5">
            تواصل مع خبرائنا
          </h1>
          <p className="text-base sm:text-lg text-[#68717D] font-normal leading-relaxed">
            فريقنا الهندسي مستعد لتقديم الاستشارات المعمارية وتجهيز دراسات الإنارة وجداول الكميات لمشروعك.
          </p>
        </div>

        {/* Contact Grid: Form (7 cols) + Details (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-[#E7EAF0] shadow-xs">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#15191E] mb-2 tracking-tight">
              أرسل استفسارك أو تفاصيل مشروعك
            </h2>
            <p className="text-xs sm:text-sm text-[#68717D] mb-8 font-normal">
              سيقوم مهندسونا بمراجعة استفسارك والرد عليك هاتفياً أو عبر واتساب خلال ساعات العمل.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-[#EBF3FC] border border-[#0062D2]/20 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#0062D2] text-white flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#15191E] mb-1">
                  تم استلام رسالتك بنجاح!
                </h3>
                <p className="text-xs sm:text-sm text-[#68717D]">
                  شكراً لتواصلك مع الإنارة الحديثة، سيتواصل معك أحد مستشارينا قريباً جداً.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {offlineError && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <WifiOff className="w-4 h-4 shrink-0" />
                    <span>أنت غير متصل بالإنترنت حالياً، بياناتك محفوظة تلقائياً وسيمكنك الإرسال فور عودة الاتصال.</span>
                  </div>
                )}

                {serverError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {serverError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#15191E] mb-2">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' })
                    }}
                    placeholder="مثال: م. أحمد الترهوني"
                    className="w-full px-4 py-3 bg-[#F7F8FA] border border-[#E7EAF0] focus:border-[#0062D2] focus:bg-white rounded-xl text-sm outline-none transition-colors"
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#15191E] mb-2">
                    رقم الهاتف أو الواتساب *
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
                    className="w-full px-4 py-3 bg-[#F7F8FA] border border-[#E7EAF0] focus:border-[#0062D2] focus:bg-white rounded-xl text-sm outline-none transition-colors text-right"
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#15191E] mb-2">
                    نوع الاستفسار / المشروع
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F7F8FA] border border-[#E7EAF0] focus:border-[#0062D2] focus:bg-white rounded-xl text-sm outline-none transition-colors cursor-pointer"
                  >
                    <option value="general">استفسار عام أو أسعار</option>
                    <option value="villa">مشروع فيلا سكنية خاصة</option>
                    <option value="commercial">مشروع مجمع تجاري أو صالة عرض</option>
                    <option value="medical">مشروع طبي أو مستشفى</option>
                    <option value="wires">طلب كابلات وتأسيس بالجملة</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-[#15191E] mb-2">
                    تفاصيل الرسالة أو المخطط *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value })
                      if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' })
                    }}
                    placeholder="اكتب استفسارك هنا، أو اذكر المساحات والمواصفات المطلوبة..."
                    className="w-full px-4 py-3 bg-[#F7F8FA] border border-[#E7EAF0] focus:border-[#0062D2] focus:bg-white rounded-xl text-sm outline-none transition-colors resize-none"
                  />
                  {fieldErrors.message && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0062D2] hover:bg-[#0047A5] disabled:opacity-70 text-white font-semibold text-xs sm:text-sm rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-[#0062D2]/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري إرسال الرسالة...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>إرسال الرسالة</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Showroom & HQ Card */}
            <div className="bg-white rounded-3xl p-8 border border-[#E7EAF0] shadow-xs">
              <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3">
                HEADQUARTERS & SHOWROOM
              </span>
              <h3 className="text-xl font-semibold text-[#15191E] mb-6 tracking-tight">
                المقر الرئيسي والمعرض
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F7F8FA] text-[#0062D2] flex items-center justify-center shrink-0 border border-[#E7EAF0]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#15191E] block mb-0.5">العنوان</span>
                    <span className="text-xs text-[#68717D] leading-relaxed block">
                      طريق 20 رمضان (11 يونيو سابقاً) بالقرب من معهد النفط، طرابلس — ليبيا
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F7F8FA] text-[#0062D2] flex items-center justify-center shrink-0 border border-[#E7EAF0]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#15191E] block mb-0.5">الهاتف المباشر</span>
                    <a
                      href="tel:+218912121303"
                      dir="ltr"
                      className="text-xs text-[#0062D2] font-semibold hover:underline block"
                    >
                      +218 91 212 1303
                    </a>
                    <a
                      href="tel:+218916580068"
                      dir="ltr"
                      className="text-xs text-[#68717D] hover:underline block mt-0.5"
                    >
                      +218 91 658 0068
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F7F8FA] text-[#0062D2] flex items-center justify-center shrink-0 border border-[#E7EAF0]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#15191E] block mb-0.5">أوقات العمل</span>
                    <span className="text-xs text-[#68717D] block">
                      السبت — الخميس: 9:00 صباحاً – 8:30 مساءً
                    </span>
                    <span className="text-xs text-[#68717D] block">الجمعة: عطلة أسبوعية</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="mt-8 pt-6 border-t border-[#E7EAF0]">
                <a
                  href="https://wa.me/218912121303"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>محادثة فورية عبر واتساب</span>
                </a>
              </div>
            </div>

            {/* Direct Google Maps Location Pin */}
            <div className="bg-white rounded-3xl p-6 border border-[#E7EAF0] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#15191E]">موقع المعرض على الخريطة</span>
                <a
                  href="https://maps.google.com/?q=32.8687,13.1672"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#0062D2] hover:underline inline-flex items-center gap-1"
                >
                  <span>فتح في Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-[#E7EAF0] flex items-center justify-center text-center p-4">
                <div className="space-y-2">
                  <MapPin className="w-8 h-8 text-[#0062D2] mx-auto animate-bounce" />
                  <span className="text-xs font-semibold text-[#15191E] block">
                    معرض وشركة الإنارة الحديثة
                  </span>
                  <span className="text-[11px] text-[#68717D] block">طرابلس، طريق 20 رمضان</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
