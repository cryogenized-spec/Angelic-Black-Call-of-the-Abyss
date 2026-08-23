/* Angelic Black — Necro Queen player foundation. */
class NecroQueen extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey){
    super(scene, x, y, textureKey || 'queen-fallback');
    this.scene = scene;
    this.speed = 220;
    this.accel = 1500;
    this.drag = 1800;
    this.jumpVelocity = -520;
    this.face = 1;
    this.state = 'idle';
    this.coyoteTime = 0;
    this.jumpBuffer = 0;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setMaxVelocity(360, 900);
    this.setDragX(this.drag);
    this.setGravityY(1250);
    this.setBodySize(34, 78, true);
    this.setOrigin(0.5, 1);
    this.setDepth(20);
  }
  updateControl(cursors, jumpPressed, dt){
    const body = this.body;
    const onFloor = body.blocked.down || body.touching.down;
    if (onFloor) this.coyoteTime = 0.10;
    else this.coyoteTime = Math.max(0, this.coyoteTime - dt);
    if (jumpPressed) this.jumpBuffer = 0.12;
    else this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
    let move = 0;
    if (cursors.left.isDown) move -= 1;
    if (cursors.right.isDown) move += 1;
    if (move !== 0){
      this.setAccelerationX(move * this.accel);
      this.setFlipX(move < 0);
      this.face = move < 0 ? -1 : 1;
    } else this.setAccelerationX(0);
    if (this.jumpBuffer > 0 && this.coyoteTime > 0){
      this.setVelocityY(this.jumpVelocity);
      this.jumpBuffer = 0;
      this.coyoteTime = 0;
    }
    if (!onFloor) this.state = body.velocity.y < 0 ? 'jump' : 'fall';
    else if (Math.abs(body.velocity.x) > 18) this.state = 'walk';
    else this.state = 'idle';
  }
  setAnimationState(){
    if (this.texture && this.texture.key !== 'queen-fallback' && this.anims){
      const key = 'queen-' + this.state;
      if (this.anims.exists(key) && this.anims.currentAnim?.key !== key) this.play(key, true);
    }
  }
}
