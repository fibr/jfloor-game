# JFloorGame: Puzzle-Hazard Variant Prototype

The puzzle-hazard prototype for **JFloorGame**, a developer-themed arcade runner set in a subterranean graveyard of abandoned computer hardware.

This variant pairs Flappy Bird style tap-to-flap flight with dynamic puzzle hazards: gravity inversions, time-dilation breakpoint fields, oscillating dead computer stacks, and intermittent steam vents.

---

## 1. Core Mechanics

### Bit-Flip Gravity Gates (NOT Gates)
Passing through a glowing neon logic gate flips screen gravity:
- **Standard Mode ($g = +1,100\text{ px/s}^2$):** Flaps propel the developer upward. The floor is fatal; the ceiling provides a safe clamp and bounce.
- **Inverted Mode ($g = -1,100\text{ px/s}^2$):** Gravity pulls upward. Flaps propel downward. The ceiling is fatal; the floor provides a safe clamp and bounce. The player flies upside down with inverted pitch kinematics.

### Breakpoint Slow-Mo Fields (`debugger;`)
Hexagonal time-dilation zones dilate execution speed to $0.4\times$ ($40\%$). The player gains $2.5\times$ more reaction time to thread dense, oscillating obstacles.

### Oscillating Dead Computers
Stacked CRT monitors displaying Blue Screens of Death (BSOD) and Linux Kernel Panics oscillate vertically on sinusoidal paths ($A = \pm 45\text{ px}$, $T = 2.2\text{ s}$).

### Memory Leak Steam Vents
Server exhaust pipes vent pressurized digital steam on a periodic $2.4\text{ s}$ cycle ($1.4\text{ s}$ safe / $1.0\text{ s}$ active). Flying through active steam blasts turbulent aerodynamic drag.

### Three-Tier Hitbox Architecture
- **Inner Active Hitbox:** Visual sprite ($44 \times 44\text{ px}$) reduced to $65\%$ area (radius $14\text{ px}$ capsule, inset $7\text{ px}$). Eliminates phantom deaths.
- **Corner Chamfering:** Obstacle corners feature $8\text{ px}$ bevels. Grazing a corner deflects trajectory rather than arresting momentum.
- **Near-Miss Radar:** A $12\text{ px}$ perimeter detects close calls. Clearing an obstacle within this margin awards $+10$ points and increases the streak multiplier (up to $4\times$).

---

## 2. Developer Pickups

| Pickup | Effect | Visual |
| :--- | :--- | :--- |
| **Rubber Duck Debugger** | Absorbs exactly 1 fatal collision; pops with bubble shield particle burst and grants $1.5\text{ s}$ invulnerability. | Yellow rubber duck in blue shield bubble |
| **Hot Espresso** | $+50$ points and $3.5\text{ s}$ turbo overclock sprint boost ($200\text{ px/s}$). | Steaming coffee mug with flame trail |
| **Git Commit Token** | $+15$ points and currency counter increment. | Golden Octocat commit coin |

---

## 3. Calibrated Kinematic Specifications

| Parameter | Calibrated Value | Purpose |
| :--- | :--- | :--- |
| **Standard Gravity ($g$)** | $+1,100\text{ px/s}^2$ | Floater arc for deliberate puzzle analysis |
| **Inverted Gravity ($g_{\text{inv}}$)** | $-1,100\text{ px/s}^2$ | Full downward acceleration when flipped |
| **Jump Impulse ($v_0$)** | $-340\text{ px/s}$ (norm) / $+340\text{ px/s}$ (inv) | Crisp upward / downward propulsion |
| **Terminal Velocity ($v_{\text{term}}$)** | $520\text{ px/s}$ | Prevents tunneling through obstacles |
| **Horizontal Scroll ($v_x$)** | $150\text{ px/s}$ | Predictable timing cadence |
| **Input Buffer Window** | $120\text{ ms}$ | Buffers inputs before landing |
| **Coyote Time Window** | $80\text{ ms}$ | Prevents dropped inputs at obstacle lips |
| **Pitch Rotation** | $-15^\circ$ flap, $+45^\circ$ dive | Responsive visual flight feedback |

---

## 4. Architecture

```text
├── index.html               # Playable arcade cabinet interface
├── README.md                # Technical documentation
└── src/
    ├── engine/
    │   ├── audio.js         # ZzFX procedural 8-bit WebAudio synthesizer
    │   ├── sprites.js       # Crisp pixel-art SVG vector sprite catalog
    │   ├── physics.js       # Fixed-timestep kinematics & gravity inversion
    │   └── collision.js     # 3-tier hitboxes, chamfers & near-miss radar
    └── game/
        └── puzzle-game.js   # Level generation, puzzle hazards, particles, HUD
```

---

## 5. Controls

- **Flap:** `Space`, `Up Arrow`, Left Mouse Click, or Screen Tap
- **Restart:** `R` key or Restart Button
- **Debug Telemetry:** `D` key or Telemetry Button (overlays FPS, velocity, hitboxes)
- **Gravity Flip:** `G` key (manual debug test)
- **Audio Toggle:** `M` key or Mute Button
