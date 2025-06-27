import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import FormulaText from '../../../components/ui/FormulaText';

export default function NewtonLawsTheory() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t("Newton'un Hareket Kanunları", "Newton's Laws of Motion")}
      titleEn="Newton's Laws of Motion"
      difficulty={t('Temel Seviye', 'Basic Level')}
      difficultyEn="Basic Level"
      description={t(
        'Sir Isaac Newton tarafından formüle edilen üç temel hareket kanunu ve bunların günlük yaşamdaki uygulamaları',
        'Three fundamental laws of motion formulated by Sir Isaac Newton and their applications in everyday life'
      )}
      descriptionEn="Three fundamental laws of motion formulated by Sir Isaac Newton and their applications in everyday life"
      hideControls={true}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.container}>
          {/* Giriş Bölümü */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Giriş', 'Introduction')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Sir Isaac Newton (1642-1727) tarafından 1687 yılında yayınlanan "Philosophiæ Naturalis Principia Mathematica" adlı eserinde formüle edilen üç hareket kanunu, klasik mekaniğin temelini oluşturur. Bu kanunlar, günümüzde hala geçerliliğini koruyan ve mühendislikten astronomiye kadar birçok alanda kullanılan temel prensipler.dir.',
                'The three laws of motion formulated by Sir Isaac Newton (1642-1727) in his work "Philosophiæ Naturalis Principia Mathematica" published in 1687 form the foundation of classical mechanics. These laws are fundamental principles that remain valid today and are used in many fields from engineering to astronomy.'
              )}
            </Text>
          </View>

          {/* Birinci Kanun */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Birinci Kanun - Atalet Kanunu', 'First Law - Law of Inertia')}
            </Text>
            <View style={styles.lawBox}>
              <Text style={styles.lawText}>
                {t(
                  '"Bir cisim üzerine hiçbir kuvvet etki etmiyorsa veya etki eden kuvvetlerin bileşkesi sıfırsa, durgun olan cisim durgun kalmaya, hareket halindeki cisim düzgün doğrusal hareket yapmaya devam eder."',
                  '"An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force."'
                )}
              </Text>
            </View>
            <Text style={styles.paragraph}>
              {t(
                'Bu kanun atalet kavramını tanımlar. Atalet, cisimlerin mevcut hareket durumlarını koruma eğilimidir. Durgun bir cisim hareket etmeye başlamak için dış kuvvete ihtiyaç duyarken, hareket halindeki bir cisim de durmak için dış kuvvete ihtiyaç duyar.',
                'This law defines the concept of inertia. Inertia is the tendency of objects to maintain their current state of motion. A stationary object needs an external force to start moving, while a moving object needs an external force to stop.'
              )}
            </Text>
            <Text style={styles.subTitle}>
              {t('Günlük Yaşam Örnekleri:', 'Daily Life Examples:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Frenlenen araçta yolcuların öne doğru savrulması',
                '• Passengers jerking forward when a car brakes'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Masadaki kitabın itilene kadar yerinde durması',
                '• A book on a table staying in place until pushed'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Uzayda hareket eden cismin sürekli hareket etmesi',
                '• Objects in space continuing to move indefinitely'
              )}
            </Text>
          </View>

          {/* İkinci Kanun */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('İkinci Kanun - Kuvvet Kanunu', 'Second Law - Force Law')}
            </Text>
            <View style={styles.lawBox}>
              <Text style={styles.lawText}>
                {t(
                  '"Bir cisme uygulanan net kuvvet, cismin kütlesi ile ivmesinin çarpımına eşittir."',
                  '"The net force on an object is equal to the mass of the object multiplied by its acceleration."'
                )}
              </Text>
            </View>
            <FormulaText 
              formula="F = m × a"
              description={t('F: Kuvvet (Newton), m: Kütle (kg), a: İvme (m/s²)', 'F: Force (Newton), m: Mass (kg), a: Acceleration (m/s²)')}
            />
            <Text style={styles.paragraph}>
              {t(
                'Bu kanun, kuvvet, kütle ve ivme arasındaki matematiksel ilişkiyi tanımlar. Aynı kuvvet uygulandığında, kütlesi daha az olan cisim daha fazla ivme kazanır. Aynı ivmeyi elde etmek için, kütlesi daha fazla olan cisme daha büyük kuvvet uygulanmalıdır.',
                'This law defines the mathematical relationship between force, mass, and acceleration. When the same force is applied, an object with less mass gains more acceleration. To achieve the same acceleration, a greater force must be applied to an object with more mass.'
              )}
            </Text>
            <Text style={styles.subTitle}>
              {t('Pratik Uygulamalar:', 'Practical Applications:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Roket motorlarının itki hesaplamaları',
                '• Thrust calculations for rocket engines'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Otomobil fren sistemlerinin tasarımı',
                '• Design of automobile braking systems'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Sporda atış gücü hesaplamaları',
                '• Shooting power calculations in sports'
              )}
            </Text>
          </View>

          {/* Üçüncü Kanun */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t(
                'Üçüncü Kanun - Etki-Tepki Kanunu',
                'Third Law - Action-Reaction Law'
              )}
            </Text>
            <View style={styles.lawBox}>
              <Text style={styles.lawText}>
                {t(
                  '"Her etkiye eşit büyüklükte ve zıt yönde bir tepki vardır."',
                  '"For every action, there is an equal and opposite reaction."'
                )}
              </Text>
            </View>
            <Text style={styles.paragraph}>
              {t(
                'Bu kanun, kuvvetlerin çiftler halinde geldiğini açıklar. Bir cisim başka bir cisme kuvvet uyguladığında, ikinci cisim de birinci cisme eşit büyüklükte ancak zıt yönde kuvvet uygular. Bu kuvvetler farklı cisimlere etki ettiği için birbirini götürmez.',
                'This law explains that forces come in pairs. When one object exerts a force on another object, the second object exerts an equal magnitude but opposite direction force on the first object. These forces act on different objects, so they do not cancel each other out.'
              )}
            </Text>
            <Text style={styles.subTitle}>
              {t('Görsel Örnekler:', 'Visual Examples:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Yürürken ayağın yere uyguladığı kuvvet ve yerin ayağa uyguladığı tepki kuvveti',
                '• Force applied by foot on ground while walking and reaction force from ground'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Roketin gazları geriye itip kendini öne doğru itmesi',
                '• Rocket pushing gases backward and propelling itself forward'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Silahtan çıkan merminin geri tepme yaratması',
                '• Bullet fired from gun creating recoil'
              )}
            </Text>
          </View>

          {/* Uygulamalar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('Modern Uygulamalar', 'Modern Applications')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                "Newton'un hareket kanunları günümüzde birçok teknolojik alanda kullanılmaktadır:",
                "Newton's laws of motion are used in many technological fields today:"
              )}
            </Text>
            <View style={styles.applicationGrid}>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Uzay Teknolojisi', 'Space Technology')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Uydu yörüngeleri, uzay araçları navigasyonu',
                    'Satellite orbits, spacecraft navigation'
                  )}
                </Text>
              </View>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Otomotiv', 'Automotive')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Güvenlik sistemleri, performans optimizasyonu',
                    'Safety systems, performance optimization'
                  )}
                </Text>
              </View>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Robotik', 'Robotics')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Hareket kontrolü, denge sistemleri',
                    'Motion control, balance systems'
                  )}
                </Text>
              </View>
              <View style={styles.applicationCard}>
                <Text style={styles.applicationTitle}>
                  {t('Spor Bilimi', 'Sports Science')}
                </Text>
                <Text style={styles.applicationText}>
                  {t(
                    'Performans analizi, ekipman tasarımı',
                    'Performance analysis, equipment design'
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Sonuç */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Sonuç', 'Conclusion')}</Text>
            <Text style={styles.paragraph}>
              {t(
                "Newton'un hareket kanunları, fizik biliminin temel taşlarından biridir. 300 yılı aşkın süredir geçerliliğini koruyan bu kanunlar, mikro ölçekten makro ölçeğe kadar birçok fiziksel olayı açıklamada kullanılır. Modern teknolojinin gelişiminde ve günlük yaşamımızdaki birçok uygulamada bu kanunların prensipleri yer almaktadır.",
                "Newton's laws of motion are one of the fundamental pillars of physics. These laws, which have remained valid for over 300 years, are used to explain many physical phenomena from micro to macro scale. The principles of these laws are involved in the development of modern technology and many applications in our daily lives."
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
    fontSize: 24,
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
