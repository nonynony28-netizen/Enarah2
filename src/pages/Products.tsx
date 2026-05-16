// file name: src/pages/Products.tsx

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef(null)

  const isInView = useInView(ref, {
    once: true,
    margin: '-50px',
  })

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
            }
          : {
              opacity: 0,
              y: 30,
            }
      }
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// ======================================
// Types
// ======================================
type ProductItem = {
  id: string
  name: string
  description: string
  image: string
  video?: string
}

export default function Products() {
  const [categories, setCategories] = useState<
    ProductItem[]
  >([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ======================================
        // جلب البيانات من MongoDB API
        // ======================================
        const res = await fetch(
          'https://enarah2.vercel.app/api/get-users'
        )

        const data = await res.json()

        // ======================================
        // تحقق من نجاح الجلب
        // ======================================
        if (
          res.ok &&
          data.success &&
          Array.isArray(data.data)
        ) {
          const formattedProducts: ProductItem[] =
            data.data.map(
              (
                item: {
                  _id?: string
                  name?: string
                  email?: string
                  phone?: string
                },
                index: number
              ) => {
                let mediaData: {
                  imageUrl?: string
                  videoUrl?: string
                } = {}

                // ======================================
                // استخراج روابط الصورة والفيديو
                // ======================================
                try {
                  mediaData = item.phone
                    ? JSON.parse(item.phone)
                    : {}
                } catch {
                  mediaData = {}
                }

                return {
                  id:
                    item._id ||
                    String(index),

                  // عنوان المنتج
                  name:
                    item.name ||
                    'بدون اسم',

                  // الوصف
                  description:
                    item.email &&
                    !item.email.includes(
                      '@upload.local'
                    ) &&
                    item.email !==
                      'بدون وصف'
                      ? item.email
                      : '',

                  // الصورة
                  image:
                    mediaData.imageUrl ||
                    '/images/default-product.jpg',

                  // الفيديو
                  video:
                    mediaData.videoUrl ||
                    '',
                }
              }
            )

          setCategories(
            formattedProducts
          )

          // ======================================
          // دعم الانتقال المباشر عبر #id
          // ======================================
          setTimeout(() => {
            const hash =
              window.location.hash.replace(
                '#',
                ''
              )

            if (hash) {
              const target =
                document.getElementById(
                  hash
                )

              if (target) {
                target.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }
            }
          }, 300)
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error(
          'Fetch Products Error:',
          error
        )

        setCategories([])
      }
    }

    fetchProducts()
  }, [])

  return (
    <div
      className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen"
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* ======================================
            Title
        ====================================== */}
        <FadeIn>
          <div className="text-center mb-14">
            <h1 className="text-3xl font-bold text-white">
              منتجاتنا
            </h1>
          </div>
        </FadeIn>

        {/* ======================================
            Products Grid
        ====================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(
            (cat, i) => (
              <FadeIn
                key={cat.id}
                delay={i * 0.1}
              >
                <div
                  id={`product-${cat.id}`}
                  className="bg-darkblue-light rounded-xl overflow-hidden border border-white/5 scroll-mt-28"
                >
                  {/* ======================================
                      Product Image
                  ====================================== */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-[250px] object-cover"
                    onError={(
                      e
                    ) => {
                      e.currentTarget.src =
                        '/images/default-product.jpg'
                    }}
                  />

                  {/* ======================================
                      Product Content
                  ====================================== */}
                  <div className="p-4">
                    {/* Product Name + Smooth Link */}
                    <h3 className="text-white font-bold mb-2">
                      <a
                        href={`#product-${cat.id}`}
                        className="text-white hover:text-blue-400 transition-colors"
                        style={{
                          textDecoration:
                            'none',
                        }}
                        onClick={(
                          e
                        ) => {
                          e.preventDefault()

                          const target =
                            document.getElementById(
                              `product-${cat.id}`
                            )

                          if (
                            target
                          ) {
                            target.scrollIntoView(
                              {
                                behavior:
                                  'smooth',
                                block:
                                  'start',
                              }
                            )

                            window.history.replaceState(
                              null,
                              '',
                              `#product-${cat.id}`
                            )
                          }
                        }}
                      >
                        {cat.name}
                      </a>
                    </h3>

                    {/* Product Description */}
                    {cat.description && (
                      <p className="text-white/60 text-sm leading-relaxed">
                        {
                          cat.description
                        }
                      </p>
                    )}

                    {/* Product Video */}
                    {cat.video && (
                      <a
                        href={
                          cat.video
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-blue-400 text-sm hover:text-blue-300 transition-colors"
                      >
                        مشاهدة الفيديو
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            )
          )}
        </div>

        {/* ======================================
            Empty State
        ====================================== */}
        {categories.length === 0 && (
          <div className="text-center py-20 text-white/60">
            لا توجد منتجات حالياً
          </div>
        )}
      </div>
    </div>
  )
}
