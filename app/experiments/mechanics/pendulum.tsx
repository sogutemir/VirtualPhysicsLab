import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { CustomSlider } from '../../../components/ui/slider';
import Svg, {
  Line,
  Circle,
  Path,
  Rect,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';

const { width, height } = Dimensions.get('window');

// Memoized Web Slider Component with optimized styling
const WebSlider = memo<{
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  style?: any;
  minimumTrackTintColor?: string;
  disabled?: boolean;
}>(
  ({
    value,
    onValueChange,
    minimumValue,
    maximumValue,
    style,
    minimumTrackTintColor,
    disabled = false,
  }) => {
    const trackColor = minimumTrackTintColor || '#3498db';

    const sliderStyle = useMemo(
      () => ({
        width: '100%',
        height: '6px',
        borderRadius: '3px',
        background: '#e2e8f0',
        outline: 'none',
        appearance: 'none' as const,
        WebkitAppearance: 'none' as const,
      }),
      []
    );

    const thumbStyle = useMemo(
      () => `
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${trackColor};
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    input[type="range"]::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${trackColor};
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  `,
      [trackColor]
    );

    if (Platform.OS === 'web') {
      return (
        <div style={{ width: '100%', padding: '8px 0' }}>
          <input
            type="range"
            min={minimumValue}
            max={maximumValue}
            step="0.01"
            value={value}
            onChange={(e) =>
              !disabled && onValueChange(parseFloat(e.target.value))
            }
            disabled={disabled}
            style={{
              ...sliderStyle,
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          />
          <style>{thumbStyle}</style>
        </div>
      );
    }

    return (
      <CustomSlider
        style={{
          ...style,
          opacity: disabled ? 0.5 : 1,
        }}
        min={minimumValue}
        max={maximumValue}
        value={value}
        onValueChange={disabled ? () => {} : onValueChange}
        disabled={disabled}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor="#e2e8f0"
        thumbTintColor={minimumTrackTintColor}
      />
    );
  }
);

// Fiziksel sabitler
const GRAVITY = 9.81;
const DAMPING = 0.999; // Air resistance
const MAX_TRAIL_LENGTH = 100;

type PendulumMode = 'simple' | 'double' | 'physical';
type PhysicalShape = 'rod' | 'disk' | 'ring';

interface TrailPoint {
  x: number;
  y: number;
}

interface PendulumState {
  // Mod
  currentMode: PendulumMode;
  isPlaying: boolean;
  showTrail: boolean;
  showGrid: boolean;

  // Basit sarkaç
  length: number;
  angle: number;
  angularVelocity: number;

  // Çift sarkaç
  length1: number;
  length2: number;
  angle1: number;
  angle2: number;
  angularVelocity1: number;
  angularVelocity2: number;
  mass1: number;
  mass2: number;

  // Fiziksel sarkaç
  physicalShape: PhysicalShape;
  physicalLength: number;
  physicalMass: number;
  physicalAngle: number;
  physicalAngularVelocity: number;

  // İzler
  trail: TrailPoint[];
  doubleTrail1: TrailPoint[];
  doubleTrail2: TrailPoint[];

  // Enerji
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;

  // Etkileşim
  isDragging: boolean;
  time: number;
}

// Memoized Grid Component
const GridLines = memo<{
  canvasWidth: number;
  canvasHeight: number;
  showGrid: boolean;
}>(({ canvasWidth, canvasHeight, showGrid }) => {
  if (!showGrid) return null;

  return (
    <>
      {Array.from({ length: Math.ceil(canvasWidth / 50) }, (_, i) => (
        <Line
          key={`v${i}`}
          x1={i * 50}
          y1={0}
          x2={i * 50}
          y2={canvasHeight}
          stroke="#f0f0f0"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: Math.ceil(canvasHeight / 50) }, (_, i) => (
        <Line
          key={`h${i}`}
          x1={0}
          y1={i * 50}
          x2={canvasWidth}
          y2={i * 50}
          stroke="#f0f0f0"
          strokeWidth={1}
        />
      ))}
    </>
  );
});

// Memoized Trail Path Component
const TrailPath = memo<{
  trail: TrailPoint[];
  color: string;
  opacity?: number;
}>(({ trail, color, opacity = 0.6 }) => {
  if (trail.length < 2) return null;

  const pathData = `M ${trail[0].x} ${trail[0].y} ${trail
    .slice(1)
    .map((p) => `L ${p.x} ${p.y}`)
    .join(' ')}`;

  return (
    <Path
      d={pathData}
      stroke={`rgba(${color}, ${opacity})`}
      strokeWidth={2}
      fill="none"
    />
  );
});

// Memoized SVG Gradients
const SVGGradients = memo(() => (
  <Defs>
    <RadialGradient id="bobGradient" cx="30%" cy="30%">
      <Stop offset="0%" stopColor="#fbbf24" />
      <Stop offset="70%" stopColor="#f59e0b" />
      <Stop offset="100%" stopColor="#d97706" />
    </RadialGradient>
    <RadialGradient id="bob1Gradient" cx="30%" cy="30%">
      <Stop offset="0%" stopColor="#22c55e" />
      <Stop offset="70%" stopColor="#16a34a" />
      <Stop offset="100%" stopColor="#15803d" />
    </RadialGradient>
    <RadialGradient id="bob2Gradient" cx="30%" cy="30%">
      <Stop offset="0%" stopColor="#f97316" />
      <Stop offset="70%" stopColor="#ea580c" />
      <Stop offset="100%" stopColor="#c2410c" />
    </RadialGradient>
    <RadialGradient id="physicalGradient" cx="30%" cy="30%">
      <Stop offset="0%" stopColor="#8b5cf6" />
      <Stop offset="70%" stopColor="#7c3aed" />
      <Stop offset="100%" stopColor="#6d28d9" />
    </RadialGradient>
  </Defs>
));

const AdvancedPendulumExperiment = memo(() => {
  const { t } = useLanguage();
  const isMountedRef = useRef(true);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<PendulumState>({
    currentMode: 'simple',
    isPlaying: false,
    showTrail: false,
    showGrid: false,

    // Basit sarkaç
    length: 1.5,
    angle: Math.PI / 6,
    angularVelocity: 0,

    // Çift sarkaç
    length1: 1.0,
    length2: 1.0,
    angle1: Math.PI / 4,
    angle2: Math.PI / 4,
    angularVelocity1: 0,
    angularVelocity2: 0,
    mass1: 1.0,
    mass2: 1.0,

    // Fiziksel sarkaç
    physicalShape: 'rod',
    physicalLength: 1.0,
    physicalMass: 1.0,
    physicalAngle: Math.PI / 6,
    physicalAngularVelocity: 0,

    // İzler
    trail: [],
    doubleTrail1: [],
    doubleTrail2: [],

    // Enerji
    kineticEnergy: 0,
    potentialEnergy: 0,
    totalEnergy: 0,

    // Etkileşim
    isDragging: false,
    time: 0,
  });

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Memoize canvas dimensions
  const canvasDimensions = useMemo(
    () => ({
      canvasWidth:
        Platform.OS === 'web' ? Math.min(width - 40, 600) : width - 32,
      canvasHeight: Platform.OS === 'web' ? 500 : Math.min(height * 0.4, 350),
      scale: Platform.OS === 'web' ? 100 : Math.min(width / 6, 60),
      originX:
        (Platform.OS === 'web' ? Math.min(width - 40, 600) : width - 32) / 2,
      originY: Platform.OS === 'web' ? 60 : 40,
    }),
    [width, height]
  );

  // Component unmount kontrolü
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Memoized debounced setState wrapper
  const debouncedSetState = useCallback((updater: any, delay: number = 0) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setState(updater);
      }
    }, delay);
  }, []);

  // Memoized safe setState wrapper
  const safeSetState = useCallback((updater: any) => {
    if (isMountedRef.current) {
      setState(updater);
    }
  }, []);

  // Memoized physics calculation functions
  const physicsCalculations = useMemo(
    () => ({
      calculateSimplePendulum: (
        angle: number,
        angularVelocity: number,
        length: number,
        dt: number
      ) => {
        const acceleration = -(GRAVITY / length) * Math.sin(angle);
        const newAngularVelocity =
          (angularVelocity + acceleration * dt) * DAMPING;
        const newAngle = angle + newAngularVelocity * dt;

        const height = length * (1 - Math.cos(angle));
        const potentialEnergy = GRAVITY * height;
        const kineticEnergy = 0.5 * Math.pow(length * angularVelocity, 2);

        return {
          angle: newAngle,
          angularVelocity: newAngularVelocity,
          potentialEnergy,
          kineticEnergy,
          totalEnergy: potentialEnergy + kineticEnergy,
        };
      },

      calculateDoublePendulum: (params: any, dt: number) => {
        const {
          length1: L1,
          length2: L2,
          mass1: m1,
          mass2: m2,
          angle1: θ1,
          angle2: θ2,
          angularVelocity1: ω1,
          angularVelocity2: ω2,
        } = params;

        const δ = θ2 - θ1;
        const cosδ = Math.cos(δ);
        const sinδ = Math.sin(δ);

        const den1 = (m1 + m2) * L1 - m2 * L1 * cosδ * cosδ;
        const den2 = (L2 / L1) * den1;

        const num1 =
          -m2 * L1 * ω1 * ω1 * sinδ * cosδ +
          m2 * GRAVITY * Math.sin(θ2) * cosδ +
          m2 * L2 * ω2 * ω2 * sinδ -
          (m1 + m2) * GRAVITY * Math.sin(θ1);
        const num2 =
          -m2 * L2 * ω2 * ω2 * sinδ * cosδ +
          (m1 + m2) * GRAVITY * Math.sin(θ1) * cosδ +
          (m1 + m2) * L1 * ω1 * ω1 * sinδ -
          (m1 + m2) * GRAVITY * Math.sin(θ2);

        const α1 = num1 / den1;
        const α2 = num2 / den2;

        return {
          angularVelocity1: (ω1 + α1 * dt) * DAMPING,
          angularVelocity2: (ω2 + α2 * dt) * DAMPING,
          angle1: θ1 + (ω1 + α1 * dt) * DAMPING * dt,
          angle2: θ2 + (ω2 + α2 * dt) * DAMPING * dt,
        };
      },

      calculatePhysicalPendulum: (
        shape: PhysicalShape,
        mass: number,
        length: number,
        angle: number,
        angularVelocity: number,
        dt: number
      ) => {
        const momentOfInertia =
          shape === 'rod'
            ? (1 / 3) * mass * Math.pow(length, 2)
            : shape === 'disk'
            ? 0.5 * mass * Math.pow(length * 0.3, 2) +
              mass * Math.pow(length * 0.7, 2)
            : mass * Math.pow(length * 0.3, 2) +
              mass * Math.pow(length * 0.7, 2);

        const centerOfMass = length * 0.5;
        const acceleration =
          -((mass * GRAVITY * centerOfMass) / momentOfInertia) *
          Math.sin(angle);

        return {
          angularVelocity: (angularVelocity + acceleration * dt) * DAMPING,
          angle: angle + (angularVelocity + acceleration * dt) * DAMPING * dt,
        };
      },
    }),
    []
  );

  // Fizik güncellemesi
  const updatePhysics = useCallback(
    (deltaTime: number) => {
      if (!state.isPlaying || state.isDragging || !isMountedRef.current) return;

      const dt = Math.min(deltaTime / 1000, 0.016);

      safeSetState((prev: PendulumState) => {
        const newState = { ...prev };
        newState.time += dt;

        if (prev.currentMode === 'simple') {
          // Basit sarkaç fiziği
          const {
            angle,
            angularVelocity,
            potentialEnergy,
            kineticEnergy,
            totalEnergy,
          } = physicsCalculations.calculateSimplePendulum(
            prev.angle,
            prev.angularVelocity,
            prev.length,
            dt
          );
          newState.angle = angle;
          newState.angularVelocity = angularVelocity;
          newState.potentialEnergy = potentialEnergy;
          newState.kineticEnergy = kineticEnergy;
          newState.totalEnergy = totalEnergy;
        } else if (prev.currentMode === 'double') {
          // Çift sarkaç fiziği (Lagrangian mekaniği)
          const { angle1, angle2, angularVelocity1, angularVelocity2 } =
            physicsCalculations.calculateDoublePendulum(prev, dt);
          newState.angle1 = angle1;
          newState.angle2 = angle2;
          newState.angularVelocity1 = angularVelocity1;
          newState.angularVelocity2 = angularVelocity2;
        } else if (prev.currentMode === 'physical') {
          // Fiziksel sarkaç fiziği
          const { angle, angularVelocity } =
            physicsCalculations.calculatePhysicalPendulum(
              prev.physicalShape,
              prev.physicalMass,
              prev.physicalLength,
              prev.physicalAngle,
              prev.physicalAngularVelocity,
              dt
            );
          newState.physicalAngle = angle;
          newState.physicalAngularVelocity = angularVelocity;
        }

        return newState;
      });
    },
    [
      state.isPlaying,
      state.isDragging,
      state.currentMode,
      safeSetState,
      physicsCalculations,
    ]
  );

  // İz ekleme - optimize edilmiş trail management
  const addTrailPoint = useCallback(
    (x: number, y: number) => {
      if (!isMountedRef.current) return;
      safeSetState((prev: PendulumState) => {
        if (prev.trail.length >= MAX_TRAIL_LENGTH) {
          return {
            ...prev,
            trail: [...prev.trail.slice(1), { x, y }],
          };
        }
        return {
          ...prev,
          trail: [...prev.trail, { x, y }],
        };
      });
    },
    [safeSetState]
  );

  const addDoubleTrailPoint = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      if (!isMountedRef.current) return;
      safeSetState((prev: PendulumState) => {
        const newTrail1 =
          prev.doubleTrail1.length >= MAX_TRAIL_LENGTH
            ? [...prev.doubleTrail1.slice(1), { x: x1, y: y1 }]
            : [...prev.doubleTrail1, { x: x1, y: y1 }];

        const newTrail2 =
          prev.doubleTrail2.length >= MAX_TRAIL_LENGTH
            ? [...prev.doubleTrail2.slice(1), { x: x2, y: y2 }]
            : [...prev.doubleTrail2, { x: x2, y: y2 }];

        return {
          ...prev,
          doubleTrail1: newTrail1,
          doubleTrail2: newTrail2,
        };
      });
    },
    [safeSetState]
  );

  // Animasyon döngüsü - optimize edilmiş
  const animate = useCallback(
    (currentTime: number) => {
      if (!isMountedRef.current) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (deltaTime > 0) {
        updatePhysics(deltaTime);

        // İz ekleme - throttled
        if (state.isPlaying && state.showTrail && Math.random() < 0.5) {
          if (state.currentMode === 'simple') {
            const x =
              canvasDimensions.originX +
              state.length * canvasDimensions.scale * Math.sin(state.angle);
            const y =
              canvasDimensions.originY +
              state.length * canvasDimensions.scale * Math.cos(state.angle);
            addTrailPoint(x, y);
          } else if (state.currentMode === 'double') {
            const x1 =
              canvasDimensions.originX +
              state.length1 * canvasDimensions.scale * Math.sin(state.angle1);
            const y1 =
              canvasDimensions.originY +
              state.length1 * canvasDimensions.scale * Math.cos(state.angle1);
            const x2 =
              x1 +
              state.length2 * canvasDimensions.scale * Math.sin(state.angle2);
            const y2 =
              y1 +
              state.length2 * canvasDimensions.scale * Math.cos(state.angle2);
            addDoubleTrailPoint(x1, y1, x2, y2);
          } else if (state.currentMode === 'physical') {
            const centerOfMass = state.physicalLength * 0.5;
            const x =
              canvasDimensions.originX +
              centerOfMass *
                canvasDimensions.scale *
                Math.sin(state.physicalAngle);
            const y =
              canvasDimensions.originY +
              centerOfMass *
                canvasDimensions.scale *
                Math.cos(state.physicalAngle);
            addTrailPoint(x, y);
          }
        }
      }

      if (isMountedRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    },
    [
      updatePhysics,
      state.isPlaying,
      state.showTrail,
      state.currentMode,
      state.angle,
      state.length,
      state.angle1,
      state.angle2,
      state.length1,
      state.length2,
      state.physicalAngle,
      state.physicalLength,
      addTrailPoint,
      addDoubleTrailPoint,
      canvasDimensions,
    ]
  );

  useEffect(() => {
    if (isMountedRef.current) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [animate]);

  // Memoized kontrol fonksiyonları
  const toggleSimulation = useCallback(() => {
    if (isMountedRef.current) {
      safeSetState((prev: PendulumState) => ({
        ...prev,
        isPlaying: !prev.isPlaying,
      }));
    }
  }, [safeSetState]);

  const resetSimulation = useCallback(() => {
    if (isMountedRef.current) {
      safeSetState((prev: PendulumState) => ({
        ...prev,
        isPlaying: false,
        angle: Math.PI / 6,
        angularVelocity: 0,
        angle1: Math.PI / 4,
        angle2: Math.PI / 4,
        angularVelocity1: 0,
        angularVelocity2: 0,
        physicalAngle: Math.PI / 6,
        physicalAngularVelocity: 0,
        trail: [],
        doubleTrail1: [],
        doubleTrail2: [],
        time: 0,
        kineticEnergy: 0,
        potentialEnergy: 0,
        totalEnergy: 0,
      }));
    }
  }, [safeSetState]);

  const changeMode = useCallback(
    (mode: PendulumMode) => {
      if (isMountedRef.current) {
        safeSetState((prev: PendulumState) => ({
          ...prev,
          currentMode: mode,
          isPlaying: false,
          trail: [],
          doubleTrail1: [],
          doubleTrail2: [],
          time: 0,
        }));
      }
    },
    [safeSetState]
  );

  // Güvenli slider değer değiştirme fonksiyonları (debounced) - optimized
  const handleLengthChange = useCallback(
    (value: number) => {
      if (isMountedRef.current && !state.isPlaying) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, length: value }),
          10
        );
      }
    },
    [debouncedSetState, state.isPlaying]
  );

  const handleAngleChange = useCallback(
    (value: number) => {
      if (isMountedRef.current && !state.isPlaying) {
        debouncedSetState(
          (prev: PendulumState) => ({
            ...prev,
            angle: (value * Math.PI) / 180,
          }),
          10
        );
      }
    },
    [debouncedSetState, state.isPlaying]
  );

  const handleLength1Change = useCallback(
    (value: number) => {
      if (isMountedRef.current && !state.isPlaying) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, length1: value }),
          10
        );
      }
    },
    [debouncedSetState, state.isPlaying]
  );

  const handleLength2Change = useCallback(
    (value: number) => {
      if (isMountedRef.current && !state.isPlaying) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, length2: value }),
          10
        );
      }
    },
    [debouncedSetState, state.isPlaying]
  );

  const handleMass1Change = useCallback(
    (value: number) => {
      if (isMountedRef.current && !state.isPlaying) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, mass1: value }),
          10
        );
      }
    },
    [debouncedSetState, state.isPlaying]
  );

  const handleMass2Change = useCallback(
    (value: number) => {
      if (isMountedRef.current && !state.isPlaying) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, mass2: value }),
          10
        );
      }
    },
    [debouncedSetState, state.isPlaying]
  );

  const handlePhysicalMassChange = useCallback(
    (value: number) => {
      if (isMountedRef.current && !state.isPlaying) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, physicalMass: value }),
          10
        );
      }
    },
    [debouncedSetState, state.isPlaying]
  );

  const handlePhysicalLengthChange = useCallback(
    (value: number) => {
      if (isMountedRef.current && !state.isPlaying) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, physicalLength: value }),
          10
        );
      }
    },
    [debouncedSetState, state.isPlaying]
  );

  // Memoized shape handler
  const handleShapeChange = useCallback(
    (shape: PhysicalShape) => {
      if (isMountedRef.current) {
        safeSetState((prev: PendulumState) => ({
          ...prev,
          physicalShape: shape,
        }));
      }
    },
    [safeSetState]
  );

  // Memoized toggle handlers
  const toggleTrail = useCallback(() => {
    if (isMountedRef.current) {
      safeSetState((prev: PendulumState) => ({
        ...prev,
        showTrail: !prev.showTrail,
      }));
    }
  }, [safeSetState]);

  const toggleGrid = useCallback(() => {
    if (isMountedRef.current) {
      safeSetState((prev: PendulumState) => ({
        ...prev,
        showGrid: !prev.showGrid,
      }));
    }
  }, [safeSetState]);

  // Memoized mode buttons
  const modeButtons = useMemo(
    () =>
      (['simple', 'double', 'physical'] as PendulumMode[]).map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.modeButton,
            state.currentMode === mode && styles.modeButtonActive,
          ]}
          onPress={() => changeMode(mode)}
        >
          <Text
            style={[
              styles.modeButtonText,
              state.currentMode === mode && styles.modeButtonTextActive,
            ]}
          >
            {mode === 'simple'
              ? t('Basit', 'Simple')
              : mode === 'double'
              ? t('Çift', 'Double')
              : t('Fiziksel', 'Physical')}
          </Text>
        </TouchableOpacity>
      )),
    [state.currentMode, changeMode, t]
  );

  // Memoized shape buttons
  const shapeButtons = useMemo(
    () =>
      (['rod', 'disk', 'ring'] as PhysicalShape[]).map((shape) => (
        <TouchableOpacity
          key={shape}
          style={[
            styles.shapeButton,
            state.physicalShape === shape && styles.shapeButtonActive,
          ]}
          onPress={() => handleShapeChange(shape)}
        >
          <Text
            style={[
              styles.shapeButtonText,
              state.physicalShape === shape && styles.shapeButtonTextActive,
            ]}
          >
            {shape === 'rod'
              ? t('Çubuk', 'Rod')
              : shape === 'disk'
              ? t('Disk', 'Disk')
              : t('Halka', 'Ring')}
          </Text>
        </TouchableOpacity>
      )),
    [state.physicalShape, handleShapeChange, t]
  );

  // Render fonksiyonları
  const renderModeSelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        {t('Sarkaç Türü', 'Pendulum Type')}
      </Text>
      <View style={styles.modeButtons}>{modeButtons}</View>
    </View>
  );

  const renderParameters = () => {
    if (state.currentMode === 'simple') {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('Parametreler', 'Parameters')}
          </Text>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('İp Uzunluğu', 'Length')}: {state.length.toFixed(2)} m
            </Text>
            <WebSlider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.5}
              value={state.length}
              onValueChange={handleLengthChange}
              minimumTrackTintColor="#3498db"
              disabled={state.isPlaying}
            />
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('Başlangıç Açısı', 'Initial Angle')}:{' '}
              {((state.angle * 180) / Math.PI).toFixed(1)}°
            </Text>
            <WebSlider
              style={styles.slider}
              minimumValue={-45}
              maximumValue={45}
              value={(state.angle * 180) / Math.PI}
              onValueChange={handleAngleChange}
              minimumTrackTintColor="#3498db"
              disabled={state.isPlaying}
            />
          </View>
        </View>
      );
    } else if (state.currentMode === 'double') {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('Parametreler', 'Parameters')}
          </Text>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('İp 1 Uzunluğu', 'Length 1')}: {state.length1.toFixed(2)} m
            </Text>
            <WebSlider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              value={state.length1}
              onValueChange={handleLength1Change}
              minimumTrackTintColor="#22c55e"
              disabled={state.isPlaying}
            />
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('İp 2 Uzunluğu', 'Length 2')}: {state.length2.toFixed(2)} m
            </Text>
            <WebSlider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              value={state.length2}
              onValueChange={handleLength2Change}
              minimumTrackTintColor="#f97316"
              disabled={state.isPlaying}
            />
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('Kütle 1', 'Mass 1')}: {state.mass1.toFixed(1)} kg
            </Text>
            <WebSlider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={3.0}
              value={state.mass1}
              onValueChange={handleMass1Change}
              minimumTrackTintColor="#22c55e"
              disabled={state.isPlaying}
            />
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('Kütle 2', 'Mass 2')}: {state.mass2.toFixed(1)} kg
            </Text>
            <WebSlider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={3.0}
              value={state.mass2}
              onValueChange={handleMass2Change}
              minimumTrackTintColor="#f97316"
              disabled={state.isPlaying}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('Parametreler', 'Parameters')}
          </Text>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>{t('Şekil', 'Shape')}</Text>
            <View style={styles.shapeButtons}>{shapeButtons}</View>
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('Kütle', 'Mass')}: {state.physicalMass.toFixed(1)} kg
            </Text>
            <WebSlider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={5.0}
              value={state.physicalMass}
              onValueChange={handlePhysicalMassChange}
              minimumTrackTintColor="#8b5cf6"
              disabled={state.isPlaying}
            />
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('Uzunluk', 'Length')}: {state.physicalLength.toFixed(2)} m
            </Text>
            <WebSlider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              value={state.physicalLength}
              onValueChange={handlePhysicalLengthChange}
              minimumTrackTintColor="#8b5cf6"
              disabled={state.isPlaying}
            />
          </View>
        </View>
      );
    }
  };

  const renderVisualControls = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        {t('Görsel Seçenekler', 'Visual Options')}
      </Text>
      <View style={styles.visualControls}>
        <TouchableOpacity
          style={[
            styles.visualButton,
            state.showTrail && styles.visualButtonActive,
          ]}
          onPress={toggleTrail}
        >
          <Text
            style={[
              styles.visualButtonText,
              state.showTrail && styles.visualButtonTextActive,
            ]}
          >
            {t('Hareket İzi', 'Trail')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.visualButton,
            state.showGrid && styles.visualButtonActive,
          ]}
          onPress={toggleGrid}
        >
          <Text
            style={[
              styles.visualButtonText,
              state.showGrid && styles.visualButtonTextActive,
            ]}
          >
            {t('Koordinat Ağı', 'Grid')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSimulation = () => {
    if (state.currentMode === 'simple') {
      return renderSimplePendulum();
    } else if (state.currentMode === 'double') {
      return renderDoublePendulum();
    } else {
      return renderPhysicalPendulum();
    }
  };

  const renderSimplePendulum = () => {
    const bobX =
      canvasDimensions.originX +
      state.length * canvasDimensions.scale * Math.sin(state.angle);
    const bobY =
      canvasDimensions.originY +
      state.length * canvasDimensions.scale * Math.cos(state.angle);

    return (
      <Svg
        width={canvasDimensions.canvasWidth}
        height={canvasDimensions.canvasHeight}
        style={styles.svg}
      >
        <SVGGradients />

        {/* Grid */}
        <GridLines
          canvasWidth={canvasDimensions.canvasWidth}
          canvasHeight={canvasDimensions.canvasHeight}
          showGrid={state.showGrid}
        />

        {/* Trail */}
        {state.showTrail && (
          <TrailPath trail={state.trail} color="59, 130, 246" />
        )}

        {/* Pivot */}
        <Circle
          cx={canvasDimensions.originX}
          cy={canvasDimensions.originY}
          r={6}
          fill="#64748b"
        />

        {/* String */}
        <Line
          x1={canvasDimensions.originX}
          y1={canvasDimensions.originY}
          x2={bobX}
          y2={bobY}
          stroke="#374151"
          strokeWidth={2}
        />

        {/* Bob shadow */}
        <Circle cx={bobX + 2} cy={bobY + 2} r={16} fill="rgba(0, 0, 0, 0.1)" />

        {/* Bob */}
        <Circle
          cx={bobX}
          cy={bobY}
          r={16}
          fill="url(#bobGradient)"
          stroke="#92400e"
          strokeWidth={2}
        />
      </Svg>
    );
  };

  const renderDoublePendulum = () => {
    const x1 =
      canvasDimensions.originX +
      state.length1 * canvasDimensions.scale * Math.sin(state.angle1);
    const y1 =
      canvasDimensions.originY +
      state.length1 * canvasDimensions.scale * Math.cos(state.angle1);
    const x2 =
      x1 + state.length2 * canvasDimensions.scale * Math.sin(state.angle2);
    const y2 =
      y1 + state.length2 * canvasDimensions.scale * Math.cos(state.angle2);

    return (
      <Svg
        width={canvasDimensions.canvasWidth}
        height={canvasDimensions.canvasHeight}
        style={styles.svg}
      >
        <SVGGradients />

        {/* Grid */}
        <GridLines
          canvasWidth={canvasDimensions.canvasWidth}
          canvasHeight={canvasDimensions.canvasHeight}
          showGrid={state.showGrid}
        />

        {/* Trails */}
        {state.showTrail && (
          <>
            <TrailPath trail={state.doubleTrail1} color="34, 197, 94" />
            <TrailPath trail={state.doubleTrail2} color="249, 115, 22" />
          </>
        )}

        {/* Pivot */}
        <Circle
          cx={canvasDimensions.originX}
          cy={canvasDimensions.originY}
          r={6}
          fill="#64748b"
        />

        {/* Strings */}
        <Line
          x1={canvasDimensions.originX}
          y1={canvasDimensions.originY}
          x2={x1}
          y2={y1}
          stroke="#374151"
          strokeWidth={2}
        />
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#374151"
          strokeWidth={2}
        />

        {/* Bob shadows */}
        <Circle
          cx={x1 + 2}
          cy={y1 + 2}
          r={12 + state.mass1 * 3}
          fill="rgba(0, 0, 0, 0.1)"
        />
        <Circle
          cx={x2 + 2}
          cy={y2 + 2}
          r={12 + state.mass2 * 3}
          fill="rgba(0, 0, 0, 0.1)"
        />

        {/* Bobs */}
        <Circle
          cx={x1}
          cy={y1}
          r={12 + state.mass1 * 3}
          fill="url(#bob1Gradient)"
          stroke="#166534"
          strokeWidth={2}
        />
        <Circle
          cx={x2}
          cy={y2}
          r={12 + state.mass2 * 3}
          fill="url(#bob2Gradient)"
          stroke="#9a3412"
          strokeWidth={2}
        />
      </Svg>
    );
  };

  const renderPhysicalPendulum = () => {
    const centerOfMass = state.physicalLength * 0.5;
    const cmX =
      canvasDimensions.originX +
      centerOfMass * canvasDimensions.scale * Math.sin(state.physicalAngle);
    const cmY =
      canvasDimensions.originY +
      centerOfMass * canvasDimensions.scale * Math.cos(state.physicalAngle);
    const endX =
      canvasDimensions.originX +
      state.physicalLength *
        canvasDimensions.scale *
        Math.sin(state.physicalAngle);
    const endY =
      canvasDimensions.originY +
      state.physicalLength *
        canvasDimensions.scale *
        Math.cos(state.physicalAngle);

    return (
      <Svg
        width={canvasDimensions.canvasWidth}
        height={canvasDimensions.canvasHeight}
        style={styles.svg}
      >
        <SVGGradients />

        {/* Grid */}
        <GridLines
          canvasWidth={canvasDimensions.canvasWidth}
          canvasHeight={canvasDimensions.canvasHeight}
          showGrid={state.showGrid}
        />

        {/* Trail */}
        {state.showTrail && (
          <TrailPath trail={state.trail} color="147, 51, 234" />
        )}

        {/* Pivot */}
        <Circle
          cx={canvasDimensions.originX}
          cy={canvasDimensions.originY}
          r={6}
          fill="#64748b"
        />

        {/* Physical object */}
        {state.physicalShape === 'rod' && (
          <>
            <Line
              x1={canvasDimensions.originX}
              y1={canvasDimensions.originY}
              x2={endX}
              y2={endY}
              stroke="#8b5cf6"
              strokeWidth={8}
            />
            {/* Center of mass marker */}
            <Circle cx={cmX} cy={cmY} r={5} fill="#fbbf24" />
          </>
        )}

        {state.physicalShape === 'disk' && (
          <>
            <Line
              x1={canvasDimensions.originX}
              y1={canvasDimensions.originY}
              x2={endX * 0.7 + canvasDimensions.originX * 0.3}
              y2={endY * 0.7 + canvasDimensions.originY * 0.3}
              stroke="#8b5cf6"
              strokeWidth={4}
            />
            <Circle
              cx={endX * 0.7 + canvasDimensions.originX * 0.3}
              cy={endY * 0.7 + canvasDimensions.originY * 0.3}
              r={state.physicalLength * canvasDimensions.scale * 0.25}
              fill="url(#physicalGradient)"
              stroke="#7c3aed"
              strokeWidth={2}
            />
          </>
        )}

        {state.physicalShape === 'ring' && (
          <>
            <Line
              x1={canvasDimensions.originX}
              y1={canvasDimensions.originY}
              x2={endX * 0.7 + canvasDimensions.originX * 0.3}
              y2={endY * 0.7 + canvasDimensions.originY * 0.3}
              stroke="#8b5cf6"
              strokeWidth={4}
            />
            <Circle
              cx={endX * 0.7 + canvasDimensions.originX * 0.3}
              cy={endY * 0.7 + canvasDimensions.originY * 0.3}
              r={state.physicalLength * canvasDimensions.scale * 0.25}
              fill="none"
              stroke="#ec4899"
              strokeWidth={6}
            />
          </>
        )}
      </Svg>
    );
  };

  // Memoized metrics renderer
  const renderMetrics = useMemo(() => {
    const getModeSpecificMetrics = () => {
      if (state.currentMode === 'simple') {
        const period = 2 * Math.PI * Math.sqrt(state.length / GRAVITY);
        const frequency = 1 / period;
        return [
          { label: t('Periyot', 'Period'), value: `${period.toFixed(3)} s` },
          {
            label: t('Frekans', 'Frequency'),
            value: `${frequency.toFixed(3)} Hz`,
          },
          {
            label: t('Açı', 'Angle'),
            value: `${((state.angle * 180) / Math.PI).toFixed(1)}°`,
          },
        ];
      } else if (state.currentMode === 'double') {
        return [
          {
            label: t('Açı 1', 'Angle 1'),
            value: `${((state.angle1 * 180) / Math.PI).toFixed(1)}°`,
          },
          {
            label: t('Açı 2', 'Angle 2'),
            value: `${((state.angle2 * 180) / Math.PI).toFixed(1)}°`,
          },
          {
            label: t('Toplam Kütle', 'Total Mass'),
            value: `${(state.mass1 + state.mass2).toFixed(1)} kg`,
          },
        ];
      } else {
        const momentOfInertia =
          state.physicalShape === 'rod'
            ? (1 / 3) * state.physicalMass * Math.pow(state.physicalLength, 2)
            : state.physicalShape === 'disk'
            ? 0.5 *
                state.physicalMass *
                Math.pow(state.physicalLength * 0.3, 2) +
              state.physicalMass * Math.pow(state.physicalLength * 0.7, 2)
            : state.physicalMass * Math.pow(state.physicalLength * 0.3, 2) +
              state.physicalMass * Math.pow(state.physicalLength * 0.7, 2);

        return [
          {
            label: t('Atalet Momenti', 'Moment of Inertia'),
            value: `${momentOfInertia.toFixed(3)} kg⋅m²`,
          },
          {
            label: t('Açı', 'Angle'),
            value: `${((state.physicalAngle * 180) / Math.PI).toFixed(1)}°`,
          },
          {
            label: t('Şekil', 'Shape'),
            value:
              state.physicalShape === 'rod'
                ? t('Çubuk', 'Rod')
                : state.physicalShape === 'disk'
                ? t('Disk', 'Disk')
                : t('Halka', 'Ring'),
          },
        ];
      }
    };

    const modeMetrics = getModeSpecificMetrics();

    return (
      <View
        style={[styles.metrics, Platform.OS !== 'web' && styles.metricsMobile]}
      >
        <Text style={styles.metricsTitle}>{t('Ölçümler', 'Measurements')}</Text>
        {modeMetrics.map((metric, index) => (
          <View key={index} style={styles.metricRow}>
            <Text style={styles.metricLabel}>{metric.label}:</Text>
            <Text style={styles.metricValue}>{metric.value}</Text>
          </View>
        ))}
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>{t('Zaman', 'Time')}:</Text>
          <Text style={styles.metricValue}>{state.time.toFixed(2)} s</Text>
        </View>
      </View>
    );
  }, [
    state.currentMode,
    state.length,
    state.angle,
    state.angle1,
    state.angle2,
    state.mass1,
    state.mass2,
    state.physicalShape,
    state.physicalMass,
    state.physicalLength,
    state.physicalAngle,
    state.time,
    t,
  ]);

  const description = useMemo(
    () =>
      t(
        `Gelişmiş sarkaç deneyi ile üç farklı sarkaç türünü inceleyebilirsiniz:

      1. Basit Sarkaç: Klasik sarkaç hareketi ve harmonik salınım
      2. Çift Sarkaç: Kaotik davranış gösteren karmaşık sistem
      3. Fiziksel Sarkaç: Farklı şekillerde atalet momentinin etkisi

      Her modda parametreleri değiştirerek farklı fiziksel davranışları gözlemleyebilir, hareket izlerini görüntüleyebilir ve enerji değişimlerini takip edebilirsiniz.`,

        `Advanced pendulum experiment allows you to study three different types of pendulums:

      1. Simple Pendulum: Classic pendulum motion and harmonic oscillation
      2. Double Pendulum: Complex system exhibiting chaotic behavior  
      3. Physical Pendulum: Effect of moment of inertia in different shapes

      In each mode, you can observe different physical behaviors by changing parameters, view motion trails, and track energy changes.`
      ),
    [t]
  );

  return (
    <ExperimentLayout
      title="Gelişmiş Sarkaç Deneyi"
      titleEn="Advanced Pendulum Experiment"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description={description}
      descriptionEn={description}
      isRunning={state.isPlaying}
      onToggleSimulation={toggleSimulation}
      onReset={resetSimulation}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderModeSelector()}
        {renderParameters()}
        {renderVisualControls()}

        <View style={styles.simulationContainer}>
          <View style={styles.canvasWrapper}>{renderSimulation()}</View>
          {Platform.OS !== 'web' && renderMetrics}
        </View>

        {Platform.OS === 'web' && (
          <View style={styles.webMetricsContainer}>{renderMetrics}</View>
        )}
      </ScrollView>
    </ExperimentLayout>
  );
});

export default AdvancedPendulumExperiment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'web' ? 20 : 100,
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  modeButtonText: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
    textAlign: 'center',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  parameterRow: {
    marginBottom: 20,
  },
  parameterLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  shapeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 4,
  },
  shapeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  shapeButtonActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#7c3aed',
  },
  shapeButtonText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  shapeButtonTextActive: {
    color: '#ffffff',
  },
  visualControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  visualButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  visualButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  visualButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    textAlign: 'center',
  },
  visualButtonTextActive: {
    color: '#ffffff',
  },
  simulationContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  canvasWrapper: {
    position: 'relative',
  },
  svg: {
    backgroundColor: '#ffffff',
  },
  metrics: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsMobile: {
    margin: 16,
    position: 'relative',
  },
  webMetricsContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 8,
    flex: 1,
  },
  metricValue: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
