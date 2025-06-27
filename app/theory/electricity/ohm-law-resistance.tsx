import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function OhmLawResistanceTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Ohm Yasası ve Direnç', 'Ohm\'s Law and Resistance')}
      titleEn="Ohm's Law and Resistance"
      difficulty={t('Temel Seviye', 'Basic Level')}
      difficultyEn="Basic Level"
      description={t(
        'Elektrik devrelerinin temel yasası: gerilim, akım ve direnç ilişkisi',
        'Fundamental law of electric circuits: voltage, current and resistance relationship'
      )}
      descriptionEn="Fundamental law of electric circuits: voltage, current and resistance relationship"
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
              {t('Ohm Yasası Nedir?', 'What is Ohm\'s Law?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Ohm Yasası, elektrik devrelerinde gerilim, akım ve direnç arasındaki temel ilişkiyi tanımlayan yasadır. Georg Simon Ohm tarafından 1827 yılında keşfedilen bu yasa, elektrik mühendisliğinin temelini oluşturur.',
                'Ohm\'s Law is the fundamental law that defines the relationship between voltage, current, and resistance in electrical circuits. Discovered by Georg Simon Ohm in 1827, this law forms the foundation of electrical engineering.'
              )}
            </Text>
            <FormulaText 
              formula="V = I × R"
              description={t('V: Gerilim (Volt), I: Akım (Amper), R: Direnç (Ohm)', 'V: Voltage (Volt), I: Current (Ampere), R: Resistance (Ohm)')}
            />
          </View>

          {/* Georg Simon Ohm ve Tarihi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Georg Simon Ohm ve Tarihçe', 'Georg Simon Ohm and History')}
            </Text>
            
            <Text style={styles.subTitle}>
              {t('Georg Simon Ohm (1789-1854)', 'Georg Simon Ohm (1789-1854)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Alman fizikçi Georg Simon Ohm, elektrik akımı üzerine yaptığı deneylerle bugün adını taşıyan yasayı keşfetti. İlk başta çalışması bilim dünyası tarafından pek kabul görmedi.',
                'German physicist Georg Simon Ohm discovered the law that bears his name through experiments on electric current. Initially, his work was not well accepted by the scientific community.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Keşfin Önemi', 'Importance of Discovery')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Ohm\'ın keşfi, elektrikli cihazların tasarımından güç dağıtım sistemlerine kadar elektrik teknolojisinin gelişiminde kritik rol oynadı. Modern elektroniğin temeli sayılır.',
                'Ohm\'s discovery played a critical role in the development of electrical technology from the design of electrical devices to power distribution systems. It is considered the foundation of modern electronics.'
              )}
            </Text>

            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Direnç birimi "Ohm" (Ω), Georg Simon Ohm\'un onuruna adlandırılmıştır.',
                  'The unit of resistance "Ohm" (Ω) is named in honor of Georg Simon Ohm.'
                )}
              </Text>
            </View>
          </View>

          {/* Elektrik Akımı */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Elektrik Akımı', 'Electric Current')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Elektrik akımı, elektrik yüklerinin bir iletken içerisinde düzenli hareketide. Genellikle elektronların hareketi ile oluşur ve amper (A) birimi ile ölçülür.',
                'Electric current is the orderly movement of electric charges within a conductor. It is usually created by the movement of electrons and is measured in amperes (A).'
              )}
            </Text>

            <FormulaText 
              formula="I = Q/t"
              description={t('I: Akım (A), Q: Yük miktarı (Coulomb), t: Zaman (s)', 'I: Current (A), Q: Amount of charge (Coulomb), t: Time (s)')}
            />

            <Text style={styles.subTitle}>
              {t('Akım Türleri:', 'Types of Current:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Doğru Akım (DC): Tek yönde akan sabit akım',
                '• Direct Current (DC): Constant current flowing in one direction'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Alternatif Akım (AC): Yönü periyodik olarak değişen akım',
                '• Alternating Current (AC): Current whose direction changes periodically'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Akım Yoğunluğu:', 'Current Density:')}
            </Text>
            <FormulaText 
              formula="J = I/A = nev_d"
              description={t('J: Akım yoğunluğu, A: Kesit alanı, n: Elektron yoğunluğu, v_d: Sürüklenme hızı', 'J: Current density, A: Cross-sectional area, n: Electron density, v_d: Drift velocity')}
            />
          </View>

          {/* Gerilim (Potansiyel Farkı) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Gerilim (Potansiyel Farkı)', 'Voltage (Potential Difference)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Gerilim, elektrik devresinde iki nokta arasındaki elektrik potansiyel farkıdır. Bu fark, elektrik yüklerinin hareket etmesi için gerekli itici kuvveti sağlar.',
                'Voltage is the electric potential difference between two points in an electrical circuit. This difference provides the driving force necessary for electric charges to move.'
              )}
            </Text>

            <FormulaText 
              formula="V = W/Q"
              description={t('V: Gerilim (V), W: İş (Joule), Q: Yük (Coulomb)', 'V: Voltage (V), W: Work (Joule), Q: Charge (Coulomb)')}
            />

            <Text style={styles.subTitle}>
              {t('Gerilim Kaynakları:', 'Voltage Sources:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Pil: Kimyasal enerjiyi elektrik enerjisine dönüştürür',
                '• Battery: Converts chemical energy to electrical energy'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Jeneratör: Mekanik enerjiyi elektrik enerjisine dönüştürür',
                '• Generator: Converts mechanical energy to electrical energy'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Güneş paneli: Güneş enerjisini elektrik enerjisine dönüştürür',
                '• Solar panel: Converts solar energy to electrical energy'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Adaptör: AC gerilimi DC gerilimine dönüştürür',
                '• Adapter: Converts AC voltage to DC voltage'
              )}
            </Text>
          </View>

          {/* Direnç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Elektrik Direnci', 'Electrical Resistance')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Direnç, bir malzemenin elektrik akımına karşı gösterdiği zorluktur. Atomların elektronların hareketini engellemesi sonucu oluşur ve ohm (Ω) birimi ile ölçülür.',
                'Resistance is the difficulty that a material shows against electric current. It occurs as a result of atoms hindering the movement of electrons and is measured in ohms (Ω).'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Direnci Etkileyen Faktörler:', 'Factors Affecting Resistance:')}
            </Text>
            
            <FormulaText 
              formula="R = ρL/A"
              description={t('ρ: Öz direnç (Ω⋅m), L: Uzunluk (m), A: Kesit alanı (m²)', 'ρ: Resistivity (Ω⋅m), L: Length (m), A: Cross-sectional area (m²)')}
            />

            <Text style={styles.listItem}>
              {t(
                '• Malzeme cinsi: Her malzemenin kendine özgü öz direnci vardır',
                '• Material type: Each material has its own specific resistivity'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Uzunluk: Uzunluk arttıkça direnç artar',
                '• Length: Resistance increases as length increases'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Kesit alanı: Alan arttıkça direnç azalır',
                '• Cross-sectional area: Resistance decreases as area increases'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Sıcaklık: Çoğu metallerde sıcaklık arttıkça direnç artar',
                '• Temperature: In most metals, resistance increases as temperature increases'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Sıcaklık Bağımlılığı:', 'Temperature Dependence:')}
            </Text>
            <FormulaText 
              formula="R(T) = R₀[1 + α(T - T₀)]"
              description={t('α: Sıcaklık katsayısı, T₀: Referans sıcaklık', 'α: Temperature coefficient, T₀: Reference temperature')}
            />
          </View>

          {/* Malzeme Türleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Malzeme Türleri', 'Material Types')}
            </Text>

            <Text style={styles.subTitle}>
              {t('İletkenler', 'Conductors')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çok düşük dirence sahip malzemelerdir. Elektronları kolayca hareket ettirebilirler.',
                'Materials with very low resistance. They can easily move electrons.'
              )}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Gümüş (Ag)', 'Silver (Ag)')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('ρ = 1.59×10⁻⁸ Ω⋅m', 'ρ = 1.59×10⁻⁸ Ω⋅m')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Bakır (Cu)', 'Copper (Cu)')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('ρ = 1.68×10⁻⁸ Ω⋅m', 'ρ = 1.68×10⁻⁸ Ω⋅m')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Altın (Au)', 'Gold (Au)')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('ρ = 2.44×10⁻⁸ Ω⋅m', 'ρ = 2.44×10⁻⁸ Ω⋅m')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Alüminyum (Al)', 'Aluminum (Al)')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('ρ = 2.82×10⁻⁸ Ω⋅m', 'ρ = 2.82×10⁻⁸ Ω⋅m')}
                </Text>
              </View>
            </View>

            <Text style={styles.subTitle}>
              {t('Yalıtkanlar', 'Insulators')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çok yüksek dirence sahip malzemelerdir. Elektrik akımını geçirmezler.',
                'Materials with very high resistance. They do not conduct electric current.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Cam: ρ ≈ 10¹²⁻¹⁶ Ω⋅m', '• Glass: ρ ≈ 10¹²⁻¹⁶ Ω⋅m')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Kauçuk: ρ ≈ 10¹³ Ω⋅m', '• Rubber: ρ ≈ 10¹³ Ω⋅m')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Seramik: ρ ≈ 10¹²⁻¹⁴ Ω⋅m', '• Ceramic: ρ ≈ 10¹²⁻¹⁴ Ω⋅m')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yarı İletkenler', 'Semiconductors')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İletkenler ve yalıtkanlar arasında dirence sahip malzemelerdir. Sıcaklık ve katkı maddeleri ile dirençleri kontrol edilebilir.',
                'Materials with resistance between conductors and insulators. Their resistance can be controlled with temperature and dopants.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Silisyum (Si): ρ ≈ 10³ Ω⋅m', '• Silicon (Si): ρ ≈ 10³ Ω⋅m')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Germanyum (Ge): ρ ≈ 0.5 Ω⋅m', '• Germanium (Ge): ρ ≈ 0.5 Ω⋅m')}
            </Text>
          </View>

          {/* Ohm Yasasının Formları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Ohm Yasasının Farklı Formları', 'Different Forms of Ohm\'s Law')}
            </Text>
            
            <Text style={styles.paragraph}>
              {t(
                'Ohm yasası üç farklı şekilde yazılabilir ve her form farklı büyüklükleri hesaplamak için kullanılır:',
                'Ohm\'s law can be written in three different forms and each form is used to calculate different quantities:'
              )}
            </Text>

            <FormulaText 
              formula="V = I × R"
              description={t('Gerilim hesaplama', 'Voltage calculation')}
            />

            <FormulaText 
              formula="I = V/R"
              description={t('Akım hesaplama', 'Current calculation')}
            />

            <FormulaText 
              formula="R = V/I"
              description={t('Direnç hesaplama', 'Resistance calculation')}
            />

            <Text style={styles.subTitle}>
              {t('Güç Hesaplamaları:', 'Power Calculations:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Ohm yasası ile güç formüllerini birleştirerek farklı güç hesaplama yolları bulabiliriz:',
                'By combining Ohm\'s law with power formulas, we can find different ways to calculate power:'
              )}
            </Text>

            <FormulaText 
              formula="P = V × I = I²R = V²/R"
              description={t('P: Güç (Watt)', 'P: Power (Watt)')}
            />
          </View>

          {/* Direnç Bağlantıları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Direnç Bağlantıları', 'Resistance Connections')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Seri Bağlantı', 'Series Connection')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dirençler art arda bağlandığında seri bağlantı oluşur. Toplam direnç, bireysel dirençlerin toplamına eşittir.',
                'When resistors are connected end-to-end, a series connection is formed. The total resistance equals the sum of individual resistances.'
              )}
            </Text>

            <FormulaText 
              formula="R_toplam = R₁ + R₂ + R₃ + ..."
              description={t('Seri bağlantıda toplam direnç', 'Total resistance in series connection')}
            />

            <Text style={styles.listItem}>
              {t('• Aynı akım tüm dirençlerden geçer: I₁ = I₂ = I₃', '• Same current flows through all resistors: I₁ = I₂ = I₃')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Gerilimler paylaşılır: V_toplam = V₁ + V₂ + V₃', '• Voltages are shared: V_total = V₁ + V₂ + V₃')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Paralel Bağlantı', 'Parallel Connection')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dirençler yan yana bağlandığında paralel bağlantı oluşur. Toplam direncin tersi, bireysel dirençlerin terslerinin toplamına eşittir.',
                'When resistors are connected side-by-side, a parallel connection is formed. The reciprocal of total resistance equals the sum of reciprocals of individual resistances.'
              )}
            </Text>

            <FormulaText 
              formula="1/R_toplam = 1/R₁ + 1/R₂ + 1/R₃ + ..."
              description={t('Paralel bağlantıda toplam direnç', 'Total resistance in parallel connection')}
            />

            <Text style={styles.listItem}>
              {t('• Aynı gerilim tüm dirençlere uygulanır: V₁ = V₂ = V₃', '• Same voltage is applied to all resistors: V₁ = V₂ = V₃')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Akımlar paylaşılır: I_toplam = I₁ + I₂ + I₃', '• Currents are shared: I_total = I₁ + I₂ + I₃')}
            </Text>
          </View>

          {/* Kirchhoff Yasaları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kirchhoff Yasaları', 'Kirchhoff\'s Laws')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Gustav Kirchhoff tarafından formüle edilen bu yasalar, Ohm yasası ile birlikte karmaşık elektrik devrelerini analiz etmek için kullanılır.',
                'These laws formulated by Gustav Kirchhoff are used together with Ohm\'s law to analyze complex electrical circuits.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kirchhoff\'un Akım Yasası (KAY)', 'Kirchhoff\'s Current Law (KCL)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Bir düğüme giren akımların toplamı, o düğümden çıkan akımların toplamına eşittir.',
                'The sum of currents entering a node equals the sum of currents leaving that node.'
              )}
            </Text>
            <FormulaText 
              formula="∑I_giren = ∑I_çıkan"
              description={t('Yük korunumu ilkesi', 'Charge conservation principle')}
            />

            <Text style={styles.subTitle}>
              {t('Kirchhoff\'un Gerilim Yasası (KGY)', 'Kirchhoff\'s Voltage Law (KVL)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Kapalı bir çevrim boyunca gerilim düşümlerinin toplamı, gerilim yükselmelerinin toplamına eşittir.',
                'The sum of voltage drops around a closed loop equals the sum of voltage rises.'
              )}
            </Text>
            <FormulaText 
              formula="∑V = 0"
              description={t('Enerji korunumu ilkesi', 'Energy conservation principle')}
            />
          </View>

          {/* Günlük Hayat Uygulamaları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Günlük Hayat Uygulamaları', 'Daily Life Applications')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Ev Elektrik Tesisatı', 'Home Electrical Installation')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Prizler paralel, anahtarlar seri bağlı',
                    'Outlets parallel, switches series connected'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('LED Lambalar', 'LED Lights')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Direnç ile akım sınırlama',
                    'Current limiting with resistance'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Şarj Cihazları', 'Chargers')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Sabit gerilim, değişken akım kontrolü',
                    'Constant voltage, variable current control'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Elektrikli Isıtıcılar', 'Electric Heaters')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Direnç ile ısı üretimi (P = I²R)',
                    'Heat generation with resistance (P = I²R)'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Sensörler', 'Sensors')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Sıcaklık, ışık sensörleri (direnç değişimi)',
                    'Temperature, light sensors (resistance change)'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Güç Adaptörleri', 'Power Adapters')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Gerilim düşürme ve akım kontrolü',
                    'Voltage reduction and current control'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Güvenlik Konuları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Elektrik Güvenliği', 'Electrical Safety')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Ohm yasası elektrik güvenliği için kritik öneme sahiptir. İnsan vücudunun direnci ve güvenli akım seviyelerini anlamak hayati önem taşır.',
                'Ohm\'s law is critically important for electrical safety. Understanding human body resistance and safe current levels is vital.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('İnsan Vücut Direnci:', 'Human Body Resistance:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Kuru deri: 1,000-100,000 Ω', '• Dry skin: 1,000-100,000 Ω')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Islak deri: 1,000 Ω', '• Wet skin: 1,000 Ω')}
            </Text>
            <Text style={styles.listItem}>
              {t('• İç organ direnci: 300-500 Ω', '• Internal organ resistance: 300-500 Ω')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Tehlikeli Akım Seviyeleri:', 'Dangerous Current Levels:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• 1 mA: Hissedilebilir', '• 1 mA: Perceptible')}
            </Text>
            <Text style={styles.listItem}>
              {t('• 5 mA: Acı verici', '• 5 mA: Painful')}
            </Text>
            <Text style={styles.listItem}>
              {t('• 10-20 mA: Kas kontrolü kaybı', '• 10-20 mA: Loss of muscle control')}
            </Text>
            <Text style={styles.listItem}>
              {t('• 50 mA: Hayati tehlike', '• 50 mA: Life threatening')}
            </Text>

            <FormulaText 
              formula="I = V/R_vücut"
              description={t('Vücuttan geçen akım hesabı', 'Current through body calculation')}
            />
          </View>

          {/* Problem Çözüm Teknikleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Problem Çözüm Teknikleri', 'Problem Solving Techniques')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Basit Devre Problemleri:', 'Simple Circuit Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Verilen değerleri listeleyin (V, I, R)',
                '1. List given values (V, I, R)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Bulunması istenen büyüklüğü belirleyin',
                '2. Identify the quantity to be found'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Uygun Ohm yasası formunu seçin',
                '3. Choose appropriate Ohm\'s law formula'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Hesaplama yapın ve birimi kontrol edin',
                '4. Calculate and check units'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Karmaşık Devre Problemleri:', 'Complex Circuit Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Devreyi çizin ve düğümleri/çevrimleri belirleyin',
                '1. Draw circuit and identify nodes/loops'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Seri ve paralel bağlantıları tespit edin',
                '2. Identify series and parallel connections'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Kirchhoff yasalarını uygulayın',
                '3. Apply Kirchhoff\'s laws'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Denklem sistemi kurup çözün',
                '4. Set up and solve system of equations'
              )}
            </Text>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Ohm Yasası, elektrik ve elektronik mühendisliğinin temel taşlarından biridir. Bu basit ama güçlü yasa, mikro çiplerden güç santralerine kadar tüm elektrik sistemlerinin tasarım ve analizinde kullanılır.',
                'Ohm\'s Law is one of the fundamental pillars of electrical and electronic engineering. This simple but powerful law is used in the design and analysis of all electrical systems from microchips to power plants.'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Günümüzde akıllı telefonlardan elektrikli araçlara, LED aydınlatmadan güneş panellerine kadar sayısız teknolojik uygulamada Ohm yasasının prensipleri yer almaktadır.',
                'Today, the principles of Ohm\'s law are involved in countless technological applications from smartphones to electric vehicles, from LED lighting to solar panels.'
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