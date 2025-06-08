import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import { presetScenarios, Scenario } from '../../utils/presetScenarios';

interface PresetScenariosProps {
  currentScenario: string | null;
  onScenarioSelect: (scenario: Scenario) => void;
}

const PresetScenarios: React.FC<PresetScenariosProps> = memo(
  ({ currentScenario, onScenarioSelect }) => {
    const { t } = useLanguage();

    const getLevelColor = (level: string) => {
      switch (level) {
        case 'beginner':
          return {
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderColor: 'rgba(34, 197, 94, 0.5)',
            textColor: '#22c55e',
          };
        case 'intermediate':
          return {
            backgroundColor: 'rgba(234, 179, 8, 0.2)',
            borderColor: 'rgba(234, 179, 8, 0.5)',
            textColor: '#eab308',
          };
        case 'advanced':
          return {
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgba(239, 68, 68, 0.5)',
            textColor: '#ef4444',
          };
        default:
          return {
            backgroundColor: 'rgba(107, 114, 128, 0.2)',
            borderColor: 'rgba(107, 114, 128, 0.5)',
            textColor: '#6b7280',
          };
      }
    };

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>
            🎯 {t('Hazır Senaryolar', 'Preset Scenarios')}
          </Text>
        </View>

        <View style={styles.scenarioGrid}>
          {presetScenarios.map((scenario) => {
            const isActive = currentScenario === scenario.id;
            const levelStyle = getLevelColor(scenario.level);

            return (
              <TouchableOpacity
                key={scenario.id}
                style={[
                  styles.scenarioCard,
                  isActive && styles.activeScenarioCard,
                ]}
                onPress={() => onScenarioSelect(scenario)}
              >
                {/* Compact Header */}
                <View style={styles.scenarioHeader}>
                  <Text style={styles.scenarioIcon}>{scenario.icon}</Text>
                  <View style={styles.scenarioTitleContainer}>
                    <Text style={styles.scenarioName} numberOfLines={1}>
                      {t(scenario.name, scenario.nameEn)}
                    </Text>
                    <View style={[styles.levelBadge, levelStyle]}>
                      <Text
                        style={[
                          styles.levelText,
                          { color: levelStyle.textColor },
                        ]}
                      >
                        {t(
                          scenario.level === 'beginner'
                            ? 'Başlangıç'
                            : scenario.level === 'intermediate'
                            ? 'Orta'
                            : 'İleri',
                          scenario.level
                        )}
                      </Text>
                    </View>
                  </View>
                  {isActive && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>✓</Text>
                    </View>
                  )}
                </View>

                {/* Compact Parameters */}
                <View style={styles.parametersContainer}>
                  <Text style={styles.parameterText}>
                    S1: {scenario.sources[0].frequency}Hz • S2:{' '}
                    {scenario.sources[1].frequency}Hz • v: {scenario.waveSpeed}
                    m/s
                  </Text>
                </View>

                {/* Apply Button */}
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    isActive && styles.activeApplyButton,
                  ]}
                  onPress={() => onScenarioSelect(scenario)}
                >
                  <Text
                    style={[
                      styles.applyButtonText,
                      isActive && styles.activeApplyButtonText,
                    ]}
                  >
                    {isActive ? t('✓ Aktif', '✓ Active') : t('Uygula', 'Apply')}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Compact Custom Experiment Tip */}
        <View style={styles.customCard}>
          <Text style={styles.customTitle}>
            🔬{' '}
            {t(
              'Kendi parametrelerinizi kontrol panelinden ayarlayın',
              'Adjust your own parameters from the control panel'
            )}
          </Text>
        </View>
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  scenarioGrid: {
    gap: 8,
  },
  scenarioCard: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  activeScenarioCard: {
    borderColor: '#06b6d4',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scenarioIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  scenarioTitleContainer: {
    flex: 1,
  },
  scenarioName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  activeBadge: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  activeBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 9,
    fontWeight: '500',
  },
  parametersContainer: {
    marginBottom: 8,
  },
  parameterText: {
    fontSize: 10,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  activeApplyButton: {
    backgroundColor: '#22c55e',
  },
  applyButtonText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  activeApplyButtonText: {
    color: '#ffffff',
  },
  customCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  customTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
  },
});

export default PresetScenarios;
