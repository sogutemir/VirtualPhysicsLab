import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function SimpleHarmonicMotionTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Basit Harmonik Hareket', 'Simple Harmonic Motion')}
      titleEn="Simple Harmonic Motion"
      difficulty={t('Orta Seviye', 'Intermediate Level')}
      difficultyEn="Intermediate Level"
      description={t(
        'Salınım hareketi, yay-kütle sistemi, sarkaç dinamiği ve periyodik hareket analizi',
        'Oscillatory motion, spring-mass system, pendulum dynamics and periodic motion analysis'
      )}
      descriptionEn="Oscillatory motion, spring-mass system, pendulum dynamics and periodic motion analysis"
      hideControls={true}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.container}>
          {/* Giriş */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Basit Harmonik Hareket Nedir?', 'What is Simple Harmonic Motion?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Basit Harmonik Hareket (BHH), bir cismin denge konumu etrafında periyodik olarak salınım yapmasıdır. Bu hareket türünde, cisime etki eden geri yönlendirici kuvvet, denge konumundan olan uzaklıkla doğru orantılıdır.',
                'Simple Harmonic Motion (SHM) is the periodic oscillation of an object around its equilibrium position. In this type of motion, the restoring force acting on the object is directly proportional to its displacement from equilibrium.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'BHH, doğada en yaygın görülen hareket türlerinden biridir ve birçok fiziksel olayın temelini oluşturur.',
                  'SHM is one of the most common types of motion in nature and forms the basis of many physical phenomena.'
                )}
              </Text>
            </View>
          </View>

          {/* Matematiksel Tanım */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Matematiksel Tanım', 'Mathematical Definition')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Basit harmonik harekette geri yönlendirici kuvvet, Hooke yasasına göre tanımlanır:',
                'In simple harmonic motion, the restoring force is defined by Hooke\'s law:'
              )}
            </Text>
            
            <FormulaText 
              formula="F = -kx"
              description={t('F: Geri yönlendirici kuvvet (N), k: Yay sabiti (N/m), x: Yer değiştirme (m)', 'F: Restoring force (N), k: Spring constant (N/m), x: Displacement (m)')}
            />

            <Text style={styles.paragraph}>
              {t(
                'Newton\'un ikinci yasasını uygulayarak hareket denklemini elde ederiz:',
                'Applying Newton\'s second law, we obtain the equation of motion:'
              )}
            </Text>

            <FormulaText 
              formula="ma = -kx → a = -(k/m)x"
              description={t('İvme, yer değiştirme ile ters orantılı', 'Acceleration is inversely proportional to displacement')}
            />

            <Text style={styles.subTitle}>
              {t('Genel Çözüm:', 'General Solution:')}
            </Text>
            <FormulaText 
              formula="x(t) = A cos(ωt + φ)"
              description={t('A: Genlik, ω: Açısal frekans, φ: Faz sabiti', 'A: Amplitude, ω: Angular frequency, φ: Phase constant')}
            />
          </View>

          {/* Kinematik Büyüklükler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kinematik Büyüklükler', 'Kinematic Quantities')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Konum:', 'Position:')}
            </Text>
            <FormulaText 
              formula="x(t) = A cos(ωt + φ)"
              description={t('Zamana bağlı konum', 'Position as function of time')}
            />

            <Text style={styles.subTitle}>
              {t('Hız:', 'Velocity:')}
            </Text>
            <FormulaText 
              formula="v(t) = -Aω sin(ωt + φ)"
              description={t('Maksimum hız: v_max = Aω', 'Maximum velocity: v_max = Aω')}
            />

            <Text style={styles.subTitle}>
              {t('İvme:', 'Acceleration:')}
            </Text>
            <FormulaText 
              formula="a(t) = -Aω² cos(ωt + φ) = -ω²x"
              description={t('Maksimum ivme: a_max = Aω²', 'Maximum acceleration: a_max = Aω²')}
            />

            <Text style={styles.subTitle}>
              {t('Açısal Frekans:', 'Angular Frequency:')}
            </Text>
            <FormulaText 
              formula="ω = √(k/m) = 2πf = 2π/T"
              description={t('f: Frekans (Hz), T: Periyot (s)', 'f: Frequency (Hz), T: Period (s)')}
            />
          </View>

          {/* Yay-Kütle Sistemi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Yay-Kütle Sistemi', 'Spring-Mass System')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Yay-kütle sistemi, basit harmonik hareketin en klasik örneğidir. Bir uçtan sabitlenmiş yaya bağlı kütle, denge konumu etrafında salınım yapar.',
                'The spring-mass system is the most classic example of simple harmonic motion. A mass attached to a spring fixed at one end oscillates around its equilibrium position.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Periyot Formülü:', 'Period Formula:')}
            </Text>
            <FormulaText 
              formula="T = 2π√(m/k)"
              description={t('Periyot sadece kütle ve yay sabitine bağlı', 'Period depends only on mass and spring constant')}
            />

            <Text style={styles.subTitle}>
              {t('Önemli Sonuçlar:', 'Important Results:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Periyot genlikten bağımsızdır (izokronizm)',
                '• Period is independent of amplitude (isochronism)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Ağır cisimler daha yavaş salınır (T ∝ √m)',
                '• Heavier objects oscillate slower (T ∝ √m)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Sert yaylar daha hızlı salınım yapar (T ∝ 1/√k)',
                '• Stiffer springs oscillate faster (T ∝ 1/√k)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Maksimum hız denge konumunda, maksimum ivme uç noktalarda',
                '• Maximum velocity at equilibrium, maximum acceleration at extremes'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yay Sabiti:', 'Spring Constant:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Yay sabiti, yayın sertliğinin ölçüsüdür. Yüksek k değeri sert yay, düşük k değeri yumuşak yay anlamına gelir.',
                'Spring constant is a measure of spring stiffness. High k value means stiff spring, low k value means soft spring.'
              )}
            </Text>
            <FormulaText 
              formula="k = mg/Δx_statik"
              description={t('Statik denge konumundan hesaplama', 'Calculation from static equilibrium position')}
            />
          </View>

          {/* Sarkaç Hareketi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Sarkaç Hareketi', 'Pendulum Motion')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Sarkaç, bir ipe veya çubuğa bağlı kütlenin yerçekimi altında salınım yapmasıdır. Küçük açılar için sarkaç hareketi basit harmonik hareket yapar.',
                'A pendulum is the oscillation of a mass attached to a string or rod under gravity. For small angles, pendulum motion exhibits simple harmonic motion.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Basit Sarkaç:', 'Simple Pendulum:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Noktasal kütlenin ipte salınımı. Küçük açılar için (θ < 15°) geri yönlendirici kuvvet:',
                'Oscillation of point mass on string. For small angles (θ < 15°), restoring force:'
              )}
            </Text>
            <FormulaText 
              formula="F = -mg sin θ ≈ -mgθ"
              description={t('Küçük açı yaklaşımı: sin θ ≈ θ', 'Small angle approximation: sin θ ≈ θ')}
            />

            <Text style={styles.subTitle}>
              {t('Sarkaç Periyodu:', 'Pendulum Period:')}
            </Text>
            <FormulaText 
              formula="T = 2π√(L/g)"
              description={t('L: İp uzunluğu (m), g: Yerçekimi ivmesi (m/s²)', 'L: String length (m), g: Gravitational acceleration (m/s²)')}
            />

            <Text style={styles.subTitle}>
              {t('Fiziksel Sarkaç:', 'Physical Pendulum:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Gerçek boyutlu cismin bir eksen etrafında salınımı. Atalet momenti dikkate alınır.',
                'Oscillation of real-sized object about an axis. Moment of inertia is considered.'
              )}
            </Text>
            <FormulaText 
              formula="T = 2π√(I/mgd)"
              description={t('I: Atalet momenti, d: Kütle merkezi-eksen mesafesi', 'I: Moment of inertia, d: Distance from center of mass to axis')}
            />

            <Text style={styles.subTitle}>
              {t('Sarkaç Özellikleri:', 'Pendulum Properties:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Periyot kütleden bağımsızdır',
                '• Period is independent of mass'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Uzun sarkaçlar daha yavaş salınır',
                '• Longer pendulums oscillate slower'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Güçlü yerçekimi alanında daha hızlı salınır',
                '• Oscillates faster in stronger gravitational field'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Büyük açılarda periyot artış gösterir',
                '• Period increases for large angles'
              )}
            </Text>
          </View>

          {/* Enerji Analizi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Enerji Analizi', 'Energy Analysis')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Basit harmonik harekette, kinetik ve potansiyel enerji sürekli birbirine dönüşür. Toplam mekanik enerji sabit kalır.',
                'In simple harmonic motion, kinetic and potential energy continuously convert into each other. Total mechanical energy remains constant.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yay-Kütle Sistemi Enerjisi:', 'Spring-Mass System Energy:')}
            </Text>
            
            <FormulaText 
              formula="E_kinetik = ½mv² = ½mA²ω² sin²(ωt + φ)"
              description={t('Kinetik enerji', 'Kinetic energy')}
            />

            <FormulaText 
              formula="E_potansiyel = ½kx² = ½kA² cos²(ωt + φ)"
              description={t('Potansiyel enerji', 'Potential energy')}
            />

            <FormulaText 
              formula="E_toplam = ½kA² = ½mA²ω²"
              description={t('Toplam mekanik enerji (sabit)', 'Total mechanical energy (constant)')}
            />

            <Text style={styles.subTitle}>
              {t('Sarkaç Enerjisi:', 'Pendulum Energy:')}
            </Text>
            
            <FormulaText 
              formula="E_kinetik = ½mv² = ½mL²(dθ/dt)²"
              description={t('Sarkaç kinetik enerjisi', 'Pendulum kinetic energy')}
            />

            <FormulaText 
              formula="E_potansiyel = mgh = mgL(1 - cos θ)"
              description={t('Sarkaç potansiyel enerjisi', 'Pendulum potential energy')}
            />

            <Text style={styles.subTitle}>
              {t('Enerji Dağılımı:', 'Energy Distribution:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Denge konumunda: Maksimum kinetik, minimum potansiyel enerji',
                '• At equilibrium: Maximum kinetic, minimum potential energy'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Uç noktalarda: Maksimum potansiyel, sıfır kinetik enerji',
                '• At extremes: Maximum potential, zero kinetic energy'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Toplam enerji genliğin karesi ile orantılı (E ∝ A²)',
                '• Total energy proportional to square of amplitude (E ∝ A²)'
              )}
            </Text>
          </View>

          {/* Sönümlü Salınımlar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Sönümlü Salınımlar', 'Damped Oscillations')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Gerçek sistemlerde sürtünme ve hava direnci gibi sönümleme kuvvetleri vardır. Bu kuvvetler salınım enerjisini azaltır ve genlik zamanla düşer.',
                'Real systems have damping forces like friction and air resistance. These forces reduce oscillation energy and amplitude decreases with time.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Sönümleme Türleri:', 'Types of Damping:')}
            </Text>
            
            <Text style={styles.listItem}>
              {t(
                '• Zayıf sönümleme: Salınım devam eder, genlik azalır',
                '• Light damping: Oscillation continues, amplitude decreases'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kritik sönümleme: En hızlı denge konumuna dönüş',
                '• Critical damping: Fastest return to equilibrium'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Aşırı sönümleme: Yavaş denge konumuna dönüş, salınım yok',
                '• Over damping: Slow return to equilibrium, no oscillation'
              )}
            </Text>

            <FormulaText 
              formula="x(t) = Ae^(-γt) cos(ω't + φ)"
              description={t('γ: Sönümleme sabiti, ω\': Sönümlü frekans', 'γ: Damping constant, ω\': Damped frequency')}
            />
          </View>

          {/* Zorunlu Salınımlar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Zorunlu Salınımlar ve Rezonans', 'Forced Oscillations and Resonance')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Sisteme dışarıdan periyodik bir kuvvet uygulandığında zorunlu salınım oluşur. Uygulanan frekans sistemin doğal frekansına eşit olduğunda rezonans meydana gelir.',
                'Forced oscillation occurs when an external periodic force is applied to the system. Resonance occurs when the applied frequency equals the system\'s natural frequency.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Rezonans Özellikleri:', 'Resonance Properties:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Maksimum enerji transferi ve genlik',
                '• Maximum energy transfer and amplitude'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Sönümleme azaldıkça rezonans keskinleşir',
                '• Resonance sharpens as damping decreases'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Yapısal hasarlara neden olabilir',
                '• Can cause structural damage'
              )}
            </Text>

            <FormulaText 
              formula="f_rezonans = f_doğal = 1/(2π)√(k/m)"
              description={t('Rezonans frekansı', 'Resonance frequency')}
            />
          </View>

          {/* Günlük Hayat Örnekleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Günlük Hayat Örnekleri', 'Daily Life Examples')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Saat Sarkacı', 'Clock Pendulum')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Hassas zaman ölçümü için düzenli salınım',
                    'Regular oscillation for precise time measurement'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Araba Süspansiyonu', 'Car Suspension')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Yol bozukluklarını sönümleme',
                    'Damping road irregularities'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Müzik Aletleri', 'Musical Instruments')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Tel, hava kolonları titreşimi',
                    'Vibration of strings, air columns'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Deprem Sismografı', 'Earthquake Seismograph')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Yer sarsıntılarını kaydetme',
                    'Recording ground vibrations'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Kristal Osilatör', 'Crystal Oscillator')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Elektronik devrelerde zaman referansı',
                    'Time reference in electronic circuits'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Bina Titreşimleri', 'Building Vibrations')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Rüzgar ve deprem etkilerine karşı tasarım',
                    'Design against wind and earthquake effects'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Modern Uygulamalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Modern Teknoloji Uygulamaları', 'Modern Technology Applications')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('MEMS Osilatörler', 'MEMS Oscillators')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Mikro elektro-mekanik sistemler',
                    'Micro electro-mechanical systems'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Atomik Saat', 'Atomic Clock')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Atom geçişlerinin salınımı',
                    'Oscillation of atomic transitions'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Lazer Sistemi', 'Laser System')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Optik rezonatörde ışık salınımı',
                    'Light oscillation in optical resonator'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Titreşim Sensörleri', 'Vibration Sensors')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Makine arızalarını tespit etme',
                    'Detecting machine failures'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Ultrasounik Temizlik', 'Ultrasonic Cleaning')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Yüksek frekanslı titreşimle temizlik',
                    'Cleaning with high frequency vibration'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Kablosuz Enerji', 'Wireless Energy')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Elektromanyetik rezonansla enerji transferi',
                    'Energy transfer via electromagnetic resonance'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Problem Çözüm Teknikleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Problem Çözüm Teknikleri', 'Problem Solving Techniques')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yay-Kütle Problemleri:', 'Spring-Mass Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Sistemi tanımlayın (kütle, yay sabiti)',
                '1. Define the system (mass, spring constant)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Denge konumunu belirleyin',
                '2. Determine equilibrium position'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Başlangıç koşullarını yazın (x₀, v₀)',
                '3. Write initial conditions (x₀, v₀)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. ω = √(k/m) ve T = 2π/ω hesaplayın',
                '4. Calculate ω = √(k/m) and T = 2π/ω'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '5. Faz sabitini ve genliği bulun',
                '5. Find phase constant and amplitude'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Sarkaç Problemleri:', 'Pendulum Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Sarkaç türünü belirleyin (basit/fiziksel)',
                '1. Determine pendulum type (simple/physical)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Küçük açı yaklaşımı geçerli mi kontrol edin',
                '2. Check if small angle approximation is valid'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Uygun periyot formülünü uygulayın',
                '3. Apply appropriate period formula'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Fiziksel sarkaç için atalet momentini hesaplayın',
                '4. Calculate moment of inertia for physical pendulum'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Enerji Problemleri:', 'Energy Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Enerji korunumunu uygulayın',
                '1. Apply energy conservation'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Kinetik ve potansiyel enerji ifadelerini yazın',
                '2. Write kinetic and potential energy expressions'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Maksimum hız ve genlik ilişkisini kullanın',
                '3. Use relationship between maximum velocity and amplitude'
              )}
            </Text>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Basit harmonik hareket, fiziğin temel konularından biri olup doğada ve teknolojide yaygın olarak karşımıza çıkar. Bu hareket türünün anlaşılması, dalgalar, elektromanyetik salınımlar, kuantum mekaniği ve birçok mühendislik uygulaması için kritik öneme sahiptir.',
                'Simple harmonic motion is one of the fundamental topics in physics and is widely encountered in nature and technology. Understanding this type of motion is critically important for waves, electromagnetic oscillations, quantum mechanics, and many engineering applications.'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Günümüzde MEMS teknolojisinden atom saatlerine, müzik enstrümanlarından deprem mühendisliğine kadar birçok alanda basit harmonik hareketin prensipleri kullanılmaktadır.',
                'Today, the principles of simple harmonic motion are used in many fields from MEMS technology to atomic clocks, from musical instruments to earthquake engineering.'
              )}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4b5563',
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4b5563',
    marginBottom: 6,
    paddingLeft: 8,
  },
  definitionBox: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
    padding: 16,
    marginVertical: 12,
    borderRadius: 8,
  },
  definitionText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#0c4a6e',
    fontWeight: '500',
  },
  formulaBox: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formula: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  formulaDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  applicationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  applicationCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  applicationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  applicationText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
}); 