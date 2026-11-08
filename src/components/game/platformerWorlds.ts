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
  puzzleId?: string
  nodeCode?: string
  toggleable?: boolean
  cooldownTimer?: number
  wattage?: number
  sequenceOrder?: number
  coupledSwitchIds?: string[]
  teleportTo?: { x: number; y: number }
  reversesPlatformId?: string
}

export type PuzzleRuleKind =
  | 'exact_load_sum'       // Load balancing / magnetic flux / valve pressure sum === targetSum (resets if > maxCapacity)
  | 'ordered_sequence'     // Multi-step sequence 1..N (resets room sequence if out-of-order)
  | 'coupled_xor_matrix'   // Coupled terminal logic where toggling a node flips coupledSwitchIds until all are ON
  | 'dependency_chain'     // Prerequisite chain where step k requires step k-1 active first

export interface StagePuzzleDefinition {
  id: string
  titleAr: string
  mechanicNameAr: string
  ruleKind: PuzzleRuleKind
  isOptionalSecret?: boolean
  zoneMinX: number
  zoneMaxX: number
  targetGateId: string
  unlocksPlatformId?: string
  targetSum?: number
  maxCapacity?: number
  currentSum?: number
  unitLabelAr?: string
  currentStep?: number
  totalSteps?: number
  status: 'active' | 'overload_reset' | 'solved'
  statusMessageAr?: string
  solved: boolean
  hintsAr: [string, string, string]
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
// SECTION 7 & V13 SECTION 4–9 — 16 STAGE-UNIQUE MONSTER SPECIES & AI FSM
// ============================================================================

export type EnemyKind =
  // Stage 1 (مدينة النور):
  | 'shadow_runner'       // عدّاء الظل — Fast ground creature that changes direction dynamically
  | 'rooftop_jumper'      // قافز الأسطح — Leaps parabolically between platforms/rooftops
  | 'street_guardian'     // حارس الشارع — Heavy defensive enemy protecting key routes
  // Stage 2 (الإنارة فرع البيضاء — Industrial Orange World):
  | 'copper_scorpion'     // عقرب النحاس — Crawls along platforms, strikes with mechanical tail, retreats
  | 'magnetic_crusher'    // الساحق المغناطيسي — Heavy magnetic machine that pulls player & crushes
  | 'orange_spark'        // الشرارة البرتقالية — Fast electrical creature accelerating near power nodes
  // Stage 3 (مصنع الإنارة — Dangerous Mechanical Factory):
  | 'gear_beast'          // وحش التروس — Rotating gear body that rolls & accelerates during attacks
  | 'welding_drone'       // طائرة اللحام — Flying machine that patrols, fires short-range welding beams & repositions
  | 'assembly_mimic'      // المحاكي الآلي — Disguised as inactive machinery until approached, warns & attacks with limbs
  // Stage 4 (الإنارة فرع الليثي — Advanced Blue Electrical City):
  | 'blue_phantom'        // الطيف الأزرق — Fast energy enemy that phases/teleports between positions & fires bursts
  | 'electric_spider'     // العنكبوت الكهربائي — Mechanical spider that climbs vertically & drops electric traps
  | 'pulse_sentinel'      // حارس النبض الأزرق — Scans player, activates directional energy attacks & repositions
  // Stage 5 (قلعة الظلام — Final Dark Fortress):
  | 'dark_stalker'        // مطارد الظلام — Intelligently patrols and pursues the player with lunging slashes
  | 'void_flyer'          // طائر الفراغ — Flying creature with complex wave/swoop movement patterns
  | 'shadow_brute'        // عملاق الظل — Heavy armored enemy with powerful area shockwave attacks
  | 'fortress_guardian'   // حارس القلعة — Advanced defensive machine protecting critical paths
  // Legacy compatibility aliases
  | 'shadow_bug'
  | 'cable_crawler'
  | 'industrial_robot'
  | 'light_thief'
  | 'energy_drone'
  | 'security_bot'
  | 'flying_guardian'
  | 'dark_sentinel'
  | 'electrical_spark'
  | 'cable_snake'
  | 'flying_drone'
  | 'mechanical_spider'
  | 'security_robot'
  | 'shadow_creature'
  | 'transformer_monster'
  | 'giant_guardian'

export type EnemyAIState =
  | 'idle'
  | 'patrol'
  | 'detect'
  | 'attack'
  | 'retreat'
  | 'recover'
  | 'defeated'

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
  attackPattern?: number
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
  kind:
    | 'electric_floor'
    | 'timed_arc'
    | 'rotating_hazard'
    | 'mechanical_press'
    | 'laser_beam'
    | 'falling_obstacle'
    | 'ventilation_fan'
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
  | 'street_guardian_boss'       // Stage 1 Boss: حارس الشارع المدرع — The Street Guardian
  | 'orange_crusher_boss'        // Stage 2 Boss: الساحق البرتقالي العملاق — The Orange Crusher
  | 'factory_overlord_boss'      // Stage 3 Boss: سيد المصنع الآلي — The Factory Overlord
  | 'blue_sentinel_boss'         // Stage 4 Boss: الحارس الأزرق المدرع — The Blue Sentinel
  | 'shadow_core_boss'           // Stage 5 Final Boss: نواة الظلام — The Shadow Core
  // Legacy aliases
  | 'security_robot_boss'
  | 'transformer_guardian_boss'
  | 'construction_robot_boss'
  | 'electric_dark_king_boss'

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
  phase: 1 | 2 | 3 | 4
  state: 'patrol' | 'telegraph' | 'shockwave' | 'projectile_barrage' | 'dash_attack' | 'vulnerable' | 'defeated'
  stateTimer: number
  invulnTimer: number
  shockwaveLeftX: number
  shockwaveRightX: number
  shockwaveY: number
  shockwaveActive: boolean
  projectiles: BossProjectile[]
  breakers: BossBreakerSwitch[]
  shieldLocked?: boolean
}

export type FinalChallengeType =
  | 'three_switches_hazard'    // Stage 1: Defeat Street Guardian & restore district lighting
  | 'boss_security_robot'      // Stage 2: Defeat THE ORANGE CRUSHER in Al-Bayda Branch
  | 'timed_machine_escape'     // Stage 3: Defeat THE FACTORY OVERLORD & restart production
  | 'intercom_security_puzzle' // Stage 4: Defeat THE BLUE SENTINEL in Al-Laithi Branch
  | 'boss_dark_king_3phase'    // Stage 5: Defeat THE SHADOW CORE in Darkness Fortress
  | 'boss_transformer'
  | 'timed_power_restoration'
  | 'boss_construction_giant'

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
  puzzles?: StagePuzzleDefinition[]
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
// FIVE HARDCORE MULTI-SECTION LEVELS (V13 SECTIONS 1–9)
// ============================================================================

export const GAME_STAGES: StageDefinition[] = [
  // ==========================================================================
  // STAGE 1 — مدينة النور (CITY OF LIGHT)
  // Visual Identity: Living Urban City — Daylight
  // Multi-Section World (Width: 5200px — Sections A, B, C, D, E + Boss Arena)
  // Unique Monsters: Shadow Runner (عدّاء الظل), Rooftop Jumper (قافز الأسطح), Street Guardian (حارس الشارع)
  // Final Boss: The Street Guardian (حارس الشارع المدرع — 4 HP)
  // ==========================================================================
  {
    id: 'lvl-1',
    stageIndex: 0,
    worldNumber: 1,
    stageNumber: 1,
    code: '1-1',
    titleAr: 'مدينة النور — شوارع وأسطح الحي التجاري',
    titleEn: 'City of Light — Urban Rooftops & District Streets',
    worldTitleAr: 'مدينة النور',
    worldTitleEn: 'City of Light',
    subtitleAr:
      'انطلق عبر 5 قطاعات حضرية متصلة في مدينة النور: تسلّق أسطح المباني السكنية، تجاوز «عدّاء الظل» و«قافز الأسطح» و«حارس الشارع»، واهزم حارس الشارع المدرع لإعادة الإنارة إلى الحي!',
    difficultyAr: 'متوسط – متقدم',
    finalChallengeAr: 'هزيمة حارس الشارع المدرع (The Street Guardian) وتفعيل قواطع إنارة الحي الثلاثة',
    finalChallengeType: 'three_switches_hazard',
    theme: 'city_of_light',
    accentColor: '#0284C7',
    skyTop: '#0284C7',
    skyBottom: '#E0F2FE',
    width: 5200,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 5040, y: 405, labelAr: 'بوابة الإنارة فرع البيضاء' },
    platforms: [
      // Section A (0–1000): Introduction & First Urban Obstacles
      { id: 'l1-p1', x: 0, y: 480, w: 640, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l1-p2', x: 220, y: 385, w: 150, h: 24, kind: 'solid', material: 'brick' },
      { id: 'l1-p3', x: 420, y: 315, w: 165, h: 24, kind: 'solid', material: 'brick' },
      {
        id: 'l1-p4',
        x: 680,
        y: 415,
        w: 145,
        h: 22,
        kind: 'moving',
        material: 'steel',
        startX: 665,
        startY: 420,
        endX: 870,
        endY: 360,
        speed: 90,
      },
      // Section B (1000–2050): Multi-Story Apartment Rooftops & Vertical Shortcuts
      { id: 'l1-p5', x: 940, y: 480, w: 680, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l1-p6', x: 1090, y: 375, w: 165, h: 24, kind: 'solid', material: 'brick' },
      { id: 'l1-p7', x: 1310, y: 295, w: 175, h: 24, kind: 'solid', material: 'steel' },
      { id: 'l1-p8', x: 1520, y: 220, w: 190, h: 22, kind: 'secret_spotlight', material: 'copper', isSecret: true },
      { id: 'l1-p9', x: 1690, y: 480, w: 460, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l1-p10', x: 1780, y: 365, w: 170, h: 24, kind: 'solid', material: 'brick' },
      // Section C (2050–3150): Utility Poles, Maintenance Lifts & First Switch Puzzle
      { id: 'l1-p11', x: 2220, y: 480, w: 880, h: 80, kind: 'solid', material: 'concrete' },
      {
        id: 'l1-p12',
        x: 2350,
        y: 375,
        w: 150,
        h: 22,
        kind: 'moving',
        material: 'steel',
        startX: 2320,
        startY: 390,
        endX: 2540,
        endY: 310,
        speed: 105,
      },
      { id: 'l1-p13', x: 2620, y: 290, w: 190, h: 24, kind: 'solid', material: 'copper' },
      { id: 'l1-p14', x: 2860, y: 370, w: 170, h: 24, kind: 'solid', material: 'brick' },
      // Section D (3150–4120): High-Density Rooftop Gauntlet & Street Guardians
      { id: 'l1-p15', x: 3170, y: 480, w: 920, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l1-p16', x: 3290, y: 380, w: 155, h: 24, kind: 'solid', material: 'brick' },
      { id: 'l1-p17', x: 3500, y: 300, w: 170, h: 24, kind: 'solid', material: 'steel' },
      { id: 'l1-p18', x: 3730, y: 230, w: 175, h: 22, kind: 'solid', material: 'copper', isSecret: true },
      { id: 'l1-p19', x: 3760, y: 375, w: 185, h: 24, kind: 'solid', material: 'brick' },
      // Section E + Boss Arena (4120–5200): The Street Guardian District Plaza
      { id: 'l1-p20', x: 4150, y: 480, w: 1050, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l1-p21', x: 4280, y: 370, w: 160, h: 22, kind: 'solid', material: 'steel' },
      { id: 'l1-p22', x: 4540, y: 305, w: 180, h: 22, kind: 'solid', material: 'copper' },
      { id: 'l1-p23', x: 4800, y: 370, w: 160, h: 22, kind: 'solid', material: 'steel' },
    ],
    collectibles: [
      { id: 'l1-c1', x: 180, y: 435, kind: 'wire_1_5mm', value: 100, collected: false },
      { id: 'l1-c2', x: 295, y: 340, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l1-c3', x: 500, y: 270, kind: 'wire_2_5mm', value: 150, collected: false },
      { id: 'l1-c4', x: 775, y: 335, kind: 'led_spotlight', value: 240, collected: false },
      { id: 'l1-c5', x: 1170, y: 330, kind: 'wire_1_5mm', value: 100, collected: false },
      { id: 'l1-c6', x: 1395, y: 250, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l1-c7', x: 1610, y: 175, kind: 'outdoor_fixture', value: 260, collected: false, isSecret: true },
      { id: 'l1-c8', x: 1865, y: 320, kind: 'wire_2_5mm', value: 150, collected: false },
      { id: 'l1-c9', x: 2715, y: 245, kind: 'electrical_switch_item', value: 180, collected: false },
      { id: 'l1-c10', x: 2945, y: 325, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l1-c11', x: 3585, y: 255, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l1-c12', x: 3815, y: 185, kind: 'led_spotlight', value: 240, collected: false, isSecret: true },
      { id: 'l1-c13', x: 4360, y: 325, kind: 'wire_2_5mm', value: 150, collected: false },
      { id: 'l1-c14', x: 4630, y: 260, kind: 'led_bulb', value: 250, collected: false },
    ],
    switches: [
      // Puzzle 1 (District A Load Balance: Target 100kW, Max 100kW -> 60kW + 40kW = 100kW; 60kW + 60kW = 120kW Overload!)
      {
        id: 'l1-sw1a',
        x: 1865,
        y: 365,
        activated: false,
        targetId: 'l1-gate1',
        puzzleId: 'l1-puz1',
        nodeCode: '60kW',
        wattage: 60,
        toggleable: true,
        labelAr: 'قاطع الأبراج السكنية (60 كيلوواط)',
      },
      {
        id: 'l1-sw1b',
        x: 2450,
        y: 480,
        activated: false,
        targetId: 'l1-gate1',
        puzzleId: 'l1-puz1',
        nodeCode: '60kW',
        wattage: 60,
        toggleable: true,
        labelAr: 'قاطع التكييف المركزي (60 كيلوواط)',
      },
      {
        id: 'l1-sw1',
        x: 2715,
        y: 290,
        activated: false,
        targetId: 'l1-gate1',
        puzzleId: 'l1-puz1',
        nodeCode: '40kW',
        wattage: 40,
        toggleable: true,
        labelAr: 'قاطع إنارة الشوارع (40 كيلوواط)',
      },
      // Puzzle 2 (Commercial District Dependency Chain: 1. Feeder -> 2. Surge Shunt -> 3. Showroom Breaker)
      {
        id: 'l1-sw2a',
        x: 3365,
        y: 380,
        activated: false,
        targetId: 'l1-gate2',
        puzzleId: 'l1-puz2',
        nodeCode: '1:مغذّي',
        sequenceOrder: 1,
        toggleable: true,
        labelAr: '1. مغذّي المحول الرئيسي',
      },
      {
        id: 'l1-sw2b',
        x: 3585,
        y: 300,
        activated: false,
        targetId: 'l1-gate2',
        puzzleId: 'l1-puz2',
        nodeCode: '2:مانع',
        sequenceOrder: 2,
        toggleable: true,
        labelAr: '2. مانع الصواعق والتفريغ',
      },
      {
        id: 'l1-sw2',
        x: 3850,
        y: 375,
        activated: false,
        targetId: 'l1-gate2',
        puzzleId: 'l1-puz2',
        nodeCode: '3:توزيع',
        sequenceOrder: 3,
        toggleable: true,
        labelAr: '3. قاطع توزيع المعارض التجارية',
      },
      // Puzzle 3 (Central Substation 3-Phase Synchronization: Phase R -> Phase S -> Phase T)
      {
        id: 'l1-sw3a',
        x: 4360,
        y: 370,
        activated: false,
        targetId: 'l1-gate3',
        puzzleId: 'l1-puz3',
        nodeCode: 'طور R',
        sequenceOrder: 1,
        toggleable: true,
        labelAr: 'مزامن الطور الأول R (1/3)',
      },
      {
        id: 'l1-sw3',
        x: 4630,
        y: 305,
        activated: false,
        targetId: 'l1-gate3',
        puzzleId: 'l1-puz3',
        nodeCode: 'طور S',
        sequenceOrder: 2,
        toggleable: true,
        labelAr: 'مزامن الطور الثاني S (2/3)',
      },
      {
        id: 'l1-sw3b',
        x: 4880,
        y: 370,
        activated: false,
        targetId: 'l1-gate3',
        puzzleId: 'l1-puz3',
        nodeCode: 'طور T',
        sequenceOrder: 3,
        toggleable: true,
        labelAr: 'مزامن الطور الثالث T (3/3)',
      },
      // Optional Secret Puzzle: Rooftop Solar Backup Array
      {
        id: 'l1-sec1',
        x: 1395,
        y: 295,
        activated: false,
        targetId: 'l1-p8',
        puzzleId: 'l1-puz-sec',
        nodeCode: 'شمسي 1',
        sequenceOrder: 1,
        toggleable: true,
        labelAr: 'لوح الطاقة الشمسية العلوي (1/2)',
      },
      {
        id: 'l1-sec2',
        x: 1610,
        y: 220,
        activated: false,
        targetId: 'l1-p8',
        puzzleId: 'l1-puz-sec',
        nodeCode: 'شمسي 2',
        sequenceOrder: 2,
        toggleable: true,
        labelAr: 'محول الطاقة الشمسية السري (2/2)',
      },
    ],
    puzzles: [
      {
        id: 'l1-puz1',
        titleAr: 'شبكة توزيع القطاع السكني (100 كيلوواط)',
        mechanicNameAr: 'موازنة الأحمال الكهربائية ومنع الحمل الزائد',
        ruleKind: 'exact_load_sum',
        zoneMinX: 1650,
        zoneMaxX: 3060,
        targetGateId: 'l1-gate1',
        targetSum: 100,
        maxCapacity: 100,
        currentSum: 0,
        unitLabelAr: 'كيلوواط',
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: قدرة المولد السكني محدودة بـ 100 كيلوواط فقط؛ تشغيل قاطعين كبيرين معاً يفصل الشبكة.',
          'تلميح 2: اقرأ قدرة كل قاطع (60kW و60kW و40kW)؛ الجمع بين 60kW و60kW يتجاوز السعة (120kW).',
          'تلميح 3: فعّل قاطعاً واحداً بقدرة 60kW مع قاطع إنارة الشوارع العلوي 40kW للوصول إلى 100kW بالضبط وفتح البوابة.',
        ],
      },
      {
        id: 'l1-puz2',
        titleAr: 'دائرة المعارض التجارية الاعتمادية',
        mechanicNameAr: 'التسلسل الاعتمادي للمحول ومانع الصواعق',
        ruleKind: 'dependency_chain',
        zoneMinX: 3150,
        zoneMaxX: 4050,
        targetGateId: 'l1-gate2',
        currentStep: 0,
        totalSteps: 3,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: لا يمكن تغذية المعارض التجارية قبل تأمين المحول الرئيسي ومانع الصواعق.',
          'تلميح 2: كل قاطع يحمل رقماً تسلسلياً (1:مغذّي ثم 2:مانع ثم 3:توزيع).',
          'تلميح 3: ابدأ بقاطع (1:مغذّي) عند يسار القطاع، ثم اصعد إلى (2:مانع) في الأعلى، وأخيراً فعّل (3:توزيع) أمام البوابة.',
        ],
      },
      {
        id: 'l1-puz3',
        titleAr: 'مزامنة أطوار المحطة المركزية (R → S → T)',
        mechanicNameAr: 'مزامنة الأطوار الثلاثة في ساحة الزعيم',
        ruleKind: 'ordered_sequence',
        zoneMinX: 4150,
        zoneMaxX: 5050,
        targetGateId: 'l1-gate3',
        currentStep: 0,
        totalSteps: 3,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: بوابة الخروج تتطلب مزامنة الأطوار الثلاثة بالترتيب القياسي مع هزيمة حارس الشارع.',
          'تلميح 2: الترتيب الكهربائي الصحيح هو الطور R ثم الطور S الأوسط ثم الطور T الأيمن.',
          'تلميح 3: فعّل (طور R) على المنصة اليسرى، ثم اقفز إلى (طور S) في المنتصف، ثم (طور T) على المنصة اليمنى.',
        ],
      },
      {
        id: 'l1-puz-sec',
        titleAr: 'مصفوفة الأسطح الشمسية السرية',
        mechanicNameAr: 'لغز سري اختياري',
        ruleKind: 'ordered_sequence',
        isOptionalSecret: true,
        zoneMinX: 1100,
        zoneMaxX: 1700,
        targetGateId: '',
        unlocksPlatformId: 'l1-p8',
        currentStep: 0,
        totalSteps: 2,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: توجد ألواح طاقة شمسية احتياطية فوق أسطح المباني السكنية في القطاع B.',
          'تلميح 2: فعّل (شمسي 1) أولاً ثم اصعد للمنصة العلوية السرية لتفعيل (شمسي 2).',
          'تلميح 3: اقفز فوق المنصات المرتفعة عند x=1395 ثم x=1610 بالترتيب للحصول على مكافأة الطاقة السرية.',
        ],
      },
    ],
    gates: [
      {
        id: 'l1-gate1',
        x: 3040,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l1-sw1',
        labelAr: 'بوابة القطاع السكني (فعّل قاطع الأسطح 1/3)',
      },
      {
        id: 'l1-gate2',
        x: 4030,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l1-sw2',
        labelAr: 'بوابة ساحة الحي (فعّل قاطع المحلات 2/3)',
      },
      {
        id: 'l1-gate3',
        x: 4960,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l1-sw3',
        labelAr: 'بوابة فرع البيضاء (اهزم حارس الشارع وفعّل القاطع 3/3)',
      },
    ],
    checkpoints: [
      { id: 'l1-cp1', x: 980, y: 480, activated: false, labelAr: 'عمود إنارة الأسطح السكنية (B)' },
      { id: 'l1-cp2', x: 2260, y: 480, activated: false, labelAr: 'محطة أعمدة الكهرباء (C)' },
      { id: 'l1-cp3', x: 3210, y: 480, activated: false, labelAr: 'شارع المعارض الكهربائية (D)' },
      { id: 'l1-cp4', x: 4190, y: 480, activated: false, labelAr: 'ساحة حارس الشارع المدرع (E)' },
    ],
    enemies: [
      // Section A: Shadow Runner
      {
        id: 'l1-e1',
        x: 460,
        y: 448,
        w: 38,
        h: 32,
        vx: 135,
        minX: 250,
        maxX: 610,
        kind: 'shadow_runner',
        defeated: false,
        stompable: true,
      },
      // Section B: Rooftop Jumper & Shadow Runner
      {
        id: 'l1-e2',
        x: 1260,
        y: 446,
        w: 40,
        h: 34,
        vx: 110,
        baseY: 446,
        minX: 1020,
        maxX: 1580,
        kind: 'rooftop_jumper',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l1-e3',
        x: 1920,
        y: 448,
        w: 38,
        h: 32,
        vx: -145,
        minX: 1720,
        maxX: 2110,
        kind: 'shadow_runner',
        defeated: false,
        stompable: true,
      },
      // Section C: Street Guardian & Rooftop Jumper
      {
        id: 'l1-e4',
        x: 2680,
        y: 434,
        w: 50,
        h: 46,
        vx: 82,
        minX: 2380,
        maxX: 2980,
        kind: 'street_guardian',
        hp: 2,
        maxHp: 2,
        defeated: false,
        stompable: true,
      },
      // Section D: Combined Urban Monsters
      {
        id: 'l1-e5',
        x: 3440,
        y: 446,
        w: 40,
        h: 34,
        vx: -120,
        baseY: 446,
        minX: 3240,
        maxX: 3680,
        kind: 'rooftop_jumper',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l1-e6',
        x: 3860,
        y: 434,
        w: 50,
        h: 46,
        vx: -88,
        minX: 3660,
        maxX: 3990,
        kind: 'street_guardian',
        hp: 2,
        maxHp: 2,
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [
      {
        id: 'l1-h1',
        x: 1480,
        y: 466,
        w: 55,
        h: 14,
        kind: 'timed_arc',
        period: 3.0,
        onTime: 1.0,
        offset: 0,
      },
      {
        id: 'l1-h2',
        x: 2760,
        y: 466,
        w: 60,
        h: 14,
        kind: 'timed_arc',
        period: 2.8,
        onTime: 1.0,
        offset: 0.9,
      },
      {
        id: 'l1-h3',
        x: 3620,
        y: 466,
        w: 62,
        h: 14,
        kind: 'timed_arc',
        period: 2.6,
        onTime: 1.0,
        offset: 0.4,
      },
    ],
    boss: {
      archetype: 'street_guardian_boss',
      nameAr: 'حارس الشارع المدرع — The Street Guardian',
      nameEn: 'The Street Guardian',
      x: 4680,
      y: 396,
      w: 78,
      h: 84,
      vx: -115,
      minX: 4250,
      maxX: 4910,
      hp: 4,
      maxHp: 4,
      phase: 1,
      state: 'patrol',
      stateTimer: 2.2,
      invulnTimer: 0,
      shockwaveLeftX: 4680,
      shockwaveRightX: 4680,
      shockwaveY: 466,
      shockwaveActive: false,
      projectiles: [],
      breakers: [
        { id: 'l1-bb1', x: 4355, y: 370, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ درع الحارس 1' },
        { id: 'l1-bb2', x: 4875, y: 370, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ درع الحارس 2' },
      ],
    },
  },

  // ==========================================================================
  // STAGE 2 — الإنارة فرع البيضاء (ENARAH AL-BAYDA BRANCH)
  // Visual Identity: Industrial Orange World — Primary Color: ORANGE (#EA580C / #F97316)
  // Secondary Colors: Dark Charcoal (#18181B), Steel Gray (#475569), Controlled White (#F8FAFC)
  // Multi-Section World (Width: 5400px — Sections A, B, C, D, E + Boss Arena)
  // Unique Monsters: Copper Scorpion (عقرب النحاس), Magnetic Crusher (الساحق المغناطيسي), Orange Spark (الشرارة البرتقالية)
  // Stage Boss: THE ORANGE CRUSHER (الساحق البرتقالي العملاق — 5 HP, 3 Phases)
  // ==========================================================================
  {
    id: 'lvl-2',
    stageIndex: 1,
    worldNumber: 2,
    stageNumber: 1,
    code: '2-1',
    titleAr: 'الإنارة فرع البيضاء — المستودعات والرافعات البرتقالية',
    titleEn: 'Enarah Al-Bayda Branch — Industrial Orange Warehouses',
    worldTitleAr: 'الإنارة فرع البيضاء',
    worldTitleEn: 'Enarah Al-Bayda Branch',
    subtitleAr:
      'ادخل العالم البرتقالي الصناعي لـ «الإنارة فرع البيضاء»: اعبر مستودعات الكابلات العملاقة والرافعات المغناطيسية، قاتل «عقرب النحاس» و«الساحق المغناطيسي» و«الشرارة البرتقالية»، واهزم الساحق البرتقالي العملاق!',
    difficultyAr: 'متقدم',
    finalChallengeAr: 'هزيمة الزعيم الساحق البرتقالي العملاق (THE ORANGE CRUSHER) عبر أطواره الثلاثة',
    finalChallengeType: 'boss_security_robot',
    theme: 'electricity_street',
    accentColor: '#EA580C',
    skyTop: '#18181B',
    skyBottom: '#EA580C',
    width: 5400,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 5240, y: 405, labelAr: 'بوابة مصنع الإنارة' },
    platforms: [
      // Section A (0–1050): Al-Bayda Branch Orange Loading Dock & Cable Racks
      { id: 'l2-p1', x: 0, y: 480, w: 620, h: 80, kind: 'solid', material: 'copper' },
      { id: 'l2-p2', x: 250, y: 380, w: 165, h: 24, kind: 'solid', material: 'steel' },
      {
        id: 'l2-p3',
        x: 680,
        y: 410,
        w: 165,
        h: 24,
        kind: 'moving',
        material: 'copper',
        startX: 650,
        startY: 420,
        endX: 890,
        endY: 350,
        speed: 98,
      },
      // Section B (1050–2150): Industrial Orange Cranes & Conveyor Racks
      { id: 'l2-p4', x: 960, y: 480, w: 660, h: 80, kind: 'solid', material: 'steel' },
      {
        id: 'l2-p5',
        x: 1120,
        y: 375,
        w: 280,
        h: 24,
        kind: 'conveyor',
        material: 'copper',
        conveyorSpeed: -90,
      },
      { id: 'l2-p6', x: 1440, y: 285, w: 190, h: 22, kind: 'secret_spotlight', material: 'neon_glass', isSecret: true },
      {
        id: 'l2-p7',
        x: 1680,
        y: 395,
        w: 160,
        h: 24,
        kind: 'moving',
        material: 'copper',
        startX: 1660,
        startY: 415,
        endX: 1910,
        endY: 335,
        speed: 108,
      },
      { id: 'l2-p8', x: 1960, y: 480, w: 320, h: 80, kind: 'solid', material: 'copper' },
      // Section C (2150–3250): Magnetic Platforms & Copper-Wire Switch Puzzle
      { id: 'l2-p9', x: 2340, y: 480, w: 860, h: 80, kind: 'solid', material: 'steel' },
      { id: 'l2-p10', x: 2460, y: 375, w: 170, h: 24, kind: 'solid', material: 'copper' },
      { id: 'l2-p11', x: 2700, y: 295, w: 185, h: 24, kind: 'phase', material: 'copper' },
      { id: 'l2-p12', x: 2940, y: 375, w: 170, h: 24, kind: 'solid', material: 'steel' },
      // Section D (3250–4300): Multi-Level Warehouse Exploration & High-Voltage Bridges
      { id: 'l2-p13', x: 3260, y: 480, w: 980, h: 80, kind: 'solid', material: 'copper' },
      {
        id: 'l2-p14',
        x: 3390,
        y: 390,
        w: 290,
        h: 24,
        kind: 'conveyor',
        material: 'steel',
        conveyorSpeed: 105,
      },
      { id: 'l2-p15', x: 3740, y: 305, w: 180, h: 24, kind: 'solid', material: 'copper' },
      { id: 'l2-p16', x: 3960, y: 225, w: 185, h: 22, kind: 'solid', material: 'neon_glass', isSecret: true },
      { id: 'l2-p17', x: 3980, y: 375, w: 175, h: 24, kind: 'solid', material: 'steel' },
      // Section E + Boss Arena (4300–5400): THE ORANGE CRUSHER Arena
      { id: 'l2-p18', x: 4300, y: 480, w: 1100, h: 80, kind: 'solid', material: 'steel' },
      { id: 'l2-p19', x: 4430, y: 365, w: 165, h: 22, kind: 'solid', material: 'copper' },
      { id: 'l2-p20', x: 4700, y: 290, w: 185, h: 22, kind: 'solid', material: 'steel' },
      { id: 'l2-p21', x: 4970, y: 365, w: 165, h: 22, kind: 'solid', material: 'copper' },
    ],
    collectibles: [
      { id: 'l2-c1', x: 210, y: 435, kind: 'wire_2_5mm', value: 150, collected: false },
      { id: 'l2-c2', x: 330, y: 335, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l2-c3', x: 765, y: 330, kind: 'led_spotlight', value: 240, collected: false },
      { id: 'l2-c4', x: 1250, y: 330, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l2-c5', x: 1535, y: 240, kind: 'wire_6mm', value: 300, collected: false, isSecret: true },
      { id: 'l2-c6', x: 1790, y: 315, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l2-c7', x: 2545, y: 330, kind: 'electrical_switch_item', value: 180, collected: false },
      { id: 'l2-c8', x: 2790, y: 250, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l2-c9', x: 3025, y: 330, kind: 'electrical_connector', value: 170, collected: false },
      { id: 'l2-c10', x: 3530, y: 345, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l2-c11', x: 3830, y: 260, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l2-c12', x: 4050, y: 180, kind: 'rechargeable_floodlight', value: 320, collected: false, isSecret: true },
      { id: 'l2-c13', x: 4510, y: 320, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l2-c14', x: 4790, y: 245, kind: 'led_bulb', value: 250, collected: false },
    ],
    switches: [
      // Stage 2 Puzzle 1 (Magnetic Crane & Container Interlock: 1. Crane -> 2. Latch -> 3. Pressure Pad)
      {
        id: 'l2-sw1a',
        x: 1260,
        y: 375,
        activated: false,
        targetId: 'l2-gate1',
        puzzleId: 'l2-puz1',
        nodeCode: '1:رافعة',
        sequenceOrder: 1,
        toggleable: true,
        reversesPlatformId: 'l2-p5',
        labelAr: '1. تحريك الرافعة المغناطيسية البرتقالية',
      },
      {
        id: 'l2-sw1b',
        x: 1790,
        y: 335,
        activated: false,
        targetId: 'l2-gate1',
        puzzleId: 'l2-puz1',
        nodeCode: '2:قفل',
        sequenceOrder: 2,
        toggleable: true,
        labelAr: '2. تحرير قفل الحاوية المعدنية',
      },
      {
        id: 'l2-sw1',
        x: 2080,
        y: 480,
        activated: false,
        targetId: 'l2-gate1',
        puzzleId: 'l2-puz1',
        nodeCode: '3:ضغط',
        sequenceOrder: 3,
        toggleable: true,
        labelAr: '3. إنزال الحاوية على مفتاح الضغط البرتقالي',
      },
      // Stage 2 Puzzle 2 (Magnetic Flux Counterweight Balance: Target 120T, Max 120T -> 70T + 50T = 120T)
      {
        id: 'l2-sw2a',
        x: 2545,
        y: 375,
        activated: false,
        targetId: 'l2-gate2',
        puzzleId: 'l2-puz2',
        nodeCode: '70T',
        wattage: 70,
        toggleable: true,
        labelAr: 'مغناطيس الرفع الثقيل (70 تسلا)',
      },
      {
        id: 'l2-sw2',
        x: 2790,
        y: 295,
        activated: false,
        targetId: 'l2-gate2',
        puzzleId: 'l2-puz2',
        nodeCode: '50T',
        wattage: 50,
        toggleable: true,
        labelAr: 'مغناطيس التوجيه الأوسط (50 تسلا)',
      },
      {
        id: 'l2-sw2b',
        x: 3025,
        y: 375,
        activated: false,
        targetId: 'l2-gate2',
        puzzleId: 'l2-puz2',
        nodeCode: '70T',
        wattage: 70,
        toggleable: true,
        labelAr: 'مغناطيس السحب الجانبي (70 تسلا)',
      },
      // Stage 2 Puzzle 3 (Coupled Magnetic Conveyor Polarity Matrix: mag1 flips 1&2, mag2 flips 2&3, mag3 flips 3)
      {
        id: 'l2-sw3a',
        x: 3530,
        y: 390,
        activated: false,
        targetId: 'l2-gate3',
        puzzleId: 'l2-puz3',
        nodeCode: 'قطب-1',
        toggleable: true,
        coupledSwitchIds: ['l2-sw3b'],
        reversesPlatformId: 'l2-p14',
        labelAr: 'وحدة القطب المغناطيسي 1 (تعكس 1 و2 + السير)',
      },
      {
        id: 'l2-sw3b',
        x: 3830,
        y: 305,
        activated: false,
        targetId: 'l2-gate3',
        puzzleId: 'l2-puz3',
        nodeCode: 'قطب-2',
        toggleable: true,
        coupledSwitchIds: ['l2-sw3'],
        labelAr: 'وحدة القطب المغناطيسي 2 (تعكس 2 و3)',
      },
      {
        id: 'l2-sw3',
        x: 4065,
        y: 375,
        activated: false,
        targetId: 'l2-gate3',
        puzzleId: 'l2-puz3',
        nodeCode: 'قطب-3',
        toggleable: true,
        coupledSwitchIds: [],
        labelAr: 'وحدة القطب المغناطيسي 3 (تثبّت 3)',
      },
      // Optional Secret Puzzle: Warehouse Scrap Magnet Override
      {
        id: 'l2-sec1',
        x: 4050,
        y: 225,
        activated: false,
        targetId: 'l2-p16',
        puzzleId: 'l2-puz-sec',
        nodeCode: 'مغ-سري',
        sequenceOrder: 1,
        toggleable: true,
        labelAr: 'مفتاح الرافعة المغناطيسية السرية بالبيضاء',
      },
    ],
    puzzles: [
      {
        id: 'l2-puz1',
        titleAr: 'مجمّع الرافعة المغناطيسية والحاويات',
        mechanicNameAr: 'نقل الحاوية المعدنية عبر الرافعة ومفتاح الضغط',
        ruleKind: 'dependency_chain',
        zoneMinX: 1050,
        zoneMaxX: 2250,
        targetGateId: 'l2-gate1',
        currentStep: 0,
        totalSteps: 3,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: الحاوية المعدنية البرتقالية معلقة فوق المسار؛ لا يمكن الضغط على مفتاح البوابة الأرضي قبل تحريك الرافعة وتحرير القفل.',
          'تلميح 2: اتبع ترتيب العمليات الصناعية: (1:رافعة) ثم (2:قفل) ثم (3:ضغط).',
          'تلميح 3: فعّل (1:رافعة) فوق السير الناقل لعكس اتجاهه، ثم اقفز للمنصة المتحركة لتفعيل (2:قفل)، ثم انزل لتفعيل (3:ضغط).',
        ],
      },
      {
        id: 'l2-puz2',
        titleAr: 'توازن الحقل المغناطيسي للمستودع (120 تسلا)',
        mechanicNameAr: 'موازنة شدة المجال المغناطيسي دون تجاوز الحد الأقصى',
        ruleKind: 'exact_load_sum',
        zoneMinX: 2350,
        zoneMaxX: 3180,
        targetGateId: 'l2-gate2',
        targetSum: 120,
        maxCapacity: 120,
        currentSum: 0,
        unitLabelAr: 'تسلا',
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: الجسر المغناطيسي يحتاج إلى 120 تسلا بالضبط؛ تشغيل المغناطيسين الثقيلين (70T + 70T) يسبب تنافراً ويفصل النظام.',
          'تلميح 2: لديك ثلاث وحدات: 70T على اليسار، 50T في الأعلى، و70T على اليمين.',
          'تلميح 3: فعّل وحدة واحدة بقدرة 70T مع الوحدة العلوية 50T للوصول إلى 120 تسلا وفتح البوابة الثانية.',
        ],
      },
      {
        id: 'l2-puz3',
        titleAr: 'مصفوفة الأقطاب المغناطيسية المتشابكة',
        mechanicNameAr: 'عكس الأقطاب المترابطة ومفاتيح السيور الناقلة',
        ruleKind: 'coupled_xor_matrix',
        zoneMinX: 3300,
        zoneMaxX: 4300,
        targetGateId: 'l2-gate3',
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: الأقطاب المغناطيسية الثلاثة مترابطة؛ تغيير أحدها يقلب حالة القطب المجاور له.',
          'تلميح 2: (قطب-1) يبدّل 1 و2، بينما (قطب-2) يبدّل 2 و3، و(قطب-3) يبدّل 3 فقط.',
          'تلميح 3: للوصول إلى تفعيل الأقطاب الثلاثة معاً من البداية: فعّل (قطب-1) ثم (قطب-3) فقط، أو اضبطها بالتدريج من اليسار لليمين.',
        ],
      },
      {
        id: 'l2-puz-sec',
        titleAr: 'خزنة النحاس المغناطيسية السرية',
        mechanicNameAr: 'لغز سري اختياري',
        ruleKind: 'ordered_sequence',
        isOptionalSecret: true,
        zoneMinX: 3700,
        zoneMaxX: 4200,
        targetGateId: '',
        unlocksPlatformId: 'l2-p16',
        currentStep: 0,
        totalSteps: 1,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: توجد منصة علوية مخفية فوق القطب المغناطيسي الثالث في فرع البيضاء.',
          'تلميح 2: اصعد عبر المنصة المرتفعة عند x=3740 للوصول إلى السقف السري.',
          'تلميح 3: فعّل (مغ-سري) عند x=4050, y=225 لكسب مكافأة الخزنة المغناطيسية.',
        ],
      },
    ],
    gates: [
      {
        id: 'l2-gate1',
        x: 2220,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l2-sw1',
        labelAr: 'بوابة مستودع البيضاء الأوسط (فعّل القاطع 1/3)',
      },
      {
        id: 'l2-gate2',
        x: 3150,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l2-sw2',
        labelAr: 'بوابة الجسور المغناطيسية (فعّل القاطع 2/3)',
      },
      {
        id: 'l2-gate3',
        x: 5150,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l2-sw3',
        labelAr: 'بوابة الخروج من فرع البيضاء (اهزم الساحق البرتقالي وفعّل القاطع 3/3)',
      },
    ],
    checkpoints: [
      { id: 'l2-cp1', x: 1000, y: 480, activated: false, labelAr: 'رصيف شحن فرع البيضاء (B)' },
      { id: 'l2-cp2', x: 2380, y: 480, activated: false, labelAr: 'مستودع الكابلات البرتقالي (C)' },
      { id: 'l2-cp3', x: 3300, y: 480, activated: false, labelAr: 'الجسور المغناطيسية العلوية (D)' },
      { id: 'l2-cp4', x: 4340, y: 480, activated: false, labelAr: 'ساحة الساحق البرتقالي العملاق (E)' },
    ],
    enemies: [
      // Section A: Copper Scorpion
      {
        id: 'l2-e1',
        x: 420,
        y: 446,
        w: 46,
        h: 34,
        vx: 112,
        minX: 210,
        maxX: 590,
        kind: 'copper_scorpion',
        defeated: false,
        stompable: true,
      },
      // Section B: Orange Spark & Copper Scorpion
      {
        id: 'l2-e2',
        x: 1320,
        y: 448,
        w: 36,
        h: 32,
        vx: 155,
        minX: 1020,
        maxX: 1580,
        kind: 'orange_spark',
        defeated: false,
        stompable: true,
      },
      // Section C: Magnetic Crusher & Orange Spark
      {
        id: 'l2-e3',
        x: 2680,
        y: 432,
        w: 54,
        h: 48,
        vx: 85,
        minX: 2420,
        maxX: 3060,
        kind: 'magnetic_crusher',
        hp: 2,
        maxHp: 2,
        defeated: false,
        stompable: true,
      },
      {
        id: 'l2-e4',
        x: 2980,
        y: 448,
        w: 36,
        h: 32,
        vx: -160,
        minX: 2500,
        maxX: 3110,
        kind: 'orange_spark',
        defeated: false,
        stompable: true,
      },
      // Section D: Copper Scorpion & Magnetic Crusher
      {
        id: 'l2-e5',
        x: 3640,
        y: 446,
        w: 46,
        h: 34,
        vx: -118,
        minX: 3350,
        maxX: 3920,
        kind: 'copper_scorpion',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l2-e6',
        x: 4040,
        y: 432,
        w: 54,
        h: 48,
        vx: 90,
        minX: 3750,
        maxX: 4210,
        kind: 'magnetic_crusher',
        hp: 2,
        maxHp: 2,
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [
      {
        id: 'l2-h1',
        x: 1380,
        y: 390,
        w: 38,
        h: 38,
        kind: 'rotating_hazard',
        radius: 52,
        angle: 0,
      },
      {
        id: 'l2-h2',
        x: 2790,
        y: 466,
        w: 64,
        h: 14,
        kind: 'timed_arc',
        period: 2.5,
        onTime: 1.0,
        offset: 0.5,
      },
      {
        id: 'l2-h3',
        x: 3820,
        y: 466,
        w: 68,
        h: 14,
        kind: 'timed_arc',
        period: 2.4,
        onTime: 1.0,
        offset: 1.1,
      },
    ],
    boss: {
      archetype: 'orange_crusher_boss',
      nameAr: 'الساحق البرتقالي العملاق — THE ORANGE CRUSHER',
      nameEn: 'THE ORANGE CRUSHER',
      x: 4840,
      y: 390,
      w: 88,
      h: 90,
      vx: -125,
      minX: 4390,
      maxX: 5090,
      hp: 5,
      maxHp: 5,
      phase: 1,
      state: 'patrol',
      stateTimer: 2.1,
      invulnTimer: 0,
      shockwaveLeftX: 4840,
      shockwaveRightX: 4840,
      shockwaveY: 466,
      shockwaveActive: false,
      projectiles: [],
      breakers: [
        { id: 'l2-bb1', x: 4510, y: 365, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ المغناطيس 1' },
        { id: 'l2-bb2', x: 4790, y: 290, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ المغناطيس 2' },
        { id: 'l2-bb3', x: 5050, y: 365, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ المغناطيس 3' },
      ],
    },
  },

  // ==========================================================================
  // STAGE 3 — مصنع الإنارة (THE LIGHTING FACTORY)
  // Visual Identity: Dangerous Mechanical Factory — Steel Gray / Yellow / Controlled White
  // Multi-Section World (Width: 5600px — Sections A, B, C, D, E + Boss Arena)
  // Unique Monsters: Gear Beast (وحش التروس), Welding Drone (طائرة اللحام), Assembly Mimic (المحاكي الآلي)
  // Stage Boss: THE FACTORY OVERLORD (سيد المصنع الآلي — 5 HP)
  // ==========================================================================
  {
    id: 'lvl-3',
    stageIndex: 2,
    worldNumber: 3,
    stageNumber: 1,
    code: '3-1',
    titleAr: 'مصنع الإنارة — خطوط التجميع الآلية والمكابس',
    titleEn: 'The Lighting Factory — Automated Production & Presses',
    worldTitleAr: 'مصنع الإنارة',
    worldTitleEn: 'The Lighting Factory',
    subtitleAr:
      'اخترق خطوط الإنتاج المؤتمتة والمكابس الميكانيكية ومراوح التهوية، واجه «وحش التروس» و«طائرة اللحام» و«المحاكي الآلي» المتخفي، واهزم سيد المصنع الآلي!',
    difficultyAr: 'صعب',
    finalChallengeAr: 'هزيمة الزعيم سيد المصنع الآلي (THE FACTORY OVERLORD) وإعادة تشغيل خط الإنتاج',
    finalChallengeType: 'timed_machine_escape',
    challengeTimeLimitSec: 180,
    theme: 'lighting_factory',
    accentColor: '#FACC15',
    skyTop: '#1E293B',
    skyBottom: '#334155',
    width: 5600,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 5440, y: 405, labelAr: 'بوابة الإنارة فرع الليثي' },
    platforms: [
      // Section A (0–1100): Assembly Entry & Conveyor Line 1
      { id: 'l3-p1', x: 0, y: 480, w: 540, h: 80, kind: 'solid', material: 'steel' },
      {
        id: 'l3-p2',
        x: 580,
        y: 435,
        w: 390,
        h: 26,
        kind: 'conveyor',
        material: 'steel',
        conveyorSpeed: -95,
      },
      // Section B (1100–2200): Robotic Arms, Ventilation Shafts & Assembly Mimic Zone
      { id: 'l3-p3', x: 1020, y: 480, w: 620, h: 80, kind: 'solid', material: 'steel' },
      { id: 'l3-p4', x: 1160, y: 365, w: 210, h: 24, kind: 'solid', material: 'copper' },
      { id: 'l3-p5', x: 1410, y: 265, w: 190, h: 22, kind: 'secret_spotlight', material: 'neon_glass', isSecret: true },
      {
        id: 'l3-p6',
        x: 1700,
        y: 420,
        w: 380,
        h: 26,
        kind: 'conveyor',
        material: 'steel',
        conveyorSpeed: 115,
      },
      { id: 'l3-p7', x: 2130, y: 480, w: 280, h: 80, kind: 'solid', material: 'steel' },
      // Section C (2200–3350): Industrial Elevators & Welding Drone Foundry
      {
        id: 'l3-p8',
        x: 2460,
        y: 385,
        w: 160,
        h: 24,
        kind: 'moving',
        material: 'steel',
        startX: 2450,
        startY: 430,
        endX: 2660,
        endY: 290,
        speed: 115,
      },
      { id: 'l3-p9', x: 2730, y: 480, w: 640, h: 80, kind: 'solid', material: 'steel' },
      { id: 'l3-p10', x: 2820, y: 350, w: 200, h: 24, kind: 'solid', material: 'copper' },
      { id: 'l3-p11', x: 3080, y: 275, w: 190, h: 24, kind: 'solid', material: 'steel' },
      // Section D (3350–4450): High-Speed Press Corridor & Gear Beast Foundry
      { id: 'l3-p12', x: 3440, y: 480, w: 960, h: 80, kind: 'solid', material: 'steel' },
      {
        id: 'l3-p13',
        x: 3560,
        y: 390,
        w: 320,
        h: 26,
        kind: 'conveyor',
        material: 'copper',
        conveyorSpeed: -110,
      },
      { id: 'l3-p14', x: 3940, y: 310, w: 190, h: 24, kind: 'solid', material: 'steel' },
      { id: 'l3-p15', x: 4160, y: 375, w: 180, h: 24, kind: 'solid', material: 'copper' },
      // Section E + Boss Arena (4450–5600): THE FACTORY OVERLORD Control Chamber
      { id: 'l3-p16', x: 4460, y: 480, w: 1140, h: 80, kind: 'solid', material: 'steel' },
      { id: 'l3-p17', x: 4590, y: 365, w: 170, h: 22, kind: 'solid', material: 'copper' },
      { id: 'l3-p18', x: 4870, y: 295, w: 190, h: 22, kind: 'solid', material: 'steel' },
      { id: 'l3-p19', x: 5150, y: 365, w: 170, h: 22, kind: 'solid', material: 'copper' },
    ],
    collectibles: [
      { id: 'l3-c1', x: 250, y: 435, kind: 'led_strip', value: 200, collected: false },
      { id: 'l3-c2', x: 740, y: 390, kind: 'waterproof_socket', value: 190, collected: false },
      { id: 'l3-c3', x: 1265, y: 320, kind: 'outdoor_fixture', value: 260, collected: false },
      { id: 'l3-c4', x: 1505, y: 220, kind: 'led_spotlight', value: 240, collected: false, isSecret: true },
      { id: 'l3-c5', x: 1890, y: 375, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l3-c6', x: 2555, y: 310, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l3-c7', x: 2920, y: 305, kind: 'electrical_connector', value: 170, collected: false },
      { id: 'l3-c8', x: 3175, y: 230, kind: 'outdoor_fixture', value: 260, collected: false },
      { id: 'l3-c9', x: 3720, y: 345, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l3-c10', x: 4035, y: 265, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l3-c11', x: 4250, y: 330, kind: 'led_strip', value: 200, collected: false },
      { id: 'l3-c12', x: 4675, y: 320, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l3-c13', x: 4965, y: 250, kind: 'led_bulb', value: 250, collected: false },
    ],
    switches: [
      // Stage 3 Puzzle 1 (4-Step Factory Production Sequence: 1. Copper Feed -> 2. Extruder -> 3. Scanner -> 4. Spooler)
      {
        id: 'l3-sw1a',
        x: 1120,
        y: 480,
        activated: false,
        targetId: 'l3-gate1',
        puzzleId: 'l3-puz1',
        nodeCode: '1:سحب',
        sequenceOrder: 1,
        toggleable: true,
        labelAr: '1. وحدة سحب النحاس الخام',
      },
      {
        id: 'l3-sw1',
        x: 1265,
        y: 365,
        activated: false,
        targetId: 'l3-gate1',
        puzzleId: 'l3-puz1',
        nodeCode: '2:عزل',
        sequenceOrder: 2,
        toggleable: true,
        reversesPlatformId: 'l3-p2',
        labelAr: '2. ماكينة بثق العزل الحراري',
      },
      {
        id: 'l3-sw1b',
        x: 1890,
        y: 420,
        activated: false,
        targetId: 'l3-gate1',
        puzzleId: 'l3-puz1',
        nodeCode: '3:فحص',
        sequenceOrder: 3,
        toggleable: true,
        reversesPlatformId: 'l3-p6',
        labelAr: '3. ماسح الجودة الليزري',
      },
      {
        id: 'l3-sw1c',
        x: 2210,
        y: 480,
        activated: false,
        targetId: 'l3-gate1',
        puzzleId: 'l3-puz1',
        nodeCode: '4:لفّ',
        sequenceOrder: 4,
        toggleable: true,
        labelAr: '4. وحدة لفّ البكرات النهائية',
      },
      // Stage 3 Puzzle 2 (Hydraulic Press & Robotic Arm Dependency: 1. Press Clamp -> 2. Robotic Arm -> 3. Gate Release)
      {
        id: 'l3-sw2a',
        x: 2820,
        y: 480,
        activated: false,
        targetId: 'l3-gate2',
        puzzleId: 'l3-puz2',
        nodeCode: '1:تثبيت',
        sequenceOrder: 1,
        toggleable: true,
        labelAr: '1. صمام تثبيت المكبس الهيدروليكي',
      },
      {
        id: 'l3-sw2b',
        x: 2920,
        y: 350,
        activated: false,
        targetId: 'l3-gate2',
        puzzleId: 'l3-puz2',
        nodeCode: '2:ذراع',
        sequenceOrder: 2,
        toggleable: true,
        labelAr: '2. تدوير الذراع الروبوتية الناقلة',
      },
      {
        id: 'l3-sw2',
        x: 3175,
        y: 275,
        activated: false,
        targetId: 'l3-gate2',
        puzzleId: 'l3-puz2',
        nodeCode: '3:تحرير',
        sequenceOrder: 3,
        toggleable: true,
        labelAr: '3. مفتاح تحرير ممر المكابس',
      },
      // Stage 3 Puzzle 3 (Turbine Steam & Coolant Pressure Calibration: Target 90 Bar, Max 90 Bar -> 50 + 40 = 90 Bar)
      {
        id: 'l3-sw3a',
        x: 3720,
        y: 390,
        activated: false,
        targetId: 'l3-gate3',
        puzzleId: 'l3-puz3',
        nodeCode: '50Bar',
        wattage: 50,
        toggleable: true,
        reversesPlatformId: 'l3-p13',
        labelAr: 'صمام البخار الرئيسي (50 بار)',
      },
      {
        id: 'l3-sw3b',
        x: 4035,
        y: 310,
        activated: false,
        targetId: 'l3-gate3',
        puzzleId: 'l3-puz3',
        nodeCode: '60Bar',
        wattage: 60,
        toggleable: true,
        labelAr: 'صمام الضغط العالي (60 بار)',
      },
      {
        id: 'l3-sw3',
        x: 4250,
        y: 375,
        activated: false,
        targetId: 'l3-gate3',
        puzzleId: 'l3-puz3',
        nodeCode: '40Bar',
        wattage: 40,
        toggleable: true,
        labelAr: 'صمام التوازن الميكانيكي (40 بار)',
      },
      // Optional Secret Puzzle: Factory Prototype Calibration
      {
        id: 'l3-sec1',
        x: 1505,
        y: 265,
        activated: false,
        targetId: 'l3-p5',
        puzzleId: 'l3-puz-sec',
        nodeCode: 'معايرة',
        sequenceOrder: 1,
        toggleable: true,
        labelAr: 'وحدة معايرة المختبر السري بالمصنع',
      },
    ],
    puzzles: [
      {
        id: 'l3-puz1',
        titleAr: 'إصلاح تسلسل خط الإنتاج الآلي (1 → 4)',
        mechanicNameAr: 'تشغيل ماكينات المصنع الأربع بالترتيب الصناعي الصحيح',
        ruleKind: 'ordered_sequence',
        zoneMinX: 1020,
        zoneMaxX: 2360,
        targetGateId: 'l3-gate1',
        currentStep: 0,
        totalSteps: 4,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: خط إنتاج الأسلاك متوقف بسبب خطأ في التسلسل؛ تشغيل ماكينة قبل سابقتها يعيد ضبط الخط.',
          'تلميح 2: الترتيب الصناعي الصحيح: (1:سحب) النحاس، ثم (2:عزل)، ثم (3:فحص) بالليزر، وأخيراً (4:لفّ) البكرات.',
          'تلميح 3: ابدأ بـ (1:سحب) أرضاً عند x=1120، ثم اصعد إلى (2:عزل) عند x=1265، ثم اعبر السير إلى (3:فحص) عند x=1890، ثم (4:لفّ) عند x=2210.',
        ],
      },
      {
        id: 'l3-puz2',
        titleAr: 'مزامنة الذراع الروبوتية والمكبس الهيدروليكي',
        mechanicNameAr: 'تأمين المكبس قبل تدوير الذراع الروبوتية',
        ruleKind: 'dependency_chain',
        zoneMinX: 2700,
        zoneMaxX: 3350,
        targetGateId: 'l3-gate2',
        currentStep: 0,
        totalSteps: 3,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: الذراع الروبوتية عالقة تحت المكبس؛ يجب تثبيت المكبس أولاً قبل تحريك الذراع.',
          'تلميح 2: اتبع الاعتمادية: (1:تثبيت) أرضاً، ثم (2:ذراع) في المنصة الوسطى، ثم (3:تحرير) في الأعلى.',
          'تلميح 3: فعّل (1:تثبيت) عند x=2820، ثم اقفز إلى (2:ذراع) عند x=2920، ثم اصعد إلى (3:تحرير) عند x=3175.',
        ],
      },
      {
        id: 'l3-puz3',
        titleAr: 'معايرة ضغط التوربين المركزي (90 بار)',
        mechanicNameAr: 'ضبط صمامات الضغط دون تجاوز حد الأمان (90 بار)',
        ruleKind: 'exact_load_sum',
        zoneMinX: 3440,
        zoneMaxX: 4450,
        targetGateId: 'l3-gate3',
        targetSum: 90,
        maxCapacity: 90,
        currentSum: 0,
        unitLabelAr: 'بار',
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: التوربين يتطلب ضغطاً قدره 90 بار بالضبط؛ تجاوز 90 بار يطلق صمام الأمان ويعيد إغلاق الصمامات.',
          'تلميح 2: الصمامات المتاحة هي 50Bar و60Bar و40Bar؛ جمع 50 و60 يعطي 110 بار (ضغط زائد!).',
          'تلميح 3: فعّل صمام (50Bar) فوق السير الناقل مع صمام (40Bar) الأيمن للوصول إلى 90 بار بالضبط.',
        ],
      },
      {
        id: 'l3-puz-sec',
        titleAr: 'مختبر الفحص الضوئي السري',
        mechanicNameAr: 'لغز سري اختياري',
        ruleKind: 'ordered_sequence',
        isOptionalSecret: true,
        zoneMinX: 1150,
        zoneMaxX: 1650,
        targetGateId: '',
        unlocksPlatformId: 'l3-p5',
        currentStep: 0,
        totalSteps: 1,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: توجد منصة نيون زجاجية سرية فوق خط التجميع الأول.',
          'تلميح 2: اقفز من منصة النحاس عند x=1160 باتجاه اليمين الأعلى.',
          'تلميح 3: فعّل وحدة (معايرة) عند x=1505, y=265 لفتح مكافأة المختبر.',
        ],
      },
    ],
    gates: [
      {
        id: 'l3-gate1',
        x: 2340,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l3-sw1',
        labelAr: 'بوابة خط التجميع الأوسط (فعّل المفتاح 1/3)',
      },
      {
        id: 'l3-gate2',
        x: 3330,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l3-sw2',
        labelAr: 'بوابة ممر المكابس (فعّل المفتاح 2/3)',
      },
      {
        id: 'l3-gate3',
        x: 5340,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l3-sw3',
        labelAr: 'بوابة الخروج من المصنع (اهزم سيد المصنع الآلي وفعّل المفتاح 3/3)',
      },
    ],
    checkpoints: [
      { id: 'l3-cp1', x: 1050, y: 480, activated: false, labelAr: 'وحدة التجميع ومراوح التهوية (B)' },
      { id: 'l3-cp2', x: 2760, y: 480, activated: false, labelAr: 'مصاعد المصنع وطائرات اللحام (C)' },
      { id: 'l3-cp3', x: 3480, y: 480, activated: false, labelAr: 'ممر المكابس ووحوش التروس (D)' },
      { id: 'l3-cp4', x: 4500, y: 480, activated: false, labelAr: 'قاعة سيد المصنع الآلي (E)' },
    ],
    enemies: [
      // Section A: Gear Beast
      {
        id: 'l3-e1',
        x: 360,
        y: 440,
        w: 42,
        h: 40,
        vx: 120,
        minX: 180,
        maxX: 510,
        kind: 'gear_beast',
        defeated: false,
        stompable: true,
      },
      // Section B: Assembly Mimic & Welding Drone
      {
        id: 'l3-e2',
        x: 1460,
        y: 438,
        w: 44,
        h: 42,
        vx: 95,
        minX: 1120,
        maxX: 1610,
        kind: 'assembly_mimic',
        aiState: 'idle',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l3-e3',
        x: 1920,
        y: 310,
        w: 44,
        h: 34,
        vx: -115,
        baseY: 310,
        minX: 1680,
        maxX: 2120,
        kind: 'welding_drone',
        defeated: false,
        stompable: true,
      },
      // Section C: Welding Drone & Gear Beast
      {
        id: 'l3-e4',
        x: 2980,
        y: 300,
        w: 44,
        h: 34,
        vx: 125,
        baseY: 300,
        minX: 2760,
        maxX: 3290,
        kind: 'welding_drone',
        defeated: false,
        stompable: true,
      },
      // Section D: Gear Beast & Assembly Mimic
      {
        id: 'l3-e5',
        x: 3780,
        y: 440,
        w: 42,
        h: 40,
        vx: -135,
        minX: 3500,
        maxX: 4080,
        kind: 'gear_beast',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l3-e6',
        x: 4180,
        y: 438,
        w: 44,
        h: 42,
        vx: 100,
        minX: 3960,
        maxX: 4360,
        kind: 'assembly_mimic',
        aiState: 'idle',
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [
      {
        id: 'l3-press1',
        x: 720,
        y: 355,
        w: 48,
        h: 80,
        baseY: 335,
        kind: 'mechanical_press',
        period: 2.5,
        onTime: 0.9,
        offset: 0,
      },
      {
        id: 'l3-fan1',
        x: 1095,
        y: 448,
        w: 58,
        h: 32,
        kind: 'ventilation_fan',
      },
      {
        id: 'l3-press2',
        x: 1860,
        y: 340,
        w: 48,
        h: 80,
        baseY: 320,
        kind: 'mechanical_press',
        period: 2.2,
        onTime: 0.85,
        offset: 1.0,
      },
      {
        id: 'l3-press3',
        x: 3680,
        y: 310,
        w: 48,
        h: 80,
        baseY: 290,
        kind: 'mechanical_press',
        period: 2.1,
        onTime: 0.85,
        offset: 0.5,
      },
    ],
    boss: {
      archetype: 'factory_overlord_boss',
      nameAr: 'سيد المصنع الآلي — THE FACTORY OVERLORD',
      nameEn: 'THE FACTORY OVERLORD',
      x: 5020,
      y: 388,
      w: 90,
      h: 92,
      vx: -130,
      minX: 4560,
      maxX: 5260,
      hp: 5,
      maxHp: 5,
      phase: 1,
      state: 'patrol',
      stateTimer: 2.0,
      invulnTimer: 0,
      shockwaveLeftX: 5020,
      shockwaveRightX: 5020,
      shockwaveY: 466,
      shockwaveActive: false,
      projectiles: [],
      breakers: [
        { id: 'l3-bb1', x: 4675, y: 365, activated: false, cooldown: 0, labelAr: 'قاطع الذراع الميكانيكية 1' },
        { id: 'l3-bb2', x: 4965, y: 295, activated: false, cooldown: 0, labelAr: 'قاطع التوربين المركزي 2' },
        { id: 'l3-bb3', x: 5235, y: 365, activated: false, cooldown: 0, labelAr: 'قاطع الذراع الميكانيكية 3' },
      ],
    },
  },

  // ==========================================================================
  // STAGE 4 — الإنارة فرع الليثي (ENARAH AL-LAITHI BRANCH)
  // Visual Identity: Advanced Electrical City — Primary Color: BLUE (#1E3A8A / #2563EB / #38BDF8 / #F8FAFC)
  // Multi-Section World (Width: 5800px — Sections A, B, C, D, E + Boss Arena)
  // Unique Monsters: Blue Phantom (الطيف الأزرق), Electric Spider (العنكبوت الكهربائي), Pulse Sentinel (حارس النبض الأزرق)
  // Stage Boss: THE BLUE SENTINEL (الحارس الأزرق المدرع — 6 HP, 4 Combat Phases)
  // ==========================================================================
  {
    id: 'lvl-4',
    stageIndex: 3,
    worldNumber: 4,
    stageNumber: 1,
    code: '4-1',
    titleAr: 'الإنارة فرع الليثي — المعارض الزرقاء والشبكة الذكية',
    titleEn: 'Enarah Al-Laithi Branch — Blue Showrooms & Smart Grid',
    worldTitleAr: 'الإنارة فرع الليثي',
    worldTitleEn: 'Enarah Al-Laithi Branch',
    subtitleAr:
      'استكشف المدينة الكهربائية الزرقاء المتطورة لـ «الإنارة فرع الليثي»: اعبر منصات الطاقة الزرقاء وبوابات الانتقال، واجه «الطيف الأزرق» و«العنكبوت الكهربائي» و«حارس النبض الأزرق»، واهزم الحارس الأزرق المدرع!',
    difficultyAr: 'صعب جداً',
    finalChallengeAr: 'هزيمة الزعيم الحارس الأزرق المدرع (THE BLUE SENTINEL) وتفعيل دوائر التحكم الزرقاء',
    finalChallengeType: 'intercom_security_puzzle',
    theme: 'intercom_district',
    accentColor: '#2563EB',
    skyTop: '#0F172A',
    skyBottom: '#1E3A8A',
    width: 5800,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 5640, y: 405, labelAr: 'بوابة قلعة الظلام' },
    platforms: [
      // Section A (0–1150): Al-Laithi Modern Blue Showrooms & Phase Bridge 1
      { id: 'l4-p1', x: 0, y: 480, w: 620, h: 80, kind: 'solid', material: 'neon_glass' },
      { id: 'l4-p2', x: 260, y: 375, w: 170, h: 24, kind: 'solid', material: 'steel' },
      {
        id: 'l4-bridge1',
        x: 680,
        y: 390,
        w: 175,
        h: 22,
        kind: 'phase',
        material: 'neon_glass',
      },
      { id: 'l4-p3', x: 910, y: 290, w: 260, h: 24, kind: 'solid', material: 'neon_glass' },
      // Section B (1150–2300): Elevated Blue Roads, Teleportation Lifts & Electric Spiders
      { id: 'l4-p4', x: 930, y: 480, w: 720, h: 80, kind: 'solid', material: 'concrete' },
      {
        id: 'l4-secret1',
        x: 1280,
        y: 235,
        w: 195,
        h: 22,
        kind: 'secret_spotlight',
        material: 'neon_glass',
        isSecret: true,
      },
      {
        id: 'l4-warp1',
        x: 1710,
        y: 385,
        w: 165,
        h: 22,
        kind: 'moving',
        material: 'neon_glass',
        startX: 1690,
        startY: 425,
        endX: 1930,
        endY: 310,
        speed: 120,
      },
      { id: 'l4-p5', x: 1990, y: 480, w: 410, h: 80, kind: 'solid', material: 'neon_glass' },
      // Section C (2300–3500): Smart Electrical Control Stations & Rotating Energy Barriers
      { id: 'l4-p6', x: 2460, y: 480, w: 940, h: 80, kind: 'solid', material: 'concrete' },
      { id: 'l4-p7', x: 2580, y: 365, w: 180, h: 24, kind: 'solid', material: 'neon_glass' },
      {
        id: 'l4-bridge2',
        x: 2820,
        y: 290,
        w: 185,
        h: 22,
        kind: 'phase',
        material: 'neon_glass',
      },
      { id: 'l4-p8', x: 3060, y: 365, w: 185, h: 24, kind: 'solid', material: 'steel' },
      // Section D (3500–4620): Timed Laser Grid & Multi-Route Cyan Skyways
      { id: 'l4-p9', x: 3470, y: 480, w: 1080, h: 80, kind: 'solid', material: 'neon_glass' },
      { id: 'l4-p10', x: 3600, y: 375, w: 175, h: 24, kind: 'solid', material: 'steel' },
      { id: 'l4-p11', x: 3840, y: 290, w: 190, h: 24, kind: 'solid', material: 'neon_glass' },
      { id: 'l4-p12', x: 4090, y: 215, w: 190, h: 22, kind: 'solid', material: 'copper', isSecret: true },
      { id: 'l4-p13', x: 4120, y: 365, w: 185, h: 24, kind: 'solid', material: 'neon_glass' },
      // Section E + Boss Arena (4620–5800): THE BLUE SENTINEL Plaza
      { id: 'l4-p14', x: 4620, y: 480, w: 1180, h: 80, kind: 'solid', material: 'neon_glass' },
      { id: 'l4-p15', x: 4760, y: 360, w: 175, h: 22, kind: 'solid', material: 'steel' },
      { id: 'l4-p16', x: 5050, y: 290, w: 195, h: 22, kind: 'solid', material: 'neon_glass' },
      { id: 'l4-p17', x: 5340, y: 360, w: 175, h: 22, kind: 'solid', material: 'steel' },
    ],
    collectibles: [
      { id: 'l4-c1', x: 220, y: 435, kind: 'led_spotlight', value: 240, collected: false },
      { id: 'l4-c2', x: 345, y: 330, kind: 'intercom_device', value: 280, collected: false },
      { id: 'l4-c3', x: 1040, y: 245, kind: 'outdoor_fixture', value: 260, collected: false },
      { id: 'l4-c4', x: 1375, y: 190, kind: 'rechargeable_floodlight', value: 320, collected: false, isSecret: true },
      { id: 'l4-c5', x: 1810, y: 315, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l4-c6', x: 2670, y: 320, kind: 'intercom_device', value: 280, collected: false },
      { id: 'l4-c7', x: 2910, y: 245, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l4-c8', x: 3150, y: 320, kind: 'electrical_switch_item', value: 180, collected: false },
      { id: 'l4-c9', x: 3685, y: 330, kind: 'outdoor_fixture', value: 260, collected: false },
      { id: 'l4-c10', x: 3935, y: 245, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l4-c11', x: 4185, y: 170, kind: 'wire_6mm', value: 300, collected: false, isSecret: true },
      { id: 'l4-c12', x: 4845, y: 315, kind: 'led_spotlight', value: 240, collected: false },
      { id: 'l4-c13', x: 5145, y: 245, kind: 'led_bulb', value: 250, collected: false },
    ],
    switches: [
      // Stage 4 Puzzle 1 (Smart-Grid Coupled Security Matrix + Blue Teleportation Gate: T1 flips T1&T2, T2 flips T2&T3 + teleports, T3 flips T3)
      {
        id: 'l4-sw1a',
        x: 345,
        y: 375,
        activated: false,
        targetId: 'l4-gate1',
        puzzleId: 'l4-puz1',
        nodeCode: 'T1',
        toggleable: true,
        coupledSwitchIds: ['l4-sw1b'],
        labelAr: 'محطة الشبكة الزرقاء T1 (تبدّل T1 وT2)',
      },
      {
        id: 'l4-sw1b',
        x: 1080,
        y: 480,
        activated: false,
        targetId: 'l4-gate1',
        puzzleId: 'l4-puz1',
        nodeCode: 'T2+انتقال',
        toggleable: true,
        coupledSwitchIds: ['l4-sw1'],
        teleportTo: { x: 1020, y: 230 },
        labelAr: 'محطة T2 + بوابة انتقال آني للمنصة العلوية (تبدّل T2 وT3)',
      },
      {
        id: 'l4-sw1',
        x: 1080,
        y: 290,
        activated: false,
        targetId: 'l4-gate1',
        puzzleId: 'l4-puz1',
        nodeCode: 'T3',
        toggleable: true,
        coupledSwitchIds: [],
        labelAr: 'محطة الشبكة الزرقاء العلوية T3 (تثبّت T3)',
      },
      // Stage 4 Puzzle 2 (Directional Energy Bridge & Smart-Grid Capacity: Target 110MW, Max 110MW -> 70MW + 40MW = 110MW)
      {
        id: 'l4-sw2a',
        x: 2670,
        y: 365,
        activated: false,
        targetId: 'l4-gate2',
        puzzleId: 'l4-puz2',
        nodeCode: '70MW',
        wattage: 70,
        toggleable: true,
        labelAr: 'موجّه الجسر الأزرق الشمالي (70 ميغاواط)',
      },
      {
        id: 'l4-sw2b',
        x: 2910,
        y: 480,
        activated: false,
        targetId: 'l4-gate2',
        puzzleId: 'l4-puz2',
        nodeCode: '60MW+انتقال',
        wattage: 60,
        toggleable: true,
        teleportTo: { x: 2910, y: 230 },
        labelAr: 'موجّه الوسط (60 ميغاواط) + انتقال للجسر العلوي',
      },
      {
        id: 'l4-sw2',
        x: 3150,
        y: 365,
        activated: false,
        targetId: 'l4-gate2',
        puzzleId: 'l4-puz2',
        nodeCode: '40MW',
        wattage: 40,
        toggleable: true,
        labelAr: 'موجّه الجسر الأزرق الشرقي (40 ميغاواط)',
      },
      // Stage 4 Puzzle 3 (Smart-Grid Frequency Encryption Sequence: Alpha -> Beta -> Gamma)
      {
        id: 'l4-sw3a',
        x: 3685,
        y: 375,
        activated: false,
        targetId: 'l4-gate3',
        puzzleId: 'l4-puz3',
        nodeCode: 'تردد-1',
        sequenceOrder: 1,
        toggleable: true,
        labelAr: 'عقدة التردد الأزرق الأولى α (1/3)',
      },
      {
        id: 'l4-sw3b',
        x: 3935,
        y: 290,
        activated: false,
        targetId: 'l4-gate3',
        puzzleId: 'l4-puz3',
        nodeCode: 'تردد-2',
        sequenceOrder: 2,
        toggleable: true,
        labelAr: 'عقدة التردد الأزرق الثانية β (2/3)',
      },
      {
        id: 'l4-sw3',
        x: 4210,
        y: 365,
        activated: false,
        targetId: 'l4-gate3',
        puzzleId: 'l4-puz3',
        nodeCode: 'تردد-3',
        sequenceOrder: 3,
        toggleable: true,
        labelAr: 'عقدة التردد الأزرق الثالثة γ (3/3)',
      },
      // Optional Secret Puzzle: Al-Laithi Quantum Showroom Node
      {
        id: 'l4-sec1',
        x: 4185,
        y: 215,
        activated: false,
        targetId: 'l4-p12',
        puzzleId: 'l4-puz-sec',
        nodeCode: 'كوانتم',
        sequenceOrder: 1,
        toggleable: true,
        labelAr: 'محطة التشفير السرية لمعرض الليثي الأزرق',
      },
    ],
    puzzles: [
      {
        id: 'l4-puz1',
        titleAr: 'أمن الشبكة الذكية الزرقاء (T1 • T2 • T3)',
        mechanicNameAr: 'محطات منطقية مترابطة مع بوابة انتقال آني زرقاء',
        ruleKind: 'coupled_xor_matrix',
        zoneMinX: 200,
        zoneMaxX: 2350,
        targetGateId: 'l4-gate1',
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: محطات التحكم الزرقاء الثلاث مترابطة منطقياً؛ كما أن المحطة الأرضية T2 تحتوي على بوابة انتقال آني ترفعك للمنصة العلوية.',
          'تلميح 2: (T1) تبدّل حالتي T1 وT2 معاً، بينما (T2) تبدّل T2 وT3 وتنقلك للأعلى، و(T3) تبدّل T3 فقط.',
          'تلميح 3: فعّل (T1) أولاً لتشتغل T1 وT2، ثم اصعد للمنصة العلوية وفعّل (T3) لتصبح المحطات الثلاث زرقاء نشطة معاً!',
        ],
      },
      {
        id: 'l4-puz2',
        titleAr: 'توجيه جسور الطاقة الزرقاء (110 ميغاواط)',
        mechanicNameAr: 'موازنة تدفق الطاقة الذكية دون تفعيل جدار الحماية',
        ruleKind: 'exact_load_sum',
        zoneMinX: 2450,
        zoneMaxX: 3380,
        targetGateId: 'l4-gate2',
        targetSum: 110,
        maxCapacity: 110,
        currentSum: 0,
        unitLabelAr: 'ميغاواط',
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: جسر الطاقة في فرع الليثي يتطلب 110 ميغاواط بالضبط؛ تجاوز السعة يفعل الحماية الذكية ويعيد ضبط الموجهات.',
          'تلميح 2: الموجهات الثلاثة هي 70MW يساراً، 60MW في الأسفل، و40MW يميناً.',
          'تلميح 3: فعّل موجّه (70MW) الأيسر مع موجّه (40MW) الأيمن للوصول إلى 110 ميغاواط بالضبط وفتح البوابة الثانية.',
        ],
      },
      {
        id: 'l4-puz3',
        titleAr: 'فك تشفير ترددات الليثي (α → β → γ)',
        mechanicNameAr: 'تفعيل عقد التردد الثلاث بالترتيب المشفر',
        ruleKind: 'ordered_sequence',
        zoneMinX: 3480,
        zoneMaxX: 4580,
        targetGateId: 'l4-gate3',
        currentStep: 0,
        totalSteps: 3,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: بوابة ساحة الحارس الأزرق محمية بتشفير ترددي ثلاثي المراحل.',
          'تلميح 2: يجب تفعيل (تردد-1 α) ثم (تردد-2 β) العلوي ثم (تردد-3 γ) بالترتيب.',
          'تلميح 3: ابدأ بـ (تردد-1) عند x=3685، ثم اقفز إلى (تردد-2) عند x=3935، ثم انزل إلى (تردد-3) عند x=4210.',
        ],
      },
      {
        id: 'l4-puz-sec',
        titleAr: 'خزنة المعرض الأزرق الذكي',
        mechanicNameAr: 'لغز سري اختياري',
        ruleKind: 'ordered_sequence',
        isOptionalSecret: true,
        zoneMinX: 3800,
        zoneMaxX: 4350,
        targetGateId: '',
        unlocksPlatformId: 'l4-p12',
        currentStep: 0,
        totalSteps: 1,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: توجد منصة نحاسية عالية فوق عقدة التردد الثانية في فرع الليثي.',
          'تلميح 2: اقفز من منصة (تردد-2) عند y=290 نحو الأعلى يميناً.',
          'تلميح 3: فعّل محطة (كوانتم) عند x=4185, y=215 للحصول على مكافأة الشبكة السرية.',
        ],
      },
    ],
    gates: [
      {
        id: 'l4-gate1',
        x: 2340,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l4-sw1',
        labelAr: 'بوابة الجادة الزرقاء (فعّل القاطع 1/3)',
      },
      {
        id: 'l4-gate2',
        x: 3360,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l4-sw2',
        labelAr: 'بوابة الأبراج الذكية (فعّل القاطع 2/3)',
      },
      {
        id: 'l4-gate3',
        x: 5540,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l4-sw3',
        labelAr: 'بوابة قلعة الظلام (اهزم الحارس الأزرق المدرع وفعّل القاطع 3/3)',
      },
    ],
    checkpoints: [
      { id: 'l4-cp1', x: 970, y: 480, activated: false, labelAr: 'معارض فرع الليثي الزرقاء (B)' },
      { id: 'l4-cp2', x: 2500, y: 480, activated: false, labelAr: 'محطة التحكم الذكية الزرقاء (C)' },
      { id: 'l4-cp3', x: 3510, y: 480, activated: false, labelAr: 'ممر الليزر الأزرق المرتفع (D)' },
      { id: 'l4-cp4', x: 4660, y: 480, activated: false, labelAr: 'ساحة الحارس الأزرق المدرع (E)' },
    ],
    enemies: [
      // Section A: Blue Phantom
      {
        id: 'l4-e1',
        x: 430,
        y: 440,
        w: 38,
        h: 40,
        vx: 140,
        minX: 210,
        maxX: 590,
        kind: 'blue_phantom',
        defeated: false,
        stompable: true,
      },
      // Section B: Electric Spider & Blue Phantom
      {
        id: 'l4-e2',
        x: 1360,
        y: 340,
        w: 42,
        h: 36,
        vx: 95,
        baseY: 340,
        minX: 1080,
        maxX: 1580,
        kind: 'electric_spider',
        defeated: false,
        stompable: true,
      },
      // Section C: Pulse Sentinel & Electric Spider
      {
        id: 'l4-e3',
        x: 2840,
        y: 434,
        w: 48,
        h: 46,
        vx: 105,
        minX: 2540,
        maxX: 3250,
        kind: 'pulse_sentinel',
        hp: 2,
        maxHp: 2,
        defeated: false,
        stompable: true,
      },
      // Section D: Blue Phantom, Electric Spider & Pulse Sentinel
      {
        id: 'l4-e4',
        x: 3740,
        y: 440,
        w: 38,
        h: 40,
        vx: -148,
        minX: 3530,
        maxX: 4020,
        kind: 'blue_phantom',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l4-e5',
        x: 4040,
        y: 335,
        w: 42,
        h: 36,
        vx: 102,
        baseY: 335,
        minX: 3820,
        maxX: 4340,
        kind: 'electric_spider',
        defeated: false,
        stompable: true,
      },
      {
        id: 'l4-e6',
        x: 4360,
        y: 434,
        w: 48,
        h: 46,
        vx: -110,
        minX: 4080,
        maxX: 4510,
        kind: 'pulse_sentinel',
        hp: 2,
        maxHp: 2,
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [
      {
        id: 'l4-rot1',
        x: 1510,
        y: 385,
        w: 38,
        h: 38,
        kind: 'rotating_hazard',
        radius: 54,
        angle: 0,
      },
      {
        id: 'l4-laser1',
        x: 2770,
        y: 350,
        w: 16,
        h: 130,
        kind: 'laser_beam',
        period: 2.6,
        onTime: 1.0,
        offset: 0,
      },
      {
        id: 'l4-laser2',
        x: 3810,
        y: 350,
        w: 16,
        h: 130,
        kind: 'laser_beam',
        period: 2.5,
        onTime: 1.0,
        offset: 1.2,
      },
    ],
    boss: {
      archetype: 'blue_sentinel_boss',
      nameAr: 'الحارس الأزرق المدرع — THE BLUE SENTINEL',
      nameEn: 'THE BLUE SENTINEL',
      x: 5180,
      y: 386,
      w: 90,
      h: 94,
      vx: -138,
      minX: 4720,
      maxX: 5460,
      hp: 6,
      maxHp: 6,
      phase: 1,
      state: 'patrol',
      stateTimer: 1.9,
      invulnTimer: 0,
      shockwaveLeftX: 5180,
      shockwaveRightX: 5180,
      shockwaveY: 466,
      shockwaveActive: false,
      projectiles: [],
      breakers: [
        { id: 'l4-bb1', x: 4845, y: 360, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ النبض الأزرق 1' },
        { id: 'l4-bb2', x: 5145, y: 290, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ النبض الأزرق 2' },
        { id: 'l4-bb3', x: 5425, y: 360, activated: false, cooldown: 0, labelAr: 'قاطع تفريغ النبض الأزرق 3' },
      ],
    },
  },

  // ==========================================================================
  // STAGE 5 — قلعة الظلام (DARKNESS FORTRESS)
  // Visual Identity: Final Dark Fortress — Dark / Energy
  // Multi-Section World (Width: 6000px — Sections A, B, C, D, E + Grand Final Boss Arena)
  // Unique Monsters: Dark Stalker (مطارد الظلام), Void Flyer (طائر الفراغ), Shadow Brute (عملاق الظل), Fortress Guardian (حارس القلعة)
  // Final Boss: THE SHADOW CORE (نواة الظلام — 8 HP, 3 Multi-Phase Mechanical Monster)
  // ==========================================================================
  {
    id: 'lvl-5',
    stageIndex: 4,
    worldNumber: 5,
    stageNumber: 1,
    code: '5-1',
    titleAr: 'قلعة الظلام — المعركة الكبرى ضد نواة الظلام',
    titleEn: 'Darkness Fortress — Grand Battle Against The Shadow Core',
    worldTitleAr: 'قلعة الظلام',
    worldTitleEn: 'Darkness Fortress',
    subtitleAr:
      'المرحلة الخامسة والختامية الكبرى! اخترق بوابات وغرف الطاقة في قلعة الظلام عبر 5 قطاعات شاسعة، قاتل «مطارد الظلام» و«طائر الفراغ» و«عملاق الظل» و«حارس القلعة»، واهزم الزعيم النهائي «نواة الظلام — THE SHADOW CORE»!',
    difficultyAr: 'التحدي النهائي الأسطوري',
    finalChallengeAr: 'تدمير الأجزاء الدفاعية وهزيمة الزعيم النهائي «نواة الظلام — THE SHADOW CORE» عبر أطواره المتعددة',
    finalChallengeType: 'boss_dark_king_3phase',
    darknessLevel: 0.14,
    windForce: -25,
    theme: 'darkness_fortress',
    accentColor: '#F43F5E',
    skyTop: '#090D16',
    skyBottom: '#1F122B',
    width: 6000,
    height: 560,
    groundY: 480,
    heroSpawn: { x: 85, y: 410 },
    goalPortal: { x: 5840, y: 405, labelAr: 'القاطع الأسطوري للإنارة الحديثة' },
    platforms: [
      // Section A (0–1150): Outer Fortress Ramparts & Mechanical Gates
      { id: 'l5-p1', x: 0, y: 480, w: 620, h: 80, kind: 'solid', material: 'fortress_stone' },
      { id: 'l5-p2', x: 260, y: 375, w: 170, h: 24, kind: 'solid', material: 'steel' },
      {
        id: 'l5-conv1',
        x: 670,
        y: 420,
        w: 320,
        h: 24,
        kind: 'conveyor',
        material: 'steel',
        conveyorSpeed: -105,
      },
      // Section B (1150–2350): Deep Vertical Energy Chambers & Void Flyer Chasm
      { id: 'l5-p3', x: 1050, y: 480, w: 660, h: 80, kind: 'solid', material: 'fortress_stone' },
      { id: 'l5-p4', x: 1190, y: 365, w: 185, h: 24, kind: 'solid', material: 'copper' },
      { id: 'l5-p5', x: 1440, y: 265, w: 195, h: 22, kind: 'secret_spotlight', material: 'neon_glass', isSecret: true },
      {
        id: 'l5-mov1',
        x: 1770,
        y: 380,
        w: 165,
        h: 22,
        kind: 'moving',
        material: 'copper',
        startX: 1750,
        startY: 420,
        endX: 1980,
        endY: 300,
        speed: 125,
      },
      { id: 'l5-p6', x: 2040, y: 480, w: 380, h: 80, kind: 'solid', material: 'fortress_stone' },
      // Section C (2350–3550): Multi-Stage Puzzle Hall & Shadow Brute Arena
      { id: 'l5-p7', x: 2480, y: 480, w: 980, h: 80, kind: 'solid', material: 'fortress_stone' },
      { id: 'l5-p8', x: 2610, y: 365, w: 180, h: 24, kind: 'solid', material: 'steel' },
      {
        id: 'l5-phase1',
        x: 2860,
        y: 285,
        w: 185,
        h: 22,
        kind: 'phase',
        material: 'neon_glass',
      },
      { id: 'l5-p9', x: 3110, y: 365, w: 185, h: 24, kind: 'solid', material: 'copper' },
      // Section D (3550–4720): Fortress Guardian Citadel & High-Hazard Gauntlet
      { id: 'l5-p10', x: 3530, y: 480, w: 1120, h: 80, kind: 'solid', material: 'fortress_stone' },
      {
        id: 'l5-conv2',
        x: 3660,
        y: 385,
        w: 310,
        h: 24,
        kind: 'conveyor',
        material: 'steel',
        conveyorSpeed: 120,
      },
      { id: 'l5-p11', x: 4040, y: 295, w: 190, h: 24, kind: 'solid', material: 'copper' },
      { id: 'l5-p12', x: 4300, y: 365, w: 195, h: 24, kind: 'solid', material: 'steel' },
      // Section E + Final Boss Arena (4720–6000): THE SHADOW CORE Sanctum
      { id: 'l5-p13', x: 4720, y: 480, w: 1280, h: 80, kind: 'solid', material: 'fortress_stone' },
      {
        id: 'l5-sp1',
        x: 4790,
        y: 454,
        w: 60,
        h: 26,
        kind: 'spring',
        material: 'copper',
        springBoostVy: -780,
      },
      { id: 'l5-b1', x: 4920, y: 360, w: 180, h: 22, kind: 'solid', material: 'copper' },
      { id: 'l5-b2', x: 5230, y: 290, w: 200, h: 22, kind: 'solid', material: 'neon_glass' },
      { id: 'l5-b3', x: 5560, y: 360, w: 180, h: 22, kind: 'solid', material: 'copper' },
    ],
    collectibles: [
      { id: 'l5-c1', x: 220, y: 435, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l5-c2', x: 345, y: 330, kind: 'rechargeable_floodlight', value: 320, collected: false },
      { id: 'l5-c3', x: 820, y: 375, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l5-c4', x: 1280, y: 320, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l5-c5', x: 1535, y: 220, kind: 'intercom_device', value: 280, collected: false, isSecret: true },
      { id: 'l5-c6', x: 1865, y: 310, kind: 'rechargeable_floodlight', value: 320, collected: false },
      { id: 'l5-c7', x: 2700, y: 320, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l5-c8', x: 2950, y: 240, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l5-c9', x: 3200, y: 320, kind: 'electrical_connector', value: 170, collected: false },
      { id: 'l5-c10', x: 3810, y: 340, kind: 'wire_4mm', value: 220, collected: false },
      { id: 'l5-c11', x: 4135, y: 250, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l5-c12', x: 5010, y: 315, kind: 'wire_6mm', value: 300, collected: false },
      { id: 'l5-c13', x: 5330, y: 245, kind: 'led_bulb', value: 250, collected: false },
      { id: 'l5-c14', x: 5650, y: 315, kind: 'wire_6mm', value: 300, collected: false },
    ],
    switches: [
      // Stage 5 Puzzle 1 (Fortress Power Distribution Chamber: Target 120kW, Max 120kW -> 80kW + 40kW = 120kW)
      {
        id: 'l5-sw1',
        x: 1280,
        y: 365,
        activated: false,
        targetId: 'l5-gate1',
        puzzleId: 'l5-puz1',
        nodeCode: '80kW',
        wattage: 80,
        toggleable: true,
        reversesPlatformId: 'l5-conv1',
        labelAr: 'مولّد الجناح الغربي للقلعة (80 كيلوواط)',
      },
      {
        id: 'l5-sw1a',
        x: 1620,
        y: 480,
        activated: false,
        targetId: 'l5-gate1',
        puzzleId: 'l5-puz1',
        nodeCode: '60kW',
        wattage: 60,
        toggleable: true,
        labelAr: 'مولّد الأبراج المظلمة (60 كيلوواط)',
      },
      {
        id: 'l5-sw1b',
        x: 2150,
        y: 480,
        activated: false,
        targetId: 'l5-gate1',
        puzzleId: 'l5-puz1',
        nodeCode: '40kW',
        wattage: 40,
        toggleable: true,
        labelAr: 'مولّد القبو المغناطيسي (40 كيلوواط)',
      },
      // Stage 5 Puzzle 2 (Magnetic Containment & Smart-Grid Coupled Lock + Teleportation Gate)
      {
        id: 'l5-sw2a',
        x: 2700,
        y: 365,
        activated: false,
        targetId: 'l5-gate2',
        puzzleId: 'l5-puz2',
        nodeCode: 'عزل-1',
        toggleable: true,
        coupledSwitchIds: ['l5-sw2b'],
        labelAr: 'قفل العزل المغناطيسي 1 (يبدّل 1 و2)',
      },
      {
        id: 'l5-sw2b',
        x: 2950,
        y: 480,
        activated: false,
        targetId: 'l5-gate2',
        puzzleId: 'l5-puz2',
        nodeCode: 'عزل-2+انتقال',
        toggleable: true,
        coupledSwitchIds: ['l5-sw2'],
        teleportTo: { x: 2950, y: 225 },
        labelAr: 'قفل العزل 2 + بوابة انتقال للجسر (يبدّل 2 و3)',
      },
      {
        id: 'l5-sw2',
        x: 3200,
        y: 365,
        activated: false,
        targetId: 'l5-gate2',
        puzzleId: 'l5-puz2',
        nodeCode: 'عزل-3',
        toggleable: true,
        coupledSwitchIds: [],
        labelAr: 'قفل العزل المغناطيسي 3 (يثبّت 3)',
      },
      // Stage 5 Puzzle 3 (Master 4-System Override Sequence: 1. Power -> 2. Magnet -> 3. Automation -> 4. Smart Grid)
      {
        id: 'l5-sw3a',
        x: 3620,
        y: 480,
        activated: false,
        targetId: 'l5-gate3',
        puzzleId: 'l5-puz3',
        nodeCode: '1:طاقة',
        sequenceOrder: 1,
        toggleable: true,
        reversesPlatformId: 'l5-conv2',
        labelAr: '1. تحرير خط طاقة القلعة وعكس السير',
      },
      {
        id: 'l5-sw3b',
        x: 3810,
        y: 385,
        activated: false,
        targetId: 'l5-gate3',
        puzzleId: 'l5-puz3',
        nodeCode: '2:مغناطيس',
        sequenceOrder: 2,
        toggleable: true,
        labelAr: '2. فصل القفل المغناطيسي المركزي',
      },
      {
        id: 'l5-sw3c',
        x: 4135,
        y: 295,
        activated: false,
        targetId: 'l5-gate3',
        puzzleId: 'l5-puz3',
        nodeCode: '3:أتمتة',
        sequenceOrder: 3,
        toggleable: true,
        labelAr: '3. إيقاف أتمتة المكابس الدفاعية',
      },
      {
        id: 'l5-sw3',
        x: 4395,
        y: 365,
        activated: false,
        targetId: 'l5-gate3',
        puzzleId: 'l5-puz3',
        nodeCode: '4:شبكة',
        sequenceOrder: 4,
        toggleable: true,
        labelAr: '4. اختراق شبكة أمان نواة الظلام',
      },
      // Optional Secret Puzzle: Fortress Ancient Light Relic
      {
        id: 'l5-sec1',
        x: 1535,
        y: 265,
        activated: false,
        targetId: 'l5-p5',
        puzzleId: 'l5-puz-sec',
        nodeCode: 'أثر النور',
        sequenceOrder: 1,
        toggleable: true,
        labelAr: 'مفتاح أثر النور السري بالقلعة',
      },
    ],
    puzzles: [
      {
        id: 'l5-puz1',
        titleAr: 'شبكة طاقة القلعة المظلمة (120 كيلوواط)',
        mechanicNameAr: 'موازنة المولدات الثلاثة لتشغيل القبو المغناطيسي',
        ruleKind: 'exact_load_sum',
        zoneMinX: 1050,
        zoneMaxX: 2380,
        targetGateId: 'l5-gate1',
        targetSum: 120,
        maxCapacity: 120,
        currentSum: 0,
        unitLabelAr: 'كيلوواط',
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: بوابة القلعة الداخلية تحتاج إلى 120 كيلوواط بالضبط؛ تشغيل 80kW مع 60kW يتجاوز السعة (140kW).',
          'تلميح 2: المولدات المتوفرة في الغرفة هي 80kW أعلى اليسار، 60kW في الوسط، و40kW قبل البوابة.',
          'تلميح 3: فعّل مولّد (80kW) عند x=1280 ثم تقدم لتفعيل مولّد (40kW) عند x=2150 للوصول إلى 120 كيلوواط.',
        ],
      },
      {
        id: 'l5-puz2',
        titleAr: 'مصفوفة العزل المغناطيسي والشبكة الذكية',
        mechanicNameAr: 'أقفال عزل مترابطة مع بوابة انتقال علوية',
        ruleKind: 'coupled_xor_matrix',
        zoneMinX: 2480,
        zoneMaxX: 3430,
        targetGateId: 'l5-gate2',
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: أقفال العزل الثلاثة في قاعة عمالقة الظل مترابطة؛ القفل الأوسط يحتوي أيضاً على انتقال آني للجسر.',
          'تلميح 2: (عزل-1) يبدّل 1 و2، بينما (عزل-2) يبدّل 2 و3، و(عزل-3) يثبّت 3 فقط.',
          'تلميح 3: فعّل (عزل-1) لتشغيل 1 و2، ثم اقفز إلى (عزل-3) على اليمين لتشغيله وتفتح البوابة الثانية.',
        ],
      },
      {
        id: 'l5-puz3',
        titleAr: 'بروتوكول اختراق sanctum نواة الظلام (1 → 4)',
        mechanicNameAr: 'دمج أنظمة الطاقة والمغناطيس والأتمتة والشبكة الذكية بالترتيب',
        ruleKind: 'ordered_sequence',
        zoneMinX: 3530,
        zoneMaxX: 4630,
        targetGateId: 'l5-gate3',
        currentStep: 0,
        totalSteps: 4,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: بوابة غرفة الزعيم النهائي تتطلب تعطيل الأنظمة الأربعة بالترتيب الذي تعلمته عبر المراحل السابقة.',
          'تلميح 2: الترتيب هو: (1:طاقة) ثم (2:مغناطيس) ثم (3:أتمتة) ثم (4:شبكة).',
          'تلميح 3: فعّل (1:طاقة) عند x=3620 لعكس السير، ثم (2:مغناطيس) فوق السير، ثم اصعد لـ (3:أتمتة) عند x=4135، ثم (4:شبكة) عند x=4395.',
        ],
      },
      {
        id: 'l5-puz-sec',
        titleAr: 'محراب أثر النور السري',
        mechanicNameAr: 'لغز سري اختياري',
        ruleKind: 'ordered_sequence',
        isOptionalSecret: true,
        zoneMinX: 1180,
        zoneMaxX: 1700,
        targetGateId: '',
        unlocksPlatformId: 'l5-p5',
        currentStep: 0,
        totalSteps: 1,
        status: 'active',
        solved: false,
        hintsAr: [
          'تلميح 1: توجد شرفة نيون سرية عالية في غرفة الطاقة العميقة بالقلعة.',
          'تلميح 2: اقفز من منصة النحاس عند x=1190 نحو الأعلى يميناً.',
          'تلميح 3: فعّل مفتاح (أثر النور) عند x=1535, y=265 لفتح الكنز السري.',
        ],
      },
    ],
    gates: [
      {
        id: 'l5-gate1',
        x: 2360,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l5-sw1',
        labelAr: 'بوابة القلعة الداخلية (فعّل القاطع 1/3)',
      },
      {
        id: 'l5-gate2',
        x: 3410,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l5-sw2',
        labelAr: 'بوابة ممر حراس القلعة (فعّل القاطع 2/3)',
      },
      {
        id: 'l5-gate3',
        x: 4610,
        y: 350,
        w: 28,
        h: 130,
        isOpen: false,
        switchId: 'l5-sw3',
        labelAr: 'بوابة غرفة نواة الظلام (فعّل القاطع 3/3)',
      },
    ],
    checkpoints: [
      { id: 'l5-cp1', x: 1090, y: 480, activated: false, labelAr: 'غرفة الطاقة العميقة (B)' },
      { id: 'l5-cp2', x: 2520, y: 480, activated: false, labelAr: 'قاعة عمالقة الظل (C)' },
      { id: 'l5-cp3', x: 3570, y: 480, activated: false, labelAr: 'ممر حراس القلعة (D)' },
      { id: 'l5-cp4', x: 4750, y: 480, activated: false, labelAr: 'بوابة نواة الظلام الكبرى (E)' },
    ],
    enemies: [
      // Section A: Dark Stalker
      {
        id: 'l5-e1',
        x: 430,
        y: 436,
        w: 44,
        h: 44,
        vx: 135,
        minX: 200,
        maxX: 590,
        kind: 'dark_stalker',
        defeated: false,
        stompable: true,
      },
      // Section B: Void Flyer & Dark Stalker
      {
        id: 'l5-e2',
        x: 1480,
        y: 320,
        w: 46,
        h: 38,
        vx: 130,
        baseY: 320,
        minX: 1120,
        maxX: 1680,
        kind: 'void_flyer',
        defeated: false,
        stompable: true,
      },
      // Section C: Shadow Brute & Void Flyer
      {
        id: 'l5-e3',
        x: 2860,
        y: 426,
        w: 58,
        h: 54,
        vx: 92,
        minX: 2560,
        maxX: 3310,
        kind: 'shadow_brute',
        hp: 2,
        maxHp: 2,
        defeated: false,
        stompable: true,
      },
      {
        id: 'l5-e4',
        x: 3120,
        y: 305,
        w: 46,
        h: 38,
        vx: -135,
        baseY: 305,
        minX: 2650,
        maxX: 3350,
        kind: 'void_flyer',
        defeated: false,
        stompable: true,
      },
      // Section D: Fortress Guardian, Dark Stalker & Shadow Brute
      {
        id: 'l5-e5',
        x: 3920,
        y: 430,
        w: 52,
        h: 50,
        vx: -108,
        minX: 3620,
        maxX: 4220,
        kind: 'fortress_guardian',
        hp: 2,
        maxHp: 2,
        defeated: false,
        stompable: true,
      },
      {
        id: 'l5-e6',
        x: 4380,
        y: 436,
        w: 44,
        h: 44,
        vx: 142,
        minX: 4080,
        maxX: 4560,
        kind: 'dark_stalker',
        defeated: false,
        stompable: true,
      },
    ],
    hazards: [
      {
        id: 'l5-press1',
        x: 810,
        y: 340,
        w: 48,
        h: 80,
        baseY: 320,
        kind: 'mechanical_press',
        period: 2.3,
        onTime: 0.85,
        offset: 0,
      },
      {
        id: 'l5-laser1',
        x: 2790,
        y: 350,
        w: 16,
        h: 130,
        kind: 'laser_beam',
        period: 2.5,
        onTime: 1.0,
        offset: 0.4,
      },
      {
        id: 'l5-h1',
        x: 5130,
        y: 466,
        w: 65,
        h: 14,
        kind: 'timed_arc',
        period: 2.4,
        onTime: 1.0,
        offset: 0,
      },
      {
        id: 'l5-h2',
        x: 5470,
        y: 466,
        w: 65,
        h: 14,
        kind: 'timed_arc',
        period: 2.4,
        onTime: 1.0,
        offset: 1.2,
      },
    ],
    boss: {
      archetype: 'shadow_core_boss',
      nameAr: 'نواة الظلام — THE SHADOW CORE',
      nameEn: 'THE SHADOW CORE',
      x: 5380,
      y: 382,
      w: 96,
      h: 98,
      vx: -148,
      minX: 4880,
      maxX: 5760,
      hp: 8,
      maxHp: 8,
      phase: 1,
      state: 'patrol',
      stateTimer: 2.0,
      invulnTimer: 0,
      shockwaveLeftX: 5380,
      shockwaveRightX: 5380,
      shockwaveY: 466,
      shockwaveActive: false,
      projectiles: [],
      breakers: [
        { id: 'l5-bb1', x: 4960, y: 360, activated: false, cooldown: 0, labelAr: 'طور 1: قاطع توجيه الدائرة الكهربائية' },
        { id: 'l5-bb2', x: 5260, y: 290, activated: false, cooldown: 0, labelAr: 'طور 2: رافعة كشف النواة المغناطيسية' },
        { id: 'l5-bb3', x: 5410, y: 290, activated: false, cooldown: 0, labelAr: 'طور 3: مزامن المكابس الميكانيكية' },
        { id: 'l5-bb4', x: 5650, y: 360, activated: false, cooldown: 0, labelAr: 'طور 4: قفل المنطق الضوئي النهائي' },
      ],
      shieldLocked: true,
    },
  },
]

// ============================================================================
// V15 SECTION 2 & 15 — DETERMINISTIC PUZZLE STATE MACHINE & BFS SOLVABILITY VALIDATOR
// ============================================================================

export interface PuzzleTransitionResult {
  puzzleSolvedNow: boolean
  overloadTripped: boolean
  teleportedTo?: { x: number; y: number }
  reversedPlatformId?: string
  feedbackMessageAr: string
  feedbackType: 'info' | 'success' | 'error'
}

/**
 * Applies a player switch/terminal interaction to the stage's puzzle state machine.
 * Used both by live gameplay (platformerPhysics.ts) and automated BFS state-space validation.
 */
export function evaluatePuzzleSwitchInteraction(
  stage: StageDefinition,
  clickedSwitch: StageSwitch
): PuzzleTransitionResult {
  let teleportedTo: { x: number; y: number } | undefined
  if (clickedSwitch.teleportTo) {
    teleportedTo = { ...clickedSwitch.teleportTo }
  }

  let reversedPlatformId: string | undefined
  if (clickedSwitch.reversesPlatformId) {
    reversedPlatformId = clickedSwitch.reversesPlatformId
    const plat = stage.platforms.find((p) => p.id === reversedPlatformId)
    if (plat && typeof plat.conveyorSpeed === 'number') {
      plat.conveyorSpeed = -plat.conveyorSpeed
    }
  }

  const puzzle = stage.puzzles?.find((p) => p.id === clickedSwitch.puzzleId)
  if (!puzzle) {
    clickedSwitch.activated = true
    return {
      puzzleSolvedNow: true,
      overloadTripped: false,
      teleportedTo,
      reversedPlatformId,
      feedbackMessageAr: `🔓 تم تفعيل ${clickedSwitch.labelAr}`,
      feedbackType: 'success',
    }
  }

  if (puzzle.solved) {
    return {
      puzzleSolvedNow: false,
      overloadTripped: false,
      teleportedTo,
      reversedPlatformId,
      feedbackMessageAr: `✓ اللغز مكتمل مسبقاً: ${puzzle.titleAr}`,
      feedbackType: 'info',
    }
  }

  const puzzleSwitches = stage.switches.filter((s) => s.puzzleId === puzzle.id)

  // 1. EXACT LOAD / PRESSURE / MAGNETIC FLUX SUM RULE
  if (puzzle.ruleKind === 'exact_load_sum') {
    clickedSwitch.activated = !clickedSwitch.activated
    const sum = puzzleSwitches
      .filter((s) => s.activated)
      .reduce((acc, s) => acc + (s.wattage || 0), 0)
    puzzle.currentSum = sum
    const maxCap = puzzle.maxCapacity ?? puzzle.targetSum ?? 100
    const target = puzzle.targetSum ?? 100
    const unit = puzzle.unitLabelAr || 'وحدة'

    if (sum > maxCap) {
      // Overload trip! Reset all switches in this puzzle cleanly (no soft lock)
      for (const s of puzzleSwitches) s.activated = false
      puzzle.currentSum = 0
      puzzle.status = 'overload_reset'
      puzzle.statusMessageAr = `حمل زائد (${sum}/${maxCap} ${unit})! أعيد ضبط القواطع.`
      return {
        puzzleSolvedNow: false,
        overloadTripped: true,
        teleportedTo,
        reversedPlatformId,
        feedbackMessageAr: `⚠️ حمل زائد (${sum}/${maxCap} ${unit})! فصلت القواطع تلقائياً — وازن الأحمال للوصول إلى ${target} ${unit}.`,
        feedbackType: 'error',
      }
    }

    if (sum === target) {
      puzzle.solved = true
      puzzle.status = 'solved'
      puzzle.statusMessageAr = `مكتمل (${sum}/${target} ${unit})`
      for (const gate of stage.gates) {
        if (gate.id === puzzle.targetGateId) gate.isOpen = true
      }
      if (puzzle.unlocksPlatformId) {
        const p = stage.platforms.find((pl) => pl.id === puzzle.unlocksPlatformId)
        if (p) {
          p.unlocked = true
          p.isSecret = false
        }
      }
      return {
        puzzleSolvedNow: true,
        overloadTripped: false,
        teleportedTo,
        reversedPlatformId,
        feedbackMessageAr: `⚡ أحسنت! اكتمل توازن «${puzzle.titleAr}» (${sum}/${target} ${unit}) وفتحت البوابة!`,
        feedbackType: 'success',
      }
    }

    puzzle.status = 'active'
    puzzle.statusMessageAr = `الحمل الحالي: ${sum} / ${target} ${unit}`
    return {
      puzzleSolvedNow: false,
      overloadTripped: false,
      teleportedTo,
      reversedPlatformId,
      feedbackMessageAr: `🔌 ${clickedSwitch.labelAr}: الحمل الحالي ${sum} / ${target} ${unit}`,
      feedbackType: 'info',
    }
  }

  // 2. COUPLED XOR MATRIX RULE (Smart Grid / Magnetic Interlock)
  if (puzzle.ruleKind === 'coupled_xor_matrix') {
    clickedSwitch.activated = !clickedSwitch.activated
    if (Array.isArray(clickedSwitch.coupledSwitchIds)) {
      for (const coupledId of clickedSwitch.coupledSwitchIds) {
        const targetSw = puzzleSwitches.find((s) => s.id === coupledId)
        if (targetSw) {
          targetSw.activated = !targetSw.activated
        }
      }
    }
    const activeCount = puzzleSwitches.filter((s) => s.activated).length
    if (activeCount === puzzleSwitches.length) {
      puzzle.solved = true
      puzzle.status = 'solved'
      puzzle.statusMessageAr = `جميع الوحدات متزامنة (${activeCount}/${puzzleSwitches.length})`
      for (const gate of stage.gates) {
        if (gate.id === puzzle.targetGateId) gate.isOpen = true
      }
      return {
        puzzleSolvedNow: true,
        overloadTripped: false,
        teleportedTo,
        reversedPlatformId,
        feedbackMessageAr: `🔓 رائع! انتظمت مصفوفة «${puzzle.titleAr}» بالكامل وفتحت البوابة!`,
        feedbackType: 'success',
      }
    }
    puzzle.status = 'active'
    puzzle.statusMessageAr = `الوحدات النشطة: ${activeCount} / ${puzzleSwitches.length}`
    return {
      puzzleSolvedNow: false,
      overloadTripped: false,
      teleportedTo,
      reversedPlatformId,
      feedbackMessageAr: `🔄 تبديل ${clickedSwitch.nodeCode || clickedSwitch.labelAr} — الوحدات النشطة الآن: ${activeCount}/${puzzleSwitches.length}`,
      feedbackType: 'info',
    }
  }

  // 3. ORDERED SEQUENCE & DEPENDENCY CHAIN RULES
  const expectedOrder = (puzzle.currentStep || 0) + 1
  const swOrder = clickedSwitch.sequenceOrder || 1

  if (clickedSwitch.activated) {
    return {
      puzzleSolvedNow: false,
      overloadTripped: false,
      teleportedTo,
      reversedPlatformId,
      feedbackMessageAr: `ℹ️ ${clickedSwitch.labelAr} مفعّل بالفعل (${puzzle.currentStep || 0}/${puzzle.totalSteps || puzzleSwitches.length})`,
      feedbackType: 'info',
    }
  }

  if (swOrder === expectedOrder) {
    clickedSwitch.activated = true
    puzzle.currentStep = expectedOrder
    const total = puzzle.totalSteps || puzzleSwitches.length
    if (expectedOrder >= total) {
      puzzle.solved = true
      puzzle.status = 'solved'
      puzzle.statusMessageAr = `اكتمل التسلسل (${total}/${total})`
      for (const gate of stage.gates) {
        if (gate.id === puzzle.targetGateId) gate.isOpen = true
      }
      if (puzzle.unlocksPlatformId) {
        const p = stage.platforms.find((pl) => pl.id === puzzle.unlocksPlatformId)
        if (p) {
          p.unlocked = true
          p.isSecret = false
        }
      }
      return {
        puzzleSolvedNow: true,
        overloadTripped: false,
        teleportedTo,
        reversedPlatformId,
        feedbackMessageAr: `🏆 ممتاز! اكتمل تسلسل «${puzzle.titleAr}» بنجاح وفتحت البوابة!`,
        feedbackType: 'success',
      }
    }
    puzzle.status = 'active'
    puzzle.statusMessageAr = `الخطوة ${expectedOrder} / ${total}`
    return {
      puzzleSolvedNow: false,
      overloadTripped: false,
      teleportedTo,
      reversedPlatformId,
      feedbackMessageAr: `✓ خطوة صحيحة (${expectedOrder}/${total}): ${clickedSwitch.labelAr}`,
      feedbackType: 'info',
    }
  } else {
    // Out-of-order activation: reset this puzzle's sequence cleanly (no permanent soft lock!)
    for (const s of puzzleSwitches) s.activated = false
    puzzle.currentStep = 0
    puzzle.status = 'overload_reset'
    puzzle.statusMessageAr = `ترتيب غير صحيح! ابدأ بالخطوة 1.`
    return {
      puzzleSolvedNow: false,
      overloadTripped: true,
      teleportedTo,
      reversedPlatformId,
      feedbackMessageAr: `⚠️ تسلسل خاطئ! أُعيد ضبط «${puzzle.titleAr}» — يجب البدء بالخطوة (1) بالترتيب.`,
      feedbackType: 'error',
    }
  }
}

export interface PuzzleValidationReport {
  stageId: string
  puzzleId: string
  titleAr: string
  ruleKind: PuzzleRuleKind
  solvableFromInitial: boolean
  shortestSolutionMoves: string[]
  reachableStateCount: number
  softLockStatesFound: number
}

/**
 * V15 SECTION 15 — AUTOMATED BFS STATE-SPACE SOLVABILITY & NO-SOFT-LOCK VALIDATOR
 * Proves mathematically via Breadth-First Search that:
 * 1. A valid sequence of switch actions reaches the goal state (solved === true).
 * 2. Every reachable state after any incorrect action can still reach the goal state (0 soft locks).
 */
export function validateStagePuzzleSolvability(
  stageTemplate: StageDefinition,
  puzzleId: string
): PuzzleValidationReport {
  const basePuzzle = stageTemplate.puzzles?.find((p) => p.id === puzzleId)
  if (!basePuzzle) {
    throw new Error(`Puzzle ${puzzleId} not found in stage ${stageTemplate.id}`)
  }
  const swIds = stageTemplate.switches.filter((s) => s.puzzleId === puzzleId).map((s) => s.id)

  interface SearchNode {
    activeMap: Record<string, boolean>
    currentStep: number
    solved: boolean
    path: string[]
  }

  const encodeNode = (n: SearchNode) =>
    `${swIds.map((id) => (n.activeMap[id] ? '1' : '0')).join('')}:${n.currentStep}:${n.solved ? 'S' : 'U'}`

  const simulateMove = (node: SearchNode, clickSwId: string): SearchNode => {
    const tempStage: StageDefinition = {
      ...stageTemplate,
      gates: stageTemplate.gates.map((g) => ({ ...g })),
      platforms: stageTemplate.platforms.map((p) => ({ ...p })),
      switches: stageTemplate.switches.map((s) => ({
        ...s,
        activated: s.puzzleId === puzzleId ? Boolean(node.activeMap[s.id]) : s.activated,
      })),
      puzzles: stageTemplate.puzzles?.map((p) =>
        p.id === puzzleId
          ? {
              ...p,
              currentStep: node.currentStep,
              solved: node.solved,
              status: node.solved ? 'solved' : 'active',
            }
          : { ...p }
      ),
    }
    const targetSw = tempStage.switches.find((s) => s.id === clickSwId)!
    evaluatePuzzleSwitchInteraction(tempStage, targetSw)
    const updatedPuzzle = tempStage.puzzles!.find((p) => p.id === puzzleId)!
    const nextMap: Record<string, boolean> = {}
    for (const id of swIds) {
      nextMap[id] = Boolean(tempStage.switches.find((s) => s.id === id)?.activated)
    }
    return {
      activeMap: nextMap,
      currentStep: updatedPuzzle.currentStep || 0,
      solved: updatedPuzzle.solved,
      path: [...node.path, clickSwId],
    }
  }

  const initialMap: Record<string, boolean> = {}
  for (const id of swIds) initialMap[id] = false
  const root: SearchNode = {
    activeMap: initialMap,
    currentStep: 0,
    solved: false,
    path: [],
  }

  const visited = new Map<string, SearchNode>()
  const queue: SearchNode[] = [root]
  visited.set(encodeNode(root), root)
  let shortestSolution: string[] | null = null

  while (queue.length > 0) {
    const curr = queue.shift()!
    if (curr.solved) {
      if (!shortestSolution) shortestSolution = curr.path
      continue
    }
    for (const swId of swIds) {
      const next = simulateMove(curr, swId)
      const key = encodeNode(next)
      if (!visited.has(key)) {
        visited.set(key, next)
        queue.push(next)
      }
    }
  }

  // Verify that EVERY reachable state can still reach a solved state (no soft locks)
  let softLockStatesFound = 0
  for (const [, startNode] of visited.entries()) {
    if (startNode.solved) continue
    const subVisited = new Set<string>([encodeNode(startNode)])
    const subQ: SearchNode[] = [startNode]
    let canSolve = false
    while (subQ.length > 0) {
      const n = subQ.shift()!
      if (n.solved) {
        canSolve = true
        break
      }
      for (const swId of swIds) {
        const nxt = simulateMove(n, swId)
        const k = encodeNode(nxt)
        if (!subVisited.has(k)) {
          subVisited.add(k)
          subQ.push(nxt)
        }
      }
    }
    if (!canSolve) softLockStatesFound++
  }

  return {
    stageId: stageTemplate.id,
    puzzleId,
    titleAr: basePuzzle.titleAr,
    ruleKind: basePuzzle.ruleKind,
    solvableFromInitial: shortestSolution !== null,
    shortestSolutionMoves: shortestSolution || [],
    reachableStateCount: visited.size,
    softLockStatesFound,
  }
}

export function validateAllStagePuzzlesSolvability(): PuzzleValidationReport[] {
  const reports: PuzzleValidationReport[] = []
  for (const stage of GAME_STAGES) {
    for (const puz of stage.puzzles || []) {
      reports.push(validateStagePuzzleSolvability(stage, puz.id))
    }
  }
  return reports
}

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
// SECTION 14 & V13 SECTION 19 — SAFE DATA MIGRATION & PROGRESSION ENGINE
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
    titleAr: 'شرارة مدينة النور',
    descAr: 'هزيمة حارس الشارع المدرع وإتمام المرحلة الأولى (مدينة النور)',
    icon: '💡',
  },
  {
    id: 'wire_collector',
    titleAr: 'بطل فرع البيضاء البرتقالي',
    descAr: 'هزيمة الساحق البرتقالي العملاق في المرحلة الثانية (الإنارة فرع البيضاء)',
    icon: '🧡',
  },
  {
    id: 'security_master',
    titleAr: 'قائد مصنع الإنارة',
    descAr: 'هزيمة سيد المصنع الآلي وإتمام المرحلة الثالثة (مصنع الإنارة)',
    icon: '⚙️',
  },
  {
    id: 'blackout_savior',
    titleAr: 'فارس فرع الليثي الأزرق',
    descAr: 'هزيمة الحارس الأزرق المدرع وإتمام المرحلة الرابعة (الإنارة فرع الليثي)',
    icon: '💙',
  },
  {
    id: 'legendary_bulb',
    titleAr: 'بطل الإنارة الأسطوري',
    descAr: 'هزيمة نواة الظلام في قلعة الظلام وإتمام المراحل الخمس كاملة',
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
  integrityHash?: string
}

export const PROGRESSION_STORAGE_KEY = 'enarah_light_hero_progression_v13'
export const LEGACY_V12_ARCHIVE_KEY = 'enarah_light_hero_progression_v12_archive'

export function computeProgressionChecksum(
  unlockedStageIndex: number,
  completedStageIds: string[]
): string {
  const sorted = [...completedStageIds].sort().join(',')
  const payload = `enarah_v13_prog:${unlockedStageIndex}:${sorted}`
  let h = 2166136261
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

/**
 * Enforces strict sequential stage unlocking across the 5 main levels:
 * Stage 1 (index 0) is unlocked by default.
 * Stage N+1 (index N) unlocks ONLY if all stages 0..N-1 are in completedStageIds.
 */
export function computeSequentialUnlockedIndex(completedStageIds: string[]): number {
  const set = new Set(completedStageIds)
  let highestUnlocked = 0
  for (let i = 0; i < GAME_STAGES.length - 1; i++) {
    if (set.has(GAME_STAGES[i].id)) {
      highestUnlocked = i + 1
    } else {
      break
    }
  }
  return Math.min(GAME_STAGES.length - 1, highestUnlocked)
}

export function getDefaultProgression(): PlayerProgressionState {
  const completedStageIds: string[] = []
  return {
    version: 13,
    unlockedStageIndex: 0,
    completedStageIds,
    bestStageScores: {},
    bestStageTimesSec: {},
    stageStarsEarned: {},
    totalCollectedEnergy: 0,
    productCounts: {},
    achievements: [],
    doubleJumpUnlocked: true,
    dashUnlocked: true,
    reducedMotion: false,
    integrityHash: computeProgressionChecksum(0, completedStageIds),
  }
}

export function loadPlayerProgression(): PlayerProgressionState {
  if (typeof window === 'undefined') return getDefaultProgression()
  try {
    // V13 Section 19: Safe non-destructive migration of legacy 8-stage progression records
    const legacyV2 = localStorage.getItem('enarah_light_hero_progression_v2')
    const legacyV1 = localStorage.getItem('enarah_light_hero_progression_v1')
    if ((legacyV2 || legacyV1) && !localStorage.getItem(LEGACY_V12_ARCHIVE_KEY)) {
      try {
        localStorage.setItem(LEGACY_V12_ARCHIVE_KEY, legacyV2 || legacyV1 || '')
      } catch {}
    }

    const raw = localStorage.getItem(PROGRESSION_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') return getDefaultProgression()
      const defaults = getDefaultProgression()
      const rawCompleted: string[] = Array.isArray(parsed.completedStageIds)
        ? parsed.completedStageIds.filter((id: unknown) => typeof id === 'string')
        : []
      // Enforce sequential completion prefix so skipping stages via localStorage tampering is rejected
      const validSequentialCompleted: string[] = []
      for (let i = 0; i < GAME_STAGES.length; i++) {
        if (rawCompleted.includes(GAME_STAGES[i].id)) {
          validSequentialCompleted.push(GAME_STAGES[i].id)
        } else {
          break
        }
      }
      const maxSequentialUnlocked = computeSequentialUnlockedIndex(validSequentialCompleted)
      const rawUnlocked = Number(parsed.unlockedStageIndex)
      let safeUnlocked = Math.min(
        maxSequentialUnlocked,
        Math.max(0, Number.isFinite(rawUnlocked) ? Math.floor(rawUnlocked) : 0)
      )
      // Verify integrityHash if present; if tampered (e.g. unlockedStageIndex inflated without checksum), clamp to valid sequential
      if (typeof parsed.integrityHash === 'string') {
        const expected = computeProgressionChecksum(rawUnlocked, rawCompleted)
        if (parsed.integrityHash !== expected) {
          safeUnlocked = maxSequentialUnlocked
        }
      }
      return {
        ...defaults,
        version: 13,
        unlockedStageIndex: safeUnlocked,
        completedStageIds: validSequentialCompleted,
        bestStageScores:
          parsed.bestStageScores && typeof parsed.bestStageScores === 'object' && !Array.isArray(parsed.bestStageScores)
            ? parsed.bestStageScores
            : {},
        bestStageTimesSec:
          parsed.bestStageTimesSec && typeof parsed.bestStageTimesSec === 'object' && !Array.isArray(parsed.bestStageTimesSec)
            ? parsed.bestStageTimesSec
            : {},
        stageStarsEarned:
          parsed.stageStarsEarned && typeof parsed.stageStarsEarned === 'object' && !Array.isArray(parsed.stageStarsEarned)
            ? parsed.stageStarsEarned
            : {},
        totalCollectedEnergy: Number.isFinite(Number(parsed.totalCollectedEnergy))
          ? Math.max(0, Math.floor(Number(parsed.totalCollectedEnergy)))
          : 0,
        productCounts:
          parsed.productCounts && typeof parsed.productCounts === 'object' && !Array.isArray(parsed.productCounts)
            ? parsed.productCounts
            : {},
        achievements: Array.isArray(parsed.achievements)
          ? parsed.achievements.filter((a: unknown) => typeof a === 'string')
          : [],
        doubleJumpUnlocked: true,
        dashUnlocked: true,
        reducedMotion: Boolean(parsed.reducedMotion),
        integrityHash: computeProgressionChecksum(safeUnlocked, validSequentialCompleted),
      }
    } else {
      const freshDefaults = getDefaultProgression()
      savePlayerProgression(freshDefaults)
      return freshDefaults
    }
  } catch {}
  return getDefaultProgression()
}

export function savePlayerProgression(state: PlayerProgressionState): void {
  if (typeof window === 'undefined') return
  try {
    const validCompleted: string[] = []
    for (let i = 0; i < GAME_STAGES.length; i++) {
      if (state.completedStageIds.includes(GAME_STAGES[i].id)) {
        validCompleted.push(GAME_STAGES[i].id)
      } else {
        break
      }
    }
    const maxUnlocked = computeSequentialUnlockedIndex(validCompleted)
    const safeUnlocked = Math.min(maxUnlocked, Math.max(0, state.unlockedStageIndex))
    const signedState: PlayerProgressionState = {
      ...state,
      version: 13,
      unlockedStageIndex: safeUnlocked,
      completedStageIds: validCompleted,
      integrityHash: computeProgressionChecksum(safeUnlocked, validCompleted),
    }
    localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(signedState))
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
  // Only allow completing stageIndex if all previous stages 0..stageIndex-1 are completed
  let canUnlockSequential = true
  for (let i = 0; i < stageIndex; i++) {
    if (!completedSet.has(GAME_STAGES[i].id)) {
      canUnlockSequential = false
      break
    }
  }
  if (canUnlockSequential) {
    completedSet.add(stageId)
  }

  const completedArray = Array.from(completedSet)
  const sequentialUnlocked = computeSequentialUnlockedIndex(completedArray)

  const prevBest = current.bestStageScores[stageId] || 0
  const prevStars = current.stageStarsEarned[stageId] || 0
  const prevTime = current.bestStageTimesSec[stageId] || 9999

  const updatedCounts = { ...current.productCounts }
  for (const k of collectedKinds) {
    updatedCounts[k] = (updatedCounts[k] || 0) + 1
  }

  const totalProducts = current.totalCollectedEnergy + Math.max(0, energyCollected)
  const achSet = new Set(current.achievements)
  if (stageIndex >= 0 && canUnlockSequential) achSet.add('first_light')
  if (stageIndex >= 1 && canUnlockSequential) achSet.add('wire_collector')
  if (stageIndex >= 2 && canUnlockSequential) achSet.add('security_master')
  if (stageIndex >= 3 && canUnlockSequential) achSet.add('blackout_savior')
  if (stageIndex >= 4 && canUnlockSequential) achSet.add('legendary_bulb')

  const nextState: PlayerProgressionState = {
    ...current,
    version: 13,
    unlockedStageIndex: sequentialUnlocked,
    completedStageIds: completedArray,
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
    integrityHash: computeProgressionChecksum(sequentialUnlocked, completedArray),
  }

  savePlayerProgression(nextState)
  return nextState
}

// ============================================================================
// SECTION 15 — 5-MINUTE SESSION EXPIRY & LIFECYCLE STATE MACHINE (V12)
// ============================================================================

export const SESSION_TIMEOUT_MS = 5 * 60 * 1000
export const SESSION_STORAGE_KEY = 'enarah_light_hero_session_v12'
export const SESSION_EXPIRED_MESSAGE_AR = 'انتهت جلستك، ابدأ مغامرة جديدة!'

export type SessionLifecycleState =
  | 'ACTIVE'
  | 'BACKGROUND'
  | 'RESUMABLE'
  | 'EXPIRED'
  | 'NEW_RUN'

export interface ActiveRunSnapshot {
  stageIndex: number
  gameState: 'start' | 'playing' | 'paused' | 'stage_clear' | 'victory' | 'gameover'
  heroX: number
  heroY: number
  respawnX: number
  respawnY: number
  hp: number
  lightEnergy: number
  stageScore: number
  totalCampaignScore: number
  collectedIds: string[]
  activatedSwitchIds: string[]
  activatedCheckpointIds: string[]
  defeatedEnemyIds: string[]
  solvedPuzzleIds?: string[]
  bossHp?: number
  bossPhase?: 1 | 2 | 3 | 4
  elapsedSec: number
}

export interface GameSessionState {
  sessionId: string
  lifecycleState: SessionLifecycleState
  sessionStartedAt: number
  lastActiveAt: number
  departedAt: number | null
  currentStageIndex: number
  unlockedStagesForRun: number
  snapshot: ActiveRunSnapshot | null
  checksum: string
}

export function isSessionExpired(lastActiveAt: number, now: number): boolean {
  if (!Number.isFinite(lastActiveAt) || lastActiveAt <= 0) return false
  if (!Number.isFinite(now) || now <= 0) return false
  return now - lastActiveAt >= SESSION_TIMEOUT_MS
}

export function computeSessionChecksum(
  sessionId: string,
  lastActiveAt: number,
  departedAt: number | null,
  currentStageIndex: number,
  unlockedStagesForRun: number
): string {
  const payload = `enarah_sess_v12:${sessionId}:${Math.floor(lastActiveAt)}:${departedAt ? Math.floor(departedAt) : 0}:${currentStageIndex}:${unlockedStagesForRun}`
  let h = 2166136261
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

export function createNewGameSession(now = Date.now()): GameSessionState {
  const sessionId = `sess_${now}_${Math.random().toString(36).slice(2, 8)}`
  return {
    sessionId,
    lifecycleState: 'NEW_RUN',
    sessionStartedAt: now,
    lastActiveAt: now,
    departedAt: null,
    currentStageIndex: 0,
    unlockedStagesForRun: 0,
    snapshot: null,
    checksum: computeSessionChecksum(sessionId, now, null, 0, 0),
  }
}

export function loadGameSessionState(): GameSessionState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || typeof parsed.sessionId !== 'string') {
      return null
    }
    const lastActiveAt = Number(parsed.lastActiveAt)
    const departedAt = parsed.departedAt !== null && parsed.departedAt !== undefined ? Number(parsed.departedAt) : null
    const currentStageIndex = Math.max(0, Math.min(GAME_STAGES.length - 1, Math.floor(Number(parsed.currentStageIndex) || 0)))
    const unlockedStagesForRun = Math.max(0, Math.min(GAME_STAGES.length - 1, Math.floor(Number(parsed.unlockedStagesForRun) || 0)))
    if (!Number.isFinite(lastActiveAt) || lastActiveAt <= 0) return null

    return {
      sessionId: parsed.sessionId,
      lifecycleState: parsed.lifecycleState || 'ACTIVE',
      sessionStartedAt: Number(parsed.sessionStartedAt) || lastActiveAt,
      lastActiveAt,
      departedAt: departedAt && Number.isFinite(departedAt) ? departedAt : null,
      currentStageIndex,
      unlockedStagesForRun,
      snapshot: parsed.snapshot && typeof parsed.snapshot === 'object' ? parsed.snapshot : null,
      checksum:
        typeof parsed.checksum === 'string'
          ? parsed.checksum
          : computeSessionChecksum(parsed.sessionId, lastActiveAt, departedAt, currentStageIndex, unlockedStagesForRun),
    }
  } catch {
    return null
  }
}

export function saveGameSessionState(session: GameSessionState): void {
  if (typeof window === 'undefined') return
  try {
    const signed: GameSessionState = {
      ...session,
      checksum: computeSessionChecksum(
        session.sessionId,
        session.lastActiveAt,
        session.departedAt,
        session.currentStageIndex,
        session.unlockedStagesForRun
      ),
    }
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(signed))
  } catch {}
}

/**
 * Resets only the current run's stage progression, temporary score, energy,
 * hearts, checkpoint, boss state, and temporary collectibles while preserving
 * all Weekly Leaderboard records, player identity, and reducedMotion settings.
 */
export function clearRunProgressionForExpiredSession(
  currentProgression: PlayerProgressionState,
  now = Date.now()
): { nextProgression: PlayerProgressionState; nextSession: GameSessionState } {
  const nextProgression: PlayerProgressionState = {
    ...currentProgression,
    unlockedStageIndex: 0,
    completedStageIds: [],
    totalCollectedEnergy: 0,
    productCounts: {},
    integrityHash: computeProgressionChecksum(0, []),
  }
  savePlayerProgression(nextProgression)
  const nextSession = createNewGameSession(now)
  saveGameSessionState(nextSession)
  return { nextProgression, nextSession }
}
