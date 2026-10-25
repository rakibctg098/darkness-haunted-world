/**
 * DARKNESS: THE HAUNTED WORLD
 * In-Game Pause Menu Screen
 */

export class PauseMenu {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.el = document.getElementById('pause-menu-screen');
    this.bindEvents();
  }

  show() {
    if (this.el) this.el.style.display = 'flex';
  }

  hide() {
    if (this.el) this.el.style.display = 'none';
  }

  bindEvents() {
    const resumeBtn = document.getElementById('btn-pause-resume');
    const restartBtn = document.getElementById('btn-pause-restart');
    const settingsBtn = document.getElementById('btn-pause-settings');
    const menuBtn = document.getElementById('btn-pause-mainmenu');

    if (resumeBtn) resumeBtn.addEventListener('click', () => this.callbacks.onResume?.());
    if (restartBtn) restartBtn.addEventListener('click', () => this.callbacks.onRestart?.());
    if (settingsBtn) settingsBtn.addEventListener('click', () => this.callbacks.onSettings?.());
    if (menuBtn) menuBtn.addEventListener('click', () => this.callbacks.onMainMenu?.());
  }
}
