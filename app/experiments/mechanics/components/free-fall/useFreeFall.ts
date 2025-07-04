import { useState, useCallback, useRef, useMemo } from 'react';
import { FreeFallState, Point2D, FREE_FALL_CONSTANTS } from './types';

const INITIAL_STATE: FreeFallState = {
  velocity: 60, // 120'nin yarısı - daha makul başlangıç
  angle: 45,
  frictionCoef: 0.002,
  time: 0,
  position: { x: 0, y: 0 },
  trajectory: [{ x: 0, y: 0 }],
  isRunning: false,
};

export const useFreeFall = (onStateChange?: (state: FreeFallState) => void) => {
  const [state, setState] = useState<FreeFallState>(INITIAL_STATE);
  const velocityRef = useRef({ vx: 0, vy: 0 });

  const setVelocity = useCallback((velocity: number) => {
    const clampedVelocity = Math.max(
      FREE_FALL_CONSTANTS.MIN_VELOCITY,
      Math.min(velocity, FREE_FALL_CONSTANTS.MAX_VELOCITY)
    );
    setState((prev: FreeFallState) => ({ ...prev, velocity: clampedVelocity }));
  }, []);

  const setAngle = useCallback((angle: number) => {
    setState((prev: FreeFallState) => ({ ...prev, angle }));
  }, []);

  const setFrictionCoef = useCallback((frictionCoef: number) => {
    setState((prev: FreeFallState) => ({ ...prev, frictionCoef }));
  }, []);

  const startSimulation = useCallback(() => {
    const angle = (state.angle * Math.PI) / 180;
    velocityRef.current = {
      vx: state.velocity * Math.cos(angle),
      vy: state.velocity * Math.sin(angle),
    };

    setState((prev: FreeFallState) => ({
      ...prev,
      isRunning: true,
      trajectory: [{ x: 0, y: 0 }],
      position: { x: 0, y: 0 },
      time: 0,
    }));
  }, [state.angle, state.velocity]);

  const stopSimulation = useCallback(() => {
    setState((prev: FreeFallState) => ({ ...prev, isRunning: false }));
  }, []);

  const resetSimulation = useCallback(() => {
    velocityRef.current = { vx: 0, vy: 0 };
    setState(INITIAL_STATE);
  }, []);

  const updatePosition = useCallback(() => {
    const dt = FREE_FALL_CONSTANTS.DT;
    const k = state.frictionCoef;
    const gravity = FREE_FALL_CONSTANTS.GRAVITY;

    let { vx, vy } = velocityRef.current;
    let { x, y } = state.position;

    // k1
    const v = Math.sqrt(vx * vx + vy * vy);
    const k1x = -k * v * vx;
    const k1y = -gravity - k * v * vy;

    // k2
    const vx2 = vx + (k1x * dt) / 2;
    const vy2 = vy + (k1y * dt) / 2;
    const v2 = Math.sqrt(vx2 * vx2 + vy2 * vy2);
    const k2x = -k * v2 * vx2;
    const k2y = -gravity - k * v2 * vy2;

    // k3
    const vx3 = vx + (k2x * dt) / 2;
    const vy3 = vy + (k2y * dt) / 2;
    const v3 = Math.sqrt(vx3 * vx3 + vy3 * vy3);
    const k3x = -k * v3 * vx3;
    const k3y = -gravity - k * v3 * vy3;

    // k4
    const vx4 = vx + k3x * dt;
    const vy4 = vy + k3y * dt;
    const v4 = Math.sqrt(vx4 * vx4 + vy4 * vy4);
    const k4x = -k * v4 * vx4;
    const k4y = -gravity - k * v4 * vy4;

    // Hız güncellemesi
    vx += ((k1x + 2 * k2x + 2 * k3x + k4x) * dt) / 6;
    vy += ((k1y + 2 * k2y + 2 * k3y + k4y) * dt) / 6;

    // Konum güncellemesi
    x += vx * dt;
    y += vy * dt;

    // Yere çarpma kontrolü
    if (y < 0) {
      y = 0;
      vx = 0;
      vy = 0;
      stopSimulation();
    }

    velocityRef.current = { vx, vy };
    const newPosition: Point2D = { x, y };

    // Trajectory optimization - limit points to improve performance
    const maxTrajectoryPoints = 500;
    const newTrajectory =
      state.trajectory.length >= maxTrajectoryPoints
        ? [...state.trajectory.slice(-maxTrajectoryPoints + 1), newPosition]
        : [...state.trajectory, newPosition];

    setState((prev: FreeFallState) => ({
      ...prev,
      position: newPosition,
      trajectory: newTrajectory,
      time: prev.time + dt,
      velocity: Math.sqrt(vx * vx + vy * vy),
    }));

    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, stopSimulation, onStateChange]);

  return {
    state,
    setVelocity,
    setAngle,
    setFrictionCoef,
    startSimulation,
    stopSimulation,
    resetSimulation,
    updatePosition,
  };
};
