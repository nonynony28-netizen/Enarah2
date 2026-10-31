import {
  type StageDefinition,
  type HeroAnimState,
  type PlatformData
} from './platformerWorlds'

// ============================================================================
// MARIO-STYLE MOVEMENT & PHYSICS CONSTANTS (SECTION 07)
// ============================================================================

export const PHYSICS_CONFIG = {
  // Horizontal movement
  accelGround: 1750,
  accelAir: 1250,
  decelGround: 2200,
  decelAir: 480,
  skidDecel: 3400,
  maxWalkSpeed: 245,
  maxRunSpeed: 335,

  // Jumping & Gravity
  jumpVelocity: -595,
  springDefaultBoost: -770,
  stompBounceVelocity: -430,
  gravityUp: 1320,
  gravityFall: 2020,
  maxFallSpeed: 760,
  variableJumpCutMultiplier: 0.5,
  variableJumpMinVy: -175,

  // Advanced Game Feel (Coyote Time & Jump Buffering: 80–120ms)
  coyoteTimeSec: 0.11, // 110ms grace period after leaving platform edge
  jumpBufferSec: 0.11, // 110ms jump input buffer before landing

  // Hero collision box
  heroWidth: 34,
  heroHeight: 48
} as const

export interface HeroPhysicsState {
  x: number
  y: number
  w: number
  h: number
  vx: number
  vy: number
  facing: 'left' | 'right'
  onGround: boolean
  wasOnGround: boolean
  coyoteTimer: number
  jumpBufferTimer: number
  jumpHeld: boolean
  isRunning: boolean
  runHoldTimer: number
  animState: HeroAnimState
  animTimer: number
  walkCycle: number
  scaleX: number
  scaleY: number
  landingTimer: number
  collectAnimTimer: number
  damageTimer: number
  invincibleTimer: number
  hp: number
  maxHp: number
  respawnX: number
  respawnY: number
  standingPlatformId: string | null
}

export interface CameraState {
  x: number
  y: number
  viewportW: number
  viewportH: number
}

export interface PlayerInputFrame {
  left: boolean
  right: boolean
  run: boolean
  jumpPressed: boolean // true on the frame jump button was newly pressed
  jumpHeld: boolean // true while jump button is held down
  jumpReleased: boolean // true on the frame jump button was released
}

export interface StepSimulationEvents {
  jumped: boolean
  highJumped: boolean
  landed: boolean
  collectedStarIds: string[]
  collectedValue: number
  activatedCheckpointId: string | null
  activatedSwitchId: string | null
  openedGateId: string | null
  stompedEnemyId: string | null
  hitBoss: boolean
  bossDefeated: boolean
  tookDamage: boolean
  fellInPit: boolean
  stageCompleted: boolean
  stageDefeated: boolean
}

export function createInitialHeroState(stage: StageDefinition): HeroPhysicsState {
  return {
    x: stage.heroSpawn.x,
    y: stage.heroSpawn.y,
    w: PHYSICS_CONFIG.heroWidth,
    h: PHYSICS_CONFIG.heroHeight,
    vx: 0,
    vy: 0,
    facing: 'right',
    onGround: false,
    wasOnGround: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    jumpHeld: false,
    isRunning: false,
    runHoldTimer: 0,
    animState: 'idle',
    animTimer: 0,
    walkCycle: 0,
    scaleX: 1,
    scaleY: 1,
    landingTimer: 0,
    collectAnimTimer: 0,
    damageTimer: 0,
    invincibleTimer: 0.6,
    hp: 3,
    maxHp: 3,
    respawnX: stage.heroSpawn.x,
    respawnY: stage.heroSpawn.y,
    standingPlatformId: null
  }
}

export function aabbOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

export function isPlatformSolid(p: PlatformData): boolean {
  if (p.kind === 'bridge_locked' && !p.unlocked) return false
  if (p.kind === 'phase' && p.phaseState === 'phased_out') return false
  return true
}

/**
 * Advances one simulation step (dt in seconds, clamped to 1/20s for stability).
 */
export function stepPlatformerSimulation(
  hero: HeroPhysicsState,
  stage: StageDefinition,
  input: PlayerInputFrame,
  dtRaw: number,
  elapsedSec: number
): StepSimulationEvents {
  const dt = Math.min(0.05, Math.max(0.001, dtRaw))

  const events: StepSimulationEvents = {
    jumped: false,
    highJumped: false,
    landed: false,
    collectedStarIds: [],
    collectedValue: 0,
    activatedCheckpointId: null,
    activatedSwitchId: null,
    openedGateId: null,
    stompedEnemyId: null,
    hitBoss: false,
    bossDefeated: false,
    tookDamage: false,
    fellInPit: false,
    stageCompleted: false,
    stageDefeated: false
  }

  hero.wasOnGround = hero.onGround
  hero.animTimer += dt
  if (hero.invincibleTimer > 0) hero.invincibleTimer = Math.max(0, hero.invincibleTimer - dt)
  if (hero.damageTimer > 0) hero.damageTimer = Math.max(0, hero.damageTimer - dt)
  if (hero.landingTimer > 0) hero.landingTimer = Math.max(0, hero.landingTimer - dt)
  if (hero.collectAnimTimer > 0) hero.collectAnimTimer = Math.max(0, hero.collectAnimTimer - dt)

  // Smooth squash & stretch recovery
  hero.scaleX += (1 - hero.scaleX) * Math.min(1, dt * 14)
  hero.scaleY += (1 - hero.scaleY) * Math.min(1, dt * 14)

  // --------------------------------------------------------------------------
  // 1. UPDATE PLATFORMS (Moving platforms, Phase platforms, Springs)
  // --------------------------------------------------------------------------
  for (const p of stage.platforms) {
    p.dx = 0
    p.dy = 0

    if (p.kind === 'moving' && p.startX !== undefined && p.endX !== undefined) {
      const sy = p.startY ?? p.y
      const ey = p.endY ?? p.y
      const totalDist = Math.hypot(p.endX - p.startX, ey - sy)
      if (totalDist > 1) {
        const spd = p.speed || 90
        const cycle = (elapsedSec * spd) / totalDist
        // Smooth cosine ping-pong between start and end
        const t = (1 - Math.cos(cycle * Math.PI)) * 0.5
        const nextX = p.startX + (p.endX - p.startX) * t
        const nextY = sy + (ey - sy) * t
        p.dx = nextX - p.x
        p.dy = nextY - p.y
        p.x = nextX
        p.y = nextY
      }
    } else if (p.kind === 'phase') {
      if (p.phaseState === 'stepping') {
        p.phaseTimer = (p.phaseTimer || 0) + dt
        if (p.phaseTimer >= 1.15) {
          p.phaseState = 'phased_out'
          p.phaseTimer = 0
        }
      } else if (p.phaseState === 'phased_out') {
        p.phaseTimer = (p.phaseTimer || 0) + dt
        if (p.phaseTimer >= 2.2) {
          p.phaseState = 'ready'
          p.phaseTimer = 0
        }
      }
    } else if (p.kind === 'spring' && p.springCompress && p.springCompress > 0) {
      p.springCompress = Math.max(0, p.springCompress - dt * 4)
    }
  }

  // Carry hero with standing moving platform or conveyor belt
  if (hero.onGround && hero.standingPlatformId) {
    const standingPlat = stage.platforms.find((p) => p.id === hero.standingPlatformId)
    if (standingPlat && isPlatformSolid(standingPlat)) {
      if (standingPlat.dx) hero.x += standingPlat.dx
      if (standingPlat.dy) hero.y += standingPlat.dy
      if (standingPlat.kind === 'conveyor' && standingPlat.conveyorSpeed) {
        hero.x += standingPlat.conveyorSpeed * dt
      }
    }
  }

  // --------------------------------------------------------------------------
  // 2. HORIZONTAL MOVEMENT (Smooth Acceleration, Deceleration & Air Control)
  // --------------------------------------------------------------------------
  const moveDir = (input.right ? 1 : 0) - (input.left ? 1 : 0)

  if (moveDir !== 0) {
    hero.facing = moveDir > 0 ? 'right' : 'left'
    hero.runHoldTimer += dt
  } else {
    hero.runHoldTimer = 0
  }

  // Sprint when holding Run or after sustained movement (> 0.35s)
  hero.isRunning = moveDir !== 0 && (input.run || hero.runHoldTimer > 0.35)
  const targetMaxSpeed = hero.isRunning
    ? PHYSICS_CONFIG.maxRunSpeed
    : PHYSICS_CONFIG.maxWalkSpeed

  if (moveDir !== 0) {
    const isSkidding = hero.onGround && hero.vx !== 0 && Math.sign(hero.vx) !== moveDir
    const accel = isSkidding
      ? PHYSICS_CONFIG.skidDecel
      : hero.onGround
      ? PHYSICS_CONFIG.accelGround
      : PHYSICS_CONFIG.accelAir

    hero.vx += moveDir * accel * dt
    if (Math.abs(hero.vx) > targetMaxSpeed) {
      hero.vx = moveDir * targetMaxSpeed
    }
  } else {
    const decel = hero.onGround ? PHYSICS_CONFIG.decelGround : PHYSICS_CONFIG.decelAir
    if (Math.abs(hero.vx) <= decel * dt) {
      hero.vx = 0
    } else {
      hero.vx -= Math.sign(hero.vx) * decel * dt
    }
  }

  // --------------------------------------------------------------------------
  // 3. COYOTE TIME, JUMP BUFFERING & VARIABLE JUMP HEIGHT (SECTION 07)
  // --------------------------------------------------------------------------
  if (hero.onGround) {
    hero.coyoteTimer = PHYSICS_CONFIG.coyoteTimeSec
  } else {
    hero.coyoteTimer = Math.max(0, hero.coyoteTimer - dt)
  }

  if (input.jumpPressed) {
    hero.jumpBufferTimer = PHYSICS_CONFIG.jumpBufferSec
  } else {
    hero.jumpBufferTimer = Math.max(0, hero.jumpBufferTimer - dt)
  }

  // Execute Jump if Jump Buffer is active and (onGround OR within Coyote Time)
  if (hero.jumpBufferTimer > 0 && hero.coyoteTimer > 0) {
    const speedBonus = Math.abs(hero.vx) > 260 ? -28 : 0
    hero.vy = PHYSICS_CONFIG.jumpVelocity + speedBonus
    hero.onGround = false
    hero.coyoteTimer = 0
    hero.jumpBufferTimer = 0
    hero.jumpHeld = true
    hero.standingPlatformId = null
    hero.scaleX = 0.84
    hero.scaleY = 1.18
    events.jumped = true
  }

  // Variable Jump Height: Short tap cuts upward velocity smoothly
  if (input.jumpReleased || !input.jumpHeld) {
    if (hero.jumpHeld && hero.vy < PHYSICS_CONFIG.variableJumpMinVy) {
      hero.vy *= PHYSICS_CONFIG.variableJumpCutMultiplier
    }
    hero.jumpHeld = false
  }

  // Apply Gravity (lighter on ascent while holding jump, heavier on descent)
  const gravity =
    hero.vy < 0 && input.jumpHeld ? PHYSICS_CONFIG.gravityUp : PHYSICS_CONFIG.gravityFall
  hero.vy = Math.min(PHYSICS_CONFIG.maxFallSpeed, hero.vy + gravity * dt)

  // --------------------------------------------------------------------------
  // 4. INTEGRATE X & RESOLVE HORIZONTAL COLLISIONS (Gates & Stage Bounds)
  // --------------------------------------------------------------------------
  hero.x += hero.vx * dt
  if (hero.x < 16) {
    hero.x = 16
    hero.vx = 0
  }
  if (hero.x + hero.w > stage.width - 16) {
    hero.x = stage.width - 16 - hero.w
    hero.vx = 0
  }

  // Closed Energy Gates block horizontal passage
  for (const gate of stage.gates) {
    if (gate.isOpen) continue
    if (aabbOverlap(hero.x, hero.y, hero.w, hero.h, gate.x, gate.y, gate.w, gate.h)) {
      if (hero.vx > 0) {
        hero.x = gate.x - hero.w
        hero.vx = 0
      } else if (hero.vx < 0) {
        hero.x = gate.x + gate.w
        hero.vx = 0
      }
    }
  }

  // --------------------------------------------------------------------------
  // 5. INTEGRATE Y & RESOLVE PLATFORM COLLISIONS
  // --------------------------------------------------------------------------
  const prevBottom = hero.y + hero.h
  hero.y += hero.vy * dt
  hero.onGround = false
  hero.standingPlatformId = null

  for (const p of stage.platforms) {
    if (!isPlatformSolid(p)) continue

    const withinX = hero.x + hero.w - 4 > p.x && hero.x + 4 < p.x + p.w
    if (!withinX) continue

    // Landing on top of platform
    const tolerance = Math.max(14, Math.abs(p.dy || 0) + 12)
    if (hero.vy >= 0 && prevBottom <= p.y + tolerance && hero.y + hero.h >= p.y) {
      if (p.kind === 'spring') {
        // Spring Pad Launch!
        hero.y = p.y - hero.h
        hero.vy = p.springBoostVy || PHYSICS_CONFIG.springDefaultBoost
        hero.onGround = false
        hero.coyoteTimer = 0
        hero.scaleX = 0.78
        hero.scaleY = 1.26
        p.springCompress = 1
        events.jumped = true
        events.highJumped = true
      } else {
        hero.y = p.y - hero.h
        hero.vy = 0
        hero.onGround = true
        hero.standingPlatformId = p.id

        if (p.kind === 'phase' && p.phaseState === 'ready') {
          p.phaseState = 'stepping'
          p.phaseTimer = 0
        }

        if (!hero.wasOnGround) {
          hero.landingTimer = 0.14
          hero.scaleX = 1.16
          hero.scaleY = 0.86
          events.landed = true
        }
      }
      break
    }
  }

  // --------------------------------------------------------------------------
  // 6. PIT FALL CHECK
  // --------------------------------------------------------------------------
  if (hero.y > stage.height + 70) {
    events.fellInPit = true
    events.tookDamage = true
    hero.hp = Math.max(0, hero.hp - 1)
    if (hero.hp <= 0) {
      hero.animState = 'defeat'
      events.stageDefeated = true
      return events
    } else {
      hero.x = hero.respawnX
      hero.y = hero.respawnY - 10
      hero.vx = 0
      hero.vy = 0
      hero.invincibleTimer = 1.6
      hero.damageTimer = 0.45
    }
  }

  // --------------------------------------------------------------------------
  // 7. COLLECTIBLES (نجوم الطاقة, Copper Coils, Light Capsules)
  // --------------------------------------------------------------------------
  for (const item of stage.collectibles) {
    if (item.collected) continue
    if (
      aabbOverlap(
        hero.x - 4,
        hero.y - 4,
        hero.w + 8,
        hero.h + 8,
        item.x - 16,
        item.y - 16,
        32,
        32
      )
    ) {
      item.collected = true
      events.collectedStarIds.push(item.id)
      events.collectedValue += item.value
      hero.collectAnimTimer = 0.25
    }
  }

  // --------------------------------------------------------------------------
  // 8. CHECKPOINTS (أعمدة ومنارات الحفظ)
  // --------------------------------------------------------------------------
  for (const cp of stage.checkpoints) {
    if (cp.activated) continue
    if (aabbOverlap(hero.x, hero.y, hero.w, hero.h, cp.x - 24, cp.y - 70, 48, 75)) {
      cp.activated = true
      hero.respawnX = cp.x - hero.w * 0.5
      hero.respawnY = cp.y - hero.h - 4
      events.activatedCheckpointId = cp.id
    }
  }

  // --------------------------------------------------------------------------
  // 9. ELECTRICAL SWITCHES & GATES / BRIDGES
  // --------------------------------------------------------------------------
  for (const sw of stage.switches) {
    if (sw.activated) continue
    if (aabbOverlap(hero.x, hero.y, hero.w, hero.h, sw.x - 24, sw.y - 36, 48, 40)) {
      sw.activated = true
      events.activatedSwitchId = sw.id

      // Unlock matching gate or bridge
      for (const gate of stage.gates) {
        if (gate.id === sw.targetId || gate.switchId === sw.id) {
          gate.isOpen = true
          events.openedGateId = gate.id
        }
      }
      for (const plat of stage.platforms) {
        if (plat.id === sw.targetId || plat.switchId === sw.id) {
          plat.unlocked = true
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // 10. ENEMIES (Patrol + Mario-style Stomp from Above vs Side Damage)
  // --------------------------------------------------------------------------
  for (const enemy of stage.enemies) {
    if (enemy.defeated) continue

    enemy.x += enemy.vx * dt
    if (enemy.x <= enemy.minX) {
      enemy.x = enemy.minX
      enemy.vx = Math.abs(enemy.vx)
    } else if (enemy.x + enemy.w >= enemy.maxX) {
      enemy.x = enemy.maxX - enemy.w
      enemy.vx = -Math.abs(enemy.vx)
    }

    if (aabbOverlap(hero.x, hero.y, hero.w, hero.h, enemy.x, enemy.y, enemy.w, enemy.h)) {
      const heroBottom = hero.y + hero.h
      const enemyMidY = enemy.y + enemy.h * 0.55
      const isFallingOntoEnemy = hero.vy > 0 && heroBottom - hero.vy * dt <= enemyMidY + 12

      if (enemy.stompable && isFallingOntoEnemy) {
        enemy.defeated = true
        hero.vy = PHYSICS_CONFIG.stompBounceVelocity
        hero.onGround = false
        hero.scaleX = 1.18
        hero.scaleY = 0.84
        events.stompedEnemyId = enemy.id
        events.collectedValue += 250
      } else if (hero.invincibleTimer <= 0) {
        applyHeroDamage(hero, events)
        if (events.stageDefeated) return events
      }
    }
  }

  // --------------------------------------------------------------------------
  // 11. TIMED STAGE HAZARDS
  // --------------------------------------------------------------------------
  for (const haz of stage.hazards) {
    let isActive = true
    if (haz.kind === 'timed_arc' && haz.period && haz.onTime) {
      const phase = (elapsedSec + (haz.offset || 0)) % haz.period
      isActive = phase < haz.onTime
    }
    if (
      isActive &&
      hero.invincibleTimer <= 0 &&
      aabbOverlap(hero.x, hero.y, hero.w, hero.h, haz.x, haz.y, haz.w, haz.h)
    ) {
      applyHeroDamage(hero, events)
      if (events.stageDefeated) return events
    }
  }

  // --------------------------------------------------------------------------
  // 12. WORLD 5 BOSS ENCOUNTER (حارس الطاقة الآلي)
  // --------------------------------------------------------------------------
  if (stage.boss && stage.boss.state !== 'defeated') {
    const boss = stage.boss
    if (boss.invulnTimer > 0) boss.invulnTimer = Math.max(0, boss.invulnTimer - dt)
    boss.stateTimer -= dt

    if (boss.state === 'patrol') {
      boss.x += boss.vx * dt
      if (boss.x <= boss.minX) {
        boss.x = boss.minX
        boss.vx = Math.abs(boss.vx)
      } else if (boss.x + boss.w >= boss.maxX) {
        boss.x = boss.maxX - boss.w
        boss.vx = -Math.abs(boss.vx)
      }
      if (boss.stateTimer <= 0) {
        boss.state = 'telegraph'
        boss.stateTimer = 1.05
      }
    } else if (boss.state === 'telegraph') {
      if (boss.stateTimer <= 0) {
        boss.state = 'shockwave'
        boss.stateTimer = 1.35
        boss.shockwaveActive = true
        boss.shockwaveLeftX = boss.x
        boss.shockwaveRightX = boss.x + boss.w
      }
    } else if (boss.state === 'shockwave') {
      boss.shockwaveLeftX -= 290 * dt
      boss.shockwaveRightX += 290 * dt
      if (boss.stateTimer <= 0) {
        boss.shockwaveActive = false
        boss.state = 'vulnerable'
        boss.stateTimer = 3.4
      }
    } else if (boss.state === 'vulnerable') {
      if (boss.stateTimer <= 0) {
        boss.state = 'patrol'
        boss.stateTimer = 2.8
      }
    }

    // Check Arena Overload Breakers (hitting a breaker damages boss!)
    for (const brk of boss.breakers) {
      if (brk.activated) continue
      if (aabbOverlap(hero.x, hero.y, hero.w, hero.h, brk.x - 22, brk.y - 38, 44, 42)) {
        brk.activated = true
        damageBoss(boss, events)
      }
    }

    // Check Shockwave collision (jumpable low wave on arena floor)
    if (boss.shockwaveActive && hero.invincibleTimer <= 0) {
      const hitLeftWave = aabbOverlap(
        hero.x,
        hero.y,
        hero.w,
        hero.h,
        boss.shockwaveLeftX - 18,
        boss.shockwaveY - 18,
        36,
        24
      )
      const hitRightWave = aabbOverlap(
        hero.x,
        hero.y,
        hero.w,
        hero.h,
        boss.shockwaveRightX - 18,
        boss.shockwaveY - 18,
        36,
        24
      )
      if (hitLeftWave || hitRightWave) {
        applyHeroDamage(hero, events)
        if (events.stageDefeated) return events
      }
    }

    // Check Direct Boss Body Collision (Stomp from above vs side hit)
    if (
      boss.state !== 'defeated' &&
      aabbOverlap(hero.x, hero.y, hero.w, hero.h, boss.x, boss.y, boss.w, boss.h)
    ) {
      const heroBottom = hero.y + hero.h
      const isFallingOnBossTop = hero.vy > 0 && heroBottom - hero.vy * dt <= boss.y + 28
      if (isFallingOnBossTop && boss.invulnTimer <= 0) {
        hero.vy = -510
        hero.onGround = false
        damageBoss(boss, events)
      } else if (hero.invincibleTimer <= 0 && boss.invulnTimer <= 0) {
        applyHeroDamage(hero, events)
        if (events.stageDefeated) return events
      }
    }
  }

  // --------------------------------------------------------------------------
  // 13. GOAL PORTAL COMPLETION CHECK
  // --------------------------------------------------------------------------
  const bossBlocksGoal = Boolean(stage.boss && stage.boss.state !== 'defeated')
  if (
    !bossBlocksGoal &&
    aabbOverlap(
      hero.x,
      hero.y,
      hero.w,
      hero.h,
      stage.goalPortal.x - 28,
      stage.goalPortal.y - 75,
      56,
      85
    )
  ) {
    hero.animState = 'victory'
    events.stageCompleted = true
    return events
  }

  // --------------------------------------------------------------------------
  // 14. RESOLVE HERO ANIMATION STATE (11 STATES — SECTION 06)
  // --------------------------------------------------------------------------
  if (hero.damageTimer > 0) {
    hero.animState = 'damage'
  } else if (hero.collectAnimTimer > 0 && hero.onGround && Math.abs(hero.vx) < 20) {
    hero.animState = 'collecting'
  } else if (!hero.onGround) {
    if (hero.vy < -430) {
      hero.animState = 'jump_prep'
    } else if (hero.vy < 0) {
      hero.animState = 'jump_ascent'
    } else {
      hero.animState = 'falling'
    }
  } else if (hero.landingTimer > 0 && Math.abs(hero.vx) < 40) {
    hero.animState = 'landing'
  } else if (Math.abs(hero.vx) > 255) {
    hero.animState = 'run'
    hero.walkCycle += dt * 14
  } else if (Math.abs(hero.vx) > 15) {
    hero.animState = 'walk'
    hero.walkCycle += dt * 9
  } else {
    hero.animState = 'idle'
    hero.walkCycle += dt * 3
  }

  return events
}

function applyHeroDamage(hero: HeroPhysicsState, events: StepSimulationEvents) {
  events.tookDamage = true
  hero.hp = Math.max(0, hero.hp - 1)
  hero.damageTimer = 0.45
  hero.invincibleTimer = 1.65
  hero.vy = -340
  hero.vx = hero.facing === 'right' ? -180 : 180
  hero.onGround = false
  if (hero.hp <= 0) {
    hero.animState = 'defeat'
    events.stageDefeated = true
  }
}

function damageBoss(boss: NonNullable<StageDefinition['boss']>, events: StepSimulationEvents) {
  if (boss.state === 'defeated') return
  boss.hp = Math.max(0, boss.hp - 1)
  boss.invulnTimer = 1.1
  events.hitBoss = true
  events.collectedValue += 500
  if (boss.hp <= 0) {
    boss.state = 'defeated'
    boss.shockwaveActive = false
    events.bossDefeated = true
    events.collectedValue += 1000
  } else {
    boss.state = 'patrol'
    boss.stateTimer = 2.4
    boss.vx = boss.vx > 0 ? 145 : -145
  }
}

/**
 * Updates the side-scrolling camera with look-ahead, dead-zone, and world bounds (Section 15).
 */
export function updateSideScrollingCamera(
  cam: CameraState,
  hero: HeroPhysicsState,
  stage: StageDefinition,
  dt: number
): void {
  const lookAheadX = hero.facing === 'right' ? 95 : -65
  const targetCenterX = hero.x + hero.w * 0.5 + lookAheadX
  const desiredCamX = targetCenterX - cam.viewportW * 0.42

  const maxCamX = Math.max(0, stage.width - cam.viewportW)
  const clampedTargetX = Math.max(0, Math.min(maxCamX, desiredCamX))

  // Smooth horizontal follow without lag
  const lerpFactor = Math.min(1, dt * 8.5)
  cam.x += (clampedTargetX - cam.x) * lerpFactor
  cam.y = 0
}
