import React from "react";
import { portfolioData } from "@/data/portfolio";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-10 px-4 mt-12 bg-[#050508]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-semibold">{portfolioData.developer.name}</span>
          <span>•</span>
          <span>© {currentYear}. Все права защищены.</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Built with Next.js, Three.js & Tailwind CSS</span>
          <a
            href="#"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors p-1"
            aria-label="Наверх"
          >
            <span>Наверх</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
