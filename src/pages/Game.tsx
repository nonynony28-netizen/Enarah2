import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { GameEngine } from '../components/game/GameEngine'

export default function Game() {
  const { isAr } = useLanguage()

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070B14] text-white font-sans antialiased py-0 sm:py-6 px-0 sm:px-6"
    >
      <div className="max-w-[1040px] mx-auto">
        <GameEngine />
      </div>
    </div>
  )
}
