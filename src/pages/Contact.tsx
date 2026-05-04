import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', phone: '', message: '' })
    }, 3000)
  }

  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">تواصل معنا</h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              نحن هنا لمساعدتك. تواصل معنا للاستفسارات أو طلبات التعاقد
            </p>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full mt-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FadeIn delay={0.1}>
            <div className="bg-darkblue-light border border-white/5 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-6">نموذج التواصل</h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gold/10 border border-gold/30 rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Send className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-gold font-bold text-lg mb-1">تم إرسال رسالتك!</h3>
                  <p className="text-white/60 text-sm">سنقوم بالرد عليك في أقرب وقت ممكن.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">الاسم</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-darkblue border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                      placeholder="اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-darkblue border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">الرسالة</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-darkblue border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all resize-none"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gold text-darkblue font-bold rounded-lg hover:bg-gold-light transition-all duration-300 hover:shadow-glow flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    إرسال الرسالة
                  </button>
                </form>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <div className="bg-darkblue-light border border-white/5 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6">معلومات التواصل</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">الهاتف</p>
                      <p className="text-white font-medium">+966 50 000 0000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">البريد الإلكتروني</p>
                      <p className="text-white font-medium">info@modernlighting.sa</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">العنوان</p>
                      <p className="text-white font-medium">الرياض، المملكة العربية السعودية</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">ساعات العمل</p>
                      <p className="text-white font-medium">السبت - الخميس: 9:00 ص - 10:00 م</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gold/5 to-transparent border border-gold/10 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-gold mb-2">هل تحتاج إلى مساعدة فورية؟</h3>
                <p className="text-white/60 text-sm mb-4">
                  فريق خدمة العملاء لدينا متواجد على مدار الساعة للإجابة على استفساراتك.
                </p>
                <a
                  href="tel:+966500000000"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gold/10 text-gold border border-gold/30 rounded-lg hover:bg-gold/20 transition-all text-sm font-semibold"
                >
                  <Phone className="w-4 h-4" />
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
