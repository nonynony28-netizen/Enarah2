import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function WhatsAppButton() {
  const location = useLocation()
  const isHomePage = location.pathname === '/' || location.pathname === '/preview'
  const [heroVideoFinished, setHeroVideoFinished] = useState(!isHomePage)

  useEffect(() => {
    if (!isHomePage) {
      setHeroVideoFinished(true)
      return
    }
    const handleHeroDone = () => setHeroVideoFinished(true)
    const handleScroll = () => {
      if (window.scrollY > 40) setHeroVideoFinished(true)
    }
    window.addEventListener('enarah_hero_finished', handleHeroDone)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchstart', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('enarah_hero_finished', handleHeroDone)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleScroll)
    }
  }, [isHomePage])

  if (location.pathname.startsWith('/game')) return null

  return (
    <a
      href="https://wa.me/218916580068"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(34,197,94,0.45)] hover:scale-108 active:scale-95 transition-all duration-700 ${
        heroVideoFinished ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
      }`}
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  )
}
