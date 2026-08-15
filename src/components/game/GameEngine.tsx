import React, { useEffect, useRef, useState, useCallback } from 'react'
import { sound } from './audio'
import { Sparkles, Zap, Lightbulb, Volume2, VolumeX, RotateCcw, Trophy, CheckCircle, ArrowRight, Play, Award, Flame, Lock, Unlock, Compass, AlertTriangle, Clock, Timer, ShieldAlert } from 'lucide-react'

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
  period: number // Total cycle in seconds
  onTime: number // Active deadly duration
  offset: number
}

export interface LevelData {
  id: number
  nameAr: string
  nameEn: string
  subtitleAr: string
  difficultyBadge: string
  heroSkinName: string
  locationDescription: string
  stars: number
  theme: 'street' | 'villa' | 'tower' | 'showroom'
  timeLimit: number // In seconds
  width: number
  height: number
  walls: { x: number; y: number; w: number; h: number; type?: string }[]
  decorations: { type: string; x: number; y: number; w?: number; h?: number; label?: string }[]
  lamps: { id: number; x: number; y: number; isLit: boolean; name: string }[]
  sparks: { id: number; x: number; y: number; collected: boolean; type: 'spark' | 'wire' | 'spotlight' }[]
  hazards: Hazard[]
  laserBeams: LaserBeam[]
  gates: Gate[]
  masterSwitch: { x: number; y: number; isActivated: boolean }
  heroStart: { x: number; y: number }
  initialLight: number
}

const LEVELS: LevelData[] = [
  // =========================================================================
  // LEVEL 1: شوارع حي الليثي بنغازي (مؤقت 55 ثانية + سيارات شحنات متحركة)
  // =========================================================================
  {
    id: 1,
    nameAr: 'المرحلة 1: شوارع حي الليثي - بنغازي',
    nameEn: 'Level 1: Al-Laythi Streets',
    subtitleAr: 'احذر الشحنات المتحركة في الشارع! اجمع كابلات النحاس لكسب (+5 ثوانٍ) وأنر كافة الأعمدة قبل انتهاء الوقت.',
    difficultyBadge: 'سهل ومثير',
    heroSkinName: 'لمبة LED الكلاسيكية 💡',
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
    // 2 شحنات سريعة متحركة في الشارع
    hazards: [
      { id: 1, x: 220, y: 300, vx: 2.2, vy: 0, radius: 14, type: 'patrol', minX: 50, maxX: 850 },
      { id: 2, x: 700, y: 260, vx: -2.4, vy: 0, radius: 14, type: 'patrol', minX: 50, maxX: 850 },
    ],
    laserBeams: [],
    gates: [],
    masterSwitch: { x: 840, y: 300, isActivated: false },
  },

  // =========================================================================
  // LEVEL 2: الفيلا المعمارية الفاخرة (مؤقت 48 ثانية + أشعة ليزر متقطعة + دوامات)
  // =========================================================================
  {
    id: 2,
    nameAr: 'المرحلة 2: الفيلا المعمارية الفاخرة',
    nameEn: 'Level 2: The Luxury Villa',
    subtitleAr: 'احذر دوامات تفريغ الطاقة وأشعة الليزر المتقطعة! أنر 3 ثريات لفتح البوابة قبل نفاد الوقت.',
    difficultyBadge: 'متوسط حماسي',
    heroSkinName: 'اللمبة الكريستالية الملكية 💎',
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
    // 3 دوامات طاقة سريعة
    hazards: [
      { id: 1, x: 330, y: 330, vx: 0, vy: 1.8, radius: 20, type: 'vortex', minY: 250, maxY: 410 },
      { id: 2, x: 640, y: 220, vx: 0, vy: -2.2, radius: 20, type: 'vortex', minY: 150, maxY: 510 },
      { id: 3, x: 480, y: 330, vx: 1.8, vy: 0, radius: 18, type: 'patrol', minX: 380, maxX: 540 },
    ],
    // أشعة ليزر متقطعة في الممر
    laserBeams: [
      { id: 1, x1: 550, y1: 220, x2: 740, y2: 220, period: 3.5, onTime: 2.0, offset: 0 },
      { id: 2, x1: 550, y1: 440, x2: 740, y2: 440, period: 3.5, onTime: 2.0, offset: 1.7 },
    ],
    masterSwitch: { x: 880, y: 330, isActivated: false },
  },

  // =========================================================================
  // LEVEL 3: برج المدينة وغرفة السيرفرات الذكية (مؤقت 42 ثانية + 4 روبوتات سريعة)
  // =========================================================================
  {
    id: 3,
    nameAr: 'المرحلة 3: برج المدينة وغرفة السيرفرات الذكية',
    nameEn: 'Level 3: The Smart City Tower',
    subtitleAr: 'المؤقت يتناقص بسرعة (42 ثانية)! تفادَ 4 شحنات كهربائية سريعة وأشعة السيرفرات لإنارة البرج.',
    difficultyBadge: 'تحدي قوي وسريع',
    heroSkinName: 'اللمبة الذكية السايبر ⚡',
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
    // 4 روبوتات كهربائية سريعة
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
  // LEVEL 4: المعرض الرئيسي الفاخر (مؤقت 36 ثانية + تحدي السرعة الأسطوري)
  // =========================================================================
  {
    id: 4,
    nameAr: 'المرحلة 4: المعرض الرئيسي للإنارة الحديثة - ليلة الافتتاح',
    nameEn: 'Level 4: Grand Flagship Showroom',
    subtitleAr: 'التحدي النهائي الأسطوري (36 ثانية فقط)! تحرك بسرعة فائقة واجمع كابلات النحاس لتمديد الوقت وإنارة المعرض.',
    difficultyBadge: 'تحدي أسطوري VIP 🔥',
    heroSkinName: 'اللمبة الذهبية الملكية VIP 👑',
    locationDescription: 'معرض فخم بأرضيات سوداء وذهبية، أجنحة عرض زجاجية، وثريات عملاقة متدلية',
    stars: 4,
    timeLimit: 36,
    theme: 'showroom',
    width: 1050,
    height: 720,
    heroStart: { x: 525, y: 640 },
    initialLight: 120,
    walls: [
      { x: 0, y: 0, w: 1050, h: 20 },
      { x: 0, y: 700, w: 1050, h: 20 },
      { x: 0, y: 0, w: 20, h: 720 },
      { x: 1030, y: 0, w: 20, h: 720 },
      { x: 180, y: 80, w: 60, h: 220, type: 'showcase' },
      { x: 180, y: 420, w: 60, h: 220, type: 'showcase' },
      { x: 420, y: 20, w: 50, h: 260, type: 'showcase' },
      { x: 420, y: 440, w: 50, h: 260, type: 'showcase' },
      { x: 640, y: 80, w: 60, h: 220, type: 'showcase' },
      { x: 640, y: 420, w: 60, h: 220, type: 'showcase' },
      { x: 860, y: 20, w: 50, h: 260, type: 'showcase' },
      { x: 860, y: 440, w: 50, h: 260, type: 'showcase' },
    ],
    decorations: [
      { type: 'reception', x: 460, y: 570, w: 130, h: 40, label: 'استقبال المعرض الرئيسي' },
    ],
    lamps: [
      { id: 1, x: 90, y: 120, isLit: false, name: 'جناح الثريات الإيطالية' },
      { id: 2, x: 90, y: 580, isLit: false, name: 'منصة مفاتيح اللمس الفاخرة' },
      { id: 3, x: 300, y: 180, isLit: false, name: 'استوديو الإضاءة الذكية' },
      { id: 4, x: 300, y: 520, isLit: false, name: 'جناح إنارة الواجهات والحدائق' },
      { id: 5, x: 525, y: 350, isLit: false, name: 'الثريا الكريستال العملاقة' },
      { id: 6, x: 740, y: 180, isLit: false, name: 'منظومة الإنترفون المرئي' },
      { id: 7, x: 740, y: 540, isLit: false, name: 'جناح الكابلات المعتمدة' },
      { id: 8, x: 950, y: 160, isLit: false, name: 'منصة التحكم المركزي VIP' },
      { id: 9, x: 950, y: 560, isLit: false, name: 'كشافات ليلة الافتتاح' },
    ],
    sparks: [
      { id: 1, x: 90, y: 240, collected: false, type: 'wire' },
      { id: 2, x: 90, y: 460, collected: false, type: 'wire' },
      { id: 3, x: 300, y: 90, collected: false, type: 'spark' },
      { id: 4, x: 300, y: 620, collected: false, type: 'spark' },
      { id: 5, x: 525, y: 180, collected: false, type: 'wire' },
      { id: 6, x: 525, y: 500, collected: false, type: 'wire' },
      { id: 7, x: 740, y: 90, collected: false, type: 'spotlight' },
      { id: 8, x: 740, y: 620, collected: false, type: 'spotlight' },
      { id: 9, x: 950, y: 360, collected: false, type: 'spotlight' },
    ],
    gates: [
      { id: 1, x: 860, y: 280, w: 50, h: 160, isOpen: false, requiredWires: 4, labelAr: 'مغلقة: اجمع 4 كابلات نحاس' },
    ],
    // 5 حراس شحنات سريعة
    hazards: [
      { id: 1, x: 300, y: 360, vx: 2.8, vy: 0, radius: 15, type: 'patrol', minX: 250, maxX: 360 },
      { id: 2, x: 525, y: 220, vx: 0, vy: 3.4, radius: 15, type: 'patrol', minY: 100, maxY: 600 },
      { id: 3, x: 740, y: 480, vx: 0, vy: -3.4, radius: 15, type: 'patrol', minY: 100, maxY: 600 },
      { id: 4, x: 950, y: 240, vx: 0, vy: 3.2, radius: 15, type: 'patrol', minY: 100, maxY: 600 },
    ],
    laserBeams: [
      { id: 1, x1: 240, y1: 360, x2: 420, y2: 360, period: 2.8, onTime: 1.5, offset: 0 },
      { id: 2, x1: 640, y1: 360, x2: 860, y2: 360, period: 2.8, onTime: 1.5, offset: 1.4 },
    ],
    masterSwitch: { x: 980, y: 360, isActivated: false },
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
  const [timeLeft, setTimeLeft] = useState(55)
  const [lightPower, setLightPower] = useState(140)
  const [isMuted, setIsMuted] = useState(false)
  const [lampsLitCount, setLampsLitCount] = useState(0)
  const [totalLampsCount, setTotalLampsCount] = useState(0)
  const [collectedSparksCount, setCollectedSparksCount] = useState(0)
  const [totalSparksCount, setTotalSparksCount] = useState(0)
  const [bannerAlert, setBannerAlert] = useState<{ msg: string; type: 'info' | 'error' | 'success' } | null>(null)

  // Current active level clone
  const levelRef = useRef<LevelData>(JSON.parse(JSON.stringify(LEVELS[0])))
  const timeLeftRef = useRef<number>(55)

  // Hero state
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
    setTimeLeft(cloned.timeLimit)
    timeLeftRef.current = cloned.timeLimit
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

  // Reset stage upon injury or timeout
  const handleHeroInjured = (reason = 'hit') => {
    sound.playShortCircuit()
    spawnParticles(heroRef.current.x, heroRef.current.y, '#ef4444', 40, 3.5)
    
    if (reason === 'timeout') {
      showAlert('⌛ انتهت طاقة البطارية والوقت! تحرك أسرع واجمع كابلات النحاس لكسب (+5 ثوانٍ)!', 'error')
    } else {
      showAlert('💥 تماس كهربائي شديد! انقطع التيار وأعيدت المرحلة من نقطة البداية!', 'error')
    }
    
    setTimeout(() => {
      loadLevel(currentLevelIdx)
    }, 450)
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

        // 1. Process Input
        let moveX = 0
        let moveY = 0

        if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) moveX += 1
        if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) moveX -= 1
        if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) moveY -= 1
        if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) moveY += 1

        if (touchInputRef.current.x !== 0 || touchInputRef.current.y !== 0) {
          moveX += touchInputRef.current.x
          moveY += touchInputRef.current.y
        }

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

        // 3. Check Moving Hazards -> Instant Stage Reset on Collision
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

        // 4. Check Cycling Deadly Laser Beams
        const curSeconds = time * 0.001
        for (const beam of level.laserBeams) {
          const cyclePos = (curSeconds + beam.offset) % beam.period
          const isLaserDeadly = cyclePos < beam.onTime

          if (isLaserDeadly) {
            // Distance from point to line segment
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

        // 5. Collect Sparks & Powerups (+5 Seconds Bonus on Wires & Spotlights!)
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
                
                // +5s Bonus Time!
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
                
                // +5s Bonus Time!
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

        // 6. Light up Dark Lamps
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

        // 7. Check Master Switchboard (100% Items & Lamps Required)
        const masterDist = Math.hypot(hero.x - level.masterSwitch.x, hero.y - level.masterSwitch.y)
        if (masterDist < hero.radius + 32 && !level.masterSwitch.isActivated) {
          const currentRemainingLamps = level.lamps.filter((l) => !l.isLit).length
          const currentRemainingSparks = level.sparks.filter((s) => !s.collected).length
          const totalLeft = currentRemainingLamps + currentRemainingSparks

          if (totalLeft > 0) {
            sound.playLockedBuzz()
            showAlert(`⚠️ القاطع مقفل! يجب إنارة كافة المصابيح وجمع جميع كابلات النحاس والشرارات أولاً! (متبقي: ${totalLeft})`, 'error')
            hero.x -= moveX * 4
            hero.y -= moveY * 4
          } else {
            level.masterSwitch.isActivated = true
            sound.playMasterSwitch()
            setScore((prev) => prev + 2000)
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

      // 8. Update Particles
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
        // LEVEL 1: Asphalt Road & Concrete Sidewalks
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
        // LEVEL 2: Golden Oak Parquet Wood Floor
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
        // LEVEL 3: Deep Cyber Tech Blue Floor with Neon Circuits
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
        // LEVEL 4: Polished Black & Gold Terrazzo Marble
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

        for (const dec of level.decorations) {
          if (dec.type === 'reception' && dec.w && dec.h) {
            ctx.fillStyle = '#27272a'
            ctx.roundRect(dec.x, dec.y, dec.w, dec.h, 10)
            ctx.fill()
            ctx.strokeStyle = '#f59e0b'
            ctx.lineWidth = 3
            ctx.stroke()
            ctx.fillStyle = '#fef08a'
            ctx.font = 'bold 10px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('الإنارة الحديثة - RECEPTION', dec.x + dec.w / 2, dec.y + dec.h / 2 + 4)
          }
        }
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

      // Draw Cycling Laser Beams (Dangerous Red vs Safe Green)
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

        // Terminal emitters
        ctx.fillStyle = isDeadly ? '#ef4444' : '#10b981'
        ctx.beginPath()
        ctx.arc(beam.x1, beam.y1, 5, 0, Math.PI * 2)
        ctx.arc(beam.x2, beam.y2, 5, 0, Math.PI * 2)
        ctx.fill()
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
        
        {/* Level Name & Badge */}
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

        {/* 100% Checklist & Countdown Timer */}
        <div className="flex items-center gap-2.5">
          
          {/* Dynamic Countdown Timer */}
          <div 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all ${
              timeLeft <= 10
                ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                : timeLeft <= 20
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-emerald-400'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>{timeLeft} ثانية</span>
          </div>

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
            <span>{isStage100PercentComplete ? 'جاهز!' : `متبقي: ${totalRemaining}`}</span>
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
              تحدي الأبطال الحقيقي! مؤقت تنازلي سريع، شحنات كهربائية سريعة، وأشعة ليزر متقطعة!
            </p>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 mb-6 text-xs text-zinc-300 max-w-sm text-right space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>قواعد التحدي الصارم:</span>
              </div>
              <p className="text-zinc-400">⚡ ملامسة الشحنات أو أشعة الليزر تعيد المرحلة فوراً.</p>
              <p className="text-zinc-400">⚡ جمع كابلات النحاس والسبوت لايت يمنحك (+5 ثوانٍ) وقت إضافي.</p>
              <p className="text-zinc-400">⚡ القاطع لن يفتح حتى تجمع 100% من كل شيء قبل انتهاء الوقت.</p>
            </div>

            <button
              onClick={() => startGame(0)}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>ابدأ التحدي (حي الليثي)</span>
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

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 mb-6 text-xs text-zinc-300 space-y-1.5 text-right">
              <div>📍 العالم القادم: <span className="text-blue-400 font-bold">{LEVELS[currentLevelIdx + 1]?.nameAr}</span></div>
              <div className="text-amber-400 font-semibold">مظهر البطل الجديد: {LEVELS[currentLevelIdx + 1]?.heroSkinName}</div>
              <div className="text-red-400 font-bold">⏱️ الوقت المحدد: {LEVELS[currentLevelIdx + 1]?.timeLimit} ثانية فقط!</div>
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
            SCREEN: FINAL VICTORY & VIP COUPON SCREEN
        ========================================== */}
        {gameState === 'game_won' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-20 h-20 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mb-4 text-amber-400 animate-pulse">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">
              🎉 مبروك! أتممت التحدي الأسطوري 100%!
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-md mb-5 leading-relaxed">
              أنت بطل حقيقي للإنارة! لقد تغلبت على جميع التحديات والمؤقتات وأعدت النور لكافة المعالم.
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
          <button
            onTouchStart={() => handleTouchDir(0, -1)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchDir(0, -1)}
            onMouseUp={handleTouchEnd}
            className="absolute top-2 w-12 h-12 bg-zinc-900 active:bg-blue-600 border border-zinc-800 text-white rounded-xl flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
          >
            ▲
          </button>

          <button
            onTouchStart={() => handleTouchDir(0, 1)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchDir(0, 1)}
            onMouseUp={handleTouchEnd}
            className="absolute bottom-2 w-12 h-12 bg-zinc-900 active:bg-blue-600 border border-zinc-800 text-white rounded-xl flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
          >
            ▼
          </button>

          <button
            onTouchStart={() => handleTouchDir(-1, 0)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchDir(-1, 0)}
            onMouseUp={handleTouchEnd}
            className="absolute left-2 w-12 h-12 bg-zinc-900 active:bg-blue-600 border border-zinc-800 text-white rounded-xl flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
          >
            ◀
          </button>

          <button
            onTouchStart={() => handleTouchDir(1, 0)}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchDir(1, 0)}
            onMouseUp={handleTouchEnd}
            className="absolute right-2 w-12 h-12 bg-zinc-900 active:bg-blue-600 border border-zinc-800 text-white rounded-xl flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
          >
            ▶
          </button>

          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-blue-400 border border-zinc-800">
            <Lightbulb className="w-5 h-5" />
          </div>
        </div>
      </div>

    </div>
  )
}
