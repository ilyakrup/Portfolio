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

  // Generate satellite positions around the orbit
  const satellites = useMemo(() => {
    return [
      { radius: 2.3, speed: 0.8, offset: 0, size: 0.08, color: "#38bdf8" },
      { radius: 2.6, speed: -0.6, offset: Math.PI / 3, size: 0.1, color: "#e2e8f0" },
      { radius: 2.4, speed: 1.1, offset: Math.PI, size: 0.07, color: "#818cf8" },
      { radius: 2.7, speed: -0.9, offset: (4 * Math.PI) / 3, size: 0.09, color: "#f8fafc" },
    ];
  }, []);

  useFrame((state) => {
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();

    // Smooth responsive tilt to mouse position
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.45,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.55,
        0.05
      );
    }

    // High-poly multifaceted Chrome Core rotation
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.12;
      coreRef.current.rotation.y = t * 0.18;
    }

    // Glowing Inner Cyber Octahedron counter-rotation
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.25;
      innerRef.current.rotation.z = t * 0.3;
    }

    // Outer Geodesic Tech Wireframe
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -t * 0.1;
      wireframeRef.current.rotation.z = t * 0.08;
    }

    // Multi-axis Gyroscopic Orbital Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.4) * 0.15;
      ring1Ref.current.rotation.y = t * 0.35;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 3 + Math.cos(t * 0.3) * 0.15;
      ring2Ref.current.rotation.z = -t * 0.28;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = Math.PI / 6;
      ring3Ref.current.rotation.z = t * 0.2;
    }

    // Orbiting micro-satellites
    if (satellitesRef.current) {
      satellitesRef.current.children.forEach((child, i) => {
        const sat = satellites[i];
        if (!sat) return;
        const angle = t * sat.speed + sat.offset;
        child.position.x = Math.cos(angle) * sat.radius;
        child.position.y = Math.sin(angle * 0.8) * (sat.radius * 0.4);
        child.position.z = Math.sin(angle) * sat.radius;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float
        speed={1.8}
        rotationIntensity={0.5}
        floatIntensity={0.7}
        floatingRange={[-0.12, 0.12]}
      >
        {/* 1. INNER GLOWING CYBER CORE */}
        <mesh ref={innerRef} scale={0.85}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.8}
            wireframe
            roughness={0.2}
          />
        </mesh>

        {/* 2. MAIN DETAILED FACETED CHROME SPHERE */}
        <mesh ref={coreRef} scale={1.45}>
          <icosahedronGeometry args={[1, 3]} />
          <meshPhysicalMaterial
            color="#f1f5f9"
            metalness={0.96}
            roughness={0.06}
            clearcoat={1}
            clearcoatRoughness={0.08}
            reflectivity={1}
            ior={1.6}
            flatShading={false}
          />
        </mesh>

        {/* 3. OUTER GEODESIC WIREFRAME TECH CAGE */}
        <mesh ref={wireframeRef} scale={1.72}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color="#cbd5e1"
            wireframe
            transparent
            opacity={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* 4. GYROSCOPIC RING 1 with metallic tick notches */}
        <group ref={ring1Ref}>
          <mesh scale={2.2}>
            <torusGeometry args={[1, 0.016, 16, 120]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
          {/* Tech Nodes along Ring 1 */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <mesh
              key={idx}
              position={[
                Math.cos(angle) * 2.2,
                Math.sin(angle) * 2.2,
                0,
              ]}
              scale={0.05}
            >
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={1.5}
              />
            </mesh>
          ))}
        </group>

        {/* 5. GYROSCOPIC RING 2 */}
        <group ref={ring2Ref}>
          <mesh scale={2.45}>
            <torusGeometry args={[1, 0.012, 16, 120]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.98}
              roughness={0.08}
            />
          </mesh>
          {/* Tech Nodes along Ring 2 */}
          {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map(
            (angle, idx) => (
              <mesh
                key={idx}
                position={[
                  Math.cos(angle) * 2.45,
                  Math.sin(angle) * 2.45,
                  0,
                ]}
                scale={0.045}
              >
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                  color="#ffffff"
                  metalness={0.95}
                  roughness={0.1}
                />
              </mesh>
            )
          )}
        </group>

        {/* 6. GYROSCOPIC RING 3 (Outer Horizon Ring) */}
        <group ref={ring3Ref}>
          <mesh scale={2.7}>
            <torusGeometry args={[1, 0.008, 16, 120]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.9}
              roughness={0.2}
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
                metalness={0.9}
                roughness={0.1}
                emissive={sat.color === "#38bdf8" ? "#0284c7" : "#000000"}
                emissiveIntensity={sat.color === "#38bdf8" ? 1.2 : 0}
              />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}
