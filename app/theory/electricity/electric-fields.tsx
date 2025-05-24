import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';

export default function ElectricFieldsTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Elektrik Alanlar', 'Electric Fields')}
      titleEn="Electric Fields"
      difficulty={t('İleri Seviye', 'Advanced Level')}
      difficultyEn="Advanced Level"
      description={t(
        'Elektrik alan kavramı, özellikleri ve Gauss Yasası üzerine detaylı bir inceleme',
        "A detailed study on the concept of electric field, its properties, and Gauss's Law"
      )}
      descriptionEn="A detailed study on the concept of electric field, its properties, and Gauss's Law"
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
              {t('Elektrik Alan Nedir?', 'What is an Electric Field?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Elektrik alan, yüklü bir cismin etrafındaki uzayda oluşturduğu etkileşim alanıdır. Bu alan, diğer yüklü cisimlerin bu uzaydaki herhangi bir noktada hissedeceği kuvveti tanımlar. Elektrik alan, modern elektromanyetik teorinin temel kavramlarından biridir.',
                'An electric field is the interaction field created by a charged object in the surrounding space. This field defines the force that other charged objects would experience at any point in this space. Electric field is one of the fundamental concepts of modern electromagnetic theory.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>E = F/q</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'E: Elektrik alan şiddeti (N/C), F: Kuvvet (N), q: Test yükü (C)',
                  'E: Electric field strength (N/C), F: Force (N), q: Test charge (C)'
                )}
              </Text>
            </View>
          </View>

          {/* Coulomb Yasası */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t(
                'Coulomb Yasası ve Elektrik Alan',
                "Coulomb's Law and Electric Field"
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Charles-Augustin de Coulomb tarafından 1785 yılında formüle edilen yasa, iki nokta yük arasındaki elektrostatik kuvveti tanımlar. Bu yasadan elektrik alan kavramı türetilir.',
                'The law formulated by Charles-Augustin de Coulomb in 1785 defines the electrostatic force between two point charges. The concept of electric field is derived from this law.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>F = k × (q₁ × q₂)/r²</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'k: Coulomb sabiti (8.99×10⁹ N⋅m²/C²), r: Yükler arası mesafe',
                  'k: Coulomb constant (8.99×10⁹ N⋅m²/C²), r: Distance between charges'
                )}
              </Text>
            </View>
            <Text style={styles.paragraph}>
              {t(
                'Nokta yükün oluşturduğu elektrik alan her yönde eşit şiddette yayılır ve mesafenin karesi ile ters orantılı olarak azalır.',
                'The electric field created by a point charge spreads equally in all directions and decreases inversely proportional to the square of distance.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>E = k × q/r²</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'Nokta yükün elektrik alanı',
                  'Electric field of a point charge'
                )}
              </Text>
            </View>
          </View>

          {/* Elektrik Alan Çizgileri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Elektrik Alan Çizgileri', 'Electric Field Lines')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Elektrik alan çizgileri, elektrik alanı görsel olarak temsil etmenin bir yoludur. Bu çizgiler elektrik alanın yönünü ve şiddetini gösterir.',
                'Electric field lines are a way to visually represent the electric field. These lines show the direction and strength of the electric field.'
              )}
            </Text>
            <Text style={styles.subTitle}>
              {t(
                'Alan Çizgilerinin Özellikleri:',
                'Properties of Field Lines:'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Pozitif yüklerden başlayıp negatif yüklerde biter',
                '• Start from positive charges and end at negative charges'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Birbirini kesmez', '• Never intersect each other')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Çizgi yoğunluğu alan şiddetini gösterir',
                '• Line density indicates field strength'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Herhangi bir noktadaki teğet yönü, o noktadaki alan yönünü verir',
                '• Tangent direction at any point gives field direction at that point'
              )}
            </Text>
          </View>

          {/* Süperposisyon İlkesi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Süperposisyon İlkesi', 'Superposition Principle')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Birden fazla yükün bulunduğu durumda, herhangi bir noktadaki toplam elektrik alan, her yükün o noktada oluşturduğu elektrik alanlarının vektörel toplamına eşittir.',
                'In the presence of multiple charges, the total electric field at any point equals the vector sum of electric fields created by each charge at that point.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>
                E⃗ₜₒₚₗₐₘ = E⃗₁ + E⃗₂ + E⃗₃ + ...
              </Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'Elektrik alanların vektörel toplamı',
                  'Vector sum of electric fields'
                )}
              </Text>
            </View>
            <Text style={styles.paragraph}>
              {t(
                'Bu ilke, karmaşık yük dağılımlarının elektrik alanlarını hesaplamamızı sağlar. Örneğin, elektrik dipol, dört kutup gibi konfigürasyonlar bu şekilde analiz edilir.',
                'This principle allows us to calculate electric fields of complex charge distributions. For example, configurations like electric dipoles and quadrupoles are analyzed this way.'
              )}
            </Text>
          </View>

          {/* Gauss Yasası */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Gauss Yasası', "Gauss's Law")}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Carl Friedrich Gauss tarafından formüle edilen bu yasa, elektrik alanın en temel yasalarından biridir. Kapalı bir yüzeyden geçen elektrik alan akısının, o yüzey içindeki toplam yüke orantılı olduğunu belirtir.',
                'This law formulated by Carl Friedrich Gauss is one of the most fundamental laws of electric field. It states that the electric flux through a closed surface is proportional to the total charge within that surface.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>∮ E⃗ · dA⃗ = Q_içerideki/ε₀</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'ε₀: Elektrik geçirgenlik sabiti (8.85×10⁻¹² F/m)',
                  'ε₀: Electric permittivity constant (8.85×10⁻¹² F/m)'
                )}
              </Text>
            </View>
            <Text style={styles.subTitle}>
              {t(
                'Gauss Yasasının Uygulamaları:',
                "Applications of Gauss's Law:"
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Küresel simetrik yük dağılımları',
                '• Spherically symmetric charge distributions'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Silindirik simetrik sistemler',
                '• Cylindrically symmetric systems'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Düzlemsel yük dağılımları',
                '• Planar charge distributions'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• İletken yüzeyler', '• Conductor surfaces')}
            </Text>
          </View>

          {/* İletkenler ve Dielektrikler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('İletkenler ve Dielektrikler', 'Conductors and Dielectrics')}
            </Text>

            <Text style={styles.subTitle}>{t('İletkenler', 'Conductors')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'İletken maddelerde serbest elektronlar vardır. Elektrostatik dengede, iletkenin içindeki elektrik alan sıfırdır ve tüm yük iletkenin yüzeyinde toplanır.',
                "Conductor materials have free electrons. In electrostatic equilibrium, the electric field inside the conductor is zero and all charge accumulates on the conductor's surface."
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• İçte elektrik alan: E = 0',
                '• Electric field inside: E = 0'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Yük sadece yüzeyde bulunur',
                '• Charge exists only on the surface'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yüzey eşpotansiyeldir', '• Surface is equipotential')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Dielektrikler', 'Dielectrics')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dielektrik maddeler elektrik alanının etkisi altında polarize olur. Bu polarizasyon dış elektrik alanı zayıflatır.',
                'Dielectric materials become polarized under the influence of an electric field. This polarization weakens the external electric field.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>E = E₀/εᵣ</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'εᵣ: Bağıl dielektrik sabiti (εᵣ > 1)',
                  'εᵣ: Relative dielectric constant (εᵣ > 1)'
                )}
              </Text>
            </View>
          </View>

          {/* Teknolojik Uygulamalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Teknolojik Uygulamalar', 'Technological Applications')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Kapasitörler', 'Capacitors')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Enerji depolama, elektronik devrelerde filtreleme',
                    'Energy storage, filtering in electronic circuits'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Van de Graaff Jeneratörü', 'Van de Graaff Generator')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Yüksek voltaj üretimi, parçacık hızlandırıcıları',
                    'High voltage generation, particle accelerators'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Elektrostatik Boyama', 'Electrostatic Painting')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Otomotiv endüstrisi, homojen kaplama',
                    'Automotive industry, uniform coating'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Fotokopi Makineleri', 'Photocopying Machines')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Xerografi teknolojisi, ofis ekipmanları',
                    'Xerography technology, office equipment'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('CRT Monitörler', 'CRT Monitors')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Elektron ışını yönlendirme, eski TV teknolojisi',
                    'Electron beam steering, old TV technology'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t(
                    'Elektrostatik Çöktürücüler',
                    'Electrostatic Precipitators'
                  )}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Hava kirliliği kontrolü, endüstriyel filtreleme',
                    'Air pollution control, industrial filtering'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Elektrik Potansiyeli */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Elektrik Potansiyeli', 'Electric Potential')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Elektrik potansiyeli, birim pozitif yükün sonsuzdan o noktaya getirilmesi için yapılan iştir. Elektrik alan ile potansiyel arasında önemli bir ilişki vardır.',
                'Electric potential is the work done to bring a unit positive charge from infinity to that point. There is an important relationship between electric field and potential.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>V = W/q = kQ/r</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'V: Elektrik potansiyeli (Volt), W: Yapılan iş (Joule)',
                  'V: Electric potential (Volt), W: Work done (Joule)'
                )}
              </Text>
            </View>
            <Text style={styles.paragraph}>
              {t(
                'Elektrik alan, potansiyelin negatif gradyanıdır. Bu, elektrik alanın potansiyelin en hızlı azaldığı yönde olduğunu gösterir.',
                'Electric field is the negative gradient of potential. This shows that electric field is in the direction of fastest decrease of potential.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>E⃗ = -∇V</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'Elektrik alan ve potansiyel ilişkisi',
                  'Electric field and potential relationship'
                )}
              </Text>
            </View>
          </View>

          {/* Enerji Depolama */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Elektrik Alanda Enerji', 'Energy in Electric Field')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Elektrik alan enerji taşır ve bu enerji uzayda dağılım gösterir. Elektrik alan enerjisinin yoğunluğu, alanın şiddetinin karesi ile orantılıdır.',
                'Electric field carries energy and this energy is distributed in space. The energy density of electric field is proportional to the square of field strength.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>u = ½ε₀E²</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'u: Enerji yoğunluğu (J/m³), E: Elektrik alan şiddeti',
                  'u: Energy density (J/m³), E: Electric field strength'
                )}
              </Text>
            </View>
            <Text style={styles.paragraph}>
              {t(
                'Bu kavram, kapasitörlerin enerji depolama mekanizmasını anlamada kritiktir. Kapasitörler elektrik alanında enerji depolar.',
                'This concept is critical in understanding the energy storage mechanism of capacitors. Capacitors store energy in the electric field.'
              )}
            </Text>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Elektrik alan kavramı, elektromanyetik teorinin temel yapı taşıdır. Maxwell denklemlerinin bir parçası olan elektrik alan, modern teknolojinin birçok alanında uygulanır. Elektronikten enerji teknolojilerine, tıbbi cihazlardan endüstriyel uygulamalara kadar geniş bir spektrumda karşımıza çıkar.',
                "The concept of electric field is a fundamental building block of electromagnetic theory. Electric field, being part of Maxwell's equations, is applied in many areas of modern technology. It appears in a wide spectrum from electronics to energy technologies, from medical devices to industrial applications."
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
