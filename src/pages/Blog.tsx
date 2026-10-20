import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, X, Calendar, Clock, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

// ==========================================
// Articles Database (5 Rich Architectural Lighting Articles)
// ==========================================
export interface BlogPost {
  id: number
  badge: string
  title: string
  summary: string
  coverImage: string
  date: string
  readTime: string
  paragraphs: string[]
}

const getBlogPosts = (isAr: boolean): BlogPost[] => [
  {
    id: 1,
    badge: isAr ? 'دليل معماري' : 'Architectural Guide',
    title: isAr
      ? 'الدليل الشامل لإضاءة الواجهات الخارجية: إبراز الفخامة وحساب الزوايا'
      : 'Comprehensive Guide to Facade Lighting: Architectural Highlights & Beam Angles',
    summary: isAr
      ? 'واجهة المبنى هي التعبير البصري الأول. اكتشف كيف تحوّل الإضاءة المدروسة الجدران الصامتة إلى لوحة معمارية آسرة تبرز أدق التفاصيل الحجرية والرخامية.'
      : 'The building facade is the primary visual statement. Discover how calculated lighting transforms architecture into an evocative statement.',
    coverImage: '/images/project-facade.jpg',
    date: isAr ? '15 مايو 2026' : 'May 15, 2026',
    readTime: isAr ? '4 دقائق قراءة' : '4 min read',
    paragraphs: isAr
      ? [
          'تشكل الواجهة الخارجية الانطباع البصري الأول لأي مبنى، سواء كان فيلا سكنية خاصة أو مقراً تجارياً مرموقاً. وتكمن القيمة الحقيقية لإضاءة الواجهات في قدرتها على نحت التفاصيل المعمارية ليلاً وإظهار ملامس الحجر والرخام، محوّلة الجدران الصامتة إلى عمل فني متكامل دون إحداث أي تلوث ضوئي أو وهج مزعج للمارة.',
          'وتعتبر تقنية الإضاءة الجدارية الصاعدة والهابطة (Up-Down Wall Grazing) الركيزة الأولى في إضاءة الواجهات الحديثة؛ حيث تُثبت الكشافات بمحاذاة السطح لتوجيه حزم ضوئية رأسية متوازية تؤكد على ارتفاع المبنى وهيبته، مع الحرص التام على غمر مصدر الضوء داخل تجويف غائر لمنع رؤية مصدر الإشعاع مباشرة.',
          'ويتطلب حساب زوايا الانتشار الضوئي (Beam Angles) دقة هندسية بالغة؛ حيث تُخصص الزوايا الضيقة التي تتراوح بين 10 إلى 24 درجة لإبراز الأعمدة والبروزات الحجرية، بينما تُستخدم الزوايا الأوسع بين 36 إلى 60 درجة لغمر الأسطح العريضة الممتدة بتدفق ناعم ومتجانس يتفادى البقع المعتمة.',
          'كما تؤدي درجة حرارة اللون دوراً حاسماً في إبراز خامات البناء في البيئة الليبية، حيث تُعد درجات الضوء الدافئ (3000 كلفن) الخيار المثالي للواجهات الحجرية والرخامية ذات الدرجات البيج والرملية، بينما يُنصح بدرجات الضوء المحايد (4000 كلفن) للواجهات المودرن ذات التشطيبات الإسمنتية والزجاجية لضمان واقعية الألوان ونضارتها.'
        ]
      : [
          'The exterior facade provides the defining first architectural impression of any residence or commercial headquarters. The genuine value of exterior illumination lies in sculpting nighttime depth and accentuating stone and marble textures, turning silent walls into captivating architectural statements without creating intrusive glare or light pollution.',
          'Vertical wall grazing and up-down illumination serve as fundamental pillars in modern exterior lighting. Surface-mounted fixtures cast parallel vertical light streams along architectural lines to emphasize structure height, while concealed optical chambers ensure direct diode sightlines remain invisible to pedestrians.',
          'Calculating optical beam angles demands photometric precision. Narrow beam spreads between 10 to 24 degrees are calibrated to highlight structural columns and architectural projections, whereas wider spreads between 36 to 60 degrees bathe expansive surfaces in smooth, continuous, shadow-free illumination.',
          'Color temperature further dictates the nighttime perception of building materials. Warm white tones (3000K) accentuate natural limestone and travertine finishes, while neutral white (4000K) enhances contemporary concrete, glass, and composite panels with authentic clarity and chromatic crispness.'
        ]
  },
  {
    id: 2,
    badge: isAr ? 'تصميم داخلي' : 'Interior Lighting',
    title: isAr
      ? 'هندسة الإضاءة في الصالات الفاخرة: فن التناغم بين المخفي والسبوت لايت'
      : 'Living Room Photometrics: Harmonizing Cove Lighting & Architectural Spotlights',
    summary: isAr
      ? 'كيف تحقق بيئة بصرية مريحة للعين وفخمة المظهر في نفس الوقت؟ السر يكمن في تقسيم الإضاءة إلى طبقات ثلاث مدروسة بعناية فائقة.'
      : 'How to achieve a glare-free, visually comfortable, yet ultra-luxurious ambiance using the three-layer architectural illumination rule.',
    coverImage: '/images/project-company.jpg',
    date: isAr ? '10 مايو 2026' : 'May 10, 2026',
    readTime: isAr ? '3 دقائق قراءة' : '3 min read',
    paragraphs: isAr
      ? [
          'تمثل الصالة المعيشية والمجالس الفسيحة مركز الحياة اليومية في المنزل، حيث تلتقي فيها العائلة وتُستقبل الوفود والضيوف. ولتحقيق بيئة بصرية تجمع بين الفخامة والراحة البصرية، يعتمد مهندسو الإضاءة المعمارية قاعدة الطبقات الثلاث المتكاملة: الإضاءة المحيطية العامة، والإضاءة الوظيفية، وإضاءة التركيز الديكورية.',
          'تبدأ الطبقة الأولى بالإضاءة غير المباشرة الموزعة في مجاري الجبس المخفية (Cove Lighting)، والتي تُلقي ضوءاً ناعماً ينعكس على السقف ليعطي إحساساً بانفتاح الفراغ وارتفاعه دون ظهور أي لمبة أو مصدر نقطي حاد يزعج العين.',
          'وتعتمد الطبقة الثانية على كشافات السبوت لايت المعمارية المانعة للتوهج (Deep Anti-Glare)، والمصممة بتجويف بصري غائر يضمن عدم رؤية الليد مباشرة من زوايا الجلوس الطبيعية، فتصل الإضاءة إلى الأرضيات والأسطح بسلاسة تامة دون إجهاد العين حتى بعد ساعات طويلة من الجلوس.',
          'وتكتمل المنظومة بالطبقة الثالثة عبر تسليط حزم ضوئية دقيقة على اللوحات الجدارية والتحف الديكورية بواسطة سبوتات مركزة ذات زاوية ضيقة، مما يخلق تبايناً بصرياً راقياً يمنح الصالة عمقاً وثراءً معمارياً لا يمكن تحقيقه بمجرد تركيب ثريا تقليدية بمفردها.'
        ]
      : [
          'Living rooms and formal salons form the centerpiece of residential architecture, demanding a visual environment that balances luxury with lasting optical comfort. Architectural lighting professionals resolve this through the three-layer illumination rule: indirect ambient lighting, functional task lighting, and decorative accent beams.',
          'The foundational layer utilizes indirect ambient cove illumination concealed within ceiling perimeters. Reflecting softly off horizontal planes, it amplifies spatial volume and perceived ceiling height without exposing harsh point sources to the human field of view.',
          'The second layer integrates deep-recessed anti-glare architectural downlights. Engineered with recessed diode placement, these fixtures illuminate floors and tables with complete visual comfort, shielding occupants from direct glare even during prolonged evening gatherings.',
          'The ensemble concludes with targeted accent lighting directed at artworks, bespoke wall textures, and sculptural pieces. This controlled optical contrast introduces warmth and architectural depth that single central chandeliers can never achieve alone.'
        ]
  },
  {
    id: 3,
    badge: isAr ? 'مشاريع وتجارة' : 'Commercial Spaces',
    title: isAr
      ? 'سيكولوجية الضوء في المشاريع التجارية: كيف ترفع الإضاءة من قيمة علامتك؟'
      : 'Commercial Photometrics: Elevating Brand Value & Customer Experience with Light',
    summary: isAr
      ? 'في المطاعم والمقاهي وصالات العرض، الإضاءة ليست تفصيلاً ثانوياً بل أداة جذب حاسمة تؤثر في زمن بقاء العميل وراحته النفسية وإدراكه لجودة المكان.'
      : 'In retail and hospitality, lighting is a strategic driver that dictates dwell time, psychological comfort, and perceived brand value.',
    coverImage: '/images/project-shop.jpg',
    date: isAr ? '5 مايو 2026' : 'May 5, 2026',
    readTime: isAr ? '5 دقائق قراءة' : '5 min read',
    paragraphs: isAr
      ? [
          'في بيئات التجزئة والضيافة المعاصرة كالمطاعم والمقاهي وصالات العرض، لم تعد الإضاءة مجرد وسيلة للرؤية، بل أصبحت أداة تسويقية ونفسية استراتيجية تؤثر بصورة مباشرة في سلوك الزائر، وزمن بقائه داخل المتجر، وقراره الشرائي، وانطباعه العام عن جودة المكان وفخامته.',
          'يؤثر اختيار درجة حرارة اللون (Kelvin) بشكل مباشر على الحالة المزاجية؛ فالمطاعم الراقية والمقاهي تتبنى درجات الإضاءة الدافئة الهادئة (بين 2700K و 3000K) لخلق جو من الألفة والخصوصية يشجع الزبائن على الاسترخاء، بينما تتطلب صالات عرض السلع الفاخرة والمجوهرات والمكاتب درجات محايدة (4000K) لإظهار التفاصيل بدقة تامة وحيوية نشطة.',
          'ومن أهم المعايير الهندسية التي تفصل بين المشاريع العادية والمشاريع الراقية معامل إظهار الألوان الحقيقي (Color Rendering Index - CRI)؛ حيث يضمن اختيار مصابيح بمعامل لا يقل عن 90 إظهار ألوان الأقمشة والمنتجات والديكورات بدرجاتها الواقعية دون أي بهتان أو اصفرار مضلل يقلل من جاذبيتها.',
          'كما يوصى بتجنب التوزيع المنتظم العشوائي للكشافات الذي يجعل المكان مسطحاً ومملاً، واستبداله بتوزيع هرمي مدروس يركز الضوء على منصات العرض الرئيسية والمنتجات المميزة، مع الحفاظ على مسارات حركة مريحة للعين وخالية تماماً من الوهج المباشر.'
        ]
      : [
          'In modern retail, showrooms, and hospitality venues, lighting operates as an indispensable strategic driver of customer dwell time, brand perception, and spatial comfort. Calculated illumination converts commercial spaces into immersive environments that naturally invite engagement.',
          'Color temperature plays a decisive psychological role. Intimate fine-dining spaces and specialty cafes flourish under warm white tones (2700K to 3000K) that foster relaxation and privacy, whereas modern luxury showrooms and corporate headquarters require clean neutral white (4000K) for vibrant precision and mental clarity.',
          'Color rendition serves as another definitive benchmark of quality. Deploying light sources with a Color Rendering Index exceeding CRI 90 ensures that merchandise, architectural materials, and culinary presentations display their authentic tones without distortion or dullness.',
          'High-performance commercial layouts avoid uniform grid ceiling scattering. Instead, they establish a photometric hierarchy that guides visitor sightlines toward featured displays while preserving glare-free pathways throughout the space.'
        ]
  },
  {
    id: 4,
    badge: isAr ? 'بنية تحتية كهربائية' : 'Electrical Infrastructure',
    title: isAr
      ? 'معايير تأسيس شبكات الكهرباء والإنارة في المباني الحديثة: حماية واستدامة'
      : 'Electrical Infrastructure Standards in Modern Construction: Safety & Longevity',
    summary: isAr
      ? 'التأسيس الصحيح للشبكة الكهربائية واختيار الأسلاك المعتمدة يمثل صمام الأمان الحقيقي للمنشأة ويضمن كفاءة أجهزة الإضاءة لسنوات طويلة.'
      : 'Proper infrastructure engineering and certified Italian copper wiring ensure long-term durability and safety for architectural lighting.',
    coverImage: '/images/project-villa.jpg',
    date: isAr ? '28 أبريل 2026' : 'April 28, 2026',
    readTime: isAr ? '4 دقائق قراءة' : '4 min read',
    paragraphs: isAr
      ? [
          'تعتمد كفاءة أي نظام إضاءة معماري على جودة البنية التحتية الكهربائية التي تُؤسس خلف الجدران وداخل الأسقف الخرسانية. فمهما بلغت جودة وحدات الإنارة، فإن شبكة التوزيع الضعيفة أو غير المطابقة للمواصفات تؤدي إلى هبوط الجهد وتلف الليدات واحتراق المحولات بشكل متكرر.',
          'ويشكل اختيار أسلاك النحاس النقي الإيطالية المعتمدة الركيزة الأولى للأمان؛ حيث تضمن الموصلات ذات النقاوة العالية نقل التيار الكهربائي بأقل مقاومة ممكنة وبدون أي ارتفاع حراري غير آمن، مع توفير عوازل متطورة مقاومة للهب وعوامل الرطوبة والحرارة السائدة.',
          'كما ينبغي مراعاة التوزيع السليم للدوائر الكهربائية، بفصل خطوط الإنارة العامة عن خطوط التكييف والأحمال الثقيلة، وتخصيص قواطع حماية تفاضلية دقيقة لحماية المعدات الإلكترونية الحساسة ومحولات الليد الحديثة (LED Drivers) من التذبذبات الكهربائية المفاجئة.',
          'إن التخطيط الهندسي المسبق لمسارات التوصيل وأماكن صناديق التجميع يسهل عمليات الصيانة المستقبلية دون الحاجة إلى تكسير الجدران أو تشويه الديكورات، مما يمنح المبنى قيمة استثمارية مستدامة وأماناً كاملاً لسكانه على المدى الطويل.'
        ]
      : [
          'The enduring performance of architectural lighting relies entirely on the electrical infrastructure embedded behind walls and concrete slabs. Inadequate wiring specifications inevitably lead to voltage drops, premature diode failure, and recurring transformer damage.',
          'Installing certified Italian pure electrolytic copper conductors provides fundamental reliability. High-purity copper conducts current with minimal electrical resistance and heat buildup, supported by flame-retardant insulation engineered for demanding climates.',
          'Dedicated circuit zoning represents another vital engineering standard. Separating lighting circuits from high-draw HVAC lines and integrating sensitive residual-current breakers shields sensitive LED drivers from transient line spikes and voltage instability.',
          'Meticulous pre-construction planning of junction boxes and conduit pathways guarantees smooth maintenance access without disturbing architectural finishes, safeguarding asset value for decades.'
        ]
  },
  {
    id: 5,
    badge: isAr ? 'تحكم ذكي وأنظمة' : 'Smart Controls & Systems',
    title: isAr
      ? 'أنظمة التحكم الذكي والمفاتيح المعمارية: الجمع بين الراحة والجمال البصري'
      : 'Architectural Smart Controls & Switchgear: Balancing Utility & Aesthetics',
    summary: isAr
      ? 'كيف تحول المفاتيح المعمارية وأنظمة التعتيم الحديثة طريقة تفاعلك مع الفراغ، وتمنحك تحكماً كاملاً في المشاهد الضوئية بلمسة واحدة.'
      : 'How architectural switchgear and advanced dimming protocols elevate daily comfort and spatial aesthetics with single-touch convenience.',
    coverImage: '/images/smart-controls-switchgear.jpg',
    date: isAr ? '20 أبريل 2026' : 'April 20, 2026',
    readTime: isAr ? '3 دقائق قراءة' : '3 min read',
    paragraphs: isAr
      ? [
          'تشهد العمارة المعاصرة تحولاً جذرياً نحو التكامل بين عناصر التحكم الكهربائي والتصميم الداخلي؛ حيث لم تعد المفاتيح والبريزات مجرد أدوات تشغيل عادية، بل أصبحت تفصيلاً معمارياً يعكس ذوق المكان ويوفر تجربة استخدام مريحة وممتعة في كل غرفة.',
          'تتيح بروتوكولات التعتيم المتقدمة (Dimming Protocols) مثل DALI و 0-10V ضبط شدة الإضاءة تدريجياً وبنعومة تامة دون أي وميض غير مرئي يرهق العين، مما يمكن المستخدم من الانتقال بين مشهد إضاءة ساطع مخصص للعمل ومشهد دافئ هادئ مخصص للاسترخاء بلمسة زر واحدة.',
          'وتتميز المفاتيح الإيطالية الحديثة بتصميماتها النحيفة وموادها الفاخرة التي تتناغم مع ألوان الجدران وتشطيبات الرخام والخشب، مع توفير مؤشرات ضوئية خافتة ترشد المستخدم في الظلام دون أن تسبب أي إزعاج في غرف النوم والممرات.',
          'إن دمج وحدات الإنارة المعمارية مع أنظمة التحكم الذكي يسهم كذلك في ترشيد استهلاك الطاقة بنسب ملموسة، ويطيل من العمر الافتراضي لكشافات الليد عبر تشغيلها بالقدر المطلوب فقط، مما يحقق التوازن المثالي بين الفخامة والمسؤولية البيئية.'
        ]
      : [
          'Contemporary architecture increasingly bridges technical electrical controls with interior aesthetics. Wall switches, outlets, and dimmers are no longer mere utility fixtures, but refined tactile design elements that elevate daily living comfort.',
          'Professional dimming protocols such as DALI and 0-10V deliver smooth, flicker-free luminous transitions, empowering homeowners to effortlessly switch from focused task illumination to serene ambient scenes with a single touch.',
          'Premium Italian switchgear blends ultra-slim profiles with authentic tactile finishes that complement stone, wood, and refined paint palettes. Subtle locator backlighting provides intuitive night orientation without producing unwanted room glare.',
          'Harmonizing architectural fixtures with intelligent control systems also optimizes energy consumption and significantly extends LED lifespan by preventing unnecessary over-driving, delivering both aesthetic sophistication and operational efficiency.'
        ]
  }
]

export default function Blog() {
  const { isAr } = useLanguage()
  const blogPosts = getBlogPosts(isAr)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)

  // Derive ONLY the selected article strictly by its stable unique ID
  const selectedPost = useMemo(() => {
    if (selectedPostId === null) return null
    return blogPosts.find((p) => p.id === selectedPostId) || null
  }, [selectedPostId, blogPosts])

  const openArticle = (id: number) => {
    setSelectedPostId(id)
  }

  const closeArticle = () => {
    setSelectedPostId(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeArticle()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock body scroll cleanly while article modal is open
  useBodyScrollLock(!!selectedPost)

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F8FAFC] text-[#15191E] font-sans antialiased pb-20"
    >
      {/* =====================================================================
          01. Architectural Hero Header (Deep Corporate Navy #101820)
          ===================================================================== */}
      <section className="relative bg-[#101820] text-white pt-12 pb-14 overflow-hidden border-b border-[#202936]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0062D2]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#0062D2] animate-pulse" />
                <span>{isAr ? 'دراسات ومقالات معمارية' : 'Architectural Journal & Insights'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {isAr ? 'هندسة الإضاءة والأفكار المعمارية' : 'Lighting Engineering & Architectural Insights'}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {isAr
                  ? 'مقالات ودراسات بصرية متخصصة تضع بين يديك خلاصة خبرتنا في حساب زوايا الضوء، توزيع الكشافات المانعة للتوهج، وتأسيس الأنظمة الكهربائية المتينة في المباني الليبية.'
                  : 'Specialized photometrics research, anti-glare techniques, and electrical infrastructure standards from our engineering team in Benghazi.'}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'حساب زوايا الضوء والـ Photometrics' : 'Photometrics & Beam Angles'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'تقنيات مانع التوهج (Anti-Glare)' : 'Deep Anti-Glare Optics'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0062D2]" />
                  <span>{isAr ? 'معايير التأسيس والأسلاك' : 'Wiring Infrastructure'}</span>
                </div>
              </div>
            </div>

            {/* Reading badge */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md lg:w-80 shrink-0 space-y-3">
              <div className="flex items-center gap-2 text-[#0062D2] font-semibold text-xs">
                <BookOpen className="w-4 h-4 text-[#0062D2]" />
                <span>{isAr ? 'المجلة الهندسية المعتمدة' : 'Official Technical Journal'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'مكتوبة ومراجعة بواسطة مهندسي الإضاءة المعمارية لدى شركة الإنارة الحديثة في بنغازي.'
                  : 'Authored and reviewed by lighting engineers at Enarah Modern Showroom.'}
              </p>
              <div className="pt-2 border-t border-white/10 text-xs text-slate-400">
                {isAr ? '5 مقالات متخصصة متاحة للقراءة الفورية' : '5 In-depth articles available'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-12">

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => openArticle(post.id)}
              className="bg-white rounded-2xl overflow-hidden border border-[#E7EAF0] shadow-xs hover:border-[#0062D2]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-[#E7EAF0]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-product.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-white/95 backdrop-blur-md text-[#15191E] text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                      {post.badge}
                    </span>
                  </div>
                </div>

                {/* Metadata & Title */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs font-medium text-[#68717D] mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0062D2]" />
                      <span>{post.date}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0062D2]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#15191E] group-hover:text-[#0062D2] transition-colors line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#68717D] leading-relaxed font-normal line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="px-6 pb-6 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0062D2] group-hover:text-[#0047A5] transition-colors">
                  <span>{isAr ? 'قراءة المقال كاملاً' : 'Read Article'}</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter / Consultation Strip */}
        <div className="bg-[#101820] text-white rounded-3xl p-10 sm:p-14 text-center border border-[#202936]">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
              {isAr ? 'استشارات معمارية متخصصة' : 'ARCHITECTURAL CONSULTING'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
              {isAr ? 'هل ترغب في دراسة ضوئية لمشروعك؟' : 'Need an Architectural Lighting Study?'}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
              {isAr
                ? 'فريقنا الهندسي في بنغازي والبيضاء جاهز لتقديم المشورة المعمارية وتحليل مخططات المبنى لضمان توزيع ضوئي مثالي.'
                : 'Our engineering team in Benghazi & Al-Bayda is ready to review your architectural plans for photometric optimization.'}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors shadow-md"
            >
              <span>{isAr ? 'طلب استشارة أو تسعيرة' : 'Request Consultation or Quote'}</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================================
          Article Reading Modal (STRICT: ONE TITLE + ONE IMAGE + ONE ARTICLE BODY)
          ===================================================================== */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            key={`article-backdrop-${selectedPost.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={closeArticle}
          >
            <motion.div
              key={`article-modal-${selectedPost.id}`}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white text-[#15191E] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col border-0 sm:border sm:border-[#E7EAF0]"
            >
              {/* Minimal Top Header: Close Control Only - NO Titles, NO Clutter */}
              <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E7EAF0] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 shrink-0 pt-[max(0.625rem,env(safe-area-inset-top,0px))]">
                <button
                  type="button"
                  onClick={closeArticle}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68717D] hover:text-[#15191E] transition-colors cursor-pointer"
                >
                  {isAr ? (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة للمقالات</span>
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Articles</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeArticle}
                  className="min-w-[40px] min-h-[40px] w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all cursor-pointer shrink-0"
                  aria-label={isAr ? 'إغلاق المقال' : 'Close Article'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Primary Single Scrollable Content Container (STRICT HIERARCHY) */}
              <div className="flex-1 overflow-y-auto overscroll-contain pb-[calc(3rem+env(safe-area-inset-bottom,0px))]">
                <div className="p-6 sm:p-10 lg:p-12 space-y-6 sm:space-y-8 max-w-3xl mx-auto">
                  {/* 1. Category / Metadata (Subtle, never competing with title) */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#68717D]">
                    <span className="font-semibold text-[#0062D2] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                      {selectedPost.badge}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0062D2]" />
                      <span>{selectedPost.date}</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0062D2]" />
                      <span>{selectedPost.readTime}</span>
                    </span>
                  </div>

                  {/* 2. ONE Main Article Title (H1) - Strictly ONE visible title in the entire view */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15191E] tracking-tight leading-snug">
                    {selectedPost.title}
                  </h1>

                  {/* 3. ONE Article Image (Clean, responsive 16:9, NO text overlay) */}
                  <div className="relative w-full aspect-[16/9] max-h-[360px] rounded-2xl overflow-hidden bg-slate-900 border border-[#E7EAF0]">
                    <img
                      src={selectedPost.coverImage}
                      alt={selectedPost.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-product.jpg'
                      }}
                    />
                  </div>

                  {/* 4. Full Article Body: Continuous Editorial Paragraphs (NO H2/H3 headlines) */}
                  <div className="space-y-5 text-[#334155] text-base sm:text-lg leading-[1.9] sm:leading-[2] font-normal">
                    {selectedPost.paragraphs.map((para, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* 5. Minimal Signoff Note */}
                  <div className="pt-8 border-t border-[#E7EAF0] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-[#68717D] text-center sm:text-right">
                      {isAr ? 'شركة الإنارة الحديثة — قسم الدراسات الهندسية والاستشارات' : 'Enarah Modern Showroom — Engineering Studies & Consulting'}
                    </span>
                    <button
                      type="button"
                      onClick={closeArticle}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#15191E] text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
                    >
                      {isAr ? (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          <span>العودة إلى المقالات</span>
                        </>
                      ) : (
                        <>
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Articles</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
