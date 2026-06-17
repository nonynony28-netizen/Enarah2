import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calculator, Ruler, Lightbulb, Zap, Sparkles, Award,
  ArrowLeft, Compass, Clipboard, CheckCircle
} from 'lucide-react'

interface RoomTemplate {
  title: string;
  url: string;
  explanation: string;
  recommendedTemp: string;
  luxLevel: number;
}

// قوالب الغرف الحقيقية مع صور فوتوغرافية حقيقية 100% تعرض الإنارة الفعلية في السقف
const ROOM_TEMPLATES: Record<string, RoomTemplate> = {
  living: {
    title: 'صالة معيشة حديثة',
    url: '/images/living-preset.jpg', // الصورة الحقيقية التي أرسلها المستخدم وتظهر الإنارة الفعلية بالسقف
    explanation: 'تظهر الصورة صالة معيشة مجهزة بإنارة حقيقية: 3 خطوط ليد بروفايل مدمجة بالتوازي في السقف المستعار لإنارة عامة، مع إضاءة مخفية (Cove Light) دافئة تسقط من الجانب الأيسر لتنير الجدار بنعومة خلف الأريكة.',
    recommendedTemp: '3000K دافئ',
    luxLevel: 150
  },
  kitchen: {
    title: 'مطبخ مودرن عصري',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', // صورة حقيقية لمطبخ بإنارة فعلية
    explanation: 'مطبخ مجهز بإنارة حقيقية موزعة بشكل صحيح: سبوتات سقفية مركزة مباشرة فوق أسطح العمل والمجلى لتفادي الظلال أثناء إعداد الأطعمة، مع إضاءة ليد مخفية أسفل الخزائن العلوية.',
    recommendedTemp: '4000K طبيعي (شمسي)',
    luxLevel: 250
  },
  bedroom: {
    title: 'غرفة نوم هادئة',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', // صورة حقيقية لغرفة نوم
    explanation: 'غرفة نوم تعتمد على الإنارة الهادئة: سبوتات موزعة في زوايا الغرفة الأربعة بعيداً عن منطقة السرير لتفادي توهج العين، مع إضاءة مخفية دافئة تبعث على الهدوء والاسترخاء.',
    recommendedTemp: '3000K دافئ',
    luxLevel: 120
  },
  salon: {
    title: 'صالون / مجلس ضيوف',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80', // صورة حقيقية لصالون فخم
    explanation: 'مجلس ضيوف فخم يدمج مستويات متعددة: ثريات كريستالية فخمة في المنتصف كعنصر جمالي، محاطة بإضاءة مخفية في الجبس بورد لارتفاع بصري، مع سبوتات موجهة على اللوحات والديكورات الجدارية.',
    recommendedTemp: '3000K دافئ',
    luxLevel: 200
  },
  hallway: {
    title: 'ممر / موزع مدخل',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', // صورة حقيقية لممر بإنارة مدمجة
    explanation: 'ممر يحتوي على إنارة حقيقية ممتدة: خط ليد بروفايل غاطس يسير في منتصف السقف ليحدد اتجاه الحركة بوضوح وأناقة دون وهج بصري مزعج.',
    recommendedTemp: '3000K دافئ أو 4000K طبيعي',
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

  const [copiedText, setCopiedText] = useState(false);

  // الحسابات الهندسية بناءً على معايير لوكس (Lux) العالمية
  const area = parseFloat((length * width).toFixed(1));

  // الحصول على شدة الإنارة المطلوبة باللوكس
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
      ledProfileRecommendation = `ننصح بتأسيس خطوط ليد بروفايل في السقف بطول إجمالي ${ledLength} متر طولي، موزعة على شكل مسارات متوازية لتعطي إنارة عامة ناعمة.`;
    } else if (ceilingType === 'gypsum_perimeter') {
      ledLength = Math.round((length + width) * 2);
      ledProfileRecommendation = `ننصح بتأسيس شريط ليد مخفي (Cove Light) بطول ${ledLength} متر طولي، يلتف داخل الجيب الجبسي على أطراف الغرفة بالكامل لإنارة غير مباشرة غاية في الجمال.`;
    } else {
      ledProfileRecommendation = `السقف الخرساني المسطح لا يدعم تأسيس بروفايلات الليد الغاطسة. ننصحك باستخدام مسارات الإنارة المغناطيسية الظاهرة (Surface Magnetic Tracks) كبديل عصري سهل التركيب.`;
    }
  } else {
    ledProfileRecommendation = 'لم يتم تحديد شريط ليد أو بروفايل في حسابات الغرفة.';
  }

  // حجم الثريا المقترح بالسنتمتر
  const recommendedChandelierDiameter = includeChandelier && roomType !== 'hallway' ? Math.round((length + width) * 8) : 0;

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

  const activeRoomData = ROOM_TEMPLATES[roomType];

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
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group text-sm font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            العودة للرئيسية
          </Link>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            مستشار وحاسبة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.35)]">الإنارة الذكية</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            احسب أعداد ومقاسات ومسافات كشافات الإضاءة لغرفتك بدقة علمية وهندسية، وتصفح صوراً حقيقية 100% لأسقف الغرف الجاهزة المضاءة فعلياً بدون أي بطء أو استهلاك لموارد الهاتف!
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
                <label className="text-xs font-bold text-slate-400 block">اختر نوع الغرفة</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(ROOM_TEMPLATES) as Array<keyof typeof ROOM_TEMPLATES>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setRoomType(key)}
                      className={`py-2.5 px-2 rounded-xl font-bold text-xs transition-all border ${
                        roomType === key
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
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

              {/* عناصر الإنارة المشمولة */}
              <div className="pt-3 border-t border-white/5 space-y-2.5">
                <label className="text-xs font-bold text-slate-400 block">نوع الإضاءة المشمولة في الحساب</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setIncludeSpots(!includeSpots)}
                    className={`py-1.5 px-3 rounded-xl font-bold text-[11px] border transition-all ${
                      includeSpots ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    سبوت لايت
                  </button>
                  <button
                    onClick={() => setIncludeLed(!includeLed)}
                    className={`py-1.5 px-3 rounded-xl font-bold text-[11px] border transition-all ${
                      includeLed ? 'bg-sky-600/10 border-sky-500/30 text-sky-400' : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    ليد بروفايل / مخفي
                  </button>
                  <button
                    onClick={() => setIncludeChandelier(!includeChandelier)}
                    className={`py-1.5 px-3 rounded-xl font-bold text-[11px] border transition-all ${
                      includeChandelier ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    ثريا معلقة
                  </button>
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
                    <span className="text-2xl font-black">{recommendedChandelierDiameter > 0 ? recommendedChandelierDiameter : 'بدون'}</span>
                    <span className="text-[11px] font-bold">{recommendedChandelierDiameter > 0 ? 'سم' : ''}</span>
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
                  <span>تم نسخ التقرير الهندسي بنجاح لحفظه أو إرساله!</span>
                </div>
              )}

            </div>

          </div>

          {/* الجانب الأيسر (7 أعمدة): المعاينة المنظورية الواقعية بـ صور حقيقية 100% */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* لوحة العرض المنظورية والصور الحقيقية للأسقف المضاءة */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl text-right space-y-5">
              
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                <Layers className="w-5.5 h-5.5 text-blue-400" />
                <h2 className="text-lg font-black text-white">معرض الأسقف والإنارة الواقعية ({activeRoomData.title})</h2>
              </div>

              {/* صورة السقف الحقيقي 100% مع إنارة فعلية وليست محاكاة */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <img
                  src={activeRoomData.url}
                  alt={activeRoomData.title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                
                {/* بطاقة تعريفية توضح المخطط المطبق في الصورة */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4.5 h-4.5 text-amber-400" />
                    <span className="text-xs font-bold text-slate-300">الإنارة المقترحة لـ {activeRoomData.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    {activeRoomData.explanation}
                  </p>
                </div>
              </div>

              {/* التوضيح الفني الهندسي والربط مع الحسابات */}
              <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 text-xs leading-relaxed text-slate-300 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-400" />
                  الشرح الفني وتوجيه التوزيع:
                </h4>
                <p>
                  درجة حرارة اللون الموصى بها لهذا الفراغ هي **{activeRoomData.recommendedTemp}** لتعطي الارتياح البصري الملائم للنشاط.
                </p>
                <div className="text-[10px] text-blue-300 font-bold bg-blue-500/10 p-3 rounded-xl border border-blue-500/15">
                  💡 **ملاحظة معمارية:** الصورة المعروضة بالأعلى هي صورة فوتوغرافية حقيقية 100% تعرض التصميم والإنارة الفعلية المركبة في السقف. التقرير المحسوب على اليمين يعطيك الإرشادات الحسابية الدقيقة لتطبيق نفس الفكرة وتوزيع نفس القطع على مقاسات غرفتك الخاصة.
                </div>
              </div>

            </div>

            {/* نصائح هندسية عامة */}
            <div className="bg-[#0f213a]/50 border border-white/5 rounded-3xl p-6 text-sm text-slate-300 text-right space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
                نصائح هندسية لتأسيس وشراء الإنارة:
              </h4>
              <ul className="space-y-2 list-disc pr-5 leading-relaxed text-xs">
                <li>**درجة حرارة اللون:** يفضل اللون **الدافئ (3000K)** في المجالس وغرف النوم لإشاعة الهدوء والدفء، بينما يفضل اللون **الشمسي (4000K)** في المطابخ والمكاتب لراحة العين عند العمل.</li>
                <li>**مؤشر تجسيد الألوان (CRI):** احرص على شراء سبوتات ليد بمعامل تجسيد ألوان أعلى من **CRI 90** لتعكس ألوان الطعام والجدران والأثاث بشكلها الحقيقي دون بهتان.</li>
                <li>**زاوية انتشار الضوء (Beam Angle):** استخدم زاوية **24 درجة** للسبوتات الموجهة لتسليط الضوء على العناصر الديكورية، وزاوية **36 إلى 60 درجة** للإضاءة العامة المريحة.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
