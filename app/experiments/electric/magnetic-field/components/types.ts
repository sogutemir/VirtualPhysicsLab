export type FieldType = 'straight' | 'coil' | 'bar';
export type ChargeType = 'positive' | 'negative' | 'both';

export interface ChargeParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  charge: number; // +1 for positive, -1 for negative
  mass: number;
}

export interface MagneticSimulatorProps {
  currentIntensity: number;
  wireDistance: number;
  coilTurns: number;
  fieldType: FieldType;
  showFieldLines: boolean;
  animateField: boolean;
  showCharges: boolean;
  chargeType: ChargeType;
  chargeSpeed: number;
  onChangeFieldType: (type: FieldType) => void;
  onToggleAnimation: () => void;
  onToggleFieldLines: () => void;
  onToggleCharges: () => void;
  onCoilTurnsChange: (turns: number) => void;
  onChargeTypeChange: (type: ChargeType) => void;
  onChargeSpeedChange: (speed: number) => void;
}

export interface ParameterControlsProps {
  title: string;
  currentIntensity: number;
  wireDistance: number;
  coilTurns: number;
  fieldType: FieldType;
  showCharges: boolean;
  chargeType: ChargeType;
  chargeSpeed: number;
  onCurrentIntensityChange: (value: number) => void;
  onWireDistanceChange: (value: number) => void;
  onCoilTurnsChange: (value: number) => void;
  onFieldTypeChange: (type: FieldType) => void;
  onToggleCharges: () => void;
  onChargeTypeChange: (type: ChargeType) => void;
  onChargeSpeedChange: (speed: number) => void;
  onReset: () => void;
}
