import React, { memo, useMemo, useCallback, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { cn } from '../lib/utils';
import { CustomSlider } from '../../../../components/ui/slider';

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
  OBJECT_MIN: 0, // Minimum 0 kg/m³ - tamamen esnek!
  OBJECT_MAX: 25000, // Yüksek maksimum
  OBJECT_STEP: 1, // Hassas kontrol
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
  { name: 'Vakum', density: 0, category: 'light' as const },
  { name: 'Helyum', density: 0.18, category: 'light' as const },
  { name: 'Hidrojen', density: 0.09, category: 'light' as const },
  { name: 'Hava', density: 1.2, category: 'light' as const },
  { name: 'Köpük', density: 50, category: 'light' as const },
  { name: 'Mantar', density: 240, category: 'light' as const },
  { name: 'Ahşap', density: 700, category: 'light' as const },
  { name: 'Buz', density: 920, category: 'light' as const },
  { name: 'Su', density: 1000, category: 'medium' as const },
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
  inputValue: string;
  onInputValueChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
}> = memo(({ obj, liquidDensity, onDensityChange, inputValue, onInputValueChange, onFocusChange }) => {
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
          Oran: {(obj.density / liquidDensity).toFixed(2)}x | 0-{SLIDER_CONFIG.OBJECT_MAX}
        </Text>
      </View>

      {/* Slider */}
      <View style={{ marginBottom: 12 }}>
        <CustomSlider
          min={0}
          max={SLIDER_CONFIG.OBJECT_MAX}
          step={SLIDER_CONFIG.OBJECT_STEP}
          value={obj.density}
          onValueChange={onDensityChange}
          minimumTrackTintColor={obj.color}
          maximumTrackTintColor="#e2e8f0"
          thumbTintColor={obj.color}
        />
      </View>
      
      {/* Sayısal Input Alanı */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Text style={{ fontSize: 14, color: '#64748b', minWidth: 80 }}>
          Değer Girin:
        </Text>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderColor: obj.color,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 14,
            backgroundColor: 'white',
            color: '#1f2937',
            fontWeight: '500',
          }}
          value={inputValue}
          onFocus={() => onFocusChange(true)}
          onChangeText={(text) => {
            // Sadece sayısal karakterlere izin ver (nokta da dahil)
            const numericText = text.replace(/[^0-9.]/g, '');
            onInputValueChange(numericText);
            
            // Input yazarken simülasyonu güncelleme - daha smooth editing deneyimi
            // Simülasyon sadece onBlur'da güncellenecek
          }}
          onBlur={() => {
            onFocusChange(false);
            
            // Eğer input tamamen boşsa - boş bırak, simülasyonda eski değeri kullan
            if (inputValue.trim() === '') {
              // Input boş kalabilir - simülasyon için değişiklik yapma
              return;
            }
            
            // Focus kaybında minimal validasyon
            const value = parseFloat(inputValue);
            
            if (isNaN(value) || value < 0) {
              // Geçersiz değer girildiyse input'u temizle
              onInputValueChange('');
            } else if (value > SLIDER_CONFIG.OBJECT_MAX) {
              // Maksimum değeri aştıysa max değere getir
              onInputValueChange(SLIDER_CONFIG.OBJECT_MAX.toString());
              onDensityChange(SLIDER_CONFIG.OBJECT_MAX);
            } else {
              // Geçerli değeri uygula (0 dahil!)
              onDensityChange(value);
            }
          }}
          keyboardType="numeric"
          placeholder={`0-${SLIDER_CONFIG.OBJECT_MAX} kg/m³`}
          placeholderTextColor="#9ca3af"
          selectTextOnFocus={true}
        />
        <Text style={{ fontSize: 12, color: '#94a3b8', minWidth: 40 }}>
          kg/m³
        </Text>
      </View>

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
    // Geçici input değerleri için state - memoized initial values
    const [liquidInputValue, setLiquidInputValue] = useState(() => liquidDensity.toString());
    const [objectInputValues, setObjectInputValues] = useState<Record<number, string>>(() => 
      objects.reduce((acc, obj) => ({ ...acc, [obj.id]: obj.density.toString() }), {})
    );
    
    // Focus durumlarını takip et - editing sırasında otomatik güncelleme yapma
    const [liquidInputFocused, setLiquidInputFocused] = useState(false);
    const [objectInputsFocused, setObjectInputsFocused] = useState<Record<number, boolean>>({});

    // HİÇBİR OTOMATIK GÜNCELLEME YAPMA - Input'lar tamamen manuel kontrol
    // Object IDs memoized
    const objectIds = useMemo(() => objects.map(obj => obj.id), [objects.length]);

    // Liquid preset handlers - memoized
    const handleLiquidPresetPress = useCallback(
      (density: number) => {
        onLiquidDensityChange(density);
      },
      [onLiquidDensityChange]
    );

    // Object density change handlers - memoized with stable references
    const objectHandlers = useMemo(() => {
      const handlers: Record<number, (value: number) => void> = {};
      objectIds.forEach(id => {
        handlers[id] = (value: number) => onObjectDensityChange(id, value);
      });
      return handlers;
    }, [objectIds, onObjectDensityChange]);

    // Object input handlers - stable handlers per object ID
    const objectInputHandlers = useMemo(() => {
      const handlers: Record<number, (value: string) => void> = {};
      objectIds.forEach(id => {
        handlers[id] = (value: string) => 
          setObjectInputValues(prev => ({ ...prev, [id]: value }));
      });
      return handlers;
    }, [objectIds]);

    // Object focus handlers - stable handlers per object ID
    const objectFocusHandlers = useMemo(() => {
      const handlers: Record<number, (focused: boolean) => void> = {};
      objectIds.forEach(id => {
        handlers[id] = (focused: boolean) => 
          setObjectInputsFocused(prev => ({ ...prev, [id]: focused }));
      });
      return handlers;
    }, [objectIds]);

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
            inputValue={objectInputValues[obj.id] !== undefined ? objectInputValues[obj.id] : obj.density.toString()}
            onInputValueChange={objectInputHandlers[obj.id]}
            onFocusChange={objectFocusHandlers[obj.id]}
          />
        )),
      [objects, liquidDensity, objectHandlers, objectInputValues, objectInputHandlers, objectFocusHandlers]
    );

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
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
            
            {/* Slider ve Input Alanı */}
            <View style={{ marginBottom: 12 }}>
              <CustomSlider
                min={SLIDER_CONFIG.LIQUID_MIN}
                max={SLIDER_CONFIG.LIQUID_MAX}
                step={SLIDER_CONFIG.LIQUID_STEP}
                value={liquidDensity}
                onValueChange={onLiquidDensityChange}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e2e8f0"
                thumbTintColor="#3b82f6"
              />
            </View>
            
            {/* Sayısal Input Alanı */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 14, color: '#64748b', minWidth: 80 }}>
                Değer Girin:
              </Text>
              <TextInput
                style={{
                  flex: 1,
                  borderWidth: 1.5,
                  borderColor: liquidInputFocused ? '#2563eb' : '#3b82f6',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 14,
                  backgroundColor: 'white',
                  color: '#1f2937',
                  fontWeight: '500',
                }}
                value={liquidInputValue}
                onFocus={() => setLiquidInputFocused(true)}
                onChangeText={(text) => {
                  // Sadece sayısal karakterlere izin ver
                  const numericText = text.replace(/[^0-9.]/g, '');
                  setLiquidInputValue(numericText);
                  
                  // Input yazarken simülasyonu güncelleme - daha smooth editing deneyimi
                  // Simülasyon sadece onBlur'da güncellenecek
                }}
                onBlur={() => {
                  setLiquidInputFocused(false);
                  
                  // Eğer input tamamen boşsa - boş bırak, simülasyonda eski değeri kullan
                  if (liquidInputValue.trim() === '') {
                    // Input boş kalabilir - simülasyon için değişiklik yapma
                    return;
                  }
                  
                  // Focus kaybında validasyon
                  const value = parseFloat(liquidInputValue);
                  
                  if (isNaN(value) || value < SLIDER_CONFIG.LIQUID_MIN || value > SLIDER_CONFIG.LIQUID_MAX) {
                    // Geçersiz değer girildiyse input'u temizle
                    setLiquidInputValue('');
                  } else {
                    // Geçerli değeri uygula
                    onLiquidDensityChange(value);
                  }
                }}
                keyboardType="numeric"
                placeholder={`${SLIDER_CONFIG.LIQUID_MIN}-${SLIDER_CONFIG.LIQUID_MAX}`}
                placeholderTextColor="#9ca3af"
                selectTextOnFocus={true}
              />
              <Text style={{ fontSize: 12, color: '#94a3b8', minWidth: 40 }}>
                kg/m³
              </Text>
            </View>
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
