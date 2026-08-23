/* Angelic Black — Queen spell system. */
class SpellSystem {
  constructor(scene,queen,combat){this.scene=scene;this.queen=queen;this.combat=combat;this.cooldowns={lance:0,mantle:0,gravefall:0,skeletons:0};this.shieldT=0;this.unlocked={lance:true,mantle:false,gravefall:false,skeletons:true};}
  unlock(name){if(!this.unlocked[name]){this.unlocked[name]=true;this.scene.showBanner?.(`SPELL ACQUIRED: ${name.toUpperCase()}`);this.scene.fx?.sigil(this.queen.x,this.queen.y-45,44,0xb18cff,0.9);return true;}return false;}
  update(delta){const dt=Math.min(delta,50)/1000;Object.keys(this.cooldowns).forEach(k=>this.cooldowns[k]=Math.max(0,this.cooldowns[k]-dt));this.shieldT=Math.max(0,this.shieldT-dt);if(this.shieldT===0)this.queen.shield=0;}
  castSkeletons(){if(!this.unlocked.skeletons||this.cooldowns.skeletons>0||this.queen.mana<30)return false;const s=this.scene.summons;if(!s)return false;const missing=s.missing();if(missing<=0)return false;this.queen.mana-=30;this.cooldowns.skeletons=4.0;this.queen.playAction('cast');s.replenishMissing();this.scene.showBanner?.(`SKELETONS SUMMONED: ${s.missing()===0?'2':'1'}`);this.scene.fx?.sigil(this.queen.x,this.queen.y-36,48,0xb18cff,1.0);return true;}
  castLance(){return this.castGravebolt();}
  castGravebolt(){
    if(!this.unlocked.lance||this.cooldowns.lance>0||this.queen.mana<25)return false;
    this.queen.mana-=25;this.cooldowns.lance=3.0;this.queen.playAction('special');
    const face=this.queen.face||1,x0=this.queen.x+face*28,y=this.queen.y-58,len=340,x1=x0+face*len;
    const beam=this.scene.add.graphics().setDepth(37);beam.lineStyle(18,0x07030d,.92);beam.lineBetween(x0,y,x1,y);beam.lineStyle(11,0x6f1cff,.92);beam.lineBetween(x0,y,x1,y);beam.lineStyle(4,0xd9d9e6,.95);beam.lineBetween(x0,y,x1,y);beam.lineStyle(2,0x9b54ff,1);beam.lineBetween(x0,y,x1,y);
    for(const offset of [-10,10]){beam.lineStyle(3,0x120719,.9);beam.lineBetween(x0,y+offset,x1,y+offset*0.45);}
    const skull=this.scene.add.circle(x1,y,14,0x08040e,.98).setDepth(38);this.scene.add.circle(x1-face*6,y-4,2.5,0xb18cff,1).setDepth(39);this.scene.add.circle(x1-face*6,y+4,2.5,0xb18cff,1).setDepth(39);
    this.scene.fx?.glow(x1,y,34,0xb18cff,.34,260);
    this.combat.enemies.getChildren().forEach(enemy=>{if(!enemy||!enemy.active||enemy.isDead)return;const dx=(enemy.x-this.queen.x)*face;if(dx>12&&dx<len+40&&Math.abs(enemy.y-y)<44)enemy.takeDamage(35,face);});
    this.scene.tweens.add({targets:[beam,skull],alpha:0,scaleX:1.05,duration:240,onComplete:()=>{beam.destroy();skull.destroy();}});
    return true;
  }
  activateMantle(){if(!this.unlocked.mantle||this.cooldowns.mantle>0||this.shieldT>0||this.queen.mana<20)return false;this.queen.mana-=20;this.cooldowns.mantle=8;this.shieldT=2.8;this.queen.shield=1;this.queen.playAction('cast');this.scene.fx?.sigil(this.queen.x,this.queen.y-42,48,0x7dffc0,1.2);this.scene.fx?.glow(this.queen.x,this.queen.y-46,46,0x7dffc0,0.18,360);return true;}
  castGravefall(){if(!this.unlocked.gravefall||this.cooldowns.gravefall>0||this.queen.mana<75)return false;this.queen.mana-=75;this.cooldowns.gravefall=12;this.queen.playAction('special');this.scene.fx?.sigil(this.queen.x,this.queen.y,78,0x9d78ff,1.0);for(let i=0;i<5;i++){const x=this.queen.x+(i-2)*80;this.scene.time.delayedCall(i*90,()=>{const bolt=this.scene.add.rectangle(x,this.queen.y-170,8,300,0xb18cff,0.72).setDepth(35);this.scene.fx?.glow(x,this.queen.y-18,28,0xb18cff,0.25,220);this.combat.enemies.getChildren().forEach(enemy=>{if(enemy&&enemy.active&&!enemy.isDead&&Math.abs(enemy.x-x)<22)enemy.takeDamage(28,Math.sign(enemy.x-x)||1);});this.scene.fx?.impact(x,this.queen.y-4,0xb18cff,0.9);this.scene.tweens.add({targets:bolt,alpha:0,duration:220,onComplete:()=>bolt.destroy()});});}return true;}
}
