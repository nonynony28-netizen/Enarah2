import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/218916580068"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(34,197,94,0.55)] hover:scale-110 hover:bg-green-400 transition-all duration-300"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  )
}
