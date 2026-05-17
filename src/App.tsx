import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import SplashScreen from './components/SplashScreen'
import WhatsAppButton from './components/WhatsAppButton'
import Layout from './Layout'

import Home from './pages/Home'
import Products from './pages/Products'
import Brands from './pages/Brands'
import Projects from './pages/Projects'
import About from './pages/About'
import Branches from './pages/Branches'
import Contact from './pages/Contact'

// ======================================
// مكون تأثير الانتقال بين الصفحات (Page Transition)
// يضمن هذا المكون حركة ناعمة جداً واحترافية عند تغيير الصفحات
// ======================================
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  
  return (
    <motion.div
      key={location.pathname} // تحديث الحركة تلقائياً عند تغير الرابط
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // منحنى حركة ناعم (Smooth Easing)
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // ======================================
  // Splash Screen
  // ======================================
  if (loading) {
    return <SplashScreen />
  }

  return (
    <>
      {/* ======================================
          Main Routes with Smooth Transitions
      ====================================== */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
          <Route path="/brands" element={<PageTransition><Brands /></PageTransition>} />
          <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/branches" element={<PageTransition><Branches /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        </Route>
      </Routes>

      {/* ======================================
          Fixed WhatsApp Button
      ====================================== */}
      <WhatsAppButton />
    </>
  )
}

export default App

