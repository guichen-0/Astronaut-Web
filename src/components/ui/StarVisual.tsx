const SPECTRAL_GLOWS: Record<string, { color: string; glow: string }> = {
  O: { color: "#9bb0ff", glow: "rgba(155,176,255,0.4)" },
  B: { color: "#aabfff", glow: "rgba(170,191,255,0.35)" },
  A: { color: "#cad8ff", glow: "rgba(202,216,255,0.3)" },
  F: { color: "#f8f7ff", glow: "rgba(248,247,255,0.25)" },
  G: { color: "#fff4e8", glow: "rgba(255,244,232,0.25)" },
  K: { color: "#ffd2a1", glow: "rgba(255,210,161,0.3)" },
  M: { color: "#ffaa5e", glow: "rgba(255,170,94,0.35)" },
};

interface StarVisualProps {
  spectralType?: string | null;
  magnitude?: number;
  name: string;
  className?: string;
}

export function StarVisual({ spectralType, magnitude = 1, name, className = "" }: StarVisualProps) {
  const first = spectralType?.[0]?.toUpperCase() ?? "G";
  const glow = SPECTRAL_GLOWS[first] ?? SPECTRAL_GLOWS.G;
  const size = Math.max(20, Math.min(60, 50 - magnitude * 3));

  return (
    <svg viewBox="0 0 100 100" className={`h-full w-full ${className}`} aria-label={name}>
      <defs>
        <radialGradient id={`star-glow-${name.replace(/\s+/g, "-")}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={glow.glow} />
          <stop offset="60%" stopColor={glow.color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={glow.color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#star-glow-${name.replace(/\s+/g, "-")})`} />
      {/* Star shape */}
      <polygon
        points={starPoints(50, 50, size / 2, size / 4)}
        fill={glow.color}
        opacity="0.9"
      />
    </svg>
  );
}

function starPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    points.push(`${cx + outerR * Math.cos(outerAngle)},${cy + outerR * Math.sin(outerAngle)}`);
    const innerAngle = ((i * 2 + 1) * Math.PI) / 5 - Math.PI / 2;
    points.push(`${cx + innerR * Math.cos(innerAngle)},${cy + innerR * Math.sin(innerAngle)}`);
  }
  return points.join(" ");
}
