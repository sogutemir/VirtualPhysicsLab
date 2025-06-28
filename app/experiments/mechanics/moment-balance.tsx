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
        `🎯 Moment dengesi deneyi, bir çubuk üzerindeki kuvvetlerin oluşturduğu momentleri ve denge koşullarını inceleyen temel fizik deneyidir.

📚 TEORİ VE FORMÜLLER:

⚡ Moment (Tork) Tanımı:
• Moment: M = F × r
• F: Uygulanan kuvvet (N)
• r: Kuvvet kolu (dönme eksenine uzaklık)
• Yön: Saat yönü (-), saat yönü tersi (+)

🔄 Denge Koşulları:
• Kuvvet dengesi: ΣF = 0
• Moment dengesi: ΣM = 0
• Toplam saat yönü momentler = Toplam saat yönü tersi momentler

⚖️ Çubuk Denge Analizi:
• Sol momentler: M₁ = m₁gr₁ + m₂gr₂ + ...
• Sağ momentler: M₂ = m₃gr₃ + m₄gr₄ + ...
• Denge şartı: M₁ = M₂

🔋 Ağırlık Merkezi:
• Çubuğun ağırlık merkezi: xcm = Σ(mᵢxᵢ) / Σmᵢ
• Toplam moment: Mtoplam = Σ(mᵢgrᵢ)
• Destek noktası reaksiyonu: R = Σmᵢg

💡 Moment Kolu:
• Kuvvet kolu = Dönme eksenine dik mesafe
• Maksimum moment: Kuvvet ⊥ kuvvet kolu
• Sıfır moment: Kuvvet dönme ekseninden geçer

🎮 Parametre Aralıkları:
- Ağırlık Değerleri: 0.1 - 5.0 kg
- Konum Aralığı: -2.0 - +2.0 m
- Çubuk Uzunluğu: 4.0 m
- Destek Noktası: Ayarlanabilir

🔬 Gözlemlenebilir Durumlar:
• Statik denge (çubuk yatay)
• Dinamik dengesizlik (çubuk döner)
• Ağırlık merkezi değişimi
• Farklı konfigürasyonlarda denge
• Moment kolunun etkisi

💻 Fiziksel İlkeler:
Statik dengede bulunan rijit cisimler için kuvvet ve moment dengesinin uygulanması. Sistem, dönel dengenin temel prensiplerini gösterir.`,
        `🎯 The torque balance experiment studies the torques created by forces on a beam and equilibrium conditions in fundamental physics.

📚 THEORY AND FORMULAS:

⚡ Torque (Moment) Definition:
• Torque: τ = F × r
• F: Applied force (N)
• r: Moment arm (distance from rotation axis)
• Direction: Clockwise (-), counterclockwise (+)

🔄 Equilibrium Conditions:
• Force equilibrium: ΣF = 0
• Torque equilibrium: Στ = 0
• Total clockwise torques = Total counterclockwise torques

⚖️ Beam Balance Analysis:
• Left torques: τ₁ = m₁gr₁ + m₂gr₂ + ...
• Right torques: τ₂ = m₃gr₃ + m₄gr₄ + ...
• Balance condition: τ₁ = τ₂

🔋 Center of Mass:
• Beam center of mass: xcm = Σ(mᵢxᵢ) / Σmᵢ
• Total torque: τtotal = Σ(mᵢgrᵢ)
• Support point reaction: R = Σmᵢg

💡 Moment Arm:
• Moment arm = Perpendicular distance to rotation axis
• Maximum torque: Force ⊥ moment arm
• Zero torque: Force passes through rotation axis

🎮 Parameter Ranges:
- Weight Values: 0.1 - 5.0 kg
- Position Range: -2.0 - +2.0 m
- Beam Length: 4.0 m
- Support Point: Adjustable

🔬 Observable Phenomena:
• Static equilibrium (horizontal beam)
• Dynamic imbalance (beam rotates)
• Center of mass shift
• Balance in different configurations
• Effect of moment arm

💻 Physical Principles:
Application of force and torque equilibrium for rigid bodies in static equilibrium. The system demonstrates fundamental principles of rotational balance.`
      )}
      descriptionEn={t(
        `🎯 The torque balance experiment studies the torques created by forces on a beam and equilibrium conditions in fundamental physics.

📚 THEORY AND FORMULAS:

⚡ Torque (Moment) Definition:
• Torque: τ = F × r
• F: Applied force (N)
• r: Moment arm (distance from rotation axis)
• Direction: Clockwise (-), counterclockwise (+)

🔄 Equilibrium Conditions:
• Force equilibrium: ΣF = 0
• Torque equilibrium: Στ = 0
• Total clockwise torques = Total counterclockwise torques

⚖️ Beam Balance Analysis:
• Left torques: τ₁ = m₁gr₁ + m₂gr₂ + ...
• Right torques: τ₂ = m₃gr₃ + m₄gr₄ + ...
• Balance condition: τ₁ = τ₂

🔋 Center of Mass:
• Beam center of mass: xcm = Σ(mᵢxᵢ) / Σmᵢ
• Total torque: τtotal = Σ(mᵢgrᵢ)
• Support point reaction: R = Σmᵢg

💡 Moment Arm:
• Moment arm = Perpendicular distance to rotation axis
• Maximum torque: Force ⊥ moment arm
• Zero torque: Force passes through rotation axis

🎮 Parameter Ranges:
- Weight Values: 0.1 - 5.0 kg
- Position Range: -2.0 - +2.0 m
- Beam Length: 4.0 m
- Support Point: Adjustable

🔬 Observable Phenomena:
• Static equilibrium (horizontal beam)
• Dynamic imbalance (beam rotates)
• Center of mass shift
• Balance in different configurations
• Effect of moment arm

💻 Physical Principles:
Application of force and torque equilibrium for rigid bodies in static equilibrium. The system demonstrates fundamental principles of rotational balance.`,
        `🎯 Moment dengesi deneyi, bir çubuk üzerindeki kuvvetlerin oluşturduğu momentleri ve denge koşullarını inceleyen temel fizik deneyidir.

📚 TEORİ VE FORMÜLLER:

⚡ Moment (Tork) Tanımı:
• Moment: M = F × r
• F: Uygulanan kuvvet (N)
• r: Kuvvet kolu (dönme eksenine uzaklık)
• Yön: Saat yönü (-), saat yönü tersi (+)

🔄 Denge Koşulları:
• Kuvvet dengesi: ΣF = 0
• Moment dengesi: ΣM = 0
• Toplam saat yönü momentler = Toplam saat yönü tersi momentler

⚖️ Çubuk Denge Analizi:
• Sol momentler: M₁ = m₁gr₁ + m₂gr₂ + ...
• Sağ momentler: M₂ = m₃gr₃ + m₄gr₄ + ...
• Denge şartı: M₁ = M₂

🔋 Ağırlık Merkezi:
• Çubuğun ağırlık merkezi: xcm = Σ(mᵢxᵢ) / Σmᵢ
• Toplam moment: Mtoplam = Σ(mᵢgrᵢ)
• Destek noktası reaksiyonu: R = Σmᵢg

💡 Moment Kolu:
• Kuvvet kolu = Dönme eksenine dik mesafe
• Maksimum moment: Kuvvet ⊥ kuvvet kolu
• Sıfır moment: Kuvvet dönme ekseninden geçer

🎮 Parametre Aralıkları:
- Ağırlık Değerleri: 0.1 - 5.0 kg
- Konum Aralığı: -2.0 - +2.0 m
- Çubuk Uzunluğu: 4.0 m
- Destek Noktası: Ayarlanabilir

🔬 Gözlemlenebilir Durumlar:
• Statik denge (çubuk yatay)
• Dinamik dengesizlik (çubuk döner)
• Ağırlık merkezi değişimi
• Farklı konfigürasyonlarda denge
• Moment kolunun etkisi

💻 Fiziksel İlkeler:
Statik dengede bulunan rijit cisimler için kuvvet ve moment dengesinin uygulanması. Sistem, dönel dengenin temel prensiplerini gösterir.`
      )}
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
