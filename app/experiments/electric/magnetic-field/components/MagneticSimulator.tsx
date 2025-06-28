import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Svg, {
  Line,
  Circle,
  Path,
  G,
  Text as SvgText,
  Rect,
  Polygon,
  Ellipse,
  LinearGradient,
  Stop,
  Defs,
} from 'react-native-svg';
import { useLanguage } from '../../../../../components/LanguageContext';
// Icons için React Native ile uyumlu import
import { Platform } from 'react-native';

// React Native'de Lucide ikonları bazen sorun çıkarabilir, basit metinlerle değiştirebiliriz
const IconText = ({ children }: { children: string }) => (
  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#666' }}>
    {children}
  </Text>
);
import { FieldType, MagneticSimulatorProps, ChargeParticle } from './types';

const MagneticSimulator: React.FC<MagneticSimulatorProps> = ({
  currentIntensity,
  wireDistance,
  coilTurns,
  fieldType,
  showFieldLines,
  animateField,
  showCharges,
  chargeType,
  chargeSpeed,
  onChangeFieldType,
  onToggleAnimation,
  onToggleFieldLines,
  onToggleCharges,
  onCoilTurnsChange,
  onChargeTypeChange,
  onChargeSpeedChange,
}) => {
  const { language, t } = useLanguage();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isMobile = screenWidth < 600;
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Mobil için daha büyük simülasyon alanı
  const svgWidth = isMobile ? screenWidth - 32 : 500;
  const svgHeight = isMobile ? Math.min(screenHeight * 0.4, 350) : 400;
  
  const [animationPhase, setAnimationPhase] = useState(0);
  const [charges, setCharges] = useState<ChargeParticle[]>([]);
  const [chargePaths, setChargePaths] = useState<{
    [key: string]: { x: number; y: number }[];
  }>({});

  // PERFORMANS: Mobil için daha az yük parçacığı
  const chargeCount = isMobile ? 3 : 6;
  const maxTrailLength = isMobile ? 15 : 50;

  // PERFORMANS: Mobil için optimize edilmiş parametreler
  const BASE_MAGNETIC_STRENGTH = isMobile ? 0.0002 : 0.0001; // Mobilde daha güçlü etki
  const CHARGE_FORCE_FACTOR = isMobile ? 0.015 : 0.02; // Mobilde daha düşük hesaplama
  const DAMPING = isMobile ? 0.995 : 0.998; // Mobilde daha hızlı stabilizasyon
  const MAX_SPEED_FACTOR = isMobile ? 10 : 15; // Mobilde daha düşük maksimum hız

  // Artık Dimensions.get kullandığımız için bu effect'e gerek yok

  // Yük parçacıklarını başlat
  useEffect(() => {
    if (showCharges) {
      const newCharges: ChargeParticle[] = [];

      for (let i = 0; i < chargeCount; i++) {
        const angle = (i * 2 * Math.PI) / chargeCount;
        const radius = Math.min(svgWidth, svgHeight) * 0.25; // Daha küçük radius
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;

        let charge = 0;
        if (chargeType === 'positive') charge = 1;
        else if (chargeType === 'negative') charge = -1;
        else charge = i % 2 === 0 ? 1 : -1; // 'both' için alternatif

        // Başlangıç hızları - radyal yönde küçük hızlar
        const initialSpeed = chargeSpeed * 2; // Daha küçük başlangıç hızı

        newCharges.push({
          id: `charge-${i}`,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          vx: Math.cos(angle + Math.PI / 2) * initialSpeed,
          vy: Math.sin(angle + Math.PI / 2) * initialSpeed,
          charge,
          mass: 1, // Basitleştirilmiş kütle
        });
      }
      setCharges(newCharges);

      // Path'leri sıfırla
      const initialPaths: { [key: string]: { x: number; y: number }[] } = {};
      newCharges.forEach((charge) => {
        initialPaths[charge.id] = [{ x: charge.x, y: charge.y }];
      });
      setChargePaths(initialPaths);
    } else {
      setCharges([]);
      setChargePaths({});
    }
  }, [showCharges, chargeType, svgWidth, svgHeight, chargeSpeed]);

  useEffect(() => {
    let animationInterval: any;

    if (animateField) {
      const animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      animation.start();

      animationInterval = setInterval(() => {
        setAnimationPhase((prev) => (prev + 0.02) % 1);

        // Yük parçacıklarını güncelle - VEKTÖREL ALAN İLE DOĞRU FİZİK
        if (showCharges) {
          setCharges((prevCharges) =>
            prevCharges.map((charge) => {
              const newCharge = { ...charge };

              // Vektörel manyetik alan hesapla
              const fieldComponents = calculateMagneticFieldComponents(
                charge.x,
                charge.y,
                currentIntensity,
                fieldType,
                coilTurns,
                svgWidth,
                svgHeight
              );

              // Debug log kaldırıldı (mobil performans için)

              let forceX = 0;
              let forceY = 0;

              if (fieldType === 'straight') {
                // Düz tel: Dairesel yörünge (v ⊥ B)
                // Manyetik alan Z yönünde, Lorentz kuvveti düzlemde
                const fieldMagnitude = Math.abs(fieldComponents.z);
                forceX =
                  charge.charge *
                  charge.vy *
                  fieldMagnitude *
                  CHARGE_FORCE_FACTOR;
                forceY =
                  charge.charge *
                  -charge.vx *
                  fieldMagnitude *
                  CHARGE_FORCE_FACTOR;
              } else if (fieldType === 'coil') {
                // Bobin: Z ekseni boyunca alan
                const fieldMagnitude = Math.abs(fieldComponents.z);
                forceX =
                  charge.charge *
                  charge.vy *
                  fieldMagnitude *
                  CHARGE_FORCE_FACTOR;
                forceY =
                  charge.charge *
                  -charge.vx *
                  fieldMagnitude *
                  CHARGE_FORCE_FACTOR;
              } else if (fieldType === 'bar') {
                // Çubuk mıknatıs: DOĞRU FİZİK - Sadece manyetik alan etkisi
                // Mıknatıslar elektrik yüklerini çekmez/itmez!
                // Sadece hareket halindeki yüklere Lorentz kuvveti: F = q(v × B)
                const fieldMagnitude = Math.sqrt(
                  fieldComponents.x ** 2 +
                    fieldComponents.y ** 2 +
                    fieldComponents.z ** 2
                );

                // Manyetik alan vektörü (normalize edilmiş)
                const Bx = fieldComponents.x / (fieldMagnitude + 1e-10);
                const By = fieldComponents.y / (fieldMagnitude + 1e-10);
                const Bz = fieldComponents.z / (fieldMagnitude + 1e-10);

                // Lorentz kuvveti: F = q(v × B)
                // v × B = (vy*Bz - vz*By, vz*Bx - vx*Bz, vx*By - vy*Bx)
                // vz = 0 olduğu için (2D düzlem)
                forceX =
                  charge.charge *
                  (charge.vy * Bz) *
                  fieldMagnitude *
                  CHARGE_FORCE_FACTOR;
                forceY =
                  charge.charge *
                  (-charge.vx * Bz + charge.vx * By) *
                  fieldMagnitude *
                  CHARGE_FORCE_FACTOR;
              }

              // Hızı doğrudan güncelle (basitleştirilmiş)
              newCharge.vx += forceX;
              newCharge.vy += forceY;

              // Hafif damping
              newCharge.vx *= DAMPING;
              newCharge.vy *= DAMPING;

              // Hız sınırı
              const speed = Math.sqrt(newCharge.vx ** 2 + newCharge.vy ** 2);
              const maxSpeed = chargeSpeed * MAX_SPEED_FACTOR;
              if (speed > maxSpeed) {
                newCharge.vx = (newCharge.vx / speed) * maxSpeed;
                newCharge.vy = (newCharge.vy / speed) * maxSpeed;
              }

              // Pozisyonu güncelle
              newCharge.x += newCharge.vx;
              newCharge.y += newCharge.vy;

              // Elastik çarpışma sınırlarda
              const margin = 15;
              if (newCharge.x < margin) {
                newCharge.x = margin;
                newCharge.vx = -newCharge.vx * 0.8; // Enerji kaybı
              }
              if (newCharge.x > svgWidth - margin) {
                newCharge.x = svgWidth - margin;
                newCharge.vx = -newCharge.vx * 0.8;
              }
              if (newCharge.y < margin) {
                newCharge.y = margin;
                newCharge.vy = -newCharge.vy * 0.8;
              }
              if (newCharge.y > svgHeight - margin) {
                newCharge.y = svgHeight - margin;
                newCharge.vy = -newCharge.vy * 0.8;
              }

              return newCharge;
            })
          );

          // Yük yollarını güncelle (iz bırakma)
          setChargePaths((prevPaths) => {
            const newPaths = { ...prevPaths };
            charges.forEach((charge) => {
              if (!newPaths[charge.id]) {
                newPaths[charge.id] = [];
              }

              // PERFORMANS: Mobilde daha az trail point
              if (newPaths[charge.id].length > maxTrailLength) {
                newPaths[charge.id].shift();
              }

              newPaths[charge.id].push({ x: charge.x, y: charge.y });
            });
            return newPaths;
          });
        }
              }, isMobile ? 33 : 16); // Mobilde 30 FPS, web'de 60 FPS

      return () => {
        animation.stop();
        clearInterval(animationInterval);
      };
    } else {
      animatedValue.setValue(0);
      setAnimationPhase(0);
    }
  }, [
    animateField,
    animatedValue,
    showCharges,
    currentIntensity,
    fieldType,
    coilTurns,
    chargeSpeed,
    svgWidth,
    svgHeight,
  ]);

  // Doğru manyetik alan hesaplama - vektörel alan ile
  const calculateMagneticFieldComponents = (
    x: number,
    y: number,
    current: number,
    type: FieldType,
    turns: number,
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.max(Math.sqrt(dx ** 2 + dy ** 2), 10);

    let fieldX = 0;
    let fieldY = 0;
    let fieldZ = 0; // Ekrana dik bileşen

    switch (type) {
      case 'straight':
        // Düz tel: Dairesel manyetik alan (sağ el kuralı)
        // B ~ I/r, yön: teğetsel (ekrana dik)
        const fieldMagnitude =
          (current * BASE_MAGNETIC_STRENGTH * 800) / distance;
        fieldZ = fieldMagnitude; // Sadece Z bileşeni (ekrana dik)
        break;

      case 'coil':
        // Bobin: Merkez ekseni boyunca uniform alan
        const distanceFromCenter = distance / (width * 0.2);
        const baseMagnitude = current * turns * BASE_MAGNETIC_STRENGTH * 1200;

        if (distanceFromCenter < 1) {
          // Bobin içinde - uniform alan
          fieldZ = baseMagnitude;
        } else {
          // Bobin dışında - zayıflayan alan
          fieldZ = baseMagnitude / distanceFromCenter ** 2;
        }
        break;

      case 'bar':
        // Çubuk mıknatıs: N ve S kutup ayrı ayrı hesaplama
        const magnetLength = width * 0.3;
        const northX = centerX + magnetLength / 2;
        const northY = centerY;
        const southX = centerX - magnetLength / 2;
        const southY = centerY;

        // N kutbundan uzaklık
        const dxN = x - northX;
        const dyN = y - northY;
        const distanceN = Math.max(Math.sqrt(dxN ** 2 + dyN ** 2), 5);

        // S kutbundan uzaklık
        const dxS = x - southX;
        const dyS = y - southY;
        const distanceS = Math.max(Math.sqrt(dxS ** 2 + dyS ** 2), 5);

        // Dipol alan hesaplama
        const strength = current * BASE_MAGNETIC_STRENGTH * 1500;

        // N kutbu etkisi (pozitif)
        const fieldNX = (strength * dxN) / distanceN ** 3;
        const fieldNY = (strength * dyN) / distanceN ** 3;

        // S kutbu etkisi (negatif)
        const fieldSX = -(strength * dxS) / distanceS ** 3;
        const fieldSY = -(strength * dyS) / distanceS ** 3;

        // Toplam alan
        fieldX = fieldNX + fieldSX;
        fieldY = fieldNY + fieldSY;
        fieldZ = Math.sqrt(fieldX ** 2 + fieldY ** 2) * 0.1; // Z bileşeni
        break;
    }

    return { x: fieldX, y: fieldY, z: fieldZ };
  };

  // PERFORMANS: Memoized yük parçacığı render
  const renderChargeParticles = React.useMemo(() => {
    if (!showCharges) return null;

    return (
      <G>
        {/* PERFORMANS: Mobilde yük yollarını basitleştir */}
        {!isMobile && Object.entries(chargePaths).map(([chargeId, path]) => {
          if (path.length < 2) return null;

          const charge = charges.find((c) => c.id === chargeId);
          if (!charge) return null;

          const pathString = path.reduce((acc, point, index) => {
            if (index === 0) return `M ${point.x} ${point.y}`;
            return `${acc} L ${point.x} ${point.y}`;
          }, '');

          return (
            <Path
              key={`path-${chargeId}`}
              d={pathString}
              stroke={
                charge.charge > 0
                  ? 'rgba(239, 68, 68, 0.4)'
                  : 'rgba(59, 130, 246, 0.4)'
              }
              strokeWidth={2}
              fill="none"
              strokeDasharray="2,2"
            />
          );
        })}

        {/* Yük parçacıkları */}
        {charges.map((charge) => (
          <G key={charge.id}>
            {/* PERFORMANS: Mobilde gölge yok */}
            {!isMobile && (
              <Circle
                cx={charge.x + 1}
                cy={charge.y + 1}
                r={8}
                fill="rgba(0,0,0,0.2)"
              />
            )}

            {/* Yük parçacığı */}
            <Circle
              cx={charge.x}
              cy={charge.y}
              r={isMobile ? 6 : 8} // Mobilde daha küçük
              fill={charge.charge > 0 ? '#ef4444' : '#3b82f6'}
              stroke={charge.charge > 0 ? '#dc2626' : '#2563eb'}
              strokeWidth={isMobile ? 1 : 2}
            />

            {/* Yük işareti */}
            <SvgText
              x={charge.x}
              y={charge.y + 3}
              textAnchor="middle"
              fill="white"
              fontSize={isMobile ? "10" : "12"}
              fontWeight="bold"
            >
              {charge.charge > 0 ? '+' : '-'}
            </SvgText>

            {/* PERFORMANS: Mobilde hız vektörü ve kuvvet göstergesi yok */}
            {!isMobile && animateField && (
              <G>
                <Line
                  x1={charge.x}
                  y1={charge.y}
                  x2={charge.x + charge.vx * 0.05}
                  y2={charge.y + charge.vy * 0.05}
                  stroke={charge.charge > 0 ? '#fca5a5' : '#93c5fd'}
                  strokeWidth={3}
                />
                <Circle
                  cx={charge.x + charge.vx * 0.05}
                  cy={charge.y + charge.vy * 0.05}
                  r={2}
                  fill={charge.charge > 0 ? '#fca5a5' : '#93c5fd'}
                />
                <Circle
                  cx={charge.x}
                  cy={charge.y}
                  r={12}
                  fill="none"
                  stroke={
                    charge.charge > 0
                      ? 'rgba(239, 68, 68, 0.3)'
                      : 'rgba(59, 130, 246, 0.3)'
                  }
                  strokeWidth={1}
                  opacity={Math.abs(charge.vx + charge.vy) / 50}
                />
              </G>
            )}
          </G>
        ))}
      </G>
    );
  }, [showCharges, charges, chargePaths, animateField, isMobile]);

  const renderStraightWireMagneticField = () => {
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const radius = Math.min(svgWidth, svgHeight) * 0.4;

    const normalizedCurrent = currentIntensity / 10;
    const normalizedDistance = wireDistance / 50;
    const fieldRadius =
      radius * normalizedCurrent * (1 - 0.3 * normalizedDistance);

    const lineCount = 16;
    const angleStep = (2 * Math.PI) / lineCount;

    return (
      <G>
        {/* Düz tel */}
        <Line
          x1={centerX}
          y1={centerY - radius}
          x2={centerX}
          y2={centerY + radius}
          stroke="#333"
          strokeWidth={6}
        />

        {/* Akım yönü oku */}
        <Polygon
          points={`${centerX},${centerY - radius - 20} ${centerX - 10},${
            centerY - radius - 10
          } ${centerX + 10},${centerY - radius - 10}`}
          fill="#1E90FF"
        />

        {/* Akım etiketi */}
        <SvgText
          x={centerX}
          y={centerY - radius - 30}
          textAnchor="middle"
          fill="#1E90FF"
          fontWeight="bold"
          fontSize="16"
        >
          I = {currentIntensity} A
        </SvgText>

        {/* Manyetik alan çizgileri */}
        {showFieldLines && (
          <>
            <Circle
              cx={centerX}
              cy={centerY}
              r={fieldRadius}
              fill="rgba(147, 112, 219, 0.15)"
            />
            {Array.from({ length: lineCount }).map((_, i) => {
              const angle =
                i * angleStep +
                (animateField ? animationPhase * Math.PI * 2 : 0);
              const x = centerX + Math.cos(angle) * fieldRadius;
              const y = centerY + Math.sin(angle) * fieldRadius;

              const arrowLength = 30;
              const arrowAngle = 0.3;
              const startX = x - (Math.cos(angle) * arrowLength) / 2;
              const startY = y - (Math.sin(angle) * arrowLength) / 2;
              const endX = x + (Math.cos(angle) * arrowLength) / 2;
              const endY = y + (Math.sin(angle) * arrowLength) / 2;

              return (
                <G
                  key={`field-line-${i}`}
                  stroke="rgba(147, 112, 219, 0.7)"
                  strokeWidth={2}
                >
                  <Line x1={startX} y1={startY} x2={endX} y2={endY} />
                  <Line
                    x1={endX}
                    y1={endY}
                    x2={endX - Math.cos(angle + arrowAngle) * 10}
                    y2={endY - Math.sin(angle + arrowAngle) * 10}
                  />
                  <Line
                    x1={endX}
                    y1={endY}
                    x2={endX - Math.cos(angle - arrowAngle) * 10}
                    y2={endY - Math.sin(angle - arrowAngle) * 10}
                  />
                </G>
              );
            })}
          </>
        )}

        {/* Test parçacığı */}
        <Circle
          cx={centerX + wireDistance * 4}
          cy={centerY}
          r={8}
          fill="#F95738"
        />
      </G>
    );
  };

  const renderCoilMagneticField = () => {
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const radius = Math.min(svgWidth, svgHeight) * 0.4;

    const coilWidth = radius * 0.4;
    const coilHeight = radius * 1.2;
    const turnSpacing = coilHeight / (coilTurns + 1);

    const fieldStrength = (currentIntensity * coilTurns) / 10;

    return (
      <G>
        {/* Bobin sarımları */}
        {Array.from({ length: coilTurns }).map((_, i) => (
          <Ellipse
            key={`turn-${i}`}
            cx={centerX}
            cy={centerY - coilHeight / 2 + (i + 1) * turnSpacing}
            rx={coilWidth / 2}
            ry={coilWidth / 6}
            stroke="#333"
            strokeWidth={3}
            fill="none"
          />
        ))}

        {/* Akım yönü ve etiketler */}
        <Polygon
          points={`${centerX},${centerY - coilHeight / 2 - 20} ${
            centerX - 10
          },${centerY - coilHeight / 2 - 10} ${centerX + 10},${
            centerY - coilHeight / 2 - 10
          }`}
          fill="#1E90FF"
        />

        <SvgText
          x={centerX}
          y={centerY - coilHeight / 2 - 30}
          textAnchor="middle"
          fill="#1E90FF"
          fontWeight="bold"
          fontSize="16"
        >
          I = {currentIntensity} A
        </SvgText>

        {/* Manyetik alan çizgileri */}
        {showFieldLines && (
          <>
            {/* İç alan çizgileri */}
            {Array.from({ length: 7 }).map((_, i) => {
              const x = centerX - coilWidth * 0.4 + (i * (coilWidth * 0.8)) / 6;
              return (
                <G
                  key={`inner-field-${i}`}
                  stroke="rgba(147, 112, 219, 0.7)"
                  strokeWidth={2}
                >
                  <Line
                    x1={x}
                    y1={centerY - coilHeight / 4}
                    x2={x}
                    y2={centerY + coilHeight / 4}
                  />
                  <Line
                    x1={x}
                    y1={centerY + coilHeight / 4}
                    x2={x - 5}
                    y2={centerY + coilHeight / 4 - 10}
                  />
                  <Line
                    x1={x}
                    y1={centerY + coilHeight / 4}
                    x2={x + 5}
                    y2={centerY + coilHeight / 4 - 10}
                  />
                </G>
              );
            })}

            {/* Dış alan göstergesi */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.8}
              fill="none"
              stroke="rgba(147, 112, 219, 0.15)"
              strokeWidth={radius * 0.35 * fieldStrength}
            />
          </>
        )}
      </G>
    );
  };

  const renderBarMagnetField = () => {
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const radius = Math.min(svgWidth, svgHeight) * 0.4;

    const magnetWidth = radius * 0.8;
    const magnetHeight = radius * 0.3;
    const magnetX = centerX - magnetWidth / 2;
    const magnetY = centerY - magnetHeight / 2;

    // Alan çizgileri için kontrol noktaları
    const controlPointDistance = magnetWidth * 0.8;
    const fieldLineCount = 12;

    return (
      <G>
        <Defs>
          <LinearGradient id="magnetGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#F95738" />
            <Stop offset="1" stopColor="#1E90FF" />
          </LinearGradient>
        </Defs>

        {/* Mıknatıs gövdesi */}
        <Rect
          x={magnetX}
          y={magnetY}
          width={magnetWidth}
          height={magnetHeight}
          fill="url(#magnetGradient)"
        />

        {/* Kutup etiketleri - SOL TARAF N, SAĞ TARAF S */}
        <SvgText
          x={magnetX + magnetWidth / 4}
          y={centerY + 5}
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="20"
        >
          N
        </SvgText>
        <SvgText
          x={magnetX + (magnetWidth * 3) / 4}
          y={centerY + 5}
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="20"
        >
          S
        </SvgText>

        {/* Manyetik alan çizgileri */}
        {showFieldLines && (
          <>
            {Array.from({ length: fieldLineCount }).map((_, i) => {
              const offsetY =
                ((i - fieldLineCount / 2 + 0.5) * magnetHeight * 1.2) /
                fieldLineCount;
              const startX = magnetX + magnetWidth;
              const startY = centerY + offsetY;
              const endX = magnetX;
              const endY = centerY + offsetY;

              // Eğrisel alan çizgisi için kontrol noktaları
              const cp1x = startX + controlPointDistance;
              const cp1y = startY;
              const cp2x = endX - controlPointDistance;
              const cp2y = endY;

              // Animasyon fazını uygula
              const animOffset = animateField
                ? Math.sin(animationPhase * Math.PI * 2) * 10
                : 0;

              const path = `
                M ${startX} ${startY}
                C ${cp1x} ${cp1y + animOffset},
                  ${cp2x} ${cp2y + animOffset},
                  ${endX} ${endY}
              `;

              return (
                <G key={`field-line-${i}`}>
                  <Path
                    d={path}
                    stroke="rgba(147, 112, 219, 0.7)"
                    strokeWidth={2}
                    fill="none"
                  />
                  {/* Ok başları */}
                  {i % 2 === 0 && (
                    <>
                      <Circle
                        cx={magnetX + magnetWidth / 2}
                        cy={startY}
                        r={3}
                        fill="rgba(147, 112, 219, 0.7)"
                      />
                      {animateField && (
                        <Circle
                          cx={
                            magnetX +
                            magnetWidth / 2 +
                            Math.cos(animationPhase * Math.PI * 2) * 20
                          }
                          cy={
                            startY + Math.sin(animationPhase * Math.PI * 2) * 5
                          }
                          r={2}
                          fill="rgba(147, 112, 219, 0.5)"
                        />
                      )}
                    </>
                  )}
                </G>
              );
            })}

            {/* Alan şiddeti göstergesi */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.9}
              fill="none"
              stroke="rgba(147, 112, 219, 0.15)"
              strokeWidth={radius * 0.2}
            />
          </>
        )}

        {/* Alan yönü etiketi */}
        <SvgText
          x={centerX}
          y={magnetY + magnetHeight + 40}
          textAnchor="middle"
          fill="#9370DB"
          fontSize="16"
        >
          {t('Manyetik Alan Çizgileri: N → S', 'Magnetic Field Lines: N → S')}
        </SvgText>
      </G>
    );
  };

  return (
    <View style={[styles.container, isMobile && styles.mobileContainer]}>
      <View style={[styles.tabContainer, isMobile && styles.mobileTabContainer]}>
        <TouchableOpacity
          style={[
            styles.tab, 
            isMobile && styles.mobileTab,
            fieldType === 'straight' && styles.activeTab
          ]}
          onPress={() => onChangeFieldType('straight')}
        >
          <IconText>⚡</IconText>
          <Text
            style={[
              styles.tabText,
              isMobile && styles.mobileTabText,
              fieldType === 'straight' && styles.activeTabText,
            ]}
          >
            {t('Düz Tel', 'Straight Wire')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab, 
            isMobile && styles.mobileTab,
            fieldType === 'coil' && styles.activeTab
          ]}
          onPress={() => onChangeFieldType('coil')}
        >
          <IconText>🔄</IconText>
          <Text
            style={[
              styles.tabText,
              isMobile && styles.mobileTabText,
              fieldType === 'coil' && styles.activeTabText,
            ]}
          >
            {t('Bobin', 'Coil')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab, 
            isMobile && styles.mobileTab,
            fieldType === 'bar' && styles.activeTab
          ]}
          onPress={() => onChangeFieldType('bar')}
        >
          <IconText>🧲</IconText>
          <Text
            style={[
              styles.tabText,
              isMobile && styles.mobileTabText,
              fieldType === 'bar' && styles.activeTabText,
            ]}
          >
            {t('Çubuk Mıknatıs', 'Bar Magnet')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.svgContainer, isMobile && styles.mobileSvgContainer]}>
        <Svg width={svgWidth} height={svgHeight}>
          <Defs>
            <LinearGradient id="fieldGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="rgba(147, 112, 219, 0.3)" />
              <Stop offset="1" stopColor="rgba(147, 112, 219, 0.7)" />
            </LinearGradient>
          </Defs>

          {fieldType === 'straight' && renderStraightWireMagneticField()}
          {fieldType === 'coil' && renderCoilMagneticField()}
          {fieldType === 'bar' && renderBarMagnetField()}

          {/* Yük parçacıklarını en üstte render et */}
          {renderChargeParticles}
        </Svg>
      </View>

      <View style={[styles.controlsContainer, isMobile && styles.mobileControlsContainer]}>
        <TouchableOpacity
          style={[styles.controlButton, isMobile && styles.mobileControlButton]}
          onPress={onToggleAnimation}
        >
          <IconText>{animateField ? '⏸️' : '▶️'}</IconText>
          {!isMobile && (
            <Text style={styles.controlButtonText}>
              {animateField
                ? t('Animasyonu Durdur', 'Stop Animation')
                : t('Alanı Canlandır', 'Animate Field')}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isMobile && styles.mobileControlButton]}
          onPress={onToggleFieldLines}
        >
          <IconText>{showFieldLines ? '👁️' : '🙈'}</IconText>
          {!isMobile && (
            <Text style={styles.controlButtonText}>
              {showFieldLines
                ? t('Alan Çizgilerini Gizle', 'Hide Field Lines')
                : t('Alan Çizgilerini Göster', 'Show Field Lines')}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isMobile && styles.mobileControlButton]}
          onPress={onToggleCharges}
        >
          <IconText>{showCharges ? '⚡' : '💤'}</IconText>
          {!isMobile && (
            <Text style={styles.controlButtonText}>
              {showCharges
                ? t('Yükleri Gizle', 'Hide Charges')
                : t('Yükleri Göster', 'Show Charges')}
            </Text>
          )}
        </TouchableOpacity>

        {fieldType === 'coil' && (
          <View style={styles.coilControls}>
            <TouchableOpacity
              style={styles.coilButton}
              onPress={() => onCoilTurnsChange(Math.max(1, coilTurns - 1))}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#666' }}>−</Text>
            </TouchableOpacity>
            <Text style={styles.coilTurnsText}>{coilTurns}</Text>
            <TouchableOpacity
              style={styles.coilButton}
              onPress={() => onCoilTurnsChange(Math.min(20, coilTurns + 1))}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#666' }}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mobileContainer: {
    marginVertical: 8,
    borderRadius: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  mobileTabContainer: {
    paddingHorizontal: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
  },
  mobileTab: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    minHeight: 50,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#6b7280',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  mobileTabText: {
    fontSize: 12,
    marginLeft: 4,
    textAlign: 'center',
  },
  activeTabText: {
    color: '#374151',
    fontWeight: '500',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  mobileSvgContainer: {
    padding: 8,
    backgroundColor: '#f9fafb',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  mobileControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  mobileControlButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    minWidth: 50,
    minHeight: 50,
  },
  controlButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  coilControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  coilButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  coilTurnsText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
});

export default MagneticSimulator;
