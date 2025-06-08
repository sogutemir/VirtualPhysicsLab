import React, { useMemo, memo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Polyline,
  Line,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
  Ellipse,
  Polygon,
} from 'react-native-svg';
import { useLanguage } from '../../../../components/LanguageContext';

interface RelativeMotionSimulationProps {
  ballPosition: { x: number; y: number };
  trainPosition: number;
  trajectoryPoints: Array<{ x: number; y: number }>;
  isGroundView: boolean;
  showTrajectory: boolean;
  trainSpeed: number;
  time: number;
  isGrounded: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const CANVAS_WIDTH = Math.min(screenWidth - 40, 400);
const CANVAS_HEIGHT = 300;
const SCALE = 8; // pixels per meter
const TRAIN_LENGTH = 80;
const TRAIN_HEIGHT = 40;

// Memoized Grid Component for better performance
const GridLines = memo(() => (
  <>
    {Array.from({ length: Math.ceil(CANVAS_WIDTH / 40) }, (_, i) => (
      <Line
        key={`vline-${i}`}
        x1={i * 40}
        y1="0"
        x2={i * 40}
        y2={CANVAS_HEIGHT}
        stroke="rgba(113, 128, 150, 0.2)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
    ))}
    {Array.from({ length: Math.ceil(CANVAS_HEIGHT / 30) }, (_, i) => (
      <Line
        key={`hline-${i}`}
        x1="0"
        y1={i * 30}
        x2={CANVAS_WIDTH}
        y2={i * 30}
        stroke="rgba(113, 128, 150, 0.2)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
    ))}
  </>
));

// Memoized trajectory component for performance
const TrajectoryPath = memo<{
  adjustedTrajectoryPoints: Array<{ x: number; y: number }>;
  isGroundView: boolean;
  showTrajectory: boolean;
}>(({ adjustedTrajectoryPoints, isGroundView, showTrajectory }) => {
  const optimizedPoints = useMemo(() => {
    // Show every 2nd point for better performance
    return adjustedTrajectoryPoints.filter((_, i) => i % 2 === 0);
  }, [adjustedTrajectoryPoints]);

  if (!showTrajectory || adjustedTrajectoryPoints.length <= 1) {
    return null;
  }

  return (
    <>
      <Polyline
        points={adjustedTrajectoryPoints.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={isGroundView ? '#3b82f6' : '#9333ea'}
        strokeWidth="2"
        opacity="0.8"
      />
      {optimizedPoints.map((point, i) => (
        <Circle
          key={`traj-point-${i}`}
          cx={point.x}
          cy={point.y}
          r="1.5"
          fill={isGroundView ? '#3b82f6' : '#9333ea'}
        />
      ))}
    </>
  );
});

export const RelativeMotionSimulation: React.FC<RelativeMotionSimulationProps> =
  memo(
    ({
      ballPosition,
      trainPosition,
      trajectoryPoints,
      isGroundView,
      showTrajectory,
      trainSpeed,
      time,
      isGrounded,
    }) => {
      const { t } = useLanguage();

      // Create unique IDs to prevent SVG conflicts
      const viewId = isGroundView ? 'ground' : 'train';
      const gradientIds = useMemo(
        () => ({
          background: `backgroundGradient_${viewId}`,
          ground: `groundGradient_${viewId}`,
          train: `trainGradient_${viewId}`,
          ball: `ballGradient_${viewId}`,
        }),
        [viewId]
      );

      const { displayTrainPos, displayBallPos, adjustedTrajectoryPoints } =
        useMemo(() => {
          // Calculate positions based on view type
          let displayTrainPos = isGroundView
            ? trainPosition * SCALE
            : CANVAS_WIDTH / 2 - TRAIN_LENGTH / 2;
          let displayBallPos = isGroundView
            ? {
                x: ballPosition.x * SCALE,
                y: CANVAS_HEIGHT - 30 - ballPosition.y * SCALE,
              }
            : {
                x: (ballPosition.x - trainPosition) * SCALE + CANVAS_WIDTH / 2,
                y: CANVAS_HEIGHT - 30 - ballPosition.y * SCALE,
              };

          // Adjust for camera following in ground view
          if (isGroundView && trainPosition > 20) {
            const offset = (trainPosition - 20) * SCALE;
            displayTrainPos -= offset;
            displayBallPos.x -= offset;
          }

          // Adjust trajectory points
          const adjustedTrajectoryPoints = trajectoryPoints.map((point) => {
            let x = isGroundView
              ? point.x * SCALE
              : (point.x - trainPosition) * SCALE + CANVAS_WIDTH / 2;
            let y = CANVAS_HEIGHT - 30 - point.y * SCALE;

            if (isGroundView && trainPosition > 20) {
              x -= (trainPosition - 20) * SCALE;
            }

            return { x, y };
          });

          return { displayTrainPos, displayBallPos, adjustedTrajectoryPoints };
        }, [ballPosition, trainPosition, trajectoryPoints, isGroundView]);

      // Memoize velocity vector calculations
      const velocityVector = useMemo(() => {
        if (ballPosition.y <= 0 || isGrounded) return null;

        const startX = displayBallPos.x;
        const startY = displayBallPos.y;
        const endX = startX + (isGroundView ? trainSpeed + 8 : 8) * 3;
        const endY = startY - Math.max(3, 12 - time * 8) * 2;

        return { startX, startY, endX, endY };
      }, [
        displayBallPos,
        isGroundView,
        trainSpeed,
        time,
        ballPosition.y,
        isGrounded,
      ]);

      return (
        <View style={styles.container}>
          <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={styles.svg}>
            <Defs>
              {/* Background gradient */}
              <LinearGradient
                id={gradientIds.background}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#1a1f3a" />
                <Stop offset="100%" stopColor="#0f172a" />
              </LinearGradient>

              {/* Ground gradient */}
              <LinearGradient
                id={gradientIds.ground}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#4a5568" />
                <Stop offset="100%" stopColor="#2d3748" />
              </LinearGradient>

              {/* Train gradient */}
              <LinearGradient
                id={gradientIds.train}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#4299e1" />
                <Stop offset="100%" stopColor="#2b6cb0" />
              </LinearGradient>

              {/* Ball gradient */}
              <RadialGradient id={gradientIds.ball} cx="30%" cy="30%" r="70%">
                <Stop offset="0%" stopColor="#fbbf24" />
                <Stop offset="100%" stopColor="#f59e0b" />
              </RadialGradient>
            </Defs>

            {/* Background */}
            <Rect
              x="0"
              y="0"
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              fill={`url(#${gradientIds.background})`}
            />

            {/* Grid lines - Memoized component */}
            <GridLines />

            {/* Ground */}
            <Rect
              x="0"
              y={CANVAS_HEIGHT - 25}
              width={CANVAS_WIDTH}
              height="25"
              fill={`url(#${gradientIds.ground})`}
            />

            {/* Train shadow */}
            <Ellipse
              cx={displayTrainPos + TRAIN_LENGTH / 2 + 3}
              cy={CANVAS_HEIGHT - 22}
              rx={TRAIN_LENGTH / 2}
              ry="5"
              fill="rgba(0, 0, 0, 0.3)"
            />

            {/* Train body */}
            <Rect
              x={displayTrainPos}
              y={CANVAS_HEIGHT - 25 - TRAIN_HEIGHT}
              width={TRAIN_LENGTH}
              height={TRAIN_HEIGHT}
              rx="5"
              fill={`url(#${gradientIds.train})`}
            />

            {/* Train details */}
            <Rect
              x={displayTrainPos + 4}
              y={CANVAS_HEIGHT - 25 - TRAIN_HEIGHT + 4}
              width={TRAIN_LENGTH - 8}
              height={TRAIN_HEIGHT - 8}
              rx="3"
              fill="#1e40af"
            />

            {/* Train windows */}
            {Array.from({ length: 3 }, (_, i) => (
              <Rect
                key={`window-${i}`}
                x={displayTrainPos + 10 + i * 20}
                y={CANVAS_HEIGHT - 25 - TRAIN_HEIGHT + 10}
                width="12"
                height="8"
                rx="1"
                fill="#bfdbfe"
              />
            ))}

            {/* Train wheels */}
            {Array.from({ length: 4 }, (_, i) => (
              <Circle
                key={`wheel-${i}`}
                cx={displayTrainPos + 15 + i * 15}
                cy={CANVAS_HEIGHT - 25}
                r="6"
                fill="#374151"
              />
            ))}

            {/* Person in train */}
            <Circle
              cx={displayTrainPos + 25}
              cy={CANVAS_HEIGHT - 35}
              r="4"
              fill="#f59e0b"
            />
            <Rect
              x={displayTrainPos + 22}
              y={CANVAS_HEIGHT - 45}
              width="6"
              height="10"
              fill="#dc2626"
            />

            {/* Trajectory - Memoized component */}
            <TrajectoryPath
              adjustedTrajectoryPoints={adjustedTrajectoryPoints}
              isGroundView={isGroundView}
              showTrajectory={showTrajectory}
            />

            {/* Ball shadow */}
            {(ballPosition.y > 0 || isGrounded) && (
              <Ellipse
                cx={displayBallPos.x}
                cy={CANVAS_HEIGHT - 20}
                rx="6"
                ry="3"
                fill="rgba(0, 0, 0, 0.4)"
              />
            )}

            {/* Ball */}
            {(ballPosition.y > 0 || isGrounded) && (
              <>
                <Circle
                  cx={displayBallPos.x}
                  cy={displayBallPos.y}
                  r="8"
                  fill={`url(#${gradientIds.ball})`}
                />
                <Circle
                  cx={displayBallPos.x - 2}
                  cy={displayBallPos.y - 2}
                  r="2"
                  fill="#fef3c7"
                />
              </>
            )}

            {/* Velocity vector - Optimized */}
            {velocityVector && (
              <>
                <Line
                  x1={velocityVector.startX}
                  y1={velocityVector.startY}
                  x2={velocityVector.endX}
                  y2={velocityVector.endY}
                  stroke="#ec4899"
                  strokeWidth="3"
                />
                {/* Arrow head */}
                <Polygon
                  points={`${velocityVector.endX},${velocityVector.endY} ${
                    velocityVector.endX - 6
                  },${velocityVector.endY - 3} ${velocityVector.endX - 6},${
                    velocityVector.endY + 3
                  }`}
                  fill="#ec4899"
                />
              </>
            )}
          </Svg>

          {/* Status and data display */}
          <View style={styles.dataContainer}>
            <Text
              style={[
                styles.statusText,
                {
                  color: isGrounded
                    ? '#ef4444'
                    : ballPosition.y > 0
                    ? '#22c55e'
                    : '#6b7280',
                },
              ]}
            >
              ●{' '}
              {isGrounded
                ? t('Top yere düştü', 'Ball hit ground')
                : ballPosition.y > 0
                ? t('Top havada', 'Ball in air')
                : t('Deney hazır', 'Ready to start')}
            </Text>
            <Text style={styles.dataText}>
              {t('Zaman', 'Time')}: {time.toFixed(1)}s | {t('Top', 'Ball')}: (
              {ballPosition.x.toFixed(1)}, {ballPosition.y.toFixed(1)})m
            </Text>
            <Text style={styles.dataText}>
              {t('Tren', 'Train')}: {trainPosition.toFixed(1)}m |{' '}
              {t('Hız', 'Speed')}: {(trainSpeed * 3.6).toFixed(0)} km/h
            </Text>
          </View>

          {/* Explanation */}
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationText}>
              {isGroundView ? (
                <>
                  <Text style={{ color: '#4299e1' }}>📐</Text>{' '}
                  {t(
                    'Yerdeki gözlemci: Top hem ileri hem de yukarı hareket eder (parabolik yörünge)',
                    'Ground observer: Ball moves both forward and upward (parabolic trajectory)'
                  )}
                </>
              ) : (
                <>
                  <Text style={{ color: '#9333ea' }}>🎯</Text>{' '}
                  {t(
                    'Trendeki gözlemci: Top sadece yukarı ve aşağı hareket eder (dikey yörünge)',
                    'Train observer: Ball moves only up and down (vertical trajectory)'
                  )}
                </>
              )}
            </Text>
          </View>
        </View>
      );
    }
  );

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  svg: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: '#0f172a',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dataContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  dataText: {
    fontSize: 12,
    color: '#cbd5e1',
    marginVertical: 1,
  },
  explanationContainer: {
    marginTop: 12,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 8,
    padding: 12,
    maxWidth: CANVAS_WIDTH,
  },
  explanationText: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 16,
  },
});
