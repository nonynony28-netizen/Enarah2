// file name: Home.tsx

import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ChevronLeft,
  Award,
  Shield,
  Sparkles,
  Zap,
  Bot,
  MessageCircle,
  X,
  Send,
} from 'lucide-react'

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
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

const topProducts = [
  { name: 'ثريات', image: '/images/cat-chandelier.jpg', path: '/products' },
  { name: 'سبوتات', image: '/images/cat-spotlight.jpg', path: '/products' },
  { name: 'LED Profile', image: '/images/cat-ledprofile.jpg', path: '/products' },
  { name: 'أسلاك وكوابل', image: '/images/cat-cables.jpg', path: '/products' },
]

function AIChatButtons() {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAskAI = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setResponse('')

    try {
      const res = await fetch(
        `https://enarah2.vercel.app/api/nour?prompt=${encodeURIComponent(
          prompt
        )}`
      )

      const data = await res.json()

      if (data.success) {
        setResponse(data.response)
      } else {
        setResponse(data.error || 'تعذر الحصول على رد حالياً.')
      }
    } catch (error) {
      setResponse('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.')
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300 shadow-[0_0_22px_rgba(59,130,246,0.35)] flex items-center gap-2"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
          {isOpen ? 'إغلاق المساعد الذكي' : 'تحدث مع الذكاء الاصطناعي'}
        </button>

        <a
          href="https://enarah2.vercel.app/api/nour?prompt=مرحبا"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          رابط الـ API
        </a>
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div className="bg-darkblue-light border border-blue-400/20 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAskAI()
                }
              }}
              placeholder="اسأل عن الإنارة، المنتجات، أو الخدمات..."
              className="flex-1 px-4 py-3 rounded-lg bg-darkblue border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
            />

            <button
              type="button"
              onClick={handleAskAI}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'جاري الإرسال...' : 'إرسال'}
            </button>
          </div>

          {response && (
            <div className="mt-4 p-4 rounded-lg bg-darkblue border border-white/5">
              <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                {response}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <div className="pt-16 md:pt-20">
      {/* AI Buttons Section */}
      <section className="bg-darkblue py-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIChatButtons />
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="إنارة فاخرة"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkblue via-darkblue/80 to-darkblue/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              الإنارة{' '}
              <span className="text-blue-400 drop-shadow-[0_0_18px_rgba(59,130,246,0.75)]">
                الحديثة
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed">
              كل ما تحتاجه من الإضاءة والتأسيس الكهربائي بجودة عالية وحلول متكاملة
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/products"
                className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300 shadow-[0_0_22px_rgba(59,130,246,0.35)] flex items-center gap-2"
              >
                استعرض المنتجات
                <ChevronLeft className="w-5 h-5" />
              </Link>

              <Link
                to="/contact"
                className="px-8 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300"
              >
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
