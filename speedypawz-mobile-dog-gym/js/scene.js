/* Speedy PawZ: "How it works" laps.
   Five laps sit one under the other. Each lap has a short film, stored as a folder of still frames
   (assets/scene/seq/<name>/000.webp ...). As the visitor scrolls, the film moves forward with the page:
   scroll down and it plays, scroll up and it runs back. Nothing plays by itself, nothing sticks, no buttons.

     Lap 1        van      the van drives in from the side of the page, the door slides open, the camera pushes in
     Lap 2        warmup   Emelyn clips the harness on, love pats, a treat
     Lap 3        trot     happy slow-motion trot on the slat mill, tongue flapping
     Pit stop     mill     the slat mill comes apart and goes back together (label chips pop in)
     Finish line  nap      pup hops out, curls up on the bed, falls asleep (phone drops in with the photo update)

   The film for a lap starts as its picture comes up from the bottom of the screen and finishes a little above
   the middle, so the last frame is on screen for a moment before it scrolls away.

   Frames load when a lap is about one screen away, coarse first (every 16th frame, then 8th, 4th...) so the film
   is usable straight away and gets smoother as the rest arrive. Drawing uses the nearest frame that has arrived.

   Reduced motion or no JS: each lap shows its still picture (the <img> in the HTML). */
(function () {
  'use strict';
  var SPZ = window.SPZ = window.SPZ || {};
  var html = document.documentElement;
  var laps = Array.prototype.slice.call(document.querySelectorAll('#vanScene .lap'));
  if (!laps.length || SPZ.reduced) return;

  var START = 0.94;   // film starts when the top of the picture is this far down the screen (1 = bottom edge)
  var END = 0.40;     // film ends when the middle of the picture is this far down the screen

  var films = laps.map(function (li) {
    var c = li.querySelector('.lap__film'), n = +li.getAttribute('data-n') || 0;
    return {
      li: li, media: li.querySelector('.lap__media'), canvas: c, ctx: c && n ? c.getContext('2d') : null,
      dir: 'assets/scene/seq/' + li.getAttribute('data-seq') + '/', n: n,
      imgs: [], queue: null, busy: 0, drawn: -1, near: false,
      tags: Array.prototype.slice.call(li.querySelectorAll('.lap__tags li')), phone: !!li.querySelector('.lap__phone')
    };
  }).filter(function (f) { return f.ctx; });
  if (!films.length) return;

  /* ---- Loading ---- */
  function name(f, k) { return f.dir + (k < 10 ? '00' : k < 100 ? '0' : '') + k + '.webp'; }
  function plan(f) {                       // coarse to fine: 0, 16, 32 ... then the 8s, the 4s, the 2s, the rest
    var seen = {}, q = [f.n - 1]; seen[f.n - 1] = 1;
    [16, 8, 4, 2, 1].forEach(function (step) { for (var k = 0; k < f.n; k += step) if (!seen[k]) { seen[k] = 1; q.push(k); } });
    return q;
  }
  function pump(f) {
    while (f.busy < 6 && f.queue.length) (function (k) {
      f.busy++;
      var im = new Image();
      im.decoding = 'async';
      im.onload = function () { im._ok = true; f.busy--; pump(f); f.drawn = -1; schedule(); };
      im.onerror = function () { f.busy--; pump(f); };
      im.src = name(f, k);
      f.imgs[k] = im;
    })(f.queue.shift());
  }
  function load(f) { if (!f.queue) { f.queue = plan(f); pump(f); } }
  function nearest(f, k) {
    for (var d = 0; d < f.n; d++) {
      var a = f.imgs[k - d], b = f.imgs[k + d];
      if (a && a._ok) return k - d;
      if (b && b._ok) return k + d;
    }
    return -1;
  }

  /* ---- Scroll: how far through its film is each lap? ---- */
  function progress(f, vh) {
    var r = f.media.getBoundingClientRect();
    if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) return null;                       // nowhere near the screen
    var p = (vh * START - r.top) / (vh * (START - END) + r.height / 2);
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }
  function paint() {
    queued = false;
    var vh = window.innerHeight;
    films.forEach(function (f) {
      if (!f.near) return;
      var p = progress(f, vh);
      if (p === null) return;
      var k = nearest(f, Math.round(p * (f.n - 1)));
      if (k >= 0 && k !== f.drawn) {
        f.ctx.drawImage(f.imgs[k], 0, 0, f.canvas.width, f.canvas.height);
        f.drawn = k;
        if (!f.shown) { f.shown = true; f.li.classList.add('has-film'); }
      }
      f.tags.forEach(function (el, i) { el.classList.toggle('is-on', p > 0.28 + i * 0.07 && p < 0.86); });
      if (f.phone) f.li.classList.toggle('is-update', p > 0.74);
    });
  }
  var queued = false;
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(paint); } }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);

  /* ---- Start loading a lap's frames when it is about a screen away (and not before the page itself has loaded) ---- */
  function arm() {
    if (!('IntersectionObserver' in window)) { films.forEach(function (f) { f.near = true; load(f); }); schedule(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var f = films.filter(function (x) { return x.li === e.target; })[0];
        if (f && e.isIntersecting) { f.near = true; load(f); schedule(); }
      });
    }, { rootMargin: '110% 0px' });
    films.forEach(function (f) { io.observe(f.li); });
  }
  var gate = false;
  function openGate() { if (gate) return; gate = true; arm(); }
  ['scroll', 'touchstart', 'pointerdown', 'keydown'].forEach(function (t) { window.addEventListener(t, openGate, { once: true, passive: true }); });
  window.addEventListener('spz:intro-done', function () { setTimeout(openGate, 300); });
  function afterLoad() { if (!html.classList.contains('lick-on')) setTimeout(openGate, 1200); }
  if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad);

  SPZ.scene = { films: films, progress: function (i) { return progress(films[i], window.innerHeight); } };
})();
