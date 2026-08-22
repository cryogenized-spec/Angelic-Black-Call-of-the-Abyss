# Pass 9 — Landscape-first foundation & Macro Queen

## Landscape contract

Angelic Black is now a landscape-first PWA. The web app manifest declares `orientation: landscape` and `display: standalone`. At the first user gesture, the runtime attempts fullscreen and `screen.orientation.lock('landscape')` when supported. If the browser refuses the lock or the device remains portrait, a visible orientation gate asks the player to rotate the device.

The orientation API is best-effort because browser/device support varies; the manifest provides the installed-PWA preference while runtime locking is opportunistic.

## Important geometry note

The existing gameplay canvas remains 540x675 in this pass. It has not been falsely re-labelled as a finished landscape renderer. A later landscape-geometry pass will convert the logical viewport and its coordinate-dependent systems to a true landscape canvas.

## Macro Queen

A separate high-detail Queen tier has been reserved at `assets/sprites/player/macro/`, targeting 128x192 logical pixels per frame. It uses the same video-to-frame extraction workflow as the gameplay sprites, but is intended for larger landscape compositions, showcase gameplay moments and macro character presentation.
