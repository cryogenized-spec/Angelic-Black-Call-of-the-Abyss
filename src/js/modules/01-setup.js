/* ================= SETUP ================= */
var VW=540, VH=675, GROUND=520, WORLD_W=2880, CONTROL_BAND=112;
var GRAV=1700, SPEED=235, JUMPV=-620;
var COST_BOLT=4, COST_CHARGED=18, COST_HEAVY=25, COST_SWORD=75, COST_SUMMON=30, COST_SHIELD=20;
var CD_HEAVY=10, CD_SWORD=12, CD_SHIELD=8, CHARGE_FULL=2;
var UNLOCK_ARCHER=6;
var DMG={knight:12,zombie:16,cultist:10,mara:14,bat:8,boss:22};
var BETRAYER_NAME='MALACHAR';
var POSTER_URL='https://image.qwenlm.ai/public_source/de086523-4053-4904-8d82-f5f98bd17fc5/17b3a2716-3a9a-4378-a7e6-c0c96c790f9a.png';
var FALLBACK_ART='https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/10eee16c8-655b-4de8-8f1e-fc20a1fd1b65.png';
var DIALOG_PORTRAIT='https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/1d0b99532-5f70-4b0c-9051-470829925ba4.png';
var AFTERMATH_IMG='https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/1e2a1af09-cd1f-45d7-a291-0d4968b7a769.png';
var ROAD_IMG='https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/1d64c7178-2af1-4290-96d0-fd1590383921.png';
var WITCH_IMG='https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/1eea866bc-1b52-4c9a-8139-0e45dc6f0120.png';
var PRESTAGE_IMG='https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/1009eb9f7-ef7e-4612-b94b-4784ebb3e49f.png';
var NAMEA_IMG='https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/1bf565950-ec6d-492e-929d-80c7ba5d8ffd.png';
var NAMEB_IMG='https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/18c037a34-868e-4516-a67d-361ced2358d5.png';
var MARA_IMG='https://image.qwenlm.ai/public_source/f0dc4df4-8c19-40e3-bdeb-18ea11c36b32/188555799-7a0f-4bc8-8139-a548adc348cf.png';
var NOBLE_IMG='https://image.qwenlm.ai/public_source/f0dc4df4-8c19-40e3-bdeb-18ea11c36b32/1b6c13222-1a14-4b72-a287-d4eca982ee4c.png';
var RIDGE_IMG='https://image.qwenlm.ai/public_source/f0dc4df4-8c19-40e3-bdeb-18ea11c36b32/1c5256706-8ed6-431e-9bc5-f17c014bca7f.png';
var COMIC_PAGES=[
 'https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/1ebb3ab8a-8c06-4fe2-8e29-fa6fb026db0f.png',
 'https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/1b69e72c3-ffa5-4195-a0de-0df87980d79f.png',
 'https://image.qwenlm.ai/public_source/6d91cf12-514b-4a8a-a18d-18b6062acf4c/15da3b137-4038-45db-b5bf-3eae0e1faa48.png',
 PRESTAGE_IMG];
var COMIC_CAPTIONS=[
 {top:'Before the kingdoms learned to fear the dead, there was a Queen whose name was struck from every record.',
  bottom:'Her own court betrayed her. The paladins of the corrupted order sealed her beneath the First Tomb.'},
 {top:'Centuries passed. Roots and rust ate the seals.',
  bottom:'Darkness gathered where honour was broken — and the seal grew thin.'},
 {top:'On the night the moon turned away, the seal broke.',
  bottom:'She rose. And the dead remembered their Queen.'},
 {top:'', bottom:'THE FIRST TOMB — graveyard of the Quiet Court.'}];
var LORE=[
 'Before the kingdoms learned to fear the dead, there was a queen whose name was struck from every record.',
 'Her kingdom fell. Her enemies buried her. They forgot that the dead remember.',
 'The grave was meant to be a prison. It became a court.',
 'When the moon tires of watching, she will finish reading what was written in bone.' ];
var stageEl=document.getElementById('stage');
var cvs=document.getElementById('gameCanvas');
var ctx=cvs.getContext('2d');
cvs.width=VW; cvs.height=VH; ctx.imageSmoothingEnabled=false;
function fitStage(){var sc=Math.min(window.innerWidth/VW, window.innerHeight/VH);
  stageEl.style.width=(VW*sc)+'px'; stageEl.style.height=(VH*sc)+'px';}
window.addEventListener('resize',fitStage); fitStage();
var isTouch=('ontouchstart' in window)||navigator.maxTouchPoints>0;
if(isTouch)document.body.classList.add('touch');

(function(){
  var gc=document.createElement('canvas'); gc.width=64; gc.height=64;
  var gx=gc.getContext('2d'); var id=gx.createImageData(64,64);
  for(var i=0;i<id.data.length;i+=4){ var v=(Math.random()*255)|0;
    id.data[i]=v; id.data[i+1]=v; id.data[i+2]=v; id.data[i+3]=26; }
  gx.putImageData(id,0,0);
  document.getElementById('grain').style.backgroundImage='url('+gc.toDataURL()+')';
})();

