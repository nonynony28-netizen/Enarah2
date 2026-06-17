import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import SplashScreen from './components/SplashScreen'
import WhatsAppButton from './components/WhatsAppButton'
import AIChatWidget from './components/AIChatWidget'
import Layout from './Layout'

import Home from './pages/Home'
import Products from './pages/Products'
import Brands from './pages/Brands'
import Projects from './pages/Projects'
import About from './pages/About'
import Branches from './pages/Branches'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import WirePrices from './pages/WirePrices' // 👈 أضفنا صفحة الأسعار هنا


// ======================================
// مكون تأثير الانتقال بين الصفحات
// ======================================
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  
  return (
    <motion.div
      key={location.pathname} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} 
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  // 1. شاشة البداية
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // 2. عداد الزوار 
  useEffect(() => {
    const recordVisit = async () => {
      if (!localStorage.getItem('enarah_visited')) {
        try {
          await fetch('https://enarah2.vercel.app/api/save-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Visitor',
              email: `visit_${Date.now()}@analytics.local`, 
              phone: JSON.stringify({ type: 'visit' })
            })
          });
          localStorage.setItem('enarah_visited', 'true');
        } catch (error) {
          console.error('Error recording visit:', error);
        }
      }
    };
    recordVisit();
  }, []);

  if (loading) {
    return <SplashScreen />
  }

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
          <Route path="/brands" element={<PageTransition><Brands /></PageTransition>} />
          <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} /> 
          
          {/* 👈 مسار صفحة أسعار الأسلاك */}
          <Route path="/wire-prices" element={<PageTransition><WirePrices /></PageTransition>} /> 


          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/branches" element={<PageTransition><Branches /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        </Route>
      </Routes>

      <WhatsAppButton />
      <AIChatWidget />
    </>
  )
}

export default App
