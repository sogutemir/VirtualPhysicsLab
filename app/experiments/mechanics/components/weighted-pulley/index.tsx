import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
} from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import WeightedPulleyControls from './components/WeightedPulleyControls';
import { WeightedPulleyState, DEFAULT_STATE } from './types';
import {
  RAD,
  calculateRK4,
  calculateEnergies,
  calculateEquilibriumAngle,
  calculatePeriod,
  PULLEY_RADIUS,
  MASS_RADIUS,
  DT,
} from './utils';

// Memoized SVG Background Component
const SVGBackground = memo<{
  centerX: number;
  centerY: number;
  R: number;
}>(({ centerX, centerY, R }) => (
  <>
    {/* Arka plan */}
    <Circle
      cx={centerX}
      cy={centerY}
      r={98}
      fill="none"
      stroke="#333"
      strokeWidth="1"
      strokeDasharray="5,5"
    />

    {/* Açı ölçeği */}
    {Array.from({ length: 19 }, (_, i) => {
      const angle = (-80 + i * 10) * RAD;
      const x1 = centerX + 98 * Math.cos(angle);
      const y1 = centerY + 98 * Math.sin(angle);
      const x2 = centerX + 108 * Math.cos(angle);
      const y2 = centerY + 108 * Math.sin(angle);
      return (
        <Line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#333"
          strokeWidth="1"
        />
      );
    })}
  </>
));

// Memoized Pulley Visual Component
const PulleyVisual = memo<{
  centerX: number;
  centerY: number;
  R: number;
  phi: number;
}>(({ centerX, centerY, R, phi }) => (
  <>
    {/* Makara */}
    <Circle
      cx={centerX}
      cy={centerY}
      r={R}
      fill="rgba(0,255,255,0.3)"
      stroke="#DAA520"
      strokeWidth="2"
    />

    {/* Makara deseni */}
    {Array.from({ length: 3 }, (_, i) => {
      const startAngle = -phi + (i * 2 * Math.PI) / 3;
      const endAngle = startAngle + Math.PI / 3;
      const d = `
        M ${centerX} ${centerY}
        L ${centerX + R * Math.cos(startAngle)} ${
        centerY + R * Math.sin(startAngle)
      }
        A ${R} ${R} 0 0 1 ${centerX + R * Math.cos(endAngle)} ${
        centerY + R * Math.sin(endAngle)
      }
        Z
      `;
      return <Path key={i} d={d} fill="yellow" />;
    })}
  </>
));

// Memoized Measurements Component
const MeasurementsDisplay = memo<{
  state: WeightedPulleyState;
  equilibriumAngle: number | null;
  massM: number;
  massm: number;
}>(({ state, equilibriumAngle, massM, massm }) => (
  <>
    <SvgText
      x={250}
      y={70}
      fill="black"
      fontSize={12}
      fontWeight="bold"
      fontFamily="Courier"
    >
      t = {state.time.toFixed(2)} s
    </SvgText>
    <SvgText
      x={250}
      y={90}
      fill="black"
      fontSize={12}
      fontWeight="bold"
      fontFamily="Courier"
    >
      φ = {((state.phi / Math.PI) * 180 + 90).toFixed(1)}°
    </SvgText>
    {massM * PULLEY_RADIUS > massm * MASS_RADIUS ? (
      <SvgText
        x={230}
        y={110}
        fill="red"
        fontSize={12}
        fontWeight="bold"
        fontFamily="Courier"
      >
        Denge mümkün değil
      </SvgText>
    ) : (
      equilibriumAngle !== null && (
        <SvgText
          x={250}
          y={110}
          fill="black"
          fontSize={12}
          fontWeight="bold"
          fontFamily="Courier"
        >
          φe = {((equilibriumAngle * 180) / Math.PI).toFixed(1)}°
        </SvgText>
      )
    )}
    <SvgText
      x={250}
      y={130}
      fill="black"
      fontSize={12}
      fontWeight="bold"
      fontFamily="Courier"
    >
      Ep = {state.potentialEnergy.toFixed(6)} J
    </SvgText>
    <SvgText
      x={250}
      y={150}
      fill="black"
      fontSize={12}
      fontWeight="bold"
      fontFamily="Courier"
    >
      Ec = {state.kineticEnergy.toFixed(6)} J
    </SvgText>
    <SvgText
      x={250}
      y={170}
      fill="black"
      fontSize={12}
      fontWeight="bold"
      fontFamily="Courier"
    >
      Et = {state.totalEnergy.toExponential(3)} J
    </SvgText>
    {state.period > 0 && (
      <SvgText
        x={250}
        y={190}
        fill="black"
        fontSize={12}
        fontWeight="bold"
        fontFamily="Courier"
      >
        T = {state.period.toFixed(2)} s
      </SvgText>
    )}
  </>
));

const WeightedPulleyExperiment: React.FC = memo(() => {
  const { width, height } = Dimensions.get('window');
  const [state, setState] = useState<WeightedPulleyState>(DEFAULT_STATE);
  const animationRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  // Memoized responsive dimensions
  const dimensions = useMemo(() => {
    const isWeb = Platform.OS === 'web';

    // Web için optimize edilmiş boyut
    const WEB_WIDTH = 420;
    const WEB_HEIGHT = 550; // Daha makul yükseklik

    // Mobil için maksimum boyut
    const MOBILE_MAX_WIDTH = width * 0.9;
    const MOBILE_MAX_HEIGHT = height * 0.7;

    if (isWeb) {
      return {
        svgWidth: WEB_WIDTH,
        svgHeight: WEB_HEIGHT,
        scale: 100,
        padding: 20,
      };
    } else {
      const svgSize = Math.min(MOBILE_MAX_WIDTH, MOBILE_MAX_HEIGHT);
      return {
        svgWidth: svgSize,
        svgHeight: svgSize * 1.8, // Daha makul oran
        scale: svgSize * 0.4,
        padding: 10,
      };
    }
  }, [width, height]);

  const { svgWidth, svgHeight, scale, padding } = dimensions;
  const centerX = svgWidth / 2;
  const centerY = Platform.OS === 'web' ? svgHeight / 4.5 : svgHeight / 5; // Daha makul pozisyon

  // Memoized position calculations
  const positions = useMemo(() => {
    const R = 80; // Makara yarıçapı (piksel)
    const r = 40; // Kütle yarıçapı (piksel)
    // İp uzunluğu sınırlandırılması - yeni zemin seviyesine uygun
    const L = Math.min(120 + 80 * PULLEY_RADIUS * Math.abs(state.phi), 480);
    const Xf = centerX - R;

    // Bağlı kütle m (kırmızı) konumu
    const Xm = centerX + r * Math.sin(state.phi);
    const Ym = centerY + r * Math.cos(state.phi);

    // İp yolu
    const stringPath = `
      M ${Xf} ${centerY + L}
      L ${Xf} ${centerY}
      A ${R} ${R} 0 0 1 ${centerX + R * Math.sin(state.phi)} ${
      centerY + R * (1 - Math.cos(state.phi))
    }
      L ${Xm} ${Ym}
    `;

    return { R, r, L, Xf, Xm, Ym, stringPath };
  }, [state.phi, centerX, centerY]);

  // Memoized equilibrium angle
  const equilibriumAngle = useMemo(
    () => calculateEquilibriumAngle(state.massM / 1000, state.massm / 1000),
    [state.massM, state.massm]
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

  const animate = useCallback(() => {
    if (!isMountedRef.current || !state.isRunning) return;

    // RK4 integrasyonu
    const { phi1, dphi1 } = calculateRK4(state.time, state.phi, state.dphi, {
      inertia: state.inertia,
      massM: state.massM / 1000,
      massm: state.massm / 1000,
    });

    // Enerjileri hesapla
    const energies = calculateEnergies(phi1, dphi1, {
      inertia: state.inertia,
      massM: state.massM / 1000,
      massm: state.massm / 1000,
    });

    // Periyot hesapla
    const period = calculatePeriod({
      inertia: state.inertia,
      massM: state.massM / 1000,
      massm: state.massm / 1000,
    });

    setState((prev) => ({
      ...prev,
      time: prev.time + DT,
      phi: phi1,
      dphi: dphi1,
      ...energies,
      period: period || 0,
    }));

    if (isMountedRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [state]);

  useEffect(() => {
    if (state.isRunning && isMountedRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [state.isRunning, animate]);

  // Memoized event handlers
  const handleStart = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const handleReset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      time: 0,
      isRunning: false,
      phi: prev.angle * RAD,
      dphi: 0,
      potentialEnergy: 0,
      kineticEnergy: 0,
      totalEnergy: 0,
    }));
  }, []);

  const handleInertiaChange = useCallback(
    (inertia: number) => {
      setState((prev) => ({ ...prev, inertia }));
      handleReset();
    },
    [handleReset]
  );

  const handleMassMChange = useCallback(
    (massM: number) => {
      setState((prev) => ({ ...prev, massM }));
      handleReset();
    },
    [handleReset]
  );

  const handleMassmChange = useCallback(
    (massm: number) => {
      setState((prev) => ({ ...prev, massm }));
      handleReset();
    },
    [handleReset]
  );

  const handleAngleChange = useCallback(
    (angle: number) => {
      setState((prev) => ({
        ...prev,
        angle,
        phi: angle * RAD,
      }));
      handleReset();
    },
    [handleReset]
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftPanel}>
          <WeightedPulleyControls
            state={state}
            onStart={handleStart}
            onReset={handleReset}
            onInertiaChange={handleInertiaChange}
            onMassMChange={handleMassMChange}
            onMassmChange={handleMassmChange}
            onAngleChange={handleAngleChange}
          />
        </View>

        <View style={styles.mainContent}>
          <Svg width={svgWidth} height={svgHeight} style={styles.svg}>
            {/* Background and scale */}
            <SVGBackground
              centerX={centerX}
              centerY={centerY}
              R={positions.R}
            />

            {/* Denge açısı */}
            {equilibriumAngle !== null && (
              <Line
                x1={centerX + 98 * Math.cos(Math.PI / 2 - equilibriumAngle)}
                y1={centerY + 98 * Math.sin(Math.PI / 2 - equilibriumAngle)}
                x2={centerX + 118 * Math.cos(Math.PI / 2 - equilibriumAngle)}
                y2={centerY + 118 * Math.sin(Math.PI / 2 - equilibriumAngle)}
                stroke="red"
                strokeWidth="2"
              />
            )}

            {/* Pulley system */}
            <PulleyVisual
              centerX={centerX}
              centerY={centerY}
              R={positions.R}
              phi={state.phi}
            />

            {/* İp */}
            <Path
              d={positions.stringPath}
              stroke="#666"
              strokeWidth="1"
              fill="none"
            />

            {/* Kütleler */}
            <Circle
              cx={positions.Xm}
              cy={positions.Ym}
              r={10}
              fill="red"
              stroke="#333"
              strokeWidth="1"
            />
            <Circle
              cx={positions.Xf}
              cy={centerY + positions.L}
              r={15}
              fill="blue"
              stroke="#333"
              strokeWidth="1"
            />

            {/* Measurements */}
            <MeasurementsDisplay
              state={state}
              equilibriumAngle={equilibriumAngle}
              massM={state.massM}
              massm={state.massm}
            />
          </Svg>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: Platform.OS === 'web' ? 24 : 12,
    gap: Platform.OS === 'web' ? 24 : 12,
  },
  leftPanel: {
    width: Platform.OS === 'web' ? 300 : '35%',
    height: '100%',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
});

export default WeightedPulleyExperiment;
