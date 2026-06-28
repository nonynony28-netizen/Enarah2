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
            <Link to="/" className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#0f213a] border border-white/10 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-blue-400 font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </FadeIn>

        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-white">
              {isAr ? 'تواصل' : 'Contact'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.4)]">{isAr ? 'معنا' : 'Us'}</span>
            </h1>

            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg">
              {isAr 
                ? 'نحن هنا لخدمتك. تواصل معنا للاستفسارات، الطلبات، أو التعاقد على المشاريع بكل سهولة'
                : 'We are here to help. Contact us for any inquiries, orders, or projects collaboration with ease'
              }
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-6">
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-blue-500 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
            </div>
          </div>
        </FadeIn>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 ${
          isAr ? 'text-right' : 'text-left'
        }`}>
          
          {/* Contact Form */}
          <FadeIn delay={0.2}>
            <div className="bg-[#0f213a] border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
              
              <h2 className={`text-2xl font-bold text-white mb-8 flex items-center gap-3 ${
                isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
              }`}>
                <span className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                {isAr ? 'أرسل رسالتك' : 'Send Message'}
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-500/10 border border-blue-400/20 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[350px]"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-500/20 border border-green-400/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.2)]"
                  >
                    <CheckCircle className="w-10 h-10 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                  </motion.div>

                  <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400 font-bold text-2xl mb-3">
                    {isAr ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'}
                  </h3>

                  <p className="text-slate-300 text-base leading-relaxed">
                    {isAr 
                      ? 'شكراً لتواصلك معنا. لقد تم استلام رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.'
                      : 'Thank you for reaching out. We have received your message and will get back to you shortly.'
                    }
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  {/* Name */}
                  <div className="group/input relative">
                    <label className="block text-slate-300 font-semibold text-sm mb-2 transition-colors duration-300 group-focus-within/input:text-blue-400">
                      {isAr ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-5 py-4 bg-[#0a192f] border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-[#06152b] focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                      placeholder={isAr ? 'أدخل اسمك هنا' : 'Enter your name here'}
                    />
                  </div>

                  {/* Phone */}
                  <div className="group/input relative">
                    <label className="block text-slate-300 font-semibold text-sm mb-2 transition-colors duration-300 group-focus-within/input:text-blue-400">
                      {isAr ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-5 py-4 bg-[#0a192f] border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-[#06152b] focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                      placeholder="09X XXX XXXX"
                    />
                  </div>

                  {/* Message */}
                  <div className="group/input relative">
                    <label className="block text-slate-300 font-semibold text-sm mb-2 transition-colors duration-300 group-focus-within/input:text-blue-400">
                      {isAr ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-5 py-4 bg-[#0a192f] border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-[#06152b] focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 resize-none ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                      placeholder={isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:bg-blue-500 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group/btn overflow-hidden relative ${
                      isAr ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {isAr ? 'جاري الإرسال...' : 'Sending...'}
                      </span>
                    ) : (
                      <>
                        <Send className="w-5 h-5 transition-transform" />
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
            <div className="space-y-8 h-full flex flex-col">
              
              <div className="bg-[#0f213a] border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl flex-1">
                <h2 className={`text-2xl font-bold text-white mb-8 flex items-center gap-3 ${
                  isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                }`}>
                  <span className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  {isAr ? 'معلومات التواصل' : 'Contact Details'}
                </h2>

                <div className="space-y-4">
                  {/* Phone */}
                  <a href="tel:+218916580068" className={`flex items-center gap-5 p-4 rounded-2xl hover:bg-[#0a192f] border border-transparent hover:border-white/5 transition-all duration-300 group cursor-pointer shadow-inner ${
                    isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                  }`}>
                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                      <Phone className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">{isAr ? 'الهاتف المحمول' : 'Mobile Phone'}</p>
                      <p className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors" dir="ltr">+218 91 658 0068</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a href="mailto:info@enarahmodern.com" className={`flex items-center gap-5 p-4 rounded-2xl hover:bg-[#0a192f] border border-transparent hover:border-white/5 transition-all duration-300 group cursor-pointer shadow-inner ${
                    isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                  }`}>
                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</p>
                      <p className="text-white font-bold group-hover:text-blue-300 transition-colors break-all">info@enarahmodern.com</p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className={`flex items-start gap-5 p-4 rounded-2xl hover:bg-[#0a192f] border border-transparent hover:border-white/5 transition-all duration-300 group shadow-inner ${
                    isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                  }`}>
                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] mt-1">
                      <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">{isAr ? 'المقر الرئيسي' : 'Headquarters'}</p>
                      <p className="text-white font-medium leading-relaxed group-hover:text-blue-100 transition-colors">
                        {isAr 
                          ? 'بنغازي، الليثي مقابل مدرسة العيد الفضي وبجانب عيادة المستقبل لطب الأسنان'
                          : 'Benghazi, Al-Laythi, opposite Silver Jubilee School, next to Al-Mustaqbal Dental Clinic'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className={`flex items-center gap-5 p-4 rounded-2xl hover:bg-[#0a192f] border border-transparent hover:border-white/5 transition-all duration-300 group shadow-inner ${
                    isAr ? 'flex-row text-right' : 'flex-row-reverse text-left'
                  }`}>
                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                      <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">{isAr ? 'ساعات العمل' : 'Working Hours'}</p>
                      <p className="text-white font-bold group-hover:text-blue-100 transition-colors">
                        {isAr ? 'يومياً من 8:00 صباحاً حتي 8:00 مساءً' : 'Daily from 8:00 AM to 8:00 PM'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0f213a] to-[#0a192f] border border-blue-500/30 rounded-[2rem] p-8 md:p-10 shadow-2xl group text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                <h3 className={`text-xl font-bold text-white mb-3 flex items-center gap-2 relative z-10 justify-center`}>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  <span>{isAr ? 'مساعدة فورية؟' : 'Need Immediate Help?'}</span>
                </h3>
                
                <p className="text-slate-300 text-base mb-6 leading-relaxed relative z-10">
                  {isAr 
                    ? 'فريق الدعم الفني جاهز للرد على جميع استفساراتك وتقديم الدعم الكامل لك بأسرع وقت ممكن. لا تتردد في الاتصال بنا الآن.'
                    : 'Our technical support team is ready to answer all your inquiries and provide full assistance as quickly as possible. Do not hesitate to call us.'
                  }
                </p>

                <a
                  href="tel:+218916580068"
                  className="relative z-10 inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 font-extrabold text-lg"
                >
                  <Phone className="w-5 h-5" />
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
