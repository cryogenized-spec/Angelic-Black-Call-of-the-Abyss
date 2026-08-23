/* Phaser M4 — First Tomb world + Necro Queen sandbox. */
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
    this.queenAssetErrors=this.queenAssetErrors||[];
    this.cursors=this.input.keyboard.createCursorKeys();
    this.jumpQueued=false; this.actionQueued=null;
    this.input.keyboard.on('keydown-SPACE',()=>{this.jumpQueued=true;});
    this.input.keyboard.on('keydown-UP',()=>{this.jumpQueued=true;});
    const debugActions={ONE:'idle',TWO:'walk',THREE:'jump',FOUR:'cast',FIVE:'hurt',SIX:'death',SEVEN:'special'};
    Object.entries(debugActions).forEach(([key,action])=>this.input.keyboard.on('keydown-'+key,()=>{this.actionQueued=action;}));

    this.cameras.main.setBackgroundColor('#0b0611');
    this.cameras.main.setBounds(0,0,cfg.worldWidth,cfg.height);
    this.world=new FirstTombWorld(this);
    this.createQueenFallbackTexture();
    ANGELIC_QUEEN_ASSETS.defineAnimations(this);

    const initialTexture=this.textures.exists('queen-idle')?'queen-idle':'queen-fallback';
    this.queen=new NecroQueen(this,240,cfg.ground,initialTexture);
    this.physics.add.collider(this.queen,this.world.groundBody);
    this.queen.setAnimationState();

    this.add.text(28,22,'PHASER M4 • FIRST TOMB WORLD',{
      fontFamily:'monospace',fontSize:'13px',color:'#d8a94e',stroke:'#000000',strokeThickness:4
    }).setScrollFactor(0);
    this.status=this.add.text(28,46,'',{
      fontFamily:'monospace',fontSize:'11px',color:'#8f9ab0',stroke:'#000000',strokeThickness:3,lineSpacing:4
    }).setScrollFactor(0);
    this.add.text(cfg.width-28,22,'← → MOVE   SPACE / ↑ JUMP',{
      fontFamily:'monospace',fontSize:'11px',color:'#b18cff',stroke:'#000000',strokeThickness:3
    }).setOrigin(1,0).setScrollFactor(0);
    this.add.text(cfg.width-28,54,'1 IDLE  2 WALK  3 JUMP  4 CAST  5 HURT  6 DEATH  7 SPECIAL',{
      fontFamily:'monospace',fontSize:'9px',color:'#8f9ab0',stroke:'#000000',strokeThickness:3
    }).setOrigin(1,0).setScrollFactor(0);

    this.cameras.main.startFollow(this.queen,true,0.08,0.08);
    this.cameras.main.setLerp(0.08,0.08);
    this.cameras.main.setDeadzone(240,120);
  }
  update(time,delta){
    const dt=Math.min(delta,50)/1000;
    if(this.actionQueued){ this.queen.playAction(this.actionQueued); this.actionQueued=null; }
    this.queen.updateControl(this.cursors,this.jumpQueued,dt); this.jumpQueued=false; this.queen.setAnimationState();
    this.world.update(time,delta);

    const cfg=window.ANGELIC_PHASER_CONFIG;
    const lookAhead=this.queen.face*120;
    const targetX=Phaser.Math.Clamp(this.queen.x+lookAhead,cfg.width/2,cfg.worldWidth-cfg.width/2);
    const camX=this.cameras.main.midPoint.x;
    this.cameras.main.scrollX+=(targetX-camX)*0.08;

    const installed=ANGELIC_QUEEN_ASSETS.installed(this);
    const installedLabel=installed.length?installed.map(key=>key.replace('queen-','')).join(', '):'none — fallback active';
    const errors=this.queenAssetErrors.length?` | missing: ${this.queenAssetErrors.length}`:'';
    this.status.setText(`x ${Math.round(this.queen.x)}  y ${Math.round(this.queen.y)}  vx ${Math.round(this.queen.body.velocity.x)}  vy ${Math.round(this.queen.body.velocity.y)}  state ${this.queen.state}\nloaded: ${installedLabel}${errors}`);
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
}
