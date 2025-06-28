import React, { useRef, useMemo, useCallback, memo } from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { useIsMobile } from '../hooks/use-mobile';
import { useLanguage } from '../../../../components/LanguageContext';
import { cn } from '../lib/utils';

interface ObjectProps {
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

interface BuoyancySimulationProps {
  objects: ObjectProps[];
  liquidColor: string;
  liquidDensity: number;
}

// Performans sabitleri
const PERFORMANCE_CONSTANTS = {
  SHAPE_CACHE_SIZE: 50,
  RENDER_THRESHOLD: 0.1,
  ANIMATION_PRECISION: 2,
} as const;

// Shape cache için memoized factory
const ShapeFactory = memo<{
  shape: string;
  color: string;
  size: number;
  isMobile: boolean;
}>(({ shape, color, size, isMobile }) => {
  const baseSize = isMobile ? 40 : 60;
  const shapeSize = baseSize * size;

  const commonStyles = useMemo(
    () => ({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      transform: [{ scale: 1 }],
    }),
    []
  );

  switch (shape) {
    case 'circle':
      return (
        <View
          style={{
            width: shapeSize,
            height: shapeSize,
            borderRadius: shapeSize / 2,
            backgroundColor: color,
            ...commonStyles,
          }}
        />
      );
    case 'square':
      return (
        <View
          style={{
            width: shapeSize,
            height: shapeSize,
            borderRadius: 8,
            backgroundColor: color,
            ...commonStyles,
          }}
        />
      );
    case 'triangle':
      return (
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: shapeSize / 2,
            borderRightWidth: shapeSize / 2,
            borderBottomWidth: shapeSize,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
            ...commonStyles,
          }}
        />
      );
    default:
      return null;
  }
});

// Optimized object renderer
const ObjectRenderer = memo<{
  obj: ObjectProps;
  liquidDensity: number;
  isMobile: boolean;
}>(({ obj, liquidDensity, isMobile }) => {
  const { t } = useLanguage();
  // Animasyon sınıfını hesapla - memoized
  const animationClass = useMemo(() => {
    const densityDiff = obj.density - liquidDensity;
    const threshold = liquidDensity * 0.05; // %5 tolerans

    if (densityDiff < -threshold) return 'animate-float';
    if (densityDiff > threshold) return 'animate-sink';
    return 'animate-equilibrium';
  }, [obj.density, liquidDensity]);

  // Transform hesaplaması - optimize
  const transformStyle = useMemo(() => {
    // Pozisyonu tersine çevir: 0 = en alt, 100 = en üst
    const invertedPosition = 100 - obj.position;
    
    // Sıvı yoğunluğuna göre batma derinliği hesapla
    const densityRatio = obj.density / liquidDensity;
    let additionalSinkOffset = 0;
    
    if (densityRatio > 1.1) {
      // Yoğun cisimler daha çok batar
      additionalSinkOffset = (densityRatio - 1) * 5;
    } else if (densityRatio < 0.9) {
      // Hafif cisimler daha çok yüzer
      additionalSinkOffset = -(1 - densityRatio) * 8;
    }

    return [{ 
      translateY: additionalSinkOffset 
    }];
  }, [obj.density, liquidDensity]);

  // Label container styles - memoized
  const labelContainerStyle = useMemo(
    (): ViewStyle => ({
      marginTop: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    }),
    []
  );

  // Position styles - memoized (React Native uyumlu)
  const positionStyle = useMemo((): ViewStyle => {
    const leftPercent = 15 + (obj.id - 1) * 25;
    
    // Pozisyonu yüzde olarak hesapla (0-100 arası)
    // position: 10 = alt sınır, 90 = üst sınır (su yüzeyi)
    const bottomPercent = Math.max(5, Math.min(95, obj.position));

    return {
      position: 'absolute',
      left: `${leftPercent}%`,
      bottom: `${bottomPercent}%`,
      alignItems: 'center',
      zIndex: 10,
      transform: transformStyle,
    };
  }, [obj.id, obj.position, transformStyle]);

  return (
    <View style={positionStyle} className={cn('object', animationClass)}>
      <ShapeFactory
        shape={obj.shape}
        color={obj.color}
        size={obj.size}
        isMobile={isMobile}
      />
      <View style={labelContainerStyle}>
        <Text
          style={{
            fontSize: isMobile ? 10 : 12,
            color: '#1a1a1a',
            fontWeight: '500',
            textAlign: 'center',
          }}
        >
          {obj.label}
        </Text>
      </View>
    </View>
  );
});

// Liquid waves component - Web için optimize edilmiş
const LiquidWaves = memo(() => {
  return (
    <>
      <View className="liquid-wave" style={{ top: '5%' }} />
      <View className="liquid-wave" style={{ top: '15%' }} />
      <View className="liquid-wave" style={{ top: '25%' }} />
      <View className="liquid-wave" style={{ top: '35%' }} />
    </>
  );
});

// Ana component - Performance optimized
const BuoyancySimulation: React.FC<BuoyancySimulationProps> = memo(
  ({ objects, liquidColor, liquidDensity }) => {
    const isMobile = useIsMobile();
    const { t } = useLanguage();

    // Liquid container styles - memoized
    const liquidContainerStyle = useMemo(
      (): ViewStyle => ({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: liquidColor,
      }),
      [liquidColor]
    );

    // Water surface indicator - memoized
    const surfaceIndicatorStyle = useMemo(
      (): ViewStyle => ({
        position: 'absolute',
        bottom: '67%', // Yüzen cisimler 60-70% arasında olduğu için su yüzeyi ortası
        left: 0,
        right: 0,
        height: 4, // Biraz daha kalın çizgi
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      }),
      []
    );

    // Density indicator - memoized
    const densityIndicatorStyle = useMemo(
      (): ViewStyle => ({
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
      }),
      []
    );

    // Render objects with performance optimization
    const renderedObjects = useMemo(
      () =>
        objects.map((obj) => (
          <ObjectRenderer
            key={obj.id}
            obj={obj}
            liquidDensity={liquidDensity}
            isMobile={isMobile}
          />
        )),
      [objects, liquidDensity, isMobile]
    );

    // Liquid type indicator
    const getLiquidType = useCallback((density: number): string => {
      if (density < 900) return t('Yağ', 'Oil');
      if (density < 1100) return t('Su', 'Water');
      if (density < 1300) return t('Gliserin', 'Glycerin');
      if (density > 13000) return t('Cıva', 'Mercury');
      return t('Sıvı', 'Liquid');
    }, [t]);

    // Physics info overlay style
    const physicsInfoStyle = useMemo(
      (): ViewStyle => ({
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        elevation: 1,
      }),
      []
    );

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            minHeight: isMobile ? 400 : 500, // Mobilde daha küçük
            height: '100%', // Tam yükseklik kullan
            backgroundColor: '#f0f9ff',
            borderRadius: 12,
            overflow: 'visible', // 'hidden' yerine 'visible' - cisimler çerçeve dışına çıkabilir
            position: 'relative',
          }}
          className="buoyancy-container"
        >
          {/* Sıvı konteyneri */}
          <View style={liquidContainerStyle} className="liquid-container">
            <LiquidWaves />
          </View>

          {/* Nesneler */}
          {renderedObjects}

          {/* Su yüzeyi göstergesi */}
          <View style={surfaceIndicatorStyle} />

          {/* Sıvı yoğunluğu göstergesi */}
          <View style={densityIndicatorStyle}>
            <Text
              style={{
                fontSize: isMobile ? 12 : 14,
                color: '#1a1a1a',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              {getLiquidType(liquidDensity)}: {liquidDensity} kg/m³
            </Text>
          </View>

          {/* Physics info overlay */}
          <View style={physicsInfoStyle}>
            <Text
              style={{
                fontSize: 10,
                color: '#666',
                fontWeight: '500',
              }}
            >
              {t('Arşimet Prensibi', 'Archimedes\' Principle')}
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

// Display name for debugging
BuoyancySimulation.displayName = 'BuoyancySimulation';
ShapeFactory.displayName = 'ShapeFactory';
ObjectRenderer.displayName = 'ObjectRenderer';
LiquidWaves.displayName = 'LiquidWaves';

export default BuoyancySimulation;
