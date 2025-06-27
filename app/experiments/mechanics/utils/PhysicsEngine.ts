// Spring-Mass System Physics Engine
// Gelişmiş fizik hesaplamaları için optimized engine

export interface SpringMassSystem {
  time: number;
  position: number;
  velocity: number;
  acceleration: number;
  energy: {
    kinetic: number;
    potential: number;
    total: number;
  };
  force: {
    spring: number;
    damping: number;
    total: number;
  };
}

export class PhysicsEngine {
  private mass: number;
  private springConstant: number;
  private dampingCoefficient: number;
  private position: number;
  private velocity: number;
  private time: number;
  private dt: number; // Time step for integration
  private dataHistory: SpringMassSystem[] = [];
  private maxHistoryLength: number;
  private isMobile: boolean = false;

  constructor(
    mass: number = 1.0,
    springConstant: number = 10.0,
    dampingCoefficient: number = 0.1
  ) {
    this.mass = mass;
    this.springConstant = springConstant;
    this.dampingCoefficient = dampingCoefficient;
    this.position = 0;
    this.velocity = 0;
    this.time = 0;
    
    // Mobil optimizasyonu - daha büyük time step ve daha az history
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
    this.dt = this.isMobile ? 0.002 : 0.001; // Mobil için 2ms, web için 1ms
    this.maxHistoryLength = this.isMobile ? 1000 : 5000; // Mobil için daha az history
  }

  setMobileMode(isMobile: boolean): void {
    this.isMobile = isMobile;
    this.dt = isMobile ? 0.002 : 0.001;
    this.maxHistoryLength = isMobile ? 1000 : 5000;
  }

  updateParameters(
    mass: number,
    springConstant: number,
    dampingCoefficient: number
  ): void {
    this.mass = Math.max(0.1, mass);
    this.springConstant = Math.max(0.1, springConstant);
    this.dampingCoefficient = Math.max(0, dampingCoefficient);
  }

  setInitialConditions(position: number = 0, velocity: number = 0): void {
    this.position = position;
    this.velocity = velocity;
    this.time = 0;
    this.dataHistory = [];
  }

  // Mobil için basitleştirilmiş Euler integrasyon, web için Runge-Kutta 4
  private integrateStep(
    x: number,
    v: number,
    dt: number
  ): { newX: number; newV: number } {
    if (this.isMobile) {
      // Mobil için basit Euler integrasyon (daha hızlı)
      const acceleration = this.getAcceleration(x, v);
      const newV = v + acceleration * dt;
      const newX = x + v * dt;
      return { newX, newV };
    } else {
      // Web için Runge-Kutta 4th order integration (daha hassas)
      return this.rungeKutta4(x, v, dt);
    }
  }

  // Runge-Kutta 4th order integration for more accurate physics
  private rungeKutta4(
    x: number,
    v: number,
    dt: number
  ): { newX: number; newV: number } {
    const k1v = this.getAcceleration(x, v);
    const k1x = v;

    const k2v = this.getAcceleration(x + 0.5 * dt * k1x, v + 0.5 * dt * k1v);
    const k2x = v + 0.5 * dt * k1v;

    const k3v = this.getAcceleration(x + 0.5 * dt * k2x, v + 0.5 * dt * k2v);
    const k3x = v + 0.5 * dt * k2v;

    const k4v = this.getAcceleration(x + dt * k3x, v + dt * k3v);
    const k4x = v + dt * k3v;

    const newX = x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    const newV = v + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);

    return { newX, newV };
  }

  private getAcceleration(position: number, velocity: number): number {
    // F = ma = -kx - bv
    // a = (-kx - bv) / m
    const springForce = -this.springConstant * position;
    const dampingForce = -this.dampingCoefficient * velocity;
    return (springForce + dampingForce) / this.mass;
  }

  step(): SpringMassSystem {
    const result = this.integrateStep(this.position, this.velocity, this.dt);

    this.position = result.newX;
    this.velocity = result.newV;
    this.time += this.dt;

    const currentState = this.getCurrentState();

    // Add to history for charting - mobil için daha az sıklıkla
    if (!this.isMobile || this.dataHistory.length % 2 === 0) {
      this.dataHistory.push(currentState);
      if (this.dataHistory.length > this.maxHistoryLength) {
        this.dataHistory.shift();
      }
    }

    return currentState;
  }

  stepMultiple(steps: number = 1): SpringMassSystem {
    for (let i = 0; i < steps; i++) {
      this.step();
    }
    return this.getCurrentState();
  }

  getCurrentState(): SpringMassSystem {
    const acceleration = this.getAcceleration(this.position, this.velocity);

    // Energy calculations
    const kineticEnergy = 0.5 * this.mass * this.velocity * this.velocity;
    const potentialEnergy =
      0.5 * this.springConstant * this.position * this.position;
    const totalEnergy = kineticEnergy + potentialEnergy;

    // Force calculations
    const springForce = -this.springConstant * this.position;
    const dampingForce = -this.dampingCoefficient * this.velocity;
    const totalForce = springForce + dampingForce;

    return {
      time: this.time,
      position: this.position,
      velocity: this.velocity,
      acceleration,
      energy: {
        kinetic: kineticEnergy,
        potential: potentialEnergy,
        total: totalEnergy,
      },
      force: {
        spring: springForce,
        damping: dampingForce,
        total: totalForce,
      },
    };
  }

  getDataHistory(): SpringMassSystem[] {
    return [...this.dataHistory];
  }

  reset(): void {
    this.position = 0;
    this.velocity = 0;
    this.time = 0;
    this.dataHistory = [];
  }

  // Calculate theoretical properties
  getNaturalFrequency(): number {
    return Math.sqrt(this.springConstant / this.mass) / (2 * Math.PI);
  }

  getDampedFrequency(): number {
    const omega0 = Math.sqrt(this.springConstant / this.mass);
    const gamma = this.dampingCoefficient / (2 * this.mass);
    const omegaD = Math.sqrt(omega0 * omega0 - gamma * gamma);
    return omegaD / (2 * Math.PI);
  }

  getPeriod(): number {
    const dampedFreq = this.getDampedFrequency();
    return dampedFreq > 0 ? 1 / dampedFreq : Infinity;
  }

  getDampingRatio(): number {
    const criticalDamping = 2 * Math.sqrt(this.springConstant * this.mass);
    return this.dampingCoefficient / criticalDamping;
  }

  getSystemType(): 'underdamped' | 'critically_damped' | 'overdamped' {
    const ratio = this.getDampingRatio();
    if (ratio < 1) return 'underdamped';
    if (ratio === 1) return 'critically_damped';
    return 'overdamped';
  }

  // Calculate equivalent spring constants for series and parallel combinations
  static getSeriesSpringConstant(k1: number, k2: number, k3?: number): number {
    if (k3 !== undefined) {
      return 1 / (1 / k1 + 1 / k2 + 1 / k3);
    }
    return 1 / (1 / k1 + 1 / k2);
  }

  static getParallelSpringConstant(
    k1: number,
    k2: number,
    k3?: number
  ): number {
    if (k3 !== undefined) {
      return k1 + k2 + k3;
    }
    return k1 + k2;
  }

  // Energy decay calculations for damped systems
  getEnergyDecayRate(): number {
    const gamma = this.dampingCoefficient / (2 * this.mass);
    return 2 * gamma;
  }

  // Calculate amplitude decay over time
  getAmplitudeDecay(): number {
    const gamma = this.dampingCoefficient / (2 * this.mass);
    const omega0 = Math.sqrt(this.springConstant / this.mass);
    
    if (gamma < omega0) {
      // Underdamped case
      return Math.exp(-gamma * this.time);
    } else {
      // Overdamped or critically damped
      return Math.exp(-gamma * this.time);
    }
  }

  // Get system energy at any time t for underdamped motion
  getEnergyAtTime(t: number, initialEnergy: number): number {
    const decayRate = this.getEnergyDecayRate();
    return initialEnergy * Math.exp(-decayRate * t);
  }

  // Calculate quality factor (Q factor) of the system
  getQualityFactor(): number {
    const omega0 = Math.sqrt(this.springConstant / this.mass);
    const gamma = this.dampingCoefficient / (2 * this.mass);
    return omega0 / (2 * gamma);
  }
}
