import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowLeft, ArrowRight } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { isAr } = useLanguage()

  const navLinks = [
    { path: '/products', label: isAr ? 'المنتجات' : 'Products' },
    { path: '/offers', label: isAr ? 'العروض' : 'Offers' },
    { path: '/projects', label: isAr ? 'المشاريع' : 'Projects' },
    { path: '/brands', label: isAr ? 'العلامات التجارية' : 'Brands' },
    { path: '/wire-prices', label: isAr ? 'أسعار الأسلاك' : 'Wire Prices' },
    { path: '/about', label: isAr ? 'عن الشركة' : 'About' },
    { path: '/contact', label: isAr ? 'اتصل بنا' : 'Contact' },
  ]

  const secondaryLinks = [
    { path: '/branches', label: isAr ? 'فروعنا' : 'Branches' },
    { path: '/blog', label: isAr ? 'المدونة' : 'Blog' },
    { path: '/game', label: isAr ? 'لعبة بطل الإنارة' : 'Game' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E7EAF0] py-3.5 transition-all duration-300 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative flex items-center justify-between min-h-[44px]">
        {/* Desktop Nav Links - Perfectly Centered */}
        <nav className="hidden lg:flex items-center justify-center gap-7 text-sm font-medium absolute left-1/2 -translate-x-1/2">
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
          {navLinks.map((link) => (
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
        </nav>

        {/* Primary CTA & Mobile Toggle */}
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
              {navLinks.map((link) => (
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

              <div className="pt-2 pb-1 border-t border-slate-100 my-1">
                <span className="text-xs font-semibold text-[#68717D] uppercase tracking-wider px-3 block mb-2">
                  {isAr ? 'أقسام إضافية' : 'Additional'}
                </span>
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      isActive(link.path) ? 'bg-blue-50 text-[#0062D2]' : 'text-[#475569] hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5 opacity-40" /> : <ArrowRight className="w-3.5 h-3.5 opacity-40" />}
                  </Link>
                ))}
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
