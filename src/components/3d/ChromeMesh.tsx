"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export function ChromeMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef1 = useRef<THREE.Mesh>(null!);
  const ringRef2 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      // Smoothly tilt towards mouse with damping
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        pointer.y * 0.6,
        0.05
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        pointer.x * 0.8 + t * 0.15,
        0.05
      );
    }

    if (ringRef1.current) {
      ringRef1.current.rotation.x = t * 0.3;
      ringRef1.current.rotation.y = t * 0.2;
    }

    if (ringRef2.current) {
      ringRef2.current.rotation.x = -t * 0.25;
      ringRef2.current.rotation.z = t * 0.35;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float
        speed={2.2}
        rotationIntensity={0.6}
        floatIntensity={0.8}
        floatingRange={[-0.15, 0.15]}
      >
        {/* Core procedural liquid chrome distorted sphere */}
        <mesh ref={meshRef} scale={1.75}>
          <icosahedronGeometry args={[1, 32]} />
          <MeshDistortMaterial
            color="#e2e8f0"
            roughness={0.12}
            metalness={0.92}
            distort={0.35}
            speed={1.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Orbiting thin futuristic chrome ring 1 */}
        <mesh ref={ringRef1} scale={2.5}>
          <torusGeometry args={[1, 0.015, 16, 100]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>

        {/* Orbiting thin futuristic chrome ring 2 */}
        <mesh ref={ringRef2} scale={2.8}>
          <torusGeometry args={[1, 0.01, 16, 100]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
      </Float>
    </group>
  );
}
