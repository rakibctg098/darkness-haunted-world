/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Bilingual Main Menu Screen with 1-Tap Language & Brightness Mode Toggles
 * Developer: Made by Mohammad Rakib (https://t.me/appdevbyrakib)
 */

import { i18n } from './Localization.js';

export class MainMenu {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.el = document.getElementById('main-menu-screen');

    this.bindEvents();
    this.renderFooter();

    i18n.subscribe(() => this.updateTexts());
  }

  show() {
    this.updateTexts();
    if (this.el) this.el.style.display = 'flex';
  }

  hide() {
    if (this.el) this.el.style.display = 'none';
  }

  bindEvents() {
    const startBtn = document.getElementById('btn-start-game');
    const storyCreatorBtn = document.getElementById('btn-menu-story-creator');
    const charCustomizerBtn = document.getElementById('btn-menu-char-customizer');
    const settingsBtn = document.getElementById('btn-menu-settings');
    const aboutBtn = document.getElementById('btn-menu-about');
    const creditsBtn = document.getElementById('btn-menu-credits');
    const langToggleBtn = document.getElementById('btn-menu-lang-toggle');
    const brightnessToggleBtn = document.getElementById('btn-menu-brightness-toggle');

    if (startBtn) startBtn.addEventListener('click', () => this.callbacks.onStart?.());
    if (storyCreatorBtn) storyCreatorBtn.addEventListener('click', () => this.callbacks.onStoryCreator?.());
    if (charCustomizerBtn) charCustomizerBtn.addEventListener('click', () => this.callbacks.onCharCustomizer?.());
    if (settingsBtn) settingsBtn.addEventListener('click', () => this.callbacks.onSettings?.());
    if (aboutBtn) aboutBtn.addEventListener('click', () => this.callbacks.onAbout?.());
    if (creditsBtn) creditsBtn.addEventListener('click', () => this.callbacks.onCredits?.());

    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', () => {
        i18n.toggle();
      });
    }

    if (brightnessToggleBtn) {
      brightnessToggleBtn.addEventListener('click', () => {
        this.callbacks.onCycleBrightness?.();
        this.updateTexts();
      });
    }
  }

  updateTexts() {
    const isBn = i18n.getLang() === 'bn';

    const subtitleEl = document.getElementById('main-menu-subtitle');
    if (subtitleEl) subtitleEl.innerText = i18n.t('GAME_SUBTITLE');

    const startBtn = document.getElementById('btn-start-game');
    const storyCreatorBtn = document.getElementById('btn-menu-story-creator');
    const charCustomizerBtn = document.getElementById('btn-menu-char-customizer');
    const settingsBtn = document.getElementById('btn-menu-settings');
    const aboutBtn = document.getElementById('btn-menu-about');
    const creditsBtn = document.getElementById('btn-menu-credits');
    const langToggleBtn = document.getElementById('btn-menu-lang-toggle');
    const brightnessToggleBtn = document.getElementById('btn-menu-brightness-toggle');

    if (startBtn) startBtn.innerText = i18n.t('BTN_START');
    if (storyCreatorBtn) storyCreatorBtn.innerText = i18n.t('BTN_STORY_CREATOR');
    if (charCustomizerBtn) charCustomizerBtn.innerText = i18n.t('BTN_CHAR_CUSTOMIZER');
    if (settingsBtn) settingsBtn.innerText = i18n.t('BTN_SETTINGS');
    if (aboutBtn) aboutBtn.innerText = i18n.t('BTN_ABOUT');
    if (creditsBtn) creditsBtn.innerText = i18n.t('BTN_CREDITS');

    if (langToggleBtn) {
      langToggleBtn.innerText = isBn ? '🌐 বাংলা (EN পরিবর্তন)' : '🌐 English (বাংলা)';
    }

    if (brightnessToggleBtn) {
      const saved = localStorage.getItem('dhw_brightness') || 'NORMAL';
      if (saved === 'BRIGHT') {
        brightnessToggleBtn.innerText = isBn ? '💡 উজ্জ্বল দৃষ্টি (ক্লিয়ার)' : '💡 Bright Vision (Clear)';
      } else if (saved === 'DARK') {
        brightnessToggleBtn.innerText = isBn ? '💡 গাঢ় হরর অন্ধকার' : '💡 Hardcore Darkness';
      } else {
        brightnessToggleBtn.innerText = isBn ? '💡 হালকা ডার্ক (স্বাভাবিক)' : '💡 Light Dark (Normal)';
      }
    }
  }

  renderFooter() {
    const footerEl = document.getElementById('main-menu-footer');
    if (footerEl) {
      footerEl.innerHTML = `
        <div class="developer-credit-box">
          <p class="dev-author">Made by Mohammad Rakib</p>
          <p class="dev-channel">Telegram channel: <a href="https://t.me/appdevbyrakib" target="_blank" rel="noopener noreferrer">https://t.me/appdevbyrakib</a></p>
        </div>
      `;
    }
  }
}
