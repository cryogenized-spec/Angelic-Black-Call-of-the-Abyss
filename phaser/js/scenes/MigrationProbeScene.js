/* Migration probe: proves Phaser can host the game's core presentation contract before gameplay is ported. */
class MigrationProbeScene extends Phaser.Scene {
  constructor(){ super('MigrationProbeScene'); }

  create(){
    const cfg = window.ANGELIC_PHASER_CONFIG;
    this.cameras.main.setBackgroundColor('#0b0611');
    this.cameras.main.setBounds(0, 0, cfg.worldWidth, cfg.height);
    this.cameras.main.setRoundPixels(true);

    // Temporary world silhouette. This is deliberately not a replacement for the Queen art.
    const g = this.add.graphics();
    g.fillStyle(0x241239, 1); g.fillRect(0, cfg.ground, cfg.worldWidth, cfg.height-cfg.ground);
    g.fillStyle(0x3c4a33, 1); g.fillRect(0, cfg.ground, cfg.worldWidth, 8);
    for(let x=0; x<cfg.worldWidth; x+=96){
      g.fillStyle(0x241b31, 1);
      g.fillRect(x+18, cfg.ground-58, 38, 58);
      g.fillStyle(0x3a2c4d, 1);
      g.fillRect(x+10, cfg.ground-46, 54, 7);
    }

    const queen = this.add.graphics();
    this.drawQueenPlaceholder(queen, 220, cfg.ground-92);
    queen.setPosition(220, cfg.ground-92);
    this.tweens.add({
      targets: queen,
      x: {from:220,to:420},
      duration: 2200,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });

    const label = this.add.text(30, 26, 'PHASER 4 FOUNDATION • MIGRATION PROBE', {
      fontFamily:'monospace', fontSize:'13px', color:'#d8a94e', stroke:'#000000', strokeThickness:4
    });

    this.add.text(30, 52, 'Camera follow · 16:9 logical surface · pixelArt · 2880px world', {
      fontFamily:'monospace', fontSize:'11px', color:'#8f9ab0'
    });

    this.add.text(cfg.width/2, 94, 'THIS IS NOT THE FINAL QUEEN SPRITE', {
      fontFamily:'monospace', fontSize:'12px', color:'#b18cff', align:'center'
    }).setOrigin(0.5);

    this.status = this.add.text(cfg.width/2, cfg.height-34, 'BOOT OK · PHASER 4.2.1 · READY FOR PLAYER PORT', {
      fontFamily:'monospace', fontSize:'12px', color:'#7dffc0', align:'center'
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => this.requestLandscape());
    this.input.keyboard?.once('keydown-ENTER', () => this.requestLandscape());
  }

  update(){
    const cam = this.cameras.main;
    const targetX = 230;
    cam.scrollX += (targetX - cam.scrollX) * 0.05;
  }

  requestLandscape(){
    const root = document.documentElement;
    if(document.documentElement.requestFullscreen && !document.fullscreenElement){
      document.documentElement.requestFullscreen().catch(()=>{});
    }
    if(screen.orientation && screen.orientation.lock){
      screen.orientation.lock('landscape').catch(()=>{});
    }
  }

  drawQueenPlaceholder(g, x, y){
    // Simple silhouette: silver hair halo, crown, dark torso, pale legs.
    g.clear();
    g.fillStyle(0x8e92a0, 1);
    g.fillCircle(x, y-58, 26);
    g.fillTriangle(x-18,y-92,x,y-108,x+18,y-92);
    g.fillStyle(0xc8c9d2, 1);
    g.fillRect(x-24, y-38, 48, 34);
    g.fillStyle(0x241239, 1);
    g.fillRect(x-16, y-35, 32, 32);
    g.fillStyle(0x5cff9f, 1);
    g.fillRect(x-8,y-63,5,3); g.fillRect(x+3,y-63,5,3);
    g.fillStyle(0xe8e6d4, 1);
    g.fillRect(x-10,y-4,7,32); g.fillRect(x+3,y-4,7,32);
    g.fillStyle(0x0e0a14, 1);
    g.fillTriangle(x-22,y-2,x-6,y+38,x-28,y+40);
    g.fillTriangle(x+22,y-2,x+6,y+38,x+28,y+40);
  }
}
