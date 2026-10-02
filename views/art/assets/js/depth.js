(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const intro = document.querySelector('.introduction');
  const portrait = document.querySelector('.portrait-collage');
  const sheet = portrait.querySelector('.avatar-sheet');
  const still = document.querySelector('#hero-avatar');
  const video = document.querySelector('#avatar-loop');
  const words = [...document.querySelectorAll('#hero-title > span')];
  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (a, b, p) => a + (b - a) * p;
  const ease = p => p * p * (3 - 2 * p);
  const panels = [...document.querySelectorAll('main > section:not(.introduction), main > footer')].map(panel => {
    const stage = document.createElement('div');
    stage.className = 'depth-stage';
    panel.before(stage);
    stage.append(panel);
    panel.classList.add('depth-panel');
    return {stage, panel, pose: 0};
  });
  // Keep a measurable home for the same character, rather than swapping clones.
  const home = document.createElement('div');
  home.className = 'avatar-home';
  home.setAttribute('aria-hidden', 'true');
  sheet.before(home);
  const traveler = document.createElement('div');
  traveler.className = 'travel-avatar';
  traveler.setAttribute('role', 'img');
  traveler.setAttribute('aria-label', 'Rudy’s animated paper collage character');
  document.body.append(traveler);
  traveler.append(sheet);
  let raf = 0, previousTime = 0, heroPose = 0;
  let playing = false;

  function syncVideo() {
    const allowed = !reduced.matches && !document.hidden && !document.body.classList.contains('film-open');
    if (allowed) {
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.muted = true;
      video.play().catch(() => { sheet.classList.remove('loop-playing'); });
    } else {
      video.pause();
      if (reduced.matches) sheet.classList.remove('loop-playing');
    }
  }
  video.addEventListener('playing', () => { playing = true; sheet.classList.add('loop-playing'); });
  video.addEventListener('error', () => {
    // Animated WebP preserves transparency where this video codec is unsupported.
    if (!reduced.matches) still.src = 'assets/images/brand/rudy-avatar-motion.webp';
    sheet.classList.remove('loop-playing');
  });
  function frame(time) {
    raf = 0;
    const dt = Math.min(64, time - (previousTime || time - 16));
    previousTime = time;
    const smoothing = 1 - Math.exp(-dt / 75);
    const h = innerHeight, y = scrollY;
    const viewportWidth = document.documentElement.clientWidth;
    const compact = viewportWidth <= 700;
    const strength = compact ? .55 : 1;
    const introRect = intro.getBoundingClientRect();
    const homeRect = home.getBoundingClientRect();
    // Read stable, untransformed wrappers before applying any visual poses.
    const bounds = panels.map(record => record.stage.getBoundingClientRect());
    const targetHero = reduced.matches ? 0 : clamp(y / Math.max(480, introRect.height * .82));
    heroPose = Math.abs(heroPose - targetHero) < .001 ? targetHero : mix(heroPose, targetHero, smoothing);
    let unsettled = Math.abs(heroPose - targetHero) > .001;
    const p = ease(heroPose);
    for (let i = 0; i < panels.length; i++) {
      const record = panels[i], rect = bounds[i];
      const entry = clamp((rect.top - h * .1) / (h * .86));
      const exit = clamp((h * .8 - rect.bottom) / (h * .85));
      const target = reduced.matches ? 0 : entry - exit;
      record.pose = Math.abs(record.pose - target) < .001 ? target : mix(record.pose, target, smoothing);
      unsettled ||= Math.abs(record.pose - target) > .001;
      const amount = Math.abs(record.pose);
      record.panel.style.transformOrigin = record.pose >= 0 ? '50% 0%' : '50% 100%';
      record.stage.style.perspectiveOrigin = `50% ${Math.max(0, Math.min(rect.height, h / 2 - rect.top))}px`;
      record.panel.style.setProperty('--depth-y', `${record.pose * 48 * strength}px`);
      record.panel.style.setProperty('--depth-z', `${-amount * 150 * strength}px`);
      record.panel.style.setProperty('--depth-angle', `${record.pose * -8 * strength}deg`);
      record.panel.style.setProperty('--depth-scale', String(1 - amount * .045));
      record.panel.style.setProperty('--depth-shadow', String(amount * .55));
      record.panel.style.setProperty('--depth-layer', `${record.pose * 24 * strength}px`);
      record.panel.dataset.depth = record.pose.toFixed(3);
      record.panel.classList.toggle('depth-active', rect.bottom > -200 && rect.top < h + 200);
    }
    words.forEach((word, index) => {
      const sign = index ? 1 : -1;
      word.style.transform = `perspective(1000px) translate3d(${sign * p * (compact ? 28 : 105)}px,${p * (index ? (compact ? 22 : 55) : -30)}px,${-p * 160}px) rotateY(${sign * p * 16}deg) rotateZ(${sign * p * 5}deg)`;
    });
    const travel = !reduced.matches ? p : 0;
    const sideSize = compact ? 28 : viewportWidth < 850 ? 52 : Math.max(76, Math.min(130, viewportWidth * .075));
    const pageProgress = clamp(y / Math.max(1, document.documentElement.scrollHeight - h));
    const size = mix(homeRect.width, sideSize, travel);
    const height = mix(homeRect.height, sideSize * homeRect.height / homeRect.width, travel);
    const x = mix(homeRect.left, viewportWidth - sideSize - (compact ? 2 : 10), travel);
    const top = mix(homeRect.top, mix(h * .18, h * .72, pageProgress), travel);
    traveler.style.width = `${homeRect.width}px`;
    traveler.style.height = `${homeRect.height}px`;
    traveler.style.transform = `translate3d(${x}px,${top}px,0) scale(${size / homeRect.width},${height / homeRect.height}) rotate(${mix(-5, 5, travel)}deg)`;
    traveler.style.visibility = homeRect.width > 0 ? 'visible' : 'hidden';
    sheet.style.backgroundColor = `rgba(249,246,238,${1-travel})`;
    traveler.dataset.travel = travel.toFixed(3);
    if (unsettled && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function schedule() { if (!raf && !document.hidden) raf = requestAnimationFrame(frame); }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  addEventListener('paper-layout', schedule);
  document.querySelectorAll('details').forEach(el => el.addEventListener('toggle', schedule));
  const observer = new ResizeObserver(schedule);
  observer.observe(document.querySelector('main'));
  reduced.addEventListener('change', () => {
    if (reduced.matches) still.src = 'assets/images/brand/rudy-avatar.png';
    else if (playing) sheet.classList.add('loop-playing');
    syncVideo(); schedule();
  });
  document.addEventListener('visibilitychange', () => { syncVideo(); schedule(); });
  new MutationObserver(syncVideo).observe(document.body, {attributes:true, attributeFilter:['class']});
  document.fonts.ready.then(schedule);
  syncVideo(); schedule();
})();
