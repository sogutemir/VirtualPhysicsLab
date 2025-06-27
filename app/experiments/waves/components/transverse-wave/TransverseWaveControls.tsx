import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import { TransverseWaveControlsProps } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isMobile = SCREEN_WIDTH < 600;

export const TransverseWaveControls: React.FC<TransverseWaveControlsProps> = ({
  state,
  onAmplitudeChange,
  onWavelengthChange,
  onSpeedChange,
  onDirectionChange,
  onVelocityToggle,
  onMarkedPointsChange,
  onStepSizeChange,
  onPeriodGraphToggle,
}) => {
  const { t } = useLanguage();
  const [localAmplitude, setLocalAmplitude] = useState(
    state.amplitude.toString()
  );
  const [localWavelength, setLocalWavelength] = useState(
    state.wavelength.toString()
  );
  const [localWaveSpeed, setLocalWaveSpeed] = useState(
    state.waveSpeed.toString()
  );
  const [localMarkedPoints, setLocalMarkedPoints] = useState(
    state.markedPoints.length.toString()
  );

  const handleAmplitudeChange = (text: string) => {
    setLocalAmplitude(text);
    const value = parseInt(text);
    if (!isNaN(value) && value >= 10 && value <= 100) {
      onAmplitudeChange(value);
    }
  };

  const handleWavelengthChange = (text: string) => {
    setLocalWavelength(text);
    const value = parseInt(text);
    if (!isNaN(value) && value >= 50 && value <= 400) {
      onWavelengthChange(value);
    }
  };

  const handleWaveSpeedChange = (text: string) => {
    setLocalWaveSpeed(text);
    const value = parseInt(text);
    if (!isNaN(value) && value >= 10 && value <= 100) {
      onSpeedChange(value);
    }
  };

  const handleMarkedPointsChange = (text: string) => {
    setLocalMarkedPoints(text);
    const value = parseInt(text);
    if (!isNaN(value) && value >= 1 && value <= 5) {
      onMarkedPointsChange(value);
    }
  };

  return (
    <View style={styles.container}>
      {/* Parametre Kontrolleri */}
      <View style={styles.parametersSection}>
        <Text style={styles.sectionTitle}>
          {t('Dalga Parametreleri', 'Wave Parameters')}
        </Text>
        
        <View style={styles.controlGroup}>
          <Text style={styles.label}>
            {t('Genlik', 'Amplitude')}: {state.amplitude.toFixed(0)}
          </Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const newValue = Math.max(10, state.amplitude - 5);
                onAmplitudeChange(newValue);
                setLocalAmplitude(newValue.toString());
              }}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={localAmplitude}
              onChangeText={handleAmplitudeChange}
              keyboardType="numeric"
              textAlign="center"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const newValue = Math.min(100, state.amplitude + 5);
                onAmplitudeChange(newValue);
                setLocalAmplitude(newValue.toString());
              }}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>
            {t('Dalga Boyu', 'Wavelength')}: {state.wavelength.toFixed(0)}
          </Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const newValue = Math.max(50, state.wavelength - 10);
                onWavelengthChange(newValue);
                setLocalWavelength(newValue.toString());
              }}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={localWavelength}
              onChangeText={handleWavelengthChange}
              keyboardType="numeric"
              textAlign="center"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const newValue = Math.min(400, state.wavelength + 10);
                onWavelengthChange(newValue);
                setLocalWavelength(newValue.toString());
              }}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>
            {t('Dalga Hızı', 'Wave Speed')}: {state.waveSpeed.toFixed(0)}
          </Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const newValue = Math.max(10, state.waveSpeed - 5);
                onSpeedChange(newValue);
                setLocalWaveSpeed(newValue.toString());
              }}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={localWaveSpeed}
              onChangeText={handleWaveSpeedChange}
              keyboardType="numeric"
              textAlign="center"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const newValue = Math.min(100, state.waveSpeed + 5);
                onSpeedChange(newValue);
                setLocalWaveSpeed(newValue.toString());
              }}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.label}>
            {t('İşaretli Noktalar', 'Marked Points')}: {state.markedPoints.length}
          </Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const newValue = Math.max(1, state.markedPoints.length - 1);
                onMarkedPointsChange(newValue);
                setLocalMarkedPoints(newValue.toString());
              }}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={localMarkedPoints}
              onChangeText={handleMarkedPointsChange}
              keyboardType="numeric"
              textAlign="center"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const newValue = Math.min(5, state.markedPoints.length + 1);
                onMarkedPointsChange(newValue);
                setLocalMarkedPoints(newValue.toString());
              }}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Yön Kontrolleri */}
      <View style={styles.directionSection}>
        <Text style={styles.sectionTitle}>
          {t('Dalga Yönü', 'Wave Direction')}
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.directionButton,
              state.direction === 'right'
                ? styles.activeButton
                : styles.inactiveButton,
            ]}
            onPress={() => onDirectionChange('right')}
          >
            <Text
              style={[
                styles.buttonText,
                state.direction === 'right'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              {t('Sağa →', 'Right →')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.directionButton,
              state.direction === 'left'
                ? styles.activeButton
                : styles.inactiveButton,
            ]}
            onPress={() => onDirectionChange('left')}
          >
            <Text
              style={[
                styles.buttonText,
                state.direction === 'left'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              {t('← Sola', '← Left')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Görünüm Kontrolleri */}
      <View style={styles.viewSection}>
        <Text style={styles.sectionTitle}>
          {t('Görünüm Seçenekleri', 'View Options')}
        </Text>
        
        <TouchableOpacity
          style={[
            styles.toggleButton,
            state.showVelocity ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={onVelocityToggle}
        >
          <Text
            style={[
              styles.toggleButtonText,
              state.showVelocity
                ? styles.activeButtonText
                : styles.inactiveButtonText,
            ]}
          >
            {state.showVelocity
              ? t('✓ Hız Vektörleri', '✓ Velocity Vectors')
              : t('Hız Vektörleri', 'Velocity Vectors')}
          </Text>
        </TouchableOpacity>

        {onPeriodGraphToggle && (
          <TouchableOpacity
            style={[
              styles.toggleButton,
              state.showPeriodGraph
                ? styles.activeButton
                : styles.inactiveButton,
            ]}
            onPress={onPeriodGraphToggle}
          >
            <Text
              style={[
                styles.toggleButtonText,
                state.showPeriodGraph
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              {state.showPeriodGraph
                ? t('✓ Periyot Grafiği', '✓ Period Graph')
                : t('Periyot Grafiği', 'Period Graph')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Adım Boyutu */}
      <View style={styles.stepSection}>
        <Text style={styles.sectionTitle}>
          {t('Adım Boyutu', 'Step Size')}
        </Text>
        <View style={styles.stepSizeButtons}>
          <TouchableOpacity
            style={[
              styles.stepButton,
              state.stepSize === 'quarter'
                ? styles.activeStepButton
                : styles.inactiveStepButton,
            ]}
            onPress={() => onStepSizeChange('quarter')}
          >
            <Text
              style={[
                styles.stepButtonText,
                state.stepSize === 'quarter'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              λ/4
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.stepButton,
              state.stepSize === 'half'
                ? styles.activeStepButton
                : styles.inactiveStepButton,
            ]}
            onPress={() => onStepSizeChange('half')}
          >
            <Text
              style={[
                styles.stepButtonText,
                state.stepSize === 'half'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              λ/2
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.stepButton,
              state.stepSize === 'threeQuarters'
                ? styles.activeStepButton
                : styles.inactiveStepButton,
            ]}
            onPress={() => onStepSizeChange('threeQuarters')}
          >
            <Text
              style={[
                styles.stepButtonText,
                state.stepSize === 'threeQuarters'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              3λ/4
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.stepButton,
              state.stepSize === 'full'
                ? styles.activeStepButton
                : styles.inactiveStepButton,
            ]}
            onPress={() => onStepSizeChange('full')}
          >
            <Text
              style={[
                styles.stepButtonText,
                state.stepSize === 'full'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              λ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: isMobile ? 16 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: isMobile ? 18 : 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: isMobile ? 12 : 8,
    textAlign: 'center',
  },
  parametersSection: {
    marginBottom: isMobile ? 20 : 15,
  },
  directionSection: {
    marginBottom: isMobile ? 20 : 15,
  },
  viewSection: {
    marginBottom: isMobile ? 20 : 15,
  },
  stepSection: {
    marginBottom: 0,
  },
  controlGroup: {
    marginBottom: isMobile ? 20 : 15,
  },
  label: {
    fontSize: isMobile ? 16 : 14,
    fontWeight: '600',
    marginBottom: isMobile ? 10 : 8,
    color: '#495057',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: isMobile ? 50 : 40,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
    marginHorizontal: 8,
    fontSize: isMobile ? 16 : 14,
    backgroundColor: '#f8f9fa',
  },
  button: {
    width: isMobile ? 50 : 40,
    height: isMobile ? 50 : 40,
    backgroundColor: '#4263eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isMobile ? 18 : 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  directionButton: {
    paddingVertical: isMobile ? 15 : 10,
    paddingHorizontal: isMobile ? 20 : 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButton: {
    paddingVertical: isMobile ? 15 : 12,
    paddingHorizontal: isMobile ? 20 : 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonText: {
    fontWeight: '600',
    fontSize: isMobile ? 16 : 14,
  },
  activeButton: {
    backgroundColor: '#4263eb',
  },
  inactiveButton: {
    backgroundColor: '#f1f3f4',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeButtonText: {
    color: '#fff',
  },
  inactiveButtonText: {
    color: '#495057',
  },
  stepSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: isMobile ? 8 : 5,
  },
  stepButton: {
    paddingVertical: isMobile ? 12 : 8,
    paddingHorizontal: isMobile ? 15 : 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  activeStepButton: {
    backgroundColor: '#4263eb',
  },
  inactiveStepButton: {
    backgroundColor: '#f1f3f4',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  stepButtonText: {
    fontWeight: 'bold',
    fontSize: isMobile ? 14 : 12,
  },
});
