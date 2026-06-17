import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator, Ruler, Lightbulb, Zap, Sparkles, Award,
  MessageCircle, CheckCircle, ArrowLeft, Layers, Compass, Clipboard, HelpCircle
} from 'lucide-react'

// الفئات والسيناريوهات الضوئية الجاهزة للتوهج الفوري
const SCENARIO_ROOMS = {
  living: {
    title: 'صالة معيشة حديثة',
    description: 'مساحة معيشة عصرية تحتاج لسيناريوهات إضاءة تجمع بين الاسترخاء والأنشطة اليومية.',
    scenarios: [
      { id: 'cove', label: '1. الإنارة المخفية (Cove Light)', url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80', desc: 'إضاءة غير مباشرة ناعمة تضفي دفئاً وهدوءاً وتقلل من إجهاد العين أثناء مشاهدة التلفاز.' },
      { id: 'spots', label: '2. سبوت لايت فقط (Spotlights)', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', desc: 'إضاءة مركزة بزوايا مدروسة لتسليط الضوء على اللوحات، الديكورات الجدارية، وقطع الأثاث.' },
      { id: 'led', label: '3. ليد بروفايل فقط (LED Profile)', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', desc: 'خطوط إضاءة هندسية حديثة ممتدة تمنح السقف مظهراً مستقبلياً وتزيد الارتفاع البصري للمكان.' },
      { id: 'all', label: '4. الإنارة الكاملة (All Lights On)', url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80', desc: 'تشغيل جميع المصادر معاً (المخفي، الليد بروفايل، السبوتات) لإنتاج إضاءة ساطعة ومتكاملة الأبعاد.' },
    ]
  },
  kitchen: {
    title: 'مطبخ مودرن عصري',
    description: 'مساحة عمل مخصصة تتطلب إضاءة عالية لسهولة العمل وتجهيز الطعام بأمان ودقة.',
    scenarios: [
      { id: 'cove', label: '1. إضاءة الخزائن (Cabinet Wash)', url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1200&q=80', desc: 'إضاءة مخفية تحت الخزائن العلوية تسقط مباشرة على سطح العمل لمنع تشكل الظلال أثناء الطهي.' },
      { id: 'spots', label: '2. سبوت لايت فقط (Spotlights)', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', desc: 'كشافات سقفية موزعة بانتظام للإضاءة العامة لضمان رؤية جيدة في أرجاء المطبخ.' },
      { id: 'all', label: '3. الإنارة الكاملة (Full Illumination)', url: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=1200&q=80', desc: 'دمج إضاءة الخزائن والسبوتات لتغطية المساحة بإنارة عمل عامة وخاصة ممتازة.' },
    ]
  },
  bedroom: {
    title: 'غرفة نوم هادئة',
    description: 'ملاذ الراحة والاسترخاء، تعتمد على التدرج والنعومة في توزيع العناصر الضوئية.',
    scenarios: [
      { id: 'cove', label: '1. خلفية السرير (Accent Glow)', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80', desc: 'توهج دافئ غير مباشر خلف ظهر السرير يبعث على الراحة النفسية التامة ويساعد على النوم.' },
      { id: 'spots', label: '2. سبوتات الزوايا (Corner Spots)', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', desc: 'سبوتات خافتة موزعة في الزوايا وبعيداً عن مستوى السرير لتفادي التوهج المزعج للعين.' },
      { id: 'all', label: '3. الإنارة الكاملة (Full Illumination)', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80', desc: 'تشغيل كافة العناصر لتهيئة الغرفة للقراءة أو تنسيق الملابس برؤية واضحة وطبيعية.' },
    ]
  }
};

export default function LightingDesigner() {
  // حالات الحاسبة
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [roomUse, setRoomUse] = useState<keyof typeof SCENARIO_ROOMS | 'salon' | 'hallway'>('living');
  const [ceilingType, setCeilingType] = useState<'gypsum_full' | 'gypsum_perimeter' | 'flat'>('gypsum_full');
  const [lightLevel, setLightLevel] = useState<'relax' | 'medium' | 'bright'>('medium');

  // حالات مقارن السيناريوهات
  const [activeRoom, setActiveRoom] = useState<keyof typeof SCENARIO_ROOMS>('living');
  const [activeScenarioId, setActiveScenarioId] = useState<string>('all');
  const [copiedText, setCopiedText] = useState(false);

  // تحميل مسبق للصور لمنع الوميض عند التبديل
  useEffect(() => {
    Object.values(SCENARIO_ROOMS).forEach((room) => {
      room.scenarios.forEach((sc) => {
        const img = new Image();
        img.src = sc.url;
      });
    });
  }, []);

  // إعادة ضبط السيناريو الافتراضي عند تغيير الغرفة المعروضة
  useEffect(() => {
    const defaultSc = SCENARIO_ROOMS[activeRoom].scenarios.find(s => s.id === 'all') || SCENARIO_ROOMS[activeRoom].scenarios[0];
    setActiveScenarioId(defaultSc.id);
  }, [activeRoom]);

  // الحسابات الهندسية بناءً على معايير لوكس (Lux) العالمية
  const area = parseFloat((length * width).toFixed(1));

  // الحصول على معدل لوكس المطلوب
  const getRequiredLux = () => {
    switch (roomUse) {
      case 'living':
        return lightLevel === 'relax' ? 100 : lightLevel === 'medium' ? 150 : 250;
      case 'kitchen':
        return lightLevel === 'relax' ? 150 : lightLevel === 'medium' ? 250 : 350;
      case 'bedroom':
        return lightLevel === 'relax' ? 80 : lightLevel === 'medium' ? 120 : 180;
      case 'salon':
        return lightLevel === 'relax' ? 150 : lightLevel === 'medium' ? 200 : 300;
      case 'hallway':
        return lightLevel === 'relax' ? 80 : lightLevel === 'medium' ? 100 : 150;
      default:
        return 150;
    }
  };

  const reqLux = getRequiredLux();
  const totalLumensNeeded = Math.round(area * reqLux);

  // كفاءة المصباح الافتراضية للسبوتات (بقوة 7 واط وتعطي تقريباً 550 لومن)
  const spotLumens = 550;
  let recommendedSpots = Math.ceil(totalLumensNeeded / spotLumens);
  
  // لضمان التناسق البصري والتناظر في الأسقف، يفضل تقريب عدد الكشافات لأقرب رقم زوجي
  if (recommendedSpots % 2 !== 0 && recommendedSpots > 1) {
    recommendedSpots += 1;
  }

  // حساب أطوال الليد بروفايل والإنارة المخفية الموصى بها
  let ledProfileRecommendation = '';
  let ledLength = 0;

  if (ceilingType === 'gypsum_full') {
    ledLength = Math.round((length + width) * 0.9);
    ledProfileRecommendation = `تأسيس خطوط ليد بروفايل في السقف بطول إجمالي ${ledLength} متر طولي، موزعة على شكل مسارات متوازية لتعطي إنارة عامة ناعمة.`;
  } else if (ceilingType === 'gypsum_perimeter') {
    ledLength = Math.round((length + width) * 2);
    ledProfileRecommendation = `تأسيس شريط ليد مخفي (Cove Light) بطول ${ledLength} متر طولي، يلتف داخل الجيب الجبسي على أطراف الغرفة بالكامل لإنارة غير مباشرة غاية في الجمال.`;
  } else {
    ledProfileRecommendation = `السقف الخرساني المسطح لا يدعم تأسيس بروفايلات الليد الغاطسة. ننصحك باستخدام مسارات الإنارة المغناطيسية الظاهرة (Surface Magnetic Tracks) كبديل عصري سهل التركيب.`;
  }

  // حساب الحجم المقترح للثريا المركزية (قطر الثريا التقريبي بالسنتمتر)
  const recommendedChandelierDiameter = Math.round((length + width) * 8);

  // صياغة نص التقرير للنسخ والمشاركة بالواتساب
  const generateWhatsAppText = () => {
    const roomName = 
      roomUse === 'living' ? 'صالة معيشة' : 
      roomUse === 'kitchen' ? 'مطبخ' : 
      roomUse === 'bedroom' ? 'غرفة نوم' : 
      roomUse === 'salon' ? 'صالون / مجلس' : 'ممر / موزع';

    const ceilingName = 
      ceilingType === 'gypsum_full' ? 'جبس مستعار كامل' : 
      ceilingType === 'gypsum_perimeter' ? 'جبس أطراف (ديكور كوف مخفي)' : 'سقف عادي مسطح';

    const brightnessName = 
      lightLevel === 'relax' ? 'هادئة ومريحة' : 
      lightLevel === 'medium' ? 'طبيعية ومعتدلة' : 'قوية وممتازة للقراءة';

    const text = 
      `أهلاً "الإنارة الحديثة"، قمت باستخدام الحاسبة الهندسية للإنارة وأود الاستفسار عن المنتجات المطابقة لغرفتي:\n\n` +
      `📊 تفاصيل أبعاد الغرفة:\n` +
      `- نوع الغرفة: ${roomName}\n` +
      `- الأبعاد: ${length}م × ${width}م (المساحة: ${area} م²)\n` +
      `- نوع السقف المعين: ${ceilingName}\n` +
      `- شدة الإضاءة المطلوبة: ${brightnessName}\n\n` +
      `💡 التوزيع الهندسي الموصى به:\n` +
      `- كشافات سبوت لايت: ${recommendedSpots} قطع (بقوة 7 واط، درجة اللون الموصى بها: 3000K-4000K)\n` +
      `- مسافة تركيب السبوتات: تبعد 1 متر عن الحائط، وتوزع بمسافة 1.2 متر إلى 1.5 متر بين الكشافات.\n` +
      `- شريط الليد / البروفايل: ${ledLength > 0 ? `${ledLength} متر طولي` : 'غير مطبق'}\n` +
      `  * التوصية: ${ledProfileRecommendation}\n` +
      `- حجم الثريا المقترح: قطر ${recommendedChandelierDiameter} سم تقريباً تعلق في المنتصف.\n\n` +
      `أرجو تزويدي بالأسعار والخيارات المتوفرة لديكم ومطابقتها هندسياً.`;
    
    return encodeURIComponent(text);
  };

  const handleCopyAndWhatsApp = () => {
    const text = generateWhatsAppText();
    const cleanText = decodeURIComponent(text);
    navigator.clipboard.writeText(cleanText).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
      window.location.href = `https://wa.me/218916580068?text=${text}`;
    });
  };

  // معلومات الغرفة النشطة لسيناريو الصور
  const activeRoomData = SCENARIO_ROOMS[activeRoom];
  const activeScenario = activeRoomData.scenarios.find(s => s.id === activeScenarioId) || activeRoomData.scenarios[0];

  return (
    <div className="min-h-screen bg-[#06152b] py-20 px-4 sm:px-6 lg:px-8 relative text-white overflow-hidden font-sans" dir="rtl">
      
      {/* خلفية النيون المضيئة */}
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
            الأداة الهندسية الخفيفة والأسرع للهواتف. احسب عدد وحجم كشافات الإضاءة لغرفتك بدقة علمية، وقارن توزيع الإنارة الحقيقي بالصور الجاهزة فائقة السرعة!
          </p>
        </div>

        {/* جسم الأداة */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* الجانب الأيمن (5 أعمدة): حاسبة الإنارة الهندسية */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl text-right space-y-5">
              
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                <Calculator className="w-5.5 h-5.5 text-blue-400" />
                <h2 className="text-lg font-black text-white">حاسبة الإنارة والمقاسات</h2>
              </div>

              {/* اختيار نوع الغرفة */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">نوع الغرفة أو المساحة</label>
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
                      onClick={() => setRoomUse(room.id as any)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition-all border ${
                        roomUse === room.id
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {room.label}
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
                <label className="text-xs font-bold text-slate-400 block">نوع السقف وديكورات الجبس</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'gypsum_full', title: 'سقف مستعار كامل (جبس بورد غاطس)', desc: 'يدعم الليد بروفايل والسبوتات الغاطسة' },
                    { id: 'gypsum_perimeter', title: 'جبس أطراف فقط (ديكور كوف/ستارة)', desc: 'يدعم الإنارة المخفية وشريط الليد' },
                    { id: 'flat', title: 'سقف خرساني مسطح (بدون جبس بورد)', desc: 'كشافات لطش ظاهرة وثريات فقط' }
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

              {/* شدة الإضاءة المطلوبة */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">شدة الإضاءة العامة المفضلة</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'relax', label: 'هادئة للاسترخاء' },
                    { id: 'medium', label: 'معتدلة طبيعية' },
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
          </div>

          {/* الجانب الأيسر (7 أعمدة): نتائج الحسابات ومقارن الصور الفوري */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* بطاقة النتائج الهندسية */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl text-right space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <Ruler className="w-5.5 h-5.5 text-emerald-400" />
                  <h2 className="text-lg font-black text-white">نتائج التوزيع الهندسي الموصى به</h2>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                  مساحة الفراغ: {area} م²
                </span>
              </div>

              {/* خلاصة الأرقام */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* السبوتات */}
                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-bold">عدد السبوتات المطلوبة</span>
                  <div className="flex items-baseline gap-1 text-emerald-400">
                    <span className="text-2xl font-black">{recommendedSpots}</span>
                    <span className="text-[11px] font-bold">قطع (7 واط)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">بإضاءة 3000K دافئ / 4000K طبيعي</span>
                </div>

                {/* أطوال الليد بروفايل */}
                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-bold">الليد بروفايل / شريط مخفي</span>
                  <div className="flex items-baseline gap-1 text-sky-400">
                    <span className="text-2xl font-black">{ledLength > 0 ? ledLength : 'بدون'}</span>
                    <span className="text-[11px] font-bold">{ledLength > 0 ? 'متر طولي' : 'غير موصى به'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">إنارة غير مباشرة ناعمة</span>
                </div>

                {/* مقاس الثريا المقترح */}
                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-bold">قطر الثريا المقترح</span>
                  <div className="flex items-baseline gap-1 text-indigo-400">
                    <span className="text-2xl font-black">{recommendedChandelierDiameter}</span>
                    <span className="text-[11px] font-bold">سم تقريباً</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">لتناسب المساحة وتملأ الفراغ البصري</span>
                </div>

              </div>

              {/* إرشادات التوزيع الهندسي للسبوتات */}
              <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 space-y-3 text-xs leading-relaxed">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  أبعاد مسافات التركيب (طريقة التوزيع):
                </h4>
                <ul className="list-disc pr-4 space-y-1.5 text-slate-300">
                  <li>**مسافة الجدار:** اترك مسافة **1.0 متر إلى 1.2 متر** بين السبوت لايت والحائط لتفادي سقوط الضوء بشكل عمودي حاد وتشتيت الإنارة بنعومة على الجدران.</li>
                  <li>**المسافة البينية:** اترك مسافة **1.2 متر إلى 1.5 متر** بين الكشافات لتداخل مخاريط الضوء وتفادي البقع المظلمة.</li>
                  <li>**توزيع الليد بروفايل:** {ledProfileRecommendation}</li>
                </ul>
              </div>

              {/* مشاركة وحفظ التقرير للواتساب */}
              <button
                onClick={handleCopyAndWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-4 rounded-2xl font-black text-sm md:text-base transition-all shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:scale-[1.01] active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5 animate-pulse" />
                <span>إرسال التقرير ومطابقة المنتجات بالواتساب</span>
              </button>

              {copiedText && (
                <div className="p-3 bg-green-600/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 animate-bounce" />
                  <span>تم نسخ التقرير الهندسي! يمكنك لصقه وإرساله بالواتساب فوراً.</span>
                </div>
              )}

            </div>

            {/* مقارن وضعيات الإضاءة التفاعلي - خفيف جداً بالمتصفحات */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-2xl text-right space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5.5 h-5.5 text-blue-400" />
                  <h2 className="text-lg font-black text-white">مقارن سيناريوهات التوزيع الحقيقي</h2>
                </div>
                {/* أزرار تغيير الغرفة النموذجية */}
                <div className="flex gap-1.5 self-end">
                  {(Object.keys(SCENARIO_ROOMS) as Array<keyof typeof SCENARIO_ROOMS>).map((roomKey) => (
                    <button
                      key={roomKey}
                      onClick={() => setActiveRoom(roomKey)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all border ${
                        activeRoom === roomKey
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {SCENARIO_ROOMS[roomKey].title}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 -mt-2 leading-relaxed">
                {activeRoomData.description} اختر أحد الأزرار بالأسفل لتبديل وضع الإنارة فوراً بلمح البصر على هاتفك.
              </p>

              {/* أزرار اختيار السيناريو */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activeRoomData.scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setActiveScenarioId(sc.id)}
                    className={`py-2.5 px-2 rounded-xl text-center font-bold text-xs transition-all border flex flex-col items-center justify-center gap-1 ${
                      activeScenarioId === sc.id
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{sc.label}</span>
                  </button>
                ))}
              </div>

              {/* مساحة عرض الصورة الفائقة السرعة */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/5">
                <img
                  src={activeScenario.url}
                  alt={activeScenario.label}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                
                {/* بطاقة توضيحية للوضع الضوئي النشط */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 text-right">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4.5 h-4.5" />
                    {activeScenario.label}
                  </h4>
                  <p className="text-[11px] text-slate-200 leading-relaxed max-w-xl">
                    {activeScenario.desc}
                  </p>
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
