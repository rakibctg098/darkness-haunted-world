/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Main Menu Screen with Story Creator and Character Customizer Triggers
 */

import { CONFIG } from '../config.js';

export class MainMenu {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.el = document.getElementById('main-menu-screen');
    this.bindEvents();
    this.renderFooter();
  }

  show() {
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

    if (startBtn) startBtn.addEventListener('click', () => this.callbacks.onStart?.());
    if (storyCreatorBtn) storyCreatorBtn.addEventListener('click', () => this.callbacks.onStoryCreator?.());
    if (charCustomizerBtn) charCustomizerBtn.addEventListener('click', () => this.callbacks.onCharCustomizer?.());
    if (settingsBtn) settingsBtn.addEventListener('click', () => this.callbacks.onSettings?.());
    if (aboutBtn) aboutBtn.addEventListener('click', () => this.callbacks.onAbout?.());
    if (creditsBtn) creditsBtn.addEventListener('click', () => this.callbacks.onCredits?.());
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
