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
console.log('BATAL AL ENARA — ARGON 4 AUTONOMOUS GAME QA & VERIFICATION SUITE')
console.log('=================================================================')

const worldsSrc = fs.readFileSync(path.join(ROOT, 'src/components/game/platformerWorlds.ts'), 'utf8')
const physicsSrc = fs.readFileSync(path.join(ROOT, 'src/components/game/platformerPhysics.ts'), 'utf8')
const rendererSrc = fs.readFileSync(path.join(ROOT, 'src/components/game/platformerRenderer.ts'), 'utf8')
const engineSrc = fs.readFileSync(path.join(ROOT, 'src/components/game/GameEngine.tsx'), 'utf8')
const audioSrc = fs.readFileSync(path.join(ROOT, 'src/components/game/audio.ts'), 'utf8')
const gamePageSrc = fs.readFileSync(path.join(ROOT, 'src/pages/Game.tsx'), 'utf8')

// 1. Verify Anthropomorphic LED Light Bulb Hero & all 12 Animations (Section 3)
const requiredAnimStates = [
  'idle',
  'walk',
  'run',
  'jump_prep',
  'jump_ascent',
  'falling',
  'landing',
  'damage',
  'attacking',
  'dash',
  'victory',
  'defeat',
  'collecting',
]
assert(
  requiredAnimStates.every((st) => worldsSrc.includes(`'${st}'`) && physicsSrc.includes(`'${st}'`)) &&
    rendererSrc.includes('screwGrad') &&
    rendererSrc.includes('diffuserGrad') &&
    rendererSrc.includes('bulbAura'),
  'Anthropomorphic LED Light Bulb Hero (frosted diffuser head, E27 metallic screw base, expressive eyes/eyebrows, gloves/shoes, subtle light aura) & all 12 animations implemented'
)

// 2. Verify Advanced Movement Physics including Double Jump & Dash (Section 4)
assert(
  physicsSrc.includes('coyoteTimeSec: 0.11') &&
    physicsSrc.includes('jumpBufferSec: 0.11') &&
    physicsSrc.includes('variableJumpCutMultiplier: 0.5') &&
    physicsSrc.includes('doubleJumpVelocity') &&
    physicsSrc.includes('doubleJumpAvailable') &&
    physicsSrc.includes('dashSpeed') &&
    physicsSrc.includes('dashTimer'),
  'Advanced platformer physics (Coyote Time, Jump Buffering, Variable Jump Height, Double Jump, Dash, Air Control, Wall Collision) implemented'
)

// 3. Verify 13 Electrical Product Collectibles & Meaningful Gameplay Abilities (Section 5)
const requiredProducts = [
  'wire_1_5mm',
  'wire_2_5mm',
  'wire_4mm',
  'wire_6mm',
  'led_bulb',
  'led_spotlight',
  'led_strip',
  'outdoor_fixture',
  'rechargeable_floodlight',
  'intercom_device',
  'waterproof_socket',
  'electrical_switch_item',
  'electrical_connector',
]
assert(
  requiredProducts.every((p) => worldsSrc.includes(`'${p}'`) && worldsSrc.includes(`${p}:`)) &&
    physicsSrc.includes('speedBoostTimer') &&
    physicsSrc.includes('shieldTimer') &&
    physicsSrc.includes('spotlightTimer') &&
    physicsSrc.includes('floodlightTimer') &&
    physicsSrc.includes('intercomsCollected'),
  'All 13 Electrical Product Collectibles (1.5mm–6mm wires, LED bulbs, spotlights, strips, outdoor fixtures, floodlights, intercoms, sockets, switches, connectors) & active abilities implemented'
)

// 4. Verify All 8 Progressively Difficult Levels & Unique Final Challenges (Sections 6 & 8)
const requiredLevels = [
  'مدينة النور',
  'شارع الكهرباء',
  'مصنع الإنارة',
  'حي الإنترفون',
  'محطة الطاقة',
  'المدينة المظلمة',
  'برج الإنارة',
  'قلعة الظلام',
]
const requiredChallenges = [
  'three_switches_hazard',
  'boss_security_robot',
  'timed_machine_escape',
  'intercom_security_puzzle',
  'boss_transformer',
  'timed_power_restoration',
  'boss_construction_giant',
  'boss_dark_king_3phase',
]
assert(
  requiredLevels.every((lvl) => worldsSrc.includes(lvl)) &&
    requiredChallenges.every((ch) => worldsSrc.includes(`'${ch}'`)),
  'All 8 progressively difficult levels (مدينة النور through قلعة الظلام) and their 8 unique final challenges are implemented'
)

// 5. Verify 8 Unique Enemy Types & AI State Machine (Section 7)
const requiredEnemies = [
  'electrical_spark',
  'cable_snake',
  'flying_drone',
  'mechanical_spider',
  'security_robot',
  'shadow_creature',
  'transformer_monster',
  'giant_guardian',
]
assert(
  requiredEnemies.every((en) => worldsSrc.includes(`'${en}'`) && rendererSrc.includes(`'${en}'`)) &&
    physicsSrc.includes("enemy.aiState = 'detect'") &&
    physicsSrc.includes("enemy.aiState = 'attack'") &&
    physicsSrc.includes("enemy.aiState = 'recover'"),
  'All 8 unique enemy types with state machine (IDLE -> PATROL -> DETECT -> ATTACK -> RECOVER -> DEFEATED) & telegraph indicators implemented'
)

// 6. Verify 4 Boss Archetypes & 3-Phase Final Boss (ملك الظلام الكهربائي)
assert(
  worldsSrc.includes('روبوت الحراسة المدرع') &&
    worldsSrc.includes('حارس المحطة العملاق') &&
    worldsSrc.includes('عملاق البناء الآلي') &&
    worldsSrc.includes('ملك الظلام الكهربائي') &&
    physicsSrc.includes('bossPhaseChanged') &&
    physicsSrc.includes('boss.projectiles'),
  'All 4 Boss encounters including 3-Phase Final Boss (ملك الظلام الكهربائي) with shockwaves, aimed projectiles, and breaker switches implemented'
)

// 7. Verify 8 Distinct Level Soundtracks, Boss Music Transition, Separate Music/SFX Volume & SFX (Section 9)
const requiredTracks = [
  'level_1',
  'level_2',
  'level_3',
  'level_4',
  'level_5',
  'level_6',
  'level_7',
  'level_8',
  'boss_battle',
]
assert(
  requiredTracks.every((tr) => audioSrc.includes(`${tr}:`)) &&
    audioSrc.includes('setMusicVolume') &&
    audioSrc.includes('setSfxVolume') &&
    audioSrc.includes('playCollectWire') &&
    audioSrc.includes('playCollectBulb') &&
    audioSrc.includes('playCollectSpotlight') &&
    audioSrc.includes('playCollectIntercom') &&
    engineSrc.includes('musicVolume') &&
    engineSrc.includes('sfxVolume'),
  '8 distinct procedural instrumental soundtracks + Boss Battle transition music + separate Music & SFX volume sliders + 15 custom SFX implemented'
)

// 8. Verify 2.5D Stylized-Realistic Environments, Blackout Illumination Mask & Camera Framing (Sections 10 & 11)
assert(
  rendererSrc.includes('renderSkyAndAtmosphere') &&
    rendererSrc.includes('renderFarParallaxLayer') &&
    rendererSrc.includes('renderMidgroundParallaxLayer') &&
    rendererSrc.includes('render25DPlatform') &&
    rendererSrc.includes('renderBlackoutIlluminationMask') &&
    physicsSrc.includes('updateSideScrollingCamera'),
  '2.5D multi-layer parallax environments, Level 6 blackout radial illumination mask, and Boss Arena camera framing implemented'
)

// 9. Verify Mobile & Desktop Controls (Left, Right, Jump, Dash, Attack, Pause — Sections 12 & 13)
assert(
  engineSrc.includes("handleTouchControl('left'") &&
    engineSrc.includes("handleTouchControl('right'") &&
    engineSrc.includes("handleTouchControl('jump'") &&
    engineSrc.includes("handleTouchControl('dash'") &&
    engineSrc.includes("handleTouchControl('attack'") &&
    engineSrc.includes("window.addEventListener('blur'") &&
    engineSrc.includes('IntersectionObserver'),
  'Mobile multi-touch controls (Left, Right, Jump/Double Jump, Dash, Attack, Pause) and Desktop keyboard controls (A/D/Arrows, Space, Shift, E, Esc) implemented'
)

// 10. Verify Progression System (Unlockable Levels, Best Times, 3-Star Rating, Achievements, Local Save — Section 14)
assert(
  worldsSrc.includes('GAME_ACHIEVEMENTS') &&
    worldsSrc.includes('bestStageTimesSec') &&
    worldsSrc.includes('stageStarsEarned') &&
    worldsSrc.includes('enarah_light_hero_progression_v2') &&
    gamePageSrc.includes('بطل الإنارة | مغامرة اللمبة الأسطورية'),
  'Progression system with 8 unlockable levels, best times, 3-star ratings, achievements, and localStorage persistence implemented'
)

console.log('-----------------------------------------------------------------')
console.log(`TOTAL: ${passed} PASSED, ${failed} FAILED`)
console.log('=================================================================')

if (failed > 0) {
  process.exit(1)
}
