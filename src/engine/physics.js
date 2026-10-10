/**
 * JFloorGame Physics & Kinematics Engine (physics.js)
 * Fixed-timestep 60Hz kinematics with gravity inversion & time dilation
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JFloorPhysics = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Default calibrated parameters for Puzzle-Hazard Variant
  const DEFAULTS = {
    standardGravity: 1100,      // px/s^2
    jumpImpulse: 340,           // px/s magnitude
    terminalVelocity: 520,      // px/s cap
    scrollSpeed: 150,           // px/s horizontal scroll
    inputBufferWindow: 120,     // ms
    coyoteWindow: 80,           // ms
    viewportWidth: 400,
    viewportHeight: 700,
    floorHeight: 48,
    ceilingHeight: 12,
    playerX: 80,
    playerRadius: 14            // 28px inner hitbox
  };

  class PhysicsWorld {
    constructor(config = {}) {
      this.config = Object.assign({}, DEFAULTS, config);
      this.reset();
    }

    reset() {
      this.y = 300;
      this.vy = 0;
      this.gravityDirection = 1; // +1 = down (standard), -1 = up (inverted)
      this.targetGravityDir = 1;
      this.gravityTransition = 1; // -1 to +1 interpolated
      this.timeDilation = 1.0;
      this.targetTimeDilation = 1.0;
      this.scrollOffset = 0;
      this.rotation = 0; // degrees
      this.bufferedJumpTime = 0;
      this.lastGroundedTime = 0;
      this.isGrounded = false;
      this.isDead = false;
      this.deathReason = null;
      this.ceilingContact = false;
      this.floorContact = false;
    }

    setGravityDirection(dir) {
      if (dir === 1 || dir === -1) {
        this.targetGravityDir = dir;
      }
    }

    toggleGravity() {
      this.targetGravityDir = this.targetGravityDir === 1 ? -1 : 1;
      return this.targetGravityDir;
    }

    setTimeDilation(scale) {
      this.targetTimeDilation = Math.max(0.1, Math.min(1.0, scale));
    }

    bufferJump(timestamp = performance.now()) {
      this.bufferedJumpTime = timestamp;
    }

    applyFlap() {
      // Impulse opposes current target gravity
      if (this.targetGravityDir === 1) {
        this.vy = -this.config.jumpImpulse;
      } else {
        this.vy = this.config.jumpImpulse;
      }
      this.bufferedJumpTime = 0;
    }

    update(dtReal, now = performance.now()) {
      if (this.isDead) return;

      // Smoothly interpolate time dilation
      this.timeDilation += (this.targetTimeDilation - this.timeDilation) * 0.15;
      const dt = dtReal * this.timeDilation;

      // Smoothly interpolate gravity direction for orientation
      this.gravityTransition += (this.targetGravityDir - this.gravityTransition) * 0.2;
      this.gravityDirection = this.targetGravityDir;

      // Check input buffer
      if (now - this.bufferedJumpTime <= this.config.inputBufferWindow && this.bufferedJumpTime > 0) {
        this.applyFlap();
      }

      // Kinematic integration
      const currentG = this.config.standardGravity * this.gravityDirection;
      this.vy += currentG * dt;

      // Clamp terminal velocity
      if (this.gravityDirection === 1) {
        if (this.vy > this.config.terminalVelocity) {
          this.vy = this.config.terminalVelocity;
        }
      } else {
        if (this.vy < -this.config.terminalVelocity) {
          this.vy = -this.config.terminalVelocity;
        }
      }

      this.y += this.vy * dt;
      this.scrollOffset += this.config.scrollSpeed * dt;

      // Calculate pitch rotation
      const diveFactor = Math.max(-1, Math.min(1, this.vy / this.config.jumpImpulse));
      if (this.gravityDirection === 1) {
        // Standard: -15 deg flap, +45 deg dive
        if (this.vy < 0) {
          this.rotation = -15 * Math.abs(diveFactor);
        } else {
          this.rotation = Math.min(45, this.vy * 0.12);
        }
      } else {
        // Inverted: +15 deg flap, -45 deg dive
        if (this.vy > 0) {
          this.rotation = 180 + 15 * Math.abs(diveFactor);
        } else {
          this.rotation = 180 - Math.min(45, Math.abs(this.vy) * 0.12);
        }
      }

      // Viewport boundaries
      const floorY = this.config.viewportHeight - this.config.floorHeight - this.config.playerRadius;
      const ceilY = this.config.ceilingHeight + this.config.playerRadius;

      this.ceilingContact = false;
      this.floorContact = false;

      if (this.gravityDirection === 1) {
        // Standard Gravity:
        // Floor is FATAL
        if (this.y >= floorY) {
          this.y = floorY;
          this.isDead = true;
          this.deathReason = 'FATAL_FLOOR_COLLISION';
        }
        // Ceiling is NON-LETHAL clamp & bounce
        if (this.y <= ceilY) {
          this.y = ceilY;
          this.vy = 60; // Gentle bounce downwards
          this.ceilingContact = true;
        }
      } else {
        // Inverted Gravity:
        // Ceiling is FATAL
        if (this.y <= ceilY) {
          this.y = ceilY;
          this.isDead = true;
          this.deathReason = 'FATAL_CEILING_COLLISION';
        }
        // Floor is NON-LETHAL clamp & bounce
        if (this.y >= floorY) {
          this.y = floorY;
          this.vy = -60; // Gentle bounce upwards
          this.floorContact = true;
        }
      }
    }
  }

  return {
    DEFAULTS,
    PhysicsWorld
  };
}));
