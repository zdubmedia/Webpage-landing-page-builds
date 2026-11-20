/* Speedy PawZ: the lick opener.
   Gold screen with the logo > the pup hops out of the van and runs up until his nose is on the lens >
   one big lick, the tongue sweeping up from the bottom of the screen > red, navy and gold curves follow the tongue
   up the screen and roll away to reveal the page.

   Plays on every fresh page load (not when someone comes back with the Back button), never with reduced motion.
   The page underneath is complete the whole time, so nothing depends on this finishing.

   Phones that refuse to start videos on their own (iPhone Low Power Mode) get the same clip as a set of still
   frames played on a canvas (assets/intro/seq), so the pup always shows up.

   Switch: data-intro="on|once|off" on <html> (once = one time per visit). ?intro=0 skips once, ?intro=1 forces it. */
(function () {
  'use strict';
  var html = document.documentElement;
  var root = document.getElementById('lick');
  if (!root || !html.classList.contains('lick-on')) return;
  var SPZ = window.SPZ = window.SPZ || {};

  var video = root.querySelector('.lick__video');
  var skip = root.querySelector('.lick__skip');
  var t0 = performance.now();
  var LOGO_MS = 700;        // logo holds at least this long
  var GIVE_UP_MS = 4200;    // no footage by now: go straight to the roll-up and reveal
  var BOOP_AT = 1.55;       // seconds into the clip: nose bumps the lens (little screen shake)
  var LICK_AT = 1.98;       // seconds into the clip: the tongue comes up from the bottom, the color curves follow it
  var SEQ = { n: 38, fps: 15, w: 540, h: 680, dir: 'assets/intro/seq2/' };
  var state = 'logo';       // logo > playing > hit > done
  var timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }

  function finish() {
    if (state === 'done') return;
    state = 'done';
    timers.forEach(clearTimeout);
    try { video.pause(); video.removeAttribute('src'); video.load(); } catch (e) {}
    html.classList.remove('lick-on');
    html.classList.add('hero-in');
    root.hidden = true;
    try { sessionStorage.setItem('spz_intro', '1'); } catch (e) {}
    try { window.dispatchEvent(new Event('spz:intro-done')); } catch (e) {}
  }

  // The lick: red, navy and gold curves chase the tongue up the screen, then roll off the top to show the page.
  var cleared = false;
  function hit() {
    if (state === 'hit' || state === 'done') return;
    state = 'hit';
    root.classList.add('is-hit');                                                             // the curves start rising
    later(function () { cleared = true; root.classList.add('is-clear'); }, 520);              // screen is covered: footage gone underneath
    later(function () { html.classList.add('hero-in'); }, 860);                               // page shows as the last curve leaves
    later(finish, 1560);
  }

  /* ---- Footage: the video, or the same clip as frames where autoplay is refused ---- */
  var booped = false;
  function beats(t, d) {
    if (!booped && t > BOOP_AT) { booped = true; root.classList.add('is-boop'); }
    if (t >= Math.min(LICK_AT, d - 0.05)) { hit(); return true; }
    return false;
  }
  function showFootage() { state = 'playing'; root.classList.add('is-playing'); }
  function afterLogo(fn) { later(fn, Math.max(0, LOGO_MS - (performance.now() - t0))); }

  function watchVideo() {
    if (state !== 'playing') return;
    if (beats(video.currentTime, video.duration || 2.6) || video.ended) { hit(); return; }
    requestAnimationFrame(watchVideo);
  }
  function playVideo() {
    if (state !== 'logo') return;
    var p;
    try { video.currentTime = 0; p = video.play(); } catch (e) { useFrames(); return; }
    if (p && p.then) p.then(function () { if (state === 'logo') { showFootage(); watchVideo(); } }, useFrames);
    else { showFootage(); watchVideo(); }
  }

  var framesOn = false;
  function useFrames() {
    if (framesOn || state !== 'logo') return;
    framesOn = true;
    SPZ.noAutoplay = true;                       // js/scene.js reads this and uses frames too
    try { video.pause(); } catch (e) {}
    var c = document.createElement('canvas');
    c.width = SEQ.w; c.height = SEQ.h; c.className = video.className; c.setAttribute('aria-hidden', 'true');
    video.parentNode.insertBefore(c, video);
    video.style.display = 'none';
    var ctx = c.getContext('2d'), imgs = [], loaded = 0;
    var START_AT = 14;   // start once about a second of frames has arrived; the rest keep loading while it plays
    function name(i) { return SEQ.dir + (i < 10 ? '00' : '0') + i + '.webp'; }
    function start() {
      if (state !== 'logo') return;
      showFootage();
      var began = performance.now(), dur = SEQ.n / SEQ.fps, last = -1;
      (function tick(now) {
        if (cleared || state === 'done') return;
        var t = Math.min(dur, ((now || performance.now()) - began) / 1000), i = Math.min(SEQ.n - 1, Math.floor(t * SEQ.fps));
        if (i !== last && imgs[i] && imgs[i]._ok) { ctx.drawImage(imgs[i], 0, 0, SEQ.w, SEQ.h); last = i; }
        if (state === 'playing') beats(t, dur);       // the lick keeps playing under the curves until they cover it
        if (t < dur) requestAnimationFrame(tick);
      })();
    }
    for (var i = 0; i < SEQ.n; i++) (function (i) {
      var im = new Image();
      im.onload = function () {
        im._ok = true;
        if (i === 0) ctx.drawImage(im, 0, 0, SEQ.w, SEQ.h);
        if (++loaded === START_AT) afterLogo(start);
      };
      im.onerror = function () { if (++loaded === START_AT) afterLogo(start); };
      im.src = name(i);
      imgs[i] = im;
    })(i);
  }

  // Ask the browser straight away whether it will play. If it will, hold the clip at the start until the logo has had its moment.
  var size = window.innerWidth >= 900 ? 1080 : 720;
  video.addEventListener('error', useFrames);
  video.src = 'assets/intro/lick2-' + size + '.mp4';
  var probe;
  try { probe = video.play(); } catch (e) { probe = null; useFrames(); }
  if (probe && probe.then) {
    probe.then(function () {
      if (state !== 'logo' || framesOn) return;
      video.pause();
      afterLogo(playVideo);
    }, useFrames);
  } else if (probe !== null) {
    video.addEventListener('canplay', function () { afterLogo(playVideo); }, { once: true });
  }
  root.classList.add('is-logo');

  later(function () { if (state === 'logo') hit(); }, GIVE_UP_MS);
  later(function () { root.classList.add('can-skip'); }, 700);
  later(finish, 9500);   // hard stop, whatever happens

  skip.addEventListener('click', hit);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state !== 'done') hit(); });
})();
