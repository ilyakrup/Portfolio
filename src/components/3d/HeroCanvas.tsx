"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { ChromeMesh } from "./ChromeMesh";

export function HeroCanvas() {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!isMounted) {
    return <div className="w-full h-full min-h-[420px]" />;
  }

  // Graceful fallback for devices without WebGL
  if (!hasWebGL) {
    return (
      <div className="relative w-full h-full flex items-center justify-center min-h-[420px]">
        <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/30 to-purple-500/20 blur-3xl animate-pulse" />
        <div className="relative w-44 h-44 rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white/10 border border-white/30 animate-float-slow" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[420px] md:min-h-[520px]">
      {/* Background ambient lighting blur circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-blue-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/3 w-60 h-60 rounded-full bg-cyan-500/10 blur-[85px] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[0, 4, 3]} intensity={1.8} color="#e0e7ff" />
        <pointLight position={[-3, -3, 2]} intensity={1.2} color="#0284c7" />

        <Suspense fallback={null}>
          <ChromeMesh />
          <Sparkles
            count={50}
            scale={7.5}
            size={1.6}
            speed={0.4}
            opacity={0.65}
            color="#38bdf8"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
