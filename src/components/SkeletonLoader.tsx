import React from 'react'

/**
 * هيكل تحميل عظمي (Skeleton Loader) لبطاقات المنتجات
 * يطابق الأبعاد والنسب الهندسية بدقة لمنع أي اهتزاز في الصفحة (Zero CLS)
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-4 md:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between animate-pulse">
      <div>
        {/* صورة المنتج */}
        <div className="w-full aspect-square bg-slate-100 rounded-2xl mb-4" />
        
        {/* تصنيف وتاج المنتج */}
        <div className="h-4 w-20 bg-slate-200 rounded-full mb-2.5" />
        
        {/* عنوان المنتج */}
        <div className="h-5 w-3/4 bg-slate-200 rounded-lg mb-2" />
        <div className="h-3 w-1/2 bg-slate-100 rounded-lg mb-4" />
      </div>

      <div>
        {/* السعر والزر */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="h-6 w-16 bg-slate-200 rounded-lg" />
          <div className="h-10 w-24 bg-blue-100 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

/**
 * هيكل تحميل عظمي لكروت المشاريع المنفذة
 */
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm animate-pulse">
      <div className="w-full h-56 bg-slate-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-24 bg-blue-100 rounded-full" />
        <div className="h-6 w-2/3 bg-slate-200 rounded-lg" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-4/5 bg-slate-100 rounded" />
      </div>
    </div>
  )
}

/**
 * هيكل تحميل عظمي لصفوف جدول أسعار الأسلاك
 */
export function WirePriceRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="py-4 px-4"><div className="h-5 w-16 bg-slate-200 rounded" /></td>
      <td className="py-4 px-4"><div className="h-5 w-28 bg-slate-100 rounded" /></td>
      <td className="py-4 px-4"><div className="h-5 w-20 bg-blue-100 rounded" /></td>
      <td className="py-4 px-4"><div className="h-6 w-12 bg-slate-200 rounded-full" /></td>
    </tr>
  )
}
