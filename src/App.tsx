import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import WhatsAppButton from './components/WhatsAppButton'
import AIChatWidget from './components/AIChatWidget'
import OfflineNotice from './components/OfflineNotice'
import Layout from './Layout'

import Home from './pages/Home'
import { initErrorMonitoring } from './utils/errorTracker'

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
const HomeCleanWhitePreview = lazy(() => import('./pages/HomeCleanWhitePreview'))

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full">{children}</div>
}

// مؤشر تحميل مخصص خفيف وسريع للصفحات الثانوية
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // 0. تهيئة الجلسة ومراقبة الأعطال وضبط الخلفية فوراً
  useEffect(() => {
    initErrorMonitoring();
    sessionStorage.setItem('enarah_session_active', 'true');
    if (typeof window !== 'undefined') {
      document.body.style.backgroundColor = '#f8fafc';
      window.dispatchEvent(new CustomEvent('enarah_splash_finished'));
    }
  }, []);

  // التحميل المسبق للصفحات في وقت الخمول لفتحها فوراً بـ 0 ثانية بدلاً من أي تأخير
  useEffect(() => {
    const prefetchTimer = setTimeout(() => {
      import('./pages/Products')
      import('./pages/Projects')
      import('./pages/Contact')
    }, 1200)

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

          {/* 👈 مسار المعاينة المعمارية البيضاء النظيفة بالكامل (Clean White Architecture) */}
          <Route path="/preview" element={<PageTransition><HomeCleanWhitePreview /></PageTransition>} />
        </Routes>
      </Suspense>

      {!isGamePage && location.pathname !== '/preview' && (
        <>
          <WhatsAppButton />
          <AIChatWidget />
        </>
      )}
    </>
  )
}

export default App
