import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import PhotoelectricSimulator from './components/photoelectric/PhotoelectricSimulator';

const isMobile = Platform.OS !== 'web';

const PhotoelectricExperiment: React.FC = () => {
  // Deney parametreleri için state'ler
  const [frequency, setFrequency] = useState(6e14); // 600 THz (yaklaşık 500 nm)
  const [intensity, setIntensity] = useState(50); // %50
  const [metalType, setMetalType] = useState('sodium'); // Sodyum
  const [stoppingVoltage, setStoppingVoltage] = useState(0); // 0V
  const [temperature, setTemperature] = useState(300); // 300K (oda sıcaklığı)
  const [isRunning, setIsRunning] = useState(true);

  return (
    <ExperimentLayout
      title="Fotoelektrik Olay"
      titleEn="Photoelectric Effect"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Bu interaktif deneyde, ışığın metal yüzeye çarpması sonucu elektronların koparılması olayını gözlemleyebilirsiniz. Işığın frekansı belirli bir eşik değerinin üzerindeyse elektronlar koparılır ve bu durum Einstein'ın kuantum teorisiyle açıklanır."
      descriptionEn="In this interactive experiment, you can observe the emission of electrons when light hits a metal surface. If the frequency of light is above a threshold value, electrons are emitted. This phenomenon is explained by Einstein's quantum theory."
      hideControls={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <PhotoelectricSimulator />
      </ScrollView>
    </ExperimentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: isMobile ? 60 : 40,
  },
});

export default PhotoelectricExperiment;
