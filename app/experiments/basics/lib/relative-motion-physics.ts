export class RelativeMotionPhysics {
  private gravity = 9.81; // m/s²

  calculateProjectileMotion(
    initialSpeed: number,
    angle: number,
    time: number,
    trainSpeed: number = 0
  ): { x: number; y: number; isGrounded: boolean } {
    const angleRad = (angle * Math.PI) / 180;
    const vx = initialSpeed * Math.cos(angleRad);
    const vy = initialSpeed * Math.sin(angleRad);

    // Position relative to ground (including train movement)
    const x = (vx + trainSpeed) * time;
    const y = vy * time - 0.5 * this.gravity * time * time;

    // Check if ball has hit the ground
    const isGrounded = y <= 0 && time > 0;

    return {
      x,
      y: Math.max(0, y),
      isGrounded,
    };
  }

  calculateRelativePosition(
    groundPosition: { x: number; y: number },
    trainPosition: number
  ): { x: number; y: number } {
    return {
      x: groundPosition.x - trainPosition,
      y: groundPosition.y,
    };
  }

  calculateVelocity(
    initialSpeed: number,
    angle: number,
    time: number,
    trainSpeed: number = 0
  ): { vx: number; vy: number } {
    const angleRad = (angle * Math.PI) / 180;
    const vx = initialSpeed * Math.cos(angleRad) + trainSpeed;
    const vy = initialSpeed * Math.sin(angleRad) - this.gravity * time;

    return { vx, vy };
  }

  getMaxRange(
    initialSpeed: number,
    angle: number,
    trainSpeed: number = 0
  ): number {
    const angleRad = (angle * Math.PI) / 180;
    const vx = initialSpeed * Math.cos(angleRad) + trainSpeed;
    const vy = initialSpeed * Math.sin(angleRad);

    const flightTime = (2 * vy) / this.gravity;
    return vx * flightTime;
  }

  getMaxHeight(initialSpeed: number, angle: number): number {
    const angleRad = (angle * Math.PI) / 180;
    const vy = initialSpeed * Math.sin(angleRad);

    return (vy * vy) / (2 * this.gravity);
  }

  getFlightTime(initialSpeed: number, angle: number): number {
    const angleRad = (angle * Math.PI) / 180;
    const vy = initialSpeed * Math.sin(angleRad);
    return (2 * vy) / this.gravity;
  }
}
