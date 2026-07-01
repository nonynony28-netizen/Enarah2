import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
  isAr: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navbar
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.brands': 'الوكالات',
    'nav.projects': 'مشاريعنا',
    'nav.wirePrices': 'أسعار الأسلاك',
    'nav.blog': 'المدونة',
    'nav.about': 'من نحن',
    'nav.branches': 'فروعنا',
    'nav.contact': 'تواصل معنا',
    'nav.servicesDropdown': 'الأقسام والأسعار',
    
    // Hero
    'hero.title.part1': 'الإنارة',
    'hero.title.part2': 'الحديثة',
    'hero.subtitle': 'كل ما تحتاجه من الإضاءة والتأسيس الكهربائي بجودة عالمية وحلول متكاملة تلبي تطلعاتك',
    'hero.btn.products': 'استعرض المنتجات',
    'hero.btn.contact': 'تواصل معنا',

    // Why Us
    'why.title.part1': 'لماذا',
    'why.title.part2': 'نحن؟',
    'why.card1.title': 'جودة عالية ومعتمدة',
    'why.card1.desc': 'نختار كافة مواد التأسيس والإنارة بعناية فائقة لتطابق أعلى معايير الجودة والأمان لتدوم طويلاً.',
    'why.card1.badge': 'مواد أصلية',
    'why.card2.title': 'حلول كهربائية وإنارة متكاملة',
    'why.card2.desc': 'نوفر لك كل ما تحتاجه لتأسيس منزلك أو مشروعك من كابلات، أسلاك، مفاتيح ذكية، وسبوتات إنارة في مكان واحد دون عناء البحث.',
    'why.card2.badge': 'شامل ومتكامل',

    // Simulator
    'sim.title.part1': 'مُحاكي الإضاءة',
    'sim.title.part2': 'التفاعلي',
    'sim.desc': 'جرب توزيع ألوان ومقاسات الإضاءة بنفسك في صالة افتراضية، واختر ما يناسب ذوقك وبيتك',
    'sim.opt1': '1. اختر حرارة لون الإضاءة:',
    'sim.opt2': '2. مصادر الإضاءة المتوفرة:',
    'sim.cove': 'الإنارة المخفية (LED Strip)',
    'sim.spot': 'السبوت لايت (Spotlight)',
    'sim.tip': 'نصيحة مهندسي الإنارة الحديثة:',

    // Wires
    'wire.title.part1': 'نشرة الأسلاك',
    'wire.title.part2': 'الإيطالية',
    'wire.update': 'تحديث اليوم:',
    'wire.approved': 'الأسعار التقريبية المعتمدة',
    'wire.roll': 'مفرد (لفة 100 متر)',
    'wire.order': 'اطلب الآن',
    'wire.currency': 'د.ل',

    // Contact
    'contact.title.part1': 'تواصل',
    'contact.title.part2': 'معنا',
    'contact.name': 'الاسم الكامل',
    'contact.phone': 'رقم الهاتف للتواصل',
    'contact.message': 'رسالتك',
    'contact.submit': 'إرسال الرسالة',
    'contact.sending': 'جاري الإرسال...',
    'contact.success': 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
    'contact.required': 'يرجى تعبئة جميع الحقول',

    // Chatbot
    'chat.title': 'مساعدك الذكي',
    'chat.placeholder': 'اكتب رسالتك هنا...',
    'chat.welcome': 'مرحباً بك! أنا مساعدك الذكي من الإنارة الحديثة. كيف يمكنني مساعدتك اليوم بخصوص منتجاتنا وأسعارنا؟',

    // Footer
    'footer.slogan': 'شريكك الموثوق في تأسيس الكهرباء والإنارة الذكية الراقية.',
    'footer.links': 'روابط سريعة',
    'footer.rights': 'جميع الحقوق محفوظة © 2026 شركة الإنارة الحديثة',
    'footer.email': 'البريد الإلكتروني:'
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.brands': 'Brands',
    'nav.projects': 'Our Projects',
    'nav.wirePrices': 'Wire Prices',
    'nav.blog': 'Blog',
    'nav.about': 'About Us',
    'nav.branches': 'Branches',
    'nav.contact': 'Contact Us',
    'nav.servicesDropdown': 'Sections & Prices',

    // Hero
    'hero.title.part1': 'ENARAH',
    'hero.title.part2': 'MODERN',
    'hero.subtitle': 'Everything you need for premium lighting and electrical installations with international quality and integrated solutions.',
    'hero.btn.products': 'Explore Products',
    'hero.btn.contact': 'Contact Us',

    // Why Us
    'why.title.part1': 'Why',
    'why.title.part2': 'Choose Us?',
    'why.card1.title': 'Premium & Certified Quality',
    'why.card1.desc': 'We select all installation and lighting materials with extreme care to match the highest quality and safety standards.',
    'why.card1.badge': 'Original Materials',
    'why.card2.title': 'Complete Electrical & Lighting Solutions',
    'why.card2.desc': 'We provide everything you need to establish your home or project from cables, wires, smart switches, and spotlights in one place.',
    'why.card2.badge': 'All-in-One',

    // Simulator
    'sim.title.part1': 'Interactive',
    'sim.title.part2': 'Lighting Simulator',
    'sim.desc': 'Experiment with light colors and positions in our virtual living room to find the perfect style for your space.',
    'sim.opt1': '1. Choose light color temperature:',
    'sim.opt2': '2. Available lighting sources:',
    'sim.cove': 'Cove Light (LED Strip)',
    'sim.spot': 'Spotlight',
    'sim.tip': 'Modern Lighting Tip:',

    // Wires
    'wire.title.part1': 'Italian Wires',
    'wire.title.part2': 'Price List',
    'wire.update': 'Today\'s Update:',
    'wire.approved': 'Approved Standard Prices',
    'wire.roll': 'Single (100m Roll)',
    'wire.order': 'Order Now',
    'wire.currency': 'LYD',

    // Contact
    'contact.title.part1': 'Contact',
    'contact.title.part2': 'Us',
    'contact.name': 'Full Name',
    'contact.phone': 'Phone Number',
    'contact.message': 'Your Message',
    'contact.submit': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Your message has been sent successfully! We will contact you soon.',
    'contact.required': 'Please fill all fields',

    // Chatbot
    'chat.title': 'Smart Assistant',
    'chat.placeholder': 'Type your message...',
    'chat.welcome': 'Welcome! I am your AI assistant from ENARAHMODERN. How can I help you today with our products and prices?',

    // Footer
    'footer.slogan': 'Your trusted partner in establishing electricity and high-end smart lighting.',
    'footer.links': 'Quick Links',
    'footer.rights': 'All rights reserved © 2026 ENARAHMODERN Company',
    'footer.email': 'Email:'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('enarah_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('enarah_lang', language);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // ضبط اتجاه الخطوط وبعض تنسيقات الاتجاه
    if (language === 'en') {
      document.body.classList.add('ltr-layout');
      document.body.classList.remove('rtl-layout');
    } else {
      document.body.classList.add('rtl-layout');
      document.body.classList.remove('ltr-layout');
    }
  }, [language, dir]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['ar'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir, isAr: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
