"use client";

import React from "react";
import { portfolioData } from "@/data/portfolio";
import { Code2, Bot, Rocket, Check, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export function ServicesSection() {
  const { services, skills } = portfolioData;

  const iconMap: Record<string, React.ReactNode> = {
    Code2: <Code2 className="w-6 h-6 text-blue-400" />,
    Bot: <Bot className="w-6 h-6 text-emerald-400" />,
    Rocket: <Rocket className="w-6 h-6 text-purple-400" />,
  };

  return (
    <section id="services" className="py-24 px-4 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 mb-3">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Компетенции и услуги</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Чем я могу быть полезен <span className="text-chrome">вашему бизнесу</span>
          </h2>
          <p className="text-base text-zinc-400 mt-2 max-w-2xl font-light">
            Объединяю передовой фронтенд с автоматизацией через ботов. Создаю решения, которые приносят реальные заявки и оптимизируют ресурсы команды.
          </p>
        </div>

        {/* 3 Main Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel glass-panel-hover rounded-2xl p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {iconMap[service.icon]}
                  </div>
                  <span className="text-[11px] font-mono uppercase text-zinc-400 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2.5">
                  {service.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light mb-6">
                  {service.description}
                </p>
              </div>

              {/* Highlights List */}
              <ul className="space-y-2.5 pt-5 border-t border-white/10">
                {service.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Skills Matrix Section */}
        <div id="skills" className="pt-6 scroll-mt-24">
          <div className="glass-panel rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Технологический стек</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {skills.map((group) => (
                <div key={group.category}>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3.5">
                    {group.category}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-white/5 border border-white/10 hover:border-white/20 hover:text-white transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
