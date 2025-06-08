import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
} from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import ExperimentLayout from '../../../components/ExperimentLayout';
import {
  WeightedPulleyState,
  DEFAULT_STATE,
} from './components/weighted-pulley/types';
import {
  RAD,
  calculateRK4,
  calculateEnergies,
  calculateEquilibriumAngle,
  calculatePeriod,
  PULLEY_RADIUS,
  MASS_RADIUS,
  DT,
} from './components/weighted-pulley/utils';
import WeightedPulleyControls from './components/weighted-pulley/components/WeightedPulleyControls';
import { useLanguage } from '../../../components/LanguageContext';

// Memoized Grid Lines Component
const GridLines = memo<{
  svgWidth: number;
  svgHeight: number;
}>(({ svgWidth, svgHeight }) => (
  <>
    {Array.from({ length: Math.ceil(svgHeight / 25) }, (_, i) => (
      <Line
        key={`h-${i}`}
        x1={0}
        y1={i * 25}
        x2={svgWidth}
        y2={i * 25}
        stroke="#10b981"
        strokeWidth={0.5}
        opacity={0.1}
      />
    ))}
  </>
));

// Memoized Angle Scale Component
const AngleScale = memo<{
  centerX: number;
  centerY: number;
  R: number;
  equilibriumAngle: number | null;
}>(({ centerX, centerY, R, equilibriumAngle }) => (
  <>
    {/* Açı ölçeği - daha temiz */}
    <Circle
      cx={centerX}
      cy={centerY}
      r={R + 15}
      fill="none"
      stroke="#9ca3af"
      strokeWidth="1"
      strokeDasharray="3,3"
      opacity={0.5}
    />

    {/* Açı çizgileri */}
    {Array.from({ length: 9 }, (_, i) => {
      const angle = (-80 + i * 20) * RAD;
      const x1 = centerX + (R + 10) * Math.cos(angle);
      const y1 = centerY + (R + 10) * Math.sin(angle);
      const x2 = centerX + (R + 20) * Math.cos(angle);
      const y2 = centerY + (R + 20) * Math.sin(angle);
      return (
        <Line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#6b7280"
          strokeWidth="1"
          opacity={0.7}
        />
      );
    })}

    {/* Denge açısı */}
    {equilibriumAngle !== null && (
      <Line
        x1={centerX + (R + 10) * Math.cos(Math.PI / 2 - equilibriumAngle)}
        y1={centerY + (R + 10) * Math.sin(Math.PI / 2 - equilibriumAngle)}
        x2={centerX + (R + 25) * Math.cos(Math.PI / 2 - equilibriumAngle)}
        y2={centerY + (R + 25) * Math.sin(Math.PI / 2 - equilibriumAngle)}
        stroke="#ef4444"
        strokeWidth="2"
      />
    )}
  </>
));

// Memoized Pulley Component
const PulleySystem = memo<{
  centerX: number;
  centerY: number;
  R: number;
}>(({ centerX, centerY, R }) => (
  <>
    {/* Makara - temiz metalik tasarım */}
    <Circle
      cx={centerX}
      cy={centerY}
      r={R}
      fill="#e5e7eb"
      stroke="#6b7280"
      strokeWidth="3"
    />

    {/* Makara iç çember */}
    <Circle
      cx={centerX}
      cy={centerY}
      r={R - 10}
      fill="none"
      stroke="#9ca3af"
      strokeWidth="1"
    />

    {/* Makara merkez */}
    <Circle cx={centerX} cy={centerY} r={8} fill="#4b5563" />
  </>
));

// Memoized Info Panel Component
const InfoPanel = memo<{
  svgWidth: number;
  state: WeightedPulleyState;
  equilibriumAngle: number | null;
  t: (tr: string, en: string) => string;
}>(({ svgWidth, state, equilibriumAngle, t }) => (
  <>
    <Circle
      cx={svgWidth - 80}
      cy={60}
      r={70}
      fill="rgba(255, 255, 255, 0.95)"
      stroke="rgba(0, 0, 0, 0.1)"
      strokeWidth="1"
    />

    <SvgText
      x={svgWidth - 80}
      y={35}
      textAnchor="middle"
      fill="#2c3e50"
      fontSize={10}
      fontWeight="bold"
    >
      {t('t', 't')} = {state.time.toFixed(2)} s
    </SvgText>
    <SvgText
      x={svgWidth - 80}
      y={50}
      textAnchor="middle"
      fill="#2c3e50"
      fontSize={10}
      fontWeight="bold"
    >
      {t('φ', 'φ')} = {((state.phi / Math.PI) * 180 + 90).toFixed(1)}°
    </SvgText>
    {state.massM * PULLEY_RADIUS > state.massm * MASS_RADIUS ? (
      <SvgText
        x={svgWidth - 80}
        y={65}
        textAnchor="middle"
        fill="#ef4444"
        fontSize={9}
        fontWeight="bold"
      >
        {t('Denge mümkün değil', 'Equilibrium impossible')}
      </SvgText>
    ) : (
      equilibriumAngle !== null && (
        <SvgText
          x={svgWidth - 80}
          y={65}
          textAnchor="middle"
          fill="#2c3e50"
          fontSize={10}
          fontWeight="bold"
        >
          {t('φe', 'φe')} = {((equilibriumAngle * 180) / Math.PI).toFixed(1)}°
        </SvgText>
      )
    )}
    <SvgText
      x={svgWidth - 80}
      y={80}
      textAnchor="middle"
      fill="#10b981"
      fontSize={9}
      fontWeight="bold"
    >
      {t('Ep', 'Ep')} = {state.potentialEnergy.toFixed(4)} J
    </SvgText>
    <SvgText
      x={svgWidth - 80}
      y={95}
      textAnchor="middle"
      fill="#f59e0b"
      fontSize={9}
      fontWeight="bold"
    >
      {t('Ec', 'Ec')} = {state.kineticEnergy.toFixed(4)} J
    </SvgText>
  </>
));

const WeightedPulleyExperiment = memo(() => {
  const [state, setState] = useState<WeightedPulleyState>(DEFAULT_STATE);
  const animationRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const { t } = useLanguage();

  // Memoized SVG dimensions
  const svgDimensions = useMemo(
    () => ({
      svgWidth: 500,
      svgHeight: 400,
      centerX: 500 / 2,
      centerY: 400 / 3,
      R: 60, // Makara yarıçapı (piksel)
      r: 30, // Kütle yarıçapı (piksel)
    }),
    []
  );

  const { svgWidth, svgHeight, centerX, centerY, R, r } = svgDimensions;

  // Memoized position calculations
  const positions = useMemo(() => {
    const L = 100 + 80 * PULLEY_RADIUS * state.phi;
    const Xf = centerX - R - 20; // Sol tarafa daha fazla kaydır
    const Xm = centerX + r * Math.sin(state.phi);
    const Ym = centerY + r * Math.cos(state.phi);

    const stringPath = `
      M ${Xf} ${centerY + L}
      L ${Xf} ${centerY}
      A ${R} ${R} 0 0 1 ${centerX + R * Math.sin(state.phi)} ${
      centerY + R * (1 - Math.cos(state.phi))
    }
      L ${Xm} ${Ym}
    `;

    return { L, Xf, Xm, Ym, stringPath };
  }, [state.phi, centerX, centerY, R, r]);

  // Memoized equilibrium angle calculation
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

  const handleInertiaChange = useCallback((inertia: number) => {
    setState((prev) => ({ ...prev, inertia }));
  }, []);

  const handleMassMChange = useCallback((massM: number) => {
    setState((prev) => ({ ...prev, massM }));
  }, []);

  const handleMassmChange = useCallback((massm: number) => {
    setState((prev) => ({ ...prev, massm }));
  }, []);

  const handleAngleChange = useCallback((angle: number) => {
    setState((prev) => ({
      ...prev,
      angle,
      phi: angle * RAD,
    }));
  }, []);

  return (
    <ExperimentLayout
      title="Ağırlıklı Makara"
      titleEn="Weighted Pulley"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Ağırlıklı makara sistemi, bir makaraya bağlı iki farklı kütlenin etkileşimini inceleyen bir fizik deneyidir. Bu deneyde, farklı kütle değerleri ve atalet momenti için sistemin davranışını gözlemleyebilirsiniz."
      descriptionEn="The weighted pulley system is a physics experiment that studies the interaction of two different masses connected by a pulley. In this experiment, you can observe the system's behavior for different mass values and moment of inertia."
      isRunning={state.isRunning}
      onToggleSimulation={handleStart}
      onReset={handleReset}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.experimentArea}>
          <View style={styles.canvasContainer}>
            <Svg width={svgWidth} height={svgHeight} style={styles.svg}>
              {/* Beyaz arka plan */}
              <Circle cx={centerX} cy={centerY} r={svgWidth} fill="#ffffff" />

              {/* Grid lines */}
              <GridLines svgWidth={svgWidth} svgHeight={svgHeight} />

              {/* Angle scale */}
              <AngleScale
                centerX={centerX}
                centerY={centerY}
                R={R}
                equilibriumAngle={equilibriumAngle}
              />

              {/* Tavan */}
              <Line
                x1={0}
                y1={20}
                x2={svgWidth}
                y2={20}
                stroke="#6b7280"
                strokeWidth={8}
              />

              {/* Pulley system */}
              <PulleySystem centerX={centerX} centerY={centerY} R={R} />

              {/* İp */}
              <Path
                d={positions.stringPath}
                stroke="#374151"
                strokeWidth="2"
                fill="none"
              />

              {/* Serbest kütle (mavi) - sol taraf */}
              <Circle
                cx={positions.Xf}
                cy={centerY + positions.L}
                r={12}
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Bağlı kütle (kırmızı) - sağ taraf */}
              <Circle
                cx={positions.Xm}
                cy={positions.Ym}
                r={8}
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Info panel */}
              <InfoPanel
                svgWidth={svgWidth}
                state={state}
                equilibriumAngle={equilibriumAngle}
                t={t}
              />
            </Svg>
          </View>

          <View style={styles.controlsContainer}>
            <WeightedPulleyControls
              state={state}
              onInertiaChange={handleInertiaChange}
              onMassMChange={handleMassMChange}
              onMassmChange={handleMassmChange}
              onAngleChange={handleAngleChange}
            />
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 50 : 200,
  },
  experimentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  canvasContainer: {
    width: '100%',
    maxWidth: 500,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    alignSelf: 'center',
  },
  svg: {
    backgroundColor: '#ffffff',
  },
  controlsContainer: {
    width: '100%',
    maxWidth: 500,
    padding: 16,
    alignSelf: 'center',
  },
});
