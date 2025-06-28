import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MagneticSimulator from './MagneticSimulator';
import ParameterControls from './ParameterControls';
import { useLanguage } from '../../../../../components/LanguageContext';
import { FieldType, ChargeType } from './types';

const MagneticFieldExperiment: React.FC = () => {
  const { language, t } = useLanguage();
  const isEnglish = language === 'en';

  // State değişkenleri
  const [currentIntensity, setCurrentIntensity] = useState(5);
  const [wireDistance, setWireDistance] = useState(30);
  const [coilTurns, setCoilTurns] = useState(10);
  const [fieldType, setFieldType] = useState<FieldType>('straight');
  const [animateField, setAnimateField] = useState(false);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showCharges, setShowCharges] = useState(true);
  const [chargeType, setChargeType] = useState<ChargeType>('both');
  const [chargeSpeed, setChargeSpeed] = useState(3);

  // Durum güncelleme işlevleri
  const handleCurrentIntensityChange = (value: number) => {
    setCurrentIntensity(value);
  };

  const handleWireDistanceChange = (value: number) => {
    setWireDistance(value);
  };

  const handleCoilTurnsChange = (value: number) => {
    setCoilTurns(value);
  };

  const handleFieldTypeChange = (type: FieldType) => {
    setFieldType(type);
  };

  const handleToggleAnimation = () => {
    setAnimateField(!animateField);
  };

  const handleToggleFieldLines = () => {
    setShowFieldLines(!showFieldLines);
  };

  const handleToggleCharges = () => {
    setShowCharges(!showCharges);
  };

  const handleChargeTypeChange = (type: ChargeType) => {
    setChargeType(type);
  };

  const handleChargeSpeedChange = (speed: number) => {
    setChargeSpeed(speed);
  };

  const handleReset = () => {
    setCurrentIntensity(5);
    setWireDistance(30);
    setCoilTurns(10);
    setFieldType('straight');
    setAnimateField(false);
    setShowFieldLines(true);
    setShowCharges(true);
    setChargeType('both');
    setChargeSpeed(3);
  };

  return (
    <View style={styles.container}>
      <MagneticSimulator
        currentIntensity={currentIntensity}
        wireDistance={wireDistance}
        coilTurns={coilTurns}
        fieldType={fieldType}
        showFieldLines={showFieldLines}
        animateField={animateField}
        showCharges={showCharges}
        chargeType={chargeType}
        chargeSpeed={chargeSpeed}
        onChangeFieldType={handleFieldTypeChange}
        onToggleAnimation={handleToggleAnimation}
        onToggleFieldLines={handleToggleFieldLines}
        onToggleCharges={handleToggleCharges}
        onCoilTurnsChange={handleCoilTurnsChange}
        onChargeTypeChange={handleChargeTypeChange}
        onChargeSpeedChange={handleChargeSpeedChange}
      />
      <ParameterControls
        title={t('Manyetik Alan Parametreleri', 'Magnetic Field Parameters')}
        currentIntensity={currentIntensity}
        wireDistance={wireDistance}
        coilTurns={coilTurns}
        fieldType={fieldType}
        showCharges={showCharges}
        chargeType={chargeType}
        chargeSpeed={chargeSpeed}
        onCurrentIntensityChange={handleCurrentIntensityChange}
        onWireDistanceChange={handleWireDistanceChange}
        onCoilTurnsChange={handleCoilTurnsChange}
        onFieldTypeChange={handleFieldTypeChange}
        onToggleCharges={handleToggleCharges}
        onChargeTypeChange={handleChargeTypeChange}
        onChargeSpeedChange={handleChargeSpeedChange}
        onReset={handleReset}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: Platform.OS === 'web' ? 16 : 8, // Mobilde daha az padding
  },
});

export default MagneticFieldExperiment;
