import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Path,
  Line,
  Circle,
  Text as SvgText,
  Polyline,
} from 'react-native-svg';
import { TransverseWaveProps } from './types';
import { useTransverseWave } from './useTransverseWave';
import { TransverseWaveControls } from './TransverseWaveControls';
import { calculateWaveParameters } from './wave';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const MobileTransverseWave = forwardRef<any, TransverseWaveProps>(
  ({ width = SCREEN_WIDTH - 32, height = Math.min(SCREEN_HEIGHT * 0.35, 300), onStateChange }, ref) => {
    const {
      state,
      waveParameters,
      periodGraphData,
      setAmplitude,
      setWavelength,
      setWaveSpeed,
      setDirection,
      toggleVelocity,
      togglePeriodGraph,
      setMarkedPoints,
      setStepSize,
      startSimulation,
      stopSimulation,
      resetSimulation,
    } = useTransverseWave(onStateChange);

    // Ref ile dışarıya metodları açıyoruz
    useImperativeHandle(ref, () => ({
      startSimulation,
      stopSimulation,
      resetSimulation,
    }));

    // SVG için dalga yolu oluştur
    const createWavePath = () => {
      const { amplitude, waveNumber } = waveParameters;
      const centerY = height / 2;
      const directionFactor = state.direction === 'right' ? -1 : 1;

      let path = '';

      for (let x = 0; x <= width; x += 2) {
        // y = A * sin(kx - ωt)
        const y =
          amplitude * Math.sin(waveNumber * x + directionFactor * state.phase);
        const canvasY = centerY - y;

        if (x === 0) {
          path = `M ${x} ${canvasY}`;
        } else {
          path += ` L ${x} ${canvasY}`;
        }
      }

      return path;
    };

    // Izgara çizgileri oluştur
    const renderGridLines = () => {
      const centerY = height / 2;
      const gridLines = [];

      // Yatay ızgara çizgileri - mobilde daha seyrek
      for (let y = centerY; y >= 0; y -= state.amplitude / 2) {
        gridLines.push(
          <Line
            key={`h-up-${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke="#e9ecef"
            strokeWidth={1}
            opacity={0.6}
          />
        );
      }

      for (let y = centerY; y <= height; y += state.amplitude / 2) {
        gridLines.push(
          <Line
            key={`h-down-${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke="#e9ecef"
            strokeWidth={1}
            opacity={0.6}
          />
        );
      }

      // Dikey ızgara çizgileri - mobilde daha seyrek
      for (let x = 0; x < width; x += state.wavelength / 2) {
        gridLines.push(
          <Line
            key={`v-${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke="#e9ecef"
            strokeWidth={1}
            opacity={0.6}
          />
        );
      }

      // X ekseni - mobilde daha kalın
      gridLines.push(
        <Line
          key="x-axis"
          x1={0}
          y1={centerY}
          x2={width}
          y2={centerY}
          stroke="#adb5bd"
          strokeWidth={3}
        />
      );

      // Y ekseni - mobilde daha kalın
      gridLines.push(
        <Line
          key="y-axis"
          x1={0}
          y1={0}
          x2={0}
          y2={height}
          stroke="#adb5bd"
          strokeWidth={3}
        />
      );

      // Eksen etiketleri - mobilde daha büyük
      gridLines.push(
        <SvgText
          key="x-label"
          x={width - 20}
          y={centerY - 15}
          fill="#495057"
          fontSize={16}
          fontWeight="bold"
          textAnchor="middle"
        >
          x
        </SvgText>
      );

      gridLines.push(
        <SvgText
          key="y-label"
          x={15}
          y={15}
          fill="#495057"
          fontSize={16}
          fontWeight="bold"
          textAnchor="middle"
        >
          y
        </SvgText>
      );

      return gridLines;
    };

    // İşaretli noktaları oluştur - mobilde daha büyük
    const renderMarkedPoints = () => {
      const { amplitude, waveNumber } = waveParameters;
      const centerY = height / 2;
      const directionFactor = state.direction === 'right' ? -1 : 1;

      // Nokta renkleri - periyot grafiğindeki renklerle aynı
      const colors = ['#4263eb', '#fa5252', '#40c057', '#fab005', '#7950f2'];

      return state.markedPoints.map((point, index) => {
        const y =
          amplitude *
          Math.sin(waveNumber * point.x + directionFactor * state.phase);
        const canvasY = centerY - y;

        return (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={canvasY}
            r={8} // Mobilde daha büyük nokta
            fill={colors[index % colors.length]}
            stroke="#fff"
            strokeWidth={2}
          />
        );
      });
    };

    // Hız vektörlerini oluştur - mobilde daha büyük
    const renderVelocityVectors = () => {
      if (!state.showVelocity) return null;

      const { amplitude, waveNumber } = waveParameters;
      const centerY = height / 2;
      const directionFactor = state.direction === 'right' ? -1 : 1;
      const omega = waveParameters.waveSpeed * waveNumber;

      // Nokta renkleri - periyot grafiğindeki renklerle aynı
      const colors = ['#4263eb', '#fa5252', '#40c057', '#fab005', '#7950f2'];

      return state.markedPoints.map((point, index) => {
        const y =
          amplitude *
          Math.sin(waveNumber * point.x + directionFactor * state.phase);
        const canvasY = centerY - y;

        // Hız vektörü: v = -ω * A * cos(kx - ωt)
        const velocityY =
          -omega *
          amplitude *
          Math.cos(waveNumber * point.x + directionFactor * state.phase);
        const scaledVelocity = velocityY / 4; // Mobilde biraz daha büyük

        // Ok başı için açı
        const arrowLength = 12; // Mobilde daha büyük ok
        const angle = Math.atan2(-scaledVelocity, 0);

        // Nokta rengiyle aynı renkte vektör
        const color = colors[index % colors.length];

        return (
          <React.Fragment key={`velocity-${index}`}>
            <Line
              x1={point.x}
              y1={canvasY}
              x2={point.x}
              y2={canvasY - scaledVelocity}
              stroke={color}
              strokeWidth={3} // Mobilde daha kalın
            />
            <Path
              d={`
                M ${point.x} ${canvasY - scaledVelocity}
                L ${point.x - arrowLength * Math.cos(angle - Math.PI / 6)} ${
                canvasY -
                scaledVelocity -
                arrowLength * Math.sin(angle - Math.PI / 6)
              }
                L ${point.x - arrowLength * Math.cos(angle + Math.PI / 6)} ${
                canvasY -
                scaledVelocity -
                arrowLength * Math.sin(angle + Math.PI / 6)
              }
                Z
              `}
              fill={color}
            />
          </React.Fragment>
        );
      });
    };

    // Periyot grafiğini SVG ile çiz - mobilde optimize edilmiş
    const renderPeriodGraph = () => {
      if (!state.showPeriodGraph || !periodGraphData) return null;

      const periodGraphHeight = Math.min(height * 0.8, 200); // Mobilde daha kompakt
      const centerY = periodGraphHeight / 2;
      const elements = [];

      // Arka plan
      elements.push(
        <Path
          key="background"
          d={`M 0 0 H ${width} V ${periodGraphHeight} H 0 Z`}
          fill="rgba(248, 249, 250, 0.95)"
          stroke="#e9ecef"
          strokeWidth={1}
        />
      );

      // X ekseni
      elements.push(
        <Line
          key="x-axis"
          x1={0}
          y1={centerY}
          x2={width}
          y2={centerY}
          stroke="#adb5bd"
          strokeWidth={3}
        />
      );

      // Zaman işaretleri - mobilde daha büyük
      const period = waveParameters.period;
      const timeScale = width / (period * 2);

      for (let t = 0; t <= period * 2; t += period / 2) { // Mobilde daha seyrek işaret
        const x = t * timeScale;
        elements.push(
          <Line
            key={`time-mark-${t}`}
            x1={x}
            y1={centerY - 8}
            x2={x}
            y2={centerY + 8}
            stroke="#adb5bd"
            strokeWidth={2}
          />
        );
        elements.push(
          <SvgText
            key={`time-label-${t}`}
            x={x}
            y={centerY + 25}
            fill="#495057"
            fontSize={12}
            fontWeight="500"
            textAnchor="middle"
          >
            {t.toFixed(1)}s
          </SvgText>
        );
      }

      // Her nokta için zaman grafiği çiz - mobilde daha kalın
      const colors = ['#4263eb', '#fa5252', '#40c057', '#fab005', '#7950f2'];

      Object.keys(periodGraphData).forEach((pointIndex, idx) => {
        const pointData = periodGraphData[Number(pointIndex)];
        if (!pointData || pointData.length < 2) return;

        const color = colors[idx % colors.length];
        let points = '';

        pointData.forEach((point) => {
          const x = point.x * timeScale;
          const y = centerY - point.y;
          points += `${x},${y} `;
        });

        elements.push(
          <Polyline
            key={`graph-${pointIndex}`}
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={3} // Mobilde daha kalın çizgi
          />
        );
      });

      return elements;
    };

    return (
      <View style={styles.container}>
        <View style={[styles.canvasContainer, { width, height }]}>
          <Svg
            width={width}
            height={height}
            style={{ backgroundColor: '#f8f9fa' }}
          >
            {renderGridLines()}
            <Path
              d={createWavePath()}
              stroke="#4263eb"
              strokeWidth={4} // Mobilde ana dalga daha kalın
              fill="none"
            />
            {renderMarkedPoints()}
            {renderVelocityVectors()}
          </Svg>
        </View>

        {state.showPeriodGraph && (
          <View style={[styles.periodGraphContainer, { width, height: Math.min(height * 0.8, 200) }]}>
            <Svg
              width={width}
              height={Math.min(height * 0.8, 200)}
              style={{ backgroundColor: '#f8f9fa' }}
            >
              {renderPeriodGraph()}
            </Svg>
          </View>
        )}

        <View style={styles.controlsWrapper}>
          <TransverseWaveControls
            state={state}
            onAmplitudeChange={setAmplitude}
            onWavelengthChange={setWavelength}
            onSpeedChange={setWaveSpeed}
            onDirectionChange={setDirection}
            onVelocityToggle={toggleVelocity}
            onMarkedPointsChange={setMarkedPoints}
            onStepSizeChange={setStepSize}
            onPeriodGraphToggle={togglePeriodGraph}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  canvasContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  periodGraphContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlsWrapper: {
    width: '100%',
    paddingTop: 10,
  },
});
