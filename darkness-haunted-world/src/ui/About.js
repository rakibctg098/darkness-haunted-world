/**
 * DARKNESS: THE HAUNTED WORLD
 * About Screen
 */

export class AboutScreen {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.el = document.getElementById('about-screen');
    this.bindEvents();
  }

  show() {
    if (this.el) this.el.style.display = 'flex';
  }

  hide() {
    if (this.el) this.el.style.display = 'none';
  }

  bindEvents() {
    const closeBtn = document.getElementById('btn-close-about');
    if (closeBtn) closeBtn.addEventListener('click', () => {
      this.hide();
      this.callbacks.onClose?.();
    });
  }
}
