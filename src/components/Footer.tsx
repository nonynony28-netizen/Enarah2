// file name: src/components/Footer.tsx

import { Link } from 'react-router-dom'
import {
  Lightbulb,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

const quickLinks = [
  {
    path: '/#hero',
    label: 'الرئيسية',
  },
  {
    path: '/products',
    label: 'المنتجات',
  },
  {
    path: '/#brands',
    label: 'الشركات العالمية',
  },
  {
    path: '/#projects',
    label: 'المشاريع',
  },
  {
    path: '/#about',
    label: 'من نحن',
  },
  {
    path: '/contact',
    label: 'تواصل معنا',
  },
]

const productLinks = [
  {
    label: 'ثريات',
    path: '/products#product-1',
  },
  {
    label: 'سبوتات',
    path: '/products#product-2',
  },
  {
    label: 'LED Profile',
    path: '/products#product-3',
  },
  {
    label: 'أسلاك وكوابل',
    path: '/products#product-4',
  },
  {
    label: 'مواد تأسيس كهربائي',
    path: '/products#product-5',
  },
  {
    label: 'مفاتيح وبرايز',
    path: '/products#product-6',
  },
]

export default function Footer() {
  // ======================================
  // Professional Smooth Scroll Handler
  // ======================================
  const handleSmoothNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault()

    // ======================================
    // روابط تحتوي Hash
    // ======================================
    if (path.includes('#')) {
      const [basePath, hash] =
        path.split('#')

      // ======================================
      // إذا نفس الصفحة الحالية
      // ======================================
      if (
        window.location.pathname ===
          basePath ||
        (basePath === '/' &&
          window.location.pathname ===
            '/')
      ) {
        const target =
          document.getElementById(
            hash
          )

        if (target) {
          const navbarOffset =
            220

          const elementTop =
            target.offsetTop

          window.scrollTo({
            top:
              elementTop -
              navbarOffset,
            behavior:
              'smooth',
          })

          window.history.replaceState(
            null,
            '',
            path
          )
        }
      } else {
        // ======================================
        // صفحة أخرى
        // ======================================
        window.location.href =
          path
      }
    } else {
      // ======================================
      // روابط عادية بدون Hash
      // ======================================
      window.location.href =
        path
    }
  }

  return (
    <footer className="bg-darkblue-light border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.55)]" />

              <span className="text-blue-400 font-bold text-lg drop-shadow-[0_0_14px_rgba(59,130,246,0.45)]">
                الإنارة الحديثة
              </span>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">
              وجهتك الأولى لجميع
              احتياجات الإضاءة
              والمواد الكهربائية.
              نقدم حلولاً متكاملة
              بجودة عالية وخبرة
              احترافية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-blue-400 font-semibold mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.35)]">
              روابط سريعة
            </h3>

            <ul className="space-y-2">
              {quickLinks.map(
                (link) => (
                  <li
                    key={
                      link.path
                    }
                  >
                    <a
                      href={
                        link.path
                      }
                      onClick={(
                        e
                      ) =>
                        handleSmoothNavigation(
                          e,
                          link.path
                        )
                      }
                      className="text-white/65 hover:text-blue-300 text-sm transition-all duration-300 cursor-pointer"
                    >
                      {
                        link.label
                      }
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-blue-400 font-semibold mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.35)]">
              المنتجات
            </h3>

            <ul className="space-y-2">
              {productLinks.map(
                (item) => (
                  <li
                    key={
                      item.label
                    }
                  >
                    <Link
                      to={
                        item.path
                      }
                      className="text-white/65 hover:text-blue-300 text-sm transition-all duration-300 cursor-pointer"
                    >
                      {
                        item.label
                      }
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-blue-400 font-semibold mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.35)]">
              معلومات التواصل
            </h3>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />

                <span>
                  0916580068 /
                  0926580068
                </span>
              </li>

              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />

                <span>
                  enarahmodern@gmail.com
                </span>
              </li>

              <li className="flex items-start gap-2 text-white/70 text-sm leading-relaxed">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />

                <span>
                  ليبيا - بنغازي
                  - الليثي -
                  مقابل مدرسة
                  العيد الفضي
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-white/40 text-sm">
            ©{' '}
            {new Date().getFullYear()}{' '}
            الإنارة الحديثة.
            جميع الحقوق
            محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
