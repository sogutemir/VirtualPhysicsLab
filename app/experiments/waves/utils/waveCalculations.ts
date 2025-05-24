export interface WaveSource {
  x: number; // Position X (0-100 normalized)
  y: number; // Position Y (0-100 normalized)
  frequency: number; // Hz
  amplitude: number; // Wave amplitude
  active: boolean; // Whether the source is active
  phase: number; // Phase in radians
}

/**
 * Calculate wave interference at a specific point
 */
export function calculateInterference(
  sources: WaveSource[],
  x: number,
  y: number,
  time: number,
  waveSpeed: number,
  damping: number = 0.02
): number {
  let totalAmplitude = 0;

  sources.forEach((source) => {
    if (!source.active) return;

    // Calculate distance from source to point
    const dx = x - source.x;
    const dy = y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Wave equation: A * sin(2π(ft - d/λ) + φ)
    const wavelength = waveSpeed / source.frequency;
    const phaseShift = (2 * Math.PI * distance) / wavelength;
    const wavePhase =
      2 * Math.PI * source.frequency * time - phaseShift + source.phase;

    // Apply damping based on distance
    const dampedAmplitude = source.amplitude * Math.exp(-damping * distance);

    // Calculate wave amplitude at this point
    const waveAmplitude = dampedAmplitude * Math.sin(wavePhase);

    totalAmplitude += waveAmplitude;
  });

  return totalAmplitude;
}

/**
 * Get color for heatmap visualization
 */
export function getHeatmapColor(amplitude: number): string {
  // Normalize amplitude to 0-1 range
  const intensity = Math.max(0, Math.min(1, (amplitude + 2) / 4));

  if (amplitude > 0) {
    // Warm colors for positive interference (constructive)
    const r = Math.floor(255 * Math.min(1, intensity * 1.5));
    const g = Math.floor(180 * intensity);
    const b = Math.floor(60 * intensity);
    const alpha = 0.3 + intensity * 0.7;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    // Cool colors for negative interference (destructive)
    const r = Math.floor(60 * intensity);
    const g = Math.floor(120 * intensity);
    const b = Math.floor(255 * Math.min(1, intensity * 1.5));
    const alpha = 0.3 + intensity * 0.7;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

/**
 * Calculate contour level for a given amplitude
 */
export function getContourLevel(amplitude: number): number {
  const levels = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];
  let closestLevel = levels[0];
  let minDiff = Math.abs(amplitude - levels[0]);

  levels.forEach((level) => {
    const diff = Math.abs(amplitude - level);
    if (diff < minDiff) {
      minDiff = diff;
      closestLevel = level;
    }
  });

  return closestLevel;
}

/**
 * Generate interference pattern data for visualization
 */
export function generateInterferencePattern(
  sources: WaveSource[],
  width: number,
  height: number,
  time: number,
  waveSpeed: number,
  damping: number,
  gridSize: number = 4
): Array<Array<number>> {
  const pattern: Array<Array<number>> = [];

  for (let x = 0; x < width; x += gridSize) {
    const row: number[] = [];
    for (let y = 0; y < height; y += gridSize) {
      const normalizedX = (x / width) * 100;
      const normalizedY = (y / height) * 100;

      const amplitude = calculateInterference(
        sources,
        normalizedX,
        normalizedY,
        time,
        waveSpeed,
        damping
      );

      row.push(amplitude);
    }
    pattern.push(row);
  }

  return pattern;
}

/**
 * Check if point is near a contour line
 */
export function isNearContour(
  amplitude: number,
  level: number,
  threshold: number = 0.15
): boolean {
  return Math.abs(amplitude - level) < threshold;
}

/**
 * Calculate phase difference between two sources at a point
 */
export function calculatePhaseDifference(
  source1: WaveSource,
  source2: WaveSource,
  x: number,
  y: number,
  waveSpeed: number
): number {
  if (!source1.active || !source2.active) return 0;

  // Distance from each source
  const d1 = Math.sqrt((x - source1.x) ** 2 + (y - source1.y) ** 2);
  const d2 = Math.sqrt((x - source2.x) ** 2 + (y - source2.y) ** 2);

  // Wavelengths
  const λ1 = waveSpeed / source1.frequency;
  const λ2 = waveSpeed / source2.frequency;

  // Phase difference due to path difference and source phases
  const pathPhaseDiff = 2 * Math.PI * (d2 / λ2 - d1 / λ1);
  const sourcePhaseDiff = source2.phase - source1.phase;

  return pathPhaseDiff + sourcePhaseDiff;
}

/**
 * Determine interference type at a point
 */
export function getInterferenceType(
  sources: WaveSource[],
  x: number,
  y: number,
  waveSpeed: number
): 'constructive' | 'destructive' | 'partial' | 'none' {
  const activeSources = sources.filter((s) => s.active);

  if (activeSources.length < 2) return 'none';

  const amplitude = calculateInterference(activeSources, x, y, 0, waveSpeed, 0);
  const maxPossibleAmplitude = activeSources.reduce(
    (sum, s) => sum + s.amplitude,
    0
  );
  const ratio = Math.abs(amplitude) / maxPossibleAmplitude;

  if (ratio > 0.8) return 'constructive';
  if (ratio < 0.2) return 'destructive';
  return 'partial';
}
