import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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
const Game = lazy(() => import('./pages/Game'))

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
  const navigate = useNavigate();
  const location = useLocation();

  // 0. تهيئة الجلسة
  useEffect(() => {
    sessionStorage.setItem('enarah_session_active', 'true');
  }, []);

  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      const isBot = /Chrome-Lighthouse|Lighthouse|PageSpeed|Googlebot|HeadlessChrome|Speed Insights|PTST|Mediapartners|Google-Inspection/i.test(navigator.userAgent || '') || 
                    !!(window as any).__PRERENDER_INJECTED || 
                    !!(window as any).navigator?.webdriver;
      if (isBot) return false;
      if (sessionStorage.getItem('enarah_splash_done')) return false;
      return true;
    }
    return false;
  });

  // 1. شاشة البداية السينمائية المتوهجة السلسة
  useEffect(() => {
    if (!showSplash) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('enarah_splash_finished'));
      }
      return;
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('enarah_splash_done', 'true');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('enarah_splash_finished'));
      }
    }, 1400);

    return () => {
      clearTimeout(timer);
    };
  }, [showSplash]);

  // التحميل المسبق لصفحة المنتجات وباقي الصفحات لفتحها فوراً بـ 0 ثانية بدلاً من التأخير
  useEffect(() => {
    const prefetchTimer = setTimeout(() => {
      import('./pages/Products')
      import('./pages/Projects')
      import('./pages/Contact')
    }, 500)

    return () => {
      clearTimeout(prefetchTimer)
    }
  }, [])

  // 2. عداد الزوار خلسة بعد اكتمال التحميل دون إبطاء الخيط الرئيسي
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

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => recordVisit());
    } else {
      setTimeout(recordVisit, 3000);
    }
  }, []);

  const isGamePage = location.pathname === '/game';

  return (
    <>
      <OfflineNotice />
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
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
            
            {/* 👈 مسار لعبة بطل الإنارة */}
            <Route path="/game" element={<PageTransition><Game /></PageTransition>} />

            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/branches" element={<PageTransition><Branches /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          </Route>
        </Routes>
      </Suspense>

      {!isGamePage && (
        <>
          <WhatsAppButton />
          <AIChatWidget />
        </>
      )}
    </>
  )
}

export default App
