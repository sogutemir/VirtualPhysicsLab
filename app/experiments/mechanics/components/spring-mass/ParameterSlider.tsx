import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { CustomSlider } from '../../../../../components/ui/slider';

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  description?: string;
  color?: string;
}

// Web için basit slider component
const WebSlider: React.FC<{
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  color: string;
}> = ({ value, min, max, step, onChange, color }) => {
  if (Platform.OS !== 'web') return null;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={{
        width: '100%',
        height: '40px',
        background: `linear-gradient(to right, ${color} 0%, ${color} ${
          ((value - min) / (max - min)) * 100
        }%, #bdc3c7 ${((value - min) / (max - min)) * 100}%, #bdc3c7 100%)`,
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        borderRadius: '10px',
      }}
    />
  );
};

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  description,
  color = '#3498db',
}) => {
  return (
    <View style={styles.sliderContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value.toFixed(step < 1 ? 1 : 0)} {unit}
        </Text>
      </View>

      {Platform.OS === 'web' ? (
        <WebSlider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          color={color}
        />
      ) : (
        <CustomSlider
          style={styles.slider}
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor={color}
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor={color}
        />
      )}

      {description && (
        <View style={styles.infoContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  description: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
