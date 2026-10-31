// Service Worker لشركة الإنارة الحديثة - Enarah Modern PWA & Smart Wire Price Push Service Worker
// يوفر تجربة تصفح أوفلاين سريعة وموثوقة وإشعارات فورية لتنبيهات أسعار الأسلاك النحاسية الإيطالية

const CACHE_NAME = 'enarah-app-shell-v2';
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

  // للملفات الثابتة المبنية (Hashed JS, CSS, Fonts, Images): Cache-First مع التحديث
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/images/wire-apps/') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.avif')
  ) {
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

// 4. استقبال إشعارات Web Push الخاصة بأسعار الأسلاك النحاسية الإيطالية
self.addEventListener('push', (event) => {
  let payload = {
    title: 'تنبيه أسعار الأسلاك — الإنارة الحديثة',
    body: 'تم تحديث أسعار الأسلاك النحاسية الإيطالية. اضغط للاطلاع على الأسعار المحدثة.',
    icon: '/mascot.png',
    badge: '/mascot.png',
    dir: 'rtl',
    lang: 'ar',
    tag: 'enarah-wire-price-alert',
    renotify: true,
    data: {
      url: '/wire-prices'
    }
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      if (parsed && typeof parsed === 'object') {
        payload = {
          ...payload,
          ...parsed,
          data: {
            url: '/wire-prices',
            ...(parsed.data || {})
          }
        };
      }
    } catch (_) {
      const text = event.data.text();
      if (text) {
        payload.body = text;
      }
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || '/mascot.png',
    badge: payload.badge || '/mascot.png',
    dir: payload.dir || 'rtl',
    lang: payload.lang || 'ar',
    tag: payload.tag || 'enarah-wire-price-alert',
    renotify: payload.renotify !== false,
    vibrate: [180, 90, 180],
    data: payload.data || { url: '/wire-prices' },
    actions: [
      {
        action: 'open-wire-prices',
        title: 'عرض الأسعار الآن'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// 5. التعامل مع النقر على الإشعار وفتح صفحة /wire-prices مباشرة
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/wire-prices';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        try {
          const clientUrl = new URL(client.url);
          if (clientUrl.pathname.includes('/wire-prices') && 'focus' in client) {
            return client.focus();
          }
        } catch (_) {
          // ignore URL parse error
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// 6. دعم إرسال إشعار محلي مباشر من الواجهة عند رصد تغير السعر أو عند اختبار التنبيه
self.addEventListener('message', (event) => {
  if (!event.data || typeof event.data !== 'object') return;

  if (event.data.type === 'SHOW_WIRE_ALERT_NOTIFICATION') {
    const title = event.data.title || 'تنبيه أسعار الأسلاك — الإنارة الحديثة';
    const body = event.data.body || 'تم تحديث سعر السلك المتابع في قائمة المتابعة الخاصة بك.';
    const tag = event.data.tag || 'enarah-wire-local-alert';
    const url = event.data.url || '/wire-prices';

    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: '/mascot.png',
        badge: '/mascot.png',
        dir: 'rtl',
        lang: 'ar',
        tag,
        renotify: true,
        vibrate: [150, 75, 150],
        data: { url },
        actions: [
          {
            action: 'open-wire-prices',
            title: 'عرض السعر المحدث'
          }
        ]
      })
    );
  }
});
