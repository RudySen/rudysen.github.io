(() => {
  // Resolve against the document, not the relocated CSS directory.
  document.querySelectorAll('.work-link .cover-fallback').forEach(image => {
    image.closest('.work-link').style.setProperty('--cover-image', `url("${image.src}")`);
  });
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-category]')];
  const status = document.querySelector('#filter-status');
  const results = document.querySelector('.work-results');
  const empty = results.querySelector('.work-empty');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = filters.find(button => button.getAttribute('aria-pressed') === 'true');
  let revision = 0;
  let animation;
  function render(button) {
    let count = 0;
    for (const project of projects) {
      project.hidden = project.dataset.category !== button.dataset.filter;
      if (!project.hidden) count++;
      project.classList.toggle("category-offset", !project.hidden && count % 2 === 0);
    }
    empty.hidden = count > 0;
    empty.textContent = count ? '' : `No ${button.dataset.filter === 'images' ? 'images' : 'other works'} added yet.`;
    status.textContent = `${button.textContent}: ${count} ${count === 1 ? 'project' : 'projects'} shown`;
    window.dispatchEvent(new Event('gallery-category'));
    window.dispatchEvent(new Event('paper-layout'));
  }
  async function select(button) {
    if (button === selected) return;
    const direction = filters.indexOf(button) > filters.indexOf(selected) ? 1 : -1;
    selected = button;
    const current = ++revision;
    animation?.cancel();
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    results.setAttribute('aria-busy', 'true');
    if (!reduced.matches) {
      animation = results.animate([
        {opacity:1, transform:'perspective(1200px) translate3d(0,0,0) rotateY(0deg)'},
        {opacity:0, transform:`perspective(1200px) translate3d(${-direction * 18}px,8px,-35px) rotateY(${-direction * 3}deg)`}
      ], {duration:160, easing:'ease-in', fill:'forwards'});
      await animation.finished.catch(() => {});
      if (current !== revision) return;
    }
    render(button);
    animation?.cancel();
    if (!reduced.matches) {
      animation = results.animate([
        {opacity:0, transform:`perspective(1200px) translate3d(${direction * 22}px,14px,-45px) rotateY(${direction * 4}deg)`},
        {opacity:1, transform:'perspective(1200px) translate3d(0,0,0) rotateY(0deg)'}
      ], {duration:320, easing:'cubic-bezier(.2,.75,.2,1)'});
      await animation.finished.catch(() => {});
      if (current !== revision) return;
    }
    results.setAttribute('aria-busy', 'false');
    window.dispatchEvent(new Event('paper-layout'));
  }
  filters.forEach(button => button.addEventListener('click', () => select(button)));
  reduced.addEventListener('change', () => {
    ++revision;
    animation?.cancel();
    render(selected);
    results.setAttribute('aria-busy', 'false');
  });
  render(selected);
})();

// Load one hosted player only after a visitor chooses a film.
(() => {
  const dialog = document.querySelector('.film-dialog');
  const stage = dialog.querySelector('.film-stage');
  const title = dialog.querySelector('#film-title');
  let opener;
  document.querySelectorAll('[data-embed]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      title.textContent = button.dataset.title;
      dialog.dataset.platform = button.dataset.platform;
      const player = document.createElement('iframe');
      player.title = `${button.dataset.title} video player`;
      player.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      player.allowFullscreen = true;
      player.referrerPolicy = 'strict-origin-when-cross-origin';
      player.src = button.dataset.embed;
      stage.replaceChildren(player);
      dialog.showModal();
      document.body.classList.add('film-open');
    });
  });
  dialog.querySelector('.film-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    stage.replaceChildren();
    document.body.classList.remove('film-open');
    opener?.focus({preventScroll:true});
  });
})();
