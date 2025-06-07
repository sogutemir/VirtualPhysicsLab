import React, { useState, useEffect, useRef, useCallback } from 'react';
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

// Web için custom slider bileşeni
const WebSlider = ({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  style,
  minimumTrackTintColor,
}: any) => {
  if (Platform.OS === 'web') {
    return (
      <div style={{ width: '100%', padding: '8px 0' }}>
        <input
          type="range"
          min={minimumValue}
          max={maximumValue}
          step="0.01"
          value={value}
          onChange={(e) => onValueChange(parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: '#e2e8f0',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${minimumTrackTintColor || '#3498db'};
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${minimumTrackTintColor || '#3498db'};
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `}</style>
      </div>
    );
  }

  return (
    <CustomSlider
      style={style}
      min={minimumValue}
      max={maximumValue}
      value={value}
      onValueChange={onValueChange}
      minimumTrackTintColor={minimumTrackTintColor}
      maximumTrackTintColor="#e2e8f0"
      thumbTintColor={minimumTrackTintColor}
    />
  );
};

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

export default function AdvancedPendulumExperiment() {
  const { t } = useLanguage();
  const isMountedRef = useRef(true);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Canvas boyutları
  const canvasWidth =
    Platform.OS === 'web' ? Math.min(width - 40, 600) : width - 32;
  const canvasHeight =
    Platform.OS === 'web' ? 500 : Math.min(height * 0.4, 350);
  const scale = Platform.OS === 'web' ? 100 : Math.min(width / 6, 60);
  const originX = canvasWidth / 2;
  const originY = Platform.OS === 'web' ? 60 : 40;

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

  // Debounced setState wrapper
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

  // Güvenli setState wrapper
  const safeSetState = useCallback((updater: any) => {
    if (isMountedRef.current) {
      setState(updater);
    }
  }, []);

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
          const acceleration = -(GRAVITY / prev.length) * Math.sin(prev.angle);
          newState.angularVelocity =
            (prev.angularVelocity + acceleration * dt) * DAMPING;
          newState.angle = prev.angle + newState.angularVelocity * dt;

          // Enerji hesaplama
          const height = prev.length * (1 - Math.cos(prev.angle));
          newState.potentialEnergy = GRAVITY * height;
          newState.kineticEnergy =
            0.5 * Math.pow(prev.length * prev.angularVelocity, 2);
          newState.totalEnergy =
            newState.kineticEnergy + newState.potentialEnergy;
        } else if (prev.currentMode === 'double') {
          // Çift sarkaç fiziği (Lagrangian mekaniği)
          const { length1: L1, length2: L2, mass1: m1, mass2: m2 } = prev;
          const {
            angle1: θ1,
            angle2: θ2,
            angularVelocity1: ω1,
            angularVelocity2: ω2,
          } = prev;

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

          newState.angularVelocity1 = (ω1 + α1 * dt) * DAMPING;
          newState.angularVelocity2 = (ω2 + α2 * dt) * DAMPING;
          newState.angle1 = θ1 + newState.angularVelocity1 * dt;
          newState.angle2 = θ2 + newState.angularVelocity2 * dt;
        } else if (prev.currentMode === 'physical') {
          // Fiziksel sarkaç fiziği
          const momentOfInertia =
            prev.physicalShape === 'rod'
              ? (1 / 3) * prev.physicalMass * Math.pow(prev.physicalLength, 2)
              : prev.physicalShape === 'disk'
              ? 0.5 *
                  prev.physicalMass *
                  Math.pow(prev.physicalLength * 0.3, 2) +
                prev.physicalMass * Math.pow(prev.physicalLength * 0.7, 2)
              : prev.physicalMass * Math.pow(prev.physicalLength * 0.3, 2) +
                prev.physicalMass * Math.pow(prev.physicalLength * 0.7, 2);

          const centerOfMass = prev.physicalLength * 0.5;
          const acceleration =
            -((prev.physicalMass * GRAVITY * centerOfMass) / momentOfInertia) *
            Math.sin(prev.physicalAngle);

          newState.physicalAngularVelocity =
            (prev.physicalAngularVelocity + acceleration * dt) * DAMPING;
          newState.physicalAngle =
            prev.physicalAngle + newState.physicalAngularVelocity * dt;
        }

        return newState;
      });
    },
    [state.isPlaying, state.isDragging, state.currentMode, safeSetState]
  );

  // İz ekleme
  const addTrailPoint = useCallback(
    (x: number, y: number) => {
      if (!isMountedRef.current) return;
      safeSetState((prev: PendulumState) => {
        const newTrail = [...prev.trail, { x, y }];
        if (newTrail.length > MAX_TRAIL_LENGTH) {
          newTrail.shift();
        }
        return { ...prev, trail: newTrail };
      });
    },
    [safeSetState]
  );

  const addDoubleTrailPoint = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      if (!isMountedRef.current) return;
      safeSetState((prev: PendulumState) => {
        const newTrail1 = [...prev.doubleTrail1, { x: x1, y: y1 }];
        const newTrail2 = [...prev.doubleTrail2, { x: x2, y: y2 }];

        if (newTrail1.length > MAX_TRAIL_LENGTH) newTrail1.shift();
        if (newTrail2.length > MAX_TRAIL_LENGTH) newTrail2.shift();

        return {
          ...prev,
          doubleTrail1: newTrail1,
          doubleTrail2: newTrail2,
        };
      });
    },
    [safeSetState]
  );

  // Animasyon döngüsü
  const animate = useCallback(
    (currentTime: number) => {
      if (!isMountedRef.current) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (deltaTime > 0) {
        updatePhysics(deltaTime);

        // İz ekleme
        if (state.isPlaying && state.showTrail) {
          if (state.currentMode === 'simple') {
            const x = originX + state.length * scale * Math.sin(state.angle);
            const y = originY + state.length * scale * Math.cos(state.angle);
            addTrailPoint(x, y);
          } else if (state.currentMode === 'double') {
            const x1 = originX + state.length1 * scale * Math.sin(state.angle1);
            const y1 = originY + state.length1 * scale * Math.cos(state.angle1);
            const x2 = x1 + state.length2 * scale * Math.sin(state.angle2);
            const y2 = y1 + state.length2 * scale * Math.cos(state.angle2);
            addDoubleTrailPoint(x1, y1, x2, y2);
          } else if (state.currentMode === 'physical') {
            const centerOfMass = state.physicalLength * 0.5;
            const x =
              originX + centerOfMass * scale * Math.sin(state.physicalAngle);
            const y =
              originY + centerOfMass * scale * Math.cos(state.physicalAngle);
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
      }
    };
  }, [animate]);

  // Kontrol fonksiyonları
  const toggleSimulation = () => {
    if (isMountedRef.current) {
      safeSetState((prev: PendulumState) => ({
        ...prev,
        isPlaying: !prev.isPlaying,
      }));
    }
  };

  const resetSimulation = () => {
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
  };

  const changeMode = (mode: PendulumMode) => {
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
  };

  // Güvenli slider değer değiştirme fonksiyonları (debounced)
  const handleLengthChange = useCallback(
    (value: number) => {
      if (isMountedRef.current) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, length: value }),
          10
        );
      }
    },
    [debouncedSetState]
  );

  const handleAngleChange = useCallback(
    (value: number) => {
      if (isMountedRef.current) {
        debouncedSetState(
          (prev: PendulumState) => ({
            ...prev,
            angle: (value * Math.PI) / 180,
          }),
          10
        );
      }
    },
    [debouncedSetState]
  );

  const handleLength1Change = useCallback(
    (value: number) => {
      if (isMountedRef.current) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, length1: value }),
          10
        );
      }
    },
    [debouncedSetState]
  );

  const handleLength2Change = useCallback(
    (value: number) => {
      if (isMountedRef.current) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, length2: value }),
          10
        );
      }
    },
    [debouncedSetState]
  );

  const handleMass1Change = useCallback(
    (value: number) => {
      if (isMountedRef.current) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, mass1: value }),
          10
        );
      }
    },
    [debouncedSetState]
  );

  const handleMass2Change = useCallback(
    (value: number) => {
      if (isMountedRef.current) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, mass2: value }),
          10
        );
      }
    },
    [debouncedSetState]
  );

  const handlePhysicalMassChange = useCallback(
    (value: number) => {
      if (isMountedRef.current) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, physicalMass: value }),
          10
        );
      }
    },
    [debouncedSetState]
  );

  const handlePhysicalLengthChange = useCallback(
    (value: number) => {
      if (isMountedRef.current) {
        debouncedSetState(
          (prev: PendulumState) => ({ ...prev, physicalLength: value }),
          10
        );
      }
    },
    [debouncedSetState]
  );

  // Render fonksiyonları
  const renderModeSelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        {t('Sarkaç Türü', 'Pendulum Type')}
      </Text>
      <View style={styles.modeButtons}>
        {(['simple', 'double', 'physical'] as PendulumMode[]).map((mode) => (
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
        ))}
      </View>
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
              min={0.5}
              max={2.5}
              value={state.length}
              onValueChange={handleLengthChange}
              minimumTrackTintColor="#3498db"
            />
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('Başlangıç Açısı', 'Initial Angle')}:{' '}
              {((state.angle * 180) / Math.PI).toFixed(1)}°
            </Text>
            <WebSlider
              style={styles.slider}
              min={-45}
              max={45}
              value={(state.angle * 180) / Math.PI}
              onValueChange={handleAngleChange}
              minimumTrackTintColor="#3498db"
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
              min={0.5}
              max={2.0}
              value={state.length1}
              onValueChange={handleLength1Change}
              minimumTrackTintColor="#22c55e"
            />
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('İp 2 Uzunluğu', 'Length 2')}: {state.length2.toFixed(2)} m
            </Text>
            <WebSlider
              style={styles.slider}
              min={0.5}
              max={2.0}
              value={state.length2}
              onValueChange={handleLength2Change}
              minimumTrackTintColor="#f97316"
            />
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('Kütle 1', 'Mass 1')}: {state.mass1.toFixed(1)} kg
            </Text>
            <WebSlider
              style={styles.slider}
              min={0.5}
              max={3.0}
              value={state.mass1}
              onValueChange={handleMass1Change}
              minimumTrackTintColor="#22c55e"
            />
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('Kütle 2', 'Mass 2')}: {state.mass2.toFixed(1)} kg
            </Text>
            <WebSlider
              style={styles.slider}
              min={0.5}
              max={3.0}
              value={state.mass2}
              onValueChange={handleMass2Change}
              minimumTrackTintColor="#f97316"
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
            <View style={styles.shapeButtons}>
              {(['rod', 'disk', 'ring'] as PhysicalShape[]).map((shape) => (
                <TouchableOpacity
                  key={shape}
                  style={[
                    styles.shapeButton,
                    state.physicalShape === shape && styles.shapeButtonActive,
                  ]}
                  onPress={() => {
                    if (isMountedRef.current) {
                      safeSetState((prev: PendulumState) => ({
                        ...prev,
                        physicalShape: shape,
                      }));
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.shapeButtonText,
                      state.physicalShape === shape &&
                        styles.shapeButtonTextActive,
                    ]}
                  >
                    {shape === 'rod'
                      ? t('Çubuk', 'Rod')
                      : shape === 'disk'
                      ? t('Disk', 'Disk')
                      : t('Halka', 'Ring')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('Kütle', 'Mass')}: {state.physicalMass.toFixed(1)} kg
            </Text>
            <WebSlider
              style={styles.slider}
              min={0.5}
              max={5.0}
              value={state.physicalMass}
              onValueChange={handlePhysicalMassChange}
              minimumTrackTintColor="#8b5cf6"
            />
          </View>

          <View style={styles.parameterRow}>
            <Text style={styles.parameterLabel}>
              {t('Uzunluk', 'Length')}: {state.physicalLength.toFixed(2)} m
            </Text>
            <WebSlider
              style={styles.slider}
              min={0.5}
              max={2.0}
              value={state.physicalLength}
              onValueChange={handlePhysicalLengthChange}
              minimumTrackTintColor="#8b5cf6"
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
          onPress={() => {
            if (isMountedRef.current) {
              safeSetState((prev: PendulumState) => ({
                ...prev,
                showTrail: !prev.showTrail,
              }));
            }
          }}
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
          onPress={() => {
            if (isMountedRef.current) {
              safeSetState((prev: PendulumState) => ({
                ...prev,
                showGrid: !prev.showGrid,
              }));
            }
          }}
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
    const bobX = originX + state.length * scale * Math.sin(state.angle);
    const bobY = originY + state.length * scale * Math.cos(state.angle);

    return (
      <Svg width={canvasWidth} height={canvasHeight} style={styles.svg}>
        <Defs>
          <RadialGradient id="bobGradient" cx="30%" cy="30%">
            <Stop offset="0%" stopColor="#fbbf24" />
            <Stop offset="70%" stopColor="#f59e0b" />
            <Stop offset="100%" stopColor="#d97706" />
          </RadialGradient>
        </Defs>

        {/* Grid */}
        {state.showGrid && (
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
        )}

        {/* Trail */}
        {state.showTrail && state.trail.length > 1 && (
          <Path
            d={`M ${state.trail[0].x} ${state.trail[0].y} ${state.trail
              .slice(1)
              .map((p) => `L ${p.x} ${p.y}`)
              .join(' ')}`}
            stroke="rgba(59, 130, 246, 0.6)"
            strokeWidth={2}
            fill="none"
          />
        )}

        {/* Pivot */}
        <Circle cx={originX} cy={originY} r={6} fill="#64748b" />

        {/* String */}
        <Line
          x1={originX}
          y1={originY}
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
    const x1 = originX + state.length1 * scale * Math.sin(state.angle1);
    const y1 = originY + state.length1 * scale * Math.cos(state.angle1);
    const x2 = x1 + state.length2 * scale * Math.sin(state.angle2);
    const y2 = y1 + state.length2 * scale * Math.cos(state.angle2);

    return (
      <Svg width={canvasWidth} height={canvasHeight} style={styles.svg}>
        <Defs>
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
        </Defs>

        {/* Grid */}
        {state.showGrid && (
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
        )}

        {/* Trails */}
        {state.showTrail && state.doubleTrail1.length > 1 && (
          <Path
            d={`M ${state.doubleTrail1[0].x} ${
              state.doubleTrail1[0].y
            } ${state.doubleTrail1
              .slice(1)
              .map((p) => `L ${p.x} ${p.y}`)
              .join(' ')}`}
            stroke="rgba(34, 197, 94, 0.6)"
            strokeWidth={2}
            fill="none"
          />
        )}
        {state.showTrail && state.doubleTrail2.length > 1 && (
          <Path
            d={`M ${state.doubleTrail2[0].x} ${
              state.doubleTrail2[0].y
            } ${state.doubleTrail2
              .slice(1)
              .map((p) => `L ${p.x} ${p.y}`)
              .join(' ')}`}
            stroke="rgba(249, 115, 22, 0.6)"
            strokeWidth={2}
            fill="none"
          />
        )}

        {/* Pivot */}
        <Circle cx={originX} cy={originY} r={6} fill="#64748b" />

        {/* Strings */}
        <Line
          x1={originX}
          y1={originY}
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
    const cmX = originX + centerOfMass * scale * Math.sin(state.physicalAngle);
    const cmY = originY + centerOfMass * scale * Math.cos(state.physicalAngle);
    const endX =
      originX + state.physicalLength * scale * Math.sin(state.physicalAngle);
    const endY =
      originY + state.physicalLength * scale * Math.cos(state.physicalAngle);

    return (
      <Svg width={canvasWidth} height={canvasHeight} style={styles.svg}>
        <Defs>
          <RadialGradient id="physicalGradient" cx="30%" cy="30%">
            <Stop offset="0%" stopColor="#8b5cf6" />
            <Stop offset="70%" stopColor="#7c3aed" />
            <Stop offset="100%" stopColor="#6d28d9" />
          </RadialGradient>
        </Defs>

        {/* Grid */}
        {state.showGrid && (
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
        )}

        {/* Trail */}
        {state.showTrail && state.trail.length > 1 && (
          <Path
            d={`M ${state.trail[0].x} ${state.trail[0].y} ${state.trail
              .slice(1)
              .map((p) => `L ${p.x} ${p.y}`)
              .join(' ')}`}
            stroke="rgba(147, 51, 234, 0.6)"
            strokeWidth={2}
            fill="none"
          />
        )}

        {/* Pivot */}
        <Circle cx={originX} cy={originY} r={6} fill="#64748b" />

        {/* Physical object */}
        {state.physicalShape === 'rod' && (
          <>
            <Line
              x1={originX}
              y1={originY}
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
              x1={originX}
              y1={originY}
              x2={endX * 0.7 + originX * 0.3}
              y2={endY * 0.7 + originY * 0.3}
              stroke="#8b5cf6"
              strokeWidth={4}
            />
            <Circle
              cx={endX * 0.7 + originX * 0.3}
              cy={endY * 0.7 + originY * 0.3}
              r={state.physicalLength * scale * 0.25}
              fill="url(#physicalGradient)"
              stroke="#7c3aed"
              strokeWidth={2}
            />
          </>
        )}

        {state.physicalShape === 'ring' && (
          <>
            <Line
              x1={originX}
              y1={originY}
              x2={endX * 0.7 + originX * 0.3}
              y2={endY * 0.7 + originY * 0.3}
              stroke="#8b5cf6"
              strokeWidth={4}
            />
            <Circle
              cx={endX * 0.7 + originX * 0.3}
              cy={endY * 0.7 + originY * 0.3}
              r={state.physicalLength * scale * 0.25}
              fill="none"
              stroke="#ec4899"
              strokeWidth={6}
            />
          </>
        )}
      </Svg>
    );
  };

  const renderMetrics = () => {
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
  };

  const description = t(
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
          {Platform.OS !== 'web' && renderMetrics()}
        </View>

        {Platform.OS === 'web' && (
          <View style={styles.webMetricsContainer}>{renderMetrics()}</View>
        )}
      </ScrollView>
    </ExperimentLayout>
  );
}

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
