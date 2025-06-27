import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import PhotonSource from './PhotonSource';
import MetalSurface from './MetalSurface';
import ElectronCollector from './ElectronCollector';
import ControlPanel from './ControlPanel';
import {
  MetalType,
  calculateCurrent,
  calculateMaxKineticEnergy,
  calculateStoppingPotential,
  calculateThresholdFrequency,
  generateIVCurveData,
  generateEnergyFrequencyData,
  frequencyToWavelength,
} from '../../utils/photoelectric';

// Mobil kontrol değişkeni
const isMobile = Platform.OS !== 'web';

const PhotoelectricSimulator: React.FC = () => {
  const { language, t } = useLanguage();

  // Durum değişkenleri
  const [frequency, setFrequency] = useState(6e14); // 600 THz (yaklaşık 500 nm)
  const [intensity, setIntensity] = useState(50); // %50
  const [metalType, setMetalType] = useState<MetalType>('sodium'); // Sodyum
  const [stoppingVoltage, setStoppingVoltage] = useState(0); // 0V
  const [temperature, setTemperature] = useState(300); // 300K (oda sıcaklığı)
  const [isLightOn, setIsLightOn] = useState(true);

  // Hesaplanmış değerler
  const [current, setCurrent] = useState(0);
  const [maxKineticEnergy, setMaxKineticEnergy] = useState(0);
  const [theoreticalStoppingPotential, setTheoreticalStoppingPotential] = useState(0);
  const [ivCurveData, setIVCurveData] = useState<any[]>([]);
  const [efCurveData, setEFCurveData] = useState<any[]>([]);

  // Animasyon için değişkenler
  const emissionAnimation = useRef(new Animated.Value(0)).current;
  const collectAnimation = useRef(new Animated.Value(0)).current;
  // Animasyon referansını saklamak için
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Eşik frekansını hesapla
  const thresholdFrequency = calculateThresholdFrequency(metalType);

  // Elektron emisyonu oluyor mu?
  const isEmittingElectrons =
    isLightOn && frequency >= thresholdFrequency && maxKineticEnergy > 0;

  // Emisyon durumu değiştiğinde animasyon
  useEffect(() => {
    // Önceki animasyonu durdur
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    if (isEmittingElectrons) {
      try {
        const animation = Animated.sequence([
          Animated.timing(emissionAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(collectAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]);

        animation.start();
        animationRef.current = animation;
      } catch (error) {
        console.log('Emission animation error:', error);
      }
    } else {
      try {
        const animation = Animated.parallel([
          Animated.timing(emissionAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(collectAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);

        animation.start();
        animationRef.current = animation;
      } catch (error) {
        console.log('Stop animation error:', error);
      }
    }

    // Temizleme fonksiyonu
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [isEmittingElectrons, emissionAnimation, collectAnimation]);

  // Değerler değiştiğinde hesaplamaları güncelle
  useEffect(() => {
    if (isLightOn) {
      const newMaxKineticEnergy = calculateMaxKineticEnergy(frequency, metalType);
      const newTheoreticalStoppingPotential = calculateStoppingPotential(frequency, metalType);
      const newCurrent = calculateCurrent(
        frequency,
        intensity,
        metalType,
        stoppingVoltage,
        temperature
      );

      setMaxKineticEnergy(newMaxKineticEnergy);
      setTheoreticalStoppingPotential(newTheoreticalStoppingPotential);
      setCurrent(newCurrent);

      // I-V eğrisi verilerini güncelle
      setIVCurveData(
        generateIVCurveData(frequency, intensity, metalType, temperature)
      );

      // E-f eğrisi verilerini güncelle
      const minFreq = Math.max(1e14, thresholdFrequency * 0.8);
      const maxFreq = 2e15;
      setEFCurveData(generateEnergyFrequencyData(minFreq, maxFreq, metalType));
    } else {
      setMaxKineticEnergy(0);
      setTheoreticalStoppingPotential(0);
      setCurrent(0);
    }
  }, [
    frequency,
    intensity,
    metalType,
    stoppingVoltage,
    temperature,
    isLightOn,
    thresholdFrequency,
  ]);

  // Veri değişikliğini vurgulama
  const highlightValue = (current: number, previous: number) => {
    if (previous === 0 && current > 0) return styles.resultHighlightPositive;
    if (previous > 0 && current === 0) return styles.resultHighlightNegative;
    if (current > previous * 1.5) return styles.resultHighlightPositive;
    if (current < previous * 0.5 && current > 0)
      return styles.resultHighlightNegative;
    return null;
  };

  // Animasyon değerleri için güvenli interpolasyon
  const getInterpolatedValue = (
    anim: Animated.Value,
    inputRange: number[],
    outputRange: any[]
  ) => {
    if (!anim) return outputRange[0];

    try {
      return anim.interpolate({
        inputRange,
        outputRange,
      });
    } catch (error) {
      console.log('Interpolation error:', error);
      return outputRange[0];
    }
  };

  // Transformasyonları güvenli şekilde oluşturma
  const getSafeTransform = (transforms: any[]) => {
    if (!transforms || !Array.isArray(transforms)) return [];

    try {
      return transforms;
    } catch (error) {
      console.log('Transform error:', error);
      return [];
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.experimentContainer}>
        {/* Deney Aparatı */}
        <Animated.View
          style={[
            styles.experimentSetup,
            {
              opacity: isLightOn ? 1 : 0.7,
              transform: getSafeTransform([
                {
                  scale:
                    isLightOn && emissionAnimation
                      ? getInterpolatedValue(
                          emissionAnimation,
                          [0, 1],
                          [1, 1.02]
                        )
                      : 1,
                },
              ]),
            },
          ]}
        >
          <View
            style={[
              styles.apparatusContainer,
              isMobile && styles.apparatusMobile,
            ]}
          >
            <PhotonSource
              wavelength={frequencyToWavelength(frequency)}
              intensity={intensity}
              isActive={isLightOn}
            />
            <MetalSurface
              metalType={metalType}
              emittingElectrons={isEmittingElectrons}
              intensity={intensity}
            />
            <ElectronCollector voltage={stoppingVoltage} current={current} />
          </View>
        </Animated.View>

        {/* Kontrol Paneli ve Sonuçlar */}
        <View style={styles.controlsAndResults}>
          <ControlPanel
            frequency={frequency}
            setFrequency={setFrequency}
            intensity={intensity}
            setIntensity={setIntensity}
            metalType={metalType}
            setMetalType={setMetalType}
            stoppingVoltage={stoppingVoltage}
            setStoppingVoltage={setStoppingVoltage}
            temperature={temperature}
            setTemperature={setTemperature}
            isLightOn={isLightOn}
            setIsLightOn={setIsLightOn}
          />

          {/* Deney Sonuçları */}
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              {t('Deney Sonuçları', 'Experiment Results')}
            </Text>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>
                {t('Dalga Boyu:', 'Wavelength:')}
              </Text>
              <Text style={styles.resultsValue}>
                {frequencyToWavelength(frequency).toFixed(0)} nm
              </Text>
            </View>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>
                {t('Frekans:', 'Frequency:')}
              </Text>
              <Text style={styles.resultsValue}>
                {(frequency / 1e12).toFixed(2)} THz
              </Text>
            </View>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>
                {t('Eşik Frekansı:', 'Threshold Frequency:')}
              </Text>
              <Animated.View
                style={[
                  styles.resultIndicator,
                  frequency >= thresholdFrequency
                    ? styles.resultIndicatorSuccess
                    : styles.resultIndicatorWarning,
                  {
                    opacity: emissionAnimation
                      ? getInterpolatedValue(
                          emissionAnimation,
                          [0, 1],
                          [0.3, 1]
                        )
                      : 0.3,
                  },
                ]}
              />
              <Text style={styles.resultsValue}>
                {(thresholdFrequency / 1e12).toFixed(2)} THz
              </Text>
            </View>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>
                {t('Maks. Kinetik Enerji:', 'Max. Kinetic Energy:')}
              </Text>
              <Animated.View
                style={[
                  styles.resultIndicator,
                  maxKineticEnergy > 0
                    ? styles.resultIndicatorSuccess
                    : styles.resultIndicatorWarning,
                  { opacity: emissionAnimation },
                ]}
              />
              <Text
                style={[
                  styles.resultsValue,
                  maxKineticEnergy > 0 ? styles.resultPositive : null,
                ]}
              >
                {maxKineticEnergy.toFixed(2)} eV
              </Text>
            </View>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>
                {t('Teorik Durdurucu Potansiyel:', 'Theoretical Stopping Potential:')}
              </Text>
              <Text style={styles.resultsValue}>
                {theoreticalStoppingPotential.toFixed(2)} V
              </Text>
            </View>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>{t('Akım:', 'Current:')}</Text>
              <Animated.View
                style={[
                  styles.resultIndicator,
                  current > 0
                    ? styles.resultIndicatorSuccess
                    : styles.resultIndicatorWarning,
                  { opacity: collectAnimation },
                ]}
              />
              <Text
                style={[
                  styles.resultsValue,
                  current > 0 ? styles.resultPositive : null,
                ]}
              >
                {current.toFixed(2)} μA
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Teorik Bilgi */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>
          {t('Fotoelektrik Olay Hakkında', 'About Photoelectric Effect')}
        </Text>
        <Text style={styles.infoText}>
          {t(
            'Fotoelektrik olay, ışığın bir metal yüzeye çarpması sonucu elektronların koparılması olayıdır. Bu deney, ışığın dalga teorisiyle açıklanamayan özellikleri olduğunu göstermiş ve kuantum fiziğinin temellerinin atılmasına yardımcı olmuştur.',
            'The photoelectric effect is the emission of electrons when light strikes a metal surface. This experiment demonstrated properties of light that could not be explained by the wave theory and helped establish the foundations of quantum physics.'
          )}
        </Text>
        <Text style={styles.infoText}>
          {t(
            "Einstein'ın açıklamasına göre, ışık foton adı verilen enerji paketlerinden oluşur ve her fotonun enerjisi E = hf formülüyle hesaplanır (h: Planck sabiti, f: frekans). Bir foton, enerjisi metalin iş fonksiyonundan (Φ) büyükse elektron koparabilir: E_max = hf - Φ",
            "According to Einstein's explanation, light consists of energy packets called photons, and the energy of each photon is calculated by the formula E = hf (h: Planck's constant, f: frequency). A photon can eject an electron if its energy is greater than the metal's work function (Φ): E_max = hf - Φ"
          )}
        </Text>
        <Text style={styles.infoText}>
          {t(
            "Önemli fiziksel kurallar: 1) Eşik frekansının altında hiç elektron koparılmaz, 2) Akım sadece ışık şiddetine bağlıdır, frekansa bağlı değildir, 3) Elektronların maksimum kinetik enerjisi sadece frekansa bağlıdır, şiddete bağlı değildir, 4) Durdurucu potansiyel elektronları durdurur ve akımı sıfırlar.",
            "Important physical rules: 1) No electrons are emitted below the threshold frequency, 2) Current depends only on light intensity, not on frequency, 3) Maximum kinetic energy of electrons depends only on frequency, not on intensity, 4) Stopping potential stops electrons and cuts current to zero."
          )}
        </Text>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>{t('Grafikler', 'Charts')}</Text>
        <Text style={styles.chartDescription}>
          {t(
            'Fotoelektrik deneyi sonuçlarına göre oluşturulan grafikler burada gösterilecektir. Web versiyonda gerçek grafikler, mobilden farklı olarak, görsel grafikler yerine verilerle temsil edilmektedir.',
            'Charts generated from the photoelectric experiment results would be shown here. In the web version, actual charts are displayed, unlike mobile which is represented with data.'
          )}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isMobile ? 12 : 16,
    paddingBottom: isMobile ? 20 : 16,
  },
  experimentContainer: {
    flexDirection: 'column',
  },
  experimentSetup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: isMobile ? 250 : 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: isMobile ? 8 : 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  apparatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  apparatusMobile: {
    // Mobil cihazlarda bileşenlerin arasındaki mesafeyi ayarla
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  controlsAndResults: {
    flexDirection: isMobile ? 'column' : 'row',
    flexWrap: 'wrap',
    gap: isMobile ? 12 : 16,
  },
  resultsContainer: {
    flex: 1,
    minWidth: isMobile ? 'auto' : 250,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: isMobile ? 12 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: isMobile ? 8 : 0,
  },
  resultsTitle: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: isMobile ? 12 : 16,
    color: '#2c3e50',
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMobile ? 6 : 8,
    position: 'relative',
    minHeight: isMobile ? 28 : 24,
  },
  resultIndicator: {
    width: isMobile ? 10 : 8,
    height: isMobile ? 10 : 8,
    borderRadius: isMobile ? 5 : 4,
    position: 'absolute',
    right: isMobile ? '25%' : '30%',
  },
  resultIndicatorSuccess: {
    backgroundColor: '#2ecc71',
  },
  resultIndicatorWarning: {
    backgroundColor: '#e74c3c',
  },
  resultHighlightPositive: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
  },
  resultHighlightNegative: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  resultPositive: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  resultsLabel: {
    fontSize: isMobile ? 13 : 14,
    color: '#34495e',
    flex: 1,
    flexWrap: 'wrap',
  },
  resultsValue: {
    fontSize: isMobile ? 13 : 14,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'right',
    marginLeft: 8,
  },
  infoContainer: {
    marginTop: isMobile ? 16 : 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: isMobile ? 12 : 16,
  },
  infoTitle: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: isMobile ? 8 : 12,
    color: '#2c3e50',
  },
  infoText: {
    fontSize: isMobile ? 13 : 14,
    lineHeight: isMobile ? 20 : 22,
    color: '#34495e',
    marginBottom: isMobile ? 8 : 12,
  },
  chartSection: {
    marginTop: isMobile ? 16 : 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: isMobile ? 12 : 16,
  },
  chartTitle: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: isMobile ? 8 : 12,
    color: '#2c3e50',
  },
  chartDescription: {
    fontSize: isMobile ? 13 : 14,
    lineHeight: isMobile ? 20 : 22,
    color: '#34495e',
    marginBottom: isMobile ? 8 : 12,
    fontStyle: 'italic',
  },
});

export default PhotoelectricSimulator;
