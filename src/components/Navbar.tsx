import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Lightbulb, Award, Zap, Sparkles, ChevronDown } from 'lucide-react'

// نمط الوهج للعناوين والشعارات المضيئة
const glowingTitleStyle = { textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)' }

// القوائم المنفصلة
const mainLinks = [
  { path: '/', label: 'الرئيسية' },
]

const servicesDropdown = {
  label: 'الأقسام والأسعار',
  items: [
    { path: '/products', label: 'معرض المنتجات', desc: 'تصفح أحدث حلول الإضاءة ومواد الكهرباء الذكية بجودة عالية.', icon: Lightbulb },
    { path: '/wire-prices', label: 'أسعار الأسلاك', desc: 'النشرة اليومية المحدثة لأسعار الأسلاك الإيطالية المعتمدة.', icon: Zap },
    { path: '/brands', label: 'الشركات العالمية', desc: 'شركاء النجاح وأفضل الماركات والبراندات العالمية المعتمدة.', icon: Award },
    { path: '/projects', label: 'المشاريع المنفذة', desc: 'استكشف جزءاً من مشاريعنا وتأسيساتنا الكهربائية والهندسية.', icon: Sparkles },
  ]
}

const otherLinks = [
  { path: '/blog', label: 'المدونة' },
  { path: '/about', label: 'من نحن' },
  { path: '/branches', label: 'الفروع' },
  { path: '/contact', label: 'تواصل معنا' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setIsDropdownOpen(false)
    setIsMobileDropdownOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a192f]/80 backdrop-blur-xl shadow-lg border-b border-blue-500/10 py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row-reverse items-center justify-between h-14 md:h-16">

            {/* Logo الشعار */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Lightbulb className="w-7 h-7 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
              </motion.div>
              <span className="font-extrabold text-xl md:text-2xl tracking-wide">
                <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">الإنارة</span>{' '}
                <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">الحديثة</span>
              </span>
            </Link>

            {/* Desktop Nav قائمة الكمبيوتر */}
            <div className="hidden md:flex items-center gap-1.5 relative">
              {/* الرئيسية */}
              <Link
                to="/"
                className={`relative px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10 hover:scale-[1.02] active:scale-[0.98] ${
                  location.pathname === '/' ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {location.pathname === '/' && (
                  <motion.div
                    layoutId="active-desktop-nav"
                    className="absolute inset-0 bg-blue-500/20 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                الرئيسية
              </Link>

              {/* القائمة المنسدلة التفاعلية (أقسامنا وأسعارنا) */}
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10 outline-none hover:scale-[1.02] ${
                    servicesDropdown.items.some(item => location.pathname === item.path)
                      ? 'text-white bg-blue-500/20 border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {servicesDropdown.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-[480px] bg-[#0a192f]/95 backdrop-blur-xl border border-blue-500/20 rounded-[1.5rem] p-4 shadow-2xl z-50 grid grid-cols-2 gap-3"
                    >
                      {servicesDropdown.items.map((item) => {
                        const isSubActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-blue-500/10 hover:translate-y-[-2px] border border-transparent hover:border-blue-500/25 ${
                              isSubActive ? 'bg-blue-500/5 border-blue-500/10' : ''
                            }`}
                          >
                            <div className={`p-2.5 rounded-xl ${isSubActive ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-blue-400'}`}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div className="text-right flex-grow">
                              <h4 className="text-sm font-bold text-white mb-0.5">{item.label}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                            </div>
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* باقي الروابط */}
              {otherLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10 hover:scale-[1.02] active:scale-[0.98] ${
                      isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-desktop-nav"
                        className="absolute inset-0 bg-blue-500/20 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button زر الجوال */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-blue-500/20 active:scale-95 transition-all duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav قائمة الجوال */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[75%] max-w-sm bg-gradient-to-b from-[#0a192f] to-[#0d2342] border-l border-blue-500/20 shadow-2xl overflow-y-auto"
            >
              <div className="flex flex-col pt-24 px-6 gap-3 pb-8">
                {/* الرئيسية */}
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`block px-5 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 ${
                    location.pathname === '/' ? 'text-white bg-blue-500/15 border border-blue-400/30' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  الرئيسية
                </Link>

                {/* قائمة الأكورديون للجوال (أقسامنا وأسعارنا) */}
                <div className="border border-white/5 rounded-2xl bg-white/[0.02] p-2">
                  <button
                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-base font-bold text-slate-300 outline-none"
                  >
                    <span>{servicesDropdown.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isMobileDropdownOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden flex flex-col gap-1.5 px-2 mt-1 border-t border-white/5 pt-2"
                      >
                        {servicesDropdown.items.map((item) => {
                          const isSubActive = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                isSubActive ? 'text-white bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <item.icon className="w-4 h-4 text-blue-400" />
                              <span>{item.label}</span>
                            </Link>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* باقي الروابط للجوال */}
                {otherLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`block relative px-5 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 overflow-hidden ${
                          isActive
                            ? 'text-white bg-blue-500/15 border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        )}
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
