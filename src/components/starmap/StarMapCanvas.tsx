"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { StarPoints } from "./StarPoints";
import { StarLabels } from "./StarLabels";
import { ConstellationLines } from "./ConstellationLines";
import { CelestialGrid } from "./CelestialGrid";
import { StarMapControls } from "./StarMapControls";
import { StarInfoPanel } from "./StarInfoPanel";
import { StarSearch } from "./StarSearch";
import { useStarMap } from "@/hooks/useStarMap";

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

export function StarMapCanvas() {
  const showConstellations = useStarMap((s) => s.showConstellations);
  const showGrid = useStarMap((s) => s.showGrid);
  const magnitudeLimit = useStarMap((s) => s.magnitudeLimit);
  const setSelectedStar = useStarMap((s) => s.setSelectedStar);
  const [stars, setStars] = useState<StarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/starmap")
      .then((r) => r.json())
      .then((d) => setStars(d.data ?? []))
      .catch(() => setStars([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter by magnitude
  const visibleStars = stars.filter(
    (s) => s.apparentMagnitude <= magnitudeLimit
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#000005]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 70 }}
        dpr={[1, 2]}
        className="starmap-canvas"
        style={{ cursor: "pointer" }}
      >
        <color attach="background" args={["#000005"]} />
        <ambientLight intensity={0.1} />
        <Suspense fallback={null}>
          <StarPoints stars={visibleStars} onStarClick={(id) => setSelectedStar(id)} />
          <StarLabels stars={visibleStars} />
          {showConstellations && <ConstellationLines />}
          {showGrid && <CelestialGrid />}
        </Suspense>
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={1}
          maxDistance={500}
          zoomSpeed={1.2}
          rotateSpeed={0.4}
        />
      </Canvas>

      {/* UI Overlays */}
      <StarSearch stars={stars} onSelect={(s) => setSelectedStar(s.id)} />
      <StarMapControls />
      <StarInfoPanel />
    </div>
  );
}
