import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { CustomSlider } from '../../../../components/ui/slider';

interface ValueSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number[]) => void;
  colorClass: string;
  label: string;
  unit: string;
  disabled?: boolean;
}

const ValueSlider: React.FC<ValueSliderProps> = ({
  value,
  min,
  max,
  step,
  onChange,
  colorClass,
  label,
  unit,
  disabled = false,
}) => {
  // Renk sınıfına göre renk belirle
  const getColorByClass = (colorClass: string): string => {
    switch (colorClass) {
      case 'voltage':
        return '#3498db';
      case 'current':
        return '#f39c12';
      case 'resistance':
        return '#e74c3c';
      default:
        return '#666';
    }
  };

  const color = getColorByClass(colorClass);

  const handleChange = (event: any) => {
    const newValue = parseFloat(event.target.value);
    onChange([newValue]);
  };

  const handleMobileChange = (newValue: number) => {
    onChange([newValue]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>
          {value.toFixed(2)} {unit}
        </Text>
      </View>

      {Platform.OS === 'web' ? (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          style={{
            width: '100%',
            height: 8,
            background: `linear-gradient(to right, ${color} 0%, ${color} ${
              ((value - min) / (max - min)) * 100
            }%, rgba(0,0,0,0.1) ${
              ((value - min) / (max - min)) * 100
            }%, rgba(0,0,0,0.1) 100%)`,
            borderRadius: 4,
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            margin: '16px 0',
          }}
        />
      ) : (
        <CustomSlider
          value={value}
          min={min}
          max={max}
          step={step}
          onValueChange={handleMobileChange}
          disabled={disabled}
          minimumTrackTintColor={color}
          maximumTrackTintColor="rgba(0,0,0,0.1)"
          thumbTintColor={color}
          style={styles.mobileSlider}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  mobileSlider: {
    width: '100%',
    height: 40,
    marginVertical: 8,
  },
});

export default ValueSlider;
