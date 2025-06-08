import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { CustomSlider } from '../../../../../components/ui/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { CollisionMode } from '../../utils/momentum-bullet/physics';

interface ControlPanelProps {
  isRunning: boolean;
  timeScale: number;
  wallElasticity: number;
  projectilesCount: number;
  collisionMode: CollisionMode;
  onTimeScaleChange: (value: number) => void;
  onWallElasticityChange: (value: number) => void;
  onModeChange: (mode: CollisionMode) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onClear: () => void;
}

// Memoized Slider Component
const SliderControl = memo<{
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
}>(({ label, value, unit, min, max, step, onValueChange }) => (
  <View style={styles.sliderContainer}>
    <View style={styles.sliderHeader}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <Text style={styles.sliderValue}>
        {value.toFixed(step >= 1 ? 0 : 2)}
        {unit}
      </Text>
    </View>
    <CustomSlider
      style={styles.slider}
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={onValueChange}
      minimumTrackTintColor="#3b82f6"
      maximumTrackTintColor="#d1d5db"
      thumbTintColor="#3b82f6"
    />
  </View>
));

// Memoized Mode Button Component
const ModeButton = memo<{
  mode: CollisionMode;
  currentMode: CollisionMode;
  label: string;
  onPress: (mode: CollisionMode) => void;
  disabled: boolean;
}>(({ mode, currentMode, label, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.modeButton, currentMode === mode && styles.activeMode]}
    onPress={() => onPress(mode)}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text
      style={[
        styles.modeButtonText,
        currentMode === mode && styles.activeModeText,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
));

// Memoized Action Button Component
const ActionButton = memo<{
  onPress: () => void;
  disabled?: boolean;
  style: any;
  icon: string;
  iconSize?: number;
  iconColor: string;
  iconFamily?: 'FontAwesome' | 'MaterialIcons';
  text: string;
  textStyle: any;
}>(
  ({
    onPress,
    disabled,
    style,
    icon,
    iconSize = 16,
    iconColor,
    iconFamily = 'FontAwesome',
    text,
    textStyle,
  }) => {
    const IconComponent =
      iconFamily === 'FontAwesome' ? FontAwesome : MaterialIcons;

    return (
      <TouchableOpacity
        style={[styles.button, style, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <IconComponent
          name={icon as any}
          size={iconSize}
          color={iconColor}
          style={styles.buttonIcon}
        />
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    );
  }
);

const ControlPanel = memo<ControlPanelProps>(
  ({
    isRunning,
    timeScale,
    wallElasticity,
    projectilesCount,
    collisionMode,
    onTimeScaleChange,
    onWallElasticityChange,
    onModeChange,
    onStart,
    onPause,
    onReset,
    onClear,
  }) => {
    const { t } = useLanguage();

    // Memoized callbacks
    const handleTimeScaleChange = useCallback(
      (value: number) => {
        onTimeScaleChange(value);
      },
      [onTimeScaleChange]
    );

    const handleWallElasticityChange = useCallback(
      (value: number) => {
        onWallElasticityChange(value);
      },
      [onWallElasticityChange]
    );

    const handleModeChange = useCallback(
      (mode: CollisionMode) => {
        onModeChange(mode);
      },
      [onModeChange]
    );

    const handleStart = useCallback(() => {
      onStart();
    }, [onStart]);

    const handlePause = useCallback(() => {
      onPause();
    }, [onPause]);

    const handleReset = useCallback(() => {
      onReset();
    }, [onReset]);

    const handleClear = useCallback(() => {
      onClear();
    }, [onClear]);

    return (
      <View style={styles.container}>
        <SliderControl
          label={t('Simülasyon Hızı', 'Simulation Speed')}
          value={timeScale}
          unit="x"
          min={0.1}
          max={3.0}
          step={0.1}
          onValueChange={handleTimeScaleChange}
        />

        <SliderControl
          label={t('Duvar Esnekliği', 'Wall Elasticity')}
          value={wallElasticity}
          unit=""
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleWallElasticityChange}
        />

        <View style={styles.separator} />

        <View style={styles.modeSelector}>
          <Text style={styles.modeTitle}>
            {t('Çarpışma Modu', 'Collision Mode')}:
          </Text>
          <View style={styles.modeButtons}>
            <ModeButton
              mode={CollisionMode.BULLET}
              currentMode={collisionMode}
              label={t('Mermi Modu', 'Bullet Mode')}
              onPress={handleModeChange}
              disabled={isRunning}
            />
            <ModeButton
              mode={CollisionMode.COLLISION}
              currentMode={collisionMode}
              label={t('Çarpışma Modu', 'Collision Mode')}
              onPress={handleModeChange}
              disabled={isRunning}
            />
          </View>
          <Text style={styles.modeDescription}>
            {collisionMode === CollisionMode.BULLET
              ? t(
                  'Mermi hedefin içine saplanır ve birlikte hareket ederler',
                  'Projectile embeds in target and they move together'
                )
              : t(
                  'Mermi hedeften sekip momentum aktarır',
                  'Projectile bounces off target and transfers momentum'
                )}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.buttonRow}>
          {!isRunning ? (
            <ActionButton
              onPress={handleStart}
              disabled={projectilesCount === 0}
              style={styles.primaryButton}
              icon="play"
              iconColor="white"
              text={t('Başlat', 'Start')}
              textStyle={styles.buttonText}
            />
          ) : (
            <ActionButton
              onPress={handlePause}
              style={styles.secondaryButton}
              icon="pause"
              iconColor="#4b5563"
              text={t('Duraklat', 'Pause')}
              textStyle={styles.secondaryButtonText}
            />
          )}

          <ActionButton
            onPress={handleReset}
            disabled={projectilesCount === 0}
            style={styles.outlineButton}
            icon="refresh"
            iconFamily="MaterialIcons"
            iconColor="#4b5563"
            text={t('Sıfırla', 'Reset')}
            textStyle={styles.outlineButtonText}
          />

          <ActionButton
            onPress={handleClear}
            disabled={projectilesCount === 0}
            style={styles.outlineButton}
            icon="delete-outline"
            iconFamily="MaterialIcons"
            iconColor="#4b5563"
            text={t('Hepsini Temizle', 'Clear All')}
            textStyle={styles.outlineButtonText}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  sliderValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    minWidth: 100,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modeSelector: {
    marginBottom: 16,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  activeMode: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
  activeModeText: {
    color: 'white',
  },
  modeDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ControlPanel;
