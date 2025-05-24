import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Platform, Text } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { SpringMassSystem } from './components/spring-mass/SpringMassSystem';
import { ControlPanel } from './components/spring-mass/ControlPanel';
import { ParameterSlider } from './components/spring-mass/ParameterSlider';
import { SpringMassSystem as SystemState } from './utils/PhysicsEngine';
import { useLanguage } from '../../../components/LanguageContext';

export default function SpringMassExperiment() {
  const { t } = useLanguage();

  // Simülasyon durumu
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrail, setShowTrail] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [speed, setSpeed] = useState(1);

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

  // Event handlers
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

  // Parameter change handlers
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

  const description = t(
    `Gelişmiş Yay-Kütle Sistemi: Bu deneyde basit harmonik hareketin detaylı analizini yapabilirsiniz.
    
    🔧 Özellikler:
    • Gerçek zamanlı fizik simülasyonu (Runge-Kutta 4. derece entegrasyon)
    • İnteraktif yay-kütle sistemi (dokunarak pozisyon ayarlayabilirsiniz)
    • Hareket izi görselleştirmesi
    • Enerji analizi ve kuvvet hesaplamaları
    • Değiştirilebilir fizik parametreleri
    
    📊 Parametreler:
    • Kütle: Sistemin eylemsizliğini belirler
    • Yay Sabiti: Yayın sertliğini ve frekansı etkiler
    • Sönümleme: Sistemdeki enerji kaybını simüle eder
    • Başlangıç Pozisyonu: İlk çekme mesafesi
    • Başlangıç Hızı: İlk hız değeri
    
    🎯 Deneyler:
    • Farklı kütle değerleriyle frekans değişimini gözlemleyin
    • Sönümleme etkisini analiz edin
    • Enerji korunumunu inceleyin`,

    `Advanced Spring-Mass System: Perform detailed analysis of simple harmonic motion.
    
    🔧 Features:
    • Real-time physics simulation (Runge-Kutta 4th order integration)
    • Interactive spring-mass system (touch to set position)
    • Motion trail visualization
    • Energy analysis and force calculations
    • Adjustable physics parameters
    
    📊 Parameters:
    • Mass: Determines system's inertia
    • Spring Constant: Affects spring stiffness and frequency
    • Damping: Simulates energy loss in the system
    • Initial Position: Initial displacement
    • Initial Velocity: Initial velocity value
    
    🎯 Experiments:
    • Observe frequency changes with different masses
    • Analyze damping effects
    • Study energy conservation`
  );

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
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
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
          <View style={styles.parametersContainer}>
            <View style={styles.parametersHeader}>
              <Text style={styles.parametersTitle}>
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

          {/* Sistem Bilgileri */}
          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <View
                      style={[styles.colorDot, { backgroundColor: '#3b82f6' }]}
                    />
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoValueText}>
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
                      <Text style={styles.infoValueText}>
                        {t('Pozisyon:', 'Position:')}{' '}
                        {currentState.position.toFixed(3)} m
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <View
                      style={[styles.colorDot, { backgroundColor: '#10b981' }]}
                    />
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoValueText}>
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
                      <Text style={styles.infoValueText}>
                        {t('İvme:', 'Acceleration:')}{' '}
                        {currentState.acceleration.toFixed(3)} m/s²
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.energyRow}>
                <View style={styles.energyItem}>
                  <Text style={styles.energyLabel}>
                    {t('Kinetik Enerji', 'Kinetic Energy')}
                  </Text>
                  <Text style={styles.energyValue}>
                    {currentState.energy.kinetic.toFixed(3)} J
                  </Text>
                </View>
                <View style={styles.energyItem}>
                  <Text style={styles.energyLabel}>
                    {t('Potansiyel Enerji', 'Potential Energy')}
                  </Text>
                  <Text style={styles.energyValue}>
                    {currentState.energy.potential.toFixed(3)} J
                  </Text>
                </View>
                <View style={styles.energyItem}>
                  <Text style={styles.energyLabel}>
                    {t('Toplam Enerji', 'Total Energy')}
                  </Text>
                  <Text style={styles.energyValue}>
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
    paddingBottom: Platform.OS === 'web' ? 50 : 200,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
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
  energyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  energyItem: {
    flex: 1,
    alignItems: 'center',
  },
  energyLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  energyValue: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '600',
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
  parametersContent: {
    marginBottom: 10,
  },
});
