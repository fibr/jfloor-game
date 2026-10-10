/**
 * JFloorGame Visual Sprites Catalog (sprites.js)
 * High-definition vector pixel-art SVG templates and Canvas renderers
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JFloorSprites = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const SVG_DEFS = {
    dev_idle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges">
      <rect x="14" y="5" width="16" height="5" fill="#3b2f2f"/>
      <rect x="12" y="8" width="4" height="6" fill="#3b2f2f"/>
      <rect x="10" y="10" width="3" height="4" fill="#3b2f2f"/>
      <rect x="15" y="10" width="15" height="10" fill="#fed7aa"/>
      <rect x="22" y="13" width="2" height="3" fill="#0f172a"/>
      <rect x="27" y="13" width="2" height="3" fill="#0f172a"/>
      <rect x="20" y="12" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/>
      <rect x="25" y="12" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/>
      <rect x="24" y="13" width="2" height="1" fill="#0ea5e9"/>
      <rect x="12" y="20" width="20" height="14" fill="#6366f1"/>
      <rect x="16" y="20" width="12" height="4" fill="#4f46e5"/>
      <rect x="18" y="24" width="8" height="8" fill="#c7d2fe"/>
      <rect x="26" y="22" width="12" height="8" fill="#94a3b8"/>
      <rect x="27" y="23" width="10" height="6" fill="#38bdf8"/>
      <rect x="24" y="30" width="14" height="2" fill="#475569"/>
      <rect x="14" y="34" width="6" height="5" fill="#1e293b"/>
      <rect x="24" y="34" width="6" height="5" fill="#1e293b"/>
      <rect x="12" y="39" width="8" height="4" fill="#ef4444"/>
      <rect x="24" y="39" width="8" height="4" fill="#ef4444"/>
    </svg>`,

    dev_flap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges">
      <rect x="12" y="7" width="18" height="4" fill="#3b2f2f"/>
      <rect x="10" y="10" width="5" height="6" fill="#3b2f2f"/>
      <rect x="15" y="9" width="15" height="10" fill="#fed7aa"/>
      <rect x="22" y="11" width="2" height="3" fill="#0f172a"/>
      <rect x="27" y="11" width="2" height="3" fill="#0f172a"/>
      <rect x="20" y="10" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/>
      <rect x="25" y="10" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/>
      <rect x="12" y="19" width="20" height="13" fill="#6366f1"/>
      <rect x="18" y="22" width="8" height="8" fill="#c7d2fe"/>
      <circle cx="16" cy="36" r="2" fill="#38bdf8"/>
      <circle cx="22" cy="40" r="1.5" fill="#60a5fa"/>
      <circle cx="28" cy="38" r="2" fill="#93c5fd"/>
      <rect x="26" y="17" width="12" height="8" fill="#94a3b8"/>
      <rect x="27" y="18" width="10" height="6" fill="#67e8f9"/>
      <rect x="24" y="25" width="14" height="2" fill="#475569"/>
      <rect x="14" y="32" width="6" height="5" fill="#1e293b"/>
      <rect x="24" y="32" width="6" height="5" fill="#1e293b"/>
      <rect x="12" y="37" width="8" height="4" fill="#ef4444"/>
      <rect x="24" y="37" width="8" height="4" fill="#ef4444"/>
    </svg>`,

    dev_dive: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges">
      <rect x="14" y="2" width="16" height="5" fill="#3b2f2f"/>
      <rect x="12" y="4" width="4" height="5" fill="#3b2f2f"/>
      <rect x="26" y="3" width="6" height="5" fill="#3b2f2f"/>
      <rect x="16" y="9" width="15" height="10" fill="#fed7aa"/>
      <rect x="24" y="13" width="2" height="3" fill="#0f172a"/>
      <rect x="28" y="13" width="2" height="3" fill="#0f172a"/>
      <rect x="24" y="17" width="4" height="2" fill="#e11d48"/>
      <rect x="22" y="12" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/>
      <rect x="27" y="12" width="5" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/>
      <rect x="14" y="19" width="18" height="14" fill="#6366f1"/>
      <rect x="26" y="24" width="12" height="8" fill="#94a3b8"/>
      <rect x="27" y="25" width="10" height="6" fill="#f87171"/>
      <rect x="25" y="32" width="13" height="2" fill="#475569"/>
      <rect x="10" y="31" width="6" height="7" fill="#1e293b"/>
      <rect x="18" y="33" width="6" height="7" fill="#1e293b"/>
      <rect x="6" y="35" width="7" height="4" fill="#ef4444"/>
      <rect x="16" y="39" width="7" height="4" fill="#ef4444"/>
    </svg>`,

    dev_crash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" shape-rendering="crispEdges">
      <rect x="12" y="4" width="6" height="6" fill="#3b2f2f"/>
      <rect x="20" y="3" width="8" height="6" fill="#3b2f2f"/>
      <rect x="29" y="5" width="5" height="5" fill="#3b2f2f"/>
      <rect x="14" y="10" width="16" height="11" fill="#fecaca"/>
      <line x1="18" y1="13" x2="21" y2="16" stroke="#b91c1c" stroke-width="1.5"/>
      <line x1="21" y1="13" x2="18" y2="16" stroke="#b91c1c" stroke-width="1.5"/>
      <line x1="24" y1="13" x2="27" y2="16" stroke="#b91c1c" stroke-width="1.5"/>
      <line x1="27" y1="13" x2="24" y2="16" stroke="#b91c1c" stroke-width="1.5"/>
      <rect x="20" y="18" width="5" height="3" fill="#991b1b"/>
      <rect x="31" y="15" width="4" height="4" fill="none" stroke="#0ea5e9" stroke-width="1"/>
      <rect x="13" y="21" width="18" height="13" fill="#4338ca"/>
      <rect x="17" y="24" width="10" height="7" fill="#818cf8"/>
      <rect x="11" y="34" width="7" height="6" fill="#1e293b"/>
      <rect x="23" y="34" width="7" height="6" fill="#1e293b"/>
      <rect x="8" y="39" width="7" height="4" fill="#ef4444"/>
      <rect x="25" y="39" width="7" height="4" fill="#ef4444"/>
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
      <text x="14" y="23" font-family="monospace" font-size="6" fill="#ffffff" font-weight="bold">:(</text>
      <text x="14" y="32" font-family="monospace" font-size="4" fill="#93c5fd">CRASH_DUMP</text>
      <text x="14" y="40" font-family="monospace" font-size="3.5" fill="#ffffff">0x0000007E</text>
      <text x="14" y="48" font-family="monospace" font-size="3" fill="#bfdbfe">FATAL_EXCEPTION</text>
      <circle cx="16" cy="66" r="2" fill="#6b7280"/>
      <circle cx="23" cy="66" r="2" fill="#6b7280"/>
      <rect x="44" y="64" width="8" height="4" fill="#4b5563"/>
      <circle cx="40" cy="66" r="1.5" fill="#ef4444"/>
    </svg>`,

    obs_crt_kernel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" shape-rendering="crispEdges">
      <rect x="4" y="4" width="56" height="72" rx="4" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
      <rect x="8" y="16" width="48" height="54" rx="3" fill="#111827"/>
      <rect x="10" y="18" width="44" height="50" rx="2" fill="#030712"/>
      <text x="13" y="28" font-family="monospace" font-size="4.2" fill="#ef4444" font-weight="bold">[KERNEL PANIC]</text>
      <text x="13" y="36" font-family="monospace" font-size="3.5" fill="#f59e0b">not syncing: VFS</text>
      <text x="13" y="44" font-family="monospace" font-size="3.5" fill="#4ade80">Unable to mount</text>
      <text x="13" y="52" font-family="monospace" font-size="3.5" fill="#4ade80">root fs on 08:01</text>
      <text x="13" y="60" font-family="monospace" font-size="3" fill="#22d3ee">Call Trace: [RIP]</text>
      <circle cx="16" cy="10" r="2" fill="#6b7280"/>
      <circle cx="23" cy="10" r="2" fill="#6b7280"/>
      <circle cx="40" cy="10" r="1.5" fill="#22c55e"/>
      <rect x="44" y="8" width="8" height="4" fill="#4b5563"/>
    </svg>`,

    gate_bit_flip: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 120" shape-rendering="crispEdges">
      <rect x="2" y="2" width="56" height="116" rx="6" fill="#1e1b4b" stroke="#818cf8" stroke-width="2.5"/>
      <rect x="6" y="6" width="48" height="108" rx="4" fill="#0f172a"/>
      <!-- Neon Logic Gate NOT Symbol -->
      <polygon points="15,25 45,45 15,65" fill="#4338ca" stroke="#a855f7" stroke-width="2"/>
      <circle cx="47" cy="45" r="4.5" fill="#06b6d4" stroke="#ec4899" stroke-width="1.5"/>
      <text x="30" y="88" font-family="monospace" font-size="9" fill="#38bdf8" font-weight="bold" text-anchor="middle">NOT</text>
      <text x="30" y="104" font-family="monospace" font-size="7" fill="#f43f5e" font-weight="bold" text-anchor="middle">&Delta; g&uarr;&darr;</text>
      <circle cx="10" cy="12" r="2" fill="#22c55e"/>
      <circle cx="50" cy="12" r="2" fill="#ef4444"/>
      <circle cx="10" cy="108" r="2" fill="#a855f7"/>
      <circle cx="50" cy="108" r="2" fill="#06b6d4"/>
    </svg>`,

    field_breakpoint: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <polygon points="40,4 72,20 72,60 40,76 8,60 8,20" fill="#450a0a" stroke="#dc2626" stroke-width="3"/>
      <polygon points="40,10 66,23 66,57 40,70 14,57 14,23" fill="#7f1d1d" opacity="0.6"/>
      <rect x="28" y="26" width="7" height="28" rx="2" fill="#ffffff"/>
      <rect x="45" y="26" width="7" height="28" rx="2" fill="#ffffff"/>
      <text x="40" y="66" font-family="monospace" font-size="7" fill="#fca5a5" font-weight="bold" text-anchor="middle">debugger;</text>
    </svg>`,

    vent_memory_leak: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 70">
      <rect x="6" y="20" width="38" height="48" rx="4" fill="#334155" stroke="#64748b" stroke-width="2"/>
      <rect x="12" y="26" width="26" height="36" fill="#1e293b"/>
      <line x1="16" y1="32" x2="34" y2="32" stroke="#475569" stroke-width="2"/>
      <line x1="16" y1="42" x2="34" y2="42" stroke="#475569" stroke-width="2"/>
      <line x1="16" y1="52" x2="34" y2="52" stroke="#475569" stroke-width="2"/>
      <polygon points="10,20 25,4 40,20" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="25" cy="12" r="3" fill="#f59e0b"/>
      <text x="25" y="65" font-family="monospace" font-size="4" fill="#f59e0b" text-anchor="middle">LEAK</text>
    </svg>`,

    pickup_duck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
      <ellipse cx="18" cy="22" rx="12" ry="9" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="24" cy="13" r="7" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="26" cy="11" r="1.5" fill="#0f172a"/>
      <polygon points="29,13 36,15 29,17" fill="#ea580c"/>
      <rect x="22" y="9" width="6" height="4" fill="none" stroke="#0284c7" stroke-width="1"/>
      <path d="M 6,19 Q 2,16 6,14 Q 10,18 10,21 Z" fill="#eab308"/>
      <!-- Shield Pulse Ring -->
      <circle cx="18" cy="18" r="16" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,2"/>
    </svg>`,

    pickup_coffee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
      <rect x="8" y="10" width="18" height="20" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="10" y="12" width="14" height="4" fill="#78350f"/>
      <path d="M 26,14 C 32,14 32,24 26,24" fill="none" stroke="#cbd5e1" stroke-width="2.5"/>
      <rect x="6" y="30" width="22" height="3" rx="1.5" fill="#94a3b8"/>
      <path d="M 12,8 Q 14,4 12,1" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
      <path d="M 17,8 Q 19,4 17,1" fill="none" stroke="#ea580c" stroke-width="1.5"/>
      <path d="M 22,8 Q 24,4 22,1" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
    </svg>`,

    pickup_commit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="15" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
      <circle cx="18" cy="18" r="11" fill="#fbbf24"/>
      <circle cx="18" cy="18" r="5" fill="#1e293b"/>
      <line x1="6" y1="18" x2="13" y2="18" stroke="#1e293b" stroke-width="3"/>
      <line x1="23" y1="18" x2="30" y2="18" stroke="#1e293b" stroke-width="3"/>
    </svg>`
  };

  // Convert SVGs to Image objects for high-speed canvas drawing
  const imageCache = {};
  let imagesLoaded = false;

  function loadImages(callback) {
    let pending = Object.keys(SVG_DEFS).length;
    for (const [key, svg] of Object.entries(SVG_DEFS)) {
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      img.onload = () => {
        imageCache[key] = img;
        pending--;
        if (pending === 0) {
          imagesLoaded = true;
          if (callback) callback();
        }
      };
      img.onerror = () => {
        pending--;
        if (pending === 0 && callback) callback();
      };
    }
  }

  // Preload images immediately
  if (typeof window !== 'undefined') {
    loadImages();
  }

  return {
    svgs: SVG_DEFS,
    getImage: (key) => imageCache[key] || null,
    isLoaded: () => imagesLoaded,
    preload: loadImages
  };
}));
