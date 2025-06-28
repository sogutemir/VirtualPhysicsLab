import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useLanguage } from '../../../components/LanguageContext';
import ExperimentLayout from '../../../components/ExperimentLayout';
import WaveSimulation from './components/wave-interference/WaveSimulation';
import ControlPanel from './components/wave-interference/ControlPanel';
import InfoCards from './components/wave-interference/InfoCards';
import PresetScenarios from './components/wave-interference/PresetScenarios';
import { WaveSource } from './utils/waveCalculations';
import { presetScenarios, Scenario } from './utils/presetScenarios';

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = isWeb || screenWidth > 768;

// Memoized Tab Button Component
const TabButton = memo<{
  tab: 'controls' | 'scenarios' | 'info';
  label: string;
  icon: string;
  activeTab: string;
  onPress: (tab: 'controls' | 'scenarios' | 'info') => void;
}>(({ tab, label, icon, activeTab, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
    onPress={() => onPress(tab)}
  >
    <Text style={[styles.tabIcon, activeTab === tab && styles.activeTabIcon]}>
      {icon}
    </Text>
    <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
));

// Memoized Status Card Component
const StatusCard = memo<{
  title: string;
  data: Array<{ label: string; value: string }>;
  cardStyle?: any;
}>(({ title, data, cardStyle }) => (
  <View style={[styles.statusCard, cardStyle]}>
    <Text style={styles.statusCardTitle}>{title}</Text>
    <View style={styles.statusDetails}>
      {data.map((item, index) => (
        <Text key={index} style={styles.statusText}>
          {item.label}: {item.value}
        </Text>
      ))}
    </View>
  </View>
));

const WaveInterferenceExperiment: React.FC = memo(() => {
  const { t } = useLanguage();

  // Tab state for mobile navigation
  const [activeTab, setActiveTab] = useState<'controls' | 'scenarios' | 'info'>(
    'controls'
  );

  // Wave sources state
  const [sources, setSources] = useState<[WaveSource, WaveSource]>([
    { x: 30, y: 50, frequency: 1.5, amplitude: 1, active: true, phase: 0 },
    { x: 70, y: 50, frequency: 1.5, amplitude: 1, active: true, phase: 0 },
  ]);

  // Simulation parameters
  const [waveSpeed, setWaveSpeed] = useState(1);
  const [damping, setDamping] = useState(0.02);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const [currentScenario, setCurrentScenario] = useState<string | null>(
    'basic-interference'
  );

  // Load default scenario on start
  useEffect(() => {
    const defaultScenario = presetScenarios.find(
      (s) => s.id === 'basic-interference'
    );
    if (defaultScenario) {
      applyScenario(defaultScenario);
    }
  }, []);

  // Memoized callbacks
  const handleSourceChange = useCallback(
    (
      sourceIndex: 0 | 1,
      property: keyof WaveSource,
      value: number | boolean
    ) => {
      setSources((prev) => {
        const newSources = [...prev] as [WaveSource, WaveSource];
        newSources[sourceIndex] = {
          ...newSources[sourceIndex],
          [property]: value,
        };
        return newSources;
      });

      // Reset current scenario when manual changes are made
      setCurrentScenario(null);
    },
    []
  );

  const handleSourceMove = useCallback(
    (sourceIndex: 0 | 1, x: number, y: number) => {
      setSources((prev) => {
        const newSources = [...prev] as [WaveSource, WaveSource];
        newSources[sourceIndex] = { ...newSources[sourceIndex], x, y };
        return newSources;
      });

      // Reset current scenario when sources are moved
      setCurrentScenario(null);
    },
    []
  );

  const applyScenario = useCallback((scenario: Scenario) => {
    setSources([...scenario.sources]);
    setWaveSpeed(scenario.waveSpeed);
    setDamping(scenario.damping);
    setCurrentScenario(scenario.id);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    const defaultScenario = presetScenarios.find(
      (s) => s.id === 'basic-interference'
    );
    if (defaultScenario) {
      applyScenario(defaultScenario);
    }
    setIsPlaying(true);
    setAnimationSpeed(1);
  }, [applyScenario]);

  const handleWaveSpeedChange = useCallback((speed: number) => {
    setWaveSpeed(speed);
    setCurrentScenario(null);
  }, []);

  const handleDampingChange = useCallback((damping: number) => {
    setDamping(damping);
    setCurrentScenario(null);
  }, []);

  const handleAnimationSpeedChange = useCallback((speed: number) => {
    setAnimationSpeed(speed);
  }, []);

  const handleTabChange = useCallback(
    (tab: 'controls' | 'scenarios' | 'info') => {
      setActiveTab(tab);
    },
    []
  );

  // Memoized calculations
  const sourceDistance = useMemo(() => {
    const dx = sources[1].x - sources[0].x;
    const dy = sources[1].y - sources[0].y;
    return Math.sqrt(dx * dx + dy * dy).toFixed(1);
  }, [sources]);

  const statusData = useMemo(
    () => ({
      source1: [
        {
          label: t('Konum:', 'Position:'),
          value: `(${sources[0].x.toFixed(0)}, ${sources[0].y.toFixed(0)})`,
        },
        {
          label: t('Frekans:', 'Frequency:'),
          value: `${sources[0].frequency.toFixed(1)} Hz`,
        },
        {
          label: t('Genlik:', 'Amplitude:'),
          value: sources[0].amplitude.toFixed(1),
        },
        {
          label: t('Durum:', 'Status:'),
          value: sources[0].active ? '✅ Aktif' : '❌ Pasif',
        },
      ],
      source2: [
        {
          label: t('Konum:', 'Position:'),
          value: `(${sources[1].x.toFixed(0)}, ${sources[1].y.toFixed(0)})`,
        },
        {
          label: t('Frekans:', 'Frequency:'),
          value: `${sources[1].frequency.toFixed(1)} Hz`,
        },
        {
          label: t('Genlik:', 'Amplitude:'),
          value: sources[1].amplitude.toFixed(1),
        },
        {
          label: t('Durum:', 'Status:'),
          value: sources[1].active ? '✅ Aktif' : '❌ Pasif',
        },
      ],
      system: [
        {
          label: t('Mesafe:', 'Distance:'),
          value: `${sourceDistance} ${t('birim', 'units')}`,
        },
        { label: t('Dalga Hızı:', 'Wave Speed:'), value: `${waveSpeed} m/s` },
        { label: t('Sönümleme:', 'Damping:'), value: damping.toFixed(3) },
        {
          label: t('Durum:', 'Status:'),
          value: isPlaying ? '▶️ Çalışıyor' : '⏸️ Duraklatıldı',
        },
      ],
    }),
    [sources, sourceDistance, waveSpeed, damping, isPlaying, t]
  );

  // Memoized view mode text
  const viewModeText = useMemo(() => {
    return t('Dairesel Dalga', 'Circular Waves');
  }, [t]);

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'controls':
        return (
          <ControlPanel
            sources={sources}
            waveSpeed={waveSpeed}
            damping={damping}
            animationSpeed={animationSpeed}
            isPlaying={isPlaying}
            onSourceChange={handleSourceChange}
            onWaveSpeedChange={handleWaveSpeedChange}
            onDampingChange={handleDampingChange}
            onAnimationSpeedChange={handleAnimationSpeedChange}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
          />
        );
      case 'scenarios':
        return (
          <PresetScenarios
            currentScenario={currentScenario}
            onScenarioSelect={applyScenario}
          />
        );
      case 'info':
        return <InfoCards />;
      default:
        return null;
    }
  }, [
    activeTab,
    sources,
    waveSpeed,
    damping,
    animationSpeed,
    isPlaying,
    currentScenario,
    handleSourceChange,
    handleWaveSpeedChange,
    handleDampingChange,
    handleAnimationSpeedChange,
    handlePlayPause,
    handleReset,
    applyScenario,
  ]);

  return (
    <ExperimentLayout
      title="Dalga Girişimi"
      titleEn="Wave Interference"
      difficulty="Orta"
      difficultyEn="Intermediate"
      description="İki dalga kaynağının girişim desenlerini keşfedin. Yapıcı ve yıkıcı girişim, faz farkları ve süperpozisyon ilkesini görselleştirin."
      descriptionEn="Explore interference patterns of two wave sources. Visualize constructive and destructive interference, phase differences and superposition principle."
      isRunning={isPlaying}
      onToggleSimulation={handlePlayPause}
      onReset={handleReset}
      hideControls={false}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Status Information - Sadece masaüstünde göster */}
        {isLargeScreen && (
          <View style={styles.statusContainer}>
            <View style={styles.statusGrid}>
              <StatusCard
                title={`🔴 ${t('Kaynak 1', 'Source 1')}`}
                data={statusData.source1}
                cardStyle={styles.source1Card}
              />
              <StatusCard
                title={`🔵 ${t('Kaynak 2', 'Source 2')}`}
                data={statusData.source2}
                cardStyle={styles.source2Card}
              />
              <StatusCard
                title={`🌊 ${t('Sistem', 'System')}`}
                data={statusData.system}
                cardStyle={styles.systemCard}
              />
            </View>
          </View>
        )}

        {/* Main Layout */}
        <View style={styles.mainLayout}>
          {/* Simulation Area - Her zaman üstte */}
          <View style={styles.simulationSection}>
            {/* Compact Mobile Header */}
            {!isLargeScreen && (
              <View style={styles.mobileSimulationHeader}>
                <Text style={styles.mobileSimulationTitle}>
                  🌊 {t('Dalga Girişimi', 'Wave Interference')}
                </Text>
                <Text style={styles.mobileSimulationStatus}>
                  {isPlaying ? '▶️ Çalışıyor' : '⏸️ Duraklatıldı'} •{' '}
                  {viewModeText}
                </Text>
              </View>
            )}

            {/* Desktop Header */}
            {isLargeScreen && (
              <View style={styles.simulationHeader}>
                <Text style={styles.simulationTitle}>
                  🌊{' '}
                  {t(
                    'Dalga Girişimi Simülasyonu',
                    'Wave Interference Simulation'
                  )}
                </Text>
                <Text style={styles.simulationSubtitle}>
                  {t(
                    'Güzel Dairesel Dalga Görünümü',
                    'Beautiful Circular Wave View'
                  )}
                </Text>
              </View>
            )}

            <WaveSimulation
              sources={sources}
              waveSpeed={waveSpeed}
              damping={damping}
              isPlaying={isPlaying}
              animationSpeed={animationSpeed}
              onSourceMove={handleSourceMove}
            />

            <View style={styles.simulationHelp}>
              <Text style={styles.helpText}>
                💡{' '}
                {t(
                  'Dalga kaynaklarını dokunarak sürükleyebilirsiniz',
                  'Touch and drag wave sources to move them'
                )}
              </Text>
            </View>
          </View>

          {/* Controls Panel - Responsive Layout */}
          {isLargeScreen ? (
            // Desktop: Yan tarafta
            <View style={styles.desktopControlsContainer}>
              <View style={styles.desktopPanelsContainer}>
                <ScrollView
                  style={styles.panelsScrollView}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                >
                  <View style={styles.panelWrapper}>
                    <ControlPanel
                      sources={sources}
                      waveSpeed={waveSpeed}
                      damping={damping}
                      animationSpeed={animationSpeed}
                      isPlaying={isPlaying}
                      onSourceChange={handleSourceChange}
                      onWaveSpeedChange={handleWaveSpeedChange}
                      onDampingChange={handleDampingChange}
                      onAnimationSpeedChange={handleAnimationSpeedChange}
                      onPlayPause={handlePlayPause}
                      onReset={handleReset}
                    />
                  </View>

                  <View style={styles.sectionSeparator} />

                  <View style={styles.panelWrapper}>
                    <PresetScenarios
                      currentScenario={currentScenario}
                      onScenarioSelect={applyScenario}
                    />
                  </View>

                  <View style={styles.sectionSeparator} />

                  <View style={styles.panelWrapper}>
                    <InfoCards />
                  </View>
                </ScrollView>
              </View>
            </View>
          ) : (
            // Mobile: Simülasyonun altında
            <View style={styles.mobileControlsContainer}>
              <View style={styles.tabsHeader}>
                <TabButton
                  tab="controls"
                  label={t('Kontrol', 'Controls')}
                  icon="⚙️"
                  activeTab={activeTab}
                  onPress={handleTabChange}
                />
                <TabButton
                  tab="scenarios"
                  label={t('Senaryo', 'Scenarios')}
                  icon="🎯"
                  activeTab={activeTab}
                  onPress={handleTabChange}
                />
                <TabButton
                  tab="info"
                  label={t('Bilgi', 'Info')}
                  icon="📚"
                  activeTab={activeTab}
                  onPress={handleTabChange}
                />
              </View>

              <View style={styles.tabContent}>{renderTabContent()}</View>
            </View>
          )}
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    paddingBottom: isLargeScreen ? 40 : 20,
  },
  statusContainer: {
    margin: 16,
  },
  statusGrid: {
    flexDirection: isLargeScreen ? 'row' : 'column',
    gap: 12,
  },
  statusCard: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    flex: isLargeScreen ? 1 : undefined,
  },
  source1Card: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  source2Card: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  systemCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  statusDetails: {
    gap: 2,
  },
  statusText: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  mainLayout: {
    margin: isLargeScreen ? 16 : 8,
    gap: isLargeScreen ? 16 : 8,
  },
  simulationSection: {
    flex: 1,
  },
  mobileSimulationHeader: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  mobileSimulationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  mobileSimulationStatus: {
    fontSize: 12,
    color: '#94a3b8',
  },
  simulationHeader: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  simulationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  simulationSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  simulationHelp: {
    marginTop: isLargeScreen ? 12 : 8,
    padding: isLargeScreen ? 12 : 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  helpText: {
    fontSize: isLargeScreen ? 12 : 10,
    color: '#10b981',
    textAlign: 'center',
  },
  desktopControlsContainer: {
    flex: 1,
  },
  desktopPanelsContainer: {
    flex: 1,
    maxHeight: 600,
  },
  panelsScrollView: {
    flex: 1,
  },
  panelWrapper: {
    marginBottom: 8,
  },
  sectionSeparator: {
    height: 8,
  },
  mobileControlsContainer: {
    flex: 1,
  },
  tabsHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 8,
    padding: 3,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#3b82f6',
  },
  tabIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  activeTabIcon: {
    // No specific style needed
  },
  tabLabel: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#ffffff',
  },
  tabContent: {
    flex: 1,
  },
});

export default WaveInterferenceExperiment;
