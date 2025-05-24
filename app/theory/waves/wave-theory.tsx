import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';

export default function WaveTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Dalga Teorisi', 'Wave Theory')}
      titleEn="Wave Theory"
      difficulty={t('Orta Seviye', 'Intermediate Level')}
      difficultyEn="Intermediate Level"
      description={t(
        'Dalgaların temel özellikleri, türleri ve davranışları üzerine kapsamlı bir inceleme',
        'A comprehensive study on the fundamental properties, types, and behaviors of waves'
      )}
      descriptionEn="A comprehensive study on the fundamental properties, types, and behaviors of waves"
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
              {t('Dalga Nedir?', 'What is a Wave?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalga, enerjinin uzayda yayılmasının bir şeklidir. Madde transfer olmaksızın, enerji ve bilginin bir yerden başka bir yere taşınmasını sağlar. Dalgalar doğada her yerdedir: sesimizden ışığa, deprem dalgalarından radyo sinyallerine kadar.',
                'A wave is a form of energy propagation through space. It enables the transfer of energy and information from one place to another without matter transfer. Waves are everywhere in nature: from our voice to light, from earthquake waves to radio signals.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>v = f × λ</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'v: Dalga hızı (m/s), f: Frekans (Hz), λ: Dalga boyu (m)',
                  'v: Wave speed (m/s), f: Frequency (Hz), λ: Wavelength (m)'
                )}
              </Text>
            </View>
          </View>

          {/* Dalga Türleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Dalga Türleri', 'Types of Waves')}
            </Text>

            <Text style={styles.subTitle}>
              {t('1. Mekânik Dalgalar', '1. Mechanical Waves')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Yayılmak için bir ortama ihtiyaç duyan dalgalardır. Ses dalgaları, su dalgaları ve ip dalgaları bu kategoriye girer. Vakumda yayılamazlar.',
                'These are waves that need a medium to propagate. Sound waves, water waves, and string waves fall into this category. They cannot propagate in a vacuum.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Ses dalgaları: Hava, su veya katı maddeler içinde',
                '• Sound waves: In air, water, or solid materials'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Su dalgaları: Su yüzeyinde enerjinin yayılması',
                '• Water waves: Energy propagation on water surface'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Deprem dalgaları: Yerkabuğu içinde',
                "• Seismic waves: Within the Earth's crust"
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('2. Elektromanyetik Dalgalar', '2. Electromagnetic Waves')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Ortama ihtiyaç duymayan dalgalardır. Vakumda da yayılabilirler. Işık, radyo dalgaları, X-ışınları bu kategoriye girer.',
                'These are waves that do not need a medium. They can propagate in a vacuum. Light, radio waves, and X-rays fall into this category.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Işık dalgaları: Görünür spektrum (400-700 nm)',
                '• Light waves: Visible spectrum (400-700 nm)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Radyo dalgaları: İletişim ve yayıncılık',
                '• Radio waves: Communication and broadcasting'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• X-ışınları: Tıbbi görüntüleme',
                '• X-rays: Medical imaging'
              )}
            </Text>
          </View>

          {/* Dalga Özellikleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Dalga Özellikleri', 'Wave Properties')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Genlik (Amplitude)', 'Amplitude')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalganın denge konumundan maksimum sapmasıdır. Dalganın enerji taşıma kapasitesini belirler. Genlik ne kadar büyükse, dalga o kadar fazla enerji taşır.',
                "It is the maximum displacement of the wave from its equilibrium position. It determines the wave's energy carrying capacity. The larger the amplitude, the more energy the wave carries."
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Frekans (Frequency)', 'Frequency')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Birim zamanda geçen dalga sayısıdır. Hertz (Hz) birimi ile ölçülür. Frekans arttıkça dalga enerjisi de artar.',
                'It is the number of waves passing through a point per unit time. Measured in Hertz (Hz). As frequency increases, wave energy also increases.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Dalga Boyu (Wavelength)', 'Wavelength')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Ardışık iki tepe veya çukur arasındaki mesafedir. Lambda (λ) sembolü ile gösterilir. Dalga boyu ile frekans ters orantılıdır.',
                'It is the distance between two consecutive crests or troughs. Represented by the lambda (λ) symbol. Wavelength is inversely proportional to frequency.'
              )}
            </Text>

            <View style={styles.formulaBox}>
              <Text style={styles.formula}>E ∝ A² × f²</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'Dalga enerjisi, genliğin ve frekansın karesi ile doğru orantılıdır',
                  'Wave energy is proportional to the square of amplitude and frequency'
                )}
              </Text>
            </View>
          </View>

          {/* Dalga Davranışları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Dalga Davranışları', 'Wave Behaviors')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yansıma (Reflection)', 'Reflection')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalganın bir engele çarpıp geri dönmesidir. Yansıma açısı, gelme açısına eşittir. Ekolar ve aynalar bu prensibi kullanır.',
                'It is the bouncing back of a wave when it hits an obstacle. The angle of reflection equals the angle of incidence. Echoes and mirrors use this principle.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kırılma (Refraction)', 'Refraction')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalganın bir ortamdan başka bir ortama geçerken yön değiştirmesidir. Işığın camdan geçerken büküldmesi kırılmaya örnektir.',
                'It is the change of direction when a wave passes from one medium to another. Light bending when passing through glass is an example of refraction.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Girişim (Interference)', 'Interference')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İki veya daha fazla dalganın çakışmasıdır. Yapıcı girişimde dalgalar güçlenir, yıkıcı girişimde zayıflar.',
                'It is the overlapping of two or more waves. In constructive interference waves strengthen, in destructive interference they weaken.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kırınım (Diffraction)', 'Diffraction')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalganın engellerin etrafında bükülerek yayılmasıdır. Ses dalgalarının köşeleri dönebilmesi kırınıma örnektir.',
                'It is the bending of waves around obstacles. Sound waves being able to go around corners is an example of diffraction.'
              )}
            </Text>
          </View>

          {/* Ses Dalgaları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Ses Dalgaları', 'Sound Waves')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Ses, hava moleküllerinin titreşimi ile oluşan boyuna dalgalardır. İnsan kulağı 20 Hz ile 20,000 Hz arasındaki frekansları duyabilir.',
                'Sound consists of longitudinal waves created by the vibration of air molecules. The human ear can hear frequencies between 20 Hz and 20,000 Hz.'
              )}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Ses Hızı', 'Speed of Sound')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Havada: ~343 m/s (20°C)', 'In air: ~343 m/s (20°C)')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Doppler Etkisi', 'Doppler Effect')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Ambulans sireninin yaklaşıp uzaklaşması',
                    'Ambulance siren approaching and receding'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Sonar Teknolojisi', 'Sonar Technology')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Sualtı navigasyonu ve balık bulma',
                    'Underwater navigation and fish finding'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Tıbbi Ultrason', 'Medical Ultrasound')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Bebek görüntüleme, organ teşhisi',
                    'Baby imaging, organ diagnosis'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Işık Dalgaları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Işık Dalgaları', 'Light Waves')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Işık, elektromanyetik spektrumun görünür kısmını oluşturan enine dalgalardır. Vakumda ışık hızı evrensel bir sabittir: c = 299,792,458 m/s',
                'Light consists of transverse waves that form the visible part of the electromagnetic spectrum. The speed of light in vacuum is a universal constant: c = 299,792,458 m/s'
              )}
            </Text>

            <View style={styles.formulaBox}>
              <Text style={styles.formula}>E = h × f</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'E: Foton enerjisi, h: Planck sabiti, f: Frekans',
                  'E: Photon energy, h: Planck constant, f: Frequency'
                )}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t('Görünür Spektrum:', 'Visible Spectrum:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Kırmızı: 620-750 nm', '• Red: 620-750 nm')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Turuncu: 590-620 nm', '• Orange: 590-620 nm')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Sarı: 570-590 nm', '• Yellow: 570-590 nm')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yeşil: 495-570 nm', '• Green: 495-570 nm')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Mavi: 450-495 nm', '• Blue: 450-495 nm')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Mor: 380-450 nm', '• Violet: 380-450 nm')}
            </Text>
          </View>

          {/* Modern Uygulamalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t(
                'Modern Teknoloji Uygulamaları',
                'Modern Technology Applications'
              )}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Fiber Optik', 'Fiber Optics')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'İnternet ve telefon iletişimi',
                    'Internet and telephone communication'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Radar Sistemleri', 'Radar Systems')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Hava trafik kontrolü, meteoroloji',
                    'Air traffic control, meteorology'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('MRI Teknolojisi', 'MRI Technology')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Manyetik rezonans görüntüleme',
                    'Magnetic resonance imaging'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Kablosuz İletişim', 'Wireless Communication')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'WiFi, Bluetooth, 5G teknolojileri',
                    'WiFi, Bluetooth, 5G technologies'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Lazer Teknolojisi', 'Laser Technology')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Cerrahi, endüstri, ölçüm sistemleri',
                    'Surgery, industry, measurement systems'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Hologram', 'Holography')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    '3D görüntüleme, güvenlik uygulamaları',
                    '3D imaging, security applications'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Dalga Denklemi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Dalga Denklemi', 'Wave Equation')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalga denklemı, dalgaların uzay ve zamandaki davranışını matematiksel olarak tanımlar. Bu denklem fizikteki en önemli denklemlerden biridir.',
                'The wave equation mathematically describes the behavior of waves in space and time. This equation is one of the most important equations in physics.'
              )}
            </Text>

            <View style={styles.formulaBox}>
              <Text style={styles.formula}>∂²ψ/∂t² = v² × ∂²ψ/∂x²</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'ψ: Dalga fonksiyonu, v: Dalga hızı, t: Zaman, x: Konum',
                  'ψ: Wave function, v: Wave speed, t: Time, x: Position'
                )}
              </Text>
            </View>

            <Text style={styles.paragraph}>
              {t(
                'Bu denklemin çözümleri sinüzoidal dalgalar, duran dalgalar ve darbe dalgaları gibi çeşitli dalga türlerini verir.',
                'Solutions to this equation give various wave types such as sinusoidal waves, standing waves, and pulse waves.'
              )}
            </Text>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalga teorisi, modern fiziğin temel yapı taşlarından biridir. Kuantum mekaniğinden ğeneral göreliliğe, atom fiziğinden kosmolojiye kadar birçok alanda kritik rol oynar. Teknolojideki ilerlemelerimizin çoğu dalga fenomenlerinin anlaşılması üzerine kuruludur.',
                'Wave theory is one of the fundamental building blocks of modern physics. It plays a critical role in many fields from quantum mechanics to general relativity, from atomic physics to cosmology. Most of our technological advances are built upon understanding wave phenomena.'
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
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginVertical: 12,
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
