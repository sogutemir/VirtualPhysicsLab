import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { CustomSlider } from '../../../../../components/ui/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { MomentBalanceControlsProps } from './types';

export const MomentBalanceControls: React.FC<MomentBalanceControlsProps> = ({
  state,
  onLeftWeightChange,
  onRightWeightChange,
  onLeftRatioChange,
  onRightRatioChange,
  onReset,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        <View style={styles.controlColumn}>
          <Text style={styles.controlTitle}>
            {t('Sol Ağırlık', 'Left Weight')}
          </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
              {state.leftWeight.toFixed(1)} N
            </Text>
            <CustomSlider
              style={styles.slider}
              min={1}
              max={6}
              step={0.1}
              value={state.leftWeight}
              onValueChange={onLeftWeightChange}
              minimumTrackTintColor="#3498db"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#3498db"
            />
          </View>
        </View>

        <View style={styles.controlColumn}>
          <Text style={styles.controlTitle}>
            {t('Sağ Ağırlık', 'Right Weight')}
          </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
              {state.rightWeight.toFixed(1)} N
            </Text>
            <CustomSlider
              style={styles.slider}
              min={1}
              max={6}
              step={0.1}
              value={state.rightWeight}
              onValueChange={onRightWeightChange}
              minimumTrackTintColor="#e74c3c"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#e74c3c"
            />
          </View>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.controlColumn}>
          <Text style={styles.controlTitle}>
            {t('Sol Uzaklık', 'Left Distance')}
          </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
              {(state.leftRatio * 100).toFixed(0)}%
            </Text>
            <CustomSlider
              style={styles.slider}
              min={0.1}
              max={1}
              step={0.01}
              value={state.leftRatio}
              onValueChange={onLeftRatioChange}
              minimumTrackTintColor="#3498db"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#3498db"
            />
          </View>
        </View>

        <View style={styles.controlColumn}>
          <Text style={styles.controlTitle}>
            {t('Sağ Uzaklık', 'Right Distance')}
          </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
              {(state.rightRatio * 100).toFixed(0)}%
            </Text>
            <CustomSlider
              style={styles.slider}
              min={0.1}
              max={1}
              step={0.01}
              value={state.rightRatio}
              onValueChange={onRightRatioChange}
              minimumTrackTintColor="#e74c3c"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#e74c3c"
            />
          </View>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>
            {t('Sol Moment', 'Left Moment')}:
          </Text>
          <Text style={styles.metricValue}>
            {state.momentLeft.toFixed(2)} N·m
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>
            {t('Sağ Moment', 'Right Moment')}:
          </Text>
          <Text style={styles.metricValue}>
            {state.momentRight.toFixed(2)} N·m
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>
            {t('Net Moment', 'Net Moment')}:
          </Text>
          <Text
            style={[
              styles.metricValue,
              state.momentNet > 0
                ? styles.positiveValue
                : state.momentNet < 0
                ? styles.negativeValue
                : styles.zeroValue,
            ]}
          >
            {state.momentNet.toFixed(2)} N·m
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>{t('Açı', 'Angle')}:</Text>
          <Text style={styles.metricValue}>{state.angle.toFixed(1)}°</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: Platform.OS === 'web' ? 16 : 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  controlColumn: {
    flex: 1,
  },
  controlTitle: {
    fontSize: Platform.OS === 'web' ? 15 : 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 55,
    fontSize: Platform.OS === 'web' ? 14 : 13,
    textAlign: 'center',
    color: '#2c3e50',
    fontWeight: '500',
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metricsContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 2,
  },
  metricLabel: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#64748b',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontWeight: '600',
    color: '#2c3e50',
  },
  positiveValue: {
    color: '#10b981',
  },
  negativeValue: {
    color: '#ef4444',
  },
  zeroValue: {
    color: '#6366f1',
  },
});
