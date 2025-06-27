import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import { CustomSlider } from '../../../../../components/ui/slider';
import {
  MetalType,
  METAL_NAMES_TR,
  METAL_NAMES_EN,
  frequencyToWavelength,
  wavelengthToFrequency,
  calculateStoppingPotential,
} from '../../utils/photoelectric';

interface ControlPanelProps {
  frequency: number;
  setFrequency: (value: number) => void;
  intensity: number;
  setIntensity: (value: number) => void;
  metalType: MetalType;
  setMetalType: (value: MetalType) => void;
  stoppingVoltage: number;
  setStoppingVoltage: (value: number) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  isLightOn: boolean;
  setIsLightOn: (value: boolean) => void;
}

const MIN_FREQUENCY = 1e14; // 100 THz
const MAX_FREQUENCY = 2e15; // 2000 THz

// Mobil kontrol değişkeni
const isMobile = Platform.OS !== 'web';

const ControlPanel: React.FC<ControlPanelProps> = ({
  frequency,
  setFrequency,
  intensity,
  setIntensity,
  metalType,
  setMetalType,
  stoppingVoltage,
  setStoppingVoltage,
  temperature,
  setTemperature,
  isLightOn,
  setIsLightOn,
}) => {
  const { language, t } = useLanguage();

  // Animasyon değişkenleri
  const [lastChanged, setLastChanged] = useState<string | null>(null);
  const valueAnimations = {
    frequency: React.useRef(new Animated.Value(1)).current,
    intensity: React.useRef(new Animated.Value(1)).current,
    voltage: React.useRef(new Animated.Value(1)).current,
    temperature: React.useRef(new Animated.Value(1)).current,
  };

  // Frekans ve dalga boyu dönüşümleri
  const wavelength = frequencyToWavelength(frequency);
  
  // Teorik durdurucu potansiyeli hesapla
  const theoreticalStoppingPotential = calculateStoppingPotential(frequency, metalType);
  
  // Maksimum durdurucu potansiyel değeri (teorik değerin 1.5 katı)
  const maxStoppingVoltage = Math.max(5, theoreticalStoppingPotential * 1.5);

  // Işığı otomatik olarak açık tut
  useEffect(() => {
    if (!isLightOn) {
      setIsLightOn(true);
    }
  }, [isLightOn, setIsLightOn]);

  // Değişiklik olduğunda animasyon gösterme
  const animateChange = (param: keyof typeof valueAnimations) => {
    setLastChanged(param);
    Animated.sequence([
      Animated.timing(valueAnimations[param], {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(valueAnimations[param], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Dile göre metal isimlerini seç
  const metalNames = language === 'tr' ? METAL_NAMES_TR : METAL_NAMES_EN;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('Deney Parametreleri', 'Experiment Parameters')}
      </Text>

      {/* Dalga boyu / Frekans kontrolü */}
      <View style={styles.control}>
        <View style={styles.controlHeader}>
          <Text style={styles.label}>{t('Dalga Boyu', 'Wavelength')}</Text>
          <Animated.Text
            style={[
              styles.value,
              { transform: [{ scale: valueAnimations.frequency }] },
            ]}
          >
            {wavelength.toFixed(0)} nm
          </Animated.Text>
        </View>
        <CustomSlider
          min={MIN_FREQUENCY}
          max={MAX_FREQUENCY}
          step={(MAX_FREQUENCY - MIN_FREQUENCY) / 1000}
          value={frequency}
          onValueChange={(value) => {
            setFrequency(value);
            animateChange('frequency');
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#3498db"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>
            {t('Kırmızı (750nm)', 'Red (750nm)')}
          </Text>
          <Text style={styles.sliderLabel}>
            {t('Mor (380nm)', 'Violet (380nm)')}
          </Text>
        </View>
      </View>

      {/* Işık şiddeti kontrolü */}
      <View style={styles.control}>
        <View style={styles.controlHeader}>
          <Text style={styles.label}>
            {t('Işık Şiddeti', 'Light Intensity')}
          </Text>
          <Animated.Text
            style={[
              styles.value,
              { transform: [{ scale: valueAnimations.intensity }] },
            ]}
          >
            {intensity.toFixed(0)}%
          </Animated.Text>
        </View>
        <CustomSlider
          min={0}
          max={100}
          step={1}
          value={intensity}
          onValueChange={(value) => {
            setIntensity(value);
            animateChange('intensity');
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#3498db"
        />
      </View>

      {/* Metal türü seçimi */}
      <View style={styles.control}>
        <Text style={styles.label}>{t('Metal Türü', 'Metal Type')}</Text>
        <View style={styles.metalTypeSelector}>
          {Object.entries(metalNames).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.metalTypeButton,
                metalType === key ? styles.metalTypeButtonActive : null,
              ]}
              onPress={() => setMetalType(key as MetalType)}
            >
              <Text
                style={[
                  styles.metalTypeButtonText,
                  metalType === key ? styles.metalTypeButtonTextActive : null,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Durdurucu potansiyel kontrolü */}
      <View style={styles.control}>
        <View style={styles.controlHeader}>
          <Text style={styles.label}>
            {t('Durdurucu Potansiyel', 'Stopping Potential')}
          </Text>
          <Animated.Text
            style={[
              styles.value,
              { transform: [{ scale: valueAnimations.voltage }] },
            ]}
          >
            {stoppingVoltage.toFixed(2)} V
          </Animated.Text>
        </View>
        <CustomSlider
          min={0}
          max={maxStoppingVoltage}
          step={0.1}
          value={stoppingVoltage}
          onValueChange={(value) => {
            setStoppingVoltage(value);
            animateChange('voltage');
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#3498db"
        />
        <View style={styles.stoppingPotentialInfo}>
          <Text style={styles.infoText}>
            {t('Teorik V₀:', 'Theoretical V₀:')} {theoreticalStoppingPotential.toFixed(2)} V
          </Text>
          {stoppingVoltage >= theoreticalStoppingPotential ? (
            <Text style={[styles.infoText, styles.stoppedText]}>
              {t('⚡ Elektronlar durdu', '⚡ Electrons stopped')}
            </Text>
          ) : (
            <Text style={[styles.infoText, styles.flowingText]}>
              {t('⚡ Akım akıyor', '⚡ Current flowing')}
            </Text>
          )}
        </View>
      </View>

      {/* Sıcaklık kontrolü */}
      <View style={styles.control}>
        <View style={styles.controlHeader}>
          <Text style={styles.label}>{t('Sıcaklık', 'Temperature')}</Text>
          <Animated.Text
            style={[
              styles.value,
              { transform: [{ scale: valueAnimations.temperature }] },
            ]}
          >
            {temperature.toFixed(0)} K
          </Animated.Text>
        </View>
        <CustomSlider
          min={100}
          max={500}
          step={10}
          value={temperature}
          onValueChange={(value) => {
            setTemperature(value);
            animateChange('temperature');
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#3498db"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>
            {t('Soğuk (100K)', 'Cold (100K)')}
          </Text>
          <Text style={styles.sliderLabel}>
            {t('Sıcak (500K)', 'Hot (500K)')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isMobile ? 12 : 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: isMobile ? 0 : 16,
  },
  title: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: isMobile ? 12 : 16,
    color: '#2c3e50',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  control: {
    marginBottom: isMobile ? 12 : 16,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMobile ? 6 : 8,
  },
  label: {
    fontSize: isMobile ? 13 : 14,
    fontWeight: '500',
    color: '#34495e',
    flex: 1,
  },
  value: {
    fontSize: isMobile ? 13 : 14,
    color: '#7f8c8d',
    fontWeight: '600',
    marginLeft: 8,
    minWidth: isMobile ? 60 : 'auto',
    textAlign: 'right',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: isMobile ? 11 : 12,
    color: '#95a5a6',
  },
  button: {
    paddingHorizontal: isMobile ? 12 : 16,
    paddingVertical: isMobile ? 6 : 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#3498db',
  },
  buttonInactive: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: isMobile ? 13 : 14,
  },
  metalTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: isMobile ? 6 : 8,
  },
  metalTypeButton: {
    paddingHorizontal: isMobile ? 10 : 12,
    paddingVertical: isMobile ? 6 : 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    minWidth: isMobile ? 70 : 'auto',
    alignItems: 'center',
  },
  metalTypeButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  metalTypeButtonText: {
    fontSize: isMobile ? 12 : 14,
    color: '#34495e',
    textAlign: 'center',
  },
  metalTypeButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  stoppingPotentialInfo: {
    marginTop: 8,
    padding: isMobile ? 6 : 8,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  infoText: {
    fontSize: isMobile ? 11 : 12,
    color: '#34495e',
    marginBottom: 2,
  },
  stoppedText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  flowingText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
});

export default ControlPanel;
