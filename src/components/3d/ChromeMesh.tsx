"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Glowing circular texture for synaptic nodes
function createSynapseTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(224, 242, 254, 0.95)");
  gradient.addColorStop(0.5, "rgba(56, 189, 248, 0.6)");
  gradient.addColorStop(0.8, "rgba(2, 132, 199, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Organic gyri and sulci convolution displacement
function getCorticalGyri(x: number, y: number, z: number): number {
  const g1 = Math.sin(x * 7.5 + Math.cos(z * 6.5) * 1.6 + y * 5.5);
  const g2 = Math.cos(z * 7.2 + Math.sin(y * 7.0) * 1.6 + x * 6.0);
  const g3 = Math.sin(y * 8.5 + z * 5.5 + x * 4.5);
  return (g1 * 0.05 + g2 * 0.04 + g3 * 0.03);
}

// Anatomical position generator for left (-1) or right (+1) cerebral hemisphere
function getHemispherePosition(
  hemisphere: -1 | 1,
  u: number, // 0 to 2*PI (azimuth around hemisphere)
  v: number, // 0 (top) to PI (bottom)
  radialJitter: number = 0
): THREE.Vector3 {
  // Ellipsoid base centered around hemisphere lateral center
  const theta = v;
  const phi = u;

  // Local coordinates relative to hemisphere center
  const rad = 1.0 + radialJitter;
  const localX = Math.sin(theta) * Math.cos(phi) * 0.72 * rad;
  const localY = Math.cos(theta) * 0.88 * rad;
  const localZ = Math.sin(theta) * Math.sin(phi) * 1.18 * rad;

  // Lateral shift for left vs right hemisphere with central longitudinal fissure
  const hemisphereShift = hemisphere * 0.44;
  let x = localX + hemisphereShift;
  let y = localY;
  let z = localZ;

  // 1. Longitudinal Fissure sharpening (medial wall depression)
  // Bring the inner medial surface flatter and keep a distinct cleft between hemispheres
  const medialDist = Math.abs(x);
  if (medialDist < 0.38 && y > -0.45) {
    const cleft = (0.38 - medialDist) * 0.65;
    x += (x > 0 ? 1 : -1) * cleft * 0.55;
  }

  // 2. Frontal Lobe (Z > 0.2): Elevated anterior crest, gently curving over orbital floor
  if (z > 0.15) {
    const frontalFactor = (z - 0.15) / 1.1;
    y += 0.12 * Math.sin(frontalFactor * Math.PI * 0.8);
    // Orbital surface slight indentation at the bottom of frontal lobe
    if (y < -0.15) {
      y += 0.08 * Math.exp(-4 * (x * x));
    }
  }

  // 3. Occipital Lobe (Z < -0.2): Sloping down towards posterior pole
  if (z < -0.2) {
    const occipitalFactor = (-z - 0.2) / 1.0;
    y -= 0.08 * occipitalFactor;
    // Overhang above cerebellum
    if (y < -0.25 && z < -0.45) {
      z += 0.12 * Math.exp(-6 * (y + 0.3) * (y + 0.3));
    }
  }

  // 4. Temporal Lobe (Anterior-inferior lateral bulge: Z in [-0.2, 0.5], Y in [-0.5, 0.0])
  if (z > -0.25 && z < 0.6 && y < 0.05 && y > -0.55) {
    const temporalBulge = Math.cos((z - 0.2) * 3.2) * Math.sin((-y + 0.05) * 4.8);
    if (temporalBulge > 0) {
      x += (hemisphere > 0 ? 1 : -1) * temporalBulge * 0.16;
      y -= temporalBulge * 0.08;
    }
  }

  // 5. Brain convolutions (Gyri & Sulci folds)
  const gyri = getCorticalGyri(x, y, z);
  x += gyri * 0.9;
  y += gyri * 1.1;
  z += gyri * 0.9;

  const scale = 1.32;
  return new THREE.Vector3(x * scale, y * scale, z * scale);
}

// Anatomical position generator for Cerebellum (posterior-inferior tucked structure)
function getCerebellumPosition(
  side: -1 | 1,
  u: number,
  v: number
): THREE.Vector3 {
  const theta = v * 0.85 + 0.15;
  const phi = u;

  let cx = side * 0.42 + Math.sin(theta) * Math.cos(phi) * 0.36;
  const cy = -0.52 + Math.cos(theta) * 0.32;
  let cz = -0.68 + Math.sin(theta) * Math.sin(phi) * 0.38;

  // Horizontal folia wrinkles of cerebellum
  const folia = Math.sin(cy * 28.0) * 0.018;
  cx += folia;
  cz += folia;

  const scale = 1.32;
  return new THREE.Vector3(cx * scale, cy * scale, cz * scale);
}

// Anatomical position generator for Brainstem & Pons
function getBrainstemPosition(t: number, angle: number): THREE.Vector3 {
  // t from 0 (top/pons) to 1 (spinal cord bottom)
  const y = -0.38 - t * 0.68;
  const z = -0.24 - t * 0.12;

  // Pons bulge near the top (t in 0.1 to 0.45)
  const ponsBulge = Math.exp(-18 * (t - 0.25) * (t - 0.25)) * 0.12;
  const radius = (0.16 - t * 0.06) + ponsBulge;

  const x = Math.cos(angle) * radius;
  const stemZ = z + Math.sin(angle) * (radius * 0.9) + (ponsBulge * 0.5);

  const scale = 1.32;
  return new THREE.Vector3(x * scale, y * scale, stemZ * scale);
}

// Anatomical position generator for Corpus Callosum (deep inter-hemispheric bridge)
function getCorpusCallosumPosition(t: number, spread: number): THREE.Vector3 {
  // t from 0 (anterior genu) to 1 (posterior splenium)
  // Forms a C-shaped arc in the sagittal plane bridging left and right
  const z = 0.35 - t * 0.75;
  const arcY = Math.sin(t * Math.PI) * 0.22 - 0.05;
  const x = (spread - 0.5) * 0.48; // bridges x from -0.24 to +0.24

  const scale = 1.32;
  return new THREE.Vector3(x * scale, arcY * scale, z * scale);
}

export function ChromeMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const impulsesRef = useRef<THREE.Points>(null!);
  const lastColorUpdateRef = useRef(0);

  // Generate high-density authentic anatomical neural brain network (1100+ nodes, 4200+ connections)
  const {
    nodePositions,
    nodeColors,
    initialColors,
    linePositions,
    lineColors,
    pulseData,
  } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const colorRGBArray: number[] = [];
    const posArray: number[] = [];

    // Portfolio harmonious dark tech palette
    const colorCyan = new THREE.Color("#00f5ff");
    const colorSky = new THREE.Color("#38bdf8");
    const colorBlue = new THREE.Color("#0284c7");
    const colorIndigo = new THREE.Color("#818cf8");
    const colorViolet = new THREE.Color("#c084fc");
    const colorMagenta = new THREE.Color("#e879f9");
    const colorWhite = new THREE.Color("#ffffff");

    // 1. CORTEX: Left and Right Hemispheres (~440 nodes each = 880 cortical nodes)
    const hemispheres: (-1 | 1)[] = [-1, 1];
    const numRows = 24;
    const numCols = 19;

    hemispheres.forEach((h) => {
      for (let i = 0; i < numRows; i++) {
        const v = ((i + 0.6) / (numRows + 0.8)) * Math.PI;
        const countInRow = Math.max(5, Math.floor(Math.sin(v) * numCols));
        for (let j = 0; j < countInRow; j++) {
          const u = (j / countInRow) * Math.PI * 2;
          const jitterU = u + (Math.random() - 0.5) * 0.2;
          const jitterV = v + (Math.random() - 0.5) * 0.16;
          const radialJitter = (Math.random() - 0.5) * 0.08;

          const pos = getHemispherePosition(h, jitterU, jitterV, radialJitter);
          nodes.push(pos);
        }
      }
    });

    // 2. TEMPORAL LOBES: Additional lateral cluster (50 nodes each side = 100 nodes)
    hemispheres.forEach((h) => {
      for (let t = 0; t < 45; t++) {
        const u = Math.PI * (0.8 + Math.random() * 0.9);
        const v = Math.PI * (0.42 + Math.random() * 0.32);
        const pos = getHemispherePosition(h, u, v, 0.05 + Math.random() * 0.06);
        nodes.push(pos);
      }
    });

    // 3. CEREBELLUM: Layered posterior-inferior lobules (65 nodes each side = 130 nodes)
    hemispheres.forEach((side) => {
      for (let c = 0; c < 60; c++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const pos = getCerebellumPosition(side, u, v);
        nodes.push(pos);
      }
    });

    // 4. BRAIN STEM & PONS: Medulla column downwards (55 nodes)
    for (let s = 0; s < 55; s++) {
      const t = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const pos = getBrainstemPosition(t, angle);
      nodes.push(pos);
    }

    // 5. CORPUS CALLOSUM & DEEP TRACTS: Cross-hemisphere connecting bridge (70 nodes)
    for (let cc = 0; cc < 70; cc++) {
      const t = Math.random();
      const spread = Math.random();
      const pos = getCorpusCallosumPosition(t, spread);
      nodes.push(pos);
    }

    // Color gradient mapping matching brain lobes
    nodes.forEach((pos) => {
      posArray.push(pos.x, pos.y, pos.z);

      const tZ = (pos.z + 1.8) / 3.6; // 0 (posterior) to 1 (anterior)
      const tY = (pos.y + 1.7) / 3.4; // 0 (stem) to 1 (superior vertex)

      const nodeColor = new THREE.Color();

      if (tY < 0.22) {
        // Brainstem: Electric violet to magenta
        nodeColor.lerpColors(colorMagenta, colorViolet, tY * 4.5);
      } else if (pos.z < -0.4 && pos.y < -0.3) {
        // Cerebellum: Vivid violet and indigo
        nodeColor.lerpColors(colorViolet, colorIndigo, Math.random() * 0.5 + 0.3);
      } else if (tZ > 0.62) {
        // Frontal Lobe: Brilliant cyan and electric sky blue
        nodeColor.lerpColors(colorSky, colorCyan, (tZ - 0.62) * 2.6);
      } else if (tZ > 0.34) {
        // Parietal & Motor Cortex: Deep blue to vibrant sky
        nodeColor.lerpColors(colorBlue, colorSky, (tZ - 0.34) * 3.4);
      } else {
        // Occipital Lobe: Royal indigo to violet
        nodeColor.lerpColors(colorViolet, colorIndigo, tZ * 2.8);
      }

      // 20% of nodes are active radiant firing synapses (white/light cyan)
      if (Math.random() < 0.20) {
        nodeColor.lerp(colorWhite, 0.88);
      }

      colors.push(nodeColor);
      colorRGBArray.push(nodeColor.r, nodeColor.g, nodeColor.b);
    });

    // 6. DENSE SYNAPTIC AXON CONNECTIONS (Up to 11 connections per node)
    const linePos: number[] = [];
    const lineCol: number[] = [];
    const maxDistance = 0.52;
    const maxConnectionsPerNode = 11;
    const connectionCounts = new Array(nodes.length).fill(0);
    const edgesList: { p1: THREE.Vector3; p2: THREE.Vector3 }[] = [];

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

      neighbors.sort((a, b) => a.dist - b.dist);
      const toConnect = neighbors.slice(
        0,
        maxConnectionsPerNode - connectionCounts[i]
      );

      toConnect.forEach(({ index: j, dist }) => {
        const p2 = nodes[j];
        connectionCounts[i]++;
        connectionCounts[j]++;

        linePos.push(p1.x, p1.y, p1.z);
        linePos.push(p2.x, p2.y, p2.z);

        // Distance-based alpha factor: shorter connections are brighter
        const alpha = Math.max(0.28, 1.0 - dist / maxDistance);
        const c1 = colors[i];
        const c2 = colors[j];

        lineCol.push(c1.r * alpha, c1.g * alpha, c1.b * alpha);
        lineCol.push(c2.r * alpha, c2.g * alpha, c2.b * alpha);

        edgesList.push({ p1, p2 });
      });
    }

    // 7. ACTIVE TRAVELING ELECTRICAL ACTION POTENTIALS (75 sparks racing along axons)
    const impulseCount = 75;
    const impulses = Array.from({ length: impulseCount }, () => {
      const edge = edgesList[Math.floor(Math.random() * edgesList.length)] || {
        p1: nodes[0],
        p2: nodes[1],
      };
      return {
        edge,
        progress: Math.random(),
        speed: 0.35 + Math.random() * 0.75,
      };
    });

    const impulsePosArray = new Float32Array(impulseCount * 3);

    return {
      nodePositions: new Float32Array(posArray),
      nodeColors: new Float32Array(colorRGBArray),
      initialColors: colors,
      linePositions: new Float32Array(linePos),
      lineColors: new Float32Array(lineCol),
      pulseData: { impulses, impulsePosArray },
    };
  }, []);

  const synapseTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createSynapseTexture();
  }, []);

  // Neural pulse and interaction animation loop
  useFrame((state) => {
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();

    // Smooth responsive tilt tracking cursor
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.42,
        0.05
      );
      // Gentle natural rotation showcasing the brain lobes & fissure
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.65 + t * 0.11,
        0.05
      );
    }

    // Synaptic action potentials (brainwave propagation across lobes)
    if (pointsRef.current && t - lastColorUpdateRef.current >= 1 / 24) {
      const geometry = pointsRef.current.geometry;
      const colorAttr = geometry.getAttribute("color") as THREE.BufferAttribute;
      if (colorAttr) {
        const array = colorAttr.array as Float32Array;
        for (let i = 0; i < initialColors.length; i++) {
          const baseColor = initialColors[i];
          const px = nodePositions[i * 3];
          const py = nodePositions[i * 3 + 1];
          const pz = nodePositions[i * 3 + 2];

          // Traveling multi-frequency neural wave
          const wave = Math.sin(t * 3.4 - pz * 1.5 + py * 1.3 + px * 0.85);
          const intensity = wave > 0.5 ? 1.0 + (wave - 0.5) * 1.9 : 0.85;

          array[i * 3] = Math.min(1, baseColor.r * intensity);
          array[i * 3 + 1] = Math.min(1, baseColor.g * intensity);
          array[i * 3 + 2] = Math.min(1, baseColor.b * intensity);
        }
        colorAttr.needsUpdate = true;
        lastColorUpdateRef.current = t;
      }
    }

    // Animate traveling impulse sparks along axons
    if (impulsesRef.current && pulseData) {
      const { impulses, impulsePosArray } = pulseData;
      impulses.forEach((imp, i) => {
        imp.progress += (1 / 60) * imp.speed;
        if (imp.progress > 1) {
          imp.progress = 0;
        }
        const currX = THREE.MathUtils.lerp(imp.edge.p1.x, imp.edge.p2.x, imp.progress);
        const currY = THREE.MathUtils.lerp(imp.edge.p1.y, imp.edge.p2.y, imp.progress);
        const currZ = THREE.MathUtils.lerp(imp.edge.p1.z, imp.edge.p2.z, imp.progress);

        impulsePosArray[i * 3] = currX;
        impulsePosArray[i * 3 + 1] = currY;
        impulsePosArray[i * 3 + 2] = currZ;
      });

      const impulseAttr = impulsesRef.current.geometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      if (impulseAttr) {
        impulseAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      <Float
        speed={1.5}
        rotationIntensity={0.22}
        floatIntensity={0.4}
        floatingRange={[-0.06, 0.06]}
      >
        {/* 1. NEURAL SYNAPSES (GLOWING SPHERICAL NODES) */}
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
            opacity={0.96}
            map={synapseTexture || undefined}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* 2. DENSE SYNAPTIC AXON CONNECTIONS (HIGH-DETAIL NEURAL PLEXUS) */}
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
            opacity={0.52}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            linewidth={1}
          />
        </lineSegments>

        {/* 3. TRAVELING ELECTRICAL ACTION POTENTIALS (SPARKS RACING ALONG FIBERS) */}
        <points ref={impulsesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={pulseData.impulsePosArray.length / 3}
              array={pulseData.impulsePosArray}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.18}
            color="#ffffff"
            transparent
            opacity={1}
            map={synapseTexture || undefined}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </Float>
    </group>
  );
}
