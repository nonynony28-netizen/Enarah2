import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SplashScreen from './components/SplashScreen'
import Home from './pages/Home'
import Products from './pages/Products'
import Brands from './pages/Brands'
import Projects from './pages/Projects'
import About from './pages/About'
import Branches from './pages/Branches'
import Contact from './pages/Contact'

function PageWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-darkblue font-cairo">
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                }
              />
              <Route
                path="/products"
                element={
                  <PageWrapper>
                    <Products />
                  </PageWrapper>
                }
              />
              <Route
                path="/brands"
                element={
                  <PageWrapper>
                    <Brands />
                  </PageWrapper>
                }
              />
              <Route
                path="/projects"
                element={
                  <PageWrapper>
                    <Projects />
                  </PageWrapper>
                }
              />
              <Route
                path="/about"
                element={
                  <PageWrapper>
                    <About />
                  </PageWrapper>
                }
              />
              <Route
                path="/branches"
                element={
                  <PageWrapper>
                    <Branches />
                  </PageWrapper>
                }
              />
              <Route
                path="/contact"
                element={
                  <PageWrapper>
                    <Contact />
                  </PageWrapper>
                }
              />
            </Routes>
          </AnimatePresence>
          <Footer />
        </motion.div>
      )}
    </div>
  )
}
