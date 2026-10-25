/**
 * DARKNESS: THE HAUNTED WORLD
 * Application Entry Point
 */

import { Game } from './game.js';
import { PWAInstaller } from './pwa/InstallPrompt.js';

window.addEventListener('DOMContentLoaded', () => {
  // Initialize PWA and Offline handler
  new PWAInstaller();

  // Initialize 3D Horror Game
  const game = new Game();
  window.__DARKNESS_GAME = game; // Exposed for debugging / android interface
});
