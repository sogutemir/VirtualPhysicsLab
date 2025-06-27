import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function InterferenceSuperpositonTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Girişim ve Süperpozisyon', 'Interference and Superposition')}
      titleEn="Interference and Superposition"
      difficulty={t('Orta Seviye', 'Intermediate Level')}
      difficultyEn="Intermediate Level"
      description={t(
        'Dalga girişimi, süperpozisyon prensibi, yapıcı-yıkıcı girişim ve duran dalgalar',
        'Wave interference, superposition principle, constructive-destructive interference and standing waves'
      )}
      descriptionEn="Wave interference, superposition principle, constructive-destructive interference and standing waves"
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
              {t('Süperpozisyon Prensibi', 'Superposition Principle')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Süperpozisyon prensibi, dalgaların en temel özelliklerinden biridir. Bu prensibe göre, aynı ortamda bulunan iki veya daha fazla dalga birbiriyle karşılaştığında, o noktadaki toplam yer değiştirme, her dalganın ayrı ayrı oluşturacağı yer değiştirmelerin vektörel toplamına eşittir.',
                'The superposition principle is one of the most fundamental properties of waves. According to this principle, when two or more waves meet in the same medium, the total displacement at that point equals the vector sum of the displacements each wave would produce separately.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Bu prensip, dalgaların doğrusal olmayan etkileşimlerden farklı olarak, birbirlerini değiştirmeden geçmelerine olanak sağlar.',
                  'This principle allows waves to pass through each other unchanged, unlike nonlinear interactions.'
                )}
              </Text>
            </View>

            <FormulaText 
              formula="y_toplam(x,t) = y₁(x,t) + y₂(x,t) + y₃(x,t) + ..."
              description={t('Süperpozisyon prensibi matematiksel ifadesi', 'Mathematical expression of superposition principle')}
            />
          </View>

          {/* Dalga Girişimi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Dalga Girişimi', 'Wave Interference')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Girişim, iki veya daha fazla dalganın aynı bölgede bulunması sonucu oluşan fenomendir. Dalgaların faz ilişkisine bağlı olarak yapıcı veya yıkıcı girişim meydana gelir.',
                'Interference is the phenomenon resulting from two or more waves being present in the same region. Depending on the phase relationship of the waves, constructive or destructive interference occurs.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yapıcı Girişim (Constructive Interference):', 'Constructive Interference:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalgalar aynı fazda olduğunda meydana gelir. Sonuç dalgasının genliği, bileşen dalgaların genliklerinin toplamına eşittir.',
                'Occurs when waves are in phase. The amplitude of the resulting wave equals the sum of the amplitudes of component waves.'
              )}
            </Text>

            <FormulaText 
              formula="Faz farkı: Δφ = 0, 2π, 4π, ..."
              description={t('Yol farkı: Δx = 0, λ, 2λ, 3λ, ...', 'Path difference: Δx = 0, λ, 2λ, 3λ, ...')}
            />

            <FormulaText 
              formula="A_sonuç = A₁ + A₂"
              description={t('Maksimum genlik (aynı faz)', 'Maximum amplitude (in phase)')}
            />

            <Text style={styles.subTitle}>
              {t('Yıkıcı Girişim (Destructive Interference):', 'Destructive Interference:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalgalar ters fazda olduğunda meydana gelir. Sonuç dalgasının genliği, bileşen dalgaların genliklerinin farkına eşittir.',
                'Occurs when waves are out of phase. The amplitude of the resulting wave equals the difference of the amplitudes of component waves.'
              )}
            </Text>

            <FormulaText 
              formula="Faz farkı: Δφ = π, 3π, 5π, ..."
              description={t('Yol farkı: Δx = λ/2, 3λ/2, 5λ/2, ...', 'Path difference: Δx = λ/2, 3λ/2, 5λ/2, ...')}
            />

            <FormulaText 
              formula="A_sonuç = |A₁ - A₂|"
              description={t('Minimum genlik (ters faz)', 'Minimum amplitude (out of phase)')}
            />

            <Text style={styles.subTitle}>
              {t('Genel Girişim Durumu:', 'General Interference Case:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İki dalga arasında keyfi bir faz farkı olduğunda:',
                'When there is an arbitrary phase difference between two waves:'
              )}
            </Text>

            <FormulaText 
              formula="A_sonuç = √(A₁² + A₂² + 2A₁A₂cos(Δφ))"
              description={t('Genel girişim genlik formülü', 'General interference amplitude formula')}
            />
          </View>

          {/* Koherent ve İnkoherent Kaynaklar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Koherent ve İnkoherent Kaynaklar', 'Coherent and Incoherent Sources')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Kararlı girişim desenleri elde etmek için dalga kaynaklarının koherent olması gerekir.',
                'To obtain stable interference patterns, wave sources must be coherent.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Koherent Kaynaklar:', 'Coherent Sources:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Aynı frekansa sahip dalgalar üretir',
                '• Produce waves of the same frequency'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Aralarındaki faz farkı sabittir',
                '• Have constant phase difference between them'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kararlı girişim deseni oluştururlar',
                '• Create stable interference patterns'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Örnekler: Lazer, tek kaynaktan bölünmüş dalgalar',
                '• Examples: Laser, waves split from single source'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('İnkoherent Kaynaklar:', 'Incoherent Sources:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Farklı frekanslara sahip olabilir',
                '• May have different frequencies'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Faz farkı zamanla değişir',
                '• Phase difference changes with time'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kararlı girişim deseni oluşturmaz',
                '• Do not create stable interference patterns'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Örnekler: Bağımsız ışık kaynakları, normal ampuller',
                '• Examples: Independent light sources, ordinary bulbs'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Koherans Uzunluğu:', 'Coherence Length:')}
            </Text>
            <FormulaText 
              formula="L_c = c × τ_c = λ²/Δλ"
              description={t('τ_c: Koherans zamanı, Δλ: Spektral genişlik', 'τ_c: Coherence time, Δλ: Spectral width')}
            />
          </View>

          {/* Duran Dalgalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Duran Dalgalar', 'Standing Waves')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Duran dalgalar, aynı frekansta ama zıt yönlerde ilerleyen iki dalganın girişimi sonucu oluşur. Bu durumda dalga enerjisi bir yönde ilerlemez, sabit noktalarda titreşir.',
                'Standing waves result from the interference of two waves of the same frequency traveling in opposite directions. In this case, wave energy does not propagate in one direction but oscillates at fixed points.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Duran Dalga Oluşumu:', 'Standing Wave Formation:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İki dalga denklemi:',
                'Two wave equations:'
              )}
            </Text>
            <FormulaText 
              formula="y₁ = A sin(kx - ωt)"
              description={t('Sağa giden dalga', 'Wave traveling to the right')}
            />
            <FormulaText 
              formula="y₂ = A sin(kx + ωt)"
              description={t('Sola giden dalga', 'Wave traveling to the left')}
            />

            <Text style={styles.paragraph}>
              {t(
                'Süperpozisyon sonucu:',
                'Result of superposition:'
              )}
            </Text>
            <FormulaText 
              formula="y = y₁ + y₂ = 2A sin(kx) cos(ωt)"
              description={t('Duran dalga denklemi', 'Standing wave equation')}
            />

            <Text style={styles.subTitle}>
              {t('Düğüm ve Karın Noktaları:', 'Nodes and Antinodes:')}
            </Text>
            
            <Text style={styles.paragraph}>
              {t(
                '**Düğüm Noktaları (Nodes):** Genliğin her zaman sıfır olduğu noktalar',
                '**Nodes:** Points where amplitude is always zero'
              )}
            </Text>
            <FormulaText 
              formula="sin(kx) = 0 → x = nλ/2"
              description={t('n = 0, 1, 2, 3, ... (düğüm konumları)', 'n = 0, 1, 2, 3, ... (node positions)')}
            />

            <Text style={styles.paragraph}>
              {t(
                '**Karın Noktaları (Antinodes):** Genliğin maksimum olduğu noktalar',
                '**Antinodes:** Points where amplitude is maximum'
              )}
            </Text>
            <FormulaText 
              formula="sin(kx) = ±1 → x = (2n+1)λ/4"
              description={t('n = 0, 1, 2, 3, ... (karın konumları)', 'n = 0, 1, 2, 3, ... (antinode positions)')}
            />

            <Text style={styles.subTitle}>
              {t('Duran Dalga Özellikleri:', 'Standing Wave Properties:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Enerji taşımaz, sadece titreşir',
                '• Does not transport energy, only oscillates'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Düğümler arası mesafe λ/2',
                '• Distance between nodes is λ/2'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Karınlar arası mesafe λ/2',
                '• Distance between antinodes is λ/2'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Düğüm-karın arası mesafe λ/4',
                '• Distance between node and antinode is λ/4'
              )}
            </Text>
          </View>

          {/* Sınır Koşulları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Sınır Koşulları ve Yansıma', 'Boundary Conditions and Reflection')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalgalar farklı ortamların sınırına geldiğinde yansıma ve kırılma meydana gelir. Sınır koşulları, duran dalga desenini belirler.',
                'When waves reach the boundary of different media, reflection and refraction occur. Boundary conditions determine the standing wave pattern.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Sabit Uç (Fixed End):', 'Fixed End:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalga sabit bir uca çarptığında faz terslemesi ile yansır.',
                'When a wave hits a fixed end, it reflects with phase inversion.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Uçta her zaman düğüm oluşur',
                '• Node always forms at the end'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Faz 180° değişir',
                '• Phase changes by 180°'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Örnek: İpin sabit uca bağlı olması',
                '• Example: String attached to fixed end'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Serbest Uç (Free End):', 'Free End:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dalga serbest bir uçtan faz değişimi olmadan yansır.',
                'Wave reflects from a free end without phase change.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Uçta her zaman karın oluşur',
                '• Antinode always forms at the end'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Faz değişmez',
                '• No phase change'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Örnek: İpin serbest ucu',
                '• Example: Free end of string'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kapalı Boru (Closed Pipe):', 'Closed Pipe:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Ses dalgaları için kapalı borudaki duran dalga modları:',
                'Standing wave modes in closed pipe for sound waves:'
              )}
            </Text>
            <FormulaText 
              formula="f_n = (2n-1) × v/(4L)"
              description={t('n = 1, 2, 3, ... (tek harmonikler)', 'n = 1, 2, 3, ... (odd harmonics)')}
            />

            <Text style={styles.subTitle}>
              {t('Açık Boru (Open Pipe):', 'Open Pipe:')}
            </Text>
            <FormulaText 
              formula="f_n = n × v/(2L)"
              description={t('n = 1, 2, 3, ... (tüm harmonikler)', 'n = 1, 2, 3, ... (all harmonics)')}
            />
          </View>

          {/* Tel Titreşimleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Tel Titreşimleri', 'String Vibrations')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Enine dalgaların en yaygın örneklerinden biri tel titreşimleridir. Müzik enstrümanlarının temel çalışma prensibidir.',
                'String vibrations are one of the most common examples of transverse waves. They are the fundamental working principle of musical instruments.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Tel Üzerindeki Dalga Hızı:', 'Wave Speed on String:')}
            </Text>
            <FormulaText 
              formula="v = √(T/μ)"
              description={t('T: Gerilim kuvveti (N), μ: Doğrusal kütle yoğunluğu (kg/m)', 'T: Tension force (N), μ: Linear mass density (kg/m)')}
            />

            <Text style={styles.subTitle}>
              {t('İki Ucu Sabit Tel:', 'String Fixed at Both Ends:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Her iki uçta düğüm oluşur. İzin verilen dalga boyları:',
                'Nodes form at both ends. Allowed wavelengths:'
              )}
            </Text>
            <FormulaText 
              formula="λ_n = 2L/n"
              description={t('n = 1, 2, 3, ... (harmonik sayısı)', 'n = 1, 2, 3, ... (harmonic number)')}
            />

            <FormulaText 
              formula="f_n = n × v/(2L) = n × f₁"
              description={t('f₁: Temel frekans (1. harmonik)', 'f₁: Fundamental frequency (1st harmonic)')}
            />

            <Text style={styles.subTitle}>
              {t('Harmonikler:', 'Harmonics:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• 1. Harmonik (Temel ton): n = 1, f₁ = v/(2L)',
                '• 1st Harmonic (Fundamental): n = 1, f₁ = v/(2L)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• 2. Harmonik (1. Overtone): n = 2, f₂ = 2f₁',
                '• 2nd Harmonic (1st Overtone): n = 2, f₂ = 2f₁'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• 3. Harmonik (2. Overtone): n = 3, f₃ = 3f₁',
                '• 3rd Harmonic (2nd Overtone): n = 3, f₃ = 3f₁'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Müzik ve Akustik:', 'Music and Acoustics:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Müzik enstrümanlarındaki ses kalitesi, harmoniklerin oranlarına bağlıdır.',
                'Sound quality in musical instruments depends on the ratios of harmonics.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Temel frekans sesin perdesini belirler',
                '• Fundamental frequency determines pitch'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Harmonikler sesin tınısını oluşturur',
                '• Harmonics create the timbre'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Tel kalınlığı, uzunluğu ve gerilimi frekansı etkiler',
                '• String thickness, length and tension affect frequency'
              )}
            </Text>
          </View>

          {/* Çok Boyutlu Girişim */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Çok Boyutlu Girişim', 'Multi-Dimensional Interference')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İki boyutlu ve üç boyutlu dalga girişimleri, daha karmaşık desenler oluşturur.',
                'Two-dimensional and three-dimensional wave interference creates more complex patterns.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('İki Boyutlu Dalga Girişimi:', 'Two-Dimensional Wave Interference:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Su yüzeyindeki dalgalar için:',
                'For waves on water surface:'
              )}
            </Text>
            <FormulaText 
              formula="y(x,y,t) = A₁ cos(k₁x - ωt) + A₂ cos(k₂y - ωt)"
              description={t('Dik açılı iki dalganın girişimi', 'Interference of two perpendicular waves')}
            />

            <Text style={styles.subTitle}>
              {t('Dairesel Dalga Girişimi:', 'Circular Wave Interference:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İki nokta kaynaktan yayılan dairesel dalgaların girişimi:',
                'Interference of circular waves from two point sources:'
              )}
            </Text>
            <FormulaText 
              formula="y = A₁/r₁ × cos(kr₁ - ωt) + A₂/r₂ × cos(kr₂ - ωt)"
              description={t('r₁, r₂: Kaynaklardan uzaklıklar', 'r₁, r₂: Distances from sources')}
            />

            <Text style={styles.subTitle}>
              {t('Üç Boyutlu Akustik Girişim:', 'Three-Dimensional Acoustic Interference:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Ses dalgalarının uzayda girişimi, akustik mühendisliğinin temelini oluşturur.',
                'Interference of sound waves in space forms the basis of acoustic engineering.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Konser salonlarında ses dağılımı',
                '• Sound distribution in concert halls'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Gürültü kontrolü ve ses yalıtımı',
                '• Noise control and sound insulation'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Stereo ve surround ses sistemleri',
                '• Stereo and surround sound systems'
              )}
            </Text>
          </View>

          {/* Günlük Hayat Örnekleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Günlük Hayat Örnekleri', 'Daily Life Examples')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Müzik Enstrümanları', 'Musical Instruments')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Gitar, keman, piyano - tel ve hava kolonu titreşimleri',
                    'Guitar, violin, piano - string and air column vibrations'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Mikrodalga Fırın', 'Microwave Oven')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Duran dalga düğümlerinde soğuk noktalar',
                    'Cold spots at standing wave nodes'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Gürültü İptal Kulaklık', 'Noise-Canceling Headphones')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Yıkıcı girişimle gürültü azaltma',
                    'Noise reduction through destructive interference'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Radyo Antenleri', 'Radio Antennas')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Duran dalga ile sinyal güçlendirme',
                    'Signal amplification with standing waves'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Köprü Titreşimleri', 'Bridge Vibrations')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Rezonansın yapısal hasarlara etkisi',
                    'Effect of resonance on structural damage'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Su Dalgaları', 'Water Waves')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Rıhtım ve gemiler arası girişim desenleri',
                    'Interference patterns between piers and ships'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Modern Teknoloji Uygulamaları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Modern Teknoloji Uygulamaları', 'Modern Technology Applications')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Lazer Interferometresi', 'Laser Interferometry')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'LIGO - Yerçekimi dalgalarını tespit etme',
                    'LIGO - Detecting gravitational waves'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Holografi', 'Holography')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Işık girişimi ile 3D görüntü oluşturma',
                    '3D image creation through light interference'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Fiber Optik', 'Fiber Optics')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Çok modlu fiber girişim efektleri',
                    'Multi-mode fiber interference effects'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('MRI Görüntüleme', 'MRI Imaging')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Radyo frekansı girişimi ve görüntü kalitesi',
                    'RF interference and image quality'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Kuantum İletişim', 'Quantum Communication')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Foton girişimi ve kuantum durumları',
                    'Photon interference and quantum states'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Beamforming Antenler', 'Beamforming Antennas')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    '5G teknolojisinde yönlü sinyal üretimi',
                    'Directional signal generation in 5G technology'
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
              {t('Girişim Problemleri:', 'Interference Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Kaynak sayısını ve türünü belirleyin',
                '1. Determine number and type of sources'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Yol farkını hesaplayın (Δx)',
                '2. Calculate path difference (Δx)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Faz farkını bulun (Δφ = 2πΔx/λ)',
                '3. Find phase difference (Δφ = 2πΔx/λ)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Yapıcı/yıkıcı girişim koşullarını uygulayın',
                '4. Apply constructive/destructive interference conditions'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '5. Sonuç genliğini hesaplayın',
                '5. Calculate resulting amplitude'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Duran Dalga Problemleri:', 'Standing Wave Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Sınır koşullarını belirleyin (sabit/serbest uç)',
                '1. Determine boundary conditions (fixed/free end)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Düğüm ve karın konumlarını hesaplayın',
                '2. Calculate node and antinode positions'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. İzin verilen dalga boylarını bulun',
                '3. Find allowed wavelengths'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Harmonik frekansları hesaplayın',
                '4. Calculate harmonic frequencies'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Tel Titreşim Problemleri:', 'String Vibration Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Tel özelliklerini belirleyin (L, μ, T)',
                '1. Determine string properties (L, μ, T)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Dalga hızını hesaplayın (v = √(T/μ))',
                '2. Calculate wave speed (v = √(T/μ))'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Harmonik frekansları bulun',
                '3. Find harmonic frequencies'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Müzik aralıklarını karşılaştırın',
                '4. Compare musical intervals'
              )}
            </Text>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Girişim ve süperpozisyon, dalga fiziğinin en temel kavramlarıdır. Bu prensipler, müzikten modern teknolojiye kadar geniş bir yelpazede uygulanır.',
                'Interference and superposition are the most fundamental concepts in wave physics. These principles are applied in a wide range from music to modern technology.'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Duran dalgalar müzik enstrümanlarının temelini oluştururken, girişim fenomeni holografi, lazer interferometresi ve kuantum teknolojilerinde kritik rol oynar.',
                'While standing waves form the basis of musical instruments, interference phenomena play a critical role in holography, laser interferometry and quantum technologies.'
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