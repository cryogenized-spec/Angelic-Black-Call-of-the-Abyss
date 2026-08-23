/* Phaser M5 — combat parity sandbox. */
class GameScene extends Phaser.Scene {
  constructor(){ super('GameScene'); }

  preload(){
    ANGELIC_QUEEN_ASSETS.queue(this);
    this.load.on('loaderror', file => {
      if(file && file.key && file.key.indexOf('queen-')===0){ this.queenAssetErrors=this.queenAssetErrors||[]; this.queenAssetErrors.push(file.key); }
    });
  }

  create(){
    const cfg=window.ANGELIC_PHASER_CONFIG;
    this.config=cfg;
    this.queenAssetErrors=this.queenAssetErrors||[];
    this.cursors=this.input.keyboard.createCursorKeys();
    this.jumpQueued=false; this.actionQueued=null;

    this.input.keyboard.on('keydown-SPACE',()=>{this.jumpQueued=true;});
    this.input.keyboard.on('keydown-UP',()=>{this.jumpQueued=true;});

    this.fireKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.chargeKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.debugKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);

    this.cameras.main.setBackgroundColor('#0b0611');
    this.cameras.main.setBounds(0,0,cfg.worldWidth,cfg.height);
    this.world=new FirstTombWorld(this);
    this.createQueenFallbackTexture();
    this.createKnightFallbackTexture();
    ANGELIC_QUEEN_ASSETS.defineAnimations(this);

    const initialTexture=this.textures.exists('queen-idle')?'queen-idle':'queen-fallback';
    this.queen=new NecroQueen(this,240,cfg.ground,initialTexture);
    this.physics.add.collider(this.queen,this.world.groundBody);
    this.queen.setAnimationState();

    this.combat=new CombatSystem(this,this.queen);
    this.waves=new WaveSystem(this,this.combat);
    this.banner=this.add.text(cfg.width/2,74,'',{fontFamily:'Georgia,serif',fontSize:'24px',color:'#e7d8f2',stroke:'#0b0611',strokeThickness:7}).setOrigin(0.5).setScrollFactor(0).setAlpha(0).setDepth(200);
    this.bannerT=0;

    this.add.text(28,22,'PHASER M5 • COMBAT PARITY',{
      fontFamily:'monospace',fontSize:'13px',color:'#d8a94e',stroke:'#000000',strokeThickness:4
    }).setScrollFactor(0).setDepth(200);
    this.status=this.add.text(28,46,'',{
      fontFamily:'monospace',fontSize:'11px',color:'#8f9ab0',stroke:'#000000',strokeThickness:3,lineSpacing:4
    }).setScrollFactor(0).setDepth(200);
    this.add.text(cfg.width-28,22,'← → MOVE   SPACE / ↑ JUMP',{
      fontFamily:'monospace',fontSize:'11px',color:'#b18cff',stroke:'#000000',strokeThickness:3
    }).setOrigin(1,0).setScrollFactor(0).setDepth(200);
    this.add.text(cfg.width-28,54,'Z GRAVE BOLT   X CHARGE / RELEASE',{
      fontFamily:'monospace',fontSize:'10px',color:'#7dffc0',stroke:'#000000',strokeThickness:3
    }).setOrigin(1,0).setScrollFactor(0).setDepth(200);

    this.input.keyboard.on('keydown-ONE',()=>this.queen.playAction('idle'));
    this.waves.startNext();
    this.cameras.main.startFollow(this.queen,true,0.08,0.08);
    this.cameras.main.setLerp(0.08,0.08);
    this.cameras.main.setDeadzone(240,120);
  }

  showBanner(text){
    this.banner.setText(text).setAlpha(1);
    this.bannerT=1.8;
  }

  update(time,delta){
    const dt=Math.min(delta,50)/1000;

    if(Phaser.Input.Keyboard.JustDown(this.fireKey)) this.combat.beginBasicCast();

    if(Phaser.Input.Keyboard.JustDown(this.chargeKey)) this.combat.startCharge();
    if(Phaser.Input.Keyboard.JustUp(this.chargeKey)) this.combat.releaseCharge();

    this.queen.updateControl(this.cursors,this.jumpQueued,dt); this.jumpQueued=false;
    this.queen.setAnimationState();
    this.combat.update(delta);
    this.waves.update(delta);
    this.world.update(time,delta);

    const cfg=window.ANGELIC_PHASER_CONFIG;
    const lookAhead=this.queen.face*120;
    const targetX=Phaser.Math.Clamp(this.queen.x+lookAhead,cfg.width/2,cfg.worldWidth-cfg.width/2);
    const camX=this.cameras.main.midPoint.x;
    this.cameras.main.scrollX+=(targetX-camX)*0.08;

    if(this.bannerT>0){
      this.bannerT=Math.max(0,this.bannerT-dt);
      const alpha=this.bannerT<0.45?this.bannerT/0.45:1;
      this.banner.setAlpha(alpha);
    }

    const installed=ANGELIC_QUEEN_ASSETS.installed(this);
    const installedLabel=installed.length?installed.map(key=>key.replace('queen-','')).join(', '):'none — fallback active';
    const errors=this.queenAssetErrors.length?` | missing: ${this.queenAssetErrors.length}`:'';
    const enemies=this.combat.enemies.countActive(true);
    const charge=this.combat.charging?`  charge ${this.combat.chargeTime.toFixed(2)}s`:'';
    this.status.setText(`HP ${Math.ceil(this.queen.hp)}/${this.queen.maxHp}  MANA ${Math.floor(this.queen.mana)}/${this.queen.maxMana}  WAVE ${this.waves.wave}  FOES ${enemies}${charge}\nx ${Math.round(this.queen.x)}  vx ${Math.round(this.queen.body.velocity.x)}  state ${this.queen.state}\nloaded: ${installedLabel}${errors}`);
  }

  createQueenFallbackTexture(){
    if(this.textures.exists('queen-fallback'))return;
    const g=this.add.graphics();
    g.fillStyle(0x8f93a1,1);g.fillCircle(32,25,22);
    g.fillStyle(0x131019,1);g.fillRect(15,43,34,30);
    g.fillStyle(0xd8d6dc,1);g.fillRect(24,37,16,8);
    g.fillStyle(0x5cff9f,1);g.fillRect(26,28,4,3);g.fillRect(35,28,4,3);
    g.fillStyle(0x28232d,1);g.fillTriangle(19,7,32,0,45,7);
    g.fillStyle(0xb98cff,1);g.fillRect(30,3,4,4);
    g.fillStyle(0xe8e6d4,1);g.fillRect(24,70,7,18);g.fillRect(34,70,7,18);
    g.fillStyle(0x241239,1);g.fillTriangle(17,70,25,94,8,96);g.fillTriangle(47,70,39,94,56,96);
    g.fillStyle(0x554a3d,1);g.fillRect(14,54,36,4);g.fillRect(16,60,32,3);
    g.generateTexture('queen-fallback',64,96);g.destroy();
  }

  createKnightFallbackTexture(){
    if(this.textures.exists('knight-fallback'))return;
    const g=this.add.graphics();
    g.fillStyle(0x4b4e56,1);g.fillRect(8,10,28,38);
    g.fillStyle(0x8b909b,1);g.fillRect(10,7,24,14);
    g.fillStyle(0x1a1720,1);g.fillRect(13,13,18,5);
    g.fillStyle(0x66563b,1);g.fillRect(12,22,20,4);
    g.fillStyle(0x2e2731,1);g.fillRect(12,48,8,18);g.fillRect(24,48,8,18);
    g.fillStyle(0xc3bca7,1);g.fillRect(34,22,3,32);g.fillRect(37,20,2,3);
    g.fillStyle(0x151218,1);g.fillRect(8,64,28,3);
    g.generateTexture('knight-fallback',45,68);g.destroy();
  }
}
