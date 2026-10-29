/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Horror Soundscape coordinator with Ghostly Weeping and Cemetery Ambience
 */

export class HorrorSoundscape {
  constructor(audioManager) {
    this.audio = audioManager;
    this.footstepTimer = 0;
    this.lastMonsterGroan = 0;
    this.lastWeepingTime = Date.now();
    this.weepingIntervalMs = 18000; // Plays every ~18-25 seconds
    this.enableWeeping = true;
    this.isGraveyard = false;
  }

  setWeepingEnabled(enabled) {
    this.enableWeeping = enabled;
  }

  setGraveyardMode(isGraveyard) {
    this.isGraveyard = isGraveyard;
  }

  update(delta, player, enemy) {
    if (!this.audio || !this.audio.isInitialized) return;

    // 1. Footstep pacing
    const isMoving = player.isMoving;
    if (isMoving) {
      this.footstepTimer -= delta;
      const stepInterval = player.isSprinting ? 0.30 : (player.isCrouching ? 0.65 : 0.48);
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

      if (dist < 15 && Math.random() < 0.01) {
        const now = Date.now();
        if (now - this.lastMonsterGroan > 5000) {
          this.audio.playMonsterBreath(dist);
          this.lastMonsterGroan = now;
        }
      }
    }

    // 3. Periodic Haunting Ghost Weeping / Crying in the dark (কান্নার আওয়াজ)
    const now = Date.now();
    if (this.enableWeeping && (now - this.lastWeepingTime > this.weepingIntervalMs)) {
      this.audio.playGhostlyWeeping();
      this.lastWeepingTime = now;
      this.weepingIntervalMs = 16000 + Math.random() * 12000; // 16 to 28 sec interval
    }

    // 4. Distant Graveyard Thunder
    if (this.isGraveyard && Math.random() < 0.001) {
      this.audio.playThunderCrack();
    }
  }
}
