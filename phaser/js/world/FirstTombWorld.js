/* Angelic Black — Phaser M4 First Tomb world presentation. */
class FirstTombWorld {
  constructor(scene){
    this.scene = scene;
    this.cfg = window.ANGELIC_PHASER_CONFIG;
    this.width = this.cfg.worldWidth;
    this.height = this.cfg.height;
    this.groundY = this.cfg.ground;
    this.depths = [];
    this.fog = [];
    this.build();
  }

  build(){
    this.buildParallax();
    this.buildGround();
    this.buildDecorations();
    this.buildFog();
  }

  buildParallax(){
    const s = this.scene;
    const depths = [
      { factor: 0.12, color: 0x120b20, base: 300, step: 260, peak: 155 },
      { factor: 0.24, color: 0x1b102b, base: 350, step: 210, peak: 190 },
      { factor: 0.38, color: 0x29183b, base: 395, step: 165, peak: 225 }
    ];

    depths.forEach((d, index) => {
      const g = s.add.graphics();
      g.setDepth(index);
      g.fillStyle(d.color, 1);
      g.fillRect(0, 0, this.width, this.height);
      g.fillStyle(index === 0 ? 0x2a1738 : index === 1 ? 0x312044 : 0x38254c, 1);

      for (let x = -100; x < this.width + 300; x += d.step) {
        const h = d.peak + ((x / d.step) % 3) * 24;
        const w = Math.max(40, d.step * 0.28);
        g.fillRect(x, d.base - h, w, h);
        if (index === 2) {
          g.fillRect(x + w * 0.18, d.base - h - 18, w * 0.64, 18);
        }
      }

      g.setScrollFactor(d.factor, 0);
      this.depths.push(g);
    });

    const moon = s.add.circle(760, 116, 44, 0xefe9d8, 1);
    moon.setDepth(1).setScrollFactor(0.08, 0);
    this.moon = moon;
  }

  buildGround(){
    const s = this.scene;
    const g = s.add.graphics();
    g.setDepth(10);
    const groundGrad = new Phaser.Display.Color(0x24,0x16,0x28);
    g.fillStyle(groundGrad.color, 1);
    g.fillRect(0, this.groundY, this.width, this.height - this.groundY + 10);
    g.fillStyle(0x3c4a33, 1);
    g.fillRect(0, this.groundY, this.width, 7);
    g.fillStyle(0x2c3826, 1);
    g.fillRect(0, this.groundY + 7, this.width, 3);

    for (let x = 0; x < this.width; x += 32) {
      const h = (Math.floor(x / 32) * 17) % 24;
      g.fillStyle(0x4a5a3e, 1);
      g.fillRect(x + h, this.groundY, 4, 2);
      if ((x / 32) % 11 === 0) {
        g.fillStyle(0xcfc9b4, 1);
        g.fillRect(x + 12, this.groundY + 14, 8, 6);
        g.fillStyle(0x0a0510, 1);
        g.fillRect(x + 14, this.groundY + 16, 2, 2);
        g.fillRect(x + 18, this.groundY + 16, 2, 2);
      } else if ((x / 32) % 7 === 0) {
        g.fillStyle(0x3a2c4d, 1);
        g.fillRect(x + 10, this.groundY + 16, 10, 6);
      }
    }

    const fade = s.add.graphics();
    fade.fillGradientStyle(0x05020a, 0x05020a, 0x05020a, 0x05020a, 0, 0.88, 0.88, 0);
    fade.fillRect(0, this.height - 120, this.width, 120);
    fade.setDepth(11);

    this.groundVisual = g;
    this.groundFade = fade;

    const groundBody = s.add.rectangle(this.width / 2, this.groundY + 42, this.width, 84, 0x000000, 0);
    s.physics.add.existing(groundBody, true);
    groundBody.body.setSize(this.width, 84);
    this.groundBody = groundBody;
  }

  buildDecorations(){
    const s = this.scene;
    const deco = s.add.graphics();
    deco.setDepth(12);

    for (let i = 0; i < 36; i++) {
      const x = 80 + i * 83;
      const variant = i % 4;
      deco.fillStyle(0x241b31, 1);
      if (variant === 0) {
        deco.fillRect(x, this.groundY - 22, 16, 22);
        deco.fillCircle(x + 8, this.groundY - 22, 8);
      } else if (variant === 1) {
        deco.fillRect(x + 5, this.groundY - 30, 5, 30);
        deco.fillRect(x - 2, this.groundY - 24, 19, 5);
      } else if (variant === 2) {
        deco.fillRect(x, this.groundY - 26, 12, 26);
        deco.fillRect(x + 2, this.groundY - 30, 8, 4);
      } else {
        deco.fillRect(x, this.groundY - 12, 3, 12);
        deco.fillRect(x + 12, this.groundY - 12, 3, 12);
        deco.fillRect(x - 1, this.groundY - 18, 17, 2);
      }
    }

    this.decorations = deco;
  }

  buildFog(){
    const s = this.scene;
    for (let i = 0; i < 6; i++) {
      const cloud = s.add.ellipse(180 + i * 210, this.groundY - 16 + (i % 3) * 10, 220 + i * 15, 32, 0x8a7ba8, 0.055);
      cloud.setDepth(40);
      this.fog.push({ sprite: cloud, speed: 12 + i * 4, baseX: cloud.x, span: 900 });
    }
  }

  update(time, delta){
    const dt = delta / 1000;
    this.fog.forEach((f, i) => {
      f.sprite.x += f.speed * dt;
      if (f.sprite.x > f.baseX + f.span) f.sprite.x = f.baseX - 160;
      f.sprite.alpha = 0.035 + Math.sin(time * 0.001 + i) * 0.012;
    });
  }
}
