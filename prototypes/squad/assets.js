/**
 * JFloorGame: Squad Runner Asset Library (assets.js)
 * High-fidelity SVG Pixel Art Sprites & Retro WebAudio (ZzFX) Synthesizer
 * Tailored for proto-squad: Tandem Flock Formation & Tag-Team Ability Swapper
 */

(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SquadAssets = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  // --- 1. ZzFX Procedural 8-bit Audio Synthesizer (Frank Force, MIT) ---
  let zzfxV = 0.3; // Master volume
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
    if (zzfxV <= 0) return null;
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
    m *= R; t *= R; u *= R; d *= R;
    z *= 500 * b / R ** 3; x *= b / R; w *= b / R; A *= R; l = R * l | 0;
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

  // --- 2. Audio Effects Sound Catalog ---
  const SOUNDS = {
    jump: () => zzfx(1.2, 0.05, 330, 0.01, 0.06, 0.09, 0, 1.4, -4.5, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, 0.02, 0),
    score: () => zzfx(1.0, 0.01, 650, 0.01, 0.12, 0.18, 0, 0.8, 5.2, 0, 120, 0.05, 0.03, 0, 0, 0, 0, 0.8, 0.01, 0),
    nearMiss: () => zzfx(1.1, 0.08, 850, 0.01, 0.04, 0.08, 3, 2.1, 0, 0, 0, 0, 0, 1.5, 0, 0.4, 0, 0.6, 0.03, 0),
    pickup: () => zzfx(1.3, 0.05, 420, 0.03, 0.22, 0.28, 1, 1.1, 7.8, 0, 150, 0.08, 0.04, 0, 0, 0, 0, 0.75, 0.08, 0),
    revive: () => zzfx(1.2, 0.05, 520, 0.02, 0.14, 0.22, 0, 1.6, -2.1, 0, 0, 0, 0, 0.8, 0, 0.2, 0, 0.65, 0.04, 0),
    ability: () => zzfx(1.4, 0.04, 180, 0.05, 0.35, 0.45, 1, 1.2, -3.5, 0, -80, 0.12, 0.08, 0.5, 0, 0.2, 0, 0.5, 0.15, 0),
    crash: () => zzfx(1.5, 0.1, 140, 0.05, 0.28, 0.45, 4, 2.5, -0.8, 0, 0, 0, 0, 2.8, 0, 0.6, 0.08, 0.4, 0.12, 0.05),
    shieldHit: () => zzfx(1.3, 0.02, 280, 0.01, 0.1, 0.2, 1, 2.0, 3.5, 0, 200, 0.04, 0, 0, 0, 0, 0, 0.7, 0.05, 0)
  };

  // --- 3. Pixel-Crisp SVG Sprite Vector Templates ---
  const SPRITES = {
    dev_frontend: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges">
      <path d="M 10,22 Q 4,26 2,36 Q 8,34 14,32 Z" fill="#ec4899"/>
      <rect x="14" y="5" width="16" height="5" fill="#3b2f2f"/>
      <rect x="24" y="5" width="6" height="3" fill="#06b6d4"/>
      <rect x="12" y="8" width="4" height="6" fill="#3b2f2f"/>
      <rect x="15" y="10" width="15" height="10" fill="#fed7aa"/>
      <rect x="23" y="13" width="2" height="3" fill="#0f172a"/>
      <rect x="28" y="13" width="2" height="3" fill="#0f172a"/>
      <circle cx="23" cy="14" r="3" fill="none" stroke="#ec4899" stroke-width="1"/>
      <circle cx="28" cy="14" r="3" fill="none" stroke="#ec4899" stroke-width="1"/>
      <rect x="12" y="20" width="20" height="14" fill="#0891b2"/>
      <rect x="16" y="20" width="12" height="4" fill="#0e7490"/>
      <rect x="18" y="24" width="8" height="8" fill="#a5f3fc"/>
      <rect x="26" y="22" width="12" height="8" fill="#cbd5e1"/>
      <rect x="27" y="23" width="10" height="6" fill="#06b6d4"/>
      <rect x="29" y="25" width="2" height="2" fill="#ffffff"/>
      <rect x="33" y="25" width="2" height="2" fill="#ffffff"/>
      <rect x="14" y="34" width="6" height="5" fill="#334155"/>
      <rect x="24" y="34" width="6" height="5" fill="#334155"/>
      <rect x="12" y="39" width="8" height="4" fill="#f43f5e"/>
      <rect x="24" y="39" width="8" height="4" fill="#f43f5e"/>
    </svg>`,

    dev_backend: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges">
      <ellipse cx="10" cy="26" rx="5" ry="8" fill="#2563eb" stroke="#1d4ed8" stroke-width="1"/>
      <ellipse cx="10" cy="22" rx="4" ry="2" fill="#60a5fa"/>
      <rect x="13" y="5" width="18" height="6" fill="#ea580c"/>
      <rect x="11" y="9" width="5" height="5" fill="#3b2f2f"/>
      <rect x="15" y="10" width="15" height="10" fill="#fed7aa"/>
      <rect x="15" y="17" width="15" height="4" fill="#78350f"/>
      <rect x="19" y="12" width="12" height="4" fill="#22c55e"/>
      <line x1="20" y1="14" x2="30" y2="14" stroke="#14532d" stroke-width="1"/>
      <rect x="12" y="20" width="20" height="14" fill="#1e293b"/>
      <rect x="16" y="20" width="12" height="14" fill="#ea580c"/>
      <rect x="25" y="22" width="13" height="9" fill="#475569"/>
      <rect x="26" y="23" width="11" height="7" fill="#022c22"/>
      <text x="27" y="28" font-family="monospace" font-size="4" fill="#4ade80">&gt;_</text>
      <rect x="14" y="34" width="6" height="5" fill="#3f3f46"/>
      <rect x="24" y="34" width="6" height="5" fill="#3f3f46"/>
      <rect x="12" y="39" width="8" height="4" fill="#854d0e"/>
      <rect x="24" y="39" width="8" height="4" fill="#854d0e"/>
    </svg>`,

    dev_devops: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges">
      <path d="M 12,10 Q 22,4 32,10 Z" fill="#eab308"/>
      <rect x="10" y="9" width="24" height="3" fill="#ca8a04"/>
      <circle cx="22" cy="7" r="2" fill="#2563eb"/>
      <rect x="15" y="11" width="14" height="9" fill="#fed7aa"/>
      <rect x="22" y="13" width="2" height="3" fill="#0f172a"/>
      <rect x="26" y="13" width="2" height="3" fill="#0f172a"/>
      <rect x="19" y="12" width="11" height="4" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
      <rect x="12" y="20" width="20" height="14" fill="#84cc16"/>
      <rect x="12" y="24" width="20" height="2" fill="#f8fafc"/>
      <rect x="15" y="20" width="3" height="14" fill="#f8fafc"/>
      <rect x="26" y="20" width="3" height="14" fill="#f8fafc"/>
      <rect x="26" y="22" width="13" height="9" fill="#334155"/>
      <rect x="27" y="23" width="11" height="7" fill="#0f172a"/>
      <rect x="28" y="24" width="4" height="2" fill="#22c55e"/>
      <rect x="33" y="24" width="4" height="2" fill="#ef4444"/>
      <rect x="14" y="34" width="6" height="5" fill="#1e293b"/>
      <rect x="24" y="34" width="6" height="5" fill="#1e293b"/>
      <rect x="12" y="39" width="8" height="4" fill="#475569"/>
      <rect x="24" y="39" width="8" height="4" fill="#475569"/>
    </svg>`,

    dev_crash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges">
      <rect x="12" y="4" width="6" height="6" fill="#3b2f2f"/>
      <rect x="20" y="3" width="8" height="6" fill="#3b2f2f"/>
      <rect x="14" y="10" width="16" height="11" fill="#fecaca"/>
      <line x1="18" y1="13" x2="21" y2="16" stroke="#b91c1c" stroke-width="1.5"/>
      <line x1="21" y1="13" x2="18" y2="16" stroke="#b91c1c" stroke-width="1.5"/>
      <line x1="24" y1="13" x2="27" y2="16" stroke="#b91c1c" stroke-width="1.5"/>
      <line x1="27" y1="13" x2="24" y2="16" stroke="#b91c1c" stroke-width="1.5"/>
      <rect x="13" y="21" width="18" height="13" fill="#4338ca"/>
      <circle cx="10" cy="11" r="2" fill="#f59e0b"/>
      <circle cx="34" cy="28" r="2" fill="#ef4444"/>
    </svg>`,

    obs_crt_bsod: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" shape-rendering="crispEdges">
      <rect x="4" y="4" width="56" height="72" rx="4" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
      <rect x="8" y="8" width="48" height="52" rx="3" fill="#1f2937"/>
      <rect x="10" y="10" width="44" height="48" rx="2" fill="#1d4ed8"/>
      <line x1="10" y1="16" x2="54" y2="16" stroke="#2563eb" stroke-width="1"/>
      <line x1="10" y1="24" x2="54" y2="24" stroke="#2563eb" stroke-width="1"/>
      <line x1="10" y1="32" x2="54" y2="32" stroke="#2563eb" stroke-width="1"/>
      <line x1="10" y1="40" x2="54" y2="40" stroke="#2563eb" stroke-width="1"/>
      <text x="14" y="22" font-family="monospace" font-size="5" fill="#ffffff" font-weight="bold">:(</text>
      <text x="14" y="30" font-family="monospace" font-size="4" fill="#93c5fd">CRASH</text>
      <text x="14" y="38" font-family="monospace" font-size="3.5" fill="#ffffff">0x000007E</text>
      <circle cx="16" cy="66" r="2" fill="#6b7280"/>
      <circle cx="23" cy="66" r="2" fill="#6b7280"/>
      <circle cx="40" cy="66" r="1.5" fill="#ef4444"/>
    </svg>`,

    obs_crt_kernel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" shape-rendering="crispEdges">
      <rect x="4" y="4" width="56" height="72" rx="4" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
      <circle cx="16" cy="12" r="2" fill="#6b7280"/>
      <circle cx="23" cy="12" r="2" fill="#6b7280"/>
      <circle cx="40" cy="12" r="1.5" fill="#22c55e"/>
      <rect x="8" y="18" width="48" height="54" rx="3" fill="#111827"/>
      <rect x="10" y="20" width="44" height="50" rx="2" fill="#030712"/>
      <line x1="10" y1="28" x2="54" y2="28" stroke="#111827" stroke-width="1"/>
      <line x1="10" y1="36" x2="54" y2="36" stroke="#111827" stroke-width="1"/>
      <line x1="10" y1="44" x2="54" y2="44" stroke="#111827" stroke-width="1"/>
      <text x="13" y="30" font-family="monospace" font-size="4" fill="#ef4444" font-weight="bold">[KERNEL PANIC]</text>
      <text x="13" y="38" font-family="monospace" font-size="3.5" fill="#f59e0b">not syncing: VFS</text>
      <text x="13" y="46" font-family="monospace" font-size="3" fill="#4ade80">Unable to mount</text>
      <text x="13" y="54" font-family="monospace" font-size="3" fill="#22d3ee">Call Trace: [RIP]</text>
    </svg>`,

    item_coffee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
      <path d="M 8,10 L 22,10 L 20,26 L 10,26 Z" fill="#f59e0b"/>
      <rect x="7" y="8" width="16" height="2" fill="#d97706"/>
      <path d="M 22,12 Q 28,12 28,17 Q 28,22 21,22" fill="none" stroke="#d97706" stroke-width="2.5"/>
      <ellipse cx="15" cy="10" rx="6" ry="1.5" fill="#78350f"/>
      <path d="M 12,6 Q 13,4 12,2" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.8"/>
      <path d="M 16,5 Q 17,3 16,1" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.8"/>
    </svg>`,

    item_duck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
      <circle cx="18" cy="12" r="7" fill="#facc15"/>
      <ellipse cx="14" cy="22" rx="10" ry="6" fill="#facc15"/>
      <circle cx="21" cy="11" r="1.5" fill="#1e293b"/>
      <path d="M 23,13 L 30,15 L 23,17 Z" fill="#ea580c"/>
      <ellipse cx="12" cy="22" rx="4" ry="2.5" fill="#eab308"/>
    </svg>`,

    item_commit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
      <circle cx="16" cy="16" r="12" fill="#10b981" stroke="#059669" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="#064e3b"/>
      <circle cx="16" cy="16" r="4" fill="#34d399"/>
      <line x1="16" y1="2" x2="16" y2="10" stroke="#34d399" stroke-width="2"/>
      <line x1="16" y1="22" x2="16" y2="30" stroke="#34d399" stroke-width="2"/>
    </svg>`
  };

  // Helper to convert SVG strings into cached HTMLImageElement instances
  function loadSpriteImages(callback) {
    const images = {};
    const keys = Object.keys(SPRITES);
    let loaded = 0;
    keys.forEach(k => {
      const img = new Image();
      const svg = SPRITES[k];
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      img.onload = () => {
        images[k] = img;
        loaded++;
        if (loaded === keys.length && callback) callback(images);
      };
      img.onerror = () => {
        loaded++;
        if (loaded === keys.length && callback) callback(images);
      };
    });
    return images;
  }

  return {
    sounds: SOUNDS,
    sprites: SPRITES,
    loadSpriteImages: loadSpriteImages,
    setVolume: (v) => { zzfxV = Math.max(0, Math.min(1, v)); },
    getVolume: () => zzfxV
  };
}));
