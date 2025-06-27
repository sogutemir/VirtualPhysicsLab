import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function KirchhoffLawsTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Kirchhoff Yasaları', 'Kirchhoff Laws')}
      titleEn="Kirchhoff Laws"
      difficulty={t('Orta Seviye', 'Intermediate Level')}
      difficultyEn="Intermediate Level"
      description={t(
        'Gustav Kirchhoff yasaları, devre analizi ve karmaşık elektrik devrelerinin çözümü',
        'Gustav Kirchhoff laws, circuit analysis and solving complex electrical circuits'
      )}
      descriptionEn="Gustav Kirchhoff laws, circuit analysis and solving complex electrical circuits"
      hideControls={true}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          {/* Giriş */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kirchhoff Yasaları Nedir?', 'What are Kirchhoff Laws?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Gustav Robert Kirchhoff (1824-1887) tarafından geliştirilen bu yasalar, elektrik devrelerinin temel analiz araçlarıdır. Yük ve enerji korunumu prensiplerinden türetilmiştir.',
                'Developed by Gustav Robert Kirchhoff (1824-1887), these laws are fundamental analysis tools for electrical circuits. They are derived from charge and energy conservation principles.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Bu yasalar, Ohm yasasının tek başına çözemediği karmaşık devrelerin analizini mümkün kılar.',
                  'These laws enable the analysis of complex circuits that Ohm\'s law alone cannot solve.'
                )}
              </Text>
            </View>
          </View>

          {/* Kirchhoff Akım Yasası */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kirchhoff Akım Yasası (KAY)', 'Kirchhoff Current Law (KCL)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Bir düğüm noktasına giren akımların toplamı, o düğümden çıkan akımların toplamına eşittir. Bu yasa elektrik yükünün korunumundan kaynaklanır.',
                'The sum of currents entering a node equals the sum of currents leaving that node. This law results from conservation of electric charge.'
              )}
            </Text>

            <FormulaText 
              formula="Σ I_giren = Σ I_çıkan"
              description={t('Düğüm noktasında akım korunumu', 'Current conservation at node')}
            />

            <FormulaText 
              formula="Σ I = 0"
              description={t('Giren akımlar (+), çıkan akımlar (-) kabul edilirse', 'If incoming currents (+), outgoing currents (-)')}
            />

            <Text style={styles.subTitle}>
              {t('KAY Uygulama Adımları:', 'KCL Application Steps:')}
            </Text>
            <Text style={styles.listItem}>
              {t('1. Devredeki tüm düğüm noktalarını belirleyin', '1. Identify all node points in circuit')}
            </Text>
            <Text style={styles.listItem}>
              {t('2. Akım yönlerini işaretleyin (rastgele seçilebilir)', '2. Mark current directions (can be chosen arbitrarily)')}
            </Text>
            <Text style={styles.listItem}>
              {t('3. Her düğüm için akım eşitliği yazın', '3. Write current equation for each node')}
            </Text>
            <Text style={styles.listItem}>
              {t('4. Denklem sistemini çözün', '4. Solve the system of equations')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Örnekler:', 'Examples:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Üç dallı bir düğümde: I₁ + I₂ = I₃',
                'At a three-branch node: I₁ + I₂ = I₃'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Dört dallı bir düğümde: I₁ + I₂ = I₃ + I₄',
                'At a four-branch node: I₁ + I₂ = I₃ + I₄'
              )}
            </Text>
          </View>

          {/* Kirchhoff Gerilim Yasası */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kirchhoff Gerilim Yasası (KGY)', 'Kirchhoff Voltage Law (KVL)')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Kapalı bir çevrimde gerilim düşümlerinin cebirsel toplamı sıfırdır. Bu yasa enerji korunumundan kaynaklanır.',
                'The algebraic sum of voltage drops in a closed loop is zero. This law results from energy conservation.'
              )}
            </Text>

            <FormulaText 
              formula="Σ V = 0"
              description={t('Kapalı çevrimde gerilim toplamı', 'Sum of voltages in closed loop')}
            />

            <FormulaText 
              formula="Σ V_kaynak = Σ V_düşüm"
              description={t('Kaynak gerilimleri = Yük gerilim düşümleri', 'Source voltages = Load voltage drops')}
            />

            <Text style={styles.subTitle}>
              {t('KGY Uygulama Adımları:', 'KVL Application Steps:')}
            </Text>
            <Text style={styles.listItem}>
              {t('1. Kapalı çevrimleri (loop) belirleyin', '1. Identify closed loops')}
            </Text>
            <Text style={styles.listItem}>
              {t('2. Çevrim yönünü seçin (saat yönü veya tersi)', '2. Choose loop direction (clockwise or counterclockwise)')}
            </Text>
            <Text style={styles.listItem}>
              {t('3. Gerilim düşümlerini yön kuralına göre yazın', '3. Write voltage drops according to direction rule')}
            </Text>
            <Text style={styles.listItem}>
              {t('4. Σ V = 0 eşitliğini oluşturun', '4. Form Σ V = 0 equation')}
            </Text>

            <Text style={styles.subTitle}>
              {t('İşaret Kuralları:', 'Sign Conventions:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Gerilim kaynağı: + kutuptan - kutuba giderken (+)', '• Voltage source: (+) when going from + to - terminal')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Direnç: akım yönünde giderken (-)', '• Resistor: (-) when going in current direction')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Direnç: akım yönünün tersinde giderken (+)', '• Resistor: (+) when going against current direction')}
            </Text>
          </View>

          {/* Devre Analiz Teknikleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Devre Analiz Teknikleri', 'Circuit Analysis Techniques')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Düğüm Analizi (Nodal Analysis):', 'Nodal Analysis:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Düğüm potansiyellerini bilinmeyen olarak kabul ederek KAY uygulanır.',
                'KCL is applied by considering node potentials as unknowns.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Referans düğümü (toprak) seçin', '• Choose reference node (ground)')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Düğüm potansiyellerini tanımlayın', '• Define node potentials')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Her düğüm için KAY yazın', '• Write KCL for each node')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Çevrim Analizi (Mesh Analysis):', 'Mesh Analysis:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çevrim akımlarını bilinmeyen olarak kabul ederek KGY uygulanır.',
                'KVL is applied by considering mesh currents as unknowns.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Bağımsız çevrimleri belirleyin', '• Identify independent meshes')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Çevrim akımlarını tanımlayın', '• Define mesh currents')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Her çevrim için KGY yazın', '• Write KVL for each mesh')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Süperpozisyon Teoremi:', 'Superposition Theorem:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Birden fazla kaynağın bulunduğu doğrusal devrelerde, her kaynağın etkisi ayrı ayrı hesaplanıp toplanır.',
                'In linear circuits with multiple sources, the effect of each source is calculated separately and summed.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Thevenin Teoremi:', 'Thevenin Theorem:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Karmaşık devre, belirli bir çıkış için gerilim kaynağı ve seri direnç ile eşdeğerlenebilir.',
                'Complex circuit can be equivalent to voltage source and series resistance for specific output.'
              )}
            </Text>
            <FormulaText 
              formula="V_th = Açık devre gerilimi, R_th = İç direnç"
              description={t('Thevenin eşdeğer devresi', 'Thevenin equivalent circuit')}
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
                  {t('Ev Elektrik Tesisatı', 'Home Electrical Installation')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Paralel bağlantılar ve güvenlik sistemleri', 'Parallel connections and safety systems')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Otomobil Elektriği', 'Automotive Electrical')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Akü, alternatör ve elektrikli sistemler', 'Battery, alternator and electrical systems')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Elektronik Devreler', 'Electronic Circuits')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Amplifikatörler, filtreler ve power supply', 'Amplifiers, filters and power supply')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Güneş Paneli Sistemleri', 'Solar Panel Systems')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Seri-paralel bağlantılar ve optimizasyon', 'Series-parallel connections and optimization')}
                </Text>
              </View>
            </View>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Kirchhoff yasaları, modern elektrik ve elektronik mühendisliğinin temelini oluşturur. Bu yasalar olmadan karmaşık devrelerin analizi ve tasarımı mümkün olmaz.',
                'Kirchhoff laws form the foundation of modern electrical and electronic engineering. Without these laws, analysis and design of complex circuits would not be possible.'
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