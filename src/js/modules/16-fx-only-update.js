/* ================= FX-ONLY UPDATE ================= */
function compactAlive(list,predicate){
  var write=0;
  for(var read=0;read<list.length;read++){
    var item=list[read];
    if(predicate(item))list[write++]=item;
  }
  list.length=write;
}
function updateFx(dt){
  shakeT=Math.max(0,shakeT-dt);
  skyFxT=Math.max(0,skyFxT-dt);
  flashT=Math.max(0,flashT-dt);
  var i;
  for(i=0;i<parts.length;i++){ var q=parts[i]; q.life-=dt; q.x+=q.vx*dt; q.y+=q.vy*dt; q.vy+=(q.g||0)*dt; }
  compactAlive(parts,function(qq){return qq.life>0;});
  for(i=0;i<floaters.length;i++){ var fl=floaters[i]; fl.life-=dt; fl.y-=30*dt; }
  compactAlive(floaters,function(fl2){return fl2.life>0;});
  for(i=0;i<rings.length;i++){ var rg=rings[i]; rg.life-=dt; rg.r+=dt*160; }
  compactAlive(rings,function(rg2){return rg2.life>0;});
  for(i=0;i<debris.length;i++){ var db=debris[i]; db.life-=dt; db.x+=db.vx*dt; db.y+=db.vy*dt;
    db.vy+=(db.g||0)*dt; db.rot+=db.vr*dt; }
  compactAlive(debris,function(db2){return db2.life>0&&db2.y<VH+40;});

  if(corpseFx){ var cf=corpseFx; cf.t+=dt;
    if(cf.t<0.55&&Math.random()<0.9){
      parts.push({x:cf.x+rnd(-30,30),y:cf.y-rnd(20,200),vx:0,vy:rnd(-20,20),g:0,life:0.3,max:0.3,
        c:Math.random()<0.5?'#5cffa0':'#b18cff',size:2});
    }
    if(!cf.s1&&cf.t>=0.45){ cf.s1=true;
      for(var s1i=0;s1i<6;s1i++){ debris.push({x:cf.x+rnd(-8,8),y:cf.y-200,vx:rnd(-40,40),vy:rnd(-260,-140),
        rot:rnd(0,6),vr:rnd(-6,6),size:rnd(3,6),c:'#e8e6d4',life:0.9,max:0.9,g:500}); }
      rings.push({x:cf.x,y:cf.y-200,r:4,life:0.4,c:'232,230,212'});
    }
    if(!cf.s2&&cf.t>=0.6){ cf.s2=true; if(cf.ref)cf.ref.dead=true;
      shakeT=Math.max(shakeT,0.8); sfx.boom();
      boneDebris(cf.x,cf.y-110,26,260);
      for(var ai=0;ai<12;ai++){ debris.push({x:cf.x+rnd(-20,20),y:cf.y-rnd(40,180),vx:rnd(-240,240),vy:rnd(-300,-60),
        rot:rnd(0,6),vr:rnd(-9,9),size:rnd(3,7),c:Math.random()<0.5?'#3d3352':'#241b38',life:rnd(0.7,1.3),max:1.3,g:620}); }
      puff(cf.x,cf.y-110,20,'#1c0a2a',240,60,1.0,5);
      puff(cf.x,cf.y-110,16,'#a41f2f',260,120,0.8,4);
      puff(cf.x,cf.y-110,18,'#7446ab',280,-40,0.9,4);
      puff(cf.x,cf.y-110,18,'#5cffa0',300,-60,0.9,3);
      rings.push({x:cf.x,y:cf.y-110,r:10,life:0.8,c:'125,255,192'});
      rings.push({x:cf.x,y:cf.y-110,r:4,life:1.0,c:'176,140,255'});
    }
    if(cf.s2&&cf.t<1.5){ cf.lt-=dt;
      if(cf.lt<=0){ cf.lt=0.12;
        var ox=cf.x+rnd(-40,40), oy=cf.y-rnd(30,190);
        puff(ox,oy,6,'#e8e6d4',120,200,0.5,3);
        puff(ox,oy,5,'#1c0a2a',80,-20,0.6,4);
        puff(ox,oy,4,'#5cffa0',100,-40,0.4,2);
        boneDebris(ox,oy,2,120);
      } }
    if(!cf.s3&&cf.t>=1.5){ cf.s3=true;
      puff(cf.x,cf.y-100,26,'#0c0716',60,-30,1.6,6);
      puff(cf.x,cf.y-100,18,'#7446ab',50,-20,1.4,5);
    }
    if(cf.t>1.9)corpseFx=null;
  }
}
function progressRise(dt){
  for(var i=0;i<minions.length;i++){ var m=minions[i];
    if(m.rise===undefined)m.rise=1;
    if(m.rise<1){ m.rise=Math.min(1,m.rise+dt/1.2);
      if(Math.random()<0.5)parts.push({x:m.x+rnd(-10,10),y:GROUND+rnd(-2,4),vx:rnd(-30,30),vy:rnd(-80,-20),g:300,life:0.5,max:0.5,c:'#3a2c1f',size:2}); } }
}
