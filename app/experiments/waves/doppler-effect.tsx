import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Circle,
  Line,
  Path,
  Text as SvgText,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import Slider from '@react-native-community/slider';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';

// Tip tanımlamaları
interface Point {
  x: number;
  y: number;
}

interface WaveCircle {
  center: Point;
  radius: number;
  color: string;
}

interface DopplerEffectState {
  velocity: number; // Kaynak hızı (50 ile 500 m/s arası)
  time: number; // Geçen süre
  isRunning: boolean; // Animasyon çalışıyor mu?
  sourcePositions: Point[]; // Kaynak pozisyonları
}

const { width, height } = Dimensions.get('window');
const PI = Math.PI;
const SOUND_SPEED = 340; // Ses hızı (m/s)
const INITIAL_X = 40; // Başlangıç x pozisyonu
const DT = 0.1; // Zaman adımı
const ANIMATION_INTERVAL = 50; // Animasyon aralığı (ms)
const WAVE_SCALE = 0.15; // Dalga çemberlerinin ölçeği

// Varsayılan durum
const DEFAULT_STATE: DopplerEffectState = {
  velocity: 100,
  time: 0,
  isRunning: false,
  sourcePositions: [],
};

export default function DopplerEffectExperiment() {
  const { t } = useLanguage();

  // Boyutları hesapla
  const canvasSize =
    Platform.OS === 'web'
      ? Math.min(width - 40, 350) // 500'den 350'ye düşürdüm
      : Math.min(width - 32, height * 0.25); // 0.35'ten 0.25'e düşürdüm

  const Y_POSITION = (canvasSize * 0.7) / 2; // Yeni height'a göre merkez

  // Gözlemci pozisyonu
  const observerPosition: Point = {
    x: canvasSize * 0.75,
    y: Y_POSITION,
  };

  // State
  const [state, setState] = useState<DopplerEffectState>(DEFAULT_STATE);

  // Animasyon referansı
  const animationRef = useRef<NodeJS.Timeout>();

  // Kaynak pozisyonunu hesapla
  const calculateSourcePosition = useCallback(
    (time: number, velocity: number): Point => {
      // Hareketi yavaşlatmak için velocity'yi ölçeklendiriyoruz
      const scaledVelocity = velocity * 0.2;
      return {
        x: INITIAL_X + scaledVelocity * time,
        y: Y_POSITION,
      };
    },
    [Y_POSITION]
  );

  // Dalga yarıçapını hesapla
  const calculateWaveRadius = useCallback(
    (time: number, emissionTime: number): number => {
      // Dalga yayılma hızını yavaşlatıyoruz
      return SOUND_SPEED * (time - emissionTime) * WAVE_SCALE;
    },
    []
  );

  // Dalga çemberi oluştur
  const createWaveCircle = useCallback(
    (center: Point, radius: number, isRed: boolean): WaveCircle => {
      return {
        center,
        radius,
        color: isRed ? 'red' : 'blue',
      };
    },
    []
  );

  // Frekans oranını hesapla
  const calculateFrequencyRatio = useCallback(
    (
      sourceVelocity: number,
      observerPosition: Point,
      sourcePosition: Point
    ): number => {
      const dx = observerPosition.x - sourcePosition.x;
      const dy = observerPosition.y - sourcePosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const cosTheta = dx / distance;

      // f' = f * (1 - v*cos(θ)/c)
      return 1 - (sourceVelocity * cosTheta) / SOUND_SPEED;
    },
    []
  );

  // Animasyon adımı
  const animate = useCallback(() => {
    if (!state.isRunning) return;

    setState((prev) => {
      const newTime = prev.time + DT;
      const newPosition = calculateSourcePosition(newTime, prev.velocity);

      // Hareket sınırlarını kontrol et
      if (newPosition.x > canvasSize - 30) {
        return { ...prev, isRunning: false };
      }

      return {
        ...prev,
        time: newTime,
        sourcePositions: [...prev.sourcePositions, newPosition],
      };
    });

    // requestAnimationFrame yerine setTimeout kullanıyoruz
    animationRef.current = setTimeout(animate, ANIMATION_INTERVAL);
  }, [state.isRunning, canvasSize, calculateSourcePosition]);

  // Animasyonu başlat/durdur
  useEffect(() => {
    if (state.isRunning) {
      animationRef.current = setTimeout(animate, ANIMATION_INTERVAL);
    } else if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [state.isRunning, animate]);

  // Simülasyonu başlat/durdur
  const toggleSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  // Simülasyonu sıfırla
  const resetSimulation = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  // Hız değişimi
  const handleVelocityChange = useCallback((value: number) => {
    setState((prev) => ({
      ...DEFAULT_STATE,
      velocity: value,
    }));
  }, []);

  // Mevcut kaynak pozisyonunu hesapla
  const currentPosition = calculateSourcePosition(state.time, state.velocity);

  // Frekans oranını hesapla
  const frequencyRatio = calculateFrequencyRatio(
    state.velocity,
    observerPosition,
    currentPosition
  );

  return (
    <ExperimentLayout
      title="Doppler Etkisi"
      titleEn="Doppler Effect"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Bu deneyde, hareketli bir ses kaynağının Doppler etkisini gözlemleyebilirsiniz. Kaynak hızını değiştirerek frekans değişimini inceleyebilirsiniz."
      descriptionEn="In this experiment, you can observe the Doppler effect of a moving sound source. You can examine the frequency shift by changing the source velocity."
      isRunning={state.isRunning}
      onToggleSimulation={toggleSimulation}
      onReset={resetSimulation}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>
            {t(
              'Doppler etkisi, hareketli bir ses kaynağının gözlemciye yaklaşırken veya uzaklaşırken algılanan frekansın değişmesidir.',
              'The Doppler effect is the change in frequency perceived by an observer when a sound source approaches or moves away from the observer.'
            )}
          </Text>
          <Text style={styles.instruction}>
            {t(
              'Kaynak hızını değiştirerek frekans değişimini gözlemleyebilirsiniz.',
              'You can observe the frequency change by adjusting the source velocity.'
            )}
          </Text>
        </View>

        <View style={styles.canvasContainer}>
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${canvasSize} ${canvasSize * 0.7}`}
            style={styles.svg}
          >
            {/* Gradient tanımları */}
            <Defs>
              <LinearGradient
                id="backgroundGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#e3f2fd" />
                <Stop offset="100%" stopColor="#f8f9fa" />
              </LinearGradient>
              <LinearGradient
                id="waveGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#3498db" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#2980b9" stopOpacity="0.4" />
              </LinearGradient>
              <LinearGradient
                id="waveGradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <Stop offset="0%" stopColor="#e74c3c" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#c0392b" stopOpacity="0.4" />
              </LinearGradient>
              <LinearGradient
                id="sourceGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#ff6b6b" />
                <Stop offset="100%" stopColor="#ee5a52" />
              </LinearGradient>
              <LinearGradient
                id="observerGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#4ecdc4" />
                <Stop offset="100%" stopColor="#45b7aa" />
              </LinearGradient>
            </Defs>

            {/* Modern arka plan */}
            <Rect
              x={0}
              y={0}
              width={canvasSize}
              height={canvasSize * 0.7}
              fill="url(#backgroundGradient)"
            />

            {/* Ana çalışma alanı */}
            <Rect
              x={20}
              y={20}
              width={canvasSize - 40}
              height={canvasSize * 0.7 - 40}
              fill="rgba(255, 255, 255, 0.9)"
              rx={12}
              ry={12}
              stroke="rgba(52, 152, 219, 0.3)"
              strokeWidth={2}
            />

            {/* Dalga çemberleri - Modern stil */}
            {state.sourcePositions.map((pos, index) => {
              const radius = calculateWaveRadius(state.time, index * DT);
              const isApproaching = pos.x < observerPosition.x;
              const opacity = Math.max(0.1, 1 - radius / 100);

              return (
                <Circle
                  key={`wave-${index}`}
                  cx={pos.x}
                  cy={pos.y}
                  r={Math.max(1, radius)}
                  stroke={
                    isApproaching
                      ? 'url(#waveGradient2)'
                      : 'url(#waveGradient1)'
                  }
                  strokeWidth={2}
                  fill="none"
                  opacity={opacity}
                />
              );
            })}

            {/* Kaynak yolu çizgisi */}
            <Line
              x1={INITIAL_X}
              y1={Y_POSITION}
              x2={canvasSize - 40}
              y2={Y_POSITION}
              stroke="rgba(149, 165, 166, 0.4)"
              strokeWidth={2}
              strokeDasharray="5,5"
            />

            {/* Mevcut kaynak - Modern tasarım */}
            <Circle
              cx={currentPosition.x}
              cy={currentPosition.y}
              r={12}
              fill="url(#sourceGradient)"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth={3}
            />

            {/* Kaynak içi detay */}
            <Circle
              cx={currentPosition.x}
              cy={currentPosition.y}
              r={6}
              fill="rgba(255, 255, 255, 0.9)"
            />

            {/* Gözlemci - Modern tasarım */}
            <Circle
              cx={observerPosition.x}
              cy={observerPosition.y}
              r={15}
              fill="url(#observerGradient)"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth={3}
            />

            {/* Gözlemci simgesi */}
            <Circle
              cx={observerPosition.x}
              cy={observerPosition.y - 3}
              r={4}
              fill="rgba(255, 255, 255, 0.9)"
            />
            <Circle
              cx={observerPosition.x - 3}
              cy={observerPosition.y + 5}
              r={2}
              fill="rgba(255, 255, 255, 0.9)"
            />
            <Circle
              cx={observerPosition.x + 3}
              cy={observerPosition.y + 5}
              r={2}
              fill="rgba(255, 255, 255, 0.9)"
            />

            {/* Modern frekans bilgisi */}
            <Rect
              x={30}
              y={30}
              width={140}
              height={50}
              fill="rgba(255, 255, 255, 0.95)"
              rx={8}
              ry={8}
              stroke="rgba(52, 152, 219, 0.3)"
              strokeWidth={1}
            />

            <SvgText
              x={40}
              y={50}
              fill="#2c3e50"
              fontSize={14}
              fontWeight="bold"
            >
              {t('Frekans Oranı', 'Frequency Ratio')}
            </SvgText>

            <SvgText
              x={40}
              y={70}
              fill="#e74c3c"
              fontSize={18}
              fontWeight="bold"
            >
              f'/f = {frequencyRatio.toFixed(3)}
            </SvgText>
          </Svg>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>
              {t('Kaynak Hızı', 'Source Velocity')}: {state.velocity} m/s
            </Text>
            <Slider
              style={styles.slider}
              value={state.velocity}
              minimumValue={50}
              maximumValue={500}
              step={5}
              onValueChange={handleVelocityChange}
              disabled={state.isRunning}
              minimumTrackTintColor="#3498db"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#3498db"
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {t(
                'Doppler etkisi, hareketli bir kaynaktan yayılan dalgaların, kaynağın hareketine bağlı olarak gözlemci tarafından farklı frekanslarda algılanması olayıdır.',
                "The Doppler effect is the phenomenon where waves from a moving source are perceived at different frequencies by an observer, depending on the source's motion."
              )}
            </Text>
            <Text style={styles.infoText}>
              {t(
                "Kaynak gözlemciye yaklaşırken, algılanan frekans artar (f' > f).",
                "When the source approaches the observer, the perceived frequency increases (f' > f)."
              )}
            </Text>
            <Text style={styles.infoText}>
              {t(
                "Kaynak gözlemciden uzaklaşırken, algılanan frekans azalır (f' < f).",
                "When the source moves away from the observer, the perceived frequency decreases (f' < f)."
              )}
            </Text>
            <Text style={styles.infoText}>
              {t(
                'Frekans değişimi, kaynağın hızına ve hareket yönüne bağlıdır.',
                "The frequency change depends on the source's velocity and direction of motion."
              )}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 50 : 200,
    padding: 16,
  },
  instructionContainer: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.1)',
  },
  instruction: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
    fontWeight: '500',
  },
  canvasContainer: {
    width: '100%',
    aspectRatio: 1.4,
    maxHeight: 800,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.1)',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.1)',
  },
  controlGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.1)',
  },
  infoText: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 12,
    lineHeight: 22,
    fontWeight: '400',
  },
});
