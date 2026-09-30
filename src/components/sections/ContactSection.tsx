"use client";

import React, { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import { Send, Copy, Check, MessageSquare, Mail, ArrowUpRight } from "lucide-react";
import confetti from "canvas-confetti";

export function ContactSection() {
  const { contacts, developer } = portfolioData;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contacts.email);
    setCopied(true);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.85 },
        colors: ["#ffffff", "#38bdf8", "#818cf8"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <section id="contact" className="py-24 px-4 relative scroll-mt-20">
      {/* Background glow accent */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{developer.status.text}</span>
        </div>

        {/* Big Headline */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
          Готовы реализовать <br className="hidden sm:inline" />
          <span className="text-chrome">ваш проект или чат-бота?</span>
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-zinc-400 font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Напишите мне в Telegram или на почту. Обсудим идею, оценим сроки реализации и сформируем понятный план запуска первой версии.
        </p>

        {/* Action Buttons Box */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          {/* Telegram Primary CTA */}
          <a
            href={contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <Send className="w-4 h-4 text-blue-600" />
            <span>Написать в Telegram</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-600 ml-0.5" />
          </a>

          {/* Copy Email Button */}
          <button
            onClick={handleCopyEmail}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-sm font-medium text-white glass-panel glass-panel-hover transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Почта скопирована!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>Скопировать Email</span>
              </>
            )}
          </button>
        </div>

        {/* Social / Direct Contacts List */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-white/10 text-xs font-mono text-zinc-400">
          <a
            href={contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>Telegram: {contacts.telegramDisplay}</span>
          </a>

          <a
            href={`mailto:${contacts.email}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span>{contacts.email}</span>
          </a>

          <a
            href={contacts.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 text-zinc-400 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
