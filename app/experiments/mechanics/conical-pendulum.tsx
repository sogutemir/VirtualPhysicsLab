import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Dimensions, ScrollView, GestureResponderEvent, Platform } from 'react-native';
import { CustomSlider } from '../../../components/ui/slider';
import Svg, { Line, Circle, Rect, Path } from 'react-native-svg';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import { useConicalPendulum } from './components/conical-pendulum/useConicalPendulum';
import {
  Point2D,
  Point3D,
  calculateProjectionConstants,
  project3DTo2D,
} from './components/conical-pendulum/drawing';

const { width, height } = Dimensions.get('window');
const PENDULUM_RADIUS = 8;
const PROJECTION_DISTANCE = 1000;
const PROJECTION_RHO = 5.5;

export default function ConicalPendulumExperiment() {
  const { t } = useLanguage();
  const [viewDimensions, setViewDimensions] = useState({
    width: width - 30,
    height: 400,
  });
  
  const {
    state,
    startAnimation,
    stopAnimation,
    resetAnimation,
    setOmega,
    toggleShowForces,
    toggleShowTrajectory,
    setViewAngle,
    setLength,
  } = useConicalPendulum();

  // Dokunma olayları için state
  const [touchState, setTouchState] = useState({
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  const handleTouchStart = (e: GestureResponderEvent) => {
    const touch = e.nativeEvent.touches[0];
    setTouchState({
      isDragging: true,
      lastX: touch.pageX,
      lastY: touch.pageY,
    });
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    if (!touchState.isDragging) return;
    
    const touch = e.nativeEvent.touches[0];
    const deltaX = touch.pageX - touchState.lastX;
    
    // Görüş açısını değiştir
    setViewAngle(state.viewAngle + deltaX * 0.5);
    
    setTouchState({
      ...touchState,
      lastX: touch.pageX,
      lastY: touch.pageY,
    });
  };

  const handleTouchEnd = () => {
    setTouchState({
      ...touchState,
      isDragging: false,
    });
  };

  // Web için mouse olayları
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setTouchState({
      isDragging: true,
      lastX: e.clientX,
      lastY: e.clientY,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!touchState.isDragging) return;
    
    const deltaX = e.clientX - touchState.lastX;
    
    // Görüş açısını değiştir
    setViewAngle(state.viewAngle + deltaX * 0.5);
    
    setTouchState({
      ...touchState,
      lastX: e.clientX,
      lastY: e.clientY,
    });
  }, [touchState, state.viewAngle, setViewAngle]);

  const handleMouseUp = useCallback(() => {
    setTouchState(prev => ({
      ...prev,
      isDragging: false,
    }));
  }, []);

  // Web için mouse olaylarını document'a ekle/kaldır
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp as any);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp as any);
      };
    }
  }, [handleMouseMove, handleMouseUp]);

  const toggleSimulation = () => {
    if (state.isRunning) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  // SVG içinde çizim için hesaplamalar
  const centerX = viewDimensions.width / 2;
  const centerY = viewDimensions.height / 2;
  const projConstants = calculateProjectionConstants(0, state.viewAngle);

  // Sarkaç konumunu hesapla
  const radius = state.length * Math.sin(state.alpha);
  const height = state.length * Math.cos(state.alpha);
  const angle = state.omega * state.time;

  const pendulumPos: Point3D = {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    z: 1 - height,
  };

  // 3D noktaları 2D'ye dönüştür
  const projectPoint = (point: Point3D) => {
    const projected = project3DTo2D(point, projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
    return {
      x: centerX + projected.x,
      y: centerY - projected.y,
    };
  };

  // Zemin noktaları
  const groundPoints = [
    { x: 1, y: -1, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: -1, y: 1, z: 0 },
    { x: -1, y: -1, z: 0 },
  ].map(projectPoint);

  // Zemin path'i oluştur
  const groundPath = `
    M ${groundPoints[0].x} ${groundPoints[0].y}
    L ${groundPoints[1].x} ${groundPoints[1].y}
    L ${groundPoints[2].x} ${groundPoints[2].y}
    L ${groundPoints[3].x} ${groundPoints[3].y}
    Z
  `;

  // Dikey eksen noktaları
  const axisTop = projectPoint({ x: 0, y: 0, z: 1 });
  const axisBottom = projectPoint({ x: 0, y: 0, z: 0 });

  // Sarkaç noktası
  const projectedPendulum = projectPoint(pendulumPos);

  // Yörünge noktaları
  const trajectoryPoints = [];
  if (state.showTrajectory) {
    const steps = 40;
    for (let i = 0; i < steps; i++) {
      const a = (2 * Math.PI * i) / steps;
      const p: Point3D = {
        x: radius * Math.cos(a),
        y: radius * Math.sin(a),
        z: 1 - height,
      };
      trajectoryPoints.push(projectPoint(p));
    }
  }

  // Yörünge path'i oluştur
  let trajectoryPath = '';
  if (trajectoryPoints.length > 0) {
    trajectoryPath = `M ${trajectoryPoints[0].x} ${trajectoryPoints[0].y}`;
    for (let i = 1; i < trajectoryPoints.length; i++) {
      trajectoryPath += ` L ${trajectoryPoints[i].x} ${trajectoryPoints[i].y}`;
    }
    trajectoryPath += ` L ${trajectoryPoints[0].x} ${trajectoryPoints[0].y}`;
  }

  return (
    <ExperimentLayout
      title="Konik Sarkaç"
      titleEn="Conical Pendulum"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description={`🎯 Konik sarkaç, bir ipin ucuna bağlı kütlenin yatay düzlemde dairesel hareket yaparak konik yörünge izlediği fiziksel sistemdir.

📚 TEORİ VE FORMÜLLER:

⚡ Temel Denge Denklemi:
cos(α) = g/(L·ω²)
- α: İp ile düşey arasındaki açı
- g: Yerçekimi ivmesi (9.81 m/s²)
- L: İp uzunluğu
- ω: Açısal hız

🔄 Geometrik İlişkiler:
r = L·sin(α)  (Yörünge yarıçapı)
h = L·cos(α)  (Düşey yükseklik)

⏰ Periyot ve Frekans:
T = 2π/ω  (Periyot)
f = ω/(2π)  (Frekans)

🎯 Kuvvet Analizi:
T = mg/cos(α)  (İp gerginliği)
Fc = mω²r = mg·tan(α)  (Merkezcil kuvvet)
Fyatay = T·sin(α) = mg·tan(α)
Fdüşey = T·cos(α) = mg

⚖️ Kritik Koşullar:
• Minimum ω: ω > √(g/L) (Konik hareket için)
• Maksimum α: α < 90° (Fiziksel sınır)
• Kararlılık: cos(α) ≤ 1

🎮 Parametre Aralıkları:
- İp Uzunluğu (L): 0.50 - 0.75 m
- Açısal Hız (ω): 3.0 - 7.0 rad/s
- Görüş Açısı: 360° döndürülebilir

🔬 Gözlemlenebilir Durumlar:
• Açısal hız arttıkça konik açı artar
• Yörünge yarıçapı açısal hıza bağlı değişir
• 3D perspektif ile geometrik ilişkiler
• Kuvvet dengesinin görsel analizi
• Kararlı dairesel hareket

🎨 İnteraktif Özellikler:
• Dokunarak sürükle → Görüş açısı değişir
• Gerçek zamanlı parametre ayarları
• Kuvvet vektörleri gösterimi
• Yörünge izleme modu`}
      descriptionEn={`🎯 A conical pendulum is a physical system where a mass attached to a string moves in a circular path in the horizontal plane, tracing a conical trajectory.

📚 THEORY AND FORMULAS:

⚡ Fundamental Equilibrium Equation:
cos(α) = g/(L·ω²)
- α: Angle between string and vertical
- g: Gravitational acceleration (9.81 m/s²)
- L: String length
- ω: Angular velocity

🔄 Geometric Relations:
r = L·sin(α)  (Trajectory radius)
h = L·cos(α)  (Vertical height)

⏰ Period and Frequency:
T = 2π/ω  (Period)
f = ω/(2π)  (Frequency)

🎯 Force Analysis:
T = mg/cos(α)  (String tension)
Fc = mω²r = mg·tan(α)  (Centripetal force)
Fhorizontal = T·sin(α) = mg·tan(α)
Fvertical = T·cos(α) = mg

⚖️ Critical Conditions:
• Minimum ω: ω > √(g/L) (For conical motion)
• Maximum α: α < 90° (Physical limit)
• Stability: cos(α) ≤ 1

🎮 Parameter Ranges:
- String Length (L): 0.50 - 0.75 m
- Angular Velocity (ω): 3.0 - 7.0 rad/s
- View Angle: 360° rotatable

🔬 Observable Phenomena:
• Conical angle increases with angular velocity
• Trajectory radius depends on angular velocity
• 3D perspective shows geometric relationships
• Visual force balance analysis
• Stable circular motion

🎨 Interactive Features:
• Touch and drag → Change view angle
• Real-time parameter adjustments
• Force vector display
• Trajectory tracking mode`}
      isRunning={state.isRunning}
      onToggleSimulation={toggleSimulation}
      onReset={resetAnimation}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.experimentArea}>
          <View style={styles.canvasContainer}>
            <View
              style={styles.svgContainer}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              {Platform.OS === 'web' && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%', 
                    zIndex: 10,
                    cursor: 'grab' 
                  }}
                  onMouseDown={handleMouseDown}
                />
              )}
              <Svg
                width={viewDimensions.width}
                height={viewDimensions.height}
                style={styles.svg}
              >
                {/* Zemin */}
                <Path
                  d={groundPath}
                  fill={state.viewAngle >= 0 ? 'white' : 'gray'}
                  stroke="black"
                  strokeWidth={1}
                />
                
                {/* Yörünge */}
                {state.showTrajectory && (
                  <Path
                    d={trajectoryPath}
                    stroke="gray"
                    strokeWidth={2}
                    strokeDasharray="6,4"
                    fill="none"
                  />
                )}
                
                {/* Dikey eksen */}
                <Line
                  x1={axisTop.x}
                  y1={axisTop.y}
                  x2={axisBottom.x}
                  y2={axisBottom.y}
                  stroke="black"
                  strokeWidth={4}
                />
                
                {/* İp */}
                <Line
                  x1={axisTop.x}
                  y1={axisTop.y}
                  x2={projectedPendulum.x}
                  y2={projectedPendulum.y}
                  stroke="black"
                  strokeWidth={1}
                />
                
                {/* Sarkaç */}
                <Circle
                  cx={projectedPendulum.x}
                  cy={projectedPendulum.y}
                  r={PENDULUM_RADIUS}
                  fill="red"
                  stroke="black"
                  strokeWidth={1}
                />
              </Svg>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <View style={styles.controlGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{t('İp Uzunluğu', 'String Length')}</Text>
                <Text style={styles.value}>{state.length.toFixed(2)} m</Text>
              </View>
              <CustomSlider
                value={state.length}
                onValueChange={setLength}
                min={0.5}
                max={0.75}
                step={0.01}
                minimumTrackTintColor="#3498db"
                maximumTrackTintColor="#bdc3c7"
                thumbTintColor="#2980b9"
                style={styles.slider}
              />
            </View>

            <View style={styles.controlGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{t('Açısal Hız', 'Angular Velocity')}</Text>
                <Text style={styles.value}>{state.omega.toFixed(1)} rad/s</Text>
              </View>
              <CustomSlider
                value={state.omega}
                onValueChange={setOmega}
                min={3.0}
                max={7.0}
                step={0.1}
                minimumTrackTintColor="#3498db"
                maximumTrackTintColor="#bdc3c7"
                thumbTintColor="#2980b9"
                style={styles.slider}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>{t('Kuvvetleri Göster', 'Show Forces')}</Text>
              <Switch
                value={state.showForces}
                onValueChange={toggleShowForces}
                trackColor={{ false: "#bdc3c7", true: "#3498db" }}
                thumbColor={state.showForces ? "#2980b9" : "#ecf0f1"}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>{t('Yörüngeyi Göster', 'Show Trajectory')}</Text>
              <Switch
                value={state.showTrajectory}
                onValueChange={toggleShowTrajectory}
                trackColor={{ false: "#bdc3c7", true: "#3498db" }}
                thumbColor={state.showTrajectory ? "#2980b9" : "#ecf0f1"}
              />
            </View>

            <View style={styles.measurementsContainer}>
              <View style={styles.measurementItem}>
                <Text style={styles.measurementLabel}>{t('Açı α:', 'Angle α:')}</Text>
                <Text style={styles.measurementValue}>{(state.alpha * 180 / Math.PI).toFixed(1)}°</Text>
              </View>
              <View style={styles.measurementItem}>
                <Text style={styles.measurementLabel}>{t('Görüş Açısı:', 'View Angle:')}</Text>
                <Text style={styles.measurementValue}>{state.viewAngle.toFixed(1)}°</Text>
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
    paddingBottom: Platform.OS === 'web' ? 50 : 200, // Mobilde alt boşluğu artırdım
  },
  experimentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasContainer: {
    width: '100%',
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'silver',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  controlGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  value: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  measurementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  measurementItem: {
    alignItems: 'center',
  },
  measurementLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
}); 