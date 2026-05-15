// استبدل useEffect الحالي بالكامل بهذا داخل Products()

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        'https://enarah2.vercel.app/api/get-users'
      )

      const data = await res.json()

      // إذا API نجح
      if (data.success && Array.isArray(data.data)) {
        // تحويل بيانات MongoDB إلى شكل مناسب للواجهة
        const formattedProducts = data.data.map((item, index) => {
          let mediaData = {}

          try {
            mediaData = item.phone ? JSON.parse(item.phone) : {}
          } catch {
            mediaData = {}
          }

          return {
            id: item._id || index,
            name: item.name || 'بدون اسم',
            description:
              item.description ||
              item.email ||
              'لا يوجد وصف متاح',
            image:
              mediaData.imageUrl ||
              '/images/default-product.jpg',
            video:
              mediaData.videoUrl || '',
          }
        })

        setCategories(formattedProducts)
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error('Fetch Products Error:', error)
      setCategories([])
    }
  }

  fetchProducts()
}, [])
