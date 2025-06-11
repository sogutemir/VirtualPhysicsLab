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
  gridSize: isMobile ? 14 : 10, // Optimum denge: performans vs detay
  targetFps: isMobile ? 25 : 45, // Optimize edilmiş FPS
  updateInterval: isMobile ? 40 : 22, // Daha az sık güncelleme
  maxWaves: isMobile ? 3 : 4, // Daha az dalga = daha iyi performans
  maxRenderDistance: isMobile ? 100 : 120, // Render mesafesi sınırı
};

// Memoized Circular Wave Patterns Component
const CircularWavePattern = memo<{
  sources: [WaveSource, WaveSource];
  time: number;
  simulationWidth: number;
  simulationHeight: number;
  waveSpeed: number;
  damping: number;
}>(
  ({
    sources,
    time,
    simulationWidth,
    simulationHeight,
    waveSpeed,
    damping,
  }) => {
    const elements: React.ReactElement[] = [];

    sources.forEach((source, sourceIndex) => {
      if (!source.active) return;

      const sourceX = (source.x / 100) * simulationWidth;
      const sourceY = (source.y / 100) * simulationHeight;
      // Daha yumuşak renkler
      const sourceColor = sourceIndex === 0 ? '#ff6666' : '#6699ff';

      // Her kaynak için optimize edilmiş dairesel dalga oluştur
      const maxWaves = SIMULATION_CONFIG.maxWaves;
      const maxDistance = SIMULATION_CONFIG.maxRenderDistance;

      for (let waveIndex = 0; waveIndex < maxWaves; waveIndex++) {
        const waveTime = time * source.frequency - waveIndex * 1.8;
        const radius = (waveTime * waveSpeed * 38) % maxDistance;

        // Performans için: sadece görünür aralıktaki dalgaları render et
        if (radius > 10 && radius < maxDistance - 10) {
          const amplitude =
            source.amplitude * Math.exp(-damping * radius * 0.025);

          // Çok düşük amplitud dalgalarını atla
          if (amplitude > 0.05) {
            const opacity = Math.max(0.12, amplitude * 0.4);
            const strokeWidth = Math.max(1.1, amplitude * 1.8);

            elements.push(
              <Circle
                key={`wave-${sourceIndex}-${waveIndex}`}
                cx={sourceX}
                cy={sourceY}
                r={radius}
                fill="none"
                stroke={sourceColor}
                strokeWidth={strokeWidth}
                opacity={opacity}
              />
            );
          }
        }
      }
    });

    return <>{elements}</>;
  }
);

// Memoized Interference Pattern with Beautiful Gradients
const InterferencePattern = memo<{
  sources: [WaveSource, WaveSource];
  time: number;
  simulationWidth: number;
  simulationHeight: number;
  waveSpeed: number;
  damping: number;
}>(
  ({
    sources,
    time,
    simulationWidth,
    simulationHeight,
    waveSpeed,
    damping,
  }) => {
    const elements: React.ReactElement[] = [];
    const gridSize = SIMULATION_CONFIG.gridSize;

    // Optimize edilmiş grid taraması - sadece etkin bölgeleri hesapla
    const activeSources = sources.filter((s) => s.active);
    if (activeSources.length === 0) return [];

    for (let x = 0; x < simulationWidth; x += gridSize) {
      for (let y = 0; y < simulationHeight; y += gridSize) {
        const normalizedX = (x / simulationWidth) * 100;
        const normalizedY = (y / simulationHeight) * 100;

        // Performans için: çok uzak noktalarda hesaplama yapma
        let minDistanceToSource = Infinity;
        activeSources.forEach((source) => {
          const dx = normalizedX - source.x;
          const dy = normalizedY - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          minDistanceToSource = Math.min(minDistanceToSource, distance);
        });

        // Çok uzak noktaları atla
        if (minDistanceToSource > 80) continue;

        let totalAmplitude = 0;

        // Her aktif kaynak için girişimi hesapla
        activeSources.forEach((source) => {
          const dx = normalizedX - source.x;
          const dy = normalizedY - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0) {
            const waveValue =
              source.amplitude *
              Math.exp(-damping * distance * 0.35) *
              Math.sin(
                2 * Math.PI * source.frequency * time -
                  (2 * Math.PI * distance) / (waveSpeed * 10) +
                  source.phase
              );
            totalAmplitude += waveValue;
          }
        });

        // Girişim etkilerini optimize edilmiş şekilde göster
        if (Math.abs(totalAmplitude) > 0.18) {
          const intensity = Math.max(
            0,
            Math.min(1, Math.abs(totalAmplitude) / 2.2)
          );

          let fillColor;
          if (totalAmplitude > 0) {
            // Sıcak renkler - yapıcı girişim
            const r = Math.floor(255 * Math.min(1, intensity * 1.0));
            const g = Math.floor(120 + 135 * intensity);
            const b = Math.floor(60 + 70 * intensity);
            const alpha = 0.25 + intensity * 0.45;
            fillColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          } else {
            // Soğuk renkler - yıkıcı girişim
            const r = Math.floor(60 + 70 * intensity);
            const g = Math.floor(120 + 135 * intensity);
            const b = Math.floor(255 * Math.min(1, intensity * 1.0));
            const alpha = 0.25 + intensity * 0.45;
            fillColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          }

          elements.push(
            <Circle
              key={`interference-${x}-${y}`}
              cx={x + gridSize / 2}
              cy={y + gridSize / 2}
              r={gridSize / 2.8}
              fill={fillColor}
              opacity={0.65}
            />
          );
        }
      }
    }

    return <>{elements}</>;
  }
);

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

        // Animated pulse rings for source indicators - orta seviye belirginlik
        const sourceTime = time * source.frequency * 1.8;
        const pulseRadius1 = 12 + Math.sin(sourceTime) * 4;
        const pulseRadius2 = 20 + Math.sin(sourceTime + Math.PI) * 5;
        const pulseOpacity1 = 0.35 + Math.sin(sourceTime) * 0.2;
        const pulseOpacity2 = 0.25 + Math.sin(sourceTime + Math.PI) * 0.15;

        return (
          <G key={`source-${index}`}>
            {/* Animated pulse rings */}
            <Circle
              cx={x}
              cy={y}
              r={pulseRadius1}
              fill="none"
              stroke={sourceColor}
              strokeWidth={2}
              opacity={pulseOpacity1}
            />
            <Circle
              cx={x}
              cy={y}
              r={pulseRadius2}
              fill="none"
              stroke={sourceColor}
              strokeWidth={1.5}
              opacity={pulseOpacity2}
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
  }) => {
    const animationRef = useRef<number | null>(null);
    const timeRef = useRef<number>(0);
    const [draggedSource, setDraggedSource] = useState<number | null>(null);
    const [, forceUpdate] = useState({});
    const lastUpdateTime = useRef<number>(0);
    const isMountedRef = useRef(true);

    // Memoized active sources
    const activeSources = useMemo(
      () => sources.filter((source) => source.active),
      [sources]
    );

    // Animation loop - optimize edilmiş performans + throttling
    const animate = useCallback(
      (currentTime: number) => {
        if (!isMountedRef.current) return;

        if (isPlaying) {
          const frameInterval = 1000 / SIMULATION_CONFIG.targetFps;
          if (currentTime - lastUpdateTime.current >= frameInterval) {
            // Optimize edilmiş time progression
            timeRef.current += 0.04 * animationSpeed;
            lastUpdateTime.current = currentTime;

            // Force component re-render - throttled
            forceUpdate({});
          }
        }

        if (isMountedRef.current) {
          animationRef.current = requestAnimationFrame(animate);
        }
      },
      [isPlaying, animationSpeed, forceUpdate]
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
        animationRef.current = requestAnimationFrame(animate);
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    }, [animate]);

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

          {/* Circular Wave Patterns */}
          <CircularWavePattern
            sources={sources}
            time={timeRef.current}
            simulationWidth={SIMULATION_CONFIG.width}
            simulationHeight={SIMULATION_CONFIG.height}
            waveSpeed={waveSpeed}
            damping={damping}
          />

          {/* Interference Pattern */}
          <InterferencePattern
            sources={sources}
            time={timeRef.current}
            simulationWidth={SIMULATION_CONFIG.width}
            simulationHeight={SIMULATION_CONFIG.height}
            waveSpeed={waveSpeed}
            damping={damping}
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
