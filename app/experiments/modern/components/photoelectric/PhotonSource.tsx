import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import { wavelengthToColor } from '../../utils/photoelectric';

interface PhotonSourceProps {
  wavelength: number;
  intensity: number;
  isActive: boolean;
}

// Mobil kontrol değişkeni
const isMobile = Platform.OS !== 'web';

const PhotonSource: React.FC<PhotonSourceProps> = ({
  wavelength,
  intensity,
  isActive,
}) => {
  const { t } = useLanguage();
  const lightColor = wavelengthToColor(wavelength);

  // Animasyon için Animated değerleri
  const photonAnimValues = useRef<Animated.Value[]>([]);
  const [photonCount, setPhotonCount] = React.useState(0);
  // Animasyon referansını saklamak için
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  React.useEffect(() => {
    // Işık şiddetine göre foton sayısını hesapla
    const newPhotonCount = Math.max(1, Math.floor(intensity / 10));
    setPhotonCount(newPhotonCount);

    // Animasyon değerlerini ayarla
    photonAnimValues.current = Array(newPhotonCount)
      .fill(0)
      .map(() => new Animated.Value(0));
  }, [intensity]);

  React.useEffect(() => {
    // Önceki animasyonu durdur
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // Işık aktifse animasyonu başlat
    if (isActive && photonCount > 0 && photonAnimValues.current) {
      // Tüm fotonlar için animasyon oluştur
      const animations = photonAnimValues.current.map((anim, index) => {
        // Animasyonu başa al
        anim.setValue(0);
        // Fotonun hareketini sağlayan animasyon
        return Animated.timing(anim, {
          toValue: 1,
          duration: 1000 + Math.random() * 500,
          useNativeDriver: true,
          // Her foton için farklı gecikme ile başlat
          delay: (index * 200) % 1000,
        });
      });

      // Animasyonları sırayla ve tekrarlayarak başlat
      const loop = Animated.loop(Animated.stagger(100, animations));

      loop.start();
      animationRef.current = loop;

      return () => {
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
      };
    }
  }, [isActive, photonCount]);

  // Foton için translation hesaplama
  const getPhotonTranslation = (anim: Animated.Value) => {
    // Metale kadar olan mesafe - mobilde daha kısa mesafe
    const distanceToMetal = isMobile ? 40 : 60;

    return anim.interpolate({
      inputRange: [0, 1],
      // Fotonlar metal yüzeyin başlangıcına kadar gidecek, metali geçmeyecek
      outputRange: [0, distanceToMetal],
    });
  };

  return (
    <View style={styles.container}>
      {/* Işık kaynağı */}
      <View style={styles.source}>
        <View style={styles.sourceInner}>
          <View
            style={[
              styles.lightBulb,
              {
                backgroundColor: lightColor,
                opacity: isActive ? 0.9 : 0.3,
                shadowColor: lightColor,
                shadowOpacity: isActive ? 0.8 : 0.1,
              },
            ]}
          />
        </View>
      </View>

      {/* Işın demetleri */}
      {isActive &&
        photonAnimValues.current &&
        photonAnimValues.current.length > 0 &&
        photonAnimValues.current.map((anim, index) => (
          <Animated.View
            key={`photon-${index}`}
            style={[
              styles.photon,
              {
                backgroundColor: lightColor,
                top: (index - photonCount / 2) * 3 + (isMobile ? 60 : 80),
                width: isMobile ? 20 : 20,
                opacity: anim.interpolate({
                  inputRange: [0, 0.8, 1],
                  outputRange: [0.7, 0.9, 0], // Foton metal yüzeye yaklaştıkça kaybolur
                }),
                transform: [
                  {
                    translateX: getPhotonTranslation(anim),
                  },
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1, 0.8],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: isMobile ? 120 : 160,
    width: isMobile ? 60 : 96,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  source: {
    width: isMobile ? 40 : 64,
    height: isMobile ? 60 : 96,
    backgroundColor: '#333',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceInner: {
    position: 'absolute',
    top: isMobile ? 4 : 8,
    bottom: isMobile ? 4 : 8,
    left: isMobile ? 4 : 8,
    right: isMobile ? 4 : 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightBulb: {
    width: isMobile ? 20 : 32,
    height: isMobile ? 20 : 32,
    borderRadius: isMobile ? 10 : 16,
    shadowRadius: isMobile ? 6 : 10,
    shadowOffset: { width: 0, height: 0 },
  },
  photon: {
    position: 'absolute',
    height: isMobile ? 4 : 4,
    width: isMobile ? 20 : 20,
    borderRadius: isMobile ? 2 : 2,
    left: isMobile ? 50 : 80,
  },
});

export default PhotonSource;
