---
name: ux-ui-design
description: Advanced UI/UX design system, luxury dark glassmorphism, responsive micro-animations, and 60FPS mobile performance guidelines.
---

# Advanced UI/UX Design & Aesthetic Systems

This skill defines the world-class design standards, color harmonies, micro-animations, and responsive layout guidelines for building high-end web applications.

## 1. Color Palette & Aesthetics Systems

- **Primary Theme Base:** Deep luxury midnight blue (`#0a192f`, `#0c1e38`, `#0f213a`).
- **Accent Neon Gel Illumination:**
  - Sapphire Blue (`#3b82f6` / `rgba(59, 130, 246, 0.4)`): Used for primary highlights, glowing status rings, and active tab indicators.
  - Amber Gold (`#f59e0b` / `rgba(245, 158, 11, 0.4)`): Used for featured badges, price indicators, and warm lighting accents.
  - Emerald Green (`#10b981` / `rgba(16, 185, 129, 0.4)`): Used for certified guarantees, stock availability, and online status badges.
- **Glassmorphism Rule:**
  - On mobile devices, prefer solid dark glass (`bg-[#0c1e38]`, `bg-[#0a192f]`) over heavy `backdrop-blur` filters to prevent mobile GPU shader re-rasterization bottlenecks.

## 2. Zero-Glitch 60FPS Micro-Animations

- **Hardware Acceleration:** Always attach `style={{ transform: 'translateZ(0)' }}` or `will-change: transform, opacity` to animated elements in Framer Motion to offload rendering to mobile GPUs.
- **Natural Staggered Entrances:** Use gentle y-offsets (`y: 18` to `y: 0`) with moderate viewport triggers (`amount: 0.15`) and comfortable staggered delays (`delay: i * 0.15` to `0.3s`) to allow distinct, readable card entrances.
- **Avoid Scale Jank:** Avoid animating `scale: 0.95` simultaneously with negative viewport margins on scroll, as this triggers mobile text bounding box reflows.

## 3. Responsive Component & Layout Architecture

- **Harmonized Segmented Controls:** Keep tab controls equal-width (`flex-1`), centered, with clear icon + text hierarchy.
- **Clear Navigation Affordances:** Always provide explicit visual affordances (glowing side navigation arrows, pulse indicators, swipe hints) when creating interactive slide show containers.
- **Mobile-First Touch Ergonomics:** Maintain minimum 44px touch targets on mobile controls and buttons with active scale feedback (`active:scale-95`).
