import { useEffect, useRef } from 'react'

interface UseShakeOptions {
  threshold?: number // Force threshold
  timeout?: number // Cooldown in ms
  onShake: () => void
}

export function useShake({ threshold = 15, timeout = 1200, onShake }: UseShakeOptions) {
  const lastUpdate = useRef<number>(0)
  const lastX = useRef<number | null>(null)
  const lastY = useRef<number | null>(null)
  const lastZ = useRef<number | null>(null)
  const onShakeRef = useRef(onShake)

  // Keep callback reference updated
  useEffect(() => {
    onShakeRef.current = onShake
  }, [onShake])

  useEffect(() => {
    let active = true

    const handleMotion = (event: DeviceMotionEvent) => {
      if (!active) return

      const acceleration = event.accelerationIncludingGravity
      if (!acceleration) return

      const curTime = Date.now()
      if (curTime - lastUpdate.current > 100) {
        const diffTime = curTime - lastUpdate.current
        lastUpdate.current = curTime

        const x = acceleration.x ?? 0
        const y = acceleration.y ?? 0
        const z = acceleration.z ?? 0

        if (lastX.current !== null && lastY.current !== null && lastZ.current !== null) {
          const speed =
            (Math.abs(x + y + z - lastX.current - lastY.current - lastZ.current) / diffTime) * 10000

          if (speed > threshold) {
            // Cooldown check
            const globalLastShake = (window as any)._lastShakeTime || 0
            if (curTime - globalLastShake > timeout) {
              (window as any)._lastShakeTime = curTime
              onShakeRef.current()
            }
          }
        }

        lastX.current = x
        lastY.current = y
        lastZ.current = z
      }
    }

    // Register event
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion)
    }

    return () => {
      active = false
      if (typeof window !== 'undefined') {
        window.removeEventListener('devicemotion', handleMotion)
      }
    }
  }, [threshold, timeout])

  // Helper to request permission on iOS (Safari)
  const requestPermission = async (): Promise<boolean> => {
    if (
      typeof window !== 'undefined' &&
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof (DeviceMotionEvent as any).requestPermission === 'function'
    ) {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission()
        return permissionState === 'granted'
      } catch (error) {
        console.error('Error requesting DeviceMotion permission:', error)
        return false
      }
    }
    return true
  }

  return { requestPermission }
}
