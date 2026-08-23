/* Angelic Black — Phaser 4 entry point. */
(function(){
  'use strict';

  const cfg = window.ANGELIC_PHASER_CONFIG;
  const game = new Phaser.Game({
    type: Phaser.AUTO,
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
    scene: [ BootScene, MigrationProbeScene ],
    banner: false
  });

  window.ANGELIC_PHASER_GAME = game;
})();
