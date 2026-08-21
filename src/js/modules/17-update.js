/* ================= UPDATE ================= */
function update(dt){
  var cin=readInput(), p=player, i;

  if(hitstopT>0){ hitstopT-=dt; updateFx(dt); return; }

  p.animT+=dt;
  wardT=Math.max(0,wardT-dt);
  p.invT=Math.max(0,p.invT-dt);

  if(p.burnT>0&&p.alive){
    p.burnT-=dt; p.burnTick-=dt;
    if(Math.random()<0.5)parts.push({x:p.x+rnd(-9,9),y:p.y-rnd(30,70),vx:rnd(-8,8),vy:rnd(-70,-40),g:0,
      life:0.35,max:0.35,c:Math.random()<0.5?'#ff9a3d':'#ff5c3d',size:3});
    if(p.burnTick<=0){ p.burnTick=0.8; p.hp-=2;
      floater(p.x,p.y-105,'-2 BURN','#ff9a3d');
      if(p.hp<=0){ killPlayer(); } }
  }

  var mv=0; if(cin.left)mv-=1; if(cin.right)mv+=1;
  p.walking=mv!==0&&p.onGround;
  if(mv!==0)p.face=mv;
  p.vx=mv*SPEED;
  if(cin.jump&&p.onGround){ p.vy=JUMPV; p.onGround=false; sfx.jump(); puff(p.x,p.y,6,'#6b4a8f',60,200,0.3,2); }
  p.vy+=GRAV*dt;
  p.x=clamp(p.x+p.vx*dt,30,WORLD_W-30);
  p.y+=p.vy*dt;
  if(p.y>=GROUND){ p.y=GROUND; p.vy=0; p.onGround=true; }
  p.castCd-=dt; p.castFx-=dt; p.summonCd-=dt; p.rejectCd-=dt;
  p.heavyCd=Math.max(0,p.heavyCd-dt); p.swordCd=Math.max(0,p.swordCd-dt); p.shieldCd=Math.max(0,p.shieldCd-dt);
  p.hurtT-=dt;

  if(boltHeld){ boltHold+=dt;
    if(boltHold>0.25){
      chargeT=Math.min(CHARGE_FULL,chargeT+dt);
      if(chargeT>=CHARGE_FULL&&!apexPlayed){ apexPlayed=true; sfx.apex(); flashT=Math.max(flashT,0.06); }
    }
  }

  if(p.lanceT>0){
    p.lanceT-=dt;
    if(Math.random()<0.6){
      var el2=0.65-p.lanceT;
      parts.push({x:p.x+p.face*(26+rnd(-14,14)),y:p.y-60+rnd(-10,10),
        vx:-p.face*rnd(30,80)*(el2>0.3?1.4:1),vy:rnd(-20,20),g:0,life:0.25,max:0.25,
        c:el2>0.45?'#e8f6ff':'#7446ab',size:2});
    }
    if(p.lanceT<=0){ startBeam(p); }
  }
  if(p.beam){ var bm=p.beam; bm.t+=dt;
    if(!bm.hit){ bm.hit=true; beamDamage(p); }
    if(bm.t>0.45&&Math.random()<0.8){
      var bxr=bm.dir>0?rnd(p.x,camX+VW):rnd(camX,p.x);
      parts.push({x:bxr,y:bm.y+rnd(-10,10),vx:rnd(-30,30),vy:rnd(-60,60),g:0,life:0.3,max:0.3,
        c:Math.random()<0.5?'#7446ab':'#e8f6ff',size:2});
    }
    if(bm.t>0.95)p.beam=null;
  }

  if(p.itemFx){ var fx=p.itemFx; fx.t-=dt;
    if(fx.k==='heart'){
      if(!fx.burst&&fx.t<0.28){ fx.burst=true; sfx.crush();
        puff(p.x+p.face*12,p.y-62,10,'#7446ab',120,-40,0.5,3);
        puff(p.x+p.face*12,p.y-62,6,'#1c0a2a',90,-20,0.5,3);
        for(var e=0;e<6;e++)parts.push({x:p.x+rnd(-16,16),y:p.y-rnd(30,80),vx:0,vy:60,g:0,life:0.4,max:0.4,c:'#b18cff',size:2}); }
    } else if(fx.k==='shard'){
      if(Math.random()<0.8)parts.push({x:p.x+p.face*10+rnd(-5,5),y:p.y-66+rnd(-5,5),vx:-p.face*40,vy:-8,g:0,life:0.3,max:0.3,c:'#b8ffe0',size:2});
      if(!fx.burst&&fx.t<0.15){ fx.burst=true; sfx.absorb(); }
    }
    if(fx.t<=0)p.itemFx=null;
  }

  if(levelFxT>0){
    levelFxT-=dt;
    if(Math.random()<0.85)parts.push({x:p.x+rnd(-14,14),y:p.y-rnd(0,80),vx:rnd(-6,6),vy:rnd(-90,-50),g:0,
      life:rnd(0.4,0.8),max:0.8,c:'#b18cff',size:3});
  }
  if(p.onGround&&!p.walking&&Math.random()<dt*1.5){
    parts.push({x:p.x+p.face*22,y:p.y-98,vx:rnd(-6,6),vy:rnd(-30,-14),g:0,life:0.7,max:0.7,c:'#5cffa0',size:2});
  }

  p.mana=Math.min(p.maxMana,p.mana+p.manaRegen*dt);
  camX+=((p.x-VW*0.5)-camX)*Math.min(1,dt*5); camX=clamp(camX,0,WORLD_W-VW);
  shakeT=Math.max(0,shakeT-dt);

  for(i=0;i<deco.length;i++){ var dc=deco[i];
    if(dc.type===4&&!dc.taken&&Math.abs(p.x-dc.x)<26){ dc.taken=true; gold+=2; sfx.coin();
      floater(dc.x,GROUND-40,'+2 GOLD','#d8a94e'); toonPop(dc.x,GROUND-20);
      puff(dc.x,GROUND-14,6,'#d8a94e',90,200,0.4,2); } }

  for(i=0;i<pickups.length;i++){ var pu=pickups[i]; pu.t+=dt;
    var dxp=p.x-pu.x;
    if(Math.abs(dxp)<80)pu.x+=Math.sign(dxp)*140*dt;
    if(Math.abs(dxp)<22&&p.alive){
      pu.dead=true; toonPop(pu.x,pu.y);
      if(pu.kind==='heart'){ p.hp=Math.min(p.maxHp,p.hp+40); recoverCooldowns(PICK_CD_PCT);
        doHeartFx(); floater(pu.x,pu.y-24,'+40 LIFE','#ff8d9d'); }
      else if(pu.kind==='shard'){ p.mana=Math.min(p.maxMana,p.mana+40); recoverCooldowns(PICK_CD_PCT);
        doShardFx(); floater(pu.x,pu.y-24,'+40 MANA','#7dffc0'); }
      else if(pu.kind==='wisp'){ p.mana=Math.min(p.maxMana,p.mana+15);
        sfx.pick(); floater(pu.x,pu.y-24,'+15 MANA','#7dffc0'); }
      else if(pu.kind==='grief'){ inv.grief++; sfx.pick(); floater(pu.x,pu.y-24,"ALCHEMIST'S GRIEF",'#cfd6e6'); }
      else { gold+=1; sfx.coin(); floater(pu.x,pu.y-24,'+1 GOLD','#d8a94e'); puff(pu.x,pu.y,6,'#d8a94e',90,200,0.4,2); }
    } }
  pickups=pickups.filter(function(pp){return !pp.dead;});

  for(i=0;i<bolts.length;i++){ var b=bolts[i];
    b.x+=b.vx*dt; b.life-=dt;
    if(b.kind==='basic'&&Math.random()<0.7)parts.push({x:b.x,y:b.y,vx:0,vy:0,g:0,life:0.2,max:0.2,c:'#3dfc9a',size:2});
    for(var j=0;j<foes.length;j++){ var f0=foes[j]; if(f0.dead||f0.dying)continue;
      var cy=foeCY(f0);
      if(b.kind==='wave'){
        if(b.hits.indexOf(f0)>=0)continue;
        if(Math.abs(b.x-f0.x)<26&&Math.abs(b.y-cy)<130){
          b.hits.push(f0);
          f0.hp-=2; f0.hurtT=0.15;
          if(Math.random()<0.6){ f0.stunT=Math.max(f0.stunT||0,0.8); sfx.stun(); }
          f0.kb=((f0.kind==='boss'||f0.kind==='skelord')?0.2:1)*(b.vx>0?1:-1)*90;
          sfx.hit(); puff(b.x,cy,6,'#b18cff',120,-40,0.35,3);
          if(f0.hp<=0)foeDie(f0);
        }
        continue;
      }
      var vr=f0.kind==='boss'?70:(f0.kind==='skelord'?120:(f0.kind==='fly'?20:(f0.kind==='mage'?30:34)));
      var rr2=(f0.kind==='skelord'?44:(f0.kind==='fly'?18:30));
      if(Math.abs(b.x-f0.x)<rr2&&Math.abs(b.y-cy)<vr){
        f0.hp-=1; f0.hurtT=0.15; f0.kb=((f0.kind==='boss'||f0.kind==='skelord')?0.2:1)*(b.vx>0?1:-1)*130;
        b.life=0; sfx.hit();
        if(f0.hp<=0)foeDie(f0);
        break;
      } } }
  bolts=bolts.filter(function(bb){return bb.life>0&&bb.x>camX-80&&bb.x<camX+VW+80;});

  for(i=0;i<ebolts.length;i++){ var eb=ebolts[i];
    eb.x+=eb.vx*dt; eb.y+=eb.vy*dt; eb.life-=dt;
    if(Math.random()<0.8)parts.push({x:eb.x,y:eb.y,vx:rnd(-10,10),vy:rnd(-30,0),g:0,life:0.25,max:0.25,
      c:Math.random()<0.5?'#ff9a3d':'#ff5c3d',size:2});
    if(p.alive&&Math.abs(eb.x-p.x)<20&&Math.abs(eb.y-(p.y-56))<26){
      eb.dead=true;
      hurtPlayer(10,eb.vx>0?1:-1,true);
      if(p.alive){ p.burnT=4; p.burnTick=0.8; floater(p.x,p.y-118,'IGNITED','#ff9a3d'); sfx.fire();
        if(!counterTutDone){ openCounterTutorial(); } }
    } }
  ebolts=ebolts.filter(function(eb2){return !eb2.dead&&eb2.life>0&&eb2.x>camX-120&&eb2.x<camX+VW+120&&eb2.y<VH+40;});

  for(i=0;i<arrows.length;i++){ var ar=arrows[i];
    ar.x+=ar.vx*dt; ar.y+=ar.vy*dt; ar.life-=dt;
    for(var aj=0;aj<foes.length;aj++){ var af=foes[aj]; if(af.dead||af.dying)continue;
      var acy=foeCY(af);
      if(Math.abs(ar.x-af.x)<20&&Math.abs(ar.y-acy)<30){
        ar.dead=true; af.hp-=minionDmg(af); af.hurtT=0.15; sfx.hit();
        puff(ar.x,ar.y,4,'#e8e6d4',80,200,0.3,2);
        if(af.hp<=0)foeDie(af);
        break; } } }
  arrows=arrows.filter(function(ar2){return !ar2.dead&&ar2.life>0;});

  for(i=0;i<swordRain.length;i++){ var sw=swordRain[i]; if(sw.dead)continue;
    if(sw.delay>0){ sw.delay-=dt; continue; }
    sw.y+=sw.vy*dt;
    if(Math.random()<0.5)parts.push({x:sw.x+rnd(-3,3),y:sw.y-20,vx:0,vy:-40,g:0,life:0.25,max:0.25,c:'#7fd4ff',size:2});
    if(sw.y>=GROUND){ sw.dead=true; shakeT=Math.max(shakeT,0.12);
      puff(sw.x,GROUND,6,'#bfe8ff',150,400,0.45,3);
      puff(sw.x,GROUND-10,4,'#e8f6ff',180,-60,0.3,2); sfx.swordHit();
      for(var fj=0;fj<foes.length;fj++){ var fs=foes[fj]; if(fs.dead||fs.dying)continue;
        var hitR=fs.kind==='boss'?48:(fs.kind==='skelord'?52:36);
        if(Math.abs(fs.x-sw.x)<hitR){ fs.hp-=2; fs.hurtT=0.2;
          if(Math.random()<0.3){ fs.stunT=(fs.kind==='boss'||fs.kind==='skelord')?0.6:1.2; sfx.stun(); }
          if(fs.hp<=0)foeDie(fs); } } } }
  swordRain=swordRain.filter(function(ss){return !ss.dead;});

  var meleeKinds={knight:1,zombie:1,cultist:1,mara:1};
  for(i=0;i<foes.length;i++){ var f=foes[i]; if(f.dead||f.dying)continue;
    f.hurtT-=dt; f.atkCd-=dt; f.lungeT-=dt; if(f.touchCd)f.touchCd-=dt;
    f.x+=f.kb*dt; f.kb*=(1-Math.min(1,dt*7));
    if(f.stunT>0){ f.stunT-=dt; continue; }
    if(meleeKinds[f.kind]){
      var rng=(f.kind==='knight'?140:(f.kind==='zombie'?120:(f.kind==='mara'?150:130)));
      var tgt=null, bd=rng;
      for(var mi=0;mi<minions.length;mi++){ var mm=minions[mi]; if(mm.dead)continue;
        var dd=Math.abs(mm.x-f.x); if(dd<bd){bd=dd;tgt=mm;} }
      if(tgt&&!f.engagedOnce){ f.engagedOnce=true; f.pushing=Math.random()<0.5; f.pushT=2.5;
        if(f.pushing)floater(f.x,foeCY(f)-24,'!','#ff5c6d'); }
      if(f.pushing){ f.pushT-=dt; if(f.pushT<=0)f.pushing=false; tgt=null; }
      if(!tgt&&p.alive){ tgt=p; bd=Math.abs(p.x-f.x); }
      if(tgt){ var d2=Math.abs(tgt.x-f.x); f.face=tgt.x>f.x?1:-1;
        var stopD=(f.kind==='knight')?28:(f.kind==='zombie'?32:(f.kind==='mara'?26:26));
        if(d2>stopD){ f.x+=f.face*f.speed*dt; f.phase+=dt*(f.kind==='knight'?8:(f.kind==='mara'?10:6)); }
        else if(f.atkCd<=0){ f.atkCd=(f.kind==='knight')?1.1:(f.kind==='zombie'?1.6:(f.kind==='mara'?0.9:1.2)); f.lungeT=0.25;
          if(tgt===p){
            var low=(f.kind==='zombie')?(p.y>GROUND-40):(p.y>GROUND-46);
            if(low){ hurtPlayer(DMG[f.kind],f.face); } else { sfx.whiff(); }
          }
          else { tgt.hp-=(f.kind==='knight')?1:(f.kind==='mara'?2:2); sfx.hit(); puff(tgt.x,tgt.y-24,5,'#e8e6d4',90,400,0.4,2);
            if(tgt.hp<=0)minionDie(tgt); } } }
    } else if(f.kind==='mage'){
      f.phase+=dt*2; f.atkCd-=dt;
      var mdx=p.x-f.x, adx=Math.abs(mdx);
      f.face=mdx>0?1:-1;
      if(adx<200)f.x-=f.face*40*dt; else if(adx>340)f.x+=f.face*30*dt;
      f.x=clamp(f.x,40,WORLD_W-40);
      f.y=f.baseY+Math.sin(f.phase)*10;
      if(f.atkCd<=0&&p.alive){ f.atkCd=rnd(2.4,3.4);
        var ty=p.y-56, dxx=p.x-f.x, dyy=ty-f.y;
        var L=Math.sqrt(dxx*dxx+dyy*dyy)||1;
        ebolts.push({x:f.x,y:f.y+6,vx:dxx/L*260,vy:dyy/L*260,life:4,dead:false});
        sfx.fire(); }
    } else if(f.kind==='bat'){
      f.phase+=dt*6; f.baseY+=((p.y-80)-f.baseY)*Math.min(1,dt*1.2);
      f.face=p.x>f.x?1:-1; f.x+=f.face*f.speed*dt;
      f.y=f.baseY+Math.sin(f.phase)*22;
      if(p.alive&&p.hurtT<=0&&p.invT<=0&&Math.abs(f.x-p.x)<24&&f.y>p.y-92&&f.y<p.y-6){
        hurtPlayer(DMG.bat,f.face); f.dead=true; puff(f.x,f.y,8,'#5b3a86',120,300,0.5,3); }
    } else if(f.kind==='fly'){
      f.life-=dt; if(f.life<=0){ f.dead=true; puff(f.x,f.y,3,'#9fd8ff',60,100,0.3,2); continue; }
      f.phase+=dt*20;
      var fdx=p.x-f.x, fdy=(p.y-60)-f.y;
      var fl2=Math.sqrt(fdx*fdx+fdy*fdy)||1;
      f.x+=(fdx/fl2)*130*dt+Math.sin(f.phase)*30*dt;
      f.y+=(fdy/fl2)*130*dt+Math.cos(f.phase)*24*dt;
      if(p.alive&&p.hurtT<=0&&p.invT<=0&&Math.abs(fdx)<18&&Math.abs(fdy)<26){
        hurtPlayer(4,fdx>0?1:-1); f.dead=true; puff(f.x,f.y,5,'#9fd8ff',90,200,0.35,2); }
    } else if(f.kind==='boss'){
      f.phase+=dt*4; f.summonCd-=dt;
      var btgt=null, bbd=170;
      for(var bi=0;bi<minions.length;bi++){ var bm=minions[bi]; if(bm.dead)continue;
        var bdd=Math.abs(bm.x-f.x); if(bdd<bbd){bbd=bdd;btgt=bm;} }
      if(!btgt&&p.alive){ btgt=p; bbd=Math.abs(p.x-f.x); }
      if(btgt){ var bd3=Math.abs(btgt.x-f.x); f.face=btgt.x>f.x?1:-1;
        if(bd3>52){ f.x+=f.face*f.speed*dt; }
        else if(f.atkCd<=0){ f.atkCd=1.6; f.lungeT=0.4; shakeT=Math.max(shakeT,0.3); sfx.slam();
          if(btgt===p){ if(p.y>GROUND-52){ hurtPlayer(DMG.boss,f.face); } else { sfx.whiff(); } }
          else { btgt.hp-=2; sfx.hit(); if(btgt.hp<=0)minionDie(btgt); } } }
      if(f.summonCd<=0){ f.summonCd=6; sfx.bossSummon();
        puff(f.x,f.y-110,14,'#c05cff',140,-40,0.7,3);
        spawnBatAt(clamp(f.x-70,40,WORLD_W-40),f.y-130);
        spawnBatAt(clamp(f.x+70,40,WORLD_W-40),f.y-130); }
    } else if(f.kind==='skelord'){
      f.phase+=dt*3; f.summonCd-=dt; f.swarmCd-=dt;
      var flyCount=0; for(var fc=0;fc<foes.length;fc++)if(foes[fc].kind==='fly'&&!foes[fc].dead)flyCount++;
      if(f.summonCd<=0){ f.summonCd=6; if(flyCount<10){ sfx.bossSummon();
        spawnFly(clamp(f.x-40,40,WORLD_W-40),f.y-150); spawnFly(clamp(f.x+40,40,WORLD_W-40),f.y-160); } }
      if(f.swarmCd<=0){ f.swarmCd=9; sfx.buzz();
        for(var s4=0;s4<4;s4++){ spawnFly(clamp(camX+rnd(0,VW),40,WORLD_W-40),rnd(80,200)); } }
      if(p.alive&&Math.abs(p.x-f.x)<44&&f.touchCd<=0&&p.hurtT<=0){
        f.touchCd=1.0; hurtPlayer(10,f.face); }
      var st2=null, sbd=190;
      for(var mi2=0;mi2<minions.length;mi2++){ var mm2=minions[mi2]; if(mm2.dead)continue;
        var dd2=Math.abs(mm2.x-f.x); if(dd2<sbd){sbd=dd2;st2=mm2;} }
      if(!st2&&p.alive){ st2=p; sbd=Math.abs(p.x-f.x); }
      if(st2){ var d4=Math.abs(st2.x-f.x); f.face=st2.x>f.x?1:-1;
        if(d4>95){ f.x+=f.face*f.speed*dt; }
        else if(f.atkCd<=0){ f.atkCd=1.8; f.lungeT=0.5; f.atkN++;
          var heavyAtk=f.atkN%3===0;
          shakeT=Math.max(shakeT,heavyAtk?0.45:0.25); sfx.slam();
          if(st2===p){ if(p.y>GROUND-60){ hurtPlayer(heavyAtk?34:28,f.face); } else { sfx.whiff(); } }
          else { st2.hp-=3; sfx.hit(); if(st2.hp<=0)minionDie(st2); } } }
    } }

  for(i=0;i<minions.length;i++){ var m3=minions[i]; if(m3.dead)continue;
    if(m3.rise===undefined)m3.rise=1;
    if(m3.rise<1){ m3.rise=Math.min(1,m3.rise+dt/1.2); continue; }
    m3.atkCd-=dt; m3.phase+=dt*9;
    var mtgt=null, mbd=260;
    for(var fi=0;fi<foes.length;fi++){ var ff=foes[fi]; if(ff.dead||ff.dying)continue;
      var fd2=Math.abs(ff.x-m3.x); if(fd2<mbd){mbd=fd2;mtgt=ff;} }
    if(mtgt){ m3.face=mtgt.x>m3.x?1:-1;
      if(m3.kind==='archer'){
        var adist=mbd;
        if(adist>280)m3.x+=m3.face*100*dt;
        else if(adist<180)m3.x-=m3.face*90*dt;
        if(m3.atkCd<=0&&adist<420){ m3.atkCd=1.3;
          var aty=foeCY(mtgt);
          var adx2=mtgt.x-m3.x, ady2=aty-(m3.y-40);
          var aL=Math.sqrt(adx2*adx2+ady2*ady2)||1;
          arrows.push({x:m3.x+m3.face*8,y:m3.y-40,vx:adx2/aL*520,vy:ady2/aL*520,life:2,dead:false});
          sfx.arrow(); }
      } else {
        var mrange=mtgt.kind==='boss'?46:(mtgt.kind==='skelord'?56:26);
        if(mbd>mrange){ m3.x+=m3.face*110*dt; }
        else if(m3.atkCd<=0){
          m3.atkCd=(m3.name==='nameA')?0.6:(m3.name==='nameB')?1.0:0.75;
          var mdmg=minionDmg(mtgt)+(m3.name==='nameB'?1:0);
          mtgt.hp-=mdmg; mtgt.hurtT=0.15;
          mtgt.kb=(mtgt.kind==='boss'||mtgt.kind==='skelord'?0.1:1)*m3.face*90; sfx.hit();
          if(mtgt.pushing){ puff(mtgt.x,foeCY(mtgt),6,'#b18cff',110,-40,0.35,3);
            floater(mtgt.x,foeCY(mtgt)-20,''+mdmg,'#e8e6d4'); }
          if(mtgt.hp<=0)foeDie(mtgt); }
      }
    } else {
      if(m3.name==='nameA'||m3.name==='nameB'){
        var guardX=p.x+(m3.name==='nameA'?-46:46);
        if(Math.abs(m3.x-guardX)>8){ m3.x+=(guardX>m3.x?1:-1)*80*dt; }
        m3.face=m3.name==='nameA'?-1:1;
      } else { m3.x+=m3.face*70*dt; if(m3.x<50||m3.x>WORLD_W-50)m3.face*=-1; }
    } }

  foes=foes.filter(function(ff2){return !ff2.dead;});
  minions=minions.filter(function(mm3){return !mm3.dead;});

  if(stageNum===1&&!zombSceneDone){
    for(i=0;i<foes.length;i++){ var zf=foes[i];
      if(zf.kind==='zombie'&&zf.x>camX+30&&zf.x<camX+VW-30){ zombSceneDone=true; firstZombieCS(); break; } } }

  if(inv.jester>0&&!jesterSpoken&&jesterT>0){
    jesterT-=dt;
    if(jesterT<=0){ jesterSpoken=true; jesterCS(); } }

  if(spawnQueue>0){ spawnT-=dt;
    if(spawnT<=0){ spawnT=currentCompInterval(); spawnOne(); spawnQueue--; } }
  else if(foes.length===0){ betweenT-=dt;
    if(betweenT<=0){ betweenT=2.0; gainXp(30+waveNum*5); waveNum++; beginWave(waveNum); } }
  else { betweenT=2.0; }
  bannerT-=dt;

  updateFx(dt);
  progressRise(dt);

  wispT-=dt;
  if(wispT<=0){ wispT=0.5;
    parts.push({x:camX+rnd(0,VW),y:GROUND+rnd(-4,10),vx:rnd(-8,8),vy:rnd(-40,-20),g:0,life:rnd(1.5,3),max:3,c:'#5cffa0',size:2}); }

  syncSlots();
  if(p.alive&&p.xp>=p.xpNeed&&mode==='playing'){ openLevelUp(); }
}
function currentCompInterval(){
  var wd=waveDef(waveNum);
  return Math.max(0.25,(wd.interval||0.8)-waveNum*0.01);
}

