// /public/sw.js
/* eslint-disable no-undef */
/**
 * Minimal service worker to make the site "installable" (WebAPK on Android)
 * and ensure the OS uses the icons from the Web App Manifest.
 * No offline caching here (pass-through), just lifecycle hooks.
 */

'use strict';

// Take control immediately on first load
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Pass-through fetch (no caching). You can add caching later if needed.
self.addEventListener('fetch', () => {
  // Intentionally empty – network goes straight through.
});
