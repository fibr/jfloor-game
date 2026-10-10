# JFloorGame: Squad Runner Prototype (`proto-squad`)

An experimental multi-agent cooperative team-runner variant for **JFloorGame**. Developers navigate through subterranean stacks of dead hardware (CRT monitors with BSODs, Kernel Panics, and server racks) using multi-developer flight dynamics and tactical superpowers.

---

## 🎮 Gameplay Modes

1. **🕊️ Tandem Flock Formation (Simultaneous Flight)**
   - Three developers (Frontend, Backend, DevOps) fly together in a spring-linked echelon formation.
   - The squad shares 3 individual lives. If an obstacle clips a teammate, they wipe out while surviving squad members keep flying.
   - Collecting **Git Commit** tokens revives fallen squadmates.

2. **🔄 Tag-Team Ability Swapper (Dynamic Lead Switching)**
   - Hot-swap the active lead developer on the fly with keys `1`, `2`, and `3`.
   - Each role features distinct kinematic weights and tactical cooldown powers:
     - **Frontend Dev (Pink / CSS Cape):** Floaty & agile ($g = 1,050\text{ px/s}^2$). Holding flap engages hover glide; active superpower is **Double Flap** air-dash vertical recovery.
     - **Backend Dev (Blue / DB Shield):** Heavy & dense ($g = 1,550\text{ px/s}^2$). Rapid vertical recovery; active superpower is **Database Shield Bash** (2.5s invulnerability barrier that shatters obstacle hazards).
     - **DevOps / SRE (Green / K8s Helm):** Balanced ($g = 1,300\text{ px/s}^2$). Features +40% near-miss radar detection; active superpower is **CI/CD Rollback** (rewinds 1.2s backward in time to undo fatal collisions).

---

## 🕹️ Controls

| Action | Keyboard | Mouse / Touch |
|---|---|---|
| **Flap Impulse** | `SPACE` | Left Click / Tap Canvas |
| **Hover Glide (Frontend)** | Hold `SPACE` | Hold Click / Tap |
| **Activate Superpower** | `SHIFT` or `F` | Ability button in sidebar |
| **Swap to Frontend** | `1` | Click Frontend card in Roster |
| **Swap to Backend** | `2` | Click Backend card in Roster |
| **Swap to DevOps** | `3` | Click DevOps card in Roster |
| **Restart Run** | `R` | Click canvas when down |

---

## ⚙️ Kinematic Presets & Hitbox Architecture

- **Sub-stepped Euler Integrator (60 FPS):**
  - Base gravity $g = 1,300\text{ px/s}^2$
  - Flap impulse $v_0 = -390\text{ px/s}$
  - Obstacle gap: $165\text{ px}$ (squad clearance calibrated)
  - Horizontal scroll velocity: $170\text{ px/s}$
- **3-Tier Hitbox Envelope:**
  - **Inner Active Hull (65% visual sprite area, 7px inset):** Forgiving collision bounding box preventing unfair clipping bugs.
  - **8px Chamfered Corner Deflection:** Obstacle corner bevels prevent snagging on edges.
  - **Outer Near-Miss Radar:** Awards $+10$ bonus points and streak multipliers on tight grazes.
  - **Ceiling Clamp & Spark:** Non-lethal bounce off top boundary.
  - **Floor Fatality:** "Production Down" game-over condition.

---

## 📦 Pickups & Power-Ups

- **Hot Espresso Coffee:** $+25$ points and brief burst speed.
- **Rubber Duck Debugger:** 1-hit invulnerability shield bubble.
- **Git Commit Token:** $+50$ points, resurrects fallen squad members (Flock mode) or resets ability cooldown (Tag-Team mode).

---

## 🚀 Running the Prototype

Open `index.html` in any modern web browser. The prototype runs locally without external dependencies or build tooling. Real-time kinematic sliders and hitbox inspection toggles are accessible in the right-hand control panel.
