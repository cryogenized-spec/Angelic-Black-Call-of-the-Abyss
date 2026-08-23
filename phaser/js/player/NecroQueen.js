/* Angelic Black — Necro Queen player controller. */
class NecroQueen extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,textureKey='queen-fallback'){
    super(scene,x,y,textureKey);
    this.speed=220;this.accel=1500;this.drag=1800;this.jumpVelocity=-520;this.face=1;this.state='idle';
    this.coyoteTime=0;this.jumpBuffer=0;this.actionTimer=0;this.actionState=null;
    this.maxHp=100;this.hp=100;this.maxMana=100;this.mana=100;this.manaRegen=6;this.armor=0;this.shield=0;this.invulnerable=false;this.gold=0;
    scene.add.existing(this);scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);this.setMaxVelocity(360,900);this.setDragX(this.drag);this.setGravityY(1250);
    this.setBodySize(34,78,true);this.setOrigin(0.5,1);this.setDepth(20);
  }
  updateControl(cursors,jumpPressed,dt){
    if(this.actionTimer>0){
      this.actionTimer=Math.max(0,this.actionTimer-dt);this.setAccelerationX(0);
      if(this.actionTimer===0&&this.actionState!=='death'){this.actionState=null;this.state='idle';}
      this.applyVisualMotion();return;
    }
    const body=this.body,onFloor=body.blocked.down||body.touching.down;
    if(onFloor)this.coyoteTime=0.10;else this.coyoteTime=Math.max(0,this.coyoteTime-dt);
    if(jumpPressed)this.jumpBuffer=0.12;else this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
    let move=0;if(cursors.left.isDown)move-=1;if(cursors.right.isDown)move+=1;
    if(move!==0){this.setAccelerationX(move*this.accel);this.setFlipX(move<0);this.face=move<0?-1:1;}else this.setAccelerationX(0);
    if(this.jumpBuffer>0&&this.coyoteTime>0){this.setVelocityY(this.jumpVelocity);this.jumpBuffer=0;this.coyoteTime=0;}
    if(!onFloor)this.state=body.velocity.y<0?'jump':'fall';else if(Math.abs(body.velocity.x)>18)this.state='walk';else this.state='idle';
    this.applyVisualMotion();
  }
  applyVisualMotion(){
    const t=performance.now()*0.006;
    this.rotation=0;this.scaleY=1;
    if(this.actionState==='cast'){this.rotation=Math.sin(t)*0.025;this.scaleY=1+Math.sin(t*1.7)*0.012;}
    else if(this.actionState==='special'){this.rotation=this.face*0.035;this.scaleY=.99;}
    else if(this.state==='walk'){this.rotation=Math.sin(t*2.4)*0.035;this.scaleY=1+Math.sin(t*4.8)*0.018;}
    else if(this.state==='jump'){this.rotation=this.face*(this.body?.velocity?.y>0?.025:-.04);this.scaleY=1.02;}
    else if(this.state==='fall'){this.rotation=this.face*0.018;this.scaleY=.99;}
    else {this.rotation=Math.sin(t*.85)*0.008;}
  }
  playAction(action){
    const key='queen-'+action;if(!this.anims||!this.anims.exists(key))return false;
    const spec=window.ANGELIC_QUEEN_ASSETS?.actions?.[action],duration=spec?(spec.frames/spec.fps):0.5;
    this.actionState=action;this.actionTimer=action==='death'?9999:duration+0.05;this.state=action;this.setAccelerationX(0);this.play(key,true);this.applyVisualMotion();return true;
  }
  setAnimationState(){
    if(this.actionTimer>0){this.applyVisualMotion();return;}
    const key=this.state==='fall'?'queen-fall':'queen-'+this.state;
    if(this.anims&&this.anims.exists(key)&&this.anims.currentAnim?.key!==key)this.play(key,true);
    this.applyVisualMotion();
  }
  receiveDamage(amount,knockDir=1){
    if(this.invulnerable||this.shield>0)return false;
    this.hp=Math.max(0,this.hp-amount);this.setVelocityX(knockDir*180);this.playAction('hurt');this.invulnerable=true;
    this.scene.time.delayedCall(350,()=>{if(this.active)this.invulnerable=false;});
    if(this.hp<=0){this.playAction('death');this.scene.onQueenDefeated?.();}
    return true;
  }
}
