/* Angelic Black — M9 FX event vocabulary. */
const ANGELIC_FX_EVENTS={
  spellCharge(scene,x,y,power){scene.fx?.spellCharge(x,y,power);},
  spellRelease(scene,x,y,power,color=0x9d78ff){scene.fx?.impact(x,y,color,power);scene.fx?.cameraPunch(0.003+power*0.004,70+power*70);},
  hit(scene,x,y,power=1,color=0xf2e7ff){scene.fx?.impact(x,y,color,power);scene.fx?.hitStop(30+power*18);},
  death(scene,x,y,color=0x6d5a8f){scene.fx?.burst(x,y,color,18,140,2.4,0.55);scene.fx?.glow(x,y,22,color,0.25,240);},
  boss(scene,x,y){scene.fx?.bossEntrance(x,y);}
};
window.ANGELIC_FX_EVENTS=ANGELIC_FX_EVENTS;
