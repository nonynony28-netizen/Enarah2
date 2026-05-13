import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Lightbulb } from 'lucide-react'

const navLinks = [
  { path: '/', label: 'الرئيسية' },
  { path: '/products', label: 'المنتجات' },
  { path: '/brands', label: 'الشركات العالمية' },
  { path: '/projects', label: 'المشاريع' },
  { path: '/about', label: 'من نحن' },
  { path: '/branches', label: 'الفروع' },
  { path: '/contact', label: 'تواصل معنا' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
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
  }, [location.pathname])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-darkblue/95 backdrop-blur-xl shadow-glass border-b border-blue-400/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row-reverse items-center justify-between h-16 md:h-20">

            <Link to="/" className="flex items-center gap-3 group">
              <Lightbulb className="w-6 h-6 text-blue-400 drop-shadow-[0_0_14px_rgba(59,130,246,0.75)] group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300" />

              <span className="font-extrabold text-lg md:text-xl tracking-wide leading-none">
                <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]">
                  الإنارة
                </span>{' '}
                <span className="text-blue-400 drop-shadow-[0_0_16px_rgba(59,130,246,0.85)] group-hover:text-blue-300 transition-all duration-300">
                  الحديثة
                </span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-blue-300 bg-blue-500/10 border border-blue-400/20 shadow-[0_0_18px_rgba(59,130,246,0.22)]'
                      : 'text-white/90 hover:text-blue-300 hover:bg-white/5 drop-shadow-[0_0_8px_rgba(255,255,255,0.12)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-white/90 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.65)]" />
              ) : (
                <Menu className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.65)]" />
              )}
            </button>

          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="absolute top-0 right-0 bottom-0 w-72 bg-darkblue/95 backdrop-blur-xl border-l border-blue-400/10 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
            >
              <div className="flex flex-col pt-20 px-4 gap-2">

                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-300 ${
                        location.pathname === link.path
                          ? 'text-blue-300 bg-blue-500/10 border border-blue-400/20 shadow-[0_0_18px_rgba(59,130,246,0.22)]'
                          : 'text-white/90 hover:text-blue-300 hover:bg-white/5 drop-shadow-[0_0_8px_rgba(255,255,255,0.12)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
