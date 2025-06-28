import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { View, ScrollView, StyleSheet, Platform, Text } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { AtwoodMachineSystem } from './components/atwood/AtwooodMachineSystem';
import { AtwoodControls } from './components/atwood/AtwoodControls';

interface AtwoodMachineState {
  m1: number; // Mass 1 (kg)
  m2: number; // Mass 2 (kg)
  g: number; // Gravity (m/s²)
  ropeLength: number; // Rope length (m)
  isRunning: boolean;
  time: number;
  position1: number; // Position of mass 1 (meters from initial)
  position2: number; // Position of mass 2 (meters from initial)
  velocity: number; // Velocity of both masses
  acceleration: number; // System acceleration
  tension: number; // Rope tension
}

// Memoized physics calculation function
const calculatePhysics = (m1: number, m2: number, g: number) => {
  const acceleration = ((m1 - m2) * g) / (m1 + m2);
  const tension = (2 * m1 * m2 * g) / (m1 + m2);
  return { acceleration, tension };
};

export default function AtwoodMachineExperiment() {
  const [state, setState] = useState<AtwoodMachineState>({
    m1: 3.0,
    m2: 2.0,
    g: 9.8,
    ropeLength: 2.0,
    isRunning: false,
    time: 0,
    position1: 0,
    position2: 0,
    velocity: 0,
    acceleration: 0,
    tension: 0,
  });

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Memoize physics calculations to avoid recalculation on every render
  const physicsValues = useMemo(() => {
    return calculatePhysics(state.m1, state.m2, state.g);
  }, [state.m1, state.m2, state.g]);

  // Update physics calculation when masses or gravity change
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      acceleration: physicsValues.acceleration,
      tension: physicsValues.tension,
    }));
  }, [physicsValues]);

  // Optimized animation loop with better cleanup
  useEffect(() => {
    if (state.isRunning) {
      const animate = (currentTime: number) => {
        if (startTimeRef.current === 0) {
          startTimeRef.current = currentTime;
        }

        const totalElapsedTime = (currentTime - startTimeRef.current) / 1000;

        setState((prev) => {
          const newPosition =
            0.5 * prev.acceleration * totalElapsedTime * totalElapsedTime;
          const newVelocity = prev.acceleration * totalElapsedTime;

          const maxDistance = 6.0;

          if (Math.abs(newPosition) >= maxDistance) {
            return { ...prev, isRunning: false };
          }

          return {
            ...prev,
            time: totalElapsedTime,
            velocity: newVelocity,
            position1: newPosition,
            position2: -newPosition,
          };
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      startTimeRef.current = 0;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [state.isRunning]);

  // Memoized event handlers for better performance
  const handleToggleSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const handleReset = useCallback(() => {
    startTimeRef.current = 0;
    setState((prev) => ({
      ...prev,
      isRunning: false,
      time: 0,
      position1: 0,
      position2: 0,
      velocity: 0,
    }));
  }, []);

  const handleMass1Change = useCallback((value: number) => {
    setState((prev) => ({ ...prev, m1: value }));
  }, []);

  const handleMass2Change = useCallback((value: number) => {
    setState((prev) => ({ ...prev, m2: value }));
  }, []);

  const handleGravityChange = useCallback((value: number) => {
    setState((prev) => ({ ...prev, g: value }));
  }, []);

  // Memoize descriptions to avoid recreation
  const descriptions = useMemo(
    () => ({
      description: `🎯 Atwood Makinesi: Newton'un ikinci yasasını (F = ma) göstermek için kullanılan klasik fizik deneyidir.

📚 TEORİ VE FORMÜLLER:

⚡ Kuvvet Analizi:
• Kütle 1 için: m₁g - T = m₁a
• Kütle 2 için: T - m₂g = m₂a
• İp uzunluğu sabit: x₁ + x₂ = sabit

🔄 Hareket Denklemleri:
• İvme: a = (m₁ - m₂)g / (m₁ + m₂)
• Gerginlik: T = 2m₁m₂g / (m₁ + m₂)
• Hız: v(t) = v₀ + at
• Konum: x(t) = x₀ + v₀t + ½at²

⚖️ Özel Durumlar:
• m₁ = m₂ ⟹ a = 0 (denge)
• m₁ >> m₂ ⟹ a ≈ g (serbest düşme)
• m₂ = 0 ⟹ a = g (tek kütle)

🔋 Enerji Analizi:
• Potansiyel Enerji: ΔEp = (m₁ - m₂)gΔx
• Kinetik Enerji: Ek = ½(m₁ + m₂)v²
• Mekanik Enerji: E = Ek + Ep = sabit

🎮 Parametre Aralıkları:
- Kütle 1 (m₁): 0.5 - 5.0 kg
- Kütle 2 (m₂): 0.5 - 5.0 kg
- Yerçekimi (g): 1.0 - 15.0 m/s²
- İp Uzunluğu: 2.0 m (sabit)

🔬 Gözlemlenebilir Durumlar:
• Sabit ivmeli hareket
• Kütle oranının ivmeye etkisi
• İp gerginliği değişimi
• Enerji dönüşümü
• Newton'un 2. yasası doğrulaması

💻 Fiziksel Prensip:
Newton'un ikinci yasası (F = ma) ile kütlelerin birbirine bağlı hareketinin analizi. Sistem, ağır kütle tarafından çekilen hafif kütleyle birlikte sabit ivmeli hareket yapar.`,
      descriptionEn: `🎯 Atwood Machine: A classic physics experiment demonstrating Newton's second law (F = ma).

📚 THEORY AND FORMULAS:

⚡ Force Analysis:
• For mass 1: m₁g - T = m₁a
• For mass 2: T - m₂g = m₂a
• Rope constraint: x₁ + x₂ = constant

🔄 Equations of Motion:
• Acceleration: a = (m₁ - m₂)g / (m₁ + m₂)
• Tension: T = 2m₁m₂g / (m₁ + m₂)
• Velocity: v(t) = v₀ + at
• Position: x(t) = x₀ + v₀t + ½at²

⚖️ Special Cases:
• m₁ = m₂ ⟹ a = 0 (equilibrium)
• m₁ >> m₂ ⟹ a ≈ g (free fall)
• m₂ = 0 ⟹ a = g (single mass)

🔋 Energy Analysis:
• Potential Energy: ΔEp = (m₁ - m₂)gΔx
• Kinetic Energy: Ek = ½(m₁ + m₂)v²
• Mechanical Energy: E = Ek + Ep = constant

🎮 Parameter Ranges:
- Mass 1 (m₁): 0.5 - 5.0 kg
- Mass 2 (m₂): 0.5 - 5.0 kg
- Gravity (g): 1.0 - 15.0 m/s²
- Rope Length: 2.0 m (constant)

🔬 Observable Phenomena:
• Constant acceleration motion
• Effect of mass ratio on acceleration
• Rope tension variation
• Energy transformation
• Newton's 2nd law verification

💻 Physical Principle:
Analysis of coupled motion using Newton's second law (F = ma). The system undergoes constant acceleration driven by the heavier mass pulling the lighter mass.`,
    }),
    []
  );

  return (
    <ExperimentLayout
      title="Atwood Makinesi"
      titleEn="Atwood Machine"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description={descriptions.description}
      descriptionEn={descriptions.descriptionEn}
      isRunning={state.isRunning}
      onToggleSimulation={handleToggleSimulation}
      onReset={handleReset}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Kontrol Paneli */}
          <AtwoodControls
            state={state}
            onMass1Change={handleMass1Change}
            onMass2Change={handleMass2Change}
            onGravityChange={handleGravityChange}
            onStart={handleToggleSimulation}
            onReset={handleReset}
          />

          {/* Simülasyon */}
          <View style={styles.simulationContainer}>
            <AtwoodMachineSystem state={state} />
          </View>

          {/* Fizik Değerleri */}
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>Fizik Değerleri</Text>
            </View>

            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <View
                      style={[styles.colorDot, { backgroundColor: '#3b82f6' }]}
                    />
                    <Text style={styles.infoText}>İvme (a):</Text>
                  </View>
                  <Text style={[styles.infoValue, { color: '#3b82f6' }]}>
                    {state.acceleration.toFixed(3)} m/s²
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <View
                      style={[styles.colorDot, { backgroundColor: '#8b5cf6' }]}
                    />
                    <Text style={styles.infoText}>Gerginlik (T):</Text>
                  </View>
                  <Text style={[styles.infoValue, { color: '#8b5cf6' }]}>
                    {state.tension.toFixed(2)} N
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <View
                      style={[styles.colorDot, { backgroundColor: '#10b981' }]}
                    />
                    <Text style={styles.infoText}>Hız (v):</Text>
                  </View>
                  <Text style={[styles.infoValue, { color: '#10b981' }]}>
                    {state.velocity.toFixed(3)} m/s
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <View
                      style={[styles.colorDot, { backgroundColor: '#f59e0b' }]}
                    />
                    <Text style={styles.infoText}>Zaman (t):</Text>
                  </View>
                  <Text style={[styles.infoValue, { color: '#f59e0b' }]}>
                    {state.time.toFixed(2)} s
                  </Text>
                </View>
              </View>

              <View style={styles.formulaContainer}>
                <Text style={styles.formulaTitle}>Formüller:</Text>
                <Text style={styles.formulaText}>
                  a = (m₁ - m₂)g / (m₁ + m₂)
                </Text>
                <Text style={styles.formulaText}>T = 2m₁m₂g / (m₁ + m₂)</Text>
                <Text style={styles.formulaText}>v = at</Text>
                <Text style={styles.formulaText}>x = ½at²</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 50 : 200,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  simulationContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  infoContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formulaContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  formulaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  formulaText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 2,
  },
});
