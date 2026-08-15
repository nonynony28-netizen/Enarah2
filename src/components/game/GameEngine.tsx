import React, { useEffect, useRef, useState, useCallback } from 'react'
import { sound } from './audio'
import { Sparkles, Zap, Lightbulb, Volume2, VolumeX, RotateCcw, Trophy, CheckCircle, ArrowRight, Play, Award, Flame, Lock, Unlock, Compass, AlertTriangle, ShieldAlert } from 'lucide-react'

export interface Hazard {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  type: 'patrol' | 'vortex'
  minX?: number
  maxX?: number
  minY?: number
  maxY?: number
}

export interface Gate {
  id: number
  x: number
  y: number
  w: number
  h: number
  isOpen: boolean
  requiredLamps?: number
  requiredWires?: number
  labelAr: string
}

export interface LevelData {
  id: number
  nameAr: string
  nameEn: string
  subtitleAr: string
  difficultyBadge: string
  heroSkinName: string
  stars: number
  theme: 'street' | 'villa' | 'tower' | 'showroom'
  width: number
  height: number
  walls: { x: number; y: number; w: number; h: number }[]
  lamps: { id: number; x: number; y: number; isLit: boolean; name: string }[]
  sparks: { id: number; x: number; y: number; collected: boolean; type: 'spark' | 'wire' | 'spotlight' }[]
  hazards: Hazard[]
  gates: Gate[]
  masterSwitch: { x: number; y: number; isActivated: boolean }
  heroStart: { x: number; y: number }
  initialLight: number
}

const LEVELS: LevelData[] = [
  // ==========================================
  // LEVEL 1: الشارع وحي الليثي (اللمبة الكلاسيكية LED)
  // ==========================================
  {
    id: 1,
    nameAr: 'المرحلة 1: حي الليثي - بنغازي',
    nameEn: 'Level 1: Al-Laythi District',
    subtitleAr: 'اجمع كافة كابلات النحاس والشرارات وأنر جميع أعمدة الشارع لتشغيل القاطع الرئيسي!',
    difficultyBadge: 'سهل',
    heroSkinName: 'لمبة LED الكلاسيكية 💡',
    stars: 1,
    theme: 'street',
    width: 900,
    height: 600,
    heroStart: { x: 80, y: 300 },
    initialLight: 150,
    walls: [
      { x: 0, y: 0, w: 900, h: 20 },
      { x: 0, y: 580, w: 900, h: 20 },
      { x: 0, y: 0, w: 20, h: 600 },
      { x: 880, y: 0, w: 20, h: 600 },
      { x: 180, y: 20, w: 30, h: 220 },
      { x: 180, y: 360, w: 30, h: 220 },
      { x: 380, y: 150, w: 30, h: 300 },
      { x: 560, y: 20, w: 30, h: 200 },
      { x: 560, y: 380, w: 30, h: 200 },
      { x: 700, y: 200, w: 30, h: 200 },
    ],
    lamps: [
      { id: 1, x: 100, y: 100, isLit: false, name: 'عمود إنارة شارع 1' },
      { id: 2, x: 100, y: 500, isLit: false, name: 'عمود إنارة شارع 2' },
      { id: 3, x: 280, y: 300, isLit: false, name: 'كشاف واجهة الليثي' },
      { id: 4, x: 480, y: 100, isLit: false, name: 'مصباح الحديقة' },
      { id: 5, x: 480, y: 500, isLit: false, name: 'عمود مدخل المعرض' },
      { id: 6, x: 780, y: 300, isLit: false, name: 'برج الإنارة الرئيسي' },
    ],
    sparks: [
      { id: 1, x: 120, y: 200, collected: false, type: 'spark' },
      { id: 2, x: 120, y: 400, collected: false, type: 'spark' },
      { id: 3, x: 280, y: 120, collected: false, type: 'wire' },
      { id: 4, x: 280, y: 480, collected: false, type: 'spark' },
      { id: 5, x: 480, y: 250, collected: false, type: 'wire' },
      { id: 6, x: 480, y: 350, collected: false, type: 'spotlight' },
      { id: 7, x: 640, y: 120, collected: false, type: 'spark' },
      { id: 8, x: 640, y: 480, collected: false, type: 'wire' },
      { id: 9, x: 780, y: 150, collected: false, type: 'spotlight' },
      { id: 10, x: 780, y: 450, collected: false, type: 'spark' },
    ],
    hazards: [],
    gates: [],
    masterSwitch: { x: 830, y: 300, isActivated: false },
  },

  // ==========================================
  // LEVEL 2: الفيلا المعمارية (اللمبة الكريستالية الفاخرة)
  // ==========================================
  {
    id: 2,
    nameAr: 'المرحلة 2: الفيلا المعمارية الفاخرة',
    nameEn: 'Level 2: The Luxury Villa',
    subtitleAr: 'أنر 3 ثريات لفتح بوابة الليزر، واحذر دوامات الطاقة! يجب جمع كل شيء لتشغيل المولد.',
    difficultyBadge: 'متوسط',
    heroSkinName: 'اللمبة الكريستالية الملكية 💎',
    stars: 2,
    theme: 'villa',
    width: 950,
    height: 650,
    heroStart: { x: 90, y: 325 },
    initialLight: 135,
    walls: [
      { x: 0, y: 0, w: 950, h: 20 },
      { x: 0, y: 630, w: 950, h: 20 },
      { x: 0, y: 0, w: 20, h: 650 },
      { x: 930, y: 0, w: 20, h: 650 },
      { x: 220, y: 20, w: 20, h: 220 },
      { x: 220, y: 410, w: 20, h: 220 },
      { x: 220, y: 220, w: 220, h: 20 },
      { x: 220, y: 410, w: 220, h: 20 },
      { x: 540, y: 120, w: 20, h: 410 },
      { x: 720, y: 20, w: 20, h: 230 },
      { x: 720, y: 400, w: 20, h: 230 },
    ],
    lamps: [
      { id: 1, x: 120, y: 120, isLit: false, name: 'ثريا المدخل الملكي' },
      { id: 2, x: 120, y: 520, isLit: false, name: 'إنارة المجلس الرئيسي' },
      { id: 3, x: 380, y: 120, isLit: false, name: 'إضاءة الصالون المخفية' },
      { id: 4, x: 380, y: 520, isLit: false, name: 'ثريا المائدة الكريستال' },
      { id: 5, x: 630, y: 325, isLit: false, name: 'سبوت لايت الممر الدائري' },
      { id: 6, x: 820, y: 140, isLit: false, name: 'إضاءة غرفة الماستر' },
      { id: 7, x: 820, y: 510, isLit: false, name: 'إنارة التراس والواجهة' },
    ],
    sparks: [
      { id: 1, x: 120, y: 250, collected: false, type: 'spark' },
      { id: 2, x: 120, y: 400, collected: false, type: 'wire' },
      { id: 3, x: 380, y: 325, collected: false, type: 'spotlight' },
      { id: 4, x: 300, y: 120, collected: false, type: 'spark' },
      { id: 5, x: 300, y: 520, collected: false, type: 'wire' },
      { id: 6, x: 460, y: 120, collected: false, type: 'spotlight' },
      { id: 7, x: 460, y: 520, collected: false, type: 'spark' },
      { id: 8, x: 630, y: 180, collected: false, type: 'wire' },
      { id: 9, x: 630, y: 470, collected: false, type: 'spotlight' },
      { id: 10, x: 770, y: 220, collected: false, type: 'spark' },
      { id: 11, x: 770, y: 430, collected: false, type: 'wire' },
      { id: 12, x: 870, y: 325, collected: false, type: 'spotlight' },
    ],
    gates: [
      { id: 1, x: 720, y: 250, w: 20, h: 150, isOpen: false, requiredLamps: 3, labelAr: 'مغلقة: أنر 3 ثريات لفتحها' },
    ],
    hazards: [
      { id: 1, x: 380, y: 325, vx: 0, vy: 1.2, radius: 24, type: 'vortex', minY: 260, maxY: 390 },
      { id: 2, x: 630, y: 250, vx: 0, vy: -1.2, radius: 24, type: 'vortex', minY: 150, maxY: 500 },
    ],
    masterSwitch: { x: 880, y: 325, isActivated: false },
  },

  // ==========================================
  // LEVEL 3: برج المدينة الذكي (اللمبة السايبر الذكية)
  // ==========================================
  {
    id: 3,
    nameAr: 'المرحلة 3: برج المدينة الذكي',
    nameEn: 'Level 3: The Smart City Tower',
    subtitleAr: 'احذر شحنات الحمل الزائد (ملامستها تعيد المرحلة)! اجمع كل المواد لتفعيل النظام المركزي.',
    difficultyBadge: 'تحدي قوي',
    heroSkinName: 'اللمبة الذكية السايبر ⚡',
    stars: 3,
    theme: 'tower',
    width: 1000,
    height: 700,
    heroStart: { x: 80, y: 350 },
    initialLight: 125,
    walls: [
      { x: 0, y: 0, w: 1000, h: 20 },
      { x: 0, y: 680, w: 1000, h: 20 },
      { x: 0, y: 0, w: 20, h: 700 },
      { x: 980, y: 0, w: 20, h: 700 },
      { x: 180, y: 120, w: 40, h: 200 },
      { x: 180, y: 380, w: 40, h: 200 },
      { x: 380, y: 20, w: 40, h: 250 },
      { x: 380, y: 430, w: 40, h: 250 },
      { x: 580, y: 160, w: 40, h: 380 },
      { x: 780, y: 20, w: 40, h: 260 },
      { x: 780, y: 420, w: 40, h: 260 },
    ],
    lamps: [
      { id: 1, x: 100, y: 120, isLit: false, name: 'سيرفر الطابق 1' },
      { id: 2, x: 100, y: 580, isLit: false, name: 'سيرفر الطابق 2' },
      { id: 3, x: 280, y: 350, isLit: false, name: 'إنارة البهو الزجاجي' },
      { id: 4, x: 480, y: 120, isLit: false, name: 'كشافات الواجهة' },
      { id: 5, x: 480, y: 580, isLit: false, name: 'مفاتيح اللمس الذكية' },
      { id: 6, x: 680, y: 350, isLit: false, name: 'منظومة الطاقة المركزية' },
      { id: 7, x: 880, y: 150, isLit: false, name: 'إنارة مهبط الهليكوبتر' },
      { id: 8, x: 880, y: 550, isLit: false, name: 'برج البث الضوئي' },
    ],
    sparks: [
      { id: 1, x: 100, y: 250, collected: false, type: 'spark' },
      { id: 2, x: 100, y: 450, collected: false, type: 'wire' },
      { id: 3, x: 280, y: 150, collected: false, type: 'spotlight' },
      { id: 4, x: 280, y: 550, collected: false, type: 'spark' },
      { id: 5, x: 480, y: 250, collected: false, type: 'wire' },
      { id: 6, x: 480, y: 450, collected: false, type: 'spotlight' },
      { id: 7, x: 680, y: 150, collected: false, type: 'spark' },
      { id: 8, x: 680, y: 550, collected: false, type: 'wire' },
      { id: 9, x: 880, y: 250, collected: false, type: 'spotlight' },
      { id: 10, x: 880, y: 450, collected: false, type: 'spark' },
      { id: 11, x: 940, y: 200, collected: false, type: 'wire' },
      { id: 12, x: 940, y: 500, collected: false, type: 'spotlight' },
    ],
    gates: [
      { id: 1, x: 780, y: 280, w: 40, h: 140, isOpen: false, requiredLamps: 4, labelAr: 'مغلقة: أنر 4 محطات لفتحها' },
    ],
    hazards: [
      { id: 1, x: 280, y: 180, vx: 0, vy: 2.2, radius: 14, type: 'patrol', minY: 80, maxY: 620 },
      { id: 2, x: 480, y: 520, vx: 0, vy: -2.5, radius: 14, type: 'patrol', minY: 80, maxY: 620 },
      { id: 3, x: 680, y: 200, vx: 0, vy: 2.8, radius: 14, type: 'patrol', minY: 80, maxY: 620 },
    ],
    masterSwitch: { x: 930, y: 350, isActivated: false },
  },

  // ==========================================
  // LEVEL 4: المعرض الرئيسي (اللمبة الذهبية الملكية VIP)
  // ==========================================
  {
    id: 4,
    nameAr: 'المرحلة 4: المعرض الرئيسي للإنارة الحديثة',
    nameEn: 'Level 4: Grand Flagship Showroom',
    subtitleAr: 'المرحلة الأسطورية! اجمع جميع المواد وأنر كافة الثريات لتشغيل الإنارة الشاملة.',
    difficultyBadge: 'مرحلة ذهبية أسطورية',
    heroSkinName: 'اللمبة الذهبية الملكية VIP 👑',
    stars: 4,
    theme: 'showroom',
    width: 1050,
    height: 720,
    heroStart: { x: 80, y: 360 },
    initialLight: 120,
    walls: [
      { x: 0, y: 0, w: 1050, h: 20 },
      { x: 0, y: 700, w: 1050, h: 20 },
      { x: 0, y: 0, w: 20, h: 720 },
      { x: 1030, y: 0, w: 20, h: 720 },
      { x: 200, y: 100, w: 50, h: 180 },
      { x: 200, y: 440, w: 50, h: 180 },
      { x: 420, y: 20, w: 40, h: 280 },
      { x: 420, y: 420, w: 40, h: 280 },
      { x: 640, y: 120, w: 50, h: 220 },
      { x: 640, y: 380, w: 50, h: 220 },
      { x: 850, y: 20, w: 40, h: 260 },
      { x: 850, y: 440, w: 40, h: 260 },
    ],
    lamps: [
      { id: 1, x: 100, y: 120, isLit: false, name: 'جناح الثريات الإيطالية' },
      { id: 2, x: 100, y: 600, isLit: false, name: 'منصة مفاتيح اللمس الفاخرة' },
      { id: 3, x: 310, y: 200, isLit: false, name: 'استوديو الإضاءة الذكية' },
      { id: 4, x: 310, y: 520, isLit: false, name: 'جناح إنارة الواجهات والحدائق' },
      { id: 5, x: 530, y: 360, isLit: false, name: 'الثريا الكريستال العملاقة' },
      { id: 6, x: 740, y: 180, isLit: false, name: 'منظومة الإنترفون المرئي' },
      { id: 7, x: 740, y: 540, isLit: false, name: 'جناح الكابلات المعتمدة' },
      { id: 8, x: 940, y: 180, isLit: false, name: 'منصة التحكم المركزي VIP' },
      { id: 9, x: 940, y: 540, isLit: false, name: 'كشافات ليلة الافتتاح' },
    ],
    sparks: [
      { id: 1, x: 100, y: 260, collected: false, type: 'wire' },
      { id: 2, x: 100, y: 460, collected: false, type: 'wire' },
      { id: 3, x: 310, y: 100, collected: false, type: 'spark' },
      { id: 4, x: 310, y: 360, collected: false, type: 'spotlight' },
      { id: 5, x: 310, y: 620, collected: false, type: 'spark' },
      { id: 6, x: 530, y: 180, collected: false, type: 'wire' },
      { id: 7, x: 530, y: 540, collected: false, type: 'wire' },
      { id: 8, x: 740, y: 100, collected: false, type: 'spotlight' },
      { id: 9, x: 740, y: 360, collected: false, type: 'wire' },
      { id: 10, x: 740, y: 620, collected: false, type: 'spotlight' },
      { id: 11, x: 940, y: 360, collected: false, type: 'spotlight' },
    ],
    gates: [
      { id: 1, x: 850, y: 280, w: 40, h: 160, isOpen: false, requiredWires: 4, labelAr: 'مغلقة: اجمع 4 كابلات نحاس' },
    ],
    hazards: [
      { id: 1, x: 310, y: 360, vx: 1.8, vy: 0, radius: 15, type: 'patrol', minX: 260, maxX: 370 },
      { id: 2, x: 530, y: 220, vx: 0, vy: 2.2, radius: 15, type: 'patrol', minY: 100, maxY: 620 },
      { id: 3, x: 740, y: 500, vx: 0, vy: -2.2, radius: 15, type: 'patrol', minY: 100, maxY: 620 },
    ],
    masterSwitch: { x: 970, y: 360, isActivated: false },
  },
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  alpha: number
  life: number
  maxLife: number
}

export const GameEngine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Game state
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'level_won' | 'game_won'>('intro')
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(1)
  const [lightPower, setLightPower] = useState(140)
  const [isMuted, setIsMuted] = useState(false)
  const [lampsLitCount, setLampsLitCount] = useState(0)
  const [totalLampsCount, setTotalLampsCount] = useState(0)
  const [collectedSparksCount, setCollectedSparksCount] = useState(0)
  const [totalSparksCount, setTotalSparksCount] = useState(0)
  const [bannerAlert, setBannerAlert] = useState<{ msg: string; type: 'info' | 'error' | 'success' } | null>(null)

  // Current active level clone
  const levelRef = useRef<LevelData>(JSON.parse(JSON.stringify(LEVELS[0])))

  // Hero state
  const heroRef = useRef({
    x: 80,
    y: 300,
    vx: 0,
    vy: 0,
    radius: 18,
    speed: 3.8,
    facing: 'left' as 'left' | 'right' | 'up' | 'down',
    walkCycle: 0,
    blinkTimer: 0,
    isMoving: false,
    invincibleTimer: 0,
  })

  // Particles
  const particlesRef = useRef<Particle[]>([])

  // Touch controls input state
  const keysRef = useRef<{ [key: string]: boolean }>({})
  const touchInputRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Initialize level
  const loadLevel = useCallback((levelIndex: number) => {
    const raw = LEVELS[levelIndex]
    const cloned: LevelData = JSON.parse(JSON.stringify(raw))
    levelRef.current = cloned
    heroRef.current.x = cloned.heroStart.x
    heroRef.current.y = cloned.heroStart.y
    heroRef.current.vx = 0
    heroRef.current.vy = 0
    heroRef.current.invincibleTimer = 0
    setLampsLitCount(0)
    setTotalLampsCount(cloned.lamps.length)
    setCollectedSparksCount(0)
    setTotalSparksCount(cloned.sparks.length)
    setLightPower(cloned.initialLight)
    particlesRef.current = []
  }, [])

  // Start game
  const startGame = (levelIdx = 0) => {
    setCurrentLevelIdx(levelIdx)
    loadLevel(levelIdx)
    if (levelIdx === 0) setScore(0)
    setCombo(1)
    setBannerAlert(null)
    setGameState('playing')
  }

  // Next level
  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      const nextIdx = currentLevelIdx + 1
      setCurrentLevelIdx(nextIdx)
      loadLevel(nextIdx)
      setGameState('playing')
    } else {
      setGameState('game_won')
      sound.playVictory()
    }
  }

  // Handle Mute toggle
  const toggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    sound.isMuted = nextMuted
  }

  // Show temporary banner alert
  const showAlert = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setBannerAlert({ msg, type })
    setTimeout(() => setBannerAlert(null), 3500)
  }

  // Reset stage upon injury
  const handleHeroInjured = () => {
    sound.playShortCircuit()
    spawnParticles(heroRef.current.x, heroRef.current.y, '#ef4444', 35, 3)
    showAlert('💥 تماس كهربائي شديد! انقطع التيار وأعيدت المرحلة من البداية!', 'error')
    
    // Quick reload stage
    setTimeout(() => {
      loadLevel(currentLevelIdx)
    }, 400)
  }

  // Spawn visual particles
  const spawnParticles = (x: number, y: number, color: string, count = 12, speedMult = 1) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = (Math.random() * 3 + 1) * speedMult
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 3.5 + 1.5,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 30 + 20,
      })
    }
  }

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Touch D-Pad directional handlers
  const handleTouchDir = (dx: number, dy: number) => {
    touchInputRef.current = { x: dx, y: dy }
  }

  const handleTouchEnd = () => {
    touchInputRef.current = { x: 0, y: 0 }
  }

  // Calculate remaining uncollected items & unlit lamps
  const remainingLamps = levelRef.current.lamps.filter((l) => !l.isLit).length
  const remainingSparks = levelRef.current.sparks.filter((s) => !s.collected).length
  const totalRemaining = remainingLamps + remainingSparks
  const isStage100PercentComplete = totalRemaining === 0

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    let animationFrameId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastTime = performance.now()

    const gameLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      const level = levelRef.current
      const hero = heroRef.current

      if (gameState === 'playing') {
        if (hero.invincibleTimer > 0) {
          hero.invincibleTimer -= dt
        }

        // 1. Process Input (Keyboard + Touch D-Pad)
        let moveX = 0
        let moveY = 0

        if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) moveX += 1
        if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) moveX -= 1
        if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) moveY -= 1
        if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) moveY += 1

        // Add touch input
        if (touchInputRef.current.x !== 0 || touchInputRef.current.y !== 0) {
          moveX += touchInputRef.current.x
          moveY += touchInputRef.current.y
        }

        // Normalize diagonal speed
        const length = Math.hypot(moveX, moveY)
        if (length > 0) {
          moveX = (moveX / length) * hero.speed
          moveY = (moveY / length) * hero.speed
          hero.isMoving = true
          hero.walkCycle += dt * 14

          if (Math.abs(moveX) > Math.abs(moveY)) {
            hero.facing = moveX > 0 ? 'right' : 'left'
          } else {
            hero.facing = moveY > 0 ? 'down' : 'up'
          }
        } else {
          hero.isMoving = false
        }

        // 2. Collision with Walls and Closed Laser Gates
        const newX = hero.x + moveX
        const newY = hero.y + moveY
        let canMoveX = true
        let canMoveY = true

        const obstacles = [
          ...level.walls,
          ...level.gates.filter((g) => !g.isOpen).map((g) => ({ x: g.x, y: g.y, w: g.w, h: g.h })),
        ]

        for (const wall of obstacles) {
          if (
            newX + hero.radius > wall.x &&
            newX - hero.radius < wall.x + wall.w &&
            hero.y + hero.radius > wall.y &&
            hero.y - hero.radius < wall.y + wall.h
          ) {
            canMoveX = false
          }
          if (
            hero.x + hero.radius > wall.x &&
            hero.x - hero.radius < wall.x + wall.w &&
            newY + hero.radius > wall.y &&
            newY - hero.radius < wall.y + wall.h
          ) {
            canMoveY = false
          }
        }

        if (canMoveX) hero.x = newX
        if (canMoveY) hero.y = newY

        // 3. Update Hazards & Trigger Stage Restart on Hit
        for (const h of level.hazards) {
          h.x += h.vx
          h.y += h.vy

          // Bounce within bounds
          if (h.minX !== undefined && (h.x <= h.minX || h.x >= h.maxX!)) h.vx *= -1
          if (h.minY !== undefined && (h.y <= h.minY || h.y >= h.maxY!)) h.vy *= -1

          // Collision with Hero -> RESTART LEVEL!
          const hDist = Math.hypot(hero.x - h.x, hero.y - h.y)
          if (hDist < hero.radius + h.radius && hero.invincibleTimer <= 0) {
            handleHeroInjured()
            break
          }
        }

        // 4. Collect Sparks & Powerups
        for (const spark of level.sparks) {
          if (!spark.collected) {
            const dist = Math.hypot(hero.x - spark.x, hero.y - spark.y)
            if (dist < hero.radius + 16) {
              spark.collected = true
              setCollectedSparksCount((prev) => prev + 1)
              
              if (spark.type === 'wire') {
                sound.playWire()
                setScore((prev) => prev + 150 * combo)
                
                // Check if any wire-gated doors open
                const collectedWires = level.sparks.filter((s) => s.type === 'wire' && s.collected).length
                for (const g of level.gates) {
                  if (!g.isOpen && g.requiredWires && collectedWires >= g.requiredWires) {
                    g.isOpen = true
                    sound.playGateOpen()
                    spawnParticles(g.x + g.w / 2, g.y + g.h / 2, '#10b981', 30, 2)
                    showAlert('🔓 رائع! تم فتح بوابة الليزر بعد جمع الكابلات المطلوبة!', 'success')
                  }
                }
                setLightPower((prev) => Math.min(prev + 22, 280))
                spawnParticles(spark.x, spark.y, '#f59e0b', 16, 1.2)
              } else if (spark.type === 'spotlight') {
                sound.playSpark()
                setScore((prev) => prev + 200 * combo)
                setLightPower((prev) => Math.min(prev + 30, 300))
                spawnParticles(spark.x, spark.y, '#38bdf8', 18, 1.4)
              } else {
                sound.playSpark()
                setScore((prev) => prev + 50 * combo)
                setLightPower((prev) => Math.min(prev + 10, 260))
                spawnParticles(spark.x, spark.y, '#fde047', 12, 1)
              }
            }
          }
        }

        // 5. Light up Dark Lamps
        for (const lamp of level.lamps) {
          if (!lamp.isLit) {
            const dist = Math.hypot(hero.x - lamp.x, hero.y - lamp.y)
            if (dist < hero.radius + 35) {
              lamp.isLit = true
              sound.playLampOn()
              setScore((prev) => prev + 300 * combo)
              setLampsLitCount((prev) => {
                const nextCount = prev + 1
                for (const g of level.gates) {
                  if (!g.isOpen && g.requiredLamps && nextCount >= g.requiredLamps) {
                    g.isOpen = true
                    sound.playGateOpen()
                    spawnParticles(g.x + g.w / 2, g.y + g.h / 2, '#10b981', 30, 2)
                    showAlert('🔓 تم فك قفل بوابة الأمان بنجاح!', 'success')
                  }
                }
                return nextCount
              })
              spawnParticles(lamp.x, lamp.y, '#60a5fa', 24, 1.8)
            }
          }
        }

        // 6. Check Master Switchboard (Only Activates if 100% Collected!)
        const masterDist = Math.hypot(hero.x - level.masterSwitch.x, hero.y - level.masterSwitch.y)
        if (masterDist < hero.radius + 32 && !level.masterSwitch.isActivated) {
          const currentRemainingLamps = level.lamps.filter((l) => !l.isLit).length
          const currentRemainingSparks = level.sparks.filter((s) => !s.collected).length
          const totalLeft = currentRemainingLamps + currentRemainingSparks

          if (totalLeft > 0) {
            // Can NOT complete level yet!
            sound.playLockedBuzz()
            showAlert(`⚠️ القاطع مقفل! يجب إنارة كافة المصابيح وجمع جميع كابلات النحاس وشرارات الطاقة أولاً! (متبقي: ${totalLeft})`, 'error')
            // Slight push away so sound does not loop
            hero.x -= moveX * 4
            hero.y -= moveY * 4
          } else {
            // 100% COMPLETE -> ACTIVATE MASTER SWITCH!
            level.masterSwitch.isActivated = true
            sound.playMasterSwitch()
            setScore((prev) => prev + 1500)
            spawnParticles(level.masterSwitch.x, level.masterSwitch.y, '#10b981', 60, 3.5)

            setTimeout(() => {
              sound.playVictory()
              if (currentLevelIdx < LEVELS.length - 1) {
                setGameState('level_won')
              } else {
                setGameState('game_won')
              }
            }, 800)
          }
        }
      }

      // 7. Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]
        p.x += p.vx
        p.y += p.vy
        p.life++
        p.alpha = 1 - p.life / p.maxLife
        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1)
        }
      }

      // ==========================================
      // CANVAS RENDERING (Theme-Specific Styles)
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Theme Backgrounds
      if (level.theme === 'street') {
        ctx.fillStyle = '#090b10'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.15)'
        ctx.lineWidth = 2
        ctx.setLineDash([20, 20])
        ctx.beginPath()
        ctx.moveTo(20, 300)
        ctx.lineTo(canvas.width - 20, 300)
        ctx.stroke()
        ctx.setLineDash([])
      } else if (level.theme === 'villa') {
        ctx.fillStyle = '#0a0d14'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
        ctx.lineWidth = 1
        const tileSize = 50
        for (let x = 0; x < canvas.width; x += tileSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y < canvas.height; y += tileSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      } else if (level.theme === 'tower') {
        ctx.fillStyle = '#05070c'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)'
        ctx.lineWidth = 1.5
        for (let x = 0; x < canvas.width; x += 60) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y < canvas.height; y += 60) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      } else {
        ctx.fillStyle = '#08080a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)'
        ctx.lineWidth = 1.5
        const sz = 45
        for (let x = 0; x < canvas.width; x += sz) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y < canvas.height; y += sz) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }

      // Draw Walls / Obstacles
      ctx.fillStyle = level.theme === 'tower' ? '#0f172a' : level.theme === 'villa' ? '#18181b' : '#111827'
      ctx.strokeStyle = level.theme === 'tower' ? '#0284c7' : level.theme === 'villa' ? '#3f3f46' : '#374151'
      ctx.lineWidth = 2
      for (const wall of level.walls) {
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h)
        ctx.strokeRect(wall.x, wall.y, wall.w, wall.h)
      }

      // Draw Laser Security Gates
      for (const gate of level.gates) {
        ctx.save()
        if (gate.isOpen) {
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'
          ctx.setLineDash([4, 6])
          ctx.lineWidth = 2
          ctx.strokeRect(gate.x, gate.y, gate.w, gate.h)
        } else {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.25)'
          ctx.fillRect(gate.x, gate.y, gate.w, gate.h)
          ctx.strokeStyle = '#ef4444'
          ctx.lineWidth = 3
          ctx.shadowColor = '#ef4444'
          ctx.shadowBlur = 12
          ctx.strokeRect(gate.x, gate.y, gate.w, gate.h)

          ctx.strokeStyle = '#fca5a5'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(gate.x, gate.y + gate.h / 2)
          ctx.lineTo(gate.x + gate.w, gate.y + gate.h / 2)
          ctx.stroke()
        }
        ctx.restore()
      }

      // Draw Hazards (Patrol Bots & Vortices)
      for (const h of level.hazards) {
        ctx.save()
        ctx.translate(h.x, h.y)
        if (h.type === 'patrol') {
          ctx.beginPath()
          ctx.arc(0, 0, h.radius, 0, Math.PI * 2)
          ctx.fillStyle = '#ef4444'
          ctx.shadowColor = '#f87171'
          ctx.shadowBlur = 15
          ctx.fill()
          const orbitAngle = time * 0.008
          ctx.beginPath()
          ctx.arc(Math.cos(orbitAngle) * (h.radius + 6), Math.sin(orbitAngle) * (h.radius + 6), 3, 0, Math.PI * 2)
          ctx.fillStyle = '#fef08a'
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, h.radius, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(147, 51, 234, 0.4)'
          ctx.strokeStyle = '#a855f7'
          ctx.lineWidth = 2
          ctx.shadowColor = '#c084fc'
          ctx.shadowBlur = 16
          ctx.fill()
          ctx.stroke()
        }
        ctx.restore()
      }

      // Draw Sparks & Wire items
      for (const spark of level.sparks) {
        if (!spark.collected) {
          ctx.save()
          ctx.translate(spark.x, spark.y)
          const bounce = Math.sin(time * 0.006 + spark.id) * 3

          if (spark.type === 'wire') {
            ctx.beginPath()
            ctx.arc(0, bounce, 11, 0, Math.PI * 2)
            ctx.fillStyle = '#b45309'
            ctx.fill()
            ctx.strokeStyle = '#f59e0b'
            ctx.lineWidth = 3
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(0, bounce, 4, 0, Math.PI * 2)
            ctx.fillStyle = '#09090b'
            ctx.fill()
          } else if (spark.type === 'spotlight') {
            ctx.beginPath()
            ctx.arc(0, bounce, 10, 0, Math.PI * 2)
            ctx.fillStyle = '#0284c7'
            ctx.fill()
            ctx.strokeStyle = '#38bdf8'
            ctx.lineWidth = 2.5
            ctx.stroke()
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(0, bounce, 3, 0, Math.PI * 2)
            ctx.fill()
          } else {
            ctx.beginPath()
            ctx.arc(0, bounce, 6, 0, Math.PI * 2)
            ctx.fillStyle = '#fde047'
            ctx.shadowColor = '#facc15'
            ctx.shadowBlur = 10
            ctx.fill()
          }
          ctx.restore()
        }
      }

      // Draw Environmental Lamps (Distinct Look Per Level!)
      for (const lamp of level.lamps) {
        ctx.save()
        ctx.translate(lamp.x, lamp.y)

        if (level.theme === 'street') {
          // 1. Street Lantern
          ctx.fillStyle = '#1f2937'
          ctx.fillRect(-3, -12, 6, 24)
          ctx.beginPath()
          ctx.arc(0, -12, 12, 0, Math.PI * 2)
          if (lamp.isLit) {
            ctx.fillStyle = '#facc15'
            ctx.shadowColor = '#eab308'
            ctx.shadowBlur = 25
            ctx.fill()
            ctx.beginPath()
            ctx.arc(0, -12, 5, 0, Math.PI * 2)
            ctx.fillStyle = '#ffffff'
            ctx.fill()
          } else {
            ctx.fillStyle = '#374151'
            ctx.strokeStyle = '#4b5563'
            ctx.lineWidth = 1.5
            ctx.fill()
            ctx.stroke()
          }
        } else if (level.theme === 'villa') {
          // 2. Crystal Chandelier
          ctx.fillStyle = '#d4af37'
          ctx.fillRect(-2, -18, 4, 12)
          ctx.beginPath()
          ctx.moveTo(-14, -6)
          ctx.lineTo(14, -6)
          ctx.lineTo(0, 10)
          ctx.closePath()
          if (lamp.isLit) {
            ctx.fillStyle = '#60a5fa'
            ctx.shadowColor = '#38bdf8'
            ctx.shadowBlur = 28
            ctx.fill()
          } else {
            ctx.fillStyle = '#27272a'
            ctx.strokeStyle = '#52525b'
            ctx.lineWidth = 1.5
            ctx.fill()
            ctx.stroke()
          }
        } else if (level.theme === 'tower') {
          // 3. Cyber IoT Smart Sensor Node
          ctx.beginPath()
          ctx.roundRect(-12, -12, 24, 24, 6)
          if (lamp.isLit) {
            ctx.fillStyle = '#0284c7'
            ctx.strokeStyle = '#38bdf8'
            ctx.lineWidth = 2
            ctx.shadowColor = '#38bdf8'
            ctx.shadowBlur = 24
            ctx.fill()
            ctx.stroke()
            // Blinking cyan core
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(0, 0, 4, 0, Math.PI * 2)
            ctx.fill()
          } else {
            ctx.fillStyle = '#0f172a'
            ctx.strokeStyle = '#334155'
            ctx.lineWidth = 1.5
            ctx.fill()
            ctx.stroke()
          }
        } else {
          // 4. Golden Showroom Multi-Ring Chandelier
          ctx.beginPath()
          ctx.arc(0, 0, 14, 0, Math.PI * 2)
          if (lamp.isLit) {
            ctx.strokeStyle = '#f59e0b'
            ctx.lineWidth = 3
            ctx.fillStyle = '#fef08a'
            ctx.shadowColor = '#facc15'
            ctx.shadowBlur = 30
            ctx.fill()
            ctx.stroke()
          } else {
            ctx.strokeStyle = '#713f12'
            ctx.lineWidth = 2
            ctx.fillStyle = '#1c1917'
            ctx.fill()
            ctx.stroke()
          }
        }

        ctx.restore()
      }

      // Draw Master Switchboard (القاطع الرئيسي)
      ctx.save()
      ctx.translate(level.masterSwitch.x, level.masterSwitch.y)
      
      const isSwitchReady = isStage100PercentComplete
      ctx.fillStyle = '#0f172a'
      ctx.strokeStyle = level.masterSwitch.isActivated ? '#10b981' : isSwitchReady ? '#f59e0b' : '#ef4444'
      ctx.lineWidth = 3
      if (isSwitchReady && !level.masterSwitch.isActivated) {
        ctx.shadowColor = '#f59e0b'
        ctx.shadowBlur = 15
      }
      ctx.fillRect(-18, -25, 36, 50)
      ctx.strokeRect(-18, -25, 36, 50)

      ctx.fillStyle = level.masterSwitch.isActivated ? '#10b981' : isSwitchReady ? '#f59e0b' : '#ef4444'
      if (level.masterSwitch.isActivated) {
        ctx.fillRect(-10, -18, 20, 10)
      } else {
        ctx.fillRect(-10, 8, 20, 10)
      }
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 7.5px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(isSwitchReady ? 'READY' : 'LOCKED', 0, 0)
      ctx.restore()

      // ==========================================
      // DRAW HERO MASCOT (Evolves & Changes in Each Level!)
      // ==========================================
      ctx.save()
      ctx.translate(hero.x, hero.y)

      const bobbing = hero.isMoving ? Math.sin(hero.walkCycle) * 2.5 : Math.sin(time * 0.003) * 1.5
      const lookOffsetX = hero.facing === 'left' ? -2.5 : hero.facing === 'right' ? 2.5 : 0
      const lookOffsetY = hero.facing === 'up' ? -2 : hero.facing === 'down' ? 1.5 : 0

      if (level.theme === 'street') {
        // ------------------------------------------
        // SKIN 1: Classic Warm LED Bulb
        // ------------------------------------------
        ctx.beginPath()
        ctx.arc(0, -14 + bobbing, 15, 0, Math.PI * 2)
        const bulbGrad = ctx.createRadialGradient(0, -14 + bobbing, 2, 0, -14 + bobbing, 15)
        bulbGrad.addColorStop(0, '#ffffff')
        bulbGrad.addColorStop(0.4, '#fef08a')
        bulbGrad.addColorStop(1, '#f59e0b')
        ctx.fillStyle = bulbGrad
        ctx.shadowColor = '#facc15'
        ctx.shadowBlur = 18
        ctx.fill()

        // Filament
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.8)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(-4, -18 + bobbing)
        ctx.lineTo(-2, -10 + bobbing)
        ctx.lineTo(2, -10 + bobbing)
        ctx.lineTo(4, -18 + bobbing)
        ctx.stroke()
      } else if (level.theme === 'villa') {
        // ------------------------------------------
        // SKIN 2: Crystal Diamond Faceted Bulb (Sapphire / Gold)
        // ------------------------------------------
        ctx.beginPath()
        ctx.arc(0, -14 + bobbing, 16, 0, Math.PI * 2)
        const crystalGrad = ctx.createRadialGradient(0, -14 + bobbing, 2, 0, -14 + bobbing, 16)
        crystalGrad.addColorStop(0, '#ffffff')
        crystalGrad.addColorStop(0.3, '#7dd3fc')
        crystalGrad.addColorStop(1, '#0284c7')
        ctx.fillStyle = crystalGrad
        ctx.shadowColor = '#38bdf8'
        ctx.shadowBlur = 22
        ctx.fill()

        // Diamond facets lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(-8, -14 + bobbing)
        ctx.lineTo(0, -22 + bobbing)
        ctx.lineTo(8, -14 + bobbing)
        ctx.lineTo(0, -6 + bobbing)
        ctx.closePath()
        ctx.stroke()
      } else if (level.theme === 'tower') {
        // ------------------------------------------
        // SKIN 3: Cyber IoT Bulb with Antenna & Visor
        // ------------------------------------------
        ctx.beginPath()
        ctx.arc(0, -14 + bobbing, 15, 0, Math.PI * 2)
        const cyberGrad = ctx.createRadialGradient(0, -14 + bobbing, 2, 0, -14 + bobbing, 15)
        cyberGrad.addColorStop(0, '#ffffff')
        cyberGrad.addColorStop(0.5, '#38bdf8')
        cyberGrad.addColorStop(1, '#0369a1')
        ctx.fillStyle = cyberGrad
        ctx.shadowColor = '#00f0ff'
        ctx.shadowBlur = 24
        ctx.fill()

        // Top Wifi Antenna
        ctx.strokeStyle = '#38bdf8'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, -28 + bobbing)
        ctx.lineTo(0, -35 + bobbing)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(0, -36 + bobbing, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#fde047'
        ctx.fill()
      } else {
        // ------------------------------------------
        // SKIN 4: Golden Royal VIP Crown Bulb
        // ------------------------------------------
        ctx.beginPath()
        ctx.arc(0, -14 + bobbing, 16, 0, Math.PI * 2)
        const goldGrad = ctx.createRadialGradient(0, -14 + bobbing, 2, 0, -14 + bobbing, 16)
        goldGrad.addColorStop(0, '#ffffff')
        goldGrad.addColorStop(0.4, '#fde047')
        goldGrad.addColorStop(1, '#d97706')
        ctx.fillStyle = goldGrad
        ctx.shadowColor = '#eab308'
        ctx.shadowBlur = 28
        ctx.fill()

        // Golden Crown on top of bulb
        ctx.fillStyle = '#f59e0b'
        ctx.strokeStyle = '#78350f'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(-10, -26 + bobbing)
        ctx.lineTo(-12, -34 + bobbing)
        ctx.lineTo(-5, -29 + bobbing)
        ctx.lineTo(0, -36 + bobbing)
        ctx.lineTo(5, -29 + bobbing)
        ctx.lineTo(12, -34 + bobbing)
        ctx.lineTo(10, -26 + bobbing)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }

      // Eyes & Smile
      if (level.theme === 'tower') {
        // Futuristic Cyber Sunglasses Visor
        ctx.fillStyle = '#09090b'
        ctx.beginPath()
        ctx.roundRect(-9 + lookOffsetX, -16 + bobbing + lookOffsetY, 18, 5, 2)
        ctx.fill()
        ctx.strokeStyle = '#00f0ff'
        ctx.lineWidth = 1
        ctx.stroke()
      } else {
        // Expressive Cartoon Eyes
        ctx.fillStyle = '#0f172a'
        ctx.beginPath()
        ctx.arc(-5 + lookOffsetX, -14 + bobbing + lookOffsetY, 2.2, 0, Math.PI * 2)
        ctx.arc(5 + lookOffsetX, -14 + bobbing + lookOffsetY, 2.2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(-6 + lookOffsetX, -15 + bobbing + lookOffsetY, 0.8, 0, Math.PI * 2)
        ctx.arc(4 + lookOffsetX, -15 + bobbing + lookOffsetY, 0.8, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = '#78350f'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(0 + lookOffsetX, -10 + bobbing, 3.5, 0.1 * Math.PI, 0.9 * Math.PI)
        ctx.stroke()
      }

      // Screw Neck
      ctx.fillStyle = level.theme === 'showroom' ? '#f59e0b' : '#94a3b8'
      ctx.fillRect(-6, 0 + bobbing, 12, 5)

      // Blue Royal Shirt (with Gold details in higher levels)
      ctx.fillStyle = '#1d4ed8'
      ctx.beginPath()
      ctx.roundRect(-12, 5 + bobbing, 24, 16, 4)
      ctx.fill()

      // Collar line
      ctx.strokeStyle = level.theme === 'showroom' || level.theme === 'villa' ? '#f59e0b' : '#ffffff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(-5, 5 + bobbing)
      ctx.lineTo(0, 9 + bobbing)
      ctx.lineTo(5, 5 + bobbing)
      ctx.stroke()

      // Logo Text on Shirt
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 5.5px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('الإنارة', 0, 15 + bobbing)

      // Feet
      const legSwing = hero.isMoving ? Math.sin(hero.walkCycle) * 4 : 0
      ctx.fillStyle = '#0f172a'
      ctx.beginPath()
      ctx.roundRect(-8, 20 + bobbing + legSwing, 6, 6, 2)
      ctx.fill()
      ctx.beginPath()
      ctx.roundRect(2, 20 + bobbing - legSwing, 6, 6, 2)
      ctx.fill()

      ctx.restore()

      // ==========================================
      // DRAW PARTICLES
      // ==========================================
      for (const p of particlesRef.current) {
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // ==========================================
      // DYNAMIC FOG OF WAR (العالم المظلم وشعاع النور)
      // ==========================================
      if (gameState === 'playing') {
        ctx.save()
        const darkCanvas = document.createElement('canvas')
        darkCanvas.width = canvas.width
        darkCanvas.height = canvas.height
        const darkCtx = darkCanvas.getContext('2d')

        if (darkCtx) {
          darkCtx.fillStyle = 'rgba(3, 7, 18, 0.94)'
          darkCtx.fillRect(0, 0, darkCanvas.width, darkCanvas.height)

          darkCtx.globalCompositeOperation = 'destination-out'

          // 1. Hero's Light Circle
          const heroLightGrad = darkCtx.createRadialGradient(hero.x, hero.y, 10, hero.x, hero.y, lightPower)
          heroLightGrad.addColorStop(0, 'rgba(0, 0, 0, 1)')
          heroLightGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.85)')
          heroLightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
          darkCtx.fillStyle = heroLightGrad
          darkCtx.beginPath()
          darkCtx.arc(hero.x, hero.y, lightPower, 0, Math.PI * 2)
          darkCtx.fill()

          // 2. Permanent light circles around Lit Lamps
          for (const lamp of level.lamps) {
            if (lamp.isLit) {
              const lampGrad = darkCtx.createRadialGradient(lamp.x, lamp.y, 5, lamp.x, lamp.y, 115)
              lampGrad.addColorStop(0, 'rgba(0, 0, 0, 1)')
              lampGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.8)')
              lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
              darkCtx.fillStyle = lampGrad
              darkCtx.beginPath()
              darkCtx.arc(lamp.x, lamp.y, 115, 0, Math.PI * 2)
              darkCtx.fill()
            }
          }

          ctx.drawImage(darkCanvas, 0, 0)
        }
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    animationFrameId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animationFrameId)
  }, [gameState, lightPower, combo, currentLevelIdx, isStage100PercentComplete])

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none">
      
      {/* Dynamic Banner Alert */}
      {bannerAlert && (
        <div 
          className={`w-full mb-3 py-2.5 px-4 border rounded-xl text-center text-xs font-bold shadow-lg transition-all ${
            bannerAlert.type === 'error'
              ? 'bg-red-950/90 border-red-500/50 text-red-200 animate-shake'
              : bannerAlert.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-blue-600/90 border-blue-400/30 text-white'
          }`}
        >
          {bannerAlert.msg}
        </div>
      )}

      {/* Game Top HUD Bar */}
      <div className="w-full bg-[#111215] border border-zinc-800 rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        
        {/* Level Name & Hero Skin Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
            <Compass className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-zinc-200 font-bold">
              {LEVELS[currentLevelIdx].nameAr.split(':')[0]}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            <span>البطل: {LEVELS[currentLevelIdx].heroSkinName}</span>
          </div>
        </div>

        {/* 100% Checklist / Progress Meter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] text-zinc-400">المصابيح:</span>
            <span className="text-white font-bold text-xs">
              {lampsLitCount}/{totalLampsCount}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] text-zinc-400">المواد:</span>
            <span className="text-white font-bold text-xs">
              {collectedSparksCount}/{totalSparksCount}
            </span>
          </div>

          {/* Master Switch Status Badge */}
          <div 
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
              isStage100PercentComplete
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 animate-pulse'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {isStage100PercentComplete ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isStage100PercentComplete ? 'القاطع جاهز!' : `متبقي: ${totalRemaining}`}</span>
          </div>
        </div>

        {/* Controls: Mute & Restart */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => startGame(currentLevelIdx)}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="إعادة المرحلة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[620px] bg-black rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center">
        
        <canvas
          ref={canvasRef}
          width={LEVELS[currentLevelIdx].width}
          height={LEVELS[currentLevelIdx].height}
          className="w-full h-full object-contain"
        />

        {/* ==========================================
            SCREEN: INTRO / START SCREEN
        ========================================== */}
        {gameState === 'intro' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-20 h-20 bg-blue-600/20 border border-blue-500/30 rounded-3xl flex items-center justify-center mb-4 shadow-lg text-blue-400 animate-bounce">
              <Lightbulb className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
              رحلة النور | بطل <span className="text-blue-400">الإنارة الحديثة</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed mb-4 font-normal">
              تطور شكل بطل اللمبة في كل مرحلة! اجمع 100% من المواد والأسلاك، وأنر كافة المصابيح واحذر الشحنات لإكمال التحدي.
            </p>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 mb-6 text-xs text-zinc-300 max-w-sm text-right space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>قوانين التحدي:</span>
              </div>
              <p className="text-zinc-400">⚡ ملامسة الشحنات تعيد المرحلة من البداية فوراً.</p>
              <p className="text-zinc-400">⚡ القاطع الرئيسي لن يفتح حتى تجمع وتنير 100% من كل شيء في الغرفة.</p>
            </div>

            <button
              onClick={() => startGame(0)}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>ابدأ المرحلة 1 (حي الليثي)</span>
            </button>
          </div>
        )}

        {/* ==========================================
            SCREEN: LEVEL WON SCREEN
        ========================================== */}
        {gameState === 'level_won' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mb-3 text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              تمت إنارة المرحلة بنسبة 100%! ⚡
            </h3>
            <p className="text-zinc-300 text-xs sm:text-sm mb-4">
              أحسنت! أعدت النور بالكامل إلى {LEVELS[currentLevelIdx].nameAr}
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 mb-6 text-xs text-zinc-300 space-y-1">
              <div>المرحلة القادمة: <span className="text-blue-400 font-bold">{LEVELS[currentLevelIdx + 1]?.nameAr}</span></div>
              <div className="text-amber-400 font-semibold">مظهر البطل الجديد: {LEVELS[currentLevelIdx + 1]?.heroSkinName}</div>
            </div>

            <button
              onClick={nextLevel}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>الانتقال للمظهر والمرحلة التالية</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* ==========================================
            SCREEN: FINAL VICTORY & VIP COUPON SCREEN
        ========================================== */}
        {gameState === 'game_won' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-20 h-20 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mb-4 text-amber-400 animate-pulse">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
              🎉 مبروك! أتممت التحدي 100% وأعدت النور للجميع!
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-md mb-5 leading-relaxed">
              أنت بطل أسطوري للإنارة! لقد أتممت جميع المراحل بالكامل بدون أي خطأ.
            </p>

            {/* VIP Promo Coupon Card */}
            <div className="bg-gradient-to-r from-amber-950/60 via-zinc-950 to-blue-950/60 border border-amber-500/40 rounded-2xl p-5 mb-5 text-center max-w-sm w-full shadow-xl">
              <div className="text-[11px] text-amber-300 font-bold mb-1">كوبون أبطال الإنارة الذهبي:</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-amber-400 tracking-widest bg-black/70 py-2 px-4 rounded-xl border border-amber-400/30 mb-2">
                ENARAH-HERO
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold">
                ⚡ خصم خاص عند إرسال الكود مع طلبيتك عبر الواتساب!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/218916580068?text=${encodeURIComponent('مرحباً شركة الإنارة الحديثة، فزت بجميع مراحل لعبة بطل الإنارة وحصلت على كود الخصم: ENARAH-HERO')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>استخدام الكوبون في الواتساب</span>
              </a>

              <button
                onClick={() => startGame(0)}
                className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
              >
                إعادة اللعب من البداية
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Mobile Touch Controls (D-Pad Controller) */}
      <div className="w-full mt-5 flex sm:hidden flex-col items-center justify-center">
        <p className="text-[11px] text-zinc-500 mb-2">لوحة التحكم باللمس للهواتف</p>
        
        <div className="relative w-44 h-44 bg-zinc-950/90 border border-zinc-800 rounded-full p-2 flex items-center justify-center shadow-lg">
          {/* UP Button */}
          <button
            onTouchStart={() => handleTouchDir(0, -1)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchDir(0, -1)}
            onMouseUp={handleTouchEnd}
            className="absolute top-2 w-12 h-12 bg-zinc-900 active:bg-blue-600 border border-zinc-800 text-white rounded-xl flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
          >
            ▲
          </button>

          {/* DOWN Button */}
          <button
            onTouchStart={() => handleTouchDir(0, 1)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchDir(0, 1)}
            onMouseUp={handleTouchEnd}
            className="absolute bottom-2 w-12 h-12 bg-zinc-900 active:bg-blue-600 border border-zinc-800 text-white rounded-xl flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
          >
            ▼
          </button>

          {/* LEFT Button */}
          <button
            onTouchStart={() => handleTouchDir(-1, 0)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchDir(-1, 0)}
            onMouseUp={handleTouchEnd}
            className="absolute left-2 w-12 h-12 bg-zinc-900 active:bg-blue-600 border border-zinc-800 text-white rounded-xl flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
          >
            ◀
          </button>

          {/* RIGHT Button */}
          <button
            onTouchStart={() => handleTouchDir(1, 0)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchDir(1, 0)}
            onMouseUp={handleTouchEnd}
            className="absolute right-2 w-12 h-12 bg-zinc-900 active:bg-blue-600 border border-zinc-800 text-white rounded-xl flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
          >
            ▶
          </button>

          {/* Center Mascot Bulb icon */}
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-blue-400 border border-zinc-800">
            <Lightbulb className="w-5 h-5" />
          </div>
        </div>
      </div>

    </div>
  )
}
