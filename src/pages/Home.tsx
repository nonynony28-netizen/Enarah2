// ضع هذا أعلى الملف بالكامل:
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

// أضف هذا فوق Home مباشرة (خارج أي كومبوننت)
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
        `https://enarah2.vercel.app/api/app?prompt=${encodeURIComponent(prompt)}`
      )

      const data = await res.json()

      setResponse(
        data.response || data.error || 'تعذر الحصول على رد حالياً.'
      )
    } catch (error) {
      setResponse('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.')
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300 shadow-[0_0_22px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
          {isOpen ? 'إغلاق المساعد الذكي' : 'تحدث مع الذكاء الاصطناعي'}
        </button>

        <a
          href="https://enarah2.vercel.app/api/app?prompt=مرحبا"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          فتح رابط الـ API
        </a>
      </div>

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

// داخل Home فقط:
// ابحث عن هذا:
<div className="pt-16 md:pt-20">

// واستبدله بهذا:
<div className="pt-16 md:pt-20">
  <section className="bg-darkblue py-10 border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AIChatButtons />
    </div>
  </section>
