import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function RCCircuitsTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('RC Devreleri', 'RC Circuits')}
      titleEn="RC Circuits"
      difficulty={t('Orta Seviye', 'Intermediate Level')}
      difficultyEn="Intermediate Level"
      description={t(
        'Direnç-kapasitör devreleri, şarj/deşarj analizi, zaman sabiti ve frekans yanıtı',
        'Resistor-capacitor circuits, charge/discharge analysis, time constant and frequency response'
      )}
      descriptionEn="Resistor-capacitor circuits, charge/discharge analysis, time constant and frequency response"
      hideControls={true}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          {/* Giriş */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('RC Devreleri Nedir?', 'What are RC Circuits?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'RC devreler, direnç (R) ve kapasitör (C) içeren elektriki devrelerdir. Bu devreler, zaman bağımlı davranış gösterir ve birçok elektronik uygulamada temel building block olarak kullanılır.',
                'RC circuits are electrical circuits containing resistor (R) and capacitor (C). These circuits exhibit time-dependent behavior and are used as fundamental building blocks in many electronic applications.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'RC devrelerin en önemli özelliği, zaman sabiti τ = RC ile karakterize olan üstel davranışlarıdır.',
                  'The most important characteristic of RC circuits is their exponential behavior characterized by time constant τ = RC.'
                )}
              </Text>
            </View>
          </View>

          {/* Kapasitör Şarjı */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kapasitör Şarjı', 'Capacitor Charging')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Boş bir kapasitör DC gerilim kaynağına RC devre ile bağlandığında üstel olarak şarj olur.',
                'When an empty capacitor is connected to DC voltage source through RC circuit, it charges exponentially.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Şarj Denklemleri:', 'Charging Equations:')}
            </Text>
            <FormulaText 
              formula="v_C(t) = V_0(1 - e^(-t/RC))"
              description={t('Kapasitör gerilimi', 'Capacitor voltage')}
            />

            <FormulaText 
              formula="i(t) = (V_0/R)e^(-t/RC)"
              description={t('Şarj akımı', 'Charging current')}
            />

            <FormulaText 
              formula="q(t) = CV_0(1 - e^(-t/RC))"
              description={t('Kapasitördeki yük', 'Charge on capacitor')}
            />

            <Text style={styles.subTitle}>
              {t('Zaman Sabiti:', 'Time Constant:')}
            </Text>
            <FormulaText 
              formula="τ = RC"
              description={t('τ zamanında kapasitör %63.2 şarj olur', 'Capacitor reaches 63.2% charge at time τ')}
            />

            <Text style={styles.subTitle}>
              {t('Önemli Zaman Noktaları:', 'Important Time Points:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• t = τ: %63.2 şarj', '• t = τ: 63.2% charged')}
            </Text>
            <Text style={styles.listItem}>
              {t('• t = 2τ: %86.5 şarj', '• t = 2τ: 86.5% charged')}
            </Text>
            <Text style={styles.listItem}>
              {t('• t = 3τ: %95.0 şarj', '• t = 3τ: 95.0% charged')}
            </Text>
            <Text style={styles.listItem}>
              {t('• t = 5τ: %99.3 şarj (tam şarj)', '• t = 5τ: 99.3% charged (full charge)')}
            </Text>
          </View>

          {/* Kapasitör Deşarjı */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Kapasitör Deşarjı', 'Capacitor Discharging')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Şarjlı kapasitör direnç üzerinden deşarj edildiğinde üstel olarak boşalır.',
                'When charged capacitor is discharged through resistor, it discharges exponentially.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Deşarj Denklemleri:', 'Discharging Equations:')}
            </Text>
            <FormulaText 
              formula="v_C(t) = V_0 e^(-t/RC)"
              description={t('Kapasitör gerilimi', 'Capacitor voltage')}
            />

            <FormulaText 
              formula="i(t) = -(V_0/R)e^(-t/RC)"
              description={t('Deşarj akımı (negatif)', 'Discharge current (negative)')}
            />

            <Text style={styles.subTitle}>
              {t('Deşarj Yüzdeleri:', 'Discharge Percentages:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• t = τ: %36.8 kalan', '• t = τ: 36.8% remaining')}
            </Text>
            <Text style={styles.listItem}>
              {t('• t = 2τ: %13.5 kalan', '• t = 2τ: 13.5% remaining')}
            </Text>
            <Text style={styles.listItem}>
              {t('• t = 3τ: %5.0 kalan', '• t = 3τ: 5.0% remaining')}
            </Text>
            <Text style={styles.listItem}>
              {t('• t = 5τ: %0.7 kalan (tam deşarj)', '• t = 5τ: 0.7% remaining (full discharge)')}
            </Text>
          </View>

          {/* AC Analizi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('AC Analizi ve Frekans Yanıtı', 'AC Analysis and Frequency Response')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'RC devreler AC sinyallerde frekansa bağlı davranış gösterir ve filtre olarak kullanılır.',
                'RC circuits show frequency-dependent behavior with AC signals and are used as filters.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kapasitif Reaktans:', 'Capacitive Reactance:')}
            </Text>
            <FormulaText 
              formula="X_C = 1/(ωC) = 1/(2πfC)"
              description={t('Frekansla ters orantılı', 'Inversely proportional to frequency')}
            />

            <Text style={styles.subTitle}>
              {t('İmpedans:', 'Impedance:')}
            </Text>
            <FormulaText 
              formula="Z = R - jX_C = R - j/(ωC)"
              description={t('Karmaşık impedans', 'Complex impedance')}
            />

            <FormulaText 
              formula="|Z| = √(R² + X_C²)"
              description={t('İmpedans büyüklüğü', 'Impedance magnitude')}
            />

            <Text style={styles.subTitle}>
              {t('Faz Açısı:', 'Phase Angle:')}
            </Text>
            <FormulaText 
              formula="φ = -arctan(X_C/R) = -arctan(1/(ωRC))"
              description={t('Gerilim akımdan gecikiyor', 'Voltage lags current')}
            />
          </View>

          {/* RC Filtreleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('RC Filtreleri', 'RC Filters')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Alçak Geçiren Filtre (Low-Pass Filter):', 'Low-Pass Filter:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çıkış kapasitörden alınır. Yüksek frekansları zayıflatır.',
                'Output taken from capacitor. Attenuates high frequencies.'
              )}
            </Text>
            <FormulaText 
              formula="H(jω) = 1/(1 + jωRC)"
              description={t('Transfer fonksiyonu', 'Transfer function')}
            />

            <FormulaText 
              formula="f_c = 1/(2πRC)"
              description={t('Kesim frekansı (-3dB noktası)', 'Cutoff frequency (-3dB point)')}
            />

            <Text style={styles.subTitle}>
              {t('Yüksek Geçiren Filtre (High-Pass Filter):', 'High-Pass Filter:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Çıkış dirençten alınır. Düşük frekansları zayıflatır.',
                'Output taken from resistor. Attenuates low frequencies.'
              )}
            </Text>
            <FormulaText 
              formula="H(jω) = jωRC/(1 + jωRC)"
              description={t('Transfer fonksiyonu', 'Transfer function')}
            />

            <Text style={styles.subTitle}>
              {t('Bode Diyagramı:', 'Bode Diagram:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Alçak geçiren: -20dB/dekad düşüş', '• Low-pass: -20dB/decade rolloff')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yüksek geçiren: +20dB/dekad yükseliş', '• High-pass: +20dB/decade rise')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Kesim frekansında -3dB', '• -3dB at cutoff frequency')}
            </Text>
          </View>

          {/* Zamanlama Devreleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Zamanlama Devreleri', 'Timing Circuits')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Monostable Multivibratör:', 'Monostable Multivibrator:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Tetikleme sonrası belirli süre yüksek çıkış veren devre.',
                'Circuit that gives high output for specific duration after trigger.'
              )}
            </Text>
            <FormulaText 
              formula="T = 1.1 × RC"
              description={t('555 timer ile pulse genişliği', 'Pulse width with 555 timer')}
            />

            <Text style={styles.subTitle}>
              {t('Astable Multivibratör:', 'Astable Multivibrator:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Sürekli kare dalga üreten osilatör devresi.',
                'Oscillator circuit continuously producing square wave.'
              )}
            </Text>
            <FormulaText 
              formula="f = 1.44/((R₁ + 2R₂)C)"
              description={t('555 timer osilatör frekansı', '555 timer oscillator frequency')}
            />

            <Text style={styles.subTitle}>
              {t('Gecikme Devreleri:', 'Delay Circuits:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'RC zaman sabiti kullanarak gecikme sağlayan devreler.',
                'Circuits providing delay using RC time constant.'
              )}
            </Text>
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
                  {t('RC şarj/deşarj devreleri', 'RC charge/discharge circuits')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Ses Sistemleri', 'Audio Systems')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Frekans filtreleme ve coupling', 'Frequency filtering and coupling')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Otomatik Işıklar', 'Automatic Lights')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Zamanlama ve gecikme devreleri', 'Timing and delay circuits')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Araba Sinyal Lambaları', 'Car Turn Signals')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Yanıp sönme zamanlama devreleri', 'Blinking timing circuits')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Güç Kaynakları', 'Power Supplies')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Filtreleme ve düzgünleştirme', 'Filtering and smoothing')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Dokunmatik Ekranlar', 'Touchscreens')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Kapasitif algılama devreleri', 'Capacitive sensing circuits')}
                </Text>
              </View>
            </View>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'RC devreler, elektronik mühendisliğinin temel yapı taşlarından biridir. Zamanlama, filtreleme ve sinyal işleme uygulamalarında vazgeçilmez rol oynar.',
                'RC circuits are one of the fundamental building blocks of electronic engineering. They play indispensable roles in timing, filtering and signal processing applications.'
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