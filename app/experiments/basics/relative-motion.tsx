import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useLanguage } from '../../../components/LanguageContext';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { RelativeMotionPhysics } from './lib/relative-motion-physics';
import { RelativeMotionSimulation } from './components/RelativeMotionSimulation';
import { RelativeMotionControls } from './components/RelativeMotionControls';

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isTablet = screenWidth > 1024;

const RelativeMotionExperiment: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [trainSpeed, setTrainSpeed] = useState(2.78); // 10 km/h in m/s (halved for better visualization)
  const [ballSpeed, setBallSpeed] = useState(7.5); // m/s (halved for better visualization)
  const [ballAngle, setBallAngle] = useState(45); // degrees
  const [time, setTime] = useState(0);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [trainPosition, setTrainPosition] = useState(0);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [trajectoryPoints, setTrajectoryPoints] = useState<
    Array<{ x: number; y: number }>
  >([]);
  const [isGrounded, setIsGrounded] = useState(false);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Memoize physics instance to prevent recreation
  const physics = useMemo(() => new RelativeMotionPhysics(), []);
  const { t } = useLanguage();

  // Memoize callback functions for better performance
  const startSimulation = useCallback(() => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
    setTime(0);
    setTrajectoryPoints([]);
    setBallPosition({ x: 0, y: 0 });
    setTrainPosition(0);
    setIsGrounded(false);
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setTime(0);
    setBallPosition({ x: 0, y: 0 });
    setTrainPosition(0);
    setTrajectoryPoints([]);
    setIsGrounded(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const toggleTrajectory = useCallback(() => {
    setShowTrajectory((prev) => !prev);
  }, []);

  // Optimize trajectory updates
  const updateTrajectoryPoints = useCallback(
    (newPoint: { x: number; y: number }) => {
      setTrajectoryPoints((prev) => {
        const newArray = [...prev, newPoint];
        // More efficient way to limit array size - reduced from 50 to 30 for better performance
        return newArray.length > 30 ? newArray.slice(-30) : newArray;
      });
    },
    []
  );

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        const currentTime = (Date.now() - startTimeRef.current) / 1000;
        setTime(currentTime);

        // Calculate train position
        const newTrainPos = trainSpeed * currentTime;
        setTrainPosition(newTrainPos);

        // Calculate ball position (relative to ground)
        const ballData = physics.calculateProjectileMotion(
          ballSpeed,
          ballAngle,
          currentTime,
          trainSpeed
        );

        setBallPosition({ x: ballData.x, y: ballData.y });
        setIsGrounded(ballData.isGrounded);

        // Add to trajectory if ball is in flight - optimized update
        if (ballData.y > 0) {
          updateTrajectoryPoints({ x: ballData.x, y: ballData.y });
        }

        // Continue animation if ball is still in flight
        if (ballData.y > 0 && !ballData.isGrounded) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsRunning(false);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    isRunning,
    ballSpeed,
    ballAngle,
    trainSpeed,
    physics,
    updateTrajectoryPoints,
  ]);

  return (
    <ExperimentLayout
      title="Göreceli Hareket"
      titleEn="Relative Motion"
      difficulty="Orta"
      difficultyEn="Intermediate"
      description="Farklı referans sistemlerinden hareketin nasıl göründüğünü keşfedin. Trenin içindeki gözlemci ile yerdeki gözlemci aynı hareketi farklı şekilde görür."
      descriptionEn="Discover how motion appears from different reference frames. The observer inside the train and the observer on the ground see the same motion differently."
      isRunning={isRunning}
      onToggleSimulation={isRunning ? pauseSimulation : startSimulation}
      onReset={resetSimulation}
      hideControls={false}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Controls */}
        <RelativeMotionControls
          trainSpeed={trainSpeed}
          ballSpeed={ballSpeed}
          ballAngle={ballAngle}
          onTrainSpeedChange={setTrainSpeed}
          onBallSpeedChange={setBallSpeed}
          onBallAngleChange={setBallAngle}
          showTrajectory={showTrajectory}
          onToggleTrajectory={toggleTrajectory}
          isRunning={isRunning}
        />

        {/* Dual Simulation Views */}
        <View
          style={[
            styles.simulationContainer,
            (isWeb || isTablet) && styles.simulationContainerRow,
          ]}
        >
          {/* Ground View */}
          <View style={styles.simulationWrapper}>
            <View style={styles.simulationHeader}>
              <Text style={styles.simulationTitle}>
                🌍 {t('Yer Referans Sistemi', 'Ground Reference Frame')}
              </Text>
            </View>
            <RelativeMotionSimulation
              ballPosition={ballPosition}
              trainPosition={trainPosition}
              trajectoryPoints={trajectoryPoints}
              isGroundView={true}
              showTrajectory={showTrajectory}
              trainSpeed={trainSpeed}
              time={time}
              isGrounded={isGrounded}
            />
          </View>

          {/* Train View */}
          <View style={styles.simulationWrapper}>
            <View style={styles.simulationHeader}>
              <Text style={styles.simulationTitle}>
                🚂 {t('Tren Referans Sistemi', 'Train Reference Frame')}
              </Text>
            </View>
            <RelativeMotionSimulation
              ballPosition={ballPosition}
              trainPosition={trainPosition}
              trajectoryPoints={trajectoryPoints}
              isGroundView={false}
              showTrajectory={showTrajectory}
              trainSpeed={trainSpeed}
              time={time}
              isGrounded={isGrounded}
            />
          </View>
        </View>

        {/* Real-time Data Comparison */}
        <View style={styles.dataComparisonContainer}>
          <View style={styles.dataComparisonHeader}>
            <Text style={styles.dataComparisonTitle}>
              📊 {t('Anlık Veriler', 'Real-time Data')}
            </Text>
          </View>

          <View
            style={[
              styles.dataComparisonContent,
              (isWeb || isTablet) && styles.dataComparisonContentRow,
            ]}
          >
            {/* Ground Reference Data */}
            <View style={[styles.dataFrame, styles.groundDataFrame]}>
              <Text style={styles.dataFrameTitle}>
                🌍 {t('Yer Referansı', 'Ground Reference')}
              </Text>
              <View style={styles.dataRows}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>{t('Top X:', 'Ball X:')}</Text>
                  <Text style={styles.dataValue}>
                    {ballPosition.x.toFixed(1)} m
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>{t('Top Y:', 'Ball Y:')}</Text>
                  <Text style={styles.dataValue}>
                    {ballPosition.y.toFixed(1)} m
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>{t('Tren:', 'Train:')}</Text>
                  <Text style={styles.dataValue}>
                    {trainPosition.toFixed(1)} m
                  </Text>
                </View>
              </View>
            </View>

            {/* Train Reference Data */}
            <View style={[styles.dataFrame, styles.trainDataFrame]}>
              <Text style={styles.dataFrameTitle}>
                🚂 {t('Tren Referansı', 'Train Reference')}
              </Text>
              <View style={styles.dataRows}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>{t('Top X:', 'Ball X:')}</Text>
                  <Text style={styles.dataValue}>
                    {(ballPosition.x - trainPosition).toFixed(1)} m
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>{t('Top Y:', 'Ball Y:')}</Text>
                  <Text style={styles.dataValue}>
                    {ballPosition.y.toFixed(1)} m
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>{t('Tren:', 'Train:')}</Text>
                  <Text style={[styles.dataValue, styles.fixedValue]}>
                    0.0 m {t('(sabit)', '(fixed)')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Data Insight */}
          <View style={styles.dataInsight}>
            <Text style={styles.dataInsightText}>
              💡{' '}
              {t(
                'Dikkat: Y koordinatı her iki referansta da aynı, ancak X koordinatı farklı!',
                'Notice: Y coordinate is the same in both references, but X coordinate differs!'
              )}
            </Text>
          </View>
        </View>

        {/* Comparison Section */}
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonTitle}>
              {t(
                'Referans Sistemleri Karşılaştırması',
                'Reference Frame Comparison'
              )}
            </Text>
          </View>

          <View style={styles.comparisonContent}>
            <View style={[styles.comparisonItem, styles.groundComparison]}>
              <Text style={styles.comparisonIcon}>🌍</Text>
              <View style={styles.comparisonText}>
                <Text style={styles.comparisonLabel}>
                  {t('Yerdeki Gözlemci', 'Ground Observer')}
                </Text>
                <Text style={styles.comparisonDescription}>
                  {t(
                    'Top parabolik yörünge izler. Hem yatay hem de dikey bileşeni vardır.',
                    'Ball follows parabolic trajectory. Has both horizontal and vertical components.'
                  )}
                </Text>
              </View>
            </View>

            <View style={[styles.comparisonItem, styles.trainComparison]}>
              <Text style={styles.comparisonIcon}>🚂</Text>
              <View style={styles.comparisonText}>
                <Text style={styles.comparisonLabel}>
                  {t('Trendeki Gözlemci', 'Train Observer')}
                </Text>
                <Text style={styles.comparisonDescription}>
                  {t(
                    'Top sadece dikey hareket eder. Yatay bileşen yoktur.',
                    'Ball moves only vertically. No horizontal component.'
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Theory Summary */}
        <View style={styles.theoryContainer}>
          <View style={styles.theorySection}>
            <View style={styles.theoryHeader}>
              <View style={styles.theoryIcon}>
                <View style={styles.iconCircle}>
                  <View style={styles.iconDot} />
                </View>
              </View>
              <View style={styles.theoryHeaderText}>
                <Text style={styles.theoryTitle}>
                  {t('Göreceli Hareket Teorisi', 'Relative Motion Theory')}
                </Text>
                <Text style={styles.theorySubtitle}>
                  {t(
                    "Einstein'ın Özel Görelilik Teorisinin Temeli",
                    "Foundation of Einstein's Special Relativity"
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.theoryContent}>
              <Text style={styles.theoryText}>
                {t(
                  'Bu deney, hareketin göreceli olduğunu gösterir. Aynı fiziksel olay, farklı referans sistemlerinden farklı şekilde gözlemlenir:',
                  'This experiment demonstrates that motion is relative. The same physical event is observed differently from different reference frames:'
                )}
              </Text>

              <View style={styles.theoryPoints}>
                <View style={styles.theoryPoint}>
                  <Text style={styles.pointBullet}>⚖️</Text>
                  <Text style={styles.pointText}>
                    {t(
                      'Her iki gözlemci de doğrudur - hareket görecelidir',
                      'Both observers are correct - motion is relative'
                    )}
                  </Text>
                </View>

                <View style={styles.theoryPoint}>
                  <Text style={styles.pointBullet}>🔄</Text>
                  <Text style={styles.pointText}>
                    {t(
                      'Referans sisteminin değişmesi hareketin görünümünü değiştirir',
                      'Changing reference frame changes the appearance of motion'
                    )}
                  </Text>
                </View>

                <View style={styles.theoryPoint}>
                  <Text style={styles.pointBullet}>🌌</Text>
                  <Text style={styles.pointText}>
                    {t(
                      'Bu prensipler evrensel geçerliliğe sahiptir',
                      'These principles have universal validity'
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  simulationContainer: {
    alignItems: 'center',
    marginVertical: 20,
    gap: 20,
  },
  simulationContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  simulationWrapper: {
    alignItems: 'center',
    flex: isWeb || isTablet ? 1 : undefined,
    maxWidth: isWeb || isTablet ? undefined : '100%',
  },
  simulationHeader: {
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  simulationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dbeafe',
    textAlign: 'center',
  },
  dataComparisonContainer: {
    margin: 16,
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  dataComparisonHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  dataComparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  dataComparisonContent: {
    gap: 16,
  },
  dataComparisonContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    gap: 16,
  },
  dataFrame: {
    flex: isWeb || isTablet ? 1 : undefined,
    width: isWeb || isTablet ? undefined : '100%',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  groundDataFrame: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  trainDataFrame: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  dataFrameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  dataRows: {
    gap: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  fixedValue: {
    color: '#94a3b8',
  },
  dataInsight: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  dataInsightText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  comparisonContainer: {
    margin: 16,
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  comparisonHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  comparisonContent: {
    gap: 16,
  },
  comparisonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  groundComparison: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  trainComparison: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  comparisonIcon: {
    fontSize: 24,
    width: 32,
  },
  comparisonText: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  comparisonDescription: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  theoryContainer: {
    margin: 16,
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  theorySection: {
    gap: 16,
  },
  theoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  theoryIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  theoryHeaderText: {
    flex: 1,
  },
  theoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  theorySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  theoryContent: {
    gap: 16,
  },
  theoryText: {
    fontSize: 15,
    color: '#e2e8f0',
    lineHeight: 22,
  },
  theoryPoints: {
    gap: 12,
  },
  theoryPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  pointBullet: {
    fontSize: 18,
    width: 30,
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
});

export default RelativeMotionExperiment;
