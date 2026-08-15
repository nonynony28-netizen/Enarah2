import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

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

export default function Contact() {
  const { t, isAr } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      alert(isAr ? 'يرجى تعبئة جميع الحقول' : 'Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('https://enarah2.vercel.app/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setFormData({ name: '', phone: '', message: '' })
        setTimeout(() => {
          setSubmitted(false)
        }, 4000)
      } else {
        alert(data.error || data.message || (isAr ? 'فشل إرسال الرسالة' : 'Failed to send message'))
      }
    } catch (error) {
      console.error('Submit Error:', error)
      alert(isAr ? 'حدث خطأ أثناء الإرسال، حاول مرة أخرى' : 'An error occurred, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 bg-transparent min-h-screen relative overflow-hidden text-white">
      
      {/* شبكة هندسية خفيفة جداً في الخلفية للفخامة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* زر الرجوع للرئيسية */}
        <FadeIn>
          <div className="mb-6 flex justify-start">
            <Link to="/" className={`inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white font-semibold transition-all ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </FadeIn>

        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight text-white">
              {isAr ? 'تواصل' : 'Contact'} <span className="text-blue-400">{isAr ? 'معنا' : 'Us'}</span>
            </h1>

            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed text-base md:text-lg font-normal">
              {isAr 
                ? 'نحن هنا لخدمتك. تواصل معنا للاستفسارات، الطلبات، أو التعاقد على المشاريع بكل سهولة'
                : 'We are here to help. Contact us for any inquiries, orders, or projects collaboration with ease'
              }
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-5">
              <div className="w-16 h-[1px] bg-zinc-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <div className="w-16 h-[1px] bg-zinc-800" />
            </div>
          </div>
        </FadeIn>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${
          isAr ? 'text-right' : 'text-left'
        }`}>
          
          {/* Contact Form */}
          <FadeIn delay={0.2}>
            <div className="bg-[#111215] border border-white/[0.08] rounded-2xl p-7 md:p-9 shadow-sm relative overflow-hidden group">
              
              <h2 className={`text-xl font-bold text-white mb-6 flex items-center gap-3 ${
                isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
              }`}>
                <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                {isAr ? 'أرسل رسالتك' : 'Send Message'}
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[320px]"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-5 text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <h3 className="text-white font-bold text-xl mb-2">
                    {isAr ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'}
                  </h3>

                  <p className="text-zinc-400 text-sm leading-relaxed font-normal">
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
                    <label className="block text-zinc-300 font-semibold text-xs mb-1">
                      {isAr ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 transition-all text-sm ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                      placeholder={isAr ? 'أدخل اسمك هنا' : 'Enter your name here'}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-zinc-300 font-semibold text-xs mb-1">
                      {isAr ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 transition-all text-sm ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                      placeholder="09X XXX XXXX"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="block text-zinc-300 font-semibold text-xs mb-1">
                      {isAr ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 transition-all resize-none text-sm leading-relaxed ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                      placeholder={isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full px-6 py-3.5 bg-blue-600 text-white font-bold text-base rounded-xl transition-all duration-200 hover:bg-blue-500 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${
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
              
              <div className="bg-[#111215] border border-white/[0.08] rounded-2xl p-7 md:p-9 shadow-sm flex-1">
                <h2 className={`text-xl font-bold text-white mb-6 flex items-center gap-3 ${
                  isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                }`}>
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                  {isAr ? 'معلومات التواصل' : 'Contact Details'}
                </h2>

                <div className="space-y-3.5">
                  {/* Phone */}
                  <a href="tel:+218916580068" className={`flex items-center gap-4 p-3.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/80 transition-all duration-200 group cursor-pointer ${
                    isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                  }`}>
                    <div className="w-11 h-11 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0 text-blue-400 group-hover:text-blue-300 transition-all">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs mb-0.5">{isAr ? 'الهاتف المحمول' : 'Mobile Phone'}</p>
                      <p className="text-white font-bold text-base group-hover:text-blue-300 transition-colors" dir="ltr">+218 91 658 0068</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a href="mailto:info@enarahmodern.com" className={`flex items-center gap-4 p-3.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/80 transition-all duration-200 group cursor-pointer ${
                    isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                  }`}>
                    <div className="w-11 h-11 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0 text-blue-400 group-hover:text-blue-300 transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs mb-0.5">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</p>
                      <p className="text-white font-bold text-sm group-hover:text-blue-300 transition-colors break-all">info@enarahmodern.com</p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className={`flex items-start gap-4 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 ${
                    isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                  }`}>
                    <div className="w-11 h-11 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0 text-blue-400 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs mb-0.5">{isAr ? 'المقر الرئيسي' : 'Headquarters'}</p>
                      <p className="text-white text-xs sm:text-sm font-normal leading-relaxed">
                        {isAr 
                          ? 'بنغازي، الليثي مقابل مدرسة العيد الفضي وبجانب عيادة المستقبل لطب الأسنان'
                          : 'Benghazi, Al-Laythi, opposite Silver Jubilee School, next to Al-Mustaqbal Dental Clinic'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className={`flex items-center gap-4 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 ${
                    isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                  }`}>
                    <div className="w-11 h-11 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0 text-blue-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs mb-0.5">{isAr ? 'ساعات العمل' : 'Working Hours'}</p>
                      <p className="text-white font-bold text-xs sm:text-sm">
                        {isAr ? 'يومياً من 8:00 صباحاً حتي 8:00 مساءً' : 'Daily from 8:00 AM to 8:00 PM'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help Card */}
              <div className="relative overflow-hidden bg-[#111215] border border-white/[0.08] rounded-2xl p-7 text-center">
                <h3 className={`text-lg font-bold text-white mb-2 flex items-center gap-2 justify-center`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{isAr ? 'مساعدة فورية؟' : 'Need Immediate Help?'}</span>
                </h3>
                
                <p className="text-zinc-400 text-xs sm:text-sm mb-5 leading-relaxed font-normal">
                  {isAr 
                    ? 'فريق الدعم الفني جاهز للرد على جميع استفساراتك وتقديم الدعم الكامل لك بأسرع وقت ممكن. لا تتردد في الاتصال بنا الآن.'
                    : 'Our technical support team is ready to answer all your inquiries and provide full assistance as quickly as possible. Do not hesitate to call us.'
                  }
                </p>

                <a
                  href="tel:+218916580068"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 font-semibold text-sm active:scale-95 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  {isAr ? 'اتصل بنا الآن' : 'Call Us Now'}
                </a>
              </div>

            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
