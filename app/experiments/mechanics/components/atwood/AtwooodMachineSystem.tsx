import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Line,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from 'react-native-svg';

interface AtwoodMachineState {
  m1: number;
  m2: number;
  g: number;
  ropeLength: number;
  isRunning: boolean;
  time: number;
  position1: number;
  position2: number;
  velocity: number;
  acceleration: number;
  tension: number;
}

interface AtwoodMachineSystemProps {
  state: AtwoodMachineState;
}

// Memoized Grid Component for better performance
const GridLines = memo<{ svgWidth: number; svgHeight: number }>(
  ({ svgWidth, svgHeight }) => (
    <G opacity={0.1}>
      {Array.from({ length: Math.ceil(svgHeight / 25) }, (_, i) => (
        <Line
          key={`h-${i}`}
          x1={0}
          y1={i * 25}
          x2={svgWidth}
          y2={i * 25}
          stroke="#10b981"
          strokeWidth={0.5}
        />
      ))}
      {Array.from({ length: Math.ceil(svgWidth / 25) }, (_, i) => (
        <Line
          key={`v-${i}`}
          x1={i * 25}
          y1={0}
          x2={i * 25}
          y2={svgHeight}
          stroke="#10b981"
          strokeWidth={0.5}
        />
      ))}
    </G>
  )
);

// Memoized Velocity Arrows Component
const VelocityArrows = memo<{
  velocity: number;
  mass1X: number;
  mass1Y: number;
  mass2X: number;
  mass2Y: number;
  mass1Size: number;
  mass2Size: number;
}>(({ velocity, mass1X, mass1Y, mass2X, mass2Y, mass1Size, mass2Size }) => {
  if (velocity === 0) return null;

  return (
    <G>
      {/* Mass 1 velocity arrow */}
      <Line
        x1={mass1X + mass1Size + 8}
        y1={mass1Y}
        x2={mass1X + mass1Size + 8}
        y2={mass1Y + (velocity > 0 ? 25 : -25)}
        stroke={velocity > 0 ? '#ef4444' : '#3b82f6'}
        strokeWidth={2}
      />

      {/* Mass 2 velocity arrow */}
      <Line
        x1={mass2X + mass2Size + 8}
        y1={mass2Y}
        x2={mass2X + mass2Size + 8}
        y2={mass2Y + (velocity > 0 ? -25 : 25)}
        stroke={velocity > 0 ? '#3b82f6' : '#ef4444'}
        strokeWidth={2}
      />
    </G>
  );
});

export const AtwoodMachineSystem: React.FC<AtwoodMachineSystemProps> = memo(
  ({ state }) => {
    const svgWidth = 500;
    const svgHeight = 650;

    // Memoize physics constants
    const physicsConstants = useMemo(
      () => ({
        pixelsPerMeter: 40,
        initialOffset: 280,
        horizontalOffset: 80,
        pulleyTop: 30,
        pulleySize: 60,
      }),
      []
    );

    // Memoize calculated positions
    const calculatedPositions = useMemo(() => {
      const {
        pixelsPerMeter,
        initialOffset,
        horizontalOffset,
        pulleyTop,
        pulleySize,
      } = physicsConstants;

      const pulleyCenter = pulleyTop + pulleySize / 2;
      const pulleyCenterX = svgWidth / 2;

      // Calculate positions
      const mass1VisualOffset = state.position1 * pixelsPerMeter;
      const mass2VisualOffset = state.position2 * pixelsPerMeter;

      const leftRopeLength = initialOffset + mass1VisualOffset;
      const rightRopeLength = initialOffset + mass2VisualOffset;

      // Mass positions - ipler masa tam ortasından geçecek
      const mass1Y = pulleyCenter + Math.max(30, leftRopeLength);
      const mass2Y = pulleyCenter + Math.max(30, rightRopeLength);
      const mass1X = pulleyCenterX - horizontalOffset;
      const mass2X = pulleyCenterX + horizontalOffset;

      // Mass sizes based on their values
      const mass1Size = Math.max(15, Math.min(25, state.m1 * 4));
      const mass2Size = Math.max(15, Math.min(25, state.m2 * 4));

      return {
        pulleyCenter,
        pulleyCenterX,
        mass1Y,
        mass2Y,
        mass1X,
        mass2X,
        mass1Size,
        mass2Size,
      };
    }, [
      state.position1,
      state.position2,
      state.m1,
      state.m2,
      physicsConstants,
      svgWidth,
    ]);

    // Memoize equilibrium line position
    const equilibriumLineY = useMemo(
      () => calculatedPositions.pulleyCenter + physicsConstants.initialOffset,
      [calculatedPositions.pulleyCenter, physicsConstants.initialOffset]
    );

    return (
      <View style={styles.container}>
        <Svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <Defs>
            {/* Gradients */}
            <LinearGradient
              id="ceilingGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#e5e7eb" />
              <Stop offset="100%" stopColor="#d1d5db" />
            </LinearGradient>

            <RadialGradient id="pulleyGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#f3f4f6" />
              <Stop offset="50%" stopColor="#d1d5db" />
              <Stop offset="100%" stopColor="#9ca3af" />
            </RadialGradient>

            <LinearGradient
              id="mass1Gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#f87171" />
              <Stop offset="70%" stopColor="#ef4444" />
              <Stop offset="100%" stopColor="#dc2626" />
            </LinearGradient>

            <LinearGradient
              id="mass2Gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#6ee7b7" />
              <Stop offset="70%" stopColor="#10b981" />
              <Stop offset="100%" stopColor="#059669" />
            </LinearGradient>
          </Defs>

          {/* White Background */}
          <Rect
            x={0}
            y={0}
            width={svgWidth}
            height={svgHeight}
            fill="#ffffff"
          />

          {/* Grid lines - Memoized component */}
          <GridLines svgWidth={svgWidth} svgHeight={svgHeight} />

          {/* Ceiling */}
          <Rect
            x={0}
            y={0}
            width={svgWidth}
            height={20}
            fill="url(#ceilingGradient)"
          />

          {/* Ceiling mounting point */}
          <Circle
            cx={calculatedPositions.pulleyCenterX}
            cy={10}
            r={4}
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth={1}
          />

          {/* Ceiling attachment line */}
          <Line
            x1={calculatedPositions.pulleyCenterX}
            y1={10}
            x2={calculatedPositions.pulleyCenterX}
            y2={physicsConstants.pulleyTop}
            stroke="#374151"
            strokeWidth={2}
          />

          {/* Left rope - tam ortadan geçecek şekilde */}
          <Line
            x1={calculatedPositions.mass1X}
            y1={calculatedPositions.pulleyCenter}
            x2={calculatedPositions.mass1X}
            y2={calculatedPositions.mass1Y}
            stroke="#1f2937"
            strokeWidth={3}
          />

          {/* Right rope - tam ortadan geçecek şekilde */}
          <Line
            x1={calculatedPositions.mass2X}
            y1={calculatedPositions.pulleyCenter}
            x2={calculatedPositions.mass2X}
            y2={calculatedPositions.mass2Y}
            stroke="#1f2937"
            strokeWidth={3}
          />

          {/* Rope over pulley */}
          <Line
            x1={calculatedPositions.mass1X}
            y1={calculatedPositions.pulleyCenter}
            x2={calculatedPositions.mass2X}
            y2={calculatedPositions.pulleyCenter}
            stroke="#1f2937"
            strokeWidth={3}
          />

          {/* Pulley */}
          <Circle
            cx={calculatedPositions.pulleyCenterX}
            cy={calculatedPositions.pulleyCenter}
            r={physicsConstants.pulleySize / 2}
            fill="url(#pulleyGradient)"
            stroke="#374151"
            strokeWidth={2}
          />

          {/* Pulley center */}
          <Circle
            cx={calculatedPositions.pulleyCenterX}
            cy={calculatedPositions.pulleyCenter}
            r={8}
            fill="#6b7280"
          />

          {/* Pulley center dot */}
          <Circle
            cx={calculatedPositions.pulleyCenterX}
            cy={calculatedPositions.pulleyCenter}
            r={3}
            fill="#374151"
          />

          {/* Mass 1 shadow */}
          <Circle
            cx={calculatedPositions.mass1X + 2}
            cy={calculatedPositions.mass1Y + 2}
            r={calculatedPositions.mass1Size}
            fill="rgba(0, 0, 0, 0.1)"
          />

          {/* Mass 1 */}
          <Circle
            cx={calculatedPositions.mass1X}
            cy={calculatedPositions.mass1Y}
            r={calculatedPositions.mass1Size}
            fill="url(#mass1Gradient)"
            stroke="#fff"
            strokeWidth={2}
          />

          {/* Mass 1 highlight */}
          <Circle
            cx={calculatedPositions.mass1X - calculatedPositions.mass1Size / 3}
            cy={calculatedPositions.mass1Y - calculatedPositions.mass1Size / 3}
            r={calculatedPositions.mass1Size / 4}
            fill="rgba(255, 255, 255, 0.5)"
          />

          {/* Mass 2 shadow */}
          <Circle
            cx={calculatedPositions.mass2X + 2}
            cy={calculatedPositions.mass2Y + 2}
            r={calculatedPositions.mass2Size}
            fill="rgba(0, 0, 0, 0.1)"
          />

          {/* Mass 2 */}
          <Circle
            cx={calculatedPositions.mass2X}
            cy={calculatedPositions.mass2Y}
            r={calculatedPositions.mass2Size}
            fill="url(#mass2Gradient)"
            stroke="#fff"
            strokeWidth={2}
          />

          {/* Mass 2 highlight */}
          <Circle
            cx={calculatedPositions.mass2X - calculatedPositions.mass2Size / 3}
            cy={calculatedPositions.mass2Y - calculatedPositions.mass2Size / 3}
            r={calculatedPositions.mass2Size / 4}
            fill="rgba(255, 255, 255, 0.5)"
          />

          {/* Velocity arrows - Memoized component */}
          <VelocityArrows
            velocity={state.velocity}
            mass1X={calculatedPositions.mass1X}
            mass1Y={calculatedPositions.mass1Y}
            mass2X={calculatedPositions.mass2X}
            mass2Y={calculatedPositions.mass2Y}
            mass1Size={calculatedPositions.mass1Size}
            mass2Size={calculatedPositions.mass2Size}
          />

          {/* Equilibrium line - denge çizgisi */}
          <Line
            x1={50}
            y1={equilibriumLineY}
            x2={svgWidth - 50}
            y2={equilibriumLineY}
            stroke="#10b981"
            strokeWidth={1}
            strokeDasharray="5,5"
            opacity={0.5}
          />
        </Svg>

        {/* Info overlay */}
        <View style={styles.infoOverlay}>
          <View style={styles.massInfo}>
            <Text style={[styles.massLabel, { color: '#ef4444' }]}>m₁</Text>
            <Text style={styles.massValue}>{state.m1.toFixed(1)} kg</Text>
          </View>

          <View style={styles.massInfo}>
            <Text style={[styles.massLabel, { color: '#10b981' }]}>m₂</Text>
            <Text style={styles.massValue}>{state.m2.toFixed(1)} kg</Text>
          </View>
        </View>

        {/* Debug info */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>t: {state.time.toFixed(2)}s</Text>
          <Text style={styles.debugText}>
            a: {state.acceleration.toFixed(3)} m/s²
          </Text>
          <Text style={styles.debugText}>
            v: {state.velocity.toFixed(3)} m/s
          </Text>
          <Text style={styles.debugText}>
            x₁: {state.position1.toFixed(3)}m
          </Text>
          <Text style={styles.debugText}>
            x₂: {state.position2.toFixed(3)}m
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    maxWidth: 500,
    maxHeight: 650,
    alignSelf: 'center',
  },
  infoOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },
  massInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    minWidth: 50,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  massLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  massValue: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  debugInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  debugText: {
    fontSize: 9,
    color: '#4b5563',
    fontFamily: 'monospace',
    lineHeight: 12,
  },
});
