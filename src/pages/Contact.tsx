import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ArrowRight, Loader2, WifiOff, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { trackConversionEvent } from '../utils/analytics'

// نمط الوهج الأزرق للعناوين الفخمة
const glowingTitleStyle = {
  textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
}

// مكون ظهور العناصر بسلاسة (سريع جداً)
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '50px',
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  )
}

const DRAFT_KEY = 'enarah_contact_draft'

export default function Contact() {
  const { t, isAr } = useLanguage()

  // استرجاع المسودة التلقائية المحفوظة في حال انقطاع النت أو إعادة التحميل
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(DRAFT_KEY)
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return { name: '', phone: '', message: '' }
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [offlineError, setOfflineError] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const hasTrackedStartRef = useRef(false)

  // حفظ المسودة تلقائياً عند الكتابة (Debounced Auto-save)
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

  // الاستماع لعودة الإنترنت وإتاحة إعادة الإرسال الفوري
  useEffect(() => {
    const handleOnline = () => {
      if (offlineError) {
        setOfflineError(false)
      }
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [offlineError])

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
      errors.message = isAr ? 'يرجى كتابة رسالتك أو استفسارك' : 'Please write your message'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!validateForm()) return

    // فحص الاتصال بالإنترنت قبل الإرسال لمنع فقدان البيانات
    if (!navigator.onLine) {
      setOfflineError(true)
      return
    }

    try {
      setLoading(true)
      setOfflineError(false)

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
          email: formData.message,
          type: 'contact',
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
        localStorage.removeItem(DRAFT_KEY)
        setFormData({ name: '', phone: '', message: '' })
        hasTrackedStartRef.current = false
        trackConversionEvent('contact_form_submitted', { leadType: 'contact' })

        setTimeout(() => {
          setSubmitted(false)
        }, 5000)
      } else {
        alert(data.error || data.message || (isAr ? 'فشل إرسال الرسالة' : 'Failed to send message'))
      }
    } catch (error) {
      console.error('Submit Error:', error)
      if (!navigator.onLine) {
        setOfflineError(true)
      } else {
        alert(isAr ? 'حدث خطأ أثناء الإرسال، تم حفظ مسودتك. حاول مرة أخرى.' : 'Error occurred, draft is preserved. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 bg-transparent min-h-screen relative overflow-hidden text-slate-900">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className="mb-6 flex justify-start">
            <Link to="/" className={`inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 hover:text-blue-600 font-semibold transition-all shadow-sm ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
              <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </Link>
          </div>
        </FadeIn>

        {/* Page Header */}
        <FadeIn delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="text-blue-600 font-bold tracking-wider text-xs uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 shadow-sm inline-block mb-3">
              {isAr ? 'خدمة العملاء والدعم الفني' : 'Customer Support & Inquiries'}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {isAr ? 'تواصل مع شركة' : 'Get in Touch with'}{' '}
              <span className="text-blue-600" style={glowingTitleStyle}>
                {isAr ? 'الإنارة الحديثة' : 'Modern Enarah'}
              </span>
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
              {isAr 
                ? 'فريقنا المتخصص في خدمتكم للإجابة على استفسارات الأسلاك الإيطالية المعتمدة، الثريات، حلول التأسيس، وطلبات التوريد والمشاريع.'
                : 'Our dedicated team is here to answer your inquiries regarding certified Italian cables, chandeliers, electrical supplies, and bulk project quotes.'
              }
            </p>
          </div>
        </FadeIn>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${
          isAr ? 'text-right' : 'text-left'
        }`}>
          
          {/* Contact Form */}
          <FadeIn delay={0.2}>
            <div className="bg-white border border-slate-200 rounded-2xl p-7 md:p-9 shadow-sm relative overflow-hidden group">
              
              <h2 className={`text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 ${
                isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
              }`}>
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                {isAr ? 'أرسل رسالتك' : 'Send Message'}
              </h2>

              {/* تنبيه انقطاع الإنترنت وحفظ المسودة */}
              {offlineError && (
                <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold">{isAr ? 'تعذر الإرسال لعدم وجود اتصال بالإنترنت' : 'Unable to send: No internet'}</div>
                      <div className="text-slate-600 text-[11px]">{isAr ? 'تم حفظ بياناتك المدخلة بأمان. انقر لإعادة الإرسال.' : 'Your draft is saved. Click to retry.'}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shrink-0 flex items-center gap-1 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إعادة' : 'Retry'}</span>
                  </button>
                </div>
              )}

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[320px]"
                >
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mb-5 text-emerald-600">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <h3 className="text-slate-900 font-bold text-xl mb-2">
                    {isAr ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    {isAr 
                      ? 'شكراً لتواصلك معنا. لقد تم استلام رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.'
                      : 'Thank you for reaching out. We have received your message and will get back to you shortly.'
                    }
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-semibold text-xs mb-1">
                      {isAr ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' })
                      }}
                      className={`w-full px-4 py-3 bg-slate-50 border ${
                        fieldErrors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-600'
                      } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                      placeholder={isAr ? 'أدخل اسمك هنا' : 'Enter your name here'}
                    />
                    {fieldErrors.name && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-semibold text-xs mb-1">
                      {isAr ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value })
                        if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' })
                      }}
                      className={`w-full px-4 py-3 bg-slate-50 border ${
                        fieldErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-600'
                      } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                      placeholder="09X XXX XXXX"
                    />
                    {fieldErrors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.phone}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-semibold text-xs mb-1">
                      {isAr ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value })
                        if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' })
                      }}
                      className={`w-full px-4 py-3 bg-slate-50 border ${
                        fieldErrors.message ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-600'
                      } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all resize-none text-sm leading-relaxed ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                      placeholder={isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                    />
                    {fieldErrors.message && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full px-6 py-3.5 bg-blue-600 text-white font-bold text-base rounded-xl transition-all duration-200 hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${
                      isAr ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isAr ? 'جاري الإرسال...' : 'Sending...'}
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isAr ? 'إرسال الرسالة' : 'Send Message'}</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </FadeIn>

          {/* Contact Info */}
          <FadeIn delay={0.3}>
            <div className="space-y-6 h-full flex flex-col">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-7 md:p-9 shadow-sm flex-1">
                <h2 className={`text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 ${
                  isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                }`}>
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  {isAr ? 'معلومات التواصل' : 'Contact Details'}
                </h2>

                <div className="space-y-3.5">
                  {/* Phone */}
                  <a 
                    href="tel:+218916580068" 
                    onClick={() => trackConversionEvent('phone_click', { source: 'contact_page' })}
                    className={`flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition-all duration-200 group cursor-pointer ${
                      isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                    }`}
                  >
                    <div className="w-11 h-11 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">{isAr ? 'الهاتف المحمول' : 'Mobile Phone'}</p>
                      <p className="text-slate-900 font-bold text-base group-hover:text-blue-600 transition-colors" dir="ltr">+218 91 658 0068</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a 
                    href="mailto:info@enarahmodern.com" 
                    onClick={() => trackConversionEvent('email_click', { source: 'contact_page' })}
                    className={`flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition-all duration-200 group cursor-pointer ${
                      isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                    }`}
                  >
                    <div className="w-11 h-11 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</p>
                      <p className="text-slate-900 font-bold text-sm group-hover:text-blue-600 transition-colors break-all">info@enarahmodern.com</p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className={`flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 ${
                    isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                  }`}>
                    <div className="w-11 h-11 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center shrink-0 text-blue-600 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">{isAr ? 'المقر الرئيسي' : 'Headquarters'}</p>
                      <p className="text-slate-700 text-xs sm:text-sm font-normal leading-relaxed">
                        {isAr 
                          ? 'بنغازي، الليثي مقابل مدرسة العيد الفضي وبجانب عيادة المستقبل لطب الأسنان'
                          : 'Benghazi, Al-Laythi, opposite Silver Jubilee School, next to Al-Mustaqbal Dental Clinic'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className={`flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 ${
                    isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                  }`}>
                    <div className="w-11 h-11 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">{isAr ? 'ساعات العمل' : 'Working Hours'}</p>
                      <p className="text-slate-900 font-bold text-xs sm:text-sm">
                        {isAr ? 'يومياً من 8:00 صباحاً حتي 8:00 مساءً' : 'Daily from 8:00 AM to 8:00 PM'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help Card */}
              <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-7 text-center shadow-sm">
                <h3 className={`text-lg font-bold text-slate-900 mb-2 flex items-center gap-2 justify-center`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{isAr ? 'مساعدة فورية؟' : 'Need Immediate Help?'}</span>
                </h3>
                
                <p className="text-slate-600 text-xs sm:text-sm mb-5 leading-relaxed font-normal">
                  {isAr 
                    ? 'فريق الدعم الفني جاهز للرد على جميع استفساراتك وتقديم الدعم الكامل لك بأسرع وقت ممكن. لا تتردد في الاتصال بنا الآن.'
                    : 'Our technical support team is ready to answer all your inquiries and provide full assistance as quickly as possible. Do not hesitate to call us.'
                  }
                </p>

                <a
                  href="tel:+218916580068"
                  onClick={() => trackConversionEvent('phone_click', { source: 'quick_help_card' })}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
                >
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>{isAr ? 'اتصل بالدعم الفني' : 'Call Support'}</span>
                </a>
              </div>

            </div>
          </FadeIn>

        </div>

      </div>

    </div>
  )
}
