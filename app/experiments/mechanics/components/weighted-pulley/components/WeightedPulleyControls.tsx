import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { WeightedPulleyControlsProps, INERTIA_OPTIONS } from '../types';
import { CustomSlider } from '../../../../../../components/ui/slider';
import { useLanguage } from '../../../../../../components/LanguageContext';

// Memoized Inertia Button Component
const InertiaButton = memo<{
  option: { value: number; label: string };
  isActive: boolean;
  onPress: (value: number) => void;
}>(({ option, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.inertiaButton, isActive && styles.inertiaButtonActive]}
    onPress={() => onPress(option.value)}
    activeOpacity={0.7}
  >
    <Text
      style={[
        styles.inertiaButtonText,
        isActive && styles.inertiaButtonTextActive,
      ]}
    >
      {option.label}
    </Text>
  </TouchableOpacity>
));

// Memoized Measurement Item Component
const MeasurementItem = memo<{
  label: string;
  value: string;
}>(({ label, value }) => (
  <View style={styles.measurementItem}>
    <Text style={styles.measurementLabel}>{label}</Text>
    <Text style={styles.measurementValue}>{value}</Text>
  </View>
));

const WeightedPulleyControls: React.FC<WeightedPulleyControlsProps> = memo(
  ({ state, onInertiaChange, onMassMChange, onMassmChange, onAngleChange }) => {
    const { t } = useLanguage();

    // Memoized callback functions
    const handleInertiaChange = useCallback(
      (value: number) => {
        onInertiaChange(value);
      },
      [onInertiaChange]
    );

    const handleMassMChange = useCallback(
      (value: number) => {
        onMassMChange(value);
      },
      [onMassMChange]
    );

    const handleMassmChange = useCallback(
      (value: number) => {
        onMassmChange(value);
      },
      [onMassmChange]
    );

    const handleAngleChange = useCallback(
      (value: number) => {
        onAngleChange(value);
      },
      [onAngleChange]
    );

    return (
      <View style={styles.container}>
        <View style={styles.controlGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              {t('Atalet Momenti', 'Moment of Inertia')}
            </Text>
            <Text style={styles.value}>{state.inertia.toFixed(2)} kg.m²</Text>
          </View>
          <View style={styles.inertiaButtonsContainer}>
            {INERTIA_OPTIONS.map((option) => (
              <InertiaButton
                key={option.value}
                option={option}
                isActive={state.inertia === option.value}
                onPress={handleInertiaChange}
              />
            ))}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, styles.labelBlue]}>
              {t('Asılı Kütle (M)', 'Hanging Mass (M)')}
            </Text>
            <Text style={styles.value}>{state.massM} g</Text>
          </View>
          <CustomSlider
            value={state.massM}
            min={150}
            max={800}
            step={1}
            onValueChange={handleMassMChange}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#bdc3c7"
            thumbTintColor="#3b82f6"
            style={styles.slider}
          />
        </View>

        <View style={styles.controlGroup}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, styles.labelRed]}>
              {t('Bağlı Kütle (m)', 'Attached Mass (m)')}
            </Text>
            <Text style={styles.value}>{state.massm} g</Text>
          </View>
          <CustomSlider
            value={state.massm}
            min={100}
            max={1000}
            step={1}
            onValueChange={handleMassmChange}
            minimumTrackTintColor="#ef4444"
            maximumTrackTintColor="#bdc3c7"
            thumbTintColor="#ef4444"
            style={styles.slider}
          />
        </View>

        <View style={styles.controlGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              {t('Başlangıç Açısı', 'Initial Angle')}
            </Text>
            <Text style={styles.value}>{state.angle}°</Text>
          </View>
          <CustomSlider
            value={state.angle}
            min={0}
            max={90}
            step={1}
            onValueChange={handleAngleChange}
            minimumTrackTintColor="#10b981"
            maximumTrackTintColor="#bdc3c7"
            thumbTintColor="#10b981"
            style={styles.slider}
          />
        </View>

        <View style={styles.measurementsContainer}>
          <MeasurementItem
            label={t('Zaman:', 'Time:')}
            value={`${state.time.toFixed(1)} s`}
          />
          <MeasurementItem
            label={t('Açı:', 'Angle:')}
            value={`${((state.phi / Math.PI) * 180 + 90).toFixed(0)}°`}
          />
          {/* 🔧 MOBILE OPTIMIZATION: Show fewer measurements on mobile */}
          {Platform.OS === 'web' && (
            <>
              <MeasurementItem
                label={t('Potansiyel Enerji:', 'Potential Energy:')}
                value={`${state.potentialEnergy.toFixed(6)} J`}
              />
              <MeasurementItem
                label={t('Kinetik Enerji:', 'Kinetic Energy:')}
                value={`${state.kineticEnergy.toFixed(6)} J`}
              />
              <MeasurementItem
                label={t('Toplam Enerji:', 'Total Energy:')}
                value={`${state.totalEnergy.toExponential(3)} J`}
              />
              {state.period > 0 && (
                <MeasurementItem
                  label={t('Periyot:', 'Period:')}
                  value={`${state.period.toFixed(2)} s`}
                />
              )}
            </>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
      },
      default: {
        elevation: 4,
      },
    }),
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
  labelBlue: {
    color: '#3b82f6',
  },
  labelRed: {
    color: '#ef4444',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  inertiaButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inertiaButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    alignItems: 'center',
  },
  inertiaButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  inertiaButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  inertiaButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  measurementsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  measurementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  measurementLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

export default WeightedPulleyControls;
