import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { Eye, EyeOff } from 'lucide-react-native';
import { useLanguage } from '../../../../components/LanguageContext';

interface RelativeMotionControlsProps {
  trainSpeed: number;
  ballSpeed: number;
  ballAngle: number;
  onTrainSpeedChange: (value: number) => void;
  onBallSpeedChange: (value: number) => void;
  onBallAngleChange: (value: number) => void;
  showTrajectory: boolean;
  onToggleTrajectory: () => void;
  isRunning?: boolean;
}

export const RelativeMotionControls: React.FC<RelativeMotionControlsProps> = ({
  trainSpeed,
  ballSpeed,
  ballAngle,
  onTrainSpeedChange,
  onBallSpeedChange,
  onBallAngleChange,
  showTrajectory,
  onToggleTrajectory,
  isRunning = false,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      {/* Parameters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('Parametreler', 'Parameters')}
        </Text>

        {/* Train Speed */}
        <View style={styles.parameterGroup}>
          <Text style={styles.parameterLabel}>
            {t('Tren Hızı', 'Train Speed')}: {(trainSpeed * 3.6).toFixed(0)}{' '}
            km/h
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={30}
            value={trainSpeed * 3.6}
            onValueChange={(value) => onTrainSpeedChange(value / 3.6)}
            step={1}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#64748b"
            disabled={isRunning}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0</Text>
            <Text style={styles.sliderLabel}>30 km/h</Text>
          </View>
        </View>

        {/* Ball Speed */}
        <View style={styles.parameterGroup}>
          <Text style={styles.parameterLabel}>
            {t('Top Hızı', 'Ball Speed')}: {ballSpeed.toFixed(1)} m/s
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={25}
            value={ballSpeed}
            onValueChange={onBallSpeedChange}
            step={0.5}
            minimumTrackTintColor="#10b981"
            maximumTrackTintColor="#64748b"
            disabled={isRunning}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>5</Text>
            <Text style={styles.sliderLabel}>25 m/s</Text>
          </View>
        </View>

        {/* Ball Angle */}
        <View style={styles.parameterGroup}>
          <Text style={styles.parameterLabel}>
            {t('Atış Açısı', 'Launch Angle')}: {ballAngle.toFixed(0)}°
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={75}
            value={ballAngle}
            onValueChange={onBallAngleChange}
            step={1}
            minimumTrackTintColor="#f59e0b"
            maximumTrackTintColor="#64748b"
            disabled={isRunning}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>15°</Text>
            <Text style={styles.sliderLabel}>75°</Text>
          </View>
        </View>
      </View>

      {/* Display Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('Görüntü Seçenekleri', 'Display Options')}
        </Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleItem}>
            {showTrajectory ? (
              <Eye size={20} color="#3b82f6" />
            ) : (
              <EyeOff size={20} color="#64748b" />
            )}
            <Text style={styles.toggleLabel}>
              {t('Yörüngeyi Göster', 'Show Trajectory')}
            </Text>
            <Switch
              value={showTrajectory}
              onValueChange={onToggleTrajectory}
              trackColor={{ false: '#374151', true: '#3b82f6' }}
              thumbColor={showTrajectory ? '#dbeafe' : '#9ca3af'}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 12,
    textAlign: 'center',
  },
  parameterGroup: {
    marginBottom: 16,
  },
  parameterLabel: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  toggleRow: {
    gap: 12,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleLabel: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 14,
    marginLeft: 8,
  },
});
