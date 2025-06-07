import React from 'react';
import { View, ViewProps, Platform } from 'react-native';

interface CustomSliderProps extends ViewProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  disabled = false,
  minimumTrackTintColor = '#3b82f6',
  maximumTrackTintColor = '#e2e8f0',
  thumbTintColor = '#3b82f6',
  style,
  ...props
}) => {
  const handleChange = (event: any) => {
    const newValue = parseFloat(event.target.value);
    onValueChange(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <View style={[{ height: 40, marginVertical: 8 }, style]} {...props}>
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
            background: `linear-gradient(to right, ${minimumTrackTintColor} 0%, ${minimumTrackTintColor} ${percentage}%, ${maximumTrackTintColor} ${percentage}%, ${maximumTrackTintColor} 100%)`,
            borderRadius: 4,
            outline: 'none',
            appearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            margin: 'auto',
          }}
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 8,
            backgroundColor: maximumTrackTintColor,
            borderRadius: 4,
            position: 'relative',
            alignSelf: 'center',
            top: '50%',
            transform: [{ translateY: -4 }],
          }}
        >
          <View
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: minimumTrackTintColor,
              borderRadius: 4,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: -6,
              left: `${percentage}%`,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: thumbTintColor,
              marginLeft: -10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            }}
          />
        </View>
      )}
    </View>
  );
};

// Eski Slider bileşeni ile uyumluluk için
export default CustomSlider;
