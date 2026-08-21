/* ================= STATE ================= */
var mode='boot', tGlobal=0, camX=0, shakeT=0, levelFxT=0, skyFxT=0, flashT=0, hitstopT=0;
var player=null, bolts=[], ebolts=[], arrows=[], foes=[], minions=[], parts=[], floaters=[], rings=[],
    deco=[], swordRain=[], pickups=[], debris=[];
var corpseFx=null;
var score=0, waveNum=0, stageNum=1, spawnQueue=0, spawnT=0, betweenT=0, bannerTxt='', bannerT=0, wispT=0;
var currentComp=[['knight',1]];
var gold=0, inv={heart:0,shard:0,tincture:0,page:0,grief:0,signet:0,jester:0,pewter:0}, wardT=0;
var zombSceneDone=false, jesterSpoken=false, jesterT=0, vendorDone=false, griefDropped=false;
var introT=0, introMon=false;
var boltHeld=false, boltHold=0, chargeT=0, apexPlayed=false;
var COUNTER_RADIUS=95, COUNTER_MANA=12, COUNTER_CD_PCT=0.25, PICK_CD_PCT=0.12;
var counterTutDone=(function(){try{return localStorage.getItem('ab_tut_counter')==='1';}catch(e){return false;}})();
var dlgTutDone=(function(){try{return localStorage.getItem('ab_dlagtut')==='1';}catch(e){return false;}})();
var continuesLeft=3, deathT=0, deathBoom=false, deathDone=false, deathFade=0;
var best=0; try{best=parseInt(localStorage.getItem('ab_best')||'0',10)||0;}catch(err){}

function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function rnd(a,b){return a+Math.random()*(b-a);}
function hashN(n){var s=Math.sin(n*127.1+311.7)*43758.5453; return s-Math.floor(s);}
function isBossWave(n){ return n>=5 && n%5===0; }
function recoverCooldowns(pct){ var p=player; if(!p)return;
  p.heavyCd=Math.max(0,p.heavyCd*(1-pct));
  p.swordCd=Math.max(0,p.swordCd*(1-pct));
  p.shieldCd=Math.max(0,p.shieldCd*(1-pct)); }

var STAGE1_WAVES=[
 {count:8, interval:1.2, comp:[['knight',1]]},
 {count:12,interval:1.0, comp:[['knight',0.6],['zombie',0.4]]},
 {count:15,interval:0.85,comp:[['knight',0.5],['zombie',0.3],['mage',0.2]]},
 {count:20,interval:0.7, comp:[['knight',0.45],['zombie',0.3],['mage',0.25]]},
 {count:0, interval:1,   boss:true}
];
function waveDef(n){
  if(n<=STAGE1_WAVES.length)return STAGE1_WAVES[n-1];
  if(FLAGS.escalated)return {count:3+n*2+Math.floor(n*n*0.2),interval:Math.max(0.3,0.9-n*0.04),
    comp:[['cultist',0.35],['knight',0.2],['zombie',0.2],['mage',0.15],['bat',0.1]]};
  return {count:3+n*2+Math.floor(n*n*0.2),interval:Math.max(0.3,0.9-n*0.04),
    comp:[['cultist',0.2],['knight',0.2],['zombie',0.25],['mage',0.15],['bat',0.2]]};
}
function pickKind(comp){ var r=Math.random(), acc=0;
  for(var i=0;i<comp.length;i++){ acc+=comp[i][1]; if(r<acc)return comp[i][0]; }
  return comp[0][0]; }

function makePlayer(){return {x:500,y:GROUND,vx:0,vy:0,face:1,onGround:true,walking:false,
  hp:100,maxHp:100,armor:0, shield:0, burnT:0,burnTick:0, mana:100,maxMana:100,manaRegen:6,
  level:0,xp:0,xpNeed:120, vitPicks:0,chaPicks:0,
  castCd:0,castFx:0,summonCd:0,heavyCd:0,swordCd:0,shieldCd:0,rejectCd:0,
  lanceT:0, beam:null, invT:0, hurtT:0,animT:0,alive:true,itemFx:null};}
function buildDeco(){ deco=[]; var dx=120;
  while(dx<WORLD_W-120){ deco.push({x:dx,type:Math.floor(Math.random()*4),s:rnd(0.8,1.4)}); dx+=rnd(160,420);}
  for(var c=0;c<3;c++){ deco.push({x:rnd(300,WORLD_W-300),type:4,taken:false,s:1}); } }
function startRun(){ clearLvlTimers(); hideLevelOverlay();
  invOverlay.hidden=true; vendorOverlay.hidden=true; tutOverlay.hidden=true; assignOverlay.hidden=true;
  overOverlay.hidden=true; finalOverlay.hidden=true; choiceOverlay.hidden=true; dlgTutEl.hidden=true;
  player=makePlayer(); bolts=[];ebolts=[];arrows=[];foes=[];minions=[];parts=[];floaters=[];rings=[];
  swordRain=[];pickups=[];debris=[];corpseFx=null; skyFxT=0; flashT=0; hitstopT=0; overT=0; gameFade=0;
  boltHeld=false; boltHold=0; chargeT=0;
  continuesLeft=3; deathT=0; deathBoom=false; deathDone=false; deathFade=0;
  spells={gravebolt:true,rite:true,lance:false,gravefall:false,mantle:false};
  acquiredOrder=['gravebolt','rite'];
  hotkeys=['gravebolt','rite',null,null,null,null];
  intentionalNone=[false,false,false,false,false,false];
  renderSlotIcons();
  gold=0; inv={heart:0,shard:0,tincture:0,page:0,grief:0,signet:0,jester:0,pewter:0}; wardT=0; vBought={};
  zombSceneDone=false; jesterSpoken=false; jesterT=0; vendorDone=false; griefDropped=false;
  FLAGS={truth:0,deception:0,mercy:0,cruelty:0,intimidation:0,reputation:0,
    mara:0,noble:0,jesterInf:0,jesterInstab:0,truthRevealed:false,escalated:false,passed:false,
    bluffOk:false,intimOk:false,intimPart:false,maraCalm:false};
  stageNum=1; cs=null; introT=0; introMon=false;
  levelFxT=0; buildDeco(); score=0; waveNum=1; camX=clamp(player.x-VW/2,0,WORLD_W-VW);
  cvs.style.filter=''; mode='intro'; }
function beginWave(n){
  var wd=waveDef(n);
  currentComp=wd.comp||[['knight',1]];
  if(isBossWave(n)){
    var pp=player;
    if(pp&&pp.alive&&pp.mana<pp.maxMana*0.5){
      pp.mana=Math.min(pp.maxMana,pp.mana+pp.maxMana*0.6);
      floater(pp.x,pp.y-120,'MANA SURGE','#7dffc0'); sfx.absorb();
      puff(pp.x,pp.y-60,12,'#5cffa0',120,-60,0.6,3);
    }
    if(n===5){ spawnQueue=2; spawnT=2.5; spawnSkelord(); bossIntroCS(); }
    else if(n%10===5){ spawnQueue=2; spawnT=1.2; spawnSkelord(); bannerTxt='THE SKELETAL LORD RISES'; sfx.bossRoar(); }
    else { spawnQueue=3; spawnT=1.2; spawnBoss(); bannerTxt='THE GRAVE LORD RISES'; }
  }
  else {
    spawnQueue=wd.count; spawnT=wd.interval;
    bannerTxt=(n===6)?(FLAGS.escalated?'THE GATHERERS TURN':'STAGE II — THE DARK FOREST'):('WAVE '+n);
    sfx.wave();
    if(n===3){ memoryCS('gravefall','GRAVEFALL',[
      'Ash and cinders... a magus that will not touch the earth.',
      'The sky once rained for me. Let it rain again.']); }
    if(n===4){ memoryCS('mantle','OSSUARY MANTLE',[
      'They press on all sides. Even a queen may not be everywhere.',
      'Bone of my bone: be my mantle.']); }
  }
  bannerT=2.4;
}
function resolveStage2(esc){
  FLAGS.escalated=esc; FLAGS.passed=!esc;
  stageNum=2;
  beginWave(6);
  if(esc){
    foes.push({kind:'mara',x:clamp(player.x+260,40,WORLD_W-40),y:GROUND,hp:14,face:-1,atkCd:1,hurtT:0,kb:0,phase:0,speed:95,dead:false,lungeT:0,stunT:0,engagedOnce:false,pushing:false,pushT:0});
    for(var i=0;i<2;i++)foes.push({kind:'cultist',x:clamp(player.x+(i?320:-300),40,WORLD_W-40),y:GROUND,hp:4,face:i?1:-1,atkCd:0,hurtT:0,kb:0,phase:rnd(0,6),speed:70,dead:false,lungeT:0,stunT:0,engagedOnce:false,pushing:false,pushT:0});
  }
}
function memoryCS(spellId,title,lines){
  var steps=[{k:'tint',d:0.4}];
  for(var i=0;i<lines.length;i++)steps.push({k:'say',who:'THE NECRO QUEEN',text:lines[i]});
  steps.push({k:'say',who:'',text:'...I remember.'});
  steps.push({k:'fn',run:function(){ acquireSpell(spellId);
    floater(player.x,player.y-120,'SPELL ACQUIRED: '+title,'#b18cff'); }});
  steps.push({k:'untint',d:0.4});
  playCS(steps);
}
function makeRetinue(name,x,kind){ return {name:name,kind:kind||'melee',x:x,y:GROUND,face:name==='nameA'?-1:1,
  hp:name==='nameB'?5:4,atkCd:0,phase:rnd(0,6),dead:false,rise:0}; }
function dirtBurst(x){
  puff(x,GROUND,14,'#3a2c1f',90,-60,0.6,3);
  puff(x,GROUND,8,'#4a5a3e',70,-40,0.5,2);
  boneDebris(x,GROUND-6,3,90);
}
function introRiseCS(){
  playCS([
    {k:'wait',d:0.6},
    {k:'say',who:'THE NECRO QUEEN',text:'Rise.'},
    {k:'fn',run:function(){
      shakeT=0.3; sfx.slam(); sfx.rise();
      minions.push(makeRetinue('nameA',player.x-46));
      minions.push(makeRetinue('nameB',player.x+46));
      dirtBurst(player.x-46); dirtBurst(player.x+46);
    }},
    {k:'wait',d:1.8},
    {k:'fn',run:function(){ sfx.clatter(); }},
    {k:'say',who:'NAME A',text:'[Teeth clatter in a rapid, deliberate rhythm. Its skull turns toward the distant ruins, one bony hand tightening around its rusted scimitar.]'},
    {k:'say',who:'THE NECRO QUEEN',text:'I know.'},
    {k:'fn',run:function(){ sfx.clicks(); }},
    {k:'say',who:'NAME B',text:'[A slower sequence of bone clicks follows. The skeleton raises its rusted scimitar slightly and watches the forest beyond the graveyard.]'},
    {k:'say',who:'THE NECRO QUEEN',text:'Yes. Watch the trees.'},
    {k:'end',run:function(){ beginWave(1); }}
  ]);
}
/* ---- STAGE 2 NARRATIVE ---- */
function startRidgeCS(){
  playCS([
    {k:'still',v:1,img:roadImg},
    {k:'say',who:'',text:'[Several hours later.]'},
    {k:'black',d:0.6},
    {k:'still',v:1,img:ridgeImg},
    {k:'unblack',d:0.8},
    {k:'fn',run:function(){ sfx.thud(); }},
    {k:'say',who:'',text:'[THUD]'},
    {k:'wait',d:0.7},
    {k:'fn',run:function(){ sfx.thud(); }},
    {k:'say',who:'',text:'[THUD]'},
    {k:'say',who:'',text:'[Something heavy moves among the trees.]'},
    {k:'say',who:'THE NECRO QUEEN',text:'The night has not been idle.'},
    {k:'say',who:'',text:'[Somewhere below, the forest waits.]'},
    {k:'still',v:0},
    {k:'end',run:function(){ encounterCS(); }}
  ]);
}
function rollBluff(bonus){
  var p=player;
  var b=(inv.jester>0?1:0)+Math.min(2,FLAGS.jesterInf)+bonus+Math.floor(Math.random()*3);
  FLAGS.bluffOk=(p.chaPicks+b)>=3;
}
function rollIntim(){
  var p=player;
  var val=p.level+p.chaPicks+(inv.jester>0?1:0)+Math.floor(Math.random()*3);
  FLAGS.intimOk=val>=6; FLAGS.intimPart=val>=4;
}
var ENC=[
 {k:'wait',d:0.6},
 {k:'say',who:'',text:'[The forest suddenly falls silent.]'},
 {k:'say',who:'MARA',text:'Halt.'},
 {k:'say',who:'THE NECRO QUEEN',text:'You first.'},
 {k:'say',who:'',text:'[Mara studies the Queen.]'},
 {k:'say',who:'MARA',text:'Who are you?'},
 {id:'c1',k:'choice',options:[
   {t:'DIPLOMACY',q:'“I have no quarrel with you. Let me pass.”',goto:'dip1',fx:function(){FLAGS.mara+=1;}},
   {t:'BLUFF',q:'“I was sent to investigate disturbances in this forest.”',goto:'bluff1',fx:function(){FLAGS.deception+=1;}},
   {t:'INTIMIDATION',q:'“You should be asking yourself whether you can afford to stop me.”',goto:'int1',fx:function(){FLAGS.intimidation+=1;}},
   {t:'TRUTH',q:'“I am seeking what remains of my kingdom.”',goto:'tru1',fx:function(){FLAGS.truth+=1;}},
   {t:'CHEEKY LIE',q:'“I am a travelling nun.”',goto:'nun1',fx:function(){FLAGS.deception+=1;}},
   {t:'SILENCE',q:'Remain silent.',goto:'sil1'}]},
 {id:'dip1',k:'say',who:'THE NECRO QUEEN',text:'I have no quarrel with you. Let me pass.'},
 {k:'say',who:'MARA',text:'Perhaps.'},
 {k:'say',who:'',text:'[Mara looks toward the forest.]'},
 {k:'say',who:'MARA',text:'There are dangerous things here.'},
 {k:'say',who:'THE NECRO QUEEN',text:'So I have noticed.'},
 {k:'say',who:'NOBLEMAN',text:'Mara.'},
 {k:'say',who:'NOBLEMAN',text:'You are frightening our guest.'},
 {k:'say',who:'MARA',text:'She arrived with two dead men.'},
 {k:'say',who:'NOBLEMAN',text:'Yes. I noticed.'},
 {k:'say',who:'NOBLEMAN',text:'We gather herbs. Roots. Mushrooms. The forest provides, if one is careful.'},
 {k:'say',who:'NOBLEMAN',text:'There are wolves in these woods. And worse. You should leave.'},
 {id:'cdip',k:'choice',options:[
   {t:'CONTINUE DIPLOMATICALLY',q:'“Then I will walk carefully, as you do.”',goto:'dipPass',fx:function(){FLAGS.mara+=1;FLAGS.noble+=1;}},
   {t:'ASK QUESTIONS',q:'“What do you really gather here?”',goto:'dipAsk'},
   {t:'LEAVE',q:'Turn to leave.',goto:'dipPass'},
   {t:'CHALLENGE',q:'“Your story has holes, nobleman.”',goto:'dipChal',fx:function(){FLAGS.noble-=1;}}]},
 {id:'dipAsk',k:'say',who:'NOBLEMAN',text:'What the forest offers. Nothing more.'},
 {k:'say',who:'',text:'[His smile does not reach his eyes.]'},
 {id:'cdip2',k:'choice',options:[
   {t:'LEAVE',q:'Accept the answer. Leave.',goto:'dipPass'},
   {t:'CHALLENGE',q:'“You are lying.”',goto:'dipChal',fx:function(){FLAGS.noble-=1;}}]},
 {id:'dipChal',k:'say',who:'NOBLEMAN',text:'Careful, traveller. Accusations are knives.'},
 {k:'say',who:'MARA',text:'Enough.'},
 {k:'say',who:'',text:'[The forest holds its breath.]'},
 {k:'fn',run:function(){ FLAGS.maraCalm=(FLAGS.mara>0)||Math.random()<0.4; }},
 {id:'dipChal2',k:'gotoIf',flag:'maraCalm',yes:'dipPass',no:'escStart'},
 {id:'dipPass',k:'say',who:'NOBLEMAN',text:'Then walk carefully, traveller. The forest keeps accounts.'},
 {k:'say',who:'MARA',text:'Pass. And do not stop twice.'},
 {k:'say',who:'',text:'[The gatherers watch as the Queen passes.]'},
 {id:'passEnd',k:'end',run:function(){ resolveStage2(false); }},
 {id:'bluff1',k:'say',who:'THE NECRO QUEEN',text:'I was sent to investigate disturbances in this forest.'},
 {k:'say',who:'NOBLEMAN',text:'By whom?'},
 {id:'cbluff',k:'choice',options:[
   {t:'A',q:'“The provincial authorities.”',goto:'bluffA'},
   {t:'B',q:'“The Church.”',goto:'bluffB'},
   {t:'C',q:'“The Crown.”',goto:'bluffC'},
   {t:'D',q:'“That is not your concern.”',goto:'bluffD'},
   {t:'E',q:'“I\'m new.”',goto:'bluffE'}]},
 {id:'bluffA',k:'fn',run:function(){ rollBluff(1); }},
 {k:'gotoIf',flag:'bluffOk',yes:'bluffOk',no:'bluffNo'},
 {id:'bluffB',k:'fn',run:function(){ FLAGS.bluffOk=false; }},
 {k:'goto',goto:'bluffNo'},
 {id:'bluffC',k:'fn',run:function(){ FLAGS.bluffOk=true; FLAGS.noble+=1; }},
 {k:'goto',goto:'bluffC2'},
 {id:'bluffD',k:'fn',run:function(){ rollBluff(0); }},
 {k:'gotoIf',flag:'bluffOk',yes:'bluffOk',no:'bluffNo'},
 {id:'bluffE',k:'fn',run:function(){ FLAGS.bluffOk=true; FLAGS.mara+=1; }},
 {k:'goto',goto:'bluffE2'},
 {id:'bluffOk',k:'say',who:'NOBLEMAN',text:'Then investigate elsewhere, envoy. There is nothing here for you.'},
 {k:'say',who:'MARA',text:'Go. Before we change our minds.'},
 {k:'goto',goto:'passEnd2'},
 {id:'bluffC2',k:'say',who:'NOBLEMAN',text:'The Crown. Then we are all servants of something larger.'},
 {k:'say',who:'NOBLEMAN',text:'Walk your road, traveller. We will keep to ours.'},
 {k:'goto',goto:'passEnd2'},
 {id:'bluffE2',k:'say',who:'',text:'[Mara almost smiles. Almost.]'},
 {k:'say',who:'MARA',text:'Then be new somewhere else, traveller.'},
 {k:'goto',goto:'passEnd2'},
 {id:'bluffNo',k:'say',who:'MARA',text:'You lie badly.'},
 {id:'cbluff2',k:'choice',options:[
   {t:'INTIMIDATE',q:'“Then you should fear me instead.”',goto:'int1',fx:function(){FLAGS.intimidation+=1;FLAGS.deception+=1;}},
   {t:'YIELD',q:'Step back. Leave.',goto:'dipPass',fx:function(){FLAGS.mercy+=1;}}]},
 {id:'passEnd2',k:'say',who:'',text:'[The gatherers watch as the Queen passes.]'},
 {k:'goto',goto:'passEnd'},
 {id:'int1',k:'say',who:'THE NECRO QUEEN',text:'You should be asking yourself whether you can afford to stop me.'},
 {k:'say',who:'',text:'[Mara\'s hand drifts toward the silver sword. She does not draw it.]'},
 {k:'say',who:'NOBLEMAN',text:'Mara.'},
 {k:'say',who:'',text:'[She stops.]'},
 {k:'fn',run:function(){ rollIntim(); }},
 {k:'gotoIf',flag:'intimOk',yes:'intOk',no:'intPartNo'},
 {id:'intOk',k:'say',who:'NOBLEMAN',text:'We will not stop you. Walk.'},
 {k:'say',who:'MARA',text:'Next time, fewer dead companions.'},
 {k:'goto',goto:'passEnd2'},
 {id:'intPartNo',k:'gotoIf',flag:'intimPart',yes:'intPart',no:'escStart'},
 {id:'intPart',k:'say',who:'NOBLEMAN',text:'The forest is not safe, traveller. That is not a threat. It is a courtesy.'},
 {k:'say',who:'MARA',text:'Pass. Carefully.'},
 {k:'goto',goto:'passEnd2'},
 {id:'tru1',k:'say',who:'THE NECRO QUEEN',text:'I am seeking what remains of my kingdom.'},
 {k:'say',who:'MARA',text:'Kingdom?'},
 {k:'say',who:'THE NECRO QUEEN',text:'What was once mine.'},
 {k:'say',who:'',text:'[The nobleman reassesses her.]'},
 {k:'say',who:'NOBLEMAN',text:'Then we are neighbours in a dangerous place, Your Majesty.'},
 {k:'fn',run:function(){ FLAGS.truthRevealed=true; FLAGS.noble+=2; FLAGS.reputation+=1; }},
 {k:'say',who:'NOBLEMAN',text:'Pass freely. We did not see you.'},
 {k:'goto',goto:'passEnd2'},
 {id:'nun1',k:'say',who:'THE NECRO QUEEN',text:'I am a travelling nun.'},
 {k:'say',who:'',text:'[Mara stares at the Queen.]'},
 {k:'say',who:'',text:'[Then at the skeletons.]'},
 {k:'say',who:'',text:'[Then back at the Queen.]'},
 {k:'say',who:'MARA',text:'Of what order?'},
 {id:'cnun',k:'choice',options:[
   {t:'A',q:'“The Order of the Black Veil.”',goto:'nunA'},
   {t:'B',q:'“The Sisters of Perpetual Silence.”',goto:'nunB'},
   {t:'C',q:'“The Order of Saint Whatever.”',goto:'nunC'},
   {t:'D',q:'“I\'m new.”',goto:'nunD'},
   {t:'E',q:'“I was hoping you wouldn\'t ask.”',goto:'nunE'}]},
 {id:'nunA',k:'say',who:'',text:'[The nobleman hides a smile.]'},
 {k:'say',who:'NOBLEMAN',text:'The Black Veil. Of course. We have heard of your... order.'},
 {k:'goto',goto:'nunEnd'},
 {id:'nunB',k:'say',who:'MARA',text:'And yet you speak.'},
 {k:'say',who:'THE NECRO QUEEN',text:'A weakness of my order.'},
 {k:'goto',goto:'nunEnd'},
 {id:'nunC',k:'say',who:'',text:'[A faint chuckle rises from the satchel. It stops.]'},
 {k:'fn',run:function(){ FLAGS.jesterInstab+=1; }},
 {k:'say',who:'MARA',text:'...Saint Whatever. Yes. We will remember that.'},
 {k:'goto',goto:'nunEnd'},
 {id:'nunD',k:'say',who:'MARA',text:'Then learn quickly, sister.'},
 {k:'goto',goto:'nunEnd'},
 {id:'nunE',k:'say',who:'',text:'[Mara almost smiles.]'},
 {k:'say',who:'MARA',text:'Then I will not ask. Be gone, sister.'},
 {k:'goto',goto:'nunEnd'},
 {id:'nunEnd',k:'say',who:'',text:'[The gatherers watch as the Queen passes.]'},
 {k:'fn',run:function(){ FLAGS.mara+=1; }},
 {k:'goto',goto:'passEnd'},
 {id:'sil1',k:'say',who:'',text:'[The Queen simply watches.]'},
 {k:'say',who:'',text:'[Mara shifts.]'},
 {k:'say',who:'NOBLEMAN',text:'We are gatherers, traveller. Herbs and roots. Nothing more.'},
 {k:'say',who:'',text:'[The silence continues.]'},
 {k:'say',who:'MARA',text:'...Pass. Before I change my mind.'},
 {k:'fn',run:function(){ FLAGS.intimidation+=1; }},
 {k:'goto',goto:'passEnd2'},
 {id:'escStart',k:'say',who:'',text:'[The forest holds its breath.]'},
 {k:'say',who:'MARA',text:'She is not what she seems. Take her.'},
 {k:'say',who:'THE NECRO QUEEN',text:'So be it.'},
 {id:'escEnd',k:'end',run:function(){ resolveStage2(true); }}
];
function encounterCS(){ playCS(ENC); }
function spawnBatAt(x,y){ foes.push({kind:'bat',x:x,y:y,baseY:y,hp:1,face:1,atkCd:0,hurtT:0,kb:0,
  phase:rnd(0,6),speed:rnd(80,110)+waveNum*5,dead:false,lungeT:0,stunT:0}); }
function spawnFly(x,y){ foes.push({kind:'fly',x:x,y:y,hp:1,face:1,hurtT:0,kb:0,phase:rnd(0,6),
  life:12,dead:false,stunT:0}); sfx.buzz(); }
function spawnZombie(sx){ foes.push({kind:'zombie',x:sx,y:GROUND,hp:8+Math.floor(waveNum*1.5),face:1,
  atkCd:0,hurtT:0,kb:0,phase:rnd(0,6),speed:rnd(16,24),dead:false,lungeT:0,stunT:0,engagedOnce:false,pushing:false,pushT:0}); }
function spawnCultist(sx){ foes.push({kind:'cultist',x:sx,y:GROUND,hp:4,face:1,
  atkCd:0,hurtT:0,kb:0,phase:rnd(0,6),speed:70,dead:false,lungeT:0,stunT:0,engagedOnce:false,pushing:false,pushT:0}); }
function spawnMage(sx){ foes.push({kind:'mage',x:sx,y:GROUND-170,baseY:GROUND-170,hp:2,face:1,
  atkCd:rnd(1.5,3),hurtT:0,kb:0,phase:rnd(0,6),dead:false,stunT:0}); }
function spawnOne(){
  var side=Math.random()<0.5?-1:1;
  var sx=clamp(player.x+side*rnd(VW*0.6,VW*1.0),40,WORLD_W-40);
  if(Math.abs(sx-player.x)<240){sx=clamp(player.x+side*480,40,WORLD_W-40);}
  var kind=pickKind(currentComp);
  if(kind==='mage')spawnMage(sx);
  else if(kind==='zombie')spawnZombie(sx);
  else if(kind==='bat')spawnBatAt(sx,GROUND-rnd(120,190));
  else if(kind==='cultist')spawnCultist(sx);
  else foes.push({kind:'knight',x:sx,y:GROUND,hp:3,face:1,atkCd:0,hurtT:0,kb:0,phase:rnd(0,6),
    speed:rnd(50,70)+waveNum*6,dead:false,lungeT:0,stunT:0,engagedOnce:false,pushing:false,pushT:0});
}
function spawnBoss(){
  var side=Math.random()<0.5?-1:1;
  var sx=clamp(player.x+side*VW*0.8,80,WORLD_W-80);
  var bhp=30+waveNum*5;
  foes.push({kind:'boss',x:sx,y:GROUND,hp:bhp,maxHp:bhp,face:1,atkCd:2,hurtT:0,kb:0,phase:0,
    speed:32+waveNum*2,dead:false,lungeT:0,summonCd:6,stunT:0,touchCd:0});
  shakeT=0.6; sfx.bossRoar();
}
function spawnSkelord(){
  var side=Math.random()<0.5?-1:1;
  var sx=clamp(player.x+side*VW*0.9,90,WORLD_W-90);
  var bhp=70+waveNum*4;
  foes.push({kind:'skelord',x:sx,y:GROUND,hp:bhp,maxHp:bhp,face:1,atkCd:2,hurtT:0,kb:0,phase:0,
    speed:26+waveNum,dead:false,dying:false,lungeT:0,summonCd:4,swarmCd:8,atkN:0,stunT:0,touchCd:0});
}
function puff(x,y,n,color,spd,grav,life,size){
  for(var i=0;i<n;i++){ var a=rnd(0,6.283), s=rnd(spd*0.3,spd);
    parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-spd*0.3,g:grav,life:life*rnd(0.5,1),max:life,c:color,size:size}); } }
function floater(x,y,tstr,color){ floaters.push({x:x,y:y,txt:tstr,c:color,life:1}); }
function gainXp(n){ var p=player; p.xp+=n; floater(p.x,p.y-118,'+'+n+' XP','#d8a94e'); }
function pushPick(kind,x){ pickups.push({kind:kind,x:clamp(x,30,WORLD_W-30),y:GROUND-16,t:rnd(0,6)}); }
function boneDebris(x,y,n,spd){
  for(var i=0;i<n;i++){ debris.push({x:x+rnd(-14,14),y:y+rnd(-14,14),vx:rnd(-spd,spd),vy:rnd(-spd*1.2,-spd*0.3),
    rot:rnd(0,6),vr:rnd(-8,8),size:rnd(2,6),c:Math.random()<0.8?'#e8e6d4':'#b9b6a2',life:rnd(0.6,1.2),max:1.2,g:600}); } }
function minionDmg(f){ return 1 + (inv.signet>0?1:0) + ((f&&f.pushing)?1:0); }

var ITEMS={
 heart:{name:'STILL-HEART',cat:'CONSUMABLES',desc:'A preserved, motionless heart. Restores 40 Life. Hastens cooldowns slightly.'},
 shard:{name:'SPECTRAL SHARD',cat:'CONSUMABLES',desc:'Condensed ghostly energy. Restores 40 Mana. Hastens cooldowns slightly.'},
 tincture:{name:'GARLIC TINCTURE',cat:'CONSUMABLES',desc:'Wards off vampire influence for a time.'},
 page:{name:'LOST GRIMOIRE PAGE',cat:'LORE / SPECIAL',desc:'A torn page. The ink is faded beyond reading.'},
 grief:{name:"ALCHEMIST'S GRIEF",cat:'LORE / SPECIAL',desc:'Liquid silver that expands under pressure, inert in its pouch. Poisonous, temperature-reactive.'},
 signet:{name:'SIGNET OF POWER',cat:'RELICS / MYSTERIES',desc:'A royal signet ring, darkened. (Equipped: summoned skeletons strike harder.)'},
 jester:{name:"SHRUNKEN JESTER'S HEAD",cat:'RELICS / MYSTERIES',desc:"A preserved jester's head. Its expression seems strangely amused."},
 pewter:{name:'PEWTER CAT',cat:'RELICS / MYSTERIES',desc:'A tiny pewter cat. Finely made.'}
};
var SPELLS={
 gravebolt:{name:'GRAVEBOLT',icon:'✦',cost:4,cd:'—',types:'PHYSICAL / KINETIC · NEGATIVE AETHER',
  desc:'Rapid single-target bolt. Tap to fire; hold to charge a piercing wave.',
  lore:'The first lesson of the quiet court: even death may be thrown.',upg:'CHARGED: wall of black-violet force (18 mana).'},
 rite:{name:'RITE OF RETURNING',icon:'☠',cost:30,cd:'0.5s',types:'NEGATIVE AETHER',
  desc:'Calls her skeletal retinue from the earth, one fallen servant per casting. The dead do not stay buried.',
  lore:'They were her soldiers once. They still answer.',upg:'COURT OF BONE (LV6): a re-raised retainer may return as an archer.'},
 lance:{name:'GRAVE LANCE',icon:'❖',cost:25,cd:'10s',types:'PHYSICAL / KINETIC · NEGATIVE AETHER',
  desc:'A true beam discharge from the Queen to the far edge of the field. Pierces all.',
  lore:'Remembered when the dead pressed too close.',upg:'—'},
 gravefall:{name:'GRAVEFALL',icon:'⚔',cost:75,cd:'12s',types:'AETHER · LIGHTNING',
  desc:'Eighteen blades rain, biased to airborne prey. Stuns.',
  lore:'The sky once rained for her. It remembers.',upg:'—'},
 mantle:{name:'OSSUARY MANTLE',icon:'🛡',cost:20,cd:'8s',types:'NEGATIVE AETHER',
  desc:'Sacrifice a skeleton for white Bone Armour.',
  lore:"A servant's last duty is the shield.",upg:'—'}
};
var spells={gravebolt:true,rite:true,lance:false,gravefall:false,mantle:false};
var acquiredOrder=['gravebolt','rite'];
function acquireSpell(id){ if(spells[id])return; spells[id]=true; acquiredOrder.push(id); sfx.spell();
  var slot=-1;
  for(var i=0;i<6;i++){ if(hotkeys[i]===null&&!intentionalNone[i]){slot=i;break;} }
  if(slot>=0){ hotkeys[slot]=id; renderSlotIcons();
    if(player&&player.alive)floater(player.x,player.y-130,'BOUND TO SLOT '+(slot+1),'#b18cff'); }
  else if(player&&player.alive){ floater(player.x,player.y-130,'NEW SPELL — ASSIGN A HOTKEY','#ffd166'); }
}
var VSTOCK=[{id:'heart',price:3},{id:'shard',price:3},{id:'page',price:5},{id:'jester',price:8},{id:'pewter',price:12}];
var vBought={};
var CHAR_CANON={ name:null, surname:null };
function charNameLine(){ return ((CHAR_CANON.name||'— —')+' '+(CHAR_CANON.surname||'')).trim(); }

function foeDie(f){
  if(f.kind==='skelord'){
    score+=800; gainXp(300);
    if(waveNum===5&&!vendorDone&&mode==='playing'){ f.dying=true; bossDefeatCS(f); }
    else { f.dead=true; puff(f.x,f.y-100,40,'#bfe8ff',260,-40,1.2,4);
      puff(f.x,f.y-100,24,'#c05cff',220,200,1.0,4); shakeT=0.7; sfx.bossDie(); }
    return;
  }
  f.dead=true;
  if(f.kind==='fly'){ score+=5; puff(f.x,f.y,4,'#9fd8ff',80,200,0.3,2);
    if(Math.random()<0.5)pushPick('wisp',f.x);
    return; }
  if(f.kind==='mage'){
    score+=30; gainXp(28);
    player.mana=Math.min(player.maxMana,player.mana+5);
    floater(f.x,f.y-30,'+30','#7dffc0');
    puff(f.x,f.y,12,'#ff9a3d',140,200,0.5,3);
    puff(f.x,f.y,8,'#e8e6d4',120,300,0.6,3); sfx.kill();
    if(!griefDropped){ griefDropped=true; pushPick('grief',f.x); }
    else if(Math.random()<0.5){ pushPick('grief',f.x); }
    return;
  }
  if(f.kind==='zombie'){
    score+=40; gainXp(32);
    player.mana=Math.min(player.maxMana,player.mana+5);
    floater(f.x,f.y-80,'+40','#7dffc0');
    puff(f.x,f.y-50,14,'#4a5a3e',140,400,0.7,4);
    puff(f.x,f.y-50,8,'#5cffa0',90,-60,0.8,3); sfx.kill();
    var rr=Math.random();
    if(rr<0.12)pushPick('heart',f.x); else if(rr<0.22)pushPick('shard',f.x); else if(rr<0.42)pushPick('gold',f.x);
    return;
  }
  if(f.kind==='cultist'){
    score+=30; gainXp(24);
    player.mana=Math.min(player.maxMana,player.mana+4);
    floater(f.x,f.y-70,'+30','#7dffc0');
    puff(f.x,f.y-40,10,'#2a2440',140,400,0.6,3); sfx.kill();
    var rc=Math.random();
    if(rc<0.12)pushPick('heart',f.x); else if(rc<0.2)pushPick('shard',f.x); else if(rc<0.4)pushPick('gold',f.x);
    return;
  }
  if(f.kind==='mara'){
    score+=200; gainXp(120);
    floater(f.x,f.y-90,'MARA FALLS','#ff8d9d');
    puff(f.x,f.y-44,20,'#2a2440',200,200,0.8,3); sfx.kill();
    return;
  }
  if(f.kind==='boss'){
    score+=500; gainXp(250);
    player.mana=Math.min(player.maxMana,player.mana+50);
    player.hp=Math.min(player.maxHp,player.hp+30);
    floater(f.x,f.y-150,'+500','#ffd166');
    puff(f.x,f.y-70,40,'#bfe8ff',260,-40,1.2,4);
    puff(f.x,f.y-70,24,'#c05cff',220,200,1.0,4);
    shakeT=0.7; sfx.bossDie();
    return;
  }
  var pts=f.kind==='bat'?15:25; score+=pts;
  gainXp(f.kind==='bat'?14:22);
  player.mana=Math.min(player.maxMana,player.mana+5);
  floater(f.x,f.y-70,'+'+pts,'#7dffc0');
  puff(f.x,f.y-40,10,'#e8e6d4',140,500,0.6,3);
  puff(f.x,f.y-40,8,'#5cffa0',90,-60,0.8,3); sfx.kill();
  var r=Math.random();
  if(r<0.10)pushPick('heart',f.x);
  else if(r<0.20)pushPick('shard',f.x);
  else if(r<0.45)pushPick('gold',f.x);
}
function minionDie(m){ m.dead=true; puff(m.x,m.y-24,10,'#e8e6d4',120,500,0.6,3); sfx.hit(); }
function killPlayer(){ var p=player; if(!p.alive)return;
  p.hp=0; p.alive=false; overT=0;
  mode='dying'; deathT=0; deathBoom=false; deathDone=false; deathFade=0;
  sfx.death(); }
function hurtPlayer(dmg,fromFace,magical){ var p=player; if(p.hurtT>0||!p.alive)return;
  if(p.invT>0)return;
  var red=Math.round(dmg*(1-p.armor)); if(red<1)red=1;
  if(!magical&&p.shield>0){
    var ab=Math.min(p.shield,red); p.shield-=ab; red-=ab;
    floater(p.x,p.y-118,'-'+ab+' BONE','#e8e6d4');
    puff(p.x,p.y-50,8,'#e8e6d4',110,300,0.4,3); sfx.hit();
    if(red<=0){ p.hurtT=0.6; return; }
  }
  p.hp-=red; p.hurtT=1.3; p.x=clamp(p.x+fromFace*26,30,WORLD_W-30); shakeT=0.4;
  floater(p.x,p.y-105,'-'+red,'#ff5c6d');
  puff(p.x,p.y-50,10,'#c05cff',120,300,0.5,3); sfx.hurt();
  if(p.hp<=0){ killPlayer(); } }
function noMana(){ var p=player; if(p.rejectCd<=0){ p.rejectCd=0.6; floater(p.x,p.y-105,'NO MANA','#7dffc0'); sfx.deny(); } }

function findCounterTarget(p){
  var bestE=null, bestD=1e9;
  for(var i=0;i<ebolts.length;i++){ var eb=ebolts[i]; if(eb.dead)continue;
    var dx=eb.x-p.x, dy=eb.y-(p.y-56);
    var d=Math.sqrt(dx*dx+dy*dy);
    if(d<COUNTER_RADIUS&&d<bestD){ bestD=d; bestE=eb; } }
  return bestE;
}
function counterNearby(p){
  for(var i=0;i<ebolts.length;i++){ var eb=ebolts[i]; if(eb.dead)continue;
    var dx=eb.x-p.x, dy=eb.y-(p.y-56);
    if(dx*dx+dy*dy<150*150)return true; }
  return false;
}
function doCounter(eb){
  var p=player;
  eb.dead=true;
  p.hp-=1;
  p.mana=Math.min(p.maxMana,p.mana+COUNTER_MANA);
  recoverCooldowns(COUNTER_CD_PCT);
  flashT=0.12; p.castFx=0.3;
  floater(p.x,p.y-118,'COUNTER +'+COUNTER_MANA+' MANA','#7dffc0');
  for(var i=0;i<10;i++){
    parts.push({x:eb.x+rnd(-6,6),y:eb.y+rnd(-6,6),vx:(p.x-eb.x)*2.5+rnd(-30,30),vy:(p.y-60-eb.y)*2.5+rnd(-30,30),
      g:0,life:0.3,max:0.3,c:Math.random()<0.5?'#b18cff':'#5cffa0',size:3});
  }
  rings.push({x:eb.x,y:eb.y,r:4,life:0.4,c:'125,255,192'});
  sfx.counter();
  if(p.hp<=0)killPlayer();
}
function openCounterTutorial(){
  counterTutDone=true;
  try{localStorage.setItem('ab_tut_counter','1');}catch(e){}
  mode='tutorial';
  tutOverlay.hidden=false;
}
var tutOverlay=document.getElementById('tutOverlay');
document.getElementById('tutContinue').addEventListener('click',function(){
  tutOverlay.hidden=true; if(mode==='tutorial')mode='playing';
});

/* ---- dialogue choices ---- */
var choiceOverlay=document.getElementById('choiceOverlay');
var dlgTutEl=document.getElementById('dlgTut');
document.getElementById('dlgTutContinue').addEventListener('click',function(ev){
  ev.stopPropagation();
  dlgTutEl.hidden=true;
  if(cs&&cs.pendingOptions)renderChoices(cs.pendingOptions);
});
function showChoices(options){
  cs.pendingOptions=options;
  if(!dlgTutDone){
    dlgTutDone=true;
    try{localStorage.setItem('ab_dlagtut','1');}catch(e){}
    dlgTutEl.hidden=false;
  } else renderChoices(options);
}
function renderChoices(options){
  var h='';
  if(inv.jester>0&&Math.random()<0.35){
    FLAGS.jesterInf++; FLAGS.jesterInstab++;
    h+='<div class="jhint">[The satchel gives a tiny rustle.]</div>';
  }
  for(var i=0;i<options.length;i++){
    h+='<button class="cbtn" data-idx="'+i+'"><span class="ctag">'+options[i].t+'</span>'+options[i].q+'</button>';
  }
  choiceOverlay.innerHTML=h;
  choiceOverlay.hidden=false;
  var btns=choiceOverlay.querySelectorAll('.cbtn');
  for(var b=0;b<btns.length;b++){
    btns[b].addEventListener('click',function(ev){
      ev.stopPropagation();
      var opt=options[parseInt(this.getAttribute('data-idx'),10)];
      chooseOption(opt);
    });
  }
}
function hideChoices(){ choiceOverlay.hidden=true; }
function chooseOption(opt){
  hideChoices();
  cs.pendingOptions=null;
  if(opt.fx)opt.fx();
  sfx.tap();
  if(opt.goto){ jumpTo(opt.goto); } else csNext();
}
function findStepId(id){ for(var i=0;i<cs.steps.length;i++){ if(cs.steps[i].id===id)return i; } return -1; }
function jumpTo(id){ var idx=findStepId(id);
  if(idx>=0){ cs.i=idx; cs.t=0; cs.dialog=null; cs.choiceShown=false; } }

function boltDown(){ if(mode!=='playing')return;
  var p=player; if(!p||!p.alive)return;
  var ceb=findCounterTarget(p);
  if(ceb){ doCounter(ceb); return; }
  boltHeld=true; boltHold=0; chargeT=0; apexPlayed=false;
}
function boltUp(){ if(!boltHeld)return; boltHeld=false;
  if(boltHold<=0.25){ fireBolt(); }
  else if(chargeT>=0.3){ fireCharged(); }
  chargeT=0; boltHold=0;
}
function fireBolt(){ var p=player; if(!p||!p.alive)return;
  if(p.castCd>0)return;
  if(p.mana>=COST_BOLT){ p.mana-=COST_BOLT; p.castCd=0.14; p.castFx=0.2;
    bolts.push({kind:'basic',x:p.x+p.face*26,y:p.y-56,vx:p.face*900,life:1.2,hits:null}); sfx.shoot();
  } else noMana();
}
function fireCharged(){ var p=player; if(!p||!p.alive)return;
  if(p.mana>=COST_CHARGED){ p.mana-=COST_CHARGED;
    bolts.push({kind:'wave',x:p.x+p.face*30,y:p.y-80,vx:p.face*420,life:2.2,hits:[]});
    shakeT=Math.max(shakeT,0.2); sfx.waveCast();
  } else noMana();
}
function castSpellById(id){ if(mode!=='playing')return; var p=player; if(!p||!p.alive)return;
  if(id==='rite'){
    if(p.summonCd>0)return;
    var target=null;
    if(!aliveName('nameA'))target='nameA';
    else if(!aliveName('nameB'))target='nameB';
    if(!target){
      if(p.rejectCd<=0){ p.rejectCd=0.6; floater(p.x,p.y-105,'THE RETINUE STANDS','#9aa7ff'); sfx.deny(); }
      return;
    }
    if(p.mana>=COST_SUMMON){
      p.mana-=COST_SUMMON; p.summonCd=0.5;
      var kind=(p.level>=UNLOCK_ARCHER&&Math.random()<0.5)?'archer':'melee';
      var mx=clamp(p.x+(target==='nameA'?-46:46),30,WORLD_W-30);
      minions.push(makeRetinue(target,mx,kind));
      dirtBurst(mx);
      rings.push({x:mx,y:GROUND,r:6,life:0.6,c:'92,255,160'});
      if(inv.signet>0)rings.push({x:mx,y:GROUND-30,r:4,life:0.5,c:'176,140,255'});
      puff(mx,GROUND,10,'#5cffa0',110,-80,0.6,3); sfx.summon();
    } else noMana();
  }
  else if(id==='lance'){
    if(p.heavyCd<=0&&p.lanceT<=0&&!p.beam){
      if(p.mana>=COST_HEAVY){ p.mana-=COST_HEAVY; p.heavyCd=CD_HEAVY; p.castFx=0.35;
        p.lanceT=0.65; sfx.lanceCharge(); }
      else noMana();
    }
  }
  else if(id==='gravefall'){
    if(p.swordCd<=0){
      if(p.mana>=COST_SWORD){ castSwordFall(); }
      else noMana();
    }
  }
  else if(id==='mantle'){
    if(p.shieldCd<=0)castBoneShield();
  }
}
function startBeam(p){
  p.beam={t:0,dir:p.face,y:p.y-60,hit:false};
  hitstopT=0.1; flashT=0.08; sfx.lanceFire();
}
function beamDamage(p){
  var dir=p.beam.dir, y=p.beam.y;
  for(var i=0;i<foes.length;i++){ var f=foes[i]; if(f.dead||f.dying)continue;
    if((f.x-p.x)*dir<-30)continue;
    var cy=foeCY(f);
    if(Math.abs(cy-y)<52){
      var bossKind=(f.kind==='boss'||f.kind==='skelord');
      f.hp-=bossKind?5:3; f.hurtT=0.2;
      if(Math.random()<0.5)f.stunT=Math.max(f.stunT||0,0.6);
      sfx.hit();
      if(bossKind)heavyExplode(f.x,cy);
      if(f.hp<=0)foeDie(f);
    } }
}
function castSwordFall(){
  var p=player; p.mana-=COST_SWORD; p.swordCd=CD_SWORD; sfx.swordCast(); sfx.thunder();
  skyFxT=1.1; shakeT=Math.max(shakeT,0.15);
  var pool=[], grounds=[];
  for(var i=0;i<foes.length;i++){ var f=foes[i]; if(f.dead||f.dying)continue;
    if(f.x<camX-80||f.x>camX+VW+80)continue;
    if(f.kind==='mage'){pool.push(f,f,f);}
    else if(f.kind==='bat'){pool.push(f,f);}
    else if(f.kind==='fly'){pool.push(f);}
    else grounds.push(f);
  }
  for(var s=0;s<18;s++){
    var ix, delay=0.45+rnd(0,0.4);
    var r=Math.random();
    if(pool.length&&r<0.75){ var t=pool[Math.floor(Math.random()*pool.length)];
      ix=t.x+rnd(-46,46); delay=0.4+rnd(0,0.3); }
    else if(grounds.length&&r<0.9){ var gt=grounds[Math.floor(Math.random()*grounds.length)];
      ix=gt.x+rnd(-40,40); }
    else ix=p.x+rnd(-VW*0.5,VW*0.5);
    swordRain.push({x:clamp(ix,30,WORLD_W-30),y:rnd(-560,-60),vy:rnd(624,840),dead:false,delay:delay});
  }
}
function castBoneShield(){
  var p=player;
  if(minions.length===0){
    if(p.rejectCd<=0){ p.rejectCd=0.6; floater(p.x,p.y-105,'NEED SKELETON','#e8e6d4'); sfx.deny(); }
    return;
  }
  if(p.mana<COST_SHIELD){ noMana(); return; }
  p.mana-=COST_SHIELD; p.shieldCd=CD_SHIELD;
  var m=minions.pop();
  for(var i=0;i<12;i++){
    parts.push({x:m.x+rnd(-10,10),y:m.y-rnd(10,50),
      vx:(p.x-m.x)*3+rnd(-40,40),vy:(p.y-52-(m.y-30))*3+rnd(-40,40),g:0,life:0.35,max:0.35,c:'#e8e6d4',size:3});
  }
  puff(m.x,m.y-20,10,'#e8e6d4',130,-60,0.5,3);
  p.shield=Math.min(80,p.shield+40);
  floater(p.x,p.y-105,'+40 BONE','#e8e6d4');
  rings.push({x:p.x,y:p.y-50,r:8,life:0.6,c:'232,230,212'});
  sfx.shield();
}
function heavyExplode(x,y){
  puff(x,y,16,'#5cffa0',220,60,0.6,3);
  puff(x,y,12,'#e8f6ff',180,-40,0.5,3);
  puff(x,y,10,'#7446ab',160,80,0.6,4);
  rings.push({x:x,y:y,r:6,life:0.5,c:'125,255,192'});
  shakeT=Math.max(shakeT,0.3); sfx.explo();
  for(var i=0;i<foes.length;i++){ var f=foes[i]; if(f.dead||f.dying)continue;
    var cy=foeCY(f);
    var dx=f.x-x, dy=cy-y;
    if(dx*dx+dy*dy<70*70){ f.hp-=2; f.hurtT=0.2; if(f.hp<=0)foeDie(f); } }
}
function foeCY(f){ return f.kind==='bat'||f.kind==='fly'||f.kind==='mage'?f.y:
  (f.kind==='skelord'?f.y-120:(f.kind==='boss'?f.y-65:((f.kind==='zombie')?f.y-52:((f.kind==='mara')?f.y-44:f.y-40)))); }
function doHeartFx(){ player.itemFx={k:'heart',t:0.55,burst:false}; sfx.pick(); }
function doShardFx(){ player.itemFx={k:'shard',t:0.6,burst:false}; sfx.pick(); }
function toonPop(x,y){ rings.push({x:x,y:y,r:3,life:0.3,c:'255,255,255'}); puff(x,y,6,'#e8ecf5',90,-60,0.35,2); }

