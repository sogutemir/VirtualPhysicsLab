import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  showTrail: boolean;
  onToggleTrail: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  showTrail,
  onToggleTrail,
  showGrid,
  onToggleGrid,
  speed,
  onSpeedChange,
}) => {
  const { t } = useLanguage();
  const speedOptions = [0.25, 0.5, 1, 2, 4];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('Simülasyon Kontrolleri', 'Simulation Controls')}
      </Text>

      <View style={styles.controlsWrapper}>
        {/* Play/Pause Button */}
        <TouchableOpacity
          onPress={onPlayPause}
          style={[styles.controlButton, isPlaying && styles.pauseButton]}
        >
          <Text style={styles.buttonText}>
            {isPlaying
              ? t('⏸️ Durdur', '⏸️ Pause')
              : t('▶️ Başlat', '▶️ Start')}
          </Text>
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity onPress={onReset} style={styles.resetButton}>
          <Text style={styles.buttonText}>{t('🔄 Sıfırla', '🔄 Reset')}</Text>
        </TouchableOpacity>

        {/* Speed Control */}
        <View style={styles.speedContainer}>
          <Text style={styles.speedLabel}>{t('Hız:', 'Speed:')}</Text>
          <View style={styles.speedButtons}>
            {speedOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => onSpeedChange(option)}
                style={[
                  styles.speedButton,
                  speed === option && styles.speedButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.speedButtonText,
                    speed === option && styles.speedButtonTextActive,
                  ]}
                >
                  {option}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trail Toggle */}
        <TouchableOpacity
          onPress={onToggleTrail}
          style={[styles.toggleButton, showTrail && styles.toggleButtonActive]}
        >
          <Text
            style={[styles.toggleText, showTrail && styles.toggleTextActive]}
          >
            {t('Hareket İzi', 'Motion Trail')}
          </Text>
        </TouchableOpacity>

        {/* Grid Toggle */}
        <TouchableOpacity
          onPress={onToggleGrid}
          style={[styles.toggleButton, showGrid && styles.toggleButtonActive]}
        >
          <Text
            style={[styles.toggleText, showGrid && styles.toggleTextActive]}
          >
            {t('Izgara', 'Grid')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 16,
    textAlign: 'center',
  },
  controlsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pauseButton: {
    backgroundColor: '#ef4444',
  },
  resetButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  speedContainer: {
    alignItems: 'center',
  },
  speedLabel: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  speedButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  speedButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  speedButtonActive: {
    backgroundColor: '#3b82f6',
  },
  speedButtonText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  speedButtonTextActive: {
    color: 'white',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  toggleButtonActive: {
    backgroundColor: '#3b82f6',
  },
  toggleText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: 'white',
  },
});
