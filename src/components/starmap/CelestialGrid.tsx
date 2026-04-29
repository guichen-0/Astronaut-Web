"use client";

import { useMemo } from "react";

export function CelestialGrid() {
  const [positions] = useMemo(() => {
    const pos: number[] = [];
    const radius = 45;
    const segments = 64;

    // Declination circles (at different declinations)
    for (let di = 0; di < 6; di++) {
      const dec = ((di + 1) / 7) * Math.PI - Math.PI / 2;
      const r = Math.cos(Math.abs(dec)) * radius;
      const y = Math.sin(dec) * radius;

      // Skip if too close to poles
      if (r < 5) continue;

      for (let j = 0; j < segments; j++) {
        const theta1 = (j / segments) * Math.PI * 2;
        const theta2 = ((j + 1) / segments) * Math.PI * 2;

        pos.push(r * Math.cos(theta1), y, r * Math.sin(theta1));
        pos.push(r * Math.cos(theta2), y, r * Math.sin(theta2));
      }
    }

    return [new Float32Array(pos)];
  }, []);

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
      <lineBasicMaterial color="#1a365d" transparent opacity={0.4} />
    </lineSegments>
  );
}
