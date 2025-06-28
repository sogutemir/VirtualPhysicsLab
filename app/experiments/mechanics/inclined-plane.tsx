import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text as RNText,
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
  Text,
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
  
  // Mobil için daha büyük boyutlar - uzunlamasına (%30 daha uzun)
  const svgWidth = isMobile ? screenWidth - 32 : 600;
  const svgHeight = isMobile ? Math.min(screenWidth * 1.0, 650) : 650;
  const scale = isMobile ? 0.65 : 1.0; // Mobilde %15 daha küçültme
  
  // Düzlemi küçültüp sola kaydırmak için
  const planeScale = scale * 0.92;
  const planeEndX = CONSTANTS.PLANE_LENGTH * Math.cos(angleRad) * planeScale;
  const planeEndY = CONSTANTS.PLANE_LENGTH * Math.sin(angleRad) * planeScale;

  // Deney açıklamaları
  const description = `🎯 Eğik düzlem deneyi, bir cismin eğimli yüzey üzerindeki hareketini inceleyen temel fizik deneyidir.

📚 TEORİ VE FORMÜLLER:

⚡ Kuvvet Bileşenleri:
• Paralel bileşen: Fg∥ = mg sin θ
• Dik bileşen: Fg⊥ = mg cos θ
• Normal kuvvet: N = mg cos θ + Fapplied cos α

🔄 Hareket Denklemleri:
• Net kuvvet: Fnet = Fapplied + mg sin θ - Ffriction
• Sürtünme kuvveti: Ff = μN = μmg cos θ
• İvme: a = Fnet / m
• Hız: v(t) = v₀ + at
• Konum: x(t) = x₀ + v₀t + ½at²

⚖️ Denge Koşulları:
• Statik denge: mg sin θ ≤ μs mg cos θ
• Kinetik hareket: mg sin θ > μk mg cos θ
• Kritik açı: θc = arctan(μs)

🔋 Enerji Analizi:
• Potansiyel enerji: Ep = mgh = mgx sin θ
• Kinetik enerji: Ek = ½mv²
• İş-enerji teoremi: W = ΔEk

💡 Sürtünme Türleri:
• Statik sürtünme: fs ≤ μsN
• Kinetik sürtünme: fk = μkN
• Genellikle μs > μk

🎮 Parametre Aralıkları:
- Eğim Açısı (θ): 0° - 90°
- Kütle (m): 0.1 - 10.0 kg
- Sürtünme Katsayısı (μ): 0.0 - 1.0
- Uygulanan Kuvvet: -100 - +100 N

🔬 Gözlemlenebilir Durumlar:
• Statik denge (cisim hareketsiz)
• Sabit hızla hareket (a = 0)
• İvmeli hareket (a ≠ 0)
• Açı artışının etkisi
• Sürtünmenin hareket üzerindeki etkisi

💻 Fiziksel İlkeler:
Newton'un hareket yasaları ve sürtünme kuvvetlerinin eğik düzlemde uygulanması. Sistem, yerçekimi, normal kuvvet, sürtünme ve uygulanan kuvvetlerin dengesini gösterir.`;

  const descriptionEn = `🎯 The inclined plane experiment studies the motion of an object on a sloped surface, a fundamental physics experiment.

📚 THEORY AND FORMULAS:

⚡ Force Components:
• Parallel component: Fg∥ = mg sin θ
• Perpendicular component: Fg⊥ = mg cos θ
• Normal force: N = mg cos θ + Fapplied cos α

🔄 Equations of Motion:
• Net force: Fnet = Fapplied + mg sin θ - Ffriction
• Friction force: Ff = μN = μmg cos θ
• Acceleration: a = Fnet / m
• Velocity: v(t) = v₀ + at
• Position: x(t) = x₀ + v₀t + ½at²

⚖️ Equilibrium Conditions:
• Static equilibrium: mg sin θ ≤ μs mg cos θ
• Kinetic motion: mg sin θ > μk mg cos θ
• Critical angle: θc = arctan(μs)

🔋 Energy Analysis:
• Potential energy: Ep = mgh = mgx sin θ
• Kinetic energy: Ek = ½mv²
• Work-energy theorem: W = ΔEk

💡 Types of Friction:
• Static friction: fs ≤ μsN
• Kinetic friction: fk = μkN
• Generally μs > μk

🎮 Parameter Ranges:
- Incline Angle (θ): 0° - 90°
- Mass (m): 0.1 - 10.0 kg
- Friction Coefficient (μ): 0.0 - 1.0
- Applied Force: -100 - +100 N

🔬 Observable Phenomena:
• Static equilibrium (object at rest)
• Constant velocity motion (a = 0)
• Accelerated motion (a ≠ 0)
• Effect of angle increase
• Friction's impact on motion

💻 Physical Principles:
Application of Newton's laws of motion and friction forces on an inclined plane. The system demonstrates the balance of gravity, normal force, friction, and applied forces.`;

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
                x1={isMobile ? 30 : 40}
                y1={svgHeight - (isMobile ? 100 : 120)}
                x2={svgWidth - (isMobile ? 30 : 40)}
                y2={svgHeight - (isMobile ? 100 : 120)}
                stroke="#4a4a4a"
                strokeWidth={3}
              />
              
              {/* Eğik düzlem - küçültülmüş ve sola kaydırılmış */}
              <Path
                d={`M ${isMobile ? 35 : 45},${svgHeight - (isMobile ? 100 : 120)}
            L ${(isMobile ? 35 : 45) + planeEndX},${svgHeight - (isMobile ? 100 : 120) - planeEndY}
            L ${(isMobile ? 35 : 45) + planeEndX},${svgHeight - (isMobile ? 100 : 120)} Z`}
                fill="#90a4ae"
                stroke="#546e7a"
                strokeWidth={2}
              />

              {/* Açı göstergesi */}
              <Path
                d={`M ${isMobile ? 35 : 45},${svgHeight - (isMobile ? 100 : 120)}
            A 30,30 0 0,0 ${(isMobile ? 35 : 45) + 30 * Math.cos(angleRad)},${svgHeight - (isMobile ? 100 : 120) - 30 * Math.sin(angleRad)}
            L ${isMobile ? 35 : 45},${svgHeight - (isMobile ? 100 : 120)}`}
                fill="rgba(76, 175, 80, 0.3)"
                stroke="#4caf50"
                strokeWidth={1}
              />
              
              {/* Açı değeri */}
              <Text
                x={(isMobile ? 35 : 45) + 40}
                y={svgHeight - (isMobile ? 70 : 90)}
                fill="#4caf50"
                fontSize={isMobile ? "12" : "14"}
                fontWeight="bold"
              >
                {state.angle.toFixed(0)}°
              </Text>

              {/* Kare cisim ve kuvvet vektörü */}
              <G
                transform={`translate(${
                  (isMobile ? 35 : 45) + state.position.x * Math.cos(angleRad) * planeScale
                },${
                  svgHeight - (isMobile ? 100 : 120) - state.position.x * Math.sin(angleRad) * planeScale
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
                <Text
                  x={0}
                  y={-15}
                  textAnchor="middle"
                  fill="white"
                  fontSize={isMobile ? "10" : "12"}
                  fontWeight="bold"
                >
                  {state.mass.toFixed(1)}kg
                </Text>

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
                    <Text
                      x={state.appliedForce > 0 ? 40 : -40}
                      y={-35}
                      textAnchor="middle"
                      fill="#2196f3"
                      fontSize={isMobile ? "10" : "12"}
                      fontWeight="bold"
                    >
                      {Math.abs(state.appliedForce).toFixed(0)}N
                    </Text>
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
                  <RNText style={styles.sliderLabel}>{t('Açı', 'Angle')}</RNText>
                  <RNText style={styles.sliderValue}>
                    {state.angle.toFixed(1)}°
                  </RNText>
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
                  <RNText style={styles.sliderLabel}>{t('Kütle', 'Mass')}</RNText>
                  <RNText style={styles.sliderValue}>
                    {state.mass.toFixed(1)} kg
                  </RNText>
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
                  <RNText style={styles.sliderLabel}>
                    {t('Sürtünme Katsayısı', 'Friction Coefficient')}
                  </RNText>
                  <RNText style={styles.sliderValue}>
                    {state.friction.toFixed(2)}
                  </RNText>
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
                  <RNText style={styles.sliderLabel}>
                    {t('Uygulanan Kuvvet', 'Applied Force')}
                  </RNText>
                  <RNText style={styles.sliderValue}>
                    {state.appliedForce.toFixed(1)} N
                  </RNText>
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
              <RNText style={styles.infoTitle}>
                {t('Ölçüm Değerleri', 'Measurement Values')}
              </RNText>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <RNText style={styles.infoLabel}>{t('Hız', 'Velocity')}</RNText>
                  <RNText style={styles.infoValue}>
                    {state.velocity.toFixed(2)} m/s
                  </RNText>
                </View>
                <View style={styles.infoItem}>
                  <RNText style={styles.infoLabel}>
                    {t('İvme', 'Acceleration')}
                  </RNText>
                  <RNText style={styles.infoValue}>
                    {state.acceleration.toFixed(2)} m/s²
                  </RNText>
                </View>
                <View style={styles.infoItem}>
                  <RNText style={styles.infoLabel}>
                    {t('Net Kuvvet', 'Net Force')}
                  </RNText>
                  <RNText style={styles.infoValue}>
                    {forces.net.toFixed(2)} N
                  </RNText>
                </View>
                <View style={styles.infoItem}>
                  <RNText style={styles.infoLabel}>
                    {t('Normal Kuvvet', 'Normal Force')}
                  </RNText>
                  <RNText style={styles.infoValue}>
                    {forces.normal.toFixed(2)} N
                  </RNText>
                </View>
                <View style={styles.infoItem}>
                  <RNText style={styles.infoLabel}>
                    {t('Sürtünme Kuvveti', 'Friction Force')}
                  </RNText>
                  <RNText style={styles.infoValue}>
                    {forces.friction.toFixed(2)} N
                  </RNText>
                </View>
                <View style={styles.infoItem}>
                  <RNText style={styles.infoLabel}>{t('Ağırlık', 'Weight')}</RNText>
                  <RNText style={styles.infoValue}>
                    {forces.gravity.toFixed(2)} N
                  </RNText>
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
    minHeight: 650,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileSimulation: {
    minHeight: 520,
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
