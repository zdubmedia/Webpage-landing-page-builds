/* Speedy PawZ landing page: core behavior.
   Reads window.SPZ_CONFIG (site-config.js). No framework. */
(function () {
  'use strict';

  var CFG = window.SPZ_CONFIG || {};
  var html = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var REDUCED = mqReduce.matches || CFG.motion === false;
  if (CFG.motion === false) { html.classList.add('no-motion'); }
  if (REDUCED) { html.classList.remove('motion', 'hero-go'); }
  window.SPZ = window.SPZ || {};
  window.SPZ.reduced = REDUCED;

  function get(path) {
    return path.split('.').reduce(function (o, k) { return (o == null) ? undefined : o[k]; }, CFG);
  }
  function has(v) { return v !== null && v !== undefined && v !== '' && v !== false && !(Array.isArray(v) && !v.length); }
  function store(type) { try { return window[type]; } catch (e) { return null; } }
  var SS = store('sessionStorage');

  /* California "today" as YYYY-MM-DD */
  function caToday(offsetDays) {
    var d = new Date(Date.now() + (offsetDays || 0) * 864e5);
    try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d); }
    catch (e) { return d.toISOString().slice(0, 10); }
  }
  window.SPZ.caToday = caToday;

  /* ---------- Dog illustration (shared) ---------- */
  var PALETTES = {
    a: { coat: '#3B3A48', cream: '#F6EEDE', shade: '#D6CDBC', band: '#F7B334', line: '#121117' },
    b: { coat: '#6E6478', cream: '#F6EEDE', shade: '#D6CDBC', band: '#5BA0D8', line: '#121117' },
    zoom: { coat: '#3B3A48', cream: '#F6EEDE', shade: '#D6CDBC', band: '#F7B334', line: '#121117' },
    senior: { coat: '#8C8698', cream: '#EFE9DE', shade: '#CFC7B8', band: '#5BA0D8', line: '#121117' },
    mini: { coat: '#F6EEDE', cream: '#FFFFFF', shade: '#CFCBD8', band: '#F7B334', line: '#121117' }
  };
  function leg(x, cls, fill, c) {
    return '<g class="leg ' + cls + '"><rect x="' + x + '" y="-74" width="16" height="68" rx="8" fill="' + fill + '" stroke="' + c.line + '" stroke-width="4"/>' +
      '<ellipse cx="' + (x + 4) + '" cy="-5" rx="12" ry="6.5" fill="' + fill + '" stroke="' + c.line + '" stroke-width="4"/></g>';
  }
  function dogMarkup(variant) {
    var c = PALETTES[variant] || PALETTES.a;
    var L = c.line;
    var gait = variant === 'zoom' ? 'gait-zoom' : variant === 'senior' ? 'gait-stroll' : 'gait-trot';
    return '<g class="dog dog-run ' + gait + '">' +
      leg(-60, 'leg-b', c.shade, c) + leg(40, 'leg-a', c.shade, c) +
      '<g class="dog-body">' +
        '<g class="dog-tail"><path d="M84 -100 C 112 -110 122 -142 104 -158 C 92 -168 78 -158 84 -146" fill="none" stroke="' + L + '" stroke-width="26" stroke-linecap="round"/>' +
        '<path d="M84 -100 C 112 -110 122 -142 104 -158 C 92 -168 78 -158 84 -146" fill="none" stroke="' + c.coat + '" stroke-width="18" stroke-linecap="round"/>' +
        '<circle cx="85" cy="-147" r="8" fill="' + c.cream + '"/></g>' +
        '<path d="M-78 -84 C -80 -110 -46 -118 0 -116 C 46 -116 84 -112 88 -88 C 92 -64 74 -56 54 -56 L -46 -56 C -68 -56 -78 -66 -78 -84 Z" fill="' + c.coat + '" stroke="' + L + '" stroke-width="4"/>' +
        '<path d="M-74 -74 C -50 -62 40 -60 86 -74 C 84 -62 72 -58 54 -58 L -46 -58 C -62 -58 -72 -64 -74 -74 Z" fill="' + c.cream + '"/>' +
        '<path d="M-84 -98 C -94 -118 -100 -128 -106 -134 L -76 -154 C -62 -138 -54 -120 -50 -102 Z" fill="' + c.coat + '" stroke="' + L + '" stroke-width="4" stroke-linejoin="round"/>' +
        '<ellipse cx="-74" cy="-82" rx="15" ry="21" fill="' + c.cream + '"/>' +
        '<path d="M-98 -124 L -62 -112 L -88 -90 Z" fill="' + c.band + '" stroke="' + L + '" stroke-width="4" stroke-linejoin="round"/>' +
        '<g transform="translate(-108 -150)">' +
          '<path d="M-4 -14 L 2 -48 L 18 -18 Z" fill="' + c.coat + '" stroke="' + L + '" stroke-width="4" stroke-linejoin="round"/>' +
          '<ellipse cx="0" cy="0" rx="29" ry="25" fill="' + c.coat + '" stroke="' + L + '" stroke-width="4"/>' +
          '<path d="M8 -16 L 20 -50 L 30 -12 Z" fill="' + c.coat + '" stroke="' + L + '" stroke-width="4" stroke-linejoin="round"/>' +
          '<path d="M13 -18 L 20 -38 L 25 -16 Z" fill="' + c.cream + '"/>' +
          '<path d="M-27 6 C -24 -10 -6 -14 4 -4 C 12 6 8 22 -8 25 C -20 26 -27 16 -27 6 Z" fill="' + c.cream + '"/>' +
          '<path d="M-18 2 C -36 2 -52 8 -56 16 C -54 27 -36 29 -14 25 Z" fill="' + c.cream + '" stroke="' + L + '" stroke-width="4" stroke-linejoin="round"/>' +
          '<ellipse cx="-55" cy="15" rx="6" ry="5.5" fill="' + L + '"/>' +
          '<path d="M-17 -5 q 5 -6 10 0" fill="none" stroke="' + L + '" stroke-width="4" stroke-linecap="round"/>' +
          '<ellipse cx="-10" cy="-14" rx="4.5" ry="2.6" fill="' + c.cream + '"/>' +
          '<path d="M-40 27 q 2 14 9 14 q 7 0 6 -14 z" fill="#E5575B" stroke="' + L + '" stroke-width="3" stroke-linejoin="round"/>' +
          '<path d="M-46 25 q 9 6 18 -1" fill="none" stroke="' + L + '" stroke-width="3.5" stroke-linecap="round"/>' +
        '</g>' +
      '</g>' +
      leg(-46, 'leg-a', c.cream, c) + leg(54, 'leg-b', c.cream, c) +
    '</g>';
  }
  window.SPZ.dogMarkup = dogMarkup;
  $$('[data-dog]').forEach(function (g) {
    var v = g.getAttribute('data-variant') || (g.getAttribute('data-dog') === 'mini' ? 'mini' : 'a');
    if (g.getAttribute('data-dog') === 'mini') {
      g.innerHTML = '<g transform="translate(36 39) scale(.15)">' + dogMarkup('mini') + '</g>';
    } else {
      g.innerHTML = dogMarkup(v);
    }
  });
  $$('[data-variant="senior"] .dog').forEach(function (d) { requestAnimationFrame(function () { window.SPZ.setDogRate(d, 0.45); }); });

  /* ---------- Slat mills (shared animator) ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function buildSlats(g, x0, x1) {
    var gap = 18;
    for (var x = x0 - gap; x < x1 + gap; x += gap) {
      var r = document.createElementNS(SVGNS, 'rect');
      r.setAttribute('x', x); r.setAttribute('y', -74); r.setAttribute('width', 8); r.setAttribute('height', 22); r.setAttribute('rx', 2);
      g.appendChild(r);
    }
    return { g: g, gap: gap, off: 0 };
  }
  window.SPZ.buildSlats = buildSlats;
  window.SPZ.stepSlats = function (s, speed, dt) {
    s.off = (s.off + speed * dt) % s.gap;
    s.g.setAttribute('transform', 'translate(' + (-s.off).toFixed(2) + ' 0)');
  };
  window.SPZ.setDogRate = function (root, rate) {
    if (!root || !root.getAnimations) return;
    root.getAnimations({ subtree: true }).forEach(function (a) {
      if (a.updatePlaybackRate) a.updatePlaybackRate(rate); else a.playbackRate = rate;
    });
  };

  /* ---------- Config: prices, promo, FAQ, labels ---------- */
  function applyConfig() {
    var biz = CFG.business || {};
    $$('input[name="page_variant"]').forEach(function (i) { i.value = CFG.pageVariant || 'A'; });

    // Prices
    var prices = CFG.prices || {};
    var missingPrice = false;
    $$('[data-price]').forEach(function (el) {
      var v = prices[el.getAttribute('data-price')];
      if (has(v)) { el.textContent = v; el.hidden = false; } else { missingPrice = true; }
    });
    var fb = $('#priceFallback');
    if (fb) fb.hidden = !missingPrice;

    // Promo
    var promo = CFG.promo || {};
    var card = $('#promoCard');
    if (card) {
      var live = promo.active === true && has(promo.endDate) && caToday() <= promo.endDate;
      if (live) {
        card.hidden = false;
        if (has(promo.label)) $('.promo__label', card).textContent = promo.label;
        if (has(promo.details)) $('.promo__details', card).textContent = promo.details;
        var end = new Date(promo.endDate + 'T12:00:00');
        $('.promo__ends', card).textContent = 'Ends ' + end.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + '.';
      }
    }

    // Inline fills
    $$('[data-fill]').forEach(function (el) {
      var v = CFG[el.getAttribute('data-fill')];
      if (has(v)) el.textContent = String(v).trim() + ' ';
    });
    // Unconfirmed FAQ answers
    $$('[data-faq]').forEach(function (el) {
      var v = (CFG.faq || {})[el.getAttribute('data-faq')];
      el.textContent = has(v) ? v : (el.getAttribute('data-fallback') || "Great question! Emelyn will go over this with you when she reaches out.");
    });

    // Meet-and-greet label
    if (CFG.freeMeetAndGreet === true) {
      $$('.tab-call-label').forEach(function (e) { e.textContent = 'Free meet-and-greet'; });
      $$('.call-title-text').forEach(function (e) { e.textContent = 'A free meet-and-greet with Emelyn'; });
    }

    // Services list
    var list = $('#servicesList');
    if (list && Array.isArray(CFG.services) && CFG.services.length) {
      list.innerHTML = '';
      CFG.services.forEach(function (s) {
        var label = typeof s === 'string' ? s : s.label;
        var l = document.createElement('label'); l.className = 'check';
        var i = document.createElement('input'); i.type = 'checkbox'; i.value = label;
        var sp = document.createElement('span'); sp.textContent = label;
        if (s && s.confirmed === false) sp.setAttribute('data-confirm', 'Service: ' + label);
        l.appendChild(i); l.appendChild(sp); list.appendChild(l);
      });
    }
    // Time windows
    if (Array.isArray(CFG.timeWindows) && CFG.timeWindows.length) {
      $$('[data-windows]').forEach(function (wrap) {
        var name = wrap.getAttribute('data-windows');
        wrap.innerHTML = '';
        CFG.timeWindows.forEach(function (w) {
          var label = typeof w === 'string' ? w : w.label;
          var l = document.createElement('label'); l.className = 'chip';
          var i = document.createElement('input'); i.type = 'radio'; i.name = name; i.value = label + (w.hint ? ' (' + w.hint + ')' : '');
          var sp = document.createElement('span'); sp.textContent = label;
          if (w.hint) { var h = document.createElement('span'); h.className = 'chip__hint'; h.textContent = w.hint; sp.appendChild(h); }
          l.appendChild(i); l.appendChild(sp); wrap.appendChild(l);
        });
      });
    }

    // Older dog photo
    if (has(CFG.olderDogPhoto)) {
      var m = $('#olderDogMedia');
      if (m) { m.classList.remove('fit-card__media--illus'); m.innerHTML = ''; var im = new Image(); im.src = CFG.olderDogPhoto; im.alt = 'An older dog walking gently on the slat mill'; im.loading = 'lazy'; im.width = 437; im.height = 497; m.appendChild(im); }
    }

    // Year
    $$('.js-year').forEach(function (e) { e.textContent = caToday().slice(0, 4); });
  }

  /* ---------- VSL ---------- */
  function setupVSL() {
    var v = CFG.vsl || {};
    var sec = $('#vsl');
    if (!sec || !has(v.src)) return;
    sec.hidden = false;
    var video = $('.vsl__video', sec), frame = $('.vsl__frame', sec), btn = $('.vsl__play', sec);
    if (v.poster) video.poster = v.poster;
    video.src = v.src;
    if (has(v.captions)) {
      var t = document.createElement('track'); t.kind = 'captions'; t.srclang = 'en'; t.label = 'English'; t.src = v.captions; t["default"] = true; video.appendChild(t);
    }
    video.addEventListener('loadedmetadata', function () {
      frame.setAttribute('data-orient', video.videoHeight > video.videoWidth ? 'portrait' : 'landscape');
    });
    if (!REDUCED && 'IntersectionObserver' in window) {
      video.preload = 'metadata';
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (sec.classList.contains('is-playing')) return;
          if (e.isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); } else { video.pause(); }
        });
      }, { threshold: .4 }).observe(frame);
    }
    btn.addEventListener('click', function () {
      sec.classList.add('is-playing');
      video.muted = false; video.loop = false; video.controls = true; video.currentTime = 0;
      var p = video.play(); if (p && p.catch) p.catch(function () {});
    });
  }

  /* ---------- UTM / source ---------- */
  function captureSource() {
    try {
      var q = new URLSearchParams(location.search);
      var parts = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].map(function (k) { return q.get(k); }).filter(Boolean);
      if (!parts.length && q.get('fbclid')) parts = ['facebook (fbclid)'];
      if (parts.length && SS) SS.setItem('spz_source', parts.join(' / '));
      var src = (SS && SS.getItem('spz_source')) || (document.referrer ? 'referrer: ' + document.referrer.split('/')[2] : 'direct');
      window.SPZ.source = src;
      $$('input[name="source"]').forEach(function (i) { i.value = src; });
    } catch (e) { /* ignore */ }
  }

  /* ---------- Review mode ---------- */
  function reviewMode() {
    var q = new URLSearchParams(location.search);
    try {
      if (q.get('review') === '1' && SS) SS.setItem('spz_review', '1');
      if (q.get('review') === '0' && SS) SS.removeItem('spz_review');
    } catch (e) {}
    var on = q.get('review') === '1' || (SS && SS.getItem('spz_review') === '1');
    if (!on) return;
    html.classList.add('review-mode');

    // Preview the promo card even when it is off
    var pc = $('#promoCard');
    if (pc && pc.hidden) { pc.hidden = false; pc.classList.add('plan--ghost'); }

    var items = [];
    $$('[data-confirm]').forEach(function (el) {
      var key = el.getAttribute('data-confirm-key');
      if (key && has(get(key))) return;
      var text = el.getAttribute('data-confirm');
      var note = document.createElement('span');
      note.className = 'confirm-note';
      note.textContent = ' ' + text;
      if (el.tagName === 'BUTTON') el.parentNode.insertBefore(note, el.nextSibling);
      else if (el.matches('li, .card, .meet__story, .reviews')) el.insertBefore(note, el.firstChild);
      else el.appendChild(note);
      items.push({ text: text, note: note });
    });
    // Config-only items with no spot on the page
    if (!has(CFG.calendarEmbed)) items.push({ text: 'Booking platform for the calendar embed (config.calendarEmbed)' });
    if (!has((CFG.vsl || {}).src)) items.push({ text: 'Intro video (assets/video/intro.mp4, config.vsl.src)' });
    if (CFG.freeMeetAndGreet == null) items.push({ text: 'Is the meet-and-greet free? (config.freeMeetAndGreet)' });
    items.push({ text: 'AI footage (opener + How it works films) shows an AI dog modeled on a client dog, and the opener and Lap 2 show an AI Emelyn. Get her OK. Lap 2 clip still needs an export without the caption text' });
    items.push({ text: 'Owner permission for every client dog photo' });
    items.push({ text: 'Privacy policy legal review (privacy.html)' });

    var panel = document.createElement('details');
    panel.className = 'review-panel'; panel.open = window.innerWidth > 700;
    var sum = document.createElement('summary'); sum.textContent = 'Review mode: ' + items.length + ' open items';
    var ol = document.createElement('ol');
    items.forEach(function (it) {
      var li = document.createElement('li');
      if (it.note) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = it.text;
        b.addEventListener('click', function () {
          var host = it.note.closest('[hidden]'); if (host) host.hidden = false;
          var qa = it.note.closest('details'); if (qa) qa.open = true;
          var step = it.note.closest('.step'); if (step && window.SPZ.showStep) window.SPZ.showStep(+step.getAttribute('data-step'));
          it.note.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
          it.note.classList.remove('is-flash'); void it.note.offsetWidth; it.note.classList.add('is-flash');
        });
        li.appendChild(b);
      } else { li.textContent = it.text; }
      ol.appendChild(li);
    });
    var off = document.createElement('a'); off.href = '?review=0'; off.className = 'rp-off'; off.textContent = 'Turn off review mode';
    panel.appendChild(sum); panel.appendChild(ol); panel.appendChild(off);
    document.body.appendChild(panel);
  }

  /* ---------- Reveals + paw trails ---------- */
  function reveals() {
    var els = $$('.reveal, .paw-trail');
    if (!('IntersectionObserver' in window) || REDUCED) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    // small stagger for siblings
    $$('.cards3, .stats, .trophies, .flips, .plans, .faq__list').forEach(function (g) {
      $$('.reveal', g).forEach(function (e, i) { e.style.setProperty('--d', (Math.min(i, 5) * 0.08) + 's'); });
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Race track + sticky CTA ---------- */
  function track() {
    var t = $('.race-track');
    var ticking = false, idle;
    function update() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      t.style.setProperty('--p', p.toFixed(4));
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
      if (!REDUCED) { t.classList.add('is-running'); clearTimeout(idle); idle = setTimeout(function () { t.classList.remove('is-running'); }, 160); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Netlify's free plan adds its own "Powered by Netlify" badge in the bottom-right corner.
    // When it is there, the CSS (.host-badge) keeps our own buttons out from under it.
    function hostBadge() { if (document.getElementById('nl-badge-frame')) { html.classList.add('host-badge'); return true; } return false; }
    if (!hostBadge() && 'MutationObserver' in window) {
      var badgeWatch = new MutationObserver(function () { if (hostBadge()) badgeWatch.disconnect(); });
      badgeWatch.observe(document.body, { childList: true });
      setTimeout(function () { badgeWatch.disconnect(); }, 20000);
    }

    var sticky = $('.sticky-cta'), heroIn = true, bookIn = false;
    function sync() {
      var show = !heroIn && !bookIn;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      $('a', sticky).tabIndex = show ? 0 : -1;
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { heroIn = es[0].isIntersecting; sync(); }, { threshold: 0.02 }).observe($('.hero'));
      new IntersectionObserver(function (es) {
        bookIn = es[0].isIntersecting; sync();
        html.classList.toggle('at-finish', bookIn);
      }, { threshold: 0.05 }).observe($('#book'));
    }
  }

  /* ---------- Flip cards ---------- */
  function flips() {
    $$('.flip').forEach(function (b) {
      b.addEventListener('click', function () {
        var on = !b.classList.contains('is-flipped');
        b.classList.toggle('is-flipped', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  }

  /* ---------- Counters ---------- */
  function counters() {
    var stats = $$('.stat');
    function run(stat) {
      var num = $('.stat__num', stat), needle = $('.stat__needle', stat), arc = $('.stat__arc', stat);
      if (!num) return;
      var target = +num.getAttribute('data-count'), end = +(needle && needle.getAttribute('data-end')) || 0, rev = needle && needle.getAttribute('data-rev');
      if (REDUCED) { num.textContent = target; if (needle) needle.style.transform = 'rotate(' + (-90 + end * 1.8) + 'deg)'; if (arc) arc.setAttribute('stroke-dasharray', end + ' 100'); return; }
      var t0 = performance.now(), dur = 1500;
      (function frame(now) {
        var k = Math.min(1, (now - t0) / dur);
        var e = 1 - Math.pow(1 - k, 3);
        num.textContent = Math.round(target * e);
        var a = rev ? Math.sin(Math.PI * Math.min(1, k * 1.15)) * 70 : end * (k < .6 ? (e / .78) * 1.12 : e);
        a = rev ? a : Math.min(end * 1.12, a);
        if (needle) needle.style.transform = 'rotate(' + (-90 + a * 1.8) + 'deg)';
        if (arc) arc.setAttribute('stroke-dasharray', Math.max(0, a).toFixed(1) + ' 100');
        if (k < 1) requestAnimationFrame(frame);
        else { num.textContent = target; if (needle) needle.style.transform = 'rotate(' + (-90 + end * 1.8) + 'deg)'; if (arc) arc.setAttribute('stroke-dasharray', end + ' 100'); }
      })(t0);
    }
    if (!('IntersectionObserver' in window)) { stats.forEach(run); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    stats.forEach(function (s) { if ($('.stat__num', s)) { if (!REDUCED) $('.stat__num', s).textContent = '0'; io.observe(s); } });
  }

  /* ---------- Pace dial ---------- */
  function paceDial() {
    var dial = $('#paceDial');
    if (!dial) return;
    var svg = $('.dial__svg', dial), needle = $('.dial__needle', dial), arc = $('.dial__arc', dial), label = $('.dial__label', dial);
    var ticks = $('.dial__ticks', dial), stops = $$('.dial__stops button');
    for (var i = 0; i <= 10; i++) {
      var a = Math.PI * (1 - i / 10), r1 = 96, r2 = i % 5 === 0 ? 108 : 104;
      var ln = document.createElementNS(SVGNS, 'line');
      ln.setAttribute('x1', 160 + r1 * Math.cos(a)); ln.setAttribute('y1', 170 - r1 * Math.sin(a));
      ln.setAttribute('x2', 160 + r2 * Math.cos(a)); ln.setAttribute('y2', 170 - r2 * Math.sin(a));
      ticks.appendChild(ln);
    }
    var mill = $('.mini-mill'), slats = buildSlats($('.slats', mill), 40, 460);
    var dog = $('.mill-dog .dog', mill);
    var value = 45, speed = 0, gait = '', lastZone = -1;
    var card = dial.closest('.dial-card') || dial;
    var LABELS = [['Sniff and stroll', 'gait-stroll'], ['Happy trot', 'gait-trot'], ['Full zoomies', 'gait-zoom']];
    // a little burst of gold dots when the needle hits Full zoomies
    function burst() {
      for (var n = 0; n < 9; n++) {
        var s = document.createElement('i'), ang = Math.PI * (0.12 + 0.76 * n / 8), dist = 54 + (n % 3) * 20;
        s.className = 'dial__spark';
        s.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(0) + 'px');
        s.style.setProperty('--dy', (-Math.sin(ang) * dist).toFixed(0) + 'px');
        s.style.animationDelay = (n % 3) * 40 + 'ms';
        dial.appendChild(s);
        (function (el) { setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 900); })(s);
      }
    }
    function zone(v) { return v < 34 ? 0 : v < 67 ? 1 : 2; }
    function set(v) {
      value = Math.max(0, Math.min(100, Math.round(v)));
      var z = zone(value);
      needle.setAttribute('transform', 'rotate(' + (-90 + value * 1.8) + ' 160 170)');
      arc.setAttribute('stroke-dasharray', value + ' 100');
      label.textContent = LABELS[z][0];
      dial.setAttribute('aria-valuenow', value);
      dial.setAttribute('aria-valuetext', LABELS[z][0]);
      stops.forEach(function (b, i) { b.setAttribute('aria-pressed', i === z ? 'true' : 'false'); });
      if (z !== lastZone) {
        card.setAttribute('data-zone', z);
        if (lastZone !== -1 && !REDUCED) {
          label.classList.remove('is-pop'); void label.offsetWidth; label.classList.add('is-pop');
          if (z === 2) burst();
        }
        lastZone = z;
      }
      if (dog && gait !== LABELS[z][1]) {
        dog.classList.remove('gait-stroll', 'gait-trot', 'gait-zoom');
        dog.classList.add(LABELS[z][1]); gait = LABELS[z][1];
      }
      if (dog) window.SPZ.setDogRate(dog, REDUCED ? 0 : 0.55 + value / 100 * 1.4);
    }
    function fromPointer(e) {
      var r = svg.getBoundingClientRect();
      var sx = 320 / r.width, x = (e.clientX - r.left) * sx - 160, y = 170 - (e.clientY - r.top) * sx;
      var ang = Math.atan2(Math.max(y, -40), x); // 0 = right, PI = left
      if (y < 0) ang = x < 0 ? Math.PI : 0;
      set((1 - ang / Math.PI) * 100);
    }
    var dragging = false;
    dial.addEventListener('pointerdown', function (e) { dragging = true; try { dial.setPointerCapture(e.pointerId); } catch (x) {} fromPointer(e); });
    dial.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { dial.addEventListener(t, function () { dragging = false; }); });
    dial.addEventListener('keydown', function (e) {
      var k = e.key, step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 20, PageDown: -20 }[k];
      if (step) { set(value + step); e.preventDefault(); }
      else if (k === 'Home') { set(0); e.preventDefault(); }
      else if (k === 'End') { set(100); e.preventDefault(); }
    });
    stops.forEach(function (b) { b.addEventListener('click', function () { set(+b.getAttribute('data-pace')); }); });
    set(45);

    if (REDUCED) { window.SPZ.stepSlats(slats, 0, 0); return; }

    /* Real footage: the trot clip from the How it works section, looped, playing faster or slower with the dial.
       Frames 18 to 57 loop cleanly (same point in the stride); the last few blend into the first few. */
    var film = $('.dial__film canvas', card);
    if (film) (function () {
      var ctx = film.getContext('2d'), A = 18, B = 57, LEN = B - A, FADE = 3, imgs = [], got = 0, asked = false, pos = 0, on = false, seen = false, lastT = 0, drawnKey = '';
      function src(k) { return 'assets/scene/seq/trot/0' + (k < 10 ? '0' : '') + k + '.webp'; }
      function ask() {
        if (asked) return; asked = true;
        for (var k = A - FADE; k < B; k++) (function (k) {
          var im = new Image();
          im.onload = function () { im._ok = true; if (++got === LEN + FADE) { on = true; card.classList.add('has-film'); if (seen) requestAnimationFrame(step); } };
          im.src = src(k); imgs[k] = im;
        })(k);
      }
      function step(now) {
        if (!on || !seen) return;
        var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0; lastT = now;
        pos = (pos + dt * 12 * (0.45 + value / 100 * 2.35)) % LEN;           // 12 frames a second is the clip's own slow-motion speed
        var k = Math.floor(pos), key = k + '', tail = k >= LEN - FADE ? (k - (LEN - FADE) + 1) / (FADE + 1) : 0;
        if (key !== drawnKey) {
          drawnKey = key;
          ctx.globalAlpha = 1; ctx.drawImage(imgs[A + k], 0, 0, 640, 472);
          if (tail) { ctx.globalAlpha = tail; ctx.drawImage(imgs[A + k - LEN], 0, 0, 640, 472); ctx.globalAlpha = 1; }   // blend into the frames just before the loop start
        }
        requestAnimationFrame(step);
      }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { if (es[0].isIntersecting) ask(); }, { rootMargin: '120% 0px' }).observe(card);
        new IntersectionObserver(function (es) { seen = es[0].isIntersecting; if (seen && on) { lastT = 0; requestAnimationFrame(step); } }).observe(card);
      }
    })();

    var visible = false, last = 0;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) { last = 0; requestAnimationFrame(loop); } }).observe(mill);
    function loop(now) {
      if (!visible) return;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      var target = 30 + value * 3.4;
      speed += (target - speed) * 0.08;
      window.SPZ.stepSlats(slats, speed, dt);
      requestAnimationFrame(loop);
    }
  }

  /* ---------- Short clips inside cards (older dog): play once when the card is on screen ----------
     If the phone will not start a video on its own (Low Power Mode), the still picture simply stays. No play button. */
  function cardClips() {
    if (REDUCED || !('IntersectionObserver' in window)) return;
    $$('video[data-src]').forEach(function (v) {
      var done = false;
      new IntersectionObserver(function (es, io) {
        if (!es[0].isIntersecting || done) return;
        done = true; io.disconnect();
        v.muted = true; v.src = v.getAttribute('data-src');
        var p = v.play(); if (p && p.catch) p.catch(function () { v.removeAttribute('src'); v.load(); });
      }, { threshold: 0.6 }).observe(v);
    });
  }

  /* ---------- The PawZ Reel (section removed; kept in case it comes back) ---------- */
  function reel() {
    var root = $('#pawzReel');
    if (!root) return;
    var slides = $$('.reel__slide', root), n = slides.length, disc = $('.reel__disc', root);
    var count = $('.reel__n', root), soundBtn = $('.reel__sound', root), frame = $('.reel__frame', root);
    var total = $('.reel__total', root); if (total) total.textContent = n;
    var idx = 0, rot = 0, step = 360 / n, touched = false, inView = false, timer = null, audio = null, soundOn = false;
    slides.forEach(function (s, i) {
      var img = $('img', s), srcEl = $('source[type="image/webp"]', s);
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'reel__win'; b.tabIndex = -1; b.setAttribute('aria-hidden', 'true');
      var a = i * step * Math.PI / 180, r = 37;
      b.style.left = (50 + r * Math.sin(a) - 10) + '%';
      b.style.top = (50 - r * Math.cos(a) - 10) + '%';
      var t = new Image(); t.alt = ''; t.loading = 'lazy'; t.decoding = 'async';
      t.src = srcEl ? srcEl.getAttribute('srcset').split(' ')[0] : img.getAttribute('src');
      b.appendChild(t);
      b.addEventListener('click', function () { interact(); go(i); });
      disc.appendChild(b);
    });
    function click() {
      if (!soundOn || !audio) return;
      try {
        var t = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(1800, t); o.frequency.exponentialRampToValueAtTime(400, t + 0.04);
        g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
        o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + 0.07);
      } catch (e) {}
    }
    function go(i, dir) {
      var next = ((i % n) + n) % n;
      var delta = next - idx;
      if (dir) delta = dir;
      else { if (delta > n / 2) delta -= n; if (delta < -n / 2) delta += n; }
      rot -= delta * step;
      idx = next;
      disc.style.transform = 'rotate(' + rot + 'deg)';
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === idx); s.setAttribute('aria-hidden', k === idx ? 'false' : 'true'); });
      count.textContent = idx + 1;
      frame.classList.toggle('is-wide', slides[idx].hasAttribute('data-wide'));
      click();
    }
    function interact() { touched = true; stop(); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() { if (!timer && !touched && inView && !REDUCED) timer = setInterval(function () { go(idx + 1, 1); }, 3800); }
    $('.reel__prev', root).addEventListener('click', function () { interact(); go(idx - 1, -1); });
    $('.reel__next', root).addEventListener('click', function () { interact(); go(idx + 1, 1); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { interact(); go(idx + 1, 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { interact(); go(idx - 1, -1); e.preventDefault(); }
    });
    var sx = null;
    [$('.reel__frame', root), $('.reel__disc-wrap', root)].forEach(function (el) {
      el.addEventListener('pointerdown', function (e) { sx = e.clientX; });
      el.addEventListener('pointerup', function (e) {
        if (sx === null) return; var dx = e.clientX - sx; sx = null;
        if (Math.abs(dx) > 40) { interact(); go(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); }
      });
    });
    root.addEventListener('pointerdown', interact);
    soundBtn.addEventListener('click', function () {
      soundOn = !soundOn;
      if (soundOn && !audio) { try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { soundOn = false; } }
      soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      $('use', soundBtn).setAttribute('href', soundOn ? '#i-sound' : '#i-mute');
      $('span', soundBtn).textContent = soundOn ? 'Sound on' : 'Sound off';
      click();
    });
    slides.forEach(function (s, k) { s.setAttribute('aria-hidden', k === 0 ? 'false' : 'true'); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (inView) start(); else stop(); }, { threshold: 0.35 }).observe(root);
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  }

  /* ---------- Easter egg: 3 taps on the hero logo ---------- */
  function easterEgg() {
    var logo = $('#heroLogo'), z = $('.zoomer');
    if (!logo || !z) return;
    var taps = 0, t;
    logo.addEventListener('click', function () {
      taps++; clearTimeout(t); t = setTimeout(function () { taps = 0; }, 900);
      if (taps >= 3 && !REDUCED) {
        taps = 0; z.classList.remove('is-on'); void z.offsetWidth; z.classList.add('is-on');
        var dog = $('.dog', z); if (dog) window.SPZ.setDogRate(dog, 2.4);
      }
    });
    z.addEventListener('animationend', function () { z.classList.remove('is-on'); });
  }

  /* ---------- Magnetic buttons (desktop only) ---------- */
  function magnetic() {
    if (REDUCED || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('a.btn--red').forEach(function (b) {
      b.classList.add('is-magnet');
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width, dy = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = 'translate(' + (dx * 10).toFixed(1) + 'px,' + (dy * 8).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
      b.addEventListener('pointerdown', function () { b.style.transform = ''; });
    });
  }

  /* ---------- CTA: land on #book and focus it ---------- */
  function ctas() {
    $$('a[href="#book"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var book = $('#book'); if (!book) return;
        e.preventDefault();
        book.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
        if (history.replaceState) history.replaceState(null, '', '#book');
        setTimeout(function () { book.focus({ preventScroll: true }); }, REDUCED ? 0 : 700);
        if (window.fbq) window.fbq('trackCustom', 'CTAClick', { location: a.getAttribute('data-cta') || '' });
      });
    });
  }

  /* ---------- Meta pixel (off unless an ID is set) ---------- */
  function pixel() {
    var id = CFG.metaPixelId;
    if (!has(id)) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', String(id));
    window.fbq('track', 'PageView');
    if (document.body.classList.contains('page-ty')) window.fbq('track', 'Lead');
  }
  window.SPZ.pixel = pixel;

  // Run
  applyConfig();
  setupVSL();
  captureSource();
  if (document.body.classList.contains('page-ty') || document.body.classList.contains('page-privacy')) { pixel(); return; }
  reviewMode();
  reveals();
  track();
  flips();
  counters();
  paceDial();
  cardClips();
  reel();
  easterEgg();
  magnetic();
  ctas();
  pixel();
})();
