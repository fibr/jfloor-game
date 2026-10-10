/**
 * JFloorGame: Puzzle-Hazard Variant Prototype (puzzle-game.js)
 * Implements Bit-Flip Gravity Gates, Breakpoint Slow-Mo Fields,
 * Oscillating Dead Hardware, Memory Leak Vents, and 3-Tier Hitboxes.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JFloorPuzzleGame = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const Audio = (typeof JFloorAudio !== 'undefined') ? JFloorAudio : (typeof root !== 'undefined' && root.JFloorAudio);
  const Sprites = (typeof JFloorSprites !== 'undefined') ? JFloorSprites : (typeof root !== 'undefined' && root.JFloorSprites);
  const Physics = (typeof JFloorPhysics !== 'undefined') ? JFloorPhysics : (typeof root !== 'undefined' && root.JFloorPhysics);
  const Collision = (typeof JFloorCollision !== 'undefined') ? JFloorCollision : (typeof root !== 'undefined' && root.JFloorCollision);

  class PuzzleGame {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width || 400;
      this.height = canvas.height || 700;

      // Physics World calibrated to Puzzle spec
      this.physics = new Physics.PhysicsWorld({
        standardGravity: 1100,
        jumpImpulse: 340,
        terminalVelocity: 520,
        scrollSpeed: 150,
        inputBufferWindow: 120,
        coyoteWindow: 80,
        viewportWidth: this.width,
        viewportHeight: this.height,
        floorHeight: 48,
        ceilingHeight: 20,
        playerX: 90,
        playerRadius: 14
      });

      this.collision = new Collision.CollisionSystem({
        innerRadius: 14,
        radarMargin: 12,
        chamferSize: 8
      });

      // Game state
      this.state = 'READY'; // READY, PLAYING, GAME_OVER
      this.score = 0;
      this.highScore = 0;
      this.commits = 0;
      this.streak = 1;
      this.nearMissStreak = 0;

      // Powerups
      this.hasShield = false;
      this.invulnerableTimer = 0;
      this.boostTimer = 0;

      // Entities
      this.obstacles = [];
      this.pickups = [];
      this.particles = [];
      this.floatingTexts = [];
      this.nextSpawnX = 350;
      this.spawnPatternIndex = 0;

      // Telemetry & Debug
      this.showDebug = options.showDebug || false;
      this.fps = 60;
      this.lastFrameTime = performance.now();
      this.frameCount = 0;
      this.fpsTimer = performance.now();

      // Background parallax offsets
      this.bgGridOffset = 0;
      this.bgRackOffset = 0;

      // Screen effects
      this.screenShake = 0;
      this.flashAlpha = 0;
      this.flashColor = '#ffffff';

      this.initEvents();
    }

    initEvents() {
      // Keyboard listeners
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          this.handleAction();
        } else if (e.code === 'KeyD') {
          this.showDebug = !this.showDebug;
        } else if (e.code === 'KeyR') {
          this.restart();
        } else if (e.code === 'KeyM') {
          if (Audio) Audio.toggleMute();
        } else if (e.code === 'KeyG') {
          // Debug gravity flip
          this.physics.toggleGravity();
          if (Audio) Audio.playBitFlip();
        }
      });

      // Touch / Mouse listener
      const trigger = (e) => {
        e.preventDefault();
        this.handleAction();
      };
      this.canvas.addEventListener('mousedown', trigger);
      this.canvas.addEventListener('touchstart', trigger, { passive: false });
    }

    handleAction() {
      if (Audio) Audio.init();

      if (this.state === 'READY') {
        this.state = 'PLAYING';
        this.physics.applyFlap();
        if (Audio) Audio.playJump();
        this.spawnJumpParticles();
      } else if (this.state === 'PLAYING') {
        this.physics.bufferJump(performance.now());
        this.physics.applyFlap();
        if (Audio) Audio.playJump();
        this.spawnJumpParticles();
      } else if (this.state === 'GAME_OVER') {
        this.restart();
      }
    }

    restart() {
      this.state = 'READY';
      this.physics.reset();
      this.score = 0;
      this.streak = 1;
      this.nearMissStreak = 0;
      this.hasShield = false;
      this.invulnerableTimer = 0;
      this.boostTimer = 0;
      this.obstacles = [];
      this.pickups = [];
      this.particles = [];
      this.floatingTexts = [];
      this.nextSpawnX = 350;
      this.spawnPatternIndex = 0;
      this.screenShake = 0;
      this.flashAlpha = 0;
    }

    spawnJumpParticles() {
      const px = this.physics.config.playerX;
      const py = this.physics.y;
      const dir = this.physics.gravityDirection;

      for (let i = 0; i < 6; i++) {
        this.particles.push({
          x: px - 10 + Math.random() * 8,
          y: py + (dir === 1 ? 16 : -16),
          vx: -60 - Math.random() * 40,
          vy: (dir === 1 ? 40 : -40) + (Math.random() - 0.5) * 60,
          size: 2.5 + Math.random() * 2,
          color: dir === 1 ? '#38bdf8' : '#ec4899',
          life: 0.35,
          maxLife: 0.35
        });
      }
    }

    spawnDebris(x, y, count = 18) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * 180;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 4,
          color: ['#ef4444', '#f59e0b', '#3b82f6', '#94a3b8', '#ffffff'][Math.floor(Math.random() * 5)],
          life: 0.8 + Math.random() * 0.4,
          maxLife: 1.2
        });
      }
    }

    addFloatingText(text, x, y, color = '#22c55e') {
      this.floatingTexts.push({
        text,
        x,
        y,
        color,
        life: 0.9,
        maxLife: 0.9
      });
    }

    // Procedural level generator creating puzzle patterns
    generateLevel(scrollOffset) {
      const spawnLead = 450;
      const currentScroll = this.physics.scrollOffset;

      while (this.nextSpawnX < currentScroll + this.width + spawnLead) {
        const pattern = this.spawnPatternIndex % 6;
        const x = this.nextSpawnX;

        if (pattern === 0) {
          // Warmup CRT Monitor Stack (Static gap 165px)
          const gapY = 280 + (Math.sin(this.spawnPatternIndex) * 80);
          const gapSize = 165;
          this.obstacles.push({
            id: 'crt_' + this.spawnPatternIndex,
            type: 'crt_stack',
            x: x,
            w: 64,
            gapY: gapY,
            gapSize: gapSize,
            oscillating: false,
            passed: false,
            nearMissChecked: false
          });
          // Commit pickup in gap
          this.pickups.push({
            type: 'commit',
            x: x + 32,
            y: gapY + gapSize / 2,
            radius: 12,
            collected: false
          });
          this.nextSpawnX += 240;
        } else if (pattern === 1) {
          // Bit-Flip Gravity Inversion NOT Gate
          const gateY = 180 + Math.random() * 120;
          this.obstacles.push({
            id: 'gate_' + this.spawnPatternIndex,
            type: 'bit_flip_gate',
            x: x,
            y: gateY,
            w: 56,
            h: 180,
            passed: false,
            triggered: false
          });
          // Rubber duck shield pickup right after first gravity gate
          if (Math.random() < 0.6) {
            this.pickups.push({
              type: 'duck',
              x: x + 140,
              y: gateY + 90,
              radius: 14,
              collected: false
            });
          }
          this.nextSpawnX += 220;
        } else if (pattern === 2) {
          // Oscillating Dead Computers (Moving CRT stacks)
          const baseGapY = 300;
          const gapSize = 155;
          this.obstacles.push({
            id: 'osc_' + this.spawnPatternIndex,
            type: 'crt_stack',
            x: x,
            w: 64,
            gapY: baseGapY,
            gapSize: gapSize,
            oscillating: true,
            amplitude: 45,
            frequency: 2.2,
            phase: Math.random() * Math.PI,
            passed: false,
            nearMissChecked: false
          });
          this.nextSpawnX += 250;
        } else if (pattern === 3) {
          // Breakpoint Slow-Mo Field (`debugger;` execution zone)
          const zoneY = 160;
          const zoneH = 340;
          const zoneW = 220;
          this.obstacles.push({
            id: 'breakpoint_' + this.spawnPatternIndex,
            type: 'breakpoint_field',
            x: x,
            y: zoneY,
            w: zoneW,
            h: zoneH,
            passed: false
          });
          // Dense challenge inside the breakpoint field: narrow gap monitor
          this.obstacles.push({
            id: 'crt_dense_' + this.spawnPatternIndex,
            type: 'crt_stack',
            x: x + 80,
            w: 64,
            gapY: zoneY + 80,
            gapSize: 135,
            oscillating: false,
            passed: false,
            nearMissChecked: false
          });
          // Espresso boost pickup
          this.pickups.push({
            type: 'coffee',
            x: x + 160,
            y: zoneY + 145,
            radius: 14,
            collected: false
          });
          this.nextSpawnX += 300;
        } else if (pattern === 4) {
          // Memory Leak Steam Vent (intermittent hazard)
          const ventY = 420;
          this.obstacles.push({
            id: 'vent_' + this.spawnPatternIndex,
            type: 'steam_vent',
            x: x,
            y: ventY,
            w: 50,
            h: 180,
            cycleTimer: 0,
            cyclePeriod: 2.4, // 1.4s off, 1.0s on
            activeTime: 1.0,
            passed: false
          });
          // Complementary top server rack
          this.obstacles.push({
            id: 'rack_top_' + this.spawnPatternIndex,
            type: 'server_top',
            x: x - 10,
            y: 0,
            w: 70,
            h: 220,
            passed: false,
            nearMissChecked: false
          });
          this.nextSpawnX += 240;
        } else if (pattern === 5) {
          // Bit-Flip NOT Gate #2 (Restores gravity or flips again)
          const gateY = 200 + Math.random() * 100;
          this.obstacles.push({
            id: 'gate_rev_' + this.spawnPatternIndex,
            type: 'bit_flip_gate',
            x: x,
            y: gateY,
            w: 56,
            h: 180,
            passed: false,
            triggered: false
          });
          this.nextSpawnX += 230;
        }

        this.spawnPatternIndex++;
      }

      // Cleanup off-screen entities
      const cleanupX = currentScroll - 150;
      this.obstacles = this.obstacles.filter(obs => obs.x + (obs.w || 70) > cleanupX);
      this.pickups = this.pickups.filter(p => p.x + 30 > cleanupX);
    }

    update(dt) {
      const now = performance.now();

      // FPS tracking
      this.frameCount++;
      if (now - this.fpsTimer >= 500) {
        this.fps = Math.round((this.frameCount * 1000) / (now - this.fpsTimer));
        this.frameCount = 0;
        this.fpsTimer = now;
      }

      if (this.flashAlpha > 0) {
        this.flashAlpha = Math.max(0, this.flashAlpha - dt * 2.5);
      }
      if (this.screenShake > 0) {
        this.screenShake = Math.max(0, this.screenShake - dt * 20);
      }

      if (this.state !== 'PLAYING') {
        // Idle animation glide
        if (this.state === 'READY') {
          this.physics.y = 300 + Math.sin(now * 0.005) * 8;
        }
        return;
      }

      // Boost timer
      if (this.boostTimer > 0) {
        this.boostTimer -= dt;
        this.physics.config.scrollSpeed = 200;
      } else {
        this.physics.config.scrollSpeed = 150;
      }

      // Invulnerability timer
      if (this.invulnerableTimer > 0) {
        this.invulnerableTimer -= dt;
      }

      // Update physics world
      this.physics.update(dt, now);

      if (this.physics.isDead) {
        this.triggerDeath(this.physics.deathReason);
        return;
      }

      const playerX = this.physics.config.playerX;
      const playerWorldX = this.physics.scrollOffset + playerX;
      const playerY = this.physics.y;

      // Parallax backgrounds
      this.bgGridOffset = (this.physics.scrollOffset * 0.25) % 40;
      this.bgRackOffset = (this.physics.scrollOffset * 0.6) % 80;

      // Spawn procedural level elements
      this.generateLevel(this.physics.scrollOffset);

      // Default time dilation reset unless inside breakpoint field
      let insideBreakpoint = false;

      // Update obstacles & check collisions
      for (const obs of this.obstacles) {
        const screenX = obs.x - this.physics.scrollOffset;

        if (obs.type === 'crt_stack') {
          // Handle sinusoidal oscillation if enabled
          let currentGapY = obs.gapY;
          if (obs.oscillating) {
            currentGapY += Math.sin((now * 0.001 * obs.frequency) + obs.phase) * obs.amplitude;
          }

          // Build bounding boxes
          const topBox = {
            x: screenX,
            y: 0,
            w: obs.w,
            h: currentGapY
          };
          const bottomBox = {
            x: screenX,
            y: currentGapY + obs.gapSize,
            w: obs.w,
            h: this.height - (currentGapY + obs.gapSize)
          };

          obs.topBox = topBox;
          obs.bottomBox = bottomBox;

          // Test 3-tier collision
          const col = this.collision.testObstacleCollision(
            {
              x: playerX,
              y: playerY,
              vy: this.physics.vy,
              hasShield: this.hasShield,
              invulnerableTime: this.invulnerableTimer
            },
            obs
          );

          if (col.shieldAbsorbed) {
            this.hasShield = false;
            this.invulnerableTimer = 1.5;
            this.screenShake = 6;
            this.addFloatingText('SHIELD POP!', playerX, playerY - 20, '#38bdf8');
            if (Audio) Audio.playDuck();
            this.spawnDebris(playerX, playerY, 12);
          } else if (col.lethalHit) {
            this.triggerDeath('HARDWARE_COLLISION');
            return;
          }

          // Near-miss detection
          if (col.nearMiss && !obs.nearMissChecked) {
            obs.nearMissChecked = true;
            this.nearMissStreak++;
            const bonus = 10 * this.streak;
            this.score += bonus;
            this.streak = Math.min(4, this.streak + 1);
            this.addFloatingText(`NEAR MISS! +${bonus}`, playerX, playerY - 24, '#facc15');
            if (Audio) Audio.playNearMiss();
            // Near-miss spark particles
            this.spawnDebris(playerX, playerY, 6);
          }

          // Scoring on clearance
          if (!obs.passed && screenX + obs.w < playerX) {
            obs.passed = true;
            this.score += 1 * this.streak;
            this.addFloatingText('PR MERGED +1', screenX + obs.w, currentGapY + obs.gapSize / 2, '#4ade80');
            if (Audio) Audio.playScore();
          }

        } else if (obs.type === 'bit_flip_gate') {
          // Bit-Flip NOT Gate
          const gateScreenX = obs.x - this.physics.scrollOffset;
          const gateBox = {
            x: gateScreenX,
            y: obs.y,
            w: obs.w,
            h: obs.h
          };

          // Check if player enters gate trigger center
          if (!obs.triggered && playerX >= gateScreenX && playerX <= gateScreenX + obs.w) {
            obs.triggered = true;
            const newDir = this.physics.toggleGravity();
            this.flashAlpha = 0.45;
            this.flashColor = newDir === 1 ? '#38bdf8' : '#ec4899';
            this.screenShake = 8;
            this.addFloatingText(newDir === 1 ? 'GRAVITY RESET (g↓)' : 'BIT FLIP! GRAVITY INVERT (g↑)', playerX, playerY - 30, '#ec4899');
            if (Audio) Audio.playBitFlip();
            // Quantum polarity explosion particles
            this.spawnDebris(playerX, playerY, 20);
          }

          if (!obs.passed && gateScreenX + obs.w < playerX) {
            obs.passed = true;
            this.score += 2;
          }

        } else if (obs.type === 'breakpoint_field') {
          // Breakpoint slow-mo field
          const screenX = obs.x - this.physics.scrollOffset;
          if (playerX >= screenX && playerX <= screenX + obs.w) {
            insideBreakpoint = true;
            if (!obs.entered) {
              obs.entered = true;
              this.addFloatingText('debugger; TIME SLOW (0.4x)', playerX, 80, '#ef4444');
              if (Audio) Audio.playBreakpoint();
            }
          }
        } else if (obs.type === 'steam_vent') {
          // Memory leak steam vent
          obs.cycleTimer = (obs.cycleTimer + dt) % obs.cyclePeriod;
          const isVenting = obs.cycleTimer > (obs.cyclePeriod - obs.activeTime);
          const ventScreenX = obs.x - this.physics.scrollOffset;

          // If venting, spawn steam cloud particles
          if (isVenting) {
            if (Math.random() < 0.4) {
              this.particles.push({
                x: ventScreenX + 25 + (Math.random() - 0.5) * 20,
                y: obs.y - Math.random() * 80,
                vx: -30 + Math.random() * 20,
                vy: -120 - Math.random() * 80,
                size: 6 + Math.random() * 8,
                color: 'rgba(234, 179, 8, 0.4)',
                life: 0.5,
                maxLife: 0.5
              });
            }

            // Hazard collision with active steam jet
            const steamBox = {
              x: ventScreenX + 5,
              y: obs.y - 140,
              w: 40,
              h: 150
            };

            const inSteam = this.collision.circleIntersectsAABB(playerX, playerY, 14, steamBox);
            if (inSteam.collides) {
              if (this.hasShield) {
                this.hasShield = false;
                this.invulnerableTimer = 1.5;
                this.screenShake = 6;
                this.addFloatingText('STEAM DRAINED SHIELD!', playerX, playerY - 20, '#f59e0b');
                if (Audio) Audio.playDuck();
              } else if (this.invulnerableTimer <= 0) {
                // Apply turbulent vertical thrust
                this.physics.vy = -380;
                this.screenShake = 5;
                this.addFloatingText('MEMORY LEAK BLOWOUT!', playerX, playerY - 20, '#ef4444');
                if (Audio) Audio.playVent();
              }
            }
          }
        } else if (obs.type === 'server_top') {
          const topBox = {
            x: screenX,
            y: obs.y,
            w: obs.w,
            h: obs.h
          };
          obs.topBox = topBox;
          obs.bottomBox = null;
          const col = this.collision.testObstacleCollision(
            { x: playerX, y: playerY, vy: this.physics.vy, hasShield: this.hasShield, invulnerableTime: this.invulnerableTimer },
            obs
          );
          if (col.shieldAbsorbed) {
            this.hasShield = false;
            this.invulnerableTimer = 1.5;
            if (Audio) Audio.playDuck();
          } else if (col.lethalHit) {
            this.triggerDeath('RACK_COLLISION');
            return;
          }
        }
      }

      // Apply time dilation based on breakpoint field
      this.physics.setTimeDilation(insideBreakpoint ? 0.4 : 1.0);

      // Check collectible pickups
      for (const p of this.pickups) {
        if (p.collected) continue;
        const screenX = p.x - this.physics.scrollOffset;
        const dist = Math.hypot(playerX - screenX, playerY - p.y);

        if (dist <= 14 + p.radius) {
          p.collected = true;
          if (p.type === 'duck') {
            this.hasShield = true;
            this.addFloatingText('RUBBER DUCK DEBUGGER (+1 SHIELD)', playerX, playerY - 25, '#facc15');
            if (Audio) Audio.playDuck();
          } else if (p.type === 'coffee') {
            this.boostTimer = 3.5;
            this.score += 25;
            this.addFloatingText('ESPRESSO OVERCLOCK! (+SPEED)', playerX, playerY - 25, '#fb923c');
            if (Audio) Audio.playCoffee();
          } else if (p.type === 'commit') {
            this.commits++;
            this.score += 15;
            this.addFloatingText('GIT COMMIT (+15)', playerX, playerY - 25, '#4ade80');
            if (Audio) Audio.playScore();
          }
          this.spawnDebris(playerX, playerY, 8);
        }
      }

      // Update particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const pt = this.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        if (pt.life <= 0) {
          this.particles.splice(i, 1);
        }
      }

      // Update floating texts
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y -= 35 * dt;
        ft.life -= dt;
        if (ft.life <= 0) {
          this.floatingTexts.splice(i, 1);
        }
      }
    }

    triggerDeath(reason) {
      this.state = 'GAME_OVER';
      this.physics.isDead = true;
      this.physics.deathReason = reason;
      this.screenShake = 14;
      this.flashAlpha = 0.7;
      this.flashColor = '#ef4444';
      if (this.score > this.highScore) {
        this.highScore = this.score;
      }
      if (Audio) Audio.playCrash();
      this.spawnDebris(this.physics.config.playerX, this.physics.y, 35);
    }

    render() {
      const ctx = this.ctx;
      ctx.save();

      // Screen shake translation
      if (this.screenShake > 0) {
        const dx = (Math.random() - 0.5) * this.screenShake;
        const dy = (Math.random() - 0.5) * this.screenShake;
        ctx.translate(dx, dy);
      }

      // Background Gradient (Dynamically tints based on gravity direction)
      const isInv = this.physics.gravityDirection === -1;
      const grad = ctx.createLinearGradient(0, 0, 0, this.height);
      if (isInv) {
        // Inverted Gravity: Quantum Magenta / Void
        grad.addColorStop(0, '#1e102a');
        grad.addColorStop(0.5, '#120b1e');
        grad.addColorStop(1, '#2c0c32');
      } else {
        // Standard Gravity: Deep Subterranean Data Center Blue
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(0.5, '#0d1527');
        grad.addColorStop(1, '#080c14');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Parallax Grid Layer
      ctx.strokeStyle = isInv ? 'rgba(236, 72, 153, 0.08)' : 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = -this.bgGridOffset; x < this.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
        ctx.stroke();
      }
      for (let y = 0; y < this.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
        ctx.stroke();
      }

      // Render Breakpoint Fields (Background matrix zones)
      for (const obs of this.obstacles) {
        if (obs.type === 'breakpoint_field') {
          const screenX = obs.x - this.physics.scrollOffset;
          ctx.fillStyle = 'rgba(220, 38, 38, 0.12)';
          ctx.fillRect(screenX, obs.y, obs.w, obs.h);
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX, obs.y, obs.w, obs.h);

          // Breakpoint badge & scanlines
          ctx.fillStyle = '#fca5a5';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('debugger; SLOW-MO ZONE (0.4x)', screenX + 10, obs.y + 20);

          const bpImg = Sprites ? Sprites.getImage('field_breakpoint') : null;
          if (bpImg) {
            ctx.drawImage(bpImg, screenX + obs.w / 2 - 25, obs.y + 30, 50, 50);
          }
        }
      }

      // Render Obstacles
      for (const obs of this.obstacles) {
        const screenX = obs.x - this.physics.scrollOffset;

        if (obs.type === 'crt_stack') {
          const currentGapY = obs.oscillating
            ? obs.gapY + Math.sin((performance.now() * 0.001 * obs.frequency) + obs.phase) * obs.amplitude
            : obs.gapY;

          // Draw Top Stack (Kernel Panic)
          this.renderCRTMonitor(ctx, screenX, 0, obs.w, currentGapY, true);

          // Draw Bottom Stack (BSOD)
          this.renderCRTMonitor(ctx, screenX, currentGapY + obs.gapSize, obs.w, this.height - (currentGapY + obs.gapSize), false);

        } else if (obs.type === 'bit_flip_gate') {
          // Draw Bit-Flip Logic Gate
          const gateImg = Sprites ? Sprites.getImage('gate_bit_flip') : null;
          if (gateImg) {
            ctx.drawImage(gateImg, screenX, obs.y, obs.w, obs.h);
          } else {
            ctx.fillStyle = '#4338ca';
            ctx.fillRect(screenX, obs.y, obs.w, obs.h);
          }

          // Glowing pulse ring
          ctx.strokeStyle = obs.triggered ? '#22c55e' : '#a855f7';
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX, obs.y, obs.w, obs.h);

        } else if (obs.type === 'steam_vent') {
          const ventImg = Sprites ? Sprites.getImage('vent_memory_leak') : null;
          if (ventImg) {
            ctx.drawImage(ventImg, screenX, obs.y, obs.w, 60);
          }
          // Vent pipe base down to floor
          ctx.fillStyle = '#334155';
          ctx.fillRect(screenX + 10, obs.y + 60, obs.w - 20, this.height - (obs.y + 60));

        } else if (obs.type === 'server_top') {
          ctx.fillStyle = '#18181b';
          ctx.fillRect(screenX, obs.y, obs.w, obs.h);
          ctx.strokeStyle = '#3f3f46';
          ctx.strokeRect(screenX, obs.y, obs.w, obs.h);
          // Server LEDs
          for (let ly = obs.y + 10; ly < obs.y + obs.h - 10; ly += 24) {
            ctx.fillStyle = Math.random() < 0.2 ? '#ef4444' : '#22c55e';
            ctx.fillRect(screenX + 8, ly, 6, 6);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(screenX + 18, ly, 40, 4);
          }
        }
      }

      // Render Collectible Pickups
      for (const p of this.pickups) {
        if (p.collected) continue;
        const screenX = p.x - this.physics.scrollOffset;
        const floatY = p.y + Math.sin(performance.now() * 0.006 + p.x) * 4;

        let imgKey = 'pickup_commit';
        if (p.type === 'duck') imgKey = 'pickup_duck';
        if (p.type === 'coffee') imgKey = 'pickup_coffee';

        const pImg = Sprites ? Sprites.getImage(imgKey) : null;
        if (pImg) {
          ctx.drawImage(pImg, screenX - p.radius, floatY - p.radius, p.radius * 2, p.radius * 2);
        } else {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(screenX, floatY, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render Particles
      for (const pt of this.particles) {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Render Floor & Ceiling Boundaries
      this.renderBoundaries(ctx, isInv);

      // Render Player Character
      this.renderPlayer(ctx);

      // Render Floating Texts
      for (const ft of this.floatingTexts) {
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 12px monospace';
        ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1.0;
      }

      // Screen Flash Overlay
      if (this.flashAlpha > 0) {
        ctx.fillStyle = this.flashColor;
        ctx.globalAlpha = this.flashAlpha;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.globalAlpha = 1.0;
      }

      // HUD Overlay
      this.renderHUD(ctx, isInv);

      // Debug Hitbox Overlay
      if (this.showDebug) {
        this.renderDebug(ctx);
      }

      ctx.restore();
    }

    renderCRTMonitor(ctx, x, y, w, h, isTop) {
      // 8px Chamfer bevels
      const chamfer = 8;
      ctx.fillStyle = '#94a3b8'; // CRT beige/grey casing
      ctx.beginPath();
      if (isTop) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + h - chamfer);
        ctx.lineTo(x + w - chamfer, y + h);
        ctx.lineTo(x + chamfer, y + h);
        ctx.lineTo(x, y + h - chamfer);
      } else {
        ctx.moveTo(x + chamfer, y);
        ctx.lineTo(x + w - chamfer, y);
        ctx.lineTo(x + w, y + chamfer);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y + chamfer);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Screen interior
      const screenH = Math.max(20, h - 24);
      const screenY = isTop ? y + 8 : y + 16;
      ctx.fillStyle = isTop ? '#0f172a' : '#1d4ed8'; // Black for Linux Kernel, Blue for Windows BSOD
      ctx.fillRect(x + 6, screenY, w - 12, screenH);

      // Screen details
      ctx.fillStyle = isTop ? '#ef4444' : '#ffffff';
      ctx.font = 'bold 8px monospace';
      if (isTop) {
        ctx.fillText('KERNEL PANIC', x + 10, screenY + 16);
      } else {
        ctx.fillText(':( BSOD 0x7E', x + 10, screenY + 16);
      }
    }

    renderBoundaries(ctx, isInv) {
      const floorH = this.physics.config.floorHeight;
      const ceilH = this.physics.config.ceilingHeight;

      // Floor
      ctx.fillStyle = isInv ? '#3f1c1c' : '#1e293b';
      ctx.fillRect(0, this.height - floorH, this.width, floorH);
      ctx.strokeStyle = isInv ? '#ef4444' : '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, this.height - floorH);
      ctx.lineTo(this.width, this.height - floorH);
      ctx.stroke();

      // Ceiling
      ctx.fillStyle = isInv ? '#1e293b' : '#3f1c1c';
      ctx.fillRect(0, 0, this.width, ceilH);
      ctx.strokeStyle = isInv ? '#0284c7' : '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, ceilH);
      ctx.lineTo(this.width, ceilH);
      ctx.stroke();

      // Floor & ceiling hazard labels
      ctx.font = '9px monospace';
      ctx.fillStyle = isInv ? '#4ade80' : '#f87171';
      ctx.fillText(isInv ? 'SAFE CLAMP BOUNCE' : 'FATAL FLOOR (PROD DOWN)', 10, this.height - 18);
      ctx.fillStyle = isInv ? '#f87171' : '#4ade80';
      ctx.fillText(isInv ? 'FATAL CEILING' : 'CLOUD CEILING (CLAMP)', 10, 14);
    }

    renderPlayer(ctx) {
      const px = this.physics.config.playerX;
      const py = this.physics.y;
      const rot = this.physics.rotation * Math.PI / 180;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);

      // Invulnerability flicker
      if (this.invulnerableTimer > 0 && Math.floor(performance.now() / 80) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Sprite selection
      let spriteKey = 'dev_idle';
      if (this.state === 'GAME_OVER') {
        spriteKey = 'dev_crash';
      } else if (this.physics.vy < -60) {
        spriteKey = 'dev_flap';
      } else if (this.physics.vy > 120) {
        spriteKey = 'dev_dive';
      }

      const img = Sprites ? Sprites.getImage(spriteKey) : null;
      if (img) {
        ctx.drawImage(img, -22, -22, 44, 44);
      } else {
        // Fallback vector drawing
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(-15, -15, 30, 30);
      }

      // Rubber duck bubble shield aura
      if (this.hasShield) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Espresso boost flame trail
      if (this.boostTimer > 0) {
        ctx.fillStyle = '#fb923c';
        ctx.fillRect(-28, -4, 8, 8);
      }

      ctx.restore();
    }

    renderHUD(ctx, isInv) {
      // Score Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText(`${this.score}`, 20, 46);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`COMMITS: ${this.commits} | STREAK: ${this.streak}x`, 20, 64);

      // Gravity Status Badge
      const badgeX = this.width - 150;
      ctx.fillStyle = isInv ? 'rgba(236, 72, 153, 0.25)' : 'rgba(56, 189, 248, 0.25)';
      ctx.strokeStyle = isInv ? '#ec4899' : '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(badgeX, 30, 130, 24, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isInv ? '#f472b6' : '#7dd3fc';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(isInv ? 'GRAVITY: INV (g↑)' : 'GRAVITY: NORM (g↓)', badgeX + 8, 46);

      // Shield status indicator
      if (this.hasShield) {
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('DUCK SHIELD ACTIVE', badgeX, 72);
      }

      // Game Ready / Game Over overlays
      if (this.state === 'READY') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PUZZLE HAZARD', this.width / 2, this.height / 2 - 40);

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('Tap / Click / Space to Flap', this.width / 2, this.height / 2);

        ctx.font = '12px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Watch out for Bit-Flip Gates & Breakpoints!', this.width / 2, this.height / 2 + 30);
        ctx.fillText('[D] Debug Telemetry | [M] Mute', this.width / 2, this.height / 2 + 55);

        ctx.textAlign = 'left';
      } else if (this.state === 'GAME_OVER') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 26px system-ui, sans-serif';
        ctx.fillText('PRODUCTION DOWN', this.width / 2, this.height / 2 - 50);

        ctx.fillStyle = '#ffffff';
        ctx.font = '15px system-ui, sans-serif';
        ctx.fillText(`Final Score: ${this.score}`, this.width / 2, this.height / 2 - 15);
        ctx.fillText(`High Score: ${this.highScore}`, this.width / 2, this.height / 2 + 10);
        ctx.fillText(`Commits Collected: ${this.commits}`, this.width / 2, this.height / 2 + 35);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText('Tap or Press Space to Restart', this.width / 2, this.height / 2 + 80);

        ctx.textAlign = 'left';
      }
    }

    renderDebug(ctx) {
      const px = this.physics.config.playerX;
      const py = this.physics.y;
      const r = this.physics.config.playerRadius;

      // Draw Inner Lethal Hitbox (Cyan)
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Near-Miss Radar Envelope (Yellow dashed)
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(px, py, r + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Telemetry Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(10, 80, 200, 130);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 80, 200, 130);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText(`DEBUG TELEMETRY (${this.fps} FPS)`, 18, 96);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText(`Y: ${py.toFixed(1)} px`, 18, 112);
      ctx.fillText(`Vy: ${this.physics.vy.toFixed(1)} px/s`, 18, 126);
      ctx.fillText(`g: ${this.physics.config.standardGravity * this.physics.gravityDirection} px/s²`, 18, 140);
      ctx.fillText(`Time Dilation: ${this.physics.timeDilation.toFixed(2)}x`, 18, 154);
      ctx.fillText(`Scroll: ${this.physics.scrollOffset.toFixed(0)} px`, 18, 168);
      ctx.fillText(`Obstacles in memory: ${this.obstacles.length}`, 18, 182);
      ctx.fillText(`Shield: ${this.hasShield ? 'ACTIVE' : 'NONE'}`, 18, 196);
    }

    start() {
      let lastTime = performance.now();
      const loop = (currentTime) => {
        const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
        lastTime = currentTime;

        this.update(dt);
        this.render();

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  return {
    PuzzleGame
  };
}));
