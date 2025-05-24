import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Line,
  Circle,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import {
  PhysicsEngine,
  SpringMassSystem as SystemState,
} from '../../utils/PhysicsEngine';

interface SpringMassSystemProps {
  isPlaying: boolean;
  mass: number;
  springConstant: number;
  dampingCoefficient: number;
  initialPosition: number;
  initialVelocity: number;
  onStateUpdate: (state: SystemState) => void;
  showTrail?: boolean;
  showGrid?: boolean;
  speed?: number;
}

export const SpringMassSystem: React.FC<SpringMassSystemProps> = ({
  isPlaying,
  mass,
  springConstant,
  dampingCoefficient,
  initialPosition,
  initialVelocity,
  onStateUpdate,
  showTrail = false,
  showGrid = true,
  speed = 1,
}) => {
  const engineRef = useRef<PhysicsEngine>(
    new PhysicsEngine(mass, springConstant, dampingCoefficient)
  );
  const animationIdRef = useRef<number>();
  const [trailPoints, setTrailPoints] = useState<
    Array<{ x: number; y: number }>
  >([]);

  // Daha küçük boyutlar
  const svgWidth = 500;
  const svgHeight = 375;
  const centerX = svgWidth / 2;
  const equilibriumY = svgHeight / 2; // Ortada dengede olsun
  const pixelsPerMeter = 60; // Daha küçük scale

  useEffect(() => {
    engineRef.current.updateParameters(
      mass,
      springConstant,
      dampingCoefficient
    );
    engineRef.current.setInitialConditions(initialPosition, initialVelocity);
    setTrailPoints([]);
  }, [
    mass,
    springConstant,
    dampingCoefficient,
    initialPosition,
    initialVelocity,
  ]);

  const drawSpring = (position: number) => {
    const springTop = 50;
    // Pozisyon pozitifse aşağı, negatifse yukarı hareket
    const massY = equilibriumY + position * pixelsPerMeter;
    const springLength = Math.max(30, massY - springTop); // Minimum spring length
    const springWidth = 25;
    const coils = 8;

    const segmentHeight = springLength / (coils * 2);

    let pathData = `M ${centerX} ${springTop} `;

    for (let i = 0; i <= coils * 2; i++) {
      const y = springTop + i * segmentHeight;
      const x =
        centerX + (i % 2 === 0 ? 0 : i % 4 === 1 ? springWidth : -springWidth);
      pathData += `L ${x} ${y} `;
    }

    pathData += `L ${centerX} ${massY}`;

    return pathData;
  };

  const getMassY = (position: number) => {
    // Pozitif position = aşağı hareket
    return equilibriumY + position * pixelsPerMeter;
  };

  const animate = () => {
    if (!isPlaying) return;

    // Speed kontrolü - daha fazla step = daha hızlı simülasyon
    const steps = Math.max(1, Math.round(2 * speed));
    const state = engineRef.current.stepMultiple(steps);
    onStateUpdate(state);

    if (showTrail) {
      const massY = getMassY(state.position);
      setTrailPoints((prev) => {
        const newPoints = [...prev, { x: centerX, y: massY }];
        return newPoints.length > 80 ? newPoints.slice(-80) : newPoints;
      });
    }

    animationIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      animate();
    } else if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, showTrail, speed]);

  const currentState = engineRef.current.getCurrentState();
  const massY = getMassY(currentState.position);
  const massSize = Math.max(12, Math.min(25, mass * 8));

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <Defs>
            <LinearGradient
              id="massGradient"
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
              id="springGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <Stop offset="0%" stopColor="#6b7280" />
              <Stop offset="50%" stopColor="#9ca3af" />
              <Stop offset="100%" stopColor="#6b7280" />
            </LinearGradient>
          </Defs>

          {/* Grid */}
          {showGrid && (
            <G opacity={0.3}>
              {/* Vertical lines */}
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
              {/* Horizontal lines */}
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
              {/* Equilibrium line */}
              <Line
                x1={50}
                y1={equilibriumY}
                x2={svgWidth - 50}
                y2={equilibriumY}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="8,4"
              />
            </G>
          )}

          {/* Trail */}
          {showTrail && trailPoints.length > 1 && (
            <Path
              d={`M ${trailPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`}
              stroke="rgba(59, 130, 246, 0.6)"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Spring attachment (ceiling) */}
          <G>
            <Line
              x1={centerX - 60}
              y1={30}
              x2={centerX + 60}
              y2={30}
              stroke="#374151"
              strokeWidth={12}
              strokeLinecap="round"
            />
            <Line
              x1={centerX - 50}
              y1={25}
              x2={centerX + 50}
              y2={25}
              stroke="#4b5563"
              strokeWidth={6}
              strokeLinecap="round"
            />
            <Line
              x1={centerX - 40}
              y1={20}
              x2={centerX + 40}
              y2={20}
              stroke="#6b7280"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </G>

          {/* Spring */}
          <Path
            d={drawSpring(currentState.position)}
            stroke="url(#springGradient)"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Mass shadow */}
          <Circle
            cx={centerX + 2}
            cy={massY + 2}
            r={massSize}
            fill="rgba(0, 0, 0, 0.2)"
          />

          {/* Mass */}
          <Circle
            cx={centerX}
            cy={massY}
            r={massSize}
            fill="url(#massGradient)"
            stroke="#fff"
            strokeWidth={2}
          />

          {/* Mass highlight */}
          <Circle
            cx={centerX - massSize / 3}
            cy={massY - massSize / 3}
            r={massSize / 3}
            fill="rgba(255, 255, 255, 0.4)"
          />

          {/* Position indicator */}
          <G opacity={0.7}>
            <Line
              x1={centerX + 40}
              y1={equilibriumY}
              x2={centerX + 40}
              y2={massY}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="3,3"
            />
            <Circle cx={centerX + 40} cy={massY} r={3} fill="#ef4444" />
          </G>
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    maxWidth: 500,
    maxHeight: 375,
    alignSelf: 'center',
  },
  svgContainer: {
    width: 500,
    height: 375,
  },
});
