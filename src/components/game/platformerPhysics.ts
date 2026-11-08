import {
  type StageDefinition,
  type HeroAnimState,
  type PlatformData,
  type CollectibleProductKind,
  PRODUCT_CATALOG_META,
} from './platformerWorlds'

// ============================================================================
// ADVANCED PLATFORMER MOVEMENT & PHYSICS CONSTANTS (SECTION 4)
// ============================================================================

export const PHYSICS_CONFIG = {
  // Horizontal movement — tuned for immediate mobile response & controlled stopping without foot sliding
  accelGround: 2650,
  accelAir: 2150,
  decelGround: 3250,
  decelAir: 1180,
  skidDecel: 4200,
  maxWalkSpeed: 260,
  maxRunSpeed: 345,
  dashSpeed: 560,
  dashDurationSec: 0.2,
  dashCooldownSec: 0.85,

  // Jumping, Double Jump & Gravity
  jumpVelocity: -605,
  doubleJumpVelocity: -545,
  springDefaultBoost: -775,
  stompBounceVelocity: -445,
  gravityUp: 1300,
  gravityFall: 2040,
  maxFallSpeed: 760,
  variableJumpCutMultiplier: 0.45,
  variableJumpMinVy: -165,

  // Advanced Game Feel (Coyote Time & Jump Buffering: 140ms for mobile touch comfort)
  coyoteTimeSec: 0.14,
  jumpBufferSec: 0.14,
  minAirTimeForDoubleJumpSec: 0.13,

  // Hero collision box
  heroWidth: 34,
  heroHeight: 48,
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
  // Double Jump, Dash & Light Pulse Attack (Sections 3 & 4)
  doubleJumpAvailable: boolean
  dashTimer: number
  dashCooldown: number
  attackTimer: number
  attackCooldown: number
  // Product Ability Timers & Counters (Section 5)
  lightEnergy: number // 0 to 100 — subtly modulates LED bulb brightness
  speedBoostTimer: number // 2.5mm wire speed boost
  shieldTimer: number // 4mm wire protective shield
  spotlightTimer: number // LED spotlight hidden path reveal
  floodlightTimer: number // Rechargeable floodlight blackout illumination
  intercomsCollected: number // Intercom devices collected
  // Animation & Health (12 states)
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
  shakeIntensity?: number
  lookAheadX?: number
  focusX?: number
  focusY?: number
  bossBlend?: number
}

export interface PlayerInputFrame {
  left: boolean
  right: boolean
  run: boolean
  jumpPressed: boolean
  jumpHeld: boolean
  jumpReleased: boolean
  dashPressed?: boolean
  attackPressed?: boolean
}

export interface StepSimulationEvents {
  jumped: boolean
  highJumped: boolean
  doubleJumped: boolean
  dashed: boolean
  attacked: boolean
  landed: boolean
  collectedStarIds: string[]
  collectedProductKinds: CollectibleProductKind[]
  collectedValue: number
  abilityActivatedMsg: string | null
  activatedCheckpointId: string | null
  activatedSwitchId: string | null
  openedGateId: string | null
  stompedEnemyId: string | null
  hitBoss: boolean
  bossPhaseChanged: number | null
  bossDefeated: boolean
  tookDamage: boolean
  shieldBlocked: boolean
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
    doubleJumpAvailable: true,
    dashTimer: 0,
    dashCooldown: 0,
    attackTimer: 0,
    attackCooldown: 0,
    lightEnergy: 75,
    speedBoostTimer: 0,
    shieldTimer: 0,
    spotlightTimer: 0,
    floodlightTimer: 0,
    intercomsCollected: 0,
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
    standingPlatformId: null,
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

export function isPlatformSolid(p: PlatformData, hero?: HeroPhysicsState): boolean {
  if (p.kind === 'bridge_locked' && !p.unlocked) return false
  if (p.kind === 'phase' && p.phaseState === 'phased_out') return false
  if (p.kind === 'secret_spotlight') {
    if (!hero) return true
    const dist = Math.hypot(p.x + p.w * 0.5 - (hero.x + hero.w * 0.5), p.y - hero.y)
    return hero.spotlightTimer > 0 || dist < 190
  }
  return true
}

/**
 * Advances one deterministic simulation step (dt in seconds, clamped to 1/20s).
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
    doubleJumped: false,
    dashed: false,
    attacked: false,
    landed: false,
    collectedStarIds: [],
    collectedProductKinds: [],
    collectedValue: 0,
    abilityActivatedMsg: null,
    activatedCheckpointId: null,
    activatedSwitchId: null,
    openedGateId: null,
    stompedEnemyId: null,
    hitBoss: false,
    bossPhaseChanged: null,
    bossDefeated: false,
    tookDamage: false,
    shieldBlocked: false,
    fellInPit: false,
    stageCompleted: false,
    stageDefeated: false,
  }

  hero.wasOnGround = hero.onGround
  hero.animTimer += dt
  if (hero.invincibleTimer > 0) hero.invincibleTimer = Math.max(0, hero.invincibleTimer - dt)
  if (hero.damageTimer > 0) hero.damageTimer = Math.max(0, hero.damageTimer - dt)
  if (hero.landingTimer > 0) hero.landingTimer = Math.max(0, hero.landingTimer - dt)
  if (hero.collectAnimTimer > 0) hero.collectAnimTimer = Math.max(0, hero.collectAnimTimer - dt)
  if (hero.dashTimer > 0) hero.dashTimer = Math.max(0, hero.dashTimer - dt)
  if (hero.dashCooldown > 0) hero.dashCooldown = Math.max(0, hero.dashCooldown - dt)
  if (hero.attackTimer > 0) hero.attackTimer = Math.max(0, hero.attackTimer - dt)
  if (hero.attackCooldown > 0) hero.attackCooldown = Math.max(0, hero.attackCooldown - dt)

  // Product Ability Timers
  if (hero.speedBoostTimer > 0) hero.speedBoostTimer = Math.max(0, hero.speedBoostTimer - dt)
  if (hero.shieldTimer > 0) hero.shieldTimer = Math.max(0, hero.shieldTimer - dt)
  if (hero.spotlightTimer > 0) hero.spotlightTimer = Math.max(0, hero.spotlightTimer - dt)
  if (hero.floodlightTimer > 0) hero.floodlightTimer = Math.max(0, hero.floodlightTimer - dt)

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
    if (standingPlat && isPlatformSolid(standingPlat, hero)) {
      if (standingPlat.dx) hero.x += standingPlat.dx
      if (standingPlat.dy) hero.y += standingPlat.dy
      if (standingPlat.kind === 'conveyor' && standingPlat.conveyorSpeed) {
        hero.x += standingPlat.conveyorSpeed * dt
      }
    }
  }

  // --------------------------------------------------------------------------
  // 2. DASH & LIGHT PULSE ATTACK INPUTS (SECTIONS 3 & 4)
  // --------------------------------------------------------------------------
  const moveDir = (input.right ? 1 : 0) - (input.left ? 1 : 0)
  if (moveDir !== 0) {
    hero.facing = moveDir > 0 ? 'right' : 'left'
    hero.runHoldTimer += dt
  } else {
    hero.runHoldTimer = 0
  }

  // Trigger Dash (Shift press or dedicated Dash button)
  if (input.dashPressed && hero.dashCooldown <= 0 && hero.dashTimer <= 0) {
    hero.dashTimer = PHYSICS_CONFIG.dashDurationSec
    hero.dashCooldown = PHYSICS_CONFIG.dashCooldownSec
    const dir = moveDir !== 0 ? moveDir : hero.facing === 'right' ? 1 : -1
    hero.vx = dir * PHYSICS_CONFIG.dashSpeed
    hero.vy = Math.min(0, hero.vy * 0.25)
    hero.scaleX = 1.24
    hero.scaleY = 0.82
    events.dashed = true
  }

  // Trigger Light Bulb Pulse Attack
  if (input.attackPressed && hero.attackCooldown <= 0) {
    hero.attackTimer = 0.28
    hero.attackCooldown = 0.55
    events.attacked = true
  }

  // --------------------------------------------------------------------------
  // 3. HORIZONTAL ACCELERATION, DECELERATION & WIND
  // --------------------------------------------------------------------------
  hero.isRunning = Boolean(input.run || hero.runHoldTimer > 0.32 || hero.speedBoostTimer > 0)
  const boostMult = hero.speedBoostTimer > 0 ? 1.24 : 1.0
  const targetMaxSpeed =
    (hero.isRunning ? PHYSICS_CONFIG.maxRunSpeed : PHYSICS_CONFIG.maxWalkSpeed) * boostMult

  if (hero.dashTimer > 0) {
    // Maintain dash velocity
    const dir = hero.facing === 'right' ? 1 : -1
    hero.vx = dir * PHYSICS_CONFIG.dashSpeed
  } else if (moveDir !== 0) {
    const isSkidding = hero.onGround && Math.sign(hero.vx) !== 0 && Math.sign(hero.vx) !== moveDir
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

  // Apply High-Altitude Wind Effect (Level 7) when not dashing
  if (stage.windForce && hero.dashTimer <= 0) {
    hero.vx += stage.windForce * dt * (hero.onGround ? 0.35 : 0.85)
  }

  // --------------------------------------------------------------------------
  // 4. COYOTE TIME, JUMP BUFFERING, VARIABLE JUMP & DOUBLE JUMP
  // --------------------------------------------------------------------------
  if (hero.onGround) {
    hero.coyoteTimer = PHYSICS_CONFIG.coyoteTimeSec
    hero.doubleJumpAvailable = true
  } else {
    hero.coyoteTimer = Math.max(0, hero.coyoteTimer - dt)
  }

  if (input.jumpPressed) {
    hero.jumpBufferTimer = PHYSICS_CONFIG.jumpBufferSec
  } else {
    hero.jumpBufferTimer = Math.max(0, hero.jumpBufferTimer - dt)
  }

  // Execute Primary Jump (Ground or Coyote Time)
  if (hero.jumpBufferTimer > 0 && hero.coyoteTimer > 0) {
    const speedBonus = Math.abs(hero.vx) > 250 ? -28 : 0
    hero.vy = PHYSICS_CONFIG.jumpVelocity + speedBonus
    hero.onGround = false
    hero.coyoteTimer = 0
    hero.jumpBufferTimer = 0
    hero.jumpHeld = true
    hero.standingPlatformId = null
    hero.scaleX = 0.84
    hero.scaleY = 1.18
    events.jumped = true
  } else if (
    input.jumpPressed &&
    !hero.onGround &&
    hero.coyoteTimer <= 0 &&
    hero.doubleJumpAvailable &&
    hero.vy > -440
  ) {
    // Execute Mid-Air Double Jump (guarded against accidental double-tap on initial jump takeoff)
    hero.vy = PHYSICS_CONFIG.doubleJumpVelocity
    hero.doubleJumpAvailable = false
    hero.jumpBufferTimer = 0
    hero.jumpHeld = true
    hero.scaleX = 0.86
    hero.scaleY = 1.16
    events.jumped = true
    events.doubleJumped = true
  }

  // Variable Jump Height: cut upward velocity when jump button is released early
  if (
    (input.jumpReleased || (!input.jumpHeld && hero.jumpHeld)) &&
    hero.vy < PHYSICS_CONFIG.variableJumpMinVy &&
    hero.vy > -690
  ) {
    hero.vy *= PHYSICS_CONFIG.variableJumpCutMultiplier
    hero.jumpHeld = false
  }
  if (!input.jumpHeld) {
    hero.jumpHeld = false
  }

  // Apply Gravity
  if (hero.dashTimer <= 0) {
    const gravity =
      hero.vy < 0 && input.jumpHeld ? PHYSICS_CONFIG.gravityUp : PHYSICS_CONFIG.gravityFall
    hero.vy = Math.min(PHYSICS_CONFIG.maxFallSpeed, hero.vy + gravity * dt)
  }

  // --------------------------------------------------------------------------
  // 5. HORIZONTAL MOVEMENT & SOLID WALL / GATE COLLISIONS
  // --------------------------------------------------------------------------
  const prevX = hero.x
  hero.x += hero.vx * dt
  if (hero.x < 12) {
    hero.x = 12
    hero.vx = 0
  }
  if (hero.x + hero.w > stage.width - 12) {
    hero.x = stage.width - 12 - hero.w
    hero.vx = 0
  }

  // Prevent clipping horizontally into thick solid ground blocks when below top surface
  for (const p of stage.platforms) {
    if (p.kind !== 'solid' || p.h < 50) continue
    if (
      hero.y + hero.h > p.y + 14 &&
      aabbOverlap(hero.x, hero.y, hero.w, hero.h, p.x, p.y, p.w, p.h)
    ) {
      if (prevX + hero.w <= p.x + 8 && hero.vx > 0) {
        hero.x = p.x - hero.w
        hero.vx = 0
      } else if (prevX >= p.x + p.w - 8 && hero.vx < 0) {
        hero.x = p.x + p.w
        hero.vx = 0
      }
    }
  }

  // Check closed Energy Gates
  for (const gate of stage.gates) {
    if (gate.isOpen) continue
    if (aabbOverlap(hero.x, hero.y, hero.w, hero.h, gate.x, gate.y, gate.w, gate.h)) {
      if (hero.vx > 0) {
        hero.x = gate.x - hero.w
      } else if (hero.vx < 0) {
        hero.x = gate.x + gate.w
      }
      hero.vx = 0
    }
  }

  // --------------------------------------------------------------------------
  // 6. VERTICAL MOVEMENT & PLATFORM LANDING / SPRING / PHASE COLLISIONS
  // --------------------------------------------------------------------------
  const prevBottom = hero.y + hero.h
  hero.y += hero.vy * dt
  hero.onGround = false
  hero.standingPlatformId = null

  for (const p of stage.platforms) {
    if (!isPlatformSolid(p, hero)) continue

    if (aabbOverlap(hero.x, hero.y, hero.w, hero.h, p.x, p.y, p.w, p.h)) {
      const tolerance = Math.max(16, Math.abs(hero.vy * dt) + 12)
      if (hero.vy >= 0 && prevBottom <= p.y + tolerance) {
        hero.y = p.y - hero.h

        if (p.kind === 'spring') {
          hero.vy = p.springBoostVy || PHYSICS_CONFIG.springDefaultBoost
          hero.onGround = false
          hero.doubleJumpAvailable = true
          p.springCompress = 1
          hero.scaleX = 0.78
          hero.scaleY = 1.26
          events.jumped = true
          events.highJumped = true
        } else {
          if (!hero.wasOnGround && hero.vy > 190) {
            events.landed = true
            hero.landingTimer = 0.14
            hero.scaleX = 1.18
            hero.scaleY = 0.84
          }
          hero.vy = 0
          hero.onGround = true
          hero.standingPlatformId = p.id

          if (p.kind === 'phase' && p.phaseState === 'ready') {
            p.phaseState = 'stepping'
            p.phaseTimer = 0
          }
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // 7. PIT FALL CHECK & CHECKPOINT RESPAWN
  // --------------------------------------------------------------------------
  if (hero.y > stage.height + 70) {
    events.fellInPit = true
    applyHeroDamage(hero, events, true)
    if (!events.stageDefeated) {
      hero.x = hero.respawnX
      hero.y = hero.respawnY - 12
      hero.vx = 0
      hero.vy = 0
      hero.onGround = false
    }
    return events
  }

  // --------------------------------------------------------------------------
  // 8. COLLECTIBLES (13 ELECTRICAL PRODUCTS & ABILITIES — SECTION 5)
  // --------------------------------------------------------------------------
  for (const item of stage.collectibles) {
    if (item.collected) continue
    const itemBox = 30
    if (
      aabbOverlap(
        hero.x - 4,
        hero.y - 4,
        hero.w + 8,
        hero.h + 8,
        item.x - itemBox * 0.5,
        item.y - itemBox * 0.5,
        itemBox,
        itemBox
      )
    ) {
      item.collected = true
      events.collectedStarIds.push(item.id)
      events.collectedProductKinds.push(item.kind)
      events.collectedValue += item.value
      hero.collectAnimTimer = 0.28

      const meta = PRODUCT_CATALOG_META[item.kind]
      // Apply meaningful product gameplay abilities
      switch (item.kind) {
        case 'wire_1_5mm':
          hero.lightEnergy = Math.min(100, hero.lightEnergy + 15)
          break
        case 'wire_2_5mm':
          hero.speedBoostTimer = Math.max(hero.speedBoostTimer, 6.0)
          hero.lightEnergy = Math.min(100, hero.lightEnergy + 20)
          events.abilityActivatedMsg = `⚡ ${meta.nameAr}: ${meta.abilityAr}`
          break
        case 'wire_4mm':
          hero.shieldTimer = Math.max(hero.shieldTimer, 7.0)
          hero.lightEnergy = Math.min(100, hero.lightEnergy + 25)
          events.abilityActivatedMsg = `🛡️ ${meta.nameAr}: ${meta.abilityAr}`
          break
        case 'wire_6mm':
          hero.lightEnergy = 100
          hero.attackTimer = 0.45
          events.abilityActivatedMsg = `🔥 ${meta.nameAr}: ${meta.abilityAr}`
          break
        case 'led_bulb':
          if (hero.hp < hero.maxHp) {
            hero.hp = Math.min(hero.maxHp, hero.hp + 1)
            events.abilityActivatedMsg = `💡 ${meta.nameAr}: تمت استعادة قلب صحة (+1)!`
          } else {
            hero.lightEnergy = 100
          }
          break
        case 'led_spotlight':
          hero.spotlightTimer = Math.max(hero.spotlightTimer, 10.0)
          events.abilityActivatedMsg = `🔦 ${meta.nameAr}: ${meta.abilityAr}`
          break
        case 'rechargeable_floodlight':
          hero.floodlightTimer = Math.max(hero.floodlightTimer, 12.0)
          hero.lightEnergy = 100
          events.abilityActivatedMsg = `🌟 ${meta.nameAr}: ${meta.abilityAr}`
          break
        case 'intercom_device':
          hero.intercomsCollected += 1
          events.abilityActivatedMsg = `📟 ${meta.nameAr}: تم تفعيل شفرة بوابات الأمان!`
          break
        case 'waterproof_socket':
          hero.shieldTimer = Math.max(hero.shieldTimer, 4.5)
          break
        case 'electrical_connector':
          hero.dashCooldown = 0
          hero.doubleJumpAvailable = true
          break
        case 'outdoor_fixture':
          hero.attackTimer = 0.4
          break
        default:
          hero.lightEnergy = Math.min(100, hero.lightEnergy + 15)
          break
      }
    }
  }

  // --------------------------------------------------------------------------
  // 9. CHECKPOINT LAMPS
  // --------------------------------------------------------------------------
  for (const cp of stage.checkpoints) {
    if (cp.activated) continue
    if (aabbOverlap(hero.x, hero.y, hero.w, hero.h, cp.x - 24, cp.y - 72, 48, 76)) {
      cp.activated = true
      hero.respawnX = cp.x - hero.w * 0.5
      hero.respawnY = cp.y - hero.h - 4
      events.activatedCheckpointId = cp.id
    }
  }

  // --------------------------------------------------------------------------
  // 10. ELECTRICAL SWITCHES, MULTI-SWITCH GATES & INTERCOM DOORS
  // --------------------------------------------------------------------------
  for (const sw of stage.switches) {
    if (sw.activated) continue
    if (aabbOverlap(hero.x, hero.y, hero.w, hero.h, sw.x - 24, sw.y - 46, 48, 50)) {
      sw.activated = true
      events.activatedSwitchId = sw.id

      // Unlock matching single-switch gate or bridge
      for (const gate of stage.gates) {
        if (gate.switchId === sw.id || gate.id === sw.targetId) {
          if (gate.requiredSwitchesCount) {
            const activeCount = stage.switches.filter((s) => s.activated).length
            if (activeCount >= gate.requiredSwitchesCount) {
              gate.isOpen = true
              events.openedGateId = gate.id
            }
          } else {
            gate.isOpen = true
            events.openedGateId = gate.id
          }
        }
      }
      for (const plat of stage.platforms) {
        if (plat.switchId === sw.id || plat.id === sw.targetId) {
          plat.unlocked = true
        }
      }
    }
  }

  // Also check multi-switch or intercom gates automatically
  const totalActivatedSwitches = stage.switches.filter((s) => s.activated).length
  for (const gate of stage.gates) {
    if (gate.isOpen) continue
    if (gate.requiredSwitchesCount && totalActivatedSwitches >= gate.requiredSwitchesCount) {
      gate.isOpen = true
      events.openedGateId = gate.id
    }
    if (gate.requiredIntercoms && hero.intercomsCollected >= gate.requiredIntercoms) {
      gate.isOpen = true
      events.openedGateId = gate.id
    }
  }

  // --------------------------------------------------------------------------
  // 11. ENVIRONMENTAL HAZARDS (Timed Arcs, Rotating, Presses, Fans, Lasers, Falling)
  // --------------------------------------------------------------------------
  for (const haz of stage.hazards) {
    if (haz.kind === 'ventilation_fan') {
      // Upward industrial air stream in Stage 3 (The Lighting Factory)
      if (
        aabbOverlap(
          hero.x,
          hero.y,
          hero.w,
          hero.h,
          haz.x - 8,
          haz.y - 125,
          haz.w + 16,
          haz.h + 125
        )
      ) {
        hero.vy = Math.max(-520, hero.vy - 920 * dt)
        hero.onGround = false
      }
      continue
    }

    if (haz.kind === 'falling_obstacle') {
      const period = haz.period || 2.4
      const phase = (elapsedSec + (haz.offset || 0)) % period
      const baseY = haz.baseY ?? 115
      const maxDrop = Math.max(120, stage.groundY - baseY - haz.h)
      // First 0.45s: warning shake at top; next 0.95s: fall to ground; remainder: reset at top
      if (phase < 0.45) {
        haz.y = baseY
      } else if (phase < 1.4) {
        const ratio = (phase - 0.45) / 0.95
        haz.y = baseY + ratio * ratio * maxDrop
      } else {
        haz.y = baseY
      }
      if (
        phase >= 0.45 &&
        phase < 1.4 &&
        hero.invincibleTimer <= 0 &&
        aabbOverlap(hero.x + 4, hero.y + 4, hero.w - 8, hero.h - 6, haz.x, haz.y, haz.w, haz.h)
      ) {
        applyHeroDamage(hero, events)
        if (events.stageDefeated) return events
      }
      continue
    }

    if (haz.kind === 'rotating_hazard') {
      haz.angle = (haz.angle || 0) + dt * 2.6
      const rad = haz.radius || 48
      const orbX = haz.x + Math.cos(haz.angle) * rad - 14
      const orbY = haz.y + Math.sin(haz.angle) * rad - 14
      if (hero.invincibleTimer <= 0 && aabbOverlap(hero.x, hero.y, hero.w, hero.h, orbX, orbY, 28, 28)) {
        applyHeroDamage(hero, events)
        if (events.stageDefeated) return events
      }
      continue
    }

    if (haz.kind === 'mechanical_press') {
      const period = haz.period || 2.2
      const phase = (elapsedSec + (haz.offset || 0)) % period
      const baseY = haz.baseY ?? 340
      // Slam down during first 35% of period, retract smoothly afterwards
      const slamRatio = phase < period * 0.35 ? phase / (period * 0.35) : Math.max(0, 1 - (phase - period * 0.35) / (period * 0.65))
      haz.y = baseY + slamRatio * 68
      if (hero.invincibleTimer <= 0 && aabbOverlap(hero.x, hero.y, hero.w, hero.h, haz.x + 4, haz.y, haz.w - 8, haz.h)) {
        applyHeroDamage(hero, events)
        if (events.stageDefeated) return events
      }
      continue
    }

    let isActive = true
    if ((haz.kind === 'timed_arc' || haz.kind === 'laser_beam') && haz.period && haz.onTime) {
      const phase = (elapsedSec + (haz.offset || 0)) % haz.period
      isActive = phase < haz.onTime
    }
    if (!isActive) continue

    if (
      hero.invincibleTimer <= 0 &&
      aabbOverlap(hero.x + 4, hero.y + 4, hero.w - 8, hero.h - 6, haz.x, haz.y, haz.w, haz.h)
    ) {
      applyHeroDamage(hero, events)
      if (events.stageDefeated) return events
    }
  }

  // --------------------------------------------------------------------------
  // 12. ENEMY STATE MACHINE & COMBAT (8 STAGE-DISTINCT ENEMY TYPES — V12)
  // States: IDLE -> PATROL -> DETECT -> ATTACK -> RETREAT -> RECOVER -> DEFEATED
  // --------------------------------------------------------------------------
  const heroCenterX = hero.x + hero.w * 0.5
  const heroCenterY = hero.y + hero.h * 0.5
  const isPulseAttacking = hero.attackTimer > 0 || hero.dashTimer > 0

  for (const enemy of stage.enemies) {
    if (enemy.defeated) continue

    const enemyCenterX = enemy.x + enemy.w * 0.5
    const enemyCenterY = enemy.y + enemy.h * 0.5
    const distToHero = Math.hypot(heroCenterX - enemyCenterX, heroCenterY - enemyCenterY)

    if (!enemy.aiState) {
      enemy.aiState = enemy.kind === 'assembly_mimic' ? 'idle' : 'patrol'
    }
    enemy.aiTimer = (enemy.aiTimer || 0) + dt

    let speedMult = 1.0

    switch (enemy.kind) {
      // ======================================================================
      // STAGE 1 MONSTERS — مدينة النور
      // ======================================================================
      case 'shadow_runner':
      case 'shadow_bug':
      case 'electrical_spark': {
        // Shadow Runner (عدّاء الظل): Fast ground creature that changes direction dynamically
        if (distToHero < 210 && Math.abs(heroCenterY - enemyCenterY) < 90 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
          enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.28) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
          enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.85) {
          enemy.aiState = 'recover'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'recover' && enemy.aiTimer > 0.4) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult =
          enemy.aiState === 'attack'
            ? 1.72
            : enemy.aiState === 'detect'
            ? 0.35
            : enemy.aiState === 'recover'
            ? 0.55
            : 1.1
        break
      }

      case 'rooftop_jumper': {
        // Rooftop Jumper (قافز الأسطح): Leaps parabolically between platforms/rooftops
        if (enemy.baseY === undefined) enemy.baseY = enemy.y
        if (enemy.vy === undefined) enemy.vy = 0
        if (enemy.aiState === 'patrol' && (distToHero < 220 || enemy.aiTimer > 1.6)) {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.32) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
          enemy.vy = -350
          if (distToHero < 240) {
            enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
          }
        }
        if (enemy.y < enemy.baseY || (enemy.vy && enemy.vy < 0)) {
          enemy.vy = (enemy.vy || 0) + 980 * dt
          enemy.y += enemy.vy * dt
          if (enemy.y >= enemy.baseY) {
            enemy.y = enemy.baseY
            enemy.vy = 0
            enemy.aiState = 'recover'
            enemy.aiTimer = 0
          }
        } else if (enemy.aiState === 'recover' && enemy.aiTimer > 0.45) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult = enemy.aiState === 'attack' ? 1.45 : enemy.aiState === 'detect' ? 0.25 : 1.0
        break
      }

      case 'street_guardian': {
        // Street Guardian (حارس الشارع): Heavy defensive enemy protecting key routes
        if (distToHero < 200 && Math.abs(heroCenterY - enemyCenterY) < 95 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
          enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.52) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.85) {
          enemy.aiState = 'recover'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'recover' && enemy.aiTimer > 0.65) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult =
          enemy.aiState === 'detect'
            ? 0.15
            : enemy.aiState === 'attack'
            ? 1.65
            : enemy.aiState === 'recover'
            ? 0.35
            : 0.95
        break
      }

      // ======================================================================
      // STAGE 2 MONSTERS — الإنارة فرع البيضاء (ORANGE WORLD)
      // ======================================================================
      case 'copper_scorpion':
      case 'cable_crawler':
      case 'cable_snake': {
        // Copper Scorpion (عقرب النحاس): Crawls, strikes with mechanical tail, and retreats after attacking
        if (distToHero < 195 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
          enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.38) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.65) {
          enemy.aiState = 'retreat'
          enemy.aiTimer = 0
          enemy.vx = heroCenterX >= enemyCenterX ? -Math.abs(enemy.vx) : Math.abs(enemy.vx)
        } else if (enemy.aiState === 'retreat' && enemy.aiTimer > 0.85) {
          enemy.aiState = 'recover'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'recover' && enemy.aiTimer > 0.45) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult =
          enemy.aiState === 'attack'
            ? 1.75
            : enemy.aiState === 'retreat'
            ? 1.45
            : enemy.aiState === 'detect'
            ? 0.2
            : enemy.aiState === 'recover'
            ? 0.5
            : 1.0
        break
      }

      case 'magnetic_crusher': {
        // Magnetic Crusher (الساحق المغناطيسي): Pulls player toward it and activates crushing attacks
        if (distToHero < 235 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.55) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.95) {
          enemy.aiState = 'recover'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'recover' && enemy.aiTimer > 0.7) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        // Magnetic Pull effect on Hero during detect/attack when within 225px
        if ((enemy.aiState === 'detect' || enemy.aiState === 'attack') && distToHero < 225 && distToHero > 28) {
          const pullDir = enemyCenterX > heroCenterX ? 1 : -1
          hero.x += pullDir * 68 * dt
        }
        speedMult =
          enemy.aiState === 'detect'
            ? 0.2
            : enemy.aiState === 'attack'
            ? 1.55
            : enemy.aiState === 'recover'
            ? 0.3
            : 0.9
        break
      }

      case 'orange_spark': {
        // Orange Spark (الشرارة البرتقالية): Fast electrical creature accelerating near power nodes/hero
        if (distToHero < 220 && enemy.aiState === 'patrol') {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 1.1) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        const sparkPulse = 1.0 + 0.35 * Math.abs(Math.sin(elapsedSec * 7.0 + enemy.minX * 0.02))
        speedMult = enemy.aiState === 'attack' ? 1.8 : sparkPulse
        break
      }

      // ======================================================================
      // STAGE 3 MONSTERS — مصنع الإنارة (FACTORY)
      // ======================================================================
      case 'gear_beast':
      case 'industrial_robot':
      case 'mechanical_spider': {
        // Gear Beast (وحش التروس): Rotating gear body that rolls & accelerates during attacks
        if (distToHero < 220 && Math.abs(heroCenterY - enemyCenterY) < 90 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
          enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.42) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.95) {
          enemy.aiState = 'recover'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'recover' && enemy.aiTimer > 0.55) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult =
          enemy.aiState === 'detect'
            ? 0.15
            : enemy.aiState === 'attack'
            ? 1.92
            : enemy.aiState === 'recover'
            ? 0.4
            : 1.05
        break
      }

      case 'welding_drone':
      case 'energy_drone':
      case 'flying_drone': {
        // Welding Drone (طائرة اللحام): Patrols elevated routes, fires short-range welding beams & repositions
        if (distToHero < 210 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.4) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.9) {
          enemy.aiState = 'retreat'
          enemy.aiTimer = 0
          enemy.vx = -enemy.vx
        } else if (enemy.aiState === 'retreat' && enemy.aiTimer > 0.65) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult =
          enemy.aiState === 'attack'
            ? 1.45
            : enemy.aiState === 'retreat'
            ? 1.35
            : enemy.aiState === 'detect'
            ? 0.3
            : 1.0
        if (enemy.baseY !== undefined) {
          const waveOffset = Math.sin(elapsedSec * 3.8 + enemy.minX * 0.04) * 18
          const swoopDip = enemy.aiState === 'attack' ? Math.sin(enemy.aiTimer * Math.PI) * 32 : 0
          enemy.y = enemy.baseY + waveOffset + swoopDip
        }
        break
      }

      case 'assembly_mimic': {
        // Assembly Mimic (المحاكي الآلي): Disguised as inactive machinery until approached, warns & attacks
        if (enemy.aiState === 'idle') {
          speedMult = 0
          if (distToHero < 195) {
            enemy.aiState = 'detect'
            enemy.aiTimer = 0
            enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
          }
        } else if (enemy.aiState === 'detect') {
          speedMult = 0.1
          if (enemy.aiTimer > 0.48) {
            enemy.aiState = 'attack'
            enemy.aiTimer = 0
          }
        } else if (enemy.aiState === 'attack') {
          speedMult = 1.85
          if (enemy.aiTimer > 0.95) {
            enemy.aiState = 'recover'
            enemy.aiTimer = 0
          }
        } else if (enemy.aiState === 'recover') {
          speedMult = 0.35
          if (enemy.aiTimer > 0.6) {
            enemy.aiState = distToHero < 250 ? 'patrol' : 'idle'
            enemy.aiTimer = 0
          }
        } else {
          speedMult = 1.05
          if (distToHero < 185 && enemy.aiTimer > 0.9) {
            enemy.aiState = 'detect'
            enemy.aiTimer = 0
          } else if (distToHero > 310) {
            enemy.aiState = 'idle'
            enemy.aiTimer = 0
          }
        }
        break
      }

      // ======================================================================
      // STAGE 4 MONSTERS — الإنارة فرع الليثي (BLUE WORLD)
      // ======================================================================
      case 'blue_phantom':
      case 'light_thief': {
        // Blue Phantom (الطيف الأزرق): Phases/teleports between positions & attacks with energy bursts
        if (distToHero < 220 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
          enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.32) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
          // Phase-blink step toward hero within patrol bounds
          const blinkDir = heroCenterX >= enemyCenterX ? 1 : -1
          enemy.x = Math.max(enemy.minX, Math.min(enemy.maxX - enemy.w, enemy.x + blinkDir * 42))
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.85) {
          enemy.aiState = 'retreat'
          enemy.aiTimer = 0
          enemy.vx = -enemy.vx
        } else if (enemy.aiState === 'retreat' && enemy.aiTimer > 0.6) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult =
          enemy.aiState === 'attack'
            ? 1.75
            : enemy.aiState === 'retreat'
            ? 1.4
            : enemy.aiState === 'detect'
            ? 0.25
            : 1.15
        break
      }

      case 'electric_spider': {
        // Electric Spider (العنكبوت الكهربائي): Climbs vertically & drops to create temporary electrical traps
        if (enemy.baseY === undefined) enemy.baseY = enemy.y
        if (distToHero < 210 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.35) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.95) {
          enemy.aiState = 'recover'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'recover' && enemy.aiTimer > 0.55) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        const climbWave = Math.sin(elapsedSec * 4.2 + enemy.minX * 0.03) * 34
        const dropOffset = enemy.aiState === 'attack' ? 46 * Math.sin(enemy.aiTimer * Math.PI) : 0
        enemy.y = enemy.baseY + climbWave + dropOffset
        speedMult = enemy.aiState === 'attack' ? 1.4 : enemy.aiState === 'detect' ? 0.3 : 1.0
        break
      }

      case 'pulse_sentinel':
      case 'security_bot':
      case 'security_robot': {
        // Pulse Sentinel (حارس النبض الأزرق): Scans player, activates directional energy attacks & repositions
        if (distToHero < 225 && Math.abs(heroCenterY - enemyCenterY) < 95 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
          enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.45) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.85) {
          enemy.aiState = 'retreat'
          enemy.aiTimer = 0
          enemy.vx = -enemy.vx
        } else if (enemy.aiState === 'retreat' && enemy.aiTimer > 0.55) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult =
          enemy.aiState === 'detect'
            ? 0.15
            : enemy.aiState === 'attack'
            ? 1.78
            : enemy.aiState === 'retreat'
            ? 1.35
            : 1.0
        break
      }

      // ======================================================================
      // STAGE 5 MONSTERS — قلعة الظلام (DARKNESS FORTRESS)
      // ======================================================================
      case 'void_flyer':
      case 'flying_guardian':
      case 'giant_guardian': {
        // Void Flyer (طائر الفراغ): Complex dual-frequency aerial flight & swoop patterns
        if (distToHero < 220 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.4) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 1.0) {
          enemy.aiState = 'recover'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'recover' && enemy.aiTimer > 0.5) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult =
          enemy.aiState === 'attack'
            ? 1.62
            : enemy.aiState === 'detect'
            ? 0.3
            : enemy.aiState === 'recover'
            ? 0.55
            : 1.1
        if (enemy.baseY !== undefined) {
          const complexWave =
            Math.sin(elapsedSec * 3.6 + enemy.minX * 0.03) * 22 +
            Math.cos(elapsedSec * 6.2 + enemy.maxX * 0.02) * 10
          const dive = enemy.aiState === 'attack' ? Math.sin(enemy.aiTimer * Math.PI) * 34 : 0
          enemy.y = enemy.baseY + complexWave + dive
        }
        break
      }

      case 'shadow_brute': {
        // Shadow Brute (عملاق الظل): Heavy armored enemy with powerful area shockwave attacks
        if (distToHero < 215 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
          enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.58) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.9) {
          enemy.aiState = 'recover'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'recover' && enemy.aiTimer > 0.75) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult =
          enemy.aiState === 'detect'
            ? 0.1
            : enemy.aiState === 'attack'
            ? 1.7
            : enemy.aiState === 'recover'
            ? 0.3
            : 0.92
        break
      }

      case 'fortress_guardian':
      case 'dark_stalker':
      case 'dark_sentinel':
      case 'transformer_monster':
      case 'shadow_creature':
      default: {
        // Dark Stalker (مطارد الظلام) & Fortress Guardian (حارس القلعة): Multi-pattern pursuit & slash
        if (distToHero < 225 && enemy.aiState === 'patrol') {
          enemy.aiState = 'detect'
          enemy.aiTimer = 0
          enemy.attackPattern = ((enemy.attackPattern || 0) + 1) % 2
          enemy.vx = heroCenterX >= enemyCenterX ? Math.abs(enemy.vx) : -Math.abs(enemy.vx)
        } else if (enemy.aiState === 'detect' && enemy.aiTimer > 0.45) {
          enemy.aiState = 'attack'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'attack' && enemy.aiTimer > 0.95) {
          enemy.aiState = 'recover'
          enemy.aiTimer = 0
        } else if (enemy.aiState === 'recover' && enemy.aiTimer > 0.55) {
          enemy.aiState = 'patrol'
          enemy.aiTimer = 0
        }
        speedMult =
          enemy.aiState === 'detect'
            ? 0.15
            : enemy.aiState === 'attack'
            ? enemy.attackPattern === 0
              ? 1.85
              : 1.55
            : enemy.aiState === 'recover'
            ? 0.4
            : 1.08
        break
      }
    }

    enemy.x += enemy.vx * speedMult * dt
    if (enemy.x <= enemy.minX) {
      enemy.x = enemy.minX
      enemy.vx = Math.abs(enemy.vx)
    } else if (enemy.x + enemy.w >= enemy.maxX) {
      enemy.x = enemy.maxX - enemy.w
      enemy.vx = -Math.abs(enemy.vx)
    }

    // Check if Hero's Light Bulb Pulse Attack hits nearby enemy
    if (isPulseAttacking && distToHero < 76) {
      enemy.defeated = true
      enemy.aiState = 'defeated'
      events.stompedEnemyId = enemy.id
      events.collectedValue += 150
      continue
    }

    if (aabbOverlap(hero.x, hero.y, hero.w, hero.h, enemy.x, enemy.y, enemy.w, enemy.h)) {
      const heroBottom = hero.y + hero.h
      const isStompFromAbove =
        enemy.stompable && hero.vy > 0 && heroBottom - hero.vy * dt <= enemy.y + enemy.h * 0.58

      if (isStompFromAbove) {
        enemy.defeated = true
        enemy.aiState = 'defeated'
        hero.vy = input.jumpHeld
          ? PHYSICS_CONFIG.jumpVelocity * 0.86
          : PHYSICS_CONFIG.stompBounceVelocity
        hero.onGround = false
        hero.doubleJumpAvailable = true
        hero.scaleX = 1.15
        hero.scaleY = 0.85
        events.stompedEnemyId = enemy.id
        events.collectedValue += 150
      } else if (hero.invincibleTimer <= 0) {
        applyHeroDamage(hero, events)
        if (events.stageDefeated) return events
      }
    }
  }

  // --------------------------------------------------------------------------
  // 13. V13 MULTI-PHASE STAGE BOSS ENCOUNTERS (ALL 5 STAGES)
  // --------------------------------------------------------------------------
  if (stage.boss && stage.boss.state !== 'defeated') {
    const boss = stage.boss
    if (boss.invulnTimer > 0) boss.invulnTimer = Math.max(0, boss.invulnTimer - dt)
    boss.stateTimer -= dt

    // Determine dynamic phase (4 phases for Blue Sentinel, 3 phases for Orange Crusher / Factory Overlord / Shadow Core)
    const hpRatio = boss.hp / boss.maxHp
    let targetPhase: 1 | 2 | 3 | 4 = 1
    if (boss.archetype === 'blue_sentinel_boss') {
      targetPhase = hpRatio <= 0.25 ? 4 : hpRatio <= 0.5 ? 3 : hpRatio <= 0.75 ? 2 : 1
    } else {
      targetPhase = hpRatio <= 0.34 ? 3 : hpRatio <= 0.67 ? 2 : 1
    }
    if (targetPhase !== boss.phase) {
      boss.phase = targetPhase
      events.bossPhaseChanged = targetPhase
    }

    const phaseSpeedMult =
      boss.phase === 4 ? 1.48 : boss.phase === 3 ? 1.35 : boss.phase === 2 ? 1.18 : 1.0

    // Stage 2 Boss (THE ORANGE CRUSHER): Magnetic Pull Zone in Phase 2+ during telegraph/shockwave
    if (
      boss.archetype === 'orange_crusher_boss' &&
      boss.phase >= 2 &&
      (boss.state === 'telegraph' || boss.state === 'shockwave')
    ) {
      const bossCenterX = boss.x + boss.w * 0.5
      const distX = bossCenterX - heroCenterX
      if (Math.abs(distX) < 340 && Math.abs(distX) > 42) {
        hero.x += Math.sign(distX) * 75 * dt
      }
    }

    // Update Arena Breaker Switches
    for (const brk of boss.breakers) {
      if (brk.cooldown > 0) {
        brk.cooldown = Math.max(0, brk.cooldown - dt)
        if (brk.cooldown === 0) brk.activated = false
      }
      if (
        !brk.activated &&
        aabbOverlap(hero.x, hero.y, hero.w, hero.h, brk.x - 24, brk.y - 46, 48, 50)
      ) {
        brk.activated = true
        brk.cooldown = 10.5
        damageBoss(boss, events)
      }
    }

    // Boss State Machine
    if (boss.state === 'patrol') {
      boss.x += boss.vx * phaseSpeedMult * dt
      if (boss.x <= boss.minX) {
        boss.x = boss.minX
        boss.vx = Math.abs(boss.vx)
      } else if (boss.x + boss.w >= boss.maxX) {
        boss.x = boss.maxX - boss.w
        boss.vx = -Math.abs(boss.vx)
      }

      if (boss.stateTimer <= 0) {
        boss.state = 'telegraph'
        boss.stateTimer = boss.phase >= 3 ? 0.62 : 0.82
        // Stage 4 Boss (THE BLUE SENTINEL): Teleportation step in Phase 2+
        if (boss.archetype === 'blue_sentinel_boss' && boss.phase >= 2) {
          const span = boss.maxX - boss.minX - boss.w
          if (span > 100) {
            const targetX =
              heroCenterX < (boss.minX + boss.maxX) * 0.5
                ? boss.maxX - boss.w - 40
                : boss.minX + 40
            boss.x = Math.max(boss.minX, Math.min(boss.maxX - boss.w, targetX))
          }
        }
      }
    } else if (boss.state === 'telegraph') {
      if (boss.stateTimer <= 0) {
        boss.state = 'shockwave'
        boss.stateTimer = 1.5
        boss.shockwaveActive = true
        boss.shockwaveLeftX = boss.x + boss.w * 0.25
        boss.shockwaveRightX = boss.x + boss.w * 0.75
        boss.shockwaveY = stage.groundY - 36

        // Spawn aimed projectiles based on Boss Archetype & Phase
        const count =
          boss.archetype === 'street_guardian_boss'
            ? boss.phase >= 2
              ? 2
              : 1
            : boss.phase >= 3
            ? 3
            : boss.phase === 2
            ? 2
            : 1

        const projColor =
          boss.archetype === 'orange_crusher_boss'
            ? '#F97316'
            : boss.archetype === 'factory_overlord_boss'
            ? '#FACC15'
            : boss.archetype === 'blue_sentinel_boss'
            ? '#38BDF8'
            : boss.archetype === 'shadow_core_boss' || boss.archetype === 'electric_dark_king_boss'
            ? '#F43F5E'
            : '#0EA5E9'

        for (let i = 0; i < count; i++) {
          const angle =
            Math.atan2(heroCenterY - (boss.y + 30), heroCenterX - (boss.x + boss.w * 0.5)) +
            (i - (count - 1) * 0.5) * 0.22
          const spd = 230 + boss.phase * 24
          boss.projectiles.push({
            id: Date.now() + i,
            x: boss.x + boss.w * 0.5,
            y: boss.y + 32,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            radius: 9,
            color: projColor,
            life: 3.2,
          })
        }
      }
    } else if (boss.state === 'shockwave') {
      const waveSpeed = 290 * phaseSpeedMult
      boss.shockwaveLeftX -= waveSpeed * dt
      boss.shockwaveRightX += waveSpeed * dt
      if (boss.stateTimer <= 0) {
        boss.shockwaveActive = false
        boss.state = 'vulnerable'
        boss.stateTimer = boss.phase >= 3 ? 1.8 : 2.2
      }
    } else if (boss.state === 'vulnerable') {
      if (boss.stateTimer <= 0) {
        boss.state = 'patrol'
        boss.stateTimer = boss.phase >= 3 ? 1.85 : 2.5
      }
    }

    // Update Boss Projectiles
    for (let i = boss.projectiles.length - 1; i >= 0; i--) {
      const proj = boss.projectiles[i]
      proj.x += proj.vx * dt
      proj.y += proj.vy * dt
      proj.life -= dt
      if (proj.life <= 0) {
        boss.projectiles.splice(i, 1)
        continue
      }
      if (
        hero.invincibleTimer <= 0 &&
        aabbOverlap(
          hero.x + 4,
          hero.y + 4,
          hero.w - 8,
          hero.h - 8,
          proj.x - proj.radius,
          proj.y - proj.radius,
          proj.radius * 2,
          proj.radius * 2
        )
      ) {
        boss.projectiles.splice(i, 1)
        applyHeroDamage(hero, events)
        if (events.stageDefeated) return events
      }
    }

    // Check Shockwave Collision with Hero
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
      const isFallingOnBossTop = hero.vy > 0 && heroBottom - hero.vy * dt <= boss.y + 30
      if (isFallingOnBossTop && boss.invulnTimer <= 0) {
        hero.vy = -520
        hero.onGround = false
        hero.doubleJumpAvailable = true
        damageBoss(boss, events)
      } else if (hero.invincibleTimer <= 0 && boss.invulnTimer <= 0) {
        applyHeroDamage(hero, events)
        if (events.stageDefeated) return events
      }
    }
  }

  // --------------------------------------------------------------------------
  // 14. GOAL PORTAL COMPLETION CHECK
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
  // 15. RESOLVE HERO ANIMATION STATE (ALL 12 STATES — SECTION 3)
  // --------------------------------------------------------------------------
  if (hero.damageTimer > 0) {
    hero.animState = 'damage'
  } else if (hero.dashTimer > 0) {
    hero.animState = 'dash'
  } else if (hero.attackTimer > 0) {
    hero.animState = 'attacking'
  } else if (hero.collectAnimTimer > 0 && hero.onGround && Math.abs(hero.vx) < 25) {
    hero.animState = 'collecting'
  } else if (!hero.onGround) {
    if (hero.vy < -430) {
      hero.animState = 'jump_prep'
    } else if (hero.vy < 0) {
      hero.animState = 'jump_ascent'
    } else {
      hero.animState = 'falling'
    }
  } else if (hero.landingTimer > 0 && Math.abs(hero.vx) < 45) {
    hero.animState = 'landing'
  } else if (Math.abs(hero.vx) > 255) {
    hero.animState = 'run'
    hero.walkCycle += Math.abs(hero.vx) * dt * 0.052
  } else if (Math.abs(hero.vx) > 14) {
    hero.animState = 'walk'
    hero.walkCycle += Math.abs(hero.vx) * dt * 0.048
  } else {
    hero.animState = 'idle'
    hero.walkCycle += dt * 3.2
  }

  return events
}

function applyHeroDamage(
  hero: HeroPhysicsState,
  events: StepSimulationEvents,
  bypassShield = false
) {
  if (!bypassShield && hero.shieldTimer > 0) {
    hero.shieldTimer = 0
    hero.invincibleTimer = 1.2
    events.shieldBlocked = true
    return
  }
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
    boss.projectiles = []
    events.bossDefeated = true
    events.collectedValue += 1000
  } else {
    boss.state = 'patrol'
    boss.stateTimer = 2.2
    boss.vx = boss.vx > 0 ? 145 : -145
  }
}

/**
  * V9 Professional Wide Camera System:
  * - Adaptive horizontal framing (character at ~38% of screen width when moving right)
  * - Horizontal dead-zone (cam.focusX) preventing camera oscillation on minor movements
  * - Gradual frame-rate-independent directional look-ahead (cam.lookAheadX)
  * - Controlled Dash camera tracking without overshoot or shake
  * - Dedicated Boss Combat camera mode (cam.bossBlend) keeping Hero + Boss + Hazards visible
  * - Generous Vertical Dead-Zone & Platform-Lock (cam.focusY) so normal jumps never move the camera
  */
export function updateSideScrollingCamera(
  cam: CameraState,
  hero: HeroPhysicsState,
  stage: StageDefinition,
  dt: number
): void {
  const safeDt = Math.max(0.001, Math.min(0.05, dt))

  const heroCenterX = hero.x + hero.w * 0.5
  const heroBottom = hero.y + hero.h

  // 1. Horizontal Dead Zone (cam.focusX)
  // Within the dead zone, small movements or brief taps do not move the camera
  if (cam.focusX === undefined || Number.isNaN(cam.focusX)) {
    cam.focusX = heroCenterX
  }
  const deadZoneHalfW = 28
  if (heroCenterX > cam.focusX + deadZoneHalfW) {
    cam.focusX = heroCenterX - deadZoneHalfW
  } else if (heroCenterX < cam.focusX - deadZoneHalfW) {
    cam.focusX = heroCenterX + deadZoneHalfW
  }

  // 2. Smooth Directional Look-Ahead (cam.lookAheadX)
  // Places character around ~38% from left edge when moving right, smoothly shifting when moving left
  if (cam.lookAheadX === undefined || Number.isNaN(cam.lookAheadX)) {
    cam.lookAheadX = cam.viewportW * 0.1
  }
  const maxRightOffset = Math.min(135, cam.viewportW * 0.13)
  const maxLeftOffset = -Math.min(85, cam.viewportW * 0.08)

  let targetLookAhead = cam.lookAheadX
  if (hero.vx > 35) {
    targetLookAhead = maxRightOffset
  } else if (hero.vx < -35) {
    targetLookAhead = maxLeftOffset
  } else if (Math.abs(hero.vx) < 8) {
    // Hold steady when standing still so tapping turn does not oscillate
    targetLookAhead = cam.lookAheadX
  }

  // Smooth exponential transition for look-ahead (prevents snapping on direction change)
  const lookAheadAlpha = 1 - Math.exp(-3.2 * safeDt)
  cam.lookAheadX += (targetLookAhead - cam.lookAheadX) * lookAheadAlpha

  // Base horizontal target places focusX around 45% of viewport, plus directional lookAheadX
  // When moving right, hero sits around ~37-40% from the left edge, revealing ~60% ahead
  const baseAnchorRatio = 0.46
  let desiredCamX = cam.focusX + cam.lookAheadX - cam.viewportW * baseAnchorRatio

  // 3. Dedicated Boss Fight Camera Framing (No Zoom Changes — Pure Horizontal Framing)
  if (cam.bossBlend === undefined || Number.isNaN(cam.bossBlend)) {
    cam.bossBlend = 0
  }
  const inBossEncounter = Boolean(
    stage.boss && stage.boss.state !== 'defeated' && hero.x > stage.boss.minX - 260
  )
  const targetBossBlend = inBossEncounter ? 1 : 0
  cam.bossBlend += (targetBossBlend - cam.bossBlend) * (1 - Math.exp(-3.5 * safeDt))

  if (cam.bossBlend > 0.01 && stage.boss) {
    const bossCenterX = stage.boss.x + stage.boss.w * 0.5
    const arenaMidX = (stage.boss.minX + stage.boss.maxX) * 0.5
    // Frame the combat midpoint between Hero, Boss, and Arena so both Hero & Boss remain visible
    const combatCenter = heroCenterX * 0.45 + bossCenterX * 0.35 + arenaMidX * 0.2
    const bossCamX = combatCenter - cam.viewportW * 0.5
    desiredCamX = desiredCamX * (1 - cam.bossBlend * 0.65) + bossCamX * (cam.bossBlend * 0.65)
  }

  // 4. Hard Character Visibility Guarantee
  // Never allow the camera to leave the character near or outside screen edges
  const minHeroScreenMargin = cam.viewportW * 0.18
  const maxHeroScreenMargin = cam.viewportW * 0.82
  if (heroCenterX - desiredCamX < minHeroScreenMargin) {
    desiredCamX = heroCenterX - minHeroScreenMargin
  } else if (heroCenterX - desiredCamX > maxHeroScreenMargin) {
    desiredCamX = heroCenterX - maxHeroScreenMargin
  }

  // 5. World Boundary Clamping (Horizontal: strictly [0, maxCamX])
  const maxCamX = Math.max(0, stage.width - cam.viewportW)
  const clampedTargetX = Math.max(0, Math.min(maxCamX, desiredCamX))

  // Controlled horizontal follow speed (prevents overshoot during dash while remaining responsive)
  const followRateX = hero.dashTimer > 0 ? 6.8 : 8.5
  const alphaX = 1 - Math.exp(-followRateX * safeDt)
  cam.x += (clampedTargetX - cam.x) * alphaX
  cam.x = Math.max(0, Math.min(maxCamX, cam.x))

  // 6. Stable Vertical Framing & World Boundary Clamping (Vertical: strictly [0, maxCamY])
  // Do NOT follow normal jumps or double jumps! Only update vertical focus when grounded on a high platform
  if (cam.focusY === undefined || Number.isNaN(cam.focusY)) {
    cam.focusY = stage.groundY
  }
  if (hero.onGround) {
    cam.focusY = heroBottom
  } else if (heroBottom > stage.groundY) {
    cam.focusY = stage.groundY
  } else if (heroBottom < cam.focusY - 220) {
    cam.focusY = heroBottom + 220
  }

  const maxCamY = Math.max(0, stage.height - cam.viewportH)
  if (maxCamY <= 0) {
    cam.y = 0
  } else {
    const highPlatformThreshold = stage.groundY - 145
    const desiredCamY =
      cam.focusY < highPlatformThreshold
        ? Math.max(0, Math.min(maxCamY, cam.focusY - cam.viewportH * 0.62))
        : maxCamY
    const alphaY = 1 - Math.exp(-5.2 * safeDt)
    cam.y += (desiredCamY - cam.y) * alphaY
    cam.y = Math.max(0, Math.min(maxCamY, cam.y))
  }

  // Eliminate artificial camera shake during normal gameplay
  cam.shakeIntensity = 0
}
