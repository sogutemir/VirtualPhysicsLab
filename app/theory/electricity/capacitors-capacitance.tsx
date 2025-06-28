import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function CapacitorsCapacitanceTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Kapasitör ve Kapasitans', 'Capacitors and Capacitance')}
      titleEn="Capacitors and Capacitance"
      difficulty={t('Orta Seviye', 'Intermediate Level')}
      difficultyEn="Intermediate Level"
      description={t(
        'Elektrik yük depolama, kapasitans kavramı, dielektrik maddeler ve enerji analizi',
        'Electric charge storage, capacitance concept, dielectric materials and energy analysis'
      )}
      descriptionEn="Electric charge storage, capacitance concept, dielectric materials and energy analysis"
      hideControls={true}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          {/* Giriş */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kapasitör ve Kapasitans Nedir?', 'What are Capacitors and Capacitance?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Kapasitör, elektrik yükünü depolayan elektronik elemandır. Kapasitans ise bir kapasitörün yük depolama kapasitesinin ölçüsüdür. İlk kapasitör 1745\'te Leyden kavanozı olarak icat edilmiştir.',
                'A capacitor is an electronic component that stores electric charge. Capacitance is a measure of a capacitor\'s charge storage capacity. The first capacitor was invented in 1745 as the Leyden jar.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Kapasitans, birimi Farad (F) olan fiziksel büyüklük olup Michael Faraday\'ın onuruna adlandırılmıştır.',
                  'Capacitance is a physical quantity with unit Farad (F), named in honor of Michael Faraday.'
                )}
              </Text>
            </View>

            <FormulaText 
              formula="C = Q/V"
              description={t('C: Kapasitans (F), Q: Yük (C), V: Gerilim (V)', 'C: Capacitance (F), Q: Charge (C), V: Voltage (V)')}
            />
          </View>

          {/* Paralel Plaka Kapasitör */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Paralel Plaka Kapasitör', 'Parallel Plate Capacitor')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'En basit kapasitör türü, aralarında dielektrik madde bulunan iki paralel metal plakadan oluşur.',
                'The simplest type of capacitor consists of two parallel metal plates with dielectric material between them.'
              )}
            </Text>

            <FormulaText 
              formula="C = ε₀εᵣA/d"
              description={t('ε₀: Boşluk geçirgenliği, εᵣ: Dielektrik sabiti, A: Plaka alanı, d: Plakalar arası mesafe', 'ε₀: Vacuum permittivity, εᵣ: Dielectric constant, A: Plate area, d: Distance between plates')}
            />

            <Text style={styles.subTitle}>
              {t('Kapasitansı Etkileyen Faktörler:', 'Factors Affecting Capacitance:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Plaka alanı artarsa kapasitans artar (C ∝ A)', '• Larger plate area increases capacitance (C ∝ A)')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Plakalar arası mesafe artarsa kapasitans azalır (C ∝ 1/d)', '• Larger distance decreases capacitance (C ∝ 1/d)')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Dielektrik sabiti artarsa kapasitans artar (C ∝ εᵣ)', '• Higher dielectric constant increases capacitance (C ∝ εᵣ)')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Elektrik Alan:', 'Electric Field:')}
            </Text>
            <FormulaText 
              formula="E = V/d = σ/ε₀εᵣ"
              description={t('σ: Yüzey yük yoğunluğu', 'σ: Surface charge density')}
            />
          </View>

          {/* Dielektrik Maddeler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Dielektrik Maddeler', 'Dielectric Materials')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dielektrik maddeler, elektrik alanında polarize olan yalıtkan maddelerdir. Kapasitansı artırır ve elektriksel mukavemeti sağlar.',
                'Dielectric materials are insulating materials that become polarized in an electric field. They increase capacitance and provide electrical strength.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yaygın Dielektrik Maddeler:', 'Common Dielectric Materials:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Hava: εᵣ ≈ 1.00', '• Air: εᵣ ≈ 1.00')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Cam: εᵣ ≈ 5-10', '• Glass: εᵣ ≈ 5-10')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Seramik: εᵣ ≈ 10-10000', '• Ceramic: εᵣ ≈ 10-10000')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Su: εᵣ ≈ 81', '• Water: εᵣ ≈ 81')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Dielektrik Mukavemeti:', 'Dielectric Strength:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dielektrik maddenin elektriksel olarak bozulmadan dayanabileceği maksimum elektrik alan şiddetidir.',
                'Maximum electric field strength that dielectric material can withstand without electrical breakdown.'
              )}
            </Text>
            <FormulaText 
              formula="E_max = V_breakdown/d"
              description={t('Hava için: ~3 MV/m', 'For air: ~3 MV/m')}
            />
          </View>

          {/* Kapasitör Türleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kapasitör Türleri', 'Types of Capacitors')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Seramik Kapasitörler:', 'Ceramic Capacitors:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Küçük değerler (pF - μF)', '• Small values (pF - μF)')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yüksek frekans uygulamaları', '• High frequency applications')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Düşük maliyet, kompakt boyut', '• Low cost, compact size')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Elektrolitik Kapasitörler:', 'Electrolytic Capacitors:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Büyük değerler (μF - mF)', '• Large values (μF - mF)')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Polarize (kutuplu)', '• Polarized')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Güç kaynağı filtreleme', '• Power supply filtering')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Film Kapasitörler:', 'Film Capacitors:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Orta değerler (nF - μF)', '• Medium values (nF - μF)')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Düşük kayıp, kararlı', '• Low loss, stable')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Ses ve RF uygulamaları', '• Audio and RF applications')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Süper Kapasitörler:', 'Supercapacitors:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Çok büyük değerler (F - kF)', '• Very large values (F - kF)')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Hızlı şarj/deşarj', '• Fast charge/discharge')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Enerji depolama sistemleri', '• Energy storage systems')}
            </Text>
          </View>

          {/* Kapasitörlerde Enerji */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kapasitörlerde Enerji', 'Energy in Capacitors')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Kapasitör, elektrik alanında enerji depolar. Bu enerji, gerilim ve kapasitans ile belirlenir.',
                'Capacitor stores energy in electric field. This energy is determined by voltage and capacitance.'
              )}
            </Text>

            <FormulaText 
              formula="U = ½CV^2 = ½QV = Q^2/(2C)"
              description={t('Kapasitörde depolanan enerji', 'Energy stored in capacitor')}
            />

            <Text style={styles.subTitle}>
              {t('Enerji Yoğunluğu:', 'Energy Density:')}
            </Text>
            <FormulaText 
              formula="u = ½ε₀εᵣE²"
              description={t('Elektrik alanında enerji yoğunluğu (J/m³)', 'Energy density in electric field (J/m³)')}
            />

            <Text style={styles.subTitle}>
              {t('Güç ve Enerji Hesaplamaları:', 'Power and Energy Calculations:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Kapasitörün şarj/deşarj sırasında aldığı/verdiği güç:',
                'Power absorbed/delivered by capacitor during charge/discharge:'
              )}
            </Text>
            <FormulaText 
              formula="P = VI = VC(dV/dt)"
              description={t('Anlık güç', 'Instantaneous power')}
            />
          </View>

          {/* Kapasitör Bağlantıları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kapasitör Bağlantıları', 'Capacitor Connections')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Paralel Bağlantı:', 'Parallel Connection:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Paralel bağlı kapasitörlerde gerilim aynı, yükler toplanır.',
                'In parallel connected capacitors, voltage is same, charges add up.'
              )}
            </Text>
            <FormulaText 
              formula="C_toplam = C₁ + C₂ + C₃ + ..."
              description={t('Paralel kapasitans toplamı', 'Total parallel capacitance')}
            />

            <Text style={styles.subTitle}>
              {t('Seri Bağlantı:', 'Series Connection:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Seri bağlı kapasitörlerde yük aynı, gerilimler toplanır.',
                'In series connected capacitors, charge is same, voltages add up.'
              )}
            </Text>
            <FormulaText 
              formula="1/C_toplam = 1/C₁ + 1/C₂ + 1/C₃ + ..."
              description={t('Seri kapasitans toplamı', 'Total series capacitance')}
            />

            <Text style={styles.subTitle}>
              {t('Gerilim Bölme:', 'Voltage Division:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Seri bağlı kapasitörlerde gerilim, ters kapasitans oranında bölünür.',
                'In series capacitors, voltage divides in inverse ratio of capacitance.'
              )}
            </Text>
            <FormulaText 
              formula="V₁/V₂ = C₂/C₁"
              description={t('Seri kapasitörlerde gerilim oranı', 'Voltage ratio in series capacitors')}
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
                  {t('Kamera Flaşı', 'Camera Flash')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Hızlı enerji deşarjı ile güçlü ışık', 'Powerful light through fast energy discharge')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Güç Kaynağı Filtreleme', 'Power Supply Filtering')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('AC bileşenleri süzme ve düzgünleştirme', 'Filtering AC components and smoothing')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Klavye ve Dokunmatik Ekran', 'Keyboard and Touchscreen')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Kapasitif algılama teknolojisi', 'Capacitive sensing technology')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Ses Sistemleri', 'Audio Systems')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Crossover filtreleri ve coupling', 'Crossover filters and coupling')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Motor Starter', 'Motor Starter')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('AC motorların başlatılması', 'Starting AC motors')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Bilgisayar Belleği', 'Computer Memory')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('DRAM kapasitif bellek hücreleri', 'DRAM capacitive memory cells')}
                </Text>
              </View>
            </View>
          </View>

          {/* Modern Teknoloji */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Modern Teknoloji Uygulamaları', 'Modern Technology Applications')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Elektrikli Araçlar', 'Electric Vehicles')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Süper kapasitörler ile hızlı şarj', 'Fast charging with supercapacitors')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Yenilenebilir Enerji', 'Renewable Energy')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Enerji depolama ve dengeleme', 'Energy storage and balancing')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('MEMS Sensörler', 'MEMS Sensors')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Mikro kapasitif değişim algılama', 'Micro capacitive change sensing')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('RF ve Mikrodalga', 'RF and Microwave')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Değişken kapasitörler ve tuning', 'Variable capacitors and tuning')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Güç Elektroniği', 'Power Electronics')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Inverter ve UPS uygulamaları', 'Inverter and UPS applications')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('IoT Cihazları', 'IoT Devices')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Enerji tasarruflu kapasitif güç', 'Energy-efficient capacitive power')}
                </Text>
              </View>
            </View>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Kapasitörler, modern elektronik teknolojinin vazgeçilmez elemanlarıdır. Enerji depolama, filtreleme, zamanlama ve algılama uygulamalarında kritik rol oynar.',
                'Capacitors are indispensable components of modern electronic technology. They play critical roles in energy storage, filtering, timing and sensing applications.'
              )}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  subTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginTop: 12, marginBottom: 8 },
  paragraph: { fontSize: 14, lineHeight: 22, color: '#4b5563', marginBottom: 12 },
  listItem: { fontSize: 14, lineHeight: 22, color: '#4b5563', marginBottom: 6, paddingLeft: 8 },
  definitionBox: {
    backgroundColor: '#f0f9ff', borderLeftWidth: 4, borderLeftColor: '#0ea5e9',
    padding: 16, marginVertical: 12, borderRadius: 8,
  },
  definitionText: { fontSize: 16, fontStyle: 'italic', color: '#0c4a6e', fontWeight: '500' },
  formulaBox: {
    backgroundColor: '#f8fafc', padding: 16, borderRadius: 8, marginVertical: 12,
    alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0',
  },
  formula: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 8, fontFamily: 'monospace' },
  formulaDesc: { fontSize: 12, color: '#64748b', textAlign: 'center' },
  applicationGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 },
  applicationCard: { width: '48%', backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 12 },
  applicationTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  applicationText: { fontSize: 12, color: '#64748b', lineHeight: 16 },
}); 