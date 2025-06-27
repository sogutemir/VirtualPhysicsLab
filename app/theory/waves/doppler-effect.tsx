import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function DopplerEffectTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Doppler Etkisi', 'Doppler Effect')}
      titleEn="Doppler Effect"
      difficulty={t('Orta Seviye', 'Intermediate Level')}
      difficultyEn="Intermediate Level"
      description={t(
        'Hareket eden kaynakların frekans değişimi, ses ve ışık dalgalarında Doppler etkisi',
        'Frequency change from moving sources, Doppler effect in sound and light waves'
      )}
      descriptionEn="Frequency change from moving sources, Doppler effect in sound and light waves"
      hideControls={true}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          {/* Giriş */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Doppler Etkisi Nedir?', 'What is Doppler Effect?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Doppler etkisi, dalga kaynağı veya gözlemci hareket ettiğinde gözlemlenen frekans değişimidir. Christian Doppler tarafından 1842\'de önerilmiş ve 1845\'te deneysel olarak kanıtlanmıştır.',
                'Doppler effect is the observed frequency change when the wave source or observer moves. It was proposed by Christian Doppler in 1842 and experimentally proven in 1845.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Bu etki ses dalgalarından ışık dalgalarına kadar tüm dalga türlerinde gözlemlenir.',
                  'This effect is observed in all wave types from sound waves to light waves.'
                )}
              </Text>
            </View>
          </View>

          {/* Ses Doppler Etkisi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Ses Dalgalarında Doppler Etkisi', 'Doppler Effect in Sound Waves')}
            </Text>
            
            <Text style={styles.subTitle}>{t('Kaynak Hareket Ediyor:', 'Source Moving:')}</Text>
            <FormulaText 
              formula="f\' = f × v/(v ± v_s)"
              description={t('Kaynak yaklaşıyor: (-), uzaklaşıyor: (+)', 'Source approaching: (-), receding: (+)')}
            />

            <Text style={styles.subTitle}>{t('Gözlemci Hareket Ediyor:', 'Observer Moving:')}</Text>
            <FormulaText 
              formula="f\' = f × (v ± v_o)/v"
              description={t('Gözlemci yaklaşıyor: (+), uzaklaşıyor: (-)', 'Observer approaching: (+), receding: (-)')}
            />

            <Text style={styles.subTitle}>{t('Genel Durum:', 'General Case:')}</Text>
            <FormulaText 
              formula="f\' = f × (v ± v_o)/(v ± v_s)"
              description={t('v: ses hızı, v_s: kaynak hızı, v_o: gözlemci hızı', 'v: sound speed, v_s: source speed, v_o: observer speed')}
            />
          </View>

          {/* Işık Doppler Etkisi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Işık Dalgalarında Doppler Etkisi', 'Doppler Effect in Light Waves')}
            </Text>
            
            <Text style={styles.subTitle}>{t('Göreli Doppler Etkisi:', 'Relativistic Doppler Effect:')}</Text>
            <FormulaText 
              formula="f\' = f × √((c-v)/(c+v))"
              description={t('Kaynak uzaklaşıyor (kırmızıya kayma)', 'Source receding (redshift)')}
            />

            <FormulaText 
              formula="f\' = f × √((c+v)/(c-v))"
              description={t('Kaynak yaklaşıyor (maviye kayma)', 'Source approaching (blueshift)')}
            />

            <Text style={styles.subTitle}>{t('z Parametresi:', 'z Parameter:')}</Text>
            <FormulaText 
              formula="z = (λ_gözlenen - λ_kaynak)/λ_kaynak"
              description={t('Kozmolojik kırmızıya kayma', 'Cosmological redshift')}
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
                  {t('Ambulans Sireni', 'Ambulance Siren')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Yaklaşırken tiz, uzaklaşırken pes ses', 'High pitch approaching, low pitch receding')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Radar Hız Ölçer', 'Radar Speed Gun')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Frekans değişimi ile hız hesaplama', 'Speed calculation from frequency change')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Yıldızların Hareketi', 'Stellar Motion')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Spektral çizgilerin kayması', 'Shift of spectral lines')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Tıbbi Ultrason', 'Medical Ultrasound')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Kan akışı hızı ölçümü', 'Blood flow velocity measurement')}
                </Text>
              </View>
            </View>
          </View>

          {/* Modern Uygulamalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Modern Uygulamalar', 'Modern Applications')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('GPS Sistemi', 'GPS System')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Uydu hareketinden kaynaklanan düzeltmeler', 'Corrections from satellite motion')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Astronom Gözlemleri', 'Astronomical Observations')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Evren genişlemesi ve karanlık madde', 'Universe expansion and dark matter')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Lidar Teknolojisi', 'Lidar Technology')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Mesafe ve hız ölçümü', 'Distance and velocity measurement')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Hava Trafik Kontrolü', 'Air Traffic Control')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Uçak hızı ve konumu takibi', 'Aircraft speed and position tracking')}
                </Text>
              </View>
            </View>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Doppler etkisi, günlük hayattan kozmolojiye kadar geniş bir alanda uygulanır. Bu etki sayesinde evrenin genişlediğini, yıldızların hareket ettiğini ve birçok teknolojik uygulamayı mümkün kıldığımızı öğrendik.',
                'Doppler effect is applied in a wide range from daily life to cosmology. Through this effect, we learned that the universe is expanding, stars are moving, and many technological applications are made possible.'
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