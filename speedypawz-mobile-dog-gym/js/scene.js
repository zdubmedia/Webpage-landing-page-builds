/* Speedy PawZ: "How it works" scene.
   The scene sticks to the screen while you scroll through five steps. Arriving at a step plays that step's
   short film all the way through by itself; scrolling on moves to the next step.

     Lap 1        van      the van drives in from the side of the page, the door slides open, the camera pushes in
     Lap 2        warmup   Emelyn clips the harness on, love pats, a treat
     Lap 3        trot     happy slow-motion trot on the slat mill, tongue flapping
     Pit stop     mill     the slat mill comes apart and goes back together (label chips pop in)
     Finish line  nap      pup hops out, curls up on the bed, falls asleep (phone pops up with the photo update)

   Two ways to show a film, same look either way:
     video   assets/scene/film/<file>.mp4 (and <file>-m.mp4 for phones). Smoothest. Used whenever the browser allows it.
     frames  assets/scene/seq/<seq>/000.webp ... played on a canvas. Used where the browser refuses to start a video
             on its own (iPhone Low Power Mode), so nobody ever gets a play button.

   "Seamless" films sit on a flat background color and the page behind them is painted the same color,
   so the van reads as part of the page, not a video in a box. "Tile" films sit as rounded cards.

   The sticking is plain CSS (position: sticky), so scrolling stays native and smooth.
   Reduced motion or no JS: the real van photo + five step cards stay as they are in the HTML. */
(function () {
  'use strict';
  var SPZ = window.SPZ = window.SPZ || {};
  var html = document.documentElement;
  var scene = document.getElementById('vanScene');
  if (!scene || SPZ.reduced) return;
  // the sticking needs position: sticky and overflow: clip (every current browser; iOS 16 and up)
  if (!(window.CSS && CSS.supports && CSS.supports('position', 'sticky') && CSS.supports('overflow-x', 'clip'))) return;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pin = $('.scene__pin', scene), stage = $('.scene__stage', scene), holder = $('.scene__films', scene);
  var beats = $$('.beat', scene), pips = $$('.scene__pips button', scene), tags = $$('.scene__tags li', scene);
  var phoneLayer = $('.scene__phone', scene);
  if (!holder || !pips.length) return;
  html.classList.add('scene-on');

  var small = window.matchMedia('(orientation: portrait), (max-width: 759px)').matches;
  var GOLD = '#F7B334', MIDNIGHT = '#1F1B30';

  /* ---- The films, in order ----
     file      name in assets/scene/film            phone   true if there is a smaller <file>-m.mp4 for phones
     seq       folder in assets/scene/seq, with n frames at fps frames a second (w x h pixels)
     look      seamless | seamless corner (smaller, bottom right on desktop) | tile | tile tall (upright clip, beside the text on desktop)
     top, bot  page color behind the film            fx      seamless on phones: which part of the frame stays centered (0 left, 1 right) */
  var FILMS = [
    { file: '1-van', phone: true, seq: 'van', n: 108, fps: 15, w: 640, h: 360, look: 'seamless corner', top: GOLD, bot: GOLD, fx: 0.58 },
    { file: '2-warmup', seq: 'warmup', n: 60, fps: 12, w: 640, h: 472, look: 'tile tall', top: MIDNIGHT, bot: MIDNIGHT },
    { file: '3-trot', phone: true, seq: 'trot', n: 60, fps: 12, w: 640, h: 472, look: 'tile', top: MIDNIGHT, bot: MIDNIGHT },
    { file: '4-mill', phone: true, seq: 'mill', n: 72, fps: 12, w: 640, h: 360, look: 'seamless', top: '#141B2C', bot: '#3A4660', tags: true },
    { file: '5-nap', phone: true, seq: 'nap', n: 84, fps: 12, w: 640, h: 472, look: 'tile', top: GOLD, bot: GOLD, photoUpdate: true }
  ];
  var STEPS = FILMS.length;
  function cls(f) { return 'film film--' + f.look.split(' ').join(' film--'); }

  /* ---- Two kinds of player with the same handful of methods ---- */
  function videoPlayer(f, i) {
    var v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    v.setAttribute('disableremoteplayback', ''); v.disablePictureInPicture = true;
    v.preload = 'none'; v.tabIndex = -1; v.className = cls(f);
    if (f.fx != null) v.style.setProperty('--fx', f.fx);
    v.src = 'assets/scene/film/' + f.file + (small && f.phone ? '-m' : '') + '.mp4';
    var asked = false;
    v.addEventListener('playing', function () { onPlaying(i); });
    v.addEventListener('ended', function () { onEnded(i); });
    v.addEventListener('error', function () { onRefused(); });
    return {
      el: v,
      load: function () { if (!asked) { asked = true; v.preload = 'auto'; v.load(); } },
      play: function () { this.load(); var p = v.play(); return p && p.then ? p : Promise.resolve(); },
      pause: function () { if (!v.paused) v.pause(); },
      rewind: function () { try { v.currentTime = 0; } catch (e) { /* not loaded yet: it starts at 0 anyway */ } },
      time: function () { return v.currentTime; },
      dur: function () { return v.duration || f.n / f.fps; },
      moving: function () { return !v.paused && !v.ended; },
      ended: function () { return v.ended; }
    };
  }
  function framePlayer(f, i) {
    var c = document.createElement('canvas');
    c.width = f.w; c.height = f.h; c.className = cls(f);
    if (f.fx != null) c.style.setProperty('--fx', f.fx);
    var ctx = c.getContext('2d'), imgs = [], next = 0, busy = 0, asked = false;
    var dur = f.n / f.fps, t = 0, last = 0, raf = 0, drawn = -1, want = false, told = false, done = false;
    function name(k) { return 'assets/scene/seq/' + f.seq + '/' + (k < 10 ? '00' : k < 100 ? '0' : '') + k + '.webp'; }
    function fetchMore() {
      while (busy < 6 && next < f.n) (function (k) {
        busy++;
        var im = new Image();
        im.decoding = 'async';
        im.onload = function () { im._ok = true; busy--; fetchMore(); if (want && !raf) raf = requestAnimationFrame(tick); };
        im.onerror = function () { im._bad = true; busy--; fetchMore(); };
        im.src = name(k);
        imgs[k] = im;
      })(next++);
    }
    function ready(k) { return imgs[k] && (imgs[k]._ok || imgs[k]._bad); }
    // start once about a second and a half is in hand, then keep going as long as the next frame has arrived
    function buffered() { var need = Math.min(f.n - 1, Math.floor(t * f.fps) + Math.ceil(f.fps * (drawn < 0 ? 1.5 : 0))); for (var k = Math.floor(t * f.fps); k <= need; k++) if (!ready(k)) return false; return true; }
    function tick(now) {
      raf = 0;
      if (!want) return;
      if (!buffered()) { last = 0; return; }             // wait for the network; an image load restarts the loop
      if (last) t = Math.min(dur, t + Math.min(0.1, (now - last) / 1000));
      last = now;
      var k = Math.min(f.n - 1, Math.floor(t * f.fps));
      if (k !== drawn && imgs[k] && imgs[k]._ok) { ctx.drawImage(imgs[k], 0, 0, f.w, f.h); drawn = k; }
      if (!told && drawn >= 0) { told = true; onPlaying(i); }
      if (t >= dur) { want = false; done = true; onEnded(i); return; }
      raf = requestAnimationFrame(tick);
    }
    return {
      el: c,
      load: function () { if (!asked) { asked = true; fetchMore(); } },
      play: function () { this.load(); if (done) return Promise.resolve(); want = true; last = 0; if (!raf) raf = requestAnimationFrame(tick); return Promise.resolve(); },
      pause: function () { want = false; },
      rewind: function () { t = 0; last = 0; drawn = -1; told = false; done = false; },
      time: function () { return t; },
      dur: function () { return dur; },
      moving: function () { return want; },
      ended: function () { return done; }
    };
  }

  /* ---- Build (video first; frames if the browser will not autoplay) ---- */
  var built = false, mode = '', idx = 0, shown = -1, active = false;
  function build(kind) {
    if (built && (!kind || mode === kind)) return;
    FILMS.forEach(function (f) { if (f.p && f.p.el.parentNode) { f.p.pause(); holder.removeChild(f.p.el); } });
    var canVideo = (function () { var v = document.createElement('video'); return !!(v.play && v.canPlayType && v.canPlayType('video/mp4; codecs="avc1.640028"')); })();
    mode = kind || (SPZ.noAutoplay || !canVideo ? 'frames' : 'video');
    FILMS.forEach(function (f, i) { f.p = mode === 'video' ? videoPlayer(f, i) : framePlayer(f, i); holder.appendChild(f.p.el); });
    built = true; shown = -1;
    scene.setAttribute('data-films', mode);
    FILMS[0].p.load();
  }
  // The browser said no to autoplay (or a video failed): swap every film to frames and carry on from the same step.
  function onRefused() {
    if (mode !== 'video') return;
    SPZ.noAutoplay = true;
    build('frames');
    if (active) start(idx);
  }

  /* ---- What is on screen: film, page color, step card, dots ---- */
  function onPlaying(i) {
    if (i !== idx || shown === i) return;
    var f = FILMS[i];
    shown = i;
    FILMS.forEach(function (g, k) { g.p.el.classList.toggle('is-on', k === i); });
    stage.classList.toggle('is-tile', f.look.indexOf('tile') > -1);
    stage.classList.toggle('is-tall', f.look.indexOf('tall') > -1);
    scene.style.setProperty('--edge-top', f.top);
    scene.style.setProperty('--edge-bot', f.bot);
    beats.forEach(function (b, k) { b.classList.toggle('is-active', k === i); });
    pips.forEach(function (p, k) {
      p.classList.toggle('is-on', k === i);
      p.classList.toggle('is-done', k < i);
      if (k !== i) p.style.setProperty('--p', 0);
      if (k === i) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current');
    });
    if (!f.tags) tags.forEach(function (el) { el.classList.remove('is-on'); });
    if (!f.photoUpdate) hidePhone();
  }
  function onEnded(i) {
    if (i !== idx) return;
    pips[i].style.setProperty('--p', 1);
    scene.classList.add('is-waiting');           // shows the "keep scrolling" nudge
  }

  /* ---- Playing one step ---- */
  function start(i) {
    idx = i;
    scene.classList.remove('is-waiting');
    FILMS.forEach(function (f, k) { if (k !== i) f.p.pause(); });
    var p = FILMS[i].p;
    p.rewind(); phoneUp = false;
    p.play().then(function () { if (FILMS[i + 1]) FILMS[i + 1].p.load(); },
                  function (err) { if (err && err.name === 'NotAllowedError') onRefused(); });
    loop();
  }
  function halt() { FILMS.forEach(function (f) { if (f.p) f.p.pause(); }); }

  var raf = 0;
  function loop() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick() {
    raf = 0;
    var f = FILMS[idx], p = f.p, d = p.dur(), t = d ? Math.min(1, p.time() / d) : 0;
    if (shown === idx) {
      pips[idx].style.setProperty('--p', t.toFixed(3));
      if (f.tags) tags.forEach(function (el, k) { el.classList.toggle('is-on', t > 0.26 + k * 0.07 && t < 0.8); });
      if (f.photoUpdate && p.time() > d - 2.3 && !phoneUp) showPhone();
    }
    if (active && !p.ended()) raf = requestAnimationFrame(tick);
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

  /* ---- Scroll: which step are we on? ----
     The scene is taller than the screen and its inner panel sticks. How far we are through that extra height picks the step.
     The van starts a little before the panel sticks, as soon as most of the stage has come into view. */
  function where() {
    var r = scene.getBoundingClientRect(), vh = window.innerHeight, run = scene.offsetHeight - pin.offsetHeight;
    var p = run > 0 ? -r.top / run : 0;
    return { on: r.top < vh * 0.42 && r.bottom > vh * 0.55, stuck: r.top <= 1 && r.bottom >= vh - 1, step: Math.max(0, Math.min(STEPS - 1, Math.floor(p * STEPS))) };
  }
  var queued = false;
  function update() {
    queued = false;
    var w = where();
    html.classList.toggle('scene-active', w.stuck);
    if (!w.on) { if (active) { active = false; halt(); } return; }
    if (!built) build();
    if (!active || w.step !== idx) { active = true; start(w.step); }
  }
  function onScroll() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) halt();
    else if (active && built && !FILMS[idx].p.ended()) { FILMS[idx].p.play().then(null, function () {}); loop(); }
  });

  // Dots: tap one to jump to that step
  pips.forEach(function (p, k) {
    p.addEventListener('click', function () {
      var top = scene.getBoundingClientRect().top + window.scrollY, run = scene.offsetHeight - pin.offsetHeight;
      window.scrollTo({ top: Math.round(top + run * (k + 0.5) / STEPS), behavior: 'smooth' });
    });
  });

  /* ---- Loading: nothing until the page has loaded (or the opener is done), then get ready when the section is near ---- */
  function armWhenNear() {
    if (!('IntersectionObserver' in window)) { build(); return; }
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { if (!built) build(); io.disconnect(); } }, { rootMargin: '150% 0px' });
    io.observe(scene);
  }
  var gate = false;
  function openGate() { if (gate) return; gate = true; armWhenNear(); }
  ['scroll', 'touchstart', 'pointerdown', 'keydown'].forEach(function (t) { window.addEventListener(t, openGate, { once: true, passive: true }); });
  window.addEventListener('spz:intro-done', function () { setTimeout(openGate, 300); });
  function afterLoad() { if (!html.classList.contains('lick-on')) setTimeout(openGate, 1500); onScroll(); }
  if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad);

  // first look: Lap 1 on the gold page
  beats.forEach(function (b, k) { b.classList.toggle('is-active', k === 0); });
  pips[0].classList.add('is-on');
  scene.style.setProperty('--edge-top', GOLD); scene.style.setProperty('--edge-bot', GOLD);

  SPZ.scene = { films: FILMS, mode: function () { return mode; }, step: function () { return idx; }, shown: function () { return shown; }, useFrames: function () { SPZ.noAutoplay = true; build('frames'); if (active) start(idx); } };
})();
