(() => {
  const grid = document.querySelector('.project-grid');
  const all = [...grid.querySelectorAll('article')];
  const controls = document.createElement('div');
  controls.className = 'gallery-controls';
  controls.innerHTML = '<button class="gallery-arrow" type="button" aria-label="Previous work">←</button><div class="gallery-dots"></div><button class="gallery-arrow" type="button" aria-label="Next work">→</button>';
  const caption = document.createElement('p');
  caption.className = 'gallery-caption';
  caption.setAttribute('aria-live', 'polite');
  const strip = document.createElement('div');
  strip.className = 'gallery-strip';
  strip.setAttribute('role', 'group');
  strip.setAttribute('aria-label', 'Choose a video');
  grid.after(strip, controls, caption);
  const [previous, next] = controls.querySelectorAll('.gallery-arrow');
  const dots = controls.querySelector('.gallery-dots');
  let slides = [], index = 0, drag = null, suppressClick = false;
  const remembered = new Map();
  const category = () => document.querySelector('[data-filter][aria-pressed="true"]').dataset.filter;
  grid.setAttribute('role', 'region');
  grid.setAttribute('aria-roledescription', 'carousel');
  grid.setAttribute('aria-label', 'Selected works gallery');
  function paint(offset = 0) {
    const compact = innerWidth <= 700;
    slides.forEach((slide, i) => {
      const distance = i - index + offset;
      const amount = Math.min(Math.abs(distance), 3);
      slide.style.setProperty('--slide-x', `${distance * (compact ? 76 : 64)}%`);
      slide.style.setProperty('--slide-z', `${-amount * 220}px`);
      slide.style.setProperty('--slide-y', `${Math.max(-1, Math.min(1, distance)) * -12}deg`);
      slide.style.setProperty('--slide-r', `${Math.max(-1, Math.min(1, distance)) * 2}deg`);
      slide.style.setProperty('--slide-opacity', Math.abs(distance) > 2 ? '0' : String(1 - amount * .16));
      slide.style.setProperty('--slide-order', String(10 - Math.round(amount * 2)));
      slide.style.setProperty('--slide-events', Math.abs(distance) > 1.5 ? 'none' : 'auto');
      slide.classList.toggle('is-current', i === index);
      slide.querySelector('button').tabIndex = i === index ? 0 : -1;
      slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
      slide.setAttribute('aria-roledescription', 'slide');
    });
  }
  function go(value) {
    index = Math.max(0, Math.min(slides.length - 1, value));
    remembered.set(category(), index);
    paint();
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
    [...strip.children].forEach((thumb, i) => thumb.setAttribute('aria-current', String(i === index)));
    const activeThumb = strip.children[index];
    if (activeThumb) strip.scrollTo({left:activeThumb.offsetLeft - (strip.clientWidth-activeThumb.offsetWidth)/2, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    caption.textContent = slides.length ? `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')} — ${slides[index].querySelector('h3').textContent}` : '';
  }
  function reset() {
    drag = null;
    grid.classList.remove('is-dragging');
    slides = all.filter(slide => !slide.hidden);
    grid.hidden = controls.hidden = caption.hidden = strip.hidden = !slides.length;
    dots.replaceChildren();
    strip.replaceChildren();
    slides.forEach((slide, i) => {
      const dot = document.createElement('button');
      dot.type = 'button'; dot.className = 'gallery-dot';
      dot.setAttribute('aria-label', `Show ${slide.querySelector('h3').textContent}`);
      dot.addEventListener('click', () => go(i)); dots.append(dot);
      const thumb = document.createElement('button');
      thumb.type = 'button'; thumb.className = 'gallery-thumb';
      thumb.setAttribute('aria-label', `${i + 1}. ${slide.querySelector('h3').textContent}`);
      thumb.title = slide.querySelector('h3').textContent;
      const image = document.createElement('img');
      image.src = slide.querySelector('.cover-fallback').src;
      image.alt = ''; image.loading = 'lazy'; image.draggable = false;
      const number = document.createElement('span'); number.textContent = String(i + 1).padStart(2, '0');
      thumb.append(image, number);
      thumb.addEventListener('click', () => go(i));
      strip.append(thumb);
    });
    if (slides.length) go(remembered.get(category()) || 0);
  }
  previous.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  grid.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    go(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1));
    slides[index].querySelector('button').focus({preventScroll:true});
  });
  grid.addEventListener('dragstart', event => event.preventDefault());
  grid.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary) return;
    suppressClick = false;
    drag = {id:event.pointerId, x:event.clientX, y:event.clientY, dx:0, active:false};
  });
  grid.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.active && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { drag = null; return; }
    if (!drag.active && Math.abs(dx) > 10) {
      drag.active = true; grid.setPointerCapture(event.pointerId); grid.classList.add('is-dragging');
    }
    if (!drag.active) return;
    drag.dx = dx;
    const edge = (index === 0 && dx > 0) || (index === slides.length - 1 && dx < 0);
    // Match the pointer direction; index advancement moves the stack the same way.
    // Limit a drag to one slide so a long swipe cannot overshoot its release target.
    const offset = dx / grid.clientWidth * (edge ? .4 : 1.6);
    paint(Math.max(-1, Math.min(1, offset)));
  });
  function finish(event) {
    if (!drag || drag.id !== event.pointerId) return;
    const state = drag; drag = null; grid.classList.remove('is-dragging');
    if (state.active) {
      suppressClick = true;
      go(index + (event.type !== 'pointercancel' && Math.abs(state.dx) > 45 ? (state.dx < 0 ? 1 : -1) : 0));
    }
    if (grid.hasPointerCapture(event.pointerId)) grid.releasePointerCapture(event.pointerId);
  }
  grid.addEventListener('pointerup', finish);
  grid.addEventListener('pointercancel', finish);
  grid.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; return; }
    const slide = event.target.closest('article');
    if (slide && slides.indexOf(slide) !== index) {
      event.preventDefault(); event.stopImmediatePropagation(); go(slides.indexOf(slide));
    }
  }, true);
  addEventListener('gallery-category', reset);
  addEventListener('resize', () => paint());
  reset();
})();
