import { useEffect, useRef, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * ScrollRestoration
 * 
 * Centralized, bulletproof scroll restoration coordinator for ENARAH MODERN.
 * Compatible with React Router v7 and React 19 lazy loading / Suspense.
 * 
 * Behaviors:
 * 1. PUSH / new page navigation: Scroll instantly to (0, 0).
 * 2. POP / Browser Back & Forward: Restores previous page scroll position accurately,
 *    even with lazy loaded routes (via height-aware retries).
 * 3. Anchor hashes (#id): Smoothly scrolls to target element with sticky navbar offset compensation.
 * 4. Internal filters & query params (same pathname): Preserves current scroll position.
 * 5. Page refresh: Session storage preserves position across soft reloads.
 */

const STORAGE_PREFIX = 'enarah_scroll_pos_'

function getStorageKey(location: { pathname: string; search: string; key?: string }) {
  // Use location.key if present (unique per history entry), otherwise fallback to path+search
  return `${STORAGE_PREFIX}${location.key || (location.pathname + location.search)}`
}

export default function ScrollRestoration() {
  const location = useLocation()
  const navigationType = useNavigationType()
  
  // Track previous pathname to differentiate between new page navigation and query param filters
  const prevPathnameRef = useRef<string>(location.pathname)
  const prevLocationKeyRef = useRef<string>(location.key)
  const cancelScrollRetryRef = useRef<(() => void) | null>(null)

  // Configure browser native scroll restoration to manual so it doesn't fight React rendering
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      const original = window.history.scrollRestoration
      window.history.scrollRestoration = 'manual'
      return () => {
        window.history.scrollRestoration = original
      }
    }
  }, [])

  // Save current scroll position continuously (debounced via requestAnimationFrame)
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          try {
            const currentY = window.scrollY || document.documentElement.scrollTop || 0
            const currentX = window.scrollX || document.documentElement.scrollLeft || 0
            const key = getStorageKey(location)
            sessionStorage.setItem(key, JSON.stringify({ x: currentX, y: currentY }))
          } catch {
            // Ignore quota or private browsing errors
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Also save on beforeunload
    const handleBeforeUnload = () => {
      try {
        const currentY = window.scrollY || document.documentElement.scrollTop || 0
        const currentX = window.scrollX || document.documentElement.scrollLeft || 0
        const key = getStorageKey(location)
        sessionStorage.setItem(key, JSON.stringify({ x: currentX, y: currentY }))
      } catch {
        // Ignore
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [location])

  // Coordinate scroll on location / navigationType changes
  useLayoutEffect(() => {
    // Cancel any running retry from previous navigation
    if (cancelScrollRetryRef.current) {
      cancelScrollRetryRef.current()
      cancelScrollRetryRef.current = null
    }

    const isNewPathname = prevPathnameRef.current !== location.pathname
    const isSamePathDifferentKey = prevLocationKeyRef.current !== location.key
    const hasHash = Boolean(location.hash)

    // Save previous references for next change
    prevPathnameRef.current = location.pathname
    prevLocationKeyRef.current = location.key

    // CASE 1: Anchor link navigation (e.g. /#game-section or #contact)
    if (hasHash) {
      const targetId = decodeURIComponent(location.hash.replace(/^#/, ''))
      let cancelled = false
      let attempts = 0
      const maxAttempts = 30 // ~1.5 seconds

      const tryScrollToElement = () => {
        if (cancelled) return
        const element = document.getElementById(targetId)
        if (element) {
          const navbarOffset = 80 // Sticky navbar compensation
          const targetY = Math.max(0, element.getBoundingClientRect().top + window.pageYOffset - navbarOffset)
          window.scrollTo({
            top: targetY,
            left: 0,
            behavior: 'smooth'
          })
        } else if (attempts < maxAttempts) {
          attempts++
          requestAnimationFrame(tryScrollToElement)
        }
      }

      // Initial attempt immediately, then raf
      tryScrollToElement()

      cancelScrollRetryRef.current = () => {
        cancelled = true
      }
      return
    }

    // CASE 2: Browser Back / Forward (POP)
    if (navigationType === 'POP') {
      let savedPosition: { x: number; y: number } | null = null
      try {
        const key = getStorageKey(location)
        const raw = sessionStorage.getItem(key)
        if (raw) {
          savedPosition = JSON.parse(raw)
        }
      } catch {
        savedPosition = null
      }

      if (savedPosition && typeof savedPosition.y === 'number') {
        const targetY = savedPosition.y
        const targetX = savedPosition.x || 0

        // Attempt instant scroll immediately
        window.scrollTo({ top: targetY, left: targetX, behavior: 'instant' })

        // Because of lazy components / Suspense, document height might expand after mounting.
        // We re-check and ensure the target scroll position is reached over a 400ms window.
        let cancelled = false
        let attempts = 0
        const maxAttempts = 15 // ~400ms total
        const startTime = Date.now()

        const retryScroll = () => {
          if (cancelled) return
          const maxScrollY = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
          )
          
          if (maxScrollY >= targetY || Date.now() - startTime > 500) {
            window.scrollTo({ top: Math.min(targetY, maxScrollY), left: targetX, behavior: 'instant' })
          } else if (attempts < maxAttempts) {
            attempts++
            setTimeout(retryScroll, 30)
          }
        }

        setTimeout(retryScroll, 30)

        cancelScrollRetryRef.current = () => {
          cancelled = true
        }
        return
      } else {
        // No saved position for this POP entry: default to top
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        return
      }
    }

    // CASE 3: PUSH or REPLACE
    // If pathname changed: navigate to top
    if (isNewPathname) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    // If pathname is identical (e.g. query param filter or tab change):
    // DO NOT scroll to top! Leave scroll position untouched.
    if (!isNewPathname && !hasHash) {
      // Intentionally preserve scroll position
      return
    }
  }, [location.pathname, location.search, location.hash, location.key, navigationType])

  return null
}
