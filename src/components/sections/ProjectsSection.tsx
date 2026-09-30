"use client";

import React, { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProjectsSection() {
  const { projects } = portfolioData;
  const [activeCategory, setActiveCategory] = useState<string>("Все");

  const categories = [
    "Все",
    "EdTech",
    "E-Commerce",
    "Branding",
    "B2B Services",
  ];

  const filteredProjects =
    activeCategory === "Все"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 px-4 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 mb-3">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Живые проекты на Vercel</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Избранные работы & <span className="text-chrome">кейсы</span>
          </h2>
          <p className="text-base text-zinc-400 mt-2 max-w-2xl font-light">
            Каждый проект протестирован, оптимизирован и развернут на Vercel. Вы можете в реальном времени открыть любое демо и оценить качество интерфейса.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-8 p-1.5 rounded-xl glass-panel border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-white text-black shadow-md font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
