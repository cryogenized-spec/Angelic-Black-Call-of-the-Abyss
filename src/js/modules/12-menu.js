/* ================= MENU ================= */
var invOverlay=document.getElementById('invOverlay');
var tabInv=document.getElementById('tabInv');
var tabChar=document.getElementById('tabChar');
var tabSpells=document.getElementById('tabSpells');
var invBtn=document.getElementById('invBtn');
var vendorOverlay=document.getElementById('vendorOverlay');
var vList=document.getElementById('vList');
var vGold=document.getElementById('vGold');
var curTab='inv';
var tabs=document.querySelectorAll('.tab');
for(var tbi=0;tbi<tabs.length;tbi++){
  tabs[tbi].addEventListener('click',function(){
    curTab=this.getAttribute('data-tab');
    for(var q=0;q<tabs.length;q++)tabs[q].classList.toggle('active',tabs[q]===this);
    renderMenu();
  });
}
function rowHTML(id,extra){
  var it=ITEMS[id];
  return '<div class="irow"><i class="icn '+id+'"></i><div class="mid"><div class="nm">'+it.name+
    (extra||'')+'</div><div class="ds">'+it.desc+'</div></div>';
}
function renderMenu(){
  if(curTab==='inv'){
    tabInv.hidden=false; tabChar.hidden=true; tabSpells.hidden=true;
    var h='<div class="goldline">FLATTENED GOLD: '+gold+'</div>';
    h+='<div class="cat">CONSUMABLES</div>';
    var cons=['heart','shard','tincture'], any=false;
    for(var i=0;i<cons.length;i++){ var id=cons[i];
      if(inv[id]>0){ any=true;
        h+=rowHTML(id,' <span class="ct">×'+inv[id]+'</span>')+
          '<button class="vbtn useb" data-use="'+id+'">USE</button></div>'; } }
    if(!any)h+='<div class="ds" style="color:#69758a">Nothing yet.</div>';
    h+='<div class="cat">RELICS / MYSTERIES</div>';
    var rel=['signet','jester','pewter'], anyR=false;
    for(var r=0;r<rel.length;r++){ var rid=rel[r];
      if(inv[rid]>0){ anyR=true; h+=rowHTML(rid,' <span class="ct">×'+inv[rid]+'</span>')+'</div>'; } }
    if(!anyR)h+='<div class="ds" style="color:#69758a">Nothing yet.</div>';
    h+='<div class="cat">LORE / SPECIAL</div>';
    var lore=['page','grief'], anyL=false;
    for(var l=0;l<lore.length;l++){ var lid=lore[l];
      if(inv[lid]>0){ anyL=true; h+=rowHTML(lid,' <span class="ct">×'+inv[lid]+'</span>')+'</div>'; } }
    if(!anyL)h+='<div class="ds" style="color:#69758a">Nothing yet.</div>';
    tabInv.innerHTML=h;
    var useBtns=tabInv.querySelectorAll('[data-use]');
    for(var u=0;u<useBtns.length;u++){
      useBtns[u].addEventListener('click',function(){ useItem(this.getAttribute('data-use')); });
    }
  } else if(curTab==='char'){
    tabInv.hidden=true; tabChar.hidden=false; tabSpells.hidden=true;
    var p=player||makePlayer();
    var h2='<img class="chp" src="'+pImg.src+'">';
    h2+='<div class="chline"><b>'+(charNameLine()||'— —')+'</b> · THE NECRO QUEEN</div>';
    h2+='<div class="chline">Queen of the Quiet Court · Sovereign of the First Tomb</div>';
    h2+='<div class="chline">LEVEL <b>'+p.level+'</b> · CONTINUES <b>'+continuesLeft+'</b></div>';
    h2+='<div class="chline">VITALITY — Life <b>'+Math.round(p.hp)+'/'+p.maxHp+'</b> · Armour <b>'+Math.round(p.armor*100)+'%</b> · points <b>'+p.vitPicks+'</b></div>';
    h2+='<div class="chline">CHARISMA — Mana <b>'+Math.floor(p.mana)+'/'+p.maxMana+'</b> · Regen <b>'+p.manaRegen.toFixed(1)+'/s</b> · points <b>'+p.chaPicks+'</b></div>';
    h2+='<div class="chline">BONE ARMOUR — <b>'+Math.round(p.shield)+'</b></div>';
    h2+='<div class="chline">EQUIPMENT — '+(inv.signet>0?'<b>SIGNET OF POWER</b> (summons strike harder)':'—')+'</div>';
    tabChar.innerHTML=h2;
  } else {
    tabInv.hidden=true; tabChar.hidden=true; tabSpells.hidden=false;
    var h3='';
    for(var s=0;s<acquiredOrder.length;s++){
      var sp=SPELLS[acquiredOrder[s]];
      h3+='<div class="sentry"><div class="sicon">'+sp.icon+'</div><div class="mid">'+
        '<div class="nm">'+sp.name+'</div>'+
        '<div class="ds">'+sp.desc+'</div>'+
        '<div class="st">'+sp.types+' · COST '+sp.cost+' · CD '+sp.cd+'</div>'+
        '<div class="sl">'+sp.lore+'</div>'+
        '<div class="su">'+sp.upg+'</div></div></div>';
    }
    tabSpells.innerHTML=h3;
  }
}
function useItem(id){
  var p=player; if(!p||!p.alive)return;
  if(id==='heart'&&inv.heart>0&&p.hp<p.maxHp){ inv.heart--; p.hp=Math.min(p.maxHp,p.hp+40);
    recoverCooldowns(PICK_CD_PCT);
    doHeartFx(); floater(p.x,p.y-105,'+40 LIFE','#ff8d9d'); closeInv(); }
  else if(id==='shard'&&inv.shard>0&&p.mana<p.maxMana){ inv.shard--; p.mana=Math.min(p.maxMana,p.mana+40);
    recoverCooldowns(PICK_CD_PCT);
    doShardFx(); floater(p.x,p.y-105,'+40 MANA','#7dffc0'); closeInv(); }
  else if(id==='tincture'&&inv.tincture>0){ inv.tincture--; wardT=30;
    floater(p.x,p.y-105,'WARDED','#b8ffe0'); sfx.absorb(); closeInv(); }
  else renderMenu();
}
function openInv(){ if(mode!=='playing')return; mode='inventory'; renderMenu(); invOverlay.hidden=false; }
function closeInv(){ invOverlay.hidden=true; if(mode==='inventory')mode='playing'; }
invBtn.addEventListener('click',function(){ if(mode==='playing')openInv(); else if(mode==='inventory')closeInv(); });
document.getElementById('invClose').addEventListener('click',closeInv);

function openVendor(){
  vendorDone=true; cs=null; mode='vendor';
  renderVendor(); vendorOverlay.hidden=false; sfx.vendor();
  floater(player.x,player.y-120,'SIGNET OF POWER','#d8a94e');
}
function renderVendor(){
  vGold.textContent='FLATTENED GOLD: '+gold;
  var h='';
  for(var i=0;i<VSTOCK.length;i++){ var v=VSTOCK[i];
    if(vBought[v.id]){ h+=rowHTML(v.id)+'<span class="sold">SOLD</span></div>'; continue; }
    h+=rowHTML(v.id)+'<button class="vbtn buyb" data-buy="'+v.id+'" '+(gold<v.price?'disabled':'')+'>BUY '+v.price+'</button></div>';
  }
  vList.innerHTML=h;
  var bb=vList.querySelectorAll('[data-buy]');
  for(var b=0;b<bb.length;b++){
    bb[b].addEventListener('click',function(){ buyItem(this.getAttribute('data-buy')); });
  }
}
function buyItem(id){
  var v=null; for(var i=0;i<VSTOCK.length;i++)if(VSTOCK[i].id===id)v=VSTOCK[i];
  if(!v||vBought[id]||gold<v.price)return;
  gold-=v.price; vBought[id]=true; inv[id]++;
  if(id==='jester'){ jesterT=90+Math.random()*90; }
  sfx.vendor(); renderVendor();
}
document.getElementById('vLeave').addEventListener('click',function(){
  vendorOverlay.hidden=true;
  witchDepartCS();
});

