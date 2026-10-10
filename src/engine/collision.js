/**
 * JFloorGame 3-Tier Hitbox and Collision Architecture (collision.js)
 * Implements inner lethal hull (65%), corner chamfer deflections, and near-miss radar
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JFloorCollision = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Check if circle overlaps with axis-aligned bounding box (AABB) with optional chamfer
  function circleIntersectsAABB(cx, cy, radius, box, chamfer = 8) {
    // Find closest point to circle inside the box
    const closestX = Math.max(box.x, Math.min(cx, box.x + box.w));
    const closestY = Math.max(box.y, Math.min(cy, box.y + box.h));

    const dx = cx - closestX;
    const dy = cy - closestY;
    const distSq = dx * dx + dy * dy;

    if (distSq > radius * radius) {
      return { collides: false };
    }

    // Check if collision is in the chamfer corner zone
    const isLeft = cx < box.x + chamfer;
    const isRight = cx > box.x + box.w - chamfer;
    const isTop = cy < box.y + chamfer;
    const isBottom = cy > box.y + box.h - chamfer;

    const inCornerZone = (isLeft || isRight) && (isTop || isBottom);

    return {
      collides: true,
      inCornerZone,
      penetration: radius - Math.sqrt(distSq),
      normalX: dx !== 0 ? dx / Math.sqrt(distSq || 1) : 0,
      normalY: dy !== 0 ? dy / Math.sqrt(distSq || 1) : 1
    };
  }

  // Check Near-Miss Radar envelope (12px outer buffer)
  function checkNearMiss(cx, cy, innerRadius, radarMargin, box) {
    const radarRadius = innerRadius + radarMargin;
    const innerTest = circleIntersectsAABB(cx, cy, innerRadius, box);
    if (innerTest.collides) {
      return { isNearMiss: false, lethal: true };
    }

    const outerTest = circleIntersectsAABB(cx, cy, radarRadius, box);
    if (outerTest.collides) {
      return { isNearMiss: true, lethal: false };
    }

    return { isNearMiss: false, lethal: false };
  }

  class CollisionSystem {
    constructor(config = {}) {
      this.innerRadius = config.innerRadius || 14;     // Inner lethal hull (~28px diameter, 65% area)
      this.radarMargin = config.radarMargin || 12;     // Near-miss radar perimeter (12px buffer)
      this.chamferSize = config.chamferSize || 8;      // 8px corner bevel
    }

    testObstacleCollision(player, obstacle) {
      // player: { x, y, vy, hasShield, invulnerableTime }
      // obstacle: { topBox, bottomBox, passed, nearMissTriggered, id }
      const results = {
        lethalHit: false,
        shieldAbsorbed: false,
        nearMiss: false,
        deflected: false
      };

      const boxes = [obstacle.topBox, obstacle.bottomBox].filter(Boolean);

      for (const box of boxes) {
        // First test inner lethal collision
        const hit = circleIntersectsAABB(player.x, player.y, this.innerRadius, box, this.chamferSize);

        if (hit.collides) {
          // If in corner zone with small penetration, apply chamfer deflection
          if (hit.inCornerZone && hit.penetration < 5) {
            results.deflected = true;
            // Push player out along chamfer normal
            player.y += hit.normalY * (hit.penetration + 1);
            player.vy *= -0.5; // Mild rebound
            return results;
          }

          // Active lethal hit
          if (player.invulnerableTime > 0) {
            // Player is temporarily invulnerable from previous shield pop
            results.deflected = true;
            return results;
          }

          if (player.hasShield) {
            results.shieldAbsorbed = true;
            return results;
          }

          results.lethalHit = true;
          return results;
        }

        // Test near-miss radar if not colliding
        const radar = checkNearMiss(player.x, player.y, this.innerRadius, this.radarMargin, box);
        if (radar.isNearMiss) {
          results.nearMiss = true;
        }
      }

      return results;
    }

    testPickupCollision(player, pickup) {
      // pickup: { x, y, radius: 16 }
      const dx = player.x - pickup.x;
      const dy = player.y - pickup.y;
      const combined = this.innerRadius + (pickup.radius || 14);
      return (dx * dx + dy * dy) <= (combined * combined);
    }

    testTriggerZone(player, zone) {
      // zone: { x, y, w, h }
      return (
        player.x >= zone.x &&
        player.x <= zone.x + zone.w &&
        player.y >= zone.y &&
        player.y <= zone.y + zone.h
      );
    }
  }

  return {
    circleIntersectsAABB,
    checkNearMiss,
    CollisionSystem
  };
}));
