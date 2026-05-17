// file name: src/pages/Products.tsx

import { useEffect, useState } from 'react'

type ProductItem = {
  id: string
  name: string
  description: string
  image: string
  video?: string
}

export default function Products() {
  const [products, setProducts] =
    useState<ProductItem[]>(
      []
    )

  const [loading, setLoading] =
    useState(true)

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
          // ======================================
          // يدعم المنتجات القديمة + الجديدة
          // يستبعد رسائل التواصل
          // ======================================
          const formattedProducts: ProductItem[] =
            data.data
              .filter(
                (
                  item: {
                    type?: string
                  }
                ) =>
                  item.type !==
                  'contact'
              )
              .map(
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
                    description?: string
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
                      mediaData.description ||
                      (
                        item.email &&
                        !item.email.includes(
                          '@upload.local'
                        )
                          ? item.email
                          : ''
                      ),

                    image:
                      mediaData.imageUrl ||
                      '/images/default-product.jpg',

                    video:
                      mediaData.videoUrl ||
                      '',
                  }
                }
              )

          setProducts(
            formattedProducts
          )
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error(
          'Fetch Products Error:',
          error
        )

        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="pt-24 md:pt-28 pb-16 bg-darkblue min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            منتجاتنا
          </h1>

          <p className="text-white/60 max-w-2xl mx-auto">
            استعرض أحدث منتجات الإنارة والتأسيس الكهربائي المتوفرة لدينا
          </p>

          <div className="w-16 h-1 bg-blue-400 mx-auto rounded-full mt-4" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 text-white/60">
            جاري تحميل المنتجات...
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          products.length ===
            0 && (
            <div className="text-center py-20 text-white/60">
              لا توجد منتجات حالياً
            </div>
          )}

        {/* Products Grid */}
        {!loading &&
          products.length >
            0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(
                (
                  product
                ) => (
                  <div
                    key={
                      product.id
                    }
                    className="bg-darkblue-light rounded-2xl overflow-hidden border border-white/5 hover:border-blue-400/30 transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Product Image */}
                    <div className="overflow-hidden">
                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        className="w-full h-[260px] object-cover transition-transform duration-500 hover:scale-110"
                        onError={(
                          e
                        ) => {
                          e.currentTarget.src =
                            '/images/default-product.jpg'
                        }}
                      />
                    </div>

                    {/* Product Content */}
                    <div className="p-5">
                      <h2 className="text-white font-bold text-xl mb-3">
                        {
                          product.name
                        }
                      </h2>

                      <p className="text-white/65 text-sm leading-relaxed min-h-[72px]">
                        {product.description ||
                          'لا يوجد وصف'}
                      </p>

                      {/* Video Link */}
                      {product.video && (
                        <a
                          href={
                            product.video
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-semibold text-sm"
                        >
                          مشاهدة الفيديو
                        </a>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </div>
  )
}
