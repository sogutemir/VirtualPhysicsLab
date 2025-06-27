import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function FreeFallGravityTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Serbest Düşüş ve Yerçekimi', 'Free Fall and Gravity')}
      titleEn="Free Fall and Gravity"
      difficulty={t('Temel Seviye', 'Basic Level')}
      difficultyEn="Basic Level"
      description={t(
        'Yerçekimi kuvveti, serbest düşüş hareketi ve evrensel çekim yasası',
        'Gravitational force, free fall motion and universal law of gravitation'
      )}
      descriptionEn="Gravitational force, free fall motion and universal law of gravitation"
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
              {t('Yerçekimi Nedir?', 'What is Gravity?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Yerçekimi, kütleye sahip her cismin diğer kütleli cisimleri kendine çekme kuvvetidir. Bu temel kuvvet, gezegenlerden atomlara kadar tüm maddeyi etkiler ve evrenin yapısını şekillendirir.',
                'Gravity is the force by which every object with mass attracts other objects with mass. This fundamental force affects all matter from planets to atoms and shapes the structure of the universe.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Yerçekimi, doğanın dört temel kuvvetinden biridir ve en zayıf olmakla birlikte en uzun menzilli kuvvettir.',
                  'Gravity is one of the four fundamental forces of nature and is the weakest yet longest-range force.'
                )}
              </Text>
            </View>
          </View>

          {/* Tarihi Gelişim */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Tarihi Gelişim', 'Historical Development')}
            </Text>
            
            <Text style={styles.subTitle}>
              {t('Aristoteles (384-322 MÖ)', 'Aristotle (384-322 BC)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Ağır cisimlerin hafif cisimlerden daha hızlı düştüğünü iddia etti. Bu görüş 2000 yıl boyunca kabul edildi.',
                'Claimed that heavy objects fall faster than light objects. This view was accepted for 2000 years.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Galileo Galilei (1564-1642)', 'Galileo Galilei (1564-1642)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Pisa Kulesi deneyleri ile tüm cisimlerin (hava direnci olmadığında) aynı hızla düştüğünü kanıtladı. Serbest düşüş ivmesini keşfetti.',
                'Proved with Leaning Tower of Pisa experiments that all objects fall at the same rate (in the absence of air resistance). Discovered free fall acceleration.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Isaac Newton (1642-1727)', 'Isaac Newton (1642-1727)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Evrensel çekim yasasını formüle etti. Yerçekiminin kütleler arasındaki temel bir kuvvet olduğunu açıkladı.',
                'Formulated the universal law of gravitation. Explained that gravity is a fundamental force between masses.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Albert Einstein (1879-1955)', 'Albert Einstein (1879-1955)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Genel görelilik teorisi ile yerçekimini uzay-zamanın eğriliği olarak yeniden tanımladı.',
                'Redefined gravity as the curvature of space-time with general relativity theory.'
              )}
            </Text>
          </View>

          {/* Serbest Düşüş */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Serbest Düşüş Hareketi', 'Free Fall Motion')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Serbest düşüş hareketi, cisimler üzerine sadece yerçekimi kuvvetinin etki ettiği durumdur. Bu durumda tüm cisimler, kütlelerine bakılmaksızın aynı ivme ile hareket eder.',
                'Free fall motion is when only gravitational force acts on objects. In this case, all objects move with the same acceleration regardless of their mass.'
              )}
            </Text>

            <FormulaText 
              formula="g = 9.8 m/s²"
              description={t('Yerçekimi ivmesi (Dünya yüzeyinde)', 'Gravitational acceleration (at Earth\'s surface)')}
            />

            <Text style={styles.subTitle}>
              {t('Serbest Düşüş Denklemleri:', 'Free Fall Equations:')}
            </Text>
            
            <FormulaText 
              formula="v = gt"
              description={t('Hız-zaman ilişkisi (v₀ = 0 için)', 'Velocity-time relationship (for v₀ = 0)')}
            />

            <FormulaText 
              formula="h = ½gt²"
              description={t('Konum-zaman ilişkisi (h₀ = 0 için)', 'Position-time relationship (for h₀ = 0)')}
            />

            <FormulaText 
              formula="v² = 2gh"
              description={t('Hız-konum ilişkisi', 'Velocity-position relationship')}
            />

            <Text style={styles.subTitle}>
              {t('Genel Kinematik Denklemler:', 'General Kinematic Equations:')}
            </Text>
            
            <FormulaText 
              formula="v = v₀ + gt"
              description={t('v₀: Başlangıç hızı, pozitif yön yukarı', 'v₀: Initial velocity, positive direction upward')}
            />

            <FormulaText 
              formula="h = h₀ + v₀t + ½gt²"
              description={t('h₀: Başlangıç yüksekliği', 'h₀: Initial height')}
            />
          </View>

          {/* Newton'un Evrensel Çekim Yasası */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Evrensel Çekim Yasası', 'Universal Law of Gravitation')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Newton\'un evrensel çekim yasası, iki kütle arasındaki çekim kuvvetini matematiksel olarak tanımlar. Bu yasa, gezegenlerden atom altı parçacıklara kadar tüm kütleli cisimlere uygulanır.',
                'Newton\'s universal law of gravitation mathematically defines the gravitational force between two masses. This law applies to all massive objects from planets to subatomic particles.'
              )}
            </Text>

            <FormulaText 
              formula="F = G × (m₁m₂)/r²"
              description={t('G: Evrensel çekim sabiti (6.674×10⁻¹¹ N⋅m²/kg²)', 'G: Universal gravitational constant (6.674×10⁻¹¹ N⋅m²/kg²)')}
            />

            <Text style={styles.subTitle}>
              {t('Yasanın Özellikleri:', 'Properties of the Law:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kuvvet her iki kütleye de eşit büyüklükte etki eder (Newton\'un 3. yasası)',
                '• Force acts on both masses with equal magnitude (Newton\'s 3rd law)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kuvvet mesafenin karesi ile ters orantılıdır',
                '• Force is inversely proportional to the square of distance'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kuvvet kütlelerin çarpımı ile doğru orantılıdır',
                '• Force is directly proportional to the product of masses'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Çekim kuvveti her zaman çekici yöndedir',
                '• Gravitational force is always attractive'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Dünya Yüzeyindeki Yerçekimi:', 'Gravity at Earth\'s Surface:')}
            </Text>
            <FormulaText 
              formula="g = GM_Dünya/R_Dünya²"
              description={t('M_Dünya = 5.97×10²⁴ kg, R_Dünya = 6.37×10⁶ m', 'M_Earth = 5.97×10²⁴ kg, R_Earth = 6.37×10⁶ m')}
            />
          </View>

          {/* Yerçekimi Alanı */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Yerçekimi Alanı', 'Gravitational Field')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Yerçekimi alanı, bir kütlenin etrafındaki uzayda oluşturduğu etkileşim alanıdır. Bu alan, diğer kütlelerin o uzayda hissedeceği birim kütle başına kuvveti tanımlar.',
                'Gravitational field is the interaction field created by a mass in the surrounding space. This field defines the force per unit mass that other masses would experience in that space.'
              )}
            </Text>

            <FormulaText 
              formula="g = F/m = GM/r²"
              description={t('g: Yerçekimi alan şiddeti (N/kg = m/s²)', 'g: Gravitational field strength (N/kg = m/s²)')}
            />

            <Text style={styles.paragraph}>
              {t(
                'Yerçekimi alanının boyutu teorik olarak sonsuzdur, ancak mesafe arttıkça hızla zayıflar. Dünya\'nın yerçekimi alanı uzaya kadar uzanır.',
                'The size of gravitational field is theoretically infinite, but it weakens rapidly with distance. Earth\'s gravitational field extends into space.'
              )}
            </Text>
          </View>

          {/* Hava Direnci */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Hava Direnci Etkisi', 'Air Resistance Effect')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Gerçek dünyada cisimler düşerken hava direnci ile karşılaşır. Bu durum, cismin şeklini, boyutunu ve hızını etkileyerek düşüş hareketini karmaşıklaştırır.',
                'In the real world, objects encounter air resistance when falling. This complicates the falling motion by affecting the object\'s shape, size, and speed.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Hava Direnci Özellikleri:', 'Air Resistance Properties:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Hızın karesi ile orantılı artar: F_drag ∝ v²',
                '• Increases proportionally with the square of velocity: F_drag ∝ v²'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Cismin kesit alanı ile doğru orantılı',
                '• Directly proportional to object\'s cross-sectional area'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Hareket yönünün tersine etkir',
                '• Acts opposite to the direction of motion'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Sıcaklık ve basınçla değişir',
                '• Varies with temperature and pressure'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Terminal Hız:', 'Terminal Velocity:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Hava direnci yerçekimi kuvvetine eşit olduğunda cisim sabit hızla düşmeye başlar. Bu hıza terminal hız denir.',
                'When air resistance equals gravitational force, the object begins to fall at constant velocity. This velocity is called terminal velocity.'
              )}
            </Text>

            <FormulaText 
              formula="v_terminal = √(2mg/ρAC_d)"
              description={t('ρ: Hava yoğunluğu, A: Kesit alanı, C_d: Sürüklenme katsayısı', 'ρ: Air density, A: Cross-sectional area, C_d: Drag coefficient')}
            />
          </View>

          {/* Gezegen Yerçekimleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Farklı Gezegenlerde Yerçekimi', 'Gravity on Different Planets')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Her gezegenin kütlesi ve yarıçapı farklı olduğu için yüzey yerçekimi ivmeleri de farklıdır. Bu farklar, cismin ağırlığını değiştirir ancak kütlesini etkilemez.',
                'Since each planet has different mass and radius, their surface gravitational accelerations are also different. These differences change the weight of objects but do not affect their mass.'
              )}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Merkür', 'Mercury')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('g = 3.7 m/s²', 'g = 3.7 m/s²')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Venüs', 'Venus')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('g = 8.9 m/s²', 'g = 8.9 m/s²')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Dünya', 'Earth')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('g = 9.8 m/s²', 'g = 9.8 m/s²')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Mars', 'Mars')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('g = 3.7 m/s²', 'g = 3.7 m/s²')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Jüpiter', 'Jupiter')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('g = 24.8 m/s²', 'g = 24.8 m/s²')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Ay', 'Moon')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('g = 1.6 m/s²', 'g = 1.6 m/s²')}
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
                  {t('GPS Sistemleri', 'GPS Systems')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Uydu yörüngeleri ve zaman düzeltmeleri',
                    'Satellite orbits and time corrections'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Uzay Araçları', 'Spacecraft')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Yörünge mekaniği, gezegen arası seyahat',
                    'Orbital mechanics, interplanetary travel'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Gelgit Enerjisi', 'Tidal Energy')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Ay-Dünya çekim kuvvetinden enerji üretimi',
                    'Energy generation from Moon-Earth gravitational force'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Mikro-yerçekimi', 'Microgravity')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Uzay istasyonlarında bilimsel deneyler',
                    'Scientific experiments in space stations'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Çekim Dalgaları', 'Gravitational Waves')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'LIGO detektörleri, kara delik çarpışmaları',
                    'LIGO detectors, black hole collisions'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Jeodezi', 'Geodesy')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Dünya\'nın şekli ve yerçekimi haritası',
                    'Earth\'s shape and gravity mapping'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Günlük Hayat Örnekleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Günlük Hayattan Örnekler', 'Examples from Daily Life')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Serbest Düşüş Örnekleri:', 'Free Fall Examples:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Yağmur damlalarının düşmesi (terminal hız etkisi)',
                '• Falling raindrops (terminal velocity effect)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Paraşütçünün atlayışı (hava direnci kontrolü)',
                '• Parachutist jump (air resistance control)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Asansör hızlanması (serbest düşüş hissi)',
                '• Elevator acceleration (free fall sensation)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Atlama sporları (başlangıç hızı etkisi)',
                '• Jumping sports (initial velocity effect)'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yerçekimi Etkisi Örnekleri:', 'Gravity Effect Examples:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Su damlalarının şekli (yüzey gerilimi vs yerçekimi)',
                '• Shape of water drops (surface tension vs gravity)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kan dolaşımı (kalbin yerçekimine karşı çalışması)',
                '• Blood circulation (heart working against gravity)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Bitkilerin büyümesi (gravitropizm)',
                '• Plant growth (gravitropism)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• İnsan vücut yapısı (yerçekimine adaptasyon)',
                '• Human body structure (adaptation to gravity)'
              )}
            </Text>
          </View>

          {/* Problem Çözüm Teknikleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Problem Çözüm Teknikleri', 'Problem Solving Techniques')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Serbest Düşüş Problemleri:', 'Free Fall Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Koordinat sistemi belirleyin (genelde yukarı pozitif)',
                '1. Define coordinate system (usually upward positive)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Verilen değerleri listeleyin (h₀, v₀, t, g)',
                '2. List given values (h₀, v₀, t, g)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Uygun kinematik denklemi seçin',
                '3. Choose appropriate kinematic equation'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. İşaretlere dikkat edin (yukarı +, aşağı -)',
                '4. Pay attention to signs (upward +, downward -)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '5. Sonucun fiziksel anlamını kontrol edin',
                '5. Check physical meaning of result'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Çekim Kuvveti Problemleri:', 'Gravitational Force Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Kütleleri ve mesafeleri belirleyin',
                '1. Identify masses and distances'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Newton\'un evrensel çekim yasasını uygulayın',
                '2. Apply Newton\'s universal law of gravitation'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Kuvvet vektörlerinin yönlerini çizin',
                '3. Draw directions of force vectors'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Gerekirse süperposisyon ilkesini kullanın',
                '4. Use superposition principle if necessary'
              )}
            </Text>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Yerçekimi ve serbest düşüş, fiziğin en temel kavramlarından biridir. Newton\'un evrensel çekim yasasından Einstein\'ın genel görelilik teorisine kadar, yerçekiminin anlaşılması bilim tarihinin en büyük keşiflerinden bazılarına yol açmıştır.',
                'Gravity and free fall are among the most fundamental concepts in physics. From Newton\'s universal law of gravitation to Einstein\'s general theory of relativity, understanding gravity has led to some of the greatest discoveries in the history of science.'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Günümüzde GPS teknolojisinden uzay araştırmalarına, çekim dalgası detektörlerinden gelgit enerjisine kadar birçok alanda yerçekiminin etkilerini kullanmaktayız.',
                'Today we use the effects of gravity in many areas from GPS technology to space research, from gravitational wave detectors to tidal energy.'
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