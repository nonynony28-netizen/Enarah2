import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Lightbulb, Zap, Sparkles, MapPin, Gamepad2 } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function BottomNavBar() {
  const location = useLocation()
  const { isAr } = useLanguage()

  if (location.pathname.startsWith('/game')) return null

  const navItems = [
    { path: '/', label: isAr ? 'الرئيسية' : 'Home', icon: Home },
    { path: '/products', label: isAr ? 'المنتجات' : 'Products', icon: Lightbulb },
    { path: '/wire-prices', label: isAr ? 'الأسعار' : 'Prices', icon: Zap },
    { path: '/game', label: isAr ? '🎮 اللعبة' : '🎮 Game', icon: Gamepad2 },
    { path: '/projects', label: isAr ? 'المشاريع' : 'Projects', icon: Sparkles },
    { path: '/branches', label: isAr ? 'الفروع' : 'Branches', icon: MapPin },
  ]

  return (
    <div className="fixed top-[72px] left-1/2 -translate-x-1/2 w-[94%] max-w-[440px] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl py-1.5 px-2 shadow-xl md:hidden z-50 flex items-center justify-around select-none">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon

        return (
          <Link
            key={item.path}
            to={item.path}
            className="relative flex flex-col items-center justify-center py-2 px-3 text-center transition-all duration-300 active:scale-95 flex-1"
          >
            {isActive && (
              <motion.div
                layoutId="active-bottom-nav"
                className="absolute inset-0 bg-blue-50 border border-blue-200 shadow-sm rounded-2xl"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
            <Icon
              className={`w-5 h-5 transition-colors duration-300 relative z-10 ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            />
            <span
              className={`text-[9px] font-bold mt-1 transition-colors duration-300 relative z-10 ${
                isActive ? 'text-blue-700' : 'text-slate-500'
              }`}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
