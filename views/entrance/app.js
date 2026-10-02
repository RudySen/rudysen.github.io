(() => {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const art = document.querySelector('.art');
 const tech = document.querySelector('.technical');
 const svg = document.querySelector('.connections');
 const scene=document.createElement('div');scene.className='tech-scene';tech.prepend(scene);scene.append(svg,...tech.querySelectorAll('.node'));
 const pairs = [['input','build-in'],['build-out','output'],['sampler-out','output']];
 const ns = 'http://www.w3.org/2000/svg';
 const paths = pairs.map(() => {
   const base = document.createElementNS(ns,'path'), pulse = document.createElementNS(ns,'path');
   base.classList.add('wire'); pulse.classList.add('pulse'); pulse.setAttribute('pathLength','100');
   pulse.style.animationDelay = `${-Math.random()*5}s`;
   svg.append(base,pulse); return [base,pulse];
 });
 function wires() {
   const r = scene.getBoundingClientRect();
   pairs.forEach(([a,b],i) => {
     const start = tech.querySelector(`[data-port="${a}"] i`).getBoundingClientRect();
     const end = tech.querySelector(`[data-port="${b}"] i`).getBoundingClientRect();
     const x1=start.left+start.width/2-r.left,y1=start.top+start.height/2-r.top;
     const x2=end.left+end.width/2-r.left,y2=end.top+end.height/2-r.top;
     const bend=Math.max(35,Math.abs(x2-x1)*.48);
     const d=`M${x1} ${y1} C${x1+bend} ${y1},${x2-bend} ${y2},${x2} ${y2}`;
     paths[i].forEach(path=>path.setAttribute('d',d));
   });
 }
 let scheduled=false;
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;wires();});}
 new ResizeObserver(schedule).observe(tech);
 document.fonts.ready.then(schedule);
 tech.addEventListener('animationend',schedule);
 let pointerFrame=0;
 art.addEventListener('pointermove',e=>{
   if(reduced.matches || e.pointerType!=='mouse')return;
   const r=art.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.018,y=(e.clientY-r.top-r.height/2)*.018;
   cancelAnimationFrame(pointerFrame);pointerFrame=requestAnimationFrame(()=>{art.style.setProperty('--mx',`${x}px`);art.style.setProperty('--my',`${y}px`);});
 });
 function resetArt(){cancelAnimationFrame(pointerFrame);art.style.setProperty('--mx','0px');art.style.setProperty('--my','0px');}
 art.addEventListener('pointerleave',resetArt);reduced.addEventListener('change',resetArt);
 let techFrame=0;
 tech.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const r=tech.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.018,y=(e.clientY-r.top-r.height/2)*.018;cancelAnimationFrame(techFrame);techFrame=requestAnimationFrame(()=>{scene.style.setProperty('--tx',x+'px');scene.style.setProperty('--ty',y+'px')})});
 function resetTech(){cancelAnimationFrame(techFrame);scene.style.setProperty('--tx','0px');scene.style.setProperty('--ty','0px')}
 tech.addEventListener('pointerleave',resetTech);reduced.addEventListener('change',resetTech);
 const dialog=document.querySelector('dialog');let opener;
 document.querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>{
   const world=button.dataset.choice;if(parent!==window)parent.postMessage({type:'portfolio-navigate',world},location.origin);else location.href='../../#'+world;
 }));
 document.querySelector('.return-button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
 document.addEventListener('visibilitychange',()=>document.body.classList.toggle('backgrounded',document.hidden));
 schedule();
})();
