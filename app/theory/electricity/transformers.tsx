import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function TransformersTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Transformatörler', 'Transformers')}
      titleEn="Transformers"
      difficulty={t('İleri Seviye', 'Advanced Level')}
      difficultyEn="Advanced Level"
      description={t(
        'Elektromanyetik indüksiyon, gerilim dönüşümü, güç transferi ve transformatör türleri',
        'Electromagnetic induction, voltage transformation, power transfer and transformer types'
      )}
      descriptionEn="Electromagnetic induction, voltage transformation, power transfer and transformer types"
      hideControls={true}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          {/* Giriş */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Transformatör Nedir?', 'What is a Transformer?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Transformatör, elektromanyetik indüksiyon prensibini kullanarak AC gerilimi ve akımı farklı seviyelere dönüştüren elektrik makinesidir. Michael Faraday\'ın keşiflerine dayanan bu teknoloji, modern elektrik dağıtım sistemlerinin temelini oluşturur.',
                'A transformer is an electrical machine that converts AC voltage and current to different levels using the principle of electromagnetic induction. This technology, based on Michael Faraday\'s discoveries, forms the foundation of modern electrical distribution systems.'
              )}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Transformatör, hareketli parçası olmayan statik bir elektrik makinesidir ve çok yüksek verimle çalışır.',
                  'Transformer is a static electrical machine with no moving parts and operates with very high efficiency.'
                )}
              </Text>
            </View>
          </View>

          {/* Çalışma Prensibi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Çalışma Prensibi', 'Working Principle')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Transformatör, Faraday indüksiyon yasası ve karşılıklı indüktans prensibine dayalı olarak çalışır.',
                'Transformer works based on Faraday\'s law of induction and mutual inductance principle.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Temel Bileşenler:', 'Basic Components:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Birincil sargı (Primary winding)', '• Primary winding')}
            </Text>
            <Text style={styles.listItem}>
              {t('• İkincil sargı (Secondary winding)', '• Secondary winding')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Manyetik çekirdek (Magnetic core)', '• Magnetic core')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yalıtım sistemi', '• Insulation system')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Faraday İndüksiyon Yasası:', 'Faraday\'s Law of Induction:')}
            </Text>
            <FormulaText 
              formula="ε = -N × dΦ/dt"
              description={t('N: sarım sayısı, Φ: manyetik akı', 'N: number of turns, Φ: magnetic flux')}
            />

            <Text style={styles.subTitle}>
              {t('Dönüşüm Oranı:', 'Transformation Ratio:')}
            </Text>
            <FormulaText 
              formula="a = N₁/N₂ = V₁/V₂ = I₂/I₁"
              description={t('İdeal transformatör için', 'For ideal transformer')}
            />
          </View>

          {/* İdeal Transformatör */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('İdeal Transformatör', 'Ideal Transformer')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İdeal transformatörde kayıplar ihmal edilir ve mükemmel manyetik bağlantı varsayılır.',
                'In ideal transformer, losses are neglected and perfect magnetic coupling is assumed.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Gerilim İlişkisi:', 'Voltage Relationship:')}
            </Text>
            <FormulaText 
              formula="V₂/V₁ = N₂/N₁"
              description={t('Gerilim sarım sayısı ile orantılı', 'Voltage proportional to turn ratio')}
            />

            <Text style={styles.subTitle}>
              {t('Akım İlişkisi:', 'Current Relationship:')}
            </Text>
            <FormulaText 
              formula="I₁/I₂ = N₂/N₁"
              description={t('Akım sarım sayısı ile ters orantılı', 'Current inversely proportional to turn ratio')}
            />

            <Text style={styles.subTitle}>
              {t('Güç Korunumu:', 'Power Conservation:')}
            </Text>
            <FormulaText 
              formula="P₁ = P₂ → V₁I₁ = V₂I₂"
              description={t('İdeal transformatörde güç kaybı yok', 'No power loss in ideal transformer')}
            />

            <Text style={styles.subTitle}>
              {t('İmpedans Dönüşümü:', 'Impedance Transformation:')}
            </Text>
            <FormulaText 
              formula="Z₁ = (N₁/N₂)² × Z₂ = a² × Z₂"
              description={t('İmpedans dönüşüm oranının karesi ile orantılı', 'Impedance proportional to square of turn ratio')}
            />
          </View>

          {/* Gerçek Transformatör */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Gerçek Transformatör', 'Real Transformer')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Gerçek transformatörlerde çeşitli kayıplar ve pratik sınırlamalar vardır.',
                'Real transformers have various losses and practical limitations.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Transformatör Kayıpları:', 'Transformer Losses:')}
            </Text>
            
            <Text style={styles.paragraph}>
              {t('**1. Bakır Kayıpları (I²R):**', '**1. Copper Losses (I²R):**')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Sargı direnci nedeniyle ısı kaybı', '• Heat loss due to winding resistance')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yükle değişen kayıp', '• Loss varies with load')}
            </Text>
            <FormulaText 
              formula="P_bakır = I₁²R₁ + I₂²R₂"
              description={t('Bakır kayıpları', 'Copper losses')}
            />

            <Text style={styles.paragraph}>
              {t('**2. Çekirdek Kayıpları:**', '**2. Core Losses:**')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Histerezis kaybı: Manyetik materyal özelliği', '• Hysteresis loss: Magnetic material property')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Eddy akım kaybı: Çekirdekte dönel akımlar', '• Eddy current loss: Circulating currents in core')}
            </Text>
            <FormulaText 
              formula="P_çekirdek = P_histerezis + P_eddy"
              description={t('Çekirdek kayıpları', 'Core losses')}
            />

            <Text style={styles.subTitle}>
              {t('Verim Hesabı:', 'Efficiency Calculation:')}
            </Text>
            <FormulaText 
              formula="η = P_çıkış/P_giriş = P₂/(P₂ + Kayıplar)"
              description={t('Tipik verim: %95-99', 'Typical efficiency: 95-99%')}
            />

            <Text style={styles.subTitle}>
              {t('Gerilim Düzenleme:', 'Voltage Regulation:')}
            </Text>
            <FormulaText 
              formula="VR = (V₂_boş - V₂_yüklü)/V₂_yüklü × 100%"
              description={t('İyi transformatörde %2-5', 'Good transformer: 2-5%')}
            />
          </View>

          {/* Transformatör Türleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Transformatör Türleri', 'Types of Transformers')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Kullanım Yerine Göre:', 'By Application:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Güç transformatörleri (>500 kVA)', '• Power transformers (>500 kVA)')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Dağıtım transformatörleri (<500 kVA)', '• Distribution transformers (<500 kVA)')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Enstrümant transformatörleri', '• Instrument transformers')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Faz Sayısına Göre:', 'By Number of Phases:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Tek fazlı transformatörler', '• Single-phase transformers')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Üç fazlı transformatörler', '• Three-phase transformers')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yapısına Göre:', 'By Construction:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Çekirdek tipi (Core type)', '• Core type')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Kabuk tipi (Shell type)', '• Shell type')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Toroidal transformatörler', '• Toroidal transformers')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Soğutma Tipine Göre:', 'By Cooling Type:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Kuru tip (Dry type)', '• Dry type')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yağ soğutmalı', '• Oil-cooled')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Gaz soğutmalı', '• Gas-cooled')}
            </Text>
          </View>

          {/* Üç Fazlı Transformatörler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Üç Fazlı Transformatörler', 'Three-Phase Transformers')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Güç sistemlerinde yaygın olarak kullanılan üç fazlı transformatörler, üç adet tek fazlı transformatör gibi davranır.',
                'Three-phase transformers commonly used in power systems behave like three single-phase transformers.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Bağlantı Şekilleri:', 'Connection Types:')}
            </Text>

            <Text style={styles.paragraph}>
              {t('**Yıldız Bağlantısı (Y):**', '**Star Connection (Y):**')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Hat gerilimi = √3 × faz gerilimi', '• Line voltage = √3 × phase voltage')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Hat akımı = faz akımı', '• Line current = phase current')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Nötr nokta mevcut', '• Neutral point available')}
            </Text>

            <Text style={styles.paragraph}>
              {t('**Üçgen Bağlantısı (Δ):**', '**Delta Connection (Δ):**')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Hat gerilimi = faz gerilimi', '• Line voltage = phase voltage')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Hat akımı = √3 × faz akımı', '• Line current = √3 × phase current')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Nötr nokta yok', '• No neutral point')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Yaygın Bağlantı Grupları:', 'Common Connection Groups:')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yy0: Her iki taraf yıldız, aynı faz', '• Yy0: Both sides star, same phase')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Dy11: Birincil üçgen, ikincil yıldız', '• Dy11: Primary delta, secondary star')}
            </Text>
            <Text style={styles.listItem}>
              {t('• Yd1: Birincil yıldız, ikincil üçgen', '• Yd1: Primary star, secondary delta')}
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
                  {t('Ev Elektrik Sistemi', 'Home Electrical System')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Mahalle transformatörleri 400V→230V', 'Neighborhood transformers 400V→230V')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Telefon Şarjı', 'Phone Charger')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('AC-DC adaptörlerindeki küçük transformatörler', 'Small transformers in AC-DC adapters')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Mikrodalga Fırın', 'Microwave Oven')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Yüksek gerilim transformatörü', 'High voltage transformer')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Halogen Lambalar', 'Halogen Lamps')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('12V düşük gerilim transformatörleri', '12V low voltage transformers')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Bilgisayar PSU', 'Computer PSU')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Switch-mode transformatörler', 'Switch-mode transformers')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Elektrikli Araçlar', 'Electric Vehicles')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Şarj istasyonu transformatörleri', 'Charging station transformers')}
                </Text>
              </View>
            </View>
          </View>

          {/* Endüstriyel Uygulamalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Endüstriyel Uygulamalar', 'Industrial Applications')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Güç Santralleri', 'Power Plants')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Generator çıkışından transmission seviyesine', 'Generator output to transmission level')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Endüstriyel Tesisler', 'Industrial Facilities')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Motor ve makine beslemesi', 'Motor and machinery supply')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Kaynak Makineleri', 'Welding Machines')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Yüksek akım transformatörleri', 'High current transformers')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Ölçü Transformatörleri', 'Instrument Transformers')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('CT ve PT ölçü amaçlı', 'CT and PT for measurement purposes')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('İzolasyon Transformatörleri', 'Isolation Transformers')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Galvanik izolasyon ve güvenlik', 'Galvanic isolation and safety')}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('UPS Sistemleri', 'UPS Systems')}
                </Text>
                <Text style={styles.applicationText}>
                  {t('Kesintisiz güç kaynağı transformatörleri', 'Uninterruptible power supply transformers')}
                </Text>
              </View>
            </View>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Transformatörler, modern elektrik sistemlerinin vazgeçilmez bileşenleridir. Elektrik enerjisinin üretiminden tüketimine kadar her aşamada kritik rol oynar.',
                'Transformers are indispensable components of modern electrical systems. They play critical roles in every stage from electricity generation to consumption.'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Yüksek verimli, güvenilir ve uzun ömürlü olan transformatörler, elektrik enerjisinin ekonomik ve güvenli bir şekilde iletimini ve dağıtımını mümkün kılar.',
                'Highly efficient, reliable and long-lasting transformers enable economical and safe transmission and distribution of electrical energy.'
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