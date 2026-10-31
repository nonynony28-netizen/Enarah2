import {
  type StageDefinition,
  type PlatformData,
  type CollectibleStar,
  type PlatformEnemy,
  type BossGuardian,
  type StageHazard,
  PRODUCT_CATALOG_META,
} from './platformerWorlds'
import { type HeroPhysicsState, type CameraState, isPlatformSolid } from './platformerPhysics'

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

  // Subtle camera impact shake when boss hits or damage occurs
  if (!reducedMotion && cam.shakeIntensity && cam.shakeIntensity > 0.2) {
    const sx = (Math.random() - 0.5) * cam.shakeIntensity
    const sy = (Math.random() - 0.5) * cam.shakeIntensity
    ctx.translate(sx, sy)
  }

  // LAYER 1 — DISTANT SKY & ATMOSPHERIC ILLUMINATION (0.05x Parallax)
  renderSkyAndAtmosphere(ctx, stage, cam, elapsedSec, W, H)

  // LAYER 2 — FAR HORIZON SKYLINE / INDUSTRIAL SILHOUETTE (0.18x Parallax)
  renderFarParallaxLayer(ctx, stage, cam, elapsedSec, W, H, reducedMotion)

  // LAYER 3 — MIDGROUND ARCHITECTURE, ELECTRICAL SHOPS & DETAILS (0.42x Parallax)
  renderMidgroundParallaxLayer(ctx, stage, cam, elapsedSec, W, H, reducedMotion)

  // LAYER 4 — GAMEPLAY LAYER (2.5D Platforms, Products, Enemies, Boss & LED Bulb Hero)
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
    render25DPlatform(ctx, plat, hero, elapsedSec)
  }

  // 4D. Energy Gates & Security Doors
  for (const gate of stage.gates) {
    if (gate.x + gate.w < cam.x - 40 || gate.x > cam.x + W + 40) continue
    renderEnergyGate(ctx, gate.x, gate.y, gate.w, gate.h, gate.isOpen, gate.labelAr, elapsedSec)
  }

  // 4E. Hazards (Timed Arcs, Rotating Hazards, Mechanical Presses)
  for (const haz of stage.hazards) {
    if (haz.x + haz.w < cam.x - 80 || haz.x > cam.x + W + 80) continue
    renderStageHazard(ctx, haz, elapsedSec)
  }

  // 4F. Goal Portal (Showroom Sanctuary / Master Breaker Portal)
  const bossLocked = Boolean(stage.boss && stage.boss.state !== 'defeated')
  renderGoalPortal(
    ctx,
    stage.goalPortal.x,
    stage.goalPortal.y,
    stage.goalPortal.labelAr,
    bossLocked,
    elapsedSec
  )

  // 4G. Electrical Product Collectibles (Wires, Bulbs, Spotlights, Intercoms, etc.)
  for (const item of stage.collectibles) {
    if (item.collected) continue
    if (item.x + 40 < cam.x || item.x - 40 > cam.x + W) continue
    renderCollectibleItem(ctx, item, elapsedSec, reducedMotion)
  }

  // 4H. 8 Unique Enemy Types
  for (const enemy of stage.enemies) {
    if (enemy.defeated) continue
    if (enemy.x + enemy.w < cam.x - 40 || enemy.x > cam.x + W + 40) continue
    renderPlatformEnemy(ctx, enemy, elapsedSec)
  }

  // 4I. Boss Encounter & Projectiles
  if (stage.boss) {
    renderBossEncounter(ctx, stage.boss, elapsedSec)
  }

  // 4J. Redesigned Anthropomorphic LED Light Bulb Hero (بطل الإنارة)
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
    ctx.font = 'bold 13px Cairo, Tajawal, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#0F172A'
    ctx.fillText(pop.text, pop.x + 1, pop.y + 1)
    ctx.fillStyle = pop.color
    ctx.fillText(pop.text, pop.x, pop.y)
    ctx.restore()
  }

  ctx.restore()

  // LAYER 5 — BLACKOUT ILLUMINATION MASK (Level 6 Dark City) & FOREGROUND DEPTH
  if (stage.darknessLevel && stage.darknessLevel > 0) {
    renderBlackoutIlluminationMask(ctx, stage, hero, cam, W, H)
  }
  renderForegroundDepthLayer(ctx, stage, cam, elapsedSec, W, H, reducedMotion)

  ctx.restore()
}

// ============================================================================
// PARALLAX ENVIRONMENT LAYERS (STYLIZED-REALISTIC 2.5D DEPTH — SECTION 10)
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

  const sunX = W * 0.76 - cam.x * 0.04
  const sunY = H * 0.2
  const glowGrad = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 150)

  if (stage.theme === 'city_of_light') {
    glowGrad.addColorStop(0, 'rgba(255, 251, 235, 0.92)')
    glowGrad.addColorStop(0.35, 'rgba(253, 224, 71, 0.35)')
    glowGrad.addColorStop(1, 'rgba(253, 224, 71, 0)')
  } else {
    glowGrad.addColorStop(0, 'rgba(248, 250, 252, 0.35)')
    glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)')
  }
  ctx.fillStyle = glowGrad
  ctx.beginPath()
  ctx.arc(sunX, sunY, 150, 0, Math.PI * 2)
  ctx.fill()

  // Soft clouds for daytime city, subtle stars for night/industrial levels
  if (stage.theme === 'city_of_light') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
    for (let i = 0; i < 5; i++) {
      const cx = ((i * 270 - cam.x * 0.07 + elapsedSec * 7) % (W + 240)) - 120
      const cy = 58 + (i % 3) * 32
      ctx.beginPath()
      ctx.arc(cx, cy, 24, 0, Math.PI * 2)
      ctx.arc(cx + 20, cy - 6, 30, 0, Math.PI * 2)
      ctx.arc(cx + 42, cy, 22, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    for (let i = 0; i < 18; i++) {
      const sx = ((i * 97 - cam.x * 0.03) % W + W) % W
      const sy = 24 + ((i * 43) % 180)
      const pulse = 0.25 + 0.35 * Math.sin(elapsedSec * 2 + i)
      ctx.fillStyle = `rgba(255, 255, 255, ${pulse.toFixed(2)})`
      ctx.fillRect(sx, sy, 2, 2)
    }
  }
}

function renderFarParallaxLayer(
  ctx: CanvasRenderingContext2D,
  stage: StageDefinition,
  cam: CameraState,
  elapsedSec: number,
  W: number,
  H: number,
  reducedMotion: boolean
) {
  const scrollX = cam.x * 0.18
  const baseHorizonY = H - 60

  for (let i = -1; i < 11; i++) {
    const bx = i * 170 - (scrollX % 170)
    const seed = Math.abs(i + Math.floor(scrollX / 170))
    const bw = 115 + (seed % 3) * 22
    const bh = 130 + (seed % 5) * 36
    const by = baseHorizonY - bh

    ctx.fillStyle =
      stage.theme === 'city_of_light'
        ? '#94A3B8'
        : stage.theme === 'dark_city'
        ? '#090D16'
        : '#1E293B'
    ctx.fillRect(bx, by, bw, bh)

    // Subtle 2.5D side bevel on background buildings
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
    ctx.fillRect(bx + bw - 14, by, 14, bh)

    // Lit architectural windows (off during Dark City blackout!)
    if (stage.theme !== 'dark_city') {
      ctx.fillStyle =
        stage.theme === 'city_of_light'
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(253, 224, 71, 0.22)'
      for (let wy = by + 18; wy < baseHorizonY - 24; wy += 26) {
        for (let wx = bx + 14; wx < bx + bw - 26; wx += 24) {
          ctx.fillRect(wx, wy, 10, 14)
        }
      }
    }
  }

  // Wind streamlines in Level 7 (برج الإنارة)
  if (stage.windForce && !reducedMotion) {
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.22)'
    ctx.lineWidth = 1.5
    for (let i = 0; i < 8; i++) {
      const wx = ((W - ((elapsedSec * 220 + i * 140) % (W + 160)))) - 80
      const wy = 70 + (i * 53) % (H - 140)
      ctx.beginPath()
      ctx.moveTo(wx, wy)
      ctx.lineTo(wx + 55, wy)
      ctx.stroke()
    }
  }
}

function renderMidgroundParallaxLayer(
  ctx: CanvasRenderingContext2D,
  stage: StageDefinition,
  cam: CameraState,
  elapsedSec: number,
  W: number,
  H: number,
  reducedMotion: boolean
) {
  const scrollX = cam.x * 0.42
  const groundLine = H - 55

  for (let i = -1; i < 8; i++) {
    const mx = i * 260 - (scrollX % 260)
    const idx = Math.abs(i + Math.floor(scrollX / 260))

    if (stage.theme === 'city_of_light' || stage.theme === 'electricity_street') {
      // Realistic ENARAH MODERN electrical & lighting store facades
      const bH = 145 + (idx % 2) * 30
      const bY = groundLine - bH
      ctx.fillStyle = stage.theme === 'city_of_light' ? '#E2E8F0' : '#1E293B'
      ctx.fillRect(mx + 20, bY, 175, bH)
      // 2.5D side depth wall
      ctx.fillStyle = stage.theme === 'city_of_light' ? '#CBD5E1' : '#0F172A'
      ctx.fillRect(mx + 195, bY + 6, 18, bH - 6)

      // Storefront signboard
      ctx.fillStyle = '#0F172A'
      ctx.fillRect(mx + 28, groundLine - 68, 158, 22)
      ctx.fillStyle = '#38BDF8'
      ctx.font = 'bold 10px Cairo, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('الإنارة الحديثة • ENARAH', mx + 107, groundLine - 53)

      // Illuminated shop window displaying warm hanging pendant lights
      ctx.fillStyle = 'rgba(254, 243, 199, 0.35)'
      ctx.fillRect(mx + 34, groundLine - 44, 146, 38)
    } else if (stage.theme === 'lighting_factory' || stage.theme === 'power_station') {
      // Industrial rotating gears & copper busbars
      const gearX = mx + 120
      const gearY = groundLine - 115
      ctx.save()
      ctx.translate(gearX, gearY)
      if (!reducedMotion) ctx.rotate(elapsedSec * (idx % 2 === 0 ? 0.5 : -0.5))
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.28)'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(0, 0, 38, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    } else {
      // Smart residential villas / futuristic towers
      const vH = 135 + (idx % 3) * 25
      ctx.fillStyle = 'rgba(30, 41, 59, 0.65)'
      ctx.fillRect(mx + 30, groundLine - vH, 150, vH)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)'
      ctx.strokeRect(mx + 30, groundLine - vH, 150, vH)
    }
  }
}

// ============================================================================
// 2.5D BEVELED PLATFORMS (SECTION 10)
// ============================================================================

function render25DPlatform(
  ctx: CanvasRenderingContext2D,
  plat: PlatformData,
  hero: HeroPhysicsState,
  elapsedSec: number
) {
  if (plat.kind === 'bridge_locked' && !plat.unlocked) {
    ctx.save()
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.45)'
    ctx.setLineDash([8, 6])
    ctx.lineWidth = 2
    ctx.strokeRect(plat.x, plat.y, plat.w, plat.h)
    ctx.restore()
    return
  }

  // Secret Spotlight Platform visibility
  let alpha = 1
  if (plat.kind === 'secret_spotlight') {
    const solid = isPlatformSolid(plat, hero)
    alpha = solid ? 0.92 : 0.18
  } else if (plat.kind === 'phase') {
    if (plat.phaseState === 'phased_out') alpha = 0.16
    else if (plat.phaseState === 'stepping') alpha = 0.55 + 0.35 * Math.sin(elapsedSec * 24)
  }

  ctx.save()
  ctx.globalAlpha = alpha

  const { x, y, w, h, material, kind } = plat
  const bevelTop = 7
  const depthSide = 8

  let topColor = '#E2E8F0'
  let frontColor = '#475569'
  let sideColor = '#1E293B'
  let trimColor = '#38BDF8'

  if (material === 'brick') {
    topColor = '#FDE68A'
    frontColor = '#B45309'
    sideColor = '#78350F'
    trimColor = '#F59E0B'
  } else if (material === 'steel') {
    topColor = '#CBD5E1'
    frontColor = '#334155'
    sideColor = '#0F172A'
    trimColor = '#38BDF8'
  } else if (material === 'copper') {
    topColor = '#FDBA74'
    frontColor = '#C2410C'
    sideColor = '#7C2D12'
    trimColor = '#FB923C'
  } else if (material === 'neon_glass') {
    topColor = '#A5F3FC'
    frontColor = '#0E7490'
    sideColor = '#164E63'
    trimColor = '#22D3EE'
  } else if (material === 'fortress_stone') {
    topColor = '#94A3B8'
    frontColor = '#1E293B'
    sideColor = '#090D16'
    trimColor = '#F97316'
  }

  // Soft drop shadow under floating platforms
  if (h < 45) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.26)'
    ctx.fillRect(x + 6, y + h, w, 7)
  }

  if (kind === 'spring') {
    const comp = (plat.springCompress || 0) * 8
    ctx.fillStyle = '#334155'
    ctx.fillRect(x + 4, y + h - 8, w - 8, 8)
    ctx.strokeStyle = '#EA580C'
    ctx.lineWidth = 3.5
    ctx.beginPath()
    ctx.moveTo(x + 12, y + h - 8)
    ctx.lineTo(x + w - 12, y + h - 14 + comp * 0.5)
    ctx.lineTo(x + 12, y + h - 20 + comp)
    ctx.lineTo(x + w - 12, y + 6 + comp)
    ctx.stroke()
    ctx.fillStyle = '#F59E0B'
    ctx.fillRect(x, y + comp, w, 7)
    ctx.restore()
    return
  }

  // 2.5D Right-side depth plane
  ctx.fillStyle = sideColor
  ctx.beginPath()
  ctx.moveTo(x + w, y)
  ctx.lineTo(x + w + depthSide, y + 4)
  ctx.lineTo(x + w + depthSide, y + h)
  ctx.lineTo(x + w, y + h)
  ctx.closePath()
  ctx.fill()

  // Main front face
  ctx.fillStyle = frontColor
  ctx.fillRect(x, y + bevelTop, w, h - bevelTop)

  // Top walk surface
  ctx.fillStyle = topColor
  ctx.fillRect(x, y, w, bevelTop)

  // Trim line
  ctx.fillStyle = trimColor
  ctx.fillRect(x, y + bevelTop - 2, w, 2)

  // Conveyor belt directional chevrons
  if (kind === 'conveyor') {
    const dir = (plat.conveyorSpeed || 0) >= 0 ? 1 : -1
    const offset = ((elapsedSec * 60 * dir) % 24 + 24) % 24
    ctx.fillStyle = '#FACC15'
    for (let cx = x + offset; cx < x + w - 10; cx += 24) {
      ctx.fillRect(cx, y + bevelTop + 5, 8, 4)
    }
  }

  ctx.restore()
}

// ============================================================================
// SECTION 5 — 13 RECOGNIZABLE ELECTRICAL PRODUCT COLLECTIBLES
// ============================================================================

function renderCollectibleItem(
  ctx: CanvasRenderingContext2D,
  item: CollectibleStar,
  elapsedSec: number,
  reducedMotion: boolean
) {
  const bob = reducedMotion ? 0 : Math.sin(elapsedSec * 4.2 + item.x * 0.04) * 4.5
  const cx = item.x
  const cy = item.y + bob
  const meta = PRODUCT_CATALOG_META[item.kind]

  ctx.save()
  ctx.translate(cx, cy)

  // Subtle product halo
  const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 20)
  glow.addColorStop(0, meta.color + '88')
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(0, 0, 20, 0, Math.PI * 2)
  ctx.fill()

  if (
    item.kind === 'wire_1_5mm' ||
    item.kind === 'wire_2_5mm' ||
    item.kind === 'wire_4mm' ||
    item.kind === 'wire_6mm'
  ) {
    // Recognizable Italian Copper Wire Coil Spool with Gauge Label
    const jacketColor =
      item.kind === 'wire_1_5mm'
        ? '#0284C7'
        : item.kind === 'wire_2_5mm'
        ? '#F59E0B'
        : item.kind === 'wire_4mm'
        ? '#10B981'
        : '#EA580C'
    const label =
      item.kind === 'wire_1_5mm'
        ? '1.5'
        : item.kind === 'wire_2_5mm'
        ? '2.5'
        : item.kind === 'wire_4mm'
        ? '4mm'
        : '6mm'

    // Outer insulation coil ring
    ctx.fillStyle = jacketColor
    ctx.beginPath()
    ctx.arc(0, 0, 13, 0, Math.PI * 2)
    ctx.fill()

    // Gleaming copper winding ring
    ctx.strokeStyle = '#FDBA74'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(0, 0, 9.5, 0, Math.PI * 2)
    ctx.stroke()

    // Inner spool core with gauge label
    ctx.fillStyle = '#0F172A'
    ctx.beginPath()
    ctx.arc(0, 0, 6.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 7px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(label, 0, 2.5)
  } else if (item.kind === 'led_bulb') {
    // Recognizable LED Bulb Collectible
    ctx.fillStyle = '#FEF08A'
    ctx.beginPath()
    ctx.arc(0, -3, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(-3, -6, 3.5, 0, Math.PI * 2)
    ctx.fill()
    // Screw base
    ctx.fillStyle = '#94A3B8'
    ctx.fillRect(-5, 6, 10, 6)
    ctx.fillStyle = '#475569'
    ctx.fillRect(-3, 12, 6, 2)
  } else if (item.kind === 'led_spotlight') {
    // Recessed LED Spotlight with orange spring clips
    ctx.strokeStyle = '#FB923C'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-11, 0)
    ctx.lineTo(-15, -5)
    ctx.moveTo(11, 0)
    ctx.lineTo(15, -5)
    ctx.stroke()

    ctx.fillStyle = '#E2E8F0'
    ctx.beginPath()
    ctx.arc(0, 0, 11, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#38BDF8'
    ctx.beginPath()
    ctx.arc(0, 0, 7, 0, Math.PI * 2)
    ctx.fill()
  } else if (item.kind === 'rechargeable_floodlight') {
    // Yellow/Black Portable Emergency Floodlight
    ctx.fillStyle = '#FACC15'
    ctx.fillRect(-12, -9, 24, 18)
    ctx.fillStyle = '#0F172A'
    ctx.fillRect(-9, -6, 18, 12)
    ctx.fillStyle = '#FEF08A'
    ctx.fillRect(-7, -4, 14, 8)
  } else if (item.kind === 'intercom_device') {
    // Smart Video Intercom Unit
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(-9, -12, 18, 24)
    ctx.strokeStyle = '#34D399'
    ctx.lineWidth = 1.5
    ctx.strokeRect(-9, -12, 18, 24)
    // Screen & Camera
    ctx.fillStyle = '#38BDF8'
    ctx.fillRect(-6, -8, 12, 8)
    ctx.fillStyle = '#34D399'
    ctx.beginPath()
    ctx.arc(0, 6, 3, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // LED Strip / Outdoor Fixture / Socket / Switch / Connector
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(-10, -10, 20, 20)
    ctx.strokeStyle = meta.color
    ctx.lineWidth = 2
    ctx.strokeRect(-10, -10, 20, 20)
    ctx.fillStyle = meta.color
    ctx.beginPath()
    ctx.arc(0, 0, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

// ============================================================================
// CHECKPOINTS, SWITCHES, GATES, HAZARDS & GOAL PORTAL
// ============================================================================

function renderCheckpointBeacon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  activated: boolean,
  labelAr: string,
  elapsedSec: number
) {
  ctx.save()
  ctx.fillStyle = '#334155'
  ctx.fillRect(x - 14, y - 8, 28, 8)
  ctx.fillStyle = '#475569'
  ctx.fillRect(x - 3, y - 68, 6, 60)

  if (activated) {
    const glowR = 26 + Math.sin(elapsedSec * 5) * 4
    const grad = ctx.createRadialGradient(x, y - 72, 2, x, y - 72, glowR)
    grad.addColorStop(0, 'rgba(253, 224, 71, 0.95)')
    grad.addColorStop(1, 'rgba(251, 191, 36, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y - 72, glowR, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = activated ? '#FDE047' : '#64748B'
  ctx.beginPath()
  ctx.arc(x, y - 72, 9, 0, Math.PI * 2)
  ctx.fill()

  if (activated) {
    ctx.font = 'bold 10px Cairo, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#FDE047'
    ctx.fillText(`✓ ${labelAr}`, x, y - 88)
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
  ctx.fillRect(x - 16, y - 38, 32, 38)
  ctx.strokeStyle = activated ? '#10B981' : '#F59E0B'
  ctx.lineWidth = 2
  ctx.strokeRect(x - 16, y - 38, 32, 38)

  ctx.fillStyle = activated ? '#10B981' : '#EF4444'
  ctx.fillRect(x - 8, activated ? y - 32 : y - 18, 16, 10)

  const bob = Math.sin(elapsedSec * 4) * 2
  ctx.font = 'bold 10px Cairo, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = activated ? '#6EE7B7' : '#FDE68A'
  ctx.fillText(activated ? 'مفعّل ⚡' : labelAr, x, y - 45 + bob)
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
  ctx.fillStyle = '#334155'
  ctx.fillRect(x - 2, y, w + 4, 10)
  ctx.fillRect(x - 2, y + h - 8, w + 4, 8)

  if (!isOpen) {
    const pulse = 0.65 + 0.3 * Math.sin(elapsedSec * 12)
    ctx.fillStyle = `rgba(239, 68, 68, ${pulse.toFixed(2)})`
    ctx.fillRect(x + 4, y + 10, w - 8, h - 18)

    ctx.font = 'bold 10px Cairo, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#FCA5A5'
    ctx.fillText(labelAr, x + w * 0.5, y - 8)
  }
  ctx.restore()
}

function renderStageHazard(ctx: CanvasRenderingContext2D, haz: StageHazard, elapsedSec: number) {
  ctx.save()
  if (haz.kind === 'rotating_hazard') {
    const rad = haz.radius || 48
    const angle = haz.angle || 0
    const ox = haz.x + Math.cos(angle) * rad
    const oy = haz.y + Math.sin(angle) * rad

    ctx.strokeStyle = '#F59E0B'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(haz.x, haz.y)
    ctx.lineTo(ox, oy)
    ctx.stroke()

    ctx.fillStyle = '#EF4444'
    ctx.beginPath()
    ctx.arc(ox, oy, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }

  if (haz.kind === 'mechanical_press') {
    ctx.fillStyle = '#475569'
    ctx.fillRect(haz.x + 12, haz.y - 60, haz.w - 24, 60)
    ctx.fillStyle = '#B91C1C'
    ctx.fillRect(haz.x, haz.y, haz.w, haz.h)
    ctx.fillStyle = '#FACC15'
    ctx.fillRect(haz.x, haz.y + haz.h - 8, haz.w, 8)
    ctx.restore()
    return
  }

  // Timed Arc
  let active = true
  if (haz.kind === 'timed_arc' && haz.period && haz.onTime) {
    const phase = (elapsedSec + (haz.offset || 0)) % haz.period
    active = phase < haz.onTime
  }
  ctx.fillStyle = '#334155'
  ctx.fillRect(haz.x, haz.y + haz.h - 6, haz.w, 6)
  if (active) {
    ctx.strokeStyle = '#38BDF8'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(haz.x + 4, haz.y + haz.h - 6)
    for (let hx = haz.x + 12; hx < haz.x + haz.w - 4; hx += 10) {
      ctx.lineTo(hx, haz.y + (Math.sin(elapsedSec * 40 + hx) > 0 ? 0 : haz.h - 8))
    }
    ctx.stroke()
  }
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
  const glowR = 54 + Math.sin(elapsedSec * 4) * 6
  const grad = ctx.createRadialGradient(x, y - 36, 6, x, y - 36, glowR)
  if (locked) {
    grad.addColorStop(0, 'rgba(239, 68, 68, 0.55)')
    grad.addColorStop(1, 'rgba(239, 68, 68, 0)')
  } else {
    grad.addColorStop(0, 'rgba(253, 224, 71, 0.9)')
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)')
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)')
  }
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(x, y - 36, glowR, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#1E293B'
  ctx.fillRect(x - 28, y - 74, 56, 82)
  ctx.strokeStyle = locked ? '#EF4444' : '#FACC15'
  ctx.lineWidth = 3
  ctx.strokeRect(x - 28, y - 74, 56, 82)

  ctx.fillStyle = locked ? '#7F1D1D' : '#FEF08A'
  ctx.fillRect(x - 18, y - 64, 36, 62)

  ctx.font = 'bold 11px Cairo, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = locked ? '#FCA5A5' : '#FDE047'
  ctx.fillText(locked ? 'اهزم الزعيم لفتح البوابة 🔒' : `🏁 ${labelAr}`, x, y - 84)
  ctx.restore()
}

// ============================================================================
// SECTION 7 — 8 UNIQUE ENEMY TYPES WITH TELEGRAPH INDICATORS
// ============================================================================

function renderPlatformEnemy(
  ctx: CanvasRenderingContext2D,
  enemy: PlatformEnemy,
  elapsedSec: number
) {
  ctx.save()
  const cx = enemy.x + enemy.w * 0.5
  const cy = enemy.y + enemy.h * 0.5
  const isAlert = enemy.aiState === 'detect' || enemy.aiState === 'attack'

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)'
  ctx.beginPath()
  ctx.ellipse(cx, enemy.y + enemy.h, enemy.w * 0.42, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  if (enemy.kind === 'electrical_spark') {
    // 1. Electrical Spark (شرارة كهربائية)
    ctx.fillStyle = isAlert ? '#F43F5E' : '#38BDF8'
    ctx.beginPath()
    for (let i = 0; i < 8; i++) {
      const ang = (i * Math.PI) / 4 + elapsedSec * 6
      const r = i % 2 === 0 ? 16 : 8
      const px = cx + Math.cos(ang) * r
      const py = cy + Math.sin(ang) * r
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  } else if (enemy.kind === 'cable_snake') {
    // 2. Cable Snake (أفعى الكابلات)
    ctx.strokeStyle = '#EA580C'
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.beginPath()
    for (let sx = -16; sx <= 16; sx += 8) {
      const sy = Math.sin(elapsedSec * 10 + sx * 0.3) * 5
      if (sx === -16) ctx.moveTo(cx + sx, cy + sy)
      else ctx.lineTo(cx + sx, cy + sy)
    }
    ctx.stroke()
    // Eyes
    ctx.fillStyle = '#FEF08A'
    ctx.beginPath()
    ctx.arc(cx + (enemy.vx >= 0 ? 12 : -12), cy - 3, 3, 0, Math.PI * 2)
    ctx.fill()
  } else if (enemy.kind === 'flying_drone') {
    // 3. Flying Drone (درون طائر)
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(enemy.x + 4, enemy.y + 8, enemy.w - 8, enemy.h - 14)
    ctx.strokeStyle = '#38BDF8'
    ctx.lineWidth = 2
    ctx.strokeRect(enemy.x + 4, enemy.y + 8, enemy.w - 8, enemy.h - 14)
    // Rotors
    ctx.fillStyle = '#94A3B8'
    ctx.fillRect(enemy.x - 2, enemy.y + 2, 14, 3)
    ctx.fillRect(enemy.x + enemy.w - 12, enemy.y + 2, 14, 3)
    // Eye lens
    ctx.fillStyle = isAlert ? '#EF4444' : '#FACC15'
    ctx.beginPath()
    ctx.arc(cx, cy, 5, 0, Math.PI * 2)
    ctx.fill()
  } else if (enemy.kind === 'mechanical_spider') {
    // 4. Mechanical Spider (عنكبوت ميكانيكي)
    ctx.strokeStyle = '#94A3B8'
    ctx.lineWidth = 2.5
    for (let l = -1; l <= 1; l += 2) {
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + l * 18, cy - 6 + Math.sin(elapsedSec * 16) * 4)
      ctx.lineTo(cx + l * 22, enemy.y + enemy.h)
      ctx.stroke()
    }
    ctx.fillStyle = '#334155'
    ctx.beginPath()
    ctx.arc(cx, cy, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#EF4444'
    ctx.fillRect(cx - 5, cy - 3, 4, 4)
    ctx.fillRect(cx + 2, cy - 3, 4, 4)
  } else if (enemy.kind === 'shadow_creature') {
    // 6. Shadow Creature (كائن الظل)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
    ctx.beginPath()
    ctx.arc(cx, cy, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#A855F7'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#F43F5E'
    ctx.fillRect(cx - 6, cy - 4, 4, 4)
    ctx.fillRect(cx + 2, cy - 4, 4, 4)
  } else if (enemy.kind === 'security_robot') {
    // 5. Security Robot (روبوت الحراسة)
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(enemy.x, enemy.y + 4, enemy.w, enemy.h - 8)
    ctx.strokeStyle = isAlert ? '#EF4444' : '#38BDF8'
    ctx.lineWidth = 2
    ctx.strokeRect(enemy.x, enemy.y + 4, enemy.w, enemy.h - 8)
    ctx.fillStyle = '#38BDF8'
    ctx.fillRect(cx - 8, enemy.y, 16, 5)
    ctx.fillStyle = isAlert ? '#EF4444' : '#FDE047'
    ctx.fillRect(enemy.x + 6, enemy.y + 12, enemy.w - 12, 6)
  } else if (enemy.kind === 'transformer_monster') {
    // 7. Transformer Monster (وحش المحولات)
    ctx.fillStyle = '#7C2D12'
    ctx.fillRect(enemy.x, enemy.y + 4, enemy.w, enemy.h - 8)
    ctx.strokeStyle = isAlert ? '#EF4444' : '#F59E0B'
    ctx.lineWidth = 2.5
    ctx.strokeRect(enemy.x, enemy.y + 4, enemy.w, enemy.h - 8)
    // Copper coils on shoulders
    ctx.fillStyle = '#EA580C'
    ctx.fillRect(enemy.x - 3, enemy.y + 8, 5, 14)
    ctx.fillRect(enemy.x + enemy.w - 2, enemy.y + 8, 5, 14)
    ctx.fillStyle = '#38BDF8'
    ctx.fillRect(cx - 9, enemy.y, 18, 5)
    ctx.fillStyle = '#FDE047'
    ctx.fillRect(enemy.x + 8, enemy.y + 14, enemy.w - 16, 6)
  } else if (enemy.kind === 'giant_guardian') {
    // 8. Giant Guardian (الحارس العملاق)
    ctx.fillStyle = '#312E81'
    ctx.fillRect(enemy.x, enemy.y + 4, enemy.w, enemy.h - 8)
    ctx.strokeStyle = isAlert ? '#F43F5E' : '#A855F7'
    ctx.lineWidth = 2.5
    ctx.strokeRect(enemy.x, enemy.y + 4, enemy.w, enemy.h - 8)
    ctx.fillStyle = '#22D3EE'
    ctx.fillRect(cx - 10, enemy.y, 20, 5)
    ctx.fillStyle = isAlert ? '#F43F5E' : '#38BDF8'
    ctx.fillRect(enemy.x + 7, enemy.y + 14, enemy.w - 14, 7)
  }

  // Fair Attack Telegraph Indicator
  if (enemy.aiState === 'detect') {
    ctx.fillStyle = '#FACC15'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('!', cx, enemy.y - 6)
  }

  ctx.restore()
}

// ============================================================================
// BOSS ENCOUNTERS & 3-PHASE DARK KING (SECTION 6 & 8)
// ============================================================================

function renderBossEncounter(
  ctx: CanvasRenderingContext2D,
  boss: BossGuardian,
  elapsedSec: number
) {
  ctx.save()

  for (const brk of boss.breakers) {
    renderStageSwitch(ctx, brk.x, brk.y, brk.activated, brk.labelAr, elapsedSec)
  }

  // Render Boss Projectiles
  for (const proj of boss.projectiles) {
    ctx.fillStyle = proj.color
    ctx.beginPath()
    ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(proj.x, proj.y, proj.radius * 0.45, 0, Math.PI * 2)
    ctx.fill()
  }

  if (boss.state === 'defeated') {
    ctx.restore()
    return
  }

  // Ground Shockwaves
  if (boss.shockwaveActive) {
    ctx.fillStyle = '#F97316'
    ctx.beginPath()
    ctx.arc(boss.shockwaveLeftX, boss.shockwaveY, 15, 0, Math.PI * 2)
    ctx.arc(boss.shockwaveRightX, boss.shockwaveY, 15, 0, Math.PI * 2)
    ctx.fill()
  }

  if (boss.invulnTimer > 0 && Math.floor(elapsedSec * 20) % 2 === 0) {
    ctx.globalAlpha = 0.5
  }

  const { x, y, w, h } = boss
  const cx = x + w * 0.5

  // Phase Aura for 3-Phase Dark King
  if (boss.archetype === 'electric_dark_king_boss') {
    const auraColor =
      boss.phase === 3
        ? 'rgba(244, 63, 94, 0.35)'
        : boss.phase === 2
        ? 'rgba(168, 85, 247, 0.3)'
        : 'rgba(56, 189, 248, 0.25)'
    ctx.fillStyle = auraColor
    ctx.beginPath()
    ctx.arc(cx, y + h * 0.5, w * 0.72, 0, Math.PI * 2)
    ctx.fill()
  }

  // Armored Chassis
  ctx.fillStyle =
    boss.archetype === 'electric_dark_king_boss'
      ? '#1E1B4B'
      : boss.archetype === 'construction_robot_boss'
      ? '#78350F'
      : '#0F172A'
  ctx.fillRect(x, y + 12, w, h - 16)
  ctx.strokeStyle =
    boss.state === 'telegraph'
      ? '#EF4444'
      : boss.phase === 3
      ? '#F43F5E'
      : '#F97316'
  ctx.lineWidth = 3.5
  ctx.strokeRect(x, y + 12, w, h - 16)

  // Vulnerable Top Energy Core
  ctx.fillStyle = boss.state === 'vulnerable' ? '#34D399' : '#38BDF8'
  ctx.beginPath()
  ctx.arc(cx, y + 12, 18, Math.PI, 0)
  ctx.fill()

  // Visor & Crown for Dark King
  ctx.fillStyle = boss.state === 'telegraph' ? '#EF4444' : '#FDE047'
  ctx.fillRect(x + 14, y + 28, w - 28, 12)

  ctx.font = 'bold 12px Cairo, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FDE047'
  ctx.fillText(
    `${boss.nameAr} (الطور ${boss.phase}) — الدرع ${boss.hp}/${boss.maxHp}`,
    cx,
    y - 12
  )

  ctx.restore()
}

// ============================================================================
// SECTION 3 — REDESIGNED ANTHROPOMORPHIC LED LIGHT BULB HERO (بطل الإنارة)
// Clearly recognizable frosted LED bulb head + metallic E27 screw base +
// expressive eyes & animated eyebrows + small arms/legs with gloves & shoes!
// ============================================================================

function renderOriginalHeroCharacter(
  ctx: CanvasRenderingContext2D,
  hero: HeroPhysicsState,
  elapsedSec: number
) {
  ctx.save()

  if (hero.invincibleTimer > 0 && Math.floor(elapsedSec * 18) % 2 === 0) {
    ctx.globalAlpha = 0.55
  }

  const centerX = hero.x + hero.w * 0.5
  const bottomY = hero.y + hero.h

  // 1. Subtle Physically Believable White Light Aura (Modulated by lightEnergy & floodlight)
  const energyRatio = Math.max(0.4, Math.min(1.3, hero.lightEnergy / 85))
  const auraRadius = (hero.floodlightTimer > 0 ? 95 : 54) * energyRatio
  const bulbAura = ctx.createRadialGradient(centerX, bottomY - 30, 4, centerX, bottomY - 30, auraRadius)
  bulbAura.addColorStop(0, `rgba(255, 253, 240, ${(0.34 * energyRatio).toFixed(2)})`)
  bulbAura.addColorStop(0.55, `rgba(254, 240, 138, ${(0.14 * energyRatio).toFixed(2)})`)
  bulbAura.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = bulbAura
  ctx.beginPath()
  ctx.arc(centerX, bottomY - 30, auraRadius, 0, Math.PI * 2)
  ctx.fill()

  // 2. Protective Shield Bubble (when 4mm Wire shield is active)
  if (hero.shieldTimer > 0) {
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(centerX, bottomY - 24, 30, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 3. Light Pulse Attack Ring (when attacking State #8 is active)
  if (hero.animState === 'attacking' || hero.attackTimer > 0) {
    const pulseR = 26 + (0.28 - hero.attackTimer) * 160
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)'
    ctx.lineWidth = 3.5
    ctx.beginPath()
    ctx.arc(centerX, bottomY - 26, Math.max(18, pulseR), 0, Math.PI * 2)
    ctx.stroke()
  }

  // 4. Dash Afterimage Trail (when Dash State #9 is active)
  if (hero.animState === 'dash' || hero.dashTimer > 0) {
    const dir = hero.facing === 'right' ? -1 : 1
    ctx.fillStyle = 'rgba(56, 189, 248, 0.28)'
    ctx.beginPath()
    ctx.arc(centerX + dir * 18, bottomY - 30, 14, 0, Math.PI * 2)
    ctx.fill()
  }

  // Ground contact shadow
  if (hero.onGround) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)'
    ctx.beginPath()
    ctx.ellipse(centerX, bottomY, 14 * hero.scaleX, 4, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Transform around character feet for squash & stretch and facing direction
  ctx.translate(centerX, bottomY)
  ctx.scale((hero.facing === 'left' ? -1 : 1) * hero.scaleX, hero.scaleY)

  const isRunning = hero.animState === 'run' || hero.animState === 'dash'
  const isWalking = hero.animState === 'walk' || isRunning
  const stride = isWalking ? Math.sin(hero.walkCycle) * (isRunning ? 7.5 : 5) : 0
  const breath = hero.animState === 'idle' ? Math.sin(hero.walkCycle) * 1.3 : 0

  // --------------------------------------------------------------------------
  // A. SMALL ANIMATED LEGS & DISTINCTIVE SHOES
  // --------------------------------------------------------------------------
  ctx.strokeStyle = '#1E293B'
  ctx.lineWidth = 3.5
  ctx.lineCap = 'round'

  // Back leg
  ctx.beginPath()
  ctx.moveTo(-3, -12)
  ctx.lineTo(-4 - stride * 0.6, -4)
  ctx.stroke()
  // Back shoe (Royal Blue & Amber sole)
  ctx.fillStyle = '#0284C7'
  ctx.fillRect(-9 - stride * 0.6, -5, 9, 5)
  ctx.fillStyle = '#FACC15'
  ctx.fillRect(-9 - stride * 0.6, -1.5, 9, 1.5)

  // Front leg
  ctx.beginPath()
  ctx.moveTo(3, -12)
  ctx.lineTo(4 + stride * 0.6, -4)
  ctx.stroke()
  // Front shoe
  ctx.fillStyle = '#0369A1'
  ctx.fillRect(-1 + stride * 0.6, -5, 10, 5)
  ctx.fillStyle = '#FACC15'
  ctx.fillRect(-1 + stride * 0.6, -1.5, 10, 1.5)

  // --------------------------------------------------------------------------
  // B. VISIBLE METALLIC E27 SCREW BASE (Unmistakable Light Bulb Base!)
  // --------------------------------------------------------------------------
  // Dark bottom electrical contact foot
  ctx.fillStyle = '#0F172A'
  ctx.beginPath()
  ctx.arc(0, -11 + breath, 5.5, 0, Math.PI)
  ctx.fill()

  // Threaded metallic aluminum/chrome E27 screw base (-21 to -11)
  const screwGrad = ctx.createLinearGradient(-8, -21, 8, -11)
  screwGrad.addColorStop(0, '#94A3B8')
  screwGrad.addColorStop(0.5, '#F1F5F9')
  screwGrad.addColorStop(1, '#64748B')
  ctx.fillStyle = screwGrad
  ctx.fillRect(-7.5, -21 + breath, 15, 10)

  // 3 Distinct Metallic Screw Thread Ridges
  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 1.2
  for (let ty = -19; ty <= -13; ty += 3) {
    ctx.beginPath()
    ctx.moveTo(-8, ty + breath)
    ctx.lineTo(8, ty + 1 + breath)
    ctx.stroke()
  }

  // LED Bulb Thermal Collar Ring (-25 to -21) with subtle ENARAH blue accent band
  ctx.fillStyle = '#E2E8F0'
  ctx.beginPath()
  ctx.moveTo(-10.5, -25 + breath)
  ctx.lineTo(10.5, -25 + breath)
  ctx.lineTo(8, -21 + breath)
  ctx.lineTo(-8, -21 + breath)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#0284C7'
  ctx.fillRect(-9.5, -23.5 + breath, 19, 1.8)

  // --------------------------------------------------------------------------
  // C. SMALL FLEXIBLE ARMS & DISTINCTIVE GLOVES
  // --------------------------------------------------------------------------
  const armSwing = isWalking ? -stride * 0.65 : hero.animState === 'victory' ? -8 : 0

  // Back Arm & White/Gold Insulated Glove
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(-8, -22 + breath)
  ctx.lineTo(-14 + armSwing * 0.5, -16 + breath + (hero.animState === 'victory' ? -10 : 0))
  ctx.stroke()
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(-14 + armSwing * 0.5, -16 + breath + (hero.animState === 'victory' ? -10 : 0), 3.8, 0, Math.PI * 2)
  ctx.fill()

  // --------------------------------------------------------------------------
  // D. LARGE FROSTED LED BULB HEAD (Classic Pear/Dome Bulb Silhouette!)
  // --------------------------------------------------------------------------
  const bulbCenterY = -36 + breath
  const bulbRadius = 15.5

  // Realistic translucent frosted diffuser gradient (warm white core -> soft frosted edge)
  const diffuserGrad = ctx.createRadialGradient(-3, bulbCenterY - 3, 2, 0, bulbCenterY, bulbRadius + 2)
  if (hero.animState === 'damage') {
    diffuserGrad.addColorStop(0, '#FEE2E2')
    diffuserGrad.addColorStop(0.7, '#FCA5A5')
    diffuserGrad.addColorStop(1, '#EF4444')
  } else {
    diffuserGrad.addColorStop(0, '#FFFFFF')
    diffuserGrad.addColorStop(0.55, '#FEFCE8')
    diffuserGrad.addColorStop(0.88, '#FEF08A')
    diffuserGrad.addColorStop(1, '#FDE047')
  }

  ctx.fillStyle = diffuserGrad
  ctx.beginPath()
  // Upper spherical bulb dome + smooth tapered lower neck meeting the collar at y = -25
  ctx.arc(0, bulbCenterY, bulbRadius, Math.PI * 0.82, Math.PI * 0.18, false)
  ctx.lineTo(10.5, -25 + breath)
  ctx.lineTo(-10.5, -25 + breath)
  ctx.closePath()
  ctx.fill()

  // Crisp subtle glass outline so bulb silhouette pops against bright skies too
  ctx.strokeStyle = 'rgba(202, 138, 4, 0.55)'
  ctx.lineWidth = 1.4
  ctx.stroke()

  // Frosted Glass Specular Highlight (top-left curved shine)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.beginPath()
  ctx.ellipse(-6, bulbCenterY - 6, 4.5, 2.4, -0.5, 0, Math.PI * 2)
  ctx.fill()

  // --------------------------------------------------------------------------
  // E. EXPRESSIVE EYES & ANIMATED EYEBROWS ON THE BULB FACE
  // --------------------------------------------------------------------------
  const eyeY = bulbCenterY + 1
  if (hero.animState === 'damage' || hero.animState === 'defeat') {
    // Squinting >< eyes on damage
    ctx.strokeStyle = '#0F172A'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-2, eyeY - 2)
    ctx.lineTo(2, eyeY)
    ctx.lineTo(-2, eyeY + 2)
    ctx.moveTo(9, eyeY - 2)
    ctx.lineTo(5, eyeY)
    ctx.lineTo(9, eyeY + 2)
    ctx.stroke()
  } else {
    // Expressive dark eyes with white catchlights
    ctx.fillStyle = '#0F172A'
    ctx.beginPath()
    ctx.ellipse(0, eyeY, 2.2, 3.1, 0, 0, Math.PI * 2)
    ctx.ellipse(7.5, eyeY, 2.2, 3.1, 0, 0, Math.PI * 2)
    ctx.fill()

    // Eye catchlights
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(0.7, eyeY - 1.2, 0.9, 0, Math.PI * 2)
    ctx.arc(8.2, eyeY - 1.2, 0.9, 0, Math.PI * 2)
    ctx.fill()

    // Animated Eyebrows (Determined when running/dashing/attacking, raised when jumping/collecting)
    const browTilt =
      hero.animState === 'attacking' || hero.animState === 'dash' || hero.animState === 'run'
        ? 1.5
        : hero.animState === 'jump_ascent' || hero.animState === 'collecting'
        ? -1.5
        : 0
    ctx.strokeStyle = '#1E293B'
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(-2.5, eyeY - 5 - browTilt * 0.5)
    ctx.lineTo(2, eyeY - 5 + browTilt)
    ctx.moveTo(5.5, eyeY - 5 + browTilt)
    ctx.lineTo(10, eyeY - 5 - browTilt * 0.5)
    ctx.stroke()

    // Courageous smile
    ctx.strokeStyle = '#1E293B'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(4, eyeY + 4.2, 2.8, 0.15, Math.PI - 0.15)
    ctx.stroke()
  }

  // Front Arm & Distinctive Glove
  ctx.strokeStyle = '#1E293B'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(7, -22 + breath)
  ctx.lineTo(13 - armSwing * 0.6, -15 + breath + (hero.animState === 'attacking' ? -6 : 0))
  ctx.stroke()
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(13 - armSwing * 0.6, -15 + breath + (hero.animState === 'attacking' ? -6 : 0), 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#F59E0B'
  ctx.lineWidth = 1.2
  ctx.stroke()

  ctx.restore()
}

// ============================================================================
// LEVEL 6 BLACKOUT ILLUMINATION MASK & FOREGROUND DEPTH
// ============================================================================

function renderBlackoutIlluminationMask(
  ctx: CanvasRenderingContext2D,
  stage: StageDefinition,
  hero: HeroPhysicsState,
  cam: CameraState,
  W: number,
  H: number
) {
  const heroScreenX = hero.x + hero.w * 0.5 - cam.x
  const heroScreenY = hero.y + hero.h * 0.5 - cam.y
  const lightRadius =
    hero.floodlightTimer > 0
      ? 310
      : hero.spotlightTimer > 0
      ? 245
      : 165

  ctx.save()
  const maskGrad = ctx.createRadialGradient(
    heroScreenX,
    heroScreenY,
    lightRadius * 0.35,
    heroScreenX,
    heroScreenY,
    lightRadius
  )
  maskGrad.addColorStop(0, 'rgba(3, 7, 18, 0)')
  maskGrad.addColorStop(0.65, `rgba(3, 7, 18, ${((stage.darknessLevel || 0.8) * 0.65).toFixed(2)})`)
  maskGrad.addColorStop(1, `rgba(3, 7, 18, ${(stage.darknessLevel || 0.82).toFixed(2)})`)

  ctx.fillStyle = maskGrad
  ctx.fillRect(0, 0, W, H)
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
  if (!reducedMotion) {
    const scrollX = cam.x * 1.18
    ctx.fillStyle =
      stage.theme === 'city_of_light'
        ? 'rgba(255, 255, 255, 0.25)'
        : 'rgba(251, 191, 36, 0.18)'
    for (let i = 0; i < 6; i++) {
      const fx = ((i * 190 - scrollX + elapsedSec * 14) % W + W) % W
      const fy = 60 + ((i * 73) % (H - 120))
      ctx.beginPath()
      ctx.arc(fx, fy, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
