import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface StatRevealProps extends React.HTMLAttributes<HTMLElement> {
  /** The numerical or string value to display (rendered statically, never counts up) */
  value?: number | string
  /** Alias for value for seamless backward compatibility */
  target?: number | string
  /** Prefix displayed before number (e.g. '+') */
  prefix?: string
  /** Suffix displayed after number (e.g. '+', '%') */
  suffix?: string
  /** Primary label (Arabic or English) */
  label?: string
  /** Secondary micro-label */
  sublabel?: string
  /** Stagger delay in milliseconds (e.g., 0, 60, 120) */
  delay?: number
  /** Reveal duration in milliseconds (350-500ms max, default 400ms) */
  duration?: number
  /** HTML element type (default: 'div') */
  as?: 'div' | 'span'
  /** Custom classes for the number */
  numberClassName?: string
  /** Custom classes for the label */
  labelClassName?: string
  /** Custom classes for the sublabel */
  sublabelClassName?: string
  /** Custom nested children to reveal */
  children?: React.ReactNode
}

/**
 * StatReveal Component
 * Concept: "Static Numbers, Cinematic Reveal"
 *
 * - Renders the final number immediately in the DOM (zero count-up / rolling digits / slot-machine).
 * - Smooth, subtle entrance: 400ms duration, max 6px vertical glide (4px on mobile), smooth easing.
 * - Triggers once when scrolled into view and never restarts during scrolling.
 * - Respects prefers-reduced-motion (instant display without motion).
 * - Guaranteed zero layout shift (CLS = 0) with tabular-nums and stable typography.
 */
export function StatReveal({
  value,
  target,
  prefix = '',
  suffix = '',
  label,
  sublabel,
  delay = 0,
  duration = 400,
  as = 'div',
  className,
  numberClassName,
  labelClassName,
  sublabelClassName,
  children,
  style,
  ...props
}: StatRevealProps) {
  const finalValue = value !== undefined ? value : target
  const containerRef = useRef<HTMLElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Accessibility: Instant presentation if user prefers reduced motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotionQuery.matches) {
      setPrefersReduced(true)
      setIsRevealed(true)
      return
    }

    const checkMobile = window.innerWidth < 768
    setIsMobile(checkMobile)

    const el = containerRef.current
    if (!el) return

    // 2. Cinematic one-shot observer: reveals once and disconnects permanently
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsRevealed(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Animation specifications: 350-500ms max, mobile reduced (~320ms), max 6-8px movement (4px mobile)
  const effectiveDuration = prefersReduced ? 0 : isMobile ? Math.min(duration, 320) : Math.min(Math.max(duration, 350), 500)
  const moveDistance = isMobile ? '4px' : '6px'

  const transitionStyle: React.CSSProperties = prefersReduced
    ? {}
    : {
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translate3d(0, 0, 0)' : `translate3d(0, ${moveDistance}, 0)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${effectiveDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
        willChange: isRevealed ? 'auto' : 'opacity, transform',
        ...style
      }

  const Component = as as any

  return (
    <Component
      ref={containerRef}
      style={transitionStyle}
      className={cn(
        as === 'span' ? 'inline-flex items-baseline' : 'block',
        className
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        <>
          {finalValue !== undefined && (
            <span
              className={cn(
                'tabular-nums tracking-tight font-bold inline-flex items-baseline gap-0.5 whitespace-nowrap',
                numberClassName
              )}
              dir="ltr"
            >
              {prefix && <span className="select-none">{prefix}</span>}
              <span>{finalValue}</span>
              {suffix && <span className="select-none">{suffix}</span>}
            </span>
          )}

          {label && (
            <span
              className={cn(
                'block font-sans tracking-normal leading-snug',
                labelClassName
              )}
            >
              {label}
            </span>
          )}

          {sublabel && (
            <span
              className={cn(
                'block font-sans tracking-normal leading-normal text-xs text-slate-400 mt-0.5',
                sublabelClassName
              )}
            >
              {sublabel}
            </span>
          )}
        </>
      )}
    </Component>
  )
}

export interface StatGroupItem {
  value: number | string
  prefix?: string
  suffix?: string
  label: string
  sublabel?: string
}

export interface CinematicStatsGridProps {
  items: StatGroupItem[]
  className?: string
  itemClassName?: string
  numberClassName?: string
  labelClassName?: string
  sublabelClassName?: string
  staggerMs?: number
}

/**
 * CinematicStatsGrid Component
 * Reusable architectural statistics grid with fine divider lines.
 */
export function CinematicStatsGrid({
  items,
  className,
  itemClassName,
  numberClassName,
  labelClassName,
  sublabelClassName,
  staggerMs = 60
}: CinematicStatsGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-3 gap-4 sm:gap-6 pt-8 mt-8 border-t border-[#E7EAF0] divide-x divide-x-reverse divide-[#E7EAF0]',
        className
      )}
    >
      {items.map((item, idx) => (
        <StatReveal
          key={item.label}
          value={item.value}
          prefix={item.prefix}
          suffix={item.suffix}
          label={item.label}
          sublabel={item.sublabel}
          delay={idx * staggerMs}
          className={cn(
            'px-2 sm:px-4 first:pr-0 last:pl-0',
            itemClassName
          )}
          numberClassName={cn(
            'text-2xl sm:text-3xl lg:text-4xl text-[#0062D2] block',
            numberClassName
          )}
          labelClassName={cn(
            'text-[11px] sm:text-sm text-[#68717D] mt-1.5 font-medium leading-snug',
            labelClassName
          )}
          sublabelClassName={sublabelClassName}
        />
      ))}
    </div>
  )
}

export { StatReveal as AnimatedCounter }
export default StatReveal
