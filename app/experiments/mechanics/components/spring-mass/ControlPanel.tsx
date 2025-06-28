import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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
  
  // Mobil optimizasyonu
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 600;
  
  // Mobil ve web için aynı görünen hızlar ama farklı etkiler
  const speedLabels = [0.25, 0.5, 1, 2, 4]; // Her iki platformda da aynı görünüm
  
  // Gerçek hız değerleri (platform bazında)
  const getActualSpeed = (labelSpeed: number) => {
    if (isMobile) {
      // Mobilde gerçek hızlar çok daha yüksek (gizli boost)
      switch(labelSpeed) {
        case 0.25: return 2;    // 0.25x görünüyor → 2x çalışıyor
        case 0.5: return 4;     // 0.5x görünüyor → 4x çalışıyor  
        case 1: return 8;       // 1x görünüyor → 8x çalışıyor (varsayılan)
        case 2: return 16;      // 2x görünüyor → 16x çalışıyor
        case 4: return 32;      // 4x görünüyor → 32x çalışıyor
        default: return labelSpeed * 8;
      }
    }
    return labelSpeed; // Web için gerçek hızlar
  };

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
            {speedLabels.map((labelSpeed) => {
              const actualSpeed = getActualSpeed(labelSpeed);
              return (
                <TouchableOpacity
                  key={labelSpeed}
                  onPress={() => onSpeedChange(actualSpeed)}
                  style={[
                    styles.speedButton,
                    speed === actualSpeed && styles.speedButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.speedButtonText,
                      speed === actualSpeed && styles.speedButtonTextActive,
                    ]}
                  >
                    {labelSpeed}x
                  </Text>
                </TouchableOpacity>
              );
            })}
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
