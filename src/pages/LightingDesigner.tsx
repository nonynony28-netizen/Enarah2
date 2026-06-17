import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb, Zap, Award, Sparkles, Plus, Trash2, Sliders,
  Upload, Image as ImageIcon, ArrowLeft, RefreshCw, Maximize2,
  RotateCw, MessageCircle, Eye, EyeOff, Save, CheckCircle, ChevronRight, X
} from 'lucide-react'

interface Fixture {
  id: string;
  type: 'spotlight' | 'chandelier' | 'led_profile';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  brightness: number; // 0-100
  temp: 'warm' | 'natural' | 'cool';
  scale: number; // 0.5 to 2.0
  style?: 'modern' | 'classic' | 'minimalist'; // for Chandelier
  angle?: number; // for LED Profile (0-360)
  length?: number; // for LED Profile (50-300px)
  thickness?: 'thin' | 'medium' | 'thick'; // for LED Profile
}

const presetRooms = [
  {
    id: 'living',
    name: 'صالة معيشة حديثة',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'kitchen',
    name: 'مطبخ مودرن عصري',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bedroom',
    name: 'غرفة نوم هادئة',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'salon',
    name: 'صالون / مجلس ضيوف',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
  }
];

export default function LightingDesigner() {
  const [roomType, setRoomType] = useState<'living' | 'kitchen' | 'bedroom' | 'salon' | 'custom'>('living');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>(null);
  const [showLights, setShowLights] = useState(true);
  const [copiedText, setCopiedText] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
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

  // مؤقت لمسح الصورة تلقائياً بعد مرور ساعة من الرفع إذا بقيت الصفحة مفتوحة
  useEffect(() => {
    const interval = setInterval(() => {
      const savedTime = sessionStorage.getItem('enarah_custom_image_time');
      if (savedTime) {
        const elapsed = Date.now() - parseInt(savedTime);
        if (elapsed >= 3600000) { // ساعة واحدة
          setCustomImage(null);
          if (roomType === 'custom') {
            setRoomType('living');
          }
          sessionStorage.removeItem('enarah_custom_image');
          sessionStorage.removeItem('enarah_custom_image_time');
          setFixtures([]);
          setSelectedFixtureId(null);
          alert("تنبيه أمني: انتهت صلاحية الجلسة الآمنة (ساعة واحدة) وتم إزالة صورتك المرفوعة تلقائياً لحماية خصوصيتك ولتسريع أداء متصفح الهاتف.");
        }
      }
    }, 15000); // الفحص كل 15 ثانية
    return () => clearInterval(interval);
  }, [roomType]);

  // اختيار الصورة الخلفية الحالية
  const getBgImage = () => {
    if (roomType === 'custom' && customImage) {
      return customImage;
    }
    const preset = presetRooms.find(r => r.id === roomType);
    return preset ? preset.url : presetRooms[0].url;
  };

  // معالجة رفع صورة مخصصة مع تقييد الحجم
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // تقييد الحجم إلى 2.5 ميجابايت كحد أقصى لسرعة الأداء ومنع استهلاك الذاكرة
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
            console.warn("فشل حفظ الصورة في sessionStorage (قد تكون المساحة ممتلئة)، سيتم الاحتفاظ بها في ذاكرة الصفحة المؤقتة فقط.", err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // إضافة وحدة إضاءة جديدة
  const addFixture = (type: 'spotlight' | 'chandelier' | 'led_profile') => {
    const newFixture: Fixture = {
      id: `${type}_${Date.now()}`,
      type,
      x: 50, // في المنتصف افتراضياً
      y: 30, // في الثلث العلوي افتراضياً
      brightness: 80,
      temp: 'warm',
      scale: 1.0,
      ...(type === 'chandelier' && { style: 'modern' }),
      ...(type === 'led_profile' && { angle: 0, length: 150, thickness: 'medium' }),
    };
    setFixtures(prev => [...prev, newFixture]);
    setSelectedFixtureId(newFixture.id);
  };

  // حذف وحدة إضاءة
  const deleteFixture = (id: string) => {
    setFixtures(prev => prev.filter(f => f.id !== id));
    if (selectedFixtureId === id) {
      setSelectedFixtureId(null);
    }
  };

  // تحديث خصائص وحدة الإضاءة المحددة
  const updateSelectedFixture = (key: keyof Fixture, value: any) => {
    if (!selectedFixtureId) return;
    setFixtures(prev =>
      prev.map(f => (f.id === selectedFixtureId ? { ...f, [key]: value } : f))
    );
  };

  // الحصول على كود الألوان بناءً على حرارة اللون
  const getTempColor = (temp: 'warm' | 'natural' | 'cool', alpha: number = 1) => {
    switch (temp) {
      case 'warm':
        return `rgba(251, 191, 36, ${alpha})`; // أصفر دافئ
      case 'natural':
        return `rgba(254, 240, 138, ${alpha})`; // شمسي طبيعي
      case 'cool':
        return `rgba(224, 242, 254, ${alpha})`; // أبيض بارد
    }
  };

  // معالجة السحب (Pointer Dragging) المتجاوب مع اللمس والماوس
  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    setSelectedFixtureId(id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const newX = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const newY = ((moveEvent.clientY - rect.top) / rect.height) * 100;

      // تقييد الإحداثيات داخل فضاء الصورة (0% إلى 100%)
      const clampedX = Math.max(2, Math.min(98, newX));
      const clampedY = Math.max(2, Math.min(98, newY));

      setFixtures(prev =>
        prev.map(f => (f.id === id ? { ...f, x: clampedX, y: clampedY } : f))
      );
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // استخراج النص المنسق للطلب عبر الواتساب
  const generateWhatsAppText = () => {
    const counts = { spotlight: 0, chandelier: 0, led_profile: 0 };
    fixtures.forEach(f => {
      counts[f.type]++;
    });

    const summary = fixtures.map((f, i) => {
      const name = f.type === 'spotlight' ? 'سبوت لايت' : f.type === 'chandelier' ? 'ثريا معلقة' : 'ليد بروفايل';
      const details = f.type === 'chandelier'
        ? `(ستايل: ${f.style === 'modern' ? 'مودرن' : f.style === 'classic' ? 'كلاسيك' : 'خطي'})`
        : f.type === 'led_profile'
        ? `(طول: ${f.length}px، سمك: ${f.thickness === 'thin' ? 'رقيق' : f.thickness === 'thick' ? 'سميك' : 'متوسط'})`
        : '';
      const tempText = f.temp === 'warm' ? '3000K دافئ' : f.temp === 'natural' ? '4000K شمسي' : '6000K أبيض';
      return `${i + 1}. ${name} ${details} - إضاءة ${tempText} - شدة: ${f.brightness}%`;
    }).join('\n');

    const totalText = `أهلاً "الإنارة الحديثة"، لقد قمت بتصميم توزيع الإضاءة الخاص بي عبر موقعكم وأود الاستفسار عن المنتجات التالية:\n\n` +
      `📊 الملخص الإجمالي:\n` +
      `- سبوت لايت: ${counts.spotlight} وحدات\n` +
      `- ثريات: ${counts.chandelier} وحدات\n` +
      `- ليد بروفايل: ${counts.led_profile} خطوط مضيئة\n\n` +
      `💡 التفاصيل الموزعة:\n${summary || 'لا توجد قطع مضافة بعد.'}\n\n` +
      `📸 (سأرفق لكم لقطة شاشة للتصميم الموزع على صورتي)`;
    
    return encodeURIComponent(totalText);
  };

  const handleWhatsAppShare = () => {
    const text = generateWhatsAppText();
    const cleanText = decodeURIComponent(text);
    navigator.clipboard.writeText(cleanText).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
      // توجيه للواتساب
      window.location.href = `https://wa.me/218916580068?text=${text}`;
    });
  };

  const selectedFixture = fixtures.find(f => f.id === selectedFixtureId);

  return (
    <div className="min-h-screen bg-[#06152b] py-20 px-4 sm:px-6 lg:px-8 relative text-white overflow-hidden font-sans" dir="rtl">
      
      {/* شبكة النيون الخلفية التكنولوجية */}
      <div className="absolute inset-0 z-0 bg-[size:30px_30px] opacity-15 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)' }} 
      />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* العناوين والترويسة */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group text-sm font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            العودة للرئيسية
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
            مُصمم الإضاءة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 drop-shadow-[0_4px_15px_rgba(59,130,246,0.35)]">التفاعلي</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-base">
            ارفع صورة صالتك، مطبخك أو غرفتك، وابدأ بتركيب وتوزيع السبوتات والليد بروفايل والثريات لمعاينة النتيجة بشكل فوري وطلب مطابقتها بالواتساب!
          </p>
        </div>

        {/* جسم المصمم: مقسم إلى قسمين */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* الجانب الأيمن (8 أعمدة): لوحة الرسم والعمل */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* خيارات تغيير الغرفة */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex flex-wrap gap-2">
                {presetRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => { setRoomType(room.id as any); setCustomImage(null); }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                      roomType === room.id && !customImage
                        ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)] border border-blue-500/30'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
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
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 ${
                    roomType === 'custom'
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)] border border-green-500/30'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Upload className="w-4.5 h-4.5 text-green-400" />
                  <span>{customImage ? 'تغيير صورتك المرفوعة' : 'تحميل صورة غرفتك'}</span>
                </button>
              </div>
            </div>

            {/* مساحة الرسم التفاعلية (Canvas) */}
            <div className="relative bg-[#0d2342]/90 border border-blue-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300">
              
              {/* شريط الإجراءات السريعة على الصورة */}
              <div className="absolute top-4 right-4 z-30 flex gap-2">
                <button
                  onClick={() => setShowLights(!showLights)}
                  className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-2xl transition-all border border-white/10 flex items-center gap-2 text-xs font-bold backdrop-blur-sm"
                  title="عرض/إخفاء تأثيرات الضوء"
                >
                  {showLights ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4 text-green-400" />}
                  <span>{showLights ? 'إطفاء الأنوار' : 'تشغيل الأنوار'}</span>
                </button>
                <button
                  onClick={() => { setFixtures([]); setSelectedFixtureId(null); }}
                  className="p-3 bg-black/60 hover:bg-red-500/80 text-white rounded-2xl transition-all border border-white/10 flex items-center gap-2 text-xs font-bold backdrop-blur-sm"
                  title="إزالة جميع الأضواء"
                >
                  <RefreshCw className="w-4 h-4 text-red-400" />
                  <span>إعادة تعيين</span>
                </button>
              </div>

              {/* الحاوية الفعلية للصورة والسبوتات */}
              <div 
                ref={canvasRef}
                className="relative w-full aspect-[16/10] md:aspect-[16/9] min-h-[300px] md:min-h-[450px] bg-slate-950 flex items-center justify-center select-none"
              >
                {/* الصورة الخلفية للغرفة */}
                <img
                  src={getBgImage()}
                  alt="Room Canvas"
                  className="w-full h-full object-cover pointer-events-none"
                />

                {/* طبقة التعتيم المحاكية للظلام بناءً على الأضواء الموجودة */}
                <div 
                  className="absolute inset-0 pointer-events-none transition-opacity duration-700 bg-black"
                  style={{
                    // إذا تم إطفاء الأنوار، تعتيم كامل بنسبة 85%. إذا كانت الأنوار شغالة، تعتيم متناسب مع الإضاءة الموزعة
                    opacity: showLights 
                      ? Math.max(0.2, 0.75 - (fixtures.reduce((acc, f) => acc + (f.brightness / 100) * 0.12, 0))) 
                      : 0.85
                  }}
                />

                {/* طبقة تأثيرات سقوط الإضاءة (Beams & Radial Glows) في الخلفية خلف الأيقونات */}
                {showLights && fixtures.map((f) => {
                  if (f.brightness <= 0) return null;
                  
                  if (f.type === 'spotlight') {
                    // تأثير مخروط السبوت لايت الفيزيائي المتوهج لأسفل
                    return (
                      <div
                        key={`beam_${f.id}`}
                        className="absolute pointer-events-none origin-top transition-all duration-300"
                        style={{
                          top: `${f.y}%`,
                          left: `${f.x}%`,
                          transform: `translateX(-50%) scale(${f.scale})`,
                          width: '160px',
                          height: '350px',
                          background: `linear-gradient(to bottom, ${getTempColor(f.temp, 0.65)} 0%, ${getTempColor(f.temp, 0.1)} 50%, transparent 100%)`,
                          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                          opacity: f.brightness / 100,
                          filter: 'blur(3.5px)',
                          mixBlendMode: 'screen',
                        }}
                      />
                    );
                  } else if (f.type === 'chandelier') {
                    // تأثير التوهج الدائري العملاق للثريا في الخلفية
                    return (
                      <div
                        key={`glow_${f.id}`}
                        className="absolute pointer-events-none rounded-full transition-all duration-300"
                        style={{
                          top: `${f.y}%`,
                          left: `${f.x}%`,
                          transform: 'translate(-50%, -50%)',
                          width: `${f.scale * 340}px`,
                          height: `${f.scale * 340}px`,
                          background: `radial-gradient(circle, ${getTempColor(f.temp, 0.4)} 0%, ${getTempColor(f.temp, 0.08)} 50%, transparent 100%)`,
                          opacity: f.brightness / 100,
                          filter: 'blur(10px)',
                          mixBlendMode: 'screen',
                        }}
                      />
                    );
                  }
                  return null;
                })}

                {/* طبقة الأيقونات التفاعلية الموزعة والأزرار القابلة للسحب */}
                {fixtures.map((f) => {
                  const isSelected = f.id === selectedFixtureId;
                  
                  // معالجة الليد بروفايل بشكل خطي منفصل
                  if (f.type === 'led_profile') {
                    return (
                      <div
                        key={f.id}
                        onPointerDown={(e) => handlePointerDown(e, f.id)}
                        className={`absolute rounded-full transition-shadow duration-300 flex items-center justify-center ${
                          isSelected ? 'ring-2 ring-emerald-400 shadow-[0_0_15px_#10b981] z-30' : 'z-20 hover:scale-105'
                        }`}
                        style={{
                          left: `${f.x}%`,
                          top: `${f.y}%`,
                          width: `${f.length || 150}px`,
                          height: f.thickness === 'thin' ? '6px' : f.thickness === 'thick' ? '14px' : '10px',
                          transform: `translate(-50%, -50%) rotate(${f.angle || 0}deg)`,
                          backgroundColor: getTempColor(f.temp, showLights ? 0.95 : 0.4),
                          boxShadow: showLights && f.brightness > 0 
                            ? `0 0 ${15 * (f.brightness/100)}px ${getTempColor(f.temp, 0.95)}, 0 0 ${30 * (f.brightness/100)}px ${getTempColor(f.temp, 0.6)}` 
                            : 'none',
                          opacity: showLights && f.brightness > 0 ? 0.35 + (f.brightness / 100) * 0.65 : 0.4,
                          cursor: 'move',
                          touchAction: 'none',
                          willChange: 'left, top'
                        }}
                      >
                        {/* مقبض تحديد الليد بروفايل في المنتصف */}
                        <span className={`w-3.5 h-3.5 rounded-full border border-white/50 bg-[#0a192f] transition-transform ${isSelected ? 'scale-110 bg-emerald-500' : 'scale-75'}`} />
                      </div>
                    );
                  }

                  // معالجة السبوتات والثريات
                  return (
                    <div
                      key={f.id}
                      onPointerDown={(e) => handlePointerDown(e, f.id)}
                      className={`absolute select-none flex items-center justify-center rounded-full transition-all duration-300 ${
                        isSelected 
                          ? 'ring-2 ring-emerald-400 bg-[#0a192f]/90 shadow-[0_0_20px_#10b981] scale-110 z-30' 
                          : 'bg-[#0f213a]/80 hover:bg-[#0f213a]/100 text-white/90 z-20 hover:scale-105 active:scale-95 shadow-md border border-white/10'
                      }`}
                      style={{
                        left: `${f.x}%`,
                        top: `${f.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: f.type === 'chandelier' ? `${f.scale * 60}px` : `${f.scale * 44}px`,
                        height: f.type === 'chandelier' ? `${f.scale * 60}px` : `${f.scale * 44}px`,
                        cursor: 'move',
                        touchAction: 'none',
                        willChange: 'left, top'
                      }}
                    >
                      {f.type === 'spotlight' ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* جسم السبوت لايت الخارجي */}
                          <div className={`w-8 h-8 rounded-full border-2 transition-colors flex items-center justify-center ${
                            showLights && f.brightness > 0 ? 'bg-white border-blue-400 shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'bg-slate-700 border-slate-600'
                          }`}>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getTempColor(f.temp, showLights && f.brightness > 0 ? 1 : 0.2) }} />
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* أيقونة الثريا الفاخرة */}
                          <div className={`p-2 rounded-xl transition-all ${
                            showLights && f.brightness > 0 ? 'text-amber-300 scale-105' : 'text-slate-400'
                          }`}>
                            {f.style === 'classic' ? (
                              <Award className="w-7 h-7" /> // أيقونة بديلة للثريا الكلاسيكية الفخمة
                            ) : f.style === 'minimalist' ? (
                              <Sliders className="w-7 h-7 rotate-90" />
                            ) : (
                              <Sparkles className="w-7 h-7 animate-pulse" /> // ثريا مودرن بحلقات متوهجة
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* تلميح مساعدة عائم عند خلو اللوحة */}
                {fixtures.length === 0 && (
                  <div className="absolute inset-0 bg-[#06152b]/60 flex flex-col items-center justify-center p-6 text-center pointer-events-none animate-fade-in">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                      <Lightbulb className="w-8 h-8 text-blue-400 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">لوحة التصميم فارغة</h3>
                    <p className="text-slate-400 text-sm max-w-sm">
                      ابدأ بإضافة كشافات سبوت لايت أو ثريات أو ليد بروفايل من لوحة التحكم الجانبية وقم بسحبها ووضعها على الصورة.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* إرشادات ونصائح التصميم التفاعلية */}
            <div className="bg-[#0f213a]/50 border border-white/5 rounded-3xl p-5 text-sm text-slate-300">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-blue-400" />
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

          {/* الجانب الأيسر (4 أعمدة): لوحة التحكم وإضافة القطع */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* بطاقة صندوق الإضافة */}
            <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-lg font-bold text-white mb-5 pb-3 border-b border-white/5 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                إضافة عناصر إضاءة جديدة
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => addFixture('spotlight')}
                  className="flex items-center gap-4 p-4 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-2xl text-right transition-all group active:scale-98"
                >
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">سبوت لايت دائري</h4>
                    <p className="text-xs text-slate-400 mt-0.5">إضاءة موجهة دقيقة للأسقف والديكورات</p>
                  </div>
                </button>

                <button
                  onClick={() => addFixture('chandelier')}
                  className="flex items-center gap-4 p-4 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 rounded-2xl text-right transition-all group active:scale-98"
                >
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">ثريا معلقة فاخرة</h4>
                    <p className="text-xs text-slate-400 mt-0.5">إضاءة محيطية جمالية لمنتصف الغرفة</p>
                  </div>
                </button>

                <button
                  onClick={() => addFixture('led_profile')}
                  className="flex items-center gap-4 p-4 bg-white/5 hover:bg-sky-500/10 border border-white/10 hover:border-sky-500/30 rounded-2xl text-right transition-all group active:scale-98"
                >
                  <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">شريط ليد بروفايل</h4>
                    <p className="text-xs text-slate-400 mt-0.5">خطوط نيون هندسية وزوايا مضيئة للأسقف</p>
                  </div>
                </button>
              </div>
            </div>

            {/* لوحة التحكم بخصائص العنصر المحدد */}
            <AnimatePresence mode="wait">
              {selectedFixture ? (
                <motion.div
                  key={selectedFixture.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-[#0f213a]/90 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 shadow-xl relative"
                >
                  {/* زر إغلاق لوحة التعديل */}
                  <button 
                    onClick={() => setSelectedFixtureId(null)}
                    className="absolute top-4 left-4 p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3 className="text-lg font-bold text-white mb-5 pb-3 border-b border-white/5 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-400" />
                    تعديل عنصر: {
                      selectedFixture.type === 'spotlight' ? 'سبوت لايت' : selectedFixture.type === 'chandelier' ? 'ثريا معلقة' : 'ليد بروفايل'
                    }
                  </h3>

                  <div className="space-y-5">
                    
                    {/* تعديل حرارة اللون */}
                    <div>
                      <span className="block text-xs font-bold text-slate-400 mb-2">حرارة لون الإضاءة (درجة كلفن)</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'warm', label: '3000K دافئ', bg: 'rgba(251, 191, 36, 0.2)', text: 'text-amber-400', border: 'border-amber-400/50' },
                          { id: 'natural', label: '4000K شمسي', bg: 'rgba(254, 240, 138, 0.2)', text: 'text-yellow-200', border: 'border-yellow-200/50' },
                          { id: 'cool', label: '6000K بارد', bg: 'rgba(224, 242, 254, 0.2)', text: 'text-sky-300', border: 'border-sky-300/50' }
                        ].map((tempOpt) => (
                          <button
                            key={tempOpt.id}
                            onClick={() => updateSelectedFixture('temp', tempOpt.id)}
                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                              selectedFixture.temp === tempOpt.id
                                ? `${tempOpt.bg} ${tempOpt.text} ${tempOpt.border} scale-[1.03] shadow-inner`
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {tempOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* تعديل ستايل الثريا */}
                    {selectedFixture.type === 'chandelier' && (
                      <div>
                        <span className="block text-xs font-bold text-slate-400 mb-2">ستايل وتصميم الثريا</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'modern', label: 'مودرن حلقي' },
                            { id: 'classic', label: 'كلاسيك كريستال' },
                            { id: 'minimalist', label: 'خطي هندسي' }
                          ].map((styleOpt) => (
                            <button
                              key={styleOpt.id}
                              onClick={() => updateSelectedFixture('style', styleOpt.id)}
                              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                                selectedFixture.style === styleOpt.id
                                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              {styleOpt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* تعديل سمك الليد بروفايل */}
                    {selectedFixture.type === 'led_profile' && (
                      <div>
                        <span className="block text-xs font-bold text-slate-400 mb-2">سمك خط البروفايل</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'thin', label: 'رقيق (1.5سم)' },
                            { id: 'medium', label: 'متوسط (2.5سم)' },
                            { id: 'thick', label: 'عريض (4سم)' }
                          ].map((thickOpt) => (
                            <button
                              key={thickOpt.id}
                              onClick={() => updateSelectedFixture('thickness', thickOpt.id)}
                              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                                selectedFixture.thickness === thickOpt.id
                                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              {thickOpt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* شدة الإضاءة (السطوع) */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                        <span>شدة التوهج والسطوع</span>
                        <span className="text-white">{selectedFixture.brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedFixture.brightness}
                        onChange={(e) => updateSelectedFixture('brightness', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* الحجم والمدى (Scale) للسبوت أو الثريا */}
                    {selectedFixture.type !== 'led_profile' && (
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                          <span>حجم القطعة ومخروط الضوء</span>
                          <span className="text-white">x{selectedFixture.scale.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={selectedFixture.scale * 100}
                          onChange={(e) => updateSelectedFixture('scale', parseInt(e.target.value) / 100)}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    )}

                    {/* طول الليد بروفايل */}
                    {selectedFixture.type === 'led_profile' && (
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                          <span>طول شريط الليد بروفايل</span>
                          <span className="text-white">{selectedFixture.length}px</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="300"
                          value={selectedFixture.length}
                          onChange={(e) => updateSelectedFixture('length', parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    )}

                    {/* زاوية دوران الليد بروفايل */}
                    {selectedFixture.type === 'led_profile' && (
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                          <span>زاوية الدوران (لتناسب زاوية السقف)</span>
                          <span className="text-white flex items-center gap-1">
                            <RotateCw className="w-3 h-3 text-sky-400 animate-spin [animation-duration:8s]" />
                            {selectedFixture.angle}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={selectedFixture.angle}
                          onChange={(e) => updateSelectedFixture('angle', parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    )}

                    {/* أزرار سريعة للتحكم بالموقع (X, Y) لتسهيل ضبطها بالهواتف */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">الموقع الأفقي X</span>
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 justify-between">
                          <button onClick={() => updateSelectedFixture('x', Math.max(0, selectedFixture.x - 2))} className="px-2 py-0.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg">-</button>
                          <span className="text-xs font-mono">{Math.round(selectedFixture.x)}%</span>
                          <button onClick={() => updateSelectedFixture('x', Math.min(100, selectedFixture.x + 2))} className="px-2 py-0.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg">+</button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">الموقع العمودي Y</span>
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 justify-between">
                          <button onClick={() => updateSelectedFixture('y', Math.max(0, selectedFixture.y - 2))} className="px-2 py-0.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg">-</button>
                          <span className="text-xs font-mono">{Math.round(selectedFixture.y)}%</span>
                          <button onClick={() => updateSelectedFixture('y', Math.min(100, selectedFixture.y + 2))} className="px-2 py-0.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg">+</button>
                        </div>
                      </div>
                    </div>

                    {/* زر الحذف الفوري للعنصر */}
                    <button
                      onClick={() => deleteFixture(selectedFixture.id)}
                      className="w-full flex items-center justify-center gap-2 bg-red-600/15 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white py-3 rounded-2xl font-bold transition-all"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                      حذف القطعة
                    </button>

                  </div>
                </motion.div>
              ) : (
                // بطاقة قائمة القطع المضافة
                <div className="bg-[#0f213a]/90 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl text-right">
                  <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-white/5 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-slate-400" />
                    العناصر المضافة ({fixtures.length})
                  </h3>

                  {fixtures.length > 0 ? (
                    <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                      {fixtures.map((f, i) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFixtureId(f.id)}
                          className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/5 hover:bg-blue-600/10 hover:border-blue-500/30 rounded-xl transition-all"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <span className="w-5 h-5 bg-white/5 border border-white/10 rounded-full flex items-center justify-center font-bold font-mono text-slate-400">{i + 1}</span>
                            <span className="font-bold text-white">
                              {f.type === 'spotlight' ? 'سبوت لايت' : f.type === 'chandelier' ? 'ثريا معلقة' : 'ليد بروفايل'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md font-mono">
                            X:{Math.round(f.x)}% Y:{Math.round(f.y)}%
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">لم يتم إضافة أي عناصر إضاءة بعد. استخدم صندوق الإضافة بالأعلى للبدء.</p>
                  )}
                </div>
              )}
            </AnimatePresence>

            {/* بطاقة الطلب والإرسال الفوري للواتساب */}
            <div className="bg-gradient-to-br from-[#0d2342] to-[#0a192f] border border-blue-500/25 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-400" />
                اطلب المنتجات المطابقة
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                سيقوم النظام بنسخ تفاصيل توزيع الإضاءة الذي قمت به لتسهيل إرساله، كل ما عليك هو التقاط صورة لتصميمك ومشاركتها معنا على الواتساب!
              </p>

              <button
                disabled={fixtures.length === 0}
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-6 h-6 animate-pulse" />
                <span>إرسال التصميم للواتساب</span>
              </button>

              {copiedText && (
                <div className="mt-3 p-3 bg-green-600/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 animate-bounce" />
                  <span>تم نسخ ملخص التصميم! يرجى إرساله بالدردشة وإرفاق لقطة شاشة.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
