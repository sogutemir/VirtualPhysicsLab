import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function PhotoelectricEffectTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Fotoelektrik Olay', 'Photoelectric Effect')}
      titleEn="Photoelectric Effect"
      difficulty={t('İleri Seviye', 'Advanced Level')}
      difficultyEn="Advanced Level"
      description={t(
        'Einstein\'ın Nobel ödüllü kuantum teorisi ve ışığın parçacık doğası',
        'Einstein\'s Nobel Prize quantum theory and particle nature of light'
      )}
      descriptionEn="Einstein's Nobel Prize quantum theory and particle nature of light"
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
              {t('Fotoelektrik Olay Nedir?', 'What is the Photoelectric Effect?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Fotoelektrik olay, bir metal yüzeye ışık düştüğünde elektronların yüzeyden koparak serbest kalmasıdır. Bu fenomen, ışığın parçacık doğasını kanıtlayan ve kuantum fiziğinin doğuşuna yol açan kritik bir keşiftir.',
                'The photoelectric effect is the emission of electrons from a metal surface when light falls on it. This phenomenon is a critical discovery that proved the particle nature of light and led to the birth of quantum physics.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Albert Einstein bu keşfi ile 1921 Nobel Fizik Ödülü\'nü kazanmıştır.',
                  'Albert Einstein won the 1921 Nobel Prize in Physics for this discovery.'
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
              {t('1887 - Heinrich Hertz', '1887 - Heinrich Hertz')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Hertz, spark gap deneyleri sırasında UV ışığının metal elektrotlardan elektron emisyonunu artırdığını gözlemledi. Bu ilk gözlemdi ancak açıklama getiremedi.',
                'Hertz observed that UV light enhanced electron emission from metal electrodes during spark gap experiments. This was the first observation but he could not explain it.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('1900 - Max Planck', '1900 - Max Planck')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Planck, kara cisim ışıması için enerji kuantumları kavramını önerdi: E = hf. Bu kuantum teorisinin ilk adımıydı.',
                'Planck proposed the concept of energy quanta for blackbody radiation: E = hf. This was the first step of quantum theory.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('1905 - Albert Einstein', '1905 - Albert Einstein')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Einstein, Planck\'ın kuantum hipotezini ışığa uygulayarak fotoelektrik olayı açıkladı. Işığın foton adı verilen enerji paketlerinden oluştuğunu önerdi.',
                'Einstein applied Planck\'s quantum hypothesis to light and explained the photoelectric effect. He proposed that light consists of energy packets called photons.'
              )}
            </Text>

            <FormulaText 
              formula="E = hf"
              description={t('h: Planck sabiti (6.626×10⁻³⁴ J·s), f: Frekans (Hz)', 'h: Planck constant (6.626×10⁻³⁴ J·s), f: Frequency (Hz)')}
            />
          </View>

          {/* Einstein Denklemi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Einstein Fotoelektrik Denklemi', 'Einstein Photoelectric Equation')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Einstein\'ın temel denklemi, bir fotonun enerjisinin elektronun çıkış işi ve kinetik enerjisi arasındaki ilişkiyi gösterir:',
                'Einstein\'s fundamental equation shows the relationship between a photon\'s energy, the work function, and kinetic energy:'
              )}
            </Text>
            
            <FormulaText 
              formula="hf = Φ + E_max"
              description={t('Φ: Çıkış işi (eV), E_max: Maksimum kinetik enerji (eV)', 'Φ: Work function (eV), E_max: Maximum kinetic energy (eV)')}
            />

            <Text style={styles.paragraph}>
              {t(
                'Bu denklem aşağıdaki kritik sonuçları verir:',
                'This equation gives the following critical results:'
              )}
            </Text>
            
            <Text style={styles.listItem}>
              {t(
                '• Eşik frekansı: f₀ = Φ/h (Bu frekanstan düşük ışık elektron çıkarmaz)',
                '• Threshold frequency: f₀ = Φ/h (Light below this frequency cannot emit electrons)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kinetik enerji ışık şiddetinden bağımsız, sadece frekansa bağlı',
                '• Kinetic energy is independent of light intensity, depends only on frequency'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Elektron emisyonu anında gerçekleşir (zaman gecikmesi yok)',
                '• Electron emission occurs instantaneously (no time delay)'
              )}
            </Text>

            <FormulaText 
              formula="E_max = ½mv²_max = hf - Φ"
              description={t('Maksimum kinetik enerji denklemi', 'Maximum kinetic energy equation')}
            />
          </View>

          {/* Çıkış İşi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Çıkış İşi (Work Function)', 'Work Function')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çıkış işi, bir elektronun metal yüzeyinden tamamen ayrılması için gereken minimum enerjidir. Her metalin kendine özgü çıkış işi vardır.',
                'Work function is the minimum energy required for an electron to completely separate from a metal surface. Each metal has its own characteristic work function.'
              )}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Çinko (Zn)', 'Zinc (Zn)')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Φ = 4.33 eV', 'Φ = 4.33 eV')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Alüminyum (Al)', 'Aluminum (Al)')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Φ = 4.28 eV', 'Φ = 4.28 eV')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Bakır (Cu)', 'Copper (Cu)')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Φ = 4.65 eV', 'Φ = 4.65 eV')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Gümüş (Ag)', 'Silver (Ag)')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Φ = 4.26 eV', 'Φ = 4.26 eV')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Sodyum (Na)', 'Sodium (Na)')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Φ = 2.75 eV', 'Φ = 2.75 eV')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Potasyum (K)', 'Potassium (K)')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Φ = 2.30 eV', 'Φ = 2.30 eV')}
                </Text>
              </View>
            </View>
          </View>

          {/* Durdurucu Potansiyel */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Durdurucu Potansiyel', 'Stopping Potential')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Durdurucu potansiyel, fotoelektronları tam olarak durdurmak için gereken ters voltajdır. Bu voltaj, elektronların maksimum kinetik enerjisi ile doğrudan ilişkilidir.',
                'Stopping potential is the reverse voltage required to completely stop photoelectrons. This voltage is directly related to the maximum kinetic energy of electrons.'
              )}
            </Text>

            <FormulaText 
              formula="eV₀ = E_max = hf - Φ"
              description={t('V₀: Durdurucu potansiyel (V), e: Elektron yükü (1.602×10⁻¹⁹ C)', 'V₀: Stopping potential (V), e: Electron charge (1.602×10⁻¹⁹ C)')}
            />

            <Text style={styles.paragraph}>
              {t(
                'Durdurucu potansiyel ölçümü, çıkış işini hesaplamak için pratik bir yöntemdir:',
                'Stopping potential measurement is a practical method to calculate work function:'
              )}
            </Text>

            <FormulaText 
              formula="V₀ = (h/e)f - Φ/e"
              description={t('V₀-f grafiğinin eğimi h/e, y-kesimi -Φ/e', 'Slope of V₀-f graph is h/e, y-intercept is -Φ/e')}
            />
          </View>

          {/* Kuantum Doğası */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Işığın Kuantum Doğası', 'Quantum Nature of Light')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Fotoelektrik olay, ışığın dalga-parçacık ikiliğini gösteren en önemli deneylerden biridir. Klasik dalga teorisi bu olayı açıklayamaz.',
                'The photoelectric effect is one of the most important experiments showing the wave-particle duality of light. Classical wave theory cannot explain this phenomenon.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Klasik Teorinin Başarısızlıkları:', 'Failures of Classical Theory:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Işık şiddeti artarken elektron sayısı artmalı (doğru) ama enerjisi de artmalı (yanlış)',
                '• As light intensity increases, electron count should increase (correct) but energy should also increase (wrong)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Düşük frekanslı güçlü ışık elektron çıkarmalı (yanlış)',
                '• Low frequency strong light should emit electrons (wrong)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Elektron emisyonu için zaman gecikmesi olmalı (yanlış)',
                '• There should be time delay for electron emission (wrong)'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kuantum Teorisinin Açıklaması:', 'Quantum Theory Explanation:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Işık fotonlardan oluşur, her foton E = hf enerjisi taşır',
                '• Light consists of photons, each photon carries energy E = hf'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Bir foton bir elektronla tek tek etkileşir (1:1 oranı)',
                '• One photon interacts with one electron individually (1:1 ratio)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Şiddet arttıkça foton sayısı artar, enerji sabit kalır',
                '• As intensity increases, photon count increases, energy remains constant'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Eşik frekansından düşük ışık hiç elektron çıkarmaz',
                '• Light below threshold frequency cannot emit any electrons'
              )}
            </Text>
          </View>

          {/* Modern Uygulamalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Modern Teknoloji Uygulamaları', 'Modern Technology Applications')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Fotovoltaik Güneş Panelleri', 'Photovoltaic Solar Panels')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Güneş enerjisini elektriğe dönüştürme',
                    'Converting solar energy to electricity'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Fototüp ve PMT', 'Photomultiplier Tubes')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Zayıf ışık sinyallerini güçlendirme',
                    'Amplifying weak light signals'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('CCD ve CMOS Sensörler', 'CCD and CMOS Sensors')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Dijital kameralar, görüntüleme sistemleri',
                    'Digital cameras, imaging systems'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Fotoelektrik Sensörler', 'Photoelectric Sensors')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Endüstriyel otomasyon, güvenlik sistemleri',
                    'Industrial automation, security systems'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Elektron Mikroskopları', 'Electron Microscopes')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Yüksek çözünürlüklü görüntüleme',
                    'High resolution imaging'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('X-ray Foto spektroskopi', 'X-ray Photoelectron Spectroscopy')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Malzeme yüzey analizi (XPS)',
                    'Material surface analysis (XPS)'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Deneysel Düzeneğin Analizi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Deneysel Düzeneğin Analizi', 'Experimental Setup Analysis')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Fotoelektrik olay deneyi tipik olarak şu bileşenlerden oluşur:',
                'A photoelectric effect experiment typically consists of the following components:'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('1. Işık Kaynağı', '1. Light Source')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Monokromatik ışık kaynağı (tek frekanslı)',
                '• Monochromatic light source (single frequency)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Değişken şiddet kontrolü',
                '• Variable intensity control'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• UV-Vis spektrum aralığı',
                '• UV-Vis spectrum range'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('2. Fotokatot (Metal Yüzey)', '2. Photocathode (Metal Surface)')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Temiz metal yüzey (Na, K, Cs gibi)',
                '• Clean metal surface (such as Na, K, Cs)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Bilinen çıkış işi değeri',
                '• Known work function value'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('3. Toplayıcı Elektrot', '3. Collector Electrode')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Elektronları toplayan anot',
                '• Anode collecting electrons'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Akım ölçüm devresi',
                '• Current measurement circuit'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('4. Voltaj Kaynağı', '4. Voltage Source')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Değişken ters voltaj (durdurucu potansiyel)',
                '• Variable reverse voltage (stopping potential)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Hassas voltmetre',
                '• Precision voltmeter'
              )}
            </Text>
          </View>

          {/* Önemli Fiziksel Sabitler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Önemli Fiziksel Sabitler', 'Important Physical Constants')}
            </Text>

            <FormulaText 
              formula="h = 6.626 × 10⁻³⁴ J·s"
              description={t('Planck sabiti', 'Planck constant')}
            />

            <FormulaText 
              formula="c = 2.998 × 10⁸ m/s"
              description={t('Işık hızı', 'Speed of light')}
            />

            <FormulaText 
              formula="e = 1.602 × 10⁻¹⁹ C"
              description={t('Elektron yükü', 'Electron charge')}
            />

            <FormulaText 
              formula="1 eV = 1.602 × 10⁻¹⁹ J"
              description={t('Elektron volt dönüşümü', 'Electron volt conversion')}
            />

            <Text style={styles.subTitle}>
              {t('Pratik Hesaplamalar:', 'Practical Calculations:')}
            </Text>
            <FormulaText 
              formula="E(eV) = 1240 / λ(nm)"
              description={t('Dalga boyu - enerji dönüşümü', 'Wavelength - energy conversion')}
            />
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Fotoelektrik olay, modern fiziğin doğuşundaki en kritik keşiflerden biridir. Einstein\'ın bu çalışması, kuantum mekaniğinin temellerini atmış ve ışığın ikili doğasını kanıtlamıştır. Günümüzde güneş panellerinden dijital kameralara, tıbbi görüntülemeden uzay teknolojisine kadar sayısız uygulamada kullanılmaktadır.',
                'The photoelectric effect is one of the most critical discoveries in the birth of modern physics. Einstein\'s work laid the foundations of quantum mechanics and proved the dual nature of light. Today it is used in countless applications from solar panels to digital cameras, from medical imaging to space technology.'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Bu fenomen, klasik fizikten kuantum fiziğine geçişte köprü görevi görmüş ve 20. yüzyılın teknolojik devriminin temelini oluşturmuştur.',
                'This phenomenon served as a bridge from classical physics to quantum physics and formed the foundation of the technological revolution of the 20th century.'
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