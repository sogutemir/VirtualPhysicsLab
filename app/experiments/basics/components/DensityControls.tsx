import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { cn } from '../lib/utils';
import Slider from '@react-native-community/slider';

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

interface DensityControlsProps {
  liquidDensity: number;
  objects: ObjectProps[];
  onLiquidDensityChange: (value: number) => void;
  onObjectDensityChange: (id: number, value: number) => void;
}

// Performans optimizasyonu için sabitler
const SLIDER_CONFIG = {
  LIQUID_MIN: 500,
  LIQUID_MAX: 14000,
  LIQUID_STEP: 25,
  OBJECT_MIN: 100,
  OBJECT_MAX: 20000,
  OBJECT_STEP: 50,
} as const;

// Hazır sıvı türleri ve yoğunlukları - memoized
const liquidPresets = [
  { name: 'Benzin', density: 750, color: '#fef3c7' },
  { name: 'Su', density: 1000, color: '#bfdbfe' },
  { name: 'Deniz Suyu', density: 1025, color: '#93c5fd' },
  { name: 'Süt', density: 1030, color: '#fecaca' },
  { name: 'Gliserin', density: 1260, color: '#fbbf24' },
  { name: 'Cıva', density: 13600, color: '#d1d5db' },
] as const;

// Hazır malzeme türleri ve yoğunlukları - memoized
const materialPresets = [
  { name: 'Köpük', density: 100, category: 'light' as const },
  { name: 'Mantar', density: 240, category: 'light' as const },
  { name: 'Buz', density: 920, category: 'light' as const },
  { name: 'Su', density: 1000, category: 'medium' as const },
  { name: 'Ahşap', density: 700, category: 'light' as const },
  { name: 'Beton', density: 2400, category: 'medium' as const },
  { name: 'Cam', density: 2500, category: 'medium' as const },
  { name: 'Alüminyum', density: 2700, category: 'medium' as const },
  { name: 'Demir', density: 7800, category: 'heavy' as const },
  { name: 'Bakır', density: 8960, category: 'heavy' as const },
  { name: 'Kurşun', density: 11300, category: 'heavy' as const },
  { name: 'Altın', density: 19300, category: 'heavy' as const },
] as const;

// Optimized liquid preset component
const LiquidPresetButton: React.FC<{
  preset: (typeof liquidPresets)[number];
  isSelected: boolean;
  onPress: () => void;
}> = memo(({ preset, isSelected, onPress }) => {
  const buttonStyle = useMemo(
    () => ({
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: isSelected ? preset.color : 'white',
      borderWidth: 2,
      borderColor: isSelected ? '#1e40af' : '#e2e8f0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isSelected ? 0.2 : 0.1,
      shadowRadius: 2,
      elevation: isSelected ? 3 : 1,
    }),
    [isSelected, preset.color]
  );

  const textStyle = useMemo(
    () => ({
      fontSize: 12,
      color: isSelected ? '#1e40af' : '#64748b',
      fontWeight: isSelected ? '600' : ('normal' as 'normal' | '600'),
      textAlign: 'center' as const,
    }),
    [isSelected]
  );

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.7}>
      <Text style={textStyle}>{preset.name}</Text>
      <Text style={[textStyle, { fontSize: 10, opacity: 0.7 }]}>
        {preset.density} kg/m³
      </Text>
    </TouchableOpacity>
  );
});

// Optimized material preset component
const MaterialPresetButton: React.FC<{
  preset: (typeof materialPresets)[number];
  isSelected: boolean;
  onPress: () => void;
}> = memo(({ preset, isSelected, onPress }) => {
  const categoryColors = {
    light: '#10b981',
    medium: '#f59e0b',
    heavy: '#ef4444',
  };

  const buttonStyle = useMemo(
    () => ({
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: isSelected ? '#f0f9ff' : 'white',
      borderWidth: 1.5,
      borderColor: isSelected ? categoryColors[preset.category] : '#e2e8f0',
      marginHorizontal: 2,
      marginVertical: 2,
    }),
    [isSelected, preset.category]
  );

  const textStyle = useMemo(
    () => ({
      fontSize: 11,
      color: isSelected ? categoryColors[preset.category] : '#64748b',
      fontWeight: isSelected ? '600' : ('normal' as 'normal' | '600'),
      textAlign: 'center' as const,
    }),
    [isSelected, preset.category]
  );

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.8}>
      <Text style={textStyle}>{preset.name}</Text>
    </TouchableOpacity>
  );
});

// Optimized object control component
const ObjectControl: React.FC<{
  obj: ObjectProps;
  liquidDensity: number;
  onDensityChange: (value: number) => void;
}> = memo(({ obj, liquidDensity, onDensityChange }) => {
  // Memoized shape icon
  const shapeIcon = useMemo(() => {
    const shapeStyle = {
      width: 16,
      height: 16,
      backgroundColor: obj.color,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      elevation: 2,
    };

    switch (obj.shape) {
      case 'circle':
        return <View style={{ ...shapeStyle, borderRadius: 8 }} />;
      case 'square':
        return <View style={{ ...shapeStyle, borderRadius: 3 }} />;
      case 'triangle':
        return (
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderBottomWidth: 14,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: obj.color,
            }}
          />
        );
      default:
        return null;
    }
  }, [obj.shape, obj.color]);

  // Buoyancy status calculation
  const buoyancyStatus = useMemo(() => {
    const ratio = obj.density / liquidDensity;
    if (ratio < 0.95) return { text: 'Yüzer', color: '#10b981', icon: '↑' };
    if (ratio > 1.05) return { text: 'Batar', color: '#ef4444', icon: '↓' };
    return { text: 'Askıda', color: '#f59e0b', icon: '↔' };
  }, [obj.density, liquidDensity]);

  // Material suggestions based on current density
  const suggestions = useMemo(
    () =>
      materialPresets
        .filter(
          (preset) => Math.abs(preset.density - obj.density) < obj.density * 0.3
        )
        .slice(0, 4),
    [obj.density]
  );

  const handlePresetPress = useCallback(
    (density: number) => {
      onDensityChange(density);
    },
    [onDensityChange]
  );

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {shapeIcon}
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: obj.color,
            }}
          >
            Cisim {obj.id}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: buoyancyStatus.color + '20',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: buoyancyStatus.color,
              fontWeight: '600',
            }}
          >
            {buoyancyStatus.icon} {buoyancyStatus.text}
          </Text>
        </View>
      </View>

      {/* Density Info */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 14, color: '#64748b' }}>
          Yoğunluk: {obj.density} kg/m³
        </Text>
        <Text style={{ fontSize: 12, color: '#94a3b8' }}>
          Oran: {(obj.density / liquidDensity).toFixed(2)}x
        </Text>
      </View>

      {/* Slider */}
      <Slider
        minimumValue={SLIDER_CONFIG.OBJECT_MIN}
        maximumValue={SLIDER_CONFIG.OBJECT_MAX}
        step={SLIDER_CONFIG.OBJECT_STEP}
        value={obj.density}
        onValueChange={onDensityChange}
        minimumTrackTintColor={obj.color}
        maximumTrackTintColor="#e2e8f0"
        thumbTintColor={obj.color}
        style={{ marginBottom: 12 }}
      />

      {/* Material Suggestions */}
      <View>
        <Text
          style={{
            fontSize: 12,
            color: '#64748b',
            marginBottom: 8,
          }}
        >
          Yakın Malzemeler:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {suggestions.map((preset) => (
            <MaterialPresetButton
              key={preset.name}
              preset={preset}
              isSelected={Math.abs(preset.density - obj.density) < 50}
              onPress={() => handlePresetPress(preset.density)}
            />
          ))}
        </View>
      </View>
    </View>
  );
});

// Ana component - Performance optimized
const DensityControls: React.FC<DensityControlsProps> = memo(
  ({
    liquidDensity,
    objects,
    onLiquidDensityChange,
    onObjectDensityChange,
  }) => {
    // Liquid preset handlers - memoized
    const handleLiquidPresetPress = useCallback(
      (density: number) => {
        onLiquidDensityChange(density);
      },
      [onLiquidDensityChange]
    );

    // Object density change handlers - memoized
    const objectHandlers = useMemo(
      () =>
        objects.reduce((acc, obj) => {
          acc[obj.id] = (value: number) => onObjectDensityChange(obj.id, value);
          return acc;
        }, {} as Record<number, (value: number) => void>),
      [objects, onObjectDensityChange]
    );

    // Rendered liquid presets - memoized
    const liquidPresetButtons = useMemo(
      () =>
        liquidPresets.map((preset) => (
          <LiquidPresetButton
            key={preset.name}
            preset={preset}
            isSelected={liquidDensity === preset.density}
            onPress={() => handleLiquidPresetPress(preset.density)}
          />
        )),
      [liquidDensity, handleLiquidPresetPress]
    );

    // Rendered object controls - memoized
    const objectControls = useMemo(
      () =>
        objects.map((obj) => (
          <ObjectControl
            key={obj.id}
            obj={obj}
            liquidDensity={liquidDensity}
            onDensityChange={objectHandlers[obj.id]}
          />
        )),
      [objects, liquidDensity, objectHandlers]
    );

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Sıvı Yoğunluğu Kontrolleri */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#1e40af',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            🌊 Sıvı Yoğunluğu
          </Text>

          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: '#64748b' }}>
                Yoğunluk: {liquidDensity} kg/m³
              </Text>
              <Text style={{ fontSize: 12, color: '#94a3b8' }}>
                {SLIDER_CONFIG.LIQUID_MIN} - {SLIDER_CONFIG.LIQUID_MAX}
              </Text>
            </View>
            <Slider
              minimumValue={SLIDER_CONFIG.LIQUID_MIN}
              maximumValue={SLIDER_CONFIG.LIQUID_MAX}
              step={SLIDER_CONFIG.LIQUID_STEP}
              value={liquidDensity}
              onValueChange={onLiquidDensityChange}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#e2e8f0"
              thumbTintColor="#3b82f6"
            />
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#f1f5f9',
              paddingTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: '#64748b',
                marginBottom: 12,
                textAlign: 'center',
              }}
            >
              Hazır Sıvı Seçenekleri:
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'center',
              }}
            >
              {liquidPresetButtons}
            </View>
          </View>
        </View>

        {/* Nesne Yoğunluğu Kontrolleri */}
        <View style={{ paddingBottom: 100 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#1e40af',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            📦 Cisim Yoğunlukları
          </Text>
          {objectControls}
        </View>
      </ScrollView>
    );
  }
);

// Display names for debugging
DensityControls.displayName = 'DensityControls';
LiquidPresetButton.displayName = 'LiquidPresetButton';
MaterialPresetButton.displayName = 'MaterialPresetButton';
ObjectControl.displayName = 'ObjectControl';

export default DensityControls;
