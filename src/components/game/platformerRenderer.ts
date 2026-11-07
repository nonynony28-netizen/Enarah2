import {
  type StageDefinition,
  type PlatformData,
  type CollectibleStar,
  type PlatformEnemy,
  type BossGuardian,
  type StageHazard,
  type WorldThemeId,
  PRODUCT_CATALOG_META,
} from './platformerWorlds'
import { type HeroPhysicsState, type CameraState, isPlatformSolid } from './platformerPhysics'

export type GraphicsQuality = 'high' | 'balanced' | 'low'

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
  reducedMotion = false,
  graphicsQuality: GraphicsQuality = 'high'
): void {
  const W = cam.viewportW
  const H = cam.viewportH

  ctx.save()
  ctx.clearRect(0, 0, W, H)

  // Subtle camera impact shake when boss hits or damage occurs
  if (!reducedMotion && graphicsQuality !== 'low' && cam.shakeIntensity && cam.shakeIntensity > 0.2) {
    const sx = (Math.random() - 0.5) * cam.shakeIntensity
    const sy = (Math.random() - 0.5) * cam.shakeIntensity
    ctx.translate(sx, sy)
  }

  // LAYER 1 — DISTANT SKY & ATMOSPHERIC ILLUMINATION (0.05x Parallax)
  renderSkyAndAtmosphere(ctx, stage, cam, elapsedSec, W, H, graphicsQuality)

  // LAYER 2 — FAR HORIZON SKYLINE / INDUSTRIAL SILHOUETTE (0.18x Parallax)
  renderFarParallaxLayer(ctx, stage, cam, elapsedSec, W, H, reducedMotion, graphicsQuality)

  // LAYER 3 — MIDGROUND ARCHITECTURE, ELECTRICAL INFRASTRUCTURE & DETAILS (0.42x Parallax)
  renderMidgroundParallaxLayer(ctx, stage, cam, elapsedSec, W, H, reducedMotion, graphicsQuality)

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

  // 4C. 2.5D Platforms (Stage-authentic architecture, materials & depth planes)
  for (const plat of stage.platforms) {
    if (plat.x + plat.w < cam.x - 40 || plat.x > cam.x + W + 40) continue
    render25DPlatform(ctx, plat, hero, elapsedSec, stage.theme)
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
  if (graphicsQuality !== 'low') {
    renderForegroundDepthLayer(ctx, stage, cam, elapsedSec, W, H, reducedMotion)
  }

  ctx.restore()
}

// ============================================================================
// V5 — 8 UNIQUE LIVING ELECTRICAL WORLDS (LAYERED 2.5D ENVIRONMENTS)
// ============================================================================

function renderSkyAndAtmosphere(
  ctx: CanvasRenderingContext2D,
  stage: StageDefinition,
  cam: CameraState,
  elapsedSec: number,
  W: number,
  H: number,
  graphicsQuality: GraphicsQuality
) {
  const theme = stage.theme
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H)

  if (theme === 'city_of_light') {
    // Stage 1: Bright welcoming daytime blue sky
    skyGrad.addColorStop(0, '#0284C7')
    skyGrad.addColorStop(0.55, '#38BDF8')
    skyGrad.addColorStop(1, '#E0F2FE')
  } else if (theme === 'electricity_street') {
    // Stage 2: Warm golden morning / commercial boulevard sky
    skyGrad.addColorStop(0, '#D97706')
    skyGrad.addColorStop(0.48, '#F59E0B')
    skyGrad.addColorStop(1, '#FEF3C7')
  } else if (theme === 'lighting_factory') {
    // Stage 3: Steel-blue & slate industrial factory hall interior
    skyGrad.addColorStop(0, '#0F172A')
    skyGrad.addColorStop(0.55, '#1E293B')
    skyGrad.addColorStop(1, '#334155')
  } else if (theme === 'intercom_district') {
    // Stage 4: Fresh residential morning with copper-warm horizon
    skyGrad.addColorStop(0, '#0F766E')
    skyGrad.addColorStop(0.55, '#2DD4BF')
    skyGrad.addColorStop(1, '#FEF3C7')
  } else if (theme === 'power_station') {
    // Stage 5: Deep high-voltage industrial blue with copper horizon glow
    skyGrad.addColorStop(0, '#06101E')
    skyGrad.addColorStop(0.65, '#132A4A')
    skyGrad.addColorStop(1, '#2B2D42')
  } else if (theme === 'dark_city') {
    // Stage 6: Futuristic twilight / blackout city (blue, purple & cyan)
    skyGrad.addColorStop(0, '#070B1E')
    skyGrad.addColorStop(0.55, '#1E1B4B')
    skyGrad.addColorStop(1, '#311042')
  } else if (theme === 'lighting_tower') {
    // Stage 7: High-altitude stratosphere sky above the clouds
    skyGrad.addColorStop(0, '#0369A1')
    skyGrad.addColorStop(0.55, '#38BDF8')
    skyGrad.addColorStop(1, '#F0F9FF')
  } else {
    // Stage 8: Final Energy Fortress (deep navy, steel & crimson-orange core glow)
    skyGrad.addColorStop(0, '#070A12')
    skyGrad.addColorStop(0.6, '#1B1429')
    skyGrad.addColorStop(1, '#3B1219')
  }

  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, W, H)

  // Stage-specific celestial bodies, factory skylights, or atmospheric lighting
  if (graphicsQuality !== 'low') {
    if (theme === 'city_of_light' || theme === 'electricity_street' || theme === 'intercom_district') {
      const sunX = W * 0.78 - cam.x * 0.03
      const sunY = theme === 'electricity_street' ? H * 0.26 : H * 0.18
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 150)
      sunGlow.addColorStop(0, 'rgba(255, 255, 240, 0.95)')
      sunGlow.addColorStop(0.3, 'rgba(253, 224, 71, 0.42)')
      sunGlow.addColorStop(1, 'rgba(253, 224, 71, 0)')
      ctx.fillStyle = sunGlow
      ctx.beginPath()
      ctx.arc(sunX, sunY, 150, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FFFBEB'
      ctx.beginPath()
      ctx.arc(sunX, sunY, 26, 0, Math.PI * 2)
      ctx.fill()
    } else if (theme === 'lighting_factory') {
      // Industrial roof trusses & angled daylight skylight shafts
      const trussOffset = (cam.x * 0.08) % 180
      ctx.fillStyle = '#090D16'
      ctx.fillRect(0, 0, W, 34)
      for (let tx = -trussOffset; tx < W + 180; tx += 180) {
        // Skylight window pane in factory roof
        ctx.fillStyle = 'rgba(125, 211, 252, 0.22)'
        ctx.fillRect(tx + 30, 6, 90, 20)
        // Diagonal light beam into factory
        ctx.fillStyle = 'rgba(186, 230, 253, 0.06)'
        ctx.beginPath()
        ctx.moveTo(tx + 30, 26)
        ctx.lineTo(tx + 120, 26)
        ctx.lineTo(tx + 190, H - 80)
        ctx.lineTo(tx + 60, H - 80)
        ctx.closePath()
        ctx.fill()

        // Steel roof truss triangles
        ctx.strokeStyle = '#334155'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(tx, 34)
        ctx.lineTo(tx + 45, 6)
        ctx.lineTo(tx + 90, 34)
        ctx.lineTo(tx + 135, 6)
        ctx.lineTo(tx + 180, 34)
        ctx.stroke()
      }
    } else if (theme === 'dark_city' || theme === 'power_station' || theme === 'darkness_fortress') {
      // Stars & distant energy core / moon
      const starCount = graphicsQuality === 'high' ? 18 : 10
      for (let i = 0; i < starCount; i++) {
        const sx = ((i * 97 - cam.x * 0.02) % W + W) % W
        const sy = 18 + ((i * 41) % 165)
        const pulse = 0.3 + 0.35 * Math.sin(elapsedSec * 2.2 + i)
        ctx.fillStyle =
          theme === 'darkness_fortress'
            ? `rgba(251, 146, 60, ${pulse.toFixed(2)})`
            : `rgba(224, 242, 254, ${pulse.toFixed(2)})`
        ctx.fillRect(sx, sy, 2, 2)
      }
    }
  }

  // Drifting clouds (Stages 1, 2, 4, 7) & distant flying birds (Stages 2 & 4)
  if (
    theme === 'city_of_light' ||
    theme === 'electricity_street' ||
    theme === 'intercom_district' ||
    theme === 'lighting_tower'
  ) {
    const cloudCount = graphicsQuality === 'low' ? 3 : 5
    ctx.fillStyle =
      theme === 'electricity_street'
        ? 'rgba(255, 251, 235, 0.55)'
        : 'rgba(255, 255, 255, 0.72)'
    for (let i = 0; i < cloudCount; i++) {
      const cx = ((i * 260 - cam.x * 0.06 + elapsedSec * 9) % (W + 240)) - 120
      const cy = theme === 'lighting_tower' ? H - 105 + (i % 2) * 18 : 54 + (i % 3) * 28
      ctx.beginPath()
      ctx.arc(cx, cy, 24, 0, Math.PI * 2)
      ctx.arc(cx + 22, cy - 7, 30, 0, Math.PI * 2)
      ctx.arc(cx + 46, cy, 22, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Animated birds in the distant sky for Residential & Commercial stages (Stages 2 & 4)
  if ((theme === 'electricity_street' || theme === 'intercom_district') && graphicsQuality !== 'low') {
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.55)'
    ctx.lineWidth = 1.6
    for (let b = 0; b < 4; b++) {
      const bx = ((b * 210 + elapsedSec * 28 - cam.x * 0.05) % (W + 120)) - 60
      const by = 68 + (b % 2) * 24 + Math.sin(elapsedSec * 3 + b) * 4
      const wingY = Math.sin(elapsedSec * 9 + b * 1.4) * 4
      ctx.beginPath()
      ctx.moveTo(bx - 7, by + wingY)
      ctx.quadraticCurveTo(bx - 3, by - 4, bx, by)
      ctx.quadraticCurveTo(bx + 3, by - 4, bx + 7, by + wingY)
      ctx.stroke()
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
  reducedMotion: boolean,
  graphicsQuality: GraphicsQuality
) {
  const theme = stage.theme
  const scrollX = cam.x * 0.18
  const baseHorizonY = Math.round(stage.groundY - cam.y + 2)

  // Fill below-horizon subterranean band so tall portrait viewports never show sky beneath the ground plane
  if (baseHorizonY < H) {
    ctx.fillStyle =
      theme === 'city_of_light'
        ? '#1E293B'
        : theme === 'electricity_street'
          ? '#451A03'
          : '#0F172A'
    ctx.fillRect(0, baseHorizonY, W, H - baseHorizonY + 4)
  }

  // --------------------------------------------------------------------------
  // STAGE 1: THE LIVING CITY (مدينة النور) — Modern Skyline + Distant Moving Traffic
  // --------------------------------------------------------------------------
  if (theme === 'city_of_light') {
    for (let i = -1; i < 8; i++) {
      const bx = i * 165 - (scrollX % 165)
      const seed = Math.abs(i + Math.floor(scrollX / 165))
      const bw = 110 + (seed % 3) * 20
      const bh = 135 + (seed % 4) * 32
      const by = baseHorizonY - bh

      // Colorful pastel-modern skyline towers
      const towerColors = ['#60A5FA', '#38BDF8', '#818CF8', '#34D399']
      ctx.fillStyle = towerColors[seed % towerColors.length]
      ctx.fillRect(bx, by, bw, bh)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.18)'
      ctx.fillRect(bx + bw - 14, by, 14, bh)

      // Stepped crown & glass curtain lines
      ctx.fillStyle = '#E0F2FE'
      ctx.fillRect(bx + 16, by - 10, bw - 32, 10)
      if (graphicsQuality !== 'low') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
        for (let wy = by + 16; wy < baseHorizonY - 38; wy += 24) {
          for (let wx = bx + 12; wx < bx + bw - 24; wx += 22) {
            ctx.fillRect(wx, wy, 10, 12)
          }
        }
      }
    }

    // Distant Highway Overpass with Slowly Moving Background Traffic
    const bridgeY = baseHorizonY - 28
    ctx.fillStyle = '#64748B'
    ctx.fillRect(0, bridgeY, W, 10)
    ctx.fillStyle = '#475569'
    for (let px = -(scrollX % 140); px < W; px += 140) {
      ctx.fillRect(px + 20, bridgeY + 10, 12, 18)
    }
    if (!reducedMotion) {
      for (let c = 0; c < 4; c++) {
        const carX = ((c * 260 + elapsedSec * 42 - scrollX * 0.5) % (W + 120)) - 60
        ctx.fillStyle = c % 2 === 0 ? '#F43F5E' : '#FACC15'
        ctx.fillRect(carX, bridgeY - 7, 18, 7)
        ctx.fillStyle = '#E0F2FE'
        ctx.fillRect(carX + 4, bridgeY - 11, 10, 4)
      }
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 2: COMMERCIAL & RESIDENTIAL AVENUE (شارع الكهرباء)
  // --------------------------------------------------------------------------
  if (theme === 'electricity_street') {
    // Warm distant hills
    ctx.fillStyle = '#FCD34D'
    ctx.beginPath()
    ctx.moveTo(0, baseHorizonY)
    for (let x = 0; x <= W + 80; x += 80) {
      const hy = baseHorizonY - 48 - Math.sin((x + scrollX) * 0.008) * 22
      ctx.lineTo(x, hy)
    }
    ctx.lineTo(W, baseHorizonY)
    ctx.closePath()
    ctx.fill()

    // Distant pitched-roof neighborhood houses & commercial plazas
    for (let i = -1; i < 8; i++) {
      const hx = i * 160 - (scrollX % 160)
      const seed = Math.abs(i + Math.floor(scrollX / 160))
      const hw = 96
      const hh = 64 + (seed % 3) * 18
      const hy = baseHorizonY - hh
      ctx.fillStyle = seed % 2 === 0 ? '#FEF3C7' : '#FDE68A'
      ctx.fillRect(hx, hy, hw, hh)
      // Terracotta pitched roof
      ctx.fillStyle = '#EA580C'
      ctx.beginPath()
      ctx.moveTo(hx - 6, hy)
      ctx.lineTo(hx + hw * 0.5, hy - 24)
      ctx.lineTo(hx + hw + 6, hy)
      ctx.closePath()
      ctx.fill()
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 3: THE LIGHTING FACTORY (مصنع الإنارة) — Giant Gears, Silos & Pipes
  // --------------------------------------------------------------------------
  if (theme === 'lighting_factory') {
    for (let i = -1; i < 7; i++) {
      const fx = i * 200 - (scrollX % 200)
      const seed = Math.abs(i + Math.floor(scrollX / 200))

      // Industrial storage silo & pipework
      ctx.fillStyle = '#1E293B'
      ctx.fillRect(fx + 20, baseHorizonY - 170, 74, 170)
      ctx.fillStyle = '#334155'
      ctx.beginPath()
      ctx.arc(fx + 57, baseHorizonY - 170, 37, Math.PI, 0)
      ctx.fill()

      // Horizontal overhead factory pipe
      ctx.fillStyle = '#475569'
      ctx.fillRect(fx, baseHorizonY - 135, 200, 12)

      // Giant slowly rotating background gear
      const gx = fx + 145
      const gy = baseHorizonY - 95
      ctx.save()
      ctx.translate(gx, gy)
      if (!reducedMotion) ctx.rotate(elapsedSec * (seed % 2 === 0 ? 0.35 : -0.35))
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.35)'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(0, 0, 36, 0, Math.PI * 2)
      ctx.stroke()
      for (let t = 0; t < 8; t++) {
        const ang = (t * Math.PI) / 4
        ctx.fillStyle = 'rgba(249, 115, 22, 0.35)'
        ctx.fillRect(Math.cos(ang) * 36 - 4, Math.sin(ang) * 36 - 4, 8, 8)
      }
      ctx.restore()
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 4: RESIDENTIAL & COPPER WORLD (حي الإنترفون) — Green Hills & Villas
  // --------------------------------------------------------------------------
  if (theme === 'intercom_district') {
    // Lush green garden hills
    ctx.fillStyle = '#5EEAD4'
    ctx.beginPath()
    ctx.moveTo(0, baseHorizonY)
    for (let x = 0; x <= W + 60; x += 60) {
      ctx.lineTo(x, baseHorizonY - 52 - Math.cos((x + scrollX) * 0.009) * 18)
    }
    ctx.lineTo(W, baseHorizonY)
    ctx.closePath()
    ctx.fill()

    // Giant insulated copper cable arches in the distance
    ctx.strokeStyle = '#EA580C'
    ctx.lineWidth = 5
    for (let i = -1; i < 6; i++) {
      const cx = i * 220 - (scrollX % 220)
      ctx.beginPath()
      ctx.moveTo(cx, baseHorizonY - 30)
      ctx.quadraticCurveTo(cx + 110, baseHorizonY - 140, cx + 220, baseHorizonY - 30)
      ctx.stroke()
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 5: THE POWER STATION (محطة الطاقة) — High-Voltage Pylons & Grid
  // --------------------------------------------------------------------------
  if (theme === 'power_station') {
    for (let i = -1; i < 6; i++) {
      const px = i * 240 - (scrollX % 240)
      const topY = baseHorizonY - 210

      // Lattice High-Voltage Transmission Tower
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 2.2
      ctx.beginPath()
      ctx.moveTo(px + 40, baseHorizonY)
      ctx.lineTo(px + 65, topY)
      ctx.lineTo(px + 90, baseHorizonY)
      // Cross arms
      ctx.moveTo(px + 25, topY + 35)
      ctx.lineTo(px + 105, topY + 35)
      ctx.moveTo(px + 15, topY + 75)
      ctx.lineTo(px + 115, topY + 75)
      ctx.stroke()

      // Sagging copper HV lines between pylons
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.5)'
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.moveTo(px + 105, topY + 35)
      ctx.quadraticCurveTo(px + 185, topY + 75, px + 265, topY + 35)
      ctx.stroke()
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 6: THE FUTURISTIC / DARK CITY (المدينة المظلمة) — Neon Skybridges & Hover Traffic
  // --------------------------------------------------------------------------
  if (theme === 'dark_city') {
    for (let i = -1; i < 8; i++) {
      const bx = i * 175 - (scrollX % 175)
      const seed = Math.abs(i + Math.floor(scrollX / 175))
      const bw = 115
      const bh = 160 + (seed % 4) * 30
      const by = baseHorizonY - bh

      ctx.fillStyle = '#0F172A'
      ctx.fillRect(bx, by, bw, bh)

      // Cyan / Purple futuristic vertical neon trim
      ctx.fillStyle = seed % 2 === 0 ? '#22D3EE' : '#A855F7'
      ctx.fillRect(bx + 6, by + 10, 3, bh - 20)
      ctx.fillRect(bx + bw - 9, by + 10, 3, bh - 20)

      // Elevated glowing energy skybridge between towers
      if (seed % 2 === 0) {
        ctx.fillStyle = 'rgba(34, 211, 238, 0.28)'
        ctx.fillRect(bx + bw, by + 65, 60, 8)
      }
    }

    // Slow-moving background futuristic hover vehicles
    if (!reducedMotion && graphicsQuality !== 'low') {
      for (let v = 0; v < 3; v++) {
        const vx = ((v * 310 + elapsedSec * 55 - scrollX * 0.4) % (W + 140)) - 70
        const vy = 115 + v * 42
        ctx.fillStyle = '#22D3EE'
        ctx.fillRect(vx, vy, 22, 5)
        ctx.fillStyle = 'rgba(34, 211, 238, 0.35)'
        ctx.fillRect(vx - 18, vy + 1, 18, 3)
      }
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 7: THE LIGHTING TOWER (برج الإنارة) — High-Altitude Wind Turbines & Cables
  // --------------------------------------------------------------------------
  if (theme === 'lighting_tower') {
    // Diagonal suspension cables anchoring the megatower
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.25)'
    ctx.lineWidth = 2
    for (let c = -1; c < 6; c++) {
      const cx = c * 240 - (scrollX % 240)
      ctx.beginPath()
      ctx.moveTo(cx, baseHorizonY)
      ctx.lineTo(cx + 140, 0)
      ctx.stroke()
    }

    // Giant rotating high-altitude wind turbines poking above the cloud deck
    for (let i = -1; i < 6; i++) {
      const tx = i * 230 - (scrollX % 230) + 80
      const ty = baseHorizonY - 150
      ctx.fillStyle = '#E2E8F0'
      ctx.fillRect(tx - 3, ty, 6, 150)

      ctx.save()
      ctx.translate(tx, ty)
      if (!reducedMotion) ctx.rotate(elapsedSec * 1.1 + i)
      ctx.fillStyle = '#F8FAFC'
      for (let b = 0; b < 3; b++) {
        ctx.rotate((Math.PI * 2) / 3)
        ctx.fillRect(-2, -48, 4, 48)
      }
      ctx.restore()
    }

    // Wind streamlines in Level 7
    if (!reducedMotion && graphicsQuality !== 'low') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
      ctx.lineWidth = 1.6
      for (let i = 0; i < 6; i++) {
        const wx = W - ((elapsedSec * 220 + i * 160) % (W + 160)) - 80
        const wy = 70 + ((i * 53) % (H - 160))
        ctx.beginPath()
        ctx.moveTo(wx, wy)
        ctx.lineTo(wx + 56, wy)
        ctx.stroke()
      }
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 8: THE FINAL ENERGY FORTRESS (قلعة الظلام) — Armored Citadel Spires
  // --------------------------------------------------------------------------
  for (let i = -1; i < 7; i++) {
    const fx = i * 195 - (scrollX % 195)
    const seed = Math.abs(i + Math.floor(scrollX / 195))
    const fw = 135
    const fh = 175 + (seed % 3) * 32
    const fy = baseHorizonY - fh

    // Armored citadel monolith
    ctx.fillStyle = '#111827'
    ctx.fillRect(fx, fy, fw, fh)
    // Battlement horns on top
    ctx.beginPath()
    ctx.moveTo(fx, fy)
    ctx.lineTo(fx + 22, fy - 24)
    ctx.lineTo(fx + 40, fy)
    ctx.moveTo(fx + fw - 40, fy)
    ctx.lineTo(fx + fw - 22, fy - 24)
    ctx.lineTo(fx + fw, fy)
    ctx.fill()

    // Pulsing plasma conduit column
    const pulse = 0.45 + 0.35 * Math.sin(elapsedSec * 3.5 + i)
    ctx.fillStyle = `rgba(249, 115, 22, ${pulse.toFixed(2)})`
    ctx.fillRect(fx + fw * 0.5 - 5, fy + 24, 10, fh - 40)
  }
}

function renderMidgroundParallaxLayer(
  ctx: CanvasRenderingContext2D,
  stage: StageDefinition,
  cam: CameraState,
  elapsedSec: number,
  W: number,
  H: number,
  reducedMotion: boolean,
  graphicsQuality: GraphicsQuality
) {
  const theme = stage.theme
  const scrollX = cam.x * 0.42
  const groundLine = Math.round(stage.groundY - cam.y + 4)

  // --------------------------------------------------------------------------
  // STAGE 1: THE LIVING CITY (مدينة النور)
  // Colorful buildings, shops, balconies, streetlights, swaying trees, road signs & parked cars
  // --------------------------------------------------------------------------
  if (theme === 'city_of_light') {
    const facadePalette = ['#F8FAFC', '#FEF3C7', '#E0F2FE', '#FCE7F3']
    const accentPalette = ['#0284C7', '#EA580C', '#0D9488', '#4F46E5']

    for (let i = -1; i < 7; i++) {
      const mx = i * 270 - (scrollX % 270)
      const idx = Math.abs(i + Math.floor(scrollX / 270))
      const bW = 168
      const bH = 152 + (idx % 3) * 24
      const bY = groundLine - bH

      // Building main facade + 2.5D side wall
      ctx.fillStyle = facadePalette[idx % facadePalette.length]
      ctx.fillRect(mx + 16, bY, bW, bH)
      ctx.fillStyle = '#CBD5E1'
      ctx.fillRect(mx + 16 + bW, bY + 6, 14, bH - 6)

      // Colorful roof cornice
      ctx.fillStyle = accentPalette[idx % accentPalette.length]
      ctx.fillRect(mx + 12, bY, bW + 8, 8)

      // Upper floor windows & wrought-iron balconies
      for (let row = 0; row < 2; row++) {
        const wy = bY + 22 + row * 38
        for (let col = 0; col < 3; col++) {
          const wx = mx + 30 + col * 48
          ctx.fillStyle = '#38BDF8'
          ctx.fillRect(wx, wy, 26, 24)
          ctx.fillStyle = '#0F172A'
          ctx.fillRect(wx - 3, wy + 20, 32, 5) // Balcony railing
        }
      }

      // Ground-floor ENARAH showroom & striped awning
      ctx.fillStyle = '#0F172A'
      ctx.fillRect(mx + 24, groundLine - 62, 152, 18)
      ctx.fillStyle = '#FACC15'
      ctx.font = 'bold 9.5px Cairo, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('الإنارة الحديثة • ENARAH', mx + 100, groundLine - 50)

      // Glowing shop window with warm pendant lights
      ctx.fillStyle = '#FEF9C3'
      ctx.fillRect(mx + 28, groundLine - 42, 144, 38)
      ctx.fillStyle = '#F59E0B'
      ctx.beginPath()
      ctx.arc(mx + 65, groundLine - 30, 5, 0, Math.PI * 2)
      ctx.arc(mx + 100, groundLine - 28, 5, 0, Math.PI * 2)
      ctx.arc(mx + 135, groundLine - 30, 5, 0, Math.PI * 2)
      ctx.fill()

      // Gentle swaying street tree beside building
      const treeX = mx + 222
      const sway = reducedMotion ? 0 : Math.sin(elapsedSec * 2.2 + idx) * 3.5
      ctx.fillStyle = '#78350F'
      ctx.fillRect(treeX - 4, groundLine - 44, 8, 44)
      ctx.fillStyle = '#10B981'
      ctx.beginPath()
      ctx.arc(treeX + sway, groundLine - 58, 22, 0, Math.PI * 2)
      ctx.arc(treeX - 12 + sway, groundLine - 48, 16, 0, Math.PI * 2)
      ctx.arc(treeX + 12 + sway, groundLine - 48, 16, 0, Math.PI * 2)
      ctx.fill()

      // Streetlight pole & road sign or parked car
      const poleX = mx + 254
      ctx.fillStyle = '#475569'
      ctx.fillRect(poleX - 2, groundLine - 115, 4, 115)
      ctx.fillStyle = '#FEF08A'
      ctx.beginPath()
      ctx.arc(poleX - 10, groundLine - 112, 5, 0, Math.PI * 2)
      ctx.fill()

      if (idx % 2 === 0) {
        // Parked compact car on street curb
        ctx.fillStyle = '#0284C7'
        ctx.fillRect(mx + 198, groundLine - 16, 42, 12)
        ctx.fillStyle = '#BAE6FD'
        ctx.fillRect(mx + 206, groundLine - 24, 24, 9)
        ctx.fillStyle = '#0F172A'
        ctx.beginPath()
        ctx.arc(mx + 207, groundLine - 4, 5, 0, Math.PI * 2)
        ctx.arc(mx + 231, groundLine - 4, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 2: COMMERCIAL & RESIDENTIAL STREET (شارع الكهرباء)
  // Houses with pitched roofs, gardens, fences, garages + lively commercial showrooms
  // --------------------------------------------------------------------------
  if (theme === 'electricity_street') {
    for (let i = -1; i < 7; i++) {
      const mx = i * 280 - (scrollX % 280)
      const idx = Math.abs(i + Math.floor(scrollX / 280))

      if (idx % 2 === 0) {
        // Warm Residential House with Pitched Roof, Garage & Garden Fence
        const hX = mx + 20
        const hW = 155
        const hH = 115
        const hY = groundLine - hH
        ctx.fillStyle = '#FFFBEB'
        ctx.fillRect(hX, hY, hW, hH)
        // Pitched terracotta roof
        ctx.fillStyle = '#C2410C'
        ctx.beginPath()
        ctx.moveTo(hX - 10, hY)
        ctx.lineTo(hX + hW * 0.5, hY - 38)
        ctx.lineTo(hX + hW + 10, hY)
        ctx.closePath()
        ctx.fill()

        // Garage door with horizontal slats
        ctx.fillStyle = '#CBD5E1'
        ctx.fillRect(hX + 14, groundLine - 48, 56, 48)
        ctx.strokeStyle = '#64748B'
        ctx.lineWidth = 1.5
        for (let gy = groundLine - 40; gy < groundLine - 6; gy += 10) {
          ctx.beginPath()
          ctx.moveTo(hX + 16, gy)
          ctx.lineTo(hX + 68, gy)
          ctx.stroke()
        }

        // Warm lit house window
        ctx.fillStyle = '#FDE047'
        ctx.fillRect(hX + 90, hY + 26, 42, 30)

        // Garden fence & bushes next to house
        ctx.fillStyle = '#D97706'
        for (let fx = hX + hW + 8; fx < mx + 265; fx += 12) {
          ctx.fillRect(fx, groundLine - 28, 6, 28)
        }
        ctx.fillRect(hX + hW + 6, groundLine - 20, 82, 4)
      } else {
        // Lively Commercial Lighting Showroom with Animated Signboard
        const sX = mx + 18
        const sW = 185
        const sH = 148
        const sY = groundLine - sH
        ctx.fillStyle = '#78350F'
        ctx.fillRect(sX, sY, sW, sH)
        ctx.fillStyle = '#451A03'
        ctx.fillRect(sX + sW, sY + 6, 14, sH - 6)

        // Showroom display windows with hanging chandeliers
        ctx.fillStyle = '#FEF3C7'
        ctx.fillRect(sX + 16, groundLine - 58, sW - 32, 52)
        ctx.fillStyle = '#EA580C'
        ctx.fillRect(sX + 10, groundLine - 66, sW - 20, 10)

        // Ground-floor storefront fascia sign (positioned below elevated platforms so it never overlaps foreground switches/labels)
        const signGlow = 0.72 + 0.25 * Math.sin(elapsedSec * 5 + idx)
        ctx.fillStyle = '#0F172A'
        ctx.fillRect(sX + 14, groundLine - 88, sW - 28, 19)
        ctx.fillStyle = `rgba(250, 204, 21, ${signGlow.toFixed(2)})`
        ctx.font = 'bold 9.5px Cairo, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('✨ معرض الإنارة والسبوت لايت ✨', sX + sW * 0.5, groundLine - 75)
      }
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 3: THE LIGHTING FACTORY (مصنع الإنارة)
  // Industrial machinery, rotating gears, pipes with rising steam, electrical panels & warning lights
  // --------------------------------------------------------------------------
  if (theme === 'lighting_factory') {
    for (let i = -1; i < 7; i++) {
      const mx = i * 260 - (scrollX % 260)
      const idx = Math.abs(i + Math.floor(scrollX / 260))

      // Heavy steel H-beam column
      ctx.fillStyle = '#334155'
      ctx.fillRect(mx + 14, 34, 18, groundLine - 34)
      ctx.fillStyle = '#1E293B'
      ctx.fillRect(mx + 18, 34, 10, groundLine - 34)

      // Industrial Machinery Housing & Electrical Panel
      const mX = mx + 52
      const mY = groundLine - 132
      ctx.fillStyle = '#1E293B'
      ctx.fillRect(mX, mY, 148, 132)
      ctx.strokeStyle = '#EA580C'
      ctx.lineWidth = 2
      ctx.strokeRect(mX, mY, 148, 132)

      // Yellow/Black hazard stripe header on machine
      ctx.fillStyle = '#FACC15'
      ctx.fillRect(mX, mY, 148, 10)

      // Rotating Ventilation Fan inside machine housing
      const fanX = mX + 46
      const fanY = mY + 58
      ctx.fillStyle = '#0F172A'
      ctx.beginPath()
      ctx.arc(fanX, fanY, 26, 0, Math.PI * 2)
      ctx.fill()
      ctx.save()
      ctx.translate(fanX, fanY)
      if (!reducedMotion) ctx.rotate(elapsedSec * 3.2 * (idx % 2 === 0 ? 1 : -1))
      ctx.fillStyle = '#94A3B8'
      for (let b = 0; b < 4; b++) {
        ctx.rotate(Math.PI / 2)
        ctx.fillRect(-4, -22, 8, 22)
      }
      ctx.restore()

      // Electrical Control Panel LEDs
      ctx.fillStyle = '#0F172A'
      ctx.fillRect(mX + 90, mY + 32, 44, 62)
      const blink = Math.floor(elapsedSec * 4 + idx) % 2 === 0
      ctx.fillStyle = blink ? '#22C55E' : '#EF4444'
      ctx.beginPath()
      ctx.arc(mX + 104, mY + 46, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#38BDF8'
      ctx.fillRect(mX + 98, mY + 60, 28, 14)

      // Animated Warning Beacon on top of machinery
      const beaconPulse = 0.4 + 0.6 * Math.abs(Math.sin(elapsedSec * 6 + idx))
      ctx.fillStyle = `rgba(249, 115, 22, ${beaconPulse.toFixed(2)})`
      ctx.beginPath()
      ctx.arc(mX + 74, mY - 8, 9, 0, Math.PI * 2)
      ctx.fill()

      // Vertical steam pipe + periodic rising steam puffs
      const pipeX = mx + 224
      ctx.fillStyle = '#64748B'
      ctx.fillRect(pipeX, groundLine - 150, 14, 150)
      if (!reducedMotion && graphicsQuality !== 'low') {
        const steamCycle = (elapsedSec * 28 + idx * 19) % 55
        const steamAlpha = Math.max(0, 0.45 - steamCycle / 120)
        ctx.fillStyle = `rgba(226, 232, 240, ${steamAlpha.toFixed(2)})`
        ctx.beginPath()
        ctx.arc(pipeX + 7, groundLine - 155 - steamCycle, 8 + steamCycle * 0.22, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 4: SMART RESIDENTIAL & COPPER WORLD (حي الإنترفون)
  // Modern smart villas, gardens, fences, intercom pillars & giant insulated copper cables
  // --------------------------------------------------------------------------
  if (theme === 'intercom_district') {
    for (let i = -1; i < 7; i++) {
      const mx = i * 270 - (scrollX % 270)
      const idx = Math.abs(i + Math.floor(scrollX / 270))

      // Modern Smart Villa
      const vX = mx + 24
      const vW = 162
      const vH = 136
      const vY = groundLine - vH
      ctx.fillStyle = '#F8FAFC'
      ctx.fillRect(vX, vY, vW, vH)
      ctx.fillStyle = '#0F766E'
      ctx.fillRect(vX, vY, vW, 12)
      // Panoramic smart glass balcony
      ctx.fillStyle = '#38BDF8'
      ctx.fillRect(vX + 20, vY + 26, 122, 36)
      // Villa automatic garage & wood door
      ctx.fillStyle = '#334155'
      ctx.fillRect(vX + 18, groundLine - 52, 68, 52)
      ctx.fillStyle = '#B45309'
      ctx.fillRect(vX + 106, groundLine - 48, 34, 48)

      // Smart Intercom Gate Pillar with Glowing Screen
      const pillarX = vX + vW + 16
      ctx.fillStyle = '#1E293B'
      ctx.fillRect(pillarX, groundLine - 64, 18, 64)
      ctx.fillStyle = '#10B981'
      ctx.fillRect(pillarX + 3, groundLine - 50, 12, 16)

      // Giant Insulated Copper Cable Conduit connecting villas
      ctx.strokeStyle = '#C2410C'
      ctx.lineWidth = 9
      ctx.beginPath()
      ctx.moveTo(vX + vW, vY + 45)
      ctx.quadraticCurveTo(vX + vW + 54, vY + 78, mx + 294, vY + 45)
      ctx.stroke()
      ctx.strokeStyle = '#FDBA74'
      ctx.lineWidth = 3
      ctx.stroke()

      // Swaying garden tree
      const treeX = mx + 242
      const sway = reducedMotion ? 0 : Math.sin(elapsedSec * 2.4 + idx) * 4
      ctx.fillStyle = '#78350F'
      ctx.fillRect(treeX - 4, groundLine - 42, 8, 42)
      ctx.fillStyle = '#059669'
      ctx.beginPath()
      ctx.arc(treeX + sway, groundLine - 56, 20, 0, Math.PI * 2)
      ctx.fill()
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 5: THE POWER STATION (محطة الطاقة)
  // Giant transformers with radiator fins, rotating cooling fans, voltage meters & busbars
  // --------------------------------------------------------------------------
  if (theme === 'power_station') {
    for (let i = -1; i < 7; i++) {
      const mx = i * 265 - (scrollX % 265)
      const idx = Math.abs(i + Math.floor(scrollX / 265))
      const tX = mx + 28
      const tW = 165
      const tH = 142
      const tY = groundLine - tH

      // Heavy High-Voltage Transformer Tank
      ctx.fillStyle = '#1E293B'
      ctx.fillRect(tX, tY, tW, tH)
      ctx.strokeStyle = '#EA580C'
      ctx.lineWidth = 2.5
      ctx.strokeRect(tX, tY, tW, tH)

      // Vertical Radiator Cooling Fins
      ctx.fillStyle = '#0F172A'
      for (let finX = tX + 14; finX < tX + 86; finX += 12) {
        ctx.fillRect(finX, tY + 18, 6, tH - 36)
      }

      // Ceramic High-Voltage Bushings on Transformer Roof
      for (let b = 0; b < 3; b++) {
        const bx = tX + 32 + b * 48
        ctx.fillStyle = '#9A3412'
        ctx.fillRect(bx - 6, tY - 28, 12, 28)
        ctx.fillStyle = '#38BDF8'
        ctx.beginPath()
        ctx.arc(bx, tY - 32, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Rotating Cooling Fan & Voltage Gauge
      const fanX = tX + 125
      const fanY = tY + 75
      ctx.fillStyle = '#090D16'
      ctx.beginPath()
      ctx.arc(fanX, fanY, 24, 0, Math.PI * 2)
      ctx.fill()
      ctx.save()
      ctx.translate(fanX, fanY)
      if (!reducedMotion) ctx.rotate(elapsedSec * 4 * (idx % 2 === 0 ? 1 : -1))
      ctx.fillStyle = '#FB923C'
      for (let b = 0; b < 4; b++) {
        ctx.rotate(Math.PI / 2)
        ctx.fillRect(-3, -20, 6, 20)
      }
      ctx.restore()

      // Analog Voltage Meter
      ctx.fillStyle = '#FEF3C7'
      ctx.fillRect(tX + 105, tY + 20, 40, 20)
      ctx.strokeStyle = '#EF4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(tX + 125, tY + 38)
      ctx.lineTo(tX + 125 + Math.sin(elapsedSec * 3 + idx) * 12, tY + 24)
      ctx.stroke()
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 6: THE FUTURISTIC / DARK CITY (المدينة المظلمة)
  // Futuristic towers, elevated walkways, energy bridges & animated architectural lights
  // --------------------------------------------------------------------------
  if (theme === 'dark_city') {
    for (let i = -1; i < 7; i++) {
      const mx = i * 260 - (scrollX % 260)
      const idx = Math.abs(i + Math.floor(scrollX / 260))
      const bX = mx + 24
      const bW = 160
      const bH = 165 + (idx % 2) * 28
      const bY = groundLine - bH

      // Sleek futuristic building body
      ctx.fillStyle = '#0F172A'
      ctx.fillRect(bX, bY, bW, bH)
      ctx.strokeStyle = idx % 2 === 0 ? '#22D3EE' : '#A855F7'
      ctx.lineWidth = 2
      ctx.strokeRect(bX, bY, bW, bH)

      // Animated horizontal light bands
      const bandPulse = 0.45 + 0.45 * Math.sin(elapsedSec * 3 + idx)
      ctx.fillStyle =
        idx % 2 === 0
          ? `rgba(34, 211, 238, ${bandPulse.toFixed(2)})`
          : `rgba(168, 85, 247, ${bandPulse.toFixed(2)})`
      for (let ly = bY + 24; ly < groundLine - 30; ly += 32) {
        ctx.fillRect(bX + 14, ly, bW - 28, 4)
      }

      // Elevated Energy Walkway connecting buildings
      ctx.fillStyle = 'rgba(34, 211, 238, 0.25)'
      ctx.fillRect(bX + bW, groundLine - 88, 100, 10)
      ctx.fillStyle = '#22D3EE'
      ctx.fillRect(bX + bW, groundLine - 88, 100, 2)
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 7: THE LIGHTING TOWER (برج الإنارة)
  // Skyscraper diagrid glass structure, tower cranes & high-altitude turbines
  // --------------------------------------------------------------------------
  if (theme === 'lighting_tower') {
    for (let i = -1; i < 7; i++) {
      const mx = i * 260 - (scrollX % 260)
      const tX = mx + 30
      const tW = 150
      const tH = 190
      const tY = groundLine - tH

      // Skyscraper reflective blue glass curtain wall
      ctx.fillStyle = 'rgba(14, 116, 144, 0.55)'
      ctx.fillRect(tX, tY, tW, tH)

      // Diagrid structural steel cross-bracing
      ctx.strokeStyle = '#E2E8F0'
      ctx.lineWidth = 2
      ctx.strokeRect(tX, tY, tW, tH)
      ctx.beginPath()
      ctx.moveTo(tX, tY)
      ctx.lineTo(tX + tW, tY + 95)
      ctx.lineTo(tX, tY + 190)
      ctx.moveTo(tX + tW, tY)
      ctx.lineTo(tX, tY + 95)
      ctx.lineTo(tX + tW, tY + 190)
      ctx.stroke()

      // High-altitude horizontal crane jib
      ctx.fillStyle = '#F59E0B'
      ctx.fillRect(tX + tW, tY + 35, 110, 8)
    }
    return
  }

  // --------------------------------------------------------------------------
  // STAGE 8: THE FINAL ENERGY FORTRESS (قلعة الظلام)
  // Massive mechanical fortress architecture, energy chambers, plasma conduits & gates
  // --------------------------------------------------------------------------
  for (let i = -1; i < 7; i++) {
    const mx = i * 265 - (scrollX % 265)
    const idx = Math.abs(i + Math.floor(scrollX / 265))
    const fX = mx + 22
    const fW = 175
    const fH = 165
    const fY = groundLine - fH

    // Heavy armored fortress bulkhead
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(fX, fY, fW, fH)
    ctx.strokeStyle = '#F43F5E'
    ctx.lineWidth = 2
    ctx.strokeRect(fX, fY, fW, fH)

    // Glowing Plasma Reactor Chamber inside fortress wall
    const chX = fX + 55
    const chY = fY + 24
    ctx.fillStyle = '#090D16'
    ctx.fillRect(chX, chY, 65, 115)
    const ringY = chY + 15 + ((elapsedSec * 45 + idx * 20) % 85)
    ctx.fillStyle = '#F97316'
    ctx.fillRect(chX + 6, ringY, 53, 8)
    ctx.fillStyle = 'rgba(244, 63, 94, 0.35)'
    ctx.fillRect(chX + 14, chY + 6, 37, 103)

    // Controlled red/orange warning beacons
    const warn = Math.floor(elapsedSec * 5 + idx) % 2 === 0
    ctx.fillStyle = warn ? '#EF4444' : '#F97316'
    ctx.beginPath()
    ctx.arc(fX + 24, fY + 24, 6, 0, Math.PI * 2)
    ctx.arc(fX + fW - 24, fY + 24, 6, 0, Math.PI * 2)
    ctx.fill()
  }
}

// ============================================================================
// SECTION 8 — STAGE-AUTHENTIC 2.5D PLATFORMS (BELONG TO THEIR WORLDS)
// ============================================================================

function render25DPlatform(
  ctx: CanvasRenderingContext2D,
  plat: PlatformData,
  hero: HeroPhysicsState,
  elapsedSec: number,
  stageTheme: WorldThemeId = 'city_of_light'
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
  const isGroundSlab = h >= 45
  const bevelTop = isGroundSlab ? 10 : 7
  const depthSide = 8

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

  // Choose world-authentic colors & surface treatments
  let topColor = '#E2E8F0'
  let frontColor = '#475569'
  let sideColor = '#1E293B'
  let trimColor = '#38BDF8'

  if (stageTheme === 'city_of_light') {
    topColor = isGroundSlab ? '#F1F5F9' : '#FDE68A'
    frontColor = isGroundSlab ? '#64748B' : '#0284C7'
    sideColor = '#334155'
    trimColor = '#FACC15'
  } else if (stageTheme === 'electricity_street') {
    topColor = isGroundSlab ? '#FEF3C7' : '#FDBA74'
    frontColor = isGroundSlab ? '#92400E' : '#B45309'
    sideColor = '#451A03'
    trimColor = '#F59E0B'
  } else if (stageTheme === 'lighting_factory') {
    topColor = '#CBD5E1'
    frontColor = '#334155'
    sideColor = '#0F172A'
    trimColor = '#F97316'
  } else if (stageTheme === 'intercom_district') {
    topColor = isGroundSlab ? '#34D399' : material === 'neon_glass' ? '#A5F3FC' : '#FDBA74'
    frontColor = isGroundSlab ? '#475569' : '#C2410C'
    sideColor = '#1E293B'
    trimColor = isGroundSlab ? '#10B981' : '#EA580C'
  } else if (stageTheme === 'power_station') {
    topColor = material === 'copper' ? '#FDBA74' : '#94A3B8'
    frontColor = material === 'copper' ? '#9A3412' : '#1E293B'
    sideColor = '#090D16'
    trimColor = '#FB923C'
  } else if (stageTheme === 'dark_city') {
    topColor = '#67E8F9'
    frontColor = '#1E1B4B'
    sideColor = '#090D16'
    trimColor = '#22D3EE'
  } else if (stageTheme === 'lighting_tower') {
    topColor = '#E0F2FE'
    frontColor = '#0369A1'
    sideColor = '#0C4A6E'
    trimColor = '#38BDF8'
  } else if (stageTheme === 'darkness_fortress') {
    topColor = '#94A3B8'
    frontColor = '#1F2937'
    sideColor = '#090D16'
    trimColor = '#F43F5E'
  }

  // Soft drop shadow + structural support brackets under elevated platforms
  if (!isGroundSlab) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.26)'
    ctx.fillRect(x + 6, y + h, w, 6)

    // Under-platform architectural truss / cable / bracket detail
    if (
      stageTheme === 'lighting_factory' ||
      stageTheme === 'power_station' ||
      stageTheme === 'lighting_tower'
    ) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      for (let tx = x + 12; tx < x + w - 20; tx += 28) {
        ctx.moveTo(tx, y + h)
        ctx.lineTo(tx + 14, y + h + 8)
        ctx.lineTo(tx + 28, y + h)
      }
      ctx.stroke()
    }
  }

  // Extend ground slab foundation downward for tall portrait viewports so no sky shows beneath the road
  const renderH = isGroundSlab ? Math.max(h, 240) : h

  // 2.5D Right-side depth plane
  ctx.fillStyle = sideColor
  ctx.beginPath()
  ctx.moveTo(x + w, y)
  ctx.lineTo(x + w + depthSide, y + 4)
  ctx.lineTo(x + w + depthSide, y + renderH)
  ctx.lineTo(x + w, y + renderH)
  ctx.closePath()
  ctx.fill()

  // Main front face
  ctx.fillStyle = frontColor
  ctx.fillRect(x, y + bevelTop, w, renderH - bevelTop)
  if (isGroundSlab && renderH > h) {
    // Subterranean electrical conduit foundation layer beneath the road slab
    ctx.fillStyle = sideColor
    ctx.fillRect(x, y + h, w, renderH - h)
    ctx.strokeStyle = trimColor
    ctx.globalAlpha = alpha * 0.35
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, y + h + 14)
    ctx.lineTo(x + w, y + h + 14)
    ctx.stroke()
    ctx.globalAlpha = alpha
  }

  // Top walk surface
  ctx.fillStyle = topColor
  ctx.fillRect(x, y, w, bevelTop)

  // Trim line
  ctx.fillStyle = trimColor
  ctx.fillRect(x, y + bevelTop - 2, w, 2)

  // Stage-Authentic Surface & Architectural Details
  if (kind === 'conveyor') {
    // Industrial Conveyor Belt with end rollers & moving directional chevrons
    const dir = (plat.conveyorSpeed || 0) >= 0 ? 1 : -1
    const offset = ((elapsedSec * 60 * dir) % 24 + 24) % 24
    ctx.fillStyle = '#FACC15'
    for (let cx = x + 12 + offset; cx < x + w - 16; cx += 24) {
      ctx.fillRect(cx, y + bevelTop + 5, 8, 5)
    }
    // End mechanical rollers
    ctx.fillStyle = '#94A3B8'
    ctx.beginPath()
    ctx.arc(x + 10, y + h * 0.5, 6, 0, Math.PI * 2)
    ctx.arc(x + w - 10, y + h * 0.5, 6, 0, Math.PI * 2)
    ctx.fill()
  } else if (isGroundSlab && (stageTheme === 'city_of_light' || stageTheme === 'electricity_street')) {
    // Alternating sidewalk curb stones (أحجار رصيف الشارع) & pavement joints
    for (let cx = x; cx < x + w - 24; cx += 48) {
      ctx.fillStyle = stageTheme === 'city_of_light' ? '#FACC15' : '#F59E0B'
      ctx.fillRect(cx, y + bevelTop, 24, 6)
      ctx.fillStyle = '#E2E8F0'
      ctx.fillRect(cx + 24, y + bevelTop, 24, 6)
      // Vertical masonry joint line
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'
      ctx.fillRect(cx, y + bevelTop + 6, 2, h - bevelTop - 6)
    }
  } else if (material === 'copper' || stageTheme === 'intercom_district') {
    // Copper Cable Bridge / Busbar ribs
    ctx.fillStyle = 'rgba(254, 215, 170, 0.45)'
    for (let rx = x + 16; rx < x + w - 16; rx += 32) {
      ctx.fillRect(rx, y + bevelTop + 2, 6, h - bevelTop - 4)
    }
  } else if (stageTheme === 'lighting_factory' || stageTheme === 'darkness_fortress') {
    // Riveted steel plates & hazard markings
    ctx.fillStyle = 'rgba(250, 204, 21, 0.65)'
    for (let hx = x + 14; hx < x + w - 18; hx += 36) {
      ctx.fillRect(hx, y + bevelTop + 3, 12, 3)
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
    const text = `✓ ${labelAr}`
    const tw = Math.max(64, ctx.measureText(text).width + 14)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
    ctx.fillRect(x - tw * 0.5, y - 101, tw, 18)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)'
    ctx.lineWidth = 1
    ctx.strokeRect(x - tw * 0.5, y - 101, tw, 18)
    ctx.fillStyle = '#FDE047'
    ctx.fillText(text, x, y - 88)
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

  const bob = Math.sin(elapsedSec * 4) * 1.5
  ctx.font = 'bold 9.5px Cairo, sans-serif'
  ctx.textAlign = 'center'
  const shortLabel = activated
    ? 'مفعّل ⚡'
    : labelAr.length > 18
      ? labelAr.replace('قاطع تعطيل ', 'قاطع ')
      : labelAr
  const tw = Math.max(58, ctx.measureText(shortLabel).width + 14)
  const badgeY = y - 59 + bob
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
  ctx.fillRect(x - tw * 0.5, badgeY, tw, 18)
  ctx.strokeStyle = activated ? '#10B981' : '#F59E0B'
  ctx.lineWidth = 1.2
  ctx.strokeRect(x - tw * 0.5, badgeY, tw, 18)
  ctx.fillStyle = activated ? '#6EE7B7' : '#FDE68A'
  ctx.fillText(shortLabel, x, badgeY + 13)
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

    ctx.font = 'bold 9.5px Cairo, sans-serif'
    ctx.textAlign = 'center'
    const cx = x + w * 0.5
    const tw = Math.max(64, ctx.measureText(labelAr).width + 14)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
    ctx.fillRect(cx - tw * 0.5, y - 22, tw, 18)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)'
    ctx.lineWidth = 1
    ctx.strokeRect(cx - tw * 0.5, y - 22, tw, 18)
    ctx.fillStyle = '#FCA5A5'
    ctx.fillText(labelAr, cx, y - 9)
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

  ctx.font = 'bold 10px Cairo, sans-serif'
  ctx.textAlign = 'center'
  const portalText = locked ? 'البوابة مقفلة 🔒' : `🏁 ${labelAr}`
  const ptw = Math.max(76, ctx.measureText(portalText).width + 16)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
  ctx.fillRect(x - ptw * 0.5, y - 98, ptw, 19)
  ctx.strokeStyle = locked ? '#EF4444' : '#FACC15'
  ctx.lineWidth = 1.2
  ctx.strokeRect(x - ptw * 0.5, y - 98, ptw, 19)
  ctx.fillStyle = locked ? '#FCA5A5' : '#FDE047'
  ctx.fillText(portalText, x, y - 85)
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

  // Compact world-space shield/phase badge (Boss name & health bar are in the top screen-space HUD pill)
  const bossBadgeText = `⚡ ${boss.hp}/${boss.maxHp}`
  ctx.font = 'bold 10px Cairo, sans-serif'
  ctx.textAlign = 'center'
  const btw = Math.max(46, ctx.measureText(bossBadgeText).width + 12)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
  ctx.fillRect(cx - btw * 0.5, y - 24, btw, 17)
  ctx.strokeStyle = boss.state === 'vulnerable' ? '#38BDF8' : '#EF4444'
  ctx.lineWidth = 1.2
  ctx.strokeRect(cx - btw * 0.5, y - 24, btw, 17)
  ctx.fillStyle = '#FDE047'
  ctx.fillText(bossBadgeText, cx, y - 12)

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

  // Anchor 1.08x visual sprite scale at hero's feet (centerX, bottomY) while preserving exact collision box
  ctx.translate(centerX, bottomY)
  ctx.scale(1.08, 1.08)
  ctx.translate(-centerX, -bottomY)

  // 1. Controlled Internal & External Light Illumination (Modulated by lightEnergy & floodlight)
  const isDefeated = hero.animState === 'defeat' || hero.hp <= 0
  const energyRatio = isDefeated ? 0.15 : Math.max(0.45, Math.min(1.25, hero.lightEnergy / 85))
  const auraRadius = (hero.floodlightTimer > 0 ? 92 : 48) * energyRatio
  const bulbAura = ctx.createRadialGradient(centerX, bottomY - 30, 4, centerX, bottomY - 30, auraRadius)
  bulbAura.addColorStop(0, `rgba(255, 253, 240, ${(0.3 * energyRatio).toFixed(2)})`)
  bulbAura.addColorStop(0.55, `rgba(254, 240, 138, ${(0.12 * energyRatio).toFixed(2)})`)
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

  // 3. Light Pulse Special Ability Ring (when attacking State is active)
  if (hero.animState === 'attacking' || hero.attackTimer > 0) {
    const pulseR = 26 + (0.28 - hero.attackTimer) * 160
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)'
    ctx.lineWidth = 3.5
    ctx.beginPath()
    ctx.arc(centerX, bottomY - 26, Math.max(18, pulseR), 0, Math.PI * 2)
    ctx.stroke()
  }

  // 4. Collect Shimmer Ring (when collecting state is active)
  if (hero.animState === 'collecting' || hero.collectAnimTimer > 0) {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, bottomY - 28, 24 + (0.35 - hero.collectAnimTimer) * 28, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 5. Dash Afterimage Trail (when Dash Special Ability is active)
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
  const isWalking = (hero.animState === 'walk' || isRunning) && Math.abs(hero.vx) > 12
  const stride = isWalking ? Math.sin(hero.walkCycle) * (isRunning ? 7.5 : 5.2) : 0
  const backFootLift = isWalking ? Math.max(0, -Math.cos(hero.walkCycle)) * 3.2 : 0
  const frontFootLift = isWalking ? Math.max(0, Math.cos(hero.walkCycle)) * 3.2 : 0
  const breath =
    hero.animState === 'idle'
      ? Math.sin(hero.walkCycle) * 1.3
      : hero.animState === 'landing'
      ? 2.2
      : 0

  // Subtle forward body lean when running/dashing
  const bodyLean = isRunning ? 0.08 : hero.animState === 'walk' ? 0.03 : 0
  if (bodyLean !== 0) {
    ctx.rotate(bodyLean)
  }

  // --------------------------------------------------------------------------
  // A. SMALL ANIMATED LEGS & DISTINCTIVE SHOES (Natural step lift, zero sliding)
  // --------------------------------------------------------------------------
  ctx.strokeStyle = '#1E293B'
  ctx.lineWidth = 3.5
  ctx.lineCap = 'round'

  const backFootX = -4 - stride * 0.65
  const backFootY = -4 - backFootLift + (hero.onGround ? 0 : -2)
  // Back leg
  ctx.beginPath()
  ctx.moveTo(-3, -12 + breath * 0.5)
  ctx.lineTo(backFootX, backFootY)
  ctx.stroke()
  // Back shoe (Royal Blue & Amber sole)
  ctx.fillStyle = '#0284C7'
  ctx.fillRect(backFootX - 5, backFootY - 1, 9, 5)
  ctx.fillStyle = '#FACC15'
  ctx.fillRect(backFootX - 5, backFootY + 2.5, 9, 1.5)

  const frontFootX = 4 + stride * 0.65
  const frontFootY = -4 - frontFootLift + (hero.onGround ? 0 : 1)
  // Front leg
  ctx.beginPath()
  ctx.moveTo(3, -12 + breath * 0.5)
  ctx.lineTo(frontFootX, frontFootY)
  ctx.stroke()
  // Front shoe
  ctx.fillStyle = '#0369A1'
  ctx.fillRect(frontFootX - 5, frontFootY - 1, 10, 5)
  ctx.fillStyle = '#FACC15'
  ctx.fillRect(frontFootX - 5, frontFootY + 2.5, 10, 1.5)

  // --------------------------------------------------------------------------
  // B. VISIBLE METALLIC E27 SCREW BASE (Unmistakable Light Bulb Base!)
  // --------------------------------------------------------------------------
  // Dark bottom ceramic electrical contact foot
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
  const isCelebratory = hero.animState === 'victory' || hero.animState === 'collecting'
  const isJumping = hero.animState === 'jump_prep' || hero.animState === 'jump_ascent'
  const armSwing = isWalking ? -stride * 0.65 : isCelebratory ? -8 : 0
  const backHandY = -16 + breath + (isCelebratory ? -10 : isJumping ? -6 : 0)

  // Back Arm & White/Gold Insulated Glove
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(-8, -22 + breath)
  ctx.lineTo(-14 + armSwing * 0.5, backHandY)
  ctx.stroke()
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(-14 + armSwing * 0.5, backHandY, 3.8, 0, Math.PI * 2)
  ctx.fill()

  // --------------------------------------------------------------------------
  // D. GLASS-INSPIRED LIVING LIGHT BULB HEAD WITH INTERNAL FILAMENT
  // --------------------------------------------------------------------------
  const bulbCenterY = -36 + breath
  const bulbRadius = 15.5

  // Realistic translucent glass diffuser gradient (warm illuminated core -> glass rim)
  const diffuserGrad = ctx.createRadialGradient(-2, bulbCenterY - 3, 2, 0, bulbCenterY, bulbRadius + 2)
  if (hero.animState === 'damage') {
    diffuserGrad.addColorStop(0, '#FEE2E2')
    diffuserGrad.addColorStop(0.7, '#FCA5A5')
    diffuserGrad.addColorStop(1, '#EF4444')
  } else if (isDefeated) {
    diffuserGrad.addColorStop(0, '#E2E8F0')
    diffuserGrad.addColorStop(0.7, '#94A3B8')
    diffuserGrad.addColorStop(1, '#64748B')
  } else {
    diffuserGrad.addColorStop(0, '#FFFFFF')
    diffuserGrad.addColorStop(0.5, '#FEFCE8')
    diffuserGrad.addColorStop(0.84, '#FEF08A')
    diffuserGrad.addColorStop(1, '#FACC15')
  }

  ctx.fillStyle = diffuserGrad
  ctx.beginPath()
  // Upper spherical bulb dome + smooth tapered lower neck meeting the collar at y = -25
  ctx.arc(0, bulbCenterY, bulbRadius, Math.PI * 0.82, Math.PI * 0.18, false)
  ctx.lineTo(10.5, -25 + breath)
  ctx.lineTo(-10.5, -25 + breath)
  ctx.closePath()
  ctx.fill()

  // Internal Glowing Filament Support Stem & Golden Coil (Authentic Glass Bulb Look!)
  ctx.save()
  ctx.strokeStyle = isDefeated ? 'rgba(71, 85, 105, 0.5)' : 'rgba(245, 158, 11, 0.55)'
  ctx.lineWidth = 1.3
  ctx.beginPath()
  ctx.moveTo(-3.5, -25 + breath)
  ctx.lineTo(-5, bulbCenterY - 5)
  ctx.lineTo(0, bulbCenterY - 9)
  ctx.lineTo(5, bulbCenterY - 5)
  ctx.lineTo(3.5, -25 + breath)
  ctx.stroke()
  if (!isDefeated) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(-4.5, bulbCenterY - 6)
    ctx.quadraticCurveTo(0, bulbCenterY - 11, 4.5, bulbCenterY - 6)
    ctx.stroke()
  }
  ctx.restore()

  // Crisp glass rim outline so bulb silhouette is readable on every background
  ctx.strokeStyle = isDefeated ? 'rgba(71, 85, 105, 0.7)' : 'rgba(202, 138, 4, 0.65)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Glass Specular Highlights (top-left curved reflection + right rim highlight)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
  ctx.beginPath()
  ctx.ellipse(-6.2, bulbCenterY - 6.2, 4.6, 2.3, -0.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.beginPath()
  ctx.arc(-9.5, bulbCenterY - 1.5, 1.4, 0, Math.PI * 2)
  ctx.fill()

  // --------------------------------------------------------------------------
  // E. EXPRESSIVE EYES & ANIMATED EYEBROWS ACROSS ALL 11+ STATES
  // --------------------------------------------------------------------------
  const eyeY =
    bulbCenterY +
    1 +
    (isJumping ? -1.2 : hero.animState === 'falling' ? 1.2 : 0)
  const isBlinking =
    hero.animState === 'idle' && Math.sin(elapsedSec * 2.1) > 0.96

  if (hero.animState === 'damage' || isDefeated) {
    // Squinting >< eyes on damage or defeat
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
  } else if (hero.animState === 'collecting' || hero.animState === 'victory') {
    // Happy curved celebratory eyes (^ ^)
    ctx.strokeStyle = '#0F172A'
    ctx.lineWidth = 2.1
    ctx.beginPath()
    ctx.arc(0, eyeY + 1, 2.5, Math.PI, 0, false)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(7.5, eyeY + 1, 2.5, Math.PI, 0, false)
    ctx.stroke()

    // Joyful open smile
    ctx.fillStyle = '#0F172A'
    ctx.beginPath()
    ctx.arc(3.8, eyeY + 4, 3.2, 0, Math.PI, false)
    ctx.fill()
  } else if (isBlinking) {
    // Natural eye blink in idle state
    ctx.strokeStyle = '#0F172A'
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(-2, eyeY)
    ctx.lineTo(2.2, eyeY)
    ctx.moveTo(5.3, eyeY)
    ctx.lineTo(9.5, eyeY)
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

    // Animated Eyebrows (Determined when running/dashing/attacking, raised when jumping)
    const browTilt =
      hero.animState === 'attacking' || hero.animState === 'dash' || hero.animState === 'run'
        ? 1.5
        : isJumping
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
  const frontHandY =
    -15 +
    breath +
    (hero.animState === 'attacking' || isCelebratory ? -8 : isJumping ? -5 : 0)
  ctx.strokeStyle = '#1E293B'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(7, -22 + breath)
  ctx.lineTo(13 - armSwing * 0.6, frontHandY)
  ctx.stroke()
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(13 - armSwing * 0.6, frontHandY, 4, 0, Math.PI * 2)
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
  if (reducedMotion) return
  const scrollX = cam.x * 1.18
  const theme = stage.theme

  if (theme === 'intercom_district' || theme === 'electricity_street') {
    // Gentle drifting leaves in residential / garden districts
    ctx.fillStyle = theme === 'intercom_district' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(245, 158, 11, 0.38)'
    for (let i = 0; i < 6; i++) {
      const lx = ((i * 185 - scrollX + elapsedSec * 18) % W + W) % W
      const ly = ((i * 89 + elapsedSec * 22) % (H - 80)) + 20
      ctx.save()
      ctx.translate(lx, ly)
      ctx.rotate(elapsedSec * 1.5 + i)
      ctx.beginPath()
      ctx.ellipse(0, 0, 4.5, 2.2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    return
  }

  ctx.fillStyle =
    theme === 'city_of_light'
      ? 'rgba(255, 255, 255, 0.3)'
      : theme === 'dark_city'
      ? 'rgba(34, 211, 238, 0.25)'
      : theme === 'darkness_fortress'
      ? 'rgba(249, 115, 22, 0.28)'
      : 'rgba(251, 191, 36, 0.2)'

  for (let i = 0; i < 6; i++) {
    const fx = ((i * 190 - scrollX + elapsedSec * 14) % W + W) % W
    const fy = 60 + ((i * 73) % (H - 120))
    ctx.beginPath()
    ctx.arc(fx, fy, 2, 0, Math.PI * 2)
    ctx.fill()
  }
}
