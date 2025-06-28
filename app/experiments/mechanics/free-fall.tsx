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
      tr: `🎯 Bu deneyde, sürtünme kuvvetinin parabolik hareket üzerindeki etkisini inceleyebilirsiniz.

📚 TEORİ VE FORMÜLLER:

⚡ Hareket Denklemleri (Sürtünmeli):
F = -k·v²·v̂  (Sürtünme kuvveti)
ax = -k·v·vx  (X-yönü ivme)
ay = -g - k·v·vy  (Y-yönü ivme)

🔄 Hız Bileşenleri:
vx(t) = v₀·cos(θ) + ∫ax dt
vy(t) = v₀·sin(θ) + ∫ay dt
v(t) = √(vx² + vy²)

📍 Konum Denklemleri:
x(t) = ∫vx dt  (Yatay konum)
y(t) = ∫vy dt  (Düşey konum)

🎯 Başlangıç Koşulları:
vx₀ = v₀·cos(θ)  (İlk yatay hız)
vy₀ = v₀·sin(θ)  (İlk düşey hız)
x₀ = 0, y₀ = 0  (Başlangıç konumu)

⚖️ Sürtünme Analizi:
k = β/m  (Sürtünme katsayısı)
β: Sürtünme sabiti (kg/m)
m: Cisim kütlesi (kg)
Fsürtünme ∝ v²  (Kvadratik sürtünme)

🔬 Fiziksel Limitler:
• Maksimum hız: ${FREE_FALL_CONSTANTS.MAX_VELOCITY} m/s
• Terminal hız: vt = √(mg/k)
• Menzil azalması: sürtünme ile kısalır
• Optimal açı: θ < 45° (sürtünme ile)

🎮 Parametre Aralıkları:
- Başlangıç Hızı (v₀): 0 - ${FREE_FALL_CONSTANTS.MAX_VELOCITY} m/s
- Atış Açısı (θ): 0° - 90°
- Sürtünme Katsayısı (k): 0 - 0.01 s⁻¹
- Yerçekimi: g = 9.81 m/s²

🔬 Gözlemlenebilir Durumlar:
• Sürtünmesiz vs sürtünmeli yörünge
• Terminal hıza yaklaşma
• Menzil ve maksimum yükseklik azalması
• Asimetrik parabolik hareket
• Hız vektörü değişimi

💻 Sayısal Çözüm:
• Runge-Kutta 4. derece integrasyon
• Δt = 0.016 s (60 FPS)
• Gerçek zamanlı hesaplama
• Yörünge izleme ve görselleştirme`,
      en: `🎯 In this experiment, you can examine the effect of friction force on projectile motion.

📚 THEORY AND FORMULAS:

⚡ Equations of Motion (With Friction):
F = -k·v²·v̂  (Friction force)
ax = -k·v·vx  (X-direction acceleration)
ay = -g - k·v·vy  (Y-direction acceleration)

🔄 Velocity Components:
vx(t) = v₀·cos(θ) + ∫ax dt
vy(t) = v₀·sin(θ) + ∫ay dt
v(t) = √(vx² + vy²)

📍 Position Equations:
x(t) = ∫vx dt  (Horizontal position)
y(t) = ∫vy dt  (Vertical position)

🎯 Initial Conditions:
vx₀ = v₀·cos(θ)  (Initial horizontal velocity)
vy₀ = v₀·sin(θ)  (Initial vertical velocity)
x₀ = 0, y₀ = 0  (Initial position)

⚖️ Friction Analysis:
k = β/m  (Friction coefficient)
β: Friction constant (kg/m)
m: Object mass (kg)
Ffriction ∝ v²  (Quadratic friction)

🔬 Physical Limits:
• Maximum velocity: ${FREE_FALL_CONSTANTS.MAX_VELOCITY} m/s
• Terminal velocity: vt = √(mg/k)
• Range reduction: decreases with friction
• Optimal angle: θ < 45° (with friction)

🎮 Parameter Ranges:
- Initial Velocity (v₀): 0 - ${FREE_FALL_CONSTANTS.MAX_VELOCITY} m/s
- Launch Angle (θ): 0° - 90°
- Friction Coefficient (k): 0 - 0.01 s⁻¹
- Gravity: g = 9.81 m/s²

🔬 Observable Phenomena:
• Frictionless vs friction trajectory
• Approach to terminal velocity
• Range and maximum height reduction
• Asymmetric parabolic motion
• Velocity vector changes

💻 Numerical Solution:
• Runge-Kutta 4th order integration
• Δt = 0.016 s (60 FPS)
• Real-time calculation
• Trajectory tracking and visualization`,
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
