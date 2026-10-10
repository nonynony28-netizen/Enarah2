export interface WireProduct {
  id: string
  name: string
  nameEn: string
  size: string
  sizeNumeric: number
  type: string
  typeEn: string
  origin: string
  originEn: string
  packaging: string
  packagingEn: string
  price: number
  copperPurity: string
  insulation: string
  applications: string
  applicationsEn: string
  image: string
  inStock: boolean
}

export const VERIFIED_WIRES: WireProduct[] = [
  {
    id: 'wire-1-5-it',
    name: 'سلك كهربائي إيطالي 1.5 مم',
    nameEn: 'Italian Single-Core Wire 1.5mm',
    size: '1.5 مم',
    sizeNumeric: 1.5,
    type: 'مفرد أحادي النواة',
    typeEn: 'Single-Core',
    origin: 'إيطاليا (Made in Italy)',
    originEn: 'Italy',
    packaging: 'لفة 100 متر',
    packagingEn: '100m Spool',
    price: 245,
    copperPurity: 'نحاس إلكتروليتي نقي 100%',
    insulation: 'عزل PVC فائق المقاومة للحرارة حتى 70°C',
    applications: 'تمديدات الإنارة المعمارية، المفاتيح والسبوتات، والخطوط الخفيفة.',
    applicationsEn: 'Architectural lighting circuits, light switches, and spots.',
    image: '/images/wires-italian-turkish-showcase.jpg',
    inStock: true
  },
  {
    id: 'wire-2-5-it',
    name: 'سلك كهربائي إيطالي 2.5 مم',
    nameEn: 'Italian Single-Core Wire 2.5mm',
    size: '2.5 مم',
    sizeNumeric: 2.5,
    type: 'مفرد أحادي النواة',
    typeEn: 'Single-Core',
    origin: 'إيطاليا (Made in Italy)',
    originEn: 'Italy',
    packaging: 'لفة 100 متر',
    packagingEn: '100m Spool',
    price: 375,
    copperPurity: 'نحاس إلكتروليتي نقي 100%',
    insulation: 'عزل PVC فائق المقاومة للحرارة حتى 70°C',
    applications: 'تأسيس مخارج الكهرباء (البرايز)، الأفياش العامة، والأجهزة المنزلية المتوسطة.',
    applicationsEn: 'General wall outlets, sockets, and medium home appliances.',
    image: '/images/wires-italian-turkish-showcase.jpg',
    inStock: true
  },
  {
    id: 'wire-4-0-it',
    name: 'سلك كهربائي إيطالي 4.0 مم',
    nameEn: 'Italian Single-Core Wire 4.0mm',
    size: '4.0 مم',
    sizeNumeric: 4.0,
    type: 'مفرد أحادي النواة',
    typeEn: 'Single-Core',
    origin: 'إيطاليا (Made in Italy)',
    originEn: 'Italy',
    packaging: 'لفة 100 متر',
    packagingEn: '100m Spool',
    price: 585,
    copperPurity: 'نحاس إلكتروليتي نقي 100%',
    insulation: 'عزل حراري عالي التحمل ضد الاشتعال',
    applications: 'المكيفات (حتى 24,000 BTU)، سخانات المياه، وأفران المطابخ الكهربائية.',
    applicationsEn: 'Air conditioners (up to 24k BTU), water heaters, and electric kitchen ovens.',
    image: '/images/wires-italian-turkish-showcase.jpg',
    inStock: true
  },
  {
    id: 'wire-6-0-it',
    name: 'سلك كهربائي إيطالي 6.0 مم',
    nameEn: 'Italian Single-Core Wire 6.0mm',
    size: '6.0 مم',
    sizeNumeric: 6.0,
    type: 'مفرد أحادي النواة',
    typeEn: 'Single-Core',
    origin: 'إيطاليا (Made in Italy)',
    originEn: 'Italy',
    packaging: 'لفة 100 متر',
    packagingEn: '100m Spool',
    price: 845,
    copperPurity: 'نحاس إلكتروليتي نقي 100%',
    insulation: 'عزل ثنائي الطبقات فائق الأمان ومضاد للهب',
    applications: 'خطوط التغذية الفرعية للمطابخ، أحمال التكييف المركزي، وغرف الخدمات.',
    applicationsEn: 'Sub-feeder lines for kitchens, central HVAC, and utility rooms.',
    image: '/images/wires-italian-turkish-showcase.jpg',
    inStock: true
  },
  {
    id: 'wire-10-0-it',
    name: 'سلك كهربائي إيطالي 10.0 مم',
    nameEn: 'Italian Heavy Wire 10.0mm',
    size: '10.0 مم',
    sizeNumeric: 10.0,
    type: 'مفرد مجدول فائق القوة',
    typeEn: 'Stranded Heavy Single-Core',
    origin: 'إيطاليا (Made in Italy)',
    originEn: 'Italy',
    packaging: 'لفة 100 متر',
    packagingEn: '100m Spool',
    price: 1350,
    copperPurity: 'نحاس أحمر نقي مجدول 100%',
    insulation: 'عزل صناعي ثقيل مقاوم للرطوبة والحرارة العالية',
    applications: 'تغذية لوحات التوزيع الفرعية، المصاعد، والمضخات الغاطسة الكبرى.',
    applicationsEn: 'Distribution board mains, elevators, and large submersible pumps.',
    image: '/images/wires-italian-turkish-showcase.jpg',
    inStock: true
  },
  {
    id: 'wire-16-0-it',
    name: 'سلك كهربائي إيطالي 16.0 مم',
    nameEn: 'Italian Heavy Wire 16.0mm',
    size: '16.0 مم',
    sizeNumeric: 16.0,
    type: 'مفرد مجدول صناعي',
    typeEn: 'Industrial Stranded Wire',
    origin: 'إيطاليا (Made in Italy)',
    originEn: 'Italy',
    packaging: 'لفة 100 متر',
    packagingEn: '100m Spool',
    price: 1980,
    copperPurity: 'نحاس أحمر نقي مجدول 100%',
    insulation: 'عزل صناعي متقدم ضد الاحتكاك والضغط الميكانيكي',
    applications: 'الخطوط المغذية الرئيسية من العداد إلى اللوحة العمومية للمباني السكنية والتجارية.',
    applicationsEn: 'Main service entrance lines from electric meter to main distribution panel.',
    image: '/images/wires-italian-turkish-showcase.jpg',
    inStock: true
  },
  {
    id: 'wire-25-0-it',
    name: 'سلك كهربائي إيطالي 25.0 مم',
    nameEn: 'Italian Industrial Wire 25.0mm',
    size: '25.0 مم',
    sizeNumeric: 25.0,
    type: 'مفرد مجدول صناعي ثقيل',
    typeEn: 'Heavy Industrial Stranded Wire',
    origin: 'إيطاليا (Made in Italy)',
    originEn: 'Italy',
    packaging: 'لفة 100 متر',
    packagingEn: '100m Spool',
    price: 2950,
    copperPurity: 'نحاس أحمر نقي مجدول 100%',
    insulation: 'عزل مدرع فائق التحمل للضغوط الكبرى',
    applications: 'محطات التحويل، المولدات الكهربائية الكبرى، والمجمعات التجارية والصناعية.',
    applicationsEn: 'Substations, commercial generators, and heavy industrial facilities.',
    image: '/images/wires-italian-turkish-showcase.jpg',
    inStock: true
  },
  {
    id: 'cable-3x25-tr',
    name: 'كابل تركي معتمد 3×2.5 مم مع سلك تأريض',
    nameEn: 'Turkish Certified Cable 3x2.5mm + Earth',
    size: '3×2.5 مم',
    sizeNumeric: 2.5,
    type: 'كابل متعدد القلوب (Multi-Core)',
    typeEn: 'Multi-Core Cable',
    origin: 'تركيا (TÜRK MALI)',
    originEn: 'Turkey',
    packaging: 'لفة 100 متر',
    packagingEn: '100m Spool',
    price: 890,
    copperPurity: 'نحاس نقي 100% معتمد للمواصفات القياسية الأوروبية',
    insulation: 'غلاف خارجي مضاعف مقاوم للعوامل الجوية والرطوبة',
    applications: 'التأسيسات الخارجية، ورش العمل، والتوصيلات الأرضية الآمنة المؤرضة.',
    applicationsEn: 'Outdoor installations, workshops, and safe grounded wiring.',
    image: '/images/wires-italian-turkish-showcase.jpg',
    inStock: true
  },
  {
    id: 'cable-3x40-tr',
    name: 'كابل تركي معتمد 3×4.0 مم مع سلك تأريض',
    nameEn: 'Turkish Certified Cable 3x4.0mm + Earth',
    size: '3×4.0 مم',
    sizeNumeric: 4.0,
    type: 'كابل متعدد القلوب (Multi-Core)',
    typeEn: 'Multi-Core Cable',
    origin: 'تركيا (TÜRK MALI)',
    originEn: 'Turkey',
    packaging: 'لفة 100 متر',
    packagingEn: '100m Spool',
    price: 1390,
    copperPurity: 'نحاس نقي 100% معتمد للمواصفات القياسية الأوروبية',
    insulation: 'غلاف خارجي مضاعف فائق المتانة ضد الضغط والانحناء',
    applications: 'الأحمال الثقيلة الخارجية، المضخات الزراعية والصناعية، والمكيفات الخارجية.',
    applicationsEn: 'Heavy outdoor loads, agricultural pumps, and exterior HVAC units.',
    image: '/images/wires-italian-turkish-showcase.jpg',
    inStock: true
  }
]
