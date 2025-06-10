export interface Point2D {
  x: number;
  y: number;
}

export interface FreeFallState {
  velocity: number; // Başlangıç hızı (m/s) - Max: 120
  angle: number; // Atış açısı (derece) - 0-90
  frictionCoef: number; // Sürtünme katsayısı (β/m) - 0-0.01
  time: number; // Geçen süre (s)
  position: Point2D; // Konum (x,y)
  trajectory: Point2D[]; // Yörünge noktaları
  isRunning: boolean; // Simülasyon çalışıyor mu?
}

// Konstantlar
export const FREE_FALL_CONSTANTS = {
  MAX_VELOCITY: 120,
  MIN_VELOCITY: 0,
  MAX_ANGLE: 90,
  MIN_ANGLE: 0,
  MAX_FRICTION: 0.01,
  MIN_FRICTION: 0,
  GRAVITY: 9.81,
  DT: 0.016, // 60fps
  MAX_X: 1000,
  MAX_Y: 300,
} as const;

export interface FreeFallControlsProps {
  state: FreeFallState;
  onStart: () => void;
  onReset: () => void;
  onVelocityChange: (velocity: number) => void;
  onAngleChange: (angle: number) => void;
  onFrictionChange: (friction: number) => void;
}

export interface FreeFallProps {
  width?: number;
  height?: number;
  onStateChange?: (state: FreeFallState) => void;
}
