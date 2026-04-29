"use client";

import { useRef, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

function createCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.3, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.7, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface StarData {
  id: string;
  name: string | null;
  bayerDesignation: string | null;
  rightAscension: number;
  declination: number;
  apparentMagnitude: number;
  colorIndexBv: number | null;
  x: number;
  y: number;
  z: number;
}

function bvToColor(bv: number | null): [number, number, number] {
  const t = Math.max(-0.4, Math.min(2.0, bv ?? 0.5));
  if (t < 0.0) return [0.62, 0.70, 1.00];
  if (t < 0.2) return [0.70, 0.75, 1.00];
  if (t < 0.4) return [0.80, 0.82, 1.00];
  if (t < 0.6) return [0.95, 0.93, 1.00];
  if (t < 0.8) return [1.00, 0.95, 0.90];
  if (t < 1.0) return [1.00, 0.88, 0.70];
  if (t < 1.2) return [1.00, 0.80, 0.50];
  if (t < 1.4) return [1.00, 0.70, 0.30];
  if (t < 1.6) return [1.00, 0.55, 0.15];
  return [1.00, 0.40, 0.00];
}

export function StarPoints({ stars, onStarClick }: { stars: StarData[]; onStarClick?: (id: string) => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  const circleTexture = useMemo(() => createCircleTexture(), []);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(stars.length * 3);
    const col = new Float32Array(stars.length * 3);
    const siz = new Float32Array(stars.length);

    stars.forEach((star, i) => {
      pos[i * 3] = star.x;
      pos[i * 3 + 1] = star.y;
      pos[i * 3 + 2] = star.z;

      const color = bvToColor(star.colorIndexBv);
      col[i * 3] = color[0];
      col[i * 3 + 1] = color[1];
      col[i * 3 + 2] = color[2];

      siz[i] = Math.max(0.4, 2.5 - star.apparentMagnitude * 0.18);
    });

    return [pos, col, siz];
  }, [stars]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.003;
    }
  });

  const handlePointerDown = useMemo(() => {
    return (e: ThreeEvent<PointerEvent>) => {
      if (e.index !== undefined && onStarClick) {
        const star = stars[e.index];
        if (star) onStarClick(star.id);
      }
    };
  }, [stars, onStarClick]);

  return (
    <points ref={pointsRef} onPointerDown={handlePointerDown}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={stars.length}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={stars.length}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={stars.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        map={circleTexture}
        alphaTest={0.01}
      />
    </points>
  );
}
