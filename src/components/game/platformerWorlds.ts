export type WorldThemeId =
  | 'city_of_light'      // Level 1: مدينة النور
  | 'electricity_street' // Level 2: شارع الكهرباء
  | 'lighting_factory'   // Level 3: مصنع الإنارة
  | 'intercom_district'  // Level 4: حي الإنترفون
  | 'power_station'      // Level 5: محطة الطاقة
  | 'dark_city'          // Level 6: المدينة المظلمة
  | 'lighting_tower'     // Level 7: برج الإنارة
  | 'darkness_fortress'  // Level 8: قلعة الظلام

export type HeroAnimState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump_prep'
  | 'jump_ascent'
  | 'falling'
  | 'landing'
  | 'damage'
  | 'attacking'
  | 'dash'
  | 'victory'
  | 'defeat'
  | 'collecting'

export type PlatformKind =
  | 'solid'
  | 'moving'
  | 'conveyor'
  | 'phase'
  | 'spring'
  | 'bridge_locked'
  | 'secret_spotlight' // Revealed when player has LED Spotlight active or gets close

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
  startX?: number
  startY?: number
  endX?: number
  endY?: number
  speed?: number
  dx?: number
  dy?: number
  conveyorSpeed?: number
  phaseState?: 'ready' | 'stepping' | 'phased_out'
  phaseTimer?: number
  switchId?: string
  unlocked?: boolean
  springBoostVy?: number
  springCompress?: number
  isSecret?: boolean
}

// ============================================================================
// SECTION 5 — ELECTRICAL PRODUCT COLLECTION SYSTEM (13 DISTINCT PRODUCTS)
// ============================================================================

export type CollectibleProductKind =
  // Electrical Wires
  | 'wire_1_5mm'
  | 'wire_2_5mm'
  | 'wire_4mm'
  | 'wire_6mm'
  // Lighting Products
  | 'led_bulb'
  | 'led_spotlight'
  | 'led_strip'
  | 'outdoor_fixture'
  | 'rechargeable_floodlight'
  // Electrical Accessories
  | 'intercom_device'
  | 'waterproof_socket'
  | 'electrical_switch_item'
  | 'electrical_connector'

export interface ProductMetadata {
  kind: CollectibleProductKind
  nameAr: string
  categoryAr: 'أسلاك كهربائية' | 'منتجات إنارة' | 'إكسسوارات كهربائية'
  abilityAr: string
  color: string
  defaultValue: number
}

export const PRODUCT_CATALOG_META: Record<CollectibleProductKind, ProductMetadata> = {
  wire_1_5mm: {
    kind: 'wire_1_5mm',
    nameAr: 'سلك نحاس 1.5 مم²',
    categoryAr: 'أسلاك كهربائية',
    abilityAr: 'يستعيد طاقة الإضاءة الأساسية (+15% طاقة)',
    color: '#38BDF8',
    defaultValue: 100,
  },
  wire_2_5mm: {
    kind: 'wire_2_5mm',
    nameAr: 'سلك نحاس 2.5 مم²',
    categoryAr: 'أسلاك كهربائية',
    abilityAr: 'يمنح دفعة سرعة حركة مؤقتة لمدة 6 ثوانٍ',
    color: '#F59E0B',
    defaultValue: 150,
  },
  wire_4mm: {
    kind: 'wire_4mm',
    nameAr: 'سلك نحاس 4 مم²',
    categoryAr: 'أسلاك كهربائية',
    abilityAr: 'يفعّل درعاً عازلاً واقياً ضد الصدمات لمدة 7 ثوانٍ',
    color: '#10B981',
    defaultValue: 220,
  },
  wire_6mm: {
    kind: 'wire_6mm',
    nameAr: 'سلك نحاس 6 مم²',
    categoryAr: 'أسلاك كهربائية',
    abilityAr: 'شحنة طاقة عالية وتقوية مدى الهجوم الضوئي',
    color: '#EA580C',
    defaultValue: 300,
  },
  led_bulb: {
    kind: 'led_bulb',
    nameAr: 'لمبة LED ذكية',
    categoryAr: 'منتجات إنارة',
    abilityAr: 'تستعيد قلباً كاملاً من صحة البطل (+1 صحة)',
    color: '#FDE047',
    defaultValue: 250,
  },
  led_spotlight: {
    kind: 'led_spotlight',
    nameAr: 'سبوت لايت LED',
    categoryAr: 'منتجات إنارة',
    abilityAr: 'يكشف المسارات والمنصات السرية المخفية لمدة 10 ثوانٍ',
    color: '#22D3EE',
    defaultValue: 240,
  },
  led_strip: {
    kind: 'led_strip',
    nameAr: 'شريط إنارة LED',
    categoryAr: 'منتجات إنارة',
    abilityAr: 'يرفع سطوع البطل ويضاعف نقاط التجميع',
    color: '#A855F7',
    defaultValue: 200,
  },
  outdoor_fixture: {
    kind: 'outdoor_fixture',
    nameAr: 'كشاف واجهات خارجي',
    categoryAr: 'منتجات إنارة',
    abilityAr: 'نبضة إضاءة معمارية تضعف الأعداء القريبين',
    color: '#60A5FA',
    defaultValue: 260,
  },
  rechargeable_floodlight: {
    kind: 'rechargeable_floodlight',
    nameAr: 'كشاف شحن طوارئ',
    categoryAr: 'منتجات إنارة',
    abilityAr: 'يوفر إنارة واسعة في المراحل المظلمة لمدة 12 ثانية',
    color: '#FACC15',
    defaultValue: 320,
  },
  intercom_device: {
    kind: 'intercom_device',
    nameAr: 'جهاز إنترفون ذكي',
    categoryAr: 'إكسسوارات كهربائية',
    abilityAr: 'يفتح أبواب الأمان الإلكترونية الخاصة',
    color: '#34D399',
    defaultValue: 280,
  },
  waterproof_socket: {
    kind: 'waterproof_socket',
    nameAr: 'مقبس مقاوم للماء',
    categoryAr: 'إكسسوارات كهربائية',
    abilityAr: 'حماية إضافية من العوائق الكهربائية والأرضيات النشطة',
    color: '#06B6D4',
    defaultValue: 190,
  },
  electrical_switch_item: {
    kind: 'electrical_switch_item',
    nameAr: 'مفتاح كهربائي ذكي',
    categoryAr: 'إكسسوارات كهربائية',
    abilityAr: 'يرفع طاقة الشبكة ويزيد نقاط المرحلة',
    color: '#FB923C',
    defaultValue: 180,
  },
  electrical_connector: {
    kind: 'electrical_connector',
    nameAr: 'وصلة كهربائية معزولة',
    categoryAr: 'إكسسوارات كهربائية',
    abilityAr: 'تجدد طاقة الاندفاع السريع (Dash) فوراً',
    color: '#F43F5E',
    defaultValue: 170,
  },
}

export interface CollectibleStar {
  id: string
  x: number
  y: number
  kind: CollectibleProductKind
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
  requiredIntercoms?: number
  requiredSwitchesCount?: number
  labelAr: string
}

export interface CheckpointLamp {
  id: string
  x: number
  y: number
  activated: boolean
  labelAr: string
}

// ============================================================================
// SECTION 7 — 8 UNIQUE ENEMY TYPES & STATE MACHINE
// ============================================================================

export type EnemyKind =
  | 'electrical_spark'    // شرارات كهربائية
  | 'cable_snake'         // أفاعي الكابلات
  | 'flying_drone'        // طائرات درون طائرة
  | 'mechanical_spider'   // عناكب ميكانيكية
  | 'security_robot'      // روبوتات الحراسة
  | 'shadow_creature'     // كائنات الظل
  | 'transformer_monster' // وحوش المحولات
  | 'giant_guardian'      // الحراس العمالقة

export type EnemyAIState = 'idle' | 'patrol' | 'detect' | 'attack' | 'recover' | 'defeated'

export interface PlatformEnemy {
  id: string
  x: number
  y: number
  w: number
  h: number
  vx: number
  vy?: number
  baseY?: number
  minX: number
  maxX: number
  kind: EnemyKind
  aiState?: EnemyAIState
  aiTimer?: number
  hp?: number
  maxHp?: number
  defeated: boolean
  stompable: boolean
}

export interface StageHazard {
  id: string
  x: number
  y: number
  w: number
  h: number
  kind: 'electric_floor' | 'timed_arc' | 'rotating_hazard' | 'mechanical_press'
  period?: number
  onTime?: number
  offset?: number
  angle?: number
  radius?: number
  baseY?: number
}

export interface BossBreakerSwitch {
  id: string
  x: number
  y: number
  activated: boolean
  cooldown: number
  labelAr: string
}

export interface BossProjectile {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  life: number
}

export type BossArchetype =
  | 'security_robot_boss'        // Level 2 Boss: روبوت الحراسة المدرع
  | 'transformer_guardian_boss'  // Level 5 Boss: حارس المحطة العملاق
  | 'construction_robot_boss'    // Level 7 Boss: عملاق البناء الآلي
  | 'electric_dark_king_boss'    // Level 8 3-Phase Final Boss: ملك الظلام الكهربائي

export interface BossGuardian {
  archetype: BossArchetype
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
  phase: 1 | 2 | 3
  state: 'patrol' | 'telegraph' | 'shockwave' | 'projectile_barrage' | 'dash_attack' | 'vulnerable' | 'defeated'
  stateTimer: number
  invulnTimer: number
  shockwaveLeftX: number
  shockwaveRightX: number
  shockwaveY: number
  shockwaveActive: boolean
  projectiles: BossProjectile[]
  breakers: BossBreakerSwitch[]
}

export type FinalChallengeType =
  | 'three_switches_hazard'    // Level 1: Activate 3 switches while avoiding moving hazards
  | 'boss_security_robot'      // Level 2: Defeat Security Robot Boss
  | 'timed_machine_escape'     // Level 3: Escape malfunctioning machine before timer expires
  | 'intercom_security_puzzle' // Level 4: Multi-stage Intercom & Security Doors puzzle
  | 'boss_transformer'         // Level 5: Defeat Giant Transformer Guardian
  | 'timed_power_restoration'  // Level 6: Restore city power generators under time pressure
  | 'boss_construction_giant'  // Level 7: Defeat Giant Construction Robot in wind & vertical arena
  | 'boss_dark_king_3phase'    // Level 8: Defeat 3-Phase Electric King of Darkness

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
  finalChallengeAr: string
  finalChallengeType: FinalChallengeType
  challengeTimeLimitSec?: number // Used in Level 3 & Level 6 timed final challenges
  darknessLevel?: number         // Used in Level 6 & Level 8 blackout zones (0 to 0.88)
  windForce?: number             // Used in Level 7 & Level 8 high-altitude wind gusts
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
// EIGHT PROGRESSIVELY DIFFICULT LEVELS (SECTION 6 & SECTION 8)
// ============================================================================

export const GAME_STAGES: StageDefinition[] = [
  // ==========================================================================
  // LEVEL 1 — مدينة النور (THE CITY OF LIGHT)
  // Environment: Modern city with electrical stores, bright daytime lighting
  // Enemies: Small electrical sparks
  // Collectibles: LED bulbs and basic wires (1.5mm, 2.5mm)
  // Final challenge: Activate 3 electrical switches while avoiding moving hazards
  // ==========================================================================
  {
    id: 'lvl-1',
    stageIndex: 0,
    worldNumber: 1,
    stageNumber: 1,
    code: '1-1',
    titleAr: 'مدينة النور — معارض الإنارة الحديثة',
    titleEn: 'City of Light — Modern Showrooms',
    worldTitleAr: 'مدينة النور',
    worldTitleEn: 'City of Light',
    subtitleAr:
      'انطلق بشخصية اللمبة المضيئة عبر شوارع المدينة المشرقة، اجمع أسلاك 1.5 مم² ولمبات LED، ثم فعّل القواطع الثلاثة في نهاية المرحلة!',
    difficultyAr: 'سهل – متوسط',
    finalChallengeAr: 'تفعيل 3 قواطع كهربائية مع تفادي الشرارات المتحركة',
    finalChallengeType: 'three_switches_hazard',
    theme: 'city_of_light',
    accentColor: '#0284C7',
    skyTop: '#38BDF8',
    skyBottom: '#E0F2FE',
    width: 2650,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 2510, y: 405, labelAr: 'بوابة معرض الإنارة الحديثة' },
    platforms: [
      { id: 'l1-p1', x: 0, y: 480, w: 680, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l1-p2', x: 240, y: 380, w: 145, h: 24, kind: 'solid', material: 'brick' },
      { id: 'l1-p3', x: 430, y: 315, w: 155, h: 24, kind: 'solid', material: 'brick' },
      { id: 'l1-p4', x: 750, y: 480, w: 640, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l1-p5', x: 880, y: 370, w: 170, h: 24, kind: 'solid', material: 'steel' },
      { id: 'l1-p6', x: 1110, y: 295, w: 180, h: 24, kind: 'solid', material: 'copper', isSecret: true },
      // Final Challenge Arena (3 Switches on elevated & ground tiers)
      { id: 'l1-p7', x: 1460, y: 480, w: 1190, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l1-p8', x: 1580, y: 375, w: 165, h: 24, kind: 'solid', material: 'brick' },
      { id: 'l1-p9', x: 1830, y: 310, w: 180, h: 24, kind: 'solid', material: 'steel' },
      { id: 'l1-p10', x: 2090, y: 375, w: 165, h: 24, kind: 'solid', material: 'brick' },
    ],
    collectibles: [
      { id: 'l1-c1', x: 190, y: 435, kind: 'wire_1_5mm', value: 100, collected: false },
      { id: 'l1-c2', x: 310, y: 335, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l1-c3', x: 505, y: 270, kind: 'wire_1_5mm', value: 100, collected: false },
      { id: 'l1-c4', x: 820, y: 435, kind: 'wire_2_5mm', value: 150, collected: false },
      { id: 'l1-c5', x: 965, y: 325, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l1-c6', x: 1195, y: 250, kind: 'led_spotlight', value: 240, collected: false, isSecret: true },
      { id: 'l1-c7', x: 1660, y: 330, kind: 'wire_1_5mm', value: 100, collected: false },
      { id: 'l1-c8', x: 1920, y: 265, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l1-c9', x: 2170, y: 330, kind: 'wire_2_5mm', value: 150, collected: false },
    ],
    switches: [
      { id: 'l1-sw1', x: 1660, y: 375, activated: false, targetId: 'l1-gate', labelAr: 'قاطع النور 1/3' },
      { id: 'l1-sw2', x: 1920, y: 310, activated: false, targetId: 'l1-gate', labelAr: 'قاطع النور 2/3' },
      { id: 'l1-sw3', x: 2170, y: 375, activated: false, targetId: 'l1-gate', labelAr: 'قاطع النور 3/3' },
    ],
    gates: [
      {
        id: 'l1-gate',
        x: 2370,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        requiredSwitchesCount: 3,
        labelAr: 'بوابة المعرض (فعّل القواطع الثلاثة 3/3)',
      },
    ],
    checkpoints: [
      { id: 'l1-cp1', x: 790, y: 480, activated: false, labelAr: 'عمود إنارة 1' },
      { id: 'l1-cp2', x: 1510, y: 480, activated: false, labelAr: 'مدخل ساحة القواطع الثلاثة' },
    ],
    enemies: [
      {
        id: 'l1-e1',
        x: 490,
        y: 448,
        w: 32,
        h: 32,
        vx: 95,
        minX: 340,
        maxX: 640,
        kind: 'electrical_spark',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l1-e2',
        x: 1050,
        y: 448,
        w: 32,
        h: 32,
        vx: -105,
        minX: 830,
        maxX: 1320,
        kind: 'electrical_spark',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l1-e3',
        x: 1780,
        y: 448,
        w: 32,
        h: 32,
        vx: 115,
        minX: 1560,
        maxX: 2020,
        kind: 'electrical_spark',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l1-e4',
        x: 2120,
        y: 448,
        w: 32,
        h: 32,
        vx: -120,
        minX: 1950,
        maxX: 2330,
        kind: 'electrical_spark',
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [
      {
        id: 'l1-h1',
        x: 1755,
        y: 466,
        w: 55,
        h: 14,
        kind: 'timed_arc',
        period: 2.8,
        onTime: 1.1,
        offset: 0,
      },
      {
        id: 'l1-h2',
        x: 2020,
        y: 466,
        w: 55,
        h: 14,
        kind: 'timed_arc',
        period: 2.8,
        onTime: 1.1,
        offset: 1.4,
      },
    ],
  },

  // ==========================================================================
  // LEVEL 2 — شارع الكهرباء (ELECTRICITY STREET)
  // Environment: Busy commercial district
  // New mechanics: Moving platforms & rotating hazards + Dash unlocked
  // Enemies: Cable snakes & small electrical security robots
  // Collectibles: Wires (2.5mm, 4mm) and LED spotlights
  // Final Boss: Security Robot (روبوت الحراسة المدرع)
  // ==========================================================================
  {
    id: 'lvl-2',
    stageIndex: 1,
    worldNumber: 2,
    stageNumber: 1,
    code: '2-1',
    titleAr: 'شارع الكهرباء — الحي التجاري النابض',
    titleEn: 'Electricity Street — Commercial District',
    worldTitleAr: 'شارع الكهرباء',
    worldTitleEn: 'Electricity Street',
    subtitleAr:
      'اعبر المنصات المتحركة والعوائق الدوارة، التقط سبوت لايت LED لكشف المسارات السرية، واهزم «روبوت الحراسة المدرع»!',
    difficultyAr: 'متوسط',
    finalChallengeAr: 'مواجهة زعيم المنطقة: روبوت الحراسة المدرع',
    finalChallengeType: 'boss_security_robot',
    theme: 'electricity_street',
    accentColor: '#F59E0B',
    skyTop: '#1E293B',
    skyBottom: '#334155',
    width: 2750,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 2610, y: 405, labelAr: 'بوابة المنطقة الصناعية' },
    platforms: [
      { id: 'l2-p1', x: 0, y: 480, w: 580, h: 80, kind: 'solid', material: 'concrete' },
      {
        id: 'l2-p2',
        x: 640,
        y: 415,
        w: 155,
        h: 24,
        kind: 'moving',
        material: 'steel',
        startX: 620,
        startY: 415,
        endX: 850,
        endY: 365,
        speed: 95,
      },
      { id: 'l2-p3', x: 930, y: 480, w: 520, h: 80, kind: 'solid', material: 'concrete' },
      // Secret spotlight platform above commercial street
      { id: 'l2-p4', x: 1050, y: 290, w: 190, h: 22, kind: 'secret_spotlight', material: 'neon_glass', isSecret: true },
      {
        id: 'l2-p5',
        x: 1510,
        y: 390,
        w: 155,
        h: 24,
        kind: 'moving',
        material: 'copper',
        startX: 1490,
        startY: 410,
        endX: 1700,
        endY: 340,
        speed: 105,
      },
      // Boss Arena
      { id: 'l2-p6', x: 1780, y: 480, w: 970, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l2-p7', x: 1910, y: 365, w: 160, h: 22, kind: 'solid', material: 'steel' },
      { id: 'l2-p8', x: 2240, y: 365, w: 160, h: 22, kind: 'solid', material: 'steel' },
    ],
    collectibles: [
      { id: 'l2-c1', x: 240, y: 435, kind: 'wire_2_5mm', value: 150, collected: false },
      { id: 'l2-c2', x: 450, y: 435, kind: 'led_spotlight', value: 240, collected: false },
      { id: 'l2-c3', x: 745, y: 335, kind: 'wire_2_5mm', value: 150, collected: false },
      { id: 'l2-c4', x: 1140, y: 245, kind: 'wire_4mm', value: 220, collected: false, isSecret: true },
      { id: 'l2-c5', x: 1220, y: 435, kind: 'led_spotlight', value: 240, collected: false },
      { id: 'l2-c6', x: 1610, y: 310, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l2-c7', x: 1990, y: 320, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l2-c8', x: 2320, y: 320, kind: 'led_bulb', value: 250, collected: false },
    ],
    switches: [],
    gates: [],
    checkpoints: [
      { id: 'l2-cp1', x: 960, y: 480, activated: false, labelAr: 'تقاطع شارع الكهرباء' },
      { id: 'l2-cp2', x: 1810, y: 480, activated: false, labelAr: 'ساحة روبوت الحراسة' },
    ],
    enemies: [
      {
        id: 'l2-e1',
        x: 360,
        y: 452,
        w: 44,
        h: 28,
        vx: 105,
        minX: 200,
        maxX: 540,
        kind: 'cable_snake',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l2-e2',
        x: 1180,
        y: 442,
        w: 38,
        h: 38,
        vx: -110,
        minX: 980,
        maxX: 1410,
        kind: 'security_robot',
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [
      {
        id: 'l2-h1',
        x: 1120,
        y: 390,
        w: 36,
        h: 36,
        kind: 'rotating_hazard',
        radius: 52,
        angle: 0,
      },
    ],
    boss: {
      archetype: 'security_robot_boss',
      nameAr: 'روبوت الحراسة المدرع',
      nameEn: 'Armored Security Robot',
      x: 2180,
      y: 404,
      w: 72,
      h: 76,
      vx: -125,
      minX: 1850,
      maxX: 2460,
      hp: 3,
      maxHp: 3,
      phase: 1,
      state: 'patrol',
      stateTimer: 2.6,
      invulnTimer: 0,
      shockwaveLeftX: 2180,
      shockwaveRightX: 2180,
      shockwaveY: 466,
      shockwaveActive: false,
      projectiles: [],
      breakers: [
        { id: 'l2-bb1', x: 1990, y: 365, activated: false, cooldown: 0, labelAr: 'قاطع تعطيل الدرع 1' },
        { id: 'l2-bb2', x: 2320, y: 365, activated: false, cooldown: 0, labelAr: 'قاطع تعطيل الدرع 2' },
      ],
    },
  },

  // ==========================================================================
  // LEVEL 3 — مصنع الإنارة (THE LIGHTING FACTORY)
  // Environment: Detailed industrial lighting factory
  // New mechanics: Conveyor belts, mechanical presses, timed doors
  // Enemies: Mechanical spiders & flying drones
  // Collectibles: LED strips, outdoor lighting fixtures, waterproof sockets
  // Final challenge: Escape a malfunctioning production machine before timer expires!
  // ==========================================================================
  {
    id: 'lvl-3',
    stageIndex: 2,
    worldNumber: 3,
    stageNumber: 1,
    code: '3-1',
    titleAr: 'مصنع الإنارة — خطوط الإنتاج الآلية',
    titleEn: 'The Lighting Factory — Automated Lines',
    worldTitleAr: 'مصنع الإنارة',
    worldTitleEn: 'The Lighting Factory',
    subtitleAr:
      'تجاوز السيور الناقلة والمكابس الميكانيكية والعناكب الآلية، واجمع شرائط LED، ثم اهرب من خط الإنتاج المتعطل قبل نفاد الوقت!',
    difficultyAr: 'متوسط – صعب',
    finalChallengeAr: 'سباق الهروب من الآلة الصناعية المعطلة قبل انتهاء العد التنازلي (75 ثانية)',
    finalChallengeType: 'timed_machine_escape',
    challengeTimeLimitSec: 75,
    theme: 'lighting_factory',
    accentColor: '#EA580C',
    skyTop: '#0F172A',
    skyBottom: '#1E293B',
    width: 2800,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 2660, y: 405, labelAr: 'مخرج الطوارئ الآمن للمصنع' },
    platforms: [
      { id: 'l3-p1', x: 0, y: 480, w: 520, h: 80, kind: 'solid', material: 'steel' },
      {
        id: 'l3-p2',
        x: 560,
        y: 440,
        w: 380,
        h: 26,
        kind: 'conveyor',
        material: 'steel',
        conveyorSpeed: -85,
      },
      { id: 'l3-p3', x: 990, y: 480, w: 560, h: 80, kind: 'solid', material: 'steel' },
      { id: 'l3-p4', x: 1120, y: 365, w: 220, h: 24, kind: 'solid', material: 'copper' },
      // High-speed escape conveyor gauntlet
      {
        id: 'l3-p5',
        x: 1610,
        y: 420,
        w: 360,
        h: 26,
        kind: 'conveyor',
        material: 'steel',
        conveyorSpeed: 115,
      },
      {
        id: 'l3-p6',
        x: 2030,
        y: 375,
        w: 170,
        h: 24,
        kind: 'moving',
        material: 'copper',
        startX: 2010,
        startY: 390,
        endX: 2220,
        endY: 340,
        speed: 120,
      },
      { id: 'l3-p7', x: 2280, y: 480, w: 520, h: 80, kind: 'solid', material: 'steel' },
    ],
    collectibles: [
      { id: 'l3-c1', x: 260, y: 435, kind: 'led_strip', value: 200, collected: false },
      { id: 'l3-c2', x: 690, y: 395, kind: 'waterproof_socket', value: 190, collected: false },
      { id: 'l3-c3', x: 840, y: 395, kind: 'led_strip', value: 200, collected: false },
      { id: 'l3-c4', x: 1230, y: 320, kind: 'outdoor_fixture', value: 260, collected: false },
      { id: 'l3-c5', x: 1420, y: 435, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l3-c6', x: 1780, y: 375, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l3-c7', x: 2120, y: 300, kind: 'outdoor_fixture', value: 260, collected: false },
      { id: 'l3-c8', x: 2460, y: 435, kind: 'led_strip', value: 200, collected: false },
    ],
    switches: [
      {
        id: 'l3-sw1',
        x: 1230,
        y: 365,
        activated: false,
        targetId: 'l3-gate1',
        labelAr: 'مفتاح فتح بوابة الطوارئ الموقوتة',
      },
    ],
    gates: [
      {
        id: 'l3-gate1',
        x: 1520,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l3-sw1',
        labelAr: 'بوابة خط الإنتاج (فعّل المفتاح العلوي)',
      },
    ],
    checkpoints: [
      { id: 'l3-cp1', x: 1020, y: 480, activated: false, labelAr: 'وحدة تحكم المصنع 1' },
      { id: 'l3-cp2', x: 2320, y: 480, activated: false, labelAr: 'ممر الهروب النهائي' },
    ],
    enemies: [
      {
        id: 'l3-e1',
        x: 340,
        y: 446,
        w: 40,
        h: 34,
        vx: 115,
        minX: 180,
        maxX: 490,
        kind: 'mechanical_spider',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l3-e2',
        x: 760,
        y: 320,
        w: 40,
        h: 34,
        vx: 95,
        baseY: 320,
        minX: 590,
        maxX: 920,
        kind: 'flying_drone',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l3-e3',
        x: 1280,
        y: 446,
        w: 40,
        h: 34,
        vx: -120,
        minX: 1040,
        maxX: 1480,
        kind: 'mechanical_spider',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l3-e4',
        x: 2450,
        y: 340,
        w: 40,
        h: 34,
        vx: 110,
        baseY: 340,
        minX: 2310,
        maxX: 2610,
        kind: 'flying_drone',
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [
      {
        id: 'l3-press1',
        x: 680,
        y: 360,
        w: 48,
        h: 80,
        baseY: 340,
        kind: 'mechanical_press',
        period: 2.4,
        onTime: 0.9,
        offset: 0,
      },
      {
        id: 'l3-press2',
        x: 1760,
        y: 340,
        w: 48,
        h: 80,
        baseY: 320,
        kind: 'mechanical_press',
        period: 2.1,
        onTime: 0.85,
        offset: 1.0,
      },
    ],
  },

  // ==========================================================================
  // LEVEL 4 — حي الإنترفون (THE INTERCOM NEIGHBORHOOD)
  // Environment: Modern residential neighborhood
  // New mechanics: Security doors, access switches, elevators + Double Jump unlocked
  // Enemies: Security drones & patrol robots
  // Collectibles: Intercom devices and electrical switches
  // Final challenge: Solve a multi-stage security puzzle while avoiding enemies
  // ==========================================================================
  {
    id: 'lvl-4',
    stageIndex: 3,
    worldNumber: 4,
    stageNumber: 1,
    code: '4-1',
    titleAr: 'حي الإنترفون — الفلل الذكية وبوابات الأمان',
    titleEn: 'Intercom Neighborhood — Smart Villas',
    worldTitleAr: 'حي الإنترفون',
    worldTitleEn: 'Intercom Neighborhood',
    subtitleAr:
      'اجمع أجهزة الإنترفون الذكية والمفاتيح الكهربائية، استخدم المصاعد العمودية والقفز المزدوج، وحل لغز بوابات الأمان المتعددة!',
    difficultyAr: 'صعب',
    finalChallengeAr: 'لغز بوابات الأمان الذكية متعدد المراحل (جمع أجهزة الإنترفون + تفعيل قواطع الشفرة)',
    finalChallengeType: 'intercom_security_puzzle',
    theme: 'intercom_district',
    accentColor: '#10B981',
    skyTop: '#0F2942',
    skyBottom: '#1E3A5F',
    width: 2850,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 2710, y: 405, labelAr: 'بوابة القصر الذكي' },
    platforms: [
      { id: 'l4-p1', x: 0, y: 480, w: 640, h: 80, kind: 'solid', material: 'concrete' },
      // Vertical Elevator 1
      {
        id: 'l4-elev1',
        x: 690,
        y: 420,
        w: 135,
        h: 22,
        kind: 'moving',
        material: 'neon_glass',
        startX: 690,
        startY: 440,
        endX: 690,
        endY: 260,
        speed: 95,
      },
      { id: 'l4-p2', x: 870, y: 270, w: 320, h: 24, kind: 'solid', material: 'brick' },
      { id: 'l4-p3', x: 920, y: 480, w: 720, h: 80, kind: 'solid', material: 'concrete' },
      // Security Puzzle Multi-tier Complex
      {
        id: 'l4-elev2',
        x: 1690,
        y: 410,
        w: 135,
        h: 22,
        kind: 'moving',
        material: 'neon_glass',
        startX: 1690,
        startY: 445,
        endX: 1690,
        endY: 250,
        speed: 105,
      },
      { id: 'l4-p4', x: 1870, y: 480, w: 980, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l4-p5', x: 1880, y: 265, w: 240, h: 24, kind: 'solid', material: 'steel' },
      { id: 'l4-p6', x: 2210, y: 335, w: 220, h: 24, kind: 'solid', material: 'steel' },
    ],
    collectibles: [
      { id: 'l4-c1', x: 280, y: 435, kind: 'intercom_device', value: 280, collected: false },
      { id: 'l4-c2', x: 510, y: 435, kind: 'electrical_switch_item', value: 180, collected: false },
      { id: 'l4-c3', x: 1020, y: 225, kind: 'intercom_device', value: 280, collected: false },
      { id: 'l4-c4', x: 1260, y: 435, kind: 'electrical_connector', value: 170, collected: false },
      { id: 'l4-c5', x: 1990, y: 220, kind: 'intercom_device', value: 280, collected: false },
      { id: 'l4-c6', x: 2310, y: 290, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l4-c7', x: 2520, y: 435, kind: 'electrical_switch_item', value: 180, collected: false },
    ],
    switches: [
      {
        id: 'l4-sw1',
        x: 1120,
        y: 270,
        activated: false,
        targetId: 'l4-gate1',
        labelAr: 'وحدة إنترفون البوابة الأولى',
      },
      {
        id: 'l4-sw2',
        x: 2060,
        y: 265,
        activated: false,
        targetId: 'l4-gate2',
        labelAr: 'شفرة الأمان العليا (1/2)',
      },
      {
        id: 'l4-sw3',
        x: 2380,
        y: 335,
        activated: false,
        targetId: 'l4-gate2',
        labelAr: 'شفرة الأمان الوسطى (2/2)',
      },
    ],
    gates: [
      {
        id: 'l4-gate1',
        x: 1520,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l4-sw1',
        labelAr: 'بوابة الحي السكني (فعّل إنترفون السطح)',
      },
      {
        id: 'l4-gate2',
        x: 2580,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        requiredSwitchesCount: 3,
        labelAr: 'بوابة الأمان الذكية (فعّل جميع وحدات الإنترفون 3/3)',
      },
    ],
    checkpoints: [
      { id: 'l4-cp1', x: 960, y: 480, activated: false, labelAr: 'بوابة الفلل الذكية 1' },
      { id: 'l4-cp2', x: 1910, y: 480, activated: false, labelAr: 'ساحة لغز الإنترفون' },
    ],
    enemies: [
      {
        id: 'l4-e1',
        x: 420,
        y: 442,
        w: 38,
        h: 38,
        vx: 110,
        minX: 210,
        maxX: 590,
        kind: 'security_robot',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l4-e2',
        x: 1250,
        y: 340,
        w: 40,
        h: 34,
        vx: -105,
        baseY: 340,
        minX: 980,
        maxX: 1470,
        kind: 'flying_drone',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l4-e3',
        x: 2150,
        y: 442,
        w: 38,
        h: 38,
        vx: 125,
        minX: 1930,
        maxX: 2520,
        kind: 'security_robot',
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [],
  },

  // ==========================================================================
  // LEVEL 5 — محطة الطاقة (THE POWER STATION)
  // Environment: Large industrial power station
  // New mechanics: Electrical currents & synchronized moving platforms
  // Enemies: Electrical creatures & transformer robots
  // Final Boss: Giant Transformer Guardian (shockwaves, projectiles, area attacks)
  // ==========================================================================
  {
    id: 'lvl-5',
    stageIndex: 4,
    worldNumber: 5,
    stageNumber: 1,
    code: '5-1',
    titleAr: 'محطة الطاقة — المولدات عالية الجهد',
    titleEn: 'The Power Station — High Voltage Grid',
    worldTitleAr: 'محطة الطاقة',
    worldTitleEn: 'The Power Station',
    subtitleAr:
      'اقفز عبر المنصات المتزامنة والتيارات الكهربائية العالية، اجمع كابلات 6 مم²، وواجه الزعيم «حارس المحطة العملاق»!',
    difficultyAr: 'صعب+',
    finalChallengeAr: 'معركة الزعيم: حارس المحطة العملاق (موجات صدمية + قذائف بلازما)',
    finalChallengeType: 'boss_transformer',
    theme: 'power_station',
    accentColor: '#38BDF8',
    skyTop: '#091526',
    skyBottom: '#162B4D',
    width: 2850,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 2710, y: 405, labelAr: 'قلب محطة الطاقة' },
    platforms: [
      { id: 'l5-p1', x: 0, y: 480, w: 560, h: 80, kind: 'solid', material: 'copper' },
      // Synchronized moving platforms over high-voltage gap
      {
        id: 'l5-sync1',
        x: 620,
        y: 410,
        w: 145,
        h: 22,
        kind: 'moving',
        material: 'copper',
        startX: 600,
        startY: 410,
        endX: 810,
        endY: 350,
        speed: 115,
      },
      {
        id: 'l5-sync2',
        x: 890,
        y: 350,
        w: 145,
        h: 22,
        kind: 'moving',
        material: 'copper',
        startX: 870,
        startY: 350,
        endX: 1080,
        endY: 410,
        speed: 115,
      },
      { id: 'l5-p2', x: 1150, y: 480, w: 520, h: 80, kind: 'solid', material: 'steel' },
      {
        id: 'l5-sp1',
        x: 1560,
        y: 454,
        w: 58,
        h: 26,
        kind: 'spring',
        material: 'copper',
        springBoostVy: -750,
      },
      // Boss Arena
      { id: 'l5-arena', x: 1730, y: 480, w: 1120, h: 80, kind: 'solid', material: 'fortress_stone' },
      { id: 'l5-bplat1', x: 1860, y: 360, w: 165, h: 22, kind: 'solid', material: 'copper' },
      { id: 'l5-bplat2', x: 2150, y: 305, w: 180, h: 22, kind: 'solid', material: 'copper' },
      { id: 'l5-bplat3', x: 2440, y: 360, w: 165, h: 22, kind: 'solid', material: 'copper' },
    ],
    collectibles: [
      { id: 'l5-c1', x: 260, y: 435, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l5-c2', x: 710, y: 330, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l5-c3', x: 980, y: 330, kind: 'electrical_connector', value: 170, collected: false },
      { id: 'l5-c4', x: 1350, y: 435, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l5-c5', x: 1940, y: 315, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l5-c6', x: 2240, y: 260, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l5-c7', x: 2520, y: 315, kind: 'wire_6mm', value: 300, collected: false },
    ],
    switches: [],
    gates: [],
    checkpoints: [
      { id: 'l5-cp1', x: 1190, y: 480, activated: false, labelAr: 'محول الجهد المتوسط' },
      { id: 'l5-cp2', x: 1760, y: 480, activated: false, labelAr: 'قاعة حارس المحطة العملاق' },
    ],
    enemies: [
      {
        id: 'l5-e1',
        x: 360,
        y: 448,
        w: 32,
        h: 32,
        vx: 120,
        minX: 190,
        maxX: 520,
        kind: 'electrical_spark',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l5-e2',
        x: 1380,
        y: 436,
        w: 44,
        h: 44,
        vx: -95,
        minX: 1210,
        maxX: 1530,
        kind: 'transformer_monster',
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [
      {
        id: 'l5-h1',
        x: 1290,
        y: 466,
        w: 65,
        h: 14,
        kind: 'timed_arc',
        period: 2.4,
        onTime: 1.0,
        offset: 0,
      },
    ],
    boss: {
      archetype: 'transformer_guardian_boss',
      nameAr: 'حارس المحطة العملاق',
      nameEn: 'Giant Transformer Guardian',
      x: 2260,
      y: 392,
      w: 86,
      h: 88,
      vx: -130,
      minX: 1840,
      maxX: 2580,
      hp: 4,
      maxHp: 4,
      phase: 1,
      state: 'patrol',
      stateTimer: 2.4,
      invulnTimer: 0,
      shockwaveLeftX: 2260,
      shockwaveRightX: 2260,
      shockwaveY: 466,
      shockwaveActive: false,
      projectiles: [],
      breakers: [
        { id: 'l5-bb1', x: 1940, y: 360, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ 1' },
        { id: 'l5-bb2', x: 2240, y: 305, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ 2' },
        { id: 'l5-bb3', x: 2520, y: 360, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ 3' },
      ],
    },
  },

  // ==========================================================================
  // LEVEL 6 — المدينة المظلمة (THE DARK CITY)
  // Environment: A city during a massive blackout
  // New mechanics: Limited visibility & temporary light sources (Rechargeable Floodlights)
  // Enemies: Shadow creatures & flying electrical monsters
  // Final challenge: Restore power to the city under time pressure (80s)!
  // ==========================================================================
  {
    id: 'lvl-6',
    stageIndex: 5,
    worldNumber: 6,
    stageNumber: 1,
    code: '6-1',
    titleAr: 'المدينة المظلمة — مهمة كسر التعتيم الشامل',
    titleEn: 'The Dark City — Blackout Rescue',
    worldTitleAr: 'المدينة المظلمة',
    worldTitleEn: 'The Dark City',
    subtitleAr:
      'خيّم الظلام على المدينة! اعتمد على توهج لمبة البطل واجمع «كشافات الشحن» لتوسيع الرؤية، وشغّل مولدات الطوارئ الثلاثة قبل نفاد الوقت!',
    difficultyAr: 'صعب جداً',
    finalChallengeAr: 'إعادة التيار للمدينة بتشغيل 3 مولدات طوارئ تحت ضغط الوقت (80 ثانية)',
    finalChallengeType: 'timed_power_restoration',
    challengeTimeLimitSec: 80,
    darknessLevel: 0.82,
    theme: 'dark_city',
    accentColor: '#FACC15',
    skyTop: '#030712',
    skyBottom: '#0F172A',
    width: 2800,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 2660, y: 405, labelAr: 'برج استعادة النور' },
    platforms: [
      { id: 'l6-p1', x: 0, y: 480, w: 620, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l6-p2', x: 340, y: 365, w: 170, h: 24, kind: 'solid', material: 'brick' },
      {
        id: 'l6-p3',
        x: 680,
        y: 400,
        w: 155,
        h: 22,
        kind: 'phase',
        material: 'neon_glass',
        phaseState: 'ready',
        phaseTimer: 0,
      },
      { id: 'l6-p4', x: 900, y: 480, w: 720, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l6-p5', x: 1120, y: 350, w: 210, h: 24, kind: 'solid', material: 'steel' },
      {
        id: 'l6-p6',
        x: 1680,
        y: 385,
        w: 160,
        h: 24,
        kind: 'moving',
        material: 'neon_glass',
        startX: 1660,
        startY: 400,
        endX: 1880,
        endY: 330,
        speed: 115,
      },
      { id: 'l6-p7', x: 1960, y: 480, w: 840, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l6-p8', x: 2150, y: 355, w: 200, h: 24, kind: 'solid', material: 'copper' },
    ],
    collectibles: [
      { id: 'l6-c1', x: 220, y: 435, kind: 'rechargeable_floodlight', value: 320, collected: false },
      { id: 'l6-c2', x: 425, y: 320, kind: 'led_spotlight', value: 240, collected: false },
      { id: 'l6-c3', x: 980, y: 435, kind: 'rechargeable_floodlight', value: 320, collected: false },
      { id: 'l6-c4', x: 1225, y: 305, kind: 'outdoor_fixture', value: 260, collected: false },
      { id: 'l6-c5', x: 1760, y: 315, kind: 'rechargeable_floodlight', value: 320, collected: false },
      { id: 'l6-c6', x: 2060, y: 435, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l6-c7', x: 2250, y: 310, kind: 'outdoor_fixture', value: 260, collected: false },
    ],
    switches: [
      { id: 'l6-sw1', x: 425, y: 365, activated: false, targetId: 'l6-gate', labelAr: 'مولد طوارئ الحي الغربي (1/3)' },
      { id: 'l6-sw2', x: 1225, y: 350, activated: false, targetId: 'l6-gate', labelAr: 'مولد طوارئ الساحة الوسطى (2/3)' },
      { id: 'l6-sw3', x: 2250, y: 355, activated: false, targetId: 'l6-gate', labelAr: 'مولد طوارئ البرج الشرقي (3/3)' },
    ],
    gates: [
      {
        id: 'l6-gate',
        x: 2510,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        requiredSwitchesCount: 3,
        labelAr: 'بوابة استعادة النور (شغّل المولدات الثلاثة 3/3)',
      },
    ],
    checkpoints: [
      { id: 'l6-cp1', x: 940, y: 480, activated: false, labelAr: 'كشاف طوارئ 1' },
      { id: 'l6-cp2', x: 2010, y: 480, activated: false, labelAr: 'كشاف طوارئ 2' },
    ],
    enemies: [
      {
        id: 'l6-e1',
        x: 480,
        y: 444,
        w: 36,
        h: 36,
        vx: 115,
        minX: 250,
        maxX: 590,
        kind: 'shadow_creature',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l6-e2',
        x: 1340,
        y: 444,
        w: 36,
        h: 36,
        vx: -125,
        minX: 1020,
        maxX: 1560,
        kind: 'shadow_creature',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l6-e3',
        x: 1450,
        y: 310,
        w: 40,
        h: 34,
        vx: 115,
        baseY: 310,
        minX: 1150,
        maxX: 1620,
        kind: 'flying_drone',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l6-e4',
        x: 2340,
        y: 444,
        w: 36,
        h: 36,
        vx: -130,
        minX: 2040,
        maxX: 2470,
        kind: 'shadow_creature',
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [],
  },

  // ==========================================================================
  // LEVEL 7 — برج الإنارة (THE LIGHTING TOWER)
  // Environment: A futuristic skyscraper
  // New mechanics: Vertical platforming, elevators, moving structures, wind effects
  // Enemies: Advanced flying drones & giant mechanical guardians
  // Final Boss: Giant Construction Robot (عملاق البناء الآلي)
  // ==========================================================================
  {
    id: 'lvl-7',
    stageIndex: 6,
    worldNumber: 7,
    stageNumber: 1,
    code: '7-1',
    titleAr: 'برج الإنارة — ناطحة السحاب المستقبلية',
    titleEn: 'The Lighting Tower — Skyscraper Ascent',
    worldTitleAr: 'برج الإنارة',
    worldTitleEn: 'The Lighting Tower',
    subtitleAr:
      'اصعد عبر المصاعد الفضائية والمنصات العالية في مواجهة الرياح القوية، واهزم «عملاق البناء الآلي» على قمة البرج!',
    difficultyAr: 'خبير',
    finalChallengeAr: 'معركة قمة البرج: عملاق البناء الآلي وسط الرياح العالية',
    finalChallengeType: 'boss_construction_giant',
    windForce: -42, // Subtle headwind pushing left to test precision platforming & dash
    theme: 'lighting_tower',
    accentColor: '#8B5CF6',
    skyTop: '#0F172A',
    skyBottom: '#312E81',
    width: 2900,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 2760, y: 405, labelAr: 'منارة قمة برج الإنارة' },
    platforms: [
      { id: 'l7-p1', x: 0, y: 480, w: 540, h: 80, kind: 'solid', material: 'neon_glass' },
      {
        id: 'l7-elev1',
        x: 600,
        y: 410,
        w: 145,
        h: 22,
        kind: 'moving',
        material: 'steel',
        startX: 600,
        startY: 440,
        endX: 780,
        endY: 280,
        speed: 120,
      },
      { id: 'l7-p2', x: 850, y: 290, w: 280, h: 24, kind: 'solid', material: 'neon_glass' },
      {
        id: 'l7-phase1',
        x: 1190,
        y: 330,
        w: 150,
        h: 22,
        kind: 'phase',
        material: 'neon_glass',
        phaseState: 'ready',
        phaseTimer: 0,
      },
      { id: 'l7-p3', x: 1400, y: 480, w: 420, h: 80, kind: 'solid', material: 'steel' },
      {
        id: 'l7-sp1',
        x: 1720,
        y: 454,
        w: 58,
        h: 26,
        kind: 'spring',
        material: 'copper',
        springBoostVy: -760,
      },
      // Skyscraper Roof Boss Arena
      { id: 'l7-arena', x: 1860, y: 480, w: 1040, h: 80, kind: 'solid', material: 'neon_glass' },
      { id: 'l7-b1', x: 1980, y: 360, w: 165, h: 22, kind: 'solid', material: 'steel' },
      { id: 'l7-b2', x: 2260, y: 300, w: 180, h: 22, kind: 'solid', material: 'copper' },
      { id: 'l7-b3', x: 2540, y: 360, w: 165, h: 22, kind: 'solid', material: 'steel' },
    ],
    collectibles: [
      { id: 'l7-c1', x: 260, y: 435, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l7-c2', x: 690, y: 310, kind: 'led_spotlight', value: 240, collected: false },
      { id: 'l7-c3', x: 990, y: 245, kind: 'waterproof_socket', value: 190, collected: false },
      { id: 'l7-c4', x: 1265, y: 285, kind: 'led_strip', value: 200, collected: false },
      { id: 'l7-c5', x: 1560, y: 435, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l7-c6', x: 2060, y: 315, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l7-c7', x: 2350, y: 255, kind: 'led_bulb', value: 250, collected: false },
    ],
    switches: [],
    gates: [],
    checkpoints: [
      { id: 'l7-cp1', x: 1440, y: 480, activated: false, labelAr: 'شرفة البرج 70' },
      { id: 'l7-cp2', x: 1900, y: 480, activated: false, labelAr: 'سطح عملاق البناء الآلي' },
    ],
    enemies: [
      {
        id: 'l7-e1',
        x: 350,
        y: 340,
        w: 40,
        h: 34,
        vx: 120,
        baseY: 340,
        minX: 180,
        maxX: 510,
        kind: 'flying_drone',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l7-e2',
        x: 1580,
        y: 430,
        w: 46,
        h: 50,
        vx: -100,
        minX: 1430,
        maxX: 1700,
        kind: 'giant_guardian',
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [],
    boss: {
      archetype: 'construction_robot_boss',
      nameAr: 'عملاق البناء الآلي',
      nameEn: 'Giant Construction Robot',
      x: 2360,
      y: 388,
      w: 90,
      h: 92,
      vx: -140,
      minX: 1950,
      maxX: 2660,
      hp: 4,
      maxHp: 4,
      phase: 1,
      state: 'patrol',
      stateTimer: 2.2,
      invulnTimer: 0,
      shockwaveLeftX: 2360,
      shockwaveRightX: 2360,
      shockwaveY: 466,
      shockwaveActive: false,
      projectiles: [],
      breakers: [
        { id: 'l7-bb1', x: 2060, y: 360, activated: false, cooldown: 0, labelAr: 'قاطع الرافعة 1' },
        { id: 'l7-bb2', x: 2350, y: 300, activated: false, cooldown: 0, labelAr: 'قاطع الرافعة 2' },
        { id: 'l7-bb3', x: 2620, y: 360, activated: false, cooldown: 0, labelAr: 'قاطع الرافعة 3' },
      ],
    },
  },

  // ==========================================================================
  // LEVEL 8 — قلعة الظلام (FORTRESS OF DARKNESS)
  // Environment: Dramatic futuristic electrical fortress combining all mechanics
  // Enemies: Advanced electrical creatures (Shadow, Transformer, Giant Guardian)
  // Final Boss: ملك الظلام الكهربائي (3 Distinct Phases!)
  // ==========================================================================
  {
    id: 'lvl-8',
    stageIndex: 7,
    worldNumber: 8,
    stageNumber: 1,
    code: '8-1',
    titleAr: 'قلعة الظلام — المواجهة الأسطورية الكبرى',
    titleEn: 'Fortress of Darkness — Final Battle',
    worldTitleAr: 'قلعة الظلام',
    worldTitleEn: 'Fortress of Darkness',
    subtitleAr:
      'المرحلة الختامية الكبرى! اعبر دفاعات القلعة المتكاملة، ثم واجه «ملك الظلام الكهربائي» عبر 3 أطوار قتالية لإعادة النور الأبدي!',
    difficultyAr: 'أسطوري (Master)',
    finalChallengeAr: 'المعركة النهائية ضد «ملك الظلام الكهربائي» (3 أطوار متدرجة الصعوبة)',
    finalChallengeType: 'boss_dark_king_3phase',
    theme: 'darkness_fortress',
    accentColor: '#F43F5E',
    skyTop: '#090D16',
    skyBottom: '#1F122B',
    width: 3000,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 2860, y: 405, labelAr: 'القاطع الأسطوري للإنارة الحديثة' },
    platforms: [
      { id: 'l8-p1', x: 0, y: 480, w: 580, h: 80, kind: 'solid', material: 'fortress_stone' },
      {
        id: 'l8-conv1',
        x: 630,
        y: 420,
        w: 280,
        h: 24,
        kind: 'conveyor',
        material: 'steel',
        conveyorSpeed: -100,
      },
      {
        id: 'l8-mov1',
        x: 970,
        y: 360,
        w: 155,
        h: 22,
        kind: 'moving',
        material: 'copper',
        startX: 950,
        startY: 380,
        endX: 1160,
        endY: 310,
        speed: 125,
      },
      {
        id: 'l8-phase1',
        x: 1240,
        y: 320,
        w: 150,
        h: 22,
        kind: 'phase',
        material: 'neon_glass',
        phaseState: 'ready',
        phaseTimer: 0,
      },
      { id: 'l8-p2', x: 1450, y: 480, w: 1550, h: 80, kind: 'solid', material: 'fortress_stone' },
      // Spring pad on left of Grand Boss Arena
      {
        id: 'l8-sp1',
        x: 1530,
        y: 454,
        w: 60,
        h: 26,
        kind: 'spring',
        material: 'copper',
        springBoostVy: -780,
      },
      // Boss Arena Tactical Platforms (include moving center platform for Phase 2 & 3)
      { id: 'l8-b1', x: 1680, y: 360, w: 175, h: 22, kind: 'solid', material: 'copper' },
      {
        id: 'l8-b2',
        x: 2020,
        y: 295,
        w: 190,
        h: 22,
        kind: 'moving',
        material: 'neon_glass',
        startX: 1960,
        startY: 295,
        endX: 2180,
        endY: 295,
        speed: 95,
      },
      { id: 'l8-b3', x: 2390, y: 360, w: 175, h: 22, kind: 'solid', material: 'copper' },
    ],
    collectibles: [
      { id: 'l8-c1', x: 260, y: 435, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l8-c2', x: 470, y: 435, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l8-c3', x: 760, y: 375, kind: 'rechargeable_floodlight', value: 320, collected: false },
      { id: 'l8-c4', x: 1060, y: 290, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l8-c5', x: 1315, y: 275, kind: 'intercom_device', value: 280, collected: false },
      { id: 'l8-c6', x: 1765, y: 315, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l8-c7', x: 2115, y: 250, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l8-c8', x: 2475, y: 315, kind: 'wire_6mm', value: 300, collected: false },
    ],
    switches: [],
    gates: [],
    checkpoints: [
      { id: 'l8-cp1', x: 1480, y: 480, activated: false, labelAr: 'بوابة عرش ملك الظلام الكهربائي' },
    ],
    enemies: [
      {
        id: 'l8-e1',
        x: 370,
        y: 436,
        w: 44,
        h: 44,
        vx: 115,
        minX: 190,
        maxX: 540,
        kind: 'transformer_monster',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l8-e2',
        x: 750,
        y: 384,
        w: 36,
        h: 36,
        vx: -120,
        minX: 640,
        maxX: 890,
        kind: 'shadow_creature',
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [
      {
        id: 'l8-h1',
        x: 1920,
        y: 466,
        w: 65,
        h: 14,
        kind: 'timed_arc',
        period: 2.5,
        onTime: 1.0,
        offset: 0,
      },
      {
        id: 'l8-h2',
        x: 2290,
        y: 466,
        w: 65,
        h: 14,
        kind: 'timed_arc',
        period: 2.5,
        onTime: 1.0,
        offset: 1.25,
      },
    ],
    boss: {
      archetype: 'electric_dark_king_boss',
      nameAr: 'ملك الظلام الكهربائي',
      nameEn: 'The Electric King of Darkness',
      x: 2220,
      y: 384,
      w: 94,
      h: 96,
      vx: -145,
      minX: 1640,
      maxX: 2680,
      hp: 6,
      maxHp: 6,
      phase: 1,
      state: 'patrol',
      stateTimer: 2.2,
      invulnTimer: 0,
      shockwaveLeftX: 2220,
      shockwaveRightX: 2220,
      shockwaveY: 466,
      shockwaveActive: false,
      projectiles: [],
      breakers: [
        { id: 'l8-bb1', x: 1765, y: 360, activated: false, cooldown: 0, labelAr: 'قاطع النور النقي 1' },
        { id: 'l8-bb2', x: 2115, y: 295, activated: false, cooldown: 0, labelAr: 'قاطع النور النقي 2' },
        { id: 'l8-bb3', x: 2475, y: 360, activated: false, cooldown: 0, labelAr: 'قاطع النور النقي 3' },
      ],
    },
  },
]

export const GAME_WORLDS: WorldDefinition[] = GAME_STAGES.map((stg) => ({
  worldNumber: stg.worldNumber,
  id: stg.theme,
  nameAr: `المرحلة ${stg.worldNumber}: ${stg.worldTitleAr}`,
  nameEn: `Level ${stg.worldNumber}: ${stg.worldTitleEn}`,
  descriptionAr: stg.subtitleAr,
  difficultyAr: stg.difficultyAr,
  accentColor: stg.accentColor,
  badgeBg: '#E0F2FE',
  stages: [stg],
}))

// ============================================================================
// SECTION 14 — PROGRESSION, ACHIEVEMENTS & LOCAL SAVE ENGINE
// ============================================================================

export interface AchievementDef {
  id: string
  titleAr: string
  descAr: string
  icon: string
}

export const GAME_ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_light',
    titleAr: 'شرارة النور الأولى',
    descAr: 'إتمام المرحلة الأولى (مدينة النور) بنجاح',
    icon: '💡',
  },
  {
    id: 'wire_collector',
    titleAr: 'خبير الكابلات الإيطالية',
    descAr: 'جمع 10 منتجات كهربائية وأسلاك نحاسية متنوعة',
    icon: '🔌',
  },
  {
    id: 'security_master',
    titleAr: 'مهندس الإنترفون الذكي',
    descAr: 'حل لغز بوابات الأمان في حي الإنترفون (المرحلة 4)',
    icon: '🛡️',
  },
  {
    id: 'blackout_savior',
    titleAr: 'قاهر الظلام الدامس',
    descAr: 'استعادة الكهرباء للمدينة المظلمة تحت ضغط الوقت (المرحلة 6)',
    icon: '🔦',
  },
  {
    id: 'legendary_bulb',
    titleAr: 'بطل الإنارة الأسطوري',
    descAr: 'هزيمة ملك الظلام الكهربائي وإتمام المراحل الثماني كاملة',
    icon: '👑',
  },
]

export interface PlayerProgressionState {
  version: number
  unlockedStageIndex: number
  completedStageIds: string[]
  bestStageScores: Record<string, number>
  bestStageTimesSec: Record<string, number>
  stageStarsEarned: Record<string, number>
  totalCollectedEnergy: number
  productCounts: Record<string, number>
  achievements: string[]
  doubleJumpUnlocked: boolean
  dashUnlocked: boolean
  reducedMotion: boolean
}

const PROGRESSION_STORAGE_KEY = 'enarah_light_hero_progression_v2'

export function getDefaultProgression(): PlayerProgressionState {
  return {
    version: 2,
    unlockedStageIndex: 0,
    completedStageIds: [],
    bestStageScores: {},
    bestStageTimesSec: {},
    stageStarsEarned: {},
    totalCollectedEnergy: 0,
    productCounts: {},
    achievements: [],
    doubleJumpUnlocked: true, // Available & upgradeable so player can enjoy responsive double-jump & dash
    dashUnlocked: true,
    reducedMotion: false,
  }
}

export function loadPlayerProgression(): PlayerProgressionState {
  if (typeof window === 'undefined') return getDefaultProgression()
  try {
    const raw =
      localStorage.getItem(PROGRESSION_STORAGE_KEY) ||
      localStorage.getItem('enarah_light_hero_progression_v1')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...getDefaultProgression(),
        ...parsed,
        unlockedStageIndex: Math.min(
          GAME_STAGES.length - 1,
          Math.max(0, Number(parsed.unlockedStageIndex) || 0)
        ),
        doubleJumpUnlocked: true,
        dashUnlocked: true,
      }
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
  energyCollected: number,
  timeTakenSec = 60,
  collectedKinds: CollectibleProductKind[] = []
): PlayerProgressionState {
  const completedSet = new Set(current.completedStageIds)
  completedSet.add(stageId)

  const prevBest = current.bestStageScores[stageId] || 0
  const prevStars = current.stageStarsEarned[stageId] || 0
  const prevTime = current.bestStageTimesSec[stageId] || 9999

  const updatedCounts = { ...current.productCounts }
  for (const k of collectedKinds) {
    updatedCounts[k] = (updatedCounts[k] || 0) + 1
  }

  const totalProducts = current.totalCollectedEnergy + Math.max(0, energyCollected)
  const achSet = new Set(current.achievements)
  if (stageIndex >= 0) achSet.add('first_light')
  if (totalProducts >= 10) achSet.add('wire_collector')
  if (stageIndex >= 3) achSet.add('security_master')
  if (stageIndex >= 5) achSet.add('blackout_savior')
  if (stageIndex >= 7) achSet.add('legendary_bulb')

  const nextState: PlayerProgressionState = {
    ...current,
    unlockedStageIndex: Math.min(
      GAME_STAGES.length - 1,
      Math.max(current.unlockedStageIndex, stageIndex + 1)
    ),
    completedStageIds: Array.from(completedSet),
    bestStageScores: {
      ...current.bestStageScores,
      [stageId]: Math.max(prevBest, stageScore),
    },
    bestStageTimesSec: {
      ...current.bestStageTimesSec,
      [stageId]: Math.min(prevTime, Math.max(1, Math.round(timeTakenSec))),
    },
    stageStarsEarned: {
      ...current.stageStarsEarned,
      [stageId]: Math.max(prevStars, Math.min(3, Math.max(1, starsEarned))),
    },
    totalCollectedEnergy: totalProducts,
    productCounts: updatedCounts,
    achievements: Array.from(achSet),
    doubleJumpUnlocked: true,
    dashUnlocked: true,
  }

  savePlayerProgression(nextState)
  return nextState
}
