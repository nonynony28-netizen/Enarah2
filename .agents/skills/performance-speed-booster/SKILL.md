---
name: performance-speed-booster
description: High-performance web application optimization, GPU hardware acceleration, sub-second 0ms initial paint, memory leak prevention, image/video streaming optimization, and 60FPS mobile frame rate engineering.
---

# Web Performance & Speed Booster Skill (خبير السرعة الفائقة والأداء الصاروخي)

## Overview
This skill enforces ultra-fast page rendering, hardware GPU offloading, progressive media streaming, memory cache management, and Google Core Web Vitals optimization (LCP < 1.2s, CLS = 0, INP < 50ms).

---

## ⚡ 1. Media & Video Streaming Rules (تحسين الفيديو والوسائط)

1. **Hardware-Accelerated Background Video:**
   - Always use native `<video>` with `autoPlay`, `muted`, `defaultMuted`, `playsInline`, `webkit-playsinline="true"`, and `preload="auto"`.
   - Offload rendering to GPU via CSS `transform: translateZ(0)` and `will-change: transform`.
   - Prevent frame dropping and battery drain on mobile devices.
2. **Instant 0ms First Paint (Posters & Preloads):**
   - High-priority preloading of critical hero media:
     `<link rel="preload" as="image" href="/poster.jpg" fetchpriority="high" />`
   - Never rely on hundreds of uncompressed canvas bitmap requests when a single hardware-accelerated stream is available.

---

## 🧠 2. Code-Splitting & Memory Management (إدارة الذاكرة وتقسيم الكود)

- **Route Lazy-Loading:** Dynamically load non-critical routes (`React.lazy` and `Suspense`) to keep the initial JS bundle under 150KB gzip.
- **IntersectionObserver Cleanups:** Always disconnect observers and clear animation frames on component unmount to prevent memory leaks.
- **Resource Prefetching:** Prefetch likely next routes (Products, Projects, Contact) during browser idle time (`requestIdleCallback`).

---

## 🏎️ 3. Core Web Vitals Checklist

- **Cumulative Layout Shift (CLS = 0):** Enforce explicit aspect-ratio or min-height on hero banners, sliders, and canvas wrappers.
- **Largest Contentful Paint (LCP < 1.2s):** Preload font weights and critical CSS stylesheets.
- **Interaction to Next Paint (INP < 50ms):** Debounce heavy search filters and keep event handlers lightweight.
