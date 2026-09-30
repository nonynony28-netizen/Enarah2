import { motion } from 'framer-motion'
import {
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Building2,
  Cpu
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

export default function About() {
  const { isAr } = useLanguage()

  const milestones = [
    {
      year: '1988',
      title: isAr ? 'التأسيس والانطلاقة الأولى' : 'Establishment & Inception',
      desc: isAr
        ? 'انطلقت شركة الإنارة الحديثة في طرابلس برؤية معمارية تضع الجودة والموثوقية في قلب التأسيس الكهربائي.'
        : 'Founded in Tripoli with an architectural vision placing quality at the core of electrical systems.'
    },
    {
      year: '2005',
      title: isAr ? 'الشراكات الأوروبية والدولية' : 'European & Global Alliances',
      desc: isAr
        ? 'توسيع نطاق الأعمال واعتماد شراكات توزيع رئيسية مع نخبة مصانع الإضاءة والمفاتيح في فرنسا وإيطاليا وألمانيا.'
        : 'Expanded operations, securing key distribution alliances with top French, Italian, and European manufacturers.'
    },
    {
      year: '2016',
      title: isAr ? 'دخول عصر الإنارة المعمارية المتطورة' : 'Architectural LED Revolution',
      desc: isAr
        ? 'إدخال أنظمة الإنارة الخطية (LED Profiles)، والسبوت المعماري المانع للتوهج، وحلول الطاقة الذكية.'
        : 'Pioneered linear architectural LED profiles, anti-glare optics, and energy-efficient systems.'
    },
    {
      year: '2024+',
      title: isAr ? 'ريادة كبرى المشاريع والصروح' : 'Landmark Projects Leadership',
      desc: isAr
        ? 'توريد وتنفيذ منظومات الإنارة والكهرباء لأبرز المجمعات التجارية، المصحات الطبية، والمباني الفاخرة.'
        : 'Successfully executing illumination for prominent commercial malls, medical clinics, and luxury villas.'
    }
  ]

  const pillars = [
    {
      icon: Cpu,
      title: isAr ? 'الدقة الهندسية وتوزيع الضوء' : 'Engineering Photometrics',
      desc: isAr
        ? 'نتعامل مع الضوء كعلم هندسي دقيق؛ نحسب درجات الانتشار وزوايا الانعكاس لتوفير بيئة بصرية مريحة بلا توهج.'
        : 'Light treated as an exact science; precision beam angles and photometrics for supreme visual comfort.'
    },
    {
      icon: ShieldCheck,
      title: isAr ? 'الجودة والسلامة غير القابلة للمساومة' : 'Uncompromising Safety',
      desc: isAr
        ? 'منتجاتنا مطابقة للمواصفات القياسية الأوروبية والعالمية، من النحاس النقي 100% إلى مواد التأسيس المقاومة للحريق.'
        : 'Certified to European and international standards, from 100% pure copper to fire-retardant enclosures.'
    },
    {
      icon: Building2,
      title: isAr ? 'شراكات مع كبرى المصانع العالمية' : 'World-Class Partnerships',
      desc: isAr
        ? 'وكلاء وموزعون موثوقون لعلامات مثل Legrand و Philips و Gewiss و CHINT لضمان أصالة المنتج وكفاءته.'
        : 'Authorized partners for Legrand, Philips, Gewiss, CHINT and more, guaranteeing authentic performance.'
    }
  ]

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F7F8FA] text-[#15191E] font-sans antialiased selection:bg-[#0062D2] selection:text-white pt-24 pb-28"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#68717D] hover:text-[#0062D2] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Editorial Hero Header */}
        <div className="mb-16 sm:mb-20 max-w-3xl">
          <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-3">
            SINCE 1988
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#15191E] tracking-tight leading-[1.12] mb-5">
            خبرة تمتد لأكثر من ثلاثة عقود
          </h1>
          <p className="text-base sm:text-lg text-[#68717D] font-normal leading-relaxed">
            منذ أكثر من 35 عاماً، نكرّس خبرتنا الهندسية في توفير أرقى حلول الإنارة المعمارية والأنظمة الكهربائية المعتمدة في ليبيا.
          </p>
        </div>

        {/* Brand Story Asymmetric Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center bg-white rounded-3xl p-8 sm:p-12 border border-[#E7EAF0] shadow-sm mb-20">
          <div className="lg:col-span-6 space-y-6 text-[#15191E]">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block">
              OUR ARCHITECTURAL PHILOSOPHY
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#15191E] leading-snug">
              الضوء يشكّل المكان ويصنع الفارق
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#68717D] leading-relaxed font-normal">
              <p>
                تأسست شركة الإنارة الحديثة في طرابلس عام 1988، بهدف الارتقاء بمفهوم الإضاءة من مجرد عنصر وظيفي تقليدي إلى قيمة معمارية محورية تُبرز جمال الفراغ وتمنحه شخصيته المستقلة.
              </p>
              <p>
                نواكب باستمرار التطور التقني المتسارع في عالم الإضاءة والتحكم الذكي، ونوفر للمهندسين الاستشاريين والمقاولين وأصحاب الذوق الرفيع باقة متكاملة من المنتجات الأصلية المطابقة للمواصفات العالمية.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E7EAF0]">
              <div>
                <span className="text-3xl font-bold text-[#15191E] block">+35</span>
                <span className="text-xs text-[#68717D] mt-1 block">عاماً من الريادة</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-[#15191E] block">+500</span>
                <span className="text-xs text-[#68717D] mt-1 block">مشروعاً ناجحاً</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-[#15191E] block">+15</span>
                <span className="text-xs text-[#68717D] mt-1 block">علامة دولية</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-[#E7EAF0] shadow-md">
              <img
                src="/images/architectural-hero.jpg"
                alt="Enarah Modern Architectural Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
              CORE PRINCIPLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#15191E] tracking-tight">
              ركائز عملنا الهندسي
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-[#E7EAF0] shadow-xs hover:border-[#0062D2]/30 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EBF3FC] text-[#0062D2] flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#15191E] mb-3">{item.title}</h3>
                <p className="text-sm text-[#68717D] leading-relaxed font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chronological Timeline */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E7EAF0] shadow-sm mb-20">
          <div className="max-w-xl mb-12">
            <span className="text-xs font-semibold text-[#0062D2] tracking-widest uppercase block mb-2">
              OUR JOURNEY
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#15191E] tracking-tight">
              محطات مضيئة في مسيرتنا
            </h2>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:right-4 md:before:right-32 before:w-0.5 before:bg-[#E7EAF0]">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative flex flex-col md:flex-row items-start gap-6 md:gap-10">
                <div className="md:w-28 shrink-0 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#0062D2] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-xl font-bold text-[#15191E]">{m.year}</span>
                </div>
                <div className="flex-grow bg-[#F7F8FA] p-6 rounded-2xl border border-[#E7EAF0]">
                  <h4 className="text-base font-semibold text-[#15191E] mb-2">{m.title}</h4>
                  <p className="text-sm text-[#68717D] leading-relaxed font-normal">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Strip */}
        <div className="bg-[#101820] text-white rounded-3xl p-10 sm:p-14 text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            هل تخطط لمشروعك القادم؟
          </h3>
          <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto mb-8 font-normal">
            تواصل مع مهندسينا للحصول على استشارة متخصصة ودراسة ضوئية شاملة لمساحتك.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#0062D2] hover:bg-[#0047A5] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors"
            >
              <span>تواصل مع خبرائنا</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              to="/branches"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-full transition-colors border border-white/15"
            >
              <span>فروعنا ومعارضنا</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
