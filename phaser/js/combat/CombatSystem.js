/* Angelic Black — Phaser M5 combat parity foundation. */
class CombatSystem {
  constructor(scene, queen){
    this.scene = scene;
    this.queen = queen;
    this.projectiles = scene.physics.add.group();
    this.enemies = scene.physics.add.group();
    this.shots = [];
    this.enemyProjectiles = [];
    this.castCooldown = 0;
    this.chargeTime = 0;
    this.charging = false;
    this.damageFlash = 0;
    this.waveKills = 0;
    this.totalKills = 0;

    scene.physics.add.overlap(this.projectiles, this.enemies, (p,e) => this.hitEnemy(p,e));
    scene.physics.add.overlap(this.queen, this.enemies, (_,e) => this.enemyContact(e));
  }

  get mana(){ return this.queen.mana ?? 100; }
  set mana(v){ this.queen.mana = Phaser.Math.Clamp(v,0,this.queen.maxMana ?? 100); }

  beginBasicCast(){
    if(this.castCooldown > 0 || this.charging) return false;
    if(this.mana < 4) return false;
    this.mana -= 4;
    this.castCooldown = 0.18;
    this.fireProjectile(1, 4);
    this.queen.playAction('cast');
    return true;
  }

  startCharge(){
    if(this.castCooldown > 0 || this.charging || this.mana < 18) return false;
    this.charging = true;
    this.chargeTime = 0;
    this.queen.playAction('cast');
    return true;
  }

  releaseCharge(){
    if(!this.charging) return false;
    this.charging = false;
    if(this.chargeTime < 0.25) return this.beginBasicCast();
    if(this.mana < 18) return false;
    this.mana -= 18;
    const power = Phaser.Math.Clamp(this.chargeTime / 2, 0.25, 1);
    this.castCooldown = 0.35;
    this.fireProjectile(power, 10 + Math.round(power * 10));
    this.queen.playAction('cast');
    this.scene.cameras.main.shake(80,0.002 + power * 0.006);
    return true;
  }

  fireProjectile(power, damage){
    const face = this.queen.face || 1;
    const startX = this.queen.x + face * 34;
    const startY = this.queen.y - 60;
    const orb = this.scene.add.circle(startX,startY,5 + power * 2,0x9d78ff,1).setDepth(35);
    this.scene.physics.add.existing(orb);
    orb.body.setAllowGravity(false);
    orb.body.setVelocityX(face * (520 + power * 260));
    orb.body.setCircle(5 + power * 2, -(5 + power * 2), -(5 + power * 2));
    orb.setDataEnabled();
    orb.setData('damage',damage);
    orb.setData('life',1.6);
    orb.setData('power',power);
    this.projectiles.add(orb);
  }

  hitEnemy(projectile, enemy){
    if(!projectile.active || !enemy.active || enemy.isDead) return;
    const damage = projectile.getData('damage') || 4;
    enemy.takeDamage(damage, this.queen.face || 1);
    this.destroyProjectile(projectile);
    this.scene.cameras.main.shake(55,0.0025);
    this.damageFlash = Math.max(this.damageFlash,0.08);
  }

  enemyContact(enemy){
    if(!enemy.active || enemy.isDead || this.queen.invulnerable) return;
    if(enemy.contactCooldown > 0) return;
    enemy.contactCooldown = 0.8;
    this.queen.hp = Math.max(0,(this.queen.hp ?? 100) - enemy.damage);
    this.queen.invulnerable = true;
    this.queen.playAction('hurt');
    this.scene.time.delayedCall(350,()=>{ this.queen.invulnerable=false; });
    this.scene.cameras.main.shake(100,0.005);
  }

  destroyProjectile(projectile){
    if(!projectile.active) return;
    projectile.destroy();
  }

  update(delta){
    const dt = Math.min(delta,50)/1000;
    if(this.castCooldown > 0) this.castCooldown = Math.max(0,this.castCooldown-dt);
    if(this.charging) this.chargeTime += dt;

    this.projectiles.children.each(p=>{
      if(!p || !p.active) return;
      const life = (p.getData('life') || 0) - dt;
      p.setData('life',life);
      p.scale = 1 + Math.sin(performance.now()*0.02) * 0.08;
      if(life <= 0 || p.x < -80 || p.x > this.scene.physics.world.bounds.right + 80) p.destroy();
    });

    this.enemies.children.each(e=>{
      if(!e || !e.active) return;
      e.updateAI(this.queen,dt);
      e.contactCooldown = Math.max(0,(e.contactCooldown||0)-dt);
      if(e.hitFlash > 0) e.hitFlash = Math.max(0,e.hitFlash-dt);
    });

    this.damageFlash = Math.max(0,this.damageFlash-dt);
    if(this.queen.manaRegen){
      this.mana = this.mana + this.queen.manaRegen * dt;
    }
  }

  spawnEnemy(kind='knight',x){
    const enemy = new KnightEnemy(this.scene,x ?? (this.queen.x + 520),this.scene.config.ground-22);
    this.enemies.add(enemy);
    this.scene.physics.add.collider(enemy,this.scene.world.groundBody);
    return enemy;
  }
}

class KnightEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y){
    super(scene,x,y,'knight-fallback');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.hp=12; this.maxHp=12; this.damage=12; this.speed=82; this.isDead=false;
    this.contactCooldown=0; this.hitFlash=0; this.face=-1; this.phase=Math.random()*6;
    this.setOrigin(0.5,1); this.setDepth(18); this.setBodySize(28,52,true);
    this.setCollideWorldBounds(true);
  }

  takeDamage(amount, knockDir){
    if(this.isDead) return;
    this.hp -= amount;
    this.hitFlash = 0.10;
    this.setVelocityX(knockDir * 150);
    if(this.hp <= 0){
      this.isDead = true;
      this.body.enable = false;
      this.scene.tweens.add({targets:this,alpha:0,duration:260,onComplete:()=>this.destroy()});
    }
  }

  updateAI(player,dt){
    if(this.isDead) return;
    const dx = player.x - this.x;
    this.face = dx < 0 ? -1 : 1;
    if(Math.abs(dx) > 42){
      this.setVelocityX(this.face * this.speed);
      this.setFlipX(this.face < 0);
    } else {
      this.setVelocityX(0);
    }

    if(this.hitFlash > 0){
      this.setTint(0xffffff);
    } else {
      this.clearTint();
    }
    this.y = Math.min(this.y, this.scene.config.ground);
  }
}
