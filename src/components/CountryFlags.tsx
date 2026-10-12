import React from 'react'

interface FlagProps {
  className?: string
  title?: string
}

/**
 * Clean, standard Italian Flag (Tricolore: Green #009246, White #FFFFFF, Red #CE2B37)
 * Proportions: 3:2. Includes subtle border to keep white section crisp on white backgrounds.
 */
export function ItalianFlag({ className = 'w-5 h-3.5', title = 'علم إيطاليا' }: FlagProps) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={`inline-block shrink-0 rounded-[2px] ring-1 ring-black/10 overflow-hidden shadow-2xs ${className}`}
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      <rect width="10" height="20" fill="#009246" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#CE2B37" />
    </svg>
  )
}

/**
 * Clean, standard Turkish Flag (Red #E30A17, White Crescent and 5-pointed Star)
 * Proportions: 3:2. Official geometric specs rendered crisp and lightweight.
 */
export function TurkishFlag({ className = 'w-5 h-3.5', title = 'علم تركيا' }: FlagProps) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={`inline-block shrink-0 rounded-[2px] ring-1 ring-black/10 overflow-hidden shadow-2xs ${className}`}
      aria-label={title}
      role="img"
    >
      <title>{title}</title>
      <rect width="30" height="20" fill="#E30A17" />
      {/* Outer White Moon Circle */}
      <circle cx="10.5" cy="10" r="5" fill="#FFFFFF" />
      {/* Inner Red Moon Cutout Circle */}
      <circle cx="12" cy="10" r="4" fill="#E30A17" />
      {/* White Star pointing towards crescent */}
      <polygon
        fill="#FFFFFF"
        transform="translate(17, 10) rotate(-18) scale(0.024)"
        points="0,-100 29.389,-20.9 95.1,-30.9 42.53,19.1 61.8,80.9 0,40 -61.8,80.9 -42.53,19.1 -95.1,-30.9 -29.389,-20.9"
      />
    </svg>
  )
}

/**
 * Helper to render the appropriate flag based on origin string
 */
export function OriginFlagBadge({ origin, className = 'w-4 h-2.5' }: { origin: string; className?: string }) {
  if (origin.includes('إيطاليا') || origin.toLowerCase().includes('italy')) {
    return <ItalianFlag className={className} />
  }
  if (origin.includes('تركيا') || origin.toLowerCase().includes('turkey')) {
    return <TurkishFlag className={className} />
  }
  return null
}
