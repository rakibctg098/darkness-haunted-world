/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Character & Flashlight Customization Screen
 * Includes mandatory developer credit and clickable Telegram link
 */

export class CharacterCustomizer {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.el = document.getElementById('character-customizer-screen');
    this.config = {
      outfit: 'PATIENT_GREY',
      flashlightColor: '#ffeedd',
      flashlightStyle: 'WARM_HALOGEN',
      startingItem: 'STANDARD',
      enemyAggression: 'NORMAL'
    };

    this.bindEvents();
  }

  show() {
    if (this.el) this.el.style.display = 'flex';
  }

  hide() {
    if (this.el) this.el.style.display = 'none';
  }

  bindEvents() {
    const closeBtn = document.getElementById('btn-close-char-customizer');
    const applyBtn = document.getElementById('btn-apply-char-customizer');

    const outfitSelect = document.getElementById('char-outfit-select');
    const lightSelect = document.getElementById('char-flashlight-select');
    const itemSelect = document.getElementById('char-item-select');
    const aggrSelect = document.getElementById('char-aggr-select');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
        this.callbacks.onClose?.();
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        if (outfitSelect) this.config.outfit = outfitSelect.value;
        if (lightSelect) {
          this.config.flashlightStyle = lightSelect.value;
          if (lightSelect.value === 'LED_BLUE') this.config.flashlightColor = '#a8d5ff';
          else if (lightSelect.value === 'NIGHTVISION') this.config.flashlightColor = '#55ff77';
          else if (lightSelect.value === 'CRIMSON') this.config.flashlightColor = '#ff4444';
          else this.config.flashlightColor = '#ffeedd';
        }
        if (itemSelect) this.config.startingItem = itemSelect.value;
        if (aggrSelect) this.config.enemyAggression = aggrSelect.value;

        this.hide();
        this.callbacks.onApply?.(this.config);
      });
    }
  }
}
