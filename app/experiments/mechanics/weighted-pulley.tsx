import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

// 🔧 MOBILE SAFETY: Try-catch for imports
let ExperimentLayout: any;
let WeightedPulleyControls: any;
let useLanguage: any;

try {
  ExperimentLayout = require('../../../components/ExperimentLayout').default;
  WeightedPulleyControls =
    require('./components/weighted-pulley/components/WeightedPulleyControls').default;
  useLanguage = require('../../../components/LanguageContext').useLanguage;
} catch (error) {
  console.error('Import Error:', error);
  // Fallback components
  ExperimentLayout = ({ children, title }: any) => (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>{title}</Text>
      {children}
    </View>
  );
  WeightedPulleyControls = () => <Text>Kontroller yüklenemedi</Text>;
  useLanguage = () => ({ t: (tr: string) => tr });
}

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

// 🔧 MOBILE OPTIMIZATION: Platform detection
const isMobile = Platform.OS !== 'web';
const MOBILE_FPS = 30; // Mobilde 30 FPS
const WEB_FPS = 60; // Web'de 60 FPS
const TARGET_FPS = isMobile ? MOBILE_FPS : WEB_FPS;
const FRAME_TIME = 1000 / TARGET_FPS; // ms

// 🔧 MOBILE OPTIMIZATION: Simplified GridLines - daha az çizgi
const GridLines = memo<{
  svgWidth: number;
  svgHeight: number;
}>(({ svgWidth, svgHeight }) => {
  if (isMobile) {
    // Mobilde daha az grid line
    return (
      <>
        {Array.from({ length: Math.ceil(svgHeight / 50) }, (_, i) => (
          <Line
            key={`h-${i}`}
            x1={0}
            y1={i * 50}
            x2={svgWidth}
            y2={i * 50}
            stroke="#10b981"
            strokeWidth={0.5}
            opacity={0.1}
          />
        ))}
      </>
    );
  }

  // Web için normal grid
  return (
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
  );
});

// 🔧 MOBILE OPTIMIZATION: Simplified AngleScale
const AngleScale = memo<{
  centerX: number;
  centerY: number;
  R: number;
  equilibriumAngle: number | null;
}>(({ centerX, centerY, R, equilibriumAngle }) => (
  <>
    {/* Basit daire */}
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

    {/* Mobilde daha az açı çizgisi */}
    {Array.from({ length: isMobile ? 5 : 9 }, (_, i) => {
      const totalLines = isMobile ? 5 : 9;
      const angle = (-80 + i * (160 / (totalLines - 1))) * RAD;
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

// 🔧 MOBILE OPTIMIZATION: Simplified InfoPanel
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
      fontSize={isMobile ? 8 : 10}
      fontWeight="bold"
    >
      {t('t', 't')} = {state.time.toFixed(1)} s
    </SvgText>
    <SvgText
      x={svgWidth - 80}
      y={50}
      textAnchor="middle"
      fill="#2c3e50"
      fontSize={isMobile ? 8 : 10}
      fontWeight="bold"
    >
      {t('φ', 'φ')} = {((state.phi / Math.PI) * 180 + 90).toFixed(0)}°
    </SvgText>
    {state.massM * PULLEY_RADIUS > state.massm * MASS_RADIUS ? (
      <SvgText
        x={svgWidth - 80}
        y={65}
        textAnchor="middle"
        fill="#ef4444"
        fontSize={isMobile ? 7 : 9}
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
          fontSize={isMobile ? 8 : 10}
          fontWeight="bold"
        >
          {t('φe', 'φe')} = {((equilibriumAngle * 180) / Math.PI).toFixed(0)}°
        </SvgText>
      )
    )}

    {/* Mobilde enerji gösterme - daha basit */}
    {!isMobile && (
      <>
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
    )}
  </>
));

const WeightedPulleyExperiment = memo(() => {
  const [state, setState] = useState<WeightedPulleyState>(DEFAULT_STATE);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0); // 🔧 THROTTLE ANIMATION
  const isMountedRef = useRef(true);
  const [hasError, setHasError] = useState(false); // 🔧 ERROR BOUNDARY
  const [renderError, setRenderError] = useState<string | null>(null); // 🔧 RENDER ERROR

  // 🔧 MOBILE SAFETY: Safe hook usage
  let t: (tr: string, en?: string) => string;
  try {
    const { t: languageT } = useLanguage();
    t = languageT;
  } catch (error) {
    console.error('Language Hook Error:', error);
    t = (tr: string) => tr; // Fallback
  }

  // 🔧 MOBILE ERROR RECOVERY
  useEffect(() => {
    const errorHandler = (error: any) => {
      console.error('WeightedPulley Error:', error);
      setHasError(true);
      // Cleanup on error
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    // React Native'de window objesi yoktur, sadece web'de kullan
    if (!isMobile && typeof window !== 'undefined') {
      // Add error listeners for web only
      window.addEventListener('error', errorHandler);
      window.addEventListener('unhandledrejection', errorHandler);

      return () => {
        window.removeEventListener('error', errorHandler);
        window.removeEventListener('unhandledrejection', errorHandler);
      };
    }
  }, []);

  // Show error message if something went wrong
  if (hasError && isMobile) {
    return (
      <ExperimentLayout
        title="Ağırlıklı Makara"
        titleEn="Weighted Pulley"
        difficulty="Orta Seviye"
        difficultyEn="Intermediate"
        description="Ağırlıklı makara sistemi şu anda mobil cihazınızda tam olarak çalışmıyor. Web versiyonunu deneyiniz."
        descriptionEn="The weighted pulley system is currently not working properly on your mobile device. Please try the web version."
        isRunning={false}
        onToggleSimulation={() => {}}
        onReset={() => setHasError(false)}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Bu deney mobil cihazlarda performans sorunu yaşıyor. Lütfen daha
            sonra tekrar deneyin.
          </Text>
        </View>
      </ExperimentLayout>
    );
  }

  // 🔧 MOBILE OPTIMIZATION: Safe dimensions without problematic hooks
  const svgDimensions = useMemo(() => {
    if (isMobile) {
      // Mobilde makul boyutlar
      return {
        svgWidth: 350,
        svgHeight: 500, // Yükseklik optimize edildi
        centerX: 175,
        centerY: 100, // Daha yukarıda konumlandırıldı
        R: 45, // Daha küçük makara
        r: 22, // Daha küçük kütle
      };
    } else {
      // Web için optimize edilmiş boyut
      return {
        svgWidth: 500,
        svgHeight: 500, // Makul yükseklik
        centerX: 250,
        centerY: 120, // Daha yukarıda konumlandırıldı
        R: 60,
        r: 30,
      };
    }
  }, []);

  const { svgWidth, svgHeight, centerX, centerY, R, r } = svgDimensions;

  // Memoized position calculations
  const positions = useMemo(() => {
    // İp uzunluğu hesaplama - yeni zemin seviyesine uygun
    const L = Math.min(120 + 60 * PULLEY_RADIUS * Math.abs(state.phi), 420);
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

  // 🔧 MOBILE OPTIMIZATION: Throttled Animation with simplified math
  const animate = useCallback(
    (currentTime: number) => {
      if (!isMountedRef.current || !state.isRunning) return;

      // 🔧 THROTTLE: Frame rate control
      if (currentTime - lastFrameTimeRef.current < FRAME_TIME) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime;

      if (isMobile) {
        // 🔧 MOBILE: Simplified physics - Euler integration instead of RK4
        const { inertia, massM, massm } = {
          inertia: state.inertia,
          massM: state.massM / 1000,
          massm: state.massm / 1000,
        };

        // Zemin çarpma kontrolü - mobil versiyonu
        const stringLength = 1.2 + PULLEY_RADIUS * Math.abs(state.phi);
        if (stringLength >= 4.2) {
          // Kütle yere çarptı - simülasyonu ve zamanı durdur
          setState((prev) => ({
            ...prev,
            isRunning: false,
            dphi: 0,
          }));
          return; // Zaman artışını da durdurmak için erken çık
        }

        // Simplified acceleration calculation
        const R = PULLEY_RADIUS;
        const r = MASS_RADIUS;
        const I = inertia + massm * r * r + massM * R * R;
        const K = 9.81 / I;
        const acceleration = K * (massM * R - massm * r * Math.sin(state.phi));

        // Simple Euler integration
        const newDphi = state.dphi + acceleration * DT;
        const newPhi = state.phi + newDphi * DT;

        // Simplified energy calculation (less frequent)
        const potentialEnergy =
          9.81 * (massm * r * (1 - Math.cos(newPhi)) - massM * R * newPhi);
        const kineticEnergy = 0.5 * I * newDphi * newDphi;

        setState((prev) => ({
          ...prev,
          time: prev.time + DT,
          phi: newPhi,
          dphi: newDphi,
          potentialEnergy,
          kineticEnergy,
          totalEnergy: potentialEnergy + kineticEnergy,
          period: 0, // Skip period calculation on mobile
        }));
      } else {
        // 🔧 WEB: Full RK4 integration
        
        // Zemin çarpma kontrolü - web versiyonu
        const stringLength = 1.2 + PULLEY_RADIUS * Math.abs(state.phi);
        if (stringLength >= 4.2) {
          // Kütle yere çarptı - simülasyonu ve zamanı durdur
          setState((prev) => ({
            ...prev,
            isRunning: false,
            dphi: 0,
          }));
          return; // Zaman artışını da durdurmak için erken çık
        }
        
        const { phi1, dphi1 } = calculateRK4(
          state.time,
          state.phi,
          state.dphi,
          {
            inertia: state.inertia,
            massM: state.massM / 1000,
            massm: state.massm / 1000,
          }
        );

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
      }

      if (isMountedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    },
    [state]
  );

  // 🔧 MOBILE OPTIMIZATION: Better animation lifecycle management
  useEffect(() => {
    if (state.isRunning && isMountedRef.current) {
      // Reset frame time for consistent animation
      lastFrameTimeRef.current = 0;
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

  // 🔧 MOBILE OPTIMIZATION: Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

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

  // 🔧 MOBILE SAFETY: Handle render errors
  if (renderError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>🚫 Mobil Cihaz Hatası</Text>
        <Text style={styles.errorSubText}>
          Bu deney mobil cihazınızda düzgün çalışmıyor. Web versiyonunu deneyin.
        </Text>
        <Text style={styles.errorDetail}>Hata: {renderError}</Text>
      </View>
    );
  }

  // 🔧 MOBILE SAFETY: Try-catch for entire render
  try {
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
  } catch (error: any) {
    // 🔧 MOBILE SAFETY: Handle any render errors
    console.error('Render Error:', error);
    setRenderError(error?.message || 'Bilinmeyen render hatası');

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>🚫 Mobil Render Hatası</Text>
        <Text style={styles.errorSubText}>
          Deney renderlanırken hata oluştu.
        </Text>
        <Text style={styles.errorDetail}>
          {error?.message || 'Bilinmeyen hata'}
        </Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 100 : 300, // Daha fazla padding
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
    minHeight: Platform.OS === 'web' ? 600 : 600, // Minimum yükseklik
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'visible', // Taşma görünür olsun
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
  // 🔧 MOBILE ERROR STYLES
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'monospace',
  },
});

export default WeightedPulleyExperiment;
