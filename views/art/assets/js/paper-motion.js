(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = document.querySelector('.portrait-collage');
  function update() {
    document.body.classList.toggle('motion-disabled', preference.matches);
    portrait.style.setProperty('--drift-x','0px');
    portrait.style.setProperty('--drift-y','0px');
  }
  preference.addEventListener('change', update);
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    portrait.addEventListener('pointermove', event => {
      if (preference.matches) return;
      const rect = portrait.getBoundingClientRect();
      portrait.style.setProperty('--drift-x', `${(event.clientX-rect.left-rect.width/2)*.018}px`);
      portrait.style.setProperty('--drift-y', `${(event.clientY-rect.top-rect.height/2)*.018}px`);
    });
    portrait.addEventListener('pointerleave', update);
  }
  update();
})();
