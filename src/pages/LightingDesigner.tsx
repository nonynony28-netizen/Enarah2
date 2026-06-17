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
}

const ROOM_CONFIGS = {
  living: {
    title: 'صالة معيشة حديثة',
    description: 'مساحة معيشة نموذجية (4م × 5م) تجمع بين الجلسات العائلية ومشاهدة التلفزيون.',
    explanation: 'توزيع الإضاءة في صالة المعيشة يعتمد على الدمج الذكي بين الإنارة العامة والجمالية؛ حيث تم توزيع 6 سبوتات دافئة (3000K) لتوفير تغطية متجانسة للغرفة دون تشكل ظلال حادة في زوايا الجلوس. الليد بروفايل المخفي يوفر إضاءة غير مباشرة (Indirect) مريحة أثناء مشاهدة التلفاز لحماية العين من الإجهاد. الثريا المودرن تمثل المركز البصري الجمالي للغرفة وتُعطي شعوراً بالفخامة والترحاب.',
    spotlightReason: 'تم توزيع 6 سبوتات على أطراف السقف لتغطية المساحة بالتساوي وتفادي الظلال. المقاسات تختلف تدريجياً (من 0.6 للسبوتات الخلفية إلى 1.3 للأمامية) لتبدو متناسقة مع منظور وعمق السقف ثلاثي الأبعاد.',
    ledReason: 'وزعنا شريطي ليد مائلين بزوايا (+18°/-18°) لتتبع انحناء الجبس المستعار بالصورة بدقة، وشريط أفقي بالخلف، مما يمنح تأثيراً ناعماً ومريحاً أثناء مشاهدة التلفزيون.',
    chandelierReason: 'ثريا مودرن بحلقات معلقة بمركز السقف لتمثل اللمسة الفنية والجمالية العامة وتوحد توزيع الإضاءة المحيطية.',
    recommendedTemp: 'warm' as const,
    spotlightCount: 6,
    ledCount: 3,
    chandelierCount: 1,
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    fixtures: [
      { id: 'spot_1', type: 'spotlight', x: 38, y: 18, scale: 0.6 },
      { id: 'spot_2', type: 'spotlight', x: 62, y: 18, scale: 0.6 },
      { id: 'spot_3', type: 'spotlight', x: 28, y: 26, scale: 0.9 },
      { id: 'spot_4', type: 'spotlight', x: 72, y: 26, scale: 0.9 },
      { id: 'spot_5', type: 'spotlight', x: 14, y: 38, scale: 1.3 },
      { id: 'spot_6', type: 'spotlight', x: 86, y: 38, scale: 1.3 },
      { id: 'led_1', type: 'led_profile', x: 30, y: 20, length: 170, angle: -18, thickness: 'thin' },
      { id: 'led_2', type: 'led_profile', x: 70, y: 20, length: 170, angle: 18, thickness: 'thin' },
      { id: 'led_3', type: 'led_profile', x: 50, y: 14, length: 110, angle: 0, thickness: 'thin' },
      { id: 'ch_1', type: 'chandelier', x: 50, y: 28, scale: 1.3, style: 'modern' }
    ] as FixtureConfig[]
  },
  kitchen: {
    title: 'مطبخ مودرن عصري',
    description: 'مطبخ عصري (3م × 4م) يتطلب إضاءة عالية لسهولة العمل وتجهيز الطعام.',
    explanation: 'تتطلب المطابخ إضاءة عمل (Task Lighting) قوية وواضحة. تم توزيع 4 سبوتات فوق أسطح العمل والمجلى مباشرة بزاوية سقوط مستقيمة لتسهيل الرؤية وتفادي الظلال أثناء الطهي. يمتد الليد بروفايل أسفل الخزائن العلوية ليوفر إنارة ساطعة ومركزة لسطح العمل، وشريط سقف مستعار للإضاءة العامة. تم اعتماد إضاءة طبيعية (4000K) لألوان حقيقية للأطعمة، وتجنب الثريات الكلاسيكية لسهولة التنظيف والحفاظ على البساطة.',
    spotlightReason: 'وزعنا كشافين في الخلف للإضاءة العامة، وكشافين أماميين كبيرين مباشرة فوق منضدة العمل والمجلى لتسليط إضاءة مركزة وقوية تمنع تشكل الظلال أثناء إعداد الأطعمة.',
    ledReason: 'شريط ليد علوي متناسق مع السقف مائل بـ (-14°) لإبراز الديكور الخشبي، وشريط آخر مائل بـ (8°) مثبت أسفل الخزائن العلوية لينير منطقة التحضير بكفاءة تامة كإضاءة عمل.',
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
      { id: 'led_2', type: 'led_profile', x: 68, y: 48, length: 150, angle: 8, thickness: 'thin' },
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
      { id: 'led_1', type: 'led_profile', x: 50, y: 58, length: 240, angle: 0, thickness: 'medium' },
      { id: 'led_2', type: 'led_profile', x: 50, y: 14, length: 180, angle: 0, thickness: 'thin' },
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
              <div className="relative w-full aspect-[16/10] md:aspect-[16/9] min-h-[300px] md:min-h-[450px] bg-slate-950 flex items-center justify-center select-none">
                
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

                {/* طبقة التعتيم المحاكية للظلام */}
                <div 
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-black"
                  style={{
                    opacity: showLights 
                      ? Math.max(0.15, 0.75 - (activeFixtures.length * (brightness / 100) * 0.08)) 
                      : 0.85
                  }}
                />

                {/* طبقة تأثيرات سقوط الإضاءة (Beams & Radial Glows) */}
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
                          background: `linear-gradient(to bottom, ${getTempColor(temp, 0.6)} 0%, ${getTempColor(temp, 0.08)} 50%, transparent 100%)`,
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
                  }
                  return null;
                })}

                {/* طبقة الأيقونات الهندسية الثابتة */}
                {activeFixtures.map((f) => {
                  if (f.type === 'led_profile') {
                    return (
                      <div
                        key={f.id}
                        className="absolute rounded-full transition-all duration-300 flex items-center justify-center pointer-events-none"
                        style={{
                          left: `${f.x}%`,
                          top: `${f.y}%`,
                          width: `${f.length || 150}px`,
                          height: f.thickness === 'thin' ? '6px' : f.thickness === 'thick' ? '12px' : '9px',
                          transform: `translate(-50%, -50%) rotate(${f.angle || 0}deg)`,
                          backgroundColor: getTempColor(temp, showLights ? 0.95 : 0.4),
                          boxShadow: showLights && brightness > 0 
                            ? `0 0 ${15 * (brightness/100)}px ${getTempColor(temp, 0.95)}, 0 0 ${30 * (brightness/100)}px ${getTempColor(temp, 0.5)}` 
                            : 'none',
                          opacity: showLights && brightness > 0 ? 0.35 + (brightness / 100) * 0.65 : 0.4,
                          willChange: 'transform'
                        }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-white/50 bg-[#0a192f]" />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={f.id}
                      className="absolute select-none flex items-center justify-center rounded-full bg-[#0f213a]/80 text-white/90 border border-white/10 shadow-md transition-all duration-300 pointer-events-none"
                      style={{
                        left: `${f.x}%`,
                        top: `${f.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: f.type === 'chandelier' ? `${(f.scale || 1.0) * 60}px` : `${(f.scale || 1.0) * 44}px`,
                        height: f.type === 'chandelier' ? `${(f.scale || 1.0) * 60}px` : `${(f.scale || 1.0) * 44}px`,
                        willChange: 'transform'
                      }}
                    >
                      {f.type === 'spotlight' ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className={`w-8 h-8 rounded-full border-2 transition-colors flex items-center justify-center ${
                            showLights && brightness > 0 ? 'bg-white border-blue-400 shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'bg-slate-700 border-slate-600'
                          }`}>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getTempColor(temp, showLights && brightness > 0 ? 1 : 0.2) }} />
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className={`p-2 rounded-xl transition-all ${
                            showLights && brightness > 0 ? 'text-amber-300 scale-105 animate-pulse' : 'text-slate-400'
                          }`}>
                            {f.style === 'classic' ? (
                              <Award className="w-7 h-7" />
                            ) : f.style === 'minimalist' ? (
                              <Sliders className="w-7 h-7 rotate-90" />
                            ) : (
                              <Sparkles className="w-7 h-7" />
                            )}
                          </div>
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
