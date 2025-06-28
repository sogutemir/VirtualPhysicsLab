import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Link, Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Search } from 'lucide-react-native';
import { useLanguage } from '../../components/LanguageContext';

// Define experiment types
type Difficulty = 'Başlangıç' | 'Orta Seviye' | 'İleri Seviye';
type DifficultyEn = 'Beginner' | 'Intermediate' | 'Advanced';
type Category = 'mechanics' | 'waves' | 'electricity' | 'basics' | 'modern';

type ExperimentRoute =
  | '/experiments/mechanics/pendulum'
  | '/experiments/mechanics/conical-pendulum'
  | '/experiments/mechanics/spring-mass'
  | '/experiments/mechanics/inclined-plane'
  | '/experiments/mechanics/weighted-pulley'
  | '/experiments/mechanics/collisions'
  | '/experiments/mechanics/atwood'
  | '/experiments/mechanics/accelerated-motion'
  | '/experiments/mechanics/free-fall'
  | '/experiments/mechanics/vector-addition'
  | '/experiments/mechanics/moment-balance'
  | '/experiments/waves/double-slit'
  | '/experiments/waves/wave-interference'
  | '/experiments/waves/transverse-wave'
  | '/experiments/waves/optical-systems'
  | '/experiments/waves/doppler-effect'
  | '/experiments/electricity/electric-field'
  | '/experiments/electricity/rlc-circuit'
  | '/experiments/electricity/transformer'
  | '/experiments/electric/ohm-law'
  | '/experiments/electric/rc-circuit'
  | '/experiments/basics/relative-motion'
  | '/experiments/basics/coriolis-effect'
  | '/experiments/basics/buoyancy'
  | '/experiments/basics/pressure'
  | '/experiments/electric/magnetic-field'
  | '/experiments/modern/photoelectric';

export interface Experiment {
  id: string;
  title: string;
  titleEn: string;
  category: Category;
  difficulty: Difficulty;
  difficultyEn: DifficultyEn;
  description: string;
  descriptionEn: string;
  route: Href;
}

// Sample experiments data
export const experiments: Experiment[] = [
  {
    id: '1',
    title: 'Gelişmiş Sarkaç Deneyi',
    titleEn: 'Advanced Pendulum Experiment',
    category: 'mechanics',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description:
      'Üç farklı sarkaç türünü inceleyebileceğiniz kapsamlı deney: Basit sarkaç, çift sarkaç (kaotik davranış) ve fiziksel sarkaç (atalet momenti). Her modda parametreleri değiştirerek farklı fiziksel davranışları gözlemleyebilirsiniz.',
    descriptionEn:
      'Comprehensive experiment to study three different pendulum types: Simple pendulum, double pendulum (chaotic behavior), and physical pendulum (moment of inertia). Observe different physical behaviors by changing parameters in each mode.',
    route: '/experiments/mechanics/pendulum' as any,
  },
  {
    id: '2',
    title: 'Konik Sarkaç',
    titleEn: 'Conical Pendulum',
    category: 'mechanics',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description: 'Konik sarkaç hareketi ve açısal momentum',
    descriptionEn: 'Conical pendulum motion and angular momentum',
    route: '/experiments/mechanics/conical-pendulum' as any,
  },
  {
    id: '3',
    title: 'Yay-Kütle Sistemi',
    titleEn: 'Spring-Mass System',
    category: 'mechanics',
    difficulty: 'Başlangıç',
    difficultyEn: 'Beginner',
    description: 'Harmonik hareket ve Hooke Yasası',
    descriptionEn: "Harmonic motion and Hooke's Law",
    route: '/experiments/mechanics/spring-mass' as any,
  },
  {
    id: '4',
    title: 'Eğik Düzlem',
    titleEn: 'Inclined Plane',
    category: 'mechanics',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description: 'Eğik düzlem üzerinde hareket ve kuvvetler',
    descriptionEn: 'Motion and forces on an inclined plane',
    route: '/experiments/mechanics/inclined-plane' as any,
  },
  {
    id: '5',
    title: 'Ağırlıklı Makara',
    titleEn: 'Weighted Pulley',
    category: 'mechanics',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description: 'Ağırlıklı makara sistemi ve açısal hareket',
    descriptionEn: 'Weighted pulley system and angular motion',
    route: '/experiments/mechanics/weighted-pulley' as any,
  },
  {
    id: '6',
    title: 'Atwood Makinesi',
    titleEn: 'Atwood Machine',
    category: 'mechanics',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description: 'Atwood makinesi ve ivmeli hareket',
    descriptionEn: 'Atwood machine and accelerated motion',
    route: '/experiments/mechanics/atwood' as any,
  },
  {
    id: '8',
    title: 'Serbest Düşme',
    titleEn: 'Free Fall',
    category: 'mechanics',
    difficulty: 'Başlangıç',
    difficultyEn: 'Beginner',
    description: 'Yerçekimi etkisinde serbest düşme hareketi',
    descriptionEn: 'Free fall motion under gravity',
    route: '/experiments/mechanics/free-fall' as any,
  },
  {
    id: '9',
    title: 'İvme Deneyi',
    titleEn: 'Acceleration Experiment',
    category: 'basics',
    difficulty: 'Başlangıç',
    difficultyEn: 'Beginner',
    description:
      'İvmeli hareket, hız ve konum değişimini interaktif olarak gözlemleyin. Kinematik denklemleri deneysel olarak keşfedin.',
    descriptionEn:
      'Interactively observe accelerated motion, velocity, and position changes. Experimentally explore kinematic equations.',
    route: '/experiments/basics/acceleration' as any,
  },
  {
    id: '10',
    title: 'Vektör Toplama',
    titleEn: 'Vector Addition',
    category: 'mechanics',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description: 'Vektörlerin toplanması ve bileşke vektörün oluşumu',
    descriptionEn: 'Addition of vectors and formation of the resultant vector',
    route: '/experiments/mechanics/vector-addition' as any,
  },
  {
    id: '11',
    title: 'Moment Dengesi',
    titleEn: 'Moment Balance',
    category: 'mechanics',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description: 'Moment dengesi ve tork hesaplamaları',
    descriptionEn: 'Moment balance and torque calculations',
    route: '/experiments/mechanics/moment-balance' as any,
  },
  {
    id: '12',
    title: 'Mermi-Kutu Çarpışması',
    titleEn: 'Bullet-Box Collision',
    category: 'mechanics',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description: 'Mermi-kutu çarpışması ve momentum aktarımı',
    descriptionEn: 'Bullet-box collision and momentum transfer',
    route: '/experiments/mechanics/momentum-bullet' as any,
  },
  {
    id: '13',
    title: 'Çift Yarık Deneyi',
    titleEn: 'Double-Slit Experiment',
    category: 'waves',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description:
      'Bu interaktif deneyde ışığın dalga doğasını gözlemleyin. Işığın iki yarıktan geçişi sırasında oluşan girişim desenleri, dalga özelliklerini açıkça gösterir.',
    descriptionEn:
      'Observe the wave nature of light in this interactive experiment. The interference patterns formed when light passes through two slits clearly demonstrate its wave properties.',
    route: '/experiments/waves/double-slit',
  },
  {
    id: '14',
    title: 'Dalga Girişimi',
    titleEn: 'Wave Interference',
    category: 'waves',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description:
      'İki dalga kaynağının girişim desenlerini keşfedin. Yapıcı ve yıkıcı girişim, faz farkları ve süperpozisyon ilkesini görselleştirin. İnteraktif simülasyon ile dalga kaynaklarını hareket ettirin ve parametreleri değiştirin.',
    descriptionEn:
      'Explore interference patterns of two wave sources. Visualize constructive and destructive interference, phase differences and superposition principle. Move wave sources and change parameters with interactive simulation.',
    route: '/experiments/waves/wave-interference' as any,
  },
  {
    id: '15',
    title: 'Enine Dalga',
    titleEn: 'Transverse Wave',
    category: 'waves',
    difficulty: 'Başlangıç',
    difficultyEn: 'Beginner',
    description: 'Enine dalga hareketi ve özellikleri',
    descriptionEn: 'Transverse wave motion and properties',
    route: '/experiments/waves/transverse-wave' as any,
  },
  {
    id: '16',
    title: 'Doppler Etkisi',
    titleEn: 'Doppler Effect',
    category: 'waves',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description: 'Doppler etkisi ve frekans değişimi',
    descriptionEn: 'Doppler effect and frequency shift',
    route: '/experiments/waves/doppler-effect' as any,
  },
  {
    id: '17',
    title: 'Elektrik Alanı',
    titleEn: 'Electric Field',
    category: 'electricity',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description:
      'Elektrik yüklerinin oluşturduğu alan ve yükler arasındaki etkileşimleri gözlemleyin. Coulomb Yasası ve elektrik alan kavramlarını keşfedin.',
    descriptionEn:
      "Observe the field created by electric charges and the interactions between them. Explore Coulomb's Law and the concept of electric fields.",
    route: '/experiments/electric/electric-field' as any,
  },
  {
    id: '18',
    title: 'RLC Devre Laboratuvarı',
    titleEn: 'RLC Circuit Laboratory',
    category: 'electricity',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description:
      'Bu deneyde direnç, indüktans ve kapasitans arasındaki ilişkiyi keşfedin. Farklı parametreleri değiştirerek devrenin davranışını gözlemleyin ve rezonans frekansını bulun.',
    descriptionEn:
      'In this experiment, explore the relationship between resistance, inductance, and capacitance. Observe the behavior of the circuit by changing different parameters and find the resonance frequency.',
    route: '/experiments/electric/rc-circuit' as any,
  },
  {
    id: '19',
    title: 'Transformatör Deneyi',
    titleEn: 'Transformer Experiment',
    category: 'electricity',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description:
      'Transformatörlerin çalışma prensiplerini keşfedin ve parametreleri değiştirerek gerçek zamanlı sonuçları gözlemleyin. Elektromanyetik indüksiyon ve voltaj dönüştürme kavramlarını anlamak için interaktif bir deney.',
    descriptionEn:
      'Explore the working principles of transformers and observe real-time results by changing parameters. An interactive experiment to understand electromagnetic induction and voltage conversion concepts.',
    route: '/experiments/electric/transformer' as any,
  },
  {
    id: '20',
    title: 'Göreceli Hareket',
    titleEn: 'Relative Motion',
    category: 'basics',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description:
      "Farklı referans sistemlerinden hareketin nasıl göründüğünü keşfedin. Trenin içindeki gözlemci ile yerdeki gözlemci aynı hareketi farklı şekilde görür. Einstein'ın özel görelilik teorisinin temelini oluşturan bu kavramı interaktif olarak deneyimleyin.",
    descriptionEn:
      "Discover how motion appears from different reference frames. The observer inside the train and the observer on the ground see the same motion differently. Experience this concept that forms the foundation of Einstein's special relativity theory interactively.",
    route: '/experiments/basics/relative-motion' as any,
  },
  {
    id: '21',
    title: 'Coriolis Hareketi',
    titleEn: 'Coriolis Effect',
    category: 'basics',
    difficulty: 'İleri Seviye',
    difficultyEn: 'Advanced',
    description: 'Coriolis etkisi ve dönme referans çerçeveleri',
    descriptionEn: 'Coriolis effect and rotating reference frames',
    route: '/experiments/basics/coriolis-effect' as any,
  },
  {
    id: '22',
    title: 'Kaldırma Kuvveti',
    titleEn: 'Buoyancy',
    category: 'basics',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description: 'Kaldırma kuvveti ve yoğunluk etkisi',
    descriptionEn: 'Buoyancy and density effect',
    route: '/experiments/basics/buoyancy' as any,
  },
  {
    id: '23',
    title: 'Sıvı Basıncı',
    titleEn: 'Fluid Pressure',
    category: 'basics',
    difficulty: 'Başlangıç',
    difficultyEn: 'Beginner',
    description: 'Sıvı basıncının derinlik ve yoğunluğa bağlı değişimi',
    descriptionEn: 'Changes in fluid pressure with depth and density',
    route: '/experiments/basics/pressure' as any,
  },
  {
    id: '24',
    title: 'Ohm Yasası',
    titleEn: "Ohm's Law",
    category: 'electricity',
    difficulty: 'Başlangıç',
    difficultyEn: 'Beginner',
    description:
      'Elektrik devrelerinde akım, gerilim ve direnç arasındaki ilişkiyi keşfedin.',
    descriptionEn:
      'Explore the relationship between current, voltage, and resistance in electrical circuits.',
    route: '/experiments/electric/ohm-law' as any,
  },
  {
    id: '25',
    title: 'Manyetik Alan',
    titleEn: 'Magnetic Field',
    category: 'electricity',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description:
      'Manyetik alanın özelliklerini ve etkilerini interaktif olarak keşfedin. Farklı manyetik alan kaynakları ile deneyler yapın ve manyetik alan çizgilerini gözlemleyin.',
    descriptionEn:
      'Interactively explore the properties and effects of magnetic fields. Experiment with different magnetic field sources and observe magnetic field lines.',
    route: '/experiments/electric/magnetic-field' as any,
  },
  {
    id: '26',
    title: 'Fotoelektrik Olay',
    titleEn: 'Photoelectric Effect',
    category: 'modern',
    difficulty: 'Orta Seviye',
    difficultyEn: 'Intermediate',
    description:
      'Bu interaktif deneyde ışığın parçacık doğasını gözlemleyin. Metal yüzeydeki elektronların farklı dalga boylarındaki ışıkla etkileşimini inceleyerek, kuantum fiziğinin temel ilkelerini keşfedin.',
    descriptionEn:
      'In this interactive experiment, observe the particle nature of light. Explore the fundamental principles of quantum physics by examining the interaction of electrons on a metal surface with light of different wavelengths.',
    route: '/experiments/modern/photoelectric' as any,
  },
];

// Category translations for display
const categoryTranslations: Record<Category, string> = {
  mechanics: 'Mekanik',
  waves: 'Dalga ve Optik',
  electricity: 'Elektrik ve Manyetizma',
  basics: 'Temel Kavramlar',
  modern: 'Modern Fizik',
};

export default function ExperimentsScreen() {
  const searchParams = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    'all'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | 'all'
  >('all');

  // URL parametrelerinden kategori ve zorluk seviyesi bilgisini alarak state'i güncelle
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

    const difficultyParam = searchParams.selectedDifficulty as
      | string
      | undefined;
    if (
      difficultyParam &&
      (difficultyParam === 'Başlangıç' ||
        difficultyParam === 'Orta Seviye' ||
        difficultyParam === 'İleri Seviye')
    ) {
      setSelectedDifficulty(difficultyParam as Difficulty);
    }
  }, [searchParams]);

  // Kategori değiştirme fonksiyonu (URL güncelleme ile)
  const handleCategoryChange = (category: Category | 'all') => {
    setSelectedCategory(category);
    // URL'i güncelle
    if (category === 'all') {
      router.push('/(tabs)/experiments');
    } else {
      router.push(`/(tabs)/experiments?selectedCategory=${category}`);
    }
  };

  // Zorluk seviyesi değiştirme fonksiyonu (URL güncelleme ile)
  const handleDifficultyChange = (difficulty: Difficulty | 'all') => {
    setSelectedDifficulty(difficulty);
    // Mevcut kategori ile birlikte URL'i güncelle
    if (difficulty === 'all') {
      if (selectedCategory === 'all') {
        router.push('/(tabs)/experiments');
      } else {
        router.push(`/(tabs)/experiments?selectedCategory=${selectedCategory}`);
      }
    } else {
      if (selectedCategory === 'all') {
        router.push(`/(tabs)/experiments?selectedDifficulty=${difficulty}`);
      } else {
        router.push(
          `/(tabs)/experiments?selectedCategory=${selectedCategory}&selectedDifficulty=${difficulty}`
        );
      }
    }
  };

  // Filter experiments based on search, category, and difficulty
  const filteredExperiments = experiments.filter((experiment) => {
    const matchesSearch =
      experiment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || experiment.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      experiment.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // 🔧 ROUTE FIX: Handle experiment navigation with router.push
  const handleExperimentPress = (experiment: Experiment) => {
    try {
      console.log('Navigating to:', experiment.route);
      router.push(experiment.route as any);
    } catch (error) {
      console.error('Navigation Error:', error);
      // Fallback navigation
      const routePath = experiment.route.toString();
      router.push(routePath as any);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fizik Deneyleri</Text>
        <Text style={styles.subtitle}>
          Tüm deneyler kategorilere ve zorluk seviyelerine göre düzenlenmiştir
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Deney ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

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
              Tümü
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
                {categoryTranslations[category]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.difficultyFiltersContainer}>
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            selectedDifficulty === 'all' && styles.difficultyButtonActive,
          ]}
          onPress={() => handleDifficultyChange('all')}
        >
          <Text style={styles.difficultyButtonText}>Tüm Seviyeler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.difficultyButton,
            selectedDifficulty === 'Başlangıç' && styles.difficultyButtonActive,
          ]}
          onPress={() => handleDifficultyChange('Başlangıç')}
        >
          <Text style={styles.difficultyButtonText}>Başlangıç</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.difficultyButton,
            selectedDifficulty === 'Orta Seviye' &&
              styles.difficultyButtonActive,
          ]}
          onPress={() => handleDifficultyChange('Orta Seviye')}
        >
          <Text style={styles.difficultyButtonText}>Orta Seviye</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.difficultyButton,
            selectedDifficulty === 'İleri Seviye' &&
              styles.difficultyButtonActive,
          ]}
          onPress={() => handleDifficultyChange('İleri Seviye')}
        >
          <Text style={styles.difficultyButtonText}>İleri Seviye</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.experimentsContainer}>
        {filteredExperiments.length > 0 ? (
          filteredExperiments.map((experiment) => (
            <TouchableOpacity
              key={experiment.id}
              style={styles.experimentCard}
              onPress={() => handleExperimentPress(experiment)}
            >
              <View style={styles.experimentInfo}>
                <Text style={styles.experimentTitle}>{experiment.title}</Text>
                <Text style={styles.experimentCategory}>
                  {categoryTranslations[experiment.category]}
                </Text>
                <Text style={styles.experimentDescription}>
                  {experiment.description}
                </Text>
                <View style={styles.experimentFooter}>
                  <Text
                    style={[
                      styles.experimentDifficulty,
                      experiment.difficulty === 'Başlangıç' &&
                        styles.beginnerDifficulty,
                      experiment.difficulty === 'Orta Seviye' &&
                        styles.intermediateDifficulty,
                      experiment.difficulty === 'İleri Seviye' &&
                        styles.advancedDifficulty,
                    ]}
                  >
                    {experiment.difficulty}
                  </Text>
                  <View style={styles.startButton}>
                    <Text style={styles.startButtonText}>Deneyi Başlat</Text>
                    <ArrowRight size={16} color="#3498db" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              Arama kriterlerinize uygun deney bulunamadı.
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
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
  difficultyFiltersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  difficultyButtonActive: {
    backgroundColor: '#3498db',
  },
  difficultyButtonText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  experimentsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  experimentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  experimentInfo: {
    padding: 15,
  },
  experimentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  experimentCategory: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  experimentDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    lineHeight: 20,
  },
  experimentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experimentDifficulty: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    color: '#7f8c8d',
  },
  beginnerDifficulty: {
    backgroundColor: '#e8f5e9',
    color: '#388e3c',
  },
  intermediateDifficulty: {
    backgroundColor: '#fff8e1',
    color: '#ffa000',
  },
  advancedDifficulty: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
    marginRight: 5,
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
