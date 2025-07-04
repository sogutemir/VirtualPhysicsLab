import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, BookOpen } from 'lucide-react-native';
import { useLanguage } from '../../components/LanguageContext';

// Define theory topic types
type Category = 'mechanics' | 'waves' | 'electricity' | 'basics' | 'modern';

interface TheoryTopic {
  id: string;
  title: string;
  titleEn: string;
  category: Category;
  description: string;
  descriptionEn: string;
  route: string;
}

// Sample theory topics data - only include topics that actually exist
const theoryTopics: TheoryTopic[] = [
  {
    id: '1',
    title: "Newton'un Hareket Kanunları",
    titleEn: "Newton's Laws of Motion",
    category: 'mechanics',
    description: "Newton'un üç hareket kanunu ve uygulamaları",
    descriptionEn: "Newton's three laws of motion and their applications",
    route: '/theory/mechanics/newton-laws',
  },
  {
    id: '2',
    title: 'Momentum ve Korunumu',
    titleEn: 'Momentum and Conservation',
    category: 'mechanics',
    description: 'Momentum kavramı ve korunum yasaları',
    descriptionEn: 'Concept of momentum and conservation laws',
    route: '/theory/mechanics/momentum',
  },
  {
    id: '3',
    title: 'Fotoelektrik Olay',
    titleEn: 'Photoelectric Effect',
    category: 'modern',
    description: 'Einstein\'ın kuantum teorisi ve fotoelektrik olay',
    descriptionEn: 'Einstein\'s quantum theory and photoelectric effect',
    route: '/theory/modern/photoelectric-effect',
  },
  {
    id: '4',
    title: 'Dalga Teorisi',
    titleEn: 'Wave Theory',
    category: 'waves',
    description: 'Dalgaların özellikleri ve davranışları',
    descriptionEn: 'Properties and behaviors of waves',
    route: '/theory/waves/wave-theory',
  },
  {
    id: '5',
    title: 'Dalga Teorisi',
    titleEn: 'Wave Theory',
    category: 'waves',
    description: 'Dalga hareketi, frekans, dalga boyu ve dalga özellikleri',
    descriptionEn: 'Wave motion, frequency, wavelength and wave properties',
    route: '/theory/waves/wave-theory',
  },
  {
    id: '7',
    title: 'Elektrik Alanlar',
    titleEn: 'Electric Fields',
    category: 'electricity',
    description: 'Elektrik alan, potansiyel ve Gauss yasası',
    descriptionEn: 'Electric field, potential and Gauss law',
    route: '/theory/electricity/electric-fields',
  },
  {
    id: '10',
    title: 'Ohm Yasası ve Direnç',
    titleEn: 'Ohm\'s Law and Resistance',
    category: 'electricity',
    description: 'Elektrik akımı, gerilim, direnç ve güç hesaplamaları',
    descriptionEn: 'Electric current, voltage, resistance and power calculations',
    route: '/theory/electricity/ohm-law-resistance',
  },
  {
    id: '16',
    title: 'Kirchhoff Yasaları',
    titleEn: 'Kirchhoff Laws',
    category: 'electricity',
    description: 'Akım ve gerilim yasaları, devre analizi teknikleri',
    descriptionEn: 'Current and voltage laws, circuit analysis techniques',
    route: '/theory/electricity/kirchhoff-laws',
  },
  {
    id: '17',
    title: 'Kapasitör ve Kapasitans',
    titleEn: 'Capacitors and Capacitance',
    category: 'electricity',
    description: 'Elektrik yük depolama, dielektrik maddeler ve enerji',
    descriptionEn: 'Electric charge storage, dielectric materials and energy',
    route: '/theory/electricity/capacitors-capacitance',
  },
  {
    id: '18',
    title: 'Manyetik Alanlar',
    titleEn: 'Magnetic Fields',
    category: 'electricity',
    description: 'Manyetik kuvvet, indüksiyon ve elektromanyetizma',
    descriptionEn: 'Magnetic force, induction and electromagnetism',
    route: '/theory/electricity/magnetic-fields',
  },
  {
    id: '19',
    title: 'RC Devreleri',
    titleEn: 'RC Circuits',
    category: 'electricity',
    description: 'Kapasitör-direnç devreleri, şarj ve deşarj analizi',
    descriptionEn: 'Resistor-capacitor circuits, charging and discharging analysis',
    route: '/theory/electricity/rc-circuits',
  },
  {
    id: '20',
    title: 'Transformatörler',
    titleEn: 'Transformers',
    category: 'electricity',
    description: 'Elektromanyetik indüksiyon, gerilim değişimi ve güç transferi',
    descriptionEn: 'Electromagnetic induction, voltage transformation and power transfer',
    route: '/theory/electricity/transformers',
  },
  {
    id: '8',
    title: 'Vektörler ve Skalerler',
    titleEn: 'Vectors and Scalars',
    category: 'basics',
    description: 'Vektör ve skaler büyüklükler',
    descriptionEn: 'Vector and scalar quantities',
    route: '/theory/basics/vectors-scalars',
  },
  {
    id: '9',
    title: 'Serbest Düşüş ve Yerçekimi',
    titleEn: 'Free Fall and Gravity',
    category: 'mechanics',
    description: 'Yerçekimi kuvveti ve serbest düşüş hareketi',
    descriptionEn: 'Gravitational force and free fall motion',
    route: '/theory/mechanics/free-fall-gravity',
  },
  {
    id: '11',
    title: 'Basit Harmonik Hareket',
    titleEn: 'Simple Harmonic Motion',
    category: 'mechanics',
    description: 'Yay-kütle sistemi, sarkaç ve salınım hareketi',
    descriptionEn: 'Spring-mass system, pendulum and oscillatory motion',
    route: '/theory/mechanics/simple-harmonic-motion',
  },
  {
    id: '12',
    title: 'Enerji Korunumu',
    titleEn: 'Energy Conservation',
    category: 'mechanics',
    description: 'Mekanik enerji, potansiyel enerji ve enerji korunumu yasası',
    descriptionEn: 'Mechanical energy, potential energy and law of energy conservation',
    route: '/theory/mechanics/energy-conservation',
  },
  {
    id: '13',
    title: 'Girişim ve Süperpozisyon',
    titleEn: 'Interference and Superposition',
    category: 'waves',
    description: 'Dalga girişimi, yapıcı-yıkıcı girişim ve süperpozisyon prensibi',
    descriptionEn: 'Wave interference, constructive-destructive interference and superposition principle',
    route: '/theory/waves/interference-superposition',
  },
  {
    id: '14',
    title: 'Çift Yarık Deneyi',
    titleEn: 'Double Slit Experiment',
    category: 'waves',
    description: 'Young deneyi, dalga-parçacık dualitesi ve kuantum mekaniği',
    descriptionEn: 'Young experiment, wave-particle duality and quantum mechanics',
    route: '/theory/waves/double-slit-experiment',
  },
  {
    id: '15',
    title: 'Doppler Etkisi',
    titleEn: 'Doppler Effect',
    category: 'waves',
    description: 'Hareket eden kaynaktan gelen dalgalarda frekans değişimi',
    descriptionEn: 'Frequency change in waves from moving sources',
    route: '/theory/waves/doppler-effect',
  },
];

// Category translations for display
const categoryTranslations: Record<Category, { tr: string; en: string }> = {
  mechanics: { tr: 'Mekanik', en: 'Mechanics' },
  waves: { tr: 'Dalga ve Optik', en: 'Waves and Optics' },
  electricity: {
    tr: 'Elektrik ve Manyetizma',
    en: 'Electricity and Magnetism',
  },
  basics: { tr: 'Temel Kavramlar', en: 'Basic Concepts' },
  modern: { tr: 'Modern Fizik', en: 'Modern Physics' },
};

export default function TheoryScreen() {
  const { language, t } = useLanguage();
  const searchParams = useLocalSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    'all'
  );

  // URL parametrelerinden kategori bilgisini alarak state'i güncelle
  useEffect(() => {
    const categoryParam = searchParams.selectedCategory as string | undefined;
    if (
      categoryParam &&
      (categoryParam === 'mechanics' ||
        categoryParam === 'waves' ||
        categoryParam === 'electricity' ||
        categoryParam === 'basics' ||
        categoryParam === 'modern')
    ) {
      setSelectedCategory(categoryParam as Category);
    }
  }, [searchParams]);

  // Kategori değiştirme fonksiyonu (URL güncelleme ile)
  const handleCategoryChange = (category: Category | 'all') => {
    setSelectedCategory(category);
    // URL'i güncelle
    if (category === 'all') {
      router.push('/(tabs)/theory');
    } else {
      router.push(`/(tabs)/theory?selectedCategory=${category}`);
    }
  };

  // Filter topics based on selected category
  const filteredTopics = theoryTopics.filter((topic) => {
    return selectedCategory === 'all' || topic.category === selectedCategory;
  });

  const handleTopicPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Fizik Teorisi', 'Physics Theory')}</Text>
        <Text style={styles.subtitle}>
          {t(
            'Deneylerin arkasındaki temel fizik kavramlarını öğrenin',
            'Learn the fundamental physics concepts behind the experiments'
          )}
        </Text>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedCategory === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => handleCategoryChange('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedCategory === 'all' && styles.filterButtonTextActive,
              ]}
            >
              {t('Tümü', 'All')}
            </Text>
          </TouchableOpacity>

          {(Object.keys(categoryTranslations) as Category[]).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.filterButtonActive,
              ]}
              onPress={() => handleCategoryChange(category)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === category &&
                    styles.filterButtonTextActive,
                ]}
              >
                {language === 'tr'
                  ? categoryTranslations[category].tr
                  : categoryTranslations[category].en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>
          {t('Kategoriler', 'Categories')}
        </Text>
        <View style={styles.categoriesGrid}>
          {(Object.keys(categoryTranslations) as Category[]).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryCard,
                selectedCategory === category && styles.categoryCardActive,
              ]}
              onPress={() => handleCategoryChange(category)}
            >
              <Text style={styles.categoryTitle}>
                {language === 'tr'
                  ? categoryTranslations[category].tr
                  : categoryTranslations[category].en}
              </Text>
              <Text style={styles.categoryCount}>
                {
                  theoryTopics.filter((topic) => topic.category === category)
                    .length
                }{' '}
                {t('konu', 'topics')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.allTopicsSection}>
        <Text style={styles.sectionTitle}>
          {t('Tüm Konular', 'All Topics')} ({filteredTopics.length})
        </Text>
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.topicCard}
              onPress={() => handleTopicPress(topic.route)}
            >
              <View style={styles.topicContent}>
                <View style={styles.topicIconContainer}>
                  <BookOpen size={24} color="#3498db" />
                </View>
                <View style={styles.topicInfo}>
                  <Text style={styles.topicTitle}>
                    {language === 'tr' ? topic.title : topic.titleEn}
                  </Text>
                  <Text style={styles.topicCategory}>
                    {language === 'tr'
                      ? categoryTranslations[topic.category].tr
                      : categoryTranslations[topic.category].en}
                  </Text>
                  <Text style={styles.topicDescription}>
                    {language === 'tr'
                      ? topic.description
                      : topic.descriptionEn}
                  </Text>
                </View>
              </View>
              <View style={styles.topicAction}>
                <ArrowRight size={20} color="#3498db" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {t(
                'Bu kategoride henüz konu bulunmamaktadır.',
                'No topics available in this category yet.'
              )}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  filtersContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  categoriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryCardActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#3498db',
    borderWidth: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  categoryCount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  allTopicsSection: {
    padding: 20,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topicContent: {
    flexDirection: 'row',
    flex: 1,
  },
  topicIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  topicCategory: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  topicDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  topicAction: {
    marginLeft: 10,
  },
  noResultsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});
