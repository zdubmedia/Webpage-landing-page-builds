/* Speedy PawZ: "How it works" scroll scene.
   Pinned and scroll-scrubbed with GSAP ScrollTrigger. Five beats:

     Lap 1        footage  a-00..   van at the curb, side door slides open, pup hops in
     Lap 2        photo    pats     real photo: love pats before the first step
     Lap 3        footage  b-00..   pup trotting on the slat mill (slobber drops land on the lens)
     Pit stop     footage  c-00..   both mills from above, then the SVG mill comes apart: no motor
     Finish line  photo    nap      pup asleep, phone pops up with the photo update

   Footage lives in assets/scene/d (desktop, 1280x660) and assets/scene/m (phone, 720x530).
   To swap in new clips, see assets/scene/README.md and edit SHOTS / CHAPTERS below.
   Reduced motion, no JS or no GSAP: the real van photo + five beat cards stay as they are in the HTML. */
(function () {
  'use strict';
  var SPZ = window.SPZ || {};
  var html = document.documentElement;
  var scene = document.getElementById('vanScene');
  if (!scene || SPZ.reduced || !window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  html.classList.add('scene-on');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pin = $('.scene__pin', scene), stage = $('.scene__stage', scene);
  var canvas = $('.scene__canvas', scene), ctx = canvas.getContext('2d');
  var beats = $$('.beat', scene), pips = $$('.scene__pips i', scene), drops = $$('.scene__drops i', scene);
  var diagram = $('.scene__diagram', scene), phoneLayer = $('.scene__phone', scene);
  var portrait = window.matchMedia('(orientation: portrait)');
  var small = portrait.matches || window.innerWidth < 760;
  var BASE = 'assets/scene/' + (small ? 'm' : 'd') + '/';

  /* ---- Footage ---- */
  var SHOTS = { a: 24, b: 25, c: 11 };          // frames per shot
  var cache = {};
  function load(name, cb) {
    if (cache[name]) return cache[name];
    var im = new Image();
    im.decoding = 'async';
    im.onload = function () { im._ok = true; if (cb) cb(); else redraw(); };
    im.src = BASE + name + '.webp';
    cache[name] = im;
    return im;
  }
  function frameName(shot, i) { return shot + '-' + (i < 10 ? '0' : '') + i; }
  // nearest loaded frame in the same shot, so scrubbing never shows a blank
  function frame(shot, i) {
    var n = SHOTS[shot];
    for (var d = 0; d < n; d++) {
      var lo = cache[frameName(shot, i - d)], hi = cache[frameName(shot, i + d)];
      if (i - d >= 0 && lo && lo._ok) return lo;
      if (i + d < n && hi && hi._ok) return hi;
    }
    return null;
  }
  var started = false;
  function startLoading() {
    if (started) return; started = true;
    // first frame of every beat first, then fill in, a few at a time
    var order = ['a-00', 'pats', 'b-00', 'c-00', 'nap'];
    ['a', 'b', 'c'].forEach(function (s) { for (var i = 1; i < SHOTS[s]; i++) order.push(frameName(s, i)); });
    (function pump() {
      var k = 0;
      while (order.length && k++ < 5) load(order.shift());
      if (order.length) setTimeout(pump, 70);
    })();
  }
  // The scene sits right under the hero, so hold the frames back until the page has
  // finished loading (or the visitor starts moving, or the lick opener is done).
  // That keeps them from competing with the hero image and fonts.
  var armed = false;
  function arm() {
    if (armed) return; armed = true;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { startLoading(); io.disconnect(); } }, { rootMargin: '150% 0px' });
      io.observe(scene);
    } else { startLoading(); }
  }
  ['scroll', 'touchstart', 'pointerdown', 'keydown'].forEach(function (t) { window.addEventListener(t, arm, { once: true, passive: true }); });
  window.addEventListener('spz:intro-done', function () { setTimeout(arm, 300); });
  function afterLoad() { if (!html.classList.contains('lick-on')) setTimeout(arm, 1500); }
  if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad);

  /* ---- Canvas drawing ---- */
  function sizeCanvas() {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = Math.round(stage.clientWidth * dpr), h = Math.round(stage.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }
  // cover-fit, with an extra zoom toward a focus point (0 to 1)
  function drawCover(img, zoom, fx, fy, alpha) {
    if (!img || !img._ok) return false;
    var cw = canvas.width, ch = canvas.height;
    var s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * (zoom || 1);
    var w = img.naturalWidth * s, h = img.naturalHeight * s;
    var x = (cw - w) * (fx == null ? 0.5 : fx), y = (ch - h) * (fy == null ? 0.5 : fy);
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.drawImage(img, x, y, w, h);
    ctx.globalAlpha = 1;
    return true;
  }

  /* ---- Chapters: where each piece of footage sits on the 0 to 1 scroll ---- */
  var ease = function (t) { return t * t * (3 - 2 * t); };
  var CHAPTERS = [
    { from: 0.00, to: 0.22, beat: 0, draw: function (t, a) { return drawCover(frame('a', Math.min(SHOTS.a - 1, Math.floor(t * SHOTS.a))), 1, 0.5, 0.5, a); } },
    { from: 0.22, to: 0.37, beat: 1, draw: function (t, a) { return drawCover(cache.pats, 1 + 0.12 * ease(t), small ? 0.5 : 0.55, 0.6, a); } },
    { from: 0.37, to: 0.56, beat: 2, draw: function (t, a) { return drawCover(frame('b', Math.min(SHOTS.b - 1, Math.floor(t * SHOTS.b))), 1, 0.6, 0.4, a); } },
    { from: 0.56, to: 0.84, beat: 3, draw: function (t, a) { return drawCover(frame('c', Math.min(SHOTS.c - 1, Math.floor(Math.min(1, t / 0.3) * SHOTS.c))), 1, 0.5, 0.5, a); } },
    { from: 0.84, to: 1.01, beat: 4, draw: function (t, a) { return drawCover(cache.nap, (small ? 1.3 : 1.22) + 0.14 * ease(Math.min(1, t)), small ? 0.16 : 0.12, 0.92, a); } }
  ];
  var FADE = 0.014;
  var progress = 0, drew = false;
  function redraw() {
    sizeCanvas();
    var p = progress, i;
    for (i = CHAPTERS.length - 1; i > 0; i--) if (p >= CHAPTERS[i].from) break;
    var c = CHAPTERS[i], t = (p - c.from) / (c.to - c.from);
    var ok = true;
    if (i > 0 && p - c.from < FADE) {               // short crossfade from the previous chapter
      CHAPTERS[i - 1].draw(1, 1);
      ok = c.draw(t, (p - c.from) / FADE);
    } else { ok = c.draw(t, 1); }
    if (ok && !drew) { drew = true; canvas.classList.add('is-live'); }
  }

  /* ---- Beat text + pips + slobber drops ---- */
  var activeBeat = -1;
  function setBeat(i) {
    if (i === activeBeat) return;
    activeBeat = i;
    beats.forEach(function (b, k) { b.classList.toggle('is-active', k === i); });
    pips.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
  }
  function beatFor(p) { for (var i = CHAPTERS.length - 1; i > 0; i--) if (p >= CHAPTERS[i].from - 0.01) return CHAPTERS[i].beat; return 0; }
  function setDrops(p) {
    drops.forEach(function (d, k) { d.classList.toggle('is-on', p > 0.41 + k * 0.022 && p < 0.555); });
  }
  setBeat(0);

  /* ---- Pit-stop diagram: build the slats, then the explode timeline ---- */
  var NS = 'http://www.w3.org/2000/svg', slatG = $('#dgSlats'), slats = [];
  for (var i = 0; i < 20; i++) {
    var r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', -276 + i * 28); r.setAttribute('y', -67); r.setAttribute('width', 22); r.setAttribute('height', 22); r.setAttribute('rx', 4);
    slatG.appendChild(r); slats.push(r);
  }
  var labels = $$('.dg-label', scene);
  var phone = $('#phoneMock'), notif = $('#notif');
  gsap.set([diagram, phoneLayer], { autoAlpha: 0 });
  gsap.set(labels, { autoAlpha: 0, y: 10 });
  gsap.set(phone, { y: 560 });
  gsap.set(notif, { scale: 0.7, transformOrigin: '50% 0%', opacity: 0 });

  // One timeline, 100 units long, so positions read as scroll percent.
  var tl = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: function () { progress = tl.progress(); redraw(); setBeat(beatFor(progress)); setDrops(progress); } });
  tl.to({}, { duration: 100 }, 0)
    // diagram fades in over the overhead shot, comes apart, holds, goes back together
    .to(diagram, { autoAlpha: 1, duration: 2.2 }, 63.2)
    .to('#dgArch', { y: -78, duration: 5, ease: 'power2.inOut' }, 66)
    .to('#dgPanel', { y: -34, duration: 5, ease: 'power2.inOut' }, 66)
    .to('#dgBase', { y: 76, duration: 5, ease: 'power2.inOut' }, 66)
    .to('#dgWheelL', { x: '-=92', duration: 5, ease: 'power2.inOut' }, 66)
    .to('#dgWheelR', { x: '+=92', duration: 5, ease: 'power2.inOut' }, 66)
    .to('#dgLoop', { opacity: 0.25, duration: 3 }, 66)
    .to(slats, { x: function (k) { return (k - 9.5) * 4.6; }, y: function (k) { return k % 2 ? -7 : 7; }, duration: 5, ease: 'power2.inOut' }, 66)
    .to('.dg-wheel', { rotation: 300, transformOrigin: '50% 50%', duration: 14 }, 66)
    .to(labels, { autoAlpha: 1, y: 0, duration: 1.4, stagger: 0.5, ease: 'power2.out' }, 70)
    .to(labels, { autoAlpha: 0, duration: 1 }, 77.6)
    .to(['#dgArch', '#dgPanel', '#dgBase'], { y: 0, duration: 3.6, ease: 'power2.inOut' }, 78.4)
    .to('#dgWheelL', { x: '+=92', duration: 3.6, ease: 'power2.inOut' }, 78.4)
    .to('#dgWheelR', { x: '-=92', duration: 3.6, ease: 'power2.inOut' }, 78.4)
    .to(slats, { x: 0, y: 0, duration: 3.6, ease: 'power2.inOut' }, 78.4)
    .to('#dgLoop', { opacity: 1, duration: 2 }, 80)
    .to(diagram, { autoAlpha: 0, duration: 2 }, 83)
    // finish line: phone pops up with the photo update
    .set(phoneLayer, { autoAlpha: 1 }, 88)
    .to(phone, { y: 0, duration: 4.5, ease: 'back.out(1.3)' }, 88.5)
    .to(notif, { scale: 1, opacity: 1, duration: 2.4, ease: 'back.out(2)' }, 92);

  var st = ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: function () { return '+=' + Math.round((portrait.matches ? 3.6 : 4.2) * window.innerHeight); },
    pin: true,
    scrub: 0.5,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    animation: tl,
    onToggle: function (self) { html.classList.toggle('scene-active', self.isActive); if (self.isActive) startLoading(); },
    onRefresh: redraw
  });

  window.addEventListener('resize', redraw);
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  window.addEventListener('spz:intro-done', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  SPZ.sceneTrigger = st;
})();
