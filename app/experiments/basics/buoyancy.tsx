import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ExperimentLayout from '../../../components/ExperimentLayout';
import BuoyancySimulation from './components/BuoyancySimulation';
import DensityControls from './components/DensityControls';
import { View } from 'react-native';
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

// Sıvı türleri ve özellikleri
const LIQUID_TYPES = {
  WATER: { density: 1000, color: 'rgba(173, 216, 230, 0.8)', name: 'Su' },
  OIL: { density: 800, color: 'rgba(255, 215, 0, 0.6)', name: 'Yağ' },
  MERCURY: { density: 13534, color: 'rgba(192, 192, 192, 0.9)', name: 'Cıva' },
  GLYCERIN: {
    density: 1260,
    color: 'rgba(255, 182, 193, 0.7)',
    name: 'Gliserin',
  },
} as const;

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
  const [isRunning, setIsRunning] = useState(false);
  const [liquidDensity, setLiquidDensity] = useState<number>(
    PHYSICS_CONSTANTS.WATER_DENSITY
  );
  const [liquidColor, setLiquidColor] = useState<string>(
    LIQUID_TYPES.WATER.color
  );
  const [selectedLiquidType, setSelectedLiquidType] =
    useState<keyof typeof LIQUID_TYPES>('WATER');
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);

  // Başlangıç nesneleri - memoized
  const initialObjects = useMemo<ObjectState[]>(
    () => [
      {
        id: 1,
        density: MATERIAL_DENSITIES.CORK,
        color: '#FF6B6B',
        position: 0,
        velocity: 0,
        size: 0.8,
        shape: 'circle',
        label: 'Mantar (240 kg/m³)',
        mass: 0.1,
        volume: 0.001,
      },
      {
        id: 2,
        density: MATERIAL_DENSITIES.WOOD,
        color: '#4ECDC4',
        position: 0,
        velocity: 0,
        size: 1,
        shape: 'square',
        label: 'Tahta (600 kg/m³)',
        mass: 0.15,
        volume: 0.001,
      },
      {
        id: 3,
        density: MATERIAL_DENSITIES.IRON,
        color: '#45B7D1',
        position: 0,
        velocity: 0,
        size: 0.6,
        shape: 'triangle',
        label: 'Demir (7874 kg/m³)',
        mass: 0.2,
        volume: 0.0008,
      },
    ],
    []
  );

  const [objects, setObjects] = useState<ObjectState[]>(initialObjects);

  // Fizik hesaplamaları - optimize edilmiş
  const calculateBuoyantForce = useCallback(
    (objectDensity: number, volume: number, liquidDens: number) => {
      return liquidDens * PHYSICS_CONSTANTS.GRAVITY * volume;
    },
    []
  );

  const calculateWeight = useCallback((mass: number) => {
    return mass * PHYSICS_CONSTANTS.GRAVITY;
  }, []);

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
          const weight = calculateWeight(obj.mass);
          const netForce = buoyantForce - weight;
          const acceleration = netForce / obj.mass;

          // Yeni hız ve pozisyon hesaplama (gerçek fizik)
          let newVelocity = obj.velocity + acceleration * (deltaTime / 1000);
          let newPosition =
            obj.position + newVelocity * (deltaTime / 1000) * 100;

          // Sınır kontrolü ve sürtünme
          const friction = 0.95;
          if (newPosition > 85) {
            newPosition = 85;
            newVelocity = Math.max(0, newVelocity * friction);
          } else if (newPosition < 15) {
            newPosition = 15;
            newVelocity = Math.min(0, newVelocity * friction);
          }

          // Denge pozisyonu hesaplama
          const equilibriumPosition =
            obj.density < liquidDensity
              ? 75
              : obj.density > liquidDensity
              ? 25
              : 50;

          // Denge yakınında ise stabilize et
          if (
            Math.abs(newPosition - equilibriumPosition) <
            PHYSICS_CONSTANTS.POSITION_TOLERANCE
          ) {
            newPosition = equilibriumPosition;
            newVelocity *= 0.8;
          }

          return {
            ...obj,
            position: newPosition,
            velocity: newVelocity * friction,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(updateObjectPositions);
    },
    [isRunning, liquidDensity, calculateBuoyantForce, calculateWeight]
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

    // Sıvı rengini yoğunluğa göre hesapla
    const densityRatio = Math.min(value / PHYSICS_CONSTANTS.MAX_DENSITY, 1);
    const opacity = Math.min(0.3 + densityRatio * 0.6, 0.9);
    const blue = Math.max(255 - densityRatio * 80, 175);
    const newColor = `rgba(173, 216, ${blue}, ${opacity})`;
    setLiquidColor(newColor);
  }, []);

  // Sıvı türü değişikliği
  const handleLiquidTypeChange = useCallback(
    (liquidType: keyof typeof LIQUID_TYPES) => {
      const liquid = LIQUID_TYPES[liquidType];
      setSelectedLiquidType(liquidType);
      setLiquidDensity(liquid.density);
      setLiquidColor(liquid.color);
    },
    []
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
  }, []);

  // Malzeme adını yoğunluğa göre belirle - memoized
  const getMaterialName = useMemo(
    () =>
      (density: number): string => {
        if (density < 100) return 'Köpük';
        if (density < 300) return 'Mantar';
        if (density < 800) return 'Tahta';
        if (density < 1000) return 'Buz';
        if (density < 1500) return 'Plastik';
        if (density < 3000) return 'Alüminyum';
        if (density < 5000) return 'Cam';
        if (density < 8000) return 'Demir';
        if (density < 12000) return 'Kurşun';
        return 'Altın';
      },
    []
  );

  // Simülasyonu sıfırla - optimized
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setLiquidDensity(PHYSICS_CONSTANTS.WATER_DENSITY);
    setLiquidColor(LIQUID_TYPES.WATER.color);
    setSelectedLiquidType('WATER');
    setObjects((prevObjects) =>
      prevObjects.map((obj) => ({
        ...obj,
        position: 0,
        velocity: 0,
      }))
    );
  }, []);

  // Simülasyon toggle - optimized
  const handleToggleSimulation = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  return (
    <ExperimentLayout
      title="Kaldırma Kuvveti Deneyi"
      titleEn="Buoyancy Experiment"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Bu gelişmiş deneyde, Arşimet prensibini ve kaldırma kuvvetini gerçekçi fizik simülasyonu ile gözlemleyeceğiz. Farklı yoğunluktaki cisimlerin çeşitli sıvılar içerisindeki davranışlarını, gerçek zamanlı fizik hesaplamaları ile inceleyeceğiz. Hız, ivme ve denge pozisyonları hesaplanır."
      descriptionEn="In this advanced experiment, we will observe Archimedes' principle and buoyant force with realistic physics simulation. We will examine the behavior of objects with different densities in various liquids with real-time physics calculations including velocity, acceleration and equilibrium positions."
      isRunning={isRunning}
      onToggleSimulation={handleToggleSimulation}
      onReset={handleReset}
    >
      <View style={containerStyles.root}>
        <View style={containerStyles.content}>
          <View style={containerStyles.simulationCard}>
            <BuoyancySimulation
              objects={objects}
              liquidColor={liquidColor}
              liquidDensity={liquidDensity}
            />
          </View>
          <View style={containerStyles.controlsCard}>
            <DensityControls
              liquidDensity={liquidDensity}
              objects={objects}
              onLiquidDensityChange={handleLiquidDensityChange}
              onObjectDensityChange={handleObjectDensityChange}
            />
          </View>
        </View>
      </View>
    </ExperimentLayout>
  );
}

// Optimize edilmiş stiller
const containerStyles = {
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  simulationCard: {
    flex: 2,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controlsCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
} as const;
