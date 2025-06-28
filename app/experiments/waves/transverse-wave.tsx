import { useState, useRef } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, Platform } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { TransverseWave } from './components/transverse-wave';

const { width, height } = Dimensions.get('window');
const isMobile = width < 600;

// Ref için tip tanımı
type TransverseWaveRefType = {
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
};

export default function TransverseWaveExperiment() {
  const [isRunning, setIsRunning] = useState(false);
  const transverseWaveRef = useRef<TransverseWaveRefType>(null);

  const handleToggleSimulation = () => {
    if (isRunning) {
      // Deneyi durdur
      if (transverseWaveRef.current) {
        transverseWaveRef.current.stopSimulation();
      }
    } else {
      // Deneyi başlat
      if (transverseWaveRef.current) {
        transverseWaveRef.current.startSimulation();
      }
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    // Deneyi sıfırla
    if (transverseWaveRef.current) {
      transverseWaveRef.current.resetSimulation();
    }
    setIsRunning(false);
  };

  // Mobil için optimize edilmiş boyutlar
  const waveWidth = isMobile ? width - 32 : Math.min(width * 0.8, 800);
  const waveHeight = isMobile ? Math.min(height * 0.35, 300) : 300;

  return (
    <ExperimentLayout
      title="Enine Dalga"
      titleEn="Transverse Wave"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Bu deneyde, enine dalga hareketini inceleyebilirsiniz. Dalga genliği, dalga boyu ve dalga hızı gibi parametreleri değiştirerek dalga hareketinin nasıl etkilendiğini gözlemleyin. İşaretli noktaların hareketini takip edebilir, hız vektörlerini görüntüleyebilir ve periyot grafiğini inceleyebilirsiniz."
      descriptionEn="In this experiment, you can examine the transverse wave motion. Observe how the wave motion is affected by changing parameters such as wave amplitude, wavelength, and wave speed. You can track the motion of marked points, display velocity vectors, and examine the period graph."
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
          <TransverseWave
            ref={transverseWaveRef}
            width={waveWidth}
            height={waveHeight}
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
    paddingBottom: Platform.OS === 'web' ? 50 : 200, // Mobilde daha fazla alt boşluk
  },
  container: {
    flex: 1,
    backgroundColor: isMobile ? '#f5f5f5' : '#f9f9f9',
    borderRadius: isMobile ? 0 : 12,
    overflow: 'hidden',
    margin: isMobile ? 0 : 15,
    ...(isMobile ? {} : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 10,
      borderWidth: 1,
      borderColor: '#dfe6e9',
    }),
  },
});
