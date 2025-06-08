import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { CustomSlider } from '../../../../../components/ui/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { TargetBox } from '../../utils/momentum-bullet/physics';
import { MaterialIcons } from '@expo/vector-icons';

interface ProjectileSettingsProps {
  canvasWidth: number;
  canvasHeight: number;
  onAddProjectile: (projectile: any) => void;
  onUpdateTargetBox: (updates: Partial<TargetBox>) => void;
  targetBox: TargetBox;
  disabled: boolean;
}

// Memoized Slider Section Component
const SliderSection = memo<{
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  disabled: boolean;
  helperText?: string;
}>(
  ({
    label,
    value,
    unit,
    min,
    max,
    step,
    onValueChange,
    disabled,
    helperText,
  }) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>
          {value.toFixed(step < 1 ? 1 : 0)} {unit}
        </Text>
      </View>
      <CustomSlider
        style={styles.slider}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={onValueChange}
        disabled={disabled}
        minimumTrackTintColor="#3b82f6"
        maximumTrackTintColor="#d1d5db"
        thumbTintColor="#3b82f6"
      />
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  )
);

// Memoized Input Section Component
const InputSection = memo<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled: boolean;
  keyboardType?: 'numeric' | 'default';
}>(({ label, value, onChangeText, disabled, keyboardType = 'default' }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
      editable={!disabled}
    />
  </View>
));

// Memoized Color Option Component
const ColorOption = memo<{
  color: string;
  isSelected: boolean;
  onPress: (color: string) => void;
  disabled: boolean;
}>(({ color, isSelected, onPress, disabled }) => (
  <TouchableOpacity
    style={[
      styles.colorOption,
      { backgroundColor: color },
      isSelected && styles.selectedColor,
    ]}
    onPress={() => onPress(color)}
    disabled={disabled}
    activeOpacity={0.7}
  />
));

// Memoized Toggle Section Component
const ToggleSection = memo<{
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled: boolean;
}>(({ label, value, onValueChange, disabled }) => (
  <View style={styles.toggleContainer}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
      thumbColor={value ? '#3b82f6' : '#f4f3f4'}
    />
  </View>
));

const ProjectileSettings = memo<ProjectileSettingsProps>(
  ({
    canvasWidth,
    canvasHeight,
    onAddProjectile,
    onUpdateTargetBox,
    targetBox,
    disabled,
  }) => {
    const { t } = useLanguage();
    const [mass, setMass] = useState(5);
    const [velocity, setVelocity] = useState(30);

    // Memoized color options
    const colorOptions = useMemo(
      () => ['#6B7280', '#EF4444', '#3B82F6', '#10B981', '#F59E0B'],
      []
    );

    useEffect(() => {
      onUpdateTargetBox({ isFixed: false });
    }, [onUpdateTargetBox]);

    // Memoized callbacks for projectile settings
    const handleMassChange = useCallback((value: number) => {
      setMass(value);
    }, []);

    const handleVelocityChange = useCallback((value: number) => {
      setVelocity(value);
    }, []);

    // Memoized callbacks for target box settings
    const handleHardnessChange = useCallback(
      (value: number) => {
        onUpdateTargetBox({ hardness: value });
      },
      [onUpdateTargetBox]
    );

    const handleThicknessChange = useCallback(
      (value: number) => {
        onUpdateTargetBox({ thickness: value });
      },
      [onUpdateTargetBox]
    );

    const handleMassBoxChange = useCallback(
      (value: number) => {
        onUpdateTargetBox({ mass: value });
      },
      [onUpdateTargetBox]
    );

    const handleFixedToggle = useCallback(
      (checked: boolean) => {
        onUpdateTargetBox({ isFixed: checked });
      },
      [onUpdateTargetBox]
    );

    const handleColorChange = useCallback(
      (color: string) => {
        onUpdateTargetBox({ color });
      },
      [onUpdateTargetBox]
    );

    const handleWidthChange = useCallback(
      (text: string) => {
        const width = Number(text);
        if (!isNaN(width) && width >= 20 && width <= canvasWidth / 2) {
          onUpdateTargetBox({ width });
        }
      },
      [canvasWidth, onUpdateTargetBox]
    );

    const handleHeightChange = useCallback(
      (text: string) => {
        const height = Number(text);
        if (!isNaN(height) && height >= 20 && height <= canvasHeight / 2) {
          onUpdateTargetBox({ height });
        }
      },
      [canvasHeight, onUpdateTargetBox]
    );

    const handleAddProjectile = useCallback(() => {
      // Hedef kutu merkezine doğru yön vektörünü hesapla
      const targetCenterX = targetBox.position.x + targetBox.width / 2;
      const targetCenterY = targetBox.position.y + targetBox.height / 2;

      // Ekranın solundan başlangıç konumu
      const startX = canvasWidth / 10;
      const startY = canvasHeight / 2;

      // Yön vektörünü hesapla
      const dx = targetCenterX - startX;
      const dy = targetCenterY - startY;

      // Yön vektörünü normalize et
      const length = Math.sqrt(dx * dx + dy * dy);
      const normalizedDx = dx / length;
      const normalizedDy = dy / length;

      // Hedef yönünde hızı belirle
      const initialVelocity = {
        x: velocity * normalizedDx,
        y: velocity * normalizedDy,
      };

      const projectile = {
        position: { x: startX, y: startY },
        velocity: initialVelocity,
        acceleration: { x: 0, y: 0 },
        mass: mass,
        radius: mass * 1.5,
        color: '#F472B6',
        elasticity: 0.8,
      };

      onAddProjectile(projectile);
    }, [mass, velocity, targetBox, canvasWidth, canvasHeight, onAddProjectile]);

    return (
      <ScrollView style={styles.container}>
        {/* Mermi ayarları bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('Mermi Ayarları', 'Projectile Settings')}
          </Text>

          <SliderSection
            label={t('Mermi Kütlesi (kg)', 'Projectile Mass (kg)')}
            value={mass}
            unit="kg"
            min={1}
            max={10}
            step={0.1}
            onValueChange={handleMassChange}
            disabled={disabled}
          />

          <SliderSection
            label={t('Hız (m/s)', 'Velocity (m/s)')}
            value={velocity}
            unit="m/s"
            min={1}
            max={80}
            step={1}
            onValueChange={handleVelocityChange}
            disabled={disabled}
          />

          {/* Mermi Ekle butonu */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              disabled && styles.disabledButton,
            ]}
            onPress={handleAddProjectile}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {t('Mermi Ekle', 'Add Projectile')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hedef kutu ayarları bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('Hedef Kutu Ayarları', 'Target Box Settings')}
          </Text>

          <SliderSection
            label={t('Kutu Kütlesi (kg)', 'Box Mass (kg)')}
            value={targetBox.mass}
            unit="kg"
            min={1}
            max={50}
            step={1}
            onValueChange={handleMassBoxChange}
            disabled={disabled}
          />

          {/* Kutu boyutu ayarları */}
          <View style={styles.row}>
            <View style={[styles.halfWidth]}>
              <InputSection
                label={t('Genişlik', 'Width')}
                value={String(targetBox.width)}
                onChangeText={handleWidthChange}
                disabled={disabled}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.halfWidth]}>
              <InputSection
                label={t('Yükseklik', 'Height')}
                value={String(targetBox.height)}
                onChangeText={handleHeightChange}
                disabled={disabled}
                keyboardType="numeric"
              />
            </View>
          </View>

          <SliderSection
            label={t('Malzeme Sertliği', 'Material Hardness')}
            value={targetBox.hardness || 8}
            unit=""
            min={1}
            max={20}
            step={0.5}
            onValueChange={handleHardnessChange}
            disabled={disabled}
            helperText={t(
              'Düşük değer = Kolay delinir, Yüksek değer = Zor delinir',
              'Low value = Easy to penetrate, High value = Hard to penetrate'
            )}
          />

          <SliderSection
            label={t('Malzeme Kalınlığı (cm)', 'Material Thickness (cm)')}
            value={targetBox.thickness || 5}
            unit="cm"
            min={1}
            max={20}
            step={0.5}
            onValueChange={handleThicknessChange}
            disabled={disabled}
            helperText={t(
              'Düşük değer = İnce malzeme, Yüksek değer = Kalın malzeme',
              'Low value = Thin material, High value = Thick material'
            )}
          />

          <ToggleSection
            label={t('Sabit Kutu', 'Fixed Box')}
            value={targetBox.isFixed}
            onValueChange={handleFixedToggle}
            disabled={disabled}
          />

          {/* Kutu rengi seçimi */}
          <View style={styles.colorSection}>
            <Text style={styles.colorSectionLabel}>{t('Renk', 'Color')}</Text>
            <View style={styles.colorOptions}>
              {colorOptions.map((color) => (
                <ColorOption
                  key={color}
                  color={color}
                  isSelected={targetBox.color === color}
                  onPress={handleColorChange}
                  disabled={disabled}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  sliderContainer: {
    marginBottom: 16,
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
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  colorSection: {
    marginBottom: 16,
  },
  colorSectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default ProjectileSettings;
