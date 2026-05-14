// ==============================
// 1) عدّل سطر الاستيراد الأول:
import { useRef, useState } from 'react'

// ==============================
// 2) عدّل استيراد الأيقونات:
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

// ==============================
// 3) أضف هذا الكومبوننت فوق:
// export default function Home()

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
        setResponse(data.error || 'تعذر الحصول على رد.')
      }
    } catch (error) {
      setResponse('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.')
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {/* Main Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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

      {/* AI Chat Box */}
      {isOpen && (
        <div className="mt-6 bg-darkblue-light border border-blue-400/20 rounded-xl p-4">
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
              placeholder="اسأل عن الإنارة، الثريات، السبوتات، أو الخدمات..."
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

// ==============================
// 4) داخل Home فقط:
// ابحث عن:
<div className="pt-16 md:pt-20">

// واستبدله بهذا فقط:
<div className="pt-16 md:pt-20">
  <section className="bg-darkblue py-10 border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AIChatButtons />
    </div>
  </section>

// ==============================
// لا تغيّر أي شيء آخر في الموقع
// لا تحذف أي section
// لا تعدّل Hero أو Why Us أو Products أو CTA
