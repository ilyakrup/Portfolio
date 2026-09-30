"use client";

import React, { useState, useEffect } from "react";
import { portfolioData } from "@/data/portfolio";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Проекты", href: "#projects" },
    { name: "Услуги & Боты", href: "#services" },
    { name: "Стек", href: "#skills" },
    { name: "Контакты", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 transition-all duration-300">
      <nav
        className={`w-full max-w-5xl rounded-2xl transition-all duration-300 px-4 sm:px-6 py-3 flex items-center justify-between ${
          scrolled
            ? "glass-panel bg-[#07070d]/80 shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/10"
            : "bg-transparent border border-transparent"
        }`}
      >
        {/* Brand / Logo */}
        <a
          href="#"
          className="flex items-center gap-2 group text-white font-medium text-base tracking-tight"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/15 to-white/5 border border-white/20 flex items-center justify-center text-xs font-mono font-bold tracking-widest group-hover:border-white/40 transition-colors">
            IL
          </div>
          <span className="font-semibold text-sm sm:text-base text-chrome tracking-wide">
            {portfolioData.developer.name.toUpperCase()}
          </span>
          <span className="text-xs text-zinc-500 font-mono hidden md:inline">
            / DEV
          </span>
        </a>

        {/* Availability Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{portfolioData.developer.status.text}</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#contact"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <span>Обсудить задачу</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5"
          aria-label="Меню"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 glass-panel rounded-2xl p-5 border border-white/10 shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-200 z-50">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{portfolioData.developer.status.text}</span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {link.name}
            </a>
          ))}

          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-all text-center"
          >
            <span>Обсудить задачу</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
}
