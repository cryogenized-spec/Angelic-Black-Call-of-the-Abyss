/* ================= WORLD DRAW ================= */
function drawBackdrop(g){
  var grd=g.createLinearGradient(0,0,0,VH);
  grd.addColorStop(0,'#0d0719'); grd.addColorStop(0.55,'#241239'); grd.addColorStop(1,'#3a1e4e');
  g.fillStyle=grd; g.fillRect(0,0,VW,VH);
  if(bgReady){
    var bw=VH; var ox=-((camX*0.25)%bw);
    for(var x=ox-bw;x<VW+bw;x+=bw){ g.drawImage(bgImg,x,-30,bw,VH); }
    g.fillStyle='rgba(10,5,20,0.30)'; g.fillRect(0,0,VW,VH);
  } else {
    g.fillStyle='#efe9d8'; g.beginPath(); g.arc(VW*0.72-camX*0.08,110,44,0,6.283); g.fill();
    g.fillStyle='#170d26';
    for(var i=0;i<8;i++){ var hx=((i*173)%(VW+200))-((camX*0.15)%(VW+200));
      g.fillRect(hx,GROUND-90-hashN(i)*60,60,120); }
  }
  if(stageNum>=2){ g.fillStyle='rgba(12,32,18,0.20)'; g.fillRect(0,0,VW,VH); }
}
function drawSkyFx(g){
  if(skyFxT<=0)return;
  var a=clamp(skyFxT/1.1,0,1);
  g.fillStyle='rgba(20,8,32,'+(0.5*a).toFixed(2)+')';
  g.fillRect(0,0,VW,90);
  for(var i=0;i<5;i++){
    var cx=((i*137+tGlobal*60)%(VW+160))-80;
    g.fillStyle='rgba(10,4,18,'+(0.55*a).toFixed(2)+')';
    g.beginPath(); g.ellipse(cx,26+(i%3)*18,90,22,0,0,6.283); g.fill();
  }
  if(Math.random()<0.25*a){
    var lx=rnd(40,VW-40);
    g.strokeStyle='rgba(232,246,255,'+(0.8*a).toFixed(2)+')'; g.lineWidth=2;
    g.beginPath(); g.moveTo(lx,0);
    var ly=0; while(ly<80){ ly+=rnd(10,22); g.lineTo(lx+rnd(-14,14),ly); }
    g.stroke();
    g.fillStyle='rgba(200,180,255,'+(0.10*a).toFixed(2)+')'; g.fillRect(0,0,VW,VH);
  }
}
function drawGround(g){
  var left=camX-8, wAll=VW+16;
  var grd=g.createLinearGradient(0,GROUND,0,VH);
  grd.addColorStop(0,'#241628'); grd.addColorStop(0.5,'#180d1e'); grd.addColorStop(1,'#0a0510');
  g.fillStyle=grd; g.fillRect(left,GROUND,wAll,VH-GROUND+8);
  g.fillStyle='rgba(120,90,160,0.06)';
  g.fillRect(left,GROUND+34,wAll,2); g.fillRect(left,GROUND+72,wAll,2); g.fillRect(left,GROUND+110,wAll,2);
  var tw=32, start=Math.floor((camX-16)/tw), end=Math.ceil((camX+VW+16)/tw);
  for(var ti=start;ti<=end;ti++){
    var wx=ti*tw, h1=hashN(ti);
    g.fillStyle='#3c4a33'; g.fillRect(wx,GROUND,tw,7);
    g.fillStyle='#2c3826'; g.fillRect(wx,GROUND+7,tw,3);
    g.fillStyle='#4a5a3e'; g.fillRect(wx+Math.floor(h1*24),GROUND,4,2);
    if(h1<0.10){ g.fillStyle='#cfc9b4'; g.fillRect(wx+12,GROUND+14,8,6); g.fillRect(wx+13,GROUND+20,6,3);
      g.fillStyle='#0a0510'; g.fillRect(wx+14,GROUND+16,2,2); g.fillRect(wx+18,GROUND+16,2,2);
    } else if(h1<0.2){ g.fillStyle='#3a2c4d'; g.fillRect(wx+10,GROUND+16,10,6); g.fillRect(wx+12,GROUND+14,6,2);
    } else if(h1<0.34){ g.fillStyle=stageNum>=2?'#3a5a3e':'#4a5a3e'; g.fillRect(wx+8,GROUND-3,2,3); g.fillRect(wx+12,GROUND-4,2,4); g.fillRect(wx+16,GROUND-3,2,3); }
  }
  var fade=g.createLinearGradient(0,VH-120,0,VH);
  fade.addColorStop(0,'rgba(5,2,10,0)'); fade.addColorStop(1,'rgba(5,2,10,0.88)');
  g.fillStyle=fade; g.fillRect(left,VH-120,wAll,120);
}
function drawDeco(g){
  for(var i=0;i<deco.length;i++){
    var d=deco[i]; if(d.x<camX-60||d.x>camX+VW+60)continue;
    if(d.type===4){
      if(d.taken)continue;
      g.save(); g.translate(d.x,GROUND+2);
      g.fillStyle='#b9b6a2'; g.fillRect(-10,-4,5,4); g.fillRect(-4,-3,8,2); g.fillRect(5,-4,4,3);
      g.fillStyle='#0a0510'; g.fillRect(-9,-3,1,1); g.fillRect(-7,-3,1,1);
      g.fillStyle='#d8a94e'; g.fillRect(0,-6,2,2); g.fillRect(9,-5,2,2); g.fillRect(-13,-5,2,2);
      g.restore(); continue;
    }
    g.save(); g.translate(d.x,GROUND+2); g.scale(d.s,d.s);
    if(d.type===0){ g.fillStyle='#241b31'; g.fillRect(-8,-22,16,22);
      g.beginPath(); g.arc(0,-22,8,Math.PI,0); g.fill();
      g.fillStyle='#3a2c4d'; g.fillRect(-5,-18,10,2); }
    else if(d.type===1){ g.fillStyle='#241b31'; g.fillRect(-2,-30,5,30); g.fillRect(-9,-24,19,5); }
    else if(d.type===2){ g.fillStyle='#241b31'; g.fillRect(-6,-26,12,26); g.fillRect(-4,-30,8,4);
      g.fillStyle='#3a2c4d'; g.fillRect(-6,-26,2,26); }
    else { g.fillStyle='#241b31'; g.fillRect(-14,-12,3,12); g.fillRect(-2,-14,3,14);
      g.fillRect(10,-12,3,12); g.fillRect(-14,-9,27,2); }
    g.restore();
  }
}
function drawFog(g){
  for(var i=0;i<5;i++){
    var spd=18+i*7, w=200+(i*53)%120;
    var fx=((i*211+tGlobal*spd)%(VW+400))-200;
    var fy=GROUND-14+(i%3)*10;
    g.fillStyle=stageNum>=2?'rgba(150,200,160,0.06)':'rgba(170,150,210,0.06)';
    g.beginPath(); g.ellipse(fx,fy,w,16,0,0,6.283); g.fill();
  }
}
function drawChargeWall(g,p){
  if(!(boltHeld&&boltHold>0.25))return;
  var t=chargeT/CHARGE_FULL;
  var hx=p.x+p.face*30, cy=p.y-80;
  var hgt=20+120*t;
  g.globalAlpha=0.35+0.3*t; g.fillStyle='#1c0a2a'; g.fillRect(hx-4,cy-hgt/2,8,hgt);
  g.globalAlpha=0.5+0.3*t; g.fillStyle='#7446ab'; g.fillRect(hx-2,cy-hgt*0.4,4,hgt*0.8);
  if(chargeT>=CHARGE_FULL){
    g.fillStyle='#ffffff'; g.fillRect(hx-1,cy-hgt*0.45,2,hgt*0.9);
    g.globalAlpha=0.12; g.fillStyle='#b18cff';
    g.beginPath(); g.arc(p.x,p.y-60,90,0,6.283); g.fill();
  }
  g.globalAlpha=1;
}
function drawWorld(g){
  g.save();
  var shx=shakeT>0?(Math.random()*2-1)*shakeT*16:0;
  var shy=shakeT>0?(Math.random()*2-1)*shakeT*10:0;
  g.translate(-Math.round(camX)+shx,shy);
  drawGround(g); drawDeco(g);
  var i;
  for(i=0;i<rings.length;i++){ var rg=rings[i];
    var rc=rg.c||'92,255,160';
    g.strokeStyle='rgba('+rc+','+Math.max(0,rg.life/0.7).toFixed(2)+')'; g.lineWidth=3;
    g.beginPath(); g.ellipse(rg.x,rg.y,rg.r,rg.r*0.35,0,0,6.283); g.stroke(); }
  for(i=0;i<pickups.length;i++){ var pu=pickups[i];
    var bob=Math.sin(pu.t*3)*2;
    if(pu.kind==='heart'){ g.fillStyle='rgba(116,70,171,0.3)'; g.beginPath(); g.arc(pu.x,pu.y+bob,13,0,6.283); g.fill(); drawIcon(g,'heart',pu.x-10,pu.y-10+bob,20); }
    else if(pu.kind==='shard'){ g.fillStyle='rgba(125,255,192,0.25)'; g.beginPath(); g.arc(pu.x,pu.y+bob,12,0,6.283); g.fill(); drawIcon(g,'shard',pu.x-9,pu.y-9+bob,18); }
    else if(pu.kind==='wisp'){ g.fillStyle='rgba(125,255,192,0.3)'; g.beginPath(); g.arc(pu.x,pu.y+bob,8,0,6.283); g.fill();
      g.fillStyle='#5cffa0'; g.fillRect(pu.x-2,pu.y-4+bob,4,6); g.fillStyle='#b8ffe0'; g.fillRect(pu.x-1,pu.y-2+bob,2,3); }
    else if(pu.kind==='grief'){ g.fillStyle='rgba(207,214,230,0.3)'; g.beginPath(); g.arc(pu.x,pu.y+bob,12,0,6.283); g.fill();
      if(griefReady)g.drawImage(griefImg,pu.x-9,pu.y-9+bob,18,18); }
    else { drawIcon(g,'gold',pu.x-8,pu.y-8+bob,16); } }
  /* narrative retinue: extra followers during Stage 2 narrative scenes only */
  if(mode==='cutscene'&&stageNum>=2&&player&&player.alive&&!cs.still){
    for(var rf=0;rf<6;rf++){
      var fxp=player.x-70-rf*24;
      shadow(g,fxp,GROUND,11);
      g.save(); g.translate(fxp,GROUND); g.scale(3,3);
      skelBody(g,tGlobal*3+rf*1.3,false,false,rf%3);
      g.restore();
    }
  }
  for(i=0;i<minions.length;i++){ var m=minions[i];
    var rise=(m.rise===undefined)?1:m.rise;
    var yOff=(1-rise)*46;
    shadow(g,m.x,GROUND,12);
    var sc=m.name==='nameB'?3.4:3;
    var variant=m.name==='nameA'?1:(m.name==='nameB'?2:0);
    g.save(); g.translate(m.x,m.y+yOff); g.scale(sc*m.face,sc);
    skelBody(g,m.phase,m.atkCd>0.45,m.kind==='archer',variant);
    g.restore(); }
  for(i=0;i<foes.length;i++){ var f=foes[i];
    if(f.dead)continue;
    if(f.stunT>0){ g.fillStyle='rgba(232,246,255,'+(0.4+0.3*Math.sin(tGlobal*18)).toFixed(2)+')';
      g.fillRect(f.x-3,foeCY(f)-16,2,4); g.fillRect(f.x+2,foeCY(f)-14,2,4); }
    if(f.kind==='knight'){ shadow(g,f.x,GROUND,14);
      g.save(); g.translate(f.x,f.y); g.scale(3*f.face,3); knightBody(g,f.phase,f.lungeT>0); g.restore();
      if(f.hurtT>0){ g.fillStyle='rgba(255,255,255,0.5)'; g.fillRect(f.x-10,f.y-70,20,70); }
    } else if(f.kind==='cultist'){ shadow(g,f.x,GROUND,14);
      g.save(); g.translate(f.x,f.y); g.scale(3*f.face,3); cultistBody(g,f.phase,f.lungeT>0); g.restore();
      if(f.hurtT>0){ g.fillStyle='rgba(255,255,255,0.5)'; g.fillRect(f.x-10,f.y-72,20,72); }
    } else if(f.kind==='mara'){ shadow(g,f.x,GROUND,14);
      g.save(); g.translate(f.x,f.y); g.scale(3*f.face,3); maraBody(g,f.phase,f.lungeT>0); g.restore();
      if(f.hurtT>0){ g.fillStyle='rgba(255,255,255,0.5)'; g.fillRect(f.x-10,f.y-72,20,72); }
    } else if(f.kind==='zombie'){ shadow(g,f.x,GROUND,18);
      g.save(); g.translate(f.x,f.y); g.scale(4*f.face,4); zombBody(g,f.phase,f.lungeT>0); g.restore();
      if(f.hurtT>0){ g.fillStyle='rgba(255,255,255,0.5)'; g.fillRect(f.x-14,f.y-104,28,104); }
    } else if(f.kind==='mage'){
      g.save(); g.translate(f.x,f.y); g.scale(3*f.face,3); mageBody(g,tGlobal+f.phase); g.restore();
      if(f.hurtT>0){ g.fillStyle='rgba(255,255,255,0.5)'; g.fillRect(f.x-10,f.y-66,20,66); }
    } else if(f.kind==='bat'){
      g.save(); g.translate(f.x,f.y); g.scale(3*f.face,3); batBody(g,tGlobal+f.phase); g.restore();
    } else if(f.kind==='fly'){
      var wz=Math.floor(tGlobal*30+f.phase)%2;
      g.fillStyle='rgba(125,255,192,0.22)'; g.fillRect(f.x-3,f.y-3,6,6);
      g.fillStyle='#20301f'; g.fillRect(f.x-1,f.y-1,3,2);
      g.fillStyle=wz?'#9fd8ff':'#5b6a7d'; g.fillRect(f.x-3,f.y-2,2,1); g.fillRect(f.x+2,f.y-2,2,1);
    } else if(f.kind==='boss'){
      shadow(g,f.x,GROUND,30);
      g.save(); g.translate(f.x,f.y); g.scale(5*f.face,5); bossBody(g,f.phase,f.lungeT>0); g.restore();
      if(f.hurtT>0){ g.fillStyle='rgba(255,255,255,0.4)'; g.fillRect(f.x-24,f.y-135,48,135); }
    } else if(f.kind==='skelord'){
      shadow(g,f.x,GROUND,36);
      var jx=f.dying?(Math.random()*2-1)*2:0;
      g.save(); g.translate(f.x+jx,f.y); g.scale(6*f.face,6); skelordBody(g,f.phase,f.lungeT>0); g.restore();
      if(f.dying){
        g.globalAlpha=0.5+0.4*Math.sin(tGlobal*20);
        g.fillStyle='#5cffa0';
        g.fillRect(f.x-10,f.y-160,2,60); g.fillRect(f.x+6,f.y-120,2,50); g.fillRect(f.x-4,f.y-90,2,40);
        g.fillStyle='#b18cff'; g.fillRect(f.x+12,f.y-180,2,70); g.fillRect(f.x-14,f.y-100,2,44);
        g.globalAlpha=1;
      }
      if(f.hurtT>0){ g.fillStyle='rgba(255,255,255,0.4)'; g.fillRect(f.x-30,f.y-210,60,210); }
    } }
  if(player&&player.alive){ var p=player;
    shadow(g,p.x,GROUND,14);
    var blink=p.hurtT>0&&Math.floor(tGlobal*16)%2===0;
    var aura=clamp(levelFxT/1.4,0,1);
    if(!blink){ drawNecroAt(g,p.x,p.y,p.face,p.animT,p.walking,clamp(p.castFx/0.2,0,1),aura); }
    drawChargeWall(g,p);
    drawBeam(g,p);
    if(counterNearby(p)){
      var pa=0.5+0.4*Math.sin(tGlobal*14);
      g.fillStyle='rgba(232,246,255,'+pa.toFixed(2)+')';
      g.save(); g.translate(p.x,p.y-110); g.rotate(0.785);
      g.fillRect(-3,-3,6,6); g.restore();
    }
    if(p.shield>0){
      g.strokeStyle='rgba(232,230,212,'+(0.5+0.3*Math.sin(tGlobal*6)).toFixed(2)+')';
      g.lineWidth=2; g.beginPath(); g.arc(p.x,p.y-52,26+Math.sin(tGlobal*6)*2,0,6.283); g.stroke();
    }
    if(p.burnT>0){
      for(var bf=0;bf<3;bf++){
        var fh2=4+Math.sin(tGlobal*14+bf*2)*2;
        g.fillStyle=bf%2?'#ff9a3d':'#ff5c3d';
        g.fillRect(p.x-8+bf*7,p.y-70-fh2,3,fh2+4);
      }
    }
    if(p.itemFx){ var fx=p.itemFx;
      if(fx.k==='heart'&&fx.t>0.28){ drawIcon(g,'heart',p.x+p.face*12-9,p.y-74,18); }
      if(fx.k==='shard'){ var ry=p.y-72-(0.6-fx.t)*26; drawIcon(g,'shard',p.x+p.face*10-8,ry,16); } } }
  for(i=0;i<bolts.length;i++){ var b=bolts[i];
    if(b.kind==='wave'){
      var hh=150;
      g.globalAlpha=0.4; g.fillStyle='#1c0a2a'; g.fillRect(b.x-6,b.y-hh/2,12,hh);
      g.globalAlpha=0.7; g.fillStyle='#7446ab'; g.fillRect(b.x-3,b.y-hh/2+8,6,hh-16);
      g.fillStyle='#e8f6ff'; g.fillRect(b.x-1,b.y-hh/2+14,2,hh-28);
      if(Math.random()<0.8){ g.fillStyle='#e8f6ff';
        g.fillRect(b.x-2,b.y-hh/2+rnd(0,hh),3,2); }
      g.globalAlpha=1;
    } else {
      g.fillStyle='rgba(61,252,154,0.25)'; g.beginPath(); g.arc(b.x,b.y,9,0,6.283); g.fill();
      g.fillStyle='#b8ffe0'; g.beginPath(); g.arc(b.x,b.y,4,0,6.283); g.fill(); } }
  for(i=0;i<ebolts.length;i++){ var eb=ebolts[i];
    g.fillStyle='rgba(255,90,40,0.3)'; g.beginPath(); g.arc(eb.x,eb.y,10,0,6.283); g.fill();
    g.fillStyle='#ff5c3d'; g.beginPath(); g.arc(eb.x,eb.y,5,0,6.283); g.fill();
    g.fillStyle='#ffd166'; g.beginPath(); g.arc(eb.x,eb.y,2,0,6.283); g.fill(); }
  for(i=0;i<arrows.length;i++){ var ar=arrows[i];
    g.save(); g.translate(ar.x,ar.y); g.rotate(Math.atan2(ar.vy,ar.vx));
    g.fillStyle='#b9b6a2'; g.fillRect(-6,-1,10,2);
    g.fillStyle='#e8e6d4'; g.fillRect(4,-1,3,2);
    g.fillStyle='#7446ab'; g.fillRect(-7,-2,2,4);
    g.restore(); }
  for(i=0;i<swordRain.length;i++){ var sw=swordRain[i]; if(sw.delay>0)continue; drawSwordGhost(g,sw.x,sw.y); }
  for(i=0;i<debris.length;i++){ var db=debris[i];
    g.save(); g.translate(db.x,db.y); g.rotate(db.rot);
    g.globalAlpha=clamp(db.life/(db.max||1),0,1);
    g.fillStyle=db.c; g.fillRect(-db.size/2,-db.size/2,db.size,db.size*0.6);
    g.restore(); }
  g.globalAlpha=1;
  for(i=0;i<parts.length;i++){ var q=parts[i];
    g.globalAlpha=clamp(q.life/(q.max||1),0,1); g.fillStyle=q.c;
    g.fillRect(q.x-q.size/2,q.y-q.size/2,q.size,q.size); }
  g.globalAlpha=1;
  for(i=0;i<floaters.length;i++){ var fl=floaters[i];
    g.globalAlpha=clamp(fl.life,0,1); txt(g,fl.txt,fl.x,fl.y,8,fl.c,'center'); }
  g.globalAlpha=1;
  g.restore();
}

