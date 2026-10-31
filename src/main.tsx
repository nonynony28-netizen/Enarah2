import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './hooks/useLanguage.tsx'
import { CartProvider } from './hooks/useCart.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)

// تسجيل Service Worker لدعم إشعارات الدفع (Web Push) والعمل أوفلاين
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const registerSw = () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((err) => {
        console.warn('SW registration notice:', err)
      })
  }
  if (document.readyState === 'complete') {
    registerSw()
  } else {
    window.addEventListener('load', registerSw)
  }
}
