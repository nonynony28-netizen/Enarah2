export interface ProjectItem {
  id: string
  name: string
  description: string
  image: string
  coverImage: string
  video?: string
  category: string
}

// دالة تحويل أي رابط خارجي بطيء من PostImage إلى الصورة المحلية المضغوطة فائقة السرعة
export const getOptimizedProjectImageUrl = (url: string): string => {
  if (!url) return '/images/default-product.jpg'
  const trimmed = url.trim()
  if (trimmed.startsWith('/images/projects/')) return trimmed

  const match = trimmed.match(/(IMG-\d+\.webp)/i)
  if (match) {
    return `/images/projects/${match[1]}`
  }

  return trimmed
}

export const getOptimizedProjectImages = (rawImages: string): string => {
  if (!rawImages) return '/images/default-product.jpg'
  return rawImages
    .split(',')
    .map((u) => getOptimizedProjectImageUrl(u.trim()))
    .filter(Boolean)
    .join(',')
}

export const getLocalizedProject = (
  project: { name: string; category: string; description: string },
  isAr: boolean
) => {
  if (isAr) return project

  let name = project.name
  let category = project.category
  let description = project.description

  const nameTrim = project.name.trim()
  if (nameTrim === 'مول الماسة') name = 'Al-Masa Mall'
  else if (nameTrim === 'معرض كواترو موتورز') name = 'Quattro Motors Showroom'
  else if (nameTrim === 'مصحة الحياة الطبية') name = 'Al-Hayat Medical Clinic'
  else if (nameTrim === 'قاعة جمانة للمناسبات') name = 'Jumana Events Hall'
  else if (nameTrim === 'panyoti cafe') name = 'Panyoti Cafe'

  const catTrim = project.category.trim()
  if (catTrim === 'مقهي') category = 'Cafe'
  else if (catTrim === 'مول تجاري') category = 'Commercial Mall'
  else if (catTrim === 'معرض سيارات') category = 'Car Showroom'
  else if (catTrim === 'طبي') category = 'Medical'
  else if (catTrim === 'اجتماعي') category = 'Social'

  const descTrim = project.description.trim()
  if (descTrim.includes('الاضاءات الداخلية والخارجية وعمدان الانارة')) {
    description = 'Execution of indoor & outdoor lighting and lighting poles for Al-Masa Mall.'
  } else if (descTrim.includes('توريد كافه الاضاءات والاعمده والسكك')) {
    description = 'Supply of all lighting, poles, and tracks to showcase the showroom in the best way.'
  } else if (descTrim.includes('تنفيذ وتسليم كامل من بريزات والاضاءات')) {
    description = 'Execution and complete handover of outlets, lighting, voltage regulators, and wiring to ensure smooth operation under all conditions.'
  } else if (descTrim.includes('توريد الثريات والإضاءات المختلفة لصالة جمانة')) {
    description = 'Supply of chandeliers and various custom lighting for Jumana Hall to complete your wedding luxury and live the most beautiful moments.'
  } else if (descTrim.includes('تجهيز الثريات والاضاءات في المقهي')) {
    description = 'Supplying chandeliers and custom lighting for the cafe, which all customers agreed was stunning.'
  }

  return { name, category, description }
}

// المشاريع الأساسية المدمجة بصور مضغوطة محلياً لفتح فوري وسرعة قصوى
export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-al-masa',
    name: 'مول الماسة',
    category: 'مول تجاري',
    description: 'تنفيذ الاضاءات الداخلية والخارجية وعمدان الانارة لصالح مول الماسة',
    coverImage: '/images/projects/IMG-3639.webp',
    image: '/images/projects/IMG-3639.webp,/images/projects/IMG-3638.webp,/images/projects/IMG-3637.webp,/images/projects/IMG-3635.webp',
  },
  {
    id: 'proj-quattro',
    name: 'معرض كواترو موتورز',
    category: 'معرض سيارات',
    description: 'توريد كافه الاضاءات والاعمده والسكك ليظهر المعرض بأفضل شكل',
    coverImage: '/images/projects/IMG-3643.webp',
    image: '/images/projects/IMG-3643.webp,/images/projects/IMG-3641.webp,/images/projects/IMG-3644.webp',
  },
  {
    id: 'proj-al-hayat',
    name: 'مصحة الحياة الطبية',
    category: 'طبي',
    description: 'تنفيذ وتسليم كامل من بريزات والاضاءات ومنظمات الكهرباء وأسلاك التأسيس لضمان العمل بإنسبايبه كاملة في كل الظروف',
    coverImage: '/images/projects/IMG-3647.webp',
    image: '/images/projects/IMG-3647.webp,/images/projects/IMG-3646.webp,/images/projects/IMG-3645.webp',
  },
  {
    id: 'proj-jumana',
    name: 'قاعة جمانة للمناسبات',
    category: 'اجتماعي',
    description: 'توريد الثريات والإضاءات المختلفة لصالة جمانة لتكتمل فخامه أفراحكم وتعيشو أجمل اللحظات',
    coverImage: '/images/projects/IMG-3650.webp',
    image: '/images/projects/IMG-3650.webp,/images/projects/IMG-3649.webp,/images/projects/IMG-3648.webp',
  },
  {
    id: 'proj-panyoti',
    name: 'panyoti cafe',
    category: 'مقهي',
    description: 'تجهيز الثريات والاضاءات في المقهي بشهادة كل الزبائن كانت رائعة جدا ومميزة',
    coverImage: '/images/projects/IMG-3634.webp',
    image: '/images/projects/IMG-3634.webp,/images/projects/IMG-3633.webp,/images/projects/IMG-3632.webp',
  },
]
