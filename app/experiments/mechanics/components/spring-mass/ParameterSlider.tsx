import React, { memo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

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

export const ParameterSlider: React.FC<ParameterSliderProps> = memo(({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  description,
  color = '#3b82f6',
}) => {
  // Mobil optimizasyonu
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 600;

  return (
    <View style={[styles.container, isMobile && styles.mobileContainer]}>
      <View style={styles.header}>
        <Text style={[styles.label, isMobile && styles.mobileLabel]}>{label}</Text>
        <View style={[styles.valueContainer, { backgroundColor: color + '20' }]}>
          <Text style={[styles.value, { color }, isMobile && styles.mobileValue]}>
            {value.toFixed(step < 1 ? 1 : 0)} {unit}
          </Text>
        </View>
      </View>

      <Slider
        style={[styles.slider, isMobile && styles.mobileSlider]}
        minimumValue={min}
        maximumValue={max}
        value={value}
        step={step}
        onValueChange={onChange}
        minimumTrackTintColor={color}
        maximumTrackTintColor="rgba(0, 0, 0, 0.1)"
        thumbTintColor={color}
      />

      <View style={styles.range}>
        <Text style={[styles.rangeText, isMobile && styles.mobileRangeText]}>
          {min} {unit}
        </Text>
        <Text style={[styles.rangeText, isMobile && styles.mobileRangeText]}>
          {max} {unit}
        </Text>
      </View>

      {description && !isMobile && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mobileContainer: {
    marginBottom: 16,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  mobileLabel: {
    fontSize: 14,
  },
  valueContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
  },
  mobileValue: {
    fontSize: 13,
  },
  slider: {
    height: 40,
    marginVertical: 8,
  },
  mobileSlider: {
    height: 35,
    marginVertical: 6,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  customThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeText: {
    fontSize: 12,
    color: '#64748b',
  },
  mobileRangeText: {
    fontSize: 11,
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
