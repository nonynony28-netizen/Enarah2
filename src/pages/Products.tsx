// ======================================
// داخل fetchProducts > data.data.map
// استبدل الجزء الحالي فقط بهذا
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

          // ======================================
          // يدعم المنتجات القديمة + الجديدة
          // القديمة: description داخل email
          // الجديدة: description داخل phone JSON
          // ======================================
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
