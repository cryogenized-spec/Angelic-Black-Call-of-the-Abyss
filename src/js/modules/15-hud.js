/* ================= HUD ================= */
function drawBar(g,x,y,w,h,frac,c1,c2,c3,label,labelColor,numText){
  g.fillStyle='rgba(8,5,14,.8)'; g.fillRect(x-2,y-2,w+4,h+4);
  g.fillStyle='#150c16'; g.fillRect(x,y,w,h);
  var fw=Math.round(w*clamp(frac,0,1));
  if(fw>0){
    var mg=g.createLinearGradient(0,y,0,y+h);
    mg.addColorStop(0,c1); mg.addColorStop(0.45,c2); mg.addColorStop(1,c3);
    g.fillStyle=mg; g.fillRect(x,y,fw,h);
    g.fillStyle='rgba(255,255,255,.45)'; g.fillRect(x,y,fw,2);
  }
  g.strokeStyle='rgba(214,224,240,.42)'; g.lineWidth=1; g.strokeRect(x+0.5,y+0.5,w-1,h-1);
  txt(g,label,x,y-11,7,labelColor);
  if(numText)txt(g,numText,x+w,y-11,7,'#cfd6e6','right');
}
function drawManaFlames(g,x,y,manaFrac,maxMana){
  var fillW=Math.round(206*manaFrac); if(fillW<=0||maxMana<=0)return;
  var ex=x+fillW, k;
  for(k=0;k<5;k++){
    var fh=4+((k%2)?3:6)+Math.sin(tGlobal*9+k*1.9)*2;
    g.globalAlpha=0.5-k*0.08;
    g.fillStyle=k<2?'#b8ffe0':'#3dfc9a';
    g.beginPath(); g.moveTo(ex-1-k*4,y+3); g.lineTo(ex-3-k*4,y-fh); g.lineTo(ex-6-k*4,y+3);
    g.closePath(); g.fill();
  }
  for(k=0;k<4;k++){
    var cyc=(tGlobal*10+k*6)%16;
    var fy=y+1-cyc; var fx=ex-3+Math.sin((tGlobal+k)*4)*3;
    g.globalAlpha=clamp(1-cyc/16,0,1)*0.8;
    g.fillStyle='#7dffc0'; g.fillRect(fx,fy,2,2);
  }
  g.globalAlpha=1;
}
function drawXPBar(g,p){
  var bx=isTouch?178:90, bw=(isTouch?VW-178-150:VW-180), by=VH-12, bh=5;
  txt(g,'LV '+p.level,bx-8,by-5,8,'#d8a94e','right');
  g.fillStyle='rgba(20,14,26,.7)'; g.fillRect(bx,by,bw,bh);
  var fw=Math.round(bw*clamp(p.xp/p.xpNeed,0,1));
  if(fw>0){ g.fillStyle='#b08d3f'; g.fillRect(bx,by,fw,bh);
    g.fillStyle='rgba(255,240,200,.5)'; g.fillRect(bx,by,fw,1); }
  g.strokeStyle='rgba(216,169,78,.35)'; g.lineWidth=1; g.strokeRect(bx+0.5,by+0.5,bw-1,bh-1);
  for(var t=1;t<10;t++){ g.fillStyle='rgba(216,169,78,.25)'; g.fillRect(bx+Math.round(bw*t/10),by,1,bh); }
}
function drawHUD(g){
  var p=player, i;
  drawBar(g,14,24,210,12,p.hp/p.maxHp,'#ff5c6d','#a41f2f','#5e0f1a','LIFE','#ff8d9d',
    Math.max(0,Math.round(p.hp))+'/'+p.maxHp);
  if(p.shield>0){
    var sw2=Math.round(210*clamp(p.shield/p.maxHp,0,1));
    g.fillStyle='rgba(232,230,212,.78)'; g.fillRect(14,24,sw2,12);
    g.fillStyle='rgba(255,255,255,.95)'; g.fillRect(14+Math.max(0,sw2-2),24,2,12);
    g.fillStyle='rgba(255,255,255,.5)'; g.fillRect(14,24,sw2,2);
  }
  drawBar(g,14,52,210,12,p.mana/p.maxMana,'#b8ffe0','#3dfc9a','#0f7a4a','MANA','#7dffc0',
    Math.floor(p.mana)+'/'+p.maxMana);
  drawManaFlames(g,16,52,p.mana/p.maxMana,p.maxMana);
  txt(g,'MINIONS '+minions.length+'/2',14,72,7,'#b3b9dd');
  txt(g,'ARM '+Math.round(p.armor*100)+'%',120,72,7,'#8f9ab0');
  if(p.shield>0)txt(g,'BONE '+Math.round(p.shield),190,72,7,'#e8e6d4');
  if(p.burnT>0)txt(g,'BURN',190,84,7,'#ff9a3d');
  drawIcon(g,'gold',14,82,14);
  txt(g,'GOLD '+gold,32,84,7,'#d8a94e');
  if(wardT>0)txt(g,'WARD '+Math.ceil(wardT),110,84,7,'#b8ffe0');
  txt(g,'CONT '+continuesLeft,32,96,7,'#8f9ab0');
  txtShadow(g,'SCORE '+String(score).padStart(6,'0'),VW-14,50,8,'#ffd166','right');
  txt(g,'BEST '+String(Math.max(best,score)).padStart(6,'0'),VW-14,66,8,'#8f7fb0','right');
  txtShadow(g,(stageNum>=2?'STAGE II · ':'')+'WAVE '+waveNum,VW/2,10,10,'#c9a2ff','center');
  var bossRef=null;
  for(i=0;i<foes.length;i++){ if(foes[i].kind==='boss'||foes[i].kind==='skelord'){bossRef=foes[i];break;} }
  if(bossRef){
    txt(g,bossRef.kind==='skelord'?'SKELETAL LORD':'GRAVE LORD',VW/2,30,8,'#ff8d9d','center');
    var bw2=280, bx2=VW/2-bw2/2, by2=42;
    g.fillStyle='#1a0a12'; g.fillRect(bx2,by2,bw2,10);
    g.fillStyle='#ff4d6d'; g.fillRect(bx2+2,by2+2,Math.round((bw2-4)*bossRef.hp/bossRef.maxHp),6);
    g.strokeStyle='#5a2030'; g.lineWidth=1; g.strokeRect(bx2+0.5,by2+0.5,bw2-1,9);
  }
  drawXPBar(g,p);
  if(bannerT>0){ g.globalAlpha=clamp(bannerT,0,1);
    txtShadow(g,bannerTxt,VW/2,VH/2-130,16,'#7dffc0','center'); g.globalAlpha=1; }
}
function drawOver(g){
  drawBackdrop(g);
  g.save(); g.translate(-Math.round(camX),0); drawGround(g); drawDeco(g); g.restore();
  g.fillStyle='rgba(20,4,10,0.6)'; g.fillRect(0,0,VW,VH);
  txtShadow(g,'YOU DIED',VW/2,180,30,'#ff4d6d','center');
  txtShadow(g,'THE GRAVE CLAIMS',VW/2,236,10,'#c9a2ff','center');
  txtShadow(g,'YOU... FOR NOW',VW/2,254,10,'#c9a2ff','center');
  txtShadow(g,'SCORE '+score,VW/2,310,14,'#ffd166','center');
  txt(g,'LEVEL '+player.level,VW/2,340,10,'#d8a94e','center');
  txt(g,'BEST '+best,VW/2,362,10,'#8f7fb0','center');
}

