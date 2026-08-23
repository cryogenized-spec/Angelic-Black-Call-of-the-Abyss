/* Angelic Black — Phaser 4 loader. */
(function(){
  'use strict';
  const BUILD='20260823-m34';
  const SOURCES=['https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.min.js','https://cdnjs.cloudflare.com/ajax/libs/phaser/4.2.1/phaser.min.js'];
  const scriptSources=['./js/config.js','./js/player/QueenAssetCatalog.js','./js/player/NecroQueen.js','./js/world/FirstTombWorld.js','./js/fx/FXEngine.js','./js/fx/FXEvents.js','./js/combat/EnemyRoster.js','./js/combat/PickupSystem.js','./js/combat/SpellSystem.js','./js/combat/CombatSystem.js','./js/narrative/NarrativeDirector.js','./js/narrative/PreludeRetainers.js','./js/combat/SkeletonSummonSystem.js','./js/combat/WaveSystem.js','./js/progression/ProgressionSystem.js','./js/debug/RuntimeAudit.js','./js/input/TouchControls.js','./js/ui/Level1Menu.js','./js/scenes/BootScene.js','./js/scenes/TitleScene.js','./js/scenes/GameScene.js'];
  const status=document.getElementById('engine-status');
  function showError(title,detail){if(!status)return;status.innerHTML=`<strong>${title}</strong><br><small>${detail}</small>`;status.style.display='block';}
  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      const url=src+(src.includes('?')?'&':'?')+'v='+BUILD;
      s.src=url;
      s.async=false;
      let settled=false;
      const cleanup=()=>window.removeEventListener('error',onError,true);
      const fail=err=>{if(settled)return;settled=true;cleanup();reject(err);};
      const onError=event=>{
        const filename=event.filename||'';
        if(filename===url||filename.endsWith(src)){
          fail(new Error(`${event.message||'JavaScript error'} (${src}${event.lineno?`:${event.lineno}:${event.colno||0}`:''})`));
        }
      };
      window.addEventListener('error',onError,true);
      s.onload=()=>{if(settled)return;settled=true;cleanup();resolve();};
      s.onerror=()=>fail(new Error('Failed to load '+src));
      document.body.appendChild(s);
    });
  }
  async function boot(){
    let loaded=false;
    for(const src of SOURCES){try{await loadScript(src);if(window.Phaser){loaded=true;break;}}catch(err){console.warn(err);}}
    if(!loaded){showError('ENGINE LOAD FAILED','Phaser 4.2.1 could not be loaded. Check your connection and reload.');return;}
    try{
      for(const src of scriptSources)await loadScript(src);
      if(typeof window.TitleScene!=='function')throw new Error('TitleScene failed to register before game bootstrap.');
      if(typeof window.GameScene!=='function')throw new Error('GameScene failed to register before game bootstrap.');
      await loadScript('./js/main.js');
    }catch(err){console.error(err);showError('GAME SCRIPT FAILED',err.message||String(err));return;}
    if(!window.ANGELIC_PHASER_GAME&&!window.ANGELIC_BOOT_READY)showError('GAME BOOT FAILED','Phaser loaded, but the game did not start.');
  }
  window.addEventListener('error',event=>{if(event.error)console.error(event.error);if(event.message&&!window.ANGELIC_BOOT_READY)showError('STARTUP ERROR',event.message);});
  window.addEventListener('unhandledrejection',event=>{console.error(event.reason);if(!window.ANGELIC_BOOT_READY)showError('STARTUP ERROR',String(event.reason?.message||event.reason));});
  boot();
})();
