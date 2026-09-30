"use client";

import React, { useRef, useState } from "react";
import { Project } from "@/data/portfolio";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position inside the card (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for 3D rotation
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  // Dynamic light glare position
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="perspective-1000 w-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative group rounded-2xl glass-panel p-6 sm:p-7 transition-colors duration-300 hover:border-white/20 overflow-hidden flex flex-col justify-between h-full min-h-[380px]"
      >
        {/* Ambient background accent glow */}
        <div
          className={`absolute -inset-0.5 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none`}
        />

        {/* Dynamic Specular Glare */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: isHovered
              ? `radial-gradient(400px circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.06), transparent 70%)`
              : "none",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            {/* Header: Category & Vercel live pill */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                {project.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Vercel Live</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-chrome transition-colors tracking-tight">
              {project.title}
            </h3>
            <p className="text-sm text-zinc-400 mt-1 font-medium">
              {project.subtitle}
            </p>

            {/* Description */}
            <p className="text-sm text-zinc-300/90 mt-3.5 leading-relaxed font-light">
              {project.description}
            </p>

            {/* Key feature highlights */}
            <ul className="mt-4 space-y-1.5">
              {project.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Area: Tags & Live Button */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.05]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Link to Vercel */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all active:scale-95 group/btn shrink-0"
            >
              <span>Открыть проект</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
