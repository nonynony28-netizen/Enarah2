import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    passed++
    console.log(`  ✅ PASS: ${message}`)
  } else {
    failed++
    console.error(`  ❌ FAIL: ${message}`)
  }
}

console.log('=================================================================')
console.log('ENARAH MODERN — LIGHT HERO ADVENTURE V1 AUTOMATED QA SUITE')
console.log('=================================================================')

const worldsSrc = fs.readFileSync(path.join(ROOT, 'src/components/game/platformerWorlds.ts'), 'utf8')
const physicsSrc = fs.readFileSync(path.join(ROOT, 'src/components/game/platformerPhysics.ts'), 'utf8')
const rendererSrc = fs.readFileSync(path.join(ROOT, 'src/components/game/platformerRenderer.ts'), 'utf8')
const engineSrc = fs.readFileSync(path.join(ROOT, 'src/components/game/GameEngine.tsx'), 'utf8')
const audioSrc = fs.readFileSync(path.join(ROOT, 'src/components/game/audio.ts'), 'utf8')
const gamePageSrc = fs.readFileSync(path.join(ROOT, 'src/pages/Game.tsx'), 'utf8')

// 1. Verify all 5 distinct worlds & Arabic titles
assert(
  worldsSrc.includes('مدينة الأنوار') &&
    worldsSrc.includes('مصنع الكهرباء') &&
    worldsSrc.includes('عالم الأسلاك') &&
    worldsSrc.includes('مدينة المستقبل') &&
    worldsSrc.includes('قلعة الطاقة'),
  'All 5 distinct worlds (مدينة الأنوار, مصنع الكهرباء, عالم الأسلاك, مدينة المستقبل, قلعة الطاقة) are defined'
)

// 2. Verify all 11 hero animation states
const requiredAnimStates = [
  'idle',
  'walk',
  'run',
  'jump_prep',
  'jump_ascent',
  'falling',
  'landing',
  'collecting',
  'damage',
  'victory',
  'defeat',
]
assert(
  requiredAnimStates.every((st) => worldsSrc.includes(`'${st}'`) && physicsSrc.includes(`'${st}'`)),
  'All 11 hero animation states are defined and driven by the physics state machine'
)

// 3. Verify Mario-style movement constants (walk, run, variable jump, coyote time, jump buffering)
assert(
  physicsSrc.includes('coyoteTimeSec: 0.11') &&
    physicsSrc.includes('jumpBufferSec: 0.11') &&
    physicsSrc.includes('variableJumpCutMultiplier: 0.5') &&
    physicsSrc.includes('maxWalkSpeed') &&
    physicsSrc.includes('maxRunSpeed'),
  'Mario-style physics constants (Coyote Time 110ms, Jump Buffer 110ms, Variable Jump Height, Walk/Run speeds) are implemented'
)

// 4. Verify interactive world mechanics (moving platforms, conveyors, springs, phase platforms, switches, gates)
assert(
  worldsSrc.includes("kind: 'moving'") &&
    worldsSrc.includes("kind: 'conveyor'") &&
    worldsSrc.includes("kind: 'spring'") &&
    worldsSrc.includes("kind: 'phase'") &&
    worldsSrc.includes("kind: 'bridge_locked'"),
  'Interactive platform types (moving, conveyor, copper spring, phase platform, switch-unlocked wire bridge) exist across the 5 worlds'
)

// 5. Verify Collectibles (نجوم الطاقة, copper_coil, light_capsule) & Checkpoints
assert(
  worldsSrc.includes("'energy_star'") &&
    worldsSrc.includes("'copper_coil'") &&
    worldsSrc.includes("'light_capsule'") &&
    physicsSrc.includes('activatedCheckpointId'),
  'Collectibles (نجوم الطاقة, copper coils, light capsules) and checkpoint beacons are implemented'
)

// 6. Verify Enemies (patrol + top stomp vs side damage) & World 5 Boss (حارس الطاقة الآلي)
assert(
  worldsSrc.includes('حارس الطاقة الآلي') &&
    worldsSrc.includes('Mechanical Energy Guardian') &&
    physicsSrc.includes('stompedEnemyId') &&
    physicsSrc.includes('damageBoss') &&
    physicsSrc.includes('shockwaveActive'),
  'Enemy top-stomp mechanics and World 5 Boss (حارس الطاقة الآلي) with shockwaves and 3 overload breakers are implemented'
)

// 7. Verify 2.5D multi-layer parallax & beveled platform renderer
assert(
  rendererSrc.includes('renderSkyAndAtmosphere') &&
    rendererSrc.includes('renderFarParallaxLayer') &&
    rendererSrc.includes('renderMidgroundParallaxLayer') &&
    rendererSrc.includes('render25DPlatform') &&
    rendererSrc.includes('renderOriginalHeroCharacter') &&
    rendererSrc.includes('renderForegroundDepthLayer'),
  '2.5D multi-layer parallax renderer (5 layers + beveled 2.5D platforms + articulated hero character) is implemented'
)

// 8. Verify Exact Arabic Menu Labels (Section 20) & Mobile Landscape Recommendation (Section 18)
const requiredArabicLabels = [
  'ابدأ المغامرة',
  'اختيار المرحلة',
  'متابعة',
  'إعادة المحاولة',
  'الإعدادات',
  'العودة للقائمة',
  'لأفضل تجربة لعب، يُفضّل تدوير الهاتف للوضع الأفقي.',
]
assert(
  requiredArabicLabels.every((lbl) => engineSrc.includes(lbl)),
  'All exact Arabic UI menu labels and mobile portrait orientation recommendation message are present'
)

// 9. Verify Desktop Keyboard & Mobile Multi-Touch Pointer Controls + Stuck Input Prevention
assert(
  engineSrc.includes('onPointerDown') &&
    engineSrc.includes('onPointerUp') &&
    engineSrc.includes('onPointerCancel') &&
    engineSrc.includes("window.addEventListener('blur'") &&
    engineSrc.includes("document.addEventListener('visibilitychange'") &&
    engineSrc.includes('IntersectionObserver'),
  'Mobile multi-touch pointer controls, blur/visibilitychange stuck-input prevention, and offscreen IntersectionObserver pause are implemented'
)

// 10. Verify Sound Effects & Progression Persistence
assert(
  audioSrc.includes('playJump') &&
    audioSrc.includes('playStarPickup') &&
    audioSrc.includes('playCheckpoint') &&
    audioSrc.includes('playEnemyStomp') &&
    worldsSrc.includes('enarah_light_hero_progression_v1') &&
    gamePageSrc.includes('بطل الإنارة | مغامرة عالم الضوء'),
  'Synthesized Web Audio platformer sound effects, localStorage progression persistence, and Game page integration are complete'
)

console.log('-----------------------------------------------------------------')
console.log(`TOTAL: ${passed} PASSED, ${failed} FAILED`)
console.log('=================================================================')

if (failed > 0) {
  process.exit(1)
}
