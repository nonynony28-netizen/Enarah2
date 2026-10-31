export type WireApplication = {
  wireId: string
  id: string
  sizeMm2: number
  size: string
  sizeEn: string
  imageSlug: string
  imageUrl: string
  avifSrcSet: string
  webpSrcSet: string
  jpgSrcSet: string
  imageAlt: string
  imageAltEn: string
  applicationTitle: string
  applicationTitleEn: string
  headingAr: string
  headingEn: string
  description: string
  descriptionEn: string
  summaryAr: string
  summaryEn: string
  examplesAr: [string, string, string]
  examplesEn: [string, string, string]
  technicalNoteAr: string
  technicalNoteEn: string
}

export function buildResponsiveImageSources(imageSlug: string) {
  return {
    imageUrl: `/images/wire-apps/${imageSlug}-800.jpg`,
    avifSrcSet: `/images/wire-apps/${imageSlug}-480.avif 480w, /images/wire-apps/${imageSlug}-800.avif 800w, /images/wire-apps/${imageSlug}-1080.avif 1080w`,
    webpSrcSet: `/images/wire-apps/${imageSlug}-480.webp 480w, /images/wire-apps/${imageSlug}-800.webp 800w, /images/wire-apps/${imageSlug}-1080.webp 1080w`,
    jpgSrcSet: `/images/wire-apps/${imageSlug}-480.jpg 480w, /images/wire-apps/${imageSlug}-800.jpg 800w, /images/wire-apps/${imageSlug}-1080.jpg 1080w`
  }
}

export const WIRE_APPLICATIONS_V10: WireApplication[] = [
  {
    wireId: '1.5',
    id: '1.5',
    sizeMm2: 1.5,
    size: '1.5 مم²',
    sizeEn: '1.5 mm²',
    imageSlug: 'v10-app-1-5mm',
    ...buildResponsiveImageSources('v10-app-1-5mm'),
    imageAlt: 'تمديدات الإنارة السقفية ودوائر الإضاءة الداخلية - سلك 1.5 مم²',
    imageAltEn: 'Residential Ceiling Lighting & Interior Illumination Circuits - 1.5 mm²',
    applicationTitle: 'تمديدات الإنارة السقفية ودوائر الإضاءة الداخلية',
    applicationTitleEn: 'Residential Ceiling Lighting & Interior Illumination Circuits',
    headingAr: 'تمديدات الإنارة السقفية ودوائر الإضاءة الداخلية',
    headingEn: 'Residential Ceiling Lighting & Interior Illumination Circuits',
    description:
      'يُستخدم هذا المقاس في تغذية نقاط الإضاءة السقفية والمفاتيح الجدارية وخطوط الإنارة المعمارية ذات الأحمال الخفيفة داخل المباني السكنية والتجارية.',
    descriptionEn:
      'Commonly used for ceiling lighting points, wall switches, and low-load architectural illumination circuits inside residential and commercial buildings.',
    summaryAr:
      'يُستخدم هذا المقاس في تغذية نقاط الإضاءة السقفية والمفاتيح الجدارية وخطوط الإنارة المعمارية ذات الأحمال الخفيفة داخل المباني السكنية والتجارية.',
    summaryEn:
      'Commonly used for ceiling lighting points, wall switches, and low-load architectural illumination circuits inside residential and commercial buildings.',
    examplesAr: [
      'توصيل وحدات الإنارة السقفية الغاطسة (Spotlights / Downlights) في الغرف والممرات',
      'تغذية خطوط المفاتيح الجدارية ونقاط التحكم في الإضاءة الداخلية',
      'أنظمة الإضاءة المخفية والإنارة التجميلية منخفضة الاستهلاك الكهربائي'
    ],
    examplesEn: [
      'Recessed ceiling LED downlights and spotlights across rooms and corridors',
      'Wall switch feeds and interior lighting control lines',
      'Architectural cove lighting and low-wattage decorative fixtures'
    ],
    technicalNoteAr:
      'تُعد هذه الأمثلة توضيحية للاستخدامات الشائعة؛ ويعتمد الاختيار النهائي لمقاس السلك على شدة التيار وطول المسار وطريقة التمديد وقاطع الحماية المناسب.',
    technicalNoteEn:
      'These examples illustrate common uses; final wire sizing depends on load current, circuit length, installation method, and breaker rating.'
  },
  {
    wireId: '2.5',
    id: '2.5',
    sizeMm2: 2.5,
    size: '2.5 مم²',
    sizeEn: '2.5 mm²',
    imageSlug: 'v10-app-2-5mm',
    ...buildResponsiveImageSources('v10-app-2-5mm'),
    imageAlt: 'تأسيس المآخذ الكهربائية والبريزات الجدارية العامة - سلك 2.5 مم²',
    imageAltEn: 'Professional Wall Socket & General Power Outlet Installations - 2.5 mm²',
    applicationTitle: 'تأسيس المآخذ الكهربائية والبريزات الجدارية العامة',
    applicationTitleEn: 'Professional Wall Socket & General Power Outlet Installations',
    headingAr: 'تأسيس المآخذ الكهربائية والبريزات الجدارية العامة',
    headingEn: 'Professional Wall Socket & General Power Outlet Installations',
    description:
      'المقاس الأكثر شيوعاً لتمديدات الأفياش والمآخذ الكهربائية الجدارية المخصصة لتشغيل الأجهزة المنزلية والمكتبية المعتادة في الغرف والصالات.',
    descriptionEn:
      'The standard gauge for flush-mounted wall sockets and general power outlets serving everyday household and office appliances.',
    summaryAr:
      'المقاس الأكثر شيوعاً لتمديدات الأفياش والمآخذ الكهربائية الجدارية المخصصة لتشغيل الأجهزة المنزلية والمكتبية المعتادة في الغرف والصالات.',
    summaryEn:
      'The standard gauge for flush-mounted wall sockets and general power outlets serving everyday household and office appliances.',
    examplesAr: [
      'تغذية البريزات والمآخذ الجدارية في غرف المعيشة والنوم والمكاتب',
      'تشغيل الأجهزة الإلكترونية والمنزلية اليومية ذات الاستهلاك المتوسط',
      'دوائر القوى الفرعية الموزعة داخل المواسير الجدارية المعتمدة'
    ],
    examplesEn: [
      'Flush-mounted wall sockets in living areas, bedrooms, and offices',
      'Everyday household and office electronics with moderate load demand',
      'Distributed branch power outlets routed inside concealed wall conduits'
    ],
    technicalNoteAr:
      'يُنصح بمراعاة عدد المآخذ المشتركة على نفس الدائرة وطول المسار لتفادي زيادة الحمل أو هبوط الجهد الكهربائي.',
    technicalNoteEn:
      'Account for the number of outlets sharing the circuit and total run length to prevent overload or voltage drop.'
  },
  {
    wireId: '4.0',
    id: '4.0',
    sizeMm2: 4.0,
    size: '4.0 مم²',
    sizeEn: '4.0 mm²',
    imageSlug: 'v10-app-4-0mm',
    ...buildResponsiveImageSources('v10-app-4-0mm'),
    imageAlt: 'دوائر الأحمال المستقلة والتكييف وسخانات المياه - سلك 4.0 مم²',
    imageAltEn: 'Dedicated Branch Circuits for A/C Units & Water Heaters - 4.0 mm²',
    applicationTitle: 'دوائر الأحمال المستقلة والتكييف وسخانات المياه',
    applicationTitleEn: 'Dedicated Branch Circuits for A/C Units & Water Heaters',
    headingAr: 'دوائر الأحمال المستقلة والتكييف وسخانات المياه',
    headingEn: 'Dedicated Branch Circuits for A/C Units & Water Heaters',
    description:
      'يُستخدم في الخطوط الفرعية المستقلة المنطلقة من لوحة التوزيع لتغذية الأجهزة التي تتطلب قدرة تحمل أعلى من دوائر المآخذ العادية.',
    descriptionEn:
      'Used for dedicated branch circuits from the distribution board serving appliances that require higher current capacity than standard outlets.',
    summaryAr:
      'يُستخدم في الخطوط الفرعية المستقلة المنطلقة من لوحة التوزيع لتغذية الأجهزة التي تتطلب قدرة تحمل أعلى من دوائر المآخذ العادية.',
    summaryEn:
      'Used for dedicated branch circuits from the distribution board serving appliances that require higher current capacity than standard outlets.',
    examplesAr: [
      'خطوط التغذية المباشرة لوحدات تكييف الهواء الجدارية (Split Units) المتوسطة',
      'دوائر سخانات المياه الكهربائية المستقلة في الحمامات والمطابخ',
      'تغذية أجهزة المطبخ الحرارية المفردة المربوطة بقاطع حماية خاص'
    ],
    examplesEn: [
      'Dedicated circuits for medium-capacity split air conditioning units',
      'Independent electric water heater circuits in bathrooms and kitchens',
      'Single thermal kitchen appliances protected by dedicated MCBs'
    ],
    technicalNoteAr:
      'يُفضل سحب خط مباشر مستقل من اللوحة الفرعية لكل جهاز رئيسي مع مطابقة سعة القاطع الكهربائي لحمل الجهاز.',
    technicalNoteEn:
      'Best installed as an independent home-run circuit from the distribution board with a matched circuit breaker.'
  },
  {
    wireId: '6.0',
    id: '6.0',
    sizeMm2: 6.0,
    size: '6.0 مم²',
    sizeEn: '6.0 mm²',
    imageSlug: 'v10-app-6-0mm',
    ...buildResponsiveImageSources('v10-app-6-0mm'),
    imageAlt: 'توصيلات الأحمال العالية ومفاتيح الفصل والقوى - سلك 6.0 مم²',
    imageAltEn: 'Higher-Load Circuit Installations & Heavy Appliance Isolators - 6.0 mm²',
    applicationTitle: 'توصيلات الأحمال العالية ومفاتيح الفصل والقوى',
    applicationTitleEn: 'Higher-Load Circuit Installations & Heavy Appliance Isolators',
    headingAr: 'توصيلات الأحمال العالية ومفاتيح الفصل والقوى',
    headingEn: 'Higher-Load Circuit Installations & Heavy Appliance Isolators',
    description:
      'مناسب للدوائر الكهربائية ذات الاستهلاك المرتفع التي تتطلب موصلية نحاسية عالية وثباتاً حرارياً أثناء التشغيل المستمر لفترات طويلة.',
    descriptionEn:
      'Suited for high-demand electrical circuits requiring elevated copper ampacity and thermal stability during continuous operation.',
    summaryAr:
      'مناسب للدوائر الكهربائية ذات الاستهلاك المرتفع التي تتطلب موصلية نحاسية عالية وثباتاً حرارياً أثناء التشغيل المستمر لفترات طويلة.',
    summaryEn:
      'Suited for high-demand electrical circuits requiring elevated copper ampacity and thermal stability during continuous operation.',
    examplesAr: [
      'تغذية وحدات التكييف ذات القدرات الكبيرة والمكيفات الدولابية أو المركزية المدمجة',
      'المواقد والأفران الكهربائية الكبيرة ومعدات المطابخ عالية القدرة',
      'خطوط تشغيل المضخات الكهربائية ومفاتيح العزل (Isolators) للأحمال الميكانيكية'
    ],
    examplesEn: [
      'High-capacity split or floor-standing air conditioning installations',
      'Large electric ranges, cooktops, and heavy-duty kitchen equipment',
      'Water pump feeds and rotary isolator switches for mechanical loads'
    ],
    technicalNoteAr:
      'تزداد أهمية حساب هبوط الجهد ودرجة الحرارة المحيطة وجودة ربط الأطراف النحاسية عند تشغيل الأحمال المستمرة.',
    technicalNoteEn:
      'Voltage drop, ambient temperature derating, and terminal torque quality are critical for continuous high loads.'
  },
  {
    wireId: '10.0',
    id: '10.0',
    sizeMm2: 10.0,
    size: '10.0 مم²',
    sizeEn: '10.0 mm²',
    imageSlug: 'v10-app-10-0mm',
    ...buildResponsiveImageSources('v10-app-10-0mm'),
    imageAlt: 'خطوط التغذية الفرعية والربط بين لوحات التوزيع - سلك 10.0 مم²',
    imageAltEn: 'Sub-Distribution Panel Feeders & Riser Connections - 10.0 mm²',
    applicationTitle: 'خطوط التغذية الفرعية والربط بين لوحات التوزيع',
    applicationTitleEn: 'Sub-Distribution Panel Feeders & Riser Connections',
    headingAr: 'خطوط التغذية الفرعية والربط بين لوحات التوزيع',
    headingEn: 'Sub-Distribution Panel Feeders & Riser Connections',
    description:
      'يُعتمد غالباً كخط تغذية رئيسي للشقق السكنية أو للربط الكهربائي بين اللوحة الرئيسية ولوحات التوزيع الفرعية داخل المبنى.',
    descriptionEn:
      'Frequently deployed as a residential main feeder or interconnection between primary boards and floor sub-distribution panels.',
    summaryAr:
      'يُعتمد غالباً كخط تغذية رئيسي للشقق السكنية أو للربط الكهربائي بين اللوحة الرئيسية ولوحات التوزيع الفرعية داخل المبنى.',
    summaryEn:
      'Frequently deployed as a residential main feeder or interconnection between primary boards and floor sub-distribution panels.',
    examplesAr: [
      'كابلات وأسلاك التغذية بين لوحة العداد ولوحة التوزيع الداخلية للشقة',
      'تغذية اللوحات الفرعية للأدوار المستقلة أو الملاحق في الفلل السكنية',
      'توصيل منظومات التكييف المركزي أو الأحمال الثلاثية الطور المتوسطة'
    ],
    examplesEn: [
      'Feeder lines between meter cabinets and apartment distribution boards',
      'Sub-panel feeders for individual floors or residential villa annexes',
      'Central HVAC condensers and medium three-phase distribution loads'
    ],
    technicalNoteAr:
      'يتطلب استخدام أطراف توصيل نحاسية (كوسات) مكبوسة جيداً ومراجعة إجمالي الأحمال المتزامنة على اللوحة الفرعية.',
    technicalNoteEn:
      'Requires properly crimped copper cable lugs and engineering review of total diversified sub-panel load.'
  },
  {
    wireId: '16.0',
    id: '16.0',
    sizeMm2: 16.0,
    size: '16.0 مم²',
    sizeEn: '16.0 mm²',
    imageSlug: 'v10-app-16-0mm',
    ...buildResponsiveImageSources('v10-app-16-0mm'),
    imageAlt: 'مسارات التغذية الرئيسية للمباني والمنشآت التجارية - سلك 16.0 مم²',
    imageAltEn: 'Larger Electrical Distribution & Commercial Feeder Environments - 16.0 mm²',
    applicationTitle: 'مسارات التغذية الرئيسية للمباني والمنشآت التجارية',
    applicationTitleEn: 'Larger Electrical Distribution & Commercial Feeder Environments',
    headingAr: 'مسارات التغذية الرئيسية للمباني والمنشآت التجارية',
    headingEn: 'Larger Electrical Distribution & Commercial Feeder Environments',
    description:
      'مخصص لمسارات التغذية الرئيسية داخل حوامل الكابلات ولوحات التوزيع في الفلل الكبيرة والمعارض والمقار التجارية.',
    descriptionEn:
      'Designed for primary feeder runs along cable trays and main distribution cabinets in large villas and commercial spaces.',
    summaryAr:
      'مخصص لمسارات التغذية الرئيسية داخل حوامل الكابلات ولوحات التوزيع في الفلل الكبيرة والمعارض والمقار التجارية.',
    summaryEn:
      'Designed for primary feeder runs along cable trays and main distribution cabinets in large villas and commercial spaces.',
    examplesAr: [
      'الخطوط الرئيسية المغذية للوحات التوزيع العمومية في الفلل الكبيرة والمباني',
      'مسارات التغذية المنظمة على حوامل الكابلات (Cable Trays) في غرف الكهرباء',
      'الربط الكهربائي مع لوحات التحويل الاحتياطية (ATS) والمولدات المتوسطة'
    ],
    examplesEn: [
      'Incoming main feeders for primary distribution cabinets in large villas',
      'Organized feeder routing on perforated galvanized cable trays',
      'Interconnections with standby generators and ATS transfer switchboards'
    ],
    technicalNoteAr:
      'يُصمم مسار السلك وفق حسابات التيار الأقصى المسموح به وعوامل التجميع الحراري داخل الحوامل أو المواسير.',
    technicalNoteEn:
      'Engineered according to maximum permissible current and thermal grouping factors inside trays or conduits.'
  },
  {
    wireId: '25.0',
    id: '25.0',
    sizeMm2: 25.0,
    size: '25.0 مم²',
    sizeEn: '25.0 mm²',
    imageSlug: 'v10-app-25-0mm',
    ...buildResponsiveImageSources('v10-app-25-0mm'),
    imageAlt: 'لوحات القوى الرئيسية وتوزيع المشاريع التجارية والصناعية - سلك 25.0 مم²',
    imageAltEn: 'Commercial Switchboards & Heavy-Duty Main Power Distribution - 25.0 mm²',
    applicationTitle: 'لوحات القوى الرئيسية وتوزيع المشاريع التجارية والصناعية',
    applicationTitleEn: 'Commercial Switchboards & Heavy-Duty Main Power Distribution',
    headingAr: 'لوحات القوى الرئيسية وتوزيع المشاريع التجارية والصناعية',
    headingEn: 'Commercial Switchboards & Heavy-Duty Main Power Distribution',
    description:
      'يُستخدم في لوحات التوزيع الرئيسية والقواطع المقولبة (MCCB) وقضبان التوزيع النحاسية للمشاريع التجارية والمنشآت ذات الأحمال المرتفعة.',
    descriptionEn:
      'Used in commercial main switchboards, molded-case circuit breakers (MCCBs), and copper busbar distribution for high-demand facilities.',
    summaryAr:
      'يُستخدم في لوحات التوزيع الرئيسية والقواطع المقولبة (MCCB) وقضبان التوزيع النحاسية للمشاريع التجارية والمنشآت ذات الأحمال المرتفعة.',
    summaryEn:
      'Used in commercial main switchboards, molded-case circuit breakers (MCCBs), and copper busbar distribution for high-demand facilities.',
    examplesAr: [
      'تغذية القواطع الرئيسية (MCCB) وقضبان النحاس العمومية في اللوحات المركزية',
      'خطوط القوى الرئيسية للمنشآت التجارية والخدمية والمضخات الكبرى',
      'المشاريع الهندسية التي تتطلب موصلية نحاسية عالية وتقليل الفقد عبر المسافات'
    ],
    examplesEn: [
      'Primary MCCB terminations and solid copper busbar connections in main switchboards',
      'Main power feeders for commercial complexes and large pumping stations',
      'Engineering projects requiring high copper conductivity and minimal voltage drop'
    ],
    technicalNoteAr:
      'يخضع تركيبه لإشراف هندسي مباشر مع الالتزام بقيم عزم الشد القياسية ومسافات العزل والتبريد داخل اللوحات.',
    technicalNoteEn:
      'Requires direct electrical engineering supervision, calibrated bolt torque, and proper busbar thermal clearance.'
  }
]

export function getWireApplicationById(wireId: string): WireApplication {
  return (
    WIRE_APPLICATIONS_V10.find((item) => item.wireId === wireId || item.id === wireId) ||
    WIRE_APPLICATIONS_V10[0]
  )
}

// PART 8, 9, 10 — EXACT MOBILE NOTIFICATION GUIDANCE & ACTIVATION MESSAGES
export const IPHONE_HOME_SCREEN_MESSAGE_AR =
  'لتصلك تنبيهات أسعار الأسلاك على هاتف iPhone، أضف موقع الإنارة الحديثة إلى الشاشة الرئيسية، ثم افتحه من الأيقونة وفعّل الإشعارات.'

export const IPHONE_HOME_SCREEN_MESSAGE_EN =
  'To receive wire price alerts on iPhone, add Enarah Modern to your Home Screen, open it from the icon, and enable notifications.'

export const IPHONE_HOME_SCREEN_STEPS_AR: [string, string, string, string, string, string] = [
  'افتح الموقع في Safari.',
  'اضغط على زر المشاركة.',
  'اختر «إضافة إلى الشاشة الرئيسية».',
  'افتح الموقع من الأيقونة الجديدة.',
  'ارجع إلى السلك المطلوب واضغط «تفعيل التنبيه».',
  'وافق على السماح بالإشعارات.'
]

export const IPHONE_HOME_SCREEN_STEPS_EN: [string, string, string, string, string, string] = [
  'Open the website in Safari.',
  'Tap the Share button.',
  'Select "Add to Home Screen".',
  'Open the website from the new Home Screen icon.',
  'Return to the desired wire size and tap "Activate Alert".',
  'Allow notification permissions when prompted.'
]

export const ANDROID_HOME_SCREEN_MESSAGE_AR =
  'للوصول السريع إلى أسعار الأسلاك والتنبيهات، يمكنك إضافة موقع الإنارة الحديثة إلى الشاشة الرئيسية لهاتفك.'

export const ANDROID_HOME_SCREEN_MESSAGE_EN =
  'For quick access to wire prices and alerts, you can add Enarah Modern to your phone Home Screen.'

export const ANDROID_HOME_SCREEN_BUTTON_AR = 'طريقة إضافة الموقع للشاشة الرئيسية'
export const ANDROID_HOME_SCREEN_BUTTON_EN = 'How to Add to Home Screen'

export const ANDROID_HOME_SCREEN_STEPS_AR: [string, string, string] = [
  'اضغط على قائمة المتصفح (⋮) في أعلى أو أسفل الشاشة.',
  'اختر «إضافة إلى الشاشة الرئيسية» أو «تثبيت التطبيق».',
  'أكد الإضافة ليظهر شعار الإنارة الحديثة على شاشة هاتفك.'
]

export const ANDROID_HOME_SCREEN_STEPS_EN: [string, string, string] = [
  'Tap the browser menu icon (⋮) in the address bar.',
  'Select "Add to Home screen" or "Install app".',
  'Confirm to place the Enarah Modern shortcut on your Home Screen.'
]

export const NOTIFICATION_ACTIVATION_SUCCESS_AR = 'تم تفعيل تنبيهات هذا السلك بنجاح.'
export const NOTIFICATION_ACTIVATION_SUCCESS_EN =
  'Alerts for this wire have been activated successfully.'

export const NOTIFICATION_ACTIVATION_FAILURE_AR =
  'تعذر تفعيل التنبيه حاليًا. يُرجى المحاولة مرة أخرى.'
export const NOTIFICATION_ACTIVATION_FAILURE_EN =
  'Could not activate the alert right now. Please try again.'

export interface MobileNotificationEnvironmentInput {
  userAgent?: string
  platform?: string
  maxTouchPoints?: number
  isStandalone?: boolean
  supportsServiceWorker?: boolean
  supportsPushManager?: boolean
  supportsNotifications?: boolean
  isHttpsOrLocalhost?: boolean
}

export interface MobileNotificationCapabilities {
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  isStandalone: boolean
  isIOSRequiresHomeScreen: boolean
  showAndroidOptionalInstallGuidance: boolean
  supportsServiceWorker: boolean
  supportsPushManager: boolean
  supportsNotifications: boolean
  isHttpsOrLocalhost: boolean
  canRequestWebPushNow: boolean
}

export function evaluateMobileNotificationCapabilities(
  input: MobileNotificationEnvironmentInput
): MobileNotificationCapabilities {
  const ua = input.userAgent || ''
  const platform = input.platform || ''
  const maxTouchPoints = input.maxTouchPoints ?? 0

  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1)
  const isAndroid = /Android/i.test(ua)
  const isMobile = isIOS || isAndroid || /Mobile|Android|iP(hone|od|ad)/i.test(ua)
  const isStandalone = Boolean(input.isStandalone)
  const supportsServiceWorker = Boolean(input.supportsServiceWorker)
  const supportsPushManager = Boolean(input.supportsPushManager)
  const supportsNotifications = Boolean(input.supportsNotifications)
  const isHttpsOrLocalhost = input.isHttpsOrLocalhost ?? true

  const isIOSRequiresHomeScreen = isIOS && !isStandalone
  const showAndroidOptionalInstallGuidance = isAndroid && !isStandalone
  const canRequestWebPushNow =
    !isIOSRequiresHomeScreen &&
    isHttpsOrLocalhost &&
    supportsServiceWorker &&
    supportsPushManager &&
    supportsNotifications

  return {
    isIOS,
    isAndroid,
    isMobile,
    isStandalone,
    isIOSRequiresHomeScreen,
    showAndroidOptionalInstallGuidance,
    supportsServiceWorker,
    supportsPushManager,
    supportsNotifications,
    isHttpsOrLocalhost,
    canRequestWebPushNow
  }
}
