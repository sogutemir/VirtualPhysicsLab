import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLanguage } from '../../../../components/LanguageContext';
import { Play, Pause, RotateCcw, Info } from 'lucide-react-native';

interface ControlPanelProps {
  acceleration: number;
  setAcceleration: (value: number) => void;
  initialVelocity: number;
  setInitialVelocity: (value: number) => void;
  time: number;
  setTime: (value: number) => void;
  isRunning: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  acceleration,
  setAcceleration,
  initialVelocity,
  setInitialVelocity,
  time,
  setTime,
  isRunning,
  toggleSimulation,
  resetSimulation,
}) => {
  const { t } = useLanguage();

  // Custom Slider bileşeni
  const CustomSlider: React.FC<{
    value: number;
    minimumValue: number;
    maximumValue: number;
    step: number;
    onValueChange: (value: number) => void;
    disabled: boolean;
    minimumTrackTintColor: string;
    maximumTrackTintColor: string;
    thumbTintColor: string;
    style: any;
  }> = ({
    value,
    minimumValue,
    maximumValue,
    step,
    onValueChange,
    disabled,
    minimumTrackTintColor,
    maximumTrackTintColor,
    thumbTintColor,
    style,
  }) => {
    const handleChange = (event: any) => {
      const newValue = parseFloat(event.target.value);
      onValueChange(newValue);
    };

    const percentage =
      ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

    return Platform.OS === 'web' ? (
      <input
        type="range"
        min={minimumValue}
        max={maximumValue}
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
          margin: '16px 0',
          ...style,
        }}
      />
    ) : (
      <View
        style={[
          {
            backgroundColor: maximumTrackTintColor,
            height: 8,
            borderRadius: 4,
            position: 'relative',
            marginVertical: 16,
          },
          style,
        ]}
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
    );
  };

  const renderTooltip = (title: string, content: string) => (
    <TouchableOpacity
      onPress={() => {
        // Tooltip içeriğini göster (Toast veya Modal ile)
      }}
    >
      <Info size={16} color="#6b7280" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{t('İvme (a)', 'Acceleration (a)')}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{acceleration.toFixed(1)} m/s²</Text>
            {renderTooltip(
              t('İvme', 'Acceleration'),
              t(
                'İvme, hızın zamana göre değişim oranıdır. Pozitif değerler hızlanma, negatif değerler yavaşlama gösterir.',
                'Acceleration is the rate of change of velocity over time. Positive values indicate speeding up, negative values indicate slowing down.'
              )
            )}
          </View>
        </View>
        <CustomSlider
          minimumValue={-10}
          maximumValue={10}
          step={0.1}
          value={acceleration}
          onValueChange={setAcceleration}
          disabled={isRunning}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#3b82f6"
          style={styles.slider}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {t('Başlangıç Hızı (v₀)', 'Initial Velocity (v₀)')}
          </Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{initialVelocity.toFixed(1)} m/s</Text>
            {renderTooltip(
              t('Başlangıç Hızı', 'Initial Velocity'),
              t(
                'Cismin hareket başlangıcındaki hızı. Pozitif değerler sağa, negatif değerler sola hareketi temsil eder.',
                'The initial velocity of the object. Positive values represent motion to the right, negative values represent motion to the left.'
              )
            )}
          </View>
        </View>
        <CustomSlider
          minimumValue={-10}
          maximumValue={10}
          step={0.1}
          value={initialVelocity}
          onValueChange={setInitialVelocity}
          disabled={isRunning}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#3b82f6"
          style={styles.slider}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{t('Zaman (t)', 'Time (t)')}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{time.toFixed(1)} s</Text>
            {renderTooltip(
              t('Zaman', 'Time'),
              t(
                'Simülasyonun çalışacağı toplam süre.',
                'The total duration of the simulation.'
              )
            )}
          </View>
        </View>
        <CustomSlider
          minimumValue={1}
          maximumValue={10}
          step={0.1}
          value={time}
          onValueChange={setTime}
          disabled={isRunning}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#3b82f6"
          style={styles.slider}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            isRunning && styles.stopButton,
          ]}
          onPress={toggleSimulation}
        >
          <View style={styles.buttonContent}>
            {isRunning ? (
              <Pause size={16} color="#fff" />
            ) : (
              <Play size={16} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {isRunning ? t('Durdur', 'Stop') : t('Başlat', 'Start')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={resetSimulation}
          disabled={isRunning}
        >
          <RotateCcw size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    flex: 1,
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ControlPanel;
