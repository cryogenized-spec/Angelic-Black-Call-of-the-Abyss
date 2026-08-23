/* Angelic Black — Phaser M9 reusable visual-effects layer. */
class FXEngine {
  constructor(scene){
    this.scene=scene; this.active=[]; this.shakeLock=0; this.hitStopTimer=0;
  }
  burst(x,y,color=0xb18cff,count=12,speed=140,size=3,life=0.5){
    for(let i=0;i<count;i++){
      const a=Math.random()*Math.PI*2, s=speed*(0.45+Math.random()*0.8);
      const p=this.scene.add.circle(x,y,size*(0.7+Math.random()*0.6),color,0.85).setDepth(70);
      p.setData({vx:Math.cos(a)*s,vy:Math.sin(a)*s,life,age:0,drag:0.92}); this.active.push(p);
    }
  }
  sigil(x,y,r=34,color=0x9d78ff,duration=0.8){
    const g=this.scene.add.graphics().setDepth(61);
    g.lineStyle(2,color,0.9);g.strokeCircle(x,y,r);g.strokeCircle(x,y,r*0.55);
    for(let i=0;i<6;i++){const a=i*Math.PI/3;g.beginPath();g.moveTo(x+Math.cos(a)*r*0.55,y+Math.sin(a)*r*0.55);g.lineTo(x+Math.cos(a+0.32)*r,y+Math.sin(a+0.32)*r);g.strokePath();}
    this.scene.tweens.add({targets:g,alpha:0,scale:1.35,duration:duration*1000,ease:'Cubic.easeOut',onComplete:()=>g.destroy()});
  }
  glow(x,y,r,color=0x9d78ff,alpha=0.2,duration=240){
    const c=this.scene.add.circle(x,y,r,color,alpha).setBlendMode(Phaser.BlendModes.ADD).setDepth(45);
    this.scene.tweens.add({targets:c,alpha:0,scale:1.35,duration,ease:'Quad.easeOut',onComplete:()=>c.destroy()});
  }
  trail(x,y,color=0x9d78ff){
    const c=this.scene.add.circle(x,y,3.5,color,0.38).setBlendMode(Phaser.BlendModes.ADD).setDepth(36);
    this.scene.tweens.add({targets:c,alpha:0,scale:0.2,duration:180,onComplete:()=>c.destroy()});
  }
  impact(x,y,color=0xf2e7ff,power=1){
    this.glow(x,y,12+power*10,color,0.35,140);
    this.burst(x,y,color,10+Math.round(power*8),120+power*80,2.2,0.28+power*0.12);
    const r=this.scene.add.circle(x,y,6,color,0).setStrokeStyle(2,color,0.9).setDepth(67);
    this.scene.tweens.add({targets:r,scale:4+power,alpha:0,duration:180+power*80,ease:'Cubic.easeOut',onComplete:()=>r.destroy()});
  }
  hit(x,y,power=1,color=0xf2e7ff){
    this.impact(x,y,color,power);
    this.hitStop(30+power*18);
  }
  spellCharge(x,y,power){
    const r=18+power*20;this.glow(x,y,r,0x9d78ff,0.16+power*0.12,180);
    if(Math.random()<0.45)this.sigil(x,y,r+10,0xb18cff,0.35);
  }
  cameraPunch(amount=0.006,duration=90){this.scene.cameras.main.shake(duration,amount);}
  hitStop(ms=45){
    this.hitStopTimer=Math.max(this.hitStopTimer,ms);
    if(!this.scene.physics.world.isPaused)this.scene.physics.world.pause();
    this.scene.time.delayedCall(ms,()=>{this.hitStopTimer=0;if(this.scene.progression?.state==='playing')this.scene.physics.world.resume();});
  }
  bossEntrance(x,y){
    this.glow(x,y-50,58,0xa42c46,0.22,620);this.sigil(x,y-20,92,0x6d5a8f,1.0);
    this.burst(x,y-42,0xa42c46,24,180,3,0.9);
    this.cameraPunch(0.012,280);
  }
  update(delta){
    const dt=Math.min(delta,50)/1000;
    for(let i=this.active.length-1;i>=0;i--){const p=this.active[i];if(!p||!p.active){this.active.splice(i,1);continue;}const d=p.data.values;p.x+=d.vx*dt;p.y+=d.vy*dt;d.vx*=Math.pow(d.drag,dt*60);d.vy=(d.vy+40)*Math.pow(d.drag,dt*60);d.age+=dt;p.alpha=Math.max(0,1-d.age/d.life);if(d.age>=d.life){p.destroy();this.active.splice(i,1);}}
  }
}
window.ANGELIC_FX=FXEngine;
