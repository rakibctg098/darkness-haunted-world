/**
 * DARKNESS: THE HAUNTED WORLD
 * Touch & Desktop Input Controls
 * Features: Dual-zone touch (dynamic left joystick + right look drag) + Keyboard/Mouse support
 */

import { CONFIG } from '../config.js';

export class Controls {
  constructor(domElement, options = {}) {
    this.domElement = domElement || document.body;
    this.sensitivity = options.sensitivity || CONFIG.DEFAULT_SETTINGS.touchSensitivity;

    // Movement vectors (-1 to 1)
    this.moveForward = 0;
    this.moveRight = 0;
    this.isSprinting = false;
    this.isCrouching = false;
    this.interactPressed = false;
    this.flashlightTogglePressed = false;
    this.pausePressed = false;

    // Look rotation deltas
    this.lookDeltaYaw = 0;
    this.lookDeltaPitch = 0;

    // Internal touch tracking
    this.activeTouches = new Map();
    this.joystickTouchId = null;
    this.lookTouchId = null;
    this.joystickOrigin = { x: 0, y: 0 };
    this.joystickCurrent = { x: 0, y: 0 };
    this.joystickRadius = 55;

    // Keyboard states
    this.keys = {};

    this.bindEvents();
  }

  bindEvents() {
    // --- Touch Handlers ---
    const el = this.domElement;

    el.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    el.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    el.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
    el.addEventListener('touchcancel', (e) => this.onTouchEnd(e), { passive: false });

    // --- Keyboard Handlers ---
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'KeyF') this.flashlightTogglePressed = true;
      if (e.code === 'KeyE') this.interactPressed = true;
      if (e.code === 'KeyP' || e.code === 'Escape') this.pausePressed = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.isSprinting = true;
      if (e.code === 'KeyC' || e.code === 'ControlLeft') this.isCrouching = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.isSprinting = false;
      if (e.code === 'KeyC' || e.code === 'ControlLeft') this.isCrouching = false;
    });

    // --- Desktop Mouse Look ---
    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === this.domElement || document.pointerLockElement === document.body) {
        this.lookDeltaYaw -= e.movementX * 0.0022 * this.sensitivity;
        this.lookDeltaPitch -= e.movementY * 0.0022 * this.sensitivity;
      }
    });
  }

  onTouchStart(e) {
    const halfWidth = window.innerWidth / 2;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      // Skip if tapping an interactive UI element
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.closest('.ui-interactive')) continue;

      if (touch.clientX < halfWidth && this.joystickTouchId === null) {
        // Left side: Joystick
        this.joystickTouchId = touch.identifier;
        this.joystickOrigin = { x: touch.clientX, y: touch.clientY };
        this.joystickCurrent = { x: touch.clientX, y: touch.clientY };
        this.updateJoystickUI(true);
      } else if (touch.clientX >= halfWidth && this.lookTouchId === null) {
        // Right side: Camera Look
        this.lookTouchId = touch.identifier;
        this.activeTouches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
      }
    }
  }

  onTouchMove(e) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      if (touch.identifier === this.joystickTouchId) {
        this.joystickCurrent = { x: touch.clientX, y: touch.clientY };
        const dx = this.joystickCurrent.x - this.joystickOrigin.x;
        const dy = this.joystickCurrent.y - this.joystickOrigin.y;
        const dist = Math.hypot(dx, dy);
        const clampedDist = Math.min(dist, this.joystickRadius);
        const angle = Math.atan2(dy, dx);

        const nx = Math.cos(angle) * (clampedDist / this.joystickRadius);
        const ny = Math.sin(angle) * (clampedDist / this.joystickRadius);

        this.moveRight = nx;
        this.moveForward = -ny; // Up is forward
        this.updateJoystickKnob(Math.cos(angle) * clampedDist, Math.sin(angle) * clampedDist);
      } else if (touch.identifier === this.lookTouchId) {
        const last = this.activeTouches.get(touch.identifier);
        if (last) {
          const dx = touch.clientX - last.x;
          const dy = touch.clientY - last.y;
          this.lookDeltaYaw -= dx * 0.0035 * this.sensitivity;
          this.lookDeltaPitch -= dy * 0.0035 * this.sensitivity;
          this.activeTouches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
        }
      }
    }
  }

  onTouchEnd(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === this.joystickTouchId) {
        this.joystickTouchId = null;
        this.moveForward = 0;
        this.moveRight = 0;
        this.updateJoystickUI(false);
      }
      if (touch.identifier === this.lookTouchId) {
        this.lookTouchId = null;
        this.activeTouches.delete(touch.identifier);
      }
    }
  }

  updateJoystickUI(active) {
    const base = document.getElementById('joystick-base');
    const knob = document.getElementById('joystick-knob');
    if (!base || !knob) return;
    if (active) {
      base.style.display = 'block';
      base.style.left = `${this.joystickOrigin.x - 45}px`;
      base.style.top = `${this.joystickOrigin.y - 45}px`;
      knob.style.transform = 'translate(0px, 0px)';
    } else {
      base.style.display = 'none';
    }
  }

  updateJoystickKnob(dx, dy) {
    const knob = document.getElementById('joystick-knob');
    if (knob) {
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  }

  update() {
    // Keyboard overrides if keys are pressed
    let kForward = 0;
    let kRight = 0;
    if (this.keys['KeyW'] || this.keys['ArrowUp']) kForward += 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) kForward -= 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) kRight -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) kRight += 1;

    if (kForward !== 0 || kRight !== 0) {
      this.moveForward = kForward;
      this.moveRight = kRight;
    }
  }

  consumeLookDeltas() {
    const yaw = this.lookDeltaYaw;
    const pitch = this.lookDeltaPitch;
    this.lookDeltaYaw = 0;
    this.lookDeltaPitch = 0;
    return { yaw, pitch };
  }
}
