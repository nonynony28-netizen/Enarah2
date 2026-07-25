---
name: ui-ux-pro-design
description: World-class UI/UX Design System for Enarah Modern featuring Royal Sapphire Blue palette, Cairo & Outfit typography, glassmorphic card stages, GPU-accelerated micro-interactions, and responsive layout guidelines.
---

# UI/UX Pro Design Skill

This skill governs all visual aesthetics, component structures, color design tokens, and user experience patterns across the platform.

## 💎 1. Design Aesthetics & Visual Identity
- **Primary Palette:** Royal Sapphire Blue (`from-blue-400 via-sky-300 to-indigo-400`), Midnight Navy (`#0a192f`, `#0d2342`), and Platinum-Cyan highlights (`#38bdf8`, `#0284c7`).
- **Glassmorphism:** Use semi-transparent dark backgrounds (`bg-[#0d2342]/90 backdrop-blur-md`) with subtle border glows (`border border-blue-500/25 shadow-[0_0_30px_rgba(59,130,246,0.15)]`).
- **Typography:**
  - Headings & Primary Arabic UI: **Cairo** (`font-weight: 700`, `800`, `900`).
  - Secondary English UI & Numbers: **Outfit** (`font-weight: 600`, `700`).

## ⚡ 2. Performance & Micro-Interactions
- **GPU Acceleration:** Apply `style={{ transform: 'translateZ(0)' }}` and `will-change: transform` on animated hero elements and floating cards.
- **Micro-Animations:** Use smooth 300ms transitions (`transition-all duration-300 hover:scale-105 active:scale-95`).
- **Asset Guidelines:** Always use real high-definition WebP or compressed assets with `loading="lazy"` and `decoding="async"`. Zero raw placeholders.

## 📱 3. Mobile Responsiveness & Layout
- **Full Width Edge-to-Edge:** Media showcases and Hero stages span 100% full width (`w-full`) across all screen sizes.
- **RTL Native Direction:** Right-to-left layout alignment with smooth drawer sidebars sliding from right to left on mobile.
