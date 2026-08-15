import { useState } from 'react'
import { Building2, FileText, Phone, MessageSquare, AlertCircle, Sliders } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function Contractors() {
  const { isAr } = useLanguage()

  // State variables for form
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [projectType, setProjectType] = useState(isAr ? 'شركة تشطيب' : 'Finishing Company')
  const [materials, setMaterials] = useState('')
  const [error, setError] = useState('')

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !phone.trim() || !materials.trim()) {
      setError(isAr ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill in all required fields')
      return
    }

    setError('')

    // WhatsApp formatting
    const salesPhone = '218916580068' // Modern Enarah WhatsApp sales number
    
    const whatsappMessage = isAr 
      ? `*طلب تسعير كميات وتوريدات (بوابة المقاولين)*\n` +
        `==============================\n` +
        `👤 *الجهة / الاسم:* ${name}\n` +
        `📞 *رقم الهاتف:* ${phone}\n` +
        `🏢 *نوع النشاط:* ${projectType}\n\n` +
        `📝 *المواد والكميات المطلوبة:*\n${materials}\n` +
        `==============================\n` +
        `المصدر: بوابة المقاولين - موقع الإنارة الحديثة`
      : `*Bulk Supplies & Quantities Quote Request (Contractor Portal)*\n` +
        `==============================\n` +
        `👤 *Company / Name:* ${name}\n` +
        `📞 *Phone Number:* ${phone}\n` +
        `🏢 *Activity Type:* ${projectType}\n\n` +
        `📝 *Required Materials & Quantities:*\n${materials}\n` +
        `==============================\n` +
        `Source: Contractors Portal - Modern Enarah Website`

    const url = `https://wa.me/${salesPhone}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-transparent text-white pt-28 pb-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Page Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-blue-400 mb-2 shadow-sm">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-white">
            {isAr ? 'بوابة المقاولين والكميات' : 'Contractors & Bulk Portal'}
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            {isAr 
              ? 'نهتم بتقديم أفضل عروض الأسعار والتسهيلات الخاصة لشركات التشطيب، المقاولين، والمشاريع الكبرى. املأ بياناتك وموادك المطلوبة للتواصل المباشر مع قسم المبيعات والكميات لدينا.'
              : 'We provide specialized pricing and logistics services for contractors, finishing companies, and large-scale projects. Fill in your details below for a direct quote.'}
          </p>
        </div>

        {/* Info Grid & Form Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left panel: Info cards */}
          <div className="md:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-[#111215] border border-white/[0.08] space-y-3">
              <div className="p-2 w-10 h-10 rounded-xl bg-zinc-900 text-blue-400 flex items-center justify-center border border-zinc-800">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">
                {isAr ? 'توفير وتوريد مباشر' : 'Direct Supply'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                {isAr 
                  ? 'نوفر كابلات وأسلاك النحاس، إنارة ذكية، سبوت لايت، وقواطع كهربائية بكميات ضخمة بأسعار تنافسية.'
                  : 'We supply high-grade cables, wires, smart switches, and spotlights directly from approved manufacturers.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111215] border border-white/[0.08] space-y-3">
              <div className="p-2 w-10 h-10 rounded-xl bg-zinc-900 text-blue-400 flex items-center justify-center border border-zinc-800">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">
                {isAr ? 'متابعة وتأكيد سريع' : 'Fast Response'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                {isAr 
                  ? 'يقوم منسق المبيعات لدينا بمراجعة طلبك وتحديد الخصومات الخاصة بحجم تعاملاتك فور استلام الطلب.'
                  : 'Our dedicated sales coordinators analyze your list and apply scale discounts immediately upon request.'}
              </p>
            </div>
          </div>

          {/* Right panel: Form Card */}
          <div className="md:col-span-8">
            <div 
              className="p-6 md:p-8 rounded-2xl bg-[#111215] border border-white/[0.08] shadow-sm space-y-6 text-right"
            >
              <div className="border-b border-zinc-800 pb-4 mb-2">
                <h2 className="text-xl font-bold text-white">
                  {isAr ? 'نموذج طلب عروض الأسعار والكميات' : 'Bulk Quote Request Form'}
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-normal">
                  {isAr 
                    ? 'سيتم إرسال الطلب مشفراً للمبيعات لتسجيل حسابك كمقاول معتمد لدينا.'
                    : 'Your request details will verify you as an authorized partner for scaling discounts.'}
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* الاسم */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    {isAr ? 'الاسم الكامل أو اسم شركة المقاولات/التشطيب *' : 'Full Name or Contracting Co. Name *'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'مثال: شركة الرواد للتشطيبات المعمارية' : 'e.g. Al-Rowad Architectural Finishing'}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 text-white transition-all placeholder:text-zinc-500"
                    required
                  />
                </div>

                {/* رقم الهاتف */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    {isAr ? 'رقم الهاتف للتواصل للتسعير *' : 'Contact Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isAr ? 'مثال: 091XXXXXXX' : 'e.g. 091XXXXXXX'}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 text-white transition-all placeholder:text-zinc-500 text-left dir-ltr"
                    required
                  />
                </div>

                {/* نوع النشاط */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    {isAr ? 'نوع المشروع / تصنيف النشاط *' : 'Activity / Project Classification *'}
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 text-white transition-all cursor-pointer"
                  >
                    {isAr ? (
                      <>
                        <option value="شركة تشطيب">شركة تشطيب وديكور</option>
                        <option value="مقاول مستمر">مقاول كهربائي حر</option>
                        <option value="مالك مشروع كمية كبيرة">مالك مشروع (فيلا / عمارة / مجمع)</option>
                        <option value="أخرى">أخرى</option>
                      </>
                    ) : (
                      <>
                        <option value="Finishing Company">Finishing & Decor Company</option>
                        <option value="Freelance Contractor">Independent Electrical Contractor</option>
                        <option value="Bulk Project Owner">Project Owner (Villa / Building)</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>

                {/* المواد المطلوبة */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    {isAr ? 'تفاصيل المواد، المقاسات، والكميات المطلوبة بالتفصيل *' : 'List of Wires, Lights, and Quantities *'}
                  </label>
                  <textarea
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder={isAr 
                      ? "اكتب هنا قائمة المواد والكميات المطلوبة بالتفصيل:\nمثال:\n- 20 لفة سلك 2.5 مم إيطالي\n- 150 سبوت لايت مقاس 7 سم لون أصفر 7 وات\n- كابلات نحاس مقاس..."
                      : "Type your detailed list here:\ne.g.:\n- 20 rolls of Italian wire 2.5 mm\n- 150 spotlights size 7cm, warm white, 7W\n- Copper cables size..."
                    }
                    rows={6}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/20 text-white transition-all placeholder:text-zinc-500 resize-none leading-relaxed"
                    required
                  />
                </div>
              </div>

              {/* زر الإرسال عبر الواتساب */}
              <button
                onClick={handleWhatsAppSubmit}
                className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 border border-blue-500"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>
                  {isAr ? 'إرسال طلب التسعير للواتساب' : 'Send Quote Request via WhatsApp'}
                </span>
              </button>

              {/* ملاحظة بخصوص التتبع */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs text-center leading-normal font-normal">
                {isAr 
                  ? '⚡ سيتلقى قسم المبيعات والكميات طلبك موضحاً عليه رمز تعريفي تلقائي للمقاولين لتمييزه وتسريعه.'
                  : '⚡ Sales department will receive this request flagged with a contractor code for priority handling.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
