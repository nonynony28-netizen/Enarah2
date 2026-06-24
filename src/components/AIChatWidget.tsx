import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, X, Send, Bot, Loader2 } from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_QUESTIONS = [
  'ما هو لون السبوت المناسب للصالة؟ 💡',
  'كيف أختار إنارة السكة (Track Light)؟ 🎛️',
  'ما هو مقاس السلك المناسب لشقة كاملة أو مكيف؟ ⚡',
  'ما الفرق بين الإضاءة الصفراء والبيضاء والذهبية؟ 🌟'
]

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // استرجاع الرسائل السابقة من الـ sessionStorage لمنع فقدان البيانات عند التصفح
  useEffect(() => {
    const saved = sessionStorage.getItem('enarah_chat_messages')
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
        setMessages(parsed)
      } catch (e) {
        console.error('Error loading chat history:', e)
      }
    } else {
      // رسالة الترحيب الافتراضية
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'مرحباً بك في الإنارة الحديثة! 💡 أنا مساعدك الذكي المتخصص في مواد التأسيس الكهربائي، الإنارة، التشطيبات والديكور. اسألني عن أي شيء تحتاجه وسأجيبك فوراً!',
          timestamp: new Date()
        }
      ])
    }
  }, [])

  // حفظ الرسائل عند التغيير
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('enarah_chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  // التمرير التلقائي لأسفل القائمة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('https://enarah2.vercel.app/api/nour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: text })
      })

      const data = await response.json()
      
      let replyContent = ''
      if (response.ok && data.success) {
        replyContent = data.response
      } else {
        replyContent = data.error || 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.'
      }

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])
    } catch (error) {
      console.error('Chat API Error:', error)
      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'لم أتمكن من الاتصال بالخادم. يرجى التأكد من اتصالك بالإنترنت والمحاولة مجدداً.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <>
      {/* زر الشات العائم */}
      <div className="fixed bottom-6 right-[96px] z-50 flex items-center">
        {/* فقاعة المحادثة الإبداعية "مساعدك الذكي" */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              onClick={() => setIsOpen(true)}
              className="relative ml-auto mr-4 px-4 py-2.5 rounded-2xl bg-[#0d2342]/95 border border-blue-500/30 text-blue-100 text-xs font-bold whitespace-nowrap shadow-[0_0_20px_rgba(59,130,246,0.2)] flex items-center gap-2 select-none cursor-pointer hover:bg-[#122e54] hover:border-blue-500/50 transition-all duration-300"
              style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              اسأل مساعدك الذكي 💡
              {/* ذيل الفقاعة الصغير */}
              <div className="absolute top-1/2 -right-[6px] -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-[#0d2342]" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 flex items-center justify-center text-white shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:shadow-[0_0_35px_rgba(59,130,246,0.85)] hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label="مساعد الذكاء الاصطناعي"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-7 h-7" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center"
              >
                <Lightbulb className="w-7 h-7 text-white animate-pulse" />
                <span className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 border-2 border-blue-500 rounded-full"></span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* نافذة الشات */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-[100px] left-4 right-4 md:left-auto md:right-[96px] z-50 w-auto md:w-[400px] h-[500px] md:h-[600px] bg-[#0a192f]/95 backdrop-blur-xl border border-blue-500/25 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden text-right"
          >
            {/* الخلفيات الجمالية لتصميم نيون راقي */}
            <div className="absolute inset-0 bg-animated-grid opacity-10 pointer-events-none z-0" />
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none z-0" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-blue-300/5 rounded-full blur-[80px] pointer-events-none z-0" />

            {/* رأس شات نافذة المساعد الذكي */}
            <div className="relative z-10 p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Bot className="w-5.5 h-5.5" />
                  <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-green-500 border-2 border-[#0a192f] rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none mb-1">مساعد الإنارة الحديثة</h3>
                  <span className="text-[10px] text-green-400 font-semibold block">متصل الآن - ذكاء اصطناعي</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* قائمة الرسائل المتبادلة */}
            <div className="relative z-10 flex-grow overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg) => {
                const isUser = msg.role === 'user'
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-start' : 'justify-end'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[1.25rem] px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-br-none shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                          : 'bg-[#122540] text-slate-100 border border-white/5 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                      <span className="block text-[9px] text-slate-400/70 mt-1.5 text-left">
                        {msg.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* مؤشر التفكير والكتابة */}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-[#122540] text-slate-100 border border-white/5 rounded-[1.25rem] rounded-bl-none px-4 py-3.5 flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">يتم الآن التفكير...</span>
                  </div>
                </div>
              )}

              {/* الأسئلة السريعة المقترحة */}
              {messages.length <= 1 && !isLoading && (
                <div className="pt-4 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold block mb-2">أسئلة شائعة قد تهمك:</span>
                  <div className="flex flex-col gap-2">
                    {QUICK_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-right text-xs text-blue-300/90 hover:text-white bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/15 hover:border-blue-500/30 rounded-xl px-3.5 py-2.5 transition-all duration-300"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* حقل الإدخال والإرسال */}
            <form
              onSubmit={handleFormSubmit}
              className="relative z-10 p-4 border-t border-white/5 bg-white/[0.01]"
            >
              <div className="relative flex items-center bg-[#0a192f] border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-all">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="اسألني عن الإنارة، الأسلاك، التشطيب..."
                  className="w-full bg-transparent text-white text-sm px-4 py-3.5 outline-none text-right pr-4"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 text-blue-400 hover:text-blue-300 disabled:text-slate-600 transition-colors"
                  aria-label="إرسال الرسالة"
                >
                  <Send className="w-5 h-5 transform rotate-180" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
