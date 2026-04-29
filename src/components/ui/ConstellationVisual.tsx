interface ConstellationVisualProps {
  name: string;
  abbreviation: string;
  className?: string;
}

const PATTERNS: Record<string, string> = {
  // Original patterns
  UMA: "M20,60 L35,30 L50,45 L65,25 L80,40 L75,65 L60,55",
  ORI: "M25,70 L40,50 L55,55 L70,35 L85,40 M55,55 L50,80 M40,50 L30,30",
  LEO: "M30,65 L45,45 L60,50 L75,30 L85,40 L70,60 L55,55",
  CAS: "M25,55 L50,25 L75,55 L50,45 L25,75",
  CYG: "M50,20 L50,50 L35,70 M50,50 L65,45 L80,60 M50,50 L45,75",
  TAU: "M30,55 L45,40 L60,45 L75,35 L80,50 L65,60 L50,55 L35,65",
  SCO: "M30,25 L40,35 L35,50 L50,55 L60,45 L70,50 L75,65 L65,75 L55,70",
  VIR: "M35,30 L50,40 L65,35 L75,50 L60,65 L45,60 L30,70",
  HER: "M40,20 L55,30 L50,50 L65,40 L80,50 L70,65 L55,60 L45,70",
  AND: "M25,55 L40,40 L55,50 L70,35 L85,45",
  // New patterns
  AQR: "M30,40 L45,35 L55,50 L65,40 L80,45 M55,50 L55,70 L45,80 M55,50 L55,75 L65,80",
  ARI: "M35,55 L50,40 L65,55 L55,70 M50,40 L60,30",
  CNC: "M40,30 L50,45 L40,60 M50,45 L60,60 M50,45 L60,35 L75,40 L70,55 M50,45 L55,55",
  CMA: "M30,35 L45,30 L60,40 L75,35 L85,50 L70,60 L55,55 L40,65 L30,35 L55,55",
  CMI: "M40,45 L60,35 L70,55 L40,45",
  CAP: "M35,55 L50,45 L65,55 L55,70 L35,55 M50,45 L45,30",
  CEP: "M45,25 L55,30 L65,25 L70,45 L55,65 L40,45 L45,25 M55,65 L50,75",
  CET: "M20,50 L35,40 L50,45 L65,35 L75,45 L85,40 L80,55 L65,50 L50,60 L35,55 L20,60",
  CRB: "M30,50 Q50,20 80,50",
  CRV: "M35,40 L55,30 L75,45 L55,60 L35,40 L45,55 L55,60",
  DEL: "M40,40 L55,30 L70,40 L55,50 L40,40 M55,50 L55,70",
  DRA: "M30,25 L45,35 L55,30 L65,40 L50,55 L60,65 L70,60 L80,70 L70,80 L55,75 L45,65",
  GEM: "M35,25 L50,40 L55,55 L45,70 M50,40 L65,35 L80,45 L70,60 L55,55",
  LIB: "M35,45 L50,40 L65,50 L55,60 L35,45 M65,50 L75,55",
  LYR: "M40,35 L55,25 L70,35 L55,45 L40,35 M55,45 L55,65 M55,55 L45,70 M55,55 L65,70",
  PEG: "M30,45 L50,30 L75,35 L85,55 L65,70 L50,55 L30,45 M50,30 L50,55 M75,35 L65,70",
  PER: "M25,45 L40,35 L55,40 L70,30 L85,40 M55,40 L50,55 L35,65 M55,40 L60,55 L75,60",
  PSC: "M20,55 L35,45 L50,50 L65,40 L80,50 M50,50 L45,65 L35,70 M50,50 L55,65 L65,70",
  SGR: "M35,35 L50,30 L65,35 L75,45 L65,55 L50,60 L35,55 L30,45 L35,35 M65,55 L70,70 M50,60 L45,75",
  UMI: "M40,25 L50,20 L55,30 L65,25 L70,40 L60,50 L50,45 L40,25",
  VUL: "M40,45 L55,35 L70,45 L60,60 L40,45",
};

export function ConstellationVisual({ name, abbreviation, className = "" }: ConstellationVisualProps) {
  const pattern = PATTERNS[abbreviation.toUpperCase()];

  if (!pattern) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 ${className}`}>
        <span className="text-4xl font-bold text-blue-300/50">{abbreviation}</span>
      </div>
    );
  }

  return (
    <svg viewBox="0 0 110 100" className={`h-full w-full ${className}`} aria-label={name}>
      <rect width="110" height="100" fill="none" rx="8" />
      {/* Stars */}
      {parsePoints(pattern).map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#fff" opacity="0.9" />
      ))}
      {/* Lines */}
      <polyline
        points={parsePoints(pattern).map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="rgba(148, 163, 184, 0.4)"
        strokeWidth="1.5"
        strokeDasharray="3,2"
      />
      {/* Star glow */}
      {parsePoints(pattern).map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="none" stroke="rgba(255,255,255,0.1)" />
      ))}
    </svg>
  );
}

function parsePoints(str: string): { x: number; y: number }[] {
  return str.split(" ").map((pair) => {
    const [x, y] = pair.split(",");
    return { x: parseFloat(x), y: parseFloat(y) };
  });
}
