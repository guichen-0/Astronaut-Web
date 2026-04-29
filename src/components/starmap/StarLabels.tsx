"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useStarMap } from "@/hooks/useStarMap";

interface StarData {
  id: string;
  name: string | null;
  apparentMagnitude: number;
  x: number;
  y: number;
  z: number;
}

interface StarLabelsProps {
  stars: StarData[];
}

export function StarLabels({ stars }: StarLabelsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const showLabels = useStarMap((s) => s.showLabels);

  const namedStars = useMemo(
    () =>
      stars.filter((s) => s.name && s.apparentMagnitude < 4.5).slice(0, 50),
    [stars]
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.003;
    }
  });

  if (!showLabels) return null;

  return (
    <group ref={groupRef}>
      {namedStars.map((star) => (
        <Text
          key={star.id}
          position={[star.x, star.y - 0.5, star.z]}
          fontSize={0.3}
          color="rgba(200, 210, 255, 0.6)"
          anchorX="center"
          anchorY="top"
        >
          {star.name}
        </Text>
      ))}
    </group>
  );
}
