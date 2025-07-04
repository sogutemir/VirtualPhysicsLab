import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';

interface ElectronCollectorProps {
  voltage: number;
  current: number;
}

// Mobil kontrol değişkeni
const isMobile = Platform.OS !== 'web';

const ElectronCollector: React.FC<ElectronCollectorProps> = ({
  voltage,
  current,
}) => {
  const { t } = useLanguage();
  const glowAnimation = useRef(new Animated.Value(0)).current;
  // Animasyon referansını saklamak için
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Gerilim değerine göre renk tonu belirle (kırmızı = negatif, mavi = pozitif)
  const voltageColor =
    voltage < 0
      ? `rgba(255, 50, 50, ${Math.min(1, Math.abs(voltage) / 5)})`
      : `rgba(50, 50, 255, ${Math.min(1, Math.abs(voltage) / 5)})`;

  // Akım yoğunluğuna göre parlaklık efekti
  const glowIntensity = Math.min(1, current / 100);

  // Akım değerine bağlı olarak parlama animasyonu
  useEffect(() => {
    // Önceki animasyonu temizle
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    if (current > 0) {
      // Parlama animasyonu
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0.6,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      // Animasyonu başlat ve referansını sakla
      animation.start();
      animationRef.current = animation;
    } else {
      // Animasyonu durdur
      glowAnimation.setValue(0);
    }

    // Temizleme fonksiyonu
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [current, glowAnimation]);

  // Animasyon değerleri için interpolasyonlar
  const getInterpolateValue = (inputRange: number[], outputRange: number[]) => {
    try {
      return glowAnimation.interpolate({
        inputRange,
        outputRange,
      });
    } catch (error) {
      console.log('Interpolation error:', error);
      return 0;
    }
  };

  // Sadece current > 0 olduğunda scale transform'u oluştur
  const getTransform = () => {
    if (current <= 0) return [];

    try {
      return [
        {
          scale: glowAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.03],
          }),
        },
      ];
    } catch (error) {
      console.log('Transform error:', error);
      return [];
    }
  };

  return (
    <View style={styles.container}>
      {/* Toplayıcı plaka */}
      <Animated.View
        style={[
          styles.collector,
          {
            backgroundColor: voltageColor,
            shadowColor: current > 0 ? '#4d9fff' : 'transparent',
            shadowRadius: current > 0 ? 8 + glowIntensity * 12 : 0,
            shadowOpacity: current > 0 ? glowIntensity * 0.8 : 0,
            transform: getTransform(),
          },
        ]}
      >
        <Text style={styles.voltageText}>{voltage.toFixed(1)}V</Text>
      </Animated.View>

      {/* Akım göstergesi */}
      {current > 0 && (
        <Animated.View
          style={[
            styles.currentIndicator,
            {
              opacity: getInterpolateValue([0, 1], [0.8, 1]),
            },
          ]}
        >
          <Text style={styles.currentText}>{current.toFixed(2)} μA</Text>
        </Animated.View>
      )}

      {/* Elektron etkisi - parlama halkası */}
      {current > 0 && (
        <Animated.View
          style={[
            styles.electronEffect,
            {
              opacity: getInterpolateValue([0, 1], [0.1, glowIntensity * 0.5]),
              transform: [
                {
                  scale: getInterpolateValue([0, 1], [0.8, 1.2]),
                },
              ],
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: isMobile ? 120 : 256,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  collector: {
    width: isMobile ? 30 : 48,
    height: isMobile ? 90 : 192,
    borderRadius: isMobile ? 6 : 8,
    borderWidth: isMobile ? 1 : 2,
    borderColor: '#ccc',
    shadowOffset: { width: 0, height: 0 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  voltageText: {
    fontSize: isMobile ? 8 : 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: 'white',
    opacity: 0.8,
  },
  currentIndicator: {
    marginTop: isMobile ? 4 : 8,
    backgroundColor: '#222',
    borderRadius: 3,
    paddingHorizontal: isMobile ? 4 : 8,
    paddingVertical: isMobile ? 2 : 4,
  },
  currentText: {
    fontSize: isMobile ? 8 : 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: 'white',
  },
  electronEffect: {
    position: 'absolute',
    width: isMobile ? 40 : 80,
    height: isMobile ? 40 : 80,
    borderRadius: isMobile ? 20 : 40,
    backgroundColor: '#4d9fff',
    left: '50%',
    top: '50%',
    marginLeft: isMobile ? -20 : -40,
    marginTop: isMobile ? -20 : -40,
    opacity: 0.3,
  },
});

export default ElectronCollector;
