import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Lightbulb, Zap, Sparkles, MapPin } from 'lucide-react'

const navItems = [
  { path: '/', label: 'الرئيسية', icon: Home },
  { path: '/products', label: 'المنتجات', icon: Lightbulb },
  { path: '/wire-prices', label: 'الأسعار', icon: Zap },
  { path: '/projects', label: 'المشاريع', icon: Sparkles },
  { path: '/branches', label: 'الفروع', icon: MapPin },
]

export default function BottomNavBar() {
  const location = useLocation()

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] bg-[#0a192f]/70 backdrop-blur-xl border border-blue-500/20 rounded-[2rem] py-2 px-3 shadow-[0_10px_35px_rgba(0,0,0,0.5)] md:hidden z-50 flex items-center justify-around select-none">
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
                className="absolute inset-0 bg-blue-500/15 border border-blue-400/25 shadow-[0_0_12px_rgba(59,130,246,0.2)] rounded-2xl"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
            <Icon
              className={`w-5 h-5 transition-colors duration-300 relative z-10 ${
                isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'text-slate-400'
              }`}
            />
            <span
              className={`text-[9px] font-bold mt-1 transition-colors duration-300 relative z-10 ${
                isActive ? 'text-white' : 'text-slate-400'
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
