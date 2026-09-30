# Design Specification: Ilya's Minimalist 3D Portfolio

**Date:** 2026-09-30  
**Status:** Validated & Ready for Implementation  
**Target:** Freelance & Product Developer Portfolio with Live Vercel Projects  

---

## 1. Executive Summary & Goals

### 1.1 Persona & Target Audience
* **Developer:** Ilya — Frontend & Product Developer.
* **Core Competencies:** Modern Frontend & Fullstack Web Apps, Chatbot Engineering (Telegram, VKontakte, MAX messenger platform).
* **Target Audience:** Startup founders, business owners, direct clients looking for fast, high-quality MVP development, web applications, and conversational bot integrations.
* **Primary Objective:** Deliver a high-converting, visually striking portfolio that immediately proves engineering competence through live interactive Vercel projects and modern 3D neo-minimalist aesthetics.

### 1.2 Success Criteria
* **Lightning Performance:** First Contentful Paint (FCP) < 1.0s, smooth 60fps animations, zero heavy external 3D asset downloads (procedural 3D in code).
* **High Conversion:** Direct, friction-free access to live projects deployed on Vercel and clear contact channels (Telegram CTA, email copy).
* **Resilient Architecture:** Full WebGL fallback for low-power mobile devices and older browsers.
* **Easy Maintenance:** All data (projects, stack, contacts) decoupled into a single configuration file (`src/data/portfolio.ts`).

---

## 2. Visual Design & Aesthetics

* **Color Palette (Deep Dark Neo-Minimalism):**
  * Background: Pitch black and deep obsidian (`#050507`, `#0a0a0f`, `#111118`).
  * Card Surfaces: Translucent frosted glass (`rgba(255, 255, 255, 0.03)` with `backdrop-blur-md` and `border-white/10`).
  * Accents: Chrome silver, subtle prismatic neon highlights (cyan/violet gradients), and an emerald active status badge (`#10b981`).
* **Typography:**
  * Clean modern sans-serif (Inter / Geist Sans), balanced hierarchy, prominent value propositions.
* **3D & Animation Principles:**
  * **Hero 3D:** Interactive procedural chrome/glass sphere or distorted torus with real-time lighting and reflections that reacts smoothly to pointer position.
  * **Card Hover:** Interactive 3D tilt effect with specular glare following the cursor (Framer Motion).
  * **Scroll reveals:** Subtly sequenced fade-and-rise transitions.

---

## 3. Architecture & Tech Stack

* **Framework:** Next.js 14+ (App Router, React 18/19, TypeScript).
* **Styling:** Tailwind CSS with custom glassmorphism and animation plugins.
* **3D Engine:** Three.js, `@react-three/fiber`, `@react-three/drei`.
* **Motion & Interactions:** `framer-motion` for UI physics and micro-interactions.
* **Icons:** `lucide-react`.
* **Deployment Target:** Vercel (native zero-config deployment).

---

## 4. Site Structure & Components

### 4.1 Header / Floating Navbar (`src/components/ui/Navbar.tsx`)
* Fixed floating glass bar at top with blur.
* Logo: `ILYA.DEV` / monogram.
* Navigation links: Projects, Services & Bots, About, Contact.
* Live status: Pulsing green dot with text `Available for work`.

### 4.2 Hero Section (`src/components/sections/Hero.tsx`)
* Central 3D Canvas (`src/components/3d/HeroScene.tsx`) loaded with dynamic import (`ssr: false`).
* Procedural Chrome Mesh (`src/components/3d/ChromeMesh.tsx`):
  * Custom metallic/roughness material with dynamic environment map.
  * Soft floating spring physics, gentle rotation, pointer tracking with easing.
* Text Content:
  * Headline: *«Frontend & Product Developer. Создаю веб-сервисы и умных чат-ботов»*.
  * Subtitle: *«Помогаю стартапам и бизнесу запускать современные веб-приложения и автоматизировать процессы через Telegram, VK и MAX.»*.
  * Action Buttons: Primary button *«Смотреть проекты»* (anchor scroll) and Secondary *«Обсудить задачу»* (contact CTA).

### 4.3 Featured Projects Showcase (`src/components/sections/ProjectsSection.tsx`)
* Grid of project cards displaying Ilya's live Vercel deployments:
  1. **Детский развивающий центр "Маленький Гений"**
     * URL: `https://children-school-zeta.vercel.app/`
     * Category: EdTech / Booking & Services
     * Focus: Интерактивная запись на развивающие занятия, удобный пользовательский интерфейс для родителей, высокая конверсия.
  2. **Детский премиальный магазин "Lille Atelier"**
     * URL: `https://children-shoop.vercel.app/`
     * Category: E-Commerce / Fashion
     * Focus: Премиальный интернет-магазин одежды, каталог товаров, плавная анимация взаимодействия, корзина.
  3. **Свадебное агентство "MONOCHROME"**
     * URL: `https://wedding-agency-amber.vercel.app/`
     * Category: Creative / Portfolio & Branding
     * Focus: Элегантная премиальная эстетика, галерея свадебных кейсов, презентация услуг и персональная запись.
  4. **Автосервис грузовых автомобилей "MONOLITH TRUCK"**
     * URL: `https://landing-auto-one.vercel.app/`
     * Category: B2B / Industrial Service
     * Focus: Строгий корпоративный лэндинг для тяжелой техники, калькулятор услуг, быстрая форма заявки на ремонт.
* **Card Interactions (`src/components/ui/ProjectCard.tsx`):**
  * 3D Card Tilt with perspective and dynamic highlight.
  * Preview thumbnail / mockup frame.
  * Direct action buttons: *«Live Demo ↗»* (link to Vercel) and tech badges.

### 4.4 Services & Bot Development (`src/components/sections/ServicesSection.tsx`)
* Dedicated highlight of Ilya's dual superpower:
  1. **Frontend & Fullstack Разработка:** Быстрый запуск MVP, лендинги, сложные личные кабинеты, дизайн-системы, оптимизация скорости.
  2. **Разработка чат-ботов и автоматизации:** Боты для Telegram (Mini Apps, воронки, прием платежей), боты ВКонтакте, решения для корпоративной платформы MAX.
* Interactive tech badges: Next.js, React, TypeScript, Tailwind CSS, Three.js, Node.js, Telegram Bot API, VK API.

### 4.5 Contact & CTA Section (`src/components/sections/ContactSection.tsx`)
* Minimalist high-impact closing section.
* Headline: *«Есть идея для проекта или бота? Давайте реализуем.»*
* Actions:
  * Quick-launch Telegram button (`t.me/...` placeholder).
  * One-click "Copy Email" with instant toast feedback.
  * Direct links to GitHub and social networks.

---

## 5. Data Architecture (`src/data/portfolio.ts`)

All content is strongly typed in TypeScript:
```typescript
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  liveUrl: string;
  githubUrl?: string;
  tags: string[];
  gradient: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  capabilities: string[];
}

export interface ContactInfo {
  telegram: string;
  email: string;
  github: string;
  status: string;
}
```

---

## 6. Performance, Reliability & Fallbacks

1. **WebGL Detection & Fallback:**
   * If WebGL is not supported, `HeroScene` renders an animated ambient CSS radial glow mesh with floating particles, ensuring zero layout shift and no runtime errors.
2. **Adaptive Resolution (DPR):**
   * DPR clamped to `[1, 1.5]` to prevent GPU throttling on Retina/4K mobile screens.
3. **Lazy Loading & Code Splitting:**
   * Three.js components are split into a dynamic bundle loaded asynchronously, keeping the initial HTML payload lightweight.
4. **Vercel Readiness:**
   * Standard Next.js build output, automatic route optimization, pre-rendered static shells.

---

## 7. Verification & Quality Plan

* **TypeScript & ESLint:** Strict type checks (`tsc --noEmit`), zero lint warnings.
* **Build Check:** Full production build check (`npm run build`).
* **Interactive Testing:**
  * 3D Canvas responsiveness on resize.
  * Tilt card physics on pointer movement.
  * Working external links to all 4 live Vercel applications.
  * Mobile layout down to 360px viewport width.
