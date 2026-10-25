/**
 * DARKNESS: THE HAUNTED WORLD
 * Settings Screen & Controls Customization
 * Includes persistent developer credit section
 */

import { SaveSystem } from '../gameplay/SaveSystem.js';

export class SettingsMenu {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.el = document.getElementById('settings-screen');
    this.settings = SaveSystem.loadSettings();

    this.bindEvents();
    this.syncUI();
  }

  show() {
    this.syncUI();
    if (this.el) this.el.style.display = 'flex';
  }

  hide() {
    if (this.el) this.el.style.display = 'none';
  }

  syncUI() {
    const qSelect = document.getElementById('setting-graphics');
    const masterSlider = document.getElementById('setting-master-vol');
    const sfxSlider = document.getElementById('setting-sfx-vol');
    const sensSlider = document.getElementById('setting-sensitivity');
    const vibToggle = document.getElementById('setting-vibration');
    const flashToggle = document.getElementById('setting-reduced-flash');

    if (qSelect) qSelect.value = this.settings.graphicsQuality;
    if (masterSlider) masterSlider.value = Math.round(this.settings.masterVolume * 100);
    if (sfxSlider) sfxSlider.value = Math.round(this.settings.sfxVolume * 100);
    if (sensSlider) sensSlider.value = this.settings.touchSensitivity;
    if (vibToggle) vibToggle.checked = this.settings.vibrationEnabled;
    if (flashToggle) flashToggle.checked = this.settings.reducedFlashing;
  }

  bindEvents() {
    const closeBtn = document.getElementById('btn-close-settings');
    const resetBtn = document.getElementById('btn-reset-settings');

    const qSelect = document.getElementById('setting-graphics');
    const masterSlider = document.getElementById('setting-master-vol');
    const sfxSlider = document.getElementById('setting-sfx-vol');
    const sensSlider = document.getElementById('setting-sensitivity');
    const vibToggle = document.getElementById('setting-vibration');
    const flashToggle = document.getElementById('setting-reduced-flash');

    if (closeBtn) closeBtn.addEventListener('click', () => {
      this.hide();
      this.callbacks.onClose?.();
    });

    if (resetBtn) resetBtn.addEventListener('click', () => {
      this.settings = SaveSystem.resetSettings();
      this.syncUI();
      this.callbacks.onChange?.(this.settings);
    });

    if (qSelect) qSelect.addEventListener('change', (e) => {
      this.settings.graphicsQuality = e.target.value;
      SaveSystem.saveSettings(this.settings);
      this.callbacks.onChange?.(this.settings);
    });

    if (masterSlider) masterSlider.addEventListener('input', (e) => {
      this.settings.masterVolume = parseInt(e.target.value, 10) / 100;
      SaveSystem.saveSettings(this.settings);
      this.callbacks.onChange?.(this.settings);
    });

    if (sfxSlider) sfxSlider.addEventListener('input', (e) => {
      this.settings.sfxVolume = parseInt(e.target.value, 10) / 100;
      SaveSystem.saveSettings(this.settings);
      this.callbacks.onChange?.(this.settings);
    });

    if (sensSlider) sensSlider.addEventListener('input', (e) => {
      this.settings.touchSensitivity = parseFloat(e.target.value);
      SaveSystem.saveSettings(this.settings);
      this.callbacks.onChange?.(this.settings);
    });

    if (vibToggle) vibToggle.addEventListener('change', (e) => {
      this.settings.vibrationEnabled = e.target.checked;
      SaveSystem.saveSettings(this.settings);
      this.callbacks.onChange?.(this.settings);
    });

    if (flashToggle) flashToggle.addEventListener('change', (e) => {
      this.settings.reducedFlashing = e.target.checked;
      SaveSystem.saveSettings(this.settings);
      this.callbacks.onChange?.(this.settings);
    });
  }
}
