import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  useMemo,
} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import SimulationCanvas from './components/momentum-bullet/SimulationCanvas';
import ControlPanel from './components/momentum-bullet/ControlPanel';
import ProjectileSettings from './components/momentum-bullet/ProjectileSettings';
import { useSimulation } from './utils/momentum-bullet/useSimulation';
import { useLanguage } from '../../../components/LanguageContext';
import { CollisionMode } from './utils/momentum-bullet/physics';

// Memoized Info Section Component
const InfoSection = memo<{
  t: (tr: string, en: string) => string;
}>(({ t }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoTitle}>
      {t('Deney Bilgileri', 'Experiment Information')}
    </Text>
    <Text style={styles.infoText}>
      {t(
        'Bu deneyde merminin hedefe çarpması ve penetrasyon özellikleri gözlemlenmektedir. Mermi kütlesi ve hızı arttıkça delme olasılığı artar. Kutu sertliği ve kalınlığı arttıkça delme olasılığı azalır. Farklı parametrelerle denemeler yaparak sonuçları gözlemleyin.',
        'In this experiment, the collision and penetration properties of the bullet hitting the target are observed. As the bullet mass and velocity increase, the probability of penetration increases. As the box hardness and thickness increase, the probability of penetration decreases. Try different parameters and observe the results.'
      )}
    </Text>
  </View>
));

// Memoized Section Container Component
const SectionContainer = memo<{
  title: string;
  children: React.ReactNode;
}>(({ title, children }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
));

const MomentumBulletExperiment = memo(() => {
  const { t } = useLanguage();
  const isWeb = Platform.OS === 'web';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Memoized canvas dimensions
  const canvasDimensions = useMemo(
    () => ({
      canvasWidth: isWeb ? Math.min(screenWidth - 40, 800) : screenWidth - 40,
      canvasHeight: isWeb ? 500 : Math.min(screenHeight * 0.4, 400),
    }),
    [isWeb, screenWidth, screenHeight]
  );

  // Simülasyon hook'unu kullan
  const simulation = useSimulation({
    width: canvasDimensions.canvasWidth,
    height: canvasDimensions.canvasHeight,
    timeScale: 1.0,
    wallElasticity: 0.8,
  });

  // Memoized collision mode
  const collisionMode = useMemo(
    () => simulation.targetBox.mode || CollisionMode.BULLET,
    [simulation.targetBox.mode]
  );

  // Memoized callbacks
  const handleToggleSimulation = useCallback(() => {
    simulation.isRunning
      ? simulation.pauseSimulation()
      : simulation.startSimulation();
  }, [
    simulation.isRunning,
    simulation.pauseSimulation,
    simulation.startSimulation,
  ]);

  const handleReset = useCallback(() => {
    simulation.resetSimulation();
  }, [simulation.resetSimulation]);

  return (
    <ExperimentLayout
      title="Mermi-Kutu Çarpışma Deneyi"
      titleEn="Bullet-Box Collision Experiment"
      description={`🎯 Mermi-kutu çarpışma deneyi, momentum korunumu ve çarpışma mekaniğini inceleyen ileri seviye fizik deneyidir.

📚 TEORİ VE FORMÜLLER:

⚡ Momentum Korunumu:
• Çarpışma öncesi: p₁ = m₁v₁ + m₂v₂
• Çarpışma sonrası: p₂ = m₁v₁' + m₂v₂'
• Korunum yasası: p₁ = p₂

🔄 Çarpışma Türleri:
• Elastik çarpışma: Ek₁ = Ek₂ (enerji korunur)
• İnelastik çarpışma: Ek₁ > Ek₂ (enerji kaybı)
• Tam inelastik: Cisimler birleşir (v₁' = v₂')

⚖️ Penetrasyon Analizi:
• Kinetik enerji: Ek = ½mv²
• Penetrasyon derinliği: d ∝ Ek/F_direnc
• Direnç kuvveti: F = σ × A × sertlik

🔋 Enerji Dönüşümü:
• Başlangıç enerjisi: E₀ = ½mv₀²
• Penetrasyon işi: W = F_ortalama × d
• Isı enerjisi: Q = E₀ - E_son

💡 Çarpışma Parametreleri:
• İmpuls: J = ∫F dt = Δp
• Çarpışma süresi: Δt ~ ms cinsinden
• Ortalama kuvvet: F_ort = Δp/Δt

🎮 Parametre Aralıkları:
- Mermi Kütlesi: 1 - 50 gram
- Mermi Hızı: 50 - 800 m/s
- Kutu Kütlesi: 100 - 2000 gram
- Kutu Sertliği: Yumuşak - Çok Sert
- Kutu Kalınlığı: 1 - 10 cm

🔬 Gözlemlenebilir Durumlar:
• Elastik geri sekme
• Penetrasyon ve delme
• Momentum aktarımı
• Enerji dağılımı
• Hız değişimleri

💻 Fiziksel Modelleme:
Gerçekçi çarpışma fiziği simülasyonu. Mermi penetrasyonu, kutu hareketi ve enerji transferi hesaplamaları içerir.`}
      descriptionEn={`🎯 The bullet-box collision experiment studies momentum conservation and collision mechanics in advanced physics.

📚 THEORY AND FORMULAS:

⚡ Momentum Conservation:
• Before collision: p₁ = m₁v₁ + m₂v₂
• After collision: p₂ = m₁v₁' + m₂v₂'
• Conservation law: p₁ = p₂

🔄 Collision Types:
• Elastic collision: Ek₁ = Ek₂ (energy conserved)
• Inelastic collision: Ek₁ > Ek₂ (energy loss)
• Perfectly inelastic: Objects stick together (v₁' = v₂')

⚖️ Penetration Analysis:
• Kinetic energy: Ek = ½mv²
• Penetration depth: d ∝ Ek/F_resistance
• Resistance force: F = σ × A × hardness

🔋 Energy Transformation:
• Initial energy: E₀ = ½mv₀²
• Penetration work: W = F_average × d
• Heat energy: Q = E₀ - E_final

💡 Collision Parameters:
• Impulse: J = ∫F dt = Δp
• Collision time: Δt ~ milliseconds
• Average force: F_avg = Δp/Δt

🎮 Parameter Ranges:
- Bullet Mass: 1 - 50 grams
- Bullet Velocity: 50 - 800 m/s
- Box Mass: 100 - 2000 grams
- Box Hardness: Soft - Very Hard
- Box Thickness: 1 - 10 cm

🔬 Observable Phenomena:
• Elastic bounce
• Penetration and perforation
• Momentum transfer
• Energy distribution
• Velocity changes

💻 Physical Modeling:
Realistic collision physics simulation. Includes bullet penetration, box motion, and energy transfer calculations.`}
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      isRunning={simulation.isRunning}
      onToggleSimulation={handleToggleSimulation}
      onReset={handleReset}
    >
      <ScrollView style={styles.container}>
        <View style={styles.canvasContainer}>
          <SimulationCanvas
            width={canvasDimensions.canvasWidth}
            height={canvasDimensions.canvasHeight}
            projectiles={simulation.projectiles}
            targetBox={simulation.targetBox}
            isRunning={simulation.isRunning}
            collisionData={simulation.collisionData}
          />
        </View>

        <View style={styles.controlsContainer}>
          <SectionContainer
            title={t('Simülasyon Kontrolü', 'Simulation Controls')}
          >
            <ControlPanel
              isRunning={simulation.isRunning}
              timeScale={simulation.timeScale}
              wallElasticity={simulation.wallElasticity}
              projectilesCount={simulation.projectiles.length}
              collisionMode={collisionMode}
              onTimeScaleChange={simulation.setTimeScale}
              onWallElasticityChange={simulation.setWallElasticity}
              onModeChange={simulation.setCollisionMode}
              onStart={simulation.startSimulation}
              onPause={simulation.pauseSimulation}
              onReset={simulation.resetSimulation}
              onClear={simulation.clearProjectiles}
            />
          </SectionContainer>

          <SectionContainer title={t('Deney Ayarları', 'Experiment Settings')}>
            <ProjectileSettings
              canvasWidth={canvasDimensions.canvasWidth}
              canvasHeight={canvasDimensions.canvasHeight}
              onAddProjectile={simulation.addProjectile}
              onUpdateTargetBox={simulation.updateTargetBox}
              targetBox={simulation.targetBox}
              disabled={simulation.isRunning}
            />
          </SectionContainer>

          <InfoSection t={t} />
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  controlsContainer: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 24,
    backgroundColor: '#EBF5FF', // Açık mavi arka plan
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6', // Mavi vurgu çizgisi
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1E40AF', // Koyu mavi başlık
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3B4252', // Koyu gri metin
  },
});

export default MomentumBulletExperiment;
