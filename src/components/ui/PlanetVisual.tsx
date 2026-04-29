const PLANET_STYLES: Record<string, { color: string; ringColor?: string; gradient: string; size: number }> = {
  mercury: { color: "#b5b5b5", gradient: "from-gray-400 to-gray-500", size: 40 },
  venus: { color: "#e6c87c", gradient: "from-yellow-400 to-amber-600", size: 50 },
  earth: { color: "#4b7bec", gradient: "from-blue-500 to-green-500", size: 52 },
  mars: { color: "#e17055", gradient: "from-red-400 to-red-600", size: 44 },
  jupiter: { color: "#d4a373", gradient: "from-orange-300 to-orange-700", size: 80 },
  saturn: { color: "#e8d5a3", gradient: "from-amber-200 to-amber-600", size: 72, ringColor: "#c4a87c" },
  uranus: { color: "#7fd1e0", gradient: "from-cyan-300 to-cyan-600", size: 56 },
  neptune: { color: "#4169e1", gradient: "from-blue-400 to-blue-800", size: 54 },
  pluto: { color: "#d4c5a9", gradient: "from-stone-300 to-stone-500", size: 30 },
  ceres: { color: "#8a8a8a", gradient: "from-gray-400 to-gray-600", size: 24 },
  eris: { color: "#c8c0d0", gradient: "from-purple-300 to-purple-500", size: 28 },
  makemake: { color: "#c48a6e", gradient: "from-orange-300 to-red-400", size: 26 },
  haumea: { color: "#a0b0c0", gradient: "from-blue-300 to-gray-500", size: 26 },
};

interface PlanetVisualProps {
  slug: string;
  name: string;
  className?: string;
}

export function PlanetVisual({ slug, name, className = "" }: PlanetVisualProps) {
  const style = PLANET_STYLES[slug];
  if (!style) {
    return (
      <div className={`flex items-center justify-center rounded-full bg-muted ${className}`}>
        <span className="text-2xl text-muted-foreground">{name[0]}</span>
      </div>
    );
  }

  const { color, ringColor, size } = style;

  if (slug === "saturn" && ringColor) {
    return (
      <svg viewBox="0 0 120 80" className={`h-full w-full ${className}`} aria-label={name}>
        <ellipse cx="60" cy="40" rx="55" ry="14" fill="none" stroke={ringColor} strokeWidth="6" opacity="0.7" />
        <circle cx="60" cy="40" r={size * 0.45} fill={color} />
        <ellipse cx="60" cy="40" rx="55" ry="14" fill="none" stroke={ringColor} strokeWidth="4" opacity="0.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={`h-full w-full ${className}`} aria-label={name}>
      <defs>
        <radialGradient id={`planet-${slug}`} cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r={size * 0.45} fill={`url(#planet-${slug})`} />
      <circle cx="50" cy="50" r={size * 0.45} fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}
