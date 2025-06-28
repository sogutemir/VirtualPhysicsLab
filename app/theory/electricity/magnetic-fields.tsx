import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function MagneticFieldsTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Manyetik Alanlar', 'Magnetic Fields')}
      titleEn="Magnetic Fields"
      difficulty={t('İleri Seviye', 'Advanced Level')}
      difficultyEn="Advanced Level"
      description={t(
        'Manyetik kuvvet, elektromanyetik indüksiyon, Faraday yasası ve Maxwell denklemleri',
        'Magnetic force, electromagnetic induction, Faraday\'s law and Maxwell equations'
      )}
      descriptionEn="Magnetic force, electromagnetic induction, Faraday's law and Maxwell equations"
      hideControls={true}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          {/* Giriş */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Manyetik Alan Nedir?', 'What is Magnetic Field?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Manyetik alan, manyetik dipollerin ve hareketli yüklerin çevresinde oluşturdukları kuvvet alanıdır. Elektrik alanla birlikte elektromanyetik alanın bir bileşenidir.',
                'Magnetic field is the force field created around magnetic dipoles and moving charges. Together with electric field, it is a component of electromagnetic field.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Manyetik alan, uzayın her noktasında büyüklüğü ve yönü olan vektörel bir büyüklüktür.',
                  'Magnetic field is a vector quantity having magnitude and direction at every point in space.'
                )}
              </Text>
            </View>

            <FormulaText 
              formula="B = μ₀H"
              description={t('B: Manyetik akı yoğunluğu (T), H: Manyetik alan şiddeti (A/m)', 'B: Magnetic flux density (T), H: Magnetic field intensity (A/m)')}
            />
          </View>

          {/* Manyetik Kuvvet */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Manyetik Kuvvet', 'Magnetic Force')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Hareketli Yüke Etki Eden Kuvvet (Lorentz Kuvveti):', 'Force on Moving Charge (Lorentz Force):')}
            </Text>
            <FormulaText 
              formula="F = q(v × B) = qvB sin θ"
              description={t('q: yük, v: hız, B: manyetik alan, θ: v ile B arası açı', 'q: charge, v: velocity, B: magnetic field, θ: angle between v and B')}
            />

            <Text style={styles.subTitle}>
              {t('Akım Taşıyan İletken Üzerine Kuvvet:', 'Force on Current-Carrying Conductor:')}
            </Text>
            <FormulaText 
              formula="F = I(L × B) = ILB sin θ"
              description={t('I: akım, L: iletken uzunluğu', 'I: current, L: conductor length')}
            />

            <Text style={styles.subTitle}>
              {t('Dairesel Hareket:', 'Circular Motion:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Manyetik alana dik giren yüklü parçacık dairesel yörüngede hareket eder.',
                'Charged particle entering perpendicular to magnetic field moves in circular orbit.'
              )}
            </Text>
            <FormulaText 
              formula="r = mv/(qB)"
              description={t('Çevrim yarıçapı', 'Cyclotron radius')}
            />

            <FormulaText 
              formula="f = qB/(2πm)"
              description={t('Çevrim frekansı', 'Cyclotron frequency')}
            />
          </View>

          {/* Manyetik Alan Kaynakları */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Manyetik Alan Kaynakları', 'Sources of Magnetic Field')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Düz İletken (Biot-Savart Yasası):', 'Straight Conductor (Biot-Savart Law):')}
            </Text>
            <FormulaText 
              formula="B = (μ₀I)/(2πr)"
              description={t('Sonsuz düz iletken etrafında', 'Around infinite straight conductor')}
            />

            <Text style={styles.subTitle}>
              {t('Dairesel Akım Halkası:', 'Circular Current Loop:')}
            </Text>
            <Text style={styles.paragraph}>
              {t('Halka merkezinde:', 'At center of loop:')}
            </Text>
            <FormulaText 
              formula="B = μ₀I/(2R)"
              description={t('R: halka yarıçapı', 'R: loop radius')}
            />

            <Text style={styles.subTitle}>
              {t('Solenoid (Bobbin):', 'Solenoid:')}
            </Text>
            <FormulaText 
              formula="B = μ₀nI"
              description={t('n: birim uzunluktaki sarım sayısı', 'n: number of turns per unit length')}
            />

            <Text style={styles.subTitle}>
              {t('Toroidal Bobbin:', 'Toroidal Coil:')}
            </Text>
            <FormulaText 
              formula="B = μ₀NI/(2πr)"
              description={t('N: toplam sarım sayısı, r: merkezden uzaklık', 'N: total turns, r: distance from center')}
            />
          </View>

          {/* Elektromanyetik İndüksiyon */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Elektromanyetik İndüksiyon', 'Electromagnetic Induction')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Michael Faraday (1831) tarafından keşfedilen bu fenomen, değişen manyetik alanın elektrik alanı oluşturduğunu gösterir.',
                'Discovered by Michael Faraday (1831), this phenomenon shows that changing magnetic field creates electric field.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Faraday İndüksiyon Yasası:', 'Faraday\'s Law of Induction:')}
            </Text>
            <FormulaText 
              formula="ε = -dΦ/dt"
              description={t('ε: indüklenen emk, Φ: manyetik akı', 'ε: induced emf, Φ: magnetic flux')}
            />

            <Text style={styles.subTitle}>
              {t('Manyetik Akı:', 'Magnetic Flux:')}
            </Text>
            <FormulaText 
              formula="Φ = ∫B·dA = BA cos θ"
              description={t('Düzgün alan için', 'For uniform field')}
            />

            <Text style={styles.subTitle}>
              {t('Lenz Yasası:', 'Lenz\'s Law:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İndüklenen akım, kendisini oluşturan değişime karşı koyacak yönde akar.',
                'Induced current flows in direction to oppose the change that created it.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Öz İndüktans:', 'Self-Inductance:')}
            </Text>
            <FormulaText 
              formula="L = Φ/I = μ₀n²V"
              description={t('L: indüktans (H), V: hacim', 'L: inductance (H), V: volume')}
            />

            <Text style={styles.subTitle}>
              {t('Karşılıklı İndüktans:', 'Mutual Inductance:')}
            </Text>
            <FormulaText 
              formula="M₁₂ = Φ₁₂/I₂ = Φ₂₁/I₁"
              description={t('İki bobin arası karşılıklı indüktans', 'Mutual inductance between two coils')}
            />
          </View>

          {/* Maxwell Denklemleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Maxwell Denklemleri', 'Maxwell Equations')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'James Clerk Maxwell tarafından formüle edilen bu denklemler, elektromanyetizmanın temel yasalarını özetler.',
                'Formulated by James Clerk Maxwell, these equations summarize the fundamental laws of electromagnetism.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Gauss Yasası (Elektrik):', 'Gauss\'s Law (Electric):')}
            </Text>
            <FormulaText 
              formula="∇·E = ρ/ε₀"
              description={t('Elektrik alanın kaynağı elektrik yüktür', 'Electric charge is source of electric field')}
            />

            <Text style={styles.subTitle}>
              {t('Gauss Yasası (Manyetik):', 'Gauss\'s Law (Magnetic):')}
            </Text>
            <FormulaText 
              formula="∇·B = 0"
              description={t('Manyetik monopol yoktur', 'No magnetic monopoles exist')}
            />

            <Text style={styles.subTitle}>
              {t('Faraday Yasası:', 'Faraday\'s Law:')}
            </Text>
            <FormulaText 
              formula="∇×E = -∂B/∂t"
              description={t('Değişen manyetik alan elektrik alanı oluşturur', 'Changing magnetic field creates electric field')}
            />

            <Text style={styles.subTitle}>
              {t('Ampere-Maxwell Yasası:', 'Ampere-Maxwell Law:')}
            </Text>
            <FormulaText 
              formula="∇×B = μ₀J + μ₀ε₀∂E/∂t"
              description={t('Akım ve değişen elektrik alan manyetik alan oluşturur', 'Current and changing electric field create magnetic field')}
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
                  {t('Elektrik Motorları', 'Electric Motors')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Manyetik kuvvet ile dönme hareketi', 'Rotational motion through magnetic force')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Transformatörler', 'Transformers')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Elektromanyetik indüksiyon ile gerilim değişimi', 'Voltage transformation via electromagnetic induction')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Hoparlör ve Mikrofon', 'Speaker and Microphone')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Ses-elektrik enerjisi dönüşümü', 'Sound-electrical energy conversion')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('MRI Görüntüleme', 'MRI Imaging')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Güçlü manyetik alanlar ile tıbbi görüntüleme', 'Medical imaging with strong magnetic fields')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Manyetik Kartlar', 'Magnetic Cards')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Veri depolama ve okuma teknolojisi', 'Data storage and reading technology')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Elektromanyetik Frenler', 'Electromagnetic Brakes')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Eddy akımları ile frenleme sistemi', 'Braking system with eddy currents')}
                </Text>
              </View>
            </View>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Manyetik alanlar, modern teknolojinin temelini oluşturur. Elektrik üretiminden tıbbi görüntülemeye, ulaşımdan iletişime kadar geniş bir alanda kritik rol oynar.',
                'Magnetic fields form the foundation of modern technology. They play critical roles in a wide range from electricity generation to medical imaging, from transportation to communication.'
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