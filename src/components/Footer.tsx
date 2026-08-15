import { Link } from 'react-router-dom'
import {
  Lightbulb,
  Phone,
  Mail,
  MapPin,
  Facebook
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
    <footer className="bg-[#09090b] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ${isAr ? 'text-right' : 'text-left'}`}>
          {/* Brand Info */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2.5 ${isAr ? 'justify-start' : 'justify-start'}`}>
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                {t('hero.title.part1')} {t('hero.title.part2')}
              </span>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
              {isAr 
                ? 'وجهتك الأولى لجميع احتياجات الإضاءة والمواد الكهربائية. نقدم حلولاً متكاملة بجودة عالية وخبرة احترافية.'
                : 'Your premier destination for all lighting and electrical needs. We offer high-quality integrated solutions with professional expertise.'
              }
            </p>

            {/* Social Links */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="https://www.facebook.com/share/1BxjvUxxvG/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-blue-600 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all duration-200"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>فيسبوك</span>
              </a>

              <a
                href="https://www.instagram.com/enara_hadetha?igsh=MXVqaGlqdHN5cnM5OQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-pink-600 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>إنستغرام</span>
              </a>

              <a
                href="https://www.tiktok.com/@modernenara?_r=1&_t=ZS-96dCObkuFUK"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-black border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2.01 3.7 2.37v3.83c-1.39-.09-2.74-.61-3.87-1.48a7.25 7.25 0 0 1-2.47-3.08v8.66c0 1.25-.26 2.5-.77 3.66a7.56 7.56 0 0 1-4.8 4.41c-1.25.38-2.57.44-3.85.17a7.66 7.66 0 0 1-5.18-4.47 7.7 7.7 0 0 1 .15-5.06c.55-1.42 1.56-2.65 2.87-3.48a7.84 7.84 0 0 1 7.21-.57v4.02a3.79 3.79 0 0 0-2.31 1.09 3.73 3.73 0 0 0-1.12 2.3c-.09.78.11 1.57.55 2.2a3.78 3.78 0 0 0 4.14 1.48c.88-.23 1.66-.78 2.2-1.52.54-.75.82-1.65.79-2.57V.02z"/>
                </svg>
                <span>تيك توك</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">
              {t('footer.links')}
            </h3>

            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">
              {isAr ? 'معلومات التواصل' : 'Contact Information'}
            </h3>

            <ul className="space-y-3">
              <li className={`flex items-center gap-2.5 text-zinc-400 text-xs sm:text-sm ${isAr ? 'justify-start' : 'justify-start'}`}>
                <Phone className="w-4 h-4 text-blue-400" />
                <span dir="ltr">0916580068 / 0926580068</span>
              </li>

              <li className={`flex items-center gap-2.5 text-zinc-400 text-xs sm:text-sm ${isAr ? 'justify-start' : 'justify-start'}`}>
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info@enarahmodern.com" className="hover:text-white transition-colors">
                  info@enarahmodern.com
                </a>
              </li>

              <li className={`flex items-start gap-2.5 text-zinc-400 text-xs sm:text-sm leading-relaxed ${isAr ? 'justify-start' : 'justify-start'}`}>
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
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
        <div className="mt-12 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-xs font-normal">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
