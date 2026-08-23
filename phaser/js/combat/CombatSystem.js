/* Angelic Black — Phaser M6 combat system. */
class CombatSystem {
  constructor(scene,queen){
    this.scene=scene;this.queen=queen;
    this.projectiles=scene.physics.add.group();this.enemies=scene.physics.add.group();this.enemyProjectiles=scene.physics.add.group();
    this.castCooldown=0;this.chargeTime=0;this.charging=false;this.damageFlash=0;this.waveKills=0;this.totalKills=0;
    scene.physics.add.overlap(this.projectiles,this.enemies,(p,e)=>this.hitEnemy(p,e));
    scene.physics.add.overlap(this.queen,this.enemies,(_,e)=>this.enemyContact(e));
    scene.physics.add.overlap(this.queen,this.enemyProjectiles,(_,p)=>this.enemyProjectileHit(p));
  }
  get mana(){return this.queen.mana;} set mana(v){this.queen.mana=Phaser.Math.Clamp(v,0,this.queen.maxMana);}
  beginBasicCast(){if(this.castCooldown>0||this.charging||this.mana<4)return false;this.mana-=4;this.castCooldown=0.18;this.fireProjectile(1,4);this.queen.playAction('cast');return true;}
  startCharge(){if(this.castCooldown>0||this.charging||this.mana<18)return false;this.charging=true;this.chargeTime=0;this.queen.playAction('cast');return true;}
  releaseCharge(){
    if(!this.charging)return false;this.charging=false;if(this.chargeTime<0.25)return this.beginBasicCast();if(this.mana<18)return false;
    this.mana-=18;const power=Phaser.Math.Clamp(this.chargeTime/2,0.25,1);this.castCooldown=0.35;this.fireProjectile(power,10+Math.round(power*10));this.queen.playAction('cast');this.scene.cameras.main.shake(80,0.002+power*0.006);return true;
  }
  fireProjectile(power,damage){
    const face=this.queen.face||1,startX=this.queen.x+face*34,startY=this.queen.y-60;
    const orb=this.scene.add.circle(startX,startY,5+power*2,0x9d78ff,1).setDepth(35);this.scene.physics.add.existing(orb);orb.body.setAllowGravity(false);orb.body.setVelocityX(face*(520+power*260));
    orb.body.setCircle(5+power*2,-(5+power*2),-(5+power*2));orb.setDataEnabled();orb.setData('damage',damage);orb.setData('life',1.6);this.projectiles.add(orb);
  }
  spawnEnemyProjectile(x,y,vx,damage,kind='cult'){
    const color=kind==='mage'?0xb18cff:(kind==='boss'?0xa42c46:0x6d5a8f);
    const p=this.scene.add.circle(x,y,kind==='boss'?7:5,color,0.9).setDepth(34);this.scene.physics.add.existing(p);p.body.setAllowGravity(false);p.body.setVelocityX(vx);p.setDataEnabled();p.setData('damage',damage);p.setData('life',4);p.setData('kind',kind);this.enemyProjectiles.add(p);
  }
  hitEnemy(projectile,enemy){if(!projectile.active||!enemy.active||enemy.isDead)return;const damage=projectile.getData('damage')||4;enemy.takeDamage(damage,this.queen.face||1);projectile.destroy();this.scene.cameras.main.shake(55,0.0025);this.damageFlash=0.08;}
  enemyContact(enemy){if(!enemy.active||enemy.isDead||this.queen.invulnerable)return;if(enemy.contactCooldown>0)return;enemy.contactCooldown=0.8;this.queen.receiveDamage(enemy.damage,this.queen.x<enemy.x?-1:1);this.scene.cameras.main.shake(100,0.005);}
  enemyProjectileHit(projectile){if(!projectile.active)return;const damage=projectile.getData('damage')||10;const dir=projectile.body.velocity.x<0?-1:1;this.queen.receiveDamage(damage,dir);projectile.destroy();this.scene.cameras.main.shake(95,0.005);}
  onEnemyKilled(enemy){
    this.waveKills++;this.totalKills++;
    if(this.scene.pickups&&Math.random()<0.22)this.scene.pickups.drop(enemy.x,enemy.y-18,Math.random()<0.5?'heart':'shard');
  }
  update(delta){
    const dt=Math.min(delta,50)/1000;if(this.castCooldown>0)this.castCooldown=Math.max(0,this.castCooldown-dt);if(this.charging)this.chargeTime+=dt;
    this.projectiles.children.each(p=>{if(!p||!p.active)return;const life=(p.getData('life')||0)-dt;p.setData('life',life);p.scale=1+Math.sin(performance.now()*0.02)*0.08;if(life<=0||p.x<-80||p.x>this.scene.config.worldWidth+80)p.destroy();});
    this.enemyProjectiles.children.each(p=>{if(!p||!p.active)return;const life=(p.getData('life')||0)-dt;p.setData('life',life);if(life<=0||p.x<-80||p.x>this.scene.config.worldWidth+80)p.destroy();});
    this.enemies.children.each(e=>{if(!e||!e.active)return;e.updateAI(this.queen,dt);});
    this.damageFlash=Math.max(0,this.damageFlash-dt);this.mana+=this.queen.manaRegen*dt;
  }
  spawnEnemy(kind='knight',x){
    const Cls=ANGELIC_ENEMY_ROSTER[kind]||ANGELIC_ENEMY_ROSTER.knight;const y=kind==='bat'?this.scene.config.ground-150:this.scene.config.ground;
    const enemy=new Cls(this.scene,x??(this.queen.x+520),y);this.enemies.add(enemy);this.scene.physics.add.collider(enemy,this.scene.world.groundBody);return enemy;
  }
}
