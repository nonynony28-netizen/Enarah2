// file name: src/pages/Products.tsx

import {
  useRef,
  useEffect,
  useState,
  useMemo,
} from 'react'

import {
  motion,
  useInView,
  AnimatePresence,
} from 'framer-motion'

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
  const [categories, setCategories] =
    useState<ProductItem[]>(
      []
    )

  const [selectedCategory, setSelectedCategory] =
    useState('الكل')

  const [selectedProduct, setSelectedProduct] =
    useState<ProductItem | null>(
      null
    )

  const [loading, setLoading] =
    useState(true)

  // ======================================
  // Product Category Detection
  // ======================================
  const filterOptions = [
    'الكل',
    'ثريات',
    'سبوتات',
    'LED',
    'أسلاك',
    'كهرباء',
  ]

  const getCategory = (
    productName: string
  ) => {
    const name =
      productName.toLowerCase()

    if (
      name.includes('ثريا') ||
      name.includes('نجفة')
    ) {
      return 'ثريات'
    }

    if (
      name.includes('سبوت') ||
      name.includes('spot')
    ) {
      return 'سبوتات'
    }

    if (
      name.includes('led')
    ) {
      return 'LED'
    }

    if (
      name.includes('سلك') ||
      name.includes('كوابل') ||
      name.includes('كابل')
    ) {
      return 'أسلاك'
    }

    return 'كهرباء'
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          'https://enarah2.vercel.app/api/get-users'
        )

        const data =
          await res.json()

        if (
          res.ok &&
          data.success &&
          Array.isArray(
            data.data
          )
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

                try {
                  mediaData =
                    item.phone
                      ? JSON.parse(
                          item.phone
                        )
                      : {}
                } catch {
                  mediaData = {}
                }

                return {
                  id:
                    item._id ||
                    String(index),

                  name:
                    item.name ||
                    'بدون اسم',

                  description:
                    item.email &&
                    !item.email.includes(
                      '@upload.local'
                    )
                      ? item.email
                      : '',

                  image:
                    mediaData.imageUrl ||
                    '/images/default-product.jpg',

                  video:
                    mediaData.videoUrl ||
                    '',
                }
              }
            )

          setCategories(
            formattedProducts
          )
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error(
          'Fetch Products Error:',
          error
        )

        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // ======================================
  // Filtered Products
  // ======================================
  const filteredProducts =
    useMemo(() => {
      if (
        selectedCategory ===
        'الكل'
      ) {
        return categories
      }

      return categories.filter(
        (
          product
        ) =>
          getCategory(
            product.name
          ) ===
          selectedCategory
      )
    }, [
      categories,
      selectedCategory,
    ])

  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* ======================================
            Title
        ====================================== */}
        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              منتجاتنا
            </h1>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {filterOptions.map(
                (
                  filter
                ) => (
                  <button
                    key={
                      filter
                    }
                    onClick={() =>
                      setSelectedCategory(
                        filter
                      )
                    }
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      selectedCategory ===
                      filter
                        ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.45)]'
                        : 'bg-darkblue-light text-white/70 hover:text-white hover:bg-blue-500/20'
                    }`}
                  >
                    {
                      filter
                    }
                  </button>
                )
              )}
            </div>
          </div>
        </FadeIn>

        {/* ======================================
            Skeleton Loading
        ====================================== */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({
              length: 6,
            }).map(
              (
                _,
                i
              ) => (
                <div
                  key={i}
                  className="bg-darkblue-light rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="w-full h-[250px] bg-white/5" />

                  <div className="p-4">
                    <div className="h-5 bg-white/5 rounded mb-3" />

                    <div className="h-4 bg-white/5 rounded w-3/4" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ======================================
            Products Grid
        ====================================== */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(
              (
                cat,
                i
              ) => (
                <FadeIn
                  key={
                    cat.id
                  }
                  delay={
                    i * 0.08
                  }
                >
                  <motion.div
                    whileHover={{
                      y: -8,
                    }}
                    className="bg-darkblue-light rounded-xl overflow-hidden border border-white/5 hover:border-blue-400/30 transition-all duration-300 cursor-pointer"
                    onClick={() =>
                      setSelectedProduct(
                        cat
                      )
                    }
                  >
                    {/* Product Image */}
                    <div className="overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-[250px] object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src =
                            '/images/default-product.jpg'
                        }}
                      />
                    </div>

                    {/* Product Content */}
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-2 text-lg">
                        {
                          cat.name
                        }
                      </h3>

                      {cat.description && (
                        <p className="text-white/60 text-sm line-clamp-3">
                          {
                            cat.description
                          }
                        </p>
                      )}

                      <button className="mt-4 text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">
                        عرض التفاصيل
                      </button>
                    </div>
                  </motion.div>
                </FadeIn>
              )
            )}
          </div>
        )}

        {/* ======================================
            Empty State
        ====================================== */}
        {!loading &&
          filteredProducts.length ===
            0 && (
            <div className="text-center py-20 text-white/60">
              لا توجد منتجات
              في هذا القسم حالياً
            </div>
          )}

        {/* ======================================
            Product Popup Modal
        ====================================== */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setSelectedProduct(
                  null
                )
              }
            >
              <motion.div
                initial={{
                  scale: 0.9,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
                onClick={(
                  e
                ) =>
                  e.stopPropagation()
                }
                className="bg-darkblue-light max-w-3xl w-full rounded-2xl overflow-hidden border border-white/10 max-h-[90vh] overflow-y-auto"
              >
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[320px] object-cover"
                />

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {
                      selectedProduct.name
                    }
                  </h2>

                  {selectedProduct.description && (
                    <p className="text-white/70 leading-relaxed mb-4">
                      {
                        selectedProduct.description
                      }
                    </p>
                  )}

                  {selectedProduct.video && (
                    <a
                      href={
                        selectedProduct.video
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      مشاهدة الفيديو
                    </a>
                  )}

                  <button
                    onClick={() =>
                      setSelectedProduct(
                        null
                      )
                    }
                    className="block mt-6 w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
