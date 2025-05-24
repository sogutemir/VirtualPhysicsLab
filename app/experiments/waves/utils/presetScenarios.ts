import { WaveSource } from './waveCalculations';

export interface Scenario {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  explanation: string;
  explanationEn: string;
  icon: string;
  sources: [WaveSource, WaveSource];
  waveSpeed: number;
  damping: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export const presetScenarios: Scenario[] = [
  {
    id: 'basic-interference',
    name: 'Temel Girişim',
    nameEn: 'Basic Interference',
    description: 'İki aynı frekanslı dalga kaynağının temel girişim deseni',
    descriptionEn:
      'Basic interference pattern of two same-frequency wave sources',
    explanation:
      'Aynı frekans ve genlikte iki kaynak yapıcı ve yıkıcı girişim bölgeleri oluşturur',
    explanationEn:
      'Two sources with same frequency and amplitude create constructive and destructive interference zones',
    icon: '🌊',
    sources: [
      { x: 30, y: 50, frequency: 1.5, amplitude: 1, active: true, phase: 0 },
      { x: 70, y: 50, frequency: 1.5, amplitude: 1, active: true, phase: 0 },
    ],
    waveSpeed: 1,
    damping: 0.02,
    level: 'beginner',
  },
  {
    id: 'phase-difference',
    name: 'Faz Farkı',
    nameEn: 'Phase Difference',
    description: 'Aynı frekansta fakat farklı fazlarda dalga kaynakları',
    descriptionEn: 'Wave sources with same frequency but different phases',
    explanation:
      'Faz farkı girişim desenini değiştirir ve maksimum noktaları kaydırır',
    explanationEn:
      'Phase difference changes interference pattern and shifts maximum points',
    icon: '🔄',
    sources: [
      { x: 25, y: 50, frequency: 2, amplitude: 1, active: true, phase: 0 },
      {
        x: 75,
        y: 50,
        frequency: 2,
        amplitude: 1,
        active: true,
        phase: Math.PI,
      },
    ],
    waveSpeed: 1.2,
    damping: 0.015,
    level: 'intermediate',
  },
  {
    id: 'different-frequencies',
    name: 'Farklı Frekanslar',
    nameEn: 'Different Frequencies',
    description: 'Farklı frekanslarda dalga kaynakları ve çırpıntı',
    descriptionEn: 'Different frequency wave sources and beating',
    explanation:
      'Farklı frekanslar çırpıntı oluşturur ve karmaşık girişim desenleri yaratır',
    explanationEn:
      'Different frequencies create beating and complex interference patterns',
    icon: '🎵',
    sources: [
      { x: 40, y: 40, frequency: 1.8, amplitude: 1, active: true, phase: 0 },
      { x: 60, y: 60, frequency: 2.2, amplitude: 1, active: true, phase: 0 },
    ],
    waveSpeed: 1.5,
    damping: 0.025,
    level: 'intermediate',
  },
  {
    id: 'different-amplitudes',
    name: 'Farklı Genlikler',
    nameEn: 'Different Amplitudes',
    description: 'Aynı frekansta fakat farklı genlikte dalga kaynakları',
    descriptionEn: 'Same frequency but different amplitude wave sources',
    explanation: 'Farklı genlikler asimetrik girişim deseni oluşturur',
    explanationEn:
      'Different amplitudes create asymmetric interference pattern',
    icon: '📊',
    sources: [
      { x: 35, y: 50, frequency: 1.5, amplitude: 1.5, active: true, phase: 0 },
      { x: 65, y: 50, frequency: 1.5, amplitude: 0.8, active: true, phase: 0 },
    ],
    waveSpeed: 1,
    damping: 0.02,
    level: 'beginner',
  },
  {
    id: 'circular-arrangement',
    name: 'Dairesel Düzen',
    nameEn: 'Circular Arrangement',
    description: 'Merkeze yakın iki dalga kaynağının dairesel girişimi',
    descriptionEn: 'Circular interference of two wave sources close to center',
    explanation:
      'Yakın konumlu kaynaklar simetrik dairesel girişim deseni oluşturur',
    explanationEn:
      'Close sources create symmetric circular interference pattern',
    icon: '⭕',
    sources: [
      { x: 45, y: 45, frequency: 2.5, amplitude: 1, active: true, phase: 0 },
      { x: 55, y: 55, frequency: 2.5, amplitude: 1, active: true, phase: 0 },
    ],
    waveSpeed: 0.8,
    damping: 0.01,
    level: 'beginner',
  },
  {
    id: 'high-frequency',
    name: 'Yüksek Frekans',
    nameEn: 'High Frequency',
    description: 'Yüksek frekanslı dalgalar ve kısa dalga boyu efektleri',
    descriptionEn: 'High frequency waves and short wavelength effects',
    explanation:
      'Yüksek frekans daha sık girişim saçakları ve detaylı desenler oluşturur',
    explanationEn:
      'High frequency creates more frequent interference fringes and detailed patterns',
    icon: '⚡',
    sources: [
      { x: 20, y: 50, frequency: 4, amplitude: 0.8, active: true, phase: 0 },
      { x: 80, y: 50, frequency: 4, amplitude: 0.8, active: true, phase: 0 },
    ],
    waveSpeed: 2,
    damping: 0.03,
    level: 'advanced',
  },
  {
    id: 'damped-waves',
    name: 'Sönümlenmiş Dalgalar',
    nameEn: 'Damped Waves',
    description: 'Yüksek sönümleme ile dalga davranışının incelenmesi',
    descriptionEn: 'Study of wave behavior with high damping',
    explanation: 'Yüksek sönümleme dalgaların etkisini mesafe ile azaltır',
    explanationEn: 'High damping reduces wave effects with distance',
    icon: '📉',
    sources: [
      { x: 30, y: 30, frequency: 2, amplitude: 1.2, active: true, phase: 0 },
      {
        x: 70,
        y: 70,
        frequency: 2,
        amplitude: 1.2,
        active: true,
        phase: Math.PI / 2,
      },
    ],
    waveSpeed: 1,
    damping: 0.08,
    level: 'advanced',
  },
  {
    id: 'single-source',
    name: 'Tek Kaynak',
    nameEn: 'Single Source',
    description: 'Tek dalga kaynağının dairesel yayılım deseni',
    descriptionEn: 'Circular propagation pattern of single wave source',
    explanation: 'Tek kaynak dairesel dalgalar oluşturur ve girişim olmaz',
    explanationEn: 'Single source creates circular waves with no interference',
    icon: '🎯',
    sources: [
      { x: 50, y: 50, frequency: 2, amplitude: 1, active: true, phase: 0 },
      { x: 70, y: 50, frequency: 1.5, amplitude: 1, active: false, phase: 0 },
    ],
    waveSpeed: 1.2,
    damping: 0.02,
    level: 'beginner',
  },
];

/**
 * Get scenario by ID
 */
export function getScenarioById(id: string): Scenario | undefined {
  return presetScenarios.find((scenario) => scenario.id === id);
}

/**
 * Get scenarios by difficulty level
 */
export function getScenariosByLevel(
  level: 'beginner' | 'intermediate' | 'advanced'
): Scenario[] {
  return presetScenarios.filter((scenario) => scenario.level === level);
}

/**
 * Get random scenario
 */
export function getRandomScenario(): Scenario {
  const randomIndex = Math.floor(Math.random() * presetScenarios.length);
  return presetScenarios[randomIndex];
}
