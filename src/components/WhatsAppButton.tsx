import { MessageCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function WhatsAppButton() {
  const location = useLocation()
  if (location.pathname.startsWith('/game')) return null

  return (
    <a
      href="https://wa.me/218916580068"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(34,197,94,0.45)] hover:scale-108 active:scale-95 transition-all duration-300"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  )
}
