/**
 * JFloorGame: Classic Arcade Asset Library (assets.js)
 * Visual SVG Sprites & ZzFX Procedural 8-Bit Retro Audio Engine
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JFloorAssets = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // --- 1. ZzFX Micro Audio Engine (v1.3.2 Frank Force, MIT License) ---
  let zzfxV = 0.35; // Master volume
  let audioMuted = false;
  let zzfxX = null; // Lazy AudioContext

  function getAudioContext() {
    if (!zzfxX) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) zzfxX = new AudioCtx();
    }
    if (zzfxX && zzfxX.state === 'suspended') {
      zzfxX.resume();
    }
    return zzfxX;
  }

  function zzfx(...t) {
    if (audioMuted) return null;
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
    const R = 44100, b = 2 * Math.PI;
    let H = v *= 500 * b / R ** 2;
    let I = (0 < x ? 1 : -1) * b / 4;
    let D = c *= (1 + 2 * k * Math.random() - k) * b / R;
    const Z = [];
    let g = 0, E = 0, a = 0, n = 1, J = 0, K = 0, f = 0, p, h;
    e = 99 + R * e; m *= R; t *= R; u *= R; d *= R; z *= 500 * b / R ** 3;
    x *= b / R; w *= b / R; A *= R; l = R * l | 0;
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

  // --- 2. Procedural Audio Trigger Parameters ---
  const SOUND_PARAMS = {
    jump: [1.2, 0.05, 330, 0.01, 0.06, 0.09, 0, 1.4, -4.5, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, 0.02, 0],
    score: [1.0, 0.01, 650, 0.01, 0.12, 0.18, 0, 0.8, 5.2, 0, 120, 0.05, 0.03, 0, 0, 0, 0, 0.8, 0.01, 0],
    nearMiss: [1.1, 0.08, 850, 0.01, 0.04, 0.08, 3, 2.1, 0, 0, 0, 0, 0, 1.5, 0, 0.4, 0, 0.6, 0.03, 0],
    coffee: [1.3, 0.05, 420, 0.03, 0.22, 0.28, 1, 1.1, 7.8, 0, 150, 0.08, 0.04, 0, 0, 0, 0, 0.75, 0.08, 0],
    duck: [1.2, 0.05, 520, 0.02, 0.14, 0.22, 0, 1.6, -2.1, 0, 0, 0, 0, 0.8, 0, 0.2, 0, 0.65, 0.04, 0],
    crash: [1.5, 0.1, 140, 0.05, 0.28, 0.45, 4, 2.5, -0.8, 0, 0, 0, 0, 2.8, 0, 0.6, 0.08, 0.4, 0.12, 0.05],
    spark: [0.8, 0.02, 900, 0.01, 0.03, 0.05, 3, 1.5, 0, 0, 0, 0, 0, 0.8, 0, 0.1, 0, 0.5, 0.01, 0]
  };

  const audio = {
    setVolume: (val) => { zzfxV = Math.max(0, Math.min(1, val)); },
    getVolume: () => zzfxV,
    setMuted: (muted) => { audioMuted = !!muted; },
    isMuted: () => audioMuted,
    playJump: () => zzfx(...SOUND_PARAMS.jump),
    playScore: () => zzfx(...SOUND_PARAMS.score),
    playNearMiss: () => zzfx(...SOUND_PARAMS.nearMiss),
    playCoffee: () => zzfx(...SOUND_PARAMS.coffee),
    playDuck: () => zzfx(...SOUND_PARAMS.duck),
    playCrash: () => zzfx(...SOUND_PARAMS.crash),
    playSpark: () => zzfx(...SOUND_PARAMS.spark)
  };

  // --- 3. Pixel-Art SVG Sprites ---
  const SPRITES = {
    dev_idle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges"><rect x="14" y="5" width="16" height="5" fill="#3b2f2f"/><rect x="12" y="8" width="4" height="6" fill="#3b2f2f"/><rect x="10" y="10" width="3" height="4" fill="#3b2f2f"/><rect x="15" y="10" width="15" height="10" fill="#fed7aa"/><rect x="22" y="13" width="2" height="3" fill="#0f172a"/><rect x="27" y="13" width="2" height="3" fill="#0f172a"/><rect x="20" y="12" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/><rect x="25" y="12" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/><rect x="24" y="13" width="2" height="1" fill="#0ea5e9"/><rect x="12" y="20" width="20" height="14" fill="#6366f1"/><rect x="16" y="20" width="12" height="4" fill="#4f46e5"/><rect x="18" y="24" width="8" height="8" fill="#c7d2fe"/><rect x="26" y="22" width="12" height="8" fill="#94a3b8"/><rect x="27" y="23" width="10" height="6" fill="#38bdf8"/><rect x="24" y="30" width="14" height="2" fill="#475569"/><rect x="14" y="34" width="6" height="5" fill="#1e293b"/><rect x="24" y="34" width="6" height="5" fill="#1e293b"/><rect x="12" y="39" width="8" height="4" fill="#ef4444"/><rect x="24" y="39" width="8" height="4" fill="#ef4444"/></svg>`,
    dev_flap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges"><rect x="12" y="7" width="18" height="4" fill="#3b2f2f"/><rect x="10" y="10" width="5" height="6" fill="#3b2f2f"/><rect x="15" y="9" width="15" height="10" fill="#fed7aa"/><rect x="22" y="11" width="2" height="3" fill="#0f172a"/><rect x="27" y="11" width="2" height="3" fill="#0f172a"/><rect x="20" y="10" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/><rect x="25" y="10" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/><rect x="12" y="19" width="20" height="13" fill="#6366f1"/><rect x="18" y="22" width="8" height="8" fill="#c7d2fe"/><circle cx="16" cy="36" r="2" fill="#38bdf8"/><circle cx="22" cy="40" r="1.5" fill="#60a5fa"/><circle cx="28" cy="38" r="2" fill="#93c5fd"/><rect x="26" y="17" width="12" height="8" fill="#94a3b8"/><rect x="27" y="18" width="10" height="6" fill="#67e8f9"/><rect x="24" y="25" width="14" height="2" fill="#475569"/><rect x="14" y="32" width="6" height="5" fill="#1e293b"/><rect x="24" y="32" width="6" height="5" fill="#1e293b"/><rect x="12" y="37" width="8" height="4" fill="#ef4444"/><rect x="24" y="37" width="8" height="4" fill="#ef4444"/></svg>`,
    dev_dive: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges"><rect x="14" y="2" width="16" height="5" fill="#3b2f2f"/><rect x="12" y="4" width="4" height="5" fill="#3b2f2f"/><rect x="26" y="3" width="6" height="5" fill="#3b2f2f"/><rect x="16" y="9" width="15" height="10" fill="#fed7aa"/><rect x="24" y="13" width="2" height="3" fill="#0f172a"/><rect x="28" y="13" width="2" height="3" fill="#0f172a"/><rect x="24" y="17" width="4" height="2" fill="#e11d48"/><rect x="22" y="12" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/><rect x="27" y="12" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/><rect x="14" y="19" width="18" height="14" fill="#6366f1"/><rect x="26" y="24" width="12" height="8" fill="#94a3b8"/><rect x="27" y="25" width="10" height="6" fill="#f87171"/><rect x="25" y="32" width="13" height="2" fill="#475569"/><rect x="10" y="31" width="6" height="7" fill="#1e293b"/><rect x="18" y="33" width="6" height="7" fill="#1e293b"/><rect x="6" y="35" width="7" height="4" fill="#ef4444"/><rect x="16" y="39" width="7" height="4" fill="#ef4444"/></svg>`,
    dev_crash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges"><rect x="12" y="4" width="6" height="6" fill="#3b2f2f"/><rect x="20" y="3" width="8" height="6" fill="#3b2f2f"/><rect x="29" y="5" width="5" height="5" fill="#3b2f2f"/><rect x="14" y="10" width="16" height="11" fill="#fecaca"/><line x1="18" y1="13" x2="21" y2="16" stroke="#b91c1c" stroke-width="1.5"/><line x1="21" y1="13" x2="18" y2="16" stroke="#b91c1c" stroke-width="1.5"/><line x1="24" y1="13" x2="27" y2="16" stroke="#b91c1c" stroke-width="1.5"/><line x1="27" y1="13" x2="24" y2="16" stroke="#b91c1c" stroke-width="1.5"/><rect x="20" y="18" width="5" height="3" fill="#991b1b"/><rect x="31" y="15" width="4" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/><rect x="31" y="2" width="10" height="7" fill="#64748b" transform="rotate(25 31 2)"/><rect x="13" y="21" width="18" height="13" fill="#4338ca"/><rect x="17" y="24" width="10" height="7" fill="#818cf8"/><rect x="7" y="19" width="6" height="4" fill="#4338ca"/><rect x="3" y="16" width="5" height="4" fill="#fed7aa"/><rect x="11" y="34" width="7" height="6" fill="#1e293b"/><rect x="23" y="34" width="7" height="6" fill="#1e293b"/><rect x="8" y="39" width="7" height="4" fill="#ef4444"/><rect x="25" y="39" width="7" height="4" fill="#ef4444"/><circle cx="10" cy="11" r="2" fill="#f59e0b"/><circle cx="34" cy="28" r="2" fill="#ef4444"/></svg>`,
    obs_crt_bsod: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" shape-rendering="crispEdges"><rect x="4" y="4" width="56" height="72" rx="4" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/><rect x="8" y="8" width="48" height="52" rx="3" fill="#1f2937"/><rect x="10" y="10" width="44" height="48" rx="2" fill="#1d4ed8"/><line x1="10" y1="16" x2="54" y2="16" stroke="#2563eb" stroke-width="1"/><line x1="10" y1="24" x2="54" y2="24" stroke="#2563eb" stroke-width="1"/><line x1="10" y1="32" x2="54" y2="32" stroke="#2563eb" stroke-width="1"/><line x1="10" y1="40" x2="54" y2="40" stroke="#2563eb" stroke-width="1"/><line x1="10" y1="48" x2="54" y2="48" stroke="#2563eb" stroke-width="1"/><text x="14" y="22" font-family="monospace" font-size="5" fill="#ffffff" font-weight="bold">:(</text><text x="14" y="30" font-family="monospace" font-size="4" fill="#93c5fd">CRASH_DUMP</text><text x="14" y="38" font-family="monospace" font-size="3.5" fill="#ffffff">0x0000007E</text><text x="14" y="46" font-family="monospace" font-size="3" fill="#bfdbfe">DRIVER_IRQL</text><text x="14" y="52" font-family="monospace" font-size="3" fill="#bfdbfe">NOT_LESS_OR_EQUAL</text><circle cx="16" cy="66" r="2" fill="#6b7280"/><circle cx="23" cy="66" r="2" fill="#6b7280"/><rect x="44" y="64" width="8" height="4" fill="#4b5563"/><circle cx="40" cy="66" r="1.5" fill="#ef4444"/></svg>`,
    obs_crt_kernel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" shape-rendering="crispEdges"><rect x="4" y="4" width="56" height="72" rx="4" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/><circle cx="16" cy="12" r="2" fill="#6b7280"/><circle cx="23" cy="12" r="2" fill="#6b7280"/><circle cx="40" cy="12" r="1.5" fill="#22c55e"/><rect x="44" y="10" width="8" height="4" fill="#4b5563"/><rect x="8" y="18" width="48" height="54" rx="3" fill="#111827"/><rect x="10" y="20" width="44" height="50" rx="2" fill="#030712"/><line x1="10" y1="28" x2="54" y2="28" stroke="#111827" stroke-width="1"/><line x1="10" y1="36" x2="54" y2="36" stroke="#111827" stroke-width="1"/><line x1="10" y1="44" x2="54" y2="44" stroke="#111827" stroke-width="1"/><line x1="10" y1="52" x2="54" y2="52" stroke="#111827" stroke-width="1"/><line x1="10" y1="60" x2="54" y2="60" stroke="#111827" stroke-width="1"/><text x="13" y="30" font-family="monospace" font-size="4" fill="#ef4444" font-weight="bold">[KERNEL PANIC]</text><text x="13" y="38" font-family="monospace" font-size="3.5" fill="#f59e0b">Kernel panic -</text><text x="13" y="45" font-family="monospace" font-size="3.5" fill="#f59e0b">not syncing: VFS</text><text x="13" y="53" font-family="monospace" font-size="3" fill="#4ade80">Unable to mount</text><text x="13" y="60" font-family="monospace" font-size="3" fill="#4ade80">root fs on 08:01</text></svg>`,
    obs_server_top: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 96" shape-rendering="crispEdges"><rect x="4" y="0" width="56" height="92" rx="3" fill="#1e293b" stroke="#475569" stroke-width="2"/><rect x="8" y="4" width="48" height="24" fill="#0f172a"/><circle cx="14" cy="12" r="2" fill="#ef4444"/><circle cx="20" cy="12" r="2" fill="#22c55e"/><circle cx="26" cy="12" r="2" fill="#38bdf8"/><rect x="32" y="10" width="20" height="4" fill="#334155"/><rect x="8" y="32" width="48" height="24" fill="#0f172a"/><circle cx="14" cy="40" r="2" fill="#eab308"/><circle cx="20" cy="40" r="2" fill="#ef4444"/><rect x="32" y="38" width="20" height="4" fill="#334155"/><rect x="8" y="60" width="48" height="24" fill="#0f172a"/><circle cx="14" cy="68" r="2" fill="#38bdf8"/><circle cx="20" cy="68" r="2" fill="#22c55e"/><path d="M 12,88 Q 18,94 24,96" stroke="#ef4444" stroke-width="2" fill="none"/><path d="M 28,88 Q 34,95 40,96" stroke="#38bdf8" stroke-width="2" fill="none"/><path d="M 44,88 Q 50,93 54,96" stroke="#eab308" stroke-width="2" fill="none"/></svg>`,
    obs_server_bottom: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 96" shape-rendering="crispEdges"><rect x="4" y="4" width="56" height="92" rx="3" fill="#1e293b" stroke="#475569" stroke-width="2"/><path d="M 12,0 Q 18,3 24,6" stroke="#ef4444" stroke-width="2" fill="none"/><path d="M 28,0 Q 34,4 40,6" stroke="#38bdf8" stroke-width="2" fill="none"/><path d="M 44,0 Q 48,3 52,6" stroke="#22c55e" stroke-width="2" fill="none"/><rect x="8" y="12" width="48" height="24" fill="#0f172a"/><circle cx="14" cy="20" r="2" fill="#22c55e"/><circle cx="20" cy="20" r="2" fill="#38bdf8"/><rect x="32" y="18" width="20" height="4" fill="#334155"/><rect x="8" y="40" width="48" height="24" fill="#0f172a"/><circle cx="14" cy="48" r="2" fill="#ef4444"/><circle cx="20" cy="48" r="2" fill="#ef4444"/><rect x="32" y="46" width="20" height="4" fill="#334155"/><rect x="8" y="68" width="48" height="24" fill="#0f172a"/><circle cx="14" cy="76" r="2" fill="#22c55e"/><circle cx="20" cy="76" r="2" fill="#22c55e"/><rect x="32" y="74" width="20" height="4" fill="#334155"/></svg>`,
    item_coffee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="8" y="10" width="14" height="16" rx="2" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/><rect x="22" y="13" width="5" height="8" rx="2" fill="none" stroke="#f8fafc" stroke-width="2"/><rect x="10" y="12" width="10" height="3" fill="#78350f"/><path d="M 11,8 Q 13,5 12,2" fill="none" stroke="#94a3b8" stroke-width="1.5"/><path d="M 16,8 Q 18,5 17,2" fill="none" stroke="#94a3b8" stroke-width="1.5"/><circle cx="15" cy="18" r="3" fill="#0284c7"/></svg>`,
    item_duck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><ellipse cx="15" cy="20" rx="9" ry="7" fill="#facc15"/><circle cx="21" cy="13" r="5" fill="#facc15"/><circle cx="22" cy="12" r="1" fill="#0f172a"/><polygon points="25,13 31,14 26,17" fill="#ea580c"/><ellipse cx="12" cy="20" rx="5" ry="3" fill="#eab308"/></svg>`,
    item_commit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><circle cx="16" cy="16" r="14" fill="#f59e0b" stroke="#b45309" stroke-width="2"/><circle cx="16" cy="16" r="6" fill="#fef3c7"/><line x1="6" y1="16" x2="10" y2="16" stroke="#b45309" stroke-width="2"/><line x1="22" y1="16" x2="26" y2="16" stroke="#b45309" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="#b45309"/></svg>`,
    bg_tiles: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges"><rect width="64" height="64" fill="#090d16"/><line x1="0" y1="63" x2="64" y2="63" stroke="#1e293b" stroke-width="1"/><line x1="63" y1="0" x2="63" y2="64" stroke="#1e293b" stroke-width="1"/><line x1="0" y1="0" x2="64" y2="64" stroke="#111827" stroke-width="1"/></svg>`
  };

  // --- 4. Preloaded Image Cache ---
  const imageCache = {};
  function getSpriteImage(name) {
    if (!imageCache[name] && SPRITES[name]) {
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SPRITES[name]);
      imageCache[name] = img;
    }
    return imageCache[name] || null;
  }

  // Pre-instantiate images
  Object.keys(SPRITES).forEach(k => getSpriteImage(k));

  return {
    audio,
    SPRITES,
    getSpriteImage,
    SOUND_PARAMS
  };
}));
