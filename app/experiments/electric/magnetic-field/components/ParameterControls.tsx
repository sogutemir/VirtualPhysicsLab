import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
// React Native uyumlu icon helper
const IconText = ({ children }: { children: string }) => (
  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#6b7280' }}>
    {children}
  </Text>
);
import { CustomSlider } from '../../../../../components/ui/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { FieldType, ChargeType, ParameterControlsProps } from './types';

const ParameterControls: React.FC<ParameterControlsProps> = ({
  title,
  currentIntensity,
  wireDistance,
  coilTurns,
  fieldType,
  showCharges,
  chargeType,
  chargeSpeed,
  onCurrentIntensityChange,
  onWireDistanceChange,
  onCoilTurnsChange,
  onFieldTypeChange,
  onToggleCharges,
  onChargeTypeChange,
  onChargeSpeedChange,
  onReset,
}) => {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentText, setCurrentText] = useState(currentIntensity.toString());
  const [distanceText, setDistanceText] = useState(wireDistance.toString());
  const [coilTurnsText, setCoilTurnsText] = useState(coilTurns.toString());

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCurrentChange = (value: number) => {
    onCurrentIntensityChange(value);
    setCurrentText(value.toString());
  };

  const handleDistanceChange = (value: number) => {
    onWireDistanceChange(value);
    setDistanceText(value.toString());
  };

  const handleCoilTurnsChange = (value: number) => {
    onCoilTurnsChange(value);
    setCoilTurnsText(value.toString());
  };

  const handleCurrentTextChange = (text: string) => {
    setCurrentText(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
      onCurrentIntensityChange(parsed);
    }
  };

  const handleDistanceTextChange = (text: string) => {
    setDistanceText(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 10 && parsed <= 50) {
      onWireDistanceChange(parsed);
    }
  };

  const handleCoilTurnsTextChange = (text: string) => {
    setCoilTurnsText(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 20) {
      onCoilTurnsChange(parsed);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <IconText>🎚️</IconText>
          </View>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <TouchableOpacity
          onPress={toggleExpanded}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconText>{isExpanded ? '🔽' : '▶️'}</IconText>
        </TouchableOpacity>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>
              {t('Akım Şiddeti', 'Current Intensity')}
            </Text>
            <View style={styles.sliderContainer}>
              <CustomSlider
                style={styles.slider}
                min={0}
                max={10}
                step={0.1}
                value={currentIntensity}
                onValueChange={handleCurrentChange}
                minimumTrackTintColor="#6b7280"
                maximumTrackTintColor="#e5e7eb"
              />
              <Text style={styles.value}>{currentIntensity.toFixed(1)} A</Text>
            </View>
          </View>

          {fieldType === 'coil' && (
            <View style={styles.section}>
              <Text style={styles.label}>
                {t('Bobin Sarım Sayısı', 'Coil Turns')}
              </Text>
              <View style={styles.coilControls}>
                <TouchableOpacity
                  style={styles.coilButton}
                  onPress={() =>
                    handleCoilTurnsChange(Math.max(1, coilTurns - 1))
                  }
                >
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#666' }}>−</Text>
                </TouchableOpacity>
                <Text style={styles.coilTurnsText}>{coilTurns}</Text>
                <TouchableOpacity
                  style={styles.coilButton}
                  onPress={() =>
                    handleCoilTurnsChange(Math.min(20, coilTurns + 1))
                  }
                >
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#666' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.label}>
              {t('Tel Mesafesi', 'Wire Distance')}
            </Text>
            <View style={styles.sliderContainer}>
              <CustomSlider
                style={styles.slider}
                min={10}
                max={50}
                step={1}
                value={wireDistance}
                onValueChange={handleDistanceChange}
                minimumTrackTintColor="#6b7280"
                maximumTrackTintColor="#e5e7eb"
              />
              <Text style={styles.value}>{wireDistance} cm</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Yük Simülasyonu', 'Charge Simulation')}
            </Text>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>
                {t('Yükleri Göster', 'Show Charges')}
              </Text>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  showCharges && styles.switchButtonActive,
                ]}
                onPress={onToggleCharges}
              >
                <Text
                  style={[
                    styles.switchText,
                    showCharges && styles.switchTextActive,
                  ]}
                >
                  {showCharges ? t('Açık', 'ON') : t('Kapalı', 'OFF')}
                </Text>
              </TouchableOpacity>
            </View>

            {showCharges && (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>
                    {t('Yük Türü', 'Charge Type')}
                  </Text>
                  <View style={styles.chargeTypeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.chargeTypeButton,
                        chargeType === 'positive' &&
                          styles.chargeTypeButtonActive,
                      ]}
                      onPress={() => onChargeTypeChange('positive')}
                    >
                      <Text
                        style={[
                          styles.chargeTypeText,
                          chargeType === 'positive' &&
                            styles.chargeTypeTextActive,
                        ]}
                      >
                        {t('Pozitif (+)', 'Positive (+)')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.chargeTypeButton,
                        chargeType === 'negative' &&
                          styles.chargeTypeButtonActive,
                      ]}
                      onPress={() => onChargeTypeChange('negative')}
                    >
                      <Text
                        style={[
                          styles.chargeTypeText,
                          chargeType === 'negative' &&
                            styles.chargeTypeTextActive,
                        ]}
                      >
                        {t('Negatif (-)', 'Negative (-)')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.chargeTypeButton,
                        chargeType === 'both' && styles.chargeTypeButtonActive,
                      ]}
                      onPress={() => onChargeTypeChange('both')}
                    >
                      <Text
                        style={[
                          styles.chargeTypeText,
                          chargeType === 'both' && styles.chargeTypeTextActive,
                        ]}
                      >
                        {t('Her İkisi', 'Both')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>
                    {t('Yük Hızı', 'Charge Speed')}
                  </Text>
                  <View style={styles.sliderContainer}>
                    <CustomSlider
                      style={styles.slider}
                      min={1}
                      max={8}
                      step={1}
                      value={chargeSpeed}
                      onValueChange={onChargeSpeedChange}
                      minimumTrackTintColor="#6b7280"
                      maximumTrackTintColor="#e5e7eb"
                    />
                    <Text style={styles.value}>{chargeSpeed}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={onReset}>
            <Text style={styles.resetButtonText}>
              {t('Parametreleri Sıfırla', 'Reset Parameters')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(240, 240, 240, 0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    marginRight: 12,
  },
  value: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'right',
  },
  coilControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  coilButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  coilTurnsText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 50,
    alignItems: 'center',
  },
  switchButtonActive: {
    backgroundColor: '#3b82f6',
  },
  switchText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  switchTextActive: {
    color: 'white',
  },
  chargeTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chargeTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    alignItems: 'center',
  },
  chargeTypeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  chargeTypeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  chargeTypeTextActive: {
    color: 'white',
  },
});

export default ParameterControls;
