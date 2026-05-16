// file name: src/pages/Contact.tsx

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'

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
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
            }
          : {
              opacity: 0,
              y: 30,
            }
      }
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
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

  const [submitted, setSubmitted] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      alert(
        'يرجى تعبئة جميع الحقول'
      )
      return
    }

    try {
      setLoading(true)

      // =====================================
      // إرسال الرسالة إلى نفس قاعدة البيانات
      // name = الاسم
      // phone = الهاتف
      // email = نص الرسالة
      // type = contact لتمييزها داخل لوحة التحكم
      // =====================================
      const res = await fetch(
        '/api/save-user',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.message,
            type: 'contact',
          }),
        }
      )

      const data =
        await res.json()

      if (data.success) {
        setSubmitted(true)

        setFormData({
          name: '',
          phone: '',
          message: '',
        })

        setTimeout(() => {
          setSubmitted(false)
        }, 3000)
      } else {
        alert(
          data.error ||
            data.message ||
            'فشل إرسال الرسالة'
        )
      }
    } catch (error) {
      console.error(
        'Submit Error:',
        error
      )

      alert(
        'حدث خطأ أثناء الإرسال، حاول مرة أخرى'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              تواصل معنا
            </h1>

            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
              نحن هنا لخدمتك. تواصل معنا للاستفسارات، الطلبات، أو التعاقد على المشاريع بكل سهولة
            </p>

            <div className="w-16 h-1 bg-blue-400 mx-auto rounded-full mt-4 shadow-[0_0_14px_rgba(59,130,246,0.45)]" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <FadeIn delay={0.1}>
            <div className="bg-darkblue-light border border-white/5 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-6">
                نموذج التواصل
              </h2>

              {submitted ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Send className="w-6 h-6 text-blue-400" />
                  </div>

                  <h3 className="text-blue-400 font-bold text-lg mb-1">
                    تم إرسال رسالتك!
                  </h3>

                  <p className="text-white/60 text-sm">
                    تم حفظ رسالتك في قاعدة البيانات وسنقوم بالرد عليك قريباً.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      الاسم
                    </label>

                    <input
                      type="text"
                      required
                      value={
                        formData.name
                      }
                      onChange={(
                        e
                      ) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-4 bg-darkblue border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                      placeholder="اسمك الكامل"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      رقم الهاتف
                    </label>

                    <input
                      type="tel"
                      required
                      value={
                        formData.phone
                      }
                      onChange={(
                        e
                      ) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-4 bg-darkblue border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                      placeholder="09xxxxxxxx"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      الرسالة
                    </label>

                    <textarea
                      required
                      rows={4}
                      value={
                        formData.message
                      }
                      onChange={(
                        e
                      ) =>
                        setFormData({
                          ...formData,
                          message:
                            e.target.value,
                        })
                      }
                      className="w-full px-4 py-4 bg-darkblue border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={
                      loading
                    }
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-[0_0_18px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <Send className="w-5 h-5" />

                    {loading
                      ? 'جاري الإرسال...'
                      : 'إرسال الرسالة'}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>

          {/* Contact Info */}
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <div className="bg-darkblue-light border border-white/5 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6">
                  معلومات التواصل
                </h2>

                <div className="space-y-5">
                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>

                    <div>
                      <p className="text-white/50 text-sm">
                        الهاتف
                      </p>

                      <p className="text-white font-medium">
                        +218916580068
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>

                    <div>
                      <p className="text-white/50 text-sm">
                        البريد الإلكتروني
                      </p>

                      <p className="text-white font-medium break-all">
                        enarahmodern@gmail.com
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>

                    <div>
                      <p className="text-white/50 text-sm">
                        العنوان
                      </p>

                      <p className="text-white font-medium leading-relaxed">
                        بنغازي، الليثي مقابل مدرسة العيد الفضي
                        <br />
                        وبجانب عيادة المستقبل لطب الأسنان
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>

                    <div>
                      <p className="text-white/50 text-sm">
                        ساعات العمل
                      </p>

                      <p className="text-white font-medium">
                        من 8 صباحاً إلى 8 مساءً
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help */}
              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-400/10 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-blue-400 mb-2">
                  هل تحتاج إلى مساعدة فورية؟
                </h3>

                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  فريقنا جاهز للرد على جميع استفساراتك وتقديم الدعم الكامل لك بأسرع وقت.
                </p>

                <a
                  href="tel:+218916580068"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 text-blue-400 border border-blue-400/30 rounded-xl hover:bg-blue-500/20 transition-all text-sm font-semibold"
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
