/**
 * DARKNESS: THE HAUNTED WORLD
 * In-Game HUD: Health, Stamina, Battery, Objectives, Prompts and Horror Vignettes
 */

export class HUD {
  constructor() {
    this.healthBar = document.getElementById('hud-health-fill');
    this.staminaBar = document.getElementById('hud-stamina-fill');
    this.batteryBar = document.getElementById('hud-battery-fill');
    this.objectiveTitle = document.getElementById('hud-obj-title');
    this.objectiveDesc = document.getElementById('hud-obj-desc');
    this.interactPrompt = document.getElementById('hud-interact-prompt');
    this.dangerVignette = document.getElementById('danger-vignette');
    this.scareOverlay = document.getElementById('scare-overlay');
    this.notificationBox = document.getElementById('hud-notification');

    this.notificationTimeout = null;
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
    }

    // Battery fill
    if (this.batteryBar) {
      const batPercent = Math.max(0, Math.min(100, (player.battery / 100) * 100));
      this.batteryBar.style.width = `${batPercent}%`;
      this.batteryBar.style.backgroundColor = player.battery < 20 ? '#ff3333' : '#e6b800';
    }

    // Objective text
    if (this.objectiveTitle && objective) {
      this.objectiveTitle.innerText = objective.title;
      if (this.objectiveDesc) {
        this.objectiveDesc.innerText = objective.desc;
      }
    }

    // Interaction Prompt
    if (this.interactPrompt) {
      if (focusedInteractable) {
        this.interactPrompt.innerText = focusedInteractable.prompt || 'Interact [TAP]';
        this.interactPrompt.style.display = 'block';
      } else {
        this.interactPrompt.style.display = 'none';
      }
    }

    // Danger Vignette (Pulsing red screen border when near enemy or low HP)
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
