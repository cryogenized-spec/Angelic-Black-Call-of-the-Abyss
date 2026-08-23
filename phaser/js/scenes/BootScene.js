/* Phaser migration boot scene. */
class BootScene extends Phaser.Scene {
  constructor(){ super('BootScene'); }

  create(){
    const cfg = window.ANGELIC_PHASER_CONFIG;
    this.cameras.main.setBackgroundColor('#05030a');

    this.add.text(cfg.width/2, cfg.height/2 - 42, 'ANGELIC BLACK', {
      fontFamily: 'Georgia, serif',
      fontSize: '46px',
      color: '#d8a94e',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(cfg.width/2, cfg.height/2 + 10, 'PHASER 4 • NECRO QUEEN PLAYER FOUNDATION', {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#b18cff',
      letterSpacing: 2,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(cfg.width/2, cfg.height/2 + 48, '960 × 540 · LANDSCAPE · PIXEL ART · ARCADE PHYSICS', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#8f9ab0',
      align: 'center'
    }).setOrigin(0.5);

    this.time.delayedCall(650, () => this.scene.start('GameScene'));
  }
}
