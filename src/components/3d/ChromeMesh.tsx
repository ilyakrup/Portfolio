"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Generate a circular glowing dot texture for luminous synapses
function createSynapseTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(224, 242, 254, 0.95)");
  gradient.addColorStop(0.5, "rgba(56, 189, 248, 0.45)");
  gradient.addColorStop(0.8, "rgba(2, 132, 199, 0.15)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Parametric brain generator conforming to anatomical lobes and stem
function getBrainPosition(u: number, v: number, radiusScale: number = 1.0): THREE.Vector3 {
  const theta = v; // 0 to PI (top to bottom)
  const phi = u;   // 0 to 2*PI (around circumference)

  // Base ellipsoid: brain is slightly elongated front-to-back (Z), wide (X), and high (Y)
  let x = Math.sin(theta) * Math.sin(phi) * 1.08;
  let y = Math.cos(theta) * 0.96;
  let z = Math.sin(theta) * Math.cos(phi) * 1.32;

  // 1. Longitudinal Fissure (central cleft separating left and right hemispheres)
  if (y > -0.45) {
    const xDist = Math.abs(x);
    const fissureDepth = 0.22 * Math.exp(-9 * xDist * xDist);
    x += (x > 0 ? -1 : 1) * fissureDepth;
  }

  // 2. Frontal lobe height & curvature (Z > 0)
  if (z > 0.1) {
    y += 0.08 * Math.sin(z * 1.5);
  }

  // 3. Cerebellum (lower posterior protrusion): Z < -0.2 and Y between -0.2 and -0.75
  if (z < -0.15 && y < -0.15 && y > -0.75) {
    const cbFactor = Math.sin((y + 0.15) * (Math.PI / -0.6));
    z -= 0.22 * cbFactor;
    x *= 1 + 0.16 * cbFactor;
  }

  // 4. Brain Stem (tapering downwards at bottom base like in reference image)
  if (y < -0.48) {
    const stemFactor = Math.min(1, (-y - 0.48) / 0.52);
    x = THREE.MathUtils.lerp(x, x * 0.25, stemFactor);
    z = THREE.MathUtils.lerp(z, -0.25 + z * 0.22, stemFactor);
    y -= stemFactor * 0.55; // extends gracefully down
  }

  // Scale and fine organic micro-variation
  const scale = 1.35 * radiusScale;
  return new THREE.Vector3(x * scale, y * scale, z * scale);
}

export function ChromeMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  // Generate neural network data: nodes, synaptic connections, colors
  const { nodePositions, nodeColors, linePositions, lineColors, initialColors } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const colorRGBArray: number[] = [];
    const posArray: number[] = [];

    // Color palette matching user's request & dark theme:
    // Cyan (#38bdf8), Blue (#2563eb), Indigo (#818cf8), Violet (#c084fc), White (#ffffff)
    const colorCyan = new THREE.Color("#38bdf8");
    const colorBlue = new THREE.Color("#0284c7");
    const colorIndigo = new THREE.Color("#818cf8");
    const colorViolet = new THREE.Color("#c084fc");
    const colorWhite = new THREE.Color("#ffffff");

    // 1. Surface cortical nodes (approx 260 nodes)
    const numRows = 16;
    const numCols = 16;
    for (let i = 0; i < numRows; i++) {
      const v = (i + 0.5) / numRows * Math.PI;
      const countInRow = Math.max(4, Math.floor(Math.sin(v) * numCols));
      for (let j = 0; j < countInRow; j++) {
        const u = (j / countInRow) * Math.PI * 2;
        // add slight jitter for organic neural appearance
        const jitterU = u + (Math.random() - 0.5) * 0.22;
        const jitterV = v + (Math.random() - 0.5) * 0.18;
        const pos = getBrainPosition(jitterU, jitterV, 1.0 + (Math.random() - 0.5) * 0.06);
        nodes.push(pos);
      }
    }

    // 2. Interior volumetric nodes (depth layers, approx 50 nodes)
    for (let k = 0; k < 50; k++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      const innerScale = 0.65 + Math.random() * 0.25;
      const pos = getBrainPosition(u, v, innerScale);
      nodes.push(pos);
    }

    // Assign gradient colors across brain anatomy
    nodes.forEach((pos) => {
      posArray.push(pos.x, pos.y, pos.z);

      // Gradient based on Z (front to back) and Y (top to stem)
      const tZ = (pos.z + 1.6) / 3.2; // 0 (back) to 1 (front)
      const tY = (pos.y + 1.8) / 3.4; // 0 (stem) to 1 (top)

      const nodeColor = new THREE.Color();
      if (tY < 0.25) {
        // Brain stem: violet to indigo
        nodeColor.lerpColors(colorViolet, colorIndigo, tY * 4);
      } else if (tZ > 0.6) {
        // Frontal lobe: bright cyan / sky blue
        nodeColor.lerpColors(colorBlue, colorCyan, (tZ - 0.6) * 2.5);
      } else if (tZ > 0.3) {
        // Midbrain: deep blue to indigo
        nodeColor.lerpColors(colorIndigo, colorBlue, (tZ - 0.3) * 3.3);
      } else {
        // Occipital / cerebellum: indigo to violet
        nodeColor.lerpColors(colorViolet, colorIndigo, tZ * 3.3);
      }

      // Randomly make 15% of nodes luminous white active firing synapses
      if (Math.random() < 0.18) {
        nodeColor.lerp(colorWhite, 0.7);
      }

      colors.push(nodeColor);
      colorRGBArray.push(nodeColor.r, nodeColor.g, nodeColor.b);
    });

    // 3. Connect nearby nodes into neural network plexuses
    const linePos: number[] = [];
    const lineCol: number[] = [];
    const maxDistance = 0.55;
    const maxConnectionsPerNode = 4;
    const connectionCounts = new Array(nodes.length).fill(0);

    for (let i = 0; i < nodes.length; i++) {
      const p1 = nodes[i];
      const neighbors: { index: number; dist: number }[] = [];

      for (let j = i + 1; j < nodes.length; j++) {
        if (connectionCounts[j] >= maxConnectionsPerNode) continue;
        const p2 = nodes[j];
        const dist = p1.distanceTo(p2);
        if (dist < maxDistance) {
          neighbors.push({ index: j, dist });
        }
      }

      // Sort by proximity and connect
      neighbors.sort((a, b) => a.dist - b.dist);
      const toConnect = neighbors.slice(0, maxConnectionsPerNode - connectionCounts[i]);

      toConnect.forEach(({ index: j }) => {
        const p2 = nodes[j];
        connectionCounts[i]++;
        connectionCounts[j]++;

        linePos.push(p1.x, p1.y, p1.z);
        linePos.push(p2.x, p2.y, p2.z);

        const c1 = colors[i];
        const c2 = colors[j];
        lineCol.push(c1.r * 0.75, c1.g * 0.75, c1.b * 0.75);
        lineCol.push(c2.r * 0.75, c2.g * 0.75, c2.b * 0.75);
      });
    }

    return {
      nodePositions: new Float32Array(posArray),
      nodeColors: new Float32Array(colorRGBArray),
      initialColors: colors,
      linePositions: new Float32Array(linePos),
      lineColors: new Float32Array(lineCol),
    };
  }, []);

  // Synapse circular glow texture
  const synapseTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createSynapseTexture();
  }, []);

  // Neural animation loop
  useFrame((state) => {
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();

    // Responsive fluid tilt towards cursor
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.45,
        0.05
      );
      // Gentle natural rotation plus pointer tracking
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.65 + t * 0.12,
        0.05
      );
    }

    // Synaptic firing pulses: dynamically pulsate node brightness
    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      const colorAttr = geometry.getAttribute("color") as THREE.BufferAttribute;
      if (colorAttr) {
        const array = colorAttr.array as Float32Array;
        for (let i = 0; i < initialColors.length; i++) {
          const baseColor = initialColors[i];
          const px = nodePositions[i * 3];
          const py = nodePositions[i * 3 + 1];
          const pz = nodePositions[i * 3 + 2];

          // Traveling neural wave of light
          const wave = Math.sin(t * 3.0 - pz * 1.5 + py * 1.2 + px * 0.8);
          const intensity = wave > 0.6 ? 1.0 + (wave - 0.6) * 1.8 : 0.85;

          array[i * 3] = Math.min(1, baseColor.r * intensity);
          array[i * 3 + 1] = Math.min(1, baseColor.g * intensity);
          array[i * 3 + 2] = Math.min(1, baseColor.b * intensity);
        }
        colorAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <Float
        speed={1.8}
        rotationIntensity={0.3}
        floatIntensity={0.5}
        floatingRange={[-0.08, 0.08]}
      >
        {/* 1. NEURAL SYNAPSE NODES (GLOWING SPHERICAL DOTS) */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={nodePositions.length / 3}
              array={nodePositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={nodeColors.length / 3}
              array={nodeColors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.14}
            vertexColors
            transparent
            opacity={0.95}
            map={synapseTexture || undefined}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* 2. SYNAPTIC CONNECTING LINES (NEURAL NETWORK PLEXUS) */}
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={linePositions.length / 3}
              array={linePositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={lineColors.length / 3}
              array={lineColors}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.42}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            linewidth={1}
          />
        </lineSegments>

        {/* 3. CORE AMBIENT HOLOGRAPHIC GLOW */}
        <mesh scale={0.75} position={[0, 0.1, 0]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color="#0284c7"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>
    </group>
  );
}
