/* Angelic Black — Phaser M6 enemy roster. */
class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y,textureKey='enemy-fallback'){
    super(scene,x,y,textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.hp=10; this.maxHp=10; this.damage=10; this.speed=70;
    this.isDead=false; this.contactCooldown=0; this.hitFlash=0; this.phase=Math.random()*6.283;
    this.face=-1; this.setOrigin(0.5,1); this.setDepth(18); this.setCollideWorldBounds(true);
    this.body.setAllowGravity(true);
  }
  takeDamage(amount,knockDir=1){
    if(this.isDead)return;
    this.hp-=amount; this.hitFlash=0.12;
    this.setVelocityX(knockDir*140);
    if(this.hp<=0)this.die();
  }
  die(){
    if(this.isDead)return;
    this.isDead=true; this.body.enable=false;
    if(this.scene.combat){ this.scene.combat.onEnemyKilled(this); }
    this.scene.tweens.add({targets:this,alpha:0,duration:240,onComplete:()=>this.destroy()});
  }
  moveToward(player,range=42){
    const dx=player.x-this.x; this.face=dx<0?-1:1;
    this.setFlipX(this.face<0);
    if(Math.abs(dx)>range)this.setVelocityX(this.face*this.speed); else this.setVelocityX(0);
  }
  updateCommon(dt){
    this.contactCooldown=Math.max(0,this.contactCooldown-dt);
    this.hitFlash=Math.max(0,this.hitFlash-dt);
    if(this.hitFlash>0)this.setTint(0xffffff);else this.clearTint();
  }
}

class KnightEnemy extends BaseEnemy {
  constructor(scene,x,y){super(scene,x,y,'knight-fallback');this.hp=this.maxHp=12;this.damage=12;this.speed=82;this.setBodySize(28,52,true);}
  updateAI(player,dt){this.updateCommon(dt);if(this.isDead)return;this.moveToward(player,44);}
}

class ZombieEnemy extends BaseEnemy {
  constructor(scene,x,y){super(scene,x,y,'zombie-fallback');this.hp=this.maxHp=16;this.damage=16;this.speed=48;this.setBodySize(34,64,true);}
  updateAI(player,dt){this.updateCommon(dt);if(this.isDead)return;this.moveToward(player,48);}
}

class MaraEnemy extends BaseEnemy {
  constructor(scene,x,y){super(scene,x,y,'mara-fallback');this.hp=this.maxHp=42;this.damage=14;this.speed=98;this.attackCd=0;this.setBodySize(30,64,true);}
  updateAI(player,dt){
    this.updateCommon(dt); if(this.isDead)return;
    this.attackCd=Math.max(0,this.attackCd-dt);
    this.moveToward(player,62);
    if(Math.abs(player.x-this.x)<72 && this.attackCd===0){this.setVelocityX(this.face*150);this.attackCd=1.25;}
  }
}

class CultistEnemy extends BaseEnemy {
  constructor(scene,x,y){super(scene,x,y,'cultist-fallback');this.hp=this.maxHp=10;this.damage=10;this.speed=58;this.shootCd=1.4;this.setBodySize(28,62,true);}
  updateAI(player,dt){
    this.updateCommon(dt);if(this.isDead)return;
    const dx=player.x-this.x;this.face=dx<0?-1:1;this.setFlipX(this.face<0);
    if(Math.abs(dx)<230)this.setVelocityX(-this.face*this.speed*0.45);else if(Math.abs(dx)>300)this.setVelocityX(this.face*this.speed);else this.setVelocityX(0);
    this.shootCd-=dt;
    if(this.shootCd<=0 && Math.abs(dx)<520){this.scene.combat.spawnEnemyProjectile(this.x+this.face*18,this.y-46,this.face*210,this.damage,'cult');this.shootCd=1.9;}
  }
}

class MageEnemy extends BaseEnemy {
  constructor(scene,x,y){super(scene,x,y,'mage-fallback');this.hp=this.maxHp=14;this.damage=13;this.speed=52;this.shootCd=0.8;this.setBodySize(30,66,true);}
  updateAI(player,dt){
    this.updateCommon(dt);if(this.isDead)return;
    const dx=player.x-this.x;this.face=dx<0?-1:1;this.setFlipX(this.face<0);
    if(Math.abs(dx)<260)this.setVelocityX(-this.face*this.speed*0.35);else if(Math.abs(dx)>360)this.setVelocityX(this.face*this.speed);else this.setVelocityX(0);
    this.shootCd-=dt;
    if(this.shootCd<=0 && Math.abs(dx)<600){this.scene.combat.spawnEnemyProjectile(this.x+this.face*18,this.y-54,this.face*250,this.damage+2,'mage');this.shootCd=1.45;}
  }
}

class BatEnemy extends BaseEnemy {
  constructor(scene,x,y){super(scene,x,y,'bat-fallback');this.hp=this.maxHp=8;this.damage=8;this.speed=105;this.baseY=y;this.setGravityY(0);this.setBodySize(34,20,true);}
  updateAI(player,dt){
    this.updateCommon(dt);if(this.isDead)return;
    const dx=player.x-this.x;this.face=dx<0?-1:1;this.setFlipX(this.face<0);
    this.setVelocityX(this.face*this.speed);this.setVelocityY((player.y-70-this.y)*2.2+Math.sin(performance.now()*0.004+this.phase)*60);
  }
}

class GraveLordBoss extends BaseEnemy {
  constructor(scene,x,y){
    super(scene,x,y,'grave-lord-fallback');
    this.hp=this.maxHp=220;this.damage=22;this.speed=72;this.attackCd=1.2;this.phaseIndex=1;this.setBodySize(56,112,true);this.setDepth(19);
  }
  updateAI(player,dt){
    this.updateCommon(dt);if(this.isDead)return;
    this.attackCd=Math.max(0,this.attackCd-dt);this.moveToward(player,78);
    const ratio=this.hp/this.maxHp;
    this.phaseIndex=ratio<=0.33?3:(ratio<=0.66?2:1);
    if(this.attackCd===0){
      if(this.phaseIndex===1){this.scene.combat.spawnEnemyProjectile(this.x+this.face*25,this.y-90,this.face*230,18,'boss');this.attackCd=1.55;}
      else if(this.phaseIndex===2){
        this.scene.combat.spawnEnemyProjectile(this.x+this.face*25,this.y-90,this.face*280,20,'boss');
        this.scene.combat.spawnEnemyProjectile(this.x+this.face*25,this.y-70,this.face*210,14,'boss');
        this.attackCd=1.25;
      } else {
        this.scene.combat.spawnEnemyProjectile(this.x+this.face*25,this.y-100,this.face*340,24,'boss');
        for(let i=0;i<2;i++)this.scene.combat.spawnEnemy('knight',this.x+(i?70:-70));
        this.attackCd=2.1;
      }
    }
  }
}

const ANGELIC_ENEMY_ROSTER = {
  knight: KnightEnemy,
  zombie: ZombieEnemy,
  cultist: CultistEnemy,
  mage: MageEnemy,
  bat: BatEnemy,
  mara: MaraEnemy,
  boss: GraveLordBoss
};
