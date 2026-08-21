/* ================= CINEMATIC ART INTEGRATION ================= */
(function(root){
  var base='assets/art/';
  var ART={
    cover:base+'cover/cover-main.png',
    comic:[
      base+'comic/comic-01-tomb-sealed.png',
      base+'comic/comic-02-seal-decays.png',
      base+'comic/comic-03-queen-awakens.png',
      base+'comic/comic-04-first-tomb.png'
    ],
    oldGuard:base+'scenes/cutscene-01-rise-of-the-old-guard.png',
    malachar:base+'scenes/cutscene-02-malachar.png',
    malacharFalls:base+'scenes/cutscene-03-malachar-falls.png',
    aftermath:base+'scenes/cutscene-04-first-tomb-aftermath.png',
    witch:base+'scenes/cutscene-05-the-veiled-purveyor.png'
  };

  var LEGACY={
    cover:POSTER_URL,
    comic:COMIC_PAGES.slice(),
    malachar:'https://image.qwenlm.ai/public_source/de086523-4053-4904-8d82-f5f98bd17fc5/1061cc221-1c1e-4ad5-9ac2-8629b9f9dd3e.png',
    aftermath:AFTERMATH_IMG,
    witch:WITCH_IMG
  };

  root.__ANGELIC_BLACK_ART__=ART;

  function localImage(path,legacy,onReady){
    var img=new Image();
    var settled=false;
    img.onload=function(){
      if(settled)return;
      settled=true;
      if(onReady)onReady(img);
    };
    img.onerror=function(){settled=true;};
    img.src=path;
    if(legacy){
      var probe=new Image();
      probe.onload=function(){if(!settled&&onReady)onReady(null);};
      probe.onerror=function(){};
      probe.src=legacy;
    }
    return img;
  }

  /* Main title art: retain legacy art until the authored PNG exists. */
  coverArtEl.style.backgroundImage="url('"+LEGACY.cover+"')";
  localImage(ART.cover,LEGACY.cover,function(img){
    if(img)coverArtEl.style.backgroundImage="url('"+ART.cover+"')";
  });

  /* Comic pages: authored local page wins once present; legacy remains seamless meanwhile. */
  var comicLocal=[];
  for(var i=0;i<ART.comic.length;i++){
    (function(index){
      comicLocal[index]=new Image();
      comicLocal[index].onload=function(){
        if(typeof comicIdx==='number'&&comicIdx===index&&comicImg)comicImg.src=ART.comic[index];
      };
      comicLocal[index].onerror=function(){};
      comicLocal[index].src=ART.comic[index];
    })(i);
  }
  if(typeof root.setComicPage==='function'){
    var originalSetComicPage=root.setComicPage;
    root.setComicPage=function(i){
      originalSetComicPage(i);
      if(comicLocal[i]&&comicLocal[i].complete&&comicLocal[i].naturalWidth>0)comicImg.src=ART.comic[i];
    };
  }

  function useLocalImage(target,local,legacy){
    if(!target)return;
    var original=target.src||legacy;
    target.src=original;
    var img=new Image();
    img.onload=function(){target.src=local;};
    img.onerror=function(){target.src=original;};
    img.src=local;
  }

  /* Existing cutscene image objects are created by module 10 before this module runs. */
  useLocalImage(typeof bossImg!=='undefined'?bossImg:null,ART.malachar,LEGACY.malachar);
  useLocalImage(typeof aftermathImg!=='undefined'?aftermathImg:null,ART.aftermath,LEGACY.aftermath);
  useLocalImage(typeof witchImg!=='undefined'?witchImg:null,ART.witch,LEGACY.witch);

  var authoredReady={oldGuard:false,malacharFalls:false};
  var oldGuardImg=new Image();
  oldGuardImg.onload=function(){authoredReady.oldGuard=true;};
  oldGuardImg.src=ART.oldGuard;
  var malacharFallsImg=new Image();
  malacharFallsImg.onload=function(){authoredReady.mal acharFalls=true;};
  malacharFallsImg.src=ART.mal acharFalls;
  root.__ANGELIC_BLACK_CUTSCENE_ART__={oldGuard:oldGuardImg,malacharFalls:malacharFallsImg,ready:authoredReady};

  function originalIntro(){
    if(typeof root.__AB_ORIGINAL_INTRO_RISE_CS__==='function')root.__AB_ORIGINAL_INTRO_RISE_CS__();
  }
  if(typeof root.introRiseCS==='function'){
    root.__AB_ORIGINAL_INTRO_RISE_CS__=root.introRiseCS;
    root.introRiseCS=function(){
      if(!authoredReady.oldGuard){originalIntro();return;}
      playCS([
        {k:'still',v:1,img:oldGuardImg},
        {k:'wait',d:0.55},
        {k:'say',who:'THE NECRO QUEEN',text:'Rise.'},
        {k:'fn',run:function(){
          shakeT=0.3; sfx.slam(); sfx.rise();
          minions.push(makeRetinue('nameA',player.x-46));
          minions.push(makeRetinue('nameB',player.x+46));
          dirtBurst(player.x-46); dirtBurst(player.x+46);
        }},
        {k:'wait',d:1.5},
        {k:'say',who:'NAME A',text:'[Teeth clatter in a rapid, deliberate rhythm. Its skull turns toward the distant ruins, one bony hand tightening around its rusted scimitar.]'},
        {k:'say',who:'THE NECRO QUEEN',text:'I know.'},
        {k:'say',who:'NAME B',text:'[A slower sequence of bone clicks follows. The skeleton raises its rusted scimitar slightly and watches the forest beyond the graveyard.]'},
        {k:'say',who:'THE NECRO QUEEN',text:'Yes. Watch the trees.'},
        {k:'still',v:0},
        {k:'end',run:function(){ beginWave(1); }}
      ]);
    };
  }

  if(typeof root.bossIntroCS==='function'){
    root.__AB_ORIGINAL_BOSS_INTRO_CS__=root.bossIntroCS;
    root.bossIntroCS=function(){
      if(typeof bossImg==='undefined'||!bossImg.complete||bossImg.naturalWidth===0){root.__AB_ORIGINAL_BOSS_INTRO_CS__();return;}
      playCS([
        {k:'still',v:1,img:bossImg},
        {k:'shake',amp:0.35,d:0.45},
        {k:'say',who:'THE NECRO QUEEN',text:'...You remain.'},
        {k:'still',v:0}
      ]);
    };
  }

  if(typeof root.bossDefeatCS==='function'){
    root.__AB_ORIGINAL_BOSS_DEFEAT_CS__=root.bossDefeatCS;
    root.bossDefeatCS=function(f){
      if(!authoredReady.mal acharFalls){root.__AB_ORIGINAL_BOSS_DEFEAT_CS__(f);return;}
      playCS([
        {k:'still',v:1,img:bossImg},{k:'wait',d:0.4},
        {k:'say',who:'THE NECRO QUEEN',text:'And now...'},
        {k:'say',who:'THE NECRO QUEEN',text:BETRAYER_NAME+'...'},
        {k:'say',who:'THE NECRO QUEEN',text:'...you will pay for your betrayal.'},
        {k:'still',v:0},
        {k:'fn',run:function(){ player.castFx=0.5; }},
        {k:'say',who:'THE NECRO QUEEN',text:'CORPSE BOMB!'},
        {k:'fn',run:function(){ corpseBomb(f); }},
        {k:'shake',amp:0.6,d:0.5},
        {k:'wait',d:1.6},
        {k:'fn',run:function(){ inv.signet=1; }},
        {k:'say',who:'THE NECRO QUEEN',text:'...My seal.'},
        {k:'black',d:0.7},
        {k:'still',v:1,img:malacharFallsImg},
        {k:'unblack',d:0.9},
        {k:'wait',d:0.6},
        {k:'say',who:'THE NECRO QUEEN',text:'So ends the first of those who betrayed me.'},
        {k:'say',who:'THE NECRO QUEEN',text:'It cost more than it should have. My strength is still incomplete.'},
        {k:'say',who:'THE NECRO QUEEN',text:'But the dead now know their Queen walks again. Rise, my guards — we move.'},
        {k:'black',d:0.8},
        {k:'still',v:1,img:roadImg},
        {k:'unblack',d:0.9},
        {k:'wait',d:1.4},
        {k:'crows',mode:'in',d:2.4},
        {k:'black',d:0.3},
        {k:'still',v:1,img:witchImg},
        {k:'unblack',d:0.5},
        {k:'say',who:'THE WITCH',text:'Your Majesty... the grave suits you, and yet you leave it.'},
        {k:'say',who:'THE NECRO QUEEN',text:'You know me, witch.'},
        {k:'say',who:'THE WITCH',text:'I know what you will need before the second tomb. Browse, then. The crows grow restless.'},
        {k:'end',run:function(){ openVendor(); }}
      ]);
    };
  }
})(window);
