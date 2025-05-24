import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';

interface AtwooodMachineState {
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

interface AtwooodControlsProps {
  state: AtwooodMachineState;
  onMass1Change: (value: number) => void;
  onMass2Change: (value: number) => void;
  onGravityChange: (value: number) => void;
  onStart: () => void;
  onReset: () => void;
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

export const AtwooodControls: React.FC<AtwooodControlsProps> = ({
  state,
  onMass1Change,
  onMass2Change,
  onGravityChange,
  onStart,
  onReset,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deney Parametreleri</Text>
      </View>

      <View style={styles.sliderGroup}>
        {/* Mass 1 */}
        <View style={styles.sliderContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Kütle 1 (m₁)</Text>
            <Text style={styles.value}>{state.m1.toFixed(1)} kg</Text>
          </View>
          {Platform.OS === 'web' ? (
            <WebSlider
              value={state.m1}
              min={0.5}
              max={10}
              step={0.1}
              onChange={onMass1Change}
              color="#ef4444"
            />
          ) : (
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={10}
              step={0.1}
              value={state.m1}
              onValueChange={onMass1Change}
              minimumTrackTintColor="#ef4444"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#ef4444"
              disabled={state.isRunning}
            />
          )}
        </View>

        {/* Mass 2 */}
        <View style={styles.sliderContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Kütle 2 (m₂)</Text>
            <Text style={styles.value}>{state.m2.toFixed(1)} kg</Text>
          </View>
          {Platform.OS === 'web' ? (
            <WebSlider
              value={state.m2}
              min={0.5}
              max={10}
              step={0.1}
              onChange={onMass2Change}
              color="#10b981"
            />
          ) : (
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={10}
              step={0.1}
              value={state.m2}
              onValueChange={onMass2Change}
              minimumTrackTintColor="#10b981"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#10b981"
              disabled={state.isRunning}
            />
          )}
        </View>

        {/* Gravity */}
        <View style={styles.sliderContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Yerçekimi (g)</Text>
            <Text style={styles.value}>{state.g.toFixed(1)} m/s²</Text>
          </View>
          {Platform.OS === 'web' ? (
            <WebSlider
              value={state.g}
              min={1}
              max={15}
              step={0.1}
              onChange={onGravityChange}
              color="#3b82f6"
            />
          ) : (
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={15}
              step={0.1}
              value={state.g}
              onValueChange={onGravityChange}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#3b82f6"
              disabled={state.isRunning}
            />
          )}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Ağır kütle (m₁ {'>'} m₂) aşağı, hafif kütle yukarı hareket eder. Eşit
          kütleler (m₁ = m₂) durumunda sistem dengededir.
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
};

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
