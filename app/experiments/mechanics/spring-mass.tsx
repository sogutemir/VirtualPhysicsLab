import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Platform, Text, Dimensions } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { SpringMassSystem } from './components/spring-mass/SpringMassSystem';
import { ControlPanel } from './components/spring-mass/ControlPanel';
import { ParameterSlider } from './components/spring-mass/ParameterSlider';
import { SpringMassSystem as SystemState } from './utils/PhysicsEngine';
import { useLanguage } from '../../../components/LanguageContext';

export default function SpringMassExperiment() {
  const { t } = useLanguage();

  // Mobil optimizasyonu
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 600;

  // Simülasyon durumu
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrail, setShowTrail] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [speed, setSpeed] = useState(isMobile ? 8 : 1); // Mobil için 8x (1x görünüyor), Web için 1x

  // Fizik parametreleri
  const [mass, setMass] = useState(1.0);
  const [springConstant, setSpringConstant] = useState(10.0);
  const [dampingCoefficient, setDampingCoefficient] = useState(0.1);
  const [initialPosition, setInitialPosition] = useState(0.5);
  const [initialVelocity, setInitialVelocity] = useState(0);

  // Sistem durumu
  const [currentState, setCurrentState] = useState<SystemState>({
    time: 0,
    position: 0,
    velocity: 0,
    acceleration: 0,
    energy: {
      kinetic: 0,
      potential: 0,
      total: 0,
    },
    force: {
      spring: 0,
      damping: 0,
      total: 0,
    },
  });

  // Memoized event handlers - performans için
  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentState({
      time: 0,
      position: 0,
      velocity: 0,
      acceleration: 0,
      energy: {
        kinetic: 0,
        potential: 0,
        total: 0,
      },
      force: {
        spring: 0,
        damping: 0,
        total: 0,
      },
    });
  }, []);

  const handleToggleTrail = useCallback(() => {
    setShowTrail((prev) => !prev);
  }, []);

  const handleToggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev);
  }, []);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const handleStateUpdate = useCallback((state: SystemState) => {
    setCurrentState(state);
  }, []);

  // Parameter change handlers - memoized
  const handleMassChange = useCallback((value: number) => {
    setMass(value);
  }, []);

  const handleSpringConstantChange = useCallback((value: number) => {
    setSpringConstant(value);
  }, []);

  const handleDampingChange = useCallback((value: number) => {
    setDampingCoefficient(value);
  }, []);

  const handleInitialPositionChange = useCallback((value: number) => {
    setInitialPosition(value);
  }, []);

  const handleInitialVelocityChange = useCallback((value: number) => {
    setInitialVelocity(value);
  }, []);

  // Memoized description
  const description = useMemo(() => t(
    `🎯 Gelişmiş Yay-Kütle Sistemi: Basit harmonik hareketin detaylı analizi için kapsamlı fizik deneyidir.

📚 TEORİ VE FORMÜLLER:

⚡ Hareket Denklemi:
• Kuvvet: F = -kx - bv
• İvme: a = F/m = -(k/m)x - (b/m)v
• Diferansiyel denklem: mẍ + bẋ + kx = 0

🔄 Basit Harmonik Hareket:
• Açısal frekans: ω = √(k/m)
• Periyot: T = 2π√(m/k)
• Frekans: f = 1/T = (1/2π)√(k/m)
• Çözüm: x(t) = A cos(ωt + φ)

⚖️ Sönümlü Hareket:
• Sönümleme oranı: γ = b/(2m)
• Sönümlü frekans: ωd = √(ω² - γ²)
• Çözüm: x(t) = Ae^(-γt) cos(ωdt + φ)

🔋 Enerji Analizi:
• Potansiyel enerji: Ep = ½kx²
• Kinetik enerji: Ek = ½mv²
• Toplam enerji: E = Ek + Ep
• Sönümlü sistemde: E(t) = E₀e^(-2γt)

💡 Sönümleme Türleri:
• Az sönümlü (γ < ω): Salınımlı hareket
• Kritik sönümlü (γ = ω): En hızlı dönüş
• Aşırı sönümlü (γ > ω): Salınımsız dönüş

🎮 Parametre Aralıkları:
- Kütle (m): 0.1 - 5.0 kg
- Yay Sabiti (k): 1.0 - 50.0 N/m
- Sönümleme Katsayısı (b): 0.0 - 2.0 Ns/m
- Başlangıç Pozisyonu: -1.5 - +1.5 m
- Başlangıç Hızı: -5.0 - +5.0 m/s

🔬 Gözlemlenebilir Durumlar:
• Basit harmonik salınım
• Sönümlü salınım
• Rezonans frekansı
• Enerji dönüşümleri
• Faz ilişkileri

💻 Sayısal Çözüm:
• Runge-Kutta 4. derece integrasyon
• Gerçek zamanlı hareket analizi
• İnteraktif parametre değişikliği
• Görsel hareket izi takibi`,

    `🎯 Advanced Spring-Mass System: Comprehensive physics experiment for detailed analysis of simple harmonic motion.

📚 THEORY AND FORMULAS:

⚡ Equation of Motion:
• Force: F = -kx - bv
• Acceleration: a = F/m = -(k/m)x - (b/m)v
• Differential equation: mẍ + bẋ + kx = 0

🔄 Simple Harmonic Motion:
• Angular frequency: ω = √(k/m)
• Period: T = 2π√(m/k)
• Frequency: f = 1/T = (1/2π)√(k/m)
• Solution: x(t) = A cos(ωt + φ)

⚖️ Damped Motion:
• Damping ratio: γ = b/(2m)
• Damped frequency: ωd = √(ω² - γ²)
• Solution: x(t) = Ae^(-γt) cos(ωdt + φ)

🔋 Energy Analysis:
• Potential energy: Ep = ½kx²
• Kinetic energy: Ek = ½mv²
• Total energy: E = Ek + Ep
• Damped system: E(t) = E₀e^(-2γt)

💡 Damping Types:
• Underdamped (γ < ω): Oscillatory motion
• Critically damped (γ = ω): Fastest return
• Overdamped (γ > ω): Non-oscillatory return

🎮 Parameter Ranges:
- Mass (m): 0.1 - 5.0 kg
- Spring Constant (k): 1.0 - 50.0 N/m
- Damping Coefficient (b): 0.0 - 2.0 Ns/m
- Initial Position: -1.5 - +1.5 m
- Initial Velocity: -5.0 - +5.0 m/s

🔬 Observable Phenomena:
• Simple harmonic oscillation
• Damped oscillation
• Resonance frequency
• Energy transformations
• Phase relationships

💻 Numerical Solution:
• Runge-Kutta 4th order integration
• Real-time motion analysis
• Interactive parameter changes
• Visual motion trail tracking`
  ), [t]);

  // Memoized styles for mobile optimization
  const containerStyle = useMemo(() => ({
    ...styles.container,
    gap: isMobile ? 12 : 16,
  }), [isMobile]);

  const scrollViewContentStyle = useMemo(() => ({
    ...styles.scrollViewContent,
    paddingBottom: Platform.OS === 'web' ? 50 : (isMobile ? 150 : 200),
  }), [isMobile]);

  return (
    <ExperimentLayout
      title={t('Gelişmiş Yay-Kütle Sistemi', 'Advanced Spring-Mass System')}
      titleEn="Advanced Spring-Mass System"
      difficulty={t('Orta Seviye', 'Intermediate')}
      difficultyEn="Intermediate"
      description={description}
      descriptionEn={description}
      isRunning={isPlaying}
      onToggleSimulation={handlePlayPause}
      onReset={handleReset}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={scrollViewContentStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={containerStyle}>
          {/* Kontrol Paneli */}
          <ControlPanel
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            showTrail={showTrail}
            onToggleTrail={handleToggleTrail}
            showGrid={showGrid}
            onToggleGrid={handleToggleGrid}
            speed={speed}
            onSpeedChange={handleSpeedChange}
          />

          {/* Simülasyon */}
          <View style={styles.simulationContainer}>
            <SpringMassSystem
              isPlaying={isPlaying}
              mass={mass}
              springConstant={springConstant}
              dampingCoefficient={dampingCoefficient}
              initialPosition={initialPosition}
              initialVelocity={initialVelocity}
              onStateUpdate={handleStateUpdate}
              showTrail={showTrail}
              showGrid={showGrid}
              speed={speed}
            />
          </View>

          {/* Parametreler */}
          <View style={[styles.parametersContainer, isMobile && styles.mobileParametersContainer]}>
            <View style={styles.parametersHeader}>
              <Text style={[styles.parametersTitle, isMobile && styles.mobileParametersTitle]}>
                {t('Deney Parametreleri', 'Experiment Parameters')}
              </Text>
            </View>

            <View style={styles.parametersContent}>
              <ParameterSlider
                label={t('Kütle', 'Mass')}
                value={mass}
                min={0.1}
                max={5.0}
                step={0.1}
                unit="kg"
                onChange={handleMassChange}
                description={t(
                  'Sistemin eylemsizliğini belirler. Büyük kütle = düşük frekans',
                  'Determines system inertia. Large mass = low frequency'
                )}
                color="#ef4444"
              />

              <ParameterSlider
                label={t('Yay Sabiti', 'Spring Constant')}
                value={springConstant}
                min={1.0}
                max={50.0}
                step={1.0}
                unit="N/m"
                onChange={handleSpringConstantChange}
                description={t(
                  'Yayın sertliği. Büyük k = yüksek frekans',
                  'Spring stiffness. Large k = high frequency'
                )}
                color="#3b82f6"
              />

              <ParameterSlider
                label={t('Sönümleme Katsayısı', 'Damping Coefficient')}
                value={dampingCoefficient}
                min={0.0}
                max={2.0}
                step={0.1}
                unit="Ns/m"
                onChange={handleDampingChange}
                description={t(
                  'Sistemdeki enerji kaybı. 0 = kayıpsız sistem',
                  'Energy loss in system. 0 = lossless system'
                )}
                color="#f59e0b"
              />

              <ParameterSlider
                label={t('Başlangıç Pozisyonu', 'Initial Position')}
                value={initialPosition}
                min={-1.5}
                max={1.5}
                step={0.1}
                unit="m"
                onChange={handleInitialPositionChange}
                description={t(
                  'İlk çekme mesafesi (denge konumundan sapma)',
                  'Initial displacement from equilibrium position'
                )}
                color="#10b981"
              />

              <ParameterSlider
                label={t('Başlangıç Hızı', 'Initial Velocity')}
                value={initialVelocity}
                min={-5.0}
                max={5.0}
                step={0.1}
                unit="m/s"
                onChange={handleInitialVelocityChange}
                description={t(
                  'İlk hız değeri (pozitif = aşağı doğru)',
                  'Initial velocity value (positive = downward)'
                )}
                color="#8b5cf6"
              />
            </View>
          </View>

          {/* Sistem Bilgileri - mobil için kompakt */}
          <View style={[styles.infoContainer, isMobile && styles.mobileInfoContainer]}>
            <View style={styles.infoCard}>
              <View style={[styles.infoRow, isMobile && styles.mobileInfoRow]}>
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <View
                      style={[styles.colorDot, { backgroundColor: '#3b82f6' }]}
                    />
                    <View style={styles.infoTextContainer}>
                      <Text style={[styles.infoValueText, isMobile && styles.mobileInfoText]}>
                        {t('Zaman:', 'Time:')} {currentState.time.toFixed(2)} s
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <View
                      style={[styles.colorDot, { backgroundColor: '#ef4444' }]}
                    />
                    <View style={styles.infoTextContainer}>
                      <Text style={[styles.infoValueText, isMobile && styles.mobileInfoText]}>
                        {t('Pozisyon:', 'Position:')}{' '}
                        {currentState.position.toFixed(3)} m
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={[styles.infoRow, isMobile && styles.mobileInfoRow]}>
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <View
                      style={[styles.colorDot, { backgroundColor: '#10b981' }]}
                    />
                    <View style={styles.infoTextContainer}>
                      <Text style={[styles.infoValueText, isMobile && styles.mobileInfoText]}>
                        {t('Hız:', 'Velocity:')}{' '}
                        {currentState.velocity.toFixed(3)} m/s
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <View
                      style={[styles.colorDot, { backgroundColor: '#f59e0b' }]}
                    />
                    <View style={styles.infoTextContainer}>
                      <Text style={[styles.infoValueText, isMobile && styles.mobileInfoText]}>
                        {t('İvme:', 'Acceleration:')}{' '}
                        {currentState.acceleration.toFixed(3)} m/s²
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={[styles.energyRow, isMobile && styles.mobileEnergyRow]}>
                <View style={styles.energyItem}>
                  <Text style={[styles.energyLabel, isMobile && styles.mobileEnergyLabel]}>
                    {t('Kinetik Enerji', 'Kinetic Energy')}
                  </Text>
                  <Text style={[styles.energyValue, isMobile && styles.mobileEnergyValue]}>
                    {currentState.energy.kinetic.toFixed(3)} J
                  </Text>
                </View>
                <View style={styles.energyItem}>
                  <Text style={[styles.energyLabel, isMobile && styles.mobileEnergyLabel]}>
                    {t('Potansiyel Enerji', 'Potential Energy')}
                  </Text>
                  <Text style={[styles.energyValue, isMobile && styles.mobileEnergyValue]}>
                    {currentState.energy.potential.toFixed(3)} J
                  </Text>
                </View>
                <View style={styles.energyItem}>
                  <Text style={[styles.energyLabel, isMobile && styles.mobileEnergyLabel]}>
                    {t('Toplam Enerji', 'Total Energy')}
                  </Text>
                  <Text style={[styles.energyValue, isMobile && styles.mobileEnergyValue]}>
                    {currentState.energy.total.toFixed(3)} J
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
    backgroundColor: '#f8fafc',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  simulationContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parametersContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mobileParametersContainer: {
    padding: 16,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileInfoContainer: {
    padding: 12,
  },
  infoCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mobileInfoRow: {
    marginBottom: 6,
  },
  infoItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoValueText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  mobileInfoText: {
    fontSize: 12,
  },
  energyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  mobileEnergyRow: {
    marginTop: 6,
    paddingTop: 6,
  },
  energyItem: {
    flex: 1,
    alignItems: 'center',
  },
  energyLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    textAlign: 'center',
  },
  mobileEnergyLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  energyValue: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '600',
    textAlign: 'center',
  },
  mobileEnergyValue: {
    fontSize: 12,
  },
  parametersHeader: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  parametersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  mobileParametersTitle: {
    fontSize: 16,
  },
  parametersContent: {
    marginBottom: 10,
  },
});
