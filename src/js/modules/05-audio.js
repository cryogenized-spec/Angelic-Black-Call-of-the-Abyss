/* ================= AUDIO ================= */
var AC=null;
function unlockAudio(){ if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(err){}}
  if(AC&&AC.state==='suspended'){AC.resume();} }
function tone(f0,f1,dur,type,vol,delay){ if(!AC)return;
  try{ var t0=AC.currentTime+(delay||0); var osc=AC.createOscillator(); var gn=AC.createGain();
  osc.type=type||'square'; osc.frequency.setValueAtTime(f0,t0);
  if(f1){osc.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t0+dur);}
  gn.gain.setValueAtTime(vol||0.1,t0); gn.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  osc.connect(gn); gn.connect(AC.destination); osc.start(t0); osc.stop(t0+dur+0.05);}catch(err){} }
var sfx={
  shoot:function(){tone(950,280,0.09,'sawtooth',0.07);},
  tap:function(){tone(800,500,0.05,'square',0.05);},
  apex:function(){tone(600,1600,0.25,'triangle',0.12); tone(300,900,0.25,'square',0.06);},
  waveCast:function(){tone(200,60,0.4,'sawtooth',0.16); tone(900,200,0.3,'square',0.08);},
  arrow:function(){tone(1200,500,0.06,'square',0.05);},
  fire:function(){tone(750,220,0.12,'sawtooth',0.07);},
  lanceCharge:function(){tone(140,700,0.5,'sawtooth',0.07); tone(90,400,0.5,'triangle',0.06);},
  lanceFire:function(){tone(1400,120,0.22,'sawtooth',0.14); tone(300,60,0.3,'square',0.1);},
  swordCast:function(){tone(1200,180,0.5,'triangle',0.11); tone(800,90,0.6,'sawtooth',0.05,0.05);},
  thunder:function(){tone(70,28,0.7,'sawtooth',0.16); tone(50,22,0.9,'square',0.1,0.05);},
  thud:function(){tone(55,30,0.3,'square',0.16); tone(40,25,0.4,'sawtooth',0.1,0.05);},
  swordHit:function(){tone(2200,300,0.08,'triangle',0.06);},
  stun:function(){tone(1800,600,0.12,'square',0.06);},
  counter:function(){tone(500,1400,0.16,'triangle',0.1); tone(900,300,0.2,'sawtooth',0.06,0.05);},
  jump:function(){tone(240,560,0.14,'square',0.09);},
  hurt:function(){tone(170,55,0.3,'sawtooth',0.15);},
  hit:function(){tone(520,180,0.07,'square',0.07);},
  whiff:function(){tone(500,900,0.06,'triangle',0.04);},
  kill:function(){tone(700,80,0.18,'square',0.11); tone(1500,220,0.14,'triangle',0.07,0.02);},
  summon:function(){tone(150,900,0.35,'triangle',0.11); tone(75,420,0.35,'square',0.05);},
  rise:function(){tone(60,140,0.7,'sawtooth',0.12); tone(45,90,0.8,'square',0.08,0.1);},
  clatter:function(){ for(var i=0;i<6;i++)tone(1400+i*120,900,0.03,'square',0.035,i*0.05); },
  clicks:function(){ for(var i=0;i<4;i++)tone(500+i*90,300,0.05,'square',0.05,i*0.14); },
  deny:function(){tone(140,90,0.15,'square',0.1);},
  wave:function(){tone(392,0,0.1,'square',0.09); tone(523,0,0.1,'square',0.09,0.12); tone(659,0,0.18,'square',0.09,0.24);},
  bossRoar:function(){tone(90,28,1.0,'sawtooth',0.2); tone(140,45,0.8,'square',0.12,0.1);},
  slam:function(){tone(120,38,0.25,'square',0.16);},
  bossSummon:function(){tone(600,1300,0.3,'triangle',0.09);},
  bossDie:function(){tone(200,25,0.9,'sawtooth',0.2); tone(900,60,0.7,'square',0.1,0.1);},
  lvlOpen:function(){tone(330,0,0.14,'triangle',0.1); tone(494,0,0.2,'triangle',0.1,0.14);},
  levelup:function(){tone(523,0,0.12,'square',0.1); tone(659,0,0.12,'square',0.1,0.12);
    tone(784,0,0.12,'square',0.1,0.24); tone(1046,0,0.3,'triangle',0.12,0.36);},
  spell:function(){tone(392,0,0.14,'triangle',0.1); tone(587,0,0.14,'triangle',0.1,0.14);
    tone(784,0,0.2,'triangle',0.1,0.28); tone(1174,0,0.4,'triangle',0.11,0.42);},
  death:function(){tone(300,40,0.8,'sawtooth',0.16); tone(150,30,0.9,'square',0.1,0.1);},
  pick:function(){tone(700,1200,0.07,'square',0.08);},
  coin:function(){tone(1300,1800,0.06,'square',0.07); tone(1600,2100,0.05,'square',0.05,0.05);},
  crush:function(){tone(200,60,0.15,'sawtooth',0.12);},
  absorb:function(){tone(400,900,0.2,'triangle',0.08);},
  buzz:function(){tone(150,190,0.12,'sawtooth',0.05); tone(140,180,0.12,'sawtooth',0.04,0.08);},
  boom:function(){tone(80,25,0.7,'sawtooth',0.22); tone(400,50,0.5,'square',0.12,0.05);},
  explo:function(){tone(240,40,0.35,'sawtooth',0.16); tone(900,120,0.25,'square',0.09,0.03);},
  charge:function(){tone(200,900,0.5,'triangle',0.1);},
  shield:function(){tone(300,700,0.2,'square',0.1); tone(500,1000,0.18,'triangle',0.08,0.08);},
  crows:function(){tone(900,600,0.08,'sawtooth',0.04); tone(1100,700,0.07,'sawtooth',0.03,0.09);},
  vendor:function(){tone(600,0,0.15,'triangle',0.1); tone(900,0,0.2,'triangle',0.08,0.12);}
};

