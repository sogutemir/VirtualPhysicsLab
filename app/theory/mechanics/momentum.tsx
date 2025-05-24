import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';

export default function MomentumTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Momentum ve Korunumu', 'Momentum and Conservation')}
      titleEn="Momentum and Conservation"
      difficulty={t('Orta Seviye', 'Intermediate Level')}
      difficultyEn="Intermediate Level"
      description={t(
        'Momentum kavramı, korunum yasaları ve çarpışma dinamikleri üzerine kapsamlı bir inceleme',
        'A comprehensive study on the concept of momentum, conservation laws, and collision dynamics'
      )}
      descriptionEn="A comprehensive study on the concept of momentum, conservation laws, and collision dynamics"
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
              {t('Momentum Nedir?', 'What is Momentum?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Momentum (hareket miktarı), bir cismin kütle ve hız çarpımı olarak tanımlanan fiziksel bir büyüklüktür. Vektörel bir büyüklük olan momentum, cismin hareket durumunu tam olarak karakterize eder ve çarpışma analizlerinde kritik rol oynar.',
                'Momentum is a physical quantity defined as the product of mass and velocity of an object. Being a vector quantity, momentum completely characterizes the motion state of an object and plays a critical role in collision analysis.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>p = m × v</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'p: Momentum (kg⋅m/s), m: Kütle (kg), v: Hız vektörü (m/s)',
                  'p: Momentum (kg⋅m/s), m: Mass (kg), v: Velocity vector (m/s)'
                )}
              </Text>
            </View>
          </View>

          {/* Momentum Korunum Yasası */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Momentum Korunum Yasası', 'Law of Conservation of Momentum')}
            </Text>
            <View style={styles.lawBox}>
              <Text style={styles.lawText}>
                {t(
                  '"Kapalı bir sistemde, dış kuvvetlerin yokluğunda toplam momentum sabit kalır."',
                  '"In a closed system, in the absence of external forces, the total momentum remains constant."'
                )}
              </Text>
            </View>
            <Text style={styles.paragraph}>
              {t(
                "Bu temel korunum yasası, Newton'un üçüncü yasasından türetilir. İki veya daha fazla cismin etkileşime girdiği durumlarda, sistem toplam momentumu çarpışma öncesi ve sonrası aynı kalır. Bu ilke, atom altı parçacıklardan galaksilere kadar her ölçekte geçerlidir.",
                "This fundamental conservation law is derived from Newton's third law. In situations where two or more objects interact, the total momentum of the system remains the same before and after collision. This principle is valid at every scale from subatomic particles to galaxies."
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>p₁ᵢ + p₂ᵢ = p₁f + p₂f</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'i: Başlangıç durumu, f: Son durum',
                  'i: Initial state, f: Final state'
                )}
              </Text>
            </View>
          </View>

          {/* Çarpışma Türleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Çarpışma Türleri', 'Types of Collisions')}
            </Text>

            <Text style={styles.subTitle}>
              {t('1. Elastik Çarpışmalar', '1. Elastic Collisions')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Hem momentum hem de kinetik enerji korunduğu çarpışmalardır. Gerçek hayatta tam elastik çarpışma nadir görülür, ancak bilardo topları ve gaz molekülleri arasındaki çarpışmalar bu duruma yakındır.',
                'These are collisions where both momentum and kinetic energy are conserved. Perfectly elastic collisions are rare in real life, but collisions between billiard balls and gas molecules are close to this condition.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>
                ½m₁v₁ᵢ² + ½m₂v₂ᵢ² = ½m₁v₁f² + ½m₂v₂f²
              </Text>
              <Text style={styles.formulaDesc}>
                {t('Kinetik enerji korunumu', 'Kinetic energy conservation')}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t('2. İnelastik Çarpışmalar', '2. Inelastic Collisions')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Momentum korunur ancak kinetik enerji korunmaz. Bir kısmı ses, ısı veya deformasyon enerjisine dönüşür. Günlük yaşamdaki çoğu çarpışma bu türdendir.',
                'Momentum is conserved but kinetic energy is not. Some of it is converted to sound, heat, or deformation energy. Most collisions in daily life are of this type.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t(
                '3. Tam İnelastik Çarpışmalar',
                '3. Perfectly Inelastic Collisions'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çarpışan cisimler birbirine yapışır ve aynı hızla hareket ederler. Maksimum kinetik enerji kaybının yaşandığı durumdur.',
                'The colliding objects stick together and move with the same velocity. This is the case of maximum kinetic energy loss.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>vf = (m₁v₁ᵢ + m₂v₂ᵢ)/(m₁ + m₂)</Text>
              <Text style={styles.formulaDesc}>
                {t('Ortak son hız', 'Common final velocity')}
              </Text>
            </View>
          </View>

          {/* İmpuls */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('İmpuls (Momentum Değişimi)', 'Impulse (Change in Momentum)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İmpuls, bir cisme uygulanan kuvvetin zamanla çarpımıdır ve momentum değişimine eşittir. Bu kavram, kısa süreli büyük kuvvetlerin etkilerini anlamada kritiktir.',
                'Impulse is the product of force applied to an object and time, and it equals the change in momentum. This concept is critical in understanding the effects of short-duration large forces.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>J = F⋅Δt = Δp</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'J: İmpuls (N⋅s), F: Kuvvet (N), Δt: Zaman (s), Δp: Momentum değişimi',
                  'J: Impulse (N⋅s), F: Force (N), Δt: Time (s), Δp: Change in momentum'
                )}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t('İmpuls Uygulamaları:', 'Impulse Applications:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Hava yastıkları: Çarpışma süresini uzatarak kuvveti azaltır',
                '• Airbags: Reduce force by extending collision time'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Spor ayakkabıları: Koşu sırasında darbe emilimi',
                '• Sports shoes: Impact absorption during running'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Roket motorları: Sürekli itki için yakıt yakımı',
                '• Rocket engines: Fuel combustion for continuous thrust'
              )}
            </Text>
          </View>

          {/* Gerçek Hayat Uygulamaları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Gerçek Hayat Uygulamaları', 'Real Life Applications')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Otomotiv Güvenliği', 'Automotive Safety')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Kaza testleri, güvenlik sistemleri tasarımı, çarpışma analizi',
                    'Crash tests, safety system design, collision analysis'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Uzay Teknolojisi', 'Space Technology')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Uzay araçları manevraları, uydu yörünge değişiklikleri',
                    'Spacecraft maneuvers, satellite orbit changes'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Spor Bilimleri', 'Sports Sciences')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Top sporlarında çarpışma analizi, performans optimizasyonu',
                    'Collision analysis in ball sports, performance optimization'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Endüstriyel Tasarım', 'Industrial Design')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Makinelerin titreşim kontrolü, darbe emici sistemler',
                    'Machine vibration control, shock absorbing systems'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Moleküler Düzeyde Momentum */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Moleküler Düzeyde Momentum', 'Momentum at Molecular Level')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Kinetik teori, gazların basıncını moleküllerin momentum transferi ile açıklar. Moleküller kap duvarlarına çarparak momentum transfer eder ve bu da makroskopik basınç olarak gözlemlenir.',
                'Kinetic theory explains gas pressure through momentum transfer of molecules. Molecules transfer momentum by colliding with container walls, which is observed as macroscopic pressure.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>P = (1/3)nm⟨v²⟩</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'P: Basınç, n: Molekül yoğunluğu, m: Molekül kütlesi, ⟨v²⟩: Ortalama hız karesi',
                  'P: Pressure, n: Molecular density, m: Molecular mass, ⟨v²⟩: Mean square velocity'
                )}
              </Text>
            </View>
          </View>

          {/* Problem Çözüm Stratejileri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Problem Çözüm Stratejileri', 'Problem Solving Strategies')}
            </Text>
            <Text style={styles.subTitle}>
              {t(
                'Çarpışma Problemleri İçin Adımlar:',
                'Steps for Collision Problems:'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Sistemi tanımlayın ve dış kuvvetleri belirleyin',
                '1. Define the system and identify external forces'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('2. Koordinat sistemi seçin', '2. Choose a coordinate system')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Başlangıç ve son momentumları hesaplayın',
                '3. Calculate initial and final momenta'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Momentum korunumunu uygulayın',
                '4. Apply conservation of momentum'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '5. Gerekirse enerji korunumunu da kullanın',
                '5. Use energy conservation if necessary'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '6. Çözümün fiziksel anlamını kontrol edin',
                '6. Check the physical meaning of the solution'
              )}
            </Text>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Momentum ve korunum yasaları, fiziğin en temel prensiplerinden biridir. Mikroskopik parçacıklardan makroskopik cisimlere, atom çekirdeği reaksiyonlarından galaksi çarpışmalarına kadar her ölçekte geçerlidir. Bu kavramların anlaşılması, modern teknolojinin gelişiminde ve doğa olaylarının açıklanmasında kritik öneme sahiptir.',
                'Momentum and conservation laws are among the most fundamental principles of physics. They are valid at every scale, from microscopic particles to macroscopic objects, from nuclear reactions to galaxy collisions. Understanding these concepts is critically important for the development of modern technology and explanation of natural phenomena.'
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
  lawBox: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
    padding: 16,
    marginVertical: 12,
    borderRadius: 8,
  },
  lawText: {
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
