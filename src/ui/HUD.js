/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Bilingual In-Game HUD: Health, Stamina, Battery, Objectives, Prompts,
 * Live Brightness Toggle ('হালকা ডার্ক' / 'উজ্জ্বল' / 'গাঢ়'), and 1-Tap Language Switcher
 */

import { i18n } from './Localization.js';

export class HUD {
  constructor(lighting = null) {
    this.lighting = lighting;

    this.healthBar = document.getElementById('hud-health-fill');
    this.staminaBar = document.getElementById('hud-stamina-fill');
    this.batteryBar = document.getElementById('hud-battery-fill');
    this.objectiveTitle = document.getElementById('hud-obj-title');
    this.objectiveDesc = document.getElementById('hud-obj-desc');
    this.interactPrompt = document.getElementById('hud-interact-prompt');
    this.dangerVignette = document.getElementById('danger-vignette');
    this.scareOverlay = document.getElementById('scare-overlay');
    this.notificationBox = document.getElementById('hud-notification');
    this.lockerSlits = document.getElementById('locker-slits-overlay');

    this.langToggleBtn = document.getElementById('btn-hud-lang-toggle');
    this.brightnessToggleBtn = document.getElementById('btn-hud-brightness-toggle');

    this.labelHp = document.getElementById('hud-label-hp');
    this.labelSta = document.getElementById('hud-label-sta');
    this.labelBat = document.getElementById('hud-label-bat');

    this.btnFlashlight = document.getElementById('btn-action-flashlight');
    this.btnSprint = document.getElementById('btn-action-sprint');
    this.btnCrouch = document.getElementById('btn-action-crouch');
    this.btnInteract = document.getElementById('btn-action-interact');

    this.notificationTimeout = null;

    this.bindControls();
    i18n.subscribe(() => this.updateStaticLabels());
    this.updateBrightnessButtonLabel();
  }

  setLighting(lighting) {
    this.lighting = lighting;
    this.updateBrightnessButtonLabel();
  }

  bindControls() {
    if (this.langToggleBtn) {
      this.langToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        i18n.toggle();
      });
    }

    if (this.brightnessToggleBtn) {
      this.brightnessToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.lighting) {
          this.lighting.cycleBrightnessPreset();
          this.updateBrightnessButtonLabel();
          const modeName = this.getBrightnessLabel();
          this.showNotification(`💡 ${modeName}`, 1800);
        }
      });
    }
  }

  getBrightnessLabel() {
    const isBn = i18n.getLang() === 'bn';
    const preset = this.lighting ? this.lighting.currentPreset : 'NORMAL';
    if (preset === 'BRIGHT') {
      return isBn ? 'উজ্জ্বল দৃষ্টি' : 'Bright Vision';
    } else if (preset === 'DARK') {
      return isBn ? 'গাঢ় অন্ধকার' : 'Original Dark';
    } else {
      return isBn ? 'হালকা ডার্ক (স্বাভাবিক)' : 'Light Dark (Normal)';
    }
  }

  updateBrightnessButtonLabel() {
    if (!this.brightnessToggleBtn) return;
    const isBn = i18n.getLang() === 'bn';
    const preset = this.lighting ? this.lighting.currentPreset : 'NORMAL';
    if (preset === 'BRIGHT') {
      this.brightnessToggleBtn.innerText = isBn ? '💡 উজ্জ্বল' : '💡 Bright';
    } else if (preset === 'DARK') {
      this.brightnessToggleBtn.innerText = isBn ? '💡 গাঢ়' : '💡 Dark';
    } else {
      this.brightnessToggleBtn.innerText = isBn ? '💡 হালকা ডার্ক' : '💡 Normal Light';
    }
  }

  updateStaticLabels() {
    const isBn = i18n.getLang() === 'bn';

    if (this.langToggleBtn) {
      this.langToggleBtn.innerText = isBn ? '🌐 বাংলা' : '🌐 English';
    }

    if (this.labelHp) this.labelHp.innerText = i18n.t('HUD_HP');
    if (this.labelSta) this.labelSta.innerText = i18n.t('HUD_STA');
    if (this.labelBat) this.labelBat.innerText = i18n.t('HUD_BAT');

    if (this.btnFlashlight) this.btnFlashlight.innerText = i18n.t('HUD_BTN_FLASHLIGHT');
    if (this.btnSprint) this.btnSprint.innerText = i18n.t('HUD_BTN_SPRINT');
    if (this.btnCrouch) this.btnCrouch.innerText = i18n.t('HUD_BTN_CROUCH');
    if (this.btnInteract) this.btnInteract.innerText = i18n.t('HUD_BTN_INTERACT');

    this.updateBrightnessButtonLabel();
  }

  update(player, objective, focusedInteractable, distToEnemy = 999) {
    // Health fill
    if (this.healthBar) {
      const hpPercent = Math.max(0, Math.min(100, (player.health / 100) * 100));
      this.healthBar.style.width = `${hpPercent}%`;
    }

    // Stamina fill
    if (this.staminaBar) {
      const staPercent = Math.max(0, Math.min(100, (player.stamina / 100) * 100));
      this.staminaBar.style.width = `${staPercent}%`;
      this.staminaBar.style.backgroundColor = player.adrenalineDuration > 0 ? '#00ffcc' : '#22c55e';
    }

    // Battery fill
    if (this.batteryBar) {
      const batPercent = Math.max(0, Math.min(100, (player.battery / 100) * 100));
      this.batteryBar.style.width = `${batPercent}%`;
      this.batteryBar.style.backgroundColor = player.battery < 20 ? '#ff3333' : '#eab308';
    }

    // Objective text
    if (this.objectiveTitle && objective) {
      this.objectiveTitle.innerText = objective.title;
      if (this.objectiveDesc) {
        this.objectiveDesc.innerText = objective.desc;
      }
    }

    // Locker Slits Overlay
    if (this.lockerSlits) {
      this.lockerSlits.style.display = player.isHiding ? 'block' : 'none';
    }

    // Interaction Prompt
    if (this.interactPrompt) {
      if (player.isHiding) {
        this.interactPrompt.innerText = i18n.t('HUD_LOCKER_EXIT');
        this.interactPrompt.style.display = 'block';
        this.interactPrompt.style.borderColor = '#00ffcc';
        this.interactPrompt.style.color = '#00ffcc';
      } else if (focusedInteractable) {
        this.interactPrompt.innerText = focusedInteractable.prompt || i18n.t('HUD_INTERACT_DEFAULT');
        this.interactPrompt.style.display = 'block';
        this.interactPrompt.style.borderColor = '#ffd700';
        this.interactPrompt.style.color = '#ffd700';
      } else {
        this.interactPrompt.style.display = 'none';
      }
    }

    // Danger Vignette
    if (this.dangerVignette) {
      if (distToEnemy < 16 || player.health < 40) {
        const factor = Math.max(0, Math.min(1, (16 - distToEnemy) / 16));
        const opacity = Math.max(0.2, factor * 0.85);
        this.dangerVignette.style.opacity = opacity;
      } else {
        this.dangerVignette.style.opacity = '0';
      }
    }
  }

  showNotification(text, durationMs = 3800) {
    if (!this.notificationBox) return;
    this.notificationBox.innerText = text;
    this.notificationBox.style.display = 'block';
    this.notificationBox.style.opacity = '1';

    if (this.notificationTimeout) clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => {
      this.notificationBox.style.opacity = '0';
      setTimeout(() => {
        this.notificationBox.style.display = 'none';
      }, 400);
    }, durationMs);
  }

  showScareFlash(text = '') {
    if (!this.scareOverlay) return;
    this.scareOverlay.style.display = 'flex';
    this.scareOverlay.style.opacity = '1';
    const msgEl = document.getElementById('scare-message');
    if (msgEl) msgEl.innerText = text;

    setTimeout(() => {
      this.scareOverlay.style.opacity = '0';
      setTimeout(() => {
        this.scareOverlay.style.display = 'none';
      }, 500);
    }, 700);
  }
}
