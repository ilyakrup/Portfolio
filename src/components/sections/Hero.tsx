"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { portfolioData } from "@/data/portfolio";
import { ArrowDown, Sparkles, Send, Layers } from "lucide-react";
import { motion } from "framer-motion";

// Dynamic import with SSR false for Three.js WebGL canvas
const HeroCanvas = dynamic(
  () => import("../3d/HeroCanvas").then((mod) => mod.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-white/5 border border-white/10 animate-pulse" />
      </div>
    ),
  }
);

export function Hero() {
  const { developer } = portfolioData;
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    let loadTimer: number | undefined;

    const update3DVisibility = () => {
      if (!desktopQuery.matches) {
        setShow3D(false);
        return;
      }

      loadTimer = window.setTimeout(() => setShow3D(true), 300);
    };

    update3DVisibility();
    desktopQuery.addEventListener("change", update3DVisibility);

    return () => {
      desktopQuery.removeEventListener("change", update3DVisibility);
      if (loadTimer !== undefined) {
        window.clearTimeout(loadTimer);
      }
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Background radial gradient spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Text & Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col items-start z-10"
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Frontend & Product Developer • Боты TG, VK, MAX</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-5">
            Создаю быстрые <span className="text-chrome">веб-сервисы</span> и умных <span className="text-chrome">чат-ботов</span>
          </h1>

          {/* Subtitle / Bio */}
          <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed max-w-2xl mb-8">
            Привет, я <span className="text-white font-medium">{developer.name}</span>. Разрабатываю современные цифровые продукты: от адаптивных веб-приложений на Next.js с 3D-графикой до многофункциональных ботов для Telegram, ВКонтакте и платформы MAX.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-10">
            <a
              href="#projects"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            >
              <span>Смотреть проекты на Vercel</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium text-white glass-panel glass-panel-hover transition-all active:scale-95"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Обсудить задачу</span>
            </a>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 w-full max-w-lg">
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">4+</div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5">Vercel проектов</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">3</div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5">Платформы ботов</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400 tracking-tight">100%</div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5">Фокус на результат</div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Interactive Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative w-full h-[380px] sm:h-[460px] lg:h-[540px] flex items-center justify-center"
        >
          {show3D ? (
            <HeroCanvas />
          ) : (
            <div
              className="hero-visual-fallback relative w-full h-full flex items-center justify-center overflow-hidden"
              aria-label="Декоративная графика"
              role="img"
            >
              <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/30 to-purple-500/20 blur-3xl" />
              <div className="relative w-44 h-44 rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center shadow-[0_0_80px_rgba(56,189,248,0.12)]">
                <div className="w-24 h-24 rounded-full bg-white/10 border border-white/30" />
              </div>
            </div>
          )}

          {/* Interactive hint floating badge */}
          <div className="absolute bottom-2 right-4 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-[11px] font-mono text-zinc-400 border border-white/10 shadow-lg">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Интерактивный 3D Нейро-мозг • Подвигайте курсором</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
