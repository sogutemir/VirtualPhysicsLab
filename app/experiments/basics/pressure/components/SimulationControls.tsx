import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { CustomSlider as Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageContext';
import { formatWithUnits } from '../utils/pressureCalculator';

interface SimulationControlsProps {
  fluidDensity: number;
  setFluidDensity: (value: number) => void;
  objectDensity: number;
  setObjectDensity: (value: number) => void;
  objectHeight: number;
  setObjectHeight: (value: number) => void;
  objectWidth: number;
  setObjectWidth: (value: number) => void;
  objectDepth: number;
  setObjectDepth: (value: number) => void;
  containerHeight: number;
  setContainerHeight: (value: number) => void;
  resetToDefaults: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  fluidDensity,
  setFluidDensity,
  objectDensity,
  setObjectDensity,
  objectHeight,
  setObjectHeight,
  objectWidth,
  setObjectWidth,
  objectDepth,
  setObjectDepth,
  containerHeight,
  setContainerHeight,
  resetToDefaults,
}) => {
  const { t } = useLanguage();
  
  return (
    <Card style={{ padding: 16, backgroundColor: 'white' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '500' }}>
          {t('Simülasyon Parametreleri', 'Simulation Parameters')}
        </Text>
        <Button onPress={resetToDefaults} variant="outline" size="sm">
          {t('Sıfırla', 'Reset')}
        </Button>
      </View>

      <View style={{ gap: 20 }}>
        {/* Nesne Yoğunluğu */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>{t('Nesne Yoğunluğu', 'Object Density')}</Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(objectDensity, 'kg/m³')}
            </Text>
          </View>
          <Slider
            value={objectDensity}
            min={100}
            max={12000}
            step={50}
            onValueChange={setObjectDensity}
          />
        </View>

        {/* Nesne Boyutları */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>
              {t('Nesne Yüksekliği', 'Object Height')}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(objectHeight, 'cm')}
            </Text>
          </View>
          <Slider
            value={objectHeight}
            min={10}
            max={100}
            step={1}
            onValueChange={setObjectHeight}
          />
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>{t('Nesne Genişliği', 'Object Width')}</Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(objectWidth, 'cm')}
            </Text>
          </View>
          <Slider
            value={objectWidth}
            min={20}
            max={150}
            step={5}
            onValueChange={setObjectWidth}
          />
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>{t('Nesne Derinliği', 'Object Depth')}</Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(objectDepth, 'cm')}
            </Text>
          </View>
          <Slider
            value={objectDepth}
            min={5}
            max={50}
            step={1}
            onValueChange={setObjectDepth}
          />
        </View>

        {/* Sıvı Yoğunluğu */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>{t('Sıvı Yoğunluğu', 'Fluid Density')}</Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(fluidDensity, 'kg/m³')}
            </Text>
          </View>
          <Slider
            value={fluidDensity}
            min={800}
            max={14000}
            step={50}
            onValueChange={setFluidDensity}
          />
        </View>

        {/* Container Yüksekliği */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>{t('Container Yüksekliği', 'Container Height')}</Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(containerHeight, 'cm')}
            </Text>
          </View>
          <Slider
            value={containerHeight}
            min={200}
            max={500}
            step={10}
            onValueChange={setContainerHeight}
          />
        </View>

        {/* Hazır Sıvı Seçenekleri */}
        <View
          style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
            {t('Hazır Sıvı Seçenekleri', 'Preset Fluid Options')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setFluidDensity(1000)}
            >
              <Text style={{ fontSize: 12 }}>{t('Tatlı Su', 'Fresh Water')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setFluidDensity(1025)}
            >
              <Text style={{ fontSize: 12 }}>{t('Tuzlu Su', 'Salt Water')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setFluidDensity(800)}
            >
              <Text style={{ fontSize: 12 }}>{t('Alkol', 'Alcohol')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setFluidDensity(13600)}
            >
              <Text style={{ fontSize: 12 }}>{t('Cıva', 'Mercury')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hazır Nesne Seçenekleri */}
        <View
          style={{ backgroundColor: '#f0f8f0', padding: 12, borderRadius: 8 }}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
            {t('Hazır Nesne Seçenekleri', 'Preset Object Options')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setObjectDensity(240)}
            >
              <Text style={{ fontSize: 12 }}>{t('Mantar', 'Cork')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setObjectDensity(600)}
            >
              <Text style={{ fontSize: 12 }}>{t('Ahşap', 'Wood')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setObjectDensity(920)}
            >
              <Text style={{ fontSize: 12 }}>{t('Buzul', 'Ice')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setObjectDensity(2700)}
            >
              <Text style={{ fontSize: 12 }}>{t('Alüminyum', 'Aluminum')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setObjectDensity(7870)}
            >
              <Text style={{ fontSize: 12 }}>{t('Demir', 'Iron')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default SimulationControls;
