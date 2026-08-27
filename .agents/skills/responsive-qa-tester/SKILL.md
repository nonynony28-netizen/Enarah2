---
name: responsive-qa-tester
description: Automated responsive design quality assurance, mobile-first testing across screen sizes (320px to 4K), RTL layout verification, touch target accessibility, and cross-browser visual fidelity auditing.
---

# Responsive Design & Multi-Device QA Skill (خبير فحص الشاشات والتوافقية)

## Overview
This skill guarantees pixel-perfect layout rendering, touch target ergonomic sizing, RTL Arabic text alignment, and dynamic viewport unit handling (`100dvh` / `100svh`) across all mobile devices, tablets, and desktops.

---

## 📱 1. Mobile Viewport Standards (معايير الشاشات الصغيرة)

1. **Dynamic Viewport Height (`dvh`):**
   - For full-screen containers and interactive game views, always use `h-[100dvh]` or `min-h-[100dvh]` to account for mobile browser address bars (Safari iOS & Chrome Android).
2. **Touch Target Size (أحجام الأزرار للمس):**
   - Interactive elements (buttons, inputs, icons, switches) must have a minimum tap area of `44x44px` with adequate padding (`px-4 py-3`).
3. **Floating UI Margins:**
   - Ensure floating widgets (WhatsApp button, AI Chat, sticky cart) do not overlap critical navigation bars or input forms.

---

## 🇸🇦 2. RTL Arabic Layout Rules (معايير اللغة العربية ومحاذاة اليمين)

- **Directionality:** Enforce `dir="rtl"` in HTML root with proper Tailwind start/end utilities (`ps-`, `pe-`, `ms-`, `me-`, `text-right`).
- **Typography:** Use modern, legible Arabic typography (`Cairo`, `Readex Pro`, `Tajawal`) with optimized font-display `swap`.
- **Icons & Arrows:** Flip directional chevron/arrow icons appropriately for RTL (`←` for forward progression).

---

## 🧪 3. Screen Breakpoints Quality Checklist

- **Small Phones (360px - 390px):** Check that multi-column grids collapse cleanly into single-column cards without horizontal overflow (`overflow-x-hidden`).
- **Standard Phones (390px - 430px):** Verify that split-view sections and product cards have legible text hierarchy.
- **Tablets (768px - 1024px):** 2-column or 3-column balance without awkward gaps.
- **Desktops (1280px+):** Max-width constraints (`max-w-7xl mx-auto`) to prevent excessive stretching on ultra-wide monitors.
