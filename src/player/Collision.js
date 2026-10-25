/**
 * DARKNESS: THE HAUNTED WORLD
 * 3D AABB & Cylinder Collision System with Wall Sliding
 */

export class CollisionSystem {
  constructor() {
    this.colliders = []; // Array of { minX, maxX, minZ, maxZ, minY, maxY, isDoor, id }
  }

  clear() {
    this.colliders = [];
  }

  addBox(minX, maxX, minZ, maxZ, minY = -1, maxY = 5, meta = {}) {
    this.colliders.push({
      minX: Math.min(minX, maxX),
      maxX: Math.max(minX, maxX),
      minZ: Math.min(minZ, maxZ),
      maxZ: Math.max(minZ, maxZ),
      minY,
      maxY,
      ...meta
    });
  }

  removeById(id) {
    this.colliders = this.colliders.filter(c => c.id !== id);
  }

  /**
   * Resolves cylinder collision with sliding response
   * @param {THREE.Vector3} currentPos 
   * @param {THREE.Vector3} desiredPos 
   * @param {number} radius 
   * @returns {THREE.Vector3} Final resolved position
   */
  resolvePosition(currentPos, desiredPos, radius = 0.45) {
    const resolved = desiredPos.clone();

    // Test X movement first (allows sliding along Z)
    const testX = currentPos.clone();
    testX.x = desiredPos.x;
    if (this.isColliding(testX.x, currentPos.z, radius)) {
      resolved.x = currentPos.x; // Block X movement
    }

    // Test Z movement (allows sliding along X)
    const testZ = currentPos.clone();
    testZ.x = resolved.x;
    testZ.z = desiredPos.z;
    if (this.isColliding(resolved.x, testZ.z, radius)) {
      resolved.z = currentPos.z; // Block Z movement
    }

    return resolved;
  }

  isColliding(x, z, radius = 0.45, y = 1.0) {
    for (let i = 0; i < this.colliders.length; i++) {
      const c = this.colliders[i];
      if (y < c.minY || y > c.maxY) continue;

      // Expand collider by radius
      if (
        x + radius > c.minX &&
        x - radius < c.maxX &&
        z + radius > c.minZ &&
        z - radius < c.maxZ
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Raycast check against collision geometry (e.g. Line-of-sight for enemy)
   */
  hasLineOfSight(fromVec, toVec) {
    const dx = toVec.x - fromVec.x;
    const dz = toVec.z - fromVec.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 0.1) return true;

    const steps = Math.ceil(dist / 0.5);
    const stepX = dx / steps;
    const stepZ = dz / steps;

    for (let i = 1; i < steps; i++) {
      const checkX = fromVec.x + stepX * i;
      const checkZ = fromVec.z + stepZ * i;
      if (this.isColliding(checkX, checkZ, 0.15)) {
        return false; // Vision blocked by wall or obstacle
      }
    }
    return true;
  }
}
