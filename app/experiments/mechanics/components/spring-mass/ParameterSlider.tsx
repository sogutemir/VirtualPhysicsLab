import React, { memo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
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

// Web için HTML slider komponenti
const WebSlider: React.FC<{
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  color: string;
  isMobile: boolean;
}> = ({ value, min, max, step, onChange, color, isMobile }) => {
  if (Platform.OS !== 'web') return null;

  const progressPercent = ((value - min) / (max - min)) * 100;

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
        height: isMobile ? '35px' : '40px',
        background: `linear-gradient(to right, ${color} 0%, ${color} ${progressPercent}%, #e5e7eb ${progressPercent}%, #e5e7eb 100%)`,
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        borderRadius: '8px',
        WebkitAppearance: 'none',
        border: 'none',
        marginTop: isMobile ? '6px' : '8px',
        marginBottom: isMobile ? '6px' : '8px',
      }}
    />
  );
};

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

      {Platform.OS === 'web' ? (
        <WebSlider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          color={color}
          isMobile={isMobile}
        />
      ) : (
        <CustomSlider
          style={[styles.slider, isMobile && styles.mobileSlider]}
          min={min}
          max={max}
          value={value}
          step={step}
          onValueChange={onChange}
          minimumTrackTintColor={color}
          maximumTrackTintColor="rgba(0, 0, 0, 0.1)"
          thumbTintColor={color}
        />
      )}

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
