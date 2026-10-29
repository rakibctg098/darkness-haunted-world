/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Bilingual Settings Menu: Graphics, Sound, Sensitivity, Language, and Brightness Mode
 * Developer: Made by Mohammad Rakib (https://t.me/appdevbyrakib)
 */

import { SaveSystem } from '../gameplay/SaveSystem.js';
import { i18n } from './Localization.js';

export class SettingsMenu {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.el = document.getElementById('settings-screen');
    this.settings = SaveSystem.loadSettings();

    this.bindEvents();
    this.syncUI();

    i18n.subscribe(() => {
      this.updateLanguageTexts();
      this.syncUI();
    });
  }

  show() {
    this.syncUI();
    this.updateLanguageTexts();
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
    const langSelect = document.getElementById('setting-language');
    const brightSelect = document.getElementById('setting-brightness');

    if (qSelect) qSelect.value = this.settings.graphicsQuality || 'MEDIUM';
    if (masterSlider) masterSlider.value = Math.round((this.settings.masterVolume ?? 0.85) * 100);
    if (sfxSlider) sfxSlider.value = Math.round((this.settings.sfxVolume ?? 0.9) * 100);
    if (sensSlider) sensSlider.value = this.settings.touchSensitivity || 1.2;
    if (vibToggle) vibToggle.checked = this.settings.vibrationEnabled ?? true;
    if (flashToggle) flashToggle.checked = this.settings.reducedFlashing ?? false;

    if (langSelect) langSelect.value = i18n.getLang();
    if (brightSelect) {
      brightSelect.value = localStorage.getItem('dhw_brightness') || 'NORMAL';
    }
  }

  updateLanguageTexts() {
    const titleEl = document.getElementById('settings-title-heading');
    if (titleEl) titleEl.innerText = i18n.t('SETTINGS_TITLE');

    const labelLang = document.getElementById('label-setting-lang');
    if (labelLang) labelLang.innerText = i18n.t('SETTINGS_LANG');

    const labelBright = document.getElementById('label-setting-brightness');
    if (labelBright) labelBright.innerText = i18n.t('SETTINGS_BRIGHTNESS');

    const optNorm = document.getElementById('opt-bright-normal');
    if (optNorm) optNorm.innerText = i18n.t('BRIGHT_NORMAL');
    const optHigh = document.getElementById('opt-bright-high');
    if (optHigh) optHigh.innerText = i18n.t('BRIGHT_HIGH');
    const optDark = document.getElementById('opt-bright-dark');
    if (optDark) optDark.innerText = i18n.t('BRIGHT_DARK');

    const labelGfx = document.getElementById('label-setting-graphics');
    if (labelGfx) labelGfx.innerText = i18n.t('SETTINGS_GRAPHICS');

    const labelVol = document.getElementById('label-setting-master-vol');
    if (labelVol) labelVol.innerText = i18n.t('SETTINGS_MASTER_VOL');

    const labelSfx = document.getElementById('label-setting-sfx-vol');
    if (labelSfx) labelSfx.innerText = i18n.t('SETTINGS_SFX_VOL');

    const labelSens = document.getElementById('label-setting-sensitivity');
    if (labelSens) labelSens.innerText = i18n.t('SETTINGS_SENSITIVITY');

    const labelVib = document.getElementById('label-setting-vibration');
    if (labelVib) labelVib.innerText = i18n.t('SETTINGS_VIBRATION');

    const labelFlash = document.getElementById('label-setting-reduced-flash');
    if (labelFlash) labelFlash.innerText = i18n.t('SETTINGS_REDUCED_FLASH');

    const resetBtn = document.getElementById('btn-reset-settings');
    if (resetBtn) resetBtn.innerText = i18n.t('BTN_RESET');

    const closeBtn = document.getElementById('btn-close-settings');
    if (closeBtn) closeBtn.innerText = i18n.t('BTN_CLOSE');
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
    const langSelect = document.getElementById('setting-language');
    const brightSelect = document.getElementById('setting-brightness');

    if (closeBtn) closeBtn.addEventListener('click', () => {
      this.hide();
      this.callbacks.onClose?.();
    });

    if (resetBtn) resetBtn.addEventListener('click', () => {
      this.settings = SaveSystem.resetSettings();
      localStorage.setItem('dhw_brightness', 'NORMAL');
      i18n.setLang('bn');
      this.syncUI();
      this.callbacks.onChange?.(this.settings);
      this.callbacks.onBrightnessChange?.('NORMAL');
    });

    if (langSelect) langSelect.addEventListener('change', (e) => {
      i18n.setLang(e.target.value);
    });

    if (brightSelect) brightSelect.addEventListener('change', (e) => {
      const preset = e.target.value;
      localStorage.setItem('dhw_brightness', preset);
      this.callbacks.onBrightnessChange?.(preset);
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
