# JFloorGame - Classic Arcade Flappy Variant (`proto-classic`)

A baseline tap-to-flap arcade obstacle run testing core feel, physics responsiveness, and fair collision envelopes for JFloorGame.

## Gameplay & Concept
Developers navigate through a subterranean graveyard of dead hardware, blue-screening CRT monitors, and hanging server racks. Flap through gaps between hardware obstacles, collect developer power-ups, and graze obstacles closely to build Near-Miss combo multipliers.

## Controls
- **Flap / Jump**: `Spacebar`, `Left Click`, or `Touch Tap`
- **Pause / Resume**: `P`
- **Restart Run**: `R` or on-screen button

## Calibrated Kinematics & Mechanics
- **Fixed Timestep Engine**: 60 FPS numerical Euler integration (`dt = 1/60s`)
- **Gravity ($g$)**: `1,400 px/s²`
- **Flap Impulse ($v_0$)**: `-420 px/s` (instantaneous upward velocity reset)
- **Terminal Velocity Cap**: `650 px/s`
- **Obstacle Gap**: `150 px` (tunable `110–220 px`)
- **Horizontal Scroll Speed**: `180 px/s` base, scaling smoothly up to `260 px/s` with score
- **Forgiving Hitbox**: Inner active capsule is $65\%$ of visual sprite area ($28 \times 28\text{ px}$ within $44 \times 44\text{ px}$ frame)
- **Near-Miss Radar**: $52 \times 52\text{ px}$ perimeter granting $+10\text{ pts}$ bonus streaks upon threading close to dead hardware
- **Obstacle Chamfering**: $8\text{ px}$ beveled obstacle corners prevent edge snags
- **Boundaries**: Non-lethal ceiling clamp with electrical bounce (`vy = +60 px/s`); fatal floor collision ("Production Down")

## Power-ups & Pickups
- ☕ **Espresso**: Sprint boost granting temporary speed burst and score multiplier
- 🦆 **Rubber Duck Debugger**: 1-hit safety shield absorbing an obstacle collision
- 🪙 **Git Commit Token**: Grants $+5\text{ pts}$ PR merge bonus

## Live Tuning Panel
The prototype includes an in-game tuning panel to adjust gravity, jump impulse, gap clearance, and scroll velocity in real time, with an overlay toggle to visualize hitbox envelopes and radar zones.

## Files
- `index.html`: Playable arcade prototype entry point
- `assets.js`: ZzFX procedural 8-bit retro audio engine and SVG pixel sprites
- `README.md`: Prototype documentation and kinematics reference
