import { Link } from 'react-router-dom'
import { Lightbulb, Phone, Mail, MapPin } from 'lucide-react'

const quickLinks = [
  { path: '/', label: 'الرئيسية' },
  { path: '/products', label: 'المنتجات' },
  { path: '/brands', label: 'الماركات' },
  { path: '/projects', label: 'المشاريع' },
  { path: '/about', label: 'من نحن' },
  { path: '/contact', label: 'تواصل معنا' },
]

const productLinks = [
  'ثريات',
  'سبوتات',
  'LED Profile',
  'أسلاك وكوابل',
  'مواد تأسيس كهربائي',
  'مفاتيح وبرايز',
]

export default function Footer() {
  return (
    <footer className="bg-darkblue-light border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-gold" />
              <span className="text-gold font-bold text-lg">الإنارة الحديثة</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              وجهتك الأولى لجميع احتياجات الإضاءة والمواد الكهربائية. نقدم حلولاً متكاملة بجودة عالية وخبرة احترافية.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-4">المنتجات</h3>
            <ul className="space-y-2">
              {productLinks.map((item) => (
                <li key={item}>
                  <Link
                    to="/products"
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-4">معلومات التواصل</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-gold" />
                <span>+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-gold" />
                <span>info@modernlighting.sa</span>
              </li>
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-gold mt-0.5" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} الإنارة الحديثة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
