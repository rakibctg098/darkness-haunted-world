/**
 * DARKNESS: THE HAUNTED WORLD
 * Game Credits Screen
 */

export class CreditsScreen {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.el = document.getElementById('credits-screen');
    this.bindEvents();
  }

  show() {
    if (this.el) this.el.style.display = 'flex';
  }

  hide() {
    if (this.el) this.el.style.display = 'none';
  }

  bindEvents() {
    const closeBtn = document.getElementById('btn-close-credits');
    if (closeBtn) closeBtn.addEventListener('click', () => {
      this.hide();
      this.callbacks.onClose?.();
    });
  }
}
