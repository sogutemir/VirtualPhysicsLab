import React, { memo, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { CustomSlider } from '../../../../../components/ui/slider';

interface AtwoodMachineState {
  m1: number;
  m2: number;
  g: number;
  ropeLength: number;
  isRunning: boolean;
  time: number;
  position1: number;
  position2: number;
  velocity: number;
  acceleration: number;
  tension: number;
}

interface AtwoodControlsProps {
  state: AtwoodMachineState;
  onMass1Change: (value: number) => void;
  onMass2Change: (value: number) => void;
  onGravityChange: (value: number) => void;
  onStart: () => void;
  onReset: () => void;
}

// Memoized Web slider component with optimized styling
const WebSlider = memo<{
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  color: string;
}>(({ value, min, max, step, onChange, color }) => {
  const percentage = useMemo(
    () => ((value - min) / (max - min)) * 100,
    [value, min, max]
  );

  const sliderStyle = useMemo(
    () => ({
      width: '100%',
      height: '40px',
      background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #bdc3c7 ${percentage}%, #bdc3c7 100%)`,
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none' as const,
      borderRadius: '10px',
    }),
    [color, percentage]
  );

  if (Platform.OS !== 'web') return null;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={sliderStyle}
    />
  );
});

export const AtwoodControls: React.FC<AtwoodControlsProps> = memo(
  ({
    state,
    onMass1Change,
    onMass2Change,
    onGravityChange,
    onStart,
    onReset,
  }) => {
    const isWeb = Platform.OS === 'web';

    // Memoize slider configurations
    const sliderConfigs = useMemo(
      () => [
        {
          label: 'Kütle 1 (m₁)',
          value: state.m1,
          unit: 'kg',
          onChange: onMass1Change,
          min: 0.5,
          max: 10,
          step: 0.1,
          color: '#ef4444',
          trackColor: '#ef4444',
        },
        {
          label: 'Kütle 2 (m₂)',
          value: state.m2,
          unit: 'kg',
          onChange: onMass2Change,
          min: 0.5,
          max: 10,
          step: 0.1,
          color: '#10b981',
          trackColor: '#10b981',
        },
        {
          label: 'Yerçekimi (g)',
          value: state.g,
          unit: 'm/s²',
          onChange: onGravityChange,
          min: 1,
          max: 15,
          step: 0.1,
          color: '#3b82f6',
          trackColor: '#3b82f6',
        },
      ],
      [
        state.m1,
        state.m2,
        state.g,
        onMass1Change,
        onMass2Change,
        onGravityChange,
      ]
    );

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Deney Parametreleri</Text>
        </View>

        <View style={styles.sliderGroup}>
          {sliderConfigs.map((config, index) => (
            <View key={index} style={styles.sliderContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{config.label}</Text>
                <Text style={styles.value}>
                  {config.value.toFixed(1)} {config.unit}
                </Text>
              </View>
              {isWeb ? (
                <WebSlider
                  value={config.value}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  onChange={config.onChange}
                  color={config.color}
                />
              ) : (
                <CustomSlider
                  style={styles.slider}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={config.value}
                  onValueChange={config.onChange}
                  minimumTrackTintColor={config.trackColor}
                  maximumTrackTintColor="#bdc3c7"
                  thumbTintColor={config.trackColor}
                  disabled={state.isRunning}
                />
              )}
            </View>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Ağır kütle (m₁ {'>'} m₂) aşağı, hafif kütle yukarı hareket eder.
            Eşit kütleler (m₁ = m₂) durumunda sistem dengededir.
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              state.isRunning && styles.stopButton,
            ]}
            onPress={onStart}
          >
            <Text style={styles.buttonText}>
              {state.isRunning ? 'Durdur' : 'Başlat'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onReset}
          >
            <Text style={styles.buttonText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sliderGroup: {
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  value: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
