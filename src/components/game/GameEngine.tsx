import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { sound } from './audio'
import {
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  CheckCircle,
  Play,
  Award,
  Lock,
  Unlock,
  Clock,
  Heart,
  Medal,
  Star,
  Send,
  X,
  Maximize2,
  Minimize2,
  Pause,
  Settings,
  Smartphone,
  ShieldAlert,
  Flag,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  LogOut,
} from 'lucide-react'
import {
  GAME_STAGES,
  GAME_ACHIEVEMENTS,
  PRODUCT_CATALOG_META,
  type StageDefinition,
  type PlayerProgressionState,
  type CollectibleProductKind,
  loadPlayerProgression,
  recordStageCompletion,
} from './platformerWorlds'
import {
  type HeroPhysicsState,
  type CameraState,
  type PlayerInputFrame,
  type StepSimulationEvents,
  createInitialHeroState,
  stepPlatformerSimulation,
  updateSideScrollingCamera,
} from './platformerPhysics'
import {
  type FloatingScorePopup,
  type LightParticle,
  type GraphicsQuality,
  renderPlatformerFrame,
} from './platformerRenderer'

export interface LeaderboardEntry {
  id: string
  playerId?: string
  name: string
  city: string
  score: number
  timeTakenSec: number
  date: string
  weekKey?: string
  rank?: number
  createdAt?: number
}

export interface WeeklyChallengeInfo {
  weekId: string
  prevWeekId: string
  weekTitle: string
  daysLeft: number
  hoursLeft: number
  startDateStr: string
  endDateStr: string
}

export const getWeeklyChallengeInfo = (date = new Date()): WeeklyChallengeInfo => {
  // Libya (Africa/Tripoli) is permanently UTC+2 (no DST).
  const TRIPOLI_OFFSET_MS = 2 * 60 * 60 * 1000
  const tripoliShifted = new Date(date.getTime() + TRIPOLI_OFFSET_MS)

  const day = tripoliShifted.getUTCDay()
  const diffToSaturday = (day + 1) % 7

  const saturday = new Date(
    Date.UTC(
      tripoliShifted.getUTCFullYear(),
      tripoliShifted.getUTCMonth(),
      tripoliShifted.getUTCDate() - diffToSaturday,
      0,
      0,
      0,
      0
    )
  )

  const prevSaturday = new Date(saturday.getTime() - 7 * 24 * 60 * 60 * 1000)

  const nextFriday = new Date(
    Date.UTC(
      saturday.getUTCFullYear(),
      saturday.getUTCMonth(),
      saturday.getUTCDate() + 6,
      23,
      59,
      59,
      999
    )
  )

  const msLeft = Math.max(0, nextFriday.getTime() - tripoliShifted.getTime())
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  const formatYMD = (d: Date) =>
    `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`

  const weekId = formatYMD(saturday)
  const prevWeekId = formatYMD(prevSaturday)
  const arMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
  const startDateStr = `${saturday.getUTCDate()} ${arMonths[saturday.getUTCMonth()]}`
  const endDateStr = `${nextFriday.getUTCDate()} ${arMonths[nextFriday.getUTCMonth()]}`

  return {
    weekId,
    prevWeekId,
    weekTitle: `بطولة الأسبوع (${startDateStr} - ${endDateStr})`,
    daysLeft,
    hoursLeft,
    startDateStr,
    endDateStr,
  }
}

export function dedupeAndRankLeaderboard(entries: LeaderboardEntry[], limit = 10): LeaderboardEntry[] {
  const bestByPlayer = new Map<string, LeaderboardEntry>()
  for (const raw of entries) {
    if (!raw || typeof raw.name !== 'string') continue
    const cleanName = raw.name.trim()
    if (cleanName.length < 2) continue
    const score = Number(raw.score)
    const timeTakenSec = Number(raw.timeTakenSec)
    if (!Number.isFinite(score) || score < 100 || score > 45000) continue
    const safeTime = Number.isFinite(timeTakenSec) && timeTakenSec >= 20 ? Math.round(timeTakenSec) : 60
    const cleanCity = typeof raw.city === 'string' && raw.city.trim() ? raw.city.trim() : 'بنغازي'
    const key =
      typeof raw.playerId === 'string' && raw.playerId.trim().length >= 4
        ? `pid:${raw.playerId.trim().toLowerCase()}`
        : `nc:${cleanName.toLowerCase()}_${cleanCity.toLowerCase()}`

    const candidate: LeaderboardEntry = {
      ...raw,
      name: cleanName,
      city: cleanCity,
      score: Math.round(score),
      timeTakenSec: safeTime,
    }

    const existing = bestByPlayer.get(key)
    if (
      !existing ||
      candidate.score > existing.score ||
      (candidate.score === existing.score && candidate.timeTakenSec < existing.timeTakenSec)
    ) {
      bestByPlayer.set(key, candidate)
    }
  }

  return Array.from(bestByPlayer.values())
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (a.timeTakenSec !== b.timeTakenSec) return a.timeTakenSec - b.timeTakenSec
      return (a.createdAt || 0) - (b.createdAt || 0)
    })
    .slice(0, limit)
    .map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }))
}

function cloneStageDefinition(stage: StageDefinition): StageDefinition {
  return JSON.parse(JSON.stringify(stage))
}

type GameScreenState = 'start' | 'playing' | 'paused' | 'stage_clear' | 'game_won' | 'defeat'

const VIEWPORT_WIDTH = 960
const VIEWPORT_HEIGHT = 540

export function GameEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneWrapperRef = useRef<HTMLDivElement | null>(null)
  const dprRef = useRef<number>(1)

  // Progression & Stages
  const [progression, setProgression] = useState<PlayerProgressionState>(() => loadPlayerProgression())
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0)
  const [gameState, setGameState] = useState<GameScreenState>('start')

  // Modals
  const [showStageSelectModal, setShowStageSelectModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  // Audio, Graphics Quality & Accessibility Settings (Sections 09, 16, 19)
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted)
  const [musicVolume, setMusicVolume] = useState<number>(() => sound.musicVolume)
  const [sfxVolume, setSfxVolume] = useState<number>(() => sound.sfxVolume)
  const [graphicsQuality, setGraphicsQuality] = useState<GraphicsQuality>(() => {
    try {
      const saved = localStorage.getItem('enarah_platformer_graphics_quality') as GraphicsQuality | null
      if (saved === 'high' || saved === 'balanced' || saved === 'low') return saved
      return typeof window !== 'undefined' && window.innerWidth < 820 ? 'balanced' : 'high'
    } catch {
      return 'high'
    }
  })
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('enarah_platformer_reduced_motion')
      if (saved !== null) return saved === 'true'
      return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    } catch {
      return false
    }
  })
  const [touchButtonScale, setTouchButtonScale] = useState<'normal' | 'large'>(() => {
    try {
      const saved = localStorage.getItem('enarah_platformer_touch_scale')
      if (saved === 'normal' || saved === 'large') return saved
      return 'large'
    } catch {
      return 'large'
    }
  })
  const [touchOpacity, setTouchOpacity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('enarah_platformer_touch_opacity')
      const num = saved !== null ? Number(saved) : NaN
      if (Number.isFinite(num)) return Math.max(0.4, Math.min(1, num))
      return 0.9
    } catch {
      return 0.9
    }
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 900 || window.innerHeight < 540
  })
  const [isPortraitMobile, setIsPortraitMobile] = useState(false)
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false)
  const [dismissedOrientationHint, setDismissedOrientationHint] = useState(false)
  const [isCanvasVisible, setIsCanvasVisible] = useState(true)

  // HUD Reactive State
  const [hudHealth, setHudHealth] = useState(3)
  const [hudMaxHealth, setHudMaxHealth] = useState(3)
  const [hudBulbEnergy, setHudBulbEnergy] = useState(75)
  const [hudEnergy, setHudEnergy] = useState(0)
  const [hudTotalEnergy, setHudTotalEnergy] = useState(9)
  const [hudScore, setHudScore] = useState(0)
  const [hudStageScore, setHudStageScore] = useState(0)
  const [hudStarsEarned, setHudStarsEarned] = useState(3)
  const [hudElapsedSec, setHudElapsedSec] = useState(0)
  const [hudTimeLeftSec, setHudTimeLeftSec] = useState<number | null>(null)
  const [hudBossHp, setHudBossHp] = useState<number | null>(null)
  const [hudBossMaxHp, setHudBossMaxHp] = useState<number>(3)
  const [hudBossPhase, setHudBossPhase] = useState<number>(1)
  const [hudActiveBuffs, setHudActiveBuffs] = useState<{
    speed: boolean
    shield: boolean
    spotlight: boolean
    floodlight: boolean
  }>({ speed: false, shield: false, spotlight: false, floodlight: false })
  const [bannerAlert, setBannerAlert] = useState<{ msg: string; type: 'info' | 'success' | 'error' } | null>(null)
  const [copiedCoupon, setCopiedCoupon] = useState(false)

  // Active touch button highlights
  const [touchVisualState, setTouchVisualState] = useState({
    left: false,
    right: false,
    jump: false,
    dash: false,
    attack: false,
  })
  const activePointersRef = useRef<Map<number, 'left' | 'right' | 'jump' | 'dash' | 'attack'>>(new Map())
  const leftPadRef = useRef<HTMLDivElement | null>(null)

  // Mutable Simulation Refs
  const stageRef = useRef<StageDefinition>(cloneStageDefinition(GAME_STAGES[0]))
  const heroRef = useRef<HeroPhysicsState>(createInitialHeroState(GAME_STAGES[0]))
  const cameraRef = useRef<CameraState>({
    x: 0,
    y: 0,
    viewportW: VIEWPORT_WIDTH,
    viewportH: VIEWPORT_HEIGHT,
    shakeIntensity: 0,
  })
  const particlesRef = useRef<LightParticle[]>([])
  const popupsRef = useRef<FloatingScorePopup[]>([])
  const elapsedSecRef = useRef<number>(0)
  const totalPlayTimeSecRef = useRef<number>(0)
  const stageScoreRef = useRef<number>(0)
  const collectedCountRef = useRef<number>(0)
  const collectedKindsRef = useRef<CollectibleProductKind[]>([])
  const totalCampaignScoreRef = useRef<number>(0)
  const bossMusicActiveRef = useRef<boolean>(false)

  // Input State Ref
  const keysRef = useRef<{ [code: string]: boolean }>({})
  const touchInputRef = useRef<{
    left: boolean
    right: boolean
    jump: boolean
    dash: boolean
    attack: boolean
  }>({
    left: false,
    right: false,
    jump: false,
    dash: false,
    attack: false,
  })
  const prevJumpHeldRef = useRef<boolean>(false)
  const prevDashHeldRef = useRef<boolean>(false)
  const prevAttackHeldRef = useRef<boolean>(false)

  // Weekly Leaderboard & Cloud Reward state
  const weeklyInfo = useMemo(() => getWeeklyChallengeInfo(), [])
  const [playerId] = useState<string>(() => {
    try {
      const existing = localStorage.getItem('enarah_player_id')
      if (existing && existing.length >= 8) return existing
      const generated = `plr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
      localStorage.setItem('enarah_player_id', generated)
      return generated
    } catch {
      return `plr_${Date.now().toString(36)}`
    }
  })
  const [playerNameInput, setPlayerNameInput] = useState<string>(() => {
    try {
      return localStorage.getItem('enarah_player_name') || ''
    } catch {
      return ''
    }
  })
  const [playerCityInput, setPlayerCityInput] = useState<string>(() => {
    try {
      return localStorage.getItem('enarah_player_city') || 'بنغازي'
    } catch {
      return 'بنغازي'
    }
  })
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false)
  const [leaderboardTab, setLeaderboardTab] = useState<'current' | 'previous'>('current')

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const info = getWeeklyChallengeInfo()
      const currentWeekKey = `enarah_weekly_leaderboard_${info.weekId}`
      const savedWeek = localStorage.getItem(currentWeekKey)
      if (savedWeek) {
        const parsed = JSON.parse(savedWeek)
        if (Array.isArray(parsed)) {
          return dedupeAndRankLeaderboard(parsed, 10)
        }
      }
      return []
    } catch {
      return []
    }
  })

  const [previousWeekBoard, setPreviousWeekBoard] = useState<LeaderboardEntry[]>(() => {
    try {
      const info = getWeeklyChallengeInfo()
      const prevWeekKey = `enarah_weekly_leaderboard_${info.prevWeekId}`
      const savedPrev = localStorage.getItem(prevWeekKey) || localStorage.getItem('enarah_last_week_champions')
      if (savedPrev) {
        const parsed = JSON.parse(savedPrev)
        if (Array.isArray(parsed)) {
          return dedupeAndRankLeaderboard(parsed, 10)
        }
      }
      return []
    } catch {
      return []
    }
  })

  useEffect(() => {
    fetch(`/api/leaderboard?week=${weeklyInfo.weekId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.entries)) {
          setLeaderboard((prev) => {
            const merged = dedupeAndRankLeaderboard([...prev, ...data.entries], 10)
            try {
              localStorage.setItem(`enarah_weekly_leaderboard_${weeklyInfo.weekId}`, JSON.stringify(merged))
            } catch {}
            return merged
          })
        }
      })
      .catch(() => {})

    fetch(`/api/leaderboard?week=${weeklyInfo.prevWeekId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.entries) && data.entries.length > 0) {
          setPreviousWeekBoard((prev) => {
            const merged = dedupeAndRankLeaderboard([...prev, ...data.entries], 10)
            try {
              localStorage.setItem(`enarah_weekly_leaderboard_${weeklyInfo.prevWeekId}`, JSON.stringify(merged))
              localStorage.setItem('enarah_last_week_champions', JSON.stringify(merged))
            } catch {}
            return merged
          })
        }
      })
      .catch(() => {})
  }, [weeklyInfo.weekId, weeklyInfo.prevWeekId])

  // Section 12 & V8 Problem 4: Keep the coupon system hidden by default (OFF).
  // Only enable when administrator-controlled setting explicitly has isEnabled === true && v8AdminConfigured === true.
  const [rewardConfig, setRewardConfig] = useState({
    isEnabled: false,
    rewardType: 'no_reward' as 'coupon' | 'physical_gift' | 'no_reward',
    couponCode: '',
    discountTitle: '',
    discountDetails: '',
    giftItemName: '',
    giftInstructions: '',
    victoryMsg: 'أنت بطل أسطوري حقيقي للإنارة! لقد عبرت المراحل الثماني وهزمت ملك الظلام الكهربائي بنجاح تام.',
  })

  useEffect(() => {
    try {
      const local = localStorage.getItem('enarah_game_reward_config')
      if (local) {
        const parsedLocal = JSON.parse(local)
        const explicitlyEnabled =
          parsedLocal &&
          parsedLocal.isEnabled === true &&
          parsedLocal.v8AdminConfigured === true
        if (explicitlyEnabled) {
          setRewardConfig((prev) => ({
            ...prev,
            ...parsedLocal,
            isEnabled: true,
            rewardType: parsedLocal.rewardType || 'coupon',
            couponCode: parsedLocal.couponCode || '',
          }))
        } else {
          localStorage.removeItem('enarah_game_reward_config')
        }
      }
    } catch {}

    const fetchCloudRewards = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        if (res.ok) {
          const data = await res.json()
          if (data && data.success && Array.isArray(data.data)) {
            const updates = data.data.filter((item: any) => item.email === 'admin_game_rewards@app.local')
            if (updates.length > 0) {
              // api/get-users sorts by createdAt: -1, so updates[0] is the newest admin setting
              const latest = updates[0]
              const rawPhoneStr = latest.rawPhone || latest.phone || '{}'
              const parsed = JSON.parse(rawPhoneStr).config
              if (parsed) {
                const enabled = parsed.isEnabled === true && parsed.v8AdminConfigured === true
                const normalized = {
                  ...parsed,
                  isEnabled: enabled,
                  rewardType: enabled ? parsed.rewardType || 'coupon' : 'no_reward',
                  couponCode: enabled ? parsed.couponCode || '' : '',
                  discountTitle: enabled ? parsed.discountTitle || '' : '',
                  discountDetails: enabled ? parsed.discountDetails || '' : '',
                }
                setRewardConfig((prev) => ({ ...prev, ...normalized }))
                if (enabled) {
                  localStorage.setItem('enarah_game_reward_config', JSON.stringify(normalized))
                } else {
                  localStorage.removeItem('enarah_game_reward_config')
                }
              }
            } else {
              // No admin reward record exists -> keep hidden by default
              setRewardConfig((prev) => ({
                ...prev,
                isEnabled: false,
                rewardType: 'no_reward',
                couponCode: '',
                discountTitle: '',
                discountDetails: '',
              }))
            }
          }
        }
      } catch {}
    }

    fetchCloudRewards()
  }, [gameState])

  // Stop music when leaving component
  useEffect(() => {
    return () => {
      sound.stopMusic()
    }
  }, [])

  // Manage level soundtrack based on gameState
  useEffect(() => {
    if (gameState === 'playing' && !isMuted && isCanvasVisible) {
      const stg = GAME_STAGES[currentStageIdx] || GAME_STAGES[0]
      const track = sound.getTrackForLevel(stg.worldNumber, bossMusicActiveRef.current)
      sound.startMusic(track)
    } else {
      sound.stopMusic()
    }
  }, [currentStageIdx, gameState, isCanvasVisible, isMuted])

  const clearAllInputs = useCallback(() => {
    keysRef.current = {}
    activePointersRef.current.clear()
    touchInputRef.current = { left: false, right: false, jump: false, dash: false, attack: false }
    prevJumpHeldRef.current = false
    prevDashHeldRef.current = false
    prevAttackHeldRef.current = false
    setTouchVisualState({ left: false, right: false, jump: false, dash: false, attack: false })
  }, [])

  // Responsive Canvas & Camera Zoom Synchronization (V8 Problem 1B, 1C, 1D)
  const syncViewportAndCameraZoom = useCallback(() => {
    if (typeof window === 'undefined') return
    const winW = Math.round(window.visualViewport?.width || window.innerWidth)
    const winH = Math.round(window.visualViewport?.height || window.innerHeight)
    const isMob = winW < 900 || winH < 540
    const isPort = isMob && winH > winW
    const isLand = isMob && winW >= winH

    setIsMobileDevice(isMob)
    setIsPortraitMobile(isPort)
    setIsLandscapeMobile(isLand)

    const wrapper = sceneWrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const rect = wrapper.getBoundingClientRect()
    const availableWidth = Math.max(240, Math.round(rect.width || winW))
    const availableHeight = Math.max(150, Math.round(rect.height || winH * 0.6))

    // V10 FIT-TO-SCREEN (CONTAIN) — NO ZOOM, NO CROPPING, ORIGINAL 16:9 (960x540) GAME SIZE:
    const logicalGameWidth = VIEWPORT_WIDTH
    const logicalGameHeight = VIEWPORT_HEIGHT

    const scale = Math.min(
      availableWidth / logicalGameWidth,
      availableHeight / logicalGameHeight
    )
    const renderedWidth = Math.max(240, Math.round(logicalGameWidth * scale))
    const renderedHeight = Math.max(135, Math.round(logicalGameHeight * scale))

    canvas.style.width = `${renderedWidth}px`
    canvas.style.height = `${renderedHeight}px`

    const maxDpr = graphicsQuality === 'low' ? 1 : graphicsQuality === 'balanced' ? 1.5 : 2
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    dprRef.current = dpr

    const targetBufW = Math.round(logicalGameWidth * dpr)
    const targetBufH = Math.round(logicalGameHeight * dpr)
    if (canvas.width !== targetBufW || canvas.height !== targetBufH) {
      canvas.width = targetBufW
      canvas.height = targetBufH
    }

    cameraRef.current.viewportW = logicalGameWidth
    cameraRef.current.viewportH = logicalGameHeight
    updateSideScrollingCamera(cameraRef.current, heroRef.current, stageRef.current, 0.25)
  }, [graphicsQuality])

  // Dedicated Mobile Gameplay Mode: Portal to document.body, hide website UI & lock scroll (V8 Problem 1A & 1D)
  const isDedicatedMobileGameplay = isMobileDevice && gameState !== 'start'

  useEffect(() => {
    syncViewportAndCameraZoom()
    const rafId = requestAnimationFrame(() => {
      syncViewportAndCameraZoom()
    })
    const handleResizeOrOrientation = () => {
      clearAllInputs()
      syncViewportAndCameraZoom()
    }
    window.addEventListener('resize', handleResizeOrOrientation)
    window.addEventListener('orientationchange', handleResizeOrOrientation)
    window.visualViewport?.addEventListener('resize', handleResizeOrOrientation)

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && sceneWrapperRef.current) {
      ro = new ResizeObserver(() => {
        syncViewportAndCameraZoom()
      })
      ro.observe(sceneWrapperRef.current)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResizeOrOrientation)
      window.removeEventListener('orientationchange', handleResizeOrOrientation)
      window.visualViewport?.removeEventListener('resize', handleResizeOrOrientation)
      ro?.disconnect()
    }
  }, [clearAllInputs, syncViewportAndCameraZoom, gameState, isFullscreen, isDedicatedMobileGameplay])

  const isAnyGameModalOpen = showStageSelectModal || showSettingsModal || showLeaderboard

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (isDedicatedMobileGameplay || isFullscreen) {
      const prevOverflow = document.body.style.overflow
      const prevOverscroll = document.documentElement.style.overscrollBehavior
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overscrollBehavior = 'none'
      document.body.setAttribute('data-enarah-mobile-game', '1')

      let styleEl = document.getElementById('enarah-mobile-game-hide-ui') as HTMLStyleElement | null
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = 'enarah-mobile-game-hide-ui'
      }
      styleEl.textContent = `
        html:has(body[data-enarah-mobile-game="1"]),
        body[data-enarah-mobile-game="1"] {
          overflow: hidden !important;
          max-width: 100vw !important;
          overscroll-behavior: none !important;
        }
        body[data-enarah-mobile-game="1"] > *:not(#enarah-mobile-game-portal):not(#enarah-game-modal-portal):not(script):not(style) {
          display: none !important;
          pointer-events: none !important;
        }
        #enarah-mobile-game-portal,
        #enarah-mobile-game-portal *,
        #enarah-game-modal-portal,
        #enarah-game-modal-portal * {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
      `
      if (!styleEl.parentNode) {
        document.head.appendChild(styleEl)
      }

      return () => {
        document.body.style.overflow = prevOverflow
        document.body.style.overscrollBehavior = prevOverscroll
        document.body.removeAttribute('data-enarah-mobile-game')
      }
    } else {
      document.body.removeAttribute('data-enarah-mobile-game')
    }
  }, [isDedicatedMobileGameplay, isFullscreen])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (isAnyGameModalOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.body.setAttribute('data-enarah-modal-open', '1')
      return () => {
        if (!isDedicatedMobileGameplay && !isFullscreen) {
          document.body.style.overflow = prevOverflow
        }
        document.body.removeAttribute('data-enarah-modal-open')
      }
    } else {
      document.body.removeAttribute('data-enarah-modal-open')
    }
  }, [isAnyGameModalOpen, isDedicatedMobileGameplay, isFullscreen])

  // IntersectionObserver to pause rendering & music when scrolled offscreen
  useEffect(() => {
    if (isDedicatedMobileGameplay || isFullscreen) {
      setIsCanvasVisible(true)
      return
    }
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          setIsCanvasVisible(entry.isIntersecting)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isDedicatedMobileGameplay, isFullscreen])

  useEffect(() => {
    const handleVisibilityOrBlur = () => {
      clearAllInputs()
      if (document.hidden && gameState === 'playing') {
        sound.stopMusic()
        setGameState('paused')
      }
    }
    window.addEventListener('blur', handleVisibilityOrBlur)
    document.addEventListener('visibilitychange', handleVisibilityOrBlur)
    return () => {
      window.removeEventListener('blur', handleVisibilityOrBlur)
      document.removeEventListener('visibilitychange', handleVisibilityOrBlur)
    }
  }, [clearAllInputs, gameState])

  // Compact auto-disappearing gameplay tips (Section 9)
  const showAlert = useCallback((msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setBannerAlert({ msg, type })
    setTimeout(() => {
      setBannerAlert((prev) => (prev?.msg === msg ? null : prev))
    }, 1850)
  }, [])

  const spawnBurstParticles = useCallback(
    (x: number, y: number, color: string, count = 10) => {
      if (reducedMotion) return
      const effectiveCount =
        graphicsQuality === 'low'
          ? Math.max(3, Math.ceil(count * 0.4))
          : graphicsQuality === 'balanced'
          ? Math.max(5, Math.ceil(count * 0.7))
          : count
      const maxParticles = graphicsQuality === 'low' ? 16 : graphicsQuality === 'balanced' ? 36 : 68

      for (let i = 0; i < effectiveCount; i++) {
        const angle = (Math.PI * 2 * i) / effectiveCount + Math.random() * 0.4
        const spd = 65 + Math.random() * 145
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 40,
          size: 2.5 + Math.random() * 3,
          color,
          alpha: 1,
          life: 0,
          maxLife: 0.45 + Math.random() * 0.25,
        })
      }
      if (particlesRef.current.length > maxParticles) {
        particlesRef.current.splice(0, particlesRef.current.length - maxParticles)
      }
    },
    [graphicsQuality, reducedMotion]
  )

  const addScorePopup = useCallback((x: number, y: number, text: string, color = '#FBBF24') => {
    popupsRef.current.push({
      id: Date.now() + Math.random(),
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -48,
    })
  }, [])

  // Initialize a specific stage (Levels 1–8)
  const initStage = useCallback(
    (stageIndex: number) => {
      const safeIndex = Math.max(0, Math.min(GAME_STAGES.length - 1, stageIndex))
      const cloned = cloneStageDefinition(GAME_STAGES[safeIndex])
      stageRef.current = cloned
      heroRef.current = createInitialHeroState(cloned)
      const currentVw = cameraRef.current.viewportW || VIEWPORT_WIDTH
      const currentVh = cameraRef.current.viewportH || VIEWPORT_HEIGHT
      cameraRef.current = {
        x: Math.max(0, cloned.heroSpawn.x - currentVw * 0.35),
        y: cloned.height - currentVh,
        viewportW: currentVw,
        viewportH: currentVh,
        shakeIntensity: 0,
      }
      particlesRef.current = []
      popupsRef.current = []
      elapsedSecRef.current = 0
      stageScoreRef.current = 0
      collectedCountRef.current = 0
      collectedKindsRef.current = []
      bossMusicActiveRef.current = false
      clearAllInputs()

      setCurrentStageIdx(safeIndex)
      setHudHealth(3)
      setHudMaxHealth(3)
      setHudBulbEnergy(75)
      setHudEnergy(0)
      setHudTotalEnergy(cloned.collectibles.length)
      setHudStageScore(0)
      setHudElapsedSec(0)
      setHudTimeLeftSec(cloned.challengeTimeLimitSec ?? null)
      setHudBossHp(cloned.boss ? cloned.boss.hp : null)
      setHudBossMaxHp(cloned.boss ? cloned.boss.maxHp : 3)
      setHudBossPhase(1)
      setHudActiveBuffs({ speed: false, shield: false, spotlight: false, floodlight: false })
      setBannerAlert(null)

      if (!isMuted) {
        sound.startMusic(sound.getTrackForLevel(cloned.worldNumber, false))
      }
    },
    [clearAllInputs, isMuted]
  )

  const startAdventure = useCallback(
    (stageIndex?: number) => {
      sound.playButton()
      const targetIdx =
        typeof stageIndex === 'number'
          ? stageIndex
          : Math.min(progression.unlockedStageIndex, GAME_STAGES.length - 1)
      const targetStage = GAME_STAGES[targetIdx] || GAME_STAGES[0]
      // Sum best stage scores for all OTHER stages so replaying a stage never multiplies rewards
      const otherStagesBestSum = Object.entries(progression.bestStageScores).reduce(
        (sum, [stgId, val]) => (stgId === targetStage.id ? sum : sum + (Number.isFinite(val) ? val : 0)),
        0
      )
      totalCampaignScoreRef.current = otherStagesBestSum
      if (targetIdx === 0) {
        totalPlayTimeSecRef.current = 0
        setHasSubmittedScore(false)
      }
      setHudScore(otherStagesBestSum)
      initStage(targetIdx)
      setShowStageSelectModal(false)
      setShowSettingsModal(false)
      setShowLeaderboard(false)
      setGameState('playing')
    },
    [initStage, progression.bestStageScores, progression.unlockedStageIndex]
  )

  const retryCurrentStage = useCallback(() => {
    sound.playButton()
    initStage(currentStageIdx)
    setGameState('playing')
  }, [currentStageIdx, initStage])

  const goToNextStage = useCallback(() => {
    sound.playButton()
    if (currentStageIdx < GAME_STAGES.length - 1) {
      const nextIdx = currentStageIdx + 1
      initStage(nextIdx)
      setGameState('playing')
    } else {
      sound.stopMusic()
      sound.playVictory()
      setGameState('game_won')
    }
  }, [currentStageIdx, initStage])

  // Keyboard Controls (Desktop — Section 11)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return

      const code = e.code
      if (code === 'Escape') {
        if (showSettingsModal) {
          e.preventDefault()
          setShowSettingsModal(false)
          return
        }
        if (showStageSelectModal) {
          e.preventDefault()
          setShowStageSelectModal(false)
          return
        }
        if (showLeaderboard) {
          e.preventDefault()
          setShowLeaderboard(false)
          return
        }
      }
      if (code === 'Escape' || code === 'KeyP') {
        if (gameState === 'playing') {
          e.preventDefault()
          clearAllInputs()
          sound.stopMusic()
          setGameState('paused')
          return
        } else if (gameState === 'paused') {
          e.preventDefault()
          setGameState('playing')
          return
        }
      }

      if (code === 'KeyR' && (gameState === 'playing' || gameState === 'defeat')) {
        e.preventDefault()
        retryCurrentStage()
        return
      }

      if (gameState !== 'playing') return

      if (
        code === 'ArrowLeft' ||
        code === 'ArrowRight' ||
        code === 'ArrowUp' ||
        code === 'ArrowDown' ||
        code === 'Space' ||
        code === 'KeyA' ||
        code === 'KeyD' ||
        code === 'KeyW' ||
        code === 'KeyE' ||
        code === 'KeyF' ||
        code === 'KeyJ' ||
        code === 'ShiftLeft' ||
        code === 'ShiftRight'
      ) {
        if (code.startsWith('Arrow') || code === 'Space' || code === 'KeyE') {
          e.preventDefault()
        }
        keysRef.current[code] = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [clearAllInputs, gameState, retryCurrentStage, showLeaderboard, showSettingsModal, showStageSelectModal])

  // Fullscreen Toggle
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      setIsFullscreen(true)
      const el = containerRef.current as any
      if (el?.requestFullscreen) {
        el.requestFullscreen().catch(() => {})
      } else if (el?.webkitRequestFullscreen) {
        el.webkitRequestFullscreen()
      }
    } else {
      setIsFullscreen(false)
      const doc = document as any
      if (doc.fullscreenElement && doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {})
      } else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen()
      }
    }
  }, [isFullscreen])

  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as any
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange)
      document.removeEventListener('webkitfullscreenchange', handleFsChange)
    }
  }, [])

  // Main Deterministic Fixed-Timestep Physics + Rendering Loop (Sections 15 & 16)
  useEffect(() => {
    if (!isCanvasVisible) return

    const FIXED_DT = 1 / 60
    let animationFrameId = 0
    let lastTimestamp = performance.now()
    let simAccumulator = 0
    let hudSyncAccumulator = 0

    const loop = (now: number) => {
      const rawDt = (now - lastTimestamp) / 1000
      lastTimestamp = now
      const dt = Math.min(rawDt, 0.05)

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')

      if (gameState === 'start') {
        // Gentle idle animation on the start screen so hero & world feel alive
        elapsedSecRef.current += dt
        heroRef.current.onGround = true
        heroRef.current.y = stageRef.current.groundY - heroRef.current.h
        heroRef.current.animState = 'idle'
        heroRef.current.walkCycle += dt * 3.2
        updateSideScrollingCamera(cameraRef.current, heroRef.current, stageRef.current, dt)
      } else if (gameState === 'playing') {
        simAccumulator = Math.min(simAccumulator + dt, FIXED_DT * 4)

        const events: StepSimulationEvents = {
          jumped: false,
          highJumped: false,
          doubleJumped: false,
          dashed: false,
          attacked: false,
          landed: false,
          collectedStarIds: [],
          collectedProductKinds: [],
          collectedValue: 0,
          abilityActivatedMsg: null,
          activatedCheckpointId: null,
          activatedSwitchId: null,
          openedGateId: null,
          stompedEnemyId: null,
          hitBoss: false,
          bossPhaseChanged: null,
          bossDefeated: false,
          tookDamage: false,
          shieldBlocked: false,
          fellInPit: false,
          stageCompleted: false,
          stageDefeated: false,
        }

        while (simAccumulator >= FIXED_DT) {
          simAccumulator -= FIXED_DT
          elapsedSecRef.current += FIXED_DT
          totalPlayTimeSecRef.current += FIXED_DT

          const k = keysRef.current
          const t = touchInputRef.current

          const leftHeld = !!(k['ArrowLeft'] || k['KeyA'] || t.left)
          const rightHeld = !!(k['ArrowRight'] || k['KeyD'] || t.right)
          const jumpHeld = !!(k['Space'] || k['ArrowUp'] || k['KeyW'] || t.jump)
          const dashHeld = !!(k['ShiftLeft'] || k['ShiftRight'] || t.dash)
          const attackHeld = !!(k['KeyE'] || k['KeyF'] || k['KeyJ'] || t.attack)

          const inputFrame: PlayerInputFrame = {
            left: leftHeld,
            right: rightHeld,
            run: dashHeld,
            jumpPressed: jumpHeld && !prevJumpHeldRef.current,
            jumpHeld,
            jumpReleased: !jumpHeld && prevJumpHeldRef.current,
            dashPressed: dashHeld && !prevDashHeldRef.current,
            attackPressed: attackHeld && !prevAttackHeldRef.current,
          }
          prevJumpHeldRef.current = jumpHeld
          prevDashHeldRef.current = dashHeld
          prevAttackHeldRef.current = attackHeld

          const stepEv = stepPlatformerSimulation(
            heroRef.current,
            stageRef.current,
            inputFrame,
            FIXED_DT,
            elapsedSecRef.current
          )

          events.jumped = events.jumped || stepEv.jumped
          events.highJumped = events.highJumped || stepEv.highJumped
          events.doubleJumped = events.doubleJumped || stepEv.doubleJumped
          events.dashed = events.dashed || stepEv.dashed
          events.attacked = events.attacked || stepEv.attacked
          events.landed = events.landed || stepEv.landed
          if (stepEv.collectedStarIds.length > 0) {
            events.collectedStarIds.push(...stepEv.collectedStarIds)
          }
          if (stepEv.collectedProductKinds.length > 0) {
            events.collectedProductKinds.push(...stepEv.collectedProductKinds)
          }
          events.collectedValue += stepEv.collectedValue
          if (stepEv.abilityActivatedMsg) events.abilityActivatedMsg = stepEv.abilityActivatedMsg
          if (stepEv.activatedCheckpointId) events.activatedCheckpointId = stepEv.activatedCheckpointId
          if (stepEv.activatedSwitchId) events.activatedSwitchId = stepEv.activatedSwitchId
          if (stepEv.openedGateId) events.openedGateId = stepEv.openedGateId
          if (stepEv.stompedEnemyId) events.stompedEnemyId = stepEv.stompedEnemyId
          events.hitBoss = events.hitBoss || stepEv.hitBoss
          if (stepEv.bossPhaseChanged) events.bossPhaseChanged = stepEv.bossPhaseChanged
          events.bossDefeated = events.bossDefeated || stepEv.bossDefeated
          events.tookDamage = events.tookDamage || stepEv.tookDamage
          events.shieldBlocked = events.shieldBlocked || stepEv.shieldBlocked
          events.fellInPit = events.fellInPit || stepEv.fellInPit
          events.stageCompleted = events.stageCompleted || stepEv.stageCompleted
          events.stageDefeated = events.stageDefeated || stepEv.stageDefeated

          if (events.stageCompleted || events.stageDefeated || events.fellInPit) {
            break
          }
        }

        // Decay camera shake
        if (cameraRef.current.shakeIntensity && cameraRef.current.shakeIntensity > 0) {
          cameraRef.current.shakeIntensity = Math.max(0, cameraRef.current.shakeIntensity - dt * 18)
        }

        // Check timed escape / timed power restoration limit (Levels 3 & 6)
        const timeLimit = stageRef.current.challengeTimeLimitSec
        if (timeLimit && elapsedSecRef.current >= timeLimit) {
          sound.stopMusic()
          sound.playDefeat()
          showAlert('⌛ انتهى الوقت المحدد للتحدي! حاول مرة أخرى بسرعة أكبر.', 'error')
          setGameState('defeat')
          return
        }

        // Transition to Boss Battle music when player enters Boss Arena
        if (
          stageRef.current.boss &&
          stageRef.current.boss.state !== 'defeated' &&
          !bossMusicActiveRef.current &&
          heroRef.current.x > stageRef.current.boss.minX - 240
        ) {
          bossMusicActiveRef.current = true
          sound.playBossRoar()
          sound.startMusic('boss_battle')
          showAlert(`⚠️ مواجهة الزعيم: ${stageRef.current.boss.nameAr}!`, 'error')
        }

        // Update particles & floating score popups
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i]
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.vy += 320 * dt
          p.life += dt
          p.alpha = Math.max(0, 1 - p.life / p.maxLife)
          if (p.life >= p.maxLife) {
            particlesRef.current.splice(i, 1)
          }
        }
        for (let i = popupsRef.current.length - 1; i >= 0; i--) {
          const pop = popupsRef.current[i]
          pop.y += pop.vy * dt
          pop.alpha -= dt * 1.15
          if (pop.alpha <= 0) {
            popupsRef.current.splice(i, 1)
          }
        }

        // Smooth camera tracking
        updateSideScrollingCamera(cameraRef.current, heroRef.current, stageRef.current, dt)

        // Process simulation audio & UI events
        if (events.jumped) {
          sound.playJump(events.highJumped || events.doubleJumped)
          spawnBurstParticles(
            heroRef.current.x + heroRef.current.w * 0.5,
            heroRef.current.y + heroRef.current.h,
            events.doubleJumped ? '#FDE047' : '#38BDF8',
            events.doubleJumped ? 10 : 6
          )
        }
        if (events.dashed) {
          sound.playDash()
          spawnBurstParticles(heroRef.current.x + 17, heroRef.current.y + 24, '#38BDF8', 10)
        }
        if (events.attacked) {
          sound.playAttackPulse()
          spawnBurstParticles(heroRef.current.x + 17, heroRef.current.y + 20, '#FDE047', 12)
        }
        if (events.landed) {
          sound.playLand()
        }
        if (events.collectedValue > 0) {
          stageScoreRef.current += events.collectedValue
        }
        if (events.collectedProductKinds.length > 0) {
          collectedCountRef.current += events.collectedProductKinds.length
          collectedKindsRef.current.push(...events.collectedProductKinds)
          const firstKind = events.collectedProductKinds[0]
          const meta = PRODUCT_CATALOG_META[firstKind]

          if (firstKind.startsWith('wire_')) {
            const g = firstKind === 'wire_6mm' ? '6' : firstKind === 'wire_4mm' ? '4' : firstKind === 'wire_2_5mm' ? '2.5' : '1.5'
            sound.playCollectWire(g)
          } else if (firstKind === 'led_bulb') {
            sound.playCollectBulb()
          } else if (firstKind === 'led_spotlight' || firstKind === 'rechargeable_floodlight') {
            sound.playCollectSpotlight()
          } else if (firstKind === 'intercom_device') {
            sound.playCollectIntercom()
          } else {
            sound.playCollectWire('2.5')
          }

          spawnBurstParticles(heroRef.current.x + 17, heroRef.current.y + 20, meta.color, 11)
          addScorePopup(heroRef.current.x + 17, heroRef.current.y - 8, `${meta.nameAr} +${events.collectedValue}`, meta.color)

          if (events.abilityActivatedMsg) {
            showAlert(events.abilityActivatedMsg, 'info')
          }
        }
        if (events.activatedCheckpointId) {
          sound.playCheckpoint()
          spawnBurstParticles(heroRef.current.x + 17, heroRef.current.y, '#34D399', 14)
          showAlert('🚩 تم تفعيل نقطة الحفظ الضوئية!', 'info')
        }
        if (events.activatedSwitchId || events.openedGateId) {
          sound.playGateOpen()
          spawnBurstParticles(heroRef.current.x + 17, heroRef.current.y, '#38BDF8', 14)
          showAlert(
            events.openedGateId
              ? '🔓 تم فتح البوابة الرئيسية بنجاح!'
              : '⚡ تم تفعيل القاطع الكهربائي!',
            'success'
          )
        }
        if (events.stompedEnemyId) {
          sound.playEnemyStomp()
          spawnBurstParticles(heroRef.current.x + 17, heroRef.current.y + heroRef.current.h, '#F59E0B', 12)
          addScorePopup(heroRef.current.x + 17, heroRef.current.y - 10, '+150', '#38BDF8')
        }
        if (events.hitBoss) {
          sound.playBossHit()
          cameraRef.current.shakeIntensity = 7
          spawnBurstParticles(heroRef.current.x + 17, heroRef.current.y, '#F97316', 18)
          showAlert('⚡ إصابة مباشرة للزعيم!', 'success')
        }
        if (events.bossPhaseChanged) {
          sound.playBossRoar()
          cameraRef.current.shakeIntensity = 9
          showAlert(`🔥 انتقل الزعيم إلى الطور القتالي ${events.bossPhaseChanged}!`, 'error')
        }
        if (events.bossDefeated) {
          sound.playMasterSwitch()
          cameraRef.current.shakeIntensity = 12
          spawnBurstParticles(heroRef.current.x + 40, heroRef.current.y, '#FBBF24', 28)
          showAlert('🏆 تم القضاء على الزعيم وفتح البوابة النهائية!', 'success')
        }
        if (events.shieldBlocked) {
          sound.playGateOpen()
          showAlert('🛡️ درع سلك 4 مم² العازل حمى البطل من الصدمة!', 'info')
        }
        if (events.fellInPit && heroRef.current.hp > 0) {
          sound.playShortCircuit()
          cameraRef.current.x = Math.max(0, heroRef.current.x - 240)
          showAlert('⚠️ سقوط في الهاوية! تمت إعادتك إلى آخر نقطة حفظ ضوئية.', 'error')
        } else if (events.tookDamage && heroRef.current.hp > 0) {
          sound.playShortCircuit()
          cameraRef.current.shakeIntensity = 6
          spawnBurstParticles(heroRef.current.x + 17, heroRef.current.y + 24, '#EF4444', 14)
        }

        // Check Defeat
        if (events.stageDefeated || heroRef.current.hp <= 0) {
          sound.stopMusic()
          sound.playDefeat()
          setHudHealth(0)
          setGameState('defeat')
        } else if (events.stageCompleted) {
          sound.stopMusic()
          sound.playVictory()
          const stage = stageRef.current
          const totalCollectibles = Math.max(1, stage.collectibles.length)
          const ratio = collectedCountRef.current / totalCollectibles
          const starsEarned = ratio >= 0.8 && heroRef.current.hp >= 2 ? 3 : ratio >= 0.45 ? 2 : 1
          const healthBonus = heroRef.current.hp * 250
          const timeBonus = Math.max(0, Math.round((120 - elapsedSecRef.current) * 6))
          const finalStageScore = stageScoreRef.current + healthBonus + timeBonus

          const updatedProg = recordStageCompletion(
            progression,
            stage.id,
            stage.stageIndex,
            finalStageScore,
            starsEarned,
            collectedCountRef.current,
            elapsedSecRef.current,
            collectedKindsRef.current
          )
          const nonFarmedCampaignScore = Object.values(updatedProg.bestStageScores).reduce(
            (sum, s) => sum + (Number.isFinite(s) ? s : 0),
            0
          )
          totalCampaignScoreRef.current = nonFarmedCampaignScore
          setProgression(updatedProg)
          setHudStageScore(finalStageScore)
          setHudScore(nonFarmedCampaignScore)
          setHudStarsEarned(starsEarned)
          setHudEnergy(collectedCountRef.current)

          if (currentStageIdx >= GAME_STAGES.length - 1) {
            setGameState('game_won')
          } else {
            setGameState('stage_clear')
          }
        }

        // Throttled HUD state sync (~10Hz)
        hudSyncAccumulator += dt
        if (
          hudSyncAccumulator >= 0.1 ||
          events.collectedStarIds.length > 0 ||
          events.tookDamage ||
          events.hitBoss
        ) {
          hudSyncAccumulator = 0
          setHudHealth(heroRef.current.hp)
          setHudBulbEnergy(Math.round(heroRef.current.lightEnergy))
          setHudEnergy(collectedCountRef.current)
          setHudStageScore(stageScoreRef.current)
          setHudScore(totalCampaignScoreRef.current + stageScoreRef.current)
          setHudElapsedSec(Math.floor(elapsedSecRef.current))
          if (stageRef.current.challengeTimeLimitSec) {
            setHudTimeLeftSec(
              Math.max(0, Math.ceil(stageRef.current.challengeTimeLimitSec - elapsedSecRef.current))
            )
          }
          setHudActiveBuffs({
            speed: heroRef.current.speedBoostTimer > 0,
            shield: heroRef.current.shieldTimer > 0,
            spotlight: heroRef.current.spotlightTimer > 0,
            floodlight: heroRef.current.floodlightTimer > 0,
          })
          if (stageRef.current.boss) {
            setHudBossHp(stageRef.current.boss.hp)
            setHudBossPhase(stageRef.current.boss.phase)
          }
        }
      }

      // Render Canvas Frame with DPR scaling
      if (ctx && canvas) {
        const dpr = dprRef.current || 1
        const expectedW = Math.round(cameraRef.current.viewportW * dpr)
        const expectedH = Math.round(cameraRef.current.viewportH * dpr)
        if (canvas.width !== expectedW || canvas.height !== expectedH) {
          canvas.width = expectedW
          canvas.height = expectedH
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        renderPlatformerFrame(
          ctx,
          stageRef.current,
          heroRef.current,
          cameraRef.current,
          elapsedSecRef.current,
          particlesRef.current,
          popupsRef.current,
          reducedMotion,
          graphicsQuality
        )
      }

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animationFrameId)
  }, [
    addScorePopup,
    currentStageIdx,
    gameState,
    graphicsQuality,
    isCanvasVisible,
    progression,
    reducedMotion,
    showAlert,
    spawnBurstParticles,
  ])

  // Multi-Touch Independent Pointer Tracking (Section 09 — HIGHEST PRIORITY)
  const syncActivePointersToInput = useCallback(() => {
    const nextState = {
      left: false,
      right: false,
      jump: false,
      dash: false,
      attack: false,
    }
    for (const btn of activePointersRef.current.values()) {
      nextState[btn] = true
    }
    touchInputRef.current = nextState
    setTouchVisualState((prev) => {
      if (
        prev.left === nextState.left &&
        prev.right === nextState.right &&
        prev.jump === nextState.jump &&
        prev.dash === nextState.dash &&
        prev.attack === nextState.attack
      ) {
        return prev
      }
      return nextState
    })
  }, [])

  const registerPointerControl = useCallback(
    (pointerId: number, button: 'left' | 'right' | 'jump' | 'dash' | 'attack') => {
      const prevBtn = activePointersRef.current.get(pointerId)
      if (prevBtn === button) return
      activePointersRef.current.set(pointerId, button)
      syncActivePointersToInput()
      if (button === 'jump' || button === 'dash') {
        try {
          navigator.vibrate?.(8)
        } catch {}
      }
    },
    [syncActivePointersToInput]
  )

  const releasePointerControl = useCallback(
    (pointerId: number) => {
      if (activePointersRef.current.has(pointerId)) {
        activePointersRef.current.delete(pointerId)
        syncActivePointersToInput()
      }
    },
    [syncActivePointersToInput]
  )

  const handleLeftPadPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const currentAssigned = activePointersRef.current.get(e.pointerId)
      if (currentAssigned !== 'left' && currentAssigned !== 'right') return
      const pad = leftPadRef.current
      if (!pad) return
      const rect = pad.getBoundingClientRect()
      const midX = rect.left + rect.width * 0.5
      const nextDir: 'left' | 'right' = e.clientX < midX ? 'left' : 'right'
      if (nextDir !== currentAssigned) {
        activePointersRef.current.set(e.pointerId, nextDir)
        syncActivePointersToInput()
      }
    },
    [syncActivePointersToInput]
  )

  // Submit Weekly Leaderboard Score
  const handleSubmitLeaderboard = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanName = playerNameInput.replace(/[<>]/g, '').trim().slice(0, 36)
    if (cleanName.length < 2) {
      showAlert('⚠️ يرجى إدخال اسم صحيح لا يقل عن حرفين للتسجيل في لوحة الشرف.', 'error')
      return
    }
    const cleanCity = (playerCityInput.replace(/[<>]/g, '').trim() || 'بنغازي').slice(0, 28)

    const bestSum = Object.values(progression.bestStageScores).reduce(
      (a, b) => a + (Number.isFinite(b) ? b : 0),
      0
    )
    const rawCandidateScore = Math.max(hudScore, bestSum, 500)
    const finalScore = Math.max(100, Math.min(45000, Math.round(rawCandidateScore)))
    const safeTimeSec = Math.max(35, Math.min(36000, Math.round(totalPlayTimeSecRef.current || 120)))

    const newEntry: LeaderboardEntry = {
      id: `${playerId}_${weeklyInfo.weekId}`,
      playerId,
      name: cleanName,
      city: cleanCity,
      score: finalScore,
      timeTakenSec: safeTimeSec,
      date: 'هذا الأسبوع',
      weekKey: weeklyInfo.weekId,
      createdAt: Date.now(),
    }

    const updated = dedupeAndRankLeaderboard([newEntry, ...leaderboard], 10)

    setLeaderboard(updated)
    setHasSubmittedScore(true)
    try {
      localStorage.setItem('enarah_player_name', cleanName)
      localStorage.setItem('enarah_player_city', cleanCity)
      localStorage.setItem(`enarah_weekly_leaderboard_${weeklyInfo.weekId}`, JSON.stringify(updated))
      localStorage.setItem('enarah_hero_leaderboard', JSON.stringify(updated))
    } catch {}

    try {
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          name: newEntry.name,
          city: newEntry.city,
          score: newEntry.score,
          timeTakenSec: newEntry.timeTakenSec,
          weekId: weeklyInfo.weekId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.entries)) {
            setLeaderboard((prev) => {
              const synced = dedupeAndRankLeaderboard([...prev, ...data.entries], 10)
              try {
                localStorage.setItem(`enarah_weekly_leaderboard_${weeklyInfo.weekId}`, JSON.stringify(synced))
              } catch {}
              return synced
            })
          }
        })
        .catch(() => {})
    } catch {}

    sound.playBonusTime()
    showAlert('🏆 رائع! تم تسجيل اسمك في لوحة شرف أبطال هذا الأسبوع!', 'success')
  }

  const exitGameplayToMenu = useCallback(() => {
    sound.playButton()
    clearAllInputs()
    sound.stopMusic()
    if (isFullscreen) {
      setIsFullscreen(false)
      const doc = document as any
      if (doc.fullscreenElement && doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {})
      } else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen()
      }
    }
    setGameState('start')
  }, [clearAllInputs, isFullscreen])

  const activeStage = GAME_STAGES[currentStageIdx] || GAME_STAGES[0]
  const isFullViewportMode = isDedicatedMobileGameplay || isFullscreen

  const gameContent = (
    <div
      id={isDedicatedMobileGameplay ? 'enarah-mobile-game-portal' : undefined}
      ref={containerRef}
      dir="rtl"
      className={`w-full flex flex-col items-center select-none ${
        isFullViewportMode
          ? 'fixed inset-0 z-[99999] w-screen h-[100dvh] bg-[#070B14] justify-between overflow-hidden'
          : isMobileDevice
          ? 'relative w-full h-[min(78dvh,560px)] min-h-[440px] bg-[#070B14] justify-between overflow-hidden rounded-2xl'
          : 'relative'
      }`}
    >
      {/* =====================================================================
          01. MINIMAL GAMEPLAY HUD (V8 PROBLEM 2)
          During mobile gameplay displays ONLY: Hearts • Energy • Small Pause (+ Exit)
          ===================================================================== */}
      <div
        className={`w-full ${
          isFullViewportMode || isMobileDevice ? '' : 'max-w-[960px] rounded-t-2xl border-x border-t'
        } h-9 sm:h-11 bg-[#0B1222]/95 border-b border-slate-800/90 px-2.5 sm:px-4 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between gap-2 shrink-0 z-30`}
      >
        {/* Stage Badge */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/40 text-[10px] sm:text-[11px] font-black text-amber-300 shrink-0">
            م {activeStage.worldNumber}
          </span>
          <span className="text-[11px] sm:text-sm font-extrabold text-white truncate max-w-[110px] sm:max-w-none">
            {activeStage.worldTitleAr}
          </span>
        </div>

        {/* Essential Status: Hearts & Energy ONLY */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Hearts */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
            {Array.from({ length: hudMaxHealth }).map((_, idx) => (
              <Heart
                key={idx}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  idx < hudHealth
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Energy Bar */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <div className="w-11 sm:w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-200"
                style={{ width: `${Math.max(10, Math.min(100, hudBulbEnergy))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pause & Dedicated Exit Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playButton()
              if (gameState === 'playing') {
                clearAllInputs()
                sound.stopMusic()
                setGameState('paused')
              } else if (gameState === 'paused') {
                setGameState('playing')
              } else {
                setShowSettingsModal(true)
              }
            }}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center cursor-pointer transition-colors"
            aria-label={gameState === 'playing' ? 'إيقاف مؤقت' : 'الإعدادات'}
          >
            {gameState === 'playing' ? (
              <Pause className="w-4 h-4 fill-amber-400" />
            ) : (
              <Settings className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {isFullViewportMode && (
            <button
              type="button"
              onClick={exitGameplayToMenu}
              className="h-8 px-2.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              aria-label="خروج من اللعب"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          )}
        </div>
      </div>

      {/* In Portrait Fullscreen Gameplay: Use space above the 16:9 frame for clean stage stats */}
      {isPortraitMobile && isFullViewportMode && gameState === 'playing' && (
        <div className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-bold text-slate-300 bg-[#0B1222]/90 border-b border-slate-800/80 shrink-0 z-20">
          <span className="text-amber-300">
            المرحلة {activeStage.worldNumber} / 8 • {activeStage.worldTitleAr}
          </span>
          <div className="flex items-center gap-3">
            <span>
              ⚡ القطع: <strong className="text-white">{hudEnergy}/{hudTotalEnergy}</strong>
            </span>
            <span>
              🏆 النقاط: <strong className="text-amber-400 font-mono">{hudScore}</strong>
            </span>
          </div>
        </div>
      )}

      {/* =====================================================================
          02. FIT-TO-SCREEN (CONTAIN) 16:9 GAMEPLAY VIEWPORT (V10 SECTIONS 1, 2, 4, 10)
          Preserves the complete 960x540 (16:9) logical game frame without zooming
          or cropping on any device. Uses remaining portrait vertical space cleanly.
          ===================================================================== */}
      <div
        ref={sceneWrapperRef}
        className={`relative w-full ${
          isFullViewportMode || isMobileDevice
            ? 'flex-1 min-h-0 flex items-center justify-center'
            : 'max-w-[960px] aspect-[16/9] max-h-[70vh] border-x border-slate-800 shadow-2xl flex items-center justify-center'
        } bg-[#070B14] overflow-hidden touch-none`}
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          width={VIEWPORT_WIDTH}
          height={VIEWPORT_HEIGHT}
          className="block shrink-0 shadow-2xl border-y sm:border border-slate-800/80"
        />

        {/* =================================================================
            09 — COMPACT BOSS HEALTH BAR (SECTION 9)
            Displays ONLY Boss Name + Health Bar without blocking gameplay
            ================================================================= */}
        {gameState === 'playing' && hudBossHp !== null && hudBossHp > 0 && activeStage.boss && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 rounded-full bg-slate-950/80 border border-rose-500/45 flex items-center gap-2.5 shadow-md max-w-[260px] sm:max-w-xs">
            <span className="text-[11px] font-extrabold text-rose-200 truncate">
              {activeStage.boss.nameAr}
            </span>
            <div className="w-20 sm:w-28 h-2 rounded-full bg-slate-800 overflow-hidden shrink-0">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-200"
                style={{ width: `${Math.max(0, (hudBossHp / hudBossMaxHp) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Compact Auto-Disappearing Gameplay Tip (Never blocks view) */}
        {bannerAlert && (
          <div
            className={`absolute top-9 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 rounded-full border text-[11px] font-bold shadow-sm whitespace-nowrap max-w-[92vw] truncate ${
              bannerAlert.type === 'success'
                ? 'bg-emerald-950/85 border-emerald-400/50 text-emerald-200'
                : bannerAlert.type === 'error'
                ? 'bg-rose-950/85 border-rose-400/50 text-rose-200'
                : 'bg-slate-900/85 border-slate-700 text-slate-100'
            }`}
          >
            {bannerAlert.msg}
          </div>
        )}

        {/* =================================================================
            MAIN MENU OVERLAY (Visible Start Game Button & Simple Menu)
            ================================================================= */}
        {gameState === 'start' && (
          <div className="absolute inset-0 z-20 bg-slate-950/35 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-[#0B1222]/90 border border-slate-700/80 rounded-3xl px-5 py-5 sm:px-9 sm:py-7 max-w-sm sm:max-w-md w-full shadow-2xl backdrop-blur-md flex flex-col items-center">
              <div className="w-11 h-11 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-2.5">
                <Lightbulb className="w-6 h-6 fill-amber-400" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
                بطل الإنارة
              </h2>

              <button
                type="button"
                onClick={() => startAdventure()}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 mb-2.5 shadow-md"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>ابدأ اللعب</span>
              </button>

              <div className="flex items-center gap-2 w-full mb-4">
                <button
                  type="button"
                  onClick={() => {
                    sound.playButton()
                    setShowStageSelectModal(true)
                  }}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Flag className="w-4 h-4 text-amber-400" />
                  <span>اختيار المرحلة</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playButton()
                    setShowSettingsModal(true)
                  }}
                  className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                  aria-label="الإعدادات"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full pt-3 border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-300 font-bold">
                <span>
                  المراحل المفتوحة: {Math.min(8, progression.unlockedStageIndex + 1)} / 8
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {Object.values(progression.stageStarsEarned).reduce((a, b) => a + b, 0)} / 24
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playButton()
                      setShowLeaderboard(true)
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                    title="لوحة الشرف"
                    aria-label="لوحة الشرف"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>لوحة الشرف</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            PAUSE MENU OVERLAY (Houses Secondary Controls per Section 8)
            ================================================================= */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 z-30 bg-slate-950/88 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-1">اللعبة متوقفة مؤقتاً</h3>
            <p className="text-xs text-slate-400 mb-4">
              المرحلة {activeStage.worldNumber}: {activeStage.worldTitleAr} • العناصر: {hudEnergy}/{hudTotalEnergy}
            </p>

            <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm mb-3">
              <button
                type="button"
                onClick={() => {
                  sound.playButton()
                  setGameState('playing')
                }}
                className="col-span-2 py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>متابعة اللعب</span>
              </button>

              <button
                type="button"
                onClick={retryCurrentStage}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المرحلة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playButton()
                  setShowStageSelectModal(true)
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Flag className="w-4 h-4 text-amber-400" />
                <span>اختيار المرحلة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = !isMuted
                  setIsMuted(next)
                  sound.setMuted(next)
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-400" />
                    <span>تشغيل الصوت</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>كتم الصوت</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span>{isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playButton()
                  setShowSettingsModal(true)
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>الإعدادات</span>
              </button>

              <button
                type="button"
                onClick={exitGameplayToMenu}
                className="py-2.5 px-3 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/40 text-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج للقائمة</span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            DEFEAT / RETRY OVERLAY
            ================================================================= */}
        {gameState === 'defeat' && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-2.5">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">انطفأت طاقة البطل</h3>
            <p className="text-xs text-slate-300 max-w-xs mb-5">
              حاول مجدداً وتجنب العوائق الكهربائية للوصول إلى نهاية المرحلة.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={retryCurrentStage}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playButton()
                  setShowStageSelectModal(true)
                }}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs cursor-pointer"
              >
                اختيار المرحلة
              </button>

              <button
                type="button"
                onClick={exitGameplayToMenu}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                خروج
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            STAGE CLEAR OVERLAY (اجتياز المرحلة بنجاح)
            ================================================================= */}
        {gameState === 'stage_clear' && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-7 h-7 transition-transform ${
                    starIdx <= hudStarsEarned
                      ? 'text-amber-400 fill-amber-400 scale-110'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
              اكتملت مرحلة {activeStage.worldTitleAr}
            </h3>
            <p className="text-xs text-cyan-300 font-bold mb-3">
              المرحلة التالية: {GAME_STAGES[currentStageIdx + 1]?.worldTitleAr}
            </p>

            <div className="grid grid-cols-3 gap-2.5 w-full max-w-sm mb-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5">
              <div>
                <div className="text-[10px] text-slate-400">العناصر</div>
                <div className="text-xs sm:text-sm font-black text-amber-400">
                  {hudEnergy} / {hudTotalEnergy}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">النقاط</div>
                <div className="text-xs sm:text-sm font-black text-cyan-400">+{hudStageScore}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">الزمن</div>
                <div className="text-xs sm:text-sm font-black text-emerald-400">{hudElapsedSec}s</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={goToNextStage}
                className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>المرحلة التالية</span>
              </button>

              <button
                type="button"
                onClick={retryCurrentStage}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                إعادة
              </button>

              <button
                type="button"
                onClick={exitGameplayToMenu}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                خروج
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            FINAL CAMPAIGN VICTORY + ADMIN-CONTROLLED REWARD + LEADERBOARD
            ================================================================= */}
        {gameState === 'game_won' && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-start sm:justify-center p-4 text-center overflow-y-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>بطل الإنارة • اكتملت المراحل الثماني</span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white mb-1">
              مبارك الفوز! أعدت النور للمدينة
            </h3>
            <p className="text-xs text-slate-300 max-w-lg mb-3">
              {rewardConfig.victoryMsg} — مجموع النقاط:{' '}
              <strong className="text-amber-400 font-mono">{hudScore}</strong>
            </p>

            {rewardConfig.isEnabled && rewardConfig.rewardType !== 'no_reward' && (
              <div className="w-full max-w-md bg-slate-900 border border-amber-400/40 rounded-2xl p-3 mb-3 text-right shadow-lg">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    {rewardConfig.rewardType === 'coupon'
                      ? rewardConfig.discountTitle
                      : 'هدية من الإنارة الحديثة'}
                  </span>
                  {rewardConfig.rewardType === 'coupon' && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(rewardConfig.couponCode)
                        setCopiedCoupon(true)
                        setTimeout(() => setCopiedCoupon(false), 2500)
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-mono cursor-pointer"
                    >
                      {copiedCoupon ? 'تم النسخ ✓' : rewardConfig.couponCode}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-300">
                  {rewardConfig.rewardType === 'coupon'
                    ? rewardConfig.discountDetails
                    : `${rewardConfig.giftItemName} — ${rewardConfig.giftInstructions}`}
                </p>
              </div>
            )}

            {!hasSubmittedScore ? (
              <form
                onSubmit={handleSubmitLeaderboard}
                className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-2"
              >
                <input
                  type="text"
                  required
                  placeholder="اسمك الكريم (لتسجيلك في لوحة الشرف)"
                  value={playerNameInput}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  placeholder="المدينة"
                  value={playerCityInput}
                  onChange={(e) => setPlayerCityInput(e.target.value)}
                  className="w-full sm:w-28 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>تسجيل النتيجة</span>
                </button>
              </form>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>تم تسجيل نتيجتك في لوحة الشرف!</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowLeaderboard(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>لوحة الشرف</span>
              </button>

              {rewardConfig.isEnabled && rewardConfig.rewardType !== 'no_reward' && (
                <a
                  href={`https://wa.me/218916580068?text=${encodeURIComponent(
                    `مرحباً شركة الإنارة الحديثة، أتممت المراحل الثماني في لعبة بطل الإنارة وحصلت على ${
                      rewardConfig.rewardType === 'coupon'
                        ? `كود الخصم: ${rewardConfig.couponCode}`
                        : `الهدية: ${rewardConfig.giftItemName}`
                    }`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تفعيل الجائزة عبر واتساب</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => startAdventure(0)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                إعادة اللعب
              </button>

              <button
                type="button"
                onClick={exitGameplayToMenu}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                خروج
              </button>
            </div>
          </div>
        )}
      </div>

      {/* In Portrait Fullscreen Gameplay: Use space below the 16:9 frame for objective & landscape hint */}
      {isPortraitMobile && isFullViewportMode && gameState === 'playing' && (
        <div className="w-full px-3.5 py-2 flex flex-col items-center gap-1 text-center bg-[#0B1222]/90 border-t border-slate-800/80 shrink-0 z-20">
          <span className="text-[11px] font-bold text-slate-200 truncate max-w-full">
            🎯 الهدف: {activeStage.finalChallengeAr}
          </span>
          <span className="text-[10px] font-semibold text-amber-300/90 flex items-center gap-1">
            <Smartphone className="w-3 h-3 rotate-90 shrink-0" />
            <span>تدوير الهاتف للوضع الأفقي يمنحك شاشة عرض أكبر بكثير</span>
          </span>
        </div>
      )}

      {/* =====================================================================
          03. TWO-THUMB MULTI-TOUCH CONTROL SYSTEM (SECTIONS 4, 5, 6)
          - Left Thumb: Two large buttons (LEFT ←, RIGHT →) — 64–76px targets
          - Right Thumb: Large Primary JUMP (76–88px) + Smaller DASH (58–68px) + Optional Action
          - Icon-only controls (zero text labels below buttons!)
          - In Landscape Mode: Floats in lower-left & lower-right safe areas to maximize canvas
          ===================================================================== */}
      <div
        dir="ltr"
        className={
          isLandscapeMobile && isFullViewportMode
            ? 'fixed bottom-0 inset-x-0 z-30 px-[max(0.75rem,env(safe-area-inset-left))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 flex items-end justify-between pointer-events-none select-none touch-none'
            : `w-full ${
                isFullViewportMode || isMobileDevice ? '' : 'max-w-[960px] rounded-b-2xl border-x border-b'
              } bg-[#09101E] border-t border-slate-800/90 px-3 sm:px-6 ${
                isPortraitMobile && isFullViewportMode ? 'pt-3.5 pb-[max(1rem,env(safe-area-inset-bottom))]' : 'pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]'
              } flex items-center justify-between gap-2 shrink-0 select-none touch-none z-30`
        }
        style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none', opacity: touchOpacity }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* LEFT THUMB: Two Large Directional Buttons (LEFT ← / RIGHT →, 64–76 CSS px) */}
        {/* LEFT THUMB: Two Large Buttons (LEFT ← / RIGHT →) — 64–76 CSS px */}
        <div
          ref={leftPadRef}
          onPointerMove={handleLeftPadPointerMove}
          className="flex items-center gap-2 min-[380px]:gap-3 sm:gap-4 pointer-events-auto touch-none"
        >
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault()
              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {}
              registerPointerControl(e.pointerId, 'left')
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              releasePointerControl(e.pointerId)
            }}
            onPointerCancel={(e) => releasePointerControl(e.pointerId)}
            onLostPointerCapture={(e) => releasePointerControl(e.pointerId)}
            className={`${
              touchButtonScale === 'large'
                ? 'w-[64px] h-[64px] min-[360px]:w-[66px] min-[360px]:h-[66px] min-[385px]:w-[72px] min-[385px]:h-[72px] sm:w-[76px] sm:h-[76px]'
                : 'w-[64px] h-[64px] sm:w-[68px] sm:h-[68px]'
            } rounded-2xl border-2 flex items-center justify-center transition-transform cursor-pointer select-none shadow-lg ${
              touchVisualState.left
                ? 'bg-blue-600 border-cyan-300 text-white scale-95'
                : 'bg-slate-900/90 border-slate-600/90 text-slate-100 active:bg-blue-600'
            }`}
            aria-label="Move Left"
          >
            <ArrowLeft className="w-8 h-8 stroke-[2.75] pointer-events-none" />
          </button>

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault()
              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {}
              registerPointerControl(e.pointerId, 'right')
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              releasePointerControl(e.pointerId)
            }}
            onPointerCancel={(e) => releasePointerControl(e.pointerId)}
            onLostPointerCapture={(e) => releasePointerControl(e.pointerId)}
            className={`${
              touchButtonScale === 'large'
                ? 'w-[64px] h-[64px] min-[360px]:w-[66px] min-[360px]:h-[66px] min-[385px]:w-[72px] min-[385px]:h-[72px] sm:w-[76px] sm:h-[76px]'
                : 'w-[64px] h-[64px] sm:w-[68px] sm:h-[68px]'
            } rounded-2xl border-2 flex items-center justify-center transition-transform cursor-pointer select-none shadow-lg ${
              touchVisualState.right
                ? 'bg-blue-600 border-cyan-300 text-white scale-95'
                : 'bg-slate-900/90 border-slate-600/90 text-slate-100 active:bg-blue-600'
            }`}
            aria-label="Move Right"
          >
            <ArrowRight className="w-8 h-8 stroke-[2.75] pointer-events-none" />
          </button>
        </div>

        {/* CENTER HINT (Desktop Only) */}
        <div dir="rtl" className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
          <span>
            الحركة: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">A</kbd>{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">D</kbd> / الأسهم
          </span>
          <span>•</span>
          <span>
            القفز: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">Space</kbd>
          </span>
          <span>•</span>
          <span>
            اندفاع: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">Shift</kbd>
          </span>
        </div>

        {/* RIGHT THUMB: Smaller DASH Button (58–68px) + Large Primary JUMP Button (76–88px) — V8 Problem 2 & 3 */}
        <div className="flex items-end gap-2.5 min-[380px]:gap-3 sm:gap-4 pointer-events-auto touch-none">
          {/* Secondary DASH Button (58–68 CSS px) */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault()
              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {}
              registerPointerControl(e.pointerId, 'dash')
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              releasePointerControl(e.pointerId)
            }}
            onPointerCancel={(e) => releasePointerControl(e.pointerId)}
            onLostPointerCapture={(e) => releasePointerControl(e.pointerId)}
            className={`${
              touchButtonScale === 'large'
                ? 'w-[58px] h-[58px] min-[360px]:w-[60px] min-[360px]:h-[60px] min-[385px]:w-[64px] min-[385px]:h-[64px] sm:w-[68px] sm:h-[68px]'
                : 'w-[58px] h-[58px] sm:w-[62px] sm:h-[62px]'
            } rounded-full border-2 flex items-center justify-center transition-transform cursor-pointer select-none shadow-lg ${
              touchVisualState.dash
                ? 'bg-cyan-400 border-white text-slate-950 scale-95'
                : 'bg-slate-900/90 border-cyan-500/60 text-cyan-300 active:bg-cyan-400 active:text-slate-950'
            }`}
            aria-label="Dash"
          >
            <Zap className="w-6 h-6 fill-current pointer-events-none" />
          </button>

          {/* LARGE PRIMARY JUMP BUTTON (76–88 CSS px) */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault()
              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {}
              registerPointerControl(e.pointerId, 'jump')
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              releasePointerControl(e.pointerId)
            }}
            onPointerCancel={(e) => releasePointerControl(e.pointerId)}
            onLostPointerCapture={(e) => releasePointerControl(e.pointerId)}
            className={`${
              touchButtonScale === 'large'
                ? 'w-[76px] h-[76px] min-[385px]:w-[82px] min-[385px]:h-[82px] sm:w-[88px] sm:h-[88px]'
                : 'w-[76px] h-[76px] sm:w-[80px] sm:h-[80px]'
            } rounded-full border-2 flex items-center justify-center transition-transform cursor-pointer select-none shadow-xl ${
              touchVisualState.jump
                ? 'bg-amber-300 border-white text-slate-950 scale-95'
                : 'bg-amber-400 hover:bg-amber-300 border-amber-200 text-slate-950'
            }`}
            aria-label="Jump"
          >
            <ArrowUp className="w-9 h-9 stroke-[3] pointer-events-none" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          05–07. PORTALED MODALS (Stage Select, Settings, Weekly Leaderboard)
          Rendered via createPortal(..., document.body) at z-[100020] to escape
          any parent CSS transform/backdrop-filter stacking contexts (V11 Section 1).
          ===================================================================== */}
      {isAnyGameModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div id="enarah-game-modal-portal" dir="rtl" className="select-none">
            {/* 05. STAGE SELECTION MODAL */}
            {showStageSelectModal && (
              <div
                onClick={() => setShowStageSelectModal(false)}
                className="fixed inset-0 z-[100020] bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#0E1628] border border-slate-700 rounded-3xl w-full max-w-3xl p-5 sm:p-6 shadow-2xl text-right max-h-[90dvh] flex flex-col"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <Flag className="w-5 h-5 text-amber-400" />
                      <h3 className="text-base sm:text-lg font-black text-white">
                        اختيار المرحلة
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowStageSelectModal(false)}
                      className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      aria-label="إغلاق"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mobile horizontal carousel / Desktop 4-column responsive grid */}
                  <div className="flex sm:grid sm:grid-cols-4 gap-3 overflow-x-auto sm:overflow-y-auto pb-2 sm:pb-0 snap-x snap-mandatory">
                    {GAME_STAGES.map((stg, idx) => {
                      const isUnlocked = idx <= progression.unlockedStageIndex
                      const isCompleted = progression.completedStageIds.includes(stg.id)
                      const isCurrent = idx === currentStageIdx
                      const stars = progression.stageStarsEarned[stg.id] || 0

                      return (
                        <button
                          key={stg.id}
                          type="button"
                          disabled={!isUnlocked}
                          onClick={() => {
                            if (isUnlocked) startAdventure(idx)
                          }}
                          className={`min-w-[190px] sm:min-w-0 snap-center rounded-2xl border p-3 text-right flex flex-col justify-between transition-all ${
                            isUnlocked
                              ? isCurrent
                                ? 'bg-slate-900 border-amber-400 cursor-pointer shadow-md'
                                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/90 cursor-pointer'
                              : 'bg-slate-950/70 border-slate-800/80 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          {/* Small Environment Preview — Unique per Stage World */}
                          <div
                            className="w-full h-16 rounded-xl mb-2.5 relative overflow-hidden border border-white/10"
                            style={{
                              background: `linear-gradient(to bottom, ${stg.skyTop}, ${stg.skyBottom})`,
                            }}
                          >
                            {/* Stage-Authentic Miniature Environment Silhouette */}
                            {stg.theme === 'city_of_light' && (
                              <div className="absolute bottom-1.5 inset-x-0 flex items-end justify-around px-2">
                                <div className="w-4 h-7 bg-sky-900/80 border-t-2 border-amber-300 rounded-t-xs" />
                                <div className="w-3 h-4 bg-emerald-500 rounded-full mb-1" />
                                <div className="w-6 h-9 bg-blue-950/85 border-t-2 border-cyan-300 rounded-t-xs" />
                                <div className="w-3 h-4 bg-emerald-500 rounded-full mb-1" />
                                <div className="w-5 h-6 bg-indigo-950/80 rounded-t-xs" />
                              </div>
                            )}
                            {stg.theme === 'electricity_street' && (
                              <div className="absolute bottom-1.5 inset-x-0 flex items-end justify-around px-2">
                                <div className="w-6 h-6 bg-amber-900/85 border-t-2 border-amber-300 rounded-t-xs" />
                                <div className="w-7 h-7 bg-orange-950/90 border-t-2 border-yellow-300 rounded-t-sm" />
                                <div className="w-5 h-5 bg-amber-800/80 border-t-2 border-cyan-300 rounded-t-xs" />
                              </div>
                            )}
                            {stg.theme === 'lighting_factory' && (
                              <div className="absolute bottom-1.5 inset-x-0 flex items-end justify-around px-2">
                                <div className="w-3 h-9 bg-slate-700 border-t-2 border-orange-400" />
                                <div className="w-5 h-5 rounded-full border-2 border-amber-400/80 mb-1" />
                                <div className="w-7 h-7 bg-slate-800 border-t-2 border-yellow-400" />
                                <div className="w-3 h-8 bg-slate-700 border-t-2 border-orange-400" />
                              </div>
                            )}
                            {stg.theme === 'intercom_district' && (
                              <div className="absolute bottom-1.5 inset-x-0 flex items-end justify-around px-2">
                                <div className="w-3 h-4 bg-emerald-500 rounded-full mb-0.5" />
                                <div className="w-7 h-6 bg-teal-950 border-t-2 border-emerald-300 rounded-t-sm" />
                                <div className="w-6 h-1.5 bg-orange-500 mb-3 rounded-full" />
                                <div className="w-6 h-7 bg-slate-900 border-t-2 border-amber-300 rounded-t-sm" />
                              </div>
                            )}
                            {stg.theme === 'power_station' && (
                              <div className="absolute bottom-1.5 inset-x-0 flex items-end justify-around px-2">
                                <div className="w-5 h-8 bg-slate-800 border border-orange-400/70 rounded-t-xs" />
                                <div className="w-8 h-3 bg-orange-500/90 mb-3 rounded-xs" />
                                <div className="w-6 h-9 bg-slate-900 border border-cyan-400/70 rounded-t-xs" />
                              </div>
                            )}
                            {stg.theme === 'dark_city' && (
                              <div className="absolute bottom-1.5 inset-x-0 flex items-end justify-around px-2">
                                <div className="w-4 h-9 bg-indigo-950 border-t border-cyan-400 rounded-t-sm" />
                                <div className="w-6 h-1 bg-cyan-400 mb-4 shadow-sm" />
                                <div className="w-5 h-10 bg-purple-950 border-t border-fuchsia-400 rounded-t-sm" />
                                <div className="w-4 h-7 bg-slate-900 border-t border-cyan-300 rounded-t-sm" />
                              </div>
                            )}
                            {stg.theme === 'lighting_tower' && (
                              <div className="absolute bottom-1.5 inset-x-0 flex items-end justify-center gap-2 px-2">
                                <div className="w-4 h-6 border-r border-cyan-300/60" />
                                <div className="w-5 h-11 bg-sky-950/90 border-x border-t border-amber-300 rounded-t-md" />
                                <div className="w-4 h-6 border-l border-cyan-300/60" />
                              </div>
                            )}
                            {stg.theme === 'darkness_fortress' && (
                              <div className="absolute bottom-1.5 inset-x-0 flex items-end justify-around px-2">
                                <div className="w-4 h-8 bg-slate-900 border-t-2 border-rose-500" />
                                <div className="w-8 h-10 bg-slate-950 border-t-2 border-orange-500 rounded-t-xs" />
                                <div className="w-4 h-8 bg-slate-900 border-t-2 border-rose-500" />
                              </div>
                            )}
                            {/* Ground line with stage accent color */}
                            <div
                              className="absolute bottom-0 inset-x-0 h-1.5"
                              style={{ backgroundColor: stg.accentColor }}
                            />
                            {/* Stage Number Badge */}
                            <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-black text-white">
                              المرحلة {stg.worldNumber}
                            </span>
                            {/* Locked / Unlocked State Icon */}
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-bold flex items-center gap-1">
                              {isUnlocked ? (
                                <Unlock className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Lock className="w-3 h-3 text-slate-400" />
                              )}
                            </span>
                          </div>

                          {/* Short Stage Name */}
                          <div className="text-sm font-black text-white truncate mb-2">
                            {stg.worldTitleAr}
                          </div>

                          {/* Completion Status & Stars */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 w-full">
                            <span
                              className={`text-[10px] font-bold ${
                                isCompleted
                                  ? 'text-emerald-400'
                                  : isUnlocked
                                  ? 'text-amber-300'
                                  : 'text-slate-500'
                              }`}
                            >
                              {isCompleted ? 'مكتملة ✓' : isUnlocked ? 'متاحة' : 'مغلقة'}
                            </span>

                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 06. SETTINGS MODAL (Audio, Graphics Quality, Reduced Motion, Touch Opacity) */}
            {showSettingsModal && (
              <div
                onClick={() => setShowSettingsModal(false)}
                className="fixed inset-0 z-[100020] bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#0E1628] border border-slate-700 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl text-right max-h-[90dvh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-black text-white">الإعدادات</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSettingsModal(false)}
                      className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      aria-label="إغلاق"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {/* Master Mute Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <div>
                        <div className="text-sm font-bold text-white">تشغيل الصوت العام</div>
                        <div className="text-xs text-slate-400">تفعيل أو كتم كافة الأصوات</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !isMuted
                          setIsMuted(next)
                          sound.setMuted(next)
                        }}
                        className={`px-4 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                          !isMuted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {!isMuted ? 'مفعّل' : 'مكتوم'}
                      </button>
                    </div>

                    {/* Separate Music Volume Control */}
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">صوت الموسيقى</span>
                        <span className="text-xs font-mono text-amber-300">{Math.round(musicVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={musicVolume}
                        onChange={(e) => {
                          const v = Number(e.target.value)
                          setMusicVolume(v)
                          sound.setMusicVolume(v)
                        }}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>

                    {/* Separate SFX Volume Control */}
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">صوت المؤثرات (SFX)</span>
                        <span className="text-xs font-mono text-cyan-300">{Math.round(sfxVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={sfxVolume}
                        onChange={(e) => {
                          const v = Number(e.target.value)
                          setSfxVolume(v)
                          sound.setSfxVolume(v)
                          sound.playButton()
                        }}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    {/* Graphics Quality Presets (High / Balanced / Low — Section 16) */}
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="text-xs font-bold text-white mb-2">جودة الرسوميات</div>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { id: 'high', label: 'عالية' },
                            { id: 'balanced', label: 'متوازنة' },
                            { id: 'low', label: 'خفيفة' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setGraphicsQuality(opt.id)
                              try {
                                localStorage.setItem('enarah_platformer_graphics_quality', opt.id)
                              } catch {}
                            }}
                            className={`py-1.5 rounded-xl text-xs font-bold cursor-pointer border ${
                              graphicsQuality === opt.id
                                ? 'bg-amber-400 border-amber-300 text-slate-950'
                                : 'bg-slate-950 border-slate-800 text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Controls Opacity & Size (Section 09) */}
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">شفافية أزرار اللمس</span>
                        <span className="text-xs font-mono text-cyan-300">{Math.round(touchOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.4}
                        max={1}
                        step={0.05}
                        value={touchOpacity}
                        onChange={(e) => {
                          const v = Number(e.target.value)
                          setTouchOpacity(v)
                          try {
                            localStorage.setItem('enarah_platformer_touch_opacity', String(v))
                          } catch {}
                        }}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-white">حجم أزرار اللمس</span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = touchButtonScale === 'large' ? 'normal' : 'large'
                            setTouchButtonScale(next)
                            try {
                              localStorage.setItem('enarah_platformer_touch_scale', next)
                            } catch {}
                          }}
                          className="px-3 py-1 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
                        >
                          {touchButtonScale === 'large' ? 'كبير' : 'قياسي'}
                        </button>
                      </div>
                    </div>

                    {/* Reduced Motion Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <div>
                        <div className="text-xs font-bold text-white">تقليل الحركة والمؤثرات</div>
                        <div className="text-[11px] text-slate-400">تخفيف اهتزاز الكاميرا والجزيئات</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !reducedMotion
                          setReducedMotion(next)
                          try {
                            localStorage.setItem('enarah_platformer_reduced_motion', String(next))
                          } catch {}
                        }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                          reducedMotion ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {reducedMotion ? 'مفعّل' : 'عادي'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowSettingsModal(false)}
                      className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer"
                    >
                      حفظ وإغلاق
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 07. WEEKLY LEADERBOARD MODAL */}
            {showLeaderboard && (
              <div
                onClick={() => setShowLeaderboard(false)}
                className="fixed inset-0 z-[100020] bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#121316] border border-amber-500/40 rounded-3xl w-full max-w-lg p-5 shadow-2xl relative text-right flex flex-col max-h-[88dvh]"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                    <button
                      type="button"
                      onClick={() => setShowLeaderboard(false)}
                      className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                      aria-label="إغلاق"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white">لوحة شرف أبطال الإنارة الحديثة</h3>
                      <Trophy className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-blue-950/40 border border-amber-500/30 rounded-2xl p-3 mb-3 text-right shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{weeklyInfo.weekTitle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-black/50 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          ينتهي خلال {weeklyInfo.daysLeft} يوم و {weeklyInfo.hoursLeft} ساعة
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      ⚡ اجمع المنتجات الكهربائية وأكمل المراحل الثماني لتتصدر لوحة الشرف الأسبوعية!
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setLeaderboardTab('current')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        leaderboardTab === 'current'
                          ? 'bg-amber-500 text-black shadow-lg'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>أبطال هذا الأسبوع ({leaderboard.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeaderboardTab('previous')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        leaderboardTab === 'previous'
                          ? 'bg-amber-500 text-black shadow-lg'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      <Medal className="w-3.5 h-3.5" />
                      <span>الأسبوع الماضي ({previousWeekBoard.length})</span>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px]">
                    {(leaderboardTab === 'current' ? leaderboard : previousWeekBoard).length === 0 ? (
                      <div className="py-8 px-4 text-center flex flex-col items-center justify-center">
                        <Trophy className="w-8 h-8 text-amber-400 mb-2" />
                        <h4 className="text-sm font-bold text-white mb-1">كن أول بطل يسجل اسمه هذا الأسبوع!</h4>
                        <p className="text-xs text-zinc-400">أكمل المغامرة وسجل اسمك في المركز الأول.</p>
                      </div>
                    ) : (
                      (leaderboardTab === 'current' ? leaderboard : previousWeekBoard).map((item, idx) => {
                        const isCurrentPlayer =
                          (item.playerId && item.playerId === playerId) ||
                          (playerNameInput.trim().length >= 2 &&
                            item.name.trim().toLowerCase() === playerNameInput.trim().toLowerCase())

                        return (
                          <div
                            key={item.id || `${item.name}_${idx}`}
                            className={`flex items-center justify-between p-3 rounded-2xl border ${
                              isCurrentPlayer
                                ? 'bg-amber-500/15 border-amber-400/70'
                                : 'bg-zinc-900/70 border-zinc-800'
                            }`}
                          >
                            <div className="text-left">
                              <div className="text-xs font-black text-amber-400">{item.score} نقطة</div>
                              <div className="text-[10px] text-zinc-400 font-mono">{item.timeTakenSec} ثانية</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <span>{item.name}</span>
                                  {isCurrentPlayer && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black">
                                      أنت
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-zinc-400">{item.city}</div>
                              </div>
                              <div className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs bg-amber-500 text-black">
                                {idx + 1}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <div className="pt-4 mt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setShowLeaderboard(false)}
                      className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                    >
                      إغلاق والعودة للعبة
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  )

  if (isDedicatedMobileGameplay && typeof document !== 'undefined') {
    return (
      <>
        <div className="w-full h-[360px] bg-[#070B14] rounded-2xl" aria-hidden="true" />
        {createPortal(gameContent, document.body)}
      </>
    )
  }

  return gameContent
}
