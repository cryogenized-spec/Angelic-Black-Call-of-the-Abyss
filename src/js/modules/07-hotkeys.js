/* ================= HOTKEYS ================= */
var hotkeys=['gravebolt','rite',null,null,null,null];
var intentionalNone=[false,false,false,false,false,false];
var slotEls=[];
var padRight=document.getElementById('padRight');
(function buildSlots(){
  for(var i=0;i<6;i++){
    var b=document.createElement('button'); b.className='pbtn ability slotbtn';
    b.innerHTML='<span class="sico">·</span><i class="cd"></i><span class="cost"></span>';
    (function(idx,btn){
      btn.addEventListener('pointerdown',function(ev){ev.preventDefault();ev.stopPropagation();unlockAudio();slotDown(idx);});
      function up(ev){ if(ev)ev.preventDefault(); slotUp(idx); }
      btn.addEventListener('pointerup',up); btn.addEventListener('pointerleave',up); btn.addEventListener('pointercancel',up);
    })(i,b);
    padRight.appendChild(b); slotEls.push(b);
  }
})();
function renderSlotIcons(){
  for(var i=0;i<6;i++){
    var sp=hotkeys[i];
    slotEls[i].querySelector('.sico').textContent=sp?SPELLS[sp].icon:'·';
    slotEls[i].querySelector('.cost').textContent=sp?String(SPELLS[sp].cost):'';
    slotEls[i].classList.toggle('empty',!sp);
  }
}
function slotDown(i){ var sp=hotkeys[i]; if(!sp)return;
  if(sp==='gravebolt'){ boltDown(); } else castSpellById(sp); }
function slotUp(i){ if(hotkeys[i]==='gravebolt')boltUp(); }
function aliveName(n){ for(var i=0;i<minions.length;i++){ if(minions[i].name===n&&!minions[i].dead)return true; } return false; }
function spellReady(sp){ var p=player; if(!p)return false;
  if(sp==='gravebolt')return p.mana>=COST_BOLT;
  if(sp==='rite')return p.mana>=COST_SUMMON&&(!aliveName('nameA')||!aliveName('nameB'));
  if(sp==='lance')return p.heavyCd<=0&&p.mana>=COST_HEAVY;
  if(sp==='gravefall')return p.swordCd<=0&&p.mana>=COST_SWORD;
  if(sp==='mantle')return p.shieldCd<=0&&p.mana>=COST_SHIELD&&minions.length>0;
  return false; }
function spellCdFrac(sp){ var p=player; if(!p)return 0;
  if(sp==='lance')return p.heavyCd/CD_HEAVY;
  if(sp==='gravefall')return p.swordCd/CD_SWORD;
  if(sp==='mantle')return p.shieldCd/CD_SHIELD;
  return 0; }
function syncSlots(){
  for(var i=0;i<6;i++){
    var sp=hotkeys[i], el=slotEls[i];
    el.classList.toggle('ready',!!sp&&spellReady(sp));
    var cd=sp?spellCdFrac(sp):0;
    el.querySelector('.cd').style.background=cd>0?('conic-gradient(rgba(4,2,9,.85) '+(cd*100).toFixed(1)+'%, transparent 0)'):'none';
  }
}
var assignOverlay=document.getElementById('assignOverlay');
var slotListEl=document.getElementById('slotList');
var paletteEl=document.getElementById('palette');
var assignBtn=document.getElementById('assignBtn');
var assignSel=-1;
assignBtn.addEventListener('click',function(){ if(mode!=='playing')return; openAssign(); });
function openAssign(){ mode='assign'; assignSel=-1; renderAssign(); assignOverlay.hidden=false; }
function closeAssign(){ assignOverlay.hidden=true; if(mode==='assign')mode='playing'; }
document.getElementById('assignClose').addEventListener('click',closeAssign);
function renderAssign(){
  var h='';
  for(var i=0;i<6;i++){
    h+='<button class="vbtn srow'+(i===assignSel?' sel':'')+'" data-slot="'+i+'">SLOT '+(i+1)+' — '+
      (hotkeys[i]?SPELLS[hotkeys[i]].name:'NONE')+'</button>';
  }
  slotListEl.innerHTML=h;
  var p2='<button class="vbtn prow" data-sp="none">NONE — leave a slot empty</button>';
  for(var s=0;s<acquiredOrder.length;s++){
    var sp=SPELLS[acquiredOrder[s]];
    p2+='<button class="vbtn prow" data-sp="'+acquiredOrder[s]+'">'+sp.icon+' '+sp.name+' · '+sp.cost+' mana · cd '+sp.cd+'</button>';
  }
  paletteEl.innerHTML=p2;
}
assignOverlay.addEventListener('click',function(ev){
  var t=ev.target.closest('[data-slot],[data-sp]');
  if(!t)return;
  if(t.hasAttribute('data-slot')){ assignSel=parseInt(t.getAttribute('data-slot'),10); renderAssign(); sfx.tap(); }
  else { doAssign(t.getAttribute('data-sp')); }
});
function doAssign(spId){
  if(assignSel<0)return;
  var sp=spId==='none'?null:spId;
  var old=hotkeys[assignSel];
  if(sp){ for(var j=0;j<6;j++){ if(hotkeys[j]===sp){ hotkeys[j]=old; break; } } }
  hotkeys[assignSel]=sp;
  intentionalNone[assignSel]=(sp===null);
  assignSel=-1;
  renderAssign(); renderSlotIcons(); sfx.tap();
}

