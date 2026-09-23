// Service Worker لشركة الإنارة الحديثة - Enarah Modern PWA Service Worker
// يوفر تجربة تصفح أوفلاين سريعة وموثوقة بدون استهلاك مساحة التخزين أو حبس ملفات الفيديو

const CACHE_NAME = 'enarah-app-shell-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/poster.jpg',
  '/hero-poster.jpg',
  '/mascot.png',
  '/robots.txt'
];

// 1. التثبيت والتخزين الأولي لغلاف التطبيق الأساسي (App Shell)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW Precache warning:', err);
      });
    })
  );
});

// 2. تفعيل وحذف الكاشات القديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && !key.startsWith('enarah-video-cache')) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. اعتراض الطلبات وتوفير إستراتيجية الاستجابة الذكية
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // استبعاد طلبات الفيديو (تدار بواسطة محرك videoCache المخصص)
  if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')) {
    return;
  }

  // استبعاد طلبات الـ API لعدم تجميد البيانات الحية
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // لطلبات صفحات التنقل (HTML Navigation): Network-First مع الرجوع للكاش عند انقطاع الإنترنت
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // للملفات الثابتة المبنية (Hashed JS, CSS, Fonts, Images): Stale-While-Revalidate أو Cache-First
  if (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.woff2') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }
});
