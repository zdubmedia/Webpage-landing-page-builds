/* Speedy PawZ: "How it works" scene.
   Plays by itself once the section is on screen (no scrolling needed), one short film per step:

     Lap 1        1-van      the van drives in from the side of the page, the door slides open, the camera pushes in
     Lap 2        2-warmup   Emelyn clips the harness on, love pats, a treat
     Lap 3        3-trot     happy slow-motion trot on the slat mill, tongue flapping
     Pit stop     4-mill     the slat mill comes apart and goes back together (label chips pop in)
     Finish line  5-nap      pup hops out, curls up on the bed, falls asleep (phone pops up with the photo update)

   Then it loops. It pauses when the section leaves the screen. The dots jump to a step, the round button pauses.

   "Seamless" films sit on a flat background color and the page behind them is painted the same color,
   so the van reads as part of the page, not a video in a box. "Tile" films sit as rounded cards.

   Films live in assets/scene/film (name.mp4 for desktop, name-m.mp4 for phones). To swap one, see assets/scene/README.md.
   Reduced motion, no JS or no video support: the real van photo + five step cards stay as they are in the HTML.
   If the phone refuses to autoplay (iPhone Low Power Mode does), the real van photo shows with a "Tap to play" button. */
(function () {
  'use strict';
  var SPZ = window.SPZ || {};
  var html = document.documentElement;
  var scene = document.getElementById('vanScene');
  if (!scene || SPZ.reduced) return;
  var probe = document.createElement('video');
  if (!probe.play || !probe.canPlayType || !probe.canPlayType('video/mp4; codecs="avc1.640028"')) return;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pin = $('.scene__pin', scene), stage = $('.scene__stage', scene), holder = $('.scene__films', scene);
  var beats = $$('.beat', scene), pips = $$('.scene__pips button', scene), tags = $$('.scene__tags li', scene);
  var toggle = $('.scene__toggle', scene), playBtn = $('.scene__play', scene), phoneLayer = $('.scene__phone', scene);
  if (!holder || !pips.length || !toggle) return;
  html.classList.add('scene-on');

  var small = window.matchMedia('(orientation: portrait), (max-width: 759px)').matches;
  var BASE = 'assets/scene/film/';
  var GOLD = '#F7B334', MIDNIGHT = '#1F1B30';

  /* ---- The films, in order ----
     file   name in assets/scene/film            phone   true if there is a smaller name-m.mp4 for phones
     beat   which step card it belongs to        look    seamless | seamless corner (smaller, bottom right on desktop) | tile | tile tall (upright clip, beside the text on desktop)
     top, bot  page color behind the film        fx      seamless on phones: which part of the frame stays centered (0 left, 1 right) */
  var FILMS = [
    { file: '1-van', phone: true, beat: 0, look: 'seamless corner', top: GOLD, bot: GOLD, fx: 0.58 },
    { file: '2-warmup', beat: 1, look: 'tile tall', top: MIDNIGHT, bot: MIDNIGHT },
    { file: '3-trot', phone: true, beat: 2, look: 'tile', top: MIDNIGHT, bot: MIDNIGHT },
    { file: '4-mill', phone: true, beat: 3, look: 'seamless', top: '#141B2C', bot: '#3A4660', tags: true },
    { file: '5-nap', phone: true, beat: 4, look: 'tile', top: GOLD, bot: GOLD, photoUpdate: true, hold: 2800 }
  ];
  var built = false, idx = 0, shown = -1, started = false;
  var inView = false, userPaused = false, holding = false, holdTimer = 0, blocked = false, failed = 0;

  function build() {
    if (built) return; built = true;
    FILMS.forEach(function (f, i) {
      var v = document.createElement('video');
      v.muted = true; v.defaultMuted = true; v.playsInline = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
      v.setAttribute('disableremoteplayback', ''); v.disablePictureInPicture = true;
      v.preload = 'none'; v.tabIndex = -1;
      v.className = 'film film--' + f.look.split(' ').join(' film--');
      if (f.fx != null) v.style.setProperty('--fx', f.fx);
      v.src = BASE + f.file + (small && f.phone ? '-m' : '') + '.mp4';
      v.addEventListener('playing', function () { if (i === idx) reveal(i); });
      v.addEventListener('ended', function () { if (i === idx) finished(); });
      v.addEventListener('error', function () { if (i === idx) broken(); });
      holder.appendChild(v);
      f.el = v;
    });
    fetchFilm(0);
  }
  function fetchFilm(i) {
    var f = FILMS[i];
    if (!f || !f.el || f.asked) return;
    f.asked = true; f.el.preload = 'auto'; f.el.load();
  }

  /* ---- What is on screen: film, page color, step card, dots ---- */
  function reveal(i) {
    var f = FILMS[i];
    failed = 0;
    if (shown === i) return;
    shown = i;
    FILMS.forEach(function (g, k) { g.el.classList.toggle('is-on', k === i); });
    stage.classList.toggle('is-tile', f.look.indexOf('tile') > -1);
    stage.classList.toggle('is-tall', f.look.indexOf('tall') > -1);
    pin.style.setProperty('--edge-top', f.top);
    pin.style.setProperty('--edge-bot', f.bot);
    beats.forEach(function (b, k) { b.classList.toggle('is-active', k === f.beat); });
    pips.forEach(function (p, k) {
      p.classList.toggle('is-on', k === f.beat);
      if (k !== f.beat) p.style.setProperty('--p', 0);
      if (k === f.beat) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current');
    });
    if (!f.tags) tags.forEach(function (el) { el.classList.remove('is-on'); });
    if (!f.photoUpdate) hidePhone();
  }

  /* ---- Playing ---- */
  function start(i) {
    clearTimeout(holdTimer); holding = false;
    idx = i;
    FILMS.forEach(function (f, k) { if (k !== i && !f.el.paused) f.el.pause(); });
    fetchFilm(i);
    try { FILMS[i].el.currentTime = 0; } catch (e) { /* not loaded yet: it starts at 0 anyway */ }
    phoneUp = false;
    go();
  }
  function go() {
    if (!built || !inView || userPaused || holding) return;
    var p = FILMS[idx].el.play();
    if (p && p.then) {
      p.then(function () { setBlocked(false); fetchFilm((idx + 1) % FILMS.length); },
             function (err) { if (err && err.name === 'NotAllowedError') setBlocked(true); });
    }
    loop();
  }
  function halt() { FILMS.forEach(function (f) { if (f.el && !f.el.paused) f.el.pause(); }); }
  function finished() {
    var f = FILMS[idx];
    pips[f.beat].style.setProperty('--p', 1);
    if (f.hold) { holding = true; holdTimer = setTimeout(function () { holding = false; start(0); }, f.hold); }
    else start((idx + 1) % FILMS.length);
  }
  // A film that will not load: skip it. If none of them load, fall back to the photo and the five cards.
  function broken() {
    if (++failed >= FILMS.length) { halt(); html.classList.remove('scene-on', 'scene-active'); return; }
    start((idx + 1) % FILMS.length);
  }

  var raf = 0;
  function loop() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick() {
    raf = 0;
    var f = FILMS[idx], v = f.el, d = v.duration || 0, t = d ? Math.min(1, v.currentTime / d) : 0;
    if (shown === idx) {
      pips[f.beat].style.setProperty('--p', t.toFixed(3));
      if (f.tags) tags.forEach(function (el, k) { el.classList.toggle('is-on', t > 0.26 + k * 0.07 && t < 0.8); });
      if (f.photoUpdate && d && v.currentTime > d - 2.3 && !phoneUp) showPhone();
    }
    if (!v.paused && !v.ended) raf = requestAnimationFrame(tick);
  }

  /* ---- Finish line: the phone with the photo update ---- */
  var gsap = window.gsap, phoneTl = null, phoneUp = false;
  if (gsap && phoneLayer) {
    var phone = $('#phoneMock'), notif = $('#notif');
    gsap.set(phoneLayer, { autoAlpha: 0 });
    gsap.set(phone, { y: -460 });
    gsap.set(notif, { scale: 0.7, transformOrigin: '50% 0%', opacity: 0 });
    phoneTl = gsap.timeline({ paused: true })
      .to(phone, { y: 0, duration: 0.75, ease: 'back.out(1.2)' }, 0)
      .to(notif, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' }, 0.6);
  }
  function showPhone() { phoneUp = true; if (phoneTl) { gsap.set(phoneLayer, { autoAlpha: 1 }); phoneTl.restart(); } }
  function hidePhone() { if (phoneTl) { phoneTl.pause(0); gsap.set(phoneLayer, { autoAlpha: 0 }); } }

  /* ---- Controls ---- */
  function setPaused(p) {
    userPaused = p;
    toggle.classList.toggle('is-paused', p);
    toggle.setAttribute('aria-label', p ? 'Play the video' : 'Pause the video');
    if (p) { halt(); if (holding) clearTimeout(holdTimer); }
    else if (holding) { holding = false; start(0); }
    else go();
  }
  toggle.addEventListener('click', function () { setPaused(!userPaused); });
  pips.forEach(function (p, k) {
    p.addEventListener('click', function () {
      build();
      var i = 0; FILMS.forEach(function (f, n) { if (f.beat === k && FILMS[i].beat !== k) i = n; });
      userPaused = false; toggle.classList.remove('is-paused'); toggle.setAttribute('aria-label', 'Pause the video');
      started = true; start(i);
    });
  });
  // Autoplay refused (iPhone Low Power Mode): show the real photo and a button. One tap unlocks every film.
  function setBlocked(b) {
    if (b === blocked) return; blocked = b;
    scene.classList.toggle('is-blocked', b);
    if (playBtn) playBtn.hidden = !b;
  }
  if (playBtn) playBtn.addEventListener('click', function () {
    FILMS.forEach(function (f, k) {
      if (k === idx) return;
      var p = f.el.play();
      if (p && p.then) p.then(function () { if (k !== idx) f.el.pause(); }, function () {});
    });
    userPaused = false;
    go();
  });

  /* ---- Start when the section is on screen, pause when it leaves ---- */
  function arm() { build(); }
  function onView(now) {
    if (now === inView) return; inView = now;
    html.classList.toggle('scene-active', now);
    if (now) { arm(); if (!started) { started = true; start(0); } else go(); }
    else halt();
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var e = es[es.length - 1];
      onView(e.isIntersecting && e.intersectionRatio >= 0.45);
    }, { threshold: [0, 0.2, 0.45, 0.7, 0.9] }).observe(pin);
  } else { onView(true); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) halt(); else go(); });

  /* ---- Loading: nothing until the page has loaded (or the opener is done), then fetch the first film when the section is near ---- */
  function armWhenNear() {
    if (!('IntersectionObserver' in window)) { arm(); return; }
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { arm(); io.disconnect(); } }, { rootMargin: '150% 0px' });
    io.observe(scene);
  }
  var gate = false;
  function openGate() { if (gate) return; gate = true; armWhenNear(); }
  ['scroll', 'touchstart', 'pointerdown', 'keydown'].forEach(function (t) { window.addEventListener(t, openGate, { once: true, passive: true }); });
  window.addEventListener('spz:intro-done', function () { setTimeout(openGate, 300); });
  function afterLoad() { if (!html.classList.contains('lick-on')) setTimeout(openGate, 1500); }
  if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad);

  // first look: Lap 1 on the gold page
  beats.forEach(function (b, k) { b.classList.toggle('is-active', k === 0); });
  pips[0].classList.add('is-on');
  pin.style.setProperty('--edge-top', GOLD); pin.style.setProperty('--edge-bot', GOLD);

  SPZ.scene = { films: FILMS, start: function (i) { build(); started = true; start(i); }, pause: function () { setPaused(true); }, play: function () { setPaused(false); } };
})();
