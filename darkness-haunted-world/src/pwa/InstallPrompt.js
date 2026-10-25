/**
 * DARKNESS: THE HAUNTED WORLD
 * PWA Installation Prompt & Offline Monitor
 */

export class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.installBanner = document.getElementById('pwa-install-banner');
    this.installBtn = document.getElementById('btn-pwa-install');
    this.statusEl = document.getElementById('pwa-online-status');

    this.init();
  }

  init() {
    // 1. Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
          .then(reg => console.log('PWA ServiceWorker registered:', reg.scope))
          .catch(err => console.log('ServiceWorker registration skipped/offline:', err));
      });
    }

    // 2. Before Install Prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      if (this.installBanner) {
        this.installBanner.style.display = 'flex';
      }
    });

    if (this.installBtn) {
      this.installBtn.addEventListener('click', async () => {
        if (!this.deferredPrompt) return;
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`User PWA response: ${outcome}`);
        this.deferredPrompt = null;
        if (this.installBanner) this.installBanner.style.display = 'none';
      });
    }

    // 3. Online / Offline network status
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
    this.updateOnlineStatus(navigator.onLine);
  }

  updateOnlineStatus(isOnline) {
    if (!this.statusEl) return;
    this.statusEl.innerText = isOnline ? 'ONLINE' : 'OFFLINE MODE';
    this.statusEl.className = isOnline ? 'status-online' : 'status-offline';
  }
}
