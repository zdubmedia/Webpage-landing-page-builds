/* Speedy PawZ: the lick opener.
   Gold screen > logo pops > red and navy wipes > the pup runs up, boops the lens and licks it >
   a slobber layer covers the screen and drips away to reveal the page.

   Plays once per visit (sessionStorage), never with reduced motion, and bails out
   quickly if the video cannot load or autoplay. The page underneath is complete
   the whole time, so nothing depends on this finishing.
   Switch: data-intro="on|off" on <html>. ?intro=0 skips once, ?intro=1 replays. */
(function () {
  'use strict';
  var html = document.documentElement;
  var root = document.getElementById('lick');
  if (!root || !html.classList.contains('lick-on')) return;

  var video = root.querySelector('.lick__video');
  var skip = root.querySelector('.lick__skip');
  var t0 = performance.now();
  var LOGO_MS = 650;        // logo holds at least this long
  var WIPE_MS = 520;        // red + navy wipes before the footage
  var GIVE_UP_MS = 3200;    // no video by now: go straight to the reveal
  var state = 'logo';       // logo > playing > licked > done
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

  // The lick: slobber wipes up, the footage fades out underneath, then it all drips away.
  function lick(fast) {
    if (state === 'licked' || state === 'done') return;
    state = 'licked';
    root.classList.add('is-licked');
    later(function () { root.classList.add('is-clear'); }, fast ? 200 : 380);
    later(function () { root.classList.add('is-drip'); }, fast ? 320 : 640);
    later(finish, fast ? 1250 : 1850);
  }

  function play() {
    if (state !== 'logo') return;
    var p;
    try { p = video.play(); } catch (e) { lick(true); return; }
    if (p && p.then) {
      p.then(function () {
        if (state !== 'logo') return;
        state = 'playing';
        root.classList.add('is-playing');
        watch();
      }).catch(function () { lick(true); });   // autoplay blocked (for example iOS Low Power Mode)
    } else { state = 'playing'; root.classList.add('is-playing'); watch(); }
  }

  var booped = false;
  function watch() {
    if (state !== 'playing') return;
    var d = video.duration || 3.3, t = video.currentTime;
    if (!booped && t > d - 0.9) { booped = true; root.classList.add('is-boop'); }   // nose bumps the lens
    if (t >= d - 0.24 || video.ended) { lick(false); return; }                        // tongue comes up
    requestAnimationFrame(watch);
  }

  function ready() {
    var wait = Math.max(0, LOGO_MS - (performance.now() - t0));
    later(function () { if (state === 'logo') root.classList.add('is-wipe'); }, wait);
    later(play, wait + WIPE_MS);
  }

  // Pick the lighter file on phones
  var size = window.innerWidth >= 900 ? 1080 : 720;
  video.addEventListener('canplay', ready, { once: true });
  video.addEventListener('error', function () { lick(true); });
  video.addEventListener('ended', function () { lick(false); });
  video.src = 'assets/intro/lick-' + size + '.mp4';
  video.load();
  root.classList.add('is-logo');

  later(function () { if (state === 'logo') lick(true); }, GIVE_UP_MS);
  later(function () { root.classList.add('can-skip'); }, 700);
  later(finish, 9000);   // hard stop, whatever happens

  skip.addEventListener('click', function () { lick(true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state !== 'done') lick(true); });
})();
