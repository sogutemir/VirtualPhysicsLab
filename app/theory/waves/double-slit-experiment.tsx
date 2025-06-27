import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function DoubleslitExperimentTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Çift Yarık Deneyi', 'Double Slit Experiment')}
      titleEn="Double Slit Experiment"
      difficulty={t('İleri Seviye', 'Advanced Level')}
      difficultyEn="Advanced Level"
      description={t(
        'Young deneyi, dalga-parçacık dualitesi, kuantum mekaniği ve girişim desenlerinin analizi',
        'Young experiment, wave-particle duality, quantum mechanics and analysis of interference patterns'
      )}
      descriptionEn="Young experiment, wave-particle duality, quantum mechanics and analysis of interference patterns"
      hideControls={true}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.container}>
          {/* Tarihi Giriş */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Tarihi Önem ve Thomas Young', 'Historical Significance and Thomas Young')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çift yarık deneyi, fizik tarihinin en önemli deneylerinden biridir. Thomas Young tarafından 1801 yılında gerçekleştirilen bu deney, ışığın dalga doğasını kanıtlayarak Newton\'ın parçacık teorisini çürütmüştür.',
                'The double slit experiment is one of the most important experiments in physics history. Performed by Thomas Young in 1801, this experiment proved the wave nature of light, refuting Newton\'s particle theory.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  '20. yüzyılda kuantum mekaniği ile yeniden yorumlanan bu deney, dalga-parçacık dualitesi kavramının temelini oluşturur.',
                  'Reinterpreted with quantum mechanics in the 20th century, this experiment forms the basis of the wave-particle duality concept.'
                )}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t('Young\'ın Orijinal Deneyi:', 'Young\'s Original Experiment:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Güneş ışığı tek yarıktan geçirildi',
                '• Sunlight was passed through a single slit'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Bu ışık çift yarığa yönlendirildi',
                '• This light was directed to a double slit'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Ekranda girişim deseni gözlemlendi',
                '• Interference pattern was observed on screen'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• İşiğın dalga doğası kesin olarak kanıtlandı',
                '• Wave nature of light was definitively proven'
              )}
            </Text>
          </View>

          {/* Klasik Dalga Yaklaşımı */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Klasik Dalga Yaklaşımı', 'Classical Wave Approach')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Klasik fizikte çift yarık deneyi, Huygens prensibi ve dalga girişimi ile açıklanır. Her yarık ikincil dalga kaynağı olarak davranır.',
                'In classical physics, the double slit experiment is explained by Huygens principle and wave interference. Each slit acts as a secondary wave source.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Deney Düzeneği:', 'Experimental Setup:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Monokromatik ışık kaynağı → Tek yarık → Çift yarık → Gözlem ekranı',
                'Monochromatic light source → Single slit → Double slit → Observation screen'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Geometrik Analiz:', 'Geometric Analysis:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İki yarık arası mesafe: d, Yarık-ekran mesafesi: L, Ekrandaki nokta yüksekliği: y',
                'Distance between slits: d, Slit-screen distance: L, Height of point on screen: y'
              )}
            </Text>

            <FormulaText 
              formula="Yol farkı: Δ = d sin θ ≈ dy/L"
              description={t('Küçük açı yaklaşımı: sin θ ≈ tan θ ≈ θ', 'Small angle approximation: sin θ ≈ tan θ ≈ θ')}
            />

            <Text style={styles.subTitle}>
              {t('Yapıcı Girişim (Maksimumlar):', 'Constructive Interference (Maxima):')}
            </Text>
            <FormulaText 
              formula="Δ = mλ → y_max = mλL/d"
              description={t('m = 0, ±1, ±2, ±3, ... (maksimum mertebesi)', 'm = 0, ±1, ±2, ±3, ... (order of maximum)')}
            />

            <Text style={styles.subTitle}>
              {t('Yıkıcı Girişim (Minimumlar):', 'Destructive Interference (Minima):')}
            </Text>
            <FormulaText 
              formula="Δ = (m + 1/2)λ → y_min = (m + 1/2)λL/d"
              description={t('m = 0, ±1, ±2, ±3, ... (minimum mertebesi)', 'm = 0, ±1, ±2, ±3, ... (order of minimum)')}
            />

            <Text style={styles.subTitle}>
              {t('Girişim Saçağı Genişliği:', 'Fringe Width:')}
            </Text>
            <FormulaText 
              formula="Δy = λL/d"
              description={t('Ardışık maksimumlar veya minimumlar arası mesafe', 'Distance between consecutive maxima or minima')}
            />

            <Text style={styles.subTitle}>
              {t('Işık Şiddeti Dağılımı:', 'Light Intensity Distribution:')}
            </Text>
            <FormulaText 
              formula="I(θ) = I₀ cos²(πd sin θ/λ)"
              description={t('I₀: Maksimum şiddet', 'I₀: Maximum intensity')}
            />
          </View>

          {/* Kuantum Mekaniği Yorumu */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kuantum Mekaniği Yorumu', 'Quantum Mechanical Interpretation')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                '20. yüzyılda elektronlar, fotonlar ve diğer parçacıklarla yapılan çift yarık deneyleri, kuantum mekaniğinin temelini oluşturan şaşırtıcı sonuçlar ortaya çıkardı.',
                'Double slit experiments with electrons, photons and other particles in the 20th century revealed surprising results that form the foundation of quantum mechanics.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kuantum Deneyi Özellikleri:', 'Quantum Experiment Properties:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Tek parçacık gönderilse bile girişim deseni oluşur',
                '• Interference pattern forms even when single particles are sent'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Parçacık hangi yarıktan geçtiği bilinmez',
                '• It\'s unknown which slit the particle passes through'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Gözlem yapıldığında girişim deseni kaybolur',
                '• Interference pattern disappears when observation is made'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Dalga-parçacık dualitesi ortaya çıkar',
                '• Wave-particle duality emerges'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Dalga Fonksiyonu Yaklaşımı:', 'Wave Function Approach:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Kuantum mekaniğinde parçacığın durumu dalga fonksiyonu ψ ile tanımlanır:',
                'In quantum mechanics, the particle state is described by wave function ψ:'
              )}
            </Text>
            <FormulaText 
              formula="ψ_toplam = ψ₁ + ψ₂"
              description={t('ψ₁, ψ₂: Her yarıktan gelen dalga fonksiyonları', 'ψ₁, ψ₂: Wave functions from each slit')}
            />

            <Text style={styles.paragraph}>
              {t(
                'Bulunma olasılığı dalga fonksiyonunun karesi ile belirlenir:',
                'Probability of detection is determined by the square of wave function:'
              )}
            </Text>
            <FormulaText 
              formula="P = |ψ_toplam|² = |ψ₁ + ψ₂|²"
              description={t('Girişim terimlerini içerir', 'Contains interference terms')}
            />

            <Text style={styles.subTitle}>
              {t('Kopenhag Yorumu:', 'Copenhagen Interpretation:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Niels Bohr ve Werner Heisenberg\'in öncülüğündeki yoruma göre:',
                'According to the interpretation led by Niels Bohr and Werner Heisenberg:'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Parçacık her iki yarıktan aynı anda geçer',
                '• Particle passes through both slits simultaneously'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Gözlem dalga fonksiyonunu çöktürür',
                '• Observation collapses the wave function'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Belirsizlik ilkesi fundamentaldir',
                '• Uncertainty principle is fundamental'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Komplementerlik prensibi geçerlidir',
                '• Complementarity principle applies'
              )}
            </Text>
          </View>

          {/* Hangi Yol Bilgisi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Hangi Yol Bilgisi ve Gözlemci Etkisi', 'Which-Way Information and Observer Effect')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Parçacığın hangi yarıktan geçtiğini belirleme girişimi, girişim desenini yok eder. Bu, kuantum mekaniğinin en çarpıcı özelliklerinden biridir.',
                'Attempts to determine which slit the particle passes through destroy the interference pattern. This is one of the most striking features of quantum mechanics.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Geciktirilmiş Seçim Deneyi:', 'Delayed Choice Experiment:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'John Wheeler\'ın önerdiği bu deney, parçacık ekrana ulaştıktan sonra bile ölçüm kararının etkili olduğunu gösterir.',
                'This experiment proposed by John Wheeler shows that the measurement decision is effective even after the particle reaches the screen.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kuantum Silici Deneyi:', 'Quantum Eraser Experiment:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Hangi yol bilgisi alındıktan sonra bu bilginin "silinmesi" girişim desenini geri getirir.',
                'After which-way information is obtained, "erasing" this information brings back the interference pattern.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Gözlemci Paradoksu:', 'Observer Paradox:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Gözlem yapmak sistemi değiştirir',
                '• Making observation changes the system'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Bilgi edinme bedeli vardır',
                '• There is a cost to gaining information'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Objektif gerçeklik sorgulanır',
                '• Objective reality is questioned'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Ölçüm problemi ortaya çıkar',
                '• Measurement problem arises'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Heisenberg Belirsizlik İlkesi:', 'Heisenberg Uncertainty Principle:')}
            </Text>
            <FormulaText 
              formula="Δx × Δp ≥ ℏ/2"
              description={t('Konum ve momentum eş zamanlı kesin ölçümü imkansız', 'Simultaneous exact measurement of position and momentum impossible')}
            />

            <FormulaText 
              formula="ΔE × Δt ≥ ℏ/2"
              description={t('Enerji ve zaman belirsizliği', 'Energy and time uncertainty')}
            />
          </View>

          {/* Farklı Parçacıklarla Deneyler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Farklı Parçacıklarla Deneyler', 'Experiments with Different Particles')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çift yarık deneyi farklı parçacık türleriyle gerçekleştirilmiş ve hepsinde aynı kuantum davranış gözlemlenmiştir.',
                'The double slit experiment has been performed with different types of particles and the same quantum behavior has been observed in all.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Elektron Deneyleri:', 'Electron Experiments:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'G.P. Thomson (1927) ve Claus Jönsson (1961) elektronların dalga doğasını kanıtladı.',
                'G.P. Thomson (1927) and Claus Jönsson (1961) proved the wave nature of electrons.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• De Broglie dalga boyu: λ = h/p',
                '• De Broglie wavelength: λ = h/p'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Elektron girişim saçakları gözlendi',
                '• Electron interference fringes observed'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Maddenin dalga doğası kanıtlandı',
                '• Wave nature of matter proven'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Foton Deneyleri:', 'Photon Experiments:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Tek fotonluk deneyler kuantum süperpozisyonunu en net şekilde gösterir.',
                'Single photon experiments show quantum superposition most clearly.'
              )}
            </Text>
            <FormulaText 
              formula="E_foton = hf = hc/λ"
              description={t('Foton enerjisi ve dalga boyu ilişkisi', 'Photon energy and wavelength relationship')}
            />

            <Text style={styles.subTitle}>
              {t('Atom ve Molekül Deneyleri:', 'Atom and Molecule Experiments:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çok büyük moleküller bile (C₇₀ fullerene) dalga davranışı gösterir.',
                'Even very large molecules (C₇₀ fullerene) show wave behavior.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Nötron girişimi (1988)',
                '• Neutron interference (1988)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Atom girişimi (1991)',
                '• Atom interference (1991)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Molekül girişimi (1999)',
                '• Molecule interference (1999)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Makromolekül girişimi (2019)',
                '• Macromolecule interference (2019)'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('De Broglie Dalga Boyu:', 'De Broglie Wavelength:')}
            </Text>
            <FormulaText 
              formula="λ = h/p = h/(mv)"
              description={t('h: Planck sabiti, p: momentum, m: kütle, v: hız', 'h: Planck constant, p: momentum, m: mass, v: velocity')}
            />

            <Text style={styles.paragraph}>
              {t(
                'Göreli hızlar için:',
                'For relativistic speeds:'
              )}
            </Text>
            <FormulaText 
              formula="λ = h/√(2mE_k)"
              description={t('E_k: Kinetik enerji', 'E_k: Kinetic energy')}
            />
          </View>

          {/* Kuantum Dolanıklık ve Bell Deneyleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kuantum Dolanıklık ve Bell Deneyleri', 'Quantum Entanglement and Bell Experiments')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çift yarık deneyinin genişletilmiş versiyonları, kuantum dolanıklığı ve yerel gerçekçilik testlerini içerir.',
                'Extended versions of the double slit experiment include quantum entanglement and local realism tests.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('EPR Paradoksu:', 'EPR Paradox:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Einstein, Podolsky ve Rosen (1935) kuantum mekaniğinin "eksik" olduğunu iddia etti.',
                'Einstein, Podolsky and Rosen (1935) claimed that quantum mechanics was "incomplete".'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• "Uzaktan ürkütücü etki" kavramı',
                '• Concept of "spooky action at a distance"'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Gizli değişken teorileri',
                '• Hidden variable theories'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Yerel gerçekçilik sorgulanması',
                '• Questioning of local realism'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Bell Eşitsizlikleri:', 'Bell Inequalities:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'John Bell (1964) yerel gizli değişken teorilerini test edecek eşitsizlikler geliştirdi.',
                'John Bell (1964) developed inequalities to test local hidden variable theories.'
              )}
            </Text>
            <FormulaText 
              formula="|E(a,b) - E(a,c)| ≤ 1 + E(b,c)"
              description={t('Bell-CHSH eşitsizliği', 'Bell-CHSH inequality')}
            />

            <Text style={styles.subTitle}>
              {t('Aspect Deneyleri:', 'Aspect Experiments:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Alain Aspect (1982) Bell eşitsizliklerinin ihlal edildiğini deneysel olarak kanıtladı.',
                'Alain Aspect (1982) experimentally proved that Bell inequalities are violated.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kuantum mekaniği doğrulandı',
                '• Quantum mechanics validated'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Yerel gerçekçilik çürütüldü',
                '• Local realism refuted'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Nobel Fizik Ödülü (2022)',
                '• Nobel Prize in Physics (2022)'
              )}
            </Text>
          </View>

          {/* Modern Uygulamalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Modern Uygulamalar', 'Modern Applications')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çift yarık deneyinin prensipleri, modern teknolojinin birçok alanında uygulanmaktadır.',
                'The principles of the double slit experiment are applied in many areas of modern technology.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kuantum Hesaplama:', 'Quantum Computing:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kuantum süperpozisyon kubitlerde',
                '• Quantum superposition in qubits'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kuantum girişimi işlem gücünde',
                '• Quantum interference in processing power'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kuantum parallelizm avantajı',
                '• Quantum parallelism advantage'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kuantum Kriptografi:', 'Quantum Cryptography:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kuantum anahtar dağıtımı (QKD)',
                '• Quantum key distribution (QKD)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Dinleme tespit edilebilir güvenlik',
                '• Eavesdropping detectable security'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Bilgi teorik güvenlik',
                '• Information theoretic security'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kuantum Sensörler:', 'Quantum Sensors:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Atomik interferometre gravimetreler',
                '• Atomic interferometer gravimeters'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kuantum magnetometreler',
                '• Quantum magnetometers'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Ultra hassas ölçüm cihazları',
                '• Ultra-sensitive measurement devices'
              )}
            </Text>
          </View>

          {/* Felsefi Çıkarımlar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Felsefi Çıkarımlar', 'Philosophical Implications')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çift yarık deneyi, fiziğin ötesinde felsefi sorular da ortaya çıkarır.',
                'The double slit experiment raises philosophical questions beyond physics.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Gerçekliğin Doğası:', 'Nature of Reality:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Objektif gerçeklik var mı?',
                '• Does objective reality exist?'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Gözlemcinin rolü nedir?',
                '• What is the role of the observer?'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Ölçüm öncesi durumlar nasıl tanımlanır?',
                '• How are pre-measurement states defined?'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Çok Dünya Yorumu:', 'Many-Worlds Interpretation:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Hugh Everett III (1957) tüm olasılıkların paralel evrenler oluşturduğunu önerdi.',
                'Hugh Everett III (1957) proposed that all possibilities create parallel universes.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Bilinç ve Kuantum Mekaniği:', 'Consciousness and Quantum Mechanics:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Bazı teoriler bilincin kuantum ölçümünde rol oynadığını öne sürer.',
                'Some theories suggest that consciousness plays a role in quantum measurement.'
              )}
            </Text>
          </View>

          {/* Günlük Hayat ve Teknoloji */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Günlük Hayat ve Teknoloji Örnekleri', 'Daily Life and Technology Examples')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Lazer Teknolojisi', 'Laser Technology')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Koherent ışık ve girişim prensipleri',
                    'Coherent light and interference principles'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Holografi', 'Holography')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    '3D görüntü oluşturma ve kaydetme',
                    '3D image creation and recording'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('DVD/CD Okuyucular', 'DVD/CD Readers')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Lazer girişimi ile veri okuma',
                    'Data reading through laser interference'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Fiber Optik İletişim', 'Fiber Optic Communication')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Işık girişimi ve modal analiz',
                    'Light interference and modal analysis'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('MRI Görüntüleme', 'MRI Imaging')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Proton spin girişimi ve sinyal işleme',
                    'Proton spin interference and signal processing'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Güneş Panelleri', 'Solar Panels')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Anti-yansıma kaplamaları ve verimlilik',
                    'Anti-reflection coatings and efficiency'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* İleri Seviye Uygulamalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('İleri Seviye Uygulamalar', 'Advanced Applications')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('LIGO Gravitasyonel Dalgalar', 'LIGO Gravitational Waves')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Lazer interferometresi ile uzay-zaman ölçümü',
                    'Space-time measurement with laser interferometry'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Kuantum Bilgisayarlar', 'Quantum Computers')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Süperpozisyon ve kuantum girişimi',
                    'Superposition and quantum interference'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Atom Interferometresi', 'Atom Interferometry')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Precision gravimetri ve navigasyon',
                    'Precision gravimetry and navigation'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Kuantum Kriptografi', 'Quantum Cryptography')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Güvenli iletişim ve anahtar dağıtımı',
                    'Secure communication and key distribution'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Fotonik Kristaller', 'Photonic Crystals')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Işık kontrolü ve optik devreler',
                    'Light control and optical circuits'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Kuantum Metroloji', 'Quantum Metrology')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Ultra hassas ölçüm standartları',
                    'Ultra-precise measurement standards'
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
              {t('Klasik Çift Yarık Problemleri:', 'Classical Double Slit Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Deney parametrelerini belirleyin (d, L, λ)',
                '1. Determine experimental parameters (d, L, λ)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Yol farkını hesaplayın (Δ = d sin θ)',
                '2. Calculate path difference (Δ = d sin θ)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Girişim koşullarını uygulayın',
                '3. Apply interference conditions'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Maksimum/minimum konumlarını bulun',
                '4. Find maximum/minimum positions'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '5. Saçak genişliğini hesaplayın',
                '5. Calculate fringe width'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kuantum Problemleri:', 'Quantum Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Parçacık türü ve enerjisini belirleyin',
                '1. Determine particle type and energy'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. De Broglie dalga boyunu hesaplayın',
                '2. Calculate de Broglie wavelength'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Dalga fonksiyonu süperpozisyonunu yazın',
                '3. Write wave function superposition'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Olasılık dağılımını hesaplayın',
                '4. Calculate probability distribution'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '5. Gözlem etkisini değerlendirin',
                '5. Evaluate observation effects'
              )}
            </Text>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Çift yarık deneyi, 200 yılı aşkın süredir fiziğin merkezinde yer almaktadır. Klasik dalga teorisinden kuantum mekaniğine, felsefeden teknolojiye kadar geniş bir etki alanına sahiptir.',
                'The double slit experiment has been at the center of physics for over 200 years. It has a wide range of influence from classical wave theory to quantum mechanics, from philosophy to technology.'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Bu deney, gerçekliğin doğası hakkındaki anlayışımızı değiştirmiş ve kuantum teknolojilerinin gelişimini mümkün kılmıştır. Gelecekte kuantum hesaplama, kriptografi ve sensör teknolojilerinde daha da büyük rol oynamaya devam edecektir.',
                'This experiment has changed our understanding of the nature of reality and enabled the development of quantum technologies. It will continue to play an even greater role in quantum computing, cryptography and sensor technologies in the future.'
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