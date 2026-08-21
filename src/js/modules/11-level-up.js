/* ================= LEVEL-UP ================= */
var lvlOverlay=document.getElementById('lvlOverlay');
var lvlPanel=document.getElementById('lvlPanel');
var cLvlEl=document.getElementById('cLvl');
var traitVit=document.getElementById('traitVit');
var traitCha=document.getElementById('traitCha');
var lvlTimers=[], choicesEnabled=false;
function clearLvlTimers(){ for(var i=0;i<lvlTimers.length;i++)clearTimeout(lvlTimers[i]); lvlTimers=[]; }
function hideLevelOverlay(){
  lvlOverlay.hidden=true;
  lvlOverlay.classList.remove('show','crumbling','armed');
  lvlPanel.classList.remove('crumble');
  traitVit.classList.remove('selected','flame');
  traitCha.classList.remove('selected','flame');
  choicesEnabled=false;
}
function openLevelUp(){
  mode='levelup'; choicesEnabled=false;
  cLvlEl.textContent=String(player.level+1);
  traitVit.classList.remove('selected','flame');
  traitCha.classList.remove('selected','flame');
  cvs.style.filter='saturate(.55) brightness(.75)';
  lvlTimers.push(setTimeout(function(){
    lvlOverlay.hidden=false;
    requestAnimationFrame(function(){lvlOverlay.classList.add('show');});
    sfx.lvlOpen();
  },700));
  lvlTimers.push(setTimeout(function(){
    choicesEnabled=true; lvlOverlay.classList.add('armed');
  },1000));
}
function spawnShardsFx(hostEl){
  for(var i=0;i<18;i++){
    var sh=document.createElement('i'); sh.className='shardfx';
    sh.style.width=(18+Math.random()*46)+'px'; sh.style.height=(14+Math.random()*40)+'px';
    sh.style.left=(5+Math.random()*90)+'%'; sh.style.top=(10+Math.random()*80)+'%';
    hostEl.appendChild(sh);
    var dx=(Math.random()*2-1)*70, dy=90+Math.random()*150, rot=(Math.random()*2-1)*120;
    sh.animate([{transform:'translate(0,0) rotate(0deg)',opacity:1},
      {transform:'translate('+dx.toFixed(0)+'px,'+dy.toFixed(0)+'px) rotate('+rot.toFixed(0)+'deg)',opacity:0}],
      {duration:520+Math.random()*380,easing:'cubic-bezier(.3,.4,.6,1)'}).onfinish=
      (function(el){return function(){el.remove();};})(sh);
  }
}
function selectTrait(kind){
  if(mode!=='levelup'||!choicesEnabled)return;
  choicesEnabled=false; lvlOverlay.classList.remove('armed');
  var p=player;
  var card=kind==='vit'?traitVit:traitCha;
  card.classList.add('selected','flame');
  if(kind==='vit'){ p.vitPicks++; p.maxHp+=25; p.hp=Math.min(p.maxHp,p.hp+25); p.armor=Math.min(0.3,p.armor+0.02); }
  else { p.chaPicks++; p.maxMana+=15; p.manaRegen+=0.5; }
  p.level++; p.xp-=p.xpNeed; p.xpNeed=120+p.level*90;
  sfx.levelup();
  lvlTimers.push(setTimeout(function(){
    card.classList.remove('flame');
    lvlOverlay.classList.add('crumbling'); lvlPanel.classList.add('crumble');
    spawnShardsFx(lvlOverlay);
  },250));
  lvlTimers.push(setTimeout(function(){
    hideLevelOverlay(); cvs.style.filter=''; mode='playing'; levelFxT=1.4;
    rings.push({x:p.x,y:p.y,r:8,life:0.7,c:'176,140,255'});
    rings.push({x:p.x,y:p.y-40,r:4,life:0.9,c:'176,140,255'});
    if(p.level===UNLOCK_ARCHER)floater(p.x,p.y-120,'COURT OF BONE — RITE UPGRADE','#b18cff');
  },250+620));
}
traitVit.addEventListener('click',function(){selectTrait('vit');});
traitCha.addEventListener('click',function(){selectTrait('cha');});

