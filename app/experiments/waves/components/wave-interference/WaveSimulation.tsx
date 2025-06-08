import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Text as SvgText,
  G,
} from 'react-native-svg';
import {
  WaveSource,
  calculateInterference,
  getHeatmapColor,
} from '../../utils/waveCalculations';

interface WaveSimulationProps {
  sources: [WaveSource, WaveSource];
  waveSpeed: number;
  damping: number;
  isPlaying: boolean;
  animationSpeed: number;
  onSourceMove: (sourceIndex: 0 | 1, x: number, y: number) => void;
  viewMode: 'heatmap' | 'contour' | 'vector';
}

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isMobile = Platform.OS !== 'web';

// Performans optimizasyonu için platform bazlı ayarlar
const SIMULATION_CONFIG = {
  width: Math.min(screenWidth - 32, isWeb ? 600 : screenWidth - 16),
  height: Math.min(
    Math.min(screenWidth - 32, isWeb ? 600 : screenWidth - 16) * 0.75,
    isWeb ? 450 : Math.min(screenWidth * 0.6, 280)
  ),
  gridSize: isMobile ? 12 : 10,
  targetFps: isMobile ? 15 : 20,
  updateInterval: isMobile ? 100 : 50,
};

// Memoized Pattern Renderer Component
const InterferencePattern = memo<{
  pattern: Array<Array<number>>;
  viewMode: 'heatmap' | 'contour' | 'vector';
  gridSize: number;
}>(({ pattern, viewMode, gridSize }) => {
  if (viewMode !== 'heatmap' || pattern.length === 0) return null;

  const elements: React.ReactElement[] = [];

  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      const amplitude = pattern[i][j];

      // Çok küçük amplitudları atla (performans için)
      if (Math.abs(amplitude) < 0.1) continue;

      const intensity = Math.max(0, Math.min(1, (amplitude + 2) / 4));

      let fillColor;
      if (amplitude > 0) {
        // Warm colors for constructive interference
        const r = Math.floor(255 * Math.min(1, intensity * 1.5));
        const g = Math.floor(180 * intensity);
        const b = Math.floor(60 * intensity);
        const alpha = 0.3 + intensity * 0.7;
        fillColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } else {
        // Cool colors for destructive interference
        const r = Math.floor(60 * intensity);
        const g = Math.floor(120 * intensity);
        const b = Math.floor(255 * Math.min(1, intensity * 1.5));
        const alpha = 0.3 + intensity * 0.7;
        fillColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }

      elements.push(
        <Rect
          key={`pattern-${i}-${j}`}
          x={i * gridSize}
          y={j * gridSize}
          width={gridSize}
          height={gridSize}
          fill={fillColor}
        />
      );
    }
  }

  return <>{elements}</>;
});

// Memoized Contour Lines Component
const ContourLines = memo<{
  pattern: Array<Array<number>>;
  viewMode: 'heatmap' | 'contour' | 'vector';
  gridSize: number;
}>(({ pattern, viewMode, gridSize }) => {
  if (viewMode !== 'contour' || pattern.length === 0) return null;

  const elements: React.ReactElement[] = [];
  const contourLevels = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];

  contourLevels.forEach((level, levelIndex) => {
    const hue = (levelIndex * 60) % 360;
    const strokeColor = `hsl(${hue}, 70%, 60%)`;
    const strokeWidth = level === 0 ? 2 : 1;

    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
        const amplitude = pattern[i][j];

        if (Math.abs(amplitude - level) < 0.15) {
          elements.push(
            <Circle
              key={`contour-${levelIndex}-${i}-${j}`}
              cx={i * gridSize + gridSize / 2}
              cy={j * gridSize + gridSize / 2}
              r={1.5}
              fill={strokeColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          );
        }
      }
    }
  });

  return <>{elements}</>;
});

// Memoized Wave Sources Component
const WaveSources = memo<{
  sources: [WaveSource, WaveSource];
  time: number;
  simulationWidth: number;
  simulationHeight: number;
}>(({ sources, time, simulationWidth, simulationHeight }) => {
  return (
    <>
      {sources.map((source, index) => {
        if (!source.active) return null;

        const x = (source.x / 100) * simulationWidth;
        const y = (source.y / 100) * simulationHeight;
        const sourceColor = index === 0 ? '#ff4444' : '#4488ff';
        const gradientId = `sourceGradient${index}`;

        // Simplified animated pulse rings - daha az ring, daha iyi performans
        const sourceTime = time * source.frequency;
        const pulseRadius1 = 15 + Math.sin(sourceTime) * 3;
        const pulseRadius2 = 25 + Math.sin(sourceTime + 1.5) * 4;

        return (
          <G key={`source-${index}`}>
            {/* Simplified pulse rings */}
            <Circle
              cx={x}
              cy={y}
              r={pulseRadius1}
              fill="none"
              stroke={sourceColor}
              strokeWidth={2}
              opacity={0.6}
            />
            <Circle
              cx={x}
              cy={y}
              r={pulseRadius2}
              fill="none"
              stroke={sourceColor}
              strokeWidth={1}
              opacity={0.4}
            />

            {/* Source center */}
            <Circle
              cx={x}
              cy={y}
              r={10}
              fill={`url(#${gradientId})`}
              stroke="#ffffff"
              strokeWidth={2}
            />

            {/* Simplified source label */}
            <SvgText
              x={x + 15}
              y={y - 5}
              fill="#ffffff"
              fontSize="11"
              fontWeight="bold"
            >
              S{index + 1}
            </SvgText>
          </G>
        );
      })}
    </>
  );
});

// Memoized SVG Gradients
const SVGGradients = memo(() => (
  <Defs>
    {/* Background gradient */}
    <RadialGradient id="backgroundGradient" cx="50%" cy="50%" r="70%">
      <Stop offset="0%" stopColor="#0a0a0a" stopOpacity="1" />
      <Stop offset="100%" stopColor="#1a1a2e" stopOpacity="1" />
    </RadialGradient>

    {/* Gradients for sources */}
    <RadialGradient id="sourceGradient0" cx="50%" cy="50%" r="50%">
      <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
      <Stop offset="70%" stopColor="#ff4444" stopOpacity="1" />
      <Stop offset="100%" stopColor="#ff4444" stopOpacity="0.8" />
    </RadialGradient>
    <RadialGradient id="sourceGradient1" cx="50%" cy="50%" r="50%">
      <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
      <Stop offset="70%" stopColor="#4488ff" stopOpacity="1" />
      <Stop offset="100%" stopColor="#4488ff" stopOpacity="0.8" />
    </RadialGradient>
  </Defs>
));

const WaveSimulation: React.FC<WaveSimulationProps> = memo(
  ({
    sources,
    waveSpeed,
    damping,
    isPlaying,
    animationSpeed,
    onSourceMove,
    viewMode,
  }) => {
    const animationRef = useRef<number | null>(null);
    const timeRef = useRef<number>(0);
    const [draggedSource, setDraggedSource] = useState<number | null>(null);
    const [interferencePattern, setInterferencePattern] = useState<
      Array<Array<number>>
    >([]);
    const lastUpdateTime = useRef<number>(0);
    const isMountedRef = useRef(true);

    // Memoized active sources
    const activeSources = useMemo(
      () => sources.filter((source) => source.active),
      [sources]
    );

    // Generate interference pattern for visualization - optimized
    const generatePattern = useCallback(() => {
      if (!isMountedRef.current || activeSources.length === 0) {
        setInterferencePattern([]);
        return;
      }

      const pattern: Array<Array<number>> = [];
      const {
        width: simulationWidth,
        height: simulationHeight,
        gridSize,
      } = SIMULATION_CONFIG;

      // Daha büyük step ile daha az hesaplama
      for (let x = 0; x < simulationWidth; x += gridSize) {
        const row: number[] = [];
        for (let y = 0; y < simulationHeight; y += gridSize) {
          const normalizedX = (x / simulationWidth) * 100;
          const normalizedY = (y / simulationHeight) * 100;

          const amplitude = calculateInterference(
            activeSources,
            normalizedX,
            normalizedY,
            timeRef.current,
            waveSpeed,
            damping
          );

          row.push(amplitude);
        }
        pattern.push(row);
      }

      setInterferencePattern(pattern);
    }, [activeSources, waveSpeed, damping]);

    // Animation loop - optimized
    const animate = useCallback(
      (currentTime: number) => {
        if (!isMountedRef.current) return;

        if (isPlaying) {
          const frameInterval = 1000 / SIMULATION_CONFIG.targetFps;
          if (currentTime - lastUpdateTime.current >= frameInterval) {
            timeRef.current += 0.03 * animationSpeed; // Daha küçük zaman adımları

            // Sadece aktif kaynaklar varsa güncelle
            if (activeSources.length > 0) {
              generatePattern();
            }

            lastUpdateTime.current = currentTime;
          }
        }

        if (isMountedRef.current) {
          animationRef.current = requestAnimationFrame(animate);
        }
      },
      [isPlaying, animationSpeed, generatePattern, activeSources.length]
    );

    // Component lifecycle management
    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    }, []);

    // Start animation
    useEffect(() => {
      if (isMountedRef.current) {
        lastUpdateTime.current = 0;
        generatePattern();
        animationRef.current = requestAnimationFrame(animate);
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    }, [animate, generatePattern]);

    // Memoized PanResponder
    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onMoveShouldSetPanResponder: (evt, gestureState) => {
            // Sadece tek dokunuş için izin ver
            return (
              Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2
            );
          },
          onStartShouldSetPanResponder: () => true,
          onPanResponderGrant: (evt) => {
            const { locationX, locationY } = evt.nativeEvent;

            // Koordinatları güvenli şekilde al
            const touchX = locationX || 0;
            const touchY = locationY || 0;

            const normalizedX = (touchX / SIMULATION_CONFIG.width) * 100;
            const normalizedY = (touchY / SIMULATION_CONFIG.height) * 100;

            // Find closest active source
            let closestSource = -1;
            let minDistance = Infinity;

            sources.forEach((source, index) => {
              if (!source.active) return;
              const distance = Math.sqrt(
                Math.pow(source.x - normalizedX, 2) +
                  Math.pow(source.y - normalizedY, 2)
              );
              // Dokunma alanını biraz genişlettik
              if (distance < minDistance && distance < 15) {
                minDistance = distance;
                closestSource = index;
              }
            });

            if (closestSource !== -1) {
              setDraggedSource(closestSource);
            }
          },
          onPanResponderMove: (evt, gestureState) => {
            if (draggedSource === null) return;

            const { locationX, locationY } = evt.nativeEvent;

            // Koordinatları güvenli şekilde al
            const touchX = locationX || 0;
            const touchY = locationY || 0;

            const normalizedX = Math.max(
              5,
              Math.min(95, (touchX / SIMULATION_CONFIG.width) * 100)
            );
            const normalizedY = Math.max(
              5,
              Math.min(95, (touchY / SIMULATION_CONFIG.height) * 100)
            );

            onSourceMove(draggedSource as 0 | 1, normalizedX, normalizedY);
          },
          onPanResponderRelease: () => {
            setDraggedSource(null);
          },
          onPanResponderTerminate: () => {
            setDraggedSource(null);
          },
        }),
      [sources, draggedSource, onSourceMove]
    );

    return (
      <View style={styles.container} {...panResponder.panHandlers}>
        <Svg
          width={SIMULATION_CONFIG.width}
          height={SIMULATION_CONFIG.height}
          style={styles.svg}
        >
          <SVGGradients />

          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={SIMULATION_CONFIG.width}
            height={SIMULATION_CONFIG.height}
            fill="url(#backgroundGradient)"
          />

          {/* Interference pattern */}
          <InterferencePattern
            pattern={interferencePattern}
            viewMode={viewMode}
            gridSize={SIMULATION_CONFIG.gridSize}
          />

          {/* Contour lines */}
          <ContourLines
            pattern={interferencePattern}
            viewMode={viewMode}
            gridSize={SIMULATION_CONFIG.gridSize}
          />

          {/* Wave sources */}
          <WaveSources
            sources={sources}
            time={timeRef.current}
            simulationWidth={SIMULATION_CONFIG.width}
            simulationHeight={SIMULATION_CONFIG.height}
          />
        </Svg>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  svg: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
  },
});

export default WaveSimulation;
