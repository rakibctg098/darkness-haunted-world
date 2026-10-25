/**
 * DARKNESS: THE HAUNTED WORLD - Phase 2
 * First-Person Player Controller with Hiding System and Adrenaline
 */

import { CONFIG } from '../config.js';

export class Player {
  constructor(camera, collisionSystem, audioManager) {
    this.camera = camera;
    this.collision = collisionSystem;
    this.audio = audioManager;

    // Position and Orientation
    this.position = new THREE.Vector3(0, CONFIG.PLAYER.HEIGHT, 0);
    this.yaw = 0;
    this.pitch = 0;

    // Attributes
    this.health = CONFIG.PLAYER.MAX_HEALTH;
    this.stamina = CONFIG.PLAYER.MAX_STAMINA;
    this.battery = CONFIG.PLAYER.MAX_BATTERY;
    this.isDead = false;

    // Movement States
    this.isMoving = false;
    this.isSprinting = false;
    this.isCrouching = false;
    this.speed = CONFIG.PLAYER.WALK_SPEED;

    // Phase 2 Hiding System (Lockers / Closets)
    this.isHiding = false;
    this.hidingSpot = null;
    this.preHidingFlashlightState = true;

    // Phase 2 Adrenaline Boost
    this.adrenalineDuration = 0;

    // Flashlight
    this.flashlightOn = true;
    this.flashlight = null;
    this.flashlightTarget = null;
    this.flickerTimer = 0;
    this.isFlickering = false;

    // Head-bobbing & Step effects
    this.bobTimer = 0;
    this.bobAmount = 0.045;

    this.setupFlashlight();
  }

  setupFlashlight() {
    this.flashlight = new THREE.SpotLight(0xffeedd, CONFIG.PLAYER.FLASHLIGHT_INTENSITY);
    this.flashlight.angle = CONFIG.PLAYER.FLASHLIGHT_ANGLE;
    this.flashlight.penumbra = CONFIG.PLAYER.FLASHLIGHT_PENUMBRA;
    this.flashlight.distance = CONFIG.PLAYER.FLASHLIGHT_DISTANCE;
    this.flashlight.decay = 1.6;
    this.flashlight.castShadow = true;

    this.flashlightTarget = new THREE.Object3D();
    this.flashlight.target = this.flashlightTarget;

    this.camera.add(this.flashlight);
    this.camera.add(this.flashlightTarget);
    this.flashlightTarget.position.set(0, 0, -5);
    this.flashlight.position.set(0.18, -0.15, 0.1);
  }

  enterHiding(spot) {
    this.isHiding = true;
    this.hidingSpot = spot;
    this.preHidingFlashlightState = this.flashlightOn;
    // Turn off flashlight while hiding for stealth
    this.flashlightOn = false;
    if (this.flashlight) this.flashlight.visible = false;

    // Move player inside locker
    this.position.set(spot.position.x, CONFIG.PLAYER.HEIGHT * 0.9, spot.position.z);
    this.yaw = spot.facingAngle || 0;
    this.pitch = 0;

    if (this.audio) this.audio.playDoorCreak();
  }

  exitHiding() {
    if (!this.isHiding) return;
    this.isHiding = false;

    // Step out in front of the hiding spot
    if (this.hidingSpot) {
      const exitDirX = Math.sin(this.hidingSpot.facingAngle || 0);
      const exitDirZ = Math.cos(this.hidingSpot.facingAngle || 0);
      this.position.x = this.hidingSpot.position.x + exitDirX * 1.0;
      this.position.z = this.hidingSpot.position.z + exitDirZ * 1.0;
    }
    this.hidingSpot = null;

    // Restore previous flashlight state if battery remains
    if (this.preHidingFlashlightState && this.battery > 5) {
      this.flashlightOn = true;
      if (this.flashlight) this.flashlight.visible = true;
    }

    if (this.audio) this.audio.playDoorCreak();
  }

  heal(amount = 35) {
    this.health = Math.min(CONFIG.PLAYER.MAX_HEALTH, this.health + amount);
  }

  injectAdrenaline(durationSec = 10) {
    this.heal(30);
    this.adrenalineDuration = durationSec;
    this.stamina = CONFIG.PLAYER.MAX_STAMINA;
  }

  toggleFlashlight() {
    if (this.isDead || this.isHiding) return;
    if (this.battery <= 0 && !this.flashlightOn) {
      if (this.audio) this.audio.playFlashlightClick();
      return;
    }
    this.flashlightOn = !this.flashlightOn;
    this.flashlight.visible = this.flashlightOn;
    if (this.audio) this.audio.playFlashlightClick();
  }

  addBattery(amount = 45) {
    this.battery = Math.min(CONFIG.PLAYER.MAX_BATTERY, this.battery + amount);
    if (!this.flashlightOn && !this.isHiding && this.battery > 5) {
      this.flashlightOn = true;
      this.flashlight.visible = true;
    }
  }

  takeDamage(amount) {
    if (this.isDead) return;
    this.health = Math.max(0, this.health - amount);
    if (this.audio) this.audio.playJumpscareStinger();
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.isHiding = false;
    this.flashlightOn = false;
    if (this.flashlight) this.flashlight.visible = false;
    if (this.audio) this.audio.playDeathSound();
  }

  reset(spawnX = 0, spawnZ = 0) {
    this.position.set(spawnX, CONFIG.PLAYER.HEIGHT, spawnZ);
    this.yaw = 0;
    this.pitch = 0;
    this.health = CONFIG.PLAYER.MAX_HEALTH;
    this.stamina = CONFIG.PLAYER.MAX_STAMINA;
    this.battery = CONFIG.PLAYER.MAX_BATTERY;
    this.isDead = false;
    this.isHiding = false;
    this.hidingSpot = null;
    this.adrenalineDuration = 0;
    this.flashlightOn = true;
    if (this.flashlight) this.flashlight.visible = true;
  }

  update(delta, controls) {
    if (this.isDead) return;

    // Update Adrenaline speed boost
    if (this.adrenalineDuration > 0) {
      this.adrenalineDuration = Math.max(0, this.adrenalineDuration - delta);
      this.stamina = CONFIG.PLAYER.MAX_STAMINA; // Infinite stamina during adrenaline
    }

    // 1. Look rotation from controls
    const look = controls.consumeLookDeltas();
    if (this.isHiding) {
      // Clamped look peek through locker grating (-45 deg to +45 deg)
      const baseFacing = this.hidingSpot ? (this.hidingSpot.facingAngle || 0) : 0;
      this.yaw = Math.max(baseFacing - 0.7, Math.min(baseFacing + 0.7, this.yaw + look.yaw * 0.7));
      this.pitch = Math.max(-0.4, Math.min(0.4, this.pitch + look.pitch * 0.7));
    } else {
      this.yaw += look.yaw;
      this.pitch = Math.max(-1.35, Math.min(1.35, this.pitch + look.pitch));
    }

    // If hiding, movement is locked
    if (this.isHiding) {
      this.isMoving = false;
      this.camera.position.set(this.position.x, this.position.y, this.position.z);
      this.camera.rotation.set(0, 0, 0);
      this.camera.rotation.y = this.yaw;
      this.camera.rotation.x = this.pitch;
      return;
    }

    // 2. Sprint / Crouch determination
    this.isCrouching = controls.isCrouching;
    const wantsSprint = controls.isSprinting && !this.isCrouching && (this.stamina > 10 || this.adrenalineDuration > 0);
    this.isSprinting = wantsSprint;

    const baseSprintSpeed = this.adrenalineDuration > 0 ? CONFIG.PLAYER.SPRINT_SPEED * 1.25 : CONFIG.PLAYER.SPRINT_SPEED;

    if (this.isSprinting && (controls.moveForward !== 0 || controls.moveRight !== 0)) {
      this.speed = baseSprintSpeed;
      if (this.adrenalineDuration <= 0) {
        this.stamina = Math.max(0, this.stamina - CONFIG.PLAYER.STAMINA_DRAIN_RATE * delta);
      }
    } else if (this.isCrouching) {
      this.speed = CONFIG.PLAYER.CROUCH_SPEED;
      this.stamina = Math.min(CONFIG.PLAYER.MAX_STAMINA, this.stamina + CONFIG.PLAYER.STAMINA_RECOVER_RATE * 0.8 * delta);
    } else {
      this.speed = CONFIG.PLAYER.WALK_SPEED;
      this.stamina = Math.min(CONFIG.PLAYER.MAX_STAMINA, this.stamina + CONFIG.PLAYER.STAMINA_RECOVER_RATE * delta);
    }

    // 3. Movement vector in camera space
    const forwardX = -Math.sin(this.yaw);
    const forwardZ = -Math.cos(this.yaw);
    const rightX = Math.cos(this.yaw);
    const rightZ = -Math.sin(this.yaw);

    const moveX = (forwardX * controls.moveForward + rightX * controls.moveRight);
    const moveZ = (forwardZ * controls.moveForward + rightZ * controls.moveRight);
    const len = Math.hypot(moveX, moveZ);

    if (len > 0.05) {
      this.isMoving = true;
      const normX = moveX / len;
      const normZ = moveZ / len;
      const desiredPos = new THREE.Vector3(
        this.position.x + normX * this.speed * delta,
        this.position.y,
        this.position.z + normZ * this.speed * delta
      );

      // Slide collision check
      const resolved = this.collision.resolvePosition(this.position, desiredPos, CONFIG.PLAYER.RADIUS);
      this.position.x = resolved.x;
      this.position.z = resolved.z;

      // Head bobbing
      const bobFreq = this.isSprinting ? 14 : 9;
      this.bobTimer += delta * bobFreq;
    } else {
      this.isMoving = false;
      this.bobTimer = 0;
    }

    // 4. Height (standing vs crouching) + subtle bobbing
    const targetHeight = this.isCrouching ? CONFIG.PLAYER.CROUCH_HEIGHT : CONFIG.PLAYER.HEIGHT;
    const bobOffset = this.isMoving ? Math.sin(this.bobTimer) * this.bobAmount : 0;
    this.position.y += (targetHeight - this.position.y) * 10 * delta;

    this.camera.position.set(
      this.position.x,
      this.position.y + bobOffset,
      this.position.z
    );

    // Apply rotation order YXZ
    this.camera.rotation.set(0, 0, 0);
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;

    // 5. Battery Drain and Flicker
    if (this.flashlightOn) {
      this.battery = Math.max(0, this.battery - CONFIG.PLAYER.BATTERY_DRAIN_RATE * delta);
      if (this.battery <= 0) {
        this.flashlightOn = false;
        this.flashlight.visible = false;
      } else if (this.battery < 20) {
        // Low battery random flickering
        this.flickerTimer -= delta;
        if (this.flickerTimer <= 0) {
          this.isFlickering = !this.isFlickering;
          this.flashlight.intensity = this.isFlickering ? 0.3 : CONFIG.PLAYER.FLASHLIGHT_INTENSITY;
          this.flickerTimer = 0.08 + Math.random() * 0.15;
        }
      } else {
        this.flashlight.intensity = CONFIG.PLAYER.FLASHLIGHT_INTENSITY;
      }
    }
  }
}
