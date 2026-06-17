import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calculator, Ruler, Lightbulb, Zap, Sparkles, Award,
  ArrowLeft, Compass, Clipboard, CheckCircle, Eye, EyeOff, Info
} from 'lucide-react'

// ألوان حرارة الضوء للنيون والمخطط التفاعلي
const TEMP_GLOW_COLORS = {
  warm: {
    color: '#fbbf24', // دافئ 3000K
    glow: 'rgba(251, 191, 36, 0.75)',
    radial: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.04) 50%, transparent 100%)'
  },
  natural: {
    color: '#fef08a', // طبيعي 4000K
    glow: 'rgba(254, 240, 138, 0.75)',
    radial: 'radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, rgba(254, 240, 138, 0.05) 50%, transparent 100%)'
  },
  cool: {
    color: '#e0f2fe', // بارد 6000K
    glow: 'rgba(224, 242, 254, 0.75)',
    radial: 'radial-gradient(circle, rgba(224, 242, 254, 0.3) 0%, rgba(224, 242, 254, 0.04) 50%, transparent 100%)'
  }
};

const ROOM_TEMPLATES = {
  living: {
    title: 'صالة معيشة حديثة',
    explanation: 'توزيع الإنارة في صالة المعيشة يدمج الإضاءة المخفية (Cove Light) للهدوء، مع ليد بروفايل ممتد للإنارة العامة، وسبوتات موجهة للأطراف.',
    defaultTemp: 'warm' as const,
    luxLevel: 150
  },
  kitchen: {
    title: 'مطبخ مودرن عصري',
    explanation: 'مطبخ مجهز بإنارة عمل مخصصة: كشافات مركزة فوق أسطح العمل والمجلى مباشرة، مع شريط ليد غاطس أسفل الخزائن العلوية.',
    defaultTemp: 'natural' as const,
    luxLevel: 250
  },
  bedroom: {
    title: 'غرفة نوم هادئة',
    explanation: 'إنارة غرفة النوم هادئة: سبوتات متباعدة عن منطقة الرأس والسرير لتفادي التوهج المزعج، مع ليد مخفي دافئ خلف ظهر السرير للاسترخاء.',
    defaultTemp: 'warm' as const,
    luxLevel: 120
  },
  salon: {
    title: 'صالون / مجلس ضيوف',
    explanation: 'مجلس ضيوف يعتمد على التوزيع المتناظر: ثريات مركزية فخمة لملء الفراغ، محاطة بإضاءة مخفية، مع سبوتات موجهة للديكورات.',
    defaultTemp: 'warm' as const,
    luxLevel: 200
  },
  hallway: {
    title: 'ممر / موزع مدخل',
    explanation: 'ممرات وحركة مريحة: خط ليد بروفايل في السقف يسير بمنتصف الممر ليحدد الاتجاه بوضوح وأناقة فائقة.',
    defaultTemp: 'warm' as const,
    luxLevel: 100
  }
};

export default function LightingDesigner() {
  // مدخلات حاسبة الإنارة الهندسية
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [roomType, setRoomType] = useState<keyof typeof ROOM_TEMPLATES>('living');
  const [ceilingType, setCeilingType] = useState<'gypsum_full' | 'gypsum_perimeter' | 'flat'>('gypsum_full');
  const [lightLevel, setLightLevel] = useState<'relax' | 'medium' | 'bright'>('medium');

  // عناصر الإنارة المشمولة بالحساب
  const [includeSpots, setIncludeSpots] = useState(true);
  const [includeLed, setIncludeLed] = useState(true);
  const [includeChandelier, setIncludeChandelier] = useState(true);

  // خيارات تشغيل/إيقاف المحاكاة
  const [showSpotlights, setShowSpotlights] = useState(true);
  const [showLedProfiles, setShowLedProfiles] = useState(true);
  const [showChandeliers, setShowChandeliers] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [temp, setTemp] = useState<'warm' | 'natural' | 'cool'>('warm');
  const [showLights, setShowLights] = useState(true);

  const [copiedText, setCopiedText] = useState(false);

  // تحديث درجة لون الإضاءة المقترحة تلقائياً لتسهيل تجربة العميل
  useEffect(() => {
    setTemp(ROOM_TEMPLATES[roomType].defaultTemp);
  }, [roomType]);

  // الحسابات الهندسية الفنية
  const area = parseFloat((length * width).toFixed(1));

  const getRequiredLux = () => {
    const baseLux = ROOM_TEMPLATES[roomType].luxLevel;
    if (lightLevel === 'relax') return Math.round(baseLux * 0.7);
    if (lightLevel === 'bright') return Math.round(baseLux * 1.4);
    return baseLux;
  };

  const reqLux = getRequiredLux();
  const totalLumens = Math.round(area * reqLux);

  // حساب عدد السبوتات المطلوبة بقوة 7 واط (تعطي ~550 لومن)
  const spotLumens = 550;
  let recommendedSpots = 0;
  if (includeSpots) {
    recommendedSpots = Math.ceil(totalLumens / spotLumens);
    // تقريب لعدد زوجي للتناسق في توزيع السقف
    if (recommendedSpots % 2 !== 0 && recommendedSpots > 1) {
      recommendedSpots += 1;
    }
  }

  // حساب الليد بروفايل أو شريط الليد المخفي الموصى به
  let ledLength = 0;
  let ledProfileRecommendation = '';

  if (includeLed) {
    if (ceilingType === 'gypsum_full') {
      ledLength = Math.round((length + width) * 0.9);
      ledProfileRecommendation = `تأسيس خطوط ليد بروفايل في السقف بطول إجمالي ${ledLength} متر طولي.`;
    } else if (ceilingType === 'gypsum_perimeter') {
      ledLength = Math.round((length + width) * 2);
      ledProfileRecommendation = `تأسيس شريط ليد مخفي (Cove Light) بطول ${ledLength} متر طولي.`;
    } else {
      ledProfileRecommendation = `سقف خرساني مسطح لا يدعم تأسيس بروفايلات الليد الغاطسة. ننصحك باستخدام سكة مغناطيسية ظاهرة.`;
    }
  }

  // حجم الثريا المقترح بالسنتمتر
  const recommendedChandelierDiameter = includeChandelier && roomType !== 'hallway' ? Math.round((length + width) * 8) : 0;

  // احتساب وحساب إحداثيات السبوتات ديناميكياً لتوزيعها بشكل متساوٍ
  const calculateSpotCoordinates = () => {
    const spots: Array<{ x: number; y: number }> = [];
    if (!includeSpots || recommendedSpots <= 0) return spots;

    let cols = 2;
    let rows = 2;
    const count = recommendedSpots;

    if (count === 2) {
      if (length >= width) { cols = 2; rows = 1; }
      else { cols = 1; rows = 2; }
    } else if (count === 4) {
      cols = 2; rows = 2;
    } else if (count === 6) {
      if (length >= width) { cols = 3; rows = 2; }
      else { cols = 2; rows = 3; }
    } else if (count === 8) {
      if (length >= width) { cols = 4; rows = 2; }
      else { cols = 2; rows = 4; }
    } else if (count >= 10 && count <= 12) {
      if (length >= width) { cols = 4; rows = 3; }
      else { cols = 3; rows = 4; }
    } else {
      if (length >= width) { cols = 4; rows = 2; }
      else { cols = 2; rows = 4; }
    }

    const wallDistX = length <= 3 ? 0.6 : length <= 4 ? 0.8 : 1.0;
    const wallDistY = width <= 3 ? 0.6 : width <= 4 ? 0.8 : 1.0;

    const spacingX = cols > 1 ? (length - 2 * wallDistX) / (cols - 1) : 0;
    const spacingY = rows > 1 ? (width - 2 * wallDistY) / (rows - 1) : 0;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const xMeters = cols > 1 ? wallDistX + c * spacingX : length / 2;
        const yMeters = rows > 1 ? wallDistY + r * spacingY : width / 2;
        spots.push({
          x: (xMeters / length) * 100,
          y: (yMeters / width) * 100
        });
      }
    }
    return { spots, wallDistX, wallDistY, spacingX, spacingY, cols, rows };
  };

  const layoutData = calculateSpotCoordinates();
  const spotCoords = layoutData.spots || [];
  const wallDistX = layoutData.wallDistX || 1.0;
  const wallDistY = layoutData.wallDistY || 1.0;
  const spacingX = layoutData.spacingX || 0;
  const spacingY = layoutData.spacingY || 0;
  const cols = layoutData.cols || 2;
  const rows = layoutData.rows || 2;

  // صياغة تقرير الحساب الهندسي للنسخ
  const generateReportText = () => {
    const roomName = ROOM_TEMPLATES[roomType].title;
    const ceilingName = 
      ceilingType === 'gypsum_full' ? 'جبس مستعار كامل' : 
      ceilingType === 'gypsum_perimeter' ? 'جبس أطراف (ديكور كوف مخفي)' : 'سقف عادي مسطح';

    const brightnessName = 
      lightLevel === 'relax' ? 'هادئة ومريحة' : 
      lightLevel === 'medium' ? 'طبيعية ومعتدلة' : 'قوية وممتازة للقراءة';

    return `📊 تقرير حساب وتوزيع الإنارة الهندسية لغرفتك:\n` +
      `----------------------------------------\n` +
      `- الغرفة: ${roomName} (${length}م × ${width}م)\n` +
      `- المساحة الكلية: ${area} م²\n` +
      `- نوع السقف المعين: ${ceilingName}\n` +
      `- شدة الإضاءة المطلوبة: ${brightnessName}\n\n` +
      `💡 التوزيع الهندسي للقطع:\n` +
      `- كشافات سبوت لايت: ${includeSpots ? `${recommendedSpots} قطع (قوة 7 واط)` : 'غير مشمول'}\n` +
      `- شريط ليد / بروفايل: ${ledLength > 0 ? `${ledLength} متر طولي` : 'غير مشمول'}\n` +
      `  * التوصية: ${ledProfileRecommendation}\n` +
      `- حجم الثريا المقترح: ${recommendedChandelierDiameter > 0 ? `قطر ${recommendedChandelierDiameter} سم بالمنتصف` : 'غير مشمول'}\n\n` +
      `📐 إرشادات التركيب ومسافات التوزيع (CAD):\n` +
      `- مسافة الجدار (X-Offset): تبعد السبوتات بمقدار ${wallDistX}م عن الحائط الجانبي الطويل.\n` +
      `- مسافة الجدار (Y-Offset): تبعد السبوتات بمقدار ${wallDistY}م عن الحائط القصير.\n` +
      `- مسافة التباعد الأفقي بين السبوتات: ${spacingX > 0 ? `${spacingX.toFixed(2)}م` : 'غير مطبق'}\n` +
      `- مسافة التباعد العمودي بين السبوتات: ${spacingY > 0 ? `${spacingY.toFixed(2)}م` : 'غير مطبق'}`;
  };

  const handleCopyToClipboard = () => {
    const reportText = generateReportText();
    navigator.clipboard.writeText(reportText).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    });
  };

  const activeGlow = TEMP_GLOW_COLORS[temp];

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
            مستشار ومخطط <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.35)]">الإنارة الهندسي</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            مخطط مخططات السقف الشبكية 2D (نظام محاكاة أوتوكاد تفاعلي). خفيف جداً على الهواتف وبدون صور ثقيلة، يعرض توزيع وحجم ومسافات التباعد للإنارة في غرفتك بشكل لحظي!
          </p>
        </div>

        {/* جسم الأداة */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* الجانب الأيمن (5 أعمدة): حاسبة الإنارة الهندسية والنتائج */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* بطاقة إدخال البيانات */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl text-right space-y-5 flex-1">
              
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                <Calculator className="w-5.5 h-5.5 text-blue-400" />
                <h2 className="text-lg font-black text-white">حاسبة ومستشار الإضاءة</h2>
              </div>

              {/* اختيار الغرفة */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">نوع الغرفة</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(ROOM_TEMPLATES) as Array<keyof typeof ROOM_TEMPLATES>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setRoomType(key)}
                      className={`py-2 px-2 rounded-xl font-bold text-xs transition-all border ${
                        roomType === key
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {ROOM_TEMPLATES[key].title.split(' ')[0]}
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

              {/* عناصر الإنارة المشمولة بالحساب */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <label className="text-xs font-bold text-slate-400 block">نوع الإضاءة المشمولة في الحساب</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setIncludeSpots(!includeSpots)}
                    className={`py-1.5 px-2.5 rounded-lg font-bold text-[10px] border transition-all ${
                      includeSpots ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    سبوت لايت
                  </button>
                  <button
                    onClick={() => setIncludeLed(!includeLed)}
                    className={`py-1.5 px-2.5 rounded-lg font-bold text-[10px] border transition-all ${
                      includeLed ? 'bg-sky-600/10 border-sky-500/30 text-sky-400' : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    ليد بروفايل / مخفي
                  </button>
                  <button
                    onClick={() => setIncludeChandelier(!includeChandelier)}
                    className={`py-1.5 px-2.5 rounded-lg font-bold text-[10px] border transition-all ${
                      includeChandelier ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    ثريا معلقة
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* الجانب الأيسر (7 أعمدة): المحاكي والمخطط الشبكي التفاعلي 2D */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            {/* لوحة مخطط السقف الهندسي (Blueprint Planner) */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl text-right space-y-4 flex flex-col justify-between">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Compass className="w-5.5 h-5.5 text-blue-400" />
                  <h2 className="text-base font-black text-white">مخطط السقف الشبكي وتوزيع القطع (2D Ceiling Blueprint)</h2>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                  المساحة: {area} م² ({length}م × {width}م)
                </span>
              </div>

              {/* أزرار التشغيل السريع للمجموعات داخل اللعبة/المخطط */}
              <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-2.5 rounded-2xl border border-white/5 text-xs">
                <button
                  onClick={() => setShowSpotlights(!showSpotlights)}
                  className={`py-1.5 px-1 rounded-xl font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    showSpotlights ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  {showSpotlights ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>سبوتات ({includeSpots ? recommendedSpots : 0})</span>
                </button>
                <button
                  onClick={() => setShowLedProfiles(!showLedProfiles)}
                  className={`py-1.5 px-1 rounded-xl font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    showLedProfiles ? 'bg-sky-600/10 border-sky-500/30 text-sky-400' : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  {showLedProfiles ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>ليد بروفايل / مخفي</span>
                </button>
                <button
                  onClick={() => setShowChandeliers(!showChandeliers)}
                  className={`py-1.5 px-1 rounded-xl font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    showChandeliers ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  {showChandeliers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>الثريا ({recommendedChandelierDiameter > 0 ? 1 : 0})</span>
                </button>
              </div>

              {/* حاوية المخطط الهندسي التفاعلي الخفيف 100% */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#020813] border border-blue-500/20 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-6">
                
                {/* شبكة نيون مخططة (AutoCAD Style Blueprint Grid) */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* الصندوق الممثل لأبعاد الغرفة الفعلية */}
                <div 
                  className="border-2 border-blue-500/30 bg-[#081326]/70 relative transition-all duration-300 shadow-2xl flex items-center justify-center"
                  style={{
                    width: `${Math.min(90, (length / 12) * 90)}%`,
                    height: `${Math.min(90, (width / 10) * 90)}%`,
                    maxHeight: '85%',
                    maxWidth: '85%',
                    backgroundImage: 'radial-gradient(rgba(59,130,246,0.15) 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                >
                  {/* خط الحدود الخارجي المتوهج كأجهزة ألعاب المستقبل */}
                  <div className="absolute inset-0 border border-blue-500/40 opacity-70 pointer-events-none" />

                  {/* مسافات الجدران بالأبعاد (AutoCAD Spacing Labels) */}
                  {includeSpots && showSpotlights && recommendedSpots > 0 && (
                    <>
                      {/* خط أبعاد X (الجدار الأيمن) */}
                      <div className="absolute h-0.5 border-t border-dashed border-red-500/50 flex items-center justify-center text-[9px] text-red-400 font-bold font-mono"
                        style={{
                          right: '0%',
                          width: `${(wallDistX / length) * 100}%`,
                          top: '12%',
                          transform: 'translateY(-50%)'
                        }}
                      >
                        <span className="bg-[#020813] px-1">{wallDistX.toFixed(1)}م</span>
                      </div>

                      {/* خط أبعاد Y (السقف الأعلى) */}
                      <div className="absolute w-0.5 border-l border-dashed border-red-500/50 flex items-center justify-center text-[9px] text-red-400 font-bold font-mono"
                        style={{
                          top: '0%',
                          height: `${(wallDistY / width) * 100}%`,
                          right: '12%',
                          transform: 'translateX(50%)'
                        }}
                      >
                        <span className="bg-[#020813] py-0.5 px-1 block rotate-90">{wallDistY.toFixed(1)}م</span>
                      </div>

                      {/* خط التباعد الأفقي البيني */}
                      {cols > 1 && spacingX > 0 && (
                        <div className="absolute h-0.5 border-t border-dashed border-emerald-500/50 flex items-center justify-center text-[9px] text-emerald-400 font-bold font-mono"
                          style={{
                            right: `${(wallDistX / length) * 100}%`,
                            width: `${(spacingX / length) * 100}%`,
                            bottom: '12%',
                            transform: 'translateY(50%)'
                          }}
                        >
                          <span className="bg-[#020813] px-1">{spacingX.toFixed(2)}م</span>
                        </div>
                      )}

                      {/* خط التباعد العمودي البيني */}
                      {rows > 1 && spacingY > 0 && (
                        <div className="absolute w-0.5 border-l border-dashed border-emerald-500/50 flex items-center justify-center text-[9px] text-emerald-400 font-bold font-mono"
                          style={{
                            top: `${(wallDistY / width) * 100}%`,
                            height: `${(spacingY / width) * 100}%`,
                            left: '12%',
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <span className="bg-[#020813] py-0.5 px-1 block rotate-90">{spacingY.toFixed(2)}م</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* رندرة خطوط الليد بروفايل أو شريط الإنارة المخفية */}
                  {includeLed && showLedProfiles && (
                    <>
                      {ceilingType === 'gypsum_full' && (
                        // خطوط ليد بروفايل متوازية نيون
                        <div className="absolute inset-0 flex flex-col justify-around py-[20%] pointer-events-none">
                          <div 
                            className="h-[6px] w-[80%] mx-auto rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: showLights && brightness > 0 ? activeGlow.color : '#334155',
                              boxShadow: showLights && brightness > 0 ? `0 0 15px ${activeGlow.glow}, 0 0 5px ${activeGlow.color}` : 'none'
                            }}
                          />
                          <div 
                            className="h-[6px] w-[80%] mx-auto rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: showLights && brightness > 0 ? activeGlow.color : '#334155',
                              boxShadow: showLights && brightness > 0 ? `0 0 15px ${activeGlow.glow}, 0 0 5px ${activeGlow.color}` : 'none'
                            }}
                          />
                        </div>
                      )}

                      {ceilingType === 'gypsum_perimeter' && (
                        // إطار الإنارة المخفية (Cove Light) الملتف حول السقف
                        <div 
                          className="absolute rounded transition-all duration-300 pointer-events-none"
                          style={{
                            top: '8%',
                            bottom: '8%',
                            left: '8%',
                            right: '8%',
                            border: `4px solid ${showLights && brightness > 0 ? activeGlow.color : '#334155'}`,
                            boxShadow: showLights && brightness > 0 ? `inset 0 0 18px ${activeGlow.glow}, 0 0 18px ${activeGlow.glow}` : 'none'
                          }}
                        />
                      )}
                    </>
                  )}

                  {/* رندرة السبوت لايت كمحاكاة نيون (Glowing Nodes) */}
                  {includeSpots && showSpotlights && spotCoords.map((spot, idx) => (
                    <div
                      key={`spot_node_${idx}`}
                      className="absolute rounded-full flex items-center justify-center transition-all duration-300 pointer-events-none"
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: '18px',
                        height: '18px',
                        backgroundColor: '#1e293b',
                        border: `2px solid ${showLights && brightness > 0 ? activeGlow.color : '#475569'}`,
                        boxShadow: showLights && brightness > 0 ? `0 0 10px ${activeGlow.glow}` : 'none'
                      }}
                    >
                      {/* بؤرة الضوء المركزية المتوهجة بالداخل */}
                      <div 
                        className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: showLights && brightness > 0 ? activeGlow.color : '#475569',
                          boxShadow: showLights && brightness > 0 ? `0 0 8px ${activeGlow.color}` : 'none',
                          opacity: showLights && brightness > 0 ? brightness / 100 : 0.2
                        }}
                      />

                      {/* مخروط الضوء العلوي المسقط على الأرضية (Floor Light Projection) */}
                      {showLights && brightness > 0 && (
                        <div 
                          className="absolute rounded-full pointer-events-none -z-10 mix-blend-screen scale-100 opacity-70 transition-all duration-300"
                          style={{
                            width: '90px',
                            height: '90px',
                            background: activeGlow.radial,
                            transform: 'translate(-50%, -50%)',
                            left: '50%',
                            top: '50%',
                          }}
                        />
                      )}
                    </div>
                  ))}

                  {/* رندرة الثريا المركزية في المنتصف كعنصر جمالي متوهج */}
                  {includeChandelier && showChandeliers && roomType !== 'hallway' && (
                    <div
                      className="absolute rounded-full border border-dashed flex items-center justify-center transition-all duration-300 pointer-events-none"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '46px',
                        height: '46px',
                        borderColor: showLights && brightness > 0 ? activeGlow.color : '#475569',
                        boxShadow: showLights && brightness > 0 ? `0 0 15px ${activeGlow.glow}` : 'none'
                      }}
                    >
                      {/* أيقونة الثريا SVG المتوهجة بنمط اللعبة الهندسية */}
                      <svg 
                        className="w-7 h-7 transition-all duration-300"
                        style={{
                          color: showLights && brightness > 0 ? activeGlow.color : '#475569',
                          filter: showLights && brightness > 0 ? `drop-shadow(0 0 6px ${activeGlow.glow})` : 'none'
                        }}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <path d="M12 2v20M17 5H7M19 9H5M21 13H3M12 2L8 6M12 2l4 4" />
                      </svg>
                    </div>
                  )}

                </div>

              </div>

              {/* عناصر التحكم في شدة الضوء واللون أسفل المخطط */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5 text-right">
                {/* لون وحرارة الإنارة */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-400">درجة حرارة اللون ولون النيون</span>
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

                {/* السطوع والتشغيل */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>شدة توهج الإنارة بالمخطط</span>
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
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold pt-0.5">
                    <button onClick={() => setShowLights(!showLights)} className="hover:text-white transition-colors">
                      {showLights ? '🔴 إطفاء الإنارة بالكامل' : '🟢 تشغيل الإنارة بالكامل'}
                    </button>
                    <span className="text-[9px] text-blue-400 font-normal">تتحرك الأضواء تلقائياً حسب مقاسات غرفتك</span>
                  </div>
                </div>
              </div>

              {/* الشرح الهندسي والتوضيح للمخطط */}
              <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 text-xs leading-relaxed text-slate-300 space-y-1 text-right">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-400" />
                  دليل المحاكاة الهندسي للفراغ:
                </h4>
                <p className="text-[11px] text-slate-400">
                  {ROOM_TEMPLATES[roomType].explanation}
                </p>
                <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/15 mt-2">
                  📐 **كيف تقرأ المخطط:** تمثل النقاط المتوهجة السبوتات، والخطوط تمثل الليد بروفايل. الخطوط المقطعة باللون الأحمر هي مسافات الأبعاد عن الجدران (Offset)، والخطوط الخضراء المقطعة هي مسافات التباعد البيني (Spacing) محسوبة لحظياً بدقة AutoCAD.
                </div>
              </div>

            </div>

            {/* بطاقة تقرير التوزيع الهندسي ونسخ التقرير */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl text-right space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5.5 h-5.5 text-emerald-400" />
                  <h2 className="text-lg font-black text-white">إرشادات التوزيع الهندسي الموصى بها</h2>
                </div>
              </div>

              {/* زر نسخ التقرير */}
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
                  <span>تم نسخ تقرير التوزيع الهندسي لتسليمه للكهربائي أو مهندس الديكور!</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
