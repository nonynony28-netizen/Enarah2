import {
  type StageDefinition,
  type PlatformData,
  type CollectibleStar,
  type PlatformEnemy,
  type BossGuardian
} from './platformerWorlds'
import { type HeroPhysicsState, type CameraState } from './platformerPhysics'

export interface FloatingScorePopup {
  id: number
  x: number
  y: number
  text: string
  color: string
  alpha: number
  vy: number
}

export interface LightParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  life: number
  maxLife: number
}

/**
 * Renders the complete 2.5D side-scrolling platformer frame onto the HTML5 Canvas.
 */
export function renderPlatformerFrame(
  ctx: CanvasRenderingContext2D,
  stage: StageDefinition,
  hero: HeroPhysicsState,
  cam: CameraState,
  elapsedSec: number,
  particles: LightParticle[],
  popups: FloatingScorePopup[],
  reducedMotion = false
): void {
  const W = cam.viewportW
  const H = cam.viewportH

  ctx.save()
  ctx.clearRect(0, 0, W, H)

  // ==========================================================================
  // LAYER 1 — DISTANT SKY & ATMOSPHERIC ILLUMINATION (0.05x Parallax)
  // ==========================================================================
  renderSkyAndAtmosphere(ctx, stage, cam, elapsedSec, W, H)

  // ==========================================================================
  // LAYER 2 — FAR HORIZON SKYLINE / INDUSTRIAL SILHOUETTE (0.18x Parallax)
  // ==========================================================================
  renderFarParallaxLayer(ctx, stage, cam, elapsedSec, W, H, reducedMotion)

  // ==========================================================================
  // LAYER 3 — MIDGROUND ARCHITECTURE, SHOWROOMS, GEARS & CABLES (0.42x Parallax)
  // ==========================================================================
  renderMidgroundParallaxLayer(ctx, stage, cam, elapsedSec, W, H, reducedMotion)

  // ==========================================================================
  // LAYER 4 — GAMEPLAY LAYER (2.5D Platforms, Objects, Enemies, Boss & Hero)
  // ==========================================================================
  ctx.save()
  ctx.translate(-Math.round(cam.x), -Math.round(cam.y))

  // 4A. Checkpoints (Street Lamps & Light Beacons)
  for (const cp of stage.checkpoints) {
    if (cp.x + 80 < cam.x || cp.x - 80 > cam.x + W) continue
    renderCheckpointBeacon(ctx, cp.x, cp.y, cp.activated, cp.labelAr, elapsedSec)
  }

  // 4B. Electrical Switches
  for (const sw of stage.switches) {
    if (sw.x + 80 < cam.x || sw.x - 80 > cam.x + W) continue
    renderStageSwitch(ctx, sw.x, sw.y, sw.activated, sw.labelAr, elapsedSec)
  }

  // 4C. 2.5D Platforms (Beveled top/front/side depth planes + material textures)
  for (const plat of stage.platforms) {
    if (plat.x + plat.w < cam.x - 40 || plat.x > cam.x + W + 40) continue
    render25DPlatform(ctx, plat, elapsedSec)
  }

  // 4D. Energy Gates
  for (const gate of stage.gates) {
    if (gate.x + gate.w < cam.x - 40 || gate.x > cam.x + W + 40) continue
    renderEnergyGate(ctx, gate.x, gate.y, gate.w, gate.h, gate.isOpen, gate.labelAr, elapsedSec)
  }

  // 4E. Timed Hazards
  for (const haz of stage.hazards) {
    if (haz.x + haz.w < cam.x - 40 || haz.x > cam.x + W + 40) continue
    let active = true
    if (haz.kind === 'timed_arc' && haz.period && haz.onTime) {
      const phase = (elapsedSec + (haz.offset || 0)) % haz.period
      active = phase < haz.onTime
    }
    renderStageHazard(ctx, haz.x, haz.y, haz.w, haz.h, active, elapsedSec)
  }

  // 4F. Goal Portal (Master Breaker / Light Sanctuary Portal)
  const bossLocked = Boolean(stage.boss && stage.boss.state !== 'defeated')
  renderGoalPortal(
    ctx,
    stage.goalPortal.x,
    stage.goalPortal.y,
    stage.goalPortal.labelAr,
    bossLocked,
    elapsedSec
  )

  // 4G. Collectibles (نجوم الطاقة, Copper Coils, Light Capsules)
  for (const item of stage.collectibles) {
    if (item.collected) continue
    if (item.x + 40 < cam.x || item.x - 40 > cam.x + W) continue
    renderCollectibleItem(ctx, item, elapsedSec, reducedMotion)
  }

  // 4H. Enemies
  for (const enemy of stage.enemies) {
    if (enemy.defeated) continue
    if (enemy.x + enemy.w < cam.x - 40 || enemy.x > cam.x + W + 40) continue
    renderPlatformEnemy(ctx, enemy, elapsedSec)
  }

  // 4I. World 5 Boss Guardian & Arena Breakers
  if (stage.boss) {
    renderBossEncounter(ctx, stage.boss, elapsedSec)
  }

  // 4J. Original Main Character (بطل الإنارة)
  renderOriginalHeroCharacter(ctx, hero, elapsedSec)

  // 4K. Particles & Floating Score Popups
  for (const pt of particles) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, pt.alpha)
    ctx.fillStyle = pt.color
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  for (const pop of popups) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, pop.alpha)
    ctx.font = 'bold 14px Cairo, Tajawal, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#0F172A'
    ctx.fillText(pop.text, pop.x + 1, pop.y + 1)
    ctx.fillStyle = pop.color
    ctx.fillText(pop.text, pop.x, pop.y)
    ctx.restore()
  }

  ctx.restore()

  // ==========================================================================
  // LAYER 5 — SUBTLE FOREGROUND ATMOSPHERIC VIGNETTE & DEPTH MOTES
  // ==========================================================================
  renderForegroundDepthLayer(ctx, stage, cam, elapsedSec, W, H, reducedMotion)

  ctx.restore()
}

// ============================================================================
// LAYER 1: SKY & ATMOSPHERIC LIGHTING
// ============================================================================
function renderSkyAndAtmosphere(
  ctx: CanvasRenderingContext2D,
  stage: StageDefinition,
  cam: CameraState,
  elapsedSec: number,
  W: number,
  H: number
) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H)
  skyGrad.addColorStop(0, stage.skyTop)
  skyGrad.addColorStop(1, stage.skyBottom)
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, W, H)

  const sunX = W * 0.78 - (cam.x * 0.03) % (W * 0.5)
  const sunY = H * 0.2

  if (stage.theme === 'city_lights') {
    // Warm cheerful sun + soft volumetric clouds
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 130)
    sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)')
    sunGlow.addColorStop(0.35, 'rgba(253, 224, 71, 0.35)')
    sunGlow.addColorStop(1, 'rgba(253, 224, 71, 0)')
    ctx.fillStyle = sunGlow
    ctx.beginPath()
    ctx.arc(sunX, sunY, 130, 0, Math.PI * 2)
    ctx.fill()

    // Soft layered clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 260 - cam.x * 0.08 + elapsedSec * 8) % (W + 260)) - 100
      const cy = 58 + (i % 3) * 34
      drawStylizedCloud(ctx, cx, cy, 46 + (i % 2) * 14)
    }
  } else {
    // Subtle stars / industrial ambient light shafts
    const glow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 150)
    glow.addColorStop(0, `${stage.accentColor}44`)
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(sunX, sunY, 150, 0, Math.PI * 2)
    ctx.fill()

    // Twinkling distant light points
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    for (let i = 0; i < 18; i++) {
      const sx = ((i * 97 - cam.x * 0.04) % W + W) % W
      const sy = 24 + ((i * 43) % 160)
      ctx.fillRect(sx, sy, 2, 2)
    }
  }
}

function drawStylizedCloud(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  ctx.arc(x, y, r * 0.65, 0, Math.PI * 2)
  ctx.arc(x + r * 0.55, y - r * 0.15, r * 0.8, 0, Math.PI * 2)
  ctx.arc(x + r * 1.15, y, r * 0.6, 0, Math.PI * 2)
  ctx.fill()
}

// ============================================================================
// LAYER 2: FAR HORIZON SKYLINE (0.18x Parallax)
// ============================================================================
function renderFarParallaxLayer(
  ctx: CanvasRenderingContext2D,
  stage: StageDefinition,
  cam: CameraState,
  elapsedSec: number,
  W: number,
  H: number,
  reducedMotion: boolean
) {
  const offset = -(cam.x * 0.18) % 220
  ctx.save()

  for (let x = offset - 220; x < W + 220; x += 220) {
    const seed = Math.abs(Math.round((x - offset) / 220))
    const bH = 140 + ((seed * 37) % 95)
    const bY = H - 70 - bH

    if (stage.theme === 'city_lights') {
      // Distant modern skyline in soft azure
      ctx.fillStyle = '#BAE6FD'
      ctx.fillRect(x + 12, bY, 92, bH)
      ctx.fillStyle = '#7DD3FC'
      ctx.fillRect(x + 114, bY + 28, 84, bH - 28)
    } else if (stage.theme === 'electric_factory') {
      // Industrial factory roofs & trusses
      ctx.fillStyle = '#1E293B'
      ctx.fillRect(x + 10, bY + 20, 180, bH - 20)
      // Sawtooth factory skylight roof
      ctx.beginPath()
      ctx.moveTo(x + 10, bY + 20)
      ctx.lineTo(x + 70, bY - 15)
      ctx.lineTo(x + 70, bY + 20)
      ctx.lineTo(x + 130, bY - 15)
      ctx.lineTo(x + 130, bY + 20)
      ctx.fill()
    } else if (stage.theme === 'copper_world') {
      // Giant copper-wound transformer towers in distance
      ctx.fillStyle = '#0F253E'
      ctx.fillRect(x + 25, bY, 70, bH)
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.28)'
      ctx.lineWidth = 4
      for (let cy = bY + 20; cy < H - 80; cy += 18) {
        ctx.beginPath()
        ctx.moveTo(x + 22, cy)
        ctx.lineTo(x + 98, cy)
        ctx.stroke()
      }
    } else if (stage.theme === 'future_city') {
      // Futuristic spires & neon trim
      ctx.fillStyle = '#1E1B4B'
      ctx.fillRect(x + 20, bY, 76, bH)
      ctx.fillStyle = 'rgba(139, 92, 246, 0.35)'
      ctx.fillRect(x + 26, bY + 8, 6, bH - 20)
      ctx.fillRect(x + 82, bY + 8, 6, bH - 20)
    } else {
      // Energy Fortress buttresses
      ctx.fillStyle = '#111827'
      ctx.fillRect(x + 15, bY - 10, 110, bH + 10)
      ctx.fillStyle = 'rgba(249, 115, 22, 0.22)'
      ctx.fillRect(x + 64, bY + 12, 12, bH - 24)
    }
  }

  ctx.restore()
}

// ============================================================================
// LAYER 3: MIDGROUND 2.5D ARCHITECTURE & DETAILS (0.42x Parallax)
// ============================================================================
function renderMidgroundParallaxLayer(
  ctx: CanvasRenderingContext2D,
  stage: StageDefinition,
  cam: CameraState,
  elapsedSec: number,
  W: number,
  H: number,
  reducedMotion: boolean
) {
  const step = 320
  const offset = -(cam.x * 0.42) % step
  ctx.save()

  for (let x = offset - step; x < W + step; x += step) {
    if (stage.theme === 'city_lights') {
      // Colorful buildings + ENARAH MODERN lighting showroom facade + trees
      // Building 1
      ctx.fillStyle = '#F8FAFC'
      ctx.fillRect(x + 20, H - 240, 130, 170)
      ctx.fillStyle = '#0284C7'
      ctx.fillRect(x + 16, H - 246, 138, 12)
      // Storefront awning ("الإنارة الحديثة")
      ctx.fillStyle = '#102A43'
      ctx.fillRect(x + 28, H - 150, 114, 24)
      ctx.fillStyle = '#38BDF8'
      ctx.font = 'bold 10px Cairo, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('الإنارة الحديثة', x + 85, H - 134)
      // Lit showroom window with warm chandelier glow
      ctx.fillStyle = '#FEF08A'
      ctx.fillRect(x + 34, H - 122, 102, 42)
      // Stylized green street tree
      ctx.fillStyle = '#78350F'
      ctx.fillRect(x + 205, H - 130, 12, 60)
      ctx.fillStyle = '#10B981'
      ctx.beginPath()
      ctx.arc(x + 211, H - 142, 28, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#34D399'
      ctx.beginPath()
      ctx.arc(x + 204, H - 150, 18, 0, Math.PI * 2)
      ctx.fill()
    } else if (stage.theme === 'electric_factory') {
      // Rotating industrial gears & overhead ducts
      const gearX = x + 130
      const gearY = H - 210
      const angle = reducedMotion ? 0 : elapsedSec * 0.8
      ctx.save()
      ctx.translate(gearX, gearY)
      ctx.rotate(angle)
      ctx.fillStyle = '#475569'
      ctx.beginPath()
      ctx.arc(0, 0, 44, 0, Math.PI * 2)
      ctx.fill()
      for (let t = 0; t < 8; t++) {
        ctx.rotate(Math.PI / 4)
        ctx.fillRect(-7, -54, 14, 14)
      }
      ctx.fillStyle = '#F59E0B'
      ctx.beginPath()
      ctx.arc(0, 0, 16, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Industrial pendant lamp
      ctx.strokeStyle = '#64748B'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x + 250, 0)
      ctx.lineTo(x + 250, 75)
      ctx.stroke()
      ctx.fillStyle = '#FDE047'
      ctx.beginPath()
      ctx.arc(x + 250, 82, 12, 0, Math.PI)
      ctx.fill()
    } else if (stage.theme === 'copper_world') {
      // Sweeping giant insulated copper cable catenaries
      ctx.strokeStyle = '#B45309'
      ctx.lineWidth = 10
      ctx.beginPath()
      ctx.moveTo(x, 110)
      ctx.quadraticCurveTo(x + step * 0.5, 190, x + step, 110)
      ctx.stroke()

      ctx.strokeStyle = '#F59E0B'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(x, 107)
      ctx.quadraticCurveTo(x + step * 0.5, 187, x + step, 107)
      ctx.stroke()
    } else if (stage.theme === 'future_city') {
      // Elevated glowing arches & digital light pillars
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'
      ctx.lineWidth = 4
      ctx.strokeRect(x + 40, H - 250, 110, 180)
      ctx.fillStyle = 'rgba(139, 92, 246, 0.18)'
      ctx.fillRect(x + 44, H - 246, 102, 172)
    } else {
      // Energy Fortress columns with glowing magma-orange conduits
      ctx.fillStyle = '#1E293B'
      ctx.fillRect(x + 60, 60, 48, H - 120)
      ctx.fillStyle = 'rgba(249, 115, 22, 0.45)'
      ctx.fillRect(x + 78, 60, 12, H - 120)
    }
  }

  ctx.restore()
}

// ============================================================================
// LAYER 4C: 2.5D BEVELED PLATFORMS & MATERIALS (SECTIONS 11 & 12)
// ============================================================================
function render25DPlatform(
  ctx: CanvasRenderingContext2D,
  p: PlatformData,
  elapsedSec: number
) {
  ctx.save()

  // Handle locked bridge (translucent holographic outline until switch is pressed)
  if (p.kind === 'bridge_locked' && !p.unlocked) {
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)'
    ctx.setLineDash([8, 6])
    ctx.lineWidth = 2.5
    ctx.strokeRect(p.x, p.y, p.w, p.h)
    ctx.restore()
    return
  }

  // Handle phased-out temporary platform
  if (p.kind === 'phase') {
    if (p.phaseState === 'phased_out') {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)'
      ctx.setLineDash([6, 6])
      ctx.strokeRect(p.x, p.y, p.w, p.h)
      ctx.restore()
      return
    }
    if (p.phaseState === 'stepping') {
      // Subtle warning pulse before phasing out
      ctx.globalAlpha = 0.65 + Math.sin(elapsedSec * 28) * 0.25
    }
  }

  // Handle Bouncy Copper Coil Spring Pad
  if (p.kind === 'spring') {
    const compress = (p.springCompress || 0) * 8
    const sy = p.y + compress
    const sh = Math.max(12, p.h - compress)

    // Base plate
    ctx.fillStyle = '#334155'
    ctx.fillRect(p.x, p.y + p.h - 6, p.w, 6)

    // Glowing copper coil spirals
    ctx.strokeStyle = '#F59E0B'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(p.x + 8, p.y + p.h - 6)
    ctx.lineTo(p.x + p.w - 8, sy + sh * 0.5)
    ctx.lineTo(p.x + 8, sy + 6)
    ctx.stroke()

    // Top bounce cap
    ctx.fillStyle = '#EA580C'
    ctx.fillRect(p.x - 2, sy, p.w + 4, 8)
    ctx.fillStyle = '#FDE047'
    ctx.fillRect(p.x + 4, sy + 1, p.w - 8, 3)
    ctx.restore()
    return
  }

  // Palette by Material (2.5D Top Bevel + Front Face + Bottom Trim)
  let topColor = '#CBD5E1'
  let frontColor = '#64748B'
  let trimColor = '#38BDF8'

  switch (p.material) {
    case 'concrete':
      topColor = '#E2E8F0'
      frontColor = '#64748B'
      trimColor = '#0284C7'
      break
    case 'brick':
      topColor = '#F1F5F9'
      frontColor = '#334155'
      trimColor = '#0EA5E9'
      break
    case 'steel':
      topColor = '#94A3B8'
      frontColor = '#334155'
      trimColor = '#F59E0B'
      break
    case 'copper':
      topColor = '#F59E0B'
      frontColor = '#9A3412'
      trimColor = '#FDE047'
      break
    case 'neon_glass':
      topColor = '#38BDF8'
      frontColor = '#1E1B4B'
      trimColor = '#A78BFA'
      break
    case 'fortress_stone':
      topColor = '#475569'
      frontColor = '#1E293B'
      trimColor = '#F97316'
      break
  }

  // Drop shadow for 2.5D depth
  ctx.fillStyle = 'rgba(8, 29, 53, 0.26)'
  ctx.fillRect(p.x + 4, p.y + 6, p.w, Math.min(p.h, 30))

  // Front face
  ctx.fillStyle = frontColor
  ctx.fillRect(p.x, p.y, p.w, p.h)

  // 2.5D Top Beveled Surface (8px cap)
  ctx.fillStyle = topColor
  ctx.fillRect(p.x, p.y, p.w, 8)

  // Glowing accent stripe below bevel
  ctx.fillStyle = trimColor
  ctx.fillRect(p.x, p.y + 8, p.w, 3)

  // Conveyor belt animated chevrons
  if (p.kind === 'conveyor') {
    const dir = Math.sign(p.conveyorSpeed || 1)
    const shift = ((elapsedSec * 45 * dir) % 24 + 24) % 24
    ctx.fillStyle = '#FDE047'
    for (let cx = p.x + shift; cx < p.x + p.w - 10; cx += 24) {
      ctx.fillRect(cx, p.y + 13, 8, 5)
    }
  }

  ctx.restore()
}

// ============================================================================
// LAYER 4J: ORIGINAL MAIN CHARACTER (بطل الإنارة — 11 ANIMATION STATES)
// ============================================================================
function renderOriginalHeroCharacter(
  ctx: CanvasRenderingContext2D,
  hero: HeroPhysicsState,
  elapsedSec: number
) {
  ctx.save()

  // Blink during post-damage invincibility
  if (hero.invincibleTimer > 0 && Math.floor(elapsedSec * 16) % 2 === 0) {
    ctx.globalAlpha = 0.55
  }

  const cx = hero.x + hero.w * 0.5
  const bottomY = hero.y + hero.h

  ctx.translate(cx, bottomY)
  ctx.scale(hero.facing === 'right' ? hero.scaleX : -hero.scaleX, hero.scaleY)

  // Soft ground shadow
  if (hero.onGround) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)'
    ctx.beginPath()
    ctx.ellipse(0, 0, 15, 4, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Compute limb swing from walkCycle & animState
  let legSwing = 0
  let armSwing = 0
  let bodyBob = 0

  if (hero.animState === 'walk') {
    legSwing = Math.sin(hero.walkCycle) * 7
    armSwing = -Math.sin(hero.walkCycle) * 8
    bodyBob = Math.abs(Math.cos(hero.walkCycle)) * -2
  } else if (hero.animState === 'run') {
    legSwing = Math.sin(hero.walkCycle) * 11
    armSwing = -Math.sin(hero.walkCycle) * 12
    bodyBob = Math.abs(Math.cos(hero.walkCycle)) * -3.5
  } else if (hero.animState === 'idle') {
    bodyBob = Math.sin(elapsedSec * 3.5) * -1.5
  } else if (hero.animState === 'jump_prep' || hero.animState === 'jump_ascent') {
    legSwing = 6
    armSwing = -10
    bodyBob = -2
  } else if (hero.animState === 'falling') {
    legSwing = -5
    armSwing = -12
  } else if (hero.animState === 'landing') {
    bodyBob = 3
  } else if (hero.animState === 'victory' || hero.animState === 'collecting') {
    armSwing = -14
    bodyBob = -3
  }

  // 1. Utility Power Backpack (Copper-trimmed with glowing energy core)
  ctx.fillStyle = '#1E293B'
  ctx.beginPath()
  ctx.roundRect(-16, -34 + bodyBob, 9, 18, 3)
  ctx.fill()
  ctx.fillStyle = '#F59E0B'
  ctx.fillRect(-15, -30 + bodyBob, 5, 10)

  // 2. Back Leg & Running Shoe
  ctx.fillStyle = '#1E3A8A'
  ctx.fillRect(-5 - legSwing * 0.4, -15 + bodyBob, 7, 11)
  ctx.fillStyle = '#F8FAFC'
  ctx.fillRect(-6 - legSwing * 0.4, -5, 10, 5)

  // 3. Blue Adventure Jacket Torso (ENARAH MODERN Royal Blue #0062D2 + Sky Accent)
  ctx.fillStyle = '#0062D2'
  ctx.beginPath()
  ctx.roundRect(-9, -33 + bodyBob, 18, 19, 5)
  ctx.fill()
  // Lightning chest emblem
  ctx.fillStyle = '#FACC15'
  ctx.fillRect(-2, -29 + bodyBob, 5, 8)

  // 4. Front Leg & Running Shoe
  ctx.fillStyle = '#1D4ED8'
  ctx.fillRect(-2 + legSwing * 0.4, -15 + bodyBob, 7, 11)
  ctx.fillStyle = '#38BDF8'
  ctx.fillRect(-2 + legSwing * 0.4, -5, 10, 5)

  // 5. Expressive Head & Visor Helmet
  ctx.fillStyle = '#FDE68A' // Warm character skin tone
  ctx.beginPath()
  ctx.arc(0, -40 + bodyBob, 10, 0, Math.PI * 2)
  ctx.fill()

  // Blue Adventure Helmet with glowing front headlamp
  ctx.fillStyle = '#0284C7'
  ctx.beginPath()
  ctx.arc(0, -42 + bodyBob, 10.5, Math.PI, 0)
  ctx.fill()
  // Cap visor
  ctx.fillStyle = '#102A43'
  ctx.fillRect(0, -43 + bodyBob, 13, 3.5)
  // Glowing Light Badge on Helmet
  ctx.fillStyle = '#FEF08A'
  ctx.beginPath()
  ctx.arc(6, -46 + bodyBob, 3.5, 0, Math.PI * 2)
  ctx.fill()

  // Expressive Eye
  ctx.fillStyle = '#0F172A'
  if (hero.animState === 'damage' || hero.animState === 'defeat') {
    ctx.fillRect(3, -40 + bodyBob, 4, 2)
  } else {
    ctx.beginPath()
    ctx.arc(4.5, -39 + bodyBob, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  // 6. Front Arm
  ctx.fillStyle = '#38BDF8'
  ctx.save()
  ctx.translate(2, -29 + bodyBob)
  ctx.rotate((armSwing * Math.PI) / 180)
  ctx.fillRect(-3, 0, 6, 12)
  ctx.restore()

  ctx.restore()
}

// ============================================================================
// COLLECTIBLES, CHECKPOINTS, SWITCHES, GATES, ENEMIES & BOSS
// ============================================================================
function renderCollectibleItem(
  ctx: CanvasRenderingContext2D,
  item: CollectibleStar,
  elapsedSec: number,
  reducedMotion: boolean
) {
  const bob = reducedMotion ? 0 : Math.sin(elapsedSec * 4 + item.x * 0.05) * 4
  const x = item.x
  const y = item.y + bob

  ctx.save()
  ctx.translate(x, y)

  // Soft golden aura
  const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, 18)
  aura.addColorStop(
    0,
    item.kind === 'copper_coil'
      ? 'rgba(245, 158, 11, 0.55)'
      : item.kind === 'light_capsule'
      ? 'rgba(56, 189, 248, 0.6)'
      : 'rgba(250, 204, 21, 0.55)'
  )
  aura.addColorStop(1, 'transparent')
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(0, 0, 18, 0, Math.PI * 2)
  ctx.fill()

  if (item.kind === 'copper_coil') {
    // Gleaming Italian Copper Coil Ring
    ctx.strokeStyle = '#EA580C'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(0, 0, 9, 0, Math.PI * 2)
    ctx.stroke()
    ctx.strokeStyle = '#FDE047'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(0, 0, 6, 0, Math.PI * 2)
    ctx.stroke()
  } else if (item.kind === 'light_capsule') {
    // Luminous Energy Capsule
    ctx.fillStyle = '#38BDF8'
    ctx.beginPath()
    ctx.roundRect(-8, -11, 16, 22, 8)
    ctx.fill()
    ctx.fillStyle = '#FEF08A'
    ctx.beginPath()
    ctx.arc(0, 0, 5, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // 5-Pointed Golden Energy Star (نجمة الطاقة)
    ctx.fillStyle = '#FACC15'
    ctx.strokeStyle = '#CA8A04'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const outerA = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const innerA = outerA + Math.PI / 5
      ctx.lineTo(Math.cos(outerA) * 11, Math.sin(outerA) * 11)
      ctx.lineTo(Math.cos(innerA) * 5, Math.sin(innerA) * 5)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  ctx.restore()
}

function renderCheckpointBeacon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  activated: boolean,
  labelAr: string,
  elapsedSec: number
) {
  ctx.save()
  // Pole
  ctx.fillStyle = '#334155'
  ctx.fillRect(x - 3, y - 64, 6, 64)
  // Lamp head
  ctx.fillStyle = activated ? '#FACC15' : '#64748B'
  ctx.beginPath()
  ctx.arc(x, y - 68, 11, 0, Math.PI * 2)
  ctx.fill()

  if (activated) {
    const glow = ctx.createRadialGradient(x, y - 68, 4, x, y - 68, 36)
    glow.addColorStop(0, 'rgba(250, 204, 21, 0.65)')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(x, y - 68, 36, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function renderStageSwitch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  activated: boolean,
  labelAr: string,
  elapsedSec: number
) {
  ctx.save()
  ctx.fillStyle = '#1E293B'
  ctx.fillRect(x - 16, y - 10, 32, 10)
  ctx.fillStyle = activated ? '#10B981' : '#F59E0B'
  const btnH = activated ? 5 : 12
  ctx.fillRect(x - 12, y - 10 - btnH, 24, btnH)
  ctx.restore()
}

function renderEnergyGate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  isOpen: boolean,
  labelAr: string,
  elapsedSec: number
) {
  ctx.save()
  if (isOpen) {
    ctx.fillStyle = 'rgba(16, 185, 129, 0.22)'
    ctx.fillRect(x, y, w, 16)
  } else {
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(x - 2, y, w + 4, 12)
    const pulse = 0.65 + Math.sin(elapsedSec * 10) * 0.25
    ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`
    ctx.fillRect(x + 4, y + 12, w - 8, h - 12)
  }
  ctx.restore()
}

function renderStageHazard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  active: boolean,
  elapsedSec: number
) {
  ctx.save()
  ctx.fillStyle = '#334155'
  ctx.fillRect(x, y + h - 6, w, 6)
  if (active) {
    ctx.strokeStyle = '#38BDF8'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let hx = x; hx <= x + w; hx += 12) {
      const hy = y + ((hx * 17 + Math.floor(elapsedSec * 40)) % 10)
      if (hx === x) ctx.moveTo(hx, hy)
      else ctx.lineTo(hx, hy)
    }
    ctx.stroke()
  }
  ctx.restore()
}

function renderPlatformEnemy(
  ctx: CanvasRenderingContext2D,
  enemy: PlatformEnemy,
  elapsedSec: number
) {
  ctx.save()
  const cx = enemy.x + enemy.w * 0.5
  const cy = enemy.y + enemy.h * 0.5

  // Robot chassis
  ctx.fillStyle =
    enemy.kind === 'cable_crawler'
      ? '#D97706'
      : enemy.kind === 'pulse_sentinel'
      ? '#7C3AED'
      : '#334155'
  ctx.beginPath()
  ctx.roundRect(enemy.x, enemy.y + 4, enemy.w, enemy.h - 10, 8)
  ctx.fill()

  // Top stomp pad indicator
  ctx.fillStyle = '#38BDF8'
  ctx.fillRect(enemy.x + 6, enemy.y + 2, enemy.w - 12, 4)

  // Glowing visor eye
  ctx.fillStyle = '#FACC15'
  const eyeOffset = enemy.vx >= 0 ? 5 : -5
  ctx.beginPath()
  ctx.arc(cx + eyeOffset, cy - 2, 4, 0, Math.PI * 2)
  ctx.fill()

  // Wheels
  ctx.fillStyle = '#0F172A'
  ctx.beginPath()
  ctx.arc(enemy.x + 9, enemy.y + enemy.h - 4, 5, 0, Math.PI * 2)
  ctx.arc(enemy.x + enemy.w - 9, enemy.y + enemy.h - 4, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function renderBossEncounter(
  ctx: CanvasRenderingContext2D,
  boss: BossGuardian,
  elapsedSec: number
) {
  ctx.save()

  // Render Arena Overload Breakers first
  for (const brk of boss.breakers) {
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(brk.x - 14, brk.y - 28, 28, 28)
    ctx.fillStyle = brk.activated ? '#10B981' : '#F97316'
    ctx.fillRect(brk.x - 9, brk.y - 23, 18, 12)
  }

  if (boss.state === 'defeated') {
    ctx.restore()
    return
  }

  // Render Shockwaves if active
  if (boss.shockwaveActive) {
    ctx.fillStyle = '#F97316'
    ctx.beginPath()
    ctx.arc(boss.shockwaveLeftX, boss.shockwaveY, 14, 0, Math.PI * 2)
    ctx.arc(boss.shockwaveRightX, boss.shockwaveY, 14, 0, Math.PI * 2)
    ctx.fill()
  }

  // Boss Body (Mechanical Energy Guardian)
  if (boss.invulnTimer > 0 && Math.floor(elapsedSec * 16) % 2 === 0) {
    ctx.globalAlpha = 0.6
  }

  ctx.fillStyle = '#1E293B'
  ctx.strokeStyle = boss.state === 'vulnerable' ? '#22C55E' : '#F97316'
  ctx.lineWidth = 3.5
  ctx.beginPath()
  ctx.roundRect(boss.x, boss.y, boss.w, boss.h, 14)
  ctx.fill()
  ctx.stroke()

  // Top Vulnerable Energy Core
  ctx.fillStyle = boss.state === 'vulnerable' ? '#4ADE80' : '#FACC15'
  ctx.beginPath()
  ctx.arc(boss.x + boss.w * 0.5, boss.y + 8, 14, Math.PI, 0)
  ctx.fill()

  // Expressive Core Visor
  ctx.fillStyle = boss.state === 'telegraph' ? '#EF4444' : '#38BDF8'
  ctx.fillRect(boss.x + 16, boss.y + 26, boss.w - 32, 16)

  // HP Bar above Boss
  const barW = 80
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'
  ctx.fillRect(boss.x + 2, boss.y - 20, barW, 8)
  ctx.fillStyle = '#F97316'
  ctx.fillRect(boss.x + 2, boss.y - 20, (barW * boss.hp) / boss.maxHp, 8)

  ctx.restore()
}

function renderGoalPortal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  labelAr: string,
  locked: boolean,
  elapsedSec: number
) {
  ctx.save()
  const portalColor = locked ? '#64748B' : '#38BDF8'
  const innerColor = locked ? '#334155' : '#FEF08A'

  // Archway pillars
  ctx.fillStyle = '#102A43'
  ctx.fillRect(x - 26, y - 68, 52, 78)

  // Glowing portal vortex
  ctx.fillStyle = portalColor
  ctx.beginPath()
  ctx.roundRect(x - 18, y - 60, 36, 68, 16)
  ctx.fill()

  if (!locked) {
    const pulse = 10 + Math.sin(elapsedSec * 5) * 3
    ctx.fillStyle = innerColor
    ctx.beginPath()
    ctx.arc(x, y - 28, pulse, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

function renderForegroundDepthLayer(
  ctx: CanvasRenderingContext2D,
  stage: StageDefinition,
  cam: CameraState,
  elapsedSec: number,
  W: number,
  H: number,
  reducedMotion: boolean
) {
  if (reducedMotion) return
  ctx.save()
  ctx.fillStyle = 'rgba(254, 240, 138, 0.22)'
  for (let i = 0; i < 6; i++) {
    const fx = ((i * 210 - cam.x * 1.12 + elapsedSec * 14) % W + W) % W
    const fy = H - 35 - ((i * 53) % 90)
    ctx.beginPath()
    ctx.arc(fx, fy, 3, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}
