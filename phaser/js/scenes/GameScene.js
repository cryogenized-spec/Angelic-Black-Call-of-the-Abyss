/* Phaser M2 — real player sandbox. */
class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }

  create(){
    const cfg = window.ANGELIC_PHASER_CONFIG;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpQueued = false;
    this.input.keyboard.on('keydown-SPACE', () => { this.jumpQueued = true; });
    this.input.keyboard.on('keydown-UP', () => { this.jumpQueued = true; });

    this.cameras.main.setBackgroundColor('#0b0611');
    this.cameras.main.setBounds(0, 0, cfg.worldWidth, cfg.height);

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d0719,0x0d0719,0x241239,0x241239,1);
    bg.fillRect(0,0,cfg.worldWidth,cfg.height);
    for(let x=0; x<cfg.worldWidth; x+=180){
      bg.fillStyle(0x1d102c,1);
      bg.fillRect(x+30, 250, 18, 170);
      bg.fillRect(x+22, 275, 70, 14);
      bg.fillStyle(0x2f1b42,1);
      bg.fillRect(x+35, 270, 8, 145);
    }

    const ground = this.add.graphics();
    ground.fillStyle(0x180d1e,1);
    ground.fillRect(0,cfg.ground,cfg.worldWidth,cfg.height-cfg.ground);
    ground.fillStyle(0x3c4a33,1);
    ground.fillRect(0,cfg.ground,cfg.worldWidth,8);
    ground.generateTexture('queen-ground', cfg.worldWidth, cfg.height-cfg.ground);
    ground.destroy();
    this.ground = this.physics.add.staticImage(cfg.worldWidth/2, cfg.ground+(cfg.height-cfg.ground)/2, 'queen-ground');
    this.ground.setVisible(false);
    this.ground.refreshBody();

    this.createQueenFallbackTexture();
    this.createQueenAnimations();

    this.queen = new NecroQueen(this, 240, cfg.ground, 'queen-fallback');
    this.physics.add.collider(this.queen, this.ground);

    this.add.text(28, 22, 'PHASER M2 • NECRO QUEEN PLAYER FOUNDATION', {
      fontFamily:'monospace', fontSize:'13px', color:'#d8a94e', stroke:'#000000', strokeThickness:4
    }).setScrollFactor(0);

    this.status = this.add.text(28, 46, '', {
      fontFamily:'monospace', fontSize:'11px', color:'#8f9ab0', stroke:'#000000', strokeThickness:3
    }).setScrollFactor(0);

    this.add.text(cfg.width-28, 22, '← → MOVE   SPACE / ↑ JUMP', {
      fontFamily:'monospace', fontSize:'11px', color:'#b18cff', stroke:'#000000', strokeThickness:3
    }).setOrigin(1,0).setScrollFactor(0);

    this.cameras.main.startFollow(this.queen, true, 0.08, 0.08);
    this.cameras.main.setLerp(0.08, 0.08);
    this.cameras.main.setDeadzone(240, 120);
  }

  update(time, delta){
    const dt = Math.min(delta, 50) / 1000;
    this.queen.updateControl(this.cursors, this.jumpQueued, dt);
    this.jumpQueued = false;
    this.queen.setAnimationState();

    const cfg = window.ANGELIC_PHASER_CONFIG;
    const lookAhead = this.queen.face * 120;
    const targetX = Phaser.Math.Clamp(this.queen.x + lookAhead, cfg.width/2, cfg.worldWidth - cfg.width/2);
    const camX = this.cameras.main.midPoint.x;
    this.cameras.main.scrollX += (targetX - camX) * 0.08;

    this.status.setText(
      `x ${Math.round(this.queen.x)}  y ${Math.round(this.queen.y)}  ` +
      `vx ${Math.round(this.queen.body.velocity.x)}  vy ${Math.round(this.queen.body.velocity.y)}  ` +
      `state ${this.queen.state}`
    );
  }

  createQueenFallbackTexture(){
    if (this.textures.exists('queen-fallback')) return;
    const g = this.add.graphics();
    // 64×96 gameplay silhouette: silver hair, crown, dark bodice, pale legs and shredded train.
    g.fillStyle(0x8f93a1,1); g.fillCircle(32,25,22);
    g.fillStyle(0x131019,1); g.fillRect(15,43,34,30);
    g.fillStyle(0xd8d6dc,1); g.fillRect(24,37,16,8);
    g.fillStyle(0x5cff9f,1); g.fillRect(26,28,4,3); g.fillRect(35,28,4,3);
    g.fillStyle(0x28232d,1); g.fillTriangle(19,7,32,0,45,7);
    g.fillStyle(0xb98cff,1); g.fillRect(30,3,4,4);
    g.fillStyle(0xe8e6d4,1); g.fillRect(24,70,7,18); g.fillRect(34,70,7,18);
    g.fillStyle(0x241239,1); g.fillTriangle(17,70,25,94,8,96); g.fillTriangle(47,70,39,94,56,96);
    g.fillStyle(0x554a3d,1); g.fillRect(14,54,36,4); g.fillRect(16,60,32,3);
    g.generateTexture('queen-fallback',64,96);
    g.destroy();
  }

  createQueenAnimations(){
    // Frame contracts are reserved for the real extracted video frames.
    // Once queen sheets exist, M2b will load them and these keys remain unchanged.
    this.anims.create({key:'queen-idle',frames:[{key:'queen-fallback'}],frameRate:4,repeat:-1});
    this.anims.create({key:'queen-walk',frames:[{key:'queen-fallback'}],frameRate:8,repeat:-1});
    this.anims.create({key:'queen-jump',frames:[{key:'queen-fallback'}],frameRate:6,repeat:0});
    this.anims.create({key:'queen-fall',frames:[{key:'queen-fallback'}],frameRate:6,repeat:0});
  }
}
