import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calculator, Ruler, Lightbulb, Zap, Sparkles, Award,
  ArrowLeft, Layers, Compass, Clipboard, CheckCircle, Eye, EyeOff
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

// إعدادات الغرف النموذجية وإحداثيات الإضاءة المنظورية الصحيحة لكل غرفة
const ROOM_TEMPLATES = {
  living: {
    title: 'صالة معيشة حديثة',
    url: '/images/living-preset.jpg',
    explanation: 'توزيع الإنارة يعتمد على دمج الإنارة المخفية والليد بروفايل لإعطاء اتساع وارتفاع بصري، مع كشافات سبوت لايت في الزوايا للمساندة وتجنب الظلال الحادة.',
    fixtures: [
      // سبوتات (الحد الأقصى 8)
      { id: 'spot_1', type: 'spotlight', x: 35, y: 11, scale: 0.6 },
      { id: 'spot_2', type: 'spotlight', x: 82, y: 16, scale: 0.75 },
      { id: 'spot_3', type: 'spotlight', x: 18, y: 23, scale: 1.0 },
      { id: 'spot_4', type: 'spotlight', x: 72, y: 28, scale: 1.2 },
      { id: 'spot_5', type: 'spotlight', x: 50, y: 13, scale: 0.65 },
      { id: 'spot_6', type: 'spotlight', x: 60, y: 20, scale: 0.85 },
      { id: 'spot_7', type: 'spotlight', x: 28, y: 18, scale: 0.8 },
      { id: 'spot_8', type: 'spotlight', x: 42, y: 25, scale: 1.05 },
      // ليد بروفايل (الحد الأقصى 3 مباشر + 1 غير مباشر)
      { id: 'led_1', type: 'led_profile', x: 62.5, y: 14, length: 500, angle: 9.5, thickness: 'thin' },
      { id: 'led_2', type: 'led_profile', x: 38, y: 25, length: 540, angle: 7, thickness: 'thin' },
      { id: 'led_3', type: 'led_profile', x: 30, y: 32, length: 420, angle: 6, thickness: 'thin' },
      { id: 'led_cove', type: 'led_profile', x: 30.5, y: 33.5, length: 420, angle: 6.5, thickness: 'medium', isCove: true },
      // ثريا
      { id: 'ch_1', type: 'chandelier', x: 52, y: 23, scale: 1.3, style: 'modern' }
    ] as FixtureConfig[]
  },
  kitchen: {
    title: 'مطبخ مودرن عصري',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    explanation: 'توزيع إنارة المطبخ يركز بشكل أساسي على إنارة العمل (Task Light) فوق أسطح الإعداد والمجلى لمنع تشكل الظلال، مع إضاءة عامة جيدة وسلسة.',
    fixtures: [
      { id: 'spot_1', type: 'spotlight', x: 42, y: 20, scale: 0.7 },
      { id: 'spot_2', type: 'spotlight', x: 58, y: 20, scale: 0.7 },
      { id: 'spot_3', type: 'spotlight', x: 25, y: 45, scale: 1.2 },
      { id: 'spot_4', type: 'spotlight', x: 75, y: 45, scale: 1.2 },
      { id: 'spot_5', type: 'spotlight', x: 50, y: 22, scale: 0.8 },
      { id: 'spot_6', type: 'spotlight', x: 33, y: 32, scale: 1.0 },
      { id: 'led_1', type: 'led_profile', x: 35, y: 14, length: 160, angle: -14, thickness: 'thin' },
      { id: 'led_cove', type: 'led_profile', x: 68, y: 48, length: 220, angle: 8, thickness: 'thin', isCove: true },
      { id: 'ch_1', type: 'chandelier', x: 50, y: 35, scale: 0.9, style: 'minimalist' }
    ] as FixtureConfig[]
  },
  bedroom: {
    title: 'غرفة نوم هادئة',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    explanation: 'غرف النوم تحتاج لإنارة خافتة وغير مباشرة للراحة النفسية. يتم توزيع السبوتات في الأطراف بعيداً عن السرير مع إنارة مخفية مهدئة خلف الرأس.',
    fixtures: [
      { id: 'spot_1', type: 'spotlight', x: 35, y: 20, scale: 0.75 },
      { id: 'spot_2', type: 'spotlight', x: 65, y: 20, scale: 0.75 },
      { id: 'spot_3', type: 'spotlight', x: 20, y: 38, scale: 1.1 },
      { id: 'spot_4', type: 'spotlight', x: 80, y: 38, scale: 1.1 },
      { id: 'spot_5', type: 'spotlight', x: 50, y: 18, scale: 0.7 },
      { id: 'spot_6', type: 'spotlight', x: 50, y: 34, scale: 1.0 },
      { id: 'led_cove_1', type: 'led_profile', x: 50, y: 58, length: 240, angle: 0, thickness: 'medium', isCove: true },
      { id: 'led_cove_2', type: 'led_profile', x: 50, y: 14, length: 180, angle: 0, thickness: 'thin', isCove: true },
      { id: 'ch_1', type: 'chandelier', x: 50, y: 26, scale: 1.1, style: 'modern' }
    ] as FixtureConfig[]
  },
  salon: {
    title: 'صالون / مجلس ضيوف',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
    explanation: 'مجلس الضيوف يعبر عن الفخامة والكرم، لذا يعتمد على التناظر البصري وتعدد مستويات الإضاءة (سبوتات موجهة، بروفايل ممتد، ثريات كريستال مركزية).',
    fixtures: [
      { id: 'spot_1', type: 'spotlight', x: 34, y: 18, scale: 0.65 },
      { id: 'spot_2', type: 'spotlight', x: 66, y: 18, scale: 0.65 },
      { id: 'spot_3', type: 'spotlight', x: 25, y: 28, scale: 0.9 },
      { id: 'spot_4', type: 'spotlight', x: 75, y: 28, scale: 0.9 },
      { id: 'spot_5', type: 'spotlight', x: 12, y: 42, scale: 1.35 },
      { id: 'spot_6', type: 'spotlight', x: 88, y: 42, scale: 1.35 },
      { id: 'spot_7', type: 'spotlight', x: 50, y: 16, scale: 0.7 },
      { id: 'spot_8', type: 'spotlight', x: 50, y: 34, scale: 1.15 },
      { id: 'spot_9', type: 'spotlight', x: 20, y: 16, scale: 0.6 },
      { id: 'spot_10', type: 'spotlight', x: 80, y: 16, scale: 0.6 },
      { id: 'led_1', type: 'led_profile', x: 26, y: 20, length: 180, angle: -22, thickness: 'medium' },
      { id: 'led_2', type: 'led_profile', x: 74, y: 20, length: 180, angle: 22, thickness: 'medium' },
      { id: 'led_3', type: 'led_profile', x: 50, y: 11, length: 120, angle: 0, thickness: 'medium' },
      { id: 'led_4', type: 'led_profile', x: 50, y: 52, length: 260, angle: 0, thickness: 'medium' },
      { id: 'ch_1', type: 'chandelier', x: 42, y: 24, scale: 0.95, style: 'classic' },
      { id: 'ch_2', type: 'chandelier', x: 58, y: 36, scale: 1.35, style: 'classic' }
    ] as FixtureConfig[]
  },
  hallway: {
    title: 'ممر / موزع مدخل',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    explanation: 'الممرات تحتاج لإضاءة تدلك على الحركة بشكل آمن، لذا نعتمد على سبوت لايت طولي متباعد أو شريط ليد مخفي ممتد يحدد المسار.',
    fixtures: [
      { id: 'spot_1', type: 'spotlight', x: 50, y: 15, scale: 0.6 },
      { id: 'spot_2', type: 'spotlight', x: 50, y: 32, scale: 0.85 },
      { id: 'spot_3', type: 'spotlight', x: 50, y: 50, scale: 1.1 },
      { id: 'spot_4', type: 'spotlight', x: 50, y: 70, scale: 1.3 },
      { id: 'led_1', type: 'led_profile', x: 50, y: 35, length: 280, angle: 90, thickness: 'thin' },
      { id: 'led_cove', type: 'led_profile', x: 82, y: 40, length: 320, angle: 90, thickness: 'thin', isCove: true }
    ] as FixtureConfig[]
  }
};

export default function LightingDesigner() {
  // حالات حاسبة ومستشار الإضاءة
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [roomType, setRoomType] = useState<keyof typeof ROOM_TEMPLATES>('living');
  const [ceilingType, setCeilingType] = useState<'gypsum_full' | 'gypsum_perimeter' | 'flat'>('gypsum_full');
  const [lightLevel, setLightLevel] = useState<'relax' | 'medium' | 'bright'>('medium');

  // خيارات تشغيل/إيقاف المجموعات الضوئية
  const [showSpotlights, setShowSpotlights] = useState(true);
  const [showLedProfiles, setShowLedProfiles] = useState(true);
  const [showChandeliers, setShowChandeliers] = useState(true);

  // خيارات شدة الإضاءة العامة وحرارة الألوان للرسم المنظوري
  const [brightness, setBrightness] = useState(80);
  const [temp, setTemp] = useState<'warm' | 'natural' | 'cool'>('warm');
  const [showLights, setShowLights] = useState(true);
  const [copiedText, setCopiedText] = useState(false);

  // تحديث درجة لون الإضاءة المقترحة تلقائياً لتسهيل تجربة العميل
  useEffect(() => {
    if (roomType === 'kitchen') {
      setTemp('natural'); // المطبخ يحتاج لون شمسي طبيعي 4000K للعمل
    } else {
      setTemp('warm'); // صالات النوم والمعيشة تحتاج لون دافئ 3000K للراحة
    }
  }, [roomType]);

  // الحسابات الهندسية الفنية
  const area = parseFloat((length * width).toFixed(1));

  const getRequiredLux = () => {
    switch (roomType) {
      case 'living': return lightLevel === 'relax' ? 100 : lightLevel === 'medium' ? 150 : 250;
      case 'kitchen': return lightLevel === 'relax' ? 150 : lightLevel === 'medium' ? 250 : 350;
      case 'bedroom': return lightLevel === 'relax' ? 80 : lightLevel === 'medium' ? 120 : 180;
      case 'salon': return lightLevel === 'relax' ? 150 : lightLevel === 'medium' ? 200 : 300;
      case 'hallway': return lightLevel === 'relax' ? 80 : lightLevel === 'medium' ? 100 : 150;
    }
  };

  const reqLux = getRequiredLux();
  const totalLumens = Math.round(area * reqLux);

  // كفاءة المصباح بقوة 7 واط (تعطي ~550 لومن)
  const spotLumens = 550;
  let recommendedSpots = Math.ceil(totalLumens / spotLumens);
  if (recommendedSpots % 2 !== 0 && recommendedSpots > 1) {
    recommendedSpots += 1; // تقريب لعدد زوجي للتناظر البصري في السقف
  }

  // حساب أطوال الليد بروفايل والإنارة المخفية الموصى بها
  let ledLength = 0;
  let ledProfileRecommendation = '';

  if (ceilingType === 'gypsum_full') {
    ledLength = Math.round((length + width) * 0.9);
    ledProfileRecommendation = `تأسيس خطوط ليد بروفايل في السقف بطول إجمالي ${ledLength} متر طولي، موزعة على شكل مسارات متوازية لتعطي إنارة عامة ناعمة.`;
  } else if (ceilingType === 'gypsum_perimeter') {
    ledLength = Math.round((length + width) * 2);
    ledProfileRecommendation = `تأسيس شريط ليد مخفي (Cove Light) بطول ${ledLength} متر طولي، يلتف داخل الجيب الجبسي على أطراف الغرفة بالكامل لإنارة غير مباشرة غاية في الجمال.`;
  } else {
    ledProfileRecommendation = `السقف الخرساني المسطح لا يدعم تأسيس بروفايلات الليد الغاطسة. ننصحك باستخدام مسارات الإنارة المغناطيسية الظاهرة (Surface Magnetic Tracks) كبديل عصري سهل التركيب.`;
  }

  // حجم الثريا المقترح بالسنتمتر
  const recommendedChandelierDiameter = Math.round((length + width) * 8);

  const getTempColor = (t: 'warm' | 'natural' | 'cool', alpha: number = 1) => {
    switch (t) {
      case 'warm': return `rgba(251, 191, 36, ${alpha})`;
      case 'natural': return `rgba(254, 240, 138, ${alpha})`;
      case 'cool': return `rgba(224, 242, 254, ${alpha})`;
    }
  };

  // تصفية وعرض كشافات الإضاءة بشكل ديناميكي بناءً على الحسابات الهندسية لتطابق الصورة
  const activeRoomData = ROOM_TEMPLATES[roomType];
  const allFixtures = activeRoomData.fixtures;

  const currentSpotsCount = Math.min(recommendedSpots, allFixtures.filter(f => f.type === 'spotlight').length);
  const currentLedCount = ceilingType === 'flat' ? 0 : allFixtures.filter(f => f.type === 'led_profile').length;
  const currentChandelierCount = roomType === 'hallway' ? 0 : 1;

  // استخراج كتل الأضواء التي سيتم رندرتها منظوريًا
  const spotsToRender = allFixtures.filter(f => f.type === 'spotlight').slice(0, currentSpotsCount);
  const ledsToRender = allFixtures.filter(f => f.type === 'led_profile').slice(0, currentLedCount);
  const chandeliersToRender = allFixtures.filter(f => f.type === 'chandelier').slice(0, currentChandelierCount);

  // دمجها في مصفوفة واحدة للرسم والتفاعل
  const activeFixturesToRender = [
    ...(showSpotlights ? spotsToRender : []),
    ...(showLedProfiles ? ledsToRender : []),
    ...(showChandeliers ? chandeliersToRender : [])
  ];

  // صياغة التقرير الهندسي لنسخه إلى الحافظة
  const generateReportText = () => {
    const roomName = ROOM_TEMPLATES[roomType].title;
    const ceilingName = 
      ceilingType === 'gypsum_full' ? 'جبس مستعار كامل' : 
      ceilingType === 'gypsum_perimeter' ? 'جبس أطراف (ديكور كوف مخفي)' : 'سقف عادي مسطح';

    const brightnessName = 
      lightLevel === 'relax' ? 'هادئة ومريحة' : 
      lightLevel === 'medium' ? 'طبيعية ومعتدلة' : 'قوية وممتازة للقراءة';

    return `📊 تقرير حساب وتوزيع الإنارة الهندسية:\n` +
      `----------------------------------------\n` +
      `- الغرفة: ${roomName} (${length}م × ${width}م)\n` +
      `- المساحة الكلية: ${area} م²\n` +
      `- نوع السقف المعين: ${ceilingName}\n` +
      `- شدة الإضاءة المطلوبة: ${brightnessName}\n\n` +
      `💡 التوزيع الهندسي الموصى به:\n` +
      `- كشافات سبوت لايت: ${recommendedSpots} قطع (قوة 7 واط، زاوية 36-60 درجة)\n` +
      `- شريط ليد / بروفايل: ${ledLength > 0 ? `${ledLength} متر طولي` : 'غير مطبق'}\n` +
      `  * طريقة التأسيس: ${ledProfileRecommendation}\n` +
      `- حجم الثريا المقترح: قطر ${recommendedChandelierDiameter} سم بالمنتصف\n\n` +
      `📐 إرشادات التركيب ومسافات التوزيع:\n` +
      `- مسافة الجدار: اترك مسافة 1.0 متر إلى 1.2 متر بين السبوت والجدار لتلافي الظلال الحادة والوهج.\n` +
      `- مسافة التباعد البيني: وزّع الكشافات بمسافات تتراوح من 1.2 متر إلى 1.5 متر للحصول على إنارة متداخلة خالية من البقع المظلمة.`;
  };

  const handleCopyToClipboard = () => {
    const reportText = generateReportText();
    navigator.clipboard.writeText(reportText).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    });
  };

  // سيناريوهات التوزيع السريع الجاهزة
  const applyPresetScenario = (scenario: 'cove' | 'spots' | 'led' | 'all') => {
    if (scenario === 'cove') {
      setShowSpotlights(false);
      setShowLedProfiles(true);
      setShowChandeliers(false);
      // تأكيد تشغيل الليد بروفايل أو الكوف
      setCeilingType('gypsum_perimeter');
    } else if (scenario === 'spots') {
      setShowSpotlights(true);
      setShowLedProfiles(false);
      setShowChandeliers(false);
    } else if (scenario === 'led') {
      setShowSpotlights(false);
      setShowLedProfiles(true);
      setShowChandeliers(false);
      setCeilingType('gypsum_full');
    } else if (scenario === 'all') {
      setShowSpotlights(true);
      setShowLedProfiles(true);
      setShowChandeliers(true);
      if (ceilingType === 'flat') setCeilingType('gypsum_full');
    }
  };

  return (
    <div className="min-h-screen bg-[#06152b] py-20 px-4 sm:px-6 lg:px-8 relative text-white overflow-hidden font-sans" dir="rtl">
      
      {/* شبكة نيون خلفية */}
      <div className="absolute inset-0 z-0 bg-[size:30px_30px] opacity-15 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)' }} 
      />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* الترويسة الرئيسية */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group text-sm font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            العودة للرئيسية
          </Link>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            مستشار وحاسبة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.35)]">الإنارة الذكية</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            احسب أعداد ومقاسات كشافات الإضاءة لغرفتك بدقة علمية وهندسية، وشاهد النتيجة الحقيقية مطبقة فوراً على نماذج صور الغرف الواقعية بخفة وسلاسة مطلقة للهواتف!
          </p>
        </div>

        {/* جسم الأداة */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* الجانب الأيمن (5 أعمدة): حاسبة الإنارة الهندسية والنتائج */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* بطاقة إدخال البيانات */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl text-right space-y-5">
              
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                <Calculator className="w-5.5 h-5.5 text-blue-400" />
                <h2 className="text-lg font-black text-white">حاسبة توزيع الإضاءة</h2>
              </div>

              {/* اختيار الغرفة */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">اختر نوع الغرفة النموذجية</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'living', label: 'صالة معيشة' },
                    { id: 'kitchen', label: 'مطبخ' },
                    { id: 'bedroom', label: 'غرفة نوم' },
                    { id: 'salon', label: 'مجلس / صالون' },
                    { id: 'hallway', label: 'ممر / موزع' }
                  ].map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setRoomType(room.id as any)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition-all border ${
                        roomType === room.id
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {ROOM_TEMPLATES[room.id as keyof typeof ROOM_TEMPLATES]?.title.split(' ')[0] || room.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* أبعاد الغرفة */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 flex justify-between">
                    <span>طول الغرفة (متر)</span>
                    <span className="text-white font-mono">{length} م</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    step="0.5"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 flex justify-between">
                    <span>عرض الغرفة (متر)</span>
                    <span className="text-white font-mono">{width} م</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

              {/* نوع السقف */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">ديكورات السقف الجبسية</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'gypsum_full', title: 'سقف مستعار كامل (جبس بورد)', desc: 'يدعم الليد بروفايل والسبوتات الغاطسة' },
                    { id: 'gypsum_perimeter', title: 'جبس أطراف فقط (ديكور كوف مخفي)', desc: 'يدعم شريط الليد المخفي والإنارة غير المباشرة' },
                    { id: 'flat', title: 'سقف خرساني مسطح (بدون جبس)', desc: 'كشافات لطش ظاهرة وثريات فقط' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCeilingType(type.id as any)}
                      className={`p-3 rounded-xl font-bold text-right text-xs transition-all border flex flex-col gap-0.5 ${
                        ceilingType === type.id
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-inner'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-black text-sm">{type.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* شدة السطوع المطلوبة */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">شدة سطوع الضوء المفضلة</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'relax', label: 'هادئة استرخاء' },
                    { id: 'medium', label: 'طبيعية معتدلة' },
                    { id: 'bright', label: 'قوية للعمل' }
                  ].map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setLightLevel(level.id as any)}
                      className={`py-2 px-1 rounded-xl font-bold text-[11px] transition-all border ${
                        lightLevel === level.id
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* بطاقة ملخص النتائج ونسخ التقرير */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl text-right space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5.5 h-5.5 text-emerald-400" />
                  <h2 className="text-lg font-black text-white">النتائج الهندسية للتوزيع</h2>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                  المساحة: {area} م²
                </span>
              </div>

              {/* خلاصة القطع */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-bold">عدد السبوتات</span>
                  <div className="flex items-baseline gap-1 text-emerald-400">
                    <span className="text-2xl font-black">{recommendedSpots}</span>
                    <span className="text-[11px] font-bold">قطع (7 واط)</span>
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-bold">الليد بروفايل / مخفي</span>
                  <div className="flex items-baseline gap-1 text-sky-400">
                    <span className="text-2xl font-black">{ledLength > 0 ? ledLength : 'بدون'}</span>
                    <span className="text-[11px] font-bold">{ledLength > 0 ? 'متر طولي' : 'غير موصى'}</span>
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-bold">قطر الثريا الموصى به</span>
                  <div className="flex items-baseline gap-1 text-indigo-400">
                    <span className="text-2xl font-black">{recommendedChandelierDiameter}</span>
                    <span className="text-[11px] font-bold">سم</span>
                  </div>
                </div>
              </div>

              {/* إرشادات التوزيع */}
              <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  أبعاد مسافات التركيب للغرفة المحددة:
                </h4>
                <ul className="list-disc pr-4 space-y-1.5">
                  <li>**توزيع السبوت لايت:** ابدأ بتركيب السبوتات على مسافة **1.0 متر إلى 1.2 متر** من الجدران لتجنب الوهج المزعج.</li>
                  <li>**المسافة البينية:** اترك مسافة **1.2 متر إلى 1.5 متر** بين الكشاف والآخر لضمان تقاطع مخاريط الضوء.</li>
                  <li>**شريط الليد والبروفايل:** {ledProfileRecommendation}</li>
                </ul>
              </div>

              {/* زر نسخ التقرير فقط */}
              <button
                onClick={handleCopyToClipboard}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-black text-sm md:text-base transition-all shadow-[0_0_15px_rgba(59,130,246,0.35)] hover:scale-[1.01] active:scale-[0.99]"
              >
                <Clipboard className="w-5 h-5" />
                <span>نسخ تقرير التوزيع الفني للحافظة</span>
              </button>

              {copiedText && (
                <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 animate-bounce" />
                  <span>تم نسخ التقرير الهندسي بنجاح لحفظه أو إرساله!</span>
                </div>
              )}

            </div>

          </div>

          {/* الجانب الأيسر (7 أعمدة): المعاينة المنظورية الواقعية */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* لوحة الرسم والمعاينة المنظورية والسيناريوهات */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl text-right space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5.5 h-5.5 text-blue-400" />
                  <h2 className="text-lg font-black text-white">المعاينة المنظورية للإضاءة بالسقف</h2>
                </div>
                {/* مفاتيح تبديل سريعة لسيناريوهات الإضاءة الجاهزة */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'cove', label: 'إضاءة مخفية' },
                    { id: 'spots', label: 'سبوتات فقط' },
                    { id: 'led', label: 'ليد فقط' },
                    { id: 'all', label: 'إنارة كاملة' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPresetScenario(preset.id as any)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white transition-all font-bold text-[10px]"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* شريط التحكم السريع المباشر في المجموعات الضوئية على اللوحة */}
              <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-3 rounded-2xl border border-white/5">
                <button
                  onClick={() => setShowSpotlights(!showSpotlights)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    showSpotlights ? 'bg-blue-600/10 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {showSpotlights ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>السبوتات ({currentSpotsCount})</span>
                </button>
                <button
                  onClick={() => setShowLedProfiles(!showLedProfiles)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    showLedProfiles ? 'bg-sky-600/10 border-sky-500/40 text-sky-400' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {showLedProfiles ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>الليد والبروفايل ({currentLedCount})</span>
                </button>
                <button
                  onClick={() => setShowChandeliers(!showChandeliers)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    showChandeliers ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {showChandeliers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>الثريا ({currentChandelierCount})</span>
                </button>
              </div>

              {/* حاوية لوحة العرض المنظورية (Canvas) */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border border-blue-500/20 shadow-xl" style={{ perspective: '1000px' }}>
                
                {/* صورة الغرفة الخلفية الواقعية */}
                <img
                  src={activeRoomData.url}
                  alt={activeRoomData.title}
                  className="w-full h-full object-cover pointer-events-none"
                />

                {/* طبقة التعتيم والمحاكاة لشدة الإضاءة العامة */}
                <div 
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-black"
                  style={{
                    opacity: showLights 
                      ? Math.max(0.06, 0.42 - (activeFixturesToRender.length * (brightness / 100) * 0.025)) 
                      : 0.65
                  }}
                />

                {/* طبقة توهج السقف المباشر (Ceiling Halo Glows) حول الكشافات والليد بروفايل */}
                {showLights && activeFixturesToRender.map((f) => {
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

                {/* طبقة تأثيرات سقوط الإضاءة والواش الجداري الكوف (Beams, Radial Glows & Cove Washes) */}
                {showLights && activeFixturesToRender.map((f) => {
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

                {/* طبقة الأيقونات الهندسية للقطع المدمجة (Physical Light Fixtures) */}
                {activeFixturesToRender.map((f) => {
                  if (f.type === 'led_profile') {
                    if (f.isCove) return null; // الكوف غير مرئي ومخفي خلف الجبس
                    return (
                      <div
                        key={f.id}
                        className="absolute transition-all duration-300 flex items-center justify-center pointer-events-none"
                        style={{
                          left: `${f.x}%`,
                          top: `${f.y}%`,
                          width: `${f.length || 150}px`,
                          height: f.thickness === 'thin' ? '7px' : f.thickness === 'thick' ? '15px' : '11px',
                          transform: `translate(-50%, -50%) rotate(${f.angle || 0}deg) rotateX(50deg)`,
                          // مجرى ألومنيوم مع ناشر حليبي مستمر
                          background: showLights && brightness > 0 
                            ? `linear-gradient(to bottom, #475569 0%, #0f172a 4%, ${getTempColor(temp, 1)} 15%, ${getTempColor(temp, 1)} 85%, #0f172a 96%, #475569 100%)`
                            : 'linear-gradient(to bottom, #94a3b8 0%, #475569 8%, #e2e8f0 18%, #e2e8f0 82%, #475569 92%, #94a3b8 100%)',
                          boxShadow: showLights && brightness > 0 
                            ? `0 0 ${12 * (brightness/100)}px ${getTempColor(temp, 0.8)}, 0 0 ${25 * (brightness/100)}px ${getTempColor(temp, 0.4)}` 
                            : '0 1px 2px rgba(0,0,0,0.15)',
                          border: '1px solid rgba(0,0,0,0.45)',
                          opacity: showLights && brightness > 0 ? 0.9 + (brightness / 100) * 0.1 : 0.75,
                          willChange: 'transform'
                        }}
                      >
                        {/* الناشر الداخلي المتوهج */}
                        <div 
                          className="w-full h-[70%] transition-all duration-300" 
                          style={{
                            background: showLights && brightness > 0 
                              ? 'linear-gradient(to bottom, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.2) 100%)' 
                              : 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.3) 100%)'
                          }}
                        />
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
                          {/* فتحة القص بالسقف والظل */}
                          <div className="w-9 h-9 rounded-full bg-black/45 shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center">
                            {/* إطار السبوت الأبيض المدمج */}
                            <div className="w-8.5 h-8.5 rounded-full border border-slate-200 bg-slate-100 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
                              {/* الكوب الداخلي الأسود المضاد للوهج */}
                              <div className="w-6 h-6 rounded-full bg-[#0a0a0c] flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)] relative overflow-hidden">
                                <div className="absolute inset-[1px] rounded-full border border-slate-900/40" />
                                <div className="absolute inset-[3px] rounded-full border border-slate-900/60" />
                                {/* عدسة الـ COB المضيئة */}
                                <div 
                                  className="w-3.2 h-3.2 rounded-full transition-all duration-300 relative"
                                  style={{
                                    backgroundColor: showLights && brightness > 0 ? getTempColor(temp, 1) : '#dbb35c', // لون الفسفور الاصفر عند الاطفاء
                                    boxShadow: showLights && brightness > 0 
                                      ? `0 0 12px ${getTempColor(temp, 1)}, inset 0 0 3px rgba(255,255,255,0.9)` 
                                      : 'inset 0 1px 2px rgba(0,0,0,0.4)',
                                    opacity: showLights && brightness > 0 ? 1 : 0.8
                                  }}
                                >
                                  {showLights && brightness > 0 && (
                                    <div className="absolute top-[1px] left-[1px] w-0.8 h-0.8 bg-white rounded-full opacity-75" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* كوب التعليق بالسقف */}
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
                          {/* ثريا مودرن حلقات مضيئة SVG */}
                          <svg className="w-full h-full text-amber-200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="50" y1="0" x2="30" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" />
                            <line x1="50" y1="0" x2="70" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" />
                            <line x1="50" y1="0" x2="50" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" />
                            <ellipse cx="50" cy="45" rx="30" ry="8" stroke={showLights && brightness > 0 ? getTempColor(temp, 1) : '#475569'} strokeWidth="2.5" style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 5px ${getTempColor(temp, 0.8)})` : 'none' }} />
                            <ellipse cx="50" cy="55" rx="20" ry="5.5" stroke={showLights && brightness > 0 ? getTempColor(temp, 1) : '#64748b'} strokeWidth="2" style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 4px ${getTempColor(temp, 0.8)})` : 'none' }} />
                            <ellipse cx="50" cy="65" rx="12" ry="3.5" stroke={showLights && brightness > 0 ? getTempColor(temp, 1) : '#94a3b8'} strokeWidth="1.5" style={{ filter: showLights && brightness > 0 ? `drop-shadow(0 0 3px ${getTempColor(temp, 0.8)})` : 'none' }} />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* عناصر التحكم في شدة السطوع واللون أسفل الصورة مباشرة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5">
                {/* حرارة اللون */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-400">درجة حرارة ولون الإنارة</span>
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

                {/* السطوع */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>شدة السطوع العام</span>
                    <span className="text-white font-mono">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                    <button onClick={() => setShowLights(!showLights)} className="hover:text-white transition-colors">
                      {showLights ? '🔴 إطفاء الإنارة بالكامل' : '🟢 تشغيل الإنارة بالكامل'}
                    </button>
                  </div>
                </div>
              </div>

              {/* الشرح الهندسي والتوضيح الفني الديناميكي */}
              <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 text-xs leading-relaxed text-slate-300">
                <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-400" />
                  التحليل الفني للغرفة النموذجية النشطة:
                </h4>
                <p className="mb-2">
                  {ROOM_TEMPLATES[roomType].explanation}
                </p>
                <div className="text-[10px] text-blue-300 font-bold bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/15">
                  💡 **توضيح المعاينة:** الصورة بالأعلى تعرض نموذجاً حقيقياً للغرفة المحددة، ويتم رندرة الأضواء والسبوتات والبروفيلات ومخاريط الضوء فوقها منظوريًا وبحجم وعدد يطابق تماماً الأبعاد والمقاسات المحسوبة في الحاسبة الهندسية يمين الشاشة.
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
