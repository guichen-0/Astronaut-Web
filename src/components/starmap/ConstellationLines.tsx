"use client";

import { useEffect, useState } from "react";

export function ConstellationLines() {
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    fetch("/api/starmap/lines")
      .then((r) => r.json())
      .then((d) => {
        const data = d.data ?? [] as { positions: number[] }[];
        const allPositions: number[] = [];
        for (const item of data) {
          allPositions.push(...item.positions);
        }
        setPositions(new Float32Array(allPositions));
      })
      .catch(() => setPositions(new Float32Array(0)));
  }, []);

  if (!positions || positions.length === 0) return null;

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#4a5568" transparent opacity={0.3} />
    </lineSegments>
  );
}
