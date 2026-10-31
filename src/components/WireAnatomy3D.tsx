import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  RotateCcw,
  Layers,
  Zap,
  Shield,
  CircleDot,
  CheckCircle2,
  ScanLine,
  MousePointerClick
} from 'lucide-react'

export type LabStageId = 'exterior' | 'insulation' | 'copper' | 'cross_section'

interface WireAnatomy3DProps {
  isAr?: boolean
}

interface StageSpec {
  id: LabStageId
  labelAr: string
  labelEn: string
  stepNumber: string
  titleAr: string
  titleEn: string
  subtitleAr: string
  subtitleEn: string
  descriptionAr: string
  descriptionEn: string
  specsAr: { label: string; value: string }[]
  specsEn: { label: string; value: string }[]
  pointsAr: string[]
  pointsEn: string[]
}

const STAGE_DATA: Record<LabStageId, StageSpec> = {
  exterior: {
    id: 'exterior',
    labelAr: 'الشكل الخارجي',
    labelEn: 'Exterior Form',
    stepNumber: '01',
    titleAr: 'الشكل الخارجي — بنية السلك المتكاملة',
    titleEn: 'Exterior Profile — Integrated Wire Structure',
    subtitleAr: 'حماية ميكانيكية وانسيابية عالية أثناء التمديد',
    subtitleEn: 'Mechanical protection and smooth conduit pulling',
    descriptionAr:
      'يتميز السلك الإيطالي بتصميم أسطواني متجانس يجمع بين المتانة الخارجية والمرونة المدروسة، مما يضمن سهولة سحبه داخل الأنابيب الجدارية واللوحات الكهربائية دون التواء أو تضرر السطح.',
    descriptionEn:
      'Engineered with a uniform cylindrical profile combining outer durability with controlled flexibility for effortless installation through conduits and panels.',
    specsAr: [
      { label: 'التصميم الهندسي', value: 'أحادي القلب (مفرد)' },
      { label: 'التعبئة القياسية', value: 'لفة 100 متر' },
      { label: 'سطح الغلاف', value: 'أملس مقاوم للاحتكاك' }
    ],
    specsEn: [
      { label: 'Configuration', value: 'Single Core' },
      { label: 'Standard Roll', value: '100m Factory Coil' },
      { label: 'Surface Finish', value: 'Low-Friction Smooth PVC' }
    ],
    pointsAr: [
      'قطر خارجي متناسق على طول اللفة يضمن التطابق مع المرابط والقواطع القياسية.',
      'مقاومة عالية للاحتكاك الميكانيكي أثناء السحب في المسارات الطويلة والمنحنية.',
      'ثبات لوني ومقاومة للعوامل البيئية والرطوبة داخل المباني والمنشآت.'
    ],
    pointsEn: [
      'Consistent outer diameter ensuring precise fit with standard terminals and breakers.',
      'High abrasion resistance during pulls through long or curved conduit runs.',
      'Long-term stability against indoor humidity and environmental aging.'
    ]
  },
  insulation: {
    id: 'insulation',
    labelAr: 'طبقة العزل',
    labelEn: 'Insulation Layer',
    stepNumber: '02',
    titleAr: 'طبقة العزل — حماية كهربائية وحرارية متوازنة',
    titleEn: 'Insulation Layer — Balanced Dielectric & Thermal Shield',
    subtitleAr: 'غلاف عازل بسُمك متجانس يحيط بالموصل النحاسي',
    subtitleEn: 'Uniform concentric insulation jacket surrounding the conductor',
    descriptionAr:
      'تعمل طبقة العزل المصنوعة من مركبات البوليمر (PVC) على عزل التيار الكهربائي بأمان، مع الحفاظ على سُمك جداري متساوٍ حول القلب النحاسي لمنع نقاط الضعف الكهربائية أو التسرب.',
    descriptionEn:
      'The specialized PVC polymer jacket isolates electrical current safely while maintaining uniform concentric wall thickness around the copper core.',
    specsAr: [
      { label: 'مادة العزل', value: 'مركب PVC عالي الجودة' },
      { label: 'توزيع السُمك', value: 'متمركز متساوي المحيط' },
      { label: 'الوظيفة الأساسية', value: 'عزل كهربائي وحماية حرارية' }
    ],
    specsEn: [
      { label: 'Insulation Material', value: 'High-Grade PVC Compound' },
      { label: 'Wall Geometry', value: 'Concentric Uniform Thickness' },
      { label: 'Primary Role', value: 'Dielectric & Thermal Isolation' }
    ],
    pointsAr: [
      'سُمك عازل متوازن يحافظ على سلامة التمديدات عند التشغيل المستمر.',
      'قابلية تقشير نظيفة عند الأطراف تسهل عمل الفنيين دون خدش الشعيرات النحاسية.',
      'مرونة مدروسة تمنع تشقق الغلاف عند ثني السلك داخل علب التوزيع.'
    ],
    pointsEn: [
      'Balanced wall thickness safeguarding installations under continuous operation.',
      'Clean stripping characteristics allowing terminal prep without nicking copper strands.',
      'Controlled elasticity preventing jacket cracking at tight junction box bends.'
    ]
  },
  copper: {
    id: 'copper',
    labelAr: 'القلب النحاسي',
    labelEn: 'Copper Core',
    stepNumber: '03',
    titleAr: 'القلب النحاسي — شعيرات نحاسية مجدولة بعناية',
    titleEn: 'Copper Core — Precision-Stranded Copper Conductor',
    subtitleAr: 'كفاءة توصيل كهربائي ومرونة ميكانيكية متقدمة',
    subtitleEn: 'Reliable electrical conductivity and mechanical flexibility',
    descriptionAr:
      'يتكون الموصل الداخلي من مجموعة شعيرات نحاسية مجدولة بشكل حلزوني متقن، مما يمنح السلك مرونة عالية مقارنة بالأسلاك الصلبة، مع تأمين مسار مستقر ومتصل للتيار الكهربائي.',
    descriptionEn:
      'Composed of helically twisted copper strands that provide superior flexibility while ensuring a stable, continuous path for electrical current.',
    specsAr: [
      { label: 'مادة الموصل', value: 'نحاس أحمر موصل' },
      { label: 'بنية القلب', value: 'شعيرات مجدولة متداخلة' },
      { label: 'الأداء التشغيلي', value: 'موصلية مستقرة وفقد منخفض' }
    ],
    specsEn: [
      { label: 'Conductor Material', value: 'Conductive Red Copper' },
      { label: 'Core Structure', value: 'Helically Stranded Bundle' },
      { label: 'Performance', value: 'Stable Conductivity' }
    ],
    pointsAr: [
      'جدل حلزوني متماسك يحافظ على تماسك الشعيرات عند القص والربط في المرابط.',
      'توصيل كهربائي مستقر يقلل من السخونة الناتجة عن المقاومة أثناء تحميل الدوائر.',
      'ليونة ميكانيكية ممتازة تقلل من إجهاد المعدن وتمنع الكسر الداخلي.'
    ],
    pointsEn: [
      'Cohesive helical lay keeps strands bundled cleanly during cutting and termination.',
      'Consistent electrical conductivity reducing resistive heat under load.',
      'Mechanical suppleness minimizing metal fatigue and internal strand breakage.'
    ]
  },
  cross_section: {
    id: 'cross_section',
    labelAr: 'المقطع الداخلي',
    labelEn: 'Cross-Section',
    stepNumber: '04',
    titleAr: 'المقطع الداخلي — هندسة التمركز والتماسك الدائري',
    titleEn: 'Internal Cross-Section — Concentric Packing Geometry',
    subtitleAr: 'فحص دقيق للحدود الفاصلة بين الموصل النحاسي وطبقة العزل',
    subtitleEn: 'Detailed inspection of conductor-to-insulation boundary',
    descriptionAr:
      'يُظهر المقطع العرضي للسلك دقة تمركز القلب النحاسي في منتصف الغلاف العازل تماماً، مع تراص الشعيرات النحاسية بتوزيع دائري منتظم يقلل الفراغات البينية ويعزز كفاءة التوصيل.',
    descriptionEn:
      'The cross-sectional view reveals the exact concentric centering of the copper bundle within the insulation ring, minimizing air voids.',
    specsAr: [
      { label: 'التمركز الهندسي', value: 'محوري متطابق' },
      { label: 'تراص الشعيرات', value: 'توزيع دائري متعدد الطبقات' },
      { label: 'حدود الفصل', value: 'حافة عزل منتظمة محكمة' }
    ],
    specsEn: [
      { label: 'Concentricity', value: 'Precision Axial Alignment' },
      { label: 'Strand Packing', value: 'Multi-Ring Circular Array' },
      { label: 'Interface Boundary', value: 'Tight Dielectric Seal' }
    ],
    pointsAr: [
      'تراص هندسي للشعيرات (طبقة مركزية محاطة بحلقات متداخلة) لضمان مساحة مقطع فعالة.',
      'إحكام الغلاف العازل حول الشعيرات الخارجية دون ترك جيوب هوائية غير مرغوبة.',
      'انتظام سُمك الجدار العازل في كافة الاتجاهات حول المحور المركزي.'
    ],
    pointsEn: [
      'Geometric strand packing (central core surrounded by concentric rings) for effective cross-sectional area.',
      'Snug insulation fit around outer strands eliminating unwanted air pockets.',
      'Uniform insulation wall thickness across all radial directions.'
    ]
  }
}

export default function WireAnatomy3D({ isAr = true }: WireAnatomy3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [webGLSupported, setWebGLSupported] = useState<boolean>(true)
  const [activeStage, setActiveStage] = useState<LabStageId>('exterior')
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)

  // Three.js scene state ref
  const threeState = useRef<{
    scene: THREE.Scene | null
    camera: THREE.PerspectiveCamera | null
    renderer: THREE.WebGLRenderer | null
    controls: OrbitControls | null
    insulationGroup: THREE.Group | null
    copperGroup: THREE.Group | null
    cutFaceMesh: THREE.Mesh | null
    copperMat: THREE.MeshStandardMaterial | null
    copperCapMat: THREE.MeshStandardMaterial | null
    insulationMat: THREE.MeshPhysicalMaterial | null
    cutRimMat: THREE.MeshStandardMaterial | null
    raycaster: THREE.Raycaster | null
    mouse: THREE.Vector2 | null
    targetInsulationX: number
    currentInsulationX: number
    targetCamPos: THREE.Vector3
    targetLookAt: THREE.Vector3
    isCameraAnimating: boolean
    animationFrameId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    insulationGroup: null,
    copperGroup: null,
    cutFaceMesh: null,
    copperMat: null,
    copperCapMat: null,
    insulationMat: null,
    cutRimMat: null,
    raycaster: null,
    mouse: null,
    targetInsulationX: 1.45, // Stage 1 default: covers most of the wire
    currentInsulationX: 1.45,
    targetCamPos: new THREE.Vector3(4.5, 2.3, 5.1),
    targetLookAt: new THREE.Vector3(0.2, 0, 0),
    isCameraAnimating: true,
    animationFrameId: null
  })

  // Detect WebGL support
  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas')
      const gl =
        testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) setWebGLSupported(false)
    } catch {
      setWebGLSupported(false)
    }
  }, [])

  // Build procedural studio lighting environment texture for realistic PBR metallic & polymer response
  const createStudioEnvironment = (renderer: THREE.WebGLRenderer) => {
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()

    const envScene = new THREE.Scene()
    envScene.background = new THREE.Color('#0c1e33')

    // Large soft overhead key softbox
    const topLightGeo = new THREE.PlaneGeometry(18, 18)
    const topLightMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff9f2') })
    const topLight = new THREE.Mesh(topLightGeo, topLightMat)
    topLight.position.set(3, 9, 4)
    topLight.lookAt(0, 0, 0)
    envScene.add(topLight)

    // Side warm-neutral reflection strip for realistic copper highlights
    const sideStripGeo = new THREE.PlaneGeometry(20, 5)
    const sideStripMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffeedd') })
    const sideStrip = new THREE.Mesh(sideStripGeo, sideStripMat)
    sideStrip.position.set(6, 2, 8)
    sideStrip.lookAt(0, 0, 0)
    envScene.add(sideStrip)

    // Cool fill reflection panel on opposite side
    const fillStripGeo = new THREE.PlaneGeometry(16, 8)
    const fillStripMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#7aa7d9') })
    const fillStrip = new THREE.Mesh(fillStripGeo, fillStripMat)
    fillStrip.position.set(-7, 3, -6)
    fillStrip.lookAt(0, 0, 0)
    envScene.add(fillStrip)

    // Subtle rim reflection
    const rimStripGeo = new THREE.PlaneGeometry(14, 4)
    const rimStripMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#e2eefc') })
    const rimStrip = new THREE.Mesh(rimStripGeo, rimStripMat)
    rimStrip.position.set(0, -5, -7)
    rimStrip.lookAt(0, 0, 0)
    envScene.add(rimStrip)

    const envMap = pmremGenerator.fromScene(envScene, 0.04).texture
    pmremGenerator.dispose()
    return envMap
  }

  // Initialize Three.js Laboratory Scene
  useEffect(() => {
    if (!webGLSupported || !canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current
    const width = container.clientWidth || 680
    const height = container.clientHeight || 460

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 1. Scene with refined laboratory dark studio backdrop
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0B1E33')

    // 2. Camera (Starts slightly further out for a short, composed introductory glide)
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100)
    if (prefersReducedMotion) {
      camera.position.set(4.5, 2.3, 5.1)
    } else {
      camera.position.set(5.3, 2.8, 6.0)
    }

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
    renderer.toneMappingExposure = 1.08
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Studio Environment Map for authentic metallic copper & polymer reflections
    const envMap = createStudioEnvironment(renderer)
    scene.environment = envMap

    // 4. OrbitControls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.rotateSpeed = 0.75
    controls.enableZoom = true
    controls.enablePan = false
    controls.minDistance = 2.6
    controls.maxDistance = 10.5
    controls.maxPolarAngle = Math.PI / 2 + 0.25
    controls.minPolarAngle = 0.2
    controls.target.set(0.2, 0, 0)
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    }

    // Stop automatic camera transition if user manually grabs the model
    const onControlStart = () => {
      threeState.current.isCameraAnimating = false
      setHasInteracted(true)
    }
    controls.addEventListener('start', onControlStart)

    // 5. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.45)
    scene.add(ambientLight)

    // Large soft key light
    const keyLight = new THREE.DirectionalLight(0xfff6ed, 2.0)
    keyLight.position.set(5, 7, 6)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    keyLight.shadow.bias = -0.0005
    scene.add(keyLight)

    // Controlled fill light
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.9)
    fillLight.position.set(-6, 3, -5)
    scene.add(fillLight)

    // Subtle rim light to define cable contour against dark navy
    const rimLight = new THREE.DirectionalLight(0xe0f2fe, 1.35)
    rimLight.position.set(-1, 5, -6)
    scene.add(rimLight)

    // Soft studio floor / contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(14, 14)
    const shadowCanvas = document.createElement('canvas')
    shadowCanvas.width = 256
    shadowCanvas.height = 256
    const shadowCtx = shadowCanvas.getContext('2d')
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 12, 128, 128, 118)
      grad.addColorStop(0, 'rgba(3, 10, 20, 0.65)')
      grad.addColorStop(0.5, 'rgba(3, 10, 20, 0.25)')
      grad.addColorStop(1, 'rgba(11, 30, 51, 0)')
      shadowCtx.fillStyle = grad
      shadowCtx.fillRect(0, 0, 256, 256)
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas)
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    })
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat)
    shadowPlane.rotation.x = -Math.PI / 2
    shadowPlane.position.y = -0.95
    scene.add(shadowPlane)

    // 6. Physically Based Materials (PBR)
    // Authentic Industrial Drawn Copper (No neon glow, realistic metallic reflectance)
    const copperMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c86d42'),
      metalness: 0.92,
      roughness: 0.24,
      envMapIntensity: 1.35
    })

    // Freshly sheared copper end-cap face at the cross-section
    const copperCapMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d98254'),
      metalness: 0.88,
      roughness: 0.18,
      envMapIntensity: 1.45
    })

    // Realistic Non-Metallic PVC Polymer Jacket (Satin industrial blue)
    const insulationMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1d63b8'),
      metalness: 0.02,
      roughness: 0.36,
      clearcoat: 0.14,
      clearcoatRoughness: 0.28,
      reflectivity: 0.45,
      envMapIntensity: 0.9
    })

    // Inner & Cut-edge PVC Cross-Section Material
    const cutRimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#154c91'),
      metalness: 0.02,
      roughness: 0.48,
      side: THREE.DoubleSide
    })

    // 7. Cable Model Geometry
    const rootCableGroup = new THREE.Group()
    scene.add(rootCableGroup)

    // 7A. Stranded Copper Conductor Core (19 Helical Strands: 1 + 6 + 12)
    const copperGroup = new THREE.Group()
    copperGroup.name = 'copper'
    rootCableGroup.add(copperGroup)

    const strandRadius = 0.064
    const totalLength = 6.0
    const xStart = -3.0
    const xEnd = 3.0

    const strandRings: { r: number; count: number; twist: number }[] = [
      { r: 0, count: 1, twist: 0 },
      { r: 0.134, count: 6, twist: 0.26 },
      { r: 0.268, count: 12, twist: 0.26 }
    ]

    const capGeo = new THREE.CircleGeometry(strandRadius * 0.98, 16)
    capGeo.rotateY(Math.PI / 2)

    strandRings.forEach(({ r, count, twist }) => {
      for (let i = 0; i < count; i++) {
        const phi0 = (i / count) * Math.PI * 2
        const pts: THREE.Vector3[] = []
        const segs = 48

        for (let s = 0; s <= segs; s++) {
          const t = s / segs
          const x = xStart + t * totalLength
          const angle = phi0 + twist * x
          const y = r * Math.cos(angle)
          const z = r * Math.sin(angle)
          pts.push(new THREE.Vector3(x, y, z))
        }

        const curve = new THREE.CatmullRomCurve3(pts)
        const tubeGeo = new THREE.TubeGeometry(curve, 44, strandRadius, 12, false)
        const strandMesh = new THREE.Mesh(tubeGeo, copperMat)
        strandMesh.castShadow = true
        strandMesh.receiveShadow = true
        copperGroup.add(strandMesh)

        // Add flat sheared copper end-cap at xEnd (front tip)
        const endAngle = phi0 + twist * xEnd
        const endCap = new THREE.Mesh(capGeo, copperCapMat)
        endCap.position.set(xEnd, r * Math.cos(endAngle), r * Math.sin(endAngle))
        copperGroup.add(endCap)
      }
    })

    // 7B. PVC Insulation Jacket (Thick-walled hollow cylinder with beveled cut face)
    const insulationGroup = new THREE.Group()
    insulationGroup.name = 'insulation'
    // In local group coordinates, the front cut face is at x = 0, extending back to x = -4.6
    const jacketOuterR = 0.47
    const jacketInnerR = 0.34
    const jacketLen = 4.6

    // Lathe profile for a realistic thick PVC sleeve with subtle chamfered cut edge
    const lathePoints = [
      new THREE.Vector2(jacketInnerR, -jacketLen),
      new THREE.Vector2(jacketOuterR, -jacketLen),
      new THREE.Vector2(jacketOuterR, -0.04),
      new THREE.Vector2(jacketOuterR - 0.015, 0),
      new THREE.Vector2(jacketInnerR + 0.01, 0),
      new THREE.Vector2(jacketInnerR, -0.02),
      new THREE.Vector2(jacketInnerR, -jacketLen)
    ]
    const jacketLatheGeo = new THREE.LatheGeometry(lathePoints, 64)
    jacketLatheGeo.rotateZ(-Math.PI / 2) // Orient along X axis so front face is at x = 0

    const jacketMesh = new THREE.Mesh(jacketLatheGeo, insulationMat)
    jacketMesh.castShadow = true
    jacketMesh.receiveShadow = true
    insulationGroup.add(jacketMesh)

    // Distinct Annular Cut Face Ring at x = 0.002 for crisp cross-section inspection
    const cutRingGeo = new THREE.RingGeometry(jacketInnerR, jacketOuterR - 0.012, 64)
    cutRingGeo.rotateY(Math.PI / 2)
    cutRingGeo.translate(0.002, 0, 0)
    const cutFaceMesh = new THREE.Mesh(cutRingGeo, cutRimMat)
    cutFaceMesh.name = 'cross_section'
    insulationGroup.add(cutFaceMesh)

    // Position insulation initially at Stage 1 (Exterior: covers up to x = 1.45)
    insulationGroup.position.x = 1.45
    rootCableGroup.add(insulationGroup)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    threeState.current = {
      scene,
      camera,
      renderer,
      controls,
      insulationGroup,
      copperGroup,
      cutFaceMesh,
      copperMat,
      copperCapMat,
      insulationMat,
      cutRimMat,
      raycaster,
      mouse,
      targetInsulationX: 1.45,
      currentInsulationX: 1.45,
      targetCamPos: new THREE.Vector3(4.5, 2.3, 5.1),
      targetLookAt: new THREE.Vector3(0.2, 0, 0),
      isCameraAnimating: !prefersReducedMotion,
      animationFrameId: null
    }

    // 8. Controlled Render Loop (NO continuous spinning)
    const animate = () => {
      const st = threeState.current
      if (!st.renderer || !st.scene || !st.camera || !st.controls) return

      // Smoothly interpolate insulation cutaway position
      const diffX = st.targetInsulationX - st.currentInsulationX
      if (Math.abs(diffX) > 0.001) {
        st.currentInsulationX += diffX * 0.085
        if (st.insulationGroup) {
          st.insulationGroup.position.x = st.currentInsulationX
        }
      }

      // Smooth camera transition when switching stages
      if (st.isCameraAnimating) {
        st.camera.position.lerp(st.targetCamPos, 0.075)
        st.controls.target.lerp(st.targetLookAt, 0.075)

        if (
          st.camera.position.distanceTo(st.targetCamPos) < 0.02 &&
          st.controls.target.distanceTo(st.targetLookAt) < 0.02
        ) {
          st.isCameraAnimating = false
        }
      }

      st.controls.update()
      st.renderer.render(st.scene, st.camera)
      st.animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 9. Responsive Resize Observer
    const handleResize = () => {
      const st = threeState.current
      if (!container || !st.renderer || !st.camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      st.camera.aspect = w / h
      st.camera.updateProjectionMatrix()
      st.renderer.setSize(w, h)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      controls.removeEventListener('start', onControlStart)
      if (threeState.current.animationFrameId) {
        cancelAnimationFrame(threeState.current.animationFrameId)
      }
      envMap.dispose()
      controls.dispose()
      renderer.dispose()
      scene.clear()
    }
  }, [webGLSupported])

  // Stage transition handler: updates camera, insulation reveal, and subtle material emphasis
  const selectStage = useCallback((stage: LabStageId) => {
    setActiveStage(stage)
    setHasInteracted(true)

    const st = threeState.current
    if (!st.camera || !st.controls) return

    // Reset material emissive states first
    if (st.copperMat) st.copperMat.emissive.setHex(0x000000)
    if (st.insulationMat) st.insulationMat.emissive.setHex(0x000000)
    if (st.cutRimMat) st.cutRimMat.emissive.setHex(0x000000)

    if (stage === 'exterior') {
      // Stage 1: Complete wire view with minimal tip exposed
      st.targetInsulationX = 1.65
      st.targetCamPos.set(4.5, 2.3, 5.1)
      st.targetLookAt.set(0.2, 0, 0)
      if (st.insulationMat) st.insulationMat.emissive.setHex(0x04152d)
    } else if (stage === 'insulation') {
      // Stage 2: Controlled cutaway revealing insulation structure & wall
      st.targetInsulationX = 0.25
      st.targetCamPos.set(3.6, 1.9, 4.3)
      st.targetLookAt.set(0.0, 0, 0)
      if (st.insulationMat) st.insulationMat.emissive.setHex(0x072247)
      if (st.cutRimMat) st.cutRimMat.emissive.setHex(0x0c356e)
    } else if (stage === 'copper') {
      // Stage 3: Retract insulation and move camera closer to the stranded copper core
      st.targetInsulationX = -1.15
      st.targetCamPos.set(2.5, 1.25, 3.0)
      st.targetLookAt.set(0.95, 0, 0)
      if (st.copperMat) st.copperMat.emissive.setHex(0x1f0c02)
    } else if (stage === 'cross_section') {
      // Interactive Cross-Section: Move camera toward wire end to inspect concentric geometry
      st.targetInsulationX = 0.85
      st.targetCamPos.set(5.1, 0.55, 1.35)
      st.targetLookAt.set(1.2, 0, 0)
      if (st.cutRimMat) st.cutRimMat.emissive.setHex(0x0e3b7a)
    }

    st.isCameraAnimating = true
  }, [])

  // Reset View handler (إعادة العرض)
  const handleResetView = useCallback(() => {
    selectStage('exterior')
  }, [selectStage])

  // Raycast click on 3D cable parts
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const st = threeState.current
      if (!st.camera || !st.raycaster || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      st.mouse = st.mouse || new THREE.Vector2()
      st.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      st.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      st.raycaster.setFromCamera(st.mouse, st.camera)

      const targets: THREE.Object3D[] = []
      if (st.copperGroup) targets.push(st.copperGroup)
      if (st.insulationGroup) targets.push(st.insulationGroup)

      const hits = st.raycaster.intersectObjects(targets, true)
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object
        while (obj) {
          if (obj.name === 'cross_section') {
            selectStage('cross_section')
            return
          }
          if (obj.name === 'insulation') {
            selectStage(activeStage === 'insulation' ? 'exterior' : 'insulation')
            return
          }
          if (obj.name === 'copper') {
            selectStage('copper')
            return
          }
          obj = obj.parent
        }
      }
    },
    [activeStage, selectStage]
  )

  const currentStage = STAGE_DATA[activeStage]

  return (
    <section
      aria-labelledby="cable-lab-heading"
      className="bg-[#081D35] text-white py-14 sm:py-20 border-y border-[#173B5E]/60 no-print"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        
        {/* ===================================================================== */}
        {/* LABORATORY HEADER */}
        {/* ===================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#102A43] border border-[#173B5E] text-[13px] font-medium text-[#7CC4FA] mb-3">
              <Layers className="w-3.5 h-3.5 text-[#3974C8]" />
              <span>
                {isAr ? 'مختبر الفحص الهندسي التفاعلي' : 'Interactive Engineering Laboratory'}
              </span>
            </div>
            <h2
              id="cable-lab-heading"
              className="text-2xl sm:text-[28px] font-bold text-white leading-snug"
            >
              {isAr ? 'اكتشف ما بداخل السلك' : 'Discover Inside the Wire'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              {isAr
                ? 'تجربة تفاعلية تتيح لك استكشاف مكونات السلك الإيطالي والتعرف على تفاصيل تركيبه الداخلي.'
                : 'An interactive experience allowing you to explore the components of the Italian wire and inspect its internal construction.'}
            </p>
          </div>

          {/* Dedicated Cross-Section & Reset Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              type="button"
              onClick={() =>
                selectStage(activeStage === 'cross_section' ? 'exterior' : 'cross_section')
              }
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 cursor-pointer ${
                activeStage === 'cross_section'
                  ? 'bg-[#3974C8] text-white border border-[#5A96E8] shadow-sm'
                  : 'bg-[#102A43] text-slate-100 border border-[#173B5E] hover:bg-[#173B5E]'
              }`}
            >
              <ScanLine className="w-4 h-4 text-[#7CC4FA]" />
              <span>
                {isAr ? 'استكشف المقطع الداخلي' : 'Explore Internal Cross-Section'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleResetView}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[13px] font-medium bg-[#102A43]/80 text-slate-300 border border-[#173B5E] hover:text-white hover:bg-[#173B5E] transition-colors cursor-pointer"
              title={isAr ? 'إعادة العرض للوضع الافتراضي' : 'Reset View'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة العرض' : 'Reset View'}</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MAIN LABORATORY SPLIT-SCREEN CONTAINER */}
        {/* ===================================================================== */}
        <div className="rounded-xl bg-[#102A43] border border-[#173B5E] overflow-hidden shadow-lg">
          
          {/* Stage Navigation Bar (Three Primary Stages + Cross Section) */}
          <div className="px-4 sm:px-6 py-3.5 bg-[#0B2138] border-b border-[#173B5E] flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0" role="tablist">
              {(
                [
                  { id: 'exterior', labelAr: 'الشكل الخارجي', labelEn: 'Exterior', num: '01' },
                  { id: 'insulation', labelAr: 'طبقة العزل', labelEn: 'Insulation Layer', num: '02' },
                  { id: 'copper', labelAr: 'القلب النحاسي', labelEn: 'Copper Core', num: '03' }
                ] as const
              ).map((tab) => {
                const isActive = activeStage === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectStage(tab.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#3974C8] text-white shadow-xs'
                        : 'bg-[#102A43] text-slate-300 hover:text-white hover:bg-[#173B5E]/70 border border-[#173B5E]'
                    }`}
                  >
                    <span
                      className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#081D35] text-slate-400'
                      }`}
                    >
                      {tab.num}
                    </span>
                    <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  </button>
                )
              })}
            </div>

            {/* Interaction Prompt Status */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 shrink-0">
              <MousePointerClick className="w-3.5 h-3.5 text-[#7CC4FA]" />
              <span>
                {isAr ? 'اضغط لاستكشاف مكونات السلك' : 'Click to explore wire components'}
              </span>
            </div>
          </div>

          {/* Split Composition: 3D Viewport (7 Cols) + Technical Info (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#173B5E]">
            
            {/* 3D VIEWER AREA */}
            <div className="lg:col-span-7 flex flex-col bg-[#0B1E33] relative">
              <div
                ref={containerRef}
                className="w-full h-[340px] sm:h-[430px] lg:h-[470px] relative select-none"
              >
                {webGLSupported ? (
                  <>
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
                      aria-label={
                        isAr
                          ? 'مجسم ثلاثي الأبعاد للسلك الإيطالي'
                          : 'Interactive 3D model of Italian copper wire'
                      }
                    />

                    {/* Engineering Cross-Section Callouts Overlay (Visible in Cross-Section Mode) */}
                    {activeStage === 'cross_section' && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="bg-[#081D35]/90 border border-[#3974C8]/60 rounded-lg px-3 py-2 backdrop-blur-xs">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#7CC4FA]">
                              <span className="w-2 h-2 rounded-full bg-[#3974C8]" />
                              <span>
                                {isAr
                                  ? 'الحد الخارجي: غلاف العزل PVC'
                                  : 'Outer Boundary: PVC Insulation Wall'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-0.5">
                              {isAr
                                ? 'سُمك جداري متجانس يحيط بالموصل بالكامل'
                                : 'Uniform concentric wall thickness'}
                            </p>
                          </div>

                          <div className="bg-[#081D35]/90 border border-[#d98254]/60 rounded-lg px-3 py-2 backdrop-blur-xs">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#f3a678]">
                              <span className="w-2 h-2 rounded-full bg-[#d98254]" />
                              <span>
                                {isAr
                                  ? 'المركز: شعيرات النحاس المجدولة'
                                  : 'Core: Stranded Copper Bundle'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-0.5">
                              {isAr
                                ? 'تراص دائري محكم لتقليل الفراغات البينية'
                                : 'Compact circular strand packing'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom Viewport Instruction Bar */}
                    <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-[#081D35]/85 border border-[#173B5E] text-xs text-slate-300 pointer-events-none backdrop-blur-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#3974C8] shrink-0" />
                        <span>
                          {!hasInteracted
                            ? isAr
                              ? 'اضغط لاستكشاف مكونات السلك أو اسحب لتدوير المجسم'
                              : 'Click to explore wire components or drag to rotate'
                            : isAr
                            ? 'اسحب للتدوير الحر · اضغط على أجزاء السلك للفحص'
                            : 'Drag to orbit · Click cable layers to inspect'}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#7CC4FA] hidden sm:inline">
                        {isAr ? currentStage.labelAr : currentStage.labelEn}
                      </span>
                    </div>
                  </>
                ) : (
                  /* Accessible Technical SVG Fallback when WebGL is unavailable */
                  <div className="w-full h-full flex items-center justify-center p-6 bg-[#0B1E33]">
                    <div className="max-w-md w-full text-center">
                      <svg viewBox="0 0 440 180" className="w-full h-auto mb-4">
                        <defs>
                          <linearGradient id="copperGradV4" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#e08b5c" />
                            <stop offset="50%" stopColor="#c86d42" />
                            <stop offset="100%" stopColor="#8c4220" />
                          </linearGradient>
                          <linearGradient id="pvcGradV4" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2b7de0" />
                            <stop offset="50%" stopColor="#1d63b8" />
                            <stop offset="100%" stopColor="#123f7a" />
                          </linearGradient>
                        </defs>
                        {/* Copper Strands */}
                        <rect
                          x="40"
                          y="66"
                          width="360"
                          height="48"
                          rx="4"
                          fill="url(#copperGradV4)"
                        />
                        <line
                          x1="40"
                          y1="78"
                          x2="400"
                          y2="78"
                          stroke="#f8d3b8"
                          strokeWidth="1"
                          strokeOpacity="0.45"
                        />
                        <line
                          x1="40"
                          y1="90"
                          x2="400"
                          y2="90"
                          stroke="#5c2810"
                          strokeWidth="1.5"
                          strokeOpacity="0.55"
                        />
                        <line
                          x1="40"
                          y1="102"
                          x2="400"
                          y2="102"
                          stroke="#f8d3b8"
                          strokeWidth="1"
                          strokeOpacity="0.45"
                        />
                        {/* PVC Jacket */}
                        <rect
                          x="40"
                          y="52"
                          width={
                            activeStage === 'exterior'
                              ? '310'
                              : activeStage === 'insulation'
                              ? '220'
                              : '130'
                          }
                          height="76"
                          rx="6"
                          fill="url(#pvcGradV4)"
                        />
                      </svg>
                      <p className="text-xs text-slate-300">
                        {isAr
                          ? 'مخطط هندسي توضيحي لمكونات السلك الإيطالي'
                          : 'Technical schematic of the Italian copper wire'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TECHNICAL INFORMATION & STAGE EXPLANATION AREA */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#102A43] text-right">
              <div>
                {/* Active Stage Header Pill */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#081D35] border border-[#173B5E] text-xs font-semibold text-[#7CC4FA]">
                    {activeStage === 'copper' ? (
                      <Zap className="w-3.5 h-3.5 text-[#e08b5c]" />
                    ) : activeStage === 'insulation' ? (
                      <Shield className="w-3.5 h-3.5 text-[#7CC4FA]" />
                    ) : (
                      <CircleDot className="w-3.5 h-3.5 text-[#7CC4FA]" />
                    )}
                    <span>
                      {isAr
                        ? `المرحلة ${currentStage.stepNumber} — ${currentStage.labelAr}`
                        : `Stage ${currentStage.stepNumber} — ${currentStage.labelEn}`}
                    </span>
                  </div>
                </div>

                {/* Stage Title & Subtitle */}
                <h3 className="text-lg sm:text-[21px] font-bold text-white leading-snug">
                  {isAr ? currentStage.titleAr : currentStage.titleEn}
                </h3>
                <p className="text-xs sm:text-[13px] font-medium text-[#7CC4FA] mt-1">
                  {isAr ? currentStage.subtitleAr : currentStage.subtitleEn}
                </p>

                {/* Main Explanation Paragraph */}
                <p className="text-xs sm:text-[14px] text-slate-200 leading-relaxed mt-3.5 pb-4 border-b border-[#173B5E]">
                  {isAr ? currentStage.descriptionAr : currentStage.descriptionEn}
                </p>

                {/* Key Engineering Observations */}
                <div className="space-y-2.5 mt-4">
                  {(isAr ? currentStage.pointsAr : currentStage.pointsEn).map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3974C8] shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                        {pt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Structured Technical Attributes Grid */}
              <div className="mt-6 pt-4 border-t border-[#173B5E]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(isAr ? currentStage.specsAr : currentStage.specsEn).map((spec, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#081D35]/90 border border-[#173B5E]/80"
                    >
                      <span className="block text-[11px] text-slate-400">
                        {spec.label}
                      </span>
                      <span className="block text-xs font-semibold text-white mt-0.5">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
