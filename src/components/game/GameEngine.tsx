import React, { useEffect, useRef, useState, useCallback } from 'react'
import { sound } from './audio'
import { Sparkles, Zap, Lightbulb, Volume2, VolumeX, RotateCcw, Trophy, CheckCircle, ArrowRight, Play, Award, Flame } from 'lucide-react'

export interface LevelData {
  id: number
  nameAr: string
  nameEn: string
  subtitleAr: string
  theme: 'street' | 'villa' | 'tower'
  width: number
  height: number
  walls: { x: number; y: number; w: number; h: number }[]
  lamps: { id: number; x: number; y: number; isLit: boolean; name: string }[]
  sparks: { id: number; x: number; y: number; collected: boolean; type: 'spark' | 'wire' | 'spotlight' }[]
  masterSwitch: { x: number; y: number; isActivated: boolean }
  heroStart: { x: number; y: number }
}

const LEVELS: LevelData[] = [
  {
    id: 1,
    nameAr: 'المرحلة 1: حي الليثي - بنغازي',
    nameEn: 'Level 1: Al-Laythi District',
    subtitleAr: 'انقطعت الكهرباء عن الشارع! تحرك لإنارة مصابيح الأعمدة وتشغيل القاطع الرئيسي.',
    theme: 'street',
    width: 900,
    height: 600,
    heroStart: { x: 80, y: 300 },
    walls: [
      { x: 0, y: 0, w: 900, h: 20 },
      { x: 0, y: 580, w: 900, h: 20 },
      { x: 0, y: 0, w: 20, h: 600 },
      { x: 880, y: 0, w: 20, h: 600 },
      // Internal buildings & barriers
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
    masterSwitch: { x: 830, y: 300, isActivated: false },
  },
  {
    id: 2,
    nameAr: 'المرحلة 2: الفيلا المعمارية الفاخرة',
    nameEn: 'Level 2: The Luxury Villa',
    subtitleAr: 'أعد الحياة إلى صالات وغرف الفيلا من خلال إشعال الثريات وتركيب السبوت لايت.',
    theme: 'villa',
    width: 950,
    height: 650,
    heroStart: { x: 90, y: 320 },
    walls: [
      { x: 0, y: 0, w: 950, h: 20 },
      { x: 0, y: 630, w: 950, h: 20 },
      { x: 0, y: 0, w: 20, h: 650 },
      { x: 930, y: 0, w: 20, h: 650 },
      // Villa room partitions
      { x: 200, y: 20, w: 20, h: 240 },
      { x: 200, y: 390, w: 20, h: 240 },
      { x: 200, y: 240, w: 200, h: 20 },
      { x: 200, y: 390, w: 200, h: 20 },
      { x: 520, y: 120, w: 20, h: 410 },
      { x: 680, y: 20, w: 20, h: 250 },
      { x: 680, y: 380, w: 20, h: 250 },
    ],
    lamps: [
      { id: 1, x: 110, y: 120, isLit: false, name: 'ثريا المدخل الملكي' },
      { id: 2, x: 110, y: 520, isLit: false, name: 'إنارة المجلس' },
      { id: 3, x: 350, y: 130, isLit: false, name: 'إضاءة الصالون المخفية' },
      { id: 4, x: 350, y: 520, isLit: false, name: 'ثريا المائدة الكريستال' },
      { id: 5, x: 600, y: 325, isLit: false, name: 'سبوت لايت الممر الدائري' },
      { id: 6, x: 800, y: 140, isLit: false, name: 'إضاءة غرفة الماستر' },
      { id: 7, x: 800, y: 510, isLit: false, name: 'إنارة التراس والواجهة' },
    ],
    sparks: [
      { id: 1, x: 110, y: 240, collected: false, type: 'spark' },
      { id: 2, x: 110, y: 400, collected: false, type: 'wire' },
      { id: 3, x: 350, y: 325, collected: false, type: 'spotlight' },
      { id: 4, x: 270, y: 130, collected: false, type: 'spark' },
      { id: 5, x: 270, y: 520, collected: false, type: 'wire' },
      { id: 6, x: 440, y: 130, collected: false, type: 'spotlight' },
      { id: 7, x: 440, y: 520, collected: false, type: 'spark' },
      { id: 8, x: 600, y: 180, collected: false, type: 'wire' },
      { id: 9, x: 600, y: 470, collected: false, type: 'spotlight' },
      { id: 10, x: 740, y: 220, collected: false, type: 'spark' },
      { id: 11, x: 740, y: 430, collected: false, type: 'wire' },
      { id: 12, x: 860, y: 325, collected: false, type: 'spotlight' },
    ],
    masterSwitch: { x: 880, y: 325, isActivated: false },
  },
  {
    id: 3,
    nameAr: 'المرحلة 3: برج المدينة الذكي',
    nameEn: 'Level 3: The Smart Tower',
    subtitleAr: 'المرحلة النهائية: قم بتشغيل منظومة الإنارة الذكية لبرج المدينة بالكامل!',
    theme: 'tower',
    width: 1000,
    height: 700,
    heroStart: { x: 80, y: 350 },
    walls: [
      { x: 0, y: 0, w: 1000, h: 20 },
      { x: 0, y: 680, w: 1000, h: 20 },
      { x: 0, y: 0, w: 20, h: 700 },
      { x: 980, y: 0, w: 20, h: 700 },
      // Maze grid pillars
      { x: 180, y: 120, w: 40, h: 200 },
      { x: 180, y: 380, w: 40, h: 200 },
      { x: 360, y: 20, w: 40, h: 250 },
      { x: 360, y: 430, w: 40, h: 250 },
      { x: 540, y: 150, w: 40, h: 400 },
      { x: 720, y: 20, w: 40, h: 280 },
      { x: 720, y: 400, w: 40, h: 280 },
    ],
    lamps: [
      { id: 1, x: 100, y: 120, isLit: false, name: 'لوحة تحكم الطابق 1' },
      { id: 2, x: 100, y: 580, isLit: false, name: 'لوحة تحكم الطابق 2' },
      { id: 3, x: 270, y: 350, isLit: false, name: 'إنارة البهو الزجاجي' },
      { id: 4, x: 450, y: 120, isLit: false, name: 'كشافات الواجهة البانورامية' },
      { id: 5, x: 450, y: 580, isLit: false, name: 'مفاتيح اللمس الذكية' },
      { id: 6, x: 630, y: 350, isLit: false, name: 'منظومة الطاقة المركزية' },
      { id: 7, x: 850, y: 150, isLit: false, name: 'إنارة مهبط الهليكوبتر' },
      { id: 8, x: 850, y: 550, isLit: false, name: 'برج البث الضوئي' },
    ],
    sparks: [
      { id: 1, x: 100, y: 250, collected: false, type: 'spark' },
      { id: 2, x: 100, y: 450, collected: false, type: 'wire' },
      { id: 3, x: 270, y: 150, collected: false, type: 'spotlight' },
      { id: 4, x: 270, y: 550, collected: false, type: 'spark' },
      { id: 5, x: 450, y: 250, collected: false, type: 'wire' },
      { id: 6, x: 450, y: 450, collected: false, type: 'spotlight' },
      { id: 7, x: 630, y: 150, collected: false, type: 'spark' },
      { id: 8, x: 630, y: 550, collected: false, type: 'wire' },
      { id: 9, x: 800, y: 250, collected: false, type: 'spotlight' },
      { id: 10, x: 800, y: 450, collected: false, type: 'spark' },
      { id: 11, x: 920, y: 200, collected: false, type: 'wire' },
      { id: 12, x: 920, y: 500, collected: false, type: 'spotlight' },
    ],
    masterSwitch: { x: 930, y: 350, isActivated: false },
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
  const [lightPower, setLightPower] = useState(140) // Radius of hero's light
  const [isMuted, setIsMuted] = useState(false)
  const [lampsLitCount, setLampsLitCount] = useState(0)
  const [totalLampsCount, setTotalLampsCount] = useState(0)
  const [sparksCount, setSparksCount] = useState(0)

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
    setLampsLitCount(0)
    setTotalLampsCount(cloned.lamps.length)
    setSparksCount(0)
    setLightPower(140)
    particlesRef.current = []
  }, [])

  // Start game
  const startGame = (levelIdx = 0) => {
    setCurrentLevelIdx(levelIdx)
    loadLevel(levelIdx)
    setScore(0)
    setCombo(1)
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

        // 2. Collision with Walls
        const newX = hero.x + moveX
        const newY = hero.y + moveY
        let canMoveX = true
        let canMoveY = true

        for (const wall of level.walls) {
          // Check horizontal collision
          if (
            newX + hero.radius > wall.x &&
            newX - hero.radius < wall.x + wall.w &&
            hero.y + hero.radius > wall.y &&
            hero.y - hero.radius < wall.y + wall.h
          ) {
            canMoveX = false
          }
          // Check vertical collision
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

        // 3. Collect Sparks & Powerups
        for (const spark of level.sparks) {
          if (!spark.collected) {
            const dist = Math.hypot(hero.x - spark.x, hero.y - spark.y)
            if (dist < hero.radius + 16) {
              spark.collected = true
              setSparksCount((prev) => prev + 1)
              
              if (spark.type === 'wire') {
                sound.playWire()
                setScore((prev) => prev + 150 * combo)
                setLightPower((prev) => Math.min(prev + 18, 260))
                spawnParticles(spark.x, spark.y, '#f59e0b', 16, 1.2)
              } else if (spark.type === 'spotlight') {
                sound.playSpark()
                setScore((prev) => prev + 200 * combo)
                setLightPower((prev) => Math.min(prev + 25, 280))
                spawnParticles(spark.x, spark.y, '#38bdf8', 18, 1.4)
              } else {
                sound.playSpark()
                setScore((prev) => prev + 50 * combo)
                setLightPower((prev) => Math.min(prev + 8, 250))
                spawnParticles(spark.x, spark.y, '#fde047', 12, 1)
              }
            }
          }
        }

        // 4. Light up Dark Lamps
        for (const lamp of level.lamps) {
          if (!lamp.isLit) {
            const dist = Math.hypot(hero.x - lamp.x, hero.y - lamp.y)
            if (dist < hero.radius + 35) {
              lamp.isLit = true
              sound.playLampOn()
              setScore((prev) => prev + 300 * combo)
              setLampsLitCount((prev) => {
                const nextCount = prev + 1
                return nextCount
              })
              spawnParticles(lamp.x, lamp.y, '#60a5fa', 24, 1.8)
            }
          }
        }

        // 5. Check Master Switchboard
        const masterDist = Math.hypot(hero.x - level.masterSwitch.x, hero.y - level.masterSwitch.y)
        if (masterDist < hero.radius + 30 && !level.masterSwitch.isActivated) {
          level.masterSwitch.isActivated = true
          // Turn all remaining lamps on
          level.lamps.forEach((l) => (l.isLit = true))
          sound.playMasterSwitch()
          setScore((prev) => prev + 1000)
          spawnParticles(level.masterSwitch.x, level.masterSwitch.y, '#10b981', 40, 2.5)

          setTimeout(() => {
            sound.playVictory()
            setGameState('level_won')
          }, 800)
        }
      }

      // 6. Update Particles
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
      // CANVAS RENDERING
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background Grid (City Streets / Villa Flooring)
      ctx.fillStyle = '#060a12'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw Walls / Architecture Boundaries
      ctx.fillStyle = '#111827'
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 2
      for (const wall of level.walls) {
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h)
        ctx.strokeRect(wall.x, wall.y, wall.w, wall.h)
      }

      // Draw Sparks & Wire items
      for (const spark of level.sparks) {
        if (!spark.collected) {
          ctx.save()
          ctx.translate(spark.x, spark.y)
          const bounce = Math.sin(time * 0.006 + spark.id) * 3

          if (spark.type === 'wire') {
            // Italian Copper Wire Coil
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
            // Spotlight fixture
            ctx.beginPath()
            ctx.arc(0, bounce, 10, 0, Math.PI * 2)
            ctx.fillStyle = '#0284c7'
            ctx.fill()
            ctx.strokeStyle = '#38bdf8'
            ctx.lineWidth = 2.5
            ctx.stroke()
            // Inner LED star
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(0, bounce, 3, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Glowing Energy Spark
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

      // Draw Lamps & Chandeliers
      for (const lamp of level.lamps) {
        ctx.save()
        ctx.translate(lamp.x, lamp.y)

        // Pole / base
        ctx.fillStyle = '#1f2937'
        ctx.fillRect(-3, -12, 6, 24)

        // Light fixture head
        ctx.beginPath()
        ctx.arc(0, -12, 12, 0, Math.PI * 2)
        if (lamp.isLit) {
          ctx.fillStyle = '#60a5fa'
          ctx.shadowColor = '#3b82f6'
          ctx.shadowBlur = 25
          ctx.fill()
          // Inner core
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
        ctx.restore()
      }

      // Draw Master Switchboard (القاطع الرئيسي)
      ctx.save()
      ctx.translate(level.masterSwitch.x, level.masterSwitch.y)
      ctx.fillStyle = '#0f172a'
      ctx.strokeStyle = level.masterSwitch.isActivated ? '#10b981' : '#ef4444'
      ctx.lineWidth = 3
      ctx.fillRect(-18, -25, 36, 50)
      ctx.strokeRect(-18, -25, 36, 50)

      // Lever handle
      ctx.fillStyle = level.masterSwitch.isActivated ? '#10b981' : '#ef4444'
      if (level.masterSwitch.isActivated) {
        ctx.fillRect(-10, -18, 20, 10)
      } else {
        ctx.fillRect(-10, 8, 20, 10)
      }
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 8px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('MAIN', 0, 0)
      ctx.restore()

      // ==========================================
      // DRAW HERO MASCOT (لمبة الإنارة الحديثة بقميص أزرق)
      // ==========================================
      ctx.save()
      ctx.translate(hero.x, hero.y)

      const bobbing = hero.isMoving ? Math.sin(hero.walkCycle) * 2.5 : Math.sin(time * 0.003) * 1.5

      // 1. Glowing Bulb Head (الرأس الزجاجي المضيء)
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

      // Filament wires inside glass
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.8)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(-4, -18 + bobbing)
      ctx.lineTo(-2, -10 + bobbing)
      ctx.lineTo(2, -10 + bobbing)
      ctx.lineTo(4, -18 + bobbing)
      ctx.stroke()

      // Cute Eyes (العينان الذكيتان)
      const lookOffsetX = hero.facing === 'left' ? -2.5 : hero.facing === 'right' ? 2.5 : 0
      const lookOffsetY = hero.facing === 'up' ? -2 : hero.facing === 'down' ? 1.5 : 0

      ctx.fillStyle = '#0f172a'
      ctx.beginPath()
      ctx.arc(-5 + lookOffsetX, -14 + bobbing + lookOffsetY, 2.2, 0, Math.PI * 2)
      ctx.arc(5 + lookOffsetX, -14 + bobbing + lookOffsetY, 2.2, 0, Math.PI * 2)
      ctx.fill()

      // Eye glints (بريق العين)
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(-6 + lookOffsetX, -15 + bobbing + lookOffsetY, 0.8, 0, Math.PI * 2)
      ctx.arc(4 + lookOffsetX, -15 + bobbing + lookOffsetY, 0.8, 0, Math.PI * 2)
      ctx.fill()

      // Cute Smile (ابتسامة لطيفة)
      ctx.strokeStyle = '#78350f'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0 + lookOffsetX, -10 + bobbing, 3.5, 0.1 * Math.PI, 0.9 * Math.PI)
      ctx.stroke()

      // 2. Metallic Screw Neck (قاعدة اللمبة المعدنية)
      ctx.fillStyle = '#94a3b8'
      ctx.fillRect(-6, 0 + bobbing, 12, 5)
      ctx.fillStyle = '#cbd5e1'
      ctx.fillRect(-5, 2 + bobbing, 10, 2)

      // 3. Blue Royal Shirt (القميص الأزرق - الإنارة الحديثة)
      ctx.fillStyle = '#1d4ed8' // Royal Blue Shirt
      ctx.beginPath()
      ctx.roundRect(-12, 5 + bobbing, 24, 16, 4)
      ctx.fill()

      // White collar line
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(-5, 5 + bobbing)
      ctx.lineTo(0, 9 + bobbing)
      ctx.lineTo(5, 5 + bobbing)
      ctx.stroke()

      // Shirt Logo text "الإنارة"
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 5.5px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('الإنارة', 0, 15 + bobbing)

      // 4. Little Animated Feet (القدمان الصغيرتان)
      const legSwing = hero.isMoving ? Math.sin(hero.walkCycle) * 4 : 0
      ctx.fillStyle = '#0f172a'
      // Left foot
      ctx.beginPath()
      ctx.roundRect(-8, 20 + bobbing + legSwing, 6, 6, 2)
      ctx.fill()
      // Right foot
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
        // Create an offscreen dark layer
        const darkCanvas = document.createElement('canvas')
        darkCanvas.width = canvas.width
        darkCanvas.height = canvas.height
        const darkCtx = darkCanvas.getContext('2d')

        if (darkCtx) {
          // Fill total darkness
          darkCtx.fillStyle = 'rgba(3, 7, 18, 0.94)'
          darkCtx.fillRect(0, 0, darkCanvas.width, darkCanvas.height)

          // Cut out light circles for Hero and Lit Lamps
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
              const lampGrad = darkCtx.createRadialGradient(lamp.x, lamp.y, 5, lamp.x, lamp.y, 110)
              lampGrad.addColorStop(0, 'rgba(0, 0, 0, 1)')
              lampGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.8)')
              lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
              darkCtx.fillStyle = lampGrad
              darkCtx.beginPath()
              darkCtx.arc(lamp.x, lamp.y, 110, 0, Math.PI * 2)
              darkCtx.fill()
            }
          }

          // Render fog onto main screen
          ctx.drawImage(darkCanvas, 0, 0)
        }
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    animationFrameId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animationFrameId)
  }, [gameState, lightPower, combo])

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none">
      
      {/* Game Top HUD Bar */}
      <div className="w-full bg-[#111215] border border-zinc-800 rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        
        {/* Score & Level */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-800">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-zinc-400">النقاط:</span>
            <span className="text-white font-bold text-sm">{score}</span>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-800">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-zinc-400">المصابيح:</span>
            <span className="text-emerald-400 font-bold text-sm">
              {lampsLitCount} / {totalLampsCount}
            </span>
          </div>
        </div>

        {/* Light Power / Range Meter */}
        <div className="flex items-center gap-2 flex-grow max-w-xs">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="w-full h-2.5 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(((lightPower - 100) / 180) * 100, 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-zinc-400 whitespace-nowrap">قوة النور</span>
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
            <div className="w-20 h-20 bg-blue-600/20 border border-blue-500/30 rounded-3xl flex items-center justify-center mb-5 shadow-lg text-blue-400 animate-bounce">
              <Lightbulb className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
              رحلة النور | بطل <span className="text-blue-400">الإنارة الحديثة</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed mb-6 font-normal">
              تحكم ببطل اللمبة الذكية بالقميص الأزرق، واجمع شرارات الطاقة والأسلاك لإنارة المصابيح وتشغيل القاطع الرئيسي في عالم مظلم!
            </p>

            <button
              onClick={() => startGame(0)}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>ابدأ المغامرة الآن</span>
            </button>

            <div className="mt-6 flex items-center gap-6 text-xs text-zinc-400">
              <span>🎮 الأسهم أو WASD للتحكم</span>
              <span>📱 أزرار اللمس للهواتف</span>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN: LEVEL WON SCREEN
        ========================================== */}
        {gameState === 'level_won' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mb-4 text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              تمت إنارة المرحلة بنجاح! ⚡
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm mb-4">
              أحسنت! أعدت النور بالكامل إلى {LEVELS[currentLevelIdx].nameAr}
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 mb-6 text-xs text-zinc-300">
              <span>مجموع النقاط: </span>
              <span className="text-emerald-400 font-bold text-sm">{score} نقطة</span>
            </div>

            <button
              onClick={nextLevel}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>الانتقال للمرحلة التالية</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* ==========================================
            SCREEN: FINAL VICTORY & COUPON SCREEN
        ========================================== */}
        {gameState === 'game_won' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-20 h-20 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mb-4 text-amber-400 animate-pulse">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
              🎉 مبروك! أعدت النور للمدينة بالكامل!
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
              أنت بطل حقيقي للإنارة! تقديراً لشجاعتك، إليك كود خصم حصري لمشترياتك القادمة من شركة الإنارة الحديثة.
            </p>

            {/* Promo Coupon Card */}
            <div className="bg-gradient-to-r from-blue-950/80 to-zinc-950 border border-blue-500/30 rounded-2xl p-5 mb-6 text-center max-w-sm w-full shadow-lg">
              <div className="text-[11px] text-zinc-400 mb-1">كوبون خصم الأبطال:</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-blue-400 tracking-widest bg-black/60 py-2 px-4 rounded-xl border border-blue-400/20 mb-3">
                ENARAH-HERO
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold">
                ⚡ خصم خاص عند إرسال الكود مع طلبيتك عبر الواتساب!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/218916580068?text=${encodeURIComponent('مرحباً شركة الإنارة الحديثة، فزت في لعبة بطل الإنارة وحصلت على كود الخصم: ENARAH-HERO')}`}
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
