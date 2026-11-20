/* Speedy PawZ: "How it works" scroll scene.
   Pinned and scroll-scrubbed with GSAP ScrollTrigger. The footage is sets of still frames
   that the page steps through as the visitor scrolls. Five beats:

     Lap 1        v   the van rolls in from the side of the page and parks (on a flat gold field)
                  p   the side door slides open and the camera pushes inside
     Lap 2        pats (real photo)   love pats before the first step
     Lap 3        s   happy slow-motion trot on the slat mill, tongue flapping
     Pit stop     x   the slat mill comes apart and goes back together (label chips pop in)
     Finish line  n   pup hops out, curls up on the bed, falls asleep (phone pops up with the photo update)

   "Seamless" shots sit on a flat background color. The page behind the footage is painted the
   same color (sampled from each frame), so the van reads as part of the page, not a video in a box.
   The other shots fill the screen on desktop and sit as rounded tiles on phones.

   Frames live in assets/scene/d (desktop, 1280 wide) and assets/scene/m (phone).
   To swap in new clips see assets/scene/README.md, then edit SHOTS and CHAPTERS below.
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
  var canvas = $('.scene__canvas', scene), ctx = canvas.getContext('2d', { willReadFrequently: true });
  var beats = $$('.beat', scene), pips = $$('.scene__pips i', scene), tags = $$('.scene__tags li', scene);
  var phoneLayer = $('.scene__phone', scene);
  var portrait = window.matchMedia('(orientation: portrait)');
  var small = portrait.matches || window.innerWidth < 760;
  var BASE = 'assets/scene/' + (small ? 'm' : 'd') + '/';
  var GOLD = '#F7B334', MIDNIGHT = '#1F1B30';

  /* ---- Footage: frames per shot ---- */
  var SHOTS = { v: 29, a: 24, s: 40, x: 48, n: 56 };
  var cache = {}, requested = {};
  function load(name) {
    if (cache[name]) return cache[name];
    var im = new Image();
    im.decoding = 'async';
    im.onload = function () { im._ok = true; redraw(); };
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
  // Load one shot, a few frames at a time, every 4th frame first so the scrub fills in evenly
  var queue = [], pumping = false;
  function request(shot) {
    if (requested[shot]) return; requested[shot] = true;
    if (!SHOTS[shot]) { load(shot); return; }
    var n = SHOTS[shot], i;
    for (i = 0; i < n; i += 4) queue.push(frameName(shot, i));
    for (i = 0; i < n; i++) if (i % 4) queue.push(frameName(shot, i));
    if (!pumping) { pumping = true; pump(); }
  }
  function pump() {
    var k = 0;
    while (queue.length && k++ < 6) load(queue.shift());
    if (queue.length) setTimeout(pump, 60); else pumping = false;
  }

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
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.drawImage(img, (cw - w) * (fx == null ? 0.5 : fx), (ch - h) * (fy == null ? 0.5 : fy), w, h);
    ctx.globalAlpha = 1;
    return true;
  }
  // Seamless shots on phones: whole frame, full width, edges feathered into the page color
  var edge = { top: '', bot: '' };
  function px(x, y) { var d = ctx.getImageData(x, y, 1, 1).data; return 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')'; }
  function setEdges(top, bot) {
    if (top !== edge.top) { edge.top = top; pin.style.setProperty('--edge-top', top); }
    if (bot !== edge.bot) { edge.bot = bot; pin.style.setProperty('--edge-bot', bot); }
  }
  function drawSeamless(img, alpha) {
    if (!img || !img._ok) return false;
    var cw = canvas.width, ch = canvas.height;
    if (!portrait.matches) {                     // desktop: fill the screen, paint the page to match
      drawCover(img, 1, 0.5, 0.5, alpha);
      if (alpha == null || alpha >= 1) setEdges(px(Math.round(cw / 2), 3), px(Math.round(cw / 2), ch - 4));
      return true;
    }
    var s = cw / img.naturalWidth, h = img.naturalHeight * s, y0 = Math.round((ch - h) / 2), f = Math.round(h * 0.07);
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.drawImage(img, 0, y0, cw, h);
    ctx.globalAlpha = 1;
    if (alpha == null || alpha >= 1) setEdges(px(Math.round(cw / 2), y0 + 3), px(Math.round(cw / 2), Math.round(y0 + h) - 4));
    ctx.globalCompositeOperation = 'destination-out';
    var g = ctx.createLinearGradient(0, y0, 0, y0 + f); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, y0 - 1, cw, f + 1);
    g = ctx.createLinearGradient(0, y0 + h - f, 0, y0 + h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = g; ctx.fillRect(0, y0 + h - f, cw, f + 1);
    ctx.globalCompositeOperation = 'source-over';
    return true;
  }
  function at(shot, t) { return frame(shot, Math.min(SHOTS[shot] - 1, Math.floor(t * SHOTS[shot]))); }

  /* ---- Chapters: where each piece of footage sits on the 0 to 1 scroll ---- */
  var ease = function (t) { return t * t * (3 - 2 * t); };
  var CHAPTERS = [
    { from: 0.00, to: 0.15, beat: 0, shot: 'v', seamless: true, draw: function (t, a) { return drawSeamless(at('v', t), a); } },
    { from: 0.15, to: 0.32, beat: 0, shot: 'a', field: GOLD, draw: function (t, a) { return drawCover(at('a', t), 1, 0.5, 0.5, a); } },
    { from: 0.32, to: 0.42, beat: 1, shot: 'pats', field: MIDNIGHT, draw: function (t, a) { return drawCover(cache.pats, 1 + 0.12 * ease(t), small ? 0.5 : 0.55, 0.6, a); } },
    { from: 0.42, to: 0.57, beat: 2, shot: 's', field: MIDNIGHT, draw: function (t, a) { return drawCover(at('s', t), 1, 0.5, 0.4, a); } },
    { from: 0.57, to: 0.81, beat: 3, shot: 'x', seamless: true, draw: function (t, a) { return drawSeamless(at('x', t), a); } },
    { from: 0.81, to: 1.001, beat: 4, shot: 'n', field: GOLD, draw: function (t, a) { return drawCover(at('n', Math.min(1, t / 0.86)), 1, 0.4, 0.6, a); } }
  ];
  var FADE = 0.012;
  var progress = 0, mode = null;
  function chapterAt(p) { for (var i = CHAPTERS.length - 1; i > 0; i--) if (p >= CHAPTERS[i].from) return i; return 0; }
  function redraw() {
    sizeCanvas();
    var p = progress, i = chapterAt(p), c = CHAPTERS[i], t = (p - c.from) / (c.to - c.from);
    var tile = !c.seamless;
    if (tile !== mode) { mode = tile; stage.classList.toggle('is-tile', tile); }
    if (c.seamless && portrait.matches) ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (i > 0 && p - c.from < FADE && !c.seamless && !CHAPTERS[i - 1].seamless) {   // short crossfade between two full-frame shots
      CHAPTERS[i - 1].draw(1, 1);
      c.draw(t, (p - c.from) / FADE);
    } else { c.draw(t, 1); }
    if (c.field) setEdges(c.field, c.field);
  }

  /* ---- Loading: hold everything back until the page has loaded, then stay one chapter ahead ---- */
  var armed = false;
  function ahead() {
    if (!armed) return;
    var i = chapterAt(progress);
    request(CHAPTERS[i].shot);
    if (CHAPTERS[i + 1]) request(CHAPTERS[i + 1].shot);
  }
  function arm() {
    if (armed) return; armed = true;
    CHAPTERS.forEach(function (c) { load(SHOTS[c.shot] ? frameName(c.shot, 0) : c.shot); });   // first frame of every chapter
    ahead();
  }
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

  /* ---- Beat text + pips + pit-stop label chips ---- */
  var activeBeat = -1;
  function setBeat(i) {
    if (i === activeBeat) return;
    activeBeat = i;
    beats.forEach(function (b, k) { b.classList.toggle('is-active', k === i); });
    pips.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
  }
  function beatFor(p) { return CHAPTERS[chapterAt(p + 0.008)].beat; }
  var X = CHAPTERS[4];
  function setTags(p) {
    var t = (p - X.from) / (X.to - X.from);      // 0 to 1 inside the pit stop
    tags.forEach(function (el, k) { el.classList.toggle('is-on', t > 0.26 + k * 0.07 && t < 0.8); });
  }
  setBeat(0);
  setEdges(GOLD, GOLD);

  /* ---- Finish line: the phone with the photo update ---- */
  var phone = $('#phoneMock'), notif = $('#notif');
  gsap.set(phoneLayer, { autoAlpha: 0 });
  gsap.set(phone, { y: -460 });
  gsap.set(notif, { scale: 0.7, transformOrigin: '50% 0%', opacity: 0 });

  // One timeline, 100 units long, so positions read as scroll percent.
  var tl = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate: function () { progress = tl.progress(); redraw(); setBeat(beatFor(progress)); setTags(progress); ahead(); }
  });
  tl.to({}, { duration: 100 }, 0)
    .set(phoneLayer, { autoAlpha: 1 }, 92.5)
    .to(phone, { y: 0, duration: 3.6, ease: 'back.out(1.2)' }, 92.6)
    .to(notif, { scale: 1, opacity: 1, duration: 2, ease: 'back.out(2)' }, 95.4);

  var st = ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: function () { return '+=' + Math.round((portrait.matches ? 4.2 : 4.8) * window.innerHeight); },
    pin: true,
    scrub: 0.5,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    animation: tl,
    onToggle: function (self) { html.classList.toggle('scene-active', self.isActive); if (self.isActive) { openGate(); arm(); } },
    onRefresh: redraw
  });

  window.addEventListener('resize', redraw);
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  window.addEventListener('spz:intro-done', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  SPZ.sceneTrigger = st;
})();
