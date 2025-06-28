import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ExperimentLayout from '../../../components/ExperimentLayout';
import BuoyancySimulation from './components/BuoyancySimulation';
import DensityControls from './components/DensityControls';
import { useLanguage } from '../../../components/LanguageContext';
import { View, ScrollView, Dimensions } from 'react-native';
import './styles/buoyancy.css';

// Fizik sabitleri
const PHYSICS_CONSTANTS = {
  WATER_DENSITY: 1000, // kg/m³
  GRAVITY: 9.81, // m/s²
  ANIMATION_INTERVAL: 16, // ~60fps
  POSITION_TOLERANCE: 0.1,
  MAX_DENSITY: 15000,
  MIN_DENSITY: 100,
} as const;

// Sıvı türleri ve özellikleri - dil desteği için fonksiyon
const getLiquidTypes = (t: (tr: string, en: string) => string) => ({
  WATER: { density: 1000, color: 'rgba(173, 216, 230, 0.8)', name: t('Su', 'Water') },
  OIL: { density: 800, color: 'rgba(255, 215, 0, 0.6)', name: t('Yağ', 'Oil') },
  MERCURY: { density: 13534, color: 'rgba(192, 192, 192, 0.9)', name: t('Cıva', 'Mercury') },
  GLYCERIN: {
    density: 1260,
    color: 'rgba(255, 182, 193, 0.7)',
    name: t('Gliserin', 'Glycerin'),
  },
} as const);

// Önceden tanımlı malzeme yoğunlukları
const MATERIAL_DENSITIES = {
  FOAM: 50,
  CORK: 240,
  WOOD: 600,
  ICE: 917,
  WATER: 1000,
  ALUMINUM: 2700,
  GLASS: 2500,
  IRON: 7874,
  LEAD: 11340,
  GOLD: 19300,
} as const;

interface ObjectState {
  id: number;
  density: number;
  color: string;
  position: number;
  velocity: number;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  label: string;
  mass: number;
  volume: number;
}

export default function BuoyancyExperiment() {
  const { t } = useLanguage();
  
  // Dil desteği ile sıvı türlerini al
  const LIQUID_TYPES = useMemo(() => getLiquidTypes(t), [t]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [liquidDensity, setLiquidDensity] = useState<number>(
    PHYSICS_CONSTANTS.WATER_DENSITY
  );
  const [liquidColor, setLiquidColor] = useState<string>(
    LIQUID_TYPES.WATER.color
  );
  const [selectedLiquidType, setSelectedLiquidType] =
    useState<keyof typeof LIQUID_TYPES>('WATER');
  const animationFrameRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);

  // Başlangıç nesneleri - memoized with language support
  const initialObjects = useMemo<ObjectState[]>(
    () => [
      {
        id: 1,
        density: MATERIAL_DENSITIES.CORK,
        color: '#FF6B6B',
        position: 50, // Merkez pozisyondan başla
        velocity: 0,
        size: 0.8,
        shape: 'circle',
        label: `${t('Mantar', 'Cork')} (240 kg/m³)`,
        mass: MATERIAL_DENSITIES.CORK * 0.001, // yoğunluk × hacim
        volume: 0.001,
      },
      {
        id: 2,
        density: MATERIAL_DENSITIES.WOOD,
        color: '#4ECDC4',
        position: 50, // Merkez pozisyondan başla
        velocity: 0,
        size: 1,
        shape: 'square',
        label: `${t('Tahta', 'Wood')} (600 kg/m³)`,
        mass: MATERIAL_DENSITIES.WOOD * 0.001, // yoğunluk × hacim
        volume: 0.001,
      },
      {
        id: 3,
        density: MATERIAL_DENSITIES.IRON,
        color: '#45B7D1',
        position: 50, // Merkez pozisyondan başla
        velocity: 0,
        size: 0.6,
        shape: 'triangle',
        label: `${t('Demir', 'Iron')} (7874 kg/m³)`,
        mass: MATERIAL_DENSITIES.IRON * 0.0008, // yoğunluk × hacim
        volume: 0.0008,
      },
    ],
    [t]
  );

  const [objects, setObjects] = useState<ObjectState[]>(initialObjects);

  // Sayfa yüklendiğinde simülasyonu otomatik başlat
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRunning(true);
    }, 500); // 500ms sonra başlat

    return () => clearTimeout(timer);
  }, []);

  // Fizik hesaplamaları - Arşimet prensibine göre düzeltilmiş
  const calculateBuoyantForce = useCallback(
    (objectDensity: number, volume: number, liquidDens: number) => {
      // Arşimet prensibi: Kaldırma kuvveti = sıvının yer değiştiren hacminin ağırlığı
      // F_buoyant = ρ_liquid × V_object × g (cisim tamamen sıvı içindeyken)
      
      // Cisim tamamen sıvı içindeyken maksimum kaldırma kuvveti
      return liquidDens * PHYSICS_CONSTANTS.GRAVITY * volume;
    },
    []
  );

  const calculateWeight = useCallback((density: number, volume: number) => {
    // Ağırlık = kütle × g = yoğunluk × hacim × g
    return density * volume * PHYSICS_CONSTANTS.GRAVITY;
  }, []);

  // Denge pozisyonu hesaplama
  const calculateEquilibriumPosition = useCallback(
    (objectDensity: number, liquidDens: number) => {
      const densityRatio = objectDensity / liquidDens;
      
      if (densityRatio < 0.9) {
        // Yüzer: Büyük alanda güvenli (60-70% arası)
        return 65 + (0.9 - densityRatio) * 2; // Maksimum 70% pozisyon
      } else if (densityRatio > 1.1) {
        // Batar: Büyük alanda güvenli (25-35% arası)
        return 35 - (densityRatio - 1.1) * 1; // Minimum 25% pozisyon
      } else {
        // Askıda kalır: Ortada (45-55% arası)
        return 50 + (densityRatio - 1) * 5;
      }
    },
    []
  );

  // Pozisyon hesaplama - gerçekçi fizik simülasyonu
  const updateObjectPositions = useCallback(
    (timestamp: number) => {
      if (!isRunning) return;

      const deltaTime = timestamp - lastUpdateTimeRef.current;
      if (deltaTime < PHYSICS_CONSTANTS.ANIMATION_INTERVAL) {
        animationFrameRef.current = requestAnimationFrame(
          updateObjectPositions
        );
        return;
      }
      lastUpdateTimeRef.current = timestamp;

      setObjects((prevObjects) =>
        prevObjects.map((obj) => {
          const buoyantForce = calculateBuoyantForce(
            obj.density,
            obj.volume,
            liquidDensity
          );
          const weight = calculateWeight(obj.density, obj.volume);
          const netForce = buoyantForce - weight;
          
          // Newton'un 2. yasası: F = ma, dolayısıyla a = F/m
          const mass = obj.density * obj.volume;
          const acceleration = netForce / mass;

          // Sıvı direnci (viscosity) - yoğunluğa bağlı
          const viscosity = Math.sqrt(liquidDensity / 1000); // Daha gerçekçi viskozite
          const dragCoefficient = 0.5 * viscosity; // Basitleştirilmiş sürükleme
          const dragForce = -dragCoefficient * obj.velocity;
          const totalAcceleration = acceleration + (dragForce / mass);

          // Yeni hız hesaplama
          let newVelocity = obj.velocity + totalAcceleration * (deltaTime / 1000);
          
          // Denge pozisyonunu hesapla
          const equilibriumPos = calculateEquilibriumPosition(obj.density, liquidDensity);
          
          // Pozisyon güncelleme - denge pozisyonuna doğru hareket
          const positionDiff = equilibriumPos - obj.position;
          const dampingFactor = 0.95; // Salınımı azalt
          
          let newPosition = obj.position + newVelocity * (deltaTime / 1000) * 30; // Daha yavaş hareket
          
          // Denge pozisyonuna yakınsa stabilize et
          if (Math.abs(positionDiff) < 5) {
            newPosition += positionDiff * 0.1; // Denge pozisyonuna çek
            newVelocity *= dampingFactor; // Hızı azalt
          }

          // Sınır kontrolü - su tankının alt ve üst sınırları
          const friction = 0.5; // Çarpışma kaybı
          if (newPosition > 95) { // Üst sınır (yüzey üstü)
            newPosition = 95;
            newVelocity = -Math.abs(newVelocity) * friction;
          } else if (newPosition < 5) { // Alt sınır (tank tabanı)
            newPosition = 5;
            newVelocity = Math.abs(newVelocity) * friction;
          }

          // Terminal hız kontrolü - çok yavaş hareket ediyorsa durdur
          if (Math.abs(newVelocity) < 0.05 && Math.abs(totalAcceleration) < 0.001) {
            newVelocity = 0;
          }

          return {
            ...obj,
            position: Math.max(5, Math.min(95, newPosition)),
            velocity: newVelocity,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(updateObjectPositions);
    },
    [isRunning, liquidDensity, calculateBuoyantForce, calculateWeight, calculateEquilibriumPosition]
  );

  // Animasyon başlatma/durdurma
  useEffect(() => {
    if (isRunning) {
      lastUpdateTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateObjectPositions);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, updateObjectPositions]);

  // Sıvı yoğunluğu değişikliğini işle - optimized
  const handleLiquidDensityChange = useCallback((value: number) => {
    setLiquidDensity(value);
    
    // Simülasyonu otomatik başlat
    if (!isRunning) {
      setIsRunning(true);
    }

    // Sıvı rengini yoğunluğa göre hesapla
    const densityRatio = Math.min(value / PHYSICS_CONSTANTS.MAX_DENSITY, 1);
    const opacity = Math.min(0.3 + densityRatio * 0.6, 0.9);
    const blue = Math.max(255 - densityRatio * 80, 175);
    const newColor = `rgba(173, 216, ${blue}, ${opacity})`;
    setLiquidColor(newColor);
  }, [isRunning]);

  // Sıvı türü değişikliği
  const handleLiquidTypeChange = useCallback(
    (liquidType: keyof typeof LIQUID_TYPES) => {
      const liquid = LIQUID_TYPES[liquidType];
      setSelectedLiquidType(liquidType);
      setLiquidDensity(liquid.density);
      setLiquidColor(liquid.color);
      
      // Simülasyonu otomatik başlat
      if (!isRunning) {
        setIsRunning(true);
      }
    },
    [isRunning]
  );

  // Malzeme adını yoğunluğa göre belirle - memoized with language support
  const getMaterialName = useMemo(
    () =>
      (density: number): string => {
        if (density < 100) return t('Köpük', 'Foam');
        if (density < 300) return t('Mantar', 'Cork');
        if (density < 800) return t('Tahta', 'Wood');
        if (density < 1000) return t('Buz', 'Ice');
        if (density < 1500) return t('Plastik', 'Plastic');
        if (density < 3000) return t('Alüminyum', 'Aluminum');
        if (density < 5000) return t('Cam', 'Glass');
        if (density < 8000) return t('Demir', 'Iron');
        if (density < 12000) return t('Kurşun', 'Lead');
        return t('Altın', 'Gold');
      },
    [t]
  );

  // Nesne yoğunluğu değişikliğini işle - optimized
  const handleObjectDensityChange = useCallback((id: number, value: number) => {
    setObjects((prev) =>
      prev.map((obj) =>
        obj.id === id
          ? {
              ...obj,
              density: value,
              label: `${getMaterialName(value)} (${value} kg/m³)`,
              mass: value * obj.volume, // Kütleyi güncelle
            }
          : obj
      )
    );
    
    // Simülasyonu otomatik başlat
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [getMaterialName, isRunning]);

  // Simülasyonu sıfırla - optimized
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setLiquidDensity(PHYSICS_CONSTANTS.WATER_DENSITY);
    setLiquidColor(LIQUID_TYPES.WATER.color);
    setSelectedLiquidType('WATER');
    setObjects(initialObjects.map((obj) => ({
      ...obj,
      position: 50,
      velocity: 0,
    })));
  }, [initialObjects]);

  // Simülasyon toggle - optimized
  const handleToggleSimulation = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  // Ekran boyutlarını al
  const screenHeight = Dimensions.get('window').height;
  const isSmallScreen = screenHeight < 700;
  
  return (
    <ExperimentLayout
      title={t('Kaldırma Kuvveti Deneyi', 'Buoyancy Experiment')}
      titleEn="Buoyancy Experiment"
      difficulty={t('Orta Seviye', 'Intermediate')}
      difficultyEn="Intermediate"
      description={`${t('Bu gelişmiş deneyde, Arşimet prensibini ve kaldırma kuvvetini gerçekçi fizik simülasyonu ile gözlemleyeceğiz', 'In this advanced experiment, we will observe Archimedes\' principle and buoyant force with realistic physics simulation')}. ${t('Farklı yoğunluktaki cisimlerin çeşitli sıvılar içerisindeki davranışlarını, gerçek zamanlı fizik hesaplamaları ile inceleyeceğiz', 'We will examine the behavior of objects with different densities in various liquids with real-time physics calculations')}. ${t('Hız, ivme ve denge pozisyonları hesaplanır', 'Velocity, acceleration and equilibrium positions are calculated')}.

🎯 **${t('ARŞIMET PRENSİBİ', 'ARCHIMEDES\' PRINCIPLE')}**
${t('Bir sıvıya daldırılan cismin aldığı kaldırma kuvveti, cismin yer değiştirdiği sıvının ağırlığına eşittir', 'The buoyant force acting on an object immersed in a fluid equals the weight of the fluid displaced by the object')}.

📊 **${t('FİZİK HESAPLAMALARI', 'PHYSICS CALCULATIONS')}:**
• **${t('Kaldırma Kuvveti', 'Buoyant Force')}**: F_b = ρ_sıvı × V_cisim × g
• **${t('Ağırlık', 'Weight')}**: W = ρ_cisim × V_cisim × g  
• **${t('Net Kuvvet', 'Net Force')}**: F_net = F_b - W
• **${t('İvme', 'Acceleration')}**: a = F_net / m

🔬 **${t('GÖZLEMLENECEK DURUMLAR', 'OBSERVABLE CASES')}:**
• **${t('Yüzme', 'Floating')}**: ρ_cisim < ρ_sıvı → ${t('Cisim yüzer', 'Object floats')}
• **${t('Batma', 'Sinking')}**: ρ_cisim > ρ_sıvı → ${t('Cisim batar', 'Object sinks')}  
• **${t('Askıda Kalma', 'Neutral Buoyancy')}**: ρ_cisim = ρ_sıvı → ${t('Cisim askıda kalır', 'Object remains suspended')}

🎮 **${t('İNTERAKTİF ÖZELLİKLER', 'INTERACTIVE FEATURES')}:**
• ${t('3 farklı şekilde cisim (daire, kare, üçgen)', '3 different object shapes (circle, square, triangle)')}
• ${t('6 farklı sıvı türü seçeneği', '6 different liquid type options')}
• ${t('0-25000 kg/m³ yoğunluk aralığı', '0-25000 kg/m³ density range')}
• ${t('Gerçek zamanlı fizik simülasyonu', 'Real-time physics simulation')}
• ${t('Hassas sayısal kontroller', 'Precise numerical controls')}`}
      descriptionEn="In this advanced experiment, we will observe Archimedes' principle and buoyant force with realistic physics simulation. We will examine the behavior of objects with different densities in various liquids with real-time physics calculations including velocity, acceleration and equilibrium positions."
      isRunning={isRunning}
      onToggleSimulation={handleToggleSimulation}
      onReset={handleReset}
    >
      <ScrollView 
        style={containerStyles.root}
        contentContainerStyle={containerStyles.scrollContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={false}
      >
        <View style={[containerStyles.simulationCard, isSmallScreen && containerStyles.simulationCardSmall]}>
          <BuoyancySimulation
            objects={objects}
            liquidColor={liquidColor}
            liquidDensity={liquidDensity}
          />
        </View>
        <View style={[containerStyles.controlsCard, isSmallScreen && containerStyles.controlsCardSmall]}>
          <DensityControls
            liquidDensity={liquidDensity}
            objects={objects}
            onLiquidDensityChange={handleLiquidDensityChange}
            onObjectDensityChange={handleObjectDensityChange}
          />
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

// Optimize edilmiş stiller
const containerStyles = {
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40, // Alt boşluk
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  simulationCard: {
    minHeight: 500,
    height: 500,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'visible',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  simulationCardSmall: {
    minHeight: 400,
    height: 400,
  },
  controlsCard: {
    minHeight: 350,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controlsCardSmall: {
    minHeight: 300,
  },
} as const;
