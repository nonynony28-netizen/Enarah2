import { Link } from 'react-router-dom'
import {
  Lightbulb,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function Footer() {
  const { t, isAr } = useLanguage()

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
    { path: '/brands', label: t('nav.brands') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ]

  return (
    <footer className="bg-[#111d32]/40 backdrop-blur-md border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${isAr ? 'text-right' : 'text-left'}`}>
          {/* Brand Info */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2 ${isAr ? 'justify-start' : 'justify-start'}`}>
              <Lightbulb className="w-5 h-5 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.55)]" />
              <span className="text-blue-400 font-bold text-lg drop-shadow-[0_0_14px_rgba(59,130,246,0.45)]">
                {t('hero.title.part1')} {t('hero.title.part2')}
              </span>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">
              {isAr 
                ? 'وجهتك الأولى لجميع احتياجات الإضاءة والمواد الكهربائية. نقدم حلولاً متكاملة بجودة عالية وخبرة احترافية.'
                : 'Your premier destination for all lighting and electrical needs. We offer high-quality integrated solutions with professional expertise.'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-blue-400 font-semibold mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.35)]">
              {t('footer.links')}
            </h3>

            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/65 hover:text-blue-300 text-sm transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-blue-400 font-semibold mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.35)]">
              {isAr ? 'معلومات التواصل' : 'Contact Information'}
            </h3>

            <ul className="space-y-3">
              <li className={`flex items-center gap-2 text-white/70 text-sm ${isAr ? 'justify-start' : 'justify-start'}`}>
                <Phone className="w-4 h-4 text-blue-400" />
                <span dir="ltr">0916580068 / 0926580068</span>
              </li>

              <li className={`flex items-center gap-2 text-white/70 text-sm ${isAr ? 'justify-start' : 'justify-start'}`}>
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info@enarahmodern.com" className="hover:text-blue-400 transition-colors">
                  info@enarahmodern.com
                </a>
              </li>

              <li className={`flex items-start gap-2 text-white/70 text-sm leading-relaxed ${isAr ? 'justify-start' : 'justify-start'}`}>
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <span>
                  {isAr 
                    ? 'ليبيا - بنغازي - الليثي - مقابل مدرسة العيد الفضي'
                    : 'Libya - Benghazi - Al-Laythi - Opposite Silver Feast School'
                  }
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-white/40 text-sm">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
