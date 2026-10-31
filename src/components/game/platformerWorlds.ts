export type WorldThemeId =
  | 'city_lights'
  | 'electric_factory'
  | 'copper_world'
  | 'future_city'
  | 'energy_fortress'

export type HeroAnimState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump_prep'
  | 'jump_ascent'
  | 'falling'
  | 'landing'
  | 'collecting'
  | 'damage'
  | 'victory'
  | 'defeat'

export type PlatformKind =
  | 'solid'
  | 'moving'
  | 'conveyor'
  | 'phase'
  | 'spring'
  | 'bridge_locked'

export type PlatformMaterial =
  | 'concrete'
  | 'brick'
  | 'steel'
  | 'copper'
  | 'neon_glass'
  | 'fortress_stone'

export interface PlatformData {
  id: string
  x: number
  y: number
  w: number
  h: number
  kind: PlatformKind
  material: PlatformMaterial
  // For moving platforms
  startX?: number
  startY?: number
  endX?: number
  endY?: number
  speed?: number
  // Runtime delta
  dx?: number
  dy?: number
  // For conveyor belts (px/sec horizontal push)
  conveyorSpeed?: number
  // For temporary phase platforms
  phaseState?: 'ready' | 'stepping' | 'phased_out'
  phaseTimer?: number
  // For switch-activated bridges
  switchId?: string
  unlocked?: boolean
  // For spring pads
  springBoostVy?: number
  springCompress?: number
  // Optional secret path marker
  isSecret?: boolean
}

export interface CollectibleStar {
  id: string
  x: number
  y: number
  kind: 'energy_star' | 'copper_coil' | 'light_capsule'
  value: number
  collected: boolean
  isSecret?: boolean
}

export interface StageSwitch {
  id: string
  x: number
  y: number
  activated: boolean
  targetId: string
  labelAr: string
}

export interface EnergyGate {
  id: string
  x: number
  y: number
  w: number
  h: number
  isOpen: boolean
  switchId?: string
  requiredStars?: number
  labelAr: string
}

export interface CheckpointLamp {
  id: string
  x: number
  y: number
  activated: boolean
  labelAr: string
}

export interface PlatformEnemy {
  id: string
  x: number
  y: number
  w: number
  h: number
  vx: number
  minX: number
  maxX: number
  kind: 'maintenance_bot' | 'spark_drone' | 'cable_crawler' | 'pulse_sentinel'
  defeated: boolean
  stompable: boolean
}

export interface StageHazard {
  id: string
  x: number
  y: number
  w: number
  h: number
  kind: 'electric_floor' | 'timed_arc'
  period?: number
  onTime?: number
  offset?: number
}

export interface BossBreakerSwitch {
  id: string
  x: number
  y: number
  activated: boolean
  cooldown: number
  labelAr: string
}

export interface BossGuardian {
  nameAr: string
  nameEn: string
  x: number
  y: number
  w: number
  h: number
  vx: number
  minX: number
  maxX: number
  hp: number
  maxHp: number
  state: 'patrol' | 'telegraph' | 'shockwave' | 'vulnerable' | 'defeated'
  stateTimer: number
  invulnTimer: number
  shockwaveLeftX: number
  shockwaveRightX: number
  shockwaveY: number
  shockwaveActive: boolean
  breakers: BossBreakerSwitch[]
}

export interface StageDefinition {
  id: string
  stageIndex: number
  worldNumber: number
  stageNumber: number
  code: string
  titleAr: string
  titleEn: string
  worldTitleAr: string
  worldTitleEn: string
  subtitleAr: string
  difficultyAr: string
  theme: WorldThemeId
  accentColor: string
  skyTop: string
  skyBottom: string
  width: number
  height: number
  groundY: number
  heroSpawn: { x: number; y: number }
  goalPortal: { x: number; y: number; labelAr: string }
  platforms: PlatformData[]
  collectibles: CollectibleStar[]
  switches: StageSwitch[]
  gates: EnergyGate[]
  checkpoints: CheckpointLamp[]
  enemies: PlatformEnemy[]
  hazards: StageHazard[]
  boss?: BossGuardian
}

export interface WorldDefinition {
  worldNumber: number
  id: WorldThemeId
  nameAr: string
  nameEn: string
  descriptionAr: string
  difficultyAr: string
  accentColor: string
  badgeBg: string
  stages: StageDefinition[]
}

// ============================================================================
// FIVE DISTINCT WORLDS — COMPLETE PLAYABLE STAGES (GROUND Y = 500, HEIGHT = 560)
// ============================================================================

export const GAME_STAGES: StageDefinition[] = [
  // ==========================================================================
  // WORLD 1 — مدينة الأنوار (THE CITY OF LIGHTS)
  // Bright daytime, cheerful modern buildings, lighting showroom, easy intro
  // ==========================================================================
  {
    id: 'w1-s1',
    stageIndex: 0,
    worldNumber: 1,
    stageNumber: 1,
    code: '1-1',
    titleAr: 'شارع النور الرئيسي',
    titleEn: 'Main Light Avenue',
    worldTitleAr: 'مدينة الأنوار',
    worldTitleEn: 'The City of Lights',
    subtitleAr:
      'تحرك وانطلق واقفز فوق المنصات المعمارية، واجمع نجوم الطاقة وأنر أعمدة المدينة للوصول إلى بوابة النور.',
    difficultyAr: 'سهل — تعليمي',
    theme: 'city_lights',
    accentColor: '#0284C7',
    skyTop: '#38BDF8',
    skyBottom: '#E0F2FE',
    width: 2450,
    height: 560,
    groundY: 500,
    heroSpawn: { x: 90, y: 420 },
    goalPortal: { x: 2290, y: 410, labelAr: 'بوابة معرض الإنارة' },
    platforms: [
      // Main ground segments
      { id: 'p1', x: 0, y: 480, w: 780, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'p2', x: 860, y: 480, w: 720, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'p3', x: 1660, y: 480, w: 790, h: 80, kind: 'solid', material: 'concrete' },

      // Low introductory steps & balconies
      { id: 'p4', x: 260, y: 395, w: 150, h: 24, kind: 'solid', material: 'brick' },
      { id: 'p5', x: 460, y: 330, w: 170, h: 24, kind: 'solid', material: 'brick' },

      // Secret High Rooftop Path (World 1 hidden path)
      { id: 'p6', x: 670, y: 255, w: 190, h: 22, kind: 'solid', material: 'brick', isSecret: true },

      // Midsection plaza platforms
      { id: 'p7', x: 1020, y: 390, w: 160, h: 24, kind: 'solid', material: 'brick' },
      { id: 'p8', x: 1230, y: 325, w: 180, h: 24, kind: 'solid', material: 'brick' },
      { id: 'p9', x: 1470, y: 385, w: 150, h: 24, kind: 'solid', material: 'brick' },

      // Final approach terraces
      { id: 'p10', x: 1820, y: 395, w: 160, h: 24, kind: 'solid', material: 'brick' },
      { id: 'p11', x: 2020, y: 340, w: 170, h: 24, kind: 'solid', material: 'brick' }
    ],
    collectibles: [
      { id: 'c1', x: 200, y: 440, kind: 'energy_star', value: 100, collected: false },
      { id: 'c2', x: 310, y: 350, kind: 'energy_star', value: 100, collected: false },
      { id: 'c3', x: 360, y: 350, kind: 'energy_star', value: 100, collected: false },
      { id: 'c4', x: 520, y: 285, kind: 'energy_star', value: 100, collected: false },
      { id: 'c5', x: 570, y: 285, kind: 'copper_coil', value: 200, collected: false },
      // Secret rooftop stars
      { id: 'c6', x: 720, y: 205, kind: 'light_capsule', value: 300, collected: false, isSecret: true },
      { id: 'c7', x: 785, y: 205, kind: 'energy_star', value: 100, collected: false, isSecret: true },
      // Midsection stars
      { id: 'c8', x: 950, y: 440, kind: 'energy_star', value: 100, collected: false },
      { id: 'c9', x: 1095, y: 345, kind: 'energy_star', value: 100, collected: false },
      { id: 'c10', x: 1315, y: 280, kind: 'copper_coil', value: 200, collected: false },
      { id: 'c11', x: 1540, y: 340, kind: 'energy_star', value: 100, collected: false },
      { id: 'c12', x: 1895, y: 350, kind: 'energy_star', value: 100, collected: false },
      { id: 'c13', x: 2100, y: 295, kind: 'light_capsule', value: 300, collected: false }
    ],
    switches: [],
    gates: [],
    checkpoints: [
      { id: 'cp1', x: 920, y: 480, activated: false, labelAr: 'عمود النور 1' },
      { id: 'cp2', x: 1720, y: 480, activated: false, labelAr: 'عمود النور 2' }
    ],
    enemies: [
      {
        id: 'e1',
        x: 620,
        y: 446,
        w: 36,
        h: 34,
        vx: 75,
        minX: 480,
        maxX: 730,
        kind: 'maintenance_bot',
        defeated: false,
        stompable: true
      },
      {
        id: 'e2',
        x: 1320,
        y: 446,
        w: 36,
        h: 34,
        vx: -85,
        minX: 1120,
        maxX: 1520,
        kind: 'maintenance_bot',
        defeated: false,
        stompable: true
      },
      {
        id: 'e3',
        x: 1960,
        y: 446,
        w: 36,
        h: 34,
        vx: 90,
        minX: 1780,
        maxX: 2160,
        kind: 'maintenance_bot',
        defeated: false,
        stompable: true
      }
    ],
    hazards: []
  },

  // ==========================================================================
  // WORLD 2 — مصنع الكهرباء (THE ELECTRIC FACTORY)
  // Industrial machinery, conveyor belts, moving platforms, electrical switches
  // ==========================================================================
  {
    id: 'w2-s1',
    stageIndex: 1,
    worldNumber: 2,
    stageNumber: 1,
    code: '2-1',
    titleAr: 'خطوط السيور والتروس المتحركة',
    titleEn: 'Conveyor & Gear Assembly',
    worldTitleAr: 'مصنع الكهرباء',
    worldTitleEn: 'The Electric Factory',
    subtitleAr:
      'استخدم السيور الناقلة والمنصات الميكانيكية المتحركة، واضغط مفتاح التشغيل لفتح بوابة المصنع.',
    difficultyAr: 'سهل إلى متوسط',
    theme: 'electric_factory',
    accentColor: '#F59E0B',
    skyTop: '#1E293B',
    skyBottom: '#334155',
    width: 2600,
    height: 560,
    groundY: 500,
    heroSpawn: { x: 90, y: 420 },
    goalPortal: { x: 2440, y: 410, labelAr: 'بوابة وحدة التوليد' },
    platforms: [
      { id: 'f1', x: 0, y: 480, w: 620, h: 80, kind: 'solid', material: 'steel' },
      // First Conveyor Belt (pushes right)
      {
        id: 'f2',
        x: 680,
        y: 430,
        w: 310,
        h: 26,
        kind: 'conveyor',
        material: 'steel',
        conveyorSpeed: 95
      },
      // Moving horizontal mechanical platform
      {
        id: 'f3',
        x: 1050,
        y: 380,
        w: 150,
        h: 24,
        kind: 'moving',
        material: 'steel',
        startX: 1040,
        startY: 380,
        endX: 1260,
        endY: 380,
        speed: 95
      },
      // Mid factory floor
      { id: 'f4', x: 1440, y: 480, w: 480, h: 80, kind: 'solid', material: 'steel' },
      // Elevated switch platform
      { id: 'f5', x: 1560, y: 355, w: 180, h: 24, kind: 'solid', material: 'steel' },
      // Reverse Conveyor Belt (pushes left — fun timing challenge)
      {
        id: 'f6',
        x: 1960,
        y: 415,
        w: 240,
        h: 26,
        kind: 'conveyor',
        material: 'steel',
        conveyorSpeed: -80
      },
      // Secret upper ventilation duct platform
      {
        id: 'f7',
        x: 1540,
        y: 235,
        w: 210,
        h: 22,
        kind: 'solid',
        material: 'steel',
        isSecret: true
      },
      // Final floor to exit
      { id: 'f8', x: 2230, y: 480, w: 370, h: 80, kind: 'solid', material: 'steel' }
    ],
    collectibles: [
      { id: 'fc1', x: 260, y: 435, kind: 'energy_star', value: 100, collected: false },
      { id: 'fc2', x: 420, y: 435, kind: 'energy_star', value: 100, collected: false },
      { id: 'fc3', x: 780, y: 385, kind: 'energy_star', value: 100, collected: false },
      { id: 'fc4', x: 860, y: 385, kind: 'copper_coil', value: 200, collected: false },
      { id: 'fc5', x: 1160, y: 325, kind: 'energy_star', value: 100, collected: false },
      { id: 'fc6', x: 1620, y: 310, kind: 'energy_star', value: 100, collected: false },
      // Secret ventilation duct rewards
      { id: 'fc7', x: 1610, y: 190, kind: 'light_capsule', value: 300, collected: false, isSecret: true },
      { id: 'fc8', x: 1680, y: 190, kind: 'copper_coil', value: 200, collected: false, isSecret: true },
      { id: 'fc9', x: 2050, y: 370, kind: 'energy_star', value: 100, collected: false },
      { id: 'fc10', x: 2120, y: 370, kind: 'energy_star', value: 100, collected: false },
      { id: 'fc11', x: 2330, y: 435, kind: 'light_capsule', value: 300, collected: false }
    ],
    switches: [
      {
        id: 'sw-f1',
        x: 1650,
        y: 355,
        activated: false,
        targetId: 'gate-f1',
        labelAr: 'مفتاح البوابة الميكانيكية'
      }
    ],
    gates: [
      {
        id: 'gate-f1',
        x: 1860,
        y: 360,
        w: 28,
        h: 120,
        isOpen: false,
        switchId: 'sw-f1',
        labelAr: 'بوابة المصنع (اضغط المفتاح الأعلى)'
      }
    ],
    checkpoints: [
      { id: 'fcp1', x: 1490, y: 480, activated: false, labelAr: 'نقطة فحص المصنع' }
    ],
    enemies: [
      {
        id: 'fe1',
        x: 420,
        y: 446,
        w: 36,
        h: 34,
        vx: 95,
        minX: 250,
        maxX: 560,
        kind: 'spark_drone',
        defeated: false,
        stompable: true
      },
      {
        id: 'fe2',
        x: 1700,
        y: 446,
        w: 36,
        h: 34,
        vx: -100,
        minX: 1520,
        maxX: 1820,
        kind: 'spark_drone',
        defeated: false,
        stompable: true
      }
    ],
    hazards: [
      {
        id: 'fh1',
        x: 1590,
        y: 468,
        w: 90,
        h: 14,
        kind: 'timed_arc',
        period: 3.2,
        onTime: 1.3,
        offset: 0
      }
    ]
  },

  // ==========================================================================
  // WORLD 3 — عالم الأسلاك (THE COPPER CABLE WORLD)
  // Deep navy & gleaming copper cables, bouncy copper coil springs, vertical paths, bridge puzzle
  // ==========================================================================
  {
    id: 'w3-s1',
    stageIndex: 2,
    worldNumber: 3,
    stageNumber: 1,
    code: '3-1',
    titleAr: 'جسور النحاس المعلقة وأنفاق الطاقة',
    titleEn: 'Suspended Copper Bridges',
    worldTitleAr: 'عالم الأسلاك',
    worldTitleEn: 'The Copper Cable World',
    subtitleAr:
      'اقفز فوق ملفات النحاس النابضة للوصول إلى المسارات العلوية، وفعّل قاطع التوصيل لمد جسر الأسلاك المعزول.',
    difficultyAr: 'متوسط',
    theme: 'copper_world',
    accentColor: '#EA580C',
    skyTop: '#081D35',
    skyBottom: '#102A43',
    width: 2700,
    height: 560,
    groundY: 500,
    heroSpawn: { x: 90, y: 420 },
    goalPortal: { x: 2530, y: 410, labelAr: 'بوابة الموصل النحاسي' },
    platforms: [
      { id: 'c-p1', x: 0, y: 480, w: 660, h: 80, kind: 'solid', material: 'copper' },
      // Bouncy Copper Coil Spring Pad #1
      {
        id: 'c-sp1',
        x: 560,
        y: 454,
        w: 64,
        h: 26,
        kind: 'spring',
        material: 'copper',
        springBoostVy: -790
      },
      // High Copper Cable Deck reached via spring
      { id: 'c-p2', x: 690, y: 270, w: 340, h: 24, kind: 'solid', material: 'copper' },
      // Lower alternative cable bridge
      { id: 'c-p3', x: 730, y: 440, w: 280, h: 24, kind: 'solid', material: 'copper' },
      // Vertical moving elevator cable platform
      {
        id: 'c-p4',
        x: 1100,
        y: 420,
        w: 145,
        h: 24,
        kind: 'moving',
        material: 'copper',
        startX: 1100,
        startY: 430,
        endX: 1100,
        endY: 250,
        speed: 90
      },
      // Central terminal station
      { id: 'c-p5', x: 1310, y: 480, w: 480, h: 80, kind: 'solid', material: 'copper' },
      { id: 'c-p6', x: 1420, y: 340, w: 220, h: 24, kind: 'solid', material: 'copper' },
      // Secret upper copper busbar gallery
      {
        id: 'c-p7',
        x: 1380,
        y: 200,
        w: 250,
        h: 22,
        kind: 'solid',
        material: 'copper',
        isSecret: true
      },
      // Switch-activated Insulated Wire Bridge across the wide chasm
      {
        id: 'c-bridge',
        x: 1810,
        y: 430,
        w: 360,
        h: 24,
        kind: 'bridge_locked',
        material: 'copper',
        switchId: 'sw-c1',
        unlocked: false
      },
      // Backup stepping platforms above the bridge so the player can always progress smoothly
      {
        id: 'c-p8',
        x: 1890,
        y: 335,
        w: 130,
        h: 22,
        kind: 'moving',
        material: 'copper',
        startX: 1850,
        startY: 335,
        endX: 2040,
        endY: 335,
        speed: 95
      },
      // Final Copper Busbar Plaza
      { id: 'c-p9', x: 2200, y: 480, w: 500, h: 80, kind: 'solid', material: 'copper' }
    ],
    collectibles: [
      { id: 'cc1', x: 280, y: 435, kind: 'copper_coil', value: 200, collected: false },
      { id: 'cc2', x: 400, y: 435, kind: 'energy_star', value: 100, collected: false },
      { id: 'cc3', x: 760, y: 225, kind: 'copper_coil', value: 200, collected: false },
      { id: 'cc4', x: 860, y: 225, kind: 'light_capsule', value: 300, collected: false },
      { id: 'cc5', x: 960, y: 225, kind: 'copper_coil', value: 200, collected: false },
      { id: 'cc6', x: 850, y: 395, kind: 'energy_star', value: 100, collected: false },
      { id: 'cc7', x: 1170, y: 310, kind: 'energy_star', value: 100, collected: false },
      // Secret upper busbar stars
      { id: 'cc8', x: 1450, y: 155, kind: 'light_capsule', value: 300, collected: false, isSecret: true },
      { id: 'cc9', x: 1550, y: 155, kind: 'copper_coil', value: 200, collected: false, isSecret: true },
      { id: 'cc10', x: 1980, y: 385, kind: 'copper_coil', value: 200, collected: false },
      { id: 'cc11', x: 2350, y: 435, kind: 'light_capsule', value: 300, collected: false }
    ],
    switches: [
      {
        id: 'sw-c1',
        x: 1530,
        y: 340,
        activated: false,
        targetId: 'c-bridge',
        labelAr: 'قاطع مد جسر الأسلاك المعزول'
      }
    ],
    gates: [],
    checkpoints: [
      { id: 'ccp1', x: 1350, y: 480, activated: false, labelAr: 'محطة ربط الأسلاك' }
    ],
    enemies: [
      {
        id: 'ce1',
        x: 360,
        y: 446,
        w: 38,
        h: 34,
        vx: 95,
        minX: 200,
        maxX: 510,
        kind: 'cable_crawler',
        defeated: false,
        stompable: true
      },
      {
        id: 'ce2',
        x: 840,
        y: 236,
        w: 38,
        h: 34,
        vx: 90,
        minX: 710,
        maxX: 980,
        kind: 'cable_crawler',
        defeated: false,
        stompable: true
      },
      {
        id: 'ce3',
        x: 2350,
        y: 446,
        w: 38,
        h: 34,
        vx: -105,
        minX: 2240,
        maxX: 2470,
        kind: 'cable_crawler',
        defeated: false,
        stompable: true
      }
    ],
    hazards: []
  },

  // ==========================================================================
  // WORLD 4 — مدينة المستقبل (FUTURE LIGHT CITY)
  // Blue & purple twilight, glowing skyline, temporary phase platforms, energy gates
  // ==========================================================================
  {
    id: 'w4-s1',
    stageIndex: 3,
    worldNumber: 4,
    stageNumber: 1,
    code: '4-1',
    titleAr: 'الجسور الضوئية ومنصات الطور',
    titleEn: 'Twilight Sky Walkways',
    worldTitleAr: 'مدينة المستقبل',
    worldTitleEn: 'Future Light City',
    subtitleAr:
      'اعبر المنصات الضوئية المؤقتة برشاقة قبل تلاشيها، واجمع نجوم الطاقة لفتح بوابات الليزر الذكية.',
    difficultyAr: 'متوسط إلى متقدم',
    theme: 'future_city',
    accentColor: '#8B5CF6',
    skyTop: '#0F172A',
    skyBottom: '#312E81',
    width: 2750,
    height: 560,
    groundY: 500,
    heroSpawn: { x: 90, y: 420 },
    goalPortal: { x: 2580, y: 410, labelAr: 'بوابة برج المستقبل' },
    platforms: [
      { id: 'fu1', x: 0, y: 480, w: 560, h: 80, kind: 'solid', material: 'neon_glass' },
      // Temporary Phase Platforms sequence #1
      {
        id: 'fu2',
        x: 630,
        y: 420,
        w: 150,
        h: 22,
        kind: 'phase',
        material: 'neon_glass',
        phaseState: 'ready',
        phaseTimer: 0
      },
      {
        id: 'fu3',
        x: 840,
        y: 365,
        w: 150,
        h: 22,
        kind: 'phase',
        material: 'neon_glass',
        phaseState: 'ready',
        phaseTimer: 0
      },
      // Mid sky-bridge plaza
      { id: 'fu4', x: 1050, y: 480, w: 540, h: 80, kind: 'solid', material: 'neon_glass' },
      // Fast Conveyor Skywalk
      {
        id: 'fu5',
        x: 1160,
        y: 350,
        w: 280,
        h: 24,
        kind: 'conveyor',
        material: 'neon_glass',
        conveyorSpeed: 120
      },
      // Moving + Phase platform combo
      {
        id: 'fu6',
        x: 1650,
        y: 410,
        w: 150,
        h: 24,
        kind: 'moving',
        material: 'neon_glass',
        startX: 1640,
        startY: 410,
        endX: 1850,
        endY: 350,
        speed: 110
      },
      {
        id: 'fu7',
        x: 1950,
        y: 350,
        w: 155,
        h: 22,
        kind: 'phase',
        material: 'neon_glass',
        phaseState: 'ready',
        phaseTimer: 0
      },
      // Final futuristic plaza
      { id: 'fu8', x: 2160, y: 480, w: 590, h: 80, kind: 'solid', material: 'neon_glass' }
    ],
    collectibles: [
      { id: 'fuc1', x: 250, y: 435, kind: 'energy_star', value: 100, collected: false },
      { id: 'fuc2', x: 380, y: 435, kind: 'energy_star', value: 100, collected: false },
      { id: 'fuc3', x: 705, y: 375, kind: 'energy_star', value: 100, collected: false },
      { id: 'fuc4', x: 915, y: 320, kind: 'light_capsule', value: 300, collected: false },
      { id: 'fuc5', x: 1240, y: 305, kind: 'energy_star', value: 100, collected: false },
      { id: 'fuc6', x: 1340, y: 305, kind: 'copper_coil', value: 200, collected: false },
      { id: 'fuc7', x: 1750, y: 330, kind: 'energy_star', value: 100, collected: false },
      { id: 'fuc8', x: 2025, y: 305, kind: 'light_capsule', value: 300, collected: false },
      { id: 'fuc9', x: 2360, y: 435, kind: 'energy_star', value: 100, collected: false }
    ],
    switches: [
      {
        id: 'sw-fu1',
        x: 1300,
        y: 350,
        activated: false,
        targetId: 'gate-fu1',
        labelAr: 'مفتاح البوابة الضوئية الذكية'
      }
    ],
    gates: [
      {
        id: 'gate-fu1',
        x: 1530,
        y: 360,
        w: 26,
        h: 120,
        isOpen: false,
        switchId: 'sw-fu1',
        labelAr: 'بوابة الليزر (فعّل المفتاح العلوي)'
      }
    ],
    checkpoints: [
      { id: 'fucp1', x: 1100, y: 480, activated: false, labelAr: 'منارة المستقبل 1' },
      { id: 'fucp2', x: 2210, y: 480, activated: false, labelAr: 'منارة المستقبل 2' }
    ],
    enemies: [
      {
        id: 'fue1',
        x: 380,
        y: 446,
        w: 38,
        h: 34,
        vx: 110,
        minX: 200,
        maxX: 510,
        kind: 'pulse_sentinel',
        defeated: false,
        stompable: true
      },
      {
        id: 'fue2',
        x: 1360,
        y: 446,
        w: 38,
        h: 34,
        vx: -115,
        minX: 1140,
        maxX: 1490,
        kind: 'pulse_sentinel',
        defeated: false,
        stompable: true
      },
      {
        id: 'fue3',
        x: 2380,
        y: 446,
        w: 38,
        h: 34,
        vx: 120,
        minX: 2250,
        maxX: 2510,
        kind: 'pulse_sentinel',
        defeated: false,
        stompable: true
      }
    ],
    hazards: []
  },

  // ==========================================================================
  // WORLD 5 — قلعة الطاقة (THE ENERGY FORTRESS)
  // Final adventure + Original Mechanical Energy Guardian Boss Encounter
  // ==========================================================================
  {
    id: 'w5-s1',
    stageIndex: 4,
    worldNumber: 5,
    stageNumber: 1,
    code: '5-1',
    titleAr: 'قلعة الطاقة ومواجهة الحارس الآلي',
    titleEn: 'The Energy Fortress & Guardian Boss',
    worldTitleAr: 'قلعة الطاقة',
    worldTitleEn: 'The Energy Fortress',
    subtitleAr:
      'تجاوز دفاعات القلعة، ثم واجه «حارس الطاقة الآلي» عبر تفعيل قواطع الأمان الثلاثة أو القفز فوق نواته المضيئة لإنارة العالم!',
    difficultyAr: 'تحدي الزعيم النهائي',
    theme: 'energy_fortress',
    accentColor: '#F97316',
    skyTop: '#091326',
    skyBottom: '#1E1B38',
    width: 2650,
    height: 560,
    groundY: 500,
    heroSpawn: { x: 90, y: 420 },
    goalPortal: { x: 2510, y: 410, labelAr: 'القاطع الرئيسي للإنارة الحديثة' },
    platforms: [
      // Approach gauntlet
      { id: 'bo1', x: 0, y: 480, w: 640, h: 80, kind: 'solid', material: 'fortress_stone' },
      {
        id: 'bo2',
        x: 700,
        y: 410,
        w: 155,
        h: 24,
        kind: 'moving',
        material: 'fortress_stone',
        startX: 690,
        startY: 410,
        endX: 900,
        endY: 360,
        speed: 105
      },
      {
        id: 'bo3',
        x: 1080,
        y: 350,
        w: 155,
        h: 22,
        kind: 'phase',
        material: 'fortress_stone',
        phaseState: 'ready',
        phaseTimer: 0
      },
      // Grand Boss Arena Floor (x: 1300 to 2650)
      { id: 'bo4', x: 1300, y: 480, w: 1350, h: 80, kind: 'solid', material: 'fortress_stone' },
      // Boss Arena Elevated Tactical Platforms (for dodging shockwaves & reaching breakers/boss core)
      { id: 'bo5', x: 1450, y: 365, w: 170, h: 22, kind: 'solid', material: 'copper' },
      { id: 'bo6', x: 1790, y: 310, w: 190, h: 22, kind: 'solid', material: 'copper' },
      { id: 'bo7', x: 2140, y: 365, w: 170, h: 22, kind: 'solid', material: 'copper' },
      // Spring pad on left of arena for high aerial stomp
      {
        id: 'bo-sp1',
        x: 1360,
        y: 454,
        w: 60,
        h: 26,
        kind: 'spring',
        material: 'copper',
        springBoostVy: -760
      }
    ],
    collectibles: [
      { id: 'boc1', x: 260, y: 435, kind: 'energy_star', value: 100, collected: false },
      { id: 'boc2', x: 480, y: 435, kind: 'copper_coil', value: 200, collected: false },
      { id: 'boc3', x: 810, y: 330, kind: 'energy_star', value: 100, collected: false },
      { id: 'boc4', x: 1155, y: 305, kind: 'light_capsule', value: 300, collected: false },
      { id: 'boc5', x: 1535, y: 320, kind: 'energy_star', value: 100, collected: false },
      { id: 'boc6', x: 1885, y: 265, kind: 'light_capsule', value: 300, collected: false },
      { id: 'boc7', x: 2225, y: 320, kind: 'copper_coil', value: 200, collected: false }
    ],
    switches: [],
    gates: [],
    checkpoints: [
      { id: 'bocp1', x: 1330, y: 480, activated: false, labelAr: 'مدخل قاعة الحارس الآلي' }
    ],
    enemies: [
      {
        id: 'boe1',
        x: 380,
        y: 446,
        w: 38,
        h: 34,
        vx: 105,
        minX: 200,
        maxX: 560,
        kind: 'pulse_sentinel',
        defeated: false,
        stompable: true
      }
    ],
    hazards: [],
    boss: {
      nameAr: 'حارس الطاقة الآلي',
      nameEn: 'Mechanical Energy Guardian',
      x: 1920,
      y: 396,
      w: 84,
      h: 84,
      vx: -115,
      minX: 1500,
      maxX: 2280,
      hp: 3,
      maxHp: 3,
      state: 'patrol',
      stateTimer: 3.0,
      invulnTimer: 0,
      shockwaveLeftX: 1920,
      shockwaveRightX: 1920,
      shockwaveY: 466,
      shockwaveActive: false,
      breakers: [
        { id: 'bb1', x: 1535, y: 365, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ 1' },
        { id: 'bb2', x: 1885, y: 310, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ 2' },
        { id: 'bb3', x: 2225, y: 365, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ 3' }
      ]
    }
  }
]

export const GAME_WORLDS: WorldDefinition[] = [
  {
    worldNumber: 1,
    id: 'city_lights',
    nameAr: 'العالم 1: مدينة الأنوار',
    nameEn: 'World 1: The City of Lights',
    descriptionAr: 'مدينة عصرية مشرقة بمعارض الإنارة والأرصفة والحدائق لتعلم القفز وجمع نجوم الطاقة.',
    difficultyAr: 'سهل',
    accentColor: '#0284C7',
    badgeBg: '#E0F2FE',
    stages: [GAME_STAGES[0]]
  },
  {
    worldNumber: 2,
    id: 'electric_factory',
    nameAr: 'العالم 2: مصنع الكهرباء',
    nameEn: 'World 2: The Electric Factory',
    descriptionAr: 'بيئة صناعية نابضة بالسيور المتحركة والمنصات الميكانيكية والمفاتيح الكهربائية.',
    difficultyAr: 'سهل إلى متوسط',
    accentColor: '#F59E0B',
    badgeBg: '#FEF3C7',
    stages: [GAME_STAGES[1]]
  },
  {
    worldNumber: 3,
    id: 'copper_world',
    nameAr: 'العالم 3: عالم الأسلاك',
    nameEn: 'World 3: The Copper Cable World',
    descriptionAr: 'عالم مستوحى من كابلات النحاس الإيطالية، يضم زنبركات نحاسية وجسور أسلاك ومسارات سرية.',
    difficultyAr: 'متوسط',
    accentColor: '#EA580C',
    badgeBg: '#FFEDD5',
    stages: [GAME_STAGES[2]]
  },
  {
    worldNumber: 4,
    id: 'future_city',
    nameAr: 'العالم 4: مدينة المستقبل',
    nameEn: 'World 4: Future Light City',
    descriptionAr: 'أفق مستقبلي متألق بمنصات الطور المؤقتة وبوابات الطاقة والتحديات السريعة.',
    difficultyAr: 'متوسط إلى صعب',
    accentColor: '#8B5CF6',
    badgeBg: '#EDE9FE',
    stages: [GAME_STAGES[3]]
  },
  {
    worldNumber: 5,
    id: 'energy_fortress',
    nameAr: 'العالم 5: قلعة الطاقة',
    nameEn: 'World 5: The Energy Fortress',
    descriptionAr: 'القلعة الصناعية الكبرى والمواجهة الحاسمة مع حارس الطاقة الآلي لتشغيل القاطع الرئيسي.',
    difficultyAr: 'صعب وعادل',
    accentColor: '#F97316',
    badgeBg: '#FFEDD5',
    stages: [GAME_STAGES[4]]
  }
]

// ============================================================================
// PLAYER PROGRESSION & SAFE MIGRATION ENGINE (SECTION 09 & 21)
// ============================================================================

export interface PlayerProgressionState {
  version: number
  unlockedStageIndex: number
  completedStageIds: string[]
  bestStageScores: Record<string, number>
  stageStarsEarned: Record<string, number>
  totalCollectedEnergy: number
  reducedMotion: boolean
}

const PROGRESSION_STORAGE_KEY = 'enarah_light_hero_progression_v1'

export function getDefaultProgression(): PlayerProgressionState {
  return {
    version: 1,
    unlockedStageIndex: 0,
    completedStageIds: [],
    bestStageScores: {},
    stageStarsEarned: {},
    totalCollectedEnergy: 0,
    reducedMotion: false
  }
}

export function loadPlayerProgression(): PlayerProgressionState {
  if (typeof window === 'undefined') return getDefaultProgression()
  try {
    const raw = localStorage.getItem(PROGRESSION_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...getDefaultProgression(),
        ...parsed,
        unlockedStageIndex: Math.min(
          GAME_STAGES.length - 1,
          Math.max(0, Number(parsed.unlockedStageIndex) || 0)
        )
      }
    }

    // Safe migration from legacy progress or leaderboard if user previously played
    const legacyBoard = localStorage.getItem('enarah_hero_leaderboard')
    if (legacyBoard) {
      try {
        const entries = JSON.parse(legacyBoard)
        if (Array.isArray(entries) && entries.length > 0) {
          const migrated: PlayerProgressionState = {
            ...getDefaultProgression(),
            unlockedStageIndex: Math.min(GAME_STAGES.length - 1, 1)
          }
          localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(migrated))
          return migrated
        }
      } catch {}
    }
  } catch {}
  return getDefaultProgression()
}

export function savePlayerProgression(state: PlayerProgressionState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function recordStageCompletion(
  current: PlayerProgressionState,
  stageId: string,
  stageIndex: number,
  stageScore: number,
  starsEarned: number,
  energyCollected: number
): PlayerProgressionState {
  const completedSet = new Set(current.completedStageIds)
  completedSet.add(stageId)

  const prevBest = current.bestStageScores[stageId] || 0
  const prevStars = current.stageStarsEarned[stageId] || 0

  const nextState: PlayerProgressionState = {
    ...current,
    unlockedStageIndex: Math.min(
      GAME_STAGES.length - 1,
      Math.max(current.unlockedStageIndex, stageIndex + 1)
    ),
    completedStageIds: Array.from(completedSet),
    bestStageScores: {
      ...current.bestStageScores,
      [stageId]: Math.max(prevBest, stageScore)
    },
    stageStarsEarned: {
      ...current.stageStarsEarned,
      [stageId]: Math.max(prevStars, Math.min(3, Math.max(1, starsEarned)))
    },
    totalCollectedEnergy: current.totalCollectedEnergy + Math.max(0, energyCollected)
  }

  savePlayerProgression(nextState)
  return nextState
}
