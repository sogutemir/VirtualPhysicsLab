import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  memo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Circle,
  Line,
  Path,
  G,
  Text as SvgText,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { CustomSlider } from '../../../components/ui/slider';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';

// Type definitions
interface Point {
  x: number;
  y: number;
}

interface Vector {
  start: Point;
  end: Point;
  color: string;
  label?: string;
}

interface CoriolisEffectState {
  x0: number; // Initial x position (-1.0 to 0.95)
  velocity: number; // Linear velocity (0.1 to 2.5)
  angularVelocity: number; // Angular velocity (0.5 to 5.0)
  time: number; // Elapsed time
  isRunning: boolean; // Is animation running?
  trajectory: Point[]; // Motion trajectory
  showVectors: boolean; // Show force vectors
  showTrajectory: boolean; // Show trajectory path
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = isWeb || screenWidth > 768;

// Physics constants
const PI = Math.PI;
const DT = 0.02; // Time step
const ARROW_SIZE = 12; // Arrow head size
const ARROW_ANGLE = PI / 6; // Arrow head angle

// Default state
const DEFAULT_STATE: CoriolisEffectState = {
  x0: -0.5,
  velocity: 1.2,
  angularVelocity: 2.0,
  time: 0,
  isRunning: false,
  trajectory: [],
  showVectors: true,
  showTrajectory: true,
};

// Memoized Control Component
const ControlSlider = memo<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}>(
  ({ label, value, min, max, step, unit, onValueChange, disabled = false }) => (
    <View style={styles.controlGroup}>
      <Text style={[styles.controlLabel, disabled && styles.disabledText]}>
        {label}: {value.toFixed(2)}
        {unit}
      </Text>
      <CustomSlider
        style={styles.slider}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={onValueChange}
        disabled={disabled}
        minimumTrackTintColor="#3b82f6"
        maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
        thumbTintColor="#ffffff"
      />
    </View>
  )
);

// Toggle Button Component
const ToggleButton = memo<{
  label: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
}>(({ label, value, onToggle, disabled = false }) => (
  <TouchableOpacity
    style={[
      styles.toggleButton,
      value && styles.toggleButtonActive,
      disabled && styles.toggleButtonDisabled,
    ]}
    onPress={onToggle}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text
      style={[
        styles.toggleButtonText,
        value && styles.toggleButtonTextActive,
        disabled && styles.disabledText,
      ]}
    >
      {value ? '✓' : '○'} {label}
    </Text>
  </TouchableOpacity>
));

export default function CoriolisEffectExperiment() {
  const { t } = useLanguage();

  // Calculate canvas dimensions
  const canvasSize = useMemo(() => {
    if (isWeb) return Math.min(screenWidth - 40, 600);
    return Math.min(screenWidth - 24, Math.min(screenHeight * 0.4, 300)); // Mobilde daha küçük
  }, []);

  const RADIUS = useMemo(() => canvasSize / 2.5, [canvasSize]);

  // Center point
  const center: Point = useMemo(
    () => ({
      x: canvasSize / 2,
      y: canvasSize / 2,
    }),
    [canvasSize]
  );

  // State
  const [state, setState] = useState<CoriolisEffectState>(DEFAULT_STATE);

  // Animation reference
  const animationRef = useRef<number>(0);
  const stateRef = useRef(state);

  // Update state ref
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Calculate position
  const calculatePosition = useCallback(
    (
      x0: number,
      velocity: number,
      angularVelocity: number,
      time: number
    ): Point => {
      const x = x0 + velocity * time;
      const cos = Math.cos(angularVelocity * time);
      const sin = Math.sin(angularVelocity * time);

      return {
        x: center.x + x * cos * RADIUS,
        y: center.y - x * sin * RADIUS,
      };
    },
    [center, RADIUS]
  );

  // Calculate velocity vector
  const calculateVelocityVector = useCallback(
    (
      position: Point,
      x: number,
      velocity: number,
      angularVelocity: number,
      time: number,
      scale: number = 20
    ): Vector => {
      const cos = Math.cos(angularVelocity * time);
      const sin = Math.sin(angularVelocity * time);

      const vx = scale * (velocity * cos - x * angularVelocity * sin);
      const vy = scale * (velocity * sin + x * angularVelocity * cos);

      return {
        start: position,
        end: {
          x: position.x + vx,
          y: position.y - vy,
        },
        color: '#ef4444',
        label: t('Hız', 'Velocity'),
      };
    },
    [t]
  );

  // Calculate Coriolis vector
  const calculateCoriolisVector = useCallback(
    (
      position: Point,
      x: number,
      velocity: number,
      angularVelocity: number,
      time: number,
      scale: number = 25
    ): Vector => {
      const cos = Math.cos(angularVelocity * time);
      const sin = Math.sin(angularVelocity * time);
      const K = scale / Math.max(angularVelocity, 0.1);

      const ax =
        -K * angularVelocity * (velocity * sin + x * angularVelocity * cos);
      const ay =
        K * angularVelocity * (velocity * cos - x * angularVelocity * sin);

      return {
        start: position,
        end: {
          x: position.x + ax,
          y: position.y - ay,
        },
        color: '#10b981',
        label: t('Coriolis', 'Coriolis'),
      };
    },
    [t]
  );

  // Calculate centripetal vector
  const calculateCentripetalVector = useCallback(
    (
      position: Point,
      x: number,
      angularVelocity: number,
      time: number,
      scale: number = 25
    ): Vector => {
      const cos = Math.cos(angularVelocity * time);
      const sin = Math.sin(angularVelocity * time);
      const K = scale / Math.max(angularVelocity, 0.1);

      const ax = K * angularVelocity * angularVelocity * x * cos;
      const ay = K * angularVelocity * angularVelocity * x * sin;

      return {
        start: position,
        end: {
          x: position.x + ax,
          y: position.y - ay,
        },
        color: '#3b82f6',
        label: t('Merkezcil', 'Centripetal'),
      };
    },
    [t]
  );

  // Create vector path for SVG
  const createVectorPath = useCallback((vector: Vector): string => {
    const { start, end } = vector;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);

    let path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

    if (length >= ARROW_SIZE) {
      // Add arrow head
      path += ` M ${end.x} ${end.y} L ${
        end.x - ARROW_SIZE * Math.cos(angle - ARROW_ANGLE)
      } ${end.y - ARROW_SIZE * Math.sin(angle - ARROW_ANGLE)}`;
      path += ` M ${end.x} ${end.y} L ${
        end.x - ARROW_SIZE * Math.cos(angle + ARROW_ANGLE)
      } ${end.y - ARROW_SIZE * Math.sin(angle + ARROW_ANGLE)}`;
    }

    return path;
  }, []);

  // Animation step
  const animate = useCallback(() => {
    if (!stateRef.current.isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
      return;
    }

    setState((prev) => {
      const newTime = prev.time + DT;
      const x = prev.x0 + prev.velocity * newTime;

      // Check motion bounds
      if (x >= 0.99) {
        return { ...prev, isRunning: false };
      }

      const newPosition = calculatePosition(
        prev.x0,
        prev.velocity,
        prev.angularVelocity,
        newTime
      );

      // Limit trajectory points for performance
      const newTrajectory = [...prev.trajectory, newPosition];
      if (newTrajectory.length > 200) {
        newTrajectory.shift();
      }

      return {
        ...prev,
        time: newTime,
        trajectory: newTrajectory,
      };
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [calculatePosition]);

  // Start/stop animation
  useEffect(() => {
    if (state.isRunning && !animationRef.current) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
    };
  }, [state.isRunning, animate]);

  // Toggle simulation
  const toggleSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }
    setState((prev) => ({
      ...DEFAULT_STATE,
      showVectors: prev.showVectors,
      showTrajectory: prev.showTrajectory,
      trajectory: [],
    }));
  }, []);

  // Parameter change handlers
  const handleX0Change = useCallback((value: number) => {
    setState((prev) => ({ ...prev, x0: value }));
  }, []);

  const handleVelocityChange = useCallback((value: number) => {
    setState((prev) => ({ ...prev, velocity: value }));
  }, []);

  const handleAngularVelocityChange = useCallback((value: number) => {
    setState((prev) => ({ ...prev, angularVelocity: value }));
  }, []);

  const toggleVectors = useCallback(() => {
    setState((prev) => ({ ...prev, showVectors: !prev.showVectors }));
  }, []);

  const toggleTrajectory = useCallback(() => {
    setState((prev) => ({ ...prev, showTrajectory: !prev.showTrajectory }));
  }, []);

  // Calculate current values
  const currentPosition = useMemo(
    () =>
      calculatePosition(
        state.x0,
        state.velocity,
        state.angularVelocity,
        state.time
      ),
    [
      calculatePosition,
      state.x0,
      state.velocity,
      state.angularVelocity,
      state.time,
    ]
  );

  const x = useMemo(
    () => state.x0 + state.velocity * state.time,
    [state.x0, state.velocity, state.time]
  );

  const vectors = useMemo(() => {
    if (!state.showVectors) return [];

    return [
      calculateVelocityVector(
        currentPosition,
        x,
        state.velocity,
        state.angularVelocity,
        state.time
      ),
      calculateCoriolisVector(
        currentPosition,
        x,
        state.velocity,
        state.angularVelocity,
        state.time
      ),
      calculateCentripetalVector(
        currentPosition,
        x,
        state.angularVelocity,
        state.time
      ),
    ];
  }, [
    state.showVectors,
    calculateVelocityVector,
    calculateCoriolisVector,
    calculateCentripetalVector,
    currentPosition,
    x,
    state.velocity,
    state.angularVelocity,
    state.time,
  ]);

  return (
    <ExperimentLayout
      title={t('Coriolis Etkisi', 'Coriolis Effect')}
      titleEn="Coriolis Effect"
      difficulty={t('İleri Seviye', 'Advanced')}
      difficultyEn="Advanced"
      description={t(
        'Bu deneyde, dönen bir referans çerçevesinde hareket eden bir cismin Coriolis etkisini gözlemleyebilirsiniz.',
        'In this experiment, you can observe the Coriolis effect on an object moving in a rotating reference frame.'
      )}
      descriptionEn="In this experiment, you can observe the Coriolis effect on an object moving in a rotating reference frame."
      isRunning={state.isRunning}
      onToggleSimulation={toggleSimulation}
      onReset={resetSimulation}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>
            🌍 {t('Coriolis Etkisi', 'Coriolis Effect')}
          </Text>
          <Text style={styles.infoDescription}>
            {t(
              'Dönen bir referans çerçevesinde hareket eden bir cismin, dönme nedeniyle görünüşte sapma göstermesidir.',
              "The apparent deflection of moving objects due to Earth's rotation."
            )}
          </Text>
        </View>

        {/* Main Layout */}
        <View style={styles.mainLayout}>
          {/* Simulation Canvas */}
          <View style={styles.simulationContainer}>
            <View style={styles.simulationHeader}>
              <Text style={styles.simulationTitle}>
                {t('Coriolis Simülasyonu', 'Coriolis Simulation')}
              </Text>
              <Text style={styles.simulationStatus}>
                {state.isRunning
                  ? `▶️ ${t('Çalışıyor', 'Running')} • t = ${state.time.toFixed(
                      2
                    )}s`
                  : `⏸️ ${t(
                      'Duraklatıldı',
                      'Paused'
                    )} • t = ${state.time.toFixed(2)}s`}
              </Text>
            </View>

            <View
              style={[
                styles.canvasContainer,
                { width: canvasSize, height: canvasSize },
              ]}
            >
              <Svg width={canvasSize} height={canvasSize} style={styles.svg}>
                <Defs>
                  <RadialGradient
                    id="rotatingPlatform"
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <Stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
                    <Stop offset="70%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <Stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
                  </RadialGradient>
                </Defs>

                {/* Background */}
                <Circle
                  cx={center.x}
                  cy={center.y}
                  r={canvasSize / 2}
                  fill="#1e293b"
                />

                {/* Rotating Platform */}
                <Circle
                  cx={center.x}
                  cy={center.y}
                  r={RADIUS}
                  fill="url(#rotatingPlatform)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />

                {/* Fixed Reference Frame */}
                <G opacity={0.4}>
                  <Path
                    d={`M ${center.x - RADIUS - 30} ${center.y} L ${
                      center.x + RADIUS + 30
                    } ${center.y}`}
                    stroke="#64748b"
                    strokeWidth={1}
                    strokeDasharray="5,5"
                  />
                  <Path
                    d={`M ${center.x} ${center.y + RADIUS + 30} L ${center.x} ${
                      center.y - RADIUS - 30
                    }`}
                    stroke="#64748b"
                    strokeWidth={1}
                    strokeDasharray="5,5"
                  />
                </G>

                {/* Rotating Reference Frame */}
                {(() => {
                  const cos = Math.cos(state.angularVelocity * state.time);
                  const sin = Math.sin(state.angularVelocity * state.time);

                  return (
                    <G opacity={0.6}>
                      <Path
                        d={`M ${center.x - RADIUS * cos} ${
                          center.y + RADIUS * sin
                        } L ${center.x + RADIUS * cos} ${
                          center.y - RADIUS * sin
                        }`}
                        stroke="#94a3b8"
                        strokeWidth={2}
                      />
                      <Path
                        d={`M ${center.x + RADIUS * sin} ${
                          center.y + RADIUS * cos
                        } L ${center.x - RADIUS * sin} ${
                          center.y - RADIUS * cos
                        }`}
                        stroke="#94a3b8"
                        strokeWidth={2}
                      />
                    </G>
                  );
                })()}

                {/* Trajectory Path */}
                {state.showTrajectory && state.trajectory.length > 1 && (
                  <Path
                    d={state.trajectory
                      .map((point, i) =>
                        i === 0
                          ? `M ${point.x} ${point.y}`
                          : `L ${point.x} ${point.y}`
                      )
                      .join(' ')}
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="none"
                    opacity={0.8}
                  />
                )}

                {/* Moving Object */}
                <Circle
                  cx={currentPosition.x}
                  cy={currentPosition.y}
                  r={8}
                  fill="#ffffff"
                  stroke="#ef4444"
                  strokeWidth={2}
                />

                {/* Force Vectors */}
                {vectors.map((vector, index) => (
                  <G key={index}>
                    <Path
                      d={createVectorPath(vector)}
                      stroke={vector.color}
                      strokeWidth={2.5}
                      fill="none"
                      opacity={0.9}
                    />
                    {/* Vector Label */}
                    <SvgText
                      x={vector.end.x + 5}
                      y={vector.end.y - 5}
                      fill={vector.color}
                      fontSize={10}
                      fontWeight="bold"
                    >
                      {vector.label}
                    </SvgText>
                  </G>
                ))}

                {/* Angular Velocity Indicator */}
                <G transform={`translate(${canvasSize - 80}, 20)`}>
                  <SvgText fill="#f59e0b" fontSize={12} fontWeight="bold">
                    ω = {state.angularVelocity.toFixed(1)} rad/s
                  </SvgText>
                </G>
              </Svg>
            </View>

            <View style={styles.simulationLegend}>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendColor, { backgroundColor: '#ef4444' }]}
                />
                <Text style={styles.legendText}>
                  {t('Hız Vektörü', 'Velocity Vector')}
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendColor, { backgroundColor: '#10b981' }]}
                />
                <Text style={styles.legendText}>
                  {t('Coriolis Kuvveti', 'Coriolis Force')}
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendColor, { backgroundColor: '#3b82f6' }]}
                />
                <Text style={styles.legendText}>
                  {t('Merkezcil Kuvvet', 'Centripetal Force')}
                </Text>
              </View>
            </View>
          </View>

          {/* Controls Panel */}
          <View style={styles.controlsPanel}>
            <Text style={styles.panelTitle}>
              ⚙️ {t('Kontrol Paneli', 'Control Panel')}
            </Text>

            {/* Parameter Controls */}
            <View style={styles.parametersSection}>
              <Text style={styles.sectionTitle}>
                {t('Fiziksel Parametreler', 'Physical Parameters')}
              </Text>

              <ControlSlider
                label={t('Başlangıç Pozisyonu (x₀)', 'Initial Position (x₀)')}
                value={state.x0}
                min={-1.0}
                max={0.95}
                step={0.05}
                unit=""
                onValueChange={handleX0Change}
                disabled={state.isRunning}
              />

              <ControlSlider
                label={t('Doğrusal Hız (v)', 'Linear Velocity (v)')}
                value={state.velocity}
                min={0.1}
                max={2.5}
                step={0.1}
                unit=" m/s"
                onValueChange={handleVelocityChange}
                disabled={state.isRunning}
              />

              <ControlSlider
                label={t('Açısal Hız (ω)', 'Angular Velocity (ω)')}
                value={state.angularVelocity}
                min={0.5}
                max={5.0}
                step={0.1}
                unit=" rad/s"
                onValueChange={handleAngularVelocityChange}
                disabled={state.isRunning}
              />
            </View>

            {/* Display Options */}
            <View style={styles.optionsSection}>
              <Text style={styles.sectionTitle}>
                {t('Görüntü Seçenekleri', 'Display Options')}
              </Text>

              <View style={styles.toggleRow}>
                <ToggleButton
                  label={t('Kuvvet Vektörleri', 'Force Vectors')}
                  value={state.showVectors}
                  onToggle={toggleVectors}
                />
                <ToggleButton
                  label={t('Hareket Yörüngesi', 'Trajectory')}
                  value={state.showTrajectory}
                  onToggle={toggleTrajectory}
                />
              </View>
            </View>

            {/* Physics Explanation */}
            <View style={styles.physicsSection}>
              <Text style={styles.sectionTitle}>
                📚 {t('Fizik Açıklaması', 'Physics Explanation')}
              </Text>

              <View style={styles.equationCard}>
                <Text style={styles.equationTitle}>
                  {t('Coriolis Kuvveti:', 'Coriolis Force:')}
                </Text>
                <Text style={styles.equation}>F_c = -2m(Ω × v)</Text>
                <Text style={styles.equationDesc}>
                  {t(
                    'Ω: Açısal hız vektörü, v: Hız vektörü',
                    'Ω: Angular velocity vector, v: Velocity vector'
                  )}
                </Text>
              </View>

              <View style={styles.explanationCard}>
                <Text style={styles.explanationText}>
                  {t(
                    "Coriolis etkisi, Dünya'nın dönüşü nedeniyle rüzgarların, okyanus akıntılarının ve füzelerin yörüngelerinin sapmasına neden olur.",
                    "The Coriolis effect causes deflection of winds, ocean currents, and missiles due to Earth's rotation."
                  )}
                </Text>
                <Text style={styles.explanationText}>
                  {t(
                    'Kuzey yarımkürede hareket eden cisimler sağa, güney yarımkürede ise sola sapar.',
                    'Moving objects deflect to the right in the Northern Hemisphere and to the left in the Southern Hemisphere.'
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: isLargeScreen ? 50 : 80,
  },
  infoSection: {
    margin: isLargeScreen ? 16 : 8,
    padding: isLargeScreen ? 20 : 12,
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: isLargeScreen ? 16 : 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  infoTitle: {
    fontSize: isLargeScreen ? 20 : 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: isLargeScreen ? 8 : 6,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: isLargeScreen ? 16 : 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: isLargeScreen ? 24 : 18,
  },
  mainLayout: {
    flexDirection: 'column',
    margin: isLargeScreen ? 16 : 8,
    gap: isLargeScreen ? 16 : 12,
  },
  simulationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulationHeader: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: isLargeScreen ? 12 : 8,
    padding: isLargeScreen ? 16 : 8,
    marginBottom: isLargeScreen ? 12 : 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  simulationTitle: {
    fontSize: isLargeScreen ? 18 : 14,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  simulationStatus: {
    fontSize: isLargeScreen ? 14 : 11,
    color: '#94a3b8',
  },
  canvasContainer: {
    backgroundColor: '#1e293b',
    borderRadius: isLargeScreen ? 16 : 12,
    overflow: 'hidden',
    borderWidth: isLargeScreen ? 2 : 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: isLargeScreen ? 4 : 2 },
    shadowOpacity: 0.3,
    shadowRadius: isLargeScreen ? 8 : 4,
    elevation: isLargeScreen ? 8 : 4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  simulationLegend: {
    flexDirection: isLargeScreen ? 'row' : 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: isLargeScreen ? 12 : 8,
    padding: isLargeScreen ? 16 : 8,
    marginTop: isLargeScreen ? 12 : 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    gap: isLargeScreen ? 0 : 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: isLargeScreen ? 16 : 12,
    height: isLargeScreen ? 16 : 12,
    borderRadius: isLargeScreen ? 8 : 6,
  },
  legendText: {
    fontSize: isLargeScreen ? 12 : 10,
    color: '#cbd5e1',
  },
  controlsPanel: {
    width: '100%',
    maxWidth: isLargeScreen ? '100%' : '100%',
  },
  panelTitle: {
    fontSize: isLargeScreen ? 18 : 14,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: isLargeScreen ? 16 : 8,
    textAlign: 'center',
  },
  parametersSection: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: isLargeScreen ? 12 : 8,
    padding: isLargeScreen ? 16 : 8,
    marginBottom: isLargeScreen ? 12 : 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  sectionTitle: {
    fontSize: isLargeScreen ? 16 : 12,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: isLargeScreen ? 12 : 6,
  },
  controlGroup: {
    marginBottom: isLargeScreen ? 16 : 8,
  },
  controlLabel: {
    fontSize: isLargeScreen ? 14 : 11,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: isLargeScreen ? 8 : 4,
  },
  slider: {
    width: '100%',
    height: isLargeScreen ? 40 : 30,
  },
  disabledText: {
    opacity: 0.5,
  },
  optionsSection: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: isLargeScreen ? 12 : 8,
    padding: isLargeScreen ? 16 : 8,
    marginBottom: isLargeScreen ? 12 : 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  toggleRow: {
    gap: isLargeScreen ? 8 : 4,
  },
  toggleButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: isLargeScreen ? 8 : 6,
    padding: isLargeScreen ? 12 : 8,
    marginBottom: isLargeScreen ? 8 : 4,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderColor: '#3b82f6',
  },
  toggleButtonDisabled: {
    opacity: 0.5,
  },
  toggleButtonText: {
    fontSize: isLargeScreen ? 14 : 11,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#60a5fa',
    fontWeight: 'bold',
  },
  physicsSection: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: isLargeScreen ? 12 : 8,
    padding: isLargeScreen ? 16 : 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  equationCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: isLargeScreen ? 8 : 6,
    padding: isLargeScreen ? 12 : 8,
    marginBottom: isLargeScreen ? 12 : 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  equationTitle: {
    fontSize: isLargeScreen ? 14 : 11,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  equation: {
    fontSize: isLargeScreen ? 16 : 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#f1f5f9',
    marginBottom: 4,
    textAlign: 'center',
  },
  equationDesc: {
    fontSize: isLargeScreen ? 12 : 9,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  explanationCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: isLargeScreen ? 8 : 6,
    padding: isLargeScreen ? 12 : 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  explanationText: {
    fontSize: isLargeScreen ? 13 : 10,
    color: '#cbd5e1',
    lineHeight: isLargeScreen ? 20 : 14,
    marginBottom: isLargeScreen ? 8 : 4,
  },
});
