import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
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
  Compass,
  Flag,
  Lightbulb,
  Shield,
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
  createInitialHeroState,
  stepPlatformerSimulation,
  updateSideScrollingCamera,
} from './platformerPhysics'
import {
  type FloatingScorePopup,
  type LightParticle,
  renderPlatformerFrame,
} from './platformerRenderer'

export interface LeaderboardEntry {
  id: string
  name: string
  city: string
  score: number
  timeTakenSec: number
  date: string
  weekKey?: string
}

export interface WeeklyChallengeInfo {
  weekId: string
  weekTitle: string
  daysLeft: number
  hoursLeft: number
  startDateStr: string
  endDateStr: string
}

export const getWeeklyChallengeInfo = (date = new Date()): WeeklyChallengeInfo => {
  const day = date.getDay()
  const diffToSaturday = (day + 1) % 7
  const saturday = new Date(date)
  saturday.setDate(date.getDate() - diffToSaturday)
  saturday.setHours(0, 0, 0, 0)

  const nextFriday = new Date(saturday)
  nextFriday.setDate(saturday.getDate() + 6)
  nextFriday.setHours(23, 59, 59, 999)

  const msLeft = Math.max(0, nextFriday.getTime() - date.getTime())
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  const weekId = `${saturday.getFullYear()}-${String(saturday.getMonth() + 1).padStart(2, '0')}-${String(saturday.getDate()).padStart(2, '0')}`
  const arMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
  const startDateStr = `${saturday.getDate()} ${arMonths[saturday.getMonth()]}`
  const endDateStr = `${nextFriday.getDate()} ${arMonths[nextFriday.getMonth()]}`

  return {
    weekId,
    weekTitle: `بطولة الأسبوع (${startDateStr} - ${endDateStr})`,
    daysLeft,
    hoursLeft,
    startDateStr,
    endDateStr,
  }
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

  // Progression & Stages
  const [progression, setProgression] = useState<PlayerProgressionState>(() => loadPlayerProgression())
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0)
  const [gameState, setGameState] = useState<GameScreenState>('start')

  // Modals
  const [showStageSelectModal, setShowStageSelectModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  // Audio & Accessibility Settings (Section 9)
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted)
  const [musicVolume, setMusicVolume] = useState<number>(() => sound.musicVolume)
  const [sfxVolume, setSfxVolume] = useState<number>(() => sound.sfxVolume)
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
      return (localStorage.getItem('enarah_platformer_touch_scale') as 'normal' | 'large') || 'large'
    } catch {
      return 'large'
    }
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPortraitMobile, setIsPortraitMobile] = useState(false)
  const [dismissedOrientationHint, setDismissedOrientationHint] = useState(false)
  const [isCanvasVisible, setIsCanvasVisible] = useState(true)

  // HUD Reactive State
  const [hudHealth, setHudHealth] = useState(3)
  const [hudMaxHealth, setHudMaxHealth] = useState(3)
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
  const [playerNameInput, setPlayerNameInput] = useState('')
  const [playerCityInput, setPlayerCityInput] = useState('بنغازي')
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false)
  const [leaderboardTab, setLeaderboardTab] = useState<'current' | 'previous'>('current')

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const info = getWeeklyChallengeInfo()
      const currentWeekKey = `enarah_weekly_leaderboard_${info.weekId}`
      const savedWeek = localStorage.getItem(currentWeekKey)
      if (savedWeek) return JSON.parse(savedWeek)
      const legacy = localStorage.getItem('enarah_hero_leaderboard')
      if (legacy) {
        const parsed = JSON.parse(legacy)
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem(currentWeekKey, JSON.stringify(parsed))
          return parsed
        }
      }
      return []
    } catch {
      return []
    }
  })

  const [previousWeekBoard] = useState<LeaderboardEntry[]>(() => {
    try {
      const prev = localStorage.getItem('enarah_last_week_champions')
      return prev ? JSON.parse(prev) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    fetch(`/api/leaderboard?week=${weeklyInfo.weekId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.entries) && data.entries.length > 0) {
          setLeaderboard((prev) => {
            const map = new Map<string, LeaderboardEntry>()
            prev.forEach((item) => map.set(`${item.name}_${item.score}`, item))
            data.entries.forEach((remote: LeaderboardEntry) => {
              map.set(`${remote.name}_${remote.score}`, remote)
            })
            const merged = Array.from(map.values())
              .sort((a, b) => b.score - a.score || a.timeTakenSec - b.timeTakenSec)
              .slice(0, 10)
            try {
              localStorage.setItem(`enarah_weekly_leaderboard_${weeklyInfo.weekId}`, JSON.stringify(merged))
            } catch {}
            return merged
          })
        }
      })
      .catch(() => {})
  }, [weeklyInfo.weekId])

  const [rewardConfig, setRewardConfig] = useState({
    isEnabled: true,
    rewardType: 'coupon' as 'coupon' | 'physical_gift' | 'no_reward',
    couponCode: 'ENARAH-HERO',
    discountTitle: 'كوبون أبطال الإنارة الذهبي',
    discountDetails: 'خصم خاص عند إرسال الكود مع طلبيتك عبر الواتساب!',
    giftItemName: 'كشاف سبوت لايت ذكي مجاني أو مفتاح لمس VIP',
    giftInstructions: 'استلم هديتك من أي فرع للإنارة الحديثة بإبراز هذه الشاشة!',
    victoryMsg: 'أنت بطل أسطوري حقيقي للإنارة! لقد عبرت المراحل الثماني وهزمت ملك الظلام الكهربائي بنجاح تام.',
  })

  useEffect(() => {
    try {
      const local = localStorage.getItem('enarah_game_reward_config')
      if (local) {
        setRewardConfig((prev) => ({ ...prev, ...JSON.parse(local) }))
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
              const latest = updates[updates.length - 1]
              const parsed = JSON.parse(latest.phone).config
              if (parsed) {
                setRewardConfig((prev) => ({ ...prev, ...parsed }))
                localStorage.setItem('enarah_game_reward_config', JSON.stringify(parsed))
              }
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

  // Check mobile portrait orientation
  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === 'undefined') return
      const isMobileWidth = window.innerWidth < 820
      const isPortrait = window.innerHeight > window.innerWidth
      setIsPortraitMobile(isMobileWidth && isPortrait)
    }
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)
    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  // IntersectionObserver to pause rendering & music when scrolled offscreen
  useEffect(() => {
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
  }, [])

  const clearAllInputs = useCallback(() => {
    keysRef.current = {}
    touchInputRef.current = { left: false, right: false, jump: false, dash: false, attack: false }
    prevJumpHeldRef.current = false
    prevDashHeldRef.current = false
    prevAttackHeldRef.current = false
    setTouchVisualState({ left: false, right: false, jump: false, dash: false, attack: false })
  }, [])

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

  const showAlert = useCallback((msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setBannerAlert({ msg, type })
    setTimeout(() => {
      setBannerAlert((prev) => (prev?.msg === msg ? null : prev))
    }, 3400)
  }, [])

  const spawnBurstParticles = useCallback(
    (x: number, y: number, color: string, count = 10) => {
      if (reducedMotion) return
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
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
      if (particlesRef.current.length > 70) {
        particlesRef.current.splice(0, particlesRef.current.length - 70)
      }
    },
    [reducedMotion]
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
      cameraRef.current = {
        x: Math.max(0, cloned.heroSpawn.x - 240),
        y: 0,
        viewportW: VIEWPORT_WIDTH,
        viewportH: VIEWPORT_HEIGHT,
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
      if (targetIdx === 0) {
        totalCampaignScoreRef.current = 0
        totalPlayTimeSecRef.current = 0
        setHudScore(0)
        setHasSubmittedScore(false)
      }
      initStage(targetIdx)
      setShowStageSelectModal(false)
      setShowSettingsModal(false)
      setGameState('playing')
    },
    [initStage, progression.unlockedStageIndex]
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

  // Keyboard Controls (Desktop — Section 13)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return

      const code = e.code
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
        if (code.startsWith('Arrow') || code === 'Space') {
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
  }, [clearAllInputs, gameState, retryCurrentStage])

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

  // Main 60fps Platformer Physics + Rendering Loop
  useEffect(() => {
    if (!isCanvasVisible) return

    let animationFrameId = 0
    let lastTimestamp = performance.now()
    let hudSyncAccumulator = 0

    const loop = (now: number) => {
      const rawDt = (now - lastTimestamp) / 1000
      lastTimestamp = now
      const dt = Math.min(rawDt, 0.05)

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')

      if (gameState === 'playing') {
        elapsedSecRef.current += dt
        totalPlayTimeSecRef.current += dt

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

        const events = stepPlatformerSimulation(
          heroRef.current,
          stageRef.current,
          inputFrame,
          dt,
          elapsedSecRef.current
        )

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

          totalCampaignScoreRef.current += finalStageScore
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
          setProgression(updatedProg)
          setHudStageScore(finalStageScore)
          setHudScore(totalCampaignScoreRef.current)
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

      // Render Canvas Frame
      if (ctx) {
        renderPlatformerFrame(
          ctx,
          stageRef.current,
          heroRef.current,
          cameraRef.current,
          elapsedSecRef.current,
          particlesRef.current,
          popupsRef.current,
          reducedMotion
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
    isCanvasVisible,
    progression,
    reducedMotion,
    showAlert,
    spawnBurstParticles,
  ])

  // Pointer Handler for Mobile Multi-Touch Controls
  const handleTouchControl = useCallback(
    (button: 'left' | 'right' | 'jump' | 'dash' | 'attack', pressed: boolean) => {
      touchInputRef.current[button] = pressed
      setTouchVisualState((prev) => {
        if (prev[button] === pressed) return prev
        return { ...prev, [button]: pressed }
      })
      if (pressed && (button === 'jump' || button === 'dash')) {
        try {
          navigator.vibrate?.(8)
        } catch {}
      }
    },
    []
  )

  // Submit Weekly Leaderboard Score
  const handleSubmitLeaderboard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerNameInput.trim()) return

    const bestSum = Object.values(progression.bestStageScores).reduce((a, b) => a + b, 0)
    const finalScore = Math.max(hudScore, bestSum, 500)
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: playerNameInput.trim(),
      city: playerCityInput.trim() || 'بنغازي',
      score: finalScore,
      timeTakenSec: Math.max(Math.round(totalPlayTimeSecRef.current), 35),
      date: 'هذا الأسبوع',
      weekKey: weeklyInfo.weekId,
    }

    const updated = [newEntry, ...leaderboard]
      .sort((a, b) => b.score - a.score || a.timeTakenSec - b.timeTakenSec)
      .slice(0, 10)

    setLeaderboard(updated)
    setHasSubmittedScore(true)
    try {
      localStorage.setItem(`enarah_weekly_leaderboard_${weeklyInfo.weekId}`, JSON.stringify(updated))
      localStorage.setItem('enarah_hero_leaderboard', JSON.stringify(updated))
    } catch {}

    try {
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newEntry.name,
          city: newEntry.city,
          score: newEntry.score,
          timeTakenSec: newEntry.timeTakenSec,
          weekId: weeklyInfo.weekId,
        }),
      }).catch(() => {})
    } catch {}

    sound.playBonusTime()
    showAlert('🏆 رائع! تم تسجيل اسمك في لوحة شرف أبطال هذا الأسبوع!', 'success')
  }

  const activeStage = GAME_STAGES[currentStageIdx] || GAME_STAGES[0]

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className={`w-full flex flex-col items-center select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#070B14] justify-between p-2 sm:p-4 overflow-hidden'
          : 'relative'
      }`}
    >
      {/* =====================================================================
          01. MOBILE PORTRAIT ORIENTATION RECOMMENDATION BANNER
          ===================================================================== */}
      {isPortraitMobile && !dismissedOrientationHint && (
        <div className="w-full max-w-[960px] mb-2.5 px-3.5 py-2 rounded-2xl bg-gradient-to-l from-amber-500/15 via-blue-950/80 to-slate-900/90 border border-amber-400/35 flex items-center justify-between gap-2 text-amber-200 text-xs shadow-md">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="font-bold leading-snug">
              لأفضل تجربة لعب، يُفضّل تدوير الهاتف للوضع الأفقي.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDismissedOrientationHint(true)}
            className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-white/80 font-semibold shrink-0 cursor-pointer"
          >
            إخفاء
          </button>
        </div>
      )}

      {/* =====================================================================
          02. COMPACT TOP HUD BAR
          ===================================================================== */}
      <div className="w-full max-w-[960px] bg-[#0B1222]/95 border border-slate-800/90 rounded-t-2xl px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-lg backdrop-blur-md">
        {/* Right Cluster: Level & Stage Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-200/50 flex items-center justify-center text-slate-950 shadow-inner shrink-0">
            <Lightbulb className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-[10px] font-black text-cyan-300">
                المرحلة {activeStage.worldNumber} / 8
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-white">
                {activeStage.worldTitleAr}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {activeStage.finalChallengeAr}
            </p>
          </div>
        </div>

        {/* Center Cluster: Health, Collected Products, Timed Challenge & Active Buffs */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Health Hearts */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800"
            title="نقاط الطاقة والصحة"
          >
            {Array.from({ length: hudMaxHealth }).map((_, idx) => (
              <Heart
                key={idx}
                className={`w-4 h-4 transition-transform duration-200 ${
                  idx < hudHealth
                    ? 'text-rose-500 fill-rose-500 scale-100 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                    : 'text-slate-700 fill-slate-800 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Collected Electrical Products */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-extrabold"
            title="المنتجات والأسلاك المجمعة"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-mono">
              {hudEnergy} / {hudTotalEnergy}
            </span>
          </div>

          {/* Timed Challenge Countdown (Level 3 & Level 6) */}
          {hudTimeLeftSec !== null && (
            <div
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-black font-mono ${
                hudTimeLeftSec <= 18
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-900/90 border-cyan-500/35 text-cyan-300'
              }`}
              title="الوقت المتبقي للتحدي"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{hudTimeLeftSec}s</span>
            </div>
          )}

          {/* Active Product Ability Badges */}
          {hudActiveBuffs.shield && (
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-black flex items-center gap-1">
              <Shield className="w-3 h-3" /> درع 4مم
            </span>
          )}
          {hudActiveBuffs.speed && (
            <span className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-black">
              ⚡ سرعة 2.5مم
            </span>
          )}
          {(hudActiveBuffs.spotlight || hudActiveBuffs.floodlight) && (
            <span className="px-2 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[10px] font-black">
              🔦 كشاف نشط
            </span>
          )}

          {/* Score */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-blue-500/25 text-cyan-300 text-xs font-extrabold">
            <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span className="font-mono">{hudScore}</span>
          </div>
        </div>

        {/* Left Cluster: Quick Utility Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              sound.playButton()
              setShowStageSelectModal(true)
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="اختيار المرحلة"
          >
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">اختيار المرحلة</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playButton()
              setShowLeaderboard(true)
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-400 cursor-pointer transition-colors"
            title="لوحة الشرف الأسبوعية"
            aria-label="لوحة الشرف الأسبوعية"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !isMuted
              setIsMuted(next)
              sound.setMuted(next)
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title={isMuted ? 'تشغيل الصوت والموسيقى' : 'كتم الصوت'}
            aria-label={isMuted ? 'تشغيل الصوت والموسيقى' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playButton()
              setShowSettingsModal(true)
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="الإعدادات"
            aria-label="الإعدادات"
          >
            <Settings className="w-4 h-4" />
          </button>

          {gameState === 'playing' && (
            <button
              type="button"
              onClick={() => {
                sound.playButton()
                clearAllInputs()
                sound.stopMusic()
                setGameState('paused')
              }}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="إيقاف مؤقت"
            >
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إيقاف</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}
            aria-label={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* =====================================================================
          03. CANVAS VIEWPORT & IN-WORLD OVERLAY MENUS
          ===================================================================== */}
      <div className="relative w-full max-w-[960px] aspect-[16/9] max-h-[68vh] bg-[#070B14] border-x border-b border-slate-800 overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={VIEWPORT_WIDTH}
          height={VIEWPORT_HEIGHT}
          className="w-full h-full block object-contain"
        />

        {/* Boss Health Bar Overlay */}
        {gameState === 'playing' && hudBossHp !== null && hudBossHp > 0 && activeStage.boss && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-72 sm:w-96 bg-slate-950/90 border border-rose-500/50 rounded-2xl px-4 py-2 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-extrabold text-rose-300 mb-1">
              <span>
                ⚡ {activeStage.boss.nameAr} (الطور {hudBossPhase})
              </span>
              <span>
                الدرع: {hudBossHp} / {hudBossMaxHp}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-300"
                style={{ width: `${Math.max(0, (hudBossHp / hudBossMaxHp) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-300 mt-1 text-center">
              اقفز فوق النواة العلوية للزعيم أو فعّل قواطع التفريغ في الساحة!
            </p>
          </div>
        )}

        {/* Live Banner Alert */}
        {bannerAlert && (
          <div
            className={`absolute top-3 right-3 z-30 max-w-xs sm:max-w-md px-4 py-2 rounded-xl border text-xs font-bold shadow-lg backdrop-blur-md transition-all ${
              bannerAlert.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-400/50 text-emerald-200'
                : bannerAlert.type === 'error'
                ? 'bg-rose-950/90 border-rose-400/50 text-rose-200'
                : 'bg-blue-950/90 border-cyan-400/50 text-cyan-100'
            }`}
          >
            {bannerAlert.msg}
          </div>
        )}

        {/* =================================================================
            START SCREEN OVERLAY (شاشة البداية - بطل الإنارة: مغامرة اللمبة الأسطورية)
            ================================================================= */}
        {gameState === 'start' && (
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#070E20]/88 via-[#0B1528]/92 to-[#070B14]/96 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-y-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-extrabold mb-2.5 shadow-sm">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>مغامرة اللمبة المضيئة 2.5D • 8 مراحل متدرجة الصعوبة</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-1.5 drop-shadow-md">
              بطل الإنارة <span className="text-amber-400">—</span> مغامرة اللمبة الأسطورية
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-4">
              تحكم بشخصية <strong className="text-amber-300">لمبة LED الذكية</strong> واجمع منتجات الإنارة الحديثة الحقيقية:{' '}
              <span className="text-cyan-300">أسلاك النحاس (1.5 و2.5 و4 و6 مم²)</span>،{' '}
              <span className="text-yellow-300">السبوت لايت وكشافات الطوارئ</span>، و
              <span className="text-emerald-300">أجهزة الإنترفون</span> عبر 8 مراحل ملحمية حتى هزيمة «ملك الظلام الكهربائي»!
            </p>

            {/* 8 Levels Preview Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2 w-full max-w-3xl mb-5">
              {GAME_STAGES.map((stg, idx) => {
                const isUnlocked = idx <= progression.unlockedStageIndex
                const stars = progression.stageStarsEarned[stg.id] || 0
                return (
                  <button
                    key={stg.id}
                    type="button"
                    onClick={() => {
                      if (isUnlocked) startAdventure(idx)
                    }}
                    disabled={!isUnlocked}
                    className={`p-2 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-slate-900/90 hover:bg-blue-950/80 border-blue-500/40 cursor-pointer hover:-translate-y-0.5 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 opacity-55 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[9px] font-black text-cyan-400">{stg.code}</span>
                      {isUnlocked ? (
                        <Unlock className="w-2.5 h-2.5 text-emerald-400" />
                      ) : (
                        <Lock className="w-2.5 h-2.5 text-slate-500" />
                      )}
                    </div>
                    <div className="text-[10px] font-extrabold text-white truncate w-full">
                      {stg.worldTitleAr}
                    </div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-2.5 h-2.5 ${
                            s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Primary Menu Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => startAdventure()}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-l from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-[0_0_25px_rgba(245,158,11,0.45)] flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>ابدأ المغامرة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playButton()
                  setShowStageSelectModal(true)
                }}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-blue-400/40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <Flag className="w-4 h-4 text-cyan-400" />
                <span>اختيار المرحلة (8 مراحل)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playButton()
                  setShowSettingsModal(true)
                }}
                className="px-4 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>الإعدادات</span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            PAUSE MENU OVERLAY (قائمة الإيقاف المؤقت)
            ================================================================= */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3">
              <Pause className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">اللعبة متوقفة مؤقتاً</h3>
            <p className="text-xs text-slate-400 mb-6">
              {activeStage.worldTitleAr} — {activeStage.titleAr}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center">
              <button
                type="button"
                onClick={() => {
                  sound.playButton()
                  setGameState('playing')
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>متابعة</span>
              </button>

              <button
                type="button"
                onClick={retryCurrentStage}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playButton()
                  setShowSettingsModal(true)
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>الإعدادات</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playButton()
                  clearAllInputs()
                  sound.stopMusic()
                  setGameState('start')
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 text-slate-300 hover:text-rose-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>العودة للقائمة</span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            DEFEAT / RETRY OVERLAY
            ================================================================= */}
        {gameState === 'defeat' && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">انطفأت طاقة لمبة البطل!</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              اجمع لمبات LED لاستعادة القلوب وأسلاك 4 مم² لتفعيل الدرع العازل، واستخدم القفز المزدوج والاندفاع السريع لتجاوز العوائق!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
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
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm cursor-pointer"
              >
                اختيار المرحلة
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playButton()
                  setGameState('start')
                }}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm cursor-pointer"
              >
                العودة للقائمة
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            STAGE CLEAR OVERLAY (اجتياز المرحلة بنجاح)
            ================================================================= */}
        {gameState === 'stage_clear' && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-8 h-8 transition-transform ${
                    starIdx <= hudStarsEarned
                      ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
              اكتملت مرحلة {activeStage.worldTitleAr} بنجاح!
            </h3>
            <p className="text-xs sm:text-sm text-cyan-300 font-bold mb-4">
              تم فتح المرحلة التالية: {GAME_STAGES[currentStageIdx + 1]?.worldTitleAr}
            </p>

            <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
              <div>
                <div className="text-[11px] text-slate-400">المنتجات المجمعة</div>
                <div className="text-sm font-black text-amber-400">
                  {hudEnergy} / {hudTotalEnergy}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">نقاط المرحلة</div>
                <div className="text-sm font-black text-cyan-400">+{hudStageScore}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">الزمن</div>
                <div className="text-sm font-black text-emerald-400">{hudElapsedSec} ثانية</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={goToNextStage}
                className="px-7 py-3 rounded-xl bg-gradient-to-l from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>متابعة للمرحلة التالية ({GAME_STAGES[currentStageIdx + 1]?.worldTitleAr})</span>
              </button>

              <button
                type="button"
                onClick={retryCurrentStage}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                إعادة المحاولة
              </button>

              <button
                type="button"
                onClick={() => setGameState('start')}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                العودة للقائمة
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            FINAL CAMPAIGN VICTORY + VOUCHER + LEADERBOARD
            ================================================================= */}
        {gameState === 'game_won' && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 text-center overflow-y-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>بطل الإنارة الأسطوري • تم تحرير المراحل الثماني كاملة!</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
              مبارك الفوز! هزمت ملك الظلام الكهربائي وأعدت النور للمدينة
            </h3>
            <p className="text-xs text-slate-300 max-w-lg mb-3">
              {rewardConfig.victoryMsg} — مجموع نقاطك النهائي:{' '}
              <strong className="text-amber-400 font-mono">{hudScore} نقطة</strong>
            </p>

            {/* Reward Coupon / Gift Card */}
            {rewardConfig.isEnabled && rewardConfig.rewardType !== 'no_reward' && (
              <div className="w-full max-w-md bg-gradient-to-l from-amber-950/50 via-slate-900 to-blue-950/50 border border-amber-400/40 rounded-2xl p-3.5 mb-3 text-right shadow-lg">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    {rewardConfig.rewardType === 'coupon'
                      ? rewardConfig.discountTitle
                      : 'هدية فورية من الإنارة الحديثة'}
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

            {/* Leaderboard Submission Form */}
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
                <span>تم تسجيل نتيجتك في لوحة شرف أبطال الإنارة!</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2.5">
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
                إعادة المحاولة
              </button>

              <button
                type="button"
                onClick={() => setGameState('start')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                العودة للقائمة
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          04. ERGONOMIC MULTI-TOUCH MOBILE CONTROLS DECK (SECTION 12)
          Left side: Left / Right directional buttons
          Right side: Attack Pulse + Dash + Prominent Jump (with Double Jump)
          ===================================================================== */}
      <div
        dir="ltr"
        className="w-full max-w-[960px] bg-[#0B1222] border-x border-b border-slate-800 rounded-b-2xl px-3 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-3 shadow-xl select-none touch-none"
        style={{ touchAction: 'none' }}
      >
        {/* LEFT SIDE: Left & Right Directional Thumb Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault()
              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {}
              handleTouchControl('left', true)
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              handleTouchControl('left', false)
            }}
            onPointerCancel={() => handleTouchControl('left', false)}
            onPointerLeave={(e) => {
              if (e.buttons === 0) handleTouchControl('left', false)
            }}
            className={`${
              touchButtonScale === 'large'
                ? 'w-15 h-14 sm:w-20 sm:h-16'
                : 'w-13 h-12 sm:w-16 sm:h-14'
            } rounded-2xl border-2 font-black text-sm sm:text-base flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
              touchVisualState.left
                ? 'bg-blue-600 border-cyan-300 text-white scale-95 shadow-[0_0_18px_rgba(59,130,246,0.75)]'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200 shadow-md'
            }`}
            aria-label="تحرك لليسار"
          >
            <span className="text-lg leading-none">◀</span>
            <span className="text-[10px] font-bold text-slate-300 mt-0.5">يسار</span>
          </button>

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault()
              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {}
              handleTouchControl('right', true)
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              handleTouchControl('right', false)
            }}
            onPointerCancel={() => handleTouchControl('right', false)}
            onPointerLeave={(e) => {
              if (e.buttons === 0) handleTouchControl('right', false)
            }}
            className={`${
              touchButtonScale === 'large'
                ? 'w-15 h-14 sm:w-20 sm:h-16'
                : 'w-13 h-12 sm:w-16 sm:h-14'
            } rounded-2xl border-2 font-black text-sm sm:text-base flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
              touchVisualState.right
                ? 'bg-blue-600 border-cyan-300 text-white scale-95 shadow-[0_0_18px_rgba(59,130,246,0.75)]'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200 shadow-md'
            }`}
            aria-label="تحرك لليمين"
          >
            <span className="text-lg leading-none">▶</span>
            <span className="text-[10px] font-bold text-slate-300 mt-0.5">يمين</span>
          </button>
        </div>

        {/* CENTER HINT (Desktop Keyboard Guide) */}
        <div dir="rtl" className="hidden lg:flex flex-col items-center text-center text-[11px] text-slate-400">
          <div className="font-bold text-slate-300">
            لوحة المفاتيح: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">A</kbd>{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">D</kbd> أو الأسهم للحركة •{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">Space</kbd> قفز / قفز مزدوج •{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono">Shift</kbd> اندفاع (Dash) •{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-yellow-300 font-mono">E</kbd> هجوم ضوئي
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            اجمع الأسلاك ولمبات LED والسبوت لايت والإنترفون لتفعيل القدرات الخاصة!
          </div>
        </div>

        {/* RIGHT SIDE: Light Pulse Attack + Dash + Prominent Jump Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Light Bulb Pulse Attack Button */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault()
              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {}
              handleTouchControl('attack', true)
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              handleTouchControl('attack', false)
            }}
            onPointerCancel={() => handleTouchControl('attack', false)}
            onPointerLeave={(e) => {
              if (e.buttons === 0) handleTouchControl('attack', false)
            }}
            className={`${
              touchButtonScale === 'large'
                ? 'w-13 h-14 sm:w-15 sm:h-16'
                : 'w-12 h-12 sm:w-14 sm:h-14'
            } rounded-2xl border-2 font-black flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
              touchVisualState.attack
                ? 'bg-yellow-400 border-white text-slate-950 scale-95 shadow-[0_0_18px_rgba(250,204,21,0.85)]'
                : 'bg-slate-900/90 hover:bg-slate-800 border-yellow-500/40 text-yellow-300 shadow-md'
            }`}
            aria-label="هجوم ومضة اللمبة"
          >
            <Lightbulb className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-bold mt-0.5">ومضة</span>
          </button>

          {/* Dash Button (Shift / Mobile Dash) */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault()
              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {}
              handleTouchControl('dash', true)
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              handleTouchControl('dash', false)
            }}
            onPointerCancel={() => handleTouchControl('dash', false)}
            onPointerLeave={(e) => {
              if (e.buttons === 0) handleTouchControl('dash', false)
            }}
            className={`${
              touchButtonScale === 'large'
                ? 'w-14 h-14 sm:w-16 sm:h-16'
                : 'w-12 h-12 sm:w-14 sm:h-14'
            } rounded-2xl border-2 font-black flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
              touchVisualState.dash
                ? 'bg-cyan-500 border-white text-slate-950 scale-95 shadow-[0_0_18px_rgba(6,182,212,0.8)]'
                : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-500/40 text-cyan-300 shadow-md'
            }`}
            aria-label="اندفاع سريع"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-bold mt-0.5">اندفاع</span>
          </button>

          {/* Primary Prominent Jump / Double Jump Button */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault()
              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {}
              handleTouchControl('jump', true)
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              handleTouchControl('jump', false)
            }}
            onPointerCancel={() => handleTouchControl('jump', false)}
            onPointerLeave={(e) => {
              if (e.buttons === 0) handleTouchControl('jump', false)
            }}
            className={`${
              touchButtonScale === 'large'
                ? 'w-18 h-14 sm:w-24 sm:h-16'
                : 'w-16 h-12 sm:w-20 sm:h-14'
            } rounded-2xl border-2 font-black flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
              touchVisualState.jump
                ? 'bg-amber-400 border-white text-slate-950 scale-95 shadow-[0_0_22px_rgba(251,191,36,0.9)]'
                : 'bg-gradient-to-t from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 border-amber-200 text-slate-950 shadow-lg'
            }`}
            aria-label="قفز"
          >
            <span className="text-base sm:text-lg leading-none font-black">▲ قفز</span>
            <span className="text-[9px] font-extrabold opacity-80 mt-0.5">قفز مزدوج</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          05. STAGE SELECTION & ACHIEVEMENTS MODAL (8 LEVELS + ACHIEVEMENTS)
          ===================================================================== */}
      {showStageSelectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1628] border border-blue-500/40 rounded-3xl w-full max-w-3xl p-5 sm:p-6 shadow-2xl text-right max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  اختيار المرحلة والإنجازات — المراحل الثماني (1–8)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStageSelectModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
              {GAME_STAGES.map((stg, idx) => {
                const isUnlocked = idx <= progression.unlockedStageIndex
                const stars = progression.stageStarsEarned[stg.id] || 0
                const high = progression.bestStageScores[stg.id] || 0
                const bestTime = progression.bestStageTimesSec[stg.id]
                return (
                  <div
                    key={stg.id}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                      isUnlocked
                        ? 'bg-slate-900/90 border-blue-500/35 hover:border-amber-400/60'
                        : 'bg-slate-950/60 border-slate-800 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-cyan-300 text-[10px] font-black">
                          المرحلة {stg.worldNumber}: {stg.difficultyAr}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-white mb-0.5">
                        {stg.worldTitleAr}
                      </h4>
                      <p className="text-[11px] text-amber-300/90 font-semibold mb-1">
                        🎯 {stg.finalChallengeAr}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">{stg.subtitleAr}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] text-slate-400 font-mono space-x-2 space-x-reverse">
                        <span>
                          النقاط: <strong className="text-amber-300">{high}</strong>
                        </span>
                        {bestTime && (
                          <span>
                            • أسرع زمن: <strong className="text-emerald-300">{bestTime}s</strong>
                          </span>
                        )}
                      </div>
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => startAdventure(idx)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer"
                        >
                          العب الآن
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> مغلق
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Achievements Strip */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-xs font-extrabold text-amber-300 mb-2">
                🏅 إنجازات بطل الإنارة ({progression.achievements.length} / {GAME_ACHIEVEMENTS.length})
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {GAME_ACHIEVEMENTS.map((ach) => {
                  const earned = progression.achievements.includes(ach.id)
                  return (
                    <div
                      key={ach.id}
                      className={`p-2 rounded-xl border text-right ${
                        earned
                          ? 'bg-amber-500/15 border-amber-400/50 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="text-xs font-black truncate">
                        {ach.icon} {ach.titleAr}
                      </div>
                      <div className="text-[10px] opacity-80 leading-tight mt-0.5">{ach.descAr}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          06. SETTINGS MODAL (Separate Music & SFX Volume + Reduced Motion)
          ===================================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1628] border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-black text-white">الإعدادات والصوت</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Master Mute Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="text-sm font-bold text-white">تشغيل الصوت العام</div>
                  <div className="text-xs text-slate-400">تفعيل أو كتم كافة الأصوات والموسيقى</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isMuted
                    setIsMuted(next)
                    sound.setMuted(next)
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer ${
                    !isMuted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {!isMuted ? 'مفعّل' : 'مكتوم'}
                </button>
              </div>

              {/* Separate Music Volume Control (Section 9) */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-white">مستوى صوت الموسيقى التصويرية</span>
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

              {/* Separate SFX Volume Control (Section 9) */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-white">مستوى المؤثرات الصوتية (SFX)</span>
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

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="text-sm font-bold text-white">تقليل الحركة والمؤثرات</div>
                  <div className="text-xs text-slate-400">تخفيف اهتزاز الكاميرا والجزيئات</div>
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
                  className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer ${
                    reducedMotion ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {reducedMotion ? 'مفعّل' : 'عادي'}
                </button>
              </div>

              {/* Mobile Touch Buttons Size */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="text-sm font-bold text-white">حجم أزرار اللمس للهاتف</div>
                  <div className="text-xs text-slate-400">تكبير أزرار الحركة والقفز والاندفاع</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = touchButtonScale === 'large' ? 'normal' : 'large'
                    setTouchButtonScale(next)
                    try {
                      localStorage.setItem('enarah_platformer_touch_scale', next)
                    } catch {}
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  {touchButtonScale === 'large' ? 'كبير (موصى به)' : 'قياسي'}
                </button>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800">
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

      {/* =====================================================================
          07. WEEKLY LEADERBOARD MODAL
          ===================================================================== */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121316] border border-amber-500/40 rounded-3xl w-full max-w-lg p-5 shadow-2xl relative text-right flex flex-col max-h-[88vh]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <button
                type="button"
                onClick={() => setShowLeaderboard(false)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
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
                (leaderboardTab === 'current' ? leaderboard : previousWeekBoard).map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl border bg-zinc-900/70 border-zinc-800"
                  >
                    <div className="text-left">
                      <div className="text-xs font-black text-amber-400">{item.score} نقطة</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{item.timeTakenSec} ثانية</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-zinc-400">{item.city}</div>
                      </div>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs bg-amber-500 text-black">
                        {idx + 1}
                      </div>
                    </div>
                  </div>
                ))
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
    </div>
  )
}
