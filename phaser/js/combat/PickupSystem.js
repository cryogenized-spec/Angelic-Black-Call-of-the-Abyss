/* Angelic Black — Phaser M6 pickup system. */
class PickupSystem {
  constructor(scene,combat){
    this.scene=scene; this.combat=combat;
    this.group=scene.physics.add.group();
    scene.physics.add.overlap(scene.queen,this.group,(queen,pickup)=>this.collect(queen,pickup));
  }
  drop(x,y,kind){
    if(kind==='heart' || kind==='shard' || kind==='gold'){
      const color=kind==='heart'?0x9d78ff:(kind==='shard'?0x7dffc0:0xd8a94e);
      const size=kind==='gold'?7:9;
      const p=this.scene.add.circle(x,y,size,color,1).setDepth(24);
      this.scene.physics.add.existing(p);
      p.body.setAllowGravity(true); p.setBounce(0.25); p.setData('kind',kind);
      this.group.add(p);
      this.scene.tweens.add({targets:p,y:y-18,duration:260,yoyo:true,ease:'Sine.easeOut'});
    }
  }
  collect(queen,pickup){
    if(!pickup.active)return;
    const kind=pickup.getData('kind');
    if(kind==='heart')queen.hp=Math.min(queen.maxHp,queen.hp+25);
    else if(kind==='shard')queen.mana=Math.min(queen.maxMana,queen.mana+20);
    else if(kind==='gold')queen.gold=(queen.gold||0)+1;
    pickup.destroy();
  }
}
