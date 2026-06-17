import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb, Zap, Award, Sparkles, Sliders,
  Upload, ArrowLeft, RefreshCw, Eye, EyeOff, MessageCircle, CheckCircle, ChevronRight
} from 'lucide-react'

interface FixtureConfig {
  id: string;
  type: 'spotlight' | 'chandelier' | 'led_profile';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  scale?: number;
  style?: 'modern' | 'classic' | 'minimalist';
  angle?: number;
  length?: number;
  thickness?: 'thin' | 'medium' | 'thick';
  isCove?: boolean;
}

const ROOM_CONFIGS = {
  living: {
    title: 'صالة معيشة حديثة',
    description: 'مساحة معيشة نموذجية (4م × 5م) تجمع بين الجلسات العائلية ومشاهدة التلفزيون.',
    explanation: 'توزيع الإضاءة في هذه الصالة يعتمد على أسلوب الحد الأدنى (Minimalist) الفاخر. قمنا بدمج 3 خطوط ليد بروفايل ممتدة في السقف المستعار لتعطي إنارة عامة ناعمة تتبع خط المنظور بدقة، مع شريط ليد جداري مخفي (Cove Light) خلف الأريكة يوجه الضوء للأسفل لينير الجدار بنعومة. كما تم توفير 4 سبوتات خافتة في الزوايا للإنارة الإضافية، وثريا مودرن معلقة لتكتمل فخامة المكان.',
    spotlightReason: '4 سبوتات خافتة موزعة في الزوايا المفتوحة لتوفير إضاءة محيطية داعمة عند الحاجة دون الإخلال بالمظهر البسيط والهادئ للسقف. المقاسات تختلف تدريجياً لتتوافق مع عمق السقف ثلاثي الأبعاد.',
    ledReason: '4 خطوط ليد بروفايل: 3 منها تسير بالتوازي في السقف لتتبع خطوط منظور الغرفة، وخط جداري (Cove Light) يتدفق بنعومة خلف الأريكة ليوفر إضاءة دافئة وجمالية للغاية.',
    chandelierReason: 'ثريا مودرن بحلقات دائرية تتوسط منطقة الجلوس لتعمل كقطعة ديكور مضيئة ومنسجمة مع أسلوب الصالة العصري.',
    recommendedTemp: 'warm' as const,
    spotlightCount: 4,
    ledCount: 4,
    chandelierCount: 1,
    url: '/images/living-preset.jpg',
    fixtures: [
      { id: 'spot_1', type: 'spotlight', x: 35, y: 11, scale: 0.6 },
      { id: 'spot_2', type: 'spotlight', x: 82, y: 16, scale: 0.75 },
      { id: 'spot_3', type: 'spotlight', x: 18, y: 23, scale: 1.0 },
      { id: 'spot_4', type: 'spotlight', x: 72, y: 28, scale: 1.2 },
      { id: 'led_1', type: 'led_profile', x: 62.5, y: 14, length: 500, angle: 9.5, thickness: 'thin' },
      { id: 'led_2', type: 'led_profile', x: 38, y: 25, length: 540, angle: 7, thickness: 'thin' },
      { id: 'led_3', type: 'led_profile', x: 30, y: 32, length: 420, angle: 6, thickness: 'thin' },
      { id: 'led_cove', type: 'led_profile', x: 30.5, y: 33.5, length: 420, angle: 6.5, thickness: 'medium', isCove: true },
      { id: 'ch_1', type: 'chandelier', x: 52, y: 23, scale: 1.3, style: 'modern' }
    ] as FixtureConfig[]
  },
  kitchen: {
    title: 'مطبخ مودرن عصري',
    description: 'مطبخ عصري (3م × 4م) يتطلب إضاءة عالية لسهولة العمل وتجهيز الطعام.',
    explanation: 'تتطلب المطابخ إضاءة عمل (Task Lighting) قوية وواضحة. تم توزيع 4 سبوتات فوق أسطح العمل والمجلى مباشرة بزاوية سقوط مستقيمة لتسهيل الرؤية وتفادي الظلال أثناء الطهي. يمتد الليد بروفايل أسفل الخزائن العلوية ليوفر إنارة ساطعة ومركزة لسطح العمل، وشريط سقف مستعار للإضاءة العامة. تم اعتماد إضاءة طبيعية (4000K) لألوان حقيقية للأطعمة، وتجنب الثريات الكلاسيكية لسهولة التنظيف والحفاظ على البساطة.',
    spotlightReason: 'وزعنا كشافين في الخلف للإضاءة العامة، وكشافين أماميين كبيرين مباشرة فوق منضدة العمل والمجلى لتسليط إضاءة مركزة وقوية تمنع تشكل الظلال أثناء إعداد الأطعمة.',
    ledReason: 'شريط ليد علوي متناسق مع السقف مائل بـ (-14°) لإبراز الديكور الخشبي، وشريط أخر مائل بـ (8°) مثبت أسفل الخزائن العلوية لينير منطقة التحضير بكفاءة تامة كإضاءة عمل.',
    chandelierReason: 'ثريا تعليق مودرن وبسيطة تتدلى فوق جزيرة المطبخ، لتعطي إنارة مركزة ومظهر عصري دون التسبب في تجميع الأتربة أو صعوبة التنظيف.',
    recommendedTemp: 'natural' as const,
    spotlightCount: 4,
    ledCount: 2,
    chandelierCount: 1,
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    fixtures: [
      { id: 'spot_1', type: 'spotlight', x: 42, y: 20, scale: 0.7 },
      { id: 'spot_2', type: 'spotlight', x: 58, y: 20, scale: 0.7 },
      { id: 'spot_3', type: 'spotlight', x: 25, y: 45, scale: 1.2 },
      { id: 'spot_4', type: 'spotlight', x: 75, y: 45, scale: 1.2 },
      { id: 'led_1', type: 'led_profile', x: 35, y: 14, length: 160, angle: -14, thickness: 'thin' },
      { id: 'led_2', type: 'led_profile', x: 68, y: 48, length: 150, angle: 8, thickness: 'thin', isCove: true },
      { id: 'ch_1', type: 'chandelier', x: 50, y: 35, scale: 0.9, style: 'minimalist' }
    ] as FixtureConfig[]
  },
  bedroom: {
    title: 'غرفة نوم هادئة',
    description: 'غرفة نوم رئيسية (4م × 4م) مصممة للاسترخاء والراحة النفسية.',
    explanation: 'تم توزيع 4 سبوتات دافئة خافتة (3000K) في زوايا الغرفة وبعيداً عن منطقة سرير النوم تماماً، وذلك لتفادي سقوط الضوء مباشرة على العينين أثناء الاستلقاء. تم اعتماد إضاءة الليد بروفايل المخفي خلف السرير أو الستارة لإضفاء توهج ناعم يبعث على الهدوء والاسترخاء، مع ثريا مودرن ناعمة وقابلة للتحكم بشدتها لتوفير إضاءة محيطية جمالية.',
    spotlightReason: 'توزيع 4 كشافات سبوت لايت في زوايا الغرفة بعيداً عن منطقة سرير النوم تماماً، وذلك لتجنب سقوط الضوء مباشرة على العينين وتفادي الوهج المزعج أثناء الاستلقاء.',
    ledReason: 'شريط ليد بروفايل خلف خلفية السرير ليعطي إضاءة خافتة وناعمة ومريحة للنوم والاسترخاء، وشريط ليد آخر في الجيب الجبسي لتأثير ارتفاع السقف.',
    chandelierReason: 'ثريا مركزية بتصميم ناعم وهادئ توزع الضوء بزاوية 360 درجة، وتعمل كإضاءة عامة للمكان قبل النوم.',
    recommendedTemp: 'warm' as const,
    spotlightCount: 4,
    ledCount: 2,
    chandelierCount: 1,
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    fixtures: [
      { id: 'spot_1', type: 'spotlight', x: 35, y: 20, scale: 0.75 },
      { id: 'spot_2', type: 'spotlight', x: 65, y: 20, scale: 0.75 },
      { id: 'spot_3', type: 'spotlight', x: 20, y: 38, scale: 1.1 },
      { id: 'spot_4', type: 'spotlight', x: 80, y: 38, scale: 1.1 },
      { id: 'led_1', type: 'led_profile', x: 50, y: 58, length: 240, angle: 0, thickness: 'medium', isCove: true },
      { id: 'led_2', type: 'led_profile', x: 50, y: 14, length: 180, angle: 0, thickness: 'thin', isCove: true },
      { id: 'ch_1', type: 'chandelier', x: 50, y: 26, scale: 1.1, style: 'modern' }
    ] as FixtureConfig[]
  },
  salon: {
    title: 'صالون / مجلس ضيوف',
    description: 'مجلس ضيوف فخم وواسع (5م × 6م) يحتاج لإبراز الفخامة والديكورات.',
    explanation: 'مجلس الضيوف يعبر عن الكرم والفخامة. وزعنا 8 سبوتات مركزة وموجهة بزوايا مدروسة لتسليط الضوء على الديكورات الجدارية واللوحات والممرات. تم وضع ثريتين كلاسيكيتين فخمتين لتعزيز الطابع الفخم وتأكيد فخامة المجلس ومركزيته. يحيط الليد بروفايل بأطراف السقف المستعار ليوفر إضاءة عامة ناعمة ودافئة (3000K) تناسب اللقاءات الطويلة وتمنح المكان اتساعاً بصرياً.',
    spotlightReason: 'تم توزيع 8 سبوتات مركزة وموجهة بزوايا مدروسة ومقاسات تتدرج مع عمق الصورة (0.65 إلى 1.35)، لتسليط الضوء على الديكورات الجدارية واللوحات والممرات وإبراز الفخامة.',
    ledReason: 'أربعة خطوط ليد بروفايل في السقف المستعار تتبع بدقة أبعاد المجلس المربع بزوايا ميل تناسب منظور الصورة، لتعطي إضاءة غير مباشرة دافئة ومريحة للجلسات الطويلة.',
    chandelierReason: 'تم تعليق ثريتين كلاسيكيتين فخمتين بالكريستال بمستويين متدرجين في الحجم والارتفاع لملء الفراغ البصري لصالون الضيوف وتأكيد مركز الفخامة.',
    recommendedTemp: 'warm' as const,
    spotlightCount: 8,
    ledCount: 4,
    chandelierCount: 2,
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
    fixtures: [
      { id: 'spot_1', type: 'spotlight', x: 34, y: 18, scale: 0.65 },
      { id: 'spot_2', type: 'spotlight', x: 66, y: 18, scale: 0.65 },
      { id: 'spot_3', type: 'spotlight', x: 25, y: 28, scale: 0.9 },
      { id: 'spot_4', type: 'spotlight', x: 75, y: 28, scale: 0.9 },
      { id: 'spot_5', type: 'spotlight', x: 12, y: 42, scale: 1.35 },
      { id: 'spot_6', type: 'spotlight', x: 88, y: 42, scale: 1.35 },
      { id: 'spot_7', type: 'spotlight', x: 50, y: 16, scale: 0.7 },
      { id: 'spot_8', type: 'spotlight', x: 50, y: 34, scale: 1.15 },
      { id: 'led_1', type: 'led_profile', x: 26, y: 20, length: 180, angle: -22, thickness: 'medium' },
      { id: 'led_2', type: 'led_profile', x: 74, y: 20, length: 180, angle: 22, thickness: 'medium' },
      { id: 'led_3', type: 'led_profile', x: 50, y: 11, length: 120, angle: 0, thickness: 'medium' },
      { id: 'led_4', type: 'led_profile', x: 50, y: 52, length: 260, angle: 0, thickness: 'medium' },
      { id: 'ch_1', type: 'chandelier', x: 42, y: 24, scale: 0.95, style: 'classic' },
      { id: 'ch_2', type: 'chandelier', x: 58, y: 36, scale: 1.35, style: 'classic' }
    ] as FixtureConfig[]
  },
  custom: {
    title: 'توزيع مخصص لصورتك المرفوعة',
    description: 'توزيع هندسي ذكي ومناسب لجميع الصالونات والغرف السكنية.',
    explanation: 'لهذه الصورة قمنا بتطبيق توزيع هندسي متوازن ومناسب لأغلب الغرف: شبكة متوزعة من 4 سبوتات لتوزيع الضوء بالتساوي وبطريقة هندسية صحيحة، شريطي ليد بروفايل في السقف المستعار لمنح الغرفة إضاءة غير مباشرة (Indirect) تزيد من الارتفاع البصري، وثريا مركزية فخمة لتمثل القطعة الجمالية المضيئة في المنتصف.',
    spotlightReason: 'شبكة متوزعة من 4 سبوتات لتوزيع الضوء بالتساوي وبطريقة هندسية صحيحة تمنع تشكل الظلام في أركان الغرفة المرفوعة.',
    ledReason: 'شريطي ليد بروفايل في السقف لخلق إضاءة غير مباشرة (Indirect) تزيد من الارتفاع البصري وتضفي لمسة عصرية على الصورة.',
    chandelierReason: 'ثريا مركزية فخمة لتمثل القطعة الجمالية المضيئة في المنتصف لتوزيع الضوء في مركز المساحة.',
    recommendedTemp: 'warm' as const,
    spotlightCount: 4,
    ledCount: 2,
    chandelierCount: 1,
    url: '',
    fixtures: [
      { id: 'spot_1', type: 'spotlight', x: 30, y: 25, scale: 0.8 },
      { id: 'spot_2', type: 'spotlight', x: 70, y: 25, scale: 0.8 },
      { id: 'spot_3', type: 'spotlight', x: 20, y: 55, scale: 1.2 },
      { id: 'spot_4', type: 'spotlight', x: 80, y: 55, scale: 1.2 },
      { id: 'led_1', type: 'led_profile', x: 50, y: 15, length: 220, angle: 0, thickness: 'medium' },
      { id: 'led_2', type: 'led_profile', x: 50, y: 65, length: 220, angle: 0, thickness: 'medium' },
      { id: 'ch_1', type: 'chandelier', x: 50, y: 35, scale: 1.1, style: 'modern' }
    ] as FixtureConfig[]
  }
};

export default function LightingDesigner() {
  const [roomType, setRoomType] = useState<keyof typeof ROOM_CONFIGS>('living');
  const [customImage, setCustomImage] = useState<string | null>(null);
  
  // خيارات تشغيل/إطفاء المجموعات الضوئية
  const [showSpotlights, setShowSpotlights] = useState(true);
  const [showLedProfiles, setShowLedProfiles] = useState(true);
  const [showChandeliers, setShowChandeliers] = useState(true);
  
  // خيارات شدة الإضاءة العامة وحرارة الألوان
  const [brightness, setBrightness] = useState(80);
  const [temp, setTemp] = useState<'warm' | 'natural' | 'cool'>('warm');
  const [showLights, setShowLights] = useState(true);
  
  const [copiedText, setCopiedText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // استرجاع الصورة من الجلسة الآمنة عند التحميل والتأكد من عدم انتهاء الصلاحية (ساعة واحدة)
  useEffect(() => {
    const savedImage = sessionStorage.getItem('enarah_custom_image');
    const savedTime = sessionStorage.getItem('enarah_custom_image_time');
    
    if (savedImage && savedTime) {
      const elapsed = Date.now() - parseInt(savedTime);
      if (elapsed < 3600000) { // أقل من ساعة
        setCustomImage(savedImage);
        setRoomType('custom');
      } else {
        sessionStorage.removeItem('enarah_custom_image');
        sessionStorage.removeItem('enarah_custom_image_time');
      }
    }
  }, []);

  // مؤقت لمسح الصورة تلقائياً بعد مرور ساعة من الرفع
  useEffect(() => {
    const interval = setInterval(() => {
      const savedTime = sessionStorage.getItem('enarah_custom_image_time');
      if (savedTime) {
        const elapsed = Date.now() - parseInt(savedTime);
        if (elapsed >= 3600000) {
          setCustomImage(null);
          if (roomType === 'custom') {
            setRoomType('living');
          }
          sessionStorage.removeItem('enarah_custom_image');
          sessionStorage.removeItem('enarah_custom_image_time');
          alert("تنبيه أمني: انتهت صلاحية الجلسة الآمنة (ساعة واحدة) وتم إزالة صورتك المرفوعة تلقائياً لحماية خصوصيتك ولتسريع أداء متصفح الهاتف.");
        }
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [roomType]);

  // تحديث درجة اللون المفضلة تلقائياً عند تغيير الغرفة لمساعدة الزبون
  useEffect(() => {
    setTemp(ROOM_CONFIGS[roomType].recommendedTemp);
  }, [roomType]);

  const getBgImage = () => {
    if (roomType === 'custom' && customImage) {
      return customImage;
    }
    return ROOM_CONFIGS[roomType].url || ROOM_CONFIGS.living.url;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        alert("تنبيه: حجم الصورة كبير جداً! يرجى اختيار صورة أقل من 2.5 ميجابايت لضمان سرعة واستجابة اللوحة على الهواتف.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          setCustomImage(base64);
          setRoomType('custom');
          try {
            sessionStorage.setItem('enarah_custom_image', base64);
            sessionStorage.setItem('enarah_custom_image_time', Date.now().toString());
          } catch (err) {
            console.warn("فشل حفظ الصورة في sessionStorage، سيتم الاحتفاظ بها في ذاكرة الصفحة المؤقتة.", err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getTempColor = (t: 'warm' | 'natural' | 'cool', alpha: number = 1) => {
    switch (t) {
      case 'warm': return `rgba(251, 191, 36, ${alpha})`;
      case 'natural': return `rgba(254, 240, 138, ${alpha})`;
      case 'cool': return `rgba(224, 242, 254, ${alpha})`;
    }
  };

  const currentConfig = ROOM_CONFIGS[roomType];
  const activeFixtures = currentConfig.fixtures.filter(f => {
    if (f.type === 'spotlight') return showSpotlights;
    if (f.type === 'led_profile') return showLedProfiles;
    if (f.type === 'chandelier') return showChandeliers;
    return true;
  });

  const generateWhatsAppText = () => {
    const tempText = temp === 'warm' ? '3000K دافئ' : temp === 'natural' ? '4000K شمسي' : '6000K أبيض';
    const counts = [];
    if (showSpotlights) counts.push(`- سبوت لايت: ${currentConfig.spotlightCount} قطع`);
    if (showLedProfiles) counts.push(`- ليد بروفايل: ${currentConfig.ledCount} خطوط`);
    if (showChandeliers) counts.push(`- ثريا معلقة: ${currentConfig.chandelierCount} قطع`);

    const text = 
      `أهلاً "الإنارة الحديثة"، لقد تصفحت توزيع الإضاءة الهندسي المقترح لـ (${currentConfig.title}) عبر موقعكم وأود الاستفسار عن المنتجات المطابقة:\n\n` +
      `📊 الملخص الإجمالي والتوزيع المعتمد:\n` +
      `${counts.join('\n') || '- لم يتم تحديد قطع.'}\n\n` +
      `💡 درجة لون الإضاءة المطلوبة: ${tempText}\n` +
      `⚡ شدة السطوع المطلوبة: ${brightness}%\n\n` +
      `📸 (سأرفق لكم لقطة شاشة للغرفة بالواتساب لطلب مطابقة المنتجات والأسعار)`;
    
    return encodeURIComponent(text);
  };

  const handleWhatsAppShare = () => {
    const text = generateWhatsAppText();
    const cleanText = decodeURIComponent(text);
    navigator.clipboard.writeText(cleanText).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
      window.location.href = `https://wa.me/218916580068?text=${text}`;
    });
  };

  return (
    <div className="min-h-screen bg-[#06152b] py-20 px-4 sm:px-6 lg:px-8 relative text-white overflow-hidden font-sans" dir="rtl">
      
      {/* شبكة النيون الخلفية */}
      <div className="absolute inset-0 z-0 bg-[size:30px_30px] opacity-15 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)' }} 
      />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* العناوين والترويسة */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group text-sm font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            العودة للرئيسية
          </Link>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            موزّع الإضاءة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.35)]">الذكي والهندسي</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            اختر نوع غرفتك أو ارفع صورتك الشخصية، ليعرض لك النظام فوراً توزيع الإضاءة المنظوري والصحيح هندسياً مع شرح كامل وواضح لكل عنصر!
          </p>
        </div>

        {/* جسم المصمم */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* الجانب الأيمن (8 أعمدة): مساحة العرض الرسومية خفيفة الوزن للغاية */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* خيارات تغيير الغرفة */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(ROOM_CONFIGS) as Array<keyof typeof ROOM_CONFIGS>).map(key => {
                  if (key === 'custom' && !customImage) return null;
                  return (
                    <button
                      key={key}
                      onClick={() => setRoomType(key)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                        roomType === key
                          ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)] border border-blue-500/30'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {ROOM_CONFIGS[key].title}
                    </button>
                  );
                })}
              </div>

              {/* زر تحميل صورة مخصصة */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                    roomType === 'custom'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)] border border-green-500/30'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Upload className="w-4.5 h-4.5 text-green-400" />
                  <span>{customImage ? 'تغيير صورتك المرفوعة' : 'جرب توزيع إضاءة على صورتك'}</span>
                </button>
              </div>
            </div>

            {/* مساحة الرسم التفاعلية (Canvas) - لاصقة في الهواتف ومسرعة رسومياً بالكامل */}
            <div className="sticky top-[56px] z-40 md:relative md:top-auto md:z-auto bg-[#0d2342]/95 border border-blue-500/20 rounded-t-none rounded-b-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300">
              
              {/* شريط الإجراءات السريعة على الصورة */}
              <div className="absolute top-4 right-4 z-30 flex gap-2">
                <button
                  onClick={() => setShowLights(!showLights)}
                  className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-2xl transition-all border border-white/10 flex items-center gap-2 text-xs font-bold backdrop-blur-sm"
                >
                  {showLights ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4 text-green-400" />}
                  <span>{showLights ? 'إطفاء الإضاءة' : 'تشغيل الإضاءة'}</span>
                </button>
              </div>

              {/* الحاوية الفعلية للصورة والسبوتات - ثابتة 100% بدون مستمعين للسحب */}
              <div className="relative w-full aspect-[16/10] md:aspect-[16/9] min-h-[300px] md:min-h-[450px] bg-slate-950 flex items-center justify-center select-none" style={{ perspective: '1000px' }}>
                
                {/* الصورة الخلفية للغرفة */}
                {getBgImage() ? (
                  <img
                    src={getBgImage()}
                    alt="Room Canvas"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                    <Upload className="w-12 h-12 mb-3 text-slate-600" />
                    <span>يرجى رفع صورة للغرفة لتطبيق التوزيع الهندسي عليها</span>
                  </div>
                )}

                {/* طبقة التعتيم المحاكية للظلام - تم تخفيفها لتظل تفاصيل وسقف الغرفة واضحة وحقيقية */}
                <div 
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-black"
                  style={{
                    opacity: showLights 
                      ? Math.max(0.06, 0.40 - (activeFixtures.length * (brightness / 100) * 0.02)) 
                      : 0.60
                  }}
                />

                {/* طبقة توهج السقف المباشر (Ceiling Halo Glows) حول الكشافات ومجاري الليد لإبقاء ملمس الجبس بورد واضحاً ومشعاً */}
                {showLights && activeFixtures.map((f) => {
                  if (brightness <= 0) return null;
                  
                  if (f.type === 'spotlight') {
                    return (
                      <div
                        key={`ceiling_glow_${f.id}`}
                        className="absolute pointer-events-none rounded-full transition-all duration-300"
                        style={{
                          top: `${f.y}%`,
                          left: `${f.x}%`,
                          transform: 'translate(-50%, -50%) rotateX(50deg)',
                          width: `${(f.scale || 1.0) * 120}px`,
                          height: `${(f.scale || 1.0) * 80}px`,
                          background: `radial-gradient(circle, ${getTempColor(temp, 0.4)} 0%, ${getTempColor(temp, 0.06)} 60%, transparent 100%)`,
                          opacity: brightness / 100,
                          mixBlendMode: 'screen',
                          willChange: 'transform'
                        }}
                      />
                    );
                  }

                  if (f.type === 'led_profile' && !f.isCove) {
                    return (
                      <div
                        key={`led_glow_${f.id}`}
                        className="absolute pointer-events-none transition-all duration-300"
                        style={{
                          left: `${f.x}%`,
                          top: `${f.y}%`,
                          width: `${f.length || 150}px`,
                          height: f.thickness === 'thin' ? '30px' : f.thickness === 'thick' ? '50px' : '40px',
                          transform: `translate(-50%, -50%) rotate(${f.angle || 0}deg) rotateX(50deg)`,
                          background: `radial-gradient(ellipse, ${getTempColor(temp, 0.45)} 0%, ${getTempColor(temp, 0.08)} 60%, transparent 100%)`,
                          opacity: (brightness / 100) * 0.8,
                          filter: 'blur(8px)',
                          mixBlendMode: 'screen',
                          willChange: 'transform'
                        }}
                      />
                    );
                  }

                  return null;
                })}

                {/* طبقة تأثيرات سقوط الإضاءة (Beams, Radial Glows & Wall Cove Washes) */}
                {showLights && activeFixtures.map((f) => {
                  if (brightness <= 0) return null;
                  
                  if (f.type === 'spotlight') {
                    return (
                      <div
                        key={`beam_${f.id}`}
                        className="absolute pointer-events-none origin-top transition-all duration-300"
                        style={{
                          top: `${f.y}%`,
                          left: `${f.x}%`,
                          transform: `translateX(-50%) scale(${f.scale || 1.0})`,
                          width: '140px',
                          height: '320px',
                          background: `linear-gradient(to bottom, ${getTempColor(temp, 0.65)} 0%, ${getTempColor(temp, 0.08)} 50%, transparent 100%)`,
                          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                          opacity: brightness / 100,
                          filter: 'blur(4px)',
                          mixBlendMode: 'screen',
                          willChange: 'transform'
                        }}
                      />
                    );
                  } else if (f.type === 'chandelier') {
                    return (
                      <div
                        key={`glow_${f.id}`}
                        className="absolute pointer-events-none rounded-full transition-all duration-300"
                        style={{
                          top: `${f.y}%`,
                          left: `${f.x}%`,
                          transform: 'translate(-50%, -50%)',
                          width: `${(f.scale || 1.0) * 320}px`,
                          height: `${(f.scale || 1.0) * 320}px`,
                          background: `radial-gradient(circle, ${getTempColor(temp, 0.35)} 0%, ${getTempColor(temp, 0.06)} 50%, transparent 100%)`,
                          opacity: brightness / 100,
                          filter: 'blur(8px)',
                          mixBlendMode: 'screen',
                          willChange: 'transform'
                        }}
                      />
                    );
                  } else if (f.type === 'led_profile' && f.isCove) {
                    return (
                      <div
                        key={`cove_wash_${f.id}`}
                        className="absolute pointer-events-none transition-all duration-300"
                        style={{
                          left: `${f.x}%`,
                          top: `${f.y}%`,
                          width: `${f.length || 280}px`,
                          height: f.id === 'led_cove' ? '185px' : '110px',
                          transform: `translate(-50%, 0%) rotate(${f.angle || 0}deg)`,
                          background: `linear-gradient(to bottom, ${getTempColor(temp, 0.75)} 0%, ${getTempColor(temp, 0.3)} 25%, ${getTempColor(temp, 0.05)} 65%, transparent 100%)`,
                          opacity: brightness / 100,
                          filter: 'blur(14px)',
                          mixBlendMode: 'screen',
                          transformOrigin: 'top center',
                          willChange: 'transform'
                        }}
                      />
                    );
                  }
                  return null;
                })}

                {/* طبقة الأيقونات الهندسية الثابتة والواقعية */}
                {activeFixtures.map((f) => {
                  if (f.type === 'led_profile') {
                    if (f.isCove) return null; // hidden cove light
                    return (
                      <div
                        key={f.id}
                        className="absolute rounded-full transition-all duration-300 flex items-center justify-center pointer-events-none"
                        style={{
                          left: `${f.x}%`,
                          top: `${f.y}%`,
                          width: `${f.length || 150}px`,
                          height: f.thickness === 'thin' ? '7px' : f.thickness === 'thick' ? '15px' : '11px',
                          transform: `translate(-50%, -50%) rotate(${f.angle || 0}deg) rotateX(50deg)`,
                          // محاكاة المجرى الألمونيوم والناشر الأبيض المتوهج
                          background: showLights && brightness > 0 
                            ? `linear-gradient(to bottom, #0f172a 0%, ${getTempColor(temp, 1)} 15%, ${getTempColor(temp, 1)} 85%, #0f172a 100%)`
                            : 'linear-gradient(to bottom, #020617 0%, #cbd5e1 20%, #cbd5e1 80%, #020617 100%)',
                          boxShadow: showLights && brightness > 0 
                            ? `0 0 ${15 * (brightness/100)}px ${getTempColor(temp, 0.9)}, 0 0 ${30 * (brightness/100)}px ${getTempColor(temp, 0.5)}` 
                            : 'none',
                          border: '1px solid rgba(0,0,0,0.5)',
                          opacity: showLights && brightness > 0 ? 0.85 + (brightness / 100) * 0.15 : 0.6,
                          willChange: 'transform'
                        }}
                      >
                        {/* خط التشتيت الأبيض الداخلي */}
                        <div className="w-[98%] h-[60%] bg-white/40 rounded-full" />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={f.id}
                      className="absolute select-none flex items-center justify-center transition-all duration-300 pointer-events-none"
                      style={{
                        left: `${f.x}%`,
                        top: `${f.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: f.type === 'chandelier' ? `${(f.scale || 1.0) * 80}px` : `${(f.scale || 1.0) * 44}px`,
                        height: f.type === 'chandelier' ? `${(f.scale || 1.0) * 80}px` : `${(f.scale || 1.0) * 44}px`,
                        willChange: 'transform'
                      }}
                    >
                      {f.type === 'spotlight' ? (
                        <div className="relative w-full h-full flex items-center justify-center" style={{ transform: 'rotateX(50deg)' }}>
                          {/* فتحة السقف الجبسية (Drywall Cutout Shadow) */}
                          <div className="w-8 h-8 rounded-full bg-black/55 shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center">
                            {/* إطار السبوت الخارجي الألمونيوم ثلاثي الأبعاد (Bezel) */}
                            <div className="w-7.5 h-7.5 rounded-full border border-white/20 bg-slate-800 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
                              {/* تجويف الكوب الداخلي الأسود (Anti-Glare Baffle) */}
                              <div className="w-5.5 h-5.5 rounded-full bg-slate-950 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,1)]">
                                {/* عدسة الـ COB المضيئة المتوهجة بالداخل */}
                                <div 
                                  className="w-3.5 h-3.5 rounded-full transition-all duration-300"
                                  style={{
                                    backgroundColor: showLights && brightness > 0 ? getTempColor(temp, 1) : '#1e293b',
                                    boxShadow: showLights && brightness > 0 
                                      ? `0 0 10px ${getTempColor(temp, 1)}, inset 0 0 3px rgba(255,255,255,0.8)` 
                                      : 'none',
                                    opacity: showLights && brightness > 0 ? 0.5 + (brightness / 100) * 0.5 : 0.2
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          
                          {/* كوب معدني لتثبيت الثريا بالسقف في منظور ثلاثي الأبعاد (Ceiling Canopy) */}
                          <div 
                            className="absolute bg-slate-700 border border-white/20 rounded-full"
                            style={{
                              top: '0%',
                              left: '50%',
                              transform: 'translate(-50%, -50%) rotateX(55deg)',
                              width: '18px',
                              height: '8px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.6)'
                            }}
                          />

                          {/* رسمة الثريا الحقيقية عالية الدقة والوضوح (SVG) */}
                          <AnimatePresence>
                            {f.style === 'classic' ? (
                              <svg className="w-full h-full text-yellow-100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="50" y1="0" x2="50" y2="30" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeDasharray="2 2" />
                                <path d="M50 30 C35 30 25 45 25 55 C25 65 35 70 50 72 C65 70 75 65 75 55 C75 45 65 30 50 30 Z" stroke="rgba(217, 119, 6, 0.6)" strokeWidth="1" />
                                <path d="M50 65 Q30 65 28 50" stroke="rgba(217, 119, 6, 0.7)" strokeWidth="1.5" fill="none" />
                                <path d="M50 65 Q70 65 72 50" stroke="rgba(217, 119, 6, 0.7)" strokeWidth="1.5" fill="none" />
                                <path d="M50 68 Q15 68 18 45" stroke="rgba(217, 119, 6, 0.7)" strokeWidth="1.5" fill="none" />
                                <path d="M50 68 Q85 68 82 45" stroke="rgba(217, 119, 6, 0.7)" strokeWidth="1.5" fill="none" />
                                <circle cx="28" cy="48" r="3.5" fill={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 6px ${getTempColor(temp, 0.9)})` : 'none' }} />
                                <circle cx="72" cy="48" r="3.5" fill={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 6px ${getTempColor(temp, 0.9)})` : 'none' }} />
                                <circle cx="18" cy="43" r="4" fill={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 7px ${getTempColor(temp, 0.9)})` : 'none' }} />
                                <circle cx="82" cy="43" r="4" fill={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 7px ${getTempColor(temp, 0.9)})` : 'none' }} />
                                <circle cx="50" cy="40" r="4.5" fill={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 8px ${getTempColor(temp, 0.9)})` : 'none' }} />
                                <line x1="28" y1="50" x2="28" y2="58" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
                                <line x1="72" y1="50" x2="72" y2="58" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
                                <line x1="18" y1="45" x2="18" y2="54" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
                                <line x1="82" y1="45" x2="82" y2="54" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
                              </svg>
                            ) : f.style === 'minimalist' ? (
                              <svg className="w-full h-full text-slate-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="30" y1="0" x2="30" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                                <line x1="70" y1="0" x2="70" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                                <line x1="15" y1="50" x2="85" y2="50" stroke="#1e293b" strokeWidth="2.5" />
                                <circle cx="20" cy="58" r="5" fill={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 8px ${getTempColor(temp, 0.9)})` : 'none' }} />
                                <circle cx="35" cy="58" r="5" fill={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 8px ${getTempColor(temp, 0.9)})` : 'none' }} />
                                <circle cx="50" cy="58" r="5" fill={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 8px ${getTempColor(temp, 0.9)})` : 'none' }} />
                                <circle cx="65" cy="58" r="5" fill={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 8px ${getTempColor(temp, 0.9)})` : 'none' }} />
                                <circle cx="80" cy="58" r="5" fill={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 8px ${getTempColor(temp, 0.9)})` : 'none' }} />
                              </svg>
                            ) : (
                              <svg className="w-full h-full text-amber-200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="50" y1="0" x2="30" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" />
                                <line x1="50" y1="0" x2="70" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" />
                                <line x1="50" y1="0" x2="50" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" />
                                <ellipse cx="50" cy="45" rx="30" ry="8" stroke={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} strokeWidth="2.5" style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 5px ${getTempColor(temp, 0.8)})` : 'none' }} />
                                <ellipse cx="50" cy="55" rx="20" ry="5.5" stroke={showLights && brightness > 0 ? getTempColor(temp, 1) : '#64748b'} strokeWidth="2" style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 4px ${getTempColor(temp, 0.8)})` : 'none' }} />
                                <ellipse cx="50" cy="65" rx="12" ry="3.5" stroke={showLights && brightness > 0 ? getTempColor(temp, 1) : '#94a3b8'} strokeWidth="1.5" style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 3px ${getTempColor(temp, 0.8)})` : 'none' }} />
                              </svg>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* الجانب الأيسر (4 أعمدة): أدوات التخصيص وقراءة التقارير الهندسية */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* بطاقة التحكم في مجموعات الإضاءة وخصائصها */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl text-right space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-400" />
                  التحكم في عناصر التوزيع
                </h3>
                
                {/* مفاتيح التبديل السريعة للمجموعات */}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setShowSpotlights(!showSpotlights)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      showSpotlights 
                        ? 'bg-blue-600/10 border-blue-500/40 text-white shadow-[0_0_12px_rgba(59,130,246,0.15)]' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-all ${showSpotlights ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm">كشافات سبوت لايت</span>
                    </div>
                    <span className="text-xs font-bold font-mono px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                      {currentConfig.spotlightCount} قطع
                    </span>
                  </button>

                  <button
                    onClick={() => setShowLedProfiles(!showLedProfiles)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      showLedProfiles 
                        ? 'bg-sky-600/10 border-sky-500/40 text-white shadow-[0_0_12px_rgba(14,165,233,0.15)]' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-all ${showLedProfiles ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm">ليد بروفايل مخفي</span>
                    </div>
                    <span className="text-xs font-bold font-mono px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                      {currentConfig.ledCount} خطوط
                    </span>
                  </button>

                  <button
                    onClick={() => setShowChandeliers(!showChandeliers)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      showChandeliers 
                        ? 'bg-indigo-600/10 border-indigo-500/40 text-white shadow-[0_0_12px_rgba(99,102,241,0.15)]' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-all ${showChandeliers ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm">ثريا السقف الجمالية</span>
                    </div>
                    <span className="text-xs font-bold font-mono px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                      {currentConfig.chandelierCount} قطع
                    </span>
                  </button>
                </div>
              </div>

              {/* تحكم حرارة اللون العامة */}
              <div className="pt-4 border-t border-white/5">
                <span className="block text-xs font-bold text-slate-400 mb-2.5">لون وحرارة إضاءة المكان</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'warm', label: '3000K دافئ', bg: 'rgba(251, 191, 36, 0.15)', text: 'text-amber-400', border: 'border-amber-400/40' },
                    { id: 'natural', label: '4000K طبيعي', bg: 'rgba(254, 240, 138, 0.15)', text: 'text-yellow-200', border: 'border-yellow-200/40' },
                    { id: 'cool', label: '6000K بارد', bg: 'rgba(224, 242, 254, 0.15)', text: 'text-sky-300', border: 'border-sky-300/40' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setTemp(opt.id as any)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                        temp === opt.id
                          ? `${opt.bg} ${opt.text} ${opt.border} shadow-inner scale-[1.02]`
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* التحكم بشدة السطوع */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                  <span>شدة سطوع الإضاءة العامة</span>
                  <span className="text-white">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            {/* تقرير التوزيع الهندسي المكتوب والتحليل الإرشادي */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl text-right space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">التقرير الهندسي والتحليل الفني للتصميم</h3>
              </div>
              
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                {currentConfig.explanation}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400">تحليل المكونات المختارة:</h4>
                
                {showSpotlights && (
                  <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-3 text-xs flex gap-3 items-start">
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">💡</span>
                    <div>
                      <h5 className="font-bold text-white mb-0.5">كشافات سبوت لايت ({currentConfig.spotlightCount} قطع)</h5>
                      <p className="text-slate-400 leading-relaxed text-[11px]">{currentConfig.spotlightReason}</p>
                    </div>
                  </div>
                )}

                {showLedProfiles && (
                  <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-3 text-xs flex gap-3 items-start">
                    <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400">⚡</span>
                    <div>
                      <h5 className="font-bold text-white mb-0.5">خطوط ليد بروفايل ({currentConfig.ledCount} خطوط)</h5>
                      <p className="text-slate-400 leading-relaxed text-[11px]">{currentConfig.ledReason}</p>
                    </div>
                  </div>
                )}

                {showChandeliers && (
                  <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-3 text-xs flex gap-3 items-start">
                    <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">🌟</span>
                    <div>
                      <h5 className="font-bold text-white mb-0.5">ثريا السقف الجمالية ({currentConfig.chandelierCount} قطع)</h5>
                      <p className="text-slate-400 leading-relaxed text-[11px]">{currentConfig.chandelierReason}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/15 rounded-2xl p-3.5 text-[11px] text-blue-300 leading-relaxed mt-2">
                💡 **نصيحة مهندسي الإنارة:** يفضل دمج مستويات الإضاءة الثلاثة (العامة، والجمالية، والعملية) للحصول على أفضل راحة بصرية وعمق جمالي للمكان.
              </div>
            </div>

            {/* بطاقة إرسال الطلب وحجز الاستشارة */}
            <div className="bg-gradient-to-br from-[#0d2342] to-[#0a192f] border border-blue-500/25 rounded-3xl p-6 shadow-xl relative overflow-hidden text-right">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-400" />
                طلب مطابقة منتجات التوزيع
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                اضغط على الزر بالأسفل لنسخ تقرير التوزيع المقترح والتواصل الفوري مع مهندسينا لتأكيد القطع والماركات المناسبة عبر الواتساب!
              </p>

              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-4 rounded-2xl font-black text-base transition-all shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 animate-pulse" />
                <span>إرسال تقرير التوزيع للواتساب</span>
              </button>

              {copiedText && (
                <div className="mt-3 p-3 bg-green-600/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 animate-bounce" />
                  <span>تم نسخ تفاصيل التوزيع الهندسي! يرجى إرساله بالدردشة.</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* إرشادات ونصائح التصميم التفاعلية - تظهر بشكل كامل وجميل أسفل المحتوى الرئيسي */}
        <div className="mt-8 bg-[#0f213a]/50 border border-white/5 rounded-3xl p-6 text-sm text-slate-300 text-right">
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
            نصائح هندسية لتوزيع الإضاءة:
          </h4>
          <ul className="space-y-2 list-disc pr-5 leading-relaxed">
            <li>**السبوتات** توضع على مسافة تتراوح بين 80 سم إلى 1.2 متر من الجدران لتسليط الضوء على الديكورات والصور بشكل مثالي وتجنب الظلال الحادة.</li>
            <li>**الليد بروفايل** رائع في الزوايا وحواف الأسقف المستعارة لإعطاء إضاءة غير مباشرة (Indirect Light) تزيد من الارتفاع البصري للغرفة.</li>
            <li>**الثريا المعلقة** يفضل أن تكون النقطة البصرية المركزية للغرفة (فوق طاولة الطعام أو في منتصف صالون الضيافة).</li>
            <li>اختر حرارة اللون **الدافئ (3000K)** للاسترخاء في غرف النوم، و**الشمسي (4000K)** للمطابخ والممرات لراحة بصرية وألوان حقيقية.</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
