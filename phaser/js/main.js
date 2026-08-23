/* Angelic Black — Phaser 4 entry point. */
(function(){
  'use strict';

  const cfg = window.ANGELIC_PHASER_CONFIG;
  try {
    const game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: 'game-root',
      width: cfg.width,
      height: cfg.height,
      backgroundColor: '#0b0611',
      pixelArt: true,
      antialias: false,
      roundPixels: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: cfg.width,
        height: cfg.height
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: cfg.gravityY },
          debug: false
        }
      },
      scene: [ BootScene, GameScene ],
      banner: false
    });
    window.ANGELIC_PHASER_GAME = game;
  } catch (err) {
    window.dispatchEvent(new ErrorEvent('error', { message: err?.message || String(err), error: err }));
  }
})();
