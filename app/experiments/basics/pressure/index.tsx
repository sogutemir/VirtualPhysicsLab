import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import ExperimentLayout from '@/components/ExperimentLayout';
import FluidSimulation from './components/FluidSimulation';
import SimulationControls from './components/SimulationControls';
import InfoPanel from './components/InfoPanel';

const PressureExperiment = () => {
  // Varsayılan değerler - optimize edildi
  const defaultValues = {
    fluidDensity: 1000, // su (kg/m³)
    objectDensity: 600, // ahşap (kg/m³) - su üzerinde yüzecek
    objectHeight: 40, // cm - daha küçük nesne
    objectWidth: 60, // cm - daha küçük nesne
    objectDepth: 15, // cm - daha küçük nesne
    containerHeight: 400, // cm - daha büyük container
  };

  // Simülasyon parametreleri için state
  const [fluidDensity, setFluidDensity] = useState(defaultValues.fluidDensity);
  const [objectDensity, setObjectDensity] = useState(
    defaultValues.objectDensity
  );
  const [objectHeight, setObjectHeight] = useState(defaultValues.objectHeight);
  const [objectWidth, setObjectWidth] = useState(defaultValues.objectWidth);
  const [objectDepth, setObjectDepth] = useState(defaultValues.objectDepth);
  const [containerHeight, setContainerHeight] = useState(
    defaultValues.containerHeight
  );

  // Varsayılan değerlere sıfırlama
  const resetToDefaults = () => {
    setFluidDensity(defaultValues.fluidDensity);
    setObjectDensity(defaultValues.objectDensity);
    setObjectHeight(defaultValues.objectHeight);
    setObjectWidth(defaultValues.objectWidth);
    setObjectDepth(defaultValues.objectDepth);
    setContainerHeight(defaultValues.containerHeight);
  };

  return (
    <ExperimentLayout
      title="Sıvı Basıncı"
      titleEn="Fluid Pressure"
      difficulty="Başlangıç"
      difficultyEn="Beginner"
      description="Sıvı basıncının derinlik ve yoğunluğa bağlı değişimini inceleyen interaktif simülasyon."
      descriptionEn="Interactive simulation exploring how fluid pressure changes with depth and density."
      hideControls
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16, gap: 16 }}>
          {/* Ana simülasyon */}
          <FluidSimulation
            fluidDensity={fluidDensity}
            objectDensity={objectDensity}
            objectHeight={objectHeight}
            objectWidth={objectWidth}
            objectDepth={objectDepth}
            containerHeight={containerHeight}
          />

          {/* Kontroller */}
          <SimulationControls
            fluidDensity={fluidDensity}
            setFluidDensity={setFluidDensity}
            objectDensity={objectDensity}
            setObjectDensity={setObjectDensity}
            objectHeight={objectHeight}
            setObjectHeight={setObjectHeight}
            objectWidth={objectWidth}
            setObjectWidth={setObjectWidth}
            objectDepth={objectDepth}
            setObjectDepth={setObjectDepth}
            containerHeight={containerHeight}
            setContainerHeight={setContainerHeight}
            resetToDefaults={resetToDefaults}
          />

          {/* Bilgi paneli */}
          <InfoPanel />
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
};

export default PressureExperiment;
