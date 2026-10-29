/**
 * DARKNESS: THE HAUNTED WORLD
 * Bilingual About Screen
 * Developer: Made by Mohammad Rakib (https://t.me/appdevbyrakib)
 */

import { i18n } from './Localization.js';

export class AboutScreen {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.el = document.getElementById('about-screen');
    this.bindEvents();

    i18n.subscribe(() => this.updateTexts());
  }

  show() {
    this.updateTexts();
    if (this.el) this.el.style.display = 'flex';
  }

  hide() {
    if (this.el) this.el.style.display = 'none';
  }

  updateTexts() {
    const titleEl = document.getElementById('about-title-heading');
    if (titleEl) titleEl.innerText = i18n.t('ABOUT_TITLE');

    const descEl = document.getElementById('about-desc-text');
    if (descEl) descEl.innerText = i18n.t('ABOUT_TEXT');

    const ctrlEl = document.getElementById('about-ctrl-text');
    if (ctrlEl) ctrlEl.innerText = i18n.t('ABOUT_CONTROLS');

    const backBtn = document.getElementById('btn-close-about');
    if (backBtn) backBtn.innerText = i18n.t('BTN_BACK');
  }

  bindEvents() {
    const closeBtn = document.getElementById('btn-close-about');
    if (closeBtn) closeBtn.addEventListener('click', () => {
      this.hide();
      this.callbacks.onClose?.();
    });
  }
}
