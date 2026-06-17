import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Calculator, Ruler, Lightbulb, Zap, Sparkles, Award,
  ArrowLeft, Compass, Clipboard, CheckCircle, Eye, EyeOff, Info,
  Trash2, Plus, Sliders
} from 'lucide-react'

// ألوان درجات حرارة الضوء الفنية والنيون للمحاكاة ثلاثية الأبعاد
const TEMP_OPTIONS = {
  warm: {
    id: 'warm',
    label: 'شمسي دافئ (3000K)',
    color: '#fbbf24', // ذهبي دافئ
    glow: 'rgba(251, 191, 36, 0.6)',
    radial: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.05) 50%, transparent 100%)',
    description: 'إضاءة دافئة مريحة تعزز الهدوء والاسترخاء، مثالية لغرف النوم والمجالس.'
  },
  natural: {
    id: 'natural',
    label: 'أبيض طبيعي (4000K)',
    color: '#fef08a', // كريمي ناصع
    glow: 'rgba(254, 240, 138, 0.65)',
    radial: 'radial-gradient(circle, rgba(254, 240, 138, 0.45) 0%, rgba(254, 240, 138, 0.06) 50%, transparent 100%)',
    description: 'إضاءة نهارية معتدلة ومريحة للعين، ممتازة للصالات، الممرات والمذاكرة.'
  },
  cool: {
    id: 'cool',
    label: 'أبيض ثلجي (6500K)',
    color: '#e0f2fe', // أزرق ثلجي
    glow: 'rgba(224, 242, 254, 0.55)',
    radial: 'radial-gradient(circle, rgba(224, 242, 254, 0.4) 0%, rgba(224, 242, 254, 0.05) 50%, transparent 100%)',
    description: 'إضاءة بيضاء ناصعة وباردة توفر أعلى درجات الوضوح والنشاط، مثالية للمطابخ ومناطق العمل.'
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
    defaultTemp: 'cool' as const,
    luxLevel: 300
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
    defaultTemp: 'natural' as const,
    luxLevel: 100
  }
};

interface Fixture {
  id: string;
  type: 'spot' | 'led_h' | 'led_v' | 'chandelier' | 'sconce';
  x: number; // النسبة المئوية لعرض السقف
  y: number; // النسبة المئوية لطول السقف
  brightness: number; // 10% to 100%
  beamAngle?: 30 | 60; // للمحاكاة البصرية
}

export default function LightingDesigner() {
  // مدخلات حاسبة الإنارة الهندسية
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [roomType, setRoomType] = useState<keyof typeof ROOM_TEMPLATES>('living');
  const [ceilingType, setCeilingType] = useState<'gypsum_full' | 'gypsum_perimeter' | 'flat'>('gypsum_full');
  const [lightLevel, setLightLevel] = useState<'relax' | 'medium' | 'bright'>('medium');

  // خيارات وضع المحاكاة ثلاثي الأبعاد المبسط
  const [mode, setMode] = useState<'auto' | 'sandbox'>('auto');
  const [showLights, setShowLights] = useState(true);
  const [showBeams, setShowBeams] = useState(true);
  const [temp, setTemp] = useState<'warm' | 'natural' | 'cool'>('warm');
  const [brightness, setBrightness] = useState(80);

  // قائمة القطع المخصصة لوضع التصميم الحر (Sandbox)
  const [sandboxFixtures, setSandboxFixtures] = useState<Fixture[]>([]);
  const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<Fixture['type']>('spot');
  const [ledToolOrientation, setLedToolOrientation] = useState<'h' | 'v'>('h');

  const ceilingRef = useRef<HTMLDivElement>(null);
  const [copiedText, setCopiedText] = useState(false);

  // تحديث درجة لون الإضاءة الافتراضية مع نوع الغرفة
  useEffect(() => {
    setTemp(ROOM_TEMPLATES[roomType].defaultTemp);
  }, [roomType]);

  // الحسابات الهندسية الفنية للمساحة والأضواء التلقائية
  const area = parseFloat((length * width).toFixed(1));

  const getRequiredLux = () => {
    const baseLux = ROOM_TEMPLATES[roomType].luxLevel;
    if (lightLevel === 'relax') return Math.round(baseLux * 0.7);
    if (lightLevel === 'bright') return Math.round(baseLux * 1.4);
    return baseLux;
  };

  const reqLux = getRequiredLux();
  const totalLumensNeeded = Math.round(area * reqLux);

  // حساب توزيع السبوتات التلقائي
  const spotLumens = 560; // سبوت 7 واط LED ممتاز
  let autoSpotCount = 0;
  if (roomType !== 'hallway') {
    autoSpotCount = Math.ceil(totalLumensNeeded / spotLumens);
    // التناسق المعماري يتطلب عدداً زوجياً أو مضاعف لـ 4
    if (autoSpotCount % 2 !== 0 && autoSpotCount > 1) {
      autoSpotCount += 1;
    }
  } else {
    autoSpotCount = Math.max(2, Math.ceil(length / 1.5));
  }

  // حساب أطوال الليد التلقائية
  let autoLedLength = 0;
  if (ceilingType === 'gypsum_full') {
    autoLedLength = Math.round((length + width) * 0.8);
  } else if (ceilingType === 'gypsum_perimeter') {
    autoLedLength = Math.round((length + width) * 2);
  }

  const hasAutoChandelier = roomType !== 'hallway' && roomType !== 'kitchen';

  // صياغة قائمة قطع الوضع التلقائي ديناميكياً
  const getAutoFixtures = (): Fixture[] => {
    const list: Fixture[] = [];
    
    let cols = 2;
    let rows = 2;
    
    if (roomType === 'hallway') {
      cols = autoSpotCount;
      rows = 1;
    } else {
      if (autoSpotCount <= 2) {
        cols = 2; rows = 1;
      } else if (autoSpotCount <= 4) {
        cols = 2; rows = 2;
      } else if (autoSpotCount <= 6) {
        if (length >= width) { cols = 3; rows = 2; }
        else { cols = 2; rows = 3; }
      } else if (autoSpotCount <= 8) {
        if (length >= width) { cols = 4; rows = 2; }
        else { cols = 2; rows = 4; }
      } else {
        if (length >= width) { cols = 4; rows = 3; }
        else { cols = 3; rows = 4; }
      }
    }

    const spacingX = 100 / cols;
    const spacingY = 100 / rows;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        list.push({
          id: `auto_spot_${c}_${r}`,
          type: 'spot',
          x: spacingX * (c + 0.5),
          y: spacingY * (r + 0.5),
          brightness: 100,
          beamAngle: 60
        });
      }
    }

    if (hasAutoChandelier) {
      list.push({
        id: 'auto_chandelier_center',
        type: 'chandelier',
        x: 50,
        y: 50,
        brightness: 100
      });
    }

    if (autoLedLength > 0) {
      if (ceilingType === 'gypsum_full') {
        list.push({
          id: 'auto_led_h1',
          type: 'led_h',
          x: 50,
          y: 25,
          brightness: 100
        });
        list.push({
          id: 'auto_led_h2',
          type: 'led_h',
          x: 50,
          y: 75,
          brightness: 100
        });
      }
    }

    return list;
  };

  const handleCopyAutoToSandbox = () => {
    setSandboxFixtures(getAutoFixtures());
    setMode('sandbox');
    setSelectedFixtureId(null);
  };

  const activeFixtures = mode === 'auto' ? getAutoFixtures() : sandboxFixtures;

  const totalSpotsCount = activeFixtures.filter(f => f.type === 'spot').length;
  const totalChandelierCount = activeFixtures.filter(f => f.type === 'chandelier').length;
  const totalLedCount = activeFixtures.filter(f => f.type === 'led_h' || f.type === 'led_v').length;
  const totalSconceCount = activeFixtures.filter(f => f.type === 'sconce').length;

  const calculatedLumens = 
    (totalSpotsCount * spotLumens) + 
    (totalChandelierCount * 3200) + 
    (totalLedCount * 2000) +
    (totalSconceCount * 450);

  const currentLux = Math.round(calculatedLumens / area);

  const totalWatts = 
    (totalSpotsCount * 7) + 
    (totalChandelierCount * 40) + 
    (totalLedCount * 20) +
    (totalSconceCount * 5);

  const wattsPerSqm = totalWatts / area;

  const getEnergyClass = () => {
    if (wattsPerSqm < 4) return { label: 'A+++', color: 'bg-emerald-500 text-black', text: 'ممتاز جداً - استهلاك منخفض للغاية' };
    if (wattsPerSqm < 6) return { label: 'A+', color: 'bg-green-400 text-black', text: 'ممتاز - موفر فائق للطاقة' };
    if (wattsPerSqm < 9) return { label: 'B', color: 'bg-yellow-400 text-black', text: 'جيد جداً - إضاءة معتدلة' };
    if (wattsPerSqm < 12) return { label: 'C', color: 'bg-orange-400 text-black', text: 'متوسط الاستهلاك' };
    return { label: 'D', color: 'bg-red-500 text-white', text: 'مرتفع الاستهلاك - ننصح باستخدام كشافات LED ذات كفاءة أعلى' };
  };

  const energyRating = getEnergyClass();

  const getLuxEvaluation = () => {
    const pct = (currentLux / reqLux) * 100;
    if (pct < 75) return { status: 'under', label: 'إنارة خافتة (تحتاج كشافات إضافية) ⚠️', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' };
    if (pct > 140) return { status: 'over', label: 'إنارة مفرطة (توهج قوي زائد عن الحاجة) ⚠️', color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' };
    return { status: 'optimal', label: 'إنارة مثالية مطابقة للمعايير الهندسية والراحة البصرية ✅', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
  };

  const luxEval = getLuxEvaluation();

  const spacingRatioX = activeFixtures.filter(f => f.type === 'spot').length > 0 ? (length / Math.ceil(Math.sqrt(totalSpotsCount || 4))).toFixed(2) : '1.50';
  const idealWallDist = (parseFloat(spacingRatioX) / 2).toFixed(2);

  const handleCeilingClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'sandbox') return;
    if (!ceilingRef.current) return;

    const target = e.target as HTMLElement;
    if (target.closest('.fixture-node')) return;

    const rect = ceilingRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));

    const newFixture: Fixture = {
      id: `sandbox_${activeTool}_${Date.now()}`,
      type: activeTool === 'led_h' || activeTool === 'led_v' ? (ledToolOrientation === 'h' ? 'led_h' : 'led_v') : activeTool,
      x: parseFloat(xPct.toFixed(1)),
      y: parseFloat(yPct.toFixed(1)),
      brightness: 100,
      beamAngle: 60
    };

    setSandboxFixtures([...sandboxFixtures, newFixture]);
    setSelectedFixtureId(newFixture.id);
  };

  const handleDeleteFixture = (id: string) => {
    setSandboxFixtures(sandboxFixtures.filter(f => f.id !== id));
    if (selectedFixtureId === id) {
      setSelectedFixtureId(null);
    }
  };

  const handleUpdateFixture = (id: string, updates: Partial<Fixture>) => {
    setSandboxFixtures(sandboxFixtures.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleClearSandbox = () => {
    setSandboxFixtures([]);
    setSelectedFixtureId(null);
  };

  const maxDim = Math.max(length, width);
  const scale = 250 / maxDim;
  const boxWidth = width * scale;
  const boxLength = length * scale;
  const boxHeight = 150;

  const activeGlow = TEMP_OPTIONS[temp];

  const generateReportText = () => {
    const roomName = ROOM_TEMPLATES[roomType].title;
    const ceilingName = 
      ceilingType === 'gypsum_full' ? 'جبس مستعار كامل' : 
      ceilingType === 'gypsum_perimeter' ? 'جبس أطراف (ديكور كوف مخفي)' : 'سقف عادي مسطح';

    const brightnessName = 
      lightLevel === 'relax' ? 'هادئة ومريحة' : 
      lightLevel === 'medium' ? 'طبيعية ومعتدلة' : 'قوية وممتازة للعمل';

    const designModeText = mode === 'auto' ? 'توزيع هندسي تلقائي (Auto-CAD)' : 'توزيع مخصص حر (Creative Sandbox)';

    return `📊 تقرير تصميم وتوزيع الإنارة ثلاثي الأبعاد لغرفتك:\n` +
      `----------------------------------------\n` +
      `- الغرفة: ${roomName} (${length}م × ${width}م)\n` +
      `- المساحة الكلية: ${area} م²\n` +
      `- نوع السقف المعين: ${ceilingName}\n` +
      `- وضع التوزيع: ${designModeText}\n` +
      `- النمط المفضل: ${brightnessName}\n` +
      `- درجة لون الإضاءة: ${activeGlow.label}\n\n` +
      `💡 التوزيع الهندسي للقطع بالملخص:\n` +
      `- كشافات سبوت لايت: ${totalSpotsCount} قطع (قوة 7 واط للقطعة)\n` +
      `- شريط ليد / بروفايل: ${totalLedCount} خطوط\n` +
      `- ثريات معلقة بالمنتصف: ${totalChandelierCount} قطع\n` +
      `- كشافات جدارية (Sconces): ${totalSconceCount} قطع\n\n` +
      `📐 القراءات الهندسية ومعدلات الطاقة:\n` +
      `- إجمالي الوات المستهلك: ${totalWatts} واط\n` +
      `- الكثافة الكهربائية: ${wattsPerSqm.toFixed(2)} واط/م²\n` +
      `- فئة كفاءة الطاقة (SASO): فئة [ ${energyRating.label} ] - ${energyRating.text}\n` +
      `- شدة الضوء الناتجة: ${currentLux} Lux (المطلوب هندسياً: ${reqLux} Lux)\n` +
      `- التقييم العام: ${luxEval.label}\n\n` +
      `📐 إرشادات التركيب ومسافات التباعد المقترحة:\n` +
      `- تباعد الكشافات الأفقي: يُفضل الحفاظ على مسافة تقارب ${spacingRatioX}م بين الكشافات.\n` +
      `- مسافة الحائط الجانبية: يُنصح بترك مسافة ${idealWallDist}م بين الكشاف الأول والجدار لحماية عينيك وتجنب التوهج.\n\n` +
      `تم استخلاص هذا التقرير عبر المحاكي الهندسي ثلاثي الأبعاد لمؤسسة الإنارة المتميزة.`;
  };

  const handleCopyToClipboard = () => {
    const reportText = generateReportText();
    navigator.clipboard.writeText(reportText).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    });
  };

  const selectedFixture = activeFixtures.find(f => f.id === selectedFixtureId);

  return (
    <div className="min-h-screen bg-[#040e1f] text-slate-100 py-20 px-4 sm:px-6 lg:px-8 relative font-sans overflow-hidden" dir="rtl">
      
      {/* شبكة النيون الخلفية */}
      <div 
        className="absolute inset-0 z-0 bg-[size:40px_40px] opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)' 
        }} 
      />
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* الترويسة الرئيسية */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-4 group text-xs font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            العودة للرئيسية
          </Link>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-3 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-300">أداة محاكاة تفاعلية خفيفة وسريعة</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight leading-tight">
            🎮 هولوجرام الإنارة 3D:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.35)]">
              المحاكي الهندسي التفاعلي لتوزيع إضاءة بيتك
            </span>
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
            صمّم، وزّع، واختبر إنارة غرفتك بالكامل بنظام ثلاثي الأبعاد نيون وخفيف الوزن. احسب شدة الإضاءة ومسافات التباعد بدقة كاد هندسية، وتأكد من كفاءة استهلاك الكهرباء مجاناً!
          </p>
        </div>

        {/* جسم الأداة */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* الجانب الأيمن (5 أعمدة): مدخلات الحاسبة وخيارات الديكور */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* بطاقة مدخلات الحاسبة والديكور */}
            <div className="bg-[#0b1930]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl space-y-5 flex-1">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-5.5 h-5.5 text-blue-400" />
                  <h2 className="text-md font-black text-white">إعدادات الديكور والمساحة</h2>
                </div>
              </div>

              {/* اختيار الغرفة */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">نوع الغرفة أو الفراغ</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(ROOM_TEMPLATES) as Array<keyof typeof ROOM_TEMPLATES>).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setRoomType(key);
                        if (mode === 'sandbox') {
                          if (confirm('تغيير الغرفة سيقوم بإعادة تعيين المخطط الحالي. هل تود المتابعة؟')) {
                            setSandboxFixtures([]);
                            setSelectedFixtureId(null);
                          }
                        }
                      }}
                      className={`py-2 px-1 rounded-xl font-bold text-xs transition-all border ${
                        roomType === key
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {ROOM_TEMPLATES[key].title}
                    </button>
                  ))}
                </div>
              </div>

              {/* أبعاد الغرفة */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 flex justify-between">
                    <span>طول الغرفة (متر)</span>
                    <span className="text-blue-400 font-mono font-bold">{length} م</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    step="0.5"
                    value={length}
                    onChange={(e) => {
                      setLength(parseFloat(e.target.value));
                      if (mode === 'sandbox') setSelectedFixtureId(null);
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 flex justify-between">
                    <span>عرض الغرفة (متر)</span>
                    <span className="text-blue-400 font-mono font-bold">{width} م</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={width}
                    onChange={(e) => {
                      setWidth(parseFloat(e.target.value));
                      if (mode === 'sandbox') setSelectedFixtureId(null);
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

              {/* نوع السقف الجبسي */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">ديكور السقف المعين</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gypsum_full', label: 'جبس كامل', desc: 'ليد غاطس' },
                    { id: 'gypsum_perimeter', label: 'جبس أطراف', desc: 'إنارة مخفية' },
                    { id: 'flat', label: 'سقف مستوٍ', desc: 'لطش ظاهرة' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCeilingType(type.id as any)}
                      className={`py-2 px-1 rounded-xl font-bold transition-all border flex flex-col items-center gap-0.5 ${
                        ceilingType === type.id
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs">{type.label}</span>
                      <span className="text-[9px] text-slate-400 font-normal">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* قوة السطوع المفضل */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">شدة الإضاءة المفضلة</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'relax', label: 'هادئة واسترخاء' },
                    { id: 'medium', label: 'طبيعية معتدلة' },
                    { id: 'bright', label: 'قوية وعملية' }
                  ].map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setLightLevel(level.id as any)}
                      className={`py-2 px-1 rounded-xl font-bold text-xs transition-all border ${
                        lightLevel === level.id
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* لون الإنارة المطلوبة */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <label className="text-xs font-bold text-slate-400 block">لون وحرارة إضاءة الكشافات</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(TEMP_OPTIONS) as Array<keyof typeof TEMP_OPTIONS>).map((key) => {
                    const opt = TEMP_OPTIONS[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setTemp(key)}
                        className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                          temp === key
                            ? 'bg-blue-600/10 border-blue-400 text-white scale-[1.02]'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: opt.color }} />
                          {opt.label.split(' ')[0]}
                        </span>
                        <span className="text-[8px] text-slate-400 font-normal">{opt.label.split(' ')[1]}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                  💡 <span className="font-bold text-blue-400">توصية المصمم:</span> {TEMP_OPTIONS[temp].description}
                </p>
              </div>

              {/* أداة الاختيار السريع للوضع التلقائي واليدوي */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">طريقة توزيع الإنارة في السقف</span>
                  <span className="text-[10px] text-slate-400 font-bold bg-white/5 px-2 py-0.5 rounded-md">
                    {mode === 'auto' ? 'تلقائي CAD' : 'تصميم حر'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode('auto')}
                    className={`py-2.5 px-2 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-1.5 ${
                      mode === 'auto'
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>تلقائي ذكي (CAD)</span>
                  </button>
                  <button
                    onClick={handleCopyAutoToSandbox}
                    className={`py-2.5 px-2 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-1.5 ${
                      mode === 'sandbox'
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>تعديل يدوي (ساندبوكس)</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* الجانب الأيسر (7 أعمدة): محاكي الهولوجرام ثلاثي الأبعاد والـ HUD */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            {/* حاوية المحاكي ثلاثي الأبعاد */}
            <div className="bg-[#0b1930]/90 backdrop-blur-md border border-white/5 rounded-3xl p-5 shadow-2xl text-right space-y-4 flex flex-col justify-between relative">
              
              {/* ترويسة المحاكي المدمجة */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-400" />
                  <h2 className="text-sm font-black text-white">محاكي السقف هولوجرام 3D (Ceiling Light Volumetrics)</h2>
                </div>
                
                {/* مفاتيح عرض المخطط السريعة */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowLights(!showLights)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      showLights ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 font-bold' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {showLights ? '💡 تشغيل الضوء' : '🔌 إطفاء'}
                  </button>
                  <button
                    onClick={() => setShowBeams(!showBeams)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      showBeams ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 font-bold' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {showBeams ? '📐 مخاريط 3D' : '📐 إخفاء المخاريط'}
                  </button>
                </div>
              </div>

              {/* أدوات المحاكاة الحرة (Sandbox Palette) */}
              {mode === 'sandbox' && (
                <div className="bg-[#050e1f] p-3 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>لوحة القطع (اختر قطعة ثم انقر على السقف في الأعلى لإضافتها)</span>
                    <button 
                      onClick={handleClearSandbox}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[10px] font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>مسح المخطط</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'spot', label: '🎯 سبوت لايت', desc: 'كشاف 7 واط' },
                      { id: 'led_h', label: '⚡ ليد بروفايل', desc: 'شريط ممتد' },
                      { id: 'chandelier', label: '⚜️ ثريا معلقة', desc: 'للمنتصف' },
                      { id: 'sconce', label: '💡 كشاف جداري', desc: 'إنارة موجهة' }
                    ].map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setActiveTool(tool.id as any);
                          if (tool.id === 'led_h') {
                            setLedToolOrientation(ledToolOrientation === 'h' ? 'v' : 'h');
                          }
                        }}
                        className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center justify-center text-center ${
                          activeTool === tool.id
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{tool.label}</span>
                        <span className="text-[8px] text-slate-400 font-normal">
                          {tool.id === 'led_h' 
                            ? `اتجاه: ${ledToolOrientation === 'h' ? 'أفقي' : 'عمودي'}` 
                            : tool.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* مشهد المحاكي ثلاثي الأبعاد المسرع (3D Viewport) - ثابت بدون تحريك */}
              <div 
                className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#020712] border border-blue-500/20 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-6 select-none"
                style={{ perspective: '900px' }}
              >
                
                {/* الغرفة ثلاثية الأبعاد الثابتة (Static 3D Wireframe Room Box) */}
                <div 
                  className="relative origin-center"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(55deg) rotateZ(-35deg)', // زاوية ثابتة مريحة جداً وهندسية
                    width: `${boxWidth}px`,
                    height: `${boxLength}px`,
                  }}
                >
                  
                  {/* 1. المستوى الأرضي للغرفة (Floor plane) */}
                  <div 
                    className="absolute inset-0 bg-[#061124] border-2 border-blue-500/40 rounded"
                    style={{
                      transform: 'translateZ(0px)',
                      backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.2) inset'
                    }}
                  >
                    
                    {/* إسقاط بقع الإضاءة على الأرض */}
                    {showLights && brightness > 0 && activeFixtures.map((fix) => {
                      const showBeamColor = activeGlow.color;
                      const showBeamRadial = activeGlow.radial;

                      if (fix.type === 'spot') {
                        return (
                          <div 
                            key={`wash_${fix.id}`}
                            className="absolute rounded-full pointer-events-none mix-blend-screen"
                            style={{
                              left: `${fix.x}%`,
                              top: `${fix.y}%`,
                              transform: 'translate(-50%, -50%) translateZ(1px)',
                              width: `${(fix.beamAngle === 30 ? 50 : 90) * (brightness / 100)}px`,
                              height: `${(fix.beamAngle === 30 ? 50 : 90) * (brightness / 100)}px`,
                              background: showBeamRadial,
                              filter: 'blur(4px)',
                              opacity: (fix.brightness / 100) * 0.85
                            }}
                          />
                        );
                      }

                      if (fix.type === 'chandelier') {
                        return (
                          <div 
                            key={`wash_${fix.id}`}
                            className="absolute rounded-full pointer-events-none mix-blend-screen"
                            style={{
                              left: `${fix.x}%`,
                              top: `${fix.y}%`,
                              transform: 'translate(-50%, -50%) translateZ(1px)',
                              width: '180px',
                              height: '180px',
                              background: showBeamRadial,
                              filter: 'blur(6px)',
                              opacity: 0.9
                            }}
                          />
                        );
                      }

                      if (fix.type === 'led_h') {
                        return (
                          <div 
                            key={`wash_${fix.id}`}
                            className="absolute pointer-events-none mix-blend-screen rounded-full"
                            style={{
                              left: `${fix.x}%`,
                              top: `${fix.y}%`,
                              transform: 'translate(-50%, -50%) translateZ(1px)',
                              width: '80%',
                              height: '35px',
                              background: `radial-gradient(ellipse at center, ${showBeamColor}33 0%, transparent 70%)`,
                              filter: 'blur(8px)',
                              opacity: 0.7
                            }}
                          />
                        );
                      }

                      if (fix.type === 'led_v') {
                        return (
                          <div 
                            key={`wash_${fix.id}`}
                            className="absolute pointer-events-none mix-blend-screen rounded-full"
                            style={{
                              left: `${fix.x}%`,
                              top: `${fix.y}%`,
                              transform: 'translate(-50%, -50%) translateZ(1px)',
                              width: '35px',
                              height: '80%',
                              background: `radial-gradient(ellipse at center, ${showBeamColor}33 0%, transparent 70%)`,
                              filter: 'blur(8px)',
                              opacity: 0.7
                            }}
                          />
                        );
                      }

                      return null;
                    })}

                  </div>

                  {/* 2. الأعمدة الركنية السلكية */}
                  <div className="absolute w-[1px] bg-blue-500/30" style={{ left: 0, top: 0, height: `${boxHeight}px`, transform: 'rotateX(-90deg)', transformOrigin: 'top center' }} />
                  <div className="absolute w-[1px] bg-blue-500/30" style={{ right: 0, top: 0, height: `${boxHeight}px`, transform: 'rotateX(-90deg)', transformOrigin: 'top center' }} />
                  <div className="absolute w-[1px] bg-blue-500/30" style={{ left: 0, bottom: 0, height: `${boxHeight}px`, transform: 'rotateX(-90deg)', transformOrigin: 'top center' }} />
                  <div className="absolute w-[1px] bg-blue-500/30" style={{ right: 0, bottom: 0, height: `${boxHeight}px`, transform: 'rotateX(-90deg)', transformOrigin: 'top center' }} />

                  {/* 3. مخاريط الإضاءة ثلاثية الأبعاد المتقاطعة */}
                  {showLights && showBeams && brightness > 0 && activeFixtures.map((fix) => {
                    if (fix.type === 'spot') {
                      const is30Deg = fix.beamAngle === 30;
                      const beamDiameter = is30Deg ? 60 : 110;
                      return (
                        <div 
                          key={`cone_${fix.id}`}
                          className="absolute pointer-events-none"
                          style={{
                            left: `${fix.x}%`,
                            top: `${fix.y}%`,
                            transform: `translateZ(${boxHeight}px)`,
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          {/* لوح 1: مستوي YZ */}
                          <div 
                            className="absolute pointer-events-none"
                            style={{
                              width: `${beamDiameter}px`,
                              height: `${boxHeight}px`,
                              left: '0px',
                              top: '0px',
                              transform: 'translate(-50%, 0px) rotateX(90deg)',
                              transformOrigin: '50% 0%',
                              mixBlendMode: 'screen',
                              opacity: (fix.brightness / 100) * 0.4
                            }}
                          >
                            <svg width="100%" height="100%" viewBox={`0 0 ${beamDiameter} ${boxHeight}`} preserveAspectRatio="none">
                              <defs>
                                <linearGradient id={`grad_cone_${fix.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor={activeGlow.color} stopOpacity={0.8} />
                                  <stop offset="25%" stopColor={activeGlow.color} stopOpacity={0.4} />
                                  <stop offset="100%" stopColor={activeGlow.color} stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <polygon points={`${beamDiameter/2 - 4},0 ${beamDiameter/2 + 4},0 ${beamDiameter},${boxHeight} 0,${boxHeight}`} fill={`url(#grad_cone_${fix.id})`} />
                            </svg>
                          </div>
                          
                          {/* لوح 2: XZ */}
                          <div 
                            className="absolute pointer-events-none"
                            style={{
                              width: `${beamDiameter}px`,
                              height: `${boxHeight}px`,
                              left: '0px',
                              top: '0px',
                              transform: 'translate(-50%, 0px) rotateX(90deg) rotateY(90deg)',
                              transformOrigin: '50% 0%',
                              mixBlendMode: 'screen',
                              opacity: (fix.brightness / 100) * 0.4
                            }}
                          >
                            <svg width="100%" height="100%" viewBox={`0 0 ${beamDiameter} ${boxHeight}`} preserveAspectRatio="none">
                              <polygon points={`${beamDiameter/2 - 4},0 ${beamDiameter/2 + 4},0 ${beamDiameter},${boxHeight} 0,${boxHeight}`} fill={`url(#grad_cone_${fix.id})`} />
                            </svg>
                          </div>
                        </div>
                      );
                    }
                    
                    if (fix.type === 'chandelier') {
                      const beamDiameter = 170;
                      return (
                        <div 
                          key={`cone_${fix.id}`}
                          className="absolute pointer-events-none"
                          style={{
                            left: `${fix.x}%`,
                            top: `${fix.y}%`,
                            transform: `translateZ(${boxHeight}px)`,
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          <div 
                            className="absolute pointer-events-none"
                            style={{
                              width: `${beamDiameter}px`,
                              height: `${boxHeight}px`,
                              transform: 'translate(-50%, 0px) rotateX(90deg)',
                              transformOrigin: '50% 0%',
                              mixBlendMode: 'screen',
                              opacity: 0.3
                            }}
                          >
                            <svg width="100%" height="100%" viewBox={`0 0 ${beamDiameter} ${boxHeight}`} preserveAspectRatio="none">
                              <polygon points={`${beamDiameter/2 - 10},0 ${beamDiameter/2 + 10},0 ${beamDiameter},${boxHeight} 0,${boxHeight}`} fill={activeGlow.color} fillOpacity="0.4" />
                            </svg>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}

                  {/* 4. مستوى سقف الغرفة المعلق (Ceiling Plane) */}
                  <div 
                    ref={ceilingRef}
                    onClick={handleCeilingClick}
                    className="absolute inset-0 bg-[#0f213a]/15 border-2 border-blue-500/50 rounded"
                    style={{
                      transform: `translateZ(${boxHeight}px)`,
                      backgroundImage: 'linear-gradient(to right, rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      cursor: mode === 'sandbox' ? 'crosshair' : 'default',
                    }}
                  >
                    
                    {/* رندرة خطوط ليد بروفايل في السقف */}
                    {activeFixtures.filter(f => f.type === 'led_h' || f.type === 'led_v').map((led) => {
                      const isHorizontal = led.type === 'led_h';
                      const showBeamColor = activeGlow.color;
                      return (
                        <div 
                          key={led.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFixtureId(led.id);
                          }}
                          className={`absolute fixture-node rounded-full ${
                            selectedFixtureId === led.id ? 'ring-2 ring-red-500' : ''
                          }`}
                          style={{
                            left: `${led.x}%`,
                            top: `${led.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: isHorizontal ? '75%' : '6px',
                            height: isHorizontal ? '6px' : '75%',
                            backgroundColor: showLights ? showBeamColor : '#475569',
                            boxShadow: showLights ? `0 0 10px ${activeGlow.glow}, 0 0 4px ${showBeamColor}` : 'none',
                            cursor: 'pointer',
                            borderRadius: '3px'
                          }}
                        />
                      );
                    })}

                    {/* رندرة السبوت لايت كعناصر نيون متوهجة */}
                    {activeFixtures.filter(f => f.type === 'spot').map((spot) => {
                      const showBeamColor = activeGlow.color;
                      return (
                        <div 
                          key={spot.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFixtureId(spot.id);
                          }}
                          className={`absolute fixture-node rounded-full flex items-center justify-center ${
                            selectedFixtureId === spot.id ? 'ring-2 ring-red-500 scale-110' : ''
                          }`}
                          style={{
                            left: `${spot.x}%`,
                            top: `${spot.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#071224',
                            border: `2.5px solid ${showLights ? showBeamColor : '#475569'}`,
                            boxShadow: showLights ? `0 0 8px ${activeGlow.glow}` : 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: showLights ? showBeamColor : '#475569',
                              boxShadow: showLights ? `0 0 4px ${showBeamColor}` : 'none',
                            }}
                          />
                        </div>
                      );
                    })}

                    {/* رندرة الثريا المعلقة في السقف */}
                    {activeFixtures.filter(f => f.type === 'chandelier').map((ch) => {
                      const showBeamColor = activeGlow.color;
                      return (
                        <div 
                          key={ch.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFixtureId(ch.id);
                          }}
                          className={`absolute fixture-node flex flex-col items-center pointer-events-auto ${
                            selectedFixtureId === ch.id ? 'scale-105' : ''
                          }`}
                          style={{
                            left: `${ch.x}%`,
                            top: `${ch.y}%`,
                            transform: 'translate(-50%, 0%)',
                            cursor: 'pointer'
                          }}
                        >
                          {/* سلك التعليق المعلق لأسفل */}
                          <div className="w-[1.5px] h-[35px] bg-slate-400" />
                          
                          {/* جسم الثريا */}
                          <div 
                            className="w-[32px] h-[32px] rounded-full border flex items-center justify-center bg-[#071224]"
                            style={{
                              borderColor: showLights ? showBeamColor : '#475569',
                              boxShadow: showLights ? `0 0 15px ${activeGlow.glow}` : 'none',
                            }}
                          >
                            <svg 
                              className="w-5 h-5"
                              style={{
                                color: showLights ? showBeamColor : '#475569',
                              }}
                              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            >
                              <path d="M12 2v20M17 5H7M19 9H5M21 13H3M12 2L8 6M12 2l4 4" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}

                    {/* رندرة الكشاف الجداري */}
                    {activeFixtures.filter(f => f.type === 'sconce').map((sc) => {
                      const showBeamColor = activeGlow.color;
                      return (
                        <div 
                          key={sc.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFixtureId(sc.id);
                          }}
                          className={`absolute fixture-node flex items-center justify-center ${
                            selectedFixtureId === sc.id ? 'ring-2 ring-red-500 scale-110' : ''
                          }`}
                          style={{
                            left: `${sc.x}%`,
                            top: `${sc.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '10px',
                            height: '10px',
                            backgroundColor: showLights ? showBeamColor : '#475569',
                            boxShadow: showLights ? `0 0 10px ${activeGlow.glow}` : 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        />
                      );
                    })}

                  </div>

                </div>

              </div>

              {/* خيارات التحكم بالقطعة المحددة */}
              {mode === 'sandbox' && selectedFixture && (
                <div className="bg-[#050e1f] border border-red-500/25 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
                  <div className="space-y-1 w-full sm:w-auto">
                    <span className="text-xs font-bold text-red-400 block">العنصر المحدد: {
                      selectedFixture.type === 'spot' ? '🎯 سبوت لايت' :
                      selectedFixture.type === 'chandelier' ? '⚜️ ثريا معلقة' :
                      selectedFixture.type === 'sconce' ? '💡 كشاف جداري' : '⚡ ليد بروفايل'
                    }</span>
                    <span className="text-[10px] text-slate-400 font-mono">الإحداثيات الحالية: X={selectedFixture.x}% | Y={selectedFixture.y}%</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                    {selectedFixture.type === 'spot' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">زاوية الشعاع:</span>
                        <button
                          onClick={() => handleUpdateFixture(selectedFixture.id, { beamAngle: selectedFixture.beamAngle === 30 ? 60 : 30 })}
                          className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white hover:bg-white/10"
                        >
                          {selectedFixture.beamAngle === 30 ? '30° ضيق 🎯' : '60° عريض 🌊'}
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">السطوع:</span>
                      <input 
                        type="range" 
                        min="20" 
                        max="100" 
                        step="20"
                        value={selectedFixture.brightness}
                        onChange={(e) => handleUpdateFixture(selectedFixture.id, { brightness: parseInt(e.target.value) })}
                        className="w-20 accent-blue-500 hover:accent-blue-400"
                      />
                      <span className="text-[10px] text-white font-mono">{selectedFixture.brightness}%</span>
                    </div>

                    <button
                      onClick={() => handleDeleteFixture(selectedFixture.id)}
                      className="p-1.5 bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600/20 rounded-xl transition-all"
                      title="حذف القطعة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* لوحة تحليلات الـ HUD والتشخيصات الهندسية */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-right">
                
                {/* 1. تقييم شدة الإنارة */}
                <div className="bg-[#050e1f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">شدة الإنارة الناتجة</span>
                    <span className="font-mono text-blue-400 font-bold">{currentLux} Lux</span>
                  </div>
                  
                  {/* شريط التشخيص */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        luxEval.status === 'under' ? 'bg-amber-400' :
                        luxEval.status === 'over' ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (currentLux / Math.max(1, reqLux)) * 70)}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-slate-400 font-medium">
                    المستهدف هندسياً: <span className="text-white font-mono">{reqLux} Lux</span>
                    <div className="mt-1 font-bold text-slate-300">{luxEval.label}</div>
                  </div>
                </div>

                {/* 2. كفاءة استهلاك الكهرباء */}
                <div className="bg-[#050e1f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">القدرة الكهربائية الكلية</span>
                    <span className="font-mono text-emerald-400 font-bold">{totalWatts} واط</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`px-2.5 py-0.5 rounded text-xs font-black ${energyRating.color}`}>
                      فئة {energyRating.label}
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold">({wattsPerSqm.toFixed(1)} واط/م²)</span>
                  </div>

                  <div className="text-[10px] text-slate-400 leading-tight">
                    {energyRating.text}
                  </div>
                </div>

                {/* 3. تفاصيل القطع الموزعة */}
                <div className="bg-[#050e1f] p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between gap-1.5 text-xs text-slate-300">
                  <span className="text-slate-400 block text-[10px] pb-1 border-b border-white/5">القطع الحالية بالسقف</span>
                  <div className="flex justify-between">
                    <span>🎯 عدد السبوت لايت:</span>
                    <span className="font-mono text-white font-bold">{totalSpotsCount} كشاف</span>
                  </div>
                  <div className="flex justify-between">
                    <span>⚡ عدد خطوط الليد:</span>
                    <span className="font-mono text-white font-bold">{totalLedCount} خط</span>
                  </div>
                  <div className="flex justify-between">
                    <span>⚜️ الثريا المعلقة:</span>
                    <span className="font-mono text-white font-bold">{totalChandelierCount} قطعة</span>
                  </div>
                  {totalSconceCount > 0 && (
                    <div className="flex justify-between">
                      <span>💡 كشافات جدارية:</span>
                      <span className="font-mono text-white font-bold">{totalSconceCount} قطعة</span>
                    </div>
                  )}
                </div>

              </div>

              {/* إرشادات المسافات وتوزيع الكاد الهندسي */}
              <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 text-xs leading-relaxed text-slate-300 space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-400" />
                  دليل وإرشادات التباعد الهندسي (CAD):
                </h4>
                <p className="text-[11px] text-slate-400">
                  حسابات المسافات مستخلصة وفق أبعاد الغرفة الحالية ({length}م × {width}م):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[11px]">
                  <div className="text-emerald-400 font-bold">
                    📐 مسافة التباعد الأفقي الموصى بها: {spacingRatioX} متر.
                  </div>
                  <div className="text-blue-300 font-bold">
                    📐 مسافة الجدار الآمنة (Offset): {idealWallDist} متر لتجنب توهج الجدران.
                  </div>
                </div>
              </div>

            </div>

            {/* بطاقة نسخ التقرير الفني ومشاركة النتائج */}
            <div className="bg-[#0b1930]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-md font-black text-white">إصدار تقرير التوزيع الفني للمخطط</h2>
                </div>
              </div>

              <button
                onClick={handleCopyToClipboard}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-black text-sm md:text-base transition-all shadow-[0_0_15px_rgba(59,130,246,0.35)] hover:scale-[1.01] active:scale-[0.99]"
              >
                <Clipboard className="w-5 h-5" />
                <span>نسخ تقرير التوزيع الفني كرسالة نصية</span>
              </button>

              {copiedText && (
                <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span>تم نسخ التقرير بنجاح! يمكنك مشاركته مع الكهربائي أو مهندس الديكور مباشرة.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
