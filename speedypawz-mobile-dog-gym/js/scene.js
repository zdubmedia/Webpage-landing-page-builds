/* Speedy PawZ: "How it works" van scene.
   Pinned, scroll-scrubbed with GSAP ScrollTrigger.
   - Default: SVG illustration (street > van rolls in > door slides > zoom inside > mills > nap + photo update).
   - Upgrade: set SPZ_CONFIG.vanSequence.frameCount > 0 and drop frames in assets/van-sequence/ (0001.webp ...)
     to scrub a photo-realistic image sequence instead. Beat text works the same either way.
   - Reduced motion, no JS or no GSAP: the static van + 4 beat cards stay as they are in the HTML. */
(function () {
  'use strict';
  var CFG = window.SPZ_CONFIG || {};
  var SPZ = window.SPZ || {};
  var html = document.documentElement;
  var scene = document.getElementById('vanScene');
  if (!scene || SPZ.reduced || !window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  html.classList.add('scene-on');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pin = $('.scene__pin', scene);
  var beats = $$('.beat', scene);
  var interior = $('.scene__interior', scene), finale = $('.scene__finale', scene);
  var portrait = window.matchMedia('(orientation: portrait)');
  var seq = CFG.vanSequence || {};
  var useFrames = +seq.frameCount > 0;

  /* ---- Beat text ---- */
  var activeBeat = -1;
  function setBeat(i) {
    if (i === activeBeat) return;
    activeBeat = i;
    beats.forEach(function (b, k) { b.classList.toggle('is-active', k === i); b.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    pin.setAttribute('data-phase', i < 2 ? 'street' : i === 2 ? 'inside' : 'home');
  }
  function beatFor(p) { return p < 0.27 ? 0 : p < 0.52 ? 1 : p < 0.78 ? 2 : 3; }
  // Screen readers: the list stays readable; only visibility changes.
  beats.forEach(function (b) { b.removeAttribute('aria-hidden'); });
  setBeat(0);

  var endDist = function () { return (portrait.matches ? 1.6 : 2.0) * window.innerHeight; };

  /* ---- Option A: image-sequence (photo-realistic upgrade) ---- */
  if (useFrames) {
    html.classList.add('scene-frames-on');
    var canvas = $('.scene__frames', scene);
    canvas.hidden = false;
    var ctx = canvas.getContext('2d');
    var n = +seq.frameCount, imgs = new Array(n), digits = +seq.digits || 4;
    var name = function (i) { var s = String(i + 1); while (s.length < digits) s = '0' + s; return (seq.path || 'assets/van-sequence/') + s + '.' + (seq.ext || 'webp'); };
    var cur = 0;
    function draw(i) {
      var img = imgs[i];
      if (!img || !img.complete || !img.naturalWidth) { // nearest loaded frame
        for (var d = 1; d < n; d++) { if (imgs[i - d] && imgs[i - d].naturalWidth) { img = imgs[i - d]; break; } if (imgs[i + d] && imgs[i + d].naturalWidth) { img = imgs[i + d]; break; } }
        if (!img) return;
      }
      var cw = canvas.clientWidth, ch = canvas.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(cw * dpr)) { canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr); }
      var s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      var w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    }
    function load(i) { if (imgs[i]) return; var im = new Image(); im.decoding = 'async'; im.onload = function () { if (i === cur) draw(cur); }; im.src = name(i); imgs[i] = im; }
    // Progressive preload: first frame, then every 8th, then fill the gaps
    load(0);
    var order = [];
    for (var a = 8; a < n; a += 8) order.push(a);
    for (var b = 1; b < n; b++) if (b % 8) order.push(b);
    (function pump() { var k = 0; while (order.length && k++ < 6) load(order.shift()); if (order.length) setTimeout(pump, 60); })();
    window.ScrollTrigger.create({
      trigger: pin, start: 'top top', end: function () { return '+=' + endDist(); }, pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: function (st) { cur = Math.round(st.progress * (n - 1)); draw(cur); setBeat(beatFor(st.progress)); }
    });
    window.addEventListener('resize', function () { draw(cur); });
    return;
  }

  /* ---- Option B: the SVG scene ---- */
  var world = $('#world'), vanMove = $('#vanMove'), vanBody = $('#vanBody'), door = $('#vanDoor');
  var rims = $$('#van .rim'), lines = $('#speedLines');
  var phone = $('#phoneMock'), notif = $('#notif'), hand = $('#coachHand');


  // Slat mills inside the van
  var mills = $$('.scene__interior .mill').map(function (m) {
    return { slats: SPZ.buildSlats($('.slats', m), 40, 660), dog: $('.dog', m) };
  });
  mills.forEach(function (m) { if (m.dog) SPZ.setDogRate(m.dog, 0.8); });

  gsap.set(vanMove, { x: 1000 });
  gsap.set(interior, { autoAlpha: 0 });
  gsap.set(finale, { autoAlpha: 0 });
  gsap.set(phone, { y: 520 });
  gsap.set(notif, { scale: 0.7, transformOrigin: '50% 0%', opacity: 0 });

  var tl = gsap.timeline({ defaults: { ease: 'none' } });
  // 1) Van rolls in and brakes
  tl.to(vanMove, { x: 0, duration: 2.2, ease: 'power2.out' }, 0)
    .to(rims, { rotation: -1220, duration: 2.2, ease: 'power2.out', transformOrigin: '50% 50%' }, 0)
    .fromTo(lines, { opacity: 0.85 }, { opacity: 0, duration: 1.6, ease: 'power1.in' }, 0)
    .to(vanBody, { rotation: -1.6, transformOrigin: '15% 100%', duration: 0.25, ease: 'power2.out' }, 1.95)
    .to(vanBody, { rotation: 0, duration: 0.5, ease: 'back.out(3)' }, 2.2)
  // 2) Side door slides open
    .to(door, { x: 150, duration: 1.2, ease: 'power2.inOut' }, 2.9)
  // 3) Zoom through the doorway into the van
    .to(world, { scale: 7, svgOrigin: '646 483', duration: 1.7, ease: 'power2.in' }, 4.4)
    .to(interior, { autoAlpha: 1, duration: 0.7 }, 5.3)
    .fromTo(hand, { x: -120 }, { x: 0, duration: 0.9, ease: 'power2.out' }, 5.6)
  // 4) Home: nap + photo update
    .to(finale, { autoAlpha: 1, duration: 0.7 }, 7.7)
    .to(phone, { y: 0, duration: 0.9, ease: 'back.out(1.4)' }, 8.1)
    .to(notif, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 8.7)
    .to({}, { duration: 0.8 }, 9.2);

  var inside = false, speed = 120, lastT = 0, vel = 0, lastRate = 0;
  var st = window.ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: function () { return '+=' + endDist(); },
    pin: true,
    scrub: 0.6,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    animation: tl,
    onToggle: function (self) { html.classList.toggle('scene-active', self.isActive); },
    onUpdate: function (self) {
      var p = self.progress;
      setBeat(beatFor(p));
      vel = Math.abs(self.getVelocity());
      var nowInside = p > 0.5 && p < 0.86;
      if (nowInside && !inside) { inside = true; lastT = 0; requestAnimationFrame(loop); }
      inside = nowInside;
    }
  });

  // Slats + trot follow scroll speed, with smoothing
  function loop(now) {
    if (!inside) return;
    var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0; lastT = now;
    vel *= 0.92;
    var target = 110 + Math.min(vel, 2600) * 0.12;
    speed += (target - speed) * 0.07;
    mills.forEach(function (m) { SPZ.stepSlats(m.slats, speed, dt); });
    var rate = Math.max(0.6, Math.min(2.6, speed / 130));
    if (Math.abs(rate - lastRate) > 0.06) { lastRate = rate; mills.forEach(function (m) { SPZ.setDogRate(m.dog, rate); }); }
    requestAnimationFrame(loop);
  }

  // Keep pin math right after fonts and images settle
  window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
  SPZ.sceneTrigger = st;
})();
