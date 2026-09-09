import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, X, Send, Bot, Loader2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIChatWidget() {
  const { t, isAr } = useLanguage()
  const location = useLocation()
  if (location.pathname.startsWith('/game')) return null
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const QUICK_QUESTIONS = isAr ? [
    'ما هو لون السبوت المناسب للصالة؟ 💡',
    'كيف أختار إنارة السكة (Track Light)؟ 🎛️',
    'ما هو مقاس السلك المناسب لشقة كاملة أو مكيف؟ ⚡',
    'ما الفرق بين الإضاءة الصفراء والبيضاء والذهبية؟ 🌟'
  ] : [
    'What is the best spotlight color for the living room? 💡',
    'How do I choose track lighting? 🎛️',
    'What wire size is suitable for a whole apartment or AC? ⚡',
    'What is the difference between yellow, white, and golden light? 🌟'
  ];

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
          content: isAr 
            ? 'مرحباً بك في الإنارة الحديثة! 💡 أنا مساعدك الذكي المتخصص في مواد التأسيس الكهربائي، الإنارة، التشطيبات والديكور. اسألني عن أي شيء تحتاجه وسأجيبك فوراً!'
            : 'Welcome to Modern Enarah! 💡 I am your smart assistant specializing in electrical foundation materials, lighting, finishes, and decoration. Ask me anything you need and I will reply instantly!',
          timestamp: new Date()
        }
      ])
    }
  }, [isAr])

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
        replyContent = data.answer || data.response || (isAr ? 'أهلاً بك! كيف يمكنني مساعدتك؟' : 'Hello! How can I help you?')
      } else {
        replyContent = data.error || (isAr ? 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.' : 'Sorry, an error occurred while connecting to the assistant. Please try again later.')
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
        content: isAr ? 'لم أتمكن من الاتصال بالخادم. يرجى التأكد من اتصالك بالإنترنت والمحاولة مجدداً.' : 'Could not connect to the server. Please verify your internet connection and try again.',
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
      <div className={`fixed bottom-6 z-50 flex items-center ${
        isAr ? 'left-6 flex-row-reverse md:flex-row md:right-[96px] md:left-auto' : 'right-6 flex-row md:flex-row-reverse md:left-[96px] md:right-auto'
      }`}>
        {/* فقاعة المحادثة الإبداعية "مساعدك الذكي" */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: isAr ? 20 : -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: isAr ? 10 : -10, scale: 0.9 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              onClick={() => setIsOpen(true)}
              className="relative px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold whitespace-nowrap shadow-xl flex items-center gap-2 select-none cursor-pointer hover:bg-slate-50 hover:border-blue-500/50 transition-all duration-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span>{isAr ? 'اسأل مساعدك الذكي 💡' : 'Ask your AI assistant 💡'}</span>
              {/* ذيل الفقاعة الصغير */}
              <div className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent ${
                isAr 
                  ? 'right-auto -left-[6px] border-r-[6px] border-r-white'
                  : 'left-auto -right-[6px] border-l-[6px] border-l-white'
              }`} />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all duration-300 group"
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
                <span className="absolute -top-1 -left-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
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
            className={`fixed bottom-[90px] z-50 w-auto md:w-[400px] h-[#460px] md:h-[600px] bg-white/98 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden ${
              isAr ? 'left-4 right-4 md:left-auto md:right-[96px] text-right' : 'left-4 right-4 md:right-auto md:left-[96px] text-left'
            }`}
          >
            {/* رأس شات نافذة المساعد الذكي */}
            <div className={`relative z-10 p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <div className={`flex items-center gap-3 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="relative w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Bot className="w-5.5 h-5.5" />
                  <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div className={isAr ? 'text-right' : 'text-left'}>
                  <h3 className="text-sm font-bold text-slate-900 leading-none mb-1">{isAr ? 'مساعد الإنارة الحديثة' : 'Modern Enarah Assistant'}</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold block">{isAr ? 'متصل الآن - ذكاء اصطناعي' : 'Online now - AI Bot'}</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-slate-200/60 text-slate-600 hover:text-slate-900 hover:bg-slate-200 active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* قائمة الرسائل المتبادلة */}
            <div className="relative z-10 flex-grow overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 bg-white">
              {messages.map((msg) => {
                const isUser = msg.role === 'user'
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isUser
                        ? (isAr ? 'justify-start' : 'justify-end')
                        : (isAr ? 'justify-end' : 'justify-start')
                    } animate-fade-in`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[1.25rem] px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? `bg-blue-600 text-white shadow-sm ${isAr ? 'rounded-br-none' : 'rounded-bl-none'}`
                          : `bg-slate-100 text-slate-800 border border-slate-200 ${isAr ? 'rounded-bl-none' : 'rounded-br-none'}`
                      }`}
                    >
                      {msg.content}
                      <span className={`block text-[9px] mt-1.5 text-left ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                        {msg.timestamp.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* مؤشر التفكير والكتابة */}
              {isLoading && (
                <div className={`flex ${isAr ? 'justify-end' : 'justify-start'}`}>
                  <div className={`bg-slate-100 text-slate-700 border border-slate-200 px-4 py-3.5 flex items-center gap-1.5 ${
                    isAr ? 'rounded-[1.25rem] rounded-bl-none' : 'rounded-[1.25rem] rounded-br-none'
                  }`}>
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-xs text-slate-500 font-medium">{isAr ? 'يتم الآن التفكير...' : 'Thinking...'}</span>
                  </div>
                </div>
              )}

              {/* الأسئلة السريعة المقترحة */}
              {messages.length <= 1 && !isLoading && (
                <div className="pt-4 space-y-2">
                  <span className="text-xs text-slate-500 font-semibold block mb-2">{isAr ? 'أسئلة شائعة قد تهمك:' : 'Suggested questions:'}</span>
                  <div className="flex flex-col gap-2">
                    {QUICK_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className={`text-xs text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-3.5 py-2.5 transition-all duration-200 font-medium ${
                          isAr ? 'text-right' : 'text-left'
                        }`}
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
              className="relative z-10 p-4 border-t border-slate-200 bg-slate-50/50"
            >
              <div className={`relative flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm ${
                isAr ? 'flex-row' : 'flex-row-reverse'
              }`}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isAr ? 'اسألني عن الإنارة، الأسلاك، التشطيب...' : 'Ask me about lighting, wires, finishing...'}
                  className={`w-full bg-transparent text-slate-900 text-sm px-4 py-3.5 outline-none placeholder:text-slate-400 ${
                    isAr ? 'text-right pr-4' : 'text-left pl-4'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 text-blue-600 hover:text-blue-700 disabled:text-slate-300 transition-colors"
                  aria-label="إرسال الرسالة"
                >
                  <Send className={`w-5 h-5 ${isAr ? 'transform rotate-180' : ''}`} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
