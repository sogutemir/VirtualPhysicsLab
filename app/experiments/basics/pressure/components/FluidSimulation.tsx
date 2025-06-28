import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageContext';
import {
  calculatePressure,
  calculateBuoyantForce,
  determineFloatStatus,
  calculateSubmergedPercentage,
  formatPressure,
  formatWithUnits,
} from '../utils/pressureCalculator';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
} from 'react-native-reanimated';

interface FluidSimulationProps {
  fluidDensity: number;
  objectDensity: number;
  objectHeight: number;
  objectWidth: number;
  objectDepth: number;
  containerHeight: number;
}

const FluidSimulation: React.FC<FluidSimulationProps> = ({
  fluidDensity,
  objectDensity,
  objectHeight,
  objectWidth,
  objectDepth,
  containerHeight,
}) => {
  const { t } = useLanguage();
  const [pressurePoints, setPressurePoints] = useState<
    Array<{ depth: number; pressure: number }>
  >([]);
  const screenWidth = Dimensions.get('window').width;

  const objectVolume = (objectWidth * objectHeight * objectDepth) / 1000000; // cm³ to m³
  const objectMass = objectDensity * objectVolume;
  const objectWeight = objectMass * 9.8; // N - standart g değeri
  const buoyantForce = calculateBuoyantForce(fluidDensity, objectVolume);
  const floatStatus = determineFloatStatus(objectDensity, fluidDensity);
  const submergedPercentage = calculateSubmergedPercentage(
    objectDensity,
    fluidDensity
  );

  // Basınç noktalarını hesapla
  useEffect(() => {
    const points = [];
    const step = containerHeight / 10;

    for (let depth = 0; depth <= containerHeight; depth += step) {
      const pressure = calculatePressure(fluidDensity, depth / 100); // cm to m
      points.push({ depth, pressure });
    }

    setPressurePoints(points);
  }, [fluidDensity, containerHeight]);

  // Nesnenin konumunu hesapla - FİZİK HATASINI DÜZELTİLDİ
  const calculateObjectPosition = () => {
    if (floatStatus === 'float') {
      // Yüzen cisim: Sadece belirli bir kısmı suda, yukarıda konumlanır
      const submergedHeight = (submergedPercentage / 100) * objectHeight;
      // Su yüzeyi containerHeight'ın %90'ında olsun, cisim ona göre konumlansın
      const waterSurfaceY = containerHeight * 0.1; // Üstten %10 boşluk
      return waterSurfaceY - (objectHeight - submergedHeight); // Yüzen kısmı su yüzeyinin üstünde
    } else if (floatStatus === 'neutral') {
      // Askıda kalan cisim: Su ortasında
      const waterSurfaceY = containerHeight * 0.1;
      const waterDepth = containerHeight * 0.8; // Su derinliği %80
      return waterSurfaceY + waterDepth / 2 - objectHeight / 2; // Ortada konumlan
    } else {
      // Batan cisim: En altta
      const waterBottomY = containerHeight * 0.9; // Alt %10 boşluk
      return waterBottomY - objectHeight; // Dipte konumlan
    }
  };

  const objectPositionY = calculateObjectPosition();

  // Animasyon stilleri
  const waveAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withRepeat(
            withSpring(10, { damping: 5, stiffness: 40 }),
            -1,
            true
          ),
        },
      ],
    };
  });

  const floatAnimation = useAnimatedStyle(() => {
    if (floatStatus === 'float') {
      return {
        transform: [
          {
            translateY: withRepeat(
              withSpring(-10, { damping: 10, stiffness: 40 }),
              -1,
              true
            ),
          },
        ],
      };
    }
    return {};
  });

  return (
    <Card style={{ overflow: 'hidden', padding: 16, backgroundColor: 'white' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '500' }}>
          {t('Sıvı Basıncı Simülasyonu', 'Fluid Pressure Simulation')}
        </Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {t('Sıvı Yoğunluğu', 'Fluid Density')}: {formatWithUnits(fluidDensity, 'kg/m³')}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {t('Cisim Yoğunluğu', 'Object Density')}: {formatWithUnits(objectDensity, 'kg/m³')}
          </Text>
        </View>
      </View>

      <View
        style={{
          height: containerHeight,
          width: screenWidth - 64,
          backgroundColor: '#f0f9ff',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {/* Container - hava ve su ayrı görselleştirildi */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: containerHeight * 0.1, // Üst %10 hava
            backgroundColor: '#e0f2fe', // Açık mavi - hava
          }}
        />
        
        {/* Su konteyneri - sadece su olan kısım */}
        <View
          style={{
            position: 'absolute',
            top: containerHeight * 0.1, // Su yüzeyi %10'dan başlar
            left: 0,
            right: 0,
            bottom: containerHeight * 0.1, // Alt %10 boşluk
            backgroundColor: '#0891b2', // Koyu mavi - su
          }}
        >
          {/* Su yüzeyi çizgisi */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: 'rgba(255,255,255,0.8)',
            }}
          />
          
          {/* Sıvı dalgaları */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
              waveAnimation,
            ]}
          />
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 5,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
              waveAnimation,
            ]}
          />
        </View>

        {/* Nesne */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: '50%',
              transform: [{ translateX: -objectWidth / 2 }],
              top: objectPositionY,
              width: objectWidth,
              height: objectHeight,
              backgroundColor: floatStatus === 'sink' ? '#d0d0d0' : '#f0f0f0',
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
            floatAnimation,
          ]}
        />

        {/* Basınç göstergeleri - Sadece su içindeki kısım */}
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: containerHeight * 0.1, // Su yüzeyinden başla
            bottom: containerHeight * 0.1, // Su dibine kadar
            width: 20,
            justifyContent: 'space-between',
          }}
        >
          {pressurePoints.filter((_, index) => index >= 1 && index <= 8).map((point, index) => {
            // Sadece su içindeki noktalari göster (1-8 arası)
            const waterDepth = (index + 1) * (containerHeight * 0.8) / 8; // Su derinliği
            return (
              <View
                key={point.depth}
                style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: waterDepth 
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 1,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                  }}
                />
                {index % 2 === 0 && (
                  <Text
                    style={{
                      position: 'absolute',
                      right: 12,
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.8)',
                      fontWeight: '500'
                    }}
                  >
                    {(waterDepth).toFixed(0)} cm
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Etki eden kuvvetler ve basınç bilgileri */}
      <View
        style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: '#f8fafc',
          borderRadius: 8,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: '#1e40af',
                marginBottom: 8,
              }}
            >
              {t('Kuvvetler', 'Forces')}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              {t('Ağırlık', 'Weight')}: {formatWithUnits(objectWeight, 'N')}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              {t('Kaldırma Kuvveti', 'Buoyant Force')}: {formatWithUnits(buoyantForce, 'N')}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              {t('Net Kuvvet', 'Net Force')}: {formatWithUnits(objectWeight - buoyantForce, 'N')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: '#1e40af',
                marginBottom: 8,
              }}
            >
              {t('Basınç Değerleri', 'Pressure Values')}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              {t('Yüzeyde', 'At Surface')}: {formatPressure(calculatePressure(fluidDensity, 0))}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              {t('Dipte', 'At Bottom')}:{' '}
              {formatPressure(
                calculatePressure(fluidDensity, containerHeight / 100)
              )}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              {t('Cisim Seviyesinde', 'At Object Level')}:{' '}
              {formatPressure(
                calculatePressure(fluidDensity, 
                  // Cismin alt kısmındaki su derinliği
                  Math.max(0, (objectPositionY + objectHeight - containerHeight * 0.1) / 100)
                )
              )}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
          }}
        >
          <Text style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
            {t('Durum', 'Status')}:{' '}
            {floatStatus === 'float'
              ? t('Cisim Yüzüyor', 'Object Floats')
              : floatStatus === 'sink'
              ? t('Cisim Batıyor', 'Object Sinks')
              : t('Cisim Askıda', 'Object Suspended')}
            {floatStatus === 'float' &&
              ` (${submergedPercentage.toFixed(1)}% ${t('batık', 'submerged')})`}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default FluidSimulation;
