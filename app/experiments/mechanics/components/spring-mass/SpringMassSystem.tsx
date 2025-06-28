import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
  const animationIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [trailPoints, setTrailPoints] = useState<
    Array<{ x: number; y: number }>
  >([]);

  // Mobil optimizasyonu
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 600;
  
  // Mobil için performans optimizasyonları
  const targetFPS = isMobile ? 30 : 60;
  const frameInterval = 1000 / targetFPS;
  const maxTrailPoints = isMobile ? 30 : 80;
  
  // Boyutlar - mobil için optimize
  const svgWidth = isMobile ? Math.min(screenWidth - 32, 400) : 500;
  const svgHeight = isMobile ? 300 : 375;
  const centerX = svgWidth / 2;
  const equilibriumY = svgHeight / 2;
  const pixelsPerMeter = isMobile ? 50 : 60;

  // Memoized style hesaplamaları
  const containerStyle = useMemo(() => ({
    ...styles.container,
    maxWidth: svgWidth,
    maxHeight: svgHeight,
  }), [svgWidth, svgHeight]);

  const svgContainerStyle = useMemo(() => ({
    width: svgWidth,
    height: svgHeight,
  }), [svgWidth, svgHeight]);

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

  // Memoized spring path generator
  const drawSpring = useMemo(() => {
    return (position: number) => {
      const springTop = isMobile ? 40 : 50;
      const massY = equilibriumY + position * pixelsPerMeter;
      const springLength = Math.max(30, massY - springTop);
      const springWidth = isMobile ? 20 : 25;
      const coils = isMobile ? 6 : 8;

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
  }, [centerX, equilibriumY, pixelsPerMeter, isMobile]);

  const getMassY = (position: number) => {
    return equilibriumY + position * pixelsPerMeter;
  };

  const animate = (currentTime: number) => {
    if (!isPlaying) return;

    // Frame rate kontrolü
    if (currentTime - lastTimeRef.current < frameInterval) {
      animationIdRef.current = requestAnimationFrame(animate);
      return;
    }
    lastTimeRef.current = currentTime;

    // Mobil için daha fazla step (hızlı simülasyon)
    const steps = Math.max(1, Math.round((isMobile ? speed * 0.5 : 2) * speed));
    const state = engineRef.current.stepMultiple(steps);
    onStateUpdate(state);

    // Trail optimizasyonu
    if (showTrail) {
      const massY = getMassY(state.position);
      setTrailPoints((prev) => {
        const newPoints = [...prev, { x: centerX, y: massY }];
        return newPoints.length > maxTrailPoints ? newPoints.slice(-maxTrailPoints) : newPoints;
      });
    }

    animationIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationIdRef.current = requestAnimationFrame(animate);
    } else if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, showTrail, speed, isMobile]);

  const currentState = engineRef.current.getCurrentState();
  const massY = getMassY(currentState.position);
  const massSize = Math.max(isMobile ? 10 : 12, Math.min(isMobile ? 20 : 25, mass * 8));

  // Memoized grid lines - mobil için sadeleştirilmiş
  const gridLines = useMemo(() => {
    if (!showGrid) return null;
    
    const gridSpacing = isMobile ? 40 : 25;
    const verticalLines = Math.ceil(svgWidth / gridSpacing);
    const horizontalLines = Math.ceil(svgHeight / gridSpacing);
    
    return (
      <G opacity={isMobile ? 0.2 : 0.3}>
        {/* Vertical lines */}
        {Array.from({ length: verticalLines }, (_, i) => (
          <Line
            key={`v-${i}`}
            x1={i * gridSpacing}
            y1={0}
            x2={i * gridSpacing}
            y2={svgHeight}
            stroke="#10b981"
            strokeWidth={0.5}
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: horizontalLines }, (_, i) => (
          <Line
            key={`h-${i}`}
            x1={0}
            y1={i * gridSpacing}
            x2={svgWidth}
            y2={i * gridSpacing}
            stroke="#10b981"
            strokeWidth={0.5}
          />
        ))}
        {/* Equilibrium line */}
        <Line
          x1={isMobile ? 30 : 50}
          y1={equilibriumY}
          x2={svgWidth - (isMobile ? 30 : 50)}
          y2={equilibriumY}
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="8,4"
        />
      </G>
    );
  }, [showGrid, svgWidth, svgHeight, equilibriumY, isMobile]);

  // Memoized trail path
  const trailPath = useMemo(() => {
    if (!showTrail || trailPoints.length <= 1) return null;
    
    return (
      <Path
        d={`M ${trailPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`}
        stroke="rgba(59, 130, 246, 0.6)"
        strokeWidth={isMobile ? 1.5 : 2}
        fill="none"
        strokeLinecap="round"
      />
    );
  }, [showTrail, trailPoints, isMobile]);

  return (
    <View style={containerStyle}>
      <View style={svgContainerStyle}>
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
          {gridLines}

          {/* Trail */}
          {trailPath}

          {/* Spring attachment (ceiling) - mobil için basitleştirilmiş */}
          <G>
            <Line
              x1={centerX - (isMobile ? 40 : 60)}
              y1={isMobile ? 25 : 30}
              x2={centerX + (isMobile ? 40 : 60)}
              y2={isMobile ? 25 : 30}
              stroke="#374151"
              strokeWidth={isMobile ? 8 : 12}
              strokeLinecap="round"
            />
            {!isMobile && (
              <>
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
              </>
            )}
          </G>

          {/* Spring */}
          <Path
            d={drawSpring(currentState.position)}
            stroke="url(#springGradient)"
            strokeWidth={isMobile ? 2 : 3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Mass shadow - mobil için devre dışı */}
          {!isMobile && (
            <Circle
              cx={centerX + 2}
              cy={massY + 2}
              r={massSize}
              fill="rgba(0, 0, 0, 0.2)"
            />
          )}

          {/* Mass */}
          <Circle
            cx={centerX}
            cy={massY}
            r={massSize}
            fill="url(#massGradient)"
            stroke="#fff"
            strokeWidth={isMobile ? 1 : 2}
          />

          {/* Mass highlight - mobil için devre dışı */}
          {!isMobile && (
            <Circle
              cx={centerX - massSize / 3}
              cy={massY - massSize / 3}
              r={massSize / 3}
              fill="rgba(255, 255, 255, 0.4)"
            />
          )}

          {/* Position indicator */}
          <G opacity={0.7}>
            <Line
              x1={centerX + (isMobile ? 30 : 40)}
              y1={equilibriumY}
              x2={centerX + (isMobile ? 30 : 40)}
              y2={massY}
              stroke="#ef4444"
              strokeWidth={isMobile ? 1.5 : 2}
              strokeDasharray="3,3"
            />
            <Circle 
              cx={centerX + (isMobile ? 30 : 40)} 
              cy={massY} 
              r={isMobile ? 2 : 3} 
              fill="#ef4444" 
            />
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
    alignSelf: 'center',
  },
});
