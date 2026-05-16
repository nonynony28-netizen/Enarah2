// أضف هذه التعديلات فقط داخل نفس الملف:
// src/pages/Products.tsx

// ======================================
// 1) عدّل الاستيراد:
// ======================================

// من:
import {
  useRef,
  useEffect,
  useState,
} from 'react'

// إلى:
import {
  useRef,
  useEffect,
  useState,
  useMemo,
} from 'react'


// ======================================
// 2) استبدل filteredProducts بالكامل:
// ======================================

// من:
const filteredProducts =
  selectedCategory ===
  'الكل'
    ? categories
    : categories.filter(
        (
          product
        ) =>
          getCategory(
            product.name
          ) ===
          selectedCategory
      )

// إلى:
const filteredProducts =
  useMemo(() => {
    return selectedCategory ===
      'الكل'
      ? categories
      : categories.filter(
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


// ======================================
// 3) داخل Product Card Image:
// أضف تحسين الأداء
// ======================================

// استبدل:
<img
  src={
    cat.image
  }
  alt={
    cat.name
  }
  className="w-full h-[250px] object-cover transition-transform duration-500 hover:scale-110"
  onError={(
    e
  ) => {
    e.currentTarget.src =
      '/images/default-product.jpg'
  }}
/>

// بـ:
<img
  src={
    cat.image
  }
  alt={
    cat.name
  }
  loading="lazy"
  decoding="async"
  className="w-full h-[250px] object-cover transition-transform duration-500 hover:scale-110"
  onError={(
    e
  ) => {
    e.currentTarget.src =
      '/images/default-product.jpg'
  }}
/>


// ======================================
// 4) داخل Popup Image:
// ======================================

// استبدل:
<img
  src={
    selectedProduct.image
  }
  alt={
    selectedProduct.name
  }
  className="w-full h-[320px] object-cover"
/>

// بـ:
<img
  src={
    selectedProduct.image
  }
  alt={
    selectedProduct.name
  }
  loading="lazy"
  decoding="async"
  className="w-full h-[320px] object-cover"
/>


// ======================================
// 5) أضف Skeleton Loading قبل Empty State:
// ======================================

// ضع هذا فوق:
// {filteredProducts.length === 0 && (

// الكود:
{categories.length ===
  0 && (
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


// ======================================
// النتيجة:
// ======================================
// سرعة أعلى
// فلترة أسرع
// صور أخف
// Loading احترافي
// تجربة أفضل خصوصًا بالموبايل
