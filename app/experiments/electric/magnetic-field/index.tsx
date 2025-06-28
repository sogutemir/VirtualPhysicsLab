import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../../components/ExperimentLayout';
import { useLanguage } from '../../../../components/LanguageContext';
import MagneticFieldExperiment from './components/MagneticFieldExperiment';

export default function MagneticFieldPage() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title={t('Manyetik Alan', 'Magnetic Field')}
      titleEn="Magnetic Field"
      difficulty={t('Orta Seviye', 'Intermediate')}
      difficultyEn="Intermediate"
      description={t(
        'Manyetik alanın özelliklerini ve etkilerini interaktif olarak keşfedin. Farklı manyetik alan kaynakları ile deneyler yapın ve manyetik alan çizgilerini gözlemleyin.',
        'Interactively explore the properties and effects of magnetic fields. Experiment with different magnetic field sources and observe magnetic field lines.'
      )}
      descriptionEn="Interactively explore the properties and effects of magnetic fields. Experiment with different magnetic field sources and observe magnetic field lines."
      hideControls={true}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.container}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>
              {t('Manyetik Alan Nedir?', 'What is a Magnetic Field?')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Manyetik alan, elektrik akımı veya manyetik malzemeler tarafından oluşturulan ve manyetik özelliklere sahip cisimlere kuvvet uygulayan bir alandır. Manyetik alanlar, elektrik akımı taşıyan teller, bobinler ve kalıcı mıknatıslar etrafında oluşur.',
                'A magnetic field is a field created by electric current or magnetic materials that exerts force on objects with magnetic properties. Magnetic fields form around current-carrying wires, coils, and permanent magnets.'
              )}
            </Text>

            <Text style={styles.subTitle}>
              {t('Manyetik Alan Kaynakları:', 'Magnetic Field Sources:')}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Düz Tel: Elektrik akımı taşıyan düz bir tel etrafında dairesel manyetik alan çizgileri oluşur.',
                '• Straight Wire: Circular magnetic field lines form around a straight wire carrying electric current.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Bobin (Solenoid): Sarmal şeklinde sarılmış bir tel, içinde daha güçlü ve düzgün bir manyetik alan oluşturur.',
                '• Coil (Solenoid): A helically wound wire creates a stronger and more uniform magnetic field inside.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '• Çubuk Mıknatıs: Kalıcı mıknatıslar, kuzey ve güney kutupları arasında manyetik alan çizgileri oluşturur.',
                '• Bar Magnet: Permanent magnets create magnetic field lines between north and south poles.'
              )}
            </Text>
          </View>

          <MagneticFieldExperiment />

          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>
              {t('Deney Talimatları', 'Experiment Instructions')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Bu interaktif simülasyonda farklı manyetik alan kaynaklarını inceleyebilir ve parametrelerini değiştirebilirsiniz:',
                'In this interactive simulation, you can examine different magnetic field sources and change their parameters:'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '1. Üstteki sekmelerden bir manyetik alan kaynağı seçin (Düz Tel, Bobin veya Çubuk Mıknatıs).',
                '1. Select a magnetic field source from the tabs above (Straight Wire, Coil, or Bar Magnet).'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '2. Akım şiddetini, tel mesafesini veya bobin sarım sayısını ayarlayın.',
                '2. Adjust the current intensity, wire distance, or number of coil turns.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '3. Manyetik alan çizgilerini göstermek veya gizlemek için ilgili düğmeyi kullanın.',
                '3. Use the relevant button to show or hide magnetic field lines.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '4. Manyetik alanı canlandırmak için animasyon düğmesini kullanın.',
                '4. Use the animation button to animate the magnetic field.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '5. Manyetik alan şiddetinin nasıl değiştiğini gözlemleyin.',
                '5. Observe how the magnetic field strength changes.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '6. "Yükleri Göster" seçeneğini aktifleştirin ve animasyon başlattığınızda Lorentz kuvvetinin etkisini izleyin.',
                '6. Enable "Show Charges" option and watch the Lorentz force effect when animation starts.'
              )}
            </Text>
            <Text style={styles.listItem}>
              {t(
                '7. Pozitif ve negatif yüklerin manyetik alanda nasıl ters yönlerde hareket ettiğini gözlemleyin.',
                '7. Observe how positive and negative charges move in opposite directions in the magnetic field.'
              )}
            </Text>
          </View>

          <View style={styles.formulaSection}>
            <Text style={styles.sectionTitle}>
              {t('Manyetik Alan Formülleri', 'Magnetic Field Formulas')}
            </Text>
            <Text style={styles.formula}>
              {t('Düz Tel:', 'Straight Wire:')} B = μ₀I / 2πr
            </Text>
            <Text style={styles.formulaDescription}>
              {t(
                'Burada B manyetik alan şiddeti, μ₀ manyetik geçirgenlik sabiti, I akım şiddeti ve r telden olan uzaklıktır.',
                'Where B is magnetic field strength, μ₀ is magnetic permeability constant, I is current intensity, and r is distance from the wire.'
              )}
            </Text>

            <Text style={styles.formula}>{t('Bobin:', 'Coil:')} B = μ₀nI</Text>
            <Text style={styles.formulaDescription}>
              {t(
                'Burada n birim uzunluktaki sarım sayısıdır.',
                'Where n is the number of turns per unit length.'
              )}
            </Text>

            <Text style={styles.formula}>
              {t('Çubuk Mıknatıs:', 'Bar Magnet:')} B ~ 1/r³
            </Text>
            <Text style={styles.formulaDescription}>
              {t(
                'Mıknatıstan uzaklaştıkça alan şiddeti küp oranında azalır.',
                'The field strength decreases as the cube of distance from the magnet.'
              )}
            </Text>

            <Text style={styles.formula}>
              {t('Lorentz Kuvveti:', 'Lorentz Force:')} F = q(v × B)
            </Text>
            <Text style={styles.formulaDescription}>
              {t(
                'Manyetik alanda hareket eden yüklere etki eden kuvvet. q yük miktarı, v hız vektörü, B manyetik alan vektörüdür.',
                'Force acting on charges moving in a magnetic field. q is charge amount, v is velocity vector, B is magnetic field vector.'
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
  infoSection: {
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
    fontSize: 18,
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
    marginBottom: 8,
    paddingLeft: 8,
  },
  instructionsSection: {
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
  formulaSection: {
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
  formula: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
  },
  formulaDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
});
