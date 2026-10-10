/**
 * JFloorGame Procedural Retro WebAudio Engine
 * Uses ZzFX Micro Audio Engine (v1.3.2, Frank Force, MIT License)
 * Calibrated 8-bit sound effects for JFloorGame prototypes
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JFloorAudio = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  let zzfxV = 0.35; // Master volume
  let zzfxX = null; // Lazy WebAudio AudioContext
  let muted = false;

  function getAudioContext() {
    if (!zzfxX) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        zzfxX = new AudioCtx();
      }
    }
    if (zzfxX && zzfxX.state === 'suspended') {
      zzfxX.resume();
    }
    return zzfxX;
  }

  function zzfx(...t) {
    if (muted) return null;
    const ctx = getAudioContext();
    if (!ctx) return null;
    return zzfxP(ctx, zzfxG(ctx, ...t));
  }

  function zzfxP(ctx, ...t) {
    if (!ctx || !t[0]) return null;
    const e = ctx.createBufferSource();
    const f = ctx.createBuffer(t.length, t[0].length, 44100);
    t.forEach((d, i) => f.getChannelData(i).set(d));
    e.buffer = f;
    e.connect(ctx.destination);
    e.start();
    return e;
  }

  function zzfxG(ctx, q=1, k=.05, c=220, e=0, t=0, u=.1, r=0, F=1, v=0, z=0, w=0, A=0, l=0, B=0, x=0, G=0, d=0, y=1, m=0, C=0) {
    const R = 44100;
    const b = 2 * Math.PI;
    let H = v *= 500 * b / R ** 2;
    let I = (0 < x ? 1 : -1) * b / 4;
    let D = c *= (1 + 2 * k * Math.random() - k) * b / R;
    const Z = [];
    let g = 0, E = 0, a = 0, n = 1, J = 0, K = 0, f = 0, p, h;
    e = 99 + R * e;
    m *= R;
    t *= R;
    u *= R;
    d *= R;
    z *= 500 * b / R ** 3;
    x *= b / R;
    w *= b / R;
    A *= R;
    l = R * l | 0;
    for (h = e + m + t + u + d | 0; a < h; Z[a++] = f) {
      ++K % (100 * G | 0) || (
        f = r ? 1 < r ? 2 < r ? 3 < r ? Math.sin((g % b) ** 3) : Math.max(Math.min(Math.tan(g), 1), -1) : 1 - (2 * g / b % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(g / b) - g / b) : Math.sin(g),
        f = (l ? 1 - C + C * Math.sin(b * a / l) : 1) * (0 < f ? 1 : -1) * Math.abs(f) ** F * q * zzfxV * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - y) : a < e + m + t ? y : a < h - d ? (h - a - d) / u * y : 0),
        f = d ? f / 2 + (d > a ? 0 : (a < h - d ? 1 : (h - a) / d) * Z[a - d | 0] / 2) : f
      );
      p = (c += v += z) * Math.sin(E * x - I);
      g += p - p * B * (1 - 1e9 * (Math.sin(a) + 1) % 2);
      E += p - p * B * (1 - 1e9 * (Math.sin(a) ** 2 + 1) % 2);
      n && ++n > A && (c += w, D += w, n = 0);
      !l || ++J % l || (c = D, v = H, n = n || 1);
    }
    return Z;
  }

  const SOUND_PARAMS = {
    jump: [1.2, 0.05, 330, 0.01, 0.06, 0.09, 0, 1.4, -4.5, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, 0.02, 0],
    score_merge: [1.0, 0.01, 650, 0.01, 0.12, 0.18, 0, 0.8, 5.2, 0, 120, 0.05, 0.03, 0, 0, 0, 0, 0.8, 0.01, 0],
    near_miss: [1.1, 0.08, 850, 0.01, 0.04, 0.08, 3, 2.1, 0, 0, 0, 0, 0, 1.5, 0, 0.4, 0, 0.6, 0.03, 0],
    coffee_boost: [1.3, 0.05, 420, 0.03, 0.22, 0.28, 1, 1.1, 7.8, 0, 150, 0.08, 0.04, 0, 0, 0, 0, 0.75, 0.08, 0],
    duck_shield: [1.2, 0.05, 520, 0.02, 0.14, 0.22, 0, 1.6, -2.1, 0, 0, 0, 0, 0.8, 0, 0.2, 0, 0.65, 0.04, 0],
    bit_flip: [1.1, 0.02, 280, 0.02, 0.15, 0.2, 2, 1.8, -8.2, 0, 220, 0.06, 0.05, 0, 0, 0, 0, 0.7, 0.02, 0],
    breakpoint_warp: [1.4, 0.04, 180, 0.05, 0.35, 0.45, 1, 1.2, -3.5, 0, -80, 0.12, 0.08, 0.5, 0, 0.2, 0, 0.5, 0.15, 0],
    crash_bsod: [1.5, 0.1, 140, 0.05, 0.28, 0.45, 4, 2.5, -0.8, 0, 0, 0, 0, 2.8, 0, 0.6, 0.08, 0.4, 0.12, 0.05],
    vent_steam: [1.0, 0.12, 210, 0.04, 0.25, 0.3, 3, 1.5, -1.2, 0, 0, 0, 0, 1.2, 0, 0.3, 0.05, 0.5, 0.08, 0]
  };

  return {
    init: () => getAudioContext(),
    setVolume: (val) => { zzfxV = Math.max(0, Math.min(1, val)); },
    getVolume: () => zzfxV,
    toggleMute: () => { muted = !muted; return muted; },
    isMuted: () => muted,
    play: (name) => {
      if (SOUND_PARAMS[name]) {
        return zzfx(...SOUND_PARAMS[name]);
      }
      return null;
    },
    playJump: () => zzfx(...SOUND_PARAMS.jump),
    playScore: () => zzfx(...SOUND_PARAMS.score_merge),
    playNearMiss: () => zzfx(...SOUND_PARAMS.near_miss),
    playCoffee: () => zzfx(...SOUND_PARAMS.coffee_boost),
    playDuck: () => zzfx(...SOUND_PARAMS.duck_shield),
    playBitFlip: () => zzfx(...SOUND_PARAMS.bit_flip),
    playBreakpoint: () => zzfx(...SOUND_PARAMS.breakpoint_warp),
    playCrash: () => zzfx(...SOUND_PARAMS.crash_bsod),
    playVent: () => zzfx(...SOUND_PARAMS.vent_steam)
  };
}));
