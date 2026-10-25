/**
 * DARKNESS: THE HAUNTED WORLD
 * First-Person Player Controller
 * Camera, Flashlight, Health, Stamina, Battery, and Head-bobbing
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
    // Spotlight attached to camera view
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

  toggleFlashlight() {
    if (this.isDead) return;
    if (this.battery <= 0 && !this.flashlightOn) {
      // Cannot turn on dead battery
      if (this.audio) this.audio.playFlashlightClick();
      return;
    }
    this.flashlightOn = !this.flashlightOn;
    this.flashlight.visible = this.flashlightOn;
    if (this.audio) this.audio.playFlashlightClick();
  }

  addBattery(amount = 45) {
    this.battery = Math.min(CONFIG.PLAYER.MAX_BATTERY, this.battery + amount);
    if (!this.flashlightOn && this.battery > 5) {
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
    this.flashlightOn = true;
    if (this.flashlight) this.flashlight.visible = true;
  }

  update(delta, controls) {
    if (this.isDead) return;

    // 1. Look rotation from controls
    const look = controls.consumeLookDeltas();
    this.yaw += look.yaw;
    this.pitch = Math.max(-1.35, Math.min(1.35, this.pitch + look.pitch));

    // 2. Sprint / Crouch determination
    this.isCrouching = controls.isCrouching;
    const wantsSprint = controls.isSprinting && !this.isCrouching && this.stamina > 10;
    this.isSprinting = wantsSprint;

    if (this.isSprinting && (controls.moveForward !== 0 || controls.moveRight !== 0)) {
      this.speed = CONFIG.PLAYER.SPRINT_SPEED;
      this.stamina = Math.max(0, this.stamina - CONFIG.PLAYER.STAMINA_DRAIN_RATE * delta);
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
