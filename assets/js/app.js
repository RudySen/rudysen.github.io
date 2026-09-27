(() => {
  // Resolve against the document, not the relocated CSS directory.
  document.querySelectorAll('.work-link .cover-fallback').forEach(image => {
    image.closest('.work-link').style.setProperty('--cover-image', `url("${image.src}")`);
  });
  const filters = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('[data-category]');
  const status = document.querySelector('#filter-status');
  for (const button of filters) {
    button.addEventListener('click', () => {
      for (const filter of filters) filter.setAttribute('aria-pressed', String(filter === button));
      let count = 0;
      for (const project of projects) {
        project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
        if (!project.hidden) count++;
      }
      status.textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown`;
      window.dispatchEvent(new Event('paper-layout'));
    });
  }
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
