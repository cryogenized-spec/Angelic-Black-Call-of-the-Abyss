/* Angelic Black — mobile-first title / cover scene. */
class TitleScene extends Phaser.Scene {
  constructor(){ super('TitleScene'); }
  preload(){ this.load.image('cover-main','../assets/art/cover/cover-main.png'); this.load.on('loaderror',file=>{this.failed=this.failed||new Set();if(file?.key)this.failed.add(file.key);}); }
  create(){
    const cfg=window.ANGELIC_PHASER_CONFIG;this.cameras.main.setBackgroundColor('#05030a');this.createFallback();
    const coverKey=this.textures.exists('cover-main')&&!this.failed?.has('cover-main')?'cover-main':'title-fallback';
    this.cover=this.add.image(cfg.width/2,cfg.height/2,coverKey).setDisplaySize(cfg.width,cfg.height).setDepth(1);
    this.shade=this.add.rectangle(cfg.width/2,cfg.height/2,cfg.width,cfg.height,0x05030a,.18).setDepth(2);
    this.title=this.add.text(cfg.width/2,72,'ANGELIC BLACK',{fontFamily:'Georgia,serif',fontSize:'42px',fontStyle:'bold',color:'#e7d8f2',stroke:'#05030a',strokeThickness:8}).setOrigin(.5).setDepth(3);
    this.subtitle=this.add.text(cfg.width/2,120,'CALL OF THE ABYSS',{fontFamily:'Georgia,serif',fontSize:'17px',color:'#d8a94e',stroke:'#05030a',strokeThickness:5,letterSpacing:4}).setOrigin(.5).setDepth(3);
    this.enter=this.add.text(cfg.width/2,cfg.height-72,'TAP TO BEGIN',{fontFamily:'monospace',fontSize:'17px',color:'#e7d8f2',stroke:'#05030a',strokeThickness:5,letterSpacing:2}).setOrigin(.5).setDepth(3);
    this.hint=this.add.text(cfg.width/2,cfg.height-42,'THE ABYSS REMEMBERS ITS QUEEN',{fontFamily:'monospace',fontSize:'9px',color:'#b18cff',stroke:'#05030a',strokeThickness:3}).setOrigin(.5).setDepth(3);
    this.input.once('pointerdown',()=>this.begin());this.input.keyboard.once('keydown-ENTER',()=>this.begin());this.input.keyboard.once('keydown-SPACE',()=>this.begin());
  }
  begin(){if(this.started)return;this.started=true;this.tweens.add({targets:[this.cover,this.shade,this.title,this.subtitle,this.enter,this.hint],alpha:0,duration:420,onComplete:()=>this.scene.start('GameScene',{startOpening:true})});}
  createFallback(){
    if(this.textures.exists('title-fallback'))return;const cfg=window.ANGELIC_PHASER_CONFIG,g=this.add.graphics();g.fillGradientStyle(0x160d25,0x0a0610,0x05030a,0x020106,1);g.fillRect(0,0,cfg.width,cfg.height);g.fillStyle(0x241438,.85);g.fillCircle(cfg.width*.72,cfg.height*.36,175);g.fillStyle(0xd8a94e,.3);g.fillCircle(cfg.width*.72,cfg.height*.36,4);g.lineStyle(3,0x6d5a8f,.45);g.strokeCircle(cfg.width*.72,cfg.height*.36,175);g.lineStyle(1,0xb18cff,.22);for(let i=0;i<8;i++)g.strokeCircle(cfg.width*.72,cfg.height*.36,42+i*18);g.fillStyle(0x05030a,.78);g.fillRect(0,cfg.height*.72,cfg.width,cfg.height*.28);g.generateTexture('title-fallback',cfg.width,cfg.height);g.destroy();
  }
}
window.TitleScene=TitleScene;
