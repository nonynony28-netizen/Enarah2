import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  RotateCcw,
  Layers,
  Eye,
  Zap,
  Shield,
  CircleDot,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Compass
} from 'lucide-react'

// Component selection types
export type AnatomyComponentId = 'all' | 'conductor' | 'insulation' | 'cross_section'

interface WireAnatomy3DProps {
  isAr?: boolean
}

// Technical specifications for Italian FS17 / H07V-K wire
const SPECS = {
  conductor: {
    titleAr: 'القلب الموصل: نحاس أحمر نقي 100%',
    titleEn: 'Conductor Core: 100% Pure Red Copper',
    badgeAr: 'نحاس إلكتروليتي مرن - فئة 5',
    badgeEn: 'Flexible Electrolytic Copper - Class 5',
    standard: 'CEI EN 60228 / IEC 60228',
    detailsAr: [
      'شعيرات دقيقة مجدولة هندسياً من النحاس الإلكتروليتي عالي النقاوة تمنح السلك أقصى مرونة وسهولة أثناء السحب والتمرير داخل الأنابيب.',
      'مقاومة أومية فائقة الانخفاض تضمن كفاءة تدفق التيار وتحد من الفقد الحراري والجهد، مما يحمي المنشآت من مخاطر ارتفاع الحرارة.',
      'صلابة متوازنة تمنع التآكل والكسر الداخلي تحت الضغط الميكانيكي المستمر.'
    ],
    detailsEn: [
      'Multi-strand Class 5 flexible electrolytic copper construction for optimal cable pull and bend radius.',
      'Ultra-low ohmic resistance minimizing voltage drop and preventing heat buildup.',
      'High tensile fatigue resistance preventing internal wire fracture during conduits pull.'
    ]
  },
  insulation: {
    titleAr: 'طبقة العزل: مركب PVC إيطالي متطور',
    titleEn: 'Primary Insulation: Advanced Italian PVC Compound',
    badgeAr: 'عازل حراري ومثبط للهب',
    badgeEn: 'Thermal Insulating & Flame Retardant',
    standard: 'CEI EN 50525-2-31 / TI2 Compound',
    detailsAr: [
      'غلاف عازل مصنوع من مركب بولي كلوريد الفينيل (PVC Compound TI2) الإيطالي عالي المتانة بمقاومة كهربائية تفوق 750 فولت.',
      'خاصية التخميد الذاتي للهب ومقاومة انتشار الحرائق وفق معايير اللائحة الأوروبية لمنتجات البناء (CPR).',
      'مرونة استثنائية مع مقاومة فائقة للرطوبة، والزيوت الخفيفة، وتغير درجات الحرارة الجوية من -15°C إلى +70°C.'
    ],
    detailsEn: [
      'Formulated with Italian high-grade PVC compound TI2 rated for 450/750V applications.',
      'Self-extinguishing and flame-retardant performance compliant with European CPR regulations.',
      'High resistance to humidity, mechanical abrasion, and operating temperatures from -15°C to +70°C.'
    ]
  },
  cross_section: {
    titleAr: 'المقطع العرضي: هندسة التماسك الدائري',
    titleEn: 'Cross-Section Geometry: Compact Radial Packing',
    badgeAr: 'معايرة قياسية دقيقة',
    badgeEn: 'Calibrated Precision Tolerances',
    standard: 'CEI 20-22 / EN 50575',
    detailsAr: [
      'توزيع محكم متجانس للشعيرات النحاسية يلغي الجيوب والفجوات الهوائية الداخلية لضمان كثافة توصيل منتظمة.',
      'سُمك جدار العازل محكوم بدقة تصنيع ميكرومترية لضمان عزل متوازن على كامل محيط السلك بدون أي نقاط ضعف.',
      'قطع طرفي هندسي نظيف يسهل ربط الأسلاك في القواطع والأفياش بأمان تام.'
    ],
    detailsEn: [
      'Homogeneous strand bundle eliminates internal air pockets for uniform electrical density.',
      'Consistent circular jacket wall thickness eliminating dielectric weak spots.',
      'Clean terminal shear interface allowing secure terminal screw torque and contact.'
    ]
  }
}

export default function WireAnatomy3D({ isAr = true }: WireAnatomy3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // WebGL support state
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true)
  const [selectedComponent, setSelectedComponent] = useState<AnatomyComponentId>('conductor')
  const [exploded, setExploded] = useState<boolean>(false)
  const [explodedAmount, setExplodedAmount] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isRotating, setIsRotating] = useState<boolean>(true)

  // Three.js internal references
  const threeState = useRef<{
    scene: THREE.Scene | null
    camera: THREE.PerspectiveCamera | null
    renderer: THREE.WebGLRenderer | null
    controls: OrbitControls | null
    insulationMesh: THREE.Group | null
    copperGroup: THREE.Group | null
    cutFaceMesh: THREE.Mesh | null
    copperMaterial: THREE.MeshStandardMaterial | null
    insulationMaterial: THREE.MeshPhysicalMaterial | null
    raycaster: THREE.Raycaster | null
    mouse: THREE.Vector2 | null
    targetExploded: number
    currentExploded: number
    animationFrameId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    insulationMesh: null,
    copperGroup: null,
    cutFaceMesh: null,
    copperMaterial: null,
    insulationMaterial: null,
    raycaster: null,
    mouse: null,
    targetExploded: 0,
    currentExploded: 0,
    animationFrameId: null
  })

  // Check WebGL availability
  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        setWebGLSupported(false)
      }
    } catch {
      setWebGLSupported(false)
    }
  }, [])

  // Initialize Three.js scene
  useEffect(() => {
    if (!webGLSupported || !canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current
    const width = container.clientWidth || 640
    const height = container.clientHeight || 420

    // 1. Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#F8FAFC')
    scene.fog = new THREE.FogExp2('#F8FAFC', 0.035)

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    // Isometric 3/4 perspective view showing both the wire side and cut cross-section
    camera.position.set(4.8, 3.2, 5.8)

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.rotateSpeed = 0.8
    controls.enableZoom = true
    controls.minDistance = 3.5
    controls.maxDistance = 14
    controls.maxPolarAngle = Math.PI / 2 + 0.15 // Prevent going under ground plane
    controls.target.set(0, 0, 0)
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    }

    // 5. Lighting Setup (Photorealistic Studio Lighting)
    // Soft ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    // Key Light (Warm soft directional light)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2)
    keyLight.position.set(6, 8, 7)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    keyLight.shadow.bias = -0.001
    scene.add(keyLight)

    // Fill Light (Cool soft daylight fill)
    const fillLight = new THREE.DirectionalLight(0xdbebff, 1.4)
    fillLight.position.set(-7, 4, -4)
    scene.add(fillLight)

    // Rim / Specular Light (Highlights metallic copper ridges and PVC curvature)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8)
    rimLight.position.set(0, -4, -6)
    scene.add(rimLight)

    const topRimLight = new THREE.DirectionalLight(0xffffff, 1.2)
    topRimLight.position.set(-2, 7, -2)
    scene.add(topRimLight)

    // Contact Shadow Plane below cable
    const shadowGeo = new THREE.PlaneGeometry(14, 14)
    // Canvas texture for natural soft radial shadow
    const shadowCanvas = document.createElement('canvas')
    shadowCanvas.width = 256
    shadowCanvas.height = 256
    const shadowCtx = shadowCanvas.getContext('2d')
    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(128, 128, 20, 128, 128, 120)
      gradient.addColorStop(0, 'rgba(23, 35, 52, 0.28)')
      gradient.addColorStop(0.5, 'rgba(23, 35, 52, 0.10)')
      gradient.addColorStop(1, 'rgba(248, 250, 252, 0)')
      shadowCtx.fillStyle = gradient
      shadowCtx.fillRect(0, 0, 256, 256)
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas)
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    })
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
    shadowMesh.rotation.x = -Math.PI / 2
    shadowMesh.position.y = -1.2
    scene.add(shadowMesh)

    // 6. Materials
    // Realistic pure electrolytic copper material
    const copperMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d97438'),
      metalness: 0.94,
      roughness: 0.26,
      envMapIntensity: 1.2
    })

    // Italian certified PVC jacket material (Italian Blue)
    const insulationMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#005bbb'),
      metalness: 0.04,
      roughness: 0.38,
      clearcoat: 0.18,
      clearcoatRoughness: 0.12,
      reflectivity: 0.5
    })

    // 7. Cable Geometry Construction
    // Total cable model spans along the X-axis from x = -3.5 to x = +3.5
    const rootCableGroup = new THREE.Group()
    scene.add(rootCableGroup)

    // Conductor: 19 twisted Class 5 strands
    const copperGroup = new THREE.Group()
    copperGroup.name = 'conductor'
    rootCableGroup.add(copperGroup)

    const strandRadius = 0.062
    const totalLength = 6.4
    const xStart = -3.2
    const xEnd = 3.2

    // Strand arrangement (1 center + 6 inner ring + 12 outer ring = 19 strands)
    const strandConfigs: { r: number; count: number; twistRate: number }[] = [
      { r: 0, count: 1, twistRate: 0 },
      { r: 0.13, count: 6, twistRate: 0.24 },
      { r: 0.26, count: 12, twistRate: 0.24 }
    ]

    strandConfigs.forEach(({ r, count, twistRate }) => {
      for (let i = 0; i < count; i++) {
        const phi0 = (i / count) * Math.PI * 2
        const points: THREE.Vector3[] = []
        const segments = 48

        for (let s = 0; s <= segments; s++) {
          const t = s / segments
          const x = xStart + t * totalLength
          const angle = phi0 + twistRate * x
          const y = r * Math.cos(angle)
          const z = r * Math.sin(angle)
          points.push(new THREE.Vector3(x, y, z))
        }

        const curve = new THREE.CatmullRomCurve3(points)
        const strandGeo = new THREE.TubeGeometry(curve, 44, strandRadius, 8, false)
        const strandMesh = new THREE.Mesh(strandGeo, copperMaterial)
        strandMesh.castShadow = true
        strandMesh.receiveShadow = true
        copperGroup.add(strandMesh)
      }
    })

    // 8. PVC Insulation Jacket (Sleeve)
    // When assembled, PVC jacket covers from x = -3.2 to x = 0.6
    // The exposed copper conductor extends from x = 0.6 to x = 3.2
    const insulationGroup = new THREE.Group()
    insulationGroup.name = 'insulation'
    rootCableGroup.add(insulationGroup)

    const jacketOuterRadius = 0.46
    const jacketLength = 3.8
    const jacketGeo = new THREE.CylinderGeometry(
      jacketOuterRadius,
      jacketOuterRadius,
      jacketLength,
      48,
      1,
      true // open-ended cylinder
    )
    jacketGeo.rotateZ(Math.PI / 2)
    // Centered so its front cut face aligns exactly at x = 0.6
    jacketGeo.translate(-1.3, 0, 0)

    const jacketMesh = new THREE.Mesh(jacketGeo, insulationMaterial)
    jacketMesh.castShadow = true
    jacketMesh.receiveShadow = true
    insulationGroup.add(jacketMesh)

    // Cut face front rim (Ring geometry showing the insulation wall thickness at x = 0.6)
    const cutRimGeo = new THREE.RingGeometry(0.33, jacketOuterRadius, 48)
    cutRimGeo.rotateY(Math.PI / 2)
    cutRimGeo.translate(0.6, 0, 0)

    const cutRimMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00479b'),
      metalness: 0.05,
      roughness: 0.42,
      side: THREE.DoubleSide
    })
    const cutFaceMesh = new THREE.Mesh(cutRimGeo, cutRimMaterial)
    cutFaceMesh.name = 'cross_section'
    insulationGroup.add(cutFaceMesh)

    // Back closed end of jacket
    const backRimGeo = new THREE.RingGeometry(0.33, jacketOuterRadius, 48)
    backRimGeo.rotateY(-Math.PI / 2)
    backRimGeo.translate(-3.2, 0, 0)
    const backFaceMesh = new THREE.Mesh(backRimGeo, cutRimMaterial)
    insulationGroup.add(backFaceMesh)

    // Raycaster for interactive component clicking
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Store references
    threeState.current = {
      scene,
      camera,
      renderer,
      controls,
      insulationMesh: insulationGroup,
      copperGroup,
      cutFaceMesh,
      copperMaterial,
      insulationMaterial,
      raycaster,
      mouse,
      targetExploded: 0,
      currentExploded: 0,
      animationFrameId: null
    }

    // 9. Animation Loop
    let idleRotationAngle = 0
    const animate = () => {
      const state = threeState.current
      if (!state.renderer || !state.scene || !state.camera || !state.controls) return

      // Smoothly interpolate exploded offset
      state.currentExploded += (state.targetExploded - state.currentExploded) * 0.08
      if (state.insulationMesh) {
        // Slide insulation jacket backwards along X axis
        state.insulationMesh.position.x = -state.currentExploded * 2.8
      }

      // Gentle auto-rotation when user is not dragging
      if (isRotating && !controls.state) {
        idleRotationAngle += 0.003
        rootCableGroup.rotation.y = Math.sin(idleRotationAngle) * 0.18
        rootCableGroup.rotation.z = Math.cos(idleRotationAngle * 0.7) * 0.05
      }

      controls.update()
      renderer.render(scene, camera)
      state.animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 10. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !stateRef.current.renderer || !stateRef.current.camera) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      stateRef.current.camera.aspect = newWidth / newHeight
      stateRef.current.camera.updateProjectionMatrix()
      stateRef.current.renderer.setSize(newWidth, newHeight)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const stateRef = threeState
    return () => {
      resizeObserver.disconnect()
      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId)
      }
      controls.dispose()
      renderer.dispose()
      scene.clear()
    }
  }, [webGLSupported, isRotating])

  // Handle Raycasting Pointer Click
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const state = threeState.current
      if (!state.camera || !state.raycaster || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      state.mouse = state.mouse || new THREE.Vector2()
      state.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      state.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      state.raycaster.setFromCamera(state.mouse, state.camera)

      const interactables: THREE.Object3D[] = []
      if (state.copperGroup) interactables.push(state.copperGroup)
      if (state.insulationMesh) interactables.push(state.insulationMesh)

      const intersects = state.raycaster.intersectObjects(interactables, true)

      if (intersects.length > 0) {
        let hitObject: THREE.Object3D | null = intersects[0].object
        let detectedComponent: AnatomyComponentId = 'conductor'

        while (hitObject && hitObject.parent) {
          if (hitObject.name === 'cross_section') {
            detectedComponent = 'cross_section'
            break
          }
          if (hitObject.name === 'insulation') {
            detectedComponent = 'insulation'
            break
          }
          if (hitObject.name === 'conductor') {
            detectedComponent = 'conductor'
            break
          }
          hitObject = hitObject.parent
        }

        setSelectedComponent(detectedComponent)
      }
    },
    []
  )

  // Update exploded state in 3D scene
  useEffect(() => {
    threeState.current.targetExploded = exploded ? 1.0 : explodedAmount
  }, [exploded, explodedAmount])

  // Camera preset handlers
  const handleViewPreset = (preset: 'isometric' | 'cross_section' | 'copper' | 'reset') => {
    const controls = threeState.current.controls
    const camera = threeState.current.camera
    if (!controls || !camera) return

    if (preset === 'reset' || preset === 'isometric') {
      camera.position.set(4.8, 3.2, 5.8)
      controls.target.set(0, 0, 0)
      setSelectedComponent('all')
    } else if (preset === 'cross_section') {
      // Look straight onto the front cut end
      camera.position.set(6.5, 0.4, 0.2)
      controls.target.set(0.6, 0, 0)
      setSelectedComponent('cross_section')
    } else if (preset === 'copper') {
      // Zoom close to stripped copper strands
      camera.position.set(2.8, 1.4, 3.2)
      controls.target.set(1.6, 0, 0)
      setSelectedComponent('conductor')
    }
    controls.update()
  }

  // Active specs data
  const currentSpec =
    selectedComponent === 'conductor'
      ? SPECS.conductor
      : selectedComponent === 'insulation'
      ? SPECS.insulation
      : selectedComponent === 'cross_section'
      ? SPECS.cross_section
      : SPECS.conductor

  return (
    <section className="bg-white border border-[#E5EAF0] rounded-2xl overflow-hidden shadow-xs my-8 transition-all">
      {/* 01. Section Header */}
      <div className="px-6 py-6 sm:px-8 sm:py-7 border-b border-[#E5EAF0] bg-gradient-to-b from-white to-[#F8FAFC]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F6FD] border border-[#BFDBFE] text-xs font-semibold text-[#0062D2] mb-2.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{isAr ? 'الهندسة والتركيب الفيزيائي' : 'Physical Engineering & Assembly'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172334] tracking-tight">
              {isAr ? 'اكتشف مكونات السلك الإيطالي' : 'Explore Italian Cable Anatomy'}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl leading-relaxed">
              {isAr
                ? 'تعرّف على التركيب الداخلي للسلك وخصائص مكوناته من خلال تجربة تفاعلية واضحة وواقعية مبنية على المواصفات القياسية الأوروبية.'
                : 'Inspect the internal construction and physical properties through an accurate interactive 3D visualization.'}
            </p>
          </div>

          {/* Quick Exploded View Toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                setExploded(!exploded)
                if (!exploded) setExplodedAmount(1)
                else setExplodedAmount(0)
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] ${
                exploded
                  ? 'bg-[#0062D2] text-white border border-[#0062D2]'
                  : 'bg-white text-[#172334] border border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
              title={isAr ? 'فصل طبقة العزل لإظهار النحاس بالكامل' : 'Separate insulation to reveal full conductor'}
            >
              <Layers className="w-4 h-4 text-[#0062D2] shrink-0" />
              <span>
                {exploded
                  ? isAr
                    ? 'إعادة التجميع (تجميع)'
                    : 'Assemble Cable'
                  : isAr
                  ? 'تفكيك الطبقات (Exploded)'
                  : 'Exploded View'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 02. Interactive Visualizer + Technical Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#E5EAF0]">
        
        {/* Left Column (3D Interactive Canvas) */}
        <div className="lg:col-span-7 flex flex-col bg-[#F8FAFC] relative">
          
          {/* Top Canvas Toolbar */}
          <div className="p-3 sm:p-4 flex items-center justify-between border-b border-[#E5EAF0] bg-white/70 backdrop-blur-xs z-10">
            {/* Component Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedComponent('conductor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                  selectedComponent === 'conductor'
                    ? 'bg-[#0062D2] text-white shadow-xs'
                    : 'bg-white text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                }`}
              >
                {isAr ? 'النحاس الموصل' : 'Copper Core'}
              </button>

              <button
                onClick={() => setSelectedComponent('insulation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                  selectedComponent === 'insulation'
                    ? 'bg-[#0062D2] text-white shadow-xs'
                    : 'bg-white text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                }`}
              >
                {isAr ? 'عازل الـ PVC' : 'PVC Insulation'}
              </button>

              <button
                onClick={() => {
                  setSelectedComponent('cross_section')
                  handleViewPreset('cross_section')
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                  selectedComponent === 'cross_section'
                    ? 'bg-[#0062D2] text-white shadow-xs'
                    : 'bg-white text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                }`}
              >
                {isAr ? 'المقطع العرضي' : 'Cross-Section'}
              </button>
            </div>

            {/* Camera Angle Presets & Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
                  isRotating
                    ? 'bg-[#F0F7FF] text-[#0062D2] border-[#BFDBFE]'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                }`}
                title={isRotating ? (isAr ? 'إيقاف الدوران التلقائي' : 'Pause Auto-rotate') : (isAr ? 'تشغيل الدوران التلقائي' : 'Start Auto-rotate')}
                aria-label="Toggle auto rotation"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleViewPreset('reset')}
                className="p-1.5 rounded-lg text-xs bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-slate-50 transition-colors cursor-pointer"
                title={isAr ? 'إعادة ضبط المنظور' : 'Reset Camera View'}
                aria-label="Reset Camera"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3D Canvas / WebGL Fallback Container */}
          <div
            ref={containerRef}
            className={`w-full relative transition-all duration-300 ${
              isFullscreen ? 'fixed inset-0 z-50 bg-[#F8FAFC]' : 'h-[360px] sm:h-[430px]'
            }`}
          >
            {webGLSupported ? (
              <>
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
                  style={{ touchAction: 'none' }}
                />

                {/* Subtle Interactive Instruction Overlay */}
                <div className="absolute bottom-3 right-3 left-3 sm:left-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 border border-[#E5EAF0] shadow-xs text-[11px] text-[#64748B] pointer-events-none backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>
                    {isAr
                      ? 'اسحب للتدوير · قرّب للتكبير · اضغط على الطبقة لتحديدها'
                      : 'Drag to rotate · Pinch to zoom · Tap layers to inspect'}
                  </span>
                </div>
              </>
            ) : (
              /* Fallback 2D High-Fidelity Technical Visualization */
              <div className="w-full h-full flex items-center justify-center p-6 bg-white">
                <div className="max-w-md w-full text-center">
                  <svg viewBox="0 0 420 180" className="w-full h-auto mb-4">
                    <defs>
                      <linearGradient id="fallbackCopper" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#92400e" />
                      </linearGradient>
                      <linearGradient id="fallbackPVC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#0062D2" />
                        <stop offset="100%" stopColor="#1e40af" />
                      </linearGradient>
                    </defs>
                    {/* Exposed Pure Copper Strands */}
                    <rect x="30" y="65" width="360" height="50" rx="4" fill="url(#fallbackCopper)" />
                    {/* Cable Strands Texture lines */}
                    <line x1="30" y1="75" x2="390" y2="75" stroke="#fef3c7" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="30" y1="90" x2="390" y2="90" stroke="#78350f" strokeWidth="1.5" strokeOpacity="0.6" />
                    <line x1="30" y1="102" x2="390" y2="102" stroke="#fef3c7" strokeWidth="1" strokeOpacity="0.5" />

                    {/* PVC Insulation Sleeve */}
                    <rect
                      x={exploded ? '10' : '150'}
                      y="52"
                      width={exploded ? '140' : '240'}
                      height="76"
                      rx="6"
                      fill="url(#fallbackPVC)"
                      className="transition-all duration-500"
                    />

                    {/* Annotations */}
                    <circle cx="85" cy="90" r="3" fill="#ffffff" />
                    <text x="85" y="45" fill="#b45309" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {isAr ? 'نحاس نقي 100%' : '100% Pure Copper'}
                    </text>
                    <line x1="85" y1="50" x2="85" y2="85" stroke="#b45309" strokeWidth="1" strokeDasharray="2 2" />

                    <circle cx="270" cy="90" r="3" fill="#ffffff" />
                    <text x="270" y="35" fill="#0062D2" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {isAr ? 'عازل بولي كلوريد الفينيل (PVC)' : 'PVC Insulation TI2'}
                    </text>
                    <line x1="270" y1="40" x2="270" y2="85" stroke="#0062D2" strokeWidth="1" strokeDasharray="2 2" />
                  </svg>

                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B]">
                    {isAr
                      ? 'مخطط هندسي توضيحي (يعمل الجهاز بوضع التوافق الثنائي للأبعاد)'
                      : 'Technical 2D Schematic (Operating in Compatibility Mode)'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Slider for Continuous Layer Exploration */}
          <div className="px-5 py-3 border-t border-[#E5EAF0] bg-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#172334]">
                {isAr ? 'مستوى كشف الشعيرات:' : 'Strand Exposure Level:'}
              </span>
              <span className="text-xs text-[#0062D2] font-bold tabular-nums">
                {Math.round((exploded ? 1 : explodedAmount) * 100)}%
              </span>
            </div>

            <div className="flex-1 max-w-xs">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={exploded ? 1 : explodedAmount}
                onChange={(e) => {
                  setExploded(false)
                  setExplodedAmount(parseFloat(e.target.value))
                }}
                className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0062D2]"
                aria-label="Exploded slider"
              />
            </div>
          </div>
        </div>

        {/* Right Column (Technical Engineering Documentation) */}
        <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between bg-white text-right">
          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F0F6FD] border border-[#BFDBFE] text-xs font-semibold text-[#0062D2]">
                {selectedComponent === 'conductor' ? (
                  <Zap className="w-3.5 h-3.5 text-[#d97438]" />
                ) : selectedComponent === 'insulation' ? (
                  <Shield className="w-3.5 h-3.5 text-[#0062D2]" />
                ) : (
                  <CircleDot className="w-3.5 h-3.5 text-[#0062D2]" />
                )}
                <span>{isAr ? currentSpec.badgeAr : currentSpec.badgeEn}</span>
              </div>

              <span className="text-[11px] font-mono font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                {currentSpec.standard}
              </span>
            </div>

            {/* Component Title */}
            <h3 className="text-lg sm:text-xl font-bold text-[#172334] mb-3">
              {isAr ? currentSpec.titleAr : currentSpec.titleEn}
            </h3>

            {/* Bullet Points */}
            <div className="space-y-3 mt-4">
              {(isAr ? currentSpec.detailsAr : currentSpec.detailsEn).map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Italian Quality Guarantee Strip */}
          <div className="mt-8 pt-5 border-t border-[#E5EAF0]">
            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span className="font-semibold text-[#172334]">
                {isAr ? 'بلد المنشأ والاعتماد:' : 'Country of Origin:'}
              </span>
              <span className="font-medium text-[#0062D2]">
                {isAr ? 'إيطاليا 100% (Made in Italy)' : '100% Made in Italy'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#64748B] mt-2">
              <span className="font-semibold text-[#172334]">
                {isAr ? 'الجهد الاسمي المقنن:' : 'Rated Voltage:'}
              </span>
              <span className="font-mono font-medium text-[#172334]">450 / 750 V</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
