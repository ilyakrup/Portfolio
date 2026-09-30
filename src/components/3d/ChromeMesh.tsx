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
  gradient.addColorStop(0.25, "rgba(224, 242, 254, 0.95)");
  gradient.addColorStop(0.55, "rgba(56, 189, 248, 0.5)");
  gradient.addColorStop(0.8, "rgba(2, 132, 199, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Parametric anatomical brain position generator
function getBrainPosition(u: number, v: number, scaleFactor: number = 1.0): THREE.Vector3 {
  const theta = v; // 0 (top) to PI (bottom)
  const phi = u;   // 0 to 2*PI (around)

  // Ellipsoid base: elongated front-to-back (Z), wide (X), and high (Y)
  let x = Math.sin(theta) * Math.sin(phi) * 1.1;
  let y = Math.cos(theta) * 0.98;
  let z = Math.sin(theta) * Math.cos(phi) * 1.38;

  // 1. Longitudinal Fissure (central depression separating left and right hemispheres)
  if (y > -0.42) {
    const xDist = Math.abs(x);
    const fissureDepth = 0.24 * Math.exp(-10 * xDist * xDist);
    x += (x > 0 ? -1 : 1) * fissureDepth;
  }

  // 2. Frontal Lobe elevation and rounded contour (Z > 0.1)
  if (z > 0.1) {
    y += 0.1 * Math.sin(z * 1.4);
    x *= 0.96; // slightly narrower frontal pole
  }

  // 3. Cerebellum (posterior-inferior bulge): Z < -0.15 and Y between -0.15 and -0.8
  if (z < -0.15 && y < -0.15 && y > -0.8) {
    const cbFactor = Math.sin((y + 0.15) * (Math.PI / -0.65));
    z -= 0.26 * cbFactor;
    x *= 1 + 0.2 * cbFactor;
  }

  // 4. Brain Stem: delicate conical taper downwards at the bottom base
  if (y < -0.45) {
    const stemFactor = Math.min(1, (-y - 0.45) / 0.55);
    x = THREE.MathUtils.lerp(x, x * 0.18, stemFactor);
    z = THREE.MathUtils.lerp(z, -0.28 + z * 0.18, stemFactor);
    y -= stemFactor * 0.65; // extends downwards
  }

  // Organic cortical sulci micro-variations
  const organicNoise =
    Math.sin(x * 6 + y * 4) * 0.03 + Math.cos(z * 5 + x * 4) * 0.03;
  x += organicNoise;
  y += organicNoise;
  z += organicNoise;

  const baseScale = 1.38 * scaleFactor;
  return new THREE.Vector3(x * baseScale, y * baseScale, z * baseScale);
}

export function ChromeMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const impulsesRef = useRef<THREE.Points>(null!);

  // Generate high-density neural brain network (500+ nodes, 1800+ synaptic connections)
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

    // Colors matching user's dark cyan/blue/indigo/violet palette with glowing white synapses
    const colorCyan = new THREE.Color("#00f5ff");
    const colorSky = new THREE.Color("#38bdf8");
    const colorBlue = new THREE.Color("#0284c7");
    const colorIndigo = new THREE.Color("#818cf8");
    const colorViolet = new THREE.Color("#c084fc");
    const colorWhite = new THREE.Color("#ffffff");

    // 1. Surface cortical nodes: 22 rows x 20 cols (~440 nodes)
    const numRows = 22;
    const numCols = 20;
    for (let i = 0; i < numRows; i++) {
      const v = ((i + 0.5) / numRows) * Math.PI;
      const countInRow = Math.max(5, Math.floor(Math.sin(v) * numCols));
      for (let j = 0; j < countInRow; j++) {
        const u = (j / countInRow) * Math.PI * 2;
        const jitterU = u + (Math.random() - 0.5) * 0.18;
        const jitterV = v + (Math.random() - 0.5) * 0.14;
        const pos = getBrainPosition(
          jitterU,
          jitterV,
          1.0 + (Math.random() - 0.5) * 0.05
        );
        nodes.push(pos);
      }
    }

    // 2. Extra brainstem and cerebellum neural cluster (to define the bottom stem clearly)
    for (let s = 0; s < 45; s++) {
      const v = Math.PI * (0.75 + Math.random() * 0.25);
      const u = Math.random() * Math.PI * 2;
      const pos = getBrainPosition(u, v, 0.95 + Math.random() * 0.1);
      nodes.push(pos);
    }

    // 3. Interior volumetric deep neural pathways (depth layers, ~65 nodes)
    for (let k = 0; k < 65; k++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      const innerScale = 0.65 + Math.random() * 0.22;
      const pos = getBrainPosition(u, v, innerScale);
      nodes.push(pos);
    }

    // Color gradient mapping across the brain lobes
    nodes.forEach((pos) => {
      posArray.push(pos.x, pos.y, pos.z);

      const tZ = (pos.z + 1.8) / 3.6; // 0 (back) to 1 (front)
      const tY = (pos.y + 2.0) / 3.8; // 0 (stem) to 1 (top)

      const nodeColor = new THREE.Color();
      if (tY < 0.28) {
        // Brain stem: violet to magenta
        nodeColor.lerpColors(colorViolet, colorIndigo, tY * 3.5);
      } else if (tZ > 0.65) {
        // Frontal lobe: brilliant cyan / electric sky
        nodeColor.lerpColors(colorSky, colorCyan, (tZ - 0.65) * 2.8);
      } else if (tZ > 0.35) {
        // Midbrain: deep blue to sky blue
        nodeColor.lerpColors(colorBlue, colorSky, (tZ - 0.35) * 3.3);
      } else {
        // Occipital lobe / cerebellum: indigo to violet
        nodeColor.lerpColors(colorViolet, colorIndigo, tZ * 2.8);
      }

      // 22% of nodes are active radiant firing synapses (white/light cyan)
      if (Math.random() < 0.22) {
        nodeColor.lerp(colorWhite, 0.85);
      }

      colors.push(nodeColor);
      colorRGBArray.push(nodeColor.r, nodeColor.g, nodeColor.b);
    });

    // 4. Construct HIGH-DENSITY synaptic connections (up to 8 connections per node)
    const linePos: number[] = [];
    const lineCol: number[] = [];
    const maxDistance = 0.62;
    const maxConnectionsPerNode = 8;
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

        // Distance-based alpha factor: shorter connections are more intense
        const alpha = Math.max(0.3, 1.0 - dist / maxDistance);
        const c1 = colors[i];
        const c2 = colors[j];

        lineCol.push(c1.r * alpha, c1.g * alpha, c1.b * alpha);
        lineCol.push(c2.r * alpha, c2.g * alpha, c2.b * alpha);

        edgesList.push({ p1, p2 });
      });
    }

    // 5. Active traveling electrical impulse packets
    const impulseCount = 35;
    const impulses = Array.from({ length: impulseCount }, () => {
      const edge = edgesList[Math.floor(Math.random() * edgesList.length)] || {
        p1: nodes[0],
        p2: nodes[1],
      };
      return {
        edge,
        progress: Math.random(),
        speed: 0.4 + Math.random() * 0.7,
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
        pointer.y * 0.45,
        0.05
      );
      // Gentle natural rotation showcasing the brain lobes
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.65 + t * 0.12,
        0.05
      );
    }

    // Synaptic action potentials (brainwave propagation across lobes)
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

          // Traveling multi-frequency neural wave
          const wave = Math.sin(t * 3.2 - pz * 1.6 + py * 1.4 + px * 0.9);
          const intensity = wave > 0.5 ? 1.0 + (wave - 0.5) * 1.9 : 0.85;

          array[i * 3] = Math.min(1, baseColor.r * intensity);
          array[i * 3 + 1] = Math.min(1, baseColor.g * intensity);
          array[i * 3 + 2] = Math.min(1, baseColor.b * intensity);
        }
        colorAttr.needsUpdate = true;
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
        speed={1.6}
        rotationIntensity={0.25}
        floatIntensity={0.45}
        floatingRange={[-0.07, 0.07]}
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
            size={0.16}
            vertexColors
            transparent
            opacity={0.98}
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
            opacity={0.55}
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
            size={0.19}
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
