import { useState, useRef, useCallback, useMemo } from 'react';
import { View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { MobileFreeFall } from './components/free-fall/MobileFreeFall';
import { useLanguage } from '../../../components/LanguageContext';
import { FREE_FALL_CONSTANTS } from './components/free-fall/types';

const { width, height } = Dimensions.get('window');

// Ref için tip tanımı
type FreeFallRefType = {
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
};

export default function FreeFallExperiment() {
  const { t } = useLanguage();
  const [isRunning, setIsRunning] = useState(false);
  const freeFallRef = useRef<FreeFallRefType>(null);

  const handleToggleSimulation = useCallback(() => {
    if (isRunning) {
      // Deneyi durdur
      freeFallRef.current?.stopSimulation();
    } else {
      // Deneyi başlat
      freeFallRef.current?.startSimulation();
    }
    setIsRunning(!isRunning);
  }, [isRunning]);

  const handleReset = useCallback(() => {
    // Deneyi sıfırla
    freeFallRef.current?.resetSimulation();
    setIsRunning(false);
  }, []);

  // Memoized descriptions
  const descriptions = useMemo(
    () => ({
      tr: `Bu deneyde, sürtünme kuvvetinin serbest düşme hareketi üzerindeki etkisini inceleyebilirsiniz. Maksimum hız ${FREE_FALL_CONSTANTS.MAX_VELOCITY} m/s ile sınırlandırılmıştır. Başlangıç hızı, atış açısı ve sürtünme katsayısını değiştirerek hareketin nasıl etkilendiğini gözlemleyin.`,
      en: `In this experiment, you can examine the effect of friction force on free fall motion. Maximum velocity is limited to ${FREE_FALL_CONSTANTS.MAX_VELOCITY} m/s. Observe how the motion is affected by changing the initial velocity, launch angle, and friction coefficient.`,
    }),
    []
  );

  return (
    <ExperimentLayout
      title={t('Sürtünmeli Serbest Düşme', 'Free Fall with Friction')}
      titleEn="Free Fall with Friction"
      difficulty={t('Orta Seviye', 'Intermediate')}
      difficultyEn="Intermediate"
      description={t(descriptions.tr, descriptions.en)}
      descriptionEn={descriptions.en}
      isRunning={isRunning}
      onToggleSimulation={handleToggleSimulation}
      onReset={handleReset}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <MobileFreeFall
            ref={freeFallRef}
            width={width}
            height={height * 0.7}
          />
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 200, // Mobilde alt boşluğu artırdım
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 15,
    minHeight: 500, // Minimum yükseklik eklendi
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
});
