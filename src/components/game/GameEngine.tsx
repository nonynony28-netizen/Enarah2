import React, { useEffect, useRef, useState, useCallback } from 'react'
import { sound } from './audio'
import { Sparkles, Zap, Lightbulb, Volume2, VolumeX, RotateCcw, Trophy, CheckCircle, ArrowRight, Play, Award, Flame, Lock, Unlock, Compass, AlertTriangle, Clock, Timer, ShieldAlert, Skull, Heart, Medal, Star, Send, X, User, Maximize2, Minimize2 } from 'lucide-react'

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

export interface LaserBeam {
  id: number
  x1: number
  y1: number
  x2: number
  y2: number
  period: number
  onTime: number
  offset: number
}

export interface BossBreaker {
  id: number
  x: number
  y: number
  nameAr: string
  isActivated: boolean
}

export interface BossData {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  hp: number
  maxHp: number
  isDefeated: boolean
  nameAr: string
  breakers: BossBreaker[]
}

export interface LevelData {
  id: number
  nameAr: string
  nameEn: string
  subtitleAr: string
  difficultyBadge: string
  heroSkinName: string
  trailColor: string
  locationDescription: string
  stars: number
  theme: 'street' | 'villa' | 'tower' | 'showroom'
  timeLimit: number
  width: number
  height: number
  walls: { x: number; y: number; w: number; h: number; type?: string }[]
  decorations: { type: string; x: number; y: number; w?: number; h?: number; label?: string }[]
  lamps: { id: number; x: number; y: number; isLit: boolean; name: string }[]
  sparks: { id: number; x: number; y: number; collected: boolean; type: 'spark' | 'wire' | 'spotlight' }[]
  hazards: Hazard[]
  laserBeams: LaserBeam[]
  gates: Gate[]
  boss?: BossData
  masterSwitch: { x: number; y: number; isActivated: boolean }
  heroStart: { x: number; y: number }
  initialLight: number
}

export interface LeaderboardEntry {
  id: string
  name: string
  city: string
  score: number
  timeTakenSec: number
  date: string
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = []

const LEVELS: LevelData[] = [
  // =========================================================================
  // LEVEL 1: شوارع حي الليثي بنغازي
  // =========================================================================
  {
    id: 1,
    nameAr: 'المرحلة 1: شوارع حي الليثي - بنغازي',
    nameEn: 'Level 1: Al-Laythi Streets',
    subtitleAr: 'احذر الشحنات المتحركة في الشارع! اجمع كابلات النحاس لكسب (+5 ثوانٍ) وأنر كافة الأعمدة قبل انتهاء الوقت.',
    difficultyBadge: 'سهل ومثير',
    heroSkinName: 'لمبة LED الكلاسيكية 💡',
    trailColor: '#facc15',
    locationDescription: 'شوارع معبدة، أرصفة حجرية، أعمدة إنارة عامة، وممرات مشاة',
    stars: 1,
    timeLimit: 55,
    theme: 'street',
    width: 920,
    height: 620,
    heroStart: { x: 70, y: 530 },
    initialLight: 150,
    walls: [
      { x: 0, y: 0, w: 920, h: 20 },
      { x: 0, y: 600, w: 920, h: 20 },
      { x: 0, y: 0, w: 20, h: 620 },
      { x: 900, y: 0, w: 20, h: 620 },
      { x: 140, y: 20, w: 160, h: 180, type: 'building' },
      { x: 140, y: 380, w: 160, h: 220, type: 'building' },
      { x: 420, y: 140, w: 140, h: 320, type: 'park' },
      { x: 680, y: 20, w: 160, h: 200, type: 'building' },
      { x: 680, y: 400, w: 160, h: 200, type: 'building' },
    ],
    decorations: [
      { type: 'crosswalk', x: 330, y: 220, w: 60, h: 160 },
      { type: 'crosswalk', x: 590, y: 220, w: 60, h: 160 },
      { type: 'sign', x: 60, y: 480, label: 'شارع الليثي الرئيسي' },
    ],
    lamps: [
      { id: 1, x: 80, y: 120, isLit: false, name: 'عمود إنارة شارع 1' },
      { id: 2, x: 80, y: 340, isLit: false, name: 'عمود إنارة شارع 2' },
      { id: 3, x: 350, y: 100, isLit: false, name: 'مصباح ممر المشاة' },
      { id: 4, x: 350, y: 520, isLit: false, name: 'كشاف حديقة الحي' },
      { id: 5, x: 610, y: 100, isLit: false, name: 'عمود مدخل الحي الشرقي' },
      { id: 6, x: 610, y: 520, isLit: false, name: 'إنارة الواجهة السكنية' },
    ],
    sparks: [
      { id: 1, x: 80, y: 240, collected: false, type: 'spark' },
      { id: 2, x: 80, y: 440, collected: false, type: 'spark' },
      { id: 3, x: 350, y: 220, collected: false, type: 'wire' },
      { id: 4, x: 350, y: 400, collected: false, type: 'spark' },
      { id: 5, x: 490, y: 80, collected: false, type: 'wire' },
      { id: 6, x: 490, y: 530, collected: false, type: 'spotlight' },
      { id: 7, x: 610, y: 300, collected: false, type: 'wire' },
      { id: 8, x: 760, y: 260, collected: false, type: 'spark' },
      { id: 9, x: 760, y: 340, collected: false, type: 'spotlight' },
    ],
    hazards: [
      { id: 1, x: 220, y: 300, vx: 2.2, vy: 0, radius: 14, type: 'patrol', minX: 50, maxX: 850 },
      { id: 2, x: 700, y: 260, vx: -2.4, vy: 0, radius: 14, type: 'patrol', minX: 50, maxX: 850 },
    ],
    laserBeams: [],
    gates: [],
    masterSwitch: { x: 840, y: 300, isActivated: false },
  },

  // =========================================================================
  // LEVEL 2: الفيلا المعمارية الفاخرة
  // =========================================================================
  {
    id: 2,
    nameAr: 'المرحلة 2: الفيلا المعمارية الفاخرة',
    nameEn: 'Level 2: The Luxury Villa',
    subtitleAr: 'احذر دوامات تفريغ الطاقة وأشعة الليزر المتقطعة! أنر 3 ثريات لفتح البوابة قبل نفاد الوقت.',
    difficultyBadge: 'متوسط حماسي',
    heroSkinName: 'اللمبة الكريستالية الملكية 💎',
    trailColor: '#38bdf8',
    locationDescription: 'أرضيات خشبية باركيه، صالونات راقية، سجاد تركي، وغرفة طعام فخمة',
    stars: 2,
    timeLimit: 48,
    theme: 'villa',
    width: 960,
    height: 660,
    heroStart: { x: 80, y: 100 },
    initialLight: 135,
    walls: [
      { x: 0, y: 0, w: 960, h: 20 },
      { x: 0, y: 640, w: 960, h: 20 },
      { x: 0, y: 0, w: 20, h: 660 },
      { x: 940, y: 0, w: 20, h: 660 },
      { x: 220, y: 20, w: 20, h: 220 },
      { x: 220, y: 420, w: 20, h: 220 },
      { x: 220, y: 220, w: 220, h: 20 },
      { x: 220, y: 420, w: 220, h: 20 },
      { x: 550, y: 140, w: 20, h: 380 },
      { x: 740, y: 20, w: 20, h: 220 },
      { x: 740, y: 420, w: 20, h: 220 },
    ],
    decorations: [
      { type: 'carpet', x: 60, y: 280, w: 120, h: 180, label: 'سجاد المدخل' },
      { type: 'sofa', x: 280, y: 80, w: 100, h: 40, label: 'أطقم صالون VIP' },
      { type: 'dining_table', x: 280, y: 500, w: 120, h: 60, label: 'طاولة طعام ملكية' },
      { type: 'bed', x: 800, y: 80, w: 90, h: 90, label: 'غرفة النوم الماستر' },
    ],
    lamps: [
      { id: 1, x: 120, y: 80, isLit: false, name: 'ثريا بهو المدخل' },
      { id: 2, x: 120, y: 540, isLit: false, name: 'إنارة المجلس الأرضي' },
      { id: 3, x: 330, y: 140, isLit: false, name: 'ثريا الصالون الملكي' },
      { id: 4, x: 330, y: 510, isLit: false, name: 'ثريا المائدة الكريستال' },
      { id: 5, x: 640, y: 330, isLit: false, name: 'سبوت لايت الممر الذهبي' },
      { id: 6, x: 840, y: 140, isLit: false, name: 'إضاءة غرفة الماستر' },
      { id: 7, x: 840, y: 520, isLit: false, name: 'إنارة التراس والحديقة' },
    ],
    sparks: [
      { id: 1, x: 120, y: 240, collected: false, type: 'spark' },
      { id: 2, x: 120, y: 380, collected: false, type: 'wire' },
      { id: 3, x: 330, y: 330, collected: false, type: 'spotlight' },
      { id: 4, x: 260, y: 140, collected: false, type: 'spark' },
      { id: 5, x: 410, y: 140, collected: false, type: 'wire' },
      { id: 6, x: 260, y: 510, collected: false, type: 'spotlight' },
      { id: 7, x: 410, y: 510, collected: false, type: 'spark' },
      { id: 8, x: 640, y: 180, collected: false, type: 'wire' },
      { id: 9, x: 640, y: 480, collected: false, type: 'spotlight' },
      { id: 10, x: 790, y: 280, collected: false, type: 'spark' },
      { id: 11, x: 790, y: 380, collected: false, type: 'wire' },
    ],
    gates: [
      { id: 1, x: 740, y: 240, w: 20, h: 180, isOpen: false, requiredLamps: 3, labelAr: 'مغلقة: أنر 3 ثريات لفتحها' },
    ],
    hazards: [
      { id: 1, x: 330, y: 330, vx: 0, vy: 1.8, radius: 20, type: 'vortex', minY: 250, maxY: 410 },
      { id: 2, x: 640, y: 220, vx: 0, vy: -2.2, radius: 20, type: 'vortex', minY: 150, maxY: 510 },
      { id: 3, x: 480, y: 330, vx: 1.8, vy: 0, radius: 18, type: 'patrol', minX: 380, maxX: 540 },
    ],
    laserBeams: [
      { id: 1, x1: 550, y1: 220, x2: 740, y2: 220, period: 3.5, onTime: 2.0, offset: 0 },
      { id: 2, x1: 550, y1: 440, x2: 740, y2: 440, period: 3.5, onTime: 2.0, offset: 1.7 },
    ],
    masterSwitch: { x: 880, y: 330, isActivated: false },
  },

  // =========================================================================
  // LEVEL 3: برج المدينة وغرفة السيرفرات الذكية
  // =========================================================================
  {
    id: 3,
    nameAr: 'المرحلة 3: برج المدينة وغرفة السيرفرات الذكية',
    nameEn: 'Level 3: The Smart City Tower',
    subtitleAr: 'المؤقت يتناقص بسرعة (42 ثانية)! تفادَ 4 شحنات كهربائية سريعة وأشعة السيرفرات لإنارة البرج.',
    difficultyBadge: 'تحدي قوي وسريع',
    heroSkinName: 'اللمبة الذكية السايبر ⚡',
    trailColor: '#00f0ff',
    locationDescription: 'شبكة دوائر إلكترونية نيون، كبائن سيرفرات متقدمة، وأجهزة تحكم ذكية IoT',
    stars: 3,
    timeLimit: 42,
    theme: 'tower',
    width: 1000,
    height: 700,
    heroStart: { x: 500, y: 620 },
    initialLight: 125,
    walls: [
      { x: 0, y: 0, w: 1000, h: 20 },
      { x: 0, y: 680, w: 1000, h: 20 },
      { x: 0, y: 0, w: 20, h: 700 },
      { x: 980, y: 0, w: 20, h: 700 },
      { x: 180, y: 120, w: 50, h: 200, type: 'server' },
      { x: 180, y: 380, w: 50, h: 200, type: 'server' },
      { x: 380, y: 20, w: 50, h: 250, type: 'server' },
      { x: 380, y: 430, w: 50, h: 250, type: 'server' },
      { x: 580, y: 160, w: 50, h: 360, type: 'server' },
      { x: 780, y: 20, w: 50, h: 260, type: 'server' },
      { x: 780, y: 420, w: 50, h: 260, type: 'server' },
    ],
    decorations: [
      { type: 'elevator', x: 450, y: 630, w: 100, h: 40, label: 'مصعد الوصول السريع' },
    ],
    lamps: [
      { id: 1, x: 100, y: 100, isLit: false, name: 'سيرفر الحماية 1' },
      { id: 2, x: 100, y: 580, isLit: false, name: 'سيرفر الحماية 2' },
      { id: 3, x: 280, y: 350, isLit: false, name: 'لوحة التحكم السحابية' },
      { id: 4, x: 480, y: 100, isLit: false, name: 'كشافات مصفوفة الطاقة' },
      { id: 5, x: 480, y: 520, isLit: false, name: 'مفاتيح اللمس الذكية' },
      { id: 6, x: 680, y: 350, isLit: false, name: 'منظومة التغذية المركزية' },
      { id: 7, x: 880, y: 120, isLit: false, name: 'محطة الرادار والاتصال' },
      { id: 8, x: 880, y: 580, isLit: false, name: 'برج البث الضوئي' },
    ],
    sparks: [
      { id: 1, x: 100, y: 250, collected: false, type: 'spark' },
      { id: 2, x: 100, y: 450, collected: false, type: 'wire' },
      { id: 3, x: 280, y: 150, collected: false, type: 'spotlight' },
      { id: 4, x: 280, y: 550, collected: false, type: 'spark' },
      { id: 5, x: 480, y: 260, collected: false, type: 'wire' },
      { id: 6, x: 480, y: 380, collected: false, type: 'spotlight' },
      { id: 7, x: 680, y: 150, collected: false, type: 'spark' },
      { id: 8, x: 680, y: 550, collected: false, type: 'wire' },
      { id: 9, x: 880, y: 260, collected: false, type: 'spotlight' },
      { id: 10, x: 880, y: 440, collected: false, type: 'spark' },
    ],
    gates: [
      { id: 1, x: 780, y: 280, w: 50, h: 140, isOpen: false, requiredLamps: 4, labelAr: 'مغلقة: أنر 4 محطات لفتحها' },
    ],
    hazards: [
      { id: 1, x: 280, y: 180, vx: 0, vy: 3.2, radius: 15, type: 'patrol', minY: 80, maxY: 620 },
      { id: 2, x: 480, y: 520, vx: 0, vy: -3.5, radius: 15, type: 'patrol', minY: 80, maxY: 620 },
      { id: 3, x: 680, y: 200, vx: 0, vy: 3.6, radius: 15, type: 'patrol', minY: 80, maxY: 620 },
      { id: 4, x: 880, y: 350, vx: 0, vy: -3.0, radius: 15, type: 'patrol', minY: 150, maxY: 550 },
    ],
    laserBeams: [
      { id: 1, x1: 20, y1: 350, x2: 180, y2: 350, period: 3.0, onTime: 1.6, offset: 0 },
      { id: 2, x1: 780, y1: 350, x2: 980, y2: 350, period: 3.0, onTime: 1.6, offset: 1.5 },
    ],
    masterSwitch: { x: 920, y: 350, isActivated: false },
  },

  // =========================================================================
  // LEVEL 4: معركة زعيم المعرض الرئيسي (وحش الحمل الزائد Overload Boss)
  // =========================================================================
  {
    id: 4,
    nameAr: 'المرحلة 4: معركة المعرض الكبرى - وحش الحمل الزائد',
    nameEn: 'Level 4: Boss Battle - Overload Surge Monster',
    subtitleAr: 'ظهر وحش الحمل الزائد الكهربائي في المعرض! شغّل قواطع الأمان الأربعة في الأركان لحبسه وتأمين المعرض!',
    difficultyBadge: 'معركة الزعيم الأسطورية 👾🔥',
    heroSkinName: 'اللمبة الذهبية الملكية VIP 👑',
    trailColor: '#f59e0b',
    locationDescription: 'معرض فخم بأرضيات سوداء وذهبية، أجنحة عرض زجاجية، وقواطع أمان الزعيم الأربعة',
    stars: 4,
    timeLimit: 55,
    theme: 'showroom',
    width: 1050,
    height: 720,
    heroStart: { x: 525, y: 640 },
    initialLight: 130,
    walls: [
      { x: 0, y: 0, w: 1050, h: 20 },
      { x: 0, y: 700, w: 1050, h: 20 },
      { x: 0, y: 0, w: 20, h: 720 },
      { x: 1030, y: 0, w: 20, h: 720 },
      { x: 220, y: 160, w: 40, h: 140, type: 'showcase' },
      { x: 220, y: 420, w: 40, h: 140, type: 'showcase' },
      { x: 790, y: 160, w: 40, h: 140, type: 'showcase' },
      { x: 790, y: 420, w: 40, h: 140, type: 'showcase' },
    ],
    decorations: [
      { type: 'reception', x: 460, y: 610, w: 130, h: 30, label: 'استقبال المعرض الرئيسي' },
    ],
    boss: {
      x: 525,
      y: 320,
      vx: 2.2,
      vy: 1.8,
      radius: 38,
      hp: 100,
      maxHp: 100,
      isDefeated: false,
      nameAr: 'وحش الحمل الزائد الكهربائي (Overload Surge)',
      breakers: [
        { id: 1, x: 100, y: 100, nameAr: 'قاطع أمان جناح الثريات (الشمال الغربي)', isActivated: false },
        { id: 2, x: 950, y: 100, nameAr: 'قاطع أمان جناح المنازل الذكية (الشمال الشرقي)', isActivated: false },
        { id: 3, x: 100, y: 600, nameAr: 'قاطع أمان جناح الكابلات (الجنوب الغربي)', isActivated: false },
        { id: 4, x: 950, y: 600, nameAr: 'قاطع أمان جناح كشافات الطاقة (الجنوب الشرقي)', isActivated: false },
      ],
    },
    lamps: [
      { id: 1, x: 100, y: 350, isLit: false, name: 'ثريا الجناح الغربي' },
      { id: 2, x: 950, y: 350, isLit: false, name: 'ثريا الجناح الشرقي' },
      { id: 3, x: 525, y: 100, isLit: false, name: 'ثريا السقف المركزية VIP' },
      { id: 4, x: 525, y: 520, isLit: false, name: 'كشافات منصة الاستقبال' },
    ],
    sparks: [
      { id: 1, x: 300, y: 100, collected: false, type: 'wire' },
      { id: 2, x: 750, y: 100, collected: false, type: 'wire' },
      { id: 3, x: 300, y: 600, collected: false, type: 'wire' },
      { id: 4, x: 750, y: 600, collected: false, type: 'wire' },
      { id: 5, x: 180, y: 350, collected: false, type: 'spotlight' },
      { id: 6, x: 870, y: 350, collected: false, type: 'spotlight' },
    ],
    gates: [],
    hazards: [
      { id: 1, x: 350, y: 350, vx: 0, vy: 2.8, radius: 14, type: 'patrol', minY: 150, maxY: 550 },
      { id: 2, x: 700, y: 350, vx: 0, vy: -2.8, radius: 14, type: 'patrol', minY: 150, maxY: 550 },
    ],
    laserBeams: [],
    masterSwitch: { x: 525, y: 220, isActivated: false },
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

interface TrailNode {
  x: number
  y: number
  alpha: number
  color: string
}

export const GameEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Game state
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'level_won' | 'game_won'>('intro')
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(1)
  const [timeLeft, setTimeLeft] = useState(55)
  const [totalPlayTimeSec, setTotalPlayTimeSec] = useState(0)
  const [lightPower, setLightPower] = useState(140)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lampsLitCount, setLampsLitCount] = useState(0)
  const [totalLampsCount, setTotalLampsCount] = useState(0)
  const [collectedSparksCount, setCollectedSparksCount] = useState(0)
  const [totalSparksCount, setTotalSparksCount] = useState(0)
  const [bossHp, setBossHp] = useState(100)
  const [bannerAlert, setBannerAlert] = useState<{ msg: string; type: 'info' | 'error' | 'success' } | null>(null)

  // Leaderboard state (Starts 100% empty for real winners only)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [playerNameInput, setPlayerNameInput] = useState('')
  const [playerCityInput, setPlayerCityInput] = useState('بنغازي')
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('enarah_hero_leaderboard')
      if (saved) {
        const parsed = JSON.parse(saved)
        const isOldMock = parsed.some((p: any) => p.name === 'م. سفيان العريبي' || p.name === 'أحمد الفيتوري')
        if (isOldMock) {
          localStorage.removeItem('enarah_hero_leaderboard')
          return []
        }
        return parsed
      }
      return []
    } catch {
      return []
    }
  })

  // Game Reward Configuration (synced with admin-dashboard.html & MongoDB API)
  const [rewardConfig, setRewardConfig] = useState({
    isEnabled: true,
    rewardType: 'coupon' as 'coupon' | 'physical_gift' | 'no_reward',
    couponCode: 'ENARAH-HERO',
    discountTitle: 'كوبون أبطال الإنارة الذهبي',
    discountDetails: 'خصم خاص عند إرسال الكود مع طلبيتك عبر الواتساب!',
    giftItemName: 'كشاف سبوت لايت ذكي مجاني أو مفتاح لمس VIP',
    giftInstructions: 'استلم هديتك من أي فرع للإنارة الحديثة بإبراز هذه الشاشة!',
    victoryMsg: 'أنت بطل أسطوري حقيقي للإنارة! لقد حبست وحش الحمل الزائد وشغلت القاطع الرئيسي للمعرض بنجاح تام.',
  })

  // Load cloud reward configuration on startup & victory
  useEffect(() => {
    // 1. Local storage cache
    try {
      const local = localStorage.getItem('enarah_game_reward_config')
      if (local) {
        setRewardConfig((prev) => ({ ...prev, ...JSON.parse(local) }))
      }
    } catch {}

    // 2. Cloud fetch from backend API
    const fetchCloudRewards = async () => {
      try {
        const res = await fetch('https://enarah2.vercel.app/api/get-users')
        if (res.ok) {
          const data = await res.json()
          if (data && data.success && Array.isArray(data.data)) {
            const updates = data.data.filter((item: any) => item.email === 'admin_game_rewards@app.local')
            if (updates.length > 0) {
              const latest = updates[updates.length - 1] // latest item
              const parsed = JSON.parse(latest.phone).config
              if (parsed) {
                setRewardConfig((prev) => ({ ...prev, ...parsed }))
                localStorage.setItem('enarah_game_reward_config', JSON.stringify(parsed))
              }
            }
          }
        }
      } catch (err) {
        console.error('Cloud rewards sync:', err)
      }
    }

    fetchCloudRewards()
  }, [gameState])

  // Current active level clone
  const levelRef = useRef<LevelData>(JSON.parse(JSON.stringify(LEVELS[0])))
  const timeLeftRef = useRef<number>(55)

  // Hero state (including lightweight Trail buffer)
  const heroRef = useRef({
    x: 70,
    y: 530,
    vx: 0,
    vy: 0,
    radius: 18,
    speed: 3.8,
    facing: 'left' as 'left' | 'right' | 'up' | 'down',
    walkCycle: 0,
    blinkTimer: 0,
    isMoving: false,
    invincibleTimer: 0,
    trail: [] as TrailNode[],
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
    heroRef.current.trail = []
    setLampsLitCount(0)
    setTotalLampsCount(cloned.lamps.length)
    setCollectedSparksCount(0)
    setTotalSparksCount(cloned.sparks.length)
    setLightPower(cloned.initialLight)
    particlesRef.current = []
    keysRef.current = {}
    joystickRef.current = {
      active: false,
      touchId: null,
      baseX: 0,
      baseY: 0,
      vectorX: 0,
      vectorY: 0,
      intensity: 0,
    }
    setJoystickData({
      active: false,
      knobX: 0,
      knobY: 0,
      angleDeg: 0,
      intensity: 0,
    })

    if (cloned.boss) {
      setBossHp(cloned.boss.hp)
      sound.playBossRoar()
    }
  }, [])

  // Fullscreen & Immersive Mode Management
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true)
      if (containerRef.current && (containerRef.current as any).requestFullscreen) {
        (containerRef.current as any).requestFullscreen().catch(() => {})
      } else if (containerRef.current && (containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen()
      }
    } else {
      setIsFullscreen(false)
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      } else if ((document as any).webkitFullscreenElement && (document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      }
    }
  }

  // Synchronize browser Fullscreen changes (e.g., when pressing Esc)
  useEffect(() => {
    const handleFsChange = () => {
      const isCurrentlyFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement)
      setIsFullscreen(isCurrentlyFs)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange)
      document.removeEventListener('webkitfullscreenchange', handleFsChange)
    }
  }, [])

  // Lock body scroll only while in Fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      const origOverflow = document.body.style.overflow
      const origOverscroll = document.body.style.overscrollBehavior

      document.body.style.overflow = 'hidden'
      document.body.style.overscrollBehavior = 'none'

      return () => {
        document.body.style.overflow = origOverflow
        document.body.style.overscrollBehavior = origOverscroll
      }
    }
  }, [isFullscreen])

  // Start game
  const startGame = (levelIdx = 0) => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    setCurrentLevelIdx(levelIdx)
    loadLevel(levelIdx)
    if (levelIdx === 0) {
      setScore(0)
      setTotalPlayTimeSec(0)
      setHasSubmittedScore(false)
    }
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
    setTimeout(() => setBannerAlert(null), 3800)
  }

  const isResettingRef = useRef(false)

  // Reset stage upon injury or timeout
  const handleHeroInjured = (reason = 'hit') => {
    if (isResettingRef.current) return
    isResettingRef.current = true
    heroRef.current.invincibleTimer = 999

    sound.playShortCircuit()
    spawnParticles(heroRef.current.x, heroRef.current.y, '#ef4444', 40, 3.5)
    
    if (reason === 'timeout') {
      showAlert('⌛ انتهت طاقة البطارية والوقت! تحرك أسرع واجمع كابلات النحاس لكسب (+5 ثوانٍ)!', 'error')
    } else if (reason === 'boss') {
      showAlert('💥 صدمة كهربائية هائلة من وحش الحمل الزائد! أعد المحاولة واستهدف قواطع الأمان!', 'error')
    } else {
      showAlert('💥 تماس كهربائي شديد! انقطع التيار وأعيدت المرحلة من نقطة البداية!', 'error')
    }
    
    setTimeout(() => {
      loadLevel(currentLevelIdx)
      isResettingRef.current = false
    }, 450)
  }

  // Submit player score to Leaderboard
  const handleSubmitLeaderboard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerNameInput.trim()) return

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: playerNameInput.trim(),
      city: playerCityInput.trim() || 'بنغازي',
      score: score,
      timeTakenSec: Math.max(totalPlayTimeSec, 45),
      date: 'الآن',
    }

    const updated = [newEntry, ...leaderboard]
      .sort((a, b) => b.score - a.score || a.timeTakenSec - b.timeTakenSec)
      .slice(0, 10)

    setLeaderboard(updated)
    setHasSubmittedScore(true)
    try {
      localStorage.setItem('enarah_hero_leaderboard', JSON.stringify(updated))
    } catch {}

    sound.playBonusTime()
    showAlert('🏆 رائع! تم تسجيل اسمك في لوحة شرف أبطال الإنارة الحديثة!', 'success')
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

  // Virtual Analog Joystick State
  const [joystickData, setJoystickData] = useState({
    active: false,
    knobX: 0,
    knobY: 0,
    angleDeg: 0,
    intensity: 0,
  })

  const joystickRef = useRef({
    active: false,
    touchId: null as number | null,
    baseX: 0,
    baseY: 0,
    vectorX: 0,
    vectorY: 0,
    intensity: 0,
  })

  const handleJoystickStart = (clientX: number, clientY: number, rect: DOMRect, touchId: number | null = null) => {
    joystickRef.current.active = true
    joystickRef.current.touchId = touchId
    joystickRef.current.baseX = rect.left + rect.width / 2
    joystickRef.current.baseY = rect.top + rect.height / 2
    handleJoystickMove(clientX, clientY)
  }

  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!joystickRef.current.active) return
    const dx = clientX - joystickRef.current.baseX
    const dy = clientY - joystickRef.current.baseY
    const dist = Math.hypot(dx, dy)
    const maxRadius = 45

    const intensity = Math.min(dist / maxRadius, 1.0)
    const normX = dist > 0 ? dx / dist : 0
    const normY = dist > 0 ? dy / dist : 0

    const clampedDist = Math.min(dist, maxRadius)
    const knobX = normX * clampedDist
    const knobY = normY * clampedDist

    joystickRef.current.vectorX = normX * intensity
    joystickRef.current.vectorY = normY * intensity
    joystickRef.current.intensity = intensity

    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI

    setJoystickData({
      active: true,
      knobX,
      knobY,
      angleDeg,
      intensity,
    })
  }

  const handleJoystickEnd = () => {
    joystickRef.current.active = false
    joystickRef.current.touchId = null
    joystickRef.current.vectorX = 0
    joystickRef.current.vectorY = 0
    joystickRef.current.intensity = 0
    setJoystickData({
      active: false,
      knobX: 0,
      knobY: 0,
      angleDeg: 0,
      intensity: 0,
    })
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

  // Calculate remaining uncollected items & unlit lamps
  const remainingLamps = levelRef.current.lamps.filter((l) => !l.isLit).length
  const remainingSparks = levelRef.current.sparks.filter((s) => !s.collected).length
  const remainingBreakers = levelRef.current.boss ? levelRef.current.boss.breakers.filter((b) => !b.isActivated).length : 0
  const isBossDefeated = levelRef.current.boss ? levelRef.current.boss.isDefeated : true
  const totalRemaining = remainingLamps + remainingSparks + remainingBreakers
  const isStage100PercentComplete = totalRemaining === 0 && isBossDefeated

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
        // Track Total Playtime
        setTotalPlayTimeSec((prev) => prev + dt)

        // Countdown Timer Logic
        timeLeftRef.current -= dt
        setTimeLeft(Math.max(Math.ceil(timeLeftRef.current), 0))

        if (timeLeftRef.current <= 0) {
          handleHeroInjured('timeout')
          return
        }

        if (hero.invincibleTimer > 0) {
          hero.invincibleTimer -= dt
        }

        // 1. Process Input (Keyboard + 360-Degree Analog Virtual Joystick)
        let moveX = 0
        let moveY = 0

        if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) moveX += 1
        if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) moveX -= 1
        if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) moveY -= 1
        if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) moveY += 1

        // Analog 360° Joystick Velocity
        if (joystickRef.current.active) {
          moveX += joystickRef.current.vectorX
          moveY += joystickRef.current.vectorY
        }

        const inputMagnitude = Math.hypot(moveX, moveY)
        if (inputMagnitude > 0.05) {
          const speedMultiplier = joystickRef.current.active 
            ? Math.min(inputMagnitude, 1.0) 
            : 1.0

          moveX = (moveX / inputMagnitude) * hero.speed * speedMultiplier
          moveY = (moveY / inputMagnitude) * hero.speed * speedMultiplier
          hero.isMoving = true
          hero.walkCycle += dt * 14 * speedMultiplier

          if (Math.abs(moveX) > Math.abs(moveY)) {
            hero.facing = moveX > 0 ? 'right' : 'left'
          } else {
            hero.facing = moveY > 0 ? 'down' : 'up'
          }

          // Ultra-Lightweight Neon Light Trail (Max 8 points)
          if (Math.floor(time * 0.03) % 2 === 0) {
            hero.trail.unshift({
              x: hero.x,
              y: hero.y,
              alpha: 0.7,
              color: level.trailColor,
            })
            if (hero.trail.length > 8) {
              hero.trail.pop()
            }
          }
        } else {
          hero.isMoving = false
        }

        // Decay light trail
        for (let i = hero.trail.length - 1; i >= 0; i--) {
          hero.trail[i].alpha -= dt * 2.2
          if (hero.trail[i].alpha <= 0) {
            hero.trail.splice(i, 1)
          }
        }

        // 2. Collision with Walls and Closed Gates
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

        // 3. Update Hazards
        for (const h of level.hazards) {
          h.x += h.vx
          h.y += h.vy

          if (h.minX !== undefined && (h.x <= h.minX || h.x >= h.maxX!)) h.vx *= -1
          if (h.minY !== undefined && (h.y <= h.minY || h.y >= h.maxY!)) h.vy *= -1

          const hDist = Math.hypot(hero.x - h.x, hero.y - h.y)
          if (hDist < hero.radius + h.radius && hero.invincibleTimer <= 0) {
            handleHeroInjured('hit')
            break
          }
        }

        // 4. Update Final Boss
        if (level.boss && !level.boss.isDefeated) {
          const boss = level.boss
          boss.x += boss.vx
          boss.y += boss.vy

          if (boss.x <= 350 || boss.x >= 700) boss.vx *= -1
          if (boss.y <= 240 || boss.y >= 450) boss.vy *= -1

          const bDist = Math.hypot(hero.x - boss.x, hero.y - boss.y)
          if (bDist < hero.radius + boss.radius && hero.invincibleTimer <= 0) {
            handleHeroInjured('boss')
            return
          }

          // Check Boss Breakers
          for (const brk of boss.breakers) {
            if (!brk.isActivated) {
              const brkDist = Math.hypot(hero.x - brk.x, hero.y - brk.y)
              if (brkDist < hero.radius + 28) {
                brk.isActivated = true
                sound.playBossHit()
                
                boss.hp -= 25
                setBossHp(boss.hp)
                spawnParticles(brk.x, brk.y, '#38bdf8', 35, 2.5)
                spawnParticles(boss.x, boss.y, '#ef4444', 40, 3)

                if (boss.hp <= 0) {
                  boss.isDefeated = true
                  sound.playVictory()
                  spawnParticles(boss.x, boss.y, '#10b981', 80, 4)
                  showAlert('🎉 رائع جداً! تم حبس وحش الحمل الزائد وتأمين المعرض بالكامل!', 'success')
                } else {
                  showAlert(`⚡ تم تفعيل ${brk.nameAr.split('(')[0]}! طاقة الزعيم: ${boss.hp}%`, 'success')
                }
              }
            }
          }
        }

        // 5. Check Cycling Laser Beams
        const curSeconds = time * 0.001
        for (const beam of level.laserBeams) {
          const cyclePos = (curSeconds + beam.offset) % beam.period
          const isLaserDeadly = cyclePos < beam.onTime

          if (isLaserDeadly) {
            const x1 = beam.x1, y1 = beam.y1, x2 = beam.x2, y2 = beam.y2
            const px = hero.x, py = hero.y
            const l2 = Math.hypot(x2 - x1, y2 - y1) ** 2
            let t = 0
            if (l2 > 0) {
              t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2))
            }
            const projX = x1 + t * (x2 - x1)
            const projY = y1 + t * (y2 - y1)
            const distToBeam = Math.hypot(px - projX, py - projY)

            if (distToBeam < hero.radius + 4 && hero.invincibleTimer <= 0) {
              handleHeroInjured('laser')
              break
            }
          }
        }

        // 6. Collect Sparks & Powerups
        for (const spark of level.sparks) {
          if (!spark.collected) {
            const dist = Math.hypot(hero.x - spark.x, hero.y - spark.y)
            if (dist < hero.radius + 16) {
              spark.collected = true
              setCollectedSparksCount((prev) => prev + 1)
              
              if (spark.type === 'wire') {
                sound.playWire()
                sound.playBonusTime()
                setScore((prev) => prev + 150 * combo)
                
                timeLeftRef.current = Math.min(timeLeftRef.current + 5, level.timeLimit + 10)
                showAlert('⚡ كابل نحاس إيطالي أصلي (+5 ثوانٍ وقت إضافي!)', 'success')
                
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
                spawnParticles(spark.x, spark.y, '#f59e0b', 18, 1.3)
              } else if (spark.type === 'spotlight') {
                sound.playSpark()
                sound.playBonusTime()
                setScore((prev) => prev + 200 * combo)
                
                timeLeftRef.current = Math.min(timeLeftRef.current + 5, level.timeLimit + 10)
                showAlert('💡 سبوت لايت ذكي (+5 ثوانٍ وقت إضافي!)', 'success')

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

        // 7. Light up Dark Lamps
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

        // 8. Check Master Switchboard
        const masterDist = Math.hypot(hero.x - level.masterSwitch.x, hero.y - level.masterSwitch.y)
        if (masterDist < hero.radius + 32 && !level.masterSwitch.isActivated) {
          const currentRemainingLamps = level.lamps.filter((l) => !l.isLit).length
          const currentRemainingSparks = level.sparks.filter((s) => !s.collected).length
          const currentRemainingBreakers = level.boss ? level.boss.breakers.filter((b) => !b.isActivated).length : 0
          const totalLeft = currentRemainingLamps + currentRemainingSparks + currentRemainingBreakers

          if (totalLeft > 0 || (level.boss && !level.boss.isDefeated)) {
            sound.playLockedBuzz()
            showAlert(`⚠️ القاطع مقفل! يجب إنارة كافة المصابيح وتفعيل قواطع الأمان الأربعة لهزيمة الزعيم! (متبقي: ${totalLeft})`, 'error')
            hero.x -= moveX * 4
            hero.y -= moveY * 4
          } else {
            level.masterSwitch.isActivated = true
            sound.playMasterSwitch()
            setScore((prev) => prev + 3000)
            spawnParticles(level.masterSwitch.x, level.masterSwitch.y, '#10b981', 80, 4)

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

      // Update Particles
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

      // =========================================================================
      // VIBRANT THEMED ENVIRONMENT RENDERING
      // =========================================================================
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (level.theme === 'street') {
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#334155'
        ctx.fillRect(20, 20, 880, 80)
        ctx.fillRect(20, 500, 880, 100)

        ctx.strokeStyle = '#facc15'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(20, 100)
        ctx.lineTo(900, 100)
        ctx.moveTo(20, 500)
        ctx.lineTo(900, 500)
        ctx.stroke()

        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 3.5
        ctx.setLineDash([25, 20])
        ctx.beginPath()
        ctx.moveTo(20, 300)
        ctx.lineTo(900, 300)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = '#166534'
        ctx.fillRect(420, 140, 140, 320)
        ctx.strokeStyle = '#22c55e'
        ctx.lineWidth = 2
        ctx.strokeRect(420, 140, 140, 320)

        for (const dec of level.decorations) {
          if (dec.type === 'crosswalk' && dec.w && dec.h) {
            ctx.fillStyle = '#ffffff'
            for (let y = dec.y; y < dec.y + dec.h; y += 22) {
              ctx.fillRect(dec.x, y, dec.w, 12)
            }
          }
        }
      } else if (level.theme === 'villa') {
        ctx.fillStyle = '#78350f'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.strokeStyle = '#451a03'
        ctx.lineWidth = 1.5
        for (let y = 0; y < canvas.height; y += 28) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
        for (let x = 0; x < canvas.width; x += 120) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }

        for (const dec of level.decorations) {
          if (dec.type === 'carpet' && dec.w && dec.h) {
            ctx.fillStyle = '#881337'
            ctx.fillRect(dec.x, dec.y, dec.w, dec.h)
            ctx.strokeStyle = '#f59e0b'
            ctx.lineWidth = 3
            ctx.strokeRect(dec.x, dec.y, dec.w, dec.h)
            ctx.strokeRect(dec.x + 10, dec.y + 10, dec.w - 20, dec.h - 20)
          } else if (dec.type === 'sofa' && dec.w && dec.h) {
            ctx.fillStyle = '#27272a'
            ctx.roundRect(dec.x, dec.y, dec.w, dec.h, 8)
            ctx.fill()
            ctx.strokeStyle = '#d4af37'
            ctx.lineWidth = 2
            ctx.stroke()
          } else if (dec.type === 'dining_table' && dec.w && dec.h) {
            ctx.fillStyle = '#92400e'
            ctx.roundRect(dec.x, dec.y, dec.w, dec.h, 10)
            ctx.fill()
            ctx.strokeStyle = '#f59e0b'
            ctx.lineWidth = 2
            ctx.stroke()
          }
        }
      } else if (level.theme === 'tower') {
        ctx.fillStyle = '#082f49'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.strokeStyle = '#00f0ff'
        ctx.lineWidth = 2
        for (let x = 0; x < canvas.width; x += 55) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y < canvas.height; y += 55) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }

        for (const dec of level.decorations) {
          if (dec.type === 'elevator' && dec.w && dec.h) {
            ctx.fillStyle = '#0284c7'
            ctx.fillRect(dec.x, dec.y, dec.w, dec.h)
            ctx.strokeStyle = '#38bdf8'
            ctx.lineWidth = 3
            ctx.strokeRect(dec.x, dec.y, dec.w, dec.h)
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 11px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('▲ ELEVATOR / المصعد ▲', dec.x + dec.w / 2, dec.y + dec.h / 2 + 4)
          }
        }
      } else {
        // LEVEL 4: Showroom Floor
        ctx.fillStyle = '#18181b'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.strokeStyle = '#d97706'
        ctx.lineWidth = 1.5
        const sz = 60
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

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'
        ctx.lineWidth = 3
        ctx.setLineDash([8, 8])
        ctx.beginPath()
        ctx.arc(525, 340, 220, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Draw Walls / Architecture
      for (const wall of level.walls) {
        if (level.theme === 'street') {
          ctx.fillStyle = '#0f172a'
          ctx.strokeStyle = '#475569'
          ctx.lineWidth = 2.5
          ctx.fillRect(wall.x, wall.y, wall.w, wall.h)
          ctx.strokeRect(wall.x, wall.y, wall.w, wall.h)

          if (wall.type === 'building' && wall.w >= 100 && wall.h >= 100) {
            ctx.fillStyle = '#fef08a'
            for (let wx = wall.x + 20; wx < wall.x + wall.w - 20; wx += 40) {
              for (let wy = wall.y + 25; wy < wall.y + wall.h - 25; wy += 45) {
                ctx.fillRect(wx, wy, 16, 20)
              }
            }
          }
        } else if (level.theme === 'villa') {
          ctx.fillStyle = '#292524'
          ctx.strokeStyle = '#d4af37'
          ctx.lineWidth = 3
          ctx.fillRect(wall.x, wall.y, wall.w, wall.h)
          ctx.strokeRect(wall.x, wall.y, wall.w, wall.h)
        } else if (level.theme === 'tower') {
          ctx.fillStyle = '#0c4a6e'
          ctx.strokeStyle = '#00f0ff'
          ctx.lineWidth = 2.5
          ctx.fillRect(wall.x, wall.y, wall.w, wall.h)
          ctx.strokeRect(wall.x, wall.y, wall.w, wall.h)

          if (wall.type === 'server' && wall.h >= 100) {
            ctx.fillStyle = '#10b981'
            ctx.fillRect(wall.x + 8, wall.y + 15, 8, 8)
            ctx.fillStyle = '#38bdf8'
            ctx.fillRect(wall.x + 8, wall.y + 35, 8, 8)
            ctx.fillStyle = '#f59e0b'
            ctx.fillRect(wall.x + 8, wall.y + 55, 8, 8)
          }
        } else {
          ctx.fillStyle = '#27272a'
          ctx.strokeStyle = '#f59e0b'
          ctx.lineWidth = 3
          ctx.fillRect(wall.x, wall.y, wall.w, wall.h)
          ctx.strokeRect(wall.x, wall.y, wall.w, wall.h)
        }
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

      // Draw Cycling Laser Beams
      for (const beam of level.laserBeams) {
        const curSec = time * 0.001
        const pos = (curSec + beam.offset) % beam.period
        const isDeadly = pos < beam.onTime

        ctx.save()
        ctx.lineWidth = isDeadly ? 4 : 1.5
        ctx.strokeStyle = isDeadly ? '#ef4444' : '#10b981'
        if (isDeadly) {
          ctx.shadowColor = '#f87171'
          ctx.shadowBlur = 16
        } else {
          ctx.setLineDash([6, 6])
        }

        ctx.beginPath()
        ctx.moveTo(beam.x1, beam.y1)
        ctx.lineTo(beam.x2, beam.y2)
        ctx.stroke()

        ctx.fillStyle = isDeadly ? '#ef4444' : '#10b981'
        ctx.beginPath()
        ctx.arc(beam.x1, beam.y1, 5, 0, Math.PI * 2)
        ctx.arc(beam.x2, beam.y2, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Draw Final Boss & Breakers
      if (level.boss) {
        const boss = level.boss

        for (const brk of boss.breakers) {
          ctx.save()
          ctx.translate(brk.x, brk.y)

          ctx.fillStyle = brk.isActivated ? '#065f46' : '#1e1b4b'
          ctx.strokeStyle = brk.isActivated ? '#10b981' : '#38bdf8'
          ctx.lineWidth = 3
          if (brk.isActivated) {
            ctx.shadowColor = '#10b981'
            ctx.shadowBlur = 18
          }
          ctx.beginPath()
          ctx.roundRect(-22, -22, 44, 44, 10)
          ctx.fill()
          ctx.stroke()

          ctx.fillStyle = brk.isActivated ? '#ffffff' : '#38bdf8'
          ctx.font = 'bold 12px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(brk.isActivated ? '✓ ON' : '⚡ PULL', 0, 4)

          ctx.restore()

          if (brk.isActivated && !boss.isDefeated) {
            ctx.save()
            ctx.strokeStyle = '#38bdf8'
            ctx.lineWidth = 3
            ctx.shadowColor = '#00f0ff'
            ctx.shadowBlur = 14
            ctx.beginPath()
            ctx.moveTo(brk.x, brk.y)
            ctx.lineTo(boss.x, boss.y)
            ctx.stroke()
            ctx.restore()
          }
        }

        ctx.save()
        ctx.translate(boss.x, boss.y)

        if (!boss.isDefeated) {
          const bossPulse = Math.sin(time * 0.008) * 4
          const bossRad = boss.radius + bossPulse

          const auraGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, bossRad + 20)
          auraGrad.addColorStop(0, '#ef4444')
          auraGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.8)')
          auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)')
          ctx.fillStyle = auraGrad
          ctx.beginPath()
          ctx.arc(0, 0, bossRad + 20, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(0, 0, bossRad, 0, Math.PI * 2)
          ctx.fillStyle = '#7f1d1d'
          ctx.strokeStyle = '#f87171'
          ctx.lineWidth = 4
          ctx.shadowColor = '#ef4444'
          ctx.shadowBlur = 25
          ctx.fill()
          ctx.stroke()

          for (let i = 0; i < 4; i++) {
            const orbAngle = time * 0.006 + (i * Math.PI) / 2
            const ox = Math.cos(orbAngle) * (bossRad + 14)
            const oy = Math.sin(orbAngle) * (bossRad + 14)
            ctx.fillStyle = '#fde047'
            ctx.shadowColor = '#facc15'
            ctx.shadowBlur = 10
            ctx.beginPath()
            ctx.arc(ox, oy, 4.5, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.fillStyle = '#fef08a'
          ctx.beginPath()
          ctx.arc(-12, -8, 6, 0, Math.PI * 2)
          ctx.arc(12, -8, 6, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = '#dc2626'
          ctx.beginPath()
          ctx.arc(-11, -8, 3, 0, Math.PI * 2)
          ctx.arc(13, -8, 3, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = '#fef08a'
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.moveTo(-12, 14)
          ctx.lineTo(-6, 8)
          ctx.lineTo(0, 14)
          ctx.lineTo(6, 8)
          ctx.lineTo(12, 14)
          ctx.stroke()

          ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'
          ctx.roundRect(-45, -55, 90, 10, 3)
          ctx.fill()

          ctx.fillStyle = boss.hp > 50 ? '#ef4444' : '#f59e0b'
          ctx.roundRect(-44, -54, (88 * boss.hp) / boss.maxHp, 8, 2)
          ctx.fill()

          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 8px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(`⚡ طاقة الزعيم: ${boss.hp}%`, 0, -60)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, boss.radius - 4, 0, Math.PI * 2)
          ctx.fillStyle = '#064e3b'
          ctx.strokeStyle = '#10b981'
          ctx.lineWidth = 4
          ctx.shadowColor = '#34d399'
          ctx.shadowBlur = 25
          ctx.fill()
          ctx.stroke()

          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 10px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('🔒 الزعيم محبوس', 0, 3)
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
          ctx.arc(Math.cos(orbitAngle) * (h.radius + 6), Math.sin(orbitAngle) * (h.radius + 6), 3.5, 0, Math.PI * 2)
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

      // Draw Environmental Lamps
      for (const lamp of level.lamps) {
        ctx.save()
        ctx.translate(lamp.x, lamp.y)

        if (level.theme === 'street') {
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
      // FEATURE 4: DRAW NEON LIGHT TRAIL (أثر النيون المتوهج فائق السلاسة)
      // ==========================================
      for (let i = 0; i < hero.trail.length; i++) {
        const node = hero.trail[i]
        const radius = (hero.radius - i * 1.5) * 0.6
        if (radius > 2) {
          ctx.save()
          ctx.globalAlpha = node.alpha * 0.6
          ctx.fillStyle = node.color
          ctx.shadowColor = node.color
          ctx.shadowBlur = 12
          ctx.beginPath()
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      // ==========================================
      // DRAW HERO MASCOT
      // ==========================================
      ctx.save()
      ctx.translate(hero.x, hero.y)

      const bobbing = hero.isMoving ? Math.sin(hero.walkCycle) * 2.5 : Math.sin(time * 0.003) * 1.5
      const lookOffsetX = hero.facing === 'left' ? -2.5 : hero.facing === 'right' ? 2.5 : 0
      const lookOffsetY = hero.facing === 'up' ? -2 : hero.facing === 'down' ? 1.5 : 0

      if (level.theme === 'street') {
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

        ctx.strokeStyle = 'rgba(251, 146, 60, 0.8)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(-4, -18 + bobbing)
        ctx.lineTo(-2, -10 + bobbing)
        ctx.lineTo(2, -10 + bobbing)
        ctx.lineTo(4, -18 + bobbing)
        ctx.stroke()
      } else if (level.theme === 'villa') {
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
        ctx.fillStyle = '#09090b'
        ctx.beginPath()
        ctx.roundRect(-9 + lookOffsetX, -16 + bobbing + lookOffsetY, 18, 5, 2)
        ctx.fill()
        ctx.strokeStyle = '#00f0ff'
        ctx.lineWidth = 1
        ctx.stroke()
      } else {
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

      // Blue Royal Shirt
      ctx.fillStyle = '#1d4ed8'
      ctx.beginPath()
      ctx.roundRect(-12, 5 + bobbing, 24, 16, 4)
      ctx.fill()

      ctx.strokeStyle = level.theme === 'showroom' || level.theme === 'villa' ? '#f59e0b' : '#ffffff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(-5, 5 + bobbing)
      ctx.lineTo(0, 9 + bobbing)
      ctx.lineTo(5, 5 + bobbing)
      ctx.stroke()

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

      // Draw Particles
      for (const p of particlesRef.current) {
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // DYNAMIC FOG OF WAR
      if (gameState === 'playing') {
        ctx.save()
        const darkCanvas = document.createElement('canvas')
        darkCanvas.width = canvas.width
        darkCanvas.height = canvas.height
        const darkCtx = darkCanvas.getContext('2d')

        if (darkCtx) {
          darkCtx.fillStyle = 'rgba(3, 7, 18, 0.52)'
          darkCtx.fillRect(0, 0, darkCanvas.width, darkCanvas.height)

          darkCtx.globalCompositeOperation = 'destination-out'

          // 1. Hero's Light Circle
          const heroLightGrad = darkCtx.createRadialGradient(hero.x, hero.y, 10, hero.x, hero.y, lightPower)
          heroLightGrad.addColorStop(0, 'rgba(0, 0, 0, 1)')
          heroLightGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.9)')
          heroLightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
          darkCtx.fillStyle = heroLightGrad
          darkCtx.beginPath()
          darkCtx.arc(hero.x, hero.y, lightPower, 0, Math.PI * 2)
          darkCtx.fill()

          // 2. Permanent light circles around Lit Lamps
          for (const lamp of level.lamps) {
            if (lamp.isLit) {
              const lampGrad = darkCtx.createRadialGradient(lamp.x, lamp.y, 5, lamp.x, lamp.y, 125)
              lampGrad.addColorStop(0, 'rgba(0, 0, 0, 1)')
              lampGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.9)')
              lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
              darkCtx.fillStyle = lampGrad
              darkCtx.beginPath()
              darkCtx.arc(lamp.x, lamp.y, 125, 0, Math.PI * 2)
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
    <div 
      ref={containerRef}
      className={`w-full max-w-5xl mx-auto flex flex-col items-center select-none transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] bg-[#07080b] w-screen h-[100dvh] flex flex-col justify-between p-1.5 sm:p-3 overflow-hidden select-none touch-none'
          : 'relative min-h-[calc(100dvh-7rem)] flex flex-col justify-between'
      }`}
    >
      
      {/* Dynamic Floating Banner Alert (Toast Overlay - Perfectly Centered in RTL and LTR) */}
      {bannerAlert && (
        <div 
          className={`absolute top-12 sm:top-14 inset-x-0 mx-auto z-50 w-[90%] max-w-sm py-2 px-4 border rounded-2xl text-center text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md transition-all animate-bounce ${
            bannerAlert.type === 'error'
              ? 'bg-red-950/95 border-red-500/70 text-red-200 shadow-red-950/50'
              : bannerAlert.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/70 text-emerald-200 shadow-emerald-950/50'
              : 'bg-blue-600/95 border-blue-400/50 text-white shadow-blue-950/50'
          }`}
          style={{ left: 0, right: 0, margin: '0 auto' }}
        >
          {bannerAlert.msg}
        </div>
      )}

      {/* Game Top HUD Bar - Ultra-Clean Unified Toolbar */}
      <div className="w-full bg-[#111215]/95 border border-zinc-800/80 rounded-2xl px-2 py-1.5 mb-1.5 shrink-0 flex items-center justify-between gap-1 shadow-md backdrop-blur-md">
        
        {/* Left: Stage info & Timer */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-1 bg-zinc-900/90 px-2 py-1 rounded-lg border border-zinc-800 text-[11px] sm:text-xs font-bold text-blue-400">
            <Compass className="w-3 h-3" />
            <span>مـ{currentLevelIdx + 1}</span>
          </div>

          <div 
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border font-mono font-bold text-[11px] sm:text-xs ${
              timeLeft <= 10
                ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                : timeLeft <= 20
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-zinc-900/90 border-zinc-800 text-emerald-400'
            }`}
          >
            <Timer className="w-3 h-3" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Center: Lamps & Materials count */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-1 bg-zinc-900/90 px-1.5 sm:px-2 py-1 rounded-lg border border-zinc-800 text-[11px] sm:text-xs text-zinc-300" title="المصابيح المنارة">
            <Lightbulb className="w-3 h-3 text-blue-400 fill-current" />
            <span className="font-bold">{lampsLitCount}/{totalLampsCount}</span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-900/90 px-1.5 sm:px-2 py-1 rounded-lg border border-zinc-800 text-[11px] sm:text-xs text-zinc-300" title="المواد المجمعة">
            <Zap className="w-3 h-3 text-amber-400 fill-current" />
            <span className="font-bold">{collectedSparksCount}/{totalSparksCount}</span>
          </div>

          {/* Master Switch Status Badge */}
          <div 
            className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold border transition-all ${
              isStage100PercentComplete
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 animate-pulse'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-400'
            }`}
            title="حالة القاطع الرئيسي"
          >
            {isStage100PercentComplete ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-zinc-500" />}
            <span className="hidden sm:inline">{isStage100PercentComplete ? 'جاهز' : `${totalRemaining}`}</span>
          </div>
        </div>

        {/* Right: Quick Action buttons (Leaderboard, Mute, Restart, Fullscreen, Exit) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 transition-all cursor-pointer active:scale-95"
            title="لوحة الشرف"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          
          <button
            onClick={() => startGame(currentLevelIdx)}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95"
            title="إعادة المرحلة"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {isFullscreen ? (
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-md"
              title="خروج من وضع الشاشة الكاملة"
            >
              <X className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          ) : (
            <button
              onClick={toggleFullscreen}
              className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1"
              title="تكبير الشاشة للعب المريح"
            >
              <Maximize2 className="w-3 h-3 text-blue-400" />
              <span className="hidden sm:inline">ملء الشاشة</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Canvas Viewport - Auto-flex to fit screen perfectly */}
      <div className="relative w-full flex-1 min-h-0 bg-black rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl flex items-center justify-center">
        
        <canvas
          ref={canvasRef}
          width={LEVELS[currentLevelIdx].width}
          height={LEVELS[currentLevelIdx].height}
          className="w-full h-full max-h-full object-contain"
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
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed mb-5 font-normal">
              تحدي الأبطال الحقيقي! انطلق بالأثر الضوئي المتوهج، نافس على لوحة الشرف، واحبس وحش الحمل الزائد في المعرض الرئيسي!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <button
                onClick={() => {
                  setIsFullscreen(true);
                  startGame(0);
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 shadow-lg"
              >
                <Maximize2 className="w-4 h-4" />
                <span>العب بملء الشاشة ⛶ (أفضل تجربة)</span>
              </button>

              <button
                onClick={() => startGame(0)}
                className="px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current text-blue-400" />
                <span>لعب عادي</span>
              </button>

              <button
                onClick={() => setShowLeaderboard(true)}
                className="px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>لوحة الشرف</span>
              </button>
            </div>
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

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 mb-6 text-xs text-zinc-300 space-y-1.5 text-right">
              <div>📍 العالم القادم: <span className="text-blue-400 font-bold">{LEVELS[currentLevelIdx + 1]?.nameAr}</span></div>
              <div className="text-amber-400 font-semibold">مظهر البطل الجديد: {LEVELS[currentLevelIdx + 1]?.heroSkinName}</div>
              {LEVELS[currentLevelIdx + 1]?.boss && (
                <div className="text-red-400 font-bold animate-pulse">⚠️ تحذير: معركة الزعيم الكبرى (وحش الحمل الزائد)!</div>
              )}
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
            SCREEN: FINAL VICTORY & LEADERBOARD ENTRY SCREEN
        ========================================== */}
        {gameState === 'game_won' && (
          <div className="absolute inset-0 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 overflow-y-auto">
            <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mb-3 text-amber-400 animate-pulse">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white mb-1">
              🎉 مبروك! هزمت وحش الحمل الزائد وأنرت المعرض والمدينة!
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-md mb-4 leading-relaxed">
              {rewardConfig.victoryMsg || 'أنت بطل أسطوري حقيقي للإنارة! لقد حبست وحش الحمل الزائد وشغلت القاطع الرئيسي للمعرض بنجاح تام.'}
            </p>

            {/* Submit to Leaderboard Form */}
            {!hasSubmittedScore ? (
              <form onSubmit={handleSubmitLeaderboard} className="bg-zinc-900/90 border border-amber-500/40 rounded-2xl p-4 mb-4 max-w-sm w-full text-right shadow-xl">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-3">
                  <Medal className="w-4 h-4" />
                  <span>سجّل اسمك الآن في لوحة شرف أبطال الإنارة:</span>
                </div>

                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    required
                    placeholder="اكتب اسمك الثلاثي أو اللقب..."
                    value={playerNameInput}
                    onChange={(e) => setPlayerNameInput(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="المدينة / المنطقة (مثال: بنغازي - الليثي)"
                    value={playerCityInput}
                    onChange={(e) => setPlayerCityInput(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>حفظ في لوحة الشرف الرسمية 🏆</span>
                </button>
              </form>
            ) : (
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-3.5 mb-4 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>تم تسجيل نتيجتك بنجاح في لوحة الشرف!</span>
              </div>
            )}

            {/* DYNAMIC CLOUD REWARD: COUPON */}
            {rewardConfig.isEnabled && rewardConfig.rewardType === 'coupon' && (
              <div className="bg-gradient-to-r from-amber-950/60 via-zinc-950 to-blue-950/60 border border-amber-500/40 rounded-2xl p-4 mb-4 text-center max-w-sm w-full shadow-xl">
                <div className="text-[11px] text-amber-300 font-bold mb-1">{rewardConfig.discountTitle}</div>
                <div className="font-mono text-lg sm:text-xl font-black text-amber-400 tracking-widest bg-black/70 py-1.5 px-3 rounded-xl border border-amber-400/30 mb-1.5">
                  {rewardConfig.couponCode}
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold">
                  {rewardConfig.discountDetails}
                </p>
              </div>
            )}

            {/* DYNAMIC CLOUD REWARD: PHYSICAL GIFT */}
            {rewardConfig.isEnabled && rewardConfig.rewardType === 'physical_gift' && (
              <div className="bg-gradient-to-r from-pink-950/60 via-zinc-950 to-amber-950/60 border border-pink-500/40 rounded-2xl p-4 mb-4 text-center max-w-sm w-full shadow-xl">
                <div className="text-[11px] text-pink-300 font-bold mb-0.5">🎁 هدية عينية مجانية للأبطال:</div>
                <div className="text-sm font-black text-white mb-1">{rewardConfig.giftItemName}</div>
                <p className="text-[11px] text-emerald-300 font-semibold">{rewardConfig.giftInstructions}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>عرض لوحة الشرف</span>
              </button>

              {rewardConfig.isEnabled && rewardConfig.rewardType !== 'no_reward' && (
                <a
                  href={`https://wa.me/218916580068?text=${encodeURIComponent(
                    `مرحباً شركة الإنارة الحديثة، فزت بلعبة بطل الإنارة وحصلت على ${
                      rewardConfig.rewardType === 'coupon'
                        ? `كود الخصم: ${rewardConfig.couponCode}`
                        : `الهدية المجانية: ${rewardConfig.giftItemName}`
                    }`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{rewardConfig.rewardType === 'coupon' ? 'طلب بالواتساب' : 'استلام الهدية'}</span>
                </a>
              )}

              <button
                onClick={() => startGame(0)}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                إعادة اللعب
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ==========================================
          MODAL: LEADERBOARD / HALL OF FAME (لوحة الشرف)
      ========================================== */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121316] border border-amber-500/40 rounded-3xl w-full max-w-lg p-5 shadow-2xl relative text-right flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <button
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

            {/* Competitors List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {leaderboard.length === 0 ? (
                <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-md animate-pulse">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-1">لوحة الشرف بانتظار أول بطل! 👑</h4>
                  <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                    العب الآن وانهِ جميع المراحل واهزم وحش الحمل الزائد لتسجل اسمك في المركز الأول وتتصدر لوحة الأبطال!
                  </p>
                </div>
              ) : (
                leaderboard.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      idx === 0
                        ? 'bg-gradient-to-l from-amber-950/40 to-zinc-900 border-amber-500/50'
                        : idx === 1
                        ? 'bg-gradient-to-l from-slate-900 to-zinc-900 border-slate-500/40'
                        : idx === 2
                        ? 'bg-gradient-to-l from-amber-950/20 to-zinc-900 border-amber-700/30'
                        : 'bg-zinc-900/60 border-zinc-800/80'
                    }`}
                  >
                    {/* Score & Time */}
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <div className="text-xs font-black text-amber-400">{item.score} نقطة</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{item.timeTakenSec} ثانية</div>
                      </div>
                    </div>

                    {/* Competitor Name & City */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                          <span>{item.name}</span>
                          {idx === 0 && <span className="text-amber-400">👑</span>}
                        </div>
                        <div className="text-[10px] text-zinc-400">{item.city}</div>
                      </div>

                      {/* Rank Badge */}
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                          idx === 0
                            ? 'bg-amber-500 text-black shadow-md'
                            : idx === 1
                            ? 'bg-slate-300 text-black'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Close */}
            <div className="pt-4 mt-2 border-t border-zinc-800 text-center">
              <button
                onClick={() => setShowLeaderboard(false)}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-all"
              >
                إغلاق والعودة للعبة
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          VIRTUAL ANALOG JOYSTICK (360° CONTROLLER)
      ========================================== */}
      <div className="w-full shrink-0 mt-1 mb-1 sm:mb-2 flex flex-col items-center justify-center select-none touch-none">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] sm:text-xs text-zinc-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            <span>عصا التحكم التناظرية 360° (اسحب للتوجيه بسلاسة)</span>
          </span>
        </div>
        
        {/* Analog Base Ring */}
        <div
          onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            handleJoystickStart(e.clientX, e.clientY, rect)
          }}
          onMouseMove={(e) => {
            if (joystickData.active) handleJoystickMove(e.clientX, e.clientY)
          }}
          onMouseUp={handleJoystickEnd}
          onMouseLeave={handleJoystickEnd}
          onTouchStart={(e) => {
            e.preventDefault()
            const touch = e.touches[0]
            const rect = e.currentTarget.getBoundingClientRect()
            handleJoystickStart(touch.clientX, touch.clientY, rect, touch.identifier)
          }}
          onTouchMove={(e) => {
            e.preventDefault()
            const touch = Array.from(e.touches).find(t => t.identifier === joystickRef.current.touchId) || e.touches[0]
            if (touch) handleJoystickMove(touch.clientX, touch.clientY)
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            handleJoystickEnd()
          }}
          onTouchCancel={handleJoystickEnd}
          className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border-2 transition-colors cursor-grab active:cursor-grabbing flex items-center justify-center shadow-2xl backdrop-blur-md ${
            joystickData.active
              ? 'bg-blue-950/40 border-blue-500/70 shadow-[0_0_20px_rgba(59,130,246,0.35)]'
              : 'bg-zinc-950/80 border-zinc-800 shadow-lg'
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Concentric Decorative Rings */}
          <div className="absolute inset-4 rounded-full border border-blue-500/15 pointer-events-none" />
          <div className="absolute inset-8 rounded-full border border-blue-400/10 pointer-events-none" />

          {/* Compass Direction Ticks */}
          <div className="absolute top-1.5 text-[9px] font-bold text-zinc-500 select-none">▲</div>
          <div className="absolute bottom-1.5 text-[9px] font-bold text-zinc-500 select-none">▼</div>
          <div className="absolute left-2 text-[9px] font-bold text-zinc-500 select-none">◀</div>
          <div className="absolute right-2 text-[9px] font-bold text-zinc-500 select-none">▶</div>

          {/* Active Directional Glow Beam */}
          {joystickData.active && joystickData.intensity > 0.1 && (
            <div
              className="absolute w-12 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full origin-left pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${joystickData.angleDeg}deg)`,
                opacity: joystickData.intensity,
              }}
            />
          )}

          {/* Floating Analog Stick Knob */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white border-2 shadow-2xl transition-transform duration-75 pointer-events-none ${
              joystickData.active
                ? 'bg-gradient-to-b from-blue-500 to-blue-700 border-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.8)] scale-105'
                : 'bg-gradient-to-b from-zinc-800 to-zinc-900 border-zinc-700 shadow-md'
            }`}
            style={{
              transform: `translate(${joystickData.knobX}px, ${joystickData.knobY}px)`,
            }}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              joystickData.active ? 'text-amber-300' : 'text-blue-400'
            }`}>
              <Lightbulb className="w-5 h-5 fill-current transition-colors" />
            </div>
          </div>
        </div>

        <span className="text-[10px] text-zinc-500 mt-1.5">
          {joystickData.active
            ? `⚡ حركة نشطة: ${(joystickData.intensity * 100).toFixed(0)}%`
            : '💡 يمكنك أيضاً استخدام مفاتيح الأسهم أو WASD'}
        </span>
      </div>

    </div>
  )
}
