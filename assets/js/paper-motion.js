(() => {
  'use strict';
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const avatar=document.querySelector('#hero-avatar');
  const portrait=document.querySelector('.portrait-collage');
  const atlas=new Image();
  const records=[];
  let enabled=!preference.matches,ready=false,raf=0,lastStep=0;
  const clamp=value=>Math.max(0,Math.min(1,value));
  function showFrame(record,index){
    record.frame=index;
    record.sprite.style.setProperty('--frame-x',`${index%4*100/3}%`);
    record.sprite.style.setProperty('--frame-y',`${Math.floor(index/4)*100/3}%`);
    record.media.dataset.paperFrame=String(index);
    record.media.style.setProperty('--paper-text-y',`${(15-index)*.3}px`);
    record.media.style.setProperty('--paper-text-blur',`${(15-index)*.015}px`);
  }
  function focus(rect){
    const distance=Math.min(rect.height,innerHeight)*.7+innerHeight*.15;
    return Math.min(clamp((innerHeight*.96-rect.top)/distance),clamp((rect.bottom-innerHeight*.04)/distance));
  }
  function tick(time){
    raf=0;let unsettled=false;
    const advance=time-lastStep>=45;
    for(const record of records){
      if(record.media.closest('[hidden]'))continue;
      const rect=record.media.getBoundingClientRect();
      const target=enabled?Math.round(focus(rect)*15):15;
      record.media.dataset.paperTarget=String(target);
      if(record.frame!==target){
        unsettled=true;
        if(advance)showFrame(record,record.frame+Math.sign(target-record.frame));
      }
    }
    if(advance)lastStep=time;
    if(unsettled&&ready)raf=requestAnimationFrame(tick);
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(tick);}
  document.querySelectorAll('.project-media').forEach(media=>{
    const sprite=document.createElement('div');sprite.className='paper-sprite';sprite.setAttribute('aria-hidden','true');
    const record={media,sprite,frame:15};records.push(record);showFrame(record,15);
  });
  atlas.onload=()=>{
    // Build a display-only alpha mask; discard the atlas's colored, translucent shadow.
    // The source image remains unchanged. Brand color and neutral shadow are separate CSS layers.
    try{
      const mask=document.createElement('canvas');mask.width=atlas.naturalWidth;mask.height=atlas.naturalHeight;
      const ctx=mask.getContext('2d',{willReadFrequently:true});ctx.drawImage(atlas,0,0);
      const image=ctx.getImageData(0,0,mask.width,mask.height),pixels=image.data;
      for(let i=0;i<pixels.length;i+=4){const alpha=pixels[i+3];pixels[i]=pixels[i+1]=pixels[i+2]=255;pixels[i+3]=Math.max(0,Math.min(255,(alpha-224)*255/24));}
      ctx.putImageData(image,0,0);document.documentElement.style.setProperty('--paper-mask',`url("${mask.toDataURL()}")`);
      for(const record of records){record.media.prepend(record.sprite);record.media.classList.add('sprite-ready');}
      ready=true;schedule();
    }catch(error){console.warn('Paper texture unavailable; keeping the static artwork panels.');}
  };
  atlas.src='assets/images/paper/paper-unfold-atlas.png';
  function setMotion(value){
    enabled=value;document.body.classList.toggle('motion-disabled',!value);

    if(!value){for(const animation of document.getAnimations())animation.cancel();for(const record of records)showFrame(record,15);portrait.style.setProperty('--drift-x','0px');portrait.style.setProperty('--drift-y','0px');}
    schedule();
  }
  preference.addEventListener('change',event=>setMotion(!event.matches));
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('paper-layout',schedule);
  document.querySelectorAll('.experience-list details').forEach(detail=>detail.addEventListener('toggle',schedule));
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    portrait.addEventListener('pointermove',event=>{if(!enabled)return;const rect=portrait.getBoundingClientRect();portrait.style.setProperty('--drift-x',`${(event.clientX-rect.left-rect.width/2)*.018}px`);portrait.style.setProperty('--drift-y',`${(event.clientY-rect.top-rect.height/2)*.018}px`);});
    portrait.addEventListener('pointerleave',()=>{portrait.style.setProperty('--drift-x','0px');portrait.style.setProperty('--drift-y','0px');});
  }
  setMotion(enabled);
})();
