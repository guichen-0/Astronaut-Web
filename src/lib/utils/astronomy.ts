/**
 * Convert B-V color index to RGB color.
 * Polynomial approximation from astronomical literature.
 */
export function bvToRgb(bv: number): [number, number, number] {
  let t = bv;
  if (t < -0.4) t = -0.4;
  if (t > 2.0) t = 2.0;

  let r: number, g: number, b: number;

  if (t >= -0.40 && t < 0.00) {
    r = 0.62;
    g = 0.70;
    b = 1.00;
  } else if (t >= 0.00 && t < 0.20) {
    r = 0.70;
    g = 0.75;
    b = 1.00;
  } else if (t >= 0.20 && t < 0.40) {
    r = 0.80;
    g = 0.82;
    b = 1.00;
  } else if (t >= 0.40 && t < 0.60) {
    r = 0.95;
    g = 0.93;
    b = 1.00;
  } else if (t >= 0.60 && t < 0.80) {
    r = 1.00;
    g = 0.95;
    b = 0.90;
  } else if (t >= 0.80 && t < 1.00) {
    r = 1.00;
    g = 0.88;
    b = 0.70;
  } else if (t >= 1.00 && t < 1.20) {
    r = 1.00;
    g = 0.80;
    b = 0.50;
  } else if (t >= 1.20 && t < 1.40) {
    r = 1.00;
    g = 0.70;
    b = 0.30;
  } else if (t >= 1.40 && t < 1.60) {
    r = 1.00;
    g = 0.55;
    b = 0.15;
  } else {
    r = 1.00;
    g = 0.40;
    b = 0.00;
  }

  return [r, g, b];
}

/**
 * Convert spectral type to approximate temperature in Kelvin.
 */
export function spectralTypeToTemperature(spectralType: string): number | null {
  const match = spectralType.match(/^([OBAFGKMRTS])(\d+)?/i);
  if (!match) return null;

  const type = match[1].toUpperCase();
  const temperatures: Record<string, number> = {
    O: 35000,
    B: 20000,
    A: 9500,
    F: 7000,
    G: 5600,
    K: 4500,
    M: 3300,
    R: 4000,
    T: 1500,
    S: 3000,
  };

  return temperatures[type] ?? null;
}

/**
 * Convert right ascension (hours) to degrees.
 */
export function raHoursToDegrees(hours: number): number {
  return hours * 15;
}

/**
 * Calculate approximate 3D position from RA, Dec, and distance.
 */
export function equatorialToCartesian(
  raHours: number,
  decDeg: number,
  distance: number
): { x: number; y: number; z: number } {
  const raRad = raHoursToDegrees(raHours) * (Math.PI / 180);
  const decRad = decDeg * (Math.PI / 180);

  return {
    x: distance * Math.cos(decRad) * Math.cos(raRad),
    y: distance * Math.cos(decRad) * Math.sin(raRad),
    z: distance * Math.sin(decRad),
  };
}

/**
 * Format large numbers in astronomical context.
 */
export function formatAstroNumber(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}万亿`;
  if (value >= 1e8) return `${(value / 1e8).toFixed(2)}亿`;
  if (value >= 1e4) return `${(value / 1e4).toFixed(2)}万`;
  return value.toLocaleString();
}

/**
 * Format distance in light years with appropriate unit.
 */
export function formatDistanceLy(parsecs: number): string {
  const ly = parsecs * 3.26156;
  if (ly < 1) return `${(ly * 1000).toFixed(2)} 光年`;
  return `${ly.toFixed(2)} 光年`;
}

/**
 * Get season for a constellation based on celestial coordinates.
 */
export function getConstellationSeason(raHours: number): string {
  // RA hours roughly correspond to season of best visibility
  if (raHours >= 14 && raHours < 20) return "夏季";
  if (raHours >= 20 || raHours < 4) return "秋季";
  if (raHours >= 4 && raHours < 10) return "春季";
  return "冬季";
}
