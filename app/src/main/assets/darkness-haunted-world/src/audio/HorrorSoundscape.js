/**
 * DARKNESS: THE HAUNTED WORLD
 * Horror Soundscape coordinator
 * Modulates tension, heartbeat, footsteps cadence, and scare stingers
 */

export class HorrorSoundscape {
  constructor(audioManager) {
    this.audio = audioManager;
    this.footstepTimer = 0;
    this.lastMonsterGroan = 0;
  }

  update(delta, player, enemy) {
    if (!this.audio || !this.audio.isInitialized) return;

    // 1. Footstep pacing
    const isMoving = player.isMoving;
    if (isMoving) {
      this.footstepTimer -= delta;
      const stepInterval = player.isSprinting ? 0.32 : (player.isCrouching ? 0.65 : 0.48);
      if (this.footstepTimer <= 0) {
        this.audio.playFootstep(player.isSprinting);
        this.footstepTimer = stepInterval;
      }
    } else {
      this.footstepTimer = 0.1;
    }

    // 2. Enemy proximity tension and heartbeat
    if (enemy && enemy.mesh) {
      const dist = player.position.distanceTo(enemy.mesh.position);
      this.audio.updateHeartbeat(dist);

      // Random monster breathing when within 15 meters
      if (dist < 15 && Math.random() < 0.008) {
        const now = Date.now();
        if (now - this.lastMonsterGroan > 6000) {
          this.audio.playMonsterBreath(dist);
          this.lastMonsterGroan = now;
        }
      }
    }
  }
}
