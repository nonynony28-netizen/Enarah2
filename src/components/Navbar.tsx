import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Lightbulb, Award, Zap, Sparkles, ChevronDown, 
  Home, BookOpen, Info, MapPin, PhoneCall, Phone, Sliders
} from 'lucide-react'

// نمط الوهج للعناوين والشعارات المضيئة
const glowingTitleStyle = { textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)' }

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
  { path: '/blog', label: 'المدونة', icon: BookOpen },
  { path: '/about', label: 'من نحن', icon: Info },
  { path: '/branches', label: 'الفروع', icon: MapPin },
  { path: '/contact', label: 'تواصل معنا', icon: PhoneCall },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.06);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch (e) {
      console.warn("Audio Context not supported or blocked", e);
    }
  };

  const toggleTheme = () => {
    playClickSound();

    // Trigger Laser Sweep Overlay
    const sweep = document.createElement('div');
    sweep.className = 'theme-transition-sweep';
    document.body.appendChild(sweep);
    
    // Toggle the theme halfway through the sweep animation (approx 350ms)
    setTimeout(() => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }, 350);

    // Clean up sweep element
    setTimeout(() => {
      sweep.remove();
    }, 800);
  };


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
              {/* Smart Switch Button */}
              <div className="ml-3 pl-3 border-l border-white/10 flex items-center justify-center">
                <button
                  onClick={toggleTheme}
                  className="relative p-1 w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] overflow-hidden group select-none"
                  title={theme === 'dark' ? 'تشغيل الإضاءة النهارية' : 'إطفاء الإضاءة النهارية'}
                >
                  <div className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center transition-all duration-500 ${
                    theme === 'light' 
                      ? 'border-amber-400 bg-amber-400/10 text-amber-500' 
                      : 'border-blue-500/50 bg-blue-500/5 text-blue-400'
                  }`}>
                    {theme === 'light' ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Lightbulb className="w-4 h-4 fill-amber-400/20" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Lightbulb className="w-4 h-4 opacity-50" />
                      </motion.div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Actions & Menu Button زر الجوال مع مفتاح الإنارة */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="relative p-1 w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] overflow-hidden"
                title={theme === 'dark' ? 'تشغيل الإضاءة' : 'إطفاء الإضاءة'}
              >
                <div className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center transition-all duration-500 ${
                  theme === 'light' 
                    ? 'border-amber-400 bg-amber-400/10 text-amber-500' 
                    : 'border-blue-500/50 bg-blue-500/5 text-blue-400'
                }`}>
                  {theme === 'light' ? (
                    <Lightbulb className="w-3.5 h-3.5 fill-amber-400/20" />
                  ) : (
                    <Lightbulb className="w-3.5 h-3.5 opacity-50" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-blue-500/20 active:scale-95 transition-all duration-300"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav قائمة الجوال */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* الخلفية المظلمة الضبابية الخفيفة */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
              className="absolute top-0 right-0 bottom-0 w-[80%] max-w-sm bg-gradient-to-b from-[#0a192f] via-[#0d2342] to-[#0a192f] border-l border-blue-500/20 shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              {/* نقوش الخلفية الثابتة للأداء العالي */}
              <div className="absolute inset-0 z-0 bg-animated-grid opacity-20 pointer-events-none" />

              <div className="relative z-10">
                {/* رأس المنيو الجانبي */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />
                    <span className="font-black text-lg text-white">
                      الإنارة <span className="text-blue-400">الحديثة</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-white/5 text-slate-300 hover:text-white active:scale-95 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* روابط القائمة */}
                <div className="flex flex-col px-5 pt-6 gap-3">
                  {/* الرئيسية */}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                        location.pathname === '/' 
                          ? 'text-white bg-blue-500/15 border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Home className="w-5 h-5 text-blue-400" />
                      <span>الرئيسية</span>
                    </Link>
                  </motion.div>

                  {/* قائمة الأكورديون للجوال (الأقسام والأسعار) */}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <div className="border border-white/5 rounded-2xl bg-white/[0.02] p-2 transition-all duration-300">
                      <button
                        onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-base font-bold text-slate-300 outline-none hover:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-blue-400" />
                          <span>{servicesDropdown.label}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
                      </button>

                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-1.5 px-2 ${
                          isMobileDropdownOpen 
                            ? 'max-h-[300px] opacity-100 border-t border-white/5 pt-2 mt-1' 
                            : 'max-h-0 opacity-0 pointer-events-none border-transparent pt-0 mt-0'
                        }`}
                      >
                        {servicesDropdown.items.map((item) => {
                          const isSubActive = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all hover:translate-x-[-4px] ${
                                isSubActive ? 'text-white bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <item.icon className="w-4.5 h-4.5 text-blue-400" />
                              <span>{item.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* باقي الروابط للجوال */}
                  {otherLinks.map((link, index) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index + 3) * 0.05 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                            isActive
                              ? 'text-white bg-blue-500/15 border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <link.icon className="w-5 h-5 text-blue-400" />
                          <span>{link.label}</span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* ذيل القائمة الجانبية (بيانات التواصل والروابط الاجتماعية) */}
              <div className="relative z-10 p-6 border-t border-white/5 bg-white/[0.01] flex flex-col gap-4">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">مركز الاتصال</span>
                  <a href="tel:0916580068" className="text-sm font-bold text-white flex items-center justify-end gap-2 hover:text-blue-400 transition-colors">
                    <span>0916580068</span>
                    <Phone className="w-4 h-4 text-blue-400" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
