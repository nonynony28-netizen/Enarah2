// file name: src/pages/Home.tsx

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
  Send,
  X,
  MessageCircle,
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

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; content: string }[]
  >([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!prompt.trim() || loading) return

    const userMessage = prompt

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setPrompt('')
    setLoading(true)

    try {
      const response = await fetch(
        `https://enarah2.vercel.app/api/app?prompt=${encodeURIComponent(
          `أنت مساعد احترافي لمتجر إنارة وكهرباء. أجب بشكل مختصر ومفيد عن: ${userMessage}`
        )}`
      )

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: data.response || 'حدث خطأ أثناء المعالجة.',
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: 'تعذر الاتصال بالمساعد الذكي حالياً.',
        },
      ])
    }

    setLoading(false)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.45)] flex items-center justify-center transition-all duration-300"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[550px] bg-darkblue-light border border-blue-400/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-darkblue flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">مساعد الإنارة الذكي</h3>
              <p className="text-white/50 text-sm">
                اسأل عن المنتجات والحلول الكهربائية
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-white/50 text-sm text-center pt-10">
                مرحباً، كيف يمكنني مساعدتك في اختيار منتجات الإنارة؟
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl max-w-[85%] text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-white/5 text-white'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="bg-white/5 text-white p-3 rounded-xl max-w-[85%] text-sm">
                جاري التفكير...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="اكتب سؤالك..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-blue-400"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-4 rounded-lg bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default function Home() {
  return (
    <div className="pt-16 md:pt-20">
      {/* AI Widget */}
      <AIChatWidget />

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
                className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-all duration-300"
              >
                استعرض المنتجات
              </Link>

              <button
                onClick={() =>
                  document.querySelector('button.fixed')?.dispatchEvent(
                    new MouseEvent('click', { bubbles: true })
                  )
                }
                className="px-8 py-3 border border-blue-400/40 text-white font-semibold rounded-lg hover:bg-blue-500/10 transition-all duration-300 flex items-center gap-2"
              >
                <Bot className="w-5 h-5" />
                تحدث مع الذكاء الاصطناعي
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
