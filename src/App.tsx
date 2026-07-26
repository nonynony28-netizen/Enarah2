import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import SplashScreen from './components/SplashScreen'
import WhatsAppButton from './components/WhatsAppButton'
import AIChatWidget from './components/AIChatWidget'
import OfflineNotice from './components/OfflineNotice'
import Layout from './Layout'

import Home from './pages/Home'

// ⚡ تحميل تفاعلي كسول (React Lazy Loading & Code-Splitting) لتقليل حجم الحزمة الابتدائية وتخصيص السرعة للهواتف
const Products = lazy(() => import('./pages/Products'))
const Brands = lazy(() => import('./pages/Brands'))
const Projects = lazy(() => import('./pages/Projects'))
const About = lazy(() => import('./pages/About'))
const Branches = lazy(() => import('./pages/Branches'))
const Contact = lazy(() => import('./pages/Contact'))
const Blog = lazy(() => import('./pages/Blog'))
const WirePrices = lazy(() => import('./pages/WirePrices'))
const Contractors = lazy(() => import('./pages/Contractors'))

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full">{children}</div>
}

// مؤشر تحميل مخصص خفيف وسريع للصفحات الثانوية
const PageLoader = () => (
  <div className="min-h-[60vh] w-full flex items-center justify-center bg-[#0a192f]">
    <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/80 border border-sky-500/20 text-sky-400 text-sm">
      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
      <span>جاري الفتح السريع...</span>
    </div>
  </div>
)

function App() {
  const [loading, setLoading] = useState(true)

  // 1. شاشة البداية السينمائية الفاخرة والانسيابية
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2400)
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

  return (
    <>
      <OfflineNotice />
      <AnimatePresence>
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
            <Route path="/brands" element={<PageTransition><Brands /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} /> 
            
            {/* 👈 مسار صفحة أسعار الأسلاك */}
            <Route path="/wire-prices" element={<PageTransition><WirePrices /></PageTransition>} /> 
            <Route path="/contractors" element={<PageTransition><Contractors /></PageTransition>} /> 

            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/branches" element={<PageTransition><Branches /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          </Route>
        </Routes>
      </Suspense>

      <WhatsAppButton />
      <AIChatWidget />
    </>
  )
}

export default App
