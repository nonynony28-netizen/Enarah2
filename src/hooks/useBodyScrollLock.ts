import { useEffect } from 'react'

let lockCount = 0
let originalOverflow = ''

/**
 * Safely locks and restores document.body scrolling.
 * Supports multiple nested/concurrent modal instances without getting stuck.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow || ''
      document.body.style.overflow = 'hidden'
    }
    lockCount++

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isLocked])
}
