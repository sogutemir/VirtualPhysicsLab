import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';

export default function VectorsScalarsTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Vektörler ve Skalerler', 'Vectors and Scalars')}
      titleEn="Vectors and Scalars"
      difficulty={t('Temel Seviye', 'Basic Level')}
      difficultyEn="Basic Level"
      description={t(
        'Fiziksel büyüklüklerin temel sınıflandırması: vektörel ve skaler büyüklükler',
        'Basic classification of physical quantities: vector and scalar quantities'
      )}
      descriptionEn="Basic classification of physical quantities: vector and scalar quantities"
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
              {t('Fiziksel Büyüklükler', 'Physical Quantities')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Fizik biliminde, doğadaki olayları tanımlamak için çeşitli büyüklükler kullanırız. Bu büyüklükler temel olarak iki gruba ayrılır: skaler büyüklükler ve vektörel büyüklükler. Bu ayrım, fiziksel olayları doğru bir şekilde anlamamız ve matematiksel olarak ifade etmemiz için kritik öneme sahiptir.',
                'In physics, we use various quantities to describe natural phenomena. These quantities are fundamentally divided into two groups: scalar quantities and vector quantities. This distinction is critically important for correctly understanding and mathematically expressing physical events.'
              )}
            </Text>
          </View>

          {/* Skaler Büyüklükler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Skaler Büyüklükler', 'Scalar Quantities')}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Skaler büyüklükler, sadece büyüklük (sayısal değer) ile tanımlanan fiziksel büyüklüklerdir. Yön bilgisi içermezler.',
                  'Scalar quantities are physical quantities that are defined only by magnitude (numerical value). They do not contain directional information.'
                )}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t(
                'Skaler Büyüklük Örnekleri:',
                'Examples of Scalar Quantities:'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Kütle: 5 kg, 10 kg, 0.5 kg', '• Mass: 5 kg, 10 kg, 0.5 kg')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Sıcaklık: 25°C, 100°C, -10°C',
                '• Temperature: 25°C, 100°C, -10°C'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Zaman: 3 saniye, 1 saat, 2 gün',
                '• Time: 3 seconds, 1 hour, 2 days'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Enerji: 100 Joule, 50 kWh', '• Energy: 100 Joule, 50 kWh')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Hız (büyüklük): 60 km/h, 10 m/s',
                '• Speed (magnitude): 60 km/h, 10 m/s'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Hacim: 2 litre, 500 ml', '• Volume: 2 liters, 500 ml')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Skaler İşlemler:', 'Scalar Operations:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Skaler büyüklükler normal aritmetik kurallarla toplanır, çıkarılır, çarpılır ve bölünür. Örneğin, 5 kg + 3 kg = 8 kg şeklinde basit toplama işlemi yapılır.',
                'Scalar quantities are added, subtracted, multiplied, and divided using normal arithmetic rules. For example, 5 kg + 3 kg = 8 kg is a simple addition operation.'
              )}
            </Text>
          </View>

          {/* Vektörel Büyüklükler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Vektörel Büyüklükler', 'Vector Quantities')}
            </Text>
            <View style={styles.definitionBox}>
              <Text style={styles.definitionText}>
                {t(
                  'Vektörel büyüklükler, hem büyüklük hem de yön bilgisi içeren fiziksel büyüklüklerdir. Tam olarak tanımlanabilmeleri için her iki bilgiye de ihtiyaç duyarlar.',
                  'Vector quantities are physical quantities that contain both magnitude and direction information. They need both pieces of information to be fully defined.'
                )}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t(
                'Vektörel Büyüklük Örnekleri:',
                'Examples of Vector Quantities:'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Yer değiştirme: 10 m doğuya',
                '• Displacement: 10 m eastward'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Hız: 50 km/h kuzeye doğru',
                '• Velocity: 50 km/h northward'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t('• Kuvvet: 20 N yukarı yönde', '• Force: 20 N upward')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• İvme: 9.8 m/s² aşağı yönde',
                '• Acceleration: 9.8 m/s² downward'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Momentum: 100 kg⋅m/s sağa doğru',
                '• Momentum: 100 kg⋅m/s rightward'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Elektrik alan: 1000 N/C pozitif yüke doğru',
                '• Electric field: 1000 N/C toward positive charge'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Vektör Gösterimi:', 'Vector Notation:')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Vektörler genellikle kalın harflerle (F) veya üzerinde ok bulunan harflerle (F⃗) gösterilir. Vektörün büyüklüğü |F| veya F şeklinde yazılır.',
                'Vectors are usually represented by bold letters (F) or letters with arrows above them (F⃗). The magnitude of a vector is written as |F| or F.'
              )}
            </Text>
          </View>

          {/* Vektör İşlemleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Vektör İşlemleri', 'Vector Operations')}
            </Text>

            <Text style={styles.subTitle}>
              {t('1. Vektör Toplama', '1. Vector Addition')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Vektörler, paralel kenar kuralı veya üçgen kuralı kullanılarak toplanır. İki vektörün toplamı, her zaman skaler toplama ile aynı sonucu vermez.',
                'Vectors are added using the parallelogram rule or triangle rule. The sum of two vectors does not always give the same result as scalar addition.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>A⃗ + B⃗ = C⃗</Text>
              <Text style={styles.formulaDesc}>
                {t('Vektör toplama işlemi', 'Vector addition operation')}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t('2. Vektör Çıkarma', '2. Vector Subtraction')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Bir vektörden başka bir vektör çıkarmak, ikinci vektörün tersini birinci vektöre eklemek anlamına gelir.',
                'Subtracting one vector from another means adding the negative of the second vector to the first vector.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>A⃗ - B⃗ = A⃗ + (-B⃗)</Text>
              <Text style={styles.formulaDesc}>
                {t('Vektör çıkarma işlemi', 'Vector subtraction operation')}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t('3. Skaler ile Çarpma', '3. Scalar Multiplication')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Bir vektör bir skaler ile çarpıldığında, vektörün büyüklüğü değişir ancak yönü aynı kalır (pozitif skaler için).',
                'When a vector is multiplied by a scalar, the magnitude of the vector changes but the direction remains the same (for positive scalars).'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>k × A⃗ = kA⃗</Text>
              <Text style={styles.formulaDesc}>
                {t('k: skaler, A⃗: vektör', 'k: scalar, A⃗: vector')}
              </Text>
            </View>
          </View>

          {/* Koordinat Sistemi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t(
                'Koordinat Sisteminde Vektörler',
                'Vectors in Coordinate System'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Vektörler koordinat sisteminde bileşenleri ile ifade edilebilir. İki boyutlu sistemde bir vektör x ve y bileşenlerine ayrılır.',
                'Vectors can be expressed by their components in a coordinate system. In a two-dimensional system, a vector is decomposed into x and y components.'
              )}
            </Text>

            <View style={styles.formulaBox}>
              <Text style={styles.formula}>A⃗ = Aₓî + Aᵧĵ</Text>
              <Text style={styles.formulaDesc}>
                {t(
                  'î: x yönü birim vektörü, ĵ: y yönü birim vektörü',
                  'î: unit vector in x direction, ĵ: unit vector in y direction'
                )}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t('Vektör Büyüklüğü:', 'Vector Magnitude:')}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>|A⃗| = √(Aₓ² + Aᵧ²)</Text>
              <Text style={styles.formulaDesc}>
                {t('Pisagor teoremi kullanılarak', 'Using Pythagorean theorem')}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t('Vektör Yönü:', 'Vector Direction:')}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>θ = tan⁻¹(Aᵧ/Aₓ)</Text>
              <Text style={styles.formulaDesc}>
                {t('θ: x ekseni ile yapılan açı', 'θ: angle with x-axis')}
              </Text>
            </View>
          </View>

          {/* Özel Vektör Türleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Özel Vektör Türleri', 'Special Types of Vectors')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Birim Vektör', 'Unit Vector')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Büyüklüğü 1 olan vektörlerdir. Sadece yön bilgisi taşırlar ve genellikle şapka (^) işareti ile gösterilirler.',
                'These are vectors with magnitude 1. They carry only direction information and are usually denoted with a hat (^) symbol.'
              )}
            </Text>
            <View style={styles.formulaBox}>
              <Text style={styles.formula}>Â = A⃗/|A⃗|</Text>
              <Text style={styles.formulaDesc}>
                {t('A⃗ vektörünün birim vektörü', 'Unit vector of vector A⃗')}
              </Text>
            </View>

            <Text style={styles.subTitle}>
              {t('Sıfır Vektör', 'Zero Vector')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Büyüklüğü sıfır olan vektördür. Yönü tanımsızdır ve 0⃗ ile gösterilir.',
                'This is a vector with zero magnitude. Its direction is undefined and it is denoted by 0⃗.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Eşit Vektörler', 'Equal Vectors')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Hem büyüklükleri hem de yönleri aynı olan vektörlerdir. Konumları farklı olabilir.',
                'These are vectors that have the same magnitude and direction. Their positions can be different.'
              )}
            </Text>
          </View>

          {/* Fizikteki Uygulamalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Fizikteki Uygulamalar', 'Applications in Physics')}
            </Text>

            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Kinematik', 'Kinematics')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Konum, hız ve ivme vektörleri ile hareket analizi',
                    'Motion analysis with position, velocity, and acceleration vectors'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Dinamik', 'Dynamics')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Kuvvet vektörleri ve Newton yasalarının uygulanması',
                    "Force vectors and application of Newton's laws"
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Elektromanyetizma', 'Electromagnetism')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Elektrik ve manyetik alan vektörleri',
                    'Electric and magnetic field vectors'
                  )}
                </Text>
              </View>

              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Dalga Fiziği', 'Wave Physics')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Dalga yayılım yönü ve polarizasyon vektörleri',
                    'Wave propagation direction and polarization vectors'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Günlük Hayat Örnekleri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Günlük Hayat Örnekleri', 'Daily Life Examples')}
            </Text>

            <Text style={styles.subTitle}>
              {t('Skaler Örnekler:', 'Scalar Examples:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Arabanın hız göstergesindeki değer (100 km/h)',
                '• Value on car speedometer (100 km/h)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Termometredeki sıcaklık (25°C)',
                '• Temperature on thermometer (25°C)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Alışveriş fişindeki toplam tutar (150 TL)',
                '• Total amount on shopping receipt (150 TL)'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Telefonun pil yüzdesi (%80)',
                '• Phone battery percentage (80%)'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Vektörel Örnekler:', 'Vector Examples:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• GPS navigasyonunda "200 m sonra sağa dön"',
                '• GPS navigation "turn right after 200 m"'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Rüzgar hızı: "30 km/h güneybatıdan"',
                '• Wind speed: "30 km/h from southwest"'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Asansörde yukarı veya aşağı hareket',
                '• Upward or downward motion in elevator'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Futbolda topun hareket yönü ve hızı',
                '• Direction and speed of ball in football'
              )}
            </Text>
          </View>

          {/* Problem Çözüm Stratejileri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Problem Çözüm Stratejileri', 'Problem Solving Strategies')}
            </Text>

            <Text style={styles.subTitle}>
              {t(
                'Vektör Problemleri İçin Adımlar:',
                'Steps for Vector Problems:'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Problemi dikkatlice okuyun ve vektörel büyüklükleri belirleyin',
                '1. Read the problem carefully and identify vector quantities'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Uygun koordinat sistemi seçin',
                '2. Choose an appropriate coordinate system'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Vektörleri bileşenlerine ayırın',
                '3. Decompose vectors into components'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Her bileşen için ayrı ayrı işlem yapın',
                '4. Perform operations separately for each component'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '5. Sonuç vektörünü büyüklük ve yön olarak ifade edin',
                '5. Express the result vector in terms of magnitude and direction'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '6. Sonucun fiziksel anlamını kontrol edin',
                '6. Check the physical meaning of the result'
              )}
            </Text>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                'Vektörler ve skalerler arasındaki fark, fizik biliminin temel kavramlarından biridir. Bu ayrımı anlamak, fiziksel olayları doğru bir şekilde modellemek ve matematiksel olarak çözmek için kritik öneme sahiptir. Günlük yaşamdan ileri düzey fizik problemlerine kadar her alanda bu kavramlar karşımıza çıkar.',
                'The difference between vectors and scalars is one of the fundamental concepts in physics. Understanding this distinction is critically important for correctly modeling physical events and solving them mathematically. These concepts appear in every field from daily life to advanced physics problems.'
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
