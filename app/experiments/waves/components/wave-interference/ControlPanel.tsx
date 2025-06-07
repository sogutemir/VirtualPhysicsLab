import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { CustomSlider } from '../../../../../components/ui/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { WaveSource } from '../../utils/waveCalculations';

interface ControlPanelProps {
  sources: [WaveSource, WaveSource];
  waveSpeed: number;
  damping: number;
  animationSpeed: number;
  isPlaying: boolean;
  viewMode: 'heatmap' | 'contour' | 'vector';
  onSourceChange: (
    sourceIndex: 0 | 1,
    property: keyof WaveSource,
    value: number | boolean
  ) => void;
  onWaveSpeedChange: (speed: number) => void;
  onDampingChange: (damping: number) => void;
  onAnimationSpeedChange: (speed: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
  onViewModeChange: (mode: 'heatmap' | 'contour' | 'vector') => void;
}

// Memoized SliderControl component
const SliderControl = memo<{
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  disabled?: boolean;
  unit?: string;
}>(
  ({
    label,
    value,
    onValueChange,
    minimumValue,
    maximumValue,
    step = 0.1,
    disabled = false,
    unit = '',
  }) => (
    <View style={styles.sliderContainer}>
      <Text style={[styles.sliderLabel, disabled && styles.disabledText]}>
        {label}: {value.toFixed(1)}
        {unit}
      </Text>
      <CustomSlider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        min={minimumValue}
        max={maximumValue}
        step={step}
        disabled={disabled}
        minimumTrackTintColor="#3b82f6"
        maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
        thumbTintColor="#ffffff"
      />
    </View>
  )
);

// Memoized ControlCard component
const ControlCard = memo<{
  title: string;
  children: React.ReactNode;
  style?: any;
}>(({ title, children, style }) => (
  <View style={[styles.card, style]}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
));

const ControlPanel: React.FC<ControlPanelProps> = memo(
  ({
    sources,
    waveSpeed,
    damping,
    animationSpeed,
    isPlaying,
    viewMode,
    onSourceChange,
    onWaveSpeedChange,
    onDampingChange,
    onAnimationSpeedChange,
    onPlayPause,
    onReset,
    onViewModeChange,
  }) => {
    const { t } = useLanguage();

    // Memoized callback functions
    const handleSource1FrequencyChange = useCallback(
      (value: number) => {
        onSourceChange(0, 'frequency', value);
      },
      [onSourceChange]
    );

    const handleSource1AmplitudeChange = useCallback(
      (value: number) => {
        onSourceChange(0, 'amplitude', value);
      },
      [onSourceChange]
    );

    const handleSource1PhaseChange = useCallback(
      (value: number) => {
        onSourceChange(0, 'phase', (value * Math.PI) / 180);
      },
      [onSourceChange]
    );

    const handleSource2FrequencyChange = useCallback(
      (value: number) => {
        onSourceChange(1, 'frequency', value);
      },
      [onSourceChange]
    );

    const handleSource2AmplitudeChange = useCallback(
      (value: number) => {
        onSourceChange(1, 'amplitude', value);
      },
      [onSourceChange]
    );

    const handleSource2PhaseChange = useCallback(
      (value: number) => {
        onSourceChange(1, 'phase', (value * Math.PI) / 180);
      },
      [onSourceChange]
    );

    const handleSource1ActiveChange = useCallback(
      (value: boolean) => {
        onSourceChange(0, 'active', value);
      },
      [onSourceChange]
    );

    const handleSource2ActiveChange = useCallback(
      (value: boolean) => {
        onSourceChange(1, 'active', value);
      },
      [onSourceChange]
    );

    const handleHeatmapView = useCallback(() => {
      onViewModeChange('heatmap');
    }, [onViewModeChange]);

    const handleContourView = useCallback(() => {
      onViewModeChange('contour');
    }, [onViewModeChange]);

    const handleVectorView = useCallback(() => {
      onViewModeChange('vector');
    }, [onViewModeChange]);

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Animation Controls */}
        <ControlCard title={t('⚙️ Animasyon Kontrolü', '⚙️ Animation Control')}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                isPlaying ? styles.pauseButton : styles.playButton,
              ]}
              onPress={onPlayPause}
            >
              <Text style={styles.buttonText}>
                {isPlaying
                  ? `⏸️ ${t('Durdur', 'Pause')}`
                  : `▶️ ${t('Başlat', 'Start')}`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={onReset}
            >
              <Text style={styles.buttonText}>🔄 {t('Sıfırla', 'Reset')}</Text>
            </TouchableOpacity>
          </View>

          <SliderControl
            label={t('Animasyon Hızı', 'Animation Speed')}
            value={animationSpeed}
            onValueChange={onAnimationSpeedChange}
            minimumValue={0.1}
            maximumValue={3}
            step={0.1}
            unit="x"
          />
        </ControlCard>

        {/* Source 1 Controls */}
        <ControlCard
          title={t('🔴 Dalga Kaynağı 1', '🔴 Wave Source 1')}
          style={styles.source1Card}
        >
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{t('Aktif', 'Active')}</Text>
            <Switch
              value={sources[0].active}
              onValueChange={handleSource1ActiveChange}
              trackColor={{ false: '#767577', true: '#ff4444' }}
              thumbColor={sources[0].active ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <SliderControl
            label={t('Frekans', 'Frequency')}
            value={sources[0].frequency}
            onValueChange={handleSource1FrequencyChange}
            minimumValue={0.5}
            maximumValue={5}
            step={0.1}
            disabled={!sources[0].active}
            unit=" Hz"
          />

          <SliderControl
            label={t('Genlik', 'Amplitude')}
            value={sources[0].amplitude}
            onValueChange={handleSource1AmplitudeChange}
            minimumValue={0.1}
            maximumValue={2}
            step={0.1}
            disabled={!sources[0].active}
          />

          <SliderControl
            label={t('Faz', 'Phase')}
            value={(sources[0].phase * 180) / Math.PI}
            onValueChange={handleSource1PhaseChange}
            minimumValue={0}
            maximumValue={360}
            step={15}
            disabled={!sources[0].active}
            unit="°"
          />
        </ControlCard>

        {/* Source 2 Controls */}
        <ControlCard
          title={t('🔵 Dalga Kaynağı 2', '🔵 Wave Source 2')}
          style={styles.source2Card}
        >
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{t('Aktif', 'Active')}</Text>
            <Switch
              value={sources[1].active}
              onValueChange={handleSource2ActiveChange}
              trackColor={{ false: '#767577', true: '#4488ff' }}
              thumbColor={sources[1].active ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <SliderControl
            label={t('Frekans', 'Frequency')}
            value={sources[1].frequency}
            onValueChange={handleSource2FrequencyChange}
            minimumValue={0.5}
            maximumValue={5}
            step={0.1}
            disabled={!sources[1].active}
            unit=" Hz"
          />

          <SliderControl
            label={t('Genlik', 'Amplitude')}
            value={sources[1].amplitude}
            onValueChange={handleSource2AmplitudeChange}
            minimumValue={0.1}
            maximumValue={2}
            step={0.1}
            disabled={!sources[1].active}
          />

          <SliderControl
            label={t('Faz', 'Phase')}
            value={(sources[1].phase * 180) / Math.PI}
            onValueChange={handleSource2PhaseChange}
            minimumValue={0}
            maximumValue={360}
            step={15}
            disabled={!sources[1].active}
            unit="°"
          />
        </ControlCard>

        {/* System Settings */}
        <ControlCard title={t('🌊 Genel Ayarlar', '🌊 System Settings')}>
          <SliderControl
            label={t('Dalga Hızı', 'Wave Speed')}
            value={waveSpeed}
            onValueChange={onWaveSpeedChange}
            minimumValue={0.5}
            maximumValue={3}
            step={0.1}
            unit=" m/s"
          />

          <SliderControl
            label={t('Sönümleme', 'Damping')}
            value={damping}
            onValueChange={onDampingChange}
            minimumValue={0.001}
            maximumValue={0.1}
            step={0.001}
          />

          <View style={styles.viewModeContainer}>
            <Text style={styles.viewModeLabel}>
              {t('Görünüm Modu', 'View Mode')}
            </Text>
            <View style={styles.viewModeButtons}>
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  viewMode === 'heatmap' && styles.activeViewMode,
                ]}
                onPress={handleHeatmapView}
              >
                <Text
                  style={[
                    styles.viewModeButtonText,
                    viewMode === 'heatmap' && styles.activeViewModeText,
                  ]}
                >
                  {t('Renk', 'Heat')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  viewMode === 'contour' && styles.activeViewMode,
                ]}
                onPress={handleContourView}
              >
                <Text
                  style={[
                    styles.viewModeButtonText,
                    viewMode === 'contour' && styles.activeViewModeText,
                  ]}
                >
                  {t('Kontur', 'Contour')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  viewMode === 'vector' && styles.activeViewMode,
                ]}
                onPress={handleVectorView}
              >
                <Text
                  style={[
                    styles.viewModeButtonText,
                    viewMode === 'vector' && styles.activeViewModeText,
                  ]}
                >
                  {t('Vektör', 'Vector')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ControlCard>
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  source1Card: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  source2Card: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#22c55e',
  },
  pauseButton: {
    backgroundColor: '#ef4444',
  },
  resetButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#e2e8f0',
    marginBottom: 8,
  },
  disabledText: {
    color: '#64748b',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#3b82f6',
    width: 20,
    height: 20,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  viewModeContainer: {
    marginTop: 8,
  },
  viewModeLabel: {
    fontSize: 14,
    color: '#e2e8f0',
    marginBottom: 12,
  },
  viewModeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.5)',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    alignItems: 'center',
  },
  activeViewMode: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  viewModeButtonText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  activeViewModeText: {
    color: '#ffffff',
  },
});

export default ControlPanel;
