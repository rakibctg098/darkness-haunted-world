/**
 * DARKNESS: THE HAUNTED WORLD
 * Main Menu Screen
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
    const levelBtn = document.getElementById('btn-level-select');
    const settingsBtn = document.getElementById('btn-menu-settings');
    const aboutBtn = document.getElementById('btn-menu-about');
    const creditsBtn = document.getElementById('btn-menu-credits');

    if (startBtn) startBtn.addEventListener('click', () => this.callbacks.onStart?.());
    if (levelBtn) levelBtn.addEventListener('click', () => this.callbacks.onLevelSelect?.());
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
