import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Building2,
  MapPin,
  BookOpen,
  Award,
  Gamepad2,
  Sparkles
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const location = useLocation()
  const { isAr } = useLanguage()

  // Primary direct navigation links
  const primaryLinks = [
    { path: '/products', label: isAr ? 'المنتجات' : 'Products' },
    { path: '/offers', label: isAr ? 'العروض' : 'Offers' },
    { path: '/projects', label: isAr ? 'المشاريع' : 'Projects' },
    { path: '/brands', label: isAr ? 'العلامات التجارية' : 'Brands' },
    { path: '/wire-prices', label: isAr ? 'أسعار الأسلاك' : 'Wire Prices' },
  ]

  // Grouped extra sections requested by user: المقاولين، فروعنا، المدونة، من نحن، اللعبة
  const moreLinks = [
    {
      path: '/contractors',
      label: isAr ? 'قسم المقاولين والكميات' : 'Contractors & Bulk Supply',
      desc: isAr ? 'عروض أسعار خاصة وتوريد المشاريع الكبرى' : 'Special bulk quotes for contractors',
      icon: Building2,
      badge: isAr ? 'خاص' : 'Pro'
    },
    {
      path: '/branches',
      label: isAr ? 'فروعنا' : 'Our Branches',
      desc: isAr ? 'معارض بنغازي والبيضاء وأوقات العمل' : 'Benghazi & Al-Bayda showrooms',
      icon: MapPin
    },
    {
      path: '/blog',
      label: isAr ? 'المدونة' : 'Architectural Blog',
      desc: isAr ? 'هندسة الإضاءة والأفكار المعمارية' : 'Lighting design & photometrics',
      icon: BookOpen
    },
    {
      path: '/about',
      label: isAr ? 'من نحن' : 'About Us',
      desc: isAr ? 'تاريخنا ومسيرة ريادتنا منذ عام 1988' : 'Pioneering heritage since 1988',
      icon: Award
    },
    {
      path: '/game',
      label: isAr ? 'بطل الإنارة (اللعبة)' : 'Light Quest Game',
      desc: isAr ? 'تحدي الإنارة التفاعلي وكوبونات الخصم' : 'Interactive mini-game & vouchers',
      icon: Gamepad2,
      badge: isAr ? 'تفاعلية' : 'Play'
    }
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const isMoreActive = moreLinks.some((item) => location.pathname.startsWith(item.path))

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 150)
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E7EAF0] py-3 transition-all duration-300 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative flex items-center justify-between min-h-[46px]">
        
        {/* Desktop Nav Links - Perfectly Centered & Organized */}
        <nav className="hidden lg:flex items-center justify-center gap-6 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          {/* الرئيسية */}
          <Link
            to="/"
            className={`transition-colors py-1 ${
              location.pathname === '/'
                ? 'text-[#0062D2] font-semibold border-b-2 border-[#0062D2]'
                : 'text-[#15191E] hover:text-[#0062D2]'
            }`}
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>

          {/* الروابط الأساسية */}
          {primaryLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors py-1 ${
                isActive(link.path)
                  ? 'text-[#0062D2] font-semibold border-b-2 border-[#0062D2]'
                  : 'text-[#15191E] hover:text-[#0062D2]'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* خانة المزيد (القائمة المنسدلة للأقسام الأخرى) */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`inline-flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${
                isMoreActive || dropdownOpen
                  ? 'text-[#0062D2] font-semibold border-b-2 border-[#0062D2]'
                  : 'text-[#15191E] hover:text-[#0062D2]'
              }`}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span>{isAr ? 'المزيد' : 'More'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-[#0062D2]' : 'text-[#68717D]'
                }`}
              />
            </button>

            {/* القائمة المنسدلة الفاخرة */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute top-full -right-6 mt-2.5 w-80 bg-white rounded-2xl shadow-xl border border-[#E7EAF0] p-2 z-50 text-right"
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <span className="text-[11px] font-semibold text-[#68717D] uppercase tracking-wider block">
                      {isAr ? 'أقسام وخدمات إضافية' : 'Additional Sections'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {moreLinks.map((item) => {
                      const itemActive = isActive(item.path)
                      const IconComponent = item.icon
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            itemActive
                              ? 'bg-blue-50/80 text-[#0062D2]'
                              : 'hover:bg-slate-50 text-[#15191E]'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              itemActive
                                ? 'bg-[#0062D2] text-white shadow-xs'
                                : 'bg-[#EBF3FC] text-[#0062D2]'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col flex-grow">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-xs font-semibold leading-tight">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#68717D] font-normal leading-tight mt-1 line-clamp-1">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* اتصل بنا */}
          <Link
            to="/contact"
            className={`transition-colors py-1 ${
              location.pathname === '/contact'
                ? 'text-[#0062D2] font-semibold border-b-2 border-[#0062D2]'
                : 'text-[#15191E] hover:text-[#0062D2]'
            }`}
          >
            {isAr ? 'اتصل بنا' : 'Contact'}
          </Link>
        </nav>

        {/* Primary CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-4 ms-auto z-10">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide bg-[#0062D2] text-white hover:bg-[#0047A5] transition-all duration-200 shadow-sm active:scale-98"
          >
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#15191E] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[57px] bottom-0 z-[100] overflow-y-auto bg-white text-[#15191E] px-6 py-8 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-4 text-base font-semibold">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                  location.pathname === '/' ? 'bg-blue-50 text-[#0062D2]' : 'hover:bg-slate-50'
                }`}
              >
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4 opacity-50" /> : <ArrowRight className="w-4 h-4 opacity-50" />}
              </Link>
              {primaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                    isActive(link.path) ? 'bg-blue-50 text-[#0062D2]' : 'hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4 opacity-50" /> : <ArrowRight className="w-4 h-4 opacity-50" />}
                </Link>
              ))}

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                  location.pathname === '/contact' ? 'bg-blue-50 text-[#0062D2]' : 'hover:bg-slate-50'
                }`}
              >
                <span>{isAr ? 'اتصل بنا' : 'Contact'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4 opacity-50" /> : <ArrowRight className="w-4 h-4 opacity-50" />}
              </Link>

              {/* أقسام إضافية في الجوال */}
              <div className="pt-3 pb-1 border-t border-slate-100 my-1">
                <span className="text-xs font-semibold text-[#68717D] uppercase tracking-wider px-3 block mb-2">
                  {isAr ? 'أقسام وخدمات إضافية' : 'Additional Sections'}
                </span>
                <div className="space-y-1">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-between ${
                        isActive(link.path) ? 'bg-blue-50 text-[#0062D2]' : 'text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <link.icon className="w-4 h-4 text-[#0062D2]" />
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      {isAr ? <ArrowLeft className="w-3.5 h-3.5 opacity-40" /> : <ArrowRight className="w-3.5 h-3.5 opacity-40" />}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 rounded-full bg-[#0062D2] text-white font-semibold text-center block shadow-sm hover:bg-[#0047A5] transition-colors"
                >
                  {isAr ? 'تواصل معنا' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
