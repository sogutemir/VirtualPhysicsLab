import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function EnergyConservationTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Enerji Korunumu', 'Energy Conservation')}
      titleEn="Energy Conservation"
      difficulty={t('Orta Seviye', 'Intermediate Level')}
      difficultyEn="Intermediate Level"
      description={t(
        'Mekanik enerji, potansiyel enerji türleri, enerji korunumu yasası ve uygulamaları',
        'Mechanical energy, types of potential energy, law of energy conservation and applications'
      )}
      descriptionEn="Mechanical energy, types of potential energy, law of energy conservation and applications"
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
              {t('Enerji Korunumu Nedir?', 'What is Energy Conservation?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Enerji korunumu, fiziğin en temel yasalarından biridir. Bu yasaya göre, izole bir sistemdeki toplam enerji sabit kalır; enerji ne yaratılabilir ne de yok edilebilir, yalnızca bir türden diğerine dönüşebilir.',
                'Energy conservation is one of the most fundamental laws of physics. According to this law, the total energy in an isolated system remains constant; energy can neither be created nor destroyed, only transformed from one form to another.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Emmy Noether tarafından 1915\'te kanıtlanan bu ilke, zamanın homojenliği ile doğrudan bağlantılıdır.',
                  'This principle, proven by Emmy Noether in 1915, is directly related to the homogeneity of time.'
                )}
              </Text>
            </View>
          </View>

          {/* Mekanik Enerji */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Mekanik Enerji', 'Mechanical Energy')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Mekanik enerji, kinetik enerji ve potansiyel enerjinin toplamıdır. Konservatif kuvvetlerin etkisinde olan sistemlerde mekanik enerji korunur.',
                'Mechanical energy is the sum of kinetic energy and potential energy. In systems under the influence of conservative forces, mechanical energy is conserved.'
              )}
            </Text>

            <FormulaText 
              formula="E_mekanik = E_kinetik + E_potansiyel"
              description={t('Toplam mekanik enerji', 'Total mechanical energy')}
            />

            <Text style={styles.subTitle}>
              {t('Kinetik Enerji:', 'Kinetic Energy:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Hareket halindeki bir cismin sahip olduğu enerjidir. Kütlenin ve hızın karesi ile orantılıdır.',
                'Energy possessed by a moving object. It is proportional to mass and the square of velocity.'
              )}
            </Text>

            <FormulaText 
              formula="E_k = ½mv²"
              description={t('m: Kütle (kg), v: Hız (m/s)', 'm: Mass (kg), v: Velocity (m/s)')}
            />

            <Text style={styles.subTitle}>
              {t('Dönme Kinetik Enerjisi:', 'Rotational Kinetic Energy:')}
            </Text>
            <FormulaText 
              formula="E_k_dönme = ½Iω²"
              description={t('I: Atalet momenti (kg⋅m²), ω: Açısal hız (rad/s)', 'I: Moment of inertia (kg⋅m²), ω: Angular velocity (rad/s)')}
            />

            <Text style={styles.subTitle}>
              {t('Kinetik Enerji Özellikleri:', 'Kinetic Energy Properties:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Her zaman pozitiftir (skaler büyüklük)',
                '• Always positive (scalar quantity)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Hızın karesi ile orantılı (v² bağımlılığı)',
                '• Proportional to square of velocity (v² dependence)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Referans çerçevesine bağlıdır',
                '• Depends on reference frame'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Hız sıfır olduğunda kinetik enerji sıfırdır',
                '• Kinetic energy is zero when velocity is zero'
              )}
            </Text>
          </View>

          {/* Potansiyel Enerji */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Potansiyel Enerji', 'Potential Energy')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Potansiyel enerji, bir cismin konumu veya durumu nedeniyle sahip olduğu enerjidir. Konservatif kuvvet alanlarında tanımlanır ve sadece konum ile ilgilidir.',
                'Potential energy is the energy an object possesses due to its position or state. It is defined in conservative force fields and depends only on position.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yerçekimi Potansiyel Enerjisi:', 'Gravitational Potential Energy:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Yer yüzeyine yakın mesafelerde yerçekimi alanının sabit olduğu kabul edilir.',
                'Near Earth\'s surface, the gravitational field is assumed to be constant.'
              )}
            </Text>

            <FormulaText 
              formula="E_p = mgh"
              description={t('m: Kütle (kg), g: Yerçekimi ivmesi (9.8 m/s²), h: Yükseklik (m)', 'm: Mass (kg), g: Gravitational acceleration (9.8 m/s²), h: Height (m)')}
            />

            <Text style={styles.subTitle}>
              {t('Genel Yerçekimi Potansiyel Enerjisi:', 'General Gravitational Potential Energy:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Büyük mesafeler için Newton\'un evrensel çekim yasası kullanılır.',
                'For large distances, Newton\'s universal law of gravitation is used.'
              )}
            </Text>

            <FormulaText 
              formula="E_p = -GMm/r"
              description={t('G: Evrensel çekim sabiti, M: Merkez kütlesi, m: Cisim kütlesi, r: Mesafe', 'G: Universal gravitational constant, M: Central mass, m: Object mass, r: Distance')}
            />

            <Text style={styles.subTitle}>
              {t('Elastik Potansiyel Enerji:', 'Elastic Potential Energy:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Deforme olmuş elastik cisimler (yay, lastik) tarafından depolanan enerji.',
                'Energy stored by deformed elastic objects (springs, rubber).'
              )}
            </Text>

            <FormulaText 
              formula="E_p = ½kx²"
              description={t('k: Yay sabiti (N/m), x: Deformasyon miktarı (m)', 'k: Spring constant (N/m), x: Amount of deformation (m)')}
            />

            <Text style={styles.subTitle}>
              {t('Elektriksel Potansiyel Enerji:', 'Electrical Potential Energy:')}
            </Text>
            <FormulaText 
              formula="E_p = qV = kq₁q₂/r"
              description={t('q: Elektrik yükü, V: Elektrik potansiyeli, r: Yükler arası mesafe', 'q: Electric charge, V: Electric potential, r: Distance between charges')}
            />

            <Text style={styles.subTitle}>
              {t('Potansiyel Enerji Özellikleri:', 'Potential Energy Properties:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Referans noktasına göre tanımlanır',
                '• Defined relative to a reference point'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Konservatif kuvvetlerde yol bağımsızdır',
                '• Path independent for conservative forces'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Pozitif veya negatif olabilir',
                '• Can be positive or negative'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Sadece konuma bağlıdır, hıza değil',
                '• Depends only on position, not velocity'
              )}
            </Text>
          </View>

          {/* İş-Enerji Teoremi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('İş-Enerji Teoremi', 'Work-Energy Theorem')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Bir cisim üzerinde yapılan net iş, cismin kinetik enerjisindeki değişime eşittir. Bu teorem, enerji korunumu yasasının bir sonucudur.',
                'The net work done on an object equals the change in its kinetic energy. This theorem is a consequence of the law of energy conservation.'
              )}
            </Text>

            <FormulaText 
              formula="W_net = ΔE_k = E_k_son - E_k_ilk"
              description={t('Net iş = Kinetik enerji değişimi', 'Net work = Change in kinetic energy')}
            />

            <Text style={styles.subTitle}>
              {t('İş Tanımı:', 'Work Definition:')}
            </Text>
            <FormulaText 
              formula="W = F⋅s⋅cos θ = F_s⋅s"
              description={t('F: Kuvvet, s: Yer değiştirme, θ: Aralarındaki açı', 'F: Force, s: Displacement, θ: Angle between them')}
            />

            <Text style={styles.subTitle}>
              {t('Konservatif ve Non-Konservatif Kuvvetler:', 'Conservative and Non-Conservative Forces:')}
            </Text>
            
            <Text style={styles.paragraph}>
              {t(
                '**Konservatif Kuvvetler:** Yapılan iş yoldan bağımsızdır.',
                '**Conservative Forces:** Work done is path independent.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yerçekimi kuvveti', '• Gravitational force')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yay kuvveti (Hooke kuvveti)', '• Spring force (Hooke force)')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Elektrostatik kuvvet', '• Electrostatic force')}
            </Text>

            <Text style={styles.paragraph}>
              {t(
                '**Non-Konservatif Kuvvetler:** Yapılan iş yola bağlıdır.',
                '**Non-Conservative Forces:** Work done is path dependent.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Sürtünme kuvveti', '• Friction force')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Hava direnci', '• Air resistance')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Sönümleme kuvvetleri', '• Damping forces')}
            </Text>

            <FormulaText 
              formula="W_konservatif = -ΔE_p"
              description={t('Konservatif kuvvetin yaptığı iş potansiyel enerji değişiminin tersi', 'Work by conservative force is negative of potential energy change')}
            />
          </View>

          {/* Enerji Korunumu Yasası */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Enerji Korunumu Yasası', 'Law of Energy Conservation')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Sadece konservatif kuvvetlerin etki ettiği bir sistemde, toplam mekanik enerji sabit kalır.',
                'In a system where only conservative forces act, the total mechanical energy remains constant.'
              )}
            </Text>

            <FormulaText 
              formula="E_mekanik = E_k + E_p = Sabit"
              description={t('Mekanik enerji korunumu', 'Conservation of mechanical energy')}
            />

            <FormulaText 
              formula="E_k1 + E_p1 = E_k2 + E_p2"
              description={t('İki farklı andaki enerji eşitliği', 'Energy equality at two different times')}
            />

            <Text style={styles.subTitle}>
              {t('Non-Konservatif Kuvvetler Varken:', 'With Non-Conservative Forces:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Non-konservatif kuvvetler mekanik enerjiyi değiştirir (genellikle azaltır).',
                'Non-conservative forces change mechanical energy (usually decrease).'
              )}
            </Text>

            <FormulaText 
              formula="E_k2 + E_p2 = E_k1 + E_p1 + W_non-konservatif"
              description={t('Non-konservatif kuvvetlerle enerji dengesi', 'Energy balance with non-conservative forces')}
            />

            <Text style={styles.subTitle}>
              {t('Güç ve Enerji İlişkisi:', 'Power and Energy Relationship:')}
            </Text>
            <FormulaText 
              formula="P = dE/dt = F⋅v"
              description={t('Güç = Enerji değişim hızı', 'Power = Rate of energy change')}
            />
          </View>

          {/* Atwood Makinesi Uygulaması */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Atwood Makinesi ve Enerji Analizi', 'Atwood Machine and Energy Analysis')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Atwood makinesi, enerji korunumunun mükemmel bir uygulamasıdır. Bu sistemde yerçekimi potansiyel enerjisi, kinetik enerjiye dönüşür.',
                'The Atwood machine is a perfect application of energy conservation. In this system, gravitational potential energy converts to kinetic energy.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Sistem Tanımı:', 'System Definition:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İki kütle (m₁ ve m₂) ağırlıksız bir ip ile makara üzerinden bağlıdır. m₁ > m₂ olduğunu varsayalım.',
                'Two masses (m₁ and m₂) are connected by a massless string over a pulley. Assume m₁ > m₂.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Enerji Analizi:', 'Energy Analysis:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Sistem h mesafesi hareket ettiğinde:',
                'When the system moves distance h:'
              )}
            </Text>

            <Text style={styles.listItem}>
              {t(
                '• m₁ kütlesi h kadar aşağı iner',
                '• Mass m₁ descends by distance h'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• m₂ kütlesi h kadar yukarı çıkar',
                '• Mass m₂ ascends by distance h'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Her iki kütle de v hızına sahip olur',
                '• Both masses acquire velocity v'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Başlangıç Durumu (v = 0):', 'Initial State (v = 0):')}
            </Text>
            <FormulaText 
              formula="E_i = m₁gh₁ + m₂gh₂"
              description={t('Başlangıç potansiyel enerjisi', 'Initial potential energy')}
            />

            <Text style={styles.subTitle}>
              {t('Son Durum (h hareket sonrası):', 'Final State (after moving h):')}
            </Text>
            <FormulaText 
              formula="E_f = m₁g(h₁-h) + m₂g(h₂+h) + ½(m₁+m₂)v²"
              description={t('Son potansiyel + kinetik enerji', 'Final potential + kinetic energy')}
            />

            <Text style={styles.subTitle}>
              {t('Enerji Korunumu Uygulaması:', 'Application of Energy Conservation:')}
            </Text>
            <FormulaText 
              formula="E_i = E_f"
              description={t('Başlangıç enerjisi = Son enerji', 'Initial energy = Final energy')}
            />
            <FormulaText 
              formula="m₁gh₁ + m₂gh₂ = m₁g(h₁-h) + m₂g(h₂+h) + ½(m₁+m₂)v²"
              description={t('Atwood makinesi enerji korunumu', 'Atwood machine energy conservation')}
            />

            <Text style={styles.paragraph}>
              {t(
                'Sadeleştirme yapılırsa:',
                'After simplification:'
              )}
            </Text>
            <FormulaText 
              formula="(m₁-m₂)gh = ½(m₁+m₂)v²"
              description={t('Potansiyel enerji kaybı = Kinetik enerji kazancı', 'Potential energy loss = Kinetic energy gain')}
            />

            <Text style={styles.subTitle}>
              {t('Hız Formülü:', 'Velocity Formula:')}
            </Text>
            <FormulaText 
              formula="v = √[2(m₁-m₂)gh/(m₁+m₂)]"
              description={t('Atwood makinesinde h mesafe sonrası hız', 'Velocity in Atwood machine after distance h')}
            />

            <Text style={styles.subTitle}>
              {t('İvme Hesabı:', 'Acceleration Calculation:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'v² = 2ah kinematik eşitliğinden:',
                'From kinematic equation v² = 2ah:'
              )}
            </Text>
            <FormulaText 
              formula="a = (m₁-m₂)g/(m₁+m₂)"
              description={t('Atwood makinesi ivmesi', 'Atwood machine acceleration')}
            />

            <Text style={styles.subTitle}>
              {t('İp Gerilimi:', 'String Tension:')}
            </Text>
            <FormulaText 
              formula="T = 2m₁m₂g/(m₁+m₂)"
              description={t('Her iki kütle için aynı gerilim', 'Same tension for both masses')}
            />
          </View>

          {/* Çarpışmalar ve Enerji */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Çarpışmalar ve Enerji', 'Collisions and Energy')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çarpışmalarda momentum her zaman korunur, ancak kinetik enerji korunumu çarpışma türüne bağlıdır.',
                'In collisions, momentum is always conserved, but kinetic energy conservation depends on the type of collision.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Elastik Çarpışmalar:', 'Elastic Collisions:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Hem momentum hem de kinetik enerji korunur. Çarpışma sırasında cisimler deformasyona uğramaz.',
                'Both momentum and kinetic energy are conserved. Objects do not undergo deformation during collision.'
              )}
            </Text>

            <FormulaText 
              formula="½m₁v₁² + ½m₂v₂² = ½m₁v₁'² + ½m₂v₂'²"
              description={t('Kinetik enerji korunumu', 'Kinetic energy conservation')}
            />

            <FormulaText 
              formula="m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'"
              description={t('Momentum korunumu', 'Momentum conservation')}
            />

            <Text style={styles.subTitle}>
              {t('İnelastik Çarpışmalar:', 'Inelastic Collisions:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Momentum korunur ancak kinetik enerji korunmaz. Kinetik enerjinin bir kısmı ısı, ses vb. enerjilere dönüşür.',
                'Momentum is conserved but kinetic energy is not. Part of kinetic energy converts to heat, sound, etc.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Tamamen İnelastik Çarpışmalar:', 'Perfectly Inelastic Collisions:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çarpışma sonrası cisimler birlikte hareket eder. En fazla kinetik enerji kaybı olan durum.',
                'Objects move together after collision. Maximum kinetic energy loss case.'
              )}
            </Text>

            <FormulaText 
              formula="v_ortak = (m₁v₁ + m₂v₂)/(m₁ + m₂)"
              description={t('Çarpışma sonrası ortak hız', 'Common velocity after collision')}
            />

            <Text style={styles.subTitle}>
              {t('Enerji Kaybı Hesabı:', 'Energy Loss Calculation:')}
            </Text>
            <FormulaText 
              formula="ΔE_k = ½μ(v₁-v₂)²"
              description={t('μ = m₁m₂/(m₁+m₂): İndirgenmiş kütle', 'μ = m₁m₂/(m₁+m₂): Reduced mass')}
            />
          </View>

          {/* Roket Hareketi ve Enerji */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Roket Hareketi ve Enerji', 'Rocket Motion and Energy')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Roket hareketi, momentum korunumunun ve enerji dönüşümünün önemli bir uygulamasıdır. Kimyasal enerji kinetik enerjiye dönüşür.',
                'Rocket motion is an important application of momentum conservation and energy conversion. Chemical energy converts to kinetic energy.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Tsiolkovsky Roket Denklemi:', 'Tsiolkovsky Rocket Equation:')}
            </Text>
            <FormulaText 
              formula="Δv = v_e × ln(m₀/m_f)"
              description={t('v_e: Egzoz hızı, m₀: Başlangıç kütlesi, m_f: Son kütle', 'v_e: Exhaust velocity, m₀: Initial mass, m_f: Final mass')}
            />

            <Text style={styles.subTitle}>
              {t('Enerji Verimliliği:', 'Energy Efficiency:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Roketin kinetik enerjisi, harcanan yakıt enerjisinden çok daha azdır. Çoğu enerji egzozda kaybolur.',
                'Rocket\'s kinetic energy is much less than the fuel energy spent. Most energy is lost in exhaust.'
              )}
            </Text>

            <FormulaText 
              formula="η = (m_roket × v²)/(2 × E_yakıt)"
              description={t('Roket enerji verimliliği', 'Rocket energy efficiency')}
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
                  {t('Hız Treni', 'High-Speed Train')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Frenleme sırasında kinetik enerji ısıya dönüşür',
                    'Kinetic energy converts to heat during braking'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Hidroelektrik Santral', 'Hydroelectric Plant')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Su potansiyel enerjisi elektrik enerjisine dönüşür',
                    'Water potential energy converts to electrical energy'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Bungee Jumping', 'Bungee Jumping')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Potansiyel → Kinetik → Elastik enerji dönüşümü',
                    'Potential → Kinetic → Elastic energy conversion'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Salıncak', 'Swing')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Sürekli potansiyel-kinetik enerji dönüşümü',
                    'Continuous potential-kinetic energy conversion'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Bisiklet Freni', 'Bicycle Brake')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Sürtünme ile kinetik enerji ısıya dönüşür',
                    'Kinetic energy converts to heat through friction'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Yay Tabancası', 'Spring Gun')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Elastik potansiyel enerji kinetik enerjiye dönüşür',
                    'Elastic potential energy converts to kinetic energy'
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
                  {t('Hibrit Arabalar', 'Hybrid Cars')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Frenleme enerjisini geri kazanım',
                    'Regenerative braking energy recovery'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Pompaj Depolama', 'Pumped Storage')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Elektrik enerjisini potansiyel enerji olarak depolama',
                    'Storing electrical energy as potential energy'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Flywheel Enerji', 'Flywheel Energy')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Dönme kinetik enerjisi ile enerji depolama',
                    'Energy storage using rotational kinetic energy'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Uzay Fırlatma', 'Space Launch')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Kimyasal enerji → Kinetik enerji dönüşümü',
                    'Chemical energy → Kinetic energy conversion'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Süperiletken Manyetik', 'Superconducting Magnetic')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'SMES sistemlerde manyetik enerji depolama',
                    'Magnetic energy storage in SMES systems'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Piezoelektrik', 'Piezoelectric')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Mekanik enerjiyi elektrik enerjisine dönüştürme',
                    'Converting mechanical energy to electrical energy'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Problem Çözüm Yaklaşımları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Problem Çözüm Yaklaşımları', 'Problem Solving Approaches')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Enerji Korunumu Problemleri:', 'Energy Conservation Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Sistemi tanımlayın (hangi cisimler, hangi kuvvetler)',
                '1. Define the system (which objects, which forces)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Referans seviyesini belirleyin (h = 0 noktası)',
                '2. Determine reference level (h = 0 point)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Başlangıç ve son durumları yazın',
                '3. Write initial and final states'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Enerji türlerini hesaplayın (E_k, E_p)',
                '4. Calculate energy types (E_k, E_p)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '5. Enerji korunumu eşitliğini uygulayın',
                '5. Apply energy conservation equation'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '6. Non-konservatif kuvvetleri dikkate alın',
                '6. Consider non-conservative forces'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Atwood Makinesi Problemleri:', 'Atwood Machine Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Sistem şemasını çizin',
                '1. Draw system diagram'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Hangi kütlenin daha ağır olduğunu belirleyin',
                '2. Determine which mass is heavier'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Enerji korunumunu veya Newton yasalarını uygulayın',
                '3. Apply energy conservation or Newton\'s laws'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. İp gerilimi ve ivmeyi hesaplayın',
                '4. Calculate string tension and acceleration'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Çarpışma Problemleri:', 'Collision Problems:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Çarpışma türünü belirleyin (elastik/inelastik)',
                '1. Determine collision type (elastic/inelastic)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Momentum korunumunu her zaman uygulayın',
                '2. Always apply momentum conservation'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Elastik çarpışmalarda enerji korunumunu da uygulayın',
                '3. For elastic collisions, also apply energy conservation'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. İnelastik çarpışmalarda enerji kaybını hesaplayın',
                '4. For inelastic collisions, calculate energy loss'
              )}
            </Text>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Enerji korunumu, fiziğin en temel ve güçlü yasalarından biridir. Bu yasa, mekanikten termodinamiğe, elektromagnetizmadan kuantum mekaniğine kadar fiziğin her alanında geçerlidir.',
                'Energy conservation is one of the most fundamental and powerful laws of physics. This law applies to every field of physics, from mechanics to thermodynamics, from electromagnetism to quantum mechanics.'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Modern teknolojide enerji verimliliği ve sürdürülebilir enerji çözümleri, enerji korunumu prensiplerinin pratik uygulamalarıdır. Atwood makinesi gibi basit sistemler, karmaşık mühendislik problemlerinin temelini oluşturur.',
                'In modern technology, energy efficiency and sustainable energy solutions are practical applications of energy conservation principles. Simple systems like the Atwood machine form the basis of complex engineering problems.'
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