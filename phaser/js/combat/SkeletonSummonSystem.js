/* Angelic Black — persistent allied skeleton retainers. */
(function(){
  const MAX=2;
  const SPECS={
    A:{key:'prelude-retainer-a',name:'Retainer A',maxHp:60,damage:14,speed:105,range:56,cooldown:.95,color:0xb18cff},
    B:{key:'prelude-retainer-b',name:'Retainer B',maxHp:72,damage:12,speed:82,range:58,cooldown:1.2,color:0x6d5a8f}
  };

  class SkeletonRetainer extends Phaser.Physics.Arcade.Sprite{
    constructor(system,spec,x,y,respawn=false){
      super(system.scene,x,y,spec.key);this.system=system;this.spec=spec;this.name=spec.name;
      this.maxHp=spec.maxHp;this.hp=spec.maxHp;this.attackDamage=spec.damage;this.speed=spec.speed;this.attackRange=spec.range;this.attackCooldown=0;
      this.isDead=false;this.isAttacking=false;this.face=1;this.idleT=Math.random()*Math.PI*2;this.walkT=0;this.attackT=0;
      system.scene.add.existing(this);system.scene.physics.add.existing(this);this.setOrigin(.5,1).setDepth(26).setFlipX(false);
      this.setBodySize(30,62,true);this.body.setAllowGravity(true);this.setCollideWorldBounds(true);
      this.healthBack=system.scene.add.rectangle(x,y-106,46,5,0x151019,.9).setOrigin(.5).setDepth(27);
      this.healthFill=system.scene.add.rectangle(x,y-106,44,3,spec.color,.95).setOrigin(.5).setDepth(28);
      if(respawn)this.rise();
    }
    rise(){const groundY=this.y;this.y+=78;this.setAlpha(0);this.setScale(.85);this.healthBack.setAlpha(0);this.healthFill.setAlpha(0);this.system.scene.fx?.sigil(this.x,groundY-8,40,this.spec.color,.9);this.system.scene.tweens.add({targets:[this,this.healthBack,this.healthFill],alpha:1,y:this.y-78,duration:620,ease:'Cubic.Out'});this.system.scene.tweens.add({targets:this,scale:1,duration:620,ease:'Back.Out'});}
    update(delta){if(!this.active)return;const dt=Math.min(delta,50)/1000;this.attackCooldown=Math.max(0,this.attackCooldown-dt);this.idleT+=dt;const enemies=this.system.scene.combat?.enemies?.getChildren?.()||[];const target=this.findTarget(enemies);
      if(this.isDead)return;
      if(target){const dx=target.x-this.x;this.face=dx<0?-1:1;this.setFlipX(this.face<0);if(Math.abs(dx)>this.attackRange){this.isAttacking=false;this.setVelocityX(this.face*this.speed);this.walkT+=dt;this.y=Math.round(this.y+(Math.sin(this.walkT*9)*.5));}
        else {this.setVelocityX(0);if(this.attackCooldown===0)this.attack(target);}
      }else{this.isAttacking=false;this.setVelocityX(0);this.y+=Math.sin(this.idleT*2.2)*.12;}
      if(this.attackT>0){this.attackT=Math.max(0,this.attackT-dt);if(this.attackT===0)this.isAttacking=false;}
      const hp=Math.max(0,this.hp/this.maxHp);this.healthBack.setPosition(this.x,this.y-106);this.healthFill.setPosition(this.x-22+22*hp,this.y-106).setScale(hp,1);this.healthBack.setVisible(!this.isDead);this.healthFill.setVisible(!this.isDead);
    }
    findTarget(enemies){let best=null,bestD=99999;for(const e of enemies){if(!e||!e.active||e.isDead)continue;const d=Math.abs(e.x-this.x);if(d<bestD&&d<430){best=e;bestD=d;}}return best;}
    attack(target){this.isAttacking=true;this.attackCooldown=this.spec.cooldown;this.attackT=.28;const startX=this.x,startY=this.y;this.system.scene.tweens.add({targets:this,angle:this.face*14,duration:90,ease:'Quad.Out',yoyo:true,hold:20,onYoyo:()=>{if(target&&target.active&&!target.isDead)target.takeDamage(this.attackDamage,this.face);this.system.scene.fx?.hit(target.x,target.y-35,.65,this.spec.color);},onComplete:()=>this.setAngle(0)});this.system.scene.tweens.add({targets:this,x:startX+this.face*18,duration:90,yoyo:true,ease:'Quad.Out'});this.system.scene.fx?.spellCharge(this.x+this.face*20,this.y-52,.45);
    }
    takeDamage(amount,dir=1){if(this.isDead)return;this.hp-=amount;this.setTint(0xffffff);this.system.scene.time.delayedCall(90,()=>{if(this.active&&!this.isDead)this.clearTint();});this.setVelocityX(dir*90);if(this.hp<=0)this.die();}
    die(){if(this.isDead)return;this.isDead=true;this.body.enable=false;this.setVelocity(0,0);this.healthBack.setVisible(false);this.healthFill.setVisible(false);this.system.scene.fx?.death(this.x,this.y-40,this.spec.color);this.system.scene.tweens.add({targets:this,alpha:0,angle:this.face*24,y:this.y+24,scale:.72,duration:420,ease:'Quad.In',onComplete:()=>{this.destroy();this.system.onRetainerDestroyed(this);}});}
    destroy(fromScene){if(this.healthBack?.active)this.healthBack.destroy();if(this.healthFill?.active)this.healthFill.destroy();return super.destroy(fromScene);}
  }

  class SkeletonSummonSystem{
    constructor(scene,queen){this.scene=scene;this.queen=queen;this.units=[];this.started=false;this.replenishCooldown=0;this.capturePreludeHooks();this.bindSummonSpell();scene.events.on('update',(time,delta)=>this.update(delta));}
    capturePreludeHooks(){const Game=window.GameScene;if(!Game)return;const oldShow=Game.prototype.showPreludeRetainers,oldHide=Game.prototype.hidePreludeRetainers;this._oldShow=oldShow;this._oldHide=oldHide;Game.prototype.showPreludeRetainers=()=>{const s=this.scene;s.summons=this.summons||this;if(!s.textures.exists('prelude-retainer-a')||!s.textures.exists('prelude-retainer-b')){oldShow?.call(s);const temp=s._preludeRetainers||[];s._preludeRetainers=null;temp.forEach(x=>x?.destroy?.());}this.ensureStartingRetainers();};Game.prototype.hidePreludeRetainers=()=>{};}
    ensureStartingRetainers(){if(this.started)return;this.started=true;this.replenish(true);}
    bindSummonSpell(){this.scene.input.keyboard.on('keydown-S',()=>{if(this.scene.narrative?.active||this.scene.progression?.state!=='playing')return;this.scene.spells?.castSkeletons?.();});}
    replenish(initial=false){if(this.units.filter(Boolean).length>=MAX)return false;const kinds=['A','B'];let i=0;while(this.units.filter(Boolean).length<MAX&&i<MAX){const existing=this.units.find(u=>u&&!u.isDead&&u.spec===SPECS[kinds[i]]);if(!existing)this.spawn(kinds[i],initial);i++;}return true;}
    spawn(kind,respawn){const spec=SPECS[kind];const alive=this.units.filter(Boolean).length;if(alive>=MAX)return null;const offset=kind==='A'?-72:72;const x=Phaser.Math.Clamp(this.queen.x+offset,70,this.scene.config.worldWidth-70);const y=this.scene.config.ground;const u=new SkeletonRetainer(this,spec,x,y,respawn||alive>0);this.units.push(u);this.scene.physics.add.collider(u,this.scene.world.groundBody);return u;}
    onRetainerDestroyed(unit){this.units=this.units.filter(u=>u&&u!==unit&&!u.isDead);this.replenishCooldown=0;}
    missing(){return Math.max(0,MAX-this.units.filter(u=>u&&u.active&&!u.isDead).length);}
    replenishMissing(){if(this.missing()===0)return false;return this.replenish(false);}
    update(delta){this.units=this.units.filter(u=>u&&u.active&&!u.isDead);for(const u of this.units)u.update(delta);}
  }

  window.SkeletonSummonSystem=SkeletonSummonSystem;
  window.SKELETON_RETAINER_MAX=MAX;
})();
