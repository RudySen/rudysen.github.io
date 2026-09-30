(() => {
  const video = document.querySelector('#demo-player');
  const section = document.querySelector('.reel-player');
  const sound = document.querySelector('#reel-sound');
  const pause = document.querySelector('#reel-pause');
  let focused = false, userPaused = false, wantsSound = true, soundBlocked = false, revision = 0;
  const active = () => focused && !document.hidden && !document.body.classList.contains('film-open') && !userPaused;
  function label() { sound.textContent = wantsSound && !soundBlocked && active() ? 'Mute sound' : 'Enable sound'; }
  async function sync() {
    const current = ++revision;
    if (!active()) { video.muted = true; video.pause(); label(); return; }
    if (!video.src) video.src = video.dataset.src;
    video.muted = !wantsSound || soundBlocked;
    label();
    try { await video.play(); }
    catch (error) {
      if (current !== revision || !active()) return;
      if (error.name === 'NotAllowedError' && !video.muted) {
        soundBlocked = true; video.muted = true; label();
        try { await video.play(); } catch { if (current === revision) pause.textContent = 'Play reel'; }
      } else if (error.name !== 'AbortError') pause.textContent = 'Play reel';
    }
    if (current === revision && !active()) { video.muted = true; video.pause(); }
  }
  new IntersectionObserver(([entry]) => {
    const next = entry.isIntersecting && entry.intersectionRatio >= (focused ? .35 : .55);
    if (next !== focused) {
      focused = next;
      if (focused && wantsSound) soundBlocked = false;
      sync();
    }
  }, {threshold:[0,.35,.55,1]}).observe(section);
  // Retry audible playback during a real gesture; never override a visitor's mute.
  function retrySound(event) {
    if (!event.isTrusted || event.target.closest?.('.reel-controls') || !wantsSound) return;
    if (event.type === 'keydown' && (event.repeat || event.ctrlKey || event.metaKey || event.altKey)) return;
    soundBlocked = false;
    if (active()) sync();
  }
  document.addEventListener('click', retrySound);
  document.addEventListener('keydown', retrySound);
  document.addEventListener('visibilitychange', sync);
  new MutationObserver(sync).observe(document.body, {attributes:true,attributeFilter:['class']});
  sound.addEventListener('click', () => {
    wantsSound = soundBlocked || !wantsSound || !active(); soundBlocked = false; sync();
  });
  pause.addEventListener('click', () => {
    userPaused = pause.textContent === 'Play reel' ? false : !userPaused;
    pause.textContent = userPaused ? 'Play reel' : 'Pause reel';
    pause.setAttribute('aria-pressed', String(userPaused)); sync();
  });
})();
