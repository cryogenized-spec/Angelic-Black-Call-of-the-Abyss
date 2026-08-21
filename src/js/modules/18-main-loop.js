/* ================= MAIN LOOP ================= */
function drawGame(){ drawBackdrop(ctx); drawSkyFx(ctx); drawWorld(ctx); drawFog(ctx); drawHUD(ctx);
  if(flashT>0){ ctx.fillStyle='rgba(232,246,255,'+(flashT*2.2).toFixed(2)+')'; ctx.fillRect(0,0,VW,VH); }
  if(gameFade>0){ ctx.fillStyle='rgba(0,0,0,'+clamp(gameFade,0,1).toFixed(2)+')'; ctx.fillRect(0,0,VW,VH); } }
var lastT=performance.now();
function loop(now){
  var engine=window.__ANGELIC_BLACK_ENGINE__;
  if(engine)engine.beginFrame(now);
  var dt=Math.min(0.05,(now-lastT)/1000); lastT=now;
  if(gameFade>0&&mode==='playing')gameFade-=dt;
  /* controls hidden during cutscenes for full viewing */
  var inplay=(mode==='playing'||mode==='levelup'||mode==='inventory'||
    mode==='vendor'||mode==='tutorial'||mode==='assign');
  if(isTouch)document.body.classList.toggle('inplay',inplay);
  invBtn.style.display=(mode==='playing'||mode==='inventory')?'block':'none';
  assignBtn.style.display=(mode==='playing')?'block':'none';
  if(mode==='playing'){ tGlobal+=dt; update(dt); drawGame(); }
  else if(mode==='boot'){ tGlobal+=dt; checkBoot(dt); }
  else if(mode==='comic'){ ctx.fillStyle='#020105'; ctx.fillRect(0,0,VW,VH); }
  else if(mode==='intro'){ tGlobal+=dt; introT+=dt; drawGame();
    if(introT>1.2&&!introMon){ introMon=true; introRiseCS(); } }
  else if(mode==='dying'){
    tGlobal+=dt; deathT+=dt;
    var p=player;
    if(deathT<0.8&&Math.random()<0.9){
      parts.push({x:p.x+rnd(-40,40),y:p.y-rnd(0,90),vx:0,vy:rnd(-20,20),g:0,life:0.3,max:0.3,
        c:Math.random()<0.5?'#1c0a2a':'#7446ab',size:3});
    }
    if(!deathBoom&&deathT>=0.8){
      deathBoom=true;
      shakeT=0.8; sfx.boom();
      puff(p.x,p.y-50,30,'#1c0a2a',260,60,1.0,5);
      puff(p.x,p.y-50,24,'#7446ab',280,-40,0.9,4);
      puff(p.x,p.y-50,18,'#e8e6d4',240,200,0.8,3);
      puff(p.x,p.y-50,14,'#5cffa0',260,-60,0.8,3);
      rings.push({x:p.x,y:p.y-50,r:10,life:0.7,c:'176,140,255'});
      boneDebris(p.x,p.y-50,14,220);
      for(var q=0;q<foes.length;q++){ var ff=foes[q];
        if(!ff.dead&&!ff.dying&&Math.abs(ff.x-p.x)<150){ ff.hp-=20; ff.hurtT=0.2;
          if(ff.hp<=0){ ff.dead=true; puff(ff.x,foeCY(ff),12,'#7446ab',160,-40,0.6,3); } } }
    }
    deathFade=deathT>1.2?Math.min(1,(deathT-1.2)/0.5):0;
    updateFx(dt);
    drawGame();
    if(deathFade>0){ ctx.fillStyle='rgba(0,0,0,'+deathFade.toFixed(2)+')'; ctx.fillRect(0,0,VW,VH); }
    if(!deathDone&&deathT>2.0){ deathDone=true;
      if(continuesLeft>0)openOver(); else startFinal(); }
  }
  else if(mode==='over'||mode==='finalfall'||mode==='finalend'){ ctx.fillStyle='#000'; ctx.fillRect(0,0,VW,VH); }
  else if(mode==='levelup'||mode==='inventory'||mode==='vendor'||mode==='tutorial'||mode==='assign'){ drawGame(); }
  else if(mode==='cutscene'){ tGlobal+=dt; updateFx(dt); progressRise(dt); stepCS(dt); drawGame(); drawCSOverlay(ctx); }
  ctx.fillStyle='rgba(5,2,10,0.15)';
  for(var sy=0;sy<VH;sy+=3)ctx.fillRect(0,sy,VW,1);
  if(engine)engine.endFrame(now);
  requestAnimationFrame(loop);
}

(function loadRuntimeHardening(){
  var script=document.createElement('script');
  script.src='js/modules/19-runtime-hardening.js';
  script.onload=function(){
    if(window.__ANGELIC_BLACK_RUNTIME__&&!window.__ANGELIC_BLACK_RUNTIME__.ready){
      window.__ANGELIC_BLACK_RUNTIME__.reportFatal(new Error('Runtime dependency validation did not complete.'));
      return;
    }
    requestAnimationFrame(loop);
  };
  script.onerror=function(){
    if(window.__ANGELIC_BLACK_RUNTIME__){
      window.__ANGELIC_BLACK_RUNTIME__.reportFatal(new Error('Failed to load runtime hardening module.'));
      return;
    }
    requestAnimationFrame(loop);
  };
  document.body.appendChild(script);
})();
