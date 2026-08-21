/* ================= GAMEPLAY INTEGRITY ================= */
(function(root){
  var engine=root.__ANGELIC_BLACK_ENGINE__;
  if(!engine)return;
  var integrity={version:'pass-6',checks:0,failures:0,lastCheck:0,warningCount:0};

  function finite(v){return typeof v==='number'&&isFinite(v);}
  function nonNegative(v){return finite(v)&&v>=0;}
  function fail(message){
    integrity.failures++;
    if(typeof console!=='undefined'&&console.error)console.error('[AB Integrity]',message);
    if(root.__ANGELIC_BLACK_RUNTIME__&&typeof root.__ANGELIC_BLACK_RUNTIME__.reportFatal==='function'){
      root.__ANGELIC_BLACK_RUNTIME__.reportFatal(new Error('Gameplay integrity failure: '+message));
    }
    return false;
  }
  function warn(message){
    integrity.warningCount++;
    if(typeof console!=='undefined'&&console.warn)console.warn('[AB Integrity]',message);
  }
  function arrayOfObjects(name,value){
    if(!Array.isArray(value))return fail(name+' is not an array.');
    for(var i=0;i<value.length;i++){
      if(value[i]===null||typeof value[i]!=='object')return fail(name+'['+i+'] is not an object.');
    }
    return true;
  }
  function validateWaveTable(){
    if(!Array.isArray(root.STAGE1_WAVES)||root.STAGE1_WAVES.length===0)return fail('STAGE1_WAVES is missing or empty.');
    for(var i=0;i<root.STAGE1_WAVES.length;i++){
      var w=root.STAGE1_WAVES[i];
      if(!w||typeof w!=='object')return fail('Wave '+(i+1)+' is not an object.');
      if(!nonNegative(w.count)||!finite(w.interval)||w.interval<=0)return fail('Wave '+(i+1)+' has invalid count/interval.');
      if(!Array.isArray(w.comp))return fail('Wave '+(i+1)+' has no valid composition.');
      var sum=0;
      for(var j=0;j<w.comp.length;j++){
        var c=w.comp[j];
        if(!Array.isArray(c)||typeof c[0]!=='string'||!nonNegative(c[1]))return fail('Wave '+(i+1)+' has invalid composition entry.');
        sum+=c[1];
      }
      if(w.boss!==true&&Math.abs(sum-1)>0.001)return fail('Wave '+(i+1)+' composition weights sum to '+sum.toFixed(3)+'.');
    }
    return true;
  }
  function validatePlayer(){
    var p=root.player;
    if(!p)return true;
    var numeric=['x','y','vx','vy','hp','maxHp','armor','shield','mana','maxMana','manaRegen','level','xp','xpNeed'];
    for(var i=0;i<numeric.length;i++)if(!finite(p[numeric[i]]))return fail('Player '+numeric[i]+' is invalid.');
    if(p.maxHp<1||p.maxMana<1)return fail('Player maximum resources became invalid.');
    if(p.hp<-0.001||p.hp>p.maxHp+0.001)return fail('Player HP escaped expected bounds.');
    if(p.mana<-0.001||p.mana>p.maxMana+0.001)return fail('Player Mana escaped expected bounds.');
    if(p.x< -0.001 || p.x>root.WORLD_W+0.001)return fail('Player X escaped world bounds.');
    return true;
  }
  function validateInventory(){
    if(typeof root.inv==='undefined'||root.inv===null)return true;
    var keys=['heart','shard','tincture','page','grief','signet','jester','pewter'];
    for(var i=0;i<keys.length;i++)if(!nonNegative(root.inv[keys[i]]))return fail('Inventory '+keys[i]+' became invalid.');
    if(!nonNegative(root.gold))return fail('Gold became negative or invalid.');
    return true;
  }
  function validateSpells(){
    if(typeof root.spells==='undefined')return true;
    if(!root.spells||typeof root.spells!=='object')return fail('Spell state is invalid.');
    if(!Array.isArray(root.hotkeys)||root.hotkeys.length!==6)return fail('Hotkey state must contain six slots.');
    for(var i=0;i<root.hotkeys.length;i++){
      var spell=root.hotkeys[i];
      if(spell!==null&&spell!==undefined&&(!root.spells[spell]||root.intentionalNone&&root.intentionalNone[i])){
        if(root.intentionalNone&&root.intentionalNone[i])continue;
        warn('Hotkey '+i+' references unavailable spell '+spell+'.');
      }
    }
    return true;
  }
  function validateRuntimeCollections(){
    var names=['foes','minions','bolts','ebolts','arrows','parts','floaters','rings','swordRain','pickups','debris'];
    for(var i=0;i<names.length;i++)if(!arrayOfObjects(names[i],root[names[i]]))return false;
    if(!finite(root.waveNum)||root.waveNum<0)return fail('waveNum became invalid.');
    if(!finite(root.stageNum)||root.stageNum<1)return fail('stageNum became invalid.');
    if(!finite(root.spawnQueue)||root.spawnQueue<0)return fail('spawnQueue became invalid.');
    if(!finite(root.score)||root.score<0)return fail('score became invalid.');
    return true;
  }
  integrity.validate=function(){
    integrity.checks++;
    return validateWaveTable()&&validatePlayer()&&validateInventory()&&validateSpells()&&validateRuntimeCollections();
  };
  integrity.tick=function(){
    var now=performance.now();
    if(now-integrity.lastCheck<1000)return;
    integrity.lastCheck=now;
    integrity.validate();
  };
  root.__ANGELIC_BLACK_GAMEPLAY_INTEGRITY__=integrity;
})(window);
