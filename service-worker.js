/**
 * DARKNESS: THE HAUNTED WORLD - Service Worker
 * Cache-first strategy for instant offline gameplay
 */

const CACHE_NAME = 'darkness-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/libs/three.min.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './src/main.js',
  './src/game.js',
  './src/config.js',
  './src/player/Player.js',
  './src/player/Controls.js',
  './src/player/Collision.js',
  './src/world/World.js',
  './src/world/Lighting.js',
  './src/world/Environment.js',
  './src/enemies/Enemy.js',
  './src/enemies/EnemyAI.js',
  './src/enemies/EnemyRegistry.js',
  './src/gameplay/Inventory.js',
  './src/gameplay/Interaction.js',
  './src/gameplay/Objectives.js',
  './src/gameplay/SaveSystem.js',
  './src/audio/AudioManager.js',
  './src/audio/HorrorSoundscape.js',
  './src/ui/HUD.js',
  './src/ui/MainMenu.js',
  './src/ui/PauseMenu.js',
  './src/ui/Settings.js',
  './src/ui/About.js',
  './src/ui/Credits.js',
  './pwa/InstallPrompt.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[ServiceWorker] Some assets could not be cached immediately:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Fallback for offline root request
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
