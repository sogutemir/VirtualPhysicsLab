import React, {
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  memo,
} from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions } from 'react-native';
import Svg, { Line, Circle, Path, Text as SvgText } from 'react-native-svg';
import { FreeFallProps } from './types';
import { useFreeFall } from './useFreeFall';
import { FreeFallControls } from './FreeFallControls';
import { useLanguage } from '../../../../../components/LanguageContext';

const CANVAS_PADDING = 30;
const GRAVITY = 9.81;
const MAX_X = 1000;
const MAX_Y = 300;

export const MobileFreeFall = forwardRef<any, FreeFallProps>(
  (
    {
      width = Dimensions.get('window').width,
      height = Dimensions.get('window').height * 0.8,
      onStateChange,
    },
    ref
  ) => {
    const { t } = useLanguage();
    const animationRef = useRef<number>();
    const timeRef = useRef<number>(0);

    const canvasWidth = width * 0.98;
    const canvasHeight = Math.max(height * 0.7, 400);
    const scaleX = (canvasWidth - 2 * CANVAS_PADDING) / MAX_X;
    const scaleY = (canvasHeight - 2 * CANVAS_PADDING) / MAX_Y;

    const toCanvasX = useMemo(
      () => (x: number) => x * scaleX + CANVAS_PADDING,
      [scaleX]
    );
    const toCanvasY = useMemo(
      () => (y: number) => canvasHeight - (y * scaleY + CANVAS_PADDING),
      [canvasHeight, scaleY]
    );

    const {
      state,
      setVelocity,
      setAngle,
      setFrictionCoef,
      startSimulation,
      stopSimulation,
      resetSimulation,
      updatePosition,
    } = useFreeFall(onStateChange);

    // Ref ile dışarıya metodları açıyoruz
    useImperativeHandle(ref, () => ({
      startSimulation,
      stopSimulation,
      resetSimulation,
    }));

    // X ekseni işaretleri - Memoized
    const xAxisTicks = useMemo(() => {
      const ticks = [];
      for (let x = 0; x <= MAX_X; x += 200) {
        const canvasX = toCanvasX(x);
        ticks.push(
          <React.Fragment key={`x-${x}`}>
            <Line
              x1={canvasX}
              y1={canvasHeight - CANVAS_PADDING - 5}
              x2={canvasX}
              y2={canvasHeight - CANVAS_PADDING + 5}
              stroke="#7f8c8d"
              strokeWidth={1}
            />
            <SvgText
              x={canvasX}
              y={canvasHeight - CANVAS_PADDING + 18}
              fill="#7f8c8d"
              fontSize={11}
              textAnchor="middle"
              fontWeight="bold"
            >
              {x.toString() + ' m'}
            </SvgText>
          </React.Fragment>
        );
      }
      return ticks;
    }, [toCanvasX, canvasHeight]);

    // Y ekseni işaretleri - Memoized
    const yAxisTicks = useMemo(() => {
      const ticks = [];
      for (let y = 0; y <= MAX_Y; y += 50) {
        const canvasY = toCanvasY(y);
        ticks.push(
          <React.Fragment key={`y-${y}`}>
            <Line
              x1={CANVAS_PADDING - 5}
              y1={canvasY}
              x2={CANVAS_PADDING + 5}
              y2={canvasY}
              stroke="#7f8c8d"
              strokeWidth={1}
            />
            <SvgText
              x={CANVAS_PADDING - 10}
              y={canvasY + 4}
              fill="#7f8c8d"
              fontSize={11}
              textAnchor="end"
              fontWeight="bold"
            >
              {y.toString() + ' m'}
            </SvgText>
          </React.Fragment>
        );
      }
      return ticks;
    }, [toCanvasY]);

    // Yörünge path'i oluştur
    let trajectoryPath = '';
    if (state.trajectory.length >= 2) {
      trajectoryPath = `M ${toCanvasX(state.trajectory[0].x)} ${toCanvasY(
        state.trajectory[0].y
      )}`;
      for (let i = 1; i < state.trajectory.length; i++) {
        trajectoryPath += ` L ${toCanvasX(state.trajectory[i].x)} ${toCanvasY(
          state.trajectory[i].y
        )}`;
      }
    }

    // Cisim ve hız vektörü için hesaplamalar
    const x = toCanvasX(state.position.x);
    const y = toCanvasY(state.position.y);
    const angle = (state.angle * Math.PI) / 180;
    const vx = state.velocity * Math.cos(angle) * 0.3 * scaleX;
    const vy = state.velocity * Math.sin(angle) * 0.3 * scaleY;

    // Ok ucu için path (daha büyük ok)
    const arrowPath = `
    M ${x + vx} ${y - vy}
    L ${x + vx - 12 * Math.cos(angle - Math.PI / 6)} ${
      y - vy + 12 * Math.sin(angle - Math.PI / 6)
    }
    L ${x + vx - 12 * Math.cos(angle + Math.PI / 6)} ${
      y - vy + 12 * Math.sin(angle + Math.PI / 6)
    }
    Z
  `;

    // Bilgi metinleri
    const infoTexts = [
      `${t('t', 't')} = ${state.time.toFixed(2)} s`,
      `${t('x', 'x')} = ${state.position.x.toFixed(1)} m`,
      `${t('y', 'y')} = ${state.position.y.toFixed(1)} m`,
      `${t('v', 'v')} = ${state.velocity.toFixed(1)} m/s`,
    ];

    const animate = useCallback(() => {
      if (state.isRunning) {
        updatePosition();
        animationRef.current = requestAnimationFrame(animate);
      }
    }, [state.isRunning, updatePosition]);

    useEffect(() => {
      if (state.isRunning) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [state.isRunning, animate]);

    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.canvasContainer}>
            <Svg
              width={canvasWidth}
              height={canvasHeight}
              style={styles.canvas}
            >
              {/* Arka plan */}
              <Path
                d={`M 0 0 H ${canvasWidth} V ${canvasHeight} H 0 Z`}
                fill="#ffffff"
              />

              {/* X ekseni */}
              <Line
                x1={CANVAS_PADDING}
                y1={canvasHeight - CANVAS_PADDING}
                x2={canvasWidth - CANVAS_PADDING}
                y2={canvasHeight - CANVAS_PADDING}
                stroke="#7f8c8d"
                strokeWidth={2}
              />

              {/* Y ekseni */}
              <Line
                x1={CANVAS_PADDING}
                y1={CANVAS_PADDING}
                x2={CANVAS_PADDING}
                y2={canvasHeight - CANVAS_PADDING}
                stroke="#7f8c8d"
                strokeWidth={2}
              />

              {/* Eksen işaretleri */}
              {xAxisTicks}
              {yAxisTicks}

              {/* Eksen etiketleri */}
              <SvgText
                x={canvasWidth / 2}
                y={canvasHeight - 5}
                fill="#2c3e50"
                fontSize={14}
                fontWeight="bold"
                textAnchor="middle"
              >
                {t('x', 'x')} (m)
              </SvgText>

              <SvgText
                x={12}
                y={canvasHeight / 2}
                fill="#2c3e50"
                fontSize={14}
                fontWeight="bold"
                textAnchor="middle"
                rotation="-90"
                originX={12}
                originY={canvasHeight / 2}
              >
                {t('y', 'y')} (m)
              </SvgText>

              {/* Yörünge */}
              {trajectoryPath && (
                <Path
                  d={trajectoryPath}
                  stroke="#3498db"
                  strokeWidth={3}
                  fill="none"
                />
              )}

              {/* Cisim */}
              <Circle
                cx={x}
                cy={y}
                r={8}
                fill="#e74c3c"
                stroke="#fff"
                strokeWidth={2}
              />

              {/* Hız vektörü */}
              {state.isRunning && (
                <>
                  <Line
                    x1={x}
                    y1={y}
                    x2={x + vx}
                    y2={y - vy}
                    stroke="#2ecc71"
                    strokeWidth={3}
                  />

                  {/* Ok ucu */}
                  <Path d={arrowPath} fill="#2ecc71" stroke="#2ecc71" />
                </>
              )}

              {/* Bilgi metinleri - daha büyük ve daha iyi konumlandırma */}
              <SvgText
                x={canvasWidth - 10}
                y={25}
                fill="#2c3e50"
                fontSize={16}
                fontWeight="bold"
                textAnchor="end"
              >
                {t('Ölçümler', 'Measurements')}
              </SvgText>
              {infoTexts.map((text, index) => (
                <SvgText
                  key={`info-${index}`}
                  x={canvasWidth - 10}
                  y={50 + index * 20}
                  fill="#2c3e50"
                  fontSize={14}
                  fontWeight="bold"
                  textAnchor="end"
                >
                  {text}
                </SvgText>
              ))}
            </Svg>
          </View>

          <FreeFallControls
            state={state}
            onStart={state.isRunning ? stopSimulation : startSimulation}
            onReset={resetSimulation}
            onVelocityChange={setVelocity}
            onAngleChange={setAngle}
            onFrictionChange={setFrictionCoef}
          />
        </View>
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  content: {
    padding: 15,
  },
  canvasContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    minHeight: 450,
  },
  canvas: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
});
