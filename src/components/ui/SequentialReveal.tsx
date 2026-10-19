import * as React from 'react'
import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// SHARED INTERSECTION OBSERVER SINGLETON
// Single shared observer instance across the entire application.
// Unobserves immediately upon reveal; zero ongoing scroll listener overhead.
// ============================================================================

type ObserverCallback = () => void
let sharedObserver: IntersectionObserver | null = null
const observerCallbacks = new Map<Element, ObserverCallback>()

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            const callback = observerCallbacks.get(el)
            if (callback) {
              callback()
              observerCallbacks.delete(el)
              sharedObserver?.unobserve(el)
            }
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    )
  }
  return sharedObserver
}

export function observeElement(el: Element, onIntersect: ObserverCallback): () => void {
  if (
    typeof window === 'undefined' ||
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    onIntersect()
    return () => {}
  }

  const observer = getSharedObserver()
  if (!observer) {
    onIntersect()
    return () => {}
  }

  observerCallbacks.set(el, onIntersect)
  observer.observe(el)

  return () => {
    observerCallbacks.delete(el)
    observer.unobserve(el)
  }
}

// ============================================================================
// SEQUENTIAL REVEAL CONTEXT
// ============================================================================

interface SequentialRevealContextValue {
  isRevealed: boolean
  staggerDelay: number
  duration: number
  distance: number
  isMobile: boolean
  prefersReduced: boolean
}

const SequentialRevealContext = createContext<SequentialRevealContextValue | null>(null)

// ============================================================================
// SEQUENTIAL REVEAL GROUP
// Wraps a section or group of elements. A single observer watches the container.
// When triggered, child items reveal sequentially with staggerDelay.
// ============================================================================

export interface SequentialRevealGroupProps extends React.HTMLAttributes<HTMLElement> {
  /** HTML element type (default: 'div') */
  as?: React.ElementType
  /** Stagger delay between items in milliseconds (default: 100ms, mobile: 70-80ms) */
  staggerDelay?: number
  /** Reveal duration in milliseconds (default: 350ms, mobile: 300ms) */
  duration?: number
  /** Max vertical glide distance in pixels (default: 6px, mobile: 4px) */
  distance?: number
  /** Delay before first item begins revealing in milliseconds (default: 0) */
  baseDelay?: number
  /** Custom children */
  children: React.ReactNode
}

export function SequentialRevealGroup({
  as: Component = 'div',
  staggerDelay = 100,
  duration = 350,
  distance = 6,
  baseDelay = 0,
  className,
  children,
  ...props
}: SequentialRevealGroupProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Accessibility check
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrefersReduced(true)
      setIsRevealed(true)
      return
    }

    setIsMobile(window.innerWidth < 768)

    const el = containerRef.current
    if (!el) return

    // 2. Attach to shared observer singleton
    const unobserve = observeElement(el, () => {
      if (baseDelay > 0) {
        setTimeout(() => setIsRevealed(true), baseDelay)
      } else {
        setIsRevealed(true)
      }
    })

    return () => {
      unobserve()
    }
  }, [baseDelay])

  // Mobile-first optimized settings: 75ms stagger, 300ms duration, 4px vertical distance
  const effectiveStagger = isMobile ? Math.min(staggerDelay, 80) : staggerDelay
  const effectiveDuration = isMobile ? Math.min(duration, 300) : duration
  const effectiveDistance = isMobile ? Math.min(distance, 4) : distance

  return (
    <SequentialRevealContext.Provider
      value={{
        isRevealed,
        staggerDelay: effectiveStagger,
        duration: effectiveDuration,
        distance: effectiveDistance,
        isMobile,
        prefersReduced,
      }}
    >
      <Component
        ref={containerRef}
        className={cn(className)}
        data-seq-reveal-group=""
        {...props}
      >
        {children}
      </Component>
    </SequentialRevealContext.Provider>
  )
}

// ============================================================================
// SEQUENTIAL REVEAL ITEM
// Can be used inside a <SequentialRevealGroup> (inheriting group trigger & stagger)
// or standalone (observing its own container).
// ============================================================================

export interface SequentialRevealItemProps extends React.HTMLAttributes<HTMLElement> {
  /** HTML element type (default: 'div') */
  as?: React.ElementType
  /** Sequential index in group (0-based). Used to calculate delay = index * staggerDelay */
  index?: number
  /** Explicit delay in milliseconds. Overrides index * staggerDelay if provided */
  delay?: number
  /** Custom duration override */
  duration?: number
  /** Custom distance override */
  distance?: number
  /** Custom children */
  children: React.ReactNode
}

export function SequentialRevealItem({
  as: Component = 'div',
  index = 0,
  delay,
  duration: customDuration,
  distance: customDistance,
  className,
  style,
  children,
  ...props
}: SequentialRevealItemProps) {
  const context = useContext(SequentialRevealContext)
  const standaloneRef = useRef<HTMLElement>(null)
  const [standaloneRevealed, setStandaloneRevealed] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Standalone mode: if not wrapped in a SequentialRevealGroup
  useEffect(() => {
    if (context) return // Handled by group context
    if (typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrefersReduced(true)
      setStandaloneRevealed(true)
      return
    }

    setIsMobile(window.innerWidth < 768)

    const el = standaloneRef.current
    if (!el) return

    const unobserve = observeElement(el, () => {
      setStandaloneRevealed(true)
    })

    return () => {
      unobserve()
    }
  }, [context])

  const isRevealed = context ? context.isRevealed : standaloneRevealed
  const isReduced = context ? context.prefersReduced : prefersReduced
  const mobile = context ? context.isMobile : isMobile

  // Timing & distances
  const stagger = context ? context.staggerDelay : 100
  const effectiveDelay = delay !== undefined ? delay : index * stagger
  const baseDuration = customDuration ?? (context ? context.duration : 350)
  const effectiveDuration = mobile ? Math.min(baseDuration, 300) : baseDuration
  const baseDistance = customDistance ?? (context ? context.distance : 6)
  const effectiveDistance = mobile ? Math.min(baseDistance, 4) : baseDistance

  const transitionStyle: React.CSSProperties = isReduced
    ? {}
    : {
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed
          ? 'translate3d(0, 0, 0)'
          : `translate3d(0, ${effectiveDistance}px, 0)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${effectiveDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${effectiveDelay}ms`,
        // Clean up will-change immediately after animation to avoid GPU memory retention
        willChange: isRevealed ? 'auto' : 'opacity, transform',
        ...style,
      }

  return (
    <Component
      ref={context ? undefined : standaloneRef}
      style={transitionStyle}
      className={cn(className)}
      data-seq-reveal=""
      {...props}
    >
      {children}
    </Component>
  )
}
