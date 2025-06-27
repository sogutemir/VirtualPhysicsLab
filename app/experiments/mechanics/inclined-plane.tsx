import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import Slider, { CustomSlider } from '../../../components/ui/slider';
import Svg, {
  Path,
  Circle,
  Line,
  G,
  Defs,
  Marker,
  Polygon,
  Rect,
} from 'react-native-svg';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';

// Sabitler
const CONSTANTS = {
  g: 9.81, // Yerçekimi ivmesi (m/s²)
  MIN_ANGLE: 0, // Minimum açı (derece)
  MAX_ANGLE: 90, // Maximum açı (derece)
  MIN_MASS: 0.1, // Minimum kütle (kg)
  MAX_MASS: 10, // Maximum kütle (kg)
  MIN_FRICTION: 0, // Minimum sürtünme katsayısı
  MAX_FRICTION: 1, // Maximum sürtünme katsayısı
  MIN_FORCE: -100, // Minimum uygulanan kuvvet (N)
  MAX_FORCE: 100, // Maximum uygulanan kuvvet (N)
  TIMESTEP: 0.016, // Simülasyon zaman adımı (s)
  PLANE_LENGTH: 400, // Eğik düzlem uzunluğu (piksel)
  PLANE_HEIGHT: 300, // Eğik düzlem yüksekliği (piksel)
};

// Tipler
interface Point2D {
  x: number;
  y: number;
}

interface Forces {
  normal: number; // Normal kuvvet (N)
  friction: number; // Sürtünme kuvveti (N)
  gravity: number; // Yer çekimi kuvveti (N)
  applied: number; // Uygulanan kuvvet (N)
  net: number; // Net kuvvet (N)
}

interface InclinedPlaneState {
  angle: number; // Eğik düzlem açısı (derece)
  mass: number; // Cismin kütlesi (kg)
  friction: number; // Sürtünme katsayısı
  appliedForce: number; // Uygulanan kuvvet (N)
  isRunning: boolean; // Simülasyon çalışıyor mu?
  time: number; // Geçen süre (s)
  position: Point2D; // Cismin konumu
  velocity: number; // Cismin hızı (m/s)
  acceleration: number; // Cismin ivmesi (m/s²)
}

// Yardımcı fonksiyonlar
const calculateForces = (state: InclinedPlaneState): Forces => {
  const { angle, mass, friction, appliedForce } = state;
  const angleRad = (angle * Math.PI) / 180;

  // Kuvvet hesaplamaları
  const gravity = mass * CONSTANTS.g;
  const normal = mass * CONSTANTS.g * Math.cos(angleRad);
  const frictionForce = friction * normal * Math.sign(-state.velocity || -1); // Sürtünme kuvveti hareketin tersi yönünde
  const gravityParallel = mass * CONSTANTS.g * Math.sin(angleRad);

  // Net kuvvet hesabı (pozitif yön yukarı eğik düzlem boyunca)
  const net = appliedForce - frictionForce - gravityParallel;

  return {
    normal,
    friction: frictionForce,
    gravity,
    applied: appliedForce,
    net,
  };
};

const calculateMotion = (
  state: InclinedPlaneState,
  forces: Forces,
  dt: number
): { acceleration: number; velocity: number; position: Point2D } => {
  const { mass, angle } = state;
  const angleRad = (angle * Math.PI) / 180;

  // İvme hesabı (F = ma)
  const acceleration = forces.net / mass;

  // Hız hesabı (v = v0 + at)
  const velocity = state.velocity + acceleration * dt;

  // Konum hesabı (s = s0 + v0t + 1/2at²)
  const displacement = state.velocity * dt + 0.5 * acceleration * dt * dt;

  // Yeni konum hesabı (eğik düzlem boyunca)
  const newX = state.position.x + displacement;
  const y = newX * Math.sin(angleRad); // Y koordinatı X'e bağlı olarak hesaplanır

  return {
    acceleration,
    velocity,
    position: { x: newX, y },
  };
};

const constrainPosition = (
  position: Point2D,
  angle: number,
  planeLength: number
): Point2D => {
  const angleRad = (angle * Math.PI) / 180;
  const x = Math.max(0, Math.min(position.x, planeLength));
  const y = x * Math.sin(angleRad); // Y koordinatı her zaman eğik düzlem üzerinde olmalı

  return { x, y };
};

export default function InclinedPlaneExperiment() {
  const { t } = useLanguage();
  
  // Mobil optimizasyonu
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 600;
  
  const [state, setState] = useState<InclinedPlaneState>({
    angle: 30,
    mass: 1,
    friction: 0.1,
    appliedForce: 0,
    isRunning: false,
    time: 0,
    position: { x: 0, y: 0 },
    velocity: 0,
    acceleration: 0,
  });

  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const updateSimulation = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(updateSimulation);
      return;
    }

    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1); // Maksimum zaman adımını sınırla
    lastTimeRef.current = timestamp;

    setState((prevState) => {
      if (!prevState.isRunning) return prevState;

      const forces = calculateForces(prevState);
      const motion = calculateMotion(prevState, forces, dt);
      const newPosition = constrainPosition(
        motion.position,
        prevState.angle,
        CONSTANTS.PLANE_LENGTH
      );

      // Eğer cisim eğik düzlemin sonuna ulaştıysa hareketi durdur
      if (
        newPosition.x === CONSTANTS.PLANE_LENGTH ||
        (Math.abs(motion.velocity) < 0.01 && Math.abs(forces.net) < 0.01)
      ) {
        return {
          ...prevState,
          isRunning: false,
          position: newPosition,
          velocity: 0,
          acceleration: 0,
        };
      }

      return {
        ...prevState,
        time: prevState.time + dt,
        position: newPosition,
        velocity: motion.velocity,
        acceleration: motion.acceleration,
      };
    });

    animationFrameRef.current = requestAnimationFrame(updateSimulation);
  }, []);

  useEffect(() => {
    if (state.isRunning) {
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning, updateSimulation]);

  const handleToggleSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const handleReset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
      time: 0,
      position: { x: 0, y: 0 },
      velocity: 0,
      acceleration: 0,
    }));
  }, []);

  const forces = calculateForces(state);
  const angleRad = (state.angle * Math.PI) / 180;
  
  // Mobil için daha büyük boyutlar - uzunlamasına
  const svgWidth = isMobile ? screenWidth - 32 : 600;
  const svgHeight = isMobile ? Math.min(screenWidth * 0.8, 500) : 500;
  const scale = isMobile ? 0.8 : 1.0;
  
  const planeEndX = CONSTANTS.PLANE_LENGTH * Math.cos(angleRad) * scale;
  const planeEndY = CONSTANTS.PLANE_LENGTH * Math.sin(angleRad) * scale;

  // Deney açıklamaları
  const description = `
    Eğik düzlem deneyi, bir cismin eğimli bir yüzey üzerindeki hareketini incelememizi sağlar.
    Bu deneyde, açı, kütle, sürtünme katsayısı ve uygulanan kuvvet gibi parametreleri değiştirerek
    cismin hareketini gözlemleyebilirsiniz.

    Eğik düzlem üzerindeki bir cisim, yerçekimi kuvvetinin eğik düzleme paralel bileşeni, sürtünme kuvveti
    ve uygulanan kuvvetin etkisi altında hareket eder. Net kuvvet, cismin ivmesini belirler.

    Deneyde şunları gözlemleyebilirsiniz:
    - Açı arttıkça yerçekiminin eğik düzleme paralel bileşeni artar
    - Sürtünme kuvveti, normal kuvvet ve sürtünme katsayısına bağlıdır
    - Cisim, net kuvvetin sıfır olduğu durumda sabit hızla hareket eder
  `;

  const descriptionEn = `
    The inclined plane experiment allows us to study the motion of an object on a sloped surface.
    In this experiment, you can observe the motion of an object by changing parameters such as angle,
    mass, friction coefficient, and applied force.

    An object on an inclined plane moves under the influence of the parallel component of gravity,
    friction force, and applied force. The net force determines the acceleration of the object.

    In this experiment, you can observe:
    - As the angle increases, the parallel component of gravity increases
    - The friction force depends on the normal force and the coefficient of friction
    - The object moves at constant velocity when the net force is zero
  `;

  return (
    <ExperimentLayout
      title="Eğik Düzlem"
      titleEn="Inclined Plane"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description={description}
      descriptionEn={descriptionEn}
      isRunning={state.isRunning}
      onToggleSimulation={handleToggleSimulation}
      onReset={handleReset}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={[styles.simulation, isMobile && styles.mobileSimulation]}>
            <Svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Zemin çizgisi */}
              <Line
                x1={50}
                y1={svgHeight - 100}
                x2={svgWidth - 50}
                y2={svgHeight - 100}
                stroke="#4a4a4a"
                strokeWidth={3}
              />
              
              {/* Eğik düzlem - daha büyük */}
              <Path
                d={`M 60,${svgHeight - 100}
            L ${60 + planeEndX},${svgHeight - 100 - planeEndY}
            L ${60 + planeEndX},${svgHeight - 100} Z`}
                fill="#90a4ae"
                stroke="#546e7a"
                strokeWidth={2}
              />

              {/* Açı göstergesi */}
              <Path
                d={`M 60,${svgHeight - 100}
            A 30,30 0 0,0 ${60 + 30 * Math.cos(angleRad)},${svgHeight - 100 - 30 * Math.sin(angleRad)}
            L 60,${svgHeight - 100}`}
                fill="rgba(76, 175, 80, 0.3)"
                stroke="#4caf50"
                strokeWidth={1}
              />
              
              {/* Açı değeri */}
              <text
                x={60 + 40}
                y={svgHeight - 75}
                fill="#4caf50"
                fontSize={isMobile ? "12" : "14"}
                fontWeight="bold"
              >
                {state.angle.toFixed(0)}°
              </text>

              {/* Kare cisim ve kuvvet vektörü */}
              <G
                transform={`translate(${
                  60 + state.position.x * Math.cos(angleRad) * scale
                },${
                  svgHeight - 100 - state.position.x * Math.sin(angleRad) * scale
                }) rotate(${-state.angle})`}
              >
                {/* Kütle (kare) - boyut kütleye göre değişiyor */}
                <Rect
                  x={-15 - state.mass * 2}
                  y={-30 - state.mass * 2}
                  width={30 + state.mass * 4}
                  height={30 + state.mass * 4}
                  fill="#f44336"
                  stroke="#d32f2f"
                  strokeWidth={2}
                />
                
                {/* Kütle değeri */}
                <text
                  x={0}
                  y={-15}
                  textAnchor="middle"
                  fill="white"
                  fontSize={isMobile ? "10" : "12"}
                  fontWeight="bold"
                >
                  {state.mass.toFixed(1)}kg
                </text>

                {/* Uygulanan kuvvet vektörü */}
                {state.appliedForce !== 0 && (
                  <>
                    <Line
                      x1={0}
                      y1={-15}
                      x2={state.appliedForce > 0 ? Math.min(state.appliedForce * 2, 80) : Math.max(state.appliedForce * 2, -80)}
                      y2={-15}
                      stroke="#2196f3"
                      strokeWidth={3}
                      markerEnd="url(#arrowhead)"
                    />
                    {/* Kuvvet değeri */}
                    <text
                      x={state.appliedForce > 0 ? 40 : -40}
                      y={-35}
                      textAnchor="middle"
                      fill="#2196f3"
                      fontSize={isMobile ? "10" : "12"}
                      fontWeight="bold"
                    >
                      {Math.abs(state.appliedForce).toFixed(0)}N
                    </text>
                  </>
                )}
              </G>

              {/* Ok ucu tanımı */}
              <Defs>
                <Marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="8"
                  refX="10"
                  refY="4"
                  orient="auto"
                >
                  <Polygon points="0,0 10,4 0,8" fill="#2196f3" />
                </Marker>
              </Defs>
            </Svg>
          </View>

          <View style={styles.controls}>
            <View style={styles.sliders}>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>{t('Açı', 'Angle')}</Text>
                  <Text style={styles.sliderValue}>
                    {state.angle.toFixed(1)}°
                  </Text>
                </View>
                <CustomSlider
                  style={styles.slider}
                  min={CONSTANTS.MIN_ANGLE}
                  max={CONSTANTS.MAX_ANGLE}
                  value={state.angle}
                  onValueChange={(value: number) =>
                    setState((prev) => ({ ...prev, angle: value }))
                  }
                  minimumTrackTintColor="#3498db"
                  maximumTrackTintColor="#bdc3c7"
                  thumbTintColor="#3498db"
                />
              </View>

              <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>{t('Kütle', 'Mass')}</Text>
                  <Text style={styles.sliderValue}>
                    {state.mass.toFixed(1)} kg
                  </Text>
                </View>
                <CustomSlider
                  style={styles.slider}
                  min={CONSTANTS.MIN_MASS}
                  max={CONSTANTS.MAX_MASS}
                  step={0.1}
                  value={state.mass}
                  onValueChange={(value) =>
                    setState((prev) => ({ ...prev, mass: value }))
                  }
                  minimumTrackTintColor="#3498db"
                  maximumTrackTintColor="#bdc3c7"
                  thumbTintColor="#3498db"
                />
              </View>

              <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>
                    {t('Sürtünme Katsayısı', 'Friction Coefficient')}
                  </Text>
                  <Text style={styles.sliderValue}>
                    {state.friction.toFixed(2)}
                  </Text>
                </View>
                <CustomSlider
                  style={styles.slider}
                  min={CONSTANTS.MIN_FRICTION}
                  max={CONSTANTS.MAX_FRICTION}
                  step={0.01}
                  value={state.friction}
                  onValueChange={(value) =>
                    setState((prev) => ({ ...prev, friction: value }))
                  }
                  minimumTrackTintColor="#3498db"
                  maximumTrackTintColor="#bdc3c7"
                  thumbTintColor="#3498db"
                />
              </View>

              <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>
                    {t('Uygulanan Kuvvet', 'Applied Force')}
                  </Text>
                  <Text style={styles.sliderValue}>
                    {state.appliedForce.toFixed(1)} N
                  </Text>
                </View>
                <CustomSlider
                  style={styles.slider}
                  min={CONSTANTS.MIN_FORCE}
                  max={CONSTANTS.MAX_FORCE}
                  value={state.appliedForce}
                  onValueChange={(value) =>
                    setState((prev) => ({ ...prev, appliedForce: value }))
                  }
                  minimumTrackTintColor="#3498db"
                  maximumTrackTintColor="#bdc3c7"
                  thumbTintColor="#3498db"
                />
              </View>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>
                {t('Ölçüm Değerleri', 'Measurement Values')}
              </Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('Hız', 'Velocity')}</Text>
                  <Text style={styles.infoValue}>
                    {state.velocity.toFixed(2)} m/s
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {t('İvme', 'Acceleration')}
                  </Text>
                  <Text style={styles.infoValue}>
                    {state.acceleration.toFixed(2)} m/s²
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {t('Net Kuvvet', 'Net Force')}
                  </Text>
                  <Text style={styles.infoValue}>
                    {forces.net.toFixed(2)} N
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {t('Normal Kuvvet', 'Normal Force')}
                  </Text>
                  <Text style={styles.infoValue}>
                    {forces.normal.toFixed(2)} N
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {t('Sürtünme Kuvveti', 'Friction Force')}
                  </Text>
                  <Text style={styles.infoValue}>
                    {forces.friction.toFixed(2)} N
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('Ağırlık', 'Weight')}</Text>
                  <Text style={styles.infoValue}>
                    {forces.gravity.toFixed(2)} N
                  </Text>
                </View>
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
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 50 : 200,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  simulation: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f8f9fa',
    width: '100%',
    marginBottom: 20,
    minHeight: 500,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileSimulation: {
    minHeight: 400,
    padding: 12,
  },
  controls: {
    flex: 1,
  },
  sliders: {
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sliderValue: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  info: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e9ecef',
    paddingBottom: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});
