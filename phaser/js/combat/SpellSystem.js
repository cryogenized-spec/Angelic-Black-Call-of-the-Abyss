/* Angelic Black — Phaser M6 Queen spell expansion. */
class SpellSystem {
  constructor(scene,queen,combat){this.scene=scene;this.queen=queen;this.combat=combat;this.cooldowns={lance:0,mantle:0,gravefall:0};this.shieldT=0;}
  update(delta){
    const dt=Math.min(delta,50)/1000;
    Object.keys(this.cooldowns).forEach(k=>this.cooldowns[k]=Math.max(0,this.cooldowns[k]-dt));
    this.shieldT=Math.max(0,this.shieldT-dt); if(this.shieldT===0)this.queen.shield=0;
  }
  castLance(){
    if(this.cooldowns.lance>0||this.queen.mana<25)return false;
    this.queen.mana-=25;this.cooldowns.lance=3.0;this.queen.playAction('special');
    const face=this.queen.face||1;
    const beam=this.scene.add.rectangle(this.queen.x+face*150,this.queen.y-62,300,18,0x8d5cf6,0.72).setDepth(37);
    beam.setOrigin(0.5); beam.setRotation(0);
    this.combat.enemies.children.each(enemy=>{
      if(!enemy||!enemy.active||enemy.isDead)return;
      const dx=(enemy.x-this.queen.x)*face;
      if(dx>12&&dx<305&&Math.abs(enemy.y-(this.queen.y-62))<42)enemy.takeDamage(35,face);
    });
    this.scene.cameras.main.shake(120,0.006);
    this.scene.tweens.add({targets:beam,alpha:0,scaleY:2,duration:180,onComplete:()=>beam.destroy()});
    return true;
  }
  activateMantle(){
    if(this.cooldowns.mantle>0||this.shieldT>0||this.queen.mana<20)return false;
    this.queen.mana-=20;this.cooldowns.mantle=8;this.shieldT=2.8;this.queen.shield=1;this.queen.playAction('cast');
    return true;
  }
  castGravefall(){
    if(this.cooldowns.gravefall>0||this.queen.mana<75)return false;
    this.queen.mana-=75;this.cooldowns.gravefall=12;this.queen.playAction('special');
    for(let i=0;i<5;i++){
      const x=this.queen.x+(i-2)*80;
      this.scene.time.delayedCall(i*90,()=>{
        const bolt=this.scene.add.rectangle(x,this.queen.y-170,8,300,0xb18cff,0.75).setDepth(35);
        this.combat.enemies.children.each(enemy=>{
          if(enemy&&enemy.active&&!enemy.isDead&&Math.abs(enemy.x-x)<22)enemy.takeDamage(28,Math.sign(enemy.x-x)||1);
        });
        this.scene.cameras.main.shake(70,0.003);
        this.scene.tweens.add({targets:bolt,alpha:0,duration:220,onComplete:()=>bolt.destroy()});
      });
    }
    return true;
  }
}
