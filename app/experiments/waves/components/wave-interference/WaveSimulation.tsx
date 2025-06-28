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
            // Mobile için daha parlak opaklık
            const baseOpacity = isMobile ? 0.25 : 0.12;
            const opacityMultiplier = isMobile ? 0.65 : 0.4;
            const opacity = Math.max(
              baseOpacity,
              amplitude * opacityMultiplier
            );

            // Mobile için daha kalın çizgiler
            const baseStrokeWidth = isMobile ? 1.5 : 1.1;
            const strokeMultiplier = isMobile ? 2.2 : 1.8;
            const strokeWidth = Math.max(
              baseStrokeWidth,
              amplitude * strokeMultiplier
            );

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
        const mobileThreshold = isMobile ? 0.15 : 0.18;
        if (Math.abs(totalAmplitude) > mobileThreshold) {
          const intensityDivider = isMobile ? 1.8 : 2.2;
          const intensity = Math.max(
            0,
            Math.min(1, Math.abs(totalAmplitude) / intensityDivider)
          );

          let fillColor;
          if (totalAmplitude > 0) {
            // Sıcak renkler - yapıcı girişim - mobilde daha parlak
            const intensityBoost = isMobile ? 1.2 : 1.0;
            const r = Math.floor(255 * Math.min(1, intensity * intensityBoost));
            const g = Math.floor((isMobile ? 140 : 120) + 135 * intensity);
            const b = Math.floor((isMobile ? 80 : 60) + 70 * intensity);
            const baseAlpha = isMobile ? 0.35 : 0.25;
            const alphaMultiplier = isMobile ? 0.55 : 0.45;
            const alpha = baseAlpha + intensity * alphaMultiplier;
            fillColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          } else {
            // Soğuk renkler - yıkıcı girişim - mobilde daha parlak
            const intensityBoost = isMobile ? 1.2 : 1.0;
            const r = Math.floor((isMobile ? 80 : 60) + 70 * intensity);
            const g = Math.floor((isMobile ? 140 : 120) + 135 * intensity);
            const b = Math.floor(255 * Math.min(1, intensity * intensityBoost));
            const baseAlpha = isMobile ? 0.35 : 0.25;
            const alphaMultiplier = isMobile ? 0.55 : 0.45;
            const alpha = baseAlpha + intensity * alphaMultiplier;
            fillColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          }

          const circleRadius = isMobile ? gridSize / 2.5 : gridSize / 2.8;
          const circleOpacity = isMobile ? 0.75 : 0.65;

          elements.push(
            <Circle
              key={`interference-${x}-${y}`}
              cx={x + gridSize / 2}
              cy={y + gridSize / 2}
              r={circleRadius}
              fill={fillColor}
              opacity={circleOpacity}
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

        // Animated pulse rings for source indicators - mobilde daha parlak
        const sourceTime = time * source.frequency * 1.8;
        const pulseRadius1 = 12 + Math.sin(sourceTime) * 4;
        const pulseRadius2 = 20 + Math.sin(sourceTime + Math.PI) * 5;

        // Mobile için daha parlak pulse'lar
        const basePulseOpacity1 = isMobile ? 0.5 : 0.35;
        const basePulseOpacity2 = isMobile ? 0.4 : 0.25;
        const pulseVariation1 = isMobile ? 0.25 : 0.2;
        const pulseVariation2 = isMobile ? 0.2 : 0.15;

        const pulseOpacity1 =
          basePulseOpacity1 + Math.sin(sourceTime) * pulseVariation1;
        const pulseOpacity2 =
          basePulseOpacity2 + Math.sin(sourceTime + Math.PI) * pulseVariation2;

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

            {/* Source center - daha büyük ve tıklanabilir */}
            <Circle
              cx={x}
              cy={y}
              r={15}
              fill={`url(#${gradientId})`}
              stroke="#ffffff"
              strokeWidth={3}
            />

            {/* Invisible larger touch area */}
            <Circle
              cx={x}
              cy={y}
              r={25}
              fill="transparent"
              stroke="transparent"
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
    {/* Background gradient - mobilde daha açık */}
    <RadialGradient id="backgroundGradient" cx="50%" cy="50%" r="70%">
      <Stop
        offset="0%"
        stopColor={isMobile ? '#1a1a1a' : '#0a0a0a'}
        stopOpacity="1"
      />
      <Stop
        offset="100%"
        stopColor={isMobile ? '#2a2a3e' : '#1a1a2e'}
        stopOpacity="1"
      />
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
    const containerRef = useRef<View>(null);

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

    // Touch position helper function - basit ve güvenilir
    const getTouchPosition = useCallback((evt: any) => {
      // Direkt nativeEvent'ten al - SVG container relative
      const touchX = evt.nativeEvent.locationX || evt.nativeEvent.pageX || 0;
      const touchY = evt.nativeEvent.locationY || evt.nativeEvent.pageY || 0;

      return { touchX, touchY };
    }, []);

    // Memoized PanResponder - daha güvenilir touch handling
    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => {
            return (
              Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3
            );
          },
          onPanResponderGrant: (evt) => {
            // Daha güvenilir koordinat hesaplama
            const { touchX, touchY } = getTouchPosition(evt);

            const normalizedX = (touchX / SIMULATION_CONFIG.width) * 100;
            const normalizedY = (touchY / SIMULATION_CONFIG.height) * 100;

            // Find closest active source - daha geniş tolerance
            let closestSource = -1;
            let minDistance = Infinity;

            sources.forEach((source, index) => {
              if (!source.active) return;
              const distance = Math.sqrt(
                Math.pow(source.x - normalizedX, 2) +
                  Math.pow(source.y - normalizedY, 2)
              );
              // Dokunma alanını genişlettik - daha kolay yakalama
              if (distance < minDistance && distance < 25) {
                minDistance = distance;
                closestSource = index;
              }
            });

            if (closestSource !== -1) {
              setDraggedSource(closestSource);
              console.log(`Dragging source ${closestSource}`); // Debug için
            }
          },
          onPanResponderMove: (evt, gestureState) => {
            if (draggedSource === null) return;

            const { touchX, touchY } = getTouchPosition(evt);

            const normalizedX = Math.max(
              8,
              Math.min(92, (touchX / SIMULATION_CONFIG.width) * 100)
            );
            const normalizedY = Math.max(
              8,
              Math.min(92, (touchY / SIMULATION_CONFIG.height) * 100)
            );

            onSourceMove(draggedSource as 0 | 1, normalizedX, normalizedY);
          },
          onPanResponderRelease: () => {
            if (draggedSource !== null) {
              console.log(`Released source ${draggedSource}`); // Debug için
            }
            setDraggedSource(null);
          },
          onPanResponderTerminate: () => {
            setDraggedSource(null);
          },
        }),
      [sources, draggedSource, onSourceMove, getTouchPosition]
    );

    return (
      <View
        ref={containerRef}
        style={styles.container}
        {...panResponder.panHandlers}
      >
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
    backgroundColor: isMobile ? '#1a1a1a' : '#0a0a0a',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: isMobile
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(255, 255, 255, 0.1)',
  },
  svg: {
    backgroundColor: isMobile ? '#2a2a3e' : '#1a1a2e',
    borderRadius: 12,
  },
});

export default WaveSimulation;
