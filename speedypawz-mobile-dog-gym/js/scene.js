/* Speedy PawZ: the short films on the page (the five "How it works" laps and the clips in the "Who it's for" cards).

   How they behave: nothing to tap. When a film's picture has scrolled far enough onto the screen (a bit more than
   half of it showing), it starts by itself and plays through. It keeps going even if you stop scrolling.
   Some films play once and rest on their last frame, some loop (set with data-play in index.html).
   A film pauses when it leaves the screen and starts again from the top the next time it comes back.

   Any element with data-film is a film. What it reads from the HTML:
     data-film     the video file (path without .mp4)       data-film-m   optional smaller video for phones
     data-seq      folder of still frames (000.webp ...)     data-n, data-fps, data-w, data-h   frame count, speed, size
     data-play     "once" or "loop"                          data-hold     pause in ms before a loop starts over
     data-first    "1": show the film's first frame while waiting (the laps do; the cards rest on their own still)

   Two ways to show a film, same look either way:
     video   smoothest; used whenever the browser allows a video to start by itself
     frames  the same film as still frames on a canvas; used where the browser refuses (iPhone Low Power Mode),
             so nobody ever gets a play button

   Reduced motion or no JS: every film just shows its still picture (the <img> in the HTML). */
(function () {
  'use strict';
  var SPZ = window.SPZ = window.SPZ || {};
  var html = document.documentElement;
  if (SPZ.reduced) return;
  var hosts = Array.prototype.slice.call(document.querySelectorAll('[data-film]'));
  if (!hosts.length || !('IntersectionObserver' in window)) return;

  var small = window.matchMedia('(orientation: portrait), (max-width: 759px)').matches;
  var canVideo = (function () { var v = document.createElement('video'); return !!(v.play && v.canPlayType && v.canPlayType('video/mp4; codecs="avc1.640028"')); })();
  var mode = SPZ.noAutoplay || !canVideo ? 'frames' : 'video';

  /* ---- Two kinds of player with the same handful of methods ---- */
  function videoPlayer(f) {
    var v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    v.setAttribute('disableremoteplayback', ''); v.disablePictureInPicture = true;
    v.preload = 'none'; v.tabIndex = -1; v.className = 'film';
    if (f.vpos) v.style.objectPosition = f.vpos;
    v.src = (small && f.fileM ? f.fileM : f.file) + '.mp4';
    var asked = false;
    v.addEventListener('playing', function () { started(f); });
    v.addEventListener('ended', function () { ended(f); });
    v.addEventListener('error', function () { refused(); });
    return {
      el: v,
      load: function () { if (!asked) { asked = true; v.preload = 'auto'; v.load(); } },
      play: function () { this.load(); var p = v.play(); return p && p.then ? p : Promise.resolve(); },
      pause: function () { if (!v.paused) v.pause(); },
      rewind: function () { try { v.currentTime = 0; } catch (e) { /* not loaded yet: it starts at 0 anyway */ } },
      time: function () { return v.currentTime; },
      dur: function () { return v.duration || f.n / f.fps; },
      done: function () { return v.ended; }
    };
  }
  function framePlayer(f) {
    var c = document.createElement('canvas');
    c.width = f.w; c.height = f.h; c.className = 'film';
    var ctx = c.getContext('2d'), imgs = [], next = 0, busy = 0, asked = false;
    var dur = f.n / f.fps, t = 0, last = 0, raf = 0, drawn = -1, want = false, told = false, over = false;
    function name(k) { return f.seq + (k < 10 ? '00' : k < 100 ? '0' : '') + k + '.webp'; }
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
    function buffered() { var from = Math.floor(t * f.fps), to = Math.min(f.n - 1, from + (drawn < 0 ? Math.ceil(f.fps * 1.5) : 0)); for (var k = from; k <= to; k++) if (!ready(k)) return false; return true; }
    function tick(now) {
      raf = 0;
      if (!want) return;
      if (!buffered()) { last = 0; return; }             // wait for the network; an image load restarts the loop
      if (last) t = Math.min(dur, t + Math.min(0.1, (now - last) / 1000));
      last = now;
      var k = Math.min(f.n - 1, Math.floor(t * f.fps));
      if (k !== drawn && imgs[k] && imgs[k]._ok) { ctx.drawImage(imgs[k], 0, 0, f.w, f.h); drawn = k; }
      if (!told && drawn >= 0) { told = true; started(f); }
      if (t >= dur) { want = false; over = true; ended(f); return; }
      raf = requestAnimationFrame(tick);
    }
    return {
      el: c,
      load: function () { if (!asked) { asked = true; fetchMore(); } },
      play: function () { this.load(); if (over) return Promise.resolve(); want = true; last = 0; if (!raf) raf = requestAnimationFrame(tick); return Promise.resolve(); },
      pause: function () { want = false; },
      rewind: function () { t = 0; last = 0; drawn = -1; told = false; over = false; },
      time: function () { return t; },
      dur: function () { return dur; },
      done: function () { return over; }
    };
  }

  /* ---- The films ---- */
  var films = hosts.map(function (host) {
    var d = host.dataset, lap = host.closest ? host.closest('.lap') : null;
    var f = {
      host: host, lap: lap, file: d.film, fileM: d.filmM || '', seq: d.seq, n: +d.n || 1, fps: +d.fps || 12, w: +d.w || 640, h: +d.h || 472,
      loop: d.play === 'loop', hold: +d.hold || 0, vpos: d.vpos || '',
      on: false, fresh: true, timer: 0, p: null,
      tags: lap ? Array.prototype.slice.call(lap.querySelectorAll('.lap__tags li')) : [],
      phone: !!(lap && lap.querySelector('.lap__phone'))
    };
    if (d.first === '1') { var img = host.querySelector('img'); if (img) { img.removeAttribute('srcset'); img.src = d.seq + '000.webp'; } }
    return f;
  });
  function mount(f) { f.p = mode === 'video' ? videoPlayer(f) : framePlayer(f); f.host.appendChild(f.p.el); }
  films.forEach(mount);

  // The browser said no to autoplay (or a video failed to load): swap every film to frames and carry on.
  function refused() {
    if (mode !== 'video') return;
    mode = 'frames'; SPZ.noAutoplay = true;
    films.forEach(function (f) {
      f.p.pause(); f.host.removeChild(f.p.el); f.host.classList.remove('has-film');
      mount(f); f.fresh = true;
      if (f.on) go(f);
    });
  }

  function started(f) { f.host.classList.add('has-film'); if (f.lap) f.lap.classList.add('has-film'); loop(); }
  function ended(f) {
    if (!f.loop || !f.on) return;
    clearTimeout(f.timer);
    f.timer = setTimeout(function () { if (f.on) { f.p.rewind(); play(f); } }, f.hold);
  }
  function play(f) {
    f.p.play().then(null, function (err) { if (err && err.name === 'NotAllowedError') refused(); });
    loop();
  }
  function go(f) {
    if (f.fresh) { f.fresh = false; f.p.rewind(); if (f.lap) f.lap.classList.remove('is-update'); }
    if (f.p.done() && !f.loop) return;          // a play-once film that has finished rests on its last frame
    if (f.p.done()) f.p.rewind();
    play(f);
  }

  /* ---- Lap extras that follow the film: the pit-stop label chips and the photo-update phone ---- */
  var raf = 0;
  function loop() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick() {
    raf = 0;
    var busy = false;
    films.forEach(function (f) {
      if (!f.on || (!f.tags.length && !f.phone)) return;
      busy = true;
      var d = f.p.dur(), t = d ? Math.min(1, f.p.time() / d) : 0;
      f.tags.forEach(function (el, k) { el.classList.toggle('is-on', t > 0.26 + k * 0.07 && t < 0.8); });
      if (f.phone && f.p.time() > d - 2.3) f.lap.classList.add('is-update');
    });
    if (busy) raf = requestAnimationFrame(tick);
  }

  /* ---- Start when a film is a bit more than half on screen; pause when it has nearly left; restart after it has fully left ---- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var f = films.filter(function (x) { return x.host === e.target; })[0];
      if (!f) return;
      if (e.intersectionRatio >= 0.55) { if (!f.on) { f.on = true; go(f); } }
      else if (e.intersectionRatio < 0.12) {
        if (f.on) { f.on = false; clearTimeout(f.timer); f.p.pause(); }
        if (!e.isIntersecting) f.fresh = true;
      }
    });
  }, { threshold: [0, 0.12, 0.55, 0.8], rootMargin: small ? '0px 0px -64px 0px' : '0px' });   // on phones the sticky button bar covers the bottom strip

  /* ---- Loading: nothing until the page has loaded (or the opener is done), then fetch each film when it is about a screen away ---- */
  function arm() {
    var near = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var f = films.filter(function (x) { return x.host === e.target; })[0];
        if (f) f.p.load();
      });
    }, { rootMargin: '110% 0px' });
    films.forEach(function (f) { near.observe(f.host); io.observe(f.host); });
  }
  var gate = false;
  function openGate() { if (gate) return; gate = true; arm(); }
  ['scroll', 'touchstart', 'pointerdown', 'keydown'].forEach(function (t) { window.addEventListener(t, openGate, { once: true, passive: true }); });
  window.addEventListener('spz:intro-done', function () { setTimeout(openGate, 300); });
  function afterLoad() { if (!html.classList.contains('lick-on')) setTimeout(openGate, 1200); }
  if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad);
  document.addEventListener('visibilitychange', function () {
    films.forEach(function (f) { if (!f.on) return; if (document.hidden) f.p.pause(); else if (!f.p.done()) play(f); });
  });

  SPZ.films = { list: films, mode: function () { return mode; }, useFrames: refused };
})();
