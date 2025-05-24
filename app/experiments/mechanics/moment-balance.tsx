import { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import { MobileMomentBalance } from './components/moment-balance/MobileMomentBalance';
import { WebMomentBalance } from './components/moment-balance/WebMomentBalance';

// Ref için tip tanımı
type MomentBalanceRefType = {
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
};

export default function MomentBalanceExperiment() {
  const { t } = useLanguage();
  const [isRunning, setIsRunning] = useState(false);
  const momentBalanceRef = useRef<MomentBalanceRefType>(null);

  const handleToggleSimulation = () => {
    if (isRunning) {
      // Deneyi durdur
      if (momentBalanceRef.current) {
        momentBalanceRef.current.stopSimulation();
      }
    } else {
      // Deneyi başlat
      if (momentBalanceRef.current) {
        momentBalanceRef.current.startSimulation();
      }
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    // Deneyi sıfırla
    if (momentBalanceRef.current) {
      momentBalanceRef.current.resetSimulation();
    }
    setIsRunning(false);
  };

  return (
    <ExperimentLayout
      title={t('Moment Dengesi', 'Torque Balance')}
      titleEn="Torque Balance"
      difficulty={t('Orta Seviye', 'Intermediate')}
      difficultyEn="Intermediate"
      description={t(
        'Bu deneyde, bir çubuk üzerindeki ağırlıkların oluşturduğu momentleri ve denge koşullarını inceleyebilirsiniz. Ağırlıkları ve konumlarını değiştirerek sistemin nasıl dengelendiğini gözlemleyin.',
        'In this experiment, you can examine the torques created by weights on a beam and the conditions for equilibrium. Observe how the system balances by changing the weights and their positions.'
      )}
      descriptionEn="In this experiment, you can examine the torques created by weights on a beam and the conditions for equilibrium. Observe how the system balances by changing the weights and their positions."
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
          {Platform.OS === 'web' ? (
            <WebMomentBalance
              ref={momentBalanceRef}
              width={Math.min(Dimensions.get('window').width - 40, 750)}
              height={350}
            />
          ) : (
            <MobileMomentBalance
              ref={momentBalanceRef}
              width={Dimensions.get('window').width - 20}
              height={280}
            />
          )}
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 20 : 100,
    padding: Platform.OS === 'web' ? 12 : 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: Platform.OS === 'web' ? 12 : 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
});
