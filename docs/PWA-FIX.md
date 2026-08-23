# Phaser PWA installability fix

The Phaser production runtime is served from `/phaser/` on GitHub Pages.

The PWA manifest is installed from `phaser/manifest.json`, and `phaser/sw.js` provides the service worker required for offline/app-shell control of the `/phaser/` scope.

The Phaser entry page registers the worker after the game bootstraps. The worker uses a cache-first app shell and network fallback for later assets.
