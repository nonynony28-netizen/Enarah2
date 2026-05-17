import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

// ======================================
// مكون ظهور العناصر بسلاسة
// ======================================
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
    margin: '-50px',
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Contact() {
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
      alert('يرجى تعبئة جميع الحقول')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/save-user', {
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
        alert(data.error || data.message || 'فشل إرسال الرسالة')
      }
    } catch (error) {
      console.error('Submit Error:', error)
      alert('حدث خطأ أثناء الإرسال، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    // الخلفية الأساسية مع إضاءة ساحرة (Glowing Orbs)
    <div className="pt-24 md:pt-32 pb-20 bg-[#0a192f] min-h-screen relative overflow-hidden">
      
      {/* تأثيرات الإضاءة الخلفية */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-white via-white to-blue-400 mb-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
            >
              تواصل معنا
            </motion.h1>

            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg">
              نحن هنا لخدمتك. تواصل معنا للاستفسارات، الطلبات، أو التعاقد على المشاريع بكل سهولة
            </p>

            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mt-6 shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
            />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Contact Form (Glassmorphism Effect) */}
          <FadeIn delay={0.1}>
            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
              
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                أرسل رسالتك
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
                    تم الإرسال بنجاح!
                  </h3>

                  <p className="text-slate-300 text-base leading-relaxed">
                    شكراً لتواصلك معنا. لقد تم استلام رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  {/* Name */}
                  <div className="group/input relative">
                    <label className="block text-slate-300 font-semibold text-sm mb-2 transition-colors duration-300 group-focus-within/input:text-blue-400">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-blue-400/[0.02] focus:ring-4 focus:ring-blue-400/10 transition-all duration-300"
                      placeholder="أدخل اسمك هنا"
                    />
                  </div>

                  {/* Phone */}
                  <div className="group/input relative">
                    <label className="block text-slate-300 font-semibold text-sm mb-2 transition-colors duration-300 group-focus-within/input:text-blue-400">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-blue-400/[0.02] focus:ring-4 focus:ring-blue-400/10 transition-all duration-300 text-left"
                      dir="ltr"
                      placeholder="+218 9x xxx xxxx"
                    />
                  </div>

                  {/* Message */}
                  <div className="group/input relative">
                    <label className="block text-slate-300 font-semibold text-sm mb-2 transition-colors duration-300 group-focus-within/input:text-blue-400">
                      الرسالة
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-blue-400/[0.02] focus:ring-4 focus:ring-blue-400/10 transition-all duration-300 resize-none"
                      placeholder="كيف يمكننا مساعدتك؟"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-l from-blue-600 to-blue-400 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                  >
                    {/* لمعان خفيف عند تمرير الماوس */}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الإرسال...
                      </span>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                        إرسال الرسالة
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </FadeIn>

          {/* Contact Info (Interactive Cards) */}
          <FadeIn delay={0.2}>
            <div className="space-y-8 h-full flex flex-col">
              
              <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex-1">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  معلومات التواصل
                </h2>

                <div className="space-y-4">
                  {/* Phone */}
                  <a href="tel:+218916580068" className="flex items-center gap-5 p-4 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all duration-300 group cursor-pointer">
                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                      <Phone className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">الهاتف المحمول</p>
                      <p className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors" dir="ltr">+218 91 658 0068</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a href="mailto:enarahmodern@gmail.com" className="flex items-center gap-5 p-4 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all duration-300 group cursor-pointer">
                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">البريد الإلكتروني</p>
                      <p className="text-white font-bold group-hover:text-blue-300 transition-colors break-all">enarahmodern@gmail.com</p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all duration-300 group">
                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] mt-1">
                      <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">المقر الرئيسي</p>
                      <p className="text-white font-medium leading-relaxed group-hover:text-blue-100 transition-colors">
                        بنغازي، الليثي مقابل مدرسة العيد الفضي<br/>وبجانب عيادة المستقبل لطب الأسنان
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all duration-300 group">
                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                      <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">ساعات العمل</p>
                      <p className="text-white font-bold group-hover:text-blue-100 transition-colors">
                        يومياً من 8:00 صباحاً حتي 8:00 مساءً
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help Card (تصميم خرافي للمساعدة) */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-blue-900/40 border border-blue-400/20 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_32px_rgba(59,130,246,0.15)] group">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  مساعدة فورية؟
                </h3>
                
                <p className="text-blue-100/80 text-base mb-6 leading-relaxed relative z-10">
                  فريق الدعم الفني جاهز للرد على جميع استفساراتك وتقديم الدعم الكامل لك بأسرع وقت ممكن. لا تتردد في الاتصال بنا الآن.
                </p>

                <a
                  href="tel:+218916580068"
                  className="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 font-extrabold text-lg"
                >
                  <Phone className="w-5 h-5" />
                  اتصل بنا الآن
                </a>
              </div>

            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

