"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export function ChromeMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Group>(null!);
  const ring2Ref = useRef<THREE.Group>(null!);
  const ring3Ref = useRef<THREE.Group>(null!);
  const satellitesRef = useRef<THREE.Group>(null!);

  // Orbiting micro-satellites
  const satellites = useMemo(() => {
    return [
      { radius: 2.2, speed: 0.7, offset: 0, size: 0.06, color: "#38bdf8" },
      { radius: 2.45, speed: -0.5, offset: Math.PI / 3, size: 0.08, color: "#e2e8f0" },
      { radius: 2.3, speed: 0.9, offset: Math.PI, size: 0.05, color: "#818cf8" },
      { radius: 2.55, speed: -0.8, offset: (4 * Math.PI) / 3, size: 0.07, color: "#cbd5e1" },
    ];
  }, []);

  useFrame((state) => {
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();

    // Responsive smooth tilt towards mouse
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.4,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.5,
        0.05
      );
    }

    // Core smooth rotation
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.1;
      coreRef.current.rotation.y = t * 0.15;
    }

    // Inner glowing crystal counter-rotation
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.2;
      innerRef.current.rotation.z = t * 0.25;
    }

    // Outer wireframe cage
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -t * 0.08;
      wireframeRef.current.rotation.z = t * 0.06;
    }

    // Gyroscopic rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.3) * 0.12;
      ring1Ref.current.rotation.y = t * 0.28;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 3 + Math.cos(t * 0.25) * 0.12;
      ring2Ref.current.rotation.z = -t * 0.22;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = Math.PI / 6;
      ring3Ref.current.rotation.z = t * 0.16;
    }

    // Satellites orbiting
    if (satellitesRef.current) {
      satellitesRef.current.children.forEach((child, i) => {
        const sat = satellites[i];
        if (!sat) return;
        const angle = t * sat.speed + sat.offset;
        child.position.x = Math.cos(angle) * sat.radius;
        child.position.y = Math.sin(angle * 0.7) * (sat.radius * 0.35);
        child.position.z = Math.sin(angle) * sat.radius;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float
        speed={1.6}
        rotationIntensity={0.4}
        floatIntensity={0.6}
        floatingRange={[-0.1, 0.1]}
      >
        {/* 1. INNER GLOWING HOLOGRAPHIC CORE */}
        <mesh ref={innerRef} scale={0.75}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={2.5}
            wireframe
          />
        </mesh>

        {/* 2. MAIN SMOOTH SATIN OBSIDIAN-CHROME SPHERE */}
        {/* Completely smooth sphere without city reflections, only clean studio highlights */}
        <mesh ref={coreRef} scale={1.38}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color="#181824"
            metalness={0.88}
            roughness={0.24}
          />
        </mesh>

        {/* 3. SUBTLE OUTER WIREFRAME CAGE (Light & Minimalist) */}
        <mesh ref={wireframeRef} scale={1.62}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color="#64748b"
            wireframe
            transparent
            opacity={0.22}
          />
        </mesh>

        {/* 4. GYROSCOPIC RING 1 */}
        <group ref={ring1Ref}>
          <mesh scale={2.15}>
            <torusGeometry args={[1, 0.012, 16, 100]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Subtle glowing nodes */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <mesh
              key={idx}
              position={[Math.cos(angle) * 2.15, Math.sin(angle) * 2.15, 0]}
              scale={0.04}
            >
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </group>

        {/* 5. GYROSCOPIC RING 2 */}
        <group ref={ring2Ref}>
          <mesh scale={2.4}>
            <torusGeometry args={[1, 0.009, 16, 100]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.92}
              roughness={0.15}
            />
          </mesh>
        </group>

        {/* 6. GYROSCOPIC RING 3 */}
        <group ref={ring3Ref}>
          <mesh scale={2.65}>
            <torusGeometry args={[1, 0.006, 16, 100]} />
            <meshStandardMaterial
              color="#64748b"
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* 7. ORBITING MICRO-SATELLITES */}
        <group ref={satellitesRef}>
          {satellites.map((sat, i) => (
            <mesh key={i} scale={sat.size}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color={sat.color}
                metalness={0.8}
                roughness={0.2}
                emissive={sat.color === "#38bdf8" ? "#0284c7" : "#000000"}
                emissiveIntensity={sat.color === "#38bdf8" ? 1.5 : 0}
              />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}
