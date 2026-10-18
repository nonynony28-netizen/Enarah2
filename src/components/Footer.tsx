import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function Footer() {
  const { isAr } = useLanguage()

  const quickLinks = [
    { path: '/products', label: isAr ? 'المنتجات والكتالوجات' : 'Products & Catalog' },
    { path: '/offers', label: isAr ? 'التخفيضات والعروض' : 'Offers & Discounts' },
    { path: '/projects', label: isAr ? 'المشاريع المنفذة' : 'Executed Projects' },
    { path: '/brands', label: isAr ? 'العلامات التجارية' : 'Global Brands' },
    { path: '/wire-prices', label: isAr ? 'أسعار الأسلاك' : 'Wire Prices' },
    { path: '/contractors', label: isAr ? 'قسم المقاولين والكميات' : 'Contractors & Wholesale' },
    { path: '/branches', label: isAr ? 'فروعنا' : 'Our Branches' },
    { path: '/about', label: isAr ? 'عن الشركة' : 'About Company' },
    { path: '/blog', label: isAr ? 'المدونة المعمارية' : 'Architectural Blog' },
    { path: '/game', label: isAr ? 'لعبة بطل الإنارة' : 'Lighting Game' },
    { path: '/contact', label: isAr ? 'تواصل معنا' : 'Contact Us' },
  ]

  return (
    <footer className="bg-[#101820] text-white/70 border-t border-white/10 pt-20 pb-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Column 1: Brand & Legacy (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <span className="font-bold text-white text-2xl tracking-tight block">
                {isAr ? 'شركة الإنارة' : 'ENARAH MODERN'}
              </span>
              <span className="text-[11px] font-mono tracking-widest text-[#0062D2] uppercase block mt-1">
                ENARAH MODERN · EST. 1988
              </span>
            </div>

            <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-sm">
              {isAr
                ? 'روّاد توريد وحلول الإضاءة المعمارية والمواد الكهربائية المعتمدة في ليبيا منذ أكثر من ثلاثة عقود. نسعى لتقديم أعلى معايير الجودة والسلامة والتصميم العصري.'
                : 'Pioneering architectural lighting and certified electrical infrastructure in Libya for over three decades, committed to quality and modern safety.'}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-white/40">
              <span>{isAr ? 'بنغازي، ليبيا' : 'Benghazi, Libya'}</span>
              <span>·</span>
              <span>{isAr ? 'س.ت: 1988/4432' : 'C.R: 1988/4432'}</span>
            </div>
          </div>

          {/* Column 2: Quick Links (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              {isAr ? 'التنقل السريع' : 'Quick Navigation'}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Benghazi Showroom (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              {isAr ? 'التواصل' : 'Contact & Showroom'}
            </h4>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0062D2] shrink-0 mt-1" />
                <span className="leading-relaxed">
                  {isAr
                    ? 'ليبيا - بنغازي - الليثي - مقابل مدرسة العيد الفضي'
                    : 'Libya - Benghazi - Al-Laythi - Opposite Al-Eid Al-Fiddi School'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0062D2] shrink-0" />
                <a href="tel:+218916580068" className="hover:text-white transition-colors" dir="ltr">
                  +218 91 658 0068
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0062D2] shrink-0" />
                <a href="tel:+218926580068" className="hover:text-white transition-colors" dir="ltr">
                  +218 92 658 0068
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#0062D2] shrink-0" />
                <span>
                  {isAr ? 'السبت - الخميس: 8:30 ص - 9:00 م' : 'Sat - Thu: 8:30 AM - 9:00 PM'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} {isAr ? 'شركة الإنارة الحديثة. جميع الحقوق محفوظة.' : 'Enarah Modern Co. All rights reserved.'}</p>
          <div className="flex items-center gap-6">
            <span>Light Shapes Space</span>
            <span>·</span>
            <span>Enarah Modern Since 1988</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
